/* Marca — cores, fontes e logo. Mexeu aqui, o painel inteiro se adapta na hora. */
(function () {
  const { h, esc, icon, toast } = App.ui;
  const store = App.store;

  const PRESETS = [
    { name: 'Azul clínico', a: '#2563EB', b: '#60A5FA' },
    { name: 'Azul-petróleo', a: '#0e7490', b: '#22d3ee' },
    { name: 'Verde saúde', a: '#059669', b: '#34d399' },
    { name: 'Índigo', a: '#4f46e5', b: '#818cf8' },
    { name: 'Grafite', a: '#334155', b: '#94a3b8' },
    { name: 'Vinho', a: '#9d174d', b: '#f472b6' },
  ];
  const FONTS = ['Sora', 'Hanken Grotesk', 'Newsreader', 'JetBrains Mono'];

  App.views['marca'] = {
    title: 'Marca',
    render(root) {
      const brand = store.get().brand;
      root.appendChild(h(`<div class="page-head">
        <div class="page-eyebrow">Ajustes · Marca</div>
        <h1 class="page-title">A cara do seu <span class="serif-it">negócio</span></h1>
        <p class="page-sub">Cores, fontes e logo. É o que garante que tudo que sai — post, email, site — carregue a sua identidade.</p>
      </div>`));

      const grid = h('<div class="grid" style="grid-template-columns:1.4fr 1fr;align-items:start"></div>');

      // left: editor
      const editor = h(`<div class="col gap-4"></div>`);

      // color
      const colorCard = h(`<div class="card">
        <div class="card-h"><h3>${icon('palette')} Cores da marca</h3></div>
        <div class="row gap-4 wrap">
          <div class="field"><label>Cor principal</label><div class="row gap-2"><input type="color" class="color-input" id="c-a" value="${brand.accent}"><input class="input mono" id="h-a" value="${brand.accent}" style="width:120px"></div></div>
          <div class="field"><label>Cor de apoio</label><div class="row gap-2"><input type="color" class="color-input" id="c-b" value="${brand.accent2}"><input class="input mono" id="h-b" value="${brand.accent2}" style="width:120px"></div></div>
        </div>
        <div class="section-label" style="margin:18px 0 10px">Paletas prontas</div>
        <div class="row gap-2 wrap" id="presets"></div>
      </div>`);
      editor.appendChild(colorCard);

      // fonts
      const fontCard = h(`<div class="card">
        <div class="card-h"><h3>${icon('hash')} Fontes</h3></div>
        <div class="grid g2">
          <div class="field"><label>Título (display)</label><select class="select" id="f-d">${FONTS.map((f) => `<option ${f === brand.display ? 'selected' : ''}>${f}</option>`).join('')}</select></div>
          <div class="field"><label>Texto (corpo)</label><select class="select" id="f-b">${FONTS.map((f) => `<option ${f === brand.body ? 'selected' : ''}>${f}</option>`).join('')}</select></div>
        </div>
      </div>`);
      editor.appendChild(fontCard);

      // logo
      const logoCard = h(`<div class="card">
        <div class="card-h"><h3>${icon('image')} Logo</h3></div>
        <div class="row between gap-3 wrap">
          <div class="row gap-3"><div class="logo-badge" style="width:44px;height:44px;border-radius:12px">${icon('tooth')}</div><div><div style="font-weight:600" data-logo>${esc(brand.logoText)}</div><div class="faint" style="font-size:12px">logo atual (símbolo + nome)</div></div></div>
          <button class="btn" id="up-logo">${icon('upload')} Trocar logo</button>
        </div>
      </div>`);
      editor.appendChild(logoCard);

      grid.appendChild(editor);

      // right: live preview
      const preview = h(`<div class="card" style="position:sticky;top:12px">
        <div class="card-h"><h3>${icon('eye')} Prévia ao vivo</h3></div>
        <div class="col gap-3" id="mk-prev"></div>
      </div>`);
      grid.appendChild(preview);
      root.appendChild(grid);
      drawPreview(preview.querySelector('#mk-prev'));

      // presets
      const pr = colorCard.querySelector('#presets');
      PRESETS.forEach((p) => { const sw = h(`<button class="swatch" style="width:64px;aspect-ratio:1;background:linear-gradient(135deg,${p.a},${p.b})" title="${p.name}"></button>`); sw.addEventListener('click', () => { setColors(p.a, p.b); }); pr.appendChild(sw); });

      // wire color inputs
      const ca = colorCard.querySelector('#c-a'), ha = colorCard.querySelector('#h-a');
      const cb = colorCard.querySelector('#c-b'), hb = colorCard.querySelector('#h-b');
      ca.addEventListener('input', () => { ha.value = ca.value; setColors(ca.value, cb.value); });
      cb.addEventListener('input', () => { hb.value = cb.value; setColors(ca.value, cb.value); });
      ha.addEventListener('change', () => { if (/^#[0-9a-f]{6}$/i.test(ha.value)) { ca.value = ha.value; setColors(ha.value, cb.value); } });
      hb.addEventListener('change', () => { if (/^#[0-9a-f]{6}$/i.test(hb.value)) { cb.value = hb.value; setColors(ca.value, hb.value); } });

      function setColors(a, b) {
        ca.value = a; ha.value = a; cb.value = b; hb.value = b;
        store.setBrand({ accent: a, accent2: b });
        drawPreview(preview.querySelector('#mk-prev'));
        toast('Marca aplicada ao painel inteiro', { icon: 'palette' });
      }

      fontCard.querySelector('#f-d').addEventListener('change', (e) => { store.setBrand({ display: e.target.value }); toast('Fonte de título atualizada'); });
      fontCard.querySelector('#f-b').addEventListener('change', (e) => { store.setBrand({ body: e.target.value }); toast('Fonte de corpo atualizada'); });
      logoCard.querySelector('#up-logo').addEventListener('click', () => App.ui.ask({ title: 'Nome da logo', label: 'Texto que aparece ao lado do símbolo', value: brand.logoText, onOk(v) { if (!v) return; store.setBrand({ logoText: v }); logoCard.querySelector('[data-logo]').textContent = v; toast('Logo atualizada'); } }));

      function drawPreview(host) {
        const s = store.get(); const bd = s.brand;
        host.innerHTML = '';
        host.appendChild(h(`<div class="card tight" style="background:var(--surface-2)">
          <div class="row gap-2 mb-2"><span class="badge brand">Botão</span></div>
          <button class="btn primary block">${esc(s.landing ? s.landing.btnText : 'Agendar avaliação')}</button>
          <div class="mt-3" style="font-family:${bd.display},sans-serif;font-weight:600;font-size:20px;letter-spacing:-.02em">Título de exemplo</div>
          <div style="font-family:${bd.body},sans-serif;color:var(--ink-2);font-size:13px;margin-top:4px">Texto de corpo, do jeito que aparece nas suas peças.</div>
          <div class="detail-slide mt-3" style="width:130px;aspect-ratio:4/5;background:linear-gradient(155deg, ${bd.accent}, color-mix(in srgb,${bd.accent} 55%, #05070d))"><div style="font-size:8px;letter-spacing:.12em;text-transform:uppercase;opacity:.8">Carrossel</div><div style="margin-top:auto;font-family:${bd.display};font-weight:700;font-size:14px;line-height:1.1">Post com a sua cor</div></div>
        </div>`));
      }
    },
  };
})();
