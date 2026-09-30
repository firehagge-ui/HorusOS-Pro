---
name: midia
description: >
  Conversa com o 📣 Mídia, o agente de social media da Horus (cargo do Conselho que opera o
  Instagram). Mostra o que ele planejou, o que está agendado e como foram as rotinas; manda
  planejar a semana agora; pede ajuste num post; muda horário; pausa e retoma. Use quando o
  Marcelo disser "/midia", "Mídia", "como está o Instagram", "o que vai ao ar", "planeja a
  semana", "refaz o post X", "pausa o agente".
---

# /midia — falar com o 📣 Mídia

O Mídia **não precisa desta skill para trabalhar**: ele roda dentro do Farejador, sozinho, na
agenda da tabela `social_rotinas`. Esta skill é só a conversa com ele no Claude Code. A tela dele
é Hounder → Instagram (abas Semana, Agenda, Agora, Caixa, Aprendizados).

Leitura de contexto (sob demanda, não toda vez): `ferramentas/social/ARQUITETURA.md` §7 (como ele
funciona), `identidade/social/perfil.md` (a estratégia da Horus), `_conselho/cargos/midia.md`.

## Como ler o estado

Rodar a partir de `ferramentas/hound-dog` com `node --input-type=module -e "..."` importando
`./lib/db.mjs` (`q`, `q1`, `fecharDb`). Consultas úteis:

- Posts: `select titulo, status, agendado_para, erro from social_posts where marca='horus' order by agendado_para desc limit 10`
- Rotinas: `select id, quando, proxima, ultima, ultimo_status, ultimo_resumo from social_rotinas order by proxima`
- Diário: `select criado_em, acao, resultado, resumo, erro from social_acoes order by criado_em desc limit 20`
- Caixa: `select tipo, autor, classificacao, status, texto from social_interacoes where status <> 'ignorado' order by recebido_em desc limit 20`
- Liga/desliga e fase: `select valor from config where chave='midia'`

Responder em linguagem de gente: o que vai ao ar e quando, o que espera o Marcelo, o que deu erro
e o que ele precisa fazer. Horário sempre no fuso da Bahia.

## Como mandar

| Pedido | O que fazer |
|---|---|
| "planeja a semana agora" | `update social_rotinas set proxima = now() where id = 'semana'` (o Farejador pega em até 1 min) |
| "aprova o post X" | `update social_posts set status='aprovado', erro=null where id=...` só com o Marcelo pedindo, nunca por conta própria |
| "refaz o post X com Y" | `update social_posts set status='ajuste', pedido_ajuste='Y'` + job `midia_ajuste` com `{post_id}` na tabela `jobs` |
| "muda o horário" | `update social_posts set agendado_para=... , status='agendado'` |
| "pausa" / "retoma" | `update config set valor = jsonb_set(valor,'{ativo}','false'/'true') where chave='midia'` |
| "roda a coleta agora" | `update social_rotinas set proxima = now() where id = 'metricas'` |

Travas que não mudam: nada público sai sem aprovação do Marcelo na fase 1; responder DM é dele;
nada de número inventado; ChatGPT só pelo Chrome do Marcelo. O Farejador precisa estar ligado
(`npm run farejador` na pasta `ferramentas/hound-dog`) para qualquer coisa rodar.
