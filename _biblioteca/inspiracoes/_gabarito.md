# Inspiração: <nome do padrão>

- **Tipo:** hero / navegacao / card / secao / interacao / transicao / objeto-motion
- **De onde:** <site> — <URL>
- **Segmento de origem:** <ex: relojoaria de luxo, agência SEO, SaaS>
- **Visto em:** <data>
- **Teardown irmão:** `referencias/<slug>.md` (se existir a página inteira estudada)

---

## O que é

O padrão isolado, em duas ou três frases. Não a página: **só o componente ou a
interação.** Se tem print, o caminho dele.

## Por que marca

O mecanismo, não o elogio. *Por que* o olho para, *por que* gruda, *que* decisão faz
funcionar. Se não dá pra explicar o mecanismo, não é inspiração, é print bonito.

## Como recriar

- A técnica em linhas gerais (HTML/CSS/JS), ou o caminho.
- **Biblioteca detectada:** GSAP / three.js / Lenis / WebGL / CSS puro / Lottie / Rive
  (o que o site carrega, se der pra ver no scrape).
- **Snippet:** se já existe ou dá pra vendorizar → `_biblioteca/motion/snippets/<x>.md`.
- **Custo honesto:** o que isso pesa (WebGL de fundo é pesado; scroll-scrub exige
  cuidado de performance; etc).

## Onde cabe

Em que segmento ou peça da Horus isso serviria, e com que adaptação. **Campo
obrigatório** — ficha sem isso é galeria morta. Ex: "o produto-explodido serve pro
Grão da Serra mostrar o beneficiamento do grão em etapas".

## Cuidado

Pegadinha antes de reusar: `prefers-reduced-motion` (todo motion), peso, ou trava de
compliance (cliente regulado — nada que insinue depoimento, antes/depois, promessa).
Marcar hex/fonte lidos de print como **aparente**, nunca como medido.
