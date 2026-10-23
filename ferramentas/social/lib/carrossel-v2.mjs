// =============================================================================
// Carrossel, séries novas (21/10/2026): o visual dos posts que o Marcelo aprovou de 07 a 15/10,
// travado em código pra o Mídia usar sem escorregar. O modelo continua sem escrever HTML.
//
//   série "tweet"  = print de tweet (branco, avatar da Horus em todo slide, fio ligando os slides)
//                    origem: marketing/conteudo/midia/2026-10-05/o-google-mostra-quem-ligou-pra-voce
//   série "escuro" = fundo chapado escuro, rótulo da série no alto, assinatura no rodapé, par ✕/✓
//                    origem: marketing/conteudo/midia/2026-10-12/quanto-custa e bio-do-instagram
//
// Por que existe: os carrosséis do Mídia saíam só texto (Marcelo, 21/10: "a pessoa olha, vê esse texto
// todo, não fica com vontade de ver"). Aqui cada slide do miolo pode levar prova visual: imagem do
// ChatGPT (pelo Chrome do Marcelo), par antes/depois, conversa de WhatsApp ou cartão de busca, desenhados
// em código. Direção e regras: identidade/social/referencias/2026-10-07-essencia.md.
//
// Entrada (um post):
//   { serie: 'tweet' | 'escuro', rotulo?: 'PREÇO NO WHATSAPP', titulo, legenda,
//     slides: [ { tipo: 'capa' | 'conteudo' | 'impacto' | 'cta',
//                 titulo?, paragrafos?: [], lista?: { estilo: 'pontos'|'numeros'|'setas'|'checks', itens: [] },
//                 antes_depois?: { antes, depois, rotulo_antes?, rotulo_depois?, exemplo? },
//                 conversa?: [ { de: 'cliente'|'voce', texto } ],
//                 buscas?: { rotulo?, itens: [], destaque?: 0 },
//                 imagem?: { pedido, arquivo? },   // pedido = prompt em inglês pro ChatGPT; arquivo = o código preenche
//                 fonte? } ] }
//   Texto: *trecho* = destaque (negrito no tweet; azul no título e branco no corpo do escuro).
// =============================================================================
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { RAIZ_REPO } from './marca.mjs';

export const SERIES = ['tweet', 'escuro'];
export const TIPOS = ['capa', 'conteudo', 'impacto', 'cta'];
export const MAX_IMAGENS = 4;

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const palavras = (s = '') => String(s).replace(/\*/g, '').split(/\s+/).filter(Boolean).length;
const temVisual = (sl) => Boolean(sl.imagem || sl.antes_depois || sl.conversa?.length || sl.buscas?.itens?.length);

/** *destaque* vira a tag pedida; emoji ganha a fonte de emoji; palavra curta não fica sozinha no fim da linha. */
function marcar(texto, tag = 'b') {
  return esc(texto)
    .replace(/\*([^*]+)\*/g, `<${tag}>$1</${tag}>`)
    .replace(/(\p{Extended_Pictographic}(?:️|‍\p{Extended_Pictographic})*)/gu, '<span class="e">$1</span>')
    .replace(/(^|\s)(a|o|e|é|de|da|do|em|na|no|pra|que)\s/gi, '$1$2&nbsp;');
}

/** Todo texto do slide junto (para contar palavra e caçar tracinho). */
function textoDo(sl) {
  return [sl.titulo, ...(sl.paragrafos || []), ...(sl.lista?.itens || []), sl.antes_depois?.antes, sl.antes_depois?.depois,
    ...(sl.conversa || []).map((c) => c.texto)].filter(Boolean).join(' ');
}

/** Os pisos que o código mede nas séries novas. Devolve lista de vetos (vazia = passou). */
export function validarV2(post, { exigirArquivos = false } = {}) {
  const vetos = [];
  const s = post?.slides || [];
  if (!SERIES.includes(post?.serie)) vetos.push(`Série "${post?.serie}" não existe (tweet ou escuro).`);
  if (s.length < 5 || s.length > 10) vetos.push(`Carrossel com ${s.length} slides (a casa pede de 5 a 10).`);
  if (s[0] && s[0].tipo !== 'capa') vetos.push('O slide 1 precisa ser a capa.');
  if (s[0] && !s[0].imagem) vetos.push('A capa precisa de imagem (ilustração do ChatGPT): capa só de texto não para o dedo.');
  if (s.length && s[s.length - 1].tipo !== 'cta') vetos.push('O último slide precisa ser o CTA.');
  s.forEach((sl, i) => {
    const n = i + 1;
    if (!TIPOS.includes(sl.tipo)) vetos.push(`Slide ${n}: tipo "${sl.tipo}" não existe.`);
    const texto = textoDo(sl);
    if (palavras(texto) > 45) vetos.push(`Slide ${n}: ${palavras(texto)} palavras (máximo 45).`);
    if (/[—–]| - /.test(texto)) vetos.push(`Slide ${n}: tracinho como separador.`);
    if (!palavras(texto)) vetos.push(`Slide ${n}: sem texto.`);
    if ((sl.lista?.itens || []).length > 5) vetos.push(`Slide ${n}: lista com mais de 5 itens.`);
    if ((sl.conversa || []).length > 4) vetos.push(`Slide ${n}: conversa com mais de 4 balões.`);
    if ((sl.buscas?.itens || []).length > 3) vetos.push(`Slide ${n}: mais de 3 buscas no cartão.`);
    const visuais = [sl.imagem, sl.antes_depois, sl.conversa?.length, sl.buscas?.itens?.length].filter(Boolean).length;
    if (visuais > 1) vetos.push(`Slide ${n}: dois elementos visuais no mesmo slide (um por slide).`);
    if (sl.imagem && !String(sl.imagem.pedido || '').trim() && !sl.imagem.arquivo) vetos.push(`Slide ${n}: imagem sem pedido.`);
    if (sl.imagem?.pedido && /\b(chart|graph|screenshot|portrait|selfie|infographic)\b|gr[áa]fico|print de|rosto/i.test(sl.imagem.pedido))
      vetos.push(`Slide ${n}: o ChatGPT não gera gráfico, print nem rosto (número e print vêm de fonte real).`);
    if (exigirArquivos && sl.imagem && !(sl.imagem.arquivo && fs.existsSync(path.join(RAIZ_REPO, sl.imagem.arquivo)))) vetos.push(`Slide ${n}: a imagem não foi gerada.`);
    if (sl.tipo === 'impacto' && palavras(sl.titulo) > 14) vetos.push(`Slide ${n}: frase de impacto com mais de 14 palavras.`);
  });
  // a mesma prova visual três slides seguidos vira padrão repetido (teste de 21/10: três ✕/✓ em fila)
  const tipoVisual = (sl) => (sl.imagem ? 'imagem' : sl.antes_depois ? 'antes_depois' : sl.conversa?.length ? 'conversa' : sl.buscas?.itens?.length ? 'buscas' : null);
  for (let i = 2; i < s.length; i++) {
    const t = tipoVisual(s[i]);
    if (t && t === tipoVisual(s[i - 1]) && t === tipoVisual(s[i - 2])) vetos.push(`Slides ${i - 1} a ${i + 1}: "${t}" três vezes seguidas (varie a prova visual).`);
  }
  const imagens = s.filter((x) => x.imagem).length;
  if (imagens > MAX_IMAGENS) vetos.push(`${imagens} imagens do ChatGPT (máximo ${MAX_IMAGENS} por post).`);
  const miolo = s.slice(1, -1).filter((x) => x.tipo !== 'impacto');
  const comVisual = miolo.filter(temVisual).length;
  if (miolo.length && comVisual < Math.ceil(miolo.length / 2))
    vetos.push(`Muito texto: só ${comVisual} de ${miolo.length} slides do miolo têm prova visual (imagem, antes/depois, conversa ou busca). Mínimo ${Math.ceil(miolo.length / 2)}.`);
  if (post?.legenda) {
    if (post.legenda.length > 2200) vetos.push(`Legenda com ${post.legenda.length} caracteres (máximo 2.200).`);
    if (/[—–]| - /.test(post.legenda)) vetos.push('Legenda com tracinho como separador.');
    if (/https?:\/\/|www\./.test(post.legenda)) vetos.push('Legenda com link (não é clicável no Instagram).');
    if ((post.legenda.match(/#[\p{L}\d_]+/gu) || []).length > 5) vetos.push('Mais de 5 hashtags na legenda.');
  }
  return vetos;
}

/* ------------------------------ blocos visuais (desenhados em código) ------------------------------ */

const LUPA = '<svg viewBox="0 0 24 24" fill="none" stroke="#5f6368" stroke-width="2.4" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.8-4.8"/></svg>';

function blocoLista(l, tag) {
  if (!l?.itens?.length) return '';
  const estilo = ['pontos', 'numeros', 'setas', 'checks'].includes(l.estilo) ? l.estilo : 'pontos';
  const el = estilo === 'numeros' ? 'ol' : 'ul';
  return `<${el} class="lista ${estilo}">${l.itens.map((it) => `<li>${marcar(it, tag)}</li>`).join('')}</${el}>`;
}

function blocoVisual(sl, a, tag) {
  if (sl.imagem?.arquivo) return `<div class="card-img"><img src="${a.arq(sl.imagem.arquivo)}" alt=""></div>`;
  if (sl.imagem) return '<div class="card-img falta"><span>[FALTA: imagem do ChatGPT]</span></div>';
  if (sl.antes_depois) {
    const ad = sl.antes_depois;
    return `<div class="ad">
      <div class="rot"><span class="x">✕</span>${esc(ad.rotulo_antes || 'Em vez de')}</div><div class="ruim">${marcar(ad.antes, tag)}</div>
      <div class="rot"><span class="v">✓</span>${esc(ad.rotulo_depois || 'Responda assim')}</div><div class="bom">${ad.exemplo === false ? '' : '<span class="ex">exemplo</span>'}${marcar(ad.depois, tag)}</div></div>`;
  }
  if (sl.conversa?.length) {
    return `<div class="zap">${sl.conversa.map((c) => `<div class="bal ${c.de === 'voce' ? 'voce' : 'cliente'}">${marcar(c.texto, tag)}</div>`).join('')}</div>`;
  }
  if (sl.buscas?.itens?.length) {
    const d = Number.isInteger(sl.buscas.destaque) ? sl.buscas.destaque : 0;
    return `<div class="buscas">${sl.buscas.rotulo ? `<div class="rotb">${esc(sl.buscas.rotulo)}</div>` : ''}${sl.buscas.itens.map((q, k) => `<div class="pilula${k === d ? ' alvo' : ''}">${LUPA}${esc(q)}</div>`).join('')}</div>`;
  }
  return '';
}

const fonte = (sl) => (sl.fonte ? `<div class="fonte">Fonte: ${esc(sl.fonte)}</div>` : '');

/* ------------------------------ série "tweet" ------------------------------ */

function slideTweet(sl, i, a) {
  const autor = `<div class="autor"><div class="avatar"><img src="${a.simbolo}" alt=""></div><div><div class="nome">Horus</div><div class="arroba">@horusagencia.br</div></div></div>`;
  // no impacto a frase de apoio vem antes e menor; a frase forte fecha o slide
  const ps = sl.tipo === 'impacto'
    ? `${(sl.paragrafos || []).map((p) => `<p class="antes">${marcar(p)}</p>`).join('')}${sl.titulo ? `<p>${marcar(sl.titulo)}</p>` : ''}`
    : [sl.titulo, ...(sl.paragrafos || [])].filter(Boolean).map((p) => `<p>${marcar(p)}</p>`).join('');
  const cls = ['slide', 'tw', sl.tipo === 'capa' ? 'capa' : '', sl.tipo === 'impacto' ? 'impacto' : ''].filter(Boolean).join(' ');
  return `<section class="${cls}">${i ? '<div class="fio"></div>' : ''}${autor}<div class="txt">${ps}${blocoLista(sl.lista, 'b')}</div>${blocoVisual(sl, a, 'b')}${fonte(sl)}</section>`;
}

/* ------------------------------ série "escuro" ------------------------------ */

function slideEscuro(sl, i, a, post) {
  const rodape = `<div class="rodape"><div class="avatar"><img src="${a.simbolo}" alt=""></div><div><div class="nome">Horus</div><div class="arroba">@horusagencia.br</div></div></div>`;
  const rotulo = post.rotulo ? `<div class="rotulo"><i></i>${esc(post.rotulo)}</div>` : '';
  const ps = (sl.paragrafos || []).map((p) => `<p>${marcar(p, 'b')}</p>`).join('');
  if (sl.tipo === 'capa') {
    const ilus = sl.imagem?.arquivo ? `<div class="ilus" style="background-image:url('${a.arq(sl.imagem.arquivo)}')"></div>` : sl.imagem ? '<div class="ilus falta"><span>[FALTA: imagem do ChatGPT]</span></div>' : '';
    return `<section class="slide es capa${ilus ? '' : ' sem-ilus'}">${ilus}<div class="miolo"><h1>${marcar(sl.titulo || '', 'em')}</h1>${ps}</div>${rodape}</section>`;
  }
  if (sl.tipo === 'impacto') {
    return `<section class="slide es impacto">${rotulo}<div class="miolo">${ps.replace(/<p>/g, '<p class="antes">')}<div class="forte">${marcar(sl.titulo || '', 'span')}</div></div>${rodape}</section>`;
  }
  const h2 = sl.titulo ? `<h2>${marcar(sl.titulo, 'em')}</h2>` : '';
  return `<section class="slide es ${sl.tipo}">${rotulo}<div class="miolo">${h2}${ps}${blocoLista(sl.lista, 'b')}${blocoVisual(sl, a, 'b')}${fonte(sl)}</div>${rodape}</section>`;
}

/* ------------------------------ estilo (copiado dos posts aprovados; fundo chapado, sem brilho no canto) ------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=JetBrains+Mono:wght@500;600;700&family=Noto+Color+Emoji&display=swap');
:root { --tinta:#0f1419; --cinza:#536471; --fio:#cfd9de; --void:#0e0918; --painel:#1b1728; --osso:#d1cece; --osso-2:#a7a1b3;
  --azul:#0077ff; --azul-claro:#4a9bff; --lavanda:#f2f0f6; }
* { box-sizing:border-box; margin:0; padding:0; }
body { background:#444; font-family:'DM Sans','Noto Color Emoji',system-ui,sans-serif; }
.e { font-family:'Noto Color Emoji'; font-weight:400; }
.slide { width:1080px; height:1440px; position:relative; overflow:hidden; margin-bottom:40px; display:flex; flex-direction:column; }

/* tweet */
.tw { background:#fff; justify-content:center; padding:0 72px; color:var(--tinta); }
.tw.capa { justify-content:flex-start; padding-top:130px; }
.tw .fio { width:4px; height:64px; margin:0 0 18px 65px; background:var(--fio); border-radius:2px; }
.tw .autor { display:flex; align-items:center; gap:30px; }
.tw .avatar { width:134px; height:134px; border-radius:50%; background:var(--void); display:grid; place-items:center; flex-shrink:0; }
.tw .avatar img { width:98px; }
.tw .nome { font-size:48px; font-weight:700; letter-spacing:-.01em; line-height:1.1; }
.tw .arroba { font-size:42px; font-weight:500; color:var(--cinza); line-height:1.25; }
.tw .txt { margin-top:50px; font-size:56px; font-weight:500; line-height:1.3; letter-spacing:-.012em; }
.tw .txt p + p { margin-top:40px; }
.tw .txt b { font-weight:700; }
.tw.impacto .txt { font-size:78px; font-weight:700; line-height:1.12; letter-spacing:-.025em; }
.tw.impacto .txt .antes { font-size:48px; font-weight:500; color:var(--cinza); letter-spacing:-.01em; }
.tw .lista { list-style:none; margin-top:28px; counter-reset:p; }
.tw .lista li { position:relative; padding-left:60px; }
.tw .lista li + li { margin-top:12px; }
.tw .lista.pontos li::before { content:''; position:absolute; left:8px; top:28px; width:16px; height:16px; border-radius:50%; background:var(--azul); }
.tw .lista.numeros li { counter-increment:p; padding-left:78px; }
.tw .lista.numeros li::before { content:counter(p); position:absolute; left:0; top:4px; width:58px; height:58px; border-radius:50%; background:var(--void); color:#fff; font-size:34px; font-weight:700; display:grid; place-items:center; }
.tw .lista.setas li::before { content:'→'; position:absolute; left:0; color:var(--azul); font-weight:700; }
.tw .lista.checks li::before { content:'✓'; position:absolute; left:0; top:6px; width:46px; height:46px; border-radius:10px; background:var(--azul); color:#fff; font-size:32px; font-weight:700; display:grid; place-items:center; }
.tw .card-img { margin-top:48px; border-radius:40px; overflow:hidden; border:2px solid #e6e9ee; flex:0 1 auto; min-height:0; }
.tw .card-img img { display:block; width:100%; max-height:600px; object-fit:cover; }
.tw .fonte { margin-top:40px; font-size:27px; font-weight:500; color:#6e767d; }
.tw .buscas { margin-top:48px; background:var(--lavanda); border-radius:40px; padding:48px 52px 54px; }
.tw .ad .ruim { background:#f4f4f6; border:2px solid #e6e6ec; color:#5c5668; }
.tw .ad .bom { background:rgba(0,119,255,.07); border:2px solid rgba(0,119,255,.45); color:var(--tinta); }
.tw .ad .rot { color:#5c5668; }
.tw .zap { background:#efeae2; }
.tw .zap .cliente { background:#fff; color:var(--tinta); }
.tw .zap .voce { background:#d9fdd3; color:var(--tinta); }

/* blocos comuns */
.rotb { font-family:'JetBrains Mono',monospace; font-size:26px; font-weight:600; letter-spacing:.16em; color:#5c5668; text-transform:uppercase; }
.pilula { margin-top:24px; background:#fff; border-radius:999px; padding:24px 34px; display:flex; align-items:center; gap:22px; font-size:40px; font-weight:500; color:var(--tinta); }
.pilula svg { width:40px; height:40px; flex-shrink:0; }
.pilula.alvo { box-shadow:0 0 0 4px var(--azul); }
.ad { margin-top:20px; }
.ad .rot { margin-top:40px; font-size:28px; font-weight:800; letter-spacing:.16em; text-transform:uppercase; display:flex; align-items:center; gap:16px; }
.ad .rot .x { color:#ff5c5c; font-size:34px; } .ad .rot .v { color:var(--azul); font-size:34px; }
.ad .ruim, .ad .bom { margin-top:20px; border-radius:22px; padding:36px 46px; font-size:40px; font-weight:500; line-height:1.4; position:relative; }
.ad .ex { position:absolute; top:-18px; right:30px; font-family:'JetBrains Mono',monospace; font-size:24px; font-weight:600; letter-spacing:.12em; text-transform:uppercase; background:var(--azul); color:#fff; padding:6px 16px; border-radius:8px; }
.zap { margin-top:48px; border-radius:36px; padding:40px 36px; display:flex; flex-direction:column; gap:22px; }
.zap .bal { max-width:84%; padding:24px 32px; border-radius:26px; font-size:38px; font-weight:500; line-height:1.35; }
.zap .cliente { align-self:flex-start; border-top-left-radius:6px; }
.zap .voce { align-self:flex-end; border-top-right-radius:6px; }
.falta { display:grid; place-items:center; min-height:420px; background:#fff0f0; border:4px dashed #b00020; color:#b00020; font-size:34px; font-weight:700; }

/* escuro: fundo chapado (Marcelo, 15/10: sem brilho azul no canto) */
.es { background:var(--void); color:var(--osso); padding:104px 96px 84px; }
.es .rotulo { display:flex; align-items:center; gap:18px; font-family:'JetBrains Mono',monospace; font-weight:600; font-size:26px; letter-spacing:.2em; text-transform:uppercase; color:rgba(226,232,240,.75); }
.es .rotulo i { width:14px; height:14px; border-radius:3px; background:var(--azul); flex-shrink:0; }
.es .miolo { flex:1; display:flex; flex-direction:column; justify-content:center; min-height:0; }
.es h1 { font-size:86px; font-weight:700; line-height:1.05; letter-spacing:-.028em; color:#fff; text-wrap:balance; }
.es h2 { font-size:72px; font-weight:700; line-height:1.08; letter-spacing:-.025em; color:#fff; text-wrap:balance; }
.es em { font-style:normal; color:var(--azul-claro); }
.es p { font-size:40px; font-weight:500; line-height:1.42; margin-top:30px; }
.es p b { color:#fff; font-weight:700; }
.es .lista { list-style:none; margin-top:40px; counter-reset:p; }
.es .lista li { font-size:42px; font-weight:500; line-height:1.32; padding-left:72px; position:relative; }
.es .lista li + li { margin-top:28px; }
.es .lista b { color:#fff; font-weight:700; }
.es .lista.pontos li::before { content:''; position:absolute; left:10px; top:22px; width:16px; height:16px; border-radius:50%; background:var(--azul-claro); }
.es .lista.setas li::before { content:'→'; position:absolute; left:0; color:var(--azul-claro); font-weight:700; }
.es .lista.numeros li { counter-increment:p; }
.es .lista.numeros li::before { content:counter(p); position:absolute; left:0; top:0; width:52px; height:52px; border-radius:12px; background:rgba(0,119,255,.16); border:1.5px solid rgba(74,155,255,.55); color:#fff; font-size:30px; font-weight:700; display:grid; place-items:center; }
.es .lista.checks li::before { content:'✓'; position:absolute; left:0; top:2px; width:48px; height:48px; border-radius:10px; background:var(--azul); color:#fff; font-size:32px; font-weight:700; display:grid; place-items:center; }
.es .card-img { margin-top:44px; border-radius:28px; overflow:hidden; border:1.5px solid rgba(255,255,255,.10); min-height:0; flex:0 1 auto; }
.es .card-img img { display:block; width:100%; max-height:620px; object-fit:cover; }
.es .fonte { margin-top:30px; font-size:26px; font-weight:500; color:#8a8496; }
.es .buscas { margin-top:44px; background:var(--painel); border:1.5px solid rgba(255,255,255,.07); border-radius:28px; padding:44px 48px 50px; }
.es .rotb { color:var(--osso-2); }
.es .ad .rot { color:var(--osso-2); } .es .ad .rot .v { color:var(--azul-claro); }
.es .ad .ruim { background:var(--painel); border:1.5px solid rgba(255,255,255,.07); color:var(--osso-2); }
.es .ad .bom { background:rgba(0,119,255,.13); border:1.5px solid rgba(74,155,255,.55); color:#fff; }
.es .zap { background:#0b141a; border:1.5px solid rgba(255,255,255,.06); }
.es .zap .cliente { background:#202c33; color:#e9edef; }
.es .zap .voce { background:#005c4b; color:#e9edef; }
.es .rodape { margin-top:auto; padding-top:32px; border-top:1.5px solid rgba(255,255,255,.10); display:flex; align-items:center; gap:24px; }
.es .avatar { width:92px; height:92px; border-radius:50%; background:var(--void); border:2px solid rgba(255,255,255,.16); display:grid; place-items:center; }
.es .avatar img { width:66px; }
.es .rodape .nome { font-size:34px; font-weight:700; color:#fff; line-height:1.1; }
.es .rodape .arroba { font-size:28px; font-weight:500; color:var(--azul-claro); }
.es.capa { padding-top:0; }
.es.capa .ilus { margin:0 -96px; height:700px; flex-shrink:0; background:center 40% / cover no-repeat; position:relative; }
.es.capa .ilus::after { content:''; position:absolute; inset:0; background:linear-gradient(180deg,transparent 55%,var(--void) 100%); }
.es.capa .ilus.falta::after { display:none; }
.es.capa .miolo { justify-content:flex-start; padding-top:20px; }
.es.capa.sem-ilus .miolo { justify-content:center; }
.es.capa p { font-size:40px; }
.es.impacto { background:linear-gradient(141deg,#077ac7,#6b21ef); color:#fff; }
.es.impacto .rotulo { color:rgba(255,255,255,.85); } .es.impacto .rotulo i { background:#fff; }
.es.impacto .antes { font-size:44px; line-height:1.3; color:rgba(255,255,255,.88); margin-top:0; }
.es.impacto .forte { margin-top:36px; font-size:100px; font-weight:800; line-height:1.02; letter-spacing:-.03em; text-wrap:balance; }
.es.impacto .rodape { border-top-color:rgba(255,255,255,.25); }
.es.impacto .rodape .arroba { color:#fff; }
.es.impacto .avatar { border-color:rgba(255,255,255,.35); }

/* aperto automático quando o conteúdo passa do slide (o render liga e mede de novo) */
.aperta.tw .txt { font-size:48px; } .aperta.tw .txt p + p { margin-top:30px; }
.aperta.tw .card-img img, .aperta.es .card-img img { max-height:440px; }
.aperta.es h2 { font-size:62px; } .aperta.es h1 { font-size:76px; } .aperta.es p, .aperta.es .lista li { font-size:36px; }
.aperta .ad .ruim, .aperta .ad .bom { font-size:36px; padding:28px 40px; } .aperta .zap .bal { font-size:34px; }
.aperta.es.capa .ilus { height:600px; }
`;

export function montarHtmlV2(post, marca = {}) {
  const a = {
    simbolo: pathToFileURL(path.join(RAIZ_REPO, marca.simbolo || 'site/assets/simbolo-grande.png')).href,
    arq: (rel) => pathToFileURL(path.isAbsolute(rel) ? rel : path.join(RAIZ_REPO, rel)).href,
  };
  const slides = post.slides || [];
  const corpo = slides.map((sl, i) => (post.serie === 'tweet' ? slideTweet(sl, i, a) : slideEscuro(sl, i, a, post))).join('\n\n');
  return `<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n<title>${esc(post.titulo || 'Post')}</title>\n<style>${CSS}</style>\n</head>\n<body>\n${corpo}\n</body>\n</html>\n`;
}
