# Teardown: UXBERT Labs

- **URL:** https://uxbert.com/en/present
- **Segmento:** consultoria de UX/UI e desenvolvimento (Riyadh / Dubai / Londres, foco Oriente Médio)
- **Estudado em:** 26/08/2026
- **Nota:** 7/10
- **Contexto:** agência premiada, mesma família do site institucional da Hórus (agência
  digital que se vende pela própria competência). Estudada para o site da Hórus: como
  uma consultoria de UX enche a home de prova (números, cases, clientes) sem virar
  catálogo, e o que ela faz de assinatura tipográfica. A página é a `/present`, uma das
  duas metades de uma narrativa temporal (ver abaixo)

---

## Estrutura, na ordem

1. Nav horizontal cujos itens **são um enredo**: `The Past` · `The Present` · About us ·
   Services · Case Studies · Articles · UX Courses · Careers · Contact us. As duas
   primeiras não são páginas comuns: são dois capítulos ("o passado" e "o presente" da
   agência), e a home visitada é o "presente"
2. Hero de tela cheia: rótulo `ThePresent` + título gigante
   `WeAreaDigitalConsultancyHelpingBusinessesGrowGlobally` (palavras **coladas**, sem
   espaço) + seta "scroll down"
3. Trinca/sexteto de contadores que giram até o número final (2981, 9469, 1397, 2269, e
   dois grandes tipo 1075765045) — métricas animadas de volume
4. Esteira de trabalho: cards de case com logo do cliente + uma frase de resultado,
   que expandem no hover ("WBK", "SAGP", "Alinma"...)
5. **Our Services** — um parágrafo-manifesto único, sem lista de serviços em cards
6. **Case Studies / Highlighted Projects** — grid de capas com chips de categoria
   (`WEBSITE` `APP` `ENTERTAINMENT`) e botão "All case studies"
7. **UX Courses** — carrossel de cursos (UX PRO, ECOMMERCE PRO...) com idioma e cidades
8. **Our Clients** — mural de logos + "see all clients"
9. **Our thoughts / Thinking around UX/UI design** — três artigos com thumbnail
10. **FAQ** em acordeão
11. Bloco de contato com carimbo ("Do you have more question?") + formulário

Comparado com `_memoria/design/00-anatomia.md`: cumpre a espinha (hero → prova → cases →
autoridade → conversão), mas **empurra a prova numérica para logo depois do hero** (os
contadores) e adia o "o que fazemos" para um único parágrafo, sem os cards de serviço que
o modelo médio põe. A ausência de bloco "para quem é" em segunda pessoa é uma fraqueza: a
página fala de si o tempo todo, quase nunca do cliente.

---

## O que copiar

### As duas primeiras abas da nav como narrativa temporal, não como páginas

- **Como é feito.** O menu abre com `The Past` e `The Present` antes de qualquer item
  utilitário. São dois capítulos de uma história ("de onde viemos" / "onde estamos"), e
  a home é o "presente". O resto do menu (About, Services, Cases) é o cardápio normal,
  vindo depois.
- **Por que funciona.** Transforma a navegação num fio de leitura em vez de uma lista de
  gavetas. Uma agência que se vende por competência ganha em contar uma trajetória; a
  Hórus tem exatamente esse ativo (o próprio Horus OS, a evolução do sistema). É um jeito
  de dar enredo ao "sobre" sem escrever um textão institucional.
- Risco: só funciona se as duas metades entregarem conteúdo de verdade. Aba com nome
  poético e página vazia vira firula (a régua do `90-antipadroes.md`).

### Métrica embutida na frase do case, com número não-redondo

- **Como é feito.** Cada card de trabalho carrega uma frase única que termina no
  resultado: *"Redesigned DZRT's site boosting trust, clarity, and mobile UX, driving
  413% revenue growth and brand impact."* O número (413%) mora dentro da frase de
  contexto, não num selo solto.
- **Por que funciona.** O dado ganha história em vez de flutuar como banner. "413%" é
  específico e não-redondo, o que lê como medido, não como enfeite (mesma lógica do peso
  por peça no WRK Timepieces). É o oposto do "+100% de resultados!" genérico.
- Trava da casa: em cliente regulado (CFO/CFP) isso é **vedado** (promessa/garantia de
  resultado). Só serve à **própria Hórus** e a clientes não regulados, e só com número
  real e verificável. Número inventado para encher card é o que a `integridade.md` proíbe.

### O manifesto de serviços em um parágrafo, no lugar dos seis cards

- **Como é feito.** A seção "Our Services" é uma frase longa só: *"The top design and
  development agency that collaborates with brands of all sizes and drives lasting
  customer loyalty with astonishing digital experiences."* Sem grid de ícone+título.
- **Por que funciona.** Uma agência que quer parecer sênior evita o grid de 6 serviços
  que toda landing tem (o antipadrão "cardápio de commodity"). O parágrafo diz "posicione
  o problema, não liste tarefas". Cabe à Hórus, que vende sistema, não item avulso.
- Contraponto: some com ele a informação de "o que exatamente vocês fazem". A UXBERT
  resolve isso jogando os serviços concretos nos chips de categoria dos cases.

### Chip de categoria na capa do case como filtro visual

- **Como é feito.** Cada capa de case leva 2-3 tags em caixa alta (`WEBSITE` `APP`
  `ENTERTAINMENT`, `APP` `FINANCIAL`, `WEBSITE` `E-COMMERCE`). É o que comunica a
  amplitude de serviço sem uma seção de serviços.
- **Por que funciona.** O leitor deduz o leque de competências varrendo os cases, e a
  prova (o trabalho) e a taxonomia (o serviço) viram a mesma coisa. Economiza uma seção.

---

## Ícones, diagramas e sistema visual (foco do Marcelo)

- **Ícones:** conjunto próprio em SVG monocromático (contato, scroll circular, setas de
  link, carimbo/stamp). Nada de biblioteca genérica. O "stamp" (carimbo) no bloco de
  contato é o detalhe de personalidade: um selo que dá ar de ofício/autoridade. Ideia
  aproveitável para a Hórus: um carimbo/selo âmbar no bloco de contato final.
- **Contadores animados:** seis números que giram até o valor final ao entrar na viewport.
  É a "trinca de números" que o consolidado das dez agências já apontou como denominador
  do segmento — aqui em dose dupla (sexteto). Para a Hórus, GSAP + `ScrollTrigger` com um
  tween de valor faz isso em vanilla, sem lib de contador.
- **Palavra colada como recurso de display** (ver "não copiar"): `WeAreaDigitalConsultancy`,
  `OurClients`. É a assinatura tipográfica deles, viabilizada pela Rajdhani condensada.
- **Grid:** cards de case em mosaico irregular na esteira do topo (tamanhos diferentes,
  hover-expand) e grid regular de capas mais abaixo. Duas famílias de layout para o mesmo
  conteúdo (case), o que dá ritmo.

---

## Tipografia e cor

- **Rajdhani** nos títulos (sans condensada, técnica, quase de engenharia) + **Inter** no
  corpo. O contraste é de *largura e peso*, não serifa × sans: a Rajdhani estreitíssima
  contra a Inter neutra. h2 ~115px, h1 ~54px, corpo ~24px (valores *aparentes* do
  branding; o h2 maior que o h1 sugere que o "título" real da página é o de seção).
- Fundo azul-quase-preto **#0B042A** (é também o `theme-color` do site, então confiável),
  texto claro, acento **rosa #FF498B** — um acento só, forte, saturado, contra o navio
  escuro. Confirma a fórmula do segmento (quase-preto + um acento vibrante).
- Raio de canto **0px** e sombra `none` (aparente): superfícies retangulares e planas, sem
  card-fantasma. Bate com a doutrina da casa (canto mínimo, sem sombra externa).

---

## O que não copiar

- **Palavras coladas sem espaço no título** (`WeAreaDigitalConsultancyHelpingBusinesses`).
  Só sobrevive numa condensada como a Rajdhani e ainda assim cobra imposto de leitura: o
  olho tropeça e o leitor de tela lê tudo grudado (acessibilidade). Na Sora da Hórus, que
  é mais larga, isso viraria mancha ilegível. É estilo de assinatura deles, não regra
  transferível.
- **Página que só fala de si.** Seis contadores, mural de clientes, cases, cursos — e quase
  nenhum bloco em segunda pessoa ("você", "seu negócio"). A prova está toda em "nós".
  Para um cliente que compra por confiança (saúde, café), falta o espelho do leitor.
- **h2 maior que o h1** e escala tipográfica sem hierarquia clara de página: dá impacto,
  mas confunde qual é o assunto real da tela.
- **Densidade de conteúdo:** cursos + artigos + clientes + FAQ na mesma home alonga demais.
  Para a Hórus (uma página só), escolher menos blocos e aprofundar cada um.

---

## Aplicado onde

Ainda não aplicado. Candidatos no site institucional da Hórus:
1. a nav "Past/Present" como fio narrativo do "sobre" (a evolução do Horus OS);
2. os contadores animados em GSAP na trinca de números do hero;
3. a métrica dentro da frase do case (só para a própria Hórus e clientes não regulados,
   com número real);
4. o selo/carimbo âmbar no bloco de contato final.
