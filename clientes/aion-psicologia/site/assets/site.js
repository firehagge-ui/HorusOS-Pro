// Aion Psicologia — comportamento compartilhado entre as páginas.
(function(){
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Revelação na entrada da viewport. IntersectionObserver, sem listener de scroll.
  var alvos = document.querySelectorAll('.rev');
  if (reduz || !('IntersectionObserver' in window)) {
    alvos.forEach(function(el){ el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function(entradas){
      entradas.forEach(function(e){
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold:.16, rootMargin:'0px 0px -8% 0px' });
    alvos.forEach(function(el, i){
      el.style.transitionDelay = (Math.min(i % 6, 4) * 60) + 'ms';
      io.observe(el);
    });
  }

  // Borda do topo aparece só depois que a página sai do topo.
  var nav = document.getElementById('nav');
  if (nav) {
    var sentinela = document.createElement('div');
    sentinela.style.cssText = 'position:absolute;top:0;height:1px;width:1px';
    document.body.prepend(sentinela);
    new IntersectionObserver(function(e){
      nav.classList.toggle('stuck', !e[0].isIntersecting);
    }).observe(sentinela);
  }

  // Menu do celular. Abaixo de 900px a barra de links não cabe e vira painel.
  // Antes daqui ela simplesmente sumia, e o cabeçalho ficava com 72px de logo e
  // nenhuma função. O público desta clínica lê no celular.
  var abre = document.querySelector('.nav-abre');
  if (nav && abre) {
    var fechaMenu = function(){
      if (!nav.classList.contains('aberto')) return;
      nav.classList.remove('aberto');
      abre.setAttribute('aria-expanded', 'false');
    };
    abre.addEventListener('click', function(){
      var aberto = nav.classList.toggle('aberto');
      abre.setAttribute('aria-expanded', String(aberto));
    });
    nav.querySelectorAll('nav a').forEach(function(a){
      a.addEventListener('click', fechaMenu);
    });
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' || e.key === 'Esc') { fechaMenu(); abre.focus(); }
    });
    document.addEventListener('click', function(e){
      if (!nav.contains(e.target)) fechaMenu();
    });
    window.addEventListener('resize', function(){
      if (window.innerWidth > 900) fechaMenu();
    });
  }

  // FAQ: abrir um item fecha os outros. <details> nativo, sem biblioteca.
  var itens = document.querySelectorAll('.faq-item');
  itens.forEach(function(item){
    item.addEventListener('toggle', function(){
      if (!item.open) return;
      itens.forEach(function(outro){ if (outro !== item) outro.open = false; });
    });
  });

  // Liga e desliga o destaque das pendências. Serve para apresentar o site limpo
  // para a cliente sem apagar a marcação do que ainda falta confirmar.
  // A escolha fica guardada entre as páginas durante a visita.
  var faixa = document.querySelector('.aviso-demo');
  if (faixa && document.querySelector('.pend')) {
    var off = sessionStorage.getItem('aion-pend-off') === '1';
    document.body.classList.toggle('pend-off', off);
    var bt = document.createElement('button');
    bt.type = 'button';
    bt.className = 'pend-btn';
    bt.setAttribute('aria-pressed', String(off));
    bt.textContent = off ? 'Mostrar pendências' : 'Ocultar pendências';
    bt.addEventListener('click', function () {
      var agora = document.body.classList.toggle('pend-off');
      sessionStorage.setItem('aion-pend-off', agora ? '1' : '0');
      bt.setAttribute('aria-pressed', String(agora));
      bt.textContent = agora ? 'Mostrar pendências' : 'Ocultar pendências';
    });
    faixa.appendChild(bt);
  }

  // O formulário é demonstração e não tem servidor. Avisa em vez de fingir envio.
  var form = document.getElementById('form-contato');
  if (form) {
    form.addEventListener('submit', function(ev){
      ev.preventDefault();
      var aviso = document.getElementById('form-retorno');
      aviso.hidden = false;
      aviso.focus();
    });
  }
})();
