# Espaço de eventos, três sites (Casa Salvatore, Casa Cloc, Casa de Stella)

> Primeiro acervo de espaço de eventos da casa. Estudado em 23/09/2026 para o protótipo
> da **Casa Verona** (lead, mini weddings, Pituba/Salvador), mas serve qualquer espaço de
> evento, buffet ou casa de festa futura. Os três são os concorrentes diretos que o
> dossiê de prospecção levantou no Google Maps (Salvatore 4,7 com 1.546 avaliações,
> Cloc 4,8 com 295, Stella 4,6 com 245), e os três têm site próprio, o que a Casa Verona
> não tem. Fonte: print de página inteira (Playwright, 1440px) + páginas internas via
> Firecrawl (`/estrutura` e `/faca-seu-evento` da Salvatore).

---

## Os três, em uma linha

| Site | O que é | Nota | Lição principal |
|---|---|---|---|
| **Casa Salvatore** (casasalvatore.com.br) | Casa grande multiuso, Cabula, social + corporativo | 6 | **A única que organiza a estrutura como ficha por salão:** "Espaço Supreme, de 100 até 1000 convidados", "Espaço Prime, de 50 até 250", pé direito, m² de foyer, camarins, docas de gerador, e o formato de montagem (plenária, coquetel, casamento). E o **formulário em etapas** que pergunta tipo de evento, depois data e número de pessoas. Home é um carrossel com "selecione o seu perfil: social / corporativo" |
| **Casa Cloc Cerimonial** (casacloc.com.br) | Espaço envidraçado com vista pra Baía, Dois de Julho | 4 | **Contraexemplo de execução.** O hero é um pôr do sol no mar, não o espaço. A estrutura vira lista de infraestrutura crua ("Toalete Masculino / Bancada Com 06 Cubas, 07 Box e 04 Mictórios"). O bloco "Tour 360" está **quebrado na home** (aparece o código `[ipanorama id="113"]`). Copyright 2018. Mas diz a capacidade na primeira frase útil: **"público de até 450 pessoas"** |
| **Casa de Stella** (casadestella.com.br) | Casa com jardim, piscina e boate, Stella Maris | 6 | **A régua de viabilidade no fim da página:** lista de estrutura que fecha com "Capacidade para **250** convidados · Área total de **1.400m²**". Quatro tipos de evento com ícone (casamentos, formaturas, aniversários, empresariais), mosaico de fotos, formulário de **orçamento** com tipo de evento e número de convidados. Fonte cursiva "Sua Festa é Aqui!", copyright 2019 |

---

## O padrão que se repete (e por quê)

1. **Tipo de evento é a espinha.** Os três separam por ocasião: casamento (com ou sem
   cerimônia no local), aniversário, formatura, corporativo. A Salvatore leva isso ao
   formulário, a Stella leva à faixa de ícones. É a versão deste segmento do "organizar por
   ocasião vence catálogo" da floricultura (`floricultura-tres-sites.md`). Quem chega quer
   saber **se o evento dele cabe ali**, não conhecer a casa em abstrato.

2. **Capacidade é o número que o segmento publica.** Cloc (450), Stella (250), Salvatore
   (por salão, 50 a 1000). É a primeira pergunta de viabilidade de quem procura espaço, e os
   três respondem de graça, antes do contato.

3. **O que os três escondem: preço e pacote.** Nenhum mostra faixa de valor, nenhum mostra
   o que vem incluso. O caminho é sempre "orçamento": o visitante preenche e espera. É o
   achado do `00-anatomia.md` ("a informação que o segmento inteiro esconde") de novo,
   agora num terceiro segmento. No portal Casamentos.com.br, onde a noiva compara, os
   espaços ao lado **mostram** "Aluguel desde R$ 2.500 · 1 a 300" (dossiê de 21/09).

4. **O botão é "orçamento", nunca "visita".** Em espaço de evento a venda fecha na visita
   (a pessoa precisa pisar no lugar), e mesmo assim nenhum dos três oferece marcar visita
   como ação principal. A Casa Verona já usa a palavra certa na bio e nos reels: **"Agende
   sua visita"**.

5. **Os três são sites de 2018 e 2019.** Carrossel no hero, fonte cursiva decorativa,
   mosaico sem legenda, formulário genérico. O segmento local não tem referência de site
   atual; a régua visual sai de fora dele (ver "tempero" abaixo).

---

## O que NÃO copiar

- **Hero que não mostra o espaço** (Cloc: pôr do sol no mar). Em espaço de evento, o espaço
  é o produto. Pela regra "IA/banco nunca no objeto que o cliente vende", foto que não é do
  lugar no hero vale como foto de banco.
- **Lista de infraestrutura crua** (Cloc: cubas, mictórios, freezers de 511 litros). A
  informação é útil, mas escrita pro fornecedor, não pra noiva. A Salvatore mostra a mesma
  coisa organizada por salão e com capacidade: é essa a forma.
- **Bloco quebrado publicado** (Cloc: `[ipanorama id="113"]` na home). É o mesmo defeito do
  "template reciclado que vaza" (`90-antipadroes.md`): ninguém olhou o site depois de
  publicar.
- **Carrossel com slogans soltos** (Salvatore: "criando memórias inesquecíveis",
  "transformamos seu evento em uma experiência"). É verbo de folheto e serve pra qualquer casa.
- **Fonte cursiva decorativa em título** (Stella: "Sua Festa é Aqui!", "Sobre Nós"). É a
  convenção do segmento, e é justamente o que faz os três parecerem convite de 2015.
- **Formulário de orçamento como único caminho.** Esconde o que a pessoa quer saber
  (preço, o que inclui) atrás de uma espera.

---

## O que levar para a Casa Verona (e para qualquer espaço de evento)

1. **Tipos de evento com foto real de cada um**, não ícone. A Casa Verona tem post de
   mini wedding, recepção depois da igreja, festa infantil, aniversário, formatura e evento
   de empresa; o concorrente mostra ícone, ela mostra o evento acontecendo.
2. **Ficha da casa com capacidade**, no formato da Salvatore (um bloco escaneável), mas só
   com número confirmado pelo cliente. O que não temos vira `[FALTA]`, e a pergunta vai pra
   reunião.
3. **Pacote com nome e o que inclui**, que é o que nenhum dos três faz. A Casa Verona já tem
   nome de pacote ("Case em Casa") e já publica o que entra (decoração, buffet,
   organização, a partir de 40 convidados). Ela só publica isso em reel.
4. **Formulário em etapas que pergunta tipo, data e convidados** (Salvatore), só que com
   "**visita**" como ação e o **WhatsApp** como destino, e não uma caixa de orçamento que
   ninguém responde.

**Tempero fora do segmento:** a régua de "mostrar o que o segmento esconde" é a mesma do
Arbor (preço público por faixa, `arbor-cafe.md`) e do Soleira (etapas com prazo, em
`portfolio/`). A foto real carregando a cor e a UI como moldura quieta vem da floricultura
premium (`floricultura-tres-sites.md`).
