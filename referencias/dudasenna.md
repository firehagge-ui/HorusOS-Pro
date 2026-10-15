# Teardown: Duda Senna Arquitetura & Decoração (São Paulo, Jardins)

- **URL:** https://www.dudasenna.com.br/
- **Segmento:** arquitetura de interiores residencial de alto padrão em São Paulo (Jardins), com marca pessoal forte
  da arquiteta e uma linha de produtos licenciados. Site em template Squarespace (Index page com parallax).
- **Estudado em:** 15/10/2026, em navegador automatizado: home em desktop 1440x900 (14 prints até o rodapé) e em
  mobile 390x844 (18 prints); `/projetos` (44 projetos, 20 prints); `/cobertura-duplex-dj` (página de projeto
  individual, 24 prints até a ficha técnica e o rodapé, com teste de clique em foto); `/about`; `/contato` em desktop
  e celular; `/itens-assinados`; `/midiakit` (bloqueado por senha, o servidor responde 401).
- **Nota:** 6/10. A página de projeto (passeio de fotos, planta, paleta de materiais, ficha) e o formulário de
  orçamento são o melhor modelo do site para a Débora. A home quase não informa, e nenhuma página de projeto tem saída
  no fim.
- **Contexto:** estudado a pedido do Marcelo para o site da Débora Reis (`clientes/_prototipos/debora-reis/`). **Não é
  site premiado nem do Awwwards:** é escritório concorrente de mercado, conhecido, que vende pela marca pessoal e pela
  foto, quase sem texto. Entra no lote porque mostra até onde dá para ir só com imagem, e o que isso custa quando a
  fama não está trabalhando pelo escritório.

**Em resumo:** o site fala com quem já chega com a Duda na cabeça, vindo do Instagram dela, e quer confirmar o gosto e
pedir orçamento. O trabalho principal dele é ser **um catálogo de prova visual**: 18 projetos na home, 44 na página de
projetos, e cada projeto com cerca de 60 fotos, planta, paleta de materiais e ficha técnica. Quase não explica nada.
Não há serviços, processo, prazo, preço, depoimento nem imprensa, porque a fama e as redes fazem esse trabalho fora do
site. **Para a Débora serve a lógica da página de projeto e do formulário. A ausência de explicação não serve, porque
ela não tem essa fama trabalhando por ela.**

---

## Estrutura, na ordem

### Fixo em todas as páginas

**0. Cabeçalho.**

- **Mostra:** logo "DUDA SENNA" como wordmark linear fino à esquerda; menu à direita, em branco sobre a foto, com
  quatro itens nesta ordem: PROJETOS, ITENS ASSINADOS, CONTATO, SOBRE.
- **Para quê:** dizer de quem é o site e dar as quatro portas. A ordem do menu põe o portfólio primeiro e o "Sobre" por
  último, o que combina com um público que já sabe quem ela é.
- **Como é montado:** no desktop o menu fica sobreposto ao hero e **não acompanha a rolagem**. No celular vira
  hambúrguer e o cabeçalho com o logo fica fixo no topo. Não há botão de contato nem WhatsApp no cabeçalho.

**7. Rodapé (igual em todas as páginas).**

- **Mostra:** fundo cinza-chumbo com o título "CONFIRA MAIS PROJETOS NAS NOSSAS REDES SOCIAIS @DUDASENNAARQUITETURA";
  o feed do Instagram com 5 quadrados (obra, quarto infantil, a arquiteta com os filhos, um vídeo dela); os ícones
  sociais, sendo o primeiro um ícone genérico de "link" que é o WhatsApp, seguido de Instagram, Pinterest, TikTok,
  Facebook e YouTube; um botão MIDIAKIT; o nome do escritório, o endereço (Alameda Jaú, 48/131, Jardins), dois
  telefones e o e-mail.
- **Para quê:** provar que o escritório está ativo hoje e empurrar o visitante para o Instagram, que é onde a marca
  pessoal vive. O mídia kit é para marcas e imprensa. E deixa os dados de contato em toda página.
- **Como é montado:** bloco centralizado, todo em caixa alta com letras espaçadas. **Telefone e e-mail não são links no
  HTML.** O WhatsApp está escondido atrás de um ícone de link com `aria-label` "URL", mas já leva uma mensagem pronta:
  *"Oi, estava olhando o site e me interessei pelos projetos."* O MIDIAKIT abre uma página com senha. No celular o feed
  vira 2 colunas.

### Home

**1. Hero: a arquiteta dentro de um projeto.**

- **Mostra:** foto larga de uma sala com estante de livros, plantas e sofá verde, com a arquiteta sentada à direita,
  sorrindo. É a mesma pessoa da foto do Sobre, e a sala tem as mesmas prateleiras e luminária do card "Garden DJ". No
  centro, o monograma "DS" em linha branca fina. Embaixo, uma seta (chevron) para rolar.
- **Para quê:** responder em um quadro **quem é e o que ela faz**: o rosto e o trabalho aparecem juntos. Como a marca é
  a pessoa, a primeira coisa vista é ela habitando um ambiente que projetou. Isso humaniza e liga a assinatura visual
  (cor, livros, planta) a alguém real. O monograma funciona como selo de autoria.
- **Como é montado:** foto de largura total com cerca de 520 px de altura num viewport de 900 px, então não ocupa a
  tela inteira e já deixa ver o começo da frase de baixo. O menu fica sobreposto. **Não há headline, botão nem texto.**
  A foto é recortada na horizontal a partir de um original vertical (1500x2251), tem parallax (anda mais devagar que a
  página) e o monograma por cima como marca d'água. No celular a foto cai para uns 400 px.
- **Copy:** nenhuma além do menu e do monograma DS.

**2. Frase-manifesto (o H1 da página).**

- **Mostra:** um parágrafo único, centralizado, em Josefin Sans light de cerca de 37 px. A palavra "portfólio" é um
  link sublinhado para `/projetos`.
- **Para quê:** dizer qual é a assinatura (cores, texturas e marcenaria) e logo depois tranquilizar o cliente:
  "respeitando a personalidade de cada cliente", ou seja, a casa não vai sair com a cara dela e sim com a dele. A frase
  também afirma autoridade ("reconhecimento nacional e internacional"), **mas o site não prova isso em lugar nenhum**.
- **Como é montado:** bloco de texto solto com mais de 150 px de respiro em cima e embaixo, sem título, sem botão e sem
  imagem. **É a única fala de posicionamento da home inteira.** No celular a frase passa de 10 linhas e ocupa mais de
  uma tela.
- **Copy:** *"Com atuação e reconhecimento nacional e internacional, Duda Senna mantém vasto portfólio de projetos
  autorais que se destacam pelo uso característico de cores, texturas e marcenaria, respeitando a personalidade de cada
  cliente"*

**3. Foto de respiro em largura total, sem legenda.**

- **Mostra:** varanda com parede de pedra, quadro colorido, sofá rosa, poltrona coral e tapete listrado. O arquivo
  (DSJARDINS) é do Duplex DJ, o projeto de 2025 que abre o grid logo abaixo. A âncora interna da seção ainda se chama
  "Projeto GA", nome que sobrou de uma versão antiga.
- **Para quê:** a imagem prova sozinha o que a frase acabou de dizer: cor, textura e marcenaria aparecem sem nenhum
  texto. É também uma pausa entre a fala e o catálogo. O projeto mais recente ganha a maior área da página: aparece
  aqui em tela cheia e de novo como primeiro card.
- **Como é montado:** faixa de borda a borda com cerca de 520 px de altura, sem margem lateral, sem texto e sem clique.
  Parallax: nos prints em sequência, o conteúdo da foto desce uns 300 px dentro da moldura enquanto a página rola
  630 px.

**4. Grid de projetos (18 cards).**

- **Mostra:** 18 projetos, cada um com uma foto e o nome em código embaixo: DUPLEX DJ, GARDEN DJ, DUPLEX JM,
  APARTAMENTO EK, DUPLEX WV, CASA TR, DUPLEX EF, APARTAMENTO EG, CASA BJ, APARTAMENTO RG, TRIPLEX LL, DUPLEX NB II,
  GARDEN MIRÁ FA; depois INCORPORAÇÃO | VIVA BENX CASA DO ATOR, COMERCIAL | AVA INTIMATES, CONSULTÓRIO FS, DUPLEX JR e
  APARTAMENTO CM.
- **Para quê:** a home funciona como **cardápio de provas**. Mostra volume (dá para ver que ela já fez muito) e
  variedade de tipos, e deixa todo o detalhe para a página de cada projeto. Os residenciais vêm primeiro, porque é isso
  que o público principal compra; os comerciais e o consultório aparecem depois, como sinal de alcance.
- **Como é montado:** começa em 2 colunas de larguras desiguais (cerca de 57% e 40%, depois cerca de 50% e 50%), com
  fotos de alturas diferentes, de modo que as duas colunas ficam desencontradas, num efeito parecido com masonry. Os 3
  itens comerciais ficam numa linha de 3 colunas iguais e os 2 últimos voltam a 2 colunas. O nome fica embaixo em caixa
  alta, cinza `#888181` (medido), pequeno e com letras espaçadas. **Não há descrição, bairro, metragem nem filtro.** No
  hover não houve mudança perceptível no print. No celular vira 1 coluna.

**5. Faixa "+ PROJETOS".**

- **Mostra:** foto larga de uma cozinha com armários rosados e ilha de madeira, com "+ PROJETOS" em branco, grande e
  sublinhado, no centro.
- **Para quê:** fechar o grid e levar quem quer mais para o portfólio completo (44 projetos). É uma segunda saída para
  `/projetos`, com cara de imagem e não de botão.
- **Como é montado:** faixa de largura total com cerca de 470 px, parallax e o texto-link centralizado. Sem legenda do
  projeto. **Não leva a contato.**

**6. Chamada de contato.**

- **Mostra:** uma frase-link sublinhada e centralizada que leva a `/contato`.
- **Para quê:** é **a única chamada para virar cliente na home**. A expressão "à distância" abre o mercado para fora de
  São Paulo e já responde a pergunta "vocês atendem minha cidade?".
- **Como é montado:** bloco branco com muito respiro, sem botão de verdade e sem WhatsApp, só texto sublinhado.
  **Aparece depois de uns 7.500 px de rolagem no desktop.**
- **Copy:** *"Comece agora seu projeto presencial ou à distância"*

### Página Projetos (`/projetos`)

**8. Portfólio completo (44 projetos).**

- **Mostra:** 44 projetos na ordem residenciais (cerca de 31) → incorporadora, comercial e decorado → consultórios (3)
  → mostras e stands no fim (Mostra Casa Mineira 2023/2024/2025, Casa Pronta 2025, Showroom Linea Home 2024, Stand
  Lepri Expo Revestir 2024, Expo Revestir 2018/2019).
- **Para quê:** mostrar volume e constância. **As mostras no fim fazem, sem nome, o papel de "reconhecimento"**,
  porque são a única evidência no site da autoridade alegada na home.
- **Como é montado:** o mesmo grid da home (2 colunas desiguais, 3 colunas nos comerciais), com o código do projeto
  embaixo. Sem filtro por tipo, sem contagem e sem texto de introdução.

### Página de projeto individual (`/cobertura-duplex-dj`)

**9. Abertura.**

- **Mostra:** foto larga do living (parede de pedra, quadro colorido, sofá rosa) com o título "Duplex DJ" em branco no
  centro e a seta para rolar.
- **Para quê:** nomear o projeto e mostrar o ambiente-assinatura dele antes do passeio.
- **Como é montado:** hero de cerca de 470 px, foto sangrada com parallax e o título sobreposto. **Não há texto de
  apresentação, briefing do cliente nem descrição do que foi feito.**

**10. Galeria-passeio (cerca de 60 fotos).**

- **Mostra:** as fotos seguem a ordem de quem anda pelo apartamento: hall de entrada com papel de parede floral →
  living → cozinha → varanda gourmet → bar → escada → quartos (inclusive o do bebê) → banheiros → sala íntima. A
  primeira foto da galeria mostra a própria arquiteta, grávida, segurando uma caneca no hall, com um cachorro aos pés.
- **Para quê:** fazer o visitante "visitar" a casa sem precisar de texto. Alternar plano aberto (a sala inteira) e
  detalhe (porta, papel, marcenaria) prova cuidado no acabamento. Pôr a arquiteta na primeira foto mantém a marca
  pessoal até dentro do projeto.
- **Como é montado:** os padrões de linha variam o tempo todo: 3 retratos iguais lado a lado; 1 paisagem grande com 2
  empilhadas ao lado; 4 fotos pequenas numa linha; 1 foto sangrada de borda a borda; 2 retratos centralizados com
  margem lateral maior. Nenhuma foto tem legenda. **Clicar numa foto não abriu ampliação (lightbox) no teste.** As
  imagens aparecem com fade ao entrar na tela (um print pegou uma foto ainda meio transparente).

**11. Planta + paleta de materiais + ficha técnica.**

- **Mostra:** planta humanizada colorida do pavimento; 8 quadrados de cor e material (cinza, terracota,
  vermelho-tijolo, verde, azul-marinho, azul-claro, papel floral, listrado); e a ficha em 4 linhas.
- **Para quê:** mostrar o trabalho que a foto não mostra. **A planta prova que houve projeto (layout, circulação) e não
  só decoração, e a paleta revela o método** de escolher cor e material. A ficha deixa o visitante se comparar ("310 m²
  no Jardim Paulista, parecido com o meu?"), e o crédito a fotógrafo e paisagista passa profissionalismo.
- **Como é montado:** bloco centralizado e estreito no fim da página: planta, paleta e a ficha em caixa alta cinza,
  todos como imagem plana, sem legenda explicativa. **Depois disso vem direto o rodapé**, sem "próximo projeto", sem
  "quero um projeto assim" e sem botão de contato.
- **Copy:** "JARDIM PAULISTA, SÃO PAULO • SP · ANO: 2025 • ÁREA: 310M² · FOTOS: GISELE RAMPAZZO · PAISAGISMO: LETÍCIA
  BONONI"

### Página Sobre (`/about`)

**12. Quem é.**

- **Mostra:** à esquerda, 4 parágrafos centralizados: (1) formação em Arquitetura e Urbanismo pelo Mackenzie e
  escritório que leva o nome dela em SP desde 2014; (2) reconhecimento e uso de cor e textura, com "carioca, busca
  trazer o colorido e a alegria do Rio de Janeiro"; (3) conciliar maternidade e carreira e compartilhar a rotina de obra
  nas redes; (4) co-criadora do curso "Vemos Cores em Você". À direita, retrato vertical dela sorrindo numa poltrona
  vermelha. Embaixo, botão lilás em pílula "FAÇA SEU PROJETO CONOSCO".
- **Para quê:** dar credencial (formação e ano de abertura), **explicar de onde vem o estilo** (a origem carioca
  justifica a cor), aproximar pela vida pessoal (maternidade e redes) e reforçar autoridade como professora. O botão
  leva ao contato quem já foi convencido pela pessoa.
- **Como é montado:** 2 colunas, texto com filete fino em cima e embaixo, foto à direita, num ambiente colorido que
  também funciona como amostra do estilo. Página curta, **sem linha do tempo, sem equipe** (a meta description fala em
  "e sua equipe", mas nenhuma equipe aparece) **e sem número de registro no CAU**.
- **Copy:** *"Arquiteta e urbanista pela Universidade Presbiteriana Mackenzie, Duda está à frente do escritório de
  arquitetura e interiores que leva o seu nome, em São Paulo, desde 2014."*

### Página Contato (`/contato`)

**13. Orçamento e canais separados por público.**

- **Mostra:** à esquerda, "Orçamento para projetos" com Tel., WhatsApp e Email, e um formulário com Nome, Telefone com
  WhatsApp, Email, Objetivo (Imóvel completo / Alguns cômodos / 01 cômodo), Metragem, Cidade e Mensagem, todos
  obrigatórios, mais o botão ENVIAR. À direita, blocos separados: "Marketing e Mídias" (outro WhatsApp e e-mail),
  "Fornecedores" (link para um formulário do Microsoft Forms), "Trabalhe conosco" (e-mail de currículos) e o mapa do
  Google.
- **Para quê:** **o formulário qualifica o lead antes da primeira conversa.** Objetivo, metragem e cidade dizem o
  tamanho do trabalho e se o atendimento é presencial ou à distância. Os canais separados por público tiram ruído do
  canal de orçamento.
- **Como é montado:** 2 colunas com filetes separando os blocos. Os números aparecem como texto, não como link
  clicável. **Não diz quanto tempo leva para responder nem o que acontece depois de enviar.** No celular vira 1 coluna,
  com o formulário primeiro.

### Páginas de extensão de marca

**14. Itens Assinados (`/itens-assinados`).**

- **Mostra:** 8 cards de produtos feitos em parceria: papéis de parede (Estúdio Papel), mobiliário infantil
  (Muskinha), enxoval e almofadas (Linea Home), tapetes Coleção Alegria (Mazco + Decoralle), cerâmica Encontros
  (Cerâmica e Cia), floreiras Linha Oli (Galeria das Lonas), ladrilhos Duda + Ladrilar e azulejo Bossa (Mica Estudio).
  Em 4 cards a própria Duda segura o produto.
- **Para quê:** mostrar a arquiteta como designer cujo gosto as marcas licenciam. É autoridade por extensão de marca, e
  também receita.
- **Como é montado:** grid de 4 colunas, cards de cantos arredondados com texto sobreposto na foto: categoria em
  itálico, nome em negrito caixa alta e a marca parceira pequena. É um tratamento diferente do resto do site.

**15. Midiakit (`/midiakit`).**

- **Mostra:** tela cinza com um cadeado e um campo "Senha". O servidor responde 401.
- **Para quê:** material para marcas e imprensa, liberado por senha.
- **Como é montado:** página travada, mas com link aberto em botão de destaque no rodapé de todas as páginas.

### Comparando com `_memoria/design/00-anatomia.md`

- **Hero:** a anatomia pede o que é, para quem e o que fazer em três segundos, com prova ao lado e um CTA. A Duda
  responde "quem é" e "como é o trabalho" com uma foto só, e não responde nada do resto: não há promessa, não há para
  quem, não há botão. Funciona para quem chega do Instagram já sabendo; não para quem chega pelo Google.
- **Para quem é:** não existe. O mais perto é "respeitando a personalidade de cada cliente", que é garantia, não
  reconhecimento.
- **O que fazemos:** não existe. O visitante deduz pelas fotos que ela faz residencial, comercial e consultório, mas
  não sabe se o serviço inclui executivo, obra ou compra.
- **Como começa:** não existe em texto. **O formulário faz parte desse trabalho sem dizer**: ao pedir objetivo,
  metragem e cidade, ele mostra o que importa para o orçamento. Falta dizer o que acontece depois de enviar.
- **Quem faz:** é o bloco mais forte, espalhado pelo site inteiro (hero, galeria, Sobre, Itens, feed). Falta o CAU.
- **Como é / Onde é:** a página de projeto é o "como é" mais completo do lote (passeio, planta, paleta, ficha).
  Endereço e mapa estão no contato e no rodapé.
- **FAQ:** não existe.
- **Contato:** formulário bom, caminho ruim: escondido no fim da home, ausente no fim dos projetos, números não
  clicáveis.
- **Encenar a prova:** a planta e a paleta encenam o método. A frase da home afirma "reconhecimento" e não encena.

**A diferença de fundo:** a anatomia escreve a home para quem ainda não conhece o escritório. A Duda escreve para quem
já conhece. As duas coisas que ela não precisa fazer (explicar e provar autoridade) são justamente as que a Débora
precisa.

---

## Como as imagens aparecem

O site tem um regime de imagem só: **foto como argumento, interface neutra, quase nenhuma legenda.** A cor do site
inteiro vem das fotos. **O site não sobrepõe imagens umas às outras em lugar nenhum**; a única sensação de camada vem
do parallax. O padrão de "uma imagem por cima da outra" que o Marcelo citou está em [Normal is Boring](normalisboring.md),
não aqui. O que a Duda ensina sobre "imagem que mostra o trabalho sem dizer o que tem nela" é a **galeria-passeio** e a
**foto de respiro**.

### Foto de respiro em largura total, sem legenda, com parallax

- **Onde:** home, logo depois da frase-manifesto e na faixa "+ PROJETOS"; abertura de cada página de projeto.
- **Como funciona:** foto de borda a borda com uns 470 a 520 px de altura. A imagem anda mais devagar que a rolagem (o
  conteúdo desce uns 300 px dentro da moldura a cada 630 px rolados). Sem texto, ou só com um título curto sobreposto.
- **Efeito:** cria pausa e clima. A foto prova o argumento sem explicação, e o movimento lento dá profundidade sem
  sobrepor imagens.

### Grid assimétrico em 2 colunas desencontradas

- **Onde:** home (18 projetos) e `/projetos` (44).
- **Como funciona:** duas colunas de larguras desiguais (cerca de 57/40, depois 50/50), com fotos de alturas
  diferentes, então as linhas não se alinham, num efeito masonry. Para comerciais e mostras o grid passa a 3 colunas
  iguais. O único rótulo é o código do projeto em caixa alta cinza embaixo.
- **Efeito:** o catálogo não parece tabela de template. A alternância de proporção mantém o olho andando, e a legenda
  mínima deixa a foto falar. O custo é que o código não diz nada ao visitante.

### Galeria-passeio sem legenda

- **Onde:** página de cada projeto (cerca de 60 fotos no Duplex DJ).
- **Como funciona:** as fotos seguem a ordem física da casa (entrada → sala → cozinha → varanda → quartos → banhos). A
  forma de cada linha muda o tempo todo: 3 retratos; 1 grande com 2 empilhadas; 4 pequenas; 1 sangrada; 2
  centralizadas com margem maior. Plano aberto e detalhe se alternam. Sem legenda, sem ampliação ao clicar, com fade ao
  entrar na tela.
- **Efeito:** o visitante "anda" pelo apartamento. É exatamente a forma de mostrar o trabalho sem dizer o que tem em
  cada foto, como o Marcelo descreveu. O ritmo vem da troca de proporção e de largura, não de texto. **O risco é
  cansar:** 60 fotos seguidas, sem texto e sem saída no fim.

### A arquiteta dentro do trabalho

- **Onde:** hero da home (sentada na sala do Garden DJ), primeira foto da galeria do Duplex DJ (grávida, no hall, com o
  cachorro), Sobre (na poltrona vermelha), Itens Assinados (segurando os produtos), feed do rodapé.
- **Como funciona:** a pessoa aparece no ambiente projetado como alguém que vive ali, não como foto de perfil isolada.
- **Efeito:** junta rosto e assinatura. Para escritório de uma pessoa só, faz a pessoa virar a marca e dá confiança a
  quem vai abrir a casa para uma obra.

### Planta humanizada e paleta de materiais no fim do projeto

- **Onde:** fim de cada página de projeto, antes da ficha técnica.
- **Como funciona:** planta colorida do pavimento e uma grade de 8 quadrados de cor e textura (pintura, piso, papel de
  parede) usados no projeto, centralizadas e sem explicação.
- **Efeito:** mostra o raciocínio que a foto esconde e separa "projeto" de "decoração". É prova de método.

### Monograma como marca d'água

- **Onde:** hero da home.
- **Como funciona:** "DS" em traço branco fino sobre a foto, no centro.
- **Efeito:** selo de autoria no primeiro quadro, sem precisar de headline.

### Card com texto sobreposto

- **Onde:** Itens Assinados.
- **Como funciona:** foto com cantos arredondados e três níveis de texto branco no centro: categoria em itálico, nome
  em caixa alta, marca parceira pequena.
- **Efeito:** leitura de catálogo de produto, diferente do portfólio. Sinaliza que existe outra linha de negócio.

### Feed do Instagram como prova de vida

- **Onde:** rodapé de todas as páginas.
- **Como funciona:** 5 posts recentes em quadrados sem legenda, misturando obra e vida pessoal (filhos, vídeo dela
  falando).
- **Efeito:** mostra que o escritório está ativo hoje e leva o visitante para a rede, onde está a comunidade.

---

## Informação: o que tem e o que falta

**Tem:**

- Nome e marca (wordmark e monograma DS).
- Posicionamento numa frase: cores, texturas e marcenaria, respeitando a personalidade de cada cliente.
- Alegação de "reconhecimento nacional e internacional" (sem prova no site).
- Portfólio: 18 projetos na home e 44 em `/projetos`, em categorias implícitas: residencial (apartamento, duplex,
  triplex, casa, garden), incorporação e decorado, comercial, consultórios, mostras e stands.
- Ficha de projeto: bairro e cidade, ano, área em m², fotógrafo, paisagista.
- Planta humanizada e paleta de materiais por projeto.
- Cerca de 60 fotos por projeto, em sequência de passeio.
- Sobre: formação (Mackenzie), escritório próprio desde 2014, origem carioca como justificativa do estilo,
  maternidade e presença nas redes, curso "Vemos Cores em Você".
- Itens assinados: 8 produtos em parceria com marcas.
- Modalidade de atendimento: presencial ou à distância.
- Contato de orçamento: telefone fixo, WhatsApp, e-mail, endereço (Alameda Jaú, 48/131, Jardins, SP) e mapa.
- Formulário qualificador: objetivo (imóvel completo / alguns cômodos / 1 cômodo), metragem, cidade, telefone com
  WhatsApp.
- Canais separados: marketing e mídias, cadastro de fornecedores (Microsoft Forms), trabalhe conosco.
- Redes: Instagram, Pinterest, TikTok, Facebook, YouTube, com o feed do Instagram embutido.
- WhatsApp com mensagem pré-preenchida (*"Oi, estava olhando o site e me interessei pelos projetos."*).
- Mídia kit (atrás de senha).

**Falta:**

- Lista de serviços (o que está incluído: projeto, executivo, acompanhamento de obra, compras, decoração).
- Processo e etapas de trabalho.
- Prazo típico de projeto e de obra.
- Faixa de investimento ou forma de cobrança.
- FAQ.
- Depoimentos de clientes.
- Imprensa, prêmios ou publicações, apesar da alegação de reconhecimento na home. As mostras só aparecem misturadas no
  fim do portfólio.
- Texto descritivo em cada projeto: pedido do cliente, problema e solução.
- Antes e depois da reforma.
- Equipe (a meta description da página Sobre fala em "sua equipe", mas ninguém aparece).
- Registro profissional (CAU).
- Área geográfica de atendimento explícita (só "presencial ou à distância").
- Horário de atendimento e tempo de resposta ao formulário.
- Chamada para contato ou "próximo projeto" no fim das páginas de projeto.
- SEO básico: a home não tem meta description, o schema LocalBusiness está vazio, e o alt das imagens é nome de
  arquivo ou vazio.

**Sobras encontradas:** a âncora da foto de respiro ainda se chama "Projeto GA", de uma versão antiga da home.

---

## Navegação e conversão

O menu tem 4 itens (PROJETOS, ITENS ASSINADOS, CONTATO, SOBRE). No desktop ele fica sobre o hero e some ao rolar; no
celular o cabeçalho fica fixo. **Na prática, o caminho até o contato depende de o visitante procurar "Contato" no menu
ou rolar a home inteira.** O banner de cookies cobre o canto inferior direito até alguém clicar em OK.

| Caminho | Onde | Leva para | Observação |
|---|---|---|---|
| Link na palavra "portfólio" | frase-manifesto da home | `/projetos` | |
| Faixa "+ PROJETOS" | depois do grid da home | `/projetos` | segunda saída para mais obra, nenhuma para contato |
| "Comece agora seu projeto presencial ou à distância" | fim da home | `/contato` | só texto sublinhado; aparece depois de uns 7.500 px de rolagem no desktop |
| "FAÇA SEU PROJETO CONOSCO" | página Sobre | `/contato` | o único botão de verdade para contato, em pílula lilás |
| Ícone de "link" no rodapé | todas as páginas | WhatsApp com *"Oi, estava olhando o site e me interessei pelos projetos."* | boa mensagem, escondida atrás de ícone genérico com `aria-label` "URL" |
| Telefone e e-mail | rodapé e `/contato` | nada | texto em caixa alta, não clicável |
| MIDIAKIT | rodapé, em destaque | tela de senha (401) | beco sem saída para qualquer visitante comum |
| Fim da página de projeto | depois da ficha técnica | rodapé | **sem chamada, sem próximo projeto** |

---

## O que copiar

### Página de projeto como passeio pela casa

- **Como é feito:** as fotos seguem a ordem em que se anda pelo imóvel (entrada, sala, cozinha, varanda, quartos,
  banhos), alternando plano aberto e detalhe, com a forma da linha mudando a cada bloco (3 retratos; 1 grande + 2
  empilhadas; 4 pequenas; 1 sangrada; 2 centralizadas).
- **Por que funciona:** a sequência física substitui a legenda: o visitante sabe onde está sem que ninguém diga. A
  troca de proporção impede o grid monótono, e o detalhe ao lado do plano aberto prova o acabamento.

### Planta e paleta de materiais fechando o projeto

- **Como é feito:** planta humanizada colorida e 8 amostras de cor e material, centralizadas no fim da página.
- **Por que funciona:** a foto mostra resultado; a planta mostra decisão (layout, circulação) e a paleta mostra método.
  É o "encenar a prova" da anatomia aplicado a interiores: o visitante vê que houve projeto, não só compra de móvel.

### Ficha técnica com área, bairro, ano e créditos

- **Como é feito:** quatro linhas no fim do projeto: bairro e cidade, ano, área em m², fotógrafo e paisagista.
- **Por que funciona:** é a tríade de metadados da anatomia (local, tipo, escala) mais o crédito, que passa
  profissionalismo. O visitante compara com o próprio imóvel. (A Duda põe esse dado só no fim da página; copiar levando
  também para o card.)
- **Copy:** "JARDIM PAULISTA, SÃO PAULO • SP · ANO: 2025 • ÁREA: 310M² · FOTOS: GISELE RAMPAZZO · PAISAGISMO: LETÍCIA
  BONONI"

### Hero com a arquiteta dentro de um ambiente que ela projetou

- **Como é feito:** uma foto, ela sentada na sala de um projeto real, o monograma por cima, nenhum texto.
- **Por que funciona:** em escritório de uma pessoa só, quem contrata está contratando a pessoa. A foto responde "quem
  é" e "como é o trabalho" ao mesmo tempo, e a mesma sala volta como card do portfólio, o que amarra rosto e obra.

### Frase de posicionamento em duas partes: assinatura + garantia

- **Como é feito:** primeiro o que diferencia ("cores, texturas e marcenaria"), depois o freio do medo do cliente
  ("respeitando a personalidade de cada cliente").
- **Por que funciona:** quem contrata arquiteta com estilo marcado tem medo de a casa sair com a cara dela. A segunda
  metade da frase vende o freio, como pede a anatomia.

### Foto de respiro entre a fala e o catálogo

- **Como é feito:** uma faixa de largura total, sem texto, logo depois da frase, com o projeto mais recente.
- **Por que funciona:** a imagem confirma a frase sem acrescentar texto e separa o posicionamento do catálogo. É uso
  legítimo de imagem que não explica o que mostra.

### Formulário que qualifica antes da conversa

- **Como é feito:** campos obrigatórios de objetivo (imóvel completo / alguns cômodos / 01 cômodo), metragem e cidade,
  além do telefone com WhatsApp.
- **Por que funciona:** o escritório chega à primeira ligação sabendo o tamanho do trabalho e se é presencial ou à
  distância. O visitante, ao preencher, entende o que importa para o orçamento.

### Canais separados por público

- **Como é feito:** orçamento, marketing e mídias, fornecedores e currículos em blocos e contatos diferentes.
- **Por que funciona:** tira do canal de orçamento quem não é cliente. Só vale com volume de contato que justifique.

### "Presencial ou à distância" na chamada

- **Como é feito:** a modalidade está dentro da própria frase de contato.
- **Por que funciona:** responde "atende minha cidade?" antes de a pergunta virar objeção.

### Interface neutra para a cor vir da foto

- **Como é feito:** fundo branco, texto quase preto, rótulos cinza, nenhum acento forte na interface.
- **Por que funciona:** quando a foto é o argumento e a assinatura da arquiteta é cor, a moldura não pode disputar com
  o trabalho.

---

## Tipografia e cor

- **Famílias (medidas no código):** Josefin Sans light 300 em cerca de 37 px na frase-manifesto e nos títulos; Josefin
  Sans 600 em 15 px no menu; acumin-pro 200, de 12 a 18 px, nos textos pequenos; din-condensed-web nos botões e
  rótulos; adobe-garamond-pro carregada, mas pouco visível.
- **Contraste entre título e corpo:** pequeno. O maior texto da home é uma sans light de 37 px, e quase todo o resto é
  texto pequeno em caixa alta espaçada. A hierarquia vem da foto, não da tipografia.
- **Cores medidas:** texto dos títulos `#131516`; rótulos dos projetos em cinza quente `#888181`, caixa alta, letras
  espaçadas.
- **Cores *aparentes*, não medidas:** fundo branco puro; rodapé cinza-chumbo por volta de `#4a4a4a`; botão lilás claro
  no Sobre. O logo é um wordmark geométrico de traço fino (*aparente*).
- **Quantos acentos de verdade:** nenhum na interface. O lilás do botão do Sobre é o único elemento de cor própria. Toda
  a cor do site vem das fotos, o que é coerente para uma arquiteta cuja assinatura é cor.

---

## O que serve à Débora Reis

### O propósito, antes de copiar qualquer coisa

O site da Duda pode quase não explicar porque o visitante dele já foi convencido antes, pela fama e pelo Instagram. O
site serve para **confirmar o gosto e pedir orçamento**. O site da Débora tem outro trabalho: ele vai receber gente
que ainda não a conhece e que precisa entender **quem ela é, o que ela faz numa reforma e como é contratar**. Então a
Débora pode copiar a forma de mostrar (passeio, planta, paleta, ficha, a arquiteta dentro do trabalho), mas não pode
copiar o silêncio.

### O que aproveitar, e como

1. **Abrir com a Débora dentro de um ambiente que ela projetou**, em vez de foto de perfil ou render. Num escritório de
   uma pessoa só, quem contrata está contratando a Débora. Só com foto real dela num projeto real dela; se não houver,
   fica `[FALTA: foto da Débora em obra ou projeto entregue]`.
2. **Uma frase de posicionamento logo depois do hero, em duas partes: a assinatura e a garantia.** O diferencial que já
   sabemos é ela fazer projeto, acompanhamento de obra e decoração, uma pessoa só, do começo ao fim da reforma do
   apartamento. A garantia e o adjetivo do estilo têm que vir dela, nunca inventados. E a frase precisa caber no
   celular (a da Duda passa de 10 linhas).
3. **Uma foto de respiro em largura total, sem legenda, entre a fala e o portfólio.** Prova a frase sem texto e dá uma
   pausa antes do catálogo. É o uso de imagem "que mostra sem dizer o que tem" que o Marcelo descreveu.
4. **Na home, projetos como cardápio: uma foto e um nome por card, com o detalhe na página do projeto.** Mas trocar o
   código de iniciais por um nome que informe, por exemplo "Apartamento na Barra · `[FALTA: m²]`" (exemplo de forma;
   bairro e metragem a confirmar com ela). O código "DUPLEX EK" protege o cliente e não diz nada ao visitante; bairro
   e metragem fazem o leitor se reconhecer ("é do tamanho do meu").
5. **Página de projeto como passeio**: fotos na ordem em que se anda pelo apartamento, alternando plano aberto e
   detalhe, com formas de linha variadas (3 retratos, 1 grande + 2 empilhadas, 1 sangrada). **Reduzir o volume:** 12 a
   20 fotos bastam para uma reforma de apartamento; 60 cansam.
6. **Fechar cada projeto com planta, paleta de materiais e ficha** (bairro, ano, área, escopo, fotógrafo). A Débora
   vende projeto e acompanhamento de obra, não só decoração, e a planta é a prova do trabalho invisível. Acrescentar à
   ficha o que a Duda não põe: **o escopo** ("projeto + obra + decoração") e **o prazo**, se ela informar. Tudo que
   não vier dela vira `[FALTA]`.
7. **Formulário que qualifica antes da conversa:** objetivo (imóvel completo / alguns ambientes / um ambiente),
   metragem, cidade ou bairro. Para reforma cabem campos próprios, como "o imóvel já é seu?" e "a obra já começou?",
   como hipótese a validar com ela. Junto, **WhatsApp visível e clicável, com mensagem pronta** (a ideia da Duda é
   boa; a execução escondida atrás de um ícone de link é que não é). Nunca presumir o dígito.
8. **Sobre na ordem formação + tempo de estrada + de onde vem o jeito dela + chamada.** Credencial primeiro, depois o
   motivo pessoal que explica o estilo (na Duda, a origem carioca justifica a cor), depois o botão. Para a Débora,
   "formada pela UFBA em 2004" já dá mais de 20 anos de formada, o que é derivável e pode ser dito. O motivo pessoal do
   estilo tem que ser dela, e **o CAU deve aparecer** (a Duda não mostra, e é uma falha).
9. **Interface neutra para a cor vir da foto.** O tom da interface sai da `marca.md` dela, mas o princípio de não
   competir com a obra vale.
10. **Dizer na chamada de contato se atende à distância, só se for verdade.** Fica
    `[FALTA: Débora atende fora de Salvador?]`.

### O que a Duda não tem e o site da Débora precisa ter (conferir no esboço)

- Uma frase na primeira tela ou logo abaixo dela que diga o que ela faz, para quem e onde.
- Lista de serviços que deixe claro o que entra numa reforma com ela (projeto, acompanhamento de obra, decoração).
- Como começa, em passos, e o que acontece depois de mandar o formulário ou a mensagem.
- Prazo típico e forma de cobrança, só com dado dela.
- Uma linha de contexto por projeto (o pedido ou o problema, por exemplo "cozinha fechada virou integrada"), ou antes
  e depois, quando ela tiver o material.
- Chamada para contato e "próximo projeto" no fim de toda página de projeto.
- CAU visível.
- Área de atendimento explícita.
- Perguntas frequentes.
- Depoimento real, se existir; nunca escrito por nós.
- Toda alegação de autoridade (mostra, matéria, prêmio) com a fonte ao lado, ou fora do site.

---

## O que não copiar

- **"Reconhecimento nacional e internacional" sem nenhuma prova no site.** Para a Débora, toda alegação de autoridade
  vem com a fonte ou não entra.
- **Não explicar serviços, processo, prazo nem como funciona o orçamento.** A Duda pode, porque a fama e o Instagram
  vendem por ela; a Débora não pode, porque o visitante dela precisa entender o que está comprando numa reforma.
- **Página de projeto sem saída no fim:** depois de cerca de 60 fotos não há "quero um projeto assim", contato nem
  próximo projeto.
- **Galeria sem nenhuma linha de texto** sobre o pedido do cliente ou o problema resolvido. Para reforma, uma frase de
  contexto ou o antes e depois vendem mais que a 60ª foto.
- **WhatsApp escondido atrás de ícone genérico de "link"**, e telefone e e-mail como texto não clicável.
- **Botão de destaque (MIDIAKIT) que leva a uma tela de senha.** Beco sem saída.
- **Nome de projeto em código de iniciais**, que não diz nada a quem visita.
- **Chamada de contato só depois de uns 7.500 px de rolagem**, e menu que não acompanha a rolagem no desktop.
- **Frase-manifesto longa demais para o celular** (mais de 10 linhas, mais de uma tela).
- **SEO descuidado:** título da home só com o nome, sem meta description, schema LocalBusiness vazio, alt de imagem com
  nome de arquivo.
- **Meta description que promete "equipe" que não aparece.** A Débora trabalha sozinha: dizer isso como vantagem em vez
  de fingir equipe.
- **Rodapé todo em caixa alta com letras espaçadas**, difícil de ler no celular.
- **Página de "itens assinados".** Não serve à Débora, a não ser que ela tenha produtos reais.

---

## Aplicado onde

Ainda não. Estudado em 15/10/2026 para o esboço da Débora Reis (`clientes/_prototipos/debora-reis/`). Candidatos à
aplicação: a Débora dentro do trabalho no hero (só com foto real), a frase em duas partes, a foto de respiro, a página
de projeto como passeio com planta, paleta e ficha (com escopo e prazo), e o formulário qualificador com WhatsApp
clicável. Preencher quando acontecer, com a adaptação feita.

Prints (somem com a sessão):
`/tmp/claude-0/-home-user-HorusOS-Pro/ada53c37-1efb-518e-8aec-f8416f2ef82e/scratchpad/ref/dudasenna/`
