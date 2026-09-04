const kb = (n) => (n ? `${(n / 1024).toFixed(0)} KB` : '');

(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const assets = await chrome.runtime.sendMessage({ type: 'assets', tabId: tab.id });
  if (assets?.length) {
    document.getElementById('files').replaceChildren(
      ...assets.map((a) => {
        const row = document.createElement('div');
        row.className = 'row';
        row.innerHTML = `<span class="tag"></span><span class="name"></span><span class="dim"></span>`;
        row.children[0].textContent = a.ext;
        row.children[1].textContent = a.name;
        row.children[1].title = a.url;
        row.children[2].textContent = kb(a.size);
        const b = document.createElement('button');
        b.textContent = a.parts ? `baixar ${a.parts.length + 1}` : 'baixar';
        b.onclick = () => {
          // bundle SOG: mantem os arquivos numa pasta, senao o meta.json perde os .webp
          const dir = a.parts ? `${a.name.replace(/\W+/g, '-')}/` : '';
          for (const u of [a.url, ...(a.parts || [])])
            chrome.downloads.download({
              url: u,
              filename: dir + decodeURIComponent(new URL(u).pathname.split('/').pop()),
            });
        };
        row.append(b);
        return row;
      })
    );
  }

  // MAIN world: le a cena viva pelo hook do inject.js
  const run = (func) =>
    chrome.scripting.executeScript({ target: { tabId: tab.id }, world: 'MAIN', func });

  const [{ result }] = await run(() => window.__3DGRAB__?.list());
  const out = document.getElementById('scene');
  const btn = document.getElementById('export');
  const turn = document.getElementById('turn');

  if (!result) out.textContent = 'nada detectado (recarregue a pagina com a extensao ativa)';
  else if (!result.meshes) out.textContent = `${result.scenes} cena(s), 0 mesh visivel`;
  else {
    out.textContent = `${result.meshes} meshes · ${result.triangles.toLocaleString()} triangulos`;
    btn.disabled = turn.disabled = false;
  }

  turn.onclick = async () => {
    turn.disabled = true;
    const [{ result: r }] = await run(() => window.__3DGRAB__.turntable());
    turn.textContent = r?.ok ? `${r.shots.length} PNGs salvos` : `falhou: ${r?.error || 'erro'}`;
  };

  btn.onclick = async () => {
    btn.disabled = true;
    btn.textContent = 'exportando…';
    const [{ result: r }] = await run(() => window.__3DGRAB__.export());
    btn.textContent = r?.ok ? `salvo · ${kb(r.bytes)}` : `falhou: ${r?.error || 'erro'}`;
  };
})();
