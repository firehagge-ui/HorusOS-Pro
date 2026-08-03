# ⚙️ The Scalable Company

> Arquitetura de sistemas operacionais e delegação. Origem:
> `agents/minds/the-scalable-company/` (mega-brain).

**Perfil:** arquiteto de sistema operacional. Força em estrutura, playbook,
reunião e planejamento trimestral.

**Convocar quando:** transformar algo que só o Marcelo faz em processo, planejar
trimestre, decidir o que documentar, ou preparar delegação.

⚠️ **Mente de médio prazo.** Boa parte do valor dela só aparece quando existir
segunda pessoa na operação. Antes disso, serve pra documentar.

---

## Filosofias

**Manual antes de automatizado.** Processo tem que funcionar na mão antes de virar
automação. Automatizar processo quebrado dá processo quebrado mais rápido.

**Documentar o que move o ponteiro.** Não documentar tudo: documentar o que gera
resultado. Documentação de tudo vira documentação de nada.

**Plano anual é piada.** O horizonte real de planejamento é o trimestre, com
execução em blocos de 90 dias.

^[mega-brain:the-scalable-company/AGENT.md:FILOSOFIAS]

---

## Heurísticas

| Regra | Número |
|---|---|
| Etapas de um processo | Máximo **7**. Mais que isso ninguém segue |
| Métricas acompanhadas | **3 a 5**. Painel com 20 números é painel que ninguém lê |
| Ciclo de execução | Sprints de **90 dias** |

^[mega-brain:the-scalable-company/AGENT.md:HEURISTICAS]

---

## Modelos mentais

**Comer o elefante.** Objetivo grande se executa em pedaço definido, não de uma
vez. É a mesma lógica da Máquina: um bloco por vez.

**Cofre da Coca-Cola.** Existe um punhado de coisas que **não podem** estar só na
cabeça de uma pessoa. Identifique quais são e tire de lá primeiro.

**Números da matriz.** Poucos números que explicam o negócio inteiro. Se você não
sabe dizer quais são, ainda não entende a operação.

^[mega-brain:the-scalable-company/AGENT.md:MODELOS MENTAIS]

---

## Regra de consulta (do próprio agente)

| Pergunta é | Consulte primeiro |
|---|---|
| "Como estruturar" | Frameworks |
| "O que fazer agora" | Heurísticas |
| "Por quê" | Filosofias |
| "Como fazer" | Metodologias |
| "Como pensar sobre" | Modelos mentais |

---

## Como isso aterrissa na Horus

- **O cofre da Coca-Cola é o diagnóstico exato do MazyOS.** Tudo que só existe na
  cabeça do Marcelo é risco. Foi por isso que nasceram `_memoria/design/` e
  `referencias/`. Esta mente dá o vocabulário e o critério de prioridade: tire
  primeiro o que quebraria a operação se sumisse
- **Máximo 7 etapas** é régua direta pras skills: skill com 15 passos não é
  seguida, é ignorada
- **3 a 5 métricas** vale pro relatório que a Horus entrega ao cliente. Relatório
  de 20 números não é lido por dono de clínica
- **Sprint de 90 dias** é um horizonte melhor que "prioridade atual" solta em
  `_memoria/estrategia.md`

## O que não trazer daqui

Estrutura de reunião de time, scorecard por pessoa e desenho de organograma.
Guardar para quando houver equipe.
