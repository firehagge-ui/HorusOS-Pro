// Renderiza os slides de um post em PNG 1080x1440 (3:4).
// Uso (da raiz do repositório):
//   node marketing/conteudo/fixados-horus-2026-09-27/render.cjs post-1        -> todos os slides
//   node marketing/conteudo/fixados-horus-2026-09-27/render.cjs post-1 1      -> só o slide 1
// Confere a fonte: se DM Sans ou JetBrains Mono não carregarem, para com erro (fallback é veto).
const path = require('path');
const { createRequire } = require('module');
const { chromium } = createRequire(path.resolve('package.json'))('playwright');

(async () => {
  const [post, so] = process.argv.slice(2);
  if (!post) throw new Error('Informe a pasta do post, ex.: post-1');
  const pasta = path.join(__dirname, post);
  const navegador = await chromium.launch();
  const pagina = await navegador.newPage({ viewport: { width: 1080, height: 1440 }, deviceScaleFactor: 1 });
  await pagina.goto('file://' + path.join(pasta, 'carrossel.html'));
  await pagina.evaluate(() => document.fonts.ready);
  // Conta as faces que de fato carregaram (o navegador só baixa o peso que a página usa).
  const fontes = await pagina.evaluate(() => ['DM Sans', 'JetBrains Mono'].map((f) =>
    [f, [...document.fonts].some((face) => face.family.replace(/"/g, '') === f && face.status === 'loaded')]));
  const faltou = fontes.filter(([, ok]) => !ok).map(([f]) => f);
  if (faltou.length) throw new Error(`Fonte não carregou (fallback): ${faltou.join(', ')}`);
  const slides = await pagina.$$('.slide');
  for (let i = 0; i < slides.length; i++) {
    if (so && Number(so) !== i + 1) continue;
    const saida = path.join(pasta, 'instagram', `slide-${String(i + 1).padStart(2, '0')}.png`);
    await slides[i].screenshot({ path: saida });
    const caixa = await slides[i].boundingBox();
    // estouro: algum filho passa da borda do slide?
    const estouro = await slides[i].evaluate((s) => {
      const r = s.getBoundingClientRect();
      return [...s.querySelectorAll('h1,h2,p,.busca,.item,.botao,.rodape')].filter((e) => { const b = e.getBoundingClientRect(); return b.bottom > r.bottom - 40 || b.right > r.right - 40; }).length;
    });
    console.log(`${path.relative(process.cwd(), saida)}  ${caixa.width}x${caixa.height}${estouro ? `  ⚠ ${estouro} elemento(s) encostando na borda` : ''}`);
  }
  await navegador.close();
})().catch((e) => { console.error('Erro:', e.message); process.exit(1); });
