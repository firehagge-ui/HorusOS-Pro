/**
 * Monta a pasta que vai ao ar (site/_publish) a partir de site/.
 *
 * ⚠️ A LÓGICA É DE ALLOWLIST, e isso é de propósito.
 *
 * A pasta `site/` guarda, lado a lado, o que é público (index.html, assets) e o
 * que é interno (CLAUDE.md com as travas de publicação e o histórico de decisão,
 * PLANO.md, e 34 MB de arte-fonte em site-fontes/). Se este script copiasse tudo
 * menos uma lista de proibidos, cada arquivo novo entraria no ar por omissão —
 * e um dia alguém salvaria um rascunho ali sem perceber que estava publicando.
 *
 * Aqui o padrão é o contrário: só vai ao ar o que está escrito em RAIZ_PUBLICA
 * abaixo. Arquivo novo não entra até alguém adicioná-lo à mão.
 *
 * Rodar:  node site/build-deploy.mjs
 * A Netlify roda isso sozinha (netlify.toml). Localmente serve para conferir o
 * resultado antes de subir, ou para arrastar a pasta no painel da Netlify.
 */

import { cp, rm, mkdir, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = dirname(fileURLToPath(import.meta.url));
const SAIDA = join(SITE, '_publish');

/** Tudo que pode ir ao ar. O que não está aqui, não sobe. */
const RAIZ_PUBLICA = [
  'index.html',
  '404.html',
  'robots.txt',
  'sitemap.xml',
  'assets',
];

/**
 * Assets que existem no repositório mas que nenhuma linha do HTML ou do CSS
 * aponta. Ficaram de rodadas anteriores (a arte 3D que saiu do hero, os mocks
 * de serviço que viraram CSS ao vivo). Não são lixo — podem voltar —, então
 * continuam versionados; só não há razão para servi-los a cada visita.
 * Conferido em 01/09/2026 varrendo index.html e site.css.
 */
const ASSETS_ORFAOS = new Set([
  'assinatura.webp',
  'forma.webp',
  'servicos/sv-1.webp',
  'servicos/sv-2.webp',
  'servicos/sv-3.webp',
  'servicos/sv-4.webp',
  'servicos/sv-5.webp',
  'servicos/sv-6.webp',
]);

const kb = (b) => (b / 1024).toFixed(0) + ' KB';

async function pesar(dir) {
  let total = 0, arquivos = 0;
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, item.name);
    if (item.isDirectory()) {
      const sub = await pesar(p);
      total += sub.total; arquivos += sub.arquivos;
    } else {
      total += (await stat(p)).size; arquivos++;
    }
  }
  return { total, arquivos };
}

async function main() {
  // No Windows, apagar a pasta falha com EBUSY se qualquer processo estiver com
  // ela aberta — tipicamente um servidor local de conferência ainda no ar. O erro
  // cru não diz isso, então vale traduzir em vez de deixar o próximo se perder.
  try {
    await rm(SAIDA, { recursive: true, force: true });
  } catch (e) {
    if (e.code === 'EBUSY' || e.code === 'EPERM') {
      console.error(`
  ✗ Não deu para limpar site/_publish: alguma coisa está usando a pasta.`);
      console.error(`    Costuma ser um servidor local ainda rodando, ou a pasta aberta no Explorer.`);
      console.error(`    Feche e rode de novo.
`);
      process.exit(1);
    }
    throw e;
  }
  await mkdir(SAIDA, { recursive: true });

  let copiados = 0;
  const pulados = [];

  for (const nome of RAIZ_PUBLICA) {
    const origem = join(SITE, nome);
    if (!existsSync(origem)) {
      console.error(`  ✗ FALTA: ${nome} — está na lista pública mas não existe em site/`);
      process.exitCode = 1;
      continue;
    }
    await cp(origem, join(SAIDA, nome), {
      recursive: true,
      filter: (src) => {
        const rel = relative(join(SITE, 'assets'), src).split(sep).join('/');
        if (ASSETS_ORFAOS.has(rel)) { pulados.push('assets/' + rel); return false; }
        return true;
      },
    });
    copiados++;
  }

  const { total, arquivos } = await pesar(SAIDA);

  console.log(`\n  Hórus — publish montado em site/_publish`);
  console.log(`  ${copiados}/${RAIZ_PUBLICA.length} entradas · ${arquivos} arquivos · ${kb(total)}`);
  if (pulados.length) console.log(`  ${pulados.length} assets órfãos deixados de fora: ${pulados.join(', ')}`);
  console.log(`  Fora do ar por não estarem na lista: CLAUDE.md, PLANO.md, site-fontes/, build-deploy.mjs\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
