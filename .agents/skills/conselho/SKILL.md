---
name: conselho
description: Sessão completa do Conselho sobre uma decisão difícil (constituição + debate entre cargos + Crítico Metodológico + Advogado do Diabo + Sintetizador). Use quando o Marcelo disser "/conselho", "chama o conselho", "passa isso pelo conselho", ou quando houver decisão de alto risco, irreversível, com divergência real ou que envolva compliance de cliente regulado.
---

# O Conselho

Deliberação estruturada para decisão que merece mais que uma opinião rápida.
Adaptado do `/conclave` do mega-brain para a operação da Horus.

Sistema completo em `_conselho/`. Este arquivo é o roteiro de execução.

## Quando NÃO usar

Antes de qualquer coisa, checar se a pergunta merece o rito:

- A resposta já está escrita em algum arquivo do repositório → é consulta, responder
- É execução ("gera o carrossel", "conserta o CSS") → fazer, não deliberar
- É gosto do Marcelo → ele decide
- Risco BAIXO na escala de `_conselho/DINAMICA-E-LIMITES.md` → decidir e seguir
- Divergência pequena entre 2 lentes → usar `/debate`, que é mais leve

Rito aplicado a pergunta trivial vira teatro. Se a síntese vai dizer o que
qualquer um diria em uma frase, dizer a frase.

## Antes de começar

1. Ler `_conselho/CONSTITUICAO.md`, `PROTOCOLO-CONSELHO.md`, `PROTOCOLO-DEBATE.md`,
   `REGRAS-DE-CITACAO.md` e `DINAMICA-E-LIMITES.md`
2. Definir **modo** (`agencia`, `cliente:<nome>`, `full`) e ler o que ele libera
3. Classificar o **risco** (BAIXO / MÉDIO / ALTO / CRÍTICO)
4. Escolher os **cargos** (2 a 4) pela tabela de convocação do `PROTOCOLO-DEBATE.md`.
   Cliente regulado convoca **Compliance obrigatoriamente**
5. Se faltar informação que muda tudo, perguntar ao Marcelo **antes** de rodar,
   não no meio

## Execução

Rodar as 6 fases do `PROTOCOLO-CONSELHO.md`, na ordem, sem pular:

| Fase | O que acontece | Arquivo |
|---|---|---|
| 0 | Invocar a Constituição e declarar o cabeçalho da sessão | `CONSTITUICAO.md` |
| 1 | Debate entre cargos: posições, rebatidas, síntese | `PROTOCOLO-DEBATE.md` + `cargos/*.md` + `mentes/*.md` |
| 2 | Crítico Metodológico dá score de 0 a 100 e audita fontes | `conselho/critico-metodologico.md` |
| 3 | Advogado do Diabo ataca com as 6 perguntas | `conselho/advogado-do-diabo.md` |
| 4 | Sintetizador integra em decisão acionável | `conselho/sintetizador.md` |
| 5 | Threshold de confiança e rodapé de contexto | `PROTOCOLO-CONSELHO.md` |

Cada cargo e cada membro do Conselho é interpretado com a **voz do arquivo dele**,
falando em primeira pessoa. Se todo mundo escrever igual, o debate não aconteceu e
a sessão não vale nada.

Interpretar os papéis na própria conversa. Não abrir subagente, a menos que o
Marcelo peça.

## Regras que não se negociam

1. O Conselho (Crítico, Advogado, Sintetizador) **não opina sobre o tema**. Avalia
   como os cargos raciocinaram
2. Todo número e toda afirmação factual vem com fonte no formato
   `^[ARQUIVO:SEÇÃO]`. Rastreabilidade abaixo de 70% **pausa a sessão**. Cada cargo
   puxa a doutrina dele em `_conselho/mentes/` (disponível em qualquer modo), e
   número de mente vai marcado com 🌐 como benchmark estrangeiro, nunca como meta
3. Veto de Compliance trava a decisão. Não é ponderado
4. Confiança abaixo de 50% → **não emitir decisão**, escalar para o Marcelo com
   2 ou 3 opções e sem recomendação
5. Uma passagem por pergunta. Não re-rodar a sessão em busca de resposta melhor
6. Máximo de 3 rodadas de debate. Depois disso, sintetizar com a divergência aberta
   documentada como aberta

## Ao final

1. Gravar o log em `_conselho/logs/AAAA-MM-DD-<assunto>.md` usando
   `_conselho/templates/LOG-CONSELHO.md`
2. Se a decisão mudar prioridade, processo ou contexto de cliente, perguntar:
   *"Isso mudou teu contexto. Quer que eu atualize a memória?"*
3. Fechar com o resumo curto: decisão, confiança, próximo passo. O Marcelo lê o
   resumo; o log fica para quando precisar do porquê
