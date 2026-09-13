/* =========================================================================
   HORUS · Painel — router.js
   Hash router. Mounts App.views[id] into the content area.
   ========================================================================= */
(function () {
  window.App = window.App || {};
  App.views = App.views || {};
  const { h } = App.ui;
  let current = null;

  function go(id) { location.hash = '#/' + id; }

  function resolve() {
    const raw = (location.hash || '').replace(/^#\/?/, '').split('?')[0];
    return raw || 'inicio';
  }

  function render() {
    const id = resolve();
    const view = App.views[id] || App.views['inicio'];
    const scroll = document.getElementById('content-scroll');
    if (!scroll) return;
    scroll.scrollTop = 0;
    scroll.innerHTML = '';
    const root = h('<div class="content"></div>');
    scroll.appendChild(root);
    current = id;
    try { view.render(root); } catch (e) { console.error('view error', id, e); root.innerHTML = `<div class="empty">${App.icon('info')}<div class="t">Algo não carregou nesta tela.</div></div>`; }
    App.shell && App.shell.syncNav(view === App.views[id] ? id : 'inicio');
    App.shell && App.shell.syncCrumb(view.crumb || view.title || '');
    // close mobile sidebar on nav
    App.shell && App.shell.closeSidebar();
    document.title = (view.title ? view.title + ' · ' : '') + 'Painel Hórus';
  }

  window.addEventListener('hashchange', render);
  App.router = { go, render, current: () => current, resolve };
})();
