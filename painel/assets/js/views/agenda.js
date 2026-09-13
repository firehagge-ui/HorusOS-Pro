/* Agenda — o mês inteiro num lugar, separado por cor. */
(function () {
  const { h, esc, icon, modal, toast } = App.ui;
  const store = App.store;
  let cursor = new Date();

  const KINDS = [
    { id: 'conteudo', label: 'Conteúdo', color: '#60A5FA' },
    { id: 'prazo', label: 'Prazo', color: '#F59E0B' },
    { id: 'compromisso', label: 'Compromisso', color: '#A98BF0' },
    { id: 'dinheiro', label: 'Financeiro', color: '#F4C430' },
    { id: 'venda', label: 'Venda', color: '#34D399' },
  ];
  const kColor = (k) => (KINDS.find((x) => x.id === k) || {}).color || '#6D7280';

  App.views['agenda'] = {
    title: 'Agenda',
    render(root) {
      root.appendChild(h(`<div class="page-head">
        <div class="page-eyebrow">Todo dia · Agenda</div>
        <h1 class="page-title">O mês inteiro <span class="serif-it">num lugar</span></h1>
        <p class="page-sub">Conteúdos, prazos, compromissos e vendas — o mês inteiro, separado por cor.</p>
      </div>`));

      const bar = h(`<div class="row between wrap gap-3" style="margin-bottom:14px">
        <div class="row gap-2">
          <button class="btn icon sm" id="prev">${icon('chevL')}</button>
          <div style="font-family:var(--font-display);font-weight:600;font-size:17px;min-width:170px;text-align:center" id="mlabel"></div>
          <button class="btn icon sm" id="next">${icon('chevR')}</button>
          <button class="btn ghost sm" id="today">Hoje</button>
        </div>
        <div class="row gap-3 wrap">
          <button class="btn sm" id="gcal">${icon('calendar')} Sincronizar Google Agenda</button>
          <button class="btn primary sm" id="add">${icon('calPlus')} Novo evento</button>
        </div>
      </div>`);
      root.appendChild(bar);

      const legend = h(`<div class="legend" style="margin-bottom:14px">${KINDS.map((k) => `<span class="li"><span class="sw" style="background:${k.color}"></span>${k.label}</span>`).join('')}</div>`);
      root.appendChild(legend);

      const calHost = h('<div></div>');
      root.appendChild(calHost);
      drawCal();

      bar.querySelector('#prev').addEventListener('click', () => { cursor.setMonth(cursor.getMonth() - 1); drawCal(); });
      bar.querySelector('#next').addEventListener('click', () => { cursor.setMonth(cursor.getMonth() + 1); drawCal(); });
      bar.querySelector('#today').addEventListener('click', () => { cursor = new Date(); drawCal(); });
      bar.querySelector('#add').addEventListener('click', () => addEvent());
      bar.querySelector('#gcal').addEventListener('click', () => {
        const on = !store.get().connections.gcal;
        store.update((st) => st.connections.gcal = on);
        toast(on ? 'Google Agenda conectado' : 'Google Agenda desconectado', { kind: on ? 'ok' : 'warn', sub: on ? 'Seus eventos vão aparecer nos dois lugares.' : '' });
      });

      function drawCal() {
        calHost.innerHTML = '';
        const y = cursor.getFullYear(), m = cursor.getMonth();
        bar.querySelector('#mlabel').textContent = cursor.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).replace(/^./, (c) => c.toUpperCase());
        const first = new Date(y, m, 1);
        const start = new Date(first); start.setDate(1 - ((first.getDay() + 6) % 7)); // week starts Monday
        const todayISO = new Date().toISOString().slice(0, 10);
        const cal = h(`<div class="cal">${['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((d) => `<div class="dow">${d}</div>`).join('')}</div>`);
        for (let i = 0; i < 42; i++) {
          const d = new Date(start); d.setDate(start.getDate() + i);
          const iso = d.toISOString().slice(0, 10);
          const out = d.getMonth() !== m;
          const evs = store.get().events.filter((e) => e.date === iso);
          const cell = h(`<div class="cell ${out ? 'out' : ''} ${iso === todayISO ? 'today' : ''}"><div class="num">${d.getDate()}</div></div>`);
          evs.slice(0, 3).forEach((e) => { const ev = h(`<div class="ev" style="background:${kColor(e.kind)};color:${e.kind === 'dinheiro' ? '#3a2f05' : '#04121f'}" title="${esc(e.title)}">${esc(e.title)}</div>`); ev.addEventListener('click', ( x) => { x.stopPropagation(); openEvent(e); }); cell.appendChild(ev); });
          if (evs.length > 3) cell.appendChild(h(`<div class="faint" style="font-size:10px">+${evs.length - 3} mais</div>`));
          cell.addEventListener('click', () => addEvent(iso));
          cal.appendChild(cell);
        }
        calHost.appendChild(cal);
      }

      function addEvent(dateISO) {
        const d = dateISO || new Date().toISOString().slice(0, 10);
        const body = h(`<div>
          <div class="field"><label>O que é?</label><input class="input" id="ev-t" placeholder="ex: gravar vídeo de bastidor"></div>
          <div class="grid g2 mt-3">
            <div class="field"><label>Data</label><input class="input" type="date" id="ev-d" value="${d}"></div>
            <div class="field"><label>Tipo</label><select class="select" id="ev-k">${KINDS.map((k) => `<option value="${k.id}">${k.label}</option>`).join('')}</select></div>
          </div>
        </div>`);
        const foot = h('<div class="row gap-3"></div>');
        const ok = h('<button class="btn primary">Adicionar</button>');
        foot.appendChild(ok);
        const m2 = modal({ title: 'Novo evento', body, footer: foot });
        ok.addEventListener('click', () => {
          const t = body.querySelector('#ev-t').value.trim(); if (!t) { toast('Dê um nome ao evento', { kind: 'warn' }); return; }
          store.update((st) => st.events.push({ id: store.uid(), date: body.querySelector('#ev-d').value, title: t, kind: body.querySelector('#ev-k').value }));
          m2.close(); drawCal(); toast('Evento adicionado');
        });
      }
      function openEvent(e) {
        const body = h(`<div><div class="row gap-2" style="margin-bottom:10px"><span class="badge" style="color:${kColor(e.kind)}"><span class="dot" style="background:${kColor(e.kind)}"></span>${(KINDS.find((k) => k.id === e.kind) || {}).label}</span></div><h2>${esc(e.title)}</h2><p class="muted mt-2">${new Date(e.date + 'T00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p></div>`);
        const foot = h('<div class="row gap-3"></div>');
        const del = h(`<button class="btn danger sm">${icon('trash')} Remover</button>`);
        foot.appendChild(del);
        const m2 = modal({ title: 'Evento', body, footer: foot });
        del.addEventListener('click', () => { store.update((st) => st.events = st.events.filter((x) => x.id !== e.id)); m2.close(); drawCal(); toast('Removido', { kind: 'warn' }); });
      }
    },
  };
})();
