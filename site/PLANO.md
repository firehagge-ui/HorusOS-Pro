# Site institucional da Hórus — plano de design

> **Versão 6, 05/08/2026 (noite).** Serviços viraram **seis painéis de tela
> cheia** com ficha técnica. Rodapé em colunas. O nome no pé virou **hex dump com
> onda**. Hero ganhou **fundo animado em WebGL** e perdeu o rótulo. Botão mais
> lento, quase sem cor e correndo num sentido só.
>
> **Versão 5, 05/08/2026 (noite).** A home encolheu de 13 seções para **7**. Saíram
> A diferença, A Máquina, Para quem é, O que não vai ao ar, Como começa e
> Perguntas, a pedido do Marcelo. Hero novo, palavra que troca letra por letra,
> faixa de palavras sem chapa, e o shader do botão refeito.
>
> **Versão 4, 05/08/2026 (noite).** Reestruturação da home: cinco seções novas
> (faixa de palavras, A Hórus, Serviços, Icarus, Portfólio), a chamada final
> virou cartaz à esquerda e o nome entrou pixelado no pé.
>
> **Versão 3, 05/08/2026 (tarde).** Rodada de hero: saiu a arte de fundo, o
> título ganhou uma palavra que gira, o CTA virou botão de metal líquido e o
> vidro dele virou linguagem de superfície da página inteira.
>
> **Versão 2, 05/08/2026 (manhã).** A versão 1 (04/08) foi refeita inteira depois
> que o Marcelo mandou o logo, o brandkit e dez sites de referência.
>
> **Design read:** landing de agência de marketing com IA para dono de negócio
> local e profissional liberal em Salvador, na linguagem escura e cinematográfica
> das dez referências, em HTML e CSS nativos, com Sora e Archivo.
>
> **Dials:** `DESIGN_VARIANCE 8` · `MOTION_INTENSITY 6` · `VISUAL_DENSITY 3`.

---

## O que mudou da versão 5 para a 6, e por quê

| | v5 | v6 |
|---|---|---|
| Serviços | seis linhas empilhadas numa seção | **seis painéis de tela cheia**, com número, rótulo em mono e ficha técnica |
| Hero | preto chapado | **fundo animado em WebGL**, nas três cores da marca |
| Rótulo do hero | "Agência com IA" | removido |
| Metal do botão | rápido, com franja de cor forte, balançando nos dois eixos | **três vezes mais lento**, franja quase invisível, correndo num sentido só |
| Faixa de palavras | parava com o mouse em cima | **não para nunca** |
| Portfólio | travado num deslocamento fixo | anda e **volta** com a rolagem, nos dois sentidos |
| Chamada final | "Pronto para construir algo que dura?" | "Qual bloco do seu negócio ainda não existe?" |
| Rodapé | uma linha com logo e dado legal | **quatro colunas**, no formato do print da Menzzo |
| Nome no pé | pixelado | **hex dump com onda atravessando** |

**Por que a ficha técnica existe.** Sem ela, seis telas cheias com um título no
meio são a mesma tela seis vezes, e o formato de painel deixa de valer o
comprimento que custa. A ficha é também onde a régua de integridade aparece: cada
linha descreve a entrega, e nenhuma inventa número, prazo ou cliente.

**O fundo do hero é objeto, não brilho.** A permissão de brilho da marca é
condicional, e a condição é haver um objeto de verdade. Um shader rodando é
superfície renderizada; gradiente radial atrás do título não é. A intensidade fica
baixa de propósito e o miolo é escurecido, então o título mantém 14:1 no ponto mais
claro da cena.

**O portfólio estava travado, e o CSS parecia certo.** Duas armadilhas de
`animation-timeline: view()` de uma vez: `overflow:hidden` no pai cria contêiner de
rolagem e prende a linha do tempo nele, e o atalho `animation:` zera a duração em
`0s` quando ela precisa ser `auto`. As duas estão em `90-antipadroes.md`, porque
nenhuma dá erro no console.

---

## O que mudou da versão 4 para a 5, e por quê

**A home agora tem 7 seções:**

```
hero → faixa de palavras → A HÓRUS → SERVIÇOS → ICARUS → PORTFÓLIO
     → chamada final → rodapé → HÓRUS pixelado
```

| | v4 | v5 |
|---|---|---|
| Seções | 13 | **7** |
| Título | "Instalamos a máquina que faz o seu negócio [verbo]" | **"Nós construímos [MÁQUINAS · SISTEMAS · MARCAS · PRESENÇA]"** |
| Subtítulo | descrevia método e prendia a agência a Salvador | **"Engenharia visual. Inteligência artificial. Nada publicado por acaso."** |
| Troca da palavra | deslize dentro de faixa recortada | **letra por letra**, decodificando |
| Faixa de palavras | chapa de vidro, texto com miolo, frase embaixo | **sem chapa, sem fio, sem frase.** Letra 100% vazada sobre o símbolo |
| Símbolo da faixa | `simbolo.webp` de 96px esticado, 7% de opacidade | arquivo próprio de 420px, **55%** |
| Rótulo da seção 1 | "A Hórus" | removido |
| Shader do botão | dobramento de domínio tingido de azul | **cromo**, com os parâmetros do componente um a um |
| Chamada final | "Qual bloco do seu negócio ainda não existe?" | "Pronto para construir algo que dura?" |

**Por que o título mudou.** O anterior descrevia o método ("instalamos a máquina",
"um bloco por vez") e amarrava a agência a Salvador. O novo afirma o que a casa
constrói e não tem cidade. As quatro palavras que giram são coisas que a Hórus de
fato entrega, e nenhuma promete resultado, que é o que a régua de integridade
exige mesmo no site da própria agência. O subtítulo segue a fórmula das
referências (três frases curtas), e a terceira delas, "nada publicado por acaso",
é o único diferencial que sobrou visível depois que a régua de compliance saiu.

**Por que a faixa perdeu a chapa.** Texto vazado sobre um fundo próprio não deixa
ver nada: o vazado só existe se houver algo atrás. Saíram o `background` e os
fios, a letra virou `color: transparent` com contorno, e o símbolo subiu de 7%
para 55%. Agora dá para ver o olho **por dentro** das letras, que era o pedido.

**⚠️ A página ficou sem elemento-assinatura.** O trilho numerado da Máquina era
a ousadia registrada em `00-anatomia.md`, e saiu com a seção. O que mais chega
perto de ocupar o lugar hoje é a faixa de palavras vazadas sobre o símbolo, e ela
é boa, mas é decoração, não argumento: o trilho *desenhava a coisa que a Hórus
vende*. Fica anotado como decisão do Marcelo, não como esquecimento.

**⚠️ O que saiu de conteúdo, e o que isso custa.** Não é só volume:

- **O que não vai ao ar** era a única seção que nenhuma das dez referências tinha,
  e era o diferencial mais forte da página para cliente de setor regulado
- **Para quem é** é o bloco 2 da anatomia, o de maior impacto e o mais esquecido:
  é onde a pessoa se reconhece antes de entender o serviço
- **Perguntas** respondia preço, prazo, garantia e propriedade do site. Sem ela,
  essas objeções chegam por WhatsApp, uma a uma
- **Como começa** tirava o medo do primeiro contato

Nada disso se perdeu: está no histórico do git, e volta como página própria se o
Marcelo quiser. O escopo aprovado já previa quatro páginas, e três continuam sem
existir.

---

## O que mudou da versão 3 para a 4, e por quê

Reestruturação pedida pelo Marcelo com três referências novas (VFusion, Trionn e
um cartaz de agência), mais o `shape-landing-hero` do 21st.dev.

**A ordem da home agora é:**

```
hero  →  faixa de palavras  →  A HÓRUS  →  SERVIÇOS  →  ICARUS  →  PORTFÓLIO
      →  a diferença  →  a Máquina  →  para quem é  →  o que não vai ao ar
      →  como começa  →  perguntas  →  chamada final  →  rodapé  →  HÓRUS pixelado
```

| | v3 | v4 |
|---|---|---|
| Credenciais do hero (4·3·1·0) | faixa na base da dobra | **removida** a pedido do Marcelo |
| Marquee | esteira de capacidades, dentro do hero | **faixa de palavras** (Inovação · Impacto · Inspiração), depois do hero |
| Seção sobre a agência | não existia | **A Hórus**, com formas flutuando e o título caindo palavra por palavra |
| Serviços | espalhados na esteira e na Máquina | **seção própria**, seis empilhados, um por linha |
| Produto próprio | não aparecia | **Icarus**, em formato de cartaz |
| Trabalho | grade 2x2 de card, sem foto | **Portfólio**, tira que corre com a rolagem |
| Chamada final | centralizada | **cartaz à esquerda**, com pergunta no lugar de afirmação |
| Pé | rodapé e fim | rodapé mais **HÓRUS pixelado** em escala de cartaz |
| Menu | A diferença · A Máquina · O que não vai ao ar · Trabalho · Perguntas | A Hórus · Serviços · Icarus · A Máquina · Portfólio |

**Por que a esteira do hero virou a faixa de palavras.** Dois marquees numa página
é antipadrão registrado. Como a faixa nova foi pedida, a antiga saiu, e o que ela
carregava (a lista de capacidades) virou a seção de Serviços, que diz a mesma coisa
com hierarquia. Marquee novo entra, marquee velho sai.

**As formas da seção A Hórus vieram do `shape-landing-hero`, com duas mudanças.**
A paleta é a da marca: o componente original usa indigo, rosa, violeta, âmbar e
ciano, que é literalmente o gradiente que a casa proíbe. E cada forma tem borda e
gradiente próprios, então é objeto com desenho, não mancha de luz solta atrás de
texto. A deriva é de 16px em 15 segundos: forma girando muito vira protetor de tela.

**⚠️ O símbolo ao fundo da faixa contraria uma regra escrita.**
`identidade/design-guide.md` diz, com todas as letras: "o símbolo do olho ampliado
como marca-d'água de fundo está proibido", e o motivo é bom (é o mesmo desenho duas
vezes na página, já que o cabeçalho tem o símbolo a 34px). O Marcelo pediu em
05/08/2026 e entrou, com três limites: aparece **uma vez** na página inteira, fica
a 7% de opacidade com máscara radial, e é o único lugar em que o símbolo aparece
grande. **Se o Marcelo quiser voltar atrás, o substituto já existe no manual:** o
feixe de linhas em onda, que existe justamente para esse papel.

**O portfólio corre sem uma linha de JavaScript.** `animation-timeline: view()`
amarra a tira à posição da seção na tela. A regra da casa proíbe listener de
scroll, e não precisou: onde o navegador não suporta (hoje Safari e Firefox), um
`@supports not` transforma a tira num carrossel que se arrasta com o dedo.

**⚠️ O portfólio está sem imagem, e isso não é falta de produção.** Nenhum dos
quatro clientes autorizou uso do nome nem da tela. Cada moldura carrega segmento e
entrega, e o lugar da imagem é uma pendência marcada. **Print de site de cliente
identifica o cliente**, mesmo sem escrever o nome, então tirar screenshot dos
quatro sites do repositório e subir aqui não resolve o problema, cria um pior.

**O Icarus diz que está em desenvolvimento porque está.** O `README.md` do projeto,
lido em 05/08/2026, registra "pesquisa concluída, nada construído", sem uma linha
de código e sem cliente. A seção fala do que ele é para ser e nomeia quem está
fazendo, sem prometer prazo, resultado ou cliente.

---

## O que mudou da versão 2 para a 3, e por quê

Rodada pedida pelo Marcelo com quatro referências de hero na mão (um SaaS claro de
tipografia grande, um hero escuro com a palavra-chave colorida, um preto editorial
só de texto, e o componente `liquid-metal-button` do shadcn).

| | v2 (manhã) | v3 (tarde) |
|---|---|---|
| Faixa de demonstração | barra azul no topo, com botão de esconder marcações | **removida**. As marcações de pendência ficam |
| Arte do hero | forma 3D com máscara radial e halo azul | **nenhuma.** Tipografia sobre o preto da marca |
| Brilho | atrás da arte do hero | **nenhum.** Saiu junto com a arte, e não foi substituído |
| Título | "Construímos a presença digital de quem não pode errar" | "Instalamos a máquina que faz o seu negócio **[gira]**" |
| Última palavra | fixa, em azul | gira entre APARECER · RESPONDER · PUBLICAR · ANUNCIAR |
| Caixa do h1 | caixa alta | frase em caixa baixa, e só a palavra que gira em caixa alta |
| CTA | pílula azul chapada | **metal líquido**: aro de shader em WebGL sobre pílula de vidro escuro |
| Superfície | card chapado com fio cinza | **vidro**: fundo translúcido, fio claro, especular de 1px na aresta de cima |
| Imagens que vão ao ar | 3 (logo, arte do hero, compartilhar) | 2 (logo e compartilhar) |

**Por que a palavra gira, e por que essas quatro.** As quatro palavras são os
quatro blocos da Máquina ditos como verbo, então a rotação anuncia a seção
principal da página antes dela aparecer, e não é enfeite. Nenhum dos quatro verbos
promete resultado, o que a régua de integridade exige de um site que responde a
CFO e CFP. E as quatro têm 8 ou 9 letras de propósito: palavra de largura
diferente faz o título refluir a cada troca.

**Por que o brilho saiu junto com a arte.** A permissão de brilho registrada em
`identidade/design-guide.md` é condicional: azul da marca **e sempre atrás de um
objeto de verdade**. Sem a arte não há objeto, e gradiente radial sozinho atrás do
título é `dark-glow` com outro nome. Quem sustenta a cena agora é o metal correndo
no aro do botão, que é superfície renderizada de verdade.

**Por que o vidro não usa desfoque.** Pedido do Marcelo: "esse tom de vidro, quero
que passe para outras partes do site". O desfoque só existe onde há o que
desfocar, e num site escuro de fundo chapado isso é o cabeçalho fixo e o menu do
celular, e mais nada. Nos cards o vidro é feito de **luz**: três tokens
(`--vidro`, `--vidro-fio`, `--vidro-luz`) com fundo translúcido, fio claro e um
especular de 1px na aresta de cima. É a mesma receita da face do botão.

**O botão foi portado, não instalado.** O componente que o Marcelo mandou é React
com Tailwind, TypeScript e `@paper-design/shaders`. Este site é HTML e CSS nativos
por decisão registrada, e o efeito são vinte linhas de shader dentro de três
camadas empilhadas. Virou WebGL nativo, sem dependência nenhuma, com aro parado em
`conic-gradient` para quem não tem WebGL e quadro congelado em
`prefers-reduced-motion`. O rótulo do original vinha em `#666666` sobre preto
(2,9:1, reprovado) e foi medido de novo: `#EDF1F7`, 15,1:1.

**A ousadia continua sendo uma só?** Tecnicamente a página agora tem duas coisas
que chamam atenção: o trilho da Máquina e o botão de metal. Elas convivem porque
não disputam o mesmo lugar. O trilho é **estrutura**, e é o argumento comercial
desenhado; o botão é **acabamento**, e aparece três vezes no mesmo objeto pequeno.
Se um dia brigarem, o trilho fica: ele diz o que a Hórus vende.

---

## O que mudou da versão 1 para a 2, e por quê

A v1 era escura, sóbria e sem brilho nenhum: um instrumento de precisão. Estava
correta pelas regras da casa e **não era o que o Marcelo queria.** As dez
referências que ele mandou apontam todas para o mesmo lugar, e o estudo completo
está em `referencias/agencias-ia-dez-sites.md`.

| | v1 (04/08) | v2 (05/08) |
|---|---|---|
| Fundo | `#0A0C12`, estimado a olho | `#0A0B0F`, **medido** no PNG da marca |
| Logo | não existia, só o logotipo em fonte | símbolo extraído com alfa, no cabeçalho e no rodapé |
| Brilho | zero, por decisão | atrás da arte do hero, no azul da marca |
| Rótulo de seção | removido, os três que existiam | pílula com ponto, em todas as nove seções |
| Botão | raio de 10px | pílula |
| Escala do título | 64px, sem cor no meio | 80px, com o termo-chave no azul |
| Números | nenhum | quatro credenciais na base do hero |
| Arte | elemento óptico numa caixa retangular | mesma peça, com máscara radial, flutuando |
| Seções | 9 | 10, com a comparação nova |
| Hero | assimétrico, texto à esquerda e arte à direita | **centralizado, no formato do REMAK** |
| Botões na home | 3 rótulos diferentes | **um só: "Começar projeto"** |
| Título | "Presença digital na ordem que traz cliente" | "Construímos a presença digital de quem não pode errar" |

**O que não mudou, e não muda:** nenhum dado inventado, nenhum case com nome sem
autorização, contraste medido, menu no celular, imagem em WebP, e o trilho da
Máquina como elemento-assinatura.

---

## Passe 1: o plano

### COR

| Token | Hex | Função | Contraste sobre `--tinta` |
|---|---|---|---|
| `--tinta` | `#0A0B0F` | Fundo. **Medido** no arquivo da marca | — |
| `--tinta-2` | `#101319` | Faixa alternada | — |
| `--carta` | `#14181F` | Superfície de card | — |
| `--fio` | `#232A36` | Fio e borda | — |
| `--grafite` | `#3B3F46` | Borda forte (cor oficial do manual) | — |
| `--azul` | `#2563EB` | Marca, CTA, preenchimento | 3,4:1 → **só título grande e fundo de botão** |
| `--azul-luz` | `#60A5FA` | Link, rótulo, número, termo-chave | 7,9:1 → texto corrido liberado |
| `--dourado` | `#F4C430` | Acento pontual | 11,4:1 |
| `--osso` | `#E5E7EB` | Texto principal | 15,2:1 |
| `--osso-2` | `#A2ABBA` | Texto secundário | 7,6:1 |

`--azul` nunca carrega texto pequeno nem link. O degrau de leitura é `--azul-luz`.
Mesma lição medida da paleta terrosa da Aion (`99-checklist.md` §2.5).

### TIPO

**Sora** no display, **Archivo** no corpo. Montserrat fica só no logotipo, que é
arquivo fechado. Motivo em `identidade/design-guide.md`.

Sete degraus, razão mínima de 1,25: **13 · 17 · 22 · 28 · 40 · 64 · 80**.
Sem `clamp()`: valor fluido esconde a escala do detector e produz tamanho que não
está em degrau nenhum. A escala desce um degrau inteiro por media query.

### LAYOUT

O hero segue a composição do REMAK, e a faixa de credenciais na base vem do CTA.

```
┌──────────────────────────────────────────────────────────────┐
│ [olho] HÓRUS | AGÊNCIA    links...    ( Começar projeto ↗ )  │  v3: sem faixa
├──────────────────────────────────────────────────────────────┤
│                                                              │
│              ( ● AGÊNCIA COM IA · SALVADOR )                 │
│                                                              │
│         Instalamos a máquina que faz o seu negócio           │
│                    A P A R E C E R                           │  ← gira
│                                                              │
│              lead centralizado, 2 linhas                     │
│                ( Começar projeto ↗ )   ← UM botão, de metal  │
│                                                              │
│ ◄ site · landing · atendimento · CRM · GMN · SEO · ads ►     │  esteira
│ ──────────────────────────────────────────────────────────── │
│  4 negócios · 3 setores · 1 bloco por vez · 0 dado inventado │
├──────────────────────────────────────────────────────────────┤
│  A DIFERENÇA                                                 │
│  ┌── o jeito comum ──┐  ┌── na Hórus (borda azul) ──┐        │
├──────────────────────────────────────────────────────────────┤
│  A MÁQUINA                            ◄── ASSINATURA         │
│  [01]─ SITE                                                  │
│   │                                                          │
│  [02]─ ATENDIMENTO E CRM     trilho que acende na ordem      │
│   │                                                          │
│  [03]─ CONTEÚDO                                              │
│   │                                                          │
│  [04]─ TRÁFEGO                                               │
├──────────────────────────────────────────────────────────────┤
│  PARA QUEM É      coluna única, 4 situações, cada uma linka  │
├──────────────────────────────────────────────────────────────┤
│  O QUE NÃO VAI AO AR      grade 3x2 da régua de compliance   │
├──────────────────────────────────────────────────────────────┤
│  COMO COMEÇA      três passos, sem card                      │
├──────────────────────────────────────────────────────────────┤
│  TRABALHO         2x2, sem nome, pendente de autorização     │
├──────────────────────────────────────────────────────────────┤
│  PERGUNTAS        <details> nativo, dez                      │
├──────────────────────────────────────────────────────────────┤
│  CHAMADA FINAL centralizada + canais + rodapé                │
└──────────────────────────────────────────────────────────────┘
```

**Dez famílias de layout em dez seções:** hero centralizado, esteira, comparação em
duas colunas, trilho vertical, coluna única de texto, grade 3x2 com fio, três
passos, grade 2x2 de card, acordeão, chamada centralizada. O teto da casa é 4.

### ASSINATURA

**O trilho da Máquina**, quatro estágios numerados num fio vertical que acendem na
ordem conforme a pessoa rola.

A Hórus não vende quatro serviços, vende **uma ordem**. "Um bloco por vez, nunca
product-dump" é regra escrita em `_memoria/empresa.md`. Numeração de seção é
antipadrão quando o conteúdo não é sequência de verdade; aqui é, e por isso a
numeração é ganha. É também a única animação de rolagem motivada da página: ela
comunica a ordem, que é o argumento comercial.

---

## Passe 2: atacando o próprio plano

> **Eu chegaria nesse mesmo plano se o briefing fosse de qualquer outra agência
> de marketing digital?**

Na linguagem visual, **sim, e agora de propósito.** É a diferença entre a v1 e a
v2: a v1 fugiu do óbvio do segmento e não era o que o cliente queria; a v2 adota
o óbvio do segmento porque o cliente escolheu, com dez referências na mão.

Isso significa que **a diferenciação inteira desta página tem que vir da copy e
da estrutura**, não do visual. O que sobrou de único, e que nenhuma das dez
referências tem:

**1. A ordem é o produto.** Todas as dez vendem "um sistema completo". A Hórus
vende a recusa de entregar tudo junto, e essa recusa vira o desenho da seção
principal. A LucrOS chega perto com "instala um sistema", mas ainda entrega os
quatro blocos de uma vez.

**2. A régua do que não se publica.** Nenhuma das dez tem essa seção. Três dos
quatro clientes da Hórus são de setor regulado (CFO, CFP) e existe um sistema
escrito para isso. Numa página de agência, "parte do trabalho é escrever menos do
que dava" é o oposto do que o segmento faz.

**3. Os números são verificáveis.** As referências fazem "5000+ empresas" e
"Trusted by". A trinca do hero da Hórus é 4, 3 e 1, e os três saem do repositório.
Um número pequeno e verdadeiro, ao lado de nove sites que inflam, é diferenciação
por contraste.

Sem esses três, esta página é intercambiável com as dez. Com eles, não é.

---

## Decisões técnicas

- **HTML e CSS nativos**, sem framework. É o padrão das quatro pastas de cliente,
  é o que o detector do impeccable lê, e é o que a Hórus entrega
- Fontes por Google Fonts com `preconnect`, igual Aion e Grão da Serra
- Imagens em WebP, no tamanho de exibição. Arte-fonte fora de `assets/`
- Toda animação em `transform` e `opacity`, com `IntersectionObserver`.
  Nenhum listener de scroll
- `prefers-reduced-motion` respeitado em tudo, inclusive na esteira
- `scroll-margin-top` em toda âncora

### Duas armadilhas novas, para o próximo site

**Elemento no fim da dobra nunca cruza o limiar do `IntersectionObserver`.** A
faixa de credenciais fica na borda inferior do hero, e com `rootMargin` negativo
só uns poucos pixels dela entravam na área de interseção: abaixo do `threshold`,
então ela **ficava invisível até alguém rolar**. Parece elemento faltando.
Regra: nada acima da dobra depende de rolagem para aparecer. O que está no hero
entra na carga, com atraso em cascata; o observador cuida do resto da página.



`scroll-behavior: smooth` no `html` **quebra o print de seção no headless**: o
Chrome não completa a rolagem dentro do orçamento de tempo virtual, e a seção sai
preta porque os elementos `.rev` ainda estão em `opacity:0`. Parece bug do site e
não é. Para conferir uma seção, trocar temporariamente para `auto`, tirar o print,
e restaurar. Isso complementa a armadilha dos 390px em `99-checklist.md` §4.
