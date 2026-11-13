// Gera as páginas de projeto da Débora (site/projeto-*.html) no modelo das páginas de projeto da Tarq (07/11/2026).
// Uso (da raiz HorusOS): node clientes/_prototipos/debora-reis/gerar-projetos.cjs
// Cada projeto é só dado: foto de abertura, resumo, faixa, visão geral e blocos (título opcional, fotos e um parágrafo).
// Regra de integridade: texto só com o que a Débora escreveu (legendas do Instagram, site antigo) ou com o que a foto
// mostra. Nada de prazo, metragem, ano, quem mora ou pedido do cliente que ela não contou.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const SITE = path.join(__dirname, 'site');
const ZAP = 'https://wa.me/5571999775453?text=Ol%C3%A1%2C%20D%C3%A9bora!%20Vim%20pelo%20seu%20site%20e%20quero%20conversar%20sobre%20um%20projeto.';

// tamanho real de cada foto, lido do arquivo (width/height no HTML e proporção de cada bloco)
const medidas = JSON.parse(execFileSync('python', ['-c', `
import json,glob,os
from PIL import Image
print(json.dumps({os.path.basename(f): Image.open(f).size for f in glob.glob(${JSON.stringify(path.join(SITE, 'assets/fotos/*.jpg'))})}))
`]).toString());
const tam = f => { const m = medidas[f]; if (!m) throw new Error('foto não encontrada: ' + f); return m; };
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

const PROJETOS = [
  {
    slug: 'rio-vermelho', nome: 'Apartamento Rio Vermelho', ancora: 'rio-vermelho',
    capa: ['rio-vermelho-g.jpg', 'O corredor do apartamento: paredes verdes, piso claro, estante embutida, painel de ripas, tampo de madeira com plantas e o aparador vermelho ao fundo'],
    posicao: '50% 55%',
    resumo: 'No Rio Vermelho, em Salvador, a reforma deu ao apartamento piso novo, cores novas, marcenaria sob medida e uma iluminação toda refeita.',
    faixa: ['Rio Vermelho, Salvador', 'Reforma residencial', 'Projeto de interiores'],
    descricao: 'Reforma de apartamento no Rio Vermelho, em Salvador: piso, pintura, marcenaria sob medida e iluminação nova. Projeto de Débora Reis.',
    dados: [
      ['Visão geral', 'A reforma renovou o apartamento por inteiro. O piso existente foi trocado, as paredes ganharam novas cores e a marcenaria foi desenhada para atender às necessidades das moradoras. A iluminação também foi toda nova.'],
      ['Intervenções', 'Piso, pintura, marcenaria e iluminação'],
      ['Fotografia', 'Roberto Moreira Rego'],
    ],
    blocos: [
      { titulo: 'Materiais', altura: 340, fotos: [
        ['rvt-piso.jpg', 'O piso claro e contínuo do corredor, com o rodapé branco e a base da parede verde'],
        ['rvt-madeira.jpg', 'O tampo de madeira da marcenaria com uma pedra lilás e os vasos de barro'],
        ['rvt-macrame.jpg', 'O macramê de três folhas, em cru, caramelo e terracota, na parede verde']],
        texto: 'Os materiais seguem uma mesma linguagem. O piso claro e contínuo deixa as cores em primeiro plano, a madeira do tampo e da marcenaria aquece o corredor, e as fibras do macramê, o barro dos vasos e a pedra sobre o tampo trazem textura.' },
      { altura: 600, fotos: [
        ['rv2-marcenaria.jpg', 'A estante embutida, o painel de ripas verdes e o tampo de madeira com duas plantas em vasos de barro'],
        ['rv2-esquerda.jpg', 'O lado esquerdo do corredor: o aparador vermelho com o macramê de folhas, a porta e as paredes verdes']],
        texto: 'A estante embutida, o painel de ripas e o tampo de madeira formam uma única peça, feita para as medidas do corredor. O painel repete o verde das paredes e integra a marcenaria à arquitetura.', textoEmbaixo: true },
      { titulo: 'Conceito', inv: true, altura: 230, fotos: [
        ['rvt-objetos.jpg', 'Sobre o aparador: um Buda branco, um elefantinho de madeira, um vaso de barro com planta e um cristal'],
        ['rv-painel.jpg', 'O painel bordado com bichos em laranja e vermelho, numa moldura de madeira']],
        texto: 'Para a Débora, projetar é encontrar o equilíbrio entre beleza e personalidade. Neste apartamento, o verde das paredes dá a base e o vermelho aparece sem pedir licença, num ponto só. Os objetos de decoração e o painel bordado completam a composição.' },
      { altura: 680, fotos: [
        ['vermelho.jpg', 'O aparador vermelho no fim do corredor, com o macramê de folhas, um Buda, um vaso e um cristal']],
        texto: 'No fim do corredor, o aparador vermelho emoldurado em madeira recebe o macramê, o vaso e os objetos. É o único ponto de vermelho do apartamento, e o verde das paredes o sustenta.' },
      { titulo: 'Iluminação', inv: true, altura: 440, fotos: [
        ['rv2-luz.jpg', 'Os pontos de luz embutidos no forro, acompanhando a estante']],
        texto: 'Lâmpadas com temperatura de cor mais baixa criam uma atmosfera mais intimista e valorizam os itens de decoração. Os pontos embutidos no forro acompanham a estante ao longo de todo o corredor.' },
    ],
  },
  {
    slug: 'paralela', nome: 'Apartamento Paralela', ancora: 'paralela',
    capa: ['sala-vermelha.jpg', 'A sala integrada: mesa redonda vermelha com rosas, cadeiras estampadas, sofá claro, poltrona e a fachada de vidro'],
    posicao: '50% 50%',
    resumo: 'Na Paralela, em Salvador, o estar e o jantar dividem uma mesma sala aberta para a fachada de vidro, com luz indireta no teto e uma mesa redonda vermelha.',
    faixa: ['Paralela, Salvador', 'Reforma residencial', 'Projeto de interiores'],
    descricao: 'Apartamento na Paralela, em Salvador: estar e jantar integrados, mesa redonda vermelha e luz indireta no teto. Projeto de Débora Reis.',
    dados: [
      ['Visão geral', 'O estar e o jantar dividem um mesmo espaço, voltado para a fachada de vidro de ponta a ponta. A mesa redonda vermelha marca o jantar, e o estar se organiza em torno do sofá, da poltrona e do painel de madeira com a televisão.'],
      ['Ambientes', 'Estar e jantar'],
      ['Fotografia', 'Roberto Moreira Rego'],
    ],
    blocos: [
      { titulo: 'Conceito', altura: 360, fotos: [
        ['par-mesa.jpg', 'O tampo vermelho brilhante da mesa redonda, com a luz refletida']],
        texto: 'Nas palavras da Débora: “Reconstruir, mudar, transformar, colorir. Achar um lugar no mundo para pousar e repousar.” A cor entra pela mesa vermelha, pelo tecido das cadeiras e pelas almofadas, sobre uma base neutra.' },
      { titulo: 'Materiais', inv: true, altura: 300, fotos: [
        ['par-cadeira.jpg', 'O encosto de uma cadeira revestida de tecido em zigue-zague colorido'],
        ['par-poltrona.jpg', 'A poltrona de tecido claro com almofada estampada, diante da cortina']],
        texto: 'O vermelho brilhante da mesa, o zigue-zague das cadeiras e o tecido claro do sofá e da poltrona equilibram a sala. O painel de madeira clara atrás da televisão e o piso claro completam a base.' },
      { titulo: 'Iluminação', altura: 300, fotos: [
        ['par-sanca.jpg', 'O rebaixo circular do teto, com luz embutida e faixa de madeira, sobre a mesa de jantar']],
        texto: 'Um rebaixo circular com luz embutida e acabamento em madeira desenha a área do jantar no teto. No restante da sala, uma faixa de luz indireta acompanha a fachada de vidro.' },
    ],
  },
  {
    slug: 'graca', nome: 'Apartamento Graça', ancora: 'graca',
    capa: ['alma-brasileira.jpg', 'Estante branca com livros e CDs, mesa de madeira e cadeira de diretor'],
    posicao: '50% 72%',
    resumo: 'Na Graça, em Salvador, a marcenaria foi pensada para guardar e mostrar o que as proprietárias colecionam: livros, CDs, cerâmica e artesanato brasileiro.',
    faixa: ['Graça, Salvador', 'Projeto residencial', 'Projeto de interiores'],
    descricao: 'Apartamento na Graça, em Salvador: estante planejada para livros e CDs, prateleiras para o artesanato e marcenaria com nicho azul. Projeto de Débora Reis.',
    dados: [
      ['Visão geral', 'Um apartamento que preserva a história das proprietárias. A estante planejada recebe os livros e os CDs, as prateleiras de madeira expõem o artesanato e a marcenaria ganha um nicho azul.'],
      ['Intervenções', 'Estante planejada, prateleiras para o artesanato e marcenaria com nicho azul'],
      ['Fotografia', 'Roberto Moreira Rego'],
    ],
    blocos: [
      { titulo: 'Conceito', altura: 640, fotos: [
        ['livros.jpg', 'Estante branca planejada para os livros, com armários embaixo']],
        texto: 'Para a Débora, este apartamento é o retrato da alma brasileira: há quem goste de vinil, de CDs, de livros, e há quem valorize e preserve o que é antigo. Uma casa com livros tem alma, e a estante bem planejada valoriza essas histórias.' },
      { titulo: 'Materiais', inv: true, altura: 600, fotos: [
        ['artesanato.jpg', 'Pendente de vidro aceso diante de prateleiras de madeira com cerâmica e quadros'],
        ['azul-madeira.jpg', 'Marcenaria de madeira com nicho azul e um quadro de cavalo-marinho']],
        texto: 'Madeira, cerâmica e peças feitas à mão. O artesanato brasileiro ocupa prateleiras de madeira, sob a luz de um pendente de vidro, e o azul do nicho conversa com a madeira da marcenaria: frio e quente. Para a Débora, o luxo de um interior está em não parecer que foi comprado inteiro de uma vez.' },
    ],
  },
  {
    slug: 'alto-do-parque', nome: 'Apartamento Alto do Parque', ancora: 'alto-do-parque',
    capa: ['alto-parque.jpg', 'Poltrona de madeira e palhinha com almofada estampada diante de um painel de ripas de madeira, luminária de madeira, mesinhas terracota e um vaso de espada-de-são-jorge'],
    posicao: '50% 50%',
    resumo: 'No Alto do Parque, em Salvador, a madeira conduz o estar e o jantar: o painel de ripas, a luminária, a poltrona e as cadeiras de palhinha.',
    faixa: ['Alto do Parque, Salvador', 'Projeto residencial', 'Projeto de interiores'],
    descricao: 'Apartamento no Alto do Parque, em Salvador: estar e jantar em madeira, palhinha e verde. Projeto de Débora Reis.',
    dados: [
      ['Visão geral', 'A sala reúne estar e jantar em tons de madeira e verde. Um painel de ripas de madeira emoldura a poltrona de palhinha, e o jantar ganha mesa redonda, cadeiras de palhinha e uma parede de quadros.'],
      ['Ambientes', 'Estar e jantar'],
      ['Fotografia', 'Roberto Moreira Rego'],
    ],
    blocos: [
      { titulo: 'Materiais', altura: 600, fotos: [
        ['alto-parque-2.jpg', 'A luminária de madeira acesa ao lado da poltrona, diante das ripas'],
        ['alto-parque-3.jpg', 'Mesa redonda de jantar com cadeiras de palhinha, samambaia e quadros na parede']],
        texto: 'Madeira nas ripas, na luminária e na estrutura da poltrona; palhinha no encosto e nas cadeiras do jantar; terracota nas mesinhas de apoio. O verde das plantas e das paredes fecha a paleta.' },
      { titulo: 'O jantar', inv: true, altura: 640, fotos: [
        ['alto-parque-4.jpg', 'O canto do jantar com a parede verde, uma composição de quadros e as cadeiras de palhinha']],
        texto: 'No jantar, a parede verde recebe uma composição de quadros em molduras escuras, e a mesa redonda reúne as cadeiras de palhinha.' },
    ],
  },
  {
    slug: 'itaigara', nome: 'Quarto infantil no Itaigara', ancora: 'itaigara',
    capa: ['itaigara-quarto.jpg', 'Quarto infantil com cama casinha de madeira, bichos de pelúcia, espelho em forma de urso e tapete de leão'],
    posicao: '50% 60%',
    resumo: 'No Itaigara, em Salvador, um quarto e um banheiro pensados para uma criança.',
    faixa: ['Itaigara, Salvador', 'Quarto infantil', 'Projeto de interiores'],
    descricao: 'Quarto e banheiro infantil no Itaigara, em Salvador: cama casinha de madeira, tenda e tapete de leão. Projeto de Débora Reis.',
    dados: [
      ['Visão geral', 'O quarto gira em torno da cama casinha de madeira, baixa e com espaço para brincar no chão. A tenda de tecido, o tapete de leão e o espelho em forma de urso deixam o ambiente lúdico, e a paleta de madeira e branco mantém tudo leve.'],
      ['Ambientes', 'Quarto e banheiro infantil'],
    ],
    blocos: [
      { titulo: 'O quarto', altura: 560, fotos: [
        ['itaigara-quarto-2.jpg', 'O quarto visto da porta: cama casinha sob a janela, tenda de tecido, nichos em forma de casa e tapete de leão']],
        texto: 'Vista da porta, a cama fica sob a janela com persiana, e a tenda de tecido forma um canto só para brincar. Nichos em forma de casa completam a parede.' },
      { titulo: 'O banheiro', inv: true, altura: 560, fotos: [
        ['itaigara-banheiro.jpg', 'Banheiro infantil com banheira branca sob um nicho iluminado e um banquinho de madeira']],
        texto: 'No banheiro, a banheira branca fica sob um nicho iluminado, com revestimento em tom de madeira e um banquinho de apoio.' },
    ],
  },
];

function figura([arq, alt], h) {
  const [w, hh] = tam(arq);
  const r = (w / hh).toFixed(3);
  const deitada = w / hh > 1.15 ? ' deitada' : '';
  return `<figure class="pf${deitada}" style="--r:${r};--w:${w}px"><img src="assets/fotos/${arq}" alt="${esc(alt)}" width="${w}" height="${hh}" loading="lazy"></figure>`;
}

function bloco(b, i, p) {
  const id = `${p.slug}-b${i}`;
  const titulo = b.titulo ? `\n  <h2 id="${id}" class="rvt-titulo">${b.titulo}</h2>` : '';
  const rotulo = b.titulo ? ` aria-labelledby="${id}"` : ' aria-label="Fotos do projeto"';
  const rs = b.fotos.map(([f]) => { const [w, h] = tam(f); return w / h; });
  const sr = rs.reduce((a, r) => a + r, 0);
  const empilha = b.fotos.length > 1 && rs.some(r => r > 1.15) ? ' empilha' : '';
  const classes = ['rvt-bloco', b.inv ? 'rvt-bloco-inv' : '', b.textoEmbaixo ? 'rvt-bloco-embaixo' : ''].filter(Boolean).join(' ');
  return `<section class="${classes}"${rotulo} style="--h:${b.altura}px">${titulo}
  <div class="rvt-fotos${empilha}" style="--sr:${sr.toFixed(3)};--n:${b.fotos.length}">
    ${b.fotos.map(f => figura(f)).join('\n    ')}
  </div>
  <p class="rvt-texto">${b.texto}</p>
</section>`;
}

function pagina(p, prox) {
  const [cw, ch] = tam(p.capa[0]);
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${p.nome} | Débora Reis Arquitetura</title>
<meta name="description" content="${esc(p.descricao)}">
<meta name="robots" content="noindex, nofollow">
<meta property="og:title" content="${p.nome} | Débora Reis">
<meta property="og:image" content="assets/fotos/${p.capa[0]}">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="icon" href="assets/favicon-48.png" sizes="48x48" type="image/png">
<link rel="icon" href="assets/favicon-96.png" sizes="96x96" type="image/png">
<link rel="icon" href="assets/favicon-192.png" sizes="192x192" type="image/png">
<link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
<link rel="preconnect" href="https://api.fontshare.com">
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=boska@400,401&display=swap">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400;62..125,500&family=La+Belle+Aurore&display=swap">
<link rel="stylesheet" href="assets/estudio.css">
<link rel="stylesheet" href="assets/demo.css">
</head>
<body class="rvt">

<a class="pular" href="#conteudo">Pular para o conteúdo</a>

<header class="topo-fixo">
  <div class="topo-in">
    <a class="marca" href="index.html">Débora Reis</a>
    <div class="topo-acoes"><a class="voltar" href="projetos.html"><span class="so-largo">Todos os projetos</span><span class="so-celular">Projetos</span></a><a class="topo-conversar" href="${ZAP}">Conversar</a></div>
  </div>
</header>

<main id="conteudo">

<!-- Página gerada por gerar-projetos.cjs (07/11, modelo das páginas de projeto da Tarq). Mudar o texto ou as fotos lá. -->

<section class="rvt-hero" aria-labelledby="rvt-t">
  <div class="rvt-fundo">
    <img src="assets/fotos/${p.capa[0]}" alt="${esc(p.capa[1])}" width="${cw}" height="${ch}" fetchpriority="high" style="object-position:${p.posicao}">
  </div>
  <div class="rvt-capa">
    <p class="rvt-intro">${p.resumo}</p>
    <h1 id="rvt-t" class="rvt-nome">${p.nome}</h1>
    <ul class="rvt-barra">
      ${p.faixa.map(f => `<li>${f}</li>`).join('\n      ')}
    </ul>
  </div>
  <div class="rvt-visao">
    <dl class="rvt-dados">
      ${p.dados.map(([dt, dd]) => `<div><dt>${dt}</dt><dd>${dd}</dd></div>`).join('\n      ')}
    </dl>
  </div>
</section>

${p.blocos.map((b, i) => bloco(b, i + 1, p)).join('\n\n')}

<section class="rvt-fim" aria-labelledby="rvt-fim-t">
  <h2 id="rvt-fim-t">Cada casa tem a sua própria história. <em>Vamos conversar sobre a sua?</em></h2>
  <div class="acoes">
    <a class="btn btn-grande" href="${ZAP}">Conversar com a Débora</a>
    <a class="link" href="conte-sua-casa.html">Ou conte a sua casa antes</a>
  </div>
  <nav class="rvt-nav" aria-label="Projetos">
    <a href="projetos.html">Todos os projetos</a>
    <a class="rvt-prox" href="projeto-${prox.slug}.html">Próximo projeto <b>${prox.nome}</b> <svg viewBox="0 0 40 16" aria-hidden="true"><path d="M1 8 H38 M31 1 L38 8 L31 15"/></svg></a>
  </nav>
</section>

</main>

<a class="previa" href="ideias.html"><span>Prévia</span><b class="so-largo"> feita para a Débora</b></a>

<footer class="rodape">
  <div class="rodape-contato">
    <a href="${ZAP}">(71) 99977-5453</a>
    <a href="mailto:deboraa_reis@yahoo.com.br">deboraa_reis@yahoo.com.br</a>
    <a class="rede-icone" href="https://www.instagram.com/deborareisarquitetura/" rel="noopener" aria-label="Instagram da Débora Reis"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6"/></svg></a>
  </div>
  ${p.dados.some(([dt]) => dt === 'Fotografia') ? '<p class="rodape-pe">Fotos: Roberto Moreira Rego.</p>' : ''}
</footer>

<script src="assets/demo.js" defer></script>
<script src="assets/vendor/lenis.min.js" defer></script>
<script src="assets/fluido.js" defer></script>
</body>
</html>
`;
}

PROJETOS.forEach((p, i) => {
  const prox = PROJETOS[(i + 1) % PROJETOS.length];
  fs.writeFileSync(path.join(SITE, `projeto-${p.slug}.html`), pagina(p, prox));
});
console.log('Páginas geradas:', PROJETOS.map(p => `projeto-${p.slug}.html`).join(', '));
module.exports = { PROJETOS };
