/* Conteúdos — quadro kanban de 5 etapas + galeria. Arrasta, aprova, publica. */
(function () {
  const { h, esc, icon, modal, toast, confirm, slideArt, typeBadge } = App.ui;
  const store = App.store;

  const STAGES = [
    { id: 'ideias', label: 'Ideias', color: 'var(--info)', empty: 'Sem ideias ainda', cta: 'Pedir uma ideia' },
    { id: 'producao', label: 'Em produção', color: 'var(--warn)', empty: 'Nada em produção' },
    { id: 'revisar', label: 'Pra revisar', color: 'var(--danger)', empty: 'Nada pra revisar' },
    { id: 'agendado', label: 'Agendado', color: 'var(--brand-2)', empty: 'Nada agendado' },
    { id: 'ar', label: 'No ar', color: 'var(--ok)', empty: 'Nada publicado ainda' },
  ];
  const NEXT = { ideias: 'producao', producao: 'revisar', revisar: 'agendado', agendado: 'ar', ar: 'ar' };
  const PREV = { ar: 'agendado', agendado: 'revisar', revisar: 'producao', producao: 'ideias', ideias: 'ideias' };
  let mode = 'board';

  App.views['conteudos'] = {
    title: 'Conteúdos',
    render(root) {
      root.appendChild(h(`<div class="page-head">
        <div class="page-eyebrow">Todo dia · Conteúdos</div>
        <div class="row between wrap gap-3">
          <div>
            <h1 class="page-title">Seus posts, do rascunho <span class="serif-it">ao ar</span></h1>
            <p class="page-sub">Tudo que o sistema produziu, do primeiro rascunho ao que já está no ar.</p>
          </div>
          <div class="segmented" id="view-toggle">
            <button data-m="board" class="on">${icon('columns')} Quadro</button>
            <button data-m="gallery">${icon('grid')} Galeria</button>
          </div>
        </div>
      </div>`));

      const holder = h('<div id="cn-holder"></div>');
      root.appendChild(holder);
      draw(holder);

      root.querySelector('#view-toggle').addEventListener('click', (e) => {
        const btn = e.target.closest('[data-m]'); if (!btn) return;
        mode = btn.dataset.m;
        root.querySelectorAll('#view-toggle button').forEach((b) => b.classList.toggle('on', b === btn));
        draw(holder);
      });
      const unsub = store.subscribe(() => { if (document.body.contains(holder)) draw(holder); });
      // cleanup when navigating away
      const mo = new MutationObserver(() => { if (!document.body.contains(holder)) { unsub(); mo.disconnect(); } });
      mo.observe(document.getElementById('content-scroll'), { childList: true });
    },
  };

  function draw(holder) {
    holder.innerHTML = '';
    holder.appendChild(mode === 'board' ? board() : gallery());
  }

  function board() {
    const wrap = h('<div class="kanban"></div>');
    STAGES.forEach((st) => {
      const items = store.get().content.filter((c) => c.stage === st.id);
      const col = h(`<div class="kcol" data-stage="${st.id}">
        <div class="kcol-h"><span class="dot" style="background:${st.color}"></span><span class="t">${st.label}</span><span class="n">${items.length}</span></div>
        <div class="kcol-body" data-body="${st.id}"></div>
      </div>`);
      const body = col.querySelector('.kcol-body');
      if (!items.length) {
        const e = h(`<div class="empty" style="padding:22px 12px">${icon('layers')}<div class="t">${st.empty}</div>${st.cta ? `<button class="btn sm ghost" style="margin-top:6px">${icon('plus')} ${st.cta}</button>` : ''}</div>`);
        if (st.cta) e.querySelector('button').addEventListener('click', () => App.router.go('conversar'));
        body.appendChild(e);
      } else {
        items.forEach((it) => body.appendChild(card(it)));
      }
      // drop target
      body.addEventListener('dragover', (e) => { e.preventDefault(); body.classList.add('drop'); });
      body.addEventListener('dragleave', () => body.classList.remove('drop'));
      body.addEventListener('drop', (e) => {
        e.preventDefault(); body.classList.remove('drop');
        const id = e.dataTransfer.getData('text/id');
        if (id) { store.moveContent(id, st.id); toast('Movido para “' + st.label + '”', { kind: 'info' }); }
      });
      wrap.appendChild(col);
    });
    return wrap;
  }

  function card(it) {
    const el = h(`<div class="kcard" draggable="true" data-id="${it.id}">
      ${it.art ? `<div class="thumb">${slideArt(it.art)}</div>` : `<div class="thumb" style="background:linear-gradient(155deg,var(--surface-2),var(--surface))">${icon(typeIcon(it.type))}</div>`}
      <div class="kbody">
        <div class="ktype">${typeLabel(it.type)}${it.slides ? ' · ' + it.slides + ' slides' : ''}</div>
        <div class="ktitle">${esc(it.title)}</div>
        <div class="kmeta"><span class="faint" style="font-size:11px">${icon('clock')} ${App.util.fmtRel(it.updated)}</span></div>
      </div>
    </div>`);
    el.querySelector('.thumb svg') && (el.querySelector('.thumb svg').style.cssText = 'width:30px;height:30px;color:var(--ink-3)');
    el.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/id', it.id); el.classList.add('dragging'); });
    el.addEventListener('dragend', () => el.classList.remove('dragging'));
    el.addEventListener('click', () => detail(it));
    return el;
  }

  function gallery() {
    const arted = store.get().content.filter((c) => c.art);
    if (!arted.length) return h(`<div class="card"><div class="empty">${icon('images')}<div class="t">Nenhuma arte pra mostrar ainda.</div></div></div>`);
    const g = h('<div class="mural"></div>');
    arted.forEach((it) => {
      const ref = h(`<div class="ref" style="cursor:pointer"><div class="rimg" style="height:200px;background:linear-gradient(155deg, ${it.art.accent}, color-mix(in srgb,${it.art.accent} 55%, #05070d))"><div class="slide-art" style="position:absolute;inset:0;padding:16px;display:flex;flex-direction:column;justify-content:center"><div class="sa-kicker">${esc(it.art.kicker)}</div><div class="sa-title">${it.art.title}</div></div></div><div class="rb"><div class="rt">${esc(it.title)}</div><div class="faint" style="font-size:11px;margin-top:4px">${typeLabel(it.type)} · ${stageLabel(it.stage)}</div></div></div>`);
      ref.addEventListener('click', () => detail(it));
      g.appendChild(ref);
    });
    return g;
  }

  function detail(it) {
    const st = STAGES.find((s) => s.id === it.stage);
    const body = h(`<div>
      <div class="row gap-2 wrap" style="margin-bottom:12px">${typeBadge(it.type)}<span class="badge" style="color:${st.color}"><span class="dot" style="background:${st.color}"></span>${st.label}</span></div>
      <h2>${esc(it.title)}</h2>
      <p class="muted mt-2" style="line-height:1.6">${esc(it.caption || '')}</p>
      ${it.art ? `<div class="detail-slides mt-4">${miniSlides(it)}</div>` : ''}
      <div class="mt-5">
        <div class="section-label" style="margin:0 0 10px">Mover para</div>
        <div class="pill-tabs" id="stage-pick">${STAGES.map((s) => `<button class="btn sm ${s.id === it.stage ? 'primary' : 'ghost'}" data-s="${s.id}"><span class="dot" style="width:7px;height:7px;border-radius:9px;background:${s.color};display:inline-block"></span> ${s.label}</button>`).join('')}</div>
      </div>
    </div>`);
    const foot = h('<div class="row between grow" style="width:100%"></div>');
    const del = h(`<button class="btn danger sm">${icon('trash')} Excluir</button>`);
    const right = h('<div class="row gap-3"></div>');
    const ap = h(`<button class="btn ok">${icon('check')} Aprovar e publicar</button>`);
    right.appendChild(ap); foot.append(del, right);
    const m = modal({ title: 'Conteúdo', body, footer: foot, wide: true });
    body.querySelector('#stage-pick').addEventListener('click', (e) => { const btn = e.target.closest('[data-s]'); if (!btn) return; store.moveContent(it.id, btn.dataset.s); it.stage = btn.dataset.s; toast('Movido para “' + STAGES.find((s) => s.id === btn.dataset.s).label + '”', { kind: 'info' }); m.close(); });
    ap.addEventListener('click', () => { store.moveContent(it.id, 'ar'); store.logActivity('published', 'Publicado: "' + it.title + '"'); m.close(); toast('Publicado!', { sub: 'No ar no Instagram e no Facebook.', icon: 'check' }); });
    del.addEventListener('click', () => confirm({ title: 'Excluir', message: 'Remover “' + it.title + '” de vez?', okLabel: 'Excluir', danger: true, onOk() { store.removeContent(it.id); m.close(); toast('Removido', { kind: 'warn' }); } }));
  }

  function miniSlides(it) {
    const n = Math.min(it.slides || 3, 6); let out = '';
    for (let i = 0; i < n; i++) out += `<div class="detail-slide" style="background:linear-gradient(155deg, ${it.art.accent}, color-mix(in srgb,${it.art.accent} 55%, #05070d))"><div style="font-size:8px;letter-spacing:.12em;text-transform:uppercase;opacity:.8">${i === 0 ? esc(it.art.kicker) : 'Slide ' + (i + 1)}</div><div style="margin-top:auto;font-family:var(--font-display);font-weight:700;font-size:${i === 0 ? 14 : 11}px;line-height:1.1">${i === 0 ? it.art.title : '···'}</div></div>`;
    return out;
  }

  function typeIcon(t) { return { carrossel: 'images', post: 'image', tema: 'layers', email: 'mail', anuncio: 'megaphone' }[t] || 'file'; }
  function typeLabel(t) { return { carrossel: 'Carrossel', post: 'Post', tema: 'Tema', email: 'Email', anuncio: 'Anúncio' }[t] || 'Conteúdo'; }
  function stageLabel(s) { return (STAGES.find((x) => x.id === s) || {}).label || s; }
})();
