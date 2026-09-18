# Manual Horus OS — referência e histórico

Detalhe que **não** precisa ser lido em toda sessão. O `CLAUDE.md` da raiz guarda
as regras permanentes e aponta pra cá quando o detalhe faz falta. Consultar sob demanda.

---

## Impeccable — instalação, versão e mecânica

> Versão instalada verificada em 10/08/2026: **`4.0.4`** (`version:` do
> `.claude/skills/impeccable/SKILL.md`). Reinstalar num clone novo:
> `npx --yes impeccable@4.0.4 install`.

Até 07/08/2026 a Horus usava só o detector, via `npx`. Em 08/08/2026 o pacote completo
foi instalado: a skill `/impeccable` (23 comandos), 4 agentes e 2 hooks. O motivo da
rejeição original (a convenção `DESIGN.md` colidir com `marca.md`/`briefing.md`) foi
resolvido pela regra de contexto por cliente (par `PRODUCT.md`/`DESIGN.md` na pasta do
cliente, nunca na raiz).

**Onde cada peça mora:**

| Peça | Caminho | Versionado? |
|---|---|---|
| Skill (23 comandos) | `.claude/skills/impeccable/` | ❌ dependência, 2 MB de terceiro |
| 4 agentes | `.claude/agents/impeccable-*.md` | ✅ |
| 2 hooks | `.claude/settings.json` | ✅ |
| Exceções do detector | `.impeccable/config.json` | ✅ |

Sem a pasta da skill, os hooks viram no-op silencioso e o `/verificar` segue via `npx` —
nada quebra, só deixa de acontecer.

**Os hooks** rodam depois de todo Edit/Write em arquivo de UI (`.html`, `.css`, `.tsx`,
`.jsx`, `.vue`, `.svelte`, `.astro`) e uma passada completa no Stop. Markdown não dispara
nada (trabalho em `_memoria/` e briefing é silencioso). Os slides de carrossel foram
testados e **não** dão falso positivo, apesar do piso de 34px.

**Versões visualmente divergentes (não só reskin):** o 4.0 tem o torneio de conceitos —
`node .claude/skills/impeccable/scripts/concept-seed.mjs --scope direction --mode
<persuade|operate|read|experience>` de dentro da pasta do cliente (usa `process.cwd()` e
exige `PRODUCT.md` ali). Sem rodar esse script, as versões convergem pro padrão (foi o que
aconteceu nas primeiras tentativas do Grão da Serra).

**Comandos por risco:**
- `init`, `document`, `extract` — escrevem `PRODUCT.md`/`DESIGN.md`. Só com `--target`
  apontando pra pasta do cliente.
- `bolder`, `delight`, `overdrive`, `clarify` — mexem em copy/tom. Em cliente regulado, o
  texto passa pelo compliance antes de existir no arquivo.
- `live` — abre navegador e servidor local. Não usar em entrega de cliente sem o Marcelo.
- `audit`, `critique`, `polish`, `layout`, `typeset`, `optimize`, `harden`, `adapt` — os
  mais seguros: mexem em mecânica, não em afirmação.

---

## Ferramentas de estilo (meta-skills)

O mapa completo está em `identidade/catalogo-estilos.md`. As meta-skills sempre disponíveis:

- **ui-ux-pro-max** (plugin) — banco pesquisável de estilos/paletas/fontes/UX. Descobrir
  paleta/fonte quando a marca do cliente é vaga.
- **taste-skill** (`design-taste-frontend`) — anti-template para site/landing/portfólio.
- **shadcn** — CLI de componentes React/Tailwind. Só se o cliente for construir site/CRM em
  React; não serve pra carrossel (HTML → imagem).
- **design-dna** (28/08/2026) — extrai/define/aplica identidade de uma referência (tokens,
  estilo, efeitos).
- **frontend-design** (Anthropic, 28/08/2026) — direção de design intencional, anti-template.
- **scrollcraft** (28/08/2026) — landing scroll-driven premium; usar com `60-motion.md`.
- **3d-grabber** — ⚠️ NÃO é skill, é extensão de Chrome (em `ferramentas/`). Captura assets
  3D; carregar via `chrome://extensions` (modo dev). Não invocável pelo Claude.

**Estilos de marca (~33 skills):** cada nome em `.claude/skills/<nome>/` é um guia de tokens
de uma estética nomeada, agrupados por vibe no catálogo.

---

## Cannonball / kit-* — instalação

Dez skills `kit-*` do [cannonball](https://github.com/harebeats/cannonball) rodam o acervo
de peças reutilizáveis. Acervo (NOSSO) em `_biblioteca/acervo/`; motor de terceiro
gitignorado em `_biblioteca/cannonball/`. Vinculado pelo ponteiro `~/.cannonball/aonde`
(per-machine). Re-vincular num clone novo:
`python .claude/skills/kit-buscar/scripts/vincular.py --para "<repo>/_biblioteca"`.

Ciclo: antes de gerar hero/seção/componente do zero, `kit-buscar`; ao criar algo bom,
`kit-ingerir`; bug que custou tempo vira linha em `armadilhas.json` da peça.

---

## Geração de mídia — histórico (superado)

De 26/08 a 06/09/2026 o Higgsfield esteve ativo (plano starter, GPT Image 2) e gerou as
imagens 3D do site institucional; antes (05/08) já tinha sido cancelado uma vez. Em
07/09/2026 o Marcelo abandonou de vez ("não vale a pena") e as 8 skills `higgsfield-*` foram
removidas. Não reinstalar, não rodar o CLI, não recomendar. (A `OPENAI_API_KEY` nunca
existiu; o fal.ai segue só como ideia pendente da chave.)

---

## O Conselho — estrutura

Sistema de deliberação em `_conselho/` (portado do `/conclave` do Mega Brain). Mapa completo
em `_conselho/README.md`; escala de risco e bloco anti-teatro em
`_conselho/DINAMICA-E-LIMITES.md`.

Seis cargos em `_conselho/cargos/`: estrategista, criação, mídia, financeiro, operações,
compliance. Três meta-avaliadores em `_conselho/conselho/`. As 7 mentes
(`_conselho/mentes/`): Hormozi (oferta/escala), Cole Gordon (venda high-ticket), Jeremy
Miner (NEPQ), Jeremy Haynes (mídia paga/funil), G4 (comercial BR), Full Sales System
(calibração BR), The Scalable Company (sistematizar/delegar).

Regras internas: afirmação factual cita `^[ARQUIVO:SEÇÃO]`, rastreabilidade < 70% pausa a
sessão; confiança final < 50% não emite decisão (escala pro Marcelo); a sessão grava log em
`_conselho/logs/` com a divergência preservada.

---

## Inventário de pastas do workspace

- `_memoria/` — a agência (quem somos, como trabalhamos, foco). Inclui `integridade.md`.
- `_memoria/design/` — o que a agência sabe sobre site. Leitura obrigatória antes de HTML.
- `_memoria/conteudo/` — o que a agência sabe sobre carrossel/post.
- `_conselho/` — sistema de decisão (constituição, cargos, mentes, meta-avaliadores).
- `_conhecimento/network/` — o oráculo do network destilado (desde 03/09/2026). Cards dos 4
  grupos via Q&A do NotebookLM: preço, mensalidade, stack, travas legais. **Consultar antes
  de precificar site/sistema.** Material privado: extrair princípio, nunca colar frase/nome,
  nunca usar em peça de cliente. Regras no `README.md` da pasta.
- `equipe/` — SOW de cada função, com tipo de executor e autonomia.
- `referencias/` — teardowns de sites reais, da agência inteira (skill `/estudar-site`). Não
  confundir com `clientes/<nome>/referencias-*/` (material daquele cliente só).
- `_biblioteca/` — arsenal reutilizável em duas camadas: `motion/` (GSAP/Lenis/WebGL
  vendorizados + snippets, doutrina em `60-motion.md`) e `inspiracoes/` (fichas de padrão de
  componente/interação). Serve a casa inteira, não a um cliente.
- `identidade/` — marca **da agência** (peças institucionais); `design-guide.md` preenchido
  em 04/08/2026.
- `templates/` — modelos do Horus OS (perfis de `CLAUDE.md`, catálogo, identidade).
- `dados/`, `marketing/`, `scripts/` — esqueleto do Horus OS, hoje só `README.md`.
- `portfolio/` — peças conceituais da casa (desde 27/08/2026): `amendoa-preta/`,
  `soleira-interiores/`. Cada uma com `PLANO.md`. ⚠️ Ao apresentar: "projeto nosso", nunca
  "cliente nosso". Detalhe em `portfolio/README.md`.
- `saidas/` — arquivo solto de trabalho. Não é entrega (entrega mora na pasta do cliente).
- `ferramentas/` — ferramentas externas/infra própria (desde 28/08/2026):
  - `hound-dog/` (desde 17/09/2026) — o CRM oficial, no ar em
    https://hound-dog-omega.vercel.app, com o Farejador. Ver a seção Hound Dog no CLAUDE.md e
    o `CLAUDE.md` da pasta.
  - `3d-grabber/` — extensão de Chrome MV3 (captura assets 3D; `chrome://extensions`, modo dev).
  - `mcp-prospeccao/` — servidor MCP local (stdio via `.mcp.json`, desde 29/08/2026):
    `check_site`, `lookup_cnpj`. Audita o que o Gemini Spark traz. Ver o `README.md` da pasta.
  - `pronto-app/` — POC de CRM open-source (Next.js + Supabase, gitignorado); decisão
    versionada em `ferramentas/pronto.md`.
  - `ponte-spark/` (desde 08/09/2026) — Gemini Spark → Google Sheets → **publicar na web como
    CSV** → Horus lê via Firecrawl. URLs em `ferramentas/ponte-spark/fontes.md`. Link
    compartilhado não serve, só "publicar na web".
- `site/` — site institucional da própria Hórus (por isso mora na raiz). Tem `CLAUDE.md` e
  `PLANO.md` próprios: ler os dois antes de mexer. Estudo das dez referências em
  `referencias/agencias-ia-dez-sites.md`.
- `clientes/<nome>/` — cada cliente: `briefing.md` + `marca.md` + entregas (+ `CLAUDE.md`).

⚠️ Subir sistema hospedado pra cliente vira serviço gerenciado com mensalidade — decisão de
`/conselho` (ver `project_software-hospedavel`).
