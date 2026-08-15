---
name: consultar
description: Consulta uma mente específica (Hormozi, Cole Gordon, Jeremy Miner, Jeremy Haynes, G4 Educação, Full Sales System, The Scalable Company) ou um cargo da agência sobre uma pergunta, aplicando a doutrina dele com citação rastreável. Use quando o Marcelo disser "/consultar", "/ask", "o que o Hormozi diria sobre isso", "pergunta pro gestor de tráfego", ou quiser a lente de um especialista sem rodar o Conselho inteiro.
---

# Consultar

Uma pergunta, uma mente. É a consulta leve: sem debate, sem Conselho, sem síntese.

Mentes em `_conselho/mentes/`. Cargos em `_conselho/cargos/`.

## Uso

```
/consultar hormozi "como precificar a Máquina como oferta única?"
/consultar haynes "o funil da clínica deve ter formulário antes ou depois?"
/consultar compliance "posso usar essa frase no site da Aion?"
```

Aceita apelido: `hormozi`, `cole`, `miner`, `haynes`, `g4`, `fss`, `tsc`, e os
cargos `estrategista`, `criacao`, `midia`, `financeiro`, `operacoes`, `compliance`.

Se o Marcelo não disser quem, escolher pelo domínio da pergunta e **avisar qual
foi escolhida e por quê** antes de responder.

## Como responder

1. Ler o arquivo da mente ou do cargo, inteiro
2. Ler o contexto que a pergunta exige: `_memoria/` sempre, `clientes/<nome>/` se
   for sobre um cliente
3. Responder **na voz daquela mente**, em primeira pessoa, usando o vocabulário
   dela. Hormozi fala em unit economics, Miner faz pergunta, Cole fala em crença
4. Toda afirmação com número ou regra vem citada:
   `^[mentes/alex-hormozi.md:Heurísticas]`
5. Fechar com o bloco de calibração (abaixo)

## Bloco de calibração (obrigatório em mente estrangeira)

```
┌─────────────────────────────────────────────────────────────────────┐
│  CALIBRAÇÃO                                                         │
│  Origem do número: {americano / brasileiro / estimativa}            │
│  Sobrevive ao contexto daqui? {sim / com ajuste / não}              │
│  Trava de compliance no caminho? {qual, ou nenhuma}                 │
└─────────────────────────────────────────────────────────────────────┘
```

Existe porque a doutrina é de operação americana de high ticket e a Horus atende
negócio local em Salvador. Número que não sobrevive à tradução deve ser dito como
referência, nunca como meta. Ver `_conselho/mentes/full-sales-system.md`, que é a
mente encarregada justamente de contestar benchmark importado.

## Regras

- **Nunca inventar doutrina.** Se a resposta não está no arquivo da mente, dizer:
  "isso não está no que eu tenho dele". Preencher lacuna com invenção destrói o
  valor do sistema inteiro
- Separar o que é doutrina citada do que é aplicação sua ao caso. A doutrina vem
  com `^[fonte]`, a aplicação vem marcada como recomendação
- **Compliance vence a mente.** Tática de urgência, escassez, depoimento ou
  promessa não passa em cliente regulado, por mais canônica que seja
- Se a pergunta for grande demais para uma lente só, sugerir `/comparar` ou
  `/conselho` em vez de fingir que uma mente resolve
