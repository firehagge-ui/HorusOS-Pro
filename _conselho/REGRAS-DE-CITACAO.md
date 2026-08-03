# Regras compartilhadas de citação

> Vale para **todo cargo** convocado ao debate e para os três agentes do Conselho.
> Adaptado do `SHARED-RULES.md` do mega-brain, trocando as fontes dele
> (DNA de especialista, dossiê) pelas fontes reais da Horus.

O Crítico Metodológico audita o cumprimento destas regras e aplica penalidade.

---

## Regra 1: citação com localização

Toda afirmação com DADO, NÚMERO ou REGRA precisa vir marcada:

```
^[ARQUIVO:SEÇÃO] "citação ou paráfrase"
```

### Certo ✅

```
^[clientes/dr-giovanni-nascimento/briefing.md:§11] "sem antes/depois no site,
CRO-BA 16772 e responsável técnico visíveis"

^[_memoria/estrategia.md:Prioridade principal] "a fundação do cliente #1 é o site"

^[_memoria/design/90-antipadroes.md:Hero] "hero genérico com stock photo denuncia
site feito por IA"

^[clientes/aion-psicologia/marca.md:Paleta] "verde-oliva #6B7A5E"
```

### Errado ❌

```
❌ ^[briefing] "o cliente quer mais agenda"
   → sem seção; qual briefing, qual parte?

❌ "Segundo o design guide, serifa passa autoridade"
   → sem citação formal rastreável

❌ "É sabido que site one-page converte mais"
   → sem fonte alguma
```

---

## Regra 2: quando não há fonte, declarar

| Situação | Marcação | Exemplo |
|---|---|---|
| Cálculo próprio | `📊 [ESTIMATIVA]` | `📊 [ESTIMATIVA] "3 dias de produção, baseado no site da Aion que levou 3"` |
| Opinião / hipótese | `⚠️ [SEM FONTE]` | `⚠️ [SEM FONTE] "acho que o público dele responde melhor a vídeo"` |
| Dado externo | `🌐 [FONTE EXTERNA]` | `🌐 [FONTE EXTERNA] "CPC médio de odonto em Salvador, Meta Ads"` |

Estimativa sem o raciocínio explicado é penalizada. Sempre dizer de onde saiu a conta.

---

## Regra 3: todo número tem marcação

Percentual, R$, prazo, quantidade: nenhum passa sem uma das marcações acima.

Exemplo correto numa posição de cargo:

```
• Prazo de produção: 3 a 4 dias
  📊 [ESTIMATIVA] Aion levou 3 dias para 4 páginas, este é escopo parecido

• Trava de publicação: dado que só o cliente tem
  ^[_memoria/estrategia.md:Cliente #3] "falta sala, horário, telefone ativo, CRP da PJ"

• Custo de imagem: ~2 créditos por peça
  ^[CLAUDE.md:Higgsfield] "nano_banana_pro, cerca de 2 créditos por imagem em 1k"
```

---

## Regra 4: hierarquia de fontes

Quando duas fontes brigam, vale esta ordem:

```
┌─────────────────────────────────────────────────────────────────────┐
│  1. DADO REAL DO CLIENTE          briefing.md, marca.md, o que o    │
│     (maior peso)                  cliente disse, print, dado de      │
│                                   plataforma                         │
│                                                                      │
│  2. TRAVA REGULATÓRIA             compliance do cliente, CFO/CFP,    │
│                                   LGPD (nunca cede, ver Constituição)│
│                                                                      │
│  3. MEMÓRIA DA AGÊNCIA            _memoria/empresa.md,               │
│                                   estrategia.md, preferencias.md,    │
│                                   _memoria/design/*                  │
│                                                                      │
│  4. TEARDOWN / REFERÊNCIA         referencias/*.md (site real        │
│                                   estudado)                          │
│                                                                      │
│  5. DOUTRINA DAS MENTES           _conselho/mentes/*.md              │
│                                   (Hormozi, Cole Gordon, Miner,      │
│                                   Haynes, G4, FSS, TSC)              │
│                                                                      │
│  6. ESTIMATIVA FUNDAMENTADA       cálculo com premissa explícita     │
│                                                                      │
│  7. OPINIÃO (menor peso)          marcada como tal                   │
└─────────────────────────────────────────────────────────────────────┘
```

**Por que a doutrina fica abaixo do teardown:** as mentes são material americano
de high ticket. Princípio delas vale muito; **número delas é benchmark
estrangeiro**, e perde para qualquer dado real do cliente ou site real estudado.
Ao citar número de mente, declarar a origem:

```
^[mentes/jeremy-haynes.md:Heurísticas] "50 a 80% de comparecimento com sequência
pré-call" 🌐 benchmark americano, não meta da Horus
```

Exceção: item 2 nunca é sobreposto pelo item 1. Cliente pedir algo vedado
não libera o vedado.

### Exemplo de conflito resolvido

```
CONFLITO: usar depoimento de paciente no site da Aion?

• ^[clientes/aion-psicologia/briefing.md:Diferenciais] cliente valoriza a
  relação de anos com pacientes
• ^[CLAUDE.md:Cliente #3] "depoimento de paciente em qualquer formato é vedado
  pelo CFP"

RESOLUÇÃO: trava regulatória (nível 2) vence dado do cliente (nível 1).
Sem depoimento. Autoridade vem por outro caminho: tempo de casa, CRP,
formação da equipe.
```

---

## Regra 5: penalidades

Aplicadas pelo Crítico Metodológico sobre o score de 0 a 100.

| Violação | Penalidade |
|---|---|
| Número sem nenhuma marcação | -5 |
| Fonte sem seção específica | -3 |
| "é sabido que" / "todo mundo sabe" sem fonte | -3 |
| Conflito de fontes não resolvido | -5 |
| Estimativa sem raciocínio explicado | -2 |
| Financeiro sem os 3 cenários | -10 |
| Advogado sem a simulação de 50% de falha | -10 |
| Sintetizador ignorou a alternativa do Advogado | -10 |
| Compliance não convocado em cliente regulado | **sessão inválida** |

**Threshold de revisão:** 15+ pontos de penalidade
**Threshold de rejeição:** 25+ pontos de penalidade
**Rastreabilidade mínima:** 70% das afirmações factuais com fonte

---

## Regra 6: template de posição do cargo

```
┌─────────────────────────────────────────────────────────────────────┐
│  [CARGO] - POSIÇÃO SOBRE: [tema]                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  RECOMENDAÇÃO: [uma frase clara]                                    │
│                                                                     │
│  EVIDÊNCIAS:                                                        │
│  • ^[ARQUIVO:SEÇÃO] "citação"                                       │
│  • ^[ARQUIVO:SEÇÃO] "citação"                                       │
│                                                                     │
│  ANÁLISE: [raciocínio ligando evidência à recomendação]             │
│                                                                     │
│  PREMISSAS DECLARADAS:                                              │
│  1. [premissa] - fonte: [X] ou [ESTIMATIVA]                         │
│  2. [premissa] - fonte: [Y] ou [SEM FONTE]                          │
│                                                                     │
│  RISCOS DA MINHA LENTE:                                             │
│  • [risco]                                                          │
│                                                                     │
│  COMO SE MEDE SUCESSO:                                              │
│  • [métrica]: [alvo]                                                │
│                                                                     │
│  CONFIANÇA: [0-100]%                                                │
│  O QUE EU NÃO SEI: [limitação honesta]                              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Regra 7: rebatida também cita

```
✅ "Discordo da Criação sobre refazer a home.
   ^[_memoria/estrategia.md:Cliente #3] diz que o site já tem 4 páginas prontas
   e o que trava é dado da cliente, não produção. Refazer gasta o único recurso
   escasso aqui, que é tempo."

❌ "Discordo da Criação. Refazer a home é perda de tempo."
   (opinião sem evidência)
```
