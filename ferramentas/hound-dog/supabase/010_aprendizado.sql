-- =============================================================================
-- 010 — Aprendizado dos disparos (29/09/2026)
-- Motivo: quando o Marcelo editava o texto no Disparos, o original do Claude se
-- perdia, e a correção dele não ensinava nada. Agora o banco guarda a primeira
-- versão (texto_original) e o resultado do verificador mecânico (revisao), e o
-- scripts/aprender.mjs compara as duas pra virar regra em _memoria/prospeccao/.
-- Idempotente, como os demais arquivos desta pasta.
-- =============================================================================

alter table public.disparos add column if not exists texto_original text;
-- [{regra, nivel: 'veto'|'aviso', trecho, dica}] — saída de app/js/revisor.js no momento em que o rascunho nasceu
alter table public.disparos add column if not exists revisao jsonb;

-- Guarda o texto do Claude na primeira edição, venha ela do painel, do MCP ou de script
create or replace function public.hd_guardar_texto_original() returns trigger language plpgsql as $$
begin
  if new.texto is distinct from old.texto and old.texto_original is null then
    new.texto_original := old.texto;
  end if;
  return new;
end $$;

drop trigger if exists hd_texto_original on public.disparos;
create trigger hd_texto_original before update of texto on public.disparos
  for each row execute function public.hd_guardar_texto_original();
