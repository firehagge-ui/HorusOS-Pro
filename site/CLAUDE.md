# Site institucional da Hórus

Site da **própria agência**, não de cliente. Por isso mora em `site/` na raiz e
não em `clientes/`.

- `PLANO.md` — passe duplo de design, escrito antes do HTML. Ler antes de mexer
  em qualquer coisa visual aqui
- `index.html` — home, dez seções
- `assets/` — o que vai ao ar
- `site-fontes/` — arte-fonte em PNG, **fora** do que vai ao ar

A identidade (cor, tipo, tom, logo) vive em `identidade/design-guide.md`, que foi
preenchido em 04/08/2026 a partir dos dois boards de marca que o Marcelo mandou.
Até essa data estava em branco.

---

## Decisões que já estão tomadas, para não reabrir

| Decisão | Qual foi | Quando |
|---|---|---|
| Descritiva da marca | **AGÊNCIA**, não PUBLICIDADE | 04/08/2026, Marcelo |
| Tipografia | Montserrat **só no logo**. Site usa Sora (display) e Archivo (corpo) | 04/08/2026, Marcelo |
| Escopo | Home, serviços, cases, sobre. **Só a home está feita** | 04/08/2026, Marcelo |
| Estrutura da home | **7 seções**, na ordem do `PLANO.md` v5 | 05/08/2026 (noite), Marcelo |
| Seções cortadas | A diferença, A Máquina, Para quem é, O que não vai ao ar, Como começa, Perguntas | 05/08/2026 (noite), Marcelo |
| Elemento-assinatura | **não existe mais.** Saiu com o trilho da Máquina | 05/08/2026 (noite), Marcelo |
| Título | "Nós construímos **[MÁQUINAS · SISTEMAS · MARCAS · PRESENÇA]**" | 05/08/2026 (noite), Marcelo |
| Alcance | O site **não** se declara mais só de Salvador | 05/08/2026 (noite), Marcelo |
| Troca da palavra | Letra por letra, decodificando | 05/08/2026 (noite), Marcelo |
| Metal do botão | **Cromo cinza**, lento, num sentido só, franja de cor quase invisível | 05/08/2026 (noite), Marcelo |
| Serviços | **Um painel de tela cheia por serviço**, com ficha técnica | 05/08/2026 (noite), Marcelo |
| Fundo do hero | **Shader em WebGL** nas cores da marca. Sem rótulo em cima | 05/08/2026 (noite), Marcelo |
| Rodapé | Quatro colunas, no formato do print da Menzzo | 05/08/2026 (noite), Marcelo |
| Nome no pé | **Hex dump com onda**. Era pixelado | 05/08/2026 (noite), Marcelo |
| Marquee | **Um só**: a faixa de palavras. A esteira do hero saiu por causa dela | 05/08/2026 (noite) |
| Portfólio | Tira que corre com a rolagem, **sem imagem** até haver autorização | 05/08/2026 (noite) |
| Icarus | Ganhou seção própria, declarada como **em desenvolvimento** | 05/08/2026 (noite), Marcelo |
| Linguagem visual | Escura e cinematográfica, das dez referências. Estudo em `referencias/agencias-ia-dez-sites.md` | 05/08/2026, Marcelo |
| Arte do hero | Forma 3D abstrata em azul e dourado. **O falcão foi rejeitado** | 05/08/2026, Marcelo |
| Elemento-assinatura | O trilho numerado da Máquina. Uma ousadia só na página | `PLANO.md` |
| Formulário | Não existe, de propósito. Sem servidor, não finge que enviou | `50-copy-de-interface.md` |
| Eyebrow | Permitido nas nove seções, com exceção registrada no detector | 05/08/2026, `.impeccable/config.json` |
| Hero | Centralizado. **Sem arte de fundo e sem brilho** | 05/08/2026 (tarde), Marcelo |
| CTA | **Um rótulo só na home inteira: "Começar projeto"**, em botão de metal líquido | 05/08/2026, Marcelo |
| Título | "Instalamos a máquina que faz o seu negócio **[palavra que gira]**" | 05/08/2026 (tarde), Marcelo |
| Palavra que gira | APARECER · RESPONDER · PUBLICAR · ANUNCIAR, que são os 4 blocos como verbo | 05/08/2026 (tarde) |
| Faixa de demonstração | **Removida.** As marcações douradas de pendência ficam | 05/08/2026 (tarde), Marcelo |
| Vidro | Linguagem de superfície da página. Feito de luz, não de desfoque | 05/08/2026 (tarde), Marcelo |
| Stack | Continua HTML e CSS nativos. O botão de shader foi **portado**, não instalado | 05/08/2026 (tarde) |

---

## Estado em 05/08/2026, noite (versão 6)

Serviços viraram seis painéis de tela cheia com ficha técnica, no formato do print
que o Marcelo mandou. Rodapé em quatro colunas. O nome no pé virou hex dump com
onda. O hero ganhou fundo animado em WebGL e perdeu o rótulo. O botão ficou três
vezes mais lento, quase sem cor e correndo num sentido só.

Conferido: detector **saída `0`**, console **sem erro**, 7 seções na ordem, nenhuma
âncora quebrada, nenhuma rolagem lateral em 1440 nem em 390, e a tira do portfólio
medida indo e **voltando** com a rolagem. 146 KB no ar.

### Correções que saíram desta rodada

- **`overflow:hidden` num pai mata `animation-timeline: view()`.** Ele cria
  contêiner de rolagem e a linha do tempo se prende nele. `overflow: clip` recorta
  igual sem virar rolável. E o atalho `animation:` zera a duração em `0s` quando
  ela precisa ser `auto`. Nenhuma das duas dá erro no console
- **Pausa de marquee no hover lê como travamento**, não como cortesia
- **Movimento sem direção lê como ruído.** Somar tempo em dois eixos balança;
  deslocar o campo num eixo só é o que faz o metal escorrer
- **Texto em hex dump: quem engorda o traço da letra é o número de LINHAS da
  grade**, não a largura da célula

Registradas em `_memoria/design/90-antipadroes.md`.

---

## Estado em 05/08/2026, noite (versão 5)

A home caiu de 13 seções para 7. Saíram A diferença, A Máquina, Para quem é, O que
não vai ao ar, Como começa e Perguntas. Hero novo e sem cidade, palavra do título
trocando letra por letra, faixa de palavras sem chapa (o símbolo aparece por dentro
das letras) e o shader do botão refeito em cromo.

Conferido: detector **saída `0`**, console **sem erro**, 7 seções na ordem, nenhuma
âncora quebrada e nenhuma rolagem lateral em 1440 nem em 390.

⚠️ **Duas coisas que a v5 custou, e que estão no `PLANO.md` com detalhe:** a página
ficou **sem elemento-assinatura** (era o trilho da Máquina), e saíram os blocos 2, 4
e 7 da anatomia (para quem é, como começa, FAQ) mais a régua de compliance, que era
o diferencial que nenhuma das dez referências tinha. Tudo continua no git.

### Correções que saíram desta rodada

- **Aberração cromática forte vira arco-íris, não cromo.** 0,030 devolveu fita de
  arco-íris no aro do botão; 0,007 devolveu metal. E metal é cinza: tingir de azul
  da marca, que foi a primeira tentativa, apaga o cromo
- **Fantasma de largura se faz com a letra mais larga repetida**, não com a palavra
  mais longa: contagem de letra não é largura em pixel
- **Texto vazado por cima de chapa não mostra nada.** O vazado só existe se houver
  o que ver atrás
- **Logo de 96px esticado para 340px borra** igual a qualquer foto

Registradas em `_memoria/design/90-antipadroes.md`.

---

## Estado em 05/08/2026, noite (versão 4)

Reestruturação da home. Cinco seções novas (faixa de palavras, A Hórus, Serviços,
Icarus, Portfólio), a de Trabalho virou o Portfólio, a chamada final virou cartaz
à esquerda, e o nome entrou pixelado abaixo do rodapé. Comparativo e motivos no
`PLANO.md`.

Conferido: detector **saída `0`**, console **sem erro**, e as seções novas
conferidas a 1440px e a 390px.

### Correções que saíram desta rodada e valem para o próximo site

- **Recuo lateral zerado só num breakpoint.** O detector apontou `cramped-padding`
  numa faixa que tinha `padding: 74px 24px` escrito, e eu gastei três tentativas
  tentando registrar exceção antes de olhar o media query do celular, onde estava
  `padding: 52px 0`. O detector estava certo. Antes de chamar achado de falso
  positivo, procurar a mesma propriedade em **todos** os breakpoints
- **Marquee novo entra, marquee velho sai.** Se o velho carregava informação, ela
  vira seção
- **Texto pixelado se faz em resolução baixa**, não com filtro. E `textBaseline`
  no meio corta o acento do Ó
- **Rolagem horizontal amarrada ao scroll não precisa de listener** desde que
  existe `animation-timeline: view()`

Todas registradas em `_memoria/design/90-antipadroes.md`.

---

## Estado em 05/08/2026, tarde (versão 3)

Rodada de hero pedida pelo Marcelo com quatro referências na mão. Saiu a arte 3D
do fundo, o título ganhou uma palavra que gira, o CTA virou botão de metal líquido
em WebGL e o vidro dele virou linguagem de superfície da página inteira.
Comparativo completo no topo do `PLANO.md`.

Conferido: detector do impeccable **saída `0`** (e checado contra um arquivo ruim
de propósito, para provar que ele estava mesmo rodando), console **sem erro**,
WebGL ativo nos três botões, hero fechando em 828px de 828 disponíveis a 1440px, e
a dobra conferida também a 390px.

### Correções que saíram desta rodada e valem para o próximo site

- **Cruzar duas palavras de 80px por opacidade vira borrão.** Rotador de palavra
  se faz com faixa recortada e deslize, e as palavras se escolhem com largura
  parecida na hora de escrever a copy
- **As palavras em espera precisam de `aria-hidden`**, senão o leitor de tela lê
  as quatro grudadas
- **Tirar a foto do hero não autoriza pôr brilho no lugar dela.** Brilho sem
  objeto atrás continua sendo `dark-glow`
- **Vidro pedido pelo cliente se faz de luz, não de desfoque.** `backdrop-filter`
  só onde o painel passa por cima de conteúdo: cabeçalho e menu do celular
- **Componente de galeria traz o contraste do autor junto.** O rótulo do botão
  original dava 2,9:1 num CTA
- **Porta o efeito, mantém a stack.** Vinte linhas de shader não justificam
  React, Tailwind e um passo de build

Todas já estão registradas em `_memoria/design/90-antipadroes.md`.

---

## Estado em 05/08/2026, manhã (versão 2)

Home **refeita inteira** depois que o Marcelo mandou o logo, o brandkit e dez
sites de referência. Detector do impeccable **zerado** (saída `0`), **178 KB**
somando tudo que vai ao ar. Conferida em 1440px e em 390px pela técnica do iframe.

O que a v2 trouxe: logo de verdade no cabeçalho e no rodapé, fundo `#0A0B0F`
medido no arquivo da marca, rótulo em pílula, botão em pílula, título com o
termo-chave em azul, trinca de números no hero, esteira de capacidades, e uma
seção de comparação nova ("agência entrega peça, a Hórus instala uma máquina").
Comparativo completo no topo do `PLANO.md`.

**Dez famílias de layout em dez seções:** hero centralizado, esteira, comparação em
duas colunas, trilho vertical, coluna única de texto, grade 3x2 com fio, três
passos, grade 2x2 de card, acordeão nativo, chamada centralizada. Teto da casa
é 4, então sobra folga.

### Correções que saíram desta rodada e valem para o próximo site

- **`max-width:100%` sem `height:auto`** com `width`/`height` no HTML mantém a
  altura intrínseca. A foto do hero ficava com 950px de alto e empurrava o CTA
  para fora da tela
- **`.menu a` vence `.botao` em especificidade** e pintava o CTA do cabeçalho de
  cinza sobre azul: 2,2:1. O botão parecia "apagado" sem ninguém ter pedido isso
- **Título de hero em quatro linhas é erro de proporção**, não de copy. A coluna
  de texto foi para 1.4fr e o `max-width` do h1 para 24ch
- **`clamp()` esconde a escala do detector.** Trocado por valor literal mais
  media query, que é o padrão do resto da casa
- **`auto-fit` com `minmax` deixou órfã.** Seis itens pedem `repeat(3, 1fr)`,
  que fecha 3+3
- **Número e ponto do trilho se encavalavam.** Viraram uma coisa só
- **PNG de fundo quase-preto vira retângulo visível** no meio de uma página
  escura, porque o preto dele nunca bate exatamente com o da página. Uma máscara
  radial dissolve a borda e o objeto passa a flutuar
- **`scroll-behavior:smooth` quebra o print de seção no headless.** A rolagem não
  completa dentro do orçamento de tempo virtual e a seção sai preta, com os
  `.rev` ainda em `opacity:0`. Parece bug do site e não é
- **Elemento no fim da dobra nunca cruza o limiar do `IntersectionObserver`** e
  fica invisível até alguém rolar. Nada acima da dobra pode depender de rolagem
- **Objeto escuro não vira luz sozinho.** O arco de vidro no topo do hero lia
  como mancha; quem faz o trabalho de luz é o gradiente, e a foto entra por cima
  dando textura

Todas já estão registradas em `_memoria/design/90-antipadroes.md`.

---

## ⚠️ O que trava a publicação

Nada disso impede construir. Tudo isso impede subir.

### Dado que só o Marcelo tem

- [x] ✅ **Hex do fundo.** Medido em 05/08/2026 no PNG da marca: `#0A0B0F`
- [x] ✅ **Símbolo do logo.** Extraído com alfa do PNG e no ar no cabeçalho, no
      rodapé e como favicon
- [ ] **Logo em vetor** (SVG ou AI), mais a versão em fundo claro e a
      monocromática. O que existe é bitmap: serve para tela, não escala
- [x] ✅ **Arte do hero.** Resolvido por subtração em 05/08/2026: a forma 3D saiu
      e o hero passou a ser tipografia sobre o preto da marca. `assets/forma.webp`
      ficou no repositório sem ninguém apontar para ele, e a fonte está em
      `site-fontes/forma-3d.png`. Apagar quando o Marcelo confirmar que não volta
- [ ] **WhatsApp, e-mail, domínio, CNPJ e endereço**
- [ ] **@ do Instagram.** O manual traz `@horuspublicidade` e a descritiva mudou
      para AGÊNCIA
- [ ] **Favicon em PNG de 32px e 180px.** Hoje o favicon é o WebP do símbolo,
      que funciona em navegador moderno mas não cobre `apple-touch-icon`
- [ ] **Quem faz.** Um nome apareceu em 05/08/2026: o Marcelo disse que está
      desenvolvendo o Icarus "eu e Antonio", e o Antonio está citado na seção do
      Icarus da home. ⚠️ **Não está confirmado que Antonio é "o sócio do Marcelo"**
      que aparece em três arquivos do repositório sem nome, nem qual é o sobrenome
      e o papel dele na agência. A página "Sobre" depende disso

### Decisão pendente

- [ ] **Autorização de portfólio.** Nenhum cliente autorizou uso do nome. A seção
      de portfólio descreve segmento e entrega, sem nome, sem logo e sem print, e
      **as quatro molduras estão sem imagem** por causa disso. ⚠️ Print do site de
      um cliente identifica o cliente mesmo sem escrever o nome: tirar screenshot
      dos quatro sites do repositório não resolve, piora.
      Grão da Serra tem a autorização em aberto e registrada na estratégia; Aion
      é especulativo sob Deployment Protection; Dr. Giovanni está fora da linha
      de frente. **Case com nome só entra com "sim" por escrito de cada um**
- [ ] **A assinatura verbal do manual.** "Estratégia que transforma" usa verbo de
      folheto, que a casa proíbe em copy. Hoje o rodapé usa só "Visão que
      conecta". Ou a assinatura fica restrita a peça institucional, ou ela é
      reescrita e o manual se atualiza junto
- [ ] **Preço.** O FAQ diz que não há tabela fechada, o que é verdade e está em
      `_memoria/estrategia.md` como pendência de risco alto

### Antes de subir

- [ ] Tirar o `<meta name="robots" content="noindex, nofollow">`, **no dia da
      publicação e não antes**
- [x] ✅ Faixa `.aviso-demo` removida em 05/08/2026, junto com o token `--aviso`.
      ⚠️ O botão "Esconder marcações" foi embora com ela: as marcações douradas de
      pendência agora ficam sempre visíveis, e some com elas só o dado existindo
- [ ] Trocar a imagem de compartilhamento por uma com a marca. ⚠️ Ficou **fora de
      sintonia com a página** em 05/08/2026: é a arte 3D que não existe mais no
      hero, em 1200x630 e sem logotipo
- [ ] Rodar o detector de novo

---

## Falta produzir

O escopo aprovado tem quatro páginas e **só a home existe**:

- [ ] Uma página por bloco da Máquina (site, atendimento e CRM, conteúdo,
      tráfego), com `title`, descrição, `og:` e schema próprios. É o mesmo
      caminho que a Aion tomou em 30/07/2026, e o motivo é o mesmo: URL própria
      para busca e para anúncio
- [ ] Cases. **Depende da autorização acima**, não de produção
- [ ] Sobre. **Depende de saber quem é a equipe**, que hoje não está escrito em
      lugar nenhum do repositório
