---
name: atualizar
description: >
  Coordenador de manutenção da memória do Horus OS. Varre o workspace, reconcilia os
  arquivos de contexto e de conhecimento com o estado real, detecta contradição e fato
  vencido, e promove aprendizado que ficou preso na pasta de um cliente. Use quando o
  usuário disser "atualiza", "/atualizar", "varre o projeto", "reconcilia a memória",
  ou pedir uma revisão geral do contexto.
---

# /atualizar — Manutenção da memória

O Horus OS aprende gravando em arquivo. Com o tempo, o que está gravado descola do
que é real: um cliente novo entra e não é listado, uma decisão muda e o arquivo antigo
continua afirmando o contrário, um aprendizado nasce na pasta de um cliente e nunca
sobe para a agência. Esta skill é a passada que reconcilia tudo isso.

Não é a mesma coisa que `/abrir` (que só carrega o contexto) nem que `/verificar`
(que confere uma entrega). Esta é a única varredura que **mantém a memória coerente**.

> Regra de ouro: **propor, nunca reescrever sozinho.** Toda mudança passa pelo Marcelo
> com o diff à vista. Cirurgia na linha relevante, nunca reformatar o arquivo inteiro.

## As superfícies de memória

Varrer todas, não só as três de contexto:

- **Contexto do negócio:** `_memoria/empresa.md`, `_memoria/preferencias.md`,
  `_memoria/estrategia.md`, `identidade/design-guide.md`, `identidade/catalogo-estilos.md`
- **Conhecimento de produção:** `_memoria/design/` (anatomia, antipadrões, checklist,
  onde estudar), `_memoria/conteudo/` (formatos, legibilidade, antipadrões, checklist),
  `_memoria/integridade.md`
- **Acervo de estudo:** `referencias/README.md` e os teardowns
- **Regras da casa:** `CLAUDE.md` da raiz, os `CLAUDE.md` de cada cliente, o `site/`
- **Configuração viva:** `.impeccable/config.json` (exceções do detector, cada uma com motivo)

## Workflow

### Passo 1 — Levantamento

Listar o estado real:
- Subpastas em `clientes/` — cada uma é um cliente. Bate com a lista de `empresa.md`?
- Skills em `.claude/skills/` — quais existem hoje. Bate com o que o `CLAUDE.md` e o
  `README.md` descrevem?
- Arquivos recentes (últimos ~30 dias) nas pastas de cliente e em `site/`, `referencias/`
- Datas: hoje é a referência para julgar prazo vencido e status parado

### Passo 2 — Reconciliação (o arquivo bate com o real?)

Para cada superfície, achar o que descolou:
- **`empresa.md` / `estrategia.md`:** clientes, serviços, ferramentas e foco batem com
  o workspace? Prioridade e prazos ainda fazem sentido na data de hoje?
- **`CLAUDE.md` (raiz e cliente):** a estrutura de pastas descrita existe? As regras de
  organização batem com onde as coisas realmente estão?
- **`_memoria/design/` e `_memoria/conteudo/`:** o que está escrito bate com o que as
  últimas peças fizeram? O placar do detector (dono único em `_memoria/design/README.md`)
  está com o número real?
- **`referencias/README.md`:** os teardowns listados existem? A fila de estudo mudou?

### Passo 3 — Contradição e fato vencido

Duas varreduras que a versão antiga não fazia, e são o que mais protege a memória:

1. **Contradição.** O mesmo fato afirmado de formas diferentes em dois lugares (versão de
   ferramenta, número de placar, status de cliente, decisão de escopo). Marcar os dois
   pontos e apontar qual é o verdadeiro, com evidência.
2. **Fato vencido.** Data que já passou tratada como futura ("apresentar em X"), status
   que não bate mais ("site pronto" quando houve rodada nova), decisão revogada que o
   arquivo antigo ainda afirma. O correto é **marcar como histórico com a data**, não
   apagar: a decisão anterior é contexto. Só apagar o que é comprovadamente errado
   (mal-entendido, número trocado).

### Passo 4 — Promoção (o aprendizado subiu?)

O ponto onde o sistema mais vaza. Aprendizado que nasce na pasta de um cliente e vale
para **qualquer** cliente tem que subir para a agência, senão morre no diário daquele
cliente e volta como erro no próximo.

Varrer os `CLAUDE.md` de cliente e os logs de rodada procurando regra generalizável, e
propor o destino:
- Correção de **design** que vale para todo site → `_memoria/design/90-antipadroes.md`
  (com o porquê e a origem datada)
- Padrão de **carrossel/post** → `_memoria/conteudo/90-antipadroes.md`
- Regra de **como interpretar o pedido do Marcelo** ou de processo → `CLAUDE.md` da raiz
  ou `_memoria/preferencias.md`
- Estrutura de site aprendida de referência → `_memoria/design/00-anatomia.md`

Exemplo real: "quando o pedido é 'acrescentar à extensão', não refazer a seção inteira"
nasceu no Grão da Serra e vale para todo cliente. Sobe para `preferencias.md` ou `CLAUDE.md`.

### Passo 5 — Proposta e aplicação

Apresentar uma lista curta, agrupada por tipo:

```
Encontrei [N] coisas pra reconciliar:

RECONCILIAÇÃO
1. empresa.md — falta o cliente "Acme" (pasta clientes/acme/ criada em [data])

CONTRADIÇÃO
2. design/README.md diz "X" e CLAUDE.md diz "Y" sobre [tema]. O certo é Y porque [evidência]

FATO VENCIDO
3. estrategia.md fala em "apresentar em [data passada]" — já passou; marcar como histórico

PROMOÇÃO
4. grao-da-serra/CLAUDE.md tem uma regra que vale pra todo cliente: [regra]. Subir pra [destino]

Quer que eu aplique? Todas, algumas, ou nenhuma.
```

Se aprovado, editar com cirurgia e mostrar o diff de cada mudança.

## Regras

- **Não inventar fato** — só registrar o que tem evidência no workspace
- Evidência ambígua (pasta vazia "Cliente Novo") → **perguntar antes**, nunca adicionar por conta
- **Não apagar conteúdo** de contexto: reconciliar, marcar histórico com data, e só apagar
  o que for comprovadamente errado (mal-entendido, número trocado)
- **Placar do detector tem dono único** (`_memoria/design/README.md`). Se achar o número
  repetido em outro arquivo, a correção é apontar pra lá, não duplicar
- Se nada precisar mudar: "Tá tudo coerente, nada pra reconciliar"
- Esta skill não roda o detector nem confere entrega — isso é `/verificar`
