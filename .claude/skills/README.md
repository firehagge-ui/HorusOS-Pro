# Índice das skills — Horus OS

Mapa de todas as skills instaladas, por função. Não é skill (não tem `SKILL.md`), é
índice. Detalhe de estilo visual continua em `identidade/catalogo-estilos.md`; regra de
roteamento de estilo e precedência das `kit-*` no `CLAUDE.md`.

> Atualizado em 10/09/2026 — 52 skills locais (contagem real de `.claude/skills/`; o
> número de 04/09 incluía as 8 `higgsfield-*`, removidas em 07/09). Ao criar/instalar
> skill nova, adicionar aqui.

## Operação da casa
| Skill | Pra quê |
|---|---|
| `abrir` | carrega a memória e abre a sessão de trabalho |
| `salvar` | commit + push (backup no GitHub) |
| `atualizar` | varredura e reconciliação da memória com o estado real |
| `instalar` | primeiro setup do Horus OS |
| `novo-projeto` | cria pasta de projeto/cliente com CLAUDE.md dedicado |
| `mapear-rotinas` | entrevista e gera skills personalizadas |
| `verificar` | verificação obrigatória antes de declarar pronto |
| `ver-no-celular` | serve site local na rede pra abrir no celular (preview antes de publicar) |

## Decisão (Conselho)
| Skill | Pra quê |
|---|---|
| `conselho` | sessão completa de deliberação |
| `debate` | versão leve, só o debate entre cargos |
| `consultar` | uma mente/cargo só |
| `comparar` | duas mentes lado a lado |

## Site — fluxo
| Skill | Pra quê |
|---|---|
| `criar-site` | orquestra o site do zero (pré-voo → estudo → plano → build → verificar) |
| `estudar-site` | teardown de referência (URL ou imagem) |
| `redesign-skill` | upgrade de site existente |

## Acervo de peças (cannonball — ver precedência no CLAUDE.md)
| Skill | Pra quê |
|---|---|
| `kit-buscar` | "o que já tenho pronto?" — roda ANTES de gerar do zero |
| `kit-ingerir` | guarda peça nova no acervo |
| `kit-montar` | compõe site a partir do acervo (dentro da /criar-site, não no lugar dela) |
| `kit-curar` | saúde do acervo (duplicata, ficha ruim, import quebrado) |
| `kit-adaptar` | lê/traduz/adapta prompt de site de fora |
| `kit-prompt` | gera prompt de construção pra outra ferramenta |
| `kit-cor` | paleta (⚠️ `_memoria/design/20-cor.md` vence) |
| `kit-tipo` | tipografia + **licença de fonte** (a parte exclusiva; resto: `10-tipografia.md` vence) |
| `kit-otimizar-3d` | otimização de cena WebGL/three.js pra mobile |
| `lab` | laboratório 3D local (exige Node) |

## Conteúdo e atendimento
| Skill | Pra quê |
|---|---|
| `carrossel` | carrossel/post visual (HTML→PNG) |
| `publicar-tema` | fluxo de criação de conteúdo por tema |
| `aprovar-post` | aprova e publica post da fila (blog + Instagram/Facebook) |
| `email-profissional` | rascunho de email calibrado |
| `responder-avaliacoes` | resposta a avaliações |

## Marketing e dados
| Skill | Pra quê |
|---|---|
| `seo` | fluxo SEO/GEO/Google Ads em 8 passos |
| `anuncio-google` | estrutura de campanha Google Ads (CSV) |
| `relatorio-ads` | relatório de tráfego pago |
| `analisar-dados` | resumo executivo de arquivo de dados |

## Design tooling (meta-skills, direção e auditoria)
| Skill | Pra quê |
|---|---|
| `impeccable` | design/redesign/auditoria de UI (detector é prova; ver seção no CLAUDE.md) |
| `design-dna` | extrai/define/aplica identidade em 3 dimensões |
| `frontend-design` | direção de design anti-template (Anthropic) |
| `taste-skill` | anti-slop pra landing/portfólio |
| `gpt-tasteskill` | motion GSAP + randomização de layout |
| `scrollcraft` | landing scroll-driven premium |
| `shadcn` | componentes React/Tailwind (só projeto React) |
| `brandkit` | boards de brand guidelines |
| `image-to-code-skill` | imagem → código de site |
| `imagegen-frontend-web` / `imagegen-frontend-mobile` | referências de design por imagem |
| `output-skill`, `stitch-skill` | utilitários de saída/composição |

## Estilos de marca (escolher UM por peça — ver catalogo-estilos.md)
`brutalist-skill` · `minimalist-skill` · `riso` · `soft-skill`

## Geração de mídia — REMOVIDA em 07/09/2026
🔴 O Higgsfield foi **abandonado** (decisão do Marcelo) e as 8 skills `higgsfield-*` foram
arrancadas de `.claude/skills/`. Não reinstalar, não recomendar. Geração de imagem hoje é
só **ChatGPT manual**: o Marcelo gera e traz o arquivo; o Horus OS não gera imagem sozinho.
Detalhe no `CLAUDE.md` da raiz, seção "Geração de mídia".

---

**Dependências gitignoradas** (não versionadas, reinstalar por comando): `impeccable/`
(`npx impeccable@4.0.4 install`). As `kit-*` são versionadas (adaptadas e vinculadas ao
nosso acervo); o motor pristino fica em `_biblioteca/cannonball/` (gitignorado).
