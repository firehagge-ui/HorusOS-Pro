---
name: debate
description: Debate estruturado entre cargos da agência (estrategista, criação, mídia, financeiro, operações, compliance) sobre uma decisão, com consensos e divergências explícitas. Versão leve do Conselho, sem Crítico, Advogado e Sintetizador. Use quando o Marcelo disser "/debate", "quero ver os dois lados disso", "prós e contras de verdade", ou quando duas lentes da agência puxarem para lados opostos.
---

# Debate entre cargos

Fase 1 do Conselho rodando sozinha. Serve quando a pergunta tem lados legítimos
mas não justifica a sessão completa.

Protocolo em `_conselho/PROTOCOLO-DEBATE.md`. Regras de fonte em
`_conselho/REGRAS-DE-CITACAO.md`.

## Uso

```
/debate <pergunta>
/debate estrategista,financeiro "vale fazer o site da Aion antes do sim dela?"
```

Se o Marcelo não escolher os cargos, escolher pela tabela de convocação do
protocolo e **dizer quais foram escolhidos e por quê** antes de começar.

## Como rodar

1. Definir modo (`agencia` / `cliente:<nome>` / `full`) e ler o que ele libera
2. Escolher de 2 a 4 cargos que realmente divergem entre si. Cliente regulado
   convoca **Compliance obrigatoriamente**
3. **Rodada 1:** cada cargo escreve a posição sem ver a dos outros, com voz própria,
   evidência citada, premissa declarada e confiança. Antes de escrever, cada um lê a
   doutrina que puxa em `_conselho/mentes/` (tabela no protocolo). Número de mente
   vai marcado com 🌐: é benchmark estrangeiro, não meta da Horus
4. **Checkpoint:** convergência de 70% ou mais? Pular para a síntese
5. **Rodada 2:** rebatidas cruzadas. Cada cargo vê os outros, concorda, discorda com
   evidência, aponta ponto cego e diz se mantém a posição
6. **Rodada 3** (só se ainda divergir): apenas sobre os pontos em aberto
7. **Síntese:** consensos, divergências, tensões produtivas, lacunas

Máximo de 3 rodadas. Cargo que repete a mesma posição sem evidência nova aciona
o circuit breaker.

## O que o debate entrega

Não entrega decisão final. Entrega o mapa do problema: o que é consenso, onde
está a briga real, o que é tensão saudável e qual informação falta.

Ao final, avaliar se escala:

```
SE divergência crítica não resolvida
OU confiança média < 70%
OU decisão irreversível (publicar, mandar pro cliente)
OU risco ALTO na escala de _conselho/DINAMICA-E-LIMITES.md
ENTÃO sugerir: "recomendo /conselho para meta-avaliação"
```

## Regras

- Cada cargo defende **a lente dele**, não o consenso. Divergência explícita vale
  mais que concordância artificial
- Rebatida sem citação não conta
- Voz de cada cargo vem do arquivo em `_conselho/cargos/`. Não homogeneizar
- Interpretar os papéis na própria conversa, sem abrir subagente, a menos que o
  Marcelo peça
- Debate não gera log obrigatório. Se a conclusão for relevante, perguntar se
  vira linha na memória
