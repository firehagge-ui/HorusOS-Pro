# Hound Dog — contexto e regras (para o Claude)

> O CRM oficial da Hórus. Criado em 17/09/2026 a pedido do Marcelo ("me devolva o CRM 100%
> funcional"), substituindo os protótipos `horus-crm` e `painel-ataque-planta`.
> Painel: https://hound-dog-omega.vercel.app · Banco: Supabase `hound-dog` (sa-east-1).

## A regra que atravessa tudo

**O Hound Dog é a fonte de verdade da operação comercial.** Cliente novo, lead novo, reunião
marcada, valor acertado, estágio que mudou, objeção que apareceu: **atualize no mesmo turno**
com as ferramentas `mcp__hound-dog__*`. Arquivo do cliente (`clientes/<nome>/`) continua sendo
o dossiê longo; o Hound Dog é o estado atual — os dois precisam bater.

O que fica no Hound Dog: quem é, em que estágio está, próxima ação, negócios e dinheiro,
agenda, linha do tempo, conversas do WhatsApp, listas de prospecção, pesquisas de mercado.
O que fica na pasta do cliente: briefing, marca, compliance, arquivos de entrega, planos.

## Travas (herdadas da casa, valem aqui também)

- **Integridade**: nada de número, contato, depoimento ou fato inventado. O que falta vira
  `[FALTA: ...]` ou fica em branco. **Nunca presuma dígito de telefone** (o caso Amparo).
- **Compliance do cliente trava**: em setor regulado (CFO, CFP, CFM, OAB...) nada de promessa,
  superlativo, antes/depois ou depoimento onde o conselho proíbe. O campo `regulado` existe
  para isso e aparece na ficha e no cartão.
- **Nada de disparo em massa** e **nada de bot respondendo sozinho** no WhatsApp. O Claude lê
  e sugere; quem envia é o humano, uma mensagem por vez.
- **Preço não se manda por mensagem.** Objeção de preço vira convite para conversa ao vivo.
- Benchmark de network é **referência**, nunca meta nem promessa ao cliente.

## Arquitetura (o mínimo para não quebrar nada)

- `app/` é o painel (HTML/CSS/JS puro, sem build). Uma tela por arquivo em `app/js/telas/`.
  Publicar: `cd app && npx vercel deploy --prod --yes`.
- `app/js/score.js` é compartilhado entre painel e Node (régua de pontuação e leitura de
  planilha). Se mexer nele, mexe nos dois lados ao mesmo tempo.
- `lib/crm.mjs` concentra as regras de escrita (dedupe, score, linha do tempo). O MCP e o
  Farejador passam por ele — não escreva direto na tabela sem motivo.
- `farejador/` roda no PC do Marcelo. `claude.mjs` é quem chama o `claude -p`; `prompts.mjs`
  guarda o que o Claude recebe em cada tarefa; `tarefas.mjs` é o mapa tipo → função.
- Esquema do banco em `supabase/*.sql`, idempotente. Mudou o esquema? `npm run migrar`.
- Segredos em `.segredos/` (senha do banco, acessos). **Nunca versionar, nunca imprimir.**

## Quando o Marcelo pedir algo do CRM

1. `hd_resumo` primeiro (situação real), depois responda.
2. Fez alteração? Diga em uma linha o que mudou. Não peça confirmação para registrar o que
   ele acabou de falar; pergunte só quando faltar dado essencial (nome, data).
3. Dado que veio de pesquisa na web entra com a fonte. Dado que não achou não entra.

## Dívidas conhecidas (17/09/2026)

- **Instagram**: leitura pública bloqueada pela Meta. Ligar a API oficial (token em Ajustes)
  ou registrar na mão. Handle confirmado pelo Marcelo: **@agenciahorus02**.
- **Vercel Hobby** é não-comercial no papel: decidir entre Pro e Netlify/Cloudflare.
- **WhatsApp** conecta quando o Marcelo ler o QR (Conversas → Conectar WhatsApp).
- A conta `qa.claude@hounddog.dev` existe só para os testes automatizados; pode ser removida
  em Ajustes → Operadores quando não for mais útil.
