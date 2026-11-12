# Índice das skills — Horus OS

Mapa de todas as skills instaladas, por função. Não é skill (não tem `SKILL.md`), é
índice. Detalhe de estilo visual continua em `identidade/catalogo-estilos.md`; regra de
roteamento de estilo e precedência das `kit-*` no `CLAUDE.md`.

> Atualizado em 09/11/2026 — 57 skills locais, 11 desligadas em `skillOverrides`. Ao criar/instalar
> skill nova, adicionar aqui.

## Operação da casa
| Skill | Pra quê |
|---|---|
| `abrir` | carrega a memória e abre a sessão de trabalho |
| `salvar` | commit + push (backup no GitHub) |
| `atualizar` | retrospectiva (o que o Marcelo corrigiu, escolheu e elogiou nas conversas vira regra, checklist ou script; script `mensagens-do-marcelo.cjs`) + varredura e reconciliação da memória com o estado real |
| `instalar` | primeiro setup do Horus OS |
| `novo-projeto` | cria pasta de projeto/cliente com CLAUDE.md dedicado |
| `mapear-rotinas` | entrevista e gera skills personalizadas |
| `verificar` | verificação obrigatória antes de declarar pronto |
| `ver-no-celular` | serve site local na rede pra abrir no celular (preview antes de publicar) |
| `criacao-canonica-de-skills` | método pesado e auditor mecânico pra refatorar skill que não funciona ou transformar base grande em skill (veio do MazyOS, 09/11/2026); skill simples segue a skill-creator nativa |

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
| `carrossel` | central de post: pauta por tendência → formato e gancho → fala humana → ChatGPT pelo Chrome → HTML→PNG → checklist; estuda post/reel de referência (10/10/2026) |
| `email-profissional` | rascunho de email calibrado |
| `responder-avaliacoes` | resposta a avaliações |
| `midia` | agente de social media (Mídia): planeja, escreve e publica o Instagram aprovado |
| `prospeccao` | a porta de toda mensagem pra lead ou cliente: primeira mensagem, conversa com o lead que respondeu e mensagem pra cliente, alinhada à pesquisa de 09/10 e à fala humana (junta `revisar-mensagem`, `responder-lead` e a fala humana da `carrossel`, 03/11/2026) |
| `prospecta-maps` | lista de leads pelo Google Maps com CNPJ conferido, pra triagem da esteira, ao lado do Spark (veio do MazyOS, 09/11/2026; travas da Horus no topo da skill) |

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
| `output-skill` | utilitário de saída (desligado) |

## Estilos de marca (escolher UM por peça — ver catalogo-estilos.md)
Removidos em 09/11/2026 a pedido do Marcelo. A marca do cliente e `_memoria/design/` definem o visual.

## Engavetadas pelo Marcelo (não listar, não sugerir, não apontar no /atualizar)
As pastas continuam em `.claude/skills/`, mas estão **engavetadas por decisão do Marcelo**. Não são
pendência de documentação: o `/atualizar` não deve mais propor listá-las.
`asking-with-evidence` · `configuring-vision` · `extracting-structure` · `learning-from-mistakes` ·
`recovering-from-errors` · `sharing-results` · `the-loop` · `video-memory` · `watch` · `watching-videos`
(registrado em 01/10/2026).

## Geração de mídia — REMOVIDA em 07/09/2026
🔴 O Higgsfield foi **abandonado** (decisão do Marcelo) e as 8 skills `higgsfield-*` foram
arrancadas de `.claude/skills/`. Não reinstalar, não recomendar. Geração de imagem hoje é
só **ChatGPT manual**: o Marcelo gera e traz o arquivo; o Horus OS não gera imagem sozinho.
Detalhe no `CLAUDE.md` da raiz, seção "Geração de mídia".

---

**Dependências gitignoradas** (não versionadas, reinstalar por comando): `impeccable/`
(`npx --yes impeccable@4.8.2 install -y --providers=claude --project` (depois conferir os hooks em `.claude/settings.json`), `taste-skill/assets/` (34 MB, baixar de `Leonxlnx/taste-skill`)). As `kit-*` são versionadas (adaptadas e vinculadas ao
nosso acervo); o motor pristino fica em `_biblioteca/cannonball/` (gitignorado).
