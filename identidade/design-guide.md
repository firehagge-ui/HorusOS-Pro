# Identidade visual — Hórus (agência)

> Marca da AGÊNCIA (Hórus), aplicada nas peças internas/institucionais (proposta,
> apresentação da Hórus, site institucional, conteúdo da própria agência).
>
> ⚠️ NÃO é a marca dos clientes. A identidade de cada cliente vive em
> `clientes/<nome>/marca.md` — é ela que as skills de site/carrossel/slide
> devem ler ao produzir PARA um cliente.
>
> Ex.: marca do cliente #1 → `clientes/dr-giovanni-nascimento/marca.md`

**Fonte deste arquivo:** manual de marca e logo enviados pelo Marcelo em
04/08/2026 (dois boards: logo horizontal e manual completo com paleta, tipografia,
ícones, aplicações e tom de voz). Até essa data o arquivo estava em branco, e a
estratégia registrava isso como buraco declarado.

---

## Nome e assinatura

- **Marca:** Hórus (com acento, caixa alta no logotipo: `HÓRUS`)
- **Descritiva oficial:** `AGÊNCIA` — decisão do Marcelo em 04/08/2026
- **Assinatura completa:** símbolo (olho de Hórus) + fio vertical + `HÓRUS` +
  `AGÊNCIA` em tracking largo por baixo
- ⚠️ O manual de marca traz `PUBLICIDADE` como descritiva, e o mockup de Instagram
  traz `@horuspublicidade`. **A descritiva que vale hoje é `AGÊNCIA`.** O manual
  está desatualizado nesse ponto e o @ do Instagram precisa ser confirmado antes
  de entrar em qualquer peça
- ⚠️ `_memoria/empresa.md` grafa "Horus" sem acento. Grafia correta da marca é
  **Hórus**; o nome do repositório e das pastas segue sem acento por conveniência
  técnica, e isso não é erro

---

## Cores

Os cinco hexes abaixo são os oficiais do manual.

- **Azul primário / CTA:** `#2563EB`
- **Azul claro (apoio, hover, destaque em texto):** `#60A5FA`
- **Dourado (acento raro, a pupila do olho):** `#F4C430`
- **Grafite (cards, superfície elevada):** `#3B3F46`
- **Off-white (texto principal sobre escuro):** `#E5E7EB`
- **Fundo principal:** `#0A0B0F` — ✅ **medido em 05/08/2026** no PNG da marca
  (`site/site-fontes/`), amostrando o fundo. Ele não está na paleta de cinco
  cores do manual, mas está no arquivo, e medir é melhor que estimar.
  A primeira versão do site usava `#0A0C12`, que era chute e errou por pouco

⚠️ **31/08/2026 — no SITE institucional o AMARELO da marca (#F4C430) VOLTOU e o
laranja (ember n8n) saiu.** O Marcelo apontou que o laranja era cor importada do
n8n e a logo tem amarelo. O token `--ember` do `site/assets/site.css` passou a
carregar o amarelo `#F4C430` (gradiente amarelo→dourado `#dca514`), propagando para
todos os CTAs, acentos e marcadores. O fundo do hero (fundido com a Seção 1) usa
amarelo à esquerda + azul da logo (`#2563EB`/`#60A5FA`) à direita, no esquema do
print 4. ⚠️ **Texto sobre amarelo é escuro** (`var(--tinta)`), nunca branco (branco
sobre amarelo reprova WCAG). O ELECTRIC azul→violeta segue nos links/foco/conexão.
Isto vale para o **site institucional**; peças/carrossel e clientes seguem as regras
abaixo. Detalhe da rodada em `site/CLAUDE.md` (v13). O bloco n8n abaixo é o contexto
anterior (amarelo tinha saído na migração de 28/08); esta linha o corrige.

⚠️ **28/08/2026 (fim do dia) — o SITE institucional migrou para a IDENTIDADE n8n.**
O Marcelo mandou o design system do n8n como referência e pediu para aplicar ao site
inteiro. O amarelo saiu de vez (⚠️ revertido em 31/08, ver acima). A identidade n8n do
**site institucional** (não das peças/carrossel, que seguem a paleta da casa abaixo):

- **Fundo VOID violeta-preto** `#0e0918` (nunca `#000` puro; o subtom violeta é
  proposital). Superfícies por DEGRAU DE COR: void → `#1a1624` (card) → `#1b1728`
  (painel). Elevação por cor, não por sombra externa.
- **EMBER** `linear-gradient(30deg, #fd8925, #ff0c00)` — laranja→vermelho, **SÓ em
  CTA primário**. É o único quente-cromático acima da dobra.
- **ELECTRIC** `linear-gradient(141deg, #077ac7, #6b21ef)` — azul→violeta, em link,
  foco, linha de conexão, estado ativo.
- **Texto:** ash `#d1cece` (corpo, nunca branco puro no corpo), fog `#9d9797`
  (secundário), branco `#ffffff` só em título/ênfase.
- **Tipografia:** UMA família geométrica leve. geomanist não é web-livre → **DM Sans**
  (o substituto do próprio manual), peso **300 no display** (o título "sussurra",
  line-height apertado ~0.94, tracking negativo) e 400 no corpo.
- **Formas:** botão/input 8px, card 16px, painel 24px, pílula só em tag/ícone.
- **Header:** fixo, efeito glass, arredondado, sem contorno.

🔴 **Texto de MARCA (o Marcelo mandou anotar, vale para qualquer peça da Hórus):**
*"A Hórus usa o que há de melhor do mercado e o que há de mais moderno em tecnologia.
Nós nos esforçamos para projetar experiências modernas e estratégicas para marcas de
todos os tamanhos, alinhadas às tendências e tecnologias atuais, com uma equipe
criativa e especializada. Com estratégias digitais inteligentes, desenvolvemos
experiências mensuráveis e de alta qualidade para todos os setores."*

Fica em `site/assets/site.css §1` a verdade dos tokens. Detalhe da migração em
`site/CLAUDE.md` (v12). O bloco abaixo (paleta com papéis, âmbar/azul) é **histórico**
do mesmo dia, já superado pela identidade n8n.

⚠️ **28/08/2026 — a identidade do SITE ganhou paleta com PAPÉIS (não uma cor só).**
Contexto: uma primeira tentativa promoveu o dourado a co-primária e virou uma landing
"liquid-glass" de uma cor só; o Marcelo rejeitou ("ficou brega, sem identidade") — o
card foi salvo em `_biblioteca/inspiracoes/card/card-vidro-liquido/` e a landing
descartada. Depois, estudando 5 referências (lessestudio, xmethod, wibify, amphora,
matveyan), o **site institucional** foi recolorido com um sistema de papéis:

- **Chão:** carvão quente `#17130E` (medido). Ink `#F0EBE1` / `#B7AE9C`.
- **Âmbar `#E7B34A` + azul `#5B8DEF` são co-primárias** (o azul VOLTOU; estava banido
  desde 26/08, quando tudo virou âmbar). Dourado `#F4C430` segue como brilho pontual.
- **Conjunto disciplinado de acentos** dá cor própria a cada card sem virar arco-íris,
  mesma saturação/valor, só o matiz muda: âmbar, azul, verde-água `#3FBFA3`, coral
  `#F0785C`, violeta `#A98BF0`. Usado nos 5 compromissos e nas 4 etapas.
- **As seções VIAJAM por cores diferentes ao rolar** (hero âmbar→azul, serviços
  azul/teal, compromisso policromo, etapas azul→coral). É o antídoto ao "uma cor só".
- **Camada técnica:** `JetBrains Mono` nos números de seção, rótulos e fichas (dá cara
  de instrumento). Display segue Sora, corpo Hanken Grotesk.

⚠️ Isto vale para o **site institucional** (é a verdade do `site/assets/site.css`).
As peças/carrossel seguem a paleta da casa abaixo. Em **site de cliente**, cada
cliente segue o `marca.md` dele. A regra "dourado raro" abaixo continua valendo
para PEÇAS e clientes; no site institucional o dourado divide o palco com o azul.

**Regras de uso (peças e clientes):**
- O **dourado é a cor mais rara da marca**. No logo ele é um ponto só (a pupila).
  Usar como acento pontual, nunca como cor de fundo nem de bloco inteiro
- Marca nasceu em fundo escuro, mas o manual aprova fundo claro e fundo colorido.
  **Fundo complexo (foto sem tratamento) é o único reprovado** no manual
- ⚠️ **Brilho, e onde fica a linha.** Azul saturado sobre quase-preto é o
  território de `dark-glow` e `radial-spotlight-glow` em
  `_memoria/design/90-antipadroes.md`. Em 05/08/2026 o Marcelo escolheu a
  linguagem escura com acento forte, a partir de dez referências
  (`referencias/agencias-ia-dez-sites.md`), e **brilho passou a ser permitido na
  marca da própria Hórus, com duas condições:** ele é sempre do azul da marca, e
  fica sempre **atrás de um objeto de verdade**, nunca solto atrás de um título.
  Halo sem deslocamento em card e mancha de luz em canto de seção continuam
  proibidos. Em site de cliente nada disso muda: a regra genérica continua
- ⚠️ Contraste se mede contra o fundo real da seção. `#2563EB` sobre quase-preto
  passa em título grande e **reprova em texto corrido**: o degrau para link e
  texto pequeno é o `#60A5FA`. Mesma lição da paleta terrosa da Aion
  (`99-checklist.md` §2.5)

---

## Tipografia

- **Fonte oficial do manual:** Montserrat (regular e light)
- **No logotipo:** Montserrat, e continua assim. O logo é arquivo fechado
- **No site e nas peças:** **outra família** — decisão do Marcelo em 04/08/2026
- **Peso do título:** o logotipo usa peso médio com tracking aberto na descritiva

**Por quê:** Montserrat é o primeiro item da seção de tipografia de
`_memoria/design/90-antipadroes.md` ("as três fontes mais usadas em site gerado
por IA. Não são feias, são gastas"). Uma agência que vende site não pode entregar
o próprio site com a fonte que denuncia site de IA. O logo é imagem e não sofre
disso; texto corrido sofre.

- ✅ **Escolhida em 04/08/2026: Sora no display e Archivo no corpo.** Sora é
  geométrica e conversa com o traço do logotipo; Archivo é grotesca de abertura
  fechada e lê bem em corpo pequeno. Nenhuma das duas está na lista de queimadas
  (Montserrat, Poppins, DM Sans, Inter, Fraunces, Instrument Serif)
- ⚠️ **O SITE institucional divergiu em 26/08/2026** (pedido do Marcelo: "muda a
  fonte do site pra algo melhor"). Depois de passar por Bricolage e Fraunces (as duas
  descartadas), a **Direção C** fechou o site em: **Sora** (display) + **Hanken
  Grotesk** (corpo) + **Newsreader** itálico no acento (`.ouro-it`). É a verdade do
  `site/assets/site.css`. É **só o site** por ora — as peças/carrossel continuam em
  Sora + Archivo. Se o Marcelo quiser padronizar a casa toda no par do site, esta
  linha vira a decisão.
  Nota: o detector do impeccable reprovou **Inter** e **Instrument Serif** (as
  duas já estavam na lista de queimadas acima), o que confirmou a escolha final.

---

## Estilo geral

Escuro, geométrico, sóbrio. Muito espaço negativo. O símbolo do olho é forte o
bastante para carregar a página sozinho, o que significa que o resto tem que ficar
quieto em volta dele (regra do elemento-assinatura, `00-anatomia.md`).

---

## Elementos-chave

- **Símbolo:** olho de Hórus estilizado em traço, azul primário + branco, pupila
  dourada
- **Elemento gráfico de apoio:** feixe de linhas finas em onda, azul sobre escuro.
  Existe no manual como textura de rodapé e de fundo de faixa
  ⚠️ **Uma aparição por página, no máximo.** Elemento decorativo repetido em
  escalas diferentes é antipadrão registrado (caso Grão da Serra, 03/08/2026)
- ⚠️ **O símbolo do olho ampliado como marca-d'água de fundo está proibido.** É
  antipadrão explícito da casa (caso Aion, 28/07/2026): é o mesmo desenho duas
  vezes na página. O elemento de linhas em onda existe justamente para isso
- **Ícones do manual:** estratégia, criatividade, resultados, parceria, visão.
  Traço fino, mesma família. Se o site precisar de ícone, sai daqui ou de uma
  biblioteca só, nunca desenhado à mão em SVG
- **Fio vertical** separando símbolo e logotipo é parte da assinatura
- **Superfície de vidro** (escolhida em 05/08/2026, no site institucional): fundo
  translúcido claríssimo, fio de borda claro e um brilho especular de 1px na
  aresta de cima. É a linguagem de card, rótulo e botão da marca da agência.
  ⚠️ **Vidro aqui é luz, não desfoque.** `backdrop-filter` só entra em painel que
  passa por cima de conteúdo (cabeçalho fixo, menu de celular). Desfoque em card
  parado sobre fundo chapado continua sendo efeito sem função
- **Metal líquido** no CTA: aro de shader correndo em volta de uma pílula de vidro
  escuro, em preto, azul da marca e branco. Existe **só no botão**, e é o único
  lugar da marca em que há movimento contínuo. Espalhar para faixa, card ou fundo
  transforma acabamento em papel de parede
- Bordas, raio de card, botões e sombras: raio de 12 a 16px em card, pílula em
  controle clicável, e elevação declarada uma vez só (borda **ou** sombra, nunca
  as duas). O vidro é a exceção medida: fio claro mais especular **de dentro**,
  que não é a sombra larga do card fantasma

---

## Tom de voz

Os quatro atributos são do manual:

| Atributo | O que significa lá |
|---|---|
| **Claro** | Comunicação direta e objetiva |
| **Estratégico** | Foco em soluções inteligentes |
| **Inovador** | Criatividade com propósito |
| **Confiável** | Parceria sólida, foco em resultados |

**Assinatura verbal do manual:** "Visão que conecta. Estratégia que transforma."

**Texto institucional do manual:** "A Hórus é movida por visão, criatividade e
estratégia para transformar marcas em referências. Enxergamos além. Entregamos
resultados."

⚠️ **Tensão real, e ela precisa ser decidida antes do site:** o parágrafo
institucional acima usa "transformar", "soluções" e "resultados", que estão na
lista de verbo de folheto de `_memoria/design/90-antipadroes.md` (seção Conteúdo).
Vale como declaração de marca num manual; **não** funciona como copy de hero de
uma agência que vende exatamente a competência de escrever melhor que isso.

Duas saídas, e a escolha é do Marcelo:
1. A assinatura verbal fica como assinatura (rodapé, peça institucional) e o site
   escreve a promessa em linguagem concreta
2. A assinatura verbal é reescrita, e o manual se atualiza junto

Ver `_memoria/preferencias.md` → "O que evitar (padrão da casa)". E a regra do
tracinho vale aqui como em tudo: nunca `—` / `–` / ` - ` como separador em copy.

---

## O que NUNCA fazer

- Logo sobre fundo complexo (foto sem tratamento) — reprovado no próprio manual
- Símbolo do olho ampliado como marca-d'água atrás de seção
- Dourado como cor de bloco ou de fundo. Ele é pontual
- Montserrat em título ou corpo de site e de peça (só no logotipo)
- Halo colorido em card, mancha de luz solta em canto de seção, e gradiente com
  glow atrás de título. Brilho só atrás de objeto, e só no azul da marca
- Gradiente aplicado em texto. Some no celular e não copia direito
- Distorcer, rotacionar ou recolorir o símbolo fora da paleta

---

## Logo

- **Arquivos disponíveis** (recebidos em 05/08/2026, em PNG):
  - `site/assets/simbolo.webp` — símbolo isolado, fundo transparente, 96px
  - `site/assets/assinatura.webp` — assinatura horizontal completa, 520px
  - `site/site-fontes/marca-simbolo.png` e `marca-assinatura.png` — as fontes
    em PNG com alfa, recortadas do board e com o fundo removido por luminância
- ❓ **Ainda falta o vetor (SVG ou AI/EPS)**, mais a versão em fundo claro e a
  monocromática. O que existe é bitmap: serve para tela, não escala para
  impressão nem para aplicação grande
- **Onde usar:** header do site, header de propostas, slides institucionais,
  avatar de redes
- **Variações previstas no manual:** símbolo em fundo escuro, símbolo em fundo
  claro, logotipo sem símbolo

---

## Observações adicionais

- **Dados operacionais que faltam** para qualquer peça pública da Hórus: domínio,
  WhatsApp, e-mail, @ do Instagram, cidade e CNPJ. Nenhum deles pode ser inventado
  (`_memoria/integridade.md`)
- **Prova de trabalho:** até 04/08/2026 nenhum cliente autorizou uso como
  portfólio. Grão da Serra tem a autorização em aberto e registrada como pendência;
  Aion é projeto especulativo sob Deployment Protection; Dr. Giovanni está fora da
  linha de frente. Case com nome só entra no site com "sim" por escrito
