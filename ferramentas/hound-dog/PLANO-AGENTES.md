# Plano — Time de agentes de prospecção no Hounder

> Conversa de 29/09/2026 (Marcelo + Claude). **Decisões respondidas e Fase 1 implementada em 29/09** (ver
> "Fase 1: o que foi feito" no fim). Fases 2 a 4 ainda não.
> Contexto da sessão em `_memoria/prospeccao/README.md` e no card `servico-crm-whatsapp.md`.

## O pedido do Marcelo

Um agente por prospect: pesquisa, entende o negócio, se especializa naquele lead, prepara a abordagem,
escreve a mensagem inicial e, quando o lead responde, conduz a conversa (lê, qualifica, trata objeção,
avança pra conversão, sabe quando parar). Vários ao mesmo tempo. **Nada sai sem aprovação:** a mensagem
fica esperando, ele olha e aperta "Aprovar e enviar" (tira a fricção de ele ficar pensando demais antes de
enviar). Inteligência no nível das análises feitas no chat com o Claude, com todo o conhecimento de
prospecção coletado (repositórios, mentes, doutrina) fazendo parte da decisão, não só "acessível".
Pensar em "quem é essa pessoa, o que impede o negócio de crescer, como iniciar, se responder X o que
significa, qual objeção está por trás, quando converter, quando parar, o que falta descobrir".
Começo sem mencionar a Hórus, sem cara de agência vendendo.

## A ideia central

"Agente" não é um programa rodando o tempo todo. É **um lead com memória e dono**:
1. **Memória por lead:** fatos (com fonte e data), hipóteses, decisor, objeções ouvidas, o que já foi
   tentado, correções do Marcelo, plano (tese, próxima jogada, quando parar) e um **diário de decisões**
   ("aconteceu X, li como Y, decidi Z, porque W").
2. **Ciclo por acontecimento:** lead novo designado · o lead respondeu (humano, não robô) · o Marcelo
   editou, aprovou ou recusou · venceu um prazo (follow-up, geladeira) · o Marcelo pediu. Em cada ciclo:
   ler a memória → pensar (as 13 perguntas, por escrito) → decidir (mensagem, esperar, pedir algo ao
   Marcelo, encerrar) → escrever → crítico → gravar.
3. **Aprovação humana de tudo que sai** (como o Disparos já faz).

Hoje o Hounder já tem quase todas as peças (investigação, Disparos, análise de conversa, chat por lead).
O que falta é **continuidade**: cada tarefa é um `claude -p` novo que esquece tudo ao terminar.

**Simultâneo, na prática:** o Farejador roda `MAX_CLAUDE = 2` (farejador/index.mjs) e uma tarefa de
navegador por vez. Então são dezenas de agentes vivos, 2 pensando por vez; um ciclo leva 1 a 2 min. O
limite real é a assinatura do Claude (Opus 5.5 no esforço alto). Dá pra subir pra 3 ou 4 nas tarefas sem
navegador se precisar.

## Iguais ou especializados

- **Mesmo cérebro pra todos.** O que um aprende tem que valer pra todos na hora; agentes separados
  fragmentam o aprendizado.
- **Especialização pela memória do lead** (a de verdade) e por **pacotes de segmento** carregados pela
  categoria: saúde regulada (CFO, CFP, COFFITO, CRBM, falta, retorno), orçamento personalizado (eventos,
  marcenaria: lições da Casa Verona), automotivo, varejo e comida. Moram em `_memoria/prospeccao/segmentos/`.
- **Especialização por função dentro do ciclo** (onde está a qualidade):
  - **Estrategista:** responde as 13 perguntas por escrito antes de qualquer mensagem.
  - **Redator:** escreve na voz do Marcelo (`voz-marcelo.md`, `exemplos.md`).
  - **Crítico:** outro `claude -p`, **sem ver o raciocínio do estrategista**, lê a mensagem como o dono
    leria, passa `99-checklist.md`, `90-cara-de-ia.md` e o `revisor.js`, e devolve com o que falta.

## Por que o Claude do Hounder às vezes fica abaixo do chat

Não é o modelo (desde 29/09 é o mesmo Opus 5.5 alto). É o **processo**: no chat o Claude itera, confere na
fonte, recebe correção na hora e olha o lote inteiro; no Hounder é uma passada só. O que fecha a diferença:
1. **O crítico separado** (metade dos erros de 29/09, como o robô no corpo e o "sobre a agenda", um segundo
   leitor pegaria).
2. **As correções do Marcelo na memória** (o banco guarda o original desde a migração 010;
   `scripts/aprender.mjs` lista as edições).
3. **Provas antes de cada mudança:** os casos reais viram teste em `_memoria/prospeccao/provas/` (teste cego
   3×1, Bioclin que já confirmava, robô no corpo, a regra da secretária, "sobre a agenda", prova social
   inventada). O agente tem que chegar nas decisões do Marcelo antes de a mudança valer.
4. **Raciocínio visível** no cartão: o Marcelo vê quando está raso.

## As 13 perguntas como estrutura obrigatória

| Pergunta | O que responde |
|---|---|
| Quem é, qual o contexto | Investigação (6 camadas) e memória do lead |
| O que impede de crescer, que problema | Sinais S1 a S14 (`10-sinais.md`); a oferta sai da maior falha verificável (Regra 5) |
| Que abordagem tem mais chance | Presente antes do pedido (Cialdini); valor grande e rápido (Hormozi); oferta nas palavras dele (`20-escrita.md` §1) |
| Como iniciar | Dois passos, pergunta de duas saídas (§12), regra da recepção (§6) |
| Se responder X, o que significa; qual objeção | Voss (espelhar, rotular, "o que/como", nunca "por quê") e as 7 crenças do Cole Gordon (MM-CG-001) |
| Qual a próxima pergunta | Nada de interrogatório no frio; SPIN e Mom Test só depois do interesse |
| Quando converter | Um pedido claro; avanço x continuação (Rackham) |
| Quando parar | Regras explícitas: aceitar a saída, um follow-up, geladeira com data |
| O que falta descobrir | Lacunas da memória; o que só o Marcelo faz (busca no celular, print) vira "precisa de você" |

## A tela: Mesa de agentes

Um cartão por lead, agrupado pelo que precisa do Marcelo, nesta ordem:
1. **Pronto pra aprovar** (topo, aprovação em lote): mensagem + uma linha de porquê + **Aprovar e enviar ·
   Editar · Outra opção · Não mandar**.
2. **Precisa de você:** print, busca, decisão (ex.: exclusividade Harmony × Cavalcante).
3. **Trabalhando:** pesquisando ou escrevendo.
4. **Esperando o lead**, com a data do próximo passo.
5. **Encerrados:** geladeira com data de voltar, ganho, perdido.

Clicar abre o agente do lead: raciocínio, memória, diário, conversa. A ficha ganha uma aba "Agente".

## O que se reaproveita

- **Disparos = caixa de saída de todos os agentes** (primeira mensagem, corpo, resposta, follow-up). Já tem
  aprovação, janela de horário, limite diário, trava de resposta automática, `texto_original`.
- **Análise de conversa** (`analisarConversa`) vira o ciclo "o lead respondeu".
- **Investigação** (`investigarEmpresa`) vira o ciclo zero.
- **Chat por lead** vira "conversar com o agente" (grava na memória).
- Continuam: `revisor.js`, `doutrinaConversa()`, playbook de objeções, `reconciliarEnviosManuais`,
  `aprender.mjs`.

## Evitar trabalho repetido e confusão

- **Um agente por lead e um ciclo por vez por lead** (a fila já deduplica; já existe a espera de 25 s pra
  juntar mensagens seguidas do lead, `agendarAnalise` em index.mjs).
- **Supervisor só pro que cruza leads:** exclusividade de bairro/nicho (Bioclin × Cintya, Harmony ×
  Cavalcante), variação no lote, limite diário, prioridade (quem respondeu primeiro).

## Começar sem mencionar a Hórus

É o formato "curiosidade" já em teste (`abordagem-e-prospeccao.md` §11). Três limites:
1. O Marcelo aparece como **pessoa** ("Marcelo", foto dele no WhatsApp); a Hórus aparece na oferta
   ("aliás, nem me apresentei...").
2. **Nunca se passar por cliente** (a Jéssica achou que era orçamento de festa: o "não é orçamento" é
   obrigatório quando o contexto induz ao engano). Omitir a empresa pode; deixar acreditar em algo falso não.
3. Perguntaram quem é: a verdade na hora.
Os agentes alternam casa × curiosidade e medem quem responde mais (é o A/B aberto em 24/09).

## Onde entra na arquitetura

- **Banco (migração 011):** tabela `agentes` (empresa_id único, status, fase, plano jsonb, memória jsonb)
  + `agente_eventos` (diário); em `disparos`: `tipo` (abertura, corpo, resposta, followup),
  `agente_ciclo_id`, `raciocinio`.
- **Farejador:** `farejador/agente.mjs` (ciclo: estrategista, redator, crítico); gatilhos em index.mjs
  (lead com agente → `agente_ciclo` no lugar de `analisar_conversa`); agendador de follow-up e geladeira.
- **Prompts:** `promptAgente` (estrategista + redator) e `promptCritico` em `prompts.mjs`.
- **Painel:** `app/js/telas/agentes.js` + aba "Agente" na ficha.
- **MCP:** `hd_agente` (ler memória) e `hd_agente_nota` (acrescentar informação).
- **Doutrina:** `_memoria/prospeccao/segmentos/` e `_memoria/prospeccao/provas/`.

## Fases

1. **Fase 1:** memória + ciclo + crítico, toda saída no Disparos. Testar nos 6 leads vivos (LevSaúde,
   Talina, Bioclin, Cintya, Harmony, Cavalcante), comparando com o que o Claude do chat diria.
2. **Fase 2:** a Mesa de agentes.
3. **Fase 3:** provas + pacotes de segmento. ✅ 30/09 (especialistas e cadernos; provas continuam só as reais).
4. **Fase 4:** agendador de follow-up/geladeira + teste casa × curiosidade. ✅ 30/09.

**Risco principal:** o Marcelo aprovar sem ler porque o agente "parece bom". A linha de porquê, o crítico e
o verificador existem pra isso.

## As 4 decisões do Marcelo (respondidas em 29/09/2026)

1. Aparecer como "Marcelo", sem a Hórus até a oferta, com os três limites acima? **Sim.**
2. O agente pode pedir uma investigação nova sozinho, ou só com o ok dele? **Pode investigar sozinho.**
   (Freio no código: uma por semana por lead, nunca duas na fila; passou disso, pede ao Marcelo.)
3. Quantos agentes ativos de uma vez? **10** (`LIMITE_AGENTES` em `lib/agentes.mjs`).
4. Começar pela Fase 1 nos 6 leads vivos? **Pode.**

## Fase 1: o que foi feito (29/09/2026)

- **Banco, migração `011_agentes.sql`:** `agentes` (um por empresa: status ativo/pausado/encerrado, fase na ordem
  da Mesa, plano, memória, `precisa_de_voce`, `proximo_ciclo_em`), `agente_eventos` (o diário, com o raciocínio
  inteiro e o parecer do crítico em `dados`), e em `disparos`: `tipo`, `agente_ciclo_id`, `raciocinio`.
- **`lib/agentes.mjs`:** designar (respeita o limite), pausar/encerrar, `pedirCiclo` (um ciclo por vez por lead:
  acontecimento novo com um ciclo já na fila entra nele), nota na memória, leitura.
- **`farejador/agente.mjs`, o ciclo (tarefa `agente_ciclo`):** estrategista + redator numa chamada Opus, só leitura,
  com as 13 perguntas obrigatórias por escrito antes da mensagem → revisor mecânico → **crítico em outra chamada,
  modo leve, sem ver o raciocínio** → uma reescrita no que ele reprovou → crítico de novo. Decisões: mensagem,
  manter as pendentes (o crítico anota o parecer nelas), esperar, precisa do Marcelo, investigar, encerrar. As
  edições, escolhas e descartes do Marcelo no Disparos entram como correções na memória a cada ciclo.
- **Gatilhos:** designado; o lead respondeu (humano; robô não gasta ciclo; substitui a análise avulsa pra quem tem
  agente, e a leitura continua aparecendo na conversa); investigação pronta; pedido do Marcelo. Mensagem que sai
  pro lead passa o agente pra "esperando o lead".
- **Saída:** passo 1 no Disparos; passo 2 em diante nas "Mensagens preparadas" da conversa e na ficha. Os cartões
  mostram o **porquê** e o **parecer do crítico**. Aviso no WhatsApp do Marcelo quando há mensagem pra aprovar ou
  quando o agente precisa dele.
- **MCP:** `hd_agente`, `hd_agente_designar`, `hd_agente_nota`, `hd_agente_pedir`, `hd_agente_status`.
  **Linha de comando:** `node scripts/agente.mjs [designar|ver|pedir|pausar|encerrar] <nome>`.
- **O que a primeira rodada nos 6 leads ensinou (29/09, noite):**
  - Na Bioclin, a reescrita trouxe de volta a "confirmação na véspera", o erro que o Marcelo tinha corrigido no teste
    cego. O redator não lia os aprendizados nem as correções dele; agora lê. E **só vira rascunho o que o crítico
    aprovou**: o que ele reprovou fica no diário (`dados.reprovadas`), não na frente do Marcelo.
  - No Cavalcante, o estrategista quis manter as 5 mensagens da investigação e o crítico reprovou as 5 (uma afirmava
    "vê só a nota e o WhatsApp", mas a ficha tem agenda on-line pela Clinicorp). Regra: no "manter", a reprovada é
    cancelada; se o passo atual fica vazio, roda um ciclo `critico_reprovou` com as notas (uma vez; na segunda, pede ao
    Marcelo).
  - O crítico cobrava o nome da Hórus na abertura e o estrategista cedia. Agora o crítico também conhece a decisão 1.
  - O crítico reprovava passo 2 preparado "porque ninguém respondeu ainda". Agora sabe que a trava do Disparos segura.
- **Comparação com o Claude do chat, Cintya (30/09):** o agente voltou na tese do retorno pra quem chama pelo anúncio,
  que o Marcelo tinha descartado com motivo, e abriu com "Boa noite" numa mensagem da manhã. Causa: o descarte com
  motivo não chegava ao agente (só o descarte sem motivo contava) e a lista de mensagens não mostrava por que cada uma
  saiu. Corrigido: descarte com motivo vira correção obrigatória (`leituraDoMarcelo`), o crítico recebe as correções e
  veta tese ressuscitada, saudação com hora reprova, e `[outro]` sem texto (aviso do WhatsApp) não é fala nem acorda o
  agente. Refeito, o agente chegou na mesma tese e quase na mesma mensagem do chat. **Lição:** a distância entre o
  agente e o chat está no que chega até ele, não no modelo; comparar lado a lado é o que acha o buraco.
- **Follow-up programado (30/09, pedido do Marcelo; adiantou parte da Fase 4):** `farejador/followup.mjs`, a cada 10 min.
  Nós falamos por último há 3 dias → o agente do lead prepara UM follow-up (padrão da casa na A; fato novo ou outro
  ângulo na B), com `disparos.sugerido_para` no 4º dia às 9h; lead sem agente ganha um se houver vaga (limite 10), senão
  o Marcelo é avisado. Já saiu um follow-up sem resposta → o agente encerra com geladeira e data de voltar. O lead falou
  por último há 3h ou mais → aviso "Esperando a sua resposta" no WhatsApp do Marcelo, um por fala do lead
  (`whatsapp_conversas.lembrete_resposta_em`), e o resumo das 8h lista quem espera mesmo com a conversa já lida.
  Data do agente vencida → acorda o agente; geladeira com data → volta se houver vaga. Tela Disparos: seção "Follow-ups
  programados" com "Programar pra <data>". O envio do follow-up não passa pela trava do passo 2. Migração 012.
- **"Se responder assim" afinado (30/09):** as respostas prontas passam por uma revisão do crítico (`promptRespostas`),
  que corrige no lugar ou tira; nada de "amanhã"/horário fixo (envelhece), nada de tese descartada.
- **Datas:** o agente escreveu "01/10/2026" e o código leu 10 de janeiro. `dataPara` lê o formato brasileiro primeiro e
  descarta data no passado.
- **Ficou pra depois (atualizado 30/09):** o agendador que acorda o agente e o follow-up saíram em 30/09
  (`farejador/followup.mjs`); a Mesa saiu em 30/09 (seção abaixo). Faltam provas e pacotes de segmento (Fase 3) e o teste
  casa × curiosidade (Fase 4).

## Fase 2: a Mesa de agentes (30/09/2026)

Tela `app/js/telas/agentes.js`, terceira do menu ("Mesa de agentes", badge = pra aprovar + precisa de você).
- **Grupos na ordem do que precisa do Marcelo:** pronto pra aprovar, precisa de você, trabalhando, esperando o lead,
  pausados e encerrados. O grupo é calculado do estado real (rascunho no Disparos, job `agente_ciclo` na fila, trava do
  passo 2), não só da `agentes.fase`. Filtros no topo (lembrados no navegador).
- **Cartão pronto:** avatar com a cor da temperatura, etiquetas (estado, temperatura, "esperando você há X"), balão com a
  leitura atual do agente (`whatsapp_conversas.analise.momento`, senão `plano.proxima_jogada`), a conversa à esquerda e a
  proposta à direita (abas A/B, texto editável, porquê em 3 linhas, crítico, revisor recolhido quando só tem aviso).
- **Aprovar e enviar:** resposta a lead que falou sai na hora pela conversa (`whatsapp_enviar`, igual à tela Conversas);
  primeira mensagem e follow-up entram na fila do Disparos (`agendado`, janela de horário, limite de 10 por dia).
  Passo 2 sem resposta humana fica travado e o cartão vai pra "esperando" com a mensagem guardada.
- **Outra opção / Não mandar:** pedem o motivo. "Outra opção" cancela com motivo do sistema, grava o motivo como correção
  na memória e pede ciclo `pedido`; "Não mandar" cancela com o motivo do Marcelo (o agente lê como descarte com motivo).
- **"Agora no time":** o diário de todos os agentes (`agente_eventos`) em tempo real, na coluna da direita.
- **"Responderam X de Y":** primeira mensagem enviada × resposta de gente depois dela (robô e aviso não contam).
  Porcentagem só com 20 ou mais; o número vem sempre com a base.
- **"[outro]" sem texto é aviso do WhatsApp** nos dois sentidos e não muda de quem é a vez (Cintya, 30/09).
- **Tempo real sem apagar edição:** com texto editado na tela, a atualização de fora espera e aparece "Chegou novidade ·
  Atualizar". O ponto do Farejador só atualiza a faixa de status.
- **Ficha:** botão "Agente" abre plano, memória, diário e o campo pra contar algo ao agente (`abrirAgente`).
- **Layout do ChatGPT (30/09):** avaliado com o Marcelo. Ficaram de fora a persona por segmento (o modelo aqui é um agente
  por lead), a ilustração grande e os números sem base; entraram o feed, o balão, a etiqueta, os filtros e a taxa com base.

## Fases 3 e 4: especialistas por segmento e o teste casa × curiosidade (30/09/2026)

Pedido do Marcelo: a tela como a do ChatGPT (bonecos pixelados que se mexem) e "como todo o sistema vai se conectar".
- **Especialista = dono do caderno de um nicho.** Clara (clínicas e estética), Lia (eventos), Rafa (oficinas). O agente
  continua um por lead; o especialista junta o que vale pra todos os leads do nicho. Migração `014_especialistas.sql`:
  `especialistas` (palavras que casam com a categoria da ficha, caminho do caderno, aparência do boneco),
  `especialista_notas` (lição do nicho: `valida` ou `proposta`) e `agentes.especialista_id` (ligado sozinho no primeiro
  ciclo ou ao designar, `garantirEspecialista` em `lib/agentes.mjs`). Lead de nicho sem caderno fica sem especialista.
- **Cadernos** em `_memoria/prospeccao/segmentos/` (clinicas, eventos, oficinas), escritos só com o que tem fonte
  (memória dos agentes, investigações, aprendizados, correções). O agente lê o caderno + as notas válidas antes de pensar
  (`blocoNicho` em `prompts.mjs`), o crítico também (lição do nicho furada = veto), e o agente pode devolver
  `aprendizado_nicho`, que entra como **proposta** pro Marcelo aceitar no caderno da Mesa.
- **O Marcelo ensina o nicho** marcando "vale pro nicho todo" no "Não mandar", no "Outra opção" ou no "Contar ao agente",
  ou escrevendo direto no caderno do especialista. MCP: `hd_agente_nota` com `nicho: true`.
- **Teste casa × curiosidade (Fase 4):** até 30/09 as 5 aberturas foram "casa" (4 com resposta de gente) e nenhuma
  "curiosidade". `placarFormatos` + `formatoDaVez` (lib) mandam a próxima abertura no formato com menos envios, no
  nicho do lead; o crítico e a reescrita conhecem as regras do formato curiosidade (§11). O placar aparece na Mesa,
  por especialista e no total.
- **Tela:** o escritório em pixel art no topo da Mesa (`app/js/pixel.js`, tudo desenhado em código): cada especialista
  numa mesa, com o estado do lead mais urgente (digita, levanta a mão com "!", acena, cochila com zZ e café, comemora
  reunião), balão com o texto real e placa que filtra os leads dele. Abaixo, um cartão por especialista com números
  reais (leads ativos, pra aprovar, responderam X de Y, reuniões, placar do teste) e o caderno. A animação para com a
  aba escondida, fora da tela ou com "reduzir movimento".
- **Resumo das 8h:** uma linha por especialista com mensagem pronta, pedido pra você e lição pra aceitar.
- **Reorganização (30/09, noite, pedido do Marcelo: "achei desorganizadas as informações"):** "agente" deixou de nomear duas
  coisas. Os bonecos são **especialistas** (3); os leads são **leads acompanhados** (até 10). A Mesa virou três colunas,
  como a referência do ChatGPT: lista de leads à esquerda, o lead selecionado no centro (conversa, porquê, **todas as
  opções de mensagem em abas A/B/C**, fatos conferidos, Aprovar e enviar), estado do time e atividade à direita;
  especialistas e lições do nicho embaixo. Depois de aprovar, o centro pula pro próximo lead que espera você.
  Bonecos redesenhados com o dobro de resolução (pixel de 2 px, olhos de anime, cabelo com mechas, monitor visto por trás).

## Como tudo se conecta

```
 Spark → triagem → investigação (6 camadas) ─┐
                                             ▼
                               AGENTE DO LEAD (um por lead)
         memória do lead + plano + diário ◄──┤──► CADERNO DO NICHO (especialista: Clara, Lia, Rafa)
                                             │      arquivo em _memoria/prospeccao/segmentos/ + notas válidas
 gatilhos: lead respondeu, silêncio 3 dias,  │
 data marcada, pedido do Marcelo, investigação pronta
                                             ▼
                  ciclo: pensar (13 perguntas) → decidir → escrever (formato da vez no passo 1)
                         → revisor mecânico → crítico (lê o nicho) → reescrita → crítico
                                             ▼
                          MESA DE AGENTES (Aprovar e enviar · Outra opção · Não mandar)
                  ┌──────────────────────────┼───────────────────────────┐
     resposta a quem falou:        primeira mensagem e follow-up:   correção com motivo:
     sai na hora pela conversa     fila do Disparos (janela, 10/dia) memória do lead e, se marcar,
                  └──────────────► WhatsApp (Farejador) ◄──────────┘ caderno do nicho
                                             ▼
                resposta do lead → novo ciclo; placar casa × curiosidade; lição proposta pro nicho
```

## Pré-requisito do serviço (não dos agentes)

A oferta de CRM + WhatsApp ainda não foi entregue a ninguém. Antes da primeira R1: montar a demo (Pronto
como clínica fictícia) e trocar as chaves do Pronto. Análise completa do serviço (CRM, hospedagem, preço,
trâmite) em andamento; base em `_conhecimento/network/servico-crm-whatsapp.md`.
