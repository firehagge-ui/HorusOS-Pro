/**
 * Logo da Hórus em Gaussian Splat 3D, ao lado do texto do hero.
 *
 * Carrega só depois que a página inteira já respondeu (window 'load'), para
 * não atrasar a primeira impressão: os dados (~9MB no total) somam mais que
 * o site inteiro hoje. Ver site/CLAUDE.md.
 *
 * Fica parada, olhando de frente, e vira levemente para acompanhar o mouse
 * (sem girar sozinha). Pausa fora de tela (IntersectionObserver), com a aba
 * em segundo plano (document.hidden), e não reage ao mouse em
 * prefers-reduced-motion nem em touch (regra da casa em
 * _memoria/design/60-motion.md).
 *
 * Carregado via <script> clássico (não módulo ES) e os dados 3D embutidos em
 * base64 (site/assets/3d/logo-horus.ksplat.b64.js), decodificados para um
 * Blob local: os dois evitam os bloqueios de segurança do navegador para
 * módulo ES e para fetch de arquivo binário quando a página é aberta direto
 * (file://, sem servidor) — ver a nota em site/CLAUDE.md.
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

  function carregarScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function base64ParaBlobUrl(b64) {
    var bin = atob(b64);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    var blob = new Blob([bytes], { type: 'application/octet-stream' });
    return URL.createObjectURL(blob);
  }

  function iniciar() {
    Promise.all([
      carregarScript('./assets/vendor/gaussian-splats-3d/gaussian-splats-3d.bundle.min.js'),
      carregarScript('./assets/3d/logo-horus.ksplat.b64.js')
    ]).then(function () {
      montar(window.GaussianSplats3DGlobal.GaussianSplats3D, window.GaussianSplats3DGlobal.THREE, window.__logoHorusKsplatBase64);
    }).catch(function () {
      container.hidden = true;
    });
  }

  function montar(GaussianSplats3D, THREE, b64) {
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
    // de frente para essa face, ao longo do eixo X. Centro medido por
    // amostragem da nuvem de pontos original (site-fontes/3d/logo-horus.ply).
    var centro = new THREE.Vector3(0, -0.085, 0);
    var raioOrbita = 1.7;
    var camera = new THREE.PerspectiveCamera(50, largura / altura, 0.05, 20);
    camera.up.set(0, -1, 0);

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
    var raf = null;

    // Yaw (giro esquerda/direita) e pitch (cima/baixo), os dois em
    // coordenadas esféricas de verdade ao redor do centro — mesma proporção
    // de efeito nos dois eixos — amortecidos até o alvo. Não gira sozinha,
    // só vira para acompanhar o mouse. Alvo (0,0) = olhando de frente, parada.
    var MAX_YAW = 0.26;
    var MAX_PITCH = 0.34;
    var yawAlvo = 0, pitchAlvo = 0, yawAtual = 0, pitchAtual = 0;

    function posicionarCamera(yaw, pitch) {
      var r = Math.cos(pitch) * raioOrbita;
      camera.position.set(
        centro.x + Math.cos(yaw) * r,
        centro.y + Math.sin(pitch) * raioOrbita,
        centro.z + Math.sin(yaw) * r
      );
      camera.lookAt(centro);
    }
    posicionarCamera(0, 0);

    function acordarLoop() {
      if (!raf && visivel && !document.hidden) raf = requestAnimationFrame(loop);
    }

    function aoMoverMouse(e) {
      var nx = (e.clientX / window.innerWidth) * 2 - 1;
      var ny = (e.clientY / window.innerHeight) * 2 - 1;
      // Sinal invertido de propósito: a câmera orbita ao redor do objeto, e
      // orbitar num sentido faz o objeto PARECER virar no sentido oposto
      // (efeito de paralaxe) — sem o menos aqui, a logo vira para o lado
      // contrário ao do mouse.
      yawAlvo = -nx * MAX_YAW;
      // Mesmo espelhamento do yaw (a câmera orbita ao redor do objeto): sem
      // o menos, o objeto vira pra cima quando o mouse está embaixo.
      pitchAlvo = -ny * MAX_PITCH;
      acordarLoop();
    }
    function aoMouseSair() {
      // O ponteiro saiu da janela (foco em outro app, ou fora do viewport) —
      // volta pra pose neutra em vez de ficar preso no último ângulo.
      yawAlvo = 0;
      pitchAlvo = 0;
      acordarLoop();
    }
    if (!mobile && !reduzMovimento) {
      window.addEventListener('mousemove', aoMoverMouse, { passive: true });
      document.addEventListener('mouseleave', aoMouseSair);
      window.addEventListener('blur', aoMouseSair);
    }

    function loop() {
      var deltaYaw = yawAlvo - yawAtual;
      var deltaPitch = pitchAlvo - pitchAtual;
      yawAtual += deltaYaw * 0.06;
      pitchAtual += deltaPitch * 0.06;
      posicionarCamera(yawAtual, pitchAtual);
      viewer.update();
      viewer.render();
      var assentado = Math.abs(deltaYaw) < 0.0004 && Math.abs(deltaPitch) < 0.0004;
      if (visivel && !document.hidden && !assentado) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    }

    var splatUrl = base64ParaBlobUrl(b64);
    viewer.addSplatScene(splatUrl, {
      // Um Blob URL não tem extensão de arquivo, e a lib detecta o formato
      // pelo caminho — sem isso, falha com "File format not supported".
      format: GaussianSplats3D.SceneFormat.KSplat,
      showLoadingUI: false,
      position: [0, 0, 0],
      rotation: [0, 0, 0, 1],
      scale: [1, 1, 1]
    }).then(function () {
      URL.revokeObjectURL(splatUrl);
      container.classList.add('hero-splat--pronto');
      raf = requestAnimationFrame(loop);
    }).catch(function () {
      container.hidden = true;
    });

    var io = new IntersectionObserver(function (entradas) {
      visivel = entradas[0].isIntersecting;
      acordarLoop();
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
