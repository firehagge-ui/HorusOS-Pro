-- =============================================================================
-- 013 — Conversas: só fica no CRM a conversa de quem é ficha
-- Motivo (30/09/2026, Marcelo): o Antônio também abre o painel, e conversa
-- pessoal do WhatsApp não pode estar ao alcance dele. Esconder na tela não
-- basta (o dado continuaria no banco), então a regra mora aqui:
--   1. conversa sem ficha (empresa_id nulo) não existe no banco;
--   2. o painel só enxerga conversa ligada a uma ficha, mesmo pedindo direto.
-- O Farejador também deixou de gravar número que não é ficha (whatsapp.mjs).
-- Idempotente, como os demais arquivos desta pasta.
-- =============================================================================

-- 1. Limpa o que já entrou solto (as mensagens vão junto pelo on delete cascade)
delete from public.whatsapp_conversas where empresa_id is null;

-- 2. Conversa que perde a ficha (desvincular, ficha apagada) sai do banco na hora
create or replace function public.hd_conversa_sem_ficha()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.empresa_id is null then
    delete from public.whatsapp_conversas where id = new.id;
  end if;
  return null;
end $$;

drop trigger if exists hd_conversa_sem_ficha on public.whatsapp_conversas;
create trigger hd_conversa_sem_ficha after insert or update of empresa_id on public.whatsapp_conversas
  for each row when (new.empresa_id is null) execute function public.hd_conversa_sem_ficha();

-- 3. Leitura pelo painel: só conversa (e mensagem) ligada a ficha
drop policy if exists hd_operador on public.whatsapp_conversas;
drop policy if exists hd_conversa_ler on public.whatsapp_conversas;
drop policy if exists hd_conversa_escrever on public.whatsapp_conversas;
-- (o with check aceita empresa_id nulo de propósito: "Tirar do CRM" zera a ficha e o gatilho apaga)
create policy hd_conversa_escrever on public.whatsapp_conversas for all to authenticated
  using (public.eh_operador() and empresa_id is not null) with check (public.eh_operador());

drop policy if exists hd_operador on public.whatsapp_mensagens;
drop policy if exists hd_mensagem_cliente on public.whatsapp_mensagens;
create policy hd_mensagem_cliente on public.whatsapp_mensagens for all to authenticated
  using (public.eh_operador() and exists (select 1 from public.whatsapp_conversas c where c.id = conversa_id and c.empresa_id is not null))
  with check (public.eh_operador() and exists (select 1 from public.whatsapp_conversas c where c.id = conversa_id and c.empresa_id is not null));
