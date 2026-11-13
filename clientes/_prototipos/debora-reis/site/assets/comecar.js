/* "Começar meu projeto" (11/11/2026, rodada 1 da AUDITORIA-CONVERSAO-2026-11.md, item 1).
   Todo botão de WhatsApp com a mensagem genérica abre esta janela antes: quatro toques (imóvel, o que procura, momento
   e quando) e um opcional (investimento previsto na obra). A mensagem abre pronta no WhatsApp da Débora, com a origem
   (a página do site). Modelo: Studio McGee e Queen B Studio (formulário curto que filtra e abre a conversa).
   - Nada é enviado sozinho: o botão só abre o WhatsApp com o texto, e a pessoa manda se quiser.
   - Nenhuma pergunta é obrigatória. O "Prefiro escrever do meu jeito" abre o WhatsApp direto.
   - Sem script, os links continuam abrindo o WhatsApp como antes.
   - O telefone do rodapé e o "Quero um projeto assim" da revista não passam por aqui. */
(function () {
  'use strict';
  var WHATS = '5571999775453';
  var GENERICA = 'Vim%20pelo%20seu%20site%20e%20quero%20conversar';

  // a origem vai na primeira linha da mensagem: é o que mede, sem ferramenta paga, de onde veio cada contato
  var PAGINAS = {
    'projeto-rio-vermelho': 'o Apartamento Rio Vermelho', 'projeto-paralela': 'o Apartamento Paralela',
    'projeto-graca': 'o Apartamento Graça', 'projeto-alto-do-parque': 'o Apartamento Alto do Parque',
    'projeto-itaigara': 'o Quarto infantil no Itaigara'
  };
  var arquivo = (location.pathname.split('/').pop() || 'index').replace(/\.html$/, '') || 'index';
  var visto = PAGINAS[arquivo];
  var ABERTURA = 'Olá, Débora! ' + (visto ? 'Vi ' + visto + ' no seu site' : 'Vim pelo seu site') + ' e quero conversar sobre um projeto.';

  var GRUPOS = [
    { id: 'imovel', rot: 'Imóvel', titulo: 'O imóvel é', ops: ['Apartamento', 'Casa'] },
    { id: 'quer', rot: 'O que procuro', titulo: 'O que você procura', ops: ['Projeto completo', 'Alguns ambientes', 'Ainda não sei'] },
    { id: 'momento', rot: 'Momento', titulo: 'Em que momento você está', ops: ['Comprei ou vou comprar', 'Vou reformar', 'A obra já começou'] },
    { id: 'quando', rot: 'Quando', titulo: 'Quando quer começar', ops: ['Nos próximos 3 meses', 'De 3 a 6 meses', 'Mais pra frente'] },
    { id: 'invest', rot: 'Investimento previsto na obra', titulo: 'Quanto pensa investir na obra', opcional: true,
      ops: ['Até R$ 100 mil', 'De R$ 100 a 300 mil', 'Acima de R$ 300 mil', 'Prefiro falar na conversa'] }
  ];

  var css = document.createElement('link');
  css.rel = 'stylesheet'; css.href = 'assets/comecar.css';
  document.head.appendChild(css);

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  var dlg = document.createElement('dialog');
  dlg.className = 'cm';
  dlg.setAttribute('aria-labelledby', 'cm-t');
  dlg.setAttribute('data-lenis-prevent', '');
  dlg.innerHTML =
    '<form class="cm-caixa" method="dialog">' +
      '<div class="cm-topo">' +
        '<p class="cm-rot">Começar meu projeto</p>' +
        '<button type="button" class="cm-fechar" aria-label="Fechar"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 4 L16 16 M16 4 L4 16"/></svg></button>' +
      '</div>' +
      '<h2 id="cm-t" class="cm-t">Conte rapidinho sobre a sua casa</h2>' +
      '<p class="cm-sub">São quatro toques. A mensagem abre pronta no seu WhatsApp, e quem responde é a própria Débora.</p>' +
      GRUPOS.map(function (g) {
        return '<fieldset class="cm-grupo">' +
          '<legend>' + g.titulo + (g.opcional ? ' <span>(opcional)</span>' : '') + '</legend>' +
          '<div class="cm-ops">' + g.ops.map(function (o, i) {
            return '<label class="cm-op"><input type="radio" name="cm-' + g.id + '" value="' + esc(o) + '"><span>' + o + '</span></label>';
          }).join('') + '</div>' +
          (g.id === 'imovel' ? '<label class="cm-campo"><span>Bairro <i>(opcional)</i></span><input type="text" name="cm-bairro" autocomplete="address-level3" placeholder="Ex.: Graça"></label>' : '') +
        '</fieldset>';
      }).join('') +
      '<div class="cm-fim">' +
        '<p class="cm-previa-rot">A mensagem que vai chegar para ela</p>' +
        '<div class="cm-balao" aria-live="polite"></div>' +
      '</div>' +
      // o botão é filho direto da folha (que é quem rola): só assim o sticky o mantém preso embaixo o tempo todo
      '<a class="cm-enviar" href="#" rel="noopener">Abrir o WhatsApp <svg viewBox="0 0 22 12" aria-hidden="true"><path d="M1 6 H20 M15 1 L20 6 L15 11"/></svg></a>' +
      '<p class="cm-pe"><a class="cm-direto" href="#" rel="noopener">Prefiro escrever do meu jeito</a></p>' +
    '</form>';

  function respostas() {
    var r = [];
    GRUPOS.forEach(function (g) {
      var m = dlg.querySelector('input[name="cm-' + g.id + '"]:checked');
      if (m) r.push([g.rot, m.value.charAt(0).toLowerCase() + m.value.slice(1)]);
      if (g.id === 'imovel') {
        // o bairro vai como a pessoa escreveu ("na Graça", "no Rio Vermelho": a preposição muda, então fica numa linha só dele)
        var b = dlg.querySelector('input[name="cm-bairro"]').value.trim();
        if (b) r.push(['Bairro', b]);
      }
    });
    return r;
  }
  function texto(r) {
    return ABERTURA + (r.length ? '\n\n' + r.map(function (l) { return '*' + l[0] + ':* ' + l[1]; }).join('\n') : '');
  }
  function link(t) { return 'https://wa.me/' + WHATS + '?text=' + encodeURIComponent(t); }
  function atualizar() {
    var r = respostas();
    dlg.querySelector('.cm-balao').innerHTML = '<p>' + esc(ABERTURA) + '</p>' +
      (r.length ? '<dl>' + r.map(function (l) { return '<div><dt>' + esc(l[0]) + ':</dt> <dd>' + esc(l[1]) + '</dd></div>'; }).join('') + '</dl>' : '');
    dlg.querySelector('.cm-enviar').href = link(texto(r));
  }
  dlg.querySelector('.cm-direto').href = link(ABERTURA);
  dlg.addEventListener('change', atualizar);
  dlg.addEventListener('input', atualizar);

  var origem = null;
  function abrir(a) {
    origem = a;
    atualizar();
    if (window.lenisSite) window.lenisSite.stop();
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    dlg.querySelector('.cm-caixa').scrollTop = 0;
    dlg.querySelector('.cm-fechar').focus();
  }
  function fechar() { if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); }
  dlg.addEventListener('close', function () {
    if (window.lenisSite) window.lenisSite.start();
    if (origem && origem.focus) origem.focus({ preventScroll: true });
  });
  dlg.querySelector('.cm-fechar').addEventListener('click', fechar);
  // tocar fora da caixa fecha
  dlg.addEventListener('click', function (e) { if (e.target === dlg) fechar(); });
  // depois de abrir o WhatsApp, a janela fecha (quem volta para o site encontra a página, não o formulário)
  dlg.querySelectorAll('.cm-enviar, .cm-direto').forEach(function (a) {
    a.addEventListener('click', function () { setTimeout(fechar, 300); });
  });

  function iniciar() {
    document.body.appendChild(dlg);
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href*="wa.me/' + WHATS + '"]');
      if (!a || dlg.contains(a) || e.defaultPrevented) return;
      if (a.closest('.rodape') || a.href.indexOf(GENERICA) < 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      abrir(a);
    });
    // ?comecar=1 abre a janela direto (para testar e para link de campanha)
    if (/[?&]comecar=1/.test(location.search)) abrir(null);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
