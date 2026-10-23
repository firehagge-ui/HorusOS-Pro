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
- **Mensagem que não abre (09/10/2026, caso Débora Reis):** quando o WhatsApp entrega uma mensagem que o Farejador
  não consegue decifrar (stub `CIPHERTEXT`), ela entra como `tipo = 'indecifrada'`, sem texto, com atividade "veja no
  celular" e sem acionar o Claude; se o WhatsApp reenviar aberta (mesmo `wa_id`), o texto entra no lugar. Antes sumia
  em silêncio. As chaves usam `makeCacheableSignalKeyStore`, o `getMessage` devolve as nossas mensagens pra reenvio e
  o erro da biblioteca vai pra `farejador/logs/baileys.log` (o logger era `silent`).
- **Disparo de prospecção (24/09/2026):** só sai o que o Marcelo aprovou, texto exato, na tela
  Disparos (`app/js/telas/disparos.js`). O Claude cria o rascunho com `hd_preparar_disparo`
  (tabela `disparos`, `supabase/006_disparos.sql`), sempre com a tabela de verificação. Quem
  envia é o Farejador (`farejador/disparos.mjs`): 10 por dia, 4 a 7 min aleatórios, avisa o
  Marcelo no WhatsApp a cada envio, para o lote no primeiro erro, marca follow-up em 4 dias.
  Resposta a lead que respondeu é do humano.
- **Preço não se manda por mensagem.** Objeção de preço vira convite para conversa ao vivo. **Exceção aprovada pelo
  Marcelo em 09/10/2026 (proposta P3 da pesquisa):** a "quanto custa?" de site responde-se com a faixa da Fase 1
  (R$ 1.200 a R$ 2.000, depende de quantas páginas) e dois horários; o valor fechado continua só na conversa ao vivo.
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
- **Qual Claude roda (21/10/2026):** o CLI global sumiu do PC; `binarioClaude()` agora acha também o Claude Code que
  vem dentro do app Claude (`%LOCALAPPDATA%\Claude-Data\...\claude-code\<versão mais nova>\...\claude.exe`), que muda de
  pasta a cada atualização do app. **Conta por operador:** tarefa criada no painel por quem tem pasta em
  `~/.claude-contas/<nome>` roda com `CLAUDE_CONFIG_DIR` dela (`comConta` em `claude.mjs`, chamado no `executar` do
  index). Conectar: `npm run conta-claude -- Antônio` com o Antônio junto (ele faz o /login com a conta dele). Pasta sem
  login = a tarefa falha com aviso, nunca cai na conta do Marcelo. O que o Farejador dispara sozinho (Mídia, agentes)
  segue na conta do Marcelo. `criado_por` vem do nome do operador no painel (não é à prova de fraude; entre sócios basta).
  O Farejador sobe pelo atalho de inicialização do Windows (`farejador/iniciar-oculto.vbs`).
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
  em dois passos) e B (variação simples, uma mensagem só). **A tela Disparos (reorganizada em 10/10/2026, pedido do
  Marcelo) mostra tudo por dia:** "Responderam: mande agora" no topo (corpo pronto de lead que acabou de responder, com
  "Enviar agora"), **Agendadas** (linha larga: quem, objetivo e mensagem, contexto, dia e hora, "Tirar da agenda"), e
  dois painéis lado a lado no modelo das imagens dele: **Follow-ups programados** (follow-up e retomada) e **Prontas
  para sair** (aberturas, com os fatos verificados), cada linha com Aprovar e Rejeitar e o painel com Aprovar todas e
  Rejeitar todas. Aprovar com `sugerido_para` agenda pra essa hora; sem data, vai pra "Aprovadas sem horário". Depois,
  "De prontidão" (corpo do passo 2 esperando a resposta) e o histórico recolhido. **Desde 10/10 dá pra aprovar daqui
  também mensagem de lead com agente** (pedido do Marcelo); a Mesa segue sendo a tela da conversa e do raciocínio do
  agente, e as duas telas mexem na mesma linha com trava de status, então nada sai duas vezes. O Farejador manda quando `agendado_para` vence (o PC precisa estar ligado); o limite de 10 vale por
  dia de envio. **O passo 2 também fica na ficha (aba Geral) e na conversa do lead** (`telas/conversas.js`, "Mensagens
  preparadas"), e usar uma ali marca como enviada e descarta as outras. As mensagens moram só na aba Geral; o
  Briefing fica com a pesquisa. O Copiloto da Geral mostra a variação simples com "Assina Marcelo/Antônio".
- Link wa.me sem o nono dígito **não é erro** (Bioclin, 25/09); o número gravado nunca é alterado.
- **Triagem com o conhecimento da casa (22/10/2026, pedido do Marcelo):** `doutrinaTriagem()` em `prompts.mjs` põe no pedido
  o geral (sinais do negócio local, ideia central do catálogo) sempre, e o específico só dos nichos que existem na lista:
  caderno + lições + catálogo do especialista (régua dos especialistas) ou, para os outros, só a SEÇÃO do nicho no
  `02-nichos-amplos.md` (mapa `NICHOS_AMPLOS`; seção nova no catálogo = linha nova no mapa). Cada lead vai com o campo
  `nicho` marcado e a regra de não aplicar lição de um nicho em outro. Pedido de operador restrito vai sem nada de
  `_gestao/` (`contaRestrita()`). Lista só de pet shops: uns 11 mil caracteres (antes, 70 mil num teste misturado). A nota da triagem grava os sinais vistos e, de quem passa, as
  oportunidades como hipótese.

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
- **Claude automático DESLIGADO (05/10/2026, Marcelo: "análises de conversa e lead só quando eu pedir"):** um loop do
  follow-up comeu o limite da assinatura (72 ciclos Opus em 3 dias). Chave `config.claude.automatico` (falta ou `false` =
  desligado, `claudeAutomatico()` em `followup.mjs`): resposta de lead não dispara ciclo nem análise, data vencida e
  silêncio de 3 dias não acordam o agente. Seguem os avisos no WhatsApp (sem Claude) e todo botão do painel.
  `config.whatsapp.auto_analisar = 'nunca'`. Crítico do agente roda no Sonnet; agente e reescrita no Opus com esforço médio.
- **Mesa de agentes (Fase 2, 30/09):** `app/js/telas/agentes.js`, rota `#/agentes`. Cartão por lead com a conversa, a
  proposta e "Aprovar e enviar" (resposta sai na hora pela conversa; primeira mensagem e follow-up vão pra fila do
  Disparos com janela e limite). Detalhe no `PLANO-AGENTES.md`. Botão "Agente" na ficha.
- **Especialistas por segmento e teste casa × curiosidade (Fases 3 e 4, 30/09):** Clara (clínicas), Lia (eventos), Rafa
  (oficinas), migração 014. O agente lê o caderno do nicho (`_memoria/prospeccao/segmentos/`) e as lições válidas; pode
  propor lição nova (o Marcelo aceita no caderno, na Mesa). A abertura segue o formato com menos envios. Escritório em
  pixel art no topo da Mesa (`app/js/pixel.js`). Mapa completo em "Como tudo se conecta", no `PLANO-AGENTES.md`.
- **Escritório com arte do ChatGPT (01/10):** palco manhã/tarde/noite e uma folha de 6 poses por especialista em
  `app/assets/escritorio/`; o código recorta, encaixa atrás dos monitores e anima. Especialista novo: `scripts/escritorio/LEIAME.md`.
  A cena conta sem palavras: pilha de pastas = leads de cada um, quadro da parede = placar do dia, Farejador desligado = escritório apagado.
  A página da Mesa: faixa "sua vez" no topo, a cena, Os leads (lista + painel), O time (cartões + resumo), Diário e lições.
- **Mesa como central de comando (01/10, revisão de UX do Marcelo):**
  - **Arquitetura:** lead com agente se decide SÓ na Mesa (aprovar, agendar, reagendar, cancelar envio, responder,
    decidir parar). Disparos é a fila de envio: primeira mensagem de lead sem agente e o histórico; o cartão de lead com
    agente lá só mostra e leva pra Mesa (`cartaoNaMesa`). Nunca dois botões de aprovar pra mesma mensagem.
  - **Links internos:** `#/agentes?lead=ID`, `?esp=clinicas`, `?filtro=voce|agendadas`. Toda notificação e tarefa tem
    destino (`linkDoJob` em `app/js/central.js`); notificação fica guardada no navegador.
  - **Central de tarefas** (ampulheta no topo, `central.js`): em andamento com progresso real, fila, últimas 24 h,
    cancelar e tentar de novo. `criarJob` avisa a central na hora.
  - **Desistência controlada** (`app/js/saude.js`, migração 015): a régua (respondendo, em acompanhamento, sem resposta,
    baixa chance, desinteressado) vai pra tela e pro pedido do agente. "encerrar" do agente virou RECOMENDAÇÃO
    (`agentes.recomendacao`); o lead fica em "Decidir" até o Marcelo aprovar (geladeira com data, perdido) ou mandar continuar.
  - **Balão do especialista** abre as demandas dele (o que aconteceu, por que chama, botão de resolver); abas por especialista.
  - **Escritório:** mapa da Bahia na tela da parede (leads por cidade, `CIDADES` em pixel.js), camadas fixas + rAF ~24 fps.
- **Perdido sai da Mesa e não volta (05/10, Marcelo):** lead com agente em perdido/ganho (fase do agente OU estágio
  da ficha) ou encerrado fora da geladeira some da Mesa (filtro no carregamento de `telas/agentes.js`); geladeira e
  pausado seguem em "Parados", com o selo "Geladeira". Mover a ficha pra perdido NÃO muda o agente: por isso o
  `followup.mjs` também não acorda agente de ficha perdida ou ganha. Origem: Land Car e Autobahn, que iam voltar
  em 10/11 e 23/11 depois de perdidos. Geladeira com data só pra quem demonstrou interesse; quem nunca reagiu
  vai pra perdido e só reabre com fato novo (anúncio, inauguração, vaga), nunca por data.
- **Revisão sem sair do aviso (02/10, pedido do Marcelo):** tudo que espera o Marcelo (aprovar, responder, decidir) abre
  na **gaveta de revisão** (`abrirRevisao` em `telas/agentes.js`), vinda do sino (`&revisar=1`), do balão do especialista,
  dos cartões, do diário e da faixa "sua vez". Um componente só (`revisao(a, g, modo)`) serve a gaveta, o painel do lead
  e o balão do especialista (modo `pop`: editar, aprovar, agendar, rejeitar e refazer dentro do próprio balão).
  No painel: conversa à esquerda, mensagem proposta à direita no alto, contexto embaixo dela (pedido do Marcelo, 02/10).
  - A mensagem aparece como a PRÓXIMA fala da conversa: linha "entra aqui", balão tracejado com o rosto de quem escreveu
    e "ainda não saiu". Editar é no próprio balão (clique, `E`), com "editada por você" e "desfazer edição".
  - Ações num rodapé fixo: Rejeitar e Refazer (o motivo é pedido ali, com "vale pro nicho"), Agendar, Aprovar.
    Aprovar e enviar na hora dá 5 s pra desfazer; aprovar pra fila mostra "Desfazer" no aviso (falha honesta se o
    Farejador já pegou). Depois de decidir, a gaveta passa pro próximo; setas/J/K navegam, Esc fecha.
  - **Uma cor por estado:** laranja = sua vez (aprovar/responder/decidir: muda verbo e ícone, não a cor), azul = pensando,
    violeta = agendada, verde = enviada, cinza = com o lead. Verde nunca significa "precisa de você".
- **Enriquecer lista (01/10):** só completa dados de itens da lista (não cria cliente). `lista_itens.enriquecido_em`
  (migração 016) marca quem já foi; o "top 10" pula esses; a lista mostra faixa de andamento/pronto, filtro "Enriquecidos"
  e a oportunidade de cada um.

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
- **`node scripts/placar.mjs` (08/10/2026):** placar das abordagens de prospecção: contatos, respostas, reuniões
  marcadas e feitas, clientes, por etiqueta `abordagem:<id>` da ficha. Plano em `_memoria/prospeccao/40-testes.md`.
- **`scripts/conversa-auto/` (09/10/2026):** `enviar.mjs` manda balões pela fila do Farejador (mesmo caminho do botão
  Enviar) e `vigiar.mjs` acorda o Claude quando o lead escreve (uma consulta por minuto ao banco, sem gastar token).
  Só por pedido do Marcelo, só no lead nomeado (exceção registrada no `CLAUDE.md` da raiz).
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
- **Tarefa privada e o Antônio (21/10/2026, migração 018):** o Antônio é operador e **não pode saber que existe um
  teste de 90 dias** (pedido do Marcelo). Tudo do acompanhamento dele é `privada = true` (só o dono vê; trava no banco,
  conferida simulando um operador). O que ele vê se escreve neutro ("meta comercial", nunca "teste"). Pedido de operador
  no painel roda **restrito**: só na conta Claude dele, MCP sem tarefa privada (`HD_SO_PUBLICO`,
  `mcp-farejador-restrito.json`) e `Read` negado em `_gestao/`. Conferir com `node scripts/testar-restrito.mjs`.
- **Prazo só em dia útil (21/10/2026):** o `hd_salvar_tarefa` recusa sábado e domingo. Origem: na revisão de 21/10 o
  Claude marcou contador, CNPJ e conta PJ em sábados. Script em lote que escreve direto na tabela confere o dia também.
- **Projeto (21/10/2026, migração 017):** `tarefas.projeto` agrupa tarefas do mesmo fim (Tráfego, Icarus, Empresa, Teste do
  Antônio, Social Media, Prospecção, Presença Google, CRM + WhatsApp, Ofertas e preço, Cases e prova). Não substitui o
  objetivo do plano (O1 a O7). Tela: visão "Por projeto" com barra de progresso e filtro; MCP: `projeto` no `hd_tarefas`
  e no `hd_salvar_tarefa`.
- Agenda continua sendo compromisso com hora. Tarefa não tem hora.

## 📣 Mídia, o agente de social media (27/09/2026)

Tela Instagram ganhou as abas Semana, Agenda, Agora, Caixa e Aprendizados (`app/js/telas/midia.js`).
O Farejador chama `farejador/midia.mjs` a cada minuto (agenda em `social_rotinas`, migração `008_midia.sql`);
as tarefas `midia_semana`, `midia_ajuste` e `midia_triagem` estão em `tarefas.mjs`. Com `config.midia.ativo`,
a coleta antiga do Instagram (leitura pública) fica parada e o botão "Atualizar agora" coleta pela API oficial.
O motor e o porquê moram em `ferramentas/social/` (ARQUITETURA.md §7). **Nunca rodar `npm run migrar` inteiro
sem conferir a 002** (tem o @ antigo como padrão); aplicar só a migração nova.

**🎨 Estúdio e tela cheia (21/10/2026, pedido do Marcelo para o Antônio cuidar do Instagram):**
- `app/js/estudio.js`: editor de carrossel em canvas 1080 × 1440 (texto com `*destaque*`, formas, linha/seta, imagem do
  computador, colar ou arrastar; camadas, ímã, desfazer, modelos com a identidade da Horus, avisos do piso de 24 px).
  O mesmo desenho serve à tela e ao JPG. Salvar sobe os slides em `midia/horus/estudio/<post>/` (regras da migração 017:
  operador só escreve embaixo de `horus/estudio/`) e grava o post em `social_posts` com `status = 'aguardando'` e o
  documento em `conteudo.estudio`. Post do Mídia aberto no Estúdio entra com cada slide como imagem travada no fundo.
  Post editado no Estúdio não aceita "Pedir ajuste" do Mídia (refazer apagaria a edição; `midiaAjuste` recusa).
- `app/js/visor.js`: tela cheia com zoom (clique, roda, pinça), setas e miniaturas. Usa `slides[].url_publica`.
- Desde 21/10 o `montarPost` já sobe os slides do rascunho (`midia/horus/rascunho/...`) e grava `url_publica`; o
  `rotinaPublicar` usa a URL quando o slide não tem `arquivo` (slide do Estúdio). **Mudança no Farejador só vale depois de
  reiniciá-lo.** Teste local do painel: `node scripts/servir-painel.mjs` (porta 5179).

**Mídia com o conhecimento da casa e imagem do ChatGPT (21/10/2026, pedido do Marcelo):**
- `doutrinaMidia()` em `farejador/midia.mjs` lê na hora e põe DENTRO do pedido: padrão da casa (topo da skill /carrossel),
  essência (07/10), perfil, antipadrões, checklist, formatos, legibilidade, as referências da skill, perfis e estudos de
  perfil, integridade; a sessão da semana recebe também a pauta aprovada mais recente (`marketing/conteudo/midia/pautas/`).
  A versão curta (núcleo) vai nas rodadas de correção e no revisor 🎨 Criação. Pauta acabou = nenhum post, aviso com ideias.
- Séries novas em `ferramentas/social/lib/carrossel-v2.mjs` (`serie: tweet | escuro`), copiadas dos posts que o Marcelo
  aprovou: capa sempre com imagem, metade do miolo com prova visual (imagem, antes/depois, conversa de WhatsApp, busca),
  aperto automático quando o texto não cabe. O molde antigo (`layout`) segue só para ajustar post antigo; ajuste que pede
  imagem ou outra estrutura converte o post para a série nova. Imagem que não muda guarda o `arquivo` e não se gera de novo.
- Imagem: `farejador/imagens.mjs` roda o Claude em modo `chrome` (`--chrome`, isolado) no Chrome do Marcelo, conversa
  normal do ChatGPT (a temporária não gera imagem), baixa em `E:\Users\hagge\Downloads` e move pra `<post>/img/`. Sonnet,
  uns 2 min por imagem, até 4 por post.
- Chrome fora: a tarefa volta pra fila a cada 15 min (`retomarEm` no erro, tratado em `index.mjs`), um aviso no WhatsApp,
  e retoma de onde parou (plano e posts feitos ficam em `jobs.saida`). Depois de 4 dias, desiste com erro.

**Estado das rotinas (18/10/2026, Marcelo):** só `semana` (planejamento semanal de posts, segunda 8h), `publicar` e `token`
ficam ligadas em `social_rotinas`. `caixa` (comentários e DMs) e `triagem` estão desligadas por gastar token e engavetadas;
sem a caixa, DM nova não avisa no WhatsApp. `metricas` também desligada (05/10). Religar = `ativo = true` na linha.

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
