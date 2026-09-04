/* Soleira: scroll suave (Lenis) e as duas entradas do plano de motion.
   A "soleira" é a lâmina de luz que revela a foto do projeto de baixo para cima,
   e vem do gesto que a própria fotografia da casa mostra.
   Sem JS, ou com movimento reduzido, a página fica inteira e estática. */

(function () {
  'use strict';

  var reduz = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function scrollSuave() {
    if (reduz || typeof window.Lenis !== 'function') { return; }
    var lenis = new window.Lenis({ duration: 1.05, smoothWheel: true });
    function quadro(t) { lenis.raf(t); requestAnimationFrame(quadro); }
    requestAnimationFrame(quadro);

    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var alvo = document.querySelector(a.getAttribute('href'));
        if (!alvo) { return; }
        e.preventDefault();
        lenis.scrollTo(alvo, { offset: -80 });
      });
    });
  }

  function entradas() {
    if (reduz || !('IntersectionObserver' in window)) { return; }

    var blocos = document.querySelectorAll('.secao-cab, .metodo-texto, .decisoes li, .regua li, .escopo-col, .materiais-texto, .faq, .contato-texto, .form');
    var fotos = document.querySelectorAll('.proj img, .materiais-foto img');

    var obsBloco = new IntersectionObserver(function (itens) {
      itens.forEach(function (item, i) {
        if (!item.isIntersecting) { return; }
        setTimeout(function () { item.target.classList.add('dentro'); }, Math.min(i, 4) * 80);
        obsBloco.unobserve(item.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

    Array.prototype.forEach.call(blocos, function (el) {
      el.classList.add('rev');
      obsBloco.observe(el);
    });

    var obsFoto = new IntersectionObserver(function (itens) {
      itens.forEach(function (item) {
        if (!item.isIntersecting) { return; }
        item.target.classList.add('dentro');
        obsFoto.unobserve(item.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.15 });

    Array.prototype.forEach.call(fotos, function (img) {
      img.classList.add('soleira-rev');
      obsFoto.observe(img);
    });

    // Trava de segurança em duas camadas. Primeiro: nada que já esteja na tela
    // fica invisível. Depois: se NADA foi revelado, o observador não está
    // funcionando neste navegador, e aí a página inteira aparece de uma vez.
    // Conteúdo nunca depende da animação (regra de 60-motion.md).
    setTimeout(function () {
      var presos = document.querySelectorAll('.rev:not(.dentro), .soleira-rev:not(.dentro)');
      Array.prototype.forEach.call(presos, function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add('dentro');
        }
      });
      if (!document.querySelector('.dentro')) {
        var todos = document.querySelectorAll('.rev:not(.dentro), .soleira-rev:not(.dentro)');
        Array.prototype.forEach.call(todos, function (el) { el.classList.add('dentro'); });
      }
    }, 1600);
  }

  function inicia() {
    try { scrollSuave(); } catch (e) { /* a página rola normalmente */ }
    try { entradas(); } catch (e) { /* conteúdo já está visível */ }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicia);
  } else {
    inicia();
  }
})();
