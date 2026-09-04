# Horus OS — Sistema operacional do negócio

Sua empresa roda em cima desse arquivo. Aqui ficam as regras de operação
do Horus OS — como o Claude lê o contexto, aprende com correções, mantém
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

Para site ou landing page do zero, a skill **`/criar-site`** orquestra este fluxo
inteiro na ordem travada (pré-voo → estudo de 3-5 concorrentes reais com
`/estudar-site` → plano com passe duplo → build → `/verificar`). Ela não substitui
a doutrina abaixo, sequencia e obriga o que já está escrito aqui. Usar para começo
do zero; para ajuste pontual num site existente, é edição direta ou `/redesign-skill`.

Antes de escrever a primeira linha de HTML de qualquer site ou landing page, ler:

1. `_memoria/design/00-anatomia.md` — o passe duplo, o elemento-assinatura e a
   estrutura que funciona, seção por seção
2. `_memoria/design/90-antipadroes.md` — o que denuncia site feito por IA
3. `_memoria/design/99-checklist.md` — o que conferir antes de entregar
4. `_memoria/design/50-copy-de-interface.md` — se a peça tem formulário, botão,
   bot ou qualquer texto de interface
5. `_memoria/design/60-motion.md` — a doutrina de movimento (quando/quanto animar,
   o arsenal vendorizado em `_biblioteca/motion/`, a trava de compliance). Ler
   antes de adicionar qualquer animação, background interativo ou efeito de scroll
6. `referencias/README.md` — se já existe teardown do segmento do cliente

**Consulta (não gatilho):** os quatro fundamentos de teoria — `10-tipografia.md`,
`20-cor.md`, `30-layout-espaco.md`, `40-composicao.md` — não entram na leitura
obrigatória acima, pra não inchar o pré-voo. São a camada de *porquê* por baixo do
`90-antipadroes.md`: abrir quando a decisão for daquele assunto (montar a escala de
tipo, a paleta, o ritmo de layout, o foco de uma tela). Cada um fecha ligando o
princípio ao antipadrão que ele explica.

**O passe duplo do `00-anatomia.md` não é opcional:** escrever o plano (cor, tipo,
layout, assinatura), atacar o plano com a pergunta "eu chegaria aqui em qualquer
cliente desse segmento?", revisar o que for genérico, e **só então** abrir o
editor.

Antes de **entregar**, rodar o checklist, a varredura de antipadrões, e o detector:

```
node .claude/skills/impeccable/scripts/detect.mjs "clientes/<nome>/site"
```

Se a skill não estiver instalada nesse clone, o mesmo detector roda via
`npx --yes impeccable@4.0.4 detect "clientes/<nome>/site"`.

Saída `0` é limpo, `2` achou coisa. Regra de acessibilidade (`low-contrast`,
`undersized-ui-text`, `tiny-text`, `skipped-heading`) se corrige, não se dispensa.
Dispensa exige `--reason` e fica registrada em `.impeccable/config.json`. Detalhe
em `.claude/skills/verificar/SKILL.md`. Se o comando não rodar (rede, node), o item
é declarado **não verificado**, nunca ok.

Em site novo, estudar de 3 a 5 concorrentes reais do segmento do cliente com a
skill `/estudar-site` antes de propor estrutura. Concorrente do nicho ensina mais
que galeria premiada, porque carrega a expectativa formada daquele público.

**Referência que o Marcelo mandar (Pinterest, print, galeria, link) é material de
estudo, não inspiração de olhada rápida.** Antes da primeira linha de HTML, passar
cada referência pela `/estudar-site` (que agora aceita imagem colada, não só URL) e
destrinchar: ordem e trabalho de cada seção, hierarquia e proporção, posição dos
elementos, distribuição de cor, tipografia aparente, composição, para onde o olho é
conduzido, o que a peça evita, o que reaproveitar e o que adaptar. O que o estudo
revelar de padrão vira linha em `_memoria/design/` (anatomia ou antipadrões). O que
não se reaproveita é a aparência; o que se reaproveita é a **estrutura e o raciocínio**.
Analisar referência por cima e já montar é o erro que essa regra existe para cortar.

**Print NUMERADO do Marcelo é especificação, não inspiração** (26/08/2026). Quando
ele manda "print 1", "print 2"... amarrados a uma seção ("igual ao print 3", "a
qualidade que gostaria"), aquilo é o alvo exato: seguir a estrutura, a proporção e
o comportamento do print à risca, não uma leitura livre. Foi assim o site
institucional inteiro desta data (a esfera da home, o big bang da orbital, a
formação da logo, os cards de serviço, a seção circular de garantia, o portfólio
trionn). Entregar "parecido" quando o print é numerado é subentregar.

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

> ⚠️ **Versão instalada verificada em 10/08/2026: `4.0.4`** (li o `version:` do
> `.claude/skills/impeccable/SKILL.md`). O texto que dizia 3.5.0 era documentação
> vencida. **Para gerar versões visualmente divergentes** (não só reskin), o 4.0
> tem o torneio de conceitos: rodar `node .claude/skills/impeccable/scripts/concept-seed.mjs
> --scope direction --mode <persuade|operate|read|experience>` de dentro da pasta
> do cliente (ele usa `process.cwd()` e **exige `PRODUCT.md`** ali). Sem rodar esse
> script, as versões tendem a convergir para o padrão — foi o que aconteceu nas
> primeiras tentativas do site do Grão da Serra. Ver a 20ª rodada no CLAUDE.md dele.

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

Reinstalar num clone novo: `npx --yes impeccable@4.0.4 install`. Sem a pasta da
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

- ❌ **Proibido** `DESIGN.md` ou `PRODUCT.md` na raiz. A raiz tem seis clientes
  com seis marcas diferentes mais o site da própria Horus. Um `DESIGN.md` de
  raiz achataria os seis num só, que é exatamente a colisão que fez o pacote
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
- **design-dna** (instalada 28/08/2026) — extrai/define/aplica a identidade de
  uma referência em três dimensões (tokens, estilo, efeitos visuais). Usar quando
  o Marcelo manda um design system ou referências e quer a identidade estruturada.
- **frontend-design** (Anthropic, instalada 28/08/2026) — direção de design
  intencional e anti-template (tipografia, direção estética).
- **scrollcraft** (instalada 28/08/2026) — landing scroll-driven premium (seções
  que pinam/avançam, trilhos, ground que muda de cor). Doutrina de scroll; usar
  junto de `60-motion.md`.
- **3d-grabber** — ⚠️ **NÃO é skill, é extensão de Chrome** (em `ferramentas/`).
  Captura assets 3D (GLB, splats) de qualquer site. Carregar via
  `chrome://extensions` (modo dev). Não é invocável pelo Claude.

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

## Geração de mídia (imagem e vídeo)

✅ **Atualização de 26/08/2026 (Marcelo): o Higgsfield voltou e está ATIVO.** As
skills `higgsfield-*` estão disponíveis e o CLU `higgsfield` está logado na conta
do Marcelo (`firehagge@gmail.com`, **plano starter**). Foi o que gerou todas as
imagens 3D do site institucional (torus de vidro, cristais, orbe, etc.) nesta
data. Como usar: `higgsfield generate create <modelo> --prompt "..." --wait`
(ver a skill `higgsfield-generate` para o catálogo de modelos).

- **Imagem:** funciona no plano starter. Modelo padrão **GPT Image 2**
  (`gpt_image_2`). Gera on-brand direto do prompt; o Horus OS baixa o resultado e
  monta em volta.
- **Vídeo:** os modelos de vídeo (Seedance etc.) **exigem plano Pro/Ultimate** —
  no starter retornam `"Pro" or "Ultimate" plan required`. Enquanto o plano for
  starter, animação 3D se resolve com **WebGL/canvas/SVG na mão** (foi o caminho
  da jornada da esfera do site), e o Higgsfield entra só para **imagem**.

> Histórico (mantido como contexto, já superado): entre 20/08 e 25/08/2026 o
> registro dizia que "não existe API de imagem", que o Higgsfield tinha sido
> cancelado em 05/08 e que a imagem só saía manual pelo ChatGPT e o vídeo pelo
> Gemini. Isso **venceu** com a volta do Higgsfield em 26/08. Qualquer texto que
> mencione `OPENAI_API_KEY` continua vencido (essa chave nunca existiu).

Em cliente regulado, a imagem também passa pelo compliance (cliente de saúde: sem
paciente, sem antes/depois, sem promessa; só ambiente, tecnologia e equipe).

---

## Fluxo com o Mega Brain (estratégia → produção)

O usuário mantém o Mega Brain (sistema separado, pasta própria) como
camada de estratégia/diagnóstico. O fluxo de trabalho padrão é:

1. **Mega Brain** — o usuário estuda o cliente/lead lá (diagnóstico,
   dores, estratégia, decisões com a metodologia dele)
2. **Horus OS (aqui)** — o usuário traz o documento/diagnóstico pronto e
   o Horus OS **produz e publica**: site, carrossel, anúncio, relatório

Divisão de papéis: Mega Brain decide o quê/por quê; Horus OS executa.
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
> IA** (opera sobre o sistema Horus OS). Este workspace é a operação da agência:
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
- `_conhecimento/network/` — **o oráculo do network destilado** (desde 03/09/2026). Cards
  extraídos dos 4 grupos de network do Marcelo, via Q&A do NotebookLM. Hoje: preço
  praticado de site/loja/CRM/bot, mensalidade, stack e travas legais. **Consultar antes de
  precificar projeto de site ou sistema.** Material privado: extrair princípio, nunca colar
  frase ou nome, e **nunca usar em peça de cliente**. Regras no `README.md` da pasta
- `equipe/` — descrição das funções da operação (SOW), com tipo de executor e autonomia
- `referencias/` — biblioteca de teardowns de sites reais, da agência inteira.
  Gerada pela skill `/estudar-site`. **Não confundir** com
  `clientes/<nome>/referencias-*/`, que é material daquele cliente só
- `_biblioteca/` — arsenal reutilizável da agência, em duas camadas. `motion/`
  (desde 10/08/2026): GSAP/Lenis/WebGL vendorizados + snippets, doutrina em
  `_memoria/design/60-motion.md`. `inspiracoes/` (desde 14/08/2026): fichas de
  **padrão de componente/interação** (hero, card, transição, objeto-motion...),
  o nível entre o teardown de página (`referencias/`) e o snippet de código.
  Prateleira por função, serve a casa inteira, não a um cliente
- `identidade/` — marca **da agência** (peças institucionais). O `design-guide.md`
  foi preenchido em 04/08/2026 e deixou de ser buraco declarado
- `templates/` — modelos do Horus OS: perfis de `CLAUDE.md`, catálogo de ferramentas
  e exemplos de identidade. Base para skill nova (ver "Criação de skills" acima)
- `dados/`, `marketing/`, `scripts/` — pastas do esqueleto do Horus OS, hoje só com
  `README.md`. Vazias de propósito até a operação pedir
- `portfolio/` — **peças conceituais da casa** (desde 27/08/2026): sites completos
  construídos para demonstrar capacidade numa reunião, não para cliente pagante.
  Hoje: `amendoa-preta/` (doceria de encomenda) e `soleira-interiores/` (arquitetura
  de interiores). Cada um tem `PLANO.md` com o passe duplo registrado. ⚠️ **Regra de
  honestidade ao apresentar:** pode dizer "projeto nosso", nunca "cliente nosso".
  Detalhe em `portfolio/README.md`
- `saidas/` — arquivo solto de trabalho (imagens geradas, logo de cliente). Não é
  entrega: entrega mora na pasta do cliente
- `ferramentas/` — **ferramentas externas ou infraestrutura própria** que não são
  skill do Claude (desde 28/08/2026). Hoje: `3d-grabber/` (extensão de Chrome MV3
  que captura assets 3D de sites; carregar via `chrome://extensions` em modo dev) e
  `mcp-prospeccao/` (servidor MCP local, stdio via `.mcp.json`, desde 29/08/2026:
  `check_site`, `lookup_cnpj`, `check_meta_ads`. Audita o que o agente Gemini Spark
  traz na prospecção — confirma site de verdade e se a empresa já roda anúncio —
  ver `ferramentas/mcp-prospeccao/README.md`)
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

### Ex-cliente #1 — Dr. Giovanni Nascimento (removido em 27/08/2026)

⚠️ **Removido da carteira em 27/08/2026** (decisão do Marcelo). Deixou de ser cliente da
agência. Era implantodontia premium em Salvador (setor regulado pelo CFO), esteve fora
da linha de frente desde 26/07/2026 e nunca teve o site publicado. A pasta
`clientes/dr-giovanni-nascimento/` foi **preservada** como histórico (briefing, marca e
as quatro versões de home), mas ele não entra mais em fila, contagem nem prioridade, e o
número **#1 fica vago** (os demais clientes mantêm os identificadores #2 a #5 para não
quebrar as referências cruzadas). A régua de publicidade odontológica (CFO / Res. CFO
118/2012 e 196/2019) continua registrada como referência em
`_conselho/cargos/compliance.md`, para o dia em que entrar outro cliente de odonto.

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

⚠️ **ENGAVETADA desde 01/09/2026 (Marcelo).** Foi a **prioridade principal da agência de
26/07 a 01/09/2026**; saiu da linha de frente por ora (as prioridades passaram a ser a
Amparo Flores e o Washington/mentoria). O histórico abaixo fica como contexto. O site tem **dez páginas**
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

Pasta: `clientes/grao-da-serra/`. Café torrado 100% arábica, artesanal, **B2B e B2C**
(revenda para padaria, mercado, cafeteria, escritório — e também venda ao consumidor
final, confirmado pelo Nelson em 11/08/2026). MEI ativo desde 20/03/2026,
Distrito Serrana, Brejões/BA. Ele opera sozinho e responde o próprio WhatsApp.
Máquina: GOOGLE MEU NEGÓCIO → **SITE institucional NO AR (https://graodaserra.netlify.app/,
11/08/2026)** → CRM (próximo, pago).

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
é região cafeeira reconhecida. ✅ **Origem confirmada (Marcelo, 11/08/2026, junto com
a aprovação do site pelo Nelson): o grão vem da região** — liberado usar a origem, a
região e a tradição cafeeira de Brejões como credencial. (Até 10/08 isso era pendência
e o texto da origem ficava marcado com `.pend`; a confirmação removeu a marcação.)

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
`build.js` (HTML→PNG). **Não gerar carrossel por IA de imagem** (quebra texto e
falsifica a obra).

**⚠️ Compliance CFP — mesma régua da Aion** (Res. 011/2018): sem depoimento de
paciente em nenhum formato, sem promessa de cura ou prazo, sem autoteste, CRP
visível.

✅ **CRP 03/36219 confirmado ativo** (Marcelo, 03/08): ela está formada, a bio é que
está desatualizada em "estudante". Já pode sair "psicóloga" e o CRP nas peças. Falta
só o **e-Psi** (Res. CFP 011/2018) para liberar o CTA de atendimento **online** —
não trava conteúdo.

### Cliente #6 — Amparo Flores (Floricultura, Graça/Salvador)

Pasta: `clientes/amparo-flores/`, criada em 27/08/2026. Floricultura tradicional de rua
no Largo da Graça, **desde 1972** (mais de 50 anos), B2C. Chegou por relação (o sócio do
Marcelo).

✅ **CLIENTE FECHADO em 03/09/2026**, na reunião presencial na loja. Dono: **Varo**, que
**decide junto com a irmã** (ela tem loja de flores própria e quer site + CRM dela:
**segundo lead**, reunião a marcar). Escopo em duas fases: **Fase 1 = site com o pedido
caindo no WhatsApp, R$ 1.200 (R$ 600 de entrada + R$ 600 na entrega), já comunicado ao
cliente**, sem mensalidade; **Fase 2 = checkout InfinitePay + painel/CRM com estoque +
funil de recompra + agente de botões + frete, com valor NÃO comunicado**, a apresentar
presencialmente (referência interna: R$ 3.000 a 4.000 + R$ 250 a 350/mês, ver
`_conhecimento/network/`). Travas técnicas: **agente de botões, não IA**; **plataforma
pronta, não custom**; **MEI não emite fiscal para terceiro**; **nada de bot rodando dentro
do número do cliente** (risco de ban); **estoque de flor não é estoque de mercado**.
Detalhe no `CLAUDE.md` do cliente.

⚠️ **A máquina de 27/08 foi superada.** Ela abria com "conserto do Google (isca grátis) →
WhatsApp organizado", e os prints de 03/09 mostraram que **o Google já está reivindicado e
completo e o WhatsApp Business já tem catálogo**: a isca morreu e o degrau de entrada
esvaziou. Os três eixos de valor que sobraram são **coroa/urgência de luto**, **recompra
(CRM de datas)** e **assinatura B2B da Graça e do Corredor da Vitória** (eixo novo). Ver
`briefing.md` §5.1. Logs do Conselho: `2026-08-27-amparo-flores-oferta.md` (oferta,
superada em parte) e `2026-09-03-amparo-flores-fechamento-reuniao.md` (fechamento, com o
desfecho e a lição registrados). O roteiro de reunião original é
`clientes/amparo-flores/reuniao-27-08-2026.md`.

🔴 **WhatsApp de pedidos: (71) 9118-8740** (`wa.me/557191188740`), com 8 dígitos. De 27/08 a
03/09 o site inteiro usou `99118-8740`, errado, porque **presumi o nono dígito em vez de
perguntar**. Corrigido nos 8 arquivos em 03/09. **Nunca presumir dígito de contato de
cliente.**

**Site (`clientes/amparo-flores/site/`) — virou E-COMMERCE em 02/09/2026** (o Marcelo
pediu loja, não institucional com catálogo, e mandou 3 lojas de referência: gisaflores,
mirlaflores, floresenbrasil, estudadas com Firecrawl). 7 páginas: `index.html` (home de
loja: hero com **fundo de fotos passando** sob véu roxo + barra de confiança + tiles de
categoria + grade "Mais pedidos"), `loja.html` (grade com filtros de categoria/faixa de
preço/ordenação, o coração da loja), `produto.html` (PDP, lê `?id=`, quantidade, relacionados),
`carrinho.html` ("sua cesta"), `luto.html` (coroas, sóbria), `a-casa.html` e `contato.html`
(secundárias). **Loja funcional de verdade:** motor em `produtos.js` (15 produtos, preços
reais do §2.1, foto real onde existe e placeholder marcado onde falta), **carrinho em
localStorage** com contador no cabeçalho, e **checkout que monta a mensagem no WhatsApp,
sem gateway** (ponte honesta, sem pagamento falso). ⚠️ A trava mantida: as 3 referências
prometem "entrega em 90 min/mesmo dia"; a Amparo **não copia o prazo** (gatilho travado),
usa "retirada na loja + entrega em Salvador combinada no WhatsApp". Tipografia Newsreader +
**Hanken Grotesk** (Instrument Sans saiu, o detector marca como `overused-font`). Detector
limpo (exit 0). Fotos provisórias do Instagram em 640px, a trocar por alta. `PLANO.md` guarda
o passe duplo; anatomia de e-commerce do segmento em `referencias/floricultura-tres-sites.md`.

**Não é setor regulado, mas valem regras de comércio/alimento:**
- 🔴 Marca real da logo: **roxo/violeta + laranja/marigold + creme**. Roxo é raro em
  floricultura (vem das orquídeas dela) e é a assinatura. **Roxo chapado, nunca
  gradiente com glow.** Detalhe em `marca.md`.
- 🔴 **Foto real dos arranjos dela, nunca banco de imagem.**
- 🔴 Sem superlativo, sem promessa, sem "entrega em 1 hora" copiada dos intermediários.
- 🔴 **Página de luto sóbria e separada** (creme/pedra, sem o laranja festivo).
- **WhatsApp: (71) 9118-8740** (celular de pedidos, `wa.me/557191188740`; o fixo
  (71) 3235-5898 é da loja). ⚠️ Corrigido em 03/09/2026, era `99118-8740`.

### Cliente #7 — Washington / "Daablio Dellano" (mentoria de massagem tântrica, Salvador/BA)

Pasta: `clientes/washington-daablio/`, criada em 01/09/2026. Chegou pelo sócio do Marcelo,
que entregou o dossiê completo (nicho + teardown + Conselho + roteiro NEPQ) em
`dossie-reuniao-2026-09-01.md`. Instagram @spamassagezen (~9k seg.). Quer vender uma
**mentoria** por site. Nome de marca nas peças: **Delano** (ele disse na reunião que
"W Delano é a marca"; grafia a confirmar antes do site).

**Status (02/09/2026):** reunião de venda feita em 01/09; **proposta comercial enviada**
(`clientes/washington-daablio/proposta-delano.pdf`). Público confirmado: **massoterapeutas**
(trilho de formação profissional). Produto: mentoria = **aula gravada** + mini-mentorias no
social. Autoridade confirmada: **+3.000 alunos formados, 18 anos de professor, ~28 anos de
estrada** (não +27; ele falou "28, indo pra 29" — confirmar o exato antes do site). Detalhe
da reunião e do que falta em `pos-reuniao-2026-09-01.md`.

**Oferta da Horus (mudou de R$2.500 cheio para faseada, decisão de 01-02/09/2026):** Fase 1
**R$1.200** (site de autoridade + Google Meu Negócio; à vista no Pix ou 3× R$400 sem juros)
e Fase 2 **R$1.500** (seção de venda da mentoria acoplada ao site, só quando ele gravar os
vídeos). Faseamento aprovado pelo cliente. Lógica de preço no log
`_conselho/logs/2026-09-01-washington-estrutura-de-preco.md` (não concentrar receita na
Fase 2, que depende de evento incerto). **Produção da Fase 1 destrava** quando ele mandar o
material: fotos boas, logo/cores, encarte da revista Joyce Pascovitch, módulos da mentoria,
depoimento autorizado.

**⚠️ Compliance — NÃO é conselho profissional** (não há CFO/CFP para "terapeuta tântrico").
A trava é outra e trava igual:
- **Plataforma:** Meta/Google **reprovam conteúdo sensual** — copy tipo "prazer tântrico"
  derruba anúncio e restringe a conta. Reposicionar do sensual para o **terapêutico** é a
  decisão nº 1 (o nicho inteiro faz isso: "tantra não é prostituição").
- **Pagamento e imagem:** produto lido como adulto sofre com gateway; manter a separação
  "terapia ≠ serviço sexual" protege reputação e venda.
- **Sem promessa** (nem sexual, nem de renda). **Depoimento de aluno só com autorização
  por escrito.** GMB cadastrado como *massoterapeuta/terapeuta*, nunca "massagem tântrica".
- **Marca visual:** terapêutica, serena, adulta — o oposto do clichê "spa sensual".
