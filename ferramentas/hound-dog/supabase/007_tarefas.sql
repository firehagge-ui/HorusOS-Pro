-- =============================================================================
-- 007 — Tarefas: o que precisa ser feito, por quem e até quando
-- Motivo (27/09/2026): o Marcelo quer executar o plano de negócio da Hórus
-- (`_gestao/plano-de-negocio.md`) e as pendências gerais da casa num lugar só,
-- com prazo, prioridade e check. A Agenda é compromisso com hora marcada; tarefa
-- é outra coisa ("abrir o CNPJ até 10/10" não tem horário).
-- Divisão: o plano diz para onde e por quê; esta tabela diz o quê, quem e quando.
-- Responsável é texto livre (Marcelo, Antônio): o Antônio não é operador do painel,
-- o Marcelo marca o check por ele.
-- Idempotente, como os demais arquivos desta pasta.
-- =============================================================================

create table if not exists public.tarefas (
  id             uuid primary key default gen_random_uuid(),
  titulo         text not null,
  descricao      text,
  -- o "pronto" da tarefa: como se sabe que acabou
  pronto_quando  text,
  area           text not null default 'geral'
                 check (area in ('plano','comercial','cliente','producao','marketing','financeiro','admin','seguranca','ferramentas','geral')),
  prioridade     text not null default 'media' check (prioridade in ('alta','media','baixa')),
  status         text not null default 'a_fazer'
                 check (status in ('a_fazer','fazendo','travada','feita','cancelada')),
  responsavel    text not null default 'Marcelo',
  prazo          date,
  -- marco do plano: m1 (90 dias, até 26/12/2026), m2 (6 meses), m3 (12 meses), m4 (24 meses)
  marco          text check (marco in ('m1','m2','m3','m4')),
  -- objetivo do plano a que a tarefa serve (ex.: "O1 Caixa")
  objetivo       text,
  depende_de     uuid[] not null default '{}',
  empresa_id     uuid references public.empresas(id) on delete set null,
  motivo_trava   text,
  ordem          int not null default 0,
  concluida_em   timestamptz,
  concluida_obs  text,
  criado_por     text,
  criado_em      timestamptz not null default now(),
  atualizado_em  timestamptz not null default now()
);
create index if not exists tarefas_status_prazo_idx on public.tarefas (status, prazo);
create index if not exists tarefas_empresa_idx on public.tarefas (empresa_id);

-- Marca a data de conclusão sozinho (vale para o painel, o MCP e o Farejador)
create or replace function public.hd_tarefa_concluida()
returns trigger language plpgsql as $$
begin
  if new.status = 'feita' and (old.status is distinct from 'feita') then
    new.concluida_em := coalesce(new.concluida_em, now());
  elsif new.status <> 'feita' then
    new.concluida_em := null;
  end if;
  return new;
end $$;

drop trigger if exists hd_atualizado on public.tarefas;
create trigger hd_atualizado before update on public.tarefas for each row execute function public.hd_tocar_atualizado();
drop trigger if exists hd_concluida on public.tarefas;
create trigger hd_concluida before insert or update on public.tarefas for each row execute function public.hd_tarefa_concluida();

alter table public.tarefas enable row level security;
revoke all on public.tarefas from anon;
grant select, insert, update, delete on public.tarefas to authenticated;
drop policy if exists hd_operador on public.tarefas;
create policy hd_operador on public.tarefas for all to authenticated using (public.eh_operador()) with check (public.eh_operador());

do $$
begin
  execute 'alter publication supabase_realtime add table public.tarefas';
exception when duplicate_object then null;
end $$;
