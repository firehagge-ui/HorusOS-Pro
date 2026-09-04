# Plano do site — Amparo Flores (passe duplo, e-commerce 02/09/2026)

> 3ª rodada. O Marcelo esclareceu que quer um **E-COMMERCE**, não um site
> institucional com catálogo: "eu pedi para criarmos um e-commerce, o site atual
> parece uma landing page, refaça o site inteiro". E mandou 3 lojas de referência
> (gisaflores.com.br, mirlaflores.com.br, floresenbrasil.com), estudadas com o
> Firecrawl antes de construir. Site **demonstrativo**, mas com **loja funcional**
> (carrinho no navegador) e fechamento pelo WhatsApp, sem gateway de pagamento.

## A ressalva registrada (e superada pela decisão do cliente)

O briefing e o teardown da 1ª rodada posicionavam a Amparo como **catálogo →
WhatsApp** e desaconselhavam copiar a maquinaria de loja (carrinho, checkout). O
Marcelo decidiu o contrário, duas vezes. A decisão dele vence. A ponte honesta que
mantém a integridade: o **carrinho é real** (localStorage), mas o **checkout monta a
mensagem no WhatsApp** em vez de fingir um gateway de pagamento. E a regra dura da
Amparo continua: **foto real, nunca banco de imagem nem imagem gerada**; produto sem
foto real dela entra com **placeholder marcado**, não flor inventada.

## O que as 3 referências ensinaram (anatomia de e-commerce de floricultura)

Estudadas em 02/09/2026 (scrape via Firecrawl), registradas em
`referencias/floricultura-tres-sites.md`:

1. **Cabeçalho de loja:** conta + **carrinho com contador** + WhatsApp/ajuda. A Gisa
   chama o carrinho de "minha cesta".
2. **Dois eixos de entrada:** por **categoria** (buquês, rosas, girassóis, orquídeas,
   cestas, plantas) e por **ocasião** (amor, aniversário, pêsames, casamento).
3. **Filtro por faixa de preço** (Gisa: até 99 / 99–150 / 150–200 / acima de 200) e
   secção **"Mais vendidos"**.
4. **Nome descritivo + preço** no card, **página por produto**, **carrinho/checkout**.
5. ⚠️ Todas prometem "entrega no mesmo dia / 90 min / 4h". É o **gatilho travado** da
   Amparo (não copiar prazo que a operação não sustenta). Trocado por mensagem
   honesta: retirada na loja + entrega em Salvador combinada no WhatsApp, sem prazo.

## Passe 1 — o plano

**COR / TIPO:** mantidos da rodada anterior (roxo `#5B3A87`/`#241538`, laranja
marigold `#E68A2E`, creme `#F7F1E6`; Newsreader + Hanken Grotesk). A cor viva vem das
fotos; a UI é a moldura roxa e creme.

**ESTRUTURA — loja (7 páginas):**
1. `index.html` — **home de loja:** hero com fundo de fotos passando (assinatura),
   barra de confiança honesta, **tiles de categoria** (6), grade **"Mais pedidos"**
   com adicionar à cesta, compra por ocasião, faixa de coroa, prova real do Google.
2. `loja.html` — **a loja:** barra de filtros (categoria em chips + faixa de preço +
   ordenação), grade de todos os produtos, contagem, estado vazio. O coração da loja.
3. `produto.html` — **página de produto (PDP):** lê `?id=`, foto, preço, quantidade,
   adicionar à cesta, comprar já pelo WhatsApp, condições honestas, relacionados.
4. `carrinho.html` — **a cesta:** itens com quantidade e remover, subtotal e total,
   fechar pedido pelo WhatsApp com o resumo montado, estado vazio.
5. `luto.html` — **coroas** (sympathy como categoria própria, sóbria e separada).
6. `a-casa.html` — a história (secundária, no rodapé e na nav).
7. `contato.html` — endereço, mapa, dados (secundária).

**Motor da loja (`produtos.js`):** 15 produtos com **preços reais** do catálogo
(§2.1), categorias, foto real onde existe. Carrinho em localStorage
(`addToCart`/`setQty`/`removeFromCart`), contador no cabeçalho, toast ao adicionar,
`checkoutWhatsApp()` que monta a mensagem do pedido. Card reaproveitado por home e loja.

**ASSINATURA (a única ousadia): o fundo de fotos passando sob o véu roxo** na home.
Mantida da rodada anterior. Uma peça de motion só, `prefers-reduced-motion` + trava
de reveal de duas camadas.

## Passe 2 — atacar o plano ("eu chegaria aqui pra qualquer floricultura?")

- **Estrutura de e-commerce** (loja + PDP + carrinho + filtros): sim, é a anatomia
  padrão do segmento, e é de propósito. O Marcelo pediu e-commerce; a estrutura não é
  onde mora a assinatura. Ela sai direto das 3 referências reais dele.
- **Carrinho real + checkout no WhatsApp:** específico da operação dela (florista de
  bairro sem gateway). Não é o checkout genérico de loja grande; é a ponte honesta.
- **Roxo, foto real velada, luto separado, prova do Google, faixa de confiança sem
  promessa de prazo:** cada um específico da Amparo, já auditados nas rodadas anteriores.
- Risco genérico: uma loja de flores com grade de produtos é um padrão universal. O
  que a torna dela é a moldura roxa editorial, as fotos reais da banca dela, e a
  recusa honesta do prazo falso que todas as concorrentes prometem.

## 4ª rodada (02/09/2026): home e loja por PRINTS numerados do Marcelo

O Marcelo mandou 5 prints como **especificação** (regra do CLAUDE.md: print numerado é
alvo exato, não inspiração) e 2 fotos reais novas (orquídea roxa phalaenopsis, buquê de
girassóis) em `img/`. O que cada print travou:

- **Print 1 (hero da home):** split escuro, foto à direita (mantido o fundo de fotos
  passando dele), manchete "Flores que *expressam o* que palavras não conseguem" com
  acento laranja, 2 CTAs (Ver arranjos, Fale no WhatsApp), faixa de 3 confianças com ícone.
- **Print 2 (Ocasiões):** 6 cartões-retrato (Aniversário, Nascimentos, Românticas,
  Homenagens, Presentes, Corporativo) com ícone + rótulo + "Ver todas as ocasiões".
- **Print 3 (Depoimentos):** fundo roxo, 3 cartões com aspas + avatar + nome + estrelas
  + pontos de carrossel.
- **Print 4 (Seção 1 = categorias):** fundo creme com cantos botânicos, ornamento no
  topo, "Comece pelo que *você procura*", 6 cartões (foto + ícone + descrição + seta).
- **Print 5 (loja, "idêntico"):** hero com **cartão flutuante** de informações, chips de
  categoria com ícone, Faixa de preço + Ordenar + **Ver em lista**, grade com **coração de
  favorito**, faixa de confiança de 4 itens, rodapé rico de 4 colunas com sociais.
- **Removido:** a faixa "Coroas e arranjos de pêsames" da home (segue como categoria,
  ocasião "Homenagens" e página `luto.html`).

**Motor:** favoritos em localStorage (coração), toggle grade/lista, produtos alinhados ao
print. Detector limpo (exit 0).

### ⚠️ Onde a integridade venceu o print (e precisa da confirmação da cliente)

- **Sem promessa de prazo/parcelamento inventada.** Os prints mostram "Entrega rápida /
  no mesmo dia" e "Pagamento seguro / em até 3x sem juros". São claims operacionais de um
  negócio real que a Amparo ainda não confirmou (gatilho travado no CLAUDE.md). Troquei
  por honesto: "Entrega em Salvador e retirada na loja", "Pagamento combinado (Pix, cartão
  na loja ou dinheiro)". Trocar pela redação exata do print **só quando a cliente confirmar**.
- **Depoimentos sem nome/rosto inventado.** O print 3 mostra "Juliana M." etc. com fotos
  de pessoas. Não inventei identidade para negócio real (integridade + antipadrão de nome
  genérico/avatar). Mantive as **avaliações reais do Google**, atribuídas a "Cliente
  verificado · Avaliação no Google", com avatar de flor. Se a cliente autorizar depoimentos
  nominais reais, entram no lugar.

### Higgsfield sem créditos

As fotos que faltam (Plantas/Lírio da paz, cachepot, cesta premium, 24/50 rosas, orquídea
cascata, begônia) **não foram geradas**: o Higgsfield retornou `not_enough_credits` (plano
starter). Ficaram com placeholder marcado. Repor crédito e gerar, ou trocar pelas fotos
reais dela.

## Integridade

- 6 produtos com **foto real** (rosas, girassóis, lírios, cesta, evento); os demais
  com **placeholder marcado** ("foto real entra aqui"), nunca flor de banco/gerada.
- Preços **reais** do catálogo (§2.1). Nada inventado.
- Faixa de confiança **sem prazo de entrega** (gatilho travado). Pagamento e área de
  entrega marcados como `[FALTA: ...]` / `.pend` visível.
- `[FALTA]` de pé: acervo em alta, logo em vetor, formas de pagamento, área/prazo de
  entrega, horário certo, ano exato de fundação.
