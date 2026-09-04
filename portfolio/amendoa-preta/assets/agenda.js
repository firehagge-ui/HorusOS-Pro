/* Amêndoa Preta: o painel de agenda (elemento-assinatura) e a entrada em cascata.
   Regra da casa: o JS só enriquece. Sem ele, o HTML já diz o prazo por escrito
   e nenhuma informação some. */

(function () {
  'use strict';

  var PRAZO_BOLO = 4;   // dias corridos
  var PRAZO_DOCE = 3;
  var ABRE = 9;         // horário de atendimento
  var FECHA = 18;

  function proximaEntrega(base, dias) {
    var d = new Date(base.getFullYear(), base.getMonth(), base.getDate());
    d.setDate(d.getDate() + dias);
    d.pulouDomingo = false;
    if (d.getDay() === 0) { d.setDate(d.getDate() + 1); d.pulouDomingo = true; }
    return d;
  }

  function escreveData(el, data) {
    if (!el) { return; }
    var semana = data.toLocaleDateString('pt-BR', { weekday: 'long' });
    if (data.pulouDomingo) { semana += ', porque domingo não tem entrega'; }
    var dia = data.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
    el.textContent = '';
    var forte = document.createElement('span');
    forte.textContent = dia;
    var fraco = document.createElement('span');
    fraco.className = 'dia-semana';
    fraco.textContent = semana;
    el.appendChild(forte);
    el.appendChild(fraco);
  }

  function pintaAgenda() {
    var agora = new Date();
    escreveData(document.getElementById('prazo-bolo'), proximaEntrega(agora, PRAZO_BOLO));
    escreveData(document.getElementById('prazo-doce'), proximaEntrega(agora, PRAZO_DOCE));

    var estado = document.getElementById('estado');
    var texto = document.getElementById('estado-txt');
    if (!estado || !texto) { return; }

    var dia = agora.getDay();
    var hora = agora.getHours();
    var atendendo = dia !== 0 && hora >= ABRE && hora < FECHA;

    if (atendendo) {
      texto.textContent = 'Agenda aberta, respondendo agora';
      estado.classList.remove('fechado');
    } else {
      texto.textContent = dia === 0
        ? 'Domingo, respondemos segunda a partir das 9h'
        : 'Fora do horário, respondemos a partir das 9h';
      estado.classList.add('fechado');
    }
  }

  function cascata() {
    var reduz = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduz || !('IntersectionObserver' in window)) { return; }

    var alvos = document.querySelectorAll('.secao-cab, .produto, .passos li, .cozinha-grid, .tabela-agenda, .faq, .contato-grid, .col');
    if (!alvos.length) { return; }

    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e, i) {
        if (!e.isIntersecting) { return; }
        var atraso = Math.min(i, 4) * 70;
        setTimeout(function () { e.target.classList.add('dentro'); }, atraso);
        obs.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(alvos, function (el) {
      el.classList.add('rev');
      obs.observe(el);
    });

    // Trava de segurança em duas camadas. Primeiro: nada que já esteja na tela
    // fica invisível. Depois: se NADA foi revelado, o observador não está
    // funcionando neste navegador, e aí a página inteira aparece de uma vez.
    // Conteúdo nunca depende da animação (regra de 60-motion.md).
    setTimeout(function () {
      var presos = document.querySelectorAll('.rev:not(.dentro)');
      Array.prototype.forEach.call(presos, function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add('dentro');
        }
      });
      if (!document.querySelector('.dentro')) {
        var todos = document.querySelectorAll('.rev:not(.dentro)');
        Array.prototype.forEach.call(todos, function (el) { el.classList.add('dentro'); });
      }
    }, 1600);
  }

  function inicia() {
    try { pintaAgenda(); } catch (e) { /* o texto estático do HTML fica de pé */ }
    try { cascata(); } catch (e) { /* idem */ }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicia);
  } else {
    inicia();
  }
})();
