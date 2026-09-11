# Cannonball — motor de acervo (trazido em 04/09/2026)

**Repo:** https://github.com/harebeats/cannonball · MIT · PT-BR · Python (só biblioteca padrão)

Plugin de Claude Code que guarda as peças de site que a gente já fez e as encontra
de volta **antes** de gerar qualquer coisa do zero. Ciclo:

```
ingerir → indexar → buscar → montar → registrar armadilha → ingerir…
```

## Onde mora o quê

- `_biblioteca/cannonball/` — o **motor** (scripts, skills, references). **Gitignorado**,
  é dependência de terceiro (igual impeccable). Re-clonar:
  `git clone https://github.com/harebeats/cannonball.git _biblioteca/cannonball`
- `_biblioteca/acervo/` — **as nossas peças**. Versionado, é o valor. Começou com as
  3 peças de exemplo do cannonball como template de ficha bem escrita; enche com o que
  a Horus já construiu (carrinho da Amparo, páginas da Aion, etc.).

## Regra: prateleira, não comando

Não instalar as 10 skills `kit-*` em `.claude/skills/`. Motivo: `kit-cor` e `kit-tipo`
**pisam** na nossa doutrina de `_memoria/design/` (10-tipografia, 20-cor), que é mais
calibrada (passe duplo, antipadrões, compliance). Mineração sob demanda, não roteamento
ativo. Consistente com o bloco anti-teatro do Conselho: mais ponto de entrada não é mais
precisão.

## As 10 skills (referência)

| Skill | Função | Nosso equivalente |
|---|---|---|
| `kit-ingerir` | alimenta o acervo (arquivo, projeto, shadcn, MCP) | — |
| `kit-buscar` | "o que eu já tenho pronto pra isso?" | parcial (`referencias/`, `inspiracoes/`) |
| `kit-montar` | monta site combinando peças validadas | `/criar-site` |
| `kit-curar` | acha duplicata, ficha ruim, lacuna | — |
| `kit-cor` | paleta por papel + contraste | `_memoria/design/20-cor.md` (nosso vence) |
| `kit-tipo` | **licença de fonte** + substituto livre + escala | `10-tipografia.md` (SEM a parte de licença) |
| `kit-adaptar` | adapta peça do acervo pra marca nova | `/redesign-skill` |
| `kit-prompt` | prompt de página inteira | parcial |
| `kit-otimizar-3d` | otimização de asset 3D | — |
| `lab` | laboratório visual (exige Node) | `/impeccable live` |

## Os dois achados pra minerar primeiro

1. **Licença de fonte (`scripts/tipo.py`).** A gente monta site a partir de referência o
   tempo todo, e site de marca paga por tipografia. O script traz tabela de fontes livres
   (Google Fonts, Fontshare) com substituto por desenho: General Sans↔Aeonik, Switzer↔Suisse.
   A gente **não tem** essa cobertura — é exposição jurídica real. Candidato a virar linha
   em `_memoria/design/10-tipografia.md`.
2. **`armadilhas.json`** — registro de bug com origem e gravidade, por peça. É a versão
   TÉCNICA da nossa regra "correção que morre no chat volta como erro no próximo site".
   Formato adotado no nosso acervo (ver `_biblioteca/acervo/README.md`).
