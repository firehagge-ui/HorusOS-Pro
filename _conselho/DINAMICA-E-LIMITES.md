# Dinâmica e limites

> **Versão:** 1.0 (adaptado do `DEBATE-DYNAMICS-PROTOCOL` do mega-brain)
> Aqui ficam os parâmetros que impedem o Conselho de virar loop infinito ou
> teatro caro. Os números do sistema original eram de uma empresa com R$500K por
> decisão. Estes são calibrados para a Horus.

---

## Escala de risco (substitui os thresholds em R$ do original)

| Nível | O que caracteriza | Rito |
|---|---|---|
| **BAIXO** | Reversível em minutos, sem custo externo, não sai da agência | Não precisa de Conselho. Decidir e seguir |
| **MÉDIO** | Até ~1 semana de trabalho, custo de ferramenta, muda o rumo de uma entrega | `/debate` com 2 ou 3 cargos |
| **ALTO** | Sai para o mundo (publicar, mandar pro cliente, anunciar), cliente inteiro em risco, retrabalho de semanas, dinheiro do cliente | `/conselho` completo |
| **CRÍTICO** | Toca compliance de setor regulado, contrato, reputação da agência, ou é irreversível | `/conselho` completo + veto de Compliance + decisão final do Marcelo |

**Regra do hedge:** em risco ALTO ou CRÍTICO, o Sintetizador é obrigado a
documentar Plano A, Plano B e o gatilho de troca. Em MÉDIO, é opcional.

### Valor em R$: sempre relativo ao contrato daquele cliente

O sistema original fixava R$500K como corte. Aqui não existe número absoluto,
porque o ticket varia com o negócio, o serviço e o nível de trabalho (decisão do
Marcelo, 26/07/2026). A régua é **proporção**:

| Proporção | Nível |
|---|---|
| Até ~10% do valor do contrato daquele cliente | BAIXO a MÉDIO |
| Entre 10 e 50% do contrato | ALTO |
| Acima de 50%, ou o contrato inteiro em jogo | CRÍTICO |
| Verba de mídia do cliente, qualquer valor | mínimo ALTO (é dinheiro de terceiro) |

Quando o contrato ainda não existe (projeto especulativo, como a Aion), o valor em
jogo é **o tempo já investido mais o tempo que falta**, medido em dias de trabalho.
Especulativo não é de graça: é pago em hora que não volta
^[mentes/alex-hormozi.md:Como isso aterrissa na Horus].

---

## Limites de sessão

| Parâmetro | Valor | O que fazer ao estourar |
|---|---|---|
| Rodadas de debate | 3 | Forçar síntese, documentar divergência como aberta |
| Passagens pelo Conselho | 1 por pergunta | Não re-rodar. Escalar para o Marcelo |
| Cargos por debate | 2 a 4 | Acima disso o sinal vira ruído |
| Leituras de arquivo por cargo | ~5 | Se precisa de mais, o modo está errado |
| Loop detectado | 2x a mesma posição sem evidência nova | Parar, marcar como divergência irreconciliável |

### Circuit breaker

Dispara quando:
- Um cargo repete a mesma posição sem trazer evidência nova
- Dois cargos ficam presos em "concordo/discordo" sem citação
- A pergunta muda de escopo no meio da sessão

Ação: encerrar a fase, documentar o estado e ir para a síntese com o que existe.
Sessão truncada e honesta vale mais que sessão completa e inventada.

### Impasse

Quando as posições **estabilizam sem convergir** (duas rodadas seguidas dizendo o
mesmo, com a mesma confiança), não é divergência produtiva, é impasse:

```
1. Parar imediatamente. Não rodar mais rodada
2. Gerar a síntese com o estado atual
3. Declarar: "IMPASSE — as posições estabilizaram sem convergência"
4. Marcar a sessão com a flag IMPASSE
5. O Sintetizador decide: emitir com ressalva, ou escalar pro Marcelo
```

Rodada adicional depois de estabilizar não produz informação nova, só texto.

### Sem busca externa durante a sessão

O Conselho delibera com o que a agência tem escrito. **Não sair pesquisando na web
no meio do debate.** Falta de informação vira **lacuna registrada** na síntese,
com quem tem o dado e como obter.

Motivo: pesquisa no meio da sessão desloca o debate pra coleta e produz achado sem
o mesmo rigor de fonte do resto. Se a lacuna for decisiva, o certo é parar,
buscar (Firecrawl, `/estudar-site`, ou perguntar ao cliente) e rodar de novo com
o dado na mão.

---

## Anti-teatro

O Conselho custa tempo e contexto. Não invocar quando:

- A resposta está escrita em algum arquivo do repositório (é consulta, não decisão)
- A tarefa é execução pura ("gera o carrossel", "conserta o CSS")
- É preferência de gosto do Marcelo (ele decide, não o Conselho)
- É pergunta simples com uma resposta óbvia

Sinal de que virou teatro: a síntese diz o que qualquer um diria em uma frase.
Nesse caso, dizer a frase e pular o rito.

---

## Escalação para humano

O Conselho escala para o Marcelo quando:

1. Confiança final < 50%
2. Compliance vetou e existe pressão comercial do outro lado
3. A decisão depende de dado que só o cliente tem
4. Duas opções empatam em mérito e a escolha é de gosto ou apetite a risco

Formato da escalação: 2 ou 3 opções, trade-off de cada uma, quem defendeu, o que
falta saber para desempatar. **Sem recomendação.** Escalar é passar a decisão,
não empurrar uma resposta com verniz de dúvida.

---

## Registro

Toda sessão de `/conselho` gera log em `_conselho/logs/AAAA-MM-DD-<assunto>.md`,
no formato de `_conselho/templates/LOG-CONSELHO.md`.

Motivo: decisão que morre no chat volta como pergunta na semana seguinte. O log
é o que faz o Conselho acumular, em vez de recomeçar do zero toda vez.

O log guarda a decisão **e a divergência**. Quando a decisão der errado, o valor
está em ver quem tinha avisado.
