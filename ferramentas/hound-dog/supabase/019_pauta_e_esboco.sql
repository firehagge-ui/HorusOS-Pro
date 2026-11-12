-- =============================================================================
-- 019 — Mídia: tema e esboço viram etapas do post (03/11/2026)
-- Motivo: o Marcelo não abre sessão toda semana. As duas aprovações da regra de 28/10
-- (temas, depois esboço) passam a acontecer no painel (Instagram › Semana), e o
-- Farejador faz o resto sozinho: pauta (quinta) → tema → esboço → imagens e slides.
--   tema   = ideia da pauta esperando o ok do Marcelo
--   esboco = texto, imagem e layout slide a slide esperando o ok do Marcelo
-- Idempotente.
-- =============================================================================
alter table public.social_posts drop constraint if exists social_posts_status_check;
alter table public.social_posts add constraint social_posts_status_check
  check (status in ('tema','esboco','planejado','criando','revisao','aguardando','ajuste','aprovado',
                    'agendado','publicando','publicado','medido','reprovado','erro'));
