/* Aion Psicologia, versão 3. Sem dependência; o conteúdo aparece mesmo se este arquivo falhar (60-motion.md). */
(function () {
  var html = document.documentElement;
  var calmo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var pendBtn = document.querySelector('.pend-btn');
  if (pendBtn) pendBtn.addEventListener('click', function () {
    var limpo = html.classList.toggle('limpo');
    pendBtn.setAttribute('aria-pressed', limpo ? 'true' : 'false');
    pendBtn.textContent = limpo ? 'Mostrar marcações' : 'Ocultar marcações';
  });

  var abre = document.querySelector('.menu-abre'), menu = document.getElementById('menu');
  function fecha() { html.classList.remove('menu-aberto'); abre.setAttribute('aria-expanded', 'false'); }
  if (abre && menu) {
    abre.addEventListener('click', function () {
      var a = html.classList.toggle('menu-aberto');
      abre.setAttribute('aria-expanded', a ? 'true' : 'false');
      abre.setAttribute('aria-label', a ? 'Fechar menu' : 'Abrir menu');
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) fecha(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fecha(); });
  }

  if (calmo) return;
  html.classList.add('js-motion');

  /* faixa de palavras e selo andam com a rolagem, nunca sozinhos */
  var trilho = document.querySelector('.faixa-trilho'), giro = document.querySelector('.selo .giro'), pedido = false;
  function mede() {
    pedido = false;
    var y = window.scrollY;
    if (trilho) trilho.style.transform = 'translateX(' + (-(y * 0.35) % (trilho.scrollWidth / 2)) + 'px)';
    if (giro) giro.setAttribute('transform', 'rotate(' + (y * 0.12) + ' 70 70)');
  }
  window.addEventListener('scroll', function () { if (!pedido) { pedido = true; requestAnimationFrame(mede); } }, { passive: true });
  mede();

  /* entrada suave, com trava de duas camadas (90-antipadroes.md) */
  var alvos = document.querySelectorAll('.rev, .abre-arco');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('dentro'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -6% 0px' });
    alvos.forEach(function (el) { io.observe(el); });
  }
  setTimeout(function () {
    alvos.forEach(function (el) { if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('dentro'); });
    if (!document.querySelector('.dentro')) alvos.forEach(function (el) { el.classList.add('dentro'); });
  }, 1600);
})();
