# Revelar título por palavra (SplitText)

O título do hero aparece palavra por palavra (ou letra por letra). Dá peso a uma
frase-chave sem enfeite gráfico. A versão nova do SplitText tem acessibilidade
embutida (leitor de tela ainda lê a frase inteira).

**Quando usar:** UM título por página, geralmente o do hero. **Quando NÃO:** em
vários títulos (vira maneirismo), nem em texto de leitura.

## HTML

```html
<h1 class="titulo-reveal">A gente não planta. A gente escolhe.</h1>
```

## CSS

```css
.titulo-reveal { visibility: hidden; }   /* evita "flash" antes do JS montar */
@media (prefers-reduced-motion: reduce) {
  .titulo-reveal { visibility: visible; }
}
```

## JS

```js
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.registerPlugin(SplitText);
  document.fonts.ready.then(() => {          // esperar a fonte carregar evita quebra errada
    const split = new SplitText('.titulo-reveal', { type: 'words' });  // ou 'chars'
    gsap.set('.titulo-reveal', { visibility: 'visible' });
    gsap.from(split.words, {
      opacity: 0,
      y: 20,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.06,
    });
  });
} else {
  document.querySelector('.titulo-reveal').style.visibility = 'visible';
}
```

## Calibragem

- `type: 'words'` quase sempre lê melhor que `'chars'`. Letra por letra só em frase
  curta e de muito destaque, senão parece máquina de escrever de template.
- `document.fonts.ready` importa: se dividir o texto antes da fonte carregar, a
  quebra de linha muda depois e o efeito "pula".
- Combina com o brilho/gradiente no texto (ver `_memoria/design/60-motion.md`, a
  linha "luz acompanhando palavra").
