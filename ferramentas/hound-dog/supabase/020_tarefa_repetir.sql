-- =============================================================================
-- 020 · Tarefa que se repete (10/11/2026, pedido do Marcelo)
-- "Se for algo recorrente, que ela se repita quando marcarmos que foi feito."
-- Origem: o Claude dizia "medir todo dia 10", "conferir em 30 dias" e a data morria
-- no chat. Agora toda data vira tarefa, e a recorrente nasce de novo sozinha.
--
-- Como funciona (vale para o painel, o MCP e o Farejador, porque mora no banco):
-- - repetir_cada + repetir_unidade ('dia', 'semana', 'mes'): ex. 1 mes, 2 semana.
-- - Marcou feita → nasce uma cópia aberta, com o prazo seguinte contado a partir do
--   prazo da que acabou (mantém o ritmo: "todo dia 10" continua dia 10). Se esse dia já
--   passou, anda até a primeira data a partir de amanhã. Sábado e domingo vão para a
--   segunda (o hd_salvar_tarefa recusa fim de semana desde 21/10).
-- - Desmarcou (desfazer) → a cópia que ainda está "a fazer" é apagada.
-- - repetiu_de liga a cópia à tarefa que a gerou.
-- Idempotente.
-- =============================================================================

alter table public.tarefas add column if not exists repetir_cada int;
alter table public.tarefas add column if not exists repetir_unidade text;
alter table public.tarefas add column if not exists repetiu_de uuid references public.tarefas(id) on delete set null;

do $$
begin
  alter table public.tarefas add constraint tarefas_repetir_ok check (
    (repetir_cada is null and repetir_unidade is null)
    or (repetir_cada between 1 and 365 and repetir_unidade in ('dia', 'semana', 'mes'))
  );
exception when duplicate_object then null;
end $$;

create index if not exists tarefas_repetiu_de_idx on public.tarefas (repetiu_de);

-- Próxima data útil de uma tarefa que se repete
create or replace function public.hd_proxima_data(base date, cada int, unidade text)
returns date language plpgsql stable as $$
declare
  passo interval := case unidade when 'dia' then make_interval(days => cada)
                                 when 'semana' then make_interval(weeks => cada)
                                 else make_interval(months => cada) end;
  hoje date := (now() at time zone 'America/Bahia')::date;
  d date := coalesce(base, hoje);
  n int := 1;
begin
  -- conta sempre a partir da base (mês a mês não escorrega: 31/01 → 28/02 → 31/03)
  d := (coalesce(base, hoje) + passo * n)::date;
  while d <= hoje and n < 2000 loop
    n := n + 1;
    d := (coalesce(base, hoje) + passo * n)::date;
  end loop;
  if extract(isodow from d) = 6 then d := d + 2; end if;
  if extract(isodow from d) = 7 then d := d + 1; end if;
  return d;
end $$;

create or replace function public.hd_tarefa_repetir()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.repetir_cada is null then return null; end if;

  if new.status = 'feita' and old.status is distinct from 'feita' then
    -- não cria duas vezes (feita → desfeita → feita de novo com a cópia ainda aberta)
    if not exists (select 1 from tarefas where repetiu_de = new.id and status in ('a_fazer', 'fazendo', 'travada')) then
      insert into tarefas (titulo, descricao, pronto_quando, area, prioridade, status, responsavel, prazo, marco, objetivo,
                           empresa_id, ordem, privada, projeto, repetir_cada, repetir_unidade, repetiu_de, criado_por)
      values (new.titulo, new.descricao, new.pronto_quando, new.area, new.prioridade, 'a_fazer', new.responsavel,
              hd_proxima_data(new.prazo, new.repetir_cada, new.repetir_unidade), new.marco, new.objetivo,
              new.empresa_id, new.ordem, new.privada, new.projeto, new.repetir_cada, new.repetir_unidade, new.id, 'repetição');
    end if;
  elsif old.status = 'feita' and new.status is distinct from 'feita' then
    delete from tarefas where repetiu_de = new.id and status = 'a_fazer' and criado_por = 'repetição';
  end if;
  return null;
end $$;

drop trigger if exists hd_repetir on public.tarefas;
create trigger hd_repetir after update of status on public.tarefas for each row execute function public.hd_tarefa_repetir();
