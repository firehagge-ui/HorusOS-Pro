# Casa Verona — plano do protótipo (passe duplo, 23/09/2026)

Base: `briefing.md`, `marca.md`, teardown `referencias/espaco-eventos-tres-sites.md`,
doutrina de `_memoria/design/`. Objetivo do protótipo: mostrar na reunião **como a noiva
chega na visita já sabendo o que a casa oferece** (a tese da Variação A da mensagem).

## Passe 1 — o plano

```
COR        reboco #F4EDE2 (fundo) · linho #EAE0D0 (alternado) · café #4B3D34 (texto e faixa escura)
           · texto suave #6E5E52 (5,33:1) · cipreste #2F4632 (a única cor de ação, 8,84:1)
           · tijolo #A8683F (só o contorno do arco na assinatura, nunca texto: 3,83:1)
TIPO       Bodoni Moda (títulos, eco do VERONA do logo) · Jost (texto, 18px) · sem terceira família
LAYOUT     8 seções, 5 famílias de layout (split, mosaico, galeria editorial, cartão, formulário+objeto)
ASSINATURA a placa de boas-vindas em arco que se preenche enquanto a pessoa pede a visita
```

### Seções

1. **Hero, em duas colunas.** Texto à esquerda sobre o reboco, foto alta do jardim com as
   arcadas à direita, em opacidade cheia (sem véu, `90-antipadroes.md`). Título: *"Uma vila
   italiana na Pituba."* Prova ao lado: 4,5 no Google (107 avaliações) · mini wedding a
   partir de 40 convidados. CTA "Agendar visita" + "Ver o pacote".
2. **Tipos de evento, em mosaico.** O mini wedding grande (2×2) e mais quatro:
   recepção depois da igreja, aniversários (de 1 a 44 anos), formatura, evento de empresa.
   Foto real de cada um, uma linha de texto com o fato visto no post.
3. **A casa, galeria editorial.** Jardim, pátio coberto, varanda, entrada, escada, preparação
   da noiva, com legenda curta. Fecha com a **ficha da casa** (estrutura do portal +
   capacidade `[FALTA]` + "já recebeu mini wedding de 120 convidados").
4. **Pacote, em cartão de cardápio.** O "Case em Casa" montado como o cardápio impresso que
   fica sobre o prato nas fotos dela. O que inclui (decoração, buffet, organização), a partir
   de 40 convidados, datas 2026/2027, e o valor `[FALTA]`. Um segundo cartão, "Outros
   formatos", todo `[FALTA]`.
5. **Como funciona a visita.** Três passos numerados (a ordem é real): conte o evento → venha
   conhecer → receba a proposta. Horários e reserva `[FALTA]`.
6. **Quem já celebrou.** Um depoimento grande + três menores, trechos literais do Google e
   do Casamentos.com.br, com nome, fonte e data.
7. **Agendar visita, a assinatura.** Formulário curto à esquerda (nome, tipo, mês, convidados,
   mensagem); à direita a **placa de boas-vindas em arco**, igual à que a casa monta na
   entrada ("Bem-vindos · Igor e Débora" no post de 20/03/2026), que escreve o nome, o evento,
   o mês e os convidados enquanto a pessoa digita. O botão abre o WhatsApp da casa com a
   mensagem pronta.
8. **Perguntas + onde fica.** Seis perguntas em `<details>` (as de viabilidade: capacidade,
   preço, fornecedor próprio, chuva) e o mapa com endereço, WhatsApp e Instagram.

### Wireframe (desktop)

```
[selo] Casa Verona        A casa  Eventos  Pacote  Visita   [Agendar visita]
+--------------------------+-----------------------------+
| Uma vila italiana        |                             |
| na Pituba.               |   FOTO ALTA: altar entre    |
| subtítulo 2 linhas       |   as arcadas e os ciprestes |
| [Agendar visita] Pacote  |                             |
| 4,5 Google · 107 | 40+   |                             |
+--------------------------+-----------------------------+
| MINI WEDDING (2x2)       | recepção   | aniversários   |
|                          | formatura  | empresa        |
+--------------------------------------------------------+
| galeria: alta | larga | alta   + ficha da casa (lista) |
+--------------------------------------------------------+
|      [ cartão-cardápio CASE EM CASA ] [ outros ]       |
| 1 ─── 2 ─── 3   como funciona a visita                 |
| "citação grande"            · três trechos menores     |
| formulário            |   ╭──────────╮  placa em arco  |
|                       |   │Bem-vindos│  que se escreve |
|                       |   │  Nome    │                 |
| perguntas (details)   |   mapa + contato               |
```

## Passe 2 — o ataque: "eu chegaria aqui com qualquer espaço de evento?"

| Parte | Veredito | O que mudou |
|---|---|---|
| Creme + serifa + verde | **Sim, é o reflexo do segmento.** | Mantido porque **é a casa**: o creme é o reboco das fotos, o verde é o cipreste, o café é o logo. A serifa deixou de ser "serifa de casamento" (a Cormorant de todo site de noiva) e virou **Bodoni Moda**, que tem o desenho do VERONA do logo. |
| Hero com foto e título | Meio a meio. | "Criando memórias inesquecíveis" é a Salvatore. *"Uma vila italiana na Pituba"* só serve a ela: é a frase da bio fortificada e ancorada no bairro. |
| Tipos de evento com ícone | **Sim**, é a Stella. | Virou mosaico com **foto do evento real** e o fato de cada post ("aniversários de 1 a 44 anos" é literal: festa de 1 ano e a Thatiane, 44). |
| Galeria em grade | Sim. | Virou galeria **por ambiente com legenda**, e o que ela tem de único (a escada de madeira de onde a noiva desce, as arcadas) ganha nome. |
| Pacote em três cards iguais | Sim, e nenhum concorrente nem tem pacote. | Um **cartão de cardápio**, o objeto que já existe na mesa dela, com o nome real do pacote. |
| Formulário de orçamento | **Sim**, é o dos três. | Virou **pedido de visita** (a palavra dela) com a **placa de boas-vindas em arco**, o ritual que ela monta na entrada, com o arco do logo e da parede. É a única ousadia da página. |
| Arco como máscara em todas as fotos | Sim: é a moda de site de casamento. | **Cortado.** O arco aparece uma vez, na placa. Nas fotos ele já está na parede. |

## Motion

Uma entrada suave por seção (com a trava de duas camadas do `90-antipadroes.md`) e a
placa, que troca o texto com um fade curto. Nada mais. `prefers-reduced-motion` desliga tudo.

## Pendências na tela

Todo `[FALTA]` do HTML tem dois modos: **apresentação** (padrão; aparece como "a definir com
vocês", discreto) e **trabalho** (aparece o `[FALTA: ...]` inteiro, em destaque). Troca com a
tecla **P** ou `?pendencias=1` no endereço (`99-checklist.md` §6).

---

## Rodada 2 (24/09/2026): referência do Marcelo + referências premium

Base: a referência visual que o Marcelo trouxe (mockup gerado por IA a partir do protótipo)
e `referencias/espaco-eventos-premium.md`.

**Levado da referência do Marcelo (composição e clima):**
- Hero de tela inteira com **foto real** (casal sob o guarda-chuva no jardim ao entardecer,
  arcadas iluminadas, foto @jrgois), véu só do lado do texto (medido: lead 8,84:1, prova
  4,96:1, faixa de tipos 6,18:1). Faixa com os tipos de evento no pé do hero. No celular a
  foto vem inteira em cima e o texto numa faixa café, sem véu.
- Topo transparente sobre a foto, sólido depois do hero.
- Cartão de texto sobreposto à foto nos tipos de evento (também é o recurso do Estate Yountville).
- Ritmo claro/escuro: eventos reboco · casa linho · pacote reboco · **visita em faixa café** ·
  depoimentos linho · pedido reboco · perguntas linho. Título visível nos depoimentos.

**Recusado da referência, por integridade:** fotos geradas por IA (não são a casa),
depoimentos com nome e rosto inventados, endereço "Rua Amazonas, 56" e CEP errados, nome do
pacote "Casa em Casa" (o certo é Case em Casa), lista de ícones com "e muito mais", selo
circular girando, e a troca da placa de boas-vindas por uma foto de porta.

**Levado das referências premium:** ficha por ambiente no formato do Ciavolich (ambiente ·
serve para · capacidade `[FALTA]`) no lugar da lista solta.

**Fica para a rodada 3, depende da reunião:** pacote por tamanho com piso de preço (Ashland),
bloco "como a casa funciona" com as regras virando argumento (Fetewell: fornecedor livre,
horas de locação; Castle Farm: um evento por dia), arco e ciprestes do logo em traço (Castle
Green) se ela mandar o logo em vetor.

---

## Rodada 3 (24/09/2026): Home com fotos passando, estética italiana, vídeo e decoração

**Pedido do Marcelo:** 3 imagens do lugar passando na Home; estética italiana tirada do
Instagram dela; título mais emotivo ("Momentos inesquecíveis", "vila italiana"); elementos
visuais gerados no ChatGPT; referências Austo, Boutique Weddings, Wedding Cinema Club e The
Grand LB ("gostei dos vídeos, do motion e dos efeitos; deixe tão decorado quanto").
Estudo: `referencias/eventos-emocao-quatro-sites.md`.

**O que o Instagram dela mostra de "italiano"** (e é real): parede de reboco creme, **arcadas
com moldura de tijolo**, **ciprestes** entre os arcos, **fonte** de pedra na frente da fachada,
janelas de madeira escura, **sacada de ferro**, lanternas, telhado de telha. Decoração sempre
**branco e verde** (lírio, rosa branca, lisianto, mosquitinho, eucalipto), cadeira de madeira
em X, velas, piano branco. Nas artes dela: serifa clara em itálico ("Tour pela Casa Verona",
"Mini wedding") e a placa de boas-vindas em arco. A legenda de 12/09 diz a paleta com as
palavras dela: *"branco, verde e muito amor em cada detalhe"*.

### Passe 1 — o plano

```
COR        mantida (reboco, linho, café, cipreste, tijolo, papel). A cor nova vem das flores
           brancas e dos ciprestes em aquarela, não de token novo.
TIPO       Bodoni Moda com ITÁLICO na palavra de emoção (padrão Austo) · Jost no corpo ·
           numerais romanos nos passos (I, II, III). Bodoni é tipo de Parma: a Itália no tipo.
ASSINATURA a JANELA DO LOGO em escala de hero: arco de tijolo desenhado em traço (os voussoirs
           do logo), sacada de ferro na base (o guarda-corpo do logo, a sacada da fachada), as
           3 fotos da casa passando dentro, e os ciprestes do logo e do jardim dos dois lados,
           balançando. O logo vira a cena.
MOTION     slideshow com fusão e aproximação lenta + pausa (WCAG) · ciprestes balançando ·
           arco que se desenha na entrada · título por linha · marquee dos tipos de evento
           (um só) · manifesto revelado palavra a palavra no scroll · parallax leve nas fotos
           dos eventos · vídeos que tocam ao entrar na tela · VERONA com o jardim dentro das
           letras no rodapé · Lenis. Tudo desliga com prefers-reduced-motion.
VÍDEO      3 loops verticais recortados dos reels DELA (jardim, mesa posta, chegada pela
           fonte), sem som e sem o texto dos reels. Tour completo linkado no Instagram.
ORNAMENTO  ChatGPT, aquarela, fundo transparente: 2 ciprestes, 1 arranjo branco e verde,
           4 ramos (rosa, eucalipto, oliveira, lírio). Cada recorte aparece UMA vez e tem
           função. IA nunca na casa: o lugar é sempre foto ou vídeo real.
```

### Seções (rodada 3)

1. **Hero, a janela.** Texto à esquerda: *"Momentos **inesquecíveis**"* grande e *"numa vila
   italiana, na Pituba."* em itálico menor (as palavras do Marcelo), subtítulo da rodada 2,
   Agendar visita + Conhecer a casa, 4,5 no Google. À direita a janela 3:4 com as fotos
   (entardecer com guarda-chuva · altar entre os ciprestes · pátio coberto de frente para a
   casa), legenda com numeral romano, barra de tempo e botão de pausa.
2. **Faixa de tipos de evento** em Bodoni itálico correndo (substitui a faixa do hero).
3. **Manifesto:** *"Mais que eventos, histórias reais."* (a assinatura dela) + a frase da
   legenda dela sobre o amor e o número de convidados, revelada palavra a palavra.
4. **A casa em movimento** (faixa café): 3 vídeos verticais + link do tour no Instagram.
5. **Eventos** (mosaico da rodada 2, com parallax leve nas fotos).
6. **A casa** (galeria por ambiente + ficha), fotos entrando como cortina.
7. **Pacote** (cardápio) com o ramo de rosa branca no canto.
8. **Visita** (faixa café, numerais romanos) com o lírio.
9. **Depoimentos** com o ramo de eucalipto.
10. **Pedido de visita** (a placa em arco) com o arranjo branco e verde na base, como a placa
    real dela tem flores ao pé.
11. **Perguntas + onde fica** com o ramo de oliveira.
12. **Rodapé** com VERONA em letra gigante e o jardim tocando dentro.

### Passe 2 — o ataque: "eu chegaria aqui com qualquer espaço de evento?"

| Parte | Veredito | O que mudou |
|---|---|---|
| Slideshow em tela cheia com título no meio | **Sim**, é o hero de 3 das 4 referências e de qualquer venue. E as fotos do Instagram são retrato: em tela cheia deitada o título cai em cima do rosto dos noivos e a foto amplia 1,3x. | Virou a **janela do logo**, retrato como as fotos, com o título ao lado. |
| Folhas em aquarela flutuando (Cinema) | Sim, é enfeite de convite. | A botânica é a da **decoração real dela** e os ciprestes são os do logo. Um de cada, cada um com função (acompanha a placa, o cardápio, o depoimento). |
| Árvore balançando (Austo) | A técnica é deles, a árvore é dela. | Mantido: é o cipreste do logo e do jardim. |
| Marquee de tipos de evento (Grand) | O formato é genérico. | Mantido, um só, porque tira a faixa de links do hero e a lista é dela. |
| Vídeo dentro das letras (Grand) | Efeito de vitrine. | Mantido porque o nome é o lugar (a casa fica na Alameda Verona) e o vídeo é o jardim real; fecha a página com o nome, em vez de banner. |
| Polaroid de depoimento (Austo) | — | **Recusado:** foto de um casal ao lado do texto de outra pessoa sugere que é o casal do depoimento. |
| Palavras em italiano soltas ("Benvenuti", "Amore") | Sim, é o kitsch do tema. | **Recusado.** A Itália vem da arquitetura dela, da Bodoni e dos numerais romanos. |
| Onda ou arcada entre seções (Austo) | — | **Recusado:** o arco já aparece duas vezes, com papéis diferentes (a janela no topo e a placa no pedido). Um terceiro vira papel de parede. |

**Revisão consciente da rodada 2:** lá o arco ficou só na placa ("arco como máscara em todas
as fotos é moda de site de casamento"). Continua valendo para as fotos da página: o arco entra
**uma vez** no hero, como a janela do próprio logo, e nenhuma outra foto ganha máscara.
