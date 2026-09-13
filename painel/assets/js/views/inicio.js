/* Início — o coração do sistema: mesa do dia, foco, agenda, tarefas. */
(function () {
  const { h, esc, toast, confirm, icon, slideArt } = App.ui;
  const store = App.store;

  function greeting() {
    const hr = new Date().getHours();
    if (hr < 12) return 'Bom dia';
    if (hr < 18) return 'Boa tarde';
    return 'Boa noite';
  }
  function todayLabel() {
    const s = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  App.views['inicio'] = {
    title: 'Início',
    render(root) {
      const s = store.get();
      const b = s.business;
      root.appendChild(h(`
        <div class="page-head">
          <div class="hello-eyebrow">Hoje · ${esc(todayLabel())}</div>
          <h1 class="page-title mt-2">${greeting()}, <span class="serif-it">${esc(b.first)}</span></h1>
          <p class="page-sub">Aqui está o que importa pra ${esc(b.ownerName)} hoje — e o que está esperando o seu sim.</p>
        </div>
      `));

      const grid = h('<div class="grid inicio-grid" style="grid-template-columns:1.55fr 1fr;align-items:start"></div>');
      const left = h('<div class="col gap-5"></div>');
      const right = h('<div class="col gap-4"></div>');
      grid.append(left, right); root.appendChild(grid);

      // FOCO DO DIA
      const total = s.content.length, esperando = store.reviewCount(), agendado = store.countBy('agendado');
      const focus = h(`<div class="card hero-card hero-focus pad-lg">
        <div class="fo-tag">★ Foco do dia</div>
        <h2>${esc(b.ownerName)}</h2>
        <div class="fo-sub">${esc(b.clinicName)} · ${esc(b.city)}</div>
        <div class="focus-stats">
          <div class="focus-stat"><div class="n">${total}</div><div class="l">conteúdos no total</div></div>
          <div class="focus-stat"><div class="n" style="color:var(--warn)">${esperando}</div><div class="l">esperando o seu ok</div></div>
          <div class="focus-stat"><div class="n" style="color:var(--brand-2)">${agendado}</div><div class="l">agendado pra semana</div></div>
        </div>
        <div class="goal-input">
          <input class="input" id="goal" placeholder="Qual a sua meta? Toque pra me dizer onde quer chegar…" value="${esc(s.profile.onde || '')}">
          <button class="btn primary" id="goal-save">Salvar</button>
        </div>
      </div>`);
      left.appendChild(focus);
      focus.querySelector('#goal-save').addEventListener('click', () => {
        const v = focus.querySelector('#goal').value.trim();
        store.update((st) => { st.profile.onde = v; });
        toast('Meta atualizada', { sub: 'A IA vai levar isso em conta em tudo que criar.' });
      });

      // MESA DO DIA
      const mesa = h('<div></div>');
      mesa.appendChild(h(`<div class="mesa-title">${icon('zap')} Mesa do dia · o que preparei pra você</div>`));
      const list = h('<div class="col gap-3"></div>');
      mesa.appendChild(list);
      renderDecisions(list);
      left.appendChild(mesa);

      // Quick shortcuts
      left.appendChild(h(`<div class="mesa-title">${icon('wand')} Atalhos rápidos</div>`));
      const quick = h('<div class="quick-grid"></div>');
      [
        ['images', 'Criar carrossel', 'post de vários slides', () => App.router.go('criar')],
        ['mail', 'Escrever email', 'no seu tom de voz', () => App.router.go('criar')],
        ['megaphone', 'Anúncio no Google', 'traz paciente agora', () => App.router.go('criar')],
        ['chat', 'Conversar', 'peça do seu jeito', () => App.router.go('conversar')],
      ].forEach(([ic, t, d, fn]) => {
        const q = h(`<button class="quick"><span class="qi">${icon(ic)}</span><span><span class="qt">${t}</span><br><span class="qd">${d}</span></span></button>`);
        q.addEventListener('click', fn); quick.appendChild(q);
      });
      left.appendChild(quick);

      // RIGHT · agenda hoje
      const todayISO = new Date().toISOString().slice(0, 10);
      const todays = s.events.filter((e) => e.date === todayISO);
      const agCard = h(`<div class="card">
        <div class="card-h"><h3>${icon('calendar')} Hoje na agenda</h3><a class="link" data-go="agenda">Ver tudo ${icon('arrowR')}</a></div>
        <div class="ag-body"></div>
      </div>`);
      const agBody = agCard.querySelector('.ag-body');
      if (todays.length) {
        todays.forEach((e) => agBody.appendChild(h(`<div class="list-row"><span class="list-ic" style="color:${evColor(e.kind)}">${icon(evIcon(e.kind))}</span><div class="grow"><div style="font-size:13.5px;font-weight:500">${esc(e.title)}</div><div class="faint" style="font-size:12px">${evLabel(e.kind)}</div></div></div>`)));
      } else {
        agBody.appendChild(h(`<div class="empty">${icon('calendar')}<div class="t">Sem compromissos hoje.</div></div>`));
      }
      right.appendChild(agCard);

      // RIGHT · pra fazer
      const tCard = h(`<div class="card">
        <div class="card-h"><h3>${icon('check')} Pra fazer</h3><a class="link" data-addtask>Adicionar ${icon('plus')}</a></div>
        <div class="tasks"></div>
      </div>`);
      const tasksEl = tCard.querySelector('.tasks');
      renderTasks(tasksEl);
      tCard.querySelector('[data-addtask]').addEventListener('click', () => {
        App.ui.ask({ title: 'Nova tarefa', label: 'O que precisa fazer?', placeholder: 'ex: conferir o carrossel novo', onOk(v) { if (!v) return; store.update((st) => st.tasks.push({ id: store.uid(), text: v, done: false })); renderTasks(tasksEl); } });
      });
      right.appendChild(tCard);

      root.addEventListener('click', (e) => { const g = e.target.closest('[data-go]'); if (g) App.router.go(g.dataset.go); });

      function renderDecisions(container) {
        container.innerHTML = '';
        const decs = store.get().decisions;
        if (!decs.length) {
          container.appendChild(h(`<div class="card"><div class="empty">${icon('check')}<div class="t">Tudo em dia. Nada esperando o seu ok agora.</div></div></div>`));
          return;
        }
        decs.forEach((d) => {
          const card = h(`<div class="decision">
            <div class="d-top">${d.tags.map((t) => `<span class="badge ${t.c}">${esc(t.t)}</span>`).join('')}</div>
            <h3>${esc(d.title)}</h3>
            <div class="d-body">${esc(d.body)}</div>
            <ul>${d.bullets.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
            <div class="d-acts">
              <button class="btn ok" data-ap>${icon('check')} Aprovar</button>
              <button class="btn ghost" data-rej>Rejeitar</button>
              <button class="btn ghost" data-adjust>Pedir ajuste</button>
            </div>
          </div>`);
          card.querySelector('[data-ap]').addEventListener('click', () => {
            store.update((st) => { st.decisions = st.decisions.filter((x) => x.id !== d.id); });
            if (d.contentTitle) { const it = store.get().content.find((c) => c.title === d.contentTitle); if (it) store.moveContent(it.id, 'ar'); }
            store.logActivity('published', 'Aprovado e publicado: "' + d.title + '"');
            toast('Aprovado!', { sub: 'Já está indo ao ar no horário certo.', icon: 'check' });
            renderDecisions(container);
          });
          card.querySelector('[data-rej]').addEventListener('click', () => {
            confirm({ title: 'Rejeitar', message: 'Vou descartar “' + d.title + '”. Quer me dizer o que ajustar depois em Conversar?', okLabel: 'Rejeitar', danger: true, onOk() {
              store.update((st) => { st.decisions = st.decisions.filter((x) => x.id !== d.id); });
              store.logActivity('done', 'Rejeitado: "' + d.title + '"');
              toast('Rejeitado', { kind: 'warn', sub: 'Não foi ao ar. Sem problema.' });
              renderDecisions(container);
            }});
          });
          card.querySelector('[data-adjust]').addEventListener('click', () => App.router.go('conversar'));
          container.appendChild(card);
        });
      }

      function renderTasks(container) {
        const tasks = store.get().tasks;
        container.innerHTML = '';
        if (!tasks.length) { container.appendChild(h(`<div class="empty">${icon('check')}<div class="t">Sem tarefas. Tudo em dia.</div></div>`)); return; }
        tasks.forEach((t) => {
          const row = h(`<div class="check-row ${t.done ? 'done' : ''}"><div class="check-box">${icon('checkSm')}</div><div class="check-txt">${esc(t.text)}</div></div>`);
          row.querySelector('.check-box').addEventListener('click', () => { store.update((st) => { const tt = st.tasks.find((x) => x.id === t.id); tt.done = !tt.done; }); renderTasks(container); });
          container.appendChild(row);
        });
      }
    },
  };

  function evColor(k) { return { conteudo: 'var(--brand-2)', prazo: 'var(--warn)', compromisso: 'var(--violet)', dinheiro: 'var(--gold)', venda: 'var(--ok)' }[k] || 'var(--ink-2)'; }
  function evIcon(k) { return { conteudo: 'images', prazo: 'clock', compromisso: 'users', dinheiro: 'dollar', venda: 'trendUp' }[k] || 'dot'; }
  function evLabel(k) { return { conteudo: 'Conteúdo', prazo: 'Prazo', compromisso: 'Compromisso', dinheiro: 'Financeiro', venda: 'Venda' }[k] || ''; }
  App.evMeta = { evColor, evIcon, evLabel };
})();
