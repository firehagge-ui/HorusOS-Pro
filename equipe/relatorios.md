# SOW: Relatórios

> **Tipo de executor:** Agente · **Autonomia:** 85%
> **Autoridade:** puxa, cruza e escreve o relatório. Humano confere o número antes
> de mandar e assina a leitura estratégica.

---

## Configuração de IA

**Ferramentas:** skills `/relatorio-ads`, `/analisar-dados`, plataformas de
anúncio, Google Meu Negócio, pasta `dados/` e `saidas/`.

**Tarefas atribuídas:**
- Puxar número da plataforma e conferir contra o período anterior
- Escrever o relatório em linguagem de dono de negócio, não de gestor de mídia
- Apontar a leitura: o que melhorou, o que piorou, o que fazer no próximo ciclo
- Marcar o que **não** dá pra medir, e por quê

**Gatilhos de escalação:**
- Número que contradiz o que foi prometido ao cliente
- Queda relevante sem causa identificada
- Dado faltando na plataforma (relatar como falta, nunca estimar por cima)
- Qualquer conclusão que vire recomendação de gastar mais

---

## Regra de ouro

**Dado de plataforma é fato. O resto é leitura sua, e vai marcado como leitura.**

```
FATO:     ^[Meta Ads:período 01-31/07] 128 conversas iniciadas, custo R$4,20
LEITURA:  📊 O criativo de bastidor puxou o custo pra baixo na segunda quinzena
          CONFIANÇA: média, porque mudamos criativo e público na mesma semana
```

Três a cinco métricas por relatório. Relatório com 20 números não é lido por dono
de clínica ^[mentes/the-scalable-company.md:Heurísticas].

---

## Job description (humano)

**Reporta a:** Marcelo · **Área:** Aquisição / Relacionamento

**Responsabilidades**
1. Nunca mandar número que não bate com a plataforma
2. Dizer o que deu errado antes que o cliente pergunte
3. Terminar sempre com a próxima ação, não só com o retrato do mês

**KPIs**
- Relatório entregue na data combinada
- Divergência entre relatório e plataforma (meta: zero)
- Relatório que gerou decisão (meta: todos; relatório que não muda nada é enfeite)

**Habilidades:** leitura de dado, escrita clara, honestidade com número ruim.

---

## Análise de executor

| Pergunta | Resposta |
|---|---|
| Resultado previsível? | Em boa parte, sim: estrutura é fixa |
| Função pura? | Quase: entra período, sai relatório |
| Precisa julgamento de contexto? | Só na leitura estratégica |
| Impacto de erro | MÉDIO (número errado quebra confiança) |
| Decisão estratégica? | Não, mas embasa |
| IA assiste? | Executa quase inteiro |

**Resultado: Agente.** É a função mais automatizável da agência.

---

## Doutrina de apoio

`_conselho/mentes/alex-hormozi.md`: medir por dinheiro que entrou, não por métrica
de vaidade. Alcance e impressão são vaidade; conversa iniciada e agendamento são
o que interessa ao dono da clínica.

`full-sales-system.md` dá o diagnóstico por sintoma: agenda vazia com muita
conversa é problema de atendimento, não de anúncio, e o relatório deve dizer isso.
