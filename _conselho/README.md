# O Conselho

Sistema de deliberação da Horus. Portado do `/conclave` do
[mega-brain](https://github.com/YuriRDev/mega-brain) e adaptado para esta agência.

Existe para uma coisa: **decisão difícil não sair de uma opinião só**. Em vez de
uma resposta média, a pergunta passa por cargos que discordam entre si e depois
por três avaliadores que atacam o raciocínio antes de virar decisão.

---

## Como se usa

```
/conselho <pergunta>            sessão completa (6 fases)
/debate <pergunta>              só o debate entre cargos, mais leve
/consultar <mente> <pergunta>   uma lente só, sem rito
/comparar <m1>,<m2> <pergunta>  duas doutrinas lado a lado, sem síntese
```

Skills em `.claude/skills/{conselho,debate,consultar,comparar}/`.

---

## Arquitetura em 3 camadas

```
┌─────────────────────────────────────────────────────────────────────┐
│  CAMADA 1: CONSTITUIÇÃO                     CONSTITUICAO.md         │
│  Empirismo · Pareto · Inversão · Antifragilidade · Compliance       │
│  Governa tudo. Nenhum agente contradiz.                             │
├─────────────────────────────────────────────────────────────────────┤
│  CAMADA 2: MENTES (doutrina citável)                 mentes/        │
│  Hormozi · Cole Gordon · Jeremy Miner · Jeremy Haynes               │
│  G4 Educação · Full Sales System · The Scalable Company             │
│  Não debatem. São a fonte que os cargos citam.                      │
├─────────────────────────────────────────────────────────────────────┤
│  CAMADA 3: CARGOS (têm contexto de domínio)          cargos/        │
│  Estrategista · Criação · Mídia · Financeiro · Operações            │
│  Compliance (com poder de VETO)                                     │
│  Respondem "O QUE fazer". Cada um defende a lente dele.             │
├─────────────────────────────────────────────────────────────────────┤
│  CAMADA 4: CONSELHO (sem contexto de domínio)      conselho/        │
│  🔍 Crítico Metodológico  avalia o processo, score 0-100            │
│  😈 Advogado do Diabo     ataca com 6 perguntas obrigatórias        │
│  🔮 Sintetizador          integra em decisão acionável              │
│  Avaliam "COMO raciocinaram", nunca o mérito do tema.               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Fluxo

```
/conselho "pergunta"
   │
   ├─ FASE 0  Constituição invocada, sessão declarada (modo, risco, cargos)
   ├─ FASE 1  Debate: posições → rebatidas → síntese (máx. 3 rodadas)
   ├─ FASE 2  Crítico: score 0-100 + auditoria de fontes (<70% pausa)
   ├─ FASE 3  Advogado: premissa frágil, risco oculto, arrependimento,
   │          alternativa, simulação de 50% de falha, validação barata
   ├─ FASE 4  Sintetizador: decisão, confiança, riscos, passos, reversão
   └─ FASE 5  Threshold:  ≥70% decide · 50-69% ressalva · <50% escala
```

---

## Arquivos

| Arquivo | Função |
|---|---|
| `CONSTITUICAO.md` | Os 4 princípios + as 2 cláusulas Horus |
| `PROTOCOLO-CONSELHO.md` | As 6 fases, modos de contexto, regras invioláveis |
| `PROTOCOLO-DEBATE.md` | Rodadas, convocação de cargos, síntese do debate |
| `REGRAS-DE-CITACAO.md` | Formato de fonte, hierarquia, penalidades |
| `DINAMICA-E-LIMITES.md` | Escala de risco, circuit breaker, anti-teatro |
| `cargos/*.md` | As 6 lentes da agência |
| `mentes/*.md` | As 7 doutrinas citáveis (ver `mentes/README.md`) |
| `conselho/*.md` | Os 3 meta-avaliadores |
| `templates/LOG-CONSELHO.md` | Formato do log de decisão |
| `logs/` | Decisões gravadas, com a divergência preservada |

---

## O que mudou em relação ao mega-brain

O original foi escrito para uma empresa de vendas high-ticket com R$500K por
decisão. As adaptações:

| Original | Aqui |
|---|---|
| Cargos CRO/CFO/CMO/COO/CTO | Estrategista, Criação, Mídia, Financeiro, Operações, **Compliance** |
| Fontes: DNA de especialista, dossiê, RAG | `_memoria/`, `clientes/<nome>/`, `_memoria/design/`, `referencias/` **mais as 7 mentes portadas em `mentes/`** |
| Buckets B1/B2/B3 | Modos `agencia`, `cliente:<nome>`, `full` |
| Hedge obrigatório acima de R$500K | Escala de risco BAIXO/MÉDIO/ALTO/CRÍTICO em horas e reversibilidade |
| Sem camada regulatória | **Compliance com veto** (CFO, CFP, LGPD), cláusula pétrea |
| Advogado com 6 perguntas genéricas | Mesmas 6, com checklist de risco de agência pequena |
| Python de smart context, workflow YAML, timeouts em segundos | Cortados: não existe runtime aqui, o roteiro roda na conversa |

O que **não** mudou, porque é o valor do sistema: a separação entre quem tem
domínio e quem avalia o raciocínio, a citação obrigatória com localização, o
Advogado que só descansa quando acha falha, e o Sintetizador que integra em vez
de fazer média.
