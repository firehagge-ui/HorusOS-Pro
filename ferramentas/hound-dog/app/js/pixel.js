/* =============================================================================
   HOUNDER — o escritório em pixel art da Mesa de agentes.
   Pedido do Marcelo (30/09): os especialistas como bonecos pixelados que se
   mexem de acordo com o que está acontecendo.
   Quarta versão (01/10): o cenário é o palco que o Marcelo gerou no ChatGPT
   (manhã, tarde e noite, em assets/escritorio/), escolhido pela hora do dia.
   Cinco mesas; os especialistas sentam nas cadeiras e as que sobram ficam
   vazias (o time tem vaga). O boneco é desenhado em código, pixel a pixel,
   na escala do palco (1 pixel do boneco = 4 do palco), de três quartos e
   virado pro monitor, e fica ENTRE o palco e a camada da frente (mesa,
   monitores, canecas, plantas), recortada por uma máscara de cada palco.
   Acabamento do boneco: sombra da franja na pele, luz fria do monitor na
   borda, contorno colorido (a cor vizinha escurecida) e a cor da hora do dia.
   Animação sutil: digitar, piscar, respirar, a luz da tela e das luminárias
   oscilando pouco, fumaça do café, poeira na luz, janelas da cidade à noite.
   Estados: trabalhando, pronto ("!"), voce ("?"), esperando (cochila, zZ),
   comemorando, parado. Para com a aba escondida, fora da tela ou com
   "reduzir movimento".
   ============================================================================= */

const PW = 2000, PH = 667; // tamanho do palco
const ESC = 4;             // 1 pixel do boneco = 4 pixels do palco
const MESA = 494;          // linha de trás do tampo no palco
const SW = 48, SH = 72, SX = 24, HY0 = 10, SMESA = 64; // folha do boneco: largura, altura, centro, topo da cabeça, linha da mesa
const TOPO = MESA - SMESA * ESC; // onde a folha começa no palco

/* As cinco cadeiras do palco. lado -1: o monitor está à esquerda (o boneco olha pra lá); +1: espelhado.
   borda = a borda do monitor virada pro boneco; caneca = onde sobe a fumaça (null = sem café). */
const ASSENTOS = [
  { cx: 342, lado: -1, borda: 311, luz: 290, caneca: [352, 474] },
  { cx: 712, lado: -1, borda: 681, luz: 630, caneca: null },
  { cx: 1060, lado: -1, borda: 1054, luz: 1000, caneca: null },
  { cx: 1335, lado: 1, borda: 1342, luz: 1385, caneca: [1287, 476] },
  { cx: 1650, lado: 1, borda: 1703, luz: 1675, caneca: null },
];
/* Quem senta onde, pelo número de especialistas (centraliza e deixa as pontas vagas) */
const ORDEM = { 1: [2], 2: [1, 3], 3: [0, 2, 4], 4: [0, 1, 3, 4], 5: [0, 1, 2, 3, 4] };
const assentosDe = (n) => ORDEM[Math.min(5, Math.max(1, n))];

/* Especialista com folha desenhada no ChatGPT (01/10): as poses recortadas em assets/escritorio/esp-<id>.webp.
   Cada pose: [x, y, largura, altura] na folha e dx (o ajuste pra pose cair no mesmo lugar da primeira).
   ax = o meio do rosto na primeira pose; escala = folha → palco. Quem não tem folha usa o boneco desenhado em código. */
const FOLHAS = {
  clinicas: { // Clara
    escala: 0.7, ax: 113,
    poses: [[0, 28, 306, 283, 0], [310, 28, 304, 283, 11], [618, 19, 306, 292, -25], [928, 28, 303, 283, -27],
      [1235, 31, 308, 280, 23], [1547, 0, 311, 311, -19], [1862, 28, 306, 283, 0], [2172, 28, 304, 283, 11]],
  },
  eventos: { // Lia
    escala: 0.565, ax: 136,
    poses: [[0, 0, 294, 365, 0], [298, 0, 280, 365, 14], [582, 0, 317, 365, -3], [903, 0, 334, 365, 7],
      [1241, 29, 302, 336, 9], [1547, 0, 349, 365, -1], [1900, 0, 294, 365, 0], [2198, 0, 280, 365, 14]],
  },
  oficinas: { // Rafa
    escala: 0.59, ax: 133,
    poses: [[0, 17, 341, 349, 0], [345, 17, 336, 349, 4], [685, 0, 356, 367, -26], [1045, 16, 331, 350, 15],
      [1380, 56, 340, 310, 29], [1724, 11, 348, 356, -9], [2076, 17, 341, 349, 0], [2421, 17, 336, 349, 4]],
  },
};
/* Todas as folhas seguem o mesmo pedido: 6 poses na mesma ordem; as duas primeiras ganham a versão piscando no fim */
for (const f of Object.values(FOLHAS)) {
  f.estado = { trabalhando: [0, 1], parado: [0], pronto: [2], voce: [3], esperando: [4], comemorando: [5] };
  f.pisca = { 0: 6, 1: 7 };
}


/** Posição de cada especialista na cena, em % da largura, pra quem desenha os balões por cima */
export function posicoesEscritorio(n) {
  const a = assentosDe(n);
  return Array.from({ length: n }, (_, i) => (i < a.length ? (ASSENTOS[a[i]].cx / PW) * 100 : ((i + 0.5) / n) * 100));
}

/* ------------------------------ cores ------------------------------ */
const clamp01 = (v) => Math.max(0, Math.min(1, v));
function hexRgb(hex) { const n = parseInt(String(hex || '#888888').replace('#', ''), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
function rgbHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
  if (mx === mn) return [0, 0, l];
  const d = mx - mn, s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
  const h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
}
function hslRgb(h, s, l) {
  h = (((h % 360) + 360) % 360) / 360;
  if (!s) { const v = Math.round(l * 255); return [v, v, v]; }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
  const f = (t) => { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < 0.5 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
  return [f(h + 1 / 3), f(h), f(h - 1 / 3)].map((v) => Math.round(v * 255));
}
function puxa(h, alvo, q) { const d = ((alvo - h + 540) % 360) - 180; return h + d * q; }
/* Rampa de 6 tons: [contorno, escuro, sombra, base, luz, brilho]. Sombra puxa pro roxo, luz pro amarelo. */
const rampas = new Map();
function rampa(hex) {
  if (rampas.has(hex)) return rampas.get(hex);
  const [h, s, l] = rgbHsl(hexRgb(hex));
  const t = (q, dl, ds, alvo) => hslRgb(puxa(h, alvo, q), clamp01(s + ds), clamp01(l + dl));
  const r = [
    t(0.35, -l * 0.66, 0.1, 265),
    t(0.12, -Math.min(0.24, l * 0.42), -0.12, 265),
    t(0.07, -Math.min(0.12, l * 0.22), -0.06, 265),
    hexRgb(hex),
    t(0.1, Math.min(0.1, (1 - l) * 0.38), -0.02, 50),
    t(0.16, Math.min(0.22, (1 - l) * 0.62), -0.08, 50),
  ];
  rampas.set(hex, r);
  return r;
}
const css = (c, a = 1) => (a >= 1 ? `rgb(${c[0]},${c[1]},${c[2]})` : `rgba(${c[0]},${c[1]},${c[2]},${a})`);

/* Luz do lampadário: de cima e da esquerda, um pouco de frente */
const LUZ = (() => { const v = [-0.5, -0.62, 0.6]; const m = Math.hypot(...v); return v.map((x) => x / m); })();
function lambert(nx, ny) { const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny)); return nx * LUZ[0] + ny * LUZ[1] + nz * LUZ[2]; }
function faixa(r, d, c = [0.9, 0.5, 0.15]) { return d > c[0] ? r[4] : d > c[1] ? r[3] : d > c[2] ? r[2] : r[1]; }

/* ------------------------------ folha de pixels (o boneco é montado aqui) ------------------------------ */
const M = { CONT: 9, CAB: 1, PELE: 2, ROUPA: 3, FONE: 4, OLHO: 5, OUTRO: 6, OCULOS: 7 };
function folha(w, h) { return { w, h, px: new Uint8ClampedArray(w * h * 4), mat: new Uint8Array(w * h) }; }
function pt(b, x, y, c, m = M.OUTRO, a = 1) {
  x = Math.floor(x); y = Math.floor(y);
  if (!c || x < 0 || y < 0 || x >= b.w || y >= b.h) return;
  const i = y * b.w + x, k = i * 4;
  if (a < 1) { // mistura por cima do que já existe (bochecha, reflexo)
    if (!b.px[k + 3]) return;
    for (let j = 0; j < 3; j++) b.px[k + j] = b.px[k + j] + (c[j] - b.px[k + j]) * a;
    return;
  }
  b.px[k] = c[0]; b.px[k + 1] = c[1]; b.px[k + 2] = c[2]; b.px[k + 3] = 255; b.mat[i] = m;
}
const cor = (c, ...a) => (typeof c === 'function' ? c(...a) : c);
function ret(b, x, y, w, h, c, m, a) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) pt(b, x + i, y + j, c, m, a); }
function elipse(b, cx, cy, rx, ry, c, m) {
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
    const nx = (x + 0.5 - cx) / rx, ny = (y + 0.5 - cy) / ry;
    if (nx * nx + ny * ny <= 1) pt(b, x, y, cor(c, nx, ny, x, y), m);
  }
}
function poli(b, pts, c, m) {
  const ys = pts.map((p) => p[1]);
  for (let y = Math.floor(Math.min(...ys)); y <= Math.ceil(Math.max(...ys)); y++) {
    const yc = y + 0.5, xs = [];
    for (let i = 0; i < pts.length; i++) {
      const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % pts.length];
      if ((ay <= yc && by > yc) || (by <= yc && ay > yc)) xs.push(ax + ((yc - ay) / (by - ay)) * (bx - ax));
    }
    xs.sort((p, q) => p - q);
    for (let k = 0; k + 1 < xs.length; k += 2) for (let x = Math.ceil(xs[k] - 0.5); x <= Math.floor(xs[k + 1] - 0.5); x++) pt(b, x, y, cor(c, x, y), m);
  }
}
/* Cilindro (braço, antebraço): sombreado como volume, não como faixa chapada */
function capsula(b, x1, y1, x2, y2, r, rp, m) {
  const dx = x2 - x1, dy = y2 - y1, L2 = dx * dx + dy * dy || 1;
  for (let y = Math.floor(Math.min(y1, y2) - r); y <= Math.ceil(Math.max(y1, y2) + r); y++) for (let x = Math.floor(Math.min(x1, x2) - r); x <= Math.ceil(Math.max(x1, x2) + r); x++) {
    const px = x + 0.5, py = y + 0.5;
    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / L2));
    const nx = (px - (x1 + dx * t)) / r, ny = (py - (y1 + dy * t)) / r;
    if (nx * nx + ny * ny <= 1) pt(b, x, y, faixa(rp, lambert(nx, ny * 0.5 - 0.2)), m);
  }
}
function linha(b, x1, y1, x2, y2, c, m) {
  const n = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), 1);
  for (let i = 0; i <= n; i++) pt(b, Math.round(x1 + ((x2 - x1) * i) / n), Math.round(y1 + ((y2 - y1) * i) / n), c, m);
}

/* Acabamentos */
function sombraDoCabelo(b, pele) {
  const { w, mat } = b, marcar = [];
  for (let i = w * 2; i < mat.length; i++) {
    if (mat[i] !== M.PELE) continue;
    const x = i % w;
    if (mat[i - w] === M.CAB || mat[i - 2 * w] === M.CAB || (x > 0 && mat[i - 1] === M.CAB) || (x < w - 1 && mat[i + 1] === M.CAB)) marcar.push(i);
  }
  for (const i of marcar) pt(b, i % w, Math.floor(i / w), pele[2], M.PELE);
}
function luzDaTela(b, forca) {
  const { w, h, px, mat } = b, fria = [140, 195, 255];
  // o monitor fica do lado esquerdo da folha (o espelho cuida dos assentos do outro lado)
  for (let y = 0; y < h; y++) for (let x = 1; x < w; x++) {
    const i = y * w + x;
    if (!px[i * 4 + 3] || px[(i - 1) * 4 + 3] || mat[i] === M.OLHO) continue;
    pt(b, x, y, fria, mat[i], forca);
    if (x < w - 1 && px[(i + 1) * 4 + 3]) pt(b, x + 1, y, fria, mat[i + 1], forca * 0.4);
  }
}
const contornos = new Map();
function contornar(b) {
  const { w, h, px } = b, src = px.slice();
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x;
    if (src[i * 4 + 3]) continue;
    let v = -1;
    for (const [ox, oy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
      const xx = x + ox, yy = y + oy;
      if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
      const j = yy * w + xx;
      if (src[j * 4 + 3] === 255) { v = j; break; }
    }
    if (v < 0) continue;
    const k = (src[v * 4] << 16) | (src[v * 4 + 1] << 8) | src[v * 4 + 2];
    let c = contornos.get(k);
    if (!c) { const [hh, s, l] = rgbHsl([src[v * 4], src[v * 4 + 1], src[v * 4 + 2]]); c = hslRgb(puxa(hh, 268, 0.18), clamp01(s * 0.5 + 0.1), Math.max(0.08, l * 0.27)); contornos.set(k, c); }
    pt(b, x, y, c, M.CONT);
  }
}
function paraCanvas(b) {
  const c = document.createElement('canvas');
  c.width = b.w; c.height = b.h;
  c.getContext('2d').putImageData(new ImageData(b.px, b.w, b.h), 0, 0);
  return c;
}


/* ------------------------------ o boneco ------------------------------ */
/* O que cada estado faz neste quadro. Tudo pequeno: a cena é viva, não agitada. */
function pose(estado, f) {
  const ps = { dy: 0, cab: 0, olhos: 'aberto', olhar: 0, boca: 'neutra', esq: 'mesa', dir: 'mesa', tecla: 0, acena: 0, tela: 0.32 };
  const pisca = f % 26 === 0;
  if (estado === 'trabalhando') {
    ps.tecla = f % 4 < 2 ? 1 : 2; ps.dy = f % 20 < 10 ? 0 : 1; ps.tela = f % 5 ? 0.38 : 0.44;
    if (pisca) ps.olhos = 'fechado';
  } else if (estado === 'pronto') {
    ps.dir = 'mao'; ps.boca = 'sorriso'; ps.olhar = 1;
    if (pisca) ps.olhos = 'fechado';
  } else if (estado === 'voce') {
    ps.dir = 'mao'; ps.acena = f % 6 < 3 ? 0 : 1; ps.boca = 'sorriso'; ps.olhar = 1;
    if (pisca) ps.olhos = 'fechado';
  } else if (estado === 'esperando') {
    ps.olhos = 'fechado'; ps.boca = 'dorme'; ps.cab = 2; ps.dy = f % 16 < 8 ? 0 : 1; ps.tela = 0.2;
  } else if (estado === 'comemorando') {
    ps.esq = 'alto'; ps.dir = 'alto'; ps.olhos = 'feliz'; ps.boca = 'aberta'; ps.dy = f % 4 < 2 ? 0 : -1; ps.olhar = 1;
  } else {
    ps.dy = f % 16 < 8 ? 0 : 1; ps.boca = 'sorriso'; ps.olhar = f % 60 < 40 ? 1 : 0;
    if (pisca) ps.olhos = 'fechado';
  }
  return ps;
}

/* Mechas da franja, puxadas pra esquerda (o lado do monitor): [x do topo esq, x do topo dir, x da ponta, y da ponta],
   relativos ao centro do rosto e ao topo da cabeça */
const FRANJAS = {
  longo: [[-11, -5, -11, 10], [-7, -1, -7, 8], [-3, 3, -3, 7], [1, 7, 0, 8], [5, 10, 5, 9]],
  coque: [[-11, -5, -10, 9], [-6, 0, -6, 7], [-1, 5, -2, 6], [4, 10, 3, 8]],
  curto: [[-11, -6, -11, 8], [-7, -1, -8, 6], [-2, 4, -3, 6], [3, 9, 2, 6]],
};

function olho(b, x, y, w, ir, pele, ps, longe, fem) {
  const esc = [34, 20, 32];
  if (ps.olhos === 'fechado') { ret(b, x, y + 3, w, 1, esc); pt(b, longe ? x - 1 : x + w, y + 2, esc); return; }
  if (ps.olhos === 'feliz') { pt(b, x, y + 3, esc); ret(b, x + 1, y + 2, w - 2, 1, esc); pt(b, x + w - 1, y + 3, esc); return; }
  ret(b, x, y + 1, w, 4, [246, 240, 232], M.OLHO);
  const iw = w - 1, ix = x + (ps.olhar ? (longe ? 1 : 1) : 0);
  ret(b, ix, y + 1, iw, 4, ir[3], M.OLHO);
  ret(b, ix, y + 1, iw, 1, ir[1], M.OLHO);
  ret(b, ix, y + 4, iw, 1, ir[4], M.OLHO);
  ret(b, ix + (iw > 2 ? 1 : 0), y + 2, iw > 2 ? 2 : 1, 2, [20, 12, 22], M.OLHO);
  pt(b, ix, y + 2, [255, 255, 255], M.OLHO);
  if (iw > 2) pt(b, ix + iw - 1, y + 4, ir[5], M.OLHO);
  ret(b, longe ? x - 1 : x, y, w + 1, 1, esc, M.OLHO);
  if (fem) pt(b, longe ? x - 2 : x + w + 1, y - 1, esc, M.OLHO);
  pt(b, longe ? x : x + w - 1, y + 5, pele[1], M.PELE);
}

function folhaCorpo(ap, ps) {
  const b = folha(SW, SH);
  const pele = rampa(ap.pele || '#e8b48a'), cab = rampa(ap.cabelo || '#3b2a20'), roupa = rampa(ap.camisa || '#3f7fd9');
  const iris = rampa(ap.olhos || '#6b4a3a'), fone = rampa('#34323f');
  const fem = ap.genero !== 'm', estilo = FRANJAS[ap.estilo] ? ap.estilo : 'curto';
  const moletom = (ap.roupa || (fem ? 'blusa' : 'moletom')) === 'moletom';
  const X = SX, HY = HY0 + ps.dy + ps.cab, S = HY0 + 25 + ps.dy;
  const fx = X - 1, fy = HY + 12; // centro do rosto
  const sombreia = (r) => (nx, ny) => faixa(r, lambert(nx, ny));

  // Cabelo de trás (longo cai atrás do ombro do lado de perto; coque no alto, atrás)
  if (estilo === 'longo') poli(b, [[X - 2, HY + 6], [X + 12, HY + 6], [X + 14, HY + 20], [X + 15, HY + 36], [X + 11, HY + 40], [X + 6, HY + 37], [X + 1, HY + 40], [X - 3, HY + 30]], (x) => (x > X + 9 ? cab[1] : cab[2]), M.CAB);
  if (estilo === 'coque') { elipse(b, X + 8, HY + 1, 5.5, 5, sombreia(cab), M.CAB); linha(b, X + 6, HY - 2, X + 10, HY + 1, cab[2], M.CAB); }

  // Capuz, pescoço e tronco de três quartos (o ombro de longe some atrás)
  if (moletom) elipse(b, X + 2, S + 1, 10, 3.5, (nx) => (nx > 0.3 ? roupa[1] : roupa[2]), M.ROUPA);
  ret(b, fx - 2, fy + 9, 6, S - fy - 7, pele[2], M.PELE); ret(b, fx - 2, fy + 9, 6, 2, pele[1], M.PELE);
  poli(b, [[X - 5, S], [X + 6, S], [X + 11, S + 1], [X + 14, S + 4], [X + 15, S + 9], [X + 15, SH], [X - 12, SH], [X - 12, S + 9], [X - 11, S + 4], [X - 8, S + 1]],
    (x, y) => faixa(roupa, lambert((x + 0.5 - X - 1) / 14, y < S + 5 ? -0.6 : -0.1)), M.ROUPA);
  linha(b, X - 8, S + 9, X - 6, S + 16, roupa[2], M.ROUPA); linha(b, X + 9, S + 8, X + 7, S + 15, roupa[1], M.ROUPA); linha(b, X + 2, S + 18, X + 4, S + 23, roupa[2], M.ROUPA);
  if (moletom) {
    poli(b, [[fx - 4, S - 1], [fx + 5, S - 1], [fx + 4, S + 2], [fx - 3, S + 2]], (x, y) => (y === S + 1 ? roupa[1] : roupa[2]), M.ROUPA);
    linha(b, fx - 2, S + 2, fx - 2, S + 8, roupa[5], M.ROUPA); linha(b, fx + 2, S + 2, fx + 2, S + 7, roupa[5], M.ROUPA);
    pt(b, fx - 2, S + 9, [200, 200, 210]); pt(b, fx + 2, S + 8, [200, 200, 210]);
  } else {
    poli(b, [[fx - 4, S - 1], [fx + 5, S - 1], [fx + 3, S + 2], [fx, S + 3], [fx - 2, S + 2]], (x) => (x > fx + 1 ? pele[2] : pele[3]), M.PELE);
    for (const [dx, dy] of [[-4, 0], [-3, 1], [-2, 2], [-1, 3], [0, 3], [1, 3], [2, 3], [3, 2], [4, 1], [5, 0]]) pt(b, fx + dx, S + dy, roupa[5], M.ROUPA);
    pt(b, fx, S + 3, [244, 204, 96]);
  }

  // Volume da cabeça e rosto de três quartos (o queixo puxa pro lado do monitor)
  elipse(b, X + 1, HY + 9, estilo === 'curto' ? 11.5 : 12, estilo === 'curto' ? 10 : 10.5, sombreia(cab), M.CAB);
  elipse(b, X + 4, HY + 11, estilo === 'curto' ? 9 : 10, estilo === 'curto' ? 8.5 : 9.5, sombreia(cab), M.CAB);
  for (let y = HY + 2; y <= HY + 24; y++) for (let x = fx - 12; x <= fx + 11; x++) {
    const ny = (y + 0.5 - fy) / 11, enc = ny > 0.15 ? 1 - (ny - 0.15) * 0.5 : 1, sh = ny > 0.15 ? (ny - 0.15) * 2.2 : 0;
    const nx = (x + 0.5 - (fx - sh)) / (10 * enc);
    if (nx * nx + ny * ny > 1) continue;
    pt(b, x, y, nx > 0.5 || ny > 0.82 ? pele[2] : nx < -0.55 && ny > -0.3 && ny < 0.35 ? pele[4] : pele[3], M.PELE);
  }

  // Sobrancelha, olhos (o de longe é mais estreito), nariz, boca, bochecha
  ret(b, fx - 8, fy - 4, 3, 1, cab[1]); ret(b, fx - 2, fy - 4, 4, 1, cab[1]);
  if (!fem) { pt(b, fx - 6, fy - 5, cab[1]); ret(b, fx - 1, fy - 5, 3, 1, cab[1]); }
  olho(b, fx - 8, fy - 2, 3, iris, pele, ps, true, fem);
  olho(b, fx - 2, fy - 2, 4, iris, pele, ps, false, fem);
  pt(b, fx - 6, fy + 4, pele[2]); pt(b, fx - 7, fy + 3, pele[4]);
  const labio = [150, 62, 66];
  if (ps.boca === 'aberta') { ret(b, fx - 6, fy + 6, 4, 2, [96, 34, 44]); pt(b, fx - 5, fy + 7, [226, 112, 112]); ret(b, fx - 6, fy + 6, 4, 1, [246, 242, 236]); }
  else if (ps.boca === 'sorriso') { pt(b, fx - 7, fy + 6, labio); ret(b, fx - 6, fy + 7, 3, 1, labio); pt(b, fx - 3, fy + 6, labio); }
  else if (ps.boca === 'dorme') pt(b, fx - 5, fy + 7, [120, 50, 56]);
  else ret(b, fx - 6, fy + 7, 3, 1, labio);
  ret(b, fx - 9, fy + 4, 2, 1, [240, 110, 120], M.PELE, 0.38); ret(b, fx + 1, fy + 4, 3, 1, [240, 110, 120], M.PELE, 0.38);

  // Franja por cima da testa, mecha do lado de longe e do lado de perto
  elipse(b, X + 1, HY + 9, estilo === 'curto' ? 11.5 : 12, estilo === 'curto' ? 10 : 10.5, (nx, ny, x, y) => (y <= HY + 3 ? faixa(cab, lambert(nx, ny)) : null), M.CAB);
  for (const [a, z, tx, ty] of FRANJAS[estilo]) {
    const y0 = HY + 2;
    poli(b, [[fx + a, y0], [fx + z, y0], [fx + tx + 0.5, HY + ty]], (x, y) => {
      const t = (y - y0) / Math.max(1, ty - 2), esq = fx + a + (tx - a) * t, dir = fx + z + (tx - z) * t;
      const u = (x + 0.5 - esq) / Math.max(1, dir - esq);
      return t > 0.78 ? cab[2] : u > 0.68 ? cab[2] : u < 0.34 && t < 0.5 ? cab[4] : cab[3];
    }, M.CAB);
  }
  if (estilo === 'curto') for (const pts of [[[X - 6, HY], [X - 1, HY - 1], [X - 5, HY - 4]], [[X, HY - 1], [X + 6, HY], [X + 4, HY - 4]], [[X + 6, HY + 1], [X + 11, HY + 3], [X + 11, HY - 2]]]) poli(b, pts, (x) => (x > pts[2][0] ? cab[2] : cab[3]), M.CAB);
  const longe = estilo === 'longo' ? [[fx - 11, HY + 4], [fx - 7, HY + 6], [fx - 8, HY + 20], [fx - 10, HY + 34], [fx - 13, HY + 26], [fx - 12, HY + 12]]
    : estilo === 'coque' ? [[fx - 11, HY + 4], [fx - 7, HY + 6], [fx - 9, HY + 16], [fx - 12, HY + 12]]
      : [[fx - 11, HY + 4], [fx - 8, HY + 5], [fx - 10, HY + 11], [fx - 12, HY + 9]];
  poli(b, longe, (x) => (x < fx - 10 ? cab[2] : cab[3]), M.CAB);
  poli(b, [[fx + 7, HY + 3], [fx + 11, HY + 5], [fx + 11, HY + 14], [fx + 8, HY + 10]], cab[2], M.CAB);
  // Brilho em arco no alto da cabeça (do lado da luminária) e fios
  for (let x = fx - 9; x <= fx + 4; x++) {
    if ((x - fx + 40) % 4 === 0) continue;
    const u = (x + 0.5 - (fx - 2)) / 8;
    if (Math.abs(u) > 1) continue;
    const y = Math.round(HY + 5 - 4 * Math.sqrt(1 - u * u));
    if (b.mat[y * SW + x] === M.CAB) { pt(b, x, y, cab[5], M.CAB); pt(b, x, y + 1, cab[4], M.CAB); }
  }
  linha(b, X + 5, HY, X + 9, HY + 4, cab[2], M.CAB);
  if (estilo === 'coque') ret(b, X + 4, HY - 2, 7, 1, [236, 124, 46]);
  sombraDoCabelo(b, pele);

  // Óculos
  if (ap.oculos) {
    const aro = [44, 36, 52];
    const lente = (x0, w) => { ret(b, x0, fy - 3, w, 1, aro, M.OCULOS); ret(b, x0, fy + 3, w, 1, aro, M.OCULOS); ret(b, x0, fy - 3, 1, 7, aro, M.OCULOS); ret(b, x0 + w - 1, fy - 3, 1, 7, aro, M.OCULOS); pt(b, x0 + 1, fy - 2, [255, 255, 255], M.OCULOS, 0.55); };
    lente(fx - 9, 5); lente(fx - 3, 6); pt(b, fx - 4, fy - 1, aro, M.OCULOS); ret(b, fx + 3, fy - 1, 5, 1, aro, M.OCULOS);
  }

  // Fone: arco por cima, concha do lado de perto com o miolo laranja aceso, a de longe aparecendo na borda, microfone
  if (ap.fone !== false) {
    for (let y = HY - 4; y < HY + 9; y++) for (let x = X - 14; x <= X + 16; x++) {
      const ox = (x + 0.5 - X - 1) / 13.5, oy = (y + 0.5 - (HY + 9)) / 11.5, ix = (x + 0.5 - X - 1) / 11.6, iy = (y + 0.5 - (HY + 9)) / 9.8;
      if (ox * ox + oy * oy <= 1 && ix * ix + iy * iy > 1) pt(b, x, y, faixa(fone, lambert(ox, oy)), M.FONE);
    }
    ret(b, X - 13, HY + 9, 2, 6, fone[1], M.FONE);
    elipse(b, X + 11, HY + 13, 3.6, 5, (nx, ny) => faixa(fone, lambert(nx * 0.8, ny)), M.FONE);
    elipse(b, X + 10.6, HY + 13, 2, 3.2, (nx, ny) => (nx * nx + ny * ny < 0.3 ? [255, 214, 130] : [246, 140, 44]), M.FONE);
    linha(b, X + 8, HY + 17, fx + 1, fy + 8, fone[2], M.FONE); ret(b, fx - 1, fy + 8, 2, 1, fone[1], M.FONE);
  }
  luzDaTela(b, ps.tela);
  contornar(b);
  return b;
}

function folhaBracos(ap, ps) {
  const b = folha(SW, SH);
  const pele = rampa(ap.pele || '#e8b48a'), roupa = rampa(ap.camisa || '#3f7fd9');
  const longa = (ap.roupa || (ap.genero === 'm' ? 'moletom' : 'blusa')) === 'moletom';
  const X = SX, S = HY0 + 25 + ps.dy;
  const sombreia = (nx, ny) => faixa(pele, lambert(nx, ny));
  const braco = (perto, tipo) => {
    const ox = perto ? X + 12 : X - 10, oy = S + 3, l = perto ? 1 : -1;
    let cot, pul;
    if (tipo === 'mao') { cot = [X + 17, S + 2]; pul = [X + 16 + ps.acena, S - 7]; }
    else if (tipo === 'alto') { cot = [X + l * 16, S + 1]; pul = [X + l * 13, S - 8]; }
    else { cot = perto ? [X + 14, S + 16] : [X - 12, S + 16]; pul = perto ? [X + 2, S + 27 - (ps.tecla === 1 ? 1 : 0)] : [X - 16, S + 26 - (ps.tecla === 2 ? 1 : 0)]; }
    if (longa) { capsula(b, ox, oy, cot[0], cot[1], 3.3, roupa, M.ROUPA); capsula(b, cot[0], cot[1], pul[0], pul[1], 2.8, roupa, M.ROUPA); }
    else {
      capsula(b, ox, oy, cot[0], cot[1], 2.6, pele, M.PELE); capsula(b, cot[0], cot[1], pul[0], pul[1], 2.4, pele, M.PELE);
      capsula(b, ox, oy, ox + (cot[0] - ox) * 0.5, oy + (cot[1] - oy) * 0.5, 3.6, roupa, M.ROUPA);
    }
    if (tipo === 'mao') {
      elipse(b, pul[0], pul[1] - 1, 2.4, 2.6, sombreia, M.PELE);
      for (const k of [-1, 0, 1]) pt(b, pul[0] + k * 1 + (k > 0 ? 1 : 0) - 1, pul[1] - 4, pele[3], M.PELE);
      pt(b, pul[0] - 3, pul[1] - 2, pele[3], M.PELE);
    } else if (tipo === 'alto') elipse(b, pul[0], pul[1], 2.6, 2.4, sombreia, M.PELE);
    else elipse(b, pul[0], pul[1], 2.8, 2, sombreia, M.PELE);
  };
  braco(false, ps.esq); braco(true, ps.dir);
  contornar(b);
  return b;
}

/* A cor da hora do dia por cima do boneco, pra ele morar no palco */
const GRADE = { noite: ['#cdbfd8', 'rgba(255,170,90,0.14)'], tarde: ['#ffe0bf', 'rgba(255,190,110,0.16)'], manha: ['#fff7ec', 'rgba(255,240,200,0.10)'] };
function graduar(c, periodo) {
  const [mult, quente] = GRADE[periodo] || GRADE.noite;
  const g = document.createElement('canvas'); g.width = c.width; g.height = c.height;
  const x = g.getContext('2d');
  x.drawImage(c, 0, 0);
  x.globalCompositeOperation = 'multiply'; x.fillStyle = mult; x.fillRect(0, 0, g.width, g.height);
  x.globalCompositeOperation = 'destination-in'; x.drawImage(c, 0, 0);
  x.globalCompositeOperation = 'source-atop';
  const lg = x.createLinearGradient(0, 0, 0, g.height * 0.6); lg.addColorStop(0, quente); lg.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = lg; x.fillRect(0, 0, g.width, g.height);
  return g;
}
const folhas = new Map();
function sprite(ap, ps, qual, periodo) {
  const chave = qual + periodo + JSON.stringify(ap) + JSON.stringify(ps);
  let c = folhas.get(chave);
  if (!c) {
    if (folhas.size > 300) folhas.clear();
    c = graduar(paraCanvas(qual === 'corpo' ? folhaCorpo(ap, ps) : folhaBracos(ap, ps)), periodo);
    folhas.set(chave, c);
  }
  return c;
}

/* ------------------------------ especialista desenhado (folha do ChatGPT) ------------------------------ */
const imgFolhas = new Map();
// Quem precisa redesenhar quando uma folha termina de carregar (a animação pode estar parada: aba em segundo plano,
// "reduzir movimento"); sem isso a cadeira ficava vazia até a próxima batida
const aoChegar = new Set();
/* null = não tem folha (usa o boneco de código); false = tem, mas ainda está carregando (a cadeira fica vazia) */
function folhaDe(id) {
  if (!FOLHAS[id]) return null;
  let reg = imgFolhas.get(id);
  if (!reg || (reg.erro && Date.now() - reg.erro > 15000)) {
    reg = { img: null, erro: 0 };
    const src = urlDe(`esp-${id}.webp`);
    imagens.delete(src); // depois de um erro, tenta de novo de verdade
    carregar(src).then((i) => { reg.img = i; aoChegar.forEach((f) => f()); }).catch(() => { reg.erro = Date.now(); });
    imgFolhas.set(id, reg);
  }
  return reg.img || false;
}
/* A pose recortada já com a cor da hora e a luz fria do monitor do lado de dentro (o lado da folha que vira pro monitor é o esquerdo) */
const posesProntas = new Map();
function poseGraduada(id, img, i, periodo) {
  const chave = `${id}|${i}|${periodo}`;
  let c = posesProntas.get(chave);
  if (c) return c;
  const [sx, sy, w, h] = FOLHAS[id].poses[i];
  const base = document.createElement('canvas'); base.width = w; base.height = h;
  base.getContext('2d').drawImage(img, sx, sy, w, h, 0, 0, w, h);
  c = graduar(base, periodo);
  const x = c.getContext('2d');
  x.globalCompositeOperation = 'source-atop';
  const fria = x.createLinearGradient(0, 0, w * 0.45, 0);
  fria.addColorStop(0, `rgba(120,170,255,${periodo === 'noite' ? 0.3 : 0.12})`); fria.addColorStop(1, 'rgba(120,170,255,0)');
  x.fillStyle = fria; x.fillRect(0, 0, w, h);
  posesProntas.set(chave, c);
  return c;
}
/* Qual pose mostrar neste quadro, e o que mexe por cima: respiração (contínua), pulinho, piscada.
   f = o quadro (passo de 250 ms, troca de pose e piscada); t = o tempo contínuo na mesma unidade (respiração suave). */
function quadroDaFolha(id, estado, f, t = f) {
  const def = FOLHAS[id], lista = def.estado[estado] || def.estado.parado;
  let i = lista[Math.floor(f / 2) % lista.length];
  if (f % 23 === 0 && def.pisca[i] != null) i = def.pisca[i];
  const resp = estado === 'comemorando' ? 0 : Math.sin(t * (estado === 'esperando' ? 0.18 : 0.3)) * 0.006;
  const pulo = estado === 'comemorando' ? -Math.max(0, Math.sin(t * 1.6)) * 4 : 0;
  return { i, resp, pulo };
}
function desenharFolha(ctx, id, img, s, estado, f, t, periodo) {
  const def = FOLHAS[id], q = quadroDaFolha(id, estado, f, t), [, , w, h, dx] = def.poses[q.i];
  const c = poseGraduada(id, img, q.i, periodo), e = def.escala;
  const alto = h * e * (1 + q.resp), base = MESA + 2 + q.pulo;
  const esq = (dx - def.ax) * e; // borda esquerda da pose em relação ao meio do rosto
  ctx.save();
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
  if (s.lado < 0) ctx.drawImage(c, s.cx + 8 + esq, base - alto, w * e, alto);
  else { ctx.translate(s.cx - 8, 0); ctx.scale(-1, 1); ctx.drawImage(c, esq, base - alto, w * e, alto); }
  ctx.restore();
}

/* Balãozinho no pixel, do lado de fora do boneco, na altura da cabeça: "!" (pronto), "?" (precisa de você), zZ, confete.
   Guardado por estado e quadro: antes era refeito a cada desenho (um dos motivos do travado). */
const efeitos = new Map();
function folhaEfeito(estado, f) {
  const passo = estado === 'esperando' ? f % 12 : estado === 'comemorando' ? f % 16 : f % 8 < 4 ? 0 : 1;
  const chave = `${estado}:${passo}`;
  if (efeitos.has(chave)) return efeitos.get(chave);
  const b = folha(16, 18);
  if (estado === 'pronto' || estado === 'voce') {
    const y = passo ? 2 : 1;
    ret(b, 3, y, 9, 9, [255, 248, 236]); ret(b, 4, y - 1, 7, 11, [255, 248, 236]); ret(b, 5, y + 10, 2, 1, [255, 248, 236]);
    ret(b, 4, y + 8, 7, 1, [233, 220, 200]);
    const c = estado === 'pronto' ? [36, 160, 96] : [232, 105, 26];
    if (estado === 'pronto') { ret(b, 7, y + 1, 1, 4, c); pt(b, 7, y + 6, c); }
    else { ret(b, 6, y + 1, 3, 1, c); pt(b, 8, y + 2, c); pt(b, 7, y + 3, c); pt(b, 7, y + 4, c); pt(b, 7, y + 6, c); }
    contornar(b);
  } else if (estado === 'esperando') {
    const z = (x, y, n) => { const c = [210, 218, 255]; ret(b, x, y, n, 1, c); for (let i = 1; i < n - 1; i++) pt(b, x + n - 1 - i, y + i, c); ret(b, x, y + n - 1, n, 1, c); };
    z(4 + Math.floor(passo / 3), 12 - passo, 4); if (passo > 5) z(9, 8 - (passo - 6), 3);
    b.alfa = 1 - passo / 12;
  } else if (estado === 'comemorando') {
    const cores = [[244, 196, 48], [255, 122, 26], [47, 163, 107], [90, 162, 240], [240, 154, 154], [167, 139, 250]];
    for (let i = 0; i < 10; i++) pt(b, (i * 5 + passo) % 16, (i * 7 + passo * 2) % 18, cores[i % cores.length]);
  } else { efeitos.set(chave, null); return null; }
  const c = paraCanvas(b); c.alfa = b.alfa ?? 1;
  efeitos.set(chave, c);
  return c;
}

/* Brilhos prontos (quente das luminárias, frio dos monitores): desenhados uma vez e só reaproveitados com transparência */
function brilho(cor, rx, ry) {
  const c = document.createElement('canvas'); c.width = rx * 2; c.height = ry * 2;
  const x = c.getContext('2d');
  x.setTransform(1, 0, 0, ry / rx, 0, 0);
  const g = x.createRadialGradient(rx, rx, 2, rx, rx, rx);
  g.addColorStop(0, `rgba(${cor},1)`); g.addColorStop(1, `rgba(${cor},0)`);
  x.fillStyle = g; x.fillRect(0, 0, rx * 2, rx * 2);
  return c;
}
let BRILHO_QUENTE = null, BRILHO_FRIO = null;

/* ------------------------------ o palco ------------------------------ */
function periodoAgora(d = new Date()) {
  const h = d.getHours() + d.getMinutes() / 60;
  return h >= 5 && h < 12 ? 'manha' : h >= 12 && h < 17.5 ? 'tarde' : 'noite';
}
const imagens = new Map();
function carregar(src) {
  if (!imagens.has(src)) imagens.set(src, new Promise((ok, falha) => { const i = new Image(); i.decoding = 'async'; i.onload = () => ok(i); i.onerror = (e) => { imagens.delete(src); falha(e); }; i.src = src; }));
  return imagens.get(src);
}
const urlDe = (nome) => new URL(`../assets/escritorio/${nome}`, import.meta.url).href;

/* A tela do mapa na parede (era o mapa-múndi): onde a Bahia é desenhada. Só os pixels azuis da tela são trocados,
   então a luminária, a planta e a moldura que ficam na frente continuam no lugar. */
const TELA_MAPA = [1662, 96, 1952, 290];
async function prepararPalco(periodo) {
  const [fundo, mascara] = await Promise.all([carregar(urlDe(`${periodo}.webp`)), carregar(urlDe(`frente-${periodo}.png`))]);
  const frente = document.createElement('canvas'); frente.width = PW; frente.height = PH;
  const x = frente.getContext('2d');
  x.drawImage(fundo, 0, 0, PW, PH);
  x.globalCompositeOperation = 'destination-in'; x.drawImage(mascara, 0, 0, PW, PH);
  const ler = document.createElement('canvas'); ler.width = PW; ler.height = PH;
  const lx = ler.getContext('2d', { willReadFrequently: true }); lx.drawImage(fundo, 0, 0, PW, PH);
  // Janelinhas acesas da cidade (pra piscar algumas à noite)
  let janelas = [];
  if (periodo === 'noite') {
    const d = lx.getImageData(700, 90, 660, 230).data, rnd = semente(5);
    for (let k = 0; k < 4000 && janelas.length < 60; k++) {
      const px = Math.floor(rnd() * 660), py = Math.floor(rnd() * 230), i = (py * 660 + px) * 4;
      if (d[i] > 200 && d[i + 1] > 150 && d[i + 2] < 140) janelas.push([700 + px - 2, 90 + py - 2]);
    }
  }
  // A máscara da tela do mapa: pixel azul da tela vira 1, o resto (luminária, planta, moldura) fica de fora
  const [mx0, my0, mx1, my1] = TELA_MAPA, mw = mx1 - mx0, mh = my1 - my0;
  const telaMapa = document.createElement('canvas'); telaMapa.width = mw; telaMapa.height = mh;
  const tm = telaMapa.getContext('2d'), dados = lx.getImageData(mx0, my0, mw, mh), m = tm.createImageData(mw, mh);
  for (let i = 0; i < dados.data.length; i += 4) {
    const r = dados.data[i], g = dados.data[i + 1], b = dados.data[i + 2];
    m.data[i + 3] = b >= r + 8 && b >= g - 4 ? 255 : 0; // azul da tela, do escuro ao claro (luminária e planta são quentes)
  }
  tm.putImageData(m, 0, 0);
  return { fundo, frente, janelas, periodo, telaMapa };
}
function semente(n) { let s = n >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

/* ------------------------------ o mapa da Bahia ------------------------------ */
// Contorno simplificado do estado (lon, lat), no sentido horário a partir da divisa com Sergipe no litoral
const BAHIA = [[-37.35, -11.45], [-37.75, -11.0], [-38.0, -10.4], [-38.2, -9.7], [-38.5, -9.3], [-39.2, -8.75], [-40.0, -9.3], [-40.6, -9.0],
  [-41.3, -9.25], [-42.4, -9.4], [-43.2, -9.75], [-43.9, -10.0], [-44.6, -9.95], [-45.5, -10.3], [-46.4, -10.7], [-46.3, -11.6], [-46.0, -12.6],
  [-46.3, -13.4], [-46.0, -14.4], [-45.0, -14.9], [-44.2, -14.3], [-43.3, -14.8], [-42.5, -15.1], [-41.7, -15.6], [-40.9, -16.0], [-40.4, -16.6],
  [-40.2, -17.4], [-40.6, -17.9], [-39.7, -18.35], [-39.2, -17.6], [-39.1, -16.6], [-38.95, -15.6], [-39.0, -14.6], [-38.95, -13.7], [-38.8, -13.2],
  [-38.5, -13.0], [-38.0, -12.6], [-37.6, -12.0]];
// O retângulo do mapa dentro da tela (deixa o canto esquerdo pra luminária e o título)
const MAPA_CAIXA = { x0: 1758, y0: 112, larg: 150, alt: 158 };
const LON0 = -46.7, LON1 = -37.2, LAT0 = -8.4, LAT1 = -18.6;
function projetar(lon, lat) {
  const { x0, y0, larg, alt } = MAPA_CAIXA;
  return [x0 + ((lon - LON0) / (LON1 - LON0)) * larg, y0 + ((lat - LAT0) / (LAT1 - LAT0)) * alt];
}
const COR_PONTO = { laranja: [255, 150, 60], verde: [80, 220, 140], azul: [120, 200, 255] };
function desenharMapa(ctx, palco, mapa) {
  const [mx0, my0, mx1, my1] = TELA_MAPA, mw = mx1 - mx0, mh = my1 - my0;
  const c = document.createElement('canvas'); c.width = mw; c.height = mh;
  const x = c.getContext('2d');
  const noite = palco.periodo === 'noite';
  x.fillStyle = noite ? '#071030' : '#0a1838'; x.fillRect(0, 0, mw, mh);
  // grade da tela e linhas de varredura, em pixel
  x.fillStyle = 'rgba(80,140,255,0.10)';
  for (let gx = 0; gx < mw; gx += 16) x.fillRect(gx, 0, 1, mh);
  for (let gy = 0; gy < mh; gy += 16) x.fillRect(0, gy, mw, 1);
  // O estado, desenhado pequeno e ampliado sem suavizar (vira pixel de 4)
  const P = 4, pw = Math.ceil(mw / P), ph = Math.ceil(mh / P);
  const pc = document.createElement('canvas'); pc.width = pw; pc.height = ph;
  const px = pc.getContext('2d');
  px.beginPath();
  BAHIA.forEach(([lo, la], i) => { const [a, b] = projetar(lo, la); const u = (a - mx0) / P, v = (b - my0) / P; if (i) px.lineTo(u, v); else px.moveTo(u, v); });
  px.closePath();
  px.fillStyle = noite ? '#17408f' : '#1d4fa8'; px.fill();
  px.strokeStyle = '#5c9cf0'; px.lineWidth = 1; px.stroke();
  x.imageSmoothingEnabled = false; x.drawImage(pc, 0, 0, pw * P, ph * P);
  // Título
  const t = document.createElement('canvas'); t.width = 40; t.height = 10;
  const tx = t.getContext('2d'); tx.fillStyle = '#9fd0ff'; tx.font = 'bold 9px monospace'; tx.textBaseline = 'top'; tx.fillText('BAHIA', 0, 0);
  x.drawImage(t, mw - 92, 8, 80, 20);
  // Os leads por cidade: ponto maior = mais leads; laranja = alguém esperando você, verde = conversando
  for (const p of mapa || []) {
    const [a, b] = projetar(p.lon, p.lat);
    // ponto fino (2 px): Salvador, Lauro e Feira ficam a poucos pixels um do outro
    const Q = 2, u = Math.round((a - mx0) / Q) * Q, v = Math.round((b - my0) / Q) * Q, r = p.n >= 8 ? 3 : p.n >= 3 ? 2 : 1;
    const [cr, cg, cb] = COR_PONTO[p.cor] || COR_PONTO.azul;
    x.fillStyle = `rgba(${cr},${cg},${cb},0.3)`; x.fillRect(u - (r + 1) * Q, v - (r + 1) * Q, (2 * r + 3) * Q, (2 * r + 3) * Q);
    x.fillStyle = `rgb(${cr},${cg},${cb})`; x.fillRect(u - r * Q, v - r * Q, (2 * r + 1) * Q, (2 * r + 1) * Q);
    x.fillStyle = '#ffffff'; x.fillRect(u, v, Q, Q);
  }
  x.globalCompositeOperation = 'destination-in'; x.drawImage(palco.telaMapa, 0, 0);
  ctx.drawImage(c, mx0, my0);
}

/* O que mexe no palco: luz da tela, luminárias respirando, fumaça do café, poeira na luz, janelas da cidade, pontos do mapa.
   f = quadro inteiro (trocas), t = tempo contínuo (movimento suave). */
function vivos(ctx, palco, ocupados, f, t, mapa) {
  const noite = palco.periodo === 'noite';
  BRILHO_QUENTE ||= brilho('255,190,110', 70, 70);
  BRILHO_FRIO ||= brilho('120,170,255', 110, 85);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (const [i, a] of ocupados) {
    const s = ASSENTOS[i];
    ctx.globalAlpha = (a.estado === 'trabalhando' ? 0.1 : a.estado === 'esperando' ? 0.03 : 0.06) * (noite ? 1 : 0.5) * (1 + 0.15 * Math.sin(t * 0.9 + i));
    ctx.drawImage(BRILHO_FRIO, s.borda - 110, 355);
  }
  for (const s of ASSENTOS) {
    ctx.globalAlpha = (0.05 + 0.015 * Math.sin(t * 0.21 + s.cx)) * (noite ? 1 : 0.5);
    ctx.drawImage(BRILHO_QUENTE, s.luz - 70, 112);
  }
  // os pontos do mapa pulsam devagar
  for (const p of mapa || []) {
    const [a, b] = projetar(p.lon, p.lat);
    ctx.globalAlpha = 0.25 + 0.2 * Math.sin(t * 0.5 + p.lat);
    ctx.drawImage(BRILHO_FRIO, a - 12, b - 9, 24, 18);
  }
  ctx.restore();
  // Poeira dourada descendo devagar no cone de cada luminária
  for (const s of ASSENTOS) for (let k = 0; k < 4; k++) {
    const d = (t * 1.2 + k * 41 + s.cx) % 260, x = s.luz + Math.sin((t + k * 50 + s.cx) * 0.04) * (10 + d * 0.25) + (k - 1.5) * 18;
    ctx.fillStyle = `rgba(255,224,170,${(0.45 * Math.sin((d / 260) * Math.PI)).toFixed(2)})`;
    ctx.fillRect(Math.round(x / 4) * 4, Math.round((196 + d) / 4) * 4, 4, 4);
  }
  // Fumaça das canecas
  for (const s of ASSENTOS) {
    if (!s.caneca) continue;
    const [cx, cy] = s.caneca;
    for (let k = 0; k < 3; k++) {
      const d = (t + k * 5) % 15;
      ctx.fillStyle = `rgba(235,235,245,${(0.32 * (1 - d / 15)).toFixed(2)})`;
      ctx.fillRect(Math.round((cx + Math.sin((t + k * 7) * 0.5) * 3) / 4) * 4, Math.round((cy - d * 3) / 4) * 4, 4, 4);
    }
  }
  // Algumas janelas da cidade apagam e acendem
  if (noite && palco.janelas.length) {
    ctx.fillStyle = 'rgba(12,16,40,0.85)';
    const ciclo = Math.floor(f / 12);
    for (let k = 0; k < 4; k++) { const [x, y] = palco.janelas[(ciclo * 7 + k * 13) % palco.janelas.length]; ctx.fillRect(x, y, 5, 5); }
  }
}

/* ------------------------------ o que o escritório conta sem palavras ------------------------------ */
/* Uma pasta na mesa pra cada lead que o especialista acompanha (até 8 na pilha). Fica na frente do tampo, perto do boneco. */
const PASTAS = [[250, 534], [626, 534], [972, 534], [1250, 536], [1562, 534]];
const CORES_PASTA = ['#d9b26a', '#c98f4a', '#6f9bd1', '#d9b26a', '#8fbf7a', '#c98f4a', '#d97a6a', '#d9b26a'];
function pastas(ctx, ia, n) {
  if (!n) return;
  const [x, base] = PASTAS[ia], q = Math.min(8, n);
  ctx.fillStyle = 'rgba(10,6,4,0.4)'; ctx.fillRect(x - 3, base - 1, 62, 5);
  for (let k = 0; k < q; k++) {
    const y = base - 7 - k * 7, dx = (k % 2) * 3, c = CORES_PASTA[k];
    ctx.fillStyle = '#2a1a10'; ctx.fillRect(x + dx - 3, y - 3, 60, 10);
    ctx.fillStyle = c; ctx.fillRect(x + dx, y, 54, 5);
    ctx.fillStyle = 'rgba(255,240,210,0.5)'; ctx.fillRect(x + dx, y, 54, 2);
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(x + dx, y + 4, 54, 1);
    ctx.fillStyle = c; ctx.fillRect(x + dx + 6 + (k % 3) * 13, y - 3, 12, 3); // a orelha da pasta
  }
}

/* O quadro da parede vira o placar do dia: enviadas, respostas, reuniões, com um ícone em pixel cada */
const QUADRO = { noite: [1410, 232, 1508, 332], tarde: [1421, 222, 1511, 333], manha: [1419, 224, 1509, 333] };
const ICONES = {
  enviadas: ['........', '#######.', '##...##.', '#.#.#.#.', '#..#..#.', '#.....#.', '#######.', '........'],
  respostas: ['.######.', '#......#', '#.#.#.##', '#......#', '.######.', '..#.....', '.#......', '........'],
  reunioes: ['.#...#..', '#######.', '#.....#.', '#######.', '#.#.#.#.', '#.#.#.#.', '#######.', '........'],
};
function placarNoQuadro(ctx, periodo, placar) {
  const [x0, y0, x1, y1] = QUADRO[periodo] || QUADRO.noite;
  ctx.fillStyle = '#1b201c'; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  ctx.fillStyle = 'rgba(255,255,255,0.03)'; for (let y = y0; y < y1; y += 6) ctx.fillRect(x0, y, x1 - x0, 2); // giz apagado
  const giz = periodo === 'noite' ? '#cfd8c4' : '#e8eedc';
  const linhas = [['enviadas', placar.enviadas], ['respostas', placar.respostas], ['reunioes', placar.reunioes]];
  linhas.forEach(([k, v], i) => {
    const y = y0 + 10 + i * 31;
    ICONES[k].forEach((l, r) => [...l].forEach((ch, c) => { if (ch === '#') { ctx.fillStyle = giz; ctx.fillRect(x0 + 10 + c * 3, y + r * 3, 3, 3); } }));
    // o número em giz: desenha pequeno e amplia sem suavizar, pra virar pixel
    const t = document.createElement('canvas'); t.width = 24; t.height = 12;
    const tx = t.getContext('2d'); tx.fillStyle = giz; tx.font = 'bold 11px monospace'; tx.textBaseline = 'top'; tx.fillText(String(v ?? 0), 0, 0);
    ctx.imageSmoothingEnabled = false; ctx.drawImage(t, x0 + 44, y - 2, 48, 24);
  });
}

/* Farejador desligado: o escritório apaga e o time vai embora (nada pensa nem sai até ele ligar) */
function apagado(ctx) {
  ctx.save();
  ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = '#2a2a44'; ctx.fillRect(0, 0, PW, PH);
  ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = 'rgba(4,4,12,0.35)'; ctx.fillRect(0, 0, PW, PH);
  ctx.restore();
}

/** Posição da tela do mapa na cena, em % (pra quem põe a área clicável por cima) */
export const AREA_MAPA = { left: (TELA_MAPA[0] / PW) * 100, top: (TELA_MAPA[1] / PH) * 100, width: ((TELA_MAPA[2] - TELA_MAPA[0]) / PW) * 100, height: ((TELA_MAPA[3] - TELA_MAPA[1]) / PH) * 100 };
/** Onde fica cada cidade conhecida (pro mapa): [lat, lon] */
export const CIDADES = {
  salvador: [-12.97, -38.5], 'feira de santana': [-12.27, -38.97], 'lauro de freitas': [-12.89, -38.33], camacari: [-12.7, -38.32],
  'simoes filho': [-12.79, -38.4], candeias: [-12.67, -38.55], alagoinhas: [-12.14, -38.42], brejoes: [-13.1, -39.8],
  'santo antonio de jesus': [-12.97, -39.26], jequie: [-13.86, -40.08], 'vitoria da conquista': [-14.86, -40.84], ilheus: [-14.79, -39.05],
  itabuna: [-14.79, -39.28], 'porto seguro': [-16.45, -39.06], 'teixeira de freitas': [-17.54, -39.74], juazeiro: [-9.41, -40.5],
  'paulo afonso': [-9.4, -38.21], barreiras: [-12.15, -45.0], irece: [-11.3, -41.86], guanambi: [-14.22, -42.78], 'mata de sao joao': [-12.53, -38.3],
  cruz: [-12.67, -39.1], valenca: [-13.37, -39.07], 'luis eduardo magalhaes': [-12.09, -45.8], senhor: [-10.46, -40.19],
};

/**
 * Monta o escritório dentro de `el`. estacoes = [{ id, aparencia, estado, pastas }]; extra = { online, placar, mapa }.
 * O HTML dos nomes e balões fica por conta de quem chama (fica acessível e com o texto real; a posição de cada um vem de
 * posicoesEscritorio); aqui é só a cena.
 * Desempenho (01/10, "a animação está meio travada"): o que não muda (palco, placar, mapa, mesa e pastas) é montado
 * uma vez em duas camadas; a cada quadro só entram os bonecos e o que mexe, a ~24 quadros por segundo, com o
 * movimento contínuo (respiração, poeira, brilho) e as trocas de pose a cada 250 ms.
 */
export function montarEscritorio(el, estacoes, extra = {}) {
  const canvas = document.createElement('canvas');
  canvas.className = 'pixel-cena';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.width = PW; canvas.height = PH;
  el.prepend(canvas);
  const ctx = canvas.getContext('2d');
  const fixo = document.createElement('canvas'), frenteFixa = document.createElement('canvas');
  for (const c of [fixo, frenteFixa]) { c.width = PW; c.height = PH; }
  let lista = estacoes, info = { online: true, ...extra }, palco = null, morto = false, sujo = true;
  let raf = 0, ultimo = 0, visivel = true;
  const inicio = performance.now();
  const reduzir = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

  async function trocarPalco() {
    const p = periodoAgora();
    if (palco?.periodo === p) return;
    try { const novo = await prepararPalco(p); if (!morto) { palco = novo; sujo = true; desenhar(); } } catch { if (!morto) setTimeout(trocarPalco, 5000); } // falhou: tenta de novo
  }
  /* As duas camadas que só mudam quando o dado muda */
  function montarCamadas() {
    const fx = fixo.getContext('2d');
    fx.imageSmoothingEnabled = false;
    fx.clearRect(0, 0, PW, PH);
    fx.drawImage(palco.fundo, 0, 0, PW, PH);
    if (info.placar) placarNoQuadro(fx, palco.periodo, info.placar);
    desenharMapa(fx, palco, info.mapa);
    const fr = frenteFixa.getContext('2d');
    fr.clearRect(0, 0, PW, PH);
    fr.drawImage(palco.frente, 0, 0);
    assentosDe(lista.length).forEach((ia, k) => lista[k] && pastas(fr, ia, lista[k].pastas));
    sujo = false;
  }
  function desenhar(agora = performance.now()) {
    if (!palco) return;
    if (sujo) montarCamadas();
    const t = (agora - inicio) / 250, f = Math.floor(t);
    ctx.imageSmoothingEnabled = false;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(fixo, 0, 0);
    const lugares = assentosDe(lista.length);
    const ocupados = info.online === false ? [] : lugares.map((ia, k) => [ia, lista[k]]).filter(([, a]) => a);
    const pos = (s) => (s.lado < 0 ? [ESC, s.cx - SX * ESC] : [-ESC, s.cx + SX * ESC]);
    const folhaImg = ocupados.map(([, a]) => folhaDe(a.id));
    const poses = ocupados.map(([ia, a], k) => (folhaImg[k] === null ? pose(a.estado, f + ia * 5) : null));
    for (const qual of ['corpo', 'bracos']) ocupados.forEach(([ia, a], k) => {
      const s = ASSENTOS[ia];
      if (folhaImg[k] === false) return;
      if (folhaImg[k]) { if (qual === 'corpo') desenharFolha(ctx, a.id, folhaImg[k], s, a.estado, f + ia * 5, t + ia * 5, palco.periodo); return; }
      const [e, x0] = pos(s);
      ctx.setTransform(e, 0, 0, ESC, x0, TOPO);
      ctx.drawImage(sprite(a.aparencia || {}, poses[k], qual, palco.periodo), 0, 0);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    });
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(frenteFixa, 0, 0);
    if (info.online === false) { apagado(ctx); return; }
    vivos(ctx, palco, ocupados, f, t, info.mapa);
    ocupados.forEach(([ia, a], k) => {
      if (folhaImg[k] === false || (folhaImg[k] && a.estado === 'comemorando')) return; // carregando, ou a folha já traz o brilho
      const fxc = folhaEfeito(a.estado, f + ia * 5);
      if (!fxc) return;
      const s = ASSENTOS[ia], fora = -s.lado; // o lado de fora, longe do monitor
      const def = folhaImg[k] && FOLHAS[a.id], cabeca = def ? MESA + 2 - def.poses[0][3] * def.escala : 0; // topo da cabeça
      const dist = def ? 96 : 14 * ESC, y = def ? cabeca + 10 : TOPO + (HY0 - 6) * ESC;
      const x = s.cx + fora * dist - (fora < 0 ? 16 * ESC : 0);
      ctx.globalAlpha = fxc.alfa; ctx.drawImage(fxc, x, y, 16 * ESC, 18 * ESC); ctx.globalAlpha = 1;
    });
  }
  function laco(agora) {
    raf = 0;
    if (morto || !visivel || document.hidden) return;
    if (agora - ultimo >= 41) { ultimo = agora; desenhar(agora); } // ~24 quadros por segundo
    raf = requestAnimationFrame(laco);
  }
  function ligar() { if (!raf && !reduzir && visivel && !document.hidden && !morto) raf = requestAnimationFrame(laco); }
  function desligar() { if (raf) cancelAnimationFrame(raf); raf = 0; }
  const relogio = setInterval(trocarPalco, 60000); // a hora do dia muda o palco

  const io = new IntersectionObserver(([x]) => { visivel = x.isIntersecting; if (visivel) ligar(); else desligar(); });
  io.observe(el);
  const vis = () => (document.hidden ? desligar() : ligar());
  document.addEventListener('visibilitychange', vis);
  const aoChegarFolha = () => desenhar();
  aoChegar.add(aoChegarFolha);
  trocarPalco(); ligar();

  return {
    atualizar(novas, novoExtra) { lista = novas; if (novoExtra) info = { ...info, ...novoExtra }; sujo = true; desenhar(); },
    definir(novoExtra) { info = { ...info, ...novoExtra }; sujo = true; desenhar(); },
    destruir() { morto = true; desligar(); clearInterval(relogio); aoChegar.delete(aoChegarFolha); io.disconnect(); document.removeEventListener('visibilitychange', vis); canvas.remove(); },
  };
}

/** Rosto do especialista pra usar pequeno (cartão, lista de leads). Com folha: o recorte dela; sem: só o rosto e os ombros do boneco (cartão do especialista, lista de leads). Devolve data URL, com cache. */
const rostos = new Map();
export function rosto(ap = {}, id) {
  if (id && FOLHAS[id]) return urlDe(`rosto-${id}.webp`); // quem tem folha usa o rosto recortado dela
  const chave = JSON.stringify(ap);
  if (rostos.has(chave)) return rostos.get(chave);
  const c = document.createElement('canvas');
  c.width = 60; c.height = 60;
  const ctx = c.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#241b2a'; ctx.fillRect(0, 0, 60, 60);
  ctx.drawImage(paraCanvas(folhaCorpo(ap, pose('parado', 1))), SX - 14, HY0 - 3, 30, 30, 0, 0, 60, 60);
  const url = c.toDataURL();
  rostos.set(chave, url);
  return url;
}
