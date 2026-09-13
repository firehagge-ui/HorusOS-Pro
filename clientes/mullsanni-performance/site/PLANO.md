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

---

# RODADA 4 — nova versão com foto real + linguagem da referência (12/09/2026)

> Gatilho: o Marcelo (1) soltou em `assets/` **as fotos e vídeos reais do Instagram** deles,
> (2) mandou uma **imagem de referência** de landing feita no ChatGPT
> (`assets/Landing Page Automotiva Mullsanni Performance.png`) e pediu **"uma nova versão com
> uma cara melhor, muito criativa"**, aproveitando o material. A rodada 3 era honesta mas
> sóbria (só número, carro em tirinha, uma foto provisória de 1080px). Agora há **fotos reais
> de verdade** e um alvo visual.

## O que a referência do ChatGPT trouxe (e adotei)

Layout mais rico e comercial que o da rodada 3: **hero split** (texto + carro), **faixa de
marcas**, **cards de serviço com foto**, **galeria de projetos**, **CTA amarelo full**, mais
densidade visual. O amarelo/preto/branco da referência **bate com a marca real** deles, então
casou sem briga.

## O que a referência trazia e foi CORRIGIDO (integridade vence a referência)

1. 🔴 **Números inventados.** A referência traz "+500 projetos · +8 ANOS de experiência ·
   +98% de clientes satisfeitos". A empresa **tem 1 ano** (aberta 09/09/2024) e não temos
   esses números. Trocado pela **prova real**: ganho de dyno medido (+56 whp Mini JCW),
   **5,0★ no Google (11 avaliações)**, **8 marcas** com equipamento de concessionária,
   **representante oficial ACF + Nova Racing**. Nada de ano/projeto/porcentagem inventados.
2. 🔴 **Copy em inglês** ("CARS DRIVE PEOPLE FORWARD"). Fora. Entrou o slogan **real** deles:
   "Sua paixão, nossa assinatura".
3. 🔴 **Depoimentos inventados** (Rafael M./Lucas P./Bruno T. com carro e 5 estrelas). Não
   temos o texto das reviews. Mantida a regra da rodada 3: **sem depoimento inventado** — a
   seção de confiança usa o 5,0★ real + credenciais. Placeholder marcado onde entraria review real.
4. ⚠️ **"As marcas que confiam na gente"** (com logos de montadoras) = falso endosso. Virou
   **"As marcas que a gente abre"** (equipamento de diagnóstico das montadoras, que é o fato
   real de `conteudo-real.md §4`), não endosso delas à Mullsanni.
5. 🔴 **Texturas de IA** (metal escovado + fibra de carbono, que o Marcelo re-colocou em
   `assets/`): **não entraram.** São o clichê visual do próprio segmento (trava do CLAUDE.md
   do cliente, item 4, e da rodada 3). A referência que ele curtiu também não usa carbono —
   usa foto real de carro no escuro. Segui a foto real.

## Imagens (todas reais, do Instagram deles — zero IA no carro)

Processadas de 1080px do Instagram para WebP no tamanho de exibição (Pillow, quality 80),
em `site/assets/`:
- **Hero:** `hero-r8.webp` (Audi R8 V10 vermelho no dinamômetro, placa "mullsanni" à vista) +
  loop de vídeo leve opcional (`hero-loop.mp4`, clipe curto do dyno/escape, mudo, com a foto
  de poster e fallback). `hero-fogo.webp` (backfire) vira faixa sangrada de emoção.
- **Prova (casos de dyno, agora com FOTO do carro real):** `car-mini`, `car-tiguan`,
  `car-porsche`, `car-208`, `svc-dyno` (A3), `car-r8`. Cada caso: foto + ganho medido.
- **Serviços com foto:** `svc-scanner` (remap/diagnóstico), `svc-motor`, `svc-escape`
  (downpipe inox), `svc-dyno`, `svc-fogo`, `svc-oficina`.
- **Galeria de projetos:** R8, Porsche 718, Mini JCW, Civic, Tiguan, 208, Civic azul.
- **Quem faz:** `socios.webp` (Jordan + Nelson de rosto, foto real). **Não é mais placeholder.**
- **Estrutura:** `oficina-wide` / `estrutura` (BMW M2 + galpão).

## Assinatura (mantida e elevada) e motion

- **Assinatura:** a prova com **foto real + número medido** (a rodada 3 tinha só número). A
  curva do dyno continua como cabeça da seção (SVG que desenha uma vez).
- **Motion (o Marcelo pediu criatividade), dentro da régua do `60-motion.md`:** scroll suave
  (Lenis, já vendorizado, respeita reduced-motion), reveals em cascata sutis, **contador dos
  ganhos reais** subindo (permitido: número real + é o argumento + setor não regulado),
  hover de resposta nos cards/projetos, loop de vídeo no hero. 1 assinatura de motion (a
  curva/o hero), o resto quieto. Tudo com `prefers-reduced-motion`.

## Travas (mantidas)

- 🔴 Todo número do dyno é real (`conteudo-real.md`). Sem promessa de ganho.
- 🔴 Zero IA no carro/rosto. Foto real (agora de verdade, não placeholder). Sem carbono/metal de IA.
- 🔴 WhatsApp divergente = `[FALTA: confirmar]` no código (var `WHATS`), não chuta.
- 🔴 Sem tracinho como separador (regra do Marcelo). Sem inglês. Sem superlativo.
- Form sem servidor: monta a mensagem e abre o WhatsApp.

## Verificação (rodada 4, 12/09/2026)

- ✅ **Detector impeccable via npx (`impeccable@4.0.4`): exit 0, 0 anti-patterns.** Passou por
  correções: 26 achados iniciais (o recuo lateral estava no `.wrap` e as seções coloridas
  ficavam com padding lateral 0, disparando `cramped-padding` — movido o recuo para cada
  seção; `.bloco{padding:66px 0}` do mobile era o caso "recuo zerado só num breakpoint")
  → 8 → 5 (contraste 1,3:1 do botão dentro do menu mobile, onde `.movel a` sobrescrevia a
  cor do `.btn` deixando osso sobre amarelo; "Performance" da logo a 9,5px < piso de 11px;
  `cramped-padding` da faixa de vídeo) → **exit 0 final**. Sobram só 5 advisory de
  `numbered-section-labels` (a numeração 01→06, sequência real de autoridade, não conta como
  falha).
- ✅ **Render conferido** (Chrome headless, desktop 1440 + mobile 390 via iframe): hero (R8
  real + texto), cobertura, prova (curva + 6 casos com foto), faixa de vídeo, serviços (6
  cards com foto), estrutura (BMW M2), projetos (galeria de 7 carros), CTA amarelo, quem faz
  (sócios reais), confiança, orçamento (form + card da oficina). Mobile responde certo, sem
  estouro horizontal, texto legível.
- ✅ **Contadores de ganho confirmados** com `--force-prefers-reduced-motion`: +56/+52/+48/
  +33/+29/+21 whp, com antes/depois batendo os números reais de `conteudo-real.md`. Fallback
  no HTML já traz o número real (se o JS falhar, mostra +56, não +0). ⚠️ No headless a
  animação `requestAnimationFrame` trava e mostra valor intermediário — é artefato do render,
  não do site.
- ✅ **Peso:** ~1,85 MB de assets (vídeo da faixa 540 KB, 13 fotos WebP). Dobra inicial
  (hero + fontes) ~200 KB; o resto é `loading="lazy"`.
- ✅ **Sem tracinho**, sem inglês, sem promessa. Números do dyno reais. Fotos reais (zero IA).
- 🔴 **Pendências que travam a versão final** (do cliente): confirmar o WhatsApp de
  atendimento; foto de hero em alta e sem marca d'água de terceiro (a atual do Instagram tem
  "TurboGVibe" no vidro); autorização de reuso dos números de dyno e das fotos dos carros dos
  clientes; 3 reviews reais do Google para a seção de confiança (hoje é só a nota 5,0★).

---

# RODADA 5 — hero com vídeo de fundo cinematográfico (APLICADA, 12/09/2026)

> Decisão do Marcelo: trocar o hero estático (foto do R8) por **vídeo de fundo
> cinematográfico**, montado com os vídeos REAIS do Instagram deles (em `../assets/`),
> pra passar a essência da Mullsanni (movimento, oficina, dyno, pista) já na 1ª tela.
> Alinha com o molde do concorrente **Bravus Performance** (`referencias/bravus-performance.md`,
> estudado no mesmo dia): telemetria/movimento no hero, prova encenada. ✅ **Aplicada ao
> `index.html`** em 12/09 (o `<video>` do `hero-loop.mp4` no lugar da `<img>` do R8), com
> poster e fallback de reduced-motion. Verificação abaixo.

## Por que faz sentido aqui

O hero hoje é foto do R8 (real, boa, mas parada). Num negócio cujo produto é **potência e
movimento**, vídeo de fundo entrega a essência sem uma palavra a mais — e o CSS já prevê:
`.hero-media video` existe (linha ~93 do `index.html`), com véu `.hero-media::after` por
cima pra legibilidade. É trocar a `<img>` do `.hero-media` por `<video>`, baixo esforço.

## Inventário dos 6 vídeos (medido em 12/09, specs reais)

Fonte em `../assets/*.mp4`. Frame de referência de cada um em `../assets/frames-referencia/`.

| Apelido | Formato | Dur. | Peso | O que mostra | Serventia |
|---|---|---|---|---|---|
| vid1 `AQM-Qqf` | 720×1280 vert | 15,7s | 3,0M | Esportivo em **pista/arrancada noturna**, cones, holofotes | clima escuro cinematográfico |
| vid2 `AQMLJPi` | 720×1280 vert | 53,5s | 11M | Interior de **Subaru STI** | ⚠️ **legenda queimada "PRA UM STI"** — não usar em fundo |
| vid3 `AQMPeUJ` | 720×900 | 23,4s | 1,6M | **Escapamento de inox** por baixo (Nova Racing) | prova de serviço, cru |
| vid4 `AQOJ_X1` | **1276×720 HORIZ** | 13,2s | 2,3M | Close do **farol do GR vermelho molhado**, reflexo | ✅ **único horizontal → fundo desktop** |
| vid5 `AQOhWyI` | 720×1280 vert | 42,2s | 7,1M | **Jordan (sócio) trabalhando no GR vermelho**, capô aberto | ✅ founder-led → fundo mobile |
| vid6 `AQPGBoP` | 360×640 vert | 62s | 2,9M | Carro no **dinamômetro**, técnico com laptop, logo MP | prova-assinatura, mas res baixa |

## Direção de montagem (curadoria do Marcelo)

- **Desktop:** `vid4` é a escolha quase forçada (único landscape, limpo, cor forte). **Já
  otimizado e pronto em `assets/hero-loop.mp4`** (1280×720, mudo, H.264 faststart, 1,9 MB) +
  `assets/hero-poster.webp` (frame de partida, 15 KB).
- **Mobile:** `vid5` é o melhor (proporção vertical certa, founder + carro + oficina, boa
  res). Ainda não recortado/otimizado — fazer se for adotar dois fontes por breakpoint.
- **Se virar colagem cinematográfica** (o "juntar de forma que fique cinematográfico"): a
  sequência que conta a história é detalhe do carro (vid4) → trabalho na oficina (vid5) →
  escape de inox (vid3) → dyno (vid6, se a res aguentar em faixa pequena) → pista noturna
  (vid1). **Cortes secos, 2–3s cada, mudo, com leve dessaturação** pra não brigar com o
  amarelo. **vid2 fica de fora** (legenda queimada). ffmpeg está disponível na máquina.

## Travas técnicas do vídeo de fundo (pra não virar erro)

1. **Legibilidade primeiro:** véu obrigatório sobre o vídeo (o `.hero-media::after` já
   existe). Rodar o detector (`low-contrast`) contra o frame mais claro do loop — se
   reprovar, escurece o véu, não clareia o texto.
2. **Performance/LCP:** `poster` estático carrega antes; `<video autoplay muted loop
   playsinline preload="metadata">`. Manter o arquivo leve (o de desktop já está em 1,9 MB).
3. **Mobile:** autoplay de vídeo custa dados/bateria e landscape fica ruim em retrato.
   Fallback: no mobile, ou o `vid5` vertical, ou cair pro `hero-poster`/foto do R8. Decidir
   ao montar.
4. **`prefers-reduced-motion`:** pausar o vídeo e mostrar o poster (já é regra da casa).
5. **Áudio sempre mudo** (autoplay exige, e som em autoplay é antipadrão).
6. 🔴 **Zero IA** — n/a aqui, os vídeos são reais do carro/oficina deles. Mantido.
7. 🔴 **Direitos:** os vídeos são do Instagram deles → o reuso público entra na MESMA
   pendência de autorização das fotos/números de dyno (ver abaixo). Alguns têm marca d'água
   de terceiro no canto — conferir antes de publicar.

## Wiring aplicado (12/09/2026)

Dentro de `.hero-media`, a `<img>` do R8 virou
`<video id="hero-video" autoplay muted loop playsinline preload="metadata"
poster="assets/hero-poster.webp"><source src="assets/hero-loop.mp4" type="video/mp4"></video>`.
O resto do hero (H1, slogan, prova, véu) não mudou. O bloco de motion (JS) ganhou o
tratamento de reduced-motion: se o usuário pede menos movimento, tira o `autoplay` e dá
`pause()`, deixando só o poster. A foto anterior segue em `assets/hero-r8.webp` (fallback
de reversão).

## Verificação (rodada 5, 12/09/2026)

- ✅ **Detector via npx (`impeccable@4.0.4`): exit 0, 0 anti-patterns.** Só os 5 advisory de
  `numbered-section-labels` de sempre (a sequência 01→06 é autoridade real, decisão mantida).
- ✅ **Render conferido** (Edge headless, desktop 1440 + mobile 480): o poster/frame do vídeo
  (GR vermelho na oficina) entra no fundo, e o H1 branco+amarelo, a lede, a barra de prova
  (+56 whp · 5,0★ · 8 marcas) e os dois CTAs ficam legíveis sobre o véu, sem estouro
  horizontal. O véu forte da esquerda (já existente) segura o contraste mesmo no frame com o
  portão iluminado à direita, onde não há texto.
- ✅ **Peso do hero:** `hero-loop.mp4` 1,9 MB (`preload="metadata"`, então não bloqueia o 1º
  paint), poster `hero-poster.webp` 15 KB é o LCP provável.
- 🔴 **Pendências herdadas:** o vídeo é recorte do Instagram deles (1276×720) — a versão
  final pede material em alta e a **autorização de reuso dos vídeos** (com conferência de
  marca d'água de terceiro), já na lista de pendências do `CLAUDE.md`.
- ⚠️ **Em aberto pra decidir vendo no navegador:** fundo mobile continua o mesmo `hero-loop`
  horizontal (cover corta as laterais e funciona); se quiser o `vid5` vertical (Jordan no GR)
  só no mobile, é preparar o segundo arquivo e trocar por `<source media>` ou JS.
