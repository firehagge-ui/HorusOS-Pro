# Teardown — High Torque Store (e-commerce de auto-peças / performance)

> **Como este teardown foi feito (integridade):** o site é fechado atrás de
> Cloudflare Turnstile e **não foi possível ler o corpo das páginas ao vivo**. O
> que está aqui vem de fonte real e verificável: o inventário de URLs (sitemap via
> Firecrawl map), as meta-descrições indexadas de cada página, o reel público da
> própria loja sobre a roleta, e o conhecimento da plataforma **WBuy** (sistemawbuy)
> que roda o site. O que é dedução da plataforma, não leitura direta, está marcado
> `[inferido]`. Nenhum número foi inventado.

- **URL:** https://www.hightorquestore.com.br/
- **Plataforma:** WBuy (SaaS de e-commerce brasileiro) — assets em `assets.sistemawbuy.com.br`
- **Segmento:** auto-peças / performance / aditivos automotivos, B2C + **B2B (atacado/oficinas)**
- **Posicionamento:** autoridade técnica. O fundador é referência nacional em
  diagnóstico automotivo e criador do "maior canal de mecânica do Brasil" no YouTube —
  o canal é o topo de funil que alimenta a loja.
- **Produtos-carro-chefe:** linha **Poison** (aditivo de combustível Flex e Diesel
  bactericida), **Molékula Hypercoolant** (condicionador de arrefecimento),
  **Descarbonizante Limpa TBI**.

---

## Barra de confiança (topo, rotativa)

Três mensagens girando no header — o tripé clássico de conversão de e-commerce BR:

1. **Parcele até 2x sem juros**
2. **Use o cupom PRIMEIRA10** (cupom de primeira compra, aquisição)
3. **FRETE GRÁTIS acima de R$250 p/ todo o Brasil** (âncora de ticket — empurra a
   cesta pra cima do limite)

**Ideia reaproveitável:** o piso de frete grátis (R$250) é uma alavanca de AOV, não
enfeite. Casa com os combos progressivos (abaixo).

---

## Arquitetura de páginas (o que existe)

**Institucionais / confiança**
- `/sobre` — história da marca ancorada no canal de YouTube e na oficina real
  ("desmistificar o setor, mostrar direto da nossa oficina")
- `/avaliacoes` — **página dedicada de depoimentos** (prova social concentrada, além
  das estrelas por produto)
- `/fotos` — galeria de fotos
- `/marcas-fornecedores` — página de marcas/fornecedores (autoridade + SEO)
- `/faq` — perguntas frequentes
- `/fale-conosco` — widget de WhatsApp com **roteamento por setor** ("escolha o setor")
- `/termos`, `/politica-privacidade`, `/p/lgpd` — legais (LGPD com capítulos de cookies)

**Coleções / vitrines**
- `/todos-produtos`
- `/combos` — vitrine de combos (bundles)
- `/produtos-high-torque` (marca própria "PRODUTOS HT")
- `/marca/high-torque`
- `/poison-diesel` — landing de linha de produto
- `/black-week-20-off` — coleção sazonal de campanha
- `/atacado-oficinas` — **canal B2B**: página de atacado pra oficinas
- `/selo/mais-vendido` — vitrine filtrada por **selo "Mais Vendido"**
- `/busca` — resultado de busca

**Páginas de mecânica de venda (`/m/`)**
- `/m/video-commerce` — vídeo shoppable (ver abaixo)
- `/m/politica-de-cashback` — regras do cashback
- `/m/regras-promo-brinde` — regras da promoção "comprou, girou, ganhou"

---

## Mecânicas de conversão e retenção (as "ideias")

### 1. Roleta de cupons — a assinatura
- Variante da casa: **em vídeo**. O reel deles instrui: *"dê play no vídeo, pause a
  roleta, descubra quantos % de desconto você ganhou"*. Amarra roleta + video-commerce.
- Variante clássica: roda que gira e para num prêmio, com captura de e-mail antes.
- Componente reconstruído e ingerido no acervo: **`roleta-cupons`** (as duas variantes
  documentadas lá). O honesto: o prêmio é decidido por peso, a roda só encena.

### 2. Cashback
- "Crédito para uso na própria loja, gerado a partir de compras aprovadas." Retenção:
  transforma uma compra na moeda da próxima. Regras em `/m/politica-de-cashback`.

### 3. Video-commerce (vídeo shoppable)
- Recurso nativo WBuy: vídeo com produto marcado / botão de compra dentro do player.
  Reaproveita conteúdo do YouTube pra vender direto. Página `/m/video-commerce`.

### 4. Combos progressivos = SKUs separados por quantidade
- O mesmo produto é vendido em 1un / 2un / 4un / 8un, **cada um como página própria**,
  com desconto crescente. Ex. Poison Flex 8un: de R$880 por **R$552** (2x R$276).
  Nomes de campanha ("Combo Cabuloso", "Nervoso 4un") dão personalidade à escada de preço.
- **Ideia reaproveitável:** a escada de quantidade é o motor de AOV; o "combo" nomeado
  vende melhor que "leve 8".

### 5. Promo "comprou, girou, ganhou" (regras de brinde)
- Regra típica do padrão (do ecossistema, `[inferido]` pro caso deles): a cada faixa de
  compra ganha 1 giro/cupom; limite de N cupons por CPF/CNPJ na campanha. Documentado
  em `/m/regras-promo-brinde`. Amarra a roleta a valor de compra, não só a e-mail.

### 6. Cupom de primeira compra — PRIMEIRA10
- 10% na estreia, comunicado na barra de topo. Aquisição.

### 7. Selo "Mais Vendido" + estrelas por produto
- Selos de vitrine (`/selo/mais-vendido`) e avaliação por produto com contagem visível
  (ex. "5.0 — 131 avaliações"). Prova social em dois níveis: no card e na página `/avaliacoes`.

### 8. Autoridade do fundador como topo de funil
- O canal de YouTube técnico é o ativo de aquisição; a loja monetiza a audiência. A
  página `/sobre` conta isso. Para cliente com dono que aparece/ensina, é o modelo.

### 9. Atacado/Oficinas (B2B)
- Canal separado pra oficinas comprarem em volume. Segmenta B2B sem poluir a loja B2C.

---

## O que vale pra quem (roteamento pra casa)

- **Mullsanni Performance (lead #8, oficina de performance):** este é praticamente o
  concorrente-modelo do segmento. Autoridade técnica do dono, linha de produto nomeada,
  canal de conteúdo como topo de funil, e o **canal atacado/oficinas** (a Mullsanni
  *é* oficina — pode ser tanto compradora quanto vendedora de linha própria no futuro).
- **Amparo Flores (cliente #6, e-commerce de flores):** a **escada de combos**, o **piso
  de frete grátis**, o **cashback de recompra** e a **roleta de cupons** são diretamente
  transportáveis pro e-commerce dela — casam com o eixo "recompra (CRM de datas)".
- **Qualquer e-commerce da casa:** barra de confiança tripla, selo mais-vendido,
  página dedicada de avaliações, video-commerce a partir de conteúdo existente.

## Travas (não copiar de olhos fechados)
- Gamificação de cupom/urgência **não passa em cliente regulado** (saúde/CFP/CFO).
- Roleta e "comprou-girou-ganhou" precisam de **regulamento claro** e limite por CPF;
  sorteio de prêmio físico pode virar promoção comercial regulada — desconto % no
  próprio site normalmente não, mas confira por cliente.
- Frete grátis "para todo o Brasil" só se a conta de logística fechar — é promessa.
