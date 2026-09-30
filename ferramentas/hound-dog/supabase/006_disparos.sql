-- =============================================================================
-- 006 — Disparos: mensagens de prospecção que o Marcelo aprova e o Farejador envia
-- Motivo (24/09/2026): o Marcelo quer pedir disparos de onde estiver. Regra nova:
-- o Claude pesquisa, verifica cada frase e prepara; o Marcelo aprova o texto
-- exato; o Farejador envia pelo WhatsApp conectado, no máximo 10 por dia, com
-- 4 a 7 minutos aleatórios entre um e outro, e para o lote no primeiro erro.
-- Idempotente, como os demais arquivos desta pasta.
-- =============================================================================

create table if not exists public.disparos (
  id               uuid primary key default gen_random_uuid(),
  empresa_id       uuid not null references public.empresas(id) on delete cascade,
  telefone         text not null,
  texto            text not null,
  -- A/B de 24/09: 'casa' = doutrina §8/§10 (fato + o que eu faço + licença);
  -- 'curiosidade' = sem oferta, fecha com pergunta sobre o negócio
  formato          text not null default 'casa' check (formato in ('casa','curiosidade')),
  passo            int  not null default 1,
  -- [{frase, fonte, como_conferiu}] — toda frase que afirma fato, conferida por dois caminhos
  verificacao      jsonb not null default '[]'::jsonb,
  status           text not null default 'rascunho'
                   check (status in ('rascunho','aprovado','agendado','enviando','enviado','erro','cancelado')),
  agendado_para    timestamptz,
  lote_id          uuid,
  aprovado_por     text,
  aprovado_em      timestamptz,
  enviado_em       timestamptz,
  wa_id            text,
  erro             text,
  followup_em      timestamptz,
  respondeu        boolean not null default false,
  criado_por       text,
  criado_em        timestamptz not null default now(),
  atualizado_em    timestamptz not null default now()
);
create index if not exists disparos_status_idx on public.disparos (status, agendado_para);
create index if not exists disparos_empresa_idx on public.disparos (empresa_id);

drop trigger if exists hd_atualizado on public.disparos;
create trigger hd_atualizado before update on public.disparos for each row execute function public.hd_tocar_atualizado();

alter table public.disparos enable row level security;
revoke all on public.disparos from anon;
grant select, insert, update, delete on public.disparos to authenticated;
drop policy if exists hd_operador on public.disparos;
create policy hd_operador on public.disparos for all to authenticated using (public.eh_operador()) with check (public.eh_operador());

do $$
begin
  execute 'alter publication supabase_realtime add table public.disparos';
exception when duplicate_object then null;
end $$;
