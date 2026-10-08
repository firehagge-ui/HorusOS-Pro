# Escritório da Mesa de agentes: como entra arte nova

O cenário e os especialistas são desenhados pelo Marcelo no ChatGPT e montados aqui (01/10/2026).
O código que anima tudo é `app/js/pixel.js`.

## Palco (cenário)
Três imagens 2000x667 (manhã, tarde, noite) com 5 mesas e cadeiras vazias, em `app/assets/escritorio/`.
A camada da frente (mesa, monitores, canecas, plantas) sai de uma máscara por palco:

    python scripts/escritorio/mascara.py noite.webp frente-noite.png tarde.webp frente-tarde.png manha.webp frente-manha.png

A máscara sai em tons de cinza; o painel usa a versão com canal alfa (`frente-<hora>.png`). Se o palco mudar de
desenho, as cadeiras e monitores mudam de lugar: refazer as medidas em `EST` (mascara.py) e em `ASSENTOS` (pixel.js).

## Especialista
Uma folha por especialista, gerada com o prompt da folha (6 poses numa linha, fundo magenta #FF00FF, virado pra
esquerda, sem cadeira nem mesa): 1 digitando, 2 digitando (segundo quadro), 3 mão levantada, 4 acenando,
5 dormindo, 6 comemorando.

    python scripts/escritorio/folha.py folha.png esp-<id> --sem-cadeira   # tira magenta, separa as poses
    # sem --sem-cadeira: também apaga a cadeira do desenho (a folha da Clara veio com cadeira)
    # --limpa-rosa: tira o magenta que vaza por lente transparente (Rafa); não usar em quem veste roxo
    python scripts/escritorio/piscar.py esp-<id> '{"0": [[x0,y0,x1,y1],[...]], "1": [...]}'   # caixas dos olhos

Depois: converter pra webp (`quality=92, alpha_quality=100`), pôr em `app/assets/escritorio/esp-<id>.webp` e
registrar em `FOLHAS` no pixel.js (as medidas de cada pose vêm do .json; `dx` alinha cada pose com a primeira,
`ax` é o meio do rosto; o `dx` sai do `alinhar.py`: correlação da faixa do tronco de cada pose com a primeira).
`<id>` é o id do especialista (clinicas, eventos, oficinas). O rostinho das listas é `rosto-<id>.webp` (96x96,
recorte do rosto da primeira pose sobre #241B2A).
Conferir sempre num print: sobra de cadeira, franja magenta, olho piscando no lugar.
