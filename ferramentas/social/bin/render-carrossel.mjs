// Renderiza marketing/.../<pasta>/carrossel.html em instagram/slide-NN.png + .jpg (q92) e previa.json
// (miniaturas a 0,25 pro painel), e avisa fonte que não carregou, imagem quebrada e texto na borda.
// Uso: node ferramentas/social/bin/render-carrossel.mjs <pasta-absoluta-do-post>
// Depois: npx --yes impeccable@4.0.4 detect "<pasta>/carrossel.html" e olhar a folha da série.
import { createRequire } from 'module';
import { pathToFileURL } from 'url';
import path from 'path'; import fs from 'fs';
const RAIZ = 'E:/Users/hagge/Downloads/HorusOS';
const { chromium } = createRequire(path.join(RAIZ, 'package.json'))('playwright');
const pasta = process.argv[2];
fs.mkdirSync(path.join(pasta, 'instagram'), { recursive: true });
const nav = await chromium.launch({ args: ['--allow-file-access-from-files'] });
const previa = []; const problemas = [];
for (const escala of [1, 0.25]) {
  const pg = await nav.newPage({ viewport: { width: 1080, height: 1440 }, deviceScaleFactor: escala });
  await pg.goto(pathToFileURL(path.join(pasta, 'carrossel.html')).href, { waitUntil: 'networkidle' });
  await pg.evaluate(() => document.fonts.ready);
  if (escala === 1) {
    const f = await pg.evaluate(() => ['DM Sans', 'Noto Color Emoji'].filter((f) => ![...document.fonts].some((x) => x.family.replace(/"/g, '') === f && x.status === 'loaded')));
    if (f.length) problemas.push('Fonte não carregou: ' + f.join(', '));
    const imgs = await pg.evaluate(() => [...document.images].filter(i => !i.complete || !i.naturalWidth).map(i => i.src));
    if (imgs.length) problemas.push('Imagem quebrada: ' + imgs.join(', '));
  }
  const els = await pg.$$('.slide');
  for (let i = 0; i < els.length; i++) {
    const n = String(i + 1).padStart(2, '0');
    if (escala === 1) {
      await els[i].screenshot({ path: path.join(pasta, 'instagram', `slide-${n}.png`) });
      await els[i].screenshot({ path: path.join(pasta, 'instagram', `slide-${n}.jpg`), type: 'jpeg', quality: 92 });
      const o = await els[i].evaluate((s) => { const r = s.getBoundingClientRect(); return [...s.querySelectorAll('*')].filter(e => { const b = e.getBoundingClientRect(); return b.height && (b.bottom > r.bottom - 30 || b.right > r.right - 20); }).map(e => e.className || e.tagName).slice(0, 4); });
      if (o.length) problemas.push(`Slide ${i + 1} encostando/estourando: ${o.join(', ')}`);
    } else {
      const buf = await els[i].screenshot({ type: 'jpeg', quality: 70 });
      previa.push(`data:image/jpeg;base64,${buf.toString('base64')}`);
    }
  }
  await pg.close();
}
await nav.close();
fs.writeFileSync(path.join(pasta, 'previa.json'), JSON.stringify(previa));
console.log(path.basename(pasta), 'slides:', previa.length, problemas.length ? problemas : 'sem problemas');
