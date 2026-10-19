/* Aion Psicologia, versão 2. Sem dependência. Tudo o que se move respeita "reduzir movimento"
   e o conteúdo aparece mesmo se este arquivo falhar (60-motion.md). */
(function () {
  var html = document.documentElement;
  var calmo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* modo de apresentação: esconde as marcações de pendência */
  var pendBtn = document.querySelector('.pend-btn');
  if (pendBtn) pendBtn.addEventListener('click', function () {
    var limpo = html.classList.toggle('limpo');
    pendBtn.setAttribute('aria-pressed', limpo ? 'true' : 'false');
    pendBtn.textContent = limpo ? 'Mostrar marcações' : 'Ocultar marcações';
  });

  /* menu do celular */
  var abre = document.querySelector('.menu-abre');
  var menu = document.getElementById('menu');
  function fecha() { html.classList.remove('menu-aberto'); abre.setAttribute('aria-expanded', 'false'); abre.setAttribute('aria-label', 'Abrir menu'); }
  if (abre && menu) {
    abre.addEventListener('click', function () {
      var aberto = html.classList.toggle('menu-aberto');
      abre.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      abre.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) fecha(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fecha(); });
  }

  if (calmo) return;
  html.classList.add('js-motion');

  /* assinatura: o labirinto do logo se desenha uma vez */
  var svg = document.querySelector('.labirinto');
  if (svg) {
    svg.querySelectorAll('.lab').forEach(function (p) {
      var len = Math.ceil(p.getTotalLength());
      p.style.setProperty('--len', len);
    });
    requestAnimationFrame(function () { requestAnimationFrame(function () { svg.classList.add('desenhado'); }); });
  }

  /* o mesmo traço costura os quatro trechos de "Por onde começar" */
  var trilho = document.querySelector('.trilho');
  var traco = document.querySelector('.fio-traco');
  var trechos = document.querySelectorAll('.trecho');
  var pedido = false;
  function mede() {
    pedido = false;
    var vh = window.innerHeight, alvo = vh * 0.62;
    var r = trilho.getBoundingClientRect();
    var p = Math.min(1, Math.max(0, (alvo - r.top) / r.height));
    traco.style.transform = 'scaleY(' + p.toFixed(4) + ')';
    trechos.forEach(function (t) {
      t.classList.toggle('passou', t.getBoundingClientRect().top < alvo);
    });
  }
  if (trilho && traco) {
    window.addEventListener('scroll', function () { if (!pedido) { pedido = true; requestAnimationFrame(mede); } }, { passive: true });
    window.addEventListener('resize', mede);
    mede();
  }

  /* entrada suave, com trava de duas camadas (90-antipadroes.md) */
  var alvos = document.querySelectorAll('.sit, .passos li, .avaliacao, .coord, .pessoa, .faq details');
  alvos.forEach(function (el) { el.classList.add('rev'); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('dentro'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    alvos.forEach(function (el) { io.observe(el); });
  }
  setTimeout(function () {
    alvos.forEach(function (el) { if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('dentro'); });
    if (!document.querySelector('.rev.dentro')) alvos.forEach(function (el) { el.classList.add('dentro'); });
  }, 1600);
})();
