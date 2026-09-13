/* Arquivos — explorador de pastas do negócio. Mais pra consultar. */
(function () {
  const { h, esc, icon, modal, toast } = App.ui;
  const store = App.store;

  function tree() {
    const b = store.get().business;
    return {
      'Marca': { _icon: 'palette', children: {
        'logo.png': { size: '82 KB', kind: 'img' },
        'cores.txt': { size: '1 KB', kind: 'txt', body: 'Cor principal: ' + store.get().brand.accent + '\nApoio: ' + store.get().brand.accent2 + '\nFontes: ' + store.get().brand.display + ' + ' + store.get().brand.body },
        'manual-de-marca.pdf': { size: '2,4 MB', kind: 'pdf' },
      }},
      'Memória': { _icon: 'brain', children: {
        'quem-somos.md': { size: '2 KB', kind: 'txt', body: store.get().profile.quem },
        'jeito-de-falar.md': { size: '1 KB', kind: 'txt', body: store.get().profile.jeito },
        'onde-quero-chegar.md': { size: '1 KB', kind: 'txt', body: store.get().profile.onde },
      }},
      'Conteúdos': { _icon: 'images', children: contentFiles() },
      'Campanhas': { _icon: 'megaphone', children: {
        'google-ads-setembro.csv': { size: '4 KB', kind: 'csv' },
        'relatorio-semana.pdf': { size: '320 KB', kind: 'pdf' },
      }},
      'Fotos': { _icon: 'camera', children: {
        'bastidores': { _icon: 'folder', children: { 'clinica-01.jpg': { size: '1,8 MB', kind: 'img' }, 'clinica-02.jpg': { size: '2,1 MB', kind: 'img' }, 'equipe.jpg': { size: '3,0 MB', kind: 'img' } } },
        'antes-depois (autorizados)': { _icon: 'folder', children: { 'caso-01.jpg': { size: '1,2 MB', kind: 'img' } } },
      }},
      'Site': { _icon: 'globe', children: {
        'landing.html': { size: '18 KB', kind: 'code' },
        'agradecimento.html': { size: '6 KB', kind: 'code' },
      }},
    };
  }
  function contentFiles() {
    const out = {};
    store.get().content.forEach((c) => { out[slug(c.title) + '.' + (c.type === 'email' ? 'md' : 'png')] = { size: (10 + (c.title.length % 40)) + ' KB', kind: c.art ? 'img' : 'txt', body: c.caption, item: c }; });
    return out;
  }
  function slug(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30); }

  App.views['arquivos'] = {
    title: 'Arquivos',
    render(root) {
      let path = [];
      root.appendChild(h(`<div class="page-head">
        <div class="page-eyebrow">Ajustes · Arquivos</div>
        <h1 class="page-title">Tudo guardado e <span class="serif-it">organizado</span></h1>
        <p class="page-sub">As pastas do seu negócio, como no computador. Bom pra achar aquele arquivo específico.</p>
      </div>`));

      const bar = h('<div class="card tight" style="margin-bottom:12px"><div class="crumbs" id="crumbs"></div></div>');
      const listCard = h('<div class="card"><div id="filelist"></div></div>');
      root.append(bar, listCard);

      function current() { let node = { children: tree() }; path.forEach((p) => { node = node.children[p]; }); return node.children; }
      function draw() {
        const crumbs = bar.querySelector('#crumbs');
        crumbs.innerHTML = '';
        const home = h(`<button data-i="-1">${icon('folderOpen')} Meu negócio</button>`);
        home.addEventListener('click', () => { path = []; draw(); });
        crumbs.appendChild(home);
        path.forEach((p, i) => { crumbs.appendChild(h('<span class="sep">/</span>')); const btn = h(`<button data-i="${i}">${esc(p)}</button>`); btn.addEventListener('click', () => { path = path.slice(0, i + 1); draw(); }); crumbs.appendChild(btn); });

        const list = listCard.querySelector('#filelist'); list.innerHTML = '';
        const entries = current();
        const keys = Object.keys(entries).sort((a, b) => (entries[a].children ? 0 : 1) - (entries[b].children ? 0 : 1));
        keys.forEach((name) => {
          const node = entries[name]; const isDir = !!node.children;
          const row = h(`<div class="file-row ${isDir ? 'dir' : ''}">
            <span class="file-ic ${isDir ? 'dir' : ''}">${icon(isDir ? (node._icon || 'folder') : fileIcon(node.kind))}</span>
            <div class="grow"><div style="font-size:13.5px;font-weight:500">${esc(name)}</div><div class="faint" style="font-size:11.5px">${isDir ? Object.keys(node.children).length + ' itens' : (node.size || '')}</div></div>
            ${isDir ? icon('chevR') : ''}
          </div>`);
          if (isDir) row.addEventListener('click', () => { path.push(name); draw(); });
          else row.addEventListener('click', () => openFile(name, node));
          list.appendChild(row);
        });
        if (!keys.length) list.appendChild(h(`<div class="empty">${icon('folder')}<div class="t">Pasta vazia</div></div>`));
      }
      draw();

      function openFile(name, node) {
        let bodyHtml;
        if (node.item && node.item.art) bodyHtml = `<div class="detail-slide" style="width:100%;aspect-ratio:4/5;max-width:260px;margin:0 auto;background:linear-gradient(155deg, ${node.item.art.accent}, color-mix(in srgb,${node.item.art.accent} 55%, #05070d))"><div style="font-size:9px;letter-spacing:.12em;text-transform:uppercase;opacity:.8">${esc(node.item.art.kicker)}</div><div style="margin-top:auto;font-family:var(--font-display);font-weight:700;font-size:18px;line-height:1.1">${node.item.art.title}</div></div>`;
        else if (node.kind === 'img') bodyHtml = `<div style="aspect-ratio:16/10;background:linear-gradient(155deg,var(--surface-2),var(--surface));border-radius:12px;display:grid;place-items:center;color:var(--ink-3)">${icon('image')}<span style="margin-left:8px">Prévia da imagem</span></div>`;
        else if (node.body) bodyHtml = `<div class="card tight" style="white-space:pre-wrap;line-height:1.6;font-size:13.5px;color:var(--ink-2)">${esc(node.body)}</div>`;
        else bodyHtml = `<div class="empty">${icon(fileIcon(node.kind))}<div class="t">${esc(name)} · ${esc(node.size || '')}</div></div>`;
        const foot = h(`<button class="btn ghost sm">${icon('external')} Abrir</button>`);
        foot.addEventListener('click', () => toast('Numa versão conectada, isso abre o arquivo.', { kind: 'info' }));
        modal({ title: name, body: h(`<div>${bodyHtml}</div>`), footer: foot });
      }
    },
  };

  function fileIcon(kind) { return { img: 'image', txt: 'fileText', md: 'fileText', pdf: 'file', csv: 'barchart', code: 'globe' }[kind] || 'file'; }
})();
