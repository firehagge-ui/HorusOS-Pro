# O que veio do benchmarking (29/09/2026)

> Auditoria pedida pelo Marcelo: comparar o sistema de prospecção da Hórus com repositórios de cold
> outreach, AI SDR e escrita anti-IA, e trazer só o que serve. Clones lidos inteiros no scratchpad da
> sessão; nada foi instalado de fora. Quase tudo é de **e-mail B2B em volume** (milhares de envios);
> a Hórus manda até 10 WhatsApps por dia pra dono de negócio local. O filtro foi: o raciocínio
> sobrevive a essa troca?

## O que o Marcelo mandou

| Repositório | Veredito | O que entrou | O que ficou de fora e por quê |
|---|---|---|---|
| **borghei/Claude-Skills** (cold-email, lead-researcher) | parcial | rotação de ângulo no follow-up, encerramento do fio, calibrar o score com quem respondeu | entregabilidade (SPF/DKIM, aquecer domínio), assunto de e-mail, cadência de 6 e-mails: não existe no WhatsApp |
| **alirezarezvani/claude-skills** (cold-email) | duplicado | "Gatilho → Leitura → Pedido" | é a mesma skill do borghei; não se instalam as duas |
| **growthenginenowoslawski/coldoutboundskills** | o mais útil | disciplina de slot (ideia presa ao catálogo), "a IA nunca escreve o exemplo pelo qual é avaliada", personalizar a oferta, "em branco é melhor que errado", loop de aprovação, taxa de resposta **positiva**, um experimento por variável | Clay, Smartlead, Prospeo, spintax, amostra de 500 por braço (volume que a casa nunca terá) |
| **BrianRWagner/ai-marketing-claude-code-skills** | parcial | nível de personalização honesto, data de ressurgir, autocrítica obrigatória, e duas que não estavam na lista: **voice-extractor** (virou `voz-marcelo.md`) e de-ai-ify | sequência de LinkedIn |
| **coreyhaines31/marketingskills** (cold-email, prospecting) | parcial | teste da remoção, "por que agora" (3,4× mais reunião que gancho de problema, em e-mail), citar as palavras do próprio lead | a parte de prospecção local já é o que a casa faz, e mais fundo |
| **Varnan-Tech/opendirectory** cold-email-verifier | **recusado** | nada | **adivinha** e-mails (nome@domínio) e testa qual existe: é o "presumir contato" que a integridade da casa proíbe |
| **Varnan-Tech/opendirectory** human-tone | recusado | nada que a humanizer não tenha | variação da humanizer pra marketing em inglês |
| **blader/humanizer** | base | a estrutura de `90-cara-de-ia.md`: vícios ordenados do mais forte ao mais fraco, "revisar nunca acrescenta fato", "a amostra do autor vence a lista" | os exemplos (inglês, prosa longa) |
| **hardikpandya/stop-slop** | parcial | a nota de 0 a 50 em cinco dimensões | o resto a humanizer cobre melhor |
| Artigo do Medium (10 repositórios) | pago | as três primeiras indicações já estavam na lista | o resto atrás do paywall |

## O que a pesquisa achou além da lista

| Repositório | O que entrou |
|---|---|
| **norahe0304-art/30x-outreach** | separar checagem mecânica de julgamento de IA (virou o `revisor.js`); congelar o critério do teste antes de mandar; aprovação do texto exato (a casa já tinha) |
| **reshma-baskaran/outbound-research-and-writing** | cada frase ligada a uma fonte (a casa já tinha a tabela de verificação); "a copy nunca narra a pesquisa"; parar e pedir o dado em vez de completar |
| **julienamorgan/signal-prospecting-kit** | **variação no lote** (nenhuma estrutura mais de 3 vezes), `learnings.md` que cresce a cada rodada (virou `aprendizados.md`) |
| zubair-trabzada/ai-sales-team-claude | nada novo: BANT/MEDDIC e playbook de objeção genérico; a casa tem o dela, calibrado |

## Por que nenhuma skill de fora foi instalada

Todas escrevem e-mail em inglês pra comprador B2B. Instalar em paralelo à doutrina criaria duas regras
pro mesmo assunto, e a de fora ganharia quando fosse acionada por palavra-chave ("cold email"). O que
servia foi traduzido pra dentro da doutrina da casa, com a origem anotada. A exceção prática é a
`/revisar-mensagem`, que é da casa e usa a humanizer como base.

## Dados de mercado que vieram junto (referência, não meta)

- E-mail frio B2B: resposta média de 4 a 6%; até 75 palavras rende mais; o 1º follow-up soma cerca de
  49% de respostas (coreyhaines, benchmarks.md, fontes Belkins, Lavender, Instantly).
- WhatsApp: um guia brasileiro (eesier.com.br) fala em 40 a 60% de resposta pra mensagem personalizada
  com pesquisa individual. Número de blog de fornecedor, sem método publicado: **não usar como meta**.
