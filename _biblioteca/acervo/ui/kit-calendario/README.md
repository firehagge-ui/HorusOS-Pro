# kit-calendario

Seletor de data. Sem biblioteca de data, sem idioma escrito no código, sem uma
única cor literal.

```
Calendario.tsx     o componente
useCalendario.ts   a matemática de data (serve sozinha)
calendario.css     só variáveis
```

---

## Uso

```tsx
"use client";
import { useState } from "react";
import Calendario from "@/components/kit-calendario/Calendario";

const [dia, setDia] = useState<string | null>(null);

<Calendario valor={dia} onChange={setDia} />
```

Sem configurar nada ele já sai na **cor e na fonte do texto ao redor** — o
fallback das variáveis é `currentColor` e `inherit`, nunca um cinza que não é do
projeto.

---

## O que se muda, e onde

| O que | Como |
|---|---|
| paleta, fonte, raio, tamanho da célula | variáveis no topo de `calendario.css` |
| idioma dos meses e dias | `locale="en-US"` |
| domingo ou segunda no início | `inicioSemana={1}` |
| `"agosto de 2026"` → `"ago 26"` | `formatoTitulo={{ month: "short", year: "2-digit" }}` |
| `"seg."` → `"S"` ou `"segunda-feira"` | `formatoSemana="narrow" \| "long"` |
| quais dias aceitam clique | `diaDisponivel` |
| quais dias ganham o pontinho | `diaMarcado` |
| janela de navegação | `min` / `max` |

Nenhum nome de mês ou de dia está escrito no código — todos saem do `Intl` a
partir do `locale`. Trocar o idioma do site não exige tocar em nada.

---

## Bloqueando dias

```tsx
const FECHADO = ["2026-12-24", "2026-12-25"];

<Calendario
  valor={dia}
  onChange={setDia}
  diaDisponivel={(d) => !d.fimDeSemana && !FECHADO.includes(d.iso)}
  diaMarcado={(d) => vagas[d.iso] > 0}
  min={null}                 // padrão é hoje; `null` libera o passado
  max="2026-12-31"
/>
```

O objeto `Dia` traz `iso`, `data`, `numero`, `doMes`, `hoje`, `passado` e
`fimDeSemana`.

---

## Ligando na paleta

O componente já lê os nomes de token mais comuns — muitas vezes basta:

```css
:root {
  --color-fg: #14110f;
  --color-bg: #fdfcfa;
  --color-accent: #7a5c3e;
  --color-accent-fg: #fff;
  --radius: 0.5rem;
}
```

Se os seus tokens têm outros nomes, faça a ponte:

```css
.minha-secao {
  --kit-acento: var(--marca-primaria);
  --kit-cel: 3rem;
  --kit-raio-cel: 999px;   /* dias redondos */
}
```

---

## Teclado

Já vem pronto: setas andam um dia e uma semana, `Home`/`End` vão às pontas da
semana, `PageUp`/`PageDown` trocam de mês. Só o dia focado é tabulável — 42
paradas de `Tab` num calendário é hostil, e é o erro mais comum nessas peças.

---

## Armadilhas

**`toISOString()` erra o dia.** `new Date(...).toISOString().slice(0,10)`
converte para UTC. Em UTC-3, toda data criada entre meia-noite e 3h volta como o
**dia anterior**. Por isso existe `paraISO` — ela lê os componentes locais, então
o dia é o que a pessoa viu na tela. O par, `deISO`, existe pelo motivo espelhado:
`new Date("2026-08-10")` é interpretado como UTC pelo padrão da linguagem.

**Dia bloqueado é riscado, não apagado.** Apagado sozinho lê igual a "dia do
outro mês", e a pessoa fica clicando achando que o site travou.

**`--kit-cel` é 44px** por ser o alvo de toque mínimo confortável. Reduzir no
mobile aumenta o erro de escolha — e mobile é onde essas peças são usadas.

**`somarMeses` sempre volta no dia 1.** 31 de janeiro + 1 mês, feito ingênuo,
vira 3 de março. Se for reusar a função, saiba que ela normaliza.

---

## Usando só a matemática

`useCalendario.ts` não importa React. Serve para qualquer coisa que precise de
grade de mês ou de data local correta:

```ts
import { gradeDoMes, paraISO, nomesDaSemana } from "./useCalendario";

const semanas = gradeDoMes(2026, 7, 1);          // agosto/2026, começando na segunda
const hoje    = paraISO(new Date());              // "2026-08-06", sem susto de fuso
const cab     = nomesDaSemana("pt-BR", 1, "narrow");
```

---

## O que ele não faz

Intervalo de datas (check-in/check-out) — a seleção é de dia único. E não trata
fuso: se o estabelecimento e o cliente estão em fusos diferentes, a conversão é
sua.
