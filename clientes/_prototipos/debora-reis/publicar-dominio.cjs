// Gera a versão de produção do site da Débora (deborareisarquitetura.com.br) a partir de site/.
// Uso (da raiz HorusOS): node clientes/_prototipos/debora-reis/publicar-dominio.cjs <pasta-de-saida>
// O que muda em relação ao esboço (07/11/2026):
// - abre ao Google: tira o noindex, põe canonical, og:url, og:image absoluto, url no ld+json, robots.txt e sitemap.xml;
// - tira o que é peça de venda: a sala de ideias, o guia do cliente (simulação, ainda não confirmado por ela),
//   o selo "Prévia feita para a Débora" e os links para essas páginas;
// - no modo revista, some o que ainda era "Demonstração" (aparece só o que ela contou);
// - tira os comentários internos do HTML e do CSS.
// Cada troca é conferida: se o padrão não existir mais no HTML, o script para com erro em vez de publicar errado.
const fs = require('fs');
const path = require('path');

const DOMINIO = 'https://deborareisarquitetura.com.br';
const ORIGEM = path.join(__dirname, 'site');
const SAIDA = path.resolve(process.argv[2] || '');
if (!process.argv[2]) { console.error('Informe a pasta de saída.'); process.exit(1); }

const PAGINAS = ['index.html', 'projetos.html', 'projeto-rio-vermelho.html', 'projeto-paralela.html', 'projeto-graca.html',
  'projeto-alto-do-parque.html', 'projeto-itaigara.html', 'conte-sua-casa.html'];
const FORA = new Set(['ideias.html', 'guia.html', 'guia-do-cliente-debora-reis.pdf']);
const FORMULARIO_NO_AR = false; // 12/11: esperando a Débora aprovar o formulário (ver a troca mais abaixo)
const FORA_ASSETS = new Set(['previas', 'qr-whatsapp-guia.svg', 'qr-avaliacao.svg',
  ...(FORMULARIO_NO_AR ? [] : ['comecar.js', 'comecar.css'])]);

function trocar(txt, de, para, pagina, minimo = 1) {
  const n = (txt.match(de) || []).length;
  if (n < minimo) throw new Error(`${pagina}: padrão não encontrado: ${de}`);
  return txt.replace(de, para);
}

// limpa e recria a saída, preservando a pasta .netlify (ligação com o site na Netlify)
fs.mkdirSync(SAIDA, { recursive: true });
for (const item of fs.readdirSync(SAIDA)) if (item !== '.netlify') fs.rmSync(path.join(SAIDA, item), { recursive: true, force: true });

function copiar(de, para) {
  const st = fs.statSync(de);
  if (st.isDirectory()) {
    fs.mkdirSync(para, { recursive: true });
    for (const f of fs.readdirSync(de)) {
      if (path.basename(de) === 'assets' && FORA_ASSETS.has(f)) continue;
      copiar(path.join(de, f), path.join(para, f));
    }
  } else fs.copyFileSync(de, para);
}
for (const f of fs.readdirSync(ORIGEM)) if (!FORA.has(f)) copiar(path.join(ORIGEM, f), path.join(SAIDA, f));

for (const pg of PAGINAS) {
  const arq = path.join(SAIDA, pg);
  let h = fs.readFileSync(arq, 'utf8');
  const url = pg === 'index.html' ? `${DOMINIO}/` : `${DOMINIO}/${pg}`;

  h = trocar(h, /<meta name="robots" content="noindex, nofollow">/, `<link rel="canonical" href="${url}">\n<meta property="og:url" content="${url}">`, pg);
  h = h.replace(/<meta property="og:image" content="(?!https?:)([^"]+)">/g, `<meta property="og:image" content="${DOMINIO}/$1">`);
  h = h.replace(/\n?<a class="previa" href="ideias\.html">.*?<\/a>/g, '');
  h = h.replace(/<!--[\s\S]*?-->/g, '');

  // 12/11 (Marcelo): o formulário "Começar meu projeto" espera a Débora dizer o que acha. Até lá, no domínio os botões
  // abrem o WhatsApp direto. Quando ela aprovar, trocar para true e publicar de novo.
  if (!FORMULARIO_NO_AR) {
    h = h.replace(/\n?<script src="assets\/comecar\.js" defer><\/script>/, ''); // o questionário não carrega o formulário
    if (pg === 'index.html') {
      h = trocar(h, /Responda quatro perguntas rápidas e a sua mensagem chega pronta, com o que ela precisa saber da sua casa\./,
        'Se puder, conte o bairro, o tipo e o tamanho do imóvel e quais ambientes você gostaria de transformar.', pg);
    }
  }

  if (pg === 'index.html') {
    // 07/11: o botão e o link do guia do cliente saíram também do esboço; a checagem final continua barrando qualquer link para guia.html
    h = trocar(h, /"@type": "ProfessionalService", /, `"@type": "ProfessionalService", "url": "${DOMINIO}/", "image": "${DOMINIO}/assets/fotos/alma-brasileira.jpg", `, pg);
  }
  if (pg === 'conte-sua-casa.html') {
    h = trocar(h, /<nav class="acoes" style="gap:24px" aria-label="Demonstração"><a class="voltar" href="ideias\.html">Todas as ideias<\/a>/, '<nav class="acoes" style="gap:24px" aria-label="Navegação">', pg);
    h = trocar(h, /\s*<a class="link" href="guia\.html#etapas">[^<]*<\/a>/, '', pg);
    h = trocar(h, /aria-label="Simulação: a mensagem chegando no WhatsApp da Débora"/, 'aria-label="A mensagem chegando no WhatsApp da Débora"', pg);
  }
  if (pg === 'projetos.html') {
    h = h.replace(/<div><dt>[^<]*<\/dt><dd><span class="demo"[^>]*><b>Demonstração<\/b>[^<]*<\/span><\/dd><\/div>/g, '');
    h = h.replace(/<p class="revista-sem"><span class="demo"[^>]*><b>Demonstração<\/b>[^<]*<\/span><\/p>/g, '');
    h = h.replace(/<dl><\/dl>/g, '');
  }

  // nada de peça de venda pode sobrar numa página pública
  for (const proibido of [/href="(ideias|guia)\.html/, /noindex/, /Demonstração/, /Simulação/, /class="demo"/]) {
    if (proibido.test(h)) throw new Error(`${pg}: sobrou ${proibido}`);
  }
  fs.writeFileSync(arq, h);
}

// comentários internos do CSS (as anotações de revisão não vão pro ar)
for (const css of fs.readdirSync(path.join(SAIDA, 'assets')).filter(f => f.endsWith('.css'))) {
  const arq = path.join(SAIDA, 'assets', css);
  fs.writeFileSync(arq, fs.readFileSync(arq, 'utf8').replace(/\/\*[\s\S]*?\*\//g, ''));
}

const hoje = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(SAIDA, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${DOMINIO}/sitemap.xml\n`);
fs.writeFileSync(path.join(SAIDA, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  PAGINAS.map(pg => `  <url><loc>${pg === 'index.html' ? DOMINIO + '/' : DOMINIO + '/' + pg}</loc><lastmod>${hoje}</lastmod></url>`).join('\n') +
  `\n</urlset>\n`);

// arquivos que só existem na produção (verificação do Search Console, 07/11): ficam em producao-extra/
const EXTRA = path.join(__dirname, 'producao-extra');
const extras = fs.existsSync(EXTRA) ? fs.readdirSync(EXTRA) : [];
for (const f of extras) fs.copyFileSync(path.join(EXTRA, f), path.join(SAIDA, f));

console.log(`Produção gerada em ${SAIDA}: ${PAGINAS.length} páginas, robots.txt, sitemap.xml e ${extras.length} extra(s).`);
