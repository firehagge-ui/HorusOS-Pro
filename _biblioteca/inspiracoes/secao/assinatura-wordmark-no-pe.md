# Inspiração: o nome em escala de cartaz no pé da página

- **Tipo:** secao
- **De onde:** lessestudio — https://lessestudio.com/ · akis.studio — https://akis.studio/en
- **Segmento de origem:** estúdio de design (os dois)
- **Visto em:** 24/08/2026
- **Teardown irmão:** ainda não existe a página inteira estudada

---

## O que é

O nome da marca desenhado em escala de cartaz, ocupando a largura toda, no fim da
página. No Lesse ele mede **1728 × 500px** a 1920 de tela e fica **dentro** do
`<footer>`, como penúltimo filho (abaixo dele ainda vem a linha de redes). No akis ele
é o **último** elemento visual do rodapé, por `order: 3` num `flex-col`.

**Nos dois casos não é texto com `font-size`.** É desenho vetorial:

- **Lesse:** um `<img>` invisível reserva a caixa, e duas `<div>` absolutas por cima
  usam o mesmo SVG como `mask-image`. Uma pinta gradiente linear, a outra pinta um
  brilho radial.
- **akis:** SVG inline, `fill` por `<path>` — o que permite pintar **um** elemento de
  laranja (`#ed731a`) e girá-lo no hover: há uma engrenagem clicável embutida dentro
  do wordmark.

## Por que marca

1. **O gradiente é quase invisível de propósito.** O do Lesse vai de `rgb(16,16,16)` a
   `rgb(7,7,7)` sobre preto. Meio milhar de pixels de altura que quase não se vê: é
   marca d'água em relevo, não outdoor. O drama fica todo guardado para a camada de
   luz, que só acende no gesto. Invertido — wordmark gigante e chapado em cor forte —
   o mesmo elemento vira banner e barateia a página inteira.
2. **A escala é dada pela proporção, não pelo corpo da fonte.** `width: 100%` mais
   `viewBox` = a palavra ocupa a mesma fatia da largura em qualquer tela, sem
   `clamp()`, sem `vw`, sem abrir um degrau novo na escala de tipo. Resolve de vez o
   wordmark que quebra num breakpoint.
3. **Fecha a página com identidade, não com informação.** Depois dos links, o que
   sobra na retina é o nome. É o eco do topo, e custa zero em copy.

## Como recriar

Duas rotas, e a escolha depende de ter ou não o logotipo em vetor:

**Com logotipo vetorial** (rota do Lesse, a mais fiel): SVG como `mask-image` de duas
`<div>` empilhadas, uma com `linear-gradient`, outra com `radial-gradient` e
`opacity: 0` que vai a `1`. Permite empilhar N camadas animáveis independentes, o que
um `background-clip: text` sozinho não faz.

**Sem logotipo vetorial** (foi o caso da Hórus — o logo em vetor é pendência aberta):
SVG **inline** com `<text>`, que herda a webfont da página. SVG carregado como `<img>`
**não** herda, e é por isso que a rota do `mask-image` exige o desenho pronto.

O detalhe que salva a rota do `<text>`:

```html
<text x="600" y="298" textLength="1160" lengthAdjust="spacing">HÓRUS</text>
```

`textLength` **trava** o avanço da palavra dentro do `viewBox`, mexendo só no espaço
entre as letras, nunca no desenho delas (`spacing`, e não `spacingAndGlyphs`, que
distorce o glifo). Sem isso a largura depende da métrica da fonte que estiver
desenhando naquele instante — medido no caso da Hórus, o texto passava de 1283 das
1200 unidades e o **S saía cortado**; e enquanto a webfont não chega, quem desenha é a
fonte do sistema, com outra largura. Reservar folga no alto do `viewBox` para acento:
o `Ó` sobe acima da altura de maiúscula.

- **Biblioteca detectada:** nenhuma. Lesse é SvelteKit e Tailwind, **sem GSAP**. akis
  roda UnicornStudio com GSAP, mas não para o wordmark. CSS e SVG puros dão conta.
- **Snippet:** implementação viva em `site/assets/site.css` §7f e `site/index.html`.
- **Custo honesto:** desprezível. O único JS é mover `cx`/`cy`/`fx`/`fy` do gradiente
  radial no `pointermove`, com `requestAnimationFrame` — atributo de gradiente não
  recalcula layout.

## Onde cabe

- **Site da Hórus** — já aplicado em 24/08/2026, no lugar do hex dump.
- **Grão da Serra** — cabe bem: o nome é o lugar, e fechar a página com "GRÃO DA SERRA"
  em relevo reforça a origem sem escrever mais uma linha sobre ela.
- **Icarus** — cabe, e é onde o gradiente pode ir mais longe (produto próprio, sem
  conselho por cima).
- **Mayara, Aion e Dr. Giovanni** — cabe **só na camada de baixo**: o wordmark em
  relevo, sem a luz. Ver abaixo.

## Cuidado

- **Em cliente regulado, entra sem o brilho.** A camada de grafite é tipografia, não
  movimento, e passa em qualquer régua. A luz que segue o ponteiro é efeito e cai na
  trava do `60-motion.md` para CFO e CFP.
- **Sem ponteiro (toque) o brilho nunca acende.** É limitação do Lesse também. Por isso
  a camada de baixo tem de sustentar a peça sozinha: se a palavra só existe quando o
  mouse passa, no celular ela não existe.
- **`prefers-reduced-motion`** desliga a luz e a transição.
- **Acessibilidade:** `role="img"` com `aria-label` no contêiner, e `aria-hidden` no
  desenho. O nome já está no `<h1>` e no rodapé; repetir aqui para leitor de tela é
  ruído, e a palavra é decoração.
- Os valores do Lesse acima foram lidos no CSS de produção, não inferidos de print. A
  única exceção é o **gatilho** do brilho (hover ou entrada em viewport), que não foi
  confirmado.
