# Protocolo do Conselho

> **Versão:** 1.0 (adaptado do `CONCLAVE-PROTOCOL` / `COUNCIL-PROTOCOL` do mega-brain)
> **Gatilho:** `/conselho <pergunta>` ou decisão de alto risco
> **Entrada:** output completo do debate entre cargos (`PROTOCOLO-DEBATE.md`)
> **Saída:** decisão com confiança, riscos residuais e critério de reversão

---

## O que o Conselho é

O Conselho **não adiciona conhecimento de domínio**. Ele avalia a qualidade do
raciocínio dos cargos.

```
┌──────────────────────────────────┬──────────────────────────────────┐
│  CARGOS (camada 3)               │  CONSELHO (camada 4)             │
├──────────────────────────────────┼──────────────────────────────────┤
│  Têm contexto de domínio         │  NÃO têm contexto de domínio     │
│  Respondem "O QUE fazer"         │  Avaliam "COMO raciocinaram"     │
│                                  │                                  │
│  Estrategista sabe de oferta     │  Crítico avalia o processo       │
│  Financeiro sabe de margem       │  Advogado busca vulnerabilidade  │
│  Compliance sabe da trava        │  Sintetizador integra tudo       │
└──────────────────────────────────┴──────────────────────────────────┘
```

Isso é a regra que faz o sistema funcionar. Se o Crítico começar a opinar sobre
design, ele virou mais um cargo e o Conselho perdeu a função.

---

## Modos de contexto

Escolher no início da sessão. Cada cargo só pode ler o que o modo libera.

| Modo | Lê | Quando usar |
|---|---|---|
| `agencia` | `_memoria/*`, `CLAUDE.md`, `identidade/` | Decisão da Horus (preço, foco, processo, ferramenta) |
| `cliente:<nome>` | tudo de `agencia` + `clientes/<nome>/*` | Decisão sobre um cliente específico |
| `full` | tudo acima + `referencias/`, `dados/`, `saidas/` | Decisão estratégica que cruza clientes |

**`_conselho/mentes/` está disponível em todos os modos.** Doutrina não é contexto
de cliente nem da agência: é a base que os cargos citam, e cortá-la de um modo
deixaria a regra de citação impossível de cumprir. O que muda por modo é o que se
pode afirmar **sobre o negócio**, não de onde vem o raciocínio.

Regras do modo:
- Se um cargo precisar de algo fora do modo, ele **declara**: "sem acesso a [X] neste
  modo, recomendo rodar em `full`". Nunca inventa o que não leu
- Modo `cliente:` **obriga** leitura de `briefing.md` e `marca.md` do cliente
- Cliente regulado no modo `cliente:` **convoca Compliance automaticamente**

Todo output do Conselho fecha com o rodapé de contexto (ver Fase 5).

---

## As 6 fases

### FASE 0: fundamento constitucional

Antes de qualquer cargo falar, exibir a Constituição:

```
┌─────────────────────────────────────────────────────────────────────┐
│  📜 CONSTITUIÇÃO INVOCADA                                           │
├─────────────────────────────────────────────────────────────────────┤
│  ⚖️  EMPIRISMO        → citar FONTE e NÚMERO                        │
│  📊 PARETO (80/20)    → qual ação tem maior alavancagem?            │
│  🔄 INVERSÃO          → o que faria isso FALHAR?                    │
│  💪 ANTIFRAGILIDADE   → qual opção fica mais forte sob estresse?    │
│  🔒 COMPLIANCE        → cláusula pétrea, veto trava a decisão       │
├─────────────────────────────────────────────────────────────────────┤
│  HIERARQUIA: CONSTITUIÇÃO > PROTOCOLOS > INSTRUÇÃO DO CARGO         │
└─────────────────────────────────────────────────────────────────────┘
```

Junto, declarar o cabeçalho da sessão: pergunta, data, modo, cargos convocados,
valor/risco em jogo (ver `DINAMICA-E-LIMITES.md`).

---

### FASE 1: debate entre cargos

Roda o `PROTOCOLO-DEBATE.md` completo: posições em paralelo, rebatidas cruzadas,
síntese com consensos, divergências, tensões produtivas e lacunas.

Saída dessa fase é a entrada das próximas.

---

### FASE 2: Crítico Metodológico avalia

Carregar `conselho/critico-metodologico.md`. Ele produz:

```
SCORE DE QUALIDADE: {0-100}/100

• Premissas declaradas:    {0-20}/20
• Evidências rastreáveis:  {0-20}/20
• Lógica consistente:      {0-20}/20
• Cenários alternativos:   {0-20}/20
• Conflitos resolvidos:    {0-20}/20

AUDITORIA DE FONTES: taxa de rastreabilidade {X}%
GAPS CRÍTICOS: [lista]
VIOLAÇÕES CONSTITUCIONAIS: [lista ou "nenhuma"]
RECOMENDAÇÃO: APROVAR / REVISAR / REJEITAR
```

Se rastreabilidade < 70%, a sessão **pausa** até os cargos buscarem fonte.

---

### FASE 3: Advogado do Diabo ataca

Carregar `conselho/advogado-do-diabo.md`. Seis perguntas obrigatórias:

1. Premissa mais frágil
2. Risco que ninguém discutiu
3. Cenário de arrependimento em 12 meses
4. Alternativa ignorada
5. Simulação de 50% de falha
6. Como validar barato antes de investir pesado

Função dele é **atacar**, não confirmar. Se não achou falha, não procurou o suficiente.

---

### FASE 4: Sintetizador integra

Carregar `conselho/sintetizador.md`. Ele considera consenso do debate, divergência
não resolvida, gap do Crítico e vulnerabilidade do Advogado, e entrega:

- Decisão recomendada, clara e acionável
- Modificações incorporadas (com autoria: quem sugeriu)
- Comparação formal de alternativas, se o Advogado levantou alguma
- Confiança de 0 a 100% com justificativa por dimensão
- Riscos residuais com mitigação
- Próximos passos com responsável e prazo
- Critérios de reversão

O Sintetizador **integra, não faz média**. Ele escolhe caminho e justifica.

---

### FASE 5: threshold de confiança

```
┌───────────────┬───────────────────────────────────────────────────┐
│  ≥ 70%        │  EMITIR DECISÃO FINAL                             │
│  50 a 69%     │  EMITIR COM RESSALVAS (marcar "confiança média")  │
│  < 50%        │  NÃO EMITIR. Escalar para o Marcelo com opções    │
└───────────────┴───────────────────────────────────────────────────┘
```

Fallback abaixo de 50%: apresentar 2 ou 3 opções com trade-off, quem defendeu
cada uma e o que falta saber. O Conselho **não recomenda nenhuma** nesse caso.

Todo output fecha com:

```
┌─────────────────────────────────────────────────────────────────────┐
│  CONTEXTO UTILIZADO                                                 │
├─────────────────────────────────────────────────────────────────────┤
│  Modo:        {agencia | cliente:<nome> | full}                     │
│  Agência:     {SIM/NÃO} - {N arquivos}                              │
│  Cliente:     {SIM/NÃO} - {N arquivos}                              │
│  Referências: {SIM/NÃO} - {N arquivos}                              │
│  Dado real:   {SIM/NÃO} - {quais}                                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Regras invioláveis

```
1. CONSELHO NÃO TEM CONHECIMENTO DE DOMÍNIO
   Crítico, Advogado e Sintetizador avaliam processo, não mérito

2. CRÍTICO AVALIA O COMO
   Não diz se a decisão está certa; diz se o raciocínio foi robusto

3. ADVOGADO NÃO CONFIRMA
   Função é atacar. Não equilibra crítica com elogio

4. SINTETIZADOR INTEGRA, NÃO MEDIA
   Escolhe caminho e justifica

5. UMA PASSAGEM POR PERGUNTA
   Se confiança < 50%, escala para o Marcelo. NÃO re-roda a sessão

6. COMPLIANCE VETA
   Veto de compliance não é ponderado, ele trava a decisão

7. TRANSPARÊNCIA TOTAL
   Mostrar o raciocínio, não esconder divergência, não inflar confiança
```
