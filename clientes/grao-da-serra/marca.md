# Marca — Café Grão da Serra

> ⚠️ **Tudo abaixo é leitura visual do Instagram dele** (@graodaserra\_\_,
> observado em 29/07/2026), não é manual de marca entregue pelo cliente.
> Os valores de cor são **amostragem a olho**, não os oficiais. Confirmar com o
> arquivo original do designer que fez a logo.
>
> **A marca dele já existe e tem consistência.** Isso muda o discurso da agência:
> não chegamos oferecendo logo, chegamos usando a logo dele. Se em algum momento
> houver proposta de mexer no visual, é conversa separada e paga, não um puxadinho
> do site de graça.

## Nome

**Café Grão da Serra** (a logo grafa "CAFÉ GRÃO DA SERRA", com "· 100% ARÁBICA ·"
como assinatura abaixo).

Handle: **@graodaserra\_\_** (dois underscores, fácil de errar).

## Logo (arte em alta recebida em 30/07/2026)

**Composição, de cima para baixo:**

- **Emblema circular** com um anel aberto (o círculo não fecha, o vapor atravessa)
- **Serra** desenhada em duas montanhas dentro do anel ⭐ é o nome virando imagem
- **Xícara** na base, com asa
- **Vapor em traço contínuo** subindo em "S", que amarra montanha e xícara num
  gesto só. É a melhor decisão do desenho
- **Grão de café** no topo do vapor, e outro menor separando o lettering
- Lettering em três níveis: `CAFÉ` com tracking largo · `GRÃO DA SERRA` em serifada
  de alto contraste · `· 100% ARÁBICA ·`

**O símbolo lê bem pequeno**, o que é o teste que importa: funciona como favicon e
como ícone do perfil.

⚠️ **A arte tem relevo e textura metálica** (emboss, brilho, gradiente dourado).
Isso é acabamento de apresentação, e na web tem duas consequências:

1. **Usar a logo como imagem, sempre.** Não tentar reconstruir o metálico em CSS
2. **Não estender o efeito ao resto da interface.** Botão com gradiente dourado e
   sombra imitando metal envelhece a página na hora. O site usa o dourado `#D6B35F`
   **chapado**; o brilho fica só na logo

### Arquivos que temos

| Arquivo | O que é | Estado |
|---|---|---|
| `site/assets/logo-simbolo.png` | **só o emblema**, sem lettering, 1024×1024 | ✅ **transparente** (`Format32bppArgb`, alpha 0 nos cantos) |
| (recebido em conversa) | logo completa com lettering | ⚠️ fundo sólido `#3D2115` |

**Sobre o `logo-simbolo.png`:** 84,3% dos pixels são transparentes, 10,7% opacos e
**5% em alpha parcial**, que é o antialias das curvas finas mais uma sombra suave
embutida. Na prática funciona bem sobre o marrom da marca. Sobre fundo claro, olhar
se a sombra cria halo.

Usos naturais: **favicon**, ícone, marca-d'água, e a versão reduzida do cabeçalho.

⚠️ **Antes de entrar em qualquer HTML:** o arquivo tem **1,5 MB** em 1024px.
Converter para WebP no tamanho de exibição, conforme a regra da casa em
`_memoria/empresa.md`. Logo de cabeçalho não precisa de 1024px.

❓ **Ainda falta:** vetor (`.ai`, `.svg`, `.eps`) e a **logo completa com lettering
em fundo transparente**. O que temos com lettering tem fundo sólido e só serve
sobre aquele mesmo marrom.

## ✅ Cores — paleta OFICIAL (recebida do cliente em 30/07/2026)

Nove cores, do manual de identidade visual dele:

`#3D2115` · `#764D36` · `#BB7C39` · `#B17242` · `#BD815F` · `#EFC294` · `#D6B35F`
· `#F3EA99` · `#FFFFFF`

⚠️ **Nove cores quase todas análogas** (marrom → âmbar → creme). Não existe acento
de matiz oposto, e vários tons médios não têm contraste entre si. Isso não é
problema da marca, é um risco de execução: usada sem critério, essa paleta gera
página monótona e texto ilegível.

### Contraste WCAG calculado (30/07/2026)

**Sobre o fundo escuro `#3D2115`:**

| Cor | Ratio | Veredito |
|---|---|---|
| `#FFFFFF` branco | 14,72:1 | ✅ qualquer texto |
| `#F3EA99` amarelo claro | 11,94:1 | ✅ qualquer texto |
| `#EFC294` creme | 8,98:1 | ✅ qualquer texto |
| `#D6B35F` dourado | 7,34:1 | ✅ qualquer texto |
| `#BD815F` rosado | 4,53:1 | ⚠️ passa raspando |
| `#BB7C39` âmbar | 4,24:1 | ⚠️ só título grande |
| `#B17242` terracota | 3,75:1 | ⚠️ só título grande |
| `#764D36` marrom médio | 2,02:1 | 🔴 **nunca como texto** |

**Sobre branco `#FFFFFF`:**

| Cor | Ratio | Veredito |
|---|---|---|
| `#3D2115` | 14,72:1 | ✅ qualquer texto |
| `#764D36` | 7,28:1 | ✅ qualquer texto |
| `#B17242` | 3,92:1 | ⚠️ só título grande |
| `#BB7C39` | 3,47:1 | ⚠️ só título grande |
| `#BD815F` | 3,25:1 | ⚠️ só título grande |
| `#EFC294` | 1,64:1 | 🔴 **reprova** |
| `#D6B35F` | 2,01:1 | 🔴 **reprova** |
| `#F3EA99` | 1,23:1 | 🔴 **reprova** |

### ⭐ A decisão de projeto que sai desses números

**O site é predominantemente escuro.** Não por gosto: a paleta dele só funciona
sobre `#3D2115`, onde quatro cores passam AA com folga. Sobre branco, os dourados
e cremes **todos reprovam** — dourado sobre branco é o erro clássico que vira texto
ilegível e cai direto na regra `low-contrast` do detector.

Isso também bate com a marca: a logo é dourada sobre marrom escuro, e as peças do
Instagram já são majoritariamente escuras.

### Papéis fixos (usar assim, não improvisar)

| Papel | Cor | Observação |
|---|---|---|
| Fundo base | `#3D2115` | o site inteiro nasce daqui |
| Superfície elevada (card, borda) | `#764D36` | **só superfície**, nunca texto |
| Texto principal | `#FFFFFF` ou `#EFC294` | creme para textos longos, é mais quente |
| Texto de apoio | `#EFC294` | |
| **Acento e botão** | `#D6B35F` | com texto `#3D2115` em cima = 7,34:1 ✅ |
| Destaque raro (número, palavra-chave) | `#F3EA99` | usar pouco, é o mais forte |
| Seção clara alternativa | `#FFFFFF` | texto em `#3D2115` ou `#764D36` |
| Decoração, ilustração, gradiente | `#BB7C39` `#B17242` `#BD815F` | 🔴 **nunca texto de corpo** |

Três das nove cores viram **decoração apenas**. Isso não empobrece a página: evita
o erro de usar cor de ilustração como cor de texto.

## ⭐ Direção visual pedida pelo cliente (call de 29/07/2026)

Palavras dele: manter as cores atuais, **principalmente o marrom**, e trazer para
o site **tons, imagens e coisas que remetem ao interior, ao verde, ao mato**.

Isso é instrução do cliente, então vale. Mas tem uma consequência de projeto que
precisa ser resolvida com cuidado:

**A marca hoje é bicromática** (dourado sobre marrom escuro). O verde é uma
**terceira cor** e, se entrar com o mesmo peso, briga com o dourado e o resultado
fica pesado, escuro e datado, que é o oposto de premium.

⚠️ **A paleta oficial dele NÃO TEM VERDE.** As nove cores vão de marrom a creme,
sem um único tom verde. O pedido contradizia o próprio manual.

### ✅ Verde aprovado pelo cliente em 30/07/2026

O Marcelo levou a questão ao Nelson, explicando verde, natural e referência ao
interior da Bahia. Resposta dele:

> "Seria interessante sim, **coisa pouca**, ficaria legal!"

Então o verde entra como **cor fora do manual, autorizada verbalmente, em dose
pequena**. Registrar assim importa: se um dia alguém comparar o site com o manual
de identidade, a diferença tem origem documentada.

### A cor escolhida: `#8A9A5B`

Contraste calculado sobre o fundo `#3D2115`, e o resultado é contraintuitivo:

| Verde | Ratio | Veredito |
|---|---|---|
| `#4A5D3A` verde-mata | 2,05:1 | 🔴 some no marrom |
| `#5F7346` verde folha profundo | 2,82:1 | 🔴 some no marrom |
| `#6B7F4E` oliva médio | 3,34:1 | ⚠️ só gráfico |
| **`#8A9A5B` sage** | **4,80:1** | ✅ **escolhido**, serve até como texto |
| `#9CAF6B` verde seco claro | 6,14:1 | ✅ alternativa se precisar de mais força |

**O achado:** num site de fundo escuro, o verde precisa ser **claro**. O
verde-mata profundo, que é a escolha instintiva para combinar com marrom, tem
2:1 e simplesmente desaparece.

E o sage dessaturado é a escolha certa por um segundo motivo: **verde saturado
briga com dourado**, os dois disputam a atenção. Dessaturado convive.

### A dose de "coisa pouca"

✅ **Pode:** detalhe gráfico, traço divisor, ícone, folha ou ramo decorativo,
estado de hover, marcador de lista, contorno fino.

❌ **Não pode:** fundo de seção inteira, botão principal (o botão é dourado
`#D6B35F`), título de seção, texto de corpo.

📏 **Regra prática: no máximo um elemento verde por seção**, e nunca dois verdes
diferentes na mesma página.

### O resto continua valendo

- Marrom escuro `#3D2115` é o fundo e a base
- Dourado `#D6B35F` é o destaque e o botão
- **A maior parte do "verde e mato" vem da fotografia**, não da interface: folha,
  terreiro, vegetação. Foto tem verde sem que a paleta precise ter
- O creme `#EFC294` é o que "abre" a página e evita o clima de porão. Esse é o
  papel que muita gente tenta dar ao verde sem precisar

**O que o pedido dele na verdade está pedindo:** ele não quer verde, ele quer
**interior, roça, origem**. Isso se entrega com **foto real**, não com cor.

🔴 **Mas atenção, e isso mudou:** a família **não tem lavoura**. O pai compra o
grão maduro de produtores e faz o beneficiamento. **Foto de cafezal está fora**,
porque o cafezal não é dele.

✅ **A foto que existe, e que é melhor:** o **beneficiamento**. É a parte visual
mais forte do negócio e ninguém no segmento mostra:

- O **pilão** e a pilagem ⭐ método tradicional, imagem que quase nenhuma marca tem
- O café **secando ao sol**, o terreiro
- A **torra** acontecendo, o grão mudando de cor
- **Grão cru ao lado do grão torrado**, o contraste
- **As mãos selecionando** o grão maduro, que é onde está a expertise da família
- O interior real: a casa, o terreiro, a paisagem de Brejões

⚠️ **Sem foto real, esse pedido não tem como ser bem atendido.** Cafezal de banco
de imagem é antipadrão duplo: denuncia site feito por IA **e** representa como
própria uma lavoura que não existe. Foto de celular com luz de janela é melhor
que qualquer banco de imagem.

## Tipografia

**Na logo (observado na arte em alta):**

- `CAFÉ` e `100% ARÁBICA`: serifada em caixa alta com **tracking muito largo**,
  estilo lapidar (família de Trajan/Cinzel)
- `GRÃO DA SERRA`: serifada de **alto contraste**, com serifas finas e barrigas
  grossas (família de Playfair/Bodoni/Prata)

**Nas peças do Instagram:** script caligráfico em itálico como contraponto
decorativo (visto em "Do grão à xícara"), nunca em bloco de texto.

**Recomendação para o site** ⚠️ [SEM FONTE — escolha da agência, o cliente valida]:

- **Títulos:** uma serifada de alto contraste que converse com o lettering, sem
  imitá-lo. Candidatas no Google Fonts: **Prata** (a mais próxima do lettering),
  Playfair Display, Cormorant Garamond
- **Corpo:** sans neutra e muito legível, porque o fundo é escuro e serifada fina
  em corpo pequeno sobre escuro cansa a vista. Candidatas: Inter, Source Sans 3
- **Não usar a caixa alta com tracking largo em texto corrido.** Ela é da logo e de
  rótulo curto. Em parágrafo, destrói a leitura
- **Não usar o script** em nada além de um eventual detalhe decorativo

## Tom de voz (observado)

Sóbrio, afetivo e artesanal. Não é jovem/descolado, não é gourmet-técnico de
café especial. Usa palavras como **puro, artesanal, selecionado, dedicação,
orgulho, nossa terra**. Fala de **origem e cuidado**, não de laudo e pontuação.

Eixos de posicionamento que **ele já escolheu** (e que o site deve respeitar em
vez de reinventar):

1. **100% arábica**, grãos selecionados
2. **Torra artesanal**, mais aroma e sabor
3. **Café puro**, em contraste com "café comum"
4. **Origem baiana**, "nasceu da nossa terra"

## Ilustração da marca (definida em 30/07/2026)

As ilustrações do site nascem do mesmo vocabulário da logo: **traço dourado
contínuo sobre marrom escuro, sem sombra e sem preenchimento**. Isso mantém a
página coesa sem precisar de mais uma linguagem visual.

**Prompt-base usado no Higgsfield (`nano_banana_pro`, 1k, 4:3, 2 créditos cada):**

```
Minimalist emblem illustration in the style of a luxury coffee brand mark.
Thin elegant continuous gold line art (#D6B35F) on a solid dark warm brown
background (#3D2115). Strictly two colors: gold linework on dark brown.
Centered composition, generous negative space, flat 2D line illustration,
NOT photorealistic, no shading, no gradient, no text, no letters, no watermark,
no logo. Subject: <o que a etapa mostra>
```

Feitas assim: a escolha do grão, a secagem no terreiro, o pilão, o torrador.

⚠️ **O "no text, no letters" não é capricho.** Modelo de imagem inventa letra
torta, e letra inventada num site de marca é o defeito mais visível que existe.

## ⚠️ Risco de invenção específico deste cliente

Café tem um vocabulário sedutor e fácil de forjar. **Nada disso entra no site sem
o cliente ter dito, por escrito ou em call:**

- 🔴 **Lavoura, fazenda, cafezal, "produzimos", "plantamos", "do pé à xícara"**
  → **a família não planta e não colhe.** Compra o grão maduro e beneficia
- Notas de degustação ("notas de chocolate, caramelo, castanha")
- Pontuação SCA ("85 pontos", "café especial")
- Altitude, variedade (Catuaí, Bourbon), processo (natural, cereja descascado)
- Nome de fazenda, de produtor, ou a região de origem do grão ⚠️ **ainda não
  confirmado de onde vem o café que o pai compra**
- Data de fundação, prêmio, certificação, selo de orgânico
- Volume ("mais de X clientes", "X kg por mês")

✅ **O que pode, e é o diferencial verdadeiro:** seleção do grão maduro, pilagem,
secagem, torra artesanal, moagem, beneficiamento feito pela família. A frase que
resume a marca é **"a gente não planta, a gente escolhe"**.

Esse é exatamente o caso que o `_memoria/integridade.md` chama de invenção por
motivo estético: a seção pede texto, o jargão preenche bonito, e o resultado é
uma alegação de produto falsa publicada no site de um comerciante de alimento.
Enquanto não confirmado, usar placeholder marcado.

## Observações de compliance (alimento, não é setor regulado por conselho)

Sem conselho de classe, então **não há a trava que existe em Giovanni e Aion**.
Mas há regra de rotulagem e publicidade de alimento:

- ❌ **Alegação de saúde ou funcional:** "emagrece", "acelera o metabolismo",
  "antioxidante que previne", "faz bem para o coração". Não entra
- ✅ **Alegação de composição** ("100% arábica", "café puro") pode, porque é
  afirmação do próprio produtor sobre o produto dele. A responsabilidade pela
  veracidade é dele, e vale confirmar que ele sustenta isso
- ⚠️ **"Café puro"** tem significado técnico (café torrado sem mistura de cevada,
  milho ou impureza). Usar porque ele usa, sem transformar em ataque a concorrente
  nominal
- ⚠️ **Superlativo** ("o melhor café da Bahia") é fraco e arriscado. Evitar por
  qualidade, não por norma
- Se o site vender online: CNPJ e endereço visíveis, política de troca e
  devolução, e direito de arrependimento de 7 dias (CDC art. 49)
