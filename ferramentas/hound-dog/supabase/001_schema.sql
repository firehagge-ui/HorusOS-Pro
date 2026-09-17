-- =============================================================================
-- HOUND DOG — o CRM e painel de controle da Hórus
-- Esquema 001: tabelas, gatilhos, segurança (RLS) e realtime.
-- Idempotente: pode rodar de novo sem quebrar (create if not exists / or replace).
-- =============================================================================

create extension if not exists pgcrypto with schema extensions;

-- -----------------------------------------------------------------------------
-- Utilitários
-- -----------------------------------------------------------------------------
create or replace function public.hd_tocar_atualizado()
returns trigger language plpgsql as $$
begin
  new.atualizado_em := now();
  return new;
end $$;

-- -----------------------------------------------------------------------------
-- Operadores (quem pode ver e mexer no Hound Dog)
-- -----------------------------------------------------------------------------
create table if not exists public.operadores (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  nome        text not null,
  email       text,
  papel       text not null default 'operador' check (papel in ('dono','operador')),
  cor         text default '#ff7a1a',
  criado_em   timestamptz not null default now()
);

create or replace function public.eh_operador()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.operadores where user_id = auth.uid());
$$;

create or replace function public.nome_operador()
returns text language sql stable security definer set search_path = public as $$
  select nome from public.operadores where user_id = auth.uid();
$$;

create or replace function public.eh_dono()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.operadores where user_id = auth.uid() and papel = 'dono');
$$;

-- -----------------------------------------------------------------------------
-- Estágios das esteiras (dado, não código: dá pra renomear sem deploy)
-- -----------------------------------------------------------------------------
create table if not exists public.estagios (
  id      text primary key,
  funil   text not null check (funil in ('prospeccao','entrega')),
  nome    text not null,
  descricao text,
  ordem   int  not null,
  cor     text not null,
  tipo    text not null default 'aberto' check (tipo in ('aberto','ganho','perdido','espera'))
);

-- -----------------------------------------------------------------------------
-- Listas de prospecção (planilha do Spark, radar do Claude, importação manual)
-- -----------------------------------------------------------------------------
create table if not exists public.listas (
  id            uuid primary key default gen_random_uuid(),
  nome          text not null,
  origem        text not null default 'planilha' check (origem in ('spark','claude','planilha','manual','network')),
  nicho         text,
  cidade        text,
  arquivo_nome  text,
  url_fonte     text,
  total         int  not null default 0,
  status        text not null default 'pronta' check (status in ('pronta','processando','erro')),
  observacao    text,
  job_id        uuid,
  criado_por    text,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists public.lista_itens (
  id                    uuid primary key default gen_random_uuid(),
  lista_id              uuid not null references public.listas(id) on delete cascade,
  nome                  text not null,
  categoria             text,
  cidade                text,
  bairro                text,
  endereco              text,
  telefone              text,
  whatsapp              text,
  instagram             text,
  instagram_seguidores  int,
  site                  text,
  site_status           text default 'desconhecido' check (site_status in ('sem','fora_do_ar','ruim','ok','desconhecido')),
  google_nota           numeric(2,1),
  google_avaliacoes     int,
  gmb_status            text,
  roda_anuncio          boolean,
  cnpj                  text,
  observacao            text,
  dados                 jsonb not null default '{}'::jsonb,
  score                 int not null default 0,
  score_motivos         jsonb not null default '[]'::jsonb,
  prioridade            text not null default 'baixa' check (prioridade in ('alta','media','baixa')),
  empresa_id            uuid,
  descartado            boolean not null default false,
  criado_em             timestamptz not null default now()
);
create index if not exists lista_itens_lista_idx on public.lista_itens (lista_id, score desc);

-- -----------------------------------------------------------------------------
-- Empresas: todo negócio que a Hórus acompanha (lead, cliente, ex-cliente)
-- -----------------------------------------------------------------------------
create table if not exists public.empresas (
  id                    uuid primary key default gen_random_uuid(),
  nome                  text not null,
  categoria             text,
  cidade                text,
  bairro                text,
  endereco              text,
  decisor               text,
  decisor_obs           text,
  whatsapp              text,
  telefone              text,
  email                 text,
  instagram             text,
  instagram_seguidores  int,
  site                  text,
  site_status           text default 'desconhecido' check (site_status in ('sem','fora_do_ar','ruim','ok','desconhecido')),
  google_nota           numeric(2,1),
  google_avaliacoes     int,
  gmb_status            text,
  roda_anuncio          boolean,
  cnpj                  text,
  regulado              boolean not null default false,
  conselho              text,
  relacao               text not null default 'lead' check (relacao in ('lead','cliente','ex_cliente','interno','nao_fit')),
  estagio               text not null default 'novo' references public.estagios(id),
  estagio_desde         timestamptz not null default now(),
  temperatura           text check (temperatura in ('frio','morno','quente')),
  score                 int not null default 0,
  score_motivos         jsonb not null default '[]'::jsonb,
  prioridade            text not null default 'media' check (prioridade in ('alta','media','baixa')),
  origem                text not null default 'manual',
  origem_detalhe        text,
  gancho                text,
  dor                   text,
  valor_estimado        numeric(12,2),
  proxima_acao          text,
  proxima_acao_em       timestamptz,
  ultimo_contato_em     timestamptz,
  responsavel           text,
  tags                  text[] not null default '{}',
  pasta_repo            text,
  resumo                text,
  dossie                jsonb not null default '{}'::jsonb,
  dossie_em             timestamptz,
  lista_item_id         uuid,
  arquivado             boolean not null default false,
  atualizado_por        text,
  criado_em             timestamptz not null default now(),
  atualizado_em         timestamptz not null default now()
);
create index if not exists empresas_estagio_idx on public.empresas (estagio) where not arquivado;
create index if not exists empresas_whatsapp_idx on public.empresas (whatsapp);
create index if not exists empresas_nome_idx on public.empresas (lower(nome));

do $$ begin
  alter table public.lista_itens
    add constraint lista_itens_empresa_fk foreign key (empresa_id) references public.empresas(id) on delete set null;
exception when duplicate_object then null; end $$;

-- -----------------------------------------------------------------------------
-- Negócios (fases vendidas por empresa: Fase 1, 2, 3...) e dinheiro
-- -----------------------------------------------------------------------------
create table if not exists public.negocios (
  id                  uuid primary key default gen_random_uuid(),
  empresa_id          uuid not null references public.empresas(id) on delete cascade,
  titulo              text not null,
  fase                text not null default 'fase1' check (fase in ('fase1','fase2','fase3','avulso')),
  valor               numeric(12,2),
  recorrencia_mensal  numeric(12,2),
  status              text not null default 'aberto' check (status in ('aberto','ganho','perdido','pausado')),
  entrega             text not null default 'nao_iniciada' check (entrega in ('nao_iniciada','onboarding','producao','revisao','entregue','pausado')),
  probabilidade       int check (probabilidade between 0 and 100),
  observacao          text,
  criado_em           timestamptz not null default now(),
  atualizado_em       timestamptz not null default now()
);
create index if not exists negocios_empresa_idx on public.negocios (empresa_id);

create table if not exists public.financeiro (
  id           uuid primary key default gen_random_uuid(),
  empresa_id   uuid not null references public.empresas(id) on delete cascade,
  negocio_id   uuid references public.negocios(id) on delete set null,
  descricao    text not null,
  tipo         text not null default 'projeto' check (tipo in ('projeto','recorrente')),
  valor        numeric(12,2) not null,
  status       text not null default 'previsto' check (status in ('previsto','a_receber','recebido','cancelado')),
  vencimento   date,
  recebido_em  date,
  observacao   text,
  criado_em    timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Linha do tempo (tudo que acontece com uma empresa, inclusive o que o Claude faz)
-- -----------------------------------------------------------------------------
create table if not exists public.atividades (
  id          uuid primary key default gen_random_uuid(),
  empresa_id  uuid references public.empresas(id) on delete cascade,
  tipo        text not null default 'nota',
  titulo      text not null,
  descricao   text,
  dados       jsonb not null default '{}'::jsonb,
  autor       text not null default 'sistema',
  criado_em   timestamptz not null default now()
);
create index if not exists atividades_empresa_idx on public.atividades (empresa_id, criado_em desc);
create index if not exists atividades_tempo_idx on public.atividades (criado_em desc);

-- -----------------------------------------------------------------------------
-- Agenda
-- -----------------------------------------------------------------------------
create table if not exists public.agenda (
  id                 uuid primary key default gen_random_uuid(),
  empresa_id         uuid references public.empresas(id) on delete set null,
  titulo             text not null,
  tipo               text not null default 'r1' check (tipo in ('r1','r2','followup','ligacao','visita','entrega','interno','outro')),
  inicio             timestamptz not null,
  fim                timestamptz,
  local              text,
  descricao          text,
  status             text not null default 'agendado' check (status in ('agendado','feito','remarcado','cancelado','nao_compareceu')),
  lembrete_min       int not null default 30,
  lembrete_enviado   boolean not null default false,
  responsavel        text,
  criado_por         text,
  criado_em          timestamptz not null default now(),
  atualizado_em      timestamptz not null default now()
);
create index if not exists agenda_inicio_idx on public.agenda (inicio);

-- -----------------------------------------------------------------------------
-- WhatsApp (conversas e mensagens que o Farejador sincroniza)
-- -----------------------------------------------------------------------------
create table if not exists public.whatsapp_conversas (
  id                uuid primary key default gen_random_uuid(),
  jid               text not null unique,
  telefone          text,
  nome              text,
  empresa_id        uuid references public.empresas(id) on delete set null,
  ultima_mensagem   text,
  ultima_direcao    text,
  ultima_em         timestamptz,
  nao_lidas         int not null default 0,
  bot_detectado     boolean not null default false,
  analise           jsonb,
  analise_status    text not null default 'nenhuma' check (analise_status in ('nenhuma','fila','processando','pronta','erro')),
  analise_em        timestamptz,
  arquivada         boolean not null default false,
  criado_em         timestamptz not null default now(),
  atualizado_em     timestamptz not null default now()
);
create index if not exists wa_conversas_ultima_idx on public.whatsapp_conversas (ultima_em desc nulls last);

create table if not exists public.whatsapp_mensagens (
  id            uuid primary key default gen_random_uuid(),
  conversa_id   uuid not null references public.whatsapp_conversas(id) on delete cascade,
  wa_id         text unique,
  direcao       text not null check (direcao in ('in','out')),
  tipo          text not null default 'texto',
  texto         text,
  status        text not null default 'recebida' check (status in ('recebida','fila','enviando','enviada','entregue','lida','erro')),
  enviado_por   text,
  erro          text,
  momento       timestamptz not null default now(),
  criado_em     timestamptz not null default now()
);
create index if not exists wa_mensagens_conversa_idx on public.whatsapp_mensagens (conversa_id, momento);

-- -----------------------------------------------------------------------------
-- Fila de trabalho do Farejador (o processo local que roda o Claude e o WhatsApp)
-- -----------------------------------------------------------------------------
create table if not exists public.jobs (
  id            uuid primary key default gen_random_uuid(),
  tipo          text not null,
  status        text not null default 'fila' check (status in ('fila','processando','concluido','erro','cancelado')),
  prioridade    int  not null default 5,
  entrada       jsonb not null default '{}'::jsonb,
  saida         jsonb,
  progresso     text,
  erro          text,
  empresa_id    uuid references public.empresas(id) on delete set null,
  lista_id      uuid references public.listas(id) on delete set null,
  conversa_id   uuid references public.whatsapp_conversas(id) on delete set null,
  criado_por    text,
  criado_em     timestamptz not null default now(),
  iniciado_em   timestamptz,
  concluido_em  timestamptz
);
create index if not exists jobs_fila_idx on public.jobs (status, prioridade, criado_em);

create or replace function public.hd_notificar_job()
returns trigger language plpgsql as $$
begin
  perform pg_notify('hd_jobs', new.id::text || ':' || new.tipo);
  return new;
end $$;

-- -----------------------------------------------------------------------------
-- Conversa com o Claude (pelo Hound Dog, rodando na assinatura, sem API)
-- -----------------------------------------------------------------------------
create table if not exists public.chat_threads (
  id            uuid primary key default gen_random_uuid(),
  titulo        text not null default 'Nova conversa',
  empresa_id    uuid references public.empresas(id) on delete set null,
  criado_por    text,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table if not exists public.chat_mensagens (
  id            uuid primary key default gen_random_uuid(),
  thread_id     uuid not null references public.chat_threads(id) on delete cascade,
  papel         text not null check (papel in ('user','assistant')),
  conteudo      text not null default '',
  status        text not null default 'ok' check (status in ('ok','pensando','streaming','erro')),
  autor         text,
  ferramentas   jsonb not null default '[]'::jsonb,
  job_id        uuid,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
create index if not exists chat_mensagens_thread_idx on public.chat_mensagens (thread_id, criado_em);

-- -----------------------------------------------------------------------------
-- Pesquisas (mercado, dossiê de empresa, concorrência)
-- -----------------------------------------------------------------------------
create table if not exists public.pesquisas (
  id                  uuid primary key default gen_random_uuid(),
  tipo                text not null default 'mercado' check (tipo in ('mercado','dossie','concorrencia','instagram')),
  titulo              text not null,
  nicho               text,
  cidade              text,
  pergunta            text,
  empresa_id          uuid references public.empresas(id) on delete cascade,
  status              text not null default 'fila' check (status in ('fila','processando','pronta','erro')),
  resumo              text,
  conteudo_md         text,
  dados               jsonb not null default '{}'::jsonb,
  nota_oportunidade   int check (nota_oportunidade between 0 and 100),
  job_id              uuid,
  criado_por          text,
  criado_em           timestamptz not null default now(),
  atualizado_em       timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Instagram da Hórus (fotos do perfil ao longo do tempo)
-- -----------------------------------------------------------------------------
create table if not exists public.instagram_snapshots (
  id                  uuid primary key default gen_random_uuid(),
  handle              text not null,
  nome                text,
  bio                 text,
  foto_url            text,
  link_externo        text,
  seguidores          int,
  seguindo            int,
  posts               int,
  media_curtidas      numeric(10,1),
  media_comentarios   numeric(10,1),
  engajamento         numeric(6,2),
  ultimos_posts       jsonb not null default '[]'::jsonb,
  fonte               text not null default 'publico',
  coletado_em         timestamptz not null default now()
);
create index if not exists ig_snap_idx on public.instagram_snapshots (handle, coletado_em desc);

-- -----------------------------------------------------------------------------
-- Estado do Farejador, configuração e playbook de objeções
-- -----------------------------------------------------------------------------
create table if not exists public.farejador_status (
  id                  text primary key default 'principal',
  online_em           timestamptz,
  iniciado_em         timestamptz,
  versao              text,
  maquina             text,
  claude_ok           boolean,
  claude_info         text,
  whatsapp_status     text not null default 'desligado',
  whatsapp_qr         text,
  whatsapp_codigo     text,
  whatsapp_numero     text,
  whatsapp_nome       text,
  whatsapp_erro       text,
  instagram_em        timestamptz,
  instagram_erro      text,
  fila                int not null default 0,
  detalhes            jsonb not null default '{}'::jsonb,
  atualizado_em       timestamptz not null default now()
);

create table if not exists public.config (
  chave         text primary key,
  valor         jsonb not null,
  atualizado_em timestamptz not null default now()
);

create table if not exists public.playbook_objecoes (
  id            text primary key,
  rotulo        text not null,
  gatilhos      text[] not null default '{}',
  leitura       text,
  resposta      text not null,
  alternativas  text[] not null default '{}',
  evitar        text,
  fonte         text,
  ordem         int not null default 100,
  atualizado_em timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Gatilhos
-- -----------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['listas','empresas','negocios','agenda','whatsapp_conversas','chat_threads','chat_mensagens','pesquisas','config','playbook_objecoes','farejador_status'] loop
    execute format('drop trigger if exists hd_atualizado on public.%I', t);
    execute format('create trigger hd_atualizado before update on public.%I for each row execute function public.hd_tocar_atualizado()', t);
  end loop;
end $$;

drop trigger if exists hd_job_notify on public.jobs;
create trigger hd_job_notify after insert on public.jobs for each row execute function public.hd_notificar_job();

-- Mudança de estágio: registra na linha do tempo e ajusta a relação
create or replace function public.hd_empresa_estagio()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  quem text := coalesce(public.nome_operador(), new.atualizado_por, 'sistema');
  nome_novo text;
  tipo_novo text;
begin
  if tg_op = 'UPDATE' and new.estagio is distinct from old.estagio then
    select nome, tipo into nome_novo, tipo_novo from public.estagios where id = new.estagio;
    new.estagio_desde := now();
    if tipo_novo = 'ganho' and new.relacao = 'lead' then new.relacao := 'cliente'; end if;
    insert into public.atividades (empresa_id, tipo, titulo, descricao, dados, autor)
    values (new.id, 'estagio', 'Movido para ' || coalesce(nome_novo, new.estagio), null,
            jsonb_build_object('de', old.estagio, 'para', new.estagio), quem);
  elsif tg_op = 'INSERT' then
    insert into public.atividades (empresa_id, tipo, titulo, descricao, dados, autor)
    values (new.id, 'sistema', 'Entrou no Hound Dog', new.origem_detalhe,
            jsonb_build_object('origem', new.origem, 'estagio', new.estagio), quem);
  end if;
  return new;
end $$;

drop trigger if exists hd_estagio_upd on public.empresas;
create trigger hd_estagio_upd before update on public.empresas for each row execute function public.hd_empresa_estagio();
drop trigger if exists hd_estagio_ins on public.empresas;
create trigger hd_estagio_ins after insert on public.empresas for each row execute function public.hd_empresa_estagio();

-- Atividade de contato atualiza "último contato"
create or replace function public.hd_atividade_contato()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.empresa_id is not null and new.tipo in ('mensagem','ligacao','reuniao','whatsapp','visita','proposta') then
    update public.empresas set ultimo_contato_em = greatest(coalesce(ultimo_contato_em, new.criado_em), new.criado_em)
    where id = new.empresa_id;
  end if;
  return new;
end $$;
drop trigger if exists hd_atividade_contato on public.atividades;
create trigger hd_atividade_contato after insert on public.atividades for each row execute function public.hd_atividade_contato();

-- -----------------------------------------------------------------------------
-- Visões úteis (security_invoker: respeitam a RLS de quem consulta)
-- -----------------------------------------------------------------------------
create or replace view public.vw_esteira_resumo with (security_invoker = true) as
select e.id as estagio, e.nome, e.funil, e.ordem, e.cor, e.tipo,
       count(emp.id) as quantidade,
       coalesce(sum(emp.valor_estimado), 0) as valor_estimado
from public.estagios e
left join public.empresas emp on emp.estagio = e.id and not emp.arquivado
group by e.id, e.nome, e.funil, e.ordem, e.cor, e.tipo;

create or replace view public.vw_atencao with (security_invoker = true) as
select emp.*,
  case
    when emp.proxima_acao_em is not null and emp.proxima_acao_em < now() then 'acao_vencida'
    when emp.estagio in ('abordado','conversando','reuniao','proposta','negociacao')
         and coalesce(emp.ultimo_contato_em, emp.estagio_desde) < now() - interval '3 days' then 'parado'
    when emp.proxima_acao is null and emp.estagio in ('conversando','reuniao','proposta','negociacao') then 'sem_proxima_acao'
  end as motivo
from public.empresas emp
where not emp.arquivado and emp.relacao in ('lead','cliente')
  and (
    (emp.proxima_acao_em is not null and emp.proxima_acao_em < now())
    or (emp.estagio in ('abordado','conversando','reuniao','proposta','negociacao')
        and coalesce(emp.ultimo_contato_em, emp.estagio_desde) < now() - interval '3 days')
    or (emp.proxima_acao is null and emp.estagio in ('conversando','reuniao','proposta','negociacao'))
  );

-- -----------------------------------------------------------------------------
-- Segurança: só operador cadastrado vê e mexe. Anônimo não vê nada.
-- -----------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['operadores','estagios','listas','lista_itens','empresas','negocios','financeiro','atividades','agenda',
                           'whatsapp_conversas','whatsapp_mensagens','jobs','chat_threads','chat_mensagens','pesquisas',
                           'instagram_snapshots','farejador_status','config','playbook_objecoes'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on public.%I from anon', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('drop policy if exists hd_operador on public.%I', t);
    execute format('create policy hd_operador on public.%I for all to authenticated using (public.eh_operador()) with check (public.eh_operador())', t);
  end loop;
end $$;

-- operadores: cada um enxerga a lista, mas só o "dono" altera
drop policy if exists hd_operador on public.operadores;
drop policy if exists hd_operadores_ler on public.operadores;
drop policy if exists hd_operadores_dono on public.operadores;
create policy hd_operadores_ler on public.operadores for select to authenticated using (public.eh_operador());
create policy hd_operadores_dono on public.operadores for all to authenticated
  using (public.eh_dono()) with check (public.eh_dono());

revoke all on public.vw_esteira_resumo from anon;
revoke all on public.vw_atencao from anon;
grant select on public.vw_esteira_resumo to authenticated;
grant select on public.vw_atencao to authenticated;
revoke execute on function public.eh_operador() from anon;
revoke execute on function public.nome_operador() from anon;
revoke execute on function public.eh_dono() from anon;

-- -----------------------------------------------------------------------------
-- Realtime: o painel atualiza sozinho quando o Claude ou o WhatsApp mexem
-- -----------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['empresas','atividades','agenda','jobs','chat_mensagens','chat_threads','whatsapp_conversas',
                           'whatsapp_mensagens','farejador_status','listas','pesquisas','instagram_snapshots','negocios','financeiro'] loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', t);
    exception when duplicate_object then null;
    end;
  end loop;
end $$;
