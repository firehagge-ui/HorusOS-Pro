/* Configurações — conecta contas e decide até onde a IA vai sozinha. */
(function () {
  const { h, esc, icon, toast, confirm } = App.ui;
  const store = App.store;

  App.views['configuracoes'] = {
    title: 'Configurações',
    render(root) {
      root.appendChild(h(`<div class="page-head">
        <div class="page-eyebrow">Ajustes · Configurações</div>
        <h1 class="page-title">O painel de <span class="serif-it">controle</span></h1>
        <p class="page-sub">Conecte suas contas e decida até onde a IA pode ir sozinha. Tudo começa no modo mais seguro — você solta o freio quando quiser.</p>
      </div>`));

      const grid = h('<div class="grid" style="grid-template-columns:1.3fr 1fr;align-items:start"></div>');
      const left = h('<div class="col gap-4"></div>');
      const right = h('<div class="col gap-4"></div>');
      grid.append(left, right); root.appendChild(grid);

      // connections
      const conns = [
        ['instagram', 'instagram', 'Instagram', 'Publicar posts e ler o relatório da semana.'],
        ['facebook', 'facebook', 'Facebook', 'Publicar junto com o Instagram.'],
        ['google', 'google', 'Google', 'Campanhas, avaliações e Business Profile.'],
      ];
      const connCard = h(`<div class="card"><div class="card-h"><h3>${icon('link')} Contas conectadas</h3></div><div id="conns"></div><div class="tip mt-4">${icon('lock')}<div>As chaves ficam só no seu servidor privado. Nada sai de lá sem você pedir.</div></div></div>`);
      left.appendChild(connCard);
      drawConns();

      function drawConns() {
        const host = connCard.querySelector('#conns'); host.innerHTML = '';
        conns.forEach(([key, ic, name, desc]) => {
          const on = store.get().connections[key];
          const row = h(`<div class="list-row">
            <span class="list-ic" style="background:${on ? 'var(--ok-soft)' : 'var(--surface-2)'};color:${on ? 'var(--ok)' : 'var(--ink-2)'}">${icon(ic)}</span>
            <div class="grow"><div style="font-weight:600;font-size:14px">${name} ${on ? '<span class="badge ok" style="margin-left:6px">conectado</span>' : ''}</div><div class="faint" style="font-size:12px">${desc}</div></div>
            <button class="btn ${on ? 'ghost' : 'primary'} sm" data-k="${key}">${on ? 'Desconectar' : 'Conectar'}</button>
          </div>`);
          row.querySelector('[data-k]').addEventListener('click', () => {
            const next = !on;
            store.update((st) => st.connections[key] = next);
            drawConns();
            toast(name + (next ? ' conectado' : ' desconectado'), { kind: next ? 'ok' : 'warn', sub: next ? 'Agora a IA pode agir por aqui — no modo que você escolher.' : '' });
          });
          host.appendChild(row);
        });
      }

      // autonomy
      const auto = store.get().autonomy;
      const autoCard = h(`<div class="card">
        <div class="card-h"><h3>${icon('shield')} Nível de autonomia</h3></div>
        <p class="muted" style="font-size:13px;line-height:1.55">Escolha se a IA publica sozinha ou sempre pede o seu ok antes.</p>
        <div class="col gap-2 mt-3" id="auto-opts"></div>
      </div>`);
      left.appendChild(autoCard);
      drawAuto();
      function drawAuto() {
        const host = autoCard.querySelector('#auto-opts'); host.innerHTML = '';
        [['manual', 'shield', 'Sempre pergunta', 'Nada vai ao ar sem o seu ok. O modo mais seguro pra começar.'], ['auto', 'zap', 'Automático', 'A IA publica sozinha no horário certo. Solte o freio quando estiver à vontade.']].forEach(([val, ic, t, d]) => {
          const on = store.get().autonomy === val;
          const row = h(`<button class="card tight hover" style="text-align:left;border-color:${on ? 'var(--brand)' : 'var(--line)'};${on ? 'box-shadow:0 0 0 1px var(--brand)' : ''}">
            <div class="row gap-3"><span class="list-ic" style="background:${on ? 'var(--brand-soft)' : 'var(--surface-2)'};color:${on ? 'var(--brand-2)' : 'var(--ink-2)'}">${icon(ic)}</span><div class="grow"><div style="font-weight:600;font-size:14px">${t} ${on ? '<span class="badge brand" style="margin-left:6px">ativo</span>' : ''}</div><div class="faint" style="font-size:12px">${d}</div></div>${on ? icon('check') : ''}</div>
          </button>`);
          row.addEventListener('click', () => { store.set({ autonomy: val }); drawAuto(); toast(t + ' ativado', { kind: 'info', icon: ic }); });
          host.appendChild(row);
        });
      }

      // spend cap
      const cap = store.get().spendCap;
      const capCard = h(`<div class="card">
        <div class="card-h"><h3>${icon('wallet')} Teto de gasto</h3><a class="link" data-go="custo-api">Ver custo ${icon('arrowR')}</a></div>
        <p class="muted" style="font-size:13px">Um limite de quanto a IA pode gastar por mês, em dólar.</p>
        <div class="row gap-3 mt-3" style="align-items:flex-end">
          <div class="field grow"><label>Limite mensal (US$)</label><input class="input mono" type="number" id="cap" value="${cap}" min="0" step="5"></div>
          <button class="btn primary" id="save-cap">Salvar</button>
        </div>
        <div class="mt-4"><div class="row between" style="font-size:12px;color:var(--ink-2)"><span>Gasto até agora</span><span class="mono">US$ ${store.get().cost.month.toFixed(2)} / ${cap}</span></div><div class="meter ${pct() > 80 ? 'danger' : pct() > 50 ? 'warn' : 'ok'} mt-2"><i style="width:${Math.min(100, pct())}%"></i></div></div>
      </div>`);
      right.appendChild(capCard);
      capCard.querySelector('#save-cap').addEventListener('click', () => { const v = +capCard.querySelector('#cap').value || 0; store.set({ spendCap: v }); toast('Teto salvo: US$ ' + v + '/mês'); App.router.render(); });
      capCard.querySelector('[data-go]').addEventListener('click', () => App.router.go('custo-api'));
      function pct() { return (store.get().cost.month / (store.get().spendCap || 1)) * 100; }

      // health
      const h1 = store.get().health;
      const healthCard = h(`<div class="card">
        <div class="card-h"><h3>${icon('activity')} Saúde do sistema</h3></div>
        <div id="health"></div>
      </div>`);
      right.appendChild(healthCard);
      const hh = healthCard.querySelector('#health');
      [['Servidor privado', h1.server, 'no ar'], ['Modelo de IA', h1.model, 'respondendo'], ['Backup automático', h1.backup, 'último há 2 h']].forEach(([t, st, d]) => {
        hh.appendChild(h(`<div class="list-row"><span class="list-ic" style="background:var(--ok-soft);color:var(--ok)">${icon('check')}</span><div class="grow"><div style="font-weight:500;font-size:14px">${t}</div><div class="faint" style="font-size:12px">${d}</div></div><span class="badge ok"><span class="dot" style="background:var(--ok);animation:pulse-dot 2s infinite"></span>ok</span></div>`));
      });

      // danger zone
      const danger = h(`<div class="card" style="border-color:color-mix(in srgb,var(--danger) 30%,transparent)">
        <div class="card-h"><h3>Dados do painel</h3></div>
        <p class="muted" style="font-size:13px;line-height:1.5">Quer voltar tudo pro exemplo de demonstração? Isso apaga o que você mudou neste navegador.</p>
        <button class="btn danger sm mt-3" id="reset">${icon('refresh')} Restaurar demonstração</button>
      </div>`);
      right.appendChild(danger);
      danger.querySelector('#reset').addEventListener('click', () => confirm({ title: 'Restaurar demonstração', message: 'Isso apaga suas mudanças locais e volta ao exemplo. Continuar?', okLabel: 'Restaurar', danger: true, onOk() { store.reset(); App.applyBrand(); App.shell.refreshSidebar(); App.shell.refreshTopbar(); App.router.render(); toast('Demonstração restaurada', { kind: 'info' }); } }));

      root.addEventListener('click', (e) => { const g = e.target.closest('[data-go]'); if (g && g.dataset.go) App.router.go(g.dataset.go); });
    },
  };
})();
