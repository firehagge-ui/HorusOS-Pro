---
name: carrossel
description: >
  Cria carrosséis e posts visuais pra Instagram, TikTok, LinkedIn com a identidade visual da marca.
  Gera HTML estilizado + renderiza em PNG 1080x1350 via Playwright, com legenda pronta no final.
  Suporta carrossel texto puro, carrossel com foto IA (gerada via OpenAI) e post único.
  Use quando o usuário pedir "carrossel", "post", "conteúdo pro instagram", "criar imagem",
  "gerar foto", "post educativo", ou /carrossel.
---

# /carrossel — Carrossel e posts visuais

Skill central de criação de conteúdo visual. Pega um tema → entrega HTMLs estilizados + PNGs prontos pra postar + legenda no padrão da marca.

## Leitura obrigatória antes da primeira linha de copy

1. `_memoria/conteudo/00-formatos.md` — os sete formatos narrativos. **Escolher UM antes de escrever**
2. `_memoria/conteudo/10-legibilidade.md` — os pisos de fonte, contraste e densidade
3. `_memoria/conteudo/90-antipadroes.md` — o que denuncia carrossel feito por IA
4. `_memoria/integridade.md` — se a peça é de cliente. Dado que falta vira `[FALTA: ...]`, nunca texto plausível

Antes de **entregar**, rodar `_memoria/conteudo/99-checklist.md`: as condições de
veto primeiro, a rubrica depois. Se a conferência não rodou nesta mensagem, não
dá pra dizer que passou.

## Dependências

- **Identidade visual:** `identidade/design-guide.md` — LER ANTES de criar qualquer visual
- **Contexto do negócio:** `_memoria/empresa.md`
- **Tom de voz:** `_memoria/preferencias.md`
- **Playwright:** pra renderizar HTML em PNG (`npx playwright screenshot` ou via `render.js`)
- **OpenAI API (opcional):** pra gerar fotos realistas — só se o cliente tiver chave configurada
- **Outputs vão em:** `marketing/conteudo/<tipo>-<tema>-<YYYY-MM-DD>/`

---

## Tipos de conteúdo

Ao receber um pedido, identificar qual tipo se encaixa:

### 1. CARROSSEL TEXTO PURO
- **Quando usar:** posts educacionais, dicas, listas, explicações
- **Formato:** 1080x1350 (4:5) — sempre
- **Estilo:** tipografia clean, cores da marca alternadas, sem fotos

### 2. CARROSSEL COM FOTO
- **Quando usar:** apresentação visual, conteúdo aspiracional, capa com personagem
- **Formato:** 1080x1350 (4:5)
- **Estilo:** foto como capa com gradient overlay + slides internos no padrão alternado
- **Foto:** pode ser IA (gerada por OpenAI) ou real (passada pelo usuário)

### 3. POST ÚNICO
- **Quando usar:** frase de impacto, dado/estatística, depoimento, bastidores
- **Formato:** 1080x1350
- **Estilo:** varia conforme o conteúdo (citação, número grande, foto com overlay)

Se o tipo não estiver claro, perguntar:
> "Que tipo de conteúdo? (1) carrossel texto, (2) carrossel com foto, (3) post único"

---

## Estilo visual base

O Horus OS tem um estilo próprio — editorial, calmo, premium. Sem clip-art, sem emoji decorativo, sem gradiente arco-íris, sem template genérico de IA. `identidade/design-guide.md` sobrescreve esses padrões; quando o design-guide for vago ou estiver em branco, usar o que tá aqui (não parar pra pedir `/instalar` — o `/carrossel` funciona com defaults bons).

### Tipografia padrão

Piso e faixa vêm de `_memoria/conteudo/10-legibilidade.md`. A peça é renderizada a
1080px e lida num celular de ~390px: o fator é 0,36, então **22px viram 8px na mão
da pessoa**. Os números abaixo já estão corrigidos por causa disso.

- **Fonte:** Inter (Google Fonts), pesos 500/600/700/800/900
- **Título de capa:** 90-110px, weight 900, line-height 0.98, letter-spacing **-0.04em**
- **H2 (slides internos):** 60-76px, weight 800, line-height 1.04, letter-spacing **-0.035em**
- **Corpo:** **34-42px**, weight 500, line-height 1.5 — piso absoluto 34px
- **Eyebrow/kicker:** **26-30px**, weight 700-800, **UPPERCASE**, letter-spacing **0.22-0.32em**, cor de destaque
- **Meta/handle/crédito (@):** **24-28px**, weight 500-600

Regra do tipo: títulos grandes com kerning **apertado** (-0.035em), eyebrows pequenos com kerning **aberto** (0.22em+). Esse contraste é o coração do estilo — o que mudou foi a escala, não a relação.

**Nada de texto de leitura abaixo de 24px.** O que estiver abaixo disso é decoração e não pode carregar informação.

Consequência direta: com corpo em 36px cabem ~5 palavras por linha. **20 a 45 palavras por slide, no máximo 4 linhas de corpo.** Isso é o efeito desejado, não um problema — slide denso é slide pulado.

### Cores padrão (quando design-guide for vago)

Paleta sóbria: fundo dark + off-white + **UMA** cor de destaque. Nunca quatro cores brigando.

- Fundo escuro: `#0E1116` ou `#1A1A1A`
- Fundo claro alternativo: `#F5ECD7` (cream) ou `#FAFAF7`
- Texto sobre escuro: `#FAFAF7`
- Texto sobre claro: `#1A1A1A` (h2) e `#444` (corpo)
- Destaque: cor da marca (uma só)

### Elementos visuais recorrentes

- **Régua fina** (3-4px de altura, 60-80px de largura, cor de destaque) entre kicker e h2 ou como divisor
- **Logo top-left** em todos os slides
- **Contador de slide ("1/8"):** ⚠️ **desligado por padrão no Instagram.** O app já desenha os pontinhos de navegação, e contador dentro da arte é ruído redundante e tell de template automático. Ligar só quando a peça vira PDF ou vai pro LinkedIn. *Decisão pendente do Marcelo — ver `_memoria/conteudo/91-o-que-veio-do-opensquad.md`*
- **Border-top 1px** `rgba(255,255,255,0.12)` separando rodapé do conteúdo (em slides escuros)
- **Stamps circulares** (200x200, border 3px translúcida, rotate -10deg) pra selos/datas/dados
- **Tags/pills** uppercase, padding generoso, kerning 0.2em, pra rotular categoria do slide
- Padding base: 70-100px nas laterais

### Layouts nomeados

Vocabulário de layout — cada slide tem um nome. Variar entre eles pra criar ritmo:

- **CAPA** — eyebrow + título grande + subtítulo + @handle. Fundo: foto com gradient overlay (`rgba(12,10,9,0.55)` → `rgba(12,10,9,0.85)`) OU sólido (escuro/claro/destaque)
- **SOLO** — split horizontal: foto à esquerda 50% + texto à direita 50% (kicker + h2 + régua + parágrafo)
- **DUO** — texto em cima (kicker + h2 + régua + p) + 2 fotos lado a lado embaixo (ou 1 foto larga)
- **NÚMERO** — numeral gigante (200-320px, weight 800, cor de destaque) como elemento gráfico + h2 + parágrafo de apoio
- **CITAÇÃO** — aspas grandes em watermark + frase em h2 + atribuição
- **CTA FINAL** — fundo na cor de destaque, logo centralizado, headline curta, botão/CTA, telefone/@handle

**Ritmo de slide a slide:** alternar fundo escuro ↔ claro ↔ destaque. Nunca dois slides seguidos com o mesmo fundo.

---

## Padrão do carrossel

Duas coisas diferentes, e as duas precisam ser escolhidas:

- **Formato narrativo** = por que o slide 4 existe e por que vem depois do 3.
  Vem de `_memoria/conteudo/00-formatos.md`. São sete: Tese, Lista, Tutorial,
  Mito vs Realidade, Problema → Solução, História, Transformação
- **Layout** = como o slide parece. É o vocabulário visual logo abaixo

Escolher o formato **primeiro**, e a partir dele a contagem e o papel de cada
slide. Só então distribuir os layouts.

⚠️ **Transformação (antes/depois) é proibido no Dr. Giovanni e na Aion.**
Sem versão leve: naqueles dois clientes, é não usar.

**Estrutura base (5 a 10 slides):**
- **Slide 1:** layout `CAPA` — para o scroll, não anuncia o conteúdo
- **Slides internos:** usar 2-3 layouts diferentes entre `SOLO` / `DUO` / `NÚMERO` / `CITAÇÃO`
- **Penúltimo de conteúdo:** o slide de **reflexão**, não de informação. É o que decide entre curtida e salvamento
- **Slide final:** layout `CTA FINAL`, com CTA que cita o conteúdo

Antes de criar HTML: ler `identidade/design-guide.md`. Se estiver em branco, usar o "Estilo visual base" acima como default.

### Sequência de capas no feed (planejamento de grade)

Antes de definir a capa, considerar a **última capa publicada** pra alternar:
- claro → próxima é foto/escuro
- foto/escuro → próxima é cor da marca
- cor da marca → próxima é claro
- nunca duas capas iguais em sequência

Se o usuário não souber qual foi a última, perguntar.

### Linguagem (regra crítica)

Seguir `_memoria/preferencias.md`. Em geral: frases naturais, sem jargão de marketing, sem corporativês. O público real raramente fala "ticket médio", "performance", "B2B". Falar como ele fala.

### Legenda — sempre gerar junto

Ao terminar de renderizar os PNGs, gerar **automaticamente** a legenda do post e salvar em `legenda.md` na mesma pasta. **Não esperar o usuário pedir.** Estrutura padrão:

1. Hook (pergunta ou afirmação)
2. Contexto (1-2 frases sobre o conteúdo)
3. CTA pra arrastar ("Arraste pro lado e confere")
4. Bloco de oferta (diferenciais da empresa, contato)
5. Hashtags (5-15, misturando nicho, médio alcance e amplo; local se aplicável)

Piso e teto: primeiros 125 caracteres funcionam sozinhos como gancho (é o que
aparece antes do "mais"), legenda inteira entre 1.500 e 1.800 caracteres, nunca
acima de 2.200. Sem URL na legenda: o Instagram não deixa link clicável ali.

---

## Workflow

### Passo 1 — Entender e planejar

1. Ler `_memoria/preferencias.md` e `_memoria/empresa.md`
2. Ao produzir PARA um cliente, ler `clientes/<nome>/marca.md` (a marca
   dele manda). Pra peça institucional da agência, ler `identidade/design-guide.md`
3. **Definir o estilo visual** seguindo `identidade/catalogo-estilos.md`:
   - marca do cliente já define estilo → usa esse
   - usuário nomeou um estilo → invocar a skill do estilo (Skill tool) e
     aplicar os tokens dela por cima do "Estilo visual base" abaixo
   - ninguém definiu → sugerir 1-2 estilos do grupo certo do catálogo e
     perguntar antes de seguir
   Sempre UM estilo. A marca do cliente sempre vence sobre o estilo.
4. Identificar o tipo de conteúdo (1, 2 ou 3)
5. **Escolher o formato narrativo** em `_memoria/conteudo/00-formatos.md`. Se dois
   servem, escolher o que a marca menos usou nas últimas semanas — variedade de
   formato mantém o perfil vivo muito mais que variedade de cor

### Passo 2 — Três ângulos

Antes de escrever o carrossel, propor **3 ângulos diferentes** pro mesmo tema.
Não três títulos: três leituras do assunto, cada uma levando a um carrossel
diferente. Um parágrafo cada, dizendo o formato narrativo e a promessa.

Serve pra forçar divergência antes de comprometer. O primeiro ângulo que o modelo
produz é quase sempre o mais óbvio do segmento.

**CHECKPOINT:** Marcelo escolhe um ângulo (ou pede outros).

### Passo 3 — Texto

Escrever o conteúdo seguindo o formato escolhido e as regras de tom:

**Pra carrossel (5-10 slides):**
- Slide 1 (Capa): título que para o scroll, máx 8 palavras. Oferecer 3 opções
- Slides internos: uma ideia por slide. Se precisa de "e também", são dois slides
- **20 a 45 palavras por slide**, no máximo 4 linhas de corpo
- Penúltimo de conteúdo: reflexão
- Slide final: CTA que cita o conteúdo

**Pra post único:**
- Frase principal em destaque
- Contexto de apoio (se necessário)
- CTA sutil

Passar a copy pelo `90-antipadroes.md` antes de mostrar. O teste mais rápido:
trocar o nome do cliente pelo do concorrente. Se o texto continua fazendo
sentido, ele não diz nada — reescrever.

**CHECKPOINT:** Mostrar o texto completo. Esperar aprovação antes do visual.

### Passo 4 — Gerar fotos (se tipo 2)

Só se o usuário pediu carrossel com foto IA.

> **A trava de imagem é irmã da trava de CSS.** O Passo 5 fixa cor e fonte pra
> não escorregar entre slides. Este passo faz o mesmo pro **pixel gerado**: sem
> ele, o objeto do slide 1 vira outra coisa no slide 8 (o grão muda de cor, a
> planta vira árvore, a xícara troca de formato). Cada geração solta é um sorteio
> independente; consistência exige âncora. É o antipadrão "objeto que muda entre
> slides" em `_memoria/conteudo/90-antipadroes.md`.

#### A regra que vem antes de tudo: às vezes não se gera 8 vezes

Modelo generativo **não garante** identidade perfeita de objeto entre gerações,
por mais travado que seja o prompt. Então, antes de gerar:

> **Se o mesmo objeto precisa aparecer idêntico em vários slides, o certo quase
> sempre é NÃO gerar N vezes.** Gerar uma vez (ou usar foto/asset real) e
> **reposicionar o mesmo arquivo** via CSS/composição nos outros slides. Regerar o
> que tem que ser idêntico é convidar a variação.

Geração slide a slide só se justifica quando **cada slide mostra uma cena
diferente** (não o mesmo objeto repetido). E mesmo aí, valem as travas abaixo.

#### As quatro travas de consistência

**1. Cena-mestra, não N sorteios.** Gerar primeiro UMA imagem-âncora (o objeto ou
a cena que dá o tom da série), aprovar, e derivar as demais **por edição/variação
a partir dela** (image edit, passando a âncora como imagem de entrada), não por
prompt novo do zero. É o que trava o mesmo objeto entre gerações.

**2. Bloco de "style lock" fixo.** Um trecho de prompt **idêntico**, colado em
toda geração da série. O que muda entre slides é só o conteúdo; o estilo, nunca.
Montar uma vez, no início, e repetir literal:

```
STYLE LOCK (colar igual em todos os prompts da série):
palette: [os mesmos 2-4 hex do sistema de design], nothing else
lighting: [ex: soft directional window light, warm]
lens/angle: [ex: 50mm, eye-level, shallow depth of field]
render: [ex: editorial photography, matte finish, subtle film grain]
mood: [ex: calm, artisanal, unhurried]
```

**3. Objetos nomeados e travados.** Listar os objetos recorrentes com descrição
**literal e específica**, e repetir a mesma frase exata em cada prompt. Vago =
deriva.
- ❌ "coffee beans" → cada geração inventa um grão diferente
- ✅ "medium-roast arabica coffee beans, whole, matte dark brown, no oil sheen"

**4. Seed fixa quando a ferramenta expõe.** Onde houver parâmetro de seed, fixar
o mesmo valor pra série inteira.

#### Como montar cada prompt

1. Prompt em inglês (a API funciona melhor em inglês).
2. Estrutura: **conteúdo do slide** + **objetos nomeados (trava 3)** + **STYLE
   LOCK literal (trava 2)**. O style lock vai igual em todos; o começo é o que
   muda.

```
[conteúdo específico deste slide],
[objetos nomeados, descrição literal repetida da série],
STYLE LOCK: [bloco fixo, idêntico em todos]
```

3. Gerar via script (se `scripts/gerar-imagem.js` existir):
```bash
node --env-file=.env scripts/gerar-imagem.js "PROMPT" "marketing/conteudo/<pasta>/foto-<nome>.png"
```

Se não tiver o script ainda, instruir o usuário a configurar `OPENAI_API_KEY` no
`.env` e criar o script (ou usar outra ferramenta). Se o script suportar imagem de
entrada, usar a âncora aprovada como referência nas gerações seguintes (trava 1).

4. **Conferência lado a lado antes do lote.** Colocar as imagens da série lado a
   lado e checar: mesma forma, mesma cor, mesmo número de objetos, mesma luz. É o
   análogo visual do "renderizar e olhar o slide 1" que a skill já exige pro texto.
   Objeto que derivou volta pra geração antes de virar PNG do carrossel.

**CHECKPOINT:** Série aprovada como conjunto (não foto por foto isolada) → seguir.
Se um objeto derivou, ajustar a trava que falhou e regerar aquele slide a partir da
âncora.

### Passo 5 — Sistema de design (antes do primeiro HTML)

Escrever o sistema **antes** de abrir o editor: cores (máximo 5: primária,
secundária, destaque, fundo, texto), fonte e escala, unidade de espaçamento,
raio, e o elemento gráfico recorrente. É o contrato visual entre os slides — sem
ele a cor escorrega no slide 5 e a fonte muda no 7.

**Se o cliente ainda não tem identidade de carrossel travada:** propor **3
identidades visuais distintas** (não três variações da mesma paleta), renderizar
o **slide 1 de cada uma** em PNG e mostrar as três lado a lado.

**CHECKPOINT:** Marcelo escolhe uma. A escolhida vira
`clientes/<nome>/carrossel-referencia.html` e as regras entram no `marca.md`
dele. A partir daí todo carrossel daquele cliente parte desse arquivo, e esse
passo é pulado.

Se o cliente já tem `marca.md` com estilo definido, a marca vence e não há
proposta a fazer.

### Passo 6 — Criar visuais (HTML + PNG)

1. Criar **um único `carrossel.html`** com TODOS os slides como `<div class="slide">` dentro do mesmo arquivo. Inline CSS, Google Fonts como única dependência externa. Aplicar:
   - Cores e tipografia do sistema de design do Passo 5
   - Mínimo 2 layouts diferentes (não repetir o mesmo em todos os slides)
   - Logo top-left em todos os slides (contador: ver regra acima, desligado por padrão)
   - Slide final: logo + CTA, fundo na cor principal
   - Nenhum texto de leitura abaixo dos pisos de `10-legibilidade.md`

   **Pra incluir foto IA no HTML:**
   ```html
   <div class="slide" style="
     background-image: linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.7)), url('foto-xxx.png');
     background-size: cover;
     background-position: center;
   ">
     <div class="content">
       <h2>Texto sobre a foto</h2>
     </div>
   </div>
   ```

2. Criar `render.js` na mesma pasta — script Node com Playwright que abre o HTML e tira screenshot de cada `.slide` em 1080x1350. Pode reutilizar `node_modules` de uma pasta anterior (não precisa rodar `npm install` toda vez):
```bash
NODE_PATH="<pasta-com-node_modules>/node_modules" node render.js
```

3. **Renderizar o slide 1 sozinho e olhar o PNG antes do lote.** Não o HTML — o
   PNG. O HTML pode estar perfeito e a fonte ter caído no fallback, o texto ter
   estourado ou um bloco ter sido cortado, sem erro nenhum aparecer. Um defeito
   no slide 1 se repete nos outros dez se não for pego agora.

4. Renderizar o lote. Mostrar slide 1, 2 e o CTA final. Se aprovado, mostrar os intermediários.

### Passo 7 — Porta de qualidade (antes de mostrar como pronto)

Rodar `_memoria/conteudo/99-checklist.md`:

1. **Condições de veto** — qualquer uma sozinha reprova. Não se compensa com nota alta em outro lugar
2. **Rubrica** — aprova com média ≥ 7 e nenhum critério abaixo de 4. O "para o scroll" tem peso 1,5 e reprova sozinho com nota ≤ 3
3. **Compliance do cliente** — em cliente regulado, trava a entrega mesmo com tudo mais em ordem

Reportar o resultado com número e pendência, nunca "está pronto":

> Formato: Lista, 8 slides. Rubrica: média 7,8, menor nota 6 (C5, CTA).
> Vetos: nenhum. Pendente: `[FALTA: telefone ativo]` no slide 8.

### Passo 8 — Salvar e organizar

```
marketing/conteudo/<tipo>-<tema>-<YYYY-MM-DD>/
  texto.md              ← texto aprovado + legenda
  foto-<nome>.png       ← fotos geradas por IA (se houver)
  carrossel.html
  render.js
  instagram/
    slide-01.png → slide-NN.png
  tiktok/ (se pedido — formato 9:16)
    slide-01.png → ...
  legenda.md            ← legenda Insta+FB
  legenda-linkedin.md   ← (se pedido, mais formal)
```

### Passo 9 — Conexão com blog (opcional)

Depois de criar o conteúdo visual, perguntar:

> "Esse conteúdo dá pra virar artigo no blog também. Quer que eu crie a versão blog pra SEO?"

Se sim, chamar `/publicar-tema` com o mesmo tema.

---

## Regras

- Ler `_memoria/conteudo/` antes da primeira linha de copy, e rodar o `99-checklist.md` antes de entregar
- Escolher o **formato narrativo** antes de escrever. Layout vem depois
- Sempre ler `identidade/design-guide.md` antes de criar qualquer visual
- Carrossel: 1080x1350 (4:5 retrato) — sempre. A primeira imagem define a proporção do carrossel inteiro, então todos os slides saem na mesma dimensão. TikTok/Reels: 1080x1920 (9:16) — só quando pedido explicitamente
- Nenhum texto de leitura abaixo de 24px; corpo com piso de 34px
- Renderizar e **olhar** o slide 1 antes de renderizar o lote
- Linguagem segue `_memoria/preferencias.md` estritamente
- Sempre considerar a sequência de capa no feed antes de definir capa nova
- Sempre gerar legenda automaticamente ao final, salvando em `legenda.md`
- Fotos IA: sempre pedir aprovação antes de usar no carrossel, **e aprovar a série como conjunto**, não foto por foto isolada
- Fotos IA: prompts em inglês
- Fotos IA: nunca gerar fotos de pessoas/rostos identificáveis
- Fotos IA: consistência entre slides é obrigatória (ver Passo 4). Objeto que tem que ser idêntico em vários slides **não** se gera N vezes: gera uma e reposiciona o mesmo arquivo. Quando gera séries, usar cena-mestra + style lock fixo + objetos nomeados + seed fixa, e conferir lado a lado antes do lote
- HTMLs: um único arquivo `carrossel.html` com todos os slides + `render.js` na mesma pasta. Inline CSS
- Render: reutilizar `node_modules` quando possível (não rodar `npm install` em cada pasta)
- Não repetir layout entre slides — usar variação visual
