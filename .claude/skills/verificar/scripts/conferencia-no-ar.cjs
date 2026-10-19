// Conferência de um site publicado, antes de o link ir para o cliente ou lead.
// Nasceu da conferência final da Débora Reis (15/10/2026), que pegou miniaturas velhas e um backup no ar.
//
// Uso:
//   node conferencia-no-ar.cjs https://esboco-x.vercel.app/   (ou file:///.../site/index.html) [--fora versao-anterior/,teste.html] [--saida pasta]
//
// O que faz:
//   - acha as páginas sozinho (links internos .html a partir da home, dois níveis);
//   - abre cada uma em 360, 390, 768 e 1440, rola até o fim e anota: erro de console, resposta HTTP 400+,
//     imagem quebrada, rolagem lateral, título/parágrafo/botão saindo da tela;
//   - no texto visível procura [FALTA], travessão (— ou –) e lorem;
//   - confere links internos e âncoras sem alvo;
//   - lista os números de WhatsApp (wa.me) e e-mails distintos, pra bater com o Hounder;
//   - confere que os caminhos passados em --fora dão 404 (backup ou página de teste que não pode estar no ar);
//   - salva print de página inteira em 390 e 1440 na pasta de saída (padrão: ./conferencia).
// Não substitui: o detector (`npx impeccable detect`), o olho em cada seção e o teste de formulário/quiz.

const path = require('path');
const fs = require('fs');
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = require('C:/Users/hagge/playwright-runtime/node_modules/playwright')); }

const args = process.argv.slice(2);
const inicio = args.find(a => /^(https?|file):/.test(a)) || null;
const base = inicio ? inicio.replace(/[^/]*$/, '') : null;
if (!base) { console.log('Uso: node conferencia-no-ar.cjs <url-da-home> [--fora a,b] [--saida pasta]'); process.exit(1); }
const opt = n => { const i = args.indexOf(n); return i > -1 ? args[i + 1] : null; };
const fora = (opt('--fora') || '').split(',').filter(Boolean);
const saida = opt('--saida') || 'conferencia';
fs.mkdirSync(saida, { recursive: true });
const { fileURLToPath } = require('url');
const status = async (p, u) => {
  if (u.startsWith('file:')) return fs.existsSync(fileURLToPath(u.split('?')[0])) ? 200 : 404;
  const r = await p.request.get(u).catch(() => null); return r ? r.status() : 0;
};
const LARGURAS = [[360, 740], [390, 844], [768, 1024], [1440, 900]];

(async () => {
  const br = await chromium.launch();
  const problemas = [];
  const p0 = await br.newPage();

  // 1. Descobrir as páginas
  const paginas = new Set([inicio]);
  for (let nivel = 0; nivel < 2; nivel++) {
    for (const u of [...paginas]) {
      await p0.goto(u, { waitUntil: 'domcontentloaded' }).catch(() => {});
      const links = await p0.$$eval('a[href]', as => as.map(a => a.href)).catch(() => []);
      links.map(h => h.split('#')[0]).filter(h => h.startsWith(base) && (/\.html$/.test(h) || h.endsWith('/')))
        .forEach(h => paginas.add(h));
    }
  }
  const lista = [...paginas];
  console.log(`Páginas (${lista.length}):`, lista.map(u => u.replace(base, '') || '(home)').join(', '));

  // 2. Cada página em cada largura
  const whats = new Set(), emails = new Set(), linksInternos = new Set(), ancorasRuins = new Set();
  for (const [w, h] of LARGURAS) {
    const pg = await br.newPage({ viewport: { width: w, height: h } });
    const nome = () => pg.url().replace(base, '') || '(home)';
    pg.on('pageerror', e => problemas.push(`${w} ${nome()}: erro JS ${e.message}`));
    pg.on('console', m => { if (m.type() === 'error') problemas.push(`${w} ${nome()}: console ${m.text().slice(0, 140)}`); });
    pg.on('response', r => { if (r.status() >= 400) problemas.push(`${w} HTTP ${r.status()} ${r.url()}`); });
    for (const u of lista) {
      // depois de uma página que falha, a tela de erro do Chrome interrompe a navegação seguinte: tentar de novo
      let ok = false;
      for (let t = 0; t < 3 && !ok; t++) {
        ok = await pg.goto(u, { waitUntil: 'networkidle' }).then(r => !r || r.status() < 400).catch(e => (/interrupted/.test(e.message) ? null : false));
        if (ok === false) break;
        if (ok === null) { ok = false; await pg.waitForTimeout(300); }
      }
      if (!ok) { problemas.push(`${w} ${u}: página não abre`); continue; }
      try {
      await pg.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 350) { scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); } scrollTo(0, 0); });
      await pg.waitForTimeout(400);
      const r = await pg.evaluate(() => {
        const vis = e => { const s = getComputedStyle(e); return s.visibility !== 'hidden' && s.display !== 'none' && !e.closest('[aria-hidden=true]'); };
        const texto = document.body.innerText;
        return {
          quebradas: [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.getAttribute('src')),
          lateral: document.documentElement.scrollWidth > innerWidth + 1,
          fora: [...document.querySelectorAll('h1,h2,h3,p,a.btn,button')].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && vis(e) && (b.right > innerWidth + 1 || b.left < -1); })
            .slice(0, 3).map(e => e.tagName + ': ' + e.textContent.trim().slice(0, 40)),
          falta: (texto.match(/\[FALTA[^\]]*\]/g) || []).slice(0, 3),
          travessao: (texto.match(/.{0,25}[—–].{0,25}/g) || []).slice(0, 3),
          lorem: /lorem ipsum/i.test(texto),
          whats: [...document.querySelectorAll('a[href*="wa.me"],a[href*="api.whatsapp"]')].map(a => (a.href.match(/(?:wa\.me\/|phone=)(\d+)/) || [])[1]).filter(Boolean),
          emails: [...document.querySelectorAll('a[href^="mailto:"]')].map(a => a.href.slice(7).split('?')[0]),
          internos: [...document.querySelectorAll('a[href]')].map(a => a.href.split('#')[0]),
          ancoras: [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href')).filter(h => h.length > 1 && !document.getElementById(decodeURIComponent(h.slice(1)))),
        };
      });
      const n = u.replace(base, '') || '(home)';
      if (r.quebradas.length) problemas.push(`${w} ${n}: imagem quebrada ${r.quebradas.join(', ')}`);
      if (r.lateral) problemas.push(`${w} ${n}: rolagem lateral`);
      if (r.fora.length) problemas.push(`${w} ${n}: fora da tela ${r.fora.join(' | ')}`);
      if (w === 1440) {
        if (r.falta.length) problemas.push(`${n}: [FALTA] visível ${r.falta.join(' | ')}`);
        if (r.travessao.length) problemas.push(`${n}: travessão ${r.travessao.join(' | ')}`);
        if (r.lorem) problemas.push(`${n}: lorem ipsum`);
        r.whats.forEach(x => whats.add(x)); r.emails.forEach(x => emails.add(x));
        r.internos.filter(x => x.startsWith(base)).forEach(x => linksInternos.add(x)); r.ancoras.forEach(x => ancorasRuins.add(n + ' ' + x));
      }
      if (w === 390 || w === 1440) await pg.screenshot({ path: path.join(saida, `${n.replace(/[\/()]/g, '_')}-${w}.png`), fullPage: true });
      } catch (e) { problemas.push(`${w} ${u}: conferência interrompida (${String(e.message).split(/\r?\n/)[0]})`); }
    }
    await pg.close();
  }

  // 3. Links internos e páginas que precisam estar fora
  for (const u of linksInternos) {
    const st = await status(p0, u);
    if (st === 0 || st >= 400) problemas.push(`link interno quebrado: ${u} (${st || 'sem resposta'})`);
  }
  ancorasRuins.forEach(a => problemas.push(`âncora sem alvo: ${a}`));
  for (const f of fora) {
    const st = await status(p0, base + f);
    if (st && st < 400) problemas.push(`deveria estar FORA do ar e responde ${st}: ${base + f}`);
    else console.log(`fora do ar, ok (${st}): ${f}`);
  }
  await br.close();

  console.log('\nWhatsApp nos links (bater com o Hounder):', [...whats].join(', ') || 'nenhum');
  console.log('E-mails nos links:', [...emails].join(', ') || 'nenhum');
  console.log(`\nProblemas (${problemas.length}):`);
  [...new Set(problemas)].forEach(p => console.log(' - ' + p));
  console.log(`\nPrints em ${path.resolve(saida)}. Olhar cada seção nos prints; o script não vê sobreposição nem gosto.`);
  console.log('Lembrete do checklist: miniaturas, og:image e capas que mostram a página foram refeitas depois da última mudança?');
  process.exit(problemas.length ? 2 : 0);
})();
