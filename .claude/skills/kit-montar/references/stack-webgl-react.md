# React Three Fiber, drei e PixiJS no cannonball

Levantado em **agosto de 2026**, contra as versões publicadas na data. Números de
versão envelhecem: confira com `npm view <pacote> version` antes de confiar.

O acervo tinha **0 peças** de R3F e **0** de Pixi — as duas maiores lacunas de
biblioteca. Este documento é o julgamento de onde cada uma entra no **seu** jeito
de trabalhar (Next.js, GSAP, Lenis, site de marca dirigido por scroll), não um
resumo da documentação.

---

## Versões e saúde (ago/2026)

| Pacote | Versão | Última publicação | Leitura |
|---|---|---|---|
| `three` | 0.185.1 | jul/2026 | vivo |
| `@react-three/fiber` | 9.7.0 | ago/2026 | vivo |
| `@react-three/drei` | 10.7.8 | ago/2026 | vivo, cadência alta |
| `@react-three/postprocessing` | 3.0.4 | ago/2026 | vivo |
| `@react-three/rapier` | 2.2.0 | ago/2026 | vivo |
| `@react-three/xr` | 6.6.30 | jul/2026 | vivo |
| `troika-three-text` | 0.52.5 | jul/2026 | vivo |
| `pixi.js` | 8.19.0 | jul/2026 | vivo |
| `lenis` | 1.3.26 | ago/2026 | vivo |
| `three-custom-shader-material` | 6.4.0 | out/2025 | maduro |
| `@14islands/r3f-scroll-rig` | 8.15.0 | dez/2024 | **20 meses parado** |
| `@pixi/react` | 8.0.5 | dez/2025 | **8 meses atrás do core** |
| `r3f-perf` | 7.2.3 | nov/2024 | parado, mas é ferramenta de dev |
| `meshline` | 3.3.1 | jun/2024 | parado |
| `maath` | 0.10.8 | jul/2024 | parado |

**A versão do fiber é amarrada à do React**, como `react-dom`: v8 ↔ React 18,
v9 ↔ React 19. Não é recomendação, é requisito.

```bash
npm i three @types/three @react-three/fiber @react-three/drei
```

---

## O que R3F muda de verdade

Não é "three.js mais fácil". É three.js **declarativo**: `<mesh />` vira
`new THREE.Mesh()`, e a cena passa a reagir a estado como qualquer componente.

Duas consequências que importam:

1. **Não há atraso de recurso.** R3F traduz JSX em construtores three.js, então
   qualquer coisa nova do three funciona no mesmo dia, sem esperar a lib atualizar.
2. **Não há custo de performance** — pelo contrário, em escala rende melhor que
   three.js puro por causa do agendamento do React.

O que você ganha sobre os 30 efeitos WebGL que já tem no acervo: **composição**.
Hoje cada efeito é um wrapper fechado. Em R3F, `<Efeito>` é um componente e
combinar dois é aninhar, não reescrever.

---

## A decisão que mais importa para você: scroll

Aqui mora o único conflito sério entre R3F e a sua stack.

**`<ScrollControls>` do drei cria o próprio container de rolagem** — uma `div`
com `overflow` por cima do canvas. O Lenis, por padrão, sequestra a rolagem da
`window`. Os dois querem ser o scroller.

O resultado não é um erro no console; é pior: **a página fica com dois scrolls
de comportamento diferente**, um suavizado e outro nativo, e o usuário sente sem
saber nomear. A documentação do drei não avisa disso.

A comunidade converge para **não usar ScrollControls quando já existe Lenis**
([discussão #3013](https://github.com/pmndrs/react-three-fiber/discussions/3013)).
Dirija a cena a partir do scroll que você já tem:

```tsx
// O padrão que casa com a família animacao-scroll do acervo:
// Lenis + ScrollTrigger continuam donos do scroll; a cena só LÊ.
function Cena() {
  const ref = useRef<THREE.Mesh>(null);
  const progresso = useRef(0);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: "#secao",
      start: "top top",
      end: "+=200%",
      scrub: true,
      onUpdate: (self) => { progresso.current = self.progress; },
    });
    return () => st.kill();
  }, []);

  // ARMADILHA: nunca setState aqui. useFrame roda 60x/s;
  // um setState por quadro derruba a página.
  useFrame(() => {
    if (ref.current) ref.current.rotation.y = progresso.current * Math.PI * 2;
  });

  return <mesh ref={ref}>{/* … */}</mesh>;
}
```

Existe `@14islands/r3f-scroll-rig`, feito exatamente para sincronizar malha 3D com
elemento do DOM — o padrão de site de agência. Mas está **20 meses sem publicar**,
e a versão dele antecede o fiber 9. Antes de adotar, teste contra React 19.

---

## Canvas: os padrões e o que mudar

```tsx
<Canvas
  dpr={[1, 2]}              // padrão. Nunca deixe solto: em tela 3x, triplica o custo
  camera={{ position: [0, 0, 5], fov: 75 }}
  frameloop="demand"        // <- a mudança que mais economiza bateria
  shadows
  gl={{ antialias: true }}
  fallback={<SemWebGL />}   // <- quase sempre esquecido
/>
```

O renderer já vem com antialias, alpha, `high-performance`, saída sRGB e tone
mapping ACESFilmic. `flat` desliga o tone mapping; `linear` desliga a correção de
gama.

**`frameloop="demand"`** só desenha quando algo muda. Para hero 3D estático ou
configurador, é a diferença entre a ventoinha ligar ou não. Mas: se a cena
muda por fora do React (controle de câmera, GSAP mexendo direto no objeto), você
precisa chamar `invalidate()` — senão a tela congela.

**`fallback`** importa mais do que parece em site de cliente: WebGL falha em
máquina corporativa com driver antigo e em modo de economia. Sem fallback, a
seção fica um retângulo preto.

---

## Hooks — e as três armadilhas

| Hook | Para quê |
|---|---|
| `useThree` | acessa `gl`, `scene`, `camera`, `size`, `viewport`, `invalidate` |
| `useFrame` | roda antes de cada quadro: `(state, delta) => {}` |
| `useLoader` | carrega asset com Suspense; cacheia por URL |
| `useGraph` | extrai `nodes`/`materials` nomeados de um modelo |

**1. Hook de R3F só funciona dentro do `<Canvas>`.** Eles dependem do contexto.
Chamar de um componente irmão devolve erro de contexto — e é o erro nº 1 de quem
começa.

**2. Nunca `setState` dentro de `useFrame`.** É a 60 Hz. Use `ref`.

**3. `useFrame` com prioridade positiva assume o loop de render.** A partir daí
*você* precisa chamar `gl.render(scene, camera)` — se não chamar, a tela para.
Prioridade negativa só ordena a execução, sem assumir nada.

`useLoader` cacheia por URL, então o mesmo `.glb` em três componentes carrega uma
vez. O contrário disso: mutar um material carregado afeta todos os usos.

---

## drei — o que realmente se usa em site de marca

São mais de 150 helpers. Os que interessam para o tipo de site do acervo:

**Cenografia (o maior ganho de tempo)**
`Environment` (HDRI de uma linha — resolve iluminação inteira), `Stage`,
`Center`, `Bounds`, `ContactShadows`, `AccumulativeShadows`, `Lightformer`,
`Float`, `Sparkles`.

**Materiais que produzem o visual caro**
`MeshTransmissionMaterial` (vidro de verdade — é o que o acervo tenta emular à
mão em `glass` e `glass-object`), `MeshReflectorMaterial` (chão espelhado),
`MeshDistortMaterial`, `MeshWobbleMaterial`, `shaderMaterial` (helper para shader
próprio com tipos).

**Texto e mídia**
`Text` (via troika, SDF — nítido em qualquer escala), `Text3D`, `Image`,
`Billboard`, `Decal`, `Svg`, `AsciiRenderer` (o acervo tem dois efeitos ASCII
feitos à mão que isso substitui).

**HTML dentro da cena**
`Html` — ancora DOM numa posição 3D. É o caminho para rótulo, hotspot e CTA
sobre modelo, e evita reimplementar tipografia em WebGL.

**Performance**
`Instances`/`Merged` (centenas de milhares de objetos num draw call),
`Detailed` (LOD), `PerformanceMonitor` (degrada qualidade sozinho quando o FPS
cai), `AdaptiveDpr`, `Bvh`, `Preload`, `BakeShadows`.

**Portais**
`View` (várias câmeras/cenas num canvas só — mais barato que vários `<Canvas>`),
`RenderTexture`, `MeshPortalMaterial`, `Hud`, `Mask`.

**Loaders**
`useGLTF`, `useTexture`, `useKTX2`, `useVideoTexture`, `useProgress` (barra de
carregamento real, não simulada).

drei usa `three-stdlib` em vez dos `examples/jsm` do three. Isso evita o clássico
de importar de `three/examples/` e quebrar na atualização.

---

## Componentes da comunidade

Da página oficial, com a saúde verificada:

| Pacote | Serve para | Estado |
|---|---|---|
| `three-custom-shader-material` | injeta shader próprio **mantendo** luz e sombra do material padrão | maduro (out/2025) |
| `troika-three-text` | texto SDF; é o motor por trás do `<Text>` do drei | vivo |
| `@react-three/rapier` | física (o `fisica` que o acervo já marca em algumas peças) | vivo |
| `@react-three/xr` | WebXR | vivo |
| `r3f-perf` | painel de performance em dev | parado, mas serve |
| `meshline` | linha com espessura de verdade | parado (jun/2024) |
| `R3F-Ultimate-Lens-Flare` | lens flare | comunidade |
| `3DTilesRendererJS` (NASA) | dados 3D Tiles / geoespacial | nicho |
| Luma Gaussian Splats | splats | nicho |
| `three-geospatial` | atmosfera e nuvens | nicho |
| **Theatre.js** | listado oficialmente como integração R3F | ver `stack-animacao.md` |

`three-custom-shader-material` é o mais subestimado da lista: escrever shader do
zero significa reimplementar iluminação. Ele deixa você mexer só no vértice ou na
cor e herdar o resto.

Theatre.js aparecer na lista oficial confirma o que ficou registrado em
`stack-animacao.md`: com `@theatre/r3f` ele vira ferramenta de *autoria* de câmera
e cena — mas o `studio` pesa 21,3 MB e é peer dependency, então não vai para
produção.

---

## PixiJS — categoria diferente, não concorrente

R3F é 3D. Pixi é **2D acelerado por GPU**: sprite, filtro, partícula, texto,
máscara. A pergunta certa não é "Pixi ou three", é "a cena é 2D?".

Quando Pixi ganha no seu tipo de trabalho:
- efeito de imagem em massa (grade de fotos com distorção no hover)
- partícula 2D aos milhares (`ParticleContainer` bate qualquer coisa em DOM)
- filtro sobre vídeo ou imagem sem montar cena 3D
- texto animado por GPU em volume

Quando não ganha: qualquer coisa com profundidade, luz ou modelo — aí é three.

**Pixi v8 é async na inicialização.** Diferença de v7 que quebra na cara:

```ts
const app = new Application();
await app.init({ width: 800, height: 600, background: "#1099bb" });
document.body.appendChild(app.canvas);   // v7 era app.view
```

Suporta WebGPU com fallback para WebGL e Canvas.

**`@pixi/react` está 8 meses atrás do core** (8.0.5, dez/2025, contra o core
8.19.0 de jul/2026). Para uma seção isolada dentro de Next.js, prefira o Pixi
puro dentro de um `useEffect` com `destroy` na limpeza — menos superfície para
quebrar. Em React 19 com StrictMode, o efeito roda duas vezes em dev: sem
`app.destroy()` no cleanup você fica com dois canvas.

### As skills oficiais do Pixi

`github.com/pixijs/pixijs-skills` é **um marketplace de plugin do Claude Code**,
com 25 skills roteadas por uma skill-índice. Não faz sentido copiar para dentro do
cannonball: instale ao lado e deixe as duas se completarem.

```bash
claude plugin marketplace add pixijs/pixijs-skills
```

Divisão de trabalho: o **cannonball** sabe o que o seu acervo tem e o que já
tropeçou; as **pixijs-skills** sabem a API do Pixi. Uma não substitui a outra.

Duas ideias delas que valem para o cannonball:

1. **Armadilha graduada.** Elas marcam `[CRITICAL]`, `[HIGH]`, `[MEDIUM]`. Hoje
   `armadilhas.py` grava texto solto — uma que trava a página e outra que
   desalinha 2px pesam igual na busca.
2. **Fallback para `llms.txt`.** Quando a skill não cobre, ela manda buscar
   `https://pixijs.download/release/docs/llms.txt`, que é regerado a cada release.
   É um jeito de não envelhecer.

---

## As lacunas do acervo que isto abre

| O que falta | Por que vale |
|---|---|
| hero R3F com `Environment` + `MeshTransmissionMaterial` | é o visual "caro" que o acervo hoje só imita à mão |
| padrão Lenis + ScrollTrigger dirigindo `useFrame` | encaixa nas peças de `animacao-scroll` do acervo |
| `<Html>` do drei ancorando CTA sobre modelo | resolve tipografia em 3D sem reimplementar |
| grade de imagens com filtro Pixi no hover | 2D puro; three seria peso desnecessário |
| `PerformanceMonitor` como padrão de entrega | site de cliente roda em máquina fraca |

Todas com uma trava: **hero 3D custa bateria e falha em GPU velha**. Toda peça R3F
que entrar no acervo precisa de `nao_usar_quando` honesto e de `fallback` no
`<Canvas>`.

---

## Fontes

- [R3F — introdução](https://r3f.docs.pmnd.rs/getting-started/introduction)
- [R3F — exemplos](https://r3f.docs.pmnd.rs/getting-started/examples)
- [R3F — componentes da comunidade](https://r3f.docs.pmnd.rs/getting-started/community-r3f-components)
- [R3F — Canvas](https://r3f.docs.pmnd.rs/api/canvas) · [hooks](https://r3f.docs.pmnd.rs/api/hooks) · [eventos](https://r3f.docs.pmnd.rs/api/events) · [performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance)
- [drei](https://github.com/pmndrs/drei) · [ScrollControls](https://drei.docs.pmnd.rs/controls/scroll-controls)
- [Discussão sobre Lenis vs ScrollControls](https://github.com/pmndrs/react-three-fiber/discussions/3013)
- [r3f-scroll-rig](https://github.com/14islands/r3f-scroll-rig)
- [PixiJS v8](https://pixijs.com/8.x/guides/getting-started/intro) · [pixijs-skills](https://github.com/pixijs/pixijs-skills)
