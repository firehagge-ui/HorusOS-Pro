# Hounder (ex-Hound Dog) — contexto e regras (para o Claude)

> Na tela o nome é **Hounder** desde 24/09/2026; no código, nas pastas e no banco continua `hound-dog`.

> O CRM oficial da Hórus. Criado em 17/09/2026 a pedido do Marcelo ("me devolva o CRM 100%
> funcional"), substituindo os protótipos `horus-crm` e `painel-ataque-planta`.
> Painel: https://hound-dog-omega.vercel.app · Banco: Supabase `hound-dog` (sa-east-1).

## A regra que atravessa tudo

**O Hound Dog é a fonte de verdade da operação comercial.** Cliente novo, lead novo, reunião
marcada, valor acertado, estágio que mudou, objeção que apareceu: **atualize no mesmo turno**
com as ferramentas `mcp__hound-dog__*`. Arquivo do cliente (`clientes/<nome>/`) continua sendo
o dossiê longo; o Hound Dog é o estado atual — os dois precisam bater.

O que fica no Hound Dog: quem é, em que estágio está, próxima ação, negócios e dinheiro,
agenda, linha do tempo, conversas do WhatsApp, listas de prospecção, pesquisas de mercado.
O que fica na pasta do cliente: briefing, marca, compliance, arquivos de entrega, planos.

## Travas (herdadas da casa, valem aqui também)

- **Integridade**: nada de número, contato, depoimento ou fato inventado. O que falta vira
  `[FALTA: ...]` ou fica em branco. **Nunca presuma dígito de telefone** (o caso Amparo).
- **Compliance do cliente trava**: em setor regulado (CFO, CFP, CFM, OAB...) nada de promessa,
  superlativo, antes/depois ou depoimento onde o conselho proíbe. O campo `regulado` existe
  para isso e aparece na ficha e no cartão.
- **Nada de disparo em massa** e **nada de bot respondendo sozinho** no WhatsApp.
- **Só conversa de cliente no CRM (30/09/2026):** o Antônio também abre o painel, então conversa pessoal do
  WhatsApp não entra. O Farejador só grava número que bate com uma ficha (`guardarMensagem`), a migração
  `013_so_conversa_de_cliente.sql` apaga o que estava solto, um gatilho apaga conversa que perde a ficha e o RLS
  só deixa o painel ler conversa ligada a ficha. Lead novo que escreve primeiro só aparece depois de virar ficha.
- **Disparo de prospecção (24/09/2026):** só sai o que o Marcelo aprovou, texto exato, na tela
  Disparos (`app/js/telas/disparos.js`). O Claude cria o rascunho com `hd_preparar_disparo`
  (tabela `disparos`, `supabase/006_disparos.sql`), sempre com a tabela de verificação. Quem
  envia é o Farejador (`farejador/disparos.mjs`): 10 por dia, 4 a 7 min aleatórios, avisa o
  Marcelo no WhatsApp a cada envio, para o lote no primeiro erro, marca follow-up em 4 dias.
  Resposta a lead que respondeu é do humano.
- **Preço não se manda por mensagem.** Objeção de preço vira convite para conversa ao vivo.
- Benchmark de network é **referência**, nunca meta nem promessa ao cliente.

## Arquitetura (o mínimo para não quebrar nada)

- `app/` é o painel (HTML/CSS/JS puro, sem build). Uma tela por arquivo em `app/js/telas/`.
  Publicar: `cd app && npx -y vercel@60.0.0 deploy --prod --yes` (o `npx vercel` sem versão falha com ETARGET).
  Depois de publicar, o Marcelo precisa de Ctrl+F5 (aba aberta guarda o JS antigo).
- `app/js/score.js` é compartilhado entre painel e Node (régua de pontuação e leitura de
  planilha). Se mexer nele, mexe nos dois lados ao mesmo tempo.
- `lib/crm.mjs` concentra as regras de escrita (dedupe, score, linha do tempo). O MCP e o
  Farejador passam por ele — não escreva direto na tabela sem motivo.
- `farejador/` roda no PC do Marcelo. `claude.mjs` é quem chama o `claude -p`; `prompts.mjs`
  guarda o que o Claude recebe em cada tarefa; `tarefas.mjs` é o mapa tipo → função.
- Esquema do banco em `supabase/*.sql`, idempotente. Mudou o esquema? `npm run migrar`.
- Segredos em `.segredos/` (senha do banco, acessos). **Nunca versionar, nunca imprimir.**

## Quando o Marcelo pedir algo do CRM

1. `hd_resumo` primeiro (situação real), depois responda.
2. Fez alteração? Diga em uma linha o que mudou. Não peça confirmação para registrar o que
   ele acabou de falar; pergunte só quando faltar dado essencial (nome, data).
3. Dado que veio de pesquisa na web entra com a fonte. Dado que não achou não entra.

## A esteira de prospecção no painel (25 a 27/09/2026)

Lista do Spark → **"Fazer a triagem"** (tela da lista; tarefa `triar_lista`, de 8 em 8: existe? o Spark
acertou? tem gancho? Passa vai pro Novo com tag `triado`, descarta fica na lista com o motivo) →
**"Investigar"** na ficha ou "Investigar Novos" na Esteira (tarefa `investigar_empresa`, seis camadas,
`promptInvestigacao`) → Qualificado com briefing (aba Briefing) + rascunho no Disparos, ou Perdido com motivo →
o Marcelo aprova no Disparos → o Farejador envia. O Conselho só roda quando o Marcelo pede por texto.

- Triagem e investigação usam o **navegador do Farejador** (MCP `navegador` = Playwright com o perfil
  `.navegador/`, fora do Git) e por isso rodam **uma de cada vez** (`USA_NAVEGADOR` em `tarefas.mjs`).
  O perfil não é o Chrome do Marcelo: o Chrome não abre o mesmo perfil em dois programas e bloqueia
  automação no perfil principal. Login (Instagram e Google) uma vez com `npm run navegador`.
- Modelo: Ajustes → Claude (`config.claude`). Investigação e chat fixos em `claude-opus-5-5` com esforço alto (`--effort high` para todo Opus, em `claude.mjs`; pedido do
  Marcelo, 27/09). **Leitura de WhatsApp e mensagem personalizada também em Opus 5.5 desde 29/09**, em modo `horus` com ferramentas
  só de leitura (Read, Grep, Glob: sem escrita, sem comando, sem CRM, pro texto do lead não virar ação) e com o conhecimento de
  prospecção dentro do pedido (`doutrinaConversa()` em `prompts.mjs`, lido do repositório a cada análise). A análise sai por
  `--json-schema` (`ESQ_ANALISE`), traz `momento` e `respostas_provaveis` (a tela usa estas no lugar do mapa da investigação) e
  reconhece o passo 2 mandado pelo celular (`reconciliarEnviosManuais`, similaridade ≥ 0,6), que sai das "Mensagens preparadas". Cada tarefa é um `claude -p` novo, sem memória de chat.
- **Chat por lead:** botão "Falar sobre este lead" na ficha abre o chat com a empresa anexada; o contexto
  leva a ficha, a última investigação e as mensagens do Disparos, e o chat grava no CRM quando pedido.
  `hd_preparar_disparo` substitui o rascunho anterior do mesmo passo.
- **Dois passos no Disparos (28/09/2026):** a investigação grava o passo 1 e os passos seguintes do
  briefing como rascunhos. A ficha (abas Geral e Briefing) mostra as mensagens do Disparos, e as da
  investigação só aparecem como "versão antiga" quando divergem. O passo 2 **não sai no lote** enquanto
  o passo 1 não foi enviado e o lead não respondeu (mensagem recebida depois do envio, ou "Respondeu"
  marcado). A trava existe no painel (`telas/disparos.js`) e no Farejador (`farejador/disparos.mjs`).
- **Variantes e agendamento (28 e 29/09/2026):** cada passo tem até três abordagens (`disparos.variante` A/B/C +
  `angulo`, migração `009_variantes.sql`); aprovar uma descarta as outras do mesmo passo. O passo 1 tem A (abertura
  em dois passos) e B (variação simples, uma mensagem só). **A tela Disparos cuida só do passo 1** e agenda o lote
  pra um horário (o Farejador manda quando `agendado_para` vence; o PC precisa estar ligado); o limite de 10 vale por
  dia de envio. **O passo 2 fica na ficha (aba Geral) e na conversa do lead** (`telas/conversas.js`, "Mensagens
  preparadas"), e usar uma ali marca como enviada e descarta as outras. As mensagens moram só na aba Geral; o
  Briefing fica com a pesquisa. O Copiloto da Geral mostra a variação simples com "Assina Marcelo/Antônio".
- Link wa.me sem o nono dígito **não é erro** (Bioclin, 25/09); o número gravado nunca é alterado.

## Time de agentes de prospecção (Fase 1 no ar desde 29/09/2026)

Desenho e decisões em `PLANO-AGENTES.md` (nesta pasta): agente = lead com memória + ciclo por acontecimento
+ estrategista/redator/crítico + toda saída aprovada pelo Marcelo. Decisões dele: fala como "Marcelo" (Hórus só
na oferta, nunca se passar por cliente), pode investigar sozinho (freio: 1 por semana por lead), **até 10 ativos**.
- Código: `lib/agentes.mjs` (designar, pedir ciclo, nota), `farejador/agente.mjs` (o ciclo, tarefa `agente_ciclo`),
  prompts `REGRAS_AGENTE`, `promptAgente`, `promptCritico`, `promptReescrita` em `prompts.mjs`, migração 011.
- Lead com agente ativo: a resposta dele dispara o ciclo do agente no lugar do `analisar_conversa`; a fila nunca
  roda dois ciclos do mesmo lead juntos (`pegarJob` em index.mjs).
- Informação nova de lead com agente vai também pra memória dele (`hd_agente_nota`); pedido do Marcelo
  ("outra opção", "responde isso") vira `hd_agente_pedir`. CLI: `node scripts/agente.mjs`.
- **Follow-up programado (30/09):** `farejador/followup.mjs` (a cada 10 min) acha o lead que sumiu há 3 dias e faz o
  agente preparar UM follow-up com data do 4º dia (`disparos.sugerido_para`, tela Disparos › "Follow-ups programados");
  avisa o Marcelo quando o lead falou por último há 3h sem resposta; acorda o agente na data que ele marcou. Migração 012.
  Detalhe no `PLANO-AGENTES.md`.
- Não implementado ainda: Mesa de agentes (Fase 2), provas/segmentos (Fase 3), teste casa × curiosidade (Fase 4).

## Revisor e aprendizado da prospecção (29/09/2026)

Veio do benchmarking de repositórios de cold outreach (`_memoria/prospeccao/91-o-que-veio-do-benchmark.md`).

- **`app/js/revisor.js`** (compartilhado painel/Node, como o `score.js`): `revisar(texto, {passo, empresa, lote})`
  devolve vetos e avisos (travessão, emoji, parêntese, preço, promessa, tamanho, jargão, lista de três, uma pergunta
  só, esqueleto repetido no lote...). Roda ao vivo na tela Disparos, no `hd_preparar_disparo` (veto recusa) e na
  investigação (grava em `disparos.revisao`, não barra). `regrasParaPrompt()` leva as mesmas regras pro Claude.
- **Resposta automática não é resposta:** `pareceAutoResposta` / `AUTO_RESPOSTA_SQL` (saudação do WhatsApp Business).
  A trava do passo 2 (painel e `farejador/disparos.mjs`) ignora essas mensagens.
- **Janela de envio:** o Farejador só manda seg a sex 8h30 às 18h e sábado 9h às 12h (Bahia). Fora disso empurra o
  lote inteiro pra próxima abertura e avisa o Marcelo. O painel recusa agendar fora da janela. Constante `JANELA`
  nos dois arquivos.
- **Migração 010:** `disparos.texto_original` (gatilho guarda o texto do Claude na primeira edição) e `disparos.revisao`.
- **Variação no lote:** a investigação recebe as mensagens dos últimos 14 dias de outros leads e não pode repetir o esqueleto.
- **`node scripts/aprender.mjs [dias]`:** edições do Marcelo, variante escolhida, respostas humanas e o que o revisor
  mais acusou. A leitura vira linha em `_memoria/prospeccao/aprendizados.md`.

## Tarefas (27/09/2026)

Pedido do Marcelo: executar o plano de negócio (`_gestao/plano-de-negocio.md`) e as pendências gerais da
casa num lugar só. Tabela `tarefas` (`supabase/007_tarefas.sql`), tela `app/js/telas/tarefas.js` (segunda
do menu; visões Agora, Por marco, Feitas), cartão "Tarefas de hoje" no Início, badge com atrasadas + hoje.
MCP: `hd_tarefas` (lista, padrão = abertas, com `atrasada` e `bloqueada`) e `hd_salvar_tarefa` (cria,
edita, conclui). O `hd_resumo` traz `tarefas_7_dias`. O resumo das 8h do Farejador abre com as atrasadas
e as do dia (`rotinaBriefing` em `farejador/index.mjs`).

- Campos: prazo (data, sem hora, fuso da Bahia), prioridade, status (a_fazer, fazendo, travada, feita,
  cancelada), responsável em texto (Marcelo, Antônio; o Antônio não é operador, o Marcelo marca por ele),
  área, marco (m1 90 dias até 26/12/2026, m2, m3, m4), objetivo do plano (O1 a O7), `depende_de` (ids),
  empresa opcional (concluir tarefa com empresa grava na linha do tempo), `pronto_quando`.
- `concluida_em` é preenchido pelo gatilho do banco; não mandar pelo cliente.
- Agenda continua sendo compromisso com hora. Tarefa não tem hora.

## 📣 Mídia, o agente de social media (27/09/2026)

Tela Instagram ganhou as abas Semana, Agenda, Agora, Caixa e Aprendizados (`app/js/telas/midia.js`).
O Farejador chama `farejador/midia.mjs` a cada minuto (agenda em `social_rotinas`, migração `008_midia.sql`);
as tarefas `midia_semana`, `midia_ajuste` e `midia_triagem` estão em `tarefas.mjs`. Com `config.midia.ativo`,
a coleta antiga do Instagram (leitura pública) fica parada e o botão "Atualizar agora" coleta pela API oficial.
O motor e o porquê moram em `ferramentas/social/` (ARQUITETURA.md §7). **Nunca rodar `npm run migrar` inteiro
sem conferir a 002** (tem o @ antigo como padrão); aplicar só a migração nova.

## Dívidas conhecidas (27/09/2026)

- **Git:** o trabalho de 24 a 27/09 não foi commitado (falta o /salvar). Em 27/09 o repositório já
  estava **privado** e o deploy na Vercel passou, então o vínculo GitHub ↔ Vercel está resolvido.
- **Instagram (coleta do perfil da Hórus)**: leitura pública bloqueada pela Meta; só com a API oficial
  (token em Ajustes). Handle: **@horusagencia.br** (confirmado em 27/09/2026; o token da API do
  Instagram já está em `ferramentas/social/.segredos/`, caminho "login do Instagram", graph.instagram.com).
- **Vercel Hobby** é não-comercial no papel: decidir entre Pro e Netlify/Cloudflare.
- A conta `qa.claude@hounddog.dev` existe só para os testes automatizados; pode ser removida
  em Ajustes → Operadores quando não for mais útil.
- Histórico: o WhatsApp (pendente em 17/09) está conectado (conferido no status do Farejador em 26/09).
