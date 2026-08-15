# Biblioteca de inspirações — padrões de componente e interação

> Criada em 14/08/2026 (Ponto 3b da evolução do sistema de design). O nível que
> faltava entre o teardown de página inteira e o snippet de código.

---

## O que é, e o que não é

Três camadas cuidam de coisas diferentes:

| Camada | Guarda | Onde |
|---|---|---|
| **Teardown** | site **inteiro** (estrutura, ordem, copy, cor) | `referencias/` |
| **Inspiração** (aqui) | um **padrão isolado**: um hero, um card, uma interação, um objeto que se move | `_biblioteca/inspiracoes/` |
| **Snippet** | o **código** vanilla pronto pra colar | `_biblioteca/motion/snippets/` |

A inspiração descreve *o padrão e por que ele marca*; o snippet entrega *como fazer*.
Quando a ficha é de animação, ela **aponta pro snippet** em vez de repetir código.

Por que separado de `referencias/`: teardown é a página toda, filed por site. Aqui é
o componente, filed por **função** — porque o "grãos de café caindo no hero" que nasce
num cliente de café serve de inspiração pra qualquer marca artesanal. **Fonte por
cliente, prateleira por função.** É o que faz a biblioteca cruzar, em vez de virar
espelho das pastas de cliente.

---

## Como está organizada

Uma pasta por **tipo de padrão**. A ficha entra na pasta do que ela *é*, não do site
de onde veio (o site vira uma tag dentro da ficha).

```
hero/          → tratamentos de primeira dobra
navegacao/     → menu, header, índice, sumário de capítulos
card/          → card de produto, serviço, case, preço
secao/         → padrões de seção interna (comparativo, timeline, bento, prova)
interacao/     → hover, cursor, drag, scroll-reveal, estado
transicao/     → entre páginas, entre estados, load, "update" de versão
objeto-motion/ → objeto que se move ou se monta (produto explodido, grão caindo,
                 líquido, partícula) — o que o Marcelo mais pediu pra guardar
```

---

## Como catalogar

1. Achou um padrão que marca (num teardown, num site do Marcelo, num que você viu) →
   ficha nova na pasta do tipo, seguindo `_gabarito.md`.
2. O nome do arquivo é `<slug-do-padrão>.md` (ex: `produto-explodido-scroll.md`), não
   o nome do site. Vários sites podem alimentar a mesma pasta.
3. Se o padrão é animação e dá pra vendorizar o código, criar/apontar o snippet em
   `_biblioteca/motion/snippets/` e **linkar** na ficha.
4. Toda animação obedece `_memoria/design/60-motion.md`: guard de `prefers-reduced-motion`,
   teto por página, e a trava de compliance em cliente regulado. Ficha de motion que
   ignora isso é armadilha, não inspiração.

## O que NÃO fazer

- **Não virar galeria morta.** Ficha sem "onde cabe" preenchido é print bonito que
  ninguém reencontra. Se não dá pra dizer em que peça isso serviria, não entra.
- **Não copiar aparência.** O que se reaproveita é a *decisão e o mecanismo*, igual
  no teardown. Clonar o visual de um site premiado no cliente errado é o antipadrão
  que a `/estudar-site` já combate.
- **Não marcar valor aparente como medido.** Hex e fonte lidos de um print são
  *aparentes*, marcados como tal (mesma regra da `/estudar-site`).
