# Fundo WebGL animado (Vanta.js e Unicorn Studio)

O "fundo vivo que reage ao mouse". É a assinatura em movimento mais forte do
arsenal — por isso **uma por página, no máximo**, e nunca em cliente regulado
(ver a trava de compliance no `60-motion.md`).

> **A regra que separa isto de "cara de IA":** o fundo tem que dizer algo do
> cliente. Partícula genérica flutuando é o clichê da era WebGL. Vapor de café,
> textura de papel, rede que lembra conexão — sim. Bolinha aleatória — não.

---

## Opção A — Vanta.js (rápido, por código)

Aplica o efeito num `<div>`. Precisa do Three.js antes. Efeitos: `fog`, `waves`,
`net`, `topology`, `birds`, `cells`, `globe`.

```html
<div id="hero-bg" style="position:absolute; inset:0; z-index:0;"></div>

<script src="https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.fog.min.js"></script>
<script>
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches
    && window.innerWidth > 768) {          // desliga no mobile pra nao pesar
  VANTA.FOG({
    el: '#hero-bg',
    highlightColor: 0x6b4423,   // trocar pelas cores da marca do cliente
    midtoneColor: 0x3a2817,
    lowlightColor: 0x1a0f0a,
    blurFactor: 0.6,
    speed: 1.0,
  });
}
</script>
```

O conteúdo do hero vai por cima com `position:relative; z-index:1`.

## Opção B — Unicorn Studio (mais controle estético, no-code)

Quando o visual do Vanta não serve. Monta-se o efeito no editor visual deles
(unicorn.studio), exporta e embeda. 36kb, mais bonito e mais controlável que o
Vanta, ainda leve. Reservar pro hero que precisa ser **a** assinatura da página
(ex.: site da Hórus).

---

## Regras não negociáveis

- **Uma por página.** Não empilhar fundo WebGL + parallax + objeto atravessando.
- **Desligar no mobile** se comer o carregamento (`window.innerWidth > 768`).
- **`prefers-reduced-motion`**: sem fundo animado, cor sólida ou imagem estática no
  lugar.
- **Contraste do texto por cima** continua valendo — o detector do impeccable pega
  `low-contrast` mesmo com fundo animado. O texto tem que ler sobre o frame mais
  claro do efeito.
- **Compliance:** nenhum cliente regulado (odonto/psico). Para Grão da Serra, nada
  que sugira lavoura — vapor/torra/grão, nunca campo.
