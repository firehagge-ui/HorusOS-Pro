# Teardown: Vivid Motion

- **URL:** https://www.vividmotion.co/
- **Segmento:** estúdio de estratégia, design e desenvolvimento (marcas grandes; clientes como SoundCloud, AWS, Meta, Cisco, FC Barcelona)
- **Estudado em:** 26/08/2026
- **Nota:** 9/10
- **Contexto:** estúdio premium construído em Webflow, a ponta alta do segmento da Hórus
  (agência que se vende pela própria competência). Estudada pela **interação-assinatura**:
  o reveal palavra a palavra no scroll e as esteiras infinitas de serviço. É a referência
  de *motion editorial* — como um estúdio parece caro sem encher a tela de enfeite. Bate
  direto com `_memoria/design/60-motion.md` (a doutrina de movimento da casa)

---

## Estrutura, na ordem

1. **Hero** — "Creative studio built for growth." em serifa editorial gigante, sobre fundo
   quase-preto
2. **Marquee de logos de clientes** (SoundCloud, AWS, HP, Meta, MasterCard, FC Barcelona,
   Cisco, Skechers, Dribbble...) rolando em loop — prova social imediata acima da dobra
3. **Showreel** (Vimeo) com botão "Play reel"
4. **Frase-manifesto revelada palavra a palavra no scroll:** "We design, build and grow
   brands and digital products for the world's biggest companies and boldest new ones" —
   cada palavra entra individualmente conforme a rolagem
5. **Featured work** com abas de filtro (Branding / Web / Mobile / Motion) e cards que no
   hover trocam logo do cliente por preview do projeto (Vakeso, SoundCloud, Sona, Vault Bank)
6. **"What we do"** — a segunda frase-manifesto ("Strategy, design and development. From
   brand identities... we make what companies need to lead."), seguida dos três blocos de
   serviço numerados
7. **01 Strategy / 02 Creative & Design / 03 Development** — cada bloco tem uma **esteira de
   tags de serviço repetidas em loop** (Brand Strategy, Creative Strategy, User Research,
   AI Strategy... / Brand Identity, Design Systems, UI/UX, Motion, 3D & CGI... / Web Dev,
   WebGL, AI Integration...) + uma tira de imagens de trabalho correndo junto
8. **Journal** — três artigos com thumbnail e data (posicionamento de autoridade)
9. Rodapé (não capturado no scrape)

Comparado com `_memoria/design/00-anatomia.md`: hero → prova (logos) → showreel →
manifesto → trabalho → serviços → autoridade (journal). A diferença é que **o "o que
fazemos" não é lista estática: é movimento.** As tags de serviço rolam em esteira, o que
converte uma lista chata (30+ serviços) em textura viva. E a prova (logos de marca grande)
vem antes de qualquer palavra sobre si — o cliente famoso fala primeiro.

---

## O que copiar

### O manifesto revelado palavra a palavra no scroll

- **Como é feito.** A frase-tese é quebrada em palavras isoladas ("We" / "design," /
  "build" / "and" / "grow" / "brands"...) e cada uma entra na tela conforme a rolagem
  avança — provável `ScrollTrigger` com scrub ligando o progresso do scroll ao aparecer de
  cada `<span>`. O leitor *constrói* a frase rolando.
- **Por que funciona.** Uma frase institucional lida de uma vez é ignorada; lida palavra a
  palavra vira ritmo e o leitor não consegue pular. Dá peso a uma declaração de
  posicionamento sem aumentar a fonte. É o tipo de motion que **serve o conteúdo** (a
  doutrina do `60-motion.md`: animar para dirigir o olho, não para exibir), não decoração.
  Reproduzível em vanilla: GSAP + `ScrollTrigger` scrub + `SplitText`/spans, com o arsenal
  já vendorizado em `_biblioteca/motion/`.
- Cuidado de compliance: o efeito é puro CSS/opacidade sobre texto — sem risco. Mas exige
  fallback: sem JS, todas as palavras têm que estar visíveis (o Estrela Studio errou nisso
  ao esconder a nav via JS).

### A esteira infinita de tags como forma de listar 30 serviços sem entediar

- **Como é feito.** Cada bloco de serviço (Strategy, Design, Development) tem suas
  sub-competências repetidas em loop horizontal ("Brand Strategy · Brand Strategy · Brand
  Strategy..." rolando), com uma tira de imagens de projeto correndo em paralelo. Um estúdio
  que faz **tudo** (35+ serviços) precisaria de uma lista gigante; a esteira transforma
  volume em ritmo.
- **Por que funciona.** Comunica amplitude de capacidade ("olha quanta coisa fazemos") sem
  a página virar um índice de telefone. O loop dá sensação de "não acaba", que é o próprio
  recado (fazemos de tudo). Para a Hórus, que também tem catálogo largo (site, carrossel,
  tráfego, SEO, bot, CRM, relatório), é o jeito de mostrar leque sem 40 bullets.
- Risco: é firula se o estúdio faz 4 coisas. Só se paga quando o volume *é* o argumento.

### Logo de cliente grande antes de qualquer palavra sobre si

- **Como é feito.** O primeiro conteúdo depois do título é o marquee de logos de marca
  global (Meta, AWS, Barcelona, Cisco). O estúdio deixa o cliente famoso apresentar o
  estúdio.
- **Por que funciona.** Prova emprestada é a credencial mais rápida: "se a Meta confiou,
  eu confio". Só funciona quando os logos são de verdade e reconhecíveis. A Hórus ainda não
  tem esse tipo de logo (clientes locais), então o equivalente honesto é o **mural de
  clientes reais** (Giovanni, Aion, Grão da Serra, Permita-se) — sem inflar, sem inventar
  marca que não é cliente (a `integridade.md`).

### Card de trabalho que troca logo por preview no hover

- **Como é feito.** No Featured work, o card mostra em repouso o **logo do cliente** ("Client
  · Vakeso") e no hover revela a **imagem do projeto**. O repouso é sóbrio (só marcas), a
  descoberta é visual.
- **Por que funciona.** Mantém a grade limpa e nominal (parece um portfólio de clientes
  sérios) e guarda o impacto visual para quem interage. É o oposto do mosaico de thumbnails
  gritando ao mesmo tempo. Dá controle de ritmo ao leitor.

### Abas de filtro no portfólio (Branding / Web / Mobile / Motion)

- **Como é feito.** Quatro abas acima do grid de trabalho filtram os cases por disciplina.
- **Por que funciona.** Deixa o próprio visitante segmentar por interesse ("só quero ver
  web") sem sair da seção. Comunica as quatro grandes áreas de atuação de graça, pelo rótulo
  das abas. Cabe à Hórus se o portfólio crescer.

---

## Ícones, diagramas e sistema visual (foco do Marcelo)

- **Sem ícones decorativos.** O sistema visual é tipografia + logos de cliente + imagens de
  projeto + numeração (01/02/03). A elegância vem da serifa editorial e do espaço, não de
  iconografia. Lição para a Hórus: um estúdio premium pode dispensar ícone completamente e
  ganhar em sobriedade.
- **Numeração de seção grande** (01 Strategy, 02 Creative & Design, 03 Development): mesmo
  recurso do Estrela Studio e do Amphora. Número grande + serifa = ar de sumário de
  publicação. Padrão recorrente entre as boas referências de agência — vale adotar como
  assinatura da Hórus.
- **Mono como terceira voz:** Oxygen Mono aparece para labels/rótulos ("Featured work",
  "Client"), contra a serifa dos títulos e a sans do corpo. Três vozes tipográficas com
  papéis fixos (display serifa / corpo sans / rótulo mono) — sistema disciplinado.
- **Tudo em movimento contido:** marquees (logos, tags), scroll-reveal (manifesto),
  hover-swap (cards), showreel. Muito motion, zero caos — porque cada movimento tem um
  trabalho. É a demonstração viva do `60-motion.md`.
- **Tecnologia:** Webflow + Vimeo. Imagens em `.avif` (formato moderno, leve) — nota de
  performance: o estúdio de motion carrega rápido apesar do peso visual.
- **Grid:** o Featured work usa mosaico assimétrico (4 cards de tamanhos diferentes); as
  esteiras de serviço usam linhas horizontais infinitas. Duas famílias de layout, ambas em
  movimento.

---

## Tipografia e cor

- **PP Editorial New** (serifa de alto contraste, display) nos títulos + **Inter Tight** no
  corpo + **Oxygen Mono** nos rótulos. É a mesma família de escolha do Estrela Studio (PP
  Migra serifa + sans neutra): serifa editorial dá autoridade de publicação a um estúdio.
  Contraste título/corpo altíssimo (h1 ~150px aparente contra corpo pequeno).
- Fundo quase-preto **#0A0A0A** (o branding marcou `colorScheme: light`, mas o `background`
  é #0A0A0A e o og-image é escuro — provável seção clara no meio; tratar o site como
  **predominantemente escuro**, valor *aparente*). Acento **vermelho-laranja #E63A0F** (o
  botão "Start a Project") + azul **#0082F3** como secundário de link.
- **Botão pílula** (border-radius altíssimo, ~300px aparente) laranja sobre preto — o único
  ponto de cor saturada. Um acento quente dominante, um azul de apoio. Confirma de novo a
  fórmula do segmento (quase-preto + um acento quente forte), a mesma do carvão+âmbar da
  Hórus.

---

## O que não copiar

- **Volume de motion sem orçamento de performance/dev.** Marquees + scroll-scrub +
  hover-swap + vídeo é caro de construir e de manter em vanilla. A Hórus deve escolher **uma**
  interação-assinatura (o reveal palavra a palavra é a mais barata e mais transferível) e não
  empilhar as quatro. O `60-motion.md` já manda: um efeito que vale, não cinco.
- **Esteira de 30+ serviços** quando o catálogo não é o argumento. Copiar o *mecanismo* da
  esteira só se o volume for real e desejável de mostrar; senão vira ruído.
- **Logo de marca global emprestada:** a Hórus não tem Meta nem AWS. Não simular, não usar
  "clientes" que não são clientes. O equivalente honesto é o mural de clientes reais locais.
- **`colorScheme: light` do branding:** aqui ele conflita com o fundo #0A0A0A escuro. Mais um
  caso de branding não confiável sem print (a mesma armadilha do Fiomet). Tratar tema e hex
  como *aparente*.

---

## Aplicado onde

Ainda não aplicado. Candidatos no site institucional da Hórus:
1. **O manifesto revelado palavra a palavra no scroll** (GSAP ScrollTrigger scrub + spans,
   com o arsenal de `_biblioteca/motion/`) — a interação-assinatura mais transferível das
   três referências deste lote, e a que melhor casa com o `60-motion.md`;
2. **A numeração de seção grande em serifa** (01/02/03) como assinatura recorrente — padrão
   confirmado em Estrela, Amphora e Vivid;
3. **O card de trabalho logo→preview no hover** quando o portfólio da Hórus crescer;
4. **As três vozes tipográficas com papel fixo** (display serifa / corpo sans / rótulo
   mono) — a Sora dá o corpo/título; falta definir a voz de rótulo.
