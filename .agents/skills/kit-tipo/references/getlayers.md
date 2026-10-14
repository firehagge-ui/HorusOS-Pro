# GetLayers e o cannonball — quem faz o quê

Levantado em **agosto de 2026** lendo `getlayers_start`, que é o ponto de entrada
obrigatório do MCP e devolve o guia inteiro.

GetLayers **não concorre** com o acervo. Ele tem três coisas que o cannonball tem
**zero**, e o cannonball tem uma que o GetLayers não tem: julgamento sobre o seu
material.

---

## O catálogo

| Tipo | GetLayers | cannonball | Leitura |
|---|---|---|---|
| **composições** (esqueleto de layout) | ~109 | **nenhuma, por natureza** | a maior lacuna que ele fecha |
| **backgrounds de vídeo** | ~78 | **nenhum, por natureza** | segunda maior |
| scenes 3D | ~55 | família `efeito` | complementar |
| templates | ~37 | família `template` | complementar |
| styles / design systems | ~38 | família `design-system` | costuma ganhar o acervo |
| palettes | ~39 | dentro dos design systems | complementar |
| fonts curadas | ~15 | por peça | complementar |
| sections | ~21 | famílias `ui` e `animacao` | costuma ganhar o acervo |
| prompts de página | 0 | família `prompt` | **só o acervo** |
| armadilhas registradas | 0 | o que você registrou | **só o acervo** |

Compare com o seu antes de decidir: `python scripts/perfil.py`. As duas primeiras
linhas são estruturais — um acervo de código não guarda esqueleto abstrato de layout
nem vídeo, então elas valem por mais tempo que as outras.

---

## As cinco palavras

O guia é rígido quanto ao vocabulário, e vale respeitar porque os nomes aparecem
nas ferramentas:

- **Style** — conjunto de tokens + tipografia + tratamento. A unidade de coerência.
- **Section** — uma tela interativa de propósito único (carrossel, FAQ).
- **Scene** — cena 3D, embutível, tingida por parâmetro.
- **Background** — vídeo. Atômico.
- **Template** — página inteira, com as cenas já embutidas e afinadas.

Não diga "componente", "bloco" ou "tema".

---

## As duas ideias que valem mais que o catálogo

### 1. Composição é o antídoto do layout genérico

Uma **composição** é o esqueleto: onde ficam headline, mídia, modelo, botões e
navegação; que tamanho têm entre si; quanto de ar. Sem fonte, sem cor, sem
conteúdo. Vem com **wireframe em ASCII** e um `pairsWith` que diz o que combina
depois dela na página.

São 28 só para hero. O acervo não tem nada disso — ele tem peças prontas, mas
nenhum vocabulário abstrato de arranjo. É por isso que montar uma seção nova
sempre tende à pilha centralizada.

**`getlayers_compositions` é gratuito.** Consulte antes de desenhar qualquer
seção, mesmo quando todas as peças vierem do acervo.

### 2. A coerência vem do Style, não da origem

Duas seções de origens diferentes só brigam na camada de **pele**. Composição e
movimento são portáveis.

Então página coerente **não** se faz usando peças da mesma fonte. Se faz
escolhendo **um Style, cedo, e pintando tudo com ele na montagem**. É a mesma
lógica que o acervo já usa ao cruzar template (estrutura) com design system
(identidade) — e é a confirmação de que aquele eixo estava certo.

Cada peça declara um `contract` de `mutable` / `preserve`:

| Camada | Permissão |
|---|---|
| **Composição** | sua, quase sempre |
| **Movimento** | **não é sua.** Você chama, não reescreve |
| **Pele** (token, cor, tipo, espaço, texto) | sempre sua |

---

## Cor em cena 3D é parâmetro, nunca código

Toda Scene expõe 20–50 knobs em `CONFIG`, cores em `#rrggbb`. O `materialize`
devolve um mapa `tint` que resolve a paleta do Style nas chaves daquela cena.

**Aplique o tint no CONFIG. Nunca edite o shader para recolorir** — o resultado é
lixo. Se a cor não está no CONFIG, ela não existe; diga isso em vez de caçar no
GLSL.

Parâmetros com `structural: true` reconstroem geometria e quase sempre pedem
reload.

---

## Cota — o que é livre e o que não é

| Livre | Com cota |
|---|---|
| `getlayers_start` | **`getlayers_materialize`** (limitado) |
| `getlayers_search` / `browse` / `explore` | `build.downloadProject` (**3 templates/dia**) |
| `getlayers_compositions` | |
| `getlayers_palettes` / `fonts` | |
| `getlayers_source` (arquivo a arquivo) | |

**Navegue à vontade, materialize com intenção.** Nunca materialize
especulativamente para "dar uma olhada" — para isso existem os previews.

Se você não sabe em que stack o usuário está, **omita `target`**: num template
Next isso devolve as duas opções para perguntar, em vez do entregável errado, e
**não gasta cota**. Adivinhar gasta uma chamada inteira.

---

## A armadilha que apaga a página

**Mídia nunca vem no contexto — você baixa.** Um template cujo `.glb` ou `.mp4`
não foi baixado **renderiza em branco**, sem erro.

- Se vier `build.downloadProject`: é um zip com o projeto inteiro **já com a
  mídia**. Ignore `mediaAssets` nesse caminho.
- Se vier `build.mediaAssets`: baixe **antes de editar qualquer coisa**, cada um
  no caminho `file` exato, e **confira se o arquivo tem `bytes` de tamanho** — um
  link expirado grava uma página de erro com nome `.mp4`, e o único sintoma
  aparece depois, como canvas vazio. Os links duram ~1h.

---

## `getlayers.json` — por que ele existe

Arquivo na raiz do projeto que grava o que já foi escolhido: `brief` nos cinco
eixos, `styleId`, `tokens` resolvidos, `activeTemplateId` e a lista `placed` em
ordem de página.

Leia antes de cada seção; escreva depois de cada seção.

Não é burocracia: sem isso você constrói a seção 1 num estilo e derrapa até a 4,
porque esqueceu o que escolheu. É o mesmo problema que as **receitas** do acervo
resolvem — só que durante a montagem, não depois dela.

---

## A choreografia de revelação

`getlayers_start` devolve um documento `revealChoreography` que é **o achado
técnico mais denso do MCP**: loader imersivo → gate → revelação escalonada →
entrada da cena, com números reais colhidos de 11 templates.

Três regras de lá que valem para **qualquer** site seu, com ou sem GetLayers:

1. **Vire o gate no INÍCIO da saída da cortina, não no fim.** O conteúdo tem que
   animar *através* da cortina que sai. Os dois templates que esperavam o
   repouso foram julgados piores por quem os leu.
2. **Monte tudo já escondido, não segure a pintura.** Montar tarde faz o
   scroll nascer de um documento de altura zero e joga cena dirigida por scroll
   direto no final. Além disso, crawler e leitor de tela veem o conteúdo.
3. **Cena 3D nunca entra em fade.** Dá entrada física: brilho total no quadro 0
   decaindo, ou voo de câmera com um único escalar suavizado.

E uma que é bug conhecido deles, não copie: `prefers-reduced-motion` **não
alcança** loop de shader. A flag global da biblioteca de animação não cobre
canvas — desligue você mesmo.

---

## Como isso entra no fluxo do cannonball

A ordem de preferência do acervo continua: **receita → template → código →
prompt**. O GetLayers entra em três pontos, e só neles:

1. **Sempre, ao desenhar seção nova** — `getlayers_compositions` por papel, antes
   de escolher a peça. Gratuito, e resolve o pior vício de montagem.
2. **Quando o acervo não tem** — background de vídeo e cena 3D original via
   `getlayers_scene_lab`.
3. **Quando o cliente quer algo que o acervo não cobre** — os templates dele somam
   aos seus. Confira a lacuna no `perfil.py` antes, não depois.

Fora isso, **o acervo vem primeiro**: é seu, é julgado (`quando_usar` /
`nao_usar_quando`), não tem cota, e carrega as armadilhas que custaram caro.

### O conflito de stack, de novo

O ambiente nativo do GetLayers é o
[`next16-claude-starter`](https://github.com/textura-agency/next16-claude-starter)
. Ele anima com **`@react-spring/web` + `spring-text-engine`**.

A animação de acervo costuma ser **GSAP ou Framer Motion** — confira a sua com
`buscar.py --listar tag`. Misturar carrega dois motores no bundle.

Decida no começo do projeto, não no meio:

- **Projeto GetLayers** → use o starter e as peças dele; do acervo, traga só
  design system, prompt e referência visual.
- **Projeto do acervo** → Next + GSAP + Lenis como sempre; do GetLayers, traga
  composição (que é abstrata, não tem motor), paleta, fonte e background de
  vídeo — todos neutros de biblioteca.

Cena e Section do GetLayers são HTML único autocontido, então atravessam. O que
não atravessa de graça é o motor de animação.

---

## Fonte

Tudo acima saiu de `getlayers_start`, que o próprio MCP manda chamar primeiro e
devolve guia, regras de combinação, `revealChoreography` e taxonomia. Chame de
novo em vez de confiar nesta página quando a diferença importar — o catálogo
cresce.
