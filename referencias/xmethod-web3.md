# Teardown: Xmethod Web3

- **URL:** https://web3.xmethod.de/ (âncora `#about`)
- **Segmento:** agência de UX/UI e desenvolvimento (Web3, DeFi, cripto). Alemanha
- **Estudado em:** 25/08/2026
- **Nota:** 7/10
- **Contexto:** o Marcelo mandou como referência de três coisas do site da Hórus, e só
  dessas três: a seção de chamada acima do rodapé, o rodapé e a divisão do cabeçalho
  (links à esquerda, botão à direita)

---

## Estrutura, na ordem

1. Hero de tela cheia, título em caixa alta gigante sobre preto, com arte 3D
2. Esteira de logotipos de tecnologia, em marquee
3. "From Design to Development" — bloco de promessa, com arte
4. Serviços em abas (Analytics / UX-UI / Development)
5. Portfólio em grade de oito cases
6. Processos e gestão, quatro passos numerados `[01]`..`[04]`
7. Números (4 métricas com arte por cima de cada uma)
8. **Chamada final**, dentro de um painel
9. Rodapé

Comparado com `_memoria/design/00-anatomia.md`: não tem "para quem é", não tem FAQ e
não tem prova social escrita. O peso da prova está todo no portfólio e nos números.

---

## O que copiar

### A chamada acima do rodapé: painel, título gigante centralizado, um botão

- **Como é feito.** A seção inteira mora num painel escuro recuado das bordas (não é
  faixa de ponta a ponta). Dentro dele, na vertical: arte 3D pequena, título em caixa
  alta ocupando quase toda a largura do painel (~80px, três a quatro vezes o corpo),
  uma linha curta de apoio e um botão. Tudo centralizado no eixo. Nenhum fio separando
  do rodapé: o que separa é o painel acabar.
- **Por que funciona.** É a última coisa antes do rodapé, e a página inteira até ali é
  alinhada à esquerda. Centralizar UMA vez, no fim, faz a seção parar de ser mais uma
  faixa e virar um endereço. O olho não tem para onde correr: título, botão, fim.
- **Copy:** "Let's do projects together!" e "Share your goals with us — and let's create
  something that makes an impact". Convite, não venda. Não repete o serviço, não repete
  a promessa do hero, e o rótulo do botão é o mesmo do cabeçalho ("Contact us").

### O rodapé enxuto de três linhas

- **Como é feito.** Linha 1: o e-mail em escala de título (~40px, o maior texto do
  rodapé) à esquerda, e um único link à direita. Fio. Linha 2: as redes distribuídas em
  quatro colunas iguais, cada uma só com o nome e uma seta ↗. Linha 3: o dado legal
  miúdo à esquerda e o logotipo à direita. Não há coluna de navegação nem de serviços.
- **Por que funciona.** Quem chega ao rodapé de um site de uma página só já passou por
  tudo: repetir o menu ali é ocupar espaço com o que a pessoa acabou de recusar. O que
  falta a ela é **como falar com você**, e é isso que ganha a escala de título. O rodapé
  vira um cartão de visita, não um mapa do site.
- **O e-mail em escala de título é a decisão forte.** Ele não é rotulado ("E-mail:
  ..."), é só o endereço, grande. O formato do dado já diz o que ele é.

### Cabeçalho: identidade e navegação juntas à esquerda, ação sozinha à direita

- **Como é feito.** Barra flutuante. Logo à esquerda; os links (About us, Processes,
  Portfolio, Our stats) começam logo em seguida, ainda na metade esquerda, com espaço
  miúdo entre eles; e o botão "Contact us" vai para a extrema direita, isolado por um
  vão grande e vazio.
- **Por que funciona.** O vão é o que faz o botão ser ação e não mais um item de menu.
  Quando o botão fica colado nos links (que era o caso da Hórus), ele lê como o quinto
  link, só que pintado. O olho ocidental varre da esquerda para a direita: navegação no
  começo do percurso, decisão no fim dele.
- **O botão do cabeçalho é retangular** (raio ~4px), branco chapado, com o rótulo à
  esquerda e a seta ↗ num quadrado próprio à direita, separado por um fio vertical.
  Nada de pílula.

---

## Tipografia e cor

- Título: Outfit; corpo: Manrope. Título ~80px, corpo ~14px. Contraste de escala
  altíssimo (5x), que é o que sustenta uma página quase sem cor
- Fundo `#000000` puro, texto branco. O acento não é cor de CSS: é a **arte 3D** em
  rosa e roxo, que aparece em cinco pontos da página. Fora dela, a página é preto e
  branco
- Raio: `0px` nas superfícies, `4px` nos botões. Quadrado é a assinatura de forma do site

---

## O que não copiar

- **Os números batem de frente com o texto.** "2+ MVP launched", "0-3 months",
  "1+ people in the team" e "€ 600" ficam contra a copy que promete 60+ MVPs e 30+
  pessoas: os contadores animam de baixo para cima e o print pega o meio da contagem.
  Número que só existe depois da animação é número que não existe para quem tira print,
  para quem tem movimento reduzido ligado, e para o leitor de tela
- **A âncora `#about` não leva a lugar nenhum** com nome de "sobre": cai no bloco de
  promessa. Menu que mente sobre o destino queima confiança barato
- Título de chamada final em caixa alta a 80px é decisão de site em inglês. Em
  português, com palavra acentuada e mais longa, a mesma escala estoura em três linhas

---

## Aplicado onde

Site institucional da Hórus, 25/08/2026, nas três frentes: chamada final centralizada
com título e um botão só (sem subtítulo, decisão do Marcelo, mais enxuta que a do
Xmethod); rodapé reduzido a contato + redes + legal, com o e-mail e o WhatsApp sem
rótulo; e cabeçalho com marca e links à esquerda e o botão isolado à direita.
