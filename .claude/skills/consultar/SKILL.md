---
name: consultar
description: Consulta uma mente específica (Hormozi, Cole Gordon, Jeremy Miner, Jeremy Haynes, G4 Educação, Full Sales System, The Scalable Company, Pedro Sobral, Chris Voss, Robert Cialdini, Neil Rackham/SPIN, Rob Fitzpatrick/Mom Test) ou um cargo da agência sobre uma pergunta, aplicando a doutrina dele com citação rastreável. Use quando o Marcelo disser "/consultar", "/ask", "o que o Hormozi diria sobre isso", "como o Voss responderia essa objeção", "monta a R1 no SPIN", "pergunta pro gestor de tráfego", ou quiser a lente de um especialista sem rodar o Conselho inteiro. Use também, sem esperar o pedido, quando a tarefa for objeção, negociação, pauta de reunião ou oferta e a mente certa tiver a resposta.
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

Aceita apelido: `hormozi`, `cole`, `miner`, `haynes`, `g4`, `fss`, `tsc`, `sobral`,
`voss`, `cialdini`, `spin` (ou `rackham`), `momtest` (ou `fitzpatrick`), e os
cargos `estrategista`, `criacao`, `midia`, `financeiro`, `operacoes`, `compliance`.

Se o Marcelo não disser quem, escolher pelo domínio da pergunta e **avisar qual
foi escolhida e por quê** antes de responder. Atalho por assunto:

| Assunto | Mente |
|---|---|
| Oferta, preço, garantia, isca, abordagem fria, sequência de ofertas | hormozi |
| Objeção na ligação, "vou pensar", "vou ver com o sócio", pitch | cole, voss |
| Negociação de valor, lead que sumiu depois de se interessar | voss |
| Pauta e perguntas da R1 | spin, momtest, miner |
| Mensagem, proposta, página: por que convence (ou não) | cialdini |
| Validar nicho ou oferta nova antes de investir | momtest, hormozi |
| Anúncio, funil, comparecimento | haynes, sobral |

## Como responder

1. Ler o cartão da mente (`_conselho/mentes/<mente>.md`) ou do cargo, inteiro
1b. **Ir na fonte.** O cartão é resumo; a doutrina completa está em
   `_conselho/mentes/fontes/<mente>/` (ver o bloco "Fonte completa" no fim de cada
   cartão e `fontes/README.md`). Buscar a parte do assunto com Grep (pelo título,
   pelo código tipo `FW-CG-001`, ou por palavra-chave) e ler só o trecho. Citar a
   fonte: `^[fontes/cole-gordon/mega-brain/AGENT.md:FW-CG-001]`. As fontes da
   wondelai e do founder-playbook estão em inglês: responder em português
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
