/* Custo de API — quanto a IA custou no mês. Transparência total. */
(function () {
  const { h, esc, icon, donut, sparkline, bars } = App.ui;
  const store = App.store;

  App.views['custo-api'] = {
    title: 'Custo de API',
    render(root) {
      const cost = store.get().cost; const cap = store.get().spendCap;
      const pct = Math.min(100, (cost.month / (cap || 1)) * 100);
      root.appendChild(h(`<div class="page-head">
        <div class="page-eyebrow">Ajustes · Custo de API</div>
        <h1 class="page-title">Quanto a IA <span class="serif-it">trabalhou</span></h1>
        <p class="page-sub">Quanto a IA custou no mês, pra você nunca ter surpresa na conta. Sem letras miúdas.</p>
      </div>`));

      const top = h('<div class="grid" style="grid-template-columns:1fr 1fr 1fr;align-items:stretch"></div>');
      top.appendChild(h(`<div class="card"><div class="k" style="font-size:12px;color:var(--ink-3);display:flex;gap:7px;align-items:center">${icon('dollar')} Gasto do mês</div><div class="big-num mt-2">US$ ${cost.month.toFixed(2)}</div><div class="muted mt-2" style="font-size:12.5px">de US$ ${cap} de teto · <b style="color:${pct > 80 ? 'var(--danger)' : 'var(--ok)'}">${pct.toFixed(0)}%</b></div><div class="meter ${pct > 80 ? 'danger' : pct > 50 ? 'warn' : 'ok'} mt-3"><i style="width:${pct}%"></i></div></div>`));
      top.appendChild(h(`<div class="card"><div class="k" style="font-size:12px;color:var(--ink-3);display:flex;gap:7px;align-items:center">${icon('zap')} Tarefas rodadas</div><div class="big-num mt-2">${cost.tasks}</div><div class="muted mt-2" style="font-size:12.5px">conteúdos, respostas e análises</div><div class="mt-3">${sparkline(cost.history, { color: 'var(--brand-2)', h: 44 })}</div></div>`));
      top.appendChild(h(`<div class="card"><div class="k" style="font-size:12px;color:var(--ink-3);display:flex;gap:7px;align-items:center">${icon('wallet')} Custo por tarefa</div><div class="big-num mt-2">US$ ${(cost.month / cost.tasks).toFixed(3)}</div><div class="muted mt-2" style="font-size:12.5px">média do mês</div><div class="badge ok mt-3">${icon('trendUp')} dentro do esperado</div></div>`));
      root.appendChild(top);

      const grid = h('<div class="grid" style="grid-template-columns:1fr 1.3fr;margin-top:16px;align-items:start"></div>');
      const donutCard = h(`<div class="card"><div class="card-h"><h3>No que a IA gastou</h3></div>
        <div class="row gap-5 wrap" style="align-items:center;justify-content:center">
          <div>${donut(cost.by, { center: 'US$ ' + cost.month.toFixed(0), sub: 'no mês', size: 150 })}</div>
          <div class="col gap-2">${cost.by.map((b) => `<div class="row between gap-4" style="min-width:180px"><span class="li" style="display:inline-flex;align-items:center;gap:8px;font-size:13px"><span class="sw" style="width:11px;height:11px;border-radius:3px;background:${b.color}"></span>${esc(b.label)}</span><b class="mono" style="font-size:13px">US$ ${b.v.toFixed(2)}</b></div>`).join('')}</div>
        </div>
      </div>`);
      const daysCard = h(`<div class="card"><div class="card-h"><h3>Gasto ao longo do mês</h3><span class="faint" style="font-size:12px">últimas 2 semanas</span></div><div class="mt-3">${bars(cost.history, { h: 150, gap: 6 })}</div></div>`);
      grid.append(donutCard, daysCard);
      root.appendChild(grid);

      root.appendChild(h(`<div class="tip mt-4">${icon('info')}<div>Quer um teto pra nunca passar de um valor? Defina o limite em <a href="#/configuracoes">Configurações</a>. A IA para sozinha ao chegar lá.</div></div>`));
    },
  };
})();
