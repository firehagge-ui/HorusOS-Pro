# Tipografia: por que a hierarquia funciona

> A camada de baixo do `90-antipadroes.md`. Lá está o *tell* ("escala achatada");
> aqui está o *porquê*, pra o Claude derivar a escala certa num caso novo em vez de
> só reconhecer o erro depois de cometê-lo.
>
> **Isto é leitura de consulta, não de gatilho.** Não precisa ler antes de todo
> site. Abrir quando a decisão for tipográfica: escolher a escala, montar o
> pareamento, resolver um bloco que "não hierarquiza". Cada seção segue o formato
> **princípio → por que funciona → como se aplica aqui → o antipadrão que previne.**

---

## 1. Escala modular: razão fixa, não chute

**Princípio.** Os tamanhos de fonte de uma página saem de uma **razão fixa**
aplicada a partir do corpo (16px × 1.25 = 20 × 1.25 = 25 × 1.25 = 31…), não de
números escolhidos um a um no olho.

**Por que funciona.** O olho não lê tamanho absoluto, lê **relação**. Quando os
saltos entre níveis são o mesmo múltiplo, o cérebro registra "isto é um sistema" e
a hierarquia se lê sem esforço. Quando são aleatórios (18, 22, 28, 40, 44), cada
salto contradiz o anterior e o resultado lê como ruído mesmo que cada tamanho,
sozinho, esteja ok. Escolher a razão é escolher o **drama** da página:

| Razão | Nome | Sensação | Onde |
|---|---|---|---|
| 1.2 | terça menor | denso, sóbrio | dashboard, muito texto |
| 1.25 | terça maior | equilibrado | site de serviço, o default seguro |
| 1.333 | quarta justa | editorial, respira | landing, portfólio |
| 1.5+ | quinta | dramático | hero de uma ideia só |

**Como se aplica aqui.** Razão maior = contraste maior entre título e corpo = mais
presença. As dez agências de IA (`referencias/agencias-ia-dez-sites.md`) rodam h1
gigante sobre corpo pequeno: é razão alta, de propósito. A lista de café tem h1 de
114 a 199px pelo mesmo motivo. O oposto é o Grão da Serra Mantiqueira
(`referencias/grao-da-serra-mantiqueira.md`): h1 de 18px sobre corpo de 12px, razão
≈1, nenhuma hierarquia — o site inteiro sussurra.

**O antipadrão que previne.** A "escala achatada" que pegou a **Aion** na rodada de
28/07: títulos e corpo perto demais, a página sem respiração vertical. É o
`flat-type-hierarchy` do detector. A cura não é "aumentar o título no olho", é
**escolher uma razão e derivar dela** — assim o h2 e o h3 também entram na conta,
não só o h1.

---

## 2. Medida e entrelinha: a linha que o olho consegue seguir

**Princípio.** **Medida** é o comprimento da linha de texto. O alvo é **60 a 75
caracteres** por linha no corpo (≈ 8 a 12 palavras). **Entrelinha** (`line-height`)
anda junto: sobe quando a linha é longa, desce quando a fonte é grande.

**Por que funciona.** No fim de cada linha o olho faz um salto de volta pra achar o
começo da próxima. Linha longa demais e ele perde o ponto de retorno (relê ou pula
linha); curta demais e o ritmo vira picotado, o salto acontece cedo demais. A
entrelinha é a pista desse retorno: linha longa precisa de mais espaço entre linhas
pra o olho não cair na errada. E fonte grande já tem massa própria, então título
grande pede entrelinha **apertada** (senão as linhas boiam soltas).

**Como se aplica aqui.** Os números que a `/carrossel` já usa são isto na prática:
corpo com `line-height: 1.5`, display de capa com `0.98`. No site vale o mesmo par
— corpo entre 1.5 e 1.65, display entre 1.0 e 1.1. E a medida: uma coluna de texto
que atravessa a tela inteira num monitor tem 120+ caracteres por linha e cansa;
travar o bloco de texto em ~65ch resolve sem mexer no tamanho da fonte.

**O antipadrão que previne.** O parágrafo largura-da-tela (corpo esticado de borda
a borda) e o título de várias linhas com entrelinha de corpo (fica com buraco no
meio). O bloco "para quem é" do `00-anatomia.md` pede coluna única justamente por
isso: coluna estreita controla a medida de graça.

---

## 3. Pareamento: display, corpo, utilitária

**Princípio.** Uma página bem tipografada usa três papéis, não uma fonte só:
- **display** — títulos, carrega a personalidade
- **corpo** — texto de leitura, carrega a legibilidade
- **utilitária** — legenda, dado, rótulo, número (às vezes é o corpo num peso/caixa
  diferente, às vezes uma mono pra dado)

**Por que funciona.** Personalidade e legibilidade puxam pra lados opostos. A fonte
que dá caráter ao título (serifa de contraste alto, display condensada) costuma
cansar num parágrafo; a que lê bem em corpo miúdo (humanista neutra) não tem
presença em tamanho grande. Separar os papéis deixa cada fonte fazer o que faz bem,
e o **contraste entre as duas** já é meio caminho da hierarquia — antes mesmo do
tamanho, o olho vê "isto é título, aquilo é texto" pela forma da letra.

**Como se aplica aqui.** É o **Marcellus + Poppins** da Valéria Movio
(`referencias/`): serifa de display com humanista de corpo, e a paleta terrosa por
cima — score 7, confirma o caminho do segmento saúde. O contraexemplo é o
**Pataquini** (score 4): sans em tudo, título e corpo na mesma família e peso
parecido, então nada hierarquiza e a página inteira tem uma voz só. Regra prática:
**duas famílias que combinam bastam**; a terceira quase sempre é o corpo em outro
peso, não uma fonte nova. Fonte demais é o mesmo erro de cor demais.

**O antipadrão que previne.** "Sans em tudo" e o seu primo, a página com quatro
famílias brigando. Um é hierarquia zero, o outro é ruído. O detector não pega isso
direto — é olho, e é este arquivo.

---

## 4. Kerning é função da escala

**Princípio.** O espaçamento entre letras (`letter-spacing`) muda **na direção
oposta** ao tamanho: display grande fica **apertado** (negativo), texto pequeno em
caixa alta fica **aberto** (positivo).

**Por que funciona.** O espaçamento default das fontes é calibrado pra corpo, ~16px.
Puxe pra 100px e os vãos entre letras bocejam — o título parece frouxo. Encolha pra
uma linha de rótulo em CAIXA ALTA de 12px e as letras se amassam, porque maiúsculas
não têm as saliências que separam minúsculas. Por isso display pede kerning negativo
e eyebrow uppercase pede kerning generoso: cada um corrige o vão que a escala criou.

**Como se aplica aqui.** É a regra que a `/carrossel` chama de "coração do estilo":
display em `-0.035em`, eyebrow em `0.22em` ou mais. O mesmo vale no site — h1 grande
entre `-0.02` e `-0.04em`, kicker uppercase entre `0.15` e `0.3em`. O contraste
entre os dois (título colado, rótulo espalhado) é por si só um sinal de acabamento.

**O antipadrão que previne.** O h1 grande com cara de "faltou apertar" e o rótulo
uppercase ilegível de tão amassado. Barato de acertar, denuncia na hora quando erra.

---

## 5. Peso e caixa antes de tamanho novo

**Princípio.** Antes de criar mais um nível na escala, lembrar que **peso**
(400/600/800) e **caixa** (alta/baixa) também hierarquizam — e ocupam o mesmo
espaço.

**Por que funciona.** Hierarquia é diferença perceptível, e o tamanho é só uma das
alavancas. Um rótulo não precisa ser menor pra recuar: uppercase + peso médio + cor
dessaturada já o mandam pro fundo sem encolher a ponto de ficar ilegível. Isso
importa porque **tamanho pequeno tem piso** (ver o piso da `/carrossel` e os mínimos
de UI do detector) — quando o piso trava, peso e caixa continuam disponíveis.

**Como se aplica aqui.** É o que salva o eyebrow: em vez de miniaturizar até sumir,
mantém tamanho legível e recua por caixa alta + kerning aberto + cor de acento. Mas
vale a trava do `00-anatomia.md` — eyebrow **um a cada três seções**, senão o
recurso vira ritmo de template. E a advertência oposta: usar tamanho + peso + caixa
+ cor **todos de uma vez** no mesmo elemento não destaca, achata, porque some o
degrau entre um nível e o próximo. Uma alavanca por degrau.

**O antipadrão que previne.** O texto de UI encolhido abaixo do legível pra "caber"
(`undersized-ui-text`, `tiny-text` do detector) e o elemento com cinco tratamentos
somados que era pra gritar e só embola.

---

## Os antipadrões que este princípio explica

| Antipadrão / regra do detector | A raiz teórica aqui |
|---|---|
| `flat-type-hierarchy` / "escala achatada" (Aion) | §1 escala modular |
| `tiny-text`, `undersized-ui-text` | §5 peso e caixa antes de encolher |
| Parágrafo largura-da-tela, título com buraco | §2 medida e entrelinha |
| "Sans em tudo" (Pataquini), fontes demais | §3 pareamento |
| h1 frouxo, rótulo uppercase amassado | §4 kerning |
| Eyebrow em toda seção | §5 + `00-anatomia.md` (ritmo) |
