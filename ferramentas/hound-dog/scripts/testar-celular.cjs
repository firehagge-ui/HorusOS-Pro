// Varre cada tela do Hounder num celular de 390 px: estouro lateral, botões pequenos, campos que dão zoom no iPhone, erros de JS.
// Uso: node ferramentas/hound-dog/scripts/testar-celular.cjs [url] [telas,separadas,por,vírgula]. Escritas no banco são interceptadas.
// Prints em %TEMP%/hounder-celular. Conta de teste: qa.claude (senha em .segredos/acessos.txt).
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const OUT = path.join(require('os').tmpdir(), 'hounder-celular'); fs.mkdirSync(OUT, { recursive: true });
const BASE = process.argv[2] || 'https://hound-dog-omega.vercel.app';
const SO = process.argv[3] ? process.argv[3].split(',') : null;
const senha = (fs.readFileSync(path.join(__dirname, '..', '.segredos', 'acessos.txt'), 'utf8').split(/\r?\n/).filter((l) => l.includes('qa.claude')).pop().match(/senha=(\S+)/) || [])[1];
const TELAS = ['inicio','tarefas','agentes','encontrar','mercado','esteira','conversas','disparos','agenda','clientes','instagram','relatorios','claude','ajustes'];
(async () => {
  const b = await chromium.launch({ headless: true, channel: 'chrome' });
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'pt-BR' });
  const p = await c.newPage();
  const erros = []; p.on('pageerror', (e) => erros.push(String(e).slice(0, 200)));
  await p.route('**/rest/v1/**', async (r) => { const q = r.request(); if (!['GET','HEAD'].includes(q.method()) && !q.url().includes('/rpc/')) return r.fulfill({ status: 201, contentType: 'application/json', body: '{}' }); return r.continue(); });
  await p.goto(BASE + '/', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(1500);
  if (await p.$('#lg-email')) { await p.screenshot({ path: path.join(OUT, '00-login.png') }); await p.fill('#lg-email', 'qa.claude@hounddog.dev'); await p.fill('#lg-senha', senha); await p.keyboard.press('Enter'); await p.waitForTimeout(4000); }
  const extra = (process.argv[4] || '').split(',').filter(Boolean);
  for (const t of [...(SO || TELAS), ...extra]) {
    erros.length = 0;
    await p.goto(`${BASE}/#/${t}`); await p.waitForTimeout(3500);
    const m = await p.evaluate(() => {
      const W = innerWidth; const largos = [];
      for (const e of document.querySelectorAll('body *')) {
        const r = e.getBoundingClientRect(); if (!r.width || !r.height) continue;
        const st = getComputedStyle(e); if (st.position === 'fixed' && e.closest('.side')) continue;
        if (r.right > W + 1 && !e.closest('[style*="overflow"], .tabela-wrap, .semana, .colunas, .ajustes-nav, .chips, .mz-table-wrap')) {
          let a = e.parentElement, rola = false; while (a) { const s = getComputedStyle(a); if (/(auto|scroll|hidden)/.test(s.overflowX)) { rola = true; break; } a = a.parentElement; }
          if (!rola) largos.push(`${e.tagName.toLowerCase()}.${[...e.classList].slice(0,2).join('.')} ${Math.round(r.right)}`);
        }
      }
      const pequenos = [...document.querySelectorAll('.vista button, .vista a.btn, .topo button')].filter((e) => { const r = e.getBoundingClientRect(); return r.width && r.height && (r.height < 32 || r.width < 32); }).length;
      const fontes = [...document.querySelectorAll('.vista *')].filter((e) => e.childNodes.length && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && parseFloat(getComputedStyle(e).fontSize) < 12).length;
      return { sw: document.documentElement.scrollWidth, W, largos: [...new Set(largos)].slice(0, 8), pequenos, fontes, inputs: [...document.querySelectorAll('input:not([type=checkbox]):not([type=radio]):not([type=range]),select,textarea')].filter(e=>e.offsetParent && parseFloat(getComputedStyle(e).fontSize)<16).length };
    });
    const nome = t.replace(/[\/?=]/g, '_');
    await p.screenshot({ path: path.join(OUT, `${nome}.png`), fullPage: process.env.FULL === '1' });
    console.log(`${t}: largura ${m.sw}/${m.W} | estouram: ${m.largos.join('; ') || '-'} | botões <32px: ${m.pequenos} | texto <12px: ${m.fontes} | campos <16px (zoom no iPhone): ${m.inputs}${erros.length ? ' | ERRO ' + erros.join(' / ') : ''}`);
  }
  await b.close();
})();
