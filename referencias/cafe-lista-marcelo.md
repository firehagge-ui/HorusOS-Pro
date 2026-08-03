# Teardown: a lista de café do Marcelo (consolidado)

- **Origem:** `clientes/grao-da-serra/Referencias Grão-da-serra/` — 7 links + 11 prints
- **Segmento:** café, quase tudo B2C, e-commerce e cafeteria, internacional
- **Estudado em:** 30/07/2026
- **Contexto:** escolhas do Marcelo para o cliente #4. Consolidado num arquivo só
  porque o valor está no **padrão comum**, não em cada site isolado.

> ⚠️ **A ressalva que atravessa tudo:** essas referências ensinam **linguagem
> visual**. Nenhuma delas precisa convencer um dono de padaria a virar revendedor,
> que é o trabalho do site do cliente #4. A estrutura veio dos concorrentes B2B
> (`arbor-cafe.md`, `fazenda-sao-gabriel-atacado.md`); daqui veio o **acabamento**.

---

## O que copiar

### ⭐ O hero é CENTRADO. Nenhuma delas usa texto-esquerda / imagem-direita

Renderizadas em 30/07/2026, e as três convergem:

| Site | Hero |
|---|---|
| **Maison Deuza** | nome da marca gigante, **centralizado sobre** a imagem em full-bleed |
| **Greydient** | imagem cobrindo a tela inteira, título gigante sobreposto no rodapé |
| **White Coffee** | título gigante **centralizado**, três linhas em caixa alta, imagem só **depois** |

**Por que importa:** "texto à esquerda, imagem à direita num card com canto
arredondado" é o layout de hero mais reproduzido que existe, e é o reflexo padrão
de quem gera interface. Nenhuma referência escolhida pelo Marcelo faz isso.

O que as três têm em comum é **hierarquia por escala, não por posição**: o título é
tão grande que não precisa de metade da tela reservada para ele.

**Aplicado:** o hero do Grão da Serra foi refeito em 30/07 nesse padrão. A foto
virou fundo em full-bleed com sobreposição escura (`rgba(61,33,21,.62)` a `.90`,
para o texto passar em contraste), e título, subtítulo, botões e selos ficaram
centrados numa coluna de 940px. A versão anterior era exatamente o layout que
nenhuma referência usa.

### ⭐ O corpo da página, seção por seção (White Coffee, home completa)

Renderizada inteira em 30/07/2026. A estrutura abaixo do hero:

1. **Par de fotos coladas**, sem gap entre elas, centralizado, sobre fundo escuro
2. **Produtos:** cabeçalho centrado, depois grid de 3 colunas. A **foto domina** e
   o texto embaixo é mínimo: nome em caixa alta pequena, uma linha de descrição de
   sabor, e o **preço alinhado à direita**. Sem card, sem moldura, sem padding em
   volta da imagem
3. **Colagem assimétrica:** imagens de tamanhos diferentes, fora de alinhamento,
   uma grande ao centro e menores deslocadas em volta, sobre fundo escuro. Serve de
   respiro entre blocos de texto. O Deuza faz igual
4. Fecho com título gigante em caixa alta e texto curto centrado

**O padrão que atravessa tudo:** **cabeçalho de seção sempre centrado**, corpo
variando de seção para seção. É isso que dá ritmo sem virar template: a entrada de
cada bloco é previsível, o miolo não.

⚠️ **Uma coisa deles que NÃO copiei:** o White abre eyebrow em toda seção. A regra
da casa é **um a cada três** (`00-anatomia.md`), porque eyebrow em tudo é o que cria
cara de template. No Grão da Serra ficou em 3 de 9 seções.

**Aplicado no Grão da Serra (30/07):** cabeçalho `.sec-head` centrado em todas as
seções, produtos refeitos no padrão foto-dominante com preço à direita, e a faixa
de paisagem em barra virou **colagem assimétrica** de quatro imagens.

### Título display gigante

Dado medido, não impressão:

| Site | h1 | corpo |
|---|---|---|
| Maison Deuza | **199px** | 15px |
| Wake Up Coffee | **114px** | 18px |

**Por que funciona:** o contraste extremo entre título e corpo é o que separa
página com direção de arte de página de construtor. Comparar com o homônimo do
cliente, que tem h1 de **18px** e corpo de 12px: é o mesmo segmento, e a diferença
de sensação vem quase inteira daí.

### Zero sombra

Maison Deuza: botão `shadow: none`, input `shadow: none` e `border-radius: 0`.
Wake Up: botão `shadow: none`.

**Por que funciona:** sombra em botão é o vocabulário de 2014 e um dos sinais mais
rápidos de template. As duas referências que o Marcelo escolheu abriram mão dela.

### Botão escuro sobre fundo claro, em cor chapada

Maison Deuza: fundo `#191512`, texto `#BDB2A7`, raio 8px.

**Por que funciona:** cor sólida, alto contraste, sem gradiente e sem brilho. Vale
diretamente contra a tentação de imitar o metálico da logo do cliente #4 nos
botões.

### O verde aparece como acento discreto

Maison Deuza usa `#327550` **só em link**, dentro de uma paleta de bege, terracota
e quase-preto.

**Por que funciona:** é exatamente a dose que o Nelson autorizou ("coisa pouca").
Confirma que verde em café funciona como acento, não como cor dominante.

### ⭐ A narrativa em capítulos (print do La Boheme Café)

O print mostra a home organizada como história: `CHAPTER #1 PLANTATIONS`,
`CHAPTER #2 HARVESTING`, `CHAPTER #3 PROCESSING`, alternando seção full-bleed com
foto e seção clara.

**Por que funciona:** transforma processo em conteúdo, e dá ao visitante um motivo
para rolar que não é insistência. **É a origem direta da seção-assinatura do
cliente #4** (o beneficiamento em quatro tempos).

⚠️ **Com uma inversão obrigatória:** o La Boheme começa em *plantations* e
*harvesting*. O cliente #4 **não planta e não colhe**. A narrativa dele começa
exatamente onde a do La Boheme já está no capítulo três.

### ⭐ O padrão kicker + título (print do site russo, `image copy 10.png`)

Fundo marrom quase preto, texto creme e dourado, e cada seção abrindo com um
**rótulo pequeno** ("О нас", "Миссия", "Отзывы") seguido de título grande.

**Por que funciona:** é o ritmo que sustenta uma página escura e longa sem cansar.
E é a referência mais próxima da paleta real do cliente #4 — prova que o caminho
escuro + dourado funciona bem quando a fotografia carrega o peso.

⚠️ Usar kicker em **todas** as seções é o que cria cara de template. A regra da
casa é um a cada três (`00-anatomia.md`).

### Verde escuro + creme funciona em café (print do Trieste)

Brand board com verde-mata profundo, creme e terracota, e folha de café real como
elemento gráfico.

⚠️ **Não transferível como paleta**, porque no Trieste o verde é dominante e o
cliente #4 pediu "coisa pouca". O que se transfere é a **folha real como
elemento**, e a confirmação de que o par creme + verde não briga.

---

## O que não copiar

**A alegação de saúde** do print `image copy 5.png`: *"the caffeine content in
this drink can accelerate metabolism and help burn fat in the body"*. É exatamente
o tipo de frase que a Horus não escreve em cliente de alimento.

**"Scroll to discover"** no fim do hero do La Boheme. Já está listado em
`_memoria/design/90-antipadroes.md` como decoração que finge intenção.

**A estética clara com sans pesada e acento coral** do `image copy 5.png`. É bonita
e é o oposto da marca do cliente #4, que é escura, serifada e dourada. Referência
de gosto não é referência de marca.

**O e-commerce.** Quase toda a lista tem carrinho e checkout. O site do cliente #4
é **institucional**, e a decisão já está tomada.

---

## Aplicado onde

**Café Grão da Serra (cliente #4)**, em `clientes/grao-da-serra/site/ARQUITETURA.md`:

- Narrativa em capítulos → **seção-assinatura** do beneficiamento em 4 tempos
- Kicker + título → ritmo das seções, limitado a 3 das 9
- Display gigante e zero sombra → direção tipográfica
- Verde como acento discreto → `#8A9A5B`, com regra de dose em `marca.md`
