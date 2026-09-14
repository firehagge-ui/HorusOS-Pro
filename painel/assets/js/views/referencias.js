/* Referências — o mural de inspiração que a IA olha na hora de criar. */
(function () {
  const { h, esc, icon, modal, toast, confirm } = App.ui;
  const store = App.store;
  const TAGS = ['Layout', 'Cor', 'Tipografia', 'Composição', 'Fotografia', 'Formato', 'Conversão'];
  const COLORS = ['#2563EB', '#1e3a8a', '#0e7490', '#155e75', '#4338ca', '#1d4ed8', '#0f766e'];

  App.views['referencias'] = {
    title: 'Referências',
    render(root) {
      root.appendChild(h(`<div class="page-head">
        <div class="row between wrap gap-3">
          <div>
            <div class="page-eyebrow">Ajustes · Referências</div>
            <h1 class="page-title">O que <span class="serif-it">inspira</span> você</h1>
            <p class="page-sub">Guarde imagens, links e ideias que você curtiu. Quanto mais você alimenta, mais o resultado sai com a sua cara.</p>
          </div>
          <button class="btn primary" id="add-ref">${icon('plus')} Adicionar</button>
        </div>
      </div>`));

      const host = h('<div></div>');
      root.appendChild(host);
      draw();

      root.querySelector('#add-ref').addEventListener('click', addRef);

      function draw() {
        host.innerHTML = '';
        const refs = store.get().references;
        if (!refs.length) { host.appendChild(h(`<div class="card"><div class="empty">${icon('bookmark')}<div class="t">Mural vazio. Adicione a primeira inspiração.</div></div></div>`)); return; }
        const mural = h('<div class="mural"></div>');
        refs.forEach((r) => {
          const el = h(`<div class="ref">
            <div class="rimg" style="height:${120 + (r.text.length % 4) * 24}px;background:linear-gradient(155deg, ${r.color}, color-mix(in srgb,${r.color} 50%, #05070d))">${icon('images')}</div>
            <div class="rb"><div class="row between gap-2"><span class="badge">${esc(r.tag)}</span><button class="btn ghost sm icon" data-del="${r.id}" style="width:26px;height:26px">${icon('x')}</button></div><div class="rt mt-2">${esc(r.text)}</div></div>
          </div>`);
          el.querySelector('.rimg svg').style.cssText = 'width:26px;height:26px;color:rgba(255,255,255,.5)';
          el.querySelector('[data-del]').addEventListener('click', () => confirm({ title: 'Remover', message: 'Tirar essa referência do mural?', okLabel: 'Remover', danger: true, onOk() { store.update((st) => st.references = st.references.filter((x) => x.id !== r.id)); draw(); } }));
          mural.appendChild(el);
        });
        host.appendChild(mural);
      }

      function addRef() {
        const body = h(`<div>
          <div class="field"><label>O que te chamou atenção?</label><input class="input" id="rf-t" placeholder="ex: hero com muito respiro e um botão só"></div>
          <div class="field mt-3"><label>Categoria</label><select class="select" id="rf-tag">${TAGS.map((t) => `<option>${t}</option>`).join('')}</select></div>
          <div class="field mt-3"><label>Link (opcional)</label><div class="input-wrap">${icon('link')}<input class="input" id="rf-l" placeholder="cole um link do Instagram, Pinterest…"></div></div>
        </div>`);
        const foot = h('<div class="row gap-3"></div>');
        const ok = h('<button class="btn primary">Adicionar ao mural</button>');
        foot.appendChild(ok);
        const m = modal({ title: 'Nova referência', body, footer: foot });
        ok.addEventListener('click', () => {
          const t = body.querySelector('#rf-t').value.trim(); if (!t) { toast('Descreva a referência', { kind: 'warn' }); return; }
          store.update((st) => st.references.unshift({ id: store.uid(), text: t, tag: body.querySelector('#rf-tag').value, color: COLORS[Math.floor(Math.random() * COLORS.length)] }));
          m.close(); draw(); toast('Adicionado ao mural', { sub: 'A IA já vai usar como norte.' });
        });
      }
    },
  };
})();
