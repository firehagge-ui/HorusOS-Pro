# Agente de Social Media da Horus: análise e arquitetura

> Escrito em 27/09/2026 a pedido do Marcelo. Documento de decisão: o que se aproveita do
> opensquad, onde as ideias iniciais foram corrigidas, e a arquitetura que vamos construir
> em etapas. O estado da implementação fica no `README.md` desta pasta.

---

## 1. Resumo

- **O opensquad não serve de motor.** Ele é um framework só de prompt: o executor é um
  arquivo markdown que o próprio modelo interpreta, e o estado da execução vive na conversa
  (o próprio runner diz: *"This state does NOT persist to disk"*). Não tem agendador, não tem
  gatilho, não lê métrica e exige confirmação humana antes de toda publicação. É o oposto do
  funcionário autônomo que queremos.
- **O que ele tem de bom são mecanismos de confiabilidade e doutrina.** Portão binário por
  comando (em vez de "confia que o modelo fez"), condições de veto, limite de ciclos de revisão,
  modelo por etapa, separação entre preferência declarada e inferência na memória, relatório
  com nível de confiança. Isso entra.
- **Metade do agente já existe no Horus OS**: criação (`/carrossel` + `_memoria/conteudo/`),
  fila de tarefas + Claude pela assinatura + WhatsApp + navegador (Farejador), CRM onde o lead
  cai (Hounder), camada por marca (`clientes/<nome>/`). Falta o cérebro de decisão, o ciclo de
  métricas e a orquestração autônoma.
- **Caminho de execução:** API oficial da Meta para tudo que se repete (publicar, medir,
  comentário, DM). Playwright só para o que a API não faz (bio, foto, destaques, editar legenda,
  conferência visual).

---

## 2. O opensquad sob a lente de agente autônomo

Repositório `github.com/renatoasse/opensquad`, MIT, último commit 10/04/2026 (a mesma versão
analisada em 03/08, ver `_memoria/conteudo/91-o-que-veio-do-opensquad.md`). Aquela análise
olhou conteúdo; esta olha orquestração, autonomia, dados e publicação.

### 2.1 Mapa

| Parte | O que é | Tamanho |
|---|---|---|
| `bin/` + `src/` | CLI `npx opensquad` que copia templates para 9 IDEs, registra skills e lista execuções | ~1.300 linhas JS |
| `_opensquad/core/runner.pipeline.md` | O "executor": instrução em markdown de como o modelo deve rodar um pipeline | 535 linhas |
| `_opensquad/core/architect.agent.yaml` + `prompts/discovery|design|build` | O Arquiteto: entrevista o usuário e gera um squad (agentes, passos, YAML) | ~1.400 linhas |
| `_opensquad/core/best-practices/` | 20 guias por formato ou papel (instagram-feed, reels, stories, strategist, researching, data-analysis, review, copywriting, publishing…) | ~4.400 linhas |
| `_opensquad/core/prompts/sherlock-*` | Investigador que abre Instagram/LinkedIn/X/YouTube logado com Playwright e extrai posts | ~1.000 linhas |
| `skills/` | instagram-publisher (Graph API + imgBB), blotato (publicador terceiro), apify (raspagem), canva (MCP), image-ai-generator (OpenRouter), image-fetcher, template-designer, resend (e-mail), skill-creator com avaliação | 17 arquivos |
| `temp/squads/instagram-carrossel/` | Squad de exemplo: 13 passos, 7 checkpoints, 5 agentes | 55 arquivos |
| `dashboard/` | "Escritório Virtual" em Phaser com bonequinhos | 27 arquivos |
| `docs/` | Planos e especificações de cada mudança (útil para entender o porquê) | ~45 arquivos |

### 2.2 Agentes existentes

- **Arquiteto**: cria squads a partir de conversa. Meta-agente; não se aplica (as nossas
  skills são escritas uma vez, não geradas por entrevista).
- **Sherlock**: investigador de perfis de referência via navegador logado. Salva cookie em
  disco, transcreve Reels com yt-dlp + whisper.
- **Squad de carrossel**: pesquisador (notícias ranqueadas por "potencial viral"), copywriter
  (ângulos → slides → otimização), image-designer (3 identidades → slides → render), revisor
  (nota ponderada + veto), publisher (valida e publica).

### 2.3 Workflows e sistemas de decisão

- Pipeline **linear** com checkpoints humanos (7 de 13 passos no exemplo).
- `autonomy: interactive | autonomous` por squad e `checkpoint: approve | select | skip` por passo.
- **Portões binários** (`test -s arquivo && echo PASS`) antes e depois de cada passo. Criados
  porque o Sherlock declarou "5 perfis analisados" com as pastas vazias. O modelo completa a
  sequência por inércia; um comando não alucina.
- **Condições de veto** por tarefa, até 2 tentativas de correção, depois o humano decide.
- **Revisão com limite** (`on_reject` volta ao passo, `max_review_cycles`).
- **Nível de modelo por passo** (`fast` / `powerful`).
- **Memória em duas camadas**: `memories.md` só com feedback **explícito** do usuário (nunca
  inferência) e `runs.md` com o log de execuções.

### 2.4 Dependências

Node 20, Playwright (CLI e MCP), yt-dlp, ffmpeg, whisper, imgBB, OpenRouter, Blotato, Apify,
Canva MCP, Resend. Cada skill externa é uma conta, uma chave e um custo a mais.

### 2.5 Problemas encontrados

1. **Sem runtime.** Estado na conversa, nada em disco além de `state.json` para o dashboard.
   Não sobrevive a queda, não roda agendado, não roda sem alguém na tela.
2. **Sem agendador e sem gatilho.** Tudo começa com um humano digitando `/opensquad`.
3. **Sem ciclo de métricas.** Nenhuma parte lê insights. A seção "Performance Notes" da memória
   do squad de exemplo está vazia por construção: o pipeline termina na publicação.
4. **"Nunca publique sem confirmação explícita"** é a regra cardinal do publisher. Correta para
   eles, incompatível com autonomia sem uma política de níveis.
5. **imgBB** segura as imagens num terceiro para ter URL pública.
6. **Sherlock** raspa rede social logada e guarda sessão em JSON. Risco de conta.
7. **Token gasto em teatro**: o runner reescreve `state.json` várias vezes por passo só para
   animar o dashboard.
8. **Dados defasados**: "25 posts por 24h" (hoje 50 a 100), "impressions" (morreu em abril de
   2025), "JPEG only" (PNG já é aceito).
9. **Pesquisador otimiza "potencial viral"** de notícia. Para agência local, notícia viral de
   IA atrai marqueteiro, não dono de clínica.
10. **Doutrina americana de resposta direta** no copywriting (urgência, escassez). Não passa em
    cliente regulado.

### 2.6 Veredito por peça

**Aproveitar (como mecanismo, reescrito aqui)**

| Do opensquad | Vira no nosso agente |
|---|---|
| Portões binários por comando | Toda etapa confirma por código, nunca pela palavra do modelo: PNG existe e tem 1080×1350, legenda ≤ 2.200, container `FINISHED`, permalink devolvido, linha gravada no banco |
| Condições de veto + no máximo 2 correções | Juiz de qualidade separado do criador, rodando `_memoria/conteudo/99-checklist.md`; reprovou 2 vezes, vai para o humano |
| `max_review_cycles` | Mesmo limite, para não ficar reescrevendo em loop gastando assinatura |
| `model_tier` por passo | Sonnet para triagem de comentário e coleta; Opus para estratégia, auditoria e análise mensal |
| Memória: explícito ≠ inferido | Três gavetas: **preferência** (o Marcelo disse), **evidência** (métrica medida), **hipótese** (o agente acha). Hipótese nunca vira regra sem experimento |
| `data-analysis.md`: confiança alta/média/baixa, sempre contra uma base, anomalia > 25% | Formato obrigatório do relatório do analista |
| `researching.md`: fonte primária, data de acesso, contradição exposta, navegador só quando a busca não basta | Regras do pesquisador (Firecrawl) |
| `strategist.md`: 3 a 5 pilares com % e objetivo; persistir ou mudar só depois de 2 ciclos; nota impacto × viabilidade × alinhamento | Esqueleto da estratégia e do calendário |
| Publisher: validar antes de chamar, relatório com permalink, alerta de cota, um por vez | Regras do adaptador de publicação |
| Espera do container (`pollUntilFinished`) | Já existia no nosso `postar-instagram.js`; mantido |
| `instagram-reels.md` / `instagram-stories.md` | Referência de estrutura (gancho em 2 s, laço, legenda queimada) quando entrarmos em Reels |

Já trazido em 03/08 e segue valendo: os sete formatos narrativos, os pisos de legibilidade,
os antipadrões de copy e a rubrica com veto.

**Adaptar**

- `autonomy` por squad → **política de autonomia por ação e por marca** (seção 4.4).
- Pesquisador de notícia viral → **pesquisador de tendência** com nota própria: serve ao dono
  de negócio local? cabe num pilar? dá para provar? Viralidade é critério secundário.
- `template-designer` (3 identidades, a escolhida vira arquivo fixo) → **identidade travada por
  marca** em `carrossel-referencia.html`. A decisão ficou pendente em 03/08; para agente
  autônomo ela deixa de ser opcional, porque redecidir estilo a cada post desorganiza o feed.
- Sherlock → **estudo de referência** por Firecrawl e pela API, sem login raspando.

**Descartar**

Framework, runner, CLI e os 9 templates de IDE (as skills do Claude Code já fazem isso);
dashboard Phaser; imgBB; Blotato (terceiro pago, desnecessário para uma rede); Apify para
Instagram; gerador de imagem por OpenRouter (regra da casa: imagem não é gerada por API sem
decisão do Marcelo); Canva MCP; Resend; skill-creator deles (temos a nativa); um HTML por
slide; 3:4; copy de resposta direta.

---

## 3. Onde as ideias iniciais foram corrigidas

| Ideia | Problema | O que fica |
|---|---|---|
| Playwright como caminho principal | Automação de navegador no Instagram gera checkpoint, bloqueio de ação e, no limite, perda da conta. Interface muda sem aviso. Métrica raspada de tela é a parte mais frágil de todas | **API oficial** para publicar, medir, comentário e DM. **Playwright** só para bio, foto, destaques, capas, editar legenda e conferir o feed |
| Gerar imagem no ChatGPT pelo navegador, sozinho | Frágil (limite, captcha, interface) e esbarra na regra "IA nunca no objeto que o cliente vende". A Horus vende serviço: a peça dela é tipográfica e gráfica, renderizada em HTML → PNG, o que é determinístico e auditável | Render HTML → PNG no caminho principal. ChatGPT só para elemento abstrato, pedido em fila, fora do caminho crítico. Automação de imagem, se vier, é por API (fal.ai pendente), não por navegador |
| Instagram como canal de aquisição | Hoje a aquisição da Horus é **outbound** (esteira do Hounder). Quem recebe a mensagem abre o perfil antes de responder. Aquisição orgânica numa conta local nova é lenta | Papel 1: **prova** para o lead da esteira (objetivo O4 do plano de negócio). Papel 2: aquisição orgânica. A auditoria otimiza primeiro o perfil para quem chega pela mensagem |
| Público | Conteúdo de "marketing digital" atrai outros profissionais de marketing | Público é o **dono de negócio local em Salvador** (clínica, oficina, comércio, serviço). Conteúdo fala da dor dele, não do nosso ofício |
| Impressões, cliques, visitas ao perfil | A Meta trocou impressões por **visualizações** (abril de 2025) e tirou visitas ao perfil e cliques no site do nível da conta (janeiro de 2025) | Por post ainda existem `profile_visits`, `follows`, `shares`, `saved`, `reach`, `views`. Na conta, `profile_links_taps`. **Conversão se mede no Hounder** (lead com origem Instagram), não no Instagram |
| Aprender com as métricas | Conta pequena: comparar formato e horário é ruído por meses | Aprendizado por **experimento**: hipótese, uma variável, amostra mínima, decisão no fechamento do ciclo. Nada muda por causa de um post |
| Responder DM e comentário sozinho | A casa proíbe bot respondendo lead. A Meta só deixa responder quem escreveu primeiro, dentro de 24 h | Automático só no risco baixo. Lead vira ficha no Hounder + rascunho para o Marcelo. Preço, prazo e negociação: nunca |
| Postar todo dia | Com um revisor humano na fase 1, volume diário vira revisão apressada | Cadência sai da capacidade de revisão: começar com 3 posts de feed por semana + stories; subir quando a fila aprovar sem edição |
| Tendência e meme | Criatividade sem régua vira ruído de marca | Orçamento de exploração: até 20% do calendário, marcado como experimento, com a mesma régua de qualidade |
| Autonomia total | Sem histórico, o agente não mereceu confiança ainda | Autonomia em **fases**, por formato, conquistada por aprovação sem edição (seção 4.4) |
| Multi-cliente | A maioria dos leads atuais é de saúde (regulado) | Arquitetura multi-marca desde o dia 1. Operar cliente só depois de 60 a 90 dias rodando a Horus. Cliente regulado nunca passa da fase 1 |
| PC como servidor | Farejador depende do PC ligado | Aceitável agora. Quando crescer, a parte de API vai para a nuvem e só o Playwright fica no PC |

---

## 4. Arquitetura

### 4.1 Camadas

```
┌──────────────────────── ESTADO (Supabase do Hounder, tabelas social_*) ────────────────────────┐
│ contas · posts (ideia→pronto→aprovado→publicado→medido) · métricas por janela · interações      │
│ experimentos · aprendizados · ações (log de toda ação externa)                                  │
└───────────────────────────────────────────▲─────────────────────────────────────────────────────┘
                                            │
┌──────────────── ORQUESTRAÇÃO (Farejador no PC: fila `jobs` + rotinas + WhatsApp) ───────────────┐
│ gatilhos de tempo · de evento · de limiar · de estado  →  job  →  claude -p (Sonnet ou Opus)     │
└───────────────────────────────────────────▲─────────────────────────────────────────────────────┘
                                            │
┌──────────── CÉREBRO GENÉRICO (serve qualquer marca) ─────────────┐   ┌──── MARCA (parâmetro) ────┐
│ doutrina em _memoria/social/  +  skills:                         │   │ Horus: _memoria/, identi- │
│ auditar · pesquisar · planejar · criar (/carrossel) · revisar    │◄──│ dade/, identidade/social  │
│ · analisar · aprender · responder                                │   │ Cliente: clientes/<nome>/ │
└───────────────────────────────────────────▲──────────────────────┘   │ (marca, briefing, social, │
                                            │                          │ compliance)               │
┌──────────────── MOTOR (ferramentas/social/, código determinístico) ────────────────┐ └──────────┘
│ política de autonomia (decide auto / fila / proibido ANTES de qualquer ação)        │
│ adaptadores: Meta API (principal) · navegador Playwright · hospedagem de mídia      │
│             · pesquisa (Firecrawl)                                                   │
│ confiabilidade: retentativa por classe de erro, idempotência, disjuntor, renovação  │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

A divisão central: **o modelo decide e escreve; o código executa e confere.** O modelo nunca
chama a API diretamente. Ele produz uma intenção ("publicar o post 42 às 11h"), o motor passa
a intenção pela política, executa, confere por código e grava o resultado.

### 4.2 Onde mora cada coisa

| Camada | Lugar | Por quê |
|---|---|---|
| Motor | `ferramentas/social/` | Pacote próprio, sem dependência externa, testável. O Hounder chama; não mistura com o CRM |
| Estado | Supabase do Hounder, migração `social_*` | Um banco só, o painel mostra, o Farejador já lê e escreve lá |
| Orquestração | Farejador (`jobs` + rotinas) | Já tem fila, retomada após limite da assinatura, uma tarefa de navegador por vez, aviso no WhatsApp |
| Doutrina genérica | `_memoria/social/` | Mesmo padrão de `_memoria/conteudo/` e `_memoria/design/` |
| Marca Horus | `identidade/social/perfil.md` + `ferramentas/social/marcas/horus.json` | O `.json` é o que o código lê (caminhos, política, @); o `.md` é o que o modelo lê (objetivo, público, pilares) |
| Marca cliente | `clientes/<nome>/social.md` + `marcas/<nome>.json` | Cada cliente continua autossuficiente na pasta dele |
| Segredo | `ferramentas/social/.segredos/<marca>.json` | Fora do Git; o motor renova e regrava o token sozinho |

### 4.3 Gatilhos

| Tipo | Exemplo | Como detecta | O que dispara |
|---|---|---|---|
| Tempo | Todo dia 7h; segunda 8h; dia 1 do mês | Rotina do Farejador | Coleta, relatório semanal, estratégia mensal |
| Evento | Comentário novo, DM nova | Consulta à API a cada 10 a 15 min (webhook depois, quando o app passar na revisão da Meta) | Triagem da interação |
| Limiar | Post com alcance acima do p75 ou abaixo do p25 em 72 h | Rotina de métricas compara com a mediana dos últimos 12 | Análise do porquê + hipótese |
| Estado | Estoque aprovado < 5 dias; token vence em < 10 dias; sessão do navegador caiu | Rotina de saúde | Planejar/criar; renovar token; avisar o Marcelo |
| Meta | Conversas qualificadas da semana abaixo da meta | Relatório semanal cruza com o Hounder | Ajuste do mix de conteúdo (CTA, prova, conversão) |
| Oportunidade | Tendência relevante encontrada | Varredura de pesquisa 2 vezes por semana | Proposta de post experimental na fila |

### 4.4 Política de autonomia

Toda ação passa por `politica.decidir()` antes de acontecer. Três respostas: **auto** (faz e
registra), **fila** (prepara e espera aprovação no Hounder) e **proibido** (não faz e registra
a tentativa). Ação desconhecida é proibida (falha fechada).

| Ação | Fase 1 | Fase 2 | Fase 3 |
|---|---|---|---|
| Ler perfil, métricas, comentários, DMs | auto | auto | auto |
| Publicar feed / carrossel | fila | graduado¹ | auto |
| Publicar story | fila | auto | auto |
| Responder comentário de risco baixo (agradecimento, emoji, dúvida com resposta pronta) | fila | auto | auto |
| Ocultar comentário ofensivo ou spam | fila | auto | auto |
| Responder DM | fila | fila | fila |
| Editar bio, nome, foto, destaque, capa | fila | fila | fila |
| Editar legenda de post publicado | fila | fila | auto |
| Excluir post, DM para quem não escreveu, seguir ou curtir em massa, falar de preço | proibido | proibido | proibido |

¹ **graduado**: o formato vira auto depois de N aprovações seguidas sem edição (padrão 8). Uma
edição ou reprovação zera a contagem.
Marca regulada: nada público passa de **fila**, em nenhuma fase.
Limites diários (posts, respostas) valem por cima: estourou, vira fila.

### 4.5 Ciclo

```
SEG  analisar a semana (métricas + Hounder) → ajustar o plano da semana
     planejar: cada post nasce com objetivo, público, pilar, etapa do funil, formato, CTA, hipótese
TER–SEX  criar (/carrossel) → revisar (juiz separado, veto) → fila → aprovar → publicar pela API
DIÁRIO   coletar métricas nas janelas 24 h, 72 h, 7 d, 28 d · triar comentários e DMs
SEX  fechar experimentos com amostra suficiente → aprendizado (evidência, não palpite)
MÊS  revisão estratégica: pilares, mix, cadência; pesquisa profunda de mudanças do Instagram
```

Um post só existe com o "porquê" preenchido. O analista compara o resultado com a hipótese
daquele post, não com a vontade de ter viralizado.

### 4.6 Confiabilidade

- **Classes de erro** da API: autenticação (token), permissão, parâmetro, limite, transitório.
  Só limite e transitório tentam de novo, com espera crescente. O resto para e avisa.
- **Idempotência na publicação**: publicar não pode rodar duas vezes. Se a chamada final falhar,
  o motor consulta o container; se já está `PUBLISHED`, recupera o post em vez de repetir.
- **Métrica tolerante a depreciação**: a Meta remove métrica sem aviso. Se a API recusar uma, o
  motor tira aquela e pede o resto, e registra qual caiu.
- **Renovação de token** automática antes dos 60 dias (o token da Meta renova depois de 24 h).
- **Disjuntor**: 3 falhas seguidas no mesmo adaptador pausam aquele adaptador e avisam no WhatsApp.
- **Trava de conta**: antes de qualquer escrita, o motor confere que o @ devolvido pela API é o
  @ da marca. Se não bater, não publica.
- **Playwright**: perfil dedicado (o do Farejador), um por vez, seletor por papel e texto
  acessível com alternativa, foto de tela + HTML salvos em falha, ritmo humano, nunca em laço.
  Tela de verificação ou desafio de login: para tudo e chama o Marcelo.

### 4.7 Observabilidade

Toda ação externa vira linha em `social_acoes` (quando, marca, ação, nível da política, entrada
resumida, resultado, erro, duração). O resumo diário do Farejador ganha um bloco de Instagram.
O Hounder ganha uma tela Social: fila de aprovação, calendário, métricas e o log.

### 4.8 Segurança

- Token fora do Git, escopo mínimo de permissões.
- **Comentário e DM são texto de terceiro**: entram como dado, nunca como instrução. A triagem
  roda no modo leve do Farejador (sem ferramentas, fora do repositório), que já existe para
  isso.
- Nenhuma ação destrutiva no cardápio.
- Integridade e compliance da casa valem igual: nada de número, depoimento ou case inventado.

---

## 5. Roteiro em etapas

| Etapa | Entrega | Depende de |
|---|---|---|
| **0** | Adaptador da API, política de autonomia, linha de comando, testes, guia da chave | nada (feito em 27/09) |
| **1** | Coleta de métricas para o banco + relatório semanal, sem publicar nada | chave da Meta + @ confirmado |
| **2** | Auditoria inicial do perfil (API + Playwright) → plano de otimização → aprovação → execução pelo navegador | etapa 1 |
| **3** | Doutrina `_memoria/social/`, estratégia, pilares e calendário com pesquisa (Firecrawl) | etapa 2 |
| **4** | Criação + fila de aprovação no Hounder + publicação pela API + hospedagem de mídia | etapa 3 + decisão de hospedagem |
| **5** | Comentários e DMs: triagem, resposta de risco baixo, lead para o Hounder | etapa 4 |
| **6** | Experimentos, aprendizado e graduação de autonomia | 4 a 6 semanas de dado |
| **7** | Primeiro cliente não regulado | 60 a 90 dias da Horus rodando |

---

## 6. Decisões pendentes do Marcelo

1. **Qual é o @ oficial.** O repositório tem três: `@horusagencia.br` (site, `empresa.md`,
   `design-guide.md`, 22/09), `@agenciahorus02` (`brandbook.md` e Hounder, 17/09) e
   `@horuspublicidade` (valor padrão antigo no banco). O motor não escreve em conta nenhuma
   até isso estar fechado.
2. **Hospedagem da mídia para publicar.** A API exige URL pública. Opções: bucket no Supabase
   (recomendado; precisa da chave de serviço do projeto) ou a pasta do site (mais lenta, suja o
   site). Só é preciso na etapa 4.
3. **Regra de DM e comentário.** Confirmar a tabela 4.4, que mantém "resposta de lead é do humano".
4. **Identidade travada** (`carrossel-referencia.html`) para a Horus, pendente desde 03/08.

---

## 7. Decisões de 27/09/2026 (Marcelo)

### 7.1 O nome: 📣 Mídia, do Conselho

O agente é o **Mídia**, o cargo do Conselho (`_conselho/cargos/midia.md`), que ganha um papel
maior: continua opinando no Conselho e passa a **operar** o Instagram. A pergunta dele já era a
do canal: "por qual canal essa pessoa realmente chega?".

O **🎨 Criação** (`_conselho/cargos/criacao.md`) vira o **revisor independente** dos posts do
Mídia: quem cria não se avalia (seção 2.6). A pergunta dele é o filtro: "isso parece feito por
alguém, ou parece saída de IA?". Em cliente regulado, o **🔒 Compliance** entra depois dele,
com veto.

### 7.2 Como ele fica ligado

Não precisa de skill para ativar. O Mídia vive **dentro do Farejador**: se o Farejador está
ligado no PC, o Mídia está trabalhando. Há um interruptor em Hounder → Instagram (pausar e
retomar) e os horários ficam na tela. A skill `/midia` serve só para conversar com ele no Claude
Code ("planeja a semana agora", "refaz o post 2", "como estamos?").

### 7.3 Economia de token (regra do Marcelo: não gastar à toa)

Princípio: **código faz o que é repetitivo; o Claude só entra para pensar, e em lote.**

| Rotina | Quando | Custo de Claude |
|---|---|---|
| Ver comentários e DMs novos | a cada 30 min | **zero**: é chamada à API, só código. DM nova avisa o Marcelo no WhatsApp também por código |
| Triagem do que chegou (lead? spam? resposta de risco baixo?) | 3 vezes por dia (10h, 14h, 19h), **só se houver algo pendente**, tudo numa chamada | Sonnet, modo leve |
| Métricas da conta e dos posts (24 h, 72 h, 7 d) | todo dia, 7h | **zero** |
| Resumo no WhatsApp | dentro do resumo das 8h que o Farejador já manda | **zero** |
| **Sessão da semana** | **segunda, 8h**: análise + plano + copy dos 3 posts **numa sessão só**. A cada 2 semanas inclui a pesquisa de tendências; na primeira segunda do mês inclui a revisão da estratégia | **1 Opus por semana** |
| Render dos slides | logo depois | **zero** (Playwright por código) |
| Imagens no ChatGPT | logo depois, se o plano pedir | **zero** quando o roteiro de navegador por código funciona; Claude só se ele falhar |
| Revisão do Criação | os 3 posts juntos, numa chamada | 1 Sonnet por semana |
| Publicar os aprovados | no dia e hora do plano | **zero** |

**Modelo (Marcelo, 28/09/2026): toda escrita de post é Opus** (sessão da semana, correção depois de reprovação, ajuste pedido no painel). Sonnet só para revisar (🎨 Criação) e triar comentários e DMs.

Conta da semana típica: 1 sessão Opus + 1 revisão Sonnet + triagens pequenas só quando há
comentário ou DM. O "a cada 15 min" do desenho anterior saiu: não gastava token (era código),
mas 30 min basta para uma conta desse tamanho.

### 7.4 ChatGPT para enriquecer o visual

O Mídia abre o ChatGPT **sempre pelo Chrome do Marcelo** (extensão Claude in Chrome, conta dele já
logada; regra do Marcelo, 27/09/2026), nunca por um navegador separado, e pede **elementos visuais**: setas desenhadas, sublinhados, rabiscos de destaque, ícones,
ilustrações de conceito, texturas, sempre com fundo transparente e nas cores da marca. Os
elementos aprovados vão para uma **biblioteca da marca** (`identidade/social/elementos/`) e são
reaproveitados, o que mantém a identidade e economiza geração.

Consequência: a geração de imagem só roda com o Chrome do Marcelo aberto. Se o Chrome estiver
fechado, o post segue tipográfico e a imagem fica marcada como pendente na fila. A primeira
sessão de segunda confere se o `claude -p` do Farejador alcança a extensão (`--chrome`);
enquanto isso não for verificado, o passo de imagem roda quando o Marcelo está no PC.

Travas: nada de IA no que a Horus vende (nenhum site ou tela inventada; trabalho mostrado é
print real); se a geração falhar, o post sai tipográfico e não atrasa.

### 7.5 O que o Marcelo vê no Hounder (Instagram → abas)

| Aba | O que mostra |
|---|---|
| **Visão** | O que já existe: seguidores, posts, engajamento, agora pela API |
| **Semana** | O plano do Mídia: cada post com dia e hora, pilar, objetivo, a hipótese que ele testa, a prévia dos slides e a legenda. Botões **Aprovar**, **Pedir ajuste** (com texto) e **Reprovar**. Status: planejado → criado → revisado pelo Criação → esperando você → agendado → no ar → medido |
| **Agenda** | Próximas execuções com horário (próxima triagem, coleta, sessão de segunda, publicações marcadas) e a última de cada uma, com resultado |
| **Agora** | O que o Mídia está fazendo neste momento (passo a passo ao vivo, como a investigação de lead já mostra) e o diário das últimas ações |
| **Caixa** | Comentários e DMs já triados: lead (com botão para a ficha), dúvida, spam, respondido |
| **Aprendizados** | Experimentos em andamento e o que ele concluiu, com o número que sustenta cada conclusão |

Botão **Falar com o Mídia** no topo, igual ao "Falar sobre este lead".
