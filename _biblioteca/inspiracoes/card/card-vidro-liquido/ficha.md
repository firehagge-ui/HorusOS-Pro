# Card de vidro líquido (refração ao vivo)

> Guardado em 28/08/2026. O Marcelo gostou do card e pediu para preservar para uso
> futuro em outro site, mesmo depois de descartar a landing de tela única onde ele
> nasceu. Os cinco arquivos aqui são a **implementação funcional exata**, servem
> como demo isolada: `node serve.mjs` nesta pasta abre em http://127.0.0.1:8123.

## O que é reutilizável

O componente é o **cartão que funciona como janela para uma cópia refratada do
fundo**. As três peças que importam:

1. **O filtro SVG `#liquid-glass-refraction`** (em `index.html`). É a receita toda:
   `feTurbulence` (mapa de normais) → máscara de borda (alpha estourado, blur 45,
   invertido por `feFuncA slope="-1.3"`) → ruído multiplicado pela máscara → **três
   passes de deslocamento em escalas diferentes (65/56/47), um por canal RGB**,
   recombinados com dois `screen`. É isso que dá o bisel grosso de vidro e a franja
   cromática só na aresta. Os valores são tunados: não mexer sem motivo.

2. **O CSS do card** (em `styles.css`, blocos `.card`, `#dup-video-container`,
   `#dup-image`, `.card__frost`). Três camadas empilhadas: duplicado refratado no
   `z-index:0`, brilho fosco no `1`, texto no `2`. O `overflow:hidden` +
   `border-radius` recortam o duplicado.

3. **O sync quadro a quadro** (`glass-card.js`). Mede o card, posiciona o container
   duplicado em `-rect.left/-rect.top` do tamanho da viewport (para as bandas de
   separação de canal caírem fora do card), e copia o fundo para o canvas do card,
   que carrega o filtro por CSS.

## Como plugar em outro fundo

Nesta versão o fundo é um **canvas 2D on-brand** (campo iridescente) desenhado em
`glass-card.js`. O truque funciona com qualquer fonte desenhável num canvas 2D:
- `<video>` (o conceito original) — aí o duplicado faz `drawImage(video, ...)` com a
  conta de `object-fit: cover`;
- outro canvas (2D ou WebGL) — `drawImage(canvasFonte, ...)`;
- uma imagem estática — desenha uma vez, o filtro ainda refrata.

## Custo e armadilhas

- O filtro SVG roda por quadro num canvas do tamanho da viewport. **Mantém o
  duplicado em 1x mesmo em retina** (`DUP_PIXEL_RATIO = 1`): o custo escala com
  pixels e a refração é macia.
- **Artefato inerente:** quando o card fica quase da largura da tela (mobile), a
  borda esquerda cai na zona da máscara de borda (45px) e aparece uma faixa
  cromática. Não é bug e não se conserta mexendo no filtro; some quando o card é
  estreito em relação à viewport.
- Sem framework, sem build, sem WebGL, sem three.js.

## Relação com a casa

⚠️ Isto é **padrão de componente**, não decisão de identidade da Hórus. A landing de
onde saiu foi descartada porque virou "um site de uma cor só" (ver
`site-backup-2026-08-28/` e o histórico). O vidro é bom; a aplicação errada foi o
problema. Reaproveitar o mecanismo, não a página.
