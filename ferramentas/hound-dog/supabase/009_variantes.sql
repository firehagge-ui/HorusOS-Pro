-- =============================================================================
-- 009 — Variantes de abordagem no Disparos
-- Motivo (28/09/2026): o Marcelo pediu mais de uma abordagem por lead, com ângulos
-- diferentes, pra escolher na hora. Até aqui só cabia uma mensagem por passo: cada
-- versão nova cancelava a anterior. Agora cada passo tem até três variantes (A, B, C),
-- cada uma com um rótulo curto do ângulo. Aprovar uma descarta as outras do mesmo passo,
-- então só uma sai.
-- Idempotente, como os demais arquivos desta pasta.
-- =============================================================================

alter table public.disparos add column if not exists variante text not null default 'A';
alter table public.disparos add column if not exists angulo text;

do $$
begin
  alter table public.disparos add constraint disparos_variante_chk check (variante in ('A','B','C'));
exception when duplicate_object then null;
end $$;
