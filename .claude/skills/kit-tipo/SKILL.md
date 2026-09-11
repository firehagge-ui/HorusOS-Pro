---
name: kit-tipo
description: >
  Define a tipografia do site como decisão — e, principalmente, resolve se dá
  para ENTREGAR. Confere licença (site de marca paga por tipo, e acervo montado
  a partir de site de marca vem cheio de fonte comercial que não se pode
  servir), propõe substituto livre com critério de desenho, monta o
  par display + corpo, gera a escala modular em px e rem, e cuida do peso que
  cada fonte custa no carregamento. Use quando o usuário disser "define a
  tipografia", "que fonte usar", "monta a escala tipográfica", "qual fonte
  substitui a X", "posso usar essa fonte?", "essa fonte é paga?", "o texto está
  sem hierarquia", ou invocar /kit-tipo. Use também, sem esperar o pedido,
  antes de aplicar um design system a um cliente — design system extraído de
  site real nomeia a fonte e quase nunca diz onde carregá-la legalmente.
allowed-tools: Read Bash(python:*) Bash(python3:*)
---

# kit-tipo — decidir o tipo, e poder entregá-lo

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

A `kit-cor` existe porque o acervo tem cor demais e decisão de menos. Aqui o
problema é **o inverso**, e é mais grave: o acervo nomeia **389 fontes
diferentes, 341 delas usadas uma única vez** (87%).

```bash
python "${SKILL_DIR}/scripts/tipo.py" --vies
```

Isso não é variedade. É a **lista de compras de outras marcas**. Os design
systems foram extraídos de sites reais, e site de marca paga por tipo: `Aeonik`,
`Roobert`, `GT Standard`, `Suisse Int'l`, `Söhne`, `PP Neue Montreal`, `Lausanne`
— todas comerciais, com licença web cobrada por pageview ou por domínio.

Dois padrões que definem o trabalho desta skill, e que aparecem em qualquer acervo
montado a partir de site real:

- **Design system nomeia a fonte e não diz onde carregá-la.** Ele diz "use ES
  Allianz" e para. Nenhum traz licença, origem ou substituto — isso é trabalho seu.
- **Prompt de página puxa de `db.onlinewebfonts.com`** e de outros sites que
  redistribuem fonte comercial sem licença. Entregar isso ao cliente é entregar o
  problema junto.

Quantas peças do **seu** acervo estão em cada caso:

```bash
python "${SKILL_DIR}/scripts/tipo.py" --vies
python "${SKILL_DIR}/scripts/tipo.py" --classificar
```

> **Cor é de graça. Tipo não é.** Essa é a diferença que organiza tudo aqui.

---

## 0. Escala não é decoração — é tempo

Antes da mecânica, o que a escala está fazendo: **tamanho, posição, contraste e
espaçamento são timing.** A manchete funciona de longe; a frase de apoio recompensa
quem se aproximou. Isso é hierarquia como sequência, não como enfeite
(`${SKILL_DIR}/references/fundamentos-visuais.md` §3).

Monte em **três degraus**, não em sete:

| Degrau | Papel |
|---|---|
| **hook** | o que para o scroll |
| **secundário** | o que explica, para quem parou |
| **finisher** | onde a jornada termina — normalmente o CTA |

E a ressalva que quase ninguém faz: **o maior nem sempre é o mais importante.** Em
página de produto, sim, o produto é o herói. Em página de evento ou serviço, o hook
pode ser a imagem ou uma frase enquanto a informação que converte (data, preço,
endereço) é o **menor** elemento — porque quem chegou até ela já decidiu procurar.

Depois de gerar a escala com `--escala`, confira: dá para apontar o hook, o
secundário e o finisher na tela? Se três coisas disputam o papel de hook, não há
hook.

---

## 1. Antes de gostar, confira se pode usar

Sempre o primeiro passo, e quase nunca o que se faz primeiro:

```bash
python "${SKILL_DIR}/scripts/tipo.py" --licenca "Aeonik"
```

Três situações, e a do meio é a que pega:

| | O que fazer |
|---|---|
| **livre** (OFL, Fontshare) | siga |
| **comercial** | ou o cliente compra a licença **web**, ou você substitui |
| **restrita** | não tem conversa — substitua |

A categoria "restrita" existe por um caso concreto: **`SF Pro` não pode ir para a
web.** A licença da Apple cobre interface de app nas plataformas dela, não site.
Ela aparece 4 vezes no acervo, está instalada em todo Mac, e é por isso que passa
despercebida. `Segoe UI` tem o mesmo problema no Windows. As duas servem como
**fallback** na pilha, nunca como escolha.

**Nunca baixe de `db.onlinewebfonts.com`** nem de espelho parecido. São
redistribuições sem licença — e quem entrega isso passa o problema para o
cliente, que é quem responde.

Se a licença comercial for o caminho, avise o custo **antes** de desenhar com
ela. Descobrir depois que a fonte custa por pageview é retrabalho caro.

---

## 2. Substitua por desenho, não por aparência

```bash
python "${SKILL_DIR}/scripts/tipo.py" --substituir "Roobert"
```

O script devolve substituto livre com o critério explícito. O critério é
**desenho** — largura, altura-x, contraste, terminações — não "achei parecido".

Alguns que resolvem a maior parte do acervo:

| Comercial | Livre | Por quê |
|---|---|---|
| Aeonik, PP Neue Montreal | **General Sans** (Fontshare) | grotesca geométrica de altura-x média |
| Suisse Int'l, Lausanne | **Switzer** (Fontshare), Inter | suíça neutra |
| GT Standard, Helvetica Neue, Söhne | **Inter**, Archivo | neo-grotesca neutra |
| Circular, GT Walsheim | **Outfit**, Manrope | geométrica de terminação reta |
| P22 Mackinac, Editorial New | **Fraunces**, Instrument Serif | serifa de alto contraste |
| Monument Extended | **Unbounded**, Anton | display expandida pesada |

Substituto nunca é idêntico, e tudo bem. O que precisa sobreviver é o **papel**
da fonte na identidade: se ela existia para parecer técnica, o substituto tem que
parecer técnica.

---

## 3. Duas famílias. Três é indecisão

```bash
python "${SKILL_DIR}/scripts/tipo.py" --par "Instrument Serif"
```

Um display e um corpo. Mono só entra se houver rótulo técnico, número ou código
de verdade — não como enfeite.

**A regra que mais se quebra:** serifa de display de alto contraste é **só
título**. `Cormorant`, `Playfair Display`, `Libre Caslon`, `Instrument Serif` —
os traços finos delas somem em 16px e em tela sem retina. Toda uma delas pede uma
sans robusta no corpo.

E o caso oposto: **fonte de peso único constrói hierarquia por TAMANHO**, não por
peso. `Anton` tem um peso só; pedir semibold dela faz o navegador sintetizar
negrito, que é aquele borrão gordo que denuncia amadorismo.

Combinação segura quando o brief não pede nada: uma serifa editorial no display
com uma sans neutra no corpo. É reliable, não é original — e reconhecer a
diferença faz parte.

---

## 4. A escala é calculada, não escolhida a olho

```bash
python "${SKILL_DIR}/scripts/tipo.py" --escala --base 17 --razao 1.25
```

Base e razão, e o resto sai. Duas travas que o script avisa:

- **Base abaixo de 16px é problema real**, não preferência. 16px é o padrão do
  navegador, e abaixo disso **o iOS dá zoom automático em `input`** — o que
  desmonta o layout de qualquer formulário. Se o site tem agendamento ou
  contato, isso é entrega quebrada.
- **Razão a partir de 1.5 abre buraco** entre corpo e subtítulo. Passa bem em
  landing de uma tela; em site de conteúdo, fica faltando degrau. Para conteúdo,
  1.2 a 1.333.

Arredonde para o meio pixel ao escrever o token: fração longa não muda nada na
tela e só polui o CSS.

---

## 5. Peso carregado é peso na primeira pintura

Cada peso é um arquivo. Quatro pesos de duas famílias são oito requisições no
caminho crítico, e o sintoma é o texto piscando de fallback para a fonte real.

- **Carregue só os pesos que você usa.** Se o design tem regular e bold, são dois
  — não os nove que o Google Fonts oferece.
- **Prefira a variável** quando precisar de faixa ampla: um arquivo cobre tudo.
- `font-display: swap` para o texto aparecer antes da fonte chegar. Sem isso, o
  parágrafo fica invisível durante o carregamento.
- Em Next.js, `next/font` faz self-host e elimina a requisição a terceiro —
  ganha em performance e em privacidade, porque o Google Fonts como CDN entrega
  IP do visitante.

Se a fonte vier por `@font-face` local, **os arquivos precisam existir no
projeto**. É a armadilha já registrada no `unwind-hero`: o prompt assume que os
WOFF da PP Mori estão lá, e não estão.

---

## 6. Só então escolha o design system

Com licença resolvida, par definido e escala pronta, a busca muda de natureza:

```bash
python "${SKILL_DIR}/scripts/buscar.py" "<caráter>" --familia design-system
```

O design system vai trazer a escala tipográfica dele e o nome da fonte dele.
**Trate o nome como sugestão, não como requisito** — confira a licença antes de
adotar, e substitua sem culpa. A identidade do design system está na escala, no
espaçamento e no contraste, não no arquivo da fonte.

Se o MCP do **GetLayers** estiver ligado, `getlayers_fonts` traz 15 tipos
curados, cada um já com o `stack` CSS exato e a `importUrl` — todos livres, e com
`pairsWith` para o par display + corpo. Ver
`${SKILL_DIR}/references/getlayers.md`.

---

## 7. Grave a decisão

Na receita (passo 9 da `kit-montar`), registre **as duas famílias, a base, a
razão e a situação de licença**. Especialmente quando houver substituição: sem
isso, o próximo projeto tenta usar a fonte comercial de novo, porque é ela que
está escrita no design system.

Se uma fonte quebrar em algum lugar — peso sintetizado, arquivo faltando, zoom no
iOS — registre:

```bash
python "${SKILL_DIR}/scripts/armadilhas.py" --add <id-da-peça> \
  --texto "o que quebrou e em que tamanho/peso" --origem <receita> --grau alta
```

---

## O que esta skill não faz

Não avalia se uma fonte é "bonita", não gera fonte, e não conhece todas: o
catálogo cobre as que aparecem no acervo mais as livres que valem a pena. Para
nome fora dele, o script diz que **não sabe** em vez de chutar — e nesse caso a
resposta certa é conferir a fundição, não assumir que é livre.

Marca conhecida quase sempre significa fonte paga.
