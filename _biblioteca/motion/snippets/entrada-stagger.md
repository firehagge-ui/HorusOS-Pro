# Entrada em cascata (stagger) conforme o scroll

O movimento mais útil e o mais fácil de exagerar. Os elementos aparecem em
sequência quando a seção entra na tela — em vez de todos ao mesmo tempo (que é o
antipadrão do AOS). A cascata dá hierarquia: o olho segue a ordem.

**Quando usar:** listas de cards, etapas, grade de serviços, qualquer bloco com
vários itens. **Quando NÃO:** o hero (que já está visível ao carregar) e texto de
leitura corrida.

## HTML

```html
<section class="secao">
  <div class="reveal">Item 1</div>
  <div class="reveal">Item 2</div>
  <div class="reveal">Item 3</div>
</section>
```

## CSS (o estado inicial + o fallback de acessibilidade)

```css
.reveal { opacity: 0; transform: translateY(24px); }

/* Se o JS falhar OU a pessoa pediu menos movimento: tudo visível, sem animação */
@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; }
}
```

## JS

```js
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('.secao').forEach((secao) => {
    gsap.to(secao.querySelectorAll('.reveal'), {
      opacity: 1,
      y: 0,
      duration: 0.6,          // piso: 400-600ms. Mais lento parece "carregando"
      ease: 'power2.out',
      stagger: 0.12,          // o intervalo entre um item e o proximo
      scrollTrigger: {
        trigger: secao,
        start: 'top 80%',     // dispara quando o topo da secao chega a 80% da tela
      },
    });
  });
} else {
  document.querySelectorAll('.reveal').forEach((el) => {
    el.style.opacity = 1; el.style.transform = 'none';
  });
}
```

## Calibragem

- `stagger` entre `0.08` e `0.15`. Acima de `0.2` a cascata fica lenta e a pessoa
  espera.
- `translateY` de no máximo ~24px. Mais que isso vira pulo, não entrada.
- Nunca aplicar `.reveal` em **todos** os elementos da página. Escolher o que se
  move é o trabalho — ver a régua no `60-motion.md`.
