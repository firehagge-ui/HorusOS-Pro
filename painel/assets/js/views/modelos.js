/* Modelos — os moldes visuais que a IA segue, sempre com a sua marca. */
(function () {
  const { h, esc, icon, toast } = App.ui;
  const store = App.store;

  App.views['modelos'] = {
    title: 'Modelos',
    render(root) {
      const brand = store.get().brand;
      root.appendChild(h(`<div class="page-head">
        <div class="page-eyebrow">Ajustes · Modelos</div>
        <h1 class="page-title">O estilo dos seus <span class="serif-it">posts</span></h1>
        <p class="page-sub">Os moldes que a IA segue pra montar cada arte, sempre com a sua marca. Mudou aqui, todo post futuro já nasce diferente.</p>
      </div>`));

      root.appendChild(h(`<div class="tip mt-2" style="margin-bottom:18px">${icon('palette')}<div>Todos os modelos usam a cor da sua marca (<b class="mono">${esc(brand.accent)}</b>) e as fontes <b>${esc(brand.display)}</b> + <b>${esc(brand.body)}</b>. Troque a marca inteira em <a href="#/marca">Marca</a>.</div></div>`));

      const grid = h('<div class="tpl-grid"></div>');
      store.get().templates.forEach((t) => {
        const el = h(`<div class="tpl">
          <div class="tprev" style="background:linear-gradient(155deg, ${t.color}, color-mix(in srgb,${t.color} 52%, #05070d))">${preview(t)}</div>
          <div class="tb"><div style="font-size:13px;font-weight:600">${esc(t.name)}</div><button class="btn ghost sm" data-adj="${t.id}">${icon('edit')} Ajustar</button></div>
        </div>`);
        el.querySelector('[data-adj]').addEventListener('click', () => askAdjust(t));
        grid.appendChild(el);
      });
      root.appendChild(grid);
    },
  };

  function preview(t) {
    const b = store.get().business;
    switch (t.kind) {
      case 'capa': return `<div style="font-size:8px;letter-spacing:.12em;text-transform:uppercase;opacity:.85">${esc(b.specialty.split(',')[0])}</div><div style="margin-top:auto;font-family:var(--font-display);font-weight:700;font-size:22px;line-height:1.05;color:#fff">Aparelho tem<br><em style="font-family:var(--font-serif);font-weight:500">idade certa?</em></div><div style="font-size:9px;margin-top:10px;opacity:.8">arraste →</div>`;
      case 'mito': return `<div style="font-size:8px;letter-spacing:.12em;text-transform:uppercase;opacity:.85">Mito × Verdade</div><div style="margin-top:auto"><div style="background:rgba(0,0,0,.25);border-radius:8px;padding:8px;font-size:11px">❌ "Clareamento estraga o dente"</div><div style="background:rgba(255,255,255,.15);border-radius:8px;padding:8px;font-size:11px;margin-top:6px">✔ Feito por dentista, é seguro</div></div>`;
      case 'antesdepois': return `<div style="display:flex;gap:6px;height:60%;margin-top:4px"><div style="flex:1;background:rgba(0,0,0,.25);border-radius:8px;display:grid;place-items:center;font-size:9px">ANTES</div><div style="flex:1;background:rgba(255,255,255,.18);border-radius:8px;display:grid;place-items:center;font-size:9px">DEPOIS</div></div><div style="margin-top:auto;font-family:var(--font-display);font-weight:700;font-size:13px">Com autorização do paciente</div>`;
      case 'cta': return `<div style="margin:auto 0;font-family:var(--font-display);font-weight:700;font-size:20px;line-height:1.1">Agende sua<br>avaliação</div><div style="background:#fff;color:#05121f;border-radius:999px;padding:7px 12px;font-size:10px;font-weight:700;width:fit-content">WhatsApp →</div>`;
      case 'citacao': return `<div style="font-family:var(--font-serif);font-style:italic;font-size:16px;line-height:1.3;margin:auto 0">"Explico cada etapa antes de qualquer coisa."</div><div style="font-size:10px;opacity:.85">— ${esc(b.ownerName)}</div>`;
      default: return `<div style="font-size:8px;letter-spacing:.12em;text-transform:uppercase;opacity:.85">Conteúdo</div><div style="margin-top:auto;font-family:var(--font-display);font-weight:700;font-size:15px;line-height:1.15">Texto do slide com<br>ícone e destaque</div>`;
    }
  }

  function askAdjust(t) {
    App.ui.ask({ title: 'Ajustar “' + t.name + '”', label: 'Descreva o ajuste em português', placeholder: 'ex: deixa os títulos menores e o botão mais claro', multiline: true, okLabel: 'Aplicar', onOk(v) {
      if (!v) return;
      store.logActivity('done', 'Modelo ajustado: "' + t.name + '" — ' + v);
      toast('Ajuste aplicado', { sub: 'Vale pra todos os próximos conteúdos.', icon: 'check' });
    }});
  }
})();
