/* =========================================================================
   HORUS · Painel — app.js
   Boots the shell: login → sidebar + topbar + content + floating chat.
   ========================================================================= */
(function () {
  const { h, on, toast, modal } = App.ui;
  const icon = App.icon;
  const store = App.store;

  App.NAV = [
    { group: 'Todo dia', items: [
      { id: 'inicio', label: 'Início', icon: 'home' },
      { id: 'conversar', label: 'Conversar', icon: 'chat' },
      { id: 'criar', label: 'Criar', icon: 'wand' },
      { id: 'conteudos', label: 'Conteúdos', icon: 'columns' },
      { id: 'atividade', label: 'Atividade', icon: 'activity' },
      { id: 'relatorio', label: 'Relatório', icon: 'barchart' },
      { id: 'agenda', label: 'Agenda', icon: 'calendar' },
    ]},
    { group: 'Ajustes', items: [
      { id: 'modelos', label: 'Modelos', icon: 'template' },
      { id: 'referencias', label: 'Referências', icon: 'bookmark' },
      { id: 'landing', label: 'Landing page', icon: 'globe' },
      { id: 'arquivos', label: 'Arquivos', icon: 'folder' },
      { id: 'meu-negocio', label: 'Meu negócio', icon: 'briefcase' },
      { id: 'o-que-sei', label: 'O que sei', icon: 'brain' },
      { id: 'marca', label: 'Marca', icon: 'palette' },
      { id: 'configuracoes', label: 'Configurações', icon: 'settings' },
      { id: 'custo-api', label: 'Custo de API', icon: 'dollar' },
      { id: 'guia', label: 'Guia do sistema', icon: 'lightbulb' },
    ]},
  ];

  const CRUMBS = {};
  App.NAV.forEach((g) => g.items.forEach((it) => { CRUMBS[it.id] = { group: g.group, label: it.label }; }));
  App.crumbFor = (id) => CRUMBS[id] || { group: '', label: '' };

  // ---------------- LOGIN / SPLASH ----------------
  function loginView() {
    const b = store.get().business;
    const el = h(`<div class="login">
      <div class="login-bg"></div>
      <div class="login-card">
        <div class="login-eye">${icon('horusEye')}</div>
        <div class="login-kicker">Guia do seu sistema</div>
        <h1 class="login-title">O seu sistema,<br><span class="serif-it">por dentro</span></h1>
        <p class="login-sub">Uma assistente com inteligência artificial que já conhece a sua marca, o seu jeito de falar e o seu público. Cria os conteúdos, organiza tudo e — quando você deixa — publica por você.</p>
        <button class="btn primary lg block login-go">Entrar no painel ${icon('arrowR')}</button>
        <div class="login-two">
          <div><b>Feito para</b><br>${App.ui.esc(b.ownerName)} · ${App.ui.esc(b.clinicName)}</div>
          <div class="login-by">POR <b>HÓRUS</b></div>
        </div>
      </div>
    </div>`);
    el.querySelector('.login-go').addEventListener('click', () => {
      try { sessionStorage.setItem('horus_entered', '1'); } catch (e) {}
      mountShell();
      if (!store.get().onboarded) startOnboarding();
    });
    return el;
  }

  // ---------------- SHELL ----------------
  function sidebar() {
    const b = store.get().business;
    const nav = App.NAV.map((g) => `
      <div class="nav-group">
        <div class="nav-group-label">${g.group}</div>
        ${g.items.map((it) => `<button class="nav-item" data-view="${it.id}">${icon(it.icon)}<span>${it.label}</span><span class="nav-badge" data-badge="${it.id}" hidden></span></button>`).join('')}
      </div>`).join('');
    return h(`<aside class="sidebar" id="sidebar">
      <div class="side-brand">
        <div class="logo-badge">${icon('tooth')}</div>
        <div><div class="bname" data-bname>${App.ui.esc(b.ownerName)}</div><div class="btag" data-btag>${App.ui.esc(b.clinicName)}</div></div>
      </div>
      <nav class="side-nav">${nav}</nav>
      <div class="side-foot"><span class="horus-eye">${icon('horusEye')}</span><span>Sistema <b>Hórus</b> · seu servidor privado</span></div>
    </aside>`);
  }

  function topbar() {
    const s = store.get();
    return h(`<header class="topbar">
      <button class="tb-btn icon hamb" id="hamb" aria-label="Menu">${icon('grid')}</button>
      <div class="crumb"><span data-crumb-group>Todo dia</span> <span>·</span> <b data-crumb-label>Início</b></div>
      <div class="tb-spacer"></div>
      <button class="tb-btn icon" id="tb-search" title="Buscar (⌘K)" aria-label="Buscar">${icon('search')}</button>
      <button class="tb-chip tb-hide-sm" id="tb-clinic"><span class="av" data-av>${initials(s.business.ownerName)}</span><span class="tb-name" data-clinic>${App.ui.esc(s.business.ownerName)}</span></button>
      <button class="tb-btn tb-cost tb-hide-sm" id="tb-cost" title="Custo de API">US$ <span data-cost>${s.cost.month.toFixed(0)}</span></button>
      <button class="tb-btn tb-mode ${s.autonomy === 'auto' ? '' : 'manual'}" id="tb-mode" title="Nível de autonomia"><span class="dot"></span><span data-mode>${s.autonomy === 'auto' ? 'Automático' : 'Sempre pergunta'}</span></button>
      <button class="tb-btn icon" id="tb-gear" aria-label="Configurações">${icon('settings')}</button>
    </header>`);
  }

  function initials(name) {
    const p = String(name || '').replace(/^Dr[a]?\.?\s*/i, '').trim().split(/\s+/);
    return ((p[0] || '')[0] || 'H').toUpperCase() + ((p[1] || '')[0] || '').toUpperCase();
  }

  function mountShell() {
    const app = document.getElementById('app');
    app.innerHTML = '';
    const shell = h('<div class="shell"></div>');
    const main = h('<div class="main"></div>');
    const scroll = h('<div class="content-scroll" id="content-scroll"></div>');
    main.append(topbar(), scroll);
    shell.append(sidebar(), main);
    const scrim = h('<div class="scrim" id="scrim"></div>');
    const fab = h(`<button class="fab-chat" id="fab-chat">${icon('chat')} Conversar</button>`);
    app.append(shell, scrim, fab);

    // wire nav
    shell.querySelectorAll('.nav-item').forEach((el) => el.addEventListener('click', () => App.router.go(el.dataset.view)));
    // topbar buttons
    document.getElementById('hamb').addEventListener('click', toggleSidebar);
    scrim.addEventListener('click', closeSidebar);
    document.getElementById('fab-chat').addEventListener('click', () => App.router.go('conversar'));
    document.getElementById('tb-search').addEventListener('click', openPalette);
    document.getElementById('tb-clinic').addEventListener('click', () => App.router.go('meu-negocio'));
    document.getElementById('tb-cost').addEventListener('click', () => App.router.go('custo-api'));
    document.getElementById('tb-gear').addEventListener('click', () => App.router.go('configuracoes'));
    document.getElementById('tb-mode').addEventListener('click', toggleMode);
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPalette(); }
    });

    App.shell = { syncNav, syncCrumb, closeSidebar, refreshTopbar, refreshSidebar };
    store.subscribe(() => { refreshTopbar(); refreshBadges(); });
    App.applyBrand();
    refreshBadges();
    App.router.render();
  }

  function toggleSidebar() { const sb = document.getElementById('sidebar'); const sc = document.getElementById('scrim'); sb.classList.toggle('open'); sc.classList.toggle('show', sb.classList.contains('open')); }
  function closeSidebar() { const sb = document.getElementById('sidebar'); const sc = document.getElementById('scrim'); if (sb) sb.classList.remove('open'); if (sc) sc.classList.remove('show'); }

  function toggleMode() {
    const s = store.get();
    const next = s.autonomy === 'auto' ? 'manual' : 'auto';
    store.set({ autonomy: next });
    toast(next === 'auto' ? 'Modo automático ligado' : 'Modo "sempre pergunta" ligado', { kind: 'info', sub: next === 'auto' ? 'A IA publica sozinha no horário certo.' : 'Nada vai ao ar sem o seu ok.', icon: next === 'auto' ? 'zap' : 'shield' });
  }

  function syncNav(id) {
    document.querySelectorAll('.nav-item').forEach((el) => el.classList.toggle('active', el.dataset.view === id));
  }
  function syncCrumb(label) {
    const id = App.router.resolve();
    const c = App.crumbFor(id);
    const g = document.querySelector('[data-crumb-group]'), l = document.querySelector('[data-crumb-label]');
    if (g) g.textContent = c.group || '';
    if (l) l.textContent = c.label || label || '';
  }
  function refreshTopbar() {
    const s = store.get();
    setText('[data-cost]', s.cost.month.toFixed(0));
    setText('[data-clinic]', s.business.ownerName);
    setText('[data-av]', initials(s.business.ownerName));
    setText('[data-mode]', s.autonomy === 'auto' ? 'Automático' : 'Sempre pergunta');
    const mode = document.getElementById('tb-mode'); if (mode) mode.classList.toggle('manual', s.autonomy !== 'auto');
  }
  function refreshSidebar() {
    const b = store.get().business;
    setText('[data-bname]', b.ownerName); setText('[data-btag]', b.clinicName);
  }
  function refreshBadges() {
    const rev = store.reviewCount();
    const el = document.querySelector('[data-badge="inicio"]');
    if (el) { if (rev > 0) { el.textContent = rev; el.hidden = false; } else el.hidden = true; }
    const cel = document.querySelector('[data-badge="conteudos"]');
    if (cel) { if (rev > 0) { cel.textContent = rev; cel.hidden = false; } else cel.hidden = true; }
  }
  function setText(sel, v) { const el = document.querySelector(sel); if (el) el.textContent = v; }

  // ---------------- Command palette ----------------
  function openPalette() {
    const items = [];
    App.NAV.forEach((g) => g.items.forEach((it) => items.push({ type: 'Ir para', label: it.label, icon: it.icon, run: () => App.router.go(it.id) })));
    const acts = [
      { type: 'Ação', label: 'Criar carrossel', icon: 'images', run: () => { App.router.go('criar'); } },
      { type: 'Ação', label: 'Escrever email', icon: 'mail', run: () => { App.router.go('criar'); } },
      { type: 'Ação', label: 'Conversar com a IA', icon: 'chat', run: () => App.router.go('conversar') },
      { type: 'Ação', label: 'Ver o que precisa do meu ok', icon: 'check', run: () => App.router.go('conteudos') },
    ];
    const all = acts.concat(items);
    const box = h(`<div class="pal">
      <div class="input-wrap">${icon('search')}<input class="input pal-input" placeholder="Buscar telas e ações…" autofocus></div>
      <div class="pal-list"></div>
    </div>`);
    const m = modal({ title: '', body: box });
    m.el.querySelector('.modal-h').remove();
    m.body.style.padding = '10px';
    const input = box.querySelector('.pal-input');
    const list = box.querySelector('.pal-list');
    function draw(q) {
      const f = all.filter((x) => x.label.toLowerCase().includes(q.toLowerCase()));
      list.innerHTML = f.map((x, i) => `<button class="pal-row ${i === 0 ? 'on' : ''}" data-i="${all.indexOf(x)}">${icon(x.icon)}<span class="pl">${App.ui.esc(x.label)}</span><span class="pt">${x.type}</span></button>`).join('') || `<div class="empty" style="padding:20px">${icon('search')}<div class="t">Nada encontrado</div></div>`;
    }
    draw('');
    input.addEventListener('input', () => draw(input.value));
    list.addEventListener('click', (e) => { const r = e.target.closest('.pal-row'); if (r) { m.close(); all[+r.dataset.i].run(); } });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { const first = list.querySelector('.pal-row'); if (first) { m.close(); all[+first.dataset.i].run(); } }
    });
    setTimeout(() => input.focus(), 40);
  }
  App.openPalette = openPalette;

  // ---------------- Onboarding (light) ----------------
  function startOnboarding() {
    const b = store.get().business;
    const body = h(`<div>
      <p class="muted" style="line-height:1.65">Antes de começar, confirme o essencial. A IA usa isso pra soar como você. Dá pra mudar tudo depois em <b>Meu negócio</b> e <b>Marca</b>.</p>
      <div class="field mt-4"><label>Nome que aparece no painel</label><input class="input" id="ob-name" value="${App.ui.esc(b.ownerName)}"></div>
      <div class="field mt-3"><label>Nome da clínica</label><input class="input" id="ob-clinic" value="${App.ui.esc(b.clinicName)}"></div>
      <div class="field mt-3"><label>Cidade</label><input class="input" id="ob-city" value="${App.ui.esc(b.city)}"></div>
      <div class="row gap-3 mt-4"><span class="muted" style="font-size:12.5px">Cor da sua marca</span>
        <input type="color" id="ob-color" value="${store.get().brand.accent}" style="width:44px;height:32px;border:none;background:none;border-radius:8px;cursor:pointer">
      </div>
    </div>`);
    const foot = h('<div class="row gap-3"></div>');
    const skip = h('<button class="btn ghost">Depois</button>');
    const okb = h(`<button class="btn primary">Começar ${icon('arrowR')}</button>`);
    foot.append(skip, okb);
    const m = modal({ title: 'Bem-vinda ao seu painel', body, footer: foot });
    function finish(save) {
      if (save) {
        const name = body.querySelector('#ob-name').value.trim() || b.ownerName;
        const clinic = body.querySelector('#ob-clinic').value.trim() || b.clinicName;
        const city = body.querySelector('#ob-city').value.trim() || b.city;
        const color = body.querySelector('#ob-color').value;
        store.update((st) => { st.business.ownerName = name; st.business.clinicName = clinic; st.business.city = city; st.business.first = name.replace(/^Dr[a]?\.?\s*/i, '').split(' ')[0]; st.brand.accent = color; st.brand.logoText = name; st.onboarded = true; });
        store.setBrand({});
        App.shell.refreshSidebar();
        toast('Tudo pronto, ' + store.get().business.first + '!', { sub: 'Seu painel já está com a sua cara.' });
      } else { store.update((st) => { st.onboarded = true; }); }
      m.close();
    }
    skip.addEventListener('click', () => finish(false));
    okb.addEventListener('click', () => finish(true));
  }
  App.startOnboarding = startOnboarding;

  // ---------------- boot ----------------
  App.boot = function () {
    App.applyBrand();
    let entered = false;
    try { entered = sessionStorage.getItem('horus_entered') === '1'; } catch (e) {}
    if (entered) mountShell();
    else { const app = document.getElementById('app'); app.innerHTML = ''; app.appendChild(loginView()); }
  };
})();
