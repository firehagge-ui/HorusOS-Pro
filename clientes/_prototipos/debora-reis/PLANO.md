# Débora Reis: plano do esboço, rodada 2 (09/10/2026)

> Pedido do Marcelo: "use o que há de melhor, use o Awwwards também". Contexto da conversa: o que pesa
> pra ela é o cliente que "não tem noção nenhuma de valor" e quer "prazos curtíssimos". O esboço tem
> que mostrar os projetos dela **e** o trabalho que existe por trás de um projeto.

## Referências (Awwwards, 09/10, prints em scratchpad)

- **Loam House** (residências, Austrália): serifa editorial com itálico, foto de ambiente cheia, número
  como legenda ("86 a 275 m²").
- **Stanzza** (interiores): interior real ocupando a tela, uma frase em serifa no meio.
- **Mathilde de Chiara** (portfólio de interiores): os projetos viram um mosaico de fotos pequenas que se
  espalham na rolagem.
- Já no acervo: `referencias/interiores-tres-sites.md` (Jacobsen, Studio McGee, For Living). A falha dos
  três: nenhum diz como começa, quanto tempo leva nem o que o cliente recebe.

## Passe 1 (o reflexo)

```
COR        creme, grafite, um dourado
TIPO       serifa fina de display + sans
LAYOUT     foto cheia no topo, grade 3x2 de projetos, sobre, contato
ASSINATURA frase em serifa sobre a foto (Stanzza)
```

**Chegaria nisso pra qualquer arquiteta de interiores?** Sim. É o uniforme do segmento (Loam, Stanzza,
a própria Soleira). E não toca na dor que ela contou hoje.

## Passe 2 (o que só a Débora tem)

Nas palavras dela, no Instagram: "não parecer que foi comprado inteiro de uma vez", "a decoração não
parece montada", "uma casa com livros tem alma", "personalidade não precisa pedir licença", a estante dos
gatos. As fotos são quentes e coloridas: o vermelho do aparador, o azul do nicho, madeira, verde.

```
COR (das fotos, um acento só)
  --cal      #F3EEE6  fundo
  --cal-2    #EAE2D6  faixa alternada
  --tinta    #231A15  texto
  --tinta-2  #5B4D44  texto secundário
  --vermelho #A33627  acento único: o aparador do Rio Vermelho (links, botão, número de etapa)
  --madeira  #8A5A36  só em fio e detalhe

TIPO
  display  Newsreader (serifa editorial com itálico de verdade): as legendas dela são frases de
           quem escreve, não slogans; o itálico carrega a voz dela
  corpo    Public Sans
  rótulo   Public Sans 600, caixa alta curta (2 a 3 palavras)

LAYOUT
  1. ABERTURA  à esquerda a frase dela em serifa grande; à direita a ESTANTE (assinatura)
  2. PROJETOS  cada apartamento em formato editorial, tamanhos que alternam, legenda dela
  3. POR TRÁS DE UM PROJETO  as etapas tiradas do site atual dela (plantas técnicas,
               acompanhamento de obra, decoração) + o que ela escreve junto (prazo, como começa)
  4. PRA QUEM MORA  os gatos
  5. SOBRE  a frase de 2004, retrato, avaliação real do Google
  6. CONTATO  WhatsApp, endereço

 ┌──────────────────────────────┬──────────────────────────────┐
 │ Eu nunca projetei a mesma    │  ┌──┐ ┌────┐   ┌──┐          │
 │ casa *duas vezes.*           │  │  │ │    │   │  │  A ESTANTE│
 │                              │  └──┘ └────┘ ┌─┴──┴┐         │
 │ arquitetura de interiores    │ ━━━━━━━━━━━━━┷━━━━━┷━━━━━━   │
 │ [Conversar]  Ver projetos    │   ┌────┐ ┌─┐ ┌──────┐        │
 └──────────────────────────────┴──────────────────────────────┘
```

**ASSINATURA: a estante.** Os projetos dela aparecem como objetos numa prateleira de marcenaria, de
tamanhos e alturas diferentes, como ela mesma monta as casas ("não comprado de uma vez"). Na rolagem as
peças se afastam umas das outras em velocidades diferentes, e cada uma vira um projeto da lista. É o único
movimento grande da página (`60-motion.md`: uma assinatura em movimento). Sem JS ou com movimento reduzido,
a estante fica parada e completa.

**O que mudou do passe 1:** a cor saiu do creme com dourado e veio das fotos dela; a grade 3x2 virou
estante (nenhuma concorrente do estudo faz isso, e vem da frase dela); entrou a seção "por trás de um
projeto", que responde à dor de hoje com os serviços que ela já lista no site atual.

## Travas

- Nada inventado: etapas e textos vêm do site atual e do Instagram dela; prazo e "como começa" ficam
  marcados como "a gente escreve junto".
- Fotos dela só no esboço privado (`noindex`). Fotógrafo creditado (Roberto Moreira Rego).
- Raio 0 (os três estudos usam), sem travessão na copy, sem número inventado.

## Rodada 3 (09/10/2026, noite), correções do Marcelo

- **"Tire as tipografias de IA":** Newsreader e Public Sans saíram. Entraram Cormorant Garamond (só título, como a
  Loam House) e Jost (texto e rótulo, a sans do Studio McGee no nosso estudo de interiores).
- **"Outro título, menos cara de IA":** "Casas que contam alguma coisa" era frase de efeito abstrata em dois tempos.
  Virou fato na voz dela, tirado do post de 2004: "Desenho casas em Salvador *há mais de vinte anos.*"
- **"O resto do site parecido com as referências":** capa com fotos dela de ponta a ponta e faixa de legendas (Loam),
  o Rio Vermelho virou capítulo de foto inteira com número (Loam), faixa com a frase dela sobre os livros (Stanzza),
  contato centralizado sobre foto (Stanzza). Número de capítulo só em três seções (regra do eyebrow).
- Versões anteriores em `versoes/`.

---

## Rodada 3 (13/10/2026): a sala de ideias e as demos

Pedido do Marcelo: mostrar antes de vender (`_memoria/comercial.md`, "Mostrar antes de vender"), com efeito
"uau". Dado que falta entra como **simulação marcada**; nada de depoimento, prêmio, número de resultado ou foto
falsa. Análise em `VALOR-PERCEBIDO.md`.

### Passe 1 (o reflexo)
```
QUIZ   "descubra seu estilo" com moderno, boho, escandinavo e foto de banco (o Havenly)
GUIA   PDF genérico de "como funciona" com ícones
SALA   grade 3x2 de cartões com ícone e botão
CASO   galeria de fotos com texto corrido
```
**Chegaria nisso pra qualquer arquiteta?** Sim. E o quiz de estilo contradiz a Débora ("nunca a mesma casa
duas vezes"; ninguém é de um estilo só).

### Passe 2 (o que só a Débora tem)
- **Questionário "Conte a sua casa"**: estrutura do Havenly (uma pergunta por tela, título à esquerda, escolha
  à direita, barra embaixo com contador e "Próximo", sem pedir e-mail antes do resultado, como Wildfire e
  Emerald Oak). Mas as fotos pra escolher são **os apartamentos dela**, e os cinco resultados são **cinco
  apartamentos dela**, com o nome e a frase da legenda dela: Alma brasileira, Sem pressa, Frio e quente,
  Personalidade, Refúgio urbano. O resultado mostra a mistura em porcentagem (Bobby Berk), o que vive com a
  pessoa ligado a um trecho real dela (livros, gatos, verde), o pré-briefing (cômodos, m², prazo) e, pra quem
  marcou "o quanto antes", o tempo de cada etapa: é a dor do prazo curtíssimo, respondida antes do contato.
  O questionário **é** o formulário que qualifica, disfarçado de experiência.
- **Rio Vermelho por dentro**: a foto com pontos clicáveis (piso, cores, marcenaria, luz), cada um com a frase
  da legenda dela. É o "o que tem por trás" aplicado a uma foto.
- **Guia do cliente**: páginas de caderno na tela (e PDF pela impressão), na identidade do site.
- **Sala de ideias**: a página que vai no link, com as ideias arrumadas como na estante (a assinatura do site).
- Cor, tipo e raio: os mesmos tokens do `estudio.css`. Um acento só (o vermelho).

---

## Rodada 4 (13/10/2026): redesign com a Stanzza como referência obrigatória

### Diagnóstico (Playwright, 1440 e 390, Stanzza tela a tela a cada 450px)
| | Nosso (rodada 3) | Stanzza |
|---|---|---|
| Primeira dobra | duas fotos com emenda, título 88px à esquerda, 5 links, botão vermelho, subtítulo, rodapé com 2 dados, selo | uma foto inteira, título centrado 72px entrelinha 0,88, uma linha manuscrita, uma frase; topo = Menu, marca, um botão |
| Fotos | tudo médio (colunas de 600px) | o enorme (foto que cresce até a tela) contra o minúsculo (miniaturas de 130 a 300px flutuando) |
| Tipo | Zodiak larga, entrelinha 1,06, todo título "X *Y.*" com itálico vermelho (fórmula) | Instrument Serif estreita 56/72px entrelinha 0,88; Helioscond condensada 18px; metadado 12px caixa alta espaçado |
| Grade | texto num lado, foto no outro, em todo bloco | 6 colunas com fio visível, assimetria, colunas vazias |
| Ritmo | claro, bege, escuro, claro, bege, escuro | papel contínuo com dois eventos de cor (cena verde dos projetos, faixa azul) |
| Projetos | foto + título + parágrafo (card) | cena presa: foto enquadrada cresce até a tela, título embaixo à esquerda, ficha à direita, 01/05 |
| Elementos | tábuas de madeira, caixas tracejadas, botões vermelhos, números | só fio fino e rótulo entre colchetes |
| Movimento | o mesmo "sobe e aparece" em tudo | foto que cresce presa à rolagem, miniaturas em velocidades diferentes, título que acende palavra por palavra, coluna de foto fixa, painéis que deslizam de lado |

### O sistema (da Stanzza) e a pessoa (da Débora)
- **Tipo:** Instrument Serif (títulos, entrelinha 0,9) + Archivo estreita (texto, `font-stretch` 82%, da Omnibus-Type,
  fundição argentina) + La Belle Aurore só nas anotações à mão. Google Fonts, OFL. A Instrument Serif não está na
  lista de fontes-reflexo e é a escolha que a referência obrigatória pede (o brief vence).
- **Cor:** papel `#F3F0E8`, tinta `#1E1A17`, e cada projeto ganha a cor da própria foto como cena (o verde das ripas
  do Rio Vermelho, o marrom da estante de discos). A faixa escura é o vinho do aparador, não o azul da Stanzza.
- **Assinatura:** a **anotação à mão da arquiteta** sobre as fotos (setas e notas com as palavras das legendas dela:
  "piso novo", "marcenaria feita para as moradoras", "luz mais quente"). É o raciocínio dela por cima do resultado,
  o que a Stanzza não tem. Um desenho de linha de uma estante com livros e um gato fecha a página (o desenho da
  Stanzza no rodapé, com o assunto dela).
- **Ordem:** capa → composição (miniaturas flutuando: livros, objetos, linho) → **cena do Rio Vermelho** (cresce até a
  tela, anotações aparecem) → **galeria lateral** dos outros quatro apartamentos (02/05 a 05/05) → como trabalho
  (retrato fixo à esquerda, quatro etapas à direita, sem prazo inventado) → faixa vinho "pra quem mora, inclusive os
  bichanos" + Conte a sua casa → a frase dela à mão + cartão de contato → quatro perguntas com resposta real → contato
  com o desenho.
- **Fora da home:** prazos e área de simulação (ficam só no guia, marcados como exemplo), o Diário (vira link pro
  Instagram no rodapé: as fotos dele repetiam as da página), o selo grande da demo (vira uma etiqueta discreta).

---

## Rodada 5 (14/10/2026): menos Stanzza na estrutura, mais Débora

**Pedido do Marcelo:** gostou da rodada 4; não refazer do zero. Ajustar cinco pontos: (1) capa parecida demais com a
Stanzza, (2) Rio Vermelho idem, mais protagonismo das fotos e dos detalhes, (3) navegação horizontal entre os projetos,
começando pelo Rio Vermelho, com controles discretos e gesto no celular, (4) faixa dos bichanos com fotos maiores e o
desenho do gato mais bem acabado, (5) desenho e animação do rodapé mais intencionais. Cópia da rodada 4 em
`versoes/rodada-4/`.

**O que ainda era cópia de estrutura:** cabeçalho Menu / marca no centro / botão (igual), capa com foto de ponta a ponta
e título centrado embaixo com a linha à mão em cima (igual), cena verde com a foto crescendo até a tela e ficha à
direita com 01/05 (igual), galeria lateral presa à rolagem (igual ao evento azul).

**O que fica (funciona e o Marcelo gostou):** tipos (Boska, Archivo, La Belle Aurore), papel com fio de grade, a
composição com miniaturas, processo, frase de 2004 com o cartão, perguntas, contato, a anotação à mão como assinatura.

### O plano
1. **Capa = a prancha.** Prancha de arquitetura, o suporte do trabalho dela (plantas técnicas são o primeiro serviço do
   site antigo). Foto em retrato, inteira na altura, à direita (a foto é 1080x1439: em retrato fica nítida, em tela
   cheia ficava suave); título grande à esquerda, alinhado à esquerda; "projeto, obra e decoração" à mão com uma seta
   desenhada que entra na foto; embaixo, o **carimbo** (o quadro de identificação de toda prancha) com dados reais:
   nome, interiores residenciais, Salvador, desde 2004, fotógrafo, "na foto: o retrato da alma brasileira" (legenda dela).
   Cabeçalho: marca à esquerda, Menu e Conversar à direita.
2. **Projetos = um carrossel horizontal**, cada trabalho com composição própria, avançando da direita para a esquerda
   (setas discretas, nomes clicáveis, teclado, arrastar no celular). Sai a cena que crescia e a galeria presa à rolagem.
   - **01 Rio Vermelho = a página dupla de detalhes.** A foto inteira grande + o aparador vermelho em foto própria
     (`vermelho.jpg`: conferido em 14/10, é o mesmo aparador, a mesma macramê de folhas e o mesmo Buda que aparecem
     no fundo da foto do corredor) + recorte das ripas com a planta. Anotações à mão nas fotos com as palavras da
     legenda dela (piso, cores, marcenaria, luz). Frase dela do post do vermelho como fecho.
   - 02 Livros (foto alta + a frase dela grande), 03 Artesanato (materiais em letra à mão), 04 Azul e madeira (meia
     tela no azul do nicho), 05 Aconchego (linho, madeira, verde). Nome e texto de cada um vêm da legenda dela.
     `[FALTA: confirmar com a Débora se Livros, Artesanato, Azul e madeira e Aconchego são apartamentos diferentes]`.
3. **Bichanos:** as duas fotos dos gatos grandes (no limite da resolução delas: 540 e 640px de largura), o desenho
   redesenhado (estante de nichos em degrau, gato sentado com o rabo pendurado, traço único com duas espessuras) e
   ligado às fotos.
4. **Rodapé:** uma vista de parede desenhada como prancha (estante sob medida com cota "sob medida" à mão, poltrona,
   luminária, planta, janela, o gato). Desenha uma vez, em ordem (estrutura, móveis, detalhes, o gato, a cota), quando
   o rodapé aparece, sem depender de onde a rolagem para; depois o rabo do gato balança devagar.

**Passe duplo ("eu chegaria aqui em qualquer escritório de interiores?"):** o carimbo e a cota só fazem sentido pra
quem desenha planta; a página dupla do Rio Vermelho usa dois cliques do fotógrafo do mesmo móvel e as palavras dela;
o gato é o assunto dela (dois posts). Risco: carimbo virar enfeite. Regra: só dado real dentro dele, nada de "escala"
ou "folha 01/12" inventados.

## Rodada 6 (14/10/2026): correção de escopo, projetos em tela cheia e "Todos os projetos"

O Marcelo separou o pedido em três tipos.

**Correção:**
- A "seção 1" era "Nunca a mesma casa duas vezes", não a capa. A capa e o cabeçalho voltaram exatamente aos da rodada 4.
- Na seção 1, a estrutura ficou: título no centro e fotos em velocidades diferentes. Ele gosta dela e só não quer que pareça
  cópia da Stanzza. Mudou o objeto: as miniaturas retangulares viraram **objetos de parede** da casa de quem mora (nicho
  em arco com o contorno do vão, quadro com passe-partout, bastidor de aro duplo), cada um com a etiqueta à mão, e um risco
  vermelho se desenha embaixo do título.
- Na seção "Como trabalho", saíram o texto à esquerda do título e a legenda embaixo da foto da Débora.

**Implementado conforme o pedido:**
- **Projetos em tela cheia:** um ambiente por vez, como a sala do Rio Vermelho da rodada 4. Passa da direita para a esquerda
  pelo arrasto ou pelo dedo, pelas setas, pelos nomes, pelo teclado, pelo trackpad e **sozinho a cada 7 s**. O relógio corre
  no fio embaixo do nome, com botão de pausa (WCAG 2.2.2) e parado com movimento reduzido.
- **A sensação de entrar no ambiente, sem a execução da Stanzza:** a câmera atravessa o ambiente que sai (aproxima e
  escurece). O próximo entra pela "porta", um fio claro que corre da direita para a esquerda. Enquanto o ambiente está na
  tela, a câmera entra devagar. O arrasto conduz a passagem junto com o gesto.
- **"Ver todos os projetos"** abre `projetos.html`, com a lógica da Stanzza /projects: título com a contagem e um projeto
  por linha, ficha à esquerda e fotos à direita. Da Débora vêm a ficha em carimbo de prancha, a nota à mão e a frase dela.
  Sem data, área ou prazo (ela não publicou). "Em tela cheia" abre a home no projeto escolhido (`index.html?p=3`).
- Rodada 5 guardada em `versoes/rodada-5/`.

### Decisão pendente do Marcelo: como organizar o portfólio (item 4)

O material real pesa nessa decisão:
- Cada post do Instagram tem **uma foto só**. Só o Rio Vermelho tem três (o corredor, o aparador e o recorte das ripas).
- Livros, Artesanato, Azul e madeira e Aconchego são, na foto, **detalhes** (estante, pendente, nicho, sofá), não salas
  inteiras. `[FALTA: a Débora confirmar quais fotos são do mesmo apartamento]`.
- As fotos têm 1080 px. Em tela cheia são ampliadas cerca de 1,3 vez em 1440 px e cerca de 1,8 vez em 1920 px, e a foto em
  pé perde perto de 40% da altura no recorte deitado.

| Caminho | A favor | Contra |
|---|---|---|
| A. Tudo padronizado em tela cheia (o que está no ar agora, com os 5) | Coerente e imersivo | O detalhe vira "projeto" e promete uma sala que não existe; ampliação mole; recorte grande; tela cheia repetida cansa |
| B. Manter a rodada 5 (cada item com composição própria) | Valoriza o detalhe | Inconsistente; perde a imersão que o Marcelo quer |
| **C. Dois níveis (recomendado)** | Cada coisa no formato que a valoriza; honesto; coerente dentro de cada nível | Depende de a Débora dizer o que é de cada apartamento e mandar as fotos originais |

Como seria o C:
- **Projetos = apartamentos inteiros**, em tela cheia e no mesmo formato. É o carrossel atual, só com ambientes completos.
- **Os detalhes de cada apartamento** (marcenaria, objetos, cerâmica) vão para a página dele, na composição de página dupla
  da rodada 5, guardada em `versoes/rodada-5/`.
- **As intervenções pequenas** (a estante dos gatos, o banheiro) ganham uma faixa própria, "Detalhes", com formato menor e
  igual entre si, sem competir com as salas.

Até a Débora responder, os 5 atuais ficam como estão.
