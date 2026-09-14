/* O que sei — a memória viva da IA. Você tem sempre a palavra final. */
(function () {
  const { h, esc, icon, toast, confirm } = App.ui;
  const store = App.store;

  App.views['o-que-sei'] = {
    title: 'O que sei',
    render(root) {
      root.appendChild(h(`<div class="page-head">
        <div class="row between wrap gap-3">
          <div>
            <div class="page-eyebrow">Ajustes · O que sei</div>
            <h1 class="page-title">O que ela <span class="serif-it">aprendeu</span></h1>
            <p class="page-sub">O que a IA foi entendendo com o tempo. Corrija o que ficou torto, silencie ou apague o que não quer que ela use.</p>
          </div>
          <button class="btn primary" id="add-k">${icon('plus')} Ensinar algo</button>
        </div>
      </div>`));

      const host = h('<div class="card"></div>');
      root.appendChild(host);
      draw();
      root.querySelector('#add-k').addEventListener('click', () => {
        App.ui.ask({ title: 'Ensinar a IA', label: 'O que ela precisa saber?', placeholder: 'ex: nunca usar a palavra "barato"', multiline: true, okLabel: 'Salvar', onOk(v) { if (!v) return; store.update((st) => st.knowledge.unshift({ id: store.uid(), text: v, source: 'Você ensinou', muted: false })); draw(); toast('Aprendido', { sub: 'A IA já vai considerar isso.' }); } });
      });

      function draw() {
        host.innerHTML = '';
        const ks = store.get().knowledge;
        if (!ks.length) { host.appendChild(h(`<div class="empty">${icon('brain')}<div class="t">Ainda não aprendi nada. Ensine algo.</div></div>`)); return; }
        ks.forEach((k) => {
          const row = h(`<div class="list-row" style="align-items:flex-start;${k.muted ? 'opacity:.5' : ''}">
            <span class="list-ic" style="background:${k.muted ? 'var(--surface-2)' : 'var(--brand-soft)'};color:${k.muted ? 'var(--ink-3)' : 'var(--brand-2)'}">${icon(k.muted ? 'volumeX' : 'brain')}</span>
            <div class="grow">
              <div style="font-size:14px;line-height:1.5;${k.muted ? 'text-decoration:line-through' : ''}">${esc(k.text)}</div>
              <div class="faint" style="font-size:11.5px;margin-top:4px">${icon('hash')} ${esc(k.source)}${k.muted ? ' · silenciado' : ''}</div>
            </div>
            <div class="row gap-1">
              <button class="btn ghost sm icon" data-edit title="Corrigir">${icon('edit')}</button>
              <button class="btn ghost sm icon" data-mute title="${k.muted ? 'Reativar' : 'Silenciar'}">${icon(k.muted ? 'eye' : 'eyeOff')}</button>
              <button class="btn ghost sm icon" data-del title="Apagar">${icon('trash')}</button>
            </div>
          </div>`);
          row.querySelector('[data-edit]').addEventListener('click', () => App.ui.ask({ title: 'Corrigir', label: 'Como é de verdade?', value: k.text, multiline: true, okLabel: 'Corrigir', onOk(v) { if (!v) return; store.update((st) => { st.knowledge.find((x) => x.id === k.id).text = v; }); draw(); toast('Corrigido'); } }));
          row.querySelector('[data-mute]').addEventListener('click', () => { store.update((st) => { const kk = st.knowledge.find((x) => x.id === k.id); kk.muted = !kk.muted; }); draw(); toast(k.muted ? 'Reativado' : 'Silenciado', { kind: 'info' }); });
          row.querySelector('[data-del]').addEventListener('click', () => confirm({ title: 'Apagar', message: 'Remover isso da memória da IA?', okLabel: 'Apagar', danger: true, onOk() { store.update((st) => st.knowledge = st.knowledge.filter((x) => x.id !== k.id)); draw(); toast('Apagado', { kind: 'warn' }); } }));
          host.appendChild(row);
        });
      }
    },
  };
})();
