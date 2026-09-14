/* Relatório — a semana em números, em português claro. */
(function () {
  const { h, esc, icon, bars, sparkline } = App.ui;
  const store = App.store;

  App.views['relatorio'] = {
    title: 'Relatório',
    render(root) {
      const r = store.get().report;
      root.appendChild(h(`<div class="page-head">
        <div class="page-eyebrow">Todo dia · Relatório</div>
        <h1 class="page-title">A sua semana em <span class="serif-it">números</span></h1>
        <p class="page-sub">Como o seu Instagram foi nos últimos 7 dias, sem termo técnico. Um resumo pra ler em 2 minutos.</p>
      </div>`));

      if (!store.get().connections.instagram) {
        const banner = h(`<div class="card" style="border-color:color-mix(in srgb,var(--brand) 40%,transparent);background:var(--brand-soft);margin-bottom:18px">
          <div class="row between wrap gap-3">
            <div class="row gap-3"><span class="list-ic" style="background:transparent;color:var(--brand-2)">${icon('instagram')}</span><div><div style="font-weight:600">Conecte o Instagram pra dados reais</div><div class="muted" style="font-size:13px">Os números abaixo são uma amostra. Ligue a conta em Configurações pra ver a sua semana de verdade.</div></div></div>
            <button class="btn primary sm" data-go="configuracoes">Conectar</button>
          </div>
        </div>`);
        banner.querySelector('[data-go]').addEventListener('click', () => App.router.go('configuracoes'));
        root.appendChild(banner);
      }

      const stats = [
        ['eye', 'Alcance', r.reach.toLocaleString('pt-BR'), r.reachDelta, 'pessoas viram você'],
        ['users', 'Seguidores', r.followers.toLocaleString('pt-BR'), r.followersDelta, 'no total'],
        ['heart', 'Interações', r.interactions.toLocaleString('pt-BR'), r.interactionsDelta, 'curtidas, salvos, comentários'],
        ['target', 'Visitas ao perfil', r.profileViews.toLocaleString('pt-BR'), r.profileDelta, 'nos 7 dias'],
      ];
      const g = h('<div class="grid g4"></div>');
      stats.forEach(([ic, k, v, d, sub]) => {
        g.appendChild(h(`<div class="stat"><div class="k">${icon(ic)} ${k}</div><div class="v">${v}</div><div class="d ${d >= 0 ? 'up' : 'down'}">${icon(d >= 0 ? 'trendUp' : 'activity')} ${d >= 0 ? '+' : ''}${d}% <span class="faint">· ${sub}</span></div></div>`));
      });
      root.appendChild(g);

      const grid = h('<div class="grid" style="grid-template-columns:1.5fr 1fr;margin-top:16px;align-items:start"></div>');
      const chart = h(`<div class="card">
        <div class="card-h"><h3>Alcance por dia</h3><span class="badge ok">${icon('trendUp')} crescendo</span></div>
        <div class="mt-3">${bars(r.days, { labels: ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'], h: 150 })}</div>
        <div class="muted mt-4" style="font-size:13px;line-height:1.6">Sua melhor performance foi no <b>fim de semana</b>. Vale concentrar os posts de captação de sexta a domingo.</div>
      </div>`);
      const top = h(`<div class="card">
        <div class="card-h"><h3>Post que mais funcionou</h3></div>
        <div class="card tight" style="background:var(--surface-2)">
          <div class="row gap-3"><span class="list-ic" style="background:var(--brand-soft);color:var(--brand-2)">${icon('images')}</span><div><div style="font-weight:600;font-size:14px">${esc(r.topPost.title)}</div><div class="faint" style="font-size:12px">Carrossel</div></div></div>
          <div class="row gap-4 mt-3">
            <div><div class="mono" style="font-size:18px;font-weight:600">${r.topPost.reach.toLocaleString('pt-BR')}</div><div class="faint" style="font-size:11px">alcance</div></div>
            <div><div class="mono" style="font-size:18px;font-weight:600">${r.topPost.saves}</div><div class="faint" style="font-size:11px">salvos</div></div>
            <div><div class="mono" style="font-size:18px;font-weight:600">${r.topPost.comments}</div><div class="faint" style="font-size:11px">comentários</div></div>
          </div>
        </div>
        <div class="tip mt-4">${icon('lightbulb')}<div>Posts que explicam “como funciona” salvam mais. A IA já sabe disso e vai priorizar esse formato.</div></div>
      </div>`);
      grid.append(chart, top);
      root.appendChild(grid);

      root.appendChild(h(`<div class="card mt-4">
        <div class="card-h"><h3>Resumo da semana</h3><span class="faint" style="font-size:12px">gerado pela IA</span></div>
        <p class="muted" style="line-height:1.7;font-size:14px">Semana boa, ${esc(store.get().business.first)}. Seu alcance subiu <b style="color:var(--ok)">${r.reachDelta}%</b> e você ganhou <b style="color:var(--ok)">${r.followersDelta} seguidores</b>. O carrossel “${esc(r.topPost.title)}” foi o destaque — conteúdo educativo continua sendo o que mais conecta com o seu público. Pra semana que vem, sugiro manter 3 posts educativos e 1 de captação com CTA de WhatsApp.</p>
      </div>`));
    },
  };
})();
