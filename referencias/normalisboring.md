# Teardown: Normal is Boring (promotora imobiliária de luxo, Galícia)

- **URL:** https://normalisboring.es/
- **Segmento:** incorporação e promoção imobiliária de luxo (casas e apartamentos) em Oleiros, A Coruña e
  Montrove, na Galícia (Espanha). **Não é escritório de arquitetura que vende serviço:** constrói e vende
  unidades dos próprios empreendimentos, vários ainda marcados como "Próximamente".
- **Estudado em:** 15/10/2026, com o Playwright, rolagem real: home em desktop 1440x900 (26 prints + 6 mais
  finos no trecho dos projetos) e em mobile 390x844 (18 prints), menu aberto, `/proyectos/`, `/conocenos/` e a
  página do projeto `/lasolana/` (cerca de 38.000 px, 28 prints). `/contacto/`, `/disponibilidad/`,
  `/lasolana/contacto` e `/lasolana/disponibilidad` dão 404. A página do Awwwards em si não foi visitada: só o
  selo "Site of the Day" fixo na lateral, que aponta para `awwwards.com/sites/normal-is-boring`.
- **Nota:** 5/10. Como referência de página de projeto e de tratamento de imagem, vale muito; como site que
  recebe contato, quase nada, porque os caminhos de contato testados dão 404 ou apontam para endereço inválido.
- **Contexto:** um dos sites que o Marcelo mandou para o site da Débora Reis (`clientes/_prototipos/debora-reis/`).
  Entra como referência de **estrutura de página de projeto e de tratamento de imagem**, não como modelo de
  conversão.

**Em resumo:** a home é um manifesto de marca em rolagem horizontal fixada, com colagens de fotos sem legenda,
valores abstratos e um acordeão de 5 projetos. Fala com quem vai comprar imóvel de luxo e vende mais estilo de
vida do que planta ou preço. A informação concreta (endereço, mapa, m², tipologias, materiais com nome de
fornecedor, áreas comuns, contato do corretor) só aparece na página de cada projeto, organizada em capítulos
numerados. **A home cria desejo; a página do projeto dá os dados para decidir.**

---

## Estrutura, na ordem

### Fixo em todas as páginas

**0. Logo partido, botão "Menú", cursor rotulado, selo do Awwwards, loader.**

- **Mostra:** "NORMAL" no topo à esquerda e "is BORING®" espelhado e de cabeça para baixo, fixo no canto
  inferior direito; pílula "Menú" no topo à direita; um ponto colorido que segue o mouse e vira círculo com
  rótulo (EXPLORAR, ARRASTRAR, VER VIDEO, PRÓXIMAMENTE); fita vermelha do Awwwards na lateral; loader com
  contador até "100%".
- **Para quê:** manter a marca na tela o tempo todo (a piada do nome: o "boring" aparece invertido) e avisar que
  a navegação é uma experiência. É o elemento-assinatura do site e, pelo que se vê, o que rendeu o prêmio.
- **Como é montado:** o logo usa blend mode e muda de cor conforme o fundo; o cursor também troca de cor por
  seção. No mobile o "is BORING" fixo fica por cima do texto e do botão de contato.

### Home (da seção 1 à 8 a rolagem vertical move a página na horizontal)

**1. Hero tipográfico com faixa de foto.**

- **Mostra:** "ESPACIOS DE VIDA QUE DESAFÍAN LO ORDINARIO" em linhas desencontradas (sans maiúscula, com
  "ORDINARIO" em serifa itálica), um parágrafo-manifesto curto, nav vertical girada 90° (CONÓCENOS / PROYECTOS /
  CONTACTO), o rótulo "Home" e uma faixa estreita de foto de sala à direita.
- **Para quê:** dizer a promessa (casas duráveis, atemporais, sustentáveis) antes de mostrar qualquer projeto. A
  faixa de foto é um aperitivo que puxa a rolagem.
- **Como é montada:** tela dividida, cerca de 80% branco com texto e 20% foto. A nav vertical só existe aqui;
  depois some e fica só o "Menú".
- **Copy:** *"En un mundo fugaz en el que lo efímero lo ha empapado todo, hacemos casas para durar más y más,
  preservar el medio ambiente, generar valor y de una calidad atemporal que no se vea afectada por tendencias
  pasajeras."*

**2. Colagem de transição 1.**

- **Mostra:** a faixa de foto se abre na sala inteira, e uma segunda foto (detalhe de torneira preta e cuba de
  pedra) entra por cima, deslocada para a direita e para baixo.
- **Para quê:** imersão e acabamento. Mostra como é estar lá e o nível do material, sem dizer qual projeto é nem
  o que tem na foto.
- **Como é montada:** painel do trilho com 2 a 3 imagens sobrepostas em escalas diferentes. Nenhum texto.

**3. Nosotros (proposta).**

- **Mostra:** rótulo pequeno "Nosotros", título enorme em serifa "CASAS QUE INVITAN A DETENER EL TIEMPO Y
  DESCONECTAR" e parágrafo curto sobre exclusividade.
- **Para quê:** posicionar a marca no "lujo aspiracional" e dizer para quem é. É o "quem somos" em uma frase de
  efeito.
- **Como é montada:** restos da colagem colados à esquerda, saindo da tela conforme o trilho avança; título que
  estoura a largura; parágrafo em coluna estreita embaixo.
- **Copy:** *"Cada vivienda debe ser única y especial, al igual que las personas que la habitan. Somos el
  referente del lujo aspiracional..."*

**4. Manifesto em fundo preto.**

- **Mostra:** duas fotos (sala com jardim interno, piscina à noite) e um parágrafo grande em serifa que se
  "acende" palavra por palavra, de cinza para branco.
- **Para quê:** afirmar o diferencial (qualidade, volumes contemporâneos, abertos ao exterior, conforto,
  sustentabilidade, emoção) com peso de declaração.
- **Como é montada:** par de fotos em alturas diferentes à esquerda, bloco de texto revelado pela rolagem à direita.
- **Copy:** *"En Normal is Boring® construimos viviendas que sobresalen por la calidad y el diseño, de volúmenes
  contemporáneos, impolutos y abiertos al exterior."*

**5. Faixa "VALORES" e colagem 2.**

- **Mostra:** faixa vertical bege com "VALORES ✳ VALORES" girado, foto de fachada de pedra com vidro, depois uma
  colagem de 4 fotos sobrepostas (banheiro com banheira, janela de quarto, poltrona, samambaias).
- **Para quê:** divisória de capítulo e respiro antes da lista de valores. A colagem mostra variedade de
  ambientes e de materiais.
- **Como é montada:** a faixa girada funciona como título de seção; na colagem, a imagem central cobre parte de
  duas outras. Nenhuma legenda.

**6. Valores 01 / 02 / 03.**

- **Mostra:** fundo azul-claro, "01 ELEGANCIA", "02 AUTENTICIDAD", "03 FUNCIONALIDAD" em serifa gigante, cada um
  com 2 a 3 linhas de descrição; uma foto aparece dentro das letras de FUNCIONALIDAD.
- **Para quê:** dar critério de escolha (sobriedade, carvalho, pedra calcária, espaços multifuncionais). Na
  prática, são valores que qualquer construtora de luxo assinaria.
- **Como é montada:** três palavras escalonadas em diagonal e numeradas. No desktop aparece um bloco de descrição
  por vez, e no print o texto ao lado de ELEGANCIA era o de FUNCIONALIDAD ("Espacios abiertos, menos
  jerarquizados..."). No mobile cada valor tem o texto embaixo, mas as palavras quebram no meio (AUTENTICIDA/D,
  FUNCIONALID/AD).
- **Copy:** *"Una arquitectura sobria y silenciosa y una sensibilidad estética que se manifiesta en materiales
  como el roble o la piedra caliza, acompañados de una paleta de colores en tonos tierra."*

**7. Projetos (acordeão horizontal).**

- **Mostra:** rótulo "Proyectos" e o parágrafo "El lujo no se grita..."; depois 5 cards (LA SOLANA, PLAZA ESPAÑA
  9, RUA PEXEGUEIRO, JUNO, POL43), cada um com foto, ano, cidade, número e botão "El proyecto" ou
  "Próximamente". Termina num painel "Ver todas" com seta.
- **Para quê:** prova de que os empreendimentos existem e porta para a página de cada um. É a única seção da home
  com dado concreto (ano e cidade).
- **Como é montada:** o card ativo é largo (foto em cima, painel colorido embaixo com o nome se montando letra por
  letra); os próximos ficam comprimidos em tiras que mostram só o número (02, 03...). Com a rolagem, a tira
  seguinte se expande. Cada card tem cor própria de painel (bege, cinza, azul).
- **Copy:** "2024 · OLEIROS · 01 · LA SOLANA · El proyecto"

**8. "Quien dijo que el placer no puede ser funcional".**

- **Mostra:** título em serifa escalonado e parágrafo sobre artesanato, oficinas locais e sustentabilidade; ao
  lado, um painel coral onde fotos de banheiro e cozinha se empilham uma sobre a outra.
- **Para quê:** dizer o método e fazer a ponte para o contato.
- **Como é montada:** o painel coral cobre o painel de texto logo em seguida, e o parágrafo fica legível só por
  um instante. Aqui termina o trilho horizontal; a página volta a rolar na vertical.
- **Copy:** *"Creamos espacios que no se someten a las tendencias, sino que prefieren tomar el camino de la
  artesanía, de los talleres locales, de la sostenibilidad y de servir al disfrute de sus ocupantes."*

**9. (Contacta) Desbloquea tu sueño.**

- **Mostra:** rótulo "(Contacta)", título enorme "DESBLOQUEA TU SUEÑO" com letras que se embaralham antes de
  assentar, par de fotos assimétrico, "EXCLUSIVIDAD EN SU MÁXIMA EXPRESIÓN", parágrafo de atendimento, e-mail e
  botão "Solicitar información".
- **Para quê:** converter. Promete atendimento personalizado e "guiar em cada passo do processo" e pede o contato.
- **Como é montada:** bloco vertical em fundo bege: título centralizado, foto grande à esquerda e menor e mais
  alta à direita, título em 3 linhas desalinhadas, texto e e-mail na coluna direita, botão pílula preto. O mesmo
  bloco se repete no fim de `/proyectos/`.
- **Copy:** *"Nuestro equipo está a tu disposición para resolver tus dudas y guiarte en cada paso del proceso."*
  O botão leva para `/contacto`, que dá 404.

**10. Rodapé com wordmark gigante e projeto em destaque.**

- **Mostra:** "INSTAGRAM | contacto@normalisboring.es" em tamanho grande; a palavra "BORING" ocupando a largura
  toda, com as hastes das letras se esticando na vertical conforme a rolagem; card do projeto em destaque
  "(2024) LA SOLANA · Privacidad y exclusividad en el corazón de un paraíso natural" com "Explorar"; links legais
  e ©2025.
- **Para quê:** fechar com a marca e dar um último caminho a quem chegou ao fim sem converter.
- **Como é montado:** wordmark animado na rolagem, card pequeno de projeto à direita (foto aérea, uma das poucas
  imagens legendadas da home), linha legal embaixo. Igual em todas as páginas; no `/conocenos/`, em fundo coral.

### Menu (overlay)

**11. Índice de projetos com cidade.**

- **Mostra:** fundo azul-claro; à direita "PROYECTOS / Ver todos" e a lista numerada "(1) LA SOLANA Oleiros",
  "(2) PLAZA ESPAÑA 9 A Coruña", "(3) PEXEGUEIRO Oleiros", (4), (5); à esquerda, preview da foto do projeto com o
  nome por cima; embaixo, CONÓCENOS / CONTACTO e o e-mail.
- **Para quê:** o menu é um índice do portfólio. Os projetos vêm antes do "sobre" e do contato.
- **Como é montado:** tela cheia, itens que entram animados, preview que troca no hover; o botão vira "Cerrar".

### Conócenos (sobre)

**12. Hero "La huella de lo artesanal / Esencia sin maquillaje".**

- **Mostra:** o título em serifa grande, em 4 linhas desalinhadas, com duas fotos pequenas flutuando por cima e
  por baixo das letras, e "(Scroll Down)".
- **Para quê:** abrir o "sobre" pela atitude (artesanal, sem maquiagem), não pela biografia.

**13. Missão ao lado de croqui.**

- **Mostra:** parágrafo de missão revelado palavra por palavra, ao lado de um desenho à mão aquarelado de um
  interior; depois uma foto de sala em largura total.
- **Para quê:** dizer por que a empresa existe e mostrar que há desenho autoral por trás das casas.
- **Copy:** *"Normal is Boring nace con la misión de transformar el mercado inmobiliario de lujo, aportando una
  visión fresca y ambiciosa que fusiona arquitectura de vanguardia y respeto por la naturaleza."*

**14. "Juan Santiso. Nuestro emblema."**

- **Mostra:** título "DISEÑO CON ALMA, CONVERTIDO EN ARTE", o nome do projetista de referência com bio curta,
  axonometria aquarelada de um edifício, par de fotos (cozinha, piscina com casa) e parágrafo sobre
  sustentabilidade.
- **Para quê:** dar autoria ao produto e transferir a reputação de quem desenha para a marca.
- **Como é montado:** croqui à esquerda, nome em maiúsculas e bio à direita, par assimétrico, texto em coluna
  estreita. **Não há retrato de Juan Santiso:** ele é representado pelo desenho dele.
- **Copy:** *"El alma detrás de nuestros proyectos es Juan Santiso, un referente en el diseño de urbanizaciones
  exclusivas que durante décadas ha dado forma a algunos de los desarrollos más emblemáticos en Galicia."*

**15. (Galería) Descubre la inspiración.**

- **Mostra:** fundo coral e um carrossel de fotos de ambientes; o cursor vira "ARRASTRAR".
- **Para quê:** mostrar volume de imagens sem gastar altura de página.

### Proyectos (lista)

**16. Hero e manifesto.** Mesmo esquema do hero da home, em fundo preto: "PROYECTOS QUE REDEFINEN LOS ESPACIOS Y
LO EXTRAORDINARIO", faixa de foto que se abre e texto grande sobre luz, interior e exterior, madeira e sobriedade.
Serve para dar o critério estético antes da lista.

**17. Lista de 5 projetos em painéis.**

- **Mostra:** para cada projeto, foto grande de um lado e painel colorido com (ano), número, NOME, uma frase e
  uma miniatura de outro ambiente. Cursor "EXPLORAR" ou "PRÓXIMAMENTE". Depois o bloco (Contacta) e o rodapé.
- **Para quê:** triagem. Cada projeto ganha uma frase que diz para quem ele é, e o visitante escolhe qual abrir.
- **Como é montada:** trilho horizontal com painel de foto e painel de texto em altura total, alternando bege e
  cinza; termina num painel coral com fotos empilhadas.
- **Copy:** "(2024) 03 · ¡Vacaciones en casa¡ Tres villas exclusivas en Oleiros · RÚA PEXEGUEIRO" e "(2024) 05 ·
  All you need is outdoor. 12 exclusivas casas en Montrove · POL 43" (o ponto de exclamação invertido no fim está
  assim no site).

### Página de projeto (`/lasolana/`, cerca de 38.000 px, umas 42 telas)

**18. Hero com o nome mascarando a foto.**

- **Mostra:** "LA SOLANA" gigante, com a foto da piscina no centro e as letras de "SOLANA" sobrepostas à foto;
  a localização "Icaria IV - Oleiros"; "(Scroll Down)"; e uma pílula fixa embaixo à esquerda, "01 • La
  Urbanización", que indica o capítulo atual.
- **Para quê:** fundir nome e imagem do empreendimento e já dizer onde fica.
- **Como é montado:** composição centralizada; o indicador de capítulo acompanha a página inteira.

**19. Vídeo e parágrafo-resumo.**

- **Mostra:** bloco de vídeo com cursor "VER VIDEO" (no navegador headless o vídeo não carregou) e um parágrafo
  que resume tudo: o que é, onde fica, m², terraços e jardins, vistas e áreas comuns. A partir daqui aparece uma
  caixa coral fixa embaixo à esquerda, "Consulta disponibilidad / Reservar", com X para fechar.
- **Para quê:** resumo executivo para quem não vai ler o resto, e CTA permanente.
- **Copy:** *"La Solana es una exclusiva promoción inmobiliaria situada en la prestigiosa Urbanización Icaria...
  ofrece residencias de más de 160 m² con terrazas o jardines privados..."*

**20. Capítulo Uno: La Urbanización (ficha e mapa).**

- **Mostra:** "Capítulo Uno / LA URBANIZACIÓN (1)", "UN REFUGIO TRANQUILO CONFORTABLE Y LUMINOSO", texto sobre a
  implantação, ficha "Dirección" (rua, CEP, cidade) e "Conexiones y accesos", mapa do Google com pin, depois pares
  de imagens (render da rua interna, vista aérea).
- **Para quê:** responder "onde fica e como chego". O dado prático no meio do texto lírico.
- **Como é montado:** ficha em 2 colunas (rótulo em serifa à esquerda, lista com marcadores à direita), mapa em
  largura quase total, imagens em par assimétrico.
- **Copy:** "Conexiones y accesos: Playa Santa Cristina: 15 min a pie · Estación AVE: 5 min coche · Aeropuerto
  Alvedro: 10 min coche"

**21. (Destacados) Elegancia sencilla.**

- **Mostra:** fundo preto e uma grade de diferenciais, cada um com foto, título curto e parágrafo técnico: Sello
  Breeam (isolamento acima da norma, aerotermia, piso radiante), Orientación sur perfecta, Generando
  transparencias, Un refugio tranquilo, Espacios abiertos, Casa a la vista.
- **Para quê:** trocar adjetivo por argumento verificável (certificação, orientação solar, sistemas).
- **Como é montado:** grade de 2 colunas desencontradas, imagem em cima e texto embaixo. **Aqui toda imagem tem
  título e explicação, o oposto da home.**
- **Copy:** *"Sello Breeam. Lo ecológico suele ser también saludable... Las viviendas se aíslan con espesores muy
  superiores a los que marca la normativa vigente. Destacan las bombas de calor por aerotermia y el suelo
  radiante."*

**22. Capítulo Dos: Las viviendas (tipologias).**

- **Mostra:** "DESCUBRE LAS VIVIENDAS", texto sobre materiais (tábuas largas de carvalho, portas de carvalho até
  o teto, domótica), números de tipologia, "DETALLES" (2 vagas e depósito) e lista por tipologia (Bajos
  exclusivos, Apartamentos en planta con azotea, Dúplex con azotea), cada uma com 4 a 6 itens.
- **Para quê:** dar ao comprador o que ele compara: metragem, tipologia, o que vem incluído.
- **Como é montado:** texto, foto de interior em tela cheia com faixa de texto embaixo, listas por tipologia
  (aparentemente em abas ou acordeão; no texto extraído aparecem em sequência).
- **Copy:** *"12 dúplex de 140m2 con azotea de 60m2, 8 viviendas de hasta 145m2 con terrazas entre 60m2 y 120m2, y
  5 viviendas en bajo con jardín de 150m2."*

**23. (Destacados) Espacios que inspiran, cômodo a cômodo.**

- **Mostra:** por cômodo, foto, título e texto que nomeia material e fornecedor: "Déjate mimar" (banho: carvalho,
  pedra natural), "Experiencia sensorial" (cozinha Arrital, granito, inox, ilha voltada para o jardim), "Meterse
  en un jardín" (esquadrias Cortizo série 4600). Depois uma galeria.
- **Para quê:** provar competência técnica com nome de material e de marca, em vez de "acabamento de alto padrão".
- **Copy:** *"La madera de roble, el granito natural y el acero inoxidable son los materiales que conforman la
  cocina, equipada por el fabricante italiano Arrital."*

**24. Capítulo Tres: Comodidades.**

- **Mostra:** "UN OASIS PRIVADO DE CONFORT Y BIENESTAR", texto sobre piscina, academia, sauna e pádel, botão
  "Disponibilidad" e lista de destaques com foto e título ("Jardín tipo wild garden que conecta con la
  naturaleza", áreas comuns, academia, sauna, pádel).
- **Para quê:** vender o condomínio, não só a unidade.
- **Como é montado:** a mesma grade preta, com títulos maiores e sem parágrafo.

**25. Capítulo Cuarto: Contacto.**

- **Mostra:** "DESBLOQUEA TU SUEÑO", "CONSULTA DISPONIBILIDAD." com o botão "Disponiblidad" (com o erro de
  digitação); bloco do corretor parceiro: Ramón Rábade Doce, Director, endereço, dois telefones (650 835 702 /
  881 047 847), e-mail, site e logo da Coldwell Banker; botão "Solicitar más información".
- **Para quê:** fechar com uma pessoa nomeada e um telefone. **É o único lugar do site com telefone de
  atendimento visível.**
- **Como é montado:** capítulo numerado igual aos outros, par de fotos antes, bloco de contato centralizado com o
  nome em destaque, dados em linhas, logo do parceiro e botão.
- **Copy:** *"Nuestro equipo, en colaboración con Coldwell Banker, está a tu disposición para resolver tus dudas y
  guiarte en cada paso del proceso."*

### Comparando com `_memoria/design/00-anatomia.md`

- **Hero:** a anatomia pede o que é, para quem e o que fazer em três segundos, com prova ao lado. Aqui o hero diz
  uma promessa abstrata ("desafían lo ordinario"); só o parágrafo conta que eles fazem casas, e nada diz onde. O
  hero do projeto (18) faz melhor: nome, foto e endereço juntos.
- **Para quem é:** não existe em segunda pessoa. O mais perto é "lujo aspiracional" e a frase de cada card de
  projeto (17), que faz a triagem por situação ("Vacaciones en casa", "All you need is outdoor").
- **Como começa:** não existe. Só a frase "guiarte en cada paso del proceso", sem os passos.
- **Quem faz:** Juan Santiso nomeado, sem rosto, sem formação, sem número.
- **Como é / onde é:** é o ponto mais forte do site, mas só na página do projeto: ficha, mapa, tempos de acesso,
  metragem, material com fornecedor, áreas comuns.
- **FAQ:** não existe.
- **Contato:** existe em todas as páginas e está quebrado em quase todas (ver "Navegação e conversão").

**A diferença de fundo:** a anatomia põe o problema da pessoa na home. A NiB tira da home todo o trabalho de
informar e o empurra para a página do projeto, deixando a home só com atmosfera. Funciona como divisão de
trabalho (a home faz querer, o projeto faz decidir), mas só se o visitante chegar à página do projeto, e só se o
contato no fim dela funcionar. Aqui a primeira condição depende de atravessar o trilho horizontal e a segunda não
se cumpre.

---

## Como as imagens aparecem

O site tem **dois regimes de imagem**. Na home, a imagem não tem legenda e entra em colagem, para criar desejo.
Na página do projeto, toda imagem tem título e explicação, para convencer. Os padrões, na ordem em que valem mais
para o pedido do Marcelo:

### Colagem sobreposta sem legenda (o "uma imagem por cima da outra")

- **Onde:** home, entre o hero e "Nosotros" (2) e entre "Valores" e a lista de valores (5).
- **Como funciona:** 2 a 4 fotos de tamanhos diferentes empilhadas com deslocamento. Um ambiente amplo embaixo e
  um detalhe por cima (torneira, cuba de pedra, poltrona, folhagem), cobrindo parte do outro. Nenhum texto,
  nenhum nome de projeto.
- **Efeito:** passa atmosfera e material, a sensação de andar pela casa, sem pedir leitura. Funciona porque o
  detalhe por cima diz "acabamento". O custo: não informa de qual obra é, e por isso só se sustenta quando a
  página tem, em outro lugar, onde aquela imagem é explicada.

### Faixa que vira tela cheia

- **Onde:** hero da home e de `/proyectos/`.
- **Como funciona:** no primeiro frame a foto é uma faixa vertical estreita (cerca de 20% da largura) ao lado do
  título; com a rolagem horizontal ela se alarga até virar fundo de tela inteira.
- **Efeito:** primeiro a promessa em texto, depois a imersão. A imagem chega como recompensa da rolagem.

### Imagem dentro ou atrás das letras

- **Onde:** hero de La Solana ("SOLANA" sobre a foto da piscina), FUNCIONALIDAD na home, preview do menu.
- **Como funciona:** a tipografia gigante passa por cima da foto com mistura de cor, ou a foto aparece recortada
  pelas letras.
- **Efeito:** nome e imagem viram uma peça só; o nome do projeto fica preso à cena.

### Acordeão horizontal de projetos

- **Onde:** seção de projetos da home (7).
- **Como funciona:** um card largo e ativo (foto e painel com ano, cidade, nome, botão) e os próximos comprimidos
  em tiras finas com o número e uma fatia da foto. Com a rolagem, a próxima tira se expande e o card anterior sai.
- **Efeito:** mostra que há vários projetos (as tiras) sem perder o foco em um, e cria expectativa do próximo.

### Pilha de fotos em painel colorido

- **Onde:** fim do trilho da home (8) e de `/proyectos/`, em fundo coral.
- **Como funciona:** uma foto centralizada sobre cor chapada; a seguinte sobe e cobre a anterior, como cartas
  sendo colocadas na mesa.
- **Efeito:** sequência de ambientes em ritmo de apresentação de slides, sem grade.

### Par assimétrico

- **Onde:** bloco de contato da home (9), `/conocenos/`, página de projeto.
- **Como funciona:** uma foto grande vertical à esquerda e uma menor horizontal à direita, alinhada mais acima,
  com espaço vazio embaixo.
- **Efeito:** ritmo de revista; dá respiro e evita a grade de catálogo.

### Foto, título e parágrafo técnico (Destacados)

- **Onde:** página de projeto, em fundo preto (21, 23, 24).
- **Como funciona:** grade de 2 colunas desencontradas; cada foto tem título curto e 3 a 6 linhas explicando a
  decisão (orientação sul, certificação, cozinha Arrital, esquadria Cortizo 4600).
- **Efeito:** cada imagem vira argumento. É o regime oposto ao da home.

### Croqui ou aquarela no lugar de retrato

- **Onde:** `/conocenos/` (13, 14).
- **Como funciona:** desenhos à mão (interior aquarelado, axonometria do edifício) ao lado do texto sobre a missão
  e sobre a pessoa.
- **Efeito:** mostra autoria e processo sem foto. Por outro lado, a pessoa continua sem rosto.

### Carrossel arrastável com cursor rotulado

- **Onde:** (Galería) em `/conocenos/` e no projeto.
- **Como funciona:** foto central grande, vizinhas cortadas nas bordas, cursor que vira o círculo "ARRASTRAR".
- **Efeito:** muitas imagens sem gastar altura; o cursor ensina a interação.

### Foto principal e miniatura de outro ambiente

- **Onde:** painéis de `/proyectos/` (17).
- **Como funciona:** o painel de texto leva uma miniatura quadrada (armário de cozinha, banheiro) acima do nome,
  ao lado da foto grande de outro ambiente. A miniatura não tem legenda.
- **Efeito:** dois cômodos por projeto numa tela só: amplitude e detalhe.

### Mapa como imagem informativa

- **Onde:** Capítulo Uno do projeto (20).
- **Como funciona:** mapa do Google com pin, em largura quase total, logo abaixo da ficha de endereço e acessos.
- **Efeito:** âncora concreta de lugar no meio de uma página lírica.

### Observação de integridade: imagens aparentemente renderizadas

- **Onde:** no site todo, sobretudo nos projetos "Próximamente".
- **O que se vê:** *aparente, não confirmado*: luz e acabamento uniformes demais, e projetos ainda não entregues
  com o mesmo nível de imagem, sugerem render 3D. O site não diferencia render de obra pronta.
- **Por que importa:** para uma promotora vendendo na planta é aceitável; para um portfólio de reforma, misturar
  render com obra entregue sem avisar engana.

---

## Informação: o que tem e o que falta

**Tem:**

- O que a empresa é: promotora que constrói "viviendas" de luxo ("hacemos casas para durar").
- Região, pelos projetos: Oleiros, A Coruña, Montrove, Icaria IV.
- Manifesto e valores (Elegancia, Autenticidad, Funcionalidad), com materiais citados (carvalho, pedra calcária,
  tons terra).
- 5 projetos com ano, cidade, número, nome e uma frase; 2 marcados "Próximamente".
- Projetista de referência nomeado (Juan Santiso), com bio curta, sem formação, sem número, sem retrato.
- Na página do projeto: endereço completo, mapa, tempos de acesso (praia, estação, aeroporto); m² e tipologias;
  2 vagas e depósito; materiais e fornecedores nomeados (Arrital, Cortizo série 4600, carvalho, granito, inox);
  certificação Breeam, aerotermia, piso radiante, domótica; áreas comuns.
- Contato: e-mail `contacto@normalisboring.es` em texto visível; o corretor parceiro (Coldwell Banker) com nome,
  cargo, endereço, 2 telefones e e-mail, só na página do projeto.
- Um formulário Contact Form 7 (Nombre, Teléfono, Email, Mensaje, aceite de política) existe no código, mas não
  abriu por nenhum botão. Razão social no texto de RGPD: PROYECTOS AQF SERVICIOS, S.L.
- Telefone +34 687 37 45 81, que aparece só no rodapé da página 404.

**Falta:**

- Telefone ou WhatsApp na home e nas páginas principais.
- Endereço do escritório ou showroom, e horário.
- Formulário que dê para abrir.
- Preço ou faixa de preço, condições, prazo de entrega das obras.
- Processo de compra ou de atendimento passo a passo.
- Equipe além de Juan Santiso; nenhum retrato de pessoa no site.
- Formação, registro profissional, anos de mercado em número, quantidade de obras entregues.
- Depoimentos. Imprensa e prêmios do negócio (o selo do Awwwards é do site, não das obras).
- FAQ.
- Planta baixa: não aparece em nenhum print nem no texto extraído.
- Distinção entre render e obra entregue.
- Texto alternativo: de 25 a 55 imagens por página, só as 2 ou 3 do banner de cookies têm `alt`.
- Instagram real: o link "INSTAGRAM" aponta para a própria home.

---

## Navegação e conversão (testado)

O menu do hero (nav vertical girada) some depois do hero; dali em diante só existe a pílula "Menú". Na página do
projeto há uma caixa coral fixa "Consulta disponibilidad / Reservar", fechável. Cada caminho de contato foi
clicado ou lido no código:

| Botão ou link | Onde | Aponta para | Resultado |
|---|---|---|---|
| CONTACTO | menu | `http://contacto` | domínio que não existe |
| Solicitar información | bloco (Contacta), home e `/proyectos/` | `/contacto` | 404 |
| Reservar | caixa coral fixa do projeto | `/lasolana/contacto` | 404 (clique por JavaScript caiu em `/error404/`) |
| Solicitar más información | bloco do corretor | `/lasolana/contacto` | 404 |
| Disponibilidad | página do projeto | `http://disponibilidad/` | endereço inválido |
| `/lasolana/disponibilidad` | acesso direto | | 404 |
| e-mail (um dos links) | home | `tel:contacto@normalisboring.es` | abre o discador com um e-mail |
| e-mail (outro link) | home | `https://normalisboring.es/contacto@normalisboring.es` | endereço relativo, não abre o e-mail |
| INSTAGRAM | rodapé | a própria home | não leva ao Instagram |

**Na prática, o visitante só chega ao negócio copiando o e-mail à mão ou ligando para o corretor, cujo telefone
só aparece no fim da página de um projeto.** O site premiado mal consegue receber um contato.

---

## O que copiar

### Página de projeto em capítulos numerados, com marcador fixo do capítulo atual

- **Como é feito:** "Capítulo Uno: La Urbanización", "Capítulo Dos: Las viviendas", "Capítulo Tres:
  Comodidades", "Capítulo Cuarto: Contacto". Uma pílula fixa embaixo à esquerda ("01 • La Urbanización") diz em
  que capítulo o visitante está.
- **Por que funciona:** uma página longa vira um livro com índice. O visitante sabe onde está e quanto falta, e o
  contato entra como capítulo final, parte da história, não como interrupção.

### Ficha objetiva no meio do texto lírico

- **Como é feito:** depois de parágrafos de clima, uma ficha em duas colunas: "Dirección" e "Conexiones y
  accesos", em lista curta com marcadores, e um mapa logo abaixo.
- **Por que funciona:** quem está decidindo procura o dado com os olhos; a ficha separa o fato do clima, e o
  visitante não precisa garimpar o parágrafo.
- **Copy:** "Playa Santa Cristina: 15 min a pie · Estación AVE: 5 min coche · Aeropuerto Alvedro: 10 min coche"

### Legenda que nomeia material, fornecedor e decisão

- **Como é feito:** cada foto da grade "Destacados" tem título curto e um parágrafo que nomeia o material e a
  marca (cozinha Arrital, esquadria Cortizo série 4600, carvalho, granito, inox) ou a decisão (orientação sul,
  isolamento acima da norma).
- **Por que funciona:** nome de marca e decisão técnica são verificáveis; "acabamento de alto padrão" não é. É o
  "encenar a prova, não afirmá-la" da anatomia.

### Dois regimes de imagem, cada um no seu lugar

- **Como é feito:** na home, colagem sem legenda; no projeto, foto com título e explicação.
- **Por que funciona:** separa o que encanta do que convence. A colagem só cabe porque, mais adiante, cada imagem
  tem onde ser explicada.

### Card de projeto com uma frase-promessa além do nome

- **Como é feito:** "(2024) 03 · ¡Vacaciones en casa¡ Tres villas exclusivas en Oleiros", "All you need is
  outdoor. 12 exclusivas casas en Montrove", "Privacidad y exclusividad en el corazón de un paraíso natural".
- **Por que funciona:** o nome do projeto não diz nada a quem visita; a frase diz para quem ele é e faz a triagem
  antes do clique.

### Menu que é um índice de projetos com o lugar

- **Como é feito:** "(1) LA SOLANA Oleiros · (2) PLAZA ESPAÑA 9 A Coruña", com preview da foto no hover.
- **Por que funciona:** o portfólio vem antes do "sobre", e o lugar ao lado de cada nome mostra a atuação local
  sem precisar de uma frase sobre isso.

### Fechar o projeto com uma pessoa nomeada e um telefone

- **Como é feito:** o capítulo final traz Ramón Rábade Doce, Director, com endereço, dois telefones, e-mail e
  logo do parceiro.
- **Por que funciona:** depois de dezenas de telas de clima, o último passo é uma pessoa com nome e número. É a única
  parte do site que converte de verdade, e está enterrada no fim de uma página.

### Projeto em destaque no rodapé

- **Como é feito:** card pequeno de um projeto, com foto, frase e "Explorar", no rodapé de todas as páginas.
- **Por que funciona:** dá um último caminho a quem chegou ao fim sem converter, em vez de deixar só links
  legais.

---

## Tipografia e cor

- **Famílias (lidas no CSS computado):** Juana (serifa de display, Regular e Medium) nos títulos gigantes; Izmir
  (sans geométrica) no texto corrido, na nav e nos rótulos; Editorial New Ultralight e Italic nos rótulos entre
  parênteses ("(Contacta)", "(Galería)", "El proyecto", "Menú").
- **Mistura no hero:** sans maiúscula com uma palavra em serifa itálica ("ORDINARIO", "EXTRAORDINARIO").
- **Escala:** títulos que estouram a largura da tela, quebrados em linhas desalinhadas; texto corrido pequeno
  (cerca de 13 a 14 px, *aparente*) em colunas estreitas. O contraste entre título e corpo é extremo, e o corpo
  fica pequeno demais para ler com conforto.
- **Cor:** cada painel troca o fundo inteiro. O único valor medido é o branco do `body`, `rgb(255,255,255)`. Os
  outros são *aparentes*, não medidos: preto, bege ou creme (~`#EDE4DB`), azul-claro acinzentado (~`#C6D5E8`),
  coral (~`#DD5B58`), cinza médio (~`#6E6E6E`) e um verde-azulado no cursor e nos círculos do cursor.
- **Quantos acentos de verdade:** nenhum acento único; o sistema é troca de fundo por seção e cor de painel por
  projeto. O coral é o mais forte e aparece nos momentos de fecho e de ação (fim do trilho, galeria, caixa fixa
  "Consulta disponibilidad", rodapé do `/conocenos/`).
- **Logo** com blend mode, mudando de cor sobre as imagens.
- **Mobile:** palavras quebram no meio (AUTENTICIDA/D, FUNCIONALID/AD).

---

## O que serve à Débora Reis

### A diferença de propósito, antes de copiar qualquer coisa

A NiB vende **unidade de empreendimento** a quem vai comprar imóvel de luxo, e vende estilo de vida. A Débora
vende **o serviço de uma profissional só**: projeto, acompanhamento de obra e decoração. Por isso, da NiB se
reaproveitam a **estrutura da página de projeto** e o **tratamento de imagem**; a home dela não pode ser só
manifesto, porque quem contrata uma profissional solo está contratando a pessoa, e precisa ver quem ela é, o que
o serviço inclui, como começa e como falar com ela.

### O que aproveitar, e como

1. **Capítulos numerados com marcador fixo.** Cada reforma pode virar capítulos que espelham as três frentes do
   serviço: o apartamento como estava e o pedido; o projeto (planta, decisões); a obra acompanhada; a decoração e
   o resultado. Reforma é uma história de transformação, e os capítulos mostram que ela faz as três etapas, não
   só a foto final. O esboço já tem o Rio Vermelho em capítulos (o que mudou, as cores, a luz e os objetos,
   segundo o `CLAUDE.md` do protótipo); a NiB acrescenta o marcador fixo do capítulo atual. Antes e depois e
   planta, só se ela tiver o material; senão, `[FALTA]`.
2. **Ficha de cada projeto.** Bairro, m², ano, escopo (projeto, acompanhamento de obra, decoração) e duração da
   obra, só com dado real e `[FALTA]` no resto. Quem pensa em reformar quer saber se o caso é parecido com o dele
   (tamanho, bairro, escopo) antes de se encantar.
3. **Legenda de decisão.** "Derrubamos a parede da cozinha para integrar com a sala", o nome da marcenaria ou do
   revestimento, desde que venham dela. Em reforma, a prova de competência é a decisão técnica, e nomear o
   material mostra domínio sem autoelogio.
4. **Dois regimes de imagem.** A home pode usar colagem de detalhes reais (marcenaria, metais, texturas) sem
   texto, desde que cada imagem leve a um projeto onde ela é explicada.
5. **Card com frase-promessa.** Cada card diz em uma linha o problema resolvido, com dado real (bairro, tipo de
   imóvel, o que mudou). Nome de cliente ou de projeto não diz nada a quem visita.
6. **Menu como índice de projetos com o bairro.** Listar os projetos com o bairro de Salvador ao lado (Rio
   Vermelho e os que ela confirmar) sinaliza atuação local logo no menu.
7. **Contato no fim de cada página e CTA fixo no projeto.** No fim de cada projeto, um convite ligado ao caso
   ("tem um apartamento parecido?"). Um botão de WhatsApp fixo seria a versão direta disso, mas o esboço tirou o
   botão do WhatsApp do rodapé em 15/10 (`CLAUDE.md` do protótipo): voltar com ele é decisão do Marcelo. E a
   lição oposta da NiB: cada link precisa ser clicado e testado antes de publicar.
8. **Projeto em destaque no rodapé.** O projeto mais forte dela no rodapé de todas as páginas.
9. **Autoria por croqui, mas com rosto.** Desenhos e plantas dela são prova de autoria. Ao contrário da NiB, ela
   precisa aparecer com retrato e formação (UFBA 2004, que o esboço já mostra), porque numa profissional solo a
   pessoa é o produto.
10. **Trocar valores abstratos pelas três frentes numeradas.** No lugar de "01 Elegancia, 02 Autenticidad", as
    três frentes do serviço numeradas (projeto, acompanhamento de obra, decoração), cada uma dizendo o que inclui.
    Valor abstrato não diferencia ninguém; dizer o que está incluído diferencia.

### O que a NiB não tem e o site da Débora precisa ter (conferir no esboço)

- Telefone ou WhatsApp visível sem precisar chegar ao fim de uma página.
- Endereço e forma de atendimento (a ficha do Google dá a Barra).
- Como começa, em passos, com o que acontece em cada um.
- Rosto, nome, formação e registro profissional, quando existir.
- Perguntas que os clientes fazem (prazo, quem contrata a obra, como se cobra).
- Planta, quando ela tiver.
- Separação clara entre obra entregue e qualquer imagem que não seja obra entregue.
- Texto alternativo em toda foto.
- Link do Instagram que leve ao Instagram.

---

## O que não copiar

- **Rolagem horizontal fixada na home.** O painel seguinte cobre o texto antes de dar para ler (o parágrafo
  "Creamos espacios..." some sob o painel coral), e quem rola rápido não lê nada. Ver a régua do
  conceito-assinatura em `_memoria/design/60-motion.md`.
- **Texto revelado palavra por palavra e letras que se embaralham antes de assentar.** Atrasam a leitura de
  quem veio buscar informação.
- **Página de projeto com cerca de 38.000 px (umas 42 telas).** Longa demais para quem decide no celular.
- **Caminhos de contato quebrados** (`http://contacto`, `http://disponibilidad/`, 404 em "Solicitar
  información" e "Reservar", `tel:` com e-mail, Instagram apontando para a home). E nenhum telefone ou WhatsApp
  na home, com o e-mail como único canal visível.
- **Título genérico** ("Espacios de vida que desafían lo ordinario"), que serve para qualquer construtora e não
  diz o que fazem nem onde sem ler o parágrafo.
- **Valores abstratos** (Elegancia, Autenticidad, Funcionalidad) que qualquer escritório assinaria, e o bloco de
  descrição aparecendo trocado no desktop (texto de Funcionalidad ao lado de Elegancia).
- **Mobile descuidado:** palavras quebradas no meio, o logo fixo "is BORING" por cima do texto e do botão, a fita
  do Awwwards cobrindo texto.
- **Pessoa-chave sem rosto e com credencial vaga** ("un referente... durante décadas"), sem número nem formação
  verificável.
- **Render apresentado como projeto sem dizer que é render** (*aparente*). Para a Débora, render não passa por
  obra entregue.
- **Imagens sem texto alternativo.**
- **Erros de digitação em botão e texto:** "Disponiblidad", "estimulamte", "¡Vacaciones en casa¡", "mas
  confort".
- **Ego de marca:** o wordmark gigante "BORING" no rodapé e o cursor customizado com rótulos têm custo de
  desenvolvimento e não ajudam uma profissional solo a receber contato.
- **Copy em tom de anúncio de luxo** ("Desbloquea tu sueño", "Exclusividad en su máxima expresión"), que contraria
  o tom calmo e factual que uma reforma pede.

---

## Aplicado onde

Ainda não. Estudado em 15/10/2026 para o esboço da Débora Reis (`clientes/_prototipos/debora-reis/`, no ar em
https://esboco-debora-reis.vercel.app). Candidatos à aplicação: o marcador fixo de capítulo na página do Rio
Vermelho, a ficha por projeto e a legenda de decisão. Preencher quando acontecer, com a adaptação feita.

Prints (35 telas, somem com a sessão):
`/tmp/claude-0/-home-user-HorusOS-Pro/ada53c37-1efb-518e-8aec-f8416f2ef82e/scratchpad/ref/normalisboring/`
