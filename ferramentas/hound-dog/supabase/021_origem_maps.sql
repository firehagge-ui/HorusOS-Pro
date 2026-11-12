-- 10/11/2026: listas que vêm da busca no Google Maps (botão Buscar, sem Claude). Idempotente.
alter table listas drop constraint if exists listas_origem_check;
alter table listas add constraint listas_origem_check check (origem in ('spark','claude','planilha','manual','network','maps'));
