# Inspiração: home-como-seletor de produto (bifurcação na porta)

- **Tipo:** hero
- **De onde:** Fiomet — https://fiomet.com/
- **Segmento de origem:** dispositivos médicos (marca-guarda-chuva com dois
  produtos de públicos opostos: vestível esportivo × órtese craniana infantil)
- **Visto em:** 14/08/2026
- **Teardown irmão:** `referencias/fiomet.md`

---

## O que é

A home inteira é uma **tela única de seleção**, não uma landing. No centro, o
produto ativo renderizado (3D) dentro de um anel de acento, com o nome sobreposto e
um botão `SELECT`. Ao lado, o preview do próximo produto num círculo menor, mais
bolinhas de carrossel. O único texto de conteúdo é o rótulo `CHOOSE A PRODUCT` e
**uma frase** por produto. A pessoa não lê um discurso — ela escolhe um trilho e o
argumento de venda só começa depois do clique.

## Por que marca

Resolve na **porta** o conflito de servir dois públicos disjuntos com a mesma marca.
Uma home que tenta falar com atleta e com mãe de bebê ao mesmo tempo dilui os dois;
transformá-la num seletor faz cada um ver só a mensagem dele, depois do `SELECT`. O
olho não tem para onde fugir: um acento único (amarelo) marca só o produto ativo e a
ação, e o anel diferencia ativo de preview — a cor faz trabalho de **estado**, não de
enfeite. É contenção que vira arquitetura: o site ganha força por quanto consegue
**não** dizer na primeira tela.

## Como recriar

- Carrossel horizontal de N produtos; item central grande, laterais menores e
  esmaecidas (escala + opacidade + anel apagado). Um botão de ação por item.
- O "hero" de cada slide é o **produto renderizado** (imagem PNG com fundo removido,
  ou canvas 3D), não foto de estilo de vida — evita imagem falseável e deixa o objeto
  carregar a tela.
- Acento único reservado a: anel do ativo, wordmark, contorno do botão. Resto em
  escala de cinza.
- **Biblioteca detectada:** não confirmada no scrape. O anel girando + troca de slide
  é reproduzível em **CSS puro + JS de carrossel**; se houver render 3D girando de
  verdade, é three.js/WebGL. Não assumir — o print não prova motion.
- **Snippet:** não vendorizado. Se virar peça real, o carrossel de escala+opacidade
  cabe em CSS; ver `_biblioteca/motion/` antes de puxar three.js só por causa disso.
- **Custo honesto:** a versão CSS é barata. A tentação cara é modelar 3D de cada
  produto; para a Horus, PNG com fundo removido entrega 90% do efeito por 5% do custo.

## Onde cabe

Qualquer cliente da casa com **dois ou mais públicos genuinamente disjuntos** sob uma
só marca — o seletor na porta manda cada um para o trilho certo antes de qualquer copy.
Encaixe mais forte do roster:

- **Permita-se Fitness (cliente #2) — o caso quase perfeito.** Estúdio multi-modalidade
  com públicos que quase não se cruzam: hidroginástica (idosos), boxe, zumba, pilates,
  ballet kids (mães), nutricionista. Uma home que tenta falar com todos ao mesmo tempo
  dilui os seis; o seletor manda cada perfil para a modalidade dele antes de qualquer discurso.
- **Aion Psicologia (cliente #3):** seis serviços distintos (atendimento, neuropsicologia,
  orientação familiar/profissional, grupo parental). Serve para bifurcar por serviço/público,
  desde que a copy fique informativa (compliance CFP trava o resto).
- **Clientes futuros de marca guarda-chuva** — qualquer negócio de segmento ainda desconhecido
  que sirva linhas ou públicos separados sob um só nome.

Só vale quando os públicos não se sobrepõem; para **produto ou serviço único** vira clique
supérfluo — é o caso do Grão da Serra (um café), onde o seletor não teria o que bifurcar.
A parte sempre reutilizável, mesmo em cliente de oferta única, é a **frase-única por trilho**
(categoria + público explícito + função, sem promessa) — modelo direto de copy sóbria para
Dr. Giovanni e Aion, onde compliance proíbe o resto.

## Cuidado

- **Contraste:** o texto de descrição do Fiomet é cinza sobre carvão, contraste baixo
  — reprovaria no `/verificar` (`low-contrast`) e nos pisos de
  `_memoria/conteudo/10-legibilidade.md`. Recriar com contraste, não copiar o
  sussurro.
- **`prefers-reduced-motion`:** se houver anel girando ou troca animada, obrigar o
  guard (`_memoria/design/60-motion.md`).
- **Compliance:** a frase-única não pode virar promessa ("resultado garantido",
  "cura"). Em regulado, categoria e função, nunca efeito prometido.
- **Aparente vs medido:** cores e fonte do print são aparentes; só `Exo` e o amarelo
  `#FFFF00` saíram do branding. Não copiar hex como se fossem medidos.
