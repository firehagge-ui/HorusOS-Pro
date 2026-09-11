# Stack de animação e WebGL — o que adotar e o que evitar

Referência compartilhada pelas skills do cannonball. Números conferidos em 2026-08-04
contra o npm e o índice do acervo.

---

## Theatre.js

### O modelo

Quatro camadas, e é preciso entender as quatro para que qualquer exemplo faça sentido:

```
Project  →  Sheet  →  Object (props)  →  Sequence
```

- **Project** — a unidade de estado. `getProject('Meu Site')`. É ele que carrega o
  JSON exportado.
- **Sheet** — um conjunto de coisas que animam juntas. Um projeto tem vários.
  Dá para instanciar o mesmo sheet várias vezes com tempos independentes.
- **Object** — qualquer coisa animável, com props tipadas. Não precisa ser 3D:
  pode ser um `{ y: 0, opacity: 1 }` que você aplica num `<h1>`.
- **Sequence** — **uma por sheet**. É a timeline com todos os keyframes daquele sheet.

```js
import { getProject, types } from '@theatre/core'

const project = getProject('Meu Site')
const sheet   = project.sheet('Hero')
const obj     = sheet.object('Título', {
  y:       0,
  opacity: types.number(1, { range: [0, 1] }),
})

obj.onValuesChange(({ y, opacity }) => {
  el.style.transform = `translateY(${y}px)`
  el.style.opacity   = opacity
})
```

Tipos de prop: `number(v, {range, nudgeMultiplier})`, `compound({...})`, `boolean`,
`string`, `stringLiteral(v, {opções}, {as:'switch'})`, `rgba`, `image`.

### O que ele realmente é

**Um editor visual de timeline que exporta JSON.** Essa é a proposta inteira. Você
abre o Studio em desenvolvimento, arrasta keyframes, ajusta curvas com o olho, e
exporta o resultado como estado. Em produção, o JSON entra e o Studio sai.

```js
// produção — sem Studio
import state from './estado.json'
const project = getProject('Meu Site', { state })
project.ready.then(() => sheet.sequence.play({ iterationCount: Infinity }))
```

### O padrão que importa para sites: dirigir pelo scroll

`sequence.position` tem setter. É isso que liga o Theatre ao scroll:

```js
// a timeline inteira vira função da rolagem
const duracao = 6
lenis.on('scroll', ({ progress }) => {
  sheet.sequence.position = progress * duracao
})
```

Não há API de scroll no Theatre.js. Quem detecta viewport e suaviza a rolagem
continua sendo ScrollTrigger e Lenis — o Theatre só recebe a posição.

### rafDriver: não crie um segundo loop

`createRafDriver()` deixa o Theatre tickar **dentro** do loop que já existe. Com GSAP
e Lenis no projeto, use isso — senão são dois rAF concorrendo e o movimento
dessincroniza.

### Produção — três armadilhas reais

1. **O Studio pesa 21,3 MB descompactado**; o core, 0,9 MB. Ele **precisa** ficar
   fora do build. Gate por ambiente e importe dinamicamente:
   ```js
   if (process.env.NODE_ENV === 'development') {
     const studio = (await import('@theatre/studio')).default
     studio.initialize()
   }
   ```
2. **`@theatre/r3f` declara `@theatre/studio` como peer dependency.** Excluir o
   Studio é mais difícil no caminho 3D do que no de HTML. Confira o bundle final.
3. **A documentação em `/docs/latest` mostra instalação da 0.5; o npm está em 0.7.2.**
   Confira a API contra a versão que você instalou antes de confiar num exemplo.

### Quando adotar — e quando não

GSAP + Lenis é o par padrão do cannonball. ScrollTrigger já resolve
animação dirigida por scroll. Theatre.js não é um substituto: é um **fluxo de
autoria diferente**.

**Adote quando:**
- Há coreografia de muitas propriedades ao mesmo tempo e acertar os valores na mão
  é sofrido — o caso clássico é **movimento de câmera em r3f**.
- Quem ajusta o timing não é quem escreve o código.
- A animação vai passar por muitas rodadas de refino visual.

**Não adote quando:**
- É reveal de entrada, menu, animação de texto ou scroll de uma propriedade só.
  GSAP exige muito menos montagem para o mesmo resultado.
- O projeto é pequeno: instalar core + studio + fluxo de export para animar dois
  elementos é desproporcional.

Resumo honesto: **vale pelo 3D e pela câmera, não pelo que o acervo já cobre.**

---

## WebGL — o que está vivo

Verificado no npm em 2026-08-04. A lista de referência que originou esta seção avisa
na própria primeira linha que boa parte está desatualizada — e está mesmo.

### Vivas e recomendadas

| Lib | Versão | Último release | No acervo | Para quê |
|---|---|---|---|---|
| `three` | 0.185.1 | 1 mês | padrão | 3D de propósito geral. É a base de tudo aqui. |
| `@react-three/fiber` | 9.7.0 | 1 mês | **0** | three declarativo em React. Caminho natural no Next.js. |
| `@react-three/drei` | 10.7.8 | 0 mês | **0** | helpers de r3f (controles, loaders, materiais). |
| `postprocessing` | 6.39.4 | 1 mês | 1 peça | bloom, aberração, DOF. |
| `pixi.js` | 8.19.0 | 2 meses | **0** | **2D em WebGL** — filtros, displacement, partículas. |
| `@babylonjs/core` | 9.20.0 | 0 mês | 0 | engine completa; mais orientada a jogo. |
| `p5` | 2.3.2 | 1 mês | 0 | creative coding, esboço rápido. |
| `deck.gl` / `luma.gl` | 9.3.x | 1 mês | 0 | visualização de dados em camadas. |
| `cesium` | 1.144.0 | 0 mês | 0 | globo e mapa 3D de verdade. |
| `aframe` | 1.8.0 | 2 meses | 0 | VR declarativo. |

### Paradas — não comece nada novo com estas

| Lib | Último release | Situação |
|---|---|---|
| `ogl` | 2025-01 (19 meses) | **2 peças do acervo dependem dela** (`ok-chromatic-waves`, `ok-dotmatrix`) |
| `regl` | 2024-11 (21 meses) | parado |
| `nanogl` | 2022-09 | 47 meses |
| `picogl` | 2022-01 | 55 meses |
| `zen-3d` | 2021-02 | 66 meses |
| `claygl` | 2019-01 | 91 meses |
| `phenomenon-px` | 2018-08 | 96 meses |

`stack.gl`, `lightgl.js`, `Pex`, `AwayJS`, `SceneJS`, `Blend4Web`, `Turbulenz`,
`GLOW`, `GrimoireJS`, `KickJS`, `Four`, `TDL`, `Alfrid`, `Medium`, `GLBoost`,
`litegl`, `litescene`, `Hilo3d`, `RedCube`, `RedGL2`, `CraZyPG`, `mini-webgl`,
`WhitestormJS`, `OSG.js`, `gl-engine`, `GLAM`, `Helix`, `Filament`, `xeogl`,
`PhiloGL` — projetos de estudo ou abandonados. Não entram na recomendação.

### As duas lacunas que valem preencher

1. **`@react-three/fiber` + `@react-three/drei` — zero peças.** O acervo tem 28 com
   three puro, mas nenhuma no caminho React. Como você trabalha em Next.js, é a
   lacuna mais relevante: é o que permite três.js declarativo dentro de componente,
   e é também o pré-requisito do Theatre.js para animar câmera.

2. **`pixi.js` — zero peças.** Todo o WebGL do acervo é 3D. Muito efeito de site é
   **2D acelerado**: distorção de imagem, filtro de deslocamento, transição entre
   fotos, partículas em plano. Pixi resolve isso com muito menos custo que montar
   uma cena three só para exibir um plano com shader.

### Como escolher, na prática

- Objeto, cena, câmera, profundidade → **three** (+ r3f se for React).
- Efeito sobre imagem ou plano 2D → **pixi.js**; se já houver three no projeto,
  reaproveite em vez de somar as duas.
- Pós-processamento (bloom, aberração) → **postprocessing** sobre three.
- Só um shader de fundo, sem cena → não precisa de biblioteca: um `<canvas>` com
  WebGL cru resolve, e é o que a maioria das peças `tem_webgl` faz.
- Dados geográficos → **deck.gl** ou **cesium**. Fora disso, não.
