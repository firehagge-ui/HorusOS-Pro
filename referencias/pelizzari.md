# Teardown: Pelizzari Studio (interiores e arquitetura sob medida, Brescia e Milão)

- **URL:** https://www.pelizzari.com/
- **Segmento:** interiores e arquitetura residencial, de hotelaria e de varejo, sob medida (casas, villas, hotéis
  boutique, bares, lojas), com linha própria de design de produto. Escritório italiano de mercado alto, desde 1991,
  com **duas sedes (Brescia e Milão) e equipe de 16 pessoas**. Não é escritório de uma pessoa.
- **Estudado em:** 15/10/2026, com o Playwright: home em desktop 1440x900, do preloader ao rodapé, mais o menu aberto;
  home em mobile 390x844 até o rodapé; `/portfolio/` com rolagem completa; o projeto `/portfolio/retrospettiva-sul-lago/`
  do topo ao crédito do fotógrafo; `/studio/`; `/contatti/`; `/press`. Nota técnica: com user-agent falso de Chrome
  126 o servidor respondia 403; com o user-agent padrão do Playwright carregou normalmente.
- **Stack vista:** GSAP (SplitText e ScrollTrigger na revelação de texto) e iubenda para cookies e privacidade. O
  estúdio que fez o site não foi registrado, e o prêmio do site não foi conferido.
- **Nota:** 7/10. É o site do lote que mais trabalha como **portfólio comercial**: prova de terceiros logo depois do
  hero, ficha em cada projeto, contato no menu e formulário em todas as páginas. Perde pontos pelo preloader de 4 s
  com o banner de cookies por cima, pela promessa de método que não se cumpre, pelo portfólio de 53 projetos sem
  filtro e pela página de projeto que termina sem saída própria.
- **Contexto:** estudado a pedido do Marcelo para o site da Débora Reis (`clientes/_prototipos/debora-reis/`), no lote
  dos "outros sites" que ele pediu além dos três que mandou ([Normal is Boring](normalisboring.md),
  [Tecnoarreda](tecnoarreda.md) e Stanzza). A pergunta dele: qual o propósito de cada seção, como as imagens aparecem
  e se falta informação no site da Débora.

**Em resumo:** o Pelizzari fala com cliente de alto padrão (famílias donas de villa, empresários de hotel e varejo) e
trabalha em três frentes. **Provar autoridade por terceiros** (imprensa antes de qualquer autodescrição), **mostrar
volume e consistência de obra** (53 projetos, cada um com ficha e dezenas de fotos) e **deixar o contato sempre a um
passo** (endereço e telefone das duas sedes dentro do menu, formulário no rodapé de todas as páginas). O texto é curto
e vem depois da imagem: a foto argumenta, e o texto só nomeia o que o escritório faz (projeto, direção de obra e
marcenaria sob medida). Usa os recursos de site premiado (preloader de imagens, revelação de texto no scroll,
tipografia gigante) a serviço de venda, não de pose de galeria.

---

## Estrutura, na ordem

### Fixo em todas as páginas

**1. Cabeçalho e menu em cartão.**

- **Mostra:** à esquerda, o botão de idioma (EN / Lingua); no centro, o logo PELIZZARI STUDIO®; à direita, "Menu ···".
  O menu abre um cartão branco flutuante à direita (não ocupa a tela toda) com Home, Studio, Portfolio, Product
  Design, Press, Contatti e, embaixo, as duas sedes: Milão (Via Senato 24, telefone) e Brescia (Corso Matteotti 54,
  telefone), cada uma com a foto do escritório.
- **Para quê:** **endereço e telefone a um clique de qualquer ponto do site**, sem precisar ir até a página de
  contato. A foto do escritório real é prova de existência física, e isso pesa para quem vai entregar a casa a
  alguém.
- **Como é montado:** barra fixa transparente em 3 zonas. O menu é um overlay em cartão com 2 blocos: a navegação em
  fonte grande (cerca de 32px) e uma grade de 2 colunas com as sedes. Nas páginas internas, "BACK TO HOME" ou "BACK TO
  PORTFOLIO" no canto superior esquerdo.
- **Imagem:** duas fotos pequenas e iguais dos escritórios, sem legenda além do nome da cidade.

**11. Rodapé escuro com formulário completo** (descrito no fim da home, mas se repete em todas as páginas).

### Home

**0. Preloader com imagens empilhadas.**

- **Mostra:** fundo creme e só o logo no topo. No centro, uma moldura troca de foto a cada fração de segundo (fotos de
  projetos diferentes, uma sobre a outra) e cresce a cada troca, até a última virar a foto cheia do hero. Dura cerca
  de 4 s.
- **Para quê:** antes de qualquer palavra, o visitante vê de 5 a 6 projetos. **A primeira mensagem é volume e
  variedade de obra, não slogan.** Também cobre o carregamento das imagens pesadas.
- **Como é montado:** tela cheia, um elemento único central, animação por tempo (GSAP), sem interação. O banner de
  cookies da iubenda aparece por cima depois de uns 2 s e trava o scroll até ser aceito.
- **Imagem:** sobreposição pura: cada foto entra por cima da anterior, maior, sem legenda nem nome do projeto.
  Funciona como um flipbook de portfólio.

**2. Hero: nome gigante, foto sangrada e os 3 serviços.**

- **Mostra:** "Pelizzari Studio" em sans de 187px ocupando a largura toda e, logo abaixo, uma foto de 1440x900
  sangrada nas bordas (salão rústico de hotel com vigas de madeira). Por cima da foto, numa linha só, os três
  serviços em caixa alta: INTERIOR DESIGN / ARCHITECTURE / PRODUCT DESIGN.
- **Para quê:** responder **quem é e o que faz em um olhar**, sem headline de promessa. A foto, de um projeto
  publicado, é a tese. Não há botão: o próximo passo é rolar.
- **Como é montado:** bloco tipográfico em cima (cerca de 50% da primeira dobra) e a foto ocupando o resto, continuando
  abaixo da dobra. Os rótulos de serviço ficam na borda superior da foto, distribuídos à esquerda, ao centro e à
  direita (justify-between). Há 5 slides empilhados no DOM, mas só um aparece depois do preloader.
- **Imagem:** uma foto sangrada, sem legenda e sem nome do projeto.
- **Copy:** "Pelizzari Studio — INTERIOR DESIGN · ARCHITECTURE · PRODUCT DESIGN"

**3. Faixa de logos de imprensa (marquee).**

- **Mostra:** logos de veículos em caixas cinza com borda fina, rolando sozinhos na horizontal: Architizer, Corriere
  della Sera, Il Sole 24 Ore, Elle Decor, Io Donna, Rai, Lamasat, BBC, Archilovers, Sky, AD, Houzz, Archello, Andrew
  Martin.
- **Para quê:** **autoridade emprestada logo depois do hero, antes de o escritório falar de si.** É o "saiu na
  imprensa" sem nenhuma frase.
- **Como é montado:** uma linha de caixas de 193x100, duplicada para o loop infinito, colada na base da foto do hero.
  Os logos não são links.
- **Imagem:** logos em tons de cinza dentro de caixas iguais, o que tira o peso das cores das marcas.

**4. Manifesto curto e botão ABOUT.**

- **Mostra:** duas frases centralizadas, com as palavras-chave (know-how, progetto) em serifa itálica bold. Depois, o
  botão-pílula ABOUT, que leva a `/studio/`.
- **Para quê:** posicionar em uma linha: **cada projeto é diferente, não há estilo de assinatura repetido.** Isso
  antecipa a objeção "vai ficar com a cara do escritório e não com a minha".
- **Como é montado:** texto centralizado em cerca de 35px. As palavras passam de cinza para preto uma a uma conforme o
  scroll (SplitText com ScrollTrigger). Muito respiro acima e abaixo.
- **Imagem:** nenhuma.
- **Copy:** *"Profondo know-how ed eclettismo, questa la forte distinzione che caratterizza ogni progetto. Una
  narrazione varia, perché ripetitivo, in Pelizzari Studio, non esiste."* ("know-how profundo e ecletismo, essa é a
  distinção que marca cada projeto; uma narrativa variada, porque repetitivo, no Pelizzari Studio, não existe")

**5. Faixa de fotos em alturas alternadas.**

- **Mostra:** cinco fotos lado a lado, alternando retrato alto e paisagem baixa alinhada pela base: sala de jantar
  vista por uma porta de correr, living, a foto de um casal em retrato de estúdio e uma fachada de pedra. A faixa
  sangra pelas duas bordas da tela. (Pela página Studio, o casal é provavelmente a fundadora e o CEO; é hipótese,
  não há legenda.)
- **Para quê:** é uma **pausa de clima** entre o manifesto e o portfólio. Mistura obra e pessoas para humanizar sem
  fazer seção de equipe na home. O corte nas bordas sugere que há muito mais.
- **Como é montado:** 5 colunas de 345px com 15px de vão; retratos de 518px de altura e paisagens de 230px, deslocados
  na vertical. É estática (a posição horizontal medida em 4 passos de scroll não mudou). Sem links.
- **Imagem:** sem legenda, sem nome de projeto, sem clique: a imagem só ambienta. Cruzes "+" finas marcam a grade
  embaixo, como marcas de prancha técnica.

**6. Divisor "Discover / Works".**

- **Mostra:** "Discover" em sans gigante e "Works" em serifa itálica gigante, empilhados. Entre eles, em corpo
  minúsculo: "PELIZZARI 1991 ––– 2026 STUDIO". Nas laterais, duas caixas quadradas vazadas escritas VEDI PROGETTI. As
  cruzes "+" formam uma grade de referência.
- **Para quê:** abrir o portfólio como capítulo e **enfiar o tempo de casa (35 anos) sem a frase "há 35 anos no
  mercado"**. As duas caixas laterais são atalho para quem já quer a lista inteira.
- **Como é montado:** bloco de tela quase cheia, simétrico, com o contraste de duas famílias (sans reta contra serifa
  itálica). É o mesmo par que se repete em todos os títulos do site: Know/How, Puoi/trovarci, Let's/Connect,
  Port/folio.
- **Imagem:** nenhuma.
- **Copy:** "Discover — PELIZZARI 1991 ––– 2026 STUDIO — Works"

**7. Quatro projetos em destaque, em grade desencontrada.**

- **Mostra:** Retrospettiva sul lago, Borromei 9, Regrub Milano e Il Mansio – Vegan Boutique Hotel. Embaixo de cada
  foto, uma linha com o código do projeto (2323, 2502, 2510, 2131), o nome e "View project". Depois, a pílula VEDI
  TUTTI I PROGETTI.
- **Para quê:** uma **amostra curada que mistura residência, bar e hotel** para mostrar amplitude. O código numérico
  passa ideia de arquivo e de volume sem precisar dizer "mais de 50 projetos". (Pela forma, o código parece ano mais
  sequência, 2502 = 2025/02; é hipótese.)
- **Como é montado:** 2 colunas de 685px. A da esquerda vem paisagem e depois retrato; a da direita, retrato e depois
  paisagem. As fotos nunca se alinham (masonry desencontrado). Nenhum efeito de hover visível no headless.
- **Imagem:** fotos grandes, profissionais, sem texto por cima. A legenda é só código e nome, sem local, tipo nem
  área.

**8. "Know / How": o que o escritório faz de fato.**

- **Mostra:** "Know" alinhado à esquerda e "How" em itálico alinhado à direita, nas bordas opostas. Embaixo, uma foto
  grande à esquerda (canto de living) e, à direita, um parágrafo de cerca de 35px dizendo que o escritório cuida
  direto do projeto e da direção de obra no canteiro, coordena as equipes e acompanha do levantamento ao executivo e à
  marcenaria sob medida. Depois, dois subtítulos em itálico, "Nulla lasciato al caso" ("nada deixado ao acaso") e
  "Forze fondanti" ("forças fundadoras"), com textos curtos, uma foto P&B de escadaria histórica e a pílula SCOPRI IL
  NOSTRO METODO.
- **Para quê:** responder à dúvida prática de quem vai reformar: **"vocês só desenham ou tocam a obra?"**. É a única
  seção da home que descreve o serviço.
- **Como é montado:** assimétrica: foto ocupando cerca de 45% da largura à esquerda, texto em coluna estreita à
  direita, foto pequena vertical na extrema direita. O parágrafo principal tem a mesma revelação de cinza para preto
  no scroll.
- **Imagem:** duas fotos sem legenda, uma de detalhe de interior (cor) e uma de arquitetura histórica (P&B). Comunicam
  repertório, não um projeto específico.
- **Copy:** *"Lo studio si occupa direttamente della progettazione e direzione lavori in cantiere, coordinando le
  diverse maestranze..."* ("o escritório cuida diretamente do projeto e da direção de obra no canteiro, coordenando as
  diferentes equipes")
- **A falha:** o botão SCOPRI IL NOSTRO METODO ("conheça nosso método") leva a `/studio/`, que não descreve método
  nenhum, só 6 diferenciais. A promessa do botão não se cumpre.

**9. "Puoi trovarci": capas de revista.**

- **Mostra:** seis capas (Andrew Martin, Marie Claire Maison, Forte International, Hotel Domani, Platform, The Plan),
  cada uma num cartão com borda, com o nome do veículo e o mês/ano, todas de 2026. Cada capa abre o PDF da matéria.
  Depois, a pílula SCOPRI TUTTE LE PRESS.
- **Para quê:** **segunda camada de prova, agora verificável**: o logo da faixa vira matéria que se pode ler. As datas
  recentes mostram que o escritório está ativo hoje.
- **Como é montado:** 6 colunas de cartões iguais, capa centralizada dentro de cada cartão, legenda em duas linhas
  (veículo grande, data pequena).
- **Imagem:** capas pequenas, centralizadas em cartão neutro. O cartão padroniza capas de cores e formatos muito
  diferentes.

**10. "Let's Connect" e newsletter com isca.**

- **Mostra:** o fundo muda para branco. "Let's" em sans e "Connect" em itálico, gigantes. Uma faixa de 6 fotos
  pequenas e iguais (lareira, objeto de produto, a foto da equipe completa, quarto, living, sala com arco), sem link.
  Depois, o convite para a newsletter, com o subtítulo em itálico que diz o que se ganha: a apresentação da empresa
  por e-mail. Campo de e-mail, checkbox de privacidade e o botão INVIA RICHIESTA.
- **Para quê:** **capturar quem ainda não vai pedir orçamento.** A isca é a apresentação institucional em PDF, um
  motivo concreto para deixar o e-mail, e assim o escritório ganha uma lista para nutrir.
- **Como é montado:** bloco centralizado. A troca de cor de fundo marca a passagem de "ver" para "agir". No mobile a
  faixa de fotos some e fica só o formulário.
- **Imagem:** miniaturas do mesmo tamanho, sem legenda: amostra de clima, inclusive com a foto do time, para lembrar
  que há pessoas do outro lado.
- **Copy:** *"Iscriviti alla newsletter per rimanere sempre aggiornato sui nostri progetti"* / *"riceverai al tuo
  indirizzo email la nostra company presentation"* ("assine a newsletter para acompanhar nossos projetos" / "você vai
  receber no seu e-mail a nossa apresentação")

**11. Rodapé escuro com formulário completo (em todas as páginas).**

- **Mostra:** fundo `#111` e logo branco. À esquerda, o formulário: menu "Scegli richiesta" (Richiesta informazioni /
  Invio candidature / Proposta fornitori / Press), Nome e Cognome*, Azienda, E-mail*, Telefono*, Messaggio*, anexo de
  arquivo de até 8MB, aceite de privacidade e INVIA MESSAGGIO. À direita, as colunas COMPANY (Home, Studio, Contatti)
  e WORKS (Portfolio, Product Design). Embaixo, direitos, "Made In Italy – Milano / Brescia", redes (Instagram,
  Facebook, Pinterest), cookies, credits, privacy e o nome "Pelizzari Studio" gigante em cinza escuro, cortado na borda
  inferior.
- **Para quê:** **toda página termina em contato**, então o visitante nunca chega a um beco sem saída. O menu de tipo
  de pedido separa cliente de candidato, fornecedor e jornalista antes de chegar à caixa de entrada. O anexo deixa o
  cliente mandar planta ou foto do imóvel já no primeiro contato.
- **Como é montado:** 2 colunas (formulário com cerca de 50%, links à direita), campos só com a linha inferior e
  placeholder grande. O mesmo bloco se repete em todas as páginas.
- **Imagem:** nenhuma.

### Páginas internas

**12. Portfolio.**

- **Mostra:** 53 projetos, cada um com código, nome e foto de capa, em carregamento contínuo.
- **Para quê:** ser o arquivo de prova de volume.
- **Como é montada:** linhas que alternam 2 fotos grandes e 3 menores, todas em paisagem (ritmo 2-3-2). **Sem filtro**
  por tipo (residencial, hotel, varejo) ou cidade, e o card não diz local nem tipo.
- **Efeito:** a variação de escala evita a monotonia de 53 cards iguais, mas a lista vira catálogo para folhear, não
  para achar um caso parecido com o meu.

**13. Página de projeto (Retrospettiva sul lago).**

- **Mostra:** foto em tela cheia com uma faixa de legenda sobreposta embaixo (código, nome, cidade). Uma ficha curta:
  Cliente (Private), Luogo (Como, Italy), Data (2026), Tipo di progetto (Residential). O texto em narrativa: a
  situação anterior, o desejo dos donos, o que foi feito, os materiais, a paleta e a duração da obra ("oltre un
  anno", mais de um ano), com "Read more" para o texto longo. Depois, a galeria e, no fim, "PHOTOGRAPHER: GIORGIO
  BARONI".
- **Para quê:** é a página que **transforma foto bonita em caso**: a ficha diz o que é e onde, a narrativa diz o
  problema e a decisão, e o crédito do fotógrafo diz que a imagem é profissional.
- **Como é montada:** cerca de 24.600px de altura. Dezenas de fotos em 2 colunas, alternando foto de coluna inteira e
  foto menor centrada com margem, retrato e paisagem misturados, plano geral e detalhe. Cada foto entra com fade no
  scroll.
- **O que falta:** metragem, escopo (projeto, obra, mobiliário), antes e depois (mesmo sendo a requalificação de uma
  villa existente), link para o próximo projeto e um chamado contextual. A página termina no formulário genérico do
  rodapé.

**14. Studio.**

- **Mostra:** a página inteira em fundo `#111` com texto branco. Os tipos de projeto atendidos (casa, hotel, varejo).
  Os diferenciais numerados de 001 a 006: estilo atemporal, relação pessoal e transparência, gestão de prazo,
  atualização em cada fase, materiais exclusivos com respeito ao ambiente, sigilo garantido por contrato. Logo abaixo,
  a pílula CONTATTACI. Na seção Team, os 16 integrantes com nome, cargo (fundadora e concept designer, CEO e
  arquiteto, arquitetos, designers, administração) e retrato, e a foto do time inteiro com o cachorro. Citações de
  terceiros (Saint-Exupéry, Serge Lutens, Meredith Heron).
- **Para quê:** responder **quem faz e como se comporta**: relação, prazo, atualização, sigilo. O sigilo por contrato
  fala direto com o cliente de villa que não quer a casa exposta.
- **Como é montada:** os diferenciais em lista numerada com a pílula de contato logo depois. A equipe em duas colunas:
  retratos à esquerda, lista fixa de nomes à direita (ver "Como as imagens aparecem").
- **A falha:** é para cá que leva o botão "conheça nosso método", e aqui não há método: não há etapas, prazo típico
  nem como começa. Os 6 diferenciais são promessas sem prova ao lado.

**15. Contatti.**

- **Mostra:** as duas sedes com endereço completo, CEP, telefone fixo e a foto de cada escritório, e o formulário.
- **Para quê:** converter quem já decidiu e provar que há dois lugares físicos.
- **O que falta:** e-mail escrito (só formulário), WhatsApp, mapa e horário de atendimento.

**16. Press.**

- **Mostra:** 79 publicações datadas, cada capa abrindo o PDF da matéria.
- **Para quê:** ser o lastro da faixa de logos da home: quem desconfia pode conferir.

### Comparando com `_memoria/design/00-anatomia.md`

- **Hero:** a anatomia pede o que é, para quem e o que fazer, em três segundos, com prova ao lado. O Pelizzari
  responde **quem é e o que faz** (nome e 3 serviços) e põe a prova **logo embaixo** (a faixa de imprensa colada na
  foto). Para quem e o que fazer, não: sem cidade no hero, sem CTA.
- **Para quem é:** não há seção. O mais perto são os tipos de projeto no Studio (casa, hotel, varejo) e a mistura de
  residência, bar e hotel nos destaques.
- **O que fazemos:** os 3 rótulos do hero e a seção Know How (projeto, direção de obra, marcenaria sob medida). Sem
  uma linha por serviço na home.
- **Como começa:** **não existe**, e o site promete que existe (o botão do método). Nenhuma etapa, prazo, faixa de
  investimento ou explicação do primeiro contato.
- **Quem faz:** completo: 16 nomes com cargo e retrato, mais a foto do time. Registro profissional não visto.
- **Como é / onde é:** duas sedes com endereço, CEP, telefone e foto, dentro do menu e em Contatti. Sem mapa nem
  horário.
- **FAQ:** não existe.
- **Contato:** o mais forte do lote: no menu (endereço e telefone), em toda página (formulário do rodapé) e em duas
  trilhas (formulário para quem está pronto, isca para quem não está). Mas sem WhatsApp e sem CTA no hero.
- **Encenar a prova:** a imprensa em duas camadas (logo e depois capa com PDF datado) e o preloader que mostra 5 a 6
  projetos antes de qualquer palavra.
- **Vender o freio:** aparece em três pontos. O manifesto antecipa "vai ficar com a cara de vocês e não com a minha";
  o Know How responde "vocês só desenham?"; o sigilo por contrato responde "minha casa vai aparecer no site?".

**A diferença de fundo:** Normal is Boring e Tecnoarreda deixam a home para o clima e a informação para as internas.
O Pelizzari faz o inverso na ordem da home: **prova primeiro, autodescrição depois, e contato em toda tela**. O clima
existe (preloader, faixa de fotos), mas cada bloco racional da home responde a uma dúvida de compra. O
elemento-assinatura é o **par tipográfico nos títulos** (sans reta e serifa itálica, Discover/Works, Know/How,
Let's/Connect), reforçado pelas cruzes "+" de prancha técnica.

---

## Como as imagens aparecem

O site tem **quatro regimes de imagem**, cada um com uma função:

1. **Na home, imagem como volume e clima, sem legenda.** O preloader empilha projetos, a faixa de alturas alternadas
   mistura obra e pessoas, as miniaturas do Let's Connect ambientam. Nenhuma diz de que obra é. É o que o Marcelo
   descreveu: imagens que se sobrepõem para mostrar trabalho, sem explicar o conteúdo.
2. **Nos destaques e no portfólio, imagem com legenda mínima** (código e nome). Já é um índice: cada foto leva a um
   projeto.
3. **No projeto, imagem sem legenda individual, explicada pela ficha e pela narrativa acima**, e assinada pelo
   fotógrafo no fim.
4. **Material de terceiros (logos, capas) padronizado em cartão neutro**, para não brigar com as fotos de obra.

Em nenhum regime há texto por cima da foto, a não ser rótulos mínimos (os 3 serviços no hero, a faixa de legenda no
topo do projeto). Os padrões, na ordem em que valem mais para o pedido do Marcelo:

### Preloader em pilha crescente

- **Onde:** entrada da home.
- **Como funciona:** fotos de projetos diferentes entram uma por cima da outra numa moldura central que cresce a cada
  troca. A última se expande e vira a foto do hero.
- **Efeito:** o visitante vê vários projetos em 4 s, antes de ler qualquer coisa: volume de obra como primeira
  mensagem. **O custo:** atrasa o conteúdo, e o banner de cookies entra por cima no meio da animação e trava o scroll.

### Faixa desencontrada sem legenda

- **Onde:** home, entre o manifesto e "Discover Works".
- **Como funciona:** 5 fotos em linha, alternando retrato alto e paisagem baixa alinhada pela base, cortadas nas
  bordas da tela. Sem link e sem nome.
- **Efeito:** respiro de clima que mistura obra com o retrato dos sócios. O corte lateral sugere continuidade (há mais
  do que cabe).

### Masonry de 2 colunas com proporções invertidas

- **Onde:** projetos em destaque na home.
- **Como funciona:** coluna A com paisagem e depois retrato; coluna B com retrato e depois paisagem. As bases nunca se
  alinham. Legenda numa linha: código, nome, "View project".
- **Efeito:** quebra a grade de cards iguais (cara de template) e mantém o ritmo de revista com só 4 itens.

### Galeria editorial longa sem legenda

- **Onde:** projeto individual (Retrospettiva sul lago, cerca de 24.600px de altura).
- **Como funciona:** dezenas de fotos em 2 colunas, alternando foto de coluna inteira e foto menor centrada com
  margem, retrato e paisagem misturados, planos gerais e detalhes (puxador de latão, vaso, lavabo, a vista do lago, o
  cachorro dos donos). Cada foto entra com fade no scroll. Nenhuma legenda por foto. Termina com "PHOTOGRAPHER:
  GIORGIO BARONI".
- **Efeito:** simula andar pela casa e mostra que o escritório cuida do detalhe, não só da sala de capa. O cachorro e
  a vista dão vida real ao lugar. O crédito do fotógrafo reforça que a imagem é profissional.

### Foto sangrada sob título tipográfico

- **Onde:** hero da home e topo de cada projeto.
- **Como funciona:** título ou nome em tipografia gigante sobre fundo liso e, colada embaixo, uma foto de borda a
  borda. No projeto, a foto ocupa a tela toda e ganha uma faixa de legenda sobreposta embaixo (código, nome, cidade).
- **Efeito:** separa "quem" (tipografia) de "prova" (foto) sem pôr texto em cima da imagem, a não ser rótulos
  mínimos.

### Grade de ritmo 2-3-2

- **Onde:** página Portfolio.
- **Como funciona:** linhas que alternam 2 fotos grandes e 3 menores, todas em paisagem, com carregamento contínuo até
  53 projetos.
- **Efeito:** a variação de escala evita a monotonia de 53 cards iguais. Sem filtro nem local, porém, a lista é para
  folhear, não para achar.

### Retratos P&B com lista de nomes que acende no scroll

- **Onde:** Studio, seção Team.
- **Como funciona:** à esquerda, uma grade de 2 colunas de retratos P&B de corpo inteiro no escritório. À direita, uma
  lista fixa (sticky) com nome e cargo dos 16 integrantes, que acende em branco o nome do retrato que está passando.
- **Efeito:** apresenta uma equipe grande sem 16 cards com bio. O P&B uniformiza fotos tiradas em lugares diferentes.
  Depois vem a foto do time inteiro com o cachorro, que fecha com calor humano.

### Cartão neutro para material de terceiros

- **Onde:** faixa de logos e capas de imprensa.
- **Como funciona:** logos e capas dentro de caixas de borda fina do mesmo tamanho, sobre o fundo creme, com os logos
  em cinza.
- **Efeito:** material de cores e formatos muito diferentes ganha cara de uma coisa só e não briga com as fotos de
  obra.

---

## Informação: o que tem e o que falta

**Tem:**

- Serviços: interior design, arquitetura e design de produto (hero e menu); projeto, direção de obra e marcenaria sob
  medida (Know How).
- Tipos de projeto: casa, hotel, varejo (Studio); residencial, hotelaria, bar e loja no portfólio.
- Tempo de casa (1991–2026), mostrado como marca, não como frase.
- Duas sedes com endereço completo, CEP, telefone fixo e foto do escritório, no menu e em Contatti.
- Imprensa: faixa de cerca de 14 logos e página Press com 79 publicações datadas, cada capa abrindo o PDF da matéria.
- Portfólio de 53 projetos com código, nome e foto de capa.
- Ficha de projeto: Cliente (Private), Luogo (Como, Italy), Data (2026), Tipo di progetto (Residential).
- Texto de projeto em narrativa: situação anterior, desejo dos donos, o que foi feito, materiais, paleta, duração da
  obra, com "Read more" para o texto longo.
- Crédito do fotógrafo por projeto.
- Diferenciais numerados de 001 a 006 (estilo atemporal, relação pessoal e transparência, gestão de prazo, atualização
  em cada fase, materiais exclusivos com respeito ao ambiente, sigilo garantido por contrato).
- Equipe: 16 nomes com cargo, retrato de cada um e foto do time.
- Formulário com triagem por tipo de pedido, telefone obrigatório e anexo de arquivo.
- Newsletter com isca (a apresentação da empresa).
- Redes: Instagram, Facebook, Pinterest. Site bilíngue IT/EN.

**Falta:**

- Processo passo a passo. O botão "SCOPRI IL NOSTRO METODO" leva a uma página sem método.
- E-mail escrito em qualquer página vista (só o formulário) e WhatsApp.
- Mapa e horário de atendimento na página de contato.
- Área (m²) e escopo (projeto, obra, mobiliário) na ficha do projeto.
- Antes e depois, mesmo no projeto que é a requalificação de uma villa existente.
- Depoimento de cliente em qualquer lugar.
- Filtro do portfólio por tipo ou cidade; local e tipo no card.
- "Próximo projeto" e chamado contextual ("quer um projeto assim?") no fim da página do projeto.
- Faixa de investimento, prazo típico, como funciona o primeiro contato ou o orçamento.
- Perguntas frequentes.

---

## Navegação e conversão

- **Menu:** escondido atrás de "Menu ···", abre um cartão com 6 links (Home, Studio, Portfolio, Product Design,
  Press, Contatti) e o bloco das duas sedes com endereço, telefone e foto. O contato fica a um clique de qualquer
  página.
- **CTAs da home:** todos pílulas pretas pequenas, centralizadas e em caixa alta: ABOUT (`/studio/`), VEDI PROGETTI
  (as duas caixas laterais) e VEDI TUTTI I PROGETTI (`/portfolio`), SCOPRI IL NOSTRO METODO (`/studio/`), SCOPRI TUTTE
  LE PRESS (`/press`), INVIA RICHIESTA (newsletter) e INVIA MESSAGGIO (formulário do rodapé). Na Studio, a pílula
  CONTATTACI logo abaixo dos 6 diferenciais.
- **Dois trilhos de conversão:** (1) quem está pronto usa o formulário do rodapé, presente em toda página, com tipo de
  pedido, telefone obrigatório e anexo; (2) quem não está deixa o e-mail em troca da apresentação da empresa.
- **O que não há:** CTA no hero, botão flutuante, WhatsApp. O único elemento fixo na tela é o selo verde de
  privacidade da iubenda no canto inferior direito.

---

## O que copiar

### Prova de terceiros antes da autodescrição

- **Como é feito:** hero (nome, serviços, foto) → faixa de imprensa colada na base da foto → só então o manifesto.
- **Por que funciona:** quando o escritório começa a falar de si, o visitante já viu que outros falaram dele. A ordem
  faz o texto de posicionamento ser lido como confirmação, não como autopromoção.

### Prova em duas camadas: reconhecer, depois conferir

- **Como é feito:** primeiro os logos (reconhecimento rápido, sem clique); mais abaixo, as capas com veículo e mês/ano,
  cada uma abrindo o PDF da matéria; por fim, a página Press com 79 itens datados.
- **Por que funciona:** o logo sozinho é afirmação; a matéria que abre é verificação. As datas recentes respondem
  "ainda está ativo?". (A faixa de logos, sozinha, sem link, é enfeite; ver "O que não copiar".)

### Hero que nomeia, não promete

- **Como é feito:** o nome em 187px, os 3 serviços como rótulos de uma linha sobre a foto, e uma foto real de projeto
  publicado. Sem headline, sem adjetivo.
- **Por que funciona:** quem chega quer saber "o que é isso" e "como fica"; o rótulo responde o primeiro e a foto o
  segundo. Nada no hero pede para ser acreditado.
- **Copy:** "INTERIOR DESIGN · ARCHITECTURE · PRODUCT DESIGN"

### Uma seção só para "vocês tocam a obra?"

- **Como é feito:** "Know / How" diz, em um parágrafo grande, que o escritório faz o projeto e a direção de obra no
  canteiro, coordena as equipes e acompanha do levantamento à marcenaria sob medida.
- **Por que funciona:** é a dúvida mais cara de quem reforma, e ela ganha seção própria em vez de se perder no
  "sobre". A seção nomeia o que o cliente não vai precisar fazer sozinho.

### Contato dentro do menu, com a foto do lugar

- **Como é feito:** o cartão do menu traz, abaixo dos links, cada sede com endereço, telefone e uma foto do escritório.
- **Por que funciona:** quem abre o menu procurando "como falo com eles" acha sem trocar de página. A foto do escritório
  prova que há um lugar e pessoas reais.

### Toda página termina em formulário, com anexo

- **Como é feito:** o mesmo rodapé em todas as páginas, com tipo de pedido, campos mínimos e anexo de até 8MB.
- **Por que funciona:** não há beco sem saída. O anexo deixa o cliente mandar a planta ou a foto do imóvel já no
  primeiro contato, o que qualifica o pedido e encurta a primeira conversa. O tipo de pedido tira candidato e
  fornecedor da fila de clientes.

### Tempo de casa como marca, não como frase

- **Como é feito:** "PELIZZARI 1991 ––– 2026 STUDIO" em corpo minúsculo entre "Discover" e "Works".
- **Por que funciona:** o dado aparece sem o tom de propaganda de "há 35 anos no mercado". O visitante faz a conta
  sozinho.

### Código de projeto como sistema de arquivo

- **Como é feito:** cada projeto tem um número de quatro dígitos (2323, 2502, 2510, 2131) antes do nome.
- **Por que funciona:** sugere arquivo e volume sem afirmar quantidade, e dá um jeito de nomear projeto quando o
  cliente é "Private". (Só vale se o número tiver uma lógica real por trás, ano e sequência, por exemplo.)

### Ficha curta em cima, narrativa embaixo, crédito do fotógrafo no fim

- **Como é feito:** Cliente / Luogo / Data / Tipo em tabela; depois o texto: como estava, o que os donos queriam, o
  que foi feito, materiais, paleta, quanto durou a obra ("oltre un anno"); "Read more" para quem quer o texto longo;
  "PHOTOGRAPHER: GIORGIO BARONI" no fim.
- **Por que funciona:** a ficha responde "é parecido com o meu caso?" em segundos; a narrativa mostra o raciocínio; a
  duração da obra é um dado que quase ninguém publica e que o cliente quer saber.

### Galeria que alterna plano geral e detalhe, com vida real

- **Como é feito:** foto de coluna inteira, depois foto menor centrada com margem; sala inteira, depois o puxador de
  latão; e, no meio, a vista do lago e o cachorro dos donos.
- **Por que funciona:** o ritmo imita andar pela casa, o detalhe prova cuidado de execução, e a vida real (o bicho, a
  janela) tira o ar de showroom.

### Retrato dos donos misturado às fotos de obra

- **Como é feito:** na faixa de 5 fotos da home, o retrato do casal entra entre a sala de jantar e a fachada, no mesmo
  tamanho e sem legenda.
- **Por que funciona:** humaniza sem abrir uma seção "equipe" na home: quem faz aparece no meio do que faz.

### Duas trilhas de conversão

- **Como é feito:** formulário completo para quem está pronto; e-mail em troca da apresentação da empresa para quem
  não está.
- **Por que funciona:** quem ainda está pesquisando não vai pedir orçamento, mas aceita levar algo útil. A isca tem
  nome concreto, não é "assine nossa newsletter" vazio.

### Títulos em par como sistema

- **Como é feito:** a primeira palavra em sans reta, a segunda em serifa itálica, sempre do mesmo jeito (Discover/Works,
  Know/How, Puoi/trovarci, Let's/Connect, Port/folio).
- **Por que funciona:** a regra repetida em todas as seções dá identidade com um único recurso. O que se aproveita é a
  regra, não as fontes, que são pagas.

---

## Tipografia e cor

- **Famílias (medidas no estilo computado):** **Suisse Intl** (sans grotesca, peso 500) em tudo, do corpo de 14px aos
  títulos de 120 a 187px; **Suisse Works Bold Italic** (serifa) só para palavras de ênfase e para a segunda palavra dos
  títulos em par (Discover/Works, Know/How, Puoi/trovarci, Let's/Connect, Port/folio, Meravigliare/Sbalordire). As
  duas são comerciais (Swiss Typefaces) e **não podem ser copiadas sem licença**.
- **Escala:** corpo de 14px (medido), manifesto e Know How em cerca de 35px, links do menu em cerca de 32px, títulos de
  120 a 187px (medidos). O contraste entre título e corpo é extremo, e a única variação de família é a itálica de
  ênfase.
- **Cor (medida):** fundo `#F0EFEB` (creme acinzentado, rgb 240,239,235), texto `#111111`. Rodapé e a página Studio
  inteira em fundo `#111` com texto branco; a seção da newsletter em branco puro.
- *Aparentes, não medidos:* o cinza das palavras antes de acenderem no scroll; o cinza das caixas de logo e dos logos
  dentro delas; o cinza escuro do nome gigante cortado no rodapé; o verde do selo da iubenda.
- **Quantos acentos de verdade:** nenhum. O colorido vem só das fotos.
- **Ornamento:** cruzes "+" finas de 1px marcando a grade (medidas), *aparentemente* como referência a prancha técnica.

---

## O que serve à Débora Reis

### A diferença de propósito, antes de copiar qualquer coisa

O Pelizzari é um escritório de 35 anos, com duas sedes, 16 pessoas e 79 matérias de imprensa, que fala com dono de
villa e empresário de hotel. A Débora é **uma profissional só**, que faz projeto de interiores, acompanhamento de obra
e decoração de apartamento em Salvador. Por isso se aproveitam a **ordem e o mecanismo** (prova antes do texto, hero
que nomeia, uma seção para "você toca a obra?", contato no menu, ficha mais narrativa, retrato no meio da obra, duas
trilhas de conversão) e se deixa de lado a **escala** (imprensa, equipe, 53 projetos, código de arquivo).

**Uma coincidência que vale registrar:** o manifesto do Pelizzari ("repetitivo, no Pelizzari Studio, não existe") é a
mesma tese do título "Nunca a mesma casa duas vezes" do esboço. Isso confirma que a tese conversa com quem contrata
interiores, e avisa que ela é **da categoria, não exclusiva da Débora**. O que a torna dela é a prova que vem junto (os
livros, os gatos, o artesanato de cada casa), não a frase.

**O propósito do site dela, visto por este teardown:** provar que ela é de verdade e de confiança com o que dá para
conferir (formação, anos de prática, endereço, obras reais com ficha), mostrar que cada casa sai com a cara de quem
mora, responder "ela acompanha a obra?" sem obrigar a perguntar, e deixar o WhatsApp a um toque em qualquer tela.

### O que aproveitar, e como, conferido no esboço

> Conferido em 15/10/2026 no `index.html`, no `conte-sua-casa.html`, no `guia.html` e nas páginas de projeto de
> `clientes/_prototipos/debora-reis/site/`. Onde o esboço já resolve, fica dito; onde falta dado, o dado vem dela ou
> vira `[FALTA]`.

1. **Prova antes do texto de filosofia.** O raciocínio a copiar é a ordem: quem ela é e por que confiar vêm antes do
   manifesto. O equivalente honesto da imprensa, para ela, é o verificável: formação, anos de prática e número real de
   obras entregues. Imprensa só se existir.
   - **No esboço hoje:** "desde 2004" já aparece cedo, no subtítulo da capa e no rótulo "[ Desde 2004 ]" acima de
     "Nunca a mesma casa duas vezes", como o "1991 ––– 2026" deles. A formação ("Arquiteta e urbanista, UFBA") só
     aparece na seção "A arquiteta", a sétima de nove. Número de obras não aparece: `[FALTA: quantos projetos ela já
     entregou, se tiver a conta]`. Registro profissional não visto: `[FALTA: número do CAU]`.
2. **Hero que nomeia: serviços em rótulo e uma foto real.**
   - **No esboço hoje:** já está. A capa tem o rótulo "projeto, obra e decoração" acima do H1, a categoria e a cidade
     no subtítulo e uma foto inteira de apartamento dela. O H1 continua sendo frase ("Casas com história. Interiores
     com identidade."); a questão de trazer a categoria para o H1 já está registrada no teardown da
     [Tecnoarreda](tecnoarreda.md) como decisão do Marcelo.
3. **Uma seção explícita para "você acompanha a obra?".** É, provavelmente, a dúvida mais cara de quem reforma
   apartamento, e o Pelizzari dá a ela a única seção descritiva da home.
   - **No esboço hoje:** a resposta existe, mas diluída: é a etapa 03 de "Como trabalho" e uma pergunta do FAQ ("Sim.
     São visitas ao local para checar se tudo acontece conforme o projeto e tirar as dúvidas da equipe."). Dar a ela
     destaque próprio é o ganho. **Só se promete o que está confirmado:** a visita à obra; se ela coordena pedreiro e
     marceneiro ou só confere, `[FALTA: confirmação da Débora sobre o que ela faz na obra]`.
4. **CTA de processo que abre o processo de verdade.** O erro do Pelizzari: "conheça nosso método" leva a uma página
   sem método.
   - **No esboço hoje:** o link "Prazos, valores e o que trazer na primeira conversa: o guia do cliente" abre o
     `guia.html`, que tem de fato as 4 etapas com prazo. Mas a página leva a etiqueta "Demonstração": prazos, valores
     e respostas ainda não são dela. Antes de publicar, ou os números vêm da Débora ou o link deixa de prometer
     "prazos e valores". `[FALTA: prazo de cada etapa e forma de cobrança, dados pela Débora]`.
5. **Contato dentro do menu.**
   - **No esboço hoje:** já está: o menu traz o escritório (Rua Aracaju, 34, Barra) e o WhatsApp. O que o Pelizzari
     acrescenta é a foto do escritório como prova de lugar real; opcional e só com foto dela: `[FALTA: foto do
     escritório ou da fachada, se ela quiser mostrar]`.
6. **Primeiro contato que já chega qualificado, com anexo.** O cliente de reforma tem planta ou fotos do estado atual.
   - **No esboço hoje:** "Conte a sua casa" faz a triagem que o Pelizzari não faz e que serve a ela: 6 perguntas, com
     metragem, o que pede mudança, prazo e bairro, e o resumo vai para o WhatsApp da Débora. Não há anexo. Como o
     WhatsApp aceita arquivo, bastaria uma linha no fim convidando a mandar a planta ou fotos do apartamento junto. A
     triagem por tipo de pedido (candidato, fornecedor, imprensa) não serve a um escritório de uma pessoa.
7. **Ficha curta e narrativa no projeto.** Ficha em cima (local, ano, tipo), narrativa embaixo (como estava, o que o
   morador queria, o que foi feito, quanto durou a obra). Para reforma, acrescentar o que o Pelizzari não tem:
   metragem e escopo.
   - **No esboço hoje:** a ficha existe, parcial (Rio Vermelho: bairro, o que mudou, fotógrafo). Faltam ano,
     metragem, escopo e duração: `[FALTA: ano, metragem, escopo (projeto, obra, decoração) e duração de cada projeto,
     dados pela Débora]`.
8. **Fim do projeto com saída.** O Pelizzari termina a página mais lida no formulário genérico.
   - **No esboço hoje:** aqui o esboço está à frente: as 6 páginas de projeto fecham com "Próximo apartamento" (ou
     "Outros detalhes", nas páginas de detalhe), "Ver todos os projetos" e um chamado contextual ("Quer uma casa
     pensada assim?", "Quer um apartamento pensado assim?" no Rio Vermelho) que leva a "Conte a sua casa" ou ao
     WhatsApp.
9. **Galeria que alterna geral e detalhe, com crédito e com o antes.** O Pelizzari faz o geral e o detalhe; o antes ele
   não mostra, mesmo numa requalificação.
   - **No esboço hoje:** os detalhes já ganharam seção própria ("Detalhes que contam": a estante, o pendente, o nicho)
     e o crédito "Fotos: Roberto Moreira Rego" está nos projetos. O antes e depois é o argumento que falta no
     Pelizzari e no esboço: `[FALTA: fotos de antes, se ela tiver]`.
10. **Retrato dela no meio do trabalho, não isolado.**
    - **No esboço hoje:** a foto dela ("sorrindo no escritório") está dentro de "Como trabalho", ao lado das etapas, e
      não numa seção de equipe. Cumpre a mesma função do retrato do casal na faixa do Pelizzari: quem faz aparece no
      meio do que faz.
11. **Duas trilhas: contato direto e algo útil para quem ainda não vai chamar.** O Pelizzari troca a apresentação em
    PDF pelo e-mail.
    - **No esboço hoje:** o guia do cliente já é essa peça (com "Baixar em PDF") e é aberto, sem cadastro. Como a
      Débora não tem uma lista para nutrir, manter aberto é o mais coerente; pedir e-mail só faz sentido se ela for
      mesmo mandar alguma coisa depois. O conteúdo do guia precisa ser dela (item 4).
12. **Um sistema tipográfico repetido igual em todas as seções.** A lição é a regra, não acrescentar fonte.
    - **No esboço hoje:** já há sistema (Boska nos títulos, Archivo no texto, La Belle Aurore nas anotações à mão).
      Uma quarta família seria ruído; o que vale do Pelizzari é conferir que cada papel (título, ênfase, nota) é usado
      sempre do mesmo jeito.

---

## O que não copiar

- **Preloader de 4 s com o banner de cookies travando o scroll.** Atrasa a primeira foto útil e, no celular, irrita
  quem chegou pelo Google procurando arquiteta.
- **Nenhum CTA no hero e nenhum caminho rápido para o WhatsApp.** Funciona para escritório com 35 anos de imprensa;
  não para quem precisa gerar o primeiro contato.
- **Telefone obrigatório num formulário de seis campos, sem WhatsApp.** No Brasil, o cliente de reforma prefere chamar
  no WhatsApp a preencher formulário.
- **Portfólio de 53 projetos sem filtro e sem local ou tipo no card.** Para a Débora, poucos projetos bem documentados
  valem mais que volume.
- **Página de projeto de cerca de 24.600px sem "próximo projeto" e sem chamado contextual.** O visitante mais
  interessado do site chega ao fim e só tem o formulário genérico.
- **Botão que promete o que a página não entrega** ("conheça nosso método" levando a uma página sem método).
- **Faixa de logos que não são links, e citações de terceiros na página Studio** (Saint-Exupéry, Serge Lutens, Meredith
  Heron). É enfeite sem prova. Frase na boca da profissional, só se for dela.
- **Texto em italiano poético e genérico** ("Meravigliare / Sbalordire", "Il segreto? Il nostro entusiasmo"), que
  serviria a qualquer escritório.
- **Diferenciais 001–006 genéricos** ("estilo atemporal", "gestão profissional do tempo") sem nenhuma prova ao lado:
  lista de promessa que não se verifica.
- **Suisse Intl e Suisse Works.** São fontes comerciais.
- **A escala** (equipe de 16, duas sedes, código de arquivo para 53 projetos). A Débora trabalha sozinha; copiar isso
  seria inventar tamanho.

---

## Aplicado onde

Ainda não. Estudado em 15/10/2026 para o esboço da Débora Reis (`clientes/_prototipos/debora-reis/`). Candidatos à
aplicação: dar seção própria ao acompanhamento de obra (depende da confirmação dela sobre o que faz na obra), trazer a
formação e o número de obras para perto da capa, convidar a mandar planta ou fotos no fim do "Conte a sua casa", ficha
completa nos projetos e o guia do cliente com os números dela antes de o link prometer "prazos e valores". Preencher
quando acontecer, com a adaptação feita.

Prints (34 telas, somem com a sessão):
`/tmp/claude-0/-home-user-HorusOS-Pro/ada53c37-1efb-518e-8aec-f8416f2ef82e/scratchpad/ref/pelizzari/`
