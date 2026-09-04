# Sistema de Design — Hórus Agência

> Camada **técnica** da marca. O `brandbook.md` responde "quem é a Hórus e por quê";
> este arquivo responde "quais são os valores exatos e como se montam as peças".
> Identidade oficial: **DNA n8n** (void violeta + ember + electric + DM Sans).
>
> **Versão:** 1.0 · **Data:** 29/08/2026 · Companheiro de `identidade/brandbook.md`.
> Verdade viva dos tokens aplicados: `site/assets/site.css §1`.
>
> ⚠️ **Todas as taxas de contraste deste documento foram CALCULADAS** (fórmula WCAG
> 2.x, relative luminance), não estimadas. Quando um hex mudar, recalcular, nunca
> chutar o novo número.
>
> **Escopo:** esta é a **Parte 1** (fundação atômica: personalidade, tokens, cor,
> tipografia, logo). A **Parte 2** (biblioteca de componentes) é o arquivo
> `design-system-componentes.md`, que consome os tokens definidos aqui.

---

## 1. Personalidade, tom visual e filosofia

### 1.1 Personalidade da marca

| Traço | O que é | O que não é |
|---|---|---|
| **Clara** | Direta, uma ideia por vez, sem jargão | Simplista ou rasa |
| **Estratégica** | Cada escolha tem motivo declarado | Fria ou corporativa |
| **Inovadora** | Tecnologia atual de verdade, não moda | Barulhenta ou "futurista" de efeito |
| **Confiável** | Íntegra por método, mostra a régua | Careta ou institucional demais |

### 1.2 Descritores de tom visual

- **Geometria escura e sóbria** sobre um void violeta-preto, nunca preto puro.
- **Muito espaço negativo.** O elemento-assinatura carrega a tela; o resto fica quieto.
- **Elevação por degrau de cor**, não por sombra. A profundidade é cromática.
- **Um único ponto quente** (ember) em cena, reservado à ação. Todo o resto é frio.
- **Camada técnica em fonte monoespaçada** dá cara de instrumento de precisão.
- **Brilho é raro, azul, e sempre atrás de um objeto de verdade**, nunca solto.

### 1.3 Filosofia de design (um parágrafo)

A Hórus vende visão e execução íntegra, então a interface tem que **parecer um
instrumento de precisão, não um folheto**. O void violeta é o breu de onde a marca
enxerga; o ember é o único ponto de foco, reservado ao "agir", do mesmo jeito que a
agência entrega uma prioridade por vez em vez de despejar tudo. A monoespaçada nos
números e rótulos declara medição, porque o que a casa promete é experiência
mensurável. E a contenção (uma cor quente, uma sombra por elemento, um brilho por
página) é a versão visual da régua de integridade: mostra domínio pela recusa, não
pelo excesso.

---

## 2. Elementos de design (tokens atômicos)

> Bloco copiável para `:root`. Nomes de token seguem os do `site.css` (legados
> mantidos) mais os novos de escala e espaçamento propostos aqui.

```css
:root {
  /* ---- Superfícies (void → elevações, por degrau de cor) ---- */
  --void:        #0e0918;  /* fundo de página e hero            */
  --surface:     #1a1624;  /* card                              */
  --panel:       #1b1728;  /* painel grande / stage             */
  --shell:       #2c2834;  /* superfície terciária / ghost fill */
  --hairline:    #3e3a46;  /* borda de baixo contraste          */

  /* ---- Texto ---- */
  --ink:         #d1cece;  /* corpo (nunca #fff no corpo)       */
  --ink-soft:    #9d9797;  /* secundário / legenda              */
  --ink-strong:  #ffffff;  /* só título e ênfase                */

  /* ---- Primária: EMBER (quente, só ação) ---- */
  --ember-300:   #febb81;
  --ember-400:   #fda151;
  --ember-500:   #fd8925;  /* base                              */
  --ember-600:   #c86d22;
  --ember-700:   #995320;
  --ember-grad:  linear-gradient(30deg, #fd8925, #ff0c00);

  /* ---- Secundária: ELECTRIC (fria, link/foco/conexão) ---- */
  --electric-300:#6fb2df;
  --electric-400:#3995d2;
  --electric-500:#077ac7;  /* base sólida                       */
  --electric-600:#0961a1;
  --electric-700:#0a4b7e;
  --electric-link:#4b93e6; /* acento legível p/ link e texto    */
  --electric-grad:linear-gradient(141deg, #077ac7, #6b21ef);

  /* ---- Terciária de apoio: VIOLET (fim do gradiente electric) ---- */
  --violet-300:  #a97ef6;
  --violet-400:  #894df2;
  --violet-500:  #6b21ef;
  --violet-600:  #571cc0;
  --violet-700:  #441795;

  /* ---- Semânticas ---- */
  --success:     #2fbf9a;  --success-text: #69d1b6;
  --warning:     #fdb32c;  --warning-text: #fec867;
  --danger:      #ff492c;  --danger-text:  #ff7c67;
  --info:        #4b93e6;  --info-text:    #7db1ed;

  /* ---- Tipografia ---- */
  --font-display: "DM Sans", system-ui, sans-serif;
  --font-body:    "DM Sans", system-ui, sans-serif;
  --font-mono:    "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;

  /* escala de tipo (px de referência) */
  --fs-display: 5rem;      /* 80 */
  --fs-h1:      3.375rem;  /* 54 */
  --fs-h2:      2.5rem;    /* 40 */
  --fs-h3:      1.75rem;   /* 28 */
  --fs-h4:      1.375rem;  /* 22 */
  --fs-body-l:  1.1875rem; /* 19 */
  --fs-body:    1.0625rem; /* 17 */
  --fs-body-s:  0.875rem;  /* 14 */
  --fs-caption: 0.8125rem; /* 13 */

  /* ---- Espaçamento (base 4) ---- */
  --sp-1: 4px;  --sp-2: 8px;  --sp-3: 12px; --sp-4: 16px;
  --sp-5: 24px; --sp-6: 32px; --sp-7: 48px; --sp-8: 64px;
  --sp-9: 96px; --sp-10: 128px;

  /* ---- Raios ---- */
  --r-control: 8px;   /* botão, input          */
  --r-card:    16px;  /* card                  */
  --r-panel:   24px;  /* painel grande         */
  --r-pill:    999px; /* tag, ícone            */

  /* ---- Bordas / fio ---- */
  --bw: 1px;
  --glass:     linear-gradient(180deg, rgba(255,255,255,.055), rgba(255,255,255,.018));
  --glass-edge: rgba(255,255,255,.10);
  --glass-spec: inset 0 1px 0 rgba(255,255,255,.13);

  /* ---- Movimento ---- */
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-fast: 140ms; --dur: 240ms; --dur-slow: 420ms;

  /* ---- Layout ---- */
  --page-max: 1200px;
  --measure: 66ch;   /* comprimento de linha de leitura */
}
```

---

## 3. Sistema de cores completo

### 3.1 Primária — EMBER

Cor da marca para **CTA primário e o ponto de foco**. É o único quente em cena.
Também é a cor proposta para a pupila do olho (ver `brandbook.md §4.3`).

| Token | Hex | Uso |
|---|---|---|
| ember-300 | `#febb81` | Texto ember sobre void, ícone de ênfase |
| ember-400 | `#fda151` | Hover de texto/borda ember |
| **ember-500** | **`#fd8925`** | **Base. Fundo de CTA, pupila** |
| ember-600 | `#c86d22` | Pressed do CTA |
| ember-700 | `#995320` | Borda/sombra do CTA, estado escuro |
| gradiente | `linear-gradient(30deg,#fd8925,#ff0c00)` | Preenchimento do CTA primário |

🔴 **Regra crítica (calculada):** texto branco sobre ember dá **2.39:1 (REPROVA)**.
**O texto do CTA ember é escuro (`--void`), que dá 8.20:1 (AAA).** Nunca texto branco
sobre laranja.

### 3.2 Secundária — ELECTRIC

Cor fria para **link, foco, linha de conexão, estado ativo**. Não é cor de CTA.

| Token | Hex | Uso |
|---|---|---|
| electric-300 | `#6fb2df` | Hover de link claro |
| electric-400 | `#3995d2` | Ícone ativo |
| **electric-500** | **`#077ac7`** | **Base sólida, fundo de botão secundário** |
| electric-600 | `#0961a1` | Pressed |
| electric-700 | `#0a4b7e` | Borda/estado escuro |
| **electric-link** | **`#4b93e6`** | **Link e texto pequeno sobre void (6.18:1, AA)** |
| gradiente | `linear-gradient(141deg,#077ac7,#6b21ef)` | Linha de conexão, foco decorativo |

⚠️ **Calculado:** `#077ac7` sobre void dá **4.31:1 (só AA-large)**. Reprova em texto
de corpo. **Link e texto pequeno usam `#4b93e6`** (6.18:1, AA). Branco sobre
`#077ac7` dá 4.55:1 (AA), então botão secundário azul aceita texto branco.

### 3.3 Terciária de apoio — VIOLET

Fim do gradiente electric. Fundo de badge/tag frio, acento de card. Branco sobre
`#6b21ef` dá **6.80:1 (AA)**, então aceita texto branco.

| Token | Hex | Uso |
|---|---|---|
| violet-300 | `#a97ef6` | Texto violeta sobre void |
| violet-400 | `#894df2` | Hover |
| **violet-500** | **`#6b21ef`** | **Base, fundo de badge frio** |
| violet-600 | `#571cc0` | Pressed |
| violet-700 | `#441795` | Borda/escuro |

### 3.4 Neutros — família VOID (violeta-quente)

Rampa que vai do chão ao texto. Os neutros carregam o subtom violeta de propósito.

| Token | Hex | Papel | Contraste sobre void |
|---|---|---|---|
| void | `#0e0918` | Fundo de página, hero | — |
| surface | `#1a1624` | Fundo de card | — |
| panel | `#1b1728` | Painel grande, stage | — |
| shell | `#2c2834` | Ghost fill, superfície terciária | — |
| hairline | `#3e3a46` | Borda de baixo contraste | — |
| ink-soft | `#9d9797` | Texto secundário, legenda | **6.82:1 (AA)** |
| ink | `#d1cece` | Texto de corpo | **12.54:1 (AAA)** |
| ink-strong | `#ffffff` | Título, ênfase alta | **19.61:1 (AAA)** |

🔴 Nunca `#000` puro no fundo. Nunca `#fff` puro no corpo (só título/ênfase).

### 3.5 Semânticas

Cada uma tem a **base** (fundo de badge/alerta) e a variante **-text** (o tom claro
para texto sobre o void). Todos os números são calculados.

| Papel | Base | Sobre void | Texto claro | Sobre void | Texto por cima da base |
|---|---|---|---|---|---|
| **success** | `#2fbf9a` | 8.44 AAA | `#69d1b6` | 10.64 AAA | **void escuro** (branco reprova, 2.32) |
| **warning** | `#fdb32c` | 10.89 AAA | `#fec867` | 12.77 AAA | **void escuro** (branco reprova, 1.80) |
| **danger** | `#ff492c` | 5.83 AA | `#ff7c67` | 7.78 AAA | void escuro; branco só em texto grande (3.36) |
| **info** | `#4b93e6` | 6.18 AA | `#7db1ed` | 8.76 AAA | void escuro; branco só em texto grande (3.17) |

🔴 **Regra de ouro da paleta (calculada):** todas as cores **quentes e vibrantes**
(ember, success, warning, danger) exigem **texto escuro (void)** por cima. Só os
fundos **azul-violeta escuros** (electric-500, violet-500) aceitam texto branco.

### 3.6 Superfícies e elevação

Elevação por **degrau de cor**, uma vez só, nunca sombra externa larga.

```
void (#0e0918)  →  surface (#1a1624)  →  panel (#1b1728)  →  shell (#2c2834)
   página             card                painel/stage        controle fantasma
```

Borda: `1px solid var(--hairline)`. **Um elemento declara elevação por borda OU por
degrau de cor, nunca as duas somadas a uma sombra.** Exceção medida: o **vidro** do
cabeçalho (fio claro + especular de 1px, feito de luz e não de desfoque).

---

## 4. Sistema tipográfico

### 4.1 Recomendação — Google Fonts (oficial, em uso)

| Papel | Fonte | Por que encaixa na marca |
|---|---|---|
| **Display + corpo** | **DM Sans** | Geométrica de baixo contraste, conversa com o traço do símbolo. No peso **300** o título "sussurra" (a sobriedade da marca). É o substituto web-livre da geomanist do n8n, e não está na lista de fontes queimadas de IA. |
| **Técnica** | **JetBrains Mono** | Monoespaçada de engenharia. Nos números, rótulos e fichas dá cara de instrumento de medição, o que casa com "experiências mensuráveis". |

Carregamento (já no site): `DM Sans` opsz 9..40 nos pesos 300/400/500 e
`JetBrains Mono` 400/500.

### 4.2 Recomendação — Premium (se houver orçamento)

| Papel | Fonte premium | Por quê |
|---|---|---|
| Display + corpo | **Geomanist** (Atipo) | É a fonte **original** do DNA n8n. DM Sans é o substituto; a geomanist é o alvo exato se a marca quiser fechar a fidelidade. |
| Display alternativo | **Söhne** (Klim) | Grotesca suíça de precisão, mais "instrumento", se a marca quiser subir a sofisticação. |
| Técnica | **Berkeley Mono** | Monoespaçada premium com desenho mais autoral que a JetBrains, mesma função. |

⚠️ Não trocar por trocar. A dupla Google atual é sólida e gratuita; premium só se o
Marcelo quiser fechar a fidelidade ao n8n (geomanist) ou subir um degrau de refino.

### 4.3 Escala tipográfica

Peso do display é **300 (leve)**, não 700. **Isso diverge do padrão web comum de
propósito:** na identidade n8n o título sussurra, com tracking negativo e
line-height apertado. É a assinatura tipográfica da marca.

| Token | Tamanho | Line-height | Peso | Tracking | Fonte | Uso |
|---|---|---|---|---|---|---|
| **Display** | 80px (5rem) | 1.0 | 300 | -0.02em | DM Sans | Hero |
| **H1** | 54px (3.375rem) | 1.05 | 300 | -0.02em | DM Sans | Título de página |
| **H2** | 40px (2.5rem) | 1.1 | 400 | -0.01em | DM Sans | Cabeçalho de seção |
| **H3** | 28px (1.75rem) | 1.2 | 500 | 0 | DM Sans | Subseção |
| **H4** | 22px (1.375rem) | 1.25 | 500 | 0 | DM Sans | Título de card |
| **Body L** | 19px (1.1875rem) | 1.6 | 400 | 0 | DM Sans | Parágrafo de abertura |
| **Body** | 17px (1.0625rem) | 1.65 | 400 | 0 | DM Sans | Texto padrão |
| **Body S** | 14px (0.875rem) | 1.5 | 400 | 0 | DM Sans | Legenda, rótulo |
| **Caption** | 13px (0.8125rem) | 1.4 | 500 | 0.08em | **JetBrains Mono** | Nº de seção, ficha, rótulo técnico |
| **Legal** | 12px (0.75rem) | 1.4 | 400 | 0 | DM Sans | Nota de rodapé, jurídico |

### 4.4 Regras tipográficas

**Hierarquia de heading para SEO:**
- **Um `<h1>` por página**, e ele é o assunto real da página, não a marca do header.
- Não pular nível (`h2` depois de `h1`, `h3` dentro de `h2`). O nível é semântico,
  o tamanho é visual: se precisar de um título pequeno num nível alto, muda o
  **tamanho** (aplica o token de outro papel), não o **elemento**.
- Nunca usar heading só para engordar texto. Ênfase visual é peso e cor, não `<h#>`.

**Comprimento de linha:** alvo de leitura entre **60 e 80 caracteres** (`--measure:
66ch`). Linha mais longa cansa; mais curta pica o ritmo.

**Tamanho mínimo:** nenhum texto de **leitura** abaixo de **14px** no site. Rótulo
técnico em mono pode ir a 13px (é etiqueta, não leitura corrida). Em peça de
carrossel/social a régua é outra e mais alta (corpo com piso de 34px, ver
`_memoria/conteudo/10-legibilidade.md`).

**Regras de cor de fonte:**
- Corpo usa **`--ink` (`#d1cece`)** sobre superfícies escuras. Nunca `#fff` no corpo.
- Título e ênfase alta usam **`--ink-strong` (`#fff`)**.
- Secundário e legenda usam **`--ink-soft` (`#9d9797`)** (6.82:1, AA, não descer disso).
- Link e texto pequeno colorido usam **`--electric-link` (`#4b93e6`)**, nunca o
  electric-500 sólido (que reprova em corpo).
- Texto sobre fundo quente (ember/success/warning/danger) é **escuro (`--void`)**.

---

## 5. Diretrizes do logotipo

> O símbolo é o olho de Hórus; a assinatura é olho + fio vertical + `HÓRUS` +
> descritiva `AGÊNCIA`. Construção e conceito em `brandbook.md §4`.

### 5.1 As quatro variantes

| Variante | Composição | Onde usar |
|---|---|---|
| **1. Principal** | Ícone + fio + `HÓRUS` + `AGÊNCIA` | Uso padrão: home, capa de proposta, slide de abertura |
| **2. Horizontal** | Ícone + `HÓRUS` lado a lado, compacto (descritiva opcional) | Faixas largas e baixas: header de site, rodapé, cabeçalho de e-mail |
| **3. Ícone só** | Só o olho | Espaço pequeno: favicon, ícone de app, avatar de rede, selo |
| **4. Wordmark só** | Só `HÓRUS` (Montserrat) | Quando o olho fica pequeno demais para ler, ou sobre fundo que compete com o traço |

### 5.2 Variantes de cor aprovadas

- **Padrão:** traço claro do olho sobre void, com a pupila em **EMBER** (proposta de
  reconciliação, `brandbook.md §4.3`; até confirmar, o legado usa pupila dourada).
- **Monocromática clara:** todo o desenho em `--ink-strong` sobre void.
- **Monocromática escura:** todo o desenho em `--void` sobre fundo claro.
- `[FALTA: arquivos SVG dessas variantes]`. Hoje só existe bitmap (`simbolo.webp`,
  `assinatura.webp`); as variantes mono e o vetor ainda não foram gerados.

### 5.3 Zona livre e tamanho mínimo

- **Zona livre (regra provisória até o manual medir):** respiro em volta da
  assinatura igual à **altura da letra `H`** do logotipo, em todos os lados. Nada de
  texto ou borda dentro dessa zona.
- **Tamanho mínimo:** assinatura completa não abaixo de **~120px** de largura.
  Abaixo disso, usar a variante **Ícone só**. Favicon a 32px e 16px usa o ícone.
- `[FALTA: valores oficiais de zona livre e tamanho mínimo do manual]`.

### 5.4 Usos proibidos

- Sobre **fundo complexo** (foto sem tratamento). Único uso reprovado no próprio manual.
- Olho **ampliado como marca-d'água** atrás de seção (mesmo desenho duas vezes).
- **Distorcer, rotacionar, recolorir** fora da paleta, ou trocar a fonte do wordmark.
- **Gradiente** aplicado ao wordmark em texto (some no celular).
- Adicionar sombra, contorno ou brilho ao logo que o manual não prevê.

---

## 6. O que vem na Parte 2

`design-system-componentes.md` (biblioteca de componentes), cada um com variantes,
estados, tokens consumidos, acessibilidade, e "quando usar / quando não usar":

1. **Botões** (primário, secundário, fantasma, destrutivo; sm/md/lg; todos os estados)
2. **Formulário** (input, textarea, select, checkbox, radio, toggle)
3. **Cards** (conteúdo, recurso, preço)
4. **Navegação** (desktop, mobile, breadcrumb)
5. **Alertas e notificações** (as quatro semânticas)
6. **Badges e tags**
7. **Modais e overlays**
8. **Tipográficos** (blockquote, bloco de código, callout)
9. **Data display** (tabela, lista, stat tile)
10. **Layout** (divisor, espaçador, grade)
11. **Feedback** (loading, empty state, error state)

---

*Fim da Parte 1. As regras de contraste aqui são calculadas; ao mudar qualquer hex,
recalcular com o script em `scratchpad/contrast.mjs`, nunca estimar.*
