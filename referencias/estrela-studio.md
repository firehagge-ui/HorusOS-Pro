# Teardown: Estrela Studio

- **URL:** https://estrela.studio/
- **Segmento:** estúdio de branding e design digital (Viena e Cidade do Cabo)
- **Estudado em:** 25/08/2026
- **Nota:** 9/10
- **Contexto:** o Marcelo mandou como referência **do cabeçalho**: o aspecto de vidro e
  o aro que acende ao redor quando o ponteiro passa. O teardown foca nisso; o resto da
  página entra só onde explica a decisão

---

## Estrutura, na ordem

1. Hero de tela cheia com showreel em vídeo
2. Esteira de imagens
3. "Crafting competitive digital experiences" — sobre, com bloco de texto único
4. Featured Work, quatro cases numerados `01`..`04`
5. Who we are
6. What we do, três serviços numerados
7. Depoimentos em carrossel (onze)
8. FAQ
9. Rodapé de tela cheia, com índice, redes, contato e newsletter

Comparado com `_memoria/design/00-anatomia.md`: cumpre quase tudo, e o que a Hórus não
pode copiar é o bloco 7 (depoimento nominal com cargo), que aqui é o miolo da prova.

---

## O que copiar

### O vidro: luz, não desfoque sozinho

A receita exata, medida no `index.CO_elZJh.css` deles:

```css
background: rgba(255,255,255,.1);
backdrop-filter: blur(1.2rem);
box-shadow: inset 0 0 .8rem rgba(255,255,255,.02),
            inset 0 0 .2rem rgba(255,255,255,.2);
border-radius: .2rem;
```

- **Como é feito.** Duas sombras **internas**, não externas. A larga (`.8rem`) é quase
  invisível e só levanta o miolo do painel; a curta (`.2rem`) fica presa na aresta e é
  ela que desenha o aro claro em volta. O desfoque de fundo só entra porque o painel de
  fato passa por cima de conteúdo em movimento.
- **Por que funciona.** Sombra externa faz o painel flutuar **acima** da página, e é o
  card fantasma que a casa já proíbe. Sombra interna faz a luz nascer **dentro** do
  vidro, que é como um objeto translúcido se comporta de verdade: a borda é a parte mais
  brilhante porque é onde a espessura do material aparece. Bate exatamente com a regra
  que já está em `site.css` §1 da Hórus: vidro é feito de luz.
- Essa mesma receita é reusada em onze lugares do site (nav, botões de vidro, filtros,
  legendas). É **uma** superfície, declarada uma vez e reaproveitada, não um efeito
  aplicado por capricho.

### A nav dividida em blocos separados, cada um com o próprio aro

- **Como é feito.** Não é uma barra de ponta a ponta. São três painéis de vidro
  independentes, todos com 4rem de altura, `border-radius: .2rem` (quase quadrado) e
  `margin: 0 .15rem`: logo, links, e o botão de menu. A barra em si é transparente e
  `pointer-events: none`; só os três blocos recebem o ponteiro.
- **Por que funciona.** É o que permite o aro existir **nos quatro lados**. Barra de
  ponta a ponta só tem uma aresta visível (a de baixo), e "iluminar ao redor" nela é
  impossível: não há redor. Quebrar em blocos flutuantes é a condição do efeito, não
  enfeite.
- Vantagem de leitura: o vão entre os blocos separa identidade, navegação e ação sem
  precisar de fio nem de cor.

### O que acende, acende por transição de fundo, não por sombra nova

`transition: background .4s var(--ease)` nos três blocos. No repouso o vidro está a 10%
de branco; ao receber o ponteiro ele sobe. O aro (`inset`) fica onde está: o que muda é
a quantidade de luz atrás dele. Acender mudando a sombra faz o painel "pular" de
tamanho aparente; acender mudando o fundo faz o vidro parecer que ficou mais grosso.

### Raio quase zero em superfície, quase zero em botão

`.2rem` (2px) na nav e nos botões de vidro. Não é canto vivo (que corta), é o canto
mínimo que ainda parece fabricado. Confirma a escolha do Xmethod (4px) e é o argumento
para o botão retangular da Hórus.

---

## Tipografia e cor

- PP Migra (serifa de alto contraste) nos títulos, PP Neue Montreal no corpo. h2 em
  ~165px, corpo em ~18,7px: razão de 8,8x, a maior de todas as referências da casa
- Fundo `#020202`, texto `#FBFBF4` (osso, não branco puro). Acentos: `#89C8FF` (azul
  claro), `#FDFF99` (amarelo) e `#0000EE` (azul de link). Três acentos, cada um em um
  contexto só
- Escala de espaço em `rem` com base 4. Tudo em `rem`, nada em px: o site inteiro
  escala junto quando a fonte do sistema muda

---

## O que não copiar

- **A nav nasce `visibility: hidden` e só aparece por JavaScript.** Sem JS o site não
  tem navegação nenhuma. Foi o que impediu o print de capturá-la aqui. É uma escolha
  cara: a navegação é a última coisa que deveria depender de script
- **Depoimento nominal com cargo e empresa** é o miolo da prova deles. Em cliente
  regulado da Hórus (CFP, CFO) isso é vedado, e no site da própria agência ainda não
  existe autorização de cliente para citar nome
- Onze depoimentos em carrossel é excesso: do quarto em diante ninguém lê

---

## Aplicado onde

Cabeçalho do site institucional da Hórus, 25/08/2026: a barra virou painel de vidro
flutuante com aro `inset`, o botão de contato ganhou superfície de vidro própria
(diferente do metal líquido da home) e a luz do aro segue o ponteiro, que é a leitura
do Marcelo do efeito daqui.
