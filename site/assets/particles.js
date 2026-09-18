/**
 * Poeira de partículas flutuando pela Home, atrás do conteúdo. Porte vanilla
 * (canvas 2D puro) do componente React `particles.tsx` que o Marcelo trouxe
 * como referência de TRATAMENTO — regra da casa: porta o efeito, não instala
 * o framework (nada de React/Next/shadcn neste site).
 *
 * ⚠️ Ficam brancas com algumas azuis bem sutis, sem responder ao mouse, e nunca
 * prendem a leitura — vale
 * a doutrina de _memoria/design/60-motion.md: pausa em prefers-reduced-motion,
 * anima só `transform`/`opacity` via canvas (sem custo de layout), e um
 * canvas 2D simples é leve o bastante para não competir com a logo 3D do
 * hero (WebGL) pelo mesmo orçamento de quadro.
 */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var container = document.createElement('div');
  container.className = 'particulas';
  container.setAttribute('aria-hidden', 'true');
  var canvas = document.createElement('canvas');
  container.appendChild(canvas);
  document.body.prepend(container);

  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var w = 0, h = 0;
  var particulas = [];
  var mobile = window.innerWidth < 768 || matchMedia('(hover: none) and (pointer: coarse)').matches;

  var QTD = mobile ? 40 : 90;
  var RGB_CORES = [[255, 255, 255], [130, 190, 255]]; // branco + azul claro, alternados

  function corAleatoria() {
    return RGB_CORES[Math.random() < 0.82 ? 0 : 1];
  }

  function novaParticula() {
    var muitoPequena = Math.random() < 0.24;
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      tamanho: muitoPequena ? Math.random() * 0.35 + 0.25 : Math.random() * 1.15 + 0.55,
      brilho: Math.random() < 0.18,
      alfa: 0,
      alfaAlvo: Math.random() * 0.45 + 0.18,
      dx: (Math.random() - 0.5) * 0.08,
      dy: (Math.random() - 0.5) * 0.08,
      rgb: corAleatoria()
    };
  }

  function redimensionar() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    particulas = [];
    for (var i = 0; i < QTD; i++) particulas.push(novaParticula());
  }

  function remapear(valor, i1, f1, i2, f2) {
    var r = ((valor - i1) * (f2 - i2)) / (f1 - i1) + i2;
    return r > 0 ? r : 0;
  }

  var raf = null;
  var visivel = true;

  function loop() {
    ctx.clearRect(0, 0, w, h);
    for (var i = particulas.length - 1; i >= 0; i--) {
      var p = particulas[i];
      var borda = [
        p.x - p.tamanho,
        w - p.x - p.tamanho,
        p.y - p.tamanho,
        h - p.y - p.tamanho
      ];
      var maisPerto = Math.min.apply(null, borda);
      var proximidade = remapear(maisPerto, 0, 20, 0, 1);
      if (proximidade > 1) {
        p.alfa = Math.min(p.alfa + 0.02, p.alfaAlvo);
      } else {
        p.alfa = p.alfaAlvo * proximidade;
      }
      p.x += p.dx;
      p.y += p.dy;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.tamanho, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + p.rgb.join(',') + ',' + p.alfa + ')';
      ctx.shadowColor = 'rgba(' + p.rgb.join(',') + ',' + (p.alfa * 0.55) + ')';
      ctx.shadowBlur = p.brilho ? 5 : 0;
      ctx.fill();
      ctx.shadowBlur = 0;

      if (p.x < -p.tamanho || p.x > w + p.tamanho || p.y < -p.tamanho || p.y > h + p.tamanho) {
        particulas[i] = novaParticula();
      }
    }
    if (visivel && !document.hidden) raf = requestAnimationFrame(loop);
  }

  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && !raf) { visivel = true; raf = requestAnimationFrame(loop); }
  });

  var resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(redimensionar, 200);
  }, { passive: true });

  redimensionar();
  raf = requestAnimationFrame(loop);
})();
