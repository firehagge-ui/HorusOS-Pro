/* Débora Reis, rodada 4: os movimentos da Stanzza, com o assunto dela.
   Sem JS, sem GSAP ou com movimento reduzido, a página fica parada e completa (estado final no CSS). */
(function () {
  'use strict';
  var doc = document.documentElement, body = document.body;
  var cab = document.getElementById('cab'), capa = document.querySelector('.capa');

  // ---------- menu ----------
  var bt = document.querySelector('.cab-menu'), menu = document.getElementById('menu');
  function fecharMenu() {
    menu.classList.remove('aberto'); body.classList.remove('menu-aberto');
    bt.setAttribute('aria-expanded', 'false'); bt.firstChild.nodeValue = 'Menu ';
    setTimeout(function () { if (!menu.classList.contains('aberto')) menu.hidden = true; }, 700);
  }
  if (bt && menu) {
    bt.addEventListener('click', function () {
      if (menu.classList.contains('aberto')) return fecharMenu();
      menu.hidden = false; body.classList.add('menu-aberto');
      requestAnimationFrame(function () { menu.classList.add('aberto'); });
      bt.setAttribute('aria-expanded', 'true'); bt.firstChild.nodeValue = 'Fechar ';
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) fecharMenu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('aberto')) { fecharMenu(); bt.focus(); } });
  }

  // ---------- cabeçalho: claro sobre a capa, sólido depois, some ao descer ----------
  var ultimo = 0;
  function topo() {
    var y = window.scrollY, limite = capa ? capa.offsetHeight - 80 : 80;
    cab.classList.toggle('solido', y > limite);
    cab.classList.toggle('some', y > limite + 200 && y > ultimo + 2);
    if (y < ultimo - 2) cab.classList.remove('some');
    ultimo = y;
  }
  window.addEventListener('scroll', topo, { passive: true }); topo();

  // ---------- anotações à mão: no ponto certo da foto (object-fit: cover) ----------
  var cenaFoto = document.querySelector('.cena-foto');
  function notas() {
    if (!cenaFoto) return;
    var img = cenaFoto.querySelector('img'), w = cenaFoto.clientWidth, h = cenaFoto.clientHeight;
    var nw = 1080, nh = 1080, s = Math.max(w / nw, h / nh), dw = nw * s, dh = nh * s;
    var ox = (w - dw) * 0.5, oy = (h - dh) * 0.45;
    cenaFoto.querySelectorAll('.nota').forEach(function (n) {
      n.style.left = (ox + dw * parseFloat(n.getAttribute('data-x')) / 100) + 'px';
      n.style.top = (oy + dh * parseFloat(n.getAttribute('data-y')) / 100) + 'px';
    });
  }
  window.addEventListener('resize', notas); notas();

  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var largo = window.matchMedia('(min-width: 761px)');

  window.addEventListener('load', function () {
    notas();
    if (reduz || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    var ease = 'expo.out';

    // capa: a foto assenta, as linhas sobem
    gsap.from('.capa-foto', { scale: 1.12, duration: 2.2, ease: ease });
    gsap.from('.capa .mao, .capa .linha, .capa-sub', { y: 40, opacity: 0, duration: 1.4, ease: ease, stagger: 0.12, delay: 0.2 });

    // títulos que acendem palavra por palavra
    document.querySelectorAll('.acende').forEach(function (el) {
      el.innerHTML = el.textContent.trim().split(/\s+/).map(function (p) { return '<span class="p">' + p + '</span>'; }).join(' ');
      gsap.to(el.querySelectorAll('.p'), { opacity: 1, stagger: 0.15, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 45%', scrub: true } });
    });

    // os desenhos se traçam
    document.querySelectorAll('.desenho path').forEach(function (p) {
      var l = p.getTotalLength(); p.style.strokeDasharray = l; p.style.strokeDashoffset = l;
      gsap.to(p, { strokeDashoffset: 0, ease: 'none',
        scrollTrigger: { trigger: p.closest('svg'), start: 'top 90%', end: p.closest('.rodape') ? 'top 45%' : 'bottom 55%', scrub: 0.6 } });
    });

    if (!largo.matches) return; // no celular: só o que não fixa a rolagem

    // composição: miniaturas em velocidades diferentes
    gsap.utils.toArray('.flut').forEach(function (f) {
      var v = parseFloat(f.getAttribute('data-vel')) || 0;
      gsap.fromTo(f, { y: -v * 520 }, { y: v * 520, ease: 'none',
        scrollTrigger: { trigger: '.composicao', start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // a cena: a foto enquadrada cresce até a tela, depois a ficha e as anotações
    var cena = document.querySelector('.cena'), fixa = document.querySelector('.cena-fixa');
    if (cena && fixa) {
      cena.style.height = '300vh'; fixa.style.position = 'sticky'; fixa.style.top = '0';
      var tl = gsap.timeline({ scrollTrigger: { trigger: cena, start: 'top top', end: 'bottom bottom', scrub: 0.8 } });
      tl.fromTo('.cena-foto', { clipPath: 'inset(16% 28% 16% 28%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.inOut', duration: 1 }, 0)
        .fromTo('.cena-foto img', { scale: 1.22 }, { scale: 1, ease: 'power2.inOut', duration: 1 }, 0)
        .fromTo('.cena-txt, .cena-ficha, .cena-cont', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.06 }, 0.75)
        .fromTo('.cena-acoes', { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0.95)
        .fromTo('.nota', { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.3, stagger: 0.12 }, 1.05)
        .to({}, { duration: 0.35 });
    }

    // galeria: os painéis deslizam de lado enquanto a página desce
    var gal = document.querySelector('.galeria'), gfixa = document.querySelector('.galeria-fixa'), trilho = document.querySelector('.trilho');
    if (gal && gfixa && trilho) {
      gfixa.style.position = 'sticky'; gfixa.style.top = '0'; gfixa.style.height = '100vh';
      gfixa.style.display = 'flex'; gfixa.style.alignItems = 'center'; gfixa.style.padding = '0';
      trilho.style.overflow = 'visible'; trilho.style.scrollSnapType = 'none';
      document.querySelector('.galeria-barra').style.display = 'block';
      var dist = function () { return trilho.scrollWidth - window.innerWidth; };
      var medir = function () { gal.style.height = (dist() + window.innerHeight) + 'px'; };
      medir(); window.addEventListener('resize', function () { medir(); ScrollTrigger.refresh(); });
      gsap.to(trilho, { x: function () { return -dist(); }, ease: 'none',
        scrollTrigger: { trigger: gal, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true } });
      gsap.to('.galeria-barra i', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: gal, start: 'top top', end: 'bottom bottom', scrub: true } });
      gsap.utils.toArray('.painel figure img').forEach(function (im) {
        gsap.fromTo(im, { scale: 1.08 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: gal, start: 'top top', end: 'bottom bottom', scrub: true } });
      });
    }

    // faixa: as fotos dos gatos sobem em ritmos diferentes
    gsap.fromTo('.fa', { y: 80 }, { y: -60, ease: 'none', scrollTrigger: { trigger: '.faixa', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('.fb', { y: 160 }, { y: -120, ease: 'none', scrollTrigger: { trigger: '.faixa', start: 'top bottom', end: 'bottom top', scrub: true } });

    // as etapas entram uma a uma
    gsap.utils.toArray('.etapas li, .perguntas details').forEach(function (li) {
      gsap.from(li, { y: 40, opacity: 0, duration: 1.1, ease: ease, scrollTrigger: { trigger: li, start: 'top 88%' } });
    });

    ScrollTrigger.refresh(); notas();
  });
})();
