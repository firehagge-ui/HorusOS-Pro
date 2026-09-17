-- =============================================================================
-- HOUND DOG — funções auxiliares
-- =============================================================================

-- Tira acento sem depender da extensão unaccent (usada na deduplicação por nome)
create or replace function public.unaccent_simples(t text)
returns text language sql immutable parallel safe as $$
  select translate(coalesce(t, ''),
    'áàâãäåéèêëíìîïóòôõöúùûüçñÁÀÂÃÄÅÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑ',
    'aaaaaaeeeeiiiiooooouuuucnAAAAAAEEEEIIIIOOOOOUUUUCN');
$$;

-- Estatística rápida das listas (usada no painel)
create or replace view public.vw_listas_resumo with (security_invoker = true) as
select l.id, l.nome, l.origem, l.nicho, l.cidade, l.total, l.status, l.criado_em,
       count(i.id) filter (where i.prioridade = 'alta' and not i.descartado) as alta,
       count(i.id) filter (where i.empresa_id is not null) as no_crm,
       count(i.id) filter (where i.descartado) as descartados
from public.listas l
left join public.lista_itens i on i.lista_id = l.id
group by l.id;

revoke all on public.vw_listas_resumo from anon;
grant select on public.vw_listas_resumo to authenticated;
