// Gera 8 slides standalone (1080x1350) do post #1 — estilo "Galeria", modo claro.
// Fonte única de verdade do conteúdo + design system. Roda: node build.js
// v3.2 (03/08/2026): slide de ciência removido a pedido do Marcelo (8 slides).
// Copy revisada (cada slide deixa gancho pro próximo). Cores e sistema mantidos.
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "slides");
fs.mkdirSync(OUT, { recursive: true });

// ---- Design system (marca.md, modo claro) ----
const C = {
  cream: "#F3ECDF",
  cream2: "#EBE0CE",
  ink: "#2B2622",
  slate: "#6B7A88",
  slateDeep: "#3D4854",
  terra: "#8A5A3C",
  terraDeep: "#7A4A2E",
};

const HEAD = `
<meta charset="utf-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=EB+Garamond:ital,wght@0,500;0,600;1,500&family=Jost:wght@400;500;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1350px;overflow:hidden}
.slide{width:1080px;height:1350px;position:relative;display:flex;flex-direction:column;
  padding:64px 84px 56px;background:${C.cream};color:${C.ink}}
.slide.cream2{background:${C.cream2}}
.slide.dark{background:${C.slateDeep};color:${C.cream}}
/* cabeçalho-rótulo */
.bar{display:flex;justify-content:space-between;align-items:center;
  font-family:'Jost',sans-serif;font-weight:500;font-size:24px;letter-spacing:.03em;
  text-transform:uppercase;color:${C.ink};padding-bottom:22px;
  border-bottom:1px solid rgba(43,38,34,.22)}
.dark .bar{color:${C.cream};border-bottom:1px solid rgba(243,236,223,.28)}
.bar .mid{color:${C.terra};font-weight:600}
.dark .bar .mid{color:#D9A67C}
/* corpo do slide */
.body{flex:1;display:flex;flex-direction:column;justify-content:center;gap:30px;padding:38px 0}
.eyebrow{font-family:'Jost',sans-serif;font-weight:600;font-size:26px;letter-spacing:.04em;
  text-transform:uppercase;color:${C.terra}}
.dark .eyebrow{color:#D9A67C}
.rule{width:80px;height:3px;background:${C.terra};border:0}
h1{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:104px;line-height:1;
  letter-spacing:-.01em}
h2{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:70px;line-height:1.05;
  letter-spacing:-.005em}
h2 em{font-style:italic;color:${C.terra}}
.dark h2 em{color:#E3B489}
p{font-family:'EB Garamond',serif;font-weight:500;font-size:39px;line-height:1.5;max-width:21ch}
.big-quote{font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:600;
  font-size:76px;line-height:1.12;letter-spacing:-.005em}
.ficha{font-family:'Jost',sans-serif;font-weight:400;font-size:24px;letter-spacing:.02em;
  color:${C.slate};text-transform:none}
.dark .ficha{color:#AEB9C4}
.ficha b{font-weight:600;color:${C.ink}}
.dark .ficha b{color:${C.cream}}
/* rodapé assinatura */
.foot{display:flex;justify-content:flex-end;align-items:center;
  font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:500;font-size:28px;
  color:${C.terra};padding-top:18px;border-top:1px solid rgba(43,38,34,.14)}
.dark .foot{color:#E3B489;border-top:1px solid rgba(243,236,223,.18)}
/* moldura da obra */
.frame{background:${C.cream};padding:14px;border:1px solid rgba(43,38,34,.18);
  box-shadow:0 18px 40px rgba(43,38,34,.22)}
.frame img{display:block;width:100%;height:100%;object-fit:cover}
/* capa */
.cover-art{flex:1;min-height:0;display:flex;padding:34px 0 30px}
.cover-art .frame{width:100%}
.cover-art .frame img{height:100%}
.cover-title{display:flex;flex-direction:column;gap:14px}
.cover-title h1{font-size:96px}
.cover-title .sub{font-family:'EB Garamond',serif;font-style:italic;font-weight:500;
  font-size:40px;color:${C.slate}}
/* split obra + texto */
.split{flex:1;min-height:0;display:grid;grid-template-columns:.92fr 1.08fr;gap:52px;align-items:center}
.split .frame{height:76%;align-self:center}
.split .txt{display:flex;flex-direction:column;gap:26px}
/* faixa de crise */
.crise{background:${C.terraDeep};color:${C.cream};padding:34px 40px;border-radius:14px;
  font-family:'EB Garamond',serif;font-weight:500;font-size:34px;line-height:1.4}
.crise b{font-weight:600}
.cta-sign{font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:600;
  font-size:44px;color:${C.terra};margin-top:8px}
</style>`;

const BAR = `<div class="bar"><span>Mayara Barros</span><span class="mid">@universpsiquee</span><span>CRP 03/36219</span></div>`;
const FOOT = `<div class="foot">Ciência com afeto</div>`;

function page(inner, cls = "") {
  return `<!doctype html><html><head>${HEAD}</head><body>
<div class="slide ${cls}">${BAR}${inner}${FOOT}</div></body></html>`;
}

// ---- Conteúdo dos 9 slides ----
const slides = [];

// 1 — CAPA
slides.push(page(`
  <div class="cover-art"><div class="frame"><img src="../obra-web.jpg"></div></div>
  <div class="cover-title">
    <h1>Ainda há uma jogada.</h1>
    <div class="sub">Mesmo quando o tabuleiro diz xeque-mate.</div>
  </div>`, ""));

// 2 — A OBRA (split com o rapaz)
slides.push(page(`
  <div class="split">
    <div class="frame"><img src="../obra-rapaz.jpg"></div>
    <div class="txt">
      <h2>Há quase dois séculos, este homem está em <em>xeque-mate</em>.</h2>
      <p>Ele apostou a própria alma numa partida contra o diabo. E perdeu. Pelo menos é o que parece.</p>
      <div class="ficha"><b>Moritz Retzsch</b> · Os Jogadores de Xadrez · séc. XIX</div>
    </div>
  </div>`, "cream2"));

// 3 — A LENDA (dark)
slides.push(page(`
  <div class="body">
    <div class="eyebrow">A história que não morre</div>
    <hr class="rule">
    <h2>Então um enxadrista olhou a tela e disse: <em>o rei ainda tem uma jogada</em>.</h2>
    <p>Provavelmente nunca aconteceu. Mas a lenda atravessou gerações.</p>
  </div>`, "dark"));

// 4 — DO QUADRO PARA A VIDA (a ponte: sai da lenda e chega em quem lê)
slides.push(page(`
  <div class="body">
    <div class="eyebrow">Fora do quadro</div>
    <hr class="rule">
    <h2>Todo mundo já sentou nesse lado do <em>tabuleiro</em>.</h2>
    <p>Aquele em que a partida parece perdida e não há mais o que fazer. E é justo no aperto que a saída fica mais difícil de enxergar.</p>
  </div>`, ""));

// 5 — O MOVIMENTO (slide de ciência cortado a pedido do Marcelo, 03/08. Fundo
// passou a cream2 para não colar dois cremes seguidos com o slide 4)
slides.push(page(`
  <div class="body">
    <div class="eyebrow">O movimento</div>
    <hr class="rule">
    <h2>O que vira o jogo é voltar a olhar o <em>tabuleiro</em>.</h2>
    <p>Não a versão que o medo conta, os dados reais da partida. Trocar a leitura automática pela observação do que está de fato ali é parte do que se treina na terapia.</p>
  </div>`, "cream2"));

// 6 — FRANKL (fundo passou a creme para manter a alternância)
slides.push(page(`
  <div class="body">
    <div class="eyebrow">Quem já esteve no pior tabuleiro</div>
    <hr class="rule">
    <h2>Viktor Frankl achou uma jogada onde não havia nenhuma.</h2>
    <p>Sobrevivente de um campo de concentração, escreveu que, quando não se pode mudar a situação, ainda resta escolher a atitude diante dela.</p>
    <div class="ficha"><b>Viktor Frankl</b> · Em Busca de Sentido · 1946</div>
  </div>`, ""));

// 7 — REFLEXÃO (dark, Nietzsche) — o slide que decide salvamento
slides.push(page(`
  <div class="body">
    <div class="big-quote">“Quem tem um porquê para viver suporta quase todo como.”</div>
    <p>A frase é de Nietzsche, e Frankl a repetia. Ter um sentido não tira o peso do tabuleiro. Ele devolve a pergunta que o medo calou: qual é a sua próxima jogada?</p>
  </div>`, "dark"));

// 8 — CTA + crise
slides.push(page(`
  <div class="body">
    <div class="eyebrow">Antes de desistir do jogo</div>
    <hr class="rule">
    <h2>Se hoje parece xeque-mate, talvez seja só a hora de olhar de novo.</h2>
    <p>Com menos medo e mais presença. Salva este post para quando o jogo apertar.</p>
    <div class="crise">Se o peso estiver grande demais para carregar sozinho, o <b>CVV</b> atende de graça, 24 horas, no <b>188</b>.</div>
    <div class="cta-sign">Ciência com afeto · Mayara Barros · CRP 03/36219</div>
  </div>`, ""));

slides.forEach((html, i) => {
  const n = String(i + 1).padStart(2, "0");
  fs.writeFileSync(path.join(OUT, `slide-${n}.html`), html);
});
// preview único
fs.writeFileSync(
  path.join(__dirname, "preview.html"),
  `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;background:#555;display:flex;flex-wrap:wrap;gap:16px;padding:16px}iframe{width:1080px;height:1350px;border:0;transform:scale(.4);transform-origin:top left;margin:0 -648px -810px 0}</style></head><body>${slides
    .map((_, i) => `<iframe src="slides/slide-${String(i + 1).padStart(2, "0")}.html"></iframe>`)
    .join("")}</body></html>`
);
console.log("OK: " + slides.length + " slides gerados em slides/");
