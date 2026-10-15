# Teardown: Storey Architecture (arquitetura residencial e interiores, Exeter, Reino Unido)

- **URL:** https://www.storeyarchitecture.co.uk/
- **Segmento:** arquitetura residencial e interiores no Reino Unido: casas contemporâneas novas, reformas e interiores
  para dono de casa de alto padrão. Escritório com equipe de 6 pessoas (página Studio) e endereço em Exeter no rodapé.
- **Estudado em:** 15/10/2026, com prints: home em desktop 1440x900 do hero ao rodapé; home em celular 390x844; a gaveta
  do botão Contact; `/projects`; a página de projeto `/projects/festal-hill`; `/studio`; `/journal`; e o post
  `/journal/designing-for-long-term-living-rather-than-trends` (só o texto).
- **Quem fez:** uma agência que assina no rodapé com o ícone da Dirty Martini. **Não achei selo do Awwwards no código**;
  se o site está premiado, não foi conferido.
- **Nota:** 5/10. O sistema de interação é coerente (o mesmo componente de barras de progresso no hero, nos depoimentos
  e nas áreas de atuação; o formulário de briefing no fim de toda página e numa gaveta acessível de qualquer ponto) e
  tem um elemento-assinatura claro (os objetos de prancheta sobrepostos). Perde pontos porque é magro de fato
  verificável, porque o portfólio da home depende de hover e não aparece no celular, pelos erros de conteúdo sem
  revisão e pela evidência, no código, de foto gerada ou alterada por IA.
- **Contexto:** estudado a pedido do Marcelo para o site da Débora Reis (`clientes/_prototipos/debora-reis/`), no lote
  dos "outros sites do Awwwards e outros sites" que ele pediu além dos três que mandou
  ([Normal is Boring](normalisboring.md), [Tecnoarreda](tecnoarreda.md) e Stanzza). A pergunta dele: qual o propósito
  de cada seção, como as imagens aparecem e se falta informação no site da Débora.

**Em resumo:** o Storey fala com quem vai construir, reformar ou fazer o interior de uma casa de alto padrão, e o
trabalho principal do site é **vender clima** ("calm, lasting, refined", calmo, duradouro, refinado) com foto grande e
**levar a um formulário de briefing** que aparece no fim de todas as páginas e também abre em gaveta pelo botão Contact.
Em informação ele é magro: quase nenhum fato verificável (sem área, sem escopo, sem preço, sem registro profissional,
sem prêmio). A única ficha objetiva do site inteiro é uma linha de três dados no topo da página de projeto
("Hampshire · Home · 2023"). É o caso mais extremo do lote de "imagem que não diz o que é": na home, o visitante vê
dezenas de fotos e não sabe de qual casa é nenhuma delas.

**Uma ressalva de integridade, antes de tudo:** os nomes dos arquivos de imagem (`new-chat-image-upscaled`,
`projectsaltered/upscaled`) e um filtro CSS de saturação (`saturate(1.5)` a `saturate(2)`) nas capas indicam foto
gerada ou alterada por IA. **É hipótese tirada de evidência no código, não está confirmado.** Por isso este teardown
aproveita a estrutura e o mecanismo, nunca a aparência das fotos (regra da casa: IA nunca no objeto que o cliente vende).

---

## Estrutura, na ordem

A numeração segue a ordem em que as seções foram vistas. As que se repetem em todas as páginas ficam no primeiro bloco.

### Fixo em todas as páginas

**1. Cabeçalho fixo com o botão Contact.**

- **Mostra:** o logo "Storey" com um círculo pontilhado; o menu centralizado com três itens (Projects, Studio, Journal);
  à direita, o botão preto "Contact" com o mesmo círculo pontilhado. No celular vira "Storey" + "Menu" em texto grande.
- **Para quê:** **deixar o contato a um clique em qualquer ponto da rolagem** e manter a navegação curta. O contato é
  tratado como **ação, não como página**: o botão não leva a `/contact`, ele abre uma gaveta com o formulário por cima
  da página escurecida. Quem decide escrever não perde o lugar onde estava.
- **Como é montado:** barra fixa e transparente, sem fundo. A cor do texto inverte conforme a seção (branco sobre
  escuro, preto sobre claro). O botão Contact é o único elemento com caixa preta, o que o separa do menu.
- **A falha vista nos prints:** sem fundo, o menu se sobrepõe ao texto do corpo em várias rolagens (na home e no
  Studio).
- **Imagem:** nenhuma; fica por cima da foto do hero.

**9. Formulário "Spatial Brief Intake" em folha de papel** (descrito aqui porque fecha a home, `/projects`, a página de
projeto e `/studio`, e é o mesmo que abre na gaveta do botão Contact).

- **Mostra:** um título gigante à esquerda ("Start a conversation about your project, vision or future space.", comece
  uma conversa sobre o seu projeto, a sua ideia ou o seu espaço futuro), parcialmente coberto por uma folha de papel
  presa com clipe que contém o formulário, com o cabeçalho "01 SPATIAL BRIEF INTAKE" (ficha de briefing do espaço).
  Campos numerados de 01) a 06): Name, Email, Project type (Residential, Commercial, Hospitality, Interior), Location,
  Timeline, Tell us more. Botão Submit e, no pé da folha, "ST / CTF · THANK YOU · STOREYARCHITECTURE.CO.UK".
- **Para quê:** **converter e já qualificar o lead.** Tipo de projeto, local e prazo chegam antes da primeira conversa,
  e o escritório sabe se o pedido é para ele. A folha de papel faz o formulário parecer ficha de briefing de escritório,
  não formulário de site, o que muda a sensação de "preencher cadastro" para "começar um projeto".
- **Como é montado:** campos só com sublinhado, numeração em fonte mono, caixas de seleção quadradas. A folha avança
  sobre o título de propósito (sobreposição intencional). Como o mesmo bloco fecha todas as páginas principais, todo
  caminho do site termina nele.
- **A inconsistência:** o campo de tipo oferece Commercial e Hospitality num site que só mostra casa.
- **Imagem:** textura de papel (`paper.webp`) e um clipe em foto. Nenhuma foto de obra.
- **Copy:** *"Whether you are planning a new home, renovation, or interior transformation, we'd love to hear more about
  your project and how we can help shape it."* (esteja você planejando uma casa nova, uma reforma ou uma transformação
  do interior, queremos saber mais do seu projeto e de como podemos ajudar a dar forma a ele)

**10. Rodapé preto com os dados de contato.**

- **Mostra:** fundo preto. Quatro blocos: Site index; Legal (privacy, terms, cookies); "Get in touch" com e-mail,
  telefone clicável e endereço com link para o mapa; o logo. À direita, uma foto de casa com um bilhete preso por
  prendedor de papel. Embaixo, quadrados pretos caindo e o ícone de crédito da agência.
- **Para quê:** **fechar com os dados completos para quem rolou até o fim sem preencher o formulário.** É o único lugar
  da home com telefone e endereço.
- **Como é montado:** grade 2x2 à esquerda e foto à direita. Os dados de contato são texto simples, sem ícones.
- **A falha:** o endereço escrito (EX1 1QT) não bate com o link do mapa (EX1 1QJ).
- **Imagem:** a foto da casa do hero, repetida, com o bilhete de papel sobreposto e inclinado.

### Home

**2. Hero em slideshow com barras de progresso.**

- **Mostra:** foto de casa em tela cheia, uma frase de posicionamento no canto inferior esquerdo e o botão branco
  "View Projects". Cinco barras de progresso, no estilo dos stories do Instagram, marcam os slides. Cada slide troca a
  foto e a frase.
- **Para quê:** **dizer em uma frase que tipo de obra o escritório faz e mandar direto para o portfólio.** Mostra cinco
  casas logo de cara, sem pedir rolagem.
- **Como é montado:** altura de cerca de 110% da tela, então a foto passa da dobra. Texto pequeno (cerca de 22px,
  *aparente*) em bloco estreito à esquerda, com o CTA ao lado. Os slides trocam sozinhos a cada 10 a 13 s,
  aproximadamente (no print de 10 s a primeira barra ainda não tinha acabado; no de 27 s já estava no 3º slide).
- **O problema da copy:** as frases dos slides são variações da mesma promessa ("Storey designs contemporary homes that
  prioritise clarity..." e "Storey creates contemporary residential architecture shaped through simplicity..."). A
  troca de texto dá ritmo, mas não acrescenta informação.
- **Imagem:** foto em tela cheia, sem legenda e sem nome do projeto, com um leve escurecimento para dar contraste ao
  texto.
- **Copy:** *"Storey designs contemporary homes that prioritise clarity and intentional living, combining refined
  architecture with carefully considered materials and timeless detailing throughout"* (a Storey projeta casas
  contemporâneas que priorizam a clareza e o viver com intenção, unindo arquitetura refinada, materiais escolhidos com
  cuidado e detalhes atemporais)

**3. Manifesto + revoada de projetos (fundo preto).**

- **Mostra:** dois parágrafos curtos em duas colunas, no alto à direita: no que acreditam e como trabalham. Abaixo,
  cerca de 8 cartões soltos em perspectiva 3D flutuando no preto. No canto, um cartão de papel com um GIF tutorial:
  "HOVER + CLICK TO VISIT PROJECTS" (passe o mouse e clique para ver os projetos).
- **Para quê:** **separar a crença do método** e **transformar o portfólio em brincadeira de descoberta.** O primeiro
  parágrafo diz o que acreditam ("architecture should feel calm, lasting"); o segundo, como trabalham
  ("collaboration, careful detailing"). A revoada não explica projeto nenhum: só mostra que existe trabalho por trás.
- **Como é montado:** seção alta (cerca de 1.800 px) em que os cartões derivam com a rolagem. Cada cartão é a capa de
  um projeto (Festal, Meadow, Bracken, Grange, Rosewood), fica cinza até o mouse passar e aí revela a foto. O clique abre
  a página do projeto. **O GIF existe porque o gesto não é óbvio.** No celular (390px) os cartões ficam escuros o tempo
  todo, porque não há hover, e o tutorial não apareceu.
- **Imagem:** fotos pequenas, inclinadas, sem nenhuma legenda, que só se revelam no hover. É a imagem como textura ou
  teaser, sem informação.
- **Copy:** *"We believe architecture should feel calm, lasting, and deeply connected to the way people live. Our work
  focuses on creating homes that feel refined without excess."* (acreditamos que a arquitetura deve ser calma, durar e
  estar ligada ao jeito como as pessoas vivem; nosso trabalho é criar casas refinadas, sem excesso)

**4. "Our areas of expertise": três linhas numeradas.**

- **Mostra:** o título enorme "Our areas of expertise" (nossas áreas de atuação) com um parágrafo-resumo à direita.
  Três linhas: Interior Atmosphere, Contemporary Homes, Landscape Integration. Cada uma tem o título à esquerda, uma
  frase à direita, um numeral cinza gigante (1, 2, 3) e uma foto pequena. Uma régua e um lápis recortados em foto
  aparecem na borda direita.
- **Para quê:** **responder "o que vocês fazem" em três frentes, uma frase cada.** O numeral dá ordem e peso sem precisar
  de ícone.
- **Como é montado:** linhas em grade de 2 colunas (título | texto + foto) separadas por fio fino. Ao rolar, cada linha
  parece grudar e escurecer (de `#eee` para `#d9d9d9` e depois mais cinza, *aparente*) enquanto a próxima sobe por
  cima, formando uma pilha.
- **Dois problemas:** (1) **erro de copy:** o texto de "Interior Atmosphere" fala de casas e o de "Contemporary Homes"
  fala de interiores, estão trocados; (2) as três frentes não são uma sequência (interior, casa, paisagem), então o
  numeral só ordena a lista, não um caminho. Pela regra do `00-anatomia.md`, numeração grande só vale quando a
  sequência é real.
- **Imagem:** foto pequena (cerca de 400x240) dentro da linha, como ilustração secundária, sem legenda. Objetos de
  escritório (régua, lápis) recortados e sobrepostos à borda da seção.
- **Copy:** *"Storey works across private residential architecture, renovations, and interior environments, creating
  spaces that feel considered from every angle."* (a Storey atua em arquitetura residencial privada, reformas e
  interiores, criando espaços pensados por todos os ângulos)

**5. Frase-manifesto sobre foto cheia: "We shape space into purpose".**

- **Mostra:** uma casa térrea com piscina em tela cheia, a frase gigante centralizada em branco, o botão "Explore studio"
  e dois parágrafos sobre a água da piscina.
- **Para quê:** **pausa de respiro que muda o assunto** de "o que fazemos" para "quem somos" e empurra para a página
  Studio.
- **Como é montado:** foto mais alta que a tela (imagem de cerca de 1.700 px), com rolagem em parallax. O título é o
  único centralizado da home, o que marca a troca de assunto. Os dois parágrafos ficam em duas colunas, alinhados à
  direita, embaixo.
- **Imagem:** foto de ambientação, sem legenda e sem nome de projeto. A imagem é palco para a frase.
- **Copy:** *"We shape space into purpose / Explore studio"* (damos propósito ao espaço / conheça o estúdio)

**6. Projetos em destaque em zigue-zague + bilhete manuscrito.**

- **Mostra:** três projetos (Festal Hill, Meadow House, Bracken House) em duas colunas desencontradas. No vazio que o
  desencontro deixa, um bilhete de papel com clipe: "A note from Storey: Calm homes, lasting design" (um recado da
  Storey: casas calmas, design que dura), em letra manuscrita.
- **Para quê:** **mostrar obra em tamanho grande e levar ao projeto.** O bilhete humaniza e preenche o buraco da grade
  com marca, não com texto.
- **Como é montado:** grade de 2 colunas com alturas diferentes (uma foto vertical de cerca de 1.200 px ao lado de uma
  horizontal). No hover, a foto encolhe dentro de uma moldura preta e um chip "Explore Project" segue o cursor. **Na
  home não há nome, local nem ano nesses três projetos.**
- **Imagem:** fotos grandes sem legenda, com filtro CSS `saturate(1.5)` a `saturate(2)` que deixa a cor mais forte.
  Bilhete de papel com textura sobreposto ao espaço vazio.

**7. Depoimentos em carrossel (fundo preto).**

- **Mostra:** à esquerda, uma foto grande de projeto, quatro barras de progresso, a citação curta, uma miniatura de foto
  do projeto em preto e branco e o nome do cliente com a família ou empresa em fonte mono ("Ariana Holt / HOLT FAMILY",
  "Leah Morrison / MORRISON & CO"). À direita, dois parágrafos sobre o processo colaborativo.
- **Para quê:** **prova social amarrada a uma obra.** A foto do projeto junto da citação sugere que aquela pessoa mora
  naquela casa. Os parágrafos ao lado transformam o depoimento em argumento de processo ("clarity, communication",
  clareza, comunicação).
- **Como é montado:** carrossel automático de 4 itens com barras de progresso (o mesmo componente do hero). Cartões
  cinza flutuam ao fundo. No celular empilha: foto, barras, citação, nome.
- **A falha:** não há rosto do cliente nem link para o projeto daquela pessoa. A ligação entre a citação e a casa é
  sugerida pela imagem, não afirmada, e não dá para conferir.
- **Imagem:** a foto do projeto faz o papel de avatar. A miniatura é a mesma foto de obra em P&B.
- **Copy:** *"The process felt exceptionally clear from beginning to end, and every decision elevated both function and
  atmosphere in our home."* (o processo foi muito claro do começo ao fim, e cada decisão melhorou a função e a atmosfera
  da nossa casa)

**8. Journal: "Spaces Shaped Through Intention".**

- **Mostra:** título gigante, parágrafo, botão "View Posts" e quatro posts em duas colunas desencontradas, cada um com
  foto, título e botão "Read". Lápis e borracha recortados na margem.
- **Para quê:** **mostrar que o escritório pensa (autoridade) e dar conteúdo para a busca.** Os títulos repetem os
  valores da marca (long-term living, material honesty, privacy, landscape).
- **Como é montado:** grade em zigue-zague. O título do post fica embaixo da foto, à esquerda, e o botão "Read" preto à
  direita, na mesma linha.
- **Imagem:** foto de ambiente (quarto, banheiro, fachada) com o título embaixo. É o único lugar da home em que a foto
  tem legenda, porque o título do post é a legenda.
- **Copy:** *"Designing for Long-Term Living Rather Than Trends"* (projetar para morar por muito tempo, não para a
  tendência)

Depois do Journal vêm o formulário (9) e o rodapé (10).

### Página Projects

**11. Abertura: "Built around living".**

- **Mostra:** o título "Built around living" (construído em torno do morar) e um parágrafo à direita, em fundo branco,
  sem foto.
- **Para quê:** **respiro antes das fotos e enquadramento da coleção.**
- **Como é montado:** título gigante à esquerda, texto à direita, muito espaço vazio em cima e embaixo.
- **Imagem:** nenhuma; a página abre só com texto.
- **Copy:** *"A selection of contemporary residential projects shaped through material honesty, spatial clarity, and a
  considered relationship between architecture, landscape, and everyday living."* (uma seleção de projetos
  residenciais contemporâneos feitos com honestidade de material, clareza de espaço e uma relação pensada entre
  arquitetura, paisagem e vida cotidiana)

**12. Grade de 5 projetos.**

- **Mostra:** Festal Hill grande à esquerda, Meadow House e Bracken House menores à direita; depois Grange Farm e
  Rosewood View desencontrados. Cada um com o nome e um botão "Explore".
- **Para quê:** **índice do portfólio.** A hierarquia de tamanho diz qual projeto é o carro-chefe.
- **Como é montado:** grade assimétrica (1 grande + 2 pequenos, depois 2 desencontrados). Sem filtro, sem categoria. O
  índice não mostra local, ano nem tipo de obra: **só o nome da casa**. Logo abaixo vem o formulário.
- **Imagem:** fotos de fachada cortadas em proporções diferentes, com o nome embaixo como única legenda.

### Página de projeto (Festal Hill)

**13. Hero com ficha de uma linha.**

- **Mostra:** foto de fachada em tela cheia, escurecida. Uma linha de metadados, "Hampshire · Home · 2023", o título
  "Festal Hill" gigante e um parágrafo à direita sobre o terreno, os materiais e a luz.
- **Para quê:** **situar o projeto em três dados (onde, o quê, quando) e contar a ideia em quatro linhas.**
- **Como é montado:** a ficha é uma linha curta acima do título, sem rótulos. O parágrafo é a única descrição do
  projeto na página inteira. Não informa área, escopo do escritório, orçamento, prazo nem fotógrafo.
- **Imagem:** foto em tela cheia como fundo do título.
- **Copy:** *"Festal Hill sits on a hillside in Hampshire with expansive wide views across rolling countryside. Terraced
  levels step down the slope, with stone walls and timber blending the building into the land."* (Festal Hill fica numa
  encosta de Hampshire, com vista ampla para o campo; os níveis em terraço descem o declive, e as paredes de pedra e a
  madeira fundem o prédio ao terreno)

**14. Galeria só de imagem.**

- **Mostra:** cerca de 12 fotos: fachadas, cozinha, sala, quarto, banheiro.
- **Para quê:** **deixar a foto fazer o trabalho todo.** O visitante percorre a casa de fora para dentro sem ler nada.
- **Como é montado:** ritmo fixo: 1 foto em largura total, depois 2 lado a lado, 1 inteira, 1 inteira, 2 lado a lado, e
  assim por diante, com margem branca de 20px. Cada foto entra com uma cortina preta que se desfaz ao chegar na tela.
  Duas fotos vizinhas são quase a mesma fachada em outro corte.
- **Imagem:** nenhuma legenda, nenhum texto entre as fotos. Sequência de fora para dentro (fachada, área social, área
  íntima).

**15. "Explore more projects like this".**

- **Mostra:** título, parágrafo, botão "View Projects" e dois outros projetos.
- **Para quê:** **não deixar o visitante num beco sem saída.** Ele segue para outra obra em vez de sair do site.
- **Como é montado:** o mesmo layout das aberturas (título à esquerda, texto + botão à direita) e 2 fotos lado a lado.
  Depois vem o formulário.
- **Imagem:** duas capas de projeto com botão "Explore".

### Página Studio

**16. Abertura preta + manifesto.**

- **Mostra:** "Storey shapes spaces into homes" (a Storey transforma espaços em casas) em branco sobre preto, um
  parágrafo e cartões brancos flutuando. Depois, em fundo branco, a frase gigante "Storey creates contemporary homes
  shaped by clarity, material honesty, and place." com três parágrafos (crença, método e acompanhamento do conceito à
  entrega) e duas fotos do escritório.
- **Para quê:** **apresentar quem é o escritório e como pensa antes de mostrar as pessoas.**
- **Como é montado:** tipografia gigante ocupando quase a tela toda, parágrafos estreitos à direita, fotos desencontradas.
- **A falha:** erro de digitação no texto de abertura ("a archiecture studio").
- **Imagem:** fotos de um escritório-loft com plantas e uma pessoa desfocada andando, sem legenda. Não mostram a equipe
  trabalhando de fato.
- **Copy:** *"Storey is a archiecture studio working at the intersection of landscape and experiences."* (a Storey é um
  estúdio de arquitetura que trabalha no cruzamento entre paisagem e experiência; o erro é do original)

**17. Core Principles: 4 linhas numeradas em fundo preto.**

- **Mostra:** Clarity, Material Honesty, Connection to Place, Long-Term Living (clareza, honestidade de material,
  ligação com o lugar, morar por muito tempo). Cada um com título, parágrafo e numeral gigante branco.
- **Para quê:** **dar critério de decisão** (por que a casa fica assim), e não só adjetivos.
- **Como é montado:** o mesmo componente das áreas de atuação da home, invertido para o preto. Linhas separadas por fio,
  título à esquerda, texto à direita, numeral embaixo.
- **Imagem:** nenhuma.
- **Copy:** *"Materials are selected for their texture, durability, and ability to age beautifully over time. Timber,
  stone, plaster, and metal are used with restraint."* (os materiais são escolhidos pela textura, pela durabilidade e
  por envelhecerem bem; madeira, pedra, reboco e metal são usados com contenção)

**18. Our Process: rolagem presa.**

- **Mostra:** o título "Our Process" e cinco parágrafos que se trocam no mesmo lugar conforme a rolagem: entender o
  cliente e o terreno, ideias iniciais, refino, materiais e detalhes, obra com consultores e construtores. Cartões cinza
  flutuam à esquerda.
- **Para quê:** **tirar o medo de "como vai ser"** e mostrar que existe sequência do primeiro contato à entrega.
- **Como é montado:** seção presa (pinned) bem alta, com um parágrafo por vez entrando e saindo à direita.
- **A falha:** as etapas não têm nome nem número visível no texto, e não dizem o que o cliente recebe nem quanto dura
  cada uma. A seção existe, mas não responde a pergunta que a justifica.
- **Imagem:** nenhuma foto, só os cartões cinza como textura em movimento.
- **Copy:** *"We begin by learning about the client, the site, and the way the home needs to support everyday life."*
  (começamos entendendo o cliente, o terreno e o jeito como a casa precisa sustentar a vida de todo dia)

**19. Team.**

- **Mostra:** seis pessoas com foto, nome e cargo (Architectural Director, Designer, Technician, Design Director,
  Project Director, Director).
- **Para quê:** **pôr rosto no escritório** e mostrar que existe gente responsável por cada parte.
- **Como é montado:** grade assimétrica, alternando uma foto grande e duas pequenas. Nome à esquerda, cargo em cinza à
  direita. Sem bio, formação ou registro profissional.
- **Imagem:** retratos reais em dois ensaios diferentes (fundo cinza de estúdio e fundo de cerca viva), sem
  padronização entre eles.

**20. Areas of Work: carrossel em fundo preto.**

- **Mostra:** título, parágrafo e um carrossel com 4 barras de progresso. Cada slide tem um título (por exemplo,
  Landscape Integration), dois parágrafos e uma foto à direita.
- **Para quê:** **aprofundar os serviços** que a home só cita em uma frase.
- **Como é montado:** o mesmo componente de barras de progresso do hero e dos depoimentos. Só um serviço fica visível
  por vez.
- **Imagem:** foto de fachada grande à direita, sem legenda.
- **Copy:** *"We treat landscape as an extension of the home, connecting architecture with gardens, terraces, views, and
  context."* (tratamos a paisagem como extensão da casa, ligando a arquitetura a jardins, terraços, vistas e entorno)

### Journal

**21. Lista e post.**

- **Mostra:** abertura "Spaces, Materials & Perspective", um "Featured read" e a grade de 4 posts. O post tem título,
  autor com cargo (Cameron Hodder, Director), data (Jun 2026), "2 min read", uns dez parágrafos curtos e um fecho com
  chamada para os projetos ("See our knowledge in action", veja o nosso conhecimento na prática).
- **Para quê:** **autoridade e busca.** O fecho do post devolve o leitor ao portfólio.
- **Como é montado:** post curto (cerca de 300 palavras) em coluna estreita, com cabeçalho de autor e data.
- **Imagem:** foto de capa por post, com o título como legenda.

### Comparando com `_memoria/design/00-anatomia.md`

- **Hero:** responde **o que é** (a frase: casas contemporâneas) e **o que fazer** (View Projects). Não responde **para
  quem** nem **onde**, e não tem **prova imediata** ao lado da promessa: nenhum ano de casa, registro ou número real.
  A frase troca a cada slide sem acrescentar nada.
- **Para quem é:** não existe. O mais perto é o texto do formulário ("planning a new home, renovation, or interior
  transformation"), que aparece só no fim.
- **O que fazemos:** três linhas numeradas com uma frase cada na home, aprofundadas em Areas of Work no Studio. Cumpre o
  formato, mas com os textos trocados entre duas linhas.
- **Como começa:** é o bloco mais fraco. O Process existe (no Studio, não na home), mas sem nome de etapa, sem
  entregável e sem prazo. O formulário qualifica (tipo, local, prazo), mas não substitui o "como começa".
- **Quem faz:** seis nomes com cargo e retrato. Sem formação nem registro (ARB/RIBA).
- **Como é / onde é:** o endereço só no rodapé; fotos do escritório no Studio, sem legenda.
- **FAQ:** não existe.
- **Contato:** forte em **presença** (botão fixo que abre a gaveta e formulário no fim de toda página), fraco em
  **canal** (telefone e e-mail só no rodapé e no menu, sem WhatsApp nem chat).
- **Encenar a prova:** quase nada. O site afirma por adjetivo ("calm", "considered", "refined"); a única prova
  verificável é a linha de ficha do projeto.
- **Vender o freio:** só esboçado. O Process aponta para o medo de "como vai ser", mas sem número não desarma nada.
- **Ritmo visual:** alterna seções pretas e brancas o site inteiro, e reaproveita poucos componentes (barras de
  progresso, linhas numeradas, zigue-zague), o que dá unidade.

**A diferença de fundo:** Normal is Boring e Tecnoarreda deixam a home para o clima e a informação para as páginas
internas; o Pelizzari põe prova antes de autodescrição. O Storey é o mais radical do lote no sentido do clima: **a home
inteira é ambientação, e nem as páginas internas trazem fatos** (o Studio repete adjetivos, o projeto tem uma linha de
ficha e um parágrafo). O que segura a estrutura é a conversão: **todo caminho termina no formulário**, e o formulário
pergunta o que importa (tipo, local, prazo). O elemento-assinatura são os **objetos de mesa de escritório sobrepostos**
(papel, clipe, régua, lápis, borracha, bilhete manuscrito).

---

## Como as imagens aparecem

O Storey é o exemplo mais puro, no lote, do que o Marcelo descreveu: **imagens que se sobrepõem e mostram trabalho sem
dizer o que está nelas.** O site tem cinco regimes de imagem:

1. **Na home, imagem como clima ou teaser, sem legenda nenhuma:** hero, revoada, foto-palco, zigue-zague. Nenhuma foto
   da home diz de que casa é, onde fica ou o que o escritório fez nela.
2. **No índice `/projects`, o nome da casa como única legenda.**
3. **No projeto, uma linha de ficha em cima e a galeria sem legenda embaixo.**
4. **No Journal, o título do post como legenda.** É a única foto da home com texto embaixo.
5. **Objetos físicos recortados (papel, clipe, régua, lápis) por cima de tudo**, como assinatura, não como informação.

O preço do regime 1: o visitante sente que há muito trabalho, mas não sai sabendo nada sobre ele. E, no celular, a
revoada nunca mostra as fotos. Os padrões, na ordem em que valem mais para o pedido do Marcelo:

### Revoada de cartões que só revelam a foto no hover

- **Onde:** home, seção preta logo depois do hero. Variações sem foto (só planos cinza ou brancos) no hero do Studio, no
  Process e no fundo dos depoimentos.
- **Como funciona:** as capas dos projetos viram planos inclinados em perspectiva 3D que derivam com a rolagem. Ficam
  cinza até o mouse passar, e aí a foto aparece. O clique abre o projeto. Não há título, local nem legenda. Um GIF
  tutorial ensina o gesto ("HOVER + CLICK TO VISIT PROJECTS").
- **Efeito:** o portfólio vira textura e brincadeira de descoberta: dá curiosidade e sensação de volume de obra sem
  explicar nenhuma. **O custo:** precisa de manual, não informa nada, e no celular as fotos nunca aparecem (sem hover,
  os cartões ficam escuros).

### Hero em slideshow com barras de stories

- **Onde:** hero da home. O mesmo componente volta nos depoimentos e em Areas of Work.
- **Como funciona:** foto em tela cheia que troca sozinha a cada 10 a 13 s, aproximadamente. Barras de progresso no
  estilo do Instagram mostram quantos slides há e em qual o visitante está. A frase de posicionamento troca junto.
- **Efeito:** mostra várias obras na primeira tela sem rolagem e dá ritmo. O gesto é familiar a quem chega pelo
  Instagram. Como as frases dizem a mesma coisa com outras palavras, a troca de texto não acrescenta informação.

### Foto cheia como palco de frase gigante

- **Onde:** home ("We shape space into purpose").
- **Como funciona:** foto mais alta que a tela, com parallax, e uma frase de três linhas centralizada em branco por cima,
  com o CTA no meio e parágrafos no pé da foto.
- **Efeito:** pausa dramática e troca de assunto. A foto não é apresentada como projeto, é ambiente.

### Grade em zigue-zague sem legenda, com chip que segue o cursor

- **Onde:** home (3 projetos) e Journal (4 posts). Variação com o nome embaixo em `/projects`.
- **Como funciona:** duas colunas com fotos de alturas diferentes, desencontradas. No hover, a foto encolhe dentro de
  uma moldura preta e um botão "Explore Project" acompanha o mouse.
- **Efeito:** mostra o trabalho grande e deixa a foto falar. Na home, o visitante não sabe qual casa está vendo nem
  onde ela fica.

### Galeria de projeto só de imagem, em ritmo fixo

- **Onde:** página de projeto (Festal Hill).
- **Como funciona:** uns 12 quadros de fora para dentro (fachada, sala, cozinha, quarto, banheiro), alternando largura
  total e pares lado a lado, com margem branca constante. Cada foto entra com uma cortina preta.
- **Efeito:** leitura de "passeio pela casa" sem texto. O ritmo largo/par evita a monotonia. Sem legenda, não dá para
  saber o que foi decisão do escritório e o que já estava lá.

### Objetos de mesa de escritório sobrepostos

- **Onde:** home inteira, formulário, rodapé e Journal.
- **Como funciona:** recortes fotográficos de objetos reais (papel, clipe, régua, lápis, borracha, bilhete manuscrito)
  invadem a borda das seções e se sobrepõem a fotos e títulos. A folha do formulário cobre parte do título; o bilhete
  preso por prendedor fica por cima da foto do rodapé; a régua e o lápis saem pela margem.
- **Efeito:** é o elemento-assinatura do site. Uma metáfora de prancheta e de briefing em papel que quebra a grade e dá
  mão humana a um layout frio em preto e branco.

### Foto pequena dentro de linha numerada

- **Onde:** home, "Our areas of expertise".
- **Como funciona:** cada serviço tem uma foto de cerca de 400x240 ao lado do texto, sob um numeral cinza gigante.
- **Efeito:** a imagem ilustra e não protagoniza; o número e a frase carregam a hierarquia.

### Foto de obra no lugar do rosto do cliente

- **Onde:** depoimentos da home.
- **Como funciona:** a foto grande e a miniatura em P&B ao lado do nome são fotos de projeto, não da pessoa.
- **Efeito:** amarra o depoimento a uma casa, mas tira a verificabilidade: não há rosto nem link para o projeto daquela
  pessoa.

### Saturação forçada por CSS

- **Onde:** capas de projeto na home e no índice.
- **Como funciona:** `filter: saturate(1.5)` a `saturate(2)` aplicado nas imagens.
- **Efeito:** céu mais azul e madeira mais laranja. A foto parece mais bonita do que a obra é.

---

## Informação: o que tem e o que falta

**Tem:**

- Serviços em três frentes: arquitetura residencial (casas novas), reformas e interiores. Na home são Interior
  Atmosphere, Contemporary Homes e Landscape Integration, com os textos de duas delas trocados.
- Princípios de projeto (4): Clarity, Material Honesty, Connection to Place, Long-Term Living.
- Processo em 5 etapas, em texto corrido, sem nome de etapa.
- Equipe: 6 pessoas com foto, nome e cargo.
- Depoimentos: 4, com o nome do cliente e a família ou empresa, sem rosto.
- Ficha de projeto mínima: local (Hampshire), tipo (Home), ano (2023) e um parágrafo.
- Portfólio: 5 projetos nomeados (Festal Hill, Meadow House, Bracken House, Grange Farm, Rosewood View).
- Journal: 4 posts com autor, cargo, data e tempo de leitura.
- Contato: e-mail, telefone clicável e endereço com link de mapa (só no rodapé e no menu).
- Formulário de briefing: nome, e-mail, tipo de projeto, local, prazo e descrição.
- Páginas legais: privacidade, termos, cookies.

**Falta:**

- Preço, forma de cobrança ou como se contrata (por etapa, por pacote).
- Prazo médio de projeto ou de obra.
- Área de atuação geográfica explícita: o endereço só aparece no rodapé.
- Registro profissional (ARB/RIBA) e formação da equipe.
- Ano de fundação, anos de experiência, número de projetos entregues.
- Prêmios e imprensa.
- Ficha completa de projeto: área em m², escopo do escritório (projeto, obra, interiores?), desafio do cliente,
  orçamento, fotógrafo.
- Antes e depois, plantas e desenhos técnicos.
- Nome e entregável de cada etapa do processo.
- Perguntas frequentes.
- WhatsApp, Instagram e redes sociais.
- H1 e H2 no código: os títulos são `div`, o que pesa em SEO e em acessibilidade.

---

## Navegação e conversão

- **Menu:** 3 itens (Projects, Studio, Journal), centralizado e fixo. No celular vira o texto "Menu".
- **Botão Contact:** preto, fixo no canto superior direito em todas as páginas. Não troca de página: abre uma gaveta com
  o formulário por cima do site escurecido.
- **CTAs ao longo da home:** "View Projects" no hero, "Explore studio" na foto-manifesto, o chip "Explore Project" que
  segue o cursor nos projetos, "View Posts" e "Read" no Journal.
- **O formulário fecha tudo:** o "Spatial Brief Intake" (6 campos numerados) aparece antes do rodapé na home, em
  `/projects`, na página de projeto e em `/studio`. Todo caminho termina nele.
- **A página de projeto não é beco sem saída:** fecha com "Explore more projects like this", que leva a outros dois
  projetos antes do formulário.
- **O que não há:** WhatsApp, chat, telefone ou e-mail em destaque no topo. Telefone e e-mail ficam só no rodapé e no
  menu.

---

## O que copiar

### Contato como ação, não como página

- **Como é feito:** o botão Contact do cabeçalho fixo abre o formulário numa gaveta por cima da página escurecida, em
  qualquer ponto da rolagem.
- **Por que funciona:** quem decide escrever no meio de um projeto não perde o lugar onde estava, e o botão é o único
  elemento preto da barra, então nunca some no layout.

### Toda página termina no mesmo formulário de briefing

- **Como é feito:** o mesmo bloco antes do rodapé na home, no índice, no projeto e no Studio.
- **Por que funciona:** não existe fim de página sem próximo passo. Quem rolou até o fim é o visitante mais
  interessado, e ele encontra a conversa ali, sem procurar.

### Formulário que qualifica antes da primeira conversa

- **Como é feito:** tipo de projeto, local e prazo em campos próprios, numerados de 01) a 06), numa folha de papel com
  clipe e o cabeçalho "Spatial Brief Intake".
- **Por que funciona:** o escritório sabe, antes de responder, se o pedido é dele e se cabe na agenda. A forma de ficha
  de briefing muda a leitura de "cadastro" para "começo de projeto".
- **Copy:** "01 SPATIAL BRIEF INTAKE"

### Linha de ficha acima do título do projeto

- **Como é feito:** "Hampshire · Home · 2023", três dados sem rótulo numa linha curta acima do nome gigante.
- **Por que funciona:** responde onde, o quê e quando antes de qualquer texto. É a tríade de metadados do
  `00-anatomia.md` (local, setor, serviços) na forma mais enxuta possível. O erro do Storey é parar aí: nem o índice nem
  a home levam essa linha.

### Página de projeto que conta a casa pela foto

- **Como é feito:** foto cheia com a ficha, um parágrafo, e uma galeria de fora para dentro em ritmo largo/par, sem
  texto entre as fotos.
- **Por que funciona:** a ordem fachada, área social, área íntima imita a visita; o ritmo largo/par evita a monotonia sem
  pedir layout novo a cada foto.

### Fim de projeto com outros projetos antes do contato

- **Como é feito:** "Explore more projects like this" com duas capas e "View Projects", depois o formulário.
- **Por que funciona:** o visitante encadeia uma obra na outra, e quem não quer escrever ainda tem para onde ir.

### Manifesto em dois parágrafos: crença e método

- **Como é feito:** logo depois do hero, duas colunas curtas: uma diz no que acreditam, a outra como trabalham.
- **Por que funciona:** separa a filosofia do jeito de trabalhar sem virar um "sobre" longo. Cada parágrafo tem 3 a 4
  linhas.

### Poucos componentes, reaproveitados com outra função

- **Como é feito:** as barras de progresso servem ao hero, aos depoimentos e às áreas de atuação; a linha numerada serve
  aos serviços (cinza, na home) e aos princípios (preta, no Studio).
- **Por que funciona:** o visitante aprende o gesto uma vez e o site parece um sistema, não uma coleção de seções.

### Elemento-assinatura tirado do material do ofício

- **Como é feito:** papel, clipe, régua, lápis e bilhete manuscrito recortados em foto, sobrepostos às bordas das seções.
- **Por que funciona:** a metáfora é do próprio trabalho (prancheta, briefing), não decoração emprestada, e é uma
  ousadia só, repetida, como pede o `00-anatomia.md`.

---

## Tipografia e cor

- **Famílias (medidas no código):** **New Grotesk** (grotesca) para títulos e corpo; **New Grotesk Mono** para os
  rótulos (a numeração do formulário "01)", o nome da família no depoimento, o pé da folha "ST / CTF"); **Biro**
  (manuscrita) só no bilhete "Calm homes, lasting design". A licença dessas fontes não foi conferida: antes de usar
  qualquer uma, passar pela checagem de licença do `kit-tipo`.
- **Escala:** corpo base de 16px (medido). *Aparentes, sem medida:* títulos em torno de 100px, peso regular, entrelinha
  justa e em sentence case (só a primeira letra maiúscula); parágrafos de corpo grandes (cerca de 22px) em colunas
  estreitas. O contraste entre título e corpo vem do tamanho, não do peso.
- **Cor (aparente, não medida):** preto e branco puros, alternando seções; cinzas claros (por volta de `#eee` e
  `#d9d9d9`) nas linhas empilhadas de serviço; textura de papel no formulário e nos bilhetes.
- **Quantos acentos de verdade:** nenhum. A cor vem toda das fotos, e o CSS ainda reforça com `saturate(1.5)` a
  `saturate(2)`.
- **Botões:** retangulares, sólidos, pretos ou brancos, com o círculo pontilhado do logo como ícone.

---

## O que serve à Débora Reis

### A diferença de propósito, antes de copiar qualquer coisa

O Storey é um escritório de 6 pessoas que vende clima para quem vai construir ou reformar casa de alto padrão no Reino
Unido, e o site dele aposta que a foto basta. A Débora é **uma profissional só**, que faz projeto de interiores,
acompanhamento de obra e decoração de apartamento em Salvador, e o cliente dela chega com perguntas de viabilidade
(quanto tempo, quanto custa, ela vai à obra?). Por isso do Storey se aproveitam **o mecanismo de conversão** (contato a
um toque, todo caminho terminando no contato, pergunta que qualifica, ficha acima do projeto, fim de projeto com
saída) e se deixa de lado **o regime de imagem da home** (foto sem dizer o que é) e **a magreza de informação**.

**O propósito do site dela, visto por este teardown:** mostrar apartamentos reais dela com o que foi feito em cada um,
deixar o processo concreto o bastante para tirar o medo da reforma, provar que ela é de verdade e de confiança com o que
dá para conferir (formação, registro, endereço) e levar ao WhatsApp com a conversa já qualificada. O Storey ensina a
segunda metade dessa frase e serve de contraexemplo para a primeira.

### O que aproveitar, e como, conferido no esboço

> Conferido em 15/10/2026 no `index.html`, `projetos.html`, `projeto-rio-vermelho.html`, `conte-sua-casa.html`,
> `assets/casa.js` e `assets/estudio.css` de `clientes/_prototipos/debora-reis/site/`. Onde o esboço já resolve, fica
> dito; onde falta dado, o dado vem dela ou vira `[FALTA]`.

1. **Linha de ficha acima do título, também no índice.** O Storey só põe a ficha dentro do projeto; o certo é levá-la
   para onde o visitante escolhe.
   - **No esboço hoje:** `projetos.html` já está à frente do Storey: cada apartamento tem ficha (Rio Vermelho: bairro, o
     que mudou, fotógrafo; Colorir: "O que é: Reforma residencial", o que tem nele; Aconchego: o que tem nele,
     fotógrafo). No carrossel da home, só o Rio Vermelho tem a linha de lugar ("Rio Vermelho, Salvador"); Colorir e
     Aconchego têm uma nota à mão no lugar. O que falta é o que o cliente dela mais quer saber, o escopo:
     `[FALTA: ano, metragem e escopo (projeto, obra, decoração) de cada apartamento, dados pela Débora]` e
     `[FALTA: bairro do Colorir e do Aconchego, se ela quiser dizer]`.
2. **Serviços numerados, só se a sequência for real.** No Storey o numeral é decorativo (interior, casa e paisagem não
   são etapas). No caso dela a sequência existe: projeta, acompanha, decora.
   - **No esboço hoje:** os três serviços aparecem como rótulo à mão na capa ("projeto, obra e decoração") e como as
     etapas numeradas de "Como trabalho" ([ 01 ] a [ 04 ]). Isso já faz, numa seção só, o trabalho das três linhas de
     serviço e do Process do Storey. **Não vale abrir uma seção de serviços separada:** seriam duas seções dizendo a
     mesma coisa (o `00-anatomia.md` lista isso no "que quase sempre sobra"). A pergunta que sobra é se dá para
     contratar uma etapa só: `[FALTA: se a Débora aceita só a decoração ou só o projeto, sem a obra]`.
3. **Processo com nome, número e entregável, que o Storey não tem.**
   - **No esboço hoje:** as 4 etapas têm nome e número, e a 02 já nomeia o entregável ("O caderno que a obra segue:
     plantas construtivas, de gesso, de paginação de revestimentos e com os pontos elétricos e luminotécnicos"). Faltam
     o prazo de cada etapa e a frequência das visitas de obra. O guia do cliente tem prazos, mas com a etiqueta
     "Demonstração" (`CLAUDE.md` do esboço): `[FALTA: prazo de cada etapa e de quanto em quanto tempo ela vai à obra,
     dados pela Débora]`.
4. **Manifesto em crença + método.**
   - **No esboço hoje:** já está, dividido entre duas seções: a crença em "Nunca a mesma casa duas vezes" ("Reforma de
     apartamentos pensada a partir de quem mora ali: os livros, os discos, o artesanato, os bichos.") e o método em
     "Como trabalho". Nada a mudar.
5. **Página de projeto em que a foto conta a casa, com o antes que o Storey não mostra.**
   - **No esboço hoje:** o Rio Vermelho já passa do Storey: ficha, números sobre a foto com o que mudou e capítulos (o
     que mudou, as cores, a luz, os objetos), com a fala dela tirada das legendas do Instagram. O argumento que falta
     para quem reforma é o estado de antes: `[FALTA: fotos ou planta de antes do Rio Vermelho, se ela tiver]`.
6. **Fim de projeto com saída.**
   - **No esboço hoje:** já está. O Rio Vermelho fecha com "Próximo apartamento: Colorir", "Ver todos os projetos" e
     "Quer um apartamento pensado assim?", com "Conte a sua casa" e o WhatsApp. As outras cinco páginas de projeto
     também têm o link para "Conte a sua casa" e para o WhatsApp.
7. **Pergunta que qualifica, como o "Project type" do Storey.**
   - **No esboço hoje:** "Conte a sua casa" já cobre o local (bairro, opcional) e o prazo ("Pra quando é esse sonho?":
     o quanto antes, 3 meses, este ano, só sonhando), e vai além do Storey com os cômodos e a metragem. **O que não
     pergunta é o que a pessoa quer contratar** (só o projeto, projeto e acompanhamento, a decoração). É o equivalente
     direto do "Project type" e cabe como uma opção a mais na pergunta 5 ou 6, sem aumentar o número de perguntas.
     Depende do item 2: só faz sentido oferecer "só a decoração" se ela aceitar.
8. **Contato a um toque, em qualquer ponto.** O mecanismo do botão Contact do Storey, com o canal certo para Salvador.
   - **No esboço hoje:** já está, e melhor: o cabeçalho fixo tem "Conversar", que abre direto o WhatsApp, e o menu traz
     o endereço do escritório e o número. O cabeçalho do esboço ganha fundo ao rolar (`.cab.solido` no CSS), o que evita
     a sobreposição do menu ao texto que se vê no Storey.
9. **Depoimento amarrado a uma obra.** A ideia de ligar a citação ao apartamento é boa; a execução do Storey (foto de
   obra no lugar do rosto, sem link) não.
   - **No esboço hoje:** não há depoimento, e está certo não haver enquanto não existir um real. Depoimento aparece como
     uma das contrapartidas possíveis na decisão pendente da permuta (`CLAUDE.md` do esboço). Se vier, entra com o nome
     autorizado e o link para o apartamento correspondente: `[FALTA: depoimento real de cliente, com autorização e o
     apartamento a que se refere]`.
10. **Imagem sobreposta que mostra trabalho, mas que funciona no celular.** É o padrão que o Marcelo citou, e o Storey
    mostra como ele falha.
    - **No esboço hoje:** "Nunca a mesma casa duas vezes" já faz a sobreposição (cinco fotos flutuando em velocidades
      diferentes em volta do título) e corrige os dois defeitos da revoada do Storey: cada foto tem a etiqueta à mão
      sempre visível ("a mesa vermelha", "o corredor do Rio Vermelho", "a cerâmica feita à mão"), e nada depende de
      hover. Manter assim.
11. **Elemento-assinatura do material do ofício.** A lição do Storey é usar o material real do trabalho para quebrar a
    grade.
    - **No esboço hoje:** a assinatura já existe e é dela: a anotação à mão sobre as fotos e os desenhos em traço (a
      estante dos gatos, a parede do rodapé com a cota "sob medida"). Acrescentar os objetos recortados do Storey seria
      uma segunda ousadia, e o `00-anatomia.md` pede uma só. Se um dia entrar objeto físico, só em foto dela, nunca de
      banco: `[FALTA: foto do caderno de projeto e das amostras de revestimento dela, se ela quiser mostrar]`.
12. **Conteúdo que responde dúvida de reforma.** O Journal do Storey repete os valores da marca; o que serve à Débora é a
    dúvida real do cliente.
    - **No esboço hoje:** não há blog, e não precisa: o FAQ tem 4 perguntas (o que recebo, se ela acompanha a obra, onde
      atende, como começa) e o rodapé leva ao "Diário no Instagram". O `00-anatomia.md` pede 8 a 10 perguntas em
      serviço; as que faltam são as de viabilidade (quanto tempo leva uma reforma de apartamento, quanto custa, o que dá
      para mudar), e a resposta tem que ser dela: `[FALTA: respostas da Débora sobre prazo, valor e o que dá para mudar
      em apartamento]`.

**O que o Storey não tem e o site da Débora precisa ter (conferir no esboço):**

- **Registro profissional.** Não visto no `index.html` (a formação "Arquiteta e urbanista, UFBA" está na seção "A
  arquiteta"): `[FALTA: número do CAU]`.
- **Cidade e bairro desde o topo.** O Storey esconde o endereço no rodapé. No esboço, "Salvador" já está no subtítulo da
  capa e o endereço da Barra está no menu, na seção "A arquiteta", no FAQ e no rodapé.
- **Fato verificável perto da capa.** O Storey não tem nenhum. O esboço tem "desde 2004" no subtítulo da capa e no
  rótulo de "Nunca a mesma casa". Número de obras entregues não aparece: `[FALTA: quantos projetos ela já entregou, se
  tiver a conta]`.
- **Títulos semânticos.** O Storey usa `div` em todos os títulos. O esboço já usa `h1`, `h2` e `h3`.

**Um teste que o Storey reprova e que vale para o esboço:** "calm", "considered" e "material honesty" aparecem em quase
toda seção dele e serviriam a qualquer escritório. No esboço, a frase que passa no teste "eu chegaria aqui em qualquer
cliente do segmento?" é a que tem coisa dela (os livros, os discos, a estante dos gatos, o corredor do Rio Vermelho). A
que mais se aproxima do genérico é o H1 ("Casas com história. Interiores com identidade."), questão já registrada no
teardown da [Tecnoarreda](tecnoarreda.md).

---

## O que não copiar

- **Foto de obra gerada ou alterada por IA.** Os arquivos se chamam `new-chat-image-upscaled` e
  `projectsaltered/upscaled` (hipótese tirada do código, não confirmada). Viola a regra da casa: IA nunca no objeto que
  o cliente vende. Para a Débora, só foto real dos apartamentos dela.
- **Filtro de saturação na foto do portfólio.** Vende uma obra mais bonita do que ela é. Se as fotos do Instagram ficam
  suaves em tela cheia, a saída é pedir os originais ao fotógrafo (pendência já registrada no `CLAUDE.md` do esboço),
  não mexer na cor.
- **Portfólio que só aparece no hover e precisa de GIF tutorial.** No celular as fotos nunca aparecem, e o público da
  Débora vai abrir pelo celular, vindo do Instagram ou do WhatsApp.
- **Índice e destaques de projeto sem local, tipo e escopo.** Na home do Storey ninguém sabe que casa está vendo.
- **Copy intercambiável.** "Calm", "material honesty" e "considered" se repetem em quase toda seção, e as frases do hero
  dizem a mesma coisa. Reprova no teste "eu chegaria aqui em qualquer cliente do segmento?".
- **Erros de conteúdo sem revisão:** textos de serviço trocados, "archiecture", CEP do endereço diferente do link do
  mapa. Num escritório que vende cuidado com o detalhe, erro de digitação é contraprova.
- **Formulário oferecendo Commercial e Hospitality num site que só mostra casa.** Confunde o posicionamento.
- **Depoimento com foto de obra no lugar do rosto e sem link para o projeto da pessoa.** Fica inverificável.
- **Processo sem nome de etapa, sem entregável e sem prazo.** A seção existe e não responde a pergunta dela.
- **Numeral gigante em lista que não é sequência.** Vira o índice decorativo que o `90-antipadroes.md` proíbe.
- **Menu fixo sem fundo,** que se sobrepõe ao texto do corpo.
- **Títulos como `div`, sem H1 nem H2.** Perde SEO e leitura por leitor de tela.
- **Telefone e endereço escondidos no rodapé.** Para escritório local, cidade e bairro precisam aparecer no topo.
- **Slideshow de hero com troca automática de frase.** Se a frase muda, o visitante que leu a primeira perde a segunda;
  se todas dizem o mesmo, a troca é ruído.

---

## Aplicado onde

Ainda não. Estudado em 15/10/2026 para o esboço da Débora Reis (`clientes/_prototipos/debora-reis/`). Candidatos à
aplicação, todos dependendo de dado dela: completar a ficha dos apartamentos com ano, metragem e escopo; acrescentar ao
"Conte a sua casa" a opção do que a pessoa quer contratar (se ela aceitar contratação por etapa); pôr prazo e frequência
de visita nas etapas de "Como trabalho"; e aumentar o FAQ com as perguntas de viabilidade, com as respostas dela.
Preencher quando acontecer, com a adaptação feita.

Prints (27 telas, somem com a sessão):
`/tmp/claude-0/-home-user-HorusOS-Pro/ada53c37-1efb-518e-8aec-f8416f2ef82e/scratchpad/ref/storey-architecture/`
