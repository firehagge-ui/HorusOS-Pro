/* Atividade — o diário do sistema: tudo que a IA fez, com horário. */
(function () {
  const { h, esc, icon, toast } = App.ui;
  const store = App.store;

  App.views['atividade'] = {
    title: 'Atividade',
    render(root) {
      root.appendChild(h(`<div class="page-head">
        <div class="page-eyebrow">Todo dia · Atividade</div>
        <h1 class="page-title">O diário do <span class="serif-it">sistema</span></h1>
        <p class="page-sub">Tudo que o sistema fez, com horário. Serve de transparência: nada acontece escondido.</p>
      </div>`));

      const running = store.get().activity.filter((a) => a.status === 'running');
      const rest = store.get().activity.filter((a) => a.status !== 'running');

      if (running.length) {
        root.appendChild(h(`<div class="section-label" style="margin-top:0">Rodando agora</div>`));
        const rc = h('<div class="card"></div>');
        running.forEach((a) => rc.appendChild(row(a)));
        root.appendChild(rc);
      }

      root.appendChild(h(`<div class="section-label">Histórico</div>`));
      const card = h('<div class="card"></div>');
      groupByDay(rest).forEach((grp) => {
        card.appendChild(h(`<div class="faint" style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;padding:12px 2px 4px">${esc(grp.label)}</div>`));
        grp.items.forEach((a) => card.appendChild(row(a)));
      });
      if (!rest.length) card.appendChild(h(`<div class="empty">${icon('activity')}<div class="t">Ainda sem histórico.</div></div>`));
      root.appendChild(card);

      // demo: simulate finishing the running task
      if (running.length) {
        setTimeout(() => {
          if (!document.body.contains(card)) return;
          store.update((st) => { const r = st.activity.find((a) => a.status === 'running'); if (r) { r.status = 'done'; r.title = r.title.replace(/^Gerando/, 'Gerado'); r.ts = App.util.iso(Date.now()); } });
          toast('Tarefa concluída', { sub: 'O carrossel de clareamento ficou pronto.', icon: 'check' });
          if (App.router.current() === 'atividade') App.router.render();
        }, 6000);
      }

      function row(a) {
        const meta = {
          running: ['running', 'Em andamento', 'spinner'],
          done: ['done', 'Concluído', null],
          published: ['published', 'Publicado', null],
        }[a.status] || ['done', '', null];
        const el = h(`<div class="act-row">
          <div class="act-ic ${meta[0]}">${a.status === 'running' ? '<span class="spinner"></span>' : icon(a.status === 'published' ? 'check' : 'checkSm')}</div>
          <div class="grow">
            <div class="act-t">${esc(a.title)}</div>
            <div class="act-m"><span>${a.status === 'running' ? 'agora mesmo' : App.util.fmtRel(a.ts)}</span> · <span>${meta[1]}</span></div>
          </div>
          ${a.status !== 'running' ? `<button class="btn ghost sm" data-open>${icon('external')} Abrir</button>` : ''}
        </div>`);
        const open = el.querySelector('[data-open]');
        if (open) open.addEventListener('click', () => toast('Abrindo resultado…', { kind: 'info', sub: 'Numa versão conectada, isso abre o post ou o arquivo.' }));
        return el;
      }
    },
  };

  function groupByDay(items) {
    const groups = []; const map = {};
    items.forEach((a) => {
      const d = new Date(a.ts); const key = d.toDateString();
      const today = new Date().toDateString();
      const yest = new Date(Date.now() - 864e5).toDateString();
      const label = key === today ? 'Hoje' : key === yest ? 'Ontem' : d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
      if (!map[key]) { map[key] = { label, items: [] }; groups.push(map[key]); }
      map[key].items.push(a);
    });
    return groups;
  }
})();
