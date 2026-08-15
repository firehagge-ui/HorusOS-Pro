# Layout e espaço: por que a página respira ou aperta

> A camada de baixo do `90-antipadroes.md`. Lá está o *tell* ("grid de ícone 2x3",
> "eyebrow em toda seção", "texto colado na borda"); aqui está o *porquê*, pra o
> Claude derivar o ritmo certo num caso novo em vez de só reconhecer o erro depois
> de montar a página.
>
> **Isto é leitura de consulta, não de gatilho.** Não precisa ler antes de todo
> site. Abrir quando a decisão for de layout ou espaço: montar o esqueleto das
> seções, resolver uma página que ficou "apertada" ou "repetitiva", decidir quanto
> respiro dar a um bloco. Cada seção segue o formato **princípio → por que funciona
> → como se aplica aqui → o antipadrão que previne.**

---

## 1. Grid e as quatro famílias de layout

**Princípio.** Uma página de 8 seções precisa de pelo menos **4 famílias de layout
diferentes**. Família é o esqueleto da seção (coluna única, duas colunas
assimétricas, grade de cards, faixa de texto largo, linha do tempo), não a cor nem
a foto que entra dentro dela.

**Por que funciona.** O olho agrupa por **proximidade e similaridade** (Gestalt):
coisas com a mesma forma são lidas como a mesma coisa. Se "quem somos", "serviços" e
"equipe" são todos grade de três colunas, o cérebro não lê três seções, lê **uma
seção repetida três vezes** — e para de prestar atenção, porque nada mudou. Por isso
a `Ritmo visual` do `00-anatomia.md` põe o número em 4: abaixo disso a página tem
conteúdo demais e estrutura de menos.

**Como se aplica aqui.** O wireframe em ASCII do passe 1 (`00-anatomia.md`) já obriga
a escrever a família de cada seção — e é ali que se conta quantas repetem. Alternar
fundo (claro, médio, claro, médio) ajuda o ritmo mas **não substitui** a família:
três grades iguais com fundos diferentes ainda são a mesma seção três vezes, só que
pintadas. A **qpsychology** (`referencias/README.md`) tem 6 serviços em grade de
cards e mesmo assim não cansa porque as outras seções fogem da grade: ela aparece
**uma vez**, onde grade é a forma certa.

**O antipadrão que previne.** "Três cards iguais lado a lado" e o "zigue-zague
infinito" do `90-antipadroes.md` (Layout): os dois são a mesma família repetida até
o olho desistir. A cura não é enfeitar cada repetição, é trocar o esqueleto de
metade delas.

---

## 2. Ritmo espacial: a unidade de 8

**Princípio.** Todo espaçamento da página — recuo, respiro entre seções, distância
entre título e corpo — sai de **múltiplos de uma base** (8px: 8, 16, 24, 32, 48,
64…), não de números escolhidos um a um no olho.

**Por que funciona.** O olho não mede pixel, mas detecta **sistema**. Quando os vãos
são todos múltiplos da mesma base, há uma relação constante entre eles e o cérebro
registra "isto foi decidido" — mesmo sem nomear a régua. Quando são aleatórios (13,
19, 27, 34), cada vão contradiz o vizinho e a página lê como **erro de montagem**,
ainda que cada espaço, sozinho, pareça ok. É o mesmo mecanismo da escala modular de
tipo (`10-tipografia.md` §1): relação fixa lê como intenção, valor solto lê como
ruído.

**Como se aplica aqui.** A base de 8 casa com o resto da casa: o piso de padding de
container do `90-antipadroes.md` ("mínimo 8px, ideal 12 a 16px") é a própria unidade
e dois passos dela. Antes de escrever um `padding` ou `gap`, perguntar de que degrau
da base ele é — se a resposta é "nenhum, achei que ficava bom", é chute. E o degrau
muda por seção, não por capricho: seção densa anda de 8 em 8, seção de respiro de 24
em 24.

**O antipadrão que previne.** O `cramped-padding` do detector na sua forma mais
sorrateira — o "recuo lateral zerado só num breakpoint" do `90-antipadroes.md`, onde
o desktop tinha `74px 24px` e o celular `52px 0`. Valor fora da base é justamente o
que escapa da conferência de olho e só o detector pega; ancorar na régua de 8 fecha
a porta antes.

---

## 3. Espaço em branco é estrutura, não vazio

**Princípio.** Whitespace não é o que sobra depois de posicionar o conteúdo: é o que
**agrupa e separa**, o que define o que pertence a quê. Aproximar dois elementos diz
"isto é um grupo"; afastá-los diz "isto é outra coisa". O respiro é informação.

**Por que funciona.** A percepção de "página apertada" quase nunca vem de conteúdo
demais — vem de **respiro de menos entre grupos**. Sem espaço para separar, o olho
não sabe onde um bloco termina e o próximo começa, lê tudo como uma massa e cansa,
por melhor que seja o texto. O vazio ao redor de um elemento é o que lhe dá
importância: título cercado de espaço pesa mais que título grudado no parágrafo
seguinte, sem mudar um pixel de fonte.

**Como se aplica aqui.** "Alternar fundo a cada seção resolve metade do problema de
ritmo sem custo nenhum" (`00-anatomia.md`): a faixa de fundo é whitespace com cor, um
jeito barato de declarar "aqui separa". A outra metade é o respiro **vertical** entre
seções e dentro delas, que a faixa não dá. E vale a economia da Chanel do
`00-anatomia.md`: tirar um card, um fio, uma borda quase sempre melhora, porque o que
sai vira respiro e o respiro reagrupa o que ficou.

**O antipadrão que previne.** "Texto colado na borda do container" e os fios em cima
e embaixo de cada linha de lista, do `90-antipadroes.md`: são tentativas de separar
com **traço** o que o espaço já separaria de graça. Fio e card são o respiro que
faltou desenhado à força — o "container preguiçoso" para onde a mão vai quando não se
decidiu a hierarquia.

---

## 4. As cinco alavancas da hierarquia visual

**Princípio.** A ordem de leitura de uma página se controla com cinco alavancas:
**tamanho, peso, cor, espaço e posição.** Cada degrau da hierarquia se faz movendo
**uma** delas — não todas de uma vez no mesmo elemento.

**Por que funciona.** Hierarquia é diferença perceptível: para um elemento se
destacar, ele precisa contrastar com o degrau vizinho em **um** eixo claro. Empilhar
maior + mais pesado + colorido + isolado + no topo, tudo junto, não soma destaque —
**achata**, porque some o degrau entre este elemento e o próximo, e sem degrau
intermediário o olho perde a escada. É o mesmo aviso do `10-tipografia.md` §5 aplicado
ao layout inteiro, não só ao tipo: cinco tratamentos somados no que era pra gritar só
embolam. Uma alavanca por degrau mantém a escada legível.

**Como se aplica aqui.** Espaço e posição são as alavancas de layout puro, e as mais
esquecidas — a mão vai primeiro pra tamanho e cor, que são as que se vê. Mas
posicionar um elemento sozinho no alto de uma faixa já o promove sem mudar fonte nem
cor. E a régua vale contra o excesso: quando um bloco "não destaca", a correção não é
somar a quinta alavanca, é **tirar** as que estão brigando e deixar uma.

**O antipadrão que previne.** O "hero de número grande com rótulo pequeno mais três
estatísticas de apoio e um acento colorido" e a "nuvem de pílulas com os
diferenciais", do `90-antipadroes.md`: os dois jogam todas as alavancas ao mesmo
tempo e nas oito pílulas de peso idêntico — muito tratamento, hierarquia zero. A
saída, lá e aqui, é escolher o que manda e recuar o resto.

---

## 5. Proximidade encaminha

**Princípio.** Elementos próximos são lidos como **relacionados**; distantes, como
separados. A distância entre duas coisas é uma afirmação sobre a relação entre elas —
e o olho acredita nela antes de ler o conteúdo.

**Por que funciona.** É a lei de Gestalt mais forte: a proximidade vence até a cor e a
forma na hora de agrupar. Por isso um ícone de 22px colado numa frase **não informa
nada** — a proximidade promete "este símbolo explica esta frase", a promessa não se
cumpre, e o que fica é ruído com cara de intenção. O vão entre rótulo e valor, entre
foto e legenda, entre pergunta e resposta do FAQ: cada um está dizendo se as duas
coisas são uma só ou duas.

**Como se aplica aqui.** É a razão de o bloco "para quem é" do `00-anatomia.md` pedir
**coluna única** em vez da grade de ícone + texto 2x3: na coluna, cada situação é uma
frase inteira que respira e encaminha (o "melhor ainda": cada situação vira link pro
serviço que a atende). A grade 2x3 aproxima ícone e frase prometendo uma relação que
o ícone de 22px não entrega. Antes de pôr dois elementos perto, conferir se a
proximidade está dizendo a verdade sobre eles.

**O antipadrão que previne.** "Grid de ícone pequeno + texto, 2x3 ou 3x1" e a "tira de
especificação repetindo fato já dito", do `90-antipadroes.md`: o primeiro agrupa por
proximidade coisas que não se explicam; o segundo aproxima quatro itens como se
fossem um reforço, quando três são reciclagem. Proximidade sem relação real é o
enchimento mais fácil de montar e o mais fácil de não ver.

---

## Os antipadrões que este princípio explica

| Antipadrão / regra do detector | A raiz teórica aqui |
|---|---|
| "Três cards iguais", "zigue-zague infinito" | §1 quatro famílias de layout |
| `00-anatomia.md` "Ritmo visual" (4 famílias) | §1 Gestalt: similaridade |
| `cramped-padding`, "recuo zerado só num breakpoint" | §2 unidade de 8 |
| "Texto colado na borda", fio em cada linha de lista | §3 respiro é estrutura |
| `00-anatomia.md` "alternar fundo resolve metade" | §3 whitespace com cor |
| "Hero de número grande + apoio", "nuvem de pílulas" | §4 cinco alavancas |
| `flat-type-hierarchy` (cross-link `10-tipografia.md` §5) | §4 uma alavanca por degrau |
| `icon-tile-stack` (grid 2x3), "tira de especificação" | §5 proximidade encaminha |
| `00-anatomia.md` bloco "para quem é" (coluna única) | §5 proximidade encaminha |
