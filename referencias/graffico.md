# Teardown: Graffico

- **URL:** https://graffico.it/en
- **Segmento:** estúdio de web, software e automação de IA (Modena / Nápoles, Itália)
- **Estudado em:** 26/08/2026
- **Nota:** 8/10
- **Contexto:** o Marcelo mandou como referência **do próprio segmento da Hórus** —
  agência que vende site + software + IA. Interessa como concorrente direto: como
  estrutura a página, como lista muitos serviços sem virar cardápio morto, e como
  prova competência técnica sem depoimento (que a Hórus regulada não pode usar). É
  site premiado (Awwwards / GSAP Showcase), então otimiza para júri **e** para
  fechar — os dois ao mesmo tempo

---

## Estrutura, na ordem

1. **Hero** — kicker "Web Studio", h1 "We craft digital experiences", subline de uma
   frase, cue de "Scroll to discover". Sem prova acima da dobra (a prova vem logo em
   seguida)
2. **Trinca de credencial curta** — `15+ Industries`, `5+ Years`. Dois números, não
   três; contenção
3. **"Concrete results, not just promises."** — três métricas duras (`300%` crescimento
   médio, `4 weeks` entrega média, `98%` clientes satisfeitos) + três depoimentos, cada
   um com **badge de métrica** grudado (`90% Automation`, `60% Efficiency`, `3x ROI`),
   nome, cargo e empresa
4. **Bloco de agitação** — "Your business is ready to scale, but is your tech stack
   holding you back?" seguido de quatro benefícios **numerados** `01`–`04` (A brand that
   converts / Reclaim your time / Scalability without chaos / True partnership)
5. **"Digital Solutions Without Compromise"** — vitrine de serviços onde cada card traz
   um **mockup de UI ao vivo** com números concretos (dashboard de vendas `13.390€ +12%`,
   `ACCURACY 98.7% / SPEED 142ms / TRAINING Epoch 47/50`, `Operations/month 15.996`)
6. **Catálogo "60+ Solutions"** — "Looking for Something More Specific?" abre um mural de
   **60+ cards de solução**, cada um com **monograma de letra** + título + uma linha de
   descrição, correndo em marquee, agrupado por categoria (gestão, IA, e-commerce, por
   setor: clínica, dental, academia, hotel, restaurante...)
7. **Featured work** — marquee de palavras-tag (Efficiency, Design, Automation...) +
   mockups em moldura MacBook/iPhone de sites reais de clientes, em scroll horizontal
8. **Team** — "We are developers and architects of efficiency", dois co-fundadores com
   foto e LinkedIn
9. **Awards marquee** — `Awwwards ✦ GSAP Showcase ✦ CSSDA ✦ CSS Winner ✦ 100/100 Lighthouse`
10. **Blog** — "Insights that drive growth", três cards de artigo
11. **FAQ** — "Everything you need to know", com **chips de filtro por categoria** e
    contador (`All 12`, `General 3`, `Timing & Pricing 3`, `Technology 3`, `Support 3`)
12. **Contato** — form multi-etapa "Step 1 of 2", pede só nome e email primeiro

Comparado com `_memoria/design/00-anatomia.md`: cumpre o arco clássico (hero → prova →
dor → solução → trabalho → time → prova social → conversão) e **adianta a agitação da
dor para depois do hero**, não para o fim. A diferença forte é o passo 6: um catálogo de
60+ itens que a anatomia da casa não prevê, e que resolve o problema real de uma agência
generalista — mostrar amplitude sem transformar o topo em lista.

---

## O que copiar

### O mockup de UI ao vivo dentro do card de serviço (encenar a prova, não afirmá-la)

- **Como é feito.** Cada serviço não ganha um ícone: ganha um pedaço de interface
  renderizada com número concreto. "Sell Online" mostra um dashboard com `Total sales
  13.390€ ↗ +12% vs last month`, `Active Clients +234`, `Premium 87 / Basic 147`. "AI
  Systems" mostra readout de modelo treinando (`ACCURACY 98.7% / SPEED 142ms / TRAINING
  Epoch 47/50`). "Custom Software" mostra `Operations/month 15.996 ↗ Automated`.
- **Por que funciona.** O número não-redondo (`13.390€`, `142ms`, `Epoch 47/50`) faz o
  mockup parecer captura de tela de produto real, não ilustração. A promessa "eu
  construo dashboards" é provada pelo próprio card ser um dashboard. É o mesmo mecanismo
  do WRK e do HydraDB já na biblioteca: **mostrar o resultado em vez de adjetivá-lo.**
- Para a Hórus vale direto, sem esbarrar em compliance: número de UI genérico
  (operações/mês, tempo de resposta) não é promessa de resultado a paciente. É a
  ferramenta se exibindo, não o cliente depondo.

### O catálogo de 60+ soluções com monograma de letra

- **Como é feito.** Em vez de escolher 6 serviços, a Graffico assume que é generalista e
  lista **60+ soluções nomeadas por resultado** ("Automate Business Excel", "Custom CRM
  for SMBs", "Dental Practice Management Software", "Gym & Fitness Club Management"). Cada
  card é minúsculo: **a primeira letra do nome vira o "ícone"** (A, C, D, G...), título em
  negrito, uma linha de descrição, link próprio. Correm em marquee, agrupados por bloco.
- **Por que funciona.** Resolve o dilema do generalista sem os dois erros clássicos:
  não esconde a amplitude (o cliente de nicho encontra "o meu caso") e não incha o topo
  (fica embaixo, atrás de um "Looking for something more specific?"). O monograma de
  letra é um **sistema de ícone que escala infinito e custa zero** — não precisa desenhar
  60 ícones, o alfabeto já resolve. Cada card tem URL própria: 60 páginas de SEO
  long-tail por setor ("dental practice management software", "gym management software").
- **Roubar o mecanismo, não o volume.** A Hórus não tem 60 serviços, mas a lógica de
  "página própria por caso de uso / por setor" é exatamente o que a casa já faz com as
  páginas por serviço da Aion e por solução — e o monograma de letra é a saída barata
  para dar identidade visual a uma lista longa sem contratar ilustração.

### Benefícios numerados 01–04, e seções numeradas 01–07

- **Como é feito.** Os quatro benefícios pós-hero vêm com índice grande `01`–`04`; as
  seções da página inteira vêm etiquetadas `04 Team`, `05 Blog`, `06 FAQ`, `07 Contatti`.
- **Por que funciona.** O número dá ordem e progressão a uma página longa — a pessoa
  sabe onde está e que há um fim. É o mesmo recurso do "livro em capítulos" do Pear já na
  biblioteca, aplicado de forma mais leve. Combina com a estética mono/técnica.

### FAQ com chips de filtro e contador

- **Como é feito.** A FAQ não é um accordion cego: tem chips `All 12 / General 3 / Timing
  & Pricing 3 / Technology 3 / Support 3` e um contador `12 results 1/3`. Categoriza a
  dúvida antes de a pessoa rolar.
- **Por que funciona.** Quem tem dúvida de preço vai direto ao chip de preço. Transforma
  uma parede de perguntas em algo navegável. E o contador por categoria é honesto: mostra
  que há resposta para cada eixo de objeção (prazo, tecnologia, suporte).

### O form de contato que pede o mínimo primeiro

- **Como é feito.** "Step 1 of 2" e a instrução "Just name and email - nothing more."
  Só depois pergunta sobre o projeto.
- **Por que funciona.** Reduz o atrito da primeira etapa a quase nada. Pedir nome e email
  antes do briefing longo é a diferença entre começar e desistir. Vale para o form do
  site da Hórus e para os clientes.

### Copy que funciona (com o motivo)

- **"Concrete results, not just promises."** — título que já se posiciona contra o
  vaporware das agências. Serve de molde, mas na Hórus regulada "results" precisa virar
  "processo" ou "método", não promessa de resultado a paciente.
- **"Companies lose countless hours to manual processes, human errors, and a digital
  presence that doesn't reflect their true value."** — agitação que **nomeia três dores
  concretas** em vez de falar em abstrato. É o padrão "nomear a dor" do Arbor.
- **"We don't just write code: we design the entire ecosystem to drive your business
  forward."** — reenquadra commodity (código) em valor (ecossistema).
- **"It all begins with a free 30-minute call. We listen to your problem, figure out if
  we can actually help, and — only if it makes sense — we prepare a detailed quote. No
  commitment, no pushy sales."** — vende por **desqualificação e transparência** ("only
  if it makes sense"), igual ao Pear. Baixa a guarda de quem tem medo de vendedor.
- **"no oversized enterprise solutions for small needs"** — fala direto à PME, o público
  da Hórus, dizendo que não vai empurrar o que ela não precisa.

---

## Tipografia e cor

- **Shrikhand** (serifa display pesada, quase caricata, uma linha só de peso) nos títulos
  + **PP Fraktion Mono** nos rótulos técnicos/números + sans de sistema no corpo. A
  escolha da Shrikhand é o que torna a marca **divergente** — é uma display "de cartaz",
  não a Neue-qualquer-coisa que todo estúdio usa. Contraste alto entre a display
  expressiva e o mono seco.
- Fundo `#101011` (quase-preto levemente arroxeado), texto/link em `#E7D7C1` (creme/osso,
  não branco puro — *aparente*), acento único `#C0392B` (vermelho tijolo / terracota). O
  `theme-color` do HTML declara também um `#F5E6D3` (creme claro) — provável seção clara
  em algum ponto (*aparente*, não confirmado no scrape).
- **Um acento de verdade** (o vermelho tijolo), usado no botão primário e em detalhe. É a
  fórmula da casa: quase-preto + UM acento saturado. h1 `48px`, h2 `60px`, corpo `14px`
  (*valores do branding, aparentes*). Raio `14px`, base de espaço 8, Tailwind + Next.js.

---

## O que não copiar

- **Depoimento nominal com badge de métrica** (`90% Automation` — Marco R., CEO). É o
  miolo da prova social deles e é **vedado em cliente regulado da Hórus** (CFP proíbe
  depoimento em qualquer formato; CFO só com autorização). No site da própria agência
  ainda não há autorização de cliente para citar nome. O **mecanismo** (badge de número
  grudado numa prova) pode ser reaproveitado com número de projeto/processo, não com
  depoimento de pessoa.
- **Métricas de resultado no hero** (`300% Average Growth`) — para a Hórus com cliente de
  saúde, prometer crescimento médio é promessa de resultado. Trocar por métrica de
  entrega/processo (tempo de entrega, itens auditados) que não vira promessa clínica.
- **60+ cards em marquee** é volume de generalista italiano com time; copiar o número
  seria inventar serviço que a Hórus não entrega. Roubar a **arquitetura** (página por
  caso, monograma de letra), não a quantidade.
- Shrikhand não combina com a Hórus — a casa já tem Sora nos títulos. Fica como lição de
  *ter uma display divergente*, não como fonte a adotar.

---

## Aplicado onde

Ainda não aplicado. Encaixes mais fortes para o **site institucional da Hórus** (fundo
carvão quente `#17130E`, acento âmbar/dourado, Sora nos títulos, vanilla HTML/CSS/JS +
GSAP):

- **Mockup de UI ao vivo com número não-redondo** dentro do card de serviço, no lugar de
  ícone — provar "a gente constrói painel/automação" mostrando um painel. Compatível com
  compliance (número de ferramenta, não de paciente).
- **Monograma de letra como ícone-sistema** para listar serviços/soluções da casa e do
  Icarus sem custo de ilustração, com página própria por caso (SEO long-tail).
- **Índice numerado de seção** (`01`–`0n`) para dar progressão à página longa — combina
  com o âmbar como cor do número.
- **FAQ com chips de categoria + contador** e **form multi-etapa que pede só nome/email
  primeiro** — dois padrões de conversão prontos para o rodapé do institucional.
- **A trinca curta de credencial (dois números, não três)** e a agitação que nomeia três
  dores concretas logo após o hero.
