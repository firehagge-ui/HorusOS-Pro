# Inspiração: seção de proveniência — mapa + swatches por região

- **Tipo:** secao
- **De onde:** For Living Milano — https://www.for-living.it/
- **Segmento de origem:** fabricação de interiores de luxo (contract / FF&E), Made in Italy
- **Visto em:** 14/08/2026
- **Teardown irmão:** `referencias/for-living.md`

---

## O que é

Uma seção que prova qualidade por **geografia**: um mapa da região/país com pinos, e cada
pino amarra **um insumo a um lugar específico**, acompanhado de um **swatch fotográfico da
textura** do material. No For Living: Mármore/Carrara, Vidro/Murano, Couro/Vicenza,
Madeira/Brianza, Metal/Perugia, Travertino/Roma. Copy curta explica a tradição por trás.
Não é seção "sobre nós": é seção "de onde vem o que você compra".

## Por que marca

Origem é a prova que o concorrente não consegue clonar. "Material nobre" é adjetivo vazio;
"mármore de Carrara" é **credencial verificável** — o olho lê o mapa, associa lugar a
prestígio e conclui a qualidade sozinho, sem a marca precisar afirmar nada. Ancora preço
sem citar preço e passa longe de superlativo (útil em cliente regulado). O swatch de
textura dá o toque sensorial que o mapa sozinho não dá: geografia + matéria na mesma
moldura.

## Como recriar

- Grid de itens (swatch fotográfico + rótulo do material + rótulo do lugar), ao lado de
  um SVG/ilustração do mapa com pinos. Layout de 2 colunas no desktop, empilha no mobile.
- O mapa pode ser SVG estático com pinos posicionados; hover no item acende o pino
  correspondente (interação opcional, leve).
- **Biblioteca detectada:** CSS puro resolve o grid e os swatches; o realce pino↔item é
  JS mínimo (toggle de classe). O site original é Webflow, sem WebGL aqui.
- **Snippet:** não vendorizado ainda — é grid + hover simples, não precisa de arsenal de
  motion. Se virar recorrente, criar em `_biblioteca/motion/snippets/`.
- **Custo honesto:** barato. O peso real está na **qualidade das fotos de textura** —
  swatch tosco derruba a seção inteira. Sem foto boa de material, não fazer.

## Onde cabe

Prova qualidade por **origem + matéria + processo** — serve qualquer marca cujo diferencial
seja de onde vem o insumo e como ele é tratado. Encaixe do roster:

- **Grão da Serra (cliente #4):** trocar "regiões da Itália / materiais" por **"região
  cafeeira de Brejões-Serrana / etapas do beneficiamento"** — o grão escolhido, a pilagem,
  a secagem, a torra, a moagem, cada etapa com um close fotográfico no lugar do swatch.
  Encena origem e processo (o eixo da `marca.md` dele) **sem inventar jargão de café
  especial** (nota SCA, altitude, variedade — proibido, ele não tem o dado).
- **Dr. Giovanni (cliente #1):** os **materiais do implante** por procedência — titânio,
  cerâmica, a marca/origem do componente — como credencial verificável em vez de superlativo.
  Em regulado, casa bem: ancora qualidade sem prometer resultado (CFO).
- **Clientes futuros de artesanato ou produto físico com origem real:** marcenaria, alimento
  regional, cachaça, cerâmica — o mecanismo geografia + swatch de textura se transplanta direto.

## Cuidado

- Só funciona com **origem verdadeira**. Para o Grão da Serra a origem regional está
  **confirmada** (Marcelo, 11/08/2026), então é terreno liberado — mas mapear grão a uma
  região que não se confirma cai em `_memoria/integridade.md` (info falsa em alimento).
  Nada de "nossa lavoura": a família **não planta**, compra o grão maduro e beneficia.
- Foto de textura é banco de imagem? Então não é proveniência, é decoração — e falseia a
  origem. Swatch tem que ser do material/etapa reais do cliente.
- Hex/fonte lidos do print são **aparentes**; medir no build próprio.
- Motion (se acender pino no hover): guard de `prefers-reduced-motion`, conforme
  `_memoria/design/60-motion.md`.
