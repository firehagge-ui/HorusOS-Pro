-- =============================================================================
-- 011 — Time de agentes de prospecção, Fase 1 (29/09/2026)
-- Motivo: cada tarefa do Farejador era um `claude -p` novo que esquecia tudo ao
-- terminar. O agente é um lead com memória e dono: memória por lead (fatos,
-- hipóteses, decisor, objeções, o que já foi tentado, correções do Marcelo),
-- plano, e um diário de decisões ("aconteceu X, li como Y, decidi Z, porque W").
-- Desenho em ferramentas/hound-dog/PLANO-AGENTES.md. Toda saída continua no
-- Disparos, esperando a aprovação do Marcelo.
-- Idempotente, como os demais arquivos desta pasta.
-- =============================================================================

create table if not exists public.agentes (
  id                uuid primary key default gen_random_uuid(),
  empresa_id        uuid not null unique references public.empresas(id) on delete cascade,
  -- ativo = conta no limite de 10 (decisão do Marcelo, 29/09); pausado e encerrado não contam
  status            text not null default 'ativo' check (status in ('ativo','pausado','encerrado')),
  -- em que ponto o agente está, na ordem da Mesa (Fase 2)
  fase              text not null default 'novo'
                    check (fase in ('novo','trabalhando','pronto_aprovar','precisa_voce','esperando_lead','geladeira','ganho','perdido')),
  -- {tese, proxima_jogada, quando_parar, formato}
  plano             jsonb not null default '{}'::jsonb,
  -- {quem_e, decisor, fatos:[{fato,fonte,data}], hipoteses:[], objecoes:[], tentado:[], correcoes:[], lacunas:[]}
  memoria           jsonb not null default '{}'::jsonb,
  precisa_de_voce   text,
  proximo_ciclo_em  timestamptz,
  motivo_proximo    text,
  ultimo_ciclo_em   timestamptz,
  ciclos            int not null default 0,
  investigacoes     int not null default 0,
  ultima_investigacao_em timestamptz,
  designado_por     text,
  criado_em         timestamptz not null default now(),
  atualizado_em     timestamptz not null default now()
);
create index if not exists agentes_status_idx on public.agentes (status, fase);

-- O diário: um evento por ciclo (e por nota do Marcelo)
create table if not exists public.agente_eventos (
  id           uuid primary key default gen_random_uuid(),
  agente_id    uuid not null references public.agentes(id) on delete cascade,
  empresa_id   uuid not null references public.empresas(id) on delete cascade,
  -- designado, lead_respondeu, investigacao_pronta, pedido, prazo, nota
  gatilho      text not null,
  aconteceu    text,
  leitura      text,
  decisao      text,
  porque       text,
  -- o raciocínio inteiro (as 13 perguntas), o parecer do crítico, o que foi gravado
  dados        jsonb not null default '{}'::jsonb,
  job_id       uuid references public.jobs(id) on delete set null,
  autor        text not null default 'agente',
  criado_em    timestamptz not null default now()
);
create index if not exists agente_eventos_agente_idx on public.agente_eventos (agente_id, criado_em desc);

-- Disparos viram a caixa de saída dos agentes
alter table public.disparos add column if not exists tipo text;
alter table public.disparos add column if not exists agente_ciclo_id uuid references public.agente_eventos(id) on delete set null;
-- uma linha: por que esta mensagem, agora (aparece pro Marcelo antes de aprovar)
alter table public.disparos add column if not exists raciocinio text;
do $$
begin
  alter table public.disparos add constraint disparos_tipo_chk check (tipo is null or tipo in ('abertura','corpo','resposta','followup'));
exception when duplicate_object then null;
end $$;

drop trigger if exists hd_atualizado on public.agentes;
create trigger hd_atualizado before update on public.agentes for each row execute function public.hd_tocar_atualizado();

alter table public.agentes enable row level security;
alter table public.agente_eventos enable row level security;
revoke all on public.agentes from anon;
revoke all on public.agente_eventos from anon;
grant select, insert, update, delete on public.agentes to authenticated;
grant select, insert, update, delete on public.agente_eventos to authenticated;
drop policy if exists hd_operador on public.agentes;
create policy hd_operador on public.agentes for all to authenticated using (public.eh_operador()) with check (public.eh_operador());
drop policy if exists hd_operador on public.agente_eventos;
create policy hd_operador on public.agente_eventos for all to authenticated using (public.eh_operador()) with check (public.eh_operador());

do $$
begin
  execute 'alter publication supabase_realtime add table public.agentes';
exception when duplicate_object then null;
end $$;
do $$
begin
  execute 'alter publication supabase_realtime add table public.agente_eventos';
exception when duplicate_object then null;
end $$;
