/* Casa Verona · protótipo */
(() => {
  const WHATS = '5571991253252';
  const html = document.documentElement;
  const body = document.body;
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Pendências: modo apresentação (padrão) × trabalho (tecla P ou ?pendencias=1) */
  if (new URLSearchParams(location.search).get('pendencias') === '1') body.classList.add('modo-trabalho');
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'p' && e.key !== 'P') return;
    if (e.target.closest('input, textarea, select')) return;
    body.classList.toggle('modo-trabalho');
  });

  /* Menu do celular */
  const botao = document.querySelector('.menu-botao');
  const menu = document.getElementById('menu');
  const fecharMenu = () => { menu.classList.remove('aberta'); botao.setAttribute('aria-expanded', 'false'); botao.textContent = 'Menu'; };
  botao.addEventListener('click', () => {
    const aberto = menu.classList.toggle('aberta');
    botao.setAttribute('aria-expanded', String(aberto));
    botao.textContent = aberto ? 'Fechar' : 'Menu';
  });
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) fecharMenu(); });

  /* Topo transparente enquanto a foto do hero está atrás dele */
  const topo = document.querySelector('.topo');
  const hero = document.querySelector('.hero');
  const ajustarTopo = () => {
    const sobreFoto = hero.getBoundingClientRect().bottom > topo.offsetHeight + 8;
    topo.classList.toggle('topo--foto', sobreFoto && !menu.classList.contains('aberta'));
  };
  ajustarTopo();
  addEventListener('scroll', ajustarTopo, { passive: true });
  addEventListener('resize', ajustarTopo);
  botao.addEventListener('click', ajustarTopo);

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
})();
