# Motor social (agente de Social Media da Horus)

Por que existe e como vai ficar: `ARQUITETURA.md`. Como pegar a chave: `CHAVE-META.md`.

## Estado (27/09/2026): etapa 0 pronta

| Peça | Arquivo | Estado |
|---|---|---|
| Adaptador da API do Instagram (ler perfil, posts, métricas, comentários, cota; publicar imagem, carrossel, Reel e story; renovar token) | `lib/meta.mjs` | Pronto, testado com respostas simuladas. **Nunca rodou contra a Meta** (sem chave ainda) |
| Política de autonomia (auto / fila / proibido) | `lib/politica.mjs` | Pronta, testada |
| Camada de marca + segredo + trava de conta | `lib/marca.mjs`, `marcas/horus.json` | Pronta. O @ da Horus está `[FALTA]`, então a escrita fica bloqueada |
| Linha de comando | `bin/social.mjs` | Pronta |
| Testes | `test/` | 17 de 17 passando (`npm test` nesta pasta) |

**27/09/2026, conectado:** @ oficial confirmado pelo Marcelo (`@horusagencia.br`), token salvo
em `.segredos/horus.json` (vence em 26/11/2026, renovável). Leitura conferida contra a Meta:
conta BUSINESS, 5 seguidores, **0 posts**, cota de 100 publicações/24 h. Comentários e DM ainda
não testados (sem post e sem conversa). Com a conta vazia, a etapa 1 (métricas) perde o sentido
por enquanto: a ordem passa a ser auditoria e perfil (2) → estratégia e primeiros posts (3) → coleta.

## Comandos

```
node ferramentas/social/bin/social.mjs salvar-token        # lê .segredos/token.txt, confere na Meta, grava e apaga o .txt
node ferramentas/social/bin/social.mjs conta               # perfil, cota de publicação, validade do token, trava de conta
node ferramentas/social/bin/social.mjs midias 12
node ferramentas/social/bin/social.mjs metricas <id> FEED  # ou REELS, STORY
node ferramentas/social/bin/social.mjs metricas-conta 7
node ferramentas/social/bin/social.mjs renovar-token
node ferramentas/social/bin/social.mjs politica publicar_carrossel lista
node ferramentas/social/bin/social.mjs testar-publicacao https://.../imagem.png   # cria o container e NÃO publica
```

`--marca <id>` escolhe a marca (padrão `horus`). Cliente novo = `marcas/<id>.json` + token próprio.

## Regras deste código

- O modelo decide, o código executa e confere. Nada chama a API sem passar pela política.
- Só erro de limite e transitório tenta de novo. Token, permissão e parâmetro param e avisam.
- Publicação não repete às cegas: se a chamada final falha, o container é conferido antes.
- Token nunca em log, nunca em mensagem de erro, nunca no Git (`.segredos/`).
- Sem dependência externa: Node 20+ puro.

**27/09/2026, etapas 2 e 3 (Horus):** auditoria aprovada (`identidade/social/auditoria-2026-09-27.md`),
perfil de marca escrito (`identidade/social/perfil.md`), identidade do carrossel travada
(`identidade/social/carrossel-referencia.html`) e os 3 posts fixados renderizados em
`marketing/conteudo/fixados-horus-2026-09-27/` (fila: aprovação do Marcelo). **Bloqueio da
publicação pela API:** hospedagem pública da mídia (decisão pendente; ver `ARQUITETURA.md` §6).

## 27/09/2026, noite: o 📣 Mídia está no ar (etapas 4 e 5 da primeira versão)

- **Nome e papel:** 📣 Mídia, cargo do Conselho que opera o Instagram; 🎨 Criação revisa (ARQUITETURA §7).
- **Estado no banco:** migração `ferramentas/hound-dog/supabase/008_midia.sql` aplicada (posts, métricas,
  rotinas, diário, caixa, aprendizados; `config.midia` liga/desliga e fase).
- **Orquestração:** `ferramentas/hound-dog/farejador/midia.mjs`, chamado pelo Farejador a cada minuto.
  Rotinas de código (caixa 30 min, métricas 7h, publicar 5 min, token 6h) e tarefas do Claude na fila
  (`midia_semana` segunda 8h em Opus; `midia_triagem` 10h/14h/19h só com pendência; `midia_ajuste`).
- **Motor:** `lib/carrossel.mjs` (o Mídia devolve JSON, o código monta com a identidade travada, valida
  os pisos e renderiza PNG, JPEG e miniatura), `lib/hospedagem.mjs` (bucket público no Supabase),
  `conversas()` no adaptador da Meta (DMs). 20 testes passando.
- **Tela:** Hounder → Instagram, abas Visão, Semana, Agenda, Agora, Caixa, Aprendizados, com Pausar.
  Publicada na Vercel. Skill `/midia` para conversar com ele.
- **Conferido de verdade:** coleta pela API oficial gravou o retrato; token vale 59 dias; os 2 fixados
  aprovados foram agendados para 28/09 12h e 12h10; o Farejador reiniciado roda as rotinas.
- **Bloqueio:** sem a chave de serviço do Supabase (`.segredos/supabase.txt`), o Mídia não consegue
  hospedar as imagens e o post fica parado no horário, com aviso no WhatsApp.
- **Não verificado ainda:** a sessão da semana (primeira roda segunda 8h), a publicação real pela API e a
  geração de imagem pelo Chrome dentro do Farejador.
