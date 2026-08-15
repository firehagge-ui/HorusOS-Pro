# Arquitetura do site — Café Grão da Serra

> Escrita em 30/07/2026, **antes de qualquer HTML**, seguindo o passe duplo de
> `_memoria/design/00-anatomia.md`.
> Uma página (one-page), institucional, B2B primeiro.

---

## PASSE 1 — o plano

```
COR    #3D2115  fundo base, o site inteiro nasce escuro
       #D6B35F  dourado: botão, destaque, número          (7,34:1 sobre o fundo)
       #EFC294  creme: texto de corpo                     (8,98:1)
       #FFFFFF  branco: títulos                          (14,72:1)
       #764D36  superfície de card e borda — NUNCA texto  (2,02:1)
       #8A9A5B  sage: detalhe, traço, folha, hover        (4,80:1)

TIPO   display   Prata (serifada de alto contraste, conversa com o lettering)
       corpo     Inter (sans, legível em fundo escuro)
       dado      Inter tabular para peso, preço e etapa

LAYOUT hero / para quem revende / o processo / produtos /
       como virar revendedor / quem faz / de onde vem / FAQ / contato

ASSINATURA  ???
```

## PASSE 2 — o ataque ao próprio plano

> **Eu chegaria nesse plano se o briefing fosse de qualquer outro café artesanal
> do Brasil?**

**Sim. Chegaria.** Fundo escuro, dourado, serifada elegante e "do grão à xícara" é
o reflexo do segmento inteiro. O site russo da pasta de referências é isso. O
Trieste é isso. A Arbor é isso. O plano acima foi **alcançado por reflexo, não
escolhido**.

Pior: **"do grão à xícara" é falso para ele.** A família não planta e não colhe.
A frase mais batida do segmento é, no caso dele, também uma mentira.

### O que reescrevi, e por quê

O que só ele tem não é uma qualidade, é uma **ausência e um método**:

1. **Ele não tem lavoura.** Todo concorrente abre a história no cafezal. Ele não
   pode, e por isso começa onde os outros passam correndo
2. **A família pila o café.** Pilagem é método tradicional que praticamente
   nenhuma marca de café mostra. Todos mostram torra. Ninguém mostra pilão
3. **Serrana, Brejões** é lugar com nome, e o nome da marca é o lugar
4. **É uma pessoa só, com quatro meses de CNPJ.** Pequeno de verdade

### 🖋️ A ASSINATURA

**A faixa do beneficiamento em quatro tempos** — escolha, pilagem, secagem, torra
— com foto real de cada etapa, ocupando a seção mais alta e mais trabalhada da
página.

É a única coisa da página que nenhum concorrente consegue copiar, porque nenhum
faz esse processo. E resolve, no mesmo movimento, o pedido do Nelson de "interior,
verde, mato": o verde vem da foto do terreiro, não de um bloco colorido.

**A frase que organiza o site inteiro:**

> **A gente não planta. A gente escolhe.**

Ela transforma a fraqueza (não ter lavoura) em critério de compra (saber escolher
grão), é 100% verdadeira, e nenhum concorrente pode dizer o mesmo sem soar menor.

Tudo o mais na página fica quieto em volta dessa seção.

---

## A ordem, seção por seção

### 0. Cabeçalho
Logo (símbolo + nome), 4 links âncora, botão WhatsApp em dourado.
Menu hambúrguer abaixo de 900px — a lição da Aion, onde a navegação sumia.

### 1. Hero
**Trabalho:** dizer em 3 segundos o que é, para quem, e o que fazer.

```
┌──────────────────────────────────────────────────────┐
│  [logo]        processo  revenda  produtos   [WhatsApp]│
├──────────────────────────────────────────────────────┤
│                                                      │
│   CAFÉ ARTESANAL · SERRANA, BREJÕES ← eyebrow        │
│                                                      │
│   A gente não planta.          ┌──────────────────┐  │
│   A gente escolhe.             │                  │  │
│                                │   FOTO REAL      │  │
│   Café 100% arábica, pilado,   │   grão na mão /  │  │
│   secado e torrado pela        │   pilão          │  │
│   família, no interior da      │                  │  │
│   Bahia.                       └──────────────────┘  │
│                                                      │
│   [ Quero revender ]  [ Comprar para mim ]           │
│                                                      │
│   ✔ 100% arábica   ✔ Torra artesanal   ✔ Café puro   │
└──────────────────────────────────────────────────────┘
```

- **Dois CTAs, e é proposital.** A anatomia pede um primário e no máximo um
  secundário. Aqui o primário é **revenda** (é o negócio dele) e o secundário é
  consumo. Sem isso, o revendedor não se reconhece
- Os três selos são os que **ele já usa** nas peças dele
- ⚠️ Sem foto real, o hero não existe. Placeholder marcado até chegarem

### 2. Para quem revende ⭐ (o bloco mais esquecido, e aqui o mais importante)
**Trabalho:** o dono de padaria se reconhecer antes de entender o produto.

Aprendido do teardown da Fazenda São Gabriel, e escrito na dor, aprendido da Arbor.
**Coluna única, segunda pessoa**, cada item com uma frase concreta e link para o
WhatsApp com mensagem pronta:

- **Padaria e mercadinho** — seu cliente leva o pão e leva o café junto
- **Cafeteria e lanchonete** — o café que você serve é o que ele lembra
- **Mercearia e empório** — margem de revenda e produto com procedência
- **Escritório e consultório** — entrega programada, sem você ter que lembrar

E a dor, que é o que faz reconhecer:

> Se você já ficou sem café numa sexta-feira, já recebeu torra velha, ou já teve
> que trocar de marca porque o sabor mudou do nada, é disso que a gente cuida.

### 3. O beneficiamento em quatro tempos 🖋️ ASSINATURA
**Trabalho:** provar a qualidade mostrando o processo, em vez de afirmar.

```
┌──────────────────────────────────────────────────────┐
│  01 ─────── 02 ─────── 03 ─────── 04                 │
│  ┌────┐     ┌────┐     ┌────┐     ┌────┐             │
│  │FOTO│     │FOTO│     │FOTO│     │FOTO│             │
│  └────┘     └────┘     └────┘     └────┘             │
│  A ESCOLHA  A SECAGEM  A PILAGEM  A TORRA            │
│  compra do  ao sol,    no pilão,  em pequena         │
│  grão já    até o      pra tirar  quantidade         │
│  maduro     ponto      a casca                       │
└──────────────────────────────────────────────────────┘
```

- Layout diferente de todas as outras seções: **horizontal, numerado, foto grande**
- É onde o `#8A9A5B` aparece: o traço que liga as quatro etapas

### 🔴 A ordem foi corrigida: SECAGEM vem antes da PILAGEM

O Nelson disse no áudio "pilar, secar, torrar e moer", e a primeira versão desta
arquitetura copiou essa ordem. **Está trocada.**

🌐 [FONTE EXTERNA — Embrapa, *Manual de Beneficiamento de Grãos de Café*, e Emater-MG,
*Manual do Café: Colheita e Preparo*, consultados em 30/07/2026]

Na **via seca** (natural), que é a compatível com comprar o grão maduro sem
despolpar:

1. **Secagem** — o café em coco seca até cerca de **11% de umidade**
2. **Descascamento** — remove a casca seca. **É aqui que entra o pilão**
3. Torra
4. Moagem

E faz sentido físico: **não se pila café úmido.** O pilão serve justamente para
quebrar e soltar a casca **depois** que ela secou.

O próprio Nelson se corrigiu no áudio, voltando na secagem depois de ter listado
("e o processo de secagem também"), o que indica que ele estava enumerando de
memória, não em ordem.

⚠️ **Ainda assim, confirmar com ele** — mas agora com uma pergunta melhor, que
propõe em vez de perguntar aberto:

> "Vocês secam o café primeiro e só depois pilam pra tirar a casca, certo?"

Se a resposta for outra (por exemplo, se houver lavagem antes, ou via úmida), o
texto muda. O que não pode é publicar a ordem errada do processo que é o argumento
central da página.

### 4. Os produtos
**Trabalho:** dizer o que existe, com contexto para escolher.

Cards escuros sobre `#764D36`, foto do pacote, nome, peso, moagem (grão ou moído).
❓ **Faltam os produtos, os pesos e a faixa de preço.**
⚠️ **Sem preço público** por enquanto: a Arbor publica, mas ela tem tabela pronta e
margem calculada. Ele não tem. Preço vai por WhatsApp até ele decidir.

### 5. Como virar revendedor
**Trabalho:** tirar o medo do primeiro contato.

Três passos, e o mais importante é dizer o que **não** é exigido:

1. **Você chama no WhatsApp** — não precisa saber quanto quer ainda
2. **A gente combina quantidade e entrega** — sem pedido mínimo alto
3. **Você recebe e revende** — e a gente repõe quando acabar

❓ Confirmar se existe pedido mínimo antes de escrever "sem pedido mínimo alto".

### 6. Quem faz
**Trabalho:** transformar empresa em pessoa.

O Nelson e o pai. Foto real, os nomes, e a divisão: o pai beneficia, ele leva.
⚠️ **Só publicar depois de ele autorizar falar do pai.**
❌ Foto de banco aqui destrói mais confiança do que não ter foto.

### 7. De onde vem
**Trabalho:** ancorar a marca no lugar.

Serrana, Brejões, e o fato de o nome da marca ser o nome do lugar.

🔴 **Seção condicional.** Só entra se ele confirmar que o grão vem de produtores da
região. Enquanto não confirmar, a seção **não existe** — não vira texto vago sobre
"a serra". Ver `briefing.md`.

### 8. FAQ
8 a 10 perguntas, `<details>` nativo. As boas são as constrangedoras:
quantidade mínima, prazo de entrega, forma de pagamento, para onde entrega, o que
acontece se o café não girar, se manda para fora de Brejões, se emite nota.

### 9. Contato e rodapé
WhatsApp em destaque, Instagram, **CNPJ 65.816.871/0001-23**, e o endereço.
⚠️ **Endereço não vai público** (é residencial, e o GMB está com ele oculto).
Cidade e estado, sim: Brejões/BA.

---

## Ritmo visual (a regra das 4 famílias de layout)

| # | Seção | Família de layout | Fundo |
|---|---|---|---|
| 1 | Hero | texto + imagem lado a lado | `#3D2115` |
| 2 | Para quem revende | **coluna única**, lista em segunda pessoa | `#3D2115` |
| 3 | Processo 🖋️ | **faixa horizontal numerada** | `#764D36` |
| 4 | Produtos | grid de cards | `#3D2115` |
| 5 | Como virar revendedor | **3 passos numerados** | `#764D36` |
| 6 | Quem faz | retrato + texto | `#3D2115` |
| 7 | De onde vem | imagem full-bleed com texto sobreposto | foto |
| 8 | FAQ | acordeão, coluna única estreita | `#3D2115` |
| 9 | Contato | duas colunas | `#764D36` |

**Seis famílias distintas**, acima do mínimo de quatro. Fundo alterna escuro/médio.
**Eyebrow só em 3 das 9 seções** (hero, processo, contato), respeitando o teto de
um a cada três.

---

## O que este site NÃO vai ter

- ❌ **"Do grão à xícara"** e qualquer variação. É a frase do segmento inteiro e é
  falsa para ele
- ❌ Foto de cafezal, lavoura ou fazenda
- ❌ Nota de degustação, pontuação SCA, altitude, variedade, processo de origem
- ❌ Número inventado ("+500 clientes"). Ele tem 4 meses de CNPJ
- ❌ Depoimento, até existirem reais e autorizados
- ❌ Selo de "X anos de tradição"
- ❌ Carrinho, checkout, pagamento. É institucional, não loja
- ❌ "Role para explorar" no fim do hero
- ❌ Alegação de saúde de qualquer tipo

---

## Dependências antes do HTML

**Bloqueia de verdade:**
- [ ] Fotos reais: pilão, terreiro de secagem, torra, pacote, o Nelson
- [ ] Produtos com peso e moagem
- [x] ✅ Ordem das etapas resolvida por pesquisa (Embrapa/Emater): secagem antes da
      pilagem. **Confirmar com ele**, mas o texto já pode ser escrito assim
- [ ] Autorização para falar do pai
- [ ] Escopo e prazo fechados com ele

**Não bloqueia (entra com placeholder marcado):**
- [ ] Origem do grão (seção 7 fica de fora até confirmar)
- [ ] Pedido mínimo
- [ ] Logo com lettering em fundo transparente
