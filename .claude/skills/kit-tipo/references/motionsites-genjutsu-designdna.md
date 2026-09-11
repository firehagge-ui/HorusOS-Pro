# Motion Sites, genjutsu e design-dna — o que cada um acrescenta

Levantado em **agosto de 2026**. Três coisas diferentes: um MCP, um plugin e uma
skill. Nenhuma substitui o acervo; cada uma fecha um buraco distinto.

---

## Motion Sites — o maior catálogo de prompt de página

É a fonte mais provável dos prompts que você já tem: quem coleciona prompt de
landing page acaba com prompts do Motion Sites, muitas vezes com o id batendo
(`build-unit`, `breathstone`, `agent-crew`, `sentinel`, `avant-studio`…) ou
encurtado (`aug-sight` ↔ `augmented-sight`, `trip-planner` ↔ `ai-trip-planner`).

**Boa parte do catálogo é `premium` — e se o prompt já está no seu acervo, você já
tem o texto completo.** Confira antes de gastar cota:

```bash
python scripts/buscar.py "<título>" --familia prompt
```

### A regra de cota que organiza tudo

| Ferramenta | Custo |
|---|---|
| `list_prompts` | **livre** — navega o catálogo, metadados |
| `search_prompts` | **livre** — busca por texto livre, ranqueia pela descrição de estilo |
| `get_related_prompts` | **livre** — acha parecidos com um id |
| `get_prompt` | **conta rígida: 3 prompts por conta sem plano** |

> **Nunca gaste `get_prompt` num prompt que já está no acervo.** Você já é dono
> do texto — está em `acervo/prompts/<id>/prompt.md`. São 3 aberturas na vida da
> conta sem plano; queimar uma em algo que você já tem é desperdício puro.

Antes de qualquer `get_prompt`, confira:

```bash
python "${SKILL_DIR}/scripts/buscar.py" "<título>" --familia prompt
```

### O que ele acrescenta de verdade

**1. Preview visual — a lacuna mais antiga do acervo.**
**O acervo guarda texto e código, não imagem.** O `preview_url` vem em toda resposta de
`list_prompts` e `search_prompts`, de graça. Um `search_prompts` pelo título do
item do acervo devolve a imagem daquele prompt.

Isso muda a conversa com cliente: em vez de ler `USAR: clínica odontológica com
público 30-50`, você mostra.

**2. `get_related_prompts` — expandir a partir do que já deu certo.**
É a ferramenta mais subestimada. Você sabe quais dos seus prompts funcionaram.
Peça os parecidos de um que deu certo e o catálogo inteiro vira extensão do seu
acervo — sem gastar cota.

```
get_related_prompts(id="prisma-landing")   ->  velorah-hero, luxury-botanical,
                                               innovation-landing, synthesis…
```

**3. Descoberta além do que você tem.** O catálogo é muito maior, com categorias que o
acervo não cobre (Game UI, Logistics, Books, Events, Crypto). `search_prompts`
ranqueia pela **descrição de estilo visual**, não por tag — é busca semântica de
verdade.

### Como usar no fluxo

1. **Sempre primeiro no acervo.** É seu, tem julgamento (`quando_usar` /
   `nao_usar_quando`), texto completo e sem cota.
2. **`search_prompts` para o preview** do item que você escolheu no acervo.
3. **`get_related_prompts`** quando o acervo tem algo perto mas não exato.
4. **`get_prompt`** só quando o prompt **não existe no acervo** e você decidiu
   usá-lo. Depois disso, **ingira** — senão você gastou uma das 3 e não guardou:

```bash
python "${SKILL_DIR}/scripts/ingerir.py" <arquivo> --analisar
```

---

## genjutsu — motion craft, multi-plataforma

`github.com/AThevon/genjutsu` (MIT). É um **marketplace de plugin do Claude
Code**, como o pixijs-skills — instala ao lado:

```bash
claude plugin marketplace add AThevon/genjutsu
```

Duas skills e quinze módulos:

- **`/genjutsu:cast`** — pega uma UI que existe e acrescenta movimento. Detecta a
  stack sozinho, propõe uma *tese de interação* antes de escrever código, e faz
  auditoria na saída (reduced-motion, exit animations, hitches).
- **`/genjutsu:paint`** — constrói o universo visual do zero, com sessão de
  direção criativa obrigatória e um `MASTER.md` de design system persistente.

Módulos: `gsap`, `framer-motion`, `threejs-r3f`, `css-native`,
`canvas-generative`, `motion-principles`, `design-audit`, `ui-ux-pro-max`, mais
Compose (Android) e SwiftUI (Apple).

### Onde ele encosta no cannonball, e onde não

| | cannonball | genjutsu |
|---|---|---|
| acervo próprio | **o seu** (`perfil.py`) | nenhum |
| julgamento por peça | `quando_usar` / `nao_usar_quando` | — |
| armadilhas registradas | **59** | — |
| craft de movimento | básico | **é o foco** |
| Android e Apple | — | **Compose e SwiftUI** |

**`paint` sobrepõe `kit-montar` + `kit-cor` + `kit-tipo`.** Se você chamar os
dois no mesmo projeto, vai ter duas direções criativas brigando. Escolha um por
projeto:

- **projeto que reaproveita o acervo** → `kit-montar`, e chame `/genjutsu:cast`
  no fim, só para o acabamento de movimento
- **projeto do zero, sem peça do acervo** → `/genjutsu:paint` faz o universo
  visual inteiro

`cast` compõe bem com o cannonball; `paint` compete com ele.

---

## design-dna — extrair identidade de uma referência

`github.com/zanwei/design-dna`. Uma skill só, três dimensões:

1. **design_system** — o que se mede: hex, px, escala em rem
2. **design_style** — o que se sente: mood, composição, voz da marca
3. **visual_effects** — o que não cabe em CSS: WebGL, partícula, shader, scroll

```bash
npx skills add zanwei/design-dna -a claude-code -g -y
```

### Por que ele importa aqui

**O `kit-ingerir` só sabe ingerir arquivo.** Se o cliente manda o link do site
atual dele, ou um print de referência, não há caminho — você lê e descreve na
mão.

design-dna fecha exatamente isso: **referência visual → JSON estruturado**. E o
JSON dele mapeia quase campo a campo no que o acervo já guarda num design
system (paleta, fontes, tema), com uma dimensão a mais que o acervo **não tem**:
`visual_effects`.

O caminho natural:

```
site/print do cliente  ->  design-dna (extrai)  ->  ficha ds-<cliente>
                                                ->  kit-ingerir (guarda)
```

Assim o acervo passa a crescer com a identidade dos **seus** clientes, não só com
design systems extraídos de marcas famosas — que é de onde vem o viés de 51%
neutro-ou-azul medido pela `kit-cor`.

Duas ressalvas ao usar:

- A dimensão `visual_effects` dele é boa e o acervo não tem equivalente. Se
  adotar, acrescente ao `item.json` em vez de jogar fora.
- Ele gera HTML autocontido por padrão. Para o seu fluxo (Next + GSAP + Lenis),
  peça os **tokens**, não a página.

---

## Resumo da divisão

| Preciso de… | Vá para |
|---|---|
| peça pronta, julgada, sem cota | **acervo** (`kit-buscar`) |
| ver como o prompt do acervo fica | **Motion Sites** `search_prompts` (preview) |
| mais prompts parecidos com um que deu certo | **Motion Sites** `get_related_prompts` |
| prompt que não existe no acervo | **Motion Sites** `get_prompt` (3 no total!) → ingerir |
| esqueleto de layout | **GetLayers** `compositions` |
| background de vídeo | **GetLayers** (78, o acervo tem 0) |
| acabamento de movimento | **genjutsu** `/cast` |
| universo visual do zero, sem acervo | **genjutsu** `/paint` |
| virar site/print do cliente em ficha | **design-dna** → `kit-ingerir` |
| otimizar cena 3D | **`kit-otimizar-3d`** |
