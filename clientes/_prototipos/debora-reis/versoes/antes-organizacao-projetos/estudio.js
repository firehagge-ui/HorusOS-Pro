/* Débora Reis, rodada 6: a capa da rodada 4 de volta, "Nunca a mesma casa" com os objetos de parede, os projetos em
   tela cheia (um ambiente por vez, da direita para a esquerda, também sozinho) e os desenhos que se traçam uma vez.
   Sem JS, sem GSAP ou com movimento reduzido, a página fica parada e completa (estado final no CSS);
   sem JS, os projetos viram uma faixa que rola de lado. */
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
    var y = window.scrollY, limite = capa ? capa.offsetHeight - 80 : 40;
    cab.classList.toggle('solido', y > limite);
    cab.classList.toggle('some', y > limite + 200 && y > ultimo + 2);
    if (y < ultimo - 2) cab.classList.remove('some');
    ultimo = y;
  }
  if (cab) { window.addEventListener('scroll', topo, { passive: true }); topo(); }

  // ---------- anotações à mão: no ponto certo da foto (object-fit: cover); a que não cabe na tela some ----------
  function notas() {
    document.querySelectorAll('.anotada').forEach(function (fig) {
      var w = fig.clientWidth, h = fig.clientHeight, img = fig.querySelector('img'); if (!w || !h || !img) return;
      var nw = +fig.getAttribute('data-w'), nh = +fig.getAttribute('data-h');
      var pos = getComputedStyle(img).objectPosition.split(' '), px = parseFloat(pos[0]) / 100, py = parseFloat(pos[1]) / 100;
      var s = Math.max(w / nw, h / nh), dw = nw * s, dh = nh * s, ox = (w - dw) * px, oy = (h - dh) * py;
      fig.querySelectorAll('.nota').forEach(function (n) {
        var x = ox + dw * parseFloat(n.getAttribute('data-x')) / 100, y = oy + dh * parseFloat(n.getAttribute('data-y')) / 100;
        n.style.left = x + 'px'; n.style.top = y + 'px';
        n.style.display = '';
        var r = n.getBoundingClientRect(), f = fig.getBoundingClientRect();
        // longe do número no topo e do texto embaixo, e inteira dentro da foto
        var cabe = y > 150 && y < h - 330 && r.left > f.left + 12 && r.right < f.right - 12;
        n.style.display = cabe ? '' : 'none';
      });
    });
  }

  // ---------- projetos: um ambiente por vez ----------
  var pj = document.querySelector('.projetos');
  if (pj) (function () {
    var palco = pj.querySelector('.pj-palco');
    var slides = [].slice.call(pj.querySelectorAll('.pj')), nomes = [].slice.call(pj.querySelectorAll('.pj-indice button'));
    var cont = pj.querySelector('.pj-cont b'), aviso = document.getElementById('pj-aviso');
    var pausa = pj.querySelector('.pj-pausa'), batente = pj.querySelector('.pj-batente');
    var n = slides.length, atual = 0, TEMPO = 7;
    var anim = !!window.gsap && !reduz;
    var tl = null, dirAtual = 0, alvo = -1, kb = null, relogio = null;
    var tocando = !reduz && !!window.gsap, visivel = false, arrastando = false;
    pj.classList.add('js-pj');

    function wrap(j) { return (j % n + n) % n; }
    function cam(j) { return slides[j].querySelector('.pj-cam'); }
    function partes(j) { return slides[j].querySelectorAll('.pj-txt > *'); }
    function marcar(j, anunciar) {
      slides.forEach(function (s, k) {
        var on = k === j;
        s.classList.toggle('ativo', on); s.inert = !on; s.setAttribute('aria-hidden', on ? 'false' : 'true');
      });
      nomes.forEach(function (b, k) { b.setAttribute('aria-current', k === j ? 'true' : 'false'); });
      indicar(j);
      if (anunciar) aviso.textContent = 'Projeto ' + slides[j].getAttribute('aria-label');
    }

    // o nome e o número mudam assim que a passagem começa
    function indicar(j) {
      nomes.forEach(function (b, k) { b.setAttribute('aria-current', k === j ? 'true' : 'false'); });
      cont.textContent = ('0' + (j + 1)).slice(-2);
    }

    // enquanto o ambiente está na tela, a câmera entra devagar
    function respirar() {
      if (kb) kb.kill();
      if (!anim) return;
      kb = gsap.to(cam(atual), { scale: 1.07, duration: TEMPO + 4, ease: 'none' });
    }
    // o relógio da passagem automática corre no fio embaixo do nome
    function relogioNovo() {
      if (relogio) relogio.kill();
      nomes.forEach(function (b) { b.querySelector('i').style.transform = 'scaleX(0)'; });
      relogio = null;
      if (!window.gsap) return;
      relogio = gsap.fromTo(nomes[atual].querySelector('i'), { scaleX: 0 }, { scaleX: 1, duration: TEMPO, ease: 'none', paused: true,
        onComplete: function () { passar(atual + 1, 1); } });
      atualizarRelogio();
    }
    function atualizarRelogio() {
      if (!relogio) return;
      if (tocando && visivel && !document.hidden && !arrastando && !tl) relogio.play(); else relogio.pause();
    }

    // a passagem: a câmera atravessa o ambiente que sai; o próximo entra pela porta (o fio claro), da direita
    function preparar(para, dir) {
      var A = slides[atual], B = slides[para], na = A.querySelector('.notas'), nb = B.querySelector('.notas');
      if (kb) kb.kill();
      B.classList.add('entrando');
      var t = gsap.timeline({ paused: true,
        onComplete: function () { chegar(para); },
        onReverseComplete: function () { desfazer(para); respirar(); atualizarRelogio(); } });
      t.fromTo(B, { clipPath: dir > 0 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'power3.inOut' }, 0)
        .fromTo(batente, { left: dir > 0 ? '100%' : '0%', opacity: 1 }, { left: dir > 0 ? '0%' : '100%', duration: 1.3, ease: 'power3.inOut' }, 0)
        .to(batente, { opacity: 0, duration: 0.25 }, 1.05)
        .to(cam(atual), { scale: 1.24, xPercent: -8 * dir, duration: 1.3, ease: 'power2.in' }, 0)
        .to(A.querySelector('.pj-foto'), { opacity: 0.3, duration: 1.3, ease: 'power2.in' }, 0)
        .fromTo(cam(para), { scale: 1.14, xPercent: 12 * dir }, { scale: 1, xPercent: 0, duration: 1.6, ease: 'power3.out' }, 0.05)
        .to(partes(atual), { opacity: 0, y: -14, duration: 0.35, stagger: 0.03, ease: 'power2.in' }, 0)
        .fromTo(partes(para), { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.07, ease: 'expo.out' }, 0.75);
      if (na) t.to(na, { opacity: 0, duration: 0.3 }, 0);
      if (nb) t.fromTo(nb, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.15);
      return t;
    }
    function desfazer(para) {
      var B = slides[para], nb = B.querySelector('.notas');
      B.classList.remove('entrando');
      gsap.set(B, { clearProps: 'clipPath' });
      gsap.set(cam(para), { clearProps: 'transform' });
      gsap.set(partes(para), { clearProps: 'opacity,transform' });
      if (nb) gsap.set(nb, { clearProps: 'opacity' });
      gsap.set(batente, { opacity: 0 });
      tl = null;
    }
    function chegar(para) {
      var A = slides[atual], na = A.querySelector('.notas');
      gsap.set(A.querySelector('.pj-foto'), { clearProps: 'opacity' });
      gsap.set(cam(atual), { clearProps: 'transform' });
      gsap.set(partes(atual), { clearProps: 'opacity,transform' });
      if (na) gsap.set(na, { clearProps: 'opacity' });
      gsap.set(slides[para], { clearProps: 'clipPath' });
      slides[para].classList.remove('entrando');
      atual = para; tl = null;
      marcar(para, true); notas(); respirar(); relogioNovo();
    }
    function passar(j, dir) {
      if (tl || arrastando) return;
      j = wrap(j); if (j === atual) return;
      if (!anim) { atual = j; marcar(j, true); notas(); relogioNovo(); return; }
      if (relogio) relogio.pause();
      indicar(j); tl = preparar(j, dir); tl.play();
    }

    pj.querySelector('.pj-ant').addEventListener('click', function () { passar(atual - 1, -1); });
    pj.querySelector('.pj-prox').addEventListener('click', function () { passar(atual + 1, 1); });
    nomes.forEach(function (b, k) { b.addEventListener('click', function () { passar(k, k > atual ? 1 : -1); }); });
    pj.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { passar(atual + 1, 1); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { passar(atual - 1, -1); e.preventDefault(); }
    });
    if (pausa) {
      if (!tocando) { pausa.setAttribute('aria-pressed', 'true'); pausa.setAttribute('aria-label', 'Ligar a passagem automática'); }
      pausa.addEventListener('click', function () {
        tocando = !tocando;
        pausa.setAttribute('aria-pressed', tocando ? 'false' : 'true');
        pausa.setAttribute('aria-label', tocando ? 'Pausar a passagem automática' : 'Ligar a passagem automática');
        atualizarRelogio();
      });
    }

    // arrastar (dedo ou mouse): o próximo ambiente entra junto com o gesto; solta e decide pela distância ou velocidade
    var x0 = 0, y0 = 0, dx = 0, t0 = 0, pid = null, decidido = false, segurarClique = false;
    palco.addEventListener('dragstart', function (e) { e.preventDefault(); });
    palco.addEventListener('pointerdown', function (e) {
      if (e.button > 0 || tl || e.target.closest('.pj-hud button, .pj-hud a')) return;
      x0 = e.clientX; y0 = e.clientY; dx = 0; t0 = performance.now(); pid = e.pointerId; decidido = false; dirAtual = 0;
    });
    palco.addEventListener('pointermove', function (e) {
      if (pid !== e.pointerId) return;
      var mx = e.clientX - x0, my = e.clientY - y0;
      if (!decidido) {
        if (Math.abs(mx) < 8 && Math.abs(my) < 8) return;
        decidido = true;
        if (Math.abs(mx) <= Math.abs(my)) { pid = null; return; }
        arrastando = true; pj.classList.add('arrastando'); atualizarRelogio();
        try { palco.setPointerCapture(pid); } catch (err) {}
      }
      dx = mx;
      if (!anim || dx === 0) return;
      var dir = dx < 0 ? 1 : -1;
      if (dir !== dirAtual) {
        if (tl) { tl.progress(0, true).kill(); desfazer(alvo); }
        dirAtual = dir; alvo = wrap(atual + dir); tl = preparar(alvo, dir);
      }
      tl.progress(Math.min(0.9, Math.abs(dx) / palco.clientWidth * 1.1));
    });
    function soltar(e) {
      if (pid === null || (e && e.pointerId !== pid)) return;
      pid = null;
      if (!arrastando) return;
      arrastando = false; pj.classList.remove('arrastando');
      segurarClique = true; setTimeout(function () { segurarClique = false; }, 60);
      var w = palco.clientWidth, v = Math.abs(dx) / Math.max(1, performance.now() - t0);
      var vai = Math.abs(dx) > w * 0.18 || (v > 0.45 && Math.abs(dx) > 30);
      if (!anim) { if (vai) passar(atual + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1); atualizarRelogio(); return; }
      if (!tl) { atualizarRelogio(); return; }
      if (vai) { indicar(alvo); tl.timeScale(1.25).play(); } else tl.timeScale(1.6).reverse();
    }
    palco.addEventListener('pointerup', soltar);
    palco.addEventListener('pointercancel', soltar);
    palco.addEventListener('click', function (e) { if (segurarClique) { e.preventDefault(); e.stopPropagation(); } }, true);

    // o gesto de lado no trackpad também passa de ambiente
    var acum = 0, travado = false;
    palco.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      if (travado) return;
      acum += e.deltaX;
      if (Math.abs(acum) > 40) {
        var d = acum > 0 ? 1 : -1; passar(atual + d, d); acum = 0; travado = true;
        setTimeout(function () { travado = false; }, 1300);
      }
    }, { passive: false });

    // a passagem automática só corre com a seção na tela e a aba aberta
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (its) { visivel = its[0].isIntersecting; atualizarRelogio(); }, { threshold: 0.55 }).observe(palco);
    }
    document.addEventListener('visibilitychange', atualizarRelogio);
    window.addEventListener('resize', notas);
    window.addEventListener('load', function () {
      pj.querySelectorAll('img[loading="lazy"]').forEach(function (im) { im.loading = 'eager'; });
      notas();
    });

    // vindo de "Todos os projetos": abre no ambiente escolhido (?p=3)
    var q = parseInt(new URLSearchParams(location.search).get('p'), 10);
    if (q >= 1 && q <= n) atual = q - 1;
    marcar(atual, false); respirar(); relogioNovo();
  })();
  notas();

  // ---------- faixa de fotos de um projeto (página Todos os projetos) ----------
  document.querySelectorAll('.obra-fotos').forEach(function (bloco) {
    var faixa = bloco.querySelector('.obra-faixa'), fio = bloco.querySelector('.obra-fio i');
    var ant = bloco.querySelector('.obra-ant'), prox = bloco.querySelector('.obra-prox');
    if (!faixa || !ant || !prox) return;
    function passo() { var f = faixa.querySelector('figure'); return f ? f.offsetWidth + 10 : faixa.clientWidth; }
    ant.addEventListener('click', function () { faixa.scrollBy({ left: -passo(), behavior: reduz ? 'auto' : 'smooth' }); });
    prox.addEventListener('click', function () { faixa.scrollBy({ left: passo(), behavior: reduz ? 'auto' : 'smooth' }); });
    function medir() {
      var max = faixa.scrollWidth - faixa.clientWidth, k = max > 0 ? faixa.scrollLeft / max : 1;
      if (fio) fio.style.transform = 'scaleX(' + Math.max(faixa.clientWidth / faixa.scrollWidth, k) + ')';
      ant.disabled = faixa.scrollLeft < 4; prox.disabled = faixa.scrollLeft > max - 4;
    }
    faixa.addEventListener('scroll', medir, { passive: true }); window.addEventListener('resize', medir); medir();
  });

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

    // capa (rodada 4): a foto assenta, as linhas sobem
    if (capa) {
      gsap.from('.capa-foto', { scale: 1.12, duration: 2.2, ease: ease });
      gsap.from('.capa .mao, .capa .linha, .capa-sub', { y: 40, opacity: 0, duration: 1.4, ease: ease, stagger: 0.12, delay: 0.2 });
    }

    // títulos que acendem palavra por palavra
    document.querySelectorAll('.acende').forEach(function (el) {
      el.innerHTML = el.textContent.trim().split(/\s+/).map(function (p) { return '<span class="p">' + p + '</span>'; }).join(' ');
      gsap.to(el.querySelectorAll('.p'), { opacity: 1, stagger: 0.15, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 45%', scrub: true } });
    });

    tracar(document.querySelector('.risco'));
    tracar(document.querySelector('.desenho-estante'));
    tracar(document.querySelector('.desenho-rodape'));

    // os objetos de parede: a etiqueta à mão aparece depois que o objeto chega
    gsap.utils.toArray('.flut figcaption').forEach(function (c) {
      gsap.from(c, { opacity: 0, x: -10, duration: 1, ease: ease, scrollTrigger: { trigger: c, start: 'top 90%' } });
    });

    // as etapas e as perguntas entram uma a uma
    gsap.utils.toArray('.etapas li, .perguntas details').forEach(function (li) {
      gsap.from(li, { y: 40, opacity: 0, duration: 1.1, ease: ease, scrollTrigger: { trigger: li, start: 'top 88%' } });
    });

    if (!largo.matches) { ScrollTrigger.refresh(); return; } // no celular: nada preso à rolagem

    // os objetos em velocidades diferentes (a estrutura que fica da rodada 4)
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
