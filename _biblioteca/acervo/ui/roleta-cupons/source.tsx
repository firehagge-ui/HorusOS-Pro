<!--
  Roleta de Cupons — spin-to-win com captura de lead e cupom
  ------------------------------------------------------------
  Mecanismo (a coisa que, removida, mata o efeito):
    o resultado é DECIDIDO antes de girar; a animação só aterrissa a agulha
    no segmento já sorteado. Girar-e-torcer de verdade é fraude de layout — a
    casa (ou o backend) escolhe o prêmio por peso, e a roda é só a encenação
    honesta desse sorteio.

  Reconstrução do padrão visto na High Torque Store (plataforma WBuy). NÃO é o
  código proprietário deles (o site é fechado atrás de Cloudflare Turnstile);
  é o mecanismo remontado, tokenizado e sem dependência, pronto pra portar.

  Duas variantes do mesmo padrão:
    A) RODA CLÁSSICA (esta implementação): SVG de N fatias, gira e para no
       segmento sorteado por peso.
    B) VÍDEO-PAUSA (a assinatura da High Torque): um vídeo em loop de uma roda
       girando; o visitante dá play e "pausa" — o overlay lê a fatia sob a
       agulha e vira o desconto. Serve pra reels/story onde não roda JS. O
       honesto é o mesmo: o valor é decidido, o pause só revela. Ver README.

  Trava de compliance: gamificação de urgência/cupom NÃO passa em cliente
  regulado (saúde, CFP/CFO). Serve varejo (auto-peças, floricultura, moda).
  Sorteio real de prêmio físico pode configurar promoção/distribuição de
  prêmio e exigir autorização (SECAP/regras de "promoção comercial") —
  desconto percentual no próprio site normalmente não, mas confira por cliente.
-->
<div
  class="roleta"
  data-cooldown-horas="24"
  data-storage-key="roleta-cupom-v1"
  role="region"
  aria-label="Roleta de cupons"
>
  <!-- ETAPA 1: captura de lead (gate antes de girar) -->
  <form class="roleta__gate" novalidate>
    <h2 class="roleta__titulo">Gire e ganhe seu desconto</h2>
    <p class="roleta__sub">Um giro por visitante. O cupom vale só hoje.</p>

    <label class="roleta__campo">
      <span>Nome</span>
      <input name="nome" type="text" autocomplete="name" required />
    </label>
    <label class="roleta__campo">
      <span>E-mail ou WhatsApp</span>
      <input name="contato" type="text" inputmode="email" autocomplete="email" required />
    </label>
    <label class="roleta__consent">
      <input name="consent" type="checkbox" required />
      <span>Aceito receber ofertas e concordo com a política de privacidade.</span>
    </label>

    <button class="roleta__btn" type="submit">Quero girar</button>
    <p class="roleta__erro" role="alert" hidden></p>
  </form>

  <!-- ETAPA 2: a roda -->
  <div class="roleta__palco" hidden>
    <div class="roleta__agulha" aria-hidden="true"></div>
    <div class="roleta__disco-wrap">
      <svg class="roleta__disco" viewBox="0 0 200 200" role="img"
           aria-label="Roda de prêmios"><!-- fatias injetadas via JS --></svg>
    </div>
    <button class="roleta__btn roleta__girar" type="button">GIRAR</button>
  </div>

  <!-- ETAPA 3: resultado -->
  <div class="roleta__resultado" hidden aria-live="polite">
    <h2 class="roleta__ganhou"></h2>
    <p class="roleta__instrucao">Use o cupom no carrinho:</p>
    <div class="roleta__cupom-linha">
      <code class="roleta__cupom"></code>
      <button class="roleta__copiar" type="button">Copiar</button>
    </div>
    <a class="roleta__btn roleta__cta" href="#loja">Aproveitar agora</a>
    <p class="roleta__validade"></p>
  </div>
</div>

<style>
  .roleta {
    /* ---- tokens: troque aqui pra vestir a marca ---- */
    --rlt-bg: #0e0e12;
    --rlt-superficie: #16161d;
    --rlt-tinta: #f5f5f7;
    --rlt-tinta-fraca: #a6a6b0;
    --rlt-acento: #e4002b;        /* cor da marca / botão */
    --rlt-acento-tinta: #ffffff;
    --rlt-fatia-a: #1f1f2b;       /* fatias alternadas */
    --rlt-fatia-b: #e4002b;
    --rlt-fatia-tinta: #ffffff;
    --rlt-borda: #2a2a36;
    --rlt-raio: 16px;
    --rlt-fonte: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;

    max-width: 420px;
    margin: 0 auto;
    padding: 28px 22px;
    background: var(--rlt-superficie);
    border: 1px solid var(--rlt-borda);
    border-radius: var(--rlt-raio);
    color: var(--rlt-tinta);
    font-family: var(--rlt-fonte);
    text-align: center;
  }
  .roleta__titulo { font-size: 1.5rem; line-height: 1.15; margin: 0 0 6px; }
  .roleta__sub { color: var(--rlt-tinta-fraca); font-size: .95rem; margin: 0 0 20px; }
  .roleta__campo { display: block; text-align: left; margin-bottom: 12px; }
  .roleta__campo span { display: block; font-size: .8rem; color: var(--rlt-tinta-fraca); margin-bottom: 5px; }
  .roleta__campo input {
    width: 100%; box-sizing: border-box; padding: 12px 14px;
    background: var(--rlt-bg); border: 1px solid var(--rlt-borda);
    border-radius: 10px; color: var(--rlt-tinta); font-size: 1rem;
  }
  .roleta__campo input:focus-visible { outline: 2px solid var(--rlt-acento); outline-offset: 1px; }
  .roleta__consent { display: flex; gap: 8px; text-align: left; font-size: .8rem;
    color: var(--rlt-tinta-fraca); margin: 4px 0 18px; align-items: flex-start; }
  .roleta__consent input { margin-top: 2px; }

  .roleta__btn {
    display: inline-block; width: 100%; box-sizing: border-box;
    padding: 14px 20px; border: 0; border-radius: 10px;
    background: var(--rlt-acento); color: var(--rlt-acento-tinta);
    font-size: 1.05rem; font-weight: 700; letter-spacing: .02em;
    cursor: pointer; text-decoration: none; text-align: center;
    transition: filter .15s ease;
  }
  .roleta__btn:hover { filter: brightness(1.1); }
  .roleta__btn:focus-visible { outline: 2px solid var(--rlt-acento-tinta); outline-offset: 2px; }
  .roleta__erro { color: #ff6b6b; font-size: .85rem; margin: 10px 0 0; }

  /* palco da roda */
  .roleta__palco { position: relative; padding-top: 18px; }
  .roleta__disco-wrap { position: relative; width: 280px; max-width: 100%; margin: 0 auto 18px; }
  .roleta__disco {
    width: 100%; height: auto; display: block;
    border-radius: 50%;
    border: 6px solid var(--rlt-borda);
    box-shadow: 0 8px 40px rgba(0,0,0,.4);
    /* a transição É o giro; a duração/curva é o ponto ajustável */
    transition: transform 4.5s cubic-bezier(.12,.62,.12,1);
  }
  .roleta__agulha {
    position: absolute; top: 6px; left: 50%; transform: translateX(-50%);
    width: 0; height: 0; z-index: 2;
    border-left: 13px solid transparent; border-right: 13px solid transparent;
    border-top: 22px solid var(--rlt-acento);
    filter: drop-shadow(0 2px 2px rgba(0,0,0,.5));
  }
  .roleta__girar { max-width: 180px; }

  /* resultado */
  .roleta__ganhou { font-size: 1.6rem; margin: 0 0 4px; color: var(--rlt-acento); }
  .roleta__instrucao { color: var(--rlt-tinta-fraca); font-size: .9rem; margin: 0 0 8px; }
  .roleta__cupom-linha { display: flex; gap: 8px; justify-content: center; margin-bottom: 16px; }
  .roleta__cupom {
    font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: 1.15rem;
    font-weight: 700; letter-spacing: .1em; padding: 10px 16px;
    background: var(--rlt-bg); border: 1px dashed var(--rlt-acento);
    border-radius: 8px; color: var(--rlt-tinta);
  }
  .roleta__copiar {
    padding: 0 14px; border: 1px solid var(--rlt-borda); border-radius: 8px;
    background: transparent; color: var(--rlt-tinta); cursor: pointer; font-size: .85rem;
  }
  .roleta__validade { color: var(--rlt-tinta-fraca); font-size: .78rem; margin: 14px 0 0; }

  /* respeita quem pediu menos movimento: sem giro longo */
  @media (prefers-reduced-motion: reduce) {
    .roleta__disco { transition: transform .3s ease; }
  }
</style>

<script>
(function () {
  var raiz = document.currentScript.previousElementSibling; // o <style>
  // sobe até o container .roleta mais próximo antes deste script
  var el = document.currentScript;
  while (el && !(el.classList && el.classList.contains('roleta'))) el = el.previousElementSibling;
  var roleta = el;
  if (!roleta) return;

  /* ============================================================
     CONFIG — os prêmios e seus PESOS (probabilidade relativa).
     peso alto = sai mais. Deixe o prêmio bom com peso baixo.
     'cupom' é o código que o visitante recebe; garanta que exista
     no painel da loja (WBuy/Shopify/etc.) com a mesma regra.
     ------------------------------------------------------------
     ⚠️ Em produção o SORTEIO deve acontecer no BACKEND e devolver
     só o índice vencedor — senão o visitante abre o DevTools, lê os
     pesos e "ganha" o melhor. Aqui o sorteio é client-side só pra
     demo. Ponto de troca: a função sortear().
     ============================================================ */
  var PREMIOS = [
    { rotulo: "5% OFF",  cupom: "GIROU5",  peso: 30 },
    { rotulo: "10% OFF", cupom: "GIROU10", peso: 24 },
    { rotulo: "Frete\ngrátis", cupom: "FRETEGIRO", peso: 18 },
    { rotulo: "15% OFF", cupom: "GIROU15", peso: 12 },
    { rotulo: "Brinde",  cupom: "BRINDEGIRO", peso: 9 },
    { rotulo: "20% OFF", cupom: "GIROU20", peso: 4 },
    { rotulo: "Quase!\nnão foi", cupom: "GIROU5", peso: 3 }, // "perde" mas ainda dá algo
  ];
  var VALIDADE_TEXTO = "Cupom válido nas próximas 24h, uma vez por CPF.";

  var COOLDOWN_H = parseFloat(roleta.dataset.cooldownHoras || "24");
  var STORAGE = roleta.dataset.storageKey || "roleta-cupom-v1";

  var gate = roleta.querySelector('.roleta__gate');
  var palco = roleta.querySelector('.roleta__palco');
  var resultado = roleta.querySelector('.roleta__resultado');
  var disco = roleta.querySelector('.roleta__disco');
  var btnGirar = roleta.querySelector('.roleta__girar');
  var erro = roleta.querySelector('.roleta__erro');
  var N = PREMIOS.length;
  var anguloFatia = 360 / N;
  var girado = false;
  var rotacaoAtual = 0;

  // ---- desenha as fatias em SVG (conic seria mais simples, mas SVG
  //      deixa o texto girar junto e funciona em todo navegador) ----
  function polar(cx, cy, r, graus) {
    var rad = (graus - 90) * Math.PI / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  }
  function desenha() {
    var cx = 100, cy = 100, r = 100, ns = "http://www.w3.org/2000/svg";
    PREMIOS.forEach(function (p, i) {
      var ini = i * anguloFatia, fim = (i + 1) * anguloFatia;
      var a = polar(cx, cy, r, ini), b = polar(cx, cy, r, fim);
      var path = document.createElementNS(ns, "path");
      path.setAttribute("d", "M" + cx + "," + cy + " L" + a[0] + "," + a[1] +
        " A" + r + "," + r + " 0 0 1 " + b[0] + "," + b[1] + " Z");
      path.setAttribute("fill", i % 2 ? getVar('--rlt-fatia-b') : getVar('--rlt-fatia-a'));
      disco.appendChild(path);

      var meio = ini + anguloFatia / 2;
      var t = polar(cx, cy, r * 0.62, meio);
      var linhas = p.rotulo.split("\n");
      var txt = document.createElementNS(ns, "text");
      txt.setAttribute("x", t[0]); txt.setAttribute("y", t[1]);
      txt.setAttribute("fill", getVar('--rlt-fatia-tinta'));
      txt.setAttribute("font-size", "9"); txt.setAttribute("font-weight", "700");
      txt.setAttribute("text-anchor", "middle");
      txt.setAttribute("transform", "rotate(" + meio + " " + t[0] + " " + t[1] + ")");
      linhas.forEach(function (ln, k) {
        var tspan = document.createElementNS(ns, "tspan");
        tspan.setAttribute("x", t[0]);
        tspan.setAttribute("dy", k === 0 ? (linhas.length > 1 ? "-3" : "0") : "10");
        tspan.textContent = ln;
        txt.appendChild(tspan);
      });
      disco.appendChild(txt);
    });
  }
  function getVar(nome) { return getComputedStyle(roleta).getPropertyValue(nome).trim() || "#888"; }

  // ---- sorteio por peso: troque por chamada ao backend em produção ----
  function sortear() {
    var total = PREMIOS.reduce(function (s, p) { return s + p.peso; }, 0);
    var x = Math.random() * total;
    for (var i = 0; i < N; i++) { x -= PREMIOS[i].peso; if (x <= 0) return i; }
    return N - 1;
  }

  function jaGirou() {
    try {
      var raw = localStorage.getItem(STORAGE);
      if (!raw) return null;
      var d = JSON.parse(raw);
      if (Date.now() - d.ts < COOLDOWN_H * 3600e3) return d;
      return null;
    } catch (e) { return null; }
  }

  function mostrarResultado(premio) {
    resultado.querySelector('.roleta__ganhou').textContent = "🎉 " + premio.rotulo.replace("\n", " ");
    resultado.querySelector('.roleta__cupom').textContent = premio.cupom;
    resultado.querySelector('.roleta__validade').textContent = VALIDADE_TEXTO;
    palco.hidden = true; resultado.hidden = false;
  }

  // já girou nesse dispositivo? pula direto pro cupom já ganho
  var previo = jaGirou();
  if (previo) { gate.hidden = true; mostrarResultado(PREMIOS[previo.idx]); }

  desenha();

  gate.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target;
    if (!f.nome.value.trim() || !f.contato.value.trim() || !f.consent.checked) {
      erro.textContent = "Preencha nome, contato e aceite os termos."; erro.hidden = false; return;
    }
    erro.hidden = true;
    // TODO produção: POST do lead {nome, contato} pro seu CRM/lista aqui.
    gate.hidden = true; palco.hidden = false;
  });

  btnGirar.addEventListener('click', function () {
    if (girado) return;
    girado = true;
    btnGirar.disabled = true;

    var idx = sortear();
    // ângulo pra parar com a fatia idx sob a agulha (topo).
    // +voltas extras pra dar peso ao giro; -meia fatia pra centralizar.
    var voltas = 5;
    var alvo = 360 * voltas + (360 - (idx * anguloFatia + anguloFatia / 2));
    rotacaoAtual += alvo;
    disco.style.transform = "rotate(" + rotacaoAtual + "deg)";

    var espera = matchMedia('(prefers-reduced-motion: reduce)').matches ? 350 : 4700;
    setTimeout(function () {
      try { localStorage.setItem(STORAGE, JSON.stringify({ idx: idx, ts: Date.now() })); } catch (e) {}
      mostrarResultado(PREMIOS[idx]);
    }, espera);
  });

  var btnCopiar = roleta.querySelector('.roleta__copiar');
  if (btnCopiar) btnCopiar.addEventListener('click', function () {
    var cod = roleta.querySelector('.roleta__cupom').textContent;
    navigator.clipboard && navigator.clipboard.writeText(cod);
    btnCopiar.textContent = "Copiado ✓";
    setTimeout(function () { btnCopiar.textContent = "Copiar"; }, 1800);
  });
})();
</script>
