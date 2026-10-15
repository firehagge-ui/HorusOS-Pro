# Teardown: Stanzza, o propósito de cada seção (estúdio de interiores, Barcelona)

- **URL:** https://stanzza.design/awards (a versão inscrita no Awwwards) e https://stanzza.design/ (a home comercial,
  que é a mesma página com outra capa)
- **Segmento:** design de interiores residencial (e alguns cafés comerciais em Riad) com gestão de obra de ponta a
  ponta. Estúdio pequeno, com o rosto do fundador, Kirill. Vende projeto **e** gestão completa da reforma: concepção,
  documentação técnica, orçamento por concorrência entre empreiteiros, acompanhamento de obra e compras.
- **Estudado em:** 15/10/2026, com o Playwright: home completa a 1440x900 até o rodapé (39 telas) e a 390x844 até o
  rodapé, com o menu do celular aberto; `/awards` a 1440, comparada texto a texto com a home; `/projects` e a página
  2; a página de projeto `/projects/pau-claris-apartment-main` inteira; `/blog` e um artigo; os dois modais de
  conversão (REQUEST A CALL e START A PROJECT); o FAQ com uma resposta aberta e as 14 respostas extraídas do código;
  hover numa miniatura da seção Composição; carrossel da home avançado de 01/05 para 02/05. `/about`, `/contact`,
  `/studio` e `/approach` dão 404: Sobre, Abordagem e Contato são âncoras da home.
- **Nota:** 8/10 como estrutura comercial de estúdio pequeno. Cada seção da home responde a uma pergunta de quem vai
  reformar, e o FAQ guarda a informação que o segmento costuma esconder. Perde por descuido de execução: rótulo de
  seção reaproveitado, número sem lastro visível, foto de terceiros com marca d'água e uma agenda sem identidade
  justamente no momento da conversão.
- **Contexto:** estudado a pedido do Marcelo para o site da Débora Reis (`clientes/_prototipos/debora-reis/`), um dos
  três sites que ele mandou (com normalisboring.es e tecnoarreda.it). É o segundo estudo da Stanzza: o de 13/10
  (`arquitetura-awwwards-2026-10.md`, "Stanzza em detalhe") mediu o sistema visual; este olha **para que serve cada
  seção, que informação ela carrega e como as imagens entram**. Entra como referência de estrutura comercial, não só
  de galeria.

**Em resumo:** o trabalho principal do site não é mostrar foto bonita, é convencer de que a reforma vai ser
controlada: prazo, custo e um responsável só. Fala com quem comprou um apartamento e tem medo da obra, inclusive quem
mora em outro país (o FAQ cita documentação em russo e espanhol e um painel no Notion para acompanhar à distância). A
home é uma sequência de respostas na ordem em que o cliente pergunta: o que vocês fazem, como pensam, se já fizeram
(com ficha), se vai dar dor de cabeça, o que eu compro, quem são vocês, quanto custa e quanto demora, e como começo. A
página `/awards` é a mesma home com outra capa (a definição de dicionário de "stanza") e não lista prêmio nenhum.

---

## Estrutura, na ordem

### A lógica da home, em uma tabela

Cada seção existe para tirar uma dúvida. Lida assim, a home vira uma régua: seção que não responde a nenhuma pergunta
pode sair.

| Ordem | Seção | A pergunta que ela responde |
|---|---|---|
| 0-1 | Abertura e capa | O que vocês fazem, e para quem? |
| 2 | Composição (manifesto) | Como vocês pensam uma casa? |
| 3 | Projetos em destaque, com ficha | Vocês já fizeram isso? Em quanto tempo? |
| 4 | Compromissos | Vai dar dor de cabeça? Quem responde se der errado? |
| 5 | Os três serviços | O que exatamente eu estou comprando? |
| 6 | Sobre em números | Vocês têm estrada? |
| 7 | Clientes (logos) | Quem mais confiou em vocês? |
| 8 | Blog | Vocês conhecem o assunto e a cidade? |
| 9 | Fundador | Com quem eu vou falar? |
| 10 | Perguntas | Quanto custa, quanto demora, quem faz a obra, e se estourar? |
| 11-12 | Contato final e rodapé | Como eu começo? |

### Home

**0. Abertura (preloader).**

- **Mostra:** fundo creme, o logo STANZZA no topo com a linha manuscrita "Architecture × Design × Delivery" e a foto
  da capa pequena, emoldurada no centro, que depois cresce até virar a capa.
- **Para quê:** carimbar a marca e os três serviços antes de qualquer conteúdo, e apresentar a foto como um quadro que
  vira ambiente. Ocupa o segundo de carregamento sem tela branca.
- **Como é montada:** tela única e centralizada; a moldura (cerca de 600x400) se expande até a tela cheia.
- **Imagem:** uma foto só, emoldurada e sem legenda, que se transforma na capa.

**1. Capa (hero).**

- **Mostra:** foto de ponta a ponta do apartamento Pau Claris: uma mulher desfocada abrindo a porta da sacada, parede
  de tijolo, poltrona laranja. Manuscrito "Architecture × Design × Delivery", título "Composed residential interiors"
  e a frase "Interiors designed as one complete whole." No topo, só três elementos: MENU (pílula translúcida à
  esquerda), logo no centro, REQUEST A CALL (com borda, à direita). No celular, uma barra fixa embaixo com REQUEST A
  CALL.
- **Para quê:** em três linhas dizer o que vendem (os três serviços no manuscrito), para quem (residencial) e como (um
  todo coerente, do conceito à entrega), e deixar a ação no topo. A pessoa em movimento diz "casa vivida", não
  showroom.
- **Como é montada:** três níveis de texto centralizados no terço de baixo, sobre um véu escuro.
- **Imagem:** sangrada, com véu escuro para o texto branco, sem legenda; gente desfocada em movimento.
- **Copy:** *"Architecture × Design × Delivery / Composed residential interiors / Interiors designed as one complete
  whole."*

**2. Composição, o manifesto (`[ COMPOSED ]` A home is a composition.).**

- **Mostra:** título pequeno no centro e cinco miniaturas dos cinco projetos espalhadas sobre uma grade de três
  colunas com fio fino visível. Dois parágrafos curtos nas bordas: a filosofia (*"Proportion sets the structure,
  material sets the tone, and light shapes the space"*) e o método (*"We begin with how the home should work, refine
  how it should feel, and guide every decision through the build"*).
- **Para quê:** passar da emoção ao argumento. Mostra a amplitude do portfólio como uma folha de contatos, sem pedir
  leitura, e o próprio layout ilustra a palavra "composição". É o destino da âncora "About" do menu: **o "sobre" da
  Stanzza é a filosofia, não a biografia.**
- **Como é montada:** a seção fica presa enquanto as miniaturas (130 a 300px) sobem em velocidades diferentes e passam
  por cima e por baixo do título. No celular vira uma fileira horizontal de fotos abaixo do texto.
- **Imagem:** miniaturas sem legenda. Só o hover revela o nome do projeto em serifa grande, as tags "PROPORTION ×
  NATURAL LIGHT" e "VIEW". Cada miniatura é link para o projeto. As fotos se sobrepõem ao texto de propósito.

**3. Projetos em destaque (carrossel com ficha).**

- **Mostra:** bloco verde-oliva. A foto do projeto começa enquadrada no meio, com o nome à esquerda e a ficha à direita
  ("PROJECT EXECUTED In 62 days", "AREA 150 m²", "CITY & COUNTRY Barcelona, Spain"), e cresce com a rolagem até
  tomar a tela. Vira um slide "01/05" com linha de progresso, setas e dois botões: VIEW PROJECT (escuro) e VIEW ALL
  PROJECTS (branco).
- **Para quê:** transformar a foto em prova de entrega com número. **A ficha abre pelo prazo de execução**, que é o
  medo de quem vai reformar, e só depois dá área e cidade. Conversa com o "Delivery" da capa.
- **Como é montada:** cena presa à rolagem na entrada (a foto cresce da moldura até a tela) e depois um carrossel com
  setas; cinco projetos (2 apartamentos e 3 cafés em Riad). As setas são quadrados de fio fino sobre a foto, quase
  invisíveis.
- **Imagem:** uma foto por projeto, de ponta a ponta, com véu escuro; texto e ficha por cima, sem descrição do
  ambiente.

**4. Compromissos (Controlled delivery. Calm by design.).**

- **Mostra:** à esquerda, a frase *"You always know what's happening, when, and what it costs. That's how we protect
  your budget, timing, and peace of mind."*; à direita, o título. Abaixo, quatro linhas separadas por fio: `[01]` One
  responsible lead, `[02]` Structured process, `[03]` Changes and costs — always visible, `[04]` Quality on site, cada
  uma com uma ou duas linhas.
- **Para quê:** responder ao medo da obra (atraso, custo que estoura, quem responde) com promessas operacionais
  verificáveis, não com adjetivo. É o "vender o freio" do `00-anatomia.md`: a objeção vira o argumento. No item 01 a
  foto é o retrato do fundador, e "um responsável" ganha rosto.
- **Como é montada:** grade de duas colunas, com a foto em preto e branco (cerca de 454px) presa à esquerda e o texto
  numerado à direita. No celular, foto em cima e texto embaixo, com um REQUEST A CALL logo depois da frase.
- **Imagem:** preto e branco, só de trabalho acontecendo (retrato, gente desenhando num quadro, mão sobre a planta,
  visita de obra de capacete), nunca do ambiente pronto. A cor fica para o resultado e o P&B para o processo. Algumas
  parecem banco de imagem (*aparente*, não verificado).
- **Copy:** *"Changes and costs — always visible: Every revision is documented, priced, and agreed before execution. No
  surprises on the invoice."*

**5. Os três serviços (Architectural thinking. Design sensibility. Premium delivery.).**

- **Mostra:** tela azul-marinho em degradê, croquis de linha branca feitos à mão nos cantos, título que acende palavra
  por palavra. Depois, três cartões que deslizam na horizontal: `[01]` Architecture (axonometria em linha de um
  apartamento; *"Planning, circulation, engineering logic. The invisible layer that makes daily life effortless."*),
  `[02]` Design (cartão escuro com cinco miniaturas em xadrez; *"Material, light, proportion, restraint."*), `[03]`
  Delivery (foto de duas pessoas sobre plantas; *"Coordination, timing, detailing through handover."*).
- **Para quê:** é a seção de serviços disfarçada. Explica o que o cliente compra repetindo os três termos do manuscrito
  da capa, o que amarra o começo da página a este ponto. Cada serviço usa um tipo de imagem diferente (desenho técnico
  para arquitetura, foto do resultado para design, gente trabalhando para entrega): **o tipo de imagem já explica o
  serviço.**
- **Como é montada:** a mudança forte de cor marca um capítulo novo; rolagem horizontal presa com três cartões de borda
  recortada. O rótulo `[ IN YEARS ]` sobre o título não tem relação com o conteúdo (erro de cópia).
- **Imagem:** desenho de linha sobre fundo escuro, axonometria, xadrez de miniaturas e foto; nada com legenda.

**6. Sobre em números (About us.).**

- **Mostra:** quatro cartões: Years in Spain 10, Years in practice 20, Projects in Spain 38, Projects worldwide 182.
  Depois, os dois parágrafos da seção Composição repetidos e o botão VIEW PROJECTS.
- **Para quê:** credencial rápida em número, com cada número traduzido por uma imagem: Sagrada Família para "Espanha",
  mão desenhando no caderno para "anos de prática", duas pessoas num quadro de amostras para "projetos", mapa-múndi
  para "mundo".
- **Como é montada:** a seção fica presa e os cartões acendem um por vez com a rolagem, com a foto aparecendo atrás do
  número. Números em serifa itálica de cerca de 120px. No celular viram fileira horizontal.
- **Imagem:** foto atrás do número, com véu, revelada em sequência; apagada quando o cartão não está ativo.

**7. Clientes (Trusted by / Built together with.).**

- **Mostra:** faixa de logos em cinza que corre na horizontal (MediaMarkt, Dose, Kaldi, Baron, Filou, Jazean e outros).
- **Para quê:** prova social de marcas comerciais que contrataram. Autoridade emprestada.
- **Como é montada:** rótulo e título à esquerda, faixa contínua de largura total.
- **Imagem:** logos monocromáticos, sem link.

**8. Blog (From the studio).**

- **Mostra:** três artigos sobre lugares de Barcelona (a confeitaria L'Atelier, o Pavilhão de Barcelona, a Cotton
  House) e o botão ALL JOURNAL.
- **Para quê:** voz própria e SEO local. Mostra que conhecem a cidade e o repertório de arquitetura. Não fala dos
  projetos deles.
- **Como é montada:** grade assimétrica: uma foto quadrada pequena à esquerda, uma grande à direita, uma abaixo; título
  e "VIEW ALL ARTICLE" embaixo de cada uma.
- **Imagem:** fotos de terceiros. A do Pavilhão tem a marca d'água "© barcelona-tourist-guide.com" visível.

**9. Fundador (Kirill).**

- **Mostra:** três painéis lado a lado: retrato em preto e branco; a frase manuscrita *"Good design feels inevitable.
  Nothing extra, nothing missing"* com nome e CEO & FOUNDER; cartão preto com uma frase de bio (*"Kirill works like an
  architect inside the interior..."*), EMAIL, LOCATION, REQUEST A CALL e ícones de Instagram, LinkedIn e Behance.
- **Para quê:** num estúdio pequeno a pessoa é o produto. O rosto e um canal direto ficam logo antes do FAQ e do
  contato, e o pedido vira pessoal.
- **Como é montada:** uma linha de três blocos de mesma altura; o cartão escuro concentra os dados de contato.
- **Imagem:** retrato P&B real do fundador, sem legenda além do nome.

**10. Perguntas (Questions clients often ask).**

- **Mostra:** 14 perguntas em sanfona (6 visíveis e SHOW MORE). As respostas são longas e concretas: blocos de serviço
  contratáveis separados; a lista do que se entrega (conceito, 3D, documentação técnica completa); os fatores que
  formam o preço (sem número); orçamento por concorrência entre empreiteiros licenciados; o que acontece se o custo
  estourar; etapas Design, Budgeting, Implementation; prazos médios (projeto de 1 a 4 meses, obra de 6 a 12);
  acompanhamento com 1 a 2 visitas por semana; revisões (fase aprovada é final, mudança depois se cobra por hora);
  garantias de 1, 3 e 10 anos do empreiteiro; licença de obra; compras com 10 a 20% de desconto; atendimento remoto
  pelo Notion.
- **Para quê:** **é onde mora a informação comercial de verdade.** Tira as objeções antes da ligação e qualifica o lead:
  quem lê já sabe que a obra é de empreiteiro e que mudança custa. Fica escondido em sanfona para não pesar a página.
- **Como é montada:** coluna central de cerca de 1150px, perguntas em serifa de 32px com fio entre elas, resposta em
  grotesca cinza com parágrafos curtos.
- **Imagem:** nenhuma.
- **Copy:** *"What happens if the final cost of works exceeds the estimate?"* / *"Do you purchase materials and
  furniture, or is that my responsibility?"*

**11. Contato final (Start with a conversation.).**

- **Mostra:** `[ GET IN TOUCH ]`, o título, *"Share a few details about your project and we'll come back with a clear
  plan."* e o botão START A PROJECT, que abre o modal "Project inquiry".
- **Para quê:** um pedido pequeno e concreto, com a promessa de um plano claro em troca de poucos detalhes.
- **Como é montada:** centralizado, sobre um fundo de faixas verticais desfocadas. Não vi o croqui de casa que o estudo
  de 13/10 registrou nesse ponto.
- **Imagem:** fundo abstrato desfocado.

**12. Rodapé.**

- **Mostra:** navegação (About, Projects, Approach, Blog, Contacts), logo e ©, redes (LinkedIn, Instagram, Behance,
  Facebook), "Call us +34 654 496 780", BACK TO TOP, Privacy, Terms e Cookies. O endereço (Carrer Ausias Marc 13, com
  link do Google Maps) só aparece no menu do celular.
- **Para quê:** canal alternativo (telefone) e saída para quem chegou ao fim sem decidir.
- **Como é montado:** três colunas (navegação, marca, redes) e uma linha de base.

### `/awards` (página especial)

**13. A mesma home com a capa trocada.**

- **Mostra:** a mesma home, seção por seção (o texto inteiro foi comparado). Muda só a capa: outra foto (sala com
  lustre de bolhas e sofá curvo) e o título *"A group of lines forming a unit within a poem."*, que é a definição de
  dicionário de "stanza". Não lista prêmio, júri nem imprensa, e não tem link no menu.
- **Para quê:** é a versão inscrita no Awwwards. A capa fala do conceito do nome para o júri, enquanto a home comercial
  continua dizendo o que vendem ("Composed residential interiors"). **Separa a peça de conceito da peça de venda sem
  mexer na home.**
- **Como é montada:** endereço separado, mesmo conteúdo, capa trocada, mesmo tratamento de foto.

### `/projects` (lista)

**14. Uma linha por projeto, com ficha e carrossel.**

- **Mostra:** "← HOME", título "Projects" com o contador "+5" e uma linha por projeto, do mais novo ao mais antigo. À
  esquerda: data ("22 January 2025"), nome, ficha (Project executed, Area, Project location) e VIEW DETAILS. À
  direita: carrossel de três fotos verticais com linha de progresso e setas. A paginação leva à página 2, com a
  "Maastricht villa".
- **Para quê:** catálogo para comparar projetos pela ficha sem abrir cada um; cada linha já é uma prévia completa.
- **Como é montada:** duas colunas meio a meio, fio entre as linhas, contato e rodapé no fim.
- **Imagem:** três fotos verticais por linha, sem legenda, em carrossel horizontal. As dos cafés de Riad parecem
  renders 3D (*aparente*).

### Página de projeto (`/projects/pau-claris-apartment-main`, cerca de 12.500px)

**15. Ficha e caso: cliente, objetivo, solução.**

- **Mostra:** "← PROJECTS", o nome grande, a ficha em linha (CITY, COUNTRY, AREA, PROJECT EXECUTED) e o ano grande
  "'25" ao lado de uma foto vertical. À esquerda, três blocos: CLIENT (casal com filhos criados e netos chegando,
  apartamento no Eixample, num prédio da virada do século XIX para o XX), OBJECTIVE (reforma parcial e profunda sem
  mexer na planta, preservando o que é autêntico), SOLUTION (o que foi mantido, o tijolo revelado, a camada de
  mobiliário italiano, a luz no ritmo do dia da família). Botão NEXT CASE.
- **Para quê:** transformar o projeto em problema resolvido: quem era o cliente, o que ele precisava, o que foi
  decidido. **O visitante se reconhece no cliente**, e é aqui que o site faz o trabalho do bloco "para quem é" do
  `00-anatomia.md`.
- **Como é montada:** duas colunas, texto à esquerda e foto alta à direita, presa enquanto o texto passa.
- **Imagem:** uma foto vertical grande, sem legenda.

**16. Planta e capítulos.**

- **Mostra:** foto sangrada do escritório; planta humanizada em traço marrom com o mobiliário; cinco capítulos com
  rótulo pequeno e texto grande que acende palavra por palavra (Heritage, Authencity, Furniture, Light, Home),
  alternados com arranjos de foto: faixa de quatro verticais, texto com foto ao lado, galeria horizontal presa (três
  fotos altas que deslizam), coluna estreita de detalhes (cadeiras, textura da obra de arte). Fecha com *"The interior
  has not turned into a design museum — it is a calm, lived-in mature house..."* e depois "More projects." com três
  cartões.
- **Para quê:** a planta prova o trabalho de arquitetura, que foto nenhuma mostra. Cada capítulo explica o porquê de um
  grupo de fotos (o que foi preservado, o que entrou, a luz), então a imagem ganha razão sem legenda foto a foto. O
  fim "casa vivida" amarra com a capa.
- **Como é montada:** ritmo alternado de largura e de velocidade: sangrada, planta, faixa, meio a meio, horizontal
  presa, coluna estreita.
- **Imagem:** aqui a imagem tem contexto, mas por capítulo e não por foto; o detalhe vai em coluna estreita contra o
  papel vazio.

### Blog (lista e artigo)

**17. "Blog." e o artigo do Pavilhão de Barcelona.**

- **Mostra:** "Blog." com o contador "+16" (a lista mostrou 3). O artigo tem título, linha fina, autor (foto do
  Kirill, CEO & FOUNDER), data, tempo de leitura, botões de compartilhar e texto em seções numeradas.
- **Para quê:** autoridade de repertório e tráfego do Google por temas de Barcelona. O autor é o fundador, o que
  reforça a pessoa.
- **Como é montado:** título à esquerda, linha fina e autor à direita, foto de largura total, texto numerado.
- **Imagem:** foto de terceiros com marca d'água.

### Modais de conversão

**18. REQUEST A CALL e START A PROJECT.**

- **Mostra:** REQUEST A CALL abre uma agenda do HubSpot ("Meet with Kirill 1", calendário de outubro com dias livres e a
  faixa "Create your free meeting booking page"). START A PROJECT abre "Project inquiry": foto de projeto à esquerda e,
  à direita, Name*, Email*, Message, caixa de privacidade e SUBMIT.
- **Para quê:** dois níveis de compromisso: marcar uma ligação direto na agenda do fundador, sem troca de mensagens, ou
  mandar uma mensagem.
- **Como é montado:** modal centralizado sobre a página escurecida.
- **Imagem:** foto de projeto real só no formulário. A agenda tem a aparência padrão do HubSpot e quebra a identidade.

### Comparando com `_memoria/design/00-anatomia.md`

- **Hero:** responde o que é ("Composed residential interiors"), para quem (residencial) e o que fazer (REQUEST A CALL
  no topo, fixo no celular). Falta a prova imediata ao lado da promessa: os números só aparecem na seção 6.
- **Para quem é:** não há seção em segunda pessoa na home. O site faz esse trabalho por dois outros caminhos: a frase
  dos compromissos (*"You always know what's happening..."*), que fala direto com o medo, e o bloco CLIENT da página de
  projeto, onde o visitante se reconhece num caso.
- **O que fazemos:** seção 5 (três serviços, uma linha cada) e, no FAQ, os blocos contratáveis separados.
- **Como começa:** não existe na home como passos. As etapas (Design, Budgeting, Implementation) ficam no FAQ, e o
  contato promete "a clear plan" sem dizer o que acontece depois do envio.
- **Quem faz:** retrato real, nome, cargo, uma frase e uma linha de bio. Faltam formação e registro.
- **Como é / onde é:** endereço só no menu do celular, sem mapa na página.
- **FAQ:** 14 perguntas, incluindo as constrangedoras que a anatomia pede (o que acontece se o custo estourar, revisão
  paga, garantia). É acima dos 8 a 10 que a anatomia considera normal em serviço.
- **Encenar a prova:** ficha com prazo de execução e planta humanizada no caso.
- **Vender o freio:** a seção de compromissos inteira.

**A diferença de fundo:** a anatomia organiza a home pelo problema da pessoa; a Stanzza organiza pelas **objeções**, na
ordem em que aparecem. O problema ("tenho medo da obra") não ganha uma seção própria: ele é a linha que costura capa,
ficha, compromissos e FAQ.

---

## Como as imagens aparecem

O Marcelo perguntou sobre sites em que as imagens aparecem umas sobre as outras sem dizer o que há nelas. Na Stanzza
**a legenda não some: ela é adiada.** Na home, a foto entra sem texto e o nome do projeto aparece só no hover; o
contexto completo fica na página do projeto, contado por capítulo. E cada tipo de imagem tem uma função fixa: cor para
o resultado, preto e branco para o processo, desenho de linha para o pensamento, planta para a arquitetura. Os padrões,
na ordem em que valem mais para o pedido:

### Miniaturas flutuantes sem legenda, sobrepostas ao título (o "uma imagem por cima da outra")

- **Onde:** seção Composição da home (2).
- **Como funciona:** cinco fotos pequenas de projetos diferentes, espalhadas sobre a grade, cada uma subindo numa
  velocidade e passando por cima e por baixo do título. O nome do projeto só aparece no hover, e cada foto é link para
  o caso.
- **Efeito:** mostra volume e variedade sem pedir leitura e funciona como índice. A sobreposição ilustra a ideia de
  composição. No celular perde o hover e vira fileira horizontal.

### Moldura que vira tela

- **Onde:** abertura (0) e entrada do projeto em destaque (3).
- **Como funciona:** a foto aparece pequena, emoldurada no centro do papel, e cresce com o carregamento ou a rolagem
  até ocupar a tela.
- **Efeito:** o visitante "entra" no ambiente: a foto deixa de ser figura de catálogo e vira espaço.

### Gente desfocada em movimento

- **Onde:** capa (1), carrossel (Valencia), página do projeto (homem indo para a sacada, mulher na cozinha).
- **Como funciona:** exposição longa: a pessoa sai borrada e o ambiente nítido.
- **Efeito:** diz "casa vivida" sem mostrar rosto de cliente. O protagonista continua sendo o espaço.

### P&B para processo, cor para resultado

- **Onde:** compromissos (4) e cartões de números (6).
- **Como funciona:** fotos de trabalho (desenhar, planta, obra, retrato) em preto e branco ao lado do texto; os
  ambientes prontos sempre em cor.
- **Efeito:** sem legenda nenhuma, o visitante separa "como trabalham" de "o que entregam".

### Tipo de imagem como explicação do serviço

- **Onde:** cartões Architecture, Design e Delivery (5).
- **Como funciona:** axonometria em linha para arquitetura, xadrez de miniaturas para design, foto de pessoas sobre
  plantas para entrega.
- **Efeito:** cada serviço é entendido pela imagem antes do texto curto.

### Croqui de linha sobre fundo escuro

- **Onde:** abertura da seção de serviços (5).
- **Como funciona:** desenhos à mão, brancos, nos cantos de uma tela azul-marinho, com o título acendendo palavra por
  palavra.
- **Efeito:** muda de capítulo e mostra o pensamento antes do produto.

### Número que acende com foto

- **Onde:** About us (6).
- **Como funciona:** quatro cartões presos; com a rolagem, um de cada vez ganha a foto atrás do número e os outros
  ficam apagados.
- **Efeito:** obriga a ler um número por vez e dá uma imagem que o explica.

### Planta humanizada como prova

- **Onde:** página do projeto (16).
- **Como funciona:** planta baixa com mobiliário em traço de cor terra, de largura média, entre a foto sangrada e os
  capítulos.
- **Efeito:** prova o trabalho de arquitetura (layout, circulação) que a foto do ambiente não mostra.

### Ritmo alternado na galeria do caso

- **Onde:** página do projeto (16).
- **Como funciona:** sangrada, planta, faixa de quatro verticais, texto com foto, galeria horizontal presa, coluna
  estreita de detalhe; cada bloco antecedido por um capítulo de texto grande.
- **Efeito:** evita a galeria em grade monótona. O capítulo dá contexto a um grupo de fotos sem legenda foto a foto.

### Carrossel horizontal dentro da linha

- **Onde:** `/projects` (14).
- **Como funciona:** três fotos verticais por projeto que deslizam com setas e linha de progresso, ao lado da ficha
  fixa.
- **Efeito:** prévia rica sem abrir a página. As setas e o progresso avisam que há mais fotos.

### Observação de integridade

- **Renders sem aviso:** as fotos dos cafés de Riad parecem renders 3D (*aparente*, não confirmado), e o site não
  diferencia render de obra executada.
- **Banco de imagem no processo:** algumas fotos P&B dos compromissos parecem banco de imagem (*aparente*). É
  justamente a seção que promete "um responsável", e foto genérica ali enfraquece a promessa.
- **Foto de terceiros com marca d'água** no blog (barcelona-tourist-guide.com). Problema de integridade e de direito
  autoral.

---

## Informação: o que tem e o que falta

**Tem:**

- Serviços: arquitetura de interiores, design, entrega e gestão; no FAQ, blocos contratáveis separados (projeto de
  interiores, projeto de engenharia, orçamento, acompanhamento de obra, gestão do projeto, compras).
- Segmento declarado: interiores residenciais (mas 3 dos 5 projetos são cafés em Riad).
- Local: Barcelona; endereço Carrer Ausias Marc 13, com link do Google Maps (só no menu do celular).
- Fundador: Kirill, CEO & founder, com retrato, frase, uma linha de bio, e-mail e LinkedIn.
- Números: 10 anos na Espanha, 20 de prática, 38 projetos na Espanha, 182 no mundo.
- Compromissos operacionais: um responsável, etapas com aprovação, mudanças e custos documentados, acompanhamento de
  obra.
- Etapas do trabalho (Design, Budgeting, Implementation), no FAQ.
- Prazos médios: projeto de 1 a 4 meses, obra de 6 a 12 meses; e o prazo de execução de cada projeto na ficha (de 32 a
  82 dias).
- Ficha de projeto: prazo, área, cidade, país, ano e data.
- Estudo de caso: cliente, objetivo, solução, planta humanizada e capítulos com o porquê.
- Preço: sem número, mas com os fatores que o formam.
- Como o orçamento da obra é feito (concorrência entre empreiteiros licenciados) e o que acontece se estourar.
- Política de revisões (fase aprovada é final; mudança depois se cobra por hora).
- Garantias de 1, 3 e 10 anos (do empreiteiro) e o que é responsabilidade do estúdio.
- Licença de obra feita por eles.
- Compras com 10 a 20% de desconto e logística inclusa.
- Atendimento remoto: painel no Notion, documentação em russo e espanhol.
- Logos de clientes comerciais.
- Blog com autoria do fundador (contador de 16 artigos).
- Contato: telefone, e-mail, formulário, agenda de ligação online e redes (LinkedIn, Instagram, Behance, Facebook).
- Políticas de privacidade, termos e cookies.

**Falta:**

- Faixa de preço ou investimento mínimo.
- Depoimento de cliente: nenhum, em nenhuma página.
- Prêmios e imprensa: a página `/awards` não lista nada.
- Equipe além do fundador. O FAQ fala em "our licensed architects", mas ninguém aparece.
- Formação e registro profissional do fundador.
- Antes e depois em foto: só o texto do caso conta o que mudou.
- WhatsApp e horário de atendimento.
- Formulário que qualifique o lead (tipo de imóvel, área, bairro, fase, orçamento, prazo), apesar de o contato pedir "a
  few details about your project".
- Créditos de foto e aviso de quando a imagem é render.
- Volume de portfólio que sustente os "182 projetos": o site tem 5, mais 1 na página 2, e o contador da lista diz "+5".
- Páginas de Sobre e de Contato próprias (são âncoras da home; `/about` e `/contact` dão 404).

---

## Navegação e conversão (testado)

O topo fixo tem só três itens: MENU à esquerda (pílula translúcida), logo no centro, REQUEST A CALL à direita. No
desktop o clique no MENU não abriu o painel no teste, então **o menu do desktop não foi verificado**. No celular abre
um painel com About, Projects, Approach, Blog, Contact, endereço e telefone. About, Approach e Contacts são âncoras da
home (`#composition`, `#story`, `#footer`); o site real é a home, a lista de projetos, as páginas de projeto e o blog.

Há três famílias de botão, cada uma com um nível de compromisso:

| Família | Onde aparece | O que faz |
|---|---|---|
| **REQUEST A CALL** (conversa) | topo, o tempo todo; cartão do fundador; depois da frase dos compromissos no celular; barra fixa no pé da tela do celular | abre a agenda do HubSpot para marcar a ligação direto |
| **VIEW PROJECT / VIEW ALL PROJECTS / VIEW PROJECTS** (prova) | carrossel, depois dos números, miniaturas da Composição | leva ao portfólio |
| **START A PROJECT** (projeto) | fim de toda página | abre o formulário de nome, e-mail e mensagem |

Na página de projeto há NEXT CASE logo depois do caso e "More projects" no fim, para o visitante não sair do
portfólio. Contatos diretos: e-mail no cartão do fundador, telefone no rodapé, endereço no menu do celular. Não há
WhatsApp. **O caminho até o contato é curto em qualquer ponto**: o botão do topo e a barra do celular nunca somem.

---

## O que copiar

### A home como sequência de respostas, na ordem das objeções

- **Como é feito:** capa (o que fazem) → manifesto (como pensam) → projeto com ficha (já fizeram) → compromissos (vai dar
  dor de cabeça?) → serviços (o que eu compro) → números e fundador (quem são) → perguntas (preço, prazo, garantia) →
  contato (como começo).
- **Por que funciona:** cada seção tira a dúvida que a anterior deixa. Quem chega ao contato já passou por todas as
  objeções, e uma seção que não responde a nenhuma pergunta fica visível como sobra.

### Os três serviços na capa, e de volta como seção

- **Como é feito:** "Architecture × Design × Delivery" em manuscrito na abertura e na capa; os mesmos três termos voltam
  como os três cartões da seção 5.
- **Por que funciona:** o visitante sabe o escopo antes de rolar, e a repetição amarra o começo da página ao meio.

### Compromisso como regra operacional, não adjetivo

- **Como é feito:** quatro itens numerados, cada um com uma regra verificável ("Every revision is documented, priced,
  and agreed before execution").
- **Por que funciona:** responde ao medo específico (atraso, custo, quem responde) com algo que o cliente pode cobrar
  depois. "Atendimento de excelência" não se cobra; "mudança só depois de orçada e aprovada", sim.

### "Um responsável", com o rosto dele

- **Como é feito:** o primeiro compromisso é "One responsible lead", e a foto ao lado é o retrato do fundador.
- **Por que funciona:** transforma o tamanho pequeno do estúdio no antídoto do maior medo de reforma, o de ninguém
  responder.

### Ficha que abre pelo prazo

- **Como é feito:** "PROJECT EXECUTED In 62 days" vem antes da área e da cidade, na home, na lista e no caso.
- **Por que funciona:** em reforma, prazo é o medo número 1, e o número transforma foto em prova de entrega.

### Uma função fixa por tipo de imagem

- **Como é feito:** cor para resultado, P&B para processo, linha para pensamento, planta para arquitetura.
- **Por que funciona:** o visitante entende o que está vendo sem legenda, porque o tratamento já diz a categoria.

### Legenda adiada, nunca apagada

- **Como é feito:** miniatura sem texto na home, nome no hover, caso completo na página do projeto.
- **Por que funciona:** a home mostra volume sem pedir leitura, e cada imagem tem onde ser explicada.

### O caso contado como problema resolvido, com planta

- **Como é feito:** CLIENT, OBJECTIVE, SOLUTION; depois a planta humanizada e capítulos que explicam cada grupo de fotos.
- **Por que funciona:** o visitante se reconhece no cliente, a planta prova o que a foto não mostra, e o capítulo dá
  razão a várias fotos de uma vez.

### O FAQ como depósito da informação comercial

- **Como é feito:** 14 perguntas em sanfona, com as respostas que o segmento costuma deixar para a reunião (quem executa
  a obra, como se forma o preço, revisão paga, garantia, prazos médios).
- **Por que funciona:** qualifica o lead antes da ligação e encurta a primeira conversa, sem pesar a página, porque as
  respostas ficam fechadas.

### Dois níveis de pedido

- **Como é feito:** conversa (REQUEST A CALL, fixo no topo e no pé do celular) e projeto (START A PROJECT, no fim).
- **Por que funciona:** o pedido pequeno converte quem ainda não decidiu; o formulário recebe quem já decidiu.

### A pessoa logo antes do contato

- **Como é feito:** retrato, frase e canal direto lado a lado, entre o blog e o FAQ.
- **Por que funciona:** o pedido que vem depois já tem rosto e nome.

### Número traduzido por imagem, um por vez

- **Como é feito:** cartões presos que acendem em sequência, cada um com a foto que explica o número.
- **Por que funciona:** obriga a ler cada número e lhe dá sentido.

### Separar a peça de conceito da peça de venda

- **Como é feito:** `/awards` tem a capa conceitual (a definição de "stanza") para o júri; a home mantém a oferta.
- **Por que funciona:** o site concorre a prêmio sem trocar a frase que vende.

---

## Tipografia e cor

- **Famílias (medidas no estilo computado):** títulos em Instrument Serif, a 120px (números), 72px (capa), 56px
  (seções), 40 e 32px (itens e perguntas); texto em Helioscond (grotesca condensada), a 18px no corpo, 24px nos
  destaques, 14px e 12px no metadado em caixa alta entre colchetes (`[ COMPOSED ]`). A manuscrita das duas frases é a
  Katherine Plus, segundo o estudo de 13/10 (não remedida agora).
- **Contraste entre título e corpo:** serifa editorial grande contra grotesca condensada pequena; o metadado entre
  colchetes faz o terceiro nível.
- **Cor (*aparente*, não remedida agora):** papel creme por volta de `#F4F3EB`, texto quase preto, botões pretos. Cada
  capítulo ganha um bloco de cor: verde-oliva nos projetos, azul-marinho em degradê nos serviços, cinza-claro no blog,
  preto no cartão do fundador.
- **Quantos acentos de verdade:** nenhum acento único. O sistema é troca de fundo por capítulo; a cor que sobra vem das
  fotos.
- **Grade:** fio de 1px visível na seção Composição (três colunas neste estudo; o de 13/10 registrou seis).
- **Celular:** Composição e números viram fileiras horizontais; compromissos com foto em cima e texto embaixo; barra
  fixa de REQUEST A CALL no pé.

---

## O que serve à Débora Reis

### A diferença de propósito, antes de copiar qualquer coisa

A Stanzza vende projeto **e** gestão completa da reforma, com empreiteiros contratados por concorrência e um fundador à
frente. A Débora é uma profissional só, em Salvador, com três frentes: projeto, acompanhamento de obra e decoração. O
que as duas têm em comum é o cliente com medo da obra. Por isso, da Stanzza se reaproveita **a ordem das respostas e a
informação que cada seção carrega**, não a aparência.

**Atenção à história do esboço:** o estudo de 13/10 já levou o sistema da Stanzza para as rodadas 3 a 5 do site da
Débora, e na rodada 5 (14/10) o Marcelo achou a capa e a cena do projeto parecidas demais. A regra ficou em
`_memoria/design/90-antipadroes.md` ("Referência obrigatória copiada na estrutura"): da referência vem o sistema; a
primeira dobra e a seção de projeto saem de um objeto da cliente. Este estudo não reabre isso: o que ele acrescenta é
**a régua de propósito e a lista de informação**.

### O propósito do site, pela régua da Stanzza

Pela lógica deste site, o trabalho da página da Débora é: mostrar que ela faz o que a pessoa precisa, provar que já
fez casos parecidos, convencer de que a reforma vai ser controlada por uma pessoa só, e levar a uma conversa no
WhatsApp. A tabela serve para auditar o esboço seção por seção:

| Pergunta de quem vai reformar | Na Stanzza | O que o site da Débora precisa responder | Dado que precisa vir dela |
|---|---|---|---|
| O que você faz? | capa em três linhas, com os três serviços | projeto, acompanhamento de obra e decoração, logo na capa | nenhum novo |
| Como você pensa? | Composição | uma frase de método dela | a frase, nas palavras dela |
| Já fez algo parecido? | projeto com ficha | ficha por projeto: prazo de obra, m², bairro de Salvador, escopo | prazo, m², bairro de cada obra, ou `[FALTA]` |
| Vai dar dor de cabeça? | compromissos | o que ela de fato faz para controlar prazo e custo | frequência de visita à obra, forma de cobrança, ou `[FALTA]` |
| O que eu compro? | três serviços | o que entra em cada frente | o que ela entrega em cada uma |
| Quem é você? | números e fundador | retrato, formação (UFBA, 2004), uma frase dela | registro profissional, retrato real |
| Quanto custa, quanto demora, quem faz a obra? | FAQ | perguntas com as respostas dela | todas as respostas |
| Como eu começo? | REQUEST A CALL e START A PROJECT | WhatsApp e formulário que pede o que ela precisa saber | número confirmado por ela |

### O que aproveitar, e como

1. **A home como sequência de respostas.** Usar a tabela acima como régua: cada seção do esboço precisa apontar para
   uma linha. A que não aponta para nenhuma é candidata a sair; a pergunta sem seção é o que está faltando.
2. **Capa em três linhas com as três frentes.** A Stanzza escreve "Architecture × Design × Delivery"; a Débora tem
   exatamente três (projeto, acompanhamento de obra, decoração). O visitante sabe o escopo antes de rolar, e os três
   termos voltam depois como a seção de serviços.
3. **"Uma responsável só" como promessa número 1.** A Débora é literalmente a única responsável do primeiro desenho à
   entrega. O que parece fraqueza (sem equipe) vira o antídoto do maior medo de reforma (ninguém responde).
4. **Compromissos como regra verificável.** "Cada etapa aprovada antes da próxima", "mudança e custo combinados antes
   de executar", "visita à obra". **Só entra o que ela de fato faz**; frequência de visita e forma de cobrança, se não
   vierem dela, ficam `[FALTA]`.
5. **Ficha que abre pelo prazo de obra.** Prazo, m² e bairro de Salvador, só com dado real dela; o que faltar fica
   `[FALTA]`.
6. **P&B para processo, cor para resultado.** Exige fotos reais da Débora trabalhando (desenhando, na obra, com o
   cliente). Nunca banco de imagem, nunca IA no rosto dela.
7. **Miniaturas sem legenda como índice, com o nome no hover e link para o caso.** É a resposta à pergunta do Marcelo
   sobre imagens que aparecem sem dizer o que são: a legenda é adiada para o hover e para a página do projeto. **No
   celular precisa virar fileira com o nome visível**, porque não há hover.
8. **Página de projeto como caso de reforma:** cliente → objetivo → solução, planta e capítulos com o porquê de cada
   grupo de fotos (o que ficou, o que saiu, o que entrou, a luz). Reforma de apartamento é exatamente "o que se
   preserva e o que se muda". Planta só se ela tiver.
9. **Perguntas como depósito da informação comercial, em sanfona.** Por exemplo: "você só faz o projeto ou acompanha a
   obra?", "quem executa a obra?", "o que eu recebo?", "quanto tempo leva?", "como funciona a compra de móveis?". As
   respostas são dela; as que não vierem ficam `[FALTA]`.
10. **Dois níveis de pedido.** Conversa no topo e fixa no pé do celular; projeto no fim. Em Salvador, a conversa é
    WhatsApp, com o número que ela confirmar. O formulário deve pedir o que a Stanzza esquece: bairro, tipo de imóvel,
    m² e fase (comprou, vai reformar ou está em obra).
11. **A pessoa logo antes do contato.** Retrato, uma frase dela e canal direto lado a lado. Em escritório de uma pessoa,
    a cliente contrata a Débora; o pedido vira "fale com a Débora".
12. **Número traduzido por imagem, um por vez, e só número real.** Formada pela UFBA em 2004, com a foto ou o desenho
    que traduz o dado. Contagem de projetos sem lastro, nunca.
13. **Peça de conceito separada da peça de venda.** Se a Hórus quiser inscrever o site da Débora num prêmio, a capa
    conceitual vai num endereço à parte e a home continua dizendo o que ela faz e como começar.

### O que a Stanzza não tem e o site da Débora precisa ter (conferir no esboço)

- WhatsApp visível, com o número confirmado por ela.
- Formação e registro profissional (o número vem dela, ou `[FALTA]`).
- Como começa, em passos, com o que acontece em cada um (a Stanzza deixa isso no FAQ).
- Formulário com os campos que dão a ela o que precisa para responder com um plano.
- Antes e depois em foto, se ela tiver o material.
- Aviso quando a imagem for render, e crédito de foto quando não for dela.
- Depoimento só se for real, de cliente dela, com autorização. Nunca inventado.
- Endereço e forma de atendimento visíveis na página, não só no menu do celular.

---

## O que não copiar

- **Capa conceitual no lugar da oferta.** A definição do nome (*"A group of lines forming a unit within a poem."*)
  serve para o júri no `/awards`; a home de venda manteve "Composed residential interiors". Para a Débora, a capa diz o
  que ela faz.
- **Rótulo de seção errado ou reaproveitado:** `[ IN YEARS ]` sobre os serviços, "VIEW ALL ARTICLE" nos cartões de
  projeto. É detalhe que denuncia template.
- **Parágrafo repetido:** o texto da seção Composição volta inteiro no About us.
- **Número grande sem lastro visível:** "182 projects worldwide" contra 5 projetos no site e o contador "+5". Para a
  Débora, número só se for real e conferível.
- **Dado copiado entre projetos:** a "Maastricht villa" da página 2 aparece em Riad, com os mesmos 65 dias e 511 m² do
  Jazean.
- **Foto de terceiros com marca d'água** no blog (barcelona-tourist-guide.com).
- **Agenda de terceiros com a marca e o nome padrão à vista** ("Meet with Kirill 1", "Create your free meeting booking
  page"), quebrando a identidade bem no momento da conversão.
- **Esconder 4 de 5 projetos atrás de uma seta quase invisível** sobre a foto, no carrossel da home.
- **Render apresentado como projeto executado sem aviso** (os cafés de Riad, *aparente*) e **foto de processo com cara
  de banco de imagem**. Para a Débora, a foto do processo tem que ser dela.
- **Promessa "residential" com a maior parte do portfólio comercial:** o visitante residencial vê três cafés.
- **Erros de digitação** em título de capítulo ("Authencity") e no endereço de página ("apartement-in-valencinia").
- **Formulário que promete "a clear plan" mas só pede nome, e-mail e mensagem livre.**
- **Endereço só no menu do celular** e páginas de Sobre e Contato que dão 404 quando digitadas.

---

## Aplicado onde

Este estudo, ainda não. O estudo anterior da Stanzza (13/10/2026, `arquitetura-awwwards-2026-10.md`) foi aplicado nas
rodadas 3 a 5 do esboço da Débora Reis (`clientes/_prototipos/debora-reis/`), com a correção da rodada 5 registrada em
`_memoria/design/90-antipadroes.md`. Candidatos à aplicação deste: a tabela de perguntas como auditoria do esboço, a
ficha que abre pelo prazo, os compromissos verificáveis, o FAQ comercial e o formulário com campos de qualificação.
Preencher quando acontecer, com a adaptação feita.

Prints e textos extraídos (somem com a sessão):
`/tmp/claude-0/-home-user-HorusOS-Pro/ada53c37-1efb-518e-8aec-f8416f2ef82e/scratchpad/ref/stanzza-propósito/`

- `home-1440-00.png` (abertura emoldurada), `home-1440-01.png` (capa), `home-1440-03.png` (miniaturas flutuando sobre
  o título), `i-comp-hover.png` (hover que revela o nome do projeto)
- `home-1440-05.png` (projeto emoldurado com ficha), `i-car-2.png` (carrossel 02/05)
- `home-1440-09.png` (Controlled delivery e o fundador como "one responsible lead"), `home-1440-11.png` (compromissos
  03 e 04 com foto P&B)
- `home-1440-13.png` (croquis sobre azul-marinho), `home-1440-16.png` (cartões Architecture e Design)
- `home-1440-24.png` (números acendendo com foto), `home-1440-30.png` (logos de clientes), `home-1440-32.png` (blog com
  foto de marca d'água), `home-1440-33.png` (fundador)
- `i-faq.png` (FAQ aberta), `home-1440-36.png` (contato final e rodapé), `i-request-call.png` (agenda HubSpot),
  `i-start-project.png` (formulário Project inquiry)
- `awards-1440-01.png` (capa do `/awards` com a definição de "stanza")
- `projects-1440-00.png` (lista de projetos com ficha e carrossel)
- `projeto-1440-00.png` (caso: ficha, cliente, objetivo, solução), `projeto-1440-03.png` (planta humanizada e capítulo
  Heritage), `projeto-1440-05.png` (faixa de quatro fotos), `projeto-1440-09.png` (galeria horizontal presa),
  `projeto-1440-15.png` (More projects com rótulo errado)
- `m-sheet-0.png` a `m-sheet-3.png` (home no celular, 390px, e o menu do celular)
- `faq-dom.txt` (as 14 respostas do FAQ na íntegra), `home-text.txt`, `awards-text.txt`, `projects-text.txt`,
  `projeto-text.txt` (texto visível de cada página)
