/* =========================================================================
   HORUS · Painel — store.js
   Single source of truth. localStorage-backed, pub/sub, demo-seeded.
   Demo tenant = a fictional dental clinic. The product is made by Hórus.
   ========================================================================= */
(function () {
  const KEY = 'horus_painel_state_v1';
  const now = Date.now();
  const H = 3600e3, D = 24 * H;
  const iso = (ms) => new Date(ms).toISOString();
  const uid = () => Math.random().toString(36).slice(2, 9);

  function seed() {
    return {
      _v: 1,
      onboarded: false,
      business: {
        clinicName: 'Clínica Odontológica',
        ownerName: 'Dra. Marina Alves',
        first: 'Marina',
        city: 'Guarapuava',
        specialty: 'Implantes, ortodontia e prótese',
        whatsapp: '(42) 99999-0000',
        instagram: '@clinicamarinaalves',
        site: 'clinicamarinaalves.com.br',
        email: 'contato@clinicamarinaalves.com.br',
      },
      brand: {
        accent: '#2563EB',
        accent2: '#60A5FA',
        logoText: 'Dra. Marina Alves',
        display: 'Sora',
        body: 'Hanken Grotesk',
      },
      profile: {
        quem: 'Clínica odontológica em Guarapuava especializada em implantes, ortodontia e prótese. Atende adultos que querem resolver o sorriso com segurança, sem enrolação. Diferencial: atendimento humano, planejamento digital e explicação clara de cada etapa.',
        jeito: 'Acolhedor, claro e confiável. Fala com o paciente como gente, não como bula. Nada de superlativo ("o melhor", "referência"), nada de promessa de resultado. Explica antes de vender.',
        onde: 'Encher a agenda de avaliações de implante nos próximos 60 dias e virar a primeira clínica que aparece quando alguém busca "implante em Guarapuava".',
      },
      autonomy: 'auto',          // 'auto' | 'manual'
      spendCap: 60,              // USD/mês
      cost: {
        month: 14.20,
        tasks: 128,
        history: [3.1, 4.6, 2.2, 5.8, 6.1, 4.9, 7.3, 5.5, 8.0, 6.6, 9.2, 7.1, 8.4, 6.3],
        by: [
          { label: 'Criação de conteúdo', v: 6.4, color: 'var(--brand)' },
          { label: 'Conversas com a IA', v: 3.1, color: 'var(--info)' },
          { label: 'Campanhas e anúncios', v: 2.8, color: 'var(--violet)' },
          { label: 'Relatórios e análise', v: 1.9, color: 'var(--ok)' },
        ],
      },
      connections: { instagram: false, facebook: false, google: false, gcal: false },
      health: { server: 'ok', model: 'ok', backup: 'ok' },
      tasks: [
        { id: uid(), text: 'Diário do site: referências (só em "referências") — implante + estética', done: false },
        { id: uid(), text: 'Otimizar Google Business Profile + campanha de avaliações (3 → 30★)', done: false },
        { id: uid(), text: 'Conferir/aprovar o carrossel "Dente faltando"', done: false },
      ],
      chat: [
        { role: 'ai', text: 'Oi, Dra. Marina! Sou a sua assistente. Já conheço a clínica, o seu jeito de falar e o seu público. É só me pedir o que precisar — em português mesmo, do seu jeito.', ts: iso(now - 30 * 60e3) },
      ],
      content: [
        // --- Pra revisar (esperando o ok) ---
        c('Aparelho tem idade certa?', 'carrossel', 'revisar', now - 2 * H,
          'Mito e verdade sobre ortodontia em adulto. Nunca é tarde pra alinhar o sorriso.',
          { kicker: 'Ortodontia', title: 'Aparelho tem<br><em>idade certa?</em>', accent: '#2563EB' }, 5),
        c('Faltou um dente?', 'carrossel', 'revisar', now - 3 * H,
          'O vazio de um dente perdido não fica só no sorriso. Veja as suas opções hoje.',
          { kicker: 'Implante', title: 'Faltou um dente?<br><em>O vazio não</em><br>fica só no sorriso', accent: '#1e3a8a' }, 5),
        c('Conheça a Dra. Marina', 'carrossel', 'revisar', now - 5 * H,
          'A história de quem cuida do seu sorriso. Bastidores da clínica.',
          { kicker: 'Bastidores', title: 'Conheça a<br><em>Dra. Marina</em>', accent: '#0e7490' }, 6),
        c('Email de retorno · pacientes de 6 meses', 'email', 'revisar', now - 6 * H,
          'Lembrete carinhoso de manutenção pra quem não aparece há 6 meses.', null, 0),
        c('Resposta à avaliação do Google (★★★★★)', 'email', 'revisar', now - 7 * H,
          'Agradecimento no tom da clínica pra uma avaliação nova de 5 estrelas.', null, 0),
        c('Post: "Perdeu um dente? veja suas opções"', 'post', 'revisar', now - 8 * H,
          'Post direto de captação pra quem perdeu um dente recentemente.',
          { kicker: 'Captação', title: 'Perdeu um dente?<br><em>Veja suas</em><br>opções hoje', accent: '#2563EB' }, 1),
        // --- Em produção ---
        c('Série: 5 mitos sobre clareamento', 'tema', 'producao', now - 1 * H,
          'Blog + carrossel + legendas. Mitos e verdades sobre clareamento dental.', null, 0),
        c('Quanto tempo dura um implante?', 'post', 'producao', now - 40 * 60e3,
          'Responde a dúvida mais comum de quem pensa em implante.',
          { kicker: 'Dúvida', title: 'Quanto tempo<br><em>dura</em> um implante<br>bem cuidado?', accent: '#155e75' }, 1),
        // --- Ideias ---
        c('Antes e depois (com autorização)', 'carrossel', 'ideias', now - 26 * H, 'Caso real de reabilitação — só com autorização assinada do paciente.', null, 4),
        c('Dia do Sorriso · post comemorativo', 'post', 'ideias', now - 30 * H, 'Peça leve pro Dia do Sorriso, ligando com a marca.', null, 1),
        // --- No ar (publicados) ---
        c('Passo a passo de um implante', 'carrossel', 'ar', now - 2 * D, 'Explicação didática de como funciona um implante, do começo ao fim.',
          { kicker: 'Autoridade', title: 'Como funciona<br><em>um implante</em>,<br>passo a passo', accent: '#1d4ed8' }, 7),
        c('Aparelho invisível em Guarapuava', 'anuncio', 'ar', now - 3 * D, 'Campanha no Google pra quem busca alinhador invisível na região.', null, 0),
      ],
      activity: [
        a('running', 'Gerando carrossel "5 mitos sobre clareamento"', now - 4 * 60e3),
        a('done', 'Rascunho de email de retorno criado', now - 6 * H),
        a('done', 'Resposta à avaliação do Google preparada', now - 7 * H),
        a('done', 'Carrossel "Conheça a Dra. Marina" montado (6 slides)', now - 5 * H),
        a('done', 'Post "Perdeu um dente?" escrito', now - 8 * H),
        a('published', 'Publicado no Instagram: "Passo a passo de um implante"', now - 2 * D),
        a('published', 'Campanha Google no ar: "Aparelho invisível em Guarapuava"', now - 3 * D),
        a('done', 'Relatório semanal do Instagram gerado', now - 3 * D - 2 * H),
      ],
      knowledge: [
        k('A clínica NÃO promete resultado nem prazo de tratamento (regra de compliance CFO).', 'Meu negócio', false),
        k('Tom de voz: acolhedor e claro. Evitar superlativo ("o melhor", "referência da região").', 'Preferências', false),
        k('Cidade de atuação: Guarapuava. SEO local é a prioridade.', 'Meu negócio', false),
        k('Antes/depois só com autorização assinada do paciente.', 'Compliance', false),
        k('WhatsApp de agendamento é o canal principal de conversão.', 'Estratégia', false),
        k('A Dra. gosta de explicar o "porquê" de cada tratamento antes de falar de preço.', 'Preferências', false),
        k('Público principal: adultos 35–60 que já perderam ou vão perder um dente.', 'Meu negócio', true),
      ],
      references: [
        ref('Editorial clean, muito respiro', 'Layout', '#1e3a8a'),
        ref('Antes/depois com moldura sóbria', 'Composição', '#0e7490'),
        ref('Azul + dente, tipografia forte', 'Cor', '#2563EB'),
        ref('Carrossel educativo em 5 slides', 'Formato', '#155e75'),
        ref('Foto de bastidor humanizada', 'Fotografia', '#4338ca'),
        ref('CTA de WhatsApp destacado', 'Conversão', '#1d4ed8'),
      ],
      templates: [
        tpl('Capa · pergunta', 'capa', '#2563EB'),
        tpl('Conteúdo · texto + ícone', 'conteudo', '#1e3a8a'),
        tpl('Mito x Verdade', 'mito', '#0e7490'),
        tpl('Antes e depois', 'antesdepois', '#155e75'),
        tpl('CTA · agende sua avaliação', 'cta', '#1d4ed8'),
        tpl('Citação da doutora', 'citacao', '#4338ca'),
      ],
      report: {
        connected: false,
        reach: 4820, reachDelta: 18,
        followers: 1284, followersDelta: 32,
        interactions: 612, interactionsDelta: 9,
        profileViews: 340, profileDelta: -4,
        days: [320, 410, 380, 520, 610, 700, 880],
        topPost: { title: 'Passo a passo de um implante', reach: 1420, saves: 86, comments: 24 },
      },
      events: buildEvents(now),
      decisions: [
        {
          id: uid(),
          title: 'Corrigir e publicar "Implante: dente faltando"',
          tags: [{ t: 'hoje', c: 'info' }, { t: 'prioridade', c: 'gold' }, { t: 'precisa do seu ok', c: 'warn' }],
          body: 'Esse carrossel está travado desde ontem por um erro no PDF. Já corrigi, revisei o arquivo antes de salvar e deixei público no Instagram e no Facebook. É só o seu ok pra ir ao ar.',
          bullets: ['Corrigido o PDF que estava quebrado', 'Conferido o arquivo antes de subir', 'Público no Instagram e no Facebook'],
          contentTitle: 'Faltou um dente?',
        },
        {
          id: uid(),
          title: 'Aprovar campanha "Aparelho invisível em Guarapuava"',
          tags: [{ t: 'campanha', c: 'violet' }, { t: 'precisa do seu ok', c: 'warn' }],
          body: 'Montei a campanha inteira no Google — títulos, palavras e descrições — mirando quem busca alinhador invisível na sua região. Orçamento sugerido dentro do teto do mês. Aprova pra subir?',
          bullets: ['12 palavras-chave de intenção alta', '4 títulos e 2 descrições no seu tom', 'Teto de gasto respeitado'],
        },
      ],
    };
  }

  function c(title, type, stage, ts, caption, art, slides) {
    return { id: uid(), title, type, stage, updated: iso(ts), caption, art, slides: slides || 0 };
  }
  function a(status, title, ts) { return { id: uid(), status, title, ts: iso(ts) }; }
  function k(text, source, muted) { return { id: uid(), text, source, muted: !!muted }; }
  function ref(text, tag, color) { return { id: uid(), text, tag, color }; }
  function tpl(name, kind, color) { return { id: uid(), name, kind, color }; }

  function buildEvents(base) {
    const d = new Date(base);
    const y = d.getFullYear(), m = d.getMonth(), day = d.getDate();
    const mk = (dd, title, kind) => ({ id: uid(), date: `${y}-${String(m + 1).padStart(2, '0')}-${String(dd).padStart(2, '0')}`, title, kind });
    return [
      mk(Math.min(day + 1, 28), 'Carrossel "Aparelho tem idade certa?"', 'conteudo'),
      mk(Math.min(day + 2, 28), 'Post "Perdeu um dente?"', 'conteudo'),
      mk(Math.min(day + 3, 28), 'Entrega do vídeo de bastidor', 'prazo'),
      mk(Math.min(day + 4, 28), 'Reunião com a Dra. Marina', 'compromisso'),
      mk(Math.min(day + 5, 28), 'Fechamento do mês · custo de API', 'dinheiro'),
      mk(Math.max(day - 2, 1), 'Publicado: passo a passo do implante', 'conteudo'),
      mk(Math.max(day - 1, 1), 'Nova avaliação 5★ respondida', 'venda'),
      mk(Math.min(day + 8, 28), 'Campanha de avaliações começa', 'venda'),
      mk(Math.min(day + 10, 28), 'Série de clareamento vai ao ar', 'conteudo'),
    ];
  }

  // ---------------- store engine ----------------
  let state = load();
  const subs = new Set();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s && s._v === 1) return s;
      }
    } catch (e) {}
    return seed();
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }
  function emit() { save(); subs.forEach((f) => { try { f(state); } catch (e) { console.error(e); } }); }

  const store = {
    get() { return state; },
    subscribe(fn) { subs.add(fn); return () => subs.delete(fn); },
    emit,
    save,
    update(fn) { fn(state); emit(); },
    set(patch) { Object.assign(state, patch); emit(); },
    reset() { state = seed(); emit(); },

    // ---- domain helpers ----
    uid,
    countBy(stage) { return state.content.filter((x) => x.stage === stage).length; },
    reviewCount() { return state.content.filter((x) => x.stage === 'revisar').length; },
    pendingDecisions() { return state.decisions.length; },

    logActivity(status, title) {
      state.activity.unshift(a(status, title, Date.now()));
      if (state.activity.length > 60) state.activity.length = 60;
      emit();
    },
    addContent(item) {
      const it = Object.assign({ id: uid(), stage: 'ideias', updated: iso(Date.now()), slides: 0 }, item);
      state.content.unshift(it);
      emit();
      return it;
    },
    moveContent(id, stage) {
      const it = state.content.find((x) => x.id === id);
      if (it) { it.stage = stage; it.updated = iso(Date.now()); emit(); }
      return it;
    },
    removeContent(id) { state.content = state.content.filter((x) => x.id !== id); emit(); },

    addChat(role, text) { state.chat.push({ role, text, ts: iso(Date.now()) }); emit(); },

    setBrand(patch) { Object.assign(state.brand, patch); emit(); applyBrand(); },
  };

  function applyBrand() {
    const r = document.documentElement;
    r.style.setProperty('--brand', state.brand.accent);
    r.style.setProperty('--brand-2', state.brand.accent2);
    const hex = state.brand.accent.replace('#', '');
    const n = parseInt(hex, 16), R = (n >> 16) & 255, G = (n >> 8) & 255, B = n & 255;
    r.style.setProperty('--brand-soft', `rgba(${R},${G},${B},.14)`);
    r.style.setProperty('--brand-glow', `rgba(${R},${G},${B},.35)`);
  }

  App.store = store;
  App.applyBrand = applyBrand;
  App.util = { iso, uid, fmtRel, fmtTime, fmtDate };

  // ---------------- time formatting ----------------
  function fmtRel(isoStr) {
    const t = new Date(isoStr).getTime();
    const diff = Date.now() - t;
    if (diff < 60e3) return 'agora';
    if (diff < H) return `há ${Math.floor(diff / 60e3)} min`;
    if (diff < D) return `há ${Math.floor(diff / H)} h`;
    const days = Math.floor(diff / D);
    if (days === 1) return 'ontem';
    if (days < 7) return `há ${days} dias`;
    return fmtDate(isoStr);
  }
  function fmtTime(isoStr) {
    return new Date(isoStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
  function fmtDate(isoStr) {
    return new Date(isoStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  }
})();
