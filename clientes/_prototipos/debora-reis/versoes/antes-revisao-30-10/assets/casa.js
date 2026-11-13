/* Conte a sua casa: o questionário da Débora (estrutura do Havenly, com os apartamentos dela).
   Os cinco resultados são cinco apartamentos dela, com a frase da legenda dela (fotos/FONTES.md).
   Nada é enviado sem a pessoa tocar em "Mandar": o botão abre o WhatsApp com o texto pronto. */
(function () {
  'use strict';
  var WHATS = '5571999775453';

  var JEITOS = {
    alma: { nome: 'Alma brasileira', h1: 'Alma <em>brasileira.</em>', foto: 'alma-brasileira.jpg', w: 1080, h: 1439,
      frase: 'Há quem goste de vinil, de CDs, de livros. Há quem valorize e preserve o que é antigo. Isso é sensibilidade, isso é autenticidade. Isso é história!' },
    pressa: { nome: 'Sem pressa', h1: 'Montada <em>sem pressa.</em>', foto: 'artesanato.jpg', w: 1080, h: 1434,
      frase: 'O luxo de um interior está nisso: não parecer que foi comprado inteiro de uma vez.' },
    frio: { nome: 'Frio e quente', h1: 'Frio <em>e quente.</em>', foto: 'azul-madeira.jpg', w: 1080, h: 1350,
      frase: 'Azul e madeira. Frio e quente. Uma combinação que poderia ser previsível, mas aqui ganhou outra conversa.' },
    perso: { nome: 'Personalidade', h1: 'Personalidade <em>sem pedir licença.</em>', foto: 'vermelho.jpg', w: 810, h: 1080,
      frase: 'Personalidade não precisa pedir licença. O vermelho aparece, mas o conjunto continua elegante.' },
    refugio: { nome: 'Refúgio urbano', h1: 'Refúgio <em>urbano.</em>', foto: 'aconchego.jpg', w: 1080, h: 1440,
      frase: 'A textura suave do linho, o toque natural da madeira e o frescor do verde transformam o espaço em um refúgio urbano.' }
  };

  var FOTOS = [
    { f: 'alma-brasileira.jpg', w: 1080, h: 1439, alt: 'Estante com CDs e livros e mesa de madeira', p: { alma: 2 } },
    { f: 'aconchego.jpg', w: 1080, h: 1440, alt: 'Sofá de linho com almofadas e planta pendente', p: { refugio: 2 } },
    { f: 'artesanato.jpg', w: 1080, h: 1434, alt: 'Pendente de vidro diante de prateleiras com cerâmica', p: { pressa: 2 } },
    { f: 'vermelho.jpg', w: 810, h: 1080, alt: 'Aparador vermelho com plantas e folhas decorativas', p: { perso: 2 } },
    { f: 'azul-madeira.jpg', w: 1080, h: 1350, alt: 'Marcenaria de madeira com nicho azul', p: { frio: 2 } },
    { f: 'livros.jpg', w: 1080, h: 1427, alt: 'Estante branca cheia de livros', p: { alma: 2 } },
    { f: 'objetos.jpg', w: 1080, h: 1440, alt: 'Quadro, objetos e bandeja de madeira sobre um móvel', p: { pressa: 2, perso: 0.5 } },
    { f: 'rio-vermelho.jpg', w: 1080, h: 1080, alt: 'Corredor com aparador vermelho e painel de ripas verde', p: { perso: 1, refugio: 1, alma: 0.5 } },
    { f: 'estante-gatos.jpg', w: 540, h: 960, alt: 'Gato descendo por um nicho da estante', p: { alma: 1, refugio: 0.5 } },
    { f: 'sala-vermelha.jpg', w: 1080, h: 717, alt: 'Sala com mesa vermelha e janela de ponta a ponta', p: { perso: 1.5, frio: 0.5 } },
    { f: 'banheiro-gato.jpg', w: 640, h: 1136, alt: 'Banheiro com parede de tijolinho e um gato ao lado da cuba', p: { refugio: 1, pressa: 0.5 } }
  ];

  // ícones de traço, desenhados aqui (24x24)
  var IC = {
    livros: '<path d="M4 4h4v16H4zM9 4h4v16H9zM14.5 5l3.8-1 3.2 15.5-3.8 1z"/>',
    discos: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2.5"/>',
    plantas: '<path d="M12 21v-9M12 12c0-4 3-7 7-7 0 4-3 7-7 7zM12 15c0-3-2.5-5.5-6-5.5 0 3 2.5 5.5 6 5.5zM8 21h8"/>',
    gatos: '<path d="M6 20c-1-3 0-7 2-9l-1-5 4 3h2l4-3-1 5c2 2 3 6 2 9z"/><path d="M10 14h.01M14 14h.01"/>',
    cachorro: '<path d="M5 9l2-5 3 3h4l3-3 2 5-2 3v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-6z"/><path d="M10 13h.01M14 13h.01M11 16h2"/>',
    arte: '<rect x="3.5" y="4.5" width="17" height="15"/><path d="M3.5 16l5-5 4 4 3-3 5 5"/>',
    artesanato: '<path d="M8 4h8M9 4c0 3-4 5-4 10a7 6 0 0 0 14 0c0-5-4-7-4-10"/>',
    antigos: '<path d="M4 10h16v8H4zM6 18v3M18 18v3M6 10V6a6 2 0 0 1 12 0v4"/>',
    criancas: '<circle cx="12" cy="7" r="3"/><path d="M6 21c0-4 2.7-7 6-7s6 3 6 7"/>',
    trabalho: '<rect x="3.5" y="5" width="17" height="11"/><path d="M8 20h8M12 16v4"/>',
    receber: '<path d="M4 11h16M6 11v9M18 11v9M8 4l4 4 4-4"/>',
    sala: '<path d="M4 18v-6a2 2 0 0 1 4 0h8a2 2 0 0 1 4 0v6zM6 18v2M18 18v2M8 12V8h8v4"/>',
    cozinha: '<rect x="4" y="3.5" width="16" height="17"/><path d="M4 9h16M8 6h.01M11 6h.01M8 13v4"/>',
    quartos: '<path d="M3 18V8M3 14h18v4M21 18v-4a3 3 0 0 0-3-3h-7v3M6 11h2"/>',
    banheiros: '<path d="M4 12h16v3a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM6 12V5a2 2 0 0 1 4 0"/>',
    varanda: '<path d="M3 20h18M5 20v-8M19 20v-8M3 12h18M9 12v8M15 12v8M12 3l7 6H5z"/>',
    inteiro: '<path d="M3 11l9-7 9 7M5 9.5V20h14V9.5M10 20v-6h4v6"/>'
  };
  function icone(n) { return '<svg viewBox="0 0 24 24" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round">' + (IC[n] || '') + '</svg>'; }

  var VIVE = [
    { id: 'livros', nome: 'Livros', p: { alma: 1 }, card: { f: 'livros.jpg', t: 'Os livros', q: 'Uma casa sem livros pode ser bonita. Mas uma casa com livros tem alma.' } },
    { id: 'discos', nome: 'Discos e CDs', p: { alma: 1 }, card: { f: 'alma-brasileira.jpg', t: 'Os discos', q: 'Há quem goste de vinil, de CDs, de livros.' } },
    { id: 'plantas', nome: 'Plantas', p: { refugio: 1 }, card: { f: 'aconchego.jpg', t: 'As plantas', q: 'O frescor do verde transforma o espaço em um refúgio urbano.' } },
    { id: 'gatos', nome: 'Gatos', p: { refugio: 0.5, alma: 0.5 }, card: { f: 'estante-gatos.jpg', t: 'Os gatos', q: 'Uma estante pensada não apenas como estante, mas como diversão para os bichanos.' } },
    { id: 'cachorro', nome: 'Cachorro', p: { refugio: 0.5 } },
    { id: 'arte', nome: 'Arte e quadros', p: { perso: 1 }, card: { f: 'objetos.jpg', t: 'A arte', q: 'Tem coisas que não foram escolhidas para combinar. Foram escolhidas porque contam alguma coisa.' } },
    { id: 'artesanato', nome: 'Artesanato', p: { pressa: 1 }, card: { f: 'artesanato.jpg', t: 'O artesanato', q: 'No artesanato brasileiro, nas peças feitas à mão, nas formas imperfeitas.' } },
    { id: 'antigos', nome: 'Móveis de família', p: { alma: 1, pressa: 0.5 }, card: { f: 'alma-brasileira.jpg', t: 'O que é de família', q: 'Há quem valorize e preserve o que é antigo.' } },
    { id: 'criancas', nome: 'Crianças', p: {} },
    { id: 'trabalho', nome: 'Trabalho em casa', p: {} },
    { id: 'receber', nome: 'Gente pra receber', p: { perso: 0.5 } }
  ];

  var CORES = [
    { id: 'vermelho', nome: 'Vermelho e madeira', c: ['#A33627', '#8A5A36', '#E9DCCB', '#2E2420'], p: { perso: 2 } },
    { id: 'azul', nome: 'Azul e madeira', c: ['#2F5A7A', '#A0703F', '#EFE7DA', '#C9B9A8'], p: { frio: 2 } },
    { id: 'linho', nome: 'Linho, madeira e verde', c: ['#E8E0D2', '#B08A5E', '#6E7F55', '#F6F1E8'], p: { refugio: 2 } },
    { id: 'terra', nome: 'Terra, cerâmica e palha', c: ['#B5653B', '#D9B48A', '#7A5536', '#EFE3D0'], p: { pressa: 2 } },
    { id: 'livros', nome: 'Branco, livros e cor aos poucos', c: ['#F4F1EA', '#7A4B3A', '#C49A3C', '#3E5A4A'], p: { alma: 2 } }
  ];

  var SENTIR = [
    { id: 'aconchego', nome: 'Aconchego', d: 'Chegar e querer tirar o sapato', p: { refugio: 2 } },
    { id: 'historias', nome: 'Minhas histórias por perto', d: 'Tudo o que eu juntei à vista', p: { alma: 2 } },
    { id: 'energia', nome: 'Energia', d: 'Cor, contraste, presença', p: { perso: 2 } },
    { id: 'calma', nome: 'Calma', d: 'Pouca coisa, bem escolhida', p: { frio: 2 } },
    { id: 'orgulho', nome: 'Orgulho do que eu juntei', d: 'Cada peça com uma origem', p: { pressa: 2 } }
  ];

  var COMODOS = [
    { id: 'sala', nome: 'Sala' }, { id: 'cozinha', nome: 'Cozinha' }, { id: 'quartos', nome: 'Quartos' },
    { id: 'banheiros', nome: 'Banheiros' }, { id: 'varanda', nome: 'Varanda' }, { id: 'trabalho', nome: 'Home office' },
    { id: 'inteiro', nome: 'O apartamento inteiro' }
  ];

  var QUANDO = [
    { id: 'ja', nome: 'O quanto antes' }, { id: '3m', nome: 'Nos próximos 3 meses' },
    { id: 'ano', nome: 'Ainda este ano' }, { id: 'sonho', nome: 'Por enquanto, só sonhando' }
  ];

  var resp = { fotos: [], vive: [], cores: null, sentir: null, comodos: [], quando: null };
  var passo = 0, TOTAL = 6;
  var $ = function (s) { return document.querySelector(s); };

  // ---------- montar as opções ----------
  function botao(cls, html, grupo, id, multi) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = cls; b.innerHTML = html;
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', function () { escolher(grupo, id, multi, b); });
    return b;
  }
  FOTOS.forEach(function (o, i) {
    $('#op-fotos').appendChild(botao('opcao-foto', '<img src="assets/fotos/' + o.f + '" alt="' + o.alt + '" width="' + o.w + '" height="' + o.h + '" loading="' + (i < 6 ? 'eager' : 'lazy') + '"><span class="marca-ok" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>', 'fotos', i, true));
  });
  VIVE.forEach(function (o) { $('#op-vive').appendChild(botao('op', icone(o.id) + o.nome, 'vive', o.id, true)); });
  CORES.forEach(function (o) {
    $('#op-cores').appendChild(botao('op', '<span class="paleta" aria-hidden="true">' + o.c.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join('') + '</span>' + o.nome, 'cores', o.id, false));
  });
  SENTIR.forEach(function (o) { $('#op-sentir').appendChild(botao('op', o.nome + '<small>' + o.d + '</small>', 'sentir', o.id, false)); });
  COMODOS.forEach(function (o) { $('#op-comodos').appendChild(botao('op', icone(o.id) + o.nome, 'comodos', o.id, true)); });
  QUANDO.forEach(function (o) { $('#op-quando').appendChild(botao('op', o.nome, 'quando', o.id, false)); });

  var metros = $('#metros'), metrosV = $('#metros-v');
  metros.addEventListener('input', function () { metrosV.textContent = metros.value + ' m²'; });

  function escolher(grupo, id, multi, b) {
    if (multi) {
      var i = resp[grupo].indexOf(id);
      if (i < 0) resp[grupo].push(id); else resp[grupo].splice(i, 1);
      b.setAttribute('aria-pressed', i < 0 ? 'true' : 'false');
    } else {
      resp[grupo] = id;
      b.parentNode.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    }
    atualizarBarra();
  }

  // ---------- andar entre as perguntas ----------
  var CHAVE = [null, 'fotos', 'vive', 'cores', 'sentir', 'comodos', 'quando'];
  function respondido(n) {
    var v = resp[CHAVE[n]];
    return Array.isArray(v) ? v.length > 0 : !!v;
  }
  function atualizarBarra() {
    var barra = $('#barra');
    barra.classList.toggle('visivel', passo >= 1 && passo <= TOTAL);
    $('#prog-txt').textContent = passo + ' de ' + TOTAL;
    $('#prog-bar').style.transform = 'scaleX(' + (passo / TOTAL) + ')';
    $('#proximo').disabled = !respondido(passo);
    $('#proximo').textContent = passo === TOTAL ? 'Ver o retrato da minha casa' : 'Próximo';
    $('#pular').hidden = passo !== 1;
  }
  function ir(n) {
    document.querySelectorAll('.passo').forEach(function (s) { s.classList.toggle('ativo', +s.getAttribute('data-passo') === n); });
    passo = n; atualizarBarra(); window.scrollTo(0, 0);
    var t = document.getElementById('t' + n); if (t && n > 0) t.focus({ preventScroll: true });
  }
  document.querySelector('[data-ir="1"]').addEventListener('click', function () { ir(1); });
  $('#proximo').addEventListener('click', function () { if (passo < TOTAL) ir(passo + 1); else mostrarResultado(); });
  $('#voltar').addEventListener('click', function () { if (passo > 1) ir(passo - 1); else ir(0); });
  $('#pular').addEventListener('click', function () { ir(2); });
  $('#r-refazer').addEventListener('click', function () { location.reload(); });

  // ---------- o resultado ----------
  function somar(pts, p, peso) { for (var k in p) pts[k] = (pts[k] || 0) + p[k] * (peso || 1); }
  function nomes(lista, ids) { return ids.map(function (id) { var o = lista.filter(function (x) { return x.id === id; })[0]; return o ? o.nome.charAt(0).toLowerCase() + o.nome.slice(1) : id; }); }
  function achar(lista, id) { return lista.filter(function (x) { return x.id === id; })[0]; }
  function esc(t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

  function mostrarResultado() {
    var pts = { alma: 0.2, pressa: 0.2, frio: 0.2, perso: 0.2, refugio: 0.2 };
    resp.fotos.forEach(function (i) { somar(pts, FOTOS[i].p); });
    resp.vive.forEach(function (id) { somar(pts, achar(VIVE, id).p); });
    if (resp.cores) somar(pts, achar(CORES, resp.cores).p, 1.2);
    if (resp.sentir) somar(pts, achar(SENTIR, resp.sentir).p, 1.2);
    var ordem = Object.keys(pts).sort(function (a, b) { return pts[b] - pts[a]; });
    var tres = ordem.slice(0, 3), soma = tres.reduce(function (s, k) { return s + pts[k]; }, 0);
    var pct = tres.map(function (k) { return Math.round(pts[k] / soma * 100); });
    pct[0] += 100 - pct.reduce(function (s, v) { return s + v; }, 0);

    var J = JEITOS[ordem[0]], nome = $('#nome').value.trim(), bairro = $('#bairro').value.trim();
    $('#r-foto').src = 'assets/fotos/' + J.foto; $('#r-foto').width = J.w; $('#r-foto').height = J.h;
    $('#r-rotulo').textContent = nome ? 'O retrato da casa de ' + nome : 'O retrato da sua casa';
    $('#r-titulo').innerHTML = J.h1;
    $('#r-frase').textContent = '“' + J.frase + '”';

    $('#r-barras').innerHTML = tres.map(function (k, i) {
      return '<li><div class="b-topo"><span>' + JEITOS[k].nome + '</span></div><div class="b-trilho"><i data-w="' + pct[i] + '"></i></div></li>';
    }).join('');

    var cards = resp.vive.map(function (id) { return achar(VIVE, id); }).filter(function (o) { return o.card; }).slice(0, 6);
    $('#r-vive-sec').hidden = !cards.length;
    $('#r-vive').innerHTML = cards.map(function (o) {
      var fo = FOTOS.filter(function (x) { return x.f === o.card.f; })[0] || { w: 1080, h: 1080 }; return '<figure class="cartao-vive"><img src="assets/fotos/' + o.card.f + '" alt="" width="' + fo.w + '" height="' + fo.h + '" loading="lazy"><figcaption><h3>' + o.card.t + '</h3><q>' + o.card.q + '</q></figcaption></figure>';
    }).join('');

    var quando = resp.quando ? achar(QUANDO, resp.quando).nome : '';
    var linhas = [
      ['Jeito da casa', tres.map(function (k, i) { return JEITOS[k].nome; }).join(', ')],
      ['O que mora junto', nomes(VIVE, resp.vive).join(', ') || 'não marcado'],
      ['Cômodos', nomes(COMODOS, resp.comodos).join(', ')],
      ['Metragem', 'uns ' + metros.value + ' m²'],
      ['Bairro', bairro || 'não informado'],
      ['Quando', quando ? quando.charAt(0).toLowerCase() + quando.slice(1) : 'não marcado']
    ];
    $('#r-ficha').innerHTML = linhas.map(function (l) { return '<div><dt>' + l[0] + '</dt><dd>' + esc(l[1]) + '</dd></div>'; }).join('');
    $('#r-prazo').hidden = resp.quando !== 'ja';

    // no WhatsApp, *assim* vira negrito: o jeito da casa chega em lista, o resto um item por linha
    var abertura = 'Oi, Débora! Fiz o "Conte a sua casa" no seu site.' + (nome ? ' Sou ' + nome + '.' : '');
    var jeitos = tres.map(function (k, i) { return JEITOS[k].nome; });
    var resto = linhas.slice(1);
    var texto = abertura + '\n\n*Jeito da casa*\n' + jeitos.map(function (j) { return '• ' + j; }).join('\n') + '\n\n' +
      resto.map(function (l) { return '*' + l[0] + ':* ' + l[1]; }).join('\n');
    $('#r-msg').innerHTML = '<p>' + esc(abertura) + '</p><p class="msg-lista"><b>Jeito da casa</b>' +
      jeitos.map(function (j) { return '<span>• ' + j + '</span>'; }).join('') + '</p><dl>' +
      resto.map(function (l) { return '<div><dt>' + l[0] + ':</dt> <dd>' + esc(l[1]) + '</dd></div>'; }).join('') +
      '</dl><span class="msg-hora">agora <svg viewBox="0 0 18 11" width="16" height="10" aria-hidden="true"><path d="M1 6l3 3 6-7M7 8l1 1 6-7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
    var link = 'https://wa.me/' + WHATS + '?text=' + encodeURIComponent(texto);
    ['#r-enviar', '#r-enviar-2', '#r-enviar-3'].forEach(function (s) { $(s).href = link; });

    document.querySelectorAll('.passo').forEach(function (s) { s.classList.remove('ativo'); });
    $('#barra').classList.remove('visivel');
    $('#resultado').classList.add('ativo');
    window.scrollTo(0, 0); $('#r-titulo').focus({ preventScroll: true });

    // as barras enchem e a mensagem "chega" quando aparecem na tela
    var obs = 'IntersectionObserver' in window ? new IntersectionObserver(function (its) {
      its.forEach(function (it) {
        if (!it.isIntersecting) return;
        if (it.target.id === 'r-barras') it.target.querySelectorAll('i').forEach(function (i) { i.style.transform = 'scaleX(' + (i.getAttribute('data-w') / 100) + ')'; });
        else it.target.classList.add('chegou');
        obs.unobserve(it.target);
      });
    }, { threshold: 0.3 }) : null;
    if (obs) { obs.observe($('#r-barras')); obs.observe($('#r-msg')); }

    // a barra de mandar fica fixa embaixo, e some quando outro botão de mandar já está na tela
    var barraEnviar = $('#barra-enviar'), aVista = {};
    barraEnviar.classList.add('visivel');
    if ('IntersectionObserver' in window) {
      var obsBotao = new IntersectionObserver(function (its) {
        its.forEach(function (it) { aVista[it.target.id] = it.isIntersecting; });
        barraEnviar.classList.toggle('visivel', !aVista['r-enviar'] && !aVista['r-enviar-2']);
      });
      obsBotao.observe($('#r-enviar')); obsBotao.observe($('#r-enviar-2'));
    }
    else { document.querySelectorAll('#r-barras i').forEach(function (i) { i.style.transform = 'scaleX(' + (i.getAttribute('data-w') / 100) + ')'; }); $('#r-msg').classList.add('chegou'); }
  }

  atualizarBarra();
})();
