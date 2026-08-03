# Protocolo de Debate entre cargos

> **Versão:** 1.0 (adaptado do `DEBATE-PROTOCOL` do mega-brain)
> **Uso:** Fase 1 do Conselho, ou sozinho via `/debate`
> **Saída:** consensos, divergências, tensões produtivas, lacunas

---

## Quem senta na mesa

Os cargos vivem em `_conselho/cargos/`. Cada um defende **a lente dele**, não o
consenso. Divergência explícita vale mais que concordância artificial.

| Cargo | Lente | Doutrina que ele puxa | Convocar quando |
|---|---|---|---|
| **Estrategista** | Posicionamento, oferta, prioridade, funil | Hormozi, G4, FSS | Quase sempre |
| **Criação** | Design, site, peça, marca, copy | `_memoria/design/` primeiro; Cole, Miner, Haynes | Entrega visual ou de texto |
| **Mídia** | Canal, tráfego, CAC, GMN, SEO local | Haynes, FSS, Hormozi | Aquisição, anúncio, alcance |
| **Financeiro** | Preço, margem, hora de trabalho, ROI | Hormozi, FSS | Dinheiro ou esforço em jogo |
| **Operações** | Capacidade, prazo, o que a agência dá conta | The Scalable Company, Hormozi | Quase sempre |
| **Compliance** | CFO, CFP, LGPD, trava do cliente | Nenhuma. Só a norma | **Obrigatório** em cliente regulado |

As mentes ficam em `_conselho/mentes/` e estão disponíveis em qualquer modo.
Cada arquivo de cargo lista, na seção "doutrina que ele cita", o que puxar.

### Convocação padrão por tipo de pergunta

| Pergunta é sobre... | Cargos |
|---|---|
| Preço, proposta, escopo comercial | Estrategista, Financeiro, Operações |
| Site, identidade, peça | Estrategista, Criação, Operações (+ Compliance se regulado) |
| Anúncio, canal, alcance | Estrategista, Mídia, Financeiro (+ Compliance se regulado) |
| Prioridade da agência, foco, cliente novo | Estrategista, Financeiro, Operações |
| Publicar algo de cliente regulado | **Compliance sempre**, mais os cargos do tema |

Mínimo de 2 cargos. Acima de 4 o debate fica ruidoso: escolher as lentes que
realmente divergem entre si.

---

## Fase 1: posições individuais

Cada cargo, sem ver o que os outros escreveram:

1. Lê os arquivos que o modo libera (ver `PROTOCOLO-CONSELHO.md`)
2. Lê a própria instrução em `_conselho/cargos/<cargo>.md`
3. **Lê a doutrina que aquele cargo puxa** em `_conselho/mentes/` (tabela acima).
   Se a mente não fala do tema, declarar isso em vez de forçar citação
4. Aplica `REGRAS-DE-CITACAO.md`
5. Escreve a posição no template da Regra 6

⚠️ Número de mente é benchmark estrangeiro: citar como referência, marcado com 🌐,
nunca como meta da Horus. `full-sales-system` é a mente encarregada de contestar
número importado sem calibração brasileira.

```
┌─ POSIÇÃO: {CARGO} ──────────────────────────────────────────────────┐
│  RECOMENDAÇÃO: {2 ou 3 frases claras}                               │
│  EVIDÊNCIAS: ^[ARQUIVO:SEÇÃO] "citação"                             │
│  DOUTRINA PUXADA: ^[mentes/{arquivo}:{seção}] {🌐 se estrangeiro}   │
│  PREMISSAS DECLARADAS: {lista}                                      │
│  RISCOS DA MINHA LENTE: {lista}                                     │
│  CONFIANÇA: {0-100}%                                                │
│  O QUE EU NÃO SEI: {limitação}                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Formato de fala:** cada cargo tem voz própria (definida no arquivo dele) e fala
em primeira pessoa. Não homogeneizar. Um debate onde todo mundo escreve igual é
um debate que não aconteceu.

---

## Checkpoint de convergência

Depois da rodada 1, medir: os cargos estão dizendo a mesma coisa?

**Fórmula (do original):** convergência = pontos de concordância ÷ pontos totais.
Os quatro pontos que se compara:

```
[ ] Mesma recomendação final
[ ] Mesmas premissas de base
[ ] Mesmos riscos identificados
[ ] Mesmo momento proposto (agora, depois, nunca)
```

```
Convergência ≥ 70% (3 de 4)?  → pular direto para a síntese
Convergência < 70%?           → rodada 2
```

⚠️ **Consenso rápido é bandeira vermelha**, não vitória. Se convergiu de primeira,
o Crítico deve perguntar se o problema era trivial ou se uma premissa importante
passou sem ser questionada.

---

## Fase 2: rebatidas cruzadas

Agora cada cargo **vê a posição dos outros** e responde:

```
┌─ REBATIDA: {CARGO} ─────────────────────────────────────────────────┐
│  CONCORDO COM:                                                      │
│  • {CARGO X} sobre {ponto}: {por quê}                               │
│                                                                     │
│  DISCORDO DE:                                                       │
│  • {CARGO Y} sobre {ponto}: {por quê + evidência própria}           │
│                                                                     │
│  PONTO CEGO QUE IDENTIFIQUEI:                                       │
│  • {CARGO Z} não considerou: {aspecto}                              │
│                                                                     │
│  MANTENHO MINHA POSIÇÃO? {Sim / Não / Parcialmente}                 │
│  {se mudou, explicar o que mudou de ideia}                          │
└─────────────────────────────────────────────────────────────────────┘
```

Rebatida sem citação não conta (Regra 7 de citação).

Ainda sem convergência? Rodada 3, **só sobre os pontos que divergem**. Depois disso,
circuit breaker: forçar síntese e documentar a divergência como aberta.

---

## Fase 3: síntese do debate

```
═══════════════════════════════════════════════════════════════════════
PONTOS DE CONSENSO (alta confiança para decidir)
═══════════════════════════════════════════════════════════════════════
• {ponto}

═══════════════════════════════════════════════════════════════════════
PONTOS DE DIVERGÊNCIA
═══════════════════════════════════════════════════════════════════════
┌─────────────────────────────────────────────────────────────────────┐
│ DIVERGÊNCIA 1: {tema}                                               │
│ Natureza: {dado / prioridade / prazo / risco}                        │
│ • {CARGO1} defende: {posição}                                       │
│ • {CARGO2} defende: {posição}                                       │
│ Impacto se não resolver: {consequência}                             │
└─────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════
TENSÕES PRODUTIVAS (não resolver, são features)
═══════════════════════════════════════════════════════════════════════
• {tensão}: {por que é saudável manter}

Exemplo clássico aqui: Criação querendo ambição visual x Operações lembrando
que a agência tem uma pessoa. Essa tensão é o que mantém a entrega no ar.

═══════════════════════════════════════════════════════════════════════
LACUNAS
═══════════════════════════════════════════════════════════════════════
• {informação que ninguém tinha e precisa ser buscada, com quem tem}
```

---

## Quando escalar para o Conselho completo

```
SE qualquer uma:
  • divergência não resolvida em tema crítico
  • confiança média dos cargos < 70%
  • decisão irreversível (publicar, mandar pro cliente, apagar trabalho)
  • valor/risco em jogo ALTO (ver DINAMICA-E-LIMITES.md)
  • cliente regulado com dúvida de compliance

ENTÃO sugerir: "recomendo /conselho para meta-avaliação"
```
