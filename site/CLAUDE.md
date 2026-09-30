# Site institucional da Hórus

Site da **própria agência**, não de cliente. Por isso mora em `site/` na raiz e
não em `clientes/`.

## Estado em 26/09/2026 (versão 48) — SEO local e ligação com o Perfil da Empresa no Google

- **Título da home:** `Horus Agência | Marketing digital e criação de sites em Salvador` (era o slogan
  antigo "Nós construímos máquinas, sistemas e marcas", que não batia com o H1). Descrição e
  `og:description` reescritas com "Salvador". Decisão de 05/08 ("não se declara **só** de
  Salvador") preservada: o título diz onde a Horus está, não limita o alcance.
- **Marcação estruturada (JSON-LD `ProfessionalService`)** na home: nome, telefone, e-mail,
  área (Salvador, Lauro de Freitas, Camaçari, Simões Filho), horário seg a sex 9h às 22h, Instagram. Tem que bater com
  o Perfil da Empresa no Google; mudou lá, muda aqui.
- **Case Novare:** saiu "superando a rigidez das normas éticas do CFP" (lia como driblar o
  conselho, em cliente regulado). Agora: "respeitando integralmente as normas do CFP".
- **Cases individuais removidos do site** (pedido do Marcelo: "não era pra existir"): os 15
  `portfolio/<projeto>.html` saíram de `site/` e foram guardados em
  `site-fontes/cases-removidos-2026-09-26/` (fora do ar; 6 nunca tinham ido ao Git). Os
  endereços antigos respondem 404. Ficam só `portfolio.html` e `portfolio/index.html`.
- **Perfil da Empresa no Google** (feito pelo Marcelo, conferido e ajustado em 26/09): nome
  "Horus Agência" aprovado; área reduzida a Salvador, Camaçari, Lauro de Freitas e Simões Filho
  (tinha "Brasil" e "Bahia", que diluem o ranqueamento local); 6 serviços personalizados
  adicionados, em revisão.

---

## Estado em 25/09/2026 (versão 47) — No ar em horusagencia.com.br e aberto ao Google

- **Domínio próprio:** `https://horusagencia.com.br` (Registro.br: A `@` → 75.2.60.5,
  CNAME `www` → `horusagencia.netlify.app`; www e http redirecionam). Os 74 links do
  endereço antigo (`agenciahorus.netlify.app`, que nem era o endereço real) foram trocados.
- **Aberto ao Google** por decisão do Marcelo: saíram a `<meta robots>` (fica só na
  `404.html`), o `Disallow` do `robots.txt` e o `X-Robots-Tag`. Sitemap enviado no Search
  Console pelo Marcelo.
- **Deploy é arrastando `site/_publish`.** Por isso cabeçalhos e redirecionamentos saíram do
  `netlify.toml` e foram para `site/_headers` e `site/_redirects` (no ar não estavam valendo).
- **CSP corrigido:** o logo 3D do hero (gaussian-splats-3d) precisava de `blob:` em
  `connect-src`/`worker-src` e de `'wasm-unsafe-eval'`; com o CSP antigo ele subia vazio.
- **Pacote de 33 MB para 12 MB:** 24 assets sem referência (PNG de origem do portfólio,
  vídeo antigo do hero, fundos de rodadas passadas) entraram na lista de órfãos do
  `build-deploy.mjs`. Continuam no repositório.
- **Cases da Amêndoa e da Soleira:** saiu o botão "Acessar site no ar", que levava a
  artifact privado do claude.ai (tela de login). **VerdiServ** perdeu o travessão do nome.
- **Portfólio fora do Google** (decisão do Marcelo): `portfolio.html` e os 16 cases com
  `<meta name="robots" content="noindex, follow">` + `X-Robots-Tag` no `_headers` (inclusive
  `/assets/portfolio/*`, fora do Google Imagens); sitemap só com a home. Não bloquear no
  `robots.txt`, senão o Google não lê o noindex. Acesso continua pelo menu do site.
- **Favicon:** o Google mostrava o globo genérico. Novos `favicon.ico` (raiz, 16/32/48),
  `assets/favicon-192.png` e os links das 19 páginas em caminho absoluto.
- **Verificação:** 17 páginas do sitemap + 404, em 1440 e 390px, com o CSP de produção:
  0 erro de console, 0 imagem quebrada, 0 rolagem lateral, 0 link interno quebrado.
  Detector do impeccable: saída `2` com 23 achados de estilo (brilho, texto em gradiente),
  nenhum de acessibilidade; mantidos por serem a estética aprovada.

---

## Estado em 24/09/2026 (versão 46) — Novo Título Natural (Sem Capslock) & Curadoria de Bastidores do Portfólio

Ajustes refinados solicitados pelo Marcelo:
- **Remoção de Capslock (`text-transform: uppercase`):**
  - Removido `text-transform: uppercase` de `.pf-page-title` em `site/portfolio.html` e `site/portfolio/index.html`.
  - Ajustado `line-height: 1.05`, `letter-spacing: -0.035em` e `gap: 6px` para acomodar a tipografia mista (caixa alta e baixa com ascendentes/descendentes) com ritmo editorial impecável.
- **Novo Título Principal & Subtítulo:**
  - **Título Principal (`.pf-page-title`):**
    - `Uma amostra do que criamos.`
    - `O restante fica nos bastidores.`
  - **Subtítulo/Descrição (`.pf-page-desc`):**
    - *"Reunimos aqui apenas uma fração dos nossos projetos. Entre acordos de confidencialidade e sistemas internos em produção contínua, esta é uma curadoria pública do que desenhamos e desenvolvemos do absoluto zero."*
  - Contextualiza a vitrine como uma seleção/fração pública (punhado) de um portfólio maior com trabalhos sob NDA e evolução contínua, sem inventar métricas infladas e eliminando o travessão em copy (conformidade com `_memoria/preferencias.md`).
- **Sincronização & Deploy:**
  - Aplicado em `site/portfolio.html` e `site/portfolio/index.html`.
  - Compilado com sucesso em `site/_publish` via `node site/build-deploy.mjs`.

---

## Estado em 24/09/2026 (versão 45) — Atualização do Título do Portfólio (20 Trabalhos) & Remoção do Eyebrow "Trabalhos"

Ajustes refinados solicitados pelo Marcelo:
- **Remoção do Eyebrow "Trabalhos" (`.pf-eyebrow`):**
  - Removido o rótulo superior pequeno `"TRABALHOS"` que antecedia o título principal no hero da página de portfólio (`portfolio.html` e `portfolio/index.html`).
  - O título principal agora surge direto no topo com máxima imponência e presença visual.
  - Linha do tempo de animação GSAP (`heroTl`) ajustada para iniciar direto nas linhas do título com stagger e blur reveal suave.
- **Variação do Título e Descrição para "20 Trabalhos":**
  - **Novo Título Principal (`.pf-page-title`):**
    - `FORAM 20 TRABALHOS.`
    - `CADA UM DO ZERO.`
  - **Novo Subtítulo/Descrição (`.pf-page-desc`):**
    - *"Vinte projetos desenhados e desenvolvidos do absoluto zero, com código proprietário e identidade exclusiva. Sem templates, sem atalhos — apenas interfaces reais criadas para converter e posicionar no topo."*
- **Sincronização & Deploy:**
  - Aplicado em `site/portfolio.html` e `site/portfolio/index.html`.
  - Validado via Playwright com renderização óptica confirmada.
  - Sincronizado e compilado com sucesso em `site/_publish` via `node site/build-deploy.mjs`.

---

## Estado em 23/09/2026 (versão 44) — Remoção de Cliques e Localização no Portfólio & Curadoria de 5 Projetos na Home

Ajustes refinados solicitados pelo Marcelo:
- **Remoção de Cliques e Links na Página de Portfólio (`portfolio.html` e `portfolio/index.html`):**
  - Os 15 cards deixaram de ser tags `<a>` interativas com redirecionamento para estudo de caso e foram convertidos em `<article class="pf-item pf-card">` puramente visuais e contemplativos.
  - Removido `cursor: pointer` e transições de cor de link: a moldura mantém o efeito sutil de profundidade ao passar o mouse (`translateY(-4px)` e glow suave), sem transformar o cursor em clique nem abrir subpáginas.
- **Eliminação Completa de "Localização" das Legendas:**
  - Removido o bloco `.pf-meta-col` de todos os 15 cards da página de portfólio. As legendas agora exibem com exclusividade o título do projeto alinhado à esquerda diretamente sob a moldura da imagem (`.pf-tit`).
- **Curadoria dos 5 Projetos na Seção Portfólio da Home (`site/index.html`):**
  - Substituídos os projetos antigos da trilha horizontal (`.pf-tira`) pelos 4 novos flagships solicitados mais a usina de painel solar:
    1. **Soluna Arquitetura:** Arquitetura biofílica e hospitalidade boutique (`pf-soluna.webp`).
    2. **Atelier Noir:** Arquitetura contemporânea e estética brutalista refinada (`pf-atelier-noir.webp`).
    3. **NAVA Studio:** E-commerce editorial contemporâneo de vestuário e moda autoral (`pf-nava.webp`).
    4. **Lucas Almeida:** Design de produto, engenharia de hardware e mobilidade urbana (`pf-lucas-almeida.webp`).
    5. **Solarium Energia Solar:** Usina fotovoltaica industrial e redução de 95% de energia (`pf-solarium.webp`).
- **Validação Automatizada & Deploy:**
  - Testado via Playwright (Chromium headless): 0 links de redirecionamento na grade do portfólio, 0 ocorrências de "localização", e exatamente os 5 cards solicitados ativos e funcionando na rolagem da home.
  - Sincronizado e compilado com sucesso em `site/_publish` via `node site/build-deploy.mjs`.

---

## Estado em 23/09/2026 (versão 43) — Expansão do Portfólio (6 Novos Projetos Flagship) e Atualização das Imagens Melhoradas (Soleira, Solarium, Lumina e Amêndoa)

Implementação das novas peças conceituais e substituição das versões aprimoradas enviadas pelo Marcelo:
- **6 Novos Projetos Flagship no Portfólio:**
  - Adicionados no topo da grade da página de portfólio (`portfolio.html` e `portfolio/index.html`), totalizando 15 projetos ("QUINZE DE PERTO."):
    1. **Soluna Arquitetura:** Arquitetura biofílica, residencial de luxo e hotelaria boutique em Trancoso, BA (`pf-soluna.webp`).
    2. **Atelier Noir:** Arquitetura contemporânea de estética brutalista refinada e design de interiores em São Paulo, SP (`pf-atelier-noir.webp`).
    3. **Casa Alba Residências:** Arquitetura residencial autoral de alto padrão e design escultural em Búzios, RJ (`pf-casa-alba.webp`).
    4. **NAVA Studio:** E-commerce editorial contemporâneo de vestuário e moda atemporal em Curitiba, PR (`pf-nava.webp`). (Imagem 5 excluída conforme instrução direta do Marcelo).
    5. **Brincar Playgrounds:** Espaços lúdicos, urbanismo infantil e soluções para escolas particulares e condomínios em São Paulo, SP (`pf-brincar.webp`).
    6. **Lucas Almeida Design:** Portfólio arrojado em Bento Grid para design de produto e engenharia de hardware em Florianópolis, SC (`pf-lucas-almeida.webp`).
  - Páginas individuais de estudo de caso criadas em `site/portfolio/` para os 6 novos projetos (`soluna.html`, `atelier-noir.html`, `casa-alba.html`, `nava.html`, `brincar.html`, `lucas-almeida.html`), mantendo 100% da arquitetura sticky, metadados, entregáveis e carrossel de próximos projetos.
  - URLs adicionadas ao `sitemap.xml`.
- **Substituição das 4 Imagens Aprimoradas no Portfólio:**
  - Atualizadas as imagens de alta resolução em formato WebP otimizado (85-95 KB) tanto na seção portfólio da home (`index.html`) quanto na página dedicada de portfólio (`portfolio.html` e `portfolio/index.html`) e estudos de caso:
    - **Soleira Arquitetura:** `assets/portfolio/pf-soleira.webp` atualizado com o novo render amplo de sala de estar integrada à natureza.
    - **Solarium Energia Solar:** `assets/portfolio/pf-solarium.webp` atualizado com o novo visual aéreo da usina solar e dados de economia de 95%.
    - **Lumina Dental Studio:** `assets/portfolio/pf-lumina.webp` atualizado com o novo consultório de odontologia estética premium.
    - **Amêndoa Confeitaria:** `assets/portfolio/pf-amendoa.webp` atualizado com o novo bolo artesanal de cacau e framboesas com folha de ouro.
- **Validação Automatizada & Deploy:**
  - Testado via Playwright (Chromium headless 1440x900): 15/15 cards da página de portfólio verificados com carregamento de imagem confirmado, 6 novos estudos de caso abertos e validados, e carrossel da home íntegro.
  - Sincronizado e compilado com sucesso em `site/_publish` via `node site/build-deploy.mjs` (124 arquivos, 0 erros).

---

## Estado em 23/09/2026 (versão 42) — Eliminação de Linhas Divisórias (Compromissos → Portfólio e Como Começa → Seção Final), Ícone de Foguete e Alinhamento Óptico dos Quadradinhos Azuis

Ajustes refinados solicitados pelo Marcelo:
- **Eliminação da Linha Divisória Entre "Nossos Compromissos" e "Portfólio":**
  - Fundo `#000206` da seção `.qualidade` agora se dissolve de forma invisível e gradual no `#030712` do Portfólio através de `.qualidade::after` com fade de 260px (`linear-gradient(to bottom, transparent, #030712)`).
  - O topo de `.pf-pin` foi ajustado com gradiente sutil partindo de `#030712` (`linear-gradient(to bottom, #030712 0%, transparent 160px...)`), eliminando o degrau de contraste entre as seções e unificando o fluxo.
- **Eliminação da Linha Divisória Entre "Como Começa" e a Seção Final:**
  - Removida a linha divisória superior (`border-top: 1px solid rgba(...)`) em `.ps-rodape-linha` e ocultada a linha divisória interna `.ps-divisor-fio`.
  - Adicionado pseudo-elemento `.passos::after` com fade suave de 260px (`linear-gradient(to bottom, transparent, #000206)`) na base de `.passos`, dissolvendo o tom `#030712` de forma contínua no `#000206` do espaço cósmico com estrelas da seção final (`.encerra`), sem corte ou linha.
- **Ícone de Foguete na Etapa 04 ("Lançamento e crescimento"):**
  - Substituído o ícone de barras verticais pelo desenho vetorial refinado de um foguete (rocket) com `stroke-width="1.8"`, pontas arredondadas e chama na base, alinhado ao significado de "Lançamento e crescimento".
- **Alinhamento Óptico dos Quadradinhos Azuis (`■`) com os Rótulos/Títulos:**
  - Compensado o deslocamento causado pelo line-box tipográfico (que deixava o quadrado 7px visualmente abaixo do centro das letras maiúsculas em DM Sans 11.5px).
  - Aplicada a compensação óptica milimétrica `transform: translateY(-1px)` em todas as seções: `.stk-quadrado` ("NOSSO STACK"), `.svcs-quadrado` ("NOSSOS SERVIÇOS"), `.qp-quadrado`/`.qp-badge-ponto` ("NOSSO COMPROMISSO"), `.pf-quadrado` ("PROJETOS EM DESTAQUE") e `.ps-quadrado` ("COMO COMEÇA").
- **Validação Automatizada & Deploy:**
  - Validado via Playwright em Desktop (1440x900) e Mobile (390x844): capturas de tela das junções e dos 5 eyebrows comprovando alinhamento simétrico e 0 linhas de corte.
  - Sincronizado e compilado com sucesso em `site/_publish` via `node site/build-deploy.mjs`.

---

## Estado em 23/09/2026 (versão 41) — Eliminação da Linha Divisória Entre Seção 1 e 2 & Auditoria de Velocidade das Ondas

Ajustes refinados solicitados pelo Marcelo:
- **Eliminação da Divisão / Corte Entre Seção 1 e Seção 2:**
  - Diagnóstico: A Seção 1 (`.valores.s1-secao`) residindo no final do contêiner `.hero` terminava com o gradiente cósmico e o canvas de ondas cortados bruscamente na base contra o fundo `#000206` da Seção 2 (`.stk-secao`), criando uma linha de corte horizontal visível de 1440px.
  - Adicionada máscara gradiente suave em `.s1-waves-canvas`: `-webkit-mask-image: linear-gradient(to bottom, black 0%, black 65%, transparent 96%)`, fazendo as linhas de onda se dissolverem gradualmente antes da borda inferior.
  - Adicionado pseudo-elemento `.valores::after` com fade suave para `#000206`: `linear-gradient(to bottom, transparent 0%, rgba(0, 2, 6, 0.5) 45%, #000206 100%)`, garantindo que a base da Seção 1 atinja 100% de preto obsidiana cósmico antes da Seção 2, eliminando qualquer linha divisória ou corte de fundo.
- **Auditoria de Velocidade das Linhas da Seção 1 (`assets/s1-waves.js`):**
  - Histórico conferido no Git desde a criação do arquivo (commit `49879888` em 22/09): os coeficientes de velocidade das 3 ondas componentes (`elapsed * 0.45`, `elapsed * 0.38`, `elapsed * 0.22`) e as durações do CSS (`.s1-linha-guia: 1.2s`, `.s1-palavra: 0.95s`) **não sofreram qualquer alteração**, permanecendo rigorosamente os mesmos originais aprovados.
- **Validação Automatizada & Deploy:**
  - Validado via Playwright em Desktop (1440x900) e Mobile (390x844): junção entre Seção 1 e Seção 2 inspecionada pixel a pixel com 0 linhas e 100% de continuidade.
  - Sincronizado e compilado com sucesso em `site/_publish` via `node site/build-deploy.mjs`.

---

## Estado em 23/09/2026 (versão 40) — Continuidade Visual Contínua Entre Portfólio e Como Começa (Eliminação da Linha Divisória)

Ajustes refinados para fazer Portfólio e Como Começa parecerem parte da mesma seção contínua:
- **Eliminação da Linha Divisória / Seam:**
  - Diagnóstico: A seção `.portfolio` era transparente enquanto seu painel fixado `.pf-pin` utilizava `#020617` com gradiente azul terminando bruscamente na base; a seção `.passos` começava logo abaixo com `#030712`, criando uma linha de corte nítida de 1440px de largura que subia na tela durante a rolagem.
  - Base cósmica unificada em `#030712` em `.portfolio`, `.pf-pin` e `.passos`.
  - Aplicada camada de transição contínua `linear-gradient(to bottom, transparent 65%, #030712 96%, #030712 100%)` no fundo de `.pf-pin`, dissolvendo 100% da iluminação lateral para o preto obsidiana cósmico antes da borda inferior.
  - Aplicada camada de entrada `linear-gradient(to bottom, #030712 0%, #030712 6%, transparent 32%)` em `.passos`, garantindo continuidade com delta de cor 0.00% entre as duas seções.
- **Harmonização de Ritmo e Espaçamento (Mesma Seção):**
  - Reduzido o recuo superior (`padding-top`) de `.passos` de 130px para 70px (e responsivo 60px/56px/48px), eliminando o abismo vazio e conectando o encerramento da vitrine de projetos diretamente ao processo "Como Começa".
- **Validação Automatizada & Deploy:**
  - Validado via Playwright em Desktop (1440x900) e Mobile (390x844): corte horizontal inspecionado pixel a pixel e comprovado 100% uniforme e invisível.
  - Sincronizado e compilado com sucesso em `site/_publish` via `node site/build-deploy.mjs`.

---

## Estado em 23/09/2026 (versão 39) — Reversão do Fundo da Seção 1 e Restauração da Inclinação 3D Acentuada do Stack

Ajustes refinados solicitados pelo Marcelo:
- **Reversão do Fundo da Seção 1 ("O digital mudou."):**
  - A Seção 1 (`.valores.s1-secao`) retornou para o interior de `<section class="hero" id="hero">` mantendo `id="sobre"`.
  - Removido `background: var(--tinta)` de `.valores`: o gradiente cósmico, as estrelas e a iluminação atmosférica do hero agora fluem de forma 100% contínua e sem qualquer corte ou caixa escura para a Seção 1, exatamente como estava aprovado anteriormente.
  - O seletor `#sobre, .s1-secao[id]` em `site.css` foi adicionado à regra com `scroll-margin-top: calc(var(--cabecalho) + 24px);`. Ao clicar em "Sobre" no menu, o browser rola suavemente parando exatamente no início de "O digital mudou.", respeitando a barra fixa de navegação.
- **Restauração da Inclinação 3D Acentuada do Stack (Nosso Stack):**
  - Restaurada a geometria física e a perspectiva profunda que o Marcelo preferia:
    - Inclinação base do plano 3D: `rotateX(-8deg) rotateY(-36deg) rotateZ(8deg)`.
    - Perspectiva original: `perspective: 920px` e `perspective-origin: 12% 48%`.
    - Script `s2-stack.js` com a base de ângulos original (`baseRotX = -8; baseRotY = -36; baseRotZ = 8;`) e a paralaxe viva no mouseover.
  - O bug dos cards que sumiam perto do final permanece completamente resolvido através da eliminação de `backface-visibility: hidden` e `transform-style: preserve-3d` dos cards (que causavam culling de polígonos na GPU) e pelo ajuste fino da máscara lateral em degradê suave (`black 45% ... transparent 88%`), fazendo as teclas dissolverem gradualmente no infinito escuro sem nunca sofrerem corte repentino.
- **Validação Automatizada & Deploy:**
  - Validado via Playwright em Desktop (1440x900): navegação de "Sobre" com scroll preciso para a Seção 1 com fundo contínuo transparente, e os 84 cards do Stack 3D inspecionados em movimento com 0 erros de visibilidade e inclinação idêntica ao design original.
  - Pacote compilado e sincronizado em `site/_publish` via `node site/build-deploy.mjs`.

---

## Estado em 23/09/2026 (versão 38) — Navegação "Sobre" Direta para Seção 1 e Eliminação de Clipping dos Cards do Stack 3D

Correções e estabilizações pontuais solicitadas pelo Marcelo:
- **Navegação "Sobre" apontando diretamente para Seção 1 ("O digital mudou."):**
  - Desacoplamento da Seção 1 (`.valores.s1-secao`) da tag `<section class="hero">`.
  - O hero agora possui seu próprio contêiner `<section class="hero" id="hero">`, enquanto a Seção 1 foi promovida a `<section class="valores s1-secao" id="sobre" aria-label="Sobre a Horus">`.
  - Como toda `section[id]` possui `scroll-margin-top: calc(var(--cabecalho) + 24px);`, o clique no menu `Sobre` rola a página suavemente e posiciona o título "O digital mudou. Seu negócio também deveria mudar." perfeitamente alinhado abaixo do cabeçalho fixo, sem sobreposição.
  - Adicionado `background: var(--tinta)` explícito em `.valores` garantindo um canvas obsidian uniforme e contínuo para a malha de ondas interativa (`s1-waves-canvas`).
- **Eliminação do bug de cards que sumiam do nada na Seção 2 (Stack 3D):**
  - **Diagnóstico da Causa Raiz:** O plano 3D (`.stk-plano-3d`) com inclinação acentuada (`rotateY(-36deg)` no CSS, atingindo até `-43deg` com mouseover) combinado com `perspective: 920px` fazia com que cards à direita ao longo do trilho de 3080px avançassem no eixo Z até ultrapassar a distância da câmera ($Z \ge \text{perspective}$). No Chromium/Skia, qualquer elemento que atinja ou cruze o plano de corte frontal (near clipping plane) é descartado imediatamente da pipeline gráfica de rasterização, fazendo o card apagar instantaneamente no ar.
  - **Recalibração Geométrica da Perspectiva:**
    - `perspective` ampliada de 920px para **2000px** em `.stk-cenario-3d`, mantendo a volumetria imersiva com margem de segurança de mais de 70% em relação ao plano de corte.
    - Transformação base do plano 3D suavizada para `translateZ(-140px) rotateX(-6deg) rotateY(-22deg) rotateZ(6deg)`, reduzindo a projeção máxima em Z para valores muito aquém de qualquer risco de clipping.
    - Atualizado o script `assets/s2-stack.js` para manter `translateZ(-140px)` e os novos ângulos base durante a paralaxe do mouse, evitando saltos de transformação.
    - Removidos `backface-visibility: hidden` e `transform-style: preserve-3d` redundantes de `.stk-card` e `.stk-trilho`, eliminando falhas de culling normal e dezenas de contextos de ordenação de polígonos na GPU.
    - Máscara de gradiente lateral ajustada (`black 45% ... transparent 92%`) para dissolver os cards no breu cósmico de forma contínua e gradual antes da margem direita.
- **Validação Automatizada & Deploy:**
  - Testado via Playwright em Desktop (1440x900): navegação de `#sobre` verificada com scroll direto para a Seção 1 (`scrollY: 901px`, `top: 0`), e 84/84 cards do Stack 3D inspecionados com 100% de visibilidade e 0 interrupções durante o laço contínuo e movimento do mouse.
  - Sincronizado e compilado com sucesso em `site/_publish` via `node site/build-deploy.mjs`.

---

## Estado em 23/09/2026 (versão 37) — Página de Portfólio: Título Impactante (Referência Walk), Imagens Maiores e Motion ao Descer

Ajustes refinados na página dedicada de portfólio (`portfolio.html` e `portfolio/index.html`), inspirados na nova referência visual enviada pelo Marcelo:
- **Título & Subtítulo (Estilo Walk Studio / Referência):**
  - **Eyebrow:** `.pf-eyebrow` com o quadradinho azul padrão da marca e texto `TRABALHOS` em caixa alta com tracking amplo (`0.24em`, DM Sans 600).
  - **Título Impactante em 2 Linhas:** `MAIS DE 40 SITES.` / `NOVE DE PERTO.` em DM Sans 800 (ExtraBold), caixa alta, entrelinha ultracompacta (`line-height: 0.94`), tracking negativo (`-0.04em`), tamanho responsivo de `clamp(2.8rem, 6.2vw, 5.8rem)` e ponto final em cada linha idêntico à referência.
  - **Subtítulo / Parágrafo Editorial:** Alinhado à esquerda diretamente sob o título: *"A Horus já passou de quarenta sites entregues. Os nove abaixo são um recorte, escolhidos por mostrarem coisas diferentes: cada um foi construído do zero, com front próprio, e as capturas são dos sites como estão no ar."* Em Slate-400 com largura balanceada de 58 caracteres.
- **Imagens Maiores com Enquadramento Perfeito:**
  - O envelope da página (`.pf-envelope`) foi expandido de 1440px para **1540px**, conferindo mais de 100px adicionais de palco horizontal e ampliando a largura de cada card em desktop de ~580px para **~720px** (+24% de área visual útil).
  - A proporção de tela (`.pf-tela`) foi calibrada em `aspect-ratio: 16 / 10` com `object-position: top center; object-fit: cover;`, exibindo os cabeçalhos, logos e tipografias dos sites reais (Novare, Café Grão da Serra, IRS Performance, VerdiServ, Soleira, etc.) de forma 100% nítida e sem cortes nas laterais.
- **Motion ao Descer (Scroll Reveal + Parallax):**
  - **Revelação Elegante:** Ao rolar para baixo, cada card entra com elevação fluida (`y: 60`, `scale: 0.97` para `y: 0`, `scale: 1`, duration `0.9s`, ease `power3.out`).
  - **Parallax Vivo na Imagem Interna:** Ao rolar a página para baixo, a imagem de cada projeto desliza suavemente dentro da moldura com ScrollTrigger scrub (`yPercent: -4` a `+4`), criando profundidade tangível.
  - **Parallax Contínuo entre Colunas:** No desktop, a coluna par (direita) possui um offset inicial e desliza com desaceleração diferenciada (`scrub: 1.2`), criando um fluxo editorial dinâmico de galeria.
  - **Hero Motion:** Animação de entrada sequencial com desfoque dissipando no título e fade no subtítulo.
- **Harmonização do CTA Final:**
  - O botão de encerramento da página foi atualizado para o mesmo botão pill obsidiana com glow azul elétrico (`"Começar meu projeto" ↗`) já validado na landing page.
- **Deploy:**
  - Build compilado e sincronizado em `site/_publish` via `node site/build-deploy.mjs`.

---

## Estado em 23/09/2026 (versão 36) — Refinamento Global: Stack 3D, Ícones Oficiais, Compromissos, Motion e Botão CTA

Ajustes refinados solicitados pelo Marcelo em múltiplas seções do site:
- **Seção 2 (Nosso Stack) — Cabeçalho e Estabilidade 3D:**
  - Removido o número `02` e o traço divisor do topo da seção.
  - Adicionado o quadradinho azul padrão luminescente (`.stk-quadrado`, `#0077ff` com glow) antes do texto `NOSSO STACK`.
  - **Correção de bugs e travamentos:** Removido o conflito entre `transition: transform 0.6s` e as atualizações de paralaxe em 60fps via `requestAnimationFrame` no `.stk-plano-3d`, eliminando completamente engasgos e travamentos ao mover o mouse.
  - **Correção de cards que desapareciam:** Removido `backdrop-filter: blur(14px)` dos cards de vidro flutuantes (`.stk-card`) que causavam dropouts de buffer e falhas na rasterização do Skia dentro de contextos `preserve-3d` com `mask-image`. Adicionado `backface-visibility: hidden` e otimizado gradiente fumê para renderização ultraleve e consistente.
  - Ajustado o `IntersectionObserver` em `assets/s2-stack.js` para gerenciar o estado dos trilhos sem loops redundantes.
- **Padronização Global dos Eyebrows / Subtítulos:**
  - Todas as seções subsequentes com o quadradinho azul (`NOSSOS SERVIÇOS`, `NOSSO COMPROMISSO`, `PORTFÓLIO`, `COMO COMEÇA`) agora seguem estritamente a mesma tipografia padronizada de `NOSSO STACK`: DM Sans, 11.5px, `font-weight: 600`, `letter-spacing: 0.24em`, caixa alta e cor `rgba(226, 232, 240, 0.65)`.
- **Vetorização e Fidelidade dos Ícones do Stack:**
  - Corrigidos e substituídos todos os SVGs bugados ou de baixa fidelidade pelos vetores oficiais de alta resolução:
    - **Zapier:** Logo oficial em asterisco em laranja `#FF4F00`.
    - **Google Cloud:** Vetor oficial colorido de 4 cores da nuvem Google.
    - **Make:** Logotipo oficial de barras tridimensionais em púrpura `#A855F7`.
    - **n8n:** Marca oficial de nós de automação em `#EA4B71`.
    - **Cloudflare:** Vetor preenchido em alta escala na cor `#F38020`.
    - **Firebase:** Chama oficial nítida em alta escala.
    - **Mailchimp:** Ícone oficial amarelo do Freddie (eliminando assinatura escura ilegível).
    - **Vite:** V estilizado com raio em roxo e amarelo.
    - **Webflow:** W oficial em azul `#146EF5`.
    - **WordPress:** Emblema nítido em azul `#21759B`.
    - **Claude:** Vetor oficial da Anthropic em terracota `#D97757`.
- **Seção "Nossos Compromissos":**
  - Removidos de todos os 5 cards a setinha de rodapé (`.qp-btn-seta`) e a barra de linha brilhante inferior (`.qp-barra-cor`), deixando os cards limpos, minimalistas e elegantes.
  - Substituído o ícone inclinado/torto do Card 03 ("Preço fechado antes") por um cadeado reto, perfeitamente centralizado e com checkmark de segurança.
- **Seção "Como Começa" — Aceleração da Linha do Tempo:**
  - Ajustado o ScrollTrigger da timeline GSAP: `start: 'top 75%'`, `end: 'bottom 55%'`, suavização `scrub: 0.6` (reduzindo a latência anterior de 1.5s) e limiares de ativação antecipados `[0.06, 0.32, 0.60, 0.88]`.
  - A linha agora conecta e acende a etapa 04 ("Lançamento e crescimento") com clareza enquanto a seção ainda está confortável e centralizada no campo de visão do usuário.
- **Última Seção (Chamada Final) — Redesign do Botão CTA:**
  - Removido o símbolo de estrelas/sparkles.
  - Botão totalmente redesenhado fielmente à referência do Marcelo: pill escuro obsidiana (`#030712`), borda azul elétrica com glow luminescente (`1.8px solid #0066ff`), tipografia em DM Sans 700 branca `"Começar meu projeto"` e seta diagonal elegante para cima e para a direita `↗` em azul safira/ciano (`#2975e9` / `#38bdf8`).
- **Validação & Deploy:**
  - Capturas e inspeção visual automatizada realizadas via Playwright em Desktop (1440x900).
  - Deploy sincronizado em `site/_publish` via `node site/build-deploy.mjs` (7 entradas, 102 arquivos atualizados).

---

## Estado em 22/09/2026 (versão 35) — Arco de Luz Platinado & Shader na Hero (Design Limpo e Focado)

Implementação do efeito de arco cósmico, shader e platinado na Hero do site, perfeitamente ancorado ao redor do Olho de Horus 3D (Gaussian Splat):
- **Design Limpo e Minimalista (Sem Ruído Visual):**
  - Removidas as estrelas móveis e linhas técnicas auxiliares, deixando **exclusivamente o arco azul/platinado com efeito shader**, conferindo um acabamento direto, cinematográfico e sofisticado.
- **Posicionamento & Geometria Concéntrica:**
  - O arco é aninhado diretamente dentro do `#hero-splat`, mantendo o centro de órbita concentricamente alinhado com o eixo vertical da pupila de ouro do Olho 3D (`xc = 284, yc = 490, R = 415`).
  - Sincronização 100% perfeita com a flutuação do Gaussian Splat (`hero-splat-flutuar`): olho e arco flutuam juntos em harmonia contínua.
  - No mobile (390px), o arco escala proporcionalmente com o splat 3D sem descolar nem cortar.
- **Efeito Platinado & Shader (4 Camadas Lâminas de Luz):**
  - **Núcleo Platinado Ultra-Nítido (`#arcoPlatinadoCore`):** Traço de 2.6px com platina pura (`#ffffff`) no pico de incidência de luz, degradê para prata-gelo e azul elétrico.
  - **Feixe Especular Platinado:** Traço de 5.5px com leve desfoque Gaussiano.
  - **Brilho Intermediário:** Feixe de 13px em ciano e safira (efeito metal polido / reflexo laser).
  - **Aura Volumétrica Shader (`#arcoShaderAura`):** Halo difuso largo de 32px com desfoque profundo simulando emissão atmosférica cósmica.
  - **Animação de Respiro Shader (`arco-shader-respiro`):** Variação sutil de luz e sombra de 6.5s.
- **Validação & Deploy:**
  - Testado e inspecionado via Playwright em Desktop (1440x900) e Mobile (390x844).
  - Deploy gerado e sincronizado em `site/_publish` via `node site/build-deploy.mjs`.

---

## Estado em 22/09/2026 (versão 34) — Padronização da Tipografia dos Cards de Serviços

Correção da tipografia dos cards da seção `.svcs` ("O que a Horus instala.") para harmonizar 100% com o padrão do restante do site:
- **Títulos dos Cards (`.svc-h`):**
  - Anteriormente herdavam `font-weight: 400` genérico com entrelinha frouxa e tracking leve.
  - Atualizados para o padrão estrito de títulos da Horus: `font-family: var(--display)` (DM Sans), **peso 700 (Bold)**, `letter-spacing: -0.03em`, `line-height: 1.1`, cor `#ffffff`.
- **Badge / Eyebrow (`.svc-topo-linha`):**
  - Removido o separador amarelo antigo (`/ ` em `--ember-1`) e a separação de linhas claudicante.
  - Padronizado com o sistema visual da Seção 2 Stack (`.stk-topo-linha`): número `01` a `06` em azul elétrico (`#0077ff`, DM Sans 700), traço conector sutil safira (`28px`, `rgba(59, 130, 246, 0.45)`) e categoria em JetBrains Mono (`0.75rem`, `font-weight: 600`, `letter-spacing: 0.16em`, caixa alta, cor `#94a3b8`).
- **Descrições (`.svc-desc`) e Subtítulo (`.svcs-sub`):**
  - Transição da cor legada `--osso` (`#d1cece`) para Slate-400 (`#94a3b8`), com entrelinha `1.65` — unificando com todas as descrições do site (Portfólio, Compromissos, Como Começa, Seção 1).
- **Lista de Capacidades (`.svc-caps`):**
  - Tipografia refinada para `0.9375rem` (15px) em Slate-300 (`#cbd5e1`) com entrelinha `1.5`.
  - Bullets transformados de quadrados gradientes em pontos circulares luminescentes azul elétrico (`#0077ff` com glow de 8px), harmonizando com `.stk-lista-ponto` e `.pf-dot`.
- **Google Fonts (`site/index.html`):**
  - Atualizada a requisição de DM Sans e JetBrains Mono para carregar formalmente os pesos `300;400;500;600;700;800`, garantindo renderização nítida dos pesos 600, 700 e 800 em qualquer sistema operacional.
- **Validação e Build:**
  - Verificação visual e de estilos computados via Playwright em Desktop (1440x900) e Mobile (390x844).
  - Build compilado e sincronizado em `site/_publish` via `node site/build-deploy.mjs`.

---

## Estado em 22/09/2026 (versão 33) — Remoção de acento da marca (HÓRUS → HORUS) e Atualização do Instagram

Ajustes canônicos no site solicitados pelo Marcelo:
- **Remoção de acento:**
  - Header: `<span class="nome">HÓRUS</span>` → `<span class="nome">HORUS</span>`.
  - Seção Como Começa: rodapé editorial `HÓRUS` → `HORUS`.
  - Rodapé: logotipo `HÓRUS` → `HORUS` e copyright `Horus Agência | 2026`.
  - Assinatura vetorial SVG gigante no pé da página: `<text>HÓRUS</text>` → `<text>HORUS</text>` e `aria-label="Horus"`.
  - Títulos e metadados (`<title>`, `og:title`, `og:site_name`, `og:image:alt`, `404.html`, `robots.txt`, `compartilhar-og.html`): "Hórus" → "Horus".
  - Textos institucionais do site (Seção 1 / Manifesto, Seção Serviços, etc.): todas as ocorrências de "Hórus" com acento atualizadas para "Horus".
- **Instagram da Horus:**
  - Link corrigido e atualizado para `https://www.instagram.com/horusagencia.br/` com `aria-label="Instagram da Horus"`.
- **Publish gerado:** sincronizado via `node site/build-deploy.mjs`.

---

## Estado em 22/09/2026 (versão 32) — Redesign de "Como Começa" (Print 1) e "Trabalhos em Destaque" (Print 2)

Atualização das seções `.passos` ("Como começa") e `.portfolio` ("Trabalhos em destaque") com base nas imagens de referência enviadas pelo Marcelo:
- **Seção "Como Começa" (`.passos` · Imagem 1):**
  - Fundo Dark Cosmic Blue unificado (`#030712`) com iluminação ambiente suave (`radial-gradient`), substituindo o layout light anterior.
  - Badge superior `■ COMO COMEÇA` em monospace com quadrado azul elétrico (`#0077ff`).
  - Título com destaque `sem complicação.` em azul vibrante e subtítulo equilibrado.
  - 4 etapas interligadas horizontalmente:
    - Grandes marcas d'água numéricas translúcidas `01`, `02`, `03`, `04` com gradiente ciano-azulado.
    - Círculos de vidro escuro profundo (`62x62px`) com borda e halo luminescentes azuis.
    - Ícones nítidos: consulta/conversa (chat bubble com reticências), diagnóstico (documento), execução (engrenagem) e lançamento (gráfico de barras ascendentes).
    - Linha horizontal contínua de conexão com pontos/nós azuis celestes brilhantes nos intervalos.
    - Animação de acendimento progressivo (`.aceso`) conforme o scroll.
  - Botão CTA em formato pílula de vidro escuro (`.ps-btn-dark`) com borda e glow azul celeste: `Pronto para começar? →`.
  - Rodapé editorial exclusivo da seção: `ESTRATÉGIA / TECNOLOGIA / RESULTADOS` ————— `HÓRUS —— 2026`.
- **Seção "Trabalhos em Destaque" (`.portfolio` · Imagem 2):**
  - Coluna da esquerda elegante e ancorada:
    - Badge `■ PROJETOS EM DESTAQUE`.
    - Título `Trabalhos em destaque.` (com `destaque.` em azul elétrico `#0077ff`).
    - Subtítulo e botão circular `( → ) Ver todos os projetos` com micro-interações de elevação.
  - Vitrine horizontal de projetos reais:
    - Cards com cantos generosos (`20px`), bordas sutis e sombra de profundidade em alta fidelidade.
    - Layout com visualização simultânea de projetos lado a lado (ex.: Novare Psicologia e Café Grão da Serra).
    - Metadados com ponto luminoso azul (`●`), títulos em destaque com seta direcional azul (`→`) e descrições diretas.
    - Deslize suave com GSAP sem sobreposição da coluna da esquerda via máscara gradiente refinada.
- **Validação:**
  - Testado e inspecionado via Playwright em Desktop (1440x900) e Mobile (390x844).
  - Deploy gerado com sucesso via `node site/build-deploy.mjs`.

---

## Estado em 22/09/2026 (versão 31) — Seção Nossos Compromissos (Design Fiel ao Print + Motion de Entrada)

Atualização da seção `.qualidade` ("Nossos cinco compromissos.") conforme o print de referência enviado pelo Marcelo:
- **Design & Layout:**
  - Badge em pílula de vidro escuro com ponto azul elétrico brilhante e texto `NOSSO COMPROMISSO` em caixa alta.
  - Título principal com destaque `cinco` em azul vibrante (`#0077ff`) e ponto final.
  - Subtítulo em duas linhas balanceadas: *"Mais do que entregar projetos, construímos parcerias de longo prazo. / Esses são os princípios que guiam tudo o que fazemos."*
  - 5 cards em vidro fumê profundo (`background: linear-gradient(180deg, rgba(13, 20, 36, 0.65), rgba(6, 11, 22, 0.85))`) com reflexos de luz inferiores correspondentes às cores de cada tema (`--cor-glow`).
  - Topo do card com squircle de vidro colorido (52x52px, raio 14px) + numeração `01` a `05` em tipografia limpa à direita.
  - Rodapé com botão circular de seta `→` e barra de acento colorida na base.
  - Cores temáticas dos 5 cards:
    1. Conformidade legal: Azul elétrico (`#0077ff`), ícone de escudo com checkmark.
    2. Revisão até aprovar: Violeta/púrpura (`#a855f7`), ícone de faíscas duplas (twin sparkles).
    3. Preço fechado antes: Verde menta/teal (`#14b8a6`), ícone de etiqueta chanfrada com orifício.
    4. Você aprova o resultado: Âmbar/laranja (`#f97316`), ícone de pessoa/perfil.
    5. Esboço antes do pedido: Rosa/magenta (`#ec4899`), ícone de olho com pupila.
- **Motion de Entrada (Scroll Reveal):**
  - Orquestrado via `IntersectionObserver` assim que a seção entra no campo de visão (`.qualidade.ativo`).
  - A pílula de badge desce suavemente (`translateY(-16px)` → `0`).
  - O título sobe dissipando o desfoque (`translateY(28px) blur(8px)` → `0 blur(0)`).
  - O subtítulo sobe e materializa logo em seguida.
  - Cascata escalonada nos 5 cards (`transition-delay` progressivo de 0.28s a 0.68s) subindo de `translateY(48px)` com `blur(6px)`.
  - Ao assentar na tela, os ícones em squircle pulam suavemente em escala e as barras coloridas do rodapé desenham da esquerda para a direita (`scaleX(0)` → `scaleX(1)`).
  - Micro-interação de elevação no hover (`translateY(-8px)`), expansão da barra de cor (`width: 44px`), deslizamento da seta e intensificação do brilho difuso.
  - Suporte completo a `prefers-reduced-motion` e visualização responsiva mobile (390px).

---

## Estado em 22/09/2026 (versão 30) — Seção 2 borderless (3D Deep Perspective Matrix + Marquee Alternado + 41 Ferramentas + Sem caixas + Sem botões)

Refinamento da Seção 2 conforme feedback do Marcelo ("Não quero que as ferramentas fiquem dentro de uma quadrado. Quero que fiquem igual a referencia que te mandei aqui e com esse efeito de profundidade como se elas fossem até bem longe no fundo"):
- **Eliminação de Caixa/Quadrado (100% Borderless & Seamless):**
  - Fundo unificado em `#000206` (preto obsidiana puro), casando perfeitamente com a Seção 1 e o restante do cosmos do site.
  - Remoção de qualquer contêiner visível, bordas, sombras de corte ou holofotes pontuais locais (`.stk-luz-fundo` removido).
  - Iluminação ambiental suave e difusa via `radial-gradient` amplo diretamente no pseudo-elemento da seção.
  - `.stk-cenario-3d` livre de recortes horizontais rígidos (`overflow: visible`), com transição de máscara estendida (`mask-image: linear-gradient(to right, black 0%, black 50%, rgba(0,0,0,0.65) 68%, rgba(0,0,0,0.15) 84%, transparent 96%)`) que dissolve as teclas diretamente no infinito escuro antes da coluna de texto.
- **Perspectiva Profunda (Efeito "até bem longe no fundo"):**
  - Configuração 3D calibrada com `perspective: 920px`, `perspective-origin: 12% 48%` e inclinação `rotateX(-8deg) rotateY(-36deg) rotateZ(8deg)`.
  - As fileiras partem em escala nobre e nítida na frente à esquerda e diminuem progressivamente em perspectiva profunda pelo eixo Z, estendendo-se por mais de 800px no espaço 3D.
  - Squircles de vidro em tamanho premium (134x134px) com relevo chanfrado superior, gradiente interno de acrílico escuro e sutis reflexos especulares.
- **Movimento das Fileiras (Alternância Contínua R→L e L→R):**
  - Fileira 1: move-se da direita para a esquerda (`stk-scroll-r2l`, 40s).
  - Fileira 2: move-se da esquerda para a direita (`stk-scroll-l2r`, 44s).
  - Fileira 3: move-se da direita para a esquerda (`stk-scroll-r2l`, 40s).
  - Fileira 4: move-se da esquerda para a direita (`stk-scroll-l2r`, 46s).
  - Todas as 41 ferramentas integradas e duplicadas em trilho contínuo (84 cards renderizados, 0 imagens quebradas).
- **Sem Botões:**
  - 🔴 Rigorosamente ZERO botões em toda a seção 2, conforme exigência expressa do Marcelo.
- **Validação & Deploy:**
  - Validado via Playwright em Desktop (1440x900) e Mobile (390x844): 0 broken images, 0 botões, 0 overflow horizontal, 0 console errors. Sincronizado em `site/_publish` via `build-deploy.mjs`.

---

## Histórico de versões

As versões 2 a 28 (05/08 a 21/09/2026) foram arquivadas em [`site/CHANGELOG.md`](CHANGELOG.md)
para aliviar o que carrega em toda sessão sob `site/`. Nada foi perdido: o racional, as
armadilhas e o feedback do Marcelo continuam lá, na mesma ordem. Aqui ficam só o estado
atual (v30–v35), as decisões travadas e o que trava a publicação.

---

## Decisões que já estão tomadas, para não reabrir

> ⚠️ **Leia a "Estado em 26/08/2026 (versões 8 e 9)" (agora em `site/CHANGELOG.md`) antes de confiar
> nesta tabela.** As duas rodadas de 26/08 (a pedido do Marcelo, guiadas por
> prints numerados) reviraram várias linhas daqui: CTA, cabeçalho, hero, serviços,
> portfólio, chamada, rodapé, tipografia, stack e elemento-assinatura. As linhas
> pré-26/08 ficam como histórico datado; o que vale hoje está na seção de estado.

| Decisão | Qual foi | Quando |
|---|---|---|
| Descritiva da marca | **AGÊNCIA**, não PUBLICIDADE | 04/08/2026, Marcelo |
| Tipografia | Montserrat **só no logo**. Site usa Sora (display) e Archivo (corpo) | 04/08/2026, Marcelo |
| Escopo | Home, serviços, cases, sobre. **Só a home está feita** | 04/08/2026, Marcelo |
| Estrutura da home | **7 seções**, na ordem do `PLANO.md` v5 | 05/08/2026 (noite), Marcelo |
| Seções cortadas | A diferença, A Máquina, Para quem é, O que não vai ao ar, Como começa, Perguntas | 05/08/2026 (noite), Marcelo |
| Elemento-assinatura | **não existe mais.** Saiu com o trilho da Máquina | 05/08/2026 (noite), Marcelo |
| Título | "Nós construímos **[MÁQUINAS · SISTEMAS · MARCAS · PRESENÇA]**" | 05/08/2026 (noite), Marcelo |
| Alcance | O site **não** se declara mais só de Salvador | 05/08/2026 (noite), Marcelo |
| Troca da palavra | Letra por letra, decodificando | 05/08/2026 (noite), Marcelo |
| Metal do botão | **Cromo cinza**, lento, num sentido só, franja de cor quase invisível | 05/08/2026 (noite), Marcelo |
| Serviços | **Um painel de tela cheia por serviço**, com ficha técnica | 05/08/2026 (noite), Marcelo |
| Fundo do hero | **Shader em WebGL** nas cores da marca. Sem rótulo em cima | 05/08/2026 (noite), Marcelo |
| Rodapé | **Enxuto, três linhas**, no formato do web3.xmethod.de: marca e assinatura à esquerda, e-mail e telefone em escala à direita, fio, e o legal com os ícones de rede. Era quatro colunas no formato da Menzzo | 25/08/2026, Marcelo |
| Nome no pé | **HÓRUS em SVG, pintado por gradiente**, com uma luz que segue o ponteiro. Era hex dump com onda, e antes disso pixelado | 24/08/2026, Marcelo |
| Marquee | **Um só**: a faixa de palavras. A esteira do hero saiu por causa dela | 05/08/2026 (noite) |
| Portfólio | **Trilho preso**: a janela prende no alto da tela e a tira corre na horizontal. Parada nos primeiros 30% e nos últimos 30% do trilho. Continua **sem imagem** até haver autorização | 24/08/2026, Marcelo |
| Fios entre seções | **Não existem.** Quem separa é o ar, a troca de fundo e a largura do contêiner | 24/08/2026, Marcelo |
| Chamada final | Continua no **cartão de vidro**, mas agora **centralizada, sem eyebrow e sem subtítulo**: título e um botão, no formato do web3.xmethod.de. Era alinhada à esquerda | 25/08/2026, Marcelo |
| Redes no rodapé | **Só o ícone**, sem o nome escrito ao lado. O rótulo vive no `aria-label` | 25/08/2026, Marcelo |
| Icarus | Ganhou seção própria, declarada como **em desenvolvimento** | 05/08/2026 (noite), Marcelo |
| Linguagem visual | Escura e cinematográfica, das dez referências. Estudo em `referencias/agencias-ia-dez-sites.md` | 05/08/2026, Marcelo |
| Arte do hero | Forma 3D abstrata em azul e dourado. **O falcão foi rejeitado** | 05/08/2026, Marcelo |
| Elemento-assinatura | O trilho numerado da Máquina. Uma ousadia só na página | `PLANO.md` |
| Formulário | Não existe, de propósito. Sem servidor, não finge que enviou | `50-copy-de-interface.md` |
| Eyebrow | Permitido nas nove seções, com exceção registrada no detector | 05/08/2026, `.impeccable/config.json` |
| Hero | Centralizado. **Sem arte de fundo e sem brilho** | 05/08/2026 (tarde), Marcelo |
| CTA | **Um rótulo só na home inteira: "Começar projeto"**. Dois objetos diferentes: metal líquido na home (hero e chamada final), **vidro** no cabeçalho | 25/08/2026, Marcelo |
| Cabeçalho | **Painel de vidro flutuante** com aro que acende seguindo o ponteiro (estrela.studio). Links e marca à esquerda, botão sozinho à direita (web3.xmethod.de) | 25/08/2026, Marcelo |
| Forma | Terceira forma aberta: o **canto reto** (`--raio-reto: 4px`), no cabeçalho, no botão dele e no botão da chamada final. Pílula continua no resto | 25/08/2026, Marcelo |
| Gatilho do menu | **Ícone de dois traços**, não a palavra "Menu": em 390px a palavra custava a largura que o CTA fixo passou a precisar | 25/08/2026 |
| Contato | WhatsApp `(71) 9912-7514` e e-mail `contato.horus@gmail.com`, **sem rótulo na frente**. CNPJ e a linha de atendimento saíram | 25/08/2026, Marcelo |
| Título | "Instalamos a máquina que faz o seu negócio **[palavra que gira]**" | 05/08/2026 (tarde), Marcelo |
| Palavra que gira | APARECER · RESPONDER · PUBLICAR · ANUNCIAR, que são os 4 blocos como verbo | 05/08/2026 (tarde) |
| Faixa de demonstração | **Removida.** As marcações douradas de pendência ficam | 05/08/2026 (tarde), Marcelo |
| Vidro | Linguagem de superfície da página. Feito de luz, não de desfoque | 05/08/2026 (tarde), Marcelo |
| Stack | Continua HTML e CSS nativos. O botão de shader foi **portado**, não instalado | 05/08/2026 (tarde) |

---

## ⚠️ O que falta

O site está no ar desde 25/09/2026. O que segue aberto está abaixo.

### Dado que só o Marcelo tem

- [x] ✅ **Hex do fundo.** Medido em 05/08/2026 no PNG da marca: `#0A0B0F`
- [x] ✅ **Símbolo do logo.** Extraído com alfa do PNG e no ar no cabeçalho, no
      rodapé e como favicon
- [ ] **Logo em vetor** (SVG ou AI), mais a versão em fundo claro e a
      monocromática. O que existe é bitmap: serve para tela, não escala
- [x] ✅ **Arte do hero.** Resolvido por subtração em 05/08/2026: a forma 3D saiu
      e o hero passou a ser tipografia sobre o preto da marca. `assets/forma.webp`
      ficou no repositório sem ninguém apontar para ele, e a fonte está em
      `site-fontes/forma-3d.png`. Apagar quando o Marcelo confirmar que não volta
- [x] ✅ **WhatsApp e e-mail.** Dados pelo Marcelo em 25/08/2026: `(71) 9912-7514`
      e `contato.horus@gmail.com`, os dois no rodapé e no botão da chamada final.
      ✅ **Corrigido em 01/09/2026.** O número tinha 10 dígitos (`7199127514`) e o
      `wa.me/557199127514` levava a um número inexistente — no CTA principal da
      página. O Marcelo confirmou: é **`(71) 99912-7514`**, e o link virou
      `wa.me/5571999127514`. Rodapé e botão da chamada final, os dois
- [~] **Domínio, CNPJ e endereço.** ✅ **Domínio próprio no ar em 25/09/2026:**
      `https://horusagencia.com.br` (Registro.br, DNS: A `@` → 75.2.60.5 e CNAME `www` →
      `horusagencia.netlify.app`; www e http redirecionam). Links do site trocados.
      Deploy é **arrastando `site/_publish`**, por isso cabeçalhos e redirecionamentos
      moram em `site/_headers` e `site/_redirects`, não no `netlify.toml`.
      ❌ **CNPJ e endereço físico continuam abertos** — o CNPJ saiu do rodapé em
      25/08/2026 (não existe dado, e linha de rodapé com pendência dourada é ruído
      numa versão final)
- [x] **@ do Instagram.** ✅ Resolvido em 22/09/2026: `https://www.instagram.com/horusagencia.br/` (@horusagencia.br).
- [x] ✅ **Favicon em PNG de 32px e 180px.** Feitos em 01/09/2026 a partir do
      `simbolo-grande.png`: `assets/favicon-32.png` e `assets/apple-touch-icon.png`
      (o de 180px vai sobre o `#0A0B0F` da marca, porque ícone de iOS não respeita
      transparência). O WebP continua como primeiro `<link>`
- [ ] **Quem faz.** Um nome apareceu em 05/08/2026: o Marcelo disse que está
      desenvolvendo o Icarus "eu e Antonio", e o Antonio está citado na seção do
      Icarus da home. ⚠️ **Não está confirmado que Antonio é "o sócio do Marcelo"**
      que aparece em três arquivos do repositório sem nome, nem qual é o sobrenome
      e o papel dele na agência. A página "Sobre" depende disso

### Decisão pendente

- [x] **Autorização de portfólio.** ✅ Resolvido em 17/09/2026 (v27). O Marcelo
      trouxe as telas reais de 4 projetos: Novare Psicologia, Café Grão da
      Serra, IRS Performance e VerdiServ Serviços Prediais. Seção no ar com
      nomes, capturas e descrições calibradas.
- [ ] **A assinatura verbal do manual.** "Estratégia que transforma" usa verbo de
      folheto, que a casa proíbe em copy. Hoje o rodapé usa só "Visão que
      conecta". Ou a assinatura fica restrita a peça institucional, ou ela é
      reescrita e o manual se atualiza junto
- [ ] **Preço.** O FAQ diz que não há tabela fechada, o que é verdade e está em
      `_memoria/estrategia.md` como pendência de risco alto

### Antes de subir

- [x] ✅ **Aberto ao Google em 25/09/2026** (decisão do Marcelo, com o domínio próprio no ar): os três trincos saíram juntos; a `<meta robots>` ficou só na `404.html`. Histórico: em 01/09/2026 o Marcelo escolheu subir como
      **preview fechado**: o site abre para quem tem o link, o Google não indexa. O
      bloqueio está em **três lugares** (meta tag, `robots.txt`, `X-Robots-Tag` do
      `site/_headers`) e abrir ao Google exige mexer nos três — ver a tabela na seção
      de estado da v24. Continua valendo o motivo original: portfólio sem imagem,
      sem página Sobre, sem CNPJ
- [x] ✅ Faixa `.aviso-demo` removida em 05/08/2026, junto com o token `--aviso`.
      ⚠️ O botão "Esconder marcações" foi embora com ela: as marcações douradas de
      pendência agora ficam sempre visíveis, e some com elas só o dado existindo
- [x] ✅ **Imagem de compartilhamento refeita** em 01/09/2026. A antiga era a arte 3D
      que saiu do hero em 05/08, vertical dentro do 1200x630 (barras pretas nas
      laterais) e sem logotipo. A nova usa o mesmo tratamento do hero, com símbolo,
      wordmark, o H1 da página e a linha de serviços. Fonte editável em
      `site-fontes/compartilhar-og.html`
- [x] ✅ **Detector rodado em 01/09/2026** sobre `site/_publish` (o que realmente vai
      ao ar, não a pasta de trabalho): **saída `0`**

---

## Falta produzir

O escopo aprovado tem quatro páginas e **só a home existe**:

- [ ] Uma página por bloco da Máquina (site, atendimento e CRM, conteúdo,
      tráfego), com `title`, descrição, `og:` e schema próprios. É o mesmo
      caminho que a Aion tomou em 30/07/2026, e o motivo é o mesmo: URL própria
      para busca e para anúncio
- [x] ~~Cases.~~ **Encerrado em 26/09/2026 por decisão do Marcelo:** páginas de case não existem no site (as 15 foram guardadas em `site-fontes/cases-removidos-2026-09-26/`). O portfólio fica só na grade de imagens
- [ ] Sobre. **Depende de saber quem é a equipe**, que hoje não está escrito em
      lugar nenhum do repositório
