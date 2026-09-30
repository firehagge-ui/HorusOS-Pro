/**
 * S2-STACK: Interatividade e Motion da Seção 2 (Nosso Stack)
 * Com matriz 3D contínua, fileiras alternadas e profundidade de campo (DoF).
 *
 * Características:
 * - IntersectionObserver: dispara o motion de entrada da seção (.ativo)
 * - Parallax 3D suave no mouseover (desktop) para inclinar o plano físico no espaço
 * - Pausa/retomada automática dos trilhos quando a seção entra ou sai da tela (0% consumo fora da viewport)
 * - Respeita prefers-reduced-motion
 */
(function () {
  'use strict';

  var secao = document.querySelector('.stk-secao');
  if (!secao) return;

  var plano = secao.querySelector('.stk-plano-3d');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Gatilho de Entrada e Economia de GPU/CPU quando fora de tela
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var trilhos = secao.querySelectorAll('.stk-trilho');
        if (entry.isIntersecting) {
          secao.classList.add('ativo');
          trilhos.forEach(function (t) { t.style.animationPlayState = 'running'; });
        } else {
          trilhos.forEach(function (t) { t.style.animationPlayState = 'paused'; });
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

    observer.observe(secao);
  } else {
    secao.classList.add('ativo');
  }

  // Efeito Parallax 3D sutil ao mover o mouse sobre a seção (somente Desktop)
  if (!reducedMotion && window.matchMedia('(min-width: 961px)').matches && plano) {
    var baseRotX = -8;
    var baseRotY = -36;
    var baseRotZ = 8;
    var currentX = 0;
    var currentY = 0;
    var targetX = 0;
    var targetY = 0;
    var isHovering = false;
    var animFrame = null;

    function updateTransform() {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;

      var rotX = baseRotX - currentY * 6;
      var rotY = baseRotY + currentX * 7;
      var rotZ = baseRotZ + currentX * 1.5;

      plano.style.transform = 'rotateX(' + rotX.toFixed(2) + 'deg) rotateY(' + rotY.toFixed(2) + 'deg) rotateZ(' + rotZ.toFixed(2) + 'deg)';

      if (isHovering || Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
        animFrame = requestAnimationFrame(updateTransform);
      } else {
        animFrame = null;
      }
    }

    secao.addEventListener('mousemove', function (e) {
      var rect = secao.getBoundingClientRect();
      var normX = (e.clientX - rect.left) / rect.width;
      var normY = (e.clientY - rect.top) / rect.height;

      // Normalizado de -1 a +1
      targetX = (normX - 0.5) * 2;
      targetY = (normY - 0.5) * 2;

      isHovering = true;
      if (!animFrame) {
        animFrame = requestAnimationFrame(updateTransform);
      }
    }, { passive: true });

    secao.addEventListener('mouseleave', function () {
      isHovering = false;
      targetX = 0;
      targetY = 0;
      if (!animFrame) {
        animFrame = requestAnimationFrame(updateTransform);
      }
    }, { passive: true });
  }
})();
