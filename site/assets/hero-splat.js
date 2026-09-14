/**
 * Logo da Hórus em Gaussian Splat 3D, ao lado do texto do hero.
 *
 * Carrega só depois que a página inteira já respondeu (window 'load'), para
 * não atrasar a primeira impressão: o bundle (~1MB) + o dado 3D (~6MB) somam
 * mais que o site inteiro hoje (~2MB). Ver site/CLAUDE.md.
 *
 * Pausa em prefers-reduced-motion (renderiza 1 quadro parado e para o loop),
 * fora de tela (IntersectionObserver) e com a aba em segundo plano
 * (document.hidden) — regra da casa em _memoria/design/60-motion.md.
 */
(function () {
  var container = document.getElementById('hero-splat');
  if (!container) return;

  // Sem WebGL2, o motor não roda: esconde o container e não baixa nada.
  var teste = document.createElement('canvas');
  var gl2 = teste.getContext('webgl2');
  if (!gl2) { container.hidden = true; return; }

  var reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var economizaDados = navigator.connection && (navigator.connection.saveData ||
    /2g/.test(navigator.connection.effectiveType || ''));
  if (economizaDados) { container.hidden = true; return; }

  function iniciar() {
    Promise.all([
      import('./vendor/gaussian-splats-3d/gaussian-splats-3d.bundle.min.js')
    ]).then(function (mods) {
      montar(mods[0].GaussianSplats3D, mods[0].THREE);
    }).catch(function () {
      container.hidden = true;
    });
  }

  function montar(GaussianSplats3D, THREE) {
    var largura = container.clientWidth;
    var altura = container.clientHeight;
    if (!largura || !altura) { container.hidden = true; return; }

    var mobile = window.innerWidth < 768 || matchMedia('(hover: none) and (pointer: coarse)').matches;
    var dprAlvo = mobile ? Math.min(window.devicePixelRatio || 1, 1) : Math.min(Math.max(window.devicePixelRatio || 1, 1), 1.5);

    var renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(dprAlvo);
    renderer.setSize(largura, altura);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Objeto capturado achatado no eixo X (profundidade rasa); a câmera fica
    // de frente para essa face, orbitando em torno de Y. Centro medido por
    // amostragem da nuvem de pontos original (site-fontes/3d/logo-horus.ply).
    var centro = new THREE.Vector3(0, -0.085, 0);
    var raioOrbita = 1.7;
    var camera = new THREE.PerspectiveCamera(50, largura / altura, 0.05, 20);
    camera.up.set(0, 1, 0);

    var viewer = new GaussianSplats3D.Viewer({
      selfDrivenMode: false,
      renderer: renderer,
      camera: camera,
      useBuiltInControls: false,
      ignoreDevicePixelRatio: false,
      // sharedMemoryForWorkers precisaria dos headers COOP/COEP no domínio
      // inteiro (netlify.toml) para não quebrar com "SharedArrayBuffer
      // transfer requires self.crossOriginIsolated" — desligado de propósito
      // para não mexer em cabeçalho HTTP do site inteiro por uma peça
      // decorativa. gpuAcceleratedSort precisa ir junto (README da lib).
      gpuAcceleratedSort: false,
      sharedMemoryForWorkers: false,
      dynamicScene: false,
      renderMode: GaussianSplats3D.RenderMode.Always,
      sceneRevealMode: GaussianSplats3D.SceneRevealMode.Instant,
      sphericalHarmonicsDegree: 0,
      logLevel: GaussianSplats3D.LogLevel.None
    });

    var visivel = false;
    var congelado = reduzMovimento;
    var raf = null;
    var angulo = 0;

    // Objeto raso no eixo X (a "frente" da logo fica no plano YZ); a órbita
    // gira em torno de Y começando com a câmera alinhada ao eixo X, de frente
    // para essa face, em vez do padrão sin/cos que olharia de perfil.
    function posicionarCamera(a) {
      camera.position.set(
        centro.x + Math.cos(a) * raioOrbita,
        centro.y,
        centro.z + Math.sin(a) * raioOrbita
      );
      camera.lookAt(centro);
    }
    posicionarCamera(angulo);

    function loop() {
      raf = requestAnimationFrame(loop);
      if (!visivel || document.hidden) return;
      if (!congelado) {
        angulo += 0.0018;
        posicionarCamera(angulo);
      }
      viewer.update();
      viewer.render();
      if (congelado) { cancelAnimationFrame(raf); raf = null; }
    }

    viewer.addSplatScene('./assets/3d/logo-horus.ksplat', {
      showLoadingUI: false,
      position: [0, 0, 0],
      rotation: [0, 0, 0, 1],
      scale: [1, 1, 1]
    }).then(function () {
      container.classList.add('hero-splat--pronto');
      raf = requestAnimationFrame(loop);
    }).catch(function () {
      container.hidden = true;
    });

    var io = new IntersectionObserver(function (entradas) {
      visivel = entradas[0].isIntersecting;
      if (visivel && !raf && !congelado) raf = requestAnimationFrame(loop);
    }, { threshold: 0.05 });
    io.observe(container);

    var resizeTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        var w = container.clientWidth, h = container.clientHeight;
        if (!w || !h) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }, 150);
    }, { passive: true });
  }

  if (document.readyState === 'complete') {
    setTimeout(iniciar, 300);
  } else {
    window.addEventListener('load', function () { setTimeout(iniciar, 300); });
  }
})();
