---
name: kit-otimizar-3d
description: >
  Otimiza cena three.js, React Three Fiber ou WebGL cru para celular e máquina
  fraca — tiering de dispositivo, prewarm no loader para nada compilar no meio
  do scroll, render loop só quando visível, teto de DPR e de partícula/bloom,
  transformação de scroll na GPU, textura comprimida, e cena fora do bundle
  para robô. Use quando o usuário disser "otimiza o 3D", "a cena trava no
  celular", "está engasgando no scroll", "micro travadas", "deixa leve no
  mobile", "reduz o custo do WebGL", "o hero 3D está pesado", "optimise the
  3D", "jank on scroll", ou antes de entregar qualquer projeto que carregue
  cena WebGL. Use também, sem esperar o pedido, ao montar seção com three.js
  ou R3F para cliente — máquina de cliente não é máquina de dev. Traz também o
  método de depurar shader que renderiza ERRADO, e não devagar, extraindo os
  internos como pixel: use quando disserem "o shader está errado", "a cena
  aparece torta", "esse efeito não bate com a referência", ou em qualquer bug
  visual de shader multi-passe.
allowed-tools: Read Write Edit Glob Grep Bash(python:*) Bash(python3:*)
---

# Otimizar cena 3D

## Antes de qualquer comando: resolva o `SKILL_DIR`

Todo comando abaixo roda um script que viaja junto desta skill, em
`SKILL_DIR/scripts/`. Defina `SKILL_DIR` como o **caminho absoluto da pasta que
contém ESTE SKILL.md que você acabou de ler** — o seu harness informou esse caminho
no resultado da leitura. Funciona em qualquer hospedeiro, sem depender de variável
de ambiente de nenhum agente específico:

```
~/.claude/plugins/cache/cannonball/cannonball/<v>/skills/<nome>/SKILL.md
~/.codex/skills/<nome>/SKILL.md
~/.gemini/skills/<nome>/SKILL.md
~/.agents/skills/<nome>/SKILL.md
```

Em todos, `SKILL_DIR` é a pasta do `SKILL.md`, e `SKILL_DIR/scripts/` está ao lado.

> Adaptada da `optimize-3d-scene` de
> [textura-agency/next16-claude-starter](https://github.com/textura-agency/next16-claude-starter),
> em domínio público. O conteúdo técnico é do autor original; o que mudou aqui
> foi trocar as referências ao workspace privado dele por
> `references/patterns.md` (que já traz o código todo) e ligar o passo final ao
> ciclo de armadilhas do cannonball.

Toda cena three.js paga o mesmo imposto: o celular renderiza os mesmos
fragmentos que uma workstation, o primeiro quadro depois que um shader aparece
compila no meio do scroll, e o render loop segue rodando atrás de três seções de
texto que ninguém está olhando. Esta skill corrige isso numa ordem fixa — do
mais barato e de maior impacto para o resto.

Cada passo vale igual para **WebGL cru** e para three.js; só as primitivas de
medição do §0 mudam (three.js te dá `renderer.info`; numa cena crua você
instrumenta na mão — e precisa fazer isso *antes* de começar).

**O código copiável de tudo que segue está em
[`references/patterns.md`](references/patterns.md)** — tiering, ticker
compartilhado, prewarm, loop com gate de visibilidade, canvas que sobrevive à
barra de URL do iOS, suavização de scroll no toque, contagem por tier, composer,
e transformação de scroll no vertex shader. Porte de lá em vez de inventar forma
nova; os nomes de projeto que aparecem lá (`helion`, `mycelia`, `stride`,
`clarix`) são só atribuição de origem, o código está inteiro no arquivo.

Antes de escolher biblioteca, leia
`${SKILL_DIR}/references/stack-webgl-react.md`: ele traz o estado de
R3F, drei e Pixi no npm, e o conflito entre `<ScrollControls>` e Lenis que morde
exatamente neste terreno.

## 0. Audit before you touch anything

Never optimise blind. Establish the baseline.

**First, prove the scene actually renders.** A WebGL canvas that failed to
initialise looks exactly like one that is merely slow — the page loads, no error
reaches the console, and every number you collect below describes nothing:

```bash
python "${SKILL_DIR}/scripts/capturar.py" --url http://localhost:3000 \
  --saida /tmp/base.png
```

The script refuses a capture with no colour variation, and it also refuses a
capture whose DOM is showing a "WebGL is not supported" card — that one passes the
pixel test comfortably (measured: 5 colours, brightness 68 on a red error page),
which is why the pixels are the assertion of record and the DOM is the veto after
it. A refusal here means there is nothing to optimise yet — fix the scene first.

One measured caveat, because it decides whether you can trust a screenshot at all:
on macOS, headless Chrome captures WebGL correctly (verified against a solid-red
test canvas). On Linux the trap is sharper than "configure a GPU": **even with
software rendering working, headless Chrome captures the canvas black.** That is
an upstream limitation, not a missing flag — the render succeeded and the capture
lies about it. The fix is a *headed* browser on a virtual display (`Xvfb`), not
another adapter flag. Never take a dark capture on Linux as evidence the scene is
broken; check the platform first.

If the capture proves the scene renders but renders *wrong*, you have a
correctness bug, not a performance one — stop here and go to §15.

Then the numbers:

```sh
# what's actually in the scene
grep -rn "setPixelRatio\|requestAnimationFrame\|new THREE\..*Light\|UnrealBloom\|Points\|InstancedMesh" src/ --include=*.ts --include=*.tsx --include=*.js
```

Then in the running page's console:

```js
renderer.info.render      // { calls, triangles, points } — per frame
renderer.info.programs.length   // shader programs; each one is a compile stall if it appears late
renderer.info.memory      // { geometries, textures }
```

**Raw WebGL (no three.js).** `renderer.info` only exists on
`THREE.WebGLRenderer`. A hand-written scene has no equivalent — hook the context
before app code runs and count it yourself, or you cannot start:

```js
// page.evaluateOnNewDocument — counts passes, vertices, and *when* programs link
const gc = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = function (kind, attrs) {
  const ctx = gc.call(this, kind, attrs);
  if (ctx && kind === "webgl") {
    window.__gl = ctx;
    window.__p = { draws: 0, verts: 0, frames: 0, links: [], attrs };
    const draw = ctx.drawArrays.bind(ctx);
    ctx.drawArrays = (m, f, c) => { window.__p.draws++; window.__p.verts += c; return draw(m, f, c); };
    const clear = ctx.clear.bind(ctx);          // one clear = one frame
    ctx.clear = (m) => { window.__p.frames++; return clear(m); };
    const link = ctx.linkProgram.bind(ctx);     // §3/§14: these must all precede the loader handoff
    ctx.linkProgram = (p) => { window.__p.links.push(Math.round(performance.now())); return link(p); };
  }
  return ctx;
};
```

`draws`/`verts` replace `info.render`, `links.length` replaces
`programs.length` (and `links` timestamps are what §3 is actually measured
against), `gl.drawingBufferWidth/Height` is the §6 check, and the captured
`attrs` is the §7 renderer-flags check. Full harness in `references/patterns.md`.

### The measurement environment (get this wrong and every number below is a lie)

- **Measure a production build, never the dev server.** Dev invalidates §1 (the
  bundler serves chunks eagerly, so the bot path looks broken when it isn't) and
  §4/§5 (React Strict Mode double-mounts, doubling listener counts and halving
  the apparent frame rate). `yarn build && yarn start` — and **kill the old
  server before rebuilding**, or it holds the port and serves a stale manifest,
  and you spend an hour debugging 404s and 500s that aren't yours.
- **Use `waitUntil: "load"` plus a fixed settle.** `networkidle0` never fires
  against `next start`.
- **SwiftShader is not a GPU.** Absolute fps out of headless Chrome is
  meaningless (a desktop measured 14 fps). Only *counted* quantities transfer:
  draw calls, vertices, drawing-buffer pixels, listener counts, program-link
  timestamps, main-thread block duration.
- **A stopwatch around a draw call measures nothing.** `performance.now()` before
  and after `drawArrays` / `renderer.render()` times the *submission* — the driver
  records commands, it does not run them. The GPU is still working when your timer
  stops, so an expensive pass reads as ~0 ms and you optimise the wrong thing. This
  is why everything above is a *counted* quantity. To get real GPU milliseconds you
  need the GPU's own clock: `EXT_disjoint_timer_query_webgl2` (`gl.getExtension`,
  then a query around the pass; the result lands one or two frames later and you
  must discard it when `GPU_DISJOINT_EXT` is set). It is unavailable in a lot of
  browsers, including Safari — when it is missing, say "not measurable here" and
  fall back to counts, never to a stopwatch. And time a whole **pass**, not one
  draw: to isolate a suspect, move it into its own pass.
- To observe a §5 frame **cap** at all, the GPU has to stop being the limiter:
  shrink the viewport to ~320×240 and re-measure. If rAF fires 120×/s and the
  scene draws 26×/s, the cap is working.

Write the before/after numbers down. A change you cannot measure is a change you
cannot defend, and every item below costs something in look.

## 1. Never ship the scene to a robot

A crawler or Lighthouse run gets **no scene at all** — not a hidden canvas, not
a lazily-idle module. The three.js bundle must never be fetched, parsed or
evaluated, because script evaluation time is what the audit is measuring.

- Server-side, read the UA (`isBot()` in `helion/src/utils/is-bot.ts`) and render
  a static poster instead of the scene component.
- The scene component itself is a `dynamic(() => import(...), { ssr: false })`
  client leaf, so `three` lands in its own chunk and only that chunk is skipped.
- Plain-HTML projects: `import()` the scene module behind the same UA check.

This applies to desktop and mobile equally.

**What the poster is actually for.** Not layout stability — an
`absolute inset-0` background canvas shifts nothing either way, so don't justify
it that way. It exists for (a) crawler and social-preview screenshots, which
otherwise capture an empty box, and (b) the no-WebGL / context-lost fallback.
Two details:

- If the camera fits to the tighter axis (per-tier framing), one landscape
  poster re-crops the subject on portrait — the head goes off-frame. Export
  **two crops** and pick with a `<picture>` media query.
- `isBot()` reads `headers()`, which opts the whole route out of static
  prerendering (`○` → `ƒ` in the build output). That is a real trade-off, not a
  free win: state it. If the route must stay static, do the branch in
  middleware (rewrite bots to a `/poster` route) instead.

## 2. Tier the device once, at construction

One module decides what "mobile" means. Everything — DPR, particle counts,
bloom, frame budget, whether the pointer is even listened to — reads from it, so
the values can never drift apart. Read once at construction: a device does not
change tier mid-session, and rebuilding buffers on resize costs more than the
mismatch is worth.

`mobile` = `innerWidth < 768 || matchMedia("(hover: none) and (pointer: coarse)")`.
The coarse-pointer clause is what catches tablets and large phones.

Also expose, from the same module:
- `prefersReducedMotion()` — an accessibility promise, honoured on every tier.
- `isEnergySaver()` — `navigator.connection.saveData` or `deviceMemory <= 2`;
  the nearest web-exposed proxy for iOS Low Power Mode, which has no API.
- `sceneShouldFreeze()` — reduced motion on any device, or a mobile flagged
  energy-constrained. Play the entrance, then stop drawing on a settled frame.
  WebGL keeps the last frame on the canvas, so a frozen scene costs zero.

## 3. Precompute and prewarm *everything* during the loader

This is the rule that kills micro-freezes. After the loader hands off, the frame
loop must allocate nothing, compile nothing and upload nothing. A stall on
scroll — or a frozen loader — is always one of five things. The first four are
GPU-shaped, which is why the fifth is the one that gets missed:

1. **Shader compile / link.** `renderer.compile(scene, camera)` (or
   `await renderer.compileAsync(scene, camera)`, which does not block the main
   thread) while the loader is still on screen. Every material must be in the
   scene graph at that moment, including ones that are `visible = false`.
2. **Program variants.** Three compiles a *new* program when a define changes —
   `USE_INSTANCING`, `transparent`, a different light count, `fog`. Never flip a
   define, a light count, `material.transparent` or `blending` at runtime. Set
   the final variant at construction and drive change through uniforms only.
3. **Texture upload.** The first `render` that samples a texture uploads it,
   which for a 2K PNG is a visible hitch. `renderer.initTexture(tex)` for every
   texture during the loader.
4. **Render-target and post-pass warmup.** Each `EffectComposer` /
   `WebGLRenderTarget` allocates and compiles on its first use. Render one
   throwaway frame through the *complete* chain before handoff.
5. **CPU decode / parse.** Geometry decode, normal estimation, PCA fits, buffer
   building — pure work, no GPU involved, and the one most often missed because
   the other four are all shader-shaped. On a throttled phone it blocks for
   *seconds* (a measured 3.9 s for 50k plane fits), and it lands while the
   loader is animating, so the counter freezes and the page ignores input.
   Chunking across frames keeps the loader alive; a **Worker** removes it from
   the main thread entirely and is the better answer whenever the work is pure.
   Transfer the buffers (`postMessage(msg, [buf])`) in *both* directions so
   nothing is copied, and keep an inline fallback for environments without
   Workers.

On top of that, precompute CPU-side:

- All `BufferGeometry` attributes, all particle buffers, all noise/glyph
  textures — built during the loader, never on a scroll boundary.
- If a build loop is long enough to block (say > 8 ms), chunk it across frames
  and feed the loader percentage from it. The loader is *for* this.
- Drive the whole timeline from a single scroll-progress uniform whose value
  range is fully covered during warmup, so no branch in the shader is reached
  for the first time mid-scroll.

Then: **render one frame at each keyframe of the scroll timeline during warmup**
(progress 0, 0.25, 0.5, 0.75, 1) into a 1×1 scratch target. Any lazily-created
program, any conditional branch, any texture bound only in the finale gets
touched while the loader still owns the screen.

O `references/patterns.md` §3 traz esse passo 1 pronto (feito depois do GLB
resolver) — copie a forma de lá e estenda aos cinco.

**§1 and §3 pull against each other — check the gap, every time.**
Code-splitting the scene (§1) means it cannot mount, and therefore cannot
compile or allocate, until after hydration. On a slow connection that lands
*after* the loader has handed off, which is exactly the stall §3 exists to
prevent — measured on Regular 3G + 4× CPU, programs linked at 5.0 s against a
curtain that lifted at 2.36 s. Neither section warns you on its own. Measure it
(§0's `linkProgram` timestamps vs the handoff time) and close it deliberately:
`<link rel="preload">` the scene's data from the HTML so it is in flight during
parse, and if the gap survives that, gate the loader on **scene-ready** rather
than on a fixed duration. A time-based preloader is a promise about the network
you cannot keep.

> [!warning] The `as="fetch"` preload credentials trap
> An `as="fetch"` preload is only reused when its credentials mode matches the
> `fetch()` **exactly**. `crossorigin="anonymous"` + `credentials: "omit"` does
> *not* match, and neither does no-attribute + default — both silently download
> the asset a second time, with nothing but a console warning ("…not used
> because the request credentials mode does not match"), and the page looks
> fine either way. The pair that dedupes is `crossorigin="use-credentials"` +
> `credentials: "include"`. Verify by counting **network** requests
> (`page.on("request")`), not `fetch` calls.

## 4. Render only when visible — the loop is on-demand

The single largest saving in a scroll site. Three WebGL scenes each running
their own forever-rAF was the documented cause of scroll jank in `stride`.

Gate on all three:

- `document.hidden` — a background tab paints nothing.
- The section is on (or near) screen — `IntersectionObserver` with a
  `rootMargin` of about one viewport so it is already warm when it arrives, or
  a scroll-range test like `isSceneVisible()`.
- The canvas is actually visible (not faded to 0 by a wrapper).

Prewarm (§3) is the deliberate exception: it runs once, before any of this.

Subscribe to **one app-wide rAF ticker** rather than starting a loop per scene
(`helion/src/lib/animation/ticker.ts`). It reference-counts, so an idle page
costs nothing, and each subscriber is throttled independently.

## 5. Budget the frame rate per tier

`mobile: 1000/30`, `tablet: 1000/45`, `desktop: 0` (every tick). These scenes
are fill-bound, not motion-bound — the noise fields evolve slowly enough that
halving the frame rate on a phone is genuinely hard to see, and it is the single
biggest win available there. Throttle per subscriber so capping the scene does
not slow the springs and DOM animation sharing the loop.

**`1000/30` does not produce 30 fps.** The canonical ticker skips while
`time - last <= framerate`, so with rAF free-running at ~120 Hz the first tick
that clears 33.3 ms lands at ~41.7 ms — 26 fps measured, not 30. It errs cheap,
so it is harmless and the budget still works; just don't quote 30 as measured
truth. If you want the stated number to match reality, fix it in one place:
budget `1000/30 - ε`, or change the ticker's comparison to `<`. (And see §0 —
you can only observe the cap once the GPU isn't the limiter.)

## 6. Pixel ratio: clamp hard, and clamp the composer too

```
mobile   → min(dpr, 0.85)     // 0.75–1.0; below 1.0 is fine for soft sprites
tablet   → min(max(dpr, 0.75), 1.25)
desktop  → min(max(dpr, 0.75), 1.5)
```

A 3× phone renders **9×** the fragments of a 1× screen, for no perceptible gain
on a point cloud or a soft-edged shader. Go to 1.0 (not below) when the scene
has hard-edged geometry — warp streaks, thin lines, crisp text in the shader —
because those alias visibly.

**`EffectComposer` owns its own render targets.** If you clamp the renderer and
leave the composer at raw `devicePixelRatio`, you throw the entire saving away
on the post pass. Set both from the same function.

## 7. Cut fill, not detail — the phone dies on fill rate

In order of what actually costs:

- **Particle counts, per tier.** Roughly a third of desktop on mobile
  (`vortex.ts`: 460×420 desktop → 170×190 mobile). Cut the *sparse* end of the
  distribution first — the rim of a disc, the outer shell of a cloud — where it
  shows least. Never cut uniformly.

  **On a pre-baked point buffer that advice has no lever** — your only knob is
  truncating `drawArrays`, and whether that is safe depends on the buffer's
  point ordering, which is documented nowhere. **Check it before you cut:**
  bucket the positions into deciles and compare mean coordinates. If they drift
  monotonically, the points are spatially ordered and drawing the first N
  deletes a *region*, not a sample (one measured file was sorted left→right —
  truncating would have removed half the head). In that case the only real
  reduction is re-sampling the asset offline into a `points-lite.bin`, not a
  smaller `drawArrays`. Say that rather than shipping a hole. Script in
  `references/patterns.md`.
- **Bloom.** Halve strength and radius on mobile, and **skip the pass entirely
  when it contributes nothing**: `bloomPass.enabled = bloomPass.strength > 0.001`
  saves a full-screen chain per frame. Scale bloom by viewport height too — a
  look tuned on a 1440p screen blows out on a short window.
- **Additive/transparent overdraw.** Every additive halo is pure fill. Prefer
  fewer, larger sprites over many small ones; cap `gl_PointSize`; keep
  `depthWrite: false` on transparents so you at least skip the depth write.
- **Post-processing chains that render nothing.** Audit them — `mycelia` and
  `helion` both shipped three chained composers where two rendered empty layers
  and the final pass sampled stale targets. That was both a flicker *and* two
  wasted full-screen passes per frame. O composer que pula um passe sem contribuição está em
  `references/patterns.md` §9.
- **Renderer flags.** `antialias: false` on mobile (the DPR clamp and soft edges
  hide it; MSAA on a phone is expensive), `alpha: false` when the canvas is
  opaque, `stencil: false`, `depth: false` when nothing depth-tests,
  `powerPreference: "high-performance"` on desktop only.
- **Shadow maps off on mobile.** `VSMShadowMap` (what `helios` uses) is the most
  expensive type there is. If the scene needs grounding, bake it into a texture.

## 8. Lights: as few as the look survives

Every real-time light multiplies the fragment cost of every lit material, and
changing the light *count* recompiles every program. Target:

- **One** directional key + an environment map (IBL). A PMREM'd
  `RoomEnvironment` (código em `references/patterns.md` §11) replaces three or
  four fills and looks better than any of them.
- Bake rim/fill into the material — a fresnel term in `onBeforeCompile` costs a
  few ALU ops and reads as a light. `clarix` already does this; it just also
  ships three real lights on top of it.
- No point/spot lights on mobile unless the scene is literally about them.
- Never add or remove a light at runtime.

## 9. Do transforms on the GPU, not the CPU — especially scroll

Any per-object transform that scroll drives should be a **uniform feeding the
vertex shader**, not a JS loop mutating `position`/`rotation` per frame.

- Positions computed in the vertex shader from `aOffset`/`aRandom` attributes +
  a `uProgress` uniform. Scroll then costs one uniform write per frame, and the
  work scales on the GPU instead of the main thread. `clarix`'s logo particles
  already do this correctly (`aRandomPosition`, `aDelay`, `uProgress`) — that is
  the shape to copy.
- Set `frustumCulled = false` on anything whose positions the shader computes,
  or Three culls against a stale bounding sphere.
- Where a whole group moves, move the `Group` (one matrix), never the children.
- Instancing / merged geometry for anything repeated: one draw call, per-instance
  data in attributes.
- CPU-side per-frame `Vector3`/`Matrix4` allocation is a GC stall. Reuse
  module-scope scratch objects (`clarix` does this with `_revealVec` — do it
  everywhere).
- Read `window.scrollY` **once per frame inside the ticker**. Never in a scroll
  handler that also writes styles — that is a forced layout every event.

## 10. Smooth the scroll progress on touch

On mobile the OS owns momentum scrolling, so `window.scrollY` arrives in
discrete steps and every derived value jitters — worst on a fixed, scroll-driven
scene, and compounded when the scene runs at 30 fps.

Low-pass the scroll position once, upstream, so every downstream value inherits
the easing:

```js
smoothed += (raw - smoothed) * k;
```

- **Retention 0.75 ⇒ `k = 0.25`.** That is the same thing said two ways, and it
  matches `helion`'s tuned `SMOOTH_LERP = 0.22` — keep mobile in the 0.2–0.3
  band. Lower than that reads as disconnected from the thumb once the 30 fps cap
  is stacked on top.
- Desktop still wants a gentle `k ≈ 0.3` — Lenis eases the wheel, but the scene
  samples `scrollY` raw and steppy wheel input shows up as camera jitter.
- **Snap, don't crawl**, on a page jump: if `|raw - smoothed| > 1.5vh`, assign
  directly. Otherwise an anchor link takes two seconds to arrive.
- Make it frame-rate independent when the tier caps fps:
  `k = 1 - Math.pow(1 - kBase, dt * 60)`.

## 11. Kill cursor interactivity on mobile

Unless the user explicitly asks for it. On a touch device pointer effects are
either dead weight or actively wrong:

- Don't attach the `mousemove` listener at all on the mobile tier — not
  "attach and ignore".
- Gate every pointer-driven effect on `hasPointer()` (has the pointer *ever*
  moved). Ungated, an unmoved cursor resolves to NDC (0,0) — dead centre — so a
  repulsion field punches a hole through the middle of the scene on every touch
  device and every untouched page. O gate e o ease-in estão em `references/patterns.md` §7.
- Drop the uniform and the branch from the mobile shader variant where it is
  more than a couple of ops — but set it at construction (§3.2), never toggle.
- If the user does want it on touch: drive it from `touchmove`, and keep the
  same lerp so it doesn't snap.

## 12. Compress the assets

- **Geometry**: Draco. `clarix` and `stride` already do; keep the decoder local
  (`/draco/`), not on `gstatic` — `clarix` fetches it from a CDN, which is a
  round-trip on the critical path.
- **Textures**: KTX2 / Basis (`KTX2Loader`), not PNG/JPEG. This is the one that
  matters for GPU pressure: a compressed texture stays compressed *in VRAM*, so
  it costs a fraction of the memory and bandwidth of an equivalent PNG, which is
  decoded to raw RGBA on upload. On a phone that is the difference between a
  smooth pan and a texture-thrash stutter.

  ```sh
  npx @gltf-transform/cli optimize in.glb out.glb --texture-compress ktx2
  ```
- Cap texture size per tier (2048 desktop / 1024 mobile), `anisotropy = 1` on
  mobile, `generateMipmaps` on for anything minified, `LinearFilter` for
  procedurally-drawn canvas textures.
- Resize the model itself: decimate before you optimise the renderer.

## 13. The details that cause "flicker on iOS"

- **No `resize` listener on touch.** iOS Safari fires `resize` every time the URL
  bar collapses during scroll; handling it rebuilds the WebGL framebuffer
  mid-scroll and reads as a whole-scene flash. Size the canvas once on load and
  accept that rotation won't reflow it. Desktop keeps an rAF-coalesced resize.
  (`mycelia/src/lib/scene/canvas3d.ts`.)
- Size the **canvas** against the largest viewport — `h-lvh w-lvw`, not `100vh`
  — so a collapsing URL bar never re-allocates the framebuffer. **`lvh` is for
  the canvas, not the layout.** Applying it to the content is a different bug
  (the bottom of the layout hides behind the URL bar), and it is the naive
  reading of this line: canvas `lvh`, content `dvh`. The extra canvas bleed is
  clipped and invisible.
- Promote the canvas wrapper to its own compositor layer —
  `transform-gpu backface-hidden will-change-transform`. Without it a
  neighbouring fixed element repainting during scroll invalidates the WebGL
  composite on WebKit and the whole scene flickers.
- All scroll/pointer listeners `{ passive: true }`.
- Clamp `dt`: `Math.min(0.05, t - last)`. A tab-switch return otherwise hands the
  scene a two-second delta and everything teleports.
- Dispose on unmount: geometries, materials, textures, render targets,
  `renderer.dispose()`, and remove every listener.

## 14. Verify, then write it down

Re-measure the §0 numbers and report the delta honestly:

- `renderer.info.render.calls` and `.programs.length` before vs after (raw
  WebGL: `window.__p.draws` and `window.__p.links.length`); the program count
  must be **stable after the loader** — if it grows during scroll, §3 is
  incomplete and the micro-freezes are still there. On a raw scene the
  `links` *timestamps* say more than the count: every one must precede the
  loader handoff, or §1 has pushed compilation past it (see §3).
- Re-measure on the same footing as the baseline — production build, fresh
  server, counted quantities only (§0). A dev-mode "after" number proves
  nothing.
- Frame timings on a throttled CPU (DevTools 4×/6× slowdown) across a full
  scroll, looking for long tasks.
- Lighthouse mobile before/after — with §1 in place the bot path should show no
  three.js in the JS bundle at all.
- Look at it on a real phone. Fill-rate wins are invisible in a profiler and
  obvious in the hand.

Then, **no mesmo turno**, grave o que você descobriu no acervo. Este é o passo
que faz o cannonball aprender — sem ele o próximo projeto tropeça igual:

```bash
python "${SKILL_DIR}/scripts/armadilhas.py" --add <id-da-peça> \
  --texto "o que travava, o número antes/depois, e o que resolveu" \
  --origem <slug-do-projeto> --grau <critica|alta|media>
python "${SKILL_DIR}/scripts/indexar.py"
```

Como escolher o grau aqui:

- `critica` — a página trava, fica em branco, ou o WebGL derruba a aba. Também
  entra o caso silencioso: o programa continua compilando durante o scroll e as
  micro-travadas seguem ali sem ninguém perceber na máquina de dev.
- `alta` — roda, mas a entrega fica ruim: 26 fps num celular médio, ventoinha
  ligada, bateria drenando, Lighthouse reprovando por causa do bundle.
- `media` — ajuste fino: um passe de bloom que não contribui, uma textura maior
  do que precisa.

Escreva com o número, não com adjetivo. *"3 composers encadeados, 2 renderizavam
camada vazia — 2 passes full-screen por quadro desperdiçados"* serve; *"tinha
problema de performance"* não serve para nada.

Se a peça otimizada veio do acervo, a armadilha fica nela. Se você construiu do
zero, ingira primeiro (`kit-ingerir`) e grave depois.

## 15. When the scene is wrong, not slow — make the pixels carry the numbers

Everything above makes a correct scene cheaper. This section is for the other
failure: it renders, it is fast, and it is **wrong**. Use it by default for any
multi-pass or mathematically non-trivial shader, and immediately whenever someone
reports a visual bug.

> Method adapted from `shader-debugging` in
> [vercel-labs/vgpu](https://github.com/vercel-labs/vgpu) (MIT). vgpu itself is
> WebGPU/WGSL and is **not** a dependency here — what transfers is the
> methodology, rewritten for WebGL2/GLSL.

**Do not iterate by eye.** That is the whole point. In the run this came from, two
rounds of by-eye fixes changed the image without fixing it, and one extraction pass
found both root bugs. A shader has no `console.log`; its only output is pixels, so
make the pixels carry the numbers.

### 1. Split the maths into pure functions

A debug shader must exercise the GLSL that actually ships, or it proves nothing
about your bug. Keep reused maths in a chunk you can `#include` (or concatenate)
into both the real shader and the harness; one-use maths can stay beside the entry
point. Anything the harness needs must be free of bindings — no `uniform` reads,
no texture samples — so it can be called with literal arguments.

### 2. Render the internals into an 8×1 target and read them back

One pixel per slot, one channel per value. Everything must land in `[0,1]` and
survive 8-bit quantization:

| Value | Encode | Decode |
|---|---|---|
| weight, fresnel, alpha | as-is | `byte / 255` |
| LOD level | `lod / (levels - 1)` | `byte / 255 * (levels - 1)` |
| direction / normal | `dir * 0.5 + 0.5` | `(byte / 255 - 0.5) * 2` |
| unbounded ray | `dir * 0.1 + 0.5` | `(byte / 255 - 0.5) * 10` |
| distance, thickness | `d * scale`, fixed scale | `byte / 255 / scale` |

```js
// 8 slots, 4 channels each: 32 numbers out of one draw
const fbo = gl.createFramebuffer();
const tex = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, tex);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 8, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
gl.viewport(0, 0, 8, 1);
gl.drawArrays(gl.TRIANGLES, 0, 3);         // fullscreen triangle, debug fragment shader
const px = new Uint8Array(8 * 4);
gl.readPixels(0, 0, 8, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
```

```glsl
// the debug fragment shader: slot index from gl_FragCoord, one meaning per slot
int slot = int(gl_FragCoord.x);
if (slot == 0) fragColor = vec4(fresnel(1.5, 0.2), fresnel(1.5, 0.5), fresnel(1.5, 1.0), 1.0);
else           fragColor = vec4(lodFor(0.0) / 7.0, lodFor(0.5) / 7.0, lodFor(1.0) / 7.0, 1.0);
```

Give each slot exactly one meaning and comment it. A debug shader nobody can
decode is worthless the next day.

### 3. Diff against a CPU reference, with a stated tolerance

Reimplement the same maths in JS and compare value by value. The floor is
**`2 / 255` ≈ 0.0078** — the quantization step of an 8-bit target. Write the
comparison to JSON (reference, gpu, maxError, tolerance, pass) so the run leaves
evidence, and exit non-zero when it fails.

`2 / 255` is the floor only for a value **stored** in 8 bits. For a derived or
iterative quantity — a sphere tracer's hit point after N steps, an accumulated
integral — the budget comes from the algorithm's own epsilon, not from the texture
format. Say which one you used.

Need more precision than 8 bits? `EXT_color_buffer_float` lets you read an
`RGBA32F` attachment directly; without it, add an encode pass into an `RGBA8`
target and read that.

### 4. Dump every intermediate target, not just the final image

In a multi-pass chain the numbers can all be right and the image still wrong,
because a pass reads the wrong attachment. Write **each** intermediate to a PNG
and look at them one by one: every level of the blur pyramid (`pyramid-0.png` …
`pyramid-7.png`), every G-buffer attachment, then the composite. In the original
investigation the dumps showed the top blur levels were never selected and that
exit normals followed the camera ray instead of the refracted one — neither was
visible in the final image, both were unmistakable in the intermediates.

This is also the answer when §7's composer audit turns up a chain you don't
understand: dump the targets and you can see which passes render nothing.

### 5. Keep the run deterministic, or it is not evidence

Two runs of the same harness must produce identical bytes. If they don't, fix
*that* before debugging anything else.

- **No clock.** Pass time in as a fixed constant — never `Date.now()`,
  `performance.now()` or the ticker's elapsed time.
- **A fixed number of warmup frames** before the one you read. Always the same
  number, including on the "after" run.
- **Jitter by pixel hash, never by frame index.** A stable per-pixel rotation
  breaks up banding without changing between runs:
  ```glsl
  float rot(vec2 p) { return fract(sin(dot(floor(p), vec2(12.9898, 78.233))) * 43758.5453) * 6.2831853; }
  ```
- Fixed, small target sizes.

The same rule governs `capturar.py`: its `--virtual-time-budget` advances a
*virtual* clock, so two captures of the same page land on the same frame of the
animation and are comparable. A page that reads `Date.now()` or an unseeded
`Math.random()` escapes that, and its preview can never be a regression baseline.

### Then write it down

Uma raiz encontrada por extração é armadilha de grau `critica` ou `alta` quase
sempre — ela sobreviveu a uma rodada de conserto no olho. Grave com o número que
o diff produziu, não com adjetivo:

```bash
python "${SKILL_DIR}/scripts/armadilhas.py" --add <id-da-peça> \
  --texto "o valor extraído, o esperado, e onde a conta divergia" \
  --origem <slug-do-projeto> --grau <critica|alta>
```

## What not to do

- Don't drop the scene on mobile wholesale. The scene is the product; tier it.
- Don't tune by feel on a desktop. Every number here was measured on a phone.
- Don't write a new `device.ts` from scratch. Port the one in
  [`references/patterns.md` §1](references/patterns.md) — one module decides what
  "mobile" means, and every budget reads from it so the values cannot drift.
- Don't ship `lil-gui` (`clarix` ships it hidden — it is still parsed and
  evaluated). Tree-shake it behind a dev flag.
- Don't leave `console.log`, `Stats`, or an `OrbitControls` you disabled in the
  production path.
- Don't fix a shader by eye. Changing a constant until the image looks better
  moves the bug; it does not find it (§15).
