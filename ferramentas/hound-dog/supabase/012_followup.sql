-- =============================================================================
-- 012 — Follow-up programado (30/09/2026)
-- Motivo: Land Car e Autobahn ficaram quase 6 dias sem resposta ao corpo, sem
-- follow-up e sem ninguém cuidando; Talina e Cintya responderam e ficaram ~20h sem
-- resposta nossa (o resumo das 8h só via mensagem NÃO LIDA, e o Marcelo já tinha
-- aberto no celular). Pedido do Marcelo: um sistema que identifique o silêncio e
-- deixe o follow-up pronto e programado. A regra da casa continua: um follow-up
-- no 4º dia (_memoria/prospeccao/20-escrita.md §10), e nada sai sem aprovação.
-- Idempotente, como os demais arquivos desta pasta.
-- =============================================================================

-- Quando o follow-up deveria sair (o Marcelo aprova e ele fica agendado pra essa hora)
alter table public.disparos add column if not exists sugerido_para timestamptz;

-- Até qual mensagem do lead o Marcelo já foi avisado de que está devendo resposta (um aviso por fala do lead)
alter table public.whatsapp_conversas add column if not exists lembrete_resposta_em timestamptz;
