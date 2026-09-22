# Site institucional da Hórus

Site da **própria agência**, não de cliente. Por isso mora em `site/` na raiz e
não em `clientes/`.

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

## ⚠️ O que trava a publicação

Nada disso impede construir. Tudo isso impede subir.

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
- [~] **Domínio, CNPJ e endereço.** ✅ **Endereço resolvido em 01/09/2026:**
      `agenciahorus.netlify.app` (subdomínio Netlify; domínio próprio fica para depois).
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

- [~] **O `noindex` FICA, por decisão.** Em 01/09/2026 o Marcelo escolheu subir como
      **preview fechado**: o site abre para quem tem o link, o Google não indexa. O
      bloqueio está em **três lugares** (meta tag, `robots.txt`, `X-Robots-Tag` do
      `netlify.toml`) e abrir ao Google exige mexer nos três — ver a tabela na seção
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
- [ ] Cases. **Depende da autorização acima**, não de produção
- [ ] Sobre. **Depende de saber quem é a equipe**, que hoje não está escrito em
      lugar nenhum do repositório
