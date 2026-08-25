/* BASALT — motion. Teto: 1 assinatura (a seção do mecanismo). Tudo respeita
   prefers-reduced-motion; sem JS, o conteúdo aparece igual (fallback no CSS). */
(function () {
  'use strict';

  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduz) {
    // Garante visibilidade total sem depender de nada.
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.style.opacity = 1; el.style.transform = 'none';
    });
    var t = document.querySelector('.reveal-titulo');
    if (t) t.style.visibility = 'visible';
    return;
  }

  // --- Scroll suave (Lenis) ---
  var lenis;
  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }

  if (!window.gsap) return;
  var gsap = window.gsap;

  if (window.ScrollTrigger) {
    gsap.registerPlugin(window.ScrollTrigger);
    if (lenis) lenis.on('scroll', window.ScrollTrigger.update);
  }

  // --- Título do hero por palavra (assinatura de entrada) ---
  function revelaTitulo() {
    var alvo = document.querySelector('.reveal-titulo');
    if (!alvo) return;
    if (window.SplitText) {
      gsap.registerPlugin(window.SplitText);
      var split = new window.SplitText(alvo, { type: 'words' });
      gsap.set(alvo, { visibility: 'visible' });
      gsap.from(split.words, {
        opacity: 0, y: 24, duration: 0.7, ease: 'power3.out', stagger: 0.08
      });
    } else {
      alvo.style.visibility = 'visible';
    }
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(revelaTitulo);
  } else {
    revelaTitulo();
  }

  if (!window.ScrollTrigger) {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.style.opacity = 1; el.style.transform = 'none';
    });
    return;
  }

  // --- Entrada em cascata (stagger) nas listas ---
  [
    { escopo: '.passos', itens: '.passo' },
    { escopo: '.produtos', itens: '.produto' },
    { escopo: '.nao-lista', itens: 'li' }
  ].forEach(function (g) {
    var cont = document.querySelector(g.escopo);
    if (!cont) return;
    gsap.to(cont.querySelectorAll(g.itens), {
      opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1,
      scrollTrigger: { trigger: cont, start: 'top 82%' }
    });
  });

  // --- ASSINATURA: a seção do mecanismo ---
  // O cristal fica preso (sticky por CSS) enquanto as camadas da dose se revelam
  // uma a uma; a última (o total) "acende" no cobre. Encena a pureza, não afirma.
  var camadas = gsap.utils.toArray('.camada');
  camadas.forEach(function (cam) {
    gsap.set(cam, { opacity: 0.28 });
    gsap.to(cam, {
      opacity: 1,
      duration: 0.5,
      ease: 'power1.out',
      scrollTrigger: { trigger: cam, start: 'top 72%', end: 'top 45%', scrub: true }
    });
  });

  // Parallax sutil do cristal preso, num eixo só (escala), acompanhando a seção.
  var cristal = document.querySelector('.cristal');
  if (cristal) {
    gsap.to(cristal, {
      scale: 1.04, ease: 'none',
      scrollTrigger: { trigger: '.dentro', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

})();
