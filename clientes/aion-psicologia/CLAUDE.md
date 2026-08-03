# Aion Psicologia — Clínica de Psicologia (Salvador/BA)

> Projeto criado em 23/07/2026 (cliente #3 da Horus, em prospecção). Pasta dedicada,
> instruções aqui complementam as da raiz. Herda tom, contexto e regras de
> `_memoria/` e `CLAUDE.md` da raiz.

## Sobre

Clínica de psicologia com mais de 20 anos em Salvador, no Itaigara. Equipe de
psicólogos, não é profissional solo. Serviços: psicoterapia, avaliação
neuropsicológica e psicopedagogia. Coordenação: Maria Arminda "Tutti" Cabussu
(CRP 03/939), sócia-gerente.

Presença digital: Instagram ativo mas irregular (99 posts, 815 seguidores),
biolink no lugar de site, site antigo abandonado. O contato é uma das
psicólogas da equipe, via sócio da Horus.

## Tipo

Cliente novo, **em prospecção**. Ainda não é venda fechada.

## Entregas previstas

1. **Site** ← atual (one-page, demo especulativa pra apresentar pra ela)

Nada além disso foi combinado. Não produzir bot, carrossel ou ads sem pedido.

## Postura deste projeto

O site é **especulativo**: construído antes do "sim" pra ser a peça de venda.
Isso muda duas coisas:

- **A marca é a dela, não a nossa.** O sócio foi explícito: tem que ser de
  acordo com o que está no Instagram. Sem reinventar identidade, sem propor
  rebranding nessa fase. Coerência visual com o feed é o critério de aceite.
- **Dados que não temos não viram invenção.** Onde faltar informação real
  (equipe, horários, CRPs), usar placeholder marcado, nunca preencher com
  texto plausível. Um site de demonstração com dado inventado sobre profissional
  de saúde é problema, não é atalho.

## Onde salvar o que

- Briefing e contexto: `briefing.md`
- Marca visual do cliente: `marca.md` (as skills visuais leem daqui, NÃO do
  `identidade/` da raiz)
- Site: **dez páginas**, HTML puro, sem build. Eram quatro até 30/07/2026, quando os
  seis serviços ganharam página própria (decisão do Marcelo).
  - `site/index.html` — ordem das seções (28/07/2026): hero → notch → **seção 1**
    manifesto (**botânica da marca** em mancha pêssego + ramo em traço + foto
    `anotacao-clinica.webp` em retângulo arredondado) → **para quem é** "Quando
    procurar" → **serviços** "O que a clínica atende" (6 cards com uma linha de
    descrição, cada um leva a especialidades.html) → **equipe** "Quem atende"
    (fotos em **arco**, nome, CRP e formação) → **como começa** (3 passos
    **empilhados**, numeral grande à esquerda) → **a clínica** (dupla de imagens) →
    **FAQ** (4 perguntas, o resto em contato.html) → **onde ficamos** (lista
    rótulo/valor + mapa do Google embutido).
    ⚠️ O Marcelo numera assim: Home ≠ seção 1. Home é o topo; seção 1 é o manifesto.
  - **Menu do celular (28/07/2026):** abaixo de 900px a barra de links vira painel,
    aberto por botão hambúrguer (`.nav-abre`, lógica em `site.js`). Antes disso a
    navegação simplesmente sumia no mobile e nada a substituía. Fecha com Esc,
    clique fora ou clique num link. Todas as páginas têm skip link (`.pula`).
  - **Hero sem chip (30/07/2026):** a pílula "Mais de 20 anos em Salvador" acima do
    h1 saiu. Era o `hero-eyebrow-chip` de `90-antipadroes.md`, e a
    `especialidades.html` já vinha sem ela desde 28/07. A prova de tempo de casa,
    que o `00-anatomia.md` §1 exige no hero, foi absorvida no lead ("no Itaigara
    desde 2004"). A regra `.hero .chip` saiu do CSS junto.
  - **"Equipe multidisciplinar" saiu (30/07/2026).** Multidisciplinar é psicólogo +
    fono + TO. A Aion é equipe de psicólogos com formações diferentes, que é o que o
    parágrafo ao lado sempre disse. O termo não aparece **uma vez** no `briefing.md`:
    foi introduzido no site. Virou "Equipe com formações diferentes".
  - `site/contato.html` — formulário + FAQ completo em acordeão `<details>`.
  - `site/especialidades.html` — **índice** dos 6 serviços desde 30/07/2026. Cada
    bloco tem resumo, o h2 abre a página do serviço e o botão do fim leva até ela.
    Os `id` dos `<article>` continuam onde estavam, então link antigo com âncora não
    quebra.
  - **`site/<slug>.html` — as 6 páginas de serviço** (30/07/2026):
    `atendimento-psicologico`, `avaliacao-neuropsicologica`,
    `intervencao-neuropsicologica`, `orientacao-familiar`, `orientacao-profissional`,
    `grupo-apoio-parental`. Mesma estrutura nas seis: migalha (não eyebrow) → h1 →
    linha de público → dois parágrafos → CTA duplo → "Quando esse serviço costuma ser
    procurado" (a frase da seção "para quem é" da home, com a ressalva de que não é
    diagnóstico) → "Como funciona" + "Quem conduz" → FAQ específico → os outros 5
    serviços em card. Fundo alterna creme/areia/creme/areia/creme.
    ⚠️ **Nada de conteúdo novo foi inventado.** O texto sai de `especialidades.html`,
    das frases da home e do FAQ de `contato.html`. O que falta é `.pend`, e as seis
    páginas somam **11 pendências novas** que só a cliente resolve (se aceita laudo de
    fora, se o grupo é aberto a quem não acompanha na clínica, se atende reorientação
    de carreira para quem já está na faculdade, como a orientação familiar se organiza
    quando há dois responsáveis, etc.). Elas são pauta de reunião, não buraco de
    produção: página de serviço obriga a responder o que a página única deixava
    passar em silêncio.
    Cada uma tem `schema.org` `Service` apontando para o `@id` da clínica, `og:` e
    `title` próprios. **Continuam `noindex`**, junto com as outras: o SEO por serviço
    só liga no dia da publicação.
  - **As 6 páginas de serviço foram reformatadas no padrão do Q Psychology
    (01/08/2026)**, a pedido do Marcelo, que mandou
    `qpsychology.com.au/services/general-psychology-services` como referência.
    O que veio de lá, e só isso:
    1. **Hero em faixa de cor cheia** (`.sv-topo`, fundo areia), com o h1 solto até
       20ch, uma **régua fina** e, abaixo dela, duas colunas: leitura à esquerda,
       respiro à direita. A coluna vazia é intencional, é o que dá ar de página de
       destino.
    2. **Marginália**: título de seção pequeno à esquerda, conteúdo na coluna
       direita (`.sv-duo`, `.85fr 1.15fr`). Vale para "Quando é procurado", "Como
       funciona" e "Os outros serviços". ⚠️ Metade disso a página **já tinha**: é a
       mesma proporção do `.faq-grid`, de 26/07.
    3. **Faixa de CTA colorida fechando a página** (`.sv-fecha`), com o botão de
       contato que o Marcelo pediu.
    **O que NÃO foi copiado, e por quê:** no Q quase todo o conteúdo mora dentro de
    acordeão, porque a página dele empilha 12 sub-serviços; aqui cada página tem um
    serviço e dois parágrafos, e esconder isso é esconder o que a pessoa veio ler
    (acordeão ficou só no FAQ). Também ficaram de fora a textura granulada das
    faixas (grão em SVG é antipadrão da casa) e a imagem circular abstrata do hero.
    **Assinatura da página:** a **botânica da marca** (mancha pêssego + ramo em
    traço), a mesma da home, vinda dos cards do Instagram. Sem ela a página seria um
    clone competente do Q em vez de uma página da Aion.
    **Nenhuma palavra de conteúdo mudou**, e nenhum tamanho de fonte novo entrou:
    a transformação foi estrutural, feita por script sobre o texto existente.
    - Alternância de fundo agora: areia (hero) → creme (quando) → areia (como) →
      creme (FAQ, via `.sv-faq`) → areia (outros) → `--terracota-hov` (CTA).
    - **Cor do CTA é `--terracota-hov` #9E3F2B, não a terracota da marca.** Creme
      sobre ele dá **5,92:1**; sobre a terracota #D65F45 daria 2,4:1 e reprovaria
      feio. O botão inverte: creme sólido com texto `--terracota-esc`, 4,63:1.
    - **"Como funciona" e "Quem conduz" deixaram de ser duas colunas lado a lado** e
      empilharam na coluna direita, com fio entre elas. Com o título virando
      marginália, duas colunas dentro da coluna direita dariam quatro faixas
      verticais numa tela de 1240px. "Quem conduz" virou `h3` (era `h2`), o que
      mantém a hierarquia h1→h2→h3 sem pular nível.
    - **Os outros serviços deixaram de ser grid de 3 cards** e viraram lista com
      fio (`.sv-lista`/`.sv-item`). Dois motivos: cinco itens num grid de três
      deixavam um buraco na segunda linha, e "três cards iguais lado a lado" é
      antipadrão da casa. O Q também usa fio, não card.
      ⚠️ **A seta precisa de `grid-column:3` explícito.** Sem isso o auto-placement
      a joga na coluna 2 e empurra o título inteiro para a linha de baixo. Foi
      exatamente o defeito que apareceu na primeira renderização.
    - ⚠️ **Padding vertical das faixas em valor literal + media query, nunca em
      `clamp()`.** Não é preferência: o detector da casa não resolve `clamp()` em
      padding e acusa `cramped-padding` numa seção com 84px de folga. Quirk novo,
      registrado em `_memoria/design/99-checklist.md` §4.
  - **Âncora não passa mais por baixo do cabeçalho (30/07/2026):** o `.nav` é sticky
    de 72px e não havia `scroll-margin-top` em alvo nenhum, então todo link com `#`
    parava com o título escondido atrás da barra. Parecia link quebrado e não era.
    Regra `main[id],section[id],article[id]{scroll-margin-top:92px}` no topo do CSS,
    vale para as dez páginas.
  - `site/politica-privacidade.html` — **minuta** de LGPD, criada 26/07/2026.
    Documento jurídico: precisa de revisão de quem responde pela clínica antes
    de publicar. Controlador é a Aion, não a Horus.
  - `site/assets/site.css` e `site/assets/site.js` — compartilhados pelas **DEZ**
    (dizia "quatro" até 01/08/2026, e estava desatualizado desde 30/07).
    ⚠️ Mexer no CSS/JS afeta todas, conferir todas depois de editar.
  - **Tipografia (corrigido em 28/07/2026):** títulos em **EB Garamond** (garalda
    humanista, `letter-spacing:0`, escala ~8% maior que uma sans equivalente),
    corpo e rótulos em **Karla**, logotipo em **Jost**. Poppins foi removido de vez.
    ⚠️ Este arquivo dizia **Fraunces** até 28/07/2026, e estava errado: o CSS usa
    EB Garamond desde antes. Fraunces está listada como antipadrão em
    `_memoria/design/90-antipadroes.md`, EB Garamond não.
    ⚠️ Continua divergindo do `marca.md`, que pede sans geométrica nos títulos por
    causa dos cards do Instagram. Foi **decisão do Marcelo** (26/07/2026), com a
    ressalva de que é mudança de marca e a cliente precisa validar. Se ela recusar,
    a volta segura é Outfit, não Poppins.
  - **Escala tipográfica consolidada (28/07/2026):** o CSS tinha **28 tamanhos de
    fonte distintos**, com grupos separados por 1 a 3 centésimos de rem (`.92`,
    `.93`, `.94`, `.95`, `.98`), diferença invisível que só polui o sistema. Hoje
    são **9**: `.74` (rótulo miúdo, CRP, dt), `.86` (legenda, ajuda, nota), `.95`
    (texto de apoio, descrição de card), `1` (campo de formulário, não descer daqui
    ou o iOS dá zoom), `1.04` (dado, item de menu no celular, summary do FAQ), `1.1`
    e `1.26` (logotipo), `1.32` (título de card), `1.5` (título de bloco). Títulos
    de display continuam em `clamp()`. **Ao acrescentar tamanho novo, usar um dos
    nove.**
  - **O corpo não diminui no celular (28/07/2026).** Havia um
    `@media(max-width:768px){body{font-size:16.5px}}` que furava o piso de 17px que
    `marca.md` e `99-checklist.md` exigem, justamente no aparelho em que esse público
    lê. Removido. Só o espaçamento vertical encolhe no mobile.
  - **Detector em 01/08/2026: 10, os mesmos 10.** A reformulação das 6 páginas não
    acrescentou nem removeu apontamento. Durante o trabalho subiu para 23 e voltou:
    eram 12 `cramped-padding` do quirk do `clamp()` (corrigido de verdade, com valor
    literal) e 1 `layout-transition` que eu mesmo tinha introduzido com um
    `transition:padding` sem motivo. Zero falha de acessibilidade.
  - **Histórico do detector: 57 → 4 → 10** (`npx impeccable@3.4.0 detect`). O 4 virou 10 em
    30/07/2026 **sem regressão**: são 6 páginas novas usando a mesma escala tipográfica
    já decidida, então a mesma regra advisória passou a ser contada dez vezes em vez de
    quatro. Zero falha de acessibilidade, que é o que a regra da casa não deixa
    dispensar. As páginas de serviço chegaram a acusar `low-contrast` (o
    `--terracota-esc` sobre fundo areia dá 4,1:1) e foi corrigido para
    `--terracota-hov`, 5,2:1, antes de qualquer coisa ser declarada pronta.
    Os apontamentos que sobram são
    todos `flat-type-hierarchy`, regra advisória que pede razão de 1,25 entre degraus
    da escala. A escala atual vai de 11,8px a 21,1px em 6 degraus, com razão de 1,1 a
    1,2. **Fechar esse último ponto exigiria uma escala de 4 degraus com saltos
    grandes**, ou seja, redesenhar o sistema de tamanhos inteiro. Foi decisão
    consciente não fazer isso às vésperas da apresentação. Zero falha de
    acessibilidade, que é o que a regra da casa manda não dispensar.
  - **Botânica da marca (28/07/2026):** a mancha orgânica pêssego e o ramo em traço
    fino terracota são SVG inline em `index.html` (classes `.mancha`/`.ramo`), na
    seção 1 e na equipe. Vieram dos cards do Instagram, que `marca.md` chama de
    referência-mãe. **Substituíram** o cérebro em marca-d'água (clichê do segmento,
    a Aion nunca usou um, e declarava "clínica de neuro" contra a decisão de peso
    igual) e o logo ampliado a 9% atrás da equipe (era o mesmo arquivo do símbolo
    do topo, o mesmo desenho duas vezes).
    ⚠️ Os dois traços enrolados da seção de serviços (`.serv-linha`) continuam:
    são referência do Marcelo. Hoje a página tem duas linguagens decorativas
    convivendo. Se for unificar, a da marca é a botânica.
  - Marca no header/rodapé: `marca-simbolo.webp` + "AION PSICOLOGIA" em Jost.
    Creme + terracota. `noindex` em todas as páginas.
  - **Imagens: só WebP.** Em 26/07/2026 a home pesava 18,7 MB em PNG e caiu para
    ~720 KB. Os PNG originais de marca (`marca-simbolo`, `marca-labirinto`,
    `cerebro-linha`) ficam na pasta como fonte; os `.webp` é que são referenciados.
    Toda imagem nova gerada no Higgsfield sai em 2k e **precisa** passar por
    `ffmpeg -vf scale -c:v libwebp -quality 82` antes de entrar no HTML.
  - Campo sem dado real usa a classe `.pend`. O botão **"Ocultar pendências"** na
    faixa de demo apaga o realce sem apagar a marcação, para apresentar limpo.
  - **Faixa de crise fixa no rodapé de todas as páginas** (CVV 188, emergência 192).
    Não remover. Padrão de clínica de saúde mental; a Aion tem profissional com
    formação em prevenção e posvenção do suicídio.
  - O formulário **não tem servidor**. Avisa em vez de fingir envio. Não ligar em
    serviço de terceiro sem falar com a cliente: dado de contato em saúde é LGPD.
  - Removidos a pedido do Marcelo (23/07/2026): a frase "Este site tem caráter
    informativo..." do rodapé. A seção **"Como começa" voltou** em 26/07/2026,
    junto com o FAQ na home, na revisão de conversão.
  - Removido em 25/07/2026: o cartão de fala da Dra. Maria Tutti (a frase era
    ilustrativa, não era fala real dela) e a foto do prédio, cujo arquivo nunca
    chegou.
- Imagens do site em `site/assets/`, todas geradas no Higgsfield e sem pessoa
  identificável (CFP-safe): `sala-atendimento`, `materiais-avaliacao`,
  `espaco-infantil`, `anotacao-clinica` (profissional com prancheta, seção 1).
  - `sala-atendimento` (hero): a foto é paisagem dentro de uma coluna alta, e o
    `cover` cortava mostrando parede vazia. Corrigido com `object-position:32% center`.
    **Não mexer sem olhar o corte.**
  - `espaco-infantil`: tinha um texto inventado pela IA gravado no rodapé da estante
    (~30x13px, em 1160x866). Reconstruído em 28/07/2026 por interpolação das colunas
    limpas dos dois lados, e re-codificado em WebP q82. O original está em
    `Backup 1/`. As lombadas dos livros ainda têm texto inventado, ilegível no
    tamanho de exibição.
  - `materiais-avaliacao`: são blocos, lápis e pasta, **não** instrumentos de
    avaliação neuropsicológica. A legenda descreve o ambiente e não afirma o que a
    foto não mostra. Quem vai olhar isso é uma especialista em neuropsicologia.
  Retratos reais da equipe: `foto-maria-tutti`, `foto-joao-sarno`,
  `foto-giuliana-ragno` (mandados pelo Marcelo em 26/07/2026).
  ⚠️ As três fotos são de sessões diferentes: Tutti e João em fundo pêssego de
  estúdio (em tons diferentes entre si), Giuliana em ambiente interno com persiana.
  **Remendo aplicado em 28/07/2026:** véu quente uniforme sobre os três
  (`.pessoa-foto::after`) e zoom/enquadramento por foto (`.p-tutti`, `.p-joao`,
  `.p-giuliana`) para cortar contexto de fundo e igualar o tamanho das cabeças.
  **Isso é mitigação, não solução.** A correção de verdade são três fotos no mesmo
  fundo, e continua sendo pedido para a cliente.
- **`site-fontes/`** (criada em 28/07/2026): arte de origem que NÃO é referenciada
  pelo site (PNGs grandes de logo, `cerebro-linha` aposentado, `marca-labirinto`).
  Eram 1,4 MB parados dentro de `site/assets/`, que é a pasta que vai pro Vercel.
  Nada foi apagado, só movido. **Não devolver para `assets/`.**
- **`Backup 1/`** (28/07/2026): cópia do `site/` como estava antes da rodada de
  correções de design. 25 arquivos, 2057 KB.
- SEO e compartilhamento (26/07/2026): favicon (`icone-32`, `icone-180`), imagem
  de OG `compartilhamento.png` (1200x630, gerada por screenshot de HTML), tags
  `og:` nas três páginas e `schema.org` MedicalClinic+Psychologist no index.
  ⚠️ O schema está **incompleto de propósito**: falta telefone e o CRP da pessoa
  jurídica. Não inventar. O `openingHoursSpecification` foi preenchido em
  29/07/2026; o `streetAddress` completo (Alameda Benevento, salas 508/509, nome do
  edifício) e o `postalCode` em 31/07/2026. O domínio `aionpsicologia.com`
  **deixou de ser inferência**: o panfleto da clínica divulga `www.aionpsicologia.com`.
- Referências visuais do Instagram: `referencias-instagram/` (perfil, 6 cards de
  serviço, 3 cards de profissional, logo)

## Regras específicas deste cliente

- **Peso igual entre os serviços** (decisão do Marcelo, 23/07/2026). Os 6 serviços
  entram no mesmo nível de detalhe e destaque visual. A leitura de posicionamento
  em `briefing.md` §6 (clínica de neurodesenvolvimento) vale como **narrativa**, não
  como hierarquia. Não transformar a Aion em "clínica de TDAH" antes de ouvir a
  cliente.
- **Compliance CFP trava tudo** (Resolução CFP 011/2018): CRP visível para cada
  profissional e para a pessoa jurídica; sem promessa de cura ou resultado; sem
  depoimento ou imagem de paciente; sem preço como chamariz; sem sensacionalismo;
  sem superlativo ("os melhores profissionais"). Detalhe em `briefing.md` §7.
- **Cuidado com o texto herdado:** o perfil da clínica no MundoPsicologos usa
  "conta com os melhores profissionais da área". Isso é superlativo comparativo,
  vedado pelo CFP. Não copiar pro site.
- **Dados confirmados pelo Marcelo em 26/07/2026:** e-mail `aion@aionpsicologia.com`;
  CRP da Tutti `03/939` (era pendência, agora confirmado); João Sarno `CRP 03/20812`;
  Giuliana Ragno `CRP 03/23949`.
- **Dados confirmados pelo Marcelo em 28/07/2026:**
  - **WhatsApp `wa.me/557191535067` está CORRETO.** Não é dígito faltando. A
    suspeita de 23/07 (8 dígitos depois do DDD) foi levantada e ele confirmou o
    número. As marcações de pendência foram removidas das 9 ocorrências. **Não
    reabrir isso.**
  - **A clínica atende presencial E online.** Aplicado no FAQ das duas páginas, na
    lista de contato e na linha "Atendimento" da seção Onde ficamos. Continua em
    aberto **quais dos 6 serviços** funcionam online (avaliação neuropsicológica
    costuma exigir parte presencial), e isso está marcado como `.pend`.
  - A reunião de apresentação será **com a Maria Tutti apenas**, ou seja, com quem
    decide. Isso derruba a premissa frágil apontada pelo Advogado do Diabo no log
    `_conselho/logs/2026-07-26-aion-site-pronto-para-apresentar.md`.
- **Dados confirmados pelo panfleto de 22 anos (31/07/2026)**, entregue pelo sócio.
  Fonte primária, é a própria clínica falando:
  - **Endereço: Alameda Benevento, 429, salas 508 e 509, Centro Empresarial
    Itaigara Sul, Itaigara, Salvador, BA, 41825-000.** O site dizia "Av. Antônio
    Carlos Magalhães, 429" com `.pend`. **Não estava errado:** o prédio faz esquina
    e é 429 nas duas ruas, mesmo CEP. Adotamos a Benevento porque é como a clínica
    se identifica. Aplicado no schema, na seção "Onde ficamos", no mapa e no
    `contato.html`. Pendência de endereço e de sala **fechada**.
  - **Fundação 2004** (22 anos em 2026). ⚠️ **Manter "desde 2004" no site, não
    trocar por "22 anos":** o número envelhece sozinho e vira manutenção anual, a
    data prova o mesmo e não estraga.
  - **Domínio `aionpsicologia.com` é dela e já é divulgado.** Resolve o §11 do
    briefing e valida o domínio que o `schema.org` já usava. Está registrado na
    Locaweb sem site publicado. ⚠️ **Se o e-mail da clínica estiver no mesmo plano,
    apontar o DNS sem preservar os MX derruba o e-mail dela.**
  - **Telefone (71) 3351-6630** impresso em peça de 2026. Indício forte de linha
    ativa, não confirmação. Segue `.pend` no site.
  - 🔴 **A lista de serviços do panfleto não bate com a dos destaques.** Ele traz
    **Avaliações Psicológicas** e **Educação Sócio Emocional**, que o site não tem,
    e **omite** Intervenção Neuropsicológica, Orientação Familiar e Grupo de Apoio
    Parental, que o site tem. **Não criar página de serviço nova, não mexer nos 6.**
    Não existe uma linha de descrição real dessas duas, e inventar texto sobre
    serviço de psicologia é o que `_memoria/integridade.md` proíbe. É a pergunta de
    conteúdo nº 1 da reunião. Detalhe em `briefing.md` §3.
  - **O panfleto não traz CRP nenhum.** Mesmo furo dos cards do Instagram, agora em
    peça de rua. Usar como demonstração de valor na reunião, **não** como crítica
    ao material dela. Ver `briefing.md` §8.
- **Dado confirmado pelo Marcelo em 29/07/2026:** **horário de funcionamento** é
  segunda a sexta das 7h30 às 20h, sábado das 7h30 às 12h, domingo fechado. Aplicado
  na seção "Onde ficamos" do `index.html`, nos chips do `contato.html` e no
  `openingHoursSpecification` do schema. Saiu da lista de pendências.
- **Ainda travam a publicação:** telefone fixo ativo, CRP da pessoa jurídica,
  responsável técnica, os 2 profissionais que faltam, destino do formulário,
  revisão da política de privacidade e o acesso ao painel da Locaweb (com os MX
  do e-mail preservados). **Endereço e sala saíram desta lista em 31/07/2026.**
- ⚠️ **Vercel:** o Marcelo vai subir pelo Vercel. Enquanto não houver o "sim" da
  cliente e o CRP da pessoa jurídica + responsável técnica preenchidos, subir com
  **Deployment Protection ligada** (senha ou Vercel Authentication). O `noindex`
  impede busca, não impede acesso, e a página carrega nome, foto, CRP e endereço de
  três psicólogos com "responsável técnica a confirmar" no rodapé. Quem responde ao
  CFP é a clínica, não a Horus.
- **Aion é ambíguo na busca.** Existe uma "Aion Psicologia" em Santa Catarina
  (@aionpsicologiasc, aionpsicologia.com.br) e um "Instituto Aion". Não são a
  mesma clínica. Ao pesquisar, filtrar por Salvador/Itaigara.
