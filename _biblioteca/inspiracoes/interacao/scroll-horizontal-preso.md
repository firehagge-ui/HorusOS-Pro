# Inspiração: tira horizontal presa, com espera na entrada e na saída

- **Tipo:** interacao
- **De onde:** xmethod — https://web3.xmethod.de/ (seção de portfólio)
- **Segmento de origem:** estúdio de design web3 / portfólio de agência
- **Visto em:** 24/08/2026
- **Teardown irmão:** ainda não existe a página inteira estudada

---

## O que é

A seção de portfólio vira um trilho alto (400vh no original). A janela **prende** no
alto da tela e a fila de cards anda da direita para a esquerda enquanto a pessoa rola
para baixo. Oito cards, largura fixa, sem tag, com um `<a>` vazio cobrindo o card
inteiro.

O detalhe que quase todo clone perde não é o movimento, é o **repouso**: a tira fica
parada nos primeiros 30% do trilho, anda só no miolo de 40%, e para de novo nos
últimos 30%.

## Por que marca

Três mecanismos, nessa ordem de importância:

1. **A espera da entrada é o que constrói a atenção.** A seção prende antes de
   qualquer coisa se mexer. A pessoa registra "isto travou" e só então o conteúdo
   começa a deslizar. Sem essa pausa, o pin e o movimento acontecem no mesmo quadro e
   a leitura é de bug, não de intenção.
2. **A espera da saída devolve o último card.** Sem ela, o item final é arrancado da
   tela no instante em que termina de chegar, e quem rola nunca chega a lê-lo.
3. **O percurso não é um chute.** É `larguraDaTira menos larguraDaJanela`. No original
   dá `-165,7rem`, e a conta fecha exata: 8 cards de 31,3rem + 7 vãos de 1,39rem menos
   a janela de 94,44rem. É isso que faz o último card parar **rente à margem direita**
   em vez de sobrar vazio na fila ou cortar item.

## Como recriar

Estrutura mínima:

```
section  → min-height: 300vh;  overflow: clip;  view-timeline-name: --pf
  .pin   → position: sticky; top: 0; height: 100dvh; flex column center
    .pista → max-width do envelope; padding-inline; container-type: inline-size
      .tira → display:flex; flex:none; width:max-content; gap
```

A animação em CSS puro, sem uma linha de JS:

```css
.tira {
  animation-name: corre; animation-duration: auto;
  animation-timing-function: linear; animation-fill-mode: both;
  animation-timeline: --pf;
  animation-range: contain 0% contain 100%;
}
@keyframes corre {
  0%, 30%   { transform: translate3d(0, 0, 0); }
  70%, 100% { transform: translate3d(calc(-100% + 100cqw), 0, 0); }
}
```

Duas escolhas carregam o peso todo:

- **`animation-range: contain 0% contain 100%`.** Para um sujeito mais alto que a
  tela, essa faixa começa e termina **exatamente** onde um `sticky; top: 0` prende e
  solta. A conta deixa de depender da altura do monitor.
- **`calc(-100% + 100cqw)`.** `-100%` é a tira inteira (a caixa é `max-content`), e
  `100cqw` é a largura da janela, lida por container query. Somar a janela de volta dá
  o percurso exato **em qualquer largura de tela**. É o que aposenta a tabela de
  porcentagens por breakpoint (`-34%` no desktop, `-46%` no tablet, `-58%` no celular),
  que era chute e errava nas larguras entre os breakpoints.

- **Biblioteca detectada:** o xmethod usa **Webflow IX2** (`SCROLL_PROGRESS` com
  `smoothing: 50`), **não** GSAP ScrollTrigger — confirmado: não há `scrub:`, `pin:`
  nem `horizontal` em nenhum dos 27 scripts da página. Aqui foi refeito em **CSS puro**,
  com laço de `requestAnimationFrame` só onde falta `animation-timeline`.
- **Snippet:** implementação viva em `site/assets/site.css` §7e-bis e o fallback em
  `site/index.html`.
- **Custo honesto:** zero JS e zero biblioteca no caminho que suporta CSS. O `overflow`
  do pai **tem** de ser `clip`, nunca `hidden`: `hidden` cria contêiner de rolagem e a
  linha do tempo passa a medir dentro de uma caixa em que nada se move. Onde não há
  `animation-timeline`, o trilho alto só pode entrar por classe que o JS adiciona —
  trilho de três telas sem ninguém para movê-lo são três telas de nada.

## Onde cabe

- **Site da Hórus** — já aplicado no portfólio em 24/08/2026.
- **Grão da Serra** — a linha do beneficiamento (compra do grão maduro, pilagem,
  secagem, torra, moagem) é uma fila de etapas com ordem obrigatória: é o caso em que
  a horizontal presa **significa** alguma coisa, porque a ordem é o conteúdo.
- **Permita-se Fitness** — a grade de modalidades (hidroginástica, pilates, zumba,
  boxe, dança, ballet kids) é fila sem hierarquia; cabe, mas rende menos que no Grão.
- **Aion / Dr. Giovanni** — cabe tecnicamente e **não deve entrar**: ver abaixo.

## Cuidado

- **Compliance trava.** `_memoria/design/60-motion.md` limita cliente regulado (CFO,
  CFP) a entrada suave e rolagem suave. Prender a tela e sequestrar o eixo do scroll é
  exatamente o oposto: não entra em Aion nem em Dr. Giovanni, por mais que a fila de
  serviços pareça pedir.
- **`prefers-reduced-motion` desliga tudo**, e desligar não é só parar a animação: a
  seção precisa **voltar ao fluxo normal** (`min-height: 0`, `position: static`) e a
  tira virar carrossel de arrastar. Senão sobram três telas de vazio.
- **A régua do 60-motion.md:** um movimento-assinatura por página. Esta interação é
  cara em atenção; se a página já tem outro efeito grande, um dos dois sai.
- O `smoothing: 50` do original é amortecimento (a tira **persegue** o scroll, com
  atraso). A versão em CSS é 1:1. Se o Marcelo pedir o "peso" do original, o caminho é
  `animation-timing-function` com curva, não voltar para biblioteca.
