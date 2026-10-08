-- =============================================================================
-- 015 · Desistência controlada (01/10/2026, pedido do Marcelo)
-- O agente não encerra mais um lead sozinho. Quando os sinais dizem que insistir não faz
-- sentido agora (tentativas sem resposta, dias de silêncio, recusa clara), ele RECOMENDA:
-- pôr na geladeira com data de voltar, encerrar como perdido ou marcar ganho. A
-- recomendação fica aqui até o Marcelo aprovar, mudar a data ou mandar continuar.
-- Idempotente.
-- =============================================================================

-- {tipo: 'geladeira'|'perdido'|'ganho', motivos: [texto], voltar_em: date|null, resumo: texto,
--  sinais: {tentativas_sem_resposta, dias_sem_resposta, ...}, criado_em, autor: 'agente'|'farejador'}
alter table public.agentes add column if not exists recomendacao jsonb;

comment on column public.agentes.recomendacao is
  'Desistência controlada: o que o agente recomenda fazer com o lead (geladeira, perdido, ganho) e por quê. Só vale com o Marcelo aprovando na Mesa.';
