# Café Grão da Serra — Nelson

> Projeto criado em 29/07/2026. Pasta dedicada — instruções aqui sobrescrevem as
> da raiz quando relevantes.

## ✅ Vigésima-oitava rodada (13/08) — copy do hero + saco de grãos na "Nosso café"

Retorno do Marcelo, dois pedidos.

| Pedido | O que foi feito |
|---|---|
| Atualizar **título e subtítulo** da home | H1 do hero: "O sabor da Bahia, direto da Serra de Brejões para a sua casa." → **"Do Distrito Serrana / BA para a sua xícara ou para o seu negócio."** ⚠️ O Marcelo escreveu "Distrito Serrana-BA"; usei **" / BA"** no lugar do "-BA" pela regra da casa (sem tracinho) e para casar com o eyebrow, que já diz "Serra de Brejões / BA". Subtítulo → **"Café 100% arábica, grãos selecionados e torra cuidadosa. Uma experiência de qualidade para quem aprecia um bom café, seja em casa, no trabalho ou no seu negócio."** |
| Colocar a **imagem nova** ("Saquinho de café") **abaixo do pacote** | A imagem é o **saco de grãos em volume** (plástico transparente, logo dourada legível) = a cara do produto para **atacado/volume**. Montei os dois como **família de produtos em diagonal** na seção "Nosso café": pacote de 250 g (varejo) na frente à esquerda, saco de grãos menor, mais **abaixo** e à direita, sobrepondo de leve. Honra o "abaixo" do Nelson, mostra os **dois canais** que a nova copy reforça, e evita duas fotos verticais empilhadas soltas (que esticariam a seção). CSS: `.cafe-produto` virou grid de célula única (ambas em `grid-area:1/1`; o pacote, mais alto, define a altura, sem `position:absolute`) |

**Imagem:** `Saquinho de café.png` (2,8 MB, 1141×1379, alfa real) → `saco-graos.webp`
(660×867, 177 KB). PNG-fonte movido para `site-fontes/saco-graos-fonte.png` (não vai
ao ar). Novos `.cafe-pacote` / `.cafe-saco` no CSS; a regra mobile `.cafe-produto img`
virou `.cafe-pacote` (só o pacote leva o teto de 440px). No mobile as plantas somem
como sempre e a família empilha certo (texto → produtos).

**Integridade/compliance:** "Distrito Serrana" é o endereço real do MEI; origem já
confirmada (11/08), então a região como credencial está liberada. Subtítulo sem
superlativo, sem alegação de saúde, sem tracinho. O saco traz só a logo (nada de
rótulo inventado). Tudo dentro da régua.

**Verificado:** detector do impeccable **exit 0**. Sem overflow horizontal em
1920/1440/1024/390 (`over=0`). Render desktop (1440, scroll real) com pacote + saco +
galho decorativo carregando e a diagonal certa; render mobile 390 com a família
empilhada abaixo do texto. ⚠️ **Armadilha de ferramenta:** o Playwright headless com
viewport muito alto (2200px) devolveu `naturalWidth 0` intermitente e mostrou alt-text
no lugar do pacote — **falso positivo de decode lazy**. Com viewport de dobra (900px) e
scroll incremental, `nw0` zerou. Todas as imagens dão HTTP 200 e abrem no PIL; nenhuma
está corrompida.

⚠️ **Ainda NÃO republicado no Netlify** — o que está no ar segue a versão anterior.
Republicar (re-arrastar `site/` ou push) para estas mudanças irem ao ar.

## ✅ Vigésima-quinta rodada (11/08) — Nelson aprovou o site + 4 ajustes

O Marcelo mostrou o site ao Nelson e **ele aprovou**. Voltou com quatro ajustes,
todos no `index.html`/`site.css`.

| Pedido | O que foi feito |
|---|---|
| Seção 2 ("Nosso café"): **mais uma planta do lado direito** (arquivo "Planta 4") | `Planta 4.png` (1024×1536, galho de café ilustrado, sépia claro sobre fundo PRETO com glow). Recorte de alfa por **luminância** + **cor sépia fixa** (`#B38E68`) modulada pelo alfa — a cor fixa evita o halo cinza que o alfa por luminância pura deixava (o fundo escuro vazava nas bordas). Virou `planta-4.webp` (520×792, 162 KB). Novo `.planta-cafe-dir` (`right:-40px;bottom:0;width:330px;opacity:.82`), simétrico à `planta-cafe` da esquerda, atrás do pacote, sangrando pela borda. Some no mobile como as outras plantas |
| Substituir a imagem de **"Como comprar"** pela nova ("Nova Imagem do Café"), **mesma posição/ângulo** | Era `banner-etapas.webp` (xícara antiga). `Nova Imagem do Café.png` (2172×724, xícara nova mais nítida, logo mais legível) → `cafe-como-comprar.webp` (1740×580, 58 KB). CSS `.passos-bg` só trocou a URL: **mantido `right center/cover`** (mesma posição e ângulo). `banner-etapas.webp` foi para `site-fontes/` |
| Site dizia **só B2B**, mas o Nelson também vende **B2C** (confirmado por ele) | Três pontos: (1) **hero sub** deixou de falar só de "empresas" → "Para levar à sua casa ou fornecer ao seu negócio"; (2) faixa **"Fornecimento B2B" → "Atacado e varejo"**; (3) seção `#publico`: eyebrow "Para revender ou para tomar em casa", h2 **"Feito para o seu negócio e para a sua casa."** + parágrafo novo ("No atacado, para quem revende. Em pacotes, para quem quer tomar em casa."). A grade de 7 perfis B2B ficou como está (é `repeat(7,1fr)`, um 8º item quebraria). O form já tinha "Consumidor, para tomar em casa" |
| Colocar a **"Nova HOME"** no hero, mesma proporção da anterior | `Nova HOME.png` **é 1812×868, exatamente a proporção do hero anterior** (a diferença é só os textos do rótulo mais legíveis, como o Marcelo disse). → `hero-home.webp` (160 KB). `object-position:74% 40%` mantido (pacote inteiro). `hero-wallpaper.webp` foi para `site-fontes/` |

**Limpeza de passagem:** 7 órfãos de seções antigas (`etapa-0*`, `torra-do-cafe`,
`homem-mexendo-cafe`, `produto-recorte-real`), todos com cópia em `site-fontes/`,
saíram da pasta que vai ao ar. Pasta: **1,3 MB** (antes 1,4 MB, mesmo com 3 imagens
novas).

⚠️ **Integridade/compliance:** a Nova HOME traz o mesmo rótulo físico do produto
("Qualidade Premium / Serra de Brejões") — é o rótulo do Nelson, não copy nossa,
entra como está (pendência #2 de origem segue aberta, agora um pouco mais legível).
A Planta 4 é **ilustração** botânica (permitida, como as plantas 1 a 3). O B2C **não
foi inventado** — o Nelson confirmou que vende ao consumidor final. Sem tracinho.

**Verificado:** detector do impeccable **exit 0**. Render 1440px conferido (hero,
"Nosso café" com as duas plantas + pacote, "Feito para o seu negócio e para a sua
casa", "Como comprar" com a xícara nova). Mobile **over=0** a 390px (iframe HTTP),
faixa e seções empilhando certo.

## 🌐 SITE NO AR (11/08/2026): **https://graodaserra.netlify.app/**

Publicado no Netlify pelo Marcelo em 11/08. Conferido por HTTP: home 200, assets 200,
rota inexistente serve o `404.html` (200 no conteúdo, 404 no status). Site renomeado de
`eclectic-conkies-cf3ac9` para `graodaserra`.

⚠️ **Depois de publicar, adicionei og:image/canonical/sitemap com a URL real** (ver
fim da 27ª rodada). **Esses ajustes só vão ao ar num NOVO deploy** — o que está no ar
agora é a versão sem eles. Republicar (re-arrastar `site/` ou push, conforme o método).

## 🚀 Vigésima-sétima rodada (11/08) — preparação para publicar no Netlify

O Marcelo pediu para preparar o site para postar no Netlify e confirmou: **publicação
pública definitiva** (não preview), e a **origem já está confirmada** ("Nelson já
aprovou o site"). Registro a fonte da confirmação: **Marcelo, 11/08/2026.**

**✅ Pendências de origem RESOLVIDAS** (eram #1 e #2 do "ONDE PARAMOS"): o texto da
"Nossa origem" que afirma que o grão vem da Serra de Brejões (altitude/clima/solo)
deixa de ser pendência. Removidas as marcações `.pend` e a `.pend-nota`. A confirmação
veio do Marcelo, não foi assumida por mim.

**Preparação de publicação (index.html):**
- Removido `<meta robots noindex, nofollow>` — o site passa a ser indexável.
- Removida a barra `.aviso-demo` ("Demonstração…") e o botão "Ver versão limpa".
- Removido o JS do `alterna` (senão daria `null` no console sem o botão).
- `.pend` do parágrafo da origem e `.pend-nota` retiradas (origem confirmada).
- O CSS de `.aviso-demo`/`.alterna-btn`/`.pend` ficou órfão e inofensivo (não removido
  para não arriscar; nenhuma classe do HTML o usa mais).

**Arquivos de deploy criados em `site/`:**
- `netlify.toml` — `publish="."`, sem build. Cache `immutable` de 1 ano para
  `/assets/*`, HTML sempre revalidado, headers de segurança (`X-Content-Type-Options`,
  `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`).
- `404.html` — página de erro na identidade do café (logo, DM Serif, botão voltar).
- `robots.txt` — `Allow: /`.

**Limpeza da pasta que vai ao ar** (só o que é entrega fica em `site/`):
- `index-armazem.html` (v4 exploração) → `site-fontes/` (já estava com assets órfãos).
- `assets/site-armazem.css` → `site-fontes/`.
- `ARQUITETURA.md` → `clientes/grao-da-serra/ARQUITETURA-site.md` (doc interna).
- Pasta `site/` final: `index.html`, `404.html`, `robots.txt`, `netlify.toml`, `assets/`.

**Como o Marcelo publica** (dois caminhos):
1. **Drag-and-drop** (mais rápido): arrastar a pasta `clientes/grao-da-serra/site/`
   inteira em app.netlify.com/drop. O `netlify.toml` na raiz do que for arrastado é lido.
2. **Git contínuo:** conectar o repo, **base directory** `clientes/grao-da-serra/site`,
   **publish** `.` (relativo ao base), **build command** vazio.

**⚠️ Ajustes que dependem do domínio final** (fazer depois que o Netlify der a URL):
- `og:image` está relativo (`assets/og-capa.webp`). Para preview de link no
  WhatsApp/redes ficar 100%, virar URL absoluta com o domínio.
- Opcional: `sitemap.xml` com a URL real e a linha `Sitemap:` no `robots.txt`.

**Segue ativo por pedido do Marcelo:** proteção anti-cópia e anti-zoom (é peça de
portfólio). ⚠️ Anti-zoom é antipadrão de acessibilidade, mantido por decisão dele.

**Verificado:** detector **exit 0**. Render 1440px (hero sem a barra demo, "Nossa
origem" sem o tracejado, 404 na identidade). Mobile **over=0** a 390px. Sem erro de
JS no console (o `alterna` removido não deixou referência quebrada).

## 🔧 Vigésima-sexta rodada (11/08) — correção da planta 4 + B2C sem redundância

Retorno do Marcelo sobre a 25ª. Três coisas.

| Pedido | O que foi feito |
|---|---|
| A **planta 4 saiu embaçada/com efeito ruim**. Deixar **maior e mais à direita, pode cortar no meio** | 🔴 **Lição:** eu insisti em processar (chapar cor / high-pass) a `Planta 4.png` do backup porque ela vinha com **fundo PRETO opaco** (glow), não transparente — e todo tratamento deixava halo ou embaçado. O Marcelo apontou que era **só colar** e mandou o **PNG já sem fundo** (alfa real, `ChatGPT Image 11…png`, 72% transparente, cantos alfa 0). Colado direto sobre o bege da seção (`#E7D2B8`), o glow claro **some no fundo** e o traço sépia fica limpo e nítido — sem tratamento nenhum. `planta-4.webp` = conversão direta do PNG sem fundo (760×1219, 186 KB). CSS: `width 330→470px`, `right -40→-150px`, `bottom 0→-20px` — maior e **cortada pela borda direita** (`overflow:hidden`), como pedido. **Regra:** quando o Marcelo manda PNG de gerador, conferir o alfa ANTES de processar — se já é transparente, é colar, não recortar. Fonte em `site-fontes/planta-4-sem-fundo.png` |
| **Eyebrow "Para revender ou para tomar em casa" repete o título** | Removido. O `.sec-head` do `#publico` ficou só com o h2 "Feito para o seu negócio e para a sua casa." + divisor |
| **Tirar o parágrafo "No atacado, para quem revende…"** | Removido |
| **Um ícone para dizer que é para clientes / tomar em casa** — ver como fica melhor | Consumidor final ganhou **ícone próprio (casa)** como **primeiro item** da fileira de perfis, rótulo "Para tomar em casa" em **negrito 700** (destaque sem cor nova, para não reprovar contraste). A grade passou de `repeat(7)` para **`repeat(8)`** — 8 divide melhor no responsivo (2×4 no mobile, contra os 7 tortos de antes). É a forma como fornecedor de café que atende os dois canais costuma resolver: o consumidor entra na mesma fileira de "para quem", em destaque, sem inventar seção nova. **Se o Marcelo preferir em outro lugar (ex: um bloco "Para você / Para seu negócio"), é troca rápida** |

**Verificado:** detector **exit 0**. Render 1440px (planta limpa colada e cortada à
direita, seção público com 8 ícones e sem redundância) e **mobile over=0** a 390px
(grade 2×4). Pasta **1,3 MB**.

## 📱 Vigésima-quarta rodada (10/08) — auditoria de mobile (sem overflow)

O Marcelo pediu "organize o site para celular". Auditoria completa: **o site já está
bem organizado no mobile, sem overflow horizontal.** Medido via iframe servido por
HTTP (mesma origem) em **320 / 360 / 412 / 768px → `over=0` em todos**; render fiel a
390px confirma header cabendo, hero e títulos DM Serif quebrando certo, faixa /
público (2 col) / passos / formulário / rodapé empilhando em coluna. Nenhuma edição
foi necessária.

⚠️ **Armadilha de ferramenta registrada:** `chrome --headless=new --window-size=390,N`
**não** renderiza a 390px de largura — o `clientWidth` real saiu **485px**, e o
screenshot recortava o layout de 485 em 390, simulando um "corte" que não existe no
site. Diagnóstico: injetar `document.documentElement.clientWidth` numa cópia servida
por HTTP. **Para render mobile fiel, usar o método do iframe** (site dentro de um
`<iframe width:390>` servido por HTTP), não `--window-size`. Só em 1024px a
`.planta-form` decorativa passa da borda (clipada, `scrollW<clientW`, sem scroll) —
não é mobile, fica anotado.

## 🧾 Vigésima-terceira rodada (10/08) — formulário e "Como comprar"

| Pedido | O que foi feito |
|---|---|
| Tirar o campo **WhatsApp** do formulário | `p-fone` removido do HTML e da montagem da mensagem no JS. "Nome completo" saiu do `form-duplo` e virou campo de **largura cheia** |
| Quantidade de café: deixar a pessoa **escrever quantas gramas** | Placeholder de "ex: 20 pacotes por mês" → **"Quantas gramas? ex: 500 g, 1 kg, 5 kg"** (campo segue texto livre) |
| Corrigir o **3º ícone (a caixa)** da seção "Como comprar" | Era o `package-open` da lucide (bagunçado no tamanho pequeno). Trocado pela **caixa fechada** (`package`), limpa e no mesmo traço dos passos 1 e 2 |
| Mudar a **tipografia dos números** dos passos | `.passo-num` era `--serif` (DM Serif Display, ficou pesado no círculo). Virou **sans negrito** (Source Sans 3, 700), círculo 32→34px |

**Verificado:** detector **exit 0**. Render 1440px conferido: números em sans limpos,
caixa fechada no passo 3, "Nome completo" em largura cheia, quantidade pedindo gramas.

## 🖋️ Vigésima-segunda rodada (10/08) — PNG transparente, motion, proteção, rodapé, DM Serif

Retorno do Marcelo, cinco pedidos, todos no `index.html`.

| Pedido | O que foi feito |
|---|---|
| Seção 2 saiu "bugada": quer **sem fundo**, igual ao PNG (nome de ChatGPT em assets) | O `secao-2-produto.webp` da 21ª foi gerado achatando o alfa em preto (`convert("RGB")`) → virou caixa preta. O PNG novo (`ChatGPT Image 10...png`) **é transparente** (alfa 0 nos cantos). Reconvertido preservando alfa (`RGBA`, `exact=True`), 960×1440, 232 KB. CSS voltou de `border-radius`+`box-shadow` para **`drop-shadow`** (acompanha o recorte). Fonte → `site-fontes/secao-2-produto-fonte.png` |
| Animação de **cada coisa aparecendo** | O sistema `.revela` (IntersectionObserver) já existia; estendi para hero (eyebrow/h1/sub/ação) e os 4 itens da faixa. O observer agora **cascateia o lote** que entra junto (transitionDelay `i*90ms`) — dá o "cada coisa aparecendo" sem o antipadrão do tudo-ao-mesmo-tempo. Reduced-motion e sem-IO → conteúdo já nasce visível |
| **Impedir cópia e zoom** | `user-select:none` no body (campos de form reabilitados senão não digita), `img{user-drag:none}`, `contextmenu`/`dragstart` bloqueados, `wheel`+ctrl e `ctrl +/-/0` e `gesturestart` bloqueados, viewport com `maximum-scale=1, user-scalable=no`. ⚠️ **Bloquear zoom é antipadrão de acessibilidade** (quem tem baixa visão precisa ampliar) — feito por pedido explícito do Marcelo (peça de portfólio), registrado aqui como divergência consciente |
| Rodapé: **tirar a casinha** e diminuir a altura | `.rodape-casa` (div + img) removido do HTML e CSS; `casinha-rodape.webp` → `site-fontes/`. Recuos do rodapé 70→44 e 52→34px |
| Aplicar **DM Serif Display** | Link do Google Fonts trocado (Prata → `DM+Serif+Display:ital@0;1`, mantém Source Sans 3 no corpo) e `--serif` atualizado. É Didone de alto contraste; no fundo claro com tinta escura lê bem. Resolve a pendência de tipografia (era "aguardando ele") |

**Verificado:** detector do impeccable **exit 0**. Render 1440 e 390px (Chrome headless):
recorte transparente sem fundo preto, títulos em DM Serif Display carregados (não caiu
no fallback), rodapé sem casinha e mais baixo, ícones marrom, sem overflow horizontal.
Pasta em **1,4 MB** (a casinha e o PNG-fonte saíram para `site-fontes/`).

## 🎨 Vigésima-primeira rodada (10/08) — ajustes de home no `index.html` original

Retorno do Marcelo em cima do **`index.html`** (o claro, original — não o armazém).
Mapa das seções que ele usa: hero = capa; **seção 1 = "Nossa origem"**; **seção 2 =
"Nosso café"** (a que tem botão + linha + pacote, e é a referência de "ocupa a tela");
**seção 3 = "Feito para o seu negócio"** (os ícones B2B); **seção 4 = "Como comprar"**.
A faixa marrom de atributos não é contada; a `.opcoes` foi removida.

| Pedido | O que foi feito |
|---|---|
| Capa: mostrar o pacote **inteiro** como no print + aumentar a altura | O print que ele mandou **é** a `hero-wallpaper.webp` atual — não trocou imagem, foi reenquadramento. `object-position` foi de `center` para **`74% 40%`** (enviesa à direita/topo, mantém o pacote e a serra atrás do texto) e `min-height` do hero de **720 → 820px**. Conferido em 1440 e 1920: pacote inteiro, sem corte |
| Tirar a seção "Como você preferir" (grão/moído) | `.opcoes #formatos` removida do HTML e do CSS (desktop + mobile). Fotos `foto-graos-real.webp` e `foto-moido-real.webp` viraram órfãs → movidas para `site-fontes/` |
| Seção 2: botão **dourado** | `.btn-escuro` → `.btn-ouro`. ⚠️ Sobre creme o dourado tem baixo contraste **com o fundo** (a marca.md reservava dourado pra fundo escuro) — mas **pedido explícito do Marcelo vence**, e o detector passou (texto tinta sobre dourado = 7,34:1). Divergência registrada |
| Seção 2: tirar a linha amarela sob o título | `.divisor` removido do "Nosso café" (segue existindo em "Feito para o seu negócio") |
| Seção 2: juntar os textos na vertical | Apertados eyebrow→h2→parágrafo→atributos: h2 `margin-bottom .5em→.32em`, p `.7em`, `.atributos` `28/32 → 18/24px`, eyebrow 8px |
| Seção 2: trocar o pacote pela **NOVA IMAGEM SEÇÃO 2**, bem grande | `NOVA IMAGEM PARA SEÇÃO 2.png` (2,5 MB) → **`secao-2-produto.webp`** (960×1440, 150 KB) via Pillow, nome sem espaço/acento. Como é FOTO retangular de fundo escuro (não recorte), virou destaque com `border-radius:16px` + `box-shadow` no lugar do drop-shadow. `max-height 600 → 720px`. PNG-fonte foi pra `site-fontes/` |
| Seção 3: ícones **marrom** | `.publico-item svg` de `--verde-md` → **`--tinta`** (#3D2115). Não usei `--marrom` #764D36 porque dá 2:1 sobre o creme (low-contrast). Tamanho 40 → 48px |
| Seções 1, 3 e 4 **maiores** (ocupar a tela, não "faixas") | Recuo vertical → **~100px** em origem (62→100), público (46→100) e passos (80→100), pra igualar a presença da seção 2 (104px). `origem-grid` min-height 376 → 460; `.publico-item` gap/padding aumentados |

⚠️ **Efeito de compliance a lembrar:** com o pacote do hero agora **inteiro e maior**, o
rótulo dele ficou mais legível — e é o rótulo de reconstrução de IA (origem "Serra de
Brejões" não confirmada + notas de sabor "chocolate amargo, frutas secas" inventadas).
É a pendência #2 já aberta. A `secao-2-produto.webp` traz o mesmo tipo de rótulo
("Qualidade Premium / Serra de Brejões"), mas é o rótulo físico do produto, não copy
nossa — entra como está, anotado.

**Verificado:** detector do impeccable **exit 0**. Render conferido em **1440, 1920 e
390px** (Chrome headless, reduced-motion): pacote inteiro no hero, botão dourado e foto
escura grande na seção 2, ícones marrom, seções 1/3/4 mais altas, sem overflow
horizontal. Pasta que vai ao ar: **1,4 MB** (o PNG de 2,5 MB e 3 órfãos saíram para
`site-fontes/`; acima do teto de 1 MB por imagens pré-existentes, não por esta rodada).

## 🧪 Vigésima rodada (10/08) — exploração de versões com o concept-seed do 4.0

O Marcelo pediu versões **alternativas** do site pra comparar. Construí duas
(escura editorial + kraft/B2B), ele mandou apagar as duas e explorar de verdade o
motor de divergência da skill. O que ficou de aprendizado e de estado:

- **A skill impeccable instalada é `4.0.4`** (não 3.5.0 como o CLAUDE.md da raiz
  dizia; corrigido lá). As primeiras versões saíam **parecidas entre si** porque eu
  não rodava o `concept-seed.mjs` — o torneio de conceitos do `new-work.md`, que é o
  que gera **mundos visuais divergentes** (foi o que fez o site de um conhecido do
  Marcelo sair radicalmente diferente a cada versão).
- **Criado `clientes/grao-da-serra/PRODUCT.md`** (derivado de `briefing.md` +
  `marca.md`). O concept-seed **exige** PRODUCT.md e usa `process.cwd()`, então
  rodar de dentro de `clientes/grao-da-serra/`:
  `node <raiz>/.claude/skills/impeccable/scripts/concept-seed.mjs --scope direction --mode persuade`.
  O PRODUCT.md separa **latitude visual** (o Marcelo liberou sair da marca do
  Nelson: pé no chão, **nada futurista, nada fora de café**) da **lei de
  integridade** (família não planta, origem `.pend`, sem jargão, sem inventar
  preço/mínimo, sem tracinho) — a lei vale em qualquer conceito.
- O torneio sorteou (`source: api`) index 5 + challengers aleatórios (mascote
  pastel, gráficos Du Bois, brocado jacquard, **osciloscópio verde**, ebru). Todos
  descartados sob a regra do Marcelo (o osciloscópio é o "futurista" vetado; Du Bois
  exigiria estatística que o Nelson não tem). Venceu material fundamentado de café.
- **Entregue: v4 "Armazém"** = `index-armazem.html` + `assets/site-armazem.css`.
  Mundo de mercearia de secos e molhados: **placa esmaltada** (hero), tipografia
  **slab** (Alfa Slab One, abandona a Prata das outras), **carimbo**, **etiqueta de
  papel pardo** com specs, **estêncil de engradado** nas etapas, **lista de gêneros**
  no atacado, formulário como **"nota de encomenda"**. Paleta parede caiada + verde
  esmalte + vermelho de carimbo. Detector exit 0, render desktop+mobile conferido.
- ⚠️ **As versões escura e kraft/B2B foram APAGADAS** a pedido do Marcelo (com o
  raciocínio delas guardado abaixo, na resposta do chat que gerou esta rodada, e nos
  teardowns de concorrentes em `referencias/`). Se quiser refazê-las, a espinha
  estava em: v2 = timeline do beneficiamento no escuro; v3 = conversão B2B (dor do
  revendedor + segmentação com valor + comparativo puro×comum), tirada dos teardowns
  `arbor-cafe.md` e `fazenda-sao-gabriel-atacado.md`.

**Estado do `site/`: `index.html` (ORIGINAL, intocado) + `index-armazem.html` (v4).**
Backup do original em `clientes/grao-da-serra/backup-site-2026-08-10/`.

## ✂️ Décima-nona rodada (10/08) — tira de specs repetida saiu da extensão grão/moído

O Marcelo pediu uma análise crítica: a tira `250 g · 100% arábica · Torra artesanal
· Sob medida`, logo abaixo dos dois formatos (Grãos/Moído), repetia informação já
dita? Análise confirmou que sim, e por dois motivos empilhados:

- **3 dos 4 itens já apareciam antes na mesma rolagem**: "100% arábica" e "Torra
  artesanal" já estavam na faixa verde do topo; "250 g / peso líquido" é idêntico,
  palavra por palavra, ao atributo que já mostra na Parte 1 ("Nosso café"), a
  centímetros de distância. Repetição decorativa, não reforço.
- **O 4º item, "Sob medida / no volume que precisar", não está confirmado em
  lugar nenhum** (`briefing.md`, `marca.md`). Afirmava flexibilidade de pedido
  sem o Nelson ter validado isso — o único item não repetido tinha um problema de
  integridade, então também não podia ficar.

**Decisão: removida, sem substituto.** Nenhuma alternativa testada (CTA extra,
comparação grão×moído, selo de confiança) agregava — os dois cards de foto+texto
já seguram o papel da seção, e as duas seções seguintes ("Para quem atende" e
"Como funciona o pedido") já continuam a narrativa B2B. `.opcoes-specs` saiu do
HTML e do CSS (desktop e mobile).

**Se o Nelson confirmar** que não tem pedido mínimo, essa informação merece um
espaço próprio e honesto depois — não uma tira genérica reciclando fatos já
ditos. Fica registrado como pergunta pra reunião.

**Verificado:** detector do impeccable — só o achado pré-existente de `dark-glow`
(sem relação). Render 1440px conferido: a seção termina de forma equilibrada logo
após os dois formatos, sem buraco antes de "Feito para o seu negócio".

## 🏠 Décima-oitava rodada (10/08) — casinha do rodapé virou elemento próprio

O Marcelo pediu pra corrigir a casinha do rodapé: menor, abaixo do texto, centralizada
de forma simétrica, sem competir com o texto, e corrigir o desnivelamento — com a
condição de **remover** se não desse pra deixar bem alinhada.

**A causa raiz:** a casinha nunca foi um elemento posicionável. Desde a 10ª rodada
(07/08) ela estava **gravada dentro do print** `rodape-fundo.webp`, usado como
`background: ... center bottom / cover`. Com `cover`, o recorte e a posição da
imagem mudam conforme a proporção do rodapé em cada largura de tela — foi isso que
fazia a casinha parecer torta e, no desktop, ela caía bem em cima da linha do CNPJ
no rodapé-pé, competindo com o texto de verdade.

**A correção não foi reposicionar o `background-position`** (isso só desloca o
recorte, não resolve o acoplamento entre proporção do rodapé e posição da casa).
A casinha virou uma imagem própria, isolada com alfa real.

**Primeira tentativa:** linha `.rodape-casa` centralizada na largura inteira do
rodapé, entre as 4 colunas e o copyright. O Marcelo mandou um print mostrando a
posição que queria de verdade — a mesma da 11ª rodada (07/08): **sob a 4ª coluna
("Produzido na Bahia"), alinhada com o texto, não centralizada na largura toda**.
Corrigido: a imagem foi pra **dentro** da última coluna, logo abaixo do parágrafo
"Valorizamos nossa terra...", herdando o alinhamento à esquerda do texto — sem
`flex`/centralização própria, só `margin-top`. Largura 170px (era 190px na
tentativa centralizada).

**De onde saiu a imagem:** `site-fontes/casinha-rodape.webp` (520×346, alfa
verdadeiro, conferido pixel a pixel — cantos em `(0,0,0,0)`) já existia como
recorte isolado da mesma gravação (casa + duas árvores, composição simétrica).
Foi copiada pra `site/assets/casinha-rodape.webp` (51 KB). O `rodape-fundo.webp`
antigo (fundo chapado + casa gravada) saiu da pasta que vai ao ar — não tinha mais
uso, já que o fundo do rodapé voltou a ser `var(--escuro)` sólido — e foi pra
`site-fontes/rodape-fundo-com-casa-antigo.webp`.

**Verificado:** detector do impeccable — só o achado pré-existente de `dark-glow`
na sombra da foto de "Nossa origem" (sem relação com o rodapé, não mexido). Render
1440px e 390px (iframe): casinha centralizada, sem sobrepor texto, espaçamento
simétrico acima e abaixo, em ambas as larguras.

## ⏱️ ONDE PARAMOS (10/08/2026) — ler primeiro

**Hoje (10/08), mais tarde:** 20ª rodada fechada — exploração de versões
alternativas com o `concept-seed` do impeccable 4.0 (ver "Vigésima rodada"). O
`site/` agora tem **`index.html` (original, intocado) + `index-armazem.html` (v4,
mundo "armazém")**. Duas versões intermediárias (escura, kraft/B2B) foram criadas e
**apagadas** a pedido do Marcelo. Criado `PRODUCT.md` do cliente. Nenhuma pendência
abaixo foi resolvida nesta rodada — foi trabalho de direção visual, não de dado.

**Antes, no mesmo dia:** 18ª e 19ª rodadas — casinha do rodapé virou elemento
próprio, bem alinhada sob "Produzido na Bahia" (ver "Décima-oitava rodada"), e a
tira de specs repetida `250g · 100% arábica · Torra artesanal · Sob medida` saiu
da extensão grão/moído por repetir conteúdo já dito (ver "Décima-nona rodada").
Essas duas mexeram no **`index.html` original**.

**Site:** 11ª rodada fechada em 08/08 (ver "Décima-primeira rodada" abaixo).
Detector `exit 0`, sem overflow. **O Conselho avaliou o site em 08/08** (log em
`_conselho/logs/2026-08-08-grao-da-serra-site-pronto-para-apresentar.md`):
veredito = apresentar como RASCUNHO para destravar dado, não publicar. Confiança 78%.

✅ **Feito em 08/08 (aprovado pelo Conselho):** as seções **"Para quem atende" (B2B,
6 perfis)** e **"Como funciona o pedido" (3 passos, faixa escura)** foram construídas,
entre "Nosso café" e o formulário. Detector exit 0, sem overflow, render desktop+mobile.

🔴 **Ainda pendente (o Marcelo pediu para NÃO trocar a foto por ora):**
- **Trocar a foto de produto de IA pela REAL** (`site-fontes/produto-original.png`).
  A "NOVO PRODUTO CAFÉ.png" foi **rejeitada** (rótulo embaralhado: "GRÂO DA SRRA",
  peso "2009"). A atual (`produto-cafe.webp`, "Imagem produto") também é mockup de IA.
  Marcelo pediu para deixar como está por enquanto (08/08).
- As outras 3 seções propostas (produto detalhado, subseção com callouts, prova de
  confiança) dependem de dado do Nelson e dos vetos — ver log do Conselho.
🔴 **Duas pendências abertas para o Marcelo:**
1. **"Da Serra de Brejões" no h1** afirma a região; o grão ainda não foi confirmado
   como sendo de lá. Está marcado com `.pend` (fio pontilhado). Uma pergunta ao
   Nelson libera. Se ele disser que NÃO, o headline precisa mudar.
2. **Dois rótulos diferentes no site:** o hero usa a foto nova (`hero-wallpaper`),
   cujo rótulo diz "Serra de Brejões / Notas de sabor: chocolate amargo, frutas
   secas" (origem não confirmada + nota de degustação inventada). "Nosso café" usa
   o rótulo REAL (`produto-original`: "Qualidade Premium / da Serra de Brejões").
   São dois rótulos — decidir qual é o verdadeiro e padronizar.
3. ~~**Marcelo está pensando em trocar a tipografia geral**~~ ✅ **Decidido em 10/08:**
   **DM Serif Display** (títulos) + Source Sans 3 (corpo). Aplicado na 22ª rodada.

## 🟢 Décima-sétima rodada (08/08) — CORREÇÃO da 16ª (não era pra mexer no Nosso café)

Na 16ª eu **errei**: substituí a parte de cima do "Nosso café" pelo layout do print e
removi a extensão. O Marcelo só queria **acrescentar as duas imagens à extensão**,
mantendo o "Nosso café" original. Revertido:

- **"Nosso café" (#cafe) RESTAURADO ao original:** texto à esquerda (eyebrow + h2
  "Qualidade que você sente em cada xícara" + 3 atributos + botão) e o **pacote**
  (`novo-produto.webp`, de volta em assets) à direita. Nada removido.
- **Extensão (#opcoes / #formatos) DE VOLTA**, agora com as duas imagens posicionadas
  como a referência: **foto circular + rótulo + descrição, lado a lado** (Grãos /
  Moído), mais a tira de dados (250g · 100% arábica · torra artesanal · sob medida).

Regra aprendida: quando o pedido é "acrescentar à extensão", **não** tocar na parte
de cima. A referência visual era sobre POSICIONAR as imagens na extensão, não sobre
refazer a seção inteira.

**Verificado:** detector `exit 0`, sem overflow 1920→390, render das duas partes.
Pasta em **988 KB** (o pacote voltou; perto do teto de 1 MB — se apertar, `novo-produto`
é o item a trocar/otimizar).

## 🟢 Décima-sexta rodada (08/08) — linha vertical + Nosso café no print

| Pedido | O que foi feito |
|---|---|
| "Como comprar": a linha estava horizontal; ele quer VERTICAL, saindo do marcador, à esquerda do texto | Trocado: o fio horizontal saiu; agora é `border-left` no parágrafo — linha **em pé**, à esquerda do texto de cada passo |
| "Nosso café" igual ao print (grãos/moído com fotos + atributos) | Seção REFEITA no layout do print: título central "Um café. Duas opções. A mesma qualidade.", dois formatos com **FOTO REAL circular** (grãos / moído), e tira de 4 atributos (100% arábica · torra artesanal · aroma intenso · café puro). Copy limpa: **sem** "excepcional" (superlativo), **sem** "torra média", **sem** notas de degustação (chocolate/caramelo, finalização doce, corpo/acidez) — tudo vetado |

**Consequências estruturais:**
- A seção **"Em grãos ou moído" (#formatos) foi REMOVIDA** — o novo Nosso café absorveu grão/moído. Não há mais duplicação.
- 🔴 **O pacote (`novo-produto.webp`) saiu do Nosso café** (o print não tem pacote, só as pilhas). O pacote continua **no hero** (`hero-wallpaper`). `novo-produto.webp` foi para `site-fontes/`. Se o Marcelo quiser o pacote de volta numa seção, é decisão dele.
- As fotos de grão/moído são as reais que ele mandou (`foto-graos.webp`, `foto-moido.webp`), em miniatura circular.

**Verificado:** detector `exit 0`, `scrollWidth==clientWidth` em 1920→390, render desktop e mobile. Pasta caiu para **832 KB** (o mockup pesado saiu).

## 🟢 Décima-quinta rodada (08/08) — polimento de ícones e fotos reais

| Pedido | O que foi feito |
|---|---|
| "Como comprar": ícones maiores + linha do ícone à direita do texto | `.passo-ic` 40 → **54px**; adicionado `.passo-linha` (fio dourado) no topo de cada passo, puxando do ícone e passando à direita do texto |
| Melhorar 1º e 3º ícones (prancheta + caixa aberta) | 1º virou **clipboard-list** (prancheta clara); 3º virou **package-open** (caixa aberta clara). Ambos lucide |
| Trocar ícone B2B na home | Faixa verde "Fornecimento B2B": caixa única → **caixas empilhadas** (fornecimento em volume) |
| Trocar Restaurantes/Hotéis/Padarias | Restaurantes e Bares → **garfo+faca**; Hotéis e Pousadas → **sino de recepção**; Padarias e Confeitarias → **cupcake** |
| Fotos de grão e moído na seção "Em grãos ou moído" | Os ícones dos 2 cartões viraram **fotos reais circulares** (`foto-graos.webp`, `foto-moido.webp`, recorte quadrado central, 104px, borda dourada). Fontes pesadas → `site-fontes/` |

**Verificado:** detector `exit 0`, `scrollWidth==clientWidth` em 1920→390, render das seções
alteradas. Pasta em **988 KB** — ⚠️ perto do teto de 1 MB (o mais pesado é
`novo-produto.webp`, 157 KB, o mockup de IA; trocar pela foto real do pacote
(`site-fontes/produto-recorte-real.webp`) devolve ~50 KB e o rótulo legível).

## 🟢 Décima-quarta rodada (08/08) — remodel round 2 + seção nova + ajustes

| Pedido | O que foi feito |
|---|---|
| "Como comprar" igual ao print 1 | Refeita: banner "Imagem banner etapas" (`banner-etapas.webp`, xícara com a logo à direita) de FUNDO, véu escuro à esquerda, texto + 3 passos com nº dourado + ícone (prancheta/WhatsApp/caixa). Copy do print. Mobile: banner esmaecido, passos empilham |
| Seção nova abaixo da 2, mesma cor, extensão | Criada **"Em grãos ou moído"** (`#formatos`, `--creme-fundo`): 2 cartões (Em grãos / Moído) + tira de dados B2B (250g · 100% arábica · Torra artesanal · Sob medida). Todos verdadeiros |
| Tirar "grãos/moído" da seção 2 (não ficou bom) | Painel removido do Nosso café → virou a seção nova acima |
| Aumentar bem o produto da seção 2 | Nosso café voltou a 2 colunas; `max-height` do produto 520 → **680px** |
| Aumentar altura do hero | `min-height` 600 → **720px** |
| Encurtar "Feito para o seu negócio" | Recuo 92 → **46px**, cabeçalho compacto — faixa curta |

🔴 **Imagem que faltou:** o Marcelo mandou (colada) uma foto de **grãos torrados num
saco aberto, mãos com luva** (ótima, B2B, e permitida — é produto/beneficiamento, não
colheita), para a seção nova. **Ela não foi salva na pasta** (só no chat), então a
seção foi montada com as infos por enquanto. Quando ele salvar em `assets/`, encaixar.

**Contexto:** o Marcelo disse ter dificuldade de organizar o site por não saber como
**sites B2B de café** se estruturam. Próximo passo sugerido: rodar `/estudar-site` em
3-4 fornecedores B2B reais e trazer um teardown de estrutura.

**Verificado:** detector `exit 0`, `scrollWidth==clientWidth` em 1920→390, render de
todas as seções em desktop e mobile. Pasta em **928 KB**.

## 🟢 Décima-terceira rodada (08/08) — remodel no estilo dos prints (round 1)

O Marcelo mandou 4 prints de comps (marca fictícia) e pediu para remodelar as
seções nesse estilo. **Análise completa dos 4 prints está na resposta do chat**;
resumo: prints 1 e 2 limpos; print 3 com layout bom mas copy vetada (cultivo +
perfil sensorial); print 4 com imagem vetada (mãos com cerejas = colheita) +
superlativo. **Round 1 feito:**

- **"Nosso café" → print 3.** Virou 3 zonas (texto · produto · painel "Grãos /
  Moído"). Copy reescrita SEM "cultivo" ("da escolha do grão à entrega") e SEM os
  atributos sensoriais do print (sabor balanceado / corpo aveludado / torra média
  = vetados). Ficaram Aroma intenso / Café puro / 250g. Painel grão+moído confirmado
  pelo campo do formulário, sem citar nível de moagem.
- **"Para quem atende" → print 2.** Virou linha horizontal de **7 perfis** com fios
  verticais e ícones em traço (Cafeterias e Coffee Shops · Restaurantes e Bares ·
  Hotéis e Pousadas · Padarias e Confeitarias · Mercados e Empórios · Empresas e
  Escritórios · Revendedores e Distribuidores). Responsivo 7→4→3→2.

**Imagem do produto:** o Marcelo fez a **"NOVO PRODUTO CAFÉ" transparente** (PNG,
70% alfa — confirmado) e pediu na seção. Colocada (`novo-produto.webp`, 153 KB).
⚠️ **O rótulo dela é mockup de IA e está embaralhado** ("GRÂO DA SERRA", "2009") —
avisado ao Marcelo 3x; ele optou por ela. O **recorte da foto REAL** (rótulo legível)
está guardado em `site-fontes/produto-recorte-real.webp` para troca de uma palavra.

🔴 **Round 2 pendente (precisam de imagem):**
- **"Como funciona" → print 1** (faixa escura + xícara à direita + ícones preenchidos).
  Precisa de uma imagem de xícara limpa (tenho `xicara.webp`, a avaliar).
- **"Por que escolher" (print 4)** como seção NOVA: só depois de trocar a imagem de
  colheita por outra (grão/torra/xícara) e tirar "qualidade superior" e "de origem".

**Verificado:** detector `exit 0`, `scrollWidth==clientWidth` em 1920→390, render das
duas seções em desktop/1024/mobile. Pasta em **892 KB** (novo-produto.webp é o item
mais pesado; se apertar o teto de 1 MB, otimizar ou voltar ao recorte real).

## 🟢 Décima-segunda rodada (08/08) — duas seções B2B aprovadas pelo Conselho

Construídas as duas seções que o Conselho aprovou como seguras e de maior impacto,
entre "Nosso café" e o formulário:

- **"Para quem atende"** (`#publico`, fundo #F1E4D1): eyebrow "Para o seu negócio",
  h2 "Feito para quem compra para revender", 6 perfis B2B em grade (cafeterias,
  padarias, mercearias, restaurantes/hotéis, escritórios, revendedores), cada um com
  ícone em traço próprio + rótulo + descritor. Alinhado ao campo "Você é" do form.
  **Sem alegação de origem, saúde ou superlativo** — descreve o público-alvo, não
  afirma clientes existentes. É o "para quem é" do 00-anatomia.md que faltava.
- **"Como funciona o pedido"** (`#como-funciona`, faixa ESCURA #3D2115): 3 passos
  numerados (preenche formulário → escolhe grão/moído e quantidade → finaliza no
  WhatsApp). Descreve o fluxo REAL do form sem servidor (50-copy-de-interface.md).
  A faixa escura quebra a sequência de cremes.

Ordem atual do site: Hero · Faixa verde · Origem · Nosso café · **Para quem atende** ·
**Como funciona** · Pedido · Rodapé.

**Verificado:** detector `exit 0`, `scrollWidth==clientWidth` em 1920/1440/1280/900/768/390,
render desktop e mobile das duas seções. Foto do produto **não** foi trocada (pedido do Marcelo).

## 🟢 Décima-primeira rodada (08/08) — casa do rodapé, título sem pendência, Conselho

| Pedido | O que foi feito |
|---|---|
| Casa do rodapé: tirar do centro, pôr à direita abaixo do texto "Valorizamos..." | `rodape-fundo.webp` recomposto: casa à direita (centro ~80% da largura) e embaixo. Fica sob a 4ª coluna, abaixo do texto |
| Tirar a linha pontilhada amarela do título da home | `.pend` removido do `<h1>`. A pendência de origem continua marcada no parágrafo da "Nossa origem" e no CLAUDE.md |
| Substituir foto da seção do produto pela "NOVO PRODUTO CAFÉ" | **NÃO feito, com motivo:** o rótulo dela está embaralhado por IA ("GRÂO DA SRRA", "CATEA", peso "2009"). Levado ao Conselho |
| Avaliar 5 seções propostas + rodar o Conselho | Feito. Ver log e o resumo no topo |

**Veredito do Conselho (resumo):** site pronto para **apresentar como rascunho**, não
publicar. Construir já **"Para quem atende"** e **"Como funciona o pedido"** (seguros,
alto impacto — o "para quem é" B2B era o bloco removido de maior impacto). **Vetos:**
perfil sensorial (jargão sem fonte), depoimentos (nenhum real), "atendimento direto com
o produtor" (a família beneficia, não produz). Foto de produto: usar a **real**, não IA.
Pendências a cobrar do Nelson na reunião: foto real, origem do grão, atende PF?, e a
**autorização de portfólio** (que é o pagamento da Horus).

## 🟢 Décima rodada (07/08) — barra do topo, logo maior, seções trocadas, produto real

Retorno do Marcelo, seis pedidos.

| Pedido | O que foi feito |
|---|---|
| Rodapé: tirar a casinha extra e pôr a casa do print no lugar dela | A `casinha.webp` já tinha saído na 9ª rodada (o print dele com duas casas era do estado anterior). O `rodape-fundo.webp` foi **recomposto por script**: recortei a gravação da casa e colei **centralizada e embaixo** num canvas do mesmo marrom (fundo amostrado do próprio print, então sem emenda). Casa reduzida a 60% pra virar ornamento discreto sobre a linha do rodapé, não competir com o texto das colunas |
| "Barra meio cinza no topo, tira ela" | Era o **gradiente escuro do cabeçalho** sobre o céu claro do hero (translúcido = cinza), numa faixa acima da logo onde não há texto. `.topo` virou `background:transparent` em repouso (só fica sólido ao rolar). ⚠️ Isso expôs o fundo creme do body no vão, porque a logo maior deixou o cabeçalho com **106px** e o hero só subia 72 — corrigido: `margin-top:-106px` no hero + `padding-top:174px` no wrap, e a foto passa por baixo do cabeçalho inteiro |
| Aumentar logo e nome | Emblema 60 → **78px**, nome 28 → **34px**, "Café" acompanhando. Atributos `width/height` da logo atualizados pra 78 (evita CLS) |
| Trocar seção 1 e 2 de lugar | **Origem agora vem ANTES de Nosso café** (swap feito por script nos blocos `<section>`, preservando comentários) |
| Nosso café: imagem na direita, texto na esquerda | Colunas do grid invertidas (texto 1ª, foto 2ª). A planta foi pra ESQUERDA, espelhada (`scaleX(-1)`), acompanhando o texto |
| Nova imagem do produto ("Imagem produto") | Foto de estúdio do pacote (com grãos e ramo) entrou como **foto arredondada** (`cover`, radius 20, sombra), no mesmo vocabulário da origem. Substituiu os grãos genéricos |

**⚠️ Efeito colateral do swap + imagem-direita:** origem e Nosso café ficaram as DUAS com foto à direita/texto à esquerda (antes alternavam). Foi o pedido literal do Marcelo; as cores de fundo diferentes (#F1E4D1 vs #E7D2B8) separam as seções. Se ele quiser alternância, é só reinverter uma delas.

**⚠️ Compliance/integridade — o rótulo da nova foto do produto:** a "Imagem produto" tem o rótulo lendo **"QUALIDADE PREMIUM"** e **"DA SERRA DE BREJÕES"**. "Premium" é superlativo e "Serra de Brejões" é a origem não confirmada — mas é o **rótulo físico do produto do cliente**, não copy nossa. Fica como está (é o produto dele), mas anotado: se um dia ele revisar a embalagem, esses dois pontos são os de risco.

**Sobre a "barra cinza":** o que o Marcelo chamou de barra cinza era o gradiente translúcido do cabeçalho. A barra **marrom** de "Demonstração" (`.aviso-demo`) continua — é o aviso de pendência, some no modo limpo (`Ver versão limpa`). Se ele quiser que suma de vez, é um pedido à parte.

**Verificado:** detector `exit 0`. Render 1900/1440/390 do topo (repouso + rolado), das duas seções trocadas e do rodapé. `scrollWidth==clientWidth` em 1920/1600/1440/1280/1024/900/768/390. `Imagem produto.png` (6,2 MB) e `graos-cafe.webp` (órfão) foram pra `site-fontes/`. Pasta em **780 KB**.

## 🟢 Nona rodada (07/08) — zoom do hero, origem reorganizada, rodapé com print

Retorno do Marcelo com seis pedidos, todos atendidos.

| Pedido | O que foi feito |
|---|---|
| "A imagem da home tá com muito zoom" | `min-height` do hero baixou de 680 → 600px. Com a foto larga (2,09:1) em `cover`, um contêiner mais baixo fica com proporção mais larga que a imagem, então o `cover` ajusta pela LARGURA e mostra a cena inteira (serra + saca + pacote) em vez de ampliar o centro. Em 1280px+ não há corte lateral |
| No título, tirar a linha abaixo de "Da Serra de Brejões" | Removido o `<br>para o seu <em>negócio</em>.`. O h1 ficou só "Da Serra de Brejões" (com o `.pend` de sempre) |
| Trocar "CAFÉ ARTESANAL DA BAHIA" por "CAFÉ ARÁBICO DA SERRA DE BREJÕES / BA" em `#d6b35f` | Eyebrow do hero trocado e recolorido para o dourado `--dourado` (#D6B35F). ⚠️ Ele pediu "BREJÕES - BA"; usei **" / "** no lugar do " - " por causa da regra da casa (sem tracinho como separador) e da grafia que o projeto já usa ("Brejões/BA") |
| Seção 2 (origem): a imagem sumiu | Era referência quebrada — o HTML apontava `vista-brejoes.webp`, que não existia (só o `.png`). Gerei o WebP (1040px, 149 KB) |
| Origem: pontas arredondadas + selo na esquerda passando pela metade | A foto deixou de sangrar até a borda e virou figura CONTIDA na coluna direita, `border-radius:20px`. O selo foi para a borda esquerda, `left:0;translate(-50%,-50%)` = metade dentro, metade fora |
| Origem: rever "Altitude / Clima / Solo" — "veja um lugar melhor ou tire" | **Removidos os três cards.** Repetiam palavra por palavra o parágrafo e empilhavam a mesma credencial de origem não confirmada. Quem "ressalta a Serra de Brejões" agora é a própria foto (serra, mata, cafezal, cidade no vale) + o selo + o parágrafo. Menos, e mais honesto |
| Origem: fundo `#f1e4d1` | `--origem` foi de `#E1CAAC` para `#F1E4D1` |
| Rodapé: usar o print (marrom com a casinha gravada) de fundo | `.rodape` com `background:var(--escuro) url(rodape-fundo.webp) center bottom/cover`. Como já havia a `casinha.webp` na 4ª coluna, ela SAIU (duas casas era redundante) |
| Seção 1 (Nosso café): pôr a foto "Grães de café" | Feito. ⚠️ Isso **substituiu a foto REAL do pacote** por grãos genéricos. Registrado abaixo |

**🔴 Duas armadilhas de imagem desta rodada:**
1. **O PNG "Grães de café" veio com o xadrez de transparência DESENHADO dentro
   do arquivo** (não era alfa) — o mesmo caso da xícara e do selo. Recortado por
   script (keying por cromaticidade+luminância a partir de `site-fontes/graos-cafe.png`).
2. **`cramped-padding` na origem, do detector.** Até a 8ª rodada a foto sangrava
   até a borda (`right:0`), e era o sangramento que fazia o detector aceitar a
   seção colorida com padding horizontal 0. Como a foto virou contida, a calha
   lateral teve de sair da PRÓPRIA seção (`.origem{padding:62px var(--gut)}` +
   `.origem .wrap{padding:0}`). Regra: **seção colorida sem filho que sangre
   precisa de padding horizontal próprio.**

**🔴 Pendência que esta rodada REFORÇOU:** o novo eyebrow ("CAFÉ ARÁBICO DA SERRA
DE BREJÕES") afirma origem do grão na região — a mesma pendência #1 já aberta (o h1
e o parágrafo da origem já carregam `.pend`). Continua dependendo de UMA pergunta ao
Nelson: *"o café que seu pai compra vem de produtores daqui da região Serrana /
Brejões?"* Se ele disser que não, caem o eyebrow, o h1 e o parágrafo da origem.

**⚠️ Também levar pro Marcelo:** trocar o pacote real por grãos genéricos na seção
1 tira do site a única foto do produto que o revendedor B2B enxerga. O `pacote.webp`
(rótulo verdadeiro) está guardado em `site-fontes/` e volta com uma troca de arquivo
se ele quiser.

**Verificado:** detector `exit 0` (acusava `exit 2` antes da correção do padding, então
rodou mesmo). Render 1440/390 nas quatro seções mexidas. `scrollWidth==clientWidth`
em 1920/1440/1280/900/390. Fontes pesadas movidas para `site-fontes/`. Pasta em **868 KB**.

## 🟢 Oitava rodada (07/08) — wallpaper novo, faixa verde de volta, home no print

O Marcelo mandou um print novo da home (marca fictícia "Grão da Serra" com foto
publicitária) e uma foto de fundo nova (`site-fontes/wallpaper-home.png` →
`hero-wallpaper.webp`, 1812x868, larga).

| Pedido | O que foi feito |
|---|---|
| Trocar o wallpaper da home pela foto nova | Feito. É larga (2,09:1), então cobre a tela sem ampliar demais e o pacote fica em tamanho bom — resolve de vez o "muito grande" |
| Deixar a home igual ao print | Eyebrow + h1 "Da Serra de Brejões / para o seu negócio", subtítulo, dois botões (dourado "Solicitar Orçamento" + fio "Nossos Cafés"), botão dourado no cabeçalho |
| Logo grande | Emblema de 44 → 60px, nome em corpo maior |
| Cores dos botões | Dourado preenchido + fio, como o print |
| Tirar o papel rasgado | Removido (HTML + CSS). O hero encosta direto na faixa verde |
| Faixa verde depois da home | Seção `.faixa` #20301C com os 3 atributos que estavam no hero + **Fornecimento B2B** (ícone de caixa novo) |

**Copy do print foi ajustada (integridade):** o print dizia "cultivados com
cuidado" (a família não planta) e "Cafés Especiais" (jargão proibido). Viraram
"escolhido maduro, torrado com cuidado" e eyebrow "Café artesanal da Bahia".

🔴 **O verde voltou.** Saiu em 06/08 por alinhamento ao manual do Nelson; volta por
pedido explícito do Marcelo. Pedido do cliente vence a diretriz interna — registrado.

**Armadilha desta rodada (vale como lição):** ao trocar o hero inteiro por Edit, o
`old_string` não incluiu o SVG do rasgo que vinha DEPOIS dos `</div>` — sobrou um
rasgo órfão + um `</section>` extra entre a faixa e "Nosso café", que só apareceu no
render (borda serrilhada no fim da faixa). **Ao substituir uma seção grande, o
old_string tem que ir até o `</section>`, não até o último `</div>` visível.**

**Verificado:** detector `exit 0` (controle 5 achados). Render 1920/1440/390, sem
overflow. `hero-serra.webp` saiu da pasta que vai ao ar. Pasta em **873 KB**.

## 🖼️ Sétima rodada (06/08) — hero menor e preto, produto real em "Nosso café"

Retorno do Marcelo depois de ver a sexta rodada, mais dúvida sobre a seção
"Nosso café". Ele mandou modelos de referência (kraft minimalista, produto em fundo
escuro, foto publicitária do pacote).

| Pedido | O que foi feito |
|---|---|
| "A foto da home ficou muito grande" | O hero deixou de ser `cover` de largura cheia (que ampliava o pacote; em 1920 o rótulo ficava legível) e passou a ser dimensionado pela **largura do contêiner** (54%, teto 820px), ancorado embaixo à direita. O pacote encolhe proporcionalmente em qualquer tela |
| "A cor escura da esquerda, que está marrom, quero preta" | Fundo do hero e véu passaram de marrom `#2D190F` para **preto**. Branco sobre preto = 21:1 |
| (efeito colateral) borda dura da foto sobre o preto | A imagem é **mascarada** (mask-composite `intersect`): topo e esquerda dissolvem no preto, então a foto emerge sem emenda em vez de virar um retângulo com linha |
| "Nosso café: pacote? grãos? foto publicitária? não esquecer que é B2B" | Decidido: **foto real do pacote** (`pacote.webp`, rótulo verdadeiro) no lugar da foto genérica de mãos no grão. É o que o revendedor quer ver, e tirou mais um "Imagem provisória". Formulário fica com a ilustração botânica — repetir o pacote nas duas seções é o container preguiçoso |

**Por que sem Conselho:** escolha de imagem de seção é design, não decisão de risco
(`DINAMICA-E-LIMITES.md`: não convocar por hábito). Resolvido direto.

**Verificado:** detector `exit 0` (controle devolveu 5 achados). Hero e "Nosso café"
conferidos em 1920, 1440 e 390. `pessoa-mexendo-cafe.webp` saiu da pasta que vai ao
ar. Pasta em **844 KB**.

## ⏱️ Onde paramos antes (05/08/2026)

**Google Meu Negócio:** ✅ criado e **verificado na hora**, sem vídeo, porque usamos
o endereço do MEI. Já está no ar. Falta só cadastrar produtos, subir fotos reais e
pedir as primeiras avaliações aos clientes de revenda dele.

**Site:** **TERCEIRA versão**, refeita em 05/08 a partir de seis referências novas.
`site/index.html` + `site/assets/site.css`. Detector `exit 0`, **736 KB**.
A versão escura está em `Backup 1/`; a versão clara de 03/08 foi substituída.

**O site tem hoje, na ordem:** cabeçalho verde com logo à esquerda · hero com o
pacote real sobre a serra · faixa verde de 4 pilares · "Nosso café" · processo em
4 etapas · "Nossa origem" com selo redondo · "Para quem é" · FAQ · formulário que
monta o pedido e abre o WhatsApp preenchido · rodapé em 4 colunas.

### 🔴 O que trava, e é tudo material do cliente

1. ~~Fotos reais do pacote~~ ✅ **resolvido em 05/08**: o Nelson mandou a foto de
   estúdio da embalagem (`site-fontes/produto-original.png`), e o Marcelo mandou a
   arte do hero com o pacote sobre a serra. As **quatro fotos do processo**
   continuam geradas e marcadas "Imagem provisória"
2. **Foto do Nelson** — a seção "Quem faz" está fora desde 03/08, mas a foto
   continua sendo o que falta para ela voltar
3. **Lista de produtos** com peso, moagem e faixa de preço. O rótulo confirma
   **250 g**; falta o resto
4. **Confirmar a ordem das etapas**: pesquisa (Embrapa/Emater) diz secagem **antes**
   da pilagem, e o site já está escrito assim. Perguntar: *"vocês secam primeiro e
   só depois pilam, certo?"*
5. **Autorização para falar do pai** no site (a seção "Quem faz" tem isso marcado)
6. **Escopo e prazo do site**, e a **autorização de uso como portfólio** — nunca
   foram fechados, e a autorização é o pagamento da Horus nesse projeto
7. **Origem do grão**: se vier de produtores da região Serrana, entra a seção
   "De onde vem", que hoje está deliberadamente fora

### Ideias do Marcelo ainda não feitas

- **Motion nos processos do café** (ele pediu, ficou para depois das fotos reais)
- Logo com lettering em fundo transparente, e o vetor se existir

### Notas operacionais

- **Higgsfield:** o **MCP não autentica** nesta máquina, mas o **CLI local está
  logado e funciona** (`higgsfield generate create nano_banana_pro --prompt "..."
  --aspect_ratio 4:3 --resolution 1k --wait`). 2 créditos por imagem.
  **Saldo em 03/08: 154 créditos** (2 gastos no `hero-graos`, aprovado de primeira)
- **Print da página:** Edge headless com `--headless=old` e `--user-data-dir` novo a
  cada execução. Ver `_memoria/design/99-checklist.md`
- Arte-fonte em `site-fontes/`, fora da pasta que vai ao ar

## Sobre

Entregar um **site** para o Café Grão da Serra (café torrado 100% arábica,
artesanal, Salvador e região), **de graça**, como peça de portfólio da Horus, e
usar a conta aberta para trabalho pago depois.

## Tipo

Cliente novo. Chegou por relação: o Antonio (sócio) já era amigo do Nelson.
**Trabalho não pago**, por decisão da agência, com contrapartida de portfólio.

## Entregas previstas

1. **Google Meu Negócio** ← prometido ao cliente para 29/07
2. **Site institucional** ← o combinado, de graça. **Institucional, não loja**
3. **CRM** ← pedido explícito do cliente: acompanhar clientes e produtos,
   atualizar faixa de preço, com painel do gestor e painel dos funcionários.
   **É trabalho pago, com escopo próprio.** Não deixar virar extensão do grátis
4. Tráfego pago (oportunidade, não vendida)

## 🟢 Quarta rodada (05/08/2026) — site refeito nas SEIS referências novas

O Marcelo mandou um mockup completo de home em seis partes
(`imagens/referencia-home/HOME PT 1..6.png`), de uma marca fictícia chamada
"Café Serra de Brejão", e pediu **igual**. O site foi refeito inteiro.

**⚠️ Armadilha de processo que custou meia rodada:** as seis imagens foram
salvas em `site/assets/` **depois** de a mensagem ser enviada, e o primeiro
`ls` da pasta não as trouxe. Eu comecei a construir em cima das referências
antigas (`imagens/Ideia de Home 1..3.png`, de 03/08), que têm nome parecido.
**Quando o Marcelo disser "as imagens que te passei", conferir a data do
arquivo, não só o nome** — e relistar a pasta antes de assumir que não chegou.

### O que veio de cada parte

| Referência | Virou |
|---|---|
| PT 1 | Cabeçalho verde `#20301C` com logo à esquerda e pílula "Peça pelo WhatsApp"; hero com texto à esquerda sobre creme e a arte sangrando por trás |
| PT 2 | Faixa verde com quatro pilares, ícone em traço dourado |
| PT 3 | "Nosso café": foto à esquerda, eyebrow + título + divisor + três atributos com selo redondo + botão verde |
| PT 4 | "Nossa origem": texto à esquerda, paisagem sangrando à direita, **selo redondo montado na junção** |
| PT 5 | "Peça o seu café": formulário em creme com ornamento botânico em traço |
| PT 6 | Rodapé escuro em quatro colunas, com sociais e ícones de contato |

**Ficaram, e não estão nas seis referências:** o **processo em 4 etapas** (é o
diferencial verdadeiro do cliente, e nenhum concorrente do nicho mostra), o
**"Para quem é"** (o negócio é B2B, e sem ele o site não fala com quem revende) e
o **FAQ**. Sem esses três o site perderia conteúdo já aprovado em troca de nada.

### 🔴 A copy do mockup foi REESCRITA, e o motivo não é estilo

O mockup dizia, em texto corrido: *"cultivado com cuidado no interior da Bahia"*,
*"do cultivo à colheita, cada etapa é feita com dedicação"*, *"região de altitude,
clima ameno e solo fértil que resultam em um café especial"* e *"famílias que vivem
do campo"*.

Nada disso pode entrar: **a família não planta e não colhe**, e altitude, solo e
"café especial" são exatamente o jargão que a `marca.md` proíbe sem fonte. O que
ficou afirma o lugar onde **eles** estão e o trabalho que **eles** fazem.

### Paleta: de onde saiu cada cor

Amostragem das áreas chapadas do mockup: verde `#20301C`, creme `#E4D0B4`, rodapé
`#2C1C10`.

- **O verde virou fundo de seção inteira.** ⚠️ A `marca.md` diz o contrário
  ("coisa pouca", proibido fundo de seção). **Pedido explícito do Marcelo vence a
  diretriz interna**, e a divergência fica registrada aqui de propósito
- **O creme foi clareado** de `#E4D0B4` para `#F8E4CF`, que é o `#EFC294` OFICIAL
  com 55% de branco. Não é gosto: com o creme do mockup **nenhum** degrau de
  dourado fecha 4,5:1 num eyebrow
- **O eyebrow dourado do mockup reprova.** Dourado `#D6B35F` sobre creme dá
  **1,44:1**. Entrou o degrau escuro `#7E6124`, que dá 4,69:1 e continua lendo
  como dourado. O `#D6B35F` ficou como preenchimento e como traço de ícone **sobre
  o verde**, onde ele dá 6,98:1
- O rodapé usa o `#3D2115` oficial no lugar do `#2C1C10` do mockup

### 🔴 Três achados do detector que viraram regra

1. **`padding:0` de reset de lista sobrescreve a calha do `.wrap`.** Os quatro
   pilares viraram `<ul>` e o reset `list-style:none;margin:0;padding:0` apagou os
   24px laterais: no celular o texto encostava na borda da tela. **Reset de lista
   zera a margem, não o padding**, quando o próprio elemento é o container de
   largura
2. **`skipped-heading` do h1 direto para h3.** Os quatro pilares eram `<h3>` e a
   faixa não tem `<h2>`. Não se resolve inventando um título: eles são **rótulos de
   atributo**, não seções do documento, e viraram `<p class="pilar-nome">` dentro
   de uma lista
3. **`cramped-padding` em seção com foto sangrando.** A "Nossa origem" tinha
   recuo zero porque a foto vai até as bordas. A saída não foi dispensar a regra:
   o recuo foi para a **seção** e a foto sai dele com uma **margem negativa do
   mesmo tamanho**. Ela continua sangrando e a seção passa a ter recuo de verdade

### Notas de imagem desta rodada

- O **recorte do pacote** (`site-fontes/pacote-recortado.png`) foi feito por
  script a partir da foto de estúdio, em `scipy`: silhueta por saturação, abertura
  com disco de raio 22 para comer a língua fina da sombra (a sombra encostada no
  saco é **saturada**, porque o kraft rebate luz quente nela — filtro de cor não
  separa, espessura separa), e sombra refeita em CSS com `drop-shadow`, que
  acompanha o alfa. **Ele não está no site hoje**: a arte do hero já traz o pacote
- A arte do hero veio como `ChatGPT Image 5 de ago...png` dentro de `site/assets/`.
  Foi **renomeada e movida** para `site-fontes/hero-pacote-serra-2k.png`: nome de
  arquivo do gerador fica público no HTML, e PNG de 1,9 MB não vai ao ar
- ⚠️ **O rótulo na arte do hero é uma reconstrução do modelo, não o rótulo real.**
  Ampliando, ele lê "selecionado e 100% natural" e "embalado com carinho e
  dedicação especial", que **não** é o que o rótulo do Nelson diz. No tamanho de
  exibição não se lê, mas **não usar essa arte ampliada nem como foto de produto**

**Verificado em 05/08:** detector `exit 0` (o mesmo comando devolvia 2 achados
antes das correções, então rodou mesmo). Render em 1440, 900 e **390px pelo método
do iframe**. Pasta em **736 KB**. Cinco WebP que ficaram sem uso foram movidos para
`site-fontes/`.

### 🔁 Retorno do Marcelo na mesma noite (05/08) — ajuste fino

| Pedido | O que foi feito |
|---|---|
| "A imagem da hero não está ajustada de acordo com a referência" | A arte deixou de ser `cover` esticado na largura e passou a se ajustar pela **altura**, ancorada à direita. Com `cover` num hero de 580px ela perdia 33% da altura: sumia a mesa e o pacote ficava gigante e cortado. Agora aparece inteira, do céu à mesa, e o creme preenche a esquerda |
| "Logo abaixo da hero, os textos estão todos na esquerda" | Bug real: `margin:0` do reset de lista em `.pilares-grid` apagava o `margin:0 auto` do `.wrap`, e a faixa inteira encostava na esquerda |
| Desenhos de planta 1, 2 e 3 | Planta 2 na direita da seção 1; planta 1 na direita do formulário; planta 3 na esquerda do formulário, atrás da xícara e acima dela, como no PT 5 |
| Xícara no formulário | Sangra pela esquerda, sobre a planta 3 |
| Seção 1: imagem maior, base alinhada ao botão | `align-items:stretch` no grid: a foto passa a ter a altura da coluna de texto, então a base dela fecha na linha do botão |
| Botão "Quero experimentar" mais largo | `padding` lateral de 56px |
| Seção 1 com a cor de fundo do desenho | `--creme-fundo:#E7D2B8`, amostrado do próprio arquivo. Vale também para o formulário, senão a planta 3 (que é opaca) apareceria como retângulo |
| — | O selo redondo que eu tinha desenhado em SVG virou a arte `Selo Bahia` que ele mandou |

**Três defeitos reais achados nesse ajuste** (e que viraram linha em
`90-antipadroes.md`): o `margin:0` do reset de lista; o `object-fit:cover` cortando
arte já composta; e `.origem-foto img` (sem `>`) pegando a img do selo, deixando o
wrapper com altura zero — o selo simplesmente não aparecia, sem erro no console.

**Sobre os arquivos:** as imagens chegaram com nome de gerador e com espaço e acento
(`Xícara do Formulário.png`, `Planta desenho 1.png`). Foram convertidas para WebP e
renomeadas para slug sem acento: nome com espaço vira `%20` na URL e quebra em
alguns hosts. As fotos do processo mantiveram o nome descritivo que o Marcelo deu,
só que em slug (`secagem-do-cafe.webp`, `torra-do-cafe.webp`...).

⚠️ **Duas artes vieram com o xadrez de transparência DESENHADO dentro do PNG** (a
xícara e o selo), não com alfa. Foram recortadas por script. Ver o antipadrão
correspondente: a chave por cor sozinha come a louça branca do assunto.

⚠️ O arquivo que ele chamou de "Moagem do café" é a foto do **pilão** e está na etapa
03, que o site chama de "Pilado no pilão". O nome do arquivo e a etapa divergem: se
a foto for mesmo de moagem, a etapa 03 precisa de outra foto.

**Verificado depois do ajuste:** detector `exit 0`, conferido contra um
arquivo-controle que devolveu **5 achados**, para garantir que a ferramenta rodou.
Render em 1440 e 390px.

### ✂️ Terceiro retorno da mesma noite (05/08) — o site encolheu para 5 blocos

O Marcelo mandou remover **três seções inteiras**: "O trabalho está no cuidado com o
grão" (o processo em 4 etapas), "Para quem é esse café" e "Dúvidas". Feito.

**O site hoje tem:** cabeçalho · hero · faixa de 4 pilares · "Nosso café" ·
"Nossa origem" · "Peça o seu café" · rodapé.

🔴 **O que saiu junto, e precisa estar declarado:**

1. **O processo era o diferencial verdadeiro do cliente.** Seleção do grão maduro,
   secagem no terreiro, pilão e torra artesanal é o que a família de fato faz e o
   que nenhum concorrente do nicho mostra. Sem essa seção, o argumento sobrevive só
   em uma linha da Origem e num pilar da faixa verde
2. **"Para quem é" era o único bloco que falava com quem REVENDE**, e o negócio é
   B2B. Hoje isso vive apenas no pilar "Feito para revender" e no campo "Você é" do
   formulário
3. **O FAQ carregava sete pendências marcadas** (mínimo de pedido, prazo, entrega,
   pagamento, nota, venda em grão). Elas não sumiram do negócio: sumiram do site, e
   agora caem todas no WhatsApp do Nelson, que atende sozinho

Nada disso desfaz o pedido. Fica registrado para a decisão ser consciente, e porque
o `00-anatomia.md` trata os blocos 2 e 4 como os de maior impacto e mais esquecidos.

**Efeito colateral resolvido:** o botão da Origem dizia "Conheça nossa história" e
apontava para `#processo`, que deixou de existir. Virou "Peça o seu café" →
`#pedido`. Os links do menu e do rodapé para as seções removidas também saíram.

**Também nesta rodada:**

- **Ícone oficial do WhatsApp** no lugar do balão de conversa, nos quatro lugares
  (pílula do cabeçalho, botão do formulário, rodapé social e linha de contato). ⚠️ É
  um glifo **preenchido**, e as regras de ícone da casa são todas de traço: a classe
  `.ico-wa` desliga `stroke` e liga `fill`
- **Planta 2** na seção 1 cresceu para 430px e passou a ser ancorada **embaixo**
  (`bottom:0`), que é como ela aparece na referência
- **Planta 1** do formulário cresceu para 400px; a **xícara** foi para 370px com
  menos corte. O limite dela é a borda esquerda da caixa do formulário: passando
  disso, cobre os rótulos dos campos
- 🔴 **`.sec-head` morava dentro do bloco CSS do processo** e saiu junto quando a
  seção foi removida. O formulário usa: o título dele ficou alinhado à esquerda até
  a regra voltar. **Ao remover uma seção, conferir o que do CSS dela é
  compartilhado** — o mesmo vale para `.fig`, `.rotulo` e `.revela`, que ficaram

**Verificado:** detector `exit 0`. Render em 1440 e 390px. Pasta caiu de 956 KB para
**680 KB**, porque as quatro fotos do processo saíram da pasta que vai ao ar (estão
em `site-fontes/`, e voltam se a seção voltar).

### 🏠 Quarto retorno (05/08) — formulário comprimido e a casa no rodapé

| Pedido | O que foi feito |
|---|---|
| Comprimir o formulário e colar os ornamentos no rodapé | Recuo de baixo da seção caiu de 100px para 34px; campos, `textarea` e `sec-head` apertados. A xícara e o galho passaram a ser ancorados **embaixo** (`bottom` negativo), então são cortados pela linha do rodapé, como no print |
| "Beneficiado na Bahia" → "Produzido na Bahia" | Feito |
| Texto novo da última coluna | "Valorizamos nossa terra, nossa gente e a tradição que faz do nosso café algo especial." É a copy do mockup, e **"nossa terra" é palavra que o próprio cliente usa** (ver `marca.md`, tom de voz): não afirma lavoura, afirma pertencimento |
| Ilustração da casa abaixo do texto | `casinha.webp`, 258px, largura da coluna |

**Sobre o "Produzido na Bahia":** passa. A família não planta e não colhe, mas
**beneficia** (seleção, secagem, pilão, torra, moagem) em Brejões, e é isso que
"produzido" descreve aqui. O que continua proibido é cultivo e colheita.

**Verificado:** detector `exit 0`. Render em 1440 e 390px. Pasta em **732 KB**.

## 🌄 Quinta rodada (06/08) — hero escuro, paleta do manual, faixa verde fora

O Marcelo mandou prints de outra direção (hero escuro com cabeçalho transparente e
botão dourado) e pediu para alinhar as cores ao manual do Nelson.

| Pedido | O que foi feito |
|---|---|
| Cabeçalho transparente | Véu em gradiente que desce a zero, e o hero passa **por baixo** dele (`margin-top:-72px`). Vira chapa `#3D2115` ao rolar |
| Escurecer a home do lado do texto | O véu do hero deixou de ser creme e virou escuro. O texto foi de tinta sobre creme para **branco sobre marrom**. Medido no ponto mais claro da foto: a .80 o branco dá 8,05:1 |
| Alinhar à paleta do Nelson | **O verde escuro `#20301C` saiu do site**: faixa, botões e hover. Botão do hero virou dourado `#D6B35F` com texto tinta (7,34:1); nas seções claras virou marrom `#3D2115` com creme (8,98:1). Só sobrou o `--verde-md` em ícone e link, que é a dose de "coisa pouca" da `marca.md` |
| Tirar a faixa verde e levar os 3 textos para a home | Feito. Viraram a tira `.hero-selos`, logo abaixo dos botões |
| Papel rasgado na borda da home | SVG com caminho **gerado**, não desenhado à mão, preenchido com a cor da seção seguinte |
| "Nossa origem" com fundo `#E1CAAC` | Feito. Contraste conferido: tinta 9,28 · marrom 4,59 · verde-md 4,86 · dourado-esc 4,65 |
| Selo sob a imagem, mais à direita | Saiu da junção das colunas e foi para dentro da foto, canto inferior direito |
| Foto nova | `vista-brejoes.webp`, a foto real de Brejões que ele mandou |
| Três atributos abaixo do texto | Feito, com fio em cima de cada um (três cards iguais lado a lado é o container preguiçoso do `90-antipadroes.md`) |

**Por que o botão não é dourado em toda parte:** sobre creme o dourado tem 1,44:1
de contraste **com o próprio fundo** e deixa de ler como botão, mesmo com o texto
passando. Dourado sobre escuro, marrom sobre claro. O acento continua sendo um só.

**Armadilha do hero escuro:** a foto é ajustada pela altura e ancorada à direita,
então à esquerda dela aparece o fundo chapado da seção. Com o fundo em `#3D2115` e o
véu em `rgb(45,25,15)` ficava uma **emenda vertical dura** no meio da composição. Os
dois têm que ser a mesma cor, e o véu tem que cobrir a seção inteira, não só a foto.

### 🔴 O texto novo da Origem afirma o que ainda não foi confirmado

O texto pedido é: *"A Serra de Brejões, no coração da Bahia, oferece o terreno
perfeito para cafés: altitude, clima e solo fértil que resultam em grãos de alta
qualidade e sabor marcante. É de lá que nasce o Grão da Serra."* Mais os três
atributos (altitude, clima, solo).

Isso afirma que **o grão vem da região**, e usa **altitude, clima e solo como
credencial do produto**. As duas coisas estão na lista de proibido-sem-fonte da
`marca.md`, e o `briefing.md` registra que ainda não foi confirmado de onde o pai
compra o grão. A foto nova reforça: ela tem um **cafezal em primeiro plano**.

**Está no site, marcado com `.pend`**, que é o mecanismo do `integridade.md` para
dado não confirmado. **Uma pergunta ao Nelson libera os quatro elementos de uma
vez:** *"o café que seu pai compra vem de produtores daqui da região Serrana /
Brejões?"* Se sim, tira-se a marcação e está tudo certo. Se não, caem o parágrafo,
os três atributos e a foto com cafezal.

**Verificado:** detector `exit 0`. Render em 1440 e 390px. Pasta em **727 KB**.
`paisagem-serra.webp` ficou sem uso e foi para `site-fontes/`.

## 🩹 Sexta rodada (06/08) — o quadrado marrom, o rasgo, a Origem e a planta sumida

Retorno duro do Marcelo, item por item. Ele mandou junto **cinco prints novos**,
que estão em `imagens/referencia-06-08/` (chegaram em `site/assets/` e foram
movidos de lá: referência não vai ao ar).

| Pedido | O que foi feito |
|---|---|
| "Um quadrado marrom gigante na home, cortado no meio. Tira." | A foto do hero deixou de ser ajustada pela altura e ancorada à direita, e passou a **cobrir a largura inteira** (`cover` + `object-position:74% 62%`). O `#2D190F` que aparecia à esquerda era a chapa da seção, e a emenda vertical era a borda da foto. Quem escurece o lado do texto agora é só o véu |
| "O papel rasgado ficou muito feio" | Caminho refeito: ruído de **quatro oitavas** (380/126/43/15px) com entalhes esparsos, em vez do serrilhado de dentes regulares. Duas camadas — sombra desfocada em cima, creme 4,2px abaixo — para o rasgo ter espessura |
| "Na Nossa Origem os textos estão com fundo amarelo, muito feio" | Era a marcação `.pend` de pendência. Virou **fio tracejado** por baixo do parágrafo mais uma nota curta ao pé da tira de atributos. O aviso continua, o bloco amarelo não |
| "Refaça a Nossa Origem, está bugada" · "estica a imagem, encosta no canto direito, mais horizontalizada, diminui a altura" | Seção refeita no PT 4: texto na calha à esquerda, foto **absoluta de `left:50%` a `right:0`**, sangrando também pelo topo. Seção caiu de ~830px para ~640px, e a foto virou uma faixa de 2:1 |
| "A planta 3 sumiu do formulário, põe de volta" | Estava lá o tempo todo, invisível. Ver abaixo |
| "Diminui a altura da seção do formulário" | Recuo de cima de 88 → 64px, `sec-head` mais curto |
| "Faça idêntico aos prints de referência. O mesmo desenho." | Os **seis ícones** foram redesenhados em SVG a partir dos prints 1 e 2 |

### Os ícones, e o que foi copiado de verdade

**PRINT 1** (tira do hero) — grão de café duplo com o vinco vazado por máscara,
montanha de massa cheia com as duas calotas de neve vazadas por `fill-rule:evenodd`
no mesmo caminho (é isso que dá o fio em volta da neve), e roseta de fio com fita.
**PRINT 2** (atributos da Origem) — muda, sol e planta, todos em folha cheia com a
nervura vazada por máscara, sobre as mesmas três linhas de terra em traço fino.

⚠️ **A cor não foi copiada, e não podia ser.** No print os ícones são verde escuro
sobre creme. Na tira do hero o fundo é foto escurecida, onde verde escuro
desaparece: lá eles vão em dourado. Na Origem, que é creme, ficaram no verde do
print. **O desenho é o mesmo; o par de contraste é o do lugar onde ele mora.**

### 🔴 Por que a planta 3 tinha sumido (e não deu erro nenhum)

Duas coisas somadas. O arquivo era **opaco**, e dependia de uma `mask-image` radial
para se dissolver no fundo. A máscara é definida em **porcentagem da caixa**, e o
galho mora no canto de baixo à esquerda da arte — com `left:-130px`, o centro da
máscara caiu na parte vazia do desenho e o galho já estava fora da tela. Resultado:
um retângulo transparente, sem nada no console.

A correção não foi mexer na máscara: o **fundo chapado virou alfa de verdade**
(`alfa = 1 - min(pixel/fundo)`, cor por desmultiplicação — mesmo tratamento das
plantas 1 e 2, conferido contra o original com erro médio de 1,9/255). Sem máscara,
o ornamento pode ir a qualquer lugar. O alfa levou reforço de 1,65× porque o
desenho original é claro demais para ler ao lado da planta 1.
Arquivo em `site-fontes/planta-3-alpha.png`; o WebP do site é 740px, q70/aq70.

### O detector cobrou de novo a mesma regra, e estava certo

Tirar o recuo de cima da seção e passar para a coluna de texto acusou
`cramped-padding` na "Nossa origem" — **exatamente o mesmo achado de 05/08**. A
saída é a que já estava escrita: o recuo fica na seção, e a foto sai dele com
deslocamento negativo do mesmo tamanho (`top:-62px`). Só para cima: para baixo ela
invadiria a tira de atributos.

### 🔴 Continua em aberto, e piorou de escala

O rótulo na arte do hero é uma **reconstrução do modelo**, não o rótulo real: lê
"QUALIDADE PREMIUM DA SERRA DE BREJÕES" e "embalado com carinho e dedicação
especial". Com a foto agora cobrindo a largura inteira, **em tela de 1920 esse
rótulo cresce ~33% e fica legível**. É superlativo mais origem não confirmada,
grande, na primeira dobra. Antes ficava pequeno porque a foto era ajustada pela
altura. **Não é bug de layout, é o arquivo:** só se resolve com uma arte de hero que
use o rótulo verdadeiro do Nelson. Levar para o Marcelo.

**Verificado em 06/08:** detector `exit 0`, conferido contra um arquivo-controle que
devolveu **5 achados** (a ferramenta rodou mesmo). `scrollWidth == clientWidth` em
1920, 1440, 900 e 390 — sem overflow horizontal. Render em 1920, 1440 e 390.
Modo limpo conferido: fio tracejado e nota de pendência somem. Pasta em **800 KB**.

## 🎞️ Terceira rodada do Marcelo (03/08/2026) — logo centralizada, foto no hero, motion

| Pedido | O que foi feito |
|---|---|
| Logo centralizada no topo | Cabeçalho no formato da referência "Hot Coffee": emblema + nome no centro, **dois links de cada lado**. Os 4 links continuam existindo uma vez só, divididos em dois `<nav>` com `aria-label` próprio: nada duplicado para o mobile. No celular vira hambúrguer à esquerda + logo no centro, e os dois nav descem **no fluxo** quando abre |
| Fundo do hero | **Grãos torrados** (escolha dele entre as duas opções). `assets/hero-graos.webp`, 33 KB, gerada no Higgsfield. Véu branco em gradiente vertical segura 95% de cobertura na faixa do título e abre até zero embaixo, onde só há grão |
| Sobreposição errada na seção 1 | Ver abaixo, virou regra |
| Motion na seção 1 | Reveal no scroll (opacity + translateY, `IntersectionObserver`) e **parallax entre as duas fotos** conforme a página rola. **Grão voando não entrou**, e o porquê está abaixo |
| "Não sei se o card ficou bom sozinho" | O rótulo ganhou companhia: a seção virou duas colunas, com o bloco **"Para quem é esse café"** à direita. É o `para quem é` do `00-anatomia.md`, em coluna única e curto — resolve o vazio e recupera o que tinha sumido com a antiga seção 2 |

**A pergunta do fundo do hero, e por que ela importava.** Dos dois prints que ele
mandou, o Wake Up Coffee tem **colheita em lavoura em tela cheia**. Isso é o que o
projeto não pode: a família compra o grão de produtores, e já descartamos uma foto
de hero por esse motivo em 30/07. Ofereci grãos torrados (o que eles de fato fazem)
ou close botânico sem lavoura, e ele escolheu os grãos torrados. **Regra que fica:
o que impede a foto de cafezal é a cena de produção, não o café na imagem.** Cereja
e folha soltas como recorte continuam valendo; terreiro, pé de café e gente
colhendo, não.

**Motion: por que não entrou grão voando.** Ele perguntou se ficaria legal. Partícula
atravessando a tela é decoração pura, e a versão que funciona no celular custa caro.
O que entrou faz o mesmo serviço com função: o conteúdo entra na ordem de leitura e
as duas fotos correm em velocidades diferentes, que é a mesma sensação de
profundidade do parallax do hero que ele já tinha gostado. Só `transform` e
`opacity`, e desligado inteiro em `prefers-reduced-motion`.

### 🔴 Duas armadilhas de CSS que custaram render (não desfazer)

1. **`margin:0 auto` num grid item mata o stretch.** A largura vira `auto`, e como as
   duas fotos da seção 1 são `position:absolute` não sobra nada para medir: largura
   zero, e o `aspect-ratio` devolve **altura zero**. As fotos sumiam e só os rótulos
   "Imagem provisória" ficavam boiando — e **só em 900px**, porque nos outros
   breakpoints a regra não valia. Correto: `width:min(100%,620px);margin:0 auto`
2. **`min-height` fixo não serve para sobreposição.** Filho absoluto não empurra o
   pai, então o valor que fecha num breakpoint vaza por cima da seção seguinte nos
   outros. A altura agora sai da largura: `aspect-ratio:1/.78`, derivado da
   geometria (grande `.74w` → `.555w` de altura, pequena → `.345w`, sobreposição
   `.12w`)

**Também nesta rodada:** o botão secundário era transparente e sumia sobre os grãos
do hero (virou fundo sólido); `.rot-lista` caiu de 3 para 2 colunas, porque ao lado
do texto a caixa estreitou e metade dos atributos quebrava em duas linhas;
`scroll-margin-top` subiu para 130px por causa do cabeçalho mais alto.

**Verificado em 03/08:** detector `exit 0`. Render em 1440, 1100, 900 e 560 px com
`--force-prefers-reduced-motion`. Pasta em **716 KB**.

## ✂️ Revisão da home pedida pelo Marcelo (03/08/2026, depois da versão clara)

Segunda rodada de retorno, já em cima da versão clara. O que ele pediu e como foi
resolvido:

| Pedido | O que foi feito |
|---|---|
| Tags de diferencial "com cara de IA" | Viraram a seção **ficha/rótulo** (`.rot`): uma caixa só, no formato do rótulo do pacote, com o mesmo conteúdo. A nuvem de pílulas virou linha em `90-antipadroes.md` |
| Tirar a logo com o nome girando ao redor | O miolo do selo era o PNG do emblema. Agora é um **grão de café em traço** desenhado em SVG, igual à referência `imagens/Logo Giratória.png` |
| Texto do anel mais centralizado entre as linhas | Faixa de r=54 a r=78 (meio em 66), linha de base do texto em r=61, corpo 14px. Antes o texto corria colado no fio de fora |
| Título "A gente não planta. A gente escolhe." | Virou **"Café puro, torrado à mão no interior da Bahia."** Motivo em `90-antipadroes.md`, seção Conteúdo |
| Wallpaper do hero, muitos elementos, elementos repetidos | Saiu o `radial-gradient` de 1100×520; ficou uma passagem linear para a cor da seção seguinte. Cinco elementos flutuantes viraram **três, um de cada tipo** (a folha aparecia 3× só no hero, e ainda reaparecia em "Sobre" e no "dor"). O parallax de mouse ficou |
| Seção 1: texto sem dizer que "apenas escolhem" | Reescrita. Fala do lugar e do beneficiamento inteiro (seleção, secagem, pilão, torra, moagem). **Não afirma plantio em lugar nenhum** — a restrição continua respeitada, só saiu do texto |
| Seção 1: título centralizado no topo, sem eyebrow | `sec-head` centralizado, `eyebrow` "Sobre o Grão da Serra" removido |
| Seção 1: mais uma imagem, quase em cima da outra | `hero-escolha` (76%) + `paisagem-serra` (52%) encavaladas, as duas com rótulo "Imagem provisória" |
| Tirar a seção 2 ("Para quem vende café todo dia") | Removida, junto com o bloco `.dor` |
| Seção 3: tirar os assets "etapa" e deixar 1 imagem por etapa | `.selo-il` (ilustração em traço dourado) e a segunda foto saíram. Uma foto por etapa, em `aspect-ratio:4/3` para as quatro ficarem do mesmo tamanho |
| Tirar a seção "Quem faz" | Removida |

**Efeito colateral a levar pro Marcelo:** com a seção 2 fora, o site perdeu o único
bloco que dizia **para quem** o café serve (padaria, mercadinho, cafeteria,
escritório) — que num negócio B2B é o bloco de maior impacto do
`00-anatomia.md`. Hoje isso sobrevive só no campo "Você é" do formulário e numa
pergunta do FAQ. O CTA "Quero revender" continua no hero, mas agora aponta para o
formulário. Se ele quiser a revenda de volta, o caminho é um bloco novo e mais
curto, não a volta da lista antiga.

**Também corrigido de passagem** (não foi pedido, mas estava errado):
- `main[id],section[id]{scroll-margin-top:100px}`. O cabeçalho é sticky e cobria o
  título de todo link de âncora. É o antipadrão que o `90-antipadroes.md` descreve
  como "só aparece olhando"
- O fundo do cabeçalho era `rgba(247,241,230,.92)`, o creme da versão anterior, e
  virava uma faixa bege visível sobre o hero branco. Agora é branco
- `--t-hero` era `clamp(2.6rem, 6.4vw, 5.2rem)`: a 1440px dava 92px, quebrava o h1
  em três linhas e empurrava os botões para fora da dobra. Agora
  `clamp(2.35rem, 4.5vw, 3.85rem)`
- Cinco WebP que ficaram sem uso (`etapa-0*`, `folhas`) foram movidos para
  `site-fontes/`. A pasta que vai ao ar caiu de 748 KB para **672 KB**

**Verificado em 03/08:** detector `exit 0` (conferido contra um arquivo-controle,
que devolveu 11 achados e `exit 2`, para garantir que a ferramenta rodou mesmo).
Render em headless a 1440, 760 e 520 px: hero cabe na dobra, sem overflow
horizontal, hambúrguer aparece.

## 🔄 Site refeito CLARO (03/08/2026)

Retorno do Marcelo sobre a versão escura: *"não gostei do design geral, pedi uma
pegada natureza/natural, não vi nada de verde, tá muito feio e genérico"*.
A versão escura ficou em `Backup 1/index-escuro.html` e `site-escuro.css`.

**O que mudou, e por quê:**

- **Fundo claro.** As três referências que ele mandou (`imagens/Ideia de Home *.png`)
  são todas claras e arejadas. A versão escura era o oposto do pedido
- **O verde virou acento de verdade:** `#5F7346` dá **4,64:1** sobre fundo claro e
  passa como texto. No fundo escuro ele tinha 2:1 e sumia — por isso a versão
  escura "não tinha verde nenhum". A cor não estava errada, o fundo estava
- **Elementos recortados flutuando** (cereja, folha) com blur e parallax de mouse,
  copiando a "Ideia de Home 3". Gerados no Higgsfield em fundo branco e recortados
  por luminância com alpha proporcional na borda
- **Selo giratório** em SVG (`textPath` + `@keyframes`), da referência
  "Logo Giratória" do Maison Deuza
- **Seção de tags** com os diferenciais, pedida por ele
- **Processo no layout dos prints** "Torrado à mão": texto de um lado, imagens
  deslocadas do outro, **alternando o lado** a cada etapa
- **Seção "Sobre"** com ênfase no interior, também pedida por ele
- **Formulário que monta o pedido e abre o WhatsApp preenchido.** Sem servidor, e o
  texto de ajuda diz isso ao usuário (regra do `50-copy-de-interface.md`: formulário
  sem servidor não finge que enviou)

**Estilo de referência:** "Organic Biophilic", da skill `ui-ux-pro-max` — curvas
orgânicas, raio 16-24px, layout espaçoso. ⚠️ **Só o vocabulário formal foi usado.**
As cores que ela sugeriu (`#15803D`, `#EC4899`) foram descartadas: a marca do
cliente manda.

### 🔴 Três achados do detector que viraram regra

1. **`cream-palette`**: o fundo `#F7F1E6` que eu tinha escolhido foi acusado de ser
   *"o bege quente que toda IA escolhe por reflexo"*. Estava certo: **a cor não vinha
   da paleta do cliente, eu inventei**. Hoje o fundo é branco puro e a superfície
   quente é `#FBEEDC`, derivada do `#EFC294` **da paleta oficial**
2. **`clipped-overflow-container`**: `overflow-x:hidden` no `body` cortando filho
   posicionado. Quem contém os elementos soltos é o `.hero`, não o body
3. **`wide-tracking`**: o detector acusa a partir de **0.05em**, inclusive. Ficou
   em 0.04em no selo

⚠️ **Alegação recusada:** o Marcelo pediu a tag *"rico em óleos essenciais e
antioxidantes"*. **Não entrou**: é alegação funcional de alimento, a mesma coisa que
foi reprovada no concorrente que dizia "ideal para gestantes". No lugar entraram
**aroma intenso** e **sabor encorpado**, que são sensoriais e não prometem efeito.

## Estado do site (30/07/2026, versão escura — histórico)

`site/index.html` + `site/assets/site.css`. **One-page, 8 seções, escrito.**

- ✅ Detector do impeccable **zerado** (`exit 0`), depois de 35 achados corrigidos
- ✅ Peso da pasta: **102 KB**, muito abaixo da meta de 1 MB
- ✅ Favicon 32 e 180, logo do cabeçalho recortada (o PNG original tinha o emblema
  ocupando só 510×622 de 1024×1024, e ficava quase invisível em 46px)
- ✅ Renderizado e conferido em headless: hero cabe na dobra em 1440×900
- ⚠️ `noindex` ligado. **Retirar no dia da publicação, e não antes**
- 🔴 **A arte-fonte fica em `site-fontes/`, fora da pasta que vai ao ar.** O PNG de
  1024px sozinho valia 1,5 MB, quinze vezes o site inteiro

**Decisões de CSS que não devem ser desfeitas sem motivo:**

- `--secao:#54321F` é um **degrau criado**, não é da paleta oficial. Existe porque
  o `#764D36` da paleta reprova como fundo de texto (creme 4,44:1). O `#764D36`
  virou `--borda`, sem texto por cima
- **Source Sans 3, não Inter.** O detector marca Inter como fonte saturada
- `.pend` **sem** `border-radius`: borda de acento num lado + canto arredondado é
  o antipadrão `border-accent-on-rounded`
- Sem barra lateral colorida em destaque (`side-tab`)
- `padding` em valor literal + media query, **nunca `clamp()`**: o detector não
  resolve `clamp()` em padding e acusa `cramped-padding` falso
- O botão de alternar pendências fica **fora** da faixa `.aviso-demo`, senão some
  junto com ela e não há como voltar

**Seção deixada fora de propósito:** "De onde vem" (a origem do grão). Só entra
depois de o cliente confirmar que o café vem de produtores da região Serrana.

### 🎨 Imagem gerada: a linha que separa o que pode do que não pode

As quatro etapas do processo usam **ilustração em traço dourado gerada por IA**
(Higgsfield, `nano_banana_pro`, 2 créditos cada, 30/07/2026). Isso é permitido, e a
distinção que autoriza é simples:

- ✅ **Ilustração pode.** Desenho em traço não finge ser registro. Ninguém olha um
  pilão desenhado a linha e conclui que é a foto do pilão do pai dele. E o traço
  dourado é o mesmo vocabulário da logo, então a página fica mais coesa
- 🔴 **Foto documental gerada por IA não pode.** Cafezal, terreiro ou torra em
  estilo fotográfico seriam representados como registro da operação da família, o
  que é falsear origem num produto alimentício. É o caso do teardown da Fazenda São
  Gabriel (`referencias/fazenda-sao-gabriel-atacado.md`), onde a foto de pousada
  inventada aparecia num site que vende "origem verdadeira"

**Regra prática:** se a imagem responde "como é o processo", ilustração resolve. Se
ela responde "é assim que ELES fazem", só foto real serve.

### Atualização de 30/07: fotos realistas entraram, marcadas como provisórias

O Marcelo pediu imagens realistas, paisagem e folhas, com as ilustrações rebaixadas
a fundo discreto. Feito, e o conflito com integridade foi resolvido pela
**marcação**, não pela recusa:

- Toda foto gerada carrega um rótulo **"Imagem provisória"** visível, na classe
  `.fig .rotulo`, que some no modo limpo junto com os outros `.pend`
- As ilustrações viraram **marca-d'água a 16% de opacidade** ao lado do número da
  etapa (`.selo-ilustra`)
- Quando as fotos do Nelson chegarem, é troca de arquivo e remoção do rótulo

🔴 **O caso que quase passou:** a primeira foto de hero veio com **um cafezal ao
fundo e alguém colhendo**, ou seja, exatamente a afirmação que o projeto inteiro
evita. Foi descartada e regerada com `no coffee trees, no plantation, no field,
no crops, indoors only` no prompt.

**A lição:** o modelo preenche o contexto óbvio do assunto. Café puxa cafezal. Em
cliente cuja história depende de **não** fazer parte do processo, o prompt precisa
proibir explicitamente, e **cada imagem tem que ser olhada uma a uma** antes de
entrar. A paisagem e a secagem passaram porque não têm lavoura; o hero não passou.

**Arquivos:** WebP em `site/assets/etapa-0*.webp` (39 KB no total), com os PNG de
1k guardados em `site-fontes/`. Prompt e estilo ficam em `marca.md`.

## Onde salvar o que

- Briefing e contexto: `briefing.md`
- Identidade visual do cliente: `marca.md`
- Roteiro de reunião: `roteiro-call-<data>.md`
- Entregas: `site/`, `google-meu-negocio/`

## Contexto que herda da raiz

Herda tom de voz, processo e contexto da agência de `_memoria/` e `identidade/`.
Ao produzir peça PARA o Grão da Serra, a marca é a do cliente (`marca.md` desta
pasta), **não** a da agência.

Vale integralmente aqui:
- `_memoria/integridade.md` — nada inventado, placeholder marcado
- `_memoria/design/` — leitura obrigatória antes da primeira linha de HTML, com o
  passe duplo do `00-anatomia.md`
- `_memoria/design/99-checklist.md` mais o detector, antes de entregar:
  `npx --yes impeccable@3.4.0 detect "clientes/grao-da-serra/site"`

## Específico desse projeto

**Não é setor regulado por conselho.** Não existe aqui a trava de compliance que
existe em Giovanni (CFO) e Aion (CFP). Mas existe regra de alimento: sem alegação
de saúde ou funcional, e alegação de composição é do produtor. Detalhe em
`marca.md`.

**A marca visual do cliente já existe e é consistente** (logo em emblema, dourado
sobre marrom escuro, tipografia serifada). O site usa a marca dele. Não propor
rebranding sem ser pedido, e nunca como puxadinho de um trabalho de graça.

**⚠️ O risco de invenção deste cliente é o jargão de café.** Nota de degustação,
pontuação SCA, altitude, variedade, nome de fazenda e região só entram se o
cliente tiver dito. É o caso clássico de invenção por motivo estético do
`integridade.md`, e aqui vira alegação falsa sobre alimento. Lista completa do
que é proibido escrever sem fonte está em `marca.md`.

**O nome tem homônimos em café, e o `.com.br` está tomado** por uma operação de
1995 da Serra da Mantiqueira/SP. Consequência prática: **SEO pelo nome da marca é
briga perdida**. A estratégia é local (Salvador, Google Meu Negócio, "café
artesanal Salvador") mais ancoragem da marca na Bahia, que é o eixo que o próprio
cliente já usa ("orgulho da Bahia"). Ver `briefing.md`.

**Registro de marca no INPI não foi verificado e a Horus não dá parecer sobre
isso.** O que cabe é informar o cliente e recomendar a busca.

**Grafia:** "Café Grão da Serra". Handle do Instagram é `@graodaserra__`, com
**dois** underscores.

**🔴 NÃO aplicar estilo do Tier 2 do `identidade/catalogo-estilos.md`** (decisão do
Marcelo, 30/07/2026: *"faça de acordo com o que o cliente quer, não vamos inventar,
lembre-se dos tons naturais e paleta de cores"*).

É a regra 1 do próprio catálogo: cliente com marca definida usa a marca dele. A
`marca.md` já fixa paleta oficial de 9 cores, logo, tom de voz e a direção de tons
naturais pedida pelo cliente. **Não sobrou vazio para um estilo preencher.**

O que continua valendo: `taste-skill` (ferramenta anti-template, não sobrescreve
cor nem fonte), `output-skill` se o HTML crescer, e `/verificar` mais o detector do
impeccable antes de entregar.

Toda cor sai da tabela de papéis da `marca.md`. Nada de cor nova, nada de gradiente
de acento, nada de "melhorar" a paleta.

**O negócio é B2B e o dono opera sozinho.** O site institucional fala com **quem
compra para revender** (padaria, mercadinho, cafeteria, escritório), e não só com
quem toma café. Quem responde o WhatsApp é ele mesmo, então qualquer CTA cai no
colo de uma pessoa só: não desenhar fluxo que pressupõe equipe.

**🔴 A família NÃO tem lavoura.** O pai **compra o grão maduro de produtores**,
seleciona, e faz pilagem, secagem, torra e moagem. Ele **não planta e não colhe**.
Está proibido escrever "nossa lavoura", "nossa fazenda", "cafezal", "produzimos",
"do pé à xícara". O diferencial verdadeiro é **a escolha do grão e o
beneficiamento artesanal**: "a gente não planta, a gente escolhe". Esse dado
chegou errado de segunda mão e foi corrigido pelo próprio cliente; a descrição do
Google Meu Negócio já estava escrita com a versão falsa. Ver `briefing.md`.

**A origem é geográfica e é o ativo de marca:** o MEI dele fica no **Distrito
Serrana, Brejões/BA**. "Grão da Serra" é o lugar onde ele está, e a região
"Serrana de Itiruçu/Brejões" é área cafeeira reconhecida. ⚠️ Mas **ainda não foi
confirmado que o grão que o pai compra vem de lá**. Enquanto isso, não usar a
região, a altitude nem a tradição cafeeira de Brejões como credencial do produto.

**Direção visual pedida por ele:** manter o marrom e trazer interior, verde, mato.
O verde entra como acento e, principalmente, **por fotografia real do
beneficiamento** (pilão, secagem ao sol, torra, grão cru ao lado do torrado, mãos
selecionando), **não** por foto de cafezal, que não é dele. Detalhe em `marca.md`.

**Escopo do grátis ainda não está fechado** (páginas, rodadas de ajuste, prazo) e
a autorização de uso como portfólio ainda não foi obtida. Enquanto isso estiver
em aberto, não iniciar produção de HTML: o risco não é técnico, é de retrabalho
infinito.
