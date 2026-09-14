/* Landing page — prévia ao vivo + mudanças em português. */
(function () {
  const { h, esc, icon, toast } = App.ui;
  const store = App.store;

  function cfg() {
    const s = store.get();
    if (!s.landing) {
      const b = s.business;
      s.landing = {
        title: 'Recupere o seu sorriso com segurança',
        sub: 'Implantes, ortodontia e prótese em ' + b.city + '. Planejamento digital e explicação clara de cada etapa.',
        btnColor: s.brand.accent,
        btnText: 'Agendar avaliação',
        published: true,
        align: 'left',
      };
    }
    return s.landing;
  }

  App.views['landing'] = {
    title: 'Landing page',
    render(root) {
      const b = store.get().business;
      const c = cfg();
      root.appendChild(h(`<div class="page-head">
        <div class="page-eyebrow">Ajustes · Landing page</div>
        <h1 class="page-title">A sua página na <span class="serif-it">internet</span></h1>
        <p class="page-sub">A página que recebe quem te procura pela primeira vez. Peça mudanças em português e publique quando gostar.</p>
      </div>`));

      const grid = h('<div class="grid" style="grid-template-columns:1.6fr 1fr;align-items:start"></div>');
      const previewCard = h(`<div class="browser"><div class="browser-bar"><div class="dots"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i></div><div class="url">${esc(b.site)}</div><button class="btn ghost sm icon" id="refresh" style="width:28px;height:28px">${icon('refresh')}</button></div><div id="lp-frame"></div></div>`);
      grid.appendChild(previewCard);
      const framehost = previewCard.querySelector('#lp-frame');
      renderFrame(framehost);
      previewCard.querySelector('#refresh').addEventListener('click', () => renderFrame(framehost));

      // right: chat edits
      const side = h(`<div class="card">
        <div class="card-h"><h3>${icon('chat')} Mudar conversando</h3></div>
        <p class="muted" style="font-size:13px;line-height:1.55">Diga o que quer mudar. Ex: “troca a cor do botão pra verde”, “deixa o título maior”, “muda o texto do botão”.</p>
        <div class="col gap-2 mt-3" id="lp-sug"></div>
        <div class="chat-input mt-4" style="border-radius:12px"><textarea rows="1" id="lp-in" placeholder="O que quer mudar?"></textarea><button class="btn primary icon" id="lp-send">${icon('send')}</button></div>
        <div class="mt-4 row gap-3">
          <button class="btn ok grow" id="lp-pub">${icon('check')} Publicar mudanças</button>
        </div>
        <div class="tip mt-4">${icon('whatsapp')}<div>A página tem botão de WhatsApp e de agendamento — ela trabalha pra trazer paciente pra você.</div></div>
      </div>`);
      grid.appendChild(side);
      root.appendChild(grid);

      const sug = side.querySelector('#lp-sug');
      ['Deixa o título maior', 'Troca a cor do botão pra verde', 'Muda o botão pra "Falar no WhatsApp"', 'Centraliza o texto'].forEach((t) => {
        const chip = h(`<button class="chip-suggest" style="text-align:left">${esc(t)}</button>`);
        chip.addEventListener('click', () => applyEdit(t, framehost));
        sug.appendChild(chip);
      });
      const ta = side.querySelector('#lp-in');
      side.querySelector('#lp-send').addEventListener('click', () => { applyEdit(ta.value, framehost); ta.value = ''; });
      ta.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); applyEdit(ta.value, framehost); ta.value = ''; } });
      side.querySelector('#lp-pub').addEventListener('click', () => { store.save(); store.logActivity('published', 'Landing page publicada com novas mudanças'); toast('Página publicada!', { sub: 'No ar em ' + b.site, icon: 'check' }); });
    },
  };

  function renderFrame(host) {
    const b = store.get().business; const c = cfg();
    host.innerHTML = '';
    host.appendChild(h(`<div style="background:linear-gradient(160deg,#0c1526,#0A0B0F);color:#fff;padding:0">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 22px;border-bottom:1px solid rgba(255,255,255,.08)">
        <div style="display:flex;align-items:center;gap:9px"><span style="width:26px;height:26px;border-radius:7px;background:${c.btnColor};display:grid;place-items:center">${icon('tooth')}</span><b style="font-family:var(--font-display);font-size:14px">${esc(b.ownerName)}</b></div>
        <div style="display:flex;gap:18px;font-size:12px;color:rgba(255,255,255,.7)"><span>Serviços</span><span>Sobre</span><span>Contato</span></div>
      </div>
      <div style="padding:52px 30px;text-align:${c.align};background:radial-gradient(80% 100% at ${c.align === 'center' ? '50% 0%' : '0% 0%'}, color-mix(in srgb,${c.btnColor} 26%, transparent), transparent 60%)">
        <div style="display:inline-block;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:color-mix(in srgb,${c.btnColor} 70%, #fff);border:1px solid rgba(255,255,255,.15);border-radius:999px;padding:5px 12px;margin-bottom:18px">${esc(b.city)} · Odontologia</div>
        <h1 style="font-family:var(--font-display);font-size:${c.titleSize || 32}px;line-height:1.08;max-width:16ch;${c.align === 'center' ? 'margin:0 auto;' : ''}letter-spacing:-.02em">${esc(c.title)}</h1>
        <p style="color:rgba(255,255,255,.72);margin-top:16px;max-width:44ch;font-size:14px;line-height:1.6;${c.align === 'center' ? 'margin-left:auto;margin-right:auto;' : ''}">${esc(c.sub)}</p>
        <div style="display:flex;gap:10px;margin-top:24px;${c.align === 'center' ? 'justify-content:center' : ''}">
          <span style="background:${c.btnColor};color:#fff;border-radius:999px;padding:11px 20px;font-size:13px;font-weight:600;display:inline-flex;align-items:center;gap:7px">${icon('whatsapp')} ${esc(c.btnText)}</span>
          <span style="border:1px solid rgba(255,255,255,.2);color:#fff;border-radius:999px;padding:11px 20px;font-size:13px;font-weight:600">Ver serviços</span>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:0 24px 30px">
        ${['Implantes', 'Ortodontia', 'Prótese'].map((s) => `<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:16px"><div style="width:30px;height:30px;border-radius:8px;background:color-mix(in srgb,${c.btnColor} 18%, transparent);color:color-mix(in srgb,${c.btnColor} 75%, #fff);display:grid;place-items:center;margin-bottom:10px">${icon('tooth')}</div><b style="font-size:13px">${s}</b><div style="font-size:11px;color:rgba(255,255,255,.6);margin-top:4px">Avaliação com planejamento digital.</div></div>`).join('')}
      </div>
    </div>`));
    host.querySelectorAll('svg').forEach((sv) => { if (!sv.style.width) { sv.style.width = '15px'; sv.style.height = '15px'; } });
  }

  function applyEdit(text, host) {
    text = (text || '').trim(); if (!text) return;
    const c = cfg(); const t = text.toLowerCase(); let did = '';
    const colorMap = { verde: '#16a34a', azul: '#2563eb', vermelho: '#dc2626', roxo: '#7c3aed', laranja: '#ea580c', preto: '#111827', dourado: '#F4C430', rosa: '#db2777', ciano: '#0891b2' };
    if (t.includes('bot') && (t.includes('cor') || Object.keys(colorMap).some((k) => t.includes(k)))) {
      const found = Object.keys(colorMap).find((k) => t.includes(k));
      if (found) { c.btnColor = colorMap[found]; did = 'Cor do botão trocada pra ' + found + '.'; }
    } else if (t.includes('bot') && (t.includes('texto') || t.includes('muda') || t.includes('escrit'))) {
      const q = text.match(/["“'](.+?)["”']/); if (q) { c.btnText = q[1]; did = 'Texto do botão atualizado.'; } else if (t.includes('whatsapp')) { c.btnText = 'Falar no WhatsApp'; did = 'Botão agora chama pro WhatsApp.'; }
    } else if (t.includes('título') || t.includes('titulo') || t.includes('maior') || t.includes('menor')) {
      if (t.includes('maior')) { c.titleSize = (c.titleSize || 32) + 6; did = 'Título aumentado.'; }
      else if (t.includes('menor')) { c.titleSize = Math.max(20, (c.titleSize || 32) - 6); did = 'Título diminuído.'; }
      else { const q = text.match(/["“'](.+?)["”']/); if (q) { c.title = q[1]; did = 'Título atualizado.'; } }
    } else if (t.includes('centraliz')) { c.align = 'center'; did = 'Texto centralizado.'; }
    else if (t.includes('esquerda') || t.includes('alinha')) { c.align = 'left'; did = 'Texto alinhado à esquerda.'; }
    else { did = ''; }

    store.emit();
    renderFrame(host);
    if (did) toast(did, { sub: 'Confira na prévia e publique quando gostar.', icon: 'check' });
    else toast('Não entendi a mudança', { kind: 'warn', sub: 'Tente: "troca a cor do botão pra verde".' });
  }
})();
