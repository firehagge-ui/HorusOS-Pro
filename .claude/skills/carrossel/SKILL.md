---
name: carrossel
description: >
  Central de post e carrossel do Instagram (e TikTok/LinkedIn): da pauta à peça pronta. Monta a
  pauta de ideias por tendência pra aprovação, escolhe formato e gancho, escreve com fala humana,
  gera elementos visuais no ChatGPT pelo Chrome, renderiza HTML em PNG via Playwright, roda o
  checklist e o detector, e entrega a legenda. Também estuda post ou reel de referência
  (engenharia reversa de gancho e estrutura). Use quando o Marcelo pedir "carrossel", "post",
  "conteúdo pro instagram", "ideia de post", "pauta da semana", "o que postar", "estuda esse
  post/reel", "gancho", "legenda", "post educativo", ou /carrossel.
---

# /carrossel: da pauta ao post pronto

Tema aprovado → formato → gancho → texto com fala humana → imagem → sistema de design → HTML →
PNG → checklist → legenda. Atualizada em 10/10/2026 juntando o que a casa já tinha com
`sergebulaev/instagram-skills`, `coreyhaines31/marketingskills` (social, marketing-psychology),
`bradautomates/head-of-content` e `petrogurcak/skills`. Do que é de fora, veio o raciocínio;
**as travas da casa vencem** (compliance > integridade > marca > conteúdo > terceiro).

## Leitura obrigatória antes da primeira linha de copy

1. `_memoria/conteudo/00-formatos.md`: os nove formatos narrativos. **Escolher UM antes de escrever**
2. `_memoria/conteudo/10-legibilidade.md`: pisos de fonte, contraste e densidade
3. `_memoria/conteudo/90-antipadroes.md`: o que denuncia post feito por IA (correções do Marcelo)
4. `_memoria/integridade.md`: dado que falta vira `[FALTA: ...]`, nunca texto plausível
5. **Peça da Horus:** `identidade/social/perfil.md` (público, pilares, voz, o que nunca vai ao ar)
   e `identidade/social/referencias/2026-10-07-essencia.md` (a direção que o Marcelo quer)
6. **Peça de cliente:** `clientes/<nome>/briefing.md` e `marca.md`; compliance trava

## O padrão da casa (o que o Marcelo ensinou de 07 a 15/10/2026)

Ler antes de tudo. É o que separa o post que ele aprova do que ele reprova. Origem e porquê de cada item em
`_memoria/conteudo/90-antipadroes.md`.

**Tema**
- **O teste é: o Marcelo, como dono de negócio, salvaria isso?** "Eu já sabia" ou "isso eu resolvo sozinho" =
  genérico, não vai (o "5 coisas pra pedir pro ChatGPT" foi reprovado por isso, 15/10).
- O que ele aprovou: a frase pronta pra uma cena de cliente ("Quanto custa?"), o recurso que quase ninguém usa (a bio
  com 5 links e botão de WhatsApp), o achado de um perfil que bombou refeito pro dono daqui.
- O que ele não quer: tema de Google repetido, post sobre o método da Horus, isca "comenta PALAVRA" (sem bot de DM).
- **Fonte de ideia nova:** os perfis em `identidade/social/referencias/perfis.md` (aqui e na gringa). Antes de propor
  pauta, olhar o que fugiu da média neles.

**Escrita**
- Frase inteira, com o verbo que diz o que fazer, como ele fala: "A bio **deve** responder três perguntas", nunca
  manchete comprimida. Um dado por frase.
- Gancho pergunta a cena e abre a hipótese, sem afirmar causa única ("...e sumiu? Talvez o problema não seja o preço").
- Regra vira orientação com condição ("quando fizer sentido, até três opções").
- A frase mais forte do post ganha slide próprio, pouco texto, contraste alto.
- Exemplo do par ✕/✓ enxuto, com só os elementos que ensinam destacados (no preço: valor, o que inclui, a pergunta).
- CTA pede uma situação vivida ("qual pergunta de cliente mais te deixou sem resposta?") ou o envio ("manda pro amigo
  que..."). Fala humana: `references/fala-humana.md`.

**Conteúdo**
- Cada slide do miolo traz algo que o dono não sabia ou uma frase que ele vai copiar. Slide que só repete é cortado.
- Todo fato com fonte conferida no dia, na linha do slide; exemplo inventado leva a etiqueta "exemplo".

**Visual (Horus)**
- Assina o avatar da Horus, nunca rosto. 1080 × 1440. Formatos que funcionaram: antes/depois de fala (escuro), print
  de tweet (branco), lista de cartões (claro, borda e sombra deslocada azul).
- Capa com ilustração do ChatGPT pelo Chrome, sempre na mesma conversa pra manter o estilo (balão, estrela, etiqueta).
- Print de verdade quando o post fala de ferramenta.
- Fundo chapado: **sem brilho azul no canto, sem barra grossa de um lado só, sem brilho colorido**. Destaque é fundo
  tingido com borda fina.

**Antes de mostrar**
- Render com `ferramentas/social/bin/render-carrossel.mjs`, folha da série olhada, detector `npx impeccable@4.0.4`
  (três regras dele não valem pra carrossel, ver `90-antipadroes.md`), checklist, até 5 hashtags.
- Gravar em `social_posts` como `revisao` e mandar a folha pro Marcelo. Ele aprova na tela Semana.

## Referências desta skill (abrir no passo que pede)

| Arquivo | Quando |
|---|---|
| `references/pauta.md` | Passo 0: de onde sai o tema e como a ideia é aprovada |
| `references/algoritmo.md` | Passo 1: objetivo do post (enviar, salvar, comentar, seguir) e limites técnicos |
| `references/ganchos-e-estruturas.md` | Passos 2 e 3: fórmulas de gancho, espinha dos slides, estruturas prontas, legenda, séries |
| `references/gatilhos.md` | Passo 3: gatilho mental com trava ética |
| `references/fala-humana.md` | Passo 3: vícios de IA específicos de post (junto com `_memoria/prospeccao/90-cara-de-ia.md`) |
| `references/estudar-referencia.md` | Quando chegar link de post/reel ou a pauta pedir "o que está funcionando" |

Mentes pra profundidade, sem rito: Cialdini (gatilho), Hormozi (oferta), Voss (frase de objeção)
via `/consultar`. Personas de copy (Ogilvy, Schwartz, Halbert) na prateleira
`_biblioteca/squads/copy-master/`, consulta sob demanda.

---

## Passo 0: Pauta (nada se monta sem ideia aprovada)

Regra do Marcelo (08/10/2026). Se o pedido chega sem tema aprovado, montar a pauta por
`references/pauta.md`: radar, nota, travas, 5 a 7 ideias com gancho, formato, objetivo, fonte e
risco, as 3 melhores recomendadas. Salvar em `marketing/conteudo/midia/pautas/<segunda>.md`,
criar ou atualizar a tarefa no Hounder e mostrar a tabela curta no chat.

**CHECKPOINT:** o Marcelo aprova, troca ou pede mais. Produzir só as aprovadas. Se ele
apontar um tipo que gostou, puxar a próxima pauta pra esse lado e anotar.

## Passo 1: Entender

1. Marca e estilo: Horus parte de `identidade/social/carrossel-referencia.html` e do perfil §8;
   cliente com `marca.md` usa a dele; sem estilo definido, `identidade/catalogo-estilos.md`
   (sugerir 1 ou 2 e perguntar). Sempre UM estilo; a marca vence o estilo.
2. **Formato narrativo** (um dos nove). Se dois servem, o que a marca menos usou nas últimas semanas.
3. **Objetivo único** do post (`references/algoritmo.md`): enviar, salvar, comentar ou seguir.
   Pergunta-filtro: alguém mandaria pra um amigo específico, ou salvaria pra usar depois?
4. Tipo: carrossel (2 a 10), post único (ideia de menos de 4 pontos) ou story.

## Passo 2: Ângulo e gancho

Propor **3 ângulos** (três leituras do tema, não três títulos) e, pro escolhido, **3 ganchos**
de tipos diferentes (`references/ganchos-e-estruturas.md` §2). Slide 1 é promessa com ponta
solta, funciona sozinho como post, e qualquer número dele é real e conferível.

**CHECKPOINT:** Marcelo escolhe ângulo e gancho (ou pede outros).

## Passo 3: Texto

1. Montar pela espinha (`ganchos-e-estruturas.md` §3): melhor ponto no slide 2 ou 3, um ponto
   por slide lido em 2 segundos, reflexão no penúltimo de conteúdo, resumo salvável + **um**
   pedido no último. Contagem pelo conteúdo, nunca enchimento.
2. **20 a 45 palavras por slide**, no máximo 4 linhas de corpo (sai da escala de legibilidade).
3. Gatilho só se for verdade (`references/gatilhos.md`).
4. Todo fato com fonte no próprio slide ("Fonte: ..."); exemplo inventado marcado "exemplo".
5. **Passe de fala humana:** `references/fala-humana.md` + `_memoria/prospeccao/90-cara-de-ia.md`.
   Teste de trocar o nome da marca pelo do concorrente.
6. Passar pelo `90-antipadroes.md`.

**CHECKPOINT:** texto completo aprovado antes do visual.

## Passo 4: Imagem e elementos visuais

- **Horus:** ChatGPT liberado em todo post para ilustração, objeto, textura, cena (perfil §8,
  Marcelo, 07/10/2026), **pelo Chrome do Marcelo** (método em `reference_chatgpt-imagem-pelo-chrome` na
  memória: abrir chatgpt.com, "Gere uma imagem:", baixar pelo `fetch` da imagem, cai em
  `E:\Users\hagge\Downloads`). Pedir na mesma conversa as imagens da série ("mesmo estilo e
  paleta"), sem texto, sem número, nas cores da marca.
- **Cliente:** imagem vem do Marcelo (ele gera e traz) ou do Chrome dele com o ok dele.
- **Nunca IA:** gráfico com número (número é desenhado em código a partir da fonte), print de
  ferramenta ou de conversa (print é print de verdade), rosto, o produto ou o lugar que o cliente
  vende. Elementos já aprovados ficam em `identidade/social/elementos/` e se reaproveitam.

### Consistência entre slides (a trava irmã da trava de CSS)

Objeto que precisa aparecer **igual** em vários slides **não se gera N vezes**: gera uma vez e
reposiciona o mesmo arquivo (recorte, `object-position`, escala). Série de cenas diferentes:
1. **Cena-mestra** aprovada primeiro; as outras derivam dela (edição a partir da imagem).
2. **Style lock** idêntico colado em todo prompt (paleta em hex, luz, lente, acabamento, clima).
3. **Objetos nomeados** com a mesma descrição literal em todo prompt.
4. **Conferir lado a lado** antes do lote; objeto que derivou volta pra geração.

Prompt em inglês: conteúdo do slide + objetos nomeados + style lock.

## Passo 5: Sistema de design (antes do primeiro HTML)

Escrever antes de abrir o editor: até 5 cores (primária, secundária, destaque, fundo, texto),
fonte e escala, espaçamento, raio, o elemento gráfico recorrente. Cliente sem identidade de
carrossel travada: **3 identidades distintas**, slide 1 de cada em PNG lado a lado; a escolhida
vira `clientes/<nome>/carrossel-referencia.html` e entra no `marca.md`. Com identidade travada,
pular.

### Estilo base (quando nada está definido)

- Tipo (piso de `10-legibilidade.md`): capa 90 a 110px peso 800-900 kerning -0.035em; H2 60 a
  76px; corpo **34 a 42px** peso 500; rótulo 26 a 30px caixa alta kerning aberto; rodapé e @ 24
  a 28px. **Nada de leitura abaixo de 24px.**
- Cor: fundo escuro + claro + **uma** cor de destaque. Alternar fundos; nunca dois slides
  seguidos iguais.
- Layouts: CAPA, SOLO (foto + texto), DUO, NÚMERO, CITAÇÃO, CTA FINAL, e os dos formatos novos:
  **TWEET** (avatar, nome, @, texto grande, cartão de imagem, fio cinza entre slides) e
  **PAR ✕/✓** (cartão apagado da frase comum, cartão de destaque da frase pronta, etiqueta
  "exemplo"). No mínimo 2 layouts por carrossel (o print de tweet é exceção: o padrão nativo é a
  graça, a variação vem do cartão de imagem).
- **Contador "01 / 08":** desligado por padrão (o Instagram já mostra os pontinhos). O Marcelo
  aprovou com contador o post da 1 estrela (08/10), que imitava o Finch: decisão pendente, usar só
  quando o formato copiar essa referência.
- Destaque de cartão: fundo tingido com borda fina em volta. **Sem barra grossa num lado só
  (side-tab) e sem brilho colorido (dark-glow)**: o detector pega e o Marcelo aprovou trocar (10/10).
- Sequência de capas na grade: não repetir o tipo de capa do post anterior.

## Passo 6: HTML e PNG

1. **Um único `carrossel.html`** com todos os slides como `<section class="slide">`, CSS inline,
   Google Fonts (incluir `Noto Color Emoji` quando houver emoji) como única dependência. Caminho
   de imagem relativo à pasta.
2. **Dimensão:** Horus **1080 × 1440** (3:4, aprovado 27/09); cliente **1080 × 1350** (4:5).
   TikTok/Reels 1080 × 1920 só quando pedido.
3. Render: `node ferramentas/social/bin/render-carrossel.mjs <pasta-absoluta>` (Playwright do repositório, screenshot de cada `.slide`
   em PNG (conferência) e JPEG qualidade 92 (publicação), mais miniatura a 0,25 pro painel.
   Conferir fonte carregada, imagem quebrada e texto encostando na borda. Modelo pronto:
   `ferramentas/social/lib/carrossel.mjs` (`renderizar`).
4. **Renderizar e olhar o slide 1 (o PNG, não o HTML) antes do lote.** Depois montar uma folha
   com todos (`ffmpeg ... tile=4x2`) e olhar a série inteira.

## Passo 7: Porta de qualidade

1. `_memoria/conteudo/99-checklist.md`: vetos primeiro (qualquer um reprova), rubrica depois
   (média ≥ 7, nenhum critério < 4, "para o scroll" ≤ 3 reprova sozinho).
2. **Detector:** `npx --yes impeccable@4.0.4 detect "<pasta>/carrossel.html"`. O detector local
   (`.claude/skills/impeccable/scripts/detect.mjs`) já deu "limpo" em arquivo sabidamente ruim; só vale depois de
   validado contra um arquivo ruim (`CLAUDE.md`, seção de site).
   Saída 0 limpo, 2 achou. Achado real se corrige; o que for intencional se explica ao Marcelo,
   nunca se silencia sem o ok dele.
3. Compliance do cliente trava mesmo com tudo nota 10.

Reportar com número e pendência, nunca "está pronto":
> Formato: Antes/depois de fala, 8 slides. Rubrica 7,8, menor nota 6 (C5). Vetos: nenhum.
> Detector: limpo. Pendente: `[FALTA: ...]` no slide 8.

## Passo 8: Legenda (sempre, em `legenda.md`)

Primeiros 125 caracteres funcionam sozinhos e repetem o gancho com a palavra que a pessoa
buscaria; contexto curto; o valor; **um** CTA que cita o conteúdo; **até 5 hashtags**
específicas no fim (limite do Instagram desde dez/2025). Carrossel aceita legenda curta; teto
2.200 caracteres. Sem link, sem travessão, sem isca ("comenta SIM").

## Passo 9: Salvar, entregar e publicar

```
marketing/conteudo/<pasta>/            Horus: marketing/conteudo/midia/<semana>/<slug>/
  carrossel.html   legenda.md   img/ (imagens e elementos)
  instagram/slide-NN.png + .jpg   previa.json (miniaturas)
```
- **Horus:** gravar em `social_posts` (marca `horus`, status `revisao`, pasta, slides, prévia,
  legenda, data) pra aparecer na tela Semana do Hounder; o Marcelo aprova e a rotina `publicar`
  do Farejador posta. Nunca marcar `aprovado` sem o Marcelo.
- **Cliente:** entregar a pasta e a folha de prévia; publicação conforme o combinado com ele.
- Mandar a folha de prévia pro Marcelo (`SendUserFile`).
- Opcional: oferecer a versão blog (`/publicar-tema`).

## Passo 10: Depois de publicar

O Mídia coleta as métricas. O que conta é **envio e salvamento**, não curtida. Post que fugiu da
média vira aprendizado (`ferramentas/social` → Aprendizados) e pauta da próxima semana. Formato
que funcionou fica de 7 a 10 posts antes de trocar.

---

## Regras

- Nada se monta sem ideia aprovada (Passo 0)
- Um formato, um objetivo, um estilo, um CTA por post
- Todo número com fonte conferível no slide; exemplo marcado "exemplo"; nada inventado
- Slide 1 é promessa com ponta solta; melhor ponto cedo; nunca encher slide
- Piso de 34px no corpo, nada de leitura abaixo de 24px
- Imagem de IA só em ilustração e elemento; nunca gráfico com número, print, rosto ou o que o cliente vende
- Renderizar e olhar o slide 1 antes do lote; folha da série antes de mostrar
- Checklist + detector antes de dizer que está pronto
- Até 5 hashtags; legenda sem link e sem travessão
- Correção do Marcelo vira linha em `_memoria/conteudo/90-antipadroes.md` com o porquê
