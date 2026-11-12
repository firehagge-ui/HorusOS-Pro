---
name: carrossel
description: >
  Central de post e carrossel do Instagram (e TikTok/LinkedIn): da pauta à peça pronta, com duas
  aprovações do Marcelo antes do primeiro slide (os temas e o esboço). Lê a pauta que o Mídia
  pesquisa toda quinta (ou monta uma), faz o esboço de cada post (texto, imagem e layout slide a
  slide), gera as imagens no ChatGPT, renderiza HTML em PNG via Playwright, roda o checklist e o
  detector, e entrega a legenda. Também estuda post ou reel de referência
  (engenharia reversa de gancho e estrutura). Use quando o Marcelo pedir "carrossel", "post",
  "conteúdo pro instagram", "ideia de post", "pauta da semana", "o que postar", "estuda esse
  post/reel", "gancho", "legenda", "post educativo", ou /carrossel.
---

# /carrossel: da pauta ao post pronto

**Primeiro o esboço, depois o carrossel. Duas aprovações do Marcelo, e nenhum slide nasce antes da segunda
(28/10/2026):**

1. **Temas da semana** (Passo 0): o 📣 Mídia pesquisa sozinho toda **quinta às 8h** e deixa a pauta em
   `marketing/conteudo/midia/pautas/<segunda>.md`. Mostrar a tabela curta, com a recomendação. Espera o ok, mesmo
   que as ideias já tenham sido aprovadas numa pauta antiga.
2. **Esboço de cada post** (Passos 1 a 3): capa, slide a slide com função, texto exato, imagem (print, réplica da
   tela, obra, diagrama) e layout, mais a referência olhada e o que muda em relação ao post anterior. Espera o ok.
3. **Slides** (Passos 4 a 9), só com o esboço aprovado.

Origem: em 28/10 o Marcelo reprovou os três posts da semana de 26/10, montados direto a partir de uma pauta
aprovada duas semanas antes, sem que ele visse texto, imagem nem layout. Em 29/10 ele aprovou o formato da pauta
nova ("Amei seus temas!!").

**Desde 03/11/2026 o caminho comum é automático:** o Farejador pesquisa a pauta (quinta 8h), o Marcelo aprova os temas e o
esboço no painel (Instagram › Semana) e o Farejador gera imagens e slides sem sessão aberta. Esta skill fica para o que a
série automática não faz (print real de tela, diagrama em código, layout novo) e para ajuste fino. Detalhe no `CLAUDE.md` do Hounder.

**Mapa de tudo que é Instagram** (doutrina, referências, ferramentas, agentes, posts antigos): `_memoria/conteudo/README.md`.
**Quem faz cada etapa** (Claude, Mídia, Agy, Codex) e as **rotas de imagem e vídeo** (ChatGPT pelo Chrome, pelo Codex
ou pelo Agy; Google Flow pra vídeo): `_memoria/conteudo/30-quem-faz-o-que.md`.

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
4b. `_memoria/conteudo/20-direcao-de-arte.md`: moldura fixa e mundo variável, a imagem que mostra a ideia,
   catálogo de linguagens, a ficha de direção de arte (23/10/2026). Se a imagem sai do ChatGPT, também
   `_memoria/conteudo/25-imagem-no-chatgpt.md`
4c. `_memoria/conteudo/30-quem-faz-o-que.md`: o fluxo, quem entra em cada etapa, as rotas de imagem e vídeo
5. **Peça da Horus:** `identidade/social/perfil.md` (público, pilares, voz, o que nunca vai ao ar)
   e `identidade/social/referencias/2026-10-07-essencia.md` (a direção que o Marcelo quer)
6. **Peça de cliente:** `clientes/<nome>/briefing.md` e `marca.md`; compliance trava

## O padrão da casa (o que o Marcelo ensinou de 07 a 15/10/2026)

Ler antes de tudo. É o que separa o post que ele aprova do que ele reprova. Origem e porquê de cada item em
`_memoria/conteudo/90-antipadroes.md`.

**Tema**
- **O teste é: o Marcelo, como dono de negócio, salvaria isso?** "Eu já sabia" ou "isso eu resolvo sozinho" =
  genérico, não vai (o "5 coisas pra pedir pro ChatGPT" foi reprovado por isso, 15/10).
- **O que ele elogiou em 15/10:** "adorei como você montou tudo, tá muito bonito" (as capas com ilustração do
  ChatGPT na mesma conversa, os cartões com print real, o par ✕/✓ com destaque) e "gostei demais" da bio (o recurso
  que quase ninguém usa, com a fonte). Desde 20/10 o visual também reprova quando se repete (ver Visual abaixo).
  **03/11:** aprovou o esboço do "5 chatices" na segunda versão ("gostei do que você fez"). O que funcionou: tabela
  slide a slide com texto exato, a referência olhada (@luizacureau, dois cartões lado a lado) e o plano das seis imagens
  do ChatGPT antes de gerar qualquer uma. Repetir esse formato de esboço.
- **Tema que todo mundo já sabe vira ângulo de uso** (28/10): "negrito, lista e citação" não; "como usar melhor o
  negrito e a citação no SEU WhatsApp Business", sim. A curiosidade do original ("7 códigos que quase ninguém usa")
  tem que sobreviver na nossa versão.
- O que ele aprovou: a frase pronta pra uma cena de cliente ("Quanto custa?"), o recurso que quase ninguém usa (a bio
  com 5 links e botão de WhatsApp), o achado de um perfil que bombou refeito pro dono daqui.
- O que ele não quer: tema de Google repetido, post sobre o método da Horus, isca "comenta PALAVRA" (sem bot de DM).
- **Fonte de ideia nova:** os perfis em `identidade/social/referencias/perfis.md` (aqui e na gringa). Antes de propor
  pauta, olhar o que fugiu da média neles.

**Escrita**
- **Imperativo e convicção, sem freio** (03/11, "nunca esquecer"): "Mande um segundo oi para o cliente. Quem não
  insiste deixa a venda para quem é insistente!". Nada de "um pouco", "pode", "às vezes", "costuma", "ou seja:",
  vírgula encaixada nem explicação depois da regra. Regra e exemplo em `_memoria/preferencias.md` ("Como escrever").
- **Capa se entende de relance** (28/10): até 10 palavras, uma ponta de curiosidade, sem linha de apoio que precise
  ser lida. Se a pessoa tem que parar e ler com calma, a capa falhou.
- **Introdução antes do passo** (28/10): o slide 2 situa a cena e o problema (onde fica, que bagunça resolve); só
  depois vem o "faça assim". Nunca chegar mandando fazer como se o leitor já tivesse o contexto.
- Frase inteira, com o verbo que diz o que fazer, como ele fala: "A bio **deve** responder três perguntas", nunca
  manchete comprimida. Um dado por frase.
- Gancho pergunta a cena e abre a hipótese, sem afirmar causa única ("...e sumiu? Talvez o problema não seja o preço").
- Regra vira orientação com condição ("quando fizer sentido, até três opções").
- A frase mais forte do post ganha slide próprio, pouco texto, contraste alto.
- Exemplo do par ✕/✓ enxuto, com só os elementos que ensinam destacados (no preço: valor, o que inclui, a pergunta).
- CTA pede uma situação vivida ("qual pergunta de cliente mais te deixou sem resposta?") ou o envio ("manda pro amigo
  que..."). Fala humana: `.claude/skills/prospeccao/references/fala-humana.md`.

**Conteúdo**
- Cada slide do miolo traz algo que o dono não sabia ou uma frase que ele vai copiar. Slide que só repete é cortado.
- Todo fato com fonte conferida no dia, na linha do slide; exemplo inventado leva a etiqueta "exemplo".

**Visual (todas as marcas, 23/10/2026)**
- **Nunca o visual do post anterior.** O do cliente que volta (20/10) foi reprovado por repetir capa e sequência
  do "Seu próximo cliente ainda não te segue". A moldura da marca fica; a linguagem e o mundo visual mudam.
- **Coisa visual que mostra a ideia** em cada slide do miolo (objeto, interface, diagrama, cena); enfeite não conta.
  Post que ensina ferramenta mostra a tela dela: print real ou réplica fiel em HTML, nunca objeto 3D genérico
  (caixa de presente pro catálogo foi reprovada em 28/10).
- **As séries prontas do Mídia ("escuro" e "tweet") não podem sair em dois posts seguidos** (28/10: o "Não sabe o que
  postar" e o "4 ferramentas" saíram iguais).
- **Fala direta**: a frase que o dono diria no balcão, nada de pergunta abstrata na capa.

**Visual (Horus)**
- Assina o avatar da Horus, nunca rosto. 1080 × 1440. Formatos que funcionaram: antes/depois de fala (escuro), print
  de tweet (branco), lista de cartões (claro, borda e sombra deslocada azul).
- Capa com ilustração do ChatGPT pelo Chrome, sempre na mesma conversa pra manter o estilo (balão, estrela, etiqueta).
- Print de verdade quando o post fala de ferramenta.
- Fundo chapado: **sem brilho azul no canto, sem barra grossa de um lado só, sem brilho colorido**. Destaque é fundo
  tingido com borda fina.

**Distribuição (fato de 19/10/2026)**
- Os cinco primeiros posts alcançaram 2 a 3 contas cada, com zero salvamento e zero envio: o perfil ainda não chega em
  quem não segue. Formato bom não resolve sozinho. Cada post leva junto um jeito de chegar em gente nova (story,
  repost do Antônio e do Marcelo, colaboração, ou o post de contraste que vira anúncio, tarefa de 06/11).
- A cadência trava na aprovação: post que não foi aprovado até a véspera perde a data (o do ChatGPT perdeu). Avisar o
  Marcelo na véspera, com a folha, em vez de deixar na tela Semana.

**Antes de mostrar**
- Render com `ferramentas/social/bin/render-carrossel.mjs`, folha da série olhada, detector `npx impeccable@4.8.2`
  (três regras dele não valem pra carrossel, ver `90-antipadroes.md`), checklist, até 5 hashtags.
- Gravar em `social_posts` como `revisao` e mandar a folha pro Marcelo. Ele aprova na tela Semana.

## Referências desta skill (abrir no passo que pede)

| Arquivo | Quando |
|---|---|
| `references/pauta.md` | Passo 0: de onde sai o tema e como a ideia é aprovada |
| `references/algoritmo.md` | Passo 1: objetivo do post (enviar, salvar, comentar, seguir) e limites técnicos |
| `references/ganchos-e-estruturas.md` | Passos 2 e 3: fórmulas de gancho, espinha dos slides, estruturas prontas, legenda, séries |
| `references/gatilhos.md` | Passo 3: gatilho mental com trava ética |
| `../prospeccao/references/fala-humana.md` | Passo 3: guia único de fala humana da casa, com a parte de post (desde 03/11/2026) |
| `references/estudar-referencia.md` | Quando chegar link de post/reel ou a pauta pedir "o que está funcionando" |

Mentes pra profundidade, sem rito: Cialdini (gatilho), Hormozi (oferta), Voss (frase de objeção)
via `/consultar`. Personas de copy (Ogilvy, Schwartz, Halbert) na prateleira
`_biblioteca/squads/copy-master/`, consulta sob demanda.

---

## Passo 0: Pauta (nada se monta sem ideia aprovada)

Regra do Marcelo (08/10/2026). **Primeiro, ler a pauta mais nova** em `marketing/conteudo/midia/pautas/`
(a da rotina de quinta do Mídia; o radar com as folhas fica em `<segunda>-radar/`). Antes de mostrar, atacar a
pauta: tema que ele já recusou em pauta antiga, fonte não conferida, dois temas do mesmo assunto, e dar a minha
recomendação (em 28/10 o Mídia recomendou um tema que estava numa pauta que o Marcelo achou fraca).

Se não existe pauta da semana ou ele pede outra, montar aqui por `references/pauta.md`: radar
(`ferramentas/social/bin/referencias.mjs`), nota, travas, 5 a 7 ideias com gancho, formato, objetivo, fonte e
risco, as 3 melhores recomendadas. Salvar em `marketing/conteudo/midia/pautas/<segunda>.md`,
criar ou atualizar a tarefa no Hounder e mostrar a tabela curta no chat.

**CHECKPOINT:** o Marcelo aprova, troca ou pede mais. Produzir só as aprovadas. Se ele
apontar um tipo que gostou, puxar a próxima pauta pra esse lado e anotar. Mesmo com ideias aprovadas
numa pauta antiga, **os temas de cada semana voltam pra ele** antes do esboço (28/10/2026). Marcar a escolha dele
no topo do arquivo da pauta (o Mídia só trata como aprovada a pauta sem "ESPERANDO APROVAÇÃO" no título).

## Passo 1: Entender

1. Marca e estilo: Horus parte de `identidade/social/carrossel-referencia.html` e do perfil §8;
   cliente com `marca.md` usa a dele; sem estilo definido, `identidade/catalogo-estilos.md`
   (sugerir 1 ou 2 e perguntar). Sempre UM estilo; a marca vence o estilo.
2. **Formato narrativo** (um dos nove). Se dois servem, o que a marca menos usou nas últimas semanas.
3. **Objetivo único** do post (`references/algoritmo.md`): enviar, salvar, comentar ou seguir.
   Pergunta-filtro: alguém mandaria pra um amigo específico, ou salvaria pra usar depois?
4. Tipo: carrossel (2 a 10), post único (ideia de menos de 4 pontos) ou story.

## Passo 1b: Referência visual (antes do texto, toda vez)

Pedido do Marcelo (23/10/2026): olhar um carrossel que funcionou e seguir a organização e o layout, mesmo
que o tema seja outro. Instagram se vê pelo Playwright, com o Chrome logado dele quando precisar de mais.

1. `node ferramentas/social/bin/referencias.mjs perfil <handle>`: 12 posts recentes, curtidas, outlier.
   `... post <codigo> <pasta>`: baixa os slides pelo embed e monta `folha.jpg`. Contas e posts já estudados:
   `_memoria/conteudo/referencias/` e `identidade/social/referencias/perfis.md`.
2. O acesso sem login corta depois de 1 ou 2 perfis (grade vazia). Aí: grade pelo Chrome logado do Marcelo,
   em ritmo de leitura, e o download continua pelo embed. Perfil que esconde curtida (@brun0gpt): ler a página
   do post pela sessão dele. Nunca curtir, seguir, comentar nem mandar DM; 429 = parar e esperar.
3. Escolher 1 ou 2 posts e anotar na ficha (passo 3): conta, código, o que vou seguir (ordem, layout,
   densidade) e o que não vou levar.

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
5. **Passe de fala humana:** `.claude/skills/prospeccao/references/fala-humana.md`.
   Teste de trocar o nome da marca pelo do concorrente.
6. Passar pelo `90-antipadroes.md`.
7. **Ficha de direção de arte** (`_memoria/conteudo/20-direcao-de-arte.md` §6): linguagem, metáfora central,
   moldura da marca, mundo deste post, o que muda em relação ao post anterior (citar qual), referência olhada,
   e o roteiro slide a slide com função, layout, texto exato e imagem.

**CHECKPOINT (o esboço):** texto completo **e ficha de direção de arte** aprovados antes do visual. Mostrar
como esboço legível: uma linha por slide com função, texto exato, imagem (de onde vem e por qual rota) e layout.
Sem esse ok, nada de ChatGPT, HTML ou render. Guardar o esboço aprovado em `<post>/esboco.md`: é ele que guia as
imagens, os slides e a conferência final (e o Agy, quando ele montar).

## Passo 4: Imagem e elementos visuais

**Rotas** (detalhe e quando usar cada uma em `_memoria/conteudo/30-quem-faz-o-que.md` §3; o ChatGPT gera as
melhores imagens, Marcelo 29/10): A) Claude in Chrome no ChatGPT do Marcelo, o padrão e a única que usa as Fontes do
projeto da marca; B) `codex exec` no terminal, sem Chrome; C) o Agy com Playwright num Chrome logado no ChatGPT (em
teste desde 29/10); D) gerador nativo do Agy, só pra textura. **Vídeo curto** (Reels): Google Flow, mesmas travas da
imagem (§5 do mesmo arquivo).

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

### Slide inteiro no ChatGPT (o jeito da May, 23/10/2026)

Quando o slide todo sai do ChatGPT (texto e cena juntos), seguir `_memoria/conteudo/25-imagem-no-chatgpt.md`:
plano aprovado antes, conversa nova **dentro do projeto da marca** (as Fontes têm as referências visuais),
roteiro inteiro colado no primeiro pedido, slide âncora, lista de preservação repetida a cada slide, texto entre
aspas, zoom no texto pequeno e folha da série. Pintura com nu é bloqueada: modo híbrido (cena gerada, obra e
texto pelo código).

## Passo 5: Sistema de design (antes do primeiro HTML)

Escrever antes de abrir o editor: até 5 cores (primária, secundária, destaque, fundo, texto),
fonte e escala, espaçamento, raio, o elemento gráfico recorrente. Cliente sem identidade de
carrossel travada: **3 identidades distintas**, slide 1 de cada em PNG lado a lado; a escolhida
vira `clientes/<nome>/carrossel-referencia.html` e entra no `marca.md`. Com identidade travada,
pular.

**Com o cliente (oráculo, 07/11/2026, `_conhecimento/network/alinhamento-visual-com-cliente.md`):** nunca perguntar
"como você quer?" a seco. Ele recebe as 3 capas do mesmo post (imagem real, editorial, dor e solução) e **um carrossel
modelo completo** para aprovar o padrão. O mês só se produz depois desse ok.

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
2. **Detector:** `npx --yes impeccable@4.8.2 detect "<pasta>/carrossel.html"`. O detector local
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

## Passo 10: Depois de publicar

O Mídia coleta as métricas. O que conta é **envio e salvamento**, não curtida. Post que fugiu da
média vira aprendizado (`ferramentas/social` → Aprendizados) e pauta da próxima semana. Formato
que funcionou fica de 7 a 10 posts antes de trocar.

---

## Regras

- Primeiro o esboço, depois o carrossel: temas aprovados (Passo 0) e esboço aprovado (Passo 3) antes de qualquer imagem
- Referência visual olhada antes do texto (Passo 1b); ficha de direção de arte aprovada com o texto
- O agente que produziu não confere o próprio trabalho: a conferência final é do Claude e do código
- Nunca repetir capa nem sequência de layouts do post anterior da marca
- Um formato, um objetivo, um estilo, um CTA por post
- Todo número com fonte conferível no slide; exemplo marcado "exemplo"; nada inventado
- Slide 1 é promessa com ponta solta; melhor ponto cedo; nunca encher slide
- Piso de 34px no corpo, nada de leitura abaixo de 24px
- Imagem de IA só em ilustração e elemento; nunca gráfico com número, print, rosto ou o que o cliente vende
- Renderizar e olhar o slide 1 antes do lote; folha da série antes de mostrar
- Checklist + detector antes de dizer que está pronto
- Até 5 hashtags; legenda sem link e sem travessão
- Correção do Marcelo vira linha em `_memoria/conteudo/90-antipadroes.md` com o porquê
