# Inspiração: Ingrediente derramando / produto em corte no herói

- **Tipo:** objeto-motion
- **De onde:** Burrito Madre — https://burritomadre.rs/en/
- **Segmento de origem:** fast-casual mexicano / alimento de alto giro
- **Visto em:** 14/08/2026
- **Teardown irmão:** `referencias/burrito-madre.md`

---

## O que é

Um produto de alimento fotografado **cortado e transbordando**: o burrito aberto ao meio, recheio à mostra, e os ingredientes (arroz, feijão, milho, tomate) **espalhados na superfície como se congelados no instante em que caíram**. Não é o produto contido e simétrico no prato — é o produto no auge do transbordo, ocupando o herói inteiro sob display type gigante. Print (só a primeira dobra): `scratchpad/shots/burrito-madre.png`.

⚠️ **Motion na versão live: não confirmado.** O scrape é estático; há um vídeo curto no topo, mas se os ingredientes de fato *caem/animam* ou é uma foto congelada de derrame, não dá para afirmar do print. O padrão vale nas **duas** formas: como composição estática que *insinua* movimento, ou como micro-animação de queda/parallax. Marcar como aparente até ver a página ao vivo.

## Por que marca

Porque **entrega apetite sem uma palavra de copy**. Três sinais chegam de uma vez: o corte mostra o interior (abundância + variedade), o transbordo diz "cheio demais para caber" (fartura), e as cores vivas dos ingredientes leem "montado agora" (frescor). Comida contida e simétrica lê industrial; comida derramando lê recém-feita e artesanal. É o mecanismo de fome mais barato que existe — não depende de texto, depende de fotografia direcionada e de mostrar o produto no momento errado de propósito (o instante do derrame, que a foto de catálogo evita). O olho conclui "quero isso" antes de o cérebro ler o nome.

## Como recriar

- **Versão estática (recomendada para alimento em geral):** foto direcionada do produto em derrame, recorte com fundo transparente sobre gradiente quente, ingredientes soltos posicionados na base. Peso quase zero. É produção de **foto**, não de código.
- **Versão com motion leve:** os elementos soltos (grãos) entram com um `translateY` curto + fade no load, ou um parallax sutil no scroll (elemento de fundo mais lento que o produto). GSAP ou CSS puro dão conta; não precisa de WebGL nem física.
- **Versão cara (evitar sem motivo):** simulação física de queda (partículas, canvas/WebGL). Bonito, pesado, e desnecessário para o efeito — o derrame *congelado* já entrega o sinal.
- **Biblioteca detectada:** no Burrito Madre, WordPress + Elementor (build custom, `branding` do scrape). O efeito de queda, se houver, é o repertório clássico **GSAP + Lenis**; a versão da Horus **não precisa** de nada disso na forma estática.
- **Snippet:** ainda não vendorizado. Se virar micro-animação, candidato a `_biblioteca/motion/snippets/` (fade+translate de elementos soltos no load). Conferir o arsenal em `_biblioteca/motion/` antes de escrever do zero.
- **Custo honesto:** o custo real não é código, é **fotografia**. Precisa de foto própria do produto do cliente em derrame/corte, bem iluminada. Banco de imagem quebra o padrão (e no Grão, cafezal de banco é vedado por falsear a origem).

## Onde cabe

O padrão "objeto em movimento no herói" — serve **qualquer marca de alimento ou produto
granular** com um "interior" que vende (café, grãos, especiarias, chocolate em pedaço,
massa), sempre com **foto própria do produto do cliente**. É o gênero de peça que a casa
guarda para toda conta de alimento, atual e futura.

- **Grão da Serra (cliente #4) — o exemplo concreto de hoje:** o herói vira **grãos de café
  derramando / caindo**, o **moído transbordando** do filtro, ou o **grão partido em corte**
  mostrando o interior torrado. Dá o mesmo sinal de fartura e frescor que o burrito e —
  diferente de cafezal ou "do pé à xícara" — **não falseia nada**: o diferencial do Nelson é
  a escolha e o beneficiamento, e o grão é justamente o que ele pode mostrar em close.
  Substitui a embalagem fechada (anônima) e o banco de imagem de lavoura (vedado) por uma
  imagem que é apetite e verdade ao mesmo tempo.
- **Clientes futuros de alimento/gastronomia** (cafeteria, confeitaria, produto regional,
  especiaria) — o método de fotografar em corte/derrame se transplanta direto.

**Não serve** para serviço abstrato (psicologia — Aion, Mayara; odonto — Giovanni) — não há
produto físico para derramar, e forçar vira gimmick.

Complementar à ficha irmã `produto-explodido-scroll.md`: aquela mostra o **processo** (etapas do beneficiamento se separando no scroll); esta mostra o **produto** (o grão em si, no auge do apetite). Uma abre a cadeia, a outra dá fome.

## Cuidado

- **`prefers-reduced-motion`:** se houver qualquer animação de queda/parallax, servir a versão estática (a foto congelada de derrame). A informação não pode depender do movimento. Ver `_memoria/design/60-motion.md`.
- **Foto real do cliente, sempre.** O padrão morre com banco de imagem, e no Grão o cafezal de banco é vedado por falsear origem (`clientes/grao-da-serra/marca.md`). Grão em close, moído, xícara — do produto dele.
- **Compliance / integridade:** sem superlativo nem alegação de saúde na legenda do herói (regra de alimento). O derrame vende apetite, não promessa. Nada de "o melhor grão".
- **Registro de marca:** a energia jovem e barulhenta do Burrito Madre (mascotes, display gritando, alumínio dourado) **não** vem junto. O que se reaproveita é só o método de fotografar o produto em corte/derrame; o tom do Grão é artesanal e de origem, não fast-food.
- Hex/fonte do print são **aparentes**; os valores de cor do Burrito Madre no teardown irmão vêm do `branding` do scrape (reais): base creme `#FAE8DF`, acento tomate `#F83E1C`, verde madre `#034630`.
