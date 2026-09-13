# Teardown: High Torque Store

- **URL:** https://www.hightorquestore.com.br
- **Segmento:** e-commerce automotivo de marca própria (aditivos de combustível / arrefecimento), autoridade movida a creator
- **Estudado em:** 11/09/2026 (navegador virtual + Firecrawl map)
- **Nota:** 8/10 — máquina de conversão bem azeitada; o que puxa a nota pra baixo é excesso de selo/prova empilhada (cansa) e dependência de gatilho de desconto.
- **Contexto:** estudado pelo Marcelo como inspiração pro site da **Mullsanni Performance**
  (lead #8, oficina de performance). É o gênero automotivo/performance, com um eixo que
  interessa direto à Mullsanni: **autoridade de creator técnico + prova social pesada +
  captura de lead gamificada**. ⚠️ Diferença de modelo: a High Torque é **e-commerce de
  produto físico**; a Mullsanni é **serviço** (remap/preparação). O que transfere é a
  camada de autoridade e prova, não a vitrine de produto/carrinho.

Plataforma: **Wbuy** (`sistemawbuy.com.br`), com Cloudflare Turnstile protegendo as
páginas internas (Firecrawl bate no challenge; o navegador logado passa).

---

## Estrutura, na ordem

Home:

1. **Barra topo rotativa** (vermelho #FE1625): "Parcele até 2x sem juros / cupom PRIMEIRA10 / FRETE GRÁTIS acima de R$250". Três iscas girando.
2. **Header** preto, logo à esquerda, menu enxuto (PRODUTOS HT, COMBOS), busca + conta + carrinho.
3. **Hero carrossel** — foto de produto em close dramático sobre fundo escuro, headline curta ("LIMPEZA QUE GERA ECONOMIA"), setas prev/next.
4. **Barra de números sociais rolando** (marquee infinito): +700.000 clientes / +87.000 avaliações 5★ / +1.500.000 seguidores. Repetida à exaustão em loop.
5. **Faixa de 4 benefícios** com ícone: 1ª compra 10% OFF · parcele 2x · frete grátis R$250 · 99% avaliações positivas.
6. **Tiles de campanha** (3 banners): "seja revendedor", "padrão HT na sua oficina", "proteção contra corrosão".
7. **MAIS VENDIDOS** — grade de 3 produtos com selo "MAIS VENDIDO", preço riscado→atual, parcelamento, preço PIX/boleto com -5%, badge de % OFF, botão ADICIONAR.
8. **"Qual aditivo usar?"** — 3 cards coloridos por produto (vermelho / azul-marinho / bege), cada um com nome + promessa + parágrafo técnico. **Educação que também é comparador.**
9. **COMBOS** — carrossel de kits (2/4/8 un) com desconto progressivo maior no combo maior (-37% no 8un vs -25% no 2un). Âncora de volume.
10. **Autoridade / creators** — "Quem entende de carro, confia na High Torque": ADG (Alexandre Generoso, fundador + maior canal técnico do Brasil) e Cesar Urnhani (piloto, apresentador Auto Esporte/Globo). Foto + credencial + @.
11. **Prova social** — parede de depoimentos curtos (nome + texto), um review longo com dado concreto ("de 9,5 pra 10,4 km/l, HB20 1.0 2016").
12. **Reputação ReclameAQUI** ("Reputação Máxima") + "direto da fábrica pra sua casa".
13. **FAQ** acordeão + bloco de atendimento WhatsApp.
14. **Footer** — categorias, institucional, newsletter, contato ((19) 99703-3331), selos de pagamento/segurança, nota Wbuy, verificado.

Overlays: **roleta "Gire e Ganhe"** (widget LeadUP, dispara no scroll/tempo, botão-aba lateral reabre), chat WhatsApp flutuante, banner de cookies.

Comparado ao `_memoria/design/00-anatomia.md`: segue a espinha clássica (hero → prova →
oferta → autoridade → prova → captura), mas **empilha prova social em camadas demais**
(marquee de números + benefícios + reviews + ReclameAQUI + creators). Funciona pra
ticket baixo por impulso; num site de autoridade de ticket alto, metade disso vira ruído.

---

## O que copiar

### Autoridade emprestada de creator técnico
- **Como é feito:** seção dedicada com foto grande do fundador-creator, credencial em uma
  linha ("criador do maior canal técnico automotivo do Brasil") e @ do Instagram. Segundo
  nome de fora (apresentador de TV) reforça por associação.
- **Por que funciona:** no automotivo, confiança = quem entende de carro. O rosto técnico
  vale mais que qualquer selo. **É exatamente o ativo da Mullsanni** (sócios técnicos,
  casos reais de dyno) — a Mullsanni tem o equivalente, falta expor com esse peso.

### Comparador "qual usar?" em 3 cards de cor
- **Como é feito:** um card por produto, cor sólida distinta (vermelho/azul/bege), nome +
  promessa de uma linha + parágrafo do que resolve. Sem tabela, sem preço — só clareza.
- **Por que funciona:** resolve a dúvida "qual é o meu caso?" antes de mandar pro produto.
  Na Mullsanni vira **"qual serviço é o seu?"** (Stage 1 / Stage 2 / TCU / escape), cada
  um explicado sem jargão que promete resultado.

### Prova com número concreto do próprio cliente
- **Como é feito:** no meio dos depoimentos genéricos, um review longo com dado específico
  (carro, ano, km/l antes e depois).
- **Por que funciona:** um número real vale mais que dez "recomendo!". ⚠️ Para a Mullsanni,
  **cuidado**: ganho de potência é promessa de resultado — só entra depoimento **autorizado
  por escrito** e sem virar tabela de "cavalos garantidos" (trava do CLAUDE.md da Mullsanni).

### Preço PIX/boleto com desconto explícito
- **Como é feito:** embaixo do preço parcelado, "R$X no PIX (-5%)" destacado. Empurra pro
  meio de pagamento mais barato pra loja.
- Copy de exemplo: "2x de R$44,00 sem juros / R$83,60 com PIX (-5%)".

### Combo com desconto progressivo
- Desconto cresce com o volume (-25% → -37%). Âncora clássica de ticket médio. Na Mullsanni
  o análogo é **pacote de serviço** (remap + escape + revisão) mais barato que avulso.

---

## Tipografia e cor

- **Família:** **Poppins** (título e corpo — 400/500/600). Carrega também Open Sans, Inter
  Tight e Lato em pedaços da plataforma Wbuy, mas o texto de marca é Poppins.
- **Escala:** headlines de hero em caixa-alta pesada, curtas (3-4 palavras). Corpo pequeno.
- **Cor:**
  - Fundo geral **branco #FFFFFF**, texto **preto #000000**.
  - Acento de marca **vermelho #FE1625** (barra topo, badges, CTAs de oferta, % OFF).
  - Header/hero em **preto**.
  - Vermelho escuro **#8A0F18**, azul-marinho **#0F1F3C** e bege **#E3D7CE** aparecem só
    nos 3 cards do comparador (cor por produto).
  - Botão de captura da roleta em **verde #00C853** (contraste proposital com o vermelho).
- **Acentos de verdade:** essencialmente **um** (vermelho), o que é bom. O resto é
  preto/branco. A cor dos cards é semântica (identifica produto), não decorativa.

---

## O que não copiar

- **Marquee de números em loop infinito** repetindo "+700.000 clientes" dez vezes na
  mesma tela: satura e cheira a e-commerce agressivo. Um bloco de stat estático basta.
- **Empilhamento de prova** (5 camadas). Num site de autoridade de ticket alto, escolher
  2-3 provas fortes bate mais que a enxurrada.
- **Roleta de desconto** como gatilho: ver a ressalva de posicionamento na ficha da roleta.
  Desconto girando roleta combina com impulso de R$88, não com serviço de R$1.500-8.000.
- **Selo sobre selo** ("composição segura", garantia, ReclameAQUI, verificado) colados no
  produto: vira parede de ruído.

---

## Modelo de loja e mecânicas de retenção (o e-commerce por baixo)

O catálogo é **enxuto de propósito**: 3 SKUs base (Poison Flex, Poison Diesel, Molékula),
multiplicados em combos (1/2/4/8 un e caixas). A loja inteira gira em torno de fazer o
cliente subir de 1un pra combo e voltar. As alavancas:

- **PDP (página de produto):** galeria à esquerda (várias fotos + banners internos de
  benefício embutidos na galeria), à direita título + rating (4.9, 358 avaliações) +
  preço riscado→atual + PIX/boleto -5% + **bloco de assinatura** ("Assine e economize
  10%", recompra automática) + **seletor de combo** (1/2/4/8un lado a lado com % OFF
  crescente) + selos de confiança. É uma página desenhada pra **subir ticket e criar
  recorrência**, não só vender a unidade.
- **Listagem:** grade simples com ordenação (menor/maior preço, alfabética, novidades,
  mais populares). Nada de sofisticado — o catálogo é pequeno, a listagem quase não importa.
- **Brinde por valor mínimo** (`/m/regras-promo-brinde`): a partir de **R$276** o cliente
  escolhe um brinde grátis no carrinho; se não escolher, recebe o Molékula por padrão.
  Empurrão claro de ticket até o patamar do combo.
- **Cashback 5%** (`/m/politica-de-cashback`): 5% sobre produtos, teto R$50/pedido,
  validade 90 dias, mínimo R$10 pra resgatar, vira cupom `CASH-XXXX` de 30 dias. Programa
  de recompra bem estruturado, amarrado ao CPF.
- **Atacado/Oficinas** (`/atacado-oficinas`): categoria B2B existe no menu, mas está
  **vazia** — canal previsto, ainda não ativado.
- **Landing de produto único** (`/poison-diesel`): existe no sitemap mas veio **em branco**
  (campanha inativa/despublicada em 11/09).

**Leitura pra Mullsanni:** o e-commerce em si (carrinho, combo, brinde) **não transfere** —
a Mullsanni é serviço, não produto de prateleira. O que transfere é a **lógica de
recompra**: o cashback e a assinatura são a versão B2C do "funil de recompra + CRM de
datas" que a casa já quer vender na Fase 2 (mesma família da Amparo Flores). Vale como
prova de que o mecanismo funciona e como referência de regra (validade, teto, resgate).

---

## Aplicado onde

Ainda não aplicado. Destino previsto: **Mullsanni Performance** — transferir a *seção de
autoridade de creator técnico*, o *comparador "qual serviço"* e o *modelo de captura de
lead* (ver ficha da roleta em `_biblioteca/inspiracoes/interacao/roleta-captura-lead.md`).
Preencher aqui quando entrar numa entrega de verdade.

Teardown irmão de gênero: [`performance-automotiva-cinco-sites.md`](performance-automotiva-cinco-sites.md)
e o [`automotivo-performance-index.md`](automotivo-performance-index.md).
