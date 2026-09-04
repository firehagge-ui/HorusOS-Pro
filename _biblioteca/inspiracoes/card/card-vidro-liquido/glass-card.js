// ============================================================
//  glass-card.js
//  Duas responsabilidades num laco de rAF so:
//   1. Pintar o fundo iridescente da marca (azul + dourado sobre off-white)
//      num canvas 2D. Substitui o <video> do conceito original: geracao de
//      video exige plano Pro/Ultimate, e um MP4 externo seria off-brand.
//   2. Manter o duplicado refratado dentro do card registrado 1:1 com o fundo,
//      copiando o canvas de fundo para o canvas do card, que carrega o filtro
//      SVG via CSS.
// ============================================================

const bg   = document.getElementById('bg-canvas');
const bgCtx = bg.getContext('2d');

const dupContainer = document.getElementById('dup-video-container');
const dup    = document.getElementById('dup-image');
const dupCtx = dup.getContext('2d');

const card = document.querySelector('[data-glass-card]');

// O duplicado fica em 1x mesmo em retina: o custo do filtro SVG escala com o
// numero de pixels, e o que aparece pela janela do card e uma refracao macia.
const DUP_PIXEL_RATIO = 1;

// O fundo tambem: campo de bokeh macio nao ganha nada com resolucao alta, e
// isso corta o custo de preenchimento de um canvas do tamanho da viewport.
const BG_RENDER_SCALE = 0.6;

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Manchas iridescentes: cada uma deriva por seno/cosseno do tempo, entao o
// campo inteiro e um loop continuo sem emenda. Cores so da marca.
const AZUL    = [37, 99, 235];
const DOURADO = [244, 196, 48];
const BLOBS = [
  { cor: AZUL,    x: 0.22, y: 0.30, r: 0.55, ax: 0.10, ay: 0.07, fx: 0.13, fy: 0.17, ph: 0.0, a: 0.55 },
  { cor: DOURADO, x: 0.78, y: 0.35, r: 0.50, ax: 0.09, ay: 0.08, fx: 0.11, fy: 0.15, ph: 1.7, a: 0.50 },
  { cor: DOURADO, x: 0.40, y: 0.75, r: 0.45, ax: 0.12, ay: 0.06, fx: 0.17, fy: 0.12, ph: 3.1, a: 0.42 },
  { cor: AZUL,    x: 0.70, y: 0.72, r: 0.48, ax: 0.08, ay: 0.09, fx: 0.14, fy: 0.10, ph: 4.6, a: 0.48 },
  { cor: AZUL,    x: 0.50, y: 0.12, r: 0.40, ax: 0.11, ay: 0.05, fx: 0.10, fy: 0.19, ph: 2.3, a: 0.35 },
  { cor: DOURADO, x: 0.12, y: 0.62, r: 0.42, ax: 0.07, ay: 0.08, fx: 0.16, fy: 0.13, ph: 5.2, a: 0.38 },
];

function sizeBg() {
  const w = Math.max(1, Math.round(window.innerWidth  * BG_RENDER_SCALE));
  const h = Math.max(1, Math.round(window.innerHeight * BG_RENDER_SCALE));
  if (bg.width !== w || bg.height !== h) { bg.width = w; bg.height = h; }
}

function paintBg(t) {
  const w = bg.width, h = bg.height;
  const min = Math.min(w, h);

  // base off-white, um pouco mais clara que o --osso para o texto escuro respirar
  bgCtx.globalCompositeOperation = 'source-over';
  bgCtx.fillStyle = '#eef0f3';
  bgCtx.fillRect(0, 0, w, h);

  for (const b of BLOBS) {
    const cx = (b.x + b.ax * Math.sin(t * b.fx + b.ph)) * w;
    const cy = (b.y + b.ay * Math.cos(t * b.fy + b.ph)) * h;
    const rad = b.r * min * (0.9 + 0.1 * Math.sin(t * 0.09 + b.ph));
    const g = bgCtx.createRadialGradient(cx, cy, 0, cx, cy, rad);
    const [r, gg, bl] = b.cor;
    g.addColorStop(0,   `rgba(${r},${gg},${bl},${b.a})`);
    g.addColorStop(0.6, `rgba(${r},${gg},${bl},${b.a * 0.35})`);
    g.addColorStop(1,   `rgba(${r},${gg},${bl},0)`);
    bgCtx.fillStyle = g;
    bgCtx.fillRect(0, 0, w, h);
  }
}

function frame(now) {
  const t = now / 1000;
  sizeBg();
  if (!reduce) paintBg(t);

  const rect = card.getBoundingClientRect();
  if (rect.width && rect.height) {
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;

    // O duplicado e do tamanho da VIEWPORT, nao do card. O filtro desloca cada
    // canal por uma quantidade diferente, entao as arestas do proprio elemento
    // filtrado mostram bandas de separacao de canal. No tamanho da viewport
    // essas bandas caem fora do card e so a refracao limpa aparece.
    dupContainer.style.left   = `${-rect.left}px`;
    dupContainer.style.top    = `${-rect.top}px`;
    dupContainer.style.width  = `${vw}px`;
    dupContainer.style.height = `${vh}px`;

    const w = Math.round(vw * DUP_PIXEL_RATIO);
    const h = Math.round(vh * DUP_PIXEL_RATIO);
    if (dup.width !== w || dup.height !== h) { dup.width = w; dup.height = h; }

    try {
      // Copia o fundo (backing store menor) esticado para a viewport: mesma
      // transformacao que o CSS aplica ao bg-canvas, entao fica registrado 1:1.
      dupCtx.drawImage(bg, 0, 0, bg.width, bg.height, 0, 0, w, h);
    } catch (e) { /* quadro ainda nao desenhavel */ }
  }

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
