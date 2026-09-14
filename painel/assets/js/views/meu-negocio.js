/* Meu negócio — as três fichas que a IA lê antes de cada resposta. */
(function () {
  const { h, esc, icon, toast } = App.ui;
  const store = App.store;

  const CARDS = [
    { key: 'quem', ic: 'briefcase', t: 'Quem é o seu negócio', q: 'O que você faz e pra quem.' },
    { key: 'jeito', ic: 'chat', t: 'O seu jeito de falar', q: 'O tom que a IA deve usar.' },
    { key: 'onde', ic: 'target', t: 'Onde você quer chegar', q: 'A prioridade do momento.' },
  ];

  App.views['meu-negocio'] = {
    title: 'Meu negócio',
    render(root) {
      root.appendChild(h(`<div class="page-head">
        <div class="page-eyebrow">Ajustes · Meu negócio</div>
        <h1 class="page-title">O que a IA <span class="serif-it">sabe de você</span></h1>
        <p class="page-sub">As três fichas que a IA lê antes de cada resposta pra soar como você. Quanto mais certo aqui, melhor tudo que sai.</p>
      </div>`));

      // identity mini-form
      const b = store.get().business;
      const idCard = h(`<div class="card" style="margin-bottom:18px">
        <div class="card-h"><h3>${icon('sliders')} Dados da clínica</h3></div>
        <div class="grid g2">
          ${fieldRow('Nome que aparece', 'ownerName', b.ownerName)}
          ${fieldRow('Nome da clínica', 'clinicName', b.clinicName)}
          ${fieldRow('Cidade', 'city', b.city)}
          ${fieldRow('Especialidade', 'specialty', b.specialty)}
          ${fieldRow('WhatsApp', 'whatsapp', b.whatsapp)}
          ${fieldRow('Instagram', 'instagram', b.instagram)}
        </div>
        <div class="row mt-4"><button class="btn primary" id="save-id">Salvar dados</button></div>
      </div>`);
      root.appendChild(idCard);
      idCard.querySelector('#save-id').addEventListener('click', () => {
        store.update((st) => { CARDS && idCard.querySelectorAll('[data-f]').forEach((i) => { st.business[i.dataset.f] = i.value.trim(); }); st.business.first = st.business.ownerName.replace(/^Dr[a]?\.?\s*/i, '').split(' ')[0]; st.brand.logoText = st.business.ownerName; });
        App.shell.refreshSidebar(); App.shell.refreshTopbar();
        toast('Dados salvos', { sub: 'A IA já vai usar em tudo que criar.' });
      });

      const g = h('<div class="grid g3"></div>');
      CARDS.forEach((c) => {
        const val = store.get().profile[c.key];
        const card = h(`<div class="card mn-card">
          <div class="mn-ic">${icon(c.ic)}</div>
          <h3>${esc(c.t)}</h3>
          <div class="mn-q">${esc(c.q)}</div>
          <div class="mn-txt" data-txt>${esc(val)}</div>
          <div class="row mt-4"><button class="btn ghost sm" data-edit>${icon('edit')} Editar</button></div>
        </div>`);
        card.querySelector('[data-edit]').addEventListener('click', () => {
          App.ui.ask({ title: c.t, label: c.q, value: store.get().profile[c.key], multiline: true, okLabel: 'Salvar', onOk(v) {
            store.update((st) => st.profile[c.key] = v);
            card.querySelector('[data-txt]').textContent = v;
            toast('Atualizado', { sub: 'Essa ficha alimenta cada resposta da IA.' });
          }});
        });
        g.appendChild(card);
      });
      root.appendChild(g);

      root.appendChild(h(`<div class="tip mt-4">${icon('info')}<div>Você edita respondendo perguntas, sem código. Também dá pra ver e corrigir o que a IA já aprendeu em <a href="#/o-que-sei">O que sei</a>.</div></div>`));
    },
  };

  function fieldRow(label, field, value) {
    return `<div class="field"><label>${esc(label)}</label><input class="input" data-f="${field}" value="${esc(value)}"></div>`;
  }
})();
