# Inspiração: o convite final dentro de um cartão de vidro

- **Tipo:** secao
- **De onde:** akis.studio — https://akis.studio/en (seção imediatamente acima do rodapé)
- **Segmento de origem:** estúdio de branding e imagem (Bruxelas)
- **Visto em:** 24/08/2026
- **Teardown irmão:** ainda não existe a página inteira estudada

---

## O que é

A última seção antes do rodapé não deixa o convite solto na página: ele mora dentro de
um painel. O painel tem `backdrop-blur-md`, gradiente radial ancorado **fora do centro**
(`at 33% 0%`), borda de 1px em `#666` a 20% de opacidade, raio de 10px — e recuo
vertical grande e **assimétrico**: 160px em cima contra 128px embaixo. Dentro, só um
`<h2>` e um botão branco, com 48px entre eles.

Atrás do painel, uma imagem de fundo que sangra a seção inteira.

## Por que marca

1. **O recuo assimétrico é o que faz o painel respirar em vez de inchar.** Mais ar em
   cima que embaixo empurra o conteúdo para baixo do centro óptico, que é onde o olho o
   espera. Recuo igual nos quatro lados daria a mesma área e leria como caixa.
2. **A luz fora do centro dá direção.** `at 33% 0%` faz o gradiente parecer luz vinda
   de uma fonte, não brilho de template. Centralizado, o mesmo gradiente vira aquele
   halo genérico de landing de SaaS.
3. **O painel é o que separa a seção do rodapé — sem fio nenhum.** Ver abaixo.

## O achado maior: separar seção sem uma linha sequer

Medido na página: `border-top-width: 0px` no `<footer>` do akis, e
`background-color: rgba(0,0,0,0)`. **Zero fio na página inteira.** A separação sai de
três coisas somadas:

1. **Troca de fundo** — a imagem sangrada do CTA simplesmente acaba, e o preto puro do
   `body` começa.
2. **Ar** — 144px no fim do CTA mais 48px no começo do rodapé.
3. **Mudança de largura** — o CTA sangra a tela; o rodapé é contido em 1520px.

E dentro do rodapé, o que marca onde uma lista começa não é fio: é o **rótulo colorido**
(o laranja `#ed731a`, 14px) acima de cada coluna.

**Régua divisória é muleta.** Serve para tapar espaçamento que não foi resolvido. Onde
o ar, a cor de fundo e a largura fazem o trabalho, o fio some e a página fica mais
cara. Essa é a lição mais transferível das três fichas deste lote, porque é regra de
página inteira, não de componente.

## Como recriar

- Painel: borda de 1px, raio, `radial-gradient` fora do centro por cima da cor de
  superfície, recuo vertical grande e assimétrico. Se a casa tiver token de vidro, usar
  o token e deixar o radial ser a única coisa importada.
- Escala de tipo do akis: **px fixo, sem `clamp()`**, oito degraus, **peso 500 em
  todos**; a responsividade é trocar a classe (`text-title-m md:text-title-l
  lg:text-title-xl`), não interpolar. É a mesma filosofia do `PLANO.md` da casa, vinda
  de outro lugar.
- **Biblioteca detectada:** GSAP (o `data-animate="showOnScroll"` deixa resíduo de
  `translate`, `rotate` e `scale` inline) com UnicornStudio 1.5.2. Nada disso é
  necessário: o painel é CSS puro, e a entrada pode ser o `IntersectionObserver` que a
  casa já usa.
- **Custo honesto:** o `backdrop-filter` é o item caro (força camada de composição e
  pesa no celular). No site da Hórus ele **não** foi importado: a doutrina da casa diz
  que vidro é feito de luz, não de desfoque, e `backdrop-filter` fica reservado ao
  cabeçalho. Só o gradiente radial a 33% 0% atravessou.

## Onde cabe

- **Site da Hórus** — já aplicado na chamada final em 24/08/2026, e a varredura de fios
  entre seções saiu junto: o fio acima do rodapé e o fio entre os painéis de serviço
  foram removidos, com ar e rótulo colorido no lugar deles.
- **Qualquer cliente, na última seção.** É dos padrões mais transferíveis da biblioteca:
  não afirma nada, só emoldura o convite.
- **A lição de separar sem fio vale para a casa inteira**, inclusive para peça que não é
  site.

## Cuidado

- **Nada aqui é afirmação**, então o padrão passa em cliente regulado sem ressalva. O
  que precisa de revisão é o **texto** dentro do painel, não o painel.
- O `<h2>` do akis é centralizado. **Isso não é obrigatório** e não veio para a Hórus:
  o alinhamento à esquerda da chamada final é decisão registrada do Marcelo desde
  05/08/2026. Copiar o continente não obriga a copiar a diagramação.
- Lista larga dentro de painel largo: no site da Hórus a lista de canais estava travada
  em 760px dentro de um painel de 1232 e deixava metade dele vazia à direita. **Vazio de
  um lado só lê como desequilíbrio, não como ar** — a lista foi para largura cheia.
