# Teardown: Paula Müller Arquitetura e Interiores (PM Arquitetura, Rio de Janeiro)

- **URL:** https://www.paulamuller.com.br/
- **Segmento:** arquitetura e design de interiores residencial (apartamentos, casas, coberturas), com uma linha
  comercial e de stands imobiliários. Escritório no CasaShopping, Barra da Tijuca, Rio de Janeiro. Site em
  WordPress/Elementor.
- **Estudado em:** 15/10/2026, em navegador automatizado: home em desktop 1440x900 e em mobile 390x844, as duas até
  o rodapé; `/projetos/`, `/projetos/projeto-casa-maka/` (com galeria e lightbox abertos), `/projetos/projeto-vista-lagoa/`
  (texto), `/projetos/projeto-toca-azul/` (projeto que não aparece na grade), `/casacor-rio-2026/`,
  `/casacor-rio-2023/` (texto), `/office/`, `/fale-conosco/`, `/oleo/`, `/categoria/at/` e o sitemap (page, projetos,
  categoria). 24 prints.
- **Nota:** 6/10. As páginas de projeto e o "Sobre" são o melhor modelo do lote para a Débora; a home só dá rótulos,
  não diz o posicionamento e tem erro de dado e de texto.
- **Contexto:** estudado a pedido do Marcelo para o site da Débora Reis (`clientes/_prototipos/debora-reis/`, esboço
  em https://esboco-debora-reis.vercel.app). **Não é site de prêmio nem galeria experimental:** é concorrente de
  mercado, uma vitrine comercial que usa a CASACOR como prova de prestígio. Entra porque o perfil é muito parecido
  com o da Débora: escritório com o nome da arquiteta, formação em universidade federal (FAU-UFRJ), escritório aberto
  em 2005, reforma residencial, sede na Barra (a do Rio).

**Em resumo:** o site fala com famílias de classe alta que vão reformar apartamento grande na Zona Sul ou na Barra. A
home faz três coisas: **mostra obra** (6 projetos residenciais e 4 ambientes de CASACOR), **prova prestígio** (CASACOR
e imprensa) e **leva ao WhatsApp**. O que vende de verdade são as páginas de projeto, que abrem com o problema da
família e contam a solução cômodo por cômodo. A home só dá rótulos (Projetos, Serviços, Sobre), e o posicionamento
("grandes metragens em lares sob medida") existe só numa página que não está no menu. **A home prova estética e
prestígio; a página de projeto mostra o raciocínio; nenhuma página responde como é contratar e fazer a obra com ela.**

---

## Estrutura, na ordem

### Fixo em todas as páginas

**0. Cabeçalho fixo.**

- **Mostra:** logo manuscrito "Paula Müller — arquitetura e interiores" à esquerda, menu Home / Projetos / Serviços /
  Sobre / Fale conosco ao centro, campo "Pesquisar..." à direita, sobre fundo marrom chapado `#87654E`.
- **Para quê:** dizer de quem é o site e deixar o visitante pular para qualquer bloco da home. Os itens do menu são
  âncoras da própria home (`#outros-projetos`, `#servicos`, `#sobre`, `#fale-conosco`), então o site é praticamente
  uma página só, com as páginas de projeto como aprofundamento.
- **Como é montado:** barra de cerca de 98 px, fixa no topo durante a rolagem. No mobile vira logo e hambúrguer. Não
  tem botão de contato no cabeçalho; o contato fica no botão verde flutuante (9). Nenhuma imagem, só o logo em linha
  fina branca.

**9. Elementos flutuantes.** (numerado pela ordem em que aparecem nos dados, mas presentes em toda página)

- **Mostra:** botão redondo verde de WhatsApp com "Entre em contato", na lateral direita, no meio da tela; seletor de
  idioma "PT" com bandeira no canto inferior direito, tradutor automático para EN, FR, DE, IT e ES.
- **Para quê:** deixar o contato a um toque, em qualquer altura de qualquer página. O seletor de idioma conversa com a
  promessa de "projetos a distância" da lista de serviços.
- **Como é montado:** os dois ficam fixos. **No mobile, o botão verde e o "PT" cobrem o texto da parte de baixo da
  tela** (visível no Sobre e no Fale Conosco).

### Home

**1. Hero: destaque da CASACOR 2026.**

- **Mostra:** foto do living "Casarão Senta, Teresa!" (CASACOR Rio 2026) em sangria total, com uma caixa escura
  semitransparente por cima: título serifado de 80 px, subtítulo e o botão "MAIS DETALHES". Uma seta circular embaixo
  convida a rolar.
- **Para quê:** abrir com a obra mais recente e mais prestigiosa. Antes de qualquer frase, mostra que ela é convidada
  da CASACOR, e o botão leva para a página da mostra. Para o negócio, é prova de status. **Para quem chegou procurando
  arquiteta, a primeira tela não diz o que ela faz, para quem nem onde:** isso só aparece no "arquitetura e
  interiores" do logo.
- **Como é montado:** uma imagem só, sem troca automática (8 segundos de espera, nada mudou), com cerca de 720 px de
  altura no desktop. A caixa de texto cobre cerca de 55% da largura e metade da altura da foto, e o véu escuro apaga
  essa parte da imagem. O botão é contornado e leva para a mostra, não para o contato. No mobile a caixa cobre quase a
  foto inteira.
- **Copy:** *"Casarão Senta, Teresa! — Uma casa que guarda a memória de chegar e de voltar, assinada por Paula Müller
  na CASACOR Rio 2026"* [MAIS DETALHES]

**2. Projetos (grade de residências).**

- **Mostra:** seis cards em 3 colunas e 2 linhas (Casa Maka, Vista Lagoa, Redentor, Blockbuster, Família de 7,
  Singapura) e, embaixo, o botão "CARREGAR MAIS PROJETOS".
- **Para quê:** é o portfólio e o trabalho principal da home. Deixa o visitante ver de relance o tipo de casa que ela
  faz (salas integradas, marcenaria em madeira, vista para a Lagoa) e escolher um projeto para abrir.
- **Como é montada:** fundo verde-sálvia `#97A68F`; título "Projetos" centralizado em Quicksand light. Cards de cerca
  de 384x350 px, cada um com uma foto quase quadrada e sempre do ambiente social (cozinha integrada, sala com vista,
  home theater, varanda gourmet). Uma barra escura translúcida no rodapé do card traz o apelido do projeto e um ícone
  "+"; no hover o card sobe uns 5 px e o "+" fica branco. **O card não traz bairro nem metragem**, e o apelido não
  informa nada ("Projeto Blockbuster"). No mobile vira 1 coluna.
- **Falha observada:** o "Carregar mais" chama o `admin-ajax`; no navegador automatizado veio 403 e o botão virou
  "ERRO AO CARREGAR". Toca Azul, Alemanha e Sampa existem no sitemap e não apareceram na grade. Pode ser bloqueio a
  robô; não foi confirmado como visitante real.
- **Copy:** "Projeto Casa Maka (+) · Projeto Vista Lagoa (+) · ... · CARREGAR MAIS PROJETOS"

**3. Projetos CasaCor Rio.**

- **Mostra:** quatro cards grandes em 2x2, cada um com o ano da edição, o nome do ambiente, a metragem e "MAIS
  DETALHES": Casarão Senta, Teresa! (2026, living de 75 m²), Casa de Jorge (2025, 104 m²), Estúdio Urupês (2024,
  54 m²), Suíte Tu Vens (2023, 30 m²).
- **Para quê:** abrir uma **segunda linha de portfólio**, separada das residências, que funciona como prova social de
  prestígio: quatro anos seguidos na mostra mais conhecida do país. Também mostra evolução (de suíte de 30 m² para
  living de 104 m²).
- **Como é montada:** fundo marrom. Cards de cerca de 525x290 px, com a foto inteira sob véu escuro uniforme e o texto
  centralizado: sobretítulo com o ano, nome em serifa e metragem. Ordem do mais novo para o mais antigo. No mobile, 1
  coluna.
- **Copy:** "CASACOR RIO 2025 / Casa de Jorge / Living de 104 m² / MAIS DETALHES"

**4. Nossos Serviços.**

- **Mostra:** foto de sala e jantar integrados à esquerda e, à direita, seis linhas no formato "Nome do serviço:
  descrição": projeto de arquitetura e interiores; detalhamento de marcenaria e iluminação; acompanhamento de obra;
  projetos presenciais e a distância; ferramentas imersivas (projeto em 360°); decoração final após a obra, com
  objetos pessoais da família.
- **Para quê:** responder "o que ela faz exatamente?" e abrir o escopo para além do projeto: obra, marcenaria,
  atendimento a distância e decoração no fim. **O 360° e a decoração com objetos da família são os únicos itens que
  diferenciam o escritório**; os outros quatro qualquer escritório assinaria.
- **Como é montado:** duas colunas, foto com cerca de 588 px de largura e texto corrido do mesmo tamanho para os seis
  itens. Sem ícone, numeração, etapas, prazo ou botão. Fundo verde-sálvia de novo. A foto não tem legenda e não
  mostra nenhum dos serviços listados: só ilustra o bloco. Erro de português no texto ("supervisão cada etapa").
- **Copy:** *"Decoração final após obra: produção, ao final da obra, utilizando objetos pessoais das famílias e
  sugestões de novas peças e obras de arte."*

**5. Sobre a PM Arquitetura.**

- **Mostra:** retrato vertical da Paula sorrindo, de blusa preta, com fundo desfocado; o logo em terracota embaixo da
  foto; ao lado, dois parágrafos: formada pela FAU-UFRJ, dirige o escritório no CasaShopping (Barra da Tijuca),
  fundado em 2005, atua no residencial (casas, apartamentos, coberturas), no comercial e em stands imobiliários.
- **Para quê:** pôr rosto e credencial na marca: quem é, onde estudou, desde quando trabalha, onde atende. O cliente de
  alto padrão contrata a pessoa, e é aqui que ele confere isso. O texto é factual e curto, sem adjetivo de
  autoelogio.
- **Como é montado:** fundo creme `#FAEFE0`, título em terracota. Foto com cerca de 337x500 px à esquerda, texto à
  direita, com os fatos-chave em negrito (2005, residencial, comercial, empreendimentos imobiliários). Sobra muito
  espaço vazio à direita e abaixo do texto. Não tem frase da arquiteta, método, equipe nem botão.
- **Copy:** *"A Paula Müller é arquiteta e designer de interiores do Rio de Janeiro, formada pela Faculdade de
  Arquitetura e Urbanismo da UFRJ... Fundado em 2005, atua nos segmentos residencial..."*

**6. Na mídia.**

- **Mostra:** carrossel com 6 recortes de imprensa (O Globo/Caderno Ela, Casa Claudia, Decor, Habitare e outros), como
  miniaturas verticais da página impressa, com bolinhas de navegação.
- **Para quê:** autoridade de fora. O visitante não precisa ler as matérias: ver o layout das revistas já resolve a
  dúvida "ela é reconhecida?".
- **Como é montado:** fundo taupe `#B9A797`. Fileira de miniaturas de cerca de 157x235 px que passa sozinha, mais as
  bolinhas. O clique abre um lightbox ("1 / 6") com setas, tela cheia, slideshow, faixa de miniaturas e o nome do
  veículo como legenda ("Caderno Ela"). O carrossel começa com a primeira miniatura cortada na borda esquerda. Não diz
  qual projeto saiu em cada matéria.
- **Copy (títulos dos recortes):** "Que tal repaginar sua sala de jantar?", "Universo Lúdico", "200 m² com marcenaria,
  tons neutros e muita claridade", "Apê carioca tem projeto que preza pelas necessidades de toda a família".

**7. Fale Conosco.**

- **Mostra:** à esquerda, "Entre em contato conosco" com WhatsApp e e-mail, depois "Siga-nos nas redes sociais" com
  Instagram e TikTok, tudo com ícones em círculo escuro; à direita, "Venha nos visitar" com mapa do Google embutido
  (satélite, botão "Abrir no Maps"), o nome do CasaShopping e o endereço completo com bloco e conjunto.
- **Para quê:** fechar a página com todos os caminhos de contato e com a **prova física** de que o escritório existe e
  pode ser visitado. O WhatsApp abre com a mensagem pronta *"Olá, vim do site e quero mais informações."*, que
  identifica a origem do lead.
- **Como é montado:** fundo cinza claro, duas colunas de 50%. **Não tem formulário na home:** o formulário existe em
  `/fale-conosco/`, que não está no menu e aparece sem estilo. Não tem horário, nem o que acontece depois do primeiro
  contato, nem o que mandar (planta, fotos, metragem). O bloco se repete idêntico no fim de todas as páginas internas.
- **Copy:** "Via WhatsApp - (21) 99152-5155 · contato@paulamuller.com.br · CasaShopping, Av. Ayrton Senna, 2150 -
  Bloco F - Conjunto 221 e 222, Barra da Tijuca"

**8. Rodapé.**

- **Mostra:** monograma "PM" em linha branca, links "Política de Privacidade" e "PM Arquitetura na mídia", e "Todos os
  direitos reservados".
- **Para quê:** fechar com a marca e o aviso legal (LGPD). Nenhuma informação comercial nova.
- **Como é montado:** fundo grafite, tudo centralizado, cerca de 280 px de altura.

### Página de projeto individual (`/projetos/projeto-casa-maka/`)

**10. A página que convence.**

- **Mostra:** hero com foto em sangria total e caixa escura, "Projeto Casa Maka / Apartamento de 97 m² em
  Laranjeiras"; o título repetido; texto à esquerda e foto grande à direita; galeria de miniaturas quadradas, 5 por
  linha, com "CARREGAR MAIS IMAGENS" (5 a mais por clique, 30 fotos no lightbox); depois "Outros Projetos" (3 cards),
  "CasaCor Rio" (3 cards) e o Fale Conosco.
- **Para quê:** é aqui que o site vende. O texto abre com a pergunta da família e responde cômodo por cômodo, com uma
  solução concreta para cada um: geladeira dupla escondida na marcenaria, janela guilhotina na área de serviço,
  cristaleira com luz num vão que seria perdido, painel que esconde a TV. **O cliente se vê no problema e entende o
  raciocínio da arquiteta, não só o resultado.** O fim da página leva para outro projeto ou para o contato.
- **Como é montado:** hero de cerca de 720 px. Bloco de duas colunas: texto com cerca de 520 px, com as soluções em
  negrito para quem só passa o olho, e foto com cerca de 628x470 px. A galeria vai se revelando aos poucos. O
  lightbox tem contador, setas, slideshow, tela cheia, zoom e faixa de miniaturas. **Não tem ficha técnica** (ano,
  escopo, prazo, fotógrafo), nem planta, nem antes e depois, nem depoimento do cliente.
- **Copy (abertura):** *"Como fazer um casal com um filho pequeno circular pela casa sem perder um o outro de
  vista?"*
- **Copy (solução):** *"Na cozinha, a marcenaria escondeu a geladeira dupla, e um frontão espelhado devolveu
  profundidade ao ambiente."*
- **Contraexemplo no mesmo site:** a Toca Azul é escrita em adjetivos ("leveza, aconchego e funcionalidade"). Lado a
  lado com a Casa Maka e a Vista Lagoa, dá para ver que a versão por problema é a mais forte.

### Página especial de CASACOR (`/casacor-rio-2026/`)

**11. O ambiente da mostra como experiência.**

- **Mostra:** hero "Senta, Teresa!"; "O Conceito" (texto com referência a Santa Teresa e ao Samba do Avião de Tom
  Jobim, materiais citados pelo nome, crédito de produção visual para Andrea Falchi) com foto ao lado; botão da
  playlist no Spotify; galeria; vídeo do YouTube; faixa "Tour 360°" com o botão "ACESSAR TOUR 360°" sobre foto
  escurecida; "Quem nos apoia" (logo do patrocinador grande e 14 logos de apoio); "Outras Edições"; "Outros
  Projetos"; Fale Conosco.
- **Para quê:** transformar o ambiente da mostra em experiência (conceito, música, vídeo, tour virtual). **Prova de
  verdade o serviço "ferramentas imersivas, projeto em 360°" que a home só cita**, e retribui fornecedores e
  patrocinadores, o que alimenta a relação comercial com a indústria.
- **Como é montado:** seções em blocos de cor alternada (creme, cinza, foto escura, verde-floresta, marrom, sálvia),
  com setas circulares entre elas. A página tem cerca de 5.900 px.
- **Copy:** *"Do espaço físico, com função de living de 75 m², para uma experiência virtual de mais 330 m². Acesse o
  tour do Casarão Senta, Teresa!"*

### Páginas fora do menu

**12. `/office/`, `/fale-conosco/`, `/oleo/`.**

- **Mostra:** `/office/` abre com foto de home theater em sangria total e caixa escura, "Escritório de Arquitetura
  Paula Müller — Transformando Grandes Metragens em Lares sob Medida", texto sobre marcenaria inteligente, alto padrão
  e curadoria, serviços em prosa e "Onde estamos". `/fale-conosco/` é um formulário (nome, e-mail, assunto, mensagem
  opcional) com breadcrumb azul padrão e sem estilo. `/oleo/` vende fragrâncias em edição limitada com a Oleô, com o
  cupom PAULAMULLER, em layout quebrado e com o texto colado na borda.
- **Para quê:** `/office/` parece página feita para SEO ou anúncio, e é **a única que diz o posicionamento** (grandes
  metragens, alto padrão, marcenaria como assinatura). `/oleo/` é extensão de marca e monetização da CASACOR.
- **Como é montado:** nenhuma das três está ligada pelo menu; duas estão sem acabamento visual. Sobram ainda
  categorias de CMS com lorem ipsum (`at`, `sequi`).

### Comparando com `_memoria/design/00-anatomia.md`

- **Hero:** a anatomia pede o que é, para quem e o que fazer em três segundos, com prova ao lado e um CTA. Aqui o hero
  tem a prova (CASACOR 2026) e não tem a promessa: não diz que é escritório de reforma residencial, para quem nem onde,
  e o único botão leva para a mostra.
- **Para quem é:** não existe na home. Aparece de forma indireta na abertura de cada projeto ("casal com um filho
  pequeno", "cada criança com seu canto") e, como categoria, no `/office/` ("grandes metragens"), fora do menu.
- **O que fazemos:** existe (Serviços), com uma linha por item, como a anatomia pede. Falta agrupar por etapa e ligar
  cada serviço a um projeto onde ele aparece.
- **Como começa:** não existe em nenhuma página. O fim de toda página é "fale conosco", sem dizer o que acontece
  depois.
- **Quem faz:** é o ponto mais próximo da anatomia: foto real, nome, formação em uma frase, ano e endereço. Falta o
  registro profissional (CAU) e uma frase dela.
- **Como é / Onde é:** endereço completo e mapa no fim de toda página. O "como é" do trabalho está nas páginas de
  projeto, não na home.
- **FAQ:** não existe.
- **Contato:** três caminhos, todos levam ao WhatsApp ou ao e-mail; o formulário está órfão.
- **Encenar a prova:** a página de projeto encena (a solução concreta por cômodo, o tour 360° que prova o serviço
  360°). A home afirma por rótulo.

**A diferença de fundo:** a anatomia põe o problema da pessoa na home. A Paula põe o problema da pessoa só dentro da
página de cada projeto, e deixa a home com obra e prestígio. Funciona para quem clica num card; não ajuda quem precisa
decidir, na primeira tela, se aquele escritório faz o tipo de obra dele.

---

## Como as imagens aparecem

O site tem um regime só de imagem, e ele é de catálogo: **foto grande com texto por cima, card com faixa de nome,
galeria muda com lightbox.** Não há sobreposição de fotos nem imagem que atravessa de uma seção para outra; o padrão
de "uma imagem por cima da outra" que o Marcelo citou está em [Normal is Boring](normalisboring.md), não aqui. O que
este site ensina sobre "imagem que mostra o trabalho sem explicar" é a **divisão de trabalho entre texto e galeria**
na página de projeto.

### Galeria de miniaturas mudas com lightbox (o "mostra sem dizer o que tem")

- **Onde:** páginas de projeto e de CASACOR.
- **Como funciona:** miniaturas quadradas em grade de 5, sem legenda, só com o ícone de expandir. "Carregar mais"
  revela 5 de cada vez. O clique abre o lightbox com contador (2/30), slideshow, tela cheia e faixa de miniaturas, com
  uma legenda genérica igual para todas ("Casa Maka | Paula Müller Escritório de Arquitetura"), sem dizer o cômodo.
- **Efeito:** é imagem que mostra o trabalho sem explicar, e funciona porque o texto de cima já contou a história. A
  galeria é para quem quer ver a casa inteira, e o lightbox com 30 fotos vira uma visita pela casa. O custo: a legenda
  repetida desperdiça o único lugar onde dava para dizer "cozinha" ou "quarto do filho".

### Foto em sangria total com caixa de texto translúcida

- **Onde:** hero da home, de cada projeto, de cada CASACOR e do `/office/`.
- **Como funciona:** uma foto na largura toda, com cerca de 720 px de altura, e um retângulo marrom-acinzentado
  semitransparente do lado esquerdo com o título serifado e o subtítulo.
- **Efeito:** garante leitura sobre qualquer foto, mas apaga metade da imagem. No mobile a caixa cobre quase tudo, e a
  foto, que é o produto, vira fundo.

### Card com barra de nome e "+", sem dado

- **Onde:** grade de Projetos e "Outros Projetos".
- **Como funciona:** foto quase quadrada, faixa escura no rodapé com o apelido do projeto e um botão circular "+". No
  hover o card sobe um pouco e o "+" preenche.
- **Efeito:** convida a clicar, mas o apelido ("Blockbuster", "Singapura") não diz bairro, metragem nem tipo de
  imóvel. O visitante só descobre se o projeto parece com o apartamento dele depois de entrar.

### Card escurecido com ficha mínima centralizada

- **Onde:** Projetos CasaCor Rio e "Outras Edições".
- **Como funciona:** foto inteira com véu escuro e, empilhados no centro, o ano, o nome em serifa, a metragem e o
  botão.
- **Efeito:** dá para ler e comparar (ano e m²), e a sequência de anos vira prova de constância. É o card que a grade
  de residências deveria ter copiado.

### Recorte de imprensa como imagem-prova

- **Onde:** Na mídia.
- **Como funciona:** a página da revista aparece como miniatura vertical num carrossel; o nome do veículo só aparece
  no lightbox.
- **Efeito:** autoridade instantânea pelo reconhecimento do layout das revistas, sem texto. Não diz qual projeto saiu
  em cada matéria.

### Foto como fundo de chamada

- **Onde:** faixa "Tour 360°" da página da CASACOR.
- **Como funciona:** a foto do ambiente bem escurecida vira textura atrás de um título grande e de um botão.
- **Efeito:** separa uma chamada para ação do resto da página usando o próprio trabalho, sem inventar elemento
  gráfico.

### Blocos de cor alternada como separador de seção

- **Onde:** home inteira (sálvia, marrom, sálvia, creme, taupe, cinza, grafite) e página da CASACOR.
- **Como funciona:** cada seção tem um fundo chapado de uma paleta terrosa, sem linha divisória e sem sobreposição.
- **Efeito:** dá ritmo e deixa claro onde cada assunto começa. Ao mesmo tempo, a página fica com cara de blocos
  empilhados de construtor de site, e nenhuma imagem passa de uma seção para outra.

### Foto que só ilustra

- **Onde:** Nossos Serviços.
- **Como funciona:** uma foto de sala e jantar sem legenda ao lado da lista de serviços.
- **Efeito:** preenche a coluna e não prova nenhum dos seis serviços. É o lugar onde uma foto de obra em andamento, de
  detalhamento de marcenaria ou do tour 360° faria o trabalho de prova.

---

## Informação: o que tem e o que falta

**Tem:**

- Nome da arquiteta como marca e o nome do escritório (PM Arquitetura e Design de Interiores).
- Formação: FAU-UFRJ. Ano de fundação: 2005.
- Segmentos: residencial (casas, apartamentos, coberturas), comercial, stands e espaços de relacionamento
  imobiliário.
- Endereço completo com bloco e conjunto (CasaShopping, Barra da Tijuca) e mapa embutido.
- WhatsApp com mensagem pronta que identifica a origem, e-mail, Instagram, TikTok.
- Lista de 6 serviços: projeto, marcenaria e iluminação, acompanhamento de obra, presencial e a distância, 360°,
  decoração final.
- Portfólio residencial: 6 visíveis na grade, 9 no sitemap; cada projeto com tipo de imóvel, metragem e bairro no
  subtítulo da página.
- Narrativa por projeto: o problema da família e a solução por cômodo.
- 4 participações na CASACOR Rio (2023 a 2026), com a metragem de cada ambiente.
- Imprensa: 6 matérias (O Globo/Ela, Casa Claudia, Decor, Habitare e outras).
- Tour 360°, vídeo e playlist do ambiente da CASACOR.
- Patrocinadores e fornecedores parceiros (logos).
- Política de privacidade, tradução automática para 5 idiomas, busca no site.

**Falta:**

- Frase de posicionamento na home (para quem é, que tipo de obra, que região). Só existe no `/office/`, fora do menu.
- Como funciona o processo: etapas, o que acontece na primeira conversa, o que mandar (planta, fotos, metragem).
- Prazo típico de projeto e de obra.
- Faixa de investimento, ou ao menos "a partir de", ou o tipo de imóvel que ela atende.
- Depoimento de cliente, em qualquer página.
- Ficha técnica do projeto: ano, escopo (só projeto ou com obra), fotógrafo, duração.
- Planta, antes e depois, ou o estado original do imóvel.
- Bairro e metragem no card do portfólio (só aparecem dentro do projeto).
- Registro profissional (CAU) visível.
- Horário de atendimento e se recebe com hora marcada.
- Equipe (quem mais trabalha no escritório).
- FAQ (trabalha com obra já começada? atende fora do Rio? cobra por m²?).
- Formulário na home; o que existe está numa página sem estilo e fora do menu.

**Erros de dado e de texto encontrados:** "supervisão cada etapa", "Um família", "Um experiência virtual de 400m²"
(o mesmo site diz 75 m² físicos mais 330 m² virtuais, que somam 405), e a Vista Lagoa aparece com 200 m² no subtítulo
e 170 m² na meta description. Sobras de CMS: categorias "at" e "sequi" (lorem ipsum).

---

## Navegação e conversão

O menu tem 5 itens que são âncoras da home, mais a busca. O site funciona como página única, e as páginas de projeto
e de CASACOR são os destinos de aprofundamento. **Os botões de conteúdo ("MAIS DETALHES", "+", "CARREGAR MAIS")
levam sempre para mais obra, nunca para o contato**, e o hero não tem botão de contato.

| Caminho | Onde | Leva para | Observação |
|---|---|---|---|
| Botão verde "Entre em contato" | flutuante, todas as páginas | WhatsApp com *"Olá, vim do site e quero mais informações."* | sempre visível; no mobile cobre texto |
| Bloco Fale Conosco | fim de toda página | WhatsApp, e-mail, Instagram, TikTok, mapa | sem formulário, sem horário, sem próximo passo |
| "Fale conosco" no menu | cabeçalho | âncora `#fale-conosco` da home | |
| `/fale-conosco/` | sem link no menu | formulário (nome, e-mail, assunto, mensagem opcional) | sem estilo, breadcrumb azul padrão |
| "MAIS DETALHES" do hero | home | página da CASACOR 2026 | a primeira ação oferecida é ver a mostra |
| "CARREGAR MAIS PROJETOS" | grade da home | `admin-ajax` | 403 e "ERRO AO CARREGAR" no navegador automatizado; 3 projetos inacessíveis pela grade nesta sessão |
| "CARREGAR MAIS IMAGENS" | página de projeto | revela 5 fotos por clique | |

**Sem beco sem saída:** toda página interna termina em "Outros Projetos", depois "CasaCor", depois "Fale Conosco".
Quem leu um projeto cai em outro projeto ou no contato.

---

## O que copiar

### Página de projeto que abre com a pergunta da família e responde cômodo por cômodo

- **Como é feito:** o texto começa por uma pergunta que é o problema concreto de quem mora ali ("Como fazer um casal
  com um filho pequeno circular pela casa sem perder um o outro de vista?") e segue com uma solução por cômodo, cada
  uma em negrito.
- **Por que funciona:** o visitante se reconhece no problema antes de ver o resultado, e a solução concreta (geladeira
  dupla escondida, janela guilhotina, painel que esconde a TV) é prova de raciocínio, não adjetivo. É o "encenar a
  prova" da anatomia aplicado a reforma. A Toca Azul, escrita em adjetivos no mesmo site, mostra o contrário.
- **Copy:** *"Na cozinha, a marcenaria escondeu a geladeira dupla, e um frontão espelhado devolveu profundidade ao
  ambiente."*

### Subtítulo do projeto com tipo de imóvel, metragem e bairro

- **Como é feito:** "Apartamento de 97 m² em Laranjeiras" logo abaixo do nome, no hero da página.
- **Por que funciona:** é a tríade de metadados da anatomia em uma linha. O visitante compara com o próprio imóvel
  antes de ler qualquer coisa. (A Paula não leva esse dado para o card da grade; copiar levando.)

### Texto que explica separado da galeria muda

- **Como é feito:** primeiro o texto com uma foto ao lado; depois a grade de miniaturas sem legenda e o lightbox com
  30 fotos.
- **Por que funciona:** o texto dá o contexto uma vez, e a galeria fica livre para mostrar sem explicar. A imagem muda
  só funciona porque alguém já contou a história logo acima dela.

### Sobre factual, com os fatos em negrito

- **Como é feito:** retrato real, formação, ano de fundação, endereço e segmentos, em dois parágrafos, com 2005,
  residencial, comercial e empreendimentos imobiliários em negrito.
- **Por que funciona:** cliente de reforma de alto padrão confere credencial, e fato verificável dispensa adjetivo. O
  negrito deixa o fato legível para quem só passa o olho.

### Endereço com mapa ao lado do WhatsApp

- **Como é feito:** "Venha nos visitar", mapa do Google em satélite e endereço com bloco e conjunto, na mesma linha
  visual do WhatsApp e do e-mail.
- **Por que funciona:** para escritório de uma pessoa só, um lugar físico para visitar responde "é profissional mesmo?"
  sem precisar dizer.

### WhatsApp com mensagem pronta que marca a origem

- **Como é feito:** o link abre a conversa com *"Olá, vim do site e quero mais informações."*
- **Por que funciona:** tira do visitante o trabalho de escrever a primeira frase e diz ao escritório de onde veio o
  contato.

### Contato repetido no fim de toda página interna

- **Como é feito:** o mesmo bloco de contato no fim de todo projeto, precedido por "Outros Projetos".
- **Por que funciona:** quem gostou de um projeto não precisa voltar à home para falar com ela, e quem não gostou
  ganha outro projeto antes do contato.

### Serviço citado numa seção e provado em outra

- **Como é feito:** "ferramentas imersivas (projeto em 360°)" na lista de Serviços; o tour 360° de verdade na página
  da CASACOR.
- **Por que funciona:** lista de serviço é afirmação; o tour é a prova. O que falta à Paula é o link entre os dois.

### Segunda linha de portfólio com ficha mínima legível

- **Como é feito:** a CASACOR separada das residências, em cards com ano, nome do ambiente e metragem, do mais novo
  para o mais antigo.
- **Por que funciona:** a sequência de anos prova constância, e a separação impede que ambiente de mostra se misture
  com obra de cliente.

---

## Tipografia e cor

- **Famílias (medidas no CSS computado):** Alike (serifa, peso 400) no H1 do hero e nos nomes de projeto, com 80 px no
  hero e 35 px nos cards da CASACOR; Quicksand light 300 nos títulos de seção, com cerca de 40 a 45 px, centralizados;
  Open Sans no corpo, 16 px no texto e 300/32 px no subtítulo do hero.
- **Contraste entre título e corpo:** serifa de display de 80 px contra corpo de 16 px. Os títulos de seção em
  Quicksand light ficam com peso visual menor que o dos nomes de projeto, o que reforça que as seções são rótulos.
- **Fundos medidos:** marrom `#87654E` (cabeçalho e bloco CASACOR), verde-sálvia `#97A68F` (Projetos, Serviços), creme
  `#FAEFE0` (Sobre e texto de projeto), taupe `#B9A797` (Na mídia).
- **Fundos *aparentes*, não medidos:** cinza claro (contato), grafite (rodapé), verde-floresta (patrocinadores na página
  da CASACOR).
- **Acento:** terracota nos títulos sobre creme, *aparente* (o hex não foi medido). O verde do botão flutuante de
  WhatsApp é o outro elemento de cor que se repete.
- **Quantos acentos de verdade:** nenhum acento único. O sistema é troca de fundo por seção, dentro de uma paleta
  terrosa coerente com madeira e marcenaria. A troca a cada seção fragmenta a página.

---

## O que serve à Débora Reis

### A semelhança de propósito, antes de copiar qualquer coisa

O perfil da Paula é muito parecido com o da Débora: escritório com o nome da arquiteta, formação em universidade federal (ela: UFBA, 2004), reforma residencial, escritório na Barra. Por isso o
site da Paula serve menos como inspiração visual e mais como **teste do que um concorrente real mostra e do que ele
deixa sem resposta**. O site da Paula prova estética (projetos), prestígio (CASACOR, imprensa) e existência física
(endereço, mapa), e leva ao WhatsApp. O que ele não responde é o medo de quem vai reformar: **como é contratar e
fazer a obra com ela**. É aí que o site da Débora pode ser melhor que o de um concorrente com mais prestígio.

### O que aproveitar, e como

1. **Projeto que abre com a pergunta da família e responde cômodo por cômodo.** É o que mais convence no site. Para a
   Débora, a pergunta e as soluções têm que vir dela ou do cliente real; o que não tiver vira `[FALTA]`. Escrever em
   adjetivo, como na Toca Azul, é o caminho a evitar.
2. **"Tipo de imóvel + metragem + bairro" no subtítulo do projeto e também no card da grade**, coisa que a Paula não
   faz no card. O visitante de Salvador que mora num 3/4 na Pituba precisa ver de cara "apartamento de X m² em
   [bairro]" para achar que aquilo serve para ele. Só com dado confirmado por ela.
3. **Texto que explica e galeria muda, nessa ordem.** O texto conta a solução; as fotos vêm depois, sem legenda, em
   grade com lightbox. Responde ao pedido do Marcelo de imagens que mostram o trabalho sem dizer o que tem nelas:
   funcionam porque o texto de cima já deu o contexto. Diferente da Paula, a legenda do lightbox pode dizer o cômodo.
4. **Sobre factual com formação, ano e endereço.** É o mesmo esqueleto que a Débora tem de verdade (UFBA 2004,
   escritório na Barra), com os fatos em negrito e sem autoelogio. Acrescentar o que a Paula não pôs: CAU visível e
   uma frase da própria Débora sobre como trabalha, se ela der.
5. **Contato com prova física.** Endereço e mapa ao lado do WhatsApp, para uma profissional que trabalha sozinha. O
   WhatsApp com mensagem pronta ("vim do site") também serve, porque marca a origem do lead para o Hounder.
6. **Contato repetido no fim de toda página interna, e acesso ao WhatsApp em qualquer altura.** Atenção: o esboço tirou
   o botão do WhatsApp do rodapé em 15/10 (`clientes/_prototipos/debora-reis/CLAUDE.md`). Um botão flutuante, como o
   da Paula, é decisão do Marcelo; e, se entrar, não pode cobrir texto no celular como cobre aqui.
7. **Cada serviço da lista provado em outro lugar do site.** Para cada serviço que entrar (projeto, acompanhamento de
   obra, decoração), apontar para um projeto onde aquilo aparece. Serviço sem prova é só lista.
8. **Segunda linha de portfólio só com prestígio real equivalente** (mostra, publicação, imprensa). Se a Débora não
   tiver, a seção não existe, e o espaço vai para processo ou depoimento real.
9. **Imprensa como imagem-prova**, só se ela tiver matéria publicada. Se não tiver, não entra.

### O que a Paula não tem e o site da Débora precisa ter (conferir no esboço)

- Uma frase na primeira tela que diga o que ela faz, para quem e onde, com um botão de contato ao lado.
- Como começa, em passos, com o que acontece na primeira conversa e o que mandar (planta, fotos, metragem).
- Prazo típico de projeto e de obra, só com dado dela.
- Alguma referência de investimento ou de tipo de imóvel atendido, se ela autorizar.
- Ficha por projeto: ano, escopo, duração, quando ela confirmar.
- Planta ou antes e depois, quando ela tiver o material.
- Registro profissional (CAU) visível.
- Horário e forma de atendimento.
- Perguntas frequentes (obra já começada, atendimento fora de Salvador, forma de cobrança).
- Depoimento real, se existir; nunca escrito por nós.
- Portfólio inteiro visível, sem "carregar mais" que dependa de requisição e possa falhar.

---

## O que não copiar

- **Hero que vende o evento e não o serviço.** A primeira tela não diz o que ela faz, para quem nem onde, e o único
  botão leva para a mostra.
- **Títulos de seção que são só rótulos** ("Projetos", "Nossos Serviços", "Sobre a PM Arquitetura", "Na mídia"). Ocupam
  o lugar onde caberia uma afirmação, por exemplo "Reformas de apartamento na Barra e na Graça, do projeto à
  decoração" (exemplo de forma; bairros e escopo a confirmar com a Débora).
- **Posicionamento escondido** numa página fora do menu (`/office/`).
- **Card de portfólio com apelido** ("Projeto Blockbuster", "Projeto Singapura") e sem bairro nem metragem.
- **Serviços em seis linhas do mesmo peso**, sem etapas, ordem ou prazo, sem dizer como começa, ao lado de uma foto
  que não ilustra nenhum serviço.
- **Caixa escura cobrindo metade da foto do hero** (e quase tudo no mobile): o produto vira fundo.
- **Legenda genérica e igual** em todas as fotos do lightbox.
- **"Carregar mais" por AJAX** que pode falhar e esconder projetos. Portfólio pequeno aparece inteiro.
- **Páginas órfãs ou sem estilo** (`/fale-conosco/`, `/oleo/`) e sobras de CMS (categorias "at", "sequi").
- **Erro de dado e de texto** ("Um família", "Um experiência", 200 m² contra 170 m², 400 m² contra 75 + 330). Num site
  que vende precisão, tira credibilidade; e a `_memoria/integridade.md` exige conferir cada número com a cliente.
- **Elementos flutuantes que cobrem texto no mobile** (botão de WhatsApp e seletor "PT").
- **Fundo trocado a cada seção**, que deixa a página com cara de blocos de construtor de site.
- **Nenhum depoimento e nenhum "como funciona"** em nenhuma página: prova estética e prestígio, mas não responde ao
  medo de quem vai reformar.

---

## Aplicado onde

Ainda não. Estudado em 15/10/2026 para o esboço da Débora Reis (`clientes/_prototipos/debora-reis/`, no ar em
https://esboco-debora-reis.vercel.app). Candidatos à aplicação: abertura de projeto pela pergunta da família (só com
texto dela), tipo de imóvel + m² + bairro no card, galeria muda depois do texto, e o Sobre factual com CAU. Preencher
quando acontecer, com a adaptação feita.

Prints (24 telas, somem com a sessão):
`/tmp/claude-0/-home-user-HorusOS-Pro/ada53c37-1efb-518e-8aec-f8416f2ef82e/scratchpad/ref/paulamuller/`
