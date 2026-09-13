/* Guia do sistema — o passeio por cada tela, vivo dentro do painel. */
(function () {
  const { h, esc, icon } = App.ui;
  const store = App.store;

  const CYCLE = [
    ['chat', 'Você pede', 'Em português, do seu jeito. Ou o próprio sistema sugere o que fazer hoje.'],
    ['wand', 'A IA cria', 'Monta o carrossel, o texto, o email — já com a cara da sua marca.'],
    ['check', 'Você aprova', 'Confere a prévia e dá o sim. Nada vai ao ar sem o seu ok.'],
    ['zap', 'Vai ao ar', 'Publica sozinho no Instagram e no Facebook, no horário certo.'],
  ];
  const SCREENS = [
    ['inicio', 'home', 'Início', 'A mesa do dia: decisões prontas, com Aprovar num clique.'],
    ['conversar', 'chat', 'Conversar', 'Um chat com a sua assistente. Fale natural, como no WhatsApp.'],
    ['criar', 'wand', 'Criar', 'O cardápio: tudo que a IA sabe criar, por tipo.'],
    ['conteudos', 'columns', 'Conteúdos', 'O quadro dos seus posts, do rascunho ao ar.'],
    ['atividade', 'activity', 'Atividade', 'O diário: tudo que o sistema fez, com horário.'],
    ['relatorio', 'barchart', 'Relatório', 'A sua semana no Instagram, em números claros.'],
    ['agenda', 'calendar', 'Agenda', 'O mês inteiro, separado por cor.'],
    ['modelos', 'template', 'Modelos', 'Os moldes visuais que a IA segue, com a sua marca.'],
    ['referencias', 'bookmark', 'Referências', 'O mural de inspiração que a IA olha ao criar.'],
    ['landing', 'globe', 'Landing page', 'A sua página, mudada conversando.'],
    ['arquivos', 'folder', 'Arquivos', 'As pastas do seu negócio, tudo num lugar.'],
    ['meu-negocio', 'briefcase', 'Meu negócio', 'As fichas que a IA lê pra soar como você.'],
    ['o-que-sei', 'brain', 'O que sei', 'O que a IA aprendeu — e como corrigir.'],
    ['marca', 'palette', 'Marca', 'Cores, fontes e logo. Mexeu, tudo se adapta.'],
    ['configuracoes', 'settings', 'Configurações', 'Conexões, autonomia e teto de gasto.'],
    ['custo-api', 'dollar', 'Custo de API', 'Quanto a IA custou no mês. Sem surpresa.'],
  ];
  const IDEAS = [
    ['zap', 'Atrair paciente novo', ['Carrossel: "5 sinais de que você já precisa de um implante"', 'Anúncio no Google pra "aparelho invisível em ' + store.get().business.city + '"', 'Post: "perdeu um dente? veja suas opções hoje"']],
    ['grad', 'Virar autoridade', ['Série de 5 posts: mitos e verdades sobre clareamento', 'Post: como é o passo a passo de um implante', 'Responde: "quanto tempo dura um implante bem cuidado?"']],
    ['heart', 'Cuidar de quem já é paciente', ['Email de retorno pros pacientes de 6 meses', 'Mensagem de aniversário com a sua voz', 'Responde as avaliações novas do Google']],
    ['party', 'Datas e campanhas do ano', ['Post pro Dia do Sorriso / Dia do Dentista', 'Campanha de fim de ano: "comece o ano com o sorriso renovado"', 'Aviso de horário nas festas e feriados']],
    ['camera', 'Mostrar os bastidores', ['Carrossel "conheça a doutora" contando a história', 'Antes e depois (com autorização do paciente)', 'Tour rápido pela estrutura da clínica']],
    ['target', 'Converter e vender', ['Atualiza a landing com botão de WhatsApp', 'Post "agende sua avaliação" com chamada clara', 'Relatório da semana pra ver o que trouxe contato']],
  ];
  const FAQ = [
    ['A IA pode errar?', 'Pode. Por isso ela mostra tudo antes e você aprova. No que for importante, confira com calma.'],
    ['Meus dados estão seguros?', 'Sim. Tudo fica num servidor que é só seu. Nada sai de lá sem você pedir.'],
    ['Preciso entender de tecnologia?', 'Não. É só conversar em português. O sistema cuida da parte técnica por baixo.'],
    ['E se eu travar em algo?', 'Fale com a Hórus. A gente ajusta o sistema pra ele trabalhar cada vez mais do seu jeito.'],
  ];

  App.views['guia'] = {
    title: 'Guia do sistema',
    render(root) {
      const b = store.get().business;
      root.appendChild(h(`<div class="guia-hero">
        <div class="page-eyebrow" style="color:var(--brand-2)">Guia do seu sistema</div>
        <h1 style="font-size:34px;margin-top:10px">O seu sistema, <span class="serif-it" style="font-size:34px">por dentro</span></h1>
        <p class="page-sub" style="max-width:60ch">É a sua operação de marketing rodando quase sozinha. Uma assistente com IA que já conhece a sua marca, o seu jeito de falar e o seu público. Ela cria, organiza e — quando você deixa — publica por você. Tudo num servidor privado, só seu.</p>
        <div class="row gap-3 mt-5 wrap">
          <button class="btn primary" data-go="inicio">${icon('home')} Ir pro Início</button>
          <button class="btn" data-go="conversar">${icon('chat')} Conversar com a IA</button>
        </div>
      </div>`));

      // cycle
      root.appendChild(h(`<div class="section-label">Como o dia a dia funciona · sempre o mesmo ciclo</div>`));
      const cyc = h('<div class="grid g4"></div>');
      CYCLE.forEach(([ic, t, d], i) => cyc.appendChild(h(`<div class="card"><div class="row gap-2" style="margin-bottom:10px"><span class="guia-n">${i + 1}</span><span class="list-ic" style="background:var(--brand-soft);color:var(--brand-2)">${icon(ic)}</span></div><h3 style="font-size:15px">${t}</h3><p class="muted" style="font-size:13px;line-height:1.5;margin-top:6px">${d}</p></div>`)));
      root.appendChild(cyc);

      // golden rules
      const rules = h(`<div class="grid g2 mt-4">
        <div class="tip">${icon('shield')}<div><b>Regra de ouro 1.</b> A IA pode errar — por isso ela sempre te mostra antes. Você é quem aprova.</div></div>
        <div class="tip">${icon('chat')}<div><b>Regra de ouro 2.</b> Você não precisa saber de tecnologia. Se sabe mandar mensagem no WhatsApp, sabe usar isso aqui.</div></div>
      </div>`);
      root.appendChild(rules);

      // screens
      root.appendChild(h(`<div class="section-label">Cada tela do painel</div>`));
      const sg = h('<div class="grid g3"></div>');
      SCREENS.forEach(([id, ic, t, d]) => {
        const c = h(`<div class="card hover"><div class="row gap-3"><span class="list-ic" style="background:var(--brand-soft);color:var(--brand-2)">${icon(ic)}</span><div><div style="font-weight:600;font-size:14px">${t}</div></div></div><p class="muted" style="font-size:12.5px;line-height:1.5;margin-top:10px">${d}</p></div>`);
        c.addEventListener('click', () => App.router.go(id)); sg.appendChild(c);
      });
      root.appendChild(sg);

      // ideas
      root.appendChild(h(`<div class="section-label">★ Pra te inspirar · é só pedir</div>`));
      const ig = h('<div class="grid g3"></div>');
      IDEAS.forEach(([ic, t, list]) => {
        const c = h(`<div class="card"><div class="row gap-2" style="margin-bottom:12px"><span class="list-ic" style="background:var(--brand-soft);color:var(--brand-2)">${icon(ic)}</span><h3 style="font-size:15px">${t}</h3></div><div class="col gap-2"></div></div>`);
        const box = c.querySelector('.col');
        list.forEach((line) => { const chip = h(`<button class="chip-suggest" style="text-align:left;width:100%">› ${esc(line)}</button>`); chip.addEventListener('click', () => { store.addChat('me', line); App.router.go('conversar'); }); box.appendChild(chip); });
        ig.appendChild(c);
      });
      root.appendChild(ig);

      // routine + faq
      root.appendChild(h(`<div class="section-label">✓ Pra fechar · sua rotina em 5 minutos</div>`));
      const rot = h('<div class="card"></div>');
      [['Abra em "Início"', 'Olhe a mesa do dia: o que espera o seu sim aparece logo de cara.'], ['Aprove ou ajuste', 'Um clique em Aprovar e o conteúdo segue. Se algo não ficou bom, peça a mudança.'], ['Precisa de algo novo?', 'Vá em "Criar" pra escolher do cardápio, ou "Conversar" e peça com suas palavras.'], ['De vez em quando', 'Dê uma olhada em "Relatório" (a semana) e "Custo de API" (o gasto do mês).']].forEach(([t, d], i) => rot.appendChild(h(`<div class="guia-step"><div class="guia-n">${i + 1}</div><div><div style="font-weight:600;font-size:14px">${t}</div><div class="muted" style="font-size:13px;margin-top:3px;line-height:1.5">${d}</div></div></div>`)));
      root.appendChild(rot);

      const fg = h('<div class="grid g2 mt-4"></div>');
      FAQ.forEach(([q, a]) => fg.appendChild(h(`<div class="card"><h3 style="font-size:15px">${esc(q)}</h3><p class="muted" style="font-size:13.5px;line-height:1.6;margin-top:8px">${esc(a)}</p></div>`)));
      root.appendChild(fg);

      root.appendChild(h(`<div class="hero-card mt-6" style="text-align:center;padding:34px"><div style="font-family:var(--font-serif);font-style:italic;font-size:22px;color:var(--ink)">Bom trabalho, ${esc(b.first)}. O sistema é seu — use sem medo.</div><div class="faint mt-3" style="letter-spacing:.16em;font-size:11px">POR HÓRUS</div></div>`));

      root.addEventListener('click', (e) => { const g = e.target.closest('[data-go]'); if (g && g.dataset.go) App.router.go(g.dataset.go); });
    },
  };
})();
