<p align="center">
  <img src="extension/icons/128.png" width="88" alt="3D Grabber">
</p>

<h1 align="center">3D Grabber</h1>

<p align="center">
  Detecta e captura assets 3D de qualquer site — arquivos baixados pela rede,
  cenas <strong>three.js vivas</strong> exportadas para GLB, e turntable para o que não dá pra extrair.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Chrome-MV3-7c3aed" alt="MV3">
  <img src="https://img.shields.io/badge/deps-0-7c3aed" alt="zero dependências">
  <img src="https://img.shields.io/badge/glTF-0%20erros-7c3aed" alt="validado">
  <img src="https://img.shields.io/badge/license-MIT-7c3aed" alt="MIT">
</p>

---

## O problema

Nem todo 3D na web é um arquivo. Quem tenta capturar 3D só farejando a rede perde a maior parte
do que existe hoje — muita cena é montada em JavaScript e nunca existiu como arquivo em lugar nenhum.

São três casos, e cada um precisa de uma abordagem diferente:

| Tier | O que é | Estratégia | Resultado |
|:---:|---|---|---|
| **1** | `.glb`, `.gltf`, `.fbx`, `.usdz`, splats… baixados por HTTP | intercepta a rede | o arquivo original, exato |
| **2** | three.js montando geometria em JS, sem arquivo nenhum | lê a cena viva da memória e escreve o GLB | exato |
| **3** | Unity/wasm, Spline, WebGL cru, textura comprimida | turntable em ângulos exatos | imagens → reconstrução |

## O que ele faz

- **Fareja a rede** — `.glb` `.gltf` `.fbx` `.obj` `.dae` `.stl` `.ply` `.usdz` `.drc` `.ktx2` `.vrm` `.hdr` e mais.
- **Entende Gaussian Splats** — `.ply` `.splat` `.ksplat` `.spz` `.sog`. SOG não é arquivo, é um
  `meta.json` apontando pra vários `.webp`; o bundle inteiro é resolvido e baixado numa pasta,
  pronto pro [SuperSplat](https://superspl.at/editor).
- **Exporta a cena three.js viva pra GLB** — sem arquivo de origem, direto da memória da página.
- **Turntable 0/90/180/270** — sequestra a câmera do site e renderiza o objeto real em ângulos
  exatos, nomeados pra alimentar [img2threejs](https://github.com/img2threejs/img2threejs) sem renomear nada.

## Instalação

```bash
git clone https://github.com/harebeats/3d-grabber
```

`chrome://extensions` → ative **Modo desenvolvedor** → **Carregar sem compactação** → pasta `extension/`.

Abra um site com 3D, clique no ícone. O badge conta os arquivos detectados.

> A captura de cena viva precisa estar ativa **antes** da página carregar. Se você acabou de instalar
> a extensão, recarregue a aba.

## Como funciona

**Tier 2 — achar a cena.** O three.js emite um evento `observe` em `window.__THREE_DEVTOOLS__` se
esse objeto existir. A extensão cria o `EventTarget` em `document_start`, no mundo `MAIN`, antes de
qualquer script da página rodar. Cenas criadas antes disso são pegas por um wrap em
`renderer.render()` — que de quebra guarda a câmera que o site está usando.

**Tier 2 — escrever o GLB.** Nada do `GLTFExporter` oficial: 1.3 MB, ESM brigando com CSP e preso a
uma versão do three. O `inject.js` lê a cena por propriedades planas (`isMesh`,
`geometry.attributes`, `matrixWorld.elements`) e escreve o container GLB do zero, em ~200 linhas.
Funciona de r99 até a versão atual, e um *walker* novo estende pra outra engine sem tocar no
exportador. Atributos **interleaved** e **normalizados** (`Uint16`, `Int8`…) são tratados — é onde
exportador ingênuo quebra.

**Tier 3 — turntable.** `preserveDrawingBuffer` é `false` por padrão, então `toDataURL()` depois de
um `await` volta preto. A captura é síncrona logo após o `render()`. O enquadramento sai do bounding
box em world space e do `fov` da câmera real. A câmera do site é restaurada no fim.

## Limites conhecidos

Tudo do Tier 2:

- **Só three.js.** Babylon, PlayCanvas, Spline e WebGL cru caem no Tier 3.
- **Malha estática** — sem animação, skinning ou morph targets.
- `InstancedMesh` sai como geometria base, uma vez só.
- Textura Draco/KTX2 é pulada (comprimida, o canvas não lê). **A geometria vem inteira.**
- Canvas contaminado por CORS perde a textura, não a malha.

No Tier 1, um modelo servido via `blob:` ou sem extensão nem `content-type: model/*` passa batido.

## Testes

```bash
node test-glb.js
```

O GLB gerado passa no [validador oficial da Khronos](https://github.com/KhronosGroup/glTF-Validator)
com **0 erros, 0 warnings, 0 hints**. O check ainda cobre de-interleaving, normalização de
atributos, alinhamento de `bufferView` em 4 bytes, e cruza o bounding box do turntable com uma
implementação independente.

## Depois da captura

| Você tem | Leve pra |
|---|---|
| `.glb` / `.gltf` | Blender, three.js, [gltf.report](https://gltf.report) |
| bundle splat | [SuperSplat](https://superspl.at/editor) |
| PNGs do turntable | [img2threejs](https://github.com/img2threejs/img2threejs) → Three.js procedural |

## Licença

MIT — veja [LICENSE](LICENSE).

Capture apenas o que você tem direito de usar. Extrair um asset não te dá licença sobre ele.
