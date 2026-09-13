/* Conversar — chat com a assistente. Reconhece intenção e cria de verdade. */
(function () {
  const { h, esc, icon, toast } = App.ui;
  const store = App.store;

  const SUGGEST = [
    'Cria um post sobre implante',
    'Carrossel: 5 sinais de que você precisa de um implante',
    'Escreve um email de retorno pros pacientes de 6 meses',
    'Anúncio no Google pra "aparelho invisível"',
    'Responde as avaliações novas do Google',
    'Resumo do dia',
  ];

  App.views['conversar'] = {
    title: 'Conversar',
    render(root) {
      const b = store.get().business;
      root.appendChild(h(`<div class="page-head">
        <div class="page-eyebrow">Todo dia · Conversar</div>
        <h1 class="page-title">É só <span class="serif-it">pedir</span></h1>
        <p class="page-sub">Sua assistente já conhece o seu negócio. Fale como você falaria com uma pessoa — natural, como no WhatsApp.</p>
      </div>`));

      const wrap = h('<div class="chat-wrap"></div>');
      const scroll = h('<div class="chat-scroll" id="chat-scroll"></div>');
      wrap.appendChild(scroll);

      const suggest = h('<div class="chat-suggest"></div>');
      SUGGEST.forEach((t) => { const c = h(`<button class="chip-suggest">${esc(t)}</button>`); c.addEventListener('click', () => { send(t); }); suggest.appendChild(c); });

      const inputBox = h(`<div class="chat-input">
        <textarea rows="1" placeholder="Peça qualquer coisa de marketing…" id="chat-in"></textarea>
        <button class="btn primary icon" id="chat-send" aria-label="Enviar">${icon('send')}</button>
      </div>`);
      wrap.append(suggest, inputBox);
      root.appendChild(wrap);

      const ta = inputBox.querySelector('#chat-in');
      ta.addEventListener('input', () => { ta.style.height = 'auto'; ta.style.height = Math.min(140, ta.scrollHeight) + 'px'; });
      ta.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(ta.value); } });
      inputBox.querySelector('#chat-send').addEventListener('click', () => send(ta.value));

      drawAll();
      setTimeout(() => ta.focus(), 60);

      function drawAll() {
        scroll.innerHTML = '';
        store.get().chat.forEach((m) => scroll.appendChild(bubble(m)));
        scrollDown();
      }
      function scrollDown() { requestAnimationFrame(() => { scroll.scrollTop = scroll.scrollHeight; }); }

      function bubble(m) {
        const el = h(`<div class="msg ${m.role === 'ai' ? 'ai' : 'me'}">
          <div class="avatar">${m.role === 'ai' ? icon('horusEye') : App.ui.esc(initials())}</div>
          <div><div class="bubble">${m.html || esc(m.text).replace(/\n/g, '<br>')}</div><div class="time">${App.util.fmtTime(m.ts)}</div></div>
        </div>`);
        return el;
      }
      function initials() { const n = store.get().business.ownerName.replace(/^Dr[a]?\.?\s*/i, ''); return (n[0] || 'V').toUpperCase(); }

      function send(text) {
        text = (text || '').trim(); if (!text) return;
        store.addChat('me', text);
        ta.value = ''; ta.style.height = 'auto';
        scroll.appendChild(bubble(store.get().chat[store.get().chat.length - 1]));
        scrollDown();
        // typing
        const typing = h(`<div class="msg ai"><div class="avatar">${icon('horusEye')}</div><div><div class="bubble"><span class="typing"><span class="spinner"></span> escrevendo…</span></div></div></div>`);
        scroll.appendChild(typing); scrollDown();
        setTimeout(() => { typing.remove(); respond(text); }, 750 + Math.random() * 500);
      }

      function respond(text) {
        const r = intent(text);
        const msg = { role: 'ai', text: r.text, html: r.html, ts: App.util.iso(Date.now()) };
        store.update((st) => st.chat.push(msg));
        scroll.appendChild(bubble(msg)); scrollDown();
        if (r.after) r.after();
      }
    },
  };

  function intent(text) {
    const b = store.get().business;
    const t = text.toLowerCase();
    const has = (...w) => w.some((x) => t.includes(x));

    function previewCard(item, note) {
      const artHtml = item.art ? `<div style="border-radius:10px;overflow:hidden;border:1px solid var(--line);height:120px;position:relative;margin-top:2px">${App.ui.slideArt(item.art)}</div>` : '';
      return `${esc(note)}<div class="card-inline card tight" style="margin-top:10px">
        ${App.ui.typeBadge(item.type)}
        <div style="font-weight:600;margin-top:8px">${esc(item.title)}</div>
        <div class="muted" style="font-size:12.5px;margin-top:4px;line-height:1.5">${esc(item.caption || '')}</div>
        ${artHtml}
        <div class="row gap-2 mt-3"><button class="btn sm primary" onclick="location.hash='#/conteudos'">Ver na coluna “Pra revisar”</button></div>
      </div>`;
    }

    if (has('carrossel', 'carousel', '5 sinais', 'slides')) {
      const it = store.addContent({ title: cap(subject(text) || 'Carrossel novo'), type: 'carrossel', stage: 'revisar', caption: 'Rascunho pronto pra você revisar. 5 slides, no tom da clínica.', slides: 5, art: { kicker: b.specialty.split(',')[0], title: cap(subject(text) || 'Seu carrossel'), accent: store.get().brand.accent } });
      store.logActivity('done', 'Carrossel criado: "' + it.title + '"');
      return { html: previewCard(it, 'Prontinho. Montei um carrossel de 5 slides já com a cara da sua marca — capa, conteúdo e um CTA no fim. Coloquei em “Pra revisar” pra você aprovar. Quer que eu ajuste o título ou o tom?') };
    }
    if (has('email', 'e-mail', 'retorno', 'aniversário')) {
      const it = store.addContent({ title: cap(subject(text) || 'Email no seu tom'), type: 'email', stage: 'revisar', caption: 'Email escrito no seu tom de voz, pronto pra revisar e enviar.' });
      store.logActivity('done', 'Email criado: "' + it.title + '"');
      return { html: previewCard(it, 'Escrevi o email no seu tom — acolhedor e direto, sem enrolação. Deixei em “Pra revisar”. É só conferir e enviar.') };
    }
    if (has('anúncio', 'anuncio', 'google ads', 'campanha', 'aparecer no topo') || (has('google') && has('aparelho', 'implante', 'anúncio'))) {
      const it = store.addContent({ title: cap('Anúncio: ' + (subject(text) || 'campanha no Google')), type: 'anuncio', stage: 'revisar', caption: 'Campanha de busca montada: títulos, palavras-chave e descrições, mirando ' + b.city + '.' });
      store.logActivity('done', 'Campanha de Google criada: "' + it.title + '"');
      return { html: previewCard(it, 'Montei a campanha inteira no Google — 4 títulos, 2 descrições e 12 palavras de intenção alta pra quem busca na sua região. Está em “Pra revisar”, dentro do teto de gasto do mês.') };
    }
    if (has('avaliaç', 'review', 'google meu negócio', 'estrela')) {
      const it = store.addContent({ title: 'Respostas às avaliações do Google', type: 'email', stage: 'revisar', caption: '3 respostas educadas e no seu tom pras avaliações novas.' });
      store.logActivity('done', 'Respostas de avaliação preparadas');
      return { html: previewCard(it, 'Preparei respostas pras avaliações novas — educadas, no seu tom, sem soar robótico. Coloquei em “Pra revisar”.') };
    }
    if (has('resumo', 'resumo do dia', 'como foi', 'novidade')) {
      const rev = store.reviewCount(), ar = store.countBy('ar');
      return { text: `Resumo de hoje, ${b.first}:\n• ${rev} conteúdo(s) esperando o seu ok\n• ${ar} já no ar\n• ${store.get().decisions.length} decisão(ões) na mesa do dia\n\nSe quiser, começo um carrossel novo agora — é só pedir.` };
    }
    if (has('relatório', 'relatorio', 'números', 'instagram')) {
      return { text: 'Seu relatório da semana está pronto em Relatório — alcance, seguidores e o post que mais funcionou. Quer que eu leve você até lá?', after() { toast('Abra em Relatório pra ver a semana', { kind: 'info' }); } };
    }
    if (has('landing', 'site', 'página', 'pagina')) {
      return { text: 'Consigo mexer na sua landing page conversando: trocar cor de botão, título, seções. Me diz o que quer mudar, ou abra a tela Landing page pra ver a prévia ao vivo.' };
    }
    if (has('oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'tudo bem')) {
      return { text: `Oi! Tudo ótimo por aqui. Bora fazer o telefone tocar? Posso criar um carrossel, escrever um email, montar um anúncio ou responder as avaliações. É só dizer.` };
    }
    // generic
    return { text: `Entendi. Consigo transformar isso em conteúdo pra ${b.clinicName}. Quer que eu monte como carrossel, post único ou email? Se preferir, escolha uma ação em Criar — você sempre vê uma prévia antes de qualquer coisa ir ao ar.` };
  }

  function subject(text) {
    // pull the topic after common verbs / quotes
    const q = text.match(/["“'](.+?)["”']/); if (q) return q[1];
    const m = text.replace(/^(cria|criar|monta|montar|faz|fazer|escreve|escrever|um|uma|o|a)\s+/gi, '').trim();
    const about = m.match(/sobre\s+(.+)$/i); if (about) return about[1];
    return m.length > 3 && m.length < 60 ? m : '';
  }
  function cap(s) { s = String(s || '').trim(); return s.charAt(0).toUpperCase() + s.slice(1); }
})();
