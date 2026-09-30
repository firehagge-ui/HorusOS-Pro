# Prospecção — o método da casa, em arquivo

> Criada em 29/09/2026, depois do benchmarking de 12 repositórios de cold outreach e AI SDR
> (o que entrou e o que ficou de fora está em `91-o-que-veio-do-benchmark.md`). Mesmo molde de
> `_memoria/design/` e `_memoria/conteudo/`: doutrina que se lê antes de escrever, checklist que
> se roda antes de entregar, e correção do Marcelo que vira linha com o porquê.

## A doutrina base continua onde estava

Esta pasta **não substitui** os cards do network. A base é:

- `_conhecimento/network/abordagem-e-prospeccao.md` §8 a §12: anatomia da mensagem, as cinco regras
  de validação, as três classes de informação, o jeito de falar, o jeito de escrever do Marcelo
  (29/09) e os dez passos à frente.
- `_conhecimento/network/cold-message-processo.md`: abrir, qualificar, agendar; o que não passa.
- `_memoria/integridade.md`: nada inventado, dado que falta vira `[FALTA: ...]`.

O que mora aqui é o que veio **por cima**: como achar o sinal, como escrever a oferta nas palavras
do lead, como não repetir o lote, e o circuito de aprendizado.

## Ordem de leitura antes de escrever mensagem

1. `10-sinais.md` — biblioteca de sinais do negócio local: onde conferir, o que costuma querer
   dizer, qual serviço do catálogo resolve, e o "por que agora" do calendário de cada segmento.
2. `20-escrita.md` — os princípios novos (oferta nas palavras dele, teste da remoção, ângulo preso
   ao catálogo, variação no lote, a recepção que atende).
3. `exemplos.md` — mensagens **escritas ou aprovadas pelo Marcelo**, com o que aconteceu depois.
   É o padrão de voz. A IA nunca escreve exemplo pra esse arquivo.
4. `voz-marcelo.md` — como o Marcelo escreve de verdade, tirado das mensagens que ele mandou.
5. `aprendizados.md` — o que as respostas reais e as edições do Marcelo ensinaram. Lê inteiro:
   é curto de propósito.

## Antes de entregar

- `99-checklist.md` — vetos, nota de 0 a 50 e a checagem do lote.
- `90-cara-de-ia.md` — os vícios de texto de IA em português de WhatsApp.
- O revisor mecânico (`ferramentas/hound-dog/app/js/revisor.js`) roda sozinho no Disparos, no MCP
  e no Farejador. O que ele pega não precisa de julgamento; o resto da checklist precisa.
- Skill `/revisar-mensagem` quando o Marcelo colar uma mensagem pra revisar.

## O circuito de aprendizado

```
Claude escreve → revisor mecânico → Marcelo edita/escolhe no Disparos → envio → resposta real
      ↑                                                                              │
      └──── aprendizados.md ← scripts/aprender.mjs (edições, escolhas, respostas) ←──┘
```

`node ferramentas/hound-dog/scripts/aprender.mjs` lista o que o Marcelo mudou em cada texto
(o banco guarda o original desde 29/09), qual variante ele escolheu e quem respondeu. Padrão
que aparece duas vezes vira linha em `aprendizados.md`, e regra que se firma sobe pra doutrina.
