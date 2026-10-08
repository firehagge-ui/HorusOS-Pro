-- =============================================================================
-- 014 — Especialistas por segmento (Fase 3 dos agentes, 30/09/2026)
-- Motivo: cada agente aprendia sozinho. A lição da Cintya ("a assistente virtual
-- já faz o retorno") não chegava ao agente da Bioclin, do mesmo nicho. O
-- especialista é o dono do caderno do nicho (_memoria/prospeccao/segmentos/)
-- e das notas que valem pra todos os leads dele. O agente continua um por lead.
-- Idempotente, como os demais arquivos desta pasta.
-- =============================================================================

create table if not exists public.especialistas (
  id          text primary key,                 -- 'clinicas', 'eventos', 'oficinas'
  nome        text not null,                    -- o personagem na Mesa: Clara, Lia, Rafa
  segmento    text not null,                    -- 'Clínicas e estética'
  descricao   text,
  -- trechos que, achados na categoria da ficha (sem acento, minúsculo), ligam o lead a este especialista
  palavras    text[] not null default '{}',
  caderno     text not null,                    -- caminho no repositório
  -- o boneco em pixel art: {pele, cabelo, estilo, camisa, oculos, fone}
  aparencia   jsonb not null default '{}'::jsonb,
  ordem       int not null default 0,
  ativo       boolean not null default true,
  criado_em   timestamptz not null default now()
);

-- O que vale pra todos os leads do nicho. Válida entra no pedido de todo agente do nicho e no crítico;
-- proposta (tirada pelo agente de um ciclo) espera o Marcelo aceitar na Mesa.
create table if not exists public.especialista_notas (
  id               uuid primary key default gen_random_uuid(),
  especialista_id  text not null references public.especialistas(id) on delete cascade,
  empresa_id       uuid references public.empresas(id) on delete set null,
  texto            text not null,
  origem           text not null default 'marcelo' check (origem in ('marcelo','agente','resposta')),
  status           text not null default 'valida' check (status in ('proposta','valida','descartada')),
  autor            text,
  criado_em        timestamptz not null default now(),
  decidido_em      timestamptz
);
create index if not exists especialista_notas_idx on public.especialista_notas (especialista_id, status, criado_em desc);

alter table public.agentes add column if not exists especialista_id text references public.especialistas(id) on delete set null;

insert into public.especialistas (id, nome, segmento, descricao, palavras, caderno, aparencia, ordem) values
  ('clinicas', 'Clara', 'Clínicas e estética',
   'Odontologia, estética, fisioterapia e pilates, dermatologia, harmonização, psicologia. Recepção e robô na entrada, dona decide, compliance de conselho.',
   array['odonto','dent','estetic','fisio','pilates','clinica','saude','dermat','harmoniz','biomedic','psicolog','quiropraxia','osteopatia','implante','laser'],
   '_memoria/prospeccao/segmentos/clinicas.md',
   '{"pele":"#f2c29b","cabelo":"#7a3b1d","estilo":"longo","camisa":"#2fa36b","oculos":false,"fone":true,"genero":"f"}', 1),
  ('eventos', 'Lia', 'Eventos',
   'Espaço de eventos, salão de festas, buffet, cerimonial. Venda por orçamento e visita; nunca falar em pacote ou preço.',
   array['evento','festa','buffet','cerimonial','casamento','recepcoes'],
   '_memoria/prospeccao/segmentos/eventos.md',
   '{"pele":"#c98b5e","cabelo":"#1d1a22","estilo":"coque","camisa":"#8b6cf0","oculos":false,"fone":true,"genero":"f"}', 2),
  ('oficinas', 'Rafa', 'Oficinas',
   'Oficina mecânica, especializada de marca, performance. Atendente no WhatsApp, dono é outro; diferencial técnico escondido.',
   array['oficina','mecanic','automotiv','auto center','funilaria','motor'],
   '_memoria/prospeccao/segmentos/oficinas.md',
   '{"pele":"#e8b48a","cabelo":"#d9a13b","estilo":"curto","camisa":"#3f7fd9","oculos":true,"fone":true,"genero":"m"}', 3)
on conflict (id) do nothing;

alter table public.especialistas enable row level security;
alter table public.especialista_notas enable row level security;
revoke all on public.especialistas from anon;
revoke all on public.especialista_notas from anon;
grant select, insert, update, delete on public.especialistas to authenticated;
grant select, insert, update, delete on public.especialista_notas to authenticated;
drop policy if exists hd_operador on public.especialistas;
create policy hd_operador on public.especialistas for all to authenticated using (public.eh_operador()) with check (public.eh_operador());
drop policy if exists hd_operador on public.especialista_notas;
create policy hd_operador on public.especialista_notas for all to authenticated using (public.eh_operador()) with check (public.eh_operador());

do $$
begin
  execute 'alter publication supabase_realtime add table public.especialista_notas';
exception when duplicate_object then null;
end $$;
do $$
begin
  execute 'alter publication supabase_realtime add table public.especialistas';
exception when duplicate_object then null;
end $$;
