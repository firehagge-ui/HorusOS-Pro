/* =============================================================================
   HOUND DOG — utilidades de interface: DOM, formatação, toast, modal, gaveta,
   menu, confirmação, markdown seguro, cópia
   ============================================================================= */
import { icone } from './icones.js';

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

export function esc(v) {
  return String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function el(html) {
  const t = document.createElement('template');
  t.innerHTML = String(html).trim();
  return t.content.firstElementChild;
}

export function on(raiz, evento, seletor, fn) {
  raiz.addEventListener(evento, (e) => {
    const alvo = e.target.closest(seletor);
    if (alvo && raiz.contains(alvo)) fn(e, alvo);
  });
}

export function debounce(fn, ms = 250) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

/* ------------------------------ Formatação ------------------------------ */
const fmtBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
export const brl = (n) => (n == null || n === '' || Number.isNaN(Number(n)) ? '—' : fmtBRL.format(Number(n)));
export const num = (n) => (n == null ? '—' : Number(n).toLocaleString('pt-BR'));
export function compacto(n) {
  if (n == null) return '—';
  const v = Number(n);
  if (v >= 1e6) return (v / 1e6).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' mi';
  if (v >= 1e4) return (v / 1e3).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' mil';
  return v.toLocaleString('pt-BR');
}

export function dataCurta(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}
export function dataLonga(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}
export function hora(d) {
  if (!d) return '';
  return new Date(d).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}
export function dataHora(d) {
  if (!d) return '—';
  const x = new Date(d);
  return `${x.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} ${hora(x)}`;
}

export function relativo(d) {
  if (!d) return '—';
  const s = (Date.now() - new Date(d).getTime()) / 1000;
  const futuro = s < 0;
  const a = Math.abs(s);
  let txt;
  if (a < 45) txt = 'agora';
  else if (a < 3600) txt = `${Math.round(a / 60)} min`;
  else if (a < 86400) txt = `${Math.round(a / 3600)} h`;
  else if (a < 86400 * 30) txt = `${Math.round(a / 86400)} d`;
  else if (a < 86400 * 365) txt = `${Math.round(a / (86400 * 30))} meses`;
  else txt = `${Math.round(a / (86400 * 365))} anos`;
  if (txt === 'agora') return txt;
  return futuro ? `em ${txt}` : `há ${txt}`;
}

export function diasDesde(d) {
  if (!d) return null;
  return Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
}

export function iniciais(nome) {
  const partes = String(nome || '?').replace(/[^\p{L}\p{N}\s]/gu, ' ').trim().split(/\s+/).filter(Boolean);
  if (!partes.length) return '?';
  return (partes[0][0] + (partes.length > 1 ? partes[partes.length - 1][0] : '')).toUpperCase();
}

export function saudacao() {
  const h = new Date().getHours();
  return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
}

export function telefoneBonito(t) {
  const d = String(t || '').replace(/\D/g, '');
  if (!d) return '—';
  const s = d.startsWith('55') ? d.slice(2) : d;
  if (s.length === 11) return `(${s.slice(0, 2)}) ${s.slice(2, 7)}-${s.slice(7)}`;
  if (s.length === 10) return `(${s.slice(0, 2)}) ${s.slice(2, 6)}-${s.slice(6)}`;
  return '+' + d;
}

export function linkWhats(t, texto) {
  const d = String(t || '').replace(/\D/g, '');
  if (!d) return null;
  return `https://wa.me/${d}${texto ? `?text=${encodeURIComponent(texto)}` : ''}`;
}

/* ------------------------------ Toast ------------------------------ */
let caixaToasts;
export function toast(msg, tipo = 'ok', opcoes = {}) {
  if (!caixaToasts) { caixaToasts = el('<div class="toasts" role="status" aria-live="polite"></div>'); document.body.appendChild(caixaToasts); }
  const ic = tipo === 'erro' ? 'alerta' : tipo === 'info' ? 'info' : 'checkc';
  const t = el(`<div class="toast ${tipo}">${icone(ic)}<span>${esc(msg)}</span></div>`);
  if (opcoes.acao) {
    const b = el(`<button class="btn xs">${esc(opcoes.acao.rotulo)}</button>`);
    b.onclick = () => { opcoes.acao.fn(); t.remove(); };
    t.appendChild(b);
  }
  caixaToasts.appendChild(t);
  setTimeout(() => { t.style.transition = 'opacity .3s'; t.style.opacity = '0'; setTimeout(() => t.remove(), 320); }, opcoes.ms || (tipo === 'erro' ? 6000 : 3200));
}

export function erroAmigavel(e) {
  const m = String(e?.message || e || 'Erro desconhecido');
  if (/JWT|expired|invalid claim/i.test(m)) return 'Sua sessão expirou. Entre de novo.';
  if (/Failed to fetch|NetworkError|network/i.test(m)) return 'Sem conexão com o servidor. Confira a internet.';
  if (/duplicate key/i.test(m)) return 'Já existe um registro igual.';
  if (/violates row-level security|permission denied/i.test(m)) return 'Sem permissão para isso.';
  return m;
}

/* ------------------------------ Modal ------------------------------ */
const pilha = [];
export function modal({ titulo, subtitulo = '', corpo = '', pe = '', largo = false, icone: ic = '', aoFechar } = {}) {
  const veu = el('<div class="veu"></div>');
  const m = el(`<div class="modal ${largo ? 'largo' : ''}" role="dialog" aria-modal="true">
    <div class="modal-cab">${ic ? `<div class="icone-caixa sm">${icone(ic)}</div>` : ''}<div class="grow"><h2>${esc(titulo)}</h2>${subtitulo ? `<p>${esc(subtitulo)}</p>` : ''}</div>
      <button class="btn icone sm fantasma" data-fechar aria-label="Fechar">${icone('x')}</button></div>
    <div class="modal-corpo"></div>
    ${pe !== null ? '<div class="modal-pe"></div>' : ''}
  </div>`);
  const corpoEl = $('.modal-corpo', m);
  if (typeof corpo === 'string') corpoEl.innerHTML = corpo; else if (corpo) corpoEl.appendChild(corpo);
  const peEl = $('.modal-pe', m);
  if (peEl) { if (typeof pe === 'string') peEl.innerHTML = pe; else if (pe) peEl.appendChild(pe); if (!pe) peEl.remove(); }
  document.body.append(veu, m);
  const anterior = document.activeElement;
  requestAnimationFrame(() => { veu.classList.add('on'); m.classList.add('on'); const f = $('input,select,textarea,button:not([data-fechar])', corpoEl); if (f) f.focus(); });
  function fechar(valor) {
    const i = pilha.indexOf(api); if (i >= 0) pilha.splice(i, 1);
    veu.classList.remove('on'); m.classList.remove('on');
    setTimeout(() => { veu.remove(); m.remove(); }, 220);
    if (anterior && anterior.focus) anterior.focus();
    if (aoFechar) aoFechar(valor);
  }
  veu.onclick = () => fechar();
  $$('[data-fechar]', m).forEach((b) => (b.onclick = () => fechar()));
  const api = { el: m, corpo: corpoEl, pe: peEl, fechar };
  pilha.push(api);
  return api;
}

export function confirmar(titulo, texto = '', { rotulo = 'Confirmar', perigo = false } = {}) {
  return new Promise((resolve) => {
    let ok = false;
    const m = modal({
      titulo, subtitulo: texto, corpo: '',
      pe: `<button class="btn" data-fechar>Cancelar</button><button class="btn ${perigo ? 'perigo' : 'prim'}" data-ok>${esc(rotulo)}</button>`,
      aoFechar: () => resolve(ok),
    });
    m.corpo.remove();
    $('[data-ok]', m.el).onclick = () => { ok = true; m.fechar(); };
    $$('[data-fechar]', m.el).forEach((b) => (b.onclick = () => m.fechar()));
  });
}

export function perguntar(titulo, { rotulo = 'Salvar', valor = '', placeholder = '', multilinha = false, subtitulo = '' } = {}) {
  return new Promise((resolve) => {
    let res = null;
    const campo = multilinha
      ? `<textarea class="txt" data-v placeholder="${esc(placeholder)}">${esc(valor)}</textarea>`
      : `<input class="inp" data-v value="${esc(valor)}" placeholder="${esc(placeholder)}">`;
    const m = modal({ titulo, subtitulo, corpo: campo, pe: `<button class="btn" data-fechar>Cancelar</button><button class="btn prim" data-ok>${esc(rotulo)}</button>`, aoFechar: () => resolve(res) });
    const inp = $('[data-v]', m.el);
    const ok = () => { res = inp.value; m.fechar(); };
    $('[data-ok]', m.el).onclick = ok;
    if (!multilinha) inp.onkeydown = (e) => { if (e.key === 'Enter') ok(); };
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const menuAberto = $('.menu-pop');
    if (menuAberto) { menuAberto.remove(); return; }
    if (pilha.length) { pilha[pilha.length - 1].fechar(); return; }
    const g = $('.gaveta.on');
    if (g && g._fechar) g._fechar();
  }
});

/* ------------------------------ Gaveta ------------------------------ */
export function gaveta({ cab = '', corpo = '', aoFechar } = {}) {
  $$('.gaveta').forEach((g) => g._fechar && g._fechar(true));
  const veu = el('<div class="veu gav"></div>');
  const g = el('<aside class="gaveta" role="dialog" aria-modal="true"><div class="gaveta-cab"></div><div class="gaveta-corpo"></div></aside>');
  const cabEl = $('.gaveta-cab', g); const corpoEl = $('.gaveta-corpo', g);
  if (typeof cab === 'string') cabEl.innerHTML = cab; else if (cab) cabEl.appendChild(cab);
  if (typeof corpo === 'string') corpoEl.innerHTML = corpo; else if (corpo) corpoEl.appendChild(corpo);
  document.body.append(veu, g);
  requestAnimationFrame(() => { veu.classList.add('on'); g.classList.add('on'); });
  function fechar(imediato) {
    veu.classList.remove('on'); g.classList.remove('on');
    const fim = () => { veu.remove(); g.remove(); };
    if (imediato) fim(); else setTimeout(fim, 300);
    if (aoFechar) aoFechar();
  }
  g._fechar = fechar;
  veu.onclick = () => fechar();
  return { el: g, cab: cabEl, corpo: corpoEl, fechar };
}

/* ------------------------------ Menu suspenso ------------------------------ */
export function menu(ancora, itens) {
  $$('.menu-pop').forEach((m) => m.remove());
  const m = el('<div class="menu-pop" role="menu"></div>');
  for (const it of itens) {
    if (it === '-') { m.appendChild(el('<hr>')); continue; }
    const b = el(`<button role="menuitem" class="${it.perigo ? 'perigo' : ''}">${it.icone ? icone(it.icone) : ''}<span>${esc(it.rotulo)}</span></button>`);
    b.onclick = (e) => { e.stopPropagation(); m.remove(); it.fn(); };
    m.appendChild(b);
  }
  document.body.appendChild(m);
  const r = ancora.getBoundingClientRect();
  const w = m.offsetWidth, h = m.offsetHeight;
  let x = r.right - w, y = r.bottom + 6;
  if (x < 8) x = Math.min(r.left, innerWidth - w - 8);
  if (y + h > innerHeight - 8) y = r.top - h - 6;
  m.style.left = `${Math.max(8, x)}px`; m.style.top = `${Math.max(8, y)}px`;
  setTimeout(() => document.addEventListener('click', function fora(e) { if (!m.contains(e.target)) { m.remove(); document.removeEventListener('click', fora); } }), 0);
  return m;
}

/* ------------------------------ Cópia ------------------------------ */
export async function copiar(texto, msg = 'Copiado') {
  try { await navigator.clipboard.writeText(texto); toast(msg); }
  catch {
    const ta = el('<textarea style="position:fixed;opacity:0"></textarea>'); ta.value = texto; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); toast(msg); } catch { toast('Não consegui copiar', 'erro'); }
    ta.remove();
  }
}

/* ------------------------------ Markdown seguro ------------------------------ */
let _md;
export async function markdown(texto) {
  if (!_md) {
    const [{ marked }, purify] = await Promise.all([
      import('https://cdn.jsdelivr.net/npm/marked@18.0.13/+esm'),
      import('https://cdn.jsdelivr.net/npm/dompurify@3.4.15/+esm'),
    ]);
    const DOMPurify = purify.default || purify;
    marked.setOptions({ gfm: true, breaks: true });
    _md = (t) => DOMPurify.sanitize(marked.parse(String(t || '')), { ADD_ATTR: ['target'] });
  }
  return _md(texto);
}
export async function preencherMarkdown(alvo, texto) {
  try {
    alvo.innerHTML = await markdown(texto);
    $$('a', alvo).forEach((a) => { a.target = '_blank'; a.rel = 'noopener'; });
  } catch {
    alvo.textContent = texto;
  }
}

/* ------------------------------ Estados ------------------------------ */
export function vazio(ic, titulo, texto = '', botao = '') {
  return `<div class="vazio">${icone(ic)}<b>${esc(titulo)}</b>${texto ? `<span>${esc(texto)}</span>` : ''}${botao}</div>`;
}
export function esqueleto(linhas = 3, altura = 18) {
  return Array.from({ length: linhas }, (_, i) => `<div class="esq" style="height:${altura}px;margin:10px 0;width:${90 - i * 12}%"></div>`).join('');
}
export function erroBloco(msg, id = 'tentar') {
  return `<div class="vazio">${icone('alerta')}<b>Não carregou</b><span>${esc(msg)}</span><button class="btn sm" data-acao="${id}">${icone('atualizar')}Tentar de novo</button></div>`;
}

export function kpi({ icone: ic, rotulo, valor, sub = '', cor = '' }) {
  return `<div class="kpi ${cor}"><div class="kl"><span class="ic">${icone(ic)}</span>${esc(rotulo)}</div><div class="kv">${valor}</div>${sub ? `<div class="ks">${esc(sub)}</div>` : ''}</div>`;
}

export function botaoCarregando(btn, carregando, texto) {
  if (!btn) return;
  if (carregando) {
    btn.dataset.html = btn.innerHTML; btn.classList.add('carregando');
    btn.innerHTML = `<span class="spin"></span>${texto ? esc(texto) : ''}`;
  } else {
    btn.classList.remove('carregando');
    if (btn.dataset.html) btn.innerHTML = btn.dataset.html;
  }
}

export function baixarArquivo(nome, conteudo, tipo = 'text/csv;charset=utf-8') {
  const blob = new Blob([conteudo], { type: tipo });
  const a = el(`<a download="${esc(nome)}"></a>`);
  a.href = URL.createObjectURL(blob);
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}

export function paraCSV(linhas, colunas) {
  const cel = (v) => { const s = v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v); return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  return '﻿' + [colunas.map((c) => cel(c.rotulo || c.campo)).join(';'), ...linhas.map((l) => colunas.map((c) => cel(typeof c.valor === 'function' ? c.valor(l) : l[c.campo])).join(';'))].join('\n');
}
