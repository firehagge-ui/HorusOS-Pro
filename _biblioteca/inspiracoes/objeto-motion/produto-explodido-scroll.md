# Inspiração: Produto explodido que se monta/desmonta no scroll

- **Tipo:** objeto-motion
- **De onde:** WRK Timepieces — https://www.wrk-timepieces.com/products/acf-01
- **Segmento de origem:** relojoaria de luxo / manufatura de alta relojoaria
- **Visto em:** 14/08/2026
- **Teardown irmão:** `referencias/wrk-timepieces.md`

---

## O que é

Um objeto físico (aqui, um relógio) que se **desmonta em suas peças** conforme o leitor
rola a página — cada componente se afasta do conjunto e aparece isolado com sua ficha:
nome, peso em grama, material. No fim, a seção "Specs" mostra as ~9-12 peças uma a uma,
cada uma com render próprio e dado. O scroll é o eixo: rolar = abrir o objeto e ver por
dentro. Print (só o hero, o resto anima): `scratchpad/shots/wrk-timepieces.png`.

## Por que marca

Porque **encena a prova em vez de afirmá-la**. "Engenharia de precisão" é adjetivo que
qualquer marca escreve; ver as 12 peças se separarem, cada uma com peso ao milésimo,
faz o olho concluir "isto é sério" sem que o texto precise dizer. O movimento não é
decoração — é o argumento. E prende porque cria um loop de descoberta: cada rolada
revela mais uma peça, e o leitor rola para ver a próxima (mesma mecânica de "1 de 6" de
galeria, mas aplicada à anatomia do produto). O dado não-redondo (0.192 G) sela a
credibilidade: só quem mediu escreve assim.

## Como recriar

- **Técnica:** peças em camadas separadas (PNGs com fundo transparente, uma por
  componente — o WRK serve de Storyblok exatamente assim), posicionadas em `position`
  absoluto sobre um container **pinado** (`position: sticky` ou pin de scroll). Cada
  peça ganha um `translate`/`opacity` amarrado ao progresso do scroll: no começo estão
  sobrepostas montando o objeto; conforme rola, se afastam radialmente ("explodem") e a
  ficha de cada uma entra. Variante mais simples e leve: sequência de seções `sticky`,
  cada uma trocando o render e o texto, sem explosão contínua.
- **Biblioteca detectada:** não confirmada no scrape (custom build, "Coded by Ruud
  Luijten"). O efeito é o repertório clássico de **GSAP ScrollTrigger + pin/scrub**,
  com **Lenis** para o scroll suave; render pesado pode usar canvas/WebGL, mas a versão
  da Horus **não precisa** — dá para fazer com PNGs em camada + ScrollTrigger puro.
- **Snippet:** ainda não vendorizado. Candidato a virar
  `_biblioteca/motion/snippets/explode-on-scroll.md` (pin + scrub de camadas). Conferir
  o arsenal em `_biblioteca/motion/` antes de escrever do zero.
- **Custo honesto:** é dos padrões mais caros. Cada peça é um asset separado (produção
  de imagem ou foto recortada); scroll-scrub exige cuidado de performance (throttle,
  `will-change`, testar em celular real); e mal feito trava o scroll. Para cliente em
  Netlify com foto própria, fazer a **versão enxuta** (poucas etapas, sticky + fade em
  vez de explosão WebGL contínua).

## Onde cabe

Qualquer oferta cujo valor **é um processo em etapas** que normalmente fica invisível —
o padrão pega o processo e o transforma em espetáculo, cada etapa entrando com foto/asset
real do cliente. Encaixe do roster:

- **Dr. Giovanni (cliente #1):** as **etapas do implante** se separando no scroll
  (avaliação → cirurgia → cicatrização → prótese), com os materiais reais (titânio) e a
  ficha de cada fase. Encena a "engenharia de precisão" em vez de afirmá-la — mas em
  regulado a legenda é informativa, sem promessa de resultado (CFO).
- **Grão da Serra (cliente #4):** as **etapas do beneficiamento** — escolha do grão →
  pilagem → secagem ao sol → torra → moagem. Resolve o problema central dele: provar o
  diferencial ("a gente não planta, a gente escolhe") **sem** lavoura, cafezal ou "do pé
  à xícara", porque o valor *é* o beneficiamento. Cada etapa com foto real do Nelson, não
  banco de imagem.
- **Clientes futuros de produto físico ou artesanato** (interiores, marcenaria, alimento,
  cosmético) com etapas manuais que ninguém mostra.

Não serve para serviço abstrato sem objeto visível — em psicologia (Aion, Mayara) não há
peça para desmontar, e forçar vira gimmick.

## Cuidado

- **`prefers-reduced-motion`:** obrigatório. Com a preferência ligada, servir as etapas
  como blocos estáticos empilhados (a informação não pode depender do movimento). Ver
  `_memoria/design/60-motion.md`.
- **Peso e mobile:** o mecanismo é pesado; testar em celular de verdade (a máquina de
  print não valida mobile). Teto de peso por página vale.
- **Integridade sobre o dado:** o poder do padrão vem da ficha por peça (peso, origem,
  material). **Só entra dado real do cliente.** Inventar gramagem ou origem para "encher"
  o objeto explodido é o antipadrão que `_memoria/integridade.md` proíbe — num alimento,
  vira alegação falsa. Etapa sem dado confirmado fica sem número, nunca com número
  plausível.
- **Compliance:** sem promessa de resultado nem superlativo nas legendas das etapas.
  Aparência lida do print (hex/fonte) é **aparente**; os valores de cor e fonte deste
  padrão vêm do `branding` do scrape (reais): acento laranja `#FF6B00`, `TT Interphases
  Pro` + mono.
