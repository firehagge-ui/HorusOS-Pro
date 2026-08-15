# Inspiração: índice de capítulos como navegação ("Ch. 1 The Model…")

- **Tipo:** navegacao
- **De onde:** Pear — https://pear.no/
- **Segmento de origem:** agência de SEO + software, B2B, revenue-share (Oslo)
- **Visto em:** 14/08/2026
- **Teardown irmão:** `referencias/pear.md`

---

## O que é

A navegação da página não usa rótulos genéricos (Serviços, Sobre, Contato). Usa uma
numeração de **capítulos de livro**, cada um com nome curto em serifa itálica:

> **Ch. 1** _The Model_ · **Ch. 2** _The Work_ · **Ch. 3** _The Terms_ · **Ch. 4** _Questions_

O número em sans/peso forte, o nome em serifa itálica. Cada item é âncora pra uma seção
da página única. É ao mesmo tempo o menu e o sumário do argumento.

## Por que marca

Numerar as seções como capítulos impõe uma **ordem de leitura e uma promessa**: existe um
começo, um meio e um fim, um argumento sendo construído — não um menu de itens
desconexos. "Capítulo" sinaliza ao leitor que a página vale ser lida inteira, na ordem. E
o contraste de estilo dentro do próprio item (número técnico + nome editorial em itálico)
já carrega a personalidade da marca antes de qualquer conteúdo. É elemento-assinatura
barato: nenhum concorrente de agência trata a página como livro, então a lembrança gruda.

O mecanismo real: transforma a rolagem numa narrativa com escala visível. O leitor sabe
que está no capítulo 2 de 4, então continua — a mesma força que faz virar página de livro.

## Como recriar

- Lista de âncoras (`<a href="#model">`) com dois spans por item: `.ch` (número, sans,
  peso alto) + `.name` (nome, serifa itálica). Sticky no topo ou fixa numa coluna lateral.
- Estado ativo: destacar o capítulo cuja seção está no viewport — `IntersectionObserver`
  marcando o link correspondente (scroll-spy). Sem lib obrigatória; CSS puro + JS mínimo.
- Cada `id` de seção casa com o `href` do índice; rolagem suave via `scroll-behavior:
  smooth` (respeitar `prefers-reduced-motion`).
- **Biblioteca detectada:** CSS puro + JS de scroll-spy. Nada de GSAP/WebGL necessário
  pra versão base.
- **Snippet:** não vendorizado ainda. É simples o bastante pra escrever na hora; se virar
  recorrente, criar em `_biblioteca/motion/snippets/`.
- **Custo honesto:** baixíssimo. O único cuidado é manter os nomes de capítulo curtos (1
  a 3 palavras) — nome longo quebra a cadência e o layout da nav.

## Onde cabe

Qualquer página de rolagem única que precise **conduzir a leitura na ordem** — o índice
numerado transforma a nav em sumário de um argumento. Encaixe do roster:

- **Site institucional da própria Horus — candidato mais forte.** A página da agência tem
  exatamente o problema que o padrão resolve: contar um argumento (modelo, trabalho, prova,
  condições) sem virar menu genérico de "Serviços/Sobre/Contato". Capítulos numerados dariam
  à Horus a sensação de documento com tese, e um elemento-assinatura que os concorrentes de
  "agência de IA" não têm (ver `referencias/agencias-ia-dez-sites.md`).
- **Icarus** (produto de IA da Horus): a landing do agente conduzindo por o que ele é →
  como funciona → o que resolve → condições, em capítulos.
- **Landing longa de cliente com objeções em sequência:** página de venda de serviço que
  precisa responder muitas dúvidas na ordem — encaixa em Dr. Giovanni (jornada do implante)
  e Aion (por serviço), com os nomes de capítulo em tom sóbrio que o compliance permite.

Adaptar os nomes ao idioma e ao tom do cliente — "Ch. 1" pode virar "01" ou "Parte 1"; o
valor está na numeração + nome curto, não na palavra "chapter". Em site multi-página não há
o que ancorar e o índice vira enfeite.

## Cuidado

- `prefers-reduced-motion`: se usar rolagem suave ou realce animado do item ativo, dar o
  guard.
- Não transplantar a serifa itálica da Pear (Flecha) sem checar a `marca.md` do cliente —
  o padrão é a **estrutura numerada**, não a fonte. Hex/fonte da Pear são do teardown;
  aqui o que se reusa é o mecanismo.
- Só faz sentido em página de rolagem única com seções fortes. Em site multi-página, o
  índice de capítulos não tem o que ancorar e vira enfeite.
