# Plano do site — Mullsanni Performance (prévia de prospecção)

> Passe duplo feito em 07/09/2026, antes da primeira linha de HTML, conforme
> `_memoria/design/00-anatomia.md`. **É prévia de venda** (o cliente ainda não fechou):
> serve pro Marcelo levar na oficina. Conteúdo real vem de `../conteudo-real.md`.

---

## PASSE 1 — o plano

### COR

Tirada da **marca real deles** (logo: monograma preto sobre amarelo), não escolhida por gosto.

| Token | Hex | Função | Contraste |
|---|---|---|---|
| `--breu` | `#0B0B0C` | fundo principal | — |
| `--grafite` | `#141417` | superfície elevada, faixa alternada | — |
| `--amarelo` | `#FFD200` | acento da marca, CTA, dado | 13,6:1 sobre breu ✅ |
| `--amarelo-esc` | `#8A6D00` | degrau escuro, para texto pequeno sobre amarelo | — |
| `--osso` | `#F2F2EF` | texto principal | 16,7:1 sobre breu ✅ |
| `--fumaca` | `#9A9AA0` | texto secundário | 6,7:1 sobre breu ✅ |

Preto sobre amarelo (`#0B0B0C` sobre `#FFD200`) = 13,6:1 ✅ para a faixa invertida.

### TIPO

| Papel | Fonte | Por quê |
|---|---|---|
| Display | **Archivo** 800/900, itálico, largura condensada | bate com a condensada bold itálica das artes deles; **não** está na lista de fontes gastas (Poppins/Montserrat/DM Sans/Fraunces/Instrument) |
| Corpo | **Barlow** 400/500/600 | grotesca neutra, boa em corpo, parenta com a display sem repetir |
| Dado | **IBM Plex Mono** 500/600 | ⚠️ mono aqui é **legítimo**: o antipadrão proíbe mono como "fantasia de técnico", e permite explicitamente para **dado e medida**. Aqui é leitura de dinamômetro. |

Escala em valor literal + media query (nada de `clamp()`, que esconde a escala do detector).
Razão mínima de 1,25 entre degraus.

### LAYOUT

```
┌──────────────────────────────────────────┐
│ [logo]            nav          [orçamento]│  header flutuante, não colado
├──────────────────────────────────────────┤
│  FOTO REAL (faixa de carro, sangra)      │
│  H1 duas linhas                          │  1. HERO
│  subtexto 18 palavras                    │     prova ao lado da promessa
│  [CTA primário]  selo ACF · Nova Racing  │
├──────────────────────────────────────────┤
│  coluna ÚNICA, 2ª pessoa                 │  2. PRA QUEM É
│  3 situações concretas, sem ícone        │     (o bloco mais esquecido)
├──────────────────────────────────────────┤
│  ██ PAINEL DE DINAMÔMETRO ██             │  3. A PROVA ← ASSINATURA
│  antes → depois, whp e kgfm, por carro   │     fundo grafite, dado em mono
├──────────────────────────────────────────┤
│  FUNDO AMARELO, texto preto              │  4. O QUE FAZEMOS
│  lista de serviços, 1 linha cada         │     inverte o ritmo
├──────────────────────────────────────────┤
│  O EQUIPAMENTO (encenar a prova)         │  5. POR QUE AQUI
│  scanners originais + dyno próprio       │     mecanismo, não adjetivo
├──────────────────────────────────────────┤
│  01 → 02 → 03, com o que levar           │  6. COMO COMEÇA
├──────────────────────────────────────────┤
│  formulário que qualifica → wa.me        │  7. ORÇAMENTO
├──────────────────────────────────────────┤
│  endereço, horário, mapa, contato        │  8. RODAPÉ
└──────────────────────────────────────────┘
```

Ritmo de fundo: breu → breu → grafite → **amarelo** → breu → grafite → breu → breu.
Quatro famílias de layout (faixa cheia, coluna única, painel de dado, lista invertida). ✅
Eyebrow: no máximo 1 a cada 3 seções, e **nenhum no hero**.

### ASSINATURA (a única ousadia)

**O painel de dinamômetro.** Os casos reais viram uma leitura de máquina: cada carro com
a barra do "antes" e a do "depois", número em mono, ganho destacado em amarelo. Não é
tabela nem card: é a cara do relatório que sai do Servitec deles.

---

## PASSE 2 — atacando o próprio plano

> **Eu chegaria nesse mesmo plano se o briefing fosse de qualquer outra oficina de
> performance?**

**Em parte, sim — e isso condena metade do plano.** "Preto + amarelo + condensada + antes/depois
de dyno" é o reflexo do segmento inteiro. Qualquer oficina de remap do Brasil renderia isso.

### O que sobrevive ao ataque (e por quê)

**O amarelo fica.** Não é escolha estética, é a **marca real deles** (logo amarelo/preto,
artes amarelas). Mesma lógica do roxo da Amparo: cor de marca chapada não é antipadrão, o
antipadrão é o gradiente com glow. Registrado para não ser confundido depois.

### O que muda depois do ataque

1. 🔴 **O hero deixa de vender potência.** "Mais potência para o seu carro" é o que TODA
   oficina de remap diz. O que quase nenhuma pode dizer é o que a Mullsanni tem escrito na
   própria arte: **equipamentos de diagnóstico usados pelas concessionárias de Audi, BMW,
   Porsche, Mercedes, Lamborghini, Land Rover, Jaguar e Volvo + dinamômetro Servitec próprio.**
   O eixo do site vira **"equipamento de concessionária, acerto de preparador"** — a dupla
   credencial, não o cavalo.
2. 🔴 **A assinatura ganha lastro físico.** O painel de dyno sozinho seria copiável por
   qualquer concorrente (é só desenhar barras). Ancorado no fato de que **eles têm a máquina**,
   vira prova que o concorrente sem dyno não pode imitar honestamente. A seção do equipamento
   passa a vir logo depois do painel, para o leitor fechar a conta sozinho.
3. 🔴 **Sai a "calculadora de ganhos"** que o relatório de prospecção original sugeria. Cravar
   cavalo por modelo é promessa de resultado num serviço que varia com combustível, hardware e
   estado do motor. Entra **caso medido, com o carro e a data**, que é verificável.
4. **A seção "pra quem é" fala do dono do carro, não do carro.** "Seu importado sai da
   garantia e a concessionária cobra o dobro" é situação concreta; "entusiastas de performance"
   é categoria abstrata.

---

## Travas desta peça (integridade e compliance)

- 🔴 **Todo número do painel é real**, copiado dos posts deles (`../conteudo-real.md`). Nada
  arredondado, nada inventado. Eles mesmos se corrigem em público sobre Stage 1 × Stage 2:
  um número inflado aqui destrói a venda.
- 🔴 **Sem promessa de ganho.** O painel mostra o que já foi medido em carros específicos,
  com a frase de que resultado varia por veículo. Nunca "seu carro vai ganhar X".
- 🔴 **Foto de IA está proibida** neste cliente: o ativo deles é carro real. As faixas de foto
  são **recortes provisórios das artes do Instagram** e estão marcadas como tal.
- 🔴 **O formulário não tem servidor:** ele monta a mensagem e abre o WhatsApp (lógica
  invertida). Não finge que enviou.
- ⚠️ **WhatsApp divergente** (Google × bio do Instagram): entra como `[FALTA: confirmar]` no
  código, não chuta número.
- Dados de contato/endereço vêm do Google Meu Negócio deles.

---

# RODADA 2 — reconstrução (09/09/2026)

> Gatilho: o Marcelo renderizou a rodada 1 e disse **"muito off, muita informação de forma
> feia ou desorganizada"**. Diagnóstico feito com screenshot real (puppeteer), não lendo o
> HTML — o defeito só existia na página montada.

## O que estava errado (verificado em tela, não presumido)

1. **Coluna morta em toda seção.** Todo bloco era texto à esquerda em ~55% da largura, com
   45% de vazio à direita. A seção "estrutura" tinha buraco de ~500px.
2. **Foto do hero invisível.** `opacity:.4` + gradiente `.55→.86→sólido` = borrão preto.
3. **Régua atravessando vazio** na faixa amarela: linha divisória de ponta a ponta com
   texto ocupando metade.
4. **Título colado na linha de apoio** (`.lede` sem `margin-top`).
5. **Rodapé oco**: um link grande solto e uma linha legal fina.
6. **Estouro horizontal no celular** (543px num viewport de 390) por especificidade de
   `.hero h1` vencendo o media query.

## O que mudou

| Antes | Depois |
|---|---|
| Hero em coluna única com vazio à direita | Hero em 2 colunas: título + **ficha de credenciais** ao lado |
| Foto de fundo velada a .4 | **Faixa sangrada** de 420px em opacidade cheia, vinheta só nas bordas |
| Faixa de selos separada | Selos viraram a ficha do hero (credencial acima da dobra) |
| 4 parágrafos empilhados | **Grade 2×2** de situações, em cartões |
| 6 quadros de dyno em coluna única | **Grade 2 colunas**, número na mesma linha da barra |
| Estrutura: texto x foto desbalanceado | **Grade 2×2** dos 4 equipamentos |
| Serviços: lista de largura cheia meio vazia | **2 colunas**, 6 serviços, régua só sob conteúdo |
| Rodapé oco | Rodapé de **3 colunas** + barra legal |
| Fundo chapado | **Texturas de IA abstratas** (carbono no bloco de resultados, metal no rodapé) |

## Imagens

- **Foto real extraída das artes do Instagram deles** (recorte limpo do topo, onde não há
  overlay): `hero-audi-s5.webp` (Audi com placa mullsanni, técnico ao lado) e `foto-tt.webp`.
- **Texturas de IA** geradas pelo Marcelo no ChatGPT: `textura-carbono.webp`,
  `textura-metal.webp`. ✅ Abstratas, **nenhuma IA no carro** (trava da casa respeitada).
- Convertidas para WebP: hero saiu de 1,6 MB para **82 KB**. Página inteira: **332 KB**.
- ⚠️ **Limite real:** a fonte é 1080px de largura (print de Instagram). Serve para a prévia
  de venda; para o site final **é preciso foto em alta do cliente** (pauta na seção abaixo).

## Verificação (09/09/2026)

- ✅ Detector impeccable via **npx**: `exit 0`, limpo.
- 🔴 **O `detect.mjs` local está quebrado** (no-op silencioso, exit 0 até em arquivo
  propositalmente péssimo). Só o npx vale como prova neste clone. Registrado em
  `_memoria/design/90-antipadroes.md`.
- ✅ Sem estouro horizontal a 390px (`scrollWidth == clientWidth`).
- ✅ Contraste: `#6E6E76` reprovava (3,9:1); trocado por `#85858C` (≈5,3:1 sobre breu).
- ✅ Renderizado e conferido em 1440px e 390px, seção por seção.

## Pauta de foto que ainda falta (do cliente)

Horizontal, 2400px+ no lado maior, sem filtro e sem texto por cima:
1. Hero: importado escuro dentro da oficina, à noite, banner mullsanni ao fundo.
2. **Carro em cima do dinamômetro** (a prova que concorrente sem máquina não imita).
3. Scanner plugado no OBD com painel aceso.
4. Escape de inox recém-soldado na bancada.
5. Jordan e Nelson na oficina.
6. Fachada do Galpão 04.

---

# RODADA 3 — de folheto a marca (09/09/2026)

> Gatilho: o Marcelo aprovou a visão criativa (laboratório de precisão) e mandou refazer.
> Diagnóstico da rodada 2: o site estava **competente mas sem emoção nem narrativa** — 8
> seções de peso igual, a prova (dyno) enterrada e miúda, o carro preso em tirinhas, o hero
> como slide de spec. Estudo ampliado: +3 marcas-referência (Brabus, Hennessey, Litchfield)
> e +3 lojas EUA (AWE, Integrated Engineering, Weistec). Padrão do segmento registrado em
> `_memoria/design/00-anatomia.md` e no teardown `referencias/performance-automotiva-cinco-sites.md`.

## Conceito e correção de anatomia

- **Conceito:** "potência que passa pela máquina" — num mercado de chute e bling, a Mullsanni
  **mede**. O dinamômetro é a filosofia virada objeto. Emoção-alvo: a calma de estar em mãos
  que sabem (cirurgião), não a adrenalina de pista.
- 🔴 **Correção de anatomia (o Marcelo apontou):** preparadora **não usa seção de "como começa"
  em etapas** (01→02→03). Nenhuma das 8 estudadas usa. Foi tique da anatomia genérica de
  serviço, importado errado na rodada 1-2. **Cortado.** O contato é ação direta.

## Nova ordem (convenção do segmento, adaptada a oficina local de lead-gen)

1. **HERO** — foto real cheia (car placeholder), veredito curto, uma prova-número acima da
   dobra, CTA direto. Sem cartão de credencial, sem parágrafo de posicionamento.
2. **COBERTURA** — as marcas que atende, em grade de verdade (o "seletor de veículo" das
   lojas EUA vira isto): faz o "é pra você?" e o SEO por modelo. Sobe de tirinha a seção.
3. **A PROVA** — casos de dyno por carro. **Curva do dyno como assinatura** (SVG subindo =
   a "decolagem"), número em escala de herói. O clímax.
4. **ESTRUTURA** — parede de equipamento (Litchfield): scanners de 8 montadoras + dyno
   Servitec + mapa ACF + escape Nova Racing. A prova que o concorrente não imita.
5. **SERVIÇOS** — por categoria, mais quieto. Faixa amarela (inverte o ritmo).
6. **QUEM FAZ** — Jordan + Nelson, origem/rosto, citação em 1ª pessoa (voz real deles).
7. **CONFIANÇA** — Google 5,0 (11 avaliações) + credenciais ACF/Nova Racing. Sem depoimento
   inventado (não temos o texto das reviews).
8. **ORÇAMENTO** — form que pergunta o carro → WhatsApp. Direto, sem etapas.

## Assinatura (a única ousadia) e motion

- **A curva do dinamômetro.** SVG de duas linhas (antes cinza, depois amarela subindo até o
  corte de giro). É o dado real deles e a metáfora da ascensão, honesta. Desenha-se **uma
  vez** na entrada (IntersectionObserver + `stroke-dashoffset`), guardada por
  `prefers-reduced-motion`. **Sem GSAP, sem Lenis** — o brief é "sem grandes animações".
- Removidas as **texturas de IA** (carbono/metal) da rodada 2: são o clichê do segmento.

## Passe duplo — atacando o próprio plano

> **Eu chegaria nessa direção em qualquer preparadora?** Preto+amarelo+dyno é o reflexo do
> segmento. O que sobrevive ao ataque:
- **O amarelo fica** — marca real deles (não escolha estética). Mesma lógica do roxo da Amparo.
- **A curva do dyno + o número em escala** não é genérico porque o dado é real e do cliente
  (`conteudo-real.md`); um concorrente sem dyno não pode encená-lo honestamente.
- **A parede de equipamento** é lastro físico: só é verdade pra quem tem as máquinas. É o que
  impede o site de ser um template preto-e-amarelo qualquer.

## Travas (mantidas da rodada 2)

- 🔴 Todo número do dyno é real (`conteudo-real.md`), nada arredondado. Sem promessa de ganho.
- 🔴 Sem IA no carro/rosto. Foto real ou placeholder marcado. Texturas de IA removidas.
- 🔴 WhatsApp divergente = `[FALTA: confirmar]` no código, não chuta.
- Form sem servidor: monta a mensagem e abre o WhatsApp.

## Decisões travadas (kit-cor + kit-tipo, 09/09/2026)

- **Cor:** `--breu #0B0B0C` / `--osso #F2F2EF` (17,5:1) / `--amarelo #FFD200` (preto sobre
  amarelo 13,6:1). Amarelo = 0 design systems no acervo → distingue. Todos os pares AAA.
- **Tipo:** Archivo (display 900 itálico condensado) + Barlow (corpo) + IBM Plex Mono (dado).
  As três livres/OFL (kit-tipo: Archivo e Plex confirmados; Barlow é OFL no Google Fonts).
  Escala base 17 / razão 1,25 + degrau "hook" acima do display pro hero e o número do dyno.
- **Acervo (kit-buscar):** nada de performance (3 peças genéricas). Build do zero.

## Verificação (rodada 3, 09/09/2026)

- ✅ **Detector impeccable via npx** (`impeccable@4.0.4`): exit 0, limpo. Passou por 3 correções:
  9 achados iniciais → move do respiro horizontal pro nível da seção (cramped-padding),
  citação a 1,3 de entrelinha (tight-leading), números da parede de equipamento removidos
  (advisory de rótulo numerado) → sobrou 1 `low-contrast` (`--apagado #6E6E74` sobre surface,
  3,4:1) → clareado para `#8A8A90` (4,9:1) → **exit 0 final**.
- ✅ **Render conferido** (Edge/Chrome headless): hero, cobertura, prova (curva do dyno +
  6 casos), estrutura, serviços (faixa amarela), quem faz, confiança, orçamento. A curva sobe
  (cinza→amarelo), os números vêm em escala de herói, a parede de equipamento com as 8 marcas.
- ✅ **Sem tracinho** como separador na copy (regra do Marcelo): 6 ocorrências de "—" reescritas.
- ⚠️ **Limite da máquina:** o headless tem piso de 500px de largura e teto de ~2700px de altura;
  o mobile real de 360-390px não foi renderizável aqui. A 500px `scrollWidth = clientWidth`
  (sem estouro) e o layout mobile (breakpoint 680) está ativo; o chip do hero foi blindado
  (`flex-wrap`) para 360-390. **Conferir num celular real antes de publicar.**
- 🔴 Pendências que travam a versão final (do cliente): fotos em alta (hero no dyno, Jordan e
  Nelson, fachada), confirmar o WhatsApp de atendimento, autorização de reuso dos números/reviews.
