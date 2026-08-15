# Scroll suave (Lenis)

O detalhe que mais entrega sensação de "site caro" com menos esforço. Substitui a
rolagem seca do navegador por uma com inércia. ~3kb. Casa com o ScrollTrigger.

**Quando usar:** praticamente qualquer site que a gente queira que pareça premium.
**Quando NÃO:** dashboard/app com muita tabela, onde a pessoa quer rolagem precisa.
E **liga sozinho o respeito ao `prefers-reduced-motion`** (desativa a inércia).

## JS (colar antes do `</body>`, depois de carregar lenis.min.js)

```js
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const lenis = new Lenis({
    duration: 1.1,          // "peso" da inercia. 0.8-1.2 e o intervalo bom
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Se estiver usando ScrollTrigger na mesma pagina, sincronizar os dois:
  if (window.ScrollTrigger) {
    lenis.on('scroll', ScrollTrigger.update);
  }
}
```

## Cuidado

- **Não** aumentar `duration` além de ~1.3. Inércia demais faz a pessoa sentir que
  o site está "escorregando" e perde controle — vira o antipadrão de scroll
  sequestrado (ver `60-motion.md`).
- Testar no celular. Em alguns Android a inércia nativa já é boa e o Lenis pode
  brigar; se estranhar, limitar a `smoothWheel` (desktop) só.
