# Equipe

Descrição de função (SOW, *statement of work*) para cada papel que a operação da
Horus executa. Portado de `agents/cargo/*/SOW.md` do mega-brain.

Hoje **quase tudo é o Marcelo mais IA**. Estes arquivos existem por três motivos:

1. **Delegar sem improviso.** Quando entrar gente, a função já está escrita
2. **Saber o que a IA pode assumir sozinha** e onde precisa de humano no meio
3. **Vender melhor.** Cliente que pergunta "quem cuida da minha conta?" recebe uma
   resposta estruturada, não uma promessa vaga

---

## Os três tipos de executor

| Tipo | O que significa | Autonomia |
|---|---|---|
| **Agente** | A IA executa sozinha, humano revisa por amostragem | 70 a 90% |
| **Híbrido** | A IA prepara e sugere, o humano decide e assina | 40 a 60% |
| **Humano** | Julgamento, relação ou responsabilidade legal. IA só apoia | 0 a 30% |

O tipo sai de seis perguntas (a mesma análise do mega-brain):

```
1. O resultado é 100% previsível?
2. Dá pra virar função pura (entra X, sai Y sempre igual)?
3. Precisa de linguagem natural / julgamento de contexto?
4. Qual o impacto se errar?
5. Exige decisão estratégica?
6. A IA consegue ao menos assistir?
```

Impacto de erro ALTO empurra pra Híbrido mesmo quando a IA daria conta sozinha.

---

## Funções

| Função | Tipo | Autonomia | Arquivo |
|---|---|---|---|
| Gestor de tráfego | Híbrido | 50% | [gestor-de-trafego.md](gestor-de-trafego.md) |
| Designer / web | Híbrido | 60% | [designer.md](designer.md) |
| Redator de conteúdo | Agente | 70% | [redator.md](redator.md) |
| Prospecção | Híbrido | 40% | [prospeccao.md](prospeccao.md) |
| Atendimento / conta | Humano | 30% | [atendimento.md](atendimento.md) |
| Relatórios | Agente | 85% | [relatorios.md](relatorios.md) |

---

## A regra que atravessa todas

**Cliente de setor regulado derruba a autonomia de qualquer função.** Peça que
fala de saúde não publica sem revisão humana do profissional responsável, por
mais que a função seja tipo Agente com 90%. Ver `_conselho/cargos/compliance.md`.

E nenhuma função inventa dado de cliente: `_memoria/integridade.md`.
