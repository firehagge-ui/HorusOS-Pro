// Amparo Flores — interações leves (sem dependência)
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- menu mobile ----
  var burger = document.getElementById('burger');
  var top = document.getElementById('top');
  if (burger && top) {
    burger.addEventListener('click', function () { top.classList.toggle('open'); });
    top.querySelectorAll('.nav a').forEach(function (a) {
      a.addEventListener('click', function () { top.classList.remove('open'); });
    });
  }

  // ---- alternar marcação de pendências (apresentar limpo) ----
  var toggle = document.getElementById('togglePend');
  if (toggle) {
    toggle.addEventListener('click', function () {
      document.body.classList.toggle('limpo');
      toggle.textContent = document.body.classList.contains('limpo')
        ? 'Mostrar pendências' : 'Ver versão limpa';
    });
  }

  // ---- hero: fundo de fotos passando (a assinatura) ----
  // Cross-fade lento com Ken Burns. Congela na 1ª foto se reduce estiver ligado.
  var bg = document.getElementById('heroBg');
  if (bg && !reduce) {
    var slides = bg.querySelectorAll('.slide');
    var cred = document.getElementById('heroCred');
    var legendas = [
      'Buquê de girassóis, montado na loja',
      'A fachada no Largo da Graça',
      'Buquê de girassóis',
      'A vitrine da loja',
      'Buquê de rosas',
      'Arranjo de lírios e rosas'
    ];
    var i = 0;
    if (slides.length > 1) {
      setInterval(function () {
        slides[i].classList.remove('on');
        i = (i + 1) % slides.length;
        slides[i].classList.add('on');
        if (cred && legendas[i]) cred.textContent = legendas[i];
      }, 5000);
    }
  }

  // ---- reveal na entrada (respeita prefers-reduced-motion) ----
  var revs = document.querySelectorAll('.rev');
  if (reduce || !('IntersectionObserver' in window)) {
    revs.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  revs.forEach(function (el) { io.observe(el); });

  // trava de duas camadas: se o observador não disparar, nada some.
  setTimeout(function () {
    // camada 1: revela o que já está na tela (não estraga a animação de quem rola)
    revs.forEach(function (el) {
      if (!el.classList.contains('in') && el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.add('in');
      }
    });
    // camada 2: se ainda assim nada foi revelado, o observador está quebrado
    if (!document.querySelector('.rev.in')) {
      revs.forEach(function (el) { el.classList.add('in'); });
    }
  }, 1600);
})();
