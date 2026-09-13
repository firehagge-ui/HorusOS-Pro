/* =========================================================================
   HORUS · Painel — ui.js
   DOM helpers, toast, modal, confirm, and inline-SVG charts.
   ========================================================================= */
(function () {
  const icon = App.icon;

  // --- create element(s) from an HTML string ---
  function h(html) {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.childNodes.length === 1 ? t.content.firstChild : t.content;
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }
  function on(root, sel, evt, fn) {
    root.querySelectorAll(sel).forEach((el) => el.addEventListener(evt, fn));
  }
  function delegate(root, evt, sel, fn) {
    root.addEventListener(evt, (e) => {
      const el = e.target.closest(sel);
      if (el && root.contains(el)) fn(e, el);
    });
  }

  // ---------------- Toast ----------------
  let toastWrap;
  function toast(msg, opts = {}) {
    if (!toastWrap) { toastWrap = h('<div class="toast-wrap"></div>'); document.body.appendChild(toastWrap); }
    const kind = opts.kind || 'ok';
    const ic = opts.icon || (kind === 'ok' ? 'check' : kind === 'warn' ? 'info' : 'zap');
    const el = h(`<div class="toast ${kind}">
      <div class="ic">${icon(ic)}</div>
      <div><div class="msg">${esc(msg)}</div>${opts.sub ? `<div class="sub">${esc(opts.sub)}</div>` : ''}</div>
    </div>`);
    toastWrap.appendChild(el);
    setTimeout(() => { el.style.transition = 'opacity .3s, transform .3s'; el.style.opacity = '0'; el.style.transform = 'translateY(6px)'; setTimeout(() => el.remove(), 320); }, opts.ms || 2600);
  }

  // ---------------- Modal ----------------
  function modal({ title, body, footer, wide, onClose }) {
    const scrim = h(`<div class="modal-scrim"><div class="modal ${wide ? 'wide' : ''}" role="dialog" aria-modal="true"></div></div>`);
    const m = scrim.querySelector('.modal');
    m.appendChild(h(`<div class="modal-h"><h3>${esc(title || '')}</h3><button class="x" aria-label="Fechar">${icon('x')}</button></div>`));
    const b = h('<div class="modal-b"></div>');
    if (typeof body === 'string') b.innerHTML = body; else if (body) b.appendChild(body);
    m.appendChild(b);
    if (footer) { const f = h('<div class="modal-f"></div>'); if (typeof footer === 'string') f.innerHTML = footer; else f.appendChild(footer); m.appendChild(f); }
    function close() { scrim.style.animation = 'fadeIn .12s reverse'; setTimeout(() => scrim.remove(), 110); document.removeEventListener('keydown', onKey); onClose && onClose(); }
    function onKey(e) { if (e.key === 'Escape') close(); }
    scrim.querySelector('.x').addEventListener('click', close);
    scrim.addEventListener('mousedown', (e) => { if (e.target === scrim) close(); });
    document.addEventListener('keydown', onKey);
    document.body.appendChild(scrim);
    return { el: scrim, body: b, close };
  }

  function confirm({ title, message, okLabel = 'Confirmar', danger, onOk }) {
    const foot = h('<div class="row gap-3"></div>');
    const cancel = h('<button class="btn ghost">Cancelar</button>');
    const ok = h(`<button class="btn ${danger ? 'danger' : 'primary'}">${esc(okLabel)}</button>`);
    foot.append(cancel, ok);
    const m = modal({ title, body: `<p class="muted" style="line-height:1.6">${esc(message)}</p>`, footer: foot });
    cancel.addEventListener('click', m.close);
    ok.addEventListener('click', () => { m.close(); onOk && onOk(); });
  }

  // prompt-style single input modal
  function ask({ title, label, placeholder, value = '', multiline, okLabel = 'Salvar', onOk }) {
    const input = multiline
      ? h(`<textarea class="textarea" placeholder="${esc(placeholder || '')}">${esc(value)}</textarea>`)
      : h(`<input class="input" placeholder="${esc(placeholder || '')}" value="${esc(value)}">`);
    const wrap = h('<div class="field"></div>');
    if (label) wrap.appendChild(h(`<label>${esc(label)}</label>`));
    wrap.appendChild(input);
    const foot = h('<div class="row gap-3"></div>');
    const cancel = h('<button class="btn ghost">Cancelar</button>');
    const ok = h(`<button class="btn primary">${esc(okLabel)}</button>`);
    foot.append(cancel, ok);
    const m = modal({ title, body: wrap, footer: foot });
    setTimeout(() => input.focus(), 40);
    cancel.addEventListener('click', m.close);
    function submit() { const v = input.value.trim(); m.close(); onOk && onOk(v); }
    ok.addEventListener('click', submit);
    if (!multiline) input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
  }

  // ---------------- Charts (inline SVG) ----------------
  function sparkline(data, opts = {}) {
    const w = opts.w || 260, hgt = opts.h || 56, pad = 4;
    const max = Math.max(...data), min = Math.min(...data);
    const rng = max - min || 1;
    const step = (w - pad * 2) / (data.length - 1);
    const pts = data.map((v, i) => [pad + i * step, hgt - pad - ((v - min) / rng) * (hgt - pad * 2)]);
    const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    const area = d + ` L${pts[pts.length - 1][0].toFixed(1)} ${hgt} L${pts[0][0].toFixed(1)} ${hgt} Z`;
    const id = 'sg' + Math.random().toString(36).slice(2, 7);
    const color = opts.color || 'var(--brand)';
    return `<svg class="spark" viewBox="0 0 ${w} ${hgt}" preserveAspectRatio="none" style="height:${hgt}px">
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".28"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
      <path d="${area}" fill="url(#${id})"/>
      <path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }

  function bars(data, opts = {}) {
    const labels = opts.labels || data.map(() => '');
    const max = Math.max(...data) || 1;
    const color = opts.color || 'var(--brand)';
    return `<div class="bars" style="display:flex;align-items:flex-end;gap:${opts.gap || 8}px;height:${opts.h || 120}px">
      ${data.map((v, i) => `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:7px;height:100%;justify-content:flex-end">
        <div title="${v}" style="width:100%;max-width:34px;border-radius:6px 6px 3px 3px;background:${i === data.length - 1 ? color : 'color-mix(in srgb,' + color + ' 45%, var(--surface-3))'};height:${Math.max(4, (v / max) * 100)}%;transition:height .5s"></div>
        <span style="font-size:10.5px;color:var(--ink-3)">${esc(labels[i] || '')}</span>
      </div>`).join('')}
    </div>`;
  }

  function donut(segments, opts = {}) {
    const size = opts.size || 130, sw = opts.stroke || 16, r = (size - sw) / 2, cx = size / 2, C = 2 * Math.PI * r;
    const total = segments.reduce((s, x) => s + x.v, 0) || 1;
    let off = 0;
    const rings = segments.map((s) => {
      const len = (s.v / total) * C;
      const el = `<circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="${s.color}" stroke-width="${sw}" stroke-dasharray="${len.toFixed(2)} ${(C - len).toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}" transform="rotate(-90 ${cx} ${cx})" stroke-linecap="butt"/>`;
      off += len; return el;
    }).join('');
    return `<svg viewBox="0 0 ${size} ${size}" style="width:${size}px;height:${size}px">
      <circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="var(--surface-3)" stroke-width="${sw}"/>
      ${rings}
      ${opts.center ? `<text x="${cx}" y="${cx - 2}" text-anchor="middle" font-family="var(--font-display)" font-size="${opts.centerSize || 22}" font-weight="600" fill="var(--ink)">${esc(opts.center)}</text>${opts.sub ? `<text x="${cx}" y="${cx + 15}" text-anchor="middle" font-size="10" fill="var(--ink-3)">${esc(opts.sub)}</text>` : ''}` : ''}
    </svg>`;
  }

  // slide art (mini carrossel preview)
  function slideArt(art) {
    if (!art) return '';
    return `<div class="slide-art" style="background:linear-gradient(155deg, ${art.accent}, color-mix(in srgb, ${art.accent} 55%, #05070d));color:#fff">
      <div class="sa-kicker">${esc(art.kicker || '')}</div>
      <div class="sa-title">${art.title || ''}</div>
    </div>`;
  }

  function typeBadge(type) {
    const map = {
      carrossel: ['images', 'Carrossel', 'brand'], post: ['image', 'Post', 'info'],
      tema: ['layers', 'Tema completo', 'violet'], email: ['mail', 'Email', 'ok'],
      anuncio: ['megaphone', 'Anúncio', 'gold'],
    };
    const m = map[type] || ['file', type, ''];
    return `<span class="badge ${m[2]}">${icon(m[0])} ${m[1]}</span>`;
  }

  App.ui = { h, esc, on, delegate, toast, modal, confirm, ask, sparkline, bars, donut, slideArt, typeBadge, icon };
})();
