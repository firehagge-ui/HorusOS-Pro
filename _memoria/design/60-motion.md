# Motion: quando o site deixa de ser bonito e começa a ser vivo

> O que separa o site que trava no Pinterest do nosso não é o stack — é
> **movimento** e o **estudo da referência**. Os dois se aprendem. Este arquivo é
> o primeiro.
>
> Doutrina viva, mesma regra do `90-antipadroes.md`: **toda correção de motion do
> Marcelo entra aqui, com o porquê.** Sem o porquê a regra vira superstição.
>
> Ordem de leitura: a régua primeiro (quando o movimento se paga), o arsenal
> depois (com o que fazer), os antipadrões por último (o que denuncia motion de IA).

---

## A régua: movimento se paga ou sai

O erro caro não é site parado. É site que se mexe sem motivo. Cada animação tem
que responder **sim** a uma destas antes de existir:

- **Guia o olho?** (revela a hierarquia na ordem em que a pessoa deve ler)
- **Dá resposta?** (o clique, o hover, o envio confirmam que algo aconteceu)
- **Constrói a marca?** (o grão que cai, a luz que acompanha a palavra — é a
  assinatura da página se movendo)

Se a resposta é "fica mais dinâmico", isso não é motivo, é reflexo. Corta.

> **O teste do Marcelo, adaptado do passe duplo:** eu poria essa mesma animação em
> qualquer site desse segmento? Se sim, ela não foi escolhida, foi colada. O
> movimento genérico é pior que a ausência dele — parado lê como sóbrio, mexido à
> toa lê como template.

### Teto por página

- **1 assinatura em movimento** por página (o fundo WebGL do hero, OU o objeto que
  atravessa, OU a palavra que brilha — não os três).
- **Entrada progressiva** pode estar em toda seção, desde que sutil (ver piso abaixo).
- Fora isso, cada efeito extra tem que justificar o peso que adiciona.

Página que se mexe inteira o tempo todo não impressiona, cansa. O silêncio entre
os movimentos é o que faz o movimento valer.

---

## A régua do conceito-assinatura (o efeito grande, não a micro-animação)

A régua acima decide **cada animação**. Um **conceito** inteiro — o site que simula um
desktop antigo, o hero que é um mundo 3D navegável, a página que se remonta numa
metáfora — é uma decisão maior e mais cara, e passa por quatro perguntas antes de
qualquer linha de código:

1. **O efeito prova a tese, ou só decora?** Teste: se você tira a metáfora, a mensagem
   central muda? Se não muda, é enfeite caro.
2. **O argumento aparece antes do efeito, ou fica escondido atrás de cliques?** Conceito
   que esconde o pitch cobra do visitante um "imposto de confusão" antes de entregar valor.
3. **Tem porta de saída pro apressado?** Quem só quer o telefone e o serviço precisa
   chegar lá sem atravessar a produção inteira.
4. **O produto do cliente é a própria criatividade/conceito?** Portfólio, agência e
   estúdio podem gastar nisso (o meio prova a mensagem). Saúde, café, fitness não — lá o
   conceito compete com a informação que a pessoa veio buscar.

Qualquer "não" = firula, não assinatura: adiciona custo de build e taxa de rejeição sem
provar nada sobre o produto. **Em cliente regulado, um "não" é veto**, e soma à trava de
compliance logo abaixo.

→ *Origem: teardown do Robby Yeager (portfólio que "atualiza de 1996 pra 2026"),
14/08/2026. Excelente no dono certo, desastre no cliente errado. Ver
`referencias/robby-yeager.md`.*

---

## A trava de compliance (vence tudo abaixo dela)

O motion herda a mesma ordem de precedência do resto da casa. Cliente regulado
**derruba** o arsenal:

- **Odonto (CFO) / Psicologia (CFP):** sobriedade é exigência legal, não gosto.
  Nada de fundo WebGL chamativo, contador animado de "pacientes felizes",
  superlativo que aparece com brilho, ou qualquer coisa que soe a promessa/uau.
  Nesses clientes o motion se limita a **entrada suave e scroll suave** — o que dá
  requinte sem gritar. Ver as travas de cada um no `CLAUDE.md`.
- **Grão da Serra, Permita-se (não regulados):** liberdade pra ir com tudo. É aqui
  que o arsenal completo entra. (Grão da Serra ainda tem a trava de origem: sem
  cafezal falso, então o fundo/objeto usa grão torrado, xícara, torra — nunca
  lavoura.)
- **Site da própria Hórus:** a vitrine. É onde o motion mais se paga, porque o
  produto sendo vendido é a nossa capacidade de fazer isso.

Na dúvida entre "mais impressionante" e compliance, **compliance vence.**

---

## O arsenal (o que está vendorizado em `_biblioteca/motion/`)

Tudo aqui é **vanilla**, grátis, auto-hospedado no repo — funciona em qualquer
`index.html` sem build, sem npm, sem React. Casa com o que a gente já entrega.

### GSAP (completo, 100% grátis desde abril/2025)

O motor. O Webflow liberou a biblioteca inteira, inclusive os plugins que eram
pagos. É o que os sites do Pinterest usam por baixo.

| Plugin | Serve pra |
|---|---|
| **core** | qualquer transição controlada (opacidade, posição, escala) |
| **ScrollTrigger** | animar conforme a pessoa rola: revelar, fixar (`pin`), acompanhar o scroll (`scrub`), parallax |
| **SplitText** | revelar título letra por letra ou palavra por palavra (acessibilidade embutida na versão nova) |
| **DrawSVG** | traço que se desenha (uma seta, um contorno de xícara, uma assinatura) |
| **MorphSVG** | uma forma virar outra (o grão vira a letra, o ícone vira outro) |

### Lenis — scroll suave

O detalhe que mais entrega "site caro" com menos esforço. ~3kb. Casa com o
ScrollTrigger. **Respeita `prefers-reduced-motion` (desliga sozinho).**

### Vanta.js — fundo 3D animado que reage ao mouse

Aplica um fundo WebGL (névoa, ondas, rede de pontos, topografia) em qualquer
`<div>`. Vanilla. Bom pro hero de cliente não-regulado e da Hórus.

### Unicorn Studio — WebGL "de designer", sem escrever shader

Quando o Vanta não dá o visual certo. Você monta o efeito visualmente no site
deles (35+ efeitos, 36kb) e embeda. Mais controle estético que o Vanta, ainda
leve. Reservar pro hero que precisa ser assinatura.

### Rive / Lottie — objeto ilustrado que se move

Pro "grão de café que cai", "seta que aponta", "ícone que respira". **Prefira isto
a vídeo:** pesa uma fração e não estoura o carregamento. Vídeo só quando um loop
curto realmente se paga (raramente em fundo de site).

---

## O catálogo de movimentos (o que usar em cada situação)

Cada padrão tem um snippet documentado em `_biblioteca/motion/snippets/`.

| A seção precisa de... | O movimento | Ferramenta |
|---|---|---|
| Aparecer conforme rola | entrada em fade + subida sutil, em cascata | ScrollTrigger |
| Título com peso | revelar palavra por palavra | SplitText |
| Profundidade no hero | parallax (fundo mais lento que o texto) | ScrollTrigger `scrub` |
| Prender atenção numa etapa | fixar a seção enquanto o conteúdo troca | ScrollTrigger `pin` |
| Fundo vivo | WebGL reativo ao mouse | Vanta / Unicorn |
| Luz acompanhando palavra | brilho/gradiente que segue o texto | CSS + GSAP |
| Objeto que atravessa a página | grão, seta, ilustração em movimento | Rive/Lottie + ScrollTrigger |
| Número que sobe | contador (⚠️ nunca em cliente regulado) | GSAP |

---

## As regras duras (não são gosto, são obrigação)

- **`prefers-reduced-motion` sempre.** Quem ligou "reduzir movimento" no sistema
  tem condição vestibular, enxaqueca ou preferência — o site respeita. Todo
  snippet já vem com o guard. Motion sem isso é falha de acessibilidade, entra na
  mesma régua do `low-contrast` do detector: se corrige, não se dispensa.
- **Orçamento de performance.** O movimento não pode travar o scroll no celular.
  Animar só `transform` e `opacity` (a GPU dá conta); nunca `width`, `height`,
  `top`, `left` em animação contínua. Fundo WebGL pesado desliga no mobile se
  comer o carregamento.
- **Entrada progressiva com piso.** O fade-in de seção é sutil: ~400-600ms,
  deslocamento de no máximo ~24px. Mais lento que isso a pessoa espera o site
  "carregar"; mais brusco vira pulo.
- **Nada esconde conteúdo até rolar sem fallback.** Se o JS falhar, o texto tem
  que estar visível. Animação é enfeite por cima de conteúdo que já existe, nunca
  a condição pra ele aparecer.

---

## Antipadrões de motion (o que denuncia site animado por IA)

> Mesma lógica dos antipadrões de layout: os de cima são os que mais aparecem.

**Tudo entra deslizando ao mesmo tempo.** O AOS (animate-on-scroll) clássico:
cada bloco chega com o mesmo fade-up genérico. É o "cara de template 2020". Se
todo elemento entra igual, nenhum tem hierarquia. Escolher **o que** se move e o
que fica parado é o trabalho.

**Scroll sequestrado.** Rolar e o site decidir por você pra onde vai, quanto anda,
travando a rolagem natural. Impressiona no primeiro segundo, irrita no terceiro.
Scroll suave (Lenis) é o oposto disso: ajuda a rolagem, não a rouba.

**Contador que sobe sem motivo.** "+500 clientes" subindo de 0 é o clichê nº 1 de
site vendedor genérico — e em cliente regulado é infração. Só usar com número real
e quando o número for o argumento.

**Parallax em tudo.** Profundidade é tempero. Página inteira com camadas se
mexendo em velocidades diferentes vira enjoo, não sofisticação.

**Fundo WebGL que não tem nada a ver com a marca.** Partícula genérica flutuando
atrás de tudo é o "cara de IA" da era WebGL. O fundo tem que dizer algo do
cliente (grão, vapor, textura de papel) ou não estar ali.

**Movimento que atrapalha a leitura.** Texto que treme, brilha ou se remonta
enquanto a pessoa tenta ler. O movimento acontece na **chegada** do elemento e
depois ele descansa. Nada de loop infinito em cima de texto de leitura.

---

## Como uma correção entra aqui

Igual ao resto da casa: o Marcelo corrige algo de movimento no chat, e a correção
vira **linha neste arquivo com o porquê junto**, na seção certa (régua, arsenal ou
antipadrão). Correção que morre no chat volta como erro no próximo site — eu não
guardo nada entre conversas, só o que está em arquivo.

→ *Arquivo criado em 10/08/2026, a partir da conversa sobre montar um arsenal
visual pro workflow. Stack escolhido: vanilla + GSAP + Lenis + WebGL, em vez de
migrar pra Astro/React. Motivo: teto de qualidade mais alto e visual mais autoral,
sem virar projeto de build por cliente. Astro fica reservado pra quando um cliente
pagar um site que justifique.*
