# Teardown: Tecnoarreda Interior Design (arquitetura, interiores e general contractor de luxo, Bergamo)

- **URL:** https://www.tecnoarreda.it/
- **Segmento:** arquitetura e interiores de alto padrão com **general contractor chave na mão**: a mesma empresa
  projeta, constrói, reforma e mobilia. Sede em Rovetta (Bergamo, Itália) e filial em Saint Moritz (Suíça). Portfólio
  de vilas, chalés, um hotel 5 estrelas e um centro de conferências na Nigéria. **É uma empresa média, com equipe e
  duas sedes, não um escritório de uma pessoa.**
- **Estudado em:** 15/10/2026, com o Playwright: home em desktop 1440x900 com rolagem completa, hover nos serviços e
  menu aberto; home em mobile 390x844; `/chi-siamo/`, `/general-contractor/`, `/general-contractor/ristrutturiamo/`,
  `/progetti/` (desktop com hover num cartão e mobile 390), `/realizzazioni/villa-linear/`,
  `/realizzazioni/collina-luxury-relais/` e `/contatti/`. A página do Awwwards
  (`awwwards.com/sites/tecnoarreda-interior-design`) deu 502 pelo proxy: o selo "W. Honors" está fixo no site, mas o
  nível do prêmio **não foi confirmado**.
- **Feito por:** LO Studio, em WordPress com GSAP (ScrollTrigger, ScrollSmoother, SplitText), Swiper e lightbox.
- **Nota:** 6/10. Como referência de **estrutura de serviço** (cada serviço é uma fase da jornada, com uma imagem que
  prova a fase), de **página de processo** e de **página de projeto que explica as decisões**, vale muito. Como home
  que recebe contato, vale pouco: não há nenhum chamado de contato acima do rodapé e o texto é adjetivo de luxo que
  serve a qualquer escritório.
- **Contexto:** um dos sites que o Marcelo mandou, a pedido dele, para o site da Débora Reis
  (`clientes/_prototipos/debora-reis/`), no mesmo lote do [Normal is Boring](normalisboring.md) e da Stanzza. A
  pergunta dele: qual o propósito de cada seção, como as imagens aparecem, e se falta informação no site da Débora.

**Em resumo:** a Tecnoarreda vende "um único responsável do projeto à entrega" a dono de vila e chalé de luxo. A home
informa pouco: cria um clima (vídeo escuro, frases poéticas, fotos sem legenda que crescem e correm no scroll) e
coloca no meio os **dois blocos que de fato vendem**: a missão ("um único referente, prazo e orçamento cumpridos") e a
lista de serviços em forma de verbos. O conteúdo racional (processo em 3 etapas, por que escolher, história desde
1988, fundador, sustentabilidade) fica nas páginas internas, e cada uma termina num formulário. **A home dá o clima e
a tese; as internas explicam e convertem.**

---

## Estrutura, na ordem

### Fixo em todas as páginas

**0. Cabeçalho fixo, selo do Awwwards e menu sobreposto.**

- **Mostra:** logo à esquerda; botão de texto sublinhado "I NOSTRI SERVIZI ↘" ("nossos serviços", leva para a página
  General Contractor); IT / EN; ícone de menu de duas linhas. Na lateral esquerda, uma fita branca vertical "W.
  Honors", fixa em todas as páginas. O menu abre em tela cheia, dividido: à esquerda a lista numerada 01 Home, 02 Chi
  siamo, 03 General Contractor, 04 Progetti, 05 Contatti, com filetes; à direita os 4 verbos de serviço gigantes
  (Progettiamo, Costruiamo, Ristrutturiamo, Arrediamo).
- **Para quê:** dar **dois caminhos de navegação**: pela instituição (quem somos, projetos, contato) e pela necessidade
  (o que eu quero fazer). O botão "I nostri servizi" é o único atalho comercial visível sem abrir o menu.
- **Como é montado:** barra transparente sobre o hero. O menu tem 2 colunas (cerca de 40/60) separadas por uma linha
  vertical. No hover de um serviço, uma imagem aparece e segue o cursor (interpolação de 0.1 por frame) e os outros
  itens caem para 25% de opacidade.
- **Imagem:** nenhuma fixa. No menu, a imagem só existe no hover.
- **Copy:** "I NOSTRI SERVIZI ↘ · 01 HOME · 02 CHI SIAMO · 03 GENERAL CONTRACTOR · 04 PROGETTI · 05 CONTATTI"

### Home

**1. Hero com vídeo.**

- **Mostra:** vídeo de fundo em tela cheia (autoplay, mudo, em loop, escurecido) de uma sala de vila. O H1 partido em
  dois blocos na diagonal: "STUDIO DI ARCHITETTURA" no alto à esquerda e "INTERIOR DESIGN" embaixo à direita. O
  subtítulo "Design esclusivo, emozioni senza tempo" ("design exclusivo, emoções atemporais") no canto inferior
  esquerdo.
- **Para quê:** **classificar o negócio no primeiro segundo** (o H1 é literalmente a categoria, o que serve à busca e à
  pessoa que precisa saber onde chegou) e dar o tom de luxo pelo movimento e pela escuridão. Não pede nenhuma ação.
- **Como é montado:** 100vh. Texto nas duas pontas opostas, deixando o miolo para o vídeo. Sem botão, sem telefone,
  sem cidade.
- **Imagem:** vídeo full-bleed com véu escuro forte; o pôster é a foto do living da "Villa Nicole". Sem legenda.

**2. Manifesto com fotos escalonadas.**

- **Mostra:** parágrafo grande em serifa, alinhado à direita: *"La casa è più di un luogo: è emozione, sensazioni, un
  riflesso di chi la vive. Ogni spazio può trasformarsi in un'opera d'arte..."* ("a casa é mais que um lugar: é
  emoção, sensações, um reflexo de quem vive nela; cada espaço pode virar uma obra de arte"). À esquerda e embaixo, 3
  fotos verticais de tamanhos diferentes (parede de pedra, mesa de jantar, mesa redonda), desalinhadas. Uma nota
  manuscrita "Dettagli di stile" ("detalhes de estilo") com seta desenhada apontando para uma das fotos.
- **Para quê:** desacelerar o visitante e posicionar a empresa pelo emocional (a casa como reflexo de quem mora) antes
  de qualquer argumento. As fotos mostram gosto e acabamento **sem dizer de qual projeto são**.
- **Como é montado:** cerca de 1300px. O texto acende linha por linha com o scroll (as linhas não lidas ficam cinza e
  passam a branco, scrub ligado ao scroll). As fotos entram crescendo, em colunas opostas ao texto e com alturas
  desencontradas.
- **Imagem:** retratos verticais (por volta de 1:1,9 e 3:4), sem legenda, sem clique, que aumentam de escala no
  scroll. A seta manuscrita faz o papel da legenda.

**3. Seção fixada "Equilibrio di forme".**

- **Mostra:** uma foto de piscina coberta de vila (claraboia redonda, arcos) que começa como cartão de cerca de 500px
  à esquerda e cresce até ocupar a tela inteira. Depois o título gigante "EQUILIBRIO DI FORME" ("equilíbrio de
  formas", cerca de 173px) atravessa a tela na horizontal por cima da foto, que se dissolve num gradiente preto.
- **Para quê:** ser o momento de impacto da página e **mostrar escala de obra** (uma piscina interna de vila) sem dizer
  nada. É o respiro entre o manifesto e os argumentos.
- **Como é montado:** seção pinada (pin-spacer de cerca de 2400px de scroll para uma única imagem), em três fases: a
  imagem expande, o título corre, a imagem escurece para o preto. No mobile vira uma foto estática com o título por
  cima.
- **Imagem:** uma foto só, de cartão a full-bleed. Sem legenda visível (o `alt` diz "Piscina interna alla villa").

**4. Missão: o argumento de venda.**

- **Mostra:** três colunas. O título em serifa "La nostra missione: creare eccellenza" ("nossa missão: criar
  excelência") e dois parágrafos curtos em sans: *"Affidati a un unico referente per realizzare il tuo progetto [...]
  dalla progettazione alla consegna finale"* ("confie a um único responsável o seu projeto, do projeto à entrega
  final") e *"Gestiamo ogni fase con un approccio chiavi in mano, garantendo... estetica, funzionalità, tempi e
  budget"* ("cuidamos de cada fase, chave na mão, garantindo estética, funcionalidade, prazo e orçamento").
- **Para quê:** é o **primeiro conteúdo racional da home e a tese da empresa**: um único responsável do começo ao fim,
  com prazo e orçamento cumpridos. Responde ao medo número um de quem reforma ou constrói: coordenar vários
  fornecedores e estourar prazo e verba.
- **Como é montado:** bloco baixo (cerca de 340px), grade de 3 colunas, sem imagem, texto pequeno. **É visualmente a
  seção mais discreta da home, sendo a que mais vende.**
- **Imagem:** nenhuma.

**5. Serviços como verbos.**

- **Mostra:** quatro verbos gigantes empilhados, PROGETTIAMO / COSTRUIAMO / RISTRUTTURIAMO / ARREDIAMO (projetamos,
  construímos, reformamos, mobiliamos), cada um levando à página do serviço.
- **Para quê:** mostrar a oferta como **as fases da jornada do cliente** e reforçar o "fazemos tudo". O verbo na
  primeira pessoa do plural fala de ação, não de categoria.
- **Como é montado:** 4 linhas de cerca de 143px. No hover, a palavra fica branca e sublinhada, as outras caem para
  25% de opacidade e uma imagem 4:3 (432x270) segue o cursor com atraso suave. No mobile vira lista centralizada, sem
  imagem.
- **Imagem:** a imagem do hover **foi escolhida para provar a fase**: em Progettiamo é um croqui a lápis de um
  corredor; nos outros verbos são ambientes prontos (em Ristrutturiamo, uma sala de jantar com lareira).

**6. Fundador e "chi siamo".**

- **Mostra:** à esquerda, uma foto vertical de Silverio Pezzoli desenhando à mesa, com a assinatura "Silverio Pezzoli"
  em script por cima, vazando para fora da foto. À direita, o H2 "Dal concept all'emozione: l'architettura eseguita a
  regola d'arte" ("do conceito à emoção: a arquitetura feita segundo as regras do ofício"), um parágrafo e o link
  "CHI SIAMO ↘". Logo abaixo, uma foto zenital de mãos sobre plantas, com a nota manuscrita "Ogni particolare è una
  firma d'eccellenza" ("cada detalhe é uma assinatura de excelência") e uma seta.
- **Para quê:** **pôr uma pessoa atrás da marca** (o autor que desenha à mão) e ligar o luxo à ideia de maestria
  artesanal. É a ponte para a página Sobre.
- **Como é montado:** duas colunas desencontradas (foto alta à esquerda, texto à direita com respiro) e depois a
  segunda foto do lado oposto, em zigue-zague. CTA em texto com seta, sem botão.
- **Imagem:** foto real do fundador trabalhando (não posando para a câmera) e foto de processo (mãos, lápis, planta).
  A assinatura sobreposta funciona como legenda autoral. No mobile ela é cortada na borda direita.
- **Copy:** *"Tecnoarreda Interior Design nasce per trasformare il concetto di architettura in un'esperienza completa,
  elegante e su misura [...]"*

**7. Realizzazioni em galeria horizontal.**

- **Mostra:** o título gigante "REALIZZAZIONI" ("realizações") e o link "I NOSTRI PROGETTI ↘". Seis fotos (quarto do
  Collina, mesa da Villa Linear, banheiro, cantinho de leitura do chalé em St. Moritz, cozinha) passam na horizontal
  enquanto o visitante rola para baixo. Nota manuscrita "Creativi nel concept, tecnici nel dettaglio" ("criativos no
  conceito, técnicos no detalhe") com seta.
- **Para quê:** dar prova de volume e de gosto e servir de vitrine para a página de projetos. **Não é portfólio:**
  nenhuma foto diz de que obra é nem leva a ela.
- **Como é montado:** seção pinada, com o scroll vertical convertido em movimento horizontal (cerca de 1400px). As
  fotos têm tamanhos (de 461x576 a 576x768) e alturas diferentes, o que dá um ritmo de varal. No mobile vira carrossel
  com bolinhas.
- **Imagem:** fotos sem legenda e sem clique; a única saída é o link de texto. O `alt` identifica o projeto ("Tavolo
  Villa Linear", "zona lettura Chalet St. Moritz"), mas isso não aparece na tela.

**8. Rodapé como cartão de visita.**

- **Mostra:** três colunas: endereço (link para o Google Maps), "Tel: +39 0346 20880" (link `tel:`) e e-mail
  (`mailto:`), Facebook e Instagram. Abaixo, o wordmark gigante TECNOARREDA (branco) / INTERIOR DESIGN (cinza) na
  largura toda, com um "A" enorme do logo em cinza atrás. Por fim, a linha legal (srl, PEC, P.IVA, REA, capital
  social), privacidade e crédito do estúdio.
- **Para quê:** é o **único ponto de contato da home** e o fechamento da marca; dá também credibilidade legal (os
  dados da empresa exigidos na Itália).
- **Como é montado:** contato em 3 colunas, o wordmark como assinatura final, a linha legal pequena. Na home não há
  formulário (as internas têm).
- **Copy:** "Via Vogno 20, 24020 Rovetta (Bg) · Tel: +39 0346 20880 · info@tecnoarreda.it"

### Páginas internas

**9. Chi siamo (sobre).**

- **Mostra:** hero "L'ARTE DI ARREDARE SPAZI MEMORABILI / Progettiamo case, consegniamo opere d'arte" ("a arte de
  mobiliar espaços memoráveis / projetamos casas, entregamos obras de arte"). Introdução com foto da equipe. Nota
  manuscrita "Libere intuizioni per chiari obiettivi". "OLTRE 35 ANNI DI PASSIONE" ("mais de 35 anos de paixão").
  Linha do tempo 1988, 1989, 1994, 2001, 2012, 2013, Oggi (fundação, exterior, início do general contractor, edifícios
  completos, casas passivas, criação da YHOM, atuação na Suíça, França, Mônaco e Nigéria). "Artigiani locali,
  maestria italiana". "Alpin Style" (a filial de St. Moritz). "Silverio Pezzoli: il cuore e la mente" ("o coração e
  a mente"). Sustentabilidade (madeira X-LAM, Casa Clima, LEED). Faixa de realizações e formulário CONTATTACI.
- **Para quê:** fazer o trabalho racional que a home não faz. **Cada bloco responde a uma pergunta de confiança:** há
  quanto tempo (35 anos, linha do tempo), quem faz (equipe, fundador), com quem (artesãos locais), onde (países,
  filial alpina), com que valores (sustentabilidade).
- **Como é montada:** blocos em zigue-zague (foto de um lado, texto do outro). A linha do tempo é um slider com setas,
  pontos sobre uma linha horizontal e o número do ano gigante, "fantasma", em cinza no fundo ("88"). Dois CTAs
  "RICHIEDI UNA CONSULENZA ↘" ("peça uma consultoria") no meio da página e o formulário no fim.
- **Imagem:** fotos de pessoas e de processo (fundador, mãos com amostras de material), paisagem alpina e um quarto
  de chalé. Fotos menores dentro do texto, nunca em tela cheia.
- **Copy:** *"1988 · La fondazione: un'idea rivoluzionaria. Silverio Pezzoli e un socio fondano Tecnoarreda."*

**10. General Contractor (processo e por que escolher).**

- **Mostra:** hero "ARCHITETTURA E INTERIOR DESIGN: UN UNICO PARTNER / Unico obiettivo il risultato" ("um único
  parceiro / um único objetivo, o resultado"). "Una gestione fluida e completa del tuo progetto". "Un unico team,
  infinite competenze" (arquitetos, designers, engenheiros, geômetras e um coordenador). "IL TUO PROGETTO IN 3 STEP":
  1 Consulenza, 2 Progettazione, 3 Realizzazione. "Perché scegliere Tecnoarreda": Puntualità assicurata, Controllo del
  budget, Progetti personalizzati, Esperienza fluida (eles cuidam da burocracia e das licenças), Unico interlocutore,
  Risparmio di tempo, Garanzia di qualità. Lista de serviços, realizações e formulário.
- **Para quê:** explicar **como funciona e por que contratar**. Ataca as dores de quem reforma ou constrói: atraso,
  orçamento, burocracia, ter de gerenciar vários fornecedores. **É a página mais útil do site para quem decide.**
- **Como é montada:** as três etapas lado a lado, cada uma com número gigante em serifa, título, uma linha de texto e
  uma foto, em alturas desencontradas. Os benefícios num carrossel de 3 por vez, com ícones de linha e setas.
- **Imagem:** **cada etapa tem a imagem da própria etapa**: o fundador pensativo à mesa (consultoria), um croqui
  colorido à mão (projeto), mãos com amostras de material sobre plantas (realização). Os benefícios usam ícones.
- **Copy:** *"1 Consulenza · Per comprendere le esigenze del cliente e sviluppare un concept unico e personalizzato."*
  ("para entender as necessidades do cliente e desenvolver um conceito único e personalizado")

**11. Página de serviço (Ristrutturiamo).**

- **Mostra:** hero com foto escurecida de um sótão reformado: "RISTRUTTURAZIONI / Valorizziamo il passato per aprire
  finestre sul futuro" ("valorizamos o passado para abrir janelas para o futuro"). "Siamo per una ristrutturazione
  conservativa" ("defendemos a reforma conservativa"). Reforma de interiores (recuperar vigas antigas, piso de pedra)
  com foto. Reforma de exteriores. Nota manuscrita. "Un unico interlocutore per il tuo progetto" (eles cuidam das
  licenças, inclusive de imóvel tombado). Realizações e formulário.
- **Para quê:** **posicionar uma linha de reforma** (a conservativa, que valoriza o original) e tirar o peso da
  burocracia das costas do cliente.
- **Como é montada:** hero com o nome do serviço gigante, blocos de texto e foto em zigue-zague, um bloco de argumento
  e o fechamento padrão (faixa de realizações e formulário).
- **Imagem:** ambientes prontos (uma garagem de carros antigos sob telhado de madeira). **Não há nenhum antes e
  depois, mesmo sendo a página de reforma.**
- **Copy:** *"Nel rispetto della storia degli ambienti, recuperiamo travi antiche, pavimenti in pietra e dettagli
  originali..."* ("respeitando a história dos ambientes, recuperamos vigas antigas, pisos de pedra e detalhes
  originais")

**12. Progetti (portfólio).**

- **Mostra:** hero "PROGETTI CHE RACCONTANO EMOZIONI / Lasciati ispirare dal nostro stile" ("projetos que contam
  emoções / deixe-se inspirar pelo nosso estilo"). Grade de 19 projetos (Villa Privata, Villa Dorga, Chalet Relax,
  Collina Luxury Relais, Il Castello, Villa Linear, ... House of Cars, Abujia Conference Center) e o formulário.
- **Para quê:** ser o acervo de prova. Funciona como **vitrine de inspiração**, não como busca por um caso parecido com
  o meu.
- **Como é montada:** 2 colunas de cartões quadrados 1:1, escurecidos. No desktop, o nome e "SCOPRI IL PROGETTO ↘"
  ("descubra o projeto") só aparecem no hover; no mobile, 1 coluna com o nome sempre visível. Sem filtro, sem
  categoria, sem cidade, sem ano, sem metragem.
- **Imagem:** foto de capa quadrada com véu escuro; o nome entra centralizado no hover.

**13. Página de projeto (Villa Linear e Collina Luxury Relais).**

- **Mostra:** hero com foto em tela cheia e o nome do projeto gigante; um vídeo com botão de play; parágrafo de
  abertura grande em serifa. Na **Villa Linear**, texto narrativo cômodo por cômodo: parede de carvalho canelado na
  entrada, estante de materiais alternados com lareira a água, mesa de ferro cru com tampo chanfrado, divisória de
  vidro entre sala e cozinha como "coxia de teatro", luminárias. Depois, uma sequência longa de fotos, inclusive
  close-ups de detalhe em largura total. No fim, "Lasciati ispirare da altri progetti" e o formulário. A **Collina** é
  um artigo com intertítulos e fatos concretos: Clusone, Val Seriana, único 5 estrelas da província, piscina de 300
  m², cobertura de 100 m², materiais locais, geotermia.
- **Para quê:** **mostrar o raciocínio por trás de cada escolha**: por que aquele material, o que aquela divisória
  resolve. É o conteúdo que separa um arquiteto de um catálogo. O texto longo também alimenta a busca orgânica.
- **Como é montada:** hero, vídeo, texto e galeria longa (a Villa Linear tem cerca de 38.000px de altura). Na Collina,
  o texto se alterna com grades de fotos 2-up e 3-up e um lightbox (cursor "+"). **Não há ficha técnica** (área, ano,
  local, escopo, prazo) **nem fala do cliente.**
- **Imagem:** planos gerais e close-ups de detalhe (quina do tampo, luminária) em largura total. Alguns detalhes
  aparecem visivelmente ampliados e sem nitidez. Sem legenda por foto.
- **Copy:** *"Una parete in vetro separa il living dalla cucina, creando un effetto che richiama le quinte di un
  teatro."* ("uma parede de vidro separa a sala da cozinha, criando um efeito que lembra as coxias de um teatro")

**14. Contatti.**

- **Mostra:** "CONTATTI / Il tuo progetto su misura inizia qui" ("seu projeto sob medida começa aqui"). Sede italiana
  (endereço, telefone, e-mail) e sede suíça (Via Dal Bagn 16, St. Moritz, **com o mesmo telefone italiano**).
  "REALIZZIAMO INSIEME LA TUA CASA DEI SOGNI" e o formulário (nome, sobrenome, e-mail, telefone, mensagem, aceite de
  privacidade).
- **Para quê:** converter quem já decidiu falar. O endereço físico com mapa prova que a empresa existe; o formulário é
  curto.
- **Como é montada:** endereços à esquerda e formulário em caixa cinza à direita, o mesmo componente que fecha todas
  as páginas internas.

### Comparando com `_memoria/design/00-anatomia.md`

- **Hero:** a anatomia pede o que é, para quem e o que fazer, em três segundos, com prova ao lado. A Tecnoarreda
  responde só **o que é** (a categoria no H1), e responde bem. Para quem, onde e o que fazer, não: sem cidade, sem
  prova, sem CTA.
- **Para quem é:** não existe em segunda pessoa. O mais perto é o manifesto ("um reflexo de quem vive nela").
- **O que fazemos:** os 4 verbos. Na home, sem descrição (a anatomia pede uma linha por serviço); a descrição fica na
  página de cada um.
- **Como começa:** existe, mas só na página General Contractor (3 etapas), e **sem número**: nenhum prazo, nenhuma
  faixa, nada sobre o que não está incluso. O bloco 4 da anatomia pede número.
- **Quem faz:** fundador com nome e foto trabalhando; equipe descrita por função, sem nomes; registro profissional não
  visto.
- **Como é / onde é:** duas sedes com endereço e mapa; fatos concretos só em alguns projetos (Collina).
- **FAQ:** não existe.
- **Contato:** na home, só no rodapé; nas internas, formulário no fim de todas.
- **Vender o freio:** a missão é exatamente isso, o medo de coordenar fornecedores e estourar prazo e orçamento
  virando a tese da empresa. **E é a seção mais apagada da home.** O site aplica o princípio e depois o esconde
  visualmente.

**A diferença de fundo:** como o Normal is Boring, a home trabalha o clima e deixa a informação para outras páginas.
A diferença é que a Tecnoarreda coloca a **tese racional no meio da home** (missão e verbos) e fecha **toda** página
interna num formulário. A divisão de trabalho fica: a home dá clima e tese, a General Contractor explica como
funciona e por que contratar, o projeto mostra o raciocínio. O elemento-assinatura é a **nota manuscrita com seta**
apontando a foto.

---

## Como as imagens aparecem

O site tem **três regimes de imagem**, cada um com uma função:

1. **Na home, atmosfera sem legenda.** As fotos crescem, correm e se sobrepõem ao texto sem dizer de que obra são. Quem
   faz o papel da legenda é a nota manuscrita com seta, que diz para onde olhar, não o que é. É o que o Marcelo
   descreveu: imagens que se sobressaem umas sobre as outras para mostrar trabalho, sem explicar o conteúdo.
2. **Nos serviços e no processo, a imagem prova a fase.** Croqui para "projetamos", amostras de material para
   "realização". Aqui a escolha da foto é argumento.
3. **No portfólio e no projeto, foto sem legenda individual, explicada pelo texto ao redor.** Diferente do Normal is
   Boring (onde cada foto do projeto ganha título e parágrafo), a Tecnoarreda nunca legenda a foto; quem explica é a
   narrativa cômodo por cômodo. E não há ficha.

Os padrões, na ordem em que valem mais para o pedido do Marcelo:

### Retratos verticais escalonados que crescem no scroll

- **Onde:** home, manifesto (seção 2).
- **Como funciona:** três fotos verticais de tamanhos diferentes, desalinhadas em colunas opostas ao texto, que
  aumentam de escala conforme o scroll. Sem legenda e sem clique.
- **Efeito:** passa a ideia de "mural de referências" e de acervo grande sem obrigar a ler. Mostra acabamento, não
  projeto.

### Galeria horizontal pinada, estilo varal

- **Onde:** home e fim das páginas internas ("Realizzazioni").
- **Como funciona:** o scroll vertical vira deslocamento horizontal. Seis fotos com tamanhos e alturas diferentes
  passam pela tela, ao lado de um título gigante e de uma nota manuscrita com seta. No mobile vira carrossel com
  bolinhas.
- **Efeito:** sensação de volume e de ritmo; funciona como teaser do portfólio. **O custo:** as fotos não dizem de que
  obra são e não levam a lugar nenhum. O interesse despertado só tem o link de texto como saída.

### Cartão que vira tela cheia em seção pinada, com título correndo por cima

- **Onde:** home, "Equilibrio di forme" (seção 3).
- **Como funciona:** a seção trava; a foto parte de um cartão de cerca de 500px e se expande até cobrir a tela; um
  título de cerca de 173px atravessa na horizontal; a foto se dissolve num gradiente preto. Tudo ligado ao scroll
  (GSAP ScrollTrigger com pin).
- **Efeito:** é o momento cinematográfico e dá escala de obra. O custo é de cerca de 2400px de scroll para uma única
  imagem, sem informação.

### Nota manuscrita com seta desenhada apontando a foto

- **Onde:** home (3 vezes), Chi siamo, Ristrutturiamo, faixa de realizações.
- **Como funciona:** frases curtas em fonte de caligrafia (Nothing You Could Do), em caixa alta, com uma seta curva em
  traço branco apontando para uma foto ou um detalhe.
- **Efeito:** faz o papel de legenda sem ser legenda: dirige o olho para o que o arquiteto quer que se note e
  humaniza (lembra anotação em prancheta). **É o elemento-assinatura do site.** O texto das notas, porém, é slogan
  ("Creativi nel concept, tecnici nel dettaglio"), não o nome do detalhe apontado.

### Imagem que segue o cursor numa lista de palavras

- **Onde:** serviços da home e menu sobreposto.
- **Como funciona:** no hover de um verbo, a palavra fica branca e sublinhada, as outras caem para 25% de opacidade e
  uma imagem 4:3 aparece e persegue o mouse com atraso (interpolação de 0.1 por frame).
- **Efeito:** associa cada serviço a uma imagem sem poluir a lista, e a imagem prova a fase (croqui para projetar,
  ambiente pronto para reformar). **Some no toque do celular.**

### Imagem por etapa do processo

- **Onde:** General Contractor ("Il tuo progetto in 3 step").
- **Como funciona:** três colunas com número gigante, título e texto curto, cada uma com a foto da própria etapa: o
  fundador pensando (consultoria), um croqui colorido (projeto), mãos com amostras de material (realização). Alturas
  desencontradas.
- **Efeito:** a imagem prova que a etapa existe e mostra como ela é. O processo deixa de ser abstrato.

### Assinatura sobreposta à foto do autor

- **Onde:** home, seção do fundador.
- **Como funciona:** o nome "Silverio Pezzoli" em script branco sobre a borda inferior da foto vertical dele
  desenhando, vazando para fora da foto.
- **Efeito:** transforma a foto em "obra assinada": pessoa e marca viram a mesma coisa. No mobile a assinatura é
  cortada na borda direita.

### Grade quadrada escurecida com o nome só no hover

- **Onde:** Progetti.
- **Como funciona:** cartões 1:1 em 2 colunas, com véu escuro permanente. No desktop, o nome e "Scopri il progetto"
  entram centralizados só no hover; no mobile ficam sempre visíveis.
- **Efeito:** grade limpa e uniforme, mas no desktop a informação fica escondida: é preciso passar o mouse em cada foto
  para saber o que é, e mesmo assim não se fica sabendo tipo, local nem tamanho.

### Página de projeto: hero com nome, vídeo e sequência longa de detalhes

- **Onde:** páginas de realização.
- **Como funciona:** foto em tela cheia com o nome gigante, um vídeo com play, texto narrativo e depois dezenas de
  fotos, inclusive close-ups de detalhe em largura total. Na Collina, grades 2-up e 3-up entre os intertítulos e um
  lightbox.
- **Efeito:** mostra o cuidado com o detalhe (a quina do tampo, a luminária), mas a página fica longuíssima, e os
  close-ups ampliados perdem nitidez em tela grande.

### Vídeo de fundo escurecido no hero

- **Onde:** home, seção 1.
- **Como funciona:** vídeo full-bleed em autoplay, mudo e em loop, sob um véu escuro forte, com o H1 em branco nas
  pontas opostas da tela.
- **Efeito:** a primeira impressão é de lugar e de movimento, não de informação. O véu garante a leitura do título,
  mas apaga boa parte da imagem.

### Número fantasma gigante na linha do tempo

- **Onde:** Chi siamo.
- **Como funciona:** o ano do slider aparece em branco ("1988") e, ao fundo, os dois últimos dígitos ("88") em cinza
  escuro, ocupando metade da tela. Setas e pontos numa linha horizontal fazem a navegação.
- **Efeito:** transforma a antiguidade em elemento visual e dá peso aos marcos.

### Logo gigante como fundo do rodapé

- **Onde:** rodapé de todas as páginas.
- **Como funciona:** o wordmark ocupa a largura toda em duas linhas (branco e cinza), com o "A" do logo em cinza
  escuro, enorme e inclinado, atrás.
- **Efeito:** a marca "assina" o fim da página. Não acrescenta informação.

---

## Informação: o que tem e o que falta

**Tem:**

- Categoria do negócio no H1 (studio di architettura, interior design).
- A tese comercial: um único responsável, chave na mão, do projeto à entrega, com prazo e orçamento cumpridos (home e
  General Contractor).
- Serviços em 4 verbos, cada um com página própria: projetar, construir, reformar, mobiliar.
- Processo em 3 etapas (consultoria, projeto, realização), com descrição e foto de cada uma.
- Lista de benefícios contra as dores do cliente: pontualidade, controle de orçamento, projeto personalizado,
  burocracia e licenças, interlocutor único, economia de tempo, garantia de qualidade.
- Composição da equipe (arquitetos, designers de interiores, engenheiros, geômetras, coordenador) e artesãos locais.
- Fundador com nome, foto trabalhando, papel e mais de 35 anos de experiência.
- Linha do tempo da empresa desde 1988, com marcos datados.
- Diferenciais técnicos: casas passivas, madeira X-LAM, protocolos Casa Clima e LEED, Alpin Style.
- Duas sedes com endereço e link para o mapa (Rovetta e Saint Moritz); países onde atua (Suíça, França, Mônaco,
  Nigéria).
- 19 projetos nomeados, cada um com página própria, texto narrativo explicando as decisões de material e de espaço, e
  vídeo. Fatos concretos em alguns (cidade, categoria do hotel, metragem da piscina e da cobertura).
- Telefone clicável, e-mail, Facebook, Instagram; formulário no fim de cada página interna.
- Dados legais da empresa (srl, PEC, P.IVA, REA, capital social), privacidade e cookies.
- Versão em inglês.
- Selo Awwwards Honors (prêmio do site, não da arquitetura).

**Falta:**

- Chamado de contato na home além do rodapé: nenhum formulário, nenhum botão de contato no cabeçalho, nenhum CTA de
  orçamento ou consulta.
- WhatsApp ou outro canal de mensagem rápida; horário de atendimento.
- Ficha técnica do projeto: área, ano, cidade ou bairro, escopo (projeto, obra, mobiliário), prazo.
- Antes e depois, inclusive na página de reforma.
- Depoimento de cliente, avaliações do Google, número de projetos entregues.
- Imprensa ou prêmios de arquitetura (o único selo é o do site).
- Preço, faixa de investimento ou forma de cobrança; prazo médio de projeto e de obra.
- FAQ (o que está incluso, como é a primeira reunião, quanto custa a consulta).
- Filtro ou categoria no portfólio (casa, chalé, hotel, corporativo; reforma ou obra nova).
- Região atendida dita na home (só o endereço de Rovetta, no rodapé).
- Registro profissional dos arquitetos (Ordine degli Architetti): não vi no que percorri.
- Nomes da equipe além do fundador.
- Telefone próprio da sede suíça (repete o número italiano).

---

## Navegação e conversão

- **Cabeçalho:** logo, botão de texto "I NOSTRI SERVIZI ↘" (leva para `/general-contractor/`), IT/EN e menu. Não há
  telefone, WhatsApp nem botão de contato.
- **Menu sobreposto:** à esquerda 01 Home, 02 Chi siamo, 03 General Contractor, 04 Progetti, 05 Contatti; à direita os
  4 serviços com imagem que segue o cursor.
- **Home:** os CTAs são só links de texto com seta, "CHI SIAMO ↘" (seção do fundador) e "I NOSTRI PROGETTI ↘"
  (galeria). Os 4 verbos levam às páginas de serviço. **Quem quer falar só acha telefone e e-mail no rodapé, ou abre
  o menu e vai em Contatti.**
- **Internas:** a lógica muda. Todas terminam na faixa "Realizzazioni" e num formulário "CONTATTACI" (nome,
  sobrenome, e-mail, telefone, mensagem, privacidade, "INVIA MESSAGGIO ↘"). Chi siamo tem ainda dois "RICHIEDI UNA
  CONSULENZA ↘" no meio do texto. A página de projeto fecha com "Lasciati ispirare da altri progetti" (lista dos
  outros projetos) e o formulário.
- **Mobile:** o fluxo é o mesmo (menu, rolagem longa, rodapé). A fita "Honors" do Awwwards fica por cima do texto dos
  títulos.

---

## O que copiar

### O H1 é a categoria, não um slogan

- **Como é feito:** "STUDIO DI ARCHITETTURA / INTERIOR DESIGN" em duas pontas da tela; a frase poética ("Design
  esclusivo, emozioni senza tempo") fica pequena, embaixo.
- **Por que funciona:** a pessoa sabe onde chegou antes de qualquer frase bonita, e o buscador também. O slogan entra
  como subtítulo, sem carregar a obrigação de explicar o negócio.

### Cada serviço é uma fase da jornada, dito em verbo, com a imagem que prova a fase

- **Como é feito:** Progettiamo / Costruiamo / Ristrutturiamo / Arrediamo, empilhados; no hover, a imagem da fase
  (croqui para projetar, ambiente pronto para reformar e mobiliar).
- **Por que funciona:** a oferta inteira vira uma sequência de ações que o cliente reconhece como o caminho dele. A
  imagem escolhida pela fase mostra que a empresa faz aquela etapa, não só que tem bom gosto.

### A tese é o medo do cliente virado ao contrário

- **Como é feito:** "Affidati a un unico referente [...] dalla progettazione alla consegna finale" e "tempi e budget".
  Na General Contractor, o mesmo argumento desdobrado: "Unico interlocutore", "Puntualità assicurata", "Controllo del
  budget".
- **Por que funciona:** é o "vender o freio" da anatomia: a dor de coordenar fornecedores e estourar prazo e verba vira
  o argumento de venda. (A lição é a estrutura; a seção da home, visualmente, é discreta demais.)

### Processo em etapas numeradas, com uma foto por etapa

- **Como é feito:** "IL TUO PROGETTO IN 3 STEP": número gigante em serifa, título, uma linha de texto e a foto daquela
  etapa (fundador à mesa, croqui colorido, mãos com amostras de material).
- **Por que funciona:** tira o medo de quem nunca contratou e torna cada etapa visível. Sem a foto, a etapa é promessa;
  com a foto, é mecanismo.

### Benefícios que nomeiam a dor, um por um

- **Como é feito:** um carrossel de benefícios com ícone de linha: pontualidade, controle de orçamento, burocracia e
  licenças ("Esperienza fluida"), interlocutor único, economia de tempo.
- **Por que funciona:** cada item responde a uma objeção concreta de quem reforma ou constrói, em vez de um "por que
  nós" genérico.

### Nota manuscrita com seta, como legenda de olhar

- **Como é feito:** frase curta em caligrafia, caixa alta, com seta curva em traço branco apontando o detalhe da foto.
- **Por que funciona:** guia o olho sem virar legenda técnica e lembra a anotação do arquiteto na prancheta. Vale pela
  função (apontar), não pela fonte de caligrafia, que é genérica.

### O autor trabalhando, com o nome assinado sobre a foto

- **Como é feito:** foto vertical de Silverio Pezzoli desenhando, com a assinatura em script por cima, vazando da foto;
  ao lado, uma foto de mãos sobre plantas.
- **Por que funciona:** a foto de trabalho (não de pose) mostra o ofício, e a assinatura transforma a foto em autoria.

### A página de projeto conta o raciocínio, e a melhor delas traz fato

- **Como é feito:** a Villa Linear descreve cômodo por cômodo o que foi decidido e por quê (o carvalho canelado, a
  lareira a água, a divisória de vidro como coxia de teatro). A Collina traz fatos: Clusone, Val Seriana, único 5
  estrelas da província, piscina de 300 m², cobertura de 100 m², geotermia.
- **Por que funciona:** a decisão explicada mostra o arquiteto pensando, e o fato verificável convence mais que o
  adjetivo. A Collina convence mais que a home justamente por isso.

### Toda página interna fecha no mesmo par: realizações e formulário

- **Como é feito:** faixa "Realizzazioni" e formulário "CONTATTACI" no fim de todas as internas; na página de projeto,
  "Lasciati ispirare da altri progetti" antes do formulário.
- **Por que funciona:** quem chegou ao fim de qualquer página tem dois caminhos prontos: ver mais trabalho ou falar.

### Menu com dois caminhos

- **Como é feito:** à esquerda a lista institucional numerada; à direita os 4 serviços.
- **Por que funciona:** atende quem chega querendo conhecer a empresa e quem chega sabendo o que precisa ("quero
  reformar").

### Linha do tempo com o ano gigante ao fundo

- **Como é feito:** slider de marcos datados, com o ano em branco e os dois últimos dígitos enormes, em cinza, atrás.
- **Por que funciona:** a antiguidade vira elemento visual. **Só funciona com marcos reais e datados**, que a
  Tecnoarreda tem (1988 a hoje).

---

## Tipografia e cor

- **Famílias (medidas no estilo computado):** display **Astetes** (serifa de alto contraste, com ligaduras decorativas
  no TT, SS e TI); corpo **Anek Bangla** (sans geométrica, peso leve, com negrito para destacar termos técnicos dentro
  do parágrafo); notas manuscritas em **Nothing You Could Do** (caixa alta).
- **Escala (medida):** H1 de 129,6px, H2 de 53,8px, títulos gigantes de 140 a 172,8px. Caixa alta nos títulos de
  seção, caixa baixa nas frases. O contraste entre display e corpo é extremo.
- **Cor:** fundo do `body` `rgb(13,13,13)` (`#0D0D0D`, quase preto) em todas as páginas, texto branco (medidos).
  *Aparentes, não medidos:* cinza médio nos estados apagados (verbos fora do hover, a segunda linha do wordmark, o "A"
  de fundo) e cinza escuro, por volta de `#1A1A1A`, na caixa do formulário.
- **Quantos acentos de verdade:** nenhum. O único acento é a própria foto.
- **Mobile:** com as fontes carregadas, mantém a mesma família. Numa captura com quatro abas em paralelo os títulos
  caíram para Arial; sozinho, o carregamento foi confirmado (Astetes "loaded").

---

## O que serve à Débora Reis

### A diferença de propósito, antes de copiar qualquer coisa

A Tecnoarreda é uma empresa com equipe, duas sedes e 35 anos, que vende obra completa (projeto, construção, reforma,
mobiliário) a dono de vila e chalé. A Débora é **uma profissional só**, que faz projeto de interiores, acompanhamento
de obra e decoração de apartamento em Salvador. Por isso se aproveitam a **estrutura** (serviço como fase com imagem
que prova, processo com foto por etapa, tese do responsável único, página de projeto que explica a decisão) e se deixa
de lado a **escala e o tom** (luxo genérico, preto absoluto, portfólio sem ficha).

**O propósito do site dela, visto por este teardown:** fazer quem pensa em reformar entender em segundos o que ela
faz e onde, reconhecer as etapas que vai receber, ver que é ela quem acompanha do começo ao fim, achar um projeto
parecido com o seu e chegar ao WhatsApp sem procurar.

### O que aproveitar, e como, conferido no esboço

> Conferido em 15/10/2026 no `index.html` e nas páginas de projeto de `clientes/_prototipos/debora-reis/site/`. Onde o
> esboço já resolve, fica dito; onde falta dado, o dado vem dela ou vira `[FALTA]`.

1. **Categoria no H1, frase poética embaixo.** O H1 da Tecnoarreda é o que o negócio é. Para a Débora, o H1 carrega o
   quê e onde (arquitetura de interiores, reforma de apartamento, Salvador). Quem chega pelo Google ou pelo Instagram
   decide em segundos se é aquilo que procura.
   - **No esboço hoje:** o H1 é "Casas com história. Interiores com identidade."; a categoria e a cidade estão no
     subtítulo ("Arquitetura de interiores em Salvador, desde 2004.") e no `<title>`. É o inverso da Tecnoarreda.
     Inverter ou manter é decisão do Marcelo; o argumento a favor de inverter é o teste dos três segundos.
2. **Os serviços como fases, cada um com a imagem da própria fase.** Os três serviços reais (projeto, acompanhamento de
   obra, decoração) em sequência, cada um com a imagem que prova a etapa: planta ou croqui, obra em andamento,
   ambiente pronto. Nunca banco de imagem.
   - **No esboço hoje:** "Como trabalho" já tem as 4 etapas (conversa e estudo, plantas técnicas, acompanhamento de
     obra, decoração), mas com **uma única foto fixa** da Débora no escritório. Nenhuma etapa tem a sua imagem.
     `[FALTA: croqui ou planta técnica da Débora]` e `[FALTA: foto de obra em andamento da Débora]`.
3. **O tamanho como argumento: a mesma pessoa do começo ao fim.** A tese da Tecnoarreda é "um único referente, do
   projeto à entrega". Num escritório de uma pessoa isso é ainda mais verdadeiro. Deve ser o primeiro bloco racional
   depois da abertura, com mais destaque visual do que a Tecnoarreda deu.
   - **No esboço hoje:** a frase existe ("Escritório de uma pessoa só: da primeira conversa à última almofada, quem
     desenha é quem atende."), mas está no cartão da seção "A arquiteta", a sétima de nove. Subir a ideia é o ganho.
     O acompanhamento de obra está confirmado (site dela); o que não está confirmado é se ela coordena pedreiro e
     marceneiro. Só se promete o que ela confirmar.
4. **Processo com o que o cliente recebe em cada etapa, na home.** A Tecnoarreda esconde o processo numa página
   interna.
   - **No esboço hoje:** está na home e a etapa 02 já diz o que se recebe (plantas construtivas, de gesso, de
     paginação, pontos elétricos e luminotécnicos), com link para o guia de prazos e valores. Aqui o esboço está à
     frente da referência.
5. **Os medos de quem reforma, respondidos um por um.** Para apartamento em Salvador: obra que atrasa, orçamento que
   estoura, regras e aprovação do condomínio, ter de gerenciar pedreiro e marceneiro. Só entra o que ela faz de
   verdade; o resto vira pergunta para ela.
   - **No esboço hoje:** o FAQ tem 4 perguntas (o que recebo, você acompanha a obra, onde atende, como começa).
     Faltam prazo, como cobra, condomínio e quem contrata a obra (essa está no guia). Cada resposta nova:
     `[FALTA: resposta da Débora]`.
6. **A pessoa como marca: foto trabalhando, nome, formação e registro.** O fundador da Tecnoarreda aparece desenhando,
   não posando.
   - **No esboço hoje:** tem nome, "Arquiteta e urbanista, UFBA" e 2004; a foto é dela sorrindo no escritório. Não vi
     número do CAU no site: `[FALTA: número do CAU]`. Foto dela em trabalho (prancheta, obra, amostra de material), se
     existir: `[FALTA: foto da Débora trabalhando]`.
7. **Nota curta com seta apontando o detalhe.** A função é dirigir o olho para a decisão (a marcenaria sob medida, a
   iluminação indireta, a parede que saiu).
   - **No esboço hoje:** as anotações à mão já são a assinatura (La Belle Aurore, desde a rodada 4, vinda da Stanzza)
     e são mais concretas que as da Tecnoarreda ("o corredor do Rio Vermelho", "a cerâmica feita à mão"). Duas
     observações: a Tecnoarreda mostra que o recurso já está num site premiado, então ele só vira assinatura dela se
     usar a letra ou o traço de croqui dela; e as notas rendem mais quando apontam uma decisão do que quando nomeiam o
     objeto.
8. **Fotos sem legenda como vitrine, mas com saída.** O erro da galeria da Tecnoarreda é nenhuma foto levar ao projeto.
   - **No esboço hoje:** as 5 fotos flutuantes de "Nunca a mesma casa duas vezes" não têm link. As que já têm página
     (Rio Vermelho, Artesanato, Aconchego e as outras que o Marcelo confirmar) podem abrir a página daquele projeto.
9. **Página de projeto com o raciocínio, mais curta e com ficha.** Ordem útil para reforma: o que o cliente pediu, qual
   era o problema do apartamento, o que foi decidido e por quê, o resultado. Mais o que a Tecnoarreda não tem: antes e
   depois e ficha visível.
   - **No esboço hoje:** as fichas existem, mas parciais (Rio Vermelho: bairro, o que mudou, fotógrafo; Colorir e
     Aconchego: o que é, o que tem, fotógrafo). Faltam metragem, ano, escopo e prazo: `[FALTA: metragem, ano, escopo
     e prazo de cada projeto, dados pela Débora]`. Antes e depois: `[FALTA: fotos de antes, se ela tiver]`.
10. **Fato no lugar de adjetivo.** A Collina convence mais que a home porque tem fato. Cada projeto e cada argumento da
    Débora com pelo menos um fato verificável dado por ela. Teste para cada título da home: serve para qualquer
    escritório? Os candidatos ao teste no esboço são o H1 e o título do contato ("Um lugar no mundo para pousar e
    repousar").
11. **Toda seção-chave e o fim de cada página com o caminho para o WhatsApp.** É justamente onde a Tecnoarreda falha.
    - **No esboço hoje:** resolvido na home: "Conversar" fixo no cabeçalho, botão no cartão da arquiteta, "Chamar no
      WhatsApp" no contato e o número no rodapé. O botão do WhatsApp saiu do rodapé em 15/10 (`CLAUDE.md` do
      protótipo); o número continua lá.
12. **Rodapé como cartão de visita completo.** Endereço com link para o mapa, telefone clicável, e-mail, redes e
    registro profissional.
    - **No esboço hoje:** número, e-mail e Instagram no rodapé; endereço (Rua Aracaju, 34, Barra) no menu e no cartão
      da arquiteta. Não vi link para o mapa. Falta o CAU (item 6).
13. **Dois caminhos de navegação.** O menu pode oferecer o trabalho (projetos) e a necessidade (projeto, obra,
    decoração).
    - **No esboço hoje:** o menu tem Projetos, Como trabalho, Conte a sua casa, A arquiteta e Contato. "Conte a sua
      casa" já funciona como entrada pela necessidade; um caminho por serviço é opcional num site de uma página.

### Fotos em tela cheia: o aviso que a Tecnoarreda dá de graça

Os close-ups ampliados da Villa Linear perdem nitidez mesmo num site premiado. O esboço tem a mesma pendência
registrada: as fotos da Débora vêm do Instagram (1080px) e ficam suaves em tela cheia. Antes de publicar de verdade,
pedir os originais do fotógrafo (Roberto Moreira Rego), como já está no `CLAUDE.md` do protótipo. Até lá, preferir
composições em que a foto não passe da largura que ela aguenta.

---

## O que não copiar

- **Frase de luxo que serve a qualquer escritório** ("Design esclusivo, emozioni senza tempo", "opera d'arte", "creare
  eccellenza"). Não diz o que é, para quem nem onde.
- **Home sem nenhum chamado de contato acima do rodapé**, sem telefone ou WhatsApp no cabeçalho.
- **Fotos de trabalho que não levam a lugar nenhum** (a galeria da home não tem clique).
- **Portfólio com o nome só no hover e sem ficha** (tipo, bairro, metragem, ano, escopo). O cliente procura um caso
  parecido com o dele e não acha.
- **Página de reforma sem antes e depois.**
- **Página de projeto de cerca de 38.000px**, com close-ups ampliados que perdem nitidez. Melhor menos fotos, nítidas
  e na proporção certa.
- **Seção pinada que gasta cerca de 2400px de scroll numa única foto sem informação.** Para quem precisa de cliente, o
  scroll é caro: cada tela tem de entregar alguma coisa. Ver a régua de `_memoria/design/60-motion.md`.
- **Informação que só existe com mouse** (imagem no hover dos serviços, nome no hover do projeto). No celular, por
  onde chega o cliente do Instagram, ela some.
- **Selo de prêmio do site fixo na tela.** Não vende arquitetura ao cliente final e, no mobile, cobre o texto dos
  títulos.
- **Assinatura em script que vaza para fora da tela no mobile.**
- **A escala da Tecnoarreda** ("squadra di architetti, ingegneri", duas sedes, 35 anos, quatro países). A Débora
  trabalha sozinha; escrever "nossa equipe" seria inventar.
- **Tema 100% preto porque o site premiado é preto.** Lá funciona com fotos de vila iluminadas à noite; a paleta da
  Débora vem da marca dela.
- **A missão, que é o argumento que mais vende, como a seção mais apagada da home.**

---

## Aplicado onde

Ainda não. Estudado em 15/10/2026 para o esboço da Débora Reis (`clientes/_prototipos/debora-reis/`, no ar em
https://esboco-debora-reis.vercel.app). Candidatos à aplicação: uma imagem por etapa em "Como trabalho" (depende do
material dela), a frase "escritório de uma pessoa só" subindo para logo depois da abertura, link nas fotos de "Nunca a
mesma casa duas vezes", ficha completa nos projetos e o H1 com a categoria (decisão do Marcelo). Preencher quando
acontecer, com a adaptação feita.

Prints (34 telas, somem com a sessão):
`/tmp/claude-0/-home-user-HorusOS-Pro/ada53c37-1efb-518e-8aec-f8416f2ef82e/scratchpad/ref/tecnoarreda/`
