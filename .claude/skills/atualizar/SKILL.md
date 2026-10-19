---
name: atualizar
description: >
  Aprende com o trabalho feito e mantém a memória do Horus OS coerente. Faz duas coisas.
  (1) Retrospectiva: lê nas conversas e no Hounder o que o Marcelo corrigiu, escolheu, elogiou e perguntou, entende o
  porquê e transforma cada lição em regra, item de checklist ou script, no lugar certo.
  (2) Varredura: reconcilia os arquivos de contexto com o estado real, acha contradição e fato vencido, e promove o
  aprendizado que ficou preso na pasta de um cliente.
  Use quando o Marcelo disser "atualiza", "/atualizar", "aprenda com o que fizemos", "o que aprendemos",
  "atualiza o contexto", "varre o projeto", "reconcilia a memória", ou ao fechar um caso ou uma rodada longa.
---

# /atualizar: aprender e manter a memória

O Horus OS aprende gravando em arquivo. Duas coisas estragam isso:
- **a lição que não sobe:** a correção morre no chat, ou fica no diário de um cliente, e volta como erro no próximo;
- **o arquivo que descola do real:** o cliente mudou de estado, a decisão foi revogada, e o arquivo continua afirmando
  o contrário.

Esta skill cuida das duas. Ela é diferente do `/abrir`, que só carrega o contexto, e do `/verificar`, que confere uma
entrega.

> **Regra de ouro.** Quando o Marcelo pede para aprender ou atualizar, o pedido já autoriza gravar. Aplicar com cirurgia,
> só na linha relevante, e mostrar cada linha gravada. **Perguntar antes** só em quatro casos:
> - apagar conteúdo;
> - resolver uma contradição sem evidência clara de qual lado está certo;
> - mexer em decisão que é dele (preço, gosto, escopo);
> - transformar em regra da casa algo que pode ter sido gosto daquela vez.
>
> Na varredura sem pedido explícito, vale o antigo: propor primeiro, com o diff à vista.

## Parte 1: Retrospectiva (o que este trabalho ensinou)

O resultado final é o que menos ensina. O que ensina é **onde o Marcelo teve que intervir e por quê**, e o que ele fez
diferente do que eu recomendei.

### 1. Juntar as fontes

| Fonte | Como ler | O que tem lá |
|---|---|---|
| Conversas no PC | `node .claude/skills/atualizar/scripts/mensagens-do-marcelo.cjs --termo "<cliente>" --desde AAAA-MM-DD --contexto` | Cada correção, pergunta e elogio, com o que eu tinha dito logo antes |
| Ficha no Hounder | `hd_empresa`: linha do tempo + `whatsapp_ultimas` | **O que ele de fato mandou**, para comparar com o rascunho que eu dei. É o sinal mais fácil de perder |
| Dossiê do cliente | `clientes/<nome>/CLAUDE.md` e `PLANO.md` | As rodadas e as decisões registradas |
| Versões guardadas | `versoes/antes-*` e `git log` / `git status` | Cada backup marca uma rodada de correção. Contar as rodadas mede o retrabalho |
| Sessões na nuvem | Não ficam no PC. O que veio delas está no Hounder (notas "o que ficou só na pasta") e no dossiê | |

Sem o script, a retrospectiva fica presa ao resumo da conversa atual e perde o que aconteceu nas outras sessões. No caso
da Débora foram 21 conversas.

### 2. Classificar os sinais

Ler as mensagens em ordem e marcar cada uma:

| Sinal | Como aparece | O que ensina |
|---|---|---|
| **Correção explícita** | "não gostei", "tire", "não é assim", "por que você errou?" | O erro e a regra que faltou |
| **Escolha divergente** | Ele mandou ou fez outra coisa, sem comentar (rascunho na ficha diferente do enviado no WhatsApp) | Onde meu julgamento falhou sem ninguém dizer. Perguntar: por que a escolha dele era melhor? |
| **Pergunta de porquê ou de contexto** | "É de qual contexto?", "qual o propósito?", "me explica por que escolheu isso" | Faltou justificativa, ou tirei algo do contexto |
| **Frustração com o ritmo** | "milhões de versões", "passamos o dia inteiro e nem mandei nada", "demorei demais" | Processo lento: versões demais, polimento antes da entrega |
| **Elogio específico** | "Amei o site", "gostei da sua sugestão", "você foi ótimo, bem humano" | **O que repetir.** Registrar o acerto com o mesmo cuidado do erro |
| **Decisão no calor** | Desabafo, "não vou dizer mais nada", "descontinua" | Decisão a confirmar no dia seguinte, nunca regra nem ação irreversível |
| **Tempo** | Horários: o lead mostrou interesse → a entrega saiu | Janela perdida. Medir em horas, não em impressão |

### 3. Escrever cada lição com o raciocínio

O formato é o das linhas que já funcionam em `_memoria/prospeccao/aprendizados.md`:

```
- **<data> · <cliente> · "<a fala dele, entre aspas>".** <O que aconteceu, com fato e número.>
  <Por que ele estava certo, ou por que eu errei: o raciocínio, não só o resultado.>
  Muda: **<a regra, acionável, em uma frase>.** <Família: "mesma família de X (data)", se houver.>
```

Antes de gravar, fazer dois testes:
- **Teste do mês seguinte:** lendo isso daqui a um mês, num cliente diferente, eu sei o que fazer? Se a linha só faz
  sentido para quem viveu o caso, falta o porquê ou a regra.
- **Teste do gosto:** isso vale para a casa toda, ou foi gosto daquela vez? Na dúvida, grava no cliente e pergunta se
  sobe. O caderno de nicho (`_memoria/prospeccao/segmentos/`) é o meio-termo.

### 4. Achar o lugar (atualizar antes de criar)

Procurar a família antes de escrever (`Grep` por duas ou três palavras da lição nos destinos). Se já existe uma linha
parecida, estender essa linha ("mesma família de..."). Só criar uma linha nova se nenhuma servir. Memória duplicada é
dívida.

| A lição é sobre | Destino |
|---|---|
| Mensagem, conversa com lead, objeção, ritmo de resposta | `_memoria/prospeccao/aprendizados.md` ("Correções do Marcelo", a mais nova em cima) |
| Preço, qualificação, quando investir tempo num lead | `_memoria/comercial.md` |
| Design de site (o que denuncia, o que errou) | `_memoria/design/90-antipadroes.md`, com o porquê e a origem |
| Padrão de movimento ou de rolagem que funcionou | `_memoria/design/60-motion.md` |
| Estrutura de seção aprendida de referência | `_memoria/design/00-anatomia.md` |
| Carrossel e post | `_memoria/conteudo/90-antipadroes.md` |
| Como interpretar o Marcelo, comportamento, decisão | `CLAUDE.md` da raiz (regra curta) ou `_memoria/preferencias.md` (jeito de trabalhar) |
| Preferência pessoal dele que vale em qualquer projeto | memória automática (`~/.claude/projects/.../memory/` + linha no `MEMORY.md`) |
| Estado do cliente | topo do dossiê + Hounder (os dois têm que bater) |

### 5. Fechar o circuito: o que dá para conferir vira conferência

Regra só em prosa é esquecida. Se a lição pode ser checada, ela vira:
- **item de checklist** (`_memoria/design/99-checklist.md` ou `_memoria/prospeccao/99-checklist.md`);
- **script**, se a conferência é mecânica e já se repetiu (`.claude/skills/verificar/scripts/`). Script novo se testa
  contra um caso bom (tem que passar) e um caso ruim com defeitos plantados (tem que acusar todos). Só depois disso ele
  entra na skill. O detector local que dava "limpo" em arquivo ruim ensinou isso.

### 6. Reconciliar o estado do caso

- No **topo do dossiê** vai o estado atual, em três ou quatro linhas. O estado que mudou vira histórico com data, e não
  se apaga. Seção antiga que contradiz o topo ganha "(HISTÓRICO: ...)" no título.
- O **Hounder** precisa bater com o topo do dossiê: estágio, próxima ação com prazo e rascunho vigente.
- A informação nova da conversa vai para a ficha na hora, como manda o `CLAUDE.md`.

### 7. Relatar

```
O QUE DEU CERTO (repetir)
- <acerto> → gravado em <arquivo>

ERROS E O QUE MUDA
- <erro, com a fala dele> → <regra> → gravado em <arquivo>

VIROU FERRAMENTA
- <checklist ou script>, testado contra <caso bom e caso ruim>

ESTADO RECONCILIADO
- <dossiê e Hounder: o que mudou>

FICOU DE FORA (e por quê)
- <o que parecia lição mas era gosto pontual, ou já estava gravado>
```

## Parte 2: Varredura (a memória bate com o real?)

Rodar inteira quando o pedido for "varre o projeto". Depois de uma retrospectiva, rodar só nas superfícies que a
retrospectiva tocou.

**Superfícies:**
- contexto: `_memoria/empresa.md`, `preferencias.md`, `estrategia.md`, `comercial.md`, `identidade/`;
- conhecimento: `_memoria/design/`, `_memoria/conteudo/`, `_memoria/prospeccao/`, `_memoria/trafego/` e `integridade.md`;
- acervo: `referencias/README.md` e os teardowns;
- regras: o `CLAUDE.md` da raiz e os de cada cliente;
- configuração: `.impeccable/config.json` (cada exceção com motivo);
- memória automática: `MEMORY.md` e os arquivos dela, conferindo que cada arquivo ou ferramenta citada ainda existe.

**Passos:**
1. **Levantamento:** pastas em `clientes/`, skills em `.claude/skills/` e arquivos dos últimos 30 dias. A data de hoje
   é a régua para prazo vencido.
2. **Reconciliação:** clientes, serviços, ferramentas e foco batem com o workspace? O placar do detector tem um dono só
   (`_memoria/design/README.md`)?
3. **Contradição:** o mesmo fato dito de dois jeitos (versão, placar, status, decisão). Marcar os dois pontos e dizer
   qual vale, com evidência.
4. **Fato vencido:** data passada tratada como futura, status que já mudou, decisão revogada. Marcar como histórico com
   a data. Apagar só o que é comprovadamente errado.
5. **Promoção:** regra que nasceu num cliente e vale para todos sobe para a agência (tabela do passo 4 da Parte 1).
   Exemplo: "quando o pedido é 'acrescentar', não refazer a seção inteira" nasceu no Grão da Serra e vale para todo
   cliente.

## Erros da própria atualização (não repetir)

- **Registrar só o resultado.** "Site entregue em 15/10" não ensina nada. O que ensina é por que levou seis rodadas e o
  que encurtaria.
- **Esquecer a escolha silenciosa.** O Marcelo raramente diz "você errou". Ele manda outra coisa. Comparar sempre o
  rascunho da ficha com o que saiu no WhatsApp.
- **Esquecer o acerto.** Lição só de erro ensina a ter medo, não a repetir o que funcionou.
- **Transformar desabafo em decisão.** O que foi dito abalado se registra com as palavras dele e uma data de revisão.
- **Duplicar.** Antes de criar, procurar a família. A mesma regra em três arquivos vai divergir.
- **Regra longa demais.** Se a linha passa de cinco linhas sem um "Muda:", ninguém vai aplicar.
- **Ferramenta não testada.** Script que nunca acusou um defeito plantado dá falso "limpo".
- **Esquecer a outra sessão.** Às vezes duas sessões atendem o mesmo cliente ao mesmo tempo. Antes de gravar, ler o que ela
  já escreveu (`aprendizados.md`, topo do dossiê, notas do Hounder das últimas horas); antes de culpar a ferramenta por um
  resultado que mudou entre duas rodadas, ver se outra sessão mexeu no arquivo no meio (16/10: a lição do "vendedor nervoso"
  já estava gravada, e o "PDF quebrado" era trabalho dela em andamento).

## Exemplo real: Débora Reis (09 a 15/10/2026)

| Sinal | O que aconteceu | Virou |
|---|---|---|
| Frustração com o ritmo | "milhões de versões... passamos o dia inteiro e nem mandei nada" | Uma mensagem recomendada por vez (`aprendizados.md` e item no `prospeccao/99-checklist.md`) |
| Correção | "por que você errou?": duas sessões recomendaram passos diferentes | Ler o último rascunho da ficha antes de sugerir |
| Tempo | Ela se abriu em 09/10, e o link só saiu em 15/10. No meio, o amigo entregou outro site | "O esboço vai quando cumpre a promessa" (`aprendizados.md`) e "caixa zero limita o investimento" (`comercial.md`) |
| Decisão no calor | De madrugada, "encerrada": 67 fotos apagadas e o esboço fora do ar. Reaberto 11 horas depois | Regra "decisão no calor" (`CLAUDE.md` da raiz) |
| Pergunta de contexto | "É de qual contexto?" sobre o "Você não enjoa?" | "Frase do cliente tirada do contexto" (`90-antipadroes.md`) |
| Elogio | "Amei o site" depois do "Como trabalho" no modelo da Stanzza | Seção presa decide por largura e altura (`60-motion.md`) |
| A conferência final pegou | Miniaturas velhas e backup no ar | Dois itens no `design/99-checklist.md` e o script `conferencia-no-ar.cjs` |
| Escolha divergente | Recomendei "Quer que eu te mande o link?", e ele mandou os links direto, com despedida | "Promessa feita é licença dada" (`aprendizados.md`) |
| Escolha divergente (16/10) | Meu "a gente acha um jeito que fique bom pra todo mundo" virou "não precisa resolver isso tudo agora e nem se sentir constrangida" | Lead constrangido: nomear o sentimento e tirar o prazo (`aprendizados.md`) |
| Correção de design | "Deixe o sumário menorzinho na vertical" | "Sumário que vira faixa de cartões" (`90-antipadroes.md`) |
| Duas sessões | Anunciei como achado meu um "PDF dando 404" que era o meio do trabalho de outra sessão | Regra "duas sessões no mesmo cliente" (`CLAUDE.md` da raiz) |

## Regras

- **Não inventar fato.** Só registrar o que tem evidência no workspace, no Hounder ou nas conversas.
- Evidência ambígua: perguntar antes, nunca adicionar por conta.
- Não apagar contexto. Reconciliar, marcar como histórico com data, e só apagar o que é comprovadamente errado.
- O placar do detector tem um dono só (`_memoria/design/README.md`).
- Se nada precisar mudar: "Está tudo coerente, nada a reconciliar".
- Esta skill não roda o detector nem confere entrega. Isso é o `/verificar`, que agora tem o `conferencia-no-ar.cjs`.
