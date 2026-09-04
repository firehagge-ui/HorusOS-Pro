# Sistema de Design — Parte 2: Biblioteca de Componentes

> Consome os tokens de `design-system.md` (Parte 1). Cada componente traz variantes,
> tamanhos, estados, tokens usados, acessibilidade e "quando usar / quando não usar".
> Identidade: DNA n8n. **Regra de ouro que atravessa tudo:** fundo quente
> (ember/success/warning/danger) leva texto **escuro (`--void`)**; só fundo
> azul-violeta escuro (electric/violet) leva texto **branco**.
>
> **Versão:** 1.0 · **Data:** 29/08/2026.

---

## 1. Botões

### 1.1 Variantes

| Variante | Fundo | Texto | Borda | Uso |
|---|---|---|---|---|
| **Primário** | `--ember-grad` | **`--void`** (escuro!) | nenhuma | Ação principal da tela. **Um por vista.** |
| **Secundário** | `--electric-500` | `--ink-strong` (branco, 4.55 AA) | nenhuma | Ação de apoio ao lado do primário |
| **Fantasma** | transparente | `--ink` | `1px --hairline` | Ação terciária, barra de ferramentas, "cancelar" |
| **Destrutivo** | `--danger` | **`--void`** (escuro!) | nenhuma | Excluir, remover. Sempre pede confirmação |
| **Link** | transparente | `--electric-link` | nenhuma | Ação inline dentro de texto |

### 1.2 Tamanhos

| Tamanho | Altura | Padding H | Fonte | Raio |
|---|---|---|---|---|
| **sm** | 36px | `--sp-4` (16) | Body S 14 / 500 | `--r-control` (8) |
| **md** | 44px | `--sp-5` (24) | Body 17 / 500 | `--r-control` (8) |
| **lg** | 52px | `--sp-6` (32) | Body L 19 / 500 | `--r-control` (8) |

Altura mínima do alvo de toque: **44px** (md e lg passam; sm só em densidade
desktop, não em fluxo mobile principal).

### 1.3 Estados (todas as variantes)

| Estado | Tratamento |
|---|---|
| **Default** | Cor base da variante |
| **Hover** | Primário: brilho +6% no gradiente. Secundário: `--electric-600`. Fantasma: fundo `--shell`. |
| **Active/pressed** | Escurece um degrau (ember-600 / electric-600 / danger escuro) e afunda 1px |
| **Focus** | Anel de foco: `0 0 0 3px rgba(75,147,230,.5)` (electric-link a 50%), sempre visível, nunca `outline:none` sem substituto |
| **Disabled** | `opacity:.45`, `cursor:not-allowed`, sem hover. Fundo vira `--shell`, texto `--ink-soft` |
| **Loading** | Spinner de 16px centralizado, texto com `opacity:0` (mantém a largura), `aria-busy="true"`, botão inerte |

### 1.4 Tokens usados

Cor: `--ember-grad`, `--void`, `--electric-500/600`, `--danger`, `--ink`,
`--ink-strong`, `--hairline`, `--shell`. Espaço: `--sp-4/5/6`. Tipo: Body S / Body /
Body L peso 500. Raio: `--r-control`. Movimento: `--dur-fast`, `--ease`.

### 1.5 Acessibilidade

- Contraste do rótulo já validado: ember+void 8.20:1, electric+branco 4.55:1,
  danger+void 5.83:1. **Nunca** branco sobre ember (2.39, reprova).
- Foco sempre visível. Alvo de toque ≥ 44px no fluxo principal.
- Botão-ícone sem texto precisa de `aria-label`.
- Estado loading anuncia com `aria-busy`; disabled com `aria-disabled` ou `disabled`.

### 1.6 Quando usar / quando não

- **Use primário** para a única ação que a tela quer que a pessoa faça. Dois
  primários competindo é o erro mais comum.
- **Não use** botão para navegação simples entre páginas (isso é link).
- **Não empilhe** três cores cheias juntas; o segundo e o terceiro viram fantasma.
- **Relacionados:** Link (§1.1), Badge (§6) para status não clicável.

---

## 2. Formulário

### 2.1 Campos

| Componente | Anatomia | Estados |
|---|---|---|
| **Input texto** | Label (Body S) + campo + hint/erro | default, focus (anel electric), erro (borda `--danger`, texto `--danger-text`), disabled |
| **Textarea** | Igual ao input, altura mínima 96px, resize vertical | idem |
| **Select** | Campo + chevron; menu em `--surface`, item ativo `--shell` | idem + aberto |
| **Checkbox** | Caixa 20px, marca em `--ember` quando ativo | default, checked, indeterminate, disabled, focus |
| **Radio** | Círculo 20px, ponto `--ember` quando ativo | default, checked, disabled, focus |
| **Toggle** | Trilho 44×24, botão desliza; ativo = trilho `--electric-500` | off, on, disabled, focus |

### 2.2 Especificação visual do campo

- Fundo `--surface`, borda `1px --hairline`, raio `--r-control` (8px), altura 44px,
  padding `0 --sp-4`. Texto digitado `--ink`, placeholder `--ink-soft`.
- **Focus:** borda `--electric-link` + anel `0 0 0 3px rgba(75,147,230,.35)`.
- **Erro:** borda `--danger`, mensagem em `--danger-text` (Body S) abaixo do campo.
- **Label sempre visível** acima do campo. Placeholder não substitui label.

### 2.3 Acessibilidade

- Todo campo tem `<label for>` associado. Erro ligado por `aria-describedby`.
- Grupo de radio/checkbox em `<fieldset>` com `<legend>`.
- Estado de erro não comunicado só por cor: sempre texto + ícone.
- Foco visível em todos, inclusive checkbox/radio/toggle.

### 2.4 Quando usar / quando não

- **Toggle** para efeito imediato (liga/desliga uma preferência). **Checkbox** para
  escolha que só vale ao enviar o formulário. Confundir os dois é antipadrão.
- **Radio** para escolha única entre poucas opções visíveis; **Select** quando são
  muitas ou o espaço é curto.
- **Relacionados:** Botão (§1) para submit, Alerta (§5) para erro de formulário inteiro.

---

## 3. Cards

| Tipo | Conteúdo | Notas |
|---|---|---|
| **Conteúdo** | Título (H4) + corpo + link | Fundo `--surface`, raio `--r-card` (16), padding `--sp-5`. Elevação por cor, sem sombra. |
| **Recurso** | Ícone + título + descrição curta | Ícone em cor de acento do card (um matiz do §3.4 da Parte 1), traço fino |
| **Preço** | Nome do plano + preço (H2, mono opcional) + lista + CTA | Um card "destaque" com borda `--electric-500`; nunca três cores cheias |

- **Hover (se clicável):** borda passa de `--hairline` para `--electric-link`, sem
  levantar sombra. Card não clicável não muda no hover.
- **Acessibilidade:** card clicável inteiro é um `<a>`/`<button>` com foco visível,
  não um `onclick` em `<div>`. Título do card é heading do nível correto.
- **Quando não usar:** card dentro de card dentro de card. Máximo um nível de
  aninhamento. **Relacionados:** Stat tile (§9) para número solto.

---

## 4. Navegação

| Componente | Especificação |
|---|---|
| **Desktop** | Header fixo, **vidro** (o único painel sobre conteúdo), altura 80px. Logo à esquerda, itens à direita (Body, `--ink`), item ativo `--ink-strong` com fio ember de 2px embaixo. CTA à direita. |
| **Mobile** | Header 56px + botão de menu. Menu abre em painel `--panel` cobrindo a tela, itens em H4, foco preso no painel (focus trap), fecha no Esc. |
| **Breadcrumb** | Itens em Body S `--ink-soft`, separador "/" (nunca o tracinho), item atual `--ink` com `aria-current="page"` |

- **Acessibilidade:** `<nav>` com `aria-label`. Menu mobile com `aria-expanded` no
  botão, foco preso, retorna o foco ao botão ao fechar. Skip-link para o conteúdo.
- **Quando não usar:** mega-menu para um site de 5 páginas. **Relacionados:** Botão (§1).

---

## 5. Alertas e notificações

Uma cor semântica por tipo, **fundo escuro tingido** + barra/ícone na cor, texto
claro. Fundo cheio na cor semântica só em badge pequeno (§6), não em alerta grande.

| Tipo | Ícone/barra | Fundo | Texto |
|---|---|---|---|
| **Success** | `--success` | `rgba(47,191,154,.12)` | `--success-text` no destaque, `--ink` no corpo |
| **Warning** | `--warning` | `rgba(253,179,44,.12)` | `--warning-text` / `--ink` |
| **Danger** | `--danger` | `rgba(255,73,44,.12)` | `--danger-text` / `--ink` |
| **Info** | `--info` | `rgba(75,147,230,.12)` | `--info-text` / `--ink` |

- **Toast (notificação):** canto da tela, some sozinho (success/info) ou fica até
  fechar (warning/danger). `role="status"` (info/success) ou `role="alert"` (danger).
- **Acessibilidade:** nunca comunicar o tipo só por cor, sempre ícone + texto. Alerta
  crítico usa `role="alert"` (lido na hora); informativo `role="status"`.
- **Quando não usar:** alerta para tudo. Excesso de toast vira ruído. **Relacionados:**
  Badge (§6) para status persistente e pequeno.

---

## 6. Badges e tags

| Tipo | Visual | Uso |
|---|---|---|
| **Badge de status** | Pílula, fundo cheio na cor semântica, **texto void escuro** (regra de ouro) | "Ativo", "Pendente", "No ar" |
| **Tag** | Pílula, fundo `--shell`, texto `--ink`, borda `--hairline` | Categoria, filtro, rótulo neutro |
| **Contador** | Círculo `--ember`, número em `--void`, mono | Notificações não lidas |

- **Acessibilidade:** badge que não é só decorativo tem texto real (não só cor).
  Contador de notificação com `aria-label` ("3 não lidas").
- **Quando não usar:** badge clicável que deveria ser botão/link. Badge é status, não
  ação. **Relacionados:** Alerta (§5) para mensagem, não rótulo.

---

## 7. Modais e overlays

- **Overlay:** `rgba(14,9,24,.72)` cobrindo a página, fecha no clique fora e no Esc.
- **Modal:** `--panel`, raio `--r-panel` (24), largura máx ~560px, padding `--sp-6`.
  Título (H3) + corpo + rodapé com botões (primário à direita).
- **Acessibilidade:** `role="dialog"` + `aria-modal="true"` + `aria-labelledby` no
  título. **Focus trap** dentro do modal, foco vai pro primeiro elemento ao abrir e
  **volta ao gatilho** ao fechar. Esc fecha. Fundo fica inerte (`inert`).
- **Quando não usar:** modal para conteúdo longo (isso é página) ou para confirmação
  trivial que um inline resolve. Nunca modal sobre modal. **Relacionados:** Alerta (§5).

---

## 8. Componentes tipográficos

| Componente | Especificação |
|---|---|
| **Blockquote** | Barra de 3px `--electric-500` à esquerda, texto Body L `--ink` itálico, recuo `--sp-5` |
| **Bloco de código** | Fundo `--panel`, fonte `--font-mono` Body S, padding `--sp-4`, raio `--r-control`, scroll horizontal próprio (nunca estoura a página) |
| **Callout** | Card `--surface` com ícone + faixa de acento (electric para nota, ember para atenção), título Body 500 + corpo |

- **Acessibilidade:** código com `<pre><code>`; callout não depende só de cor (tem
  ícone + rótulo). **Relacionados:** Alerta (§5) para mensagem de sistema.

---

## 9. Exibição de dados

| Componente | Especificação |
|---|---|
| **Tabela** | Cabeçalho `--panel` texto `--ink-soft` mono Caption; linhas zebradas por `--surface`; número alinhado à direita com `--font-mono` e `tabular-nums`. Scroll horizontal próprio no mobile. |
| **Lista** | Item com divisor `1px --hairline`; ícone/afford à esquerda, meta à direita |
| **Stat tile** | Número grande (H1/H2, mono ou display) + rótulo Body S `--ink-soft`. **Todo número diz de onde veio**, na própria linha (regra da casa) |

- **Acessibilidade:** tabela com `<th scope>`, `<caption>`. Número nunca comunicado
  só por cor. **Quando não usar:** tabela para layout (use grade). **Relacionados:**
  Card (§3), Grade (§10).

---

## 10. Componentes de layout

| Componente | Especificação |
|---|---|
| **Divisor** | `1px --hairline`, margem vertical `--sp-6`. Só quando a mudança de cor de superfície não basta |
| **Espaçador** | Múltiplos da escala base-4 (`--sp-*`). Nunca valor mágico solto |
| **Grade** | 12 colunas, gutter `--sp-5` (24), largura máx `--page-max` (1200), margem lateral fluida. Mobile: 1 coluna, gutter `--sp-4` |

- **Ritmo vertical:** seções respiram em `--sp-9` (96) no desktop, `--sp-7` (48) no
  mobile. **Relacionados:** todos os componentes assentam na grade.

---

## 11. Componentes de feedback

| Estado | Especificação |
|---|---|
| **Loading** | Skeleton em `--shell` com shimmer sutil (não spinner para página inteira); spinner só para ação pontual. `aria-busy` na região |
| **Empty state** | Ícone/ilustração contida + título H4 + uma linha de corpo + **um** CTA. Diz o que fazer, não só "nada aqui" |
| **Error state** | Ícone `--danger` + título + causa em linguagem humana + ação de recuperação (tentar de novo). Nunca só um código de erro cru |

- **Acessibilidade:** estado de erro com `role="alert"`; loading com `aria-busy`;
  empty state é conteúdo real, navegável por teclado.
- **Quando não usar:** spinner infinito sem timeout nem saída. Todo loading tem um
  caminho para o erro. **Relacionados:** Alerta (§5), Botão (§1) na ação de recuperação.

---

*Fim da Parte 2. Todo componente herda a regra de contraste calculada na Parte 1:
nenhuma exceção sem recalcular.*
