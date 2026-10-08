-- =============================================================================
-- 016 · Quando cada lead da lista foi enriquecido (01/10/2026)
-- O "Enriquecer top 10" completava os dados e não deixava rastro: o Marcelo não achava
-- o que tinha mudado, e o top 10 seguinte pegava de novo os mesmos (o score sobe depois
-- de enriquecer). Agora o item guarda a data e o job que o enriqueceu.
-- Idempotente.
-- =============================================================================
alter table public.lista_itens add column if not exists enriquecido_em timestamptz;
alter table public.lista_itens add column if not exists enriquecido_job uuid;

-- Os enriquecimentos que já rodaram antes desta coluna existir
update public.lista_itens i set enriquecido_em = j.concluido_em, enriquecido_job = j.id
from public.jobs j
where j.tipo = 'enriquecer_lista' and j.status = 'concluido' and j.concluido_em is not null
  and i.id::text in (select jsonb_array_elements_text(j.entrada->'item_ids'))
  and (i.enriquecido_em is null or i.enriquecido_em < j.concluido_em);
