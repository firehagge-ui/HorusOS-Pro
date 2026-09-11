---
name: kit-montar
description: >
  Monta um site novo combinando peças já validadas do acervo pessoal do usuário
  — templates, design systems, componentes, animações, menus, prompts e receitas
  — em vez de gerar tudo do zero. Acervo vazio: constrói do zero e oferece
  guardar. Recebe o briefing, decide cor e tipografia antes da identidade,
  **pergunta que tipo de hero o usuário quer** (tipográfico, editorial, vídeo de
  fundo, scroll cinemático, WebGL, carrossel) antes de escrever código, e gera a
  imagem ou o vídeo do hero pelo Higgsfield quando não há material. Escolhe as
  peças, porta de Vite para Next.js quando preciso, resolve pré-requisitos,
  dependências e licença de fonte, e salva a composição como receita. Use quando
  o usuário pedir um site, landing page, hero, menu ou seção nova — "preciso de
  uma landing pra clínica", "monta um site de joalheria", "quero uma hero pra
  imobiliária", "preciso de agendamento no site" — ou invocar /kit-montar. Use
  também quando ele descrever um projeto novo e quiser começar a construir.
allowed-tools: Read Write Edit Glob Grep Bash(python:*) Bash(python3:*)
---

# kit-montar — site novo a partir do acervo

## Antes de qualquer comando: resolva o `SKILL_DIR`

Todo comando abaixo roda um script que viaja junto desta skill, em
`SKILL_DIR/scripts/`. Defina `SKILL_DIR` como o **caminho absoluto da pasta que
contém ESTE SKILL.md que você acabou de ler** — o seu harness informou esse caminho
no resultado da leitura. Funciona em qualquer hospedeiro, sem depender de variável
de ambiente de nenhum agente específico:

```
~/.claude/plugins/cache/cannonball/cannonball/<v>/skills/<nome>/SKILL.md
~/.codex/skills/<nome>/SKILL.md
~/.gemini/skills/<nome>/SKILL.md
~/.agents/skills/<nome>/SKILL.md
```

Em todos, `SKILL_DIR` é a pasta do `SKILL.md`, e `SKILL_DIR/scripts/` está ao lado.

A regra que governa esta skill: **o acervo vem primeiro**. Gerar do zero é o último
recurso, não o primeiro — o que está no acervo já rodou, código novo é aposta.

## 0. Veja o que o acervo tem hoje

O acervo é do usuário e muda a cada ingestão. Antes de qualquer pergunta:

```bash
python "${SKILL_DIR}/scripts/perfil.py"
```

Ele diz quantas peças existem, de que famílias, em que stacks, que setores cobre e
**onde estão as lacunas**. É o que decide se esta conversa é uma montagem a partir do
acervo ou uma construção do zero.

Ele termina com um bloco **POR ONDE SEGUIR** que muda conforme o acervo. Numa
instalação nova ele manda **vincular a pasta** antes de qualquer ingestão — repasse ao
usuário, porque esquecer isso deixa o material dele no lugar errado:

```bash
python "${SKILL_DIR}/scripts/vincular.py" --para "<pasta do usuário>"
```

**Acervo vazio não invalida a skill.** O fluxo continua igual — briefing, cor,
tipografia, hero, plano, construção — só que sem peça para reaproveitar. No fim,
**ofereça guardar** com `/kit-ingerir`: a próxima montagem do mesmo setor já começa
adiantada. É assim que o acervo cresce, e cada peça guardada melhora todas as skills
de uma vez.

## 0.1. Pergunte a stack — sempre, e antes de escolher peça

**A stack decide quais peças são elegíveis** e se haverá conversão. Perguntar depois
de escolher significa refazer o trabalho.

Antes de montar as opções, leia a linha `stacks:` do perfil — ela diz quanto do
acervo cada stack cobre. Ofereça estas opções ao usuário, nesta ordem, com a
cobertura real que o perfil reportou ao lado de cada uma (se o seu agente tiver uma
ferramenta de pergunta de múltipla escolha, use; senão, pergunte em texto):

| Opção | |
|---|---|
| **Next.js + Tailwind + GSAP + Lenis** (recomendada) | o alvo padrão |
| **Next.js + Tailwind + Motion** | quando o projeto já usa `motion` |
| **Vite + React** | protótipo, hero solto, entrega sem SSR |
| **HTML/CSS/JS puro, sem build** | site de uma página, cliente sem infra |

Ofereça também, como pergunta separada e de múltipla escolha, as bibliotecas de efeito:
**Three.js/WebGL**, **Framer Motion**, **Matter.js** (física), **Swiper**,
**Theatre.js** (coreografia de câmera). Confira no perfil quais delas o acervo
realmente cobre antes de recomendar — sugerir biblioteca sem peça é prometer trabalho
do zero disfarçado de reuso.

Antes de recomendar qualquer uma, leia
`${SKILL_DIR}/references/stack-animacao.md`: ele diz o que está vivo no npm
e o que está parado.

**Se a resposta incluir Three.js/WebGL numa stack React, leia também
`${SKILL_DIR}/references/stack-webgl-react.md` antes de escrever qualquer
linha.** Ele cobre React Three Fiber, drei e PixiJS, e traz o conflito que mais
morde nesse cruzamento:

> **`<ScrollControls>` do drei briga com o Lenis.** Os dois querem ser o scroller
> da página. Não dá erro no console — a página fica com dois scrolls de
> comportamento diferente, um suavizado e outro nativo. Quando já existe Lenis,
> **não use ScrollControls**: dirija a cena de `useFrame` lendo o progresso do
> ScrollTrigger.

Outras três de lá que valem repetir aqui:

- **A versão do `@react-three/fiber` é amarrada à do React** — v8 ↔ React 18,
  v9 ↔ React 19. É requisito, não recomendação.
- **`setState` dentro de `useFrame` derruba a página.** Roda a 60 Hz; use `ref`.
- **`<Canvas>` sem `fallback` vira retângulo preto** em máquina corporativa com
  driver velho. Site de cliente roda nessas máquinas.

**Quando a escolha do usuário não aparece no perfil, avise antes de prosseguir, não
depois.** É comum com Astro, anime.js e magnetic.js: nada é nativo, tudo precisa ser
portado à mão, e o efeito equivalente do acervo normalmente está feito em GSAP ou
Motion. A peça ainda serve como referência de técnica — só não cola pronta, e o
usuário precisa saber disso antes de aprovar o plano.

Registre a resposta e **use em toda busca daqui em diante**:

```bash
python "${SKILL_DIR}/scripts/buscar.py" "<consulta>" --stack nextjs
```

Se o usuário já disse a stack no pedido, não pergunte de novo — confirme numa linha
e siga.

## 0.5. Se houver MCP ligado — a ordem, e o que custa

Três fontes externas podem estar disponíveis. **Nenhuma substitui o acervo**, e a
ordem entre elas não é gosto: é o que evita gastar cota e retrabalho.

| Fonte | Livre | Com cota |
|---|---|---|
| **acervo** (o seu) | tudo | — |
| **GetLayers** | `start`, `search`, `browse`, `explore`, `compositions`, `palettes`, `fonts`, `source` | **`materialize`**; `downloadProject` = 3 templates/dia |
| **Motion Sites** | `list_prompts`, `search_prompts`, `get_related_prompts` | **`get_prompt` = 3 no total**, conta sem plano |
| **OriginKit** | `list_components`, `search` | `get_component` gera sob medida |
| **Higgsfield** | `get_cost` (preflight) | **`generate_image`, `generate_video`** — crédito real, dinheiro do usuário |

**O acervo vem primeiro sempre**, e não é lealdade ao que é seu: é que ele carrega
**armadilhas** que custaram projeto real (o `perfil.py` diz quantas). Elas são do
tipo que nenhum catálogo externo tem — "este componente lê *que dia é hoje* durante a
renderização, e num Next com servidor em UTC e visitante em UTC-3 a hidratação quebra
entre 21h e meia-noite". Catálogo externo descreve o que a peça faz; só o seu acervo
sabe onde ela te derrubou.

### A sequência

**1. Stack primeiro (passo 0).** Ela bifurca tudo o que vem depois:

- **projeto do acervo** → Next + GSAP + Lenis. Do GetLayers use só o que é
  **neutro de biblioteca**: composição, paleta, fonte, background de vídeo.
- **projeto GetLayers** → o starter deles, que anima com `react-spring`. Do acervo
  traga só design system, prompt e referência.

Misturar os dois motores de animação no mesmo bundle é o erro caro aqui.

**2. Busque no acervo (passo 2).** Receita → template → código → prompt.

**3. Motion Sites, para ver e para expandir — grátis.**

```
search_prompts(query="<título ou caráter do que você escolheu>")
```

Devolve o `preview_url`. **O acervo guarda texto e código, não imagem**, e mostrar ao
cliente vale mais que ler `USAR: clínica odontológica…`. Se o acervo chegou perto mas
não exato:

```
get_related_prompts(id="<id do prompt que já deu certo>")
```

Você sabe quais dos seus prompts funcionaram — pedir os parecidos de um bom
transforma o catálogo inteiro em extensão do acervo, sem cota.

**4. GetLayers `compositions`, antes de desenhar qualquer seção — grátis.**

```
getlayers_compositions(role="hero")
```

Esqueletos de layout com wireframe ASCII. O acervo tem peça pronta mas
**nenhum vocabulário abstrato de arranjo** — é por isso que seção nova tende à
pilha centralizada. Escolha o esqueleto, depois despeje dentro a identidade e as
peças do acervo.

**5. Só então o que tem cota.** Nesta ordem de prioridade:

- `getlayers_materialize` — quando precisar de **background de vídeo** ou de uma cena
  3D que o acervo não tem
- `get_prompt` — **só se o prompt não existe no acervo**. Confira antes:
  `buscar.py "<título>" --familia prompt`. São 3 na vida da conta sem plano;
  gastar uma no que você já é dono é desperdício puro
- `get_component` do OriginKit — quando quiser o código já na sua stack
- `generate_image` / `generate_video` do **Higgsfield** — **por último e com
  confirmação**, quando o hero escolhido pede mídia e o cliente não tem nenhuma.
  Ver o passo 2.2 e `${SKILL_DIR}/references/higgsfield.md`

**6. O que veio de fora, ingira.** Prompt aberto com uma das 3 cotas e não
guardado é cota queimada duas vezes.

Detalhes que mordem estão em `${SKILL_DIR}/references/getlayers.md` e
`${SKILL_DIR}/references/motionsites-genjutsu-designdna.md` — leia antes
de materializar. O principal: **mídia do GetLayers nunca vem no contexto**, e
template sem o `.glb` baixado renderiza em branco, sem erro.

## 1. Briefing — pergunte o resto junto

Agrupe numa mensagem só, não interrogue em série:

1. **Setor e cliente.** Concreto. "Clínica de estética facial, público 30–50, tom sofisticado."
2. **Escopo.** Só hero? Landing completa? Experiência com scroll?
3. **Tem material?** Vídeo, fotos, logo, fontes da marca. **Isto restringe tudo** —
   boa parte das peças de mais impacto depende de vídeo de fundo, e sem material do
   cliente elas caem. Filtre com `--sem-video` quando ele não tiver.
4. **Claro ou escuro?**
5. **Onde implementar.** Caminho do projeto, e se é projeto novo ou já existente.

Se ele já deu tudo isso no pedido, não pergunte de novo.

### As duas perguntas que ninguém faz, e que decidem o resto

Antes de sair buscando peça, responda estas duas — sozinho, com o que ele já disse.
Não são perguntas para o usuário, são a leitura que você faz do briefing.

**1. Em que estado emocional a pessoa chega?** Quem procura uma clínica está
cauteloso e buscando confiança. Quem rola uma marca de streetwear está relaxado,
navegando. **Se o site não bate com o estado em que ela chega, algo soa errado
antes de ela ler qualquer coisa** — e nenhuma peça bonita do acervo conserta isso.

**2. Que emoção ela leva embora?** Toda escolha precisa de um motivo, e um deles
tem que ser este. Escreva a resposta numa palavra antes de escolher paleta ou
template: *calma, desejo, urgência, confiança, pertencimento, alívio.* É essa
palavra que julga a peça depois, não o gosto.

Se a marca for nova ou o tom estiver vago, faça o exercício de voz antes de
qualquer forma (§9 de
`${SKILL_DIR}/references/fundamentos-visuais.md`): cinco palavras que ela
**nunca** diria, cinco que usaria demais, e uma frase que ela publicaria. Marca
que soa ousada não pode receber identidade tímida.

## 2. Consulte o acervo antes de decidir qualquer coisa

```bash
python "${SKILL_DIR}/scripts/buscar.py" "<setor + estrutura>" --n 6
```

Busque por partes: primeiro a estrutura principal (`--estrutura lp-completa` ou
`hero`), depois os componentes de apoio (`--familia ui`), depois efeitos se o
briefing pedir personalidade extra (`--familia efeito`).

Confira sempre as **receitas** primeiro — se já existe uma composição que funcionou
para um caso parecido, comece dela:

```bash
python "${SKILL_DIR}/scripts/buscar.py" --estrutura receita
```

## 2.2. Que hero? — a pergunta que decide o site

**Nunca comece a construir sem ter perguntado isso.** O hero é a única seção que
todo visitante vê, e o tipo dele decide três coisas de uma vez: o peso da página, o
comportamento no celular, e se você vai precisar de mídia que o cliente talvez não
tenha. Descobrir isso depois de montar é refazer.

Não pergunte no vácuo. Busque primeiro o que o acervo cobre para este setor e este
caráter, e ofereça o que existe **junto** com o que teria de ser gerado:

```bash
python "${SKILL_DIR}/scripts/buscar.py" "<setor> hero" --estrutura hero --n 6
python "${SKILL_DIR}/scripts/buscar.py" --tag video-bg --sem-video   # o que NÃO precisa de vídeo
```

Escolher o tipo de hero é escolher **em que nível de movimento** o site opera —
são seis, e sobem em sofisticação (`${SKILL_DIR}/references/fundamentos-visuais.md`
§3). Hero tipográfico costuma parar no nível 2 (hierarquia desenha a seta
invisível); scroll cinemático e WebGL vivem no 4 (movimento implícito); vídeo de
fundo pode chegar ao 6 se o corte for pensado como **ritmo** — impacto, demora,
pausa — em vez de loop.

O nível 6 é o que quase ninguém considera e é o que mais rende em site: a página
de produto da Apple é hero rápido, bloco técnico lento, e espaço em branco de
descanso. Se o briefing pede sofisticação, **é aí que ela mora**, não em mais
efeito.

### Os tipos, e o que cada um cobra

| Tipo | O que é | Mídia que exige | Onde procurar |
|---|---|---|---|
| **tipográfico** | tipo gigante, sem imagem | nenhuma | `--tag animacao-texto`, `--familia prompt` |
| **editorial** | uma foto forte + tipo. O padrão de marca | 1 imagem | `--familia design-system`, `--familia template` |
| **split** | texto de um lado, mídia do outro | 1 imagem ou vídeo | `--familia template` |
| **vídeo de fundo** | loop atrás do texto. Alto impacto | 1 vídeo | `--tag video-bg` |
| **scroll cinemático** | sequência de frames rolada pelo scroll | 1 vídeo → ~180 JPG | `--estrutura scroll-cinematica` |
| **WebGL / 3D** | objeto, shader ou partícula em canvas | modelo, ou nenhuma | `--familia efeito`, `--tag shader` |
| **efeito sobre imagem** | ASCII, vidro, glitch envolvendo uma foto | 1 imagem | `--familia efeito` |
| **carrossel** | várias peças rotacionando | 3 a 6 imagens | `--familia ui`, `--tag carrossel` |

Ofereça **quatro** dessas, escolhidas pelo briefing — não despeje as oito. Quem tem vídeo do cliente merece ver "vídeo de fundo" e "scroll cinemático" na
lista; quem não tem material nenhum merece ver "tipográfico" e "WebGL" no topo, porque
são os dois que não dependem de nada.

Ao lado de cada opção diga **quantas peças do acervo servem** para ela (o número sai da
busca acima) e **o que ela cobra**. As três frases que mais evitam arrependimento:

- **vídeo de fundo** pesa. Num 4G ruim o visitante vê retângulo preto antes de ver a
  marca. Exige `poster`, `preload="none"` e um caminho estático em mobile.
- **scroll cinemático** só funciona com movimento contínuo. Clipe com corte fica feio
  ao rolar para trás, e não tem conserto depois.
- **WebGL** é o único que pode simplesmente **não renderizar** — máquina corporativa
  com driver velho devolve retângulo preto sem erro. Sempre com fallback, e leia a
  `kit-otimizar-3d` antes de entregar.

### Se o hero escolhido pede mídia que o cliente não tem

É o caso mais comum em projeto real, e até aqui a saída era placeholder. Com o **MCP
do Higgsfield ligado**, dá para gerar imagem e vídeo do hero sob medida.

Leia `${SKILL_DIR}/references/higgsfield.md` antes da primeira chamada —
ele custa crédito de verdade, tem moderação que reprova por engano, e o vídeo leva
minutos. Não é uma chamada para "dar uma olhada".

O caminho curto:

```
generate_image(model="nano_banana_pro", ...)          # o keyframe, 16:9
job_display(id=...)                                    # até status "completed"
generate_video(model="seedance_2_0", medias=[{role:"start_image", value:<id>}])
```

**Confirme com o usuário antes de gerar.** É dinheiro dele. Diga o custo estimado
(`get_cost:true` na primeira chamada) e o que vai sair, e só então gere.

E quando gerar algo bom: **ingira**. Uma imagem de hero que ficou boa para clínica
serve para a próxima clínica, e crédito gasto duas vezes na mesma coisa é desperdício.

## 2.5. Escolha a identidade visual separado da estrutura

Esta é a combinação mais forte do acervo, e a razão de ele existir:

> **template ou prompt** dá a *estrutura* — rotas, seções, componentes.
> **design system** dá a *identidade* — paleta, tipografia, espaçamento, regras.

### Decida a cor ANTES de escolher o design system

Escolher o design system primeiro faz a cor vir de brinde — e é assim que se chega no
automático. Todo acervo de design system tem viés, porque foi extraído de sites reais
e site de marca converge para neutro, azul e tema claro. Meça o **seu** antes de
recomendar:

```bash
python "${SKILL_DIR}/scripts/cor.py" --vies
```

Buscar sem ter decidido a cor devolve, na média, exatamente o lugar-comum que o viés
mede.

Use a **`kit-cor`**: ela faz as cinco perguntas que determinam cor, monta a
paleta por papel, mede o contraste de cada par e diz de quantos design systems
você está chegando perto.

```bash
python "${SKILL_DIR}/scripts/cor.py" --paleta --fundo ... --tinta ... --acento ...
```

### E confira a licença da fonte antes de adotar

**Design system extraído de site real nomeia a fonte e quase nunca diz onde
carregá-la.** Boa parte é comercial — `Aeonik`, `Roobert`, `GT Standard`,
`Suisse Int'l`. E `SF Pro` **não pode ser servida na web**: a licença da Apple cobre
app das plataformas dela, não site. Quantas peças do seu acervo estão nessa situação
sai no `perfil.py`, na linha `fonte não entregável`.

Use a **`kit-tipo`** antes de adotar o tipo do design system:

```bash
python "${SKILL_DIR}/scripts/tipo.py" --licenca "<fonte do design system>"
python "${SKILL_DIR}/scripts/tipo.py" --substituir "<fonte>"
```

Trate o nome da fonte no design system como **sugestão, não requisito**. A
identidade dele está na escala, no espaçamento e no contraste — não no arquivo
da fonte.

Com fundo, tinta e acento decididos, a busca abaixo muda de natureza: você não
procura mais um design system bonito, procura **um que já resolveu esta paleta**.

Cada design system do acervo traz paleta comentada (o papel de cada cor), escala
tipográfica completa, CSS custom properties prontos, **Do's and Don'ts** e um
**Agent Prompt Guide** com exemplos de prompt por componente.

```bash
python "${SKILL_DIR}/scripts/buscar.py" "<caráter visual>" --familia design-system
```

Busque pelo **caráter**, não pelo setor: "creme quente editorial", "preto com um
acento neon", "brutalista branco", "terminal escuro". O setor filtra depois.

Ao aplicar um: **leia o arquivo inteiro** em
`acervo/design-systems/<id>/design-system.md`. Copie as custom properties do
Quick Start, siga o Do's and Don'ts, e respeite a ração de cor — quase todos esses
sistemas dependem de um acento único aparecendo pouco. Espalhar o acento é o erro
mais comum e destrói o efeito.

Dois cuidados reais:

- **Fontes.** Muitos usam tipografia comercial (GT America, Söhne, Aeonik, Whyte).
  Cada ficha lista um **Substitute** com equivalente livre — use se não houver
  licença.
- **Não misture dois sistemas.** Eles são internamente coerentes e brigam entre si.
  Um por projeto.

## 3. Apresente o plano antes de escrever código

Liste as peças escolhidas, uma linha de justificativa cada, e o que será gerado do
zero. Espere aprovação. Reescrever depois custa muito mais que alinhar antes.

Ao compor, cuide do **peso visual**: não empilhe três seções de alto impacto
seguidas (scroll-scrub + WebGL + partículas). Alterne peso alto e baixo, senão
nenhuma respira e a página inteira vira ruído.

E **um efeito forte por página**. `glass`, `shatter`, `glitch`, `vhs` competem
entre si — dois juntos anulam o impacto dos dois.

### Antes de desenhar seção nova, pegue um esqueleto de layout

Se o MCP do **GetLayers** estiver ligado, `getlayers_compositions` devolve
esqueletos abstratos de arranjo — onde ficam headline, mídia, modelo e botões,
que tamanho têm entre si, quanto de ar — **com wireframe em ASCII** e um
`pairsWith` dizendo o que combina depois na página. São 109, sendo 28 só de hero.

```
getlayers_compositions(role="hero")     # também: card-grid, cta, footer, editorial…
```

**É gratuito, e é o antídoto do layout genérico.** O acervo tem peças prontas mas
nenhum vocabulário abstrato de arranjo — por isso seção montada do zero sempre
tende à pilha centralizada. Escolha o esqueleto primeiro, depois despeje dentro
dele a identidade e as peças do acervo.

Composição é neutra de biblioteca: serve igual num projeto GSAP. Ver
`${SKILL_DIR}/references/getlayers.md` para o resto — e para a cota, que
vale para `materialize`, não para consultar.

## 3.5. Comece por um template, quando houver

Existem **29 templates de site completos e rodáveis** no acervo, 12 deles já em
Next.js com GSAP e Lenis — exatamente o stack do usuário. Clonar e adaptar um
template supera montar peça por peça sempre que o escopo for um site inteiro.

```bash
python "${SKILL_DIR}/scripts/buscar.py" "<setor>" --familia template
```

Cada template traz rotas, componentes e build já configurados. O `README.md` da pasta
lista rotas, componentes, técnicas e o `npm i` necessário.

**O código está no acervo; os assets não.** Imagens, vídeos e fontes ficaram no
projeto original (campo `projeto_origem`) porque somam 835 MB. Copie o código,
aponte para os assets originais durante o desenvolvimento, e troque por material do
cliente antes de entregar.

Para técnicas isoladas — menu, transição de rota, scroll com pin, reveal de entrada,
rodapé animado — use a família `animacao` (90 demos) e extraia só a técnica.

**Menu é o caso mais comum e o acervo tem 31.** Ao escolher, decida primeiro o
comportamento, não a estética: overlay cobre o conteúdo, push empurra e mantém o
contexto, sidebar é lateral e discreta, offcanvas desliza de fora. Depois filtre por
marca. E confira sempre foco por teclado e fechamento por Esc — quase nenhuma demo
de menu vem com isso resolvido.

**Peça que existe em par JS + Next.js** — o mesmo id com sufixo `-next` — sempre na
variante `-next`: evita a conversão inteira. Confira com
`buscar.py "<id sem sufixo>"` antes de portar à mão.

## 3.7. Catálogo por MCP: peça o código já na sua stack

Peças marcadas `via: mcp:` têm ficha no acervo e **código nenhum** — o servidor gera
sob medida. Isso é vantagem: peça direto em Next.js e evite conversão. O exemplo
abaixo é o OriginKit, que é o caso mais comum.

```
get_component(name="<nome>", stack="nextjs", styling="tailwind", typescript=true)
```

Se precisar de variação, `preset` seleciona uma variante nomeada e `tweaks`
sobrescreve props individualmente (tweaks vence preset).

Ao integrar, três passos que o próprio OriginKit instrui:

1. Escreva em `src/components/originkit` quando o projeto tem `src/` — o Tailwind
   costuma varrer só `src/`.
2. Garanta que o `content`/`@source` do Tailwind inclua essa pasta.
3. Mantenha o `"use client"` quando presente.

E limpe o resíduo de Framer antes de entregar: o shim `RenderTarget` (que sempre
retorna `"preview"`), os JSDoc `@framerSupportedLayoutWidth`/`@framerIntrinsic*`, e
o `props: any` no componente exportado. Funciona sem limpar, mas é andaime morto.

## 4. Conversão Vite → Next.js

**Prompt de página quase sempre especifica React + Vite** — é o padrão de quem escreve
esse tipo de spec. Quando o projeto é Next.js, a conversão é mecânica, mas tem
armadilhas que quebram build.

Antes de converter, verifique se um template Next.js já resolve — é quase sempre mais
barato que portar um prompt Vite.

| Vite | Next.js (App Router) |
|---|---|
| `src/App.tsx` | `app/page.tsx` |
| `src/index.css` com `@tailwind` | `app/globals.css`, importado no layout |
| fontes via `<link>` no `index.html` | `<link>` no `app/layout.tsx`, ou `next/font` |
| componente com hook, evento ou `window` | **precisa de `"use client"` no topo** |
| `import.meta.env.VITE_X` | `process.env.NEXT_PUBLIC_X` |
| `react-router-dom` | `next/navigation` + rotas por pasta |

Três armadilhas que valem atenção específica:

- **Imagens externas.** Prompt de página costuma apontar para URLs em
  `cloudfront.net` ou `figma.site`. Se usar `next/image`, é obrigatório declarar
  `images.remotePatterns` no `next.config` — sem isso o build quebra. Com `<img>`
  comum não há problema.
- **Tailwind v4.** Vários prompts pedem `@tailwindcss/vite`. Em Next.js o
  equivalente é `@tailwindcss/postcss`, com `@import "tailwindcss"` no CSS. Não
  misture com a sintaxe v3 (`@tailwind base`).
- **Confira se já existe um template Next.js equivalente** antes de converter
  qualquer prompt Vite: `buscar.py "<caráter>" --familia template --stack nextjs`.
  Clonar um template que já roda é sempre mais barato que portar uma spec.

## 5. Pré-requisitos que quebram silenciosamente

Antes de colar componente das famílias `ui` ou `efeito`, garanta no projeto:

- **`@/lib/utils` com a função `cn`** — quase todo componente de origem shadcn
  importa isso. Sem o arquivo, o import falha. É o `clsx` + `tailwind-merge` padrão.
- **A base do registro de origem.** Componente vindo de registro (smoothui, shadcn)
  costuma puxar outros: tokens de cor e tema, constantes de mola e easing, o botão
  base, o motor de uma família de transições. **A busca imprime `PRECISA JUNTO:` em
  cada resultado** — leia e instale a base antes de colar. Sem ela o erro não diz que
  falta uma peça, diz que falta um módulo, e você vai procurar no lugar errado.

  Parte dessas bases (`command`, `popover`, `alert-dialog`, `avatar`) vem do shadcn
  base, não do registro — instale pelo `npx shadcn@latest add`.

- **`motion` e `framer-motion` são a mesma biblioteca com nomes diferentes.** Peça
  recente importa de `motion/react`, peça antiga importa de `framer-motion`.
  Misturar as duas instala a lib duas vezes. Padronize em `motion` (é o pacote
  sucessor) e ajuste os imports antigos ao integrar.
- **Dependências reais.** O `deps=` de cada resultado lista o que precisa ser
  instalado. Instale antes de colar, não depois do erro.
- **Alguns dependem de shadcn/ui** (`@/components/ui/carousel`, `scroll-area`).
  O `EVITAR` de cada peça avisa quando é o caso.
- **Lenis, GSAP e Framer Motion** aparecem em peças diferentes. Se a página usar
  duas engines de animação, escolha uma — a redundância pesa e conflita no scroll.

## 6. Assets perecíveis

O aviso `[!] N assets externos que podem cair` não é decorativo. Esses vídeos e
imagens estão em buckets temporários e muitos já expiraram. Nunca entregue um site
apontando para eles:

- Se o usuário tem material próprio, substitua.
- Se não tem, avise explicitamente que aqueles assets são placeholders e precisam
  ser trocados antes de publicar.
- Testar as URLs antes de entregar evita descobrir na frente do cliente.

Vale o mesmo para fontes de `db.onlinewebfonts.com`, comuns no acervo: são
redistribuições de fontes comerciais. Para trabalho de cliente, verifique licença ou
troque por equivalente do Google Fonts.

## 7. Acabamento

Depois de montar, unifique. As peças vêm de projetos diferentes e vão brigar em
espaçamento, escala tipográfica e tokens de cor. Passe as skills de acabamento que o
usuário já tem instaladas — `impeccable`, `design-taste-frontend` ou
`high-end-visual-design` — para harmonizar o conjunto.

Duas peças específicas do acervo exigem cuidado ao integrar:
- `luxury-hero` avisa explicitamente para **não** alterar espaçamentos. Respeite.
- `performance-eye` usa `mix-blend-mode: difference`, que inverte cores e ignora a
  paleta da marca. Ou você aceita isso, ou não usa essa peça.

## 7.5. A coreografia de entrada — é padrão, não enfeite

```
loader imersivo  →  gate  →  revelação escalonada  →  entrada da cena
```

Todo site de marca ganha isso **por padrão**. Simplifique quando o usuário pedir,
ou quando a página for dashboard, app shell ou algo que a pessoa abre dez vezes
por dia — loader imersivo é instrumento de primeira impressão, não de hábito.

Os números abaixo foram **colhidos de templates que rodam em produção**, não
inventados. Procure ponto de partida no acervo antes de escrever do zero:
`buscar.py "preloader reveal de entrada" --familia animacao`.

### O gate — a regra que muda a estrutura, não a decoração

**Vire o gate no INÍCIO da saída da cortina, nunca no fim.** É o achado mais
consistente da biblioteca: 7 templates fazem assim, e os dois que esperavam o
repouso foram julgados piores por quem os leu depois.

O ponto é a **sobreposição**: o conteúdo tem que animar *através* da cortina que
sai. Um template roda o hero num relógio absoluto de 2500ms, quando a cortina
está só 75% levantada, e os dois movimentos leem como um gesto só. Outro começa
o texto com o véu ainda ~40% opaco.

**Monte tudo já escondido; não segure a pintura.** Deixe o elemento no DOM no seu
valor inicial em vez de não renderizar. Três motivos, todos reais:

- crawler e leitor de tela veem o conteúdo;
- a medição e a quebra do texto acontecem atrás da cortina, então a revelação é
  só opacidade e transform — sem remontagem, sem travar o quadro;
- **montar tarde faz o scroll nascer de um documento de altura zero**, e uma cena
  dirigida por scroll salta direto para o final.

Retrofitar qualquer uma das duas depois é muito mais caro que já construir assim.

**A liberação do scroll é separada do gate visual.** Trave no mount do loader,
libere no repouso da cortina — depois da revelação do conteúdo, e está certo.

### O loader — seja honesto sobre o que mede

Se você não está medindo nada, **não desenhe porcentagem**. Nunca mostre um
número que é `setTimeout` fantasiado de progresso.

Três desenhos legítimos, em ordem de preferência:

1. **Com teto de espera.** O contador acompanha prontidão real e *estaciona* em
   ~92% até o asset chegar; se ele travar, a barra fica lá — o que é honesto.
2. **Sem contador.** Wordmark, fio, véu. O loader mais caro da biblioteca não
   conta nada.
3. **Cortina cronometrada.** Relógio fixo, honestamente fixo: 0→100 em 1500ms com
   a desaceleração aplicada **ao número**, não à transição CSS.

Sempre:

| | Valor | Por quê |
|---|---|---|
| piso anti-flash | 900–1600ms | cache quente não pode piscar uma cortina |
| teto duro | 2600–7000ms | asset travado não pode prender a pessoa |
| "pronto" | ≥1 quadro desenhado | resolver promise não é prontidão |

Com WebGL, dispare o `onReady` **de dentro do rAF, depois do primeiro
`render`** — aí "pronto" significa que o shader compilou e a GPU desenhou.

### Revelação do conteúdo

**Por palavra ou por linha. Por caractere só em display curto** — um wordmark,
uma linha de hero. Nunca um parágrafo.

| Unidade | Stagger | Duração |
|---|---|---|
| linha | 90–140ms | 900–1100ms |
| palavra | 20–85ms | 520–900ms |
| caractere | 20–70ms | 720–950ms |

Quatro detalhes que só aparecem depois de errar:

- **Proteja os descendentes.** Máscara de linha corta o `g` e o `p`. Todo template
  que recorta compensa com `padding-bottom: .12–.15em` e `margin-bottom` negativo
  igual.
- **Nunca recorte uma revelação com blur.** O `overflow` corta o halo na caixa da
  linha — que é justamente o efeito.
- **Chegue à opacidade cheia cedo na curva**, em 25–30%. O tipo fica sólido
  *enquanto ainda viaja e desfoca*. É isso que faz parecer caro, não o translate.
- **Um motor de texto por linha desenhada.** Um motor para a frase inteira
  re-quebra o texto (o container dele mede diferente de um parágrafo) e duas
  linhas viram três. Continue o delay do segundo a partir da contagem do primeiro
  para ainda ler como uma varredura só.

**Com cena atrás, revele no lugar**: opacidade e blur, **sem translate** — senão
as palavras deslizam sobre algo que já se move.

**Abaixo da dobra é outro mecanismo.** Só o conteúdo acima da dobra depende do
loader; o resto é entrada por viewport, `once`, disparando entre 45% e 88%
visível. Não trave o que ninguém pode ver.

### Scroll — um relógio só

Lenis dirige um único progresso normalizado, e tudo lê dele.

- Escreva o progresso num **ref**, não em estado, e leia dentro do frame loop.
  Rolar não pode re-renderizar a árvore.
- Se a interface precisa de estágios discretos, **quantize a partir do mesmo
  valor** que a cena usa. Um template da biblioteca tem bug exatamente aqui: a
  câmera usa 6 trechos e a interface usa 7 faixas, então a cobertura entra ~29vh
  antes do painel estar enquadrado.
- **Alinhe os keyframes aos painéis.** Com N painéis de viewport cheia, espalhe o
  progresso por **N−1** trechos, para o keyframe *i* cair exatamente quando o
  painel *i* preenche a tela.

A maior parte das revelações é entrada por viewport, **não scrub**. Scrube só o
que ganha com isso: parallax, contador, câmera.

### A cena nunca entra em fade

Dê entrada física:

- **Brilho total no quadro 0, depois decai.** Um template detona 34 respingos no
  mount — o primeiro quadro pintado já é o pico — e o decaimento drena exatamente
  ao longo do stagger do conteúdo. Afine o stagger para o meio dele cair no vale.
- **Voe a cena para dentro.** Câmera de `z 3.6 → 0` desenrolando `2π` com alpha
  0→1, **os três no mesmo escalar suavizado**, para chegar como um gesto e não
  como três sobrepostos.
- **Dissolva.** Banda de ruído 3D com brilho na borda, não opacidade.

Interpole linear e amorteça **uma vez** — não suavize cada trecho na mão:

```js
const k = 1 - Math.exp(-DAMP * Math.min(delta, 0.1));
camera.position.lerp(alvo.position, k);
olhar.lerp(alvo.lookAt, k);          // amorteça separado, depois camera.lookAt(olhar)
```

`DAMP = 3.2` dá τ ≈ 312ms. **Esse atraso é o peso** — a câmera fica um terço de
segundo atrás do seu scroll, e é isso que faz parecer voada em vez de arrastada.
Passe o `delta` **real**: `1/60` fixo converge duas vezes mais rápido num monitor
de 120Hz. Enquadre pelo look-at, não movendo o objeto.

Uniform de shader normalmente **não** deve ser amortecido — o amortecimento da
câmera já suaviza o aparente.

### `prefers-reduced-motion` precisa alcançar o canvas

Aqui está o bug que a própria biblioteca de origem admite ter: a flag global da
biblioteca de animação **não cobre loop de shader**. Um template ignora a
preferência e mantém o shader rodando; outro congela a câmera enquanto a cena
segue explodindo — câmera parada assistindo cérebro animado.

Com GSAP, o caminho limpo é `gsap.matchMedia()`:

```js
const mm = gsap.matchMedia();
mm.add("(prefers-reduced-motion: reduce)", () => {
  gsap.globalTimeline.timeScale(200);   // tudo salta para o estado final
  pararLoopDoCanvas();                  // <- ISTO. A flag acima não alcança o rAF do WebGL
});
```

**Reduza, não delete.** Tire translate e blur, **mantenha a opacidade**: a página
ainda resolve em vez de estalar.

## 7.9. A revisão que não quebra nada — e por isso passa batido

O passo 8 registra o que **quebrou**: build, hidratação, contraste reprovado, asset
morto. Esta revisão cobre o outro lado — o que **não quebra e mesmo assim falha**.
Nenhum destes dá erro no console. Todos custam conversão.

São sete testes, todos de minutos. Detalhe de cada um em
`${SKILL_DIR}/references/fundamentos-visuais.md` §8. **Rode pelo menos os quatro
primeiros antes de entregar qualquer página.**

### Antes dos testes: capture. Não julgue pelo código

Ler o próprio JSX e concluir que a hierarquia está boa é a forma mais confiável de
aprovar a própria página. Você não vê o que escreveu; vê o que quis escrever. Todo
teste abaixo é sobre o que **aparece**, então capture primeiro e olhe a imagem:

```bash
python "${SKILL_DIR}/scripts/capturar.py" --url http://localhost:3000 \
  --viewport 1440x900 --saida /tmp/rev-desktop.png
python "${SKILL_DIR}/scripts/capturar.py" --url http://localhost:3000 \
  --viewport 390x844  --saida /tmp/rev-mobile.png
```

**Dois viewports é o mínimo** — metade das falhas de hierarquia só existe num dos
dois, e a que sobrevive à mudança de largura é a que era real. Se a página tem
scroll longo, capture também o meio e o rodapé; o script aceita qualquer URL.

O script **recusa** captura que não presta e diz por quê: página em branco, canvas
que não inicializou, servidor que não subiu. Recusa é informação — significa que
não há o que revisar ainda, não que a revisão passou.

Se existe **referência visual** (print que o cliente mandou, `preview_url` do
GetLayers, o site que ele citou), abra as duas lado a lado. A pergunta deixa de ser
"está bom?" e vira "onde diverge?", que é respondível.

### A revisão é um laço, não uma passada

Corrigiu alguma coisa? **Capture de novo e rode os mesmos testes.** Correção que
ninguém olhou depois de aplicada é correção presumida — e mexer em espaçamento para
consertar o teste 3 costuma quebrar o 2.

**No máximo três voltas.** Na quarta o problema não é execução, é a decisão que
gerou a página, e isso se resolve conversando, não ajustando pixel.

Para onde vai cada falha — execução ou decisão de projeto — está em
[O que fazer com o resultado](#o-que-fazer-com-o-resultado), no fim desta seção.

### 1. Troca estética — a peça é sua ou é do setor?

Cubra o logo e imagine trocar por outro cliente do mesmo ramo. Se a página
funcionaria igual para qualquer clínica, qualquer joalheria, qualquer SaaS, você
montou **o setor**, não o cliente.

Isto tem consequência direta no acervo: montar só com peça que "cabe na categoria"
é como o aglomerado se reproduz. Meça com
`python "${SKILL_DIR}/scripts/cor.py" --vies` e
`python "${SKILL_DIR}/scripts/buscar.py" --listar tag` — tag de contagem muito alta
é conformidade de categoria, e conformidade some.

### 2. Três segundos — a ordem de leitura é a que você quis?

Mostre a tela por três segundos, esconda, e pergunte **a sequência**, não os
detalhes: o que viu primeiro, segundo, terceiro. Sem alguém por perto, faça você
mesmo com o hero em miniatura.

Se a resposta começa pela coisa errada, a hierarquia falhou. **Se ninguém menciona
o CTA, ele não guiou** — e é a única coisa que a página tinha que fazer.

### 3. Ladrão de atenção — o teste que inverte o instinto

1. **Cubra a mensagem principal** da seção
2. Olhe tudo que sobrou: *o que está roubando atenção sem ter merecido?* Badge
   decorativo, forma de fundo, segunda imagem, linha de apoio que ninguém pediu
3. Achou o ladrão — **não apague. Reduza primeiro**: menor, mais quieto, menos
   contraste, mais longe
4. Só apague se não tiver função nenhuma

> Comunicação mais forte quase nunca vem de dar **mais** ênfase ao que importa.
> Vem de **tirar o que competia secretamente com ele**.

Vale especialmente depois de compor peças de origens diferentes: cada uma foi
desenhada para ser o centro da própria tela, e juntas brigam.

### 4. Passo atrás — o caminho do olho está calmo?

Reduza a página para largura de miniatura, ou afaste-se da tela. Se o percurso
continua equilibrado, acertou. **Se o olho fica quicando, tem coisa errada** —
mexa em contraste, espaçamento e alinhamento até acalmar. Não adicione nada.

### 5, 6 e 7 — quando a entrega tem identidade

- **Desfoque:** borre ou encolha. A forma básica ainda se sente?
- **Sem cor:** achate para uma cor só. **Se a ideia morre, a cor estava carregando
  o conceito** — cor deve melhorar, não resgatar.
- **Apropriabilidade:** junte 20 peças do mesmo setor, mesmo tamanho, apague os
  nomes. Quantas trocariam de lugar sem ninguém notar?

### O que fazer com o resultado

Falha nos testes 1 ou 7 é **decisão de projeto** — leve ao usuário, não conserte
sozinho: pode ser que o briefing peça conformidade mesmo (marca que quer parecer
com o setor é caso legítimo).

Falha nos testes 2, 3 ou 4 é **execução** — conserte antes de entregar, e se a
causa foi a peça do acervo (não a sua montagem), **registre como armadilha** no
passo seguinte.

## 8. Registre o que deu errado — este passo é obrigatório

**É o que faz o acervo ficar mais inteligente em vez de só maior.**

Toda montagem descobre coisas que não estavam em documentação nenhuma: um vídeo que
retorna 403, um contraste que reprova, um componente com bug de cleanup, um reset
que anula o espaçamento em silêncio. Esse conhecimento custou caro para aparecer.
Se ficar só na sua cabeça ou dentro da nota da receita, o próximo projeto tropeça
igual.

Ao terminar, para **cada peça que deu trabalho**, grave:

```bash
python "${SKILL_DIR}/scripts/armadilhas.py" --add <id-da-peça> \
  --texto "o que aconteceu e como resolveu, com o valor exato" \
  --origem <slug-da-receita> --grau <critica|alta|media>
python "${SKILL_DIR}/scripts/indexar.py"
```

O `--grau` não é enfeite: sem ele, uma armadilha que trava a página sai na busca
com o mesmo peso de uma que desalinha 2px, e a crítica se perde no meio.

| Grau | Quando |
|---|---|
| `critica` | quebra: página em branco, build falhando, **dado errado gravado** |
| `alta` | estraga a entrega: visual quebrado, performance no chão, inacessível |
| `media` | incomoda: ajuste fino, detalhe que o cliente nota depois |

Na dúvida entre `critica` e `alta`, pergunte: *isso chega ao cliente final sem
ninguém perceber?* Se chega, é `critica` — bug silencioso custa mais que bug
barulhento.

Escreva como quem avisa um colega, com o número que importa:

- ruim: *"tem problema de contraste"*
- bom: *"o acento dourado #a9855a só alcança 2,8:1 sobre creme; usar #96744a e nunca
  preencher botão — texto creme sobre dourado dá 3,7:1 e reprova"*

A busca imprime isso como `ARMADILHA:` em toda consulta futura, e o texto entra no
índice — quem procurar "contraste" acha as peças que já reprovaram.

### O portão — não feche a montagem sem passar por ele

Este passo é o único do fluxo que não tem resultado visível: ninguém percebe se ele
foi pulado, e por isso ele é pulado. Hoje **0,7% do acervo tem armadilha registrada**
— as outras 99% são catálogo comum, e catálogo comum você acha em qualquer registry.

Escolha uma das duas saídas, **em voz alta, para o usuário**:

1. **"Registrei N armadilhas em <peças>"** — e rode `armadilhas.py` + `indexar.py`.
2. **"Nada quebrou"** — e então diga *o que você conferiu*: build de produção limpo,
   contraste medido, mobile real, `prefers-reduced-motion`, asset externo
   respondendo. Sem essa lista, não é "nada quebrou", é "não olhei" — e as duas
   coisas se parecem demais para ficarem com o mesmo nome.

Não existe terceira saída. Terminar a montagem sem dizer nenhuma das duas é o que
transformou um acervo de 5 mil peças em 35 peças que aprenderam alguma coisa.

```bash
python "${SKILL_DIR}/scripts/perfil.py" | grep armadilhas
```

A linha imprime a cobertura em porcentagem. Se você registrou algo, ela subiu; se
não subiu, ou você não rodou o `indexar.py`, ou a saída 1 não aconteceu de verdade.

Se nada deu errado, diga isso ao usuário em vez de inventar armadilha. Ficha
poluída é pior que ficha vazia.

## Armadilhas gerais, que não são de nenhuma peça

Estas apareceram montando e valem para qualquer projeto:

- **Tailwind v4:** reset global `*{padding:0}` precisa ficar dentro de `@layer base`.
  Solto, vence os utilitários (que em v4 estão em cascade layers reais) e anula o
  espaçamento inteiro **em silêncio**.
- **Mídia de hero usa `z-0`, nunca `-z-10`.** Filho com z negativo é pintado atrás do
  background da própria seção e a imagem some inteira.
- **O ticker do GSAP dorme com `document.hidden`.** Um `fromTo({opacity:0})` congela
  no estado inicial e a hero fica em branco se a aba abrir em segundo plano.
  Centralize a decisão num `shouldAnimateIn()` junto com `prefers-reduced-motion`.
- **Nunca rode `next build` com `next dev` ativo.** Compartilham `.next` e o build de
  produção corrompe os chunks do dev (`Cannot find module ./611.js`). Pare o dev,
  apague `.next`, suba de novo.
- **`SplitText` do GSAP é livre desde a 3.13** — não precisa mais de licença paga.
- **`prefers-reduced-motion` não alcança o loop do canvas.** `gsap.matchMedia()`
  faz o timeline saltar para o fim, mas o `requestAnimationFrame` do WebGL segue
  rodando. O sintoma é o pior possível: câmera congelada assistindo cena animada.
  Pare o loop você mesmo, no mesmo lugar onde trata o resto.
- **Montar componente tarde faz o scroll nascer errado.** Se o conteúdo só entra
  no DOM depois do loader, o documento tem altura zero na hora em que o
  ScrollTrigger calcula — e uma cena dirigida por scroll salta direto para o
  final. Monte já escondido, no valor inicial, em vez de não renderizar.

## 9. Salve a receita

Terminou e ficou bom? Registre a composição:

```bash
python "${SKILL_DIR}/scripts/receita.py" criar <slug> \
  --titulo "..." --setor <setor> --pecas id1,id2,id3 \
  --quando-usar "..." --notas "o que deu trabalho e como resolveu"
```

É isso que faz o acervo ficar mais útil a cada projeto em vez de só maior. Na décima
vez, "faz igual ao da clínica, mas para academia" vira um passo só.
