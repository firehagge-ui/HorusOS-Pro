/* 07/11 (Marcelo): rolagem fluida no site inteiro (Lenis 1.1.14, em assets/vendor).
   - No computador, a roda do mouse ganha inércia. No celular (syncTouch), o dedo solta e a página desliza.
   - A rolagem continua sendo a da janela: sticky, ScrollTrigger e os efeitos de rolagem seguem funcionando.
   - Com "reduzir movimento", sem Lenis ou numa janela aberta (a revista dos projetos), a rolagem é a do navegador.
   - Arrastar o carrossel de projetos para o lado não rola a página. */
(function () {
  'use strict';
  if (!window.Lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
    syncTouch: true,
    syncTouchLerp: 0.085,
    touchInertiaMultiplier: 30,
    gestureOrientation: 'vertical',
    prevent: function (no) {
      if (!no.closest) return false;
      if (no.closest('dialog[open], .revista')) return true;
      return !!no.closest('.projetos.arrastando');
    }
  });
  window.lenisSite = lenis;

  if (window.gsap && window.ScrollTrigger) {
    lenis.on('scroll', window.ScrollTrigger.update);
    window.gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    window.gsap.ticker.lagSmoothing(0);
  } else {
    var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  // janela aberta (revista dos projetos): a página de trás para de rolar
  var dlg = document.querySelector('dialog');
  if (dlg && 'MutationObserver' in window) {
    new MutationObserver(function () { if (dlg.open) lenis.stop(); else lenis.start(); })
      .observe(dlg, { attributes: true, attributeFilter: ['open'] });
  }

  // links para uma seção da mesma página deslizam até ela (o "Pular para o conteúdo" fica como o navegador faz)
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || a.classList.contains('pular') || e.defaultPrevented) return;
    var id = a.getAttribute('href');
    if (id.length < 2) return;
    var alvo = document.getElementById(id.slice(1));
    if (!alvo) return;
    e.preventDefault();
    lenis.scrollTo(alvo, { duration: 1.2 });
    if (history.pushState) history.pushState(null, '', id);
  });
})();
