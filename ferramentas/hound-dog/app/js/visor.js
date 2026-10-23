/* =============================================================================
   HOUNDER — Visor de tela cheia dos slides (21/10/2026, pedido do Marcelo:
   "não consigo dar zoom dentro do Hounder"). Mostra a resolução real quando o
   slide tem url_publica; sem ela, a prévia reduzida (avisa).
   Setas/A/D trocam, clique ou roda dão zoom e arrastar move, F liga a tela
   cheia do sistema, Esc fecha. No celular: deslizar troca, pinça dá zoom.
   ============================================================================= */
import { esc } from './ui.js';
import { icone } from './icones.js';

/** Imagens de um post: alta quando existe, prévia quando não. */
export function imagensDoPost(p) {
  const prev = p.previa || [];
  const altas = (p.slides || []).map((s) => s.url_publica).filter(Boolean);
  if (altas.length && altas.length === (p.slides || []).length) return { imagens: altas, reduzida: false };
  return { imagens: prev, reduzida: true };
}

/**
 * Abre o visor.
 * @param {string[]} imagens  URLs ou dataURLs, na ordem
 * @param {{inicio?:number, titulo?:string, reduzida?:boolean, miniaturas?:string[]}} op
 */
export function abrirVisor(imagens, { inicio = 0, titulo = '', reduzida = false, miniaturas = null } = {}) {
  if (!imagens?.length) return;
  const minis = miniaturas?.length === imagens.length ? miniaturas : imagens;
  let i = Math.max(0, Math.min(inicio, imagens.length - 1));
  let zoom = 1, px = 0, py = 0;

  const raiz = document.createElement('div');
  raiz.className = 'visor';
  raiz.setAttribute('role', 'dialog');
  raiz.setAttribute('aria-modal', 'true');
  raiz.setAttribute('aria-label', titulo ? `Slides: ${titulo}` : 'Slides');
  raiz.innerHTML = `
    <div class="visor-topo">
      <div class="visor-tit"><b>${esc(titulo)}</b><span data-cont></span>${reduzida ? '<span class="selo amarelo mini" title="Este post ainda não tem a imagem em alta no armazenamento">prévia reduzida</span>' : ''}</div>
      <div class="visor-acoes">
        <button class="btn sm" data-zoom-menos title="Diminuir (−)" aria-label="Diminuir">${icone('menos')}</button>
        <button class="btn sm visor-pct" data-zoom-100 title="Tamanho da tela (0)">100%</button>
        <button class="btn sm" data-zoom-mais title="Aumentar (+)" aria-label="Aumentar">${icone('mais')}</button>
        <button class="btn sm" data-tela title="Tela cheia (F)">${icone('grade')}Tela cheia</button>
        <a class="btn sm" data-baixar title="Abrir o arquivo original" target="_blank" rel="noopener">${icone('download')}</a>
        <button class="btn sm" data-fechar title="Fechar (Esc)" aria-label="Fechar">${icone('x')}</button>
      </div>
    </div>
    <div class="visor-palco" data-palco>
      <button class="visor-seta esq" data-ant aria-label="Slide anterior">${icone('cheve')}</button>
      <img data-img src="${esc(imagens[i])}" alt="Slide ${i + 1} de ${imagens.length}" draggable="false">
      <button class="visor-seta dir" data-prox aria-label="Próximo slide">${icone('chevd')}</button>
    </div>
    <div class="visor-tira" data-tira>${minis.map((src, k) => `<button data-ir="${k}" aria-label="Slide ${k + 1}"><img src="${esc(src)}" alt="" loading="lazy"></button>`).join('')}</div>`;
  document.body.appendChild(raiz);
  document.body.classList.add('visor-aberto');
  const img = raiz.querySelector('[data-img]');
  const palco = raiz.querySelector('[data-palco]');
  const voltarFoco = document.activeElement;

  function aplicar() {
    img.style.transform = `translate(${px}px, ${py}px) scale(${zoom})`;
    img.style.cursor = zoom > 1 ? 'grab' : 'zoom-in';
    raiz.querySelector('[data-zoom-100]').textContent = `${Math.round(zoom * 100)}%`;
  }
  function limitar() {
    const r = img.getBoundingClientRect();
    const w = r.width / zoom, h = r.height / zoom;
    const mx = Math.max(0, (w * zoom - palco.clientWidth) / 2 + 40), my = Math.max(0, (h * zoom - palco.clientHeight) / 2 + 40);
    px = Math.max(-mx, Math.min(mx, px)); py = Math.max(-my, Math.min(my, py));
  }
  function zoomEm(novo, cx = null, cy = null) {
    novo = Math.max(1, Math.min(6, novo));
    if (cx != null) {
      const r = palco.getBoundingClientRect();
      const ox = cx - (r.left + r.width / 2) - px, oy = cy - (r.top + r.height / 2) - py;
      px -= ox * (novo / zoom - 1); py -= oy * (novo / zoom - 1);
    }
    zoom = novo;
    if (zoom === 1) { px = 0; py = 0; } else limitar();
    aplicar();
  }
  function mostrar(k) {
    i = (k + imagens.length) % imagens.length;
    zoom = 1; px = 0; py = 0;
    img.src = imagens[i];
    img.alt = `Slide ${i + 1} de ${imagens.length}`;
    raiz.querySelector('[data-cont]').textContent = `${i + 1} / ${imagens.length}`;
    const baixar = raiz.querySelector('[data-baixar]');
    if (/^https?:/.test(imagens[i])) { baixar.href = imagens[i]; baixar.hidden = false; } else baixar.hidden = true;
    raiz.querySelectorAll('[data-ir]').forEach((b, k2) => b.classList.toggle('on', k2 === i));
    raiz.querySelector(`[data-ir="${i}"]`)?.scrollIntoView({ block: 'nearest', inline: 'center' });
    raiz.querySelector('[data-ant]').hidden = raiz.querySelector('[data-prox]').hidden = imagens.length < 2;
    aplicar();
  }
  function fechar() {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    document.removeEventListener('keydown', tecla, true);
    document.body.classList.remove('visor-aberto');
    raiz.remove();
    voltarFoco?.focus?.();
  }
  function tecla(ev) {
    const k = ev.key;
    if (k === 'Escape') { ev.preventDefault(); ev.stopPropagation(); if (document.fullscreenElement) document.exitFullscreen(); else fechar(); return; }
    if (k === 'ArrowRight' || k === 'd' || k === 'D' || k === 'PageDown') { ev.preventDefault(); mostrar(i + 1); }
    else if (k === 'ArrowLeft' || k === 'a' || k === 'A' || k === 'PageUp') { ev.preventDefault(); mostrar(i - 1); }
    else if (k === '+' || k === '=') { ev.preventDefault(); zoomEm(zoom * 1.4); }
    else if (k === '-') { ev.preventDefault(); zoomEm(zoom / 1.4); }
    else if (k === '0') { ev.preventDefault(); zoomEm(1); }
    else if (k === 'f' || k === 'F') { ev.preventDefault(); telaCheia(); }
  }
  function telaCheia() {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else raiz.requestFullscreen?.().catch(() => {});
  }
  document.addEventListener('keydown', tecla, true);

  raiz.querySelector('[data-fechar]').onclick = fechar;
  raiz.querySelector('[data-ant]').onclick = () => mostrar(i - 1);
  raiz.querySelector('[data-prox]').onclick = () => mostrar(i + 1);
  raiz.querySelector('[data-zoom-mais]').onclick = () => zoomEm(zoom * 1.4);
  raiz.querySelector('[data-zoom-menos]').onclick = () => zoomEm(zoom / 1.4);
  raiz.querySelector('[data-zoom-100]').onclick = () => zoomEm(1);
  raiz.querySelector('[data-tela]').onclick = telaCheia;
  raiz.querySelector('[data-tira]').onclick = (ev) => { const b = ev.target.closest('[data-ir]'); if (b) mostrar(Number(b.dataset.ir)); };
  palco.addEventListener('click', (ev) => { if (ev.target === palco) fechar(); });

  // Zoom com a roda (no ponto do cursor) e arrastar para mover
  palco.addEventListener('wheel', (ev) => { ev.preventDefault(); zoomEm(zoom * (ev.deltaY < 0 ? 1.15 : 1 / 1.15), ev.clientX, ev.clientY); }, { passive: false });
  const toques = new Map();
  let arraste = null, pinca = null, moveu = false;
  img.addEventListener('pointerdown', (ev) => {
    img.setPointerCapture(ev.pointerId);
    toques.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    moveu = false;
    if (toques.size === 2) {
      const [a, b] = [...toques.values()];
      pinca = { d: Math.hypot(a.x - b.x, a.y - b.y), z: zoom, cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 };
      arraste = null;
    } else arraste = { x: ev.clientX, y: ev.clientY, px, py };
  });
  img.addEventListener('pointermove', (ev) => {
    if (!toques.has(ev.pointerId)) return;
    toques.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
    if (pinca && toques.size === 2) {
      const [a, b] = [...toques.values()];
      zoomEm(pinca.z * (Math.hypot(a.x - b.x, a.y - b.y) / pinca.d), pinca.cx, pinca.cy); moveu = true; return;
    }
    if (!arraste) return;
    const dx = ev.clientX - arraste.x, dy = ev.clientY - arraste.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) moveu = true;
    if (zoom > 1) { px = arraste.px + dx; py = arraste.py + dy; limitar(); img.style.cursor = 'grabbing'; aplicar(); }
  });
  const soltar = (ev) => {
    const a = arraste;
    toques.delete(ev.pointerId);
    if (toques.size < 2) pinca = null;
    if (!a || toques.size) { arraste = null; return; }
    arraste = null;
    const dx = ev.clientX - a.x;
    if (zoom === 1 && Math.abs(dx) > 60 && moveu) { mostrar(i + (dx < 0 ? 1 : -1)); return; }   // deslizar
    if (!moveu && ev.type === 'pointerup') zoomEm(zoom > 1 ? 1 : 2.2, ev.clientX, ev.clientY);    // clique: zoom no ponto
    else aplicar();
  };
  img.addEventListener('pointerup', soltar);
  img.addEventListener('pointercancel', soltar);

  mostrar(i);
  raiz.querySelector('[data-fechar]').focus();
  return { fechar };
}
