-- =============================================================================
-- 018 · Tarefa privada (21/10/2026, pedido do Marcelo)
-- O Antônio vira operador do painel. Tarefa marcada como privada só o dono vê
-- (nem na lista, nem no tempo real, nem pela API): o acompanhamento interno do
-- Marcelo não aparece pra ele. A trava é no banco (RLS), não só na tela.
-- Idempotente.
-- =============================================================================

alter table public.tarefas add column if not exists privada boolean not null default false;

drop policy if exists hd_operador on public.tarefas;
drop policy if exists hd_tarefa_ler on public.tarefas;
drop policy if exists hd_tarefa_criar on public.tarefas;
drop policy if exists hd_tarefa_mudar on public.tarefas;
drop policy if exists hd_tarefa_apagar on public.tarefas;

create policy hd_tarefa_ler on public.tarefas for select to authenticated
  using (public.eh_operador() and (not privada or public.eh_dono()));
create policy hd_tarefa_criar on public.tarefas for insert to authenticated
  with check (public.eh_operador() and (not privada or public.eh_dono()));
create policy hd_tarefa_mudar on public.tarefas for update to authenticated
  using (public.eh_operador() and (not privada or public.eh_dono()))
  with check (public.eh_operador() and (not privada or public.eh_dono()));
create policy hd_tarefa_apagar on public.tarefas for delete to authenticated
  using (public.eh_operador() and (not privada or public.eh_dono()));
