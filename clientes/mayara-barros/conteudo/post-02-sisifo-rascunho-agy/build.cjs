// build.cjs — Gera os 8 slides do Post #2 da Mayara Barros e renderiza em PNG via Playwright (1080x1440)
// Design system do Post #1 (clientes/mayara-barros/marca.md e post-01-xeque-mate/build.js)
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const OUT = path.join(__dirname, "slides");
fs.mkdirSync(OUT, { recursive: true });

// Design System (marca.md — Modo Galeria Claro)
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
html,body{width:1080px;height:1440px;overflow:hidden;background:${C.cream}}
.slide{width:1080px;height:1440px;position:relative;display:flex;flex-direction:column;
  padding:80px 84px 68px;background:${C.cream};color:${C.ink}}
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
h1{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:88px;line-height:1.05;
  letter-spacing:-.01em}
h1 em{font-style:italic;color:${C.terra}}
.dark h1 em{color:#E3B489}
h2{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:70px;line-height:1.05;
  letter-spacing:-.005em}
h2 em{font-style:italic;color:${C.terra}}
.dark h2 em{color:#E3B489}
p{font-family:'EB Garamond',serif;font-weight:500;font-size:39px;line-height:1.5;max-width:27ch}
.big-quote{font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:600;
  font-size:76px;line-height:1.15;letter-spacing:-.005em}
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
.cover-art{flex:1;min-height:0;max-height:730px;display:flex;padding:20px 0 24px}
.cover-art .frame{width:100%}
.cover-art .frame img{height:100%;object-position:center 25%}
.cover-title{display:flex;flex-direction:column;gap:14px;margin-bottom:24px}
.cover-title h1{font-size:82px;line-height:1.02}
.cover-title .sub{font-family:'EB Garamond',serif;font-style:italic;font-weight:500;
  font-size:36px;line-height:1.4;color:${C.slate};max-width:26ch}

/* split obra + texto */
.split{flex:1;min-height:0;display:grid;grid-template-columns:.92fr 1.08fr;gap:52px;align-items:center}
.split .frame{height:76%;align-self:center}
.split .frame img{object-position:center 20%}
.split .txt{display:flex;flex-direction:column;gap:26px}
.split p{max-width:22ch}

/* faixa de crise CVV */
.crise{background:${C.terraDeep};color:${C.cream};padding:26px 32px;border-radius:12px;
  font-family:'EB Garamond',serif;font-weight:500;font-size:30px;line-height:1.4}
.crise b{font-weight:600}
.cta-sign{font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:600;
  font-size:42px;color:${C.terra};margin-top:4px}
</style>`;

const BAR = `<div class="bar"><span>Mayara Barros</span><span class="mid">@universpsiquee</span><span>CRP 03/36219</span></div>`;
const FOOT = `<div class="foot">Ciência com afeto</div>`;

function page(inner, cls = "") {
  return `<!doctype html><html><head>${HEAD}</head><body>
<div class="slide ${cls}">${BAR}${inner}${FOOT}</div></body></html>`;
}

// ---- Conteúdo dos 8 slides ----
const slides = [];

// 1 — CAPA
slides.push(page(`
  <div class="cover-art"><div class="frame"><img src="../obra-sisifo.jpg"></div></div>
  <div class="cover-title">
    <h1>E quando o sentido <em>não aparece?</em></h1>
    <div class="sub">No post anterior, falamos sobre encontrar um porquê. Mas há dias em que o tabuleiro parece apenas se repetir.</div>
  </div>`, ""));

// 2 — SPLIT: A OBRA
slides.push(page(`
  <div class="split">
    <div class="frame"><img src="../obra-sisifo.jpg"></div>
    <div class="txt">
      <h2>A condenação da <em>repetição</em>.</h2>
      <p>Há quase quinhentos anos, Ticiano pintou o castigo de Sísifo: empurrar uma rocha até o cume da montanha, apenas para vê-la rolar morro abaixo. Todos os dias, pela eternidade.</p>
      <div class="ficha"><b>Tiziano Vecellio</b> · Sísifo · 1548 a 1549 (Museo del Prado)</div>
    </div>
  </div>`, "cream2"));

// 3 — TEXTO (DARK)
slides.push(page(`
  <div class="body">
    <div class="eyebrow">O peso do ciclo</div>
    <hr class="rule">
    <h2>O cansaço de recomeçar do <em>zero</em>.</h2>
    <p>Na mitologia ou na vida real, o sofrimento mais difícil nem sempre é uma grande tragédia. Muitas vezes é a sensação de que o esforço não acumula, de que a pedra sempre volta ao ponto de partida.</p>
  </div>`, "dark"));

// 4 — TEXTO (CREAM)
slides.push(page(`
  <div class="body">
    <div class="eyebrow">A filosofia do absurdo</div>
    <hr class="rule">
    <h2>Albert Camus e o <em>absurdo</em>.</h2>
    <p>Em 1942, em meio à Segunda Guerra, Albert Camus olhou para esse mito e deu um nome a essa angústia: o absurdo. O choque entre a nossa busca humana por significado e o silêncio da realidade.</p>
    <div class="ficha"><b>Albert Camus</b> · O Mito de Sísifo · 1942</div>
  </div>`, ""));

// 5 — TEXTO (CREAM2)
slides.push(page(`
  <div class="body">
    <div class="eyebrow">A revolta lúcida</div>
    <hr class="rule">
    <h2>A pedra pertence a quem a <em>carrega</em>.</h2>
    <p>Camus percebeu algo decisivo no instante em que Sísifo desce a montanha para buscar a rocha. É nesse retorno, com passos lúcidos, que ele assume seu destino. A dignidade não está em negar o cansaço, mas em não se render à ilusão.</p>
  </div>`, "cream2"));

// 6 — CITAÇÃO (DARK)
slides.push(page(`
  <div class="body">
    <div class="big-quote">“É preciso imaginar Sísifo feliz.”</div>
    <p>A conclusão mais famosa de Camus não é otimismo ingênuo. É a constatação de que o valor da experiência humana reside na coragem de viver o presente, mesmo sem a garantia de um aplauso no final.</p>
    <div class="ficha"><b>Albert Camus</b> · O Mito de Sísifo · 1942</div>
  </div>`, "dark"));

// 7 — TEXTO (CREAM)
slides.push(page(`
  <div class="body">
    <div class="eyebrow">O acolhimento do processo</div>
    <hr class="rule">
    <h2>O que a clínica encontra na <em>montanha</em>.</h2>
    <p>Na psicologia, aprendemos que tentar encontrar um propósito mágico para toda dor só aumenta o peso nos ombros. Acolher a realidade do processo, com apoio técnico e presença, transforma o peso da rotina em terreno conhecido.</p>
  </div>`, ""));

// 8 — CTA + FAIXA CVV (CREAM2)
slides.push(page(`
  <div class="body">
    <div class="eyebrow">Não carregar sozinho</div>
    <hr class="rule">
    <h2>Você não precisa carregar a pedra <em>sozinho</em>.</h2>
    <p>Reconhecer a exaustão dos ciclos que se repetem é o primeiro passo para ressignificar o caminho. Quando quiser conversar, meu direct está aberto.</p>
    <div class="cta-sign">Ciência com afeto · Mayara Barros · CRP 03/36219</div>
    <div class="crise">Em momentos de sofrimento agudo, o <b>CVV</b> oferece atendimento gratuito e confidencial pelo telefone <b>188</b>.</div>
  </div>`, "cream2"));

// Salva arquivos HTML
slides.forEach((html, i) => {
  const n = String(i + 1).padStart(2, "0");
  fs.writeFileSync(path.join(OUT, `slide-${n}.html`), html);
});

// Preview HTML
fs.writeFileSync(
  path.join(__dirname, "preview.html"),
  `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;background:#333;display:flex;flex-wrap:wrap;gap:16px;padding:16px}iframe{width:1080px;height:1440px;border:0;transform:scale(.35);transform-origin:top left;margin:0 -702px -936px 0}</style></head><body>${slides
    .map((_, i) => `<iframe src="slides/slide-${String(i + 1).padStart(2, "0")}.html"></iframe>`)
    .join("")}</body></html>`
);

console.log(`OK: ${slides.length} slides HTML gerados em slides/`);

// Renderização dos PNGs via Playwright
async function renderAll() {
  console.log("Iniciando renderização Playwright...");
  const browser = await chromium.launch({ headless: true });
  const pageInstance = await browser.newPage({
    viewport: { width: 1080, height: 1440 },
    deviceScaleFactor: 1,
  });

  for (let i = 0; i < slides.length; i++) {
    const n = String(i + 1).padStart(2, "0");
    const htmlPath = path.join(OUT, `slide-${n}.html`);
    const pngPath = path.join(OUT, `slide-${n}.png`);
    
    const fileUrl = `file:///${htmlPath.replace(/\\/g, "/")}`;
    await pageInstance.goto(fileUrl, { waitUntil: "networkidle" });
    await pageInstance.evaluateHandle("document.fonts.ready");
    await pageInstance.waitForTimeout(300);

    await pageInstance.screenshot({
      path: pngPath,
      clip: { x: 0, y: 0, width: 1080, height: 1440 },
    });
    console.log(`Renderizado: slide-${n}.png (1080x1440)`);
  }

  await browser.close();
  console.log("Todos os 8 slides renderizados com sucesso em slides/");
}

renderAll().catch((err) => {
  console.error("Erro no render:", err);
  process.exit(1);
});
