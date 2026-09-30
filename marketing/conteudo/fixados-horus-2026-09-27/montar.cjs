// Monta post-N/carrossel.html juntando a folha de estilo do molde (post-1, que é a
// identidade travada da Horus no Instagram) com o corpo do post (post-N/corpo.html).
// Uso: node marketing/conteudo/fixados-horus-2026-09-27/montar.cjs post-2 "Título da página"
const fs = require('fs');
const path = require('path');
const [post, titulo = 'Horus'] = process.argv.slice(2);
const molde = fs.readFileSync(path.join(__dirname, 'post-1', 'carrossel.html'), 'utf8');
const cabeca = molde.slice(0, molde.indexOf('</head>') + '</head>'.length).replace(/<title>.*?<\/title>/, `<title>${titulo}</title>`);
const corpo = fs.readFileSync(path.join(__dirname, post, 'corpo.html'), 'utf8');
fs.mkdirSync(path.join(__dirname, post, 'instagram'), { recursive: true });
fs.writeFileSync(path.join(__dirname, post, 'carrossel.html'), `${cabeca}\n<body>\n\n${corpo}\n</body>\n</html>\n`);
console.log(`${post}/carrossel.html montado`);
