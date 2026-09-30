-- =============================================================================
-- 008 — Mídia: o agente de social media da Hórus (cargo 📣 Mídia do Conselho)
-- Motivo (27/09/2026): o Marcelo quer ver no Hounder o que o agente planejou, o que
-- está fazendo, o que está agendado, e aprovar os posts. O motor mora em
-- `ferramentas/social/` (ARQUITETURA.md seção 7); aqui fica o estado dele.
-- Multi-marca desde o início (coluna `marca`): hoje só 'horus'.
-- Idempotente, como os demais arquivos desta pasta.
-- =============================================================================

-- Posts: da ideia ao medido. A fila de aprovação é status = 'aguardando'.
create table if not exists public.social_posts (
  id             uuid primary key default gen_random_uuid(),
  marca          text not null default 'horus',
  semana         date,                         -- segunda-feira da semana do plano
  status         text not null default 'planejado'
                 check (status in ('planejado','criando','revisao','aguardando','ajuste','aprovado',
                                   'agendado','publicando','publicado','medido','reprovado','erro')),
  titulo         text not null,
  pilar          text,
  formato        text,                         -- narrativa: tese, lista, problema-solucao...
  tipo_midia     text not null default 'carrossel' check (tipo_midia in ('carrossel','imagem','reel','story')),
  objetivo       text,                         -- o porquê do post
  etapa_funil    text,
  hipotese       text,                         -- o que este post testa
  experimento    boolean not null default false,
  legenda        text,
  pasta          text,                         -- pasta no repositório com carrossel.html e PNGs
  slides         jsonb not null default '[]',  -- [{arquivo, url_publica}]
  previa         jsonb not null default '[]',  -- miniaturas pequenas (data URL) para o painel
  revisao        jsonb,                        -- parecer do 🎨 Criação: {vetos, notas, media, veredito}
  pedido_ajuste  text,                         -- o que o Marcelo pediu para mudar
  agendado_para  timestamptz,
  publicado_em   timestamptz,
  media_id       text,
  permalink      text,
  fixar          boolean not null default false, -- lembrete: fixar no topo pelo app (a API não fixa)
  erro           text,
  criado_por     text not null default 'midia',
  criado_em      timestamptz not null default now(),
  atualizado_em  timestamptz not null default now()
);
create index if not exists social_posts_status_idx on public.social_posts (marca, status, agendado_para);

-- Métricas por janela (24h, 72h, 7d, 28d por post; 'conta' para a conta inteira)
create table if not exists public.social_metricas (
  id           uuid primary key default gen_random_uuid(),
  marca        text not null default 'horus',
  post_id      uuid references public.social_posts(id) on delete cascade,
  media_id     text,
  janela       text not null check (janela in ('24h','72h','7d','28d','conta')),
  valores      jsonb not null default '{}',
  descartadas  text[] not null default '{}',   -- métricas que a Meta recusou nesta coleta
  coletado_em  timestamptz not null default now()
);
create index if not exists social_metricas_post_idx on public.social_metricas (post_id, janela);
create unique index if not exists social_metricas_janela_unica on public.social_metricas (media_id, janela) where janela <> 'conta';

-- Rotinas: o que roda, quando roda de novo e como foi a última vez (a aba Agenda)
create table if not exists public.social_rotinas (
  id             text primary key,
  marca          text not null default 'horus',
  nome           text not null,
  descricao      text,
  quando         text not null,                -- regra legível: "segunda 8h", "a cada 30 min"
  usa_claude     boolean not null default false,
  ativo          boolean not null default true,
  proxima        timestamptz,
  ultima         timestamptz,
  ultimo_status  text check (ultimo_status in ('ok','erro','pulada','rodando')),
  ultimo_resumo  text,
  atualizado_em  timestamptz not null default now()
);

-- Diário: toda ação externa do Mídia, com o nível que a política deu (a aba Agora)
create table if not exists public.social_acoes (
  id          uuid primary key default gen_random_uuid(),
  marca       text not null default 'horus',
  acao        text not null,
  nivel       text check (nivel in ('auto','fila','proibido')),
  motivo      text,
  post_id     uuid references public.social_posts(id) on delete set null,
  resumo      text,
  resultado   text check (resultado in ('ok','erro','bloqueada','pendente')),
  erro        text,
  criado_em   timestamptz not null default now()
);
create index if not exists social_acoes_data_idx on public.social_acoes (marca, criado_em desc);

-- Caixa: comentários e DMs, já triados
create table if not exists public.social_interacoes (
  id              uuid primary key default gen_random_uuid(),
  marca           text not null default 'horus',
  tipo            text not null check (tipo in ('comentario','dm')),
  externo_id      text not null unique,
  media_id        text,
  post_id         uuid references public.social_posts(id) on delete set null,
  autor           text,
  texto           text,
  recebido_em     timestamptz,
  classificacao   text check (classificacao in ('lead','duvida','elogio','spam','ofensa','outro')),
  risco           text check (risco in ('baixo','medio','alto')),
  status          text not null default 'novo' check (status in ('novo','triado','rascunho','respondido','ignorado')),
  rascunho        text,
  resposta        text,
  empresa_id      uuid references public.empresas(id) on delete set null,
  criado_em       timestamptz not null default now()
);
create index if not exists social_interacoes_status_idx on public.social_interacoes (marca, status, recebido_em desc);

-- Aprendizados: preferência (o Marcelo disse), evidência (métrica), hipótese (o Mídia acha)
create table if not exists public.social_aprendizados (
  id          uuid primary key default gen_random_uuid(),
  marca       text not null default 'horus',
  tipo        text not null check (tipo in ('preferencia','evidencia','hipotese')),
  texto       text not null,
  suporte     jsonb,                           -- números e posts que sustentam
  status      text not null default 'aberto' check (status in ('aberto','confirmado','descartado')),
  criado_em   timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

drop trigger if exists hd_atualizado on public.social_posts;
create trigger hd_atualizado before update on public.social_posts for each row execute function public.hd_tocar_atualizado();
drop trigger if exists hd_atualizado on public.social_rotinas;
create trigger hd_atualizado before update on public.social_rotinas for each row execute function public.hd_tocar_atualizado();
drop trigger if exists hd_atualizado on public.social_aprendizados;
create trigger hd_atualizado before update on public.social_aprendizados for each row execute function public.hd_tocar_atualizado();

do $$
declare t text;
begin
  foreach t in array array['social_posts','social_metricas','social_rotinas','social_acoes','social_interacoes','social_aprendizados'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('drop policy if exists hd_operador on public.%I', t);
    execute format('create policy hd_operador on public.%I for all to authenticated using (public.eh_operador()) with check (public.eh_operador())', t);
    begin
      execute format('alter publication supabase_realtime add table public.%I', t);
    exception when duplicate_object then null;
    end;
  end loop;
end $$;

-- As rotinas do Mídia (ARQUITETURA.md 7.3). O Farejador calcula `proxima` a partir de `quando`.
insert into public.social_rotinas (id, nome, descricao, quando, usa_claude) values
  ('caixa',     'Olhar comentários e DMs',    'Chama a API e guarda o que chegou. DM nova avisa o Marcelo no WhatsApp.', 'a cada 30 min', false),
  ('triagem',   'Triar o que chegou',         'Classifica lead, dúvida, spam; rascunha resposta. Só roda se houver algo novo, tudo numa chamada.', '10h, 14h e 19h', true),
  ('metricas',  'Coletar métricas',           'Conta e posts nas janelas de 24 h, 72 h, 7 e 28 dias.', 'todo dia 7h', false),
  ('semana',    'Sessão da semana',           'Analisa a semana, planeja e escreve os 3 posts; o 🎨 Criação revisa; vão para a sua aprovação.', 'segunda 8h', true),
  ('publicar',  'Publicar aprovados',         'Publica pela API os posts aprovados no dia e hora do plano.', 'a cada 5 min', false),
  ('token',     'Renovar token do Instagram', 'Renova sozinho quando faltar menos de 10 dias.', 'todo dia 6h', false)
on conflict (id) do update set nome = excluded.nome, descricao = excluded.descricao, quando = excluded.quando, usa_claude = excluded.usa_claude;

-- Liga/desliga e fase de autonomia do Mídia (lido pelo Farejador e pelo painel)
insert into public.config (chave, valor) values
  ('midia', '{"ativo": true, "fase": 1, "marca": "horus", "publicar_hora": "12:00", "dias_publicacao": [1,3,5]}')
on conflict (chave) do nothing;

-- O conteúdo estruturado que o Mídia escreveu (slides em JSON): é o que se reenvia
-- quando o Marcelo pede ajuste, sem reescrever o post do zero.
alter table public.social_posts add column if not exists conteudo jsonb;
alter table public.social_posts add column if not exists aviso_enviado text;
