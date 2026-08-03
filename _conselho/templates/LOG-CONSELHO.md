# Template de log do Conselho

> Copiar para `_conselho/logs/AAAA-MM-DD-<assunto>.md` ao fim de toda sessão de
> `/conselho`. Formato conversacional: cada cargo fala em primeira pessoa, com voz
> própria. Bullet point homogeneizado apaga a divergência, que é justamente o que
> vale guardar.

---

```
═══════════════════════════════════════════════════════════════════════
                       LOG DE DECISÃO DO CONSELHO
═══════════════════════════════════════════════════════════════════════

## Metadados
- **ID:** CONSELHO-{AAAA-MM-DD}-{n}
- **Data:** {data}
- **Pergunta:** {a pergunta original, sem reescrever}
- **Modo:** {agencia | cliente:<nome> | full}
- **Risco:** {BAIXO | MÉDIO | ALTO | CRÍTICO}
- **Cargos convocados:** {lista}

═══════════════════════════════════════════════════════════════════════
FASE 0: FUNDAMENTO CONSTITUCIONAL
═══════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────┐
│  📜 CONSTITUIÇÃO INVOCADA                                           │
│  ⚖️ EMPIRISMO · 📊 PARETO · 🔄 INVERSÃO · 💪 ANTIFRAGILIDADE        │
│  🔒 COMPLIANCE (cláusula pétrea, veto trava)                        │
│  HIERARQUIA: CONSTITUIÇÃO > PROTOCOLOS > INSTRUÇÃO DO CARGO         │
└─────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════
FASE 1: DEBATE ENTRE CARGOS
═══════════════════════════════════════════════════════════════════════

### Rodada 1: posições

---
**ESTRATEGISTA**

> "{fala em primeira pessoa, com a voz do cargo}"

**Posição:** {recomendação clara}
**Evidências:** ^[ARQUIVO:SEÇÃO] "{citação}"
**Doutrina puxada:** ^[mentes/{arquivo}:{seção}] "{o que sustentou}" {🌐 se benchmark estrangeiro}
**Confiança:** {0-100}%

---
**{OUTRO CARGO}**

> "{fala}"

**Posição:** {recomendação}
**Evidências:** ^[ARQUIVO:SEÇÃO] "{citação}"
**Confiança:** {0-100}%

---

### Rodada 2: confronto

**{CARGO A}** responde ao **{CARGO B}**:

> "{resposta com evidência própria}"

**Mantém a posição?** {Sim / Não / Parcialmente}, {por quê}

---

### Síntese do debate

| Aspecto | Conteúdo |
|---|---|
| Consensos | {lista} |
| Divergências | {lista, com natureza: dado / prioridade / prazo / risco} |
| Tensões produtivas | {as que devem continuar existindo} |
| Lacunas | {o que ninguém sabia e precisa ser buscado, com quem tem} |

═══════════════════════════════════════════════════════════════════════
FASE 2: CRÍTICO METODOLÓGICO
═══════════════════════════════════════════════════════════════════════

> "{fala do Crítico, sobre o processo}"

**SCORE:** {0-100}/100

| Critério | Score | Observação |
|---|---|---|
| Premissas declaradas | /20 | |
| Evidências rastreáveis | /20 | |
| Lógica consistente | /20 | |
| Cenários alternativos | /20 | |
| Conflitos resolvidos | /20 | |

**Rastreabilidade:** {X}%
**Gaps críticos:** {lista}
**Violações constitucionais:** {lista ou "nenhuma"}
**Recomendação:** {APROVAR | REVISAR | REJEITAR}

═══════════════════════════════════════════════════════════════════════
FASE 3: ADVOGADO DO DIABO
═══════════════════════════════════════════════════════════════════════

> "{fala do Advogado, atacando}"

**Premissa mais frágil:** {qual e por quê}
**Risco não discutido:** {risco} · prob. {X}% · impacto {baixo/moderado/severo}
**Cenário de arrependimento (12 meses):** {narrativa concreta}
**Alternativa ignorada:** {qual}
**Simulação de 50% de falha:** {sobrevive? / o que quebra}
**Validação barata sugerida:** {teste, custo, prazo}
**Veredicto:** {PROSSEGUIR | COM CAUTELA | NÃO PROSSEGUIR}

═══════════════════════════════════════════════════════════════════════
FASE 4: SÍNTESE FINAL
═══════════════════════════════════════════════════════════════════════

> "{fala do Sintetizador}"

### Decisão recomendada
{clara e acionável, 2 ou 3 frases}

### Modificações aplicadas
{o que mudou pelo feedback, com autoria}

### Análise de alternativas
{tabela comparativa, ou "nenhuma alternativa formal levantada"}

### Confiança: {X}%
{justificativa por dimensão}

### Riscos aceitos
| Risco | Prob. / impacto | Mitigação |
|---|---|---|

### Próximos passos
1. {ação} · responsável: {quem} · prazo: {quando}

### Critérios de reversão
- ABORTAR SE: {métrica específica}
- PIVOTAR SE: {condição}
- REVISAR EM: {data}

═══════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────┐
│  CONTEXTO UTILIZADO                                                 │
│  Modo: {}  ·  Agência: {SIM/NÃO} ({n})  ·  Cliente: {SIM/NÃO} ({n}) │
│  Referências: {SIM/NÃO} ({n})  ·  Dado real: {SIM/NÃO} ({quais})    │
└─────────────────────────────────────────────────────────────────────┘

## O que aconteceu depois
> Preencher quando houver desfecho. É o que faz o log virar aprendizado
> em vez de arquivo morto.

- **Data:** {quando}
- **Resultado:** {o que de fato aconteceu}
- **Quem tinha razão:** {qual cargo, e o que isso ensina para a próxima}
```
