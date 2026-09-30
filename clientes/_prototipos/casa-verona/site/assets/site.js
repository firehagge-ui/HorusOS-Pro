/* Casa Verona · protótipo · rodada 3 */
(() => {
  const WHATS = '5571991253252';
  const html = document.documentElement;
  const body = document.body;
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const temGsap = !!(window.gsap && window.ScrollTrigger);
  if (!reduz) html.classList.add('js-motion');
  if (temGsap) gsap.registerPlugin(ScrollTrigger);

  /* Pendências: modo apresentação (padrão) × trabalho (tecla P ou ?pendencias=1) */
  if (new URLSearchParams(location.search).get('pendencias') === '1') body.classList.add('modo-trabalho');
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'p' && e.key !== 'P') return;
    if (e.target.closest('input, textarea, select')) return;
    body.classList.toggle('modo-trabalho');
  });

  /* Menu do celular */
  const topo = document.querySelector('.topo');
  const botao = document.querySelector('.menu-botao');
  const menu = document.getElementById('menu');
  const fecharMenu = () => { menu.classList.remove('aberta'); botao.setAttribute('aria-expanded', 'false'); botao.textContent = 'Menu'; };
  botao.addEventListener('click', () => {
    const aberto = menu.classList.toggle('aberta');
    botao.setAttribute('aria-expanded', String(aberto));
    botao.textContent = aberto ? 'Fechar' : 'Menu';
  });
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) fecharMenu(); });

  /* Topo: o fio de baixo só aparece depois de rolar */
  const marcarTopo = () => topo.classList.toggle('rolou', scrollY > 8);
  marcarTopo();
  addEventListener('scroll', marcarTopo, { passive: true });

  /* Rolagem suave (Lenis), sincronizada com o ScrollTrigger; âncoras tratadas aqui */
  let lenis = null;
  if (!reduz && window.Lenis) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    if (temGsap) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const quadro = (t) => { lenis.raf(t); requestAnimationFrame(quadro); };
      requestAnimationFrame(quadro);
    }
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || !lenis || a.classList.contains('pular')) return;
    const id = a.getAttribute('href');
    const alvo = id.length > 1 && document.querySelector(id);
    if (!alvo) return;
    e.preventDefault();
    lenis.scrollTo(alvo, { offset: -(topo.offsetHeight + 16) });
    history.replaceState(null, '', id);
    if (!alvo.hasAttribute('tabindex')) alvo.setAttribute('tabindex', '-1');
    alvo.focus({ preventScroll: true });
  });

  /* Entrada progressiva com trava de duas camadas (90-antipadroes.md):
     1) aos 1,6s revela o que já está na tela;
     2) se o observador nunca respondeu, revela a página inteira. */
  const blocos = [...document.querySelectorAll('.rev')];
  if (!reduz && 'IntersectionObserver' in window) {
    html.classList.add('js-rev');
    let respondeu = false;
    const io = new IntersectionObserver((entradas) => {
      respondeu = true;
      entradas.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('dentro'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    blocos.forEach((el) => io.observe(el));
    setTimeout(() => {
      blocos.forEach((el) => { if (el.getBoundingClientRect().top < innerHeight) el.classList.add('dentro'); });
      if (!respondeu) blocos.forEach((el) => el.classList.add('dentro'));
    }, 1600);
  }

  /* Hero: as fotos passam dentro da janela. Pausa visível (WCAG 2.2.2), numerais para escolher,
     e para quando a janela sai da tela ou a aba fica escondida.
     Com "reduzir movimento", começa pausado e troca só no clique. */
  const cena = document.querySelector('.cena');
  if (cena) {
    const slides = [...cena.querySelectorAll('.slide')];
    const pontos = [...cena.querySelectorAll('.ponto')];
    const legenda = cena.querySelector('[data-legenda-alvo]');
    const pausa = cena.querySelector('.janela-pausa');
    const tempo = cena.querySelector('.janela-tempo span');
    const DURACAO = 6000;
    let atual = 0;
    let relogio = 0;
    let pausado = reduz;
    let naTela = true;

    const correrTempo = () => {
      tempo.classList.remove('corre');
      void tempo.offsetWidth;
      if (!pausado) tempo.classList.add('corre');
    };
    const agendar = () => {
      clearTimeout(relogio);
      if (pausado || !naTela || document.hidden) return;
      relogio = setTimeout(() => ir(atual + 1), DURACAO);
    };
    const ir = (i) => {
      const n = (i + slides.length) % slides.length;
      if (n !== atual) {
        const velho = slides[atual];
        const novo = slides[n];
        velho.classList.remove('ativo');
        velho.classList.add('saindo');
        velho.setAttribute('aria-hidden', 'true');
        novo.classList.add('ativo');
        novo.removeAttribute('aria-hidden');
        setTimeout(() => velho.classList.remove('saindo'), 1500);
        pontos[atual].classList.remove('ativo');
        pontos[atual].setAttribute('aria-pressed', 'false');
        pontos[n].classList.add('ativo');
        pontos[n].setAttribute('aria-pressed', 'true');
        legenda.textContent = novo.dataset.legenda;
        atual = n;
      }
      correrTempo();
      agendar();
    };
    const marcarPausa = () => {
      cena.classList.toggle('pausado', pausado);
      pausa.textContent = pausado ? 'Continuar' : 'Pausar';
      pausa.setAttribute('aria-pressed', String(pausado));
    };
    pontos.forEach((p, i) => p.addEventListener('click', () => ir(i)));
    pausa.addEventListener('click', () => {
      pausado = !pausado;
      marcarPausa();
      if (pausado) clearTimeout(relogio);
      else { correrTempo(); agendar(); }
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => { naTela = en.isIntersecting; agendar(); }).observe(cena);
    }
    document.addEventListener('visibilitychange', agendar);
    marcarPausa();
    correrTempo();
    agendar();
  }

  /* Manifesto revelado palavra a palavra conforme a rolagem (o texto já está no HTML inteiro;
     sem GSAP ou com "reduzir movimento", fica como está) */
  const manifesto = document.querySelector('[data-palavras]');
  if (manifesto && temGsap && !reduz) {
    const palavras = manifesto.textContent.trim().split(/\s+/);
    manifesto.textContent = '';
    palavras.forEach((p, i) => {
      const s = document.createElement('span');
      s.className = 'pal';
      s.textContent = p;
      manifesto.appendChild(s);
      if (i < palavras.length - 1) manifesto.appendChild(document.createTextNode(' '));
    });
    gsap.fromTo(manifesto.querySelectorAll('.pal'), { opacity: 0.16 }, {
      opacity: 1, stagger: 0.08, ease: 'none',
      scrollTrigger: { trigger: manifesto, start: 'top 88%', end: 'bottom 64%', scrub: true },
    });
  }

  /* Faixa dos tipos de evento: anda de lado só enquanto a pessoa rola (não corre sozinha) */
  const trilho = document.querySelector('.faixa-trilho');
  if (trilho && temGsap && !reduz) {
    gsap.fromTo(trilho, { xPercent: -2 }, {
      xPercent: -24, ease: 'none',
      scrollTrigger: { trigger: '.faixa', start: 'top bottom', end: 'bottom top', scrub: 0.8 },
    });
  }

  /* Parallax leve dentro das fotos dos eventos */
  if (temGsap && !reduz) {
    document.querySelectorAll('[data-parallax]').forEach((img) => {
      gsap.fromTo(img, { yPercent: -5, scale: 1.12 }, {
        yPercent: 5, scale: 1.12, ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  }

  /* Vídeos dela: tocam quando entram na tela e param quando saem.
     Com "reduzir movimento", não tocam sozinhos: os da seção ganham controles. */
  const videos = [...document.querySelectorAll('.filme video, .assinatura-video')];
  /* A capa (poster) só baixa quando o vídeo chega perto da tela: capa de vídeo não respeita
     loading="lazy" e pesava 340 KB na primeira carga */
  const porCapa = (v) => { if (v.dataset.poster) { v.poster = v.dataset.poster; delete v.dataset.poster; } };
  if ('IntersectionObserver' in window) {
    const ioCapa = new IntersectionObserver((entradas) => entradas.forEach((en) => {
      if (en.isIntersecting) { porCapa(en.target); ioCapa.unobserve(en.target); }
    }), { rootMargin: '900px 0px' });
    videos.forEach((v) => ioCapa.observe(v));
  } else {
    videos.forEach(porCapa);
  }
  if (reduz) {
    videos.forEach((v) => { if (!v.classList.contains('assinatura-video')) v.controls = true; });
  } else if ('IntersectionObserver' in window) {
    const ioVideo = new IntersectionObserver((entradas) => entradas.forEach((en) => {
      const v = en.target;
      if (en.isIntersecting) {
        const tocando = v.play();
        if (tocando && tocando.catch) tocando.catch(() => {});
      } else {
        v.pause();
      }
    }), { threshold: 0.3 });
    videos.forEach((v) => ioVideo.observe(v));
  }

  /* Pedido de visita: a placa se escreve enquanto a pessoa preenche */
  const form = document.getElementById('form-visita');
  const erro = document.getElementById('f-erro');
  const campo = (n) => form.elements[n];
  const placa = (k) => document.querySelector(`[data-p="${k}"]`);

  const hoje = new Date();
  campo('mes').min = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;

  const mesPorExtenso = (v) => {
    if (!v) return '';
    const [a, m] = v.split('-').map(Number);
    return new Date(a, m - 1, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const escrever = (el, texto) => {
    if (el.textContent === texto) return;
    el.textContent = texto;
    if (reduz) return;
    el.classList.remove('troca');
    void el.offsetWidth;
    el.classList.add('troca');
  };

  const atualizar = () => {
    const nome = campo('nome').value.trim();
    const conv = parseInt(campo('convidados').value, 10);
    escrever(placa('nome'), nome || 'Seu nome');
    escrever(placa('tipo'), campo('tipo').value);
    escrever(placa('mes'), mesPorExtenso(campo('mes').value) || 'o mês que você escolher');
    escrever(placa('conv'), conv > 0 ? `cerca de ${conv} convidados` : 'quantos convidados vierem');
    if (nome) erro.hidden = true;
  };
  form.addEventListener('input', atualizar);
  form.addEventListener('change', atualizar);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = campo('nome').value.trim();
    if (!nome) { erro.hidden = false; campo('nome').focus(); return; }
    const mes = mesPorExtenso(campo('mes').value);
    const conv = parseInt(campo('convidados').value, 10);
    const extra = campo('mensagem').value.trim();
    const linhas = [
      `Olá, Casa Verona! Meu nome é ${nome} e quero agendar uma visita.`,
      `Evento: ${campo('tipo').value}`,
      mes && `Mês que imagino: ${mes}`,
      conv > 0 && `Convidados: cerca de ${conv}`,
      extra,
    ].filter(Boolean);
    window.open(`https://wa.me/${WHATS}?text=${encodeURIComponent(linhas.join('\n'))}`, '_blank', 'noopener');
  });

  /* A fonte chegando muda a altura dos blocos: recalcula as posições do scroll */
  if (temGsap && document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
