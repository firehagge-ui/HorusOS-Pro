# Amêndoa Preta, doceria de encomenda (Salvador/BA)

> Projeto conceitual de portfólio. Ver a regra de honestidade em `../README.md`.
> Estudo que sustenta: `referencias/doceria-encomenda-tres-sites.md`.

## O negócio (ficção coerente)

Doceria de encomenda em Salvador, sem loja de rua, que trabalha por agenda: bolo de
festa, docinhos e encomenda corporativa. O nome vem da **amêndoa do cacau**, que é
como se chama a semente do fruto, e a Bahia é terra de cacau. A confeiteira é Dandara
Menezes, sete anos de cozinha, produção na Barra.

---

## O passe duplo

### Passe 1: o plano que saiu de reflexo

```
COR      creme #F4F1EA, terracota, marrom
TIPO     serifa de display + sans humanista
LAYOUT   hero com foto de bolo, grade de 3 cards, sobre, contato
ASSINATURA  "feito com carinho, ingredientes selecionados"
```

### A pergunta: eu chegaria nesse plano em qualquer doceria do Brasil?

**Sim, e com folga.** Creme + serifa + terracota é o visual de IA número 1 do
`90-antipadroes.md`. Os três cards iguais lado a lado também estão lá. E "ingredientes
selecionados" cabe no site de qualquer concorrente sem trocar uma palavra, que é o
teste que reprova adjetivo.

Pior: o plano ignorava o achado do estudo. Os três sites reais do segmento **escondem
prazo, mínimo e área de entrega**, e é exatamente isso que trava a encomenda. Um plano
que não usa o achado da pesquisa não precisava da pesquisa.

### Passe 2: o plano revisado

**A tese:** doceria de encomenda não vende doce, vende **data cumprida**. Quem procura
já tem a festa marcada. A pergunta na cabeça da pessoa é "ainda dá tempo?", e nenhum
concorrente responde.

```
COR
  --papel     #F3EAE0   fundo quente de papel manteiga (não o creme gasto)
  --cacau     #241813   tinta, quase preto com viés marrom
  --cacau-2   #4A3428   texto secundário
  --gema      #C9871B   acento: cor de calda e doce de leite
  --gema-esc  #8A5A0B   degrau escuro do acento, para texto pequeno e link
  --verde     #2E6446   estado "agenda aberta" (semântico, não é acento)
  --vinho     #8E2F2F   estado "agenda fechada" (semântico)

TIPO
  display   Gloock            didone de alto contraste, cara de rótulo de confeitaria
                              antiga. Não é Fraunces nem Instrument (banidas)
  corpo     Libre Franklin    grotesca de leitura, 18px
  dado      IBM Plex Mono     só datas, prazos e etiquetas de agenda (uso legítimo:
                              é dado, não figurino técnico)

LAYOUT (8 seções, 5 famílias de layout, fundo alternado)
  1 HERO          foto sangrando à direita + coluna de texto + PAINEL DE AGENDA
  2 OCASIÕES      coluna única, segunda pessoa, sem ícone
  3 O QUE SAI     3 linhas de produto empilhadas, uma por linha, com faixa de preço,
                  mínimo e prazo em cada
  4 COMO ENCOMENDA 4 passos numerados com o prazo dentro de cada passo
  5 QUEM FAZ      foto de bancada + texto curto, fundo cacau
  6 CALENDÁRIO    as datas do ano com o dia em que a agenda fecha
  7 FAQ           10 perguntas, as constrangedoras primeiro (details nativo)
  8 CONTATO       WhatsApp, área de entrega, retirada

ASSINATURA
  O PAINEL DE AGENDA. A página lê a data do navegador e calcula, ao vivo:
  a próxima data de entrega possível, quantos dias faltam, e a que horas fecha
  o pedido. Aparece no hero e volta na seção 6. Nenhum concorrente tem, e ele
  responde a única pergunta que trava a encomenda.
```

**Wireframe do hero:**

```
┌──────────────────────────────────────────┬──────────────────┐
│ AMÊNDOA PRETA            cardápio  agenda│                  │
├──────────────────────────────────────────┤                  │
│                                          │                  │
│  Bolo de festa feito                     │   foto do bolo   │
│  na semana da festa.                     │   sangrando na   │
│                                          │   borda direita  │
│  Encomenda com 4 dias. Salvador.         │                  │
│                                          │                  │
│  ┌────────────────────────────────────┐  │                  │
│  │ ● AGENDA ABERTA                    │  │                  │
│  │ próxima entrega   SÁB 30 AGO       │  │                  │
│  │ pedido fecha      SEXTA, 12H       │  │                  │
│  │ faltam            1 dia            │  │                  │
│  └────────────────────────────────────┘  │                  │
│                                          │                  │
│  [ Pedir pelo WhatsApp ]  ver o cardápio │                  │
└──────────────────────────────────────────┴──────────────────┘
```

**O que mudou do passe 1 para o 2, e por quê:** saiu a paleta gasta (entrou papel +
cacau + gema, que vem do produto: cacau é a matéria-prima e gema é a cor da calda);
saiu a serifa de reflexo (entrou uma didone, que tem motivo: é a letra de rótulo de
confeitaria antiga); saíram os três cards iguais (viraram três linhas empilhadas com
dado diferente em cada); e a assinatura deixou de ser um adjetivo e virou um mecanismo
que trabalha.

## Motion

Teto de uma assinatura em movimento, e ela é **funcional**: o painel de agenda conta os
dias na chegada da página. Fora isso, entrada em cascata sutil (400ms, 18px) e nada
mais. Sem parallax, sem WebGL: a foto de comida é o show, e movimento em cima de foto
de comida atrapalha o apetite. `prefers-reduced-motion` desliga a contagem e mostra o
número direto.

## Integridade

Marca fictícia, telefone fictício (`(71) 90000-0000`), CNPJ nenhum. Nenhum número de
resultado, nenhum depoimento, nenhum selo de prêmio. Alergênico declarado no FAQ
porque em alimento isso é responsabilidade real, não enfeite.
