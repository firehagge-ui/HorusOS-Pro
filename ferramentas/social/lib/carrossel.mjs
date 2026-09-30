// =============================================================================
// Carrossel: o Mídia decide o conteúdo (JSON), este arquivo monta e renderiza com
// a identidade travada da marca. O modelo nunca escreve HTML: não tem como a cor
// escorregar no slide 5 nem a fonte cair no 7.
//
// Entrada (um post):
//   { titulo, slides: [ { layout, fundo?, titulo?, texto?, enfase?, desenho?, itens?, numero?,
//                         buscas?, fonte?, botao? } ] }
//   layout: capa-olho | capa-num | capa-busca | grande | solo | busca | destaque | lista | numero | citacao | cta
//   fundo:  void | claro | painel | eletrico   (se faltar, o rodízio decide)
//   enfase: trecho do título pintado na cor da marca
//   desenho: { tipo: 'sublinha' | 'sublinha2', trecho }  (acento desenhado da biblioteca da marca)
//
// Portão binário (sem opinião): validar() devolve os vetos que o código consegue medir.
// =============================================================================
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { RAIZ_REPO } from './marca.mjs';

const FUNDOS = ['void', 'claro', 'painel', 'eletrico'];
const CLASSE_FUNDO = { void: '', claro: 'claro', painel: 'painel', eletrico: 'eletrico' };
const LAYOUTS = ['capa-olho', 'capa-num', 'capa-busca', 'grande', 'solo', 'busca', 'destaque', 'lista', 'numero', 'citacao', 'cta'];

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const palavras = (s = '') => String(s).split(/\s+/).filter(Boolean).length;

/** Os pisos que o código mede. Devolve lista de vetos (vazia = passou). */
export function validar(post) {
  const vetos = [];
  const s = post?.slides || [];
  if (s.length < 5 || s.length > 10) vetos.push(`Carrossel com ${s.length} slides (a casa pede de 5 a 10).`);
  if (s[0] && !String(s[0].layout).startsWith('capa')) vetos.push('O slide 1 precisa ser uma capa.');
  if (s.length && s[s.length - 1].layout !== 'cta') vetos.push('O último slide precisa ser o CTA.');
  s.forEach((sl, i) => {
    if (!LAYOUTS.includes(sl.layout)) vetos.push(`Slide ${i + 1}: layout "${sl.layout}" não existe.`);
    const texto = [sl.titulo, sl.texto, ...(sl.itens || []), ...(sl.buscas || [])].join(' ');
    if (palavras(texto) > 45) vetos.push(`Slide ${i + 1}: ${palavras(texto)} palavras (máximo 45).`);
    if (/[—–]| - /.test(texto)) vetos.push(`Slide ${i + 1}: tracinho como separador.`);
    if (sl.enfase && !String(sl.titulo || '').includes(sl.enfase)) vetos.push(`Slide ${i + 1}: a ênfase "${sl.enfase}" não está no título.`);
    if (sl.desenho?.trecho && !String(sl.titulo || '').includes(sl.desenho.trecho)) vetos.push(`Slide ${i + 1}: o trecho do desenho não está no título.`);
    if (sl.desenho && sl.fundo === 'eletrico') vetos.push(`Slide ${i + 1}: desenho azul sobre fundo azul some.`);
    if (sl.desenho?.trecho && !String(sl.titulo || '').replace(/[s.!?”"']+$/, '').endsWith(sl.desenho.trecho.replace(/[s.!?”"']+$/, ''))) vetos.push(`Slide ${i + 1}: o sublinhado precisa ser o fim do título (no meio, ele invade a linha de baixo).`);
    if (sl.desenho?.trecho && palavras(sl.desenho.trecho) > 3) vetos.push(`Slide ${i + 1}: trecho sublinhado com ${palavras(sl.desenho.trecho)} palavras (máximo 3, senão quebra de linha e risca o título).`);
    if (i > 0 && sl.fundo && sl.fundo === s[i - 1].fundo) vetos.push(`Slides ${i} e ${i + 1} com o mesmo fundo.`);
  });
  const layouts = new Set(s.map((x) => x.layout));
  if (s.length && layouts.size < 3) vetos.push('Pouca variação de layout (mínimo 3 diferentes).');
  if (post?.legenda) {
    if (post.legenda.length > 2200) vetos.push(`Legenda com ${post.legenda.length} caracteres (máximo 2.200).`);
    if (/[—–]| - /.test(post.legenda)) vetos.push('Legenda com tracinho como separador.');
    if (/https?:\/\/|www\./.test(post.legenda)) vetos.push('Legenda com link (não é clicável no Instagram).');
  }
  return vetos;
}

/** Preenche o fundo que faltar, em rodízio, sem repetir o anterior. */
function completarFundos(slides) {
  const padraoPorLayout = { 'capa-olho': 'void', 'capa-num': 'claro', 'capa-busca': 'eletrico', destaque: 'eletrico', cta: 'eletrico' };
  let anterior = null;
  return slides.map((sl) => {
    let f = FUNDOS.includes(sl.fundo) ? sl.fundo : padraoPorLayout[sl.layout];
    if (!f || f === anterior) f = ['claro', 'painel', 'void'].find((x) => x !== anterior && !(sl.desenho && x === 'eletrico'));
    anterior = f;
    return { ...sl, fundo: f };
  });
}

/** Título com ênfase na cor da marca e acento desenhado. */
function tituloHtml(sl) {
  const titulo = String(sl.titulo || '');
  // palavra curta não fica sozinha no fim da linha ("a parte", "de outro")
  const cola = (s) => esc(s).replace(/(^|\s)(a|o|e|é|de|da|do|em|na|no|pra|que)\s/gi, '$1$2&nbsp;');
  const desenho = (s) => {
    const tr = sl.desenho?.trecho;
    const i = tr ? s.indexOf(tr) : -1;
    if (i < 0) return cola(s);
    const cls = sl.desenho.tipo === 'sublinha2' ? 'sublinha2' : 'sublinha';
    return `${cola(s.slice(0, i))}<span class="${cls}">${cola(tr)}</span>${cola(s.slice(i + tr.length))}`;
  };
  const e = sl.enfase ? titulo.indexOf(sl.enfase) : -1;
  if (e < 0) return desenho(titulo);
  return `${desenho(titulo.slice(0, e))}<em>${desenho(sl.enfase)}</em>${desenho(titulo.slice(e + sl.enfase.length))}`;
}

function topo(fundo, simbolo) {
  const cor = fundo === 'claro' ? ' style="color:#0e0918"' : '';
  return `<div class="topo"><div class="marca"><img src="${simbolo}" alt=""></div><span class="nome"${cor}>HORUS</span></div>`;
}

function slideHtml(sl, i, total, a) {
  const cls = ['slide', CLASSE_FUNDO[sl.fundo]];
  const rodape = `<div class="rodape"><span>@horusagencia.br</span>${i === 0 ? '<span>arrasta →</span>' : sl.layout === 'cta' ? '<span>Site e Google em Salvador</span>' : ''}</div>`;
  const p = sl.texto ? `<p>${esc(sl.texto)}</p>` : '';
  const busca = (q) => `<div class="busca"><svg viewBox="0 0 24 24" fill="none" stroke="#5f6368" stroke-width="2.4" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.8-4.8"/></svg>${esc(q)}</div>`;
  let miolo;
  switch (sl.layout) {
    case 'capa-olho':
      cls.push('capa');
      return `<section class="${cls.join(' ')}"><div class="luz"></div><img class="olho" src="${a.simbolo}" alt="">${topo(sl.fundo, a.simbolo)}<div class="miolo"><h1>${tituloHtml(sl)}</h1></div>${rodape}</section>`;
    case 'capa-num':
      cls.push('capa-num');
      miolo = `<div class="num-gigante">${esc(sl.numero || '')}</div><h1>${tituloHtml(sl)}</h1>`; break;
    case 'capa-busca':
      cls.push('capa-busca');
      miolo = `<h1>${tituloHtml(sl)}</h1>${busca((sl.buscas || [])[0] || '')}`.replace('</div>', '<span class="cursor"></span></div>'); break;
    case 'grande':
      cls.push('grande'); miolo = `<h2>${tituloHtml(sl)}</h2>${p}`; break;
    case 'solo':
      miolo = `<h2>${tituloHtml(sl)}</h2>${p}${sl.fonte ? `<div class="fonte">Fonte: ${esc(sl.fonte)}</div>` : ''}`; break;
    case 'busca':
      cls.push('com-seta');
      miolo = `<h2>${tituloHtml(sl)}</h2>${p}<div class="buscas"><img class="seta-desenho" src="${a.elementos}seta-curva.png" alt="">${(sl.buscas || []).slice(0, 3).map(busca).join('')}</div>`; break;
    case 'destaque':
      miolo = `<h2 style="font-size:88px">${tituloHtml(sl)}</h2>${p}`; break;
    case 'lista':
      miolo = `<h2>${tituloHtml(sl)}</h2><div class="lista">${(sl.itens || []).slice(0, 4).map((it, k) => `<div class="item"><b>${String(k + 1).padStart(2, '0')}</b><span>${esc(it)}</span></div>`).join('')}</div>`; break;
    case 'numero':
      cls.push('numero'); miolo = `<div class="num">${esc(sl.numero || '')}</div><h2>${tituloHtml(sl)}</h2>${p}`; break;
    case 'citacao':
      cls.push('citacao'); miolo = `<h2>${tituloHtml(sl)}</h2>`; break;
    case 'cta':
      cls.push('cta');
      return `<section class="${cls.join(' ')}"><div class="miolo"><div class="selo"><img src="${a.simbolo}" alt="Símbolo da Horus"></div><h2>${esc(sl.titulo || '')}</h2>${p}<div class="botao">${esc(sl.botao || 'Chama no WhatsApp · link na bio')}</div></div>${rodape}</section>`;
    default:
      miolo = `<h2>${tituloHtml(sl)}</h2>${p}`;
  }
  return `<section class="${cls.filter(Boolean).join(' ')}">${topo(sl.fundo, a.simbolo)}<div class="miolo">${miolo}</div>${rodape}</section>`;
}

/** Cabeçalho (fontes + estilo) da identidade travada, com os caminhos virando URL absoluta. */
function cabecaDaMarca(marca, ativos) {
  const ref = path.join(RAIZ_REPO, marca.carrossel_referencia || 'identidade/social/carrossel-referencia.html');
  const html = fs.readFileSync(ref, 'utf8');
  return html.slice(0, html.indexOf('</head>') + 7)
    .split('../../site/assets/simbolo-grande.png').join(ativos.simbolo)
    .split('elementos/').join(ativos.elementos);
}

export function montarHtml(post, marca = {}) {
  const ativos = {
    simbolo: pathToFileURL(path.join(RAIZ_REPO, marca.simbolo || 'site/assets/simbolo-grande.png')).href,
    elementos: pathToFileURL(path.join(RAIZ_REPO, 'identidade/social/elementos')).href + '/',
  };
  const slides = completarFundos(post.slides || []);
  const corpo = slides.map((s, i) => slideHtml(s, i, slides.length, ativos)).join('\n\n');
  return { html: `${cabecaDaMarca(marca, ativos).replace(/<title>[\s\S]*?<\/title>(\s*<!--[\s\S]*?-->)?/, `<title>${esc(post.titulo || 'Post')}</title>`)}\n<body>\n${corpo}\n</body>\n</html>\n`, slides };
}

/**
 * Renderiza: PNG 1080x1440 (conferência), JPEG (publicação) e miniatura (painel).
 * Devolve { pngs, jpgs, previa: [dataURL], problemas: [] }.
 */
export async function renderizar(post, pasta, marca = {}) {
  fs.mkdirSync(path.join(pasta, 'instagram'), { recursive: true });
  const { html } = montarHtml(post, marca);
  const arqHtml = path.join(pasta, 'carrossel.html');
  fs.writeFileSync(arqHtml, html);
  const { chromium } = createRequire(path.join(RAIZ_REPO, 'package.json'))('playwright');
  const nav = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const problemas = [];
  const pngs = [], jpgs = [], previa = [];
  try {
    for (const escala of [1, 0.25]) {
      const pg = await nav.newPage({ viewport: { width: 1080, height: 1440 }, deviceScaleFactor: escala });
      await pg.goto(pathToFileURL(arqHtml).href);
      await pg.evaluate(() => document.fonts.ready);
      if (escala === 1) {
        const fontes = await pg.evaluate(() => ['DM Sans', 'JetBrains Mono'].filter((f) => ![...document.fonts].some((x) => x.family.replace(/"/g, '') === f && x.status === 'loaded')));
        if (fontes.length) problemas.push(`Fonte não carregou: ${fontes.join(', ')}`);
      }
      const els = await pg.$$('.slide');
      for (let i = 0; i < els.length; i++) {
        const n = String(i + 1).padStart(2, '0');
        if (escala === 1) {
          const png = path.join(pasta, 'instagram', `slide-${n}.png`);
          const jpg = path.join(pasta, 'instagram', `slide-${n}.jpg`);
          await els[i].screenshot({ path: png });
          await els[i].screenshot({ path: jpg, type: 'jpeg', quality: 92 });
          pngs.push(png); jpgs.push(jpg);
          const borda = await els[i].evaluate((s) => { const r = s.getBoundingClientRect(); return [...s.querySelectorAll('h1,h2,p,.busca,.item,.botao')].filter((e) => { const b = e.getBoundingClientRect(); return b.bottom > r.bottom - 40 || b.right > r.right - 40; }).length; });
          if (borda) problemas.push(`Slide ${i + 1}: texto encostando na borda.`);
        } else {
          const buf = await els[i].screenshot({ type: 'jpeg', quality: 70 });
          previa.push(`data:image/jpeg;base64,${buf.toString('base64')}`);
        }
      }
      await pg.close();
    }
  } finally { await nav.close(); }
  return { pngs, jpgs, previa, problemas, html: arqHtml };
}
