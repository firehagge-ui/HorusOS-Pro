# MazyOS — Sistema operacional do negócio

Sua empresa roda em cima desse arquivo. Aqui ficam as regras de operação
do MazyOS — como o Claude lê o contexto, aprende com correções, mantém
tudo atualizado e cria skills novas conforme a operação evolui.

Esse arquivo é editável. Quando o `/instalar` rodar, ele complementa o
final dessa página com as regras específicas do seu negócio.

---

## Contexto do negócio

No início de toda conversa, ler os seguintes arquivos (quando existirem
e estiverem preenchidos):

1. `_memoria/empresa.md` — quem é o usuário, o que faz, como funciona o negócio
2. `_memoria/preferencias.md` — tom de voz, estilo de escrita, o que evitar
3. `_memoria/estrategia.md` — foco atual, prioridades, prazos

Usar essas informações como base pra qualquer resposta ou decisão. Ao
sugerir prioridades, formatos ou abordagens, considerar o foco atual
descrito em `estrategia.md`.

Pra qualquer tarefa visual (carrossel, post, landing page), consultar
`identidade/design-guide.md` como referência de estilo.

Não é necessário listar o que foi lido nem confirmar a leitura. Apenas
usar o contexto naturalmente.

---

## Fluxo de trabalho

Antes de executar qualquer tarefa, verificar se existe skill relevante
em `.claude/skills/`. Se encontrar, seguir as instruções da skill. Se
não encontrar, executar a tarefa normalmente.

Ao concluir uma tarefa que não tinha skill mas parece repetível (o
usuário provavelmente vai pedir de novo no futuro), perguntar:

> "Isso pode virar uma skill pra próxima vez. Quer que eu crie?"

Não perguntar pra tarefas pontuais ou perguntas simples. Só quando o
padrão de repetição for claro.

---

## Aprender com correções

Quando o usuário corrigir algo, melhorar uma resposta ou dar uma
instrução que parece permanente (frases como "na verdade é assim", "não
faça mais isso", "prefiro assim", "sempre que...", "evita...", "da
próxima vez..."), perguntar:

> "Quer que eu salve isso pra não precisar repetir?"

Se sim, identificar onde faz mais sentido salvar:

- **Sobre o negócio** (clientes, serviços, mercado) → `_memoria/empresa.md`
- **Sobre preferências e estilo** (tom de voz, formato, o que evitar) → `_memoria/preferencias.md`
- **Sobre prioridades e foco** (projetos, metas, prazos) → `_memoria/estrategia.md`
- **Regra de comportamento nessa pasta** → próprio `CLAUDE.md`

Salvar com uma linha nova clara, sem reformatar o arquivo inteiro.
Confirmar mostrando a linha adicionada.

Não perguntar se a correção for óbvia de contexto imediato (ex: "na
verdade o arquivo se chama X"). Só perguntar quando a informação tiver
valor duradouro.

---

## Manter contexto atualizado

Ao terminar uma tarefa que mudou algo relevante (cliente novo, skill
nova, mudança de foco, processo novo, ferramenta instalada, estrutura
alterada), perguntar:

> "Isso mudou algo no teu contexto. Quer que eu atualize a memória?"

Se sim, identificar o que atualizar:

- **Cliente, serviço, ferramenta, equipe** → `_memoria/empresa.md`
- **Mudança de prioridade ou foco** → `_memoria/estrategia.md`
- **Tom ou estilo** → `_memoria/preferencias.md`
- **Pasta, regra de organização, skill criada** → `CLAUDE.md`
- **Visual (cores, fontes, logo)** → `identidade/design-guide.md`

Mostrar o que vai mudar antes de salvar. Não reformatar o arquivo
inteiro, só adicionar ou editar a linha relevante.

**Quando NÃO perguntar:**
- Tarefas pontuais sem impacto no contexto (escrever um email avulso, criar um post)
- Perguntas simples ou conversas sem ação
- Mudanças já salvas pelo bloco "Aprender com correções"

**Dica:** rode `/atualizar` pra uma varredura completa quando houver dúvida.

---

## Criação de skills

Quando o usuário pedir skill nova:

1. Verificar se existe template relevante em `templates/skills/`. Se
   existir, usar como base e adaptar pro contexto
2. Perguntar se é específica desse projeto ou útil em qualquer:
   - Específica → `.claude/skills/nome-da-skill/SKILL.md` (local)
   - Universal → `~/.claude/skills/nome-da-skill/SKILL.md` (global)
3. Ler `_memoria/empresa.md` e `_memoria/preferencias.md` pra calibrar
   o conteúdo da skill ao contexto do negócio
4. Se a skill precisar de arquivos de apoio (templates, exemplos),
   criar dentro da pasta da skill
5. Seguir o fluxo da skill-creator nativa do Claude Code

---

## Trabalho de site: leitura obrigatória

Antes de escrever a primeira linha de HTML de qualquer site ou landing page, ler:

1. `_memoria/design/00-anatomia.md` — o passe duplo, o elemento-assinatura e a
   estrutura que funciona, seção por seção
2. `_memoria/design/90-antipadroes.md` — o que denuncia site feito por IA
3. `_memoria/design/99-checklist.md` — o que conferir antes de entregar
4. `_memoria/design/50-copy-de-interface.md` — se a peça tem formulário, botão,
   bot ou qualquer texto de interface
5. `referencias/README.md` — se já existe teardown do segmento do cliente

**O passe duplo do `00-anatomia.md` não é opcional:** escrever o plano (cor, tipo,
layout, assinatura), atacar o plano com a pergunta "eu chegaria aqui em qualquer
cliente desse segmento?", revisar o que for genérico, e **só então** abrir o
editor.

Antes de **entregar**, rodar o checklist, a varredura de antipadrões, e o detector:

```
node .claude/skills/impeccable/scripts/detect.mjs "clientes/<nome>/site"
```

Se a skill não estiver instalada nesse clone, o mesmo detector roda via
`npx --yes impeccable@3.5.0 detect "clientes/<nome>/site"`.

Saída `0` é limpo, `2` achou coisa. Regra de acessibilidade (`low-contrast`,
`undersized-ui-text`, `tiny-text`, `skipped-heading`) se corrige, não se dispensa.
Dispensa exige `--reason` e fica registrada em `.impeccable/config.json`. Detalhe
em `.claude/skills/verificar/SKILL.md`. Se o comando não rodar (rede, node), o item
é declarado **não verificado**, nunca ok.

Em site novo, estudar de 3 a 5 concorrentes reais do segmento do cliente com a
skill `/estudar-site` antes de propor estrutura. Concorrente do nicho ensina mais
que galeria premiada, porque carrega a expectativa formada daquele público.

Quando o Marcelo corrigir algo de design, a correção vira linha em
`_memoria/design/90-antipadroes.md` **com o porquê junto**. Correção que morre no
chat volta como erro no próximo site: o Claude não guarda nada entre conversas,
só o que está em arquivo.

Para peça visual que não é site (carrossel, post, anúncio), vale a seção abaixo
mais o roteamento de estilo.

---

## Trabalho de carrossel e post: leitura obrigatória

Antes de escrever a primeira linha de copy de carrossel, post ou story, ler:

1. `_memoria/conteudo/00-formatos.md` — os sete formatos narrativos. **Escolher UM
   antes de escrever.** Formato é por que o slide 4 existe; layout é como ele
   parece. As duas coisas são escolhidas, nessa ordem
2. `_memoria/conteudo/10-legibilidade.md` — os pisos de fonte, contraste e
   densidade. Corpo tem piso de 34px e nada de leitura fica abaixo de 24px:
   a peça é renderizada a 1080px e lida num celular de 390px
3. `_memoria/conteudo/90-antipadroes.md` — o que denuncia carrossel feito por IA
4. `_memoria/integridade.md` — dado que falta vira `[FALTA: ...]` marcado

Antes de **entregar**, rodar `_memoria/conteudo/99-checklist.md`: condições de
veto primeiro, rubrica depois. Se a conferência não rodou nesta mensagem, não dá
pra dizer que passou.

O conteúdo dessa pasta foi extraído do `opensquad` em 03/08/2026. O framework
**não** foi adotado, e o motivo está escrito em
`_memoria/conteudo/91-o-que-veio-do-opensquad.md` — junto com duas decisões que
continuam abertas pro Marcelo (contador de slide, e travar identidade de
carrossel por cliente).

Quando o Marcelo corrigir algo de peça social, a correção vira linha em
`_memoria/conteudo/90-antipadroes.md` **com o porquê junto**, mesma regra do site.

---

## Impeccable (instalado por inteiro em 08/08/2026)

Até 07/08/2026 a Horus usava **só** o detector, via `npx`. Em 08/08/2026 o pacote
completo foi instalado: a skill `/impeccable` com 23 comandos, os 4 agentes e os
dois hooks. O motivo da rejeição original (a convenção `DESIGN.md` colidir com
`marca.md` e `briefing.md`) foi resolvido, não ignorado — está na regra de
contexto por cliente, abaixo.

**O que está onde:**

| Peça | Caminho | Versionado? |
|---|---|---|
| Skill (23 comandos) | `.claude/skills/impeccable/` | ❌ dependência, 2 MB de terceiro |
| 4 agentes | `.claude/agents/impeccable-*.md` | ✅ |
| 2 hooks | `.claude/settings.json` | ✅ |
| Exceções do detector | `.impeccable/config.json` | ✅ |

Reinstalar num clone novo: `npx --yes impeccable@3.5.0 install`. Sem a pasta da
skill, os hooks viram no-op silencioso e o `/verificar` segue funcionando via
`npx` — nada quebra, só deixa de acontecer.

**Os hooks:** rodam depois de todo Edit/Write em arquivo de UI (`.html`, `.css`,
`.tsx`, `.jsx`, `.vue`, `.svelte`, `.astro`) e uma passada completa no Stop.
Markdown não dispara nada, então trabalho em `_memoria/` e briefing é silencioso.
Os slides de carrossel foram testados e **não** dão falso positivo, apesar do piso
de 34px de `_memoria/conteudo/10-legibilidade.md`.

### ⚠️ A ordem de precedência (o que vence o quê)

O impeccable manda "go all out", "dream big and bold" e "the brief wins". Isso é
bom conselho de design e **péssimo conselho pra cliente de conselho regulado**.
A ordem, do mais forte pro mais fraco:

```
compliance do cliente (CFO / CFP)  >  integridade.md  >  briefing.md + marca.md
  >  _memoria/design/ e _memoria/conteudo/  >  impeccable
```

Na prática:

- **Compliance trava**, sempre. O impeccable não conhece CFO nem CFP: um
  `/impeccable bolder` pode sugerir superlativo, promessa de resultado ou
  depoimento. Recusar sem negociar.
- **`marca.md` do cliente vence** a direção visual que o impeccable propuser. O
  impeccable preenche o que a marca deixou em aberto, não substitui a marca.
- **`integridade.md` vence** o impulso de completar. Nenhum comando do impeccable
  autoriza inventar número, formação ou depoimento pra "fechar" o layout: o que
  falta vira `[FALTA: ...]`.
- O detector continua sendo **prova**, não opinião — o `/verificar` não muda.

### ⚠️ `DESIGN.md` e `PRODUCT.md`: nunca na raiz

O impeccable resolve contexto pela **pasta mais próxima do alvo** que tem
`PRODUCT.md`. Isso foi testado neste repo e funciona: com `PRODUCT.md` em
`clientes/aion-psicologia/`, o `projectRoot` dele passa a ser essa pasta.

- ❌ **Proibido** `DESIGN.md` ou `PRODUCT.md` na raiz. A raiz tem cinco clientes
  com cinco marcas diferentes mais o site da própria Horus. Um `DESIGN.md` de
  raiz achataria os cinco num só, que é exatamente a colisão que fez o pacote
  ser rejeitado da primeira vez.
- ✅ Se for usar, um par por cliente: `clientes/<nome>/PRODUCT.md` e
  `clientes/<nome>/DESIGN.md`, **derivados** do `briefing.md` e do `marca.md`
  daquele cliente — nunca concorrendo com eles. `briefing.md` e `marca.md`
  continuam sendo a fonte; o par do impeccable é tradução pra ferramenta.
- ✅ Pro site da agência, o par vai em `site/`, junto do `CLAUDE.md` e do
  `PLANO.md` que já moram lá.
- Rodar `/impeccable init` **sem `--target`** aponta pra raiz. Sempre passar o
  alvo: `--target clientes/<nome>/site/index.html`.

### Comandos que pedem cuidado

- `/impeccable init`, `document`, `extract` — escrevem `PRODUCT.md`/`DESIGN.md`.
  Só com `--target` apontando pra pasta do cliente (regra acima).
- `/impeccable bolder`, `delight`, `overdrive`, `clarify` — mexem em copy e tom.
  Em cliente regulado, o texto que sair passa pelo compliance antes de existir no
  arquivo.
- `/impeccable live` — abre navegador e servidor local. Não usar em entrega de
  cliente sem o Marcelo estar junto.
- `/impeccable audit`, `critique`, `polish`, `layout`, `typeset`, `optimize`,
  `harden`, `adapt` — os mais seguros aqui: mexem em mecânica, não em afirmação.

---

## Sistema de estilos de design

O mapa completo das skills de design está em
**`identidade/catalogo-estilos.md`** — consultar sempre que for escolher
um estilo visual. As skills se dividem em dois níveis:

**Ferramentas (meta-skills, sempre disponíveis):**
- **ui-ux-pro-max** (plugin) — banco pesquisável de estilos, paletas,
  fontes e UX. Usar pra descobrir paleta/fonte quando a marca do cliente
  for vaga.
- **taste-skill** (`design-taste-frontend`) — anti-template. Usar em
  **site / landing page / portfólio** pra fugir do visual "cara de IA".
- **shadcn** — CLI de componentes React/Tailwind. Só se o cliente for
  construir site/CRM em React; não serve pra carrossel/post (HTML → imagem).

**Estilos de marca (~33 skills, escolher UM):** cada nome em
`.claude/skills/<nome>/` é um guia de tokens de uma estética nomeada,
agrupados por vibe no catálogo (Premium & Elegante, Limpo & Minimalista,
Corporativo & Confiável, Humano & Acolhedor, Ousado & Vibrante).

### Regra de roteamento de estilo (aplicar antes de qualquer peça visual)

1. Cliente tem estilo definido em `clientes/<nome>/marca.md`? → **usa esse.**
2. O usuário nomeou um estilo ("no estilo editorial", "mais ousado")? →
   invocar a skill daquele estilo (Skill tool) e aplicar os tokens.
3. Ninguém definiu? → olhar o segmento/vibe do cliente no catálogo,
   escolher UM grupo, **sugerir 1-2 estilos e perguntar** antes de produzir.

Sempre **UM estilo por peça** — nunca misturar dois. Se o estilo brigar
com a `marca.md` do cliente, **a marca do cliente vence** (o estilo só
preenche o que a marca deixou em aberto).

---

## Firecrawl (pesquisa web)

MCP configurado em `.mcp.json` (raiz do projeto, fora do git — chave de
API fica só localmente). Ferramentas disponíveis: busca, scrape de
página única, crawl de site inteiro, extração estruturada, parsing de
documentos e monitoramento de páginas por mudança.

Útil pras skills `seo`, `analisar-dados`, `relatorio-ads` e
`responder-avaliacoes` quando precisar pesquisar concorrentes ou extrair
conteúdo de páginas que a busca simples não dá conta. Pra perguntas
pontuais e rápidas, a busca nativa ainda resolve sem gastar crédito.

---

## Geração de imagens (API da OpenAI)

Higgsfield foi cancelado (poucos créditos por mês) — removido do `.mcp.json` em
05/08/2026. Geração de imagem agora é via **API da OpenAI**, direto (sem MCP),
usada pela skill `/carrossel` quando `OPENAI_API_KEY` estiver configurada no
`.env` local. É cobrança por uso (pay-as-you-go), separada de qualquer
assinatura do ChatGPT (Plus/Go/Pro) — precisa de chave própria em
platform.openai.com com cartão cadastrado.

Usar para imagens de site e peça. Em cliente regulado, a imagem também passa pelo
compliance (Dr. Giovanni: sem paciente, sem antes/depois, sem promessa; só
tecnologia, ambiente e laboratório).

---

## Fluxo com o Mega Brain (estratégia → produção)

O usuário mantém o Mega Brain (sistema separado, pasta própria) como
camada de estratégia/diagnóstico. O fluxo de trabalho padrão é:

1. **Mega Brain** — o usuário estuda o cliente/lead lá (diagnóstico,
   dores, estratégia, decisões com a metodologia dele)
2. **MazyOS (aqui)** — o usuário traz o documento/diagnóstico pronto e
   o MazyOS **produz e publica**: site, carrossel, anúncio, relatório

Divisão de papéis: Mega Brain decide o quê/por quê; MazyOS executa.
Quando o usuário mandar um documento de diagnóstico/estratégia vindo do
Mega Brain, tratar como briefing pronto — não refazer a análise
estratégica, ir direto pra produção (perguntando só o que faltar de
informação prática).

Quando o Mega Brain precisar de dados externos (dossiê de lead,
concorrentes), o Firecrawl daqui gera o material pro usuário ingerir lá.

---

## O Conselho (decisão difícil)

Sistema de deliberação em `_conselho/`, portado do `/conclave` do Mega Brain e
adaptado pra Horus. Serve pra decisão que não deve sair de uma opinião só.

- `/conselho <pergunta>` — sessão completa: Constituição → debate entre cargos →
  Crítico Metodológico (score 0-100) → Advogado do Diabo (6 perguntas) →
  Sintetizador (decisão, confiança, riscos, reversão)
- `/debate <pergunta>` — só o debate entre cargos, versão leve

Seis cargos em `_conselho/cargos/`: estrategista, criação, mídia, financeiro,
operações e **compliance**. Três meta-avaliadores em `_conselho/conselho/`.
Mapa completo em `_conselho/README.md`.

**As 7 mentes** (`_conselho/mentes/`) são a doutrina que os cargos citam: Alex
Hormozi (oferta e escala), Cole Gordon (venda high-ticket), Jeremy Miner (NEPQ),
Jeremy Haynes (mídia paga e funil), G4 Educação (comercial no Brasil), Full Sales
System (calibração BR) e The Scalable Company (sistematizar e delegar).

- `/consultar <mente> <pergunta>` — uma lente só, sem rito
- `/comparar <m1>,<m2> <pergunta>` — duas doutrinas lado a lado, sem síntese

⚠️ **É material americano de high ticket.** Número delas é benchmark estrangeiro:
citar como referência, nunca como meta da Horus nem como promessa ao cliente. A
mente `full-sales-system` existe justamente pra contestar número importado. E
tática de urgência, escassez, depoimento ou promessa não passa em cliente
regulado, por mais canônica que seja: **compliance vence a mente.**

**Regras que atravessam:**
- Cliente de setor regulado convoca **Compliance obrigatoriamente**, e o veto
  dele **trava** a decisão (não é ponderado na síntese)
- Toda afirmação factual cita `^[ARQUIVO:SEÇÃO]`. Rastreabilidade abaixo de 70%
  pausa a sessão
- Confiança final abaixo de 50% não emite decisão: escala pro Marcelo com opções
- Sessão de `/conselho` grava log em `_conselho/logs/`, com a divergência
  preservada, não só a decisão
- **Não invocar por hábito.** Se a resposta está num arquivo, é consulta. Se é
  execução, é pra fazer. Se é gosto do Marcelo, ele decide. Ver a escala de risco
  e o bloco anti-teatro em `_conselho/DINAMICA-E-LIMITES.md`

---

## Integridade e verificação

**`_memoria/integridade.md` é leitura obrigatória antes de escrever qualquer coisa
sobre um cliente.** Regra central: nada de número, formação, diferencial ou
depoimento inventado. Dado que falta vira **placeholder marcado**
(`[FALTA: telefone ativo]`), nunca texto plausível. Fortificar o que o cliente
disse é permitido; inventar o que ele não disse, não. Numa agência que produz para
profissional de saúde, texto inventado é informação falsa publicada sob o CRO ou
o CRP de alguém.

**`/verificar` antes de declarar qualquer coisa pronta.** Declarar completo sem
conferir não é eficiência, é desonestidade. Se a checagem não rodou nesta
mensagem, não dá pra dizer que passou. Pendência declarada é profissional;
pendência escondida atrás de "está pronto" quebra confiança.

---

## Equipe (SOW por função)

`equipe/` tem a descrição de cada função da operação: gestor de tráfego, designer,
redator, prospecção, atendimento e relatórios. Cada uma diz o tipo de executor
(Agente, Híbrido ou Humano), o nível de autonomia, as tarefas, os gatilhos de
escalação e os KPIs.

Serve pra delegar quando entrar gente, pra saber onde a IA pode assumir sozinha, e
como peça de venda quando o cliente perguntar quem cuida da conta dele.

**Cliente de setor regulado derruba a autonomia de qualquer função**: peça clínica
não publica sem revisão do profissional responsável.

---

## Perfil deste workspace — Agência (Horus)

> Bloco preenchido no setup. A Horus é uma **agência de marketing digital com
> IA** (opera sobre o sistema MazyOS). Este workspace é a operação da agência:
> cada cliente tem pasta própria e autossuficiente em `clientes/<nome>/`.
> Contexto da agência em `_memoria/`.

**Estrutura:**
- `_memoria/` — a agência (quem somos, como trabalhamos, foco atual). Inclui
  `integridade.md`, leitura obrigatória antes de escrever sobre cliente
- `_memoria/design/` — o que a agência sabe sobre site. Leitura obrigatória antes
  de qualquer HTML (ver seção acima)
- `_memoria/conteudo/` — o que a agência sabe sobre carrossel e post: formatos
  narrativos, pisos de legibilidade, antipadrões, checklist. Leitura obrigatória
  antes de qualquer copy de peça social
- `.impeccable/config.json` — exceções do detector de design, cada uma com o
  motivo escrito. Versionado de propósito. O impeccable **completo** foi
  instalado em 08/08/2026 (antes disso só o detector rodava): ver a seção
  "Impeccable" mais abaixo
- `_conselho/` — sistema de decisão: constituição, cargos, mentes, meta-avaliadores
- `equipe/` — descrição das funções da operação (SOW), com tipo de executor e autonomia
- `referencias/` — biblioteca de teardowns de sites reais, da agência inteira.
  Gerada pela skill `/estudar-site`. **Não confundir** com
  `clientes/<nome>/referencias-*/`, que é material daquele cliente só
- `identidade/` — marca **da agência** (peças institucionais). O `design-guide.md`
  foi preenchido em 04/08/2026 e deixou de ser buraco declarado
- `templates/` — modelos do MazyOS: perfis de `CLAUDE.md`, catálogo de ferramentas
  e exemplos de identidade. Base para skill nova (ver "Criação de skills" acima)
- `dados/`, `marketing/`, `scripts/` — pastas do esqueleto do MazyOS, hoje só com
  `README.md`. Vazias de propósito até a operação pedir
- `saidas/` — arquivo solto de trabalho (imagens geradas, logo de cliente). Não é
  entrega: entrega mora na pasta do cliente
- `site/` — **site institucional da própria Hórus**, não de cliente. Por isso mora
  na raiz e não em `clientes/`. Tem `CLAUDE.md` e `PLANO.md` próprios: ler os dois
  antes de mexer em qualquer coisa visual lá. O estudo das dez referências que
  definiram a linguagem está em `referencias/agencias-ia-dez-sites.md`
- `clientes/<nome>/` — cada cliente: `briefing.md` (dossiê completo) + `marca.md`
  (identidade visual do cliente) + entregas

**Regras:**
- Cliente novo → criar `clientes/<nome>/` com `briefing.md` e `marca.md`
- Ao produzir PARA um cliente, ler o `briefing.md` e o `marca.md` dele. A marca
  visual das peças é a do cliente (`clientes/<nome>/marca.md`), **não** a de `identidade/`
- Produzir por prioridade, um bloco por vez. Nada de "product-dump"
- Cliente de setor regulado: o compliance do cliente **trava** a entrega

### Cliente #1 — Dr. Giovanni Nascimento (Implantodontia, Salvador/BA)

Pasta: `clientes/dr-giovanni-nascimento/`. Clínica premium de implantodontia,
foco B2C. Máquina: **SITE** → BOT+CRM → CARROSSEL → TRÁFEGO.

⚠️ **Fora da linha de frente desde 26/07/2026** (decisão do Marcelo: a prioridade
da agência é a Aion). O site continua sendo o bloco dele, mas antes de retomar é
preciso definir qual das **quatro versões de home** vale (`index.html`,
`index-novo.html`, `index-editorial.html`, `index-taste.html`) e arquivar as outras.

**⚠️ Compliance CFO — trava toda entrega (site, post, bot, ad):**
Publicidade odontológica = CFO / Código de Ética (Res. CFO-118/2012) + Res. CFO-196/2019 (publicidade e imagens).
- **Obrigatório:** CRO-BA 16772 + responsável técnico visíveis; linguagem
  informativa; depoimento só com autorização; consentimento LGPD.
- **Proibido:** antes/depois NO SITE (pessoa jurídica é vedada pela 196/2019 — ver nota abaixo); promessa/garantia de resultado; preço/promoção como
  chamariz; superlativo ("o melhor", "nº 1"); conselho clínico que substitua consulta.
- **Antes/depois (196/2019):** não é proibição absoluta, é permissão restrita. Só o **próprio Dr. (pessoa física)** que executou pode divulgar (diagnóstico=antes, resultado final=depois), com TCLE assinado + nome/CRO/especialidade, sem o "durante". **Clínica/site (pessoa jurídica) NÃO pode.** Site segue sem antes/depois; IA simulando antes/depois também é vedada.
- **Conteúdo automático (carrossel/bot):** nada clínico publica sem revisão humana do Dr./RT.

Na dúvida entre copy mais vendedora e compliance, **o compliance vence.** Grafia
correta do nome: **"Giovanni"** (logo atual grafa "Geovani" — pendência).

### Cliente #2 — Jaqueline (Permita-se Fitness, Salvador/BA)

Pasta: `clientes/permita-se-fitness/`. Estúdio multi-modalidade (hidroginástica,
pilates, zumba, boxe, dança, ballet kids, nutricionista), Boca do Rio. Presença
digital em zero — sem Instagram ativo, sem site. Máquina: **GOOGLE MEU NEGÓCIO**
(prioridade atual) → Instagram → Site.

Oportunidade identificada na rua (panfleto), não é venda formal — trabalho
posto em prática, em paralelo à fila de prioridade da agência. Sem regulação
pesada (diferente de odonto), mas evitar promessa de resultado físico
garantido nas peças.

### Cliente #3 — Aion Psicologia (Itaigara, Salvador/BA)

Pasta: `clientes/aion-psicologia/`. Clínica de psicologia com mais de 20 anos, equipe
(não é solo). Coordenação: Maria Tutti Cabussú. Seis serviços: atendimento psicológico,
avaliação e intervenção neuropsicológica, orientação familiar, orientação profissional,
grupo de apoio parental. Máquina: **SITE** → link na bio → blog → carrossel automático.

⭐ **Prioridade principal da agência desde 26/07/2026.** O site tem **dez páginas**
prontas: home, contato, política de privacidade, `especialidades.html` (índice) e
**uma página por serviço** (6, desde 30/07/2026). Não falta produção: falta **dado
que só a cliente tem**. O próximo passo real é apresentar pra ela, não continuar
construindo.

**Projeto especulativo:** o site é construído ANTES do "sim", pra ser a peça de venda.
Duas consequências: (1) a marca visual é a do Instagram deles, sem rebranding nessa
fase; (2) dado que não temos vira **placeholder marcado**, nunca texto plausível
inventado — é profissional de saúde.

**Peso igual entre os 6 serviços** (decisão do Marcelo, 23/07/2026). A leitura de que
a Aion é uma clínica de neurodesenvolvimento (briefing §6) vale como narrativa, não
como hierarquia.

**⚠️ Compliance CFP — trava toda entrega:** Res. CFP 011/2018 + Código de Ética.
- **Obrigatório:** CRP de cada profissional e da pessoa jurídica visíveis; linguagem
  informativa e sóbria; sigilo; LGPD se houver formulário.
- **Proibido:** **depoimento de paciente em qualquer formato** (mais restritivo que o
  CFO, que permite com autorização); promessa de cura, resultado ou prazo; antes/depois;
  preço ou promoção como chamariz; superlativo; sensacionalismo; autoteste ou quiz de
  diagnóstico.
- ⚠️ O texto atual deles no MundoPsicologos usa "os melhores profissionais da área".
  É superlativo vedado, não reaproveitar.

Grafia a confirmar: "Cabussú" (Instagram) vs "Cabussu" (Lattes). Homônimo: existe uma
Aion Psicologia em Santa Catarina (@aionpsicologiasc), não é esta.

### Cliente #4 — Nelson (Café Grão da Serra, Brejões/BA)

Pasta: `clientes/grao-da-serra/`. Café torrado 100% arábica, artesanal, **B2B**
(revenda para padaria, mercado, cafeteria, escritório). MEI ativo desde 20/03/2026,
Distrito Serrana, Brejões/BA. Ele opera sozinho e responde o próprio WhatsApp.
Máquina: **GOOGLE MEU NEGÓCIO** (prioridade atual) → SITE institucional → CRM.

Chegou por relação (o sócio do Marcelo já era amigo dele). O site é **de graça, por
portfólio**, depois de a faixa de R$ 2.000 a 2.500 ter sido ancorada. O **CRM foi
pedido por ele e é trabalho pago**, com escopo próprio: não deixar virar extensão
do grátis.

🔴 **A família não tem lavoura.** O pai **compra o grão maduro de produtores** e faz
pilagem, secagem, torra e moagem. Não planta e não colhe. Proibido escrever "nossa
lavoura", "nossa fazenda", "cafezal", "produzimos", "do pé à xícara" — e isso vale
para foto também: cafezal de banco de imagem falseia a origem. O diferencial real é
a escolha do grão e o beneficiamento: **"a gente não planta, a gente escolhe"**.

**O nome é o lugar.** O MEI fica no Distrito Serrana, e "Serrana de Itiruçu/Brejões"
é região cafeeira reconhecida. ⚠️ Mas ainda **não foi confirmado que o grão vem de
lá**: até confirmar, não usar a região, a altitude nem a tradição cafeeira de
Brejões como credencial do produto.

**Homônimos:** `graodaserra.com.br` é de um Café Gourmet de 1995 da Serra da
Mantiqueira/SP, com e-commerce nacional; existe ainda um CAFE GRAO DA SERRA LTDA-ME
em Botelhos/MG. SEO pelo nome é briga perdida — o jogo é local. Registro no INPI não
verificado, e a Horus não dá parecer sobre isso.

**Não é setor regulado** por conselho, mas valem as regras de alimento: sem alegação
de saúde ou funcional, sem superlativo, e nada de jargão de café especial (nota de
degustação, pontuação SCA, altitude, variedade) que o cliente não tenha dito.

### Cliente #5 — Mayara Barros (Psicologia, arte e filosofia, Salvador/BA)

Pasta: `clientes/mayara-barros/`, criada em 03/08/2026. ⚠️ **Não é cliente pagante:**
é a namorada do Marcelo. Mora em `clientes/` porque funciona como conta (briefing,
marca, compliance e entregas recorrentes) e porque as skills da casa leem desse
caminho. Se o Marcelo preferir separar, é só mover a pasta.

Objetivo: sair de Acompanhante Terapêutica e passar a **atender por conta própria**,
online e em Salvador. Máquina: **INSTAGRAM** (foco definido pelo Marcelo). Site e
Google Meu Negócio ficaram de fora por ora. O eixo de conteúdo é dela: arte,
filosofia e psicologia.

Perfil `@universpsiquee`: **0 posts**, 191 seguidores em 03/08/2026. Assinatura dela:
"Ciência com afeto". A `instagram/estrategia.md` e a `instagram/stories.md` estão
prontas. A direção visual **"Galeria"** (pintura clássica de domínio público
emoldurada + ficha técnica + leitura psicológica, modo claro) está travada no
`marca.md`, e o **post #1 "Xeque-Mate + Frankl" está renderizado (8 slides)** via
`build.js` (HTML→PNG). Há um kit em `gpt-projeto/` para carregar essa identidade num
GPT do ChatGPT: a divisão é Claude rascunha e renderiza, ChatGPT opina, Claude
aplica. **Não gerar carrossel por IA de imagem** (quebra texto e falsifica a obra).

**⚠️ Compliance CFP — mesma régua da Aion** (Res. 011/2018): sem depoimento de
paciente em nenhum formato, sem promessa de cura ou prazo, sem autoteste, CRP
visível.

✅ **CRP 03/36219 confirmado ativo** (Marcelo, 03/08): ela está formada, a bio é que
está desatualizada em "estudante". Já pode sair "psicóloga" e o CRP nas peças. Falta
só o **e-Psi** (Res. CFP 011/2018) para liberar o CTA de atendimento **online** —
não trava conteúdo.
