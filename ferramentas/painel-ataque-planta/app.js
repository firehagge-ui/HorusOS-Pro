/* ============================================================================
   Painel Ataque & Planta — lógica do CRM comercial do Antônio (originação)
   Protótipo standalone. Persistência em localStorage (por-navegador). Quando
   for pra valer, o motor de dados vira Supabase/Pronto e a origem é a ponte
   Spark. A doutrina (funil, metas, copiloto) vem de _conhecimento/network/.
   ============================================================================ */
(function () {
  "use strict";

  var STORE = "horus_ataque_planta_v1";
  var leads = carregar();

  function carregar() {
    try {
      var raw = localStorage.getItem(STORE);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* localStorage bloqueado — segue com o seed */ }
    return JSON.parse(JSON.stringify(window.LEADS_SEED));
  }
  function salvar() {
    try { localStorage.setItem(STORE, JSON.stringify(leads)); } catch (e) {}
  }

  var idx = {};
  window.ESTAGIOS.forEach(function (e, i) { idx[e.id] = i; });

  /* ---------------- KPIs ---------------- */
  function contarPorFase() {
    var c = {}; window.ESTAGIOS.forEach(function (e) { c[e.id] = 0; });
    leads.forEach(function (l) { if (c[l.estagio] != null) c[l.estagio]++; });
    return c;
  }
  function pct(a, b) { return b > 0 ? Math.round((a / b) * 100) : 0; }

  function renderKpis() {
    var c = contarPorFase();
    var abordadosTotal = c.abordado + c.respondeu + c.r1 + c.r2 + c.cliente; // já saíram da lista
    var responderam = c.respondeu + c.r1 + c.r2 + c.cliente;
    var chegaramR1 = c.r1 + c.r2 + c.cliente;

    var M = window.METAS;
    M.empresasSemana.real = leads.length;
    M.contratosMes.real = c.cliente;
    M.taxaResposta.real = pct(responderam, abordadosTotal);
    M.taxaR1.real = pct(chegaramR1, abordadosTotal);
    M.taxaR2.real = pct(c.cliente, c.r2 + c.cliente);

    var ordem = ["empresasSemana", "abordagensHoje", "taxaResposta", "taxaR1", "taxaR2", "contratosMes"];
    var html = ordem.map(function (k) {
      var m = M[k];
      var suf = m.sufixo || "";
      var frac = Math.min(1, m.alvo ? m.real / m.alvo : 0);
      var cls = frac >= 1 ? "ok" : (frac < 0.5 ? "low" : "");
      return (
        '<div class="kpi ' + cls + '" title="' + esc(m.ajuda) + '">' +
          '<div class="k-label">' + esc(m.label) + "</div>" +
          '<div class="k-val"><b>' + m.real + suf + "</b>" +
            '<span class="k-alvo">/ ' + m.alvo + suf + " alvo</span></div>" +
          '<div class="k-faixa">' + esc(m.faixa) + "</div>" +
          '<div class="bar"><i style="width:' + Math.round(frac * 100) + '%"></i></div>' +
        "</div>"
      );
    }).join("");
    document.getElementById("kpis").innerHTML = html;
  }

  /* ---------------- Board ---------------- */
  function renderBoard() {
    var board = document.getElementById("board");
    board.innerHTML = "";
    window.ESTAGIOS.forEach(function (est) {
      var col = document.createElement("section");
      col.className = "col";
      col.dataset.estagio = est.id;
      var doFase = leads.filter(function (l) { return l.estagio === est.id; });
      col.innerHTML =
        '<div class="col-head">' +
          '<div class="row">' +
            '<span class="fase-tag fase-' + est.fase + '">' + (est.fase === "planta" ? "Planta" : "Ataque") + "</span>" +
            "<h3>" + esc(est.nome) + "</h3>" +
            '<span class="count">' + doFase.length + "</span>" +
          "</div>" +
          '<p class="dica">' + esc(est.dica) + "</p>" +
        "</div>" +
        '<div class="col-body" data-drop="' + est.id + '"></div>';
      board.appendChild(col);
      var body = col.querySelector(".col-body");
      doFase.forEach(function (l) { body.appendChild(cardLead(l)); });
      ligarDrop(body, col);
    });
  }

  function cardLead(l) {
    var g = window.GANCHOS[l.gancho] || { rotulo: l.gancho, cor: "frio" };
    var el = document.createElement("article");
    el.className = "lead";
    el.draggable = true;
    el.dataset.id = l.id;
    var chipTag = l.chip === "novo" ? '<span class="tag chip-novo">chip novo</span>' : "";
    var warn = /REGULADO/i.test(l.nota || "") ? '<span class="warn">⚠️ regulado</span>' : "";
    el.innerHTML =
      '<div class="l-top"><div><div class="l-emp">' + esc(l.empresa) + "</div>" +
        '<div class="l-nicho">' + esc(l.nicho) + " · " + esc(l.cidade) + "</div></div></div>" +
      '<div class="l-meta">' +
        '<span class="tag ' + g.cor + '">' + esc(g.rotulo) + "</span>" +
        '<span class="tag">' + esc((window.CANAIS[l.canal] || l.canal).split(" ")[0]) + "</span>" +
        chipTag +
      "</div>" +
      '<div class="l-contato">Contato: ' + esc(l.contato || "—") + " " + warn + "</div>";
    el.addEventListener("click", function () { abrirDrawer(l.id); });
    el.addEventListener("dragstart", function (e) {
      el.classList.add("dragging");
      e.dataTransfer.setData("text/plain", l.id);
      e.dataTransfer.effectAllowed = "move";
    });
    el.addEventListener("dragend", function () { el.classList.remove("dragging"); });
    return el;
  }

  function ligarDrop(body, col) {
    body.addEventListener("dragover", function (e) { e.preventDefault(); col.classList.add("over"); });
    body.addEventListener("dragleave", function () { col.classList.remove("over"); });
    body.addEventListener("drop", function (e) {
      e.preventDefault(); col.classList.remove("over");
      var id = e.dataTransfer.getData("text/plain");
      mover(id, body.dataset.drop);
    });
  }

  function mover(id, novo) {
    var l = leads.find(function (x) { return x.id === id; });
    if (!l || l.estagio === novo) return;
    l.estagio = novo;
    (l.historico = l.historico || []).push({ q: novo, quando: "agora", texto: "Movido para " + nomeEstagio(novo) + "." });
    salvar(); renderKpis(); renderBoard();
    if (drawerId === id) abrirDrawer(id); // reflete no drawer se aberto
    toast(l.empresa + " → " + nomeEstagio(novo));
  }
  function nomeEstagio(id) { var e = window.ESTAGIOS[idx[id]]; return e ? e.nome : id; }

  /* ---------------- Drawer + Copiloto ---------------- */
  var drawerId = null;
  var drawer = document.getElementById("drawer");
  var scrim = document.getElementById("scrim");
  scrim.addEventListener("click", fecharDrawer);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") fecharDrawer(); });

  function abrirDrawer(id) {
    var l = leads.find(function (x) { return x.id === id; });
    if (!l) return;
    drawerId = id;
    var g = window.GANCHOS[l.gancho] || { rotulo: l.gancho };
    var cop = copiloto(l);

    var histHtml = (l.historico || []).slice().reverse().map(function (h) {
      return "<li><div class='hq'>" + esc(h.quando) + " · " + esc(nomeEstagio(h.q)) + "</div>" +
             "<div class='ht'>" + esc(h.texto) + "</div></li>";
    }).join("") || "<li><div class='ht'>Sem histórico ainda.</div></li>";

    var i = idx[l.estagio];
    var proximo = i < window.ESTAGIOS.length - 1 ? window.ESTAGIOS[i + 1] : null;
    var anterior = i > 0 ? window.ESTAGIOS[i - 1] : null;

    drawer.innerHTML =
      '<div class="dr-head">' +
        '<button class="close" aria-label="Fechar">×</button>' +
        "<h2>" + esc(l.empresa) + "</h2>" +
        '<div class="sub">' + esc(l.nicho) + " · " + esc(l.cidade) + " · " + esc(nomeEstagio(l.estagio)) + "</div>" +
      "</div>" +
      '<div class="dr-body">' +
        '<div class="grid2">' +
          campo("Contato", l.contato || "—", true) +
          campo("Canal", window.CANAIS[l.canal] || l.canal) +
          campo("Gancho", g.rotulo + (g.peso ? " · " + g.peso : "")) +
          campo("Origem", l.origem) +
          campo("Status do chip", l.chip === "novo" ? "⚠️ Novo (aquecer devagar)" : "Aquecido") +
          campo("Estágio", nomeEstagio(l.estagio)) +
        "</div>" +
        '<div class="field"><div class="fl">Nota</div><div class="nota">' + esc(l.nota || "—") + "</div></div>" +
        blocoCopiloto(cop) +
        '<div class="hist"><h3>Histórico</h3><ol>' + histHtml + "</ol></div>" +
      "</div>" +
      '<div class="dr-foot">' +
        (anterior ? '<button class="btn sm" data-move="' + anterior.id + '">← ' + esc(anterior.nome) + "</button>" : "") +
        (proximo ? '<button class="btn electric sm" data-move="' + proximo.id + '">Avançar: ' + esc(proximo.nome) + " →</button>" : '<span class="cop-model">Cliente ativo (Planta).</span>') +
      "</div>";

    drawer.querySelector(".close").addEventListener("click", fecharDrawer);
    drawer.querySelectorAll("[data-move]").forEach(function (b) {
      b.addEventListener("click", function () { mover(id, b.dataset.move); });
    });
    var copiar = drawer.querySelector("[data-copiar]");
    if (copiar) copiar.addEventListener("click", function () {
      var txt = cop.msg;
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(function(){ toast("Mensagem copiada"); }, function(){ toast("Copie manualmente"); });
      else toast("Copie manualmente");
    });

    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    scrim.hidden = false;
  }

  function fecharDrawer() {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    scrim.hidden = true;
    drawerId = null;
  }

  function campo(label, valor, branco) {
    return '<div class="field"><div class="fl">' + esc(label) + "</div>" +
           '<div class="fv' + (branco ? " branco" : "") + '">' + esc(valor) + "</div></div>";
  }

  function blocoCopiloto(cop) {
    var statusCls = cop.liberado ? "go" : "hold";
    var msgCls = cop.liberado ? "" : "disabled";
    var acoes = cop.liberado
      ? '<button class="btn primary sm" data-copiar>Copiar mensagem</button>'
      : "";
    return (
      '<div class="copiloto">' +
        '<div class="cop-head">' +
          '<svg class="persona" viewBox="0 0 40 40" aria-hidden="true">' +
            '<rect width="40" height="40" rx="10" fill="#201526"/>' +
            '<path d="M20 9 c-5 0-8 3-8 7 0 2 1 3 2 4 l-3 2 c4 1 6 1 9 1 s5 0 9-1 l-3-2 c1-1 2-2 2-4 0-4-3-7-8-7Z" fill="#fb8c3e"/>' +
            '<circle cx="20" cy="15" r="1.6" fill="#0e0918"/>' +
            '<path d="M12 30 l8-4 8 4 v4 h-16 Z" fill="#1b1728" stroke="#3e3a46"/>' +
            '<path d="M20 26 l-2 5 2 2 2-2 Z" fill="#F4C430"/>' +
          "</svg>" +
          '<div class="t"><b>Copiloto Hórus</b><span>sugere, você decide e envia</span></div>' +
        "</div>" +
        '<div class="cop-body">' +
          '<div class="cop-status ' + statusCls + '">' + esc(cop.status) + "</div>" +
          '<div class="cop-msg ' + msgCls + '">' + esc(cop.msg) + "</div>" +
          '<div class="cop-actions">' + acoes + "</div>" +
          '<div class="cop-model">' + esc(cop.modelo) + "</div>" +
        "</div>" +
      "</div>"
    );
  }

  // O cérebro do copiloto: qual a próxima mensagem, calibrada por estágio,
  // gancho e canal. A trava central: NÃO libera link/prévia antes de o lead
  // responder (abordagem-e-prospeccao.md, §2B e §4).
  function copiloto(l) {
    var nome = (l.contato || "").split(" ")[0] || "tudo bem";
    var cat = l.nicho.toLowerCase();
    var cidade = l.cidade.split("/")[0];
    var reg = /REGULADO/i.test(l.nota || "");

    switch (l.estagio) {
      case "lista":
        return {
          liberado: false,
          status: "Segura o link. Antes do primeiro contato: 15–20 min estudando o negócio.",
          modelo: "Próximo passo · Modelo B (dois passos) para não queimar o chip.",
          msg: "Oi " + nome + ", tudo bem?\n\n(espera responder — só a saudação primeiro)"
        };
      case "abordado":
        return {
          liberado: false,
          status: "Abordado. AGUARDE a resposta — não mande link nem prévia agora.",
          modelo: "Modelo B em curso. Quando ele responder, o copiloto libera a dor + prévia.",
          msg: "Boa tarde!\n\nProcurei por " + cat + " em " + cidade + ", vi que vocês têm ótimas avaliações mas não aparecem fácil — e o cliente acaba indo pro concorrente. Resolver isso é prioridade pra vocês agora?"
        };
      case "respondeu":
        return {
          liberado: true,
          status: "Porta aberta ✓ Agora sim: dor + prévia da empresa dele + convite pra conversa.",
          modelo: "Modelo A (MVP/prévia pronta) — o campeão. Fale do LEAD, não da agência.",
          msg: "Opa " + nome + "! Que bom que respondeu 🙌\n\nReparei que quando procurei por " + cat + " em " + cidade + ", " + l.empresa + " não aparecia fácil no Google — e é aí que o cliente vai pro concorrente.\n\nMontei um modelo exclusivo pra vocês pra resolver isso. Posso te mostrar numa conversa rápida de 15 min " + (l.canal === "presencial" ? "aí na loja" : "essa semana") + "? Te levo a estrutura já pronta." +
            (reg ? "\n\n⚠️ Setor regulado: nada de promessa de resultado/antes-depois na peça." : "")
        };
      case "r1":
        return {
          liberado: true,
          status: "R1 (diagnóstico). Estude a concorrência local e leve a prévia sob o braço.",
          modelo: "Roteiro de diagnóstico — ouça a dor real antes de falar de preço." + (reg ? " Compliance do cliente TRAVA a entrega." : ""),
          msg: "Confirmando nossa conversa, " + nome + "! Vou te mostrar onde " + l.empresa + " está perdendo cliente hoje e como a gente vira isso.\n\n(no diagnóstico: puxe a dor — demora no WhatsApp? agendamento perdido? some no Google? — e só então a solução.)"
        };
      case "r2":
        return {
          liberado: true,
          status: "R2 (fechamento). Tire o SIM DENTRO da reunião. Benchmark: ~1 em 3 fecha.",
          modelo: "Fechamento — 50% de entrada antes de abrir o PC. Não deixe a decisão pro grupo depois.",
          msg: nome + ", fechado então: começamos pela Fase 1, com metade de entrada pra reservar a produção e a outra na entrega. Te mando o Pix agora e já travamos a data — pode ser?"
        };
      case "cliente":
        return {
          liberado: true,
          status: "Planta 🌱 Cliente ativo. Foco em pós-venda, recompra e indicação.",
          modelo: "Relacionamento — base conhecida usa API oficial da Meta, não chip pessoal.",
          msg: "Oi " + nome + "! Passando pra ver como está indo com o que entregamos 🙌 Já pensou no próximo passo (recompra/datas)? E se conhecer alguém que precise, a indicação de vocês vale ouro pra gente."
        };
      default:
        return { liberado: false, status: "—", modelo: "", msg: "" };
    }
  }

  /* ---------------- utils ---------------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  var toastEl = document.getElementById("toast"), toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 2200);
  }

  /* ---------------- boot ---------------- */
  renderKpis();
  renderBoard();
})();
