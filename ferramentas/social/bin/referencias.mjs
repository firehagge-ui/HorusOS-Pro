// Estudo de perfis de referência do Instagram pelo Playwright, sem login (regra do Marcelo, 23/10/2026: Instagram se vê
// pelo Playwright). Serve à pauta e ao passo de direção de arte da /carrossel: achar o post que fugiu da média e baixar
// os slides pra olhar a organização, o layout e a densidade de texto antes de montar o nosso.
//
//   node ferramentas/social/bin/referencias.mjs perfil <handle>                 os 12 posts recentes, com curtidas e outliers
//   node ferramentas/social/bin/referencias.mjs post <codigo> <pasta>           baixa os slides (embed) + legenda + folha.jpg
//   node ferramentas/social/bin/referencias.mjs estudar <handle> <pasta> [N]   perfil + baixa os N carrosséis mais curtidos (padrão 2)
//
// Limites (testados em 23/10/2026): sem login o perfil mostra só os 12 posts mais recentes; curtidas e comentários vêm da
// página do post; o embed entrega a imagem de cada slide. Perfil privado ou com embed bloqueado: anotar e seguir.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { RAIZ_REPO } from '../lib/marca.mjs';

const { chromium } = createRequire(path.join(RAIZ_REPO, 'package.json'))('playwright');
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const numero = (s = '') => Number(String(s).replace(/[.,]/g, '').replace(/k$/i, '000')) || 0;

async function navegador() {
  const b = await chromium.launch({ headless: true });
  const ctx = await b.newContext({ locale: 'pt-BR', viewport: { width: 1280, height: 900 } });
  return { b, ctx };
}

/** Lê os posts recentes do perfil (código, tipo, nº de slides, data) e, de cada um, curtidas e comentários. */
async function perfil(ctx, handle) {
  const p = await ctx.newPage();
  await p.goto(`https://www.instagram.com/${handle}/`, { waitUntil: 'domcontentloaded' });
  await espera(6000);
  const og = await p.$eval('meta[property="og:description"]', (m) => m.content).catch(() => '');
  const html = await p.content();
  await p.close();
  const posts = [];
  for (const m of html.matchAll(/"code":"([A-Za-z0-9_-]{8,})"/g)) {
    if (posts.some((x) => x.codigo === m[1])) continue;
    // A janela vai até o próximo post, pra o tipo de um não vazar pro outro.
    const resto = html.slice(m.index + 10);
    const fim = resto.search(/"code":"[A-Za-z0-9_-]{8,}"/);
    const janela = html.slice(m.index, m.index + 10 + (fim < 0 ? 6000 : Math.min(fim, 12000)));
    const tipo = /"product_type":"clips"/.test(janela) ? 'reel' : /"carousel_media_count":(\d+)/.test(janela) ? 'carrossel' : 'foto';
    posts.push({ codigo: m[1], tipo, slides: Number((janela.match(/"carousel_media_count":(\d+)/) || [])[1]) || 1 });
  }
  for (const post of posts.slice(0, 12)) {
    const q = await ctx.newPage();
    await q.goto(`https://www.instagram.com/p/${post.codigo}/`, { waitUntil: 'domcontentloaded' }).catch(() => {});
    await espera(2000);
    const d = await q.$eval('meta[property="og:description"]', (m) => m.content).catch(() => '');
    const pg = await q.content().catch(() => '');
    await q.close();
    post.curtidas = Number((pg.match(/"like_count":(\d+)/) || [])[1]) || numero((d.match(/^([\d.,kK]+)\s+(likes|curtidas)/) || [])[1]);
    post.comentarios = Number((pg.match(/"comment_count":(\d+)/) || [])[1]) || numero((d.match(/([\d.,kK]+)\s+(comments|comentários)/) || [])[1]);
    post.data = (d.match(/(?:on|em|no)\s+([A-Z][a-z]+ \d{1,2}, \d{4})/) || [])[1] || '';
    post.legenda = (d.split(/:\s*"/)[1] || '').replace(/"\.?\s*$/, '').slice(0, 140);
  }
  const lista = posts.slice(0, 12);
  const engaj = lista.map((x) => x.curtidas + x.comentarios).sort((a, b) => a - b);
  const mediana = engaj.length ? engaj[Math.floor(engaj.length / 2)] : 0;
  for (const x of lista) x.outlier = mediana > 0 && x.curtidas + x.comentarios >= 2 * mediana;
  return { handle, resumo: og.split(' - ')[0], mediana, posts: lista };
}

/** Baixa os slides de um post pelo embed (sem login), a legenda e monta folha.jpg. */
async function post(ctx, codigo, pasta) {
  fs.mkdirSync(pasta, { recursive: true });
  const p = await ctx.newPage();
  await p.goto(`https://www.instagram.com/p/${codigo}/embed/captioned/`, { waitUntil: 'domcontentloaded' });
  await espera(3500);
  const vistos = [];
  for (let i = 0; i < 20; i++) {
    const src = await p.evaluate(() => {
      const imgs = [...document.querySelectorAll('img')].filter((im) => im.naturalWidth > 300 && im.getBoundingClientRect().width > 200
        && im.getBoundingClientRect().left >= 0 && im.getBoundingClientRect().left < window.innerWidth);
      const im = imgs[0];
      if (!im) return null;
      const melhor = (im.srcset || '').split(',').map((s) => s.trim().split(' ')).sort((a, b) => parseInt(b[1]) - parseInt(a[1]))[0];
      return (melhor && melhor[0]) || im.src;
    });
    if (src && !vistos.includes(src)) vistos.push(src);
    const prox = await p.$('[aria-label="Next"], [aria-label="Avançar"], [aria-label="Próximo"]');
    if (!prox) break;
    await prox.click().catch(() => {});
    await espera(900);
  }
  const legenda = await p.$eval('.Caption', (e) => e.innerText).catch(() => '');
  for (const [i, src] of vistos.entries()) {
    const r = await ctx.request.get(src);
    const nome = path.join(pasta, `slide-${String(i + 1).padStart(2, '0')}`);
    // O Instagram serve WebP com cara de .jpg em parte das contas: converte pra JPEG de verdade.
    if (/webp/.test(r.headers()['content-type'] || '')) {
      fs.writeFileSync(`${nome}.webp`, await r.body());
      try {
        execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', `${nome}.webp`, '-q:v', '2', `${nome}.jpg`]);
        fs.unlinkSync(`${nome}.webp`);
      } catch { /* sem ffmpeg: fica o .webp */ }
    } else fs.writeFileSync(`${nome}.jpg`, await r.body());
  }
  fs.writeFileSync(path.join(pasta, 'legenda.txt'), legenda);
  await p.close();
  if (vistos.length) {
    // Miniatura de cada slide primeiro: slide com 1 px de diferença (1440 x 1441) reinicia o filtro e a folha sai em branco.
    const col = Math.min(vistos.length, 5);
    const mini = path.join(pasta, '.mini');
    try {
      fs.mkdirSync(mini, { recursive: true });
      for (let i = 1; i <= vistos.length; i++) {
        const n = String(i).padStart(2, '0');
        execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', path.join(pasta, `slide-${n}.jpg`), '-vf',
          'scale=360:480:force_original_aspect_ratio=decrease,pad=360:480:(ow-iw)/2:(oh-ih)/2:white', path.join(mini, `m-${n}.png`)]);
      }
      execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', path.join(mini, 'm-%02d.png'), '-vf',
        `tile=${col}x${Math.ceil(vistos.length / col)}:padding=8:color=white`, '-frames:v', '1', path.join(pasta, 'folha.jpg')]);
    } catch { /* sem ffmpeg: os slides já estão salvos */ }
    fs.rmSync(mini, { recursive: true, force: true });
  }
  return { codigo, slides: vistos.length, pasta };
}

const [cmd, a, b, c] = process.argv.slice(2);
if (!['perfil', 'post', 'estudar'].includes(cmd)) {
  console.log('Uso: referencias.mjs perfil <handle> | post <codigo> <pasta> | estudar <handle> <pasta> [N]');
  process.exit(1);
}
const { b: nav, ctx } = await navegador();
try {
  if (cmd === 'perfil') console.log(JSON.stringify(await perfil(ctx, a), null, 2));
  if (cmd === 'post') console.log(JSON.stringify(await post(ctx, a, path.resolve(b))));
  if (cmd === 'estudar') {
    const r = await perfil(ctx, a);
    fs.mkdirSync(path.resolve(b), { recursive: true });
    fs.writeFileSync(path.join(path.resolve(b), `${a}.json`), JSON.stringify(r, null, 2));
    const top = r.posts.filter((x) => x.tipo === 'carrossel').sort((x, y) => (y.curtidas + y.comentarios) - (x.curtidas + x.comentarios)).slice(0, Number(c) || 2);
    for (const t of top) t.baixado = await post(ctx, t.codigo, path.join(path.resolve(b), `${a}-${t.codigo}`));
    console.log(JSON.stringify({ handle: a, resumo: r.resumo, mediana: r.mediana,
      posts: r.posts.map((x) => `${x.tipo.padEnd(9)} ${String(x.curtidas).padStart(7)} ♥ ${String(x.comentarios).padStart(5)} 💬 ${x.outlier ? 'OUTLIER ' : ''}${x.codigo} ${x.legenda.slice(0, 70)}`),
      baixados: top.map((t) => t.baixado) }, null, 2));
  }
} finally {
  await nav.close();
}
