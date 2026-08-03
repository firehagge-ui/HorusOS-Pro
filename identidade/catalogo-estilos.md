# Catálogo de estilos visuais

> Mapa das skills de design do MazyOS. Serve pra o Claude (e pra você) saber
> **qual skill puxar** ao produzir uma peça. Não é decoração — é o índice que
> conecta um pedido ("cria no estilo editorial") à skill certa.
>
> Regra de ouro: a identidade do CLIENTE (`clientes/<nome>/marca.md`) sempre
> manda. O estilo daqui é só o "sotaque" visual — nunca sobrescreve cor, fonte
> ou logo já definidos na marca do cliente. Estilo preenche o que a marca
> deixou em aberto.

---

## Como o Claude escolhe um estilo

1. **Cliente tem estilo definido em `marca.md`?** → usa esse. Fim.
2. **O usuário nomeou um estilo?** (ex: "no estilo editorial", "mais brutalista")
   → puxa a skill daquele estilo (Skill tool) e aplica os tokens.
3. **Ninguém definiu?** → o Claude olha o segmento/vibe do cliente, escolhe UM
   grupo abaixo, sugere 1-2 estilos e **pergunta antes** de produzir.

Sempre **UM estilo por peça.** Nunca misturar dois. Se o estilo escolhido brigar
com a `marca.md` do cliente, a marca vence.

---

## Tier 1 — Ferramentas de design (não são estilos)

Essas são meta-skills. Aparecem sempre que fizer sentido, independente do estilo:

| Skill | Pra quê |
|---|---|
| `ui-ux-pro-max` | Banco de dados pesquisável: 80+ estilos, paletas, pares de fonte, UX. Use pra **descobrir** paleta/fonte quando a marca do cliente for vaga. |
| `taste-skill` | Anti-template. Use ao criar **site / landing page / portfólio** pra não sair com cara de IA genérica. |
| `dataviz` | Gráficos e visualização de dados (relatórios de ads, dashboards). |
| `shadcn` | Componentes React/Tailwind. **Só** se o cliente for construir site/CRM em React — não serve pra carrossel/post. |

---

## Tier 1.5 — Extensões técnicas (pacote taste-skill, GitHub leonxlnx/taste-skill)

Instaladas junto com o `taste-skill`. Não são "estilos de marca" (Tier 2) — são
ferramentas/técnicas de execução. Usar com critério, sem quebrar a regra de UM
estilo por peça nem a marca do cliente:

| Skill | Pra quê |
|---|---|
| `brandkit` | Geração de imagem pra brand-kit/logo/identidade visual (boards, decks). |
| `brutalist-skill` | Interface industrial/brutalista — grid rígido, tipografia extrema. Pra dashboards pesados ou portfólio "blueprint". |
| `gpt-tasteskill` | Motor alternativo ao taste-skill: estrutura AIDA rígida + GSAP pesado (pin/scrub/stack). Landing pages mais "cinematográficas". |
| `image-to-code-skill` | Gera a imagem de referência primeiro, analisa, só depois implementa o código a partir dela. |
| `imagegen-frontend-web` / `imagegen-frontend-mobile` | Geram só imagens de referência (web ou app mobile) — não escrevem código. Uma imagem por seção/tela. |
| `minimalist-skill` | Editorial minimalista monocromático quente — não confundir com o estilo de marca `minimal` (Tier 2), são skills diferentes. |
| `output-skill` | Força saída completa em tarefas grandes de código, sem truncar nem deixar placeholder. |
| `redesign-skill` | Audita um site/app existente, aponta padrões genéricos de IA, propõe upgrade sem quebrar funcionalidade. |
| `soft-skill` | Padrões de agência premium: fonte, espaçamento, sombra, cards — pra fugir do "cara de IA barata". |
| `stitch-skill` | Gera `DESIGN.md` no formato do Google Stitch (tokens semânticos, anti-genérico). |

---

## Tier 2 — Estilos de marca (escolha UM)

Cada nome abaixo é uma skill em `.claude/skills/<nome>/`. São guias de tokens
(cores, fontes, regras). Agrupados por vibe:

### ⬛ Premium & Elegante
*High-ticket, clínicas, advocacia, estética, arquitetura, joalheria, imóveis de luxo.*

- **premium** — estética Apple, espaçamento preciso, refinado
- **refined** — minimalista sofisticado, serifa elegante, paleta contida
- **editorial** — cara de revista, serifa, grid estruturado, leitura elegante
- **terracotta** — editorial quente, tom argila, creme + terracota
- **impeccable** — pôster editorial, creme + laranja queimado, confiante
- **claude** — journal de pesquisa, marfim quente, quase acromático, autoral
- **power** — dark premium, títulos fortes, monocromático, sensação de marca top
- **square** — refinado e delicado, tipografia fina, polido

### ⬜ Limpo & Minimalista
*Tech, SaaS, produto, serviços onde "menos é mais".*

- **minimal** — whitespace, tipografia limpa, cor contida
- **clean** — simplicidade, legível, paleta limitada
- **sleek** — linhas limpas, paleta intencional, interações sutis
- **modern** — editorial contemporâneo, serifa + paleta enxuta
- **spacious** — respiro generoso, grid, muito ar
- **contemporary** — minimalista atual, bento grid, dark mode

### 🟦 Corporativo & Confiável
*B2B, contabilidade, saúde institucional, jurídico, consultoria.*

- **corporate** — profissional, grid estruturado, padrão enterprise
- **professional** — business-ready, tipografia moderna, identidade confiável
- **enterprise** — dashboard cloud, painéis, hierarquia de dados forte
- **geometric** — estruturado, formas precisas, tipografia limpa

### 🟧 Humano & Acolhedor
*Local, gastronomia, bem-estar, infantil, artesanal, pet, terapia.*

- **cafe** — aconchegante, tons quentes, tipografia suave
- **friendly** — acessível, cantos arredondados, pastéis suaves
- **paper** — textura de papel, print, serifa/sans limpa, tátil
- **sketch** — desenho à mão, papel creme, acento teal, manuscrito
- **riso** — risografia 2 cores, off-white quente, alegre
- **creative** — lúdico, tipografia expressiva, cara de personagem
- **storytelling** — narrativo, guia o usuário por uma jornada emocional

### 🟥 Ousado & Vibrante
*Varejo, fitness, eventos, moda, música, público jovem.*

- **bold** — presença forte, tipografia pesada, alto contraste
- **vibrant** — colorido, tipografia lúdica, energia
- **colorful** — paletas vibrantes, gradientes, moderno e memorável
- **gradient** — transições de cor suaves, profundidade, lúdico
- **glassmorphism** — vidro fosco, camadas translúcidas, elegante e moderno
- **expressive** — personalidade, cores fortes, layouts dinâmicos
- **dramatic** — teatral, alto contraste, composições que comandam atenção
- **neobrutalism** — bordas marcadas, cores vivas, cru e alto contraste

---

## Segmento → grupo (atalho de decisão)

| Se o cliente é... | Comece por... |
|---|---|
| Clínica, dentista, estética, advogado, arquiteto | **Premium & Elegante** |
| SaaS, app, startup, produto digital | **Limpo & Minimalista** |
| Contabilidade, consultoria, B2B, indústria | **Corporativo & Confiável** |
| Restaurante, café, pet, terapia, artesanato, infantil | **Humano & Acolhedor** |
| Loja, academia, evento, moda, marca jovem | **Ousado & Vibrante** |

---

## Cliente #1 — Dr. Giovanni Nascimento

Implantodontia premium, Salvador. Vibe: **Premium & Elegante** →
sugestões: `refined`, `editorial` ou `claude`. Confirmar em
`clientes/dr-giovanni-nascimento/marca.md` antes de produzir. Compliance CFO
trava a entrega — ver CLAUDE.md.
