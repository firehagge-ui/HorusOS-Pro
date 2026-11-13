// Revisão completa do esboço da Débora: erros, imagens, largura, textos proibidos, links e números de WhatsApp.
const { chromium } = require(process.cwd() + '/node_modules/playwright');
const fs = require('fs'), path = require('path');
const base = process.argv[2]; // pasta do site (file) ou URL
const ehUrl = /^https?:/.test(base);
// a versão de produção (publicar-dominio.cjs) não tem guia nem ideias: passe --producao
const paginas = ['index.html', 'projetos.html', 'projeto-rio-vermelho.html', 'projeto-paralela.html', 'projeto-graca.html',
  'projeto-alto-do-parque.html', 'projeto-itaigara.html', 'conte-sua-casa.html',
  ...(process.argv.includes('--producao') ? [] : ['guia.html', 'ideias.html'])];
const larguras = [360, 390, 768, 1024, 1280, 1440, 1905];
const url = p => ehUrl ? base.replace(/\/$/, '') + '/' + p : 'file:///' + path.resolve(base, p).replace(/\\/g, '/');
(async () => {
  const b = await chromium.launch();
  const problemas = [];
  const links = new Map();
  for (const pg of paginas) {
    for (const w of larguras) {
      const p = await b.newPage({ viewport: { width: w, height: 900 } });
      const erros = [], falhas = [];
      p.on('pageerror', e => erros.push(e.message));
      p.on('console', m => { if (m.type() === 'error') erros.push(m.text()); });
      p.on('requestfailed', r => { if (!/fontshare|googleapis|gstatic/.test(r.url())) falhas.push(r.url()); });
      p.on('response', r => { if (r.status() >= 400) falhas.push(r.status() + ' ' + r.url()); });
      await p.goto(url(pg), { waitUntil: 'networkidle' });
      const H = await p.evaluate(() => document.body.scrollHeight);
      for (let y = 0; y < H; y += 600) { await p.evaluate(v => scrollTo(0, v), y); await p.waitForTimeout(50); }
      await p.waitForTimeout(700);
      const r = await p.evaluate(() => {
        const vis = document.body.innerText;
        const busca = (re) => (vis.match(re) || []).length;
        const imgs = [...document.images].filter(i => i.getAttribute('src') !== 'data:,');
        const quebradas = imgs.filter(i => i.complete && !i.naturalWidth).map(i => i.getAttribute('src'));
        const esticadas = imgs.filter(i => i.naturalWidth && i.getBoundingClientRect().width * devicePixelRatio > i.naturalWidth * 1.35)
          .map(i => i.getAttribute('src').split('/').pop() + ' ' + Math.round(i.getBoundingClientRect().width) + '/' + i.naturalWidth);
        return {
          largura: document.documentElement.scrollWidth, quebradas, esticadas,
          falta: busca(/\[FALTA/g), horus: busca(/H[óo]rus/g), travessao: busca(/[—–]/g), lixo: busca(/undefined|NaN|lorem/gi),
          demo: busca(/Demonstra[çc][ãa]o/g), simul: busca(/Simula[çc][ãa]o/g),
          links: [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href'))
        };
      });
      const tag = pg + ' @' + w;
      if (erros.length) problemas.push(tag + ' ERRO: ' + [...new Set(erros)].join(' | '));
      if (falhas.length) problemas.push(tag + ' FALHA DE CARGA: ' + [...new Set(falhas)].join(' | '));
      if (r.largura > w) problemas.push(tag + ' rolagem lateral: ' + r.largura);
      if (r.quebradas.length) problemas.push(tag + ' imagem quebrada: ' + r.quebradas.join(', '));
      if (r.falta || r.horus || r.travessao || r.lixo) problemas.push(tag + ` texto: FALTA=${r.falta} Horus=${r.horus} travessão=${r.travessao} lixo=${r.lixo}`);
      if (w === 1440) {
        console.log(pg, 'Demonstração:', r.demo, 'Simulação:', r.simul, r.esticadas.length ? 'esticadas: ' + r.esticadas.join(', ') : '');
        r.links.forEach(l => links.set(l, (links.get(l) || new Set()).add(pg)));
      }
      await p.close();
    }
  }
  // links
  const zapErrado = [], internosQuebrados = [], externos = new Set();
  for (const [l, pgs] of links) {
    if (/wa\.me/.test(l)) { if (!/wa\.me\/5571999775453/.test(l)) zapErrado.push(l); continue; }
    if (/^(https?:|mailto:|tel:)/.test(l)) { externos.add(l); continue; }
    const [arq, ancora] = l.split('#');
    const alvo = arq || [...pgs][0];
    if (!ehUrl && arq && !fs.existsSync(path.resolve(base, arq))) internosQuebrados.push(l + ' (em ' + [...pgs].join(',') + ')');
    if (ancora && !ehUrl) {
      const html = fs.readFileSync(path.resolve(base, alvo), 'utf8');
      if (!new RegExp('id="' + ancora + '"').test(html)) internosQuebrados.push(l + ' (âncora sem alvo, em ' + [...pgs].join(',') + ')');
    }
  }
  console.log('\nLinks de WhatsApp fora do número:', zapErrado.length ? zapErrado : 'nenhum');
  console.log('Links internos quebrados:', internosQuebrados.length ? internosQuebrados : 'nenhum');
  console.log('Externos:', [...externos].join(' | '));
  console.log('\nPROBLEMAS (' + problemas.length + '):\n' + (problemas.join('\n') || 'nenhum'));
  await b.close();
})();
