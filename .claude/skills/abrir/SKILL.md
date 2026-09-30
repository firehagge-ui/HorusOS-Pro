---
name: abrir
description: >
  Abre uma sessão de trabalho carregando a memória do negócio (empresa, preferências, estratégia, identidade)
  e devolve um resumo curto pro usuário. Use quando o usuário disser "abrir",
  "começar o dia", "/abrir" ou no primeiro turno de uma sessão depois do /instalar.
---

# /abrir — Abertura de sessão

Curto e direto. O objetivo é carregar contexto e devolver uma síntese de uma frase pra o usuário começar a trabalhar.

## Workflow

1. Ler, em ordem:
   - `_memoria/empresa.md`
   - `_memoria/preferencias.md`
   - `_memoria/estrategia.md`
   - `identidade/design-guide.md` (só pra saber se está preenchido ou em branco)

2. Se algum dos três primeiros estiver em branco (placeholder), responder:
   > "Vi que `_memoria/<arquivo>.md` ainda não foi preenchido. Quer rodar `/instalar` agora?"
   E parar.

3. Puxar as tarefas no Hounder (`mcp__hound-dog__hd_tarefas`, padrão = abertas). Separar
   **atrasadas** (prazo antes de hoje) e **de hoje**. É a cobrança combinada com o Marcelo
   em 27/09/2026: o plano de negócio (`_gestao/plano-de-negocio.md`) e as pendências da casa
   vivem na tela Tarefas do Hounder.

4. Se tudo estiver preenchido, devolver UMA mensagem curta no formato:

```
[Nome do negócio] — [o que faz em 5-8 palavras]
Foco atual: [prioridade da estratégia, em uma frase]
Atrasadas: [N] · [título da mais importante]   (omitir a linha se não houver)
Hoje: [até 3 títulos, os de prioridade alta primeiro]

Pronto. Começamos pela [tarefa mais importante]?
```

   Tarefa atrasada se resolve de três jeitos, e só de três: fazer, mudar o prazo com motivo
   ou cancelar com motivo. Não deixar passar em silêncio.

5. Não listar quais arquivos foram lidos. Não confirmar leitura. Só usar o contexto.

## Regras

- Resposta tem que caber em 7 linhas no terminal
- Não fazer perguntas além da de começar
- Se o MCP do Hounder não responder, dizer em uma linha que as tarefas não foram lidas (nunca inventar a lista)
- Se o `design-guide.md` estiver em branco, não mencionar — só vira problema quando alguma skill visual for chamada
