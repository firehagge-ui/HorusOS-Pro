/* Débora Reis, rodada 5: a prancha, o carrossel dos projetos e os desenhos que se traçam uma vez.
   Sem JS, sem GSAP ou com movimento reduzido, a página fica parada e completa (estado final no CSS);
   sem JS, o carrossel vira uma faixa que rola de lado. */
(function () {
  'use strict';
  var body = document.body;
  var cab = document.getElementById('cab'), capa = document.querySelector('.capa');
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var largo = window.matchMedia('(min-width: 761px)');

  // ---------- menu ----------
  var bt = document.querySelector('.cab-menu'), menu = document.getElementById('menu');
  function fecharMenu() {
    menu.classList.remove('aberto'); body.classList.remove('menu-aberto');
    bt.setAttribute('aria-expanded', 'false'); bt.textContent = 'Menu';
    setTimeout(function () { if (!menu.classList.contains('aberto')) menu.hidden = true; }, 700);
  }
  if (bt && menu) {
    bt.addEventListener('click', function () {
      if (menu.classList.contains('aberto')) return fecharMenu();
      menu.hidden = false; body.classList.add('menu-aberto');
      requestAnimationFrame(function () { menu.classList.add('aberto'); });
      bt.setAttribute('aria-expanded', 'true'); bt.textContent = 'Fechar';
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) fecharMenu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('aberto')) { fecharMenu(); bt.focus(); } });
  }

  // ---------- cabeçalho: some ao descer, volta ao subir ----------
  var ultimo = 0;
  function topo() {
    var y = window.scrollY, limite = capa ? capa.offsetHeight - 80 : 80;
    cab.classList.toggle('solido', y > 40);
    cab.classList.toggle('some', y > limite && y > ultimo + 2);
    if (y < ultimo - 2) cab.classList.remove('some');
    ultimo = y;
  }
  window.addEventListener('scroll', topo, { passive: true }); topo();

  // ---------- anotações à mão: no ponto certo da foto (object-fit: cover + o zoom do carrossel) ----------
  function notas() {
    var zoom = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--zoom')) || 1;
    document.querySelectorAll('.anotada').forEach(function (fig) {
      var w = fig.clientWidth, h = fig.clientHeight; if (!w || !h) return;
      var nw = +fig.getAttribute('data-w'), nh = +fig.getAttribute('data-h'), oy = parseFloat(fig.getAttribute('data-oy') || '.5');
      var k = document.querySelector('.js-pj') && fig.closest('.pj') ? zoom : 1;
      var s = Math.max(w / nw, h / nh), dw = nw * s, dh = nh * s, ox = (w - dw) * 0.5, oyy = (h - dh) * oy;
      fig.querySelectorAll('.nota').forEach(function (n) {
        var x = ox + dw * parseFloat(n.getAttribute('data-x')) / 100, y = oyy + dh * parseFloat(n.getAttribute('data-y')) / 100;
        n.style.left = (w / 2 + (x - w / 2) * k) + 'px';
        n.style.top = (h / 2 + (y - h / 2) * k) + 'px';
      });
    });
  }

  // ---------- projetos: o carrossel ----------
  var pj = document.querySelector('.projetos'), irPara = null;
  if (pj) (function () {
    var janela = pj.querySelector('.pj-janela'), trilho = pj.querySelector('.pj-trilho');
    var slides = [].slice.call(pj.querySelectorAll('.pj')), nomes = [].slice.call(pj.querySelectorAll('.pj-indice button'));
    var ant = pj.querySelector('.pj-ant'), prox = pj.querySelector('.pj-prox'), cont = pj.querySelector('.pj-cont b');
    var aviso = document.getElementById('pj-aviso'), barra = pj.querySelector('.pj-barra i');
    var n = slides.length, atual = 0;
    pj.classList.add('js-pj');
    janela.scrollLeft = 0;

    var refazer = null;
    function altura() {
      var antes = janela.style.height;
      janela.style.height = largo.matches ? '' : slides[atual].offsetHeight + 'px';
      // a página muda de altura no celular: os gatilhos da rolagem precisam ser medidos de novo
      if (antes !== janela.style.height && window.ScrollTrigger) {
        clearTimeout(refazer); refazer = setTimeout(function () { ScrollTrigger.refresh(); }, 300);
      }
    }
    function ir(j, anunciar) {
      j = Math.max(0, Math.min(n - 1, j));
      atual = j;
      trilho.style.transform = 'translate3d(' + (-j * 100) + '%,0,0)';
      slides.forEach(function (s, k) {
        var on = k === j;
        s.classList.toggle('ativo', on);
        s.inert = !on;
        s.setAttribute('aria-hidden', on ? 'false' : 'true');
        // as fotos ficam um pouco para trás do quadro: profundidade na troca
        s.style.setProperty('--px', (Math.max(-1, Math.min(1, k - j)) * -6) + '%');
      });
      nomes.forEach(function (b, k) { b.setAttribute('aria-current', k === j ? 'true' : 'false'); });
      ant.disabled = j === 0; prox.disabled = j === n - 1;
      cont.textContent = ('0' + (j + 1)).slice(-2);
      barra.style.transform = 'scaleX(' + ((j + 1) / n) + ')';
      if (anunciar) aviso.textContent = 'Projeto ' + (j + 1) + ' de ' + n + ': ' + slides[j].getAttribute('aria-label').replace(/^\d+ de \d+: /, '');
      altura();
    }
    irPara = ir;
    ant.addEventListener('click', function () { ir(atual - 1, true); });
    prox.addEventListener('click', function () { ir(atual + 1, true); });
    nomes.forEach(function (b, k) { b.addEventListener('click', function () { ir(k, true); }); });
    pj.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { ir(atual + 1, true); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { ir(atual - 1, true); e.preventDefault(); }
    });

    // arrastar (dedo ou mouse): segue o gesto e decide pela distância ou pela velocidade
    var x0 = 0, y0 = 0, dx = 0, t0 = 0, pid = null, decidido = false, arrastando = false, segurarClique = false;
    janela.addEventListener('dragstart', function (e) { e.preventDefault(); });
    janela.addEventListener('pointerdown', function (e) {
      if (e.button > 0) return;
      x0 = e.clientX; y0 = e.clientY; dx = 0; t0 = performance.now(); pid = e.pointerId; decidido = false; arrastando = false;
    });
    janela.addEventListener('pointermove', function (e) {
      if (pid !== e.pointerId) return;
      var mx = e.clientX - x0, my = e.clientY - y0;
      if (!decidido) {
        if (Math.abs(mx) < 8 && Math.abs(my) < 8) return;
        decidido = true; arrastando = Math.abs(mx) > Math.abs(my);
        if (!arrastando) { pid = null; return; }
        try { janela.setPointerCapture(pid); } catch (err) {}
        pj.classList.add('arrastando');
      }
      dx = mx;
      var w = janela.clientWidth, borda = (atual === 0 && dx > 0) || (atual === n - 1 && dx < 0);
      trilho.style.transform = 'translate3d(' + (-atual * w + (borda ? dx * 0.28 : dx)) + 'px,0,0)';
    });
    function soltar(e) {
      if (pid === null || (e && e.pointerId !== pid)) return;
      pid = null;
      if (!arrastando) return;
      arrastando = false; pj.classList.remove('arrastando');
      var w = janela.clientWidth, v = Math.abs(dx) / Math.max(1, performance.now() - t0), alvo = atual;
      if (Math.abs(dx) > w * 0.16 || (v > 0.45 && Math.abs(dx) > 30)) alvo = atual + (dx < 0 ? 1 : -1);
      ir(alvo, alvo !== atual);
      segurarClique = true; setTimeout(function () { segurarClique = false; }, 60);
    }
    janela.addEventListener('pointerup', soltar);
    janela.addEventListener('pointercancel', soltar);
    janela.addEventListener('click', function (e) { if (segurarClique) { e.preventDefault(); e.stopPropagation(); } }, true);

    // o gesto de lado no trackpad também passa de projeto
    var acum = 0, travado = false;
    janela.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      if (travado) return;
      acum += e.deltaX;
      if (Math.abs(acum) > 40) {
        ir(atual + (acum > 0 ? 1 : -1), true); acum = 0; travado = true;
        setTimeout(function () { travado = false; }, 1000);
      }
    }, { passive: false });

    window.addEventListener('resize', function () {
      trilho.style.transition = 'none'; ir(atual, false); notas();
      trilho.offsetHeight; trilho.style.transition = '';
    });
    window.addEventListener('load', function () {
      pj.querySelectorAll('img[loading="lazy"]').forEach(function (im) { im.loading = 'eager'; });
      altura(); notas();
    });
    ir(0, false);
  })();
  notas();
  window.addEventListener('resize', notas);

  // ---------- desenhos que se traçam uma vez, em ordem (estrutura, móveis, detalhes, o gato, a cota) ----------
  function tracar(svg) {
    if (!svg || reduz || !window.gsap) return;
    var paths = svg.querySelectorAll('path');
    paths.forEach(function (p) { var l = p.getTotalLength(); p.style.strokeDasharray = l + ' ' + l; p.style.strokeDashoffset = l; });
    var corpo = svg.querySelectorAll('.gato-corpo'), luz = svg.querySelector('.luz'), cota = svg.querySelector('text.cota');
    gsap.set(corpo, { fillOpacity: 0 });
    if (luz) gsap.set(luz, { opacity: 0 });
    if (cota) gsap.set(cota, { opacity: 0, y: 6 });
    var tl = gsap.timeline({ paused: true, onComplete: function () { svg.classList.add('vivo'); } });
    var q = function (c) { return svg.querySelectorAll('path.' + c); };
    tl.to(q('d0'), { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' })
      .to(q('d1'), { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut', stagger: 0.12 }, '-=0.45')
      .to(q('d2'), { strokeDashoffset: 0, duration: 0.9, ease: 'power1.inOut', stagger: 0.07 }, '-=0.7');
    if (luz) tl.to(luz, { opacity: 1, duration: 1.6, ease: 'power1.out' }, '-=0.6');
    tl.to(q('d3'), { strokeDashoffset: 0, duration: 1.3, ease: 'power2.inOut', stagger: 0.25 }, '-=1.1')
      .to(corpo, { fillOpacity: 1, duration: 0.8, ease: 'power1.out' }, '-=0.5')
      .to(q('d4'), { strokeDashoffset: 0, duration: 0.7, ease: 'power2.out' }, '-=0.4');
    if (cota) tl.to(cota, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, '-=0.3');
    ScrollTrigger.create({ trigger: svg, start: 'top 82%', once: true, onEnter: function () { tl.play(); } });
  }

  window.addEventListener('load', function () {
    notas();
    if (reduz || !window.gsap || !window.ScrollTrigger) {
      document.querySelectorAll('.desenho').forEach(function (s) { if (!reduz) s.classList.add('vivo'); });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    var ease = 'expo.out';

    // a prancha: a foto sobe do papel, as linhas do título saem da máscara, a seta se desenha, o carimbo assenta
    gsap.from('.capa-foto', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut' });
    gsap.from('.capa-foto img', { scale: 1.18, duration: 2.4, ease: ease });
    gsap.from('.capa h1 .linha > span', { yPercent: 108, duration: 1.3, ease: ease, stagger: 0.12, delay: 0.45 });
    gsap.from('.carimbo > div', { opacity: 0, y: 14, duration: 1, ease: ease, stagger: 0.06, delay: 0.9 });
    gsap.from('.capa-mao .mao', { opacity: 0, x: -12, duration: 1.2, ease: ease, delay: 1.1 });
    document.querySelectorAll('.seta path').forEach(function (p, i) {
      var l = p.getTotalLength(); p.style.strokeDasharray = l; p.style.strokeDashoffset = l;
      gsap.to(p, { strokeDashoffset: 0, duration: i ? 0.35 : 0.9, ease: 'power2.inOut', delay: i ? 2.15 : 1.3 });
    });

    // títulos que acendem palavra por palavra
    document.querySelectorAll('.acende').forEach(function (el) {
      el.innerHTML = el.textContent.trim().split(/\s+/).map(function (p) { return '<span class="p">' + p + '</span>'; }).join(' ');
      gsap.to(el.querySelectorAll('.p'), { opacity: 1, stagger: 0.15, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 45%', scrub: true } });
    });

    tracar(document.querySelector('.desenho-estante'));
    tracar(document.querySelector('.desenho-rodape'));

    // as etapas e as perguntas entram uma a uma
    gsap.utils.toArray('.etapas li, .perguntas details').forEach(function (li) {
      gsap.from(li, { y: 40, opacity: 0, duration: 1.1, ease: ease, scrollTrigger: { trigger: li, start: 'top 88%' } });
    });

    if (!largo.matches) { ScrollTrigger.refresh(); return; } // no celular: nada preso à rolagem

    // composição: miniaturas em velocidades diferentes
    gsap.utils.toArray('.flut').forEach(function (f) {
      var v = parseFloat(f.getAttribute('data-vel')) || 0;
      gsap.fromTo(f, { y: -v * 520 }, { y: v * 520, ease: 'none',
        scrollTrigger: { trigger: '.composicao', start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // faixa: as fotos dos gatos sobem em ritmos diferentes
    gsap.fromTo('.fa', { y: 50 }, { y: -40, ease: 'none', scrollTrigger: { trigger: '.faixa', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('.fb', { y: 120 }, { y: -90, ease: 'none', scrollTrigger: { trigger: '.faixa', start: 'top bottom', end: 'bottom top', scrub: true } });

    ScrollTrigger.refresh(); notas();
  });
})();
