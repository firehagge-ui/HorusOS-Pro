-- =============================================================================
-- 017 · Projeto nas tarefas + Estúdio do Instagram (21/10/2026, pedido do Marcelo)
-- 1) tarefas.projeto: agrupa tarefas que servem ao mesmo fim (Tráfego, Icarus,
--    Empresa, Teste do Antônio...). Não substitui o objetivo do plano (O1 a O7):
--    o objetivo diz POR QUE, o projeto diz DO QUE a tarefa faz parte.
-- 2) Estúdio (editor de carrossel no painel): o operador sobe imagens e slides
--    renderizados no bucket público "midia", só embaixo de horus/estudio/.
--    O resto do bucket continua só com a chave de serviço (Farejador).
-- Idempotente.
-- =============================================================================

alter table public.tarefas add column if not exists projeto text;
create index if not exists tarefas_projeto_idx on public.tarefas (projeto) where projeto is not null;

drop policy if exists hd_estudio_ler on storage.objects;
create policy hd_estudio_ler on storage.objects for select to authenticated
  using (bucket_id = 'midia' and name like 'horus/estudio/%' and public.eh_operador());

drop policy if exists hd_estudio_enviar on storage.objects;
create policy hd_estudio_enviar on storage.objects for insert to authenticated
  with check (bucket_id = 'midia' and name like 'horus/estudio/%' and public.eh_operador());

drop policy if exists hd_estudio_trocar on storage.objects;
create policy hd_estudio_trocar on storage.objects for update to authenticated
  using (bucket_id = 'midia' and name like 'horus/estudio/%' and public.eh_operador())
  with check (bucket_id = 'midia' and name like 'horus/estudio/%' and public.eh_operador());

drop policy if exists hd_estudio_apagar on storage.objects;
create policy hd_estudio_apagar on storage.objects for delete to authenticated
  using (bucket_id = 'midia' and name like 'horus/estudio/%' and public.eh_operador());
