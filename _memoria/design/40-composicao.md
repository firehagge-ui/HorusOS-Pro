# Composição: para onde o olho vai

> A camada de baixo do `90-antipadroes.md`. Lá está o *tell* ("muitos elementos,
> tudo com o mesmo peso"); aqui está o *porquê*, pra o Claude compor uma tela nova
> em vez de só reconhecer a bagunça depois de montá-la.
>
> **Isto é leitura de consulta, não de gatilho.** Não precisa ler antes de todo
> site. Abrir quando a decisão for de composição: decidir o que o olho encontra
> primeiro numa seção, resolver uma tela que "tem tudo mas não fisga", escolher o
> que corta. Cada seção segue o formato **princípio → por que funciona → como se
> aplica aqui → o antipadrão que previne.**

---

## 1. Um ponto focal por tela

**Princípio.** Cada seção — e a tela inteira do hero — tem **uma** coisa que o olho
encontra primeiro. Tudo o mais é subordinado a ela: recua, apoia, ou sai. É o
**elemento-assinatura** do `00-anatomia.md` visto de perto: onde a anatomia diz
"uma ousadia por página", a composição diz "um imã por tela".

**Por que funciona.** O olho não pousa em dois lugares ao mesmo tempo. Quando dois
elementos disputam a primeira fixação com o mesmo peso, ele hesita, e hesitação lê
como ruído mesmo que cada elemento, sozinho, esteja bonito. Um ponto focal claro dá
ao olho um lugar para entrar e, dali, um lugar para ir. É a diferença entre uma tela
que se lê e uma que se varre sem parar em nada.

**Como se aplica aqui.** Antes de codar a seção, apontar qual é o imã dela e garantir
que **só** ele tem o tratamento mais forte (maior, mais contraste, ou movimento). O
resto da tela fica quieto e disciplinado em volta — como no hero da Hórus, onde a arte
saiu e quem sustenta a cena é **um** objeto (o metal correndo no aro do botão), não
uma soma de brilhos. Vale a régua da Chanel do `00-anatomia.md`: antes de entregar a
tela, tirar um acessório. Se nada foi cortado, provavelmente nada foi escolhido como
foco.

**O antipadrão que previne.** A "nuvem de pílulas com os diferenciais" e os "cinco
elementos flutuantes" do Grão da Serra (03/08): oito chips ou cinco recortes, todos
com o mesmo peso, nenhum foco. A cura não é enfeitar cada item, é decidir **qual**
manda e rebaixar o resto.

---

## 2. Entrada e percurso do olho

**Princípio.** O olho entra pelo **maior contraste** da tela — de tamanho, de cor, de
movimento — não pelo primeiro elemento do HTML nem pelo canto superior esquerdo por
decreto. Composição é decidir onde ele entra e desenhar o caminho do que ele vê depois.

**Por que funciona.** A atenção é puxada por diferença, não por posição. Um h1 gigante
sobre corpo pequeno vence a leitura antes de qualquer regra de leitura ocidental; um
acento saturado num campo neutro fisga antes do texto ao lado; uma coisa que se move
vence tudo que está parado. Por isso "padrão F" e "padrão Z" são **descrição**, não
receita: o olho só varre em F quando nada na tela cria um contraste que o desvie — e
o trabalho do designer é justamente criar esse desvio de propósito. Depois da entrada,
cada degrau de contraste (título → subtítulo → CTA) é uma parada na trilha; a hierarquia
tipográfica do `10-tipografia.md` é essa trilha em texto.

**Como se aplica aqui.** Perguntar, para cada tela: qual é a primeira fixação, e para
onde ela manda o olho em seguida? A trinca de números das dez agências de IA
(`referencias/agencias-ia-dez-sites.md`) funciona porque entra depois do título, como
segunda parada, não competindo com ele. Se dois elementos empatam em contraste, um dos
dois tem de ceder — senão não há percurso, há empate.

**O antipadrão que previne.** O "hero de número grande com rótulo pequeno mais três
estatísticas" montado como reflexo (`90-antipadroes.md`, Layout): quando o número não
é o foco real do cliente, ele rouba a entrada e o olho começa o percurso no lugar
errado. E o "cabeçalho partido" (título à esquerda, parágrafo solto no canto direito):
dois pontos de entrada, nenhum caminho entre eles.

---

## 3. Tensão e assimetria

**Princípio.** O layout centrado e simétrico é o mais **seguro** e o mais
**esquecível**. Assimetria deliberada — peso maior de um lado, equilibrado por algo
menor e mais forte do outro — cria tensão, e tensão é o que faz a tela parecer
composta em vez de preenchida. Quebrar a simetria é uma decisão, não um acidente.

**Por que funciona.** Simetria perfeita distribui o peso por igual e o olho não tem
motivo para preferir um ponto — repousa no centro e a tela "acaba" ali. A assimetria
força um desequilíbrio que o olho quer resolver, e resolver é engajar: ele vai do
elemento pesado para o contrapeso e de volta. É por isso que uma arte 3D grande
deslocada para um lado, equilibrada por um bloco de texto e uma trinca de números do
outro, prende mais que a mesma arte centralizada com texto embaixo.

**Como se aplica aqui.** As dez agências de IA (`referencias/agencias-ia-dez-sites.md`)
compõem assim de propósito: quase-preto, um acento saturado, arte 3D grande num lado,
trinca de números como contrapeso — o denominador comum não é a simetria, é o
desequilíbrio controlado. Não significa "torto por moda": significa dar a cada tela um
lado dominante e um contrapeso menor que segura a balança. Quando a marca do cliente
pede sobriedade, a assimetria vem sutil (uma coluna 1.4fr contra 1fr, como no hero da
Hórus resolvido em 04/08), não em diagonal gritante.

**O antipadrão que previne.** A tela centrada-e-simétrica que passa em todos os
checklists e não gruda em ninguém — a mesma "seção só repetida três vezes" que o
`00-anatomia.md` combate com as 4 famílias de layout. Simétrico demais é o primo
quieto do genérico.

---

## 4. O second read

**Princípio.** A tela boa entrega em **duas camadas**: a primeira passada dá a mensagem,
e a segunda revela uma recompensa que não estava na cara — um detalhe, uma relação entre
elementos, uma continuidade que só aparece quando o olho volta. Esse segundo achado é o
que faz a peça grudar depois de fechada.

**Por que funciona.** Atenção que só recebe o que esperava não forma memória. Uma
recompensa na segunda passada dá ao cérebro um motivo para reprocessar a tela, e o que
é reprocessado é o que fica. Mas a recompensa precisa ser **uma**, concentrada: o
`00-anatomia.md` avisa que o inimigo é "a página com cinco boas ideias e nenhuma que
gruda". Cinco recompensas dispersas se cancelam — a segunda passada não encontra um
prêmio, encontra um empate. Assinatura concentrada gruda; dispersão evapora.

**Como se aplica aqui.** Depois que a tela cumpre o trabalho da seção, perguntar: o que
recompensa quem olha de novo? Pode ser o metal que só corre no aro do botão da Hórus, o
rótulo de pacote que carrega os diferenciais do Grão da Serra no objeto real, a palavra
que gira no título feita direito (recorte e deslize, não opacidade). Uma por página, e
tudo o mais ao redor quieto para que ela seja notada na volta.

**O antipadrão que previne.** A tela que despeja "cinco boas ideias" na primeira passada
e não deixa nada para a segunda — dispersão travestida de riqueza. E o "elemento
decorativo repetido em escalas diferentes" do Grão da Serra (03/08): o mesmo recorte
cinco vezes não é um second read, é papel de parede; o olho reconhece o desenho repetido
e para de procurar.

---

## 5. Foco por subtração

**Princípio.** Uma tela fica forte **tirando**, não somando. Quando algo compete com o
ponto focal, a primeira pergunta não é "como destaco mais o foco", é "o que aqui pode
recuar ou sair". Subtrair é mais barato e mais eficaz que reforçar.

**Por que funciona.** Contraste é relativo: o foco não fica mais forte quando você o
aumenta, fica mais forte quando o que está em volta enfraquece. Somar destaque a tudo
achata tudo — é o mesmo erro do `10-tipografia.md` §5, onde tamanho + peso + caixa + cor
todos juntos no mesmo elemento não gritam, embolam. Tela cheia não tem hierarquia porque
não sobrou fundo contra o qual a figura apareça.

**Como se aplica aqui.** É a régua da Chanel aplicada à composição inteira: no Grão da
Serra, cinco elementos flutuantes viraram três (um de cada), oito chips viraram um rótulo
de pacote, e a "tira de especificação" que repetia fatos já ditos foi **removida sem
substituto** — as seções seguintes já continuavam a narrativa. Nenhuma dessas correções
adicionou nada; todas cortaram. Antes de somar um elemento para "preencher" um vão, checar
se o vão é o respiro que faz o foco aparecer.

**O antipadrão que previne.** O reflexo de preencher: a "tira de especificação" e o
"fundo listrado ou quadriculado por cima de nada" do `90-antipadroes.md` — textura e
enchimento que entram porque o espaço parecia vazio, e roubam o foco em troca de nada.
Vazio ao lado do foco não é falha, é o que o deixa ser foco.

---

## Os antipadrões que este princípio explica

| Antipadrão / regra do detector | A raiz teórica aqui |
|---|---|
| Nuvem de pílulas, cinco elementos flutuantes (Grão da Serra) | §1 um ponto focal por tela |
| Hero de número grande sem ser o foco real; cabeçalho partido | §2 entrada e percurso do olho |
| Tela centrada-e-simétrica esquecível; "seção repetida 3x" (`00-anatomia.md`) | §3 tensão e assimetria |
| Elemento decorativo repetido em escalas; "cinco boas ideias, nenhuma que gruda" (`00-anatomia.md`) | §4 second read |
| Tira de especificação recicladora, fundo listrado sobre nada | §5 foco por subtração |
| Elemento-assinatura e a régua da Chanel (`00-anatomia.md`) | §1 e §5, a mesma disciplina vista como composição |
