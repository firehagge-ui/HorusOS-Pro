---
name: kit-adaptar
description: >
  Lê um prompt de site que veio de fora — quase sempre em inglês, quase sempre sem
  contexto — e devolve em português o que ele é: tipo de site, escopo (hero solto ou
  landing inteira), seção por seção, técnica usada (hover, cursor, scroll, WebGL,
  vídeo), stack e dependências, e o mapa de assets com o caminho exato de cada
  arquivo no projeto. O que você não tiver vira placeholder descrito. Depois adapta o
  prompt para o seu projeto. Aceita print ou vídeo do site original junto. Use quando
  o usuário colar um prompt e perguntar "o que é isso", "que site isso constrói",
  "traduz isso", "adapta esse prompt pra clínica", "que assets eu preciso pra isso",
  ou invocar /kit-adaptar. Se ele quiser um prompt novo do zero, é kit-prompt.
allowed-tools: Read Glob Grep Bash(python:*) Bash(python3:*)
---

# kit-adaptar — entender o prompt que chegou, depois torcer ele pro seu caso

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

`kit-prompt` escreve o prompt 85 do zero. Esta skill pega um prompt que já existe —
copiado de um tweet, de um repositório, de outra ferramenta — e responde duas
perguntas antes de qualquer coisa: **que site é esse** e **o que eu preciso ter para
construir**.

A tradução é meio, não fim. Traduzir sozinho não resolve: o problema de um prompt de
fora é que ele descreve uma marca que não é a sua, apontando para arquivos que não
são seus, num stack que talvez não seja o seu.

## 1. Rode os dois scripts antes de ler com atenção

Se o prompt veio colado no chat, grave num arquivo primeiro — os scripts leem arquivo.

```bash
python "${SKILL_DIR}/scripts/ingerir.py" <arquivo> --analisar
python "${SKILL_DIR}/scripts/assets.py"  <arquivo> --testar
```

| Script | Responde |
|---|---|
| `ingerir.py --analisar` | família, stack, deps npm, fontes, marca, e os flags `tem_video` / `tem_webgl` / `tem_scroll` |
| `assets.py --testar` | cada URL externa com tipo e **estado HTTP**, cada caminho local citado, quantas são perecíveis |

Confie neles nesses campos e não gaste leitura refazendo o trabalho. O `--testar`
usa rede e demora alguns segundos; vale sempre — muita peça do acervo aponta para
bucket temporário e boa parte já responde 403. Saber que a imagem morreu é a
diferença entre reaproveitar a URL e abrir um placeholder.

O que os scripts **não** pegam e você lê no texto: hover e cursor custom, drag,
sequência das seções, copy, e a intenção comercial da página.

## 2. Se vier print ou vídeo, olhe antes de descrever

O usuário costuma ter visto o site antes de ter o prompt. Se ele mandar imagem, leia
com o `Read`. Se mandar vídeo (é onde movimento aparece), use a skill `watch` — ela
extrai os frames. Um vídeo de 10s mostra o que trinta linhas de prompt não dizem:
se o scroll é scrubado ou solto, se o hover troca a imagem inteira, se o easing é
duro ou macio.

**Onde os dois discordam, o visual ganha.** Prompt é intenção; o vídeo é o resultado.
E diga ao usuário quando discordarem — isso é achado, não detalhe.

## 3. Entregue o relatório, nesta ordem

Português. Seis blocos, sem enrolação entre eles.

**1 — O que é.** Uma frase de tipo + setor + o que a página precisa fazer acontecer.
Tipo sai deste vocabulário: `institucional` `landing de produto` `SaaS` `portfólio`
`e-commerce` `evento` `app` `agência` `editorial`. Se o prompt não disser o setor, diga
que não disse e chute com a marca do `--analisar` como pista.

**2 — Escopo.** É o que ele perguntou primeiro: hero solto ou página inteira?
Use o vocabulário do acervo: `hero` `lp-completa` `scroll-cinematica` `signup` `404`
`efeito-wrapper` `componente-ui` `efeito-objeto-3d`.

**3 — Seções, na ordem.** Uma linha cada: o que tem dentro e o que ela faz pelo
negócio. Se for hero solto, diga isso em uma linha e não invente as outras.

**4 — Técnica e interação.** Só o que o prompt realmente pede. Marque cada um:
hover/cursor custom, drag, scroll scrubado, sticky, parallax, WebGL/shader, canvas 2D,
vídeo de fundo, autoplay, formulário, i18n. Ao lado de cada um, o custo real:
"cursor custom → morre no mobile", "WebGL → precisa de GPU decente e sobe o bundle".

**5 — Stack.** O que o `--analisar` devolveu, mais a pergunta que importa: **bate com
o stack do seu projeto?** Se o prompt é Vite+React e o destino é Next.js, diga aqui o
que muda (`"use client"`, `next/image`, `next/font`, sem `index.html`).

**6 — Assets.** A tabela do passo 4.

Fecha com o **custo de adaptação** em um dos três graus:

| Grau | O que basta |
|---|---|
| `troca de texto` | copy, marca e paleta. Estrutura e código inteiros servem |
| `troca de identidade` | acima + fontes, imagens, ritmo. O layout permanece |
| `reescrita estrutural` | as seções não servem para o seu caso; aproveita-se a técnica, não a página |

## 4. Mapa de assets — caminho exato, sempre

Ele perguntou "quais assets e onde ficam". Responda com caminho, não com categoria.

| Asset | Onde vai | Formato / medida | Estado |
|---|---|---|---|
| vídeo do hero | `public/video/hero.mp4` | 1920×1080, ≤6 MB, loop 8–12s, sem áudio | **falta** |
| poster do vídeo | `public/img/hero/poster.webp` | 1920×1080, ≤200 KB | **falta** |
| retrato da equipe (×3) | `public/img/equipe/<nome>.webp` | 800×1000, ≤150 KB | **falta** |
| logo | `public/img/logo.svg` | vetor, monocromático | você tem |
| modelo 3D | `public/models/anel.glb` | ≤4 MB, Draco | **URL original morta (403)** |

Convenções, e não invente outras: Next.js e Vite servem de `public/`, referenciado
com `/` na raiz. HTML puro usa `assets/`. Fonte do Google entra por `<link>` e não
vira arquivo; fonte comercial vira `public/fonts/` e precisa de licença — diga isso.

### O placeholder precisa ser lido, não só existir

Todo asset que falta entra no prompt adaptado como bloco marcado, com cinco coisas:
caminho, medida, peso, **o que vai aparecer ali no seu projeto** (não no original), e
o que segurar a página enquanto não existe.

```
<!-- ASSET FALTANDO — public/video/hero.mp4
     1920×1080, ≤6 MB, loop 8–12s, sem áudio, corte no beat de 4s.
     Conteúdo: plano aéreo lento descendo sobre a fachada da clínica ao entardecer,
     luz quente, sem pessoas identificáveis.
     Enquanto não existir: fundo #0A0B11 com gradiente radial #1B2340 no centro. -->
```

Para imagem, o segura-página pode ser URL real e imediata:
`https://placehold.co/1920x1080/0A0B11/FFFFFF?text=Hero`. Para vídeo não existe
equivalente — use cor sólida ou a imagem de poster, e nunca deixe um `<video>`
apontando para arquivo inexistente: o navegador não erra bonito.

**Descreva o conteúdo pela adaptação, não pelo original.** Se o prompt original tinha
um carro e o projeto é uma joalheria, o placeholder descreve o anel. É o passo que
faz o brief de asset servir para pedir ao fotógrafo.

## 5. Adapte

Pergunte só o que não dá para deduzir, numa mensagem: **para quem é** (marca, setor,
público), **stack de destino**, e **o que já tem de material**. Se ele já disse no
pedido, não repita a pergunta.

Antes de escrever, veja se o acervo resolve melhor do que o prompt de fora:

```bash
python "${SKILL_DIR}/scripts/buscar.py" "<setor ou caráter>" --familia prompt
python "${SKILL_DIR}/scripts/buscar.py" "<caráter visual>" --familia design-system
```

O que muda e o que não muda na adaptação:

| Troque | Preserve |
|---|---|
| marca, copy, setor, paleta, fontes | medidas em px, durações em ms, easings nomeados |
| URLs de asset → caminhos locais + placeholder | a estrutura de estado e a lógica de interação |
| stack, quando o destino for outro | a seção `Do NOT` — e acrescente as suas |

**Prompt de fora quase nunca declara intenção.** Ele descreve layout, medida e
efeito, e nada sobre o que a pessoa deve sentir. Ao adaptar, acrescente a linha —
uma palavra de emoção-alvo e, se couber, o ritmo (impacto → demora → pausa). É a
diferença entre reproduzir a aparência de um site e reproduzir o que fazia ele
funcionar. Ver `${SKILL_DIR}/references/fundamentos-visuais.md` §1.

**O prompt adaptado sai em inglês por padrão.** Os prompts que funcionam estão
em inglês e v0, Lovable e Cursor respondem melhor assim; o relatório em português é
para você entender, o prompt é para a máquina. Se ele preferir em português, faça —
mas avise da troca.

Entregue em bloco de código, pronto para copiar, e diga em uma linha o que você
mudou em relação ao original.

## 6. Ofereça guardar, e o passo seguinte

Prompt adaptado bom é peça nova do acervo:

```bash
python "${SKILL_DIR}/scripts/ingerir.py" <arquivo>.md --id <slug> \
  --setor <setor> --estrutura <estrutura> \
  --quando-usar "..." --nao-usar-quando "..."
python "${SKILL_DIR}/scripts/indexar.py"
```

Se ele vai construir agora a partir dele: `kit-montar`.

## Armadilhas

- **Não traduza código.** Nomes de classe Tailwind, hex, easings, nomes de fonte,
  chaves de objeto e trechos em bloco ficam intactos. Traduzir `cubic-bezier` para
  "curva cúbica" transforma um prompt executável em redação.
- **URL viva não é URL sua.** Mesmo respondendo 200, `figma.site` e `cloudfront` são
  buckets de terceiro: podem cair amanhã e não são licenciados para o seu cliente.
  Vivo significa "dá para ver a referência", não "dá para publicar".
- **Prompt curto mente sobre escopo.** Prompt de 40 linhas dizendo "landing completa"
  costuma render um hero e cinco seções vazias. Diga isso antes, não depois.
- **Não conte seção que o prompt não pediu.** Se ele descreve só o hero, o relatório
  tem uma seção. Completar a página por conta própria é a forma mais rápida de o
  usuário construir algo que ele não pediu.
