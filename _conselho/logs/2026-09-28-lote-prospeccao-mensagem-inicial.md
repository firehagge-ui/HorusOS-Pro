═══════════════════════════════════════════════════════════════════════
                       LOG DE DECISÃO DO CONSELHO
═══════════════════════════════════════════════════════════════════════

## Metadados
- **ID:** CONSELHO-2026-09-28-2
- **Data:** 28/09/2026
- **Pergunta (Marcelo, sem reescrever):** "Quero que para todos esses clientes que citei você faça essa análise aprofundada e puxe o conselho para todos com foco na mensagem de abordagem inicial e prospecção." Leads: Bioclin, Cintya Gualberto, Cavalcante, Harmony, LevSaúde, Talina, Café Cardamomo, Prático Marcenaria.
- **Formato:** uma sessão para o lote, com decisão por lead. Rodar sete sessões separadas repetiria a mesma constituição, os mesmos cargos e as mesmas regras de mensagem sete vezes.
- **Modo:** `agencia` + fichas do Hounder + pesquisa feita **antes** da sessão, em 28/09 (Maps pelo Playwright, Linktree e página de WhatsApp, Doctoralia, casamentos.com.br, CNPJ, Biblioteca da Meta). O Instagram ficou de fora: a extensão do Chrome não conectou e a sessão salva do Hounder não está logada. Tudo o que depende do Instagram virou conferência do Marcelo.
- **Risco:** ALTO (mensagem sai para o mundo). Leads regulados: Bioclin (conselho a confirmar), Cavalcante e Harmony (CFO), LevSaúde (COFFITO).
- **Cargos:** Estrategista, Mídia, Operações, Compliance (obrigatório).
- **Café Cardamomo não entrou no debate:** o Marcelo decidiu descartar ("já possuem link com cardápio, não sei se seria uma prioridade pra eles"). É decisão de prioridade do dono, não pergunta para o Conselho. Registrado como perdido no CRM.

═══════════════════════════════════════════════════════════════════════
FASE 0: FUNDAMENTO CONSTITUCIONAL
═══════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────┐
│  📜 CONSTITUIÇÃO INVOCADA                                           │
│  ⚖️ EMPIRISMO · 📊 PARETO · 🔄 INVERSÃO · 💪 ANTIFRAGILIDADE        │
│  🔒 COMPLIANCE (cláusula pétrea, veto trava)                        │
│  HIERARQUIA: CONSTITUIÇÃO > PROTOCOLOS > INSTRUÇÃO DO CARGO         │
└─────────────────────────────────────────────────────────────────────┘

### Fatos verificados antes da sessão (28/09/2026)

| Lead | Fato | Fonte e como |
|---|---|---|
| Harmony | Maps: "Harmony Odontologia" **5,0 (118)**, site = Instagram pessoal @draleticiamnetto, tel (75) 99131-8319 | Maps em janela visível, 28/09 |
| Harmony | Existe outra "HARMONY ODONTOLOGIA ESPECIALIZADA", 4,3 (12), Mangabeira, (75) 98170-9981. Na busca "Harmony Odontologia Feira de Santana", as duas aparecem, e antes delas um resultado **patrocinado** (Luzatto Odontologia, 5,0 (145)) | Maps, 28/09. ⚠️ Local da busca não era Feira: vale só como pista (Regra 3) |
| Harmony | Nenhuma ficha com 1 avaliação foi encontrada. A "Leticia Netto Odontologia" 5,0 (2) tem telefone (54), provável homônima de outro estado | Maps, 28/09 |
| Harmony | Credenciada SulAmérica Odonto; CRO 17164 na lista da rede (não conferido no CFO) | Scribd, lista SulAmérica |
| Harmony | Avaliações citam "recepção", "as meninas", "excelentes profissionais para diversos tratamentos"; o dono responde avaliação (um mês atrás) | Maps, 5 avaliações mais recentes lidas |
| Harmony | Instagram da clínica: @cliharmony "ORTODONTIA E COROAS", 3.237 seguidores / 222 posts. Da dentista: "Facetas e Lentes", 7.021 / 769. Sem anúncio na Meta com o nome | Embed do Instagram + Biblioteca da Meta, 28/09 |
| LevSaúde | Maps: **5,0 (48)**, a ficha EXISTE, site = Instagram | Maps, 28/09 |
| LevSaúde | Linktree: **5 de 7 botões** (Fisioterapia, Massagem terapêutica, Ventosaterapia, Seitai, Acupuntura) levam a `wa.me/message/NIVUZA73QZDNP1`, que abre **"Esse link expirou"**. Pilates vai para outro número, (75) 99126-3205, e abre. Localização abre | Scrape da Linktree + teste de cada link, 28/09 |
| LevSaúde | Doctoralia: 9 opiniões, Dra. Liliane Santana responde desde 2017; cita o site levsaude.com.br, que **não resolve DNS** | Scrape + curl, 28/09 |
| Talina | Maps: 4,8 (97), botão de site = link de WhatsApp que **funciona** ("Talina Eventos · Olá! Gostaria de conhecer mais sobre o espaço de eventos!") | Teste do link, 28/09 |
| Talina | CNPJ 47.434.967/0001-45, LTDA de 2022, 3 sócias (Edmea Silva Santos e Jessica Silva Santos Fonseca desde 03/2023; Vanessa Silva Pires de Almeida desde 08/2025) | Econodata |
| Talina | Página no casamentos.com.br com fotos, 10 a 350 convidados, "a partir de R$1.500", zero opiniões ali. Sem anúncio na Meta | Scrape + Biblioteca da Meta, 28/09 |
| Cintya | Anúncios ativos: combo depilação 4 áreas (desde 15/09, com preço), depilação a laser (14/09), criolipólise e ultrassom (**25/09**), todos para o WhatsApp | Biblioteca da Meta, 28/09 |
| Cintya | ⚠️ Saiu do celular do Marcelo, hoje às 17:19, uma mensagem que não é texto (tipo "outro") para o WhatsApp dela | Tabela `whatsapp_mensagens` |
| Cavalcante | Página da Dra. Ághata (Canva, inforempresa.com.br): UFBA, professora universitária, implante e lente. O texto fala em "resultados naturais, seguros e duradouros", "sorriso perfeito", "superem suas expectativas" | Scrape, 28/09 |
| Prático | Saiu em 20/09 às 13:32 algo que não é texto. Conteúdo: `[FALTA]` | Tabela `whatsapp_mensagens` + dossiê v2 |
| Bioclin | Passo 2 trocado às 18:34 pelo chat do Farejador, a pedido do Marcelo: o reel é ela **pedindo pra paciente avisar com antecedência** | Tabela `chat_threads` |

═══════════════════════════════════════════════════════════════════════
FASE 1: DEBATE ENTRE CARGOS
═══════════════════════════════════════════════════════════════════════

### Rodada 1: posições

---
**ESTRATEGISTA**

> "O Marcelo acertou três perguntas seguidas. Na Cintya, a pergunta final não tinha nada a ver com a ficha. Na Talina, o Instagram já serve mesmo. E a Harmony é a melhor oportunidade da lista. Mas a Harmony é boa pelo motivo errado: ela não tem 1 avaliação, tem 118. É a maior reputação do lote, representada no Google pelo Instagram pessoal de uma dentista só."

**Posição por lead:**
- **Harmony: prioridade 1.** Clínica com equipe (recepção, vários tratamentos, convênio SulAmérica), 5,0 com 118, sem site, sem anúncio, e o botão do Google apontando para o perfil "Facetas e Lentes" da titular, enquanto o da clínica se vende como "Ortodontia e Coroas". Fase 1 = site da clínica + Google. A intuição do Marcelo de "SEO, site e muito mais" se sustenta. O "muito mais" (anúncio de implante, régua de retorno de convênio) fica para depois da Fase 1.
- **LevSaúde: prioridade 2.** O achado é o melhor do lote: fato objetivo, conferível em cinco segundos, e culpa do WhatsApp, não do dono ("o link expirou"). Seis serviços que pedem explicação (seitai, ventosa, acupuntura) e nenhuma página.
- **Cavalcante: prioridade 3.** Não é "sem site". É a marca dividida: a clínica no Google e a Dra. Ághata no Instagram, no anúncio e na página. Ela já investe e já tem agenda on-line (Clinicorp), então confirmação não é a dor.
- **Cintya: mudar a tese.** Ela está **aumentando** o anúncio (três criativos novos em duas semanas), e o gargalo de quem anuncia pro WhatsApp é o lead que pergunta o valor e some. Isso casa com o que ela está fazendo agora.
- **Bioclin:** manter a entrada da agenda, com o ajuste da "confirmação que já existe".
- **Talina: segurar.** O caminho Google → WhatsApp funciona. Mandar mensagem sem falha verificável é repetir a Casa Verona.
- **Prático: segurar** até saber o que saiu em 20/09.

**Evidências:** ^[_conhecimento/network/abordagem-e-prospeccao.md:§9 Regra 5] "A oferta sai da maior falha verificável" · ^[abordagem-e-prospeccao.md:§10 lições de 24/09] "'Vive só no Instagram' soa como crítica" · ^[_conselho/cargos/estrategista.md:Como pensa] "Site novo não resolve clínica que não responde WhatsApp"
**Doutrina:** ^[mentes/alex-hormozi.md:Modelos mentais] "Vender a viagem, não o avião"
**Confiança:** 72%

---
**MÍDIA**

> "Eu cuido da pergunta da Cintya. A mensagem antiga dizia que quem cai no Instagram 'se perde no feed' e 'marca em outro lugar'. Isso é hipótese vestida de fato, e o Marcelo farejou certo: Instagram de clínica de estética é vitrine, a pessoa não se perde ali. O buraco dela está depois do clique no anúncio."

**Posição:**
- **Cintya:** o fato é o anúncio (Biblioteca da Meta, que ela confere). A dor provável é o follow-up, e ela entra com "imagino". ^[mentes/jeremy-haynes.md:Filosofias] "O dinheiro está no follow-up" · ^[mentes/full-sales-system.md:Calibração BR] "WhatsApp acima de email". 🌐 Números de recuperação do Haynes não entram na mensagem.
- **Harmony:** o homônimo e o anúncio da concorrente em cima do nome dela são os achados mais fortes, e também os mais frágeis. Os dois dependem do lugar de onde se pesquisa. ^[abordagem-e-prospeccao.md:§9 Regra 3] "Posição na busca só com a busca feita pelo Marcelo no dia". Sem o print do celular dele, não entram.
- **LevSaúde:** link expirado é o tipo de fato perfeito: não depende de busca nem de opinião.
- **Cavalcante:** ela já anuncia (desde 26/09) e já tem agenda on-line. Minha pergunta obrigatória ("o destino do clique está pronto?") dá sim no WhatsApp. O furo é quem pesquisa no Google depois de ver o anúncio.
**Confiança:** 68%

---
**OPERAÇÕES**

> "Quem manda tudo isso é o Marcelo, no celular dele, e ele já tem dois envios não identificados na conta: Prático em 20/09 e Cintya hoje. Mandar mensagem nova por cima de uma que a gente não sabe o que foi é parecer duas pessoas falando."

**Posição:** trava operacional em Cintya e Prático até o Marcelo dizer o que saiu. Máximo de 10 por dia pela regra do Farejador ^[CLAUDE.md:Hounder] "no máximo 10 por dia, 4 a 7 min entre um e outro". O lote pronto (Harmony, LevSaúde, Cavalcante, Bioclin, Alessandra, Cintya) cabe num dia só.
**Evidência:** ^[saidas/prospeccao-2026-09-20/dossie-prospeccao-v2.html:Prático] "Isso precisa ser resolvido antes de qualquer abordagem, para não parecer que duas pessoas diferentes estão falando"
**Confiança:** 80%

---
**COMPLIANCE**

> "Quatro leads regulados. Na mensagem inicial, ninguém passa do limite. O problema está no que eles já publicaram."

**PARECER: LIBERADO COM AJUSTE**
1. **Cavalcante (CFO):** a página dela tem promessa ("resultados... duradouros", "sorriso perfeito", "superem suas expectativas"). **VETADO usar isso na abordagem** (é crítica e acusa uma professora de dentista). Na reunião, só se ela trouxer. Caminho: tudo o que a Horus fizer para ela sai sem promessa, com CRO visível. ^[_conselho/cargos/compliance.md:Odonto/CFO] "Vedado: promessa ou garantia de resultado... superlativo"
2. **Harmony (CFO):** a página que a gente oferece não reproduz depoimento sem autorização. O selo de nota do Google e o botão "ver avaliações" podem. CRO 17164 confere no CFO antes de ir para qualquer peça.
3. **LevSaúde (COFFITO):** página de serviço sem promessa. Depoimento só com termo assinado. ^[compliance.md:Fisioterapia/COFFITO]
4. **Bioclin:** a norma do conselho continua a confirmar (log 2026-09-28-1). A mensagem não cita procedimento em nada que vá para a paciente.
5. **Cintya:** esteticista, sem conselho profissional (ficha `regulado: false`). O retorno ao lead vale só para quem chamou a clínica. Nada de disparo frio para lista.
**Confiança:** 75%

### Checkpoint de convergência
```
[x] Mesma recomendação final   (Harmony 1, LevSaúde 2, segurar Talina e Prático)
[ ] Mesmas premissas            Mídia não aceita o homônimo sem busca do dia; Estrategista queria usar
[x] Mesmos riscos               (envios não identificados, fato de busca)
[x] Mesmo momento               (agora para os prontos, depois para os travados)
```
3 de 4 → iria direto à síntese. ⚠️ Consenso rápido: o Crítico pediu uma rodada curta sobre o ponto aberto.

### Rodada 2 (só a divergência)

**ESTRATEGISTA** responde à **MÍDIA**:
> "O homônimo é o fato que faz a Dra. Letícia parar. 'Tem outra Harmony com 4,3 aparecendo junto' mexe com quem tem 118 avaliações."

**MÍDIA**:
> "Mexe, e é por isso que não pode estar errado. Se no celular dela a outra não aparece, a mensagem morre na primeira frase. Duas versões: a que usa o homônimo, se o print do Marcelo mostrar as duas; e a que usa só o botão do Instagram pessoal, que ela confere clicando na própria ficha."

**Mantém?** Estrategista: parcialmente, aceita as duas versões com o gatilho do print. **Resolvido.**

### Síntese do debate

| Aspecto | Conteúdo |
|---|---|
| Consensos | Harmony primeiro, LevSaúde segundo. Cintya muda de tese (anúncio → follow-up). Talina e Prático seguram. Nada de promessa, nada de crítica ao que o lead publicou |
| Divergência resolvida | Homônimo da Harmony: entra só com o print da busca do Marcelo no celular |
| Tensão produtiva | Estrategista quer o fato mais forte, Mídia quer o mais seguro. Fica: é o que impede mensagem com fato que o dono desmente |
| Lacunas | Instagram de todos (posts, destaques, bio); o que saiu para Cintya (hoje) e Prático (20/09); decisora da LevSaúde; conselho da Bioclin; CRO da Harmony no CFO |

═══════════════════════════════════════════════════════════════════════
FASE 2: CRÍTICO METODOLÓGICO
═══════════════════════════════════════════════════════════════════════

> "Pela primeira vez neste funil, a pesquisa veio antes da sessão e não no meio dela. Isso conta. O que me incomoda: três conclusões se apoiam em amostra pequena."

**SCORE: 78/100 · ADEQUADO**

| Critério | Score | Observação |
|---|---|---|
| Premissas | 16/20 | "Cintya perde lead no follow-up" está marcada como hipótese. Ok |
| Evidências | 17/20 | ~86% com fonte e data. Harmony: "avaliações falam da equipe" veio de 5 de 118. A frase tem de dizer "as que li" |
| Lógica | 16/20 | Consistente. Talina e Prático seguram pelo mesmo critério (sem falha verificável) |
| Cenários | 14/20 | Financeiro fora (sem ticket). Alternativa só veio do Advogado |
| Conflitos | 15/20 | Homônimo resolvido com gatilho objetivo |

**Rastreabilidade:** 86% · **Gaps:** (1) amostra de 5 avaliações usada como tendência → corrigido para "as que li"; (2) Instagram de nenhum lead foi lido nesta sessão → conferência obrigatória antes do envio de Prático e Talina; (3) Cintya e Prático com envio não identificado.
**Violações constitucionais:** nenhuma. **Compliance:** convocado, travas citadas.
**Recomendação:** ⚠️ APROVAR COM RESSALVAS

═══════════════════════════════════════════════════════════════════════
FASE 3: ADVOGADO DO DIABO
═══════════════════════════════════════════════════════════════════════

> "Vocês vão mandar seis mensagens no mesmo dia, para seis clínicas de saúde e estética, quatro delas em Feira de Santana, duas no mesmo bairro de Salvador."

1. **Premissa mais frágil:** "o link expirado dói na LevSaúde". Ela conserta em um minuto, agradece e acabou. **Prob. 60%** 📊 [ESTIMATIVA], porque o conserto é trivial e está nomeado na mensagem. Mitigação: aceitar o "obrigado" (§10). O valor está na página, e ela só vem se perguntar.
2. **Risco não discutido:** Harmony e Cavalcante ficam as duas em **Santa Mônica, Feira de Santana**, e as duas fazem implante e lente. Bioclin e Cintya ficam as duas no **Caminho das Árvores** e fazem criolipólise. Quatro concorrentes diretos em duas duplas. **Prob. de virar problema:** média ⚠️ [SEM FONTE]. Mitigação: a decisão de exclusividade (log 28/09-1) vale para as duas duplas e precisa sair **antes do primeiro fechamento**, não do segundo.
3. **Arrependimento em 12 meses:** "Mandamos o homônimo sem print, a Dra. Letícia pesquisou e não viu a outra Harmony, e a Horus virou 'aquele que inventou coisa'. Feira é pequena." **Prob. 15%** com a trava do print.
4. **Alternativa ignorada:** **ir a Feira de Santana num dia e visitar Harmony, Cavalcante e LevSaúde pessoalmente.** Presencial é o canal de maior conversão ^[_conhecimento/network/taxas-de-conversao.md:§4], são três leads na mesma cidade, dois no mesmo bairro, e o ticket de odonto paga o deslocamento.
5. **50% de falha:** metade não responde. Custo: mensagens e horas de pesquisa já gastas. Recuperável. **SOBREVIVE.**
6. **Validação barata:** (a) o Marcelo pesquisa "Harmony Odontologia Feira de Santana" no celular e manda o print; (b) clica nos botões da Linktree da LevSaúde; (c) diz o que saiu para a Cintya e a Prático.

**Veredicto:** ⚠️ PROSSEGUIR COM CAUTELA

═══════════════════════════════════════════════════════════════════════
FASE 4: SÍNTESE FINAL
═══════════════════════════════════════════════════════════════════════

> "Integro. O lote se divide em três: prontos para enviar, prontos com condição e segurados."

### Decisão por lead

| # | Lead | Decisão | Gancho (fato) | Oferta da Fase 1 | Condição antes de enviar |
|---|---|---|---|---|---|
| 1 | **Harmony** | ENVIAR (versão A ou B) | Botão de site → Instagram pessoal; homônimo só com print | Site da clínica + Google | Print da busca no celular decide A (com homônimo) ou B (sem) |
| 2 | **LevSaúde** | ENVIAR | 5 botões da Linktree com "Esse link expirou" | Página com cada serviço + botões certos + ficha do Google | Clicar nos botões no dia |
| 3 | **Cavalcante** | ENVIAR | Ficha 4,9 (67) com agenda on-line e sem site; a página dela só aparece no Instagram pessoal | Página de implante e lente ligada ao Google e ao anúncio | Conferir se o anúncio ainda está ativo |
| 4 | **Bioclin** | ENVIAR depois das checagens de 30/09 | Reel pedindo pra avisar com antecedência | Lista de espera e resposta obrigatória na véspera | As três checagens do log 28/09-1 |
| 5 | **Cintya** | TROCAR a tese; ENVIAR só depois de explicar a mensagem de hoje às 17:19 | Anúncios novos (criolipólise e ultrassom desde 25/09) | Retorno automático a quem chamou pelo anúncio e não marcou | O Marcelo diz o que mandou hoje |
| 6 | **Talina** | SEGURAR | Nenhuma falha verificável: o caminho Google → WhatsApp funciona | — | Ler o Instagram (comentários, stories de datas). Revisar em 12/10 |
| 7 | **Prático** | SEGURAR | Teses anteriores caíram (aparece em 1º no Google; tem portfólio no Instagram) | Página por projeto, para cliente e arquiteto (hipótese) | O Marcelo diz o que saiu em 20/09 e confere os destaques do Instagram |
| — | **Cardamomo** | PERDIDO (decisão do Marcelo) | — | — | — |

### Análise de alternativas

```
┌────────────────────┬────────────────────────┬──────────────────────────┐
│ CRITÉRIO           │ PRINCIPAL: WhatsApp    │ ALT: visita em Feira     │
│                    │ para o lote pronto     │ (Harmony, Cavalcante,    │
│                    │                        │  LevSaúde num dia)       │
├────────────────────┼────────────────────────┼──────────────────────────┤
│ Esforço (dias)     │ ~0,5                   │ 1 (viagem ~100 km)       │
│ Custo direto       │ 0                      │ deslocamento [FALTA: R$] │
│ Conversão esperada │ menor (texto frio)     │ maior (presencial)       │
│ Tempo p/ resultado │ 1 a 3 dias             │ data da viagem           │
│ Risco de execução  │ baixo                  │ médio (ninguém disponível│
│                    │                        │  sem hora marcada)       │
│ Reversibilidade    │ alta                   │ alta                     │
│ Risco compliance   │ nulo                   │ nulo                     │
└────────────────────┴────────────────────────┴──────────────────────────┘
DECISÃO: PRINCIPAL agora, com a ALT como Plano B de conversão.
DESTINO DA ALT: paralela. Quem responder em Feira ganha a proposta de ir pessoalmente
("passo aí pra te mostrar"), em vez de ligação. Se ninguém responder em 5 dias úteis,
ir a Feira num dia só, com os três na mesma rota.
```

### Confiança: 70% · APROVADO (com as condições de cada linha)

| Dimensão | Conf. | Justificativa |
|---|---|---|
| Qualidade do dado | 75% | Fatos centrais verificados hoje. Instagram não lido |
| Capacidade de execução | 80% | Seis mensagens cabem num dia |
| Aderência ao lead | 65% | LevSaúde e Harmony fortes; Cintya e Bioclin dependem de hipótese |
| Compliance | 75% | Norma da Bioclin ainda aberta |
| Mitigação de risco | 60% | As duplas concorrentes dependem de uma decisão do Marcelo |

### Próximos passos
1. Print da busca "Harmony Odontologia Feira de Santana" no celular · **Marcelo** · antes de aprovar a Harmony
2. Dizer o que saiu para a Cintya (28/09, 17:19) e para a Prático (20/09) · **Marcelo** · 30/09
3. Decidir a exclusividade das duplas (Harmony × Cavalcante em Santa Mônica; Bioclin × Cintya no Caminho das Árvores) · **Marcelo** · antes do primeiro fechamento
4. Ler o Instagram de Talina e Prático quando o Chrome conectar · **Claude** · assim que conectar
5. Confirmar o CRO 17164 no CFO · **Claude** · antes de qualquer peça da Harmony

### Critérios de reversão
- **ABORTAR a versão A da Harmony SE** o print não mostrar as duas Harmony.
- **PIVOTAR PARA A VISITA EM FEIRA SE** Harmony, Cavalcante e LevSaúde não responderem em 5 dias úteis depois do envio.
- **REVISAR EM:** 12/10/2026 (Talina e Prático) · responsável: Marcelo.

═══════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────┐
│  CONTEXTO UTILIZADO                                                 │
│  Modo: agencia · Agência: SIM (8) · Cliente: NÃO (fichas do Hounder)│
│  Referências: NÃO · Dado real: SIM (Maps, Linktree, WhatsApp,       │
│  Doctoralia, CNPJ, casamentos.com.br, Biblioteca da Meta, 28/09)    │
└─────────────────────────────────────────────────────────────────────┘

## Adendo: Instagram lido depois da sessão (28/09, login do Marcelo na sessão do Hounder)

Não reabre o debate. Só confirma ou ajusta as linhas da tabela de decisão.

| Lead | O que o perfil mostra | Efeito na decisão |
|---|---|---|
| Harmony | @cliharmony: "Prótese, Implantes, Estética, Ortodontia"; destaques Nossa equipe, Ortodôntica, Estética, Odontopediatra, Implantes; telefones (75) 3030-1077 e 99131-8319. @draleticiamnetto: "Facetas e Lentes", "Blog pessoal" | **Reforça.** O Google manda para o perfil de facetas e lentes, e o da clínica, com a equipe e os outros tratamentos, fica de fora. Vira o gancho principal da versão B |
| Talina | Destaques por tipo de evento (Casamentos, 15 Anos, Formaturas, Corporativo, Festas Infantis, Chás de Fralda, Bastidores); posts de setembro feitos por fornecedores parceiros | **Confirma SEGURAR.** O Instagram faz o papel de vitrine. A intuição do Marcelo estava certa |
| Prático | "Prático Marceneiro", 141 posts, 3.202 seguidores; destaques por cliente e projeto: Martagão Gesteira, Hosp. Martagão, BRANEF, Empresas, Solaris Imbassaí, Cozinhas, Banheiros, Depoimentos, curso Promob | **Mantém SEGURAR**, com o ângulo novo registrado: a Prático atende **empresa e hospital**. Hipótese para a próxima abordagem: comprador B2B precisa de portfólio que dê pra mandar internamente, e destaque de Instagram não circula num setor de compras |
| LevSaúde | Bio leva para a Linktree com os links expirados; destaques Profissionais, Contatos, Na Mídia, Parceiros | **Reforça.** O caminho Instagram → Linktree → "link expirou" está confirmado |
| Cavalcante | Clínica: "Referência em Implante Dental!", "+ de 5 mil auto estimas renovadas". Pessoal: destaques Mentoria, E-book resina, Depoimentos, Resultados | **Compliance:** superlativo e número na bio da clínica. Mais um item que NUNCA entra na abordagem |
| Bioclin | "+ 9 anos de experiência"; destaques Cursos, Resultados | Nada muda. Confirma o segundo negócio (cursos) |
| Cintya | "Esteticista e Cosmetóloga", destaques Resultados, Corporal, Facial, A Clínica, Formações | Nada muda |

## O que aconteceu depois
- **Data:**
- **Resultado:**
- **Quem tinha razão:**
