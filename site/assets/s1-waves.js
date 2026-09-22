/**
 * S1-WAVES: Fundo ondulado / wireframe contour lines da Seção 1 (Horus)
 * Inspirado nos prints 1 e 2 de referência do Marcelo (21/09/2026).
 *
 * Características:
 * - Ondulações orgânicas em perspectiva estilo topografia digital / soundwaves
 * - Traçado nítido em 1x e 2x DPR
 * - IntersectionObserver: pausa o loop quando fora de tela (0% consumo de CPU)
 * - Dispara a classe .ativo na .s1-secao ao entrar na viewport (Motion)
 * - Respeita prefers-reduced-motion (desenha 1 quadro estático)
 */
(function () {
  'use strict';

  var canvas = document.querySelector('.s1-waves-canvas');
  if (!canvas) return;

  var secao = canvas.closest('.s1-secao') || canvas.parentElement;
  if (!secao) return;

  var ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  var animId = null;
  var isVisible = false;
  var startTime = performance.now();
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var rect = secao.getBoundingClientRect();
    var w = Math.max(1, Math.floor(rect.width * dpr));
    var h = Math.max(1, Math.floor(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  }

  function render(now) {
    var elapsed = (now - startTime) * 0.001;
    var w = canvas.width;
    var h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    var linesCount = 28;
    var stepY = h / (linesCount + 1);

    for (var i = 0; i < linesCount; i++) {
      var baseY = stepY * (i + 0.8);
      ctx.beginPath();

      var stepX = Math.max(8, Math.floor(w / 120));
      for (var x = 0; x <= w; x += stepX) {
        var normX = x / w;

        // Pacote de onda concentrado atrás e à direita do bloco de texto (normX ~ 0.35)
        var envelope = Math.exp(-Math.pow((normX - 0.36) / 0.32, 2));
        var wave1 = Math.sin(normX * 11 + elapsed * 0.45 + i * 0.28) * (12 * (canvas.height / 700));
        var wave2 = Math.cos(normX * 17 - elapsed * 0.38 + i * 0.18) * (7 * (canvas.height / 700));
        var wave3 = Math.sin(normX * 5.5 + elapsed * 0.22) * (5 * (canvas.height / 700));
        var y = baseY + (wave1 + wave2 + wave3) * (0.22 + 0.78 * envelope);

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      var linePos = i / linesCount;
      var alpha = (0.015 + 0.055 * Math.sin(linePos * Math.PI));
      ctx.strokeStyle = 'rgba(41, 117, 233, ' + alpha.toFixed(4) + ')';
      ctx.lineWidth = 1.3;
      ctx.stroke();
    }

    if (isVisible && !reducedMotion) {
      animId = requestAnimationFrame(render);
    }
  }

  function startLoop() {
    if (!animId && !reducedMotion) {
      animId = requestAnimationFrame(render);
    }
  }

  function stopLoop() {
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }

  resize();
  window.addEventListener('resize', function () {
    resize();
    if (!animId) render(performance.now());
  }, { passive: true });

  // IntersectionObserver
  if ('IntersectionObserver' in window) {
    var gatilho = secao.querySelector('.s1-bloco') || secao;

    // Observador para o Motion (ativa assim que o bloco de conteúdo começa a entrar)
    var motionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          secao.classList.add('ativo');
          motionObserver.disconnect();
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    motionObserver.observe(gatilho);

    // Observador para o loop do Canvas (pausa quando fora de tela)
    var canvasObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          isVisible = true;
          startLoop();
        } else {
          isVisible = false;
          stopLoop();
        }
      });
    }, { threshold: 0 });

    canvasObserver.observe(secao);
  } else {
    secao.classList.add('ativo');
    isVisible = true;
    startLoop();
  }

  if (reducedMotion) {
    secao.classList.add('ativo');
    render(performance.now() + 1000);
  }
})();
