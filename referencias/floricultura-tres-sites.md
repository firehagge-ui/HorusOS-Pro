# Floricultura, três sites (Gisa Flores, FLOWERBX, Bloom & Wild)

> Primeiro acervo de floricultura da casa. Estudado em 27/08/2026 para o site da
> Amparo Flores (cliente #6, Graça/Salvador), mas serve qualquer floricultura
> futura. Um concorrente local direto (Gisa) e dois florais premium internacionais
> fortes em UX e editorial (FLOWERBX/Londres, Bloom & Wild/UK). Fonte: scrape via
> Firecrawl + Awwwards (busca "florist website of the day").

---

## Os três, em uma linha

| Site | O que é | Nota | Lição principal |
|---|---|---|---|
| **Gisa Flores** (gisaflores.com.br) | E-commerce local, "nº 1 de Salvador", 90 min | 5 | **Contraexemplo de estrutura.** 15 grids empilhados, catálogo puro, superlativo, zero história e zero coroa/velório visível. Vantagem é escala e velocidade, não a peça |
| **FLOWERBX** (flowerbx.com) | Florista de luxo de Londres, editorial | 9 | A **foto do produto sobre fundo branco carrega 100% da cor**; a interface some. História da fundadora + clientes (Gucci, Chanel). Sympathy é categoria própria |
| **Bloom & Wild** (bloomandwild.com) | Flor por assinatura/correio, UK, B-corp | 9 | **Confiança mostrada, não afirmada** (Trustpilot 4,6 de 75 mil no hero) + voz de marca humana ("care wildly", nomeia funcionários). Navegação por ocasião, não por catálogo |

---

## O padrão que se repete nas boas (e por quê)

1. **A foto real é o design.** Os três (e todo award-winner do segmento) deixam a
   flor carregar a cor e mantêm a UI como moldura neutra, branca ou off-white. A
   busca no Awwwards devolve a mesma frase: *"elegant design that stays out of the
   way, putting the spotlight on big, bold photos of beautiful flowers"*. Isso casa
   com a regra de integridade da casa (foto real, nunca stock) e com a `marca.md`
   da Amparo. **Consequência de build:** sem foto real, o site não existe de
   verdade; placeholder marcado enquanto o acervo não chega.

2. **Organizar por OCASIÃO vence organizar por CATÁLOGO.** É a linha que separa a
   Gisa (nota 5) das duas premium (nota 9). Gisa empilha "mais vendidos → girassóis
   → premium → box → cestas → kits → megas": quinze grids, nenhuma narrativa, a
   pessoa se perde. FLOWERBX e Bloom & Wild abrem por momento (aniversário, luto,
   celebração, "just because", corporativo). A pessoa não chega querendo "um buquê",
   chega querendo *resolver uma ocasião*. É o bloco 2 do `00-anatomia.md` ("para
   quem é / quando") aplicado a comércio: a floricultura tem cinco ocasiões de
   receita (balcão, data, luto, corporativo, evento), e elas viram a espinha do site.

3. **Luto/sympathy é SEMPRE categoria separada** — até nos premium. FLOWERBX tem
   "Funeral & Sympathy", Bloom & Wild tem "With sympathy". Confirma a decisão de
   uma **página de coroa própria** na Amparo. E o achado local que vira ouro:
   **a Gisa (líder local) não mostra coroa/velório na home.** Quem busca "coroa de
   flores Salvador" cai nos intermediários nacionais. É a receita que vaza e a que a
   Amparo pode dominar no digital, porque ela produz e o intermediário não.

4. **Confiança se encena.** Bloom & Wild lidera com o selo Trustpilot real no hero.
   A Amparo tem 4,1★ em 41 avaliações reais no Google, mais de 50 anos na Graça, e
   um CNPJ desde 1988. Isso é prova honesta e específica, sem superlativo, e é
   justamente o que o e-commerce nacional não tem: *lugar e tempo*.

5. **Voz de marca humana ganha da voz de loja.** Bloom & Wild escreve em primeira
   pessoa e nomeia gente ("Henry cares wildly that your delivery arrives on time").
   Uma floricultura de família com 50 anos tem uma história real que a Giuliana
   Flores não consegue forjar. É a **assinatura** possível: não competir em
   velocidade nacional, e sim ser *a floricultura da Graça*.

---

## O que NÃO copiar (o contraexemplo da Gisa, e o excesso dos premium)

- **A pilha de grids.** Catálogo empilhado sem hierarquia é o "cara de template" do
  e-commerce. Vale a regra de ritmo do `00-anatomia.md`: pelo menos 4 famílias de
  layout, não a mesma grade quinze vezes.
- **Superlativo.** "A nº 1 de Salvador" da Gisa é o que a casa não escreve (regra de
  alimento/comércio + integridade). A Amparo vende tempo e lugar, não ranking.
- **A maquinaria de e-commerce** (carrinho, checkout, assinatura, login, multi-moeda
  do FLOWERBX). A Amparo é **catálogo → WhatsApp**, não loja com gateway. Copiar a
  navegação de loja traria complexidade que o cliente não precisa e não sustenta.
- **Chrome de urgência importado.** "Entrega em 90 min" só entra se a operação dela
  sustentar (o `CLAUDE.md` do cliente já trava isso).

---

## Como isso vira o site da Amparo (ponte para o plano)

A espinha sai do padrão 2 (ocasião) + assinatura do padrão 5 (a floricultura da
Graça) + a página separada do padrão 3 (luto). A prova vem do padrão 4 (Google real).
A cor vem do padrão 1 (as fotos dela). Detalhe no `PLANO.md` do site.

→ *Pendente de virar linha na tabela do `referencias/README.md` e, se o Marcelo
mandar uma referência de floricultura por Pinterest/print, passar pela
`/estudar-site` e somar aqui.*

---

## Adendo (02/09/2026): anatomia de E-COMMERCE de floricultura

> O Marcelo pediu que o site da Amparo fosse um **e-commerce**, não um institucional
> com catálogo, e mandou 3 lojas reais: Gisa Flores (de novo), **Mirla Flores**
> (mirlaflores.com.br) e **Flores en Brasil** (floresenbrasil.com, rede internacional
> com página de Salvador). Estudadas por scrape (Firecrawl). O que se repete nas três,
> e vira o esqueleto de qualquer loja de flores futura:

1. **Cabeçalho de loja com carrinho contado.** Conta/login + **carrinho** (a Gisa
   chama de "minha cesta") + WhatsApp/ajuda. O contador de itens no ícone é padrão.
2. **Dois eixos de navegação, não um.** Por **categoria** (buquês, rosas, girassóis,
   orquídeas, cestas, caixas, plantas) **e** por **ocasião** (amor, aniversário,
   nascimento, agradecimento, **sympathy/pêsames**, casamento, "just because"). A
   FloresBrasil tem os dois menus separados; a Mirla mistura categoria e data
   (dia dos namorados) na mesma barra.
3. **Filtro por faixa de preço** como atalho de decisão. A Gisa expõe como coleção
   navegável: `até 99 / 99–150 / 150–200 / acima de 200`. É simples e converte, porque
   presente se decide por orçamento.
4. **"Mais vendidos" / best-sellers** como primeira vitrine da home e como filtro.
5. **Card = foto + nome descritivo longo + preço.** "Buquê tradicional com 12 rosas
   vermelhas", "Mega buquê com 100 rosas". Preço sempre visível no card (R$ 199,90).
6. **Página por produto** (cada item tem URL própria) e **carrinho/checkout**. A
   FloresBrasil fecha com pagamento online; a Gisa e a Mirla puxam muito para o
   WhatsApp. Para florista de bairro, **carrinho real + fechamento no WhatsApp** é a
   ponte honesta (sem gateway falso).
7. ⚠️ **O prazo é a arma das três, e é o que a Amparo NÃO copia.** "Entrega em 90 min"
   (Gisa), "same-day / 4 horas" (FloresBrasil), "enviamos no mesmo dia" (Mirla). É o
   gatilho travado no `CLAUDE.md` da Amparo: promessa de prazo que a operação não
   sustenta. A troca honesta: retirada na loja + entrega em Salvador combinada no
   WhatsApp, **sem número de prazo**. A diferença vira até vantagem de sinceridade.

**O que a Amparo herda da própria marca e a distingue dessas três:** todas são
brancas/coloridas e genéricas de layout. A Amparo entra com a **moldura roxa
editorial** (a cor de nascença dela), foto real da banca dela, e a recusa do prazo
falso. Aplicado no site em `clientes/amparo-flores/site/` (home + `loja.html` +
`produto.html` + `carrinho.html` + `luto.html`), motor em `produtos.js`. Ver o
`PLANO.md` do cliente.
