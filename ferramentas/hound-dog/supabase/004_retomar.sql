-- =============================================================================
-- HOUND DOG — tarefas que esperam (limite da assinatura do Claude, rede fora do ar)
-- voltam para a fila com hora marcada para retomar sozinhas.
-- =============================================================================
alter table public.jobs add column if not exists retomar_em timestamptz;
alter table public.jobs add column if not exists tentativas int not null default 0;
create index if not exists jobs_retomar_idx on public.jobs (status, retomar_em);
