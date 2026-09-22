-- =============================================================================
-- 005 — Conversas: separar o que é do CRM do que é pessoal
-- Motivo (20/09/2026): o resumo do dia chamava atenção para mensagem da família
-- e de amigo, e repetia conversa que o Marcelo já tinha lido no celular.
-- Idempotente, como os demais arquivos desta pasta.
-- =============================================================================

-- Conversa marcada como pessoal: continua visível, mas fica fora do resumo do
-- dia, do contador do menu e da análise automática do Claude.
alter table public.whatsapp_conversas add column if not exists silenciada boolean not null default false;

-- Quando o WhatsApp avisou que a conversa foi lida (no celular ou aqui).
alter table public.whatsapp_conversas add column if not exists lida_em timestamptz;

create index if not exists wa_conversas_empresa_idx on public.whatsapp_conversas (empresa_id) where empresa_id is not null;
create index if not exists wa_conversas_nao_lidas_idx on public.whatsapp_conversas (nao_lidas) where nao_lidas > 0;
