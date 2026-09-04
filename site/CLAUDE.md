# Site institucional da Hórus

Site da **própria agência**, não de cliente. Por isso mora em `site/` na raiz e
não em `clientes/`.

---

## Estado em 01/09/2026 (versão 24) — PREPARAÇÃO DE DEPLOY (Netlify)

Rodada de infraestrutura, não de design: o site foi preparado para subir em
**`agenciahorus.netlify.app`** como **preview fechado**. Nada de layout mudou.

**Decisões do Marcelo nesta rodada:**
- **Endereço:** `agenciahorus.netlify.app` (subdomínio Netlify, sem domínio próprio
  por ora). Está escrito no `canonical`, no `og:url`, no `og:image` e no `sitemap.xml`.
- **Preview fechado, não publicação aberta.** O `noindex` FICA. O motivo é o mesmo
  que já estava escrito aqui: portfólio sem imagem por falta de autorização, sem
  página Sobre, sem CNPJ. O site abre para quem tem o link; o Google não indexa.
- **WhatsApp corrigido:** era `(71) 9912-7514`, 10 dígitos, e o `wa.me` levava a um
  número que não existe — no CTA principal da página. Agora é **`(71) 99912-7514`**
  e `wa.me/5571999127514`. ⚠️ Confirmado pelo Marcelo nesta data.

**O que mudou no arquivo:**
- 🔴 **O vídeo do hero saiu do CloudFront do Higgsfield e virou asset próprio.** Era
  o risco mais sério do deploy: URL de CDN de terceiro expira sem aviso, e quando
  expirasse o hero abriria preto — acima da dobra, sem ninguém perceber. Agora é
  `assets/video/hero-1440.{webm,mp4}` + `hero-poster.jpg`.
  **De 27 MB para 411 KB (MP4) e 214 KB (WebM)**, recomprimindo a 1440px/CRF 30.
  Não custou qualidade porque o CSS já joga fora cor e detalhe fino (`grayscale(.94)`
  + `blur(1.4px)`); comparado quadro a quadro com o tratamento aplicado, é
  indistinguível. Original guardado em `site-fontes/hero-original-27mb.mp4`.
- **Imagem de compartilhamento refeita.** A antiga era a arte 3D que saiu do hero em
  05/08, vertical dentro de um 1200x630 (barras pretas nas laterais) e sem logotipo —
  já estava marcada aqui como pendência. A nova usa o **mesmo tratamento do hero**
  (poster + tint azul→amarelo), com símbolo, wordmark, o H1 da página e a linha de
  serviços. Fonte editável em `site-fontes/compartilhar-og.html` (renderiza em Chrome
  headless, 1200x630).
- **Favicons completos:** `favicon-32.png` e `apple-touch-icon.png` (180px, sobre o
  `#0A0B0F` da marca, porque ícone de iOS não respeita transparência). O WebP continua
  como primeiro `<link>`, para navegador moderno.
- **`404.html`** on-brand: puxa o `site.css` só pelos tokens `:root`, então nunca sai
  da identidade quando a paleta mudar. Layout próprio e curto — página de erro não
  carrega GSAP, Lenis nem shader para dizer que a URL não existe.
- **`robots.txt` e `sitemap.xml`** na raiz do publish.

**Arquivos de infraestrutura (novos, na raiz do repositório):**
- **`netlify.toml`** — build, cabeçalhos e redirects.
- **`site/build-deploy.mjs`** — monta `site/_publish/`, que é o que vai ao ar.

### ⚠️ Por que existe um passo de build num site de HTML puro

Este repositório é a operação inteira da agência, e a pasta `site/` guarda o público
e o interno lado a lado: `CLAUDE.md` (este arquivo, 62 KB de decisões, pendências e
nomes de cliente), `PLANO.md`, e 34 MB de arte-fonte em `site-fontes/`.

Apontar o `publish` da Netlify direto para `site/` colocaria tudo isso em endereço
público e adivinhável — `agenciahorus.netlify.app/CLAUDE.md` serviria este arquivo.
Por isso o publish é **gerado**, e a lógica é **allowlist**: só sobe o que está escrito
na constante `RAIZ_PUBLICA` do `build-deploy.mjs`. Arquivo novo em `site/` **não vai ao
ar até alguém adicioná-lo à mão** — o padrão é negar, para que ninguém publique um
rascunho por esquecimento.

O script também deixa de fora os 8 assets órfãos (`forma.webp`, `assinatura.webp`,
`servicos/sv-1..6.webp`), que continuam versionados mas que nenhuma linha aponta.

**Resultado: 1,9 MB no ar**, 62 arquivos.

### Os três trincos do preview fechado

O bloqueio de indexação está em **três lugares**, e abrir ao Google exige mexer nos
três — apagar um só não resolve, e é exatamente esse o erro fácil de cometer:

| Onde | O quê |
|---|---|
| `index.html` | `<meta name="robots" content="noindex, nofollow">` |
| `site/robots.txt` | `Disallow: /` (trocar pelo `Allow: /` comentado logo abaixo) |
| `netlify.toml` | cabeçalho `X-Robots-Tag = "noindex, nofollow"` |

O terceiro existe porque a meta tag não alcança imagem, vídeo nem PDF: o cabeçalho
HTTP cobre o que o buscador encontra sem passar pelo HTML. No mesmo dia, descomentar
a linha `Sitemap:` do `robots.txt`.

### Como subir

```
node site/build-deploy.mjs      # monta site/_publish e diz o que ficou de fora
```

Na Netlify, o `netlify.toml` já faz isso sozinho a cada push. Pelo painel, o campo de
publish é `site/_publish` e o comando é `node site/build-deploy.mjs`.

⚠️ **O repositório precisa estar privado.** O build da Netlify clona o repo inteiro —
sete clientes com briefing, compliance e dossiê. O publish sai limpo, mas o clone não.

**Conferido nesta rodada** (Chrome headless via puppeteer-core, desktop 1440 e mobile
390 com emulação de device): detector do impeccable **saída `0`**, **nenhum erro de
console**, **nenhuma requisição falha**, **nenhuma rolagem horizontal** nos dois
tamanhos, e o vídeo local carregando (`hero-1440.webm`, `readyState 4`). A 404 e a
imagem de compartilhamento foram vistas renderizadas.

⚠️ **Nota de método:** o primeiro screenshot mobile saiu com o conteúdo cortado e
parecia estouro de layout. Não era: `chrome --headless --window-size=390,844` **não
emula dispositivo**, ele só estreita a janela. Medir `scrollWidth` contra `innerWidth`
com `isMobile: true` mostrou 390 = 390 nos dois. Print de headless sem emulação não
serve de prova de layout mobile.

---

## Estado em 01/09/2026 (versão 23) — mocks dos serviços com DEVICES REAIS (mockups) + fidelidade aos prints

Rodada guiada por 9 prints numerados do Marcelo (4 mockups de device salvos em
`site/site-fontes/` + o tênis). ⚠️ **Verificado em navegador de verdade** (Chrome
headless via puppeteer-core, screenshot de cada card) — raro nesta casa, porque este
clone normalmente não tem browser. O Edge/Chrome estavam instalados.

**Mapa print→card (confirmado com o Marcelo, 3 perguntas):**
- **Card 1 (Sites):** o mock de dispositivos CSS ganhou vida — o site **desce, pausa,
  sobe** (`@keyframes dv-updown`, não mais rolagem infinita) e um **cursor aparece,
  caminha até um ponto e clica** (`.dv-cursor` + `.dv-clickring`, anel que pulsa no
  toque), em sincronia. Tudo pausa em `prefers-reduced-motion`.
- **Card 3 (Sistemas) = print 7:** laptop **inclinado** (mockup real) com um painel de
  gestão na tela + celular **inclinado e espelhado** (o Marcelo pediu inverter) com
  "Visão geral". A UI é sobreposta na tela via **matrix3d medido do próprio PNG**
  (homografia), então as informações ficam na MESMA angulação do device.
- **Card 4 (Loja) = print 3:** laptop reto + celular reto + o **tênis** (print 4), com
  card "Vendas R$ 59.786" flutuando, chip do carrinho e "Pedido confirmado" no celular.
- **Card 5 (Marketing) = print 1:** painel de campanhas ROXO (Investimento, Leads
  184 ↑62%, Custo/lead R$ 6,79 ↓28% com sparklines, "Desempenho das campanhas" com
  eixos e pill +62%). Era o `mock-trafego` azul; virou `mock-camp` violeta. ⚠️ O Marcelo
  escreveu "Card 2" mas confirmou que era o card de Marketing (o 05); o card 02 (Agente)
  ficou intacto.
- **Card 6 (Visibilidade) = print 2:** mapa mantido; a fileira de baixo trocou
  (saíram "Visualizações" — que duplicava a coluna — e "Como chegar"; entraram
  **Cliques no site · Ligações · Rotas traçadas · Mensagens**, cada uma com ícone), e o
  **pino ganhou glow pulsante** (`.lc-pinglow`, "ícone brilhando igual ao print").

**Como os devices funcionam (técnico, para não reinventar):** os 4 mockups são PNG
**RGBA com fundo transparente + glow** (não é preto chapado — o preview engana). Viraram
WebP (4,5MB→140KB) em `assets/servicos/dev-*.webp` + `produto-tenis.webp` (66KB). A tela
de cada um foi **detectada por flood-fill** (o bezel preto separa tela de teclado) para
achar os 4 cantos em px nativo. Frontais: overlay por `%`. Inclinados: `.dev-lyr` em px
nativo escalado por `scale(calc(100cqw / <W>px))` + `.dev-screen` com `matrix3d(...)`
(homografia rect→quad). As UIs sobrepostas são CSS/HTML vivo (contadores animam), não
imagem — por isso o mock respira.

⚠️ **Dead CSS:** `.sy-*`, `.lj-*` e o miolo de `.tf-*` (mock-sistema/loja/trafego antigos)
ficaram sem uso (o HTML mudou). Inofensivo; limpar quando for mexer aqui. `.tf-up/.tf-down`
continuam em uso.

**2ª rodada (mesma sessão, ajustes do Marcelo):**
- **Ilustrações de TODOS os cards aumentadas:** `.mock` max-width 452→560, grid do
  `.svc-in` reponderado para dar a coluna visual maior (`0.9fr / 1.1fr`, gap 64→48).
- **Loja (o Marcelo chamou de "card 5", é o 04) refeita como a referência aberta:**
  saiu a "caixa" com corte e o holofote central. Agora é palco **aberto** — `.mock--shop`
  vira `overflow: visible`, sem box-shadow/borda, com `::before` de degradê contínuo
  escuro→ouro que **se dissolve nas bordas** (não é caixa de luz) + luz difusa. Camadas
  novas: **poeira de ouro** (`.shop-dust`, multi radial-gradient que respira) e **linhas
  pontilhadas** (`.shop-outline--a/-b`). Elementos **inteiros** (tirei os offsets
  negativos que cortavam celular/laptop) e hierarquia: celular + Vendas na frente
  (z-index alto), laptop atrás. **A tela do laptop virou tema ESCURO** (o Marcelo apontou
  que o branco destoava): `.ui-shop` e `.us-*` repintados (fundo escuro, texto claro,
  amarelo só nos acentos).
- **Mapa do Card 6 refeito fiel ao print:** saiu o grid CSS; entrou uma **malha de ruas
  em SVG** (gerada determinística, `.lc-min`/`.lc-maj`), **rota azul** com glow e ponto
  de partida (`.lc-routeline`/`.lc-routestart`), e o **alvo** brilhante com anel elíptico
  (`.lc-target`) sob o pino. O **pino** ficou maior, com furo (anel) e glow reforçado.
  Some o antipadrão `codex-grid-background` (não uso mais grid CSS no mapa).

Tudo **conferido em navegador** (Chrome headless) card a card. Detector `0`.

---

## Estado em 01/09/2026 (versão 22) — mocks fiéis aos prints, card de conteúdo removido, botão glow, aurora

Segunda rodada dos serviços, com 6 prints de referência do Marcelo (chat, "Custom
Software", "Sell Online", tráfego, "Desempenho Local", mockup de site).

- **Serviços agora com 6 cards** (Conteúdo e blogs REMOVIDO a pedido — "tire o card 6"):
  01 Sites · 02 Agente (Bot+CRM) · 03 Sistemas sob medida · 04 Loja · 05 Marketing ·
  06 Visibilidade local. ⚠️ Conteúdo/carrossel/blog saiu da seção — é bloco real da
  Máquina, então confirmar se volta noutro lugar.
- **Mocks refeitos fiéis aos prints:**
  - **01 Sites** = print 6 (navegador + celular violeta com detalhe amarelo), com o
    conteúdo ROLANDO em loop (`dv-scroll`, o site "se movimentando").
  - **02 Agente** = chat de verdade com avatares (pessoa/bot) e 3 falas + confirmação
    (print 1); o CRM continua ao lado.
  - **03 Sistemas** = print 2 (painel de dados verde: KPI de clientes, barras,
    progressos, "Operações/mês 39.944 automatizado", tags). Texto trocado: saiu
    "quando o site não basta", entrou "Criamos o sistema que o seu negócio precisa".
  - **04 Loja** = print 3 (carrinho + pagamento âmbar, linha de vendas subindo,
    "Total de vendas").
  - **05 Marketing** = fiel ao print 4 (Investimento R$ 1.250,00, Leads 184 ↑62%,
    Custo/lead R$ 6,79 ↓28%, gráfico azul + pill).
  - **06 Visibilidade** = print 5 ("Desempenho Local": mapa, visualizações, ações no
    Google, avaliação 4,9, e a fileira Visualizações/Cliques/Ligações/Como chegar).
  - Cores por card seguem os prints (verde no de sistemas, âmbar na loja, azul no
    tráfego) — são telas de exemplo dentro do mock, a página segue void+amarelo.
- **Botão da última seção (chamada) = "glow" AZUL da Hórus** com sparkles. O código que
  o Marcelo mandou é React/shadcn/Tailwind; foi **portado para vanilla** (regra da casa:
  porta o efeito, não instala o framework — nada de React/Tailwind/lucide instalado, o
  ícone é SVG inline). Mais horizontal (padding). O `.cta-ember` continua no botão de
  "Como começa".
- **Título da chamada:** "Pronto para criar / algo incrível?" (quebra explícita).
- **Penúltima seção (Como começa):** aurora azul/violeta/amarelo em movimento ao fundo
  (`.ps-aurora`), degradê visível que desliza e respira.
- **Rodapé:** hover do "HÓRUS" agora AZUL da marca (`.marca:hover .nome`), não amarelo.
- Detector `0`. Estrutura validada (6 cards, 18 contadores, tags balanceadas).

⚠️ **Não verificado em navegador** (sem Playwright/Puppeteer). Conferir os 6 mocks, o
loop do site, o chat, o botão glow e a aurora.

---

## Estado em 31/08/2026 (versão 21) — serviços com mocks ricos + motion, card de Agente, Software reposicionado

Pedido do Marcelo, com 6 imagens de referência (dashboards, chat+CRM, gráfico de
tráfego, painel, post, mapa) mostrando o TIPO de mock que ele quer em cada card.

- **Card "Software" → "Sistemas sob medida"** (dúvida dele resolvida): o card estava
  vago e cheio de jargão de dev (SaaS, API, DevOps). Reposicionado para linguagem de
  negócio — agendamento, painel de gestão, área de cliente, automações/integrações;
  **CRM sob medida é UM dos exemplos**, não o card inteiro.
- **Card NOVO "Agente e atendimento 24/7" (Bot + CRM)** — é o bloco 2 da Máquina:
  atendimento automático com IA + CRM. Mock = chat que chega + pipeline (Novos leads,
  Em atendimento, Agendados, Clientes). ⚠️ Integridade: descreve a oferta real, **não
  cita o Icarus** (que não tem nada construído) e não promete resultado.
- **7 cards agora** (era 6), renumerados 01–07: Sites · Agente · Sistemas sob medida ·
  Loja virtual · Marketing · Conteúdo · Visibilidade. "Comércio eletrônico" virou
  "Loja virtual" e perdeu o jargão ERP/PIM.
- **Cada card com mock rico + MOTION de entrada** (IntersectionObserver marca
  `.svc-ativo`): números que contam (CRM, leads, custo, alcance, visualizações), gráfico
  de tráfego que desenha (stroke-dashoffset), chat que chega em sequência, barras que
  sobem, pin que cai, estrelas que acendem. Contadores em JS (formato PT-BR), o resto é
  CSS sob `.svc-ativo`. Estados iniciais sob `.js` (sem JS, tudo aparece estático).
  Re-dispara ao reentrar. Tudo pausa em `prefers-reduced-motion`.
- **Card de site (01):** a imagem no Higgsfield **falhou por falta de crédito** (plano
  starter, `not_enough_credits`). Ficou um **mock de dispositivos (laptop + celular) em
  CSS** como provisório. 🔴 **Pendência:** gerar o render no Higgsfield quando o crédito
  repor e trocar o mock pela imagem.
- Detector `0` (o grid do mapa do card 07 levou `impeccable-disable-line` inline —
  superfície de mapa é o único uso que a própria regra permite).

⚠️ **Não verificado em navegador** (sem Playwright/Puppeteer neste clone). Conferir os 7
cards, o motion de entrada de cada um e o empilhamento sticky. HTML validado por
contagem (7 `<article>`, 13 contadores, divs balanceadas).

---

## Estado em 31/08/2026 (versão 20) — títulos padronizados, Compromisso, portfólio e botões

Ajustes sobre a v19, a pedido do Marcelo (5 frentes).

- **Tipografia dos títulos padronizada pelo H1 da home:** todos os títulos de seção
  (`.s1-titulo`, `.svcs-titulo`, `.qp-titulo`, `.pf-h2`, `.ps-titulo`, `.ch-titulo`)
  passaram a seguir o tratamento do `.hero h1` — DM Sans **peso 700**, `letter-spacing
  -0.03em`, `line-height 1.02`, cor branca, e **ênfase em AMARELO** (`--dourado`), como
  o "ambiciosos." do H1. Antes a maioria era peso 300 e as ênfases variavam (umas azuis).
  O **tamanho** continua variando por contexto (não faz sentido tudo em t-80); o que se
  unificou foi peso, tracking, entrelinha e o esquema de cor. `.qp-titulo` subiu t-40→t-54.
- **Nosso Compromisso:**
  - Título → **"Nossos cinco compromissos"** (ênfase amarela em "cinco"); subtítulo novo
    **"Só ficamos satisfeitos quando você está."** (`.qp-sub`).
  - **Ícones sem caixa:** o `.qp-ico` perdeu o quadrado com gradiente animado e a sombra;
    ficou o **vetor limpo**, maior (34px), na **cor de destaque do card**.
  - **Cada card tem sua cor** (`--cor` por `:nth-child`, arco amarelo→azul→violeta da
    marca); o ícone acompanha via `currentColor`.
- **Trabalhos em destaque — motion reativado:** o pin GSAP do portfólio (desligado em
  28/08) **voltou** — a seção prende e a fileira desliza da **direita para a esquerda**
  com o scroll (`scrub`), sem a cortina antiga. Só desktop (≥861px) e com movimento
  permitido; no celular/reduzido segue a pista arrastável. O fallback sem-GSAP cede ao
  pin no desktop para não brigarem pela `.pf-tira`.
- **Botões (Como começa + CTA final):** o `.cta-ember` ficou **limpo/minimalista** — saiu
  o halo multicolor animado (`.cta-glow`, que corria amarelo→azul→violeta e destoava da
  paleta). Ficou a chapa amarela sólida com texto escuro e um hover discreto. Isso atende
  tanto a simplificação do botão de "Como começa" quanto a harmonização de cor do CTA final.

⚠️ **Não verificado em navegador** (sem Playwright/Puppeteer neste clone). O item mais
sensível é o **pin do portfólio** (pin + Lenis): conferir no navegador se trava e desliza
sem salto, e se a seção seguinte entra limpa. Detector do impeccable `0`.

---

## Estado em 31/08/2026 (versão 19) — scroll de Serviços refeito, Stack e Seção 1 ajustados

Ajustes sobre a v18, a pedido do Marcelo (print 1 do card do stack cortando no hover).

- **Scroll de Serviços refeito (reverte a v18):** o cabeçalho (`NOSSOS SERVIÇOS / O
  que a Hórus instala`) VOLTOU a ser um bloco em FLUXO NORMAL (`.svcs-intro`, antes
  da pilha) — não é sticky, rola para cima e sai do viewport. O empilhamento (gaveta)
  é só dos cards: `.svc` agora é `position: sticky; top: 100px` (respeitando a navbar
  fixa de ~80px) com `min-height: calc(100dvh - 100px)`; o Card 1 deixou de carregar
  o cabeçalho (saíram `.svc--primeiro`, `.svc-col`, `.svc-topo`) e virou um painel
  normal. **A linha divisória acima do título (`.svcs-linha`) foi removida.**
- **Nosso Stack — quatro correções:**
  1. **Card não corta mais no hover:** `.stack-mask` ganhou `padding-block: 20px`
     (folga para o tile subir + a sombra caber; a máscara é horizontal, não mexe no
     eixo vertical).
  2. **Olho de fundo (`.stack-logo`) sem corte no topo:** centralizado (`top: 50%`) e
     reduzido para `min(600px, 64%)`, cabendo na altura da seção.
  3. **Seção mais alta / mais espaço embaixo:** padding de `88px 0 96px` → `104px 0 148px`.
  4. **Fundo pontilhado de volta:** `.stack::after` com a mesma malha de pontos da
     seção Serviços, dissolvida nas bordas.
- **Seção 1 (bento):** cards um pouco menores (padding `30/32`→`24/26`, gap e
  min-height das artes reduzidos; cubo/órbita/gráfico levemente menores). **Linha
  sob o título (`.s1-linha`) agora nos TRÊS cards** (antes só no primeiro).

⚠️ **Não verificado em navegador:** este clone não tem Playwright/Puppeteer, então a
conferência visual (scroll da gaveta, olho, hover) não rodou. Detector do impeccable
`0` (limpo). Conferir no navegador antes de considerar fechado.

---

## Estado em 31/08/2026 (versão 18) — título de Serviços dentro do Card 1, logo no header e no stack

Ajustes sobre a v17.

- **O cabeçalho da seção Serviços foi para DENTRO do Card 1** (Marcelo, print 2): a
  `.svcs-intro` separada saiu; agora o Card 1 (`.svc--primeiro`) tem um `.svc-col`
  que empilha um `.svc-topo` (linha divisória + eyebrow + título + **subtítulo**,
  centralizados) e a ficha `.svc-in` do serviço. Assim o título aparece integrado
  ao card ("onde ele apontou") e some junto quando o Card 2 sobe (gaveta). Some o
  vão vazio que havia antes.
- **Subtítulo novo:** "Instalamos um bloco por vez, na ordem que o seu negócio
  precisa. Sem product-dump, sem pacote inchado." (a doutrina "um bloco por vez").
- **Símbolo do olho GRANDE ao fundo do Nosso Stack** (`.stack-logo`,
  `assets/simbolo-grande.png` = cópia deployada de `site-fontes/marca-simbolo.png`,
  420×348). Faint (opacity .10) e mascarado nas bordas. ⚠️ O `design-guide.md` marca
  "símbolo ampliado como marca-d'água" como ANTIPADRÃO da casa (caso Aion); entrou
  a pedido direto do Marcelo, e agora o símbolo aparece 2x na tela (header + fundo).
- **Header ganhou o símbolo à esquerda de "HÓRUS"** (`.marca-logo`,
  `assets/simbolo.webp`, 30px).
- **Bug corrigido:** o `a:hover { color: branco }` global pintava o texto do botão
  branco do header de branco (sumia). `.topo-cta:hover` agora força
  `color: var(--tinta)`.

Conferido (Playwright): desktop 1440 — Card 1 com o cabeçalho centralizado + ficha,
header com símbolo e botão com texto escuro no hover, stack com o olho grande ao
fundo. Detector `0`, sem erro de console.

---

## Estado em 31/08/2026 (versão 17) — intro de Serviços centralizada, linha divisória

Ajuste na seção **Serviços** (`.svcs`), sobre a v16.

- **Intro CENTRALIZADA** (print 1): `.svcs-intro` virou `text-align: center`, título
  `.svcs-titulo` centralizado (`margin: 0 auto`, subiu para `t-54`, peso 300).
- **Linha divisória no topo** (`.svcs-linha`): hairline em gradiente que separa a
  seção anterior, com o eyebrow + título **abaixo** dela (pedido do Marcelo,
  print 2). O vão grande de antes (padding-top 150px) caiu para 84px.
- **Efeito de gaveta confirmado começando após o título sumir:** a intro está em
  fluxo normal (não é sticky), então rola e some; só então o 1º painel `.svc`
  (sticky top:0, 100dvh) prende e os seguintes empilham por cima (prints 3 e 4). O
  mecanismo já era esse; a mudança foi só a intro. Nada de JS novo.

Conferido (Playwright): desktop 1440 — intro centralizada com a linha, e o estado
rolado (título escondido, 1º painel preso, gaveta pronta para empilhar). Detector
`0`, sem erro de console.

---

## Estado em 31/08/2026 (versão 16) — leitura do hero, header, stack diagonal, Seção 1 com arte animada

Ajustes sobre a v15 (mesma sessão).

- **Fundo do hero — brilho para longe do texto:** o feixe de luz do vídeo caía
  atrás do texto (esquerda). O vídeo foi **espelhado** (`transform: scaleX(-1)` em
  `.hero-video`), jogando o brilho para a direita, e um **scrim escuro na coluna
  esquerda** (1º gradiente do `.hero::after`) garante a leitura. Azul continua à
  esquerda, amarelo à direita.
- **Header não esconde mais a nav ao rolar:** o IIFE que aplicava `.nav-oculta` no
  scroll foi **removido** do JS. A nav fica sempre visível.
- **Botão do header agora usa o efeito de ROLO** (o mesmo do "Nossos serviços"): no
  hover o texto sobe e a cópia entra por baixo (`.topo-cta.btn-roll`). O brilho que
  seguia o mouse **saiu do header** (segue só no "Fale conosco" azul, `.btn-azul`).
- **Nosso Stack — brilho em DIAGONAL:** o `.stack::before` virou uma elipse alongada
  girada (`rotate(-16deg)`), subindo para a direita, seguindo a linha do print 2.
- **Seção 1 refeita nas proporções do print 1, com ARTE ANIMADA em cada card:**
  - A descrição solta saiu do cabeçalho e **virou o corpo do 3º card**, que foi
    **renomeado** para **"Uma casa, do plano ao ar"** (título novo que combina com o
    texto "A Hórus combina estratégia, design, tecnologia e IA…").
  - Os três cards agora têm **mais texto** (proporcional ao print) e **arte que se
    move**: cubo com *bob* (`cubo-bob`), gráfico com painéis flutuando (`pan-float`)
    e ponta pulsando (`dot-pulse`), e o card novo com uma **órbita** (anéis + pontos
    girando em torno de um núcleo — classes `.orb*`). Tudo pausa em
    `prefers-reduced-motion`.
  - Colunas do bento levemente reponderadas (`1.06fr 0.94fr`).

Conferido (Playwright): desktop 1440 — hero legível (brilho à direita), header
branco com rolo e nav fixa, stack com brilho diagonal, Seção 1 com os 3 cards
animados e o card "Uma casa…" novo. Sem erro de console. Detector `0`.

---

## Estado em 31/08/2026 (versão 15) — botões, Nosso Stack em 2 fileiras coloridas, animações da Seção 1

Ajustes sobre a v14 (mesma sessão).

- **Botões (efeito button-2 portado, `.js-glow` + `.cta-brilho`, brilho radial que
  segue o mouse):**
  - **Header BRANCO** (`.topo-cta`): chapa branca, texto escuro, brilho azul no
    hover.
  - **Hero primário AZUL** (`.btn-azul`, "Fale conosco"): gradiente azul da logo +
    o mesmo brilho. (Era amarelo; `.btn-amarelo` foi removido.)
  - **"Nossos serviços"** (`.btn-linha.btn-roll`): no hover o texto **sobe e some,
    e uma cópia entra por baixo** (rolo — duas cópias numa janela de 1 linha,
    `translateY(-100%)`).
  - O JS do brilho agora percorre todo `.js-glow` (não só o header).
- **Nosso Stack refeito em DUAS FILEIRAS opostas:** a de cima corre direita→
  esquerda, a de baixo esquerda→direita (`@keyframes stack-la/lb`). Ícones agora são
  os **logos COLORIDOS oficiais** (SVG Logos / gilbarbara/logos, 35 arquivos em
  `assets/stack/*.svg`, via `<img>` — não mais máscara monocromática), cada um numa
  **caixa de vidro** (`.tile`, vidro por luz, sem backdrop-filter) e com um **brilho
  de cor ao fundo** (`.stack::before`, violeta+azul, como o print n8n). Os 5 logos
  pretos (github/notion/vercel/openai/framer) levam `.tile-i--inv` (invert) para
  clarear no tile escuro. Lista expandida (~35): design, front, infra, CMS/commerce,
  marketing, comms, IA. ⚠️ vite e gsap vieram como wordmark (não icon-only) — trocar
  se incomodar. ⚠️ Uso nominativo, sem sugerir parceria.
- **Seção 1 ganhou animação de entrada** (kicker, título, descrição e os 3 cards têm
  `.rev`, revelados pela rolagem). Para isso o reveal imediato do hero foi escopado
  de `.hero .rev` → **`.hero-topo .rev`** (senão, como a Seção 1 fica DENTRO de
  `.hero`, ela revelava na carga em vez de na rolagem).
- **Linha azul** (`.s1-linha`) sob o título "Estratégia antes da execução".

Conferido (Playwright): desktop 1440 — header branco (glow no hover), "Fale conosco"
azul com glow, "Nossos serviços" com rolo, Seção 1 (linha azul, cards revelando),
Nosso Stack em 2 fileiras de tiles de vidro coloridos com brilho de fundo. Sem erro
de console. Detector `0`.

---

## Estado em 31/08/2026 (versão 14) — fundo invertido, hero com 2 botões, Seção 1 em bento

Rodada de refinamento sobre a v13 (mesma sessão), com prints de referência do
Marcelo (n8n/Fusion AI). Nada de React instalado (o componente `button-2` entrou
como TRATAMENTO portado pra vanilla).

- **Fundo do hero invertido:** agora **AZUL à esquerda** (onde fica o texto) e
  **AMARELO à direita**. Trocado nos três lugares (`.hero::after`, `.hero-tint`,
  `.hero-tint::after`).
- **Título da home BOLD e maior:** `.hero h1` foi de `t-54`/peso 300 para
  **`t-80`/peso 700**. A palavra **"ambiciosos." em amarelo** (`.h1-am`). O
  subtítulo (`.hero-lead`) **não mudou** (pedido explícito).
- **Dois botões no hero** (`.hero-acao`, alinhado à esquerda): **"Fale conosco"**
  amarelo com texto escuro (`.btn-amarelo`) + **"Nossos serviços"** só contorno,
  sem fundo (`.btn-linha`).
- **Botão do header agora AZUL com brilho que segue o mouse** (porte do componente
  `button-2`): `.topo-cta` virou gradiente azul da logo com contorno azul-claro; um
  `.cta-brilho` radial dentro dele acompanha o ponteiro (JS seta `--mx/--my`,
  opacidade liga no enter). Deixou de usar `--ember`. Hierarquia de CTA agora:
  **header azul · hero primário amarelo · chamada final amarela**.
- **Seção 1 reescrita (novo copy + layout bento, inspiração print 1).** Saiu o
  "Estratégia e execução na mesma casa" + 3 colunas. Entrou: kicker "O digital
  mudou…", headline de duas cores (branco + azul-claro) "Soluções pensadas para o
  negócio. / Construídas para gerar resultados.", descrição, e um **bento de 3
  cards** (`.s1-bento`, classes `.s1-*`):
  - **Estratégia antes da execução** — arte à esquerda: **cubo azul isométrico**
    de placas de vidro empilhadas, feito em **CSS 3D** (`.cubo`/`.cubo-l`), no
    espírito do print 2 (Pensamos antes de construir).
  - **Tecnologia que trabalha por você** — card **mais alto** (ocupa a coluna 2
    nas duas linhas), com um **gráfico de crescimento em SVG** na cor da marca
    (amarelo, `.s1-art--grafico`), no espírito do print 3 (Construímos para
    funcionar). ⚠️ Interpretação: o Marcelo escreveu "print 2" para os dois, mas o
    gráfico (print 3) é o que casa com "tecnologia/crescer"; o cubo (print 2) ficou
    na estratégia. Confirmar se quis o contrário.
  - **Feito para evoluir** — card de texto (coluna 1, embaixo).
  Toda a arte é **abstrata em CSS/SVG** (sem imagem gerada, sem asset externo).

Conferido (Playwright): desktop 1440 e mobile 390 — hero (azul esquerda/amarelo
direita, título bold, 2 botões, header azul com glow no hover), Seção 1 bento (cubo
azul, gráfico dourado, card de texto), mobile empilhando. Sem erro de console.
Detector do impeccable `0`.

> ⚠️ O bloco v13 abaixo descreve a Seção 1 ANTERIOR (3 colunas "por que confiam") e
> o fundo amarelo-esquerda; os dois foram substituídos aqui. Vale como histórico.

---

## Estado em 31/08/2026 (versão 13) — hero+Seção 1 fundidos, AMARELO da marca de volta, faixa "Nosso Stack"

Pedido do Marcelo, com o componente React `glass-video-hero` (shadcn) e o print do
Fusion AI como referência de TRATAMENTO — nada instalado (o site segue HTML/CSS
nativo, regra da casa).

**Hero e Seção 1 fundidos.** Viraram UMA seção só (`<section class="hero"
id="sobre">`). `.hero-topo` (título + subtítulo, 100dvh) e `.valores` (eyebrow +
headline + 3 colunas) são dois blocos dentro dela, não duas `<section>`.

**Vídeo de fundo voltou** (tinha saído na v12): `.hero-video` + `.hero-tint` (o
truque da v11 — `grayscale` + `mix-blend-mode: color`, porque não dá pra recolorir
um MP4 direto). Granulado suavizado com `contrast(0.98)` + `blur(1.4px)`.

**Sangramento sem linha (o pedido central):** a 1ª tentativa tampava o vídeo com um
degradê `--tinta` por cima (`.hero-fade`) e ainda dava pra sentir a borda. Trocado
por **`mask-image` no próprio vídeo e no tint** — os dois vão a 116dvh (entram
~16dvh na Seção 1) e se **dissolvem sozinhos** até transparente, então onde o vídeo
some aparece o `--tinta` sem borda nenhuma. `.hero-fade` foi **removido**. O brilho
atmosférico (`.hero::after`, `inset:0`) atravessa hero + Seção 1 e morre em
`transparent`, então o topo da Seção 1 ainda pega um resto de luz e os 3 cartões
caem no preto limpo (contraste cheio pro texto pequeno).

**🟡 O AMARELO da marca (#F4C430) voltou e o laranja saiu do site inteiro.** Duas
rodadas: primeiro o fundo foi para azul + laranja; o Marcelo então apontou que o
laranja era importado do n8n e a logo tem AMARELO, e mandou trocar tudo. Feito:
- Fundo do hero no esquema do **print 4**: raio **amarelo** descendo pela borda
  esquerda + **azul** (`#2563EB`/`#60A5FA`) na diagonal da direita. O brilho que
  ficava esbranquiçado no centro-baixo virou **dourado** (radial amarelo aditivo no
  `.hero::after`; o `.hero-tint` mantém o quente até ~38% antes de virar azul).
- **Token `--ember` (era laranja→vermelho do n8n) agora carrega o amarelo**
  (`linear-gradient(30deg,#F4C430,#dca514)`), e `--ember-1/2`, `--dourado`,
  `--c-ambar`, `--c-coral` idem. Isso propaga o amarelo pra TODOS os CTAs, acentos
  e marcadores ■ do site. Os tripletos RGB do âmbar antigo (`231,179,74`) e do
  laranja (`253,137,37`, `255,73,44`) foram trocados por `244,196,48` na folha
  toda. ⚠️ **Texto sobre fundo amarelo é ESCURO** (`var(--tinta)`), nunca branco:
  `.topo-cta`, `.cta-ember`, `.mock-shop .mk-buy` já ajustados (branco sobre
  amarelo reprova contraste). Os shimmers (`.cta-glow`, `.qp-ico`) correm
  amarelo↔azul.

**Faixa "Nosso Stack"** (nova, entre a Seção 1 e Serviços). Prova de competência,
NÃO "integrações" (a Hórus não é app): faixa que corre da direita pra esquerda com
as ferramentas que a casa usa. Logos oficiais monocromáticos (Simple Icons),
**embutidos como máscara data-URI em classes `.tk--*` no `site.css`** (sem
requisição externa, e sob `file://` máscara com SVG externo dá CORS). Cor via
`background` do `.tk` (dim em repouso, acende no hover); bordas com fade; sem pausa
no hover; `prefers-reduced-motion` vira grade estática. Conjunto duplicado no HTML
pro laço (2º bloco `aria-hidden`). Ferramentas: Figma, Framer, GSAP, Next.js,
Node.js, React, CSS, Vercel, Cloudflare, GitHub, Shopify, WhatsApp, Meta, Google
Calendar. ⚠️ Uso nominativo ("ferramentas que usamos"), sem sugerir parceria.

Conferido (Playwright): desktop 1440 e mobile 390 — hero (amarelo esquerda, azul
direita, brilho central dourado), costura sem linha, faixa Nosso Stack com logos,
CTAs amarelos com texto escuro. Sem erro de console. Detector do impeccable `0`.

---

## ⚠️ Estado em 28/08/2026 (versão 12) — migração para a IDENTIDADE n8n

O Marcelo mandou o **design system do n8n** e pediu para aplicar ao site inteiro,
mantendo as seções e a home, **tirando o amarelo de vez**. Backup atualizado para o
estado anterior (`site-backup-2026-08-28/`). Identidade nova registrada em
`identidade/design-guide.md` (paleta n8n + texto de marca a citar sempre).

**Feito nesta rodada (fundação + recolor):**
- **Tokens (`site.css §1`) reescritos:** void `#0e0918`, surfaces `#1a1624`/`#1b1728`,
  ash `#d1cece`, EMBER (laranja→vermelho, só CTA), ELECTRIC (azul→violeta, link/foco).
  Nomes legados (`--tinta`, `--osso`, `--azul-luz`, `--dourado`...) mantidos carregando
  a cor nova. **DM Sans** substitui Sora/Hanken; **títulos peso 300** (sussurram).
- **Header:** fixo, **glass**, arredondado, **sem contorno**; CTA em **ember**.
- **Home:** **background REMOVIDO** (o vídeo saiu); void + brilho atmosférico.
- **Seção "Por que a Hórus" REMOVIDA.**
- **Fundos de seção recoloridos e alternando** (electric / void / ember no print-5),
  **sem amarelo**. Serviços com fundo mais escuro + **pontinhos** (`.roleta::before`).
- **Imagens 3D dos serviços removidas.**
- **Chamada final:** botão **ember** com **halo que corre laranja↔azul** (print 3);
  o shader âmbar de fundo saiu.
- **Motion do portfólio DESLIGADO** (por ora): vira pista arrastável.
- **Ponte:** cores por card unificadas em electric (sem arco-íris) até a
  reestruturação.

**✅ Serviços refeitos (28/08, 2ª rodada):** a roleta virou uma **PILHA sticky** —
cada serviço é um painel de tela cheia que **surge por cima do anterior** (`position:
sticky`, sem JS). Seis serviços em categorias (Sites/Dev, Software, E-commerce,
Marketing, Conteúdo, Visibilidade), cada um com número mono, categoria, título leve,
descrição, **8 capacidades em 2 colunas** e um **mock relacionado** ao lado (navegador,
workflow, loja, gráfico ember, artigo, mapa). Fundos alternando void/electric/ember
(o ember é o "print 4"). Sem imagens 3D. CSS em `site.css §7c-2`.

**✅ Seção 1 refeita (print 2):** eyebrow + **headline de duas cores** (electric +
ember) + descrição + **3 colunas** com fios finos ("por que confiam na Hórus"). A
cópia velha ("soluções sob medida", "de ponta") saiu. CSS na área `.valores`.

**✅ Etapas refeitas (print 5):** fundo granulado + brilho ember, eyebrow, headline
centralizada com acento ember, e uma **linha do tempo horizontal** (4 números mono
ligados por fio electric). Saiu o zigue-zague, a linha degradê arco-íris e o botão
azul; o fecho é o CTA ember com halo laranja↔azul. CSS na área `.passos`.

**✅ 5 padrões refeitos:** a seção orbital virou uma **fileira de 5 cards** glass
granulados, com **ícone shimmer** (o efeito do CTA, ember↔electric) no topo, título
curto e descrição; compacto, dark, sem cores por card, hover que levanta. Classes
`qp-*`; o orbital (ql-*) saiu do HTML.

**✅ MIGRAÇÃO n8n COMPLETA (28/08/2026).** As quatro reestruturações fechadas
(serviços empilhando, seção 1 print 2, etapas print 5, 5 padrões em fileira) sobre a
fundação (paleta n8n, DM Sans leve, header glass, home sem fundo, sem amarelo).

> Abaixo, o histórico v2–v11 (estrutura anterior, paleta âmbar). Vale como registro.

---

---

## Estado em 28/08/2026 (versão 11) — recolor e ajustes de seção

Rodada grande de identidade, pedida pelo Marcelo ("é apenas uma cor, ficou brega,
sem identidade"). O site de scroll (v10) foi **mantido** (a landing liquid-glass de
tela única foi descartada antes — ver `project_site-liquid-glass` na memória e
`site-backup-2026-08-28/`); o que mudou aqui foi **cor, tipografia e vários ajustes
de seção**, sobre a mesma estrutura:

- **Paleta com PAPÉIS** (o antídoto ao "uma cor só"): âmbar `#E7B34A` + **azul de
  volta** `#5B8DEF` como co-primárias; conjunto disciplinado de acentos (âmbar, azul,
  verde `#3FBFA3`, coral `#F0785C`, violeta `#A98BF0`) dá **cor própria a cada card**;
  as **seções viajam por cores** ao rolar. Tokens novos em `site.css §1`. Registrado
  em `identidade/design-guide.md`.
- **Camada mono** (`JetBrains Mono`) nos números da roleta, eyebrow e categoria de
  serviço — cara de instrumento.
- **Hero:** o shader plasma saiu; entrou um **vídeo em loop** (asset próprio do
  Higgsfield, CloudFront) **dessaturado e repintado** na marca via `mix-blend-mode:
  color` (âmbar → azul). Não dá para recolorir um MP4 direto; o truque é grayscale +
  gradiente da marca em blend. Init do plasma segue no JS, inofensivo (o `<canvas>`
  saiu, `if(!tela)return`).
- **Header:** o link "A Hórus" virou **"Sobre"**.
- **Serviços:** título **maior e centralizado** com **reveal** (SplitText, agora em
  todos os `[data-split]`); mais respiro vertical (`ITEM_H` 300, era 220); **snap mais
  travado** (lock por degrau, `scrub: 0.6`).
- **Compromisso:** **5 cores distintas** por card, texto **legível** (clareado), e a
  **barrinha "Isso não é apenas o que fazemos" saiu**.
- **Portfólio → passos:** depois de duas tentativas de cortina (flash, depois faixa
  preta), a **cortina foi REMOVIDA**. O handoff é fluxo vertical limpo: o portfólio
  termina a corrida horizontal, solta o pin, e os passos entram por baixo (com um fade
  de tinta no topo da seção). Sem slide, sem banda.

**2ª rodada de 28/08 (ajustes do Marcelo sobre prints):**
- **Divisória hero → seção 1 removida:** `.hero-fade` dissolve o vídeo na tinta antes
  da borda. **Seção 1 (valores) recolorida para COOL** (azul + violeta), longe do
  âmbar. As seções **alternam** quente/frio ao rolar (o âmbar não domina mais).
- **Seção 2, o título SOBE ao rolar:** o intro saiu de dentro do `.rol-pin` (o pin
  agora dispara em `.rol-pin`, não na seção), então o título rola para cima e só então
  a roleta prende.
- **Roleta aproximada do print de referência:** entrou o **arco/círculo visível**
  atrás dos números, **pills (tags) por serviço** (mono), e a **imagem 3D maior
  sangrando à direita**. Números/eyebrow/categoria em azul + mono.
- **4 etapas:** cor por card; a **linha degradê muda de cor por região** (azul → verde
  → âmbar → coral) e **desce até o botão**, que virou uma **pílula azul maior** (não
  amarela) e **acende** quando a linha chega.

Conferido: detector do impeccable **saída `0`**, varredura de scroll (desktop 1440) e
mobile (390) por Playwright — hero, roleta, matriz, compromisso, portfólio→passos,
etapas com linha até o botão, e chamada. **Pendente:** organizar as pastas do site
(mantidas intactas para não quebrar caminhos de asset no meio do recolor) e, se o
Marcelo quiser, centralizar horizontalmente os cards da roleta.

> O restante abaixo (v2 a v10) é histórico da mesma estrutura de scroll.

---

- `PLANO.md` — passe duplo de design, escrito antes do HTML. Ler antes de mexer
  em qualquer coisa visual aqui
- `index.html` — home, dez seções
- `assets/` — o que vai ao ar
- `site-fontes/` — arte-fonte em PNG, **fora** do que vai ao ar

A identidade (cor, tipo, tom, logo) vive em `identidade/design-guide.md`, que foi
preenchido em 04/08/2026 a partir dos dois boards de marca que o Marcelo mandou.
Até essa data estava em branco.

---

## Decisões que já estão tomadas, para não reabrir

> ⚠️ **Leia a "Estado em 26/08/2026 (versões 8 e 9)" logo abaixo antes de confiar
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

## Estado em 27/08/2026 (versão 10) — estudo das 9 referências + revisão

O Marcelo mandou **nove sites de agência** (lessestudio, delucks, graffico, wibify,
uxbert, amphora, vividmotion, estrela, xmethod) e pediu: estudar tudo, trazer o que
serve, revisar o site com os agentes e gerar imagens de portfólio.

**Estudo (3 agentes orquestrados):** 7 teardowns novos em `referencias/` (os outros 2
já existiam). Os padrões novos entraram em `_memoria/design/`: cardápio de entregas
nomeadas + contador `/N` (00-anatomia), matriz comparativa que ataca categoria e não
concorrente (00-anatomia), tríade Local/Setor/Serviços no portfólio, numeração de seção
grande, e o antipadrão **typo no hero** (90-antipadroes).

**Revisão (agente com as lentes do conselho): veredito 70/100.** Aguenta a fileira por
craft; perde em posicionamento. Lacunas abertas, por impacto: (1) bloco "para quem é",
(2) a cunha de compliance como pilar próprio, (3) matriz "por que a Hórus", (4) FAQ,
(5) CTA no hero. Copy do hero/#sobre ainda reprova o passe duplo ("soluções" 2x, "sob
medida", "de ponta") — recomendado reescrever, não mexido (é copy aprovada).

**Aplicado nesta rodada:**
- 🔴 **Integridade:** a seção de passos tinha "em até 7 dias" (prazo prometido, vedado) e
  "serviço de manutenção" (oferta não confirmada). Reescrita para o processo real:
  consulta → **esboço antes do sim** → desenvolvimento (não só "site") → **posse do
  cliente** (o "you own it" do wibify/delucks). Sem prazo, sem invenção.
- **Esfera engavetada REMOVIDA de vez** (HTML + IIFE JS). A "jornada da esfera / Olho de
  Hórus" era declarada o elemento-assinatura, mas estava morta por um `return`. A
  **roleta de serviços é a assinatura de fato** agora (decisão assumida, não resquício).
  A CSS `.vg-*`/`.viagem` ficou (não-usada, inofensiva; remover arriscava o trap de CSS
  compartilhado).
- **Portfólio:** as 3 imagens abstratas viraram **mockups quentes** (Higgsfield, GPT
  Image 2): psicologia, café e odonto. Ainda sem nome/tela de cliente (compliance).
- **Bug:** o wordmark "HÓRUS" do pé pedia `Bricolage Grotesque` (não carregada) → caía em
  system-ui. Corrigido para **Sora**.

**Tipografia REAL hoje: Sora (display) + Hanken Grotesk (corpo) + Newsreader itálico no
acento.** ⚠️ A linha do 26/08 abaixo que diz "Bricolage Grotesque" está **VENCIDA** — o
Sora ganhou (Direção C). Conferido: detector `0`, chaves do script balanceadas.

---

## Estado em 26/08/2026 (versões 8 e 9)

Duas rodadas grandes num dia, guiadas por prints numerados do Marcelo. O que
mudou, por frente (tudo continua **vanilla, sem React**; entrou GSAP + Lenis):

**Fundação e tipografia**
- **Stack ganhou motion:** GSAP (core, ScrollTrigger, SplitText, DrawSVG) + Lenis,
  vendorizados em `site/assets/vendor/`. É o motor da coreografia de scroll toda.
  A regra antiga "shader portado, não instalado; React não se justifica" continua
  valendo para **React**; GSAP/Lenis foram adotados de propósito.
- **Tipografia trocada:** saíram Sora/Archivo, entraram **Bricolage Grotesque**
  (display) + **Hanken Grotesk** (corpo) + **Newsreader** itálico no acento
  (`.ouro-it`). O detector reprovou Inter e Instrument Serif (genéricas); o par
  final passa limpo. ⚠️ Vale **só para o site institucional** por enquanto — a
  tipografia da casa em `identidade/design-guide.md` (peças/carrossel) não mudou.
- **Fundo por seção:** cada seção ganhou gradiente/glow próprio, no lugar do preto
  chapado.

**Home**
- **Botão do hero removido.** O hero é título + subtítulo + a esfera.
- **Fundo do hero:** shader das **fitas em curva** (azul desce à esquerda, dourado
  sobe à direita, cruzando embaixo — print 2 da 1ª rodada). Portado do código que
  o Marcelo mandou, para o WebGL nativo (sem three.js). A palavra que gira é dourada.
- A **esfera dourada já aparece na home**, no centro-baixo, com linha vertical
  (print 1 da 2ª rodada).

**Seção 2 — a jornada da esfera (o novo elemento-assinatura)**
- Overlay FIXO com a esfera; a seção `.visao` é só o trilho de rolagem. A esfera
  desce ao centro → **big bang** (anéis, partículas e os 4 valores saindo dela,
  print 2) → recolhe → o **Olho de Hórus se desenha em volta dela** (a esfera é a
  pupila, DrawSVG, print 3) → a logo montada sobe e entra nos Serviços. Os 4
  valores são honestos; a **barra de números** do print (+120 projetos etc.) NÃO
  entrou — número inventado.

**Serviços**
- Saíram tag, fundo cinza, números, coluna de rótulo, ícones e botões. Cards no
  **formato print 4** (21st.dev/bento): imagem 3D grande (gerada no Higgsfield) +
  painel de **vidro fosco** + contorno de vidro. Continuam **empilhando** (sticky).

**Garantia (nova, entre Serviços e Icarus)**
- **Layout circular** (print 5): símbolo no centro, arco pontilhado, 5 promessas em
  volta. As cinco são diferenciais reais da casa (método, não resultado).

**Portfólio**
- Formato **trionn**: título preso à esquerda, fileira de 3 cards à direita que
  corre na horizontal quando alinhada. Título "Trabalhos em destaque" (subtítulo
  saiu). Imagens **abstratas geradas no Higgsfield** (não são tela de cliente). O
  título acompanha os cards indo à esquerda, e ao fim a **cortina** revela a seção
  seguinte deslizando (o "Como começa" entra da direita).

**Como começa (nova, depois do portfólio)**
- Título grande + **4 passos em zigue-zague** ligados por uma **linha curva que se
  desenha** conforme rola (DrawSVG, amphora print 5). É a seção que a cortina revela.

**Transição + Chamada + Rodapé**
- **Barras pretas** varrem a tela entre "Como começa" e a chamada.
- Chamada: **botão maior**; no hover o aro acelera mais e a face vira **degradê
  azul→dourado**. Fundo = o **gradiente móvel antigo** da home (o campo de ondas,
  não as fitas). Saiu de vez o cartão de vidro.
- **Rodapé sem fundo próprio:** chamada + rodapé + assinatura dividem UM fundo
  animado (`.encerra`). Saíram o anel dourado do Instagram e o ícone de WhatsApp.

**Mídia:** as imagens 3D (serviços e portfólio) foram geradas no **Higgsfield**
(GPT Image 2, plano starter). Vídeo exige Pro/Ultimate, então as animações são
WebGL/canvas/SVG. Ver a seção de mídia no `CLAUDE.md` da raiz.

Conferido: detector **saída `0`**, console **sem erro**, mobile 390px ok (a jornada
de scroll é só desktop; no celular as seções são estáticas). `simbolo-grande.webp`
ficou **órfão** (a faixa de palavras que o usava foi removida).

---

## Estado em 25/08/2026 (versão 7)

Rodada de cabeçalho, chamada final e rodapé, com duas referências que o Marcelo
mandou e que **viraram teardown antes de qualquer HTML**:
`referencias/xmethod-web3.md` e `referencias/estrela-studio.md`.

- **Cabeçalho.** Deixou de ser faixa de ponta a ponta e virou painel de vidro
  flutuante, com aro que acende seguindo o ponteiro. Marca e links à esquerda, o
  botão sozinho à direita. O botão de lá não é mais o metal líquido: é vidro, e
  acende no hover — os dois CTAs agora se distinguem em repouso, não só no gesto
- **Chamada final.** Centralizada, sem eyebrow, sem parágrafo de abertura e sem a
  lista de canais. Ficou o título e um botão, agora de canto reto. Os canais
  desceram para o rodapé, que passou a ser onde o contato mora
- **Rodapé.** De quatro colunas para três linhas. Saíram Navegação, Serviços, o
  CNPJ e a linha de atendimento. O e-mail ganhou escala de título, sem rótulo, e
  as redes viraram ícone

Conferido nesta rodada: detector **saída `0`**, console **sem erro**, 7 seções na
ordem, **nenhuma âncora quebrada**, nenhuma rolagem lateral em 1440 nem em 390, os
dois canvases de metal ativos (nenhum caiu no aro parado), e cabeçalho, chamada e
rodapé fotografados em 1440 e em 390.

### Correções que saíram desta rodada

- **"Ilumina ao redor" exige painel com quatro arestas.** Barra colada nas bordas
  não tem redor: o efeito não é enfeite da forma, a forma é a condição dele
- **Vidro se faz com sombra `inset`, não externa.** A larga levanta o miolo, a
  curta desenha o aro. Sombra por fora é o card fantasma
- **Item de flex encolhe, o texto dentro dele não.** Em 390px o "HÓRUS" vazou por
  trás do botão **sem gerar rolagem lateral**, então nada acusou: só o print pega
- **A palavra "Menu" custa 77px; o ícone custa 42px** — e o JS que trocava
  `textContent` apaga o ícone junto

Registradas em `_memoria/design/90-antipadroes.md`.

---

## Estado em 05/08/2026, noite (versão 6)

Serviços viraram seis painéis de tela cheia com ficha técnica, no formato do print
que o Marcelo mandou. Rodapé em quatro colunas. O nome no pé virou hex dump com
onda. O hero ganhou fundo animado em WebGL e perdeu o rótulo. O botão ficou três
vezes mais lento, quase sem cor e correndo num sentido só.

Conferido: detector **saída `0`**, console **sem erro**, 7 seções na ordem, nenhuma
âncora quebrada, nenhuma rolagem lateral em 1440 nem em 390, e a tira do portfólio
medida indo e **voltando** com a rolagem. 146 KB no ar.

### Correções que saíram desta rodada

- **`overflow:hidden` num pai mata `animation-timeline: view()`.** Ele cria
  contêiner de rolagem e a linha do tempo se prende nele. `overflow: clip` recorta
  igual sem virar rolável. E o atalho `animation:` zera a duração em `0s` quando
  ela precisa ser `auto`. Nenhuma das duas dá erro no console
- **Pausa de marquee no hover lê como travamento**, não como cortesia
- **Movimento sem direção lê como ruído.** Somar tempo em dois eixos balança;
  deslocar o campo num eixo só é o que faz o metal escorrer
- **Texto em hex dump: quem engorda o traço da letra é o número de LINHAS da
  grade**, não a largura da célula

Registradas em `_memoria/design/90-antipadroes.md`.

---

## Estado em 05/08/2026, noite (versão 5)

A home caiu de 13 seções para 7. Saíram A diferença, A Máquina, Para quem é, O que
não vai ao ar, Como começa e Perguntas. Hero novo e sem cidade, palavra do título
trocando letra por letra, faixa de palavras sem chapa (o símbolo aparece por dentro
das letras) e o shader do botão refeito em cromo.

Conferido: detector **saída `0`**, console **sem erro**, 7 seções na ordem, nenhuma
âncora quebrada e nenhuma rolagem lateral em 1440 nem em 390.

⚠️ **Duas coisas que a v5 custou, e que estão no `PLANO.md` com detalhe:** a página
ficou **sem elemento-assinatura** (era o trilho da Máquina), e saíram os blocos 2, 4
e 7 da anatomia (para quem é, como começa, FAQ) mais a régua de compliance, que era
o diferencial que nenhuma das dez referências tinha. Tudo continua no git.

### Correções que saíram desta rodada

- **Aberração cromática forte vira arco-íris, não cromo.** 0,030 devolveu fita de
  arco-íris no aro do botão; 0,007 devolveu metal. E metal é cinza: tingir de azul
  da marca, que foi a primeira tentativa, apaga o cromo
- **Fantasma de largura se faz com a letra mais larga repetida**, não com a palavra
  mais longa: contagem de letra não é largura em pixel
- **Texto vazado por cima de chapa não mostra nada.** O vazado só existe se houver
  o que ver atrás
- **Logo de 96px esticado para 340px borra** igual a qualquer foto

Registradas em `_memoria/design/90-antipadroes.md`.

---

## Estado em 05/08/2026, noite (versão 4)

Reestruturação da home. Cinco seções novas (faixa de palavras, A Hórus, Serviços,
Icarus, Portfólio), a de Trabalho virou o Portfólio, a chamada final virou cartaz
à esquerda, e o nome entrou pixelado abaixo do rodapé. Comparativo e motivos no
`PLANO.md`.

Conferido: detector **saída `0`**, console **sem erro**, e as seções novas
conferidas a 1440px e a 390px.

### Correções que saíram desta rodada e valem para o próximo site

- **Recuo lateral zerado só num breakpoint.** O detector apontou `cramped-padding`
  numa faixa que tinha `padding: 74px 24px` escrito, e eu gastei três tentativas
  tentando registrar exceção antes de olhar o media query do celular, onde estava
  `padding: 52px 0`. O detector estava certo. Antes de chamar achado de falso
  positivo, procurar a mesma propriedade em **todos** os breakpoints
- **Marquee novo entra, marquee velho sai.** Se o velho carregava informação, ela
  vira seção
- **Texto pixelado se faz em resolução baixa**, não com filtro. E `textBaseline`
  no meio corta o acento do Ó
- **Rolagem horizontal amarrada ao scroll não precisa de listener** desde que
  existe `animation-timeline: view()`

Todas registradas em `_memoria/design/90-antipadroes.md`.

---

## Estado em 05/08/2026, tarde (versão 3)

Rodada de hero pedida pelo Marcelo com quatro referências na mão. Saiu a arte 3D
do fundo, o título ganhou uma palavra que gira, o CTA virou botão de metal líquido
em WebGL e o vidro dele virou linguagem de superfície da página inteira.
Comparativo completo no topo do `PLANO.md`.

Conferido: detector do impeccable **saída `0`** (e checado contra um arquivo ruim
de propósito, para provar que ele estava mesmo rodando), console **sem erro**,
WebGL ativo nos três botões, hero fechando em 828px de 828 disponíveis a 1440px, e
a dobra conferida também a 390px.

### Correções que saíram desta rodada e valem para o próximo site

- **Cruzar duas palavras de 80px por opacidade vira borrão.** Rotador de palavra
  se faz com faixa recortada e deslize, e as palavras se escolhem com largura
  parecida na hora de escrever a copy
- **As palavras em espera precisam de `aria-hidden`**, senão o leitor de tela lê
  as quatro grudadas
- **Tirar a foto do hero não autoriza pôr brilho no lugar dela.** Brilho sem
  objeto atrás continua sendo `dark-glow`
- **Vidro pedido pelo cliente se faz de luz, não de desfoque.** `backdrop-filter`
  só onde o painel passa por cima de conteúdo: cabeçalho e menu do celular
- **Componente de galeria traz o contraste do autor junto.** O rótulo do botão
  original dava 2,9:1 num CTA
- **Porta o efeito, mantém a stack.** Vinte linhas de shader não justificam
  React, Tailwind e um passo de build

Todas já estão registradas em `_memoria/design/90-antipadroes.md`.

---

## Estado em 05/08/2026, manhã (versão 2)

Home **refeita inteira** depois que o Marcelo mandou o logo, o brandkit e dez
sites de referência. Detector do impeccable **zerado** (saída `0`), **178 KB**
somando tudo que vai ao ar. Conferida em 1440px e em 390px pela técnica do iframe.

O que a v2 trouxe: logo de verdade no cabeçalho e no rodapé, fundo `#0A0B0F`
medido no arquivo da marca, rótulo em pílula, botão em pílula, título com o
termo-chave em azul, trinca de números no hero, esteira de capacidades, e uma
seção de comparação nova ("agência entrega peça, a Hórus instala uma máquina").
Comparativo completo no topo do `PLANO.md`.

**Dez famílias de layout em dez seções:** hero centralizado, esteira, comparação em
duas colunas, trilho vertical, coluna única de texto, grade 3x2 com fio, três
passos, grade 2x2 de card, acordeão nativo, chamada centralizada. Teto da casa
é 4, então sobra folga.

### Correções que saíram desta rodada e valem para o próximo site

- **`max-width:100%` sem `height:auto`** com `width`/`height` no HTML mantém a
  altura intrínseca. A foto do hero ficava com 950px de alto e empurrava o CTA
  para fora da tela
- **`.menu a` vence `.botao` em especificidade** e pintava o CTA do cabeçalho de
  cinza sobre azul: 2,2:1. O botão parecia "apagado" sem ninguém ter pedido isso
- **Título de hero em quatro linhas é erro de proporção**, não de copy. A coluna
  de texto foi para 1.4fr e o `max-width` do h1 para 24ch
- **`clamp()` esconde a escala do detector.** Trocado por valor literal mais
  media query, que é o padrão do resto da casa
- **`auto-fit` com `minmax` deixou órfã.** Seis itens pedem `repeat(3, 1fr)`,
  que fecha 3+3
- **Número e ponto do trilho se encavalavam.** Viraram uma coisa só
- **PNG de fundo quase-preto vira retângulo visível** no meio de uma página
  escura, porque o preto dele nunca bate exatamente com o da página. Uma máscara
  radial dissolve a borda e o objeto passa a flutuar
- **`scroll-behavior:smooth` quebra o print de seção no headless.** A rolagem não
  completa dentro do orçamento de tempo virtual e a seção sai preta, com os
  `.rev` ainda em `opacity:0`. Parece bug do site e não é
- **Elemento no fim da dobra nunca cruza o limiar do `IntersectionObserver`** e
  fica invisível até alguém rolar. Nada acima da dobra pode depender de rolagem
- **Objeto escuro não vira luz sozinho.** O arco de vidro no topo do hero lia
  como mancha; quem faz o trabalho de luz é o gradiente, e a foto entra por cima
  dando textura

Todas já estão registradas em `_memoria/design/90-antipadroes.md`.

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
- [ ] **@ do Instagram.** O manual traz `@horuspublicidade` e a descritiva mudou
      para AGÊNCIA
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

- [ ] **Autorização de portfólio.** Nenhum cliente autorizou uso do nome. A seção
      de portfólio descreve segmento e entrega, sem nome, sem logo e sem print, e
      **as quatro molduras estão sem imagem** por causa disso. ⚠️ Print do site de
      um cliente identifica o cliente mesmo sem escrever o nome: tirar screenshot
      dos quatro sites do repositório não resolve, piora.
      Grão da Serra tem a autorização em aberto e registrada na estratégia; Aion
      é especulativo sob Deployment Protection; Dr. Giovanni está fora da linha
      de frente. **Case com nome só entra com "sim" por escrito de cada um**
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
