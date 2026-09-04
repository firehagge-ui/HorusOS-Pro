# Site institucional da Hórus

Site da **própria agência**, não de cliente. Por isso mora em `site/` na raiz e
não em `clientes/`.

---

## Estado em 28/08/2026 (versão 11) — recolor e ajustes de seção

Rodada grande de identidade, pedida pelo Marcelo ("é apenas uma cor, ficou brega,
sem identidade"). O site de scroll (v10) foi **mantido** (a landing liquid-glass de
tela única foi descartada antes — ver `project_site-liquid-glass` na memória e
`site-backup-2026-08-28/`); o que mudou aqui foi **cor, tipografia e vários ajustes
de seção**, sobre a mesma estrutura:

- **Paleta com PAPÉIS** (o antídoto ao "uma cor só"): âmbar `#E7B34A` + **azul de
  volta** `#5B8DEF` como co-primárias; conjunto disciplinado de acentos (âmbar, azul,
  verde `#3FBFA3`, coral `#F0785C`, violeta `#A98BF0`) dá **cor própria a cada card**;
  as **seções viajam por cores** ao rolar. Tokens novos em `site.css §1`. Registrado
  em `identidade/design-guide.md`.
- **Camada mono** (`JetBrains Mono`) nos números da roleta, eyebrow e categoria de
  serviço — cara de instrumento.
- **Hero:** o shader plasma saiu; entrou um **vídeo em loop** (asset próprio do
  Higgsfield, CloudFront) **dessaturado e repintado** na marca via `mix-blend-mode:
  color` (âmbar → azul). Não dá para recolorir um MP4 direto; o truque é grayscale +
  gradiente da marca em blend. Init do plasma segue no JS, inofensivo (o `<canvas>`
  saiu, `if(!tela)return`).
- **Header:** o link "A Hórus" virou **"Sobre"**.
- **Serviços:** título **maior e centralizado** com **reveal** (SplitText, agora em
  todos os `[data-split]`); mais respiro vertical (`ITEM_H` 300, era 220); **snap mais
  travado** (lock por degrau, `scrub: 0.6`).
- **Compromisso:** **5 cores distintas** por card, texto **legível** (clareado), e a
  **barrinha "Isso não é apenas o que fazemos" saiu**.
- **Portfólio → passos:** depois de duas tentativas de cortina (flash, depois faixa
  preta), a **cortina foi REMOVIDA**. O handoff é fluxo vertical limpo: o portfólio
  termina a corrida horizontal, solta o pin, e os passos entram por baixo (com um fade
  de tinta no topo da seção). Sem slide, sem banda.

**2ª rodada de 28/08 (ajustes do Marcelo sobre prints):**
- **Divisória hero → seção 1 removida:** `.hero-fade` dissolve o vídeo na tinta antes
  da borda. **Seção 1 (valores) recolorida para COOL** (azul + violeta), longe do
  âmbar. As seções **alternam** quente/frio ao rolar (o âmbar não domina mais).
- **Seção 2, o título SOBE ao rolar:** o intro saiu de dentro do `.rol-pin` (o pin
  agora dispara em `.rol-pin`, não na seção), então o título rola para cima e só então
  a roleta prende.
- **Roleta aproximada do print de referência:** entrou o **arco/círculo visível**
  atrás dos números, **pills (tags) por serviço** (mono), e a **imagem 3D maior
  sangrando à direita**. Números/eyebrow/categoria em azul + mono.
- **4 etapas:** cor por card; a **linha degradê muda de cor por região** (azul → verde
  → âmbar → coral) e **desce até o botão**, que virou uma **pílula azul maior** (não
  amarela) e **acende** quando a linha chega.

Conferido: detector do impeccable **saída `0`**, varredura de scroll (desktop 1440) e
mobile (390) por Playwright — hero, roleta, matriz, compromisso, portfólio→passos,
etapas com linha até o botão, e chamada. **Pendente:** organizar as pastas do site
(mantidas intactas para não quebrar caminhos de asset no meio do recolor) e, se o
Marcelo quiser, centralizar horizontalmente os cards da roleta.

> O restante abaixo (v2 a v10) é histórico da mesma estrutura de scroll.

---

- `PLANO.md` — passe duplo de design, escrito antes do HTML. Ler antes de mexer
  em qualquer coisa visual aqui
- `index.html` — home, dez seções
- `assets/` — o que vai ao ar
- `site-fontes/` — arte-fonte em PNG, **fora** do que vai ao ar

A identidade (cor, tipo, tom, logo) vive em `identidade/design-guide.md`, que foi
preenchido em 04/08/2026 a partir dos dois boards de marca que o Marcelo mandou.
Até essa data estava em branco.

---

## Decisões que já estão tomadas, para não reabrir

> ⚠️ **Leia a "Estado em 26/08/2026 (versões 8 e 9)" logo abaixo antes de confiar
> nesta tabela.** As duas rodadas de 26/08 (a pedido do Marcelo, guiadas por
> prints numerados) reviraram várias linhas daqui: CTA, cabeçalho, hero, serviços,
> portfólio, chamada, rodapé, tipografia, stack e elemento-assinatura. As linhas
> pré-26/08 ficam como histórico datado; o que vale hoje está na seção de estado.

| Decisão | Qual foi | Quando |
|---|---|---|
| Descritiva da marca | **AGÊNCIA**, não PUBLICIDADE | 04/08/2026, Marcelo |
| Tipografia | Montserrat **só no logo**. Site usa Sora (display) e Archivo (corpo) | 04/08/2026, Marcelo |
| Escopo | Home, serviços, cases, sobre. **Só a home está feita** | 04/08/2026, Marcelo |
| Estrutura da home | **7 seções**, na ordem do `PLANO.md` v5 | 05/08/2026 (noite), Marcelo |
| Seções cortadas | A diferença, A Máquina, Para quem é, O que não vai ao ar, Como começa, Perguntas | 05/08/2026 (noite), Marcelo |
| Elemento-assinatura | **não existe mais.** Saiu com o trilho da Máquina | 05/08/2026 (noite), Marcelo |
| Título | "Nós construímos **[MÁQUINAS · SISTEMAS · MARCAS · PRESENÇA]**" | 05/08/2026 (noite), Marcelo |
| Alcance | O site **não** se declara mais só de Salvador | 05/08/2026 (noite), Marcelo |
| Troca da palavra | Letra por letra, decodificando | 05/08/2026 (noite), Marcelo |
| Metal do botão | **Cromo cinza**, lento, num sentido só, franja de cor quase invisível | 05/08/2026 (noite), Marcelo |
| Serviços | **Um painel de tela cheia por serviço**, com ficha técnica | 05/08/2026 (noite), Marcelo |
| Fundo do hero | **Shader em WebGL** nas cores da marca. Sem rótulo em cima | 05/08/2026 (noite), Marcelo |
| Rodapé | **Enxuto, três linhas**, no formato do web3.xmethod.de: marca e assinatura à esquerda, e-mail e telefone em escala à direita, fio, e o legal com os ícones de rede. Era quatro colunas no formato da Menzzo | 25/08/2026, Marcelo |
| Nome no pé | **HÓRUS em SVG, pintado por gradiente**, com uma luz que segue o ponteiro. Era hex dump com onda, e antes disso pixelado | 24/08/2026, Marcelo |
| Marquee | **Um só**: a faixa de palavras. A esteira do hero saiu por causa dela | 05/08/2026 (noite) |
| Portfólio | **Trilho preso**: a janela prende no alto da tela e a tira corre na horizontal. Parada nos primeiros 30% e nos últimos 30% do trilho. Continua **sem imagem** até haver autorização | 24/08/2026, Marcelo |
| Fios entre seções | **Não existem.** Quem separa é o ar, a troca de fundo e a largura do contêiner | 24/08/2026, Marcelo |
| Chamada final | Continua no **cartão de vidro**, mas agora **centralizada, sem eyebrow e sem subtítulo**: título e um botão, no formato do web3.xmethod.de. Era alinhada à esquerda | 25/08/2026, Marcelo |
| Redes no rodapé | **Só o ícone**, sem o nome escrito ao lado. O rótulo vive no `aria-label` | 25/08/2026, Marcelo |
| Icarus | Ganhou seção própria, declarada como **em desenvolvimento** | 05/08/2026 (noite), Marcelo |
| Linguagem visual | Escura e cinematográfica, das dez referências. Estudo em `referencias/agencias-ia-dez-sites.md` | 05/08/2026, Marcelo |
| Arte do hero | Forma 3D abstrata em azul e dourado. **O falcão foi rejeitado** | 05/08/2026, Marcelo |
| Elemento-assinatura | O trilho numerado da Máquina. Uma ousadia só na página | `PLANO.md` |
| Formulário | Não existe, de propósito. Sem servidor, não finge que enviou | `50-copy-de-interface.md` |
| Eyebrow | Permitido nas nove seções, com exceção registrada no detector | 05/08/2026, `.impeccable/config.json` |
| Hero | Centralizado. **Sem arte de fundo e sem brilho** | 05/08/2026 (tarde), Marcelo |
| CTA | **Um rótulo só na home inteira: "Começar projeto"**. Dois objetos diferentes: metal líquido na home (hero e chamada final), **vidro** no cabeçalho | 25/08/2026, Marcelo |
| Cabeçalho | **Painel de vidro flutuante** com aro que acende seguindo o ponteiro (estrela.studio). Links e marca à esquerda, botão sozinho à direita (web3.xmethod.de) | 25/08/2026, Marcelo |
| Forma | Terceira forma aberta: o **canto reto** (`--raio-reto: 4px`), no cabeçalho, no botão dele e no botão da chamada final. Pílula continua no resto | 25/08/2026, Marcelo |
| Gatilho do menu | **Ícone de dois traços**, não a palavra "Menu": em 390px a palavra custava a largura que o CTA fixo passou a precisar | 25/08/2026 |
| Contato | WhatsApp `(71) 9912-7514` e e-mail `contato.horus@gmail.com`, **sem rótulo na frente**. CNPJ e a linha de atendimento saíram | 25/08/2026, Marcelo |
| Título | "Instalamos a máquina que faz o seu negócio **[palavra que gira]**" | 05/08/2026 (tarde), Marcelo |
| Palavra que gira | APARECER · RESPONDER · PUBLICAR · ANUNCIAR, que são os 4 blocos como verbo | 05/08/2026 (tarde) |
| Faixa de demonstração | **Removida.** As marcações douradas de pendência ficam | 05/08/2026 (tarde), Marcelo |
| Vidro | Linguagem de superfície da página. Feito de luz, não de desfoque | 05/08/2026 (tarde), Marcelo |
| Stack | Continua HTML e CSS nativos. O botão de shader foi **portado**, não instalado | 05/08/2026 (tarde) |

---

## Estado em 27/08/2026 (versão 10) — estudo das 9 referências + revisão

O Marcelo mandou **nove sites de agência** (lessestudio, delucks, graffico, wibify,
uxbert, amphora, vividmotion, estrela, xmethod) e pediu: estudar tudo, trazer o que
serve, revisar o site com os agentes e gerar imagens de portfólio.

**Estudo (3 agentes orquestrados):** 7 teardowns novos em `referencias/` (os outros 2
já existiam). Os padrões novos entraram em `_memoria/design/`: cardápio de entregas
nomeadas + contador `/N` (00-anatomia), matriz comparativa que ataca categoria e não
concorrente (00-anatomia), tríade Local/Setor/Serviços no portfólio, numeração de seção
grande, e o antipadrão **typo no hero** (90-antipadroes).

**Revisão (agente com as lentes do conselho): veredito 70/100.** Aguenta a fileira por
craft; perde em posicionamento. Lacunas abertas, por impacto: (1) bloco "para quem é",
(2) a cunha de compliance como pilar próprio, (3) matriz "por que a Hórus", (4) FAQ,
(5) CTA no hero. Copy do hero/#sobre ainda reprova o passe duplo ("soluções" 2x, "sob
medida", "de ponta") — recomendado reescrever, não mexido (é copy aprovada).

**Aplicado nesta rodada:**
- 🔴 **Integridade:** a seção de passos tinha "em até 7 dias" (prazo prometido, vedado) e
  "serviço de manutenção" (oferta não confirmada). Reescrita para o processo real:
  consulta → **esboço antes do sim** → desenvolvimento (não só "site") → **posse do
  cliente** (o "you own it" do wibify/delucks). Sem prazo, sem invenção.
- **Esfera engavetada REMOVIDA de vez** (HTML + IIFE JS). A "jornada da esfera / Olho de
  Hórus" era declarada o elemento-assinatura, mas estava morta por um `return`. A
  **roleta de serviços é a assinatura de fato** agora (decisão assumida, não resquício).
  A CSS `.vg-*`/`.viagem` ficou (não-usada, inofensiva; remover arriscava o trap de CSS
  compartilhado).
- **Portfólio:** as 3 imagens abstratas viraram **mockups quentes** (Higgsfield, GPT
  Image 2): psicologia, café e odonto. Ainda sem nome/tela de cliente (compliance).
- **Bug:** o wordmark "HÓRUS" do pé pedia `Bricolage Grotesque` (não carregada) → caía em
  system-ui. Corrigido para **Sora**.

**Tipografia REAL hoje: Sora (display) + Hanken Grotesk (corpo) + Newsreader itálico no
acento.** ⚠️ A linha do 26/08 abaixo que diz "Bricolage Grotesque" está **VENCIDA** — o
Sora ganhou (Direção C). Conferido: detector `0`, chaves do script balanceadas.

---

## Estado em 26/08/2026 (versões 8 e 9)

Duas rodadas grandes num dia, guiadas por prints numerados do Marcelo. O que
mudou, por frente (tudo continua **vanilla, sem React**; entrou GSAP + Lenis):

**Fundação e tipografia**
- **Stack ganhou motion:** GSAP (core, ScrollTrigger, SplitText, DrawSVG) + Lenis,
  vendorizados em `site/assets/vendor/`. É o motor da coreografia de scroll toda.
  A regra antiga "shader portado, não instalado; React não se justifica" continua
  valendo para **React**; GSAP/Lenis foram adotados de propósito.
- **Tipografia trocada:** saíram Sora/Archivo, entraram **Bricolage Grotesque**
  (display) + **Hanken Grotesk** (corpo) + **Newsreader** itálico no acento
  (`.ouro-it`). O detector reprovou Inter e Instrument Serif (genéricas); o par
  final passa limpo. ⚠️ Vale **só para o site institucional** por enquanto — a
  tipografia da casa em `identidade/design-guide.md` (peças/carrossel) não mudou.
- **Fundo por seção:** cada seção ganhou gradiente/glow próprio, no lugar do preto
  chapado.

**Home**
- **Botão do hero removido.** O hero é título + subtítulo + a esfera.
- **Fundo do hero:** shader das **fitas em curva** (azul desce à esquerda, dourado
  sobe à direita, cruzando embaixo — print 2 da 1ª rodada). Portado do código que
  o Marcelo mandou, para o WebGL nativo (sem three.js). A palavra que gira é dourada.
- A **esfera dourada já aparece na home**, no centro-baixo, com linha vertical
  (print 1 da 2ª rodada).

**Seção 2 — a jornada da esfera (o novo elemento-assinatura)**
- Overlay FIXO com a esfera; a seção `.visao` é só o trilho de rolagem. A esfera
  desce ao centro → **big bang** (anéis, partículas e os 4 valores saindo dela,
  print 2) → recolhe → o **Olho de Hórus se desenha em volta dela** (a esfera é a
  pupila, DrawSVG, print 3) → a logo montada sobe e entra nos Serviços. Os 4
  valores são honestos; a **barra de números** do print (+120 projetos etc.) NÃO
  entrou — número inventado.

**Serviços**
- Saíram tag, fundo cinza, números, coluna de rótulo, ícones e botões. Cards no
  **formato print 4** (21st.dev/bento): imagem 3D grande (gerada no Higgsfield) +
  painel de **vidro fosco** + contorno de vidro. Continuam **empilhando** (sticky).

**Garantia (nova, entre Serviços e Icarus)**
- **Layout circular** (print 5): símbolo no centro, arco pontilhado, 5 promessas em
  volta. As cinco são diferenciais reais da casa (método, não resultado).

**Portfólio**
- Formato **trionn**: título preso à esquerda, fileira de 3 cards à direita que
  corre na horizontal quando alinhada. Título "Trabalhos em destaque" (subtítulo
  saiu). Imagens **abstratas geradas no Higgsfield** (não são tela de cliente). O
  título acompanha os cards indo à esquerda, e ao fim a **cortina** revela a seção
  seguinte deslizando (o "Como começa" entra da direita).

**Como começa (nova, depois do portfólio)**
- Título grande + **4 passos em zigue-zague** ligados por uma **linha curva que se
  desenha** conforme rola (DrawSVG, amphora print 5). É a seção que a cortina revela.

**Transição + Chamada + Rodapé**
- **Barras pretas** varrem a tela entre "Como começa" e a chamada.
- Chamada: **botão maior**; no hover o aro acelera mais e a face vira **degradê
  azul→dourado**. Fundo = o **gradiente móvel antigo** da home (o campo de ondas,
  não as fitas). Saiu de vez o cartão de vidro.
- **Rodapé sem fundo próprio:** chamada + rodapé + assinatura dividem UM fundo
  animado (`.encerra`). Saíram o anel dourado do Instagram e o ícone de WhatsApp.

**Mídia:** as imagens 3D (serviços e portfólio) foram geradas no **Higgsfield**
(GPT Image 2, plano starter). Vídeo exige Pro/Ultimate, então as animações são
WebGL/canvas/SVG. Ver a seção de mídia no `CLAUDE.md` da raiz.

Conferido: detector **saída `0`**, console **sem erro**, mobile 390px ok (a jornada
de scroll é só desktop; no celular as seções são estáticas). `simbolo-grande.webp`
ficou **órfão** (a faixa de palavras que o usava foi removida).

---

## Estado em 25/08/2026 (versão 7)

Rodada de cabeçalho, chamada final e rodapé, com duas referências que o Marcelo
mandou e que **viraram teardown antes de qualquer HTML**:
`referencias/xmethod-web3.md` e `referencias/estrela-studio.md`.

- **Cabeçalho.** Deixou de ser faixa de ponta a ponta e virou painel de vidro
  flutuante, com aro que acende seguindo o ponteiro. Marca e links à esquerda, o
  botão sozinho à direita. O botão de lá não é mais o metal líquido: é vidro, e
  acende no hover — os dois CTAs agora se distinguem em repouso, não só no gesto
- **Chamada final.** Centralizada, sem eyebrow, sem parágrafo de abertura e sem a
  lista de canais. Ficou o título e um botão, agora de canto reto. Os canais
  desceram para o rodapé, que passou a ser onde o contato mora
- **Rodapé.** De quatro colunas para três linhas. Saíram Navegação, Serviços, o
  CNPJ e a linha de atendimento. O e-mail ganhou escala de título, sem rótulo, e
  as redes viraram ícone

Conferido nesta rodada: detector **saída `0`**, console **sem erro**, 7 seções na
ordem, **nenhuma âncora quebrada**, nenhuma rolagem lateral em 1440 nem em 390, os
dois canvases de metal ativos (nenhum caiu no aro parado), e cabeçalho, chamada e
rodapé fotografados em 1440 e em 390.

### Correções que saíram desta rodada

- **"Ilumina ao redor" exige painel com quatro arestas.** Barra colada nas bordas
  não tem redor: o efeito não é enfeite da forma, a forma é a condição dele
- **Vidro se faz com sombra `inset`, não externa.** A larga levanta o miolo, a
  curta desenha o aro. Sombra por fora é o card fantasma
- **Item de flex encolhe, o texto dentro dele não.** Em 390px o "HÓRUS" vazou por
  trás do botão **sem gerar rolagem lateral**, então nada acusou: só o print pega
- **A palavra "Menu" custa 77px; o ícone custa 42px** — e o JS que trocava
  `textContent` apaga o ícone junto

Registradas em `_memoria/design/90-antipadroes.md`.

---

## Estado em 05/08/2026, noite (versão 6)

Serviços viraram seis painéis de tela cheia com ficha técnica, no formato do print
que o Marcelo mandou. Rodapé em quatro colunas. O nome no pé virou hex dump com
onda. O hero ganhou fundo animado em WebGL e perdeu o rótulo. O botão ficou três
vezes mais lento, quase sem cor e correndo num sentido só.

Conferido: detector **saída `0`**, console **sem erro**, 7 seções na ordem, nenhuma
âncora quebrada, nenhuma rolagem lateral em 1440 nem em 390, e a tira do portfólio
medida indo e **voltando** com a rolagem. 146 KB no ar.

### Correções que saíram desta rodada

- **`overflow:hidden` num pai mata `animation-timeline: view()`.** Ele cria
  contêiner de rolagem e a linha do tempo se prende nele. `overflow: clip` recorta
  igual sem virar rolável. E o atalho `animation:` zera a duração em `0s` quando
  ela precisa ser `auto`. Nenhuma das duas dá erro no console
- **Pausa de marquee no hover lê como travamento**, não como cortesia
- **Movimento sem direção lê como ruído.** Somar tempo em dois eixos balança;
  deslocar o campo num eixo só é o que faz o metal escorrer
- **Texto em hex dump: quem engorda o traço da letra é o número de LINHAS da
  grade**, não a largura da célula

Registradas em `_memoria/design/90-antipadroes.md`.

---

## Estado em 05/08/2026, noite (versão 5)

A home caiu de 13 seções para 7. Saíram A diferença, A Máquina, Para quem é, O que
não vai ao ar, Como começa e Perguntas. Hero novo e sem cidade, palavra do título
trocando letra por letra, faixa de palavras sem chapa (o símbolo aparece por dentro
das letras) e o shader do botão refeito em cromo.

Conferido: detector **saída `0`**, console **sem erro**, 7 seções na ordem, nenhuma
âncora quebrada e nenhuma rolagem lateral em 1440 nem em 390.

⚠️ **Duas coisas que a v5 custou, e que estão no `PLANO.md` com detalhe:** a página
ficou **sem elemento-assinatura** (era o trilho da Máquina), e saíram os blocos 2, 4
e 7 da anatomia (para quem é, como começa, FAQ) mais a régua de compliance, que era
o diferencial que nenhuma das dez referências tinha. Tudo continua no git.

### Correções que saíram desta rodada

- **Aberração cromática forte vira arco-íris, não cromo.** 0,030 devolveu fita de
  arco-íris no aro do botão; 0,007 devolveu metal. E metal é cinza: tingir de azul
  da marca, que foi a primeira tentativa, apaga o cromo
- **Fantasma de largura se faz com a letra mais larga repetida**, não com a palavra
  mais longa: contagem de letra não é largura em pixel
- **Texto vazado por cima de chapa não mostra nada.** O vazado só existe se houver
  o que ver atrás
- **Logo de 96px esticado para 340px borra** igual a qualquer foto

Registradas em `_memoria/design/90-antipadroes.md`.

---

## Estado em 05/08/2026, noite (versão 4)

Reestruturação da home. Cinco seções novas (faixa de palavras, A Hórus, Serviços,
Icarus, Portfólio), a de Trabalho virou o Portfólio, a chamada final virou cartaz
à esquerda, e o nome entrou pixelado abaixo do rodapé. Comparativo e motivos no
`PLANO.md`.

Conferido: detector **saída `0`**, console **sem erro**, e as seções novas
conferidas a 1440px e a 390px.

### Correções que saíram desta rodada e valem para o próximo site

- **Recuo lateral zerado só num breakpoint.** O detector apontou `cramped-padding`
  numa faixa que tinha `padding: 74px 24px` escrito, e eu gastei três tentativas
  tentando registrar exceção antes de olhar o media query do celular, onde estava
  `padding: 52px 0`. O detector estava certo. Antes de chamar achado de falso
  positivo, procurar a mesma propriedade em **todos** os breakpoints
- **Marquee novo entra, marquee velho sai.** Se o velho carregava informação, ela
  vira seção
- **Texto pixelado se faz em resolução baixa**, não com filtro. E `textBaseline`
  no meio corta o acento do Ó
- **Rolagem horizontal amarrada ao scroll não precisa de listener** desde que
  existe `animation-timeline: view()`

Todas registradas em `_memoria/design/90-antipadroes.md`.

---

## Estado em 05/08/2026, tarde (versão 3)

Rodada de hero pedida pelo Marcelo com quatro referências na mão. Saiu a arte 3D
do fundo, o título ganhou uma palavra que gira, o CTA virou botão de metal líquido
em WebGL e o vidro dele virou linguagem de superfície da página inteira.
Comparativo completo no topo do `PLANO.md`.

Conferido: detector do impeccable **saída `0`** (e checado contra um arquivo ruim
de propósito, para provar que ele estava mesmo rodando), console **sem erro**,
WebGL ativo nos três botões, hero fechando em 828px de 828 disponíveis a 1440px, e
a dobra conferida também a 390px.

### Correções que saíram desta rodada e valem para o próximo site

- **Cruzar duas palavras de 80px por opacidade vira borrão.** Rotador de palavra
  se faz com faixa recortada e deslize, e as palavras se escolhem com largura
  parecida na hora de escrever a copy
- **As palavras em espera precisam de `aria-hidden`**, senão o leitor de tela lê
  as quatro grudadas
- **Tirar a foto do hero não autoriza pôr brilho no lugar dela.** Brilho sem
  objeto atrás continua sendo `dark-glow`
- **Vidro pedido pelo cliente se faz de luz, não de desfoque.** `backdrop-filter`
  só onde o painel passa por cima de conteúdo: cabeçalho e menu do celular
- **Componente de galeria traz o contraste do autor junto.** O rótulo do botão
  original dava 2,9:1 num CTA
- **Porta o efeito, mantém a stack.** Vinte linhas de shader não justificam
  React, Tailwind e um passo de build

Todas já estão registradas em `_memoria/design/90-antipadroes.md`.

---

## Estado em 05/08/2026, manhã (versão 2)

Home **refeita inteira** depois que o Marcelo mandou o logo, o brandkit e dez
sites de referência. Detector do impeccable **zerado** (saída `0`), **178 KB**
somando tudo que vai ao ar. Conferida em 1440px e em 390px pela técnica do iframe.

O que a v2 trouxe: logo de verdade no cabeçalho e no rodapé, fundo `#0A0B0F`
medido no arquivo da marca, rótulo em pílula, botão em pílula, título com o
termo-chave em azul, trinca de números no hero, esteira de capacidades, e uma
seção de comparação nova ("agência entrega peça, a Hórus instala uma máquina").
Comparativo completo no topo do `PLANO.md`.

**Dez famílias de layout em dez seções:** hero centralizado, esteira, comparação em
duas colunas, trilho vertical, coluna única de texto, grade 3x2 com fio, três
passos, grade 2x2 de card, acordeão nativo, chamada centralizada. Teto da casa
é 4, então sobra folga.

### Correções que saíram desta rodada e valem para o próximo site

- **`max-width:100%` sem `height:auto`** com `width`/`height` no HTML mantém a
  altura intrínseca. A foto do hero ficava com 950px de alto e empurrava o CTA
  para fora da tela
- **`.menu a` vence `.botao` em especificidade** e pintava o CTA do cabeçalho de
  cinza sobre azul: 2,2:1. O botão parecia "apagado" sem ninguém ter pedido isso
- **Título de hero em quatro linhas é erro de proporção**, não de copy. A coluna
  de texto foi para 1.4fr e o `max-width` do h1 para 24ch
- **`clamp()` esconde a escala do detector.** Trocado por valor literal mais
  media query, que é o padrão do resto da casa
- **`auto-fit` com `minmax` deixou órfã.** Seis itens pedem `repeat(3, 1fr)`,
  que fecha 3+3
- **Número e ponto do trilho se encavalavam.** Viraram uma coisa só
- **PNG de fundo quase-preto vira retângulo visível** no meio de uma página
  escura, porque o preto dele nunca bate exatamente com o da página. Uma máscara
  radial dissolve a borda e o objeto passa a flutuar
- **`scroll-behavior:smooth` quebra o print de seção no headless.** A rolagem não
  completa dentro do orçamento de tempo virtual e a seção sai preta, com os
  `.rev` ainda em `opacity:0`. Parece bug do site e não é
- **Elemento no fim da dobra nunca cruza o limiar do `IntersectionObserver`** e
  fica invisível até alguém rolar. Nada acima da dobra pode depender de rolagem
- **Objeto escuro não vira luz sozinho.** O arco de vidro no topo do hero lia
  como mancha; quem faz o trabalho de luz é o gradiente, e a foto entra por cima
  dando textura

Todas já estão registradas em `_memoria/design/90-antipadroes.md`.

---

## ⚠️ O que trava a publicação

Nada disso impede construir. Tudo isso impede subir.

### Dado que só o Marcelo tem

- [x] ✅ **Hex do fundo.** Medido em 05/08/2026 no PNG da marca: `#0A0B0F`
- [x] ✅ **Símbolo do logo.** Extraído com alfa do PNG e no ar no cabeçalho, no
      rodapé e como favicon
- [ ] **Logo em vetor** (SVG ou AI), mais a versão em fundo claro e a
      monocromática. O que existe é bitmap: serve para tela, não escala
- [x] ✅ **Arte do hero.** Resolvido por subtração em 05/08/2026: a forma 3D saiu
      e o hero passou a ser tipografia sobre o preto da marca. `assets/forma.webp`
      ficou no repositório sem ninguém apontar para ele, e a fonte está em
      `site-fontes/forma-3d.png`. Apagar quando o Marcelo confirmar que não volta
- [x] ✅ **WhatsApp e e-mail.** Dados pelo Marcelo em 25/08/2026: `(71) 9912-7514`
      e `contato.horus@gmail.com`, os dois no rodapé e no botão da chamada final.
      ⚠️ **O número tem 10 dígitos** (`7199127514`), e celular no Brasil tem 11 com
      DDD. Está no ar exatamente como ele passou, e o `wa.me/557199127514` depende
      disso: **confirmar antes de publicar**
- [ ] **Domínio, CNPJ e endereço.** O CNPJ saiu do rodapé em 25/08/2026 (não existe
      dado, e linha de rodapé com pendência dourada é ruído numa versão final)
- [ ] **@ do Instagram.** O manual traz `@horuspublicidade` e a descritiva mudou
      para AGÊNCIA
- [ ] **Favicon em PNG de 32px e 180px.** Hoje o favicon é o WebP do símbolo,
      que funciona em navegador moderno mas não cobre `apple-touch-icon`
- [ ] **Quem faz.** Um nome apareceu em 05/08/2026: o Marcelo disse que está
      desenvolvendo o Icarus "eu e Antonio", e o Antonio está citado na seção do
      Icarus da home. ⚠️ **Não está confirmado que Antonio é "o sócio do Marcelo"**
      que aparece em três arquivos do repositório sem nome, nem qual é o sobrenome
      e o papel dele na agência. A página "Sobre" depende disso

### Decisão pendente

- [ ] **Autorização de portfólio.** Nenhum cliente autorizou uso do nome. A seção
      de portfólio descreve segmento e entrega, sem nome, sem logo e sem print, e
      **as quatro molduras estão sem imagem** por causa disso. ⚠️ Print do site de
      um cliente identifica o cliente mesmo sem escrever o nome: tirar screenshot
      dos quatro sites do repositório não resolve, piora.
      Grão da Serra tem a autorização em aberto e registrada na estratégia; Aion
      é especulativo sob Deployment Protection; Dr. Giovanni está fora da linha
      de frente. **Case com nome só entra com "sim" por escrito de cada um**
- [ ] **A assinatura verbal do manual.** "Estratégia que transforma" usa verbo de
      folheto, que a casa proíbe em copy. Hoje o rodapé usa só "Visão que
      conecta". Ou a assinatura fica restrita a peça institucional, ou ela é
      reescrita e o manual se atualiza junto
- [ ] **Preço.** O FAQ diz que não há tabela fechada, o que é verdade e está em
      `_memoria/estrategia.md` como pendência de risco alto

### Antes de subir

- [ ] Tirar o `<meta name="robots" content="noindex, nofollow">`, **no dia da
      publicação e não antes**
- [x] ✅ Faixa `.aviso-demo` removida em 05/08/2026, junto com o token `--aviso`.
      ⚠️ O botão "Esconder marcações" foi embora com ela: as marcações douradas de
      pendência agora ficam sempre visíveis, e some com elas só o dado existindo
- [ ] Trocar a imagem de compartilhamento por uma com a marca. ⚠️ Ficou **fora de
      sintonia com a página** em 05/08/2026: é a arte 3D que não existe mais no
      hero, em 1200x630 e sem logotipo
- [ ] Rodar o detector de novo

---

## Falta produzir

O escopo aprovado tem quatro páginas e **só a home existe**:

- [ ] Uma página por bloco da Máquina (site, atendimento e CRM, conteúdo,
      tráfego), com `title`, descrição, `og:` e schema próprios. É o mesmo
      caminho que a Aion tomou em 30/07/2026, e o motivo é o mesmo: URL própria
      para busca e para anúncio
- [ ] Cases. **Depende da autorização acima**, não de produção
- [ ] Sobre. **Depende de saber quem é a equipe**, que hoje não está escrito em
      lugar nenhum do repositório
