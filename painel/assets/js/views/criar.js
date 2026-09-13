/* Criar — o cardápio: tudo que a IA sabe criar. Cada ação cria de verdade. */
(function () {
  const { h, esc, icon, modal, toast, slideArt } = App.ui;
  const store = App.store;

  const SECTIONS = [
    { label: 'Conteúdo', items: [
      { id: 'carrossel', ic: 'images', t: 'Criar carrossel', d: 'Um post de vários slides pro Instagram, já com a cara da sua marca e legenda pronta.', ex: 'ex: 5 erros que afastam paciente da sua clínica', type: 'carrossel' },
      { id: 'post', ic: 'image', t: 'Post único', d: 'Uma arte só, direta, pra um anúncio ou recado rápido.', ex: 'ex: aviso de horário nos feriados', type: 'post' },
      { id: 'tema', ic: 'layers', t: 'Publicar um tema', d: 'Você dá o assunto, eu entrego o texto do blog, o carrossel e as legendas, tudo amarrado.', ex: 'ex: clareamento dental vale a pena?', type: 'tema' },
    ]},
    { label: 'Escrita', items: [
      { id: 'email', ic: 'mail', t: 'Escrever email', d: 'Um email no seu tom de voz, pronto pra revisar e enviar.', ex: 'ex: retorno de 6 meses pros pacientes', type: 'email' },
      { id: 'avaliacoes', ic: 'star', t: 'Responder avaliações', d: 'Respostas educadas e no seu tom pras avaliações novas do Google.', ex: 'ex: agradecer uma avaliação 5 estrelas', type: 'email' },
    ]},
    { label: 'Campanhas e site', items: [
      { id: 'anuncio', ic: 'megaphone', t: 'Anúncio no Google', d: 'Quem digita “implante em ' + store.get().business.city + '” encontra você no topo. Monto a campanha inteira.', ex: 'ex: aparelho invisível em ' + store.get().business.city, type: 'anuncio' },
      { id: 'relatorio', ic: 'barchart', t: 'Relatório de anúncios', d: 'Toda semana, em português claro: quanto gastou, quantos contatos chegaram e o que valeu.', ex: 'abre o seu relatório da semana', type: 'nav', to: 'relatorio' },
      { id: 'seo', ic: 'globe', t: 'Aparecer sem pagar', d: 'Um plano pra subir nas buscas orgânicas do Google e até no ChatGPT.', ex: 'ex: plano de SEO local pra 90 dias', type: 'plan' },
      { id: 'landing', ic: 'target', t: 'Página que converte', d: 'Uma landing com botão de WhatsApp e “agendar avaliação” pra virar clique em paciente.', ex: 'abre a sua landing page', type: 'nav', to: 'landing' },
    ]},
  ];

  App.views['criar'] = {
    title: 'Criar',
    render(root) {
      root.appendChild(h(`<div class="page-head">
        <div class="page-eyebrow">Todo dia · Criar</div>
        <h1 class="page-title">Tudo que ela <span class="serif-it">sabe fazer</span></h1>
        <p class="page-sub">Escolha uma ação. Você sempre vê uma prévia antes de qualquer coisa ir pra frente.</p>
      </div>`));

      // ★ FOCO ESPECIAL · Campanhas
      root.appendChild(h(`<div class="section-label" style="margin-top:6px">★ Foco especial · Campanhas — fazer o telefone tocar</div>`));
      const campo = h('<div class="grid g2"></div>');
      const campoCards = [
        ['search', 'var(--brand)', 'Anúncio no Google', 'Quem já procura por implante, aparelho ou prótese na sua região encontra você no topo. Monto títulos, palavras e descrições, pronto pra subir.', () => openFlow(findAction('anuncio'))],
        ['globe', 'var(--info)', 'Aparecer sem pagar', 'Um plano pra subir nas buscas orgânicas e até aparecer quando alguém pergunta pro ChatGPT por um bom dentista na região.', () => openFlow(findAction('seo'))],
        ['barchart', 'var(--ok)', 'Relatório dos anúncios', 'Toda semana, em português claro: quanto gastou, quantos contatos chegaram e o que realmente valeu a pena.', () => App.router.go('relatorio')],
        ['whatsapp', 'var(--violet)', 'Página que converte', 'Uma landing com botão de WhatsApp e “agendar avaliação” pra transformar o clique em paciente sentado na cadeira.', () => App.router.go('landing')],
      ];
      campoCards.forEach(([ic, col, t, d, fn]) => {
        const c = h(`<div class="card hover campo-card"><div class="cc-h"><span class="cc-ic" style="background:color-mix(in srgb,${col} 16%, transparent);color:${col}">${icon(ic)}</span><h3>${t}</h3></div><p class="muted" style="font-size:13px;line-height:1.55">${esc(d)}</p></div>`);
        c.addEventListener('click', fn); campo.appendChild(c);
      });
      root.appendChild(campo);
      root.appendChild(h(`<div class="tip mt-4">${icon('lightbulb')}<div><b>O combo que funciona:</b> enquanto o post educa e cria autoridade, a campanha traz o paciente que já decidiu procurar. As duas coisas juntas é que fazem o telefone tocar.</div></div>`));

      // Cardápio completo
      SECTIONS.forEach((sec) => {
        root.appendChild(h(`<div class="section-label">${esc(sec.label)}</div>`));
        const g = h('<div class="grid g3"></div>');
        sec.items.forEach((it) => {
          const c = h(`<div class="card hover action-card">
            <div class="ac-ic">${icon(it.ic)}</div>
            <h3>${esc(it.t)}</h3>
            <p>${esc(it.d)}</p>
            <div class="ac-ex">${esc(it.ex)}</div>
          </div>`);
          c.addEventListener('click', () => { if (it.type === 'nav') App.router.go(it.to); else openFlow(it); });
          g.appendChild(c);
        });
        root.appendChild(g);
      });
    },
  };

  function findAction(id) { for (const s of SECTIONS) { const f = s.items.find((i) => i.id === id); if (f) return f; } }

  function openFlow(action) {
    const b = store.get().business;
    const body = h(`<div>
      <div class="row gap-3" style="margin-bottom:14px">
        <div class="ac-ic" style="margin:0">${icon(action.ic)}</div>
        <div><div style="font-weight:600">${esc(action.t)}</div><div class="faint" style="font-size:12.5px">${esc(action.d)}</div></div>
      </div>
      <div class="field"><label>Sobre o que é?</label><input class="input" id="fl-topic" placeholder="${esc(action.ex.replace(/^ex:\s*/, ''))}"></div>
      <div class="field mt-3"><label>Algum detalhe? (opcional)</label><textarea class="textarea" id="fl-note" placeholder="Ex: focar em quem tem medo de dentista, tom mais leve…" style="min-height:70px"></textarea></div>
      <div class="tip mt-4">${icon('shield')}<div>Nada vai ao ar sozinho. Vou criar um rascunho e colocar em <b>“Pra revisar”</b> pro seu ok.</div></div>
    </div>`);
    const foot = h('<div class="row gap-3"></div>');
    const cancel = h('<button class="btn ghost">Cancelar</button>');
    const go = h(`<button class="btn primary">${icon('wand')} Gerar prévia</button>`);
    foot.append(cancel, go);
    const m = modal({ title: 'Criar', body, footer: foot });
    cancel.addEventListener('click', m.close);
    go.addEventListener('click', () => {
      const topic = (body.querySelector('#fl-topic').value || '').trim() || action.ex.replace(/^ex:\s*/, '');
      m.close();
      if (action.type === 'plan') { generatePlan(topic); return; }
      const title = action.type === 'anuncio' ? 'Anúncio: ' + cap(topic) : cap(topic);
      const art = (action.type === 'carrossel' || action.type === 'post' || action.type === 'tema')
        ? { kicker: b.specialty.split(',')[0], title: cap(topic), accent: store.get().brand.accent } : null;
      const it = store.addContent({ title, type: action.type === 'tema' ? 'tema' : action.type, stage: 'revisar', caption: captionFor(action.type, topic), slides: action.type === 'carrossel' ? 5 : action.type === 'tema' ? 6 : 1, art });
      store.logActivity('done', labelFor(action.type) + ' criado: "' + it.title + '"');
      previewModal(it);
    });
  }

  function generatePlan(topic) {
    const b = store.get().business;
    const body = h(`<div>
      <p class="muted" style="line-height:1.6">Plano de 90 dias pra ${esc(b.clinicName)} aparecer sem pagar em <b>${esc(b.city)}</b>:</p>
      <div class="mt-3">
        ${planStep('Mês 1 · Base', 'Otimizar o Google Business Profile, padronizar NAP (nome, endereço, telefone) e pedir avaliações aos pacientes satisfeitos.')}
        ${planStep('Mês 2 · Conteúdo', 'Publicar 8 artigos respondendo o que o paciente pergunta ("quanto custa um implante", "aparelho dói?"), com FAQ pro ChatGPT citar.')}
        ${planStep('Mês 3 · Autoridade', 'Backlinks locais, mais avaliações e página de cada serviço otimizada pra "implante em ' + b.city + '".')}
      </div>
    </div>`);
    const foot = h('<div class="row gap-3"></div>');
    const ok = h('<button class="btn primary">Salvar em Conteúdos</button>');
    foot.appendChild(ok);
    const m = modal({ title: 'Aparecer sem pagar · plano', body, footer: foot });
    ok.addEventListener('click', () => { const it = store.addContent({ title: 'Plano de SEO local · 90 dias', type: 'tema', stage: 'ideias', caption: 'Plano de presença orgânica em ' + b.city + '.' }); store.logActivity('done', 'Plano de SEO local criado'); m.close(); toast('Plano salvo em Conteúdos (Ideias)'); });
  }
  function planStep(t, d) { return `<div class="guia-step"><div class="guia-n">${icon('check')}</div><div><div style="font-weight:600;font-size:14px">${esc(t)}</div><div class="muted" style="font-size:13px;margin-top:3px;line-height:1.5">${esc(d)}</div></div></div>`; }

  function previewModal(it) {
    const body = h(`<div>
      ${App.ui.typeBadge(it.type)}
      <h2 style="margin-top:10px">${esc(it.title)}</h2>
      <p class="muted mt-2" style="line-height:1.55">${esc(it.caption)}</p>
      ${it.art ? `<div class="detail-slides mt-4">${slidesFor(it)}</div>` : `<div class="card tight mt-4" style="line-height:1.6;font-size:13.5px;color:var(--ink-2)">${sampleText(it)}</div>`}
    </div>`);
    const foot = h('<div class="row gap-3"></div>');
    const view = h('<button class="btn ghost">Ver em Conteúdos</button>');
    const ap = h(`<button class="btn ok">${icon('check')} Aprovar e agendar</button>`);
    foot.append(view, ap);
    const m = modal({ title: 'Prévia', body, footer: foot, wide: true });
    view.addEventListener('click', () => { m.close(); App.router.go('conteudos'); });
    ap.addEventListener('click', () => { store.moveContent(it.id, 'agendado'); store.logActivity('done', 'Agendado: "' + it.title + '"'); m.close(); toast('Aprovado e agendado!', { sub: 'Vai ao ar no melhor horário.', icon: 'check' }); });
  }

  function slidesFor(it) {
    const n = Math.min(it.slides || 3, 5);
    let out = '';
    for (let i = 0; i < n; i++) {
      const first = i === 0;
      out += `<div class="detail-slide" style="background:linear-gradient(155deg, ${it.art.accent}, color-mix(in srgb,${it.art.accent} 55%, #05070d))">
        <div style="font-size:8px;letter-spacing:.12em;text-transform:uppercase;opacity:.8">${first ? esc(it.art.kicker) : 'Slide ' + (i + 1)}</div>
        <div style="margin-top:auto;font-family:var(--font-display);font-weight:700;font-size:${first ? 15 : 12}px;line-height:1.1">${first ? it.art.title : slideLine(i)}</div>
      </div>`;
    }
    return out;
  }
  function slideLine(i) { return ['O problema real', 'Como a gente resolve', 'O passo a passo', 'Agende sua avaliação'][i - 1] || 'Conteúdo'; }
  function sampleText(it) {
    if (it.type === 'email') return 'Assunto: Já faz um tempo… que tal cuidar do seu sorriso?<br><br>Oi! Passando pra lembrar com carinho que já faz 6 meses desde a sua última visita. Um checkup rápido evita dor de cabeça (e de dente) lá na frente. Quer que a gente separe um horário pra você? É só responder aqui.';
    if (it.type === 'anuncio') return '<b>Título 1:</b> Implante Dentário em ' + store.get().business.city + '<br><b>Título 2:</b> Avaliação com Planejamento Digital<br><b>Descrição:</b> Recupere seu sorriso com segurança. Agende sua avaliação pelo WhatsApp. Atendimento humano e explicação clara de cada etapa.';
    return 'Rascunho pronto pra revisar.';
  }
  function captionFor(type, topic) {
    return { carrossel: 'Carrossel de 5 slides sobre ' + topic + ', no tom da clínica.', post: 'Post único sobre ' + topic + '.', tema: 'Tema completo: blog + carrossel + legendas sobre ' + topic + '.', email: 'Email no seu tom sobre ' + topic + '.', anuncio: 'Campanha de busca no Google mirando ' + store.get().business.city + '.' }[type] || 'Rascunho pronto pra revisar.';
  }
  function labelFor(type) { return { carrossel: 'Carrossel', post: 'Post', tema: 'Tema', email: 'Email', anuncio: 'Anúncio' }[type] || 'Conteúdo'; }
  function cap(s) { s = String(s || '').trim(); return s.charAt(0).toUpperCase() + s.slice(1); }
})();
