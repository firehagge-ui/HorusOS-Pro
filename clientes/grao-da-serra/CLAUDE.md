# Café Grão da Serra — Nelson

> Projeto criado em 29/07/2026. Pasta dedicada — instruções aqui sobrescrevem as
> da raiz quando relevantes.

## Sobre

Entregar um **site** para o Café Grão da Serra (café torrado 100% arábica,
artesanal, Salvador e região), **de graça**, como peça de portfólio da Horus, e
usar a conta aberta para trabalho pago depois.

## Tipo

Cliente novo. Chegou por relação: o Antonio (sócio) já era amigo do Nelson.
**Trabalho não pago**, por decisão da agência, com contrapartida de portfólio.

## Entregas previstas

1. **Google Meu Negócio** ← prometido ao cliente para 29/07
2. **Site institucional** ← o combinado, de graça. **Institucional, não loja**
3. **CRM** ← pedido explícito do cliente: acompanhar clientes e produtos,
   atualizar faixa de preço, com painel do gestor e painel dos funcionários.
   **É trabalho pago, com escopo próprio.** Não deixar virar extensão do grátis
4. Tráfego pago (oportunidade, não vendida)

## Estado do site (30/07/2026)

`site/index.html` + `site/assets/site.css`. **One-page, 8 seções, escrito.**

- ✅ Detector do impeccable **zerado** (`exit 0`), depois de 35 achados corrigidos
- ✅ Peso da pasta: **102 KB**, muito abaixo da meta de 1 MB
- ✅ Favicon 32 e 180, logo do cabeçalho recortada (o PNG original tinha o emblema
  ocupando só 510×622 de 1024×1024, e ficava quase invisível em 46px)
- ✅ Renderizado e conferido em headless: hero cabe na dobra em 1440×900
- ⚠️ `noindex` ligado. **Retirar no dia da publicação, e não antes**
- 🔴 **A arte-fonte fica em `site-fontes/`, fora da pasta que vai ao ar.** O PNG de
  1024px sozinho valia 1,5 MB, quinze vezes o site inteiro

**Decisões de CSS que não devem ser desfeitas sem motivo:**

- `--secao:#54321F` é um **degrau criado**, não é da paleta oficial. Existe porque
  o `#764D36` da paleta reprova como fundo de texto (creme 4,44:1). O `#764D36`
  virou `--borda`, sem texto por cima
- **Source Sans 3, não Inter.** O detector marca Inter como fonte saturada
- `.pend` **sem** `border-radius`: borda de acento num lado + canto arredondado é
  o antipadrão `border-accent-on-rounded`
- Sem barra lateral colorida em destaque (`side-tab`)
- `padding` em valor literal + media query, **nunca `clamp()`**: o detector não
  resolve `clamp()` em padding e acusa `cramped-padding` falso
- O botão de alternar pendências fica **fora** da faixa `.aviso-demo`, senão some
  junto com ela e não há como voltar

**Seção deixada fora de propósito:** "De onde vem" (a origem do grão). Só entra
depois de o cliente confirmar que o café vem de produtores da região Serrana.

### 🎨 Imagem gerada: a linha que separa o que pode do que não pode

As quatro etapas do processo usam **ilustração em traço dourado gerada por IA**
(Higgsfield, `nano_banana_pro`, 2 créditos cada, 30/07/2026). Isso é permitido, e a
distinção que autoriza é simples:

- ✅ **Ilustração pode.** Desenho em traço não finge ser registro. Ninguém olha um
  pilão desenhado a linha e conclui que é a foto do pilão do pai dele. E o traço
  dourado é o mesmo vocabulário da logo, então a página fica mais coesa
- 🔴 **Foto documental gerada por IA não pode.** Cafezal, terreiro ou torra em
  estilo fotográfico seriam representados como registro da operação da família, o
  que é falsear origem num produto alimentício. É o caso do teardown da Fazenda São
  Gabriel (`referencias/fazenda-sao-gabriel-atacado.md`), onde a foto de pousada
  inventada aparecia num site que vende "origem verdadeira"

**Regra prática:** se a imagem responde "como é o processo", ilustração resolve. Se
ela responde "é assim que ELES fazem", só foto real serve.

### Atualização de 30/07: fotos realistas entraram, marcadas como provisórias

O Marcelo pediu imagens realistas, paisagem e folhas, com as ilustrações rebaixadas
a fundo discreto. Feito, e o conflito com integridade foi resolvido pela
**marcação**, não pela recusa:

- Toda foto gerada carrega um rótulo **"Imagem provisória"** visível, na classe
  `.fig .rotulo`, que some no modo limpo junto com os outros `.pend`
- As ilustrações viraram **marca-d'água a 16% de opacidade** ao lado do número da
  etapa (`.selo-ilustra`)
- Quando as fotos do Nelson chegarem, é troca de arquivo e remoção do rótulo

🔴 **O caso que quase passou:** a primeira foto de hero veio com **um cafezal ao
fundo e alguém colhendo**, ou seja, exatamente a afirmação que o projeto inteiro
evita. Foi descartada e regerada com `no coffee trees, no plantation, no field,
no crops, indoors only` no prompt.

**A lição:** o modelo preenche o contexto óbvio do assunto. Café puxa cafezal. Em
cliente cuja história depende de **não** fazer parte do processo, o prompt precisa
proibir explicitamente, e **cada imagem tem que ser olhada uma a uma** antes de
entrar. A paisagem e a secagem passaram porque não têm lavoura; o hero não passou.

**Arquivos:** WebP em `site/assets/etapa-0*.webp` (39 KB no total), com os PNG de
1k guardados em `site-fontes/`. Prompt e estilo ficam em `marca.md`.

## Onde salvar o que

- Briefing e contexto: `briefing.md`
- Identidade visual do cliente: `marca.md`
- Roteiro de reunião: `roteiro-call-<data>.md`
- Entregas: `site/`, `google-meu-negocio/`

## Contexto que herda da raiz

Herda tom de voz, processo e contexto da agência de `_memoria/` e `identidade/`.
Ao produzir peça PARA o Grão da Serra, a marca é a do cliente (`marca.md` desta
pasta), **não** a da agência.

Vale integralmente aqui:
- `_memoria/integridade.md` — nada inventado, placeholder marcado
- `_memoria/design/` — leitura obrigatória antes da primeira linha de HTML, com o
  passe duplo do `00-anatomia.md`
- `_memoria/design/99-checklist.md` mais o detector, antes de entregar:
  `npx --yes impeccable@3.4.0 detect "clientes/grao-da-serra/site"`

## Específico desse projeto

**Não é setor regulado por conselho.** Não existe aqui a trava de compliance que
existe em Giovanni (CFO) e Aion (CFP). Mas existe regra de alimento: sem alegação
de saúde ou funcional, e alegação de composição é do produtor. Detalhe em
`marca.md`.

**A marca visual do cliente já existe e é consistente** (logo em emblema, dourado
sobre marrom escuro, tipografia serifada). O site usa a marca dele. Não propor
rebranding sem ser pedido, e nunca como puxadinho de um trabalho de graça.

**⚠️ O risco de invenção deste cliente é o jargão de café.** Nota de degustação,
pontuação SCA, altitude, variedade, nome de fazenda e região só entram se o
cliente tiver dito. É o caso clássico de invenção por motivo estético do
`integridade.md`, e aqui vira alegação falsa sobre alimento. Lista completa do
que é proibido escrever sem fonte está em `marca.md`.

**O nome tem homônimos em café, e o `.com.br` está tomado** por uma operação de
1995 da Serra da Mantiqueira/SP. Consequência prática: **SEO pelo nome da marca é
briga perdida**. A estratégia é local (Salvador, Google Meu Negócio, "café
artesanal Salvador") mais ancoragem da marca na Bahia, que é o eixo que o próprio
cliente já usa ("orgulho da Bahia"). Ver `briefing.md`.

**Registro de marca no INPI não foi verificado e a Horus não dá parecer sobre
isso.** O que cabe é informar o cliente e recomendar a busca.

**Grafia:** "Café Grão da Serra". Handle do Instagram é `@graodaserra__`, com
**dois** underscores.

**🔴 NÃO aplicar estilo do Tier 2 do `identidade/catalogo-estilos.md`** (decisão do
Marcelo, 30/07/2026: *"faça de acordo com o que o cliente quer, não vamos inventar,
lembre-se dos tons naturais e paleta de cores"*).

É a regra 1 do próprio catálogo: cliente com marca definida usa a marca dele. A
`marca.md` já fixa paleta oficial de 9 cores, logo, tom de voz e a direção de tons
naturais pedida pelo cliente. **Não sobrou vazio para um estilo preencher.**

O que continua valendo: `taste-skill` (ferramenta anti-template, não sobrescreve
cor nem fonte), `output-skill` se o HTML crescer, e `/verificar` mais o detector do
impeccable antes de entregar.

Toda cor sai da tabela de papéis da `marca.md`. Nada de cor nova, nada de gradiente
de acento, nada de "melhorar" a paleta.

**O negócio é B2B e o dono opera sozinho.** O site institucional fala com **quem
compra para revender** (padaria, mercadinho, cafeteria, escritório), e não só com
quem toma café. Quem responde o WhatsApp é ele mesmo, então qualquer CTA cai no
colo de uma pessoa só: não desenhar fluxo que pressupõe equipe.

**🔴 A família NÃO tem lavoura.** O pai **compra o grão maduro de produtores**,
seleciona, e faz pilagem, secagem, torra e moagem. Ele **não planta e não colhe**.
Está proibido escrever "nossa lavoura", "nossa fazenda", "cafezal", "produzimos",
"do pé à xícara". O diferencial verdadeiro é **a escolha do grão e o
beneficiamento artesanal**: "a gente não planta, a gente escolhe". Esse dado
chegou errado de segunda mão e foi corrigido pelo próprio cliente; a descrição do
Google Meu Negócio já estava escrita com a versão falsa. Ver `briefing.md`.

**A origem é geográfica e é o ativo de marca:** o MEI dele fica no **Distrito
Serrana, Brejões/BA**. "Grão da Serra" é o lugar onde ele está, e a região
"Serrana de Itiruçu/Brejões" é área cafeeira reconhecida. ⚠️ Mas **ainda não foi
confirmado que o grão que o pai compra vem de lá**. Enquanto isso, não usar a
região, a altitude nem a tradição cafeeira de Brejões como credencial do produto.

**Direção visual pedida por ele:** manter o marrom e trazer interior, verde, mato.
O verde entra como acento e, principalmente, **por fotografia real do
beneficiamento** (pilão, secagem ao sol, torra, grão cru ao lado do torrado, mãos
selecionando), **não** por foto de cafezal, que não é dele. Detalhe em `marca.md`.

**Escopo do grátis ainda não está fechado** (páginas, rodadas de ajuste, prazo) e
a autorização de uso como portfólio ainda não foi obtida. Enquanto isso estiver
em aberto, não iniciar produção de HTML: o risco não é técnico, é de retrabalho
infinito.
