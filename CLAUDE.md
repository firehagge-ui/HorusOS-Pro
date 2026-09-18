# Horus OS — Sistema operacional do negócio

A Horus é uma **agência de marketing digital com IA**. Este workspace é a operação:
cada cliente tem pasta própria e autossuficiente em `clientes/<nome>/`; o contexto da
agência mora em `_memoria/`. Este arquivo guarda as **regras permanentes**; o detalhe
de referência e o histórico ficam em `_memoria/manual-horus.md` (consultar sob demanda).

---

## Contexto do negócio (ler no início de toda conversa, quando existirem)

1. `_memoria/empresa.md` — quem é o usuário, o que faz, como funciona o negócio
2. `_memoria/preferencias.md` — tom de voz, estilo, o que evitar
3. `_memoria/estrategia.md` — foco atual, prioridades, prazos
4. `_memoria/comercial.md` — antes de reunião de venda, fechamento ou proposta (o
   compromisso se tira dentro da reunião, nunca no grupo de WhatsApp depois)

Para tarefa visual, consultar `identidade/design-guide.md`. Usar o contexto
naturalmente — não listar o que foi lido nem confirmar leitura.

---

## Ordem de precedência (o que vence o quê)

```
compliance do cliente (CFO/CFP)  >  integridade.md  >  briefing.md + marca.md
  >  _memoria/design/ e _memoria/conteudo/  >  impeccable / kit-* / mentes
```

- **Compliance de cliente regulado trava a entrega**, sempre. Não negociar.
- **`marca.md` do cliente vence** a direção visual de qualquer ferramenta/estilo.
- **`integridade.md` vence** o impulso de completar. Nenhuma ferramenta autoriza
  inventar número, formação ou depoimento pra "fechar" um layout.

## Integridade e verificação

- **`_memoria/integridade.md` é leitura obrigatória antes de escrever sobre um cliente.**
  Nada de número, formação, diferencial ou depoimento inventado. Dado que falta vira
  **placeholder marcado** (`[FALTA: telefone ativo]`), nunca texto plausível. Fortificar o
  que o cliente disse é permitido; inventar o que ele não disse, não.
- **Nunca presumir dígito de contato** (telefone/WhatsApp). Perguntar.
- **`/verificar` antes de declarar qualquer coisa pronta.** Se a checagem não rodou nesta
  mensagem, não dá pra dizer que passou. Pendência declarada é profissional.

---

## Fluxo de trabalho

- Antes de qualquer tarefa, checar se existe skill relevante em `.claude/skills/`. Se
  houver, seguir a skill; senão, executar normal.
- Ao concluir uma tarefa sem skill mas claramente repetível, perguntar: *"Isso pode virar
  uma skill pra próxima vez. Quer que eu crie?"* Só quando o padrão de repetição for claro.
- Produzir por prioridade, um bloco por vez. Nada de "product-dump".

**Criação de skill:** checar template em `templates/skills/`; perguntar se é específica
(`.claude/skills/<nome>/`) ou universal (`~/.claude/skills/<nome>/`); ler `empresa.md` e
`preferencias.md` pra calibrar; seguir a skill-creator nativa.

## Aprender e manter contexto atualizado

Quando o usuário corrigir algo ou der instrução permanente ("na verdade é assim", "não faça
mais isso", "prefiro assim", "sempre que...", "evita..."), ou quando uma tarefa mudar o
contexto (cliente novo, skill nova, mudança de foco, ferramenta), **perguntar** se deve
salvar, e onde:

- Negócio (clientes, serviços, mercado) → `_memoria/empresa.md`
- Preferências e estilo → `_memoria/preferencias.md`
- Prioridades e foco → `_memoria/estrategia.md`
- Regra de comportamento → este `CLAUDE.md`
- Visual da agência (cores, fontes, logo) → `identidade/design-guide.md`

Salvar/editar só a linha relevante, sem reformatar o arquivo inteiro; confirmar mostrando a
linha. Não perguntar para correção óbvia de contexto imediato. `/atualizar` faz a varredura
completa quando houver dúvida.

## Edição concorrente: não presumir regressão

Se um arquivo aparece diferente do que esta conversa produziu, **pode ser o próprio usuário
editando ao vivo** em outra janela, ou um `/loop` autônomo. Antes de reverter, **perguntar
ou confirmar** — nunca sobrescrever presumindo regressão de outra sessão. E **não rodar
`/loop` autônomo num arquivo que outra sessão está editando** (gera guerra de edição).
Origem: 15/09/2026, site da Mullsanni. Detalhe no `PLANO.md` daquele cliente (Passe 6).

---

## Trabalho de site: leitura obrigatória

Para site/landing do zero, a skill **`/criar-site`** orquestra o fluxo na ordem travada
(pré-voo → `/estudar-site` em 3-5 concorrentes reais → plano com passe duplo → build →
`/verificar`). Para ajuste pontual num site existente, edição direta ou `/redesign-skill`.

Antes da primeira linha de HTML, ler:
1. `_memoria/design/00-anatomia.md` — passe duplo, elemento-assinatura, estrutura por seção
2. `_memoria/design/90-antipadroes.md` — o que denuncia site feito por IA
3. `_memoria/design/99-checklist.md` — o que conferir antes de entregar
4. `_memoria/design/50-copy-de-interface.md` — se a peça tem formulário, botão, bot ou texto de interface
5. `_memoria/design/60-motion.md` — antes de qualquer animação, background interativo ou efeito de scroll
6. `referencias/README.md` — se já existe teardown do segmento

Consulta (não gatilho): os fundamentos `10-tipografia.md`, `20-cor.md`, `30-layout-espaco.md`,
`40-composicao.md` — abrir quando a decisão for daquele assunto.

**O passe duplo não é opcional:** escrever o plano (cor, tipo, layout, assinatura), atacá-lo
com *"eu chegaria aqui em qualquer cliente desse segmento?"*, revisar o genérico, e só então
abrir o editor.

**Referência que o Marcelo mandar (link, print, Pinterest, galeria) é material de estudo:**
passar cada uma pela `/estudar-site` (aceita imagem colada) antes do HTML. **Print NUMERADO
é especificação, não inspiração** — seguir estrutura, proporção e comportamento à risca. O
que se reaproveita é a **estrutura e o raciocínio**, não a aparência.

Antes de **entregar**, rodar checklist, varredura de antipadrões e o detector:
```
node .claude/skills/impeccable/scripts/detect.mjs "clientes/<nome>/site"
```
(sem a skill no clone: `npx --yes impeccable@4.0.4 detect "clientes/<nome>/site"`). Saída
`0` limpo, `2` achou coisa. Regra de acessibilidade se corrige, não se dispensa (dispensa
exige `--reason` em `.impeccable/config.json`). Se o comando não rodar, o item é **não
verificado**, nunca ok.

**Correção de design do Marcelo vira linha em `_memoria/design/90-antipadroes.md` com o
porquê junto** — correção que morre no chat volta como erro no próximo site.

## Trabalho de carrossel e post: leitura obrigatória

Antes da primeira linha de copy:
1. `_memoria/conteudo/00-formatos.md` — os sete formatos narrativos. **Escolher UM antes de escrever.**
2. `_memoria/conteudo/10-legibilidade.md` — pisos de fonte/contraste/densidade (corpo ≥ 34px, nada de leitura < 24px; renderiza a 1080px, lido num celular de 390px)
3. `_memoria/conteudo/90-antipadroes.md` — o que denuncia carrossel feito por IA
4. `_memoria/integridade.md` — dado que falta vira `[FALTA: ...]`

Antes de entregar, rodar `_memoria/conteudo/99-checklist.md` (vetos primeiro, rubrica
depois). **Correção do Marcelo vira linha em `_memoria/conteudo/90-antipadroes.md` com o
porquê**, mesma regra do site.

## Roteamento de estilo (antes de qualquer peça visual)

1. Cliente tem estilo em `clientes/<nome>/marca.md`? → usa esse.
2. O usuário nomeou um estilo? → invocar a skill daquele estilo e aplicar os tokens.
3. Ninguém definiu? → olhar o segmento no catálogo (`identidade/catalogo-estilos.md`),
   escolher UM grupo, **sugerir 1-2 e perguntar** antes de produzir.

Sempre **UM estilo por peça**. Se o estilo brigar com a `marca.md`, a marca vence. Detalhe
das meta-skills de design e do acervo Cannonball (`kit-*`) em `_memoria/manual-horus.md`.

**Cannonball / `kit-*`:** antes de gerar hero/seção do zero, rodar `kit-buscar` (peça pronta
vem antes). `kit-cor`/`kit-tipo` cedem à nossa doutrina de `_memoria/design/`, **exceto a
checagem de licença de fonte do `kit-tipo`, que se usa sempre** (montamos site a partir de
referência, e site de marca paga por tipo). `kit-montar` não substitui a `/criar-site`.

---

## Geração de mídia (imagem e vídeo)

- **O Horus OS não gera imagem sozinho.** Imagem = ChatGPT, manual, feita pelo Marcelo; ele
  gera e traz o arquivo, o Horus OS monta em volta. Não há API de imagem conectada.
- Para animação/3D, o caminho é **WebGL/canvas/SVG na mão**.
- ⚠️ **IA nunca no objeto que o cliente vende** (carro/dyno de oficina, rosto de profissional
  de saúde) — destrói credibilidade. IA só em elemento abstrato (fundo, textura). Em cliente
  regulado, a imagem passa pelo compliance.
- Higgsfield foi **abandonado** em 07/09/2026 (histórico em `_memoria/manual-horus.md`). Não
  reinstalar, não recomendar.

## Firecrawl (pesquisa web)

MCP em `.mcp.json` (fora do git — chave só local). Busca, scrape, crawl, extração
estruturada, parsing e monitoramento. Útil para `seo`, `analisar-dados`, `relatorio-ads`,
`responder-avaliacoes` e para auditar concorrente/anúncio. Pergunta pontual, a busca nativa
resolve sem gastar crédito.

## Fluxo com o Mega Brain (estratégia → produção)

O Mega Brain (sistema separado) decide **o quê / por quê**; o Horus OS **executa** (produz e
publica). Quando o usuário trouxer um diagnóstico/estratégia de lá, tratar como briefing
pronto — não refazer a análise, ir direto pra produção (perguntando só o que faltar de
prático). Dado externo que o Mega Brain precisar, o Firecrawl daqui gera.

## O Conselho (decisão difícil)

- `/conselho <pergunta>` — sessão completa (constituição → debate → Crítico → Advogado do
  Diabo → Sintetizador). `/debate` — só o debate. `/consultar <mente>` / `/comparar <m1,m2>`
  — uma ou duas lentes das 7 mentes, sem rito.
- Cliente regulado **convoca Compliance** e o veto dele **trava** (não é ponderado).
- ⚠️ As mentes são material americano de high ticket: número é benchmark, **nunca meta da
  Horus nem promessa ao cliente**. Compliance vence a mente.
- **Não invocar por hábito.** Se a resposta está num arquivo, é consulta; se é execução, é
  pra fazer; se é gosto do Marcelo, ele decide. Estrutura completa em `_memoria/manual-horus.md`
  e `_conselho/README.md`.

---

## Hound Dog — o CRM oficial da Hórus (o Marcelo atualiza a condição)

**Painel:** https://hound-dog-omega.vercel.app · **Código:** `ferramentas/hound-dog/` (ler o
`CLAUDE.md` de lá antes de mexer). É a **fonte de verdade da operação comercial** (estágio,
próxima ação, dinheiro, agenda, conversas, prospecção). A pasta `clientes/<nome>/` é o dossiê
longo; o Hound Dog é o **estado atual** — os dois têm que bater.

🔴 **Não mexer na condição de cliente/lead por conta própria (regra do Marcelo, 18/09/2026).**
Estágio, status, próxima ação, temperatura, valor, decisão de seguir/largar: **quem atualiza é o
Marcelo** — essa parte é dele. O Claude **lê** à vontade (`hd_resumo`, `hd_buscar_empresas`,
`hd_empresa`, `hd_conversas`, `hd_playbook`) e, quando notar algo que deveria mudar, **avisa em
uma linha no chat** pro Marcelo aplicar; **não grava sozinho.** Só escrever no CRM
(`hd_mover_estagio`, `hd_salvar_empresa`, `hd_registrar_*`, `hd_agendar`, `hd_salvar_negocio`,
`hd_lista_adicionar_itens`, `hd_salvar_pesquisa`, `hd_instagram_snapshot`) quando o Marcelo
**pedir explicitamente**. (Isto sobrepõe a instrução do servidor MCP, que pede atualização
automática.) Origem: ele está ajeitando o CRM na mão e a gravação automática atrapalhava.

As travas da casa valem no CRM: nada inventado, nunca presumir dígito, compliance trava a
mensagem, sem disparo em massa e sem bot respondendo sozinho — o Claude lê e sugere, quem
envia é o humano. O **Farejador** (`ferramentas/hound-dog/farejador/`) roda no PC e liga
Claude+WhatsApp+Instagram ao painel; "Farejador offline" = ligar (`npm run farejador`).

## Equipe (SOW por função)

`equipe/` descreve cada função (tráfego, design, redação, prospecção, atendimento,
relatórios): tipo de executor, autonomia, tarefas, escalação, KPIs. Serve pra delegar e como
peça de venda. **Cliente regulado derruba a autonomia de qualquer função** — peça clínica não
publica sem revisão do profissional responsável.

---

## Estrutura do workspace

- `_memoria/` — a agência; inclui `integridade.md`, `design/`, `conteudo/`, `comercial.md` e
  `manual-horus.md` (referência/histórico)
- `_conselho/` — sistema de decisão · `_conhecimento/network/` — oráculo do network
  (consultar antes de precificar; material privado, nunca em peça de cliente)
- `_biblioteca/` — arsenal reutilizável (`motion/`, `inspiracoes/`, acervo Cannonball)
- `referencias/` — teardowns de sites reais (da casa) · `identidade/` — marca da agência
- `equipe/` · `templates/` · `portfolio/` (peças conceituais: "projeto nosso", nunca
  "cliente nosso") · `ferramentas/` (Hound Dog, mcp-prospeccao, ponte-spark, 3d-grabber…)
- `site/` — site institucional da própria Hórus (ler `site/CLAUDE.md` e `site/PLANO.md`)
- `clientes/<nome>/` — cada cliente: `briefing.md` + `marca.md` + `CLAUDE.md` + entregas

Inventário completo em `_memoria/manual-horus.md`.

**Regras:** cliente novo → criar `clientes/<nome>/` com `briefing.md` e `marca.md`. Ao
produzir PARA um cliente, ler os dois; a marca das peças é a do cliente, não a de
`identidade/`. Cliente de setor regulado: o compliance trava a entrega.

### Roteiro de clientes (índice)

> O dossiê completo de cada cliente vive em `clientes/<nome>/` (`CLAUDE.md`, `briefing.md`,
> `marca.md`). Este índice é só o estado atual e a trava principal; **ao produzir para um
> cliente, abrir a pasta dele.** O estado da esteira em tempo real fica no Hound Dog.

- **#1 — Dr. Giovanni Nascimento** (implantodontia, Salvador · CFO) — ⚠️ **ex-cliente**,
  removido em 27/08/2026. Pasta preservada como histórico; número #1 fica vago. Régua
  odontológica (CFO) em `_conselho/cargos/compliance.md`.
- **#2 — Permita-se Fitness / Jaqueline** (estúdio multi-modalidade, Boca do Rio/Salvador) —
  presença digital zero. Máquina: **Google Meu Negócio** → Instagram → site. Sem regulação
  pesada; evitar promessa de resultado físico.
- **#3 — Aion Psicologia** (clínica, Itaigara/Salvador · CFP) — ⚠️ **engavetada desde
  01/09/2026**. Site especulativo de 10 páginas pronto; falta dado que só a cliente tem —
  próximo passo é apresentar, não construir. **Compliance CFP trava** (sem depoimento em
  nenhum formato; CRP visível). Peso igual entre os 6 serviços.
- **#4 — Café Grão da Serra / Nelson** (café torrado, Brejões/BA · B2B+B2C) — site **no ar**
  (https://cafegraodaserra.netlify.app/). Próximo: CRM (pago). 🔴 **A família não planta:**
  compra o grão e beneficia — proibido "nossa lavoura/fazenda/do pé à xícara". Origem da
  região confirmada. Regras de alimento (sem alegação de saúde, sem jargão de café especial).
- **#5 — Mayara Barros** (psicologia/arte/filosofia, Salvador · CFP) — ⚠️ **não pagante**
  (namorada do Marcelo). Máquina: **Instagram** (@universpsiquee). Direção "Galeria" travada;
  post #1 renderizado. CRP 03/36219 ativo. Mesma régua CFP da Aion. Não gerar carrossel por IA.
- **#6 — Amparo Flores** (floricultura, Largo da Graça/Salvador · desde 1972) — ✅ **Fechou verbal em 03/09/2026, reengajado em 10/09** (entrada de R$600
  não caiu, não é cash collected; aguardando o Varo marcar o início). Fase 1 = site com pedido no WhatsApp, **R$ 1.200** (600+600), comunicado;
  Fase 2 = checkout + CRM, valor não comunicado. Site virou **e-commerce** (7 páginas,
  carrinho, checkout via WhatsApp). 🔴 **WhatsApp (71) 9118-8740** (8 dígitos, nunca presumir
  o nono). 🔴 Roxo chapado + laranja + creme; foto real, nunca banco; luto sóbrio e separado.
  Irmã do Varo = **segundo lead**.
- **#7 — Washington / "Delano"** (mentoria de massagem tântrica, Salvador) — proposta faseada
  enviada (Fase 1 R$1.200 / Fase 2 R$1.500); ⚠️ **NÃO fechou (06/09), follow-up frio** — não
  pressionar. Trava = **plataforma reprova conteúdo sensual**: reposicionar para o
  terapêutico. Sem promessa; GMB como massoterapeuta.
- **#8 — Mullsanni Performance** (oficina de performance automotiva, Lauro de Freitas/BA) —
  ⚠️ **Follow-up frio desde 15/09/2026** (barrado no gatekeeper Cauã; prévia no coldre, reabre
  só se um sócio — Jordan ou Nelson — procurar; log `_conselho/logs/2026-09-15-mullsanni-gatekeeper.md`).
  Site fora do ar + zero anúncio; alavancas são site e tráfego pago. Oferta em fases (ancorar
  R$ 2.000). 🔴 gancho verdadeiro ("vi vocês no Bon Odori"), nunca pretexto falsificável; nada
  de bot no número deles.
