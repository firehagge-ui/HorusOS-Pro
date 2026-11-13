/* Modo revista da página de projetos (30/10/2026).
   A sequência é: cartão do projeto (fala da Débora, quem mora, desafio, solução) → fotos → cartão do próximo projeto.
   Abre num <dialog> (Esc fecha e o foco fica preso lá dentro); setas do teclado e arrasto no celular trocam a página. */
(function () {
  var dlg = document.getElementById('revista');
  if (!dlg || typeof dlg.showModal !== 'function') return;
  var $ = function (id) { return document.getElementById(id); };
  var cartao = $('rv-cartao'), foto = $('rv-foto'), img = $('rv-img'), legenda = $('rv-legenda');
  var parado = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // monta a sequência a partir do próprio HTML da página
  var seq = [], inicio = {};
  document.querySelectorAll('.obra-v2').forEach(function (art) {
    var nome = art.querySelector('h2').textContent, zap = art.getAttribute('data-zap');
    var hist = art.querySelector('.obra-historia');
    inicio[art.id] = seq.length;
    seq.push({ tipo: 'cartao', id: art.id, nome: nome, zap: zap, html: hist ? hist.textContent : '' });
    var fotos = art.querySelectorAll('.obra-f img');
    fotos.forEach(function (im, i) {
      seq.push({ tipo: 'foto', id: art.id, nome: nome, zap: zap, src: im.getAttribute('src'), alt: im.alt, n: i + 1, total: fotos.length });
    });
    art.querySelectorAll('.obra-abrir').forEach(function (bt) {
      bt.addEventListener('click', function () { abrir(inicio[art.id] + 1 + (+bt.getAttribute('data-i')), bt); });
    });
    art.querySelectorAll('.obra-revista').forEach(function (bt) {
      bt.addEventListener('click', function () { abrir(inicio[art.id], bt); });
    });
  });

  var atual = 0, origem = null;

  function mostrar(i) {
    atual = (i + seq.length) % seq.length;
    var it = seq[atual];
    $('rv-nome').textContent = it.nome;
    $('rv-zap').href = it.zap;
    if (it.tipo === 'cartao') {
      $('rv-titulo').textContent = it.nome;
      $('rv-historia').innerHTML = it.html;
      $('rv-conta').textContent = 'Apresentação';
      foto.hidden = true; cartao.hidden = false;
    } else {
      $('rv-conta').textContent = 'Foto ' + it.n + ' de ' + it.total;
      cartao.hidden = true; foto.hidden = false;
      foto.classList.remove('chegou');
      img.onload = function () { foto.classList.add('chegou'); };
      img.src = it.src; img.alt = it.alt; legenda.textContent = it.alt;
      if (img.complete) foto.classList.add('chegou');
      var prox = seq[(atual + 1) % seq.length];
      if (prox.tipo === 'foto') { var pre = new Image(); pre.src = prox.src; }
    }
    if (!parado) { var alvo = it.tipo === 'cartao' ? cartao : foto; alvo.classList.remove('entra'); void alvo.offsetWidth; alvo.classList.add('entra'); }
  }

  function abrir(i, de) {
    origem = de || null;
    mostrar(i);
    dlg.showModal();
    document.documentElement.classList.add('revista-aberta');
    $('rv-prox').focus();
  }
  function fechar() { dlg.close(); }
  dlg.addEventListener('close', function () {
    document.documentElement.classList.remove('revista-aberta');
    if (origem) origem.focus();
  });

  $('rv-fechar').addEventListener('click', fechar);
  $('rv-prox').addEventListener('click', function () { mostrar(atual + 1); });
  $('rv-ant').addEventListener('click', function () { mostrar(atual - 1); });
  dlg.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); mostrar(atual + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); mostrar(atual - 1); }
  });
  // clique no fundo escuro (fora do conteúdo) fecha
  dlg.addEventListener('click', function (e) { if (e.target === dlg) fechar(); });

  // arrasto lateral no celular
  var x0 = null, y0 = null;
  $('rv-palco').addEventListener('pointerdown', function (e) { x0 = e.clientX; y0 = e.clientY; });
  $('rv-palco').addEventListener('pointerup', function (e) {
    if (x0 === null) return;
    var dx = e.clientX - x0, dy = e.clientY - y0; x0 = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) mostrar(atual + (dx < 0 ? 1 : -1));
  });
})();
