# Arquitetura e interiores no Awwwards: a lógica dos premiados (13/10/2026)

> Estudo feito com o Playwright (rolagem real, tela por tela) em 10 sites da categoria Architecture do
> Awwwards, a pedido do Marcelo, para o site da Débora Reis. Vale para qualquer escritório de arquitetura,
> interiores ou design de casa. Telas no scratchpad da sessão; o que importa está aqui.
>
> Sites: Stanzza (stanzza.design, interiores, Barcelona), Tarq (tarqstudio.com), LPAS (lpas.com), Santal
> (santalarch.com), Driessen (driessenarchitectuur.nl), Estudio Bang (bybang.co), Mathilde de Chiara
> (mathildedechiara.com), Loam House (residences.loamhouse.com.au), DVO (dvo.it), Wiemer (wiemer.store).

## A estrutura que se repete

| Ordem | Bloco | Quem faz | Por quê |
|---|---|---|---|
| 1 | **Foto real de ponta a ponta + uma frase** (manifesto), topo mínimo: marca, menu, um botão ("Request a call") | Stanzza, LPAS, Driessen | O trabalho é a prova; o texto só dá o tom |
| 2 | **Frase de posição curta** ("A home is a composition", "Grote plannen beginnen zelden met een tekening") | Stanzza, Driessen, Santal | Diz como pensam antes de mostrar o que fizeram |
| 3 | **Projetos como capítulos, com ficha**: nome, ano, área, prazo, cidade ("Project executed in 62 days · 150 m² · Barcelona") | Stanzza, Tarq, LPAS | Transforma foto bonita em problema resolvido (a tríade do `00-anatomia.md`) |
| 4 | **Processo com etapas numeradas**, de preferência com foto do trabalho acontecendo (Tarq: 01 a 04) | Tarq, LPAS ("Listen. Plan. Analyze. Shape."), Santal | Vende método e calma, não só estética |
| 5 | **O que o cliente pode esperar** (Stanzza: "One responsible lead", "Structured process", "Changes and costs, always visible", "Quality on site") | Stanzza | Responde ao medo de obra: atraso, custo, quem responde |
| 6 | **Sobre**: a fundadora com uma frase, números reais (anos, projetos) | Stanzza, Tarq | Rosto e trajetória |
| 7 | **Imprensa ou reconhecimento** (só quando existe) | Tarq (AD, Signature) | Autoridade emprestada de verdade |
| 8 | **Diário ou blog** | Stanzza, LPAS | Voz própria e conteúdo pro Google |
| 9 | **Perguntas que os clientes fazem** | Stanzza | Tira a objeção antes da reunião |
| 10 | **Contato que pede detalhes do projeto** ("Share a few details about your project and we'll come back with a clear plan") + rodapé com endereço | Stanzza, Driessen | O pedido é pequeno e concreto |

## Tipo e forma

- **Grotesca suíça domina**: Helvetica, Aeonik, Neue Montreal, Geist, Aktiv Grotesk (seis dos dez). Quando há
  serifa, é editorial com itálico de verdade: Instrument Serif (Stanzza), PP Editorial New (Mathilde).
- Muito espaço, fio fino, raio zero, foto grande. Pouca cor: a cor vem das fotos.
- **Loam House usa Cormorant Garamond + DM Sans**, e as duas estão na lista de fontes-reflexo da skill
  impeccable. Copiar a fonte da referência não é copiar a lógica.

## O que se aproveita e o que não

- ✅ Ficha em cada projeto, processo com prazo, perguntas, contato que pede detalhes: é o que converte.
- ✅ Um elemento de assinatura só (Stanzza: o desenho de linha do rodapé; Bang: as peças flutuando).
- ⚠️ Números do "Sobre" só se forem reais (anos de formada, sim; "182 projetos" inventado, nunca).
- ❌ Santal (tela preta com palavras girando por vários scrolls) e Estudio Bang (o nome parado com fotos
  voando por 56 mil pixels): conceito que esconde o argumento atrás de rolagem. Serve pra estúdio que vende
  o próprio conceito, não pra escritório que precisa de cliente (`60-motion.md`, régua do conceito-assinatura).

## Aplicado em

- Débora Reis, rodada 3 (`clientes/_prototipos/debora-reis/`, 13/10/2026): capa, manifesto com a estante como
  índice dos projetos, capítulo com ficha, processo com prazo e três compromissos, diário com os textos dela,
  sobre, perguntas, contato. Zodiak + Switzer.

## Stanzza em detalhe (medido com o Playwright, 13/10/2026)

- **Tipo, três degraus e só:** títulos Instrument Serif 72px (capa), 56px (seções), 40/32px (itens), entrelinha
  **0,88**; texto Helioscond (grotesca condensada) 18px, entrelinha 1,32, e 24px nos destaques; metadado 12px caixa
  alta com espaçamento de 0,16em, sempre entre colchetes (`[ COMPOSED ]`). Manuscrita (Katherine Plus) só em duas
  frases.
- **Grade visível:** seis colunas com fio de 1px quase transparente sobre o papel `#F4F3EB`.
- **Capa:** foto de ponta a ponta, título centralizado embaixo, uma linha manuscrita acima, uma frase abaixo; topo
  com "MENU ::" (pílula translúcida), a marca no centro e "REQUEST A CALL" com borda.
- **Composição:** título pequeno no centro e seis a oito miniaturas (130 a 300px) espalhadas, cada uma subindo num
  ritmo; dois parágrafos curtos nas bordas.
- **Projetos:** cena verde-oliva presa à rolagem; a foto começa enquadrada no meio e cresce até a tela; título
  embaixo à esquerda, ficha à direita (prazo, área, cidade), "01/05" com linha de progresso, dois botões no pé.
- **Processo:** coluna de fotos em preto e branco presa à esquerda, quatro itens `[01]` a `[04]` à direita com fio.
- **Evento escuro:** azul-marinho com desenho de linha, título que acende palavra por palavra, painéis que deslizam.
- **Fim:** números com foto no hover, fundador com frase manuscrita e cartão escuro, perguntas em sanfona,
  "Start with a conversation" e o croqui de uma casa no rodapé.
- **Aplicado:** Débora Reis, rodada 4. Trocamos a fonte (Boska no lugar da Instrument Serif, que o detector marca como
  batida) e o assunto (anotação à mão da arquiteta, desenho de estante com gato), mantendo o sistema.
- **Rodada 5 (14/10/2026):** o Marcelo achou a capa e a cena do projeto parecidas demais com a Stanzza. Ficou o sistema;
  a capa virou uma prancha com carimbo e os projetos viraram carrossel com composição própria em cada um
  (`_memoria/design/90-antipadroes.md`, "Referência obrigatória copiada na estrutura").

## Revisita de 25/10/2026: o que a Débora pediu, visto nas referências

> A pedido do Marcelo: procurar nas referências o que se parece com o pedido do áudio da Débora (22/10): prazos, site
> enxuto, as figuras geométricas "cada uma em uma página ou tirar", e a obra. Rolagem real com o Playwright, em 1440 px,
> em 13 sites: 7 já estudados (Stanzza, Tarq, LPAS, Mathilde de Chiara, Loam House, Telha Clarke, Simone Katherine) e 6
> novos (Beata Heuman, TWODESIGNERS, India Mahdavi, Studio Ashby, Paula Müller, Natália Salla). Somados aos estudos de
> 13/10 e 15/10, são cerca de 20 escritórios. Telas no scratchpad da sessão (somem com ela); o que importa está aqui.

| O que ela pediu | O que as referências fazem | O que aplicamos (25/10) |
|---|---|---|
| **Figuras geométricas, "cada uma em uma página"** | Nenhum dos ~20 recorta foto em arco, círculo ou quadro. A forma aparece **dentro** da foto (o arco da porta na India Mahdavi) ou como **desenho de linha** (a axonometria da Stanzza, o contorno de casa da Natália Salla). O que existe de "um por página" é **um capítulo por tela**: Loam House (01 a 06, uma ideia e uma foto por tela, com números) e Stanzza (um projeto por tela, com ficha). Busca na web por "arch-shaped" só achou template de Webflow e Squarespace | As molduras saíram de `projetos.html`. Os detalhes ficam do tamanho dos apartamentos, com a foto reta, um por bloco. O "um por página" dela ficou como um por bloco, grande |
| **Prazos** | Só a Stanzza dá prazo: na ficha do projeto ("Project executed in 62 days") e nas perguntas. Tarq e Stanzza mostram o processo em 4 itens numerados com foto de cada etapa (gente na mesa, amostra de material, obra); a Stanzza junta o rosto do responsável ("One responsible lead") | A régua de 4 etapas com o prazo dela fica: ela já passa todas as referências (nenhuma põe o prazo de cada etapa na home). Falta para chegar no nível da Stanzza: o prazo de um projeto entregue na ficha de cada apartamento e uma foto de cada etapa `[FALTA: dado e fotos dela]` |
| **Obra: "visita de arquiteta, não gestão"** | A Stanzza escreve exatamente isso como compromisso: "Quality on site: author supervision throughout construction", separado da construção | Fica na pergunta "Você cuida da obra?" (uma vez só; ela pediu sem repetição) |
| **Enxuto** | Tarq, Loam e LPAS: texto curto, um assunto por tela, foto grande. As brasileiras (Paula Müller, Natália Salla) são grade de catálogo com mais blocos | Duas repetições saíram: "Reforma de apartamentos" estava na capa e logo abaixo; "apresento orçamentos de empresas de obra" estava no Como trabalho e na pergunta da obra |
| **Foto do projeto com destaque** (pedido do Marcelo) | Stanzza: foto do projeto com ~72% da largura, título e ficha por cima das bordas. Loam: foto de ponta a ponta | No carrossel da home, a foto foi de ~42% para ~64% da largura e veio para perto do centro; o Rio Vermelho aparece deitado e o Aconchego quadrado (recorte), o Colorir cresce pouco porque o arquivo tem 628 px. A capa passou de 1180 para 1320 px de largura |

**O que não copiar:** a Stanzza com a foto no centro e o título por cima foi recusada pelo Marcelo em 14/10 (rodada 5,
"parecido demais"). A foto cresce, mas a composição continua sendo a do carrossel dela (texto ao lado, nota à mão).

## Como montam cada seção, e o que viramos no site da Débora (28/10/2026)

> Pedido do Marcelo: não comparar, e sim ver como as referências montam cada seção (o que põem, como organizam, layout,
> arte) e aplicar. Base: as telas da revisita de 25/10 (Stanzza, Tarq, Loam House, LPAS, Beata Heuman, Natália Salla,
> Paula Müller, Simone Katherine, Telha Clarke). Vale para qualquer escritório de interiores.

### A seção de abertura (logo depois da capa)

| Site | O que põe | Como organiza |
|---|---|---|
| Stanzza | `[ COMPOSED ]` + "A home is a composition." + dois parágrafos curtos (como trabalham; o que acreditam) | Título pequeno no centro, parágrafos nas bordas, 4 fotos retas de tamanhos diferentes subindo em ritmos diferentes |
| Tarq | "THE STUDIO" enorme + dois parágrafos (o que fazem) + as cidades + "Conoce nuestro estudio" | Texto à esquerda, **uma foto grande** à direita (o estúdio, gente trabalhando, preto e branco) |
| Simone Katherine | Frase grande em serifa + um parágrafo com o nome da fundadora e a cidade | **Uma foto grande** à esquerda, à direita uma média com o parágrafo e duas pequenas embaixo |
| Telha Clarke | "Telha Clarke is a Melbourne based Architecture & Interior Design studio..." | Frase enorme na largura toda, uma foto pequena e um parágrafo |
| LPAS | "Clear Process. Creative Results. Human Centered. Always Curious." + parágrafo + "More about us" | Só texto, à esquerda, antes da grade de projetos |
| Natália Salla | "BEM VINDO" + parágrafo + "Confira" | Texto curto, depois a grade de projetos |
| Loam House | Um capítulo numerado por tela: frase em serifa, uma linha, números | Foto de ponta a ponta, texto por cima |

**O padrão:** frase de posição (todas) + parágrafo curto do que fazem (7 de 9) + fotos retas de tamanhos diferentes, uma
dominante (Stanzza, Tarq, Simone, Telha) + um link para o "sobre" (Tarq, LPAS, Salla). A frase fica à esquerda em 6 de 9.
Nenhuma foto em forma geométrica. **Débora antes:** a frase centralizada sozinha, os lados vazios. **Débora agora:** a
pergunta e a resposta dela à esquerda e grandes; a estante dos livros grande; "Cada projeto parte de quem mora ali" com
"Conheça a arquiteta"; a cerâmica e o nicho azul menores e desencontrados, cada legenda à mão levando ao detalhe.

### Processo e prazos

| Site | O que põe | Como organiza, com que arte |
|---|---|---|
| Tarq | "NUESTRO PROCESO" enorme + 4 etapas | Numeral em itálico grande + nome da etapa, **uma foto por etapa** (reunião na mesa, amostras de material, render, obra) e 3 linhas de texto, em fila |
| Stanzza | `[01]` a `[04]`: responsável único, processo com aprovação, custos visíveis, supervisão na obra | Fotos em preto e branco presas à esquerda, itens com fio à direita; as fases (Arquitetura, Design, Entrega) em painel escuro com **axonometria em desenho de linha** |
| LPAS | "Listen. Plan. Analyze. Shape." | Quatro verbos em texto pequeno |
| Stanzza (FAQ) | O único que dá prazo, e só na ficha do projeto ("executed in 62 days") e nas perguntas | — |

**O padrão:** etapas numeradas, poucas linhas cada, e **uma imagem por etapa** (Tarq e Stanzza). Prazo por etapa: nenhum
dos ~20 escritórios. **Débora agora:** fica a régua com os prazos dela (o que nenhum tem) e entra um desenho de linha por
etapa, que é como a Stanzza ilustra as fases: a planta com as cotas (medição), a planta com os móveis e a mesa redonda
(estudo), a perspectiva com o nicho em arco (anteprojeto), a marcenaria com cotas e o detalhe circulado (detalhamento).
**As formas que a Débora pediu (círculo, arco, quadro) voltam aqui, uma por etapa, como desenho**, que é o único jeito em
que as referências usam forma geométrica. Quando houver foto real de cada etapa, ela entra no lugar do desenho (Tarq).

### Capa e projetos

- **Capa:** 9 de 9 abrem com foto do trabalho; Tarq e Paula Müller dão o nome do projeto da foto com um link. A da Débora
  segue o modelo (foto, frase à mão, título, serviço, formação, botão); não cresce mais porque o arquivo tem 1072 px.
  `[FALTA: de qual apartamento é a estante dos CDs, para pôr o nome e o link, como a Tarq]`.
- **Projetos:** um por tela com ficha (Stanzza: prazo, área, cidade). O carrossel dela já é um por tela; a ficha fica com
  o que se sabe (bairro). `[FALTA: prazo e metragem de cada apartamento, só a Débora]`.
