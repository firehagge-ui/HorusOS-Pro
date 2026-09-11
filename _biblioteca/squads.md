# Squads — doutrina de terceiro pra minerar (trazido em 04/09/2026)

**Repo:** https://github.com/ohmyjahh/xquads-squads · declara MIT nos squad.yaml (sem arquivo LICENSE)

12 squads de agentes-persona (o `copy-squad` foi descartado na entrada: 22 dos 23
arquivos eram byte a byte idênticos ao `copy-master`). Cada persona é um `.md` denso
com a metodologia de uma pessoa real (Ogilvy, Sobral, Aaker, Campbell...).

- `_biblioteca/squads/` — **gitignorado**, dependência de terceiro. Re-clonar:
  `git clone https://github.com/ohmyjahh/xquads-squads.git _biblioteca/squads`
  (depois remover `.next/`, `.DS_Store` e `copy-squad/`)

## Regra: prateleira, não comando

**Não** jogar em `.claude/commands/`. Dois motivos: (1) diluição de roteamento — 358
arquivos virariam ponto de entrada e minha escolha piora, não melhora; (2) colisão de
precedência — como comando ativo, `/copy-squad` roda sem conhecer a trava de compliance
do cliente. Como prateleira: mineração sob demanda, e a ordem da casa
(compliance > integridade > marca > design/conteúdo > terceiro) continua valendo.

## Nota de idioma e origem

155 personas únicas, ~175 em inglês. Inglês **não trava** consulta (a saída sai em
PT-BR). Mas: é material americano de high ticket, mesma ressalva das mentes —
referência, nunca meta nem promessa ao cliente, e **compliance vence a persona**.

## Buracos nossos que os squads preenchem

As 8 mentes de `_conselho/mentes/` são quase todas de venda high-ticket. Faltam:

| Domínio | Candidato a promover (traduzido) | Squad de origem |
|---|---|---|
| Copy clássico | david-ogilvy, gary-halbert, eugene-schwartz | copy-master |
| Branding | david-aaker ou marty-neumeier | brand-squad |
| Storytelling | joseph-campbell ou nancy-duarte | storytelling |
| Tráfego BR | **pedro-sobral** (aplicável direto: Amparo, Washington) | traffic-masters |

Promoção = traduzir o essencial pra PT-BR, salvar em `_conselho/mentes/` com o cabeçalho
de ressalva das outras. Faz-se persona por persona, quando cada uma se prova num cliente
real — não em lote.

## Os 12 squads (referência)

advisory-board (11) · brand-squad (15) · c-level-squad (6) · claude-code-mastery (8) ·
copy-master (33) · cybersecurity (15) · data-squad (7) · design-squad (8) ·
hormozi-squad (16, mas Hormozi já é mente nossa) · movement (7, único em PT) ·
storytelling (12) · traffic-masters (16) · xquads (o meta-orquestrador).
