# kit-mapa

Localização de negócio local, sem chave de API e na cor do site.

```
Mapa.tsx    o componente + os provedores
mapa.css    só variáveis (o filtro mora aqui)
```

---

## Por que iframe e não Leaflet

Para a seção "onde estamos" de uma clínica ou restaurante, o mapa é decorativo
e informativo: um ponto, um endereço, um botão de rota. Leaflet resolveria, ao
custo de 42 kB, um `useEffect` de montagem, e um bug clássico de tile cinza
quando o container muda de tamanho.

O embed do OpenStreetMap faz o mesmo com zero dependência, zero chave, zero
custo e zero cookie — então nem entra no banner de consentimento.

Quando o mapa passa a ser a funcionalidade (várias unidades, filtro, "mais
perto de mim"), aí sim troque por Leaflet ou Mapbox GL. Esta peça não tenta ser
isso.

---

## Uso

```tsx
"use client";
import Mapa, { rotaGoogle, rotaWaze } from "@/components/kit-mapa/Mapa";

const LOCAL = { lat: -23.5613, lng: -46.6565, zoom: 16 };

<Mapa
  local={LOCAL}
  titulo="Clínica Aurora"
  endereco={"Alameda Santos, 1200 — cj. 84\nCerqueira César, São Paulo"}
  descricao="Mapa mostrando a localização da Clínica Aurora na Alameda Santos"
  acoes={[
    { rotulo: "Como chegar", href: rotaGoogle(LOCAL), primaria: true },
    { rotulo: "Waze",        href: rotaWaze(LOCAL) },
    { rotulo: "Ligar",       href: "tel:+551133334444" },
  ]}
/>
```

Sem `titulo`, `endereco` e `acoes`, o cartão some e sobra só o mapa.

---

## Casando com a paleta — o filtro

É a única coisa que costuma precisar de ajuste. Um mapa cru chega na cor do
provedor e destoa de qualquer identidade.

```css
.secao-contato .kit-mapa {
  --kit-filtro: invert(1) hue-rotate(180deg) grayscale(.85) brightness(.9);
  --kit-altura: 32rem;
}
```

Receitas que funcionam como ponto de partida:

| Tema do site | `--kit-filtro` |
|---|---|
| claro, neutro | `grayscale(1) contrast(.92) brightness(1.06)` |
| escuro | `invert(1) hue-rotate(180deg) grayscale(.85) brightness(.9)` |
| sépia, quente | `sepia(.55) saturate(.75) contrast(.95)` |
| frio, azulado | `grayscale(1) sepia(.4) hue-rotate(170deg) saturate(2.2)` |
| sem tratamento | `none` |

Colorir só no hover, deixando neutro em repouso:

```css
.kit-mapa {
  --kit-filtro: grayscale(1) contrast(.9);
  --kit-filtro-hover: none;
}
```

Ajuste pontual sem CSS:

```tsx
<Mapa style={{ "--kit-filtro": "sepia(.5)" } as React.CSSProperties} … />
```

---

## Trocando de provedor

`provedor` é uma função `(local) => url`. Trocar é passar outra, não editar o
componente.

```tsx
import Mapa, { google } from "@/components/kit-mapa/Mapa";

<Mapa local={LOCAL} provedor={google} … />
```

Mapbox com estilo próprio (aí o filtro sai de cena — o estilo já vem certo):

```tsx
const mapbox = ({ lat, lng, zoom }) =>
  `https://api.mapbox.com/styles/v1/SEU_USUARIO/SEU_ESTILO.html` +
  `?title=false&access_token=${process.env.NEXT_PUBLIC_MAPBOX}` +
  `#${zoom}/${lat}/${lng}`;

<Mapa local={LOCAL} provedor={mapbox} style={{ "--kit-filtro": "none" }} … />
```

---

## Armadilhas

**O iframe rouba o scroll.** É o motivo do véu existir. A pessoa rola a página,
o ponteiro cruza o mapa e vira zoom no mapa em vez de continuar a rolagem. Com
**Lenis é pior**: o scroll suave perde o passo e a página trava. O véu cobre o
iframe até receber um clique — quem quer interagir, clica; quem só está passando,
passa. Desligue com `travarScroll={false}` apenas se o mapa não estiver numa
página que rola.

**Rótulo ilegível depois do filtro.** `invert` + `grayscale` derrubam o
contraste do nome da rua. Olhe o resultado no zoom que você vai publicar, não só
no enquadramento aberto.

**Coordenada não é endereço.** O marcador do OSM cai exatamente no par lat/lng.
Pegue do próprio mapa (clique direito → "mostrar endereço"), não de um
geocodificador aproximado, senão o pino aparece do outro lado da quadra.

**`descricao` não é enfeite.** É o `title` do iframe e a única coisa que um
leitor de tela anuncia. Sem ele, o elemento vira "quadro sem título".

**Google embed põe cookie.** O padrão OSM não. Se trocar para `google`, o mapa
passa a exigir consentimento — carregue só depois do aceite.

**`zoom` acima de 17 no OSM** perde detalhe em cidades pequenas: os tiles não
existem e o mapa fica vazio. 15–17 é a faixa segura para negócio local.
