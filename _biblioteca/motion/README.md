# _biblioteca/motion — o arsenal visual da Hórus

Bibliotecas de animação e interação **vendorizadas** (auto-hospedadas no repo),
mais snippets prontos pra colar e adaptar. Tudo **vanilla**: funciona em qualquer
`index.html` sem npm, sem build, sem React.

> A régua de **quando e quanto** usar está em `_memoria/design/60-motion.md`.
> Leitura obrigatória antes de animar qualquer coisa. Aqui é o **como**; lá é o
> **se e por quê**.

---

## O que tem aqui

```
vendor/
  gsap/
    gsap.min.js            → motor de animação (core)
    ScrollTrigger.min.js   → animar conforme o scroll (reveal, pin, parallax, scrub)
    SplitText.min.js       → revelar texto por letra/palavra
    DrawSVGPlugin.min.js   → traço que se desenha (seta, contorno, assinatura)
  lenis.min.js             → scroll suave
snippets/                  → padrões documentados, copiar e adaptar
assets/                    → Lottie/Rive prontos (objetos que se movem)
```

**Versões fixas:** GSAP 3.13.0, Lenis 1.1.14. GSAP virou 100% grátis (todos os
plugins) desde abril/2025 — pode usar comercialmente sem licença.

**Não vendorizados** (WebGL de fundo, pesados demais pra versionar): Vanta.js e
Unicorn Studio entram por embed quando a peça pedir — ver `snippets/background-webgl.md`.

---

## Como incluir num site

No `<head>` (ou antes do `</body>`), com caminho relativo pro repo. Se o site está
em `clientes/<nome>/site/index.html`, a biblioteca fica quatro níveis acima:

```html
<script src="../../../_biblioteca/motion/vendor/gsap/gsap.min.js"></script>
<script src="../../../_biblioteca/motion/vendor/gsap/ScrollTrigger.min.js"></script>
<script src="../../../_biblioteca/motion/vendor/lenis.min.js"></script>
```

> **Na hora de publicar** (Netlify/Vercel): esses arquivos vivem fora da pasta do
> site, então antes do deploy é preciso **copiar `vendor/` pra dentro do site** OU
> trocar pelo CDN. O caminho relativo acima serve pra desenvolver e testar local.
> A skill de publicação resolve isso; ver `_memoria/design/60-motion.md`.

**Fallback CDN** (se um clone não tiver a pasta, ou pra publicar sem copiar):

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js"></script>
```

---

## Regra de ouro (repetida do 60-motion.md porque é a que mais se esquece)

Todo snippet aqui já vem com o guard de **`prefers-reduced-motion`**. Não remover.
Quem ligou "reduzir movimento" recebe o site sem animação, com todo o conteúdo
visível. Motion sem esse guard é falha de acessibilidade, não estilo.
