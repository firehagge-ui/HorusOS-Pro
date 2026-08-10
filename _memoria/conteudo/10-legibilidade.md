# Legibilidade em peça social — os pisos duros

> Criado em 03/08/2026. Estes números **não são sugestão de estilo**, são piso.
> Abaixo deles a peça fica ilegível no lugar onde ela é consumida de verdade:
> um celular, na mão, em movimento, com brilho ruim.

---

## O erro que estava na skill

A `/carrossel` mandava usar corpo de 20 a 24px e eyebrow de 13 a 16px numa peça
de 1080px de largura. Parece razoável quando você olha o HTML no monitor. Não é.

**A conta.** O carrossel é renderizado a 1080px e exibido num feed de celular com
cerca de 390px de largura útil. O fator é **0,36**. Então:

| No HTML | No celular |
|---|---|
| 16px | 5,8px |
| 20px | 7,2px |
| 24px | 8,7px |
| **34px** | **12,3px** |
| 58px | 21px |
| 90px | 32,5px |

Corpo de 22px vira 8px na mão da pessoa. Eyebrow de 14px vira 5px. É o mesmo erro
que o detector do impeccable pega no site com as regras `tiny-text` e
`undersized-ui-text` — só que no carrossel ninguém tinha rodado detector nenhum.

Descoberto na comparação com o `opensquad`, 03/08/2026. A escala abaixo já está
corrigida.

---

## Escala mínima por formato

Piso absoluto, para qualquer texto feito pra ser lido, em qualquer peça: **24px**.
O que estiver abaixo disso é decoração, não texto, e não pode carregar informação.

### Carrossel e post de feed (1080 × 1350)

| Papel | Piso | Faixa boa | Peso |
|---|---|---|---|
| Título de capa | 58px | 90 a 110px | 800-900 |
| H2 de slide interno | 43px | 60 a 76px | 700-800 |
| Corpo | 34px | 34 a 42px | 500 |
| Eyebrow / rótulo | 24px | 26 a 30px | 700-800 |
| Rodapé, @, crédito | 24px | 24 a 28px | 500-600 |

### Story e Reels (1080 × 1920)

Hero 56px · H2 42px · corpo 32px · rodapé 20px. A tela é maior em altura, mas a
distância de leitura é a mesma.

### LinkedIn horizontal (1200 × 627)

Hero 40px · corpo 24px · rodapé 20px. Aqui o consumo é mais em desktop, o que
alivia — mas não some.

---

## O que a escala corrigida faz com o texto

Levantar o corpo de 22 para 36px reduz drasticamente quanto texto cabe num slide.
**Isso é o efeito desejado, não um efeito colateral.** Com 36px e largura útil de
940px, cabem umas 5 palavras por linha. Quatro linhas são 20 palavras. Com o H2,
o slide fecha entre 25 e 45 palavras.

Então a regra de densidade sai da própria escala:

> **Entre 20 e 45 palavras por slide, em no máximo 4 linhas visíveis de corpo.**

⚠️ O `opensquad` manda de 40 a 80 palavras por slide (`instagram-feed.md`) e ao
mesmo tempo proíbe passar de 4 ou 5 linhas visíveis (`anti-patterns.md`) e exige
corpo de 34px (`image-design.md`). As três regras não fecham juntas. Ficamos com
as duas que se sustentam: piso de fonte e limite de linha. O número de palavras é
consequência, não meta.

---

## Contraste

Mínimo **4,5:1** entre texto e fundo, WCAG AA. Mesma régua do site — a tabela de
contraste medida da paleta terrosa está em `_memoria/design/99-checklist.md`.

Texto sobre foto **nunca** vai direto. Precisa de uma das três:

1. Overlay sólido a 60% ou mais
2. Gradiente de sólido pra transparente, com o texto no lado sólido
3. Faixa/caixa atrás do bloco de texto

Sombra de texto **não conta** como proteção de contraste. Ela ajuda a borda da
letra e não resolve o miolo.

---

## Dimensão e proporção

**Carrossel e post de feed: 1080 × 1350 (4:5).** É o que ocupa mais tela no feed.

Duas coisas que valem lembrar:

- **A primeira imagem define a proporção do carrossel inteiro.** Se o slide 1 sai
  em 4:5, todos os outros são cortados pra 4:5, mesmo que tenham sido exportados
  em outra medida. Renderizar tudo na mesma dimensão, sempre.
- **A grade do perfil corta em 3:4.** Uma peça 4:5 aparece na grade com cerca de
  17px cortados de cada lado. É pouco, mas logo e texto encostados na borda
  lateral perdem pedaço na grade. Manter os 70 a 100px de padding lateral resolve.

Story e Reels: 1080 × 1920 (9:16), só quando pedido.

---

## HTML que renderiza sem surpresa

- Autocontido: CSS inline. A **única** dependência externa permitida é Google
  Fonts por `@import`
- Nada de CDN de framework, nada de JavaScript
- Imagem por caminho absoluto ou `data:` URI
- `width` e `height` fixos em px no container, batendo com a viewport de captura.
  Nunca `height: auto`
- Grid e Flexbox pro layout estrutural. Posição absoluta só pra elemento
  decorativo que flutua (marca d'água, seta de swipe)
- Peso de fonte 500 ou mais em qualquer texto de leitura. Pesos 100 a 300 não
  sobrevivem à compressão do Instagram

## Verificação antes de renderizar o lote

Renderizar o **slide 1 sozinho**, abrir o PNG e olhar. Só depois renderizar o
resto. Um erro de espaçamento, uma fonte que não carregou ou um texto cortado no
slide 1 se repete nos outros dez se não for pego agora.

O jeito de olhar que funciona: ler o PNG (não o HTML) e conferir se o texto cabe,
se nada está cortado e se a fonte é a certa. O HTML pode estar perfeito e a fonte
ter caído no fallback sem avisar.
