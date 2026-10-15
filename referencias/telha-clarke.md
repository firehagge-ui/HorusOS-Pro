# Teardown: Telha Clarke (arquitetura e interiores, Melbourne)

- **URL:** https://telhaclarke.com.au/
- **Segmento:** arquitetura e design de interiores. Escritório médio (29 nomes na lista da equipe) em South Yarra,
  Melbourne, que atende residencial, multirresidencial, hotelaria, comercial e terceira idade. Fala ao mesmo tempo com
  incorporadora (torres, multirresidencial) e com dono de casa.
- **Estudado em:** 15/10/2026, com o Playwright: home completa até o rodapé a 1440x900 e a 390x844, incluindo a
  abertura (loader); `/works/` em grade e em lista (com hover); a página de projeto `/work/daylesford-hill-house/`
  inteira; `/studio/` e `/process/` inteiros; `/contact/`. **Não vistos:** o painel de Filtros de `/works/` (o clique
  não abriu no navegador headless; as categorias foram lidas no texto da página) e o menu do celular aberto.
- **Tipo de site:** site de estúdio feito por designers de Awwwards (Thomas Monavon e Grégory Lallé, "Website by TM &
  GL" no rodapé), em WordPress com rolagem virtual, loader e vídeo. Na vitrine é site de galeria premiada; no conteúdo,
  é um escritório que vende para incorporadora e para cliente particular.
- **Nota:** 7/10. Como referência de ordem da home, de página de projeto e de prova conferível, vale muito. Como site
  que recebe contato, é fraco: o pedido só aparece no rodapé da home e a página de contato não tem formulário.
- **Contexto:** estudado a pedido do Marcelo para o site da Débora Reis (`clientes/_prototipos/debora-reis/`), no lote
  de sites do Awwwards que ele pediu além dos três que mandou (normalisboring.es, tecnoarreda.it, stanzza.design). Entra
  como referência de **estrutura com propósito** (o que cada seção responde) e de **tratamento de imagem**, não de
  conversão.

**Em resumo:** a home funciona como um argumento em ordem: quem somos numa frase, três projetos escolhidos, o volume
(31 obras), no que acreditamos, como trabalhamos (7 etapas) e o contato. A prova não vem de depoimento: vem de ficha
de projeto, de prêmio e de matéria de imprensa, cada uma com link para a fonte. O trabalho principal do site é
transmitir rigor e porte ("do conceito à entrega da obra") e levar o visitante a abrir um projeto. Converter não é o
foco: o contato fica no rodapé e a página de contato só tem e-mail, telefone e endereço.

---

## Estrutura, na ordem

### A lógica da home, em uma tabela

Cada seção responde à dúvida que a anterior cria. Lida assim, a home vira régua: seção que não responde a nenhuma
pergunta pode sair, e pergunta sem seção é o que falta.

| Ordem | Seção | A pergunta que ela responde |
|---|---|---|
| 0 | Abertura (loader) | Quem é e onde fica? (antes de qualquer imagem) |
| 1 | Hero em vídeo | Qual é o tom? (não diz o que fazem) |
| 2 | 01 Studio | Quem são, onde ficam, o que fazem e para quem? |
| 3 | 02 Selected Works | Já fizeram algo do meu tipo? Com que critério escolhem? |
| 4 | All Work (31) | Quanto já fizeram? |
| 5 | 03 Vision | No que acreditam, além de fazer bonito? |
| 6 | 04 Method | Fazem tudo, do conceito à obra entregue? |
| 7 | Rodapé com o pedido | Como eu falo com eles? |

E as páginas internas, cada uma com uma pergunta só:

| Página | A pergunta que ela responde |
|---|---|
| `/works/` | Tem obra parecida com a minha, no meu tipo de imóvel? |
| Projeto | Como eles pensam um caso concreto? |
| `/studio/` | Quem são as pessoas, e quem reconheceu o trabalho? |
| `/process/` | São sérios? Têm certificação, registro, governança? |
| `/contact/` | Atendem onde eu estou? |

**A pergunta que nenhuma página responde:** *como começa?* Não há primeira reunião, visita, briefing nem o que o
cliente precisa levar.

### Home

**0. Abertura (loader).**

- **Mostra:** tela preta com três colunas de microtexto no topo ("Design studio / Architecture & interior", "South
  Yarra / Australia", "Loading 58%... 100%"). O logotipo TELHA CLARKE se monta no centro, com as metades das letras
  deslizando. Depois um painel branco sobe, o logotipo fica numa faixa preta no topo e a página aparece por baixo.
- **Para quê:** carimbar a assinatura (o logotipo largo) e dizer disciplina e lugar antes de qualquer imagem. Para o
  visitante, na prática é espera: uns 4 a 5 segundos, porque o loader aguarda um vídeo de 55 MB.
- **Como é montada:** tela cheia preta, logotipo centralizado ocupando a largura toda, contador de porcentagem. A
  transição é uma cortina: o painel branco sobe e o logotipo encolhe para a faixa.
- **Imagem:** nenhuma. É só tipografia.
- **Copy:** "Design studio / Architecture & interior · South Yarra Australia · Loading 100%"

**1. Hero (vídeo em janela que vira tela cheia).**

- **Mostra:** a navegação (Work, Process, Studio · relógio "11:04 AM" · South Yarra, AUS · Contact). No centro, um
  vídeo de obra (colunas, fachada, drone) dentro de uma janela vertical estreita. Embaixo à direita, a frase de
  posicionamento; embaixo à esquerda, "[Scroll down]".
- **Para quê:** dar o tom (história, contexto, cultura) e mostrar arquitetura em movimento sem explicar nada. A janela
  pequena que cresce cria a sensação de entrar no trabalho. O hero **não diz o que o escritório faz**: isso fica para a
  seção seguinte.
- **Como é montada:** no primeiro scroll a janela do vídeo se expande até sangrar a tela, e o logotipo grande da faixa
  preta encolhe para a marca pequena no canto da navegação. Uma frase, em duas linhas, no canto. Sem botão.
- **Imagem:** vídeo sem legenda, em recorte vertical no estado inicial (cerca de 560px de largura num quadro de 1440px)
  e horizontal em tela cheia depois do scroll. Não diz de qual projeto é.
- **Copy:** *"Driven by History, Centered on Context, Embracing Culture"*

**2. 01 Studio (quem somos em uma frase).**

- **Mostra:** o rótulo "01 STUDIO". Primeiro o Acknowledgement of Country (reconhecimento aos povos aborígenes, norma
  cultural australiana), com uma foto pequena vertical no canto esquerdo. Depois a frase-tese em corpo grande (72px,
  medido). Por fim, duas colunas: o rótulo "Architecture & Interior Design" e um parágrafo com as tipologias
  (residencial, multirresidencial, terceira idade, estudantil, habitação social, hotéis, hospitalidade, escritórios).
- **Para quê:** responder em um scroll a "quem são, onde ficam, o que fazem e para quem". A frase grande põe juntos
  local, disciplina e escopo. A lista de tipologias deixa cada tipo de cliente se reconhecer.
- **Como é montada:** grade de 12 colunas. A primeira linha da frase grande começa recuada (cerca de 4 colunas). O
  rótulo numerado fica pequeno à esquerda e o texto corrido em coluna estreita à direita. A pílula flutuante embaixo,
  no centro, mostra "Studio · Discover +" e leva a `/studio/`. Há marcas de corte, como numa prancha de desenho, nos
  cantos das seções.
- **Imagem:** uma foto pequena (cerca de 225x270px), vertical, de detalhe de concreto, sem legenda. Acompanha o texto
  como respiro, não como prova.
- **Copy:** *"Telha Clarke is a Melbourne based Architecture & Interior Design studio, designing various project
  typologies across Australia and Internationally."* e *"We believe human touch must drive creativity."*

**3. 02 Selected Works (três projetos escolhidos).**

- **Mostra:** um cabeçalho em linha, "SELECTED WORKS · 02 · 17 - 25'" (o período dos trabalhos). Depois, três projetos
  em sequência (Grange Road, Southbank Tower, Daylesford Hill House), cada um com o nome em cerca de 100px entre
  colchetes, uma foto embaixo e uma linha de legenda com tipologia e ano (ou "Coming Soon").
- **Para quê:** curadoria. Em vez de despejar o portfólio, escolhem três que cobrem o leque: um multirresidencial em
  andamento, uma torre e uma casa premiada. O nome em letra enorme trata cada obra como título de capítulo, e a
  legenda curta dá só o necessário para classificar.
- **Como é montada:** uma obra por vez, centralizada. Com o scroll, os colchetes se afastam para as bordas e a foto
  cresce (de cerca de 485px para cerca de 680px de largura), como um zoom que acompanha a rolagem. A pílula troca o
  rótulo para o nome da obra visível ("Southbank Tower · Discover +") e leva ao projeto. No celular, nome, foto e
  legenda vão empilhados.
- **Imagem:** uma foto por projeto, horizontal, centralizada, sem texto sobre ela. A identificação está no título acima
  e na legenda abaixo. As imagens de Grange Road ("Coming Soon") e de Southbank Tower (2019) parecem render ou obra
  não concluída (*aparente*), e nada no site marca o que é render.
- **Copy:** "[ Daylesford Hill House ] · Residential · 2025"

**4. All Work (31) (nuvem de imagens).**

- **Mostra:** o link "All Work (31)" sublinhado, preso no centro da tela, enquanto 19 fotos de obras diferentes passam
  por cima e por baixo dele: exteriores, cozinhas, detalhes de material, uma torre. Nenhuma tem legenda.
- **Para quê:** mostrar volume e variedade sem pedir leitura. Depois da curadoria de três, prova que existem 31, e
  serve de ponte visual para o portfólio. O único alvo de clique é o título: **as fotos não são links** (conferido no
  DOM: 19 imagens, 0 com link).
- **Como é montada:** o título é sticky (topo 0, altura de uma tela). As fotos ficam numa grade de 12 colunas
  deslocada, em três tamanhos (`data-size` small, medium e large), algumas com 40% de opacidade, e rolam em velocidades
  diferentes (parallax), então se sobrepõem ao título e entre si. No print `home-10.png`, uma delas passa por cima da
  navegação e cobre o "Studio". No fim, uma das fotos cresce até ocupar a tela e vira o fundo da seção seguinte, sem
  corte entre as duas.
- **Imagem:** é o padrão que o Marcelo descreveu: imagens se sobrepondo, sem legenda, só para mostrar o trabalho.
  Proporções verticais e horizontais misturadas, de cerca de 105px a 340px de largura, algumas desbotadas para criar
  profundidade.
- **Copy:** "All Work (31)"

**5. 03 Vision (três valores sobre foto fixa).**

- **Mostra:** uma foto em tela cheia, escurecida (árvore e fachada de vidro canelado), parada. Por cima, três palavras
  grandes deslizando na horizontal: "Design integrity", "Innovation", "Enhanced living". A ativa fica branca e as
  próximas, transparentes. À direita, um parágrafo que muda conforme o valor ativo. Uma linha fina atravessa a tela com
  "03" e "VISION".
- **Para quê:** dizer no que o escritório acredita sem virar bloco de texto. Cada valor tem um parágrafo próprio que o
  torna concreto (processo e briefing detalhado; pesquisa e tecnologia; bem-estar de quem vai usar o espaço). Para o
  negócio, separa o escritório de "só fazer bonito".
- **Como é montada:** seção presa (pinned). A rolagem vertical move a faixa de palavras na horizontal e troca o
  parágrafo, em três estados. O fundo é a mesma foto que cresceu da nuvem anterior.
- **Imagem:** uma foto só, em tela cheia, com véu escuro para o texto branco ficar legível. Sem legenda. É clima, não
  projeto identificado.
- **Copy:** *"We believe enhanced user experience and well-being should be at the forefront of design."*

**6. 04 Method (as 7 etapas numa frase só).**

- **Mostra:** as sete etapas escritas como uma frase corrida em corpo grande, separadas por "/" e numeradas em
  sobrescrito: Schematic Design (01) / Development & Town Planning Applications (02) / Design Development (03) /
  Marketing (04) / Interior Design (05) / Construction Documentation (06) / Contract Administration (07). Uma etapa
  fica preta e as outras, cinza-claro. À direita, uma foto troca conforme a etapa ativa (croqui à mão no 01, maquete ou
  material no 05, obra de concreto no 06). Embaixo, "04 METHOD" e o parágrafo do escopo.
- **Para quê:** provar escopo completo, do conceito à entrega da obra, que é o argumento comercial mais forte para quem
  contrata. A foto de cada etapa mostra que existe trabalho real em cada fase (inclusive canteiro), e não só imagem
  final.
- **Como é montada:** lista em linha, não vertical. Os itens têm a classe `process-item` com `cursor-pointer`, ou seja,
  são clicáveis; nas capturas o destaque avançou sozinho (01, depois 05, depois 06), aparentemente em ciclo. Foto
  vertical à direita (cerca de 340x460px). **Nenhuma etapa tem descrição**, só o nome.
- **Imagem:** uma foto vertical que troca por etapa: desenho, material, obra. É a única seção da home em que a imagem
  documenta processo, e não resultado.
- **Copy:** *"The scope of our Studio covers all stages within Architecture and Interior Design. We offer an end to end
  level of service from early concepts through to practical completion."*

**7. Rodapé com o pedido (cortina com logotipo gigante).**

- **Mostra:** um cartão branco sobre fundo preto. À esquerda, "Talk to us about your project" em cinza claro e
  "Contact us" grande e sublinhado. No centro, o mapa do site (Home, Work, Studio, Process, Contact). À direita,
  endereço (L), telefone (P) e e-mail (C), com rótulos de uma letra. Embaixo: newsletter, "Back to top", Instagram e
  LinkedIn. Por baixo do cartão aparece o logotipo TELHA CLARKE gigante e, depois, a linha legal e os créditos.
- **Para quê:** é o único pedido de contato da home. Junta o que alguém pronto para ligar precisa (endereço, telefone
  clicável, e-mail clicável). O logotipo gigante fecha a página como assinatura.
- **Como é montada:** revelação em cortina: o cartão branco sobe e descobre o logotipo, que clareia do cinza ao
  branco. Três colunas. Os rótulos L/P/C economizam espaço. A pílula flutuante continua com "Vision · Discover", ou
  seja, o rótulo não atualiza para Method nem para o rodapé.
- **Imagem:** nenhuma.
- **Copy:** "Talk to us about your project · Contact us" e "L 59 Garden Street, South Yarra, Victoria, Australia 3141 ·
  P +61 3 8672 5999 · C contact@telhaclarke.com.au"

### Fixo em todas as páginas

**8. Navegação, relógio e pílula contextual.**

- **Mostra:** navegação fixa e transparente sobre a página (marca, Work, Process, Studio, hora local de South Yarra,
  Contact). Embaixo, no centro, uma pílula preta fixa com "<nome do trecho> · Discover +".
- **Para quê:** a pílula é um CTA que acompanha a leitura. O rótulo diz onde a pessoa está e o clique leva ao
  aprofundamento daquele trecho (Studio para `/studio/`, cada projeto para a página dele, All Work para `/works/`). O
  relógio diz "somos daqui e estamos trabalhando agora": é decoração com sinal de lugar.
- **Como é montada:** pílula de cerca de 150x36px, com `data-widget-title` e `data-widget-url` em cada seção. Nas
  páginas internas ela muda de função: "Grid view / List view" em Works, "Back to all works" no projeto e "Let's work
  together" (que leva a `/contact/`) no Studio. No celular, os links viram "Menu".
- **Copy:** "Grange Road · Discover +"

### Works (`/works/`)

**9. Portfólio em grade e em lista.**

- **Mostra:** o título "All Work (31)" e, à direita, "Filters" em cinza grande. Filtros por categoria com contagem:
  Commercial (01), Hospitality (02), Multi-residential (13), Residential (11), Retail (03), Seniors' Living (03). Na
  grade, cada card tem foto, nome, tipologia e ano, e no hover aparece "Open project ↳". Na lista, uma tabela com
  Project / Typology / Type / Location / Date.
- **Para quê:** deixar cada tipo de cliente achar obra parecida com a dele. O filtro com número também mostra onde está
  a experiência (13 multirresidenciais, 11 residenciais). A lista atende quem quer escanear rápido por local e ano.
- **Como é montada:** grade de ritmo variável: linhas de 2, depois 1 em largura total, depois 3, depois 2 com uma
  vertical alta, alternando. Legenda numa linha só, embaixo da foto. Na lista, a linha em hover pinta de ferrugem
  (`#952c16`, amostrado) e uma miniatura da obra flutua junto ao cursor. A pílula alterna entre grade e lista.
- **Imagem:** foto grande, de borda a borda dentro da margem, sem texto por cima, em recortes variados (horizontal
  largo e vertical). A legenda fica sempre fora da imagem. Na lista, a imagem só aparece no hover, como prévia.
- **Copy:** "Grange Road | Multi-Residential | Toorak | Coming Soon"

### Página de projeto (`/work/daylesford-hill-house/`)

**10. Ficha e narrativa por percurso.**

- **Mostra, na ordem:** (1) o nome do projeto grande; (2) uma faixa de ficha com Client: Private · Typology:
  Residential · Year: 2025 · Status: Completed; (3) foto de abertura em largura total; (4) "01 PROJECT DETAILS", com um
  parágrafo-resumo e uma tabela com Country (o povo originário da terra, Dja Dja Wurrung), Discipline e Collaborators
  (o fotógrafo creditado, Timothy Kaye); (5) um par de fotos assimétrico; (6) a citação grande *"Shielding complexity
  behind simplicity."*; (7) de "02" a "06 ABOUT THE PROJECT", parágrafos intercalados com grupos de fotos, contando a
  casa como um percurso (a entrada pela ponte, nove degraus até a cozinha, o jantar como dobradiça, o estar rebaixado,
  o pátio central, os materiais); (8) o cartão "Grange Road · Go to next project", com miniatura; (9) o rodapé.
- **Para quê:** transformar a obra em raciocínio. Cada parágrafo explica uma decisão de projeto e a resposta ao terreno
  ou ao cliente. A ficha responde às perguntas de triagem num relance. A citação dá a ideia central do projeto em uma
  frase. O cartão de próximo projeto evita o beco sem saída.
- **Como é montada:** rótulo numerado à esquerda e texto em meia coluna à direita, sempre. Os grupos de fotos variam (1
  pequena + 1 grande; 1 isolada + 2 lado a lado; 3 lado a lado; 2 largas), o que evita uma grade repetida e faz o ritmo
  acompanhar o texto. A pílula "Back to all works" fica fixa.
- **Imagem:** fotos sem legenda individual. Quem diz o que se vê é o parágrafo vizinho (o texto da cozinha vem junto
  das fotos da cozinha). Mistura plano geral, ambiente e detalhe. O crédito do fotógrafo está na ficha.
- **Copy:** *"With the clients' background in hospitality, the house supports togetherness as an everyday ritual."* e
  *"Nine steps lead to the kitchen, positioned as the social and operational heart of the house with direct engagement
  to the courtyard."*

### Studio (`/studio/`)

**11. Equipe, valores, prêmios e imprensa.**

- **Mostra, na ordem:** a frase "Telha Clarke is a Melbourne based architecture & interior design studio." e um
  parágrafo sobre atendimento "boutique" e "hands-on", com uma colagem de 2 a 3 fotos deslocadas; uma citação grande;
  "01 MEET THE TEAM"; "02 OUR VALUES"; "03 OUR VISION" (os mesmos três valores da home, agora com fotos empilhadas);
  "04 AWARDS", tabela Year / Project / Award / Accolade (de 2023 a 2026, incluindo shortlist e longlist); "05 PRESS",
  tabela Year / Project / Title / Publication (Est Living, Leibal, Archello, The Local Project, Habitus,
  ArchitectureAU).
- **Para quê:** é a página de confiança. Mostra que há pessoas reais por trás e prova reconhecimento externo. **Cada
  linha de prêmio e de imprensa é um link para a fonte** (conferido), então a prova é conferível, não autodeclarada. E
  eles registram até shortlist e longlist, sem inflar.
- **Como é montada:** a equipe é uma lista vertical de 29 nomes em corpo grande e cinza. O nome que passa pelo centro
  da tela fica preto, e um retrato fixo à direita mostra a pessoa, com o cargo entre colchetes ("[ Project Architect
  ]"). Prêmios e imprensa em tabela de 4 colunas agrupada por ano, com filete entre os grupos. A pílula "Let's work
  together" leva a `/contact/`.
- **Imagem:** retratos reais em ambiente externo, verticais (cerca de 340x450px), um de cada vez, trocando com a
  lista. Fotos de obra em tela cheia e em colagem nas seções de valores, sem legenda.
- **Copy:** *"We provide a boutique level of service and a hands-on approach."* e "2026 | Penthouse Vivace | Blum Design
  Awards | Materiality and Detail: Winner"

### Process (`/process/`)

**12. Influências, filosofia, iniciativas e credenciamentos.**

- **Mostra:** a frase de abertura em cinza com quatro termos em preto; depois foto larga, citação, "01 OUR
  PHILOSOPHY", par de fotos, "02 OUR INITIATIVES" (Sustainability Action Plan, Reconciliation Action Plan, Quality
  Management System ISO 9001, 100% Green Power, cada um com texto em duas colunas e um bloco de cor com ícone) e "03
  ACCREDITATIONS" (ISO 9001 e registro nos conselhos de arquitetos de 4 estados).
- **Para quê:** falar com o cliente institucional e com a incorporadora: certificação, plano de sustentabilidade,
  registro profissional. Mostra governança. Para pessoa física, quase nada disso responde "como vai ser o meu
  projeto".
- **Como é montada:** destaque de palavras-chave dentro da frase (o cinza é o tecido; o preto, os quatro fatores). As
  iniciativas são uma lista com filetes e blocos de cor quadrados à direita, em ferrugem `#952c16` ou cinza-sálvia, com
  ícone desenhado. Credenciamentos em duas linhas de título e descrição.
- **Imagem:** fotos de obra em largura total e em par, sem legenda. Os blocos de cor com ícone ocupam o lugar da foto
  onde não existe imagem do assunto (um plano de sustentabilidade não tem fotografia).
- **Copy:** *"Our projects respond to a collection of influences; contextual response, the client's brief, our own
  design aspirations, & user experience."* e "SAP Document available on request."

### Contact (`/contact/`)

**13. Tela única, sem formulário.**

- **Mostra:** fundo cinza-sálvia (`#cacfcb`, amostrado). A frase grande "Based in Melbourne but available for your
  projects in ___" troca a última palavra em ciclo: Queensland, New South Wales, South Australia, Tasmania, Victoria,
  Western Australia, the rest of the World. À direita: BUSINESS (e-mail), PHONE, ADDRESS e uma foto real do escritório
  (pessoa trabalhando no computador, planta em primeiro plano). Embaixo, Instagram e LinkedIn. **Não há formulário**
  (conferido: 0 forms na página).
- **Para quê:** responder à objeção "vocês atendem onde eu estou?" antes que ela vire pergunta. A lista de estados bate
  com os registros profissionais citados em Process. A foto do escritório humaniza e mostra o lugar físico.
- **Como é montada:** uma tela, duas colunas: a frase à esquerda e os dados em grade de rótulo e valor à direita. A
  palavra final é animada.
- **Imagem:** uma foto do escritório, vertical, com desfoque de profundidade, sem legenda. É a única foto de bastidor
  do site.
- **Copy:** *"Based in Melbourne but available for your projects in the rest of the World"*

### Comparando com `_memoria/design/00-anatomia.md`

- **Hero:** a anatomia pede o que é, para quem e o que fazer em três segundos. O hero do Telha só dá o tom; o "o que é"
  chega na seção 01, um scroll depois, e não há CTA no hero.
- **Para quem é:** existe como lista de tipologias (categoria), não como situação em segunda pessoa. Funciona para
  incorporadora, que se classifica pela tipologia; para pessoa física é abstrato.
- **O que fazemos:** as tipologias (seção 01) e as 7 etapas (Method), mas as etapas sem uma linha de descrição.
- **Como começa:** não existe em nenhuma página.
- **Quem faz:** 29 nomes, com retrato e cargo. Faltam formação e biografia dos diretores (Stuart Telha e Tim Clarke só
  aparecem na lista). O registro profissional aparece como registro do escritório em 4 estados (Process).
- **Como é / onde é:** endereço completo e uma foto do escritório. Sem mapa, sem horário.
- **FAQ:** não existe.
- **Contato:** o link Contact no menu e o pedido só no rodapé; a página de contato não tem formulário.
- **Encenar a prova:** é o ponto mais forte. Ficha de projeto, prêmios e imprensa com link para a fonte, foto de
  canteiro e de croqui no Method.
- **Vender o freio:** não existe. Nenhuma objeção é antecipada, exceto a de abrangência geográfica no contato.
- **Elemento-assinatura:** o logotipo largo que se monta no loader e volta gigante no rodapé, com os colchetes nos
  títulos e as marcas de corte de prancha nos cantos das seções.

**A diferença de fundo:** a anatomia organiza a home pelo problema da pessoa. O Telha organiza pelo **argumento sobre o
escritório** (identidade, prova curada, volume, crença, método, contato), ou seja, fala da empresa primeiro. Isso
funciona para quem escolhe escritório por portfólio e porte, como a incorporadora. Para quem vai reformar a própria
casa, faltam as seções que tiram o medo: como começa, quanto tempo leva, o que acontece em cada etapa.

---

## Como as imagens aparecem

O Telha tem **três regimes de imagem**. Na home, a foto entra sem legenda e quase sempre sem link, para dar clima e
volume. Em `/works/`, ganha uma legenda curta, sempre fora da foto. Na página do projeto, volta a não ter legenda, mas
fica ao lado do parágrafo que a explica. E onde não existe foto possível, entra um bloco de cor com ícone. Os padrões,
na ordem em que valem mais para o pedido do Marcelo:

### Nuvem de imagens sem legenda com título fixo (o "uma imagem por cima da outra")

- **Onde:** home, All Work (31) (seção 4).
- **Como funciona:** um título-link fica sticky no centro. 19 fotos de tamanhos diferentes (pequena, média, grande),
  algumas com 40% de opacidade, numa grade de 12 colunas deslocada, rolam em velocidades diferentes e passam por cima e
  por baixo do título. Nenhuma foto tem legenda nem link.
- **Efeito:** mostra volume e variedade num relance, sem pedir leitura: é o "mostrar o trabalho sem dizer o que é".
  Ponto fraco: quem clica numa foto não vai a lugar nenhum, e as fotos a 40% parecem lavadas.

### Grupos assimétricos intercalados com o texto no projeto

- **Onde:** página de projeto (seção 10).
- **Como funciona:** entre os parágrafos numerados, os grupos de fotos mudam de formato (1 pequena + 1 grande, 1 + 2,
  3 lado a lado, 2 largas). Cada grupo fica perto do parágrafo que descreve aquele ambiente.
- **Efeito:** a foto dispensa legenda porque o texto vizinho diz o que ela mostra, e a página se lê como uma visita
  guiada pela casa.

### Título gigante entre colchetes com foto que cresce

- **Onde:** home, Selected Works (seção 3).
- **Como funciona:** o nome do projeto em cerca de 100px entre `[ ]`, com a foto centralizada embaixo. Com a rolagem,
  os colchetes se abrem para as bordas e a foto aumenta (de cerca de 485px para cerca de 680px de largura). Legenda
  mínima (tipologia e ano) numa linha embaixo.
- **Efeito:** cada obra vira um capítulo com nome próprio. Sem texto em cima da imagem, a identificação fica clara e a
  foto, limpa.

### Janela que vira tela cheia

- **Onde:** hero da home (seção 1).
- **Como funciona:** o vídeo começa dentro de um quadro vertical estreito, centralizado, com bastante branco em volta.
  O primeiro scroll expande o quadro até sangrar a tela, enquanto o logotipo grande encolhe para a navegação.
- **Efeito:** sensação de entrar no trabalho, de aproximação. Dá para fazer com foto parada em vez de vídeo, o que
  evita os 55 MB.

### Imagem que vira o fundo da próxima seção

- **Onde:** da nuvem All Work para Vision (seções 4 e 5).
- **Como funciona:** uma das fotos da nuvem cresce até ocupar a tela inteira, é escurecida e passa a ser o fundo fixo
  da seção de valores.
- **Efeito:** costura uma seção na outra sem corte duro. A página parece um percurso contínuo, e não blocos
  empilhados.

### Fundo fixo com palavras que deslizam

- **Onde:** home, Vision (seção 5).
- **Como funciona:** a foto em tela cheia fica parada. A rolagem vertical move na horizontal uma faixa com três
  palavras grandes, e o parágrafo da direita troca junto.
- **Efeito:** três ideias apresentadas uma de cada vez, sem parede de texto, com a imagem dando clima.

### Lista que troca a foto ao lado

- **Onde:** home (Method), Studio (equipe), Works (lista).
- **Como funciona:** uma lista de nomes em cinza onde um item fica preto (por ciclo, por posição de scroll ou por
  hover), e a foto ao lado troca para o item ativo: a etapa do método (croqui, material, obra), a pessoa da equipe
  (retrato e cargo) ou o projeto da tabela (miniatura flutuante e linha em ferrugem).
- **Efeito:** liga texto e imagem um a um sem precisar de um card para cada item. Cabe muita informação numa tela só.

### Grade de ritmo variável com legenda fora da foto

- **Onde:** `/works/` (seção 9).
- **Como funciona:** as linhas alternam 2 colunas, 1 em largura total, 3 colunas, e 2 com uma vertical alta. Nome,
  tipologia e ano numa linha embaixo de cada foto, e "Open project ↳" aparece no hover.
- **Efeito:** evita a monotonia da grade uniforme, e a foto nunca é coberta por texto.

### Bloco de cor com ícone no lugar da foto

- **Onde:** Process, Initiatives (seção 12).
- **Como funciona:** para assuntos sem fotografia possível (plano de sustentabilidade, reconciliação, ISO, energia
  verde), um quadrado em ferrugem ou sálvia com um ícone desenhado.
- **Efeito:** mantém o ritmo visual sem forçar foto de banco.

### Foto de bastidor no contato

- **Onde:** `/contact/` (seção 13).
- **Como funciona:** uma única foto real do escritório (pessoa trabalhando, planta, monitor com planta baixa),
  vertical, ao lado dos dados de contato.
- **Efeito:** humaniza o último passo e prova que existe um lugar físico.

### Observação de integridade

- **Render sem aviso:** Grange Road ("Coming Soon") e Southbank Tower aparecem em Selected Works com imagens que
  parecem render ou obra não concluída (*aparente*), lado a lado com a casa fotografada e premiada, e nada marca o que é
  render. Para a Hórus, render precisa estar marcado como tal.
- **Crédito de foto:** a ficha do projeto credita o fotógrafo (Collaborators: Timothy Kaye, Photography). É a prática
  certa: o visitante sabe quem fez a imagem.
- **Nuvem sem destino:** 19 fotos de obras reais sem nome nem link. O visitante que se interessa por uma delas não tem
  como chegar ao projeto.

---

## Informação: o que tem e o que falta

**Tem:**

- Disciplinas: arquitetura e design de interiores.
- Tipologias atendidas: residencial unifamiliar e multirresidencial, terceira idade, estudantil, habitação social,
  hotéis, hospitalidade, escritórios, varejo.
- Local: South Yarra, Melbourne, com endereço completo; área de atuação por estado australiano e "o resto do mundo".
- Escopo do serviço: 7 etapas nomeadas, do estudo preliminar à administração de contrato ("end to end... through to
  practical completion").
- Portfólio: 31 projetos com filtro por tipologia (com contagem), visão em grade e em lista, e local e ano de cada um.
- Ficha por projeto: cliente (Private), tipologia, ano, status (Completed ou Coming Soon), disciplina, colaboradores
  (fotógrafo creditado) e a terra indígena onde fica.
- Narrativa por projeto: 6 blocos explicando as decisões de projeto, ambiente por ambiente.
- Valores e visão: Design integrity, Innovation, Enhanced living, cada um com parágrafo.
- Filosofia e a frase das quatro influências (contexto, briefing do cliente, aspiração de design, experiência do
  usuário).
- Equipe: 29 nomes com cargo e retrato real.
- Prêmios: tabela de 2023 a 2026, com link para cada fonte, incluindo shortlist e longlist.
- Imprensa: 14 matérias com link para cada publicação.
- Credenciamentos: ISO 9001:2015 e registro nos conselhos de arquitetos de 4 estados.
- Iniciativas: plano de sustentabilidade, plano de reconciliação, gestão de qualidade, energia 100% verde ("documento
  disponível sob pedido").
- Contato: e-mail, telefone (`tel:` clicável), endereço, Instagram, LinkedIn, newsletter.
- Acknowledgement of Country (norma cultural australiana).
- Política de privacidade e termos.

**Falta:**

- Formulário de contato ou qualquer captura além da newsletter (a página de contato tem 0 formulários).
- Como começa um projeto: primeira reunião, visita, briefing, o que o cliente precisa levar.
- Faixa de preço, forma de cobrança ou de honorário.
- Prazo típico por tipo de projeto.
- FAQ.
- Depoimento de cliente: nenhum. A prova social é só prêmio, imprensa e ficha.
- Área (m²) e orçamento de obra na ficha de projeto.
- Antes e depois (pouco relevante em construção nova, mas faria falta em reforma).
- Explicação de cada uma das 7 etapas: só aparecem os nomes, e a página Process não descreve o passo a passo para o
  cliente.
- Horário de atendimento e mapa.
- Biografia dos diretores (Stuart Telha e Tim Clarke só aparecem na lista da equipe, com o cargo).
- Marcação de render versus foto de obra concluída nos projetos "Coming Soon".

---

## Navegação e conversão (testado)

O menu é fixo e mínimo: Work, Process e Studio à esquerda, Contact sozinho à direita (no celular, vira "Menu"). O
relógio com a hora de South Yarra fica no meio, como decoração. A navegação principal dentro da página é a pílula preta
fixa, que troca o rótulo conforme o trecho e leva sempre ao aprofundamento ("Discover +"), **nunca ao contato**, na
home.

| Botão ou link | Onde | O que faz |
|---|---|---|
| Pílula "Studio · Discover +" | home, trecho 01 | leva a `/studio/` |
| Pílula "<projeto> · Discover +" | home, Selected Works | leva à página do projeto visível |
| Pílula "All Work · Discover +" | home, nuvem | leva a `/works/` |
| Pílula "Vision · Discover" | home, de Vision ao rodapé | o rótulo trava: não atualiza para Method nem para o rodapé |
| "All Work (31)" | home, nuvem | único alvo de clique da seção; leva ao portfólio |
| As 19 fotos da nuvem | home | nada (0 de 19 com link) |
| "Contact" | menu, em todas as páginas | página de contato |
| "Contact us", telefone e e-mail | rodapé de todas as páginas | contato; telefone e e-mail clicáveis |
| "Let's work together" | pílula fixa do Studio | leva a `/contact/` (é o único CTA de contato fixo do site) |
| "Grid view / List view" | pílula fixa de `/works/` | alterna a visão |
| "Back to all works" | pílula fixa do projeto | volta ao portfólio |
| "Go to next project" | fim do projeto | abre o próximo projeto (Grange Road, a partir da Daylesford) |
| Formulário | `/contact/` | não existe |

**Na home, o pedido de contato só aparece depois de 8 a 9 telas de scroll.** Ali estão telefone e e-mail clicáveis, e
a página de contato só repete os dados. O projeto termina num cartão de próximo projeto, que mantém o visitante no
portfólio. O site prioriza o percurso pelo trabalho; a conversão é passiva e conta que o visitante qualificado vai
ligar ou mandar e-mail.

---

## O que copiar

### A home como argumento em ordem

- **Como é feito:** quem é (uma frase) → prova curada (3 projetos) → volume (31) → como pensa (3 valores) → como
  trabalha (7 etapas) → contato.
- **Por que funciona:** cada seção responde à dúvida que a anterior cria. Depois de "quem são", vem "já fizeram?";
  depois dos três escolhidos, "quanto já fizeram?"; depois do volume, "e como pensam?". Nenhuma seção está ali por
  estar.

### A frase-tese no primeiro scroll, com local, disciplina e escopo

- **Como é feito:** uma frase em 72px, recuada, logo depois do hero.
- **Por que funciona:** o visitante sabe em cinco segundos se está no lugar certo. Lugar e tipo de trabalho são filtros
  de triagem, e a frase entrega os dois de uma vez.
- **Copy:** *"Telha Clarke is a Melbourne based Architecture & Interior Design studio, designing various project
  typologies across Australia and Internationally."*

### Curadoria de três antes do portfólio inteiro

- **Como é feito:** três obras de perfis diferentes, cada uma com o nome como título de capítulo e só tipologia e ano
  na legenda.
- **Por que funciona:** três escolhidos mostram critério (cobrem o leque de clientes); trinta jogados mostram só
  quantidade.

### Volume depois da curadoria

- **Como é feito:** a nuvem All Work (31), com o número no título.
- **Por que funciona:** depois de ver três, o visitante quer saber se há mais. O número responde sem pedir leitura, e a
  nuvem dá a variedade.

### Método como etapas nomeadas, com uma foto de processo por etapa

- **Como é feito:** as 7 etapas numa frase só, com a ativa em preto e uma foto que troca (croqui, material, canteiro).
- **Por que funciona:** é a única seção que mostra o trabalho antes do resultado. A foto de obra prova que o escritório
  vai até o canteiro, o que a frase "end to end" sozinha só afirmaria.

### Ficha de projeto em faixa, logo abaixo do título

- **Como é feito:** Client · Typology · Year · Status, numa linha, antes da primeira foto; Discipline e Collaborators
  numa tabela logo depois.
- **Por que funciona:** responde às perguntas de triagem (é do meu tipo? está pronta? quem fez?) num relance, antes do
  texto longo.

### Narrativa do projeto como percurso, com a foto ao lado do parágrafo dela

- **Como é feito:** seis blocos numerados que andam pela casa (entrada, cozinha, jantar, estar, pátio, materiais), cada
  um com o grupo de fotos daquele ambiente e nenhuma legenda.
- **Por que funciona:** transforma foto em raciocínio. O cliente compra decisões, e cada parágrafo explica uma.
- **Copy:** *"A further two steps down, the dining space acts as a hinge between kitchen and living areas, offering the
  longest views through the home."*

### A ideia central do projeto numa citação

- **Como é feito:** uma frase grande entre aspas, entre a ficha e a narrativa.
- **Por que funciona:** quem não vai ler os seis blocos sai com a ideia do projeto.
- **Copy:** *"Shielding complexity behind simplicity."*

### Prova conferível, com link, sem inflar

- **Como é feito:** prêmios e imprensa em tabela por ano, cada linha com link para a fonte, incluindo shortlist e
  longlist.
- **Por que funciona:** prova que o visitante pode conferir vale mais que adjetivo. Registrar o shortlist como
  shortlist torna o "Winner" mais crível.

### Filtro por tipologia com contagem

- **Como é feito:** "Multi-residential (13)", "Residential (11)", "Seniors' Living (03)".
- **Por que funciona:** o cliente acha o caso dele, e o número mostra onde está a experiência sem uma frase sobre isso.

### Contato que responde "você atende onde eu estou?"

- **Como é feito:** "Based in Melbourne but available for your projects in ___", com a última palavra trocando entre
  os estados.
- **Por que funciona:** mata a objeção geográfica antes de ela virar pergunta, e a lista bate com os registros
  profissionais de Process.

### Cartão de próximo projeto

- **Como é feito:** "Go to next project" com miniatura, no fim de cada projeto.
- **Por que funciona:** o visitante não chega num beco sem saída e continua vendo trabalho.

### Bloco de cor com ícone onde não há foto

- **Como é feito:** quadrado em ferrugem ou sálvia com ícone, ao lado de cada iniciativa.
- **Por que funciona:** mantém o ritmo sem foto de banco para assunto que não tem fotografia.

### Imagem que costura uma seção na outra

- **Como é feito:** a última foto da nuvem cresce e vira o fundo da seção Vision.
- **Por que funciona:** a página se lê como percurso, não como blocos empilhados. Com foto parada, o custo é baixo.

---

## Tipografia e cor

- **Família (medida no estilo computado):** todo o texto em Europa-Grotesk, sans-serif. Corpo de 16px, peso 400; h2
  de 72px, peso 400. **Fonte comercial:** checar licença antes de usar qualquer coisa parecida (`kit-tipo`).
- **Escala (*aparente*):** títulos de projeto por volta de 100px; listas grandes (Method e equipe) por volta de 48 a
  60px, em bloco compacto.
- **Logotipo:** desenho próprio, largo, de terminais retos, aparentemente em SVG (ele se monta no loader).
- **Hierarquia:** por cor, não por fonte. Preto para o item ativo, cinza-sálvia para o secundário. Rótulos de seção em
  caixa alta pequena, com numeração 01 a 05 em cinza. Marcas de corte nos cantos das seções, como numa prancha.
- **Cor (amostrada nos prints, não lida no CSS):** preto `#000000`, branco, cinza-sálvia `#cacfcb` (texto secundário
  como "Filters" e "Talk to us about your project", e fundo da página de contato), ferrugem `#952c16` (só no hover da
  lista de projetos e nos blocos das iniciativas).
- **Quantos acentos de verdade:** um, a ferrugem, e usada só em dois lugares. O resto é preto, branco e sálvia, e a cor
  vem das fotos.
- **Contraste:** pela amostra, o cinza-sálvia `#cacfcb` sobre branco dá cerca de **1,6:1** (conta feita sobre a cor
  amostrada do print), muito abaixo de 4,5:1, e é justamente o convite "Talk to us about your project". A ferrugem sobre
  branco dá cerca de 7,9:1.

---

## O que serve à Débora Reis

### A diferença de propósito, antes de copiar qualquer coisa

O Telha é um escritório de 29 pessoas que vende porte e rigor para incorporadora e para particular, e conta com que o
visitante qualificado ligue. A Débora é uma profissional só, na Barra, em Salvador, com três frentes: projeto,
acompanhamento de obra e decoração. Do Telha se reaproveitam **a ordem da home como argumento** e **a página de
projeto como raciocínio**. A conversão passiva não serve: quem contrata uma profissional solo está contratando a
pessoa, precisa ver quem ela é e precisa de um caminho curto para falar com ela.

### O propósito do site, pela régua do Telha

Pela lógica deste site, o trabalho da página da Débora é: dizer em uma frase o que ela faz e onde, provar com três
apartamentos escolhidos, mostrar como ela pensa e como trabalha nas três frentes, e levar a uma conversa. A tabela serve
para auditar o esboço seção por seção:

| Seção do Telha | O que ela prova | O equivalente no site da Débora | Dado que precisa vir dela |
|---|---|---|---|
| 01 Studio (frase-tese) | quem, onde, o quê, para quem | uma frase com o que ela faz, onde e para quem | confirmar os termos da frase com ela |
| 02 Selected Works | critério | três apartamentos com nome e ficha mínima (o esboço já tem três: Rio Vermelho, Colorir e Aconchego) | bairro, ano e escopo de cada um, ou `[FALTA]` |
| All Work (31) | volume | só com 15 a 20 fotos boas de obras dela; senão, grade simples | quantidade real de obras e fotos |
| 03 Vision | como pensa | o que ela prioriza num projeto, numa frase dela | a frase, nas palavras dela |
| 04 Method | escopo de ponta a ponta | projeto, acompanhamento de obra e decoração, com uma linha cada e foto real de cada fase | prancha ou desenho, obra em andamento, ambiente pronto |
| Página de projeto | raciocínio | o que o apartamento tinha de problema → o que se decidiu → o resultado | as decisões, nas palavras dela ou do cliente |
| Studio (equipe, prêmios, imprensa) | pessoas e reconhecimento | uma seção "quem é a Débora": retrato, formação (UFBA, 2004) e registro; prêmio e imprensa só se existirem | CAU `[FALTA: número, se ela autorizar]`; publicações, se houver |
| Contact (abrangência) | atende onde eu estou? | "Escritório na Barra, atendendo `[FALTA: bairros ou cidades que ela confirmar]`" | área de atendimento |
| (não existe no Telha) | como começa | os passos do primeiro contato, com o que acontece em cada um | o que ela faz no primeiro encontro |

### O que aproveitar, e como

1. **Home como argumento em ordem.** A mesma ordem cabe nela: quem é (arquiteta de interiores na Barra, que reforma
   apartamento) → 3 apartamentos → os demais → o que ela prioriza → projeto, acompanhamento de obra e decoração →
   falar com ela. Cada seção responde à dúvida que a anterior cria.
2. **A frase-tese no primeiro scroll.** Um exemplo, a conferir palavra por palavra com ela: *"Arquiteta de interiores na
   Barra, Salvador. Reformo apartamentos do projeto à decoração, acompanhando a obra."* A formação (UFBA, 2004) entra
   como dado de apoio logo abaixo. O visitante sabe em cinco segundos se está no lugar certo.
3. **Curadoria de três, cada um com nome próprio e legenda mínima.** O esboço já passa só pelos três apartamentos
   (`CLAUDE.md` do protótipo, 15/10). O Telha acrescenta o nome como título de capítulo (bairro + tipo) e uma linha de
   legenda com tipo e ano, só com dado real.
4. **Ficha de projeto em faixa, logo abaixo do título.** Bairro, tipo de imóvel, área `[FALTA: m²]`, ano, escopo
   (projeto / acompanhamento de obra / decoração), status (concluído ou em obra) e crédito do fotógrafo. O escopo por
   projeto é o que prova a frente de acompanhamento de obra. O protótipo já registra a pendência de pedir os originais
   do fotógrafo Roberto Moreira Rego (rodada 4); o crédito entra na ficha de cada projeto em que ela confirmar que a
   foto é dele.
5. **Narrativa como percurso, com o parágrafo junto das fotos do ambiente e sem legenda foto a foto.** Para reforma, a
   estrutura vira: o que o apartamento tinha de problema → o que se decidiu → o resultado. O Rio Vermelho já está em
   capítulos no esboço (o que mudou, as cores, a luz e os objetos); o Telha mostra como cada capítulo pode carregar o
   grupo de fotos dele. Texto com as palavras dela ou do cliente; o que não vier dela vira `[FALTA]`.
6. **Método com etapas nomeadas e numeradas, e uma foto que troca por etapa.** As três frentes como etapas (projeto,
   acompanhamento de obra, decoração), com foto real de cada fase. E, diferente do Telha, uma ou duas linhas dizendo o
   que acontece em cada uma, já que lá só há nomes.
7. **Prova conferível, ou nenhuma.** Publicação, prêmio, registro no CAU: só entra se existir e com link ou número
   conferível. Se não existir, a seção não existe. Nunca preencher para fechar layout.
8. **Pílula de CTA fixa que muda de rótulo conforme o trecho.** A ideia serve, mas o destino tem que ser a conversa
   (contato ou WhatsApp `[FALTA: número confirmado por ela]`), e não "Discover". O botão do WhatsApp saiu do rodapé do
   esboço em 15/10 (`CLAUDE.md` do protótipo): voltar com ele, fixo ou não, é decisão do Marcelo.
9. **Contato que responde "você atende onde eu moro?".** "Escritório na Barra, atendendo `[FALTA: bairros ou cidades
   que ela confirmar]`". Mata a objeção antes de ela virar pergunta.
10. **Cartão de próximo projeto no fim de cada projeto.** O Rio Vermelho já termina em "Próximo apartamento" no esboço;
    vale para as outras páginas de projeto.
11. **Pessoa real: retrato ao lado do nome e foto de bastidor.** Num escritório de uma pessoa, a pessoa é a marca. O
    mecanismo da equipe do Telha (nome, rosto, papel) vira uma seção única "quem é a Débora", com retrato real
    `[FALTA, se não houver]`, formação e o que ela faz pessoalmente em cada etapa.
12. **Nuvem sem legenda como sinal de volume, depois da curadoria.** Só se ela tiver 15 a 20 fotos boas de obras dela,
    e cada foto precisa levar ao projeto (no Telha não leva). Com portfólio pequeno, pular e usar grade simples; a
    faixa "Detalhes que contam" do esboço já cumpre parte desse papel.
13. **Imagem que vira o fundo da seção seguinte.** Costura barata de reaproveitar com foto parada, respeitando
    `_memoria/design/60-motion.md`.

### O que o Telha não tem e o site da Débora precisa ter (conferir no esboço)

- Pedido de contato antes do rodapé, com um caminho de um toque.
- Como começa, em passos, com o que acontece em cada um.
- Uma linha do que acontece em cada etapa do serviço.
- Prazo típico e forma de cobrança, se ela quiser dizer (o guia do cliente do esboço tem páginas de prazos e de
  valores, marcadas "Demonstração").
- Perguntas frequentes, com as respostas dela (o guia já tem "Quem contrata a obra?").
- Área (m²) na ficha de projeto.
- Antes e depois, que em reforma é a prova central, se ela tiver o material.
- Marcação de render, se algum dia entrar render.
- Mapa e horário de atendimento.
- A pessoa com biografia curta, e não só nome e cargo.

---

## O que não copiar

- **Loader com contador que segura o conteúdo por 4 a 5 segundos, e vídeo de 55 MB no hero.** No navegador headless
  sem H.264, o loader travou em 100% para sempre: quem não carrega o vídeo não entra no site. Pesado no celular e no
  4G.
- **Contato só no rodapé da home, depois de 8 a 9 telas, e página de contato sem formulário nem canal rápido.** Para
  quem precisa de cliente, o pedido aparece antes e tem um caminho de um toque.
- **Pílula fixa que na home leva sempre a "Discover", nunca a "falar comigo".** E o rótulo trava em "Vision" durante o
  Method e o rodapé; no celular, ela flutua no meio da tela no vão antes do rodapé.
- **Nuvem de 19 fotos sem link nem legenda.** Quem clica numa foto não vai a lugar nenhum, e as fotos a 40% de
  opacidade parecem lavadas.
- **Texto cinza-sálvia sobre branco justamente no convite "Talk to us about your project" e em "Filters"** (cerca de
  1,6:1 pela cor amostrada). Contraste baixo no ponto de conversão.
- **Página Process que fala de filosofia, ISO, plano de reconciliação e energia verde, mas não explica ao cliente o
  passo a passo do projeto.** Para pessoa física que vai reformar, isso não responde "como vai ser".
- **As 7 etapas do Method só como nomes**, sem uma linha do que acontece em cada uma.
- **Render ("Coming Soon") misturado com foto de obra pronta sem marcar o que é render** (*aparente*). Pela integridade
  da Hórus, render é marcado como render.
- **Relógio com a hora local e newsletter no rodapé.** Decoração e captura que não servem a um cliente de reforma.
- **Lista de 29 nomes da equipe.** Não se aplica a um escritório de uma pessoa; o que serve é o mecanismo nome + rosto
  + papel.
- **Europa-Grotesk.** Fonte comercial: não copiar sem checar a licença (`kit-tipo`).
- **Acknowledgement of Country.** Norma cultural australiana: não transpor literalmente.

---

## Aplicado onde

Ainda não. Estudado em 15/10/2026 para o esboço da Débora Reis (`clientes/_prototipos/debora-reis/`, no ar em
https://esboco-debora-reis.vercel.app). Candidatos à aplicação: a frase-tese no primeiro scroll, a ficha em faixa por
projeto (com o escopo e o crédito do fotógrafo), o método com uma foto real por etapa e uma linha por etapa, o contato
que responde à abrangência e a tabela de propósito acima como auditoria do esboço. Preencher quando acontecer, com a
adaptação feita.

Prints e textos extraídos (somem com a sessão):
`/tmp/claude-0/-home-user-HorusOS-Pro/ada53c37-1efb-518e-8aec-f8416f2ef82e/scratchpad/ref/telha-clarke/`

- Abertura: `intro-sheet.png` (a sequência do loader)
- Home a 1440: `home-00.png`, `home-01.png`, `home-03.png`, `home-05.png`, `home-07.png`, `home-09.png`, `home-10.png`
  (a nuvem All Work com o título fixo), `home-11.png`, `home-13.png`, `home-17.png`, `home-19.png`; Method:
  `method-sheet-b.png`
- Home a 390: `mob-sheet.png`, `mob-06.png`
- Works: `works-sheet-a.png`, `works-03.png`, `works-list-1.png` (visão em lista)
- Projeto: `proj-00.png`, `proj-01.png`, `proj-03.png`, `proj-06.png`, `proj-10.png`, `proj-sheet-a.png`
- Studio: `studio-02.png`, `studio-04.png`, `studio-sheet-a.png`
- Process: `process-00.png`, `process-04.png`
- Contato: `contact-00.png`
- Texto visível e links: `home-text.txt`, `proj-text.txt`, `studio-text.txt`, `home-links.txt`
