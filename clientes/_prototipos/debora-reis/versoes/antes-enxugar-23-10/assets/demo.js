/* Demonstração: o botão que esconde as marcas de simulação (lembra a escolha nesta aba)
   e os pontos clicáveis da foto do Rio Vermelho. */
(function () {
  'use strict';
  var b = document.querySelector('[data-sim]');
  function aplicar(esconder) {
    document.body.classList.toggle('sem-sim', esconder);
    if (b) b.textContent = esconder ? 'Mostrar marcações' : 'Esconder marcações';
  }
  var guardado = false;
  try { guardado = sessionStorage.getItem('sem-sim') === '1'; } catch (e) {}
  aplicar(guardado);
  if (b) b.addEventListener('click', function () {
    var agora = !document.body.classList.contains('sem-sim');
    aplicar(agora);
    try { sessionStorage.setItem('sem-sim', agora ? '1' : '0'); } catch (e) {}
  });

  // os números da foto: cada um abre a sua caixa ao lado dele (no celular, logo acima ou abaixo)
  var fig = document.querySelector('.foto-pontos');
  if (!fig) return;
  var pontos = [].slice.call(fig.querySelectorAll('.ponto')), caixas = [].slice.call(fig.querySelectorAll('.caixa'));
  fig.classList.add('js-caixas');
  var aberto = null;
  caixas.forEach(function (c) {
    c.hidden = true;
    var x = document.createElement('button');
    x.type = 'button'; x.className = 'caixa-fechar'; x.setAttribute('aria-label', 'Fechar');
    x.innerHTML = '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M1 1 L13 13 M13 1 L1 13"/></svg>';
    x.addEventListener('click', function () { fechar(true); });
    c.appendChild(x);
  });
  function caixaDe(id) { return fig.querySelector('.caixa[data-ponto="' + id + '"]'); }
  function botaoDe(id) { return fig.querySelector('.ponto[data-ponto="' + id + '"]'); }
  function posicionar() {
    if (!aberto) return;
    var b = botaoDe(aberto), c = caixaDe(aberto);
    var W = fig.clientWidth, H = fig.clientHeight, cx = b.offsetLeft + b.offsetWidth / 2, cy = b.offsetTop + b.offsetHeight / 2;
    var estreito = W < 620;
    c.classList.toggle('embaixo', estreito);
    c.style.width = estreito ? W + 'px' : '';
    var bw = c.offsetWidth, bh = c.offsetHeight;
    if (estreito) {
      // no celular a foto é estreita: a caixa encosta embaixo dela, com a seta no número
      c.style.left = '0px'; c.style.top = (H + 12) + 'px';
      c.style.setProperty('--seta', Math.max(16, Math.min(W - 16, cx)) + 'px');
      fig.style.marginBottom = (bh + 24) + 'px';
      return;
    }
    fig.style.marginBottom = '';
    var x = cx < W * 0.55 ? cx + 38 : cx - 38 - bw, y = cy - 30;
    c.style.left = Math.max(12, Math.min(W - bw - 12, x)) + 'px';
    c.style.top = Math.max(12, Math.min(H - bh - 12, y)) + 'px';
  }
  function fechar(devolverFoco) {
    if (!aberto) return;
    var b = botaoDe(aberto), c = caixaDe(aberto);
    c.classList.remove('aberta'); c.hidden = true; b.setAttribute('aria-expanded', 'false');
    fig.style.marginBottom = '';
    aberto = null;
    if (devolverFoco) b.focus();
  }
  function abrir(id) {
    if (aberto === id) return fechar(false);
    fechar(false);
    var b = botaoDe(id), c = caixaDe(id);
    aberto = id; c.hidden = false; b.setAttribute('aria-expanded', 'true');
    posicionar();
    requestAnimationFrame(function () { c.classList.add('aberta'); });
  }
  pontos.forEach(function (p) { p.addEventListener('click', function (e) { e.stopPropagation(); abrir(p.getAttribute('data-ponto')); }); });
  caixas.forEach(function (c) { c.addEventListener('click', function (e) { e.stopPropagation(); }); });
  document.addEventListener('click', function () { fechar(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fechar(true); });
  window.addEventListener('resize', posicionar);
})();
