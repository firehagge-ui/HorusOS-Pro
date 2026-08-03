═══════════════════════════════════════════════════════════════════════
                       LOG DE DECISÃO DO CONSELHO
═══════════════════════════════════════════════════════════════════════

## Metadados
- **ID:** CONSELHO-2026-07-26-1
- **Data:** 26/07/2026
- **Pergunta:** O que trava, apresentar ou publicar? O site da Aion aguenta reunião do jeito que está?
- **Modo:** `cliente:aion-psicologia`
- **Risco:** CRÍTICO (toca compliance de setor regulado + peça que sai na frente da cliente)
- **Cargos convocados:** Criação, Compliance (obrigatório, CFP), Operações
- **Valor em jogo:** contrato inexistente. 📊 [ESTIMATIVA] 3 a 4 dias já investidos
  (sessões de 23, 25 e 26/07 registradas em `clientes/aion-psicologia/CLAUDE.md`)

═══════════════════════════════════════════════════════════════════════
FASE 0: FUNDAMENTO CONSTITUCIONAL
═══════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────┐
│  📜 CONSTITUIÇÃO INVOCADA                                           │
│  ⚖️ EMPIRISMO · 📊 PARETO · 🔄 INVERSÃO · 💪 ANTIFRAGILIDADE        │
│  🔒 COMPLIANCE (cláusula pétrea, veto trava)                        │
│  HIERARQUIA: CONSTITUIÇÃO > PROTOCOLOS > INSTRUÇÃO DO CARGO         │
└─────────────────────────────────────────────────────────────────────┘

### Evidência coletada antes do debate

| Checagem | Resultado |
|---|---|
| Links e assets locais | 0 quebrados nas 4 páginas |
| Âncoras entre páginas | 11 apontadas, 11 existem |
| Marcações `.pend` | 31 em 4 arquivos, botão "Ocultar pendências" ativo (`site.js:41-59`) |
| `wa.me/557191535067` | **9 ocorrências ativas** em 3 páginas |
| Superlativo / promessa / depoimento | varredura de texto: nenhum |
| Peso da home | 📊 ~589 KB (WebP + CSS + JS + HTML), meta de 1 MB em `99-checklist.md:§3` |
| Tipografia real | EB Garamond + Karla + Jost, `letter-spacing:0` na serifa |

═══════════════════════════════════════════════════════════════════════
FASE 1: DEBATE ENTRE CARGOS
═══════════════════════════════════════════════════════════════════════

### Rodada 1: posições

---
**🎨 CRIAÇÃO**

> "O site está bom. O problema é que o botão principal dele está morto em nove
> lugares, e é justamente o botão que ela vai apertar."

**Posição:** apresentar esta semana, e não apresentar com CTA morto. Nenhuma linha
nova de conteúdo.

**Evidências:**
- ^[site/index.html:92] hero com `href="https://wa.me/557191535067"`, mais :426,
  :484, :503, e 5 ocorrências em contato e especialidades. O número tem 8 dígitos
  depois do DDD, celular brasileiro tem 9 ^[briefing.md:§1]
- ^[site/contato.html:122] "o caminho de contato que funciona é o WhatsApp". A
  página afirma que funciona exatamente o que está quebrado, duas linhas abaixo de
  ^[site/contato.html:61] "dígito faltando, confirmar"
- Estrutura confere com ^[_memoria/design/99-checklist.md:§1]: os oito blocos estão
  lá, na ordem
- ^[_memoria/design/99-checklist.md:§6] pede jeito de esconder pendência. Existe,
  com estado em sessionStorage ^[site/assets/site.js:46]

**Doutrina puxada:** ^[mentes/cole-gordon.md:Como isso aterrissa na Horus] "a
reunião de apresentação da Aion é uma call de venda. As 7 crenças dão o roteiro".
A crença 7 é CONFIANÇA. Botão principal que abre erro ataca a crença 7 em silêncio.

**Premissas:** 1) ela clica no WhatsApp na reunião ⚠️ [SEM FONTE], mas é a CTA
repetida 9 vezes. 2) EB Garamond não está na lista de serifas queimadas de
^[90-antipadroes.md:Tipografia], que cita Fraunces e Instrument Serif.

**Riscos da minha lente:** ⚠️ o `CLAUDE.md` do cliente diz Fraunces nos títulos
^[clientes/aion-psicologia/CLAUDE.md:Tipografia] e o CSS usa EB Garamond
^[site/assets/site.css:41]. A documentação está errada e alguém "restaura" a fonte
errada numa sessão nova.

**Confiança:** 85%
**O que eu não sei:** se render em 390px continua limpo. Verifiquei arquivo e link,
não abri navegador. ^[99-checklist.md:§4] pede essa checagem e ela não rodou.

---
**🔒 COMPLIANCE**

> "Para mostrar na tela dela, o site passa. Para existir num endereço público antes
> do sim, não passa. E ninguém aqui vai adivinhar o nono dígito."

**PARECER: LIBERADO COM AJUSTE** para apresentação privada. **VETADO** em dois pontos.

**Varredura de ^[cargos/compliance.md:Checklist]:**

| Item | Situação |
|---|---|
| Superlativo | ausente. A frase vedada do MundoPsicologos ^[briefing.md:§8] não foi reaproveitada |
| Promessa de cura, resultado ou prazo | ausente |
| Depoimento de paciente | ausente. Retirado em 25/07 |
| Antes/depois, inclusive por IA | ausente |
| Preço como chamariz | ausente |
| CRP por profissional | presente: ^[index.html:275] 03/939, :283 03/20812, :291 03/23949 |
| Autoteste ou quiz | evitado. ^[index.html:186] "Reconhecer-se em alguma dessas frases não é um diagnóstico" |
| LGPD no formulário | consentimento ^[contato.html:107-110]; o formulário avisa em vez de fingir envio ^[site.js:65-71] |
| Faixa de crise | presente ^[index.html:499-501] |

**VETO 1 — adivinhar o dígito do WhatsApp.** ^[CLAUDE.md:Integridade e verificação]
"dado que falta vira placeholder marcado, nunca texto plausível". Número plausível
em link ativo de clínica de psicologia manda gente procurando atendimento para o
WhatsApp de um estranho. É pior que link morto.
**Caminho alternativo:** pedir o número ao sócio.

**VETO 2 — URL pública antes do sim.** O `noindex` ^[index.html:8] impede busca,
não impede acesso. Nas 4 páginas há nome, foto e CRP de três psicólogos, endereço,
e rodapé com "Responsável técnica *a confirmar* · CRP-03 pessoa jurídica *a
confirmar*" ^[index.html:493]. Num endereço alcançável isso é peça publicitária de
clínica sem RT declarado, e quem responde ao CFP é ela.
**Caminho alternativo:** tela local ou compartilhamento de tela. Se precisar de
link, com senha e retirado no mesmo dia.

**AJUSTE:** a política de privacidade é minuta e se declara como tal
^[politica-privacidade.html:88]. Tem que ser dito em voz alta na reunião.

**Confiança:** 90%
**O que eu não sei:** se os três profissionais souberam que o material deles entrou
numa peça comercial.

---
**⚙️ OPERAÇÕES**

> "Não falta produção, falta dado que só a cliente tem. Continuar produzindo é a
> forma mais confortável de não apresentar."

**Posição:** apresentar agora, produção nova zero, e a cobrança de dado sai junto
com o convite da reunião.

**Evidências:**
- ^[_memoria/estrategia.md:Prioridade principal] "o próximo passo real é apresentar
  pra ela, não continuar construindo"
- ^[clientes/aion-psicologia/CLAUDE.md:Regras específicas] lista 8 itens que travam
  publicar. Nenhum é produção, todos são pergunta
- ^[briefing.md:§14] já separa "bloqueiam publicar" de "melhoram o site" e fecha com
  "nada disso impede montar a demo com placeholder marcado"
- Precedente: ^[_memoria/estrategia.md:Ambiguidade no site do Dr. Giovanni], quatro
  homes sem definição. É o que acontece com projeto que produz em vez de decidir

**Doutrina puxada:** ^[mentes/the-scalable-company.md:Como isso aterrissa na Horus]
"tire primeiro o que quebraria a operação se sumisse". Aqui é a informação da
cliente, e ela não está no repositório nem pode ser produzida.

**Confiança:** 80%
**O que eu não sei:** quem decide do lado dela.

---

### Checkpoint de convergência

```
[x] Mesma recomendação final       → apresentar agora, os três
[x] Mesmas premissas de base       → produzido, falta dado da cliente
[ ] Mesmos riscos identificados    → só Compliance viu o risco de URL pública
[x] Mesmo momento proposto         → esta semana
Convergência: 3 de 4 = 75% ≥ 70%
```

Convergiu no título, não convergiu um nível abaixo (o que fazer com os 9 links).
Rodada 2 apenas nesse ponto.

### Rodada 2: confronto sobre os 9 CTAs

**🎨 CRIAÇÃO responde ao COMPLIANCE:**

> "Aceito o veto. Mas 'não adivinhar' não pode virar 'deixar morto'. Se o número não
> chegar até a reunião, os 9 `href` apontam para `contato.html`, que existe, abre e
> carrega o telefone com a marcação ^[contato.html:61-62]. O botão continua levando
> a algum lugar honesto."

**Mantém a posição?** Parcialmente. Recuou de "consertar o número" para "neutralizar
o destino".

**🔒 COMPLIANCE responde à CRIAÇÃO:**

> "Botão escrito 'Agendar pelo WhatsApp' que abre uma página de contato não é
> problema meu, é problema teu. Não veda nada. Só registro: se o rótulo mente sobre
> o destino, quem perde crença é a Horus, e a crença é o teu departamento."

**Mantém a posição?** Sim.

**⚙️ OPERAÇÕES responde aos dois:**

> "Vocês dois estão resolvendo com CSS um problema que se resolve com uma mensagem.
> ^[briefing.md:Origem] a entrada é o sócio do Marcelo com uma das psicólogas.
> Perguntar 'qual o WhatsApp certo?' custa uma linha e ainda esquenta a reunião.
> Editar 9 `href` para desfazer depois é retrabalho que eu não autorizo sem ter
> tentado o barato primeiro."

**Mantém a posição?** Sim, reforçada.

### Síntese do debate

| Aspecto | Conteúdo |
|---|---|
| Consensos | Apresentar esta semana. Produção nova zero. O que trava publicar não trava apresentar, com uma exceção. Cobrança de dado junto do convite. |
| Divergência 1 (risco) | Compliance: o WhatsApp quebrado é o único item que atravessa a fronteira e trava apresentar, porque é a CTA que ela vai testar. Operações trata como item de checklist. **Resolvida:** Compliance vence por hierarquia de fontes, nível 2 sobre nível 3 ^[REGRAS-DE-CITACAO.md:Regra 4]. |
| Divergência 2 (prazo) | Criação quer editar os 9 `href` agora; Operações quer perguntar antes e editar uma vez. **Resolvida na ordem:** perguntar primeiro, editar só se o dado não chegar. |
| Tensão produtiva | Criação querendo o botão perfeito x Operações lembrando que a agência é uma pessoa. Mantém: é o que impede a quinta rodada de polimento. |
| Lacunas | Quem estará na sala e se a Maria Tutti participa (só o Marcelo tem). Se os 3 profissionais sabem do material (só a cliente tem). Render em 390px (a Horus tem, e não rodou). |

═══════════════════════════════════════════════════════════════════════
FASE 2: CRÍTICO METODOLÓGICO
═══════════════════════════════════════════════════════════════════════

> "Rastreabilidade alta, e boa parte com linha e não só seção, o que é acima do
> exigido. Mas vocês debateram uma reunião de venda sem convocar quem responde por
> reunião de venda. E um cargo afirmou que o site 'está bom' tendo checado arquivo,
> não tela."

**SCORE: 77/100 · ADEQUADO, gaps identificados**

| Critério | Bruto | Penal. | Final |
|---|---|---|---|
| Premissas declaradas | 17/20 | 0 | 17 |
| Evidências rastreáveis | 18/20 | 0 | 18 |
| Lógica consistente | 16/20 | -3 | 13 |
| Cenários alternativos | 15/20 | 0 | 15 |
| Conflitos resolvidos | 16/20 | -2 | 14 |

**Auditoria de fontes:** 28 afirmações factuais · 24 com fonte completa (86%) ·
3 marcadas como estimativa (11%) · 1 sem fonte, declarada (3%).
**Rastreabilidade: 86% · ✅ APROVADO**

**Penalidades, com a conta:**
- **-3** lógica, afirmação de impacto MÉDIO sem verificação: Criação disse "o site
  está bom" com base em integridade de arquivo e link. ^[99-checklist.md:§4] exige
  checagem em 390px e conferência de peso na tela. O peso foi calculado por soma de
  bytes, não medido em navegador
- **-2** conflitos: a divergência 2 foi resolvida por ordem de execução, não por
  mérito. Funciona, mas empurra a decisão para o futuro

**Gaps críticos:**
- **GAP 1 — Estrategista ausente.** ^[PROTOCOLO-DEBATE.md:Convocação padrão] manda
  Estrategista em pergunta sobre site, e a decisão define o roteiro de uma reunião
  de venda. A doutrina de venda entrou de carona pela Criação, via Cole Gordon.
  Ninguém era dono de "para que serve essa reunião". Impacto: médio
- **GAP 2 — a premissa central passou sem ser questionada.** "Apresentar destrava os
  dados" foi afirmada por Operações, repetida por todos e checada por ninguém. É o
  padrão de consenso rápido. Passado ao Advogado
- **GAP 3 — conflito de fontes não resolvido no debate.**
  ^[_memoria/estrategia.md:Achados da varredura] item 0 afirma que o WhatsApp entrou
  no site "sem o marcador a confirmar". O código mostra o marcador em
  ^[index.html:431] e ^[contato.html:61]. O arquivo de memória está errado

**Violações constitucionais:** nenhuma identificada.

**Verificação de compliance:** [x] convocado · [x] travas citadas, não presumidas ·
[x] nenhuma recomendação contraria os vetos.

**Recomendação:** ⚠️ APROVAR COM RESSALVAS (rodar a checagem de 390px antes da
reunião; corrigir o item 0 da estratégia).

═══════════════════════════════════════════════════════════════════════
FASE 3: ADVOGADO DO DIABO
═══════════════════════════════════════════════════════════════════════

> "Vocês três concordaram em apresentar e passaram vinte minutos discutindo um
> `href`. Ninguém perguntou para quem vocês vão apresentar."

**Premissa mais frágil:** "apresentar destrava os dados" (Operações, aceita por
todos). O caminho é sócio → uma das psicólogas → coordenação, e ^[briefing.md:§4]
marca a interlocutora com ❓: "pode ser a Giuliana, mas não está confirmado". Quem
decide é a sócia-gerente, Maria Tutti. **Pode ser uma reunião de venda com quem não
assina e não tem os dados.** Probabilidade de estar errada: 45%. Se errada, a
reunião gera "vou levar para a Tutti" e o ciclo recomeça sem ninguém na sala para
defender o site. Mitigação: perguntar quem vem antes de marcar; se a Tutti não vier,
o objetivo muda para instalar a crença 6 (APOIO) de ^[mentes/cole-gordon.md].

**Risco não discutido:** o site expõe nome, foto e CRP de três psicólogos numa peça
comercial que nenhum dos três autorizou. Prob. 25% · impacto operacional baixo,
**reputacional alto** (Salvador é mercado pequeno, clínica de 20 anos conversa com
colega). Ignorado porque Compliance checou a norma de publicidade e o LGPD do
formulário, não o consentimento de quem está retratado. Mitigação: frase de abertura
dizendo de onde saiu cada coisa e que nada está no ar.

**Cenário de arrependimento (26/07/2027):** "Apresentamos, ela gostou, pediu para
pensar, nunca mandou o WhatsApp certo. Passamos oito meses de webmaster não pago de
um site que nunca subiu. O Giovanni, único contrato formal, ficou o ano com quatro
homes na pasta. O erro foi tratar 'gostou' como sim." Sinais observáveis hoje: o
Giovanni saiu da linha de frente em 26/07; as pendências da Aion estão abertas desde
23/07 e nenhuma foi resolvida em três dias. Probabilidade: 35%.

**Alternativa ignorada:** não apresentar esta semana e usar o tempo para pôr o site
do Giovanni no ar, chegando na Aion com case real. É a alternativa que
^[advogado-do-diabo.md] diz ser a mais ignorada nesta agência.

| Critério | Apresentar a Aion agora | Fechar o Giovanni primeiro |
|---|---|---|
| Ganho máximo | contrato #1 e o case que falta | site no ar, cliente formal ativado |
| Perda máxima | 3 a 4 dias viram artefato órfão | a Aion esfria, o sócio perde a deixa |
| Tempo até validar | 1 reunião | indefinido, depende de 7 pendências do §12 |
| Esforço | meio dia | semanas |
| Risco de execução | baixo | alto, o gargalo é o mesmo: dado de cliente |

**Decisão sobre a alternativa:** descartada como substituta (troca uma trava de dado
por outra igual, com prazo pior); incorporada em paralelo apenas no que custa 30
minutos, decidir qual home do Giovanni vale e arquivar as outras.

**Simulação de 50% de falha:** ela gosta e não manda os dados nem assina.
Financeira: 3 a 4 dias 📊. Operacional: quatro páginas congeladas e a tentação de
"melhorar mais um pouco". Reputacional: baixo se ficou privado, **alto se houve link
público** (é o VETO 2). Estratégica: **RECUPERÁVEL**, o site é ~90% reaproveitável
como template de clínica de saúde e o processo já virou `99-checklist.md`.
Plano B: converter em template da Horus, com dados neutralizados. Tempo até
perceber: 7 dias sem os 4 dados. Ponto de não retorno: a primeira rodada de ajuste
de layout pedida sem contrato. **VEREDICTO: ⚠️ SOBREVIVE COM DANO.**

**Validação barata sugerida:** uma mensagem ao sócio, hoje, com três perguntas (quem
vem e se a Tutti participa; WhatsApp certo; sala e horário). Custo: uma mensagem.
Prazo: horas. Refuta a premissa antes de gastar a única reunião de primeira
impressão com o roteiro errado.

**VEREDICTO: ⚠️ PROSSEGUIR COM CAUTELA.** Condições: (1) confirmar quem estará na
sala antes de marcar; (2) nenhum link público antes do sim; (3) nenhum CTA morto na
tela na hora da reunião.

═══════════════════════════════════════════════════════════════════════
FASE 4: SÍNTESE FINAL
═══════════════════════════════════════════════════════════════════════

> "Os três cargos acertaram o rumo e o Advogado achou o buraco: vocês estavam
> prontos para apresentar sem saber para quem. A decisão não é 'apresentar ou
> esperar', é uma mensagem antes, e a reunião calibrada pela resposta dela."

### Decisão recomendada

**O site está pronto para ser apresentado, não para ser publicado. Apresentar esta
semana, em tela local, depois de uma mensagem de três perguntas ao sócio.**

O que trava publicar são 8 itens de dado. O que trava apresentar é 1: a CTA
principal morta em 9 lugares. Todo o resto marcado como pendência é feature na
reunião, não defeito: mostra onde a informação dela entra.

Ordem:
1. Mensagem ao sócio, hoje: quem estará na sala e se a Maria Tutti participa; qual o
   WhatsApp certo; sala atual e horário
2. Se o número chegar: trocar as 9 ocorrências de `wa.me` e conferir as 4 páginas
   (CSS e JS são compartilhados)
3. Se não chegar: os 9 `href` apontam para `contato.html`, e a frase de
   `contato.html:122` muda, porque hoje afirma que o WhatsApp funciona
4. Antes da reunião: checagem em 390px e teste do botão "Ocultar pendências"
5. Na reunião: abrir dizendo de onde veio o material e que nada está no ar.
   Apresentar com pendências ocultas, depois mostrá-las como lista de pedidos. Dizer
   em voz alta que a política de privacidade é minuta
6. Fechar com pergunta de compromisso, não com "qualquer coisa avisa"

### Modificações aplicadas

1. Mensagem de validação antes de marcar (Advogado, p.6)
2. Dois roteiros de reunião, fechamento ou instalação de APOIO (Advogado, p.1)
3. Frase de abertura sobre a origem do material (Advogado, p.2)
4. Proibição de link público, mesmo com `noindex` (Compliance, VETO 2)
5. Proibição de adivinhar o dígito (Compliance, VETO 1)
6. Corrigir os 9 `href` só depois de tentar o dado real (Operações)
7. Em paralelo, decidir a home do Giovanni e arquivar as outras (Advogado, p.4)
8. Corrigir o item 0 de `_memoria/estrategia.md` e a tipografia no `CLAUDE.md` do
   cliente (Crítico GAP 3, Criação)

### Análise de alternativas

Tabela na Fase 3. Decisão: apresentar a Aion agora. Não escolhida: parcialmente
incorporada (só a definição da home do Giovanni, 30 minutos, fecha risco
operacional aberto).

### Hedge (risco CRÍTICO, obrigatório)

```
🅰️ PLANO A: apresentar em tela, reunião de fechamento com a Tutti presente
   esforço: meio dia · retorno: contrato #1 e o case da agência · prazo: esta semana

🅱️ PLANO B: converter o site em template de clínica de saúde da Horus, com dados
   neutralizados
   esforço: 1 dia · retorno: ativo permanente · prazo: quando acionar

🔀 GATILHO DE TROCA:
   • sócio responde que a Tutti não participa → roteiro muda para instalar APOIO
   • 7 dias após a reunião sem os 4 dados → alerta 1
   • 14 dias sem os 4 dados, ou pedido de ajuste de layout sem contrato → Plano B

PONTO DE NÃO RETORNO: a primeira rodada de ajuste visual pedida sem contrato.
CUSTO DE MANTER O PLANO B VIVO: zero, é o mesmo arquivo.
```

### Confiança: 77%

| Dimensão | Conf. | Justificativa |
|---|---|---|
| Qualidade do dado | 85% | site inspecionado linha a linha, links e âncoras verificados; nenhum dado da cliente confirmado |
| Capacidade de execução | 90% | a ação é uma mensagem e uma reunião |
| Aderência ao cliente | 60% | não se sabe quem decide na sala. Fator mais fraco |
| Segurança de compliance | 75% | peça limpa na varredura, mas RT e CRP da PJ em branco e política em minuta |
| Mitigação de risco | 75% | dois vetos com caminho alternativo, Plano B a custo zero |

**O que limita a confiança:** não saber quem estará na reunião. Resolve com uma
mensagem, e por isso é o passo 1. **STATUS: APROVADO (≥70%).**

### Riscos aceitos

| Risco | Prob. | Mitigação |
|---|---|---|
| Apresentar para quem não decide | 45% | mensagem de validação antes de marcar |
| Elogio sem dado e sem sim | 35% | pergunta de compromisso no fim; gatilho de 7 e 14 dias |
| Profissional reage ao próprio CRP na peça | 25% | frase de abertura sobre origem do material |
| Link público antes do sim | baixa | VETO 2, sem hospedagem, apresentação em tela |
| Render quebrado em 390px | desconhecida | checagem obrigatória antes da reunião |
| Alguém "restaurar" Fraunces numa sessão futura | média | corrigir a tipografia no `CLAUDE.md` do cliente |

### Próximos passos

1. **Validar (hoje):** mensagem ao sócio com as três perguntas · responsável:
   Marcelo · entregável: as três respostas · segue ou para: se a Tutti não vier,
   segue com roteiro de APOIO
2. **Preparar (antes da reunião):** 9 `href` resolvidos; frase de `contato.html:122`
   ajustada se o WhatsApp continuar pendente; checagem em 390px nas 4 páginas ·
   responsável: Claude, sob pedido do Marcelo · entregável: `/verificar` com evidência
3. **Apresentar (esta semana):** tela local, sem link público. Sair com WhatsApp,
   sala, horário e nome de quem aprova texto · responsável: Marcelo
4. **Paralela (30 min):** definir a home do Dr. Giovanni e arquivar as outras três ·
   responsável: Marcelo (é gosto dele, não do Conselho)

### Critérios de reversão

- **ABORTAR SE:** a cliente pedir para publicar antes de fornecer CRP da pessoa
  jurídica e responsável técnica. Aí o veto de Compliance trava, e não é negociável
- **PIVOTAR PARA PLANO B SE:** 14 dias após a reunião sem os 4 dados, ou pedido de
  novo ajuste visual sem contrato
- **REVISAR EM:** 02/08/2026 · responsável: Marcelo

═══════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────┐
│  CONTEXTO UTILIZADO                                                 │
│  Modo: cliente:aion-psicologia                                      │
│  Agência: SIM (6 arquivos: empresa, estrategia, preferencias,       │
│           design/99-checklist, design/90-antipadroes, CLAUDE.md)    │
│  Cliente: SIM (8 arquivos: briefing, CLAUDE.md, 4 HTML, CSS, JS)   │
│  Referências: NÃO (teardowns não consultados nesta sessão)          │
│  Dado real: SIM (código do site verificado linha a linha;           │
│             nenhum dado confirmado pela cliente)                    │
└─────────────────────────────────────────────────────────────────────┘

## O que aconteceu depois

- **Data:** 28/07/2026, dois dias depois da sessão.

- **Resultado:** o Marcelo respondeu as três perguntas da FASE 1 e a decisão andou.
  1. **WhatsApp: o número está correto.** Não era dígito faltando. As marcações
     foram removidas das nove ocorrências
  2. **A reunião é com a Maria Tutti**, ou seja, com quem assina
  3. **A clínica atende presencial e online.** Aplicado nas páginas; ficou marcado
     só quais dos 6 serviços funcionam online
  4. Ele decidiu **subir pelo Vercel**. O veto 2 foi mantido e virou condição:
     Deployment Protection ligada até o "sim" e até CRP da PJ e responsável técnica
     estarem preenchidos
  5. Rodou junto uma **auditoria de design** com 13 achados, 12 aplicados, com
     backup em `Backup 1/`. Detector da casa saiu de 57 antipadrões para 10, com
     zero falha de acessibilidade

- **Quem tinha razão:**

  **O Advogado do Diabo, na premissa frágil.** Ele deu 45% de chance de a
  apresentação ser para quem não decide e mandou perguntar antes de marcar. A
  pergunta foi feita e a resposta veio favorável, mas o valor não está em ter
  acertado o resultado: está em ter transformado uma aposta silenciosa numa
  pergunta de uma linha. Custo: uma mensagem.

  **O Compliance, no veto 2.** O plano de subir no Vercel apareceu depois da sessão,
  e o veto já estava escrito. Sem ele, o site subiria em URL pública com
  "responsável técnica a confirmar" no rodapé.

  **Ninguém, no achado 0.** A sessão inteira tratou o WhatsApp como o único item
  que travava apresentar, e o número estava certo desde o começo. O erro nasceu em
  `_memoria/estrategia.md`, que registrou uma inferência ("celular brasileiro tem 9
  dígitos") como se fosse achado verificado, e três cargos citaram esse arquivo sem
  desconfiar. **Lição:** hierarquia de fontes (`REGRAS-DE-CITACAO.md`, Regra 4)
  existe justamente para isso, e a memória da agência é nível 3. Quando um item de
  nível 3 fala sobre dado do cliente, ele é hipótese até o cliente confirmar. O
  Crítico chegou perto (GAP 3 apontou o conflito entre o arquivo e o código), mas
  concluiu que o arquivo estava errado só no detalhe do marcador, não no número.
