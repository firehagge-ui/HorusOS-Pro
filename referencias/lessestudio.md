# Teardown: Lesse Studio

- **URL:** https://lessestudio.com/
- **Segmento:** estúdio full-service de design e tecnologia (Itália) — da estratégia de marca ao dev, ecommerce, app e hardware embarcado
- **Estudado em:** 26/08/2026
- **Nota:** 8/10
- **Contexto:** o Marcelo já tinha mandado o lessestudio antes (24/08/2026), mas só como
  **seção** — o wordmark gigante abaixo do rodapé, que virou a ficha
  `_biblioteca/inspiracoes/secao/assinatura-wordmark-no-pe.md`. Este é o teardown da
  **página inteira**, agora que ela entra como referência de estrutura para o site da
  própria Hórus. É o vizinho mais próximo do território visual da casa: quase-preto
  monocromático, tipografia técnica, preloader com contador

---

## Estrutura, na ordem

1. **Preloader de tela cheia** — fundo preto, wordmark "LESSE" à esquerda e contador
   `0% → 100%` à direita em numeral monoespaçado. É o primeiro gesto de marca, não uma
   espera morta
2. **Hero** de tela cheia: kicker "Full-Service Agency" + frase-manifesto ("Lesse is a
   design and technology studio based in Italy...") + CTA "Start a Project" (pílula) +
   dica "Scroll"
3. **Our services** — grade de **8 cards de serviço**, cada um com imagem, lista de
   subserviços concretos, "See More" e um contador `/N services`
4. **Our approach and values** — uma frase única de posicionamento + peça animada (GIF)
5. **Latest Work** — 3 cases de portfólio, cada um com narrativa longa + tríade de
   metadados **Location / Industry / Services**
6. **Testimonials** — 4 depoimentos em carrossel, nominais (nome + cargo + empresa)
7. **Latest news** — 2 cards de insight (título + data), ponte para o blog
8. **Ready to get started?** — formulário de orçamento com checkboxes de serviço
9. **Rodapé** + o **wordmark "LESSE" gigante** abaixo de tudo (a seção já fichada)

Comparado com `_memoria/design/00-anatomia.md`: cumpre a espinha inteira (hero → prova →
serviço → trabalho → prova social → conversão). Duas diferenças que ensinam: (a) o bloco
de serviços vem **antes** do trabalho, e é o mais trabalhado da página; (b) não existe um
"para quem é" explícito — o público é filtrado pela amplitude da lista de serviços, não
por uma frase em segunda pessoa.

---

## O que copiar

### O card de serviço que vira um cardápio de entregáveis concretos

- **Como é feito.** Cada um dos 8 cards não diz só o nome do serviço. Abre a lista das
  entregas exatas embaixo: "Brand Strategy" traz *Brand Positioning, Competitor & Market
  Research, Brand Architecture, Brand Audit, Brand Naming & Tagline, Brand Messaging & Tone
  of Voice*, e fecha com o contador **"Brand Strategy /6 services"** + um "See More". A
  imagem no topo dá textura; a lista dá substância.
- **Por que funciona.** "Fazemos branding" não vende nada — todo mundo diz. Uma lista de
  6 entregas nomeadas transforma o abstrato em escaneável e prova domínio pela
  especificidade: quem escreve "Brand Architecture" e "Tone of Voice" sabe o que faz. O
  contador `/6 services` ainda dá noção de profundidade sem texto de venda.
- **Aplicado na Hórus:** a seção de serviços do site institucional pode listar, sob cada
  frente (tráfego, conteúdo, site, automação com IA), as entregas reais que a casa faz —
  o que já está mapeado em `equipe/`. É o antídoto contra o card de serviço genérico com
  um ícone e uma frase.

### A tríade de metadados no case: Location / Industry / Services

- **Como é feito.** Cada case do portfólio fecha com três campos curtos: **Location**
  (Rússia, Austrália, Tailândia), **Industry** (Pets, Supplements, Cosmetics) e
  **Services** (Brand Identity, UX Design...). A narrativa longa explica o *porquê* da
  decisão de design; a tríade dá o *enquadramento* de uma olhada.
- **Por que funciona.** Enquadra o trabalho como caso resolvido, não como imagem bonita:
  quem lê entende cliente, setor e escopo em três linhas. Serve de prova sem superlativo —
  o alcance geográfico e a variedade de setor falam por si.
- **Aplicado na Hórus:** o portfólio da casa pode carimbar cada peça com Cidade / Setor /
  Serviço. Encaixa direto nos clientes reais (Salvador / Odontologia / Site; Brejões /
  Café / Site). Prova de amplitude sem precisar dizer "somos versáteis".

### O preloader que é gesto de marca, não espera

- **Como é feito.** Fundo preto, wordmark à esquerda, `0%→100%` em numeral monoespaçado à
  direita. Enquanto o site carrega os assets pesados (imagens de serviço, GIF), o contador
  cobre o tempo com identidade em vez de spinner.
- **Por que funciona.** O primeiro frame já é a marca: monocromático, técnico, o mono dos
  números contra o sans do logo. Transforma latência inevitável em primeira impressão
  controlada. É barato de fazer e caro de imitar mal (se demora demais, irrita).
- **Ressalva.** Só vale se o site realmente tem o que carregar. Preloader de enfeite num
  site leve é firula — some com ele.

### A frase-manifesto no lugar da promessa vendedora

- Copy do hero: *"Lesse is a design and technology studio based in Italy. We deliver
  hollistic brand identity & digital experiences."* Declara o que é e onde fica, sem
  superlativo, sem "a melhor", sem promessa de resultado. O kicker "Full-Service Agency"
  faz o trabalho de escopo. É o registro sóbrio que a casa já pratica em cliente regulado.

---

## Tipografia e cor

- **Wordmark/display:** logotipo "LESSE" é um sans **geométrico técnico** desenhado, com
  terminais entalhados e counters abertos (o "E" com fenda, o "S" cortado) — dá cara de
  engenharia/produto, não de estúdio decorativo. *Aparente* (é um desenho de marca, não
  fonte de sistema).
- **Corpo:** DM Sans (sans neutra) no texto corrido. *Aparente* — o `branding` do Firecrawl
  reportou "DMSans" body, plausível, mas não medido no CSS.
- **Escala:** hero e wordmark enormes contra corpo pequeno; não consegui medir a razão
  exata (o print real ficou preso no preloader). Registro só como "alto contraste de
  tamanho", não em número.
- **Cor:** fundo **quase-preto** (~`#0E0E0E`/`#141414`, *aparente* pela og:image e pelo
  preloader), texto **branco/osso**. O grande "S" atrás do wordmark é um watermark tonal
  (preto sobre preto, só a diferença de valor o revela). **Zero acento cromático de
  verdade** — a página é monocromática; o "acento" é o movimento e o contraste de valor.
- ⚠️ **O `branding` mentiu feio aqui:** jurou `colorScheme: light`, fundo `#EBEBEB`,
  texto `#000000`, `border-radius: 0`. A og:image e o preloader mostram fundo preto, texto
  branco e CTA em **pílula** (o próprio branding, noutro campo, admitiu `buttonPrimary`
  com raio 19.2px). Onde branding e print brigam, o print vence: registrar como *aparente*.

---

## O que não copiar

- **Os erros de digitação no hero.** O texto ao vivo traz "**hollistic**" (holistic) e, em
  outra versão, "idendity" (identity). Num estúdio que vende branding, typo no hero é tiro
  no pé — mina justo a autoridade que o resto constrói. A lição pela avessa: revisar a copy
  do hero é parte do design, não um detalhe.
- **Depoimento nominal com cargo e empresa.** São 4 no carrossel, e é o miolo da prova
  deles. Em cliente regulado da Hórus (CFP proíbe depoimento em qualquer formato; CFO só
  com autorização) isso trava. No site da própria agência ainda não há autorização de
  cliente para citar nome.
- **8 cards de serviço** é a amplitude de um estúdio que faz de branding a hardware
  embarcado. A Hórus deve listar as frentes que **realmente** entrega, não inflar a grade
  para parecer maior — grade grande com serviço que não se presta é promessa vazia.
- **Ausência total de acento cromático** funciona para um estúdio que quer parecer neutro/
  premium. A Hórus tem âmbar/dourado como identidade: o monocromático do Lesse é referência
  de *estrutura e sobriedade*, não de paleta.

---

## Aplicado onde

Ainda não aplicado como página. O padrão de **seção** (wordmark gigante no pé) já foi
extraído no lote de 24/08/2026 e está em
`_biblioteca/inspiracoes/secao/assinatura-wordmark-no-pe.md`, aplicado em `site/`. Deste
teardown completo, os candidatos para o site institucional da Hórus são: o **card de
serviço como cardápio de entregas** (seção de serviços) e a **tríade Location/Industry/
Services** no portfólio. Preencher aqui quando entrar.
