# Cadernos de segmento (Fase 3 dos agentes, 30/09/2026)

> Um caderno por nicho. Cada caderno tem um **especialista** no Hounder (um personagem na Mesa de agentes) e é
> lido pelo agente de todo lead daquele nicho antes de pensar e escrever. O agente continua sendo um por lead,
> com a memória daquele lead. O caderno é o que vale para **todos** os leads do nicho.

| Especialista | Caderno | Nichos (casa pela categoria da ficha) |
|---|---|---|
| **Clara** | `clinicas.md` | odontologia, estética, fisioterapia e pilates, dermatologia, harmonização, psicologia |
| **Lia** | `eventos.md` | espaço de eventos, salão de festas, buffet, cerimonial |
| **Rafa** | `oficinas.md` | oficina, mecânica, performance, especializada de marca |

Lead de nicho sem caderno fica com o agente geral até ganhar especialista. As palavras que ligam a categoria ao
especialista ficam na tabela `especialistas` do Hounder (migração 014).

## Como o caderno cresce

```
correção do Marcelo na Mesa ("Não mandar", "Outra opção", "Contar ao agente")
  ├─ marcou "vale pro nicho todo"? → vira nota VÁLIDA do especialista na hora
  └─ não marcou? → fica só na memória daquele lead
lição que o agente tira de um ciclo → nota PROPOSTA → o Marcelo aceita ou descarta na Mesa
                                             ↓
      notas válidas entram no pedido de TODOS os agentes do nicho, e no crítico
                                             ↓
      nota que se confirma em dois leads sobe pro caderno (edição à mão, /atualizar)
```

## O que entra num caderno

Só o que tem fonte: resposta real de lead, correção do Marcelo, fato conferido numa investigação, régua do
conselho. Hipótese entra marcada como hipótese. Número de mercado sem fonte não entra (`_memoria/integridade.md`).
