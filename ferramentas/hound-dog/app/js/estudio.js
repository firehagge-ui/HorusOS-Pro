/* =============================================================================
   HOUNDER — 🎨 Estúdio: editor de carrossel e post no próprio painel (21/10/2026,
   pedido do Marcelo para o Antônio cuidar do Instagram da Horus).
   Canvas de 1080 × 1440 (3:4) com texto, formas, linha/seta e imagem; arrastar,
   redimensionar, camadas, desfazer, modelos com a identidade da Horus.
   O mesmo desenho serve à tela e à exportação: o que se vê é o JPG que vai ao ar.
   Salvar = renderiza cada slide, sobe em midia/horus/estudio/<post>/ e grava o
   post em social_posts (status "aguardando": o Marcelo aprova na aba Semana e o
   Farejador publica pela URL). O documento editável fica em conteudo.estudio.
   Regras da casa que o editor lembra: nada de texto abaixo de 24 px, corpo ≥ 34 px
   (_memoria/conteudo/10-legibilidade.md); *trecho* entre asteriscos = cor de destaque.
   ============================================================================= */
import { sb, quem } from './sb.js';
import { $, $$, esc, toast, erroAmigavel, confirmar, perguntar, menu, botaoCarregando } from './ui.js';
import { icone } from './icones.js';
import { abrirVisor, imagensDoPost } from './visor.js';

const L = 1080, A = 1440;
const PISO = 24, CORPO = 34;
const BUCKET = 'midia';
const COR = { void: '#0e0918', painel: '#1b1728', claro: '#f2f0f6', osso: '#d1cece', osso2: '#9d9797', branco: '#ffffff', azul: '#0077ff', azulTinta: '#0057d9', tinta: '#3a3446', violeta: '#6b21ef' };
const ELETRICO = { tipo: 'gradiente', de: '#077ac7', para: '#6b21ef', angulo: 141 };
const FUNDOS = [['Void', { tipo: 'cor', cor: COR.void }], ['Painel', { tipo: 'cor', cor: COR.painel }], ['Claro', { tipo: 'cor', cor: COR.claro }], ['Elétrico', ELETRICO]];
const PALETA = [COR.void, COR.painel, COR.claro, COR.branco, COR.osso, COR.osso2, COR.tinta, COR.azul, COR.azulTinta, COR.violeta];
const FONTES = ['DM Sans', 'JetBrains Mono'];
const PESOS = [[400, 'Regular'], [500, 'Médio'], [600, 'Semi'], [700, 'Negrito'], [800, 'Extra']];
const ROTULO_TIPO = { texto: 'Texto', forma: 'Forma', imagem: 'Imagem' };
const FORMAS = { ret: 'Retângulo', elipse: 'Círculo', linha: 'Linha', seta: 'Seta' };

const uid = () => Math.random().toString(36).slice(2, 10);
const clone = (o) => JSON.parse(JSON.stringify(o));
const limitar = (v, a, b) => Math.max(a, Math.min(b, v));
const arred = (v) => Math.round(v * 10) / 10;
const ehLinha = (el) => el.tipo === 'forma' && (el.forma === 'linha' || el.forma === 'seta');
const escuro = (f) => f?.tipo === 'gradiente' || ['#0e0918', '#1b1728'].includes(String(f?.cor || '').toLowerCase()) || luminancia(f?.cor || '#000') < 0.4;
function luminancia(hex) {
  const m = String(hex).replace('#', '').match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) return 0;
  const [r, g, b] = m.slice(1).map((x) => parseInt(x, 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/* =============================== modelo ================================ */
function texto(props) {
  return { id: uid(), tipo: 'texto', x: 88, y: 600, w: 904, texto: 'Escreva aqui', fonte: 'DM Sans', peso: 700, tamanho: 64, cor: COR.branco, destaque: COR.azul,
    destaqueEstilo: 'cor', alinhar: 'left', entrelinha: 1.15, espacamento: 0, caixa: 'normal', italico: false, caixaFundo: null, caixaRaio: 18, opacidade: 1, ...props };
}
function forma(forma, props) {
  const base = { id: uid(), tipo: 'forma', forma, opacidade: 1, preenchimento: COR.azul, borda: null, espessura: 6, raio: 24 };
  if (forma === 'linha' || forma === 'seta') return { ...base, x: 240, y: 720, x2: 840, y2: 720, preenchimento: null, borda: COR.azul, espessura: 8, ...props };
  return { ...base, x: 340, y: 520, w: 400, h: forma === 'elipse' ? 400 : 400, ...props };
}
const slideVazio = (fundo = FUNDOS[0][1]) => ({ id: uid(), fundo: clone(fundo), elementos: [] });

/** Modelos com a identidade da Horus (identidade/social/carrossel-referencia.html). */
const rodape = (cor) => texto({ texto: '@horusagencia.br', fonte: 'JetBrains Mono', peso: 500, tamanho: 26, cor, x: 88, y: 1320, w: 904 });
const MODELOS = [
  ['capa', 'Capa', () => ({ ...slideVazio(FUNDOS[0][1]), elementos: [
    texto({ texto: 'HORUS', fonte: 'JetBrains Mono', peso: 600, tamanho: 26, cor: COR.osso2, espacamento: 4, x: 88, y: 96 }),
    texto({ texto: 'Um título que para o dedo, com *a parte que importa* na cor da marca.', peso: 800, tamanho: 92, entrelinha: 1.05, y: 470 }),
    texto({ texto: 'Uma linha de apoio que diz pra quem é.', peso: 400, tamanho: 38, cor: COR.osso, y: 960 }),
    rodape(COR.osso2)] })],
  ['texto', 'Título e texto', () => ({ ...slideVazio(FUNDOS[2][1]), elementos: [
    texto({ texto: 'Uma ideia por slide, *direto ao ponto*.', peso: 800, tamanho: 68, cor: COR.void, destaque: COR.azulTinta, y: 260 }),
    texto({ texto: 'O corpo explica em duas ou três frases curtas. Corpo nunca abaixo de 34 px: o post é lido num celular.', peso: 400, tamanho: 40, entrelinha: 1.35, cor: COR.tinta, y: 620 }),
    rodape('#5c5668')] })],
  ['lista', 'Lista', () => ({ ...slideVazio(FUNDOS[1][1]), elementos: [
    texto({ texto: 'Três coisas pra *conferir hoje*', peso: 800, tamanho: 64, y: 200 }),
    ...[0, 1, 2].flatMap((k) => [
      texto({ texto: `0${k + 1}`, fonte: 'JetBrains Mono', peso: 700, tamanho: 36, cor: COR.azul, x: 88, y: 560 + k * 220, w: 120 }),
      texto({ texto: ['Primeiro item, numa frase.', 'Segundo item, numa frase.', 'Terceiro item, numa frase.'][k], peso: 500, tamanho: 40, cor: COR.claro, x: 220, y: 552 + k * 220, w: 772 })]),
    rodape(COR.osso2)] })],
  ['cta', 'Fechamento', () => ({ ...slideVazio(ELETRICO), elementos: [
    texto({ texto: 'Salva este post e manda pra quem precisa.', peso: 800, tamanho: 84, entrelinha: 1.08, alinhar: 'center', y: 520 }),
    texto({ texto: 'Mais no @horusagencia.br', fonte: 'JetBrains Mono', peso: 500, tamanho: 30, alinhar: 'center', cor: COR.branco, opacidade: 0.9, y: 1000 })] })],
  ['branco', 'Em branco', () => slideVazio(FUNDOS[0][1])],
];

/* =============================== texto ================================ */
const medidor = document.createElement('canvas').getContext('2d');
const fonteCss = (el) => `${el.italico ? 'italic ' : ''}${el.peso} ${el.tamanho}px "${el.fonte}"`;
function espacar(ctx, px) { if ('letterSpacing' in ctx) ctx.letterSpacing = `${px || 0}px`; }
const cacheLayout = new Map();

/** Quebra o texto na largura do elemento. Devolve linhas com partes {t, d} (d = destaque). */
function layout(el) {
  const chave = [el.texto, el.fonte, el.peso, el.tamanho, el.italico, el.espacamento, el.caixa, el.w, el.entrelinha].join('|');
  const c = cacheLayout.get(chave);
  if (c) return c;
  const ctx = medidor;
  ctx.font = fonteCss(el); espacar(ctx, el.espacamento);
  const mede = (t) => ctx.measureText(t).width;
  const esp = mede(' ');
  const bruto = el.caixa === 'alta' ? String(el.texto || '').toLocaleUpperCase('pt-BR') : String(el.texto || '');
  const linhas = [];
  let dest = false;
  for (const par of bruto.split('\n')) {
    const palavras = [];
    let atual = null;
    par.split('*').forEach((s, k) => {
      if (k > 0) dest = !dest;
      for (const pd of s.split(/( +)/)) {
        if (!pd) continue;
        if (/^ +$/.test(pd)) { atual = null; palavras.push({ espaco: true, d: dest }); continue; }
        if (!atual) { atual = { partes: [], w: 0 }; palavras.push(atual); }
        atual.partes.push({ t: pd, d: dest }); atual.w += mede(pd);
      }
    });
    let linha = { partes: [], w: 0 };
    let espaco = null;
    const fechar = () => { linhas.push(linha); linha = { partes: [], w: 0 }; };
    for (const p of palavras) {
      if (p.espaco) { if (linha.partes.length) espaco = p; continue; }
      if (linha.partes.length && linha.w + (espaco ? esp : 0) + p.w > el.w + 0.5) { fechar(); espaco = null; }
      if (espaco && linha.partes.length) { linha.partes.push({ t: ' ', d: espaco.d && p.partes[0].d }); linha.w += esp; }
      espaco = null;
      if (p.w <= el.w || linha.partes.length) { linha.partes.push(...p.partes); linha.w += p.w; continue; }
      // palavra maior que a caixa: quebra por letra
      for (const parte of p.partes) for (const ch of parte.t) {
        const wc = mede(ch);
        if (linha.partes.length && linha.w + wc > el.w) fechar();
        const ult = linha.partes[linha.partes.length - 1];
        if (ult && ult.d === parte.d) ult.t += ch; else linha.partes.push({ t: ch, d: parte.d });
        linha.w += wc;
      }
    }
    fechar();
  }
  const res = { linhas, maxW: Math.max(0, ...linhas.map((l) => l.w)), altura: linhas.length * el.tamanho * el.entrelinha };
  if (cacheLayout.size > 600) cacheLayout.clear();
  cacheLayout.set(chave, res);
  return res;
}

/** Caixa do elemento no slide (texto: altura vem do layout; linha: retângulo dos pontos). */
function caixa(el) {
  if (el.tipo === 'texto') return { x: el.x, y: el.y, w: el.w, h: Math.max(el.tamanho * el.entrelinha, layout(el).altura) };
  if (ehLinha(el)) return { x: Math.min(el.x, el.x2), y: Math.min(el.y, el.y2), w: Math.abs(el.x2 - el.x), h: Math.abs(el.y2 - el.y) };
  return { x: el.x, y: el.y, w: el.w, h: el.h };
}

/* =============================== imagens ================================ */
const imagens = new Map(); // src → { img, ok, promessa }
let aoCarregarImagem = null;
function imagem(src) {
  let r = imagens.get(src);
  if (r) return r;
  const img = new Image();
  if (!src.startsWith('data:') && !src.startsWith('blob:')) img.crossOrigin = 'anonymous';
  r = { img, ok: false, erro: false };
  r.promessa = new Promise((res) => {
    img.onload = () => { r.ok = true; res(r); aoCarregarImagem?.(); };
    img.onerror = () => { r.erro = true; res(r); aoCarregarImagem?.(); };
  });
  img.src = src;
  imagens.set(src, r);
  return r;
}

/* =============================== desenho ================================ */
function retArred(ctx, x, y, w, h, r) {
  r = Math.max(0, Math.min(r || 0, Math.abs(w) / 2, Math.abs(h) / 2));
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h);
}
function pintarFundo(ctx, f) {
  if (f?.tipo === 'gradiente') {
    const a = ((f.angulo ?? 180) * Math.PI) / 180;
    const dx = Math.sin(a), dy = -Math.cos(a);
    const meio = (Math.abs(L * dx) + Math.abs(A * dy)) / 2;
    const g = ctx.createLinearGradient(L / 2 - dx * meio, A / 2 - dy * meio, L / 2 + dx * meio, A / 2 + dy * meio);
    g.addColorStop(0, f.de); g.addColorStop(1, f.para);
    ctx.fillStyle = g;
  } else ctx.fillStyle = f?.cor || COR.void;
  ctx.fillRect(0, 0, L, A);
}
function desenharTexto(ctx, el) {
  const lay = layout(el);
  const lh = el.tamanho * el.entrelinha;
  const xLinha = (w) => (el.alinhar === 'center' ? el.x + (el.w - w) / 2 : el.alinhar === 'right' ? el.x + el.w - w : el.x);
  if (el.caixaFundo) {
    const pad = Math.round(el.tamanho * 0.42);
    ctx.fillStyle = el.caixaFundo;
    retArred(ctx, xLinha(lay.maxW) - pad, el.y - pad * 0.55, lay.maxW + pad * 2, lay.altura + pad * 1.1, el.caixaRaio ?? 18);
    ctx.fill();
  }
  ctx.font = fonteCss(el); espacar(ctx, el.espacamento);
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  lay.linhas.forEach((ln, k) => {
    let x = xLinha(ln.w);
    const y = el.y + k * lh + lh / 2;
    for (const p of ln.partes) {
      const w = ctx.measureText(p.t).width;
      const marca = p.d && p.t.trim();
      if (marca && el.destaqueEstilo === 'marcador') { ctx.fillStyle = el.destaque; ctx.fillRect(x - 2, y - el.tamanho * 0.5, w + 4, el.tamanho * 1.02); }
      ctx.fillStyle = p.d && el.destaqueEstilo === 'cor' ? el.destaque : el.cor;
      ctx.fillText(p.t, x, y);
      if (marca && el.destaqueEstilo === 'sublinhado') { ctx.fillStyle = el.destaque; ctx.fillRect(x, y + el.tamanho * 0.46, w, Math.max(3, el.tamanho * 0.07)); }
      x += w;
    }
  });
}
function desenharForma(ctx, el) {
  if (ehLinha(el)) {
    ctx.strokeStyle = el.borda || COR.azul; ctx.lineWidth = el.espessura || 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(el.x, el.y); ctx.lineTo(el.x2, el.y2); ctx.stroke();
    if (el.forma === 'seta') {
      const ang = Math.atan2(el.y2 - el.y, el.x2 - el.x), t = Math.max(18, (el.espessura || 6) * 3.4);
      ctx.beginPath();
      ctx.moveTo(el.x2 - t * Math.cos(ang - 0.5), el.y2 - t * Math.sin(ang - 0.5));
      ctx.lineTo(el.x2, el.y2);
      ctx.lineTo(el.x2 - t * Math.cos(ang + 0.5), el.y2 - t * Math.sin(ang + 0.5));
      ctx.stroke();
    }
    return;
  }
  ctx.beginPath();
  if (el.forma === 'elipse') ctx.ellipse(el.x + el.w / 2, el.y + el.h / 2, Math.abs(el.w / 2), Math.abs(el.h / 2), 0, 0, Math.PI * 2);
  else retArred(ctx, el.x, el.y, el.w, el.h, el.raio);
  if (el.preenchimento) { ctx.fillStyle = el.preenchimento; ctx.fill(); }
  if (el.borda && el.espessura) { ctx.strokeStyle = el.borda; ctx.lineWidth = el.espessura; ctx.stroke(); }
}
function desenharImagem(ctx, el) {
  const r = el.src ? imagem(el.src) : null;
  ctx.save();
  retArred(ctx, el.x, el.y, el.w, el.h, el.raio || 0);
  ctx.clip();
  if (!r?.ok) {
    ctx.fillStyle = '#2a2833'; ctx.fillRect(el.x, el.y, el.w, el.h);
    ctx.fillStyle = '#8c867e'; ctx.font = '500 28px "DM Sans"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(r?.erro ? 'Imagem não abriu' : 'Carregando imagem…', el.x + el.w / 2, el.y + el.h / 2);
    ctx.restore(); return;
  }
  const { img } = r;
  const iw = img.naturalWidth, ih = img.naturalHeight;
  const esc2 = el.ajuste === 'conter' ? Math.min(el.w / iw, el.h / ih) : Math.max(el.w / iw, el.h / ih);
  const dw = iw * esc2, dh = ih * esc2;
  ctx.drawImage(img, el.x + (el.w - dw) / 2, el.y + (el.h - dh) / 2, dw, dh);
  ctx.restore();
}
/** Desenha o slide inteiro em unidades de slide (1080 × 1440). `ocultar` = id que está sendo digitado. */
function desenharSlide(ctx, slide, ocultar = null) {
  pintarFundo(ctx, slide.fundo);
  for (const el of slide.elementos) {
    if (el.id === ocultar) continue;
    ctx.save();
    ctx.globalAlpha = el.opacidade ?? 1;
    if (el.tipo === 'texto') desenharTexto(ctx, el);
    else if (el.tipo === 'forma') desenharForma(ctx, el);
    else if (el.tipo === 'imagem') desenharImagem(ctx, el);
    ctx.restore();
  }
}

const FONTES_CARREGAR = [...[400, 500, 600, 700, 800].map((p) => `${p} 40px "DM Sans"`), ...[500, 600, 700].map((p) => `${p} 40px "JetBrains Mono"`)];
const fontesProntas = Promise.all(FONTES_CARREGAR.map((f) => document.fonts.load(f).catch(() => null))).then(() => cacheLayout.clear());

/** Slide em canvas na escala pedida, com fontes e imagens prontas. */
async function renderizar(slide, escala = 1) {
  await fontesProntas;
  const srcs = slide.elementos.filter((e) => e.tipo === 'imagem' && e.src).map((e) => imagem(e.src).promessa);
  const res = await Promise.all(srcs);
  if (res.some((r) => r.erro)) throw new Error('Uma imagem do slide não abriu. Troque ou apague antes de salvar.');
  const c = document.createElement('canvas');
  c.width = Math.round(L * escala); c.height = Math.round(A * escala);
  const ctx = c.getContext('2d');
  ctx.scale(escala, escala);
  desenharSlide(ctx, slide);
  return c;
}
const paraBlob = (c, tipo = 'image/jpeg', q = 0.92) => new Promise((ok, falha) => c.toBlob((b) => (b ? ok(b) : falha(new Error('Não consegui gerar a imagem.'))), tipo, q));

/* =============================== avisos (régua da casa) ================================ */
function avisos(doc) {
  const lista = [];
  doc.slides.forEach((s, i) => {
    for (const el of s.elementos) {
      if (el.tipo === 'texto' && el.tamanho < PISO) lista.push(`Slide ${i + 1}: texto de ${el.tamanho} px, abaixo do piso de ${PISO} px.`);
      const b = caixa(el);
      if (b.x < -2 || b.y < -2 || b.x + b.w > L + 2 || b.y + b.h > A + 2) if (el.tipo !== 'imagem') lista.push(`Slide ${i + 1}: ${ROTULO_TIPO[el.tipo].toLowerCase()} saindo da borda.`);
      if (el.tipo === 'texto' && /—|–| - /.test(el.texto)) lista.push(`Slide ${i + 1}: travessão ou " - " como separador (a casa não usa).`);
    }
  });
  return lista;
}

/* =============================== utilidades de envio ================================ */
function segundaBahia() {
  const l = new Date(Date.now() - 3 * 3600000);
  const dia = l.getUTCDay() || 7;
  return new Date(Date.UTC(l.getUTCFullYear(), l.getUTCMonth(), l.getUTCDate() - (dia - 1))).toISOString().slice(0, 10);
}
async function enviar(caminho, blob, tipo) {
  const { error } = await sb.storage.from(BUCKET).upload(caminho, blob, { upsert: true, contentType: tipo, cacheControl: '60' });
  if (error) throw new Error(`Não consegui enviar a imagem: ${error.message}`);
  return sb.storage.from(BUCKET).getPublicUrl(caminho).data.publicUrl;
}
/** Prepara uma imagem do computador: no máximo 2160 px, JPEG (ou PNG se tiver transparência). */
async function prepararArquivo(arquivo) {
  const bmp = await createImageBitmap(arquivo);
  const esc2 = Math.min(1, 2160 / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * esc2); c.height = Math.round(bmp.height * esc2);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  const png = arquivo.type === 'image/png';
  const blob = await paraBlob(c, png ? 'image/png' : 'image/jpeg', 0.9);
  return { blob, tipo: png ? 'image/png' : 'image/jpeg', ext: png ? 'png' : 'jpg', w: c.width, h: c.height };
}

/* =============================== o editor ================================ */
/**
 * Abre o Estúdio.
 * @param {{post?: object|null, aoSalvar?: (id:string)=>void}} op  post = linha de social_posts (ou nada, para um novo)
 */
export async function abrirEstudio({ post = null, aoSalvar = null } = {}) {
  const publicado = post && ['publicado', 'publicando', 'medido'].includes(post.status);
  let postId = publicado ? null : post?.id || null;
  let titulo = publicado ? `Cópia de ${post.titulo}` : post?.titulo || '';
  let legenda = post?.legenda || '';
  let doc;
  if (post?.conteudo?.estudio) doc = clone(post.conteudo.estudio);
  else if (post) {
    // post do Mídia: cada slide entra como imagem travada no fundo; o que for novo vai por cima
    const { imagens: imgs, reduzida } = imagensDoPost(post);
    doc = { versao: 1, slides: imgs.map((src, k) => ({ ...slideVazio(), elementos: [{ id: uid(), tipo: 'imagem', nome: `Slide ${k + 1} original`, src, x: 0, y: 0, w: L, h: A, ajuste: 'cobrir', raio: 0, opacidade: 1, bloqueado: true }] })) };
    if (reduzida) toast('Esse post só tem a prévia reduzida: o slide original vai ficar sem nitidez. Peça ao Claude para subir a versão em alta.', 'info', { ms: 9000 });
  } else doc = { versao: 1, slides: [MODELOS[0][2]()] };
  if (!doc.slides?.length) doc.slides = [slideVazio()];

  const chaveRascunho = `hounder:estudio:${post?.id || 'novo'}`;
  try {
    const r = JSON.parse(localStorage.getItem(chaveRascunho) || 'null');
    if (r?.doc && (!post?.atualizado_em || r.quando > new Date(post.atualizado_em).getTime())) {
      const quando = new Date(r.quando).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
      if (await confirmar('Recuperar a edição não salva?', `Há uma edição deste post guardada neste navegador (${quando}) que não chegou a ser salva no Hounder.`, { rotulo: 'Recuperar' })) {
        doc = r.doc; titulo = r.titulo ?? titulo; legenda = r.legenda ?? legenda;
      } else localStorage.removeItem(chaveRascunho);
    }
  } catch { /* navegador sem armazenamento: segue sem rascunho local */ }

  let idx = 0, sel = null, zoom = 0.5, editando = null, guias = [], acao = null, salvando = false;
  let historico = [JSON.stringify(doc)], pos = 0, sujo = false;
  let copiado = null;

  const raiz = document.createElement('div');
  raiz.className = 'estudio';
  raiz.setAttribute('role', 'dialog');
  raiz.setAttribute('aria-modal', 'true');
  raiz.setAttribute('aria-label', 'Estúdio de posts');
  raiz.innerHTML = `
    <header class="est-topo">
      <div class="est-nome"><span>🎨</span><b>Estúdio</b></div>
      <input class="inp est-titulo" data-titulo placeholder="Nome do post (só pra achar depois)" value="${esc(titulo)}" aria-label="Nome do post">
      <div class="est-grupo">
        <button class="btn sm" data-add-texto title="Texto (T)">${icone('texto')}<span>Texto</span></button>
        <button class="btn sm" data-add-forma title="Forma">${icone('forma')}<span>Forma</span></button>
        <button class="btn sm" data-add-imagem title="Imagem do computador (também dá pra colar ou arrastar)">${icone('imagem')}<span>Imagem</span></button>
      </div>
      <div class="est-grupo">
        <button class="btn sm icone" data-desfazer title="Desfazer (Ctrl+Z)" aria-label="Desfazer">${icone('desfazer')}</button>
        <button class="btn sm icone" data-refazer title="Refazer (Ctrl+Shift+Z)" aria-label="Refazer">${icone('refazer')}</button>
      </div>
      <div class="est-grupo">
        <button class="btn sm icone" data-zoom-menos aria-label="Diminuir">${icone('menos')}</button>
        <button class="btn sm est-zoom" data-zoom-ajustar title="Ajustar à tela">50%</button>
        <button class="btn sm icone" data-zoom-mais aria-label="Aumentar">${icone('mais')}</button>
      </div>
      <span class="grow"></span>
      <button class="btn sm" data-ver title="Ver todos os slides em tela cheia">${icone('olho')}<span>Tela cheia</span></button>
      <button class="btn sm prim" data-salvar title="Salvar no Hounder (Ctrl+S)">${icone('check')}<span>Salvar</span></button>
      <button class="btn sm icone" data-fechar title="Fechar" aria-label="Fechar">${icone('x')}</button>
    </header>
    <div class="est-corpo">
      <aside class="est-slides" data-slides aria-label="Slides"></aside>
      <main class="est-palco" data-palco>
        <div class="est-folha" data-folha><canvas data-canvas aria-label="Slide em edição"></canvas><textarea class="est-digitar" data-digitar hidden aria-label="Texto"></textarea></div>
      </main>
      <aside class="est-props" data-props aria-label="Propriedades"></aside>
    </div>
    <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" data-arquivo hidden multiple>`;
  document.body.appendChild(raiz);
  document.body.classList.add('estudio-aberto');

  const canvas = $('[data-canvas]', raiz), folha = $('[data-folha]', raiz), palco = $('[data-palco]', raiz);
  const digitar = $('[data-digitar]', raiz);
  const ctx = canvas.getContext('2d');
  const slide = () => doc.slides[idx];
  const elSel = () => slide().elementos.find((e) => e.id === sel) || null;

  /* ---------- histórico ---------- */
  function guardarLocal() {
    try { localStorage.setItem(chaveRascunho, JSON.stringify({ doc, titulo, legenda, quando: Date.now() })); } catch { /* sem espaço: ignora */ }
  }
  function registrar() {
    const j = JSON.stringify(doc);
    if (j === historico[pos]) return;
    historico = historico.slice(0, pos + 1); historico.push(j);
    if (historico.length > 120) historico.shift();
    pos = historico.length - 1; sujo = true;
    guardarLocal(); miniaturasDepois();
  }
  let tReg = null;
  const registrarDepois = () => { clearTimeout(tReg); tReg = setTimeout(registrar, 450); };
  function voltar(passo) {
    clearTimeout(tReg); registrar();
    const n = pos + passo;
    if (n < 0 || n >= historico.length) return;
    pos = n; doc = JSON.parse(historico[pos]); sujo = true;
    idx = Math.min(idx, doc.slides.length - 1);
    if (sel && !elSel()) sel = null;
    tudo();
  }

  /* ---------- palco ---------- */
  function ajustarZoom() {
    const w = palco.clientWidth - 48, h = palco.clientHeight - 48;
    zoom = limitar(Math.min(w / L, h / A), 0.15, 1.5);
    medidas();
  }
  function medidas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.style.width = `${Math.round(L * zoom)}px`; canvas.style.height = `${Math.round(A * zoom)}px`;
    canvas.width = Math.round(L * zoom * dpr); canvas.height = Math.round(A * zoom * dpr);
    folha.style.width = canvas.style.width; folha.style.height = canvas.style.height;
    $('[data-zoom-ajustar]', raiz).textContent = `${Math.round(zoom * 100)}%`;
    desenhar(); posicionarDigitacao();
  }
  function desenhar() {
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(zoom * dpr, 0, 0, zoom * dpr, 0, 0);
    desenharSlide(ctx, slide(), editando);
    // seleção, alças e guias (em unidades de slide; espessura compensa o zoom)
    const u = 1 / zoom;
    for (const g of guias) {
      ctx.strokeStyle = '#ff3fa4'; ctx.lineWidth = u; ctx.setLineDash([6 * u, 4 * u]);
      ctx.beginPath(); if (g.x != null) { ctx.moveTo(g.x, 0); ctx.lineTo(g.x, A); } else { ctx.moveTo(0, g.y); ctx.lineTo(L, g.y); } ctx.stroke();
      ctx.setLineDash([]);
    }
    const el = elSel();
    if (!el || editando === el.id) return;
    ctx.strokeStyle = '#ff7a1a'; ctx.lineWidth = 2 * u;
    if (ehLinha(el)) {
      for (const [x, y] of [[el.x, el.y], [el.x2, el.y2]]) { ctx.beginPath(); ctx.arc(x, y, 7 * u, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill(); ctx.stroke(); }
      return;
    }
    const b = caixa(el);
    ctx.strokeRect(b.x, b.y, b.w, b.h);
    if (el.bloqueado) return;
    for (const [, x, y] of alcas(el)) {
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.rect(x - 6 * u, y - 6 * u, 12 * u, 12 * u); ctx.fill(); ctx.stroke();
    }
  }
  function alcas(el) {
    const b = caixa(el);
    const todas = [['nw', b.x, b.y], ['n', b.x + b.w / 2, b.y], ['ne', b.x + b.w, b.y], ['e', b.x + b.w, b.y + b.h / 2],
      ['se', b.x + b.w, b.y + b.h], ['s', b.x + b.w / 2, b.y + b.h], ['sw', b.x, b.y + b.h], ['w', b.x, b.y + b.h / 2]];
    return el.tipo === 'texto' ? todas.filter(([h]) => h !== 'n' && h !== 's') : todas;
  }
  function ponto(ev) {
    const r = canvas.getBoundingClientRect();
    return { x: (ev.clientX - r.left) / zoom, y: (ev.clientY - r.top) / zoom };
  }
  function acertar(el, p) {
    if (ehLinha(el)) {
      const { x, y, x2, y2 } = el; const dx = x2 - x, dy = y2 - y;
      const t = limitar(((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy || 1), 0, 1);
      return Math.hypot(p.x - (x + t * dx), p.y - (y + t * dy)) <= Math.max((el.espessura || 6) / 2, 12 / zoom);
    }
    const b = caixa(el);
    return p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h;
  }
  const acima = (p) => [...slide().elementos].reverse().find((e) => !e.bloqueado && acertar(e, p)) || null;

  /* ---------- arrastar, redimensionar e guias ---------- */
  function alvosGuia(el) {
    const xs = [0, L / 2, L], ys = [0, A / 2, A];
    for (const o of slide().elementos) {
      if (o.id === el.id) continue;
      const b = caixa(o); xs.push(b.x, b.x + b.w / 2, b.x + b.w); ys.push(b.y, b.y + b.h / 2, b.y + b.h);
    }
    return { xs, ys };
  }
  function encaixar(el, alvos) {
    const lim = 7 / zoom; guias = [];
    const b = caixa(el);
    let melhorX = null, melhorY = null;
    for (const [v, off] of [[b.x, 0], [b.x + b.w / 2, b.w / 2], [b.x + b.w, b.w]]) for (const a of alvos.xs) {
      const d = a - v; if (Math.abs(d) <= lim && (!melhorX || Math.abs(d) < Math.abs(melhorX.d))) melhorX = { d, a, off };
    }
    for (const [v, off] of [[b.y, 0], [b.y + b.h / 2, b.h / 2], [b.y + b.h, b.h]]) for (const a of alvos.ys) {
      const d = a - v; if (Math.abs(d) <= lim && (!melhorY || Math.abs(d) < Math.abs(melhorY.d))) melhorY = { d, a, off };
    }
    if (melhorX) { mover(el, melhorX.d, 0); guias.push({ x: melhorX.a }); }
    if (melhorY) { mover(el, 0, melhorY.d); guias.push({ y: melhorY.a }); }
  }
  function mover(el, dx, dy) { el.x += dx; el.y += dy; if (ehLinha(el)) { el.x2 += dx; el.y2 += dy; } }
  function alcaEm(el, p) {
    const r = 10 / zoom;
    if (el.bloqueado) return null;
    if (ehLinha(el)) {
      if (Math.hypot(p.x - el.x, p.y - el.y) <= r) return 'p1';
      if (Math.hypot(p.x - el.x2, p.y - el.y2) <= r) return 'p2';
      return null;
    }
    return (alcas(el).find(([, x, y]) => Math.abs(p.x - x) <= r && Math.abs(p.y - y) <= r) || [])[0] || null;
  }
  function redimensionar(el, o, h, dx, dy, livre) {
    if (h === 'p1') { el.x = arred(o.x + dx); el.y = arred(o.y + dy); return; }
    if (h === 'p2') { el.x2 = arred(o.x2 + dx); el.y2 = arred(o.y2 + dy); return; }
    const b = caixa(o);
    let { x, y, w, h: hh } = b;
    if (h.includes('e')) w = b.w + dx;
    if (h.includes('w')) { w = b.w - dx; x = b.x + dx; }
    if (h.includes('s')) hh = b.h + dy;
    if (h.includes('n')) { hh = b.h - dy; y = b.y + dy; }
    const canto = h.length === 2;
    if (el.tipo === 'texto') {
      w = Math.max(o.tamanho, w);
      if (canto) {
        const k = w / b.w;
        el.tamanho = Math.max(8, Math.round(o.tamanho * k));
        el.w = arred(b.w * k);
        el.x = h.includes('w') ? arred(b.x + b.w - el.w) : b.x;
        const nh = caixa(el).h;
        el.y = h.includes('n') ? arred(b.y + b.h - nh) : b.y;
      } else { el.w = arred(w); el.x = arred(h === 'w' ? b.x + b.w - el.w : b.x); }
      return;
    }
    const proporcao = canto && ((el.tipo === 'imagem' && !livre) || (el.tipo === 'forma' && livre));
    if (proporcao) {
      const r = b.w / b.h;
      if (Math.abs(w / b.w) > Math.abs(hh / b.h)) hh = w / r; else w = hh * r;
      if (h.includes('w')) x = b.x + b.w - w;
      if (h.includes('n')) y = b.y + b.h - hh;
    }
    el.x = arred(w < 0 ? x + w : x); el.y = arred(hh < 0 ? y + hh : y);
    el.w = arred(Math.max(10, Math.abs(w))); el.h = arred(Math.max(10, Math.abs(hh)));
  }

  canvas.addEventListener('pointerdown', (ev) => {
    if (ev.button !== 0) return;
    if (editando) terminarDigitacao();
    const p = ponto(ev);
    const atual = elSel();
    const h = atual ? alcaEm(atual, p) : null;
    if (h) acao = { tipo: 'redim', h, o: clone(atual), p0: p };
    else {
      const alvo = acima(p);
      sel = alvo?.id || null;
      if (alvo) acao = { tipo: 'mover', o: clone(alvo), p0: p, alvos: alvosGuia(alvo), moveu: false };
      painel(); camadas();
    }
    canvas.setPointerCapture(ev.pointerId);
    desenhar();
  });
  canvas.addEventListener('pointermove', (ev) => {
    const p = ponto(ev);
    if (!acao) {
      const atual = elSel();
      const h = atual && alcaEm(atual, p);
      const cursor = { n: 'ns', s: 'ns', e: 'ew', w: 'ew', ne: 'nesw', sw: 'nesw', nw: 'nwse', se: 'nwse', p1: 'crosshair', p2: 'crosshair' }[h];
      canvas.style.cursor = cursor ? (cursor.length > 4 ? cursor : `${cursor}-resize`) : acima(p) ? 'move' : 'default';
      return;
    }
    const el = elSel(); if (!el) return;
    const dx = p.x - acao.p0.x, dy = p.y - acao.p0.y;
    if (acao.tipo === 'mover') {
      if (!acao.moveu && Math.hypot(dx, dy) < 3 / zoom) return;
      acao.moveu = true;
      el.x = acao.o.x; el.y = acao.o.y; if (ehLinha(el)) { el.x2 = acao.o.x2; el.y2 = acao.o.y2; }
      mover(el, ev.shiftKey && Math.abs(dx) < Math.abs(dy) ? 0 : dx, ev.shiftKey && Math.abs(dx) >= Math.abs(dy) ? 0 : dy);
      if (!ev.altKey) encaixar(el, acao.alvos); else guias = [];
      el.x = arred(el.x); el.y = arred(el.y);
    } else redimensionar(el, acao.o, acao.h, dx, dy, ev.shiftKey);
    desenhar(); atualizarCampos();
  });
  const soltar = () => {
    if (!acao) return;
    acao = null; guias = [];
    desenhar(); registrar();
  };
  canvas.addEventListener('pointerup', soltar);
  canvas.addEventListener('pointercancel', soltar);
  canvas.addEventListener('lostpointercapture', soltar);
  canvas.addEventListener('dblclick', (ev) => {
    const el = acima(ponto(ev));
    if (el?.tipo === 'texto') { sel = el.id; comecarDigitacao(); }
  });

  /* ---------- digitar direto no slide ---------- */
  function posicionarDigitacao() {
    const el = editando && slide().elementos.find((e) => e.id === editando);
    if (!el) return;
    Object.assign(digitar.style, {
      left: `${el.x * zoom}px`, top: `${el.y * zoom}px`, width: `${el.w * zoom}px`,
      font: `${el.italico ? 'italic ' : ''}${el.peso} ${el.tamanho * zoom}px/${el.entrelinha} "${el.fonte}"`,
      letterSpacing: `${(el.espacamento || 0) * zoom}px`, color: el.cor, textAlign: el.alinhar, textTransform: el.caixa === 'alta' ? 'uppercase' : 'none',
    });
    digitar.style.height = 'auto';
    digitar.style.height = `${digitar.scrollHeight + 4}px`;
  }
  function comecarDigitacao() {
    const el = elSel(); if (!el || el.tipo !== 'texto') return;
    editando = el.id;
    digitar.hidden = false; digitar.value = el.texto;
    posicionarDigitacao(); desenhar();
    digitar.focus(); digitar.select();
  }
  function terminarDigitacao() {
    if (!editando) return;
    editando = null; digitar.hidden = true;
    desenhar(); registrar(); painel();
  }
  digitar.addEventListener('input', () => {
    const el = slide().elementos.find((e) => e.id === editando); if (!el) return;
    el.texto = digitar.value; posicionarDigitacao(); miniaturasDepois();
  });
  digitar.addEventListener('blur', terminarDigitacao);
  digitar.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') { ev.preventDefault(); ev.stopPropagation(); digitar.blur(); } });

  /* ---------- adicionar ---------- */
  function adicionar(el) {
    slide().elementos.push(el); sel = el.id;
    registrar(); desenhar(); painel(); camadas();
  }
  function novoTexto() {
    const f = slide().fundo;
    adicionar(texto({ texto: 'Escreva aqui', tamanho: 64, cor: escuro(f) ? COR.branco : COR.void, destaque: escuro(f) ? COR.azul : COR.azulTinta, x: 140, y: 660, w: 800, alinhar: 'center' }));
    comecarDigitacao();
  }
  async function adicionarArquivos(arquivos) {
    const lista = [...arquivos].filter((a) => /^image\//.test(a.type));
    if (!lista.length) return toast('Isso não é uma imagem.', 'erro');
    for (const a of lista) {
      if (a.size > 25 * 1024 * 1024) { toast(`${a.name}: maior que 25 MB.`, 'erro'); continue; }
      toast('Enviando a imagem…', 'info');
      try {
        const pr = await prepararArquivo(a);
        const url = await enviar(`horus/estudio/arquivos/${Date.now()}-${uid()}.${pr.ext}`, pr.blob, pr.tipo);
        const r = Math.min(1, 900 / pr.w, 1200 / pr.h);
        const w = Math.round(pr.w * r), h = Math.round(pr.h * r);
        imagem(url);
        adicionar({ id: uid(), tipo: 'imagem', nome: a.name, src: url, x: Math.round((L - w) / 2), y: Math.round((A - h) / 2), w, h, ajuste: 'cobrir', raio: 0, opacidade: 1 });
      } catch (e) { toast(erroAmigavel(e), 'erro'); }
    }
  }
  palco.addEventListener('pointerdown', (ev) => {
    if (ev.target !== palco && ev.target !== folha) return;
    if (editando) terminarDigitacao();
    if (sel) { sel = null; desenhar(); painel(); }
  });
  palco.addEventListener('dragover', (ev) => { ev.preventDefault(); palco.classList.add('soltar'); });
  palco.addEventListener('dragleave', () => palco.classList.remove('soltar'));
  palco.addEventListener('drop', (ev) => { ev.preventDefault(); palco.classList.remove('soltar'); if (ev.dataTransfer?.files?.length) adicionarArquivos(ev.dataTransfer.files); });
  function colar(ev) {
    if (!raiz.isConnected || ev.target.closest?.('input, textarea')) return;
    const fs = [...(ev.clipboardData?.files || [])];
    if (fs.length) { ev.preventDefault(); adicionarArquivos(fs); }
  }
  document.addEventListener('paste', colar);

  /* ---------- operações no selecionado ---------- */
  function apagar() {
    const el = elSel(); if (!el) return;
    slide().elementos = slide().elementos.filter((e) => e.id !== el.id); sel = null;
    registrar(); desenhar(); painel(); camadas();
  }
  function duplicar(el = elSel()) {
    if (!el) return;
    const c = { ...clone(el), id: uid(), bloqueado: false };
    mover(c, 24, 24);
    adicionar(c);
  }
  function camada(dir) {
    const els = slide().elementos, i = els.findIndex((e) => e.id === sel);
    if (i < 0) return;
    const j = dir === 'topo' ? els.length - 1 : dir === 'fundo' ? 0 : limitar(i + dir, 0, els.length - 1);
    const [el] = els.splice(i, 1); els.splice(j, 0, el);
    registrar(); desenhar(); camadas();
  }

  /* ---------- slides (coluna da esquerda) ---------- */
  let tMini = null;
  function miniaturasDepois() { clearTimeout(tMini); tMini = setTimeout(miniaturas, 220); }
  function miniaturas() {
    $$('[data-mini]', raiz).forEach((c) => {
      const s = doc.slides[Number(c.dataset.mini)]; if (!s) return;
      const g = c.getContext('2d'); const k = c.width / L;
      g.setTransform(k, 0, 0, k, 0, 0); desenharSlide(g, s);
    });
  }
  function listaSlides() {
    const dpr = window.devicePixelRatio || 1;
    $('[data-slides]', raiz).innerHTML = `${doc.slides.map((s, k) => `<div class="est-mini ${k === idx ? 'on' : ''}" data-ir="${k}">
        <span class="est-mini-n">${k + 1}</span>
        <canvas data-mini="${k}" width="${Math.round(96 * dpr)}" height="${Math.round(128 * dpr)}" aria-label="Slide ${k + 1}"></canvas>
        <div class="est-mini-acoes">
          <button data-s-cima="${k}" title="Subir" aria-label="Subir slide ${k + 1}"${k === 0 ? ' disabled' : ''}>${icone('setac')}</button>
          <button data-s-baixo="${k}" title="Descer" aria-label="Descer slide ${k + 1}"${k === doc.slides.length - 1 ? ' disabled' : ''}>${icone('setab')}</button>
          <button data-s-dup="${k}" title="Duplicar" aria-label="Duplicar slide ${k + 1}">${icone('copiar')}</button>
          <button data-s-del="${k}" title="Apagar" aria-label="Apagar slide ${k + 1}"${doc.slides.length < 2 ? ' disabled' : ''}>${icone('lixo')}</button>
        </div></div>`).join('')}
      <button class="btn sm est-novo-slide" data-novo-slide>${icone('mais')}Slide</button>
      <p class="est-dica">${doc.slides.length} de 20 slides · 1080 × 1440</p>`;
    miniaturas();
  }
  $('[data-slides]', raiz).addEventListener('click', async (ev) => {
    const b = ev.target.closest('button');
    const n = (k) => Number(b.dataset[k]);
    if (b?.dataset.sCima != null) { const k = n('sCima'); [doc.slides[k - 1], doc.slides[k]] = [doc.slides[k], doc.slides[k - 1]]; idx = k - 1; registrar(); return tudo(); }
    if (b?.dataset.sBaixo != null) { const k = n('sBaixo'); [doc.slides[k + 1], doc.slides[k]] = [doc.slides[k], doc.slides[k + 1]]; idx = k + 1; registrar(); return tudo(); }
    if (b?.dataset.sDup != null) {
      if (doc.slides.length >= 20) return toast('O Instagram aceita até 20 slides.', 'erro');
      const k = n('sDup'); const c = clone(doc.slides[k]); c.id = uid(); c.elementos.forEach((e) => (e.id = uid()));
      doc.slides.splice(k + 1, 0, c); idx = k + 1; sel = null; registrar(); return tudo();
    }
    if (b?.dataset.sDel != null) {
      if (!(await confirmar('Apagar este slide?', 'Dá pra desfazer com Ctrl+Z.', { rotulo: 'Apagar', perigo: true }))) return;
      doc.slides.splice(n('sDel'), 1); idx = Math.min(idx, doc.slides.length - 1); sel = null; registrar(); return tudo();
    }
    if (b?.hasAttribute('data-novo-slide')) {
      if (doc.slides.length >= 20) return toast('O Instagram aceita até 20 slides.', 'erro');
      menu(b, MODELOS.map(([, rot, fn]) => ({ rotulo: rot, icone: 'quadros', fn: () => { doc.slides.splice(idx + 1, 0, fn()); idx += 1; sel = null; registrar(); tudo(); } })));
      return;
    }
    const ir = ev.target.closest('[data-ir]');
    if (ir) { if (editando) terminarDigitacao(); idx = Number(ir.dataset.ir); sel = null; tudo(); }
  });

  /* ---------- painel da direita ---------- */
  const corBotoes = (prop, valor, nulo = false) => `<div class="est-cores">${nulo ? `<button class="est-cor nenhuma ${!valor ? 'on' : ''}" data-cor="${prop}" data-valor="" title="Nenhuma" aria-label="Nenhuma"></button>` : ''}${PALETA.map((c) => `<button class="est-cor ${String(valor).toLowerCase() === c ? 'on' : ''}" style="--c:${c}" data-cor="${prop}" data-valor="${c}" title="${c}" aria-label="Cor ${c}"></button>`).join('')}<input type="color" data-p="${prop}" value="${valor || '#000000'}" aria-label="Outra cor"></div>`;
  const num = (prop, rot, v, { min = -9999, max = 9999, passo = 1 } = {}) => `<label class="est-num"><span>${rot}</span><input class="inp" type="number" data-p="${prop}" data-num value="${Math.round(v * 10) / 10}" min="${min}" max="${max}" step="${passo}"></label>`;
  const faixa = (prop, rot, v, min, max, passo, fmt = (x) => x) => `<label class="est-faixa"><span>${rot} <b data-eco="${prop}">${fmt(v)}</b></span><input type="range" data-p="${prop}" data-num min="${min}" max="${max}" step="${passo}" value="${v}"></label>`;
  const opcoesSel = (prop, lista, v) => `<select class="sel" data-p="${prop}">${lista.map(([k, r]) => `<option value="${k}"${String(k) === String(v) ? ' selected' : ''}>${esc(r)}</option>`).join('')}</select>`;
  const seg = (prop, lista, v) => `<div class="segmento est-seg">${lista.map(([k, r, t]) => `<button data-seg="${prop}" data-valor="${k}" class="${v === k ? 'on' : ''}" title="${esc(t || r)}">${r}</button>`).join('')}</div>`;
  const bloco = (titulo, html) => `<section class="est-bloco"><h4>${titulo}</h4>${html}</section>`;

  function painel() {
    const el = elSel();
    const p = $('[data-props]', raiz);
    if (!el) { p.innerHTML = painelSlide(); ligarPainel(p); camadas(); return; }
    let html = `<div class="est-props-cab"><b>${esc(ROTULO_TIPO[el.tipo])}${el.tipo === 'forma' ? ` · ${FORMAS[el.forma]}` : ''}</b>
      <button class="btn sm icone fantasma" data-desselecionar title="Voltar ao slide (Esc)" aria-label="Voltar ao slide">${icone('x')}</button></div>`;
    if (el.tipo === 'texto') {
      const alerta = el.tamanho < PISO ? `<p class="est-alerta vermelho">${icone('alerta')}Abaixo do piso de ${PISO} px: ninguém lê no celular.</p>`
        : el.tamanho < CORPO ? `<p class="est-alerta">${icone('info')}Corpo de texto pede ${CORPO} px ou mais. Rótulo e rodapé podem ficar entre ${PISO} e ${CORPO}.</p>` : '';
      html += bloco('Texto', `<textarea class="txt" rows="4" data-p="texto">${esc(el.texto)}</textarea>
        <p class="est-dica">Entre *asteriscos* fica na cor de destaque. Clique duas vezes no slide para digitar ali.</p>
        <div class="est-linha">${opcoesSel('fonte', FONTES.map((f) => [f, f]), el.fonte)}${opcoesSel('peso', PESOS, el.peso)}</div>
        ${faixa('tamanho', 'Tamanho', el.tamanho, 16, 220, 1, (x) => `${x} px`)}${alerta}
        ${seg('alinhar', [['left', '⇤', 'À esquerda'], ['center', '↔', 'Centralizado'], ['right', '⇥', 'À direita']], el.alinhar)}
        ${faixa('entrelinha', 'Entrelinha', el.entrelinha, 0.8, 2, 0.05, (x) => Number(x).toFixed(2))}
        ${faixa('espacamento', 'Espaço entre letras', el.espacamento || 0, -4, 24, 0.5, (x) => `${x} px`)}
        <div class="est-linha"><label class="check"><input type="checkbox" data-p="caixa" data-sim="alta" ${el.caixa === 'alta' ? 'checked' : ''}> CAIXA ALTA</label>
          <label class="check"><input type="checkbox" data-p="italico" ${el.italico ? 'checked' : ''}> Itálico</label></div>`)
        + bloco('Cor', corBotoes('cor', el.cor))
        + bloco('Destaque', `${corBotoes('destaque', el.destaque)}${seg('destaqueEstilo', [['cor', 'Cor'], ['marcador', 'Marcador'], ['sublinhado', 'Sublinhado']], el.destaqueEstilo)}`)
        + bloco('Caixa atrás do texto', `${corBotoes('caixaFundo', el.caixaFundo, true)}${el.caixaFundo ? faixa('caixaRaio', 'Arredondado', el.caixaRaio ?? 18, 0, 80, 1, (x) => `${x} px`) : ''}`);
    }
    if (el.tipo === 'forma') {
      if (ehLinha(el)) {
        html += bloco('Linha', `${seg('forma', [['linha', 'Linha'], ['seta', 'Seta']], el.forma)}${corBotoes('borda', el.borda)}${faixa('espessura', 'Espessura', el.espessura, 2, 40, 1, (x) => `${x} px`)}`);
      } else {
        html += bloco('Forma', `${seg('forma', [['ret', 'Retângulo'], ['elipse', 'Círculo']], el.forma)}${el.forma === 'ret' ? faixa('raio', 'Arredondado', el.raio || 0, 0, 400, 1, (x) => `${x} px`) : ''}`)
          + bloco('Preenchimento', corBotoes('preenchimento', el.preenchimento, true))
          + bloco('Borda', `${corBotoes('borda', el.borda, true)}${el.borda ? faixa('espessura', 'Espessura', el.espessura || 4, 1, 40, 1, (x) => `${x} px`) : ''}`);
      }
    }
    if (el.tipo === 'imagem') {
      html += bloco('Imagem', `${seg('ajuste', [['cobrir', 'Preencher', 'Corta o que sobra'], ['conter', 'Inteira', 'Mostra a imagem toda']], el.ajuste)}
        ${faixa('raio', 'Arredondado', el.raio || 0, 0, 300, 1, (x) => `${x} px`)}
        <div class="est-linha"><button class="btn sm" data-ocupar>${icone('grade')}Ocupar o slide</button><button class="btn sm" data-trocar>${icone('upload')}Trocar</button></div>`);
    }
    html += bloco('Transparência', faixa('opacidade', 'Opacidade', Math.round((el.opacidade ?? 1) * 100), 5, 100, 1, (x) => `${x}%`));
    html += bloco('Posição', ehLinha(el)
      ? `<div class="est-grade4">${num('x', 'X1', el.x)}${num('y', 'Y1', el.y)}${num('x2', 'X2', el.x2)}${num('y2', 'Y2', el.y2)}</div>`
      : `<div class="est-grade4">${num('x', 'X', el.x)}${num('y', 'Y', el.y)}${num('w', 'Larg.', el.w, { min: 10 })}${el.tipo !== 'texto' ? num('h', 'Alt.', el.h, { min: 10 }) : ''}</div>
         <div class="est-linha"><button class="btn sm" data-centro="h" title="Centralizar na horizontal">↔ Centro</button><button class="btn sm" data-centro="v" title="Centralizar na vertical">↕ Meio</button></div>`);
    html += bloco('Camada', `<div class="est-linha est-quebra">
        <button class="btn sm" data-camada="topo" title="Trazer para a frente (Ctrl+])">${icone('setac')}Frente</button>
        <button class="btn sm" data-camada="fundo" title="Mandar para trás (Ctrl+[)">${icone('setab')}Trás</button>
        <button class="btn sm" data-dup title="Duplicar (Ctrl+D)">${icone('copiar')}Duplicar</button>
        <button class="btn sm" data-trava>${icone('cadeado')}${el.bloqueado ? 'Destravar' : 'Travar'}</button>
        <button class="btn sm perigo" data-apagar title="Apagar (Delete)">${icone('lixo')}Apagar</button></div>`);
    p.innerHTML = html;
    ligarPainel(p);
  }
  function painelSlide() {
    const s = slide();
    const av = avisos(doc);
    return `<div class="est-props-cab"><b>Slide ${idx + 1} de ${doc.slides.length}</b></div>`
      + bloco('Fundo', `<div class="est-fundos">${FUNDOS.map(([rot, f]) => `<button class="est-fundo ${JSON.stringify(f) === JSON.stringify(s.fundo) ? 'on' : ''}" data-fundo='${JSON.stringify(f)}' style="background:${f.tipo === 'gradiente' ? `linear-gradient(${f.angulo}deg, ${f.de}, ${f.para})` : f.cor}" title="${rot}"><span>${rot}</span></button>`).join('')}</div>
        <label class="est-num"><span>Outra cor</span><input type="color" data-fundo-cor value="${s.fundo.tipo === 'cor' ? s.fundo.cor : '#0e0918'}"></label>`)
      + bloco('Camadas <span class="dim">(clique para escolher)</span>', '<div class="est-camadas" data-camadas></div>')
      + bloco('Legenda do post', `<textarea class="txt" rows="6" data-legenda placeholder="A legenda que vai com o post no Instagram">${esc(legenda)}</textarea>
        <p class="est-dica" data-legenda-conta>${legenda.length} / 2.200 caracteres</p>`)
      + bloco('Conferência', av.length ? `<ul class="est-avisos">${av.map((a) => `<li>${icone('alerta')}${esc(a)}</li>`).join('')}</ul>` : `<p class="est-dica ok">${icone('check')}Nada abaixo do piso de leitura, nada saindo da borda.</p>`)
      + bloco('Atalhos', `<p class="est-dica">Duplo clique: digitar · Delete: apagar · Ctrl+D: duplicar · Ctrl+Z: desfazer · setas: mover (Shift = 10 px) · Alt ao arrastar: sem ímã · Shift no canto: livre ou proporcional · PageUp/PageDown: slides</p>`);
  }
  function camadas() {
    const c = $('[data-camadas]', raiz); if (!c) return;
    const els = [...slide().elementos].reverse();
    c.innerHTML = els.length ? els.map((e) => `<button class="est-camada ${e.id === sel ? 'on' : ''}" data-escolher="${e.id}">
        ${icone(e.tipo === 'texto' ? 'texto' : e.tipo === 'imagem' ? 'imagem' : 'forma')}
        <span>${esc(e.tipo === 'texto' ? String(e.texto).replace(/\*/g, '').slice(0, 40) || 'Texto' : e.nome || (e.tipo === 'forma' ? FORMAS[e.forma] : 'Imagem'))}</span>
        ${e.bloqueado ? icone('cadeado') : ''}</button>`).join('') : '<p class="est-dica">Slide vazio. Use Texto, Forma ou Imagem lá em cima.</p>';
  }
  /** Atualiza os números do painel enquanto arrasta, sem redesenhar o painel. */
  function atualizarCampos() {
    const el = elSel(); if (!el) return;
    $$('[data-props] [data-p]', raiz).forEach((i) => {
      if (document.activeElement === i) return;
      const v = el[i.dataset.p];
      if (i.type === 'number' || i.type === 'range') i.value = i.dataset.p === 'opacidade' ? Math.round((el.opacidade ?? 1) * 100) : Math.round((v ?? 0) * 10) / 10;
    });
    $$('[data-props] [data-eco]', raiz).forEach((b) => { if (b.dataset.eco === 'tamanho') b.textContent = `${el.tamanho} px`; });
  }
  function ligarPainel(p) {
    p.oninput = (ev) => {
      const i = ev.target;
      if (i.matches('[data-legenda]')) {
        legenda = i.value; $('[data-legenda-conta]', p).textContent = `${legenda.length} / 2.200 caracteres`;
        sujo = true; guardarLocal(); return;
      }
      if (i.matches('[data-fundo-cor]')) { slide().fundo = { tipo: 'cor', cor: i.value }; desenhar(); registrarDepois(); return; }
      const el = elSel(); const prop = i.dataset.p; if (!el || !prop) return;
      let v;
      if (i.type === 'checkbox') v = i.dataset.sim ? (i.checked ? i.dataset.sim : 'normal') : i.checked;
      else if (i.hasAttribute('data-num')) { v = Number(i.value); if (Number.isNaN(v)) return; }
      else v = i.value;
      if (prop === 'opacidade') v = v / 100;
      if (prop === 'peso') v = Number(v);
      el[prop] = v;
      const eco = $(`[data-eco="${prop}"]`, p);
      if (eco) eco.textContent = prop === 'opacidade' ? `${i.value}%` : prop === 'entrelinha' ? Number(v).toFixed(2) : `${i.value}${['tamanho', 'espacamento', 'raio', 'caixaRaio', 'espessura'].includes(prop) ? ' px' : ''}`;
      desenhar(); miniaturasDepois(); registrarDepois();
      if (prop === 'tamanho') { const ant = $('.est-alerta', p); const precisa = v < CORPO; if (Boolean(ant) !== precisa || (ant && ant.classList.contains('vermelho') !== (v < PISO))) painelDepois(); }
    };
    p.onchange = (ev) => { if (ev.target.matches('select, input[type=checkbox], input[type=color]')) { registrar(); if (ev.target.type === 'color') painel(); } };
    p.onclick = (ev) => {
      const b = ev.target.closest('button'); if (!b) return;
      const el = elSel();
      if (b.dataset.cor != null) {
        const v = b.dataset.valor || null;
        if (el) el[b.dataset.cor] = v;
        if (b.dataset.cor === 'borda' && v && el && !el.espessura) el.espessura = 4;
        desenhar(); registrar(); painel(); return;
      }
      if (b.dataset.seg) { if (el) el[b.dataset.seg] = b.dataset.valor; desenhar(); registrar(); painel(); return; }
      if (b.dataset.fundo) { slide().fundo = JSON.parse(b.dataset.fundo); desenhar(); registrar(); painel(); return; }
      if (b.dataset.escolher) { sel = b.dataset.escolher; desenhar(); painel(); return; }
      if (b.hasAttribute('data-desselecionar')) { sel = null; desenhar(); painel(); return; }
      if (b.dataset.camada) return camada(b.dataset.camada);
      if (b.hasAttribute('data-dup')) return duplicar();
      if (b.hasAttribute('data-apagar')) return apagar();
      if (b.hasAttribute('data-trava')) { el.bloqueado = !el.bloqueado; registrar(); desenhar(); painel(); return; }
      if (b.hasAttribute('data-ocupar')) { Object.assign(el, { x: 0, y: 0, w: L, h: A, raio: 0 }); camada('fundo'); desenhar(); painel(); return; }
      if (b.hasAttribute('data-trocar')) { trocando = el.id; $('[data-arquivo]', raiz).click(); return; }
      if (b.dataset.centro) {
        const bx = caixa(el);
        if (b.dataset.centro === 'h') mover(el, Math.round((L - bx.w) / 2 - bx.x), 0); else mover(el, 0, Math.round((A - bx.h) / 2 - bx.y));
        desenhar(); registrar(); atualizarCampos();
      }
    };
  }
  let tPainel = null;
  const painelDepois = () => { clearTimeout(tPainel); tPainel = setTimeout(painel, 300); };

  // Trocar a imagem de um elemento: reaproveita o seletor de arquivo
  let trocando = null;
  const entradaArquivo = $('[data-arquivo]', raiz);
  entradaArquivo.onchange = async (ev) => {
    const arqs = ev.target.files; ev.target.value = '';
    if (!trocando) return adicionarArquivos(arqs);
    const alvo = slide().elementos.find((e) => e.id === trocando); trocando = null;
    if (!alvo || !arqs?.[0]) return;
    try {
      const pr = await prepararArquivo(arqs[0]);
      alvo.src = await enviar(`horus/estudio/arquivos/${Date.now()}-${uid()}.${pr.ext}`, pr.blob, pr.tipo);
      alvo.nome = arqs[0].name; alvo.bloqueado = false;
      imagem(alvo.src); registrar(); desenhar(); painel(); camadas();
    } catch (e) { toast(erroAmigavel(e), 'erro'); }
  };

  /* ---------- barra de cima ---------- */
  $('[data-titulo]', raiz).oninput = (ev) => { titulo = ev.target.value; sujo = true; guardarLocal(); };
  $('[data-add-texto]', raiz).onclick = novoTexto;
  $('[data-add-imagem]', raiz).onclick = () => { trocando = null; entradaArquivo.click(); };
  $('[data-add-forma]', raiz).onclick = (ev) => menu(ev.currentTarget, Object.entries(FORMAS).map(([k, r]) => ({
    rotulo: r, icone: 'forma', fn: () => adicionar(forma(k, k === 'linha' || k === 'seta' ? {} : { preenchimento: escuro(slide().fundo) ? COR.azul : COR.azulTinta })),
  })));
  $('[data-desfazer]', raiz).onclick = () => voltar(-1);
  $('[data-refazer]', raiz).onclick = () => voltar(1);
  $('[data-zoom-mais]', raiz).onclick = () => { zoom = limitar(zoom * 1.2, 0.15, 2); medidas(); };
  $('[data-zoom-menos]', raiz).onclick = () => { zoom = limitar(zoom / 1.2, 0.15, 2); medidas(); };
  $('[data-zoom-ajustar]', raiz).onclick = ajustarZoom;
  $('[data-ver]', raiz).onclick = async (ev) => {
    const b = ev.currentTarget;
    botaoCarregando(b, true, 'Gerando…');
    try {
      const urls = [];
      for (const s of doc.slides) urls.push((await renderizar(s, 1)).toDataURL('image/jpeg', 0.92));
      abrirVisor(urls, { inicio: idx, titulo: titulo || 'Post sem nome' });
    } catch (e) { toast(erroAmigavel(e), 'erro'); } finally { botaoCarregando(b, false); }
  };
  $('[data-salvar]', raiz).onclick = (ev) => salvar(ev.currentTarget);
  $('[data-fechar]', raiz).onclick = () => fechar();

  /* ---------- salvar no Hounder ---------- */
  async function salvar(botao = $('[data-salvar]', raiz)) {
    if (salvando) return;
    if (editando) terminarDigitacao();
    if (!titulo.trim()) {
      const t = await perguntar('Nome do post', { placeholder: 'Ex.: Turbinar não é anúncio', subtitulo: 'Só pra achar depois; não vai pro Instagram.' });
      if (!t) return;
      titulo = t.trim(); $('[data-titulo]', raiz).value = titulo;
    }
    const av = avisos(doc).filter((a) => /piso/.test(a));
    if (av.length && !(await confirmar('Tem texto abaixo do piso de leitura', `${av.join(' ')} Salvar mesmo assim?`, { rotulo: 'Salvar mesmo assim' }))) return;
    salvando = true; botaoCarregando(botao, true, 'Salvando…');
    try {
      const tipoMidia = doc.slides.length > 1 ? 'carrossel' : 'imagem';
      if (!postId) {
        const { data, error } = await sb.from('social_posts').insert({
          marca: 'horus', semana: segundaBahia(), status: 'criando', titulo: titulo.trim(), tipo_midia: tipoMidia, legenda,
          criado_por: quem(), conteudo: { origem: 'Estúdio', autor: quem(), estudio: doc }, slides: [], previa: [],
        }).select('id').single();
        if (error) throw error;
        postId = data.id;
      }
      const v = Date.now();
      const slides = [], previa = [];
      for (const [k, s] of doc.slides.entries()) {
        const grande = await renderizar(s, 1);
        const url = await enviar(`horus/estudio/${postId}/slide-${String(k + 1).padStart(2, '0')}.jpg`, await paraBlob(grande), 'image/jpeg');
        slides.push({ url_publica: `${url}?v=${v}`, estudio: true });
        previa.push((await renderizar(s, 0.25)).toDataURL('image/jpeg', 0.72));
      }
      const voltaAprovacao = post && ['aprovado', 'agendado', 'erro'].includes(post.status);
      const conteudo = post && !publicado ? { ...(post.conteudo || {}), estudio: doc, editado_por: quem() } : { origem: 'Estúdio', autor: quem(), estudio: doc };
      const campos = { titulo: titulo.trim(), legenda, tipo_midia: tipoMidia, slides, previa, conteudo, status: 'aguardando', erro: null, pedido_ajuste: null };
      if (voltaAprovacao) campos.agendado_para = null;
      const { error } = await sb.from('social_posts').update(campos).eq('id', postId);
      if (error) throw error;
      await sb.from('social_acoes').insert({ marca: 'horus', acao: `${quem().toLowerCase()}:estudio`, post_id: postId, resumo: titulo.trim(), resultado: 'ok' });
      post = { ...(post && !publicado ? post : {}), id: postId, ...campos, atualizado_em: new Date().toISOString() };
      try { localStorage.removeItem(chaveRascunho); } catch { /* ok */ }
      sujo = false;
      toast(voltaAprovacao ? 'Salvo. Ele tinha sido aprovado: voltou para a sua aprovação.' : 'Salvo. Está em Instagram › Semana, esperando aprovação.');
      aoSalvar?.(postId);
    } catch (e) { toast(erroAmigavel(e), 'erro', { ms: 9000 }); } finally { salvando = false; botaoCarregando(botao, false); }
  }

  /* ---------- teclado ---------- */
  function tecla(ev) {
    if (!raiz.isConnected) return;
    if (document.querySelector('.visor, .modal.on, .menu-pop')) return;
    const ctrl = ev.ctrlKey || ev.metaKey;
    const digitando = ev.target.closest?.('input, textarea, select, [contenteditable]');
    if (ctrl && ev.key.toLowerCase() === 's') { ev.preventDefault(); salvar(); return; }
    if (digitando) return;
    const el = elSel();
    if (ev.key === 'Escape') { ev.preventDefault(); if (sel) { sel = null; desenhar(); painel(); } else fechar(); return; }
    if (ctrl && ev.key.toLowerCase() === 'z') { ev.preventDefault(); voltar(ev.shiftKey ? 1 : -1); return; }
    if (ctrl && ev.key.toLowerCase() === 'y') { ev.preventDefault(); voltar(1); return; }
    if (ctrl && ev.key.toLowerCase() === 'd') { ev.preventDefault(); duplicar(); return; }
    if (ctrl && ev.key.toLowerCase() === 'c' && el) { copiado = clone(el); return; }
    if (ctrl && ev.key.toLowerCase() === 'v' && copiado) { ev.preventDefault(); const c = { ...clone(copiado), id: uid() }; mover(c, 24, 24); copiado = c; adicionar(clone(c)); return; }
    if (ctrl && ev.key === ']') { ev.preventDefault(); camada('topo'); return; }
    if (ctrl && ev.key === '[') { ev.preventDefault(); camada('fundo'); return; }
    if (ev.key === 'PageDown') { ev.preventDefault(); if (idx < doc.slides.length - 1) { idx += 1; sel = null; tudo(); } return; }
    if (ev.key === 'PageUp') { ev.preventDefault(); if (idx > 0) { idx -= 1; sel = null; tudo(); } return; }
    if (ev.key.toLowerCase() === 't' && !ctrl) { ev.preventDefault(); novoTexto(); return; }
    if (!el) return;
    if (ev.key === 'Delete' || ev.key === 'Backspace') { ev.preventDefault(); apagar(); return; }
    if (ev.key === 'Enter' && el.tipo === 'texto') { ev.preventDefault(); comecarDigitacao(); return; }
    const passo = ev.shiftKey ? 10 : 1;
    const setas = { ArrowLeft: [-passo, 0], ArrowRight: [passo, 0], ArrowUp: [0, -passo], ArrowDown: [0, passo] }[ev.key];
    if (setas && !el.bloqueado) { ev.preventDefault(); mover(el, ...setas); desenhar(); atualizarCampos(); registrarDepois(); }
  }
  document.addEventListener('keydown', tecla);
  const aoRedimensionar = () => ajustarZoom();
  window.addEventListener('resize', aoRedimensionar);
  aoCarregarImagem = () => { desenhar(); miniaturasDepois(); };

  async function fechar() {
    if (editando) terminarDigitacao();
    clearTimeout(tReg); registrar();
    if (sujo && !(await confirmar('Sair sem salvar?', 'A edição fica guardada neste navegador e volta quando você abrir este post de novo.', { rotulo: 'Sair' }))) return;
    if (!sujo) { try { localStorage.removeItem(chaveRascunho); } catch { /* ok */ } }
    document.removeEventListener('keydown', tecla);
    document.removeEventListener('paste', colar);
    window.removeEventListener('resize', aoRedimensionar);
    aoCarregarImagem = null;
    document.body.classList.remove('estudio-aberto');
    raiz.remove();
  }
  function tudo() { listaSlides(); desenhar(); painel(); }

  await fontesProntas;
  sujo = false;
  listaSlides(); painel();
  requestAnimationFrame(ajustarZoom);
  if (publicado) toast('Esse post já está no ar: o que você salvar vira um post novo.', 'info', { ms: 7000 });
  return { fechar };
}
