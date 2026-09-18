# Mullsanni Performance — Oficina de performance (Lauro de Freitas/BA)

> ⚠️ **FOLLOW-UP FRIO — barrado no gatekeeper em 15/09/2026.** Não entra em fila de
> produção nem contagem de contas. Aberto como lead em 07/09/2026, nunca chegou aos
> decisores. Detalhe na seção Status.

## Sobre

Oficina de preparação e manutenção de importados em Vilas do Atlântico, Lauro de Freitas.
Remap de ECU e TCU (Stage 1 e 2), escape sob medida em inox, ajustes de dirigibilidade,
teste em dinamômetro próprio. Empresa nova (aberta 09/09/2024, ~1 ano), ME, Simples,
dois sócios: **Jordan Nascimento** (fundador) e **Nelson Luis Malaquias**. Decisão
provavelmente conjunta.

CNPJ 57.200.432/0001-63. R. Itaju do Colônia, 792, Galpão 04. CNAE 45.20-0-07 + 45.30-7-03.
Representantes oficiais **ACF Performance** (calibração) e **Nova Racing** (escape/downpipe).
Instagram @mullsanniperformance ativo; Google 5,0★ com 11 avaliações; **site fora do ar**
(`mullsanniperformance.com.br` não resolve DNS); **zero anúncios** na Biblioteca da Meta.

## Origem

Marcelo viu no Bonodori em 06/09/2026. Foi pesquisar e descobriu o site morto. Prospecção
ativa da Hórus, não indicação. O sócio do Marcelo tentou prospectar um dono de bonsais no
mesmo evento e ouviu "faço tudo pelo Instagram" — a lição dessa quicada virou o playbook
de objeção abaixo.

## Status (10/09/2026)

- **Comercial:** LEAD. Nenhum contato feito com o cliente ainda. Aguardando o Marcelo
  bater na porta com a prévia do site na mão.
- **Produção:** prévia do site em **quatro rodadas** (07/09, 09/09 rodada 2, 09/09 rodada 3,
  12/09 rodada 4), pronta para apresentar. Ver `site/PLANO.md` para o passe duplo completo e o
  registro de cada rodada. A rodada 3 reconstruiu o site (visão "laboratório de precisão",
  curva do dyno como assinatura, sem etapas numeradas). ⚠️ **A rodada 4 (12/09) refez o site com
  as FOTOS E VÍDEOS REAIS do Instagram** (o Marcelo soltou o material em `assets/`) e na
  linguagem de uma **referência de landing que ele fez no ChatGPT** (`assets/Landing Page
  Automotiva Mullsanni Performance.png`): mais rico e comercial (hero split com o R8 vermelho
  real, faixa de marcas, casos de dyno **com foto do carro**, 6 cards de serviço com foto,
  galeria de projetos, CTA amarelo, faixa de vídeo real do GR, sócios de rosto na seção "quem
  faz"). 🔴 **Três coisas da referência foram corrigidas por integridade:** os números
  inventados ("+8 anos", "+500 projetos", "+98%" — a empresa tem 1 ano) viraram prova real
  (ganho de dyno, 5,0★ Google, 8 marcas, ACF+Nova Racing); a copy em inglês virou o slogan real
  "Sua paixão, nossa assinatura"; e os depoimentos inventados saíram (sem review inventado). As
  texturas de IA (carbono/metal) que ele re-colocou **não entraram** (clichê do segmento).
  Detector limpo (exit 0). Fotos ainda são 1080px do Instagram: a versão final pede foto em alta.
  - **Rodada 5 (aplicada, 12/09):** hero com **vídeo de fundo cinematográfico** (vídeo real
    do Instagram deles, `site/assets/hero-loop.mp4` 1,9 MB + `hero-poster.webp`), na linha do
    concorrente Bravus Performance (`referencias/bravus-performance.md`, estudado 12/09). A
    `<img>` do R8 virou `<video>` com poster e fallback de reduced-motion. ✅ Detector exit 0,
    render desktop+mobile com H1/prova/CTAs legíveis sobre o véu. Inventário dos 6 vídeos e
    verificação completa em `site/PLANO.md` (Rodada 5). Em aberto: fundo mobile dedicado
    (vid5 vertical) é melhoria futura, não bloqueia.
  - **Rodada 6 (aplicada, 14/09):** pacote grande do Marcelo. Estrutura enxugada para
    **Hero · Cobertura · Sobre a oficina · Dinamômetro · Projetos · Clientes(GMN) · CTA ·
    Orçamento(seletor de veículo) · Rodapé**. Removidos: a faixa de vídeo do meio, a seção
    "Por que aqui" isolada (migrou para Sobre), o slogan "Sua paixão, nossa assinatura", a foto
    dos sócios. Novos: **painel de dinamômetro estilo laudo** com o Porsche 718 GTS (+48 whp,
    giro 7800→8300, layout da imagem-referência do Marcelo); **Sobre a oficina** com tom
    artesanal (frases reais deles, sem superlativo Mansory) + foto emoldurada com bloco amarelo
    offset + pontilhados + chevrons; **Clientes (GMN)** com 5,0★ real + 3 slots `[FALTA: review]`;
    **seletor de veículo** no orçamento (o "igual ao ACF", honesto, sem cravar cavalo); rodapé
    Bravus-like com sociais. ✅ Detector exit 0 (25 anti-patterns corrigidos). Referências do
    projeto salvas em `REFERENCIAS.md` (Brabus/ABT/Manhart/ACF/Bravus + a referência do ChatGPT).
    O Marcelo pediu um **loop de refino contínuo** (revisar vs referências, lapidar, mobile,
    ideias novas). Ver `site/PLANO.md` (Rodada 6) para o passe duplo e a verificação.
  - **Passe 6 (15/09):** representante oficial ACF Performance + Nova Racing com as logos reais
    (baixadas dos sites deles, em `site/assets/parceiros/`); **configurador estilo ACF**
    (marca → modelo → painel Original/Stage), com base fechada nos 6 carros reais que o Marcelo
    mandou (substitui o formulário livre); dinamômetro no formato **"de → até"** (print 4,
    referência BMW); Audi R8 V10 5.2 FSI real (442→470 whp) no lugar de um caso que eu tinha
    inventado; Sobre a oficina refeita com **"OFICINA" vertical** (print 5) + foto à esquerda;
    avaliações em **carrossel** com nome fixo no rodapé de cada card. A Home (hero) que o
    Marcelo construiu ao vivo foi preservada — ver `site/PLANO.md` (Passe 6) para o detalhe da
    colisão de edição do dia e a regra nova sobre não presumir regressão.
- **Pendências para virar cliente:** ver seção Pendências no final.

## Status (15/09/2026) — FOLLOW-UP FRIO, barrado no gatekeeper

O Marcelo abordou pela primeira vez em 15/09/2026, com a prévia pronta. Quem respondeu
foi **Cauã**, não Jordan nem Nelson (os sócios decisores) — provável funcionário/social
media. Resposta: "Que bacana! Agradecemos pelo contato, porém possuímos nossa equipe de
marketing que já está cuidando. O site encontra-se off-line apenas temporariamente!"

**Leitura:** gatekeeper, não decisor. A alegação de "equipe cuidando" contradiz o que a
Hórus já tinha confirmado por conta (site fora do ar por DNS, zero anúncio na Biblioteca
da Meta) — indício de projeto travado, não de operação ativa. Mas isso não muda a ação:
discutir com o Cauã só queima o lead antes de chegar em quem decide.

**Decisão do Conselho** (`_conselho/logs/2026-09-15-mullsanni-gatekeeper.md`, confiança
78%): responder uma vez, curioso e caloroso, sem contestar o Cauã e sem despejar a
prévia nele. **A prévia (rodadas 1-6 do site) fica no coldre** — só sai se um dos sócios
reengajar por conta própria. Zero produção nova. Energia de volta pra Amparo Fase 1+2.

**Critério de reversão:** ABORTA se o Cauã responder de novo ou não responder nada.
REABRE (prévia sai do coldre) só se Jordan ou Nelson procurarem diretamente.

**Lição de processo:** a abordagem devia ter testado antes se quem responderia era
decisor ou porteiro (o próprio playbook de objeção abaixo já dizia "ficar curioso" —
faltou aplicar na primeira mensagem, não só depois do barramento). Card de doutrina
correspondente: `_conhecimento/network/objecao-ja-tem-alguem-fazendo.md`.

## Contato

- **Endereço:** R. Itaju do Colônia, 792, Galpão 04, Vilas do Atlântico, Lauro de Freitas, BA.
- **Horário:** Segunda a sexta, 9h às 17h. Sábado e domingo fechado.
- 🔴 **WhatsApp: DIVERGÊNCIA, confirmar antes de usar.** O Google lista
  **(71) 98693-9994** (9 dígitos, celular). A bio do Instagram aponta `wa.me/557135997963`,
  que é **(71) 3599-7963** (8 dígitos, fixo). São dois números diferentes; **não presumir
  qual é o de atendimento**. Lição da Amparo, onde o site rodou 7 dias com número errado
  por presunção do 9º dígito. Perguntar.

## Oferta em fases

Três fases, escaladas. Cada uma só entra quando a anterior provou valor. **Nada de vender
tudo junto na primeira reunião.**

### Fase 1 — Site de autoridade + Google Meu Negócio (a venda de entrada)

O que entra:
- Site de autoridade, mobile-first, dark premium com o amarelo da marca real deles.
- Casos reais de dinamômetro em painel próprio (assinatura da peça, ver `site/PLANO.md`).
- Credencial ACF Performance + Nova Racing, escudo de representante oficial.
- SEO local ("remap Lauro de Freitas", "oficina de importado Vilas do Atlântico").
- Formulário que qualifica o carro (marca, modelo, ano, motor, objetivo) e monta a
  mensagem no WhatsApp com tudo preenchido. Não existe servidor.
- Otimização do Google Meu Negócio + fluxo de captação de avaliação pós-serviço (QR).

**Preço:** **ancorar R$ 2.000** (ticket alto do setor + área nobre). Referência da rede:
projeto de entrada ~R$ 1.500 (`_conhecimento/network/precificacao-sistemas-web.md`).

**Pagamento:** 50% na entrada + 50% na entrega. 🔴 **Projeto acima de R$ 2.000 não fecha por
WhatsApp** (doutrina da casa) — precisa de reunião presencial ou call, com os dois sócios.

### Fase 2 — Régua de recompra e pós-venda (só depois do site provar)

O que entra:
- CRM leve montado sobre base pronta (não construir CRM do zero — regra da casa).
- Registro do veículo de cada cliente (marca, modelo, motor, o que foi feito).
- Régua automática de contato: 30 dias para feedback de dirigibilidade;
  180 dias para oferta de próximo passo. Quem fez Stage 1 é candidato natural
  para downpipe e Stage 2 em 4 a 6 meses.

**Preço:** **R$ 1.500 a 2.000** de setup + **R$ 250 a 350/mês**.

### Fase 3 — Tráfego pago (recorrência real)

O que entra:
- Gestão de Google Ads + Meta Ads. Zero anúncios hoje, num negócio de ticket
  R$ 1.500 a 8.000 em área nobre: é a maior alavanca de receita que existe.

**Preço:** **R$ 700 a 1.500/mês** de gestão + verba de mídia por conta do cliente.

## Abordagem

- **Gancho verdadeiro:** vi vocês no Bon Odori, fui atrás pra conhecer o trabalho e o
  site de vocês está fora do ar. Real, lisonjeiro e já demonstra o problema.
- 🔴 **NÃO usar** o pretexto "falei com um funcionário seu". A empresa tem 2 sócios, é
  falsificável na hora e queima a credibilidade no primeiro minuto. Rejeitado em 07/09.
- **Canal:** WhatsApp e Instagram servem só para *agendar*, nunca para fechar. Fechamento
  é presencial na oficina, com os dois sócios na mesa.
- **Melhor jogada:** chegar com a prévia do site no celular. Transforma "vocês querem um
  site?" em "olha como ficaria o de vocês". Está pronta em `site/index.html`.

## Playbook de objeção

**"Já tô com alguém fazendo o site":**
Não brigar, ficar curioso. Perguntar quem está tocando e se já está no ar. O domínio
morto é prova de que um site já existiu e caiu, então provavelmente é projeto travado
ou abandonado. Pergunta útil de virada: vi que vocês chegaram a ter um site e ele saiu
do ar, foi esse que travou? Se for agência séria de verdade, não torrar a ponte:
oferecer camada adjacente (GMB, tráfego), que provavelmente o outro não faz.

**"Faço tudo pelo Instagram e fecho por lá" (caso do bonsai, no mesmo Bon Odori):**
Não vender site. Perguntar o que o Instagram não cobre. Duas boas: quando alguém indica
vocês para um amigo, e o amigo joga "oficina de performance Salvador" no Google, ele
acha vocês? E se a conta cair amanhã? Já vi gente perder 10 mil seguidores num hack.
O Instagram é terreno alugado. Se der de ombros: não-fit, respeita e sai. Prospecção é
achar o que dói, não empurrar o que a gente vende.

## Travas técnicas (regras da casa que valem aqui)

1. 🔴 **Nada de "calculadora de cavalos por Stage" no site.** Cravar ganho de potência
   público é promessa de resultado num serviço que varia com combustível, hardware e
   estado do motor. O certo é **caso medido, com carro e data** (verificável). Diverge
   do relatório-base de prospecção que o Marcelo trouxe.
2. 🔴 **Nada de bot rodando dentro do número deles.** Risco de banimento do número, que
   é o caixa. Caminho: **lógica invertida** — o formulário do site qualifica e monta a
   mensagem no `wa.me`. Custo de API zero, risco zero. Mesmo motor do site da Amparo.
3. 🔴 **Não construir CRM do zero na Fase 2.** Base pronta. Doutrina da casa em
   `_conhecimento/network/`.
4. 🔴 **IA nunca no objeto que o cliente vende.** O ativo deles é carro real. Foto de
   carro por IA destrói a credibilidade — regra registrada no `CLAUDE.md` da raiz. IA
   só em elemento abstrato (textura, fundo), e mesmo assim com ressalva: na rodada 2 o
   fundo usou texturas de IA (fibra de carbono e metal); a **rodada 3 removeu as duas**
   por serem o clichê visual do próprio segmento (`_biblioteca/inspiracoes/` e o
   teardown de performance documentam isso). O carro segue sendo foto real (recorte das
   artes do Instagram deles, até chegar material em alta).
5. **Setor não é regulado** (não há CFO/CFP), mas valem promessa e superlativo: preferir
   número real (do próprio dyno deles) a adjetivo.

## Discordâncias registradas com o relatório-base

O Marcelo trouxe um relatório de prospecção inicial. Três pontos onde a Hórus discordou
e por quê:

1. "Calculadora de ganhos" — não (motivo acima).
2. "Bot de WhatsApp com triagem" — não do jeito proposto (bot dentro do número). Sim
   como lógica invertida (formulário no site, `wa.me` pré-preenchido).
3. "CRM como carro-chefe" — não. É Fase 2, depois do site provar valor.

E um buraco que o relatório ignorou: **tráfego pago**. Zero anúncios num negócio de
ticket alto em área nobre. É a maior alavanca de recorrência. Vira Fase 3.

## Sobre ACF e Nova Racing terem site próprio

Dúvida legítima do Marcelo em 07/09: se os fornecedores já têm site, precisa do da
Mullsanni? Sim, faz mais sentido ainda. O site da ACF vende software da ACF no país
inteiro; o da Mullsanni captura o lead local de "remap Lauro de Freitas". Ser
representante oficial de duas marcas com site forte é **credencial** — vira link de
prova no site da Mullsanni. Os fornecedores dão autoridade; nenhum deles converte o
cliente de Vilas do Atlântico.

## Onde salvar o quê

- `dossie-prospeccao.md` — análise da Hórus, diagnóstico e pendências.
- `conteudo-real.md` — matéria-prima capturada das artes do Instagram (marca, tom, casos
  de dyno reais, frases, serviços). É a fonte do site.
- `site/` — prévia do site pronta para apresentar. `site/PLANO.md` tem o passe duplo e
  o registro da rodada 2 (o que estava errado e como foi corrigido).
- `assets/` — logo em alta, artes originais do Instagram, texturas de IA. Fonte, não
  entrega. As versões usadas pelo site vivem em `site/assets/` já em WebP.

## Contexto que herda da raiz

- `CLAUDE.md` da raiz: fluxo geral, doutrina do impeccable, sistema de design.
- `_memoria/design/` inteiro antes de qualquer HTML (obrigatório). Quatro entradas novas
  em `90-antipadroes.md` datadas de 09/09 nasceram desta rodada e valem para qualquer
  site futuro (coluna morta, foto escondida sob véu, especificidade de hero engolindo
  media query, `detect.mjs` empacotado sendo no-op silencioso).
- `_memoria/integridade.md` antes de escrever qualquer coisa sobre o cliente.
- `_conhecimento/network/precificacao-sistemas-web.md` para régua de preço (uso interno,
  nunca em peça do cliente).
- `referencias/belloni-motors-seminovos.md` (gêmeo mais próximo — concessionária pequena
  brasileira, dark premium, card que gera `wa.me`) e
  `referencias/performance-automotiva-cinco-sites.md` (acervo do gênero).

## Verificação (obrigatória antes de entregar)

Neste clone, o `node .claude/skills/impeccable/scripts/detect.mjs` é um **no-op silencioso**
(exit 0 até em arquivo propositalmente ruim). Só o fallback via `npx --yes impeccable@4.0.4
detect ...` detecta de verdade. **Usar sempre o npx**. Registrado em
`_memoria/design/90-antipadroes.md`.

## Pendências para virar cliente

- [ ] 🔴 **Confirmar o WhatsApp de atendimento** (divergência acima).
- [ ] Confirmar quem decide (Jordan + Nelson juntos, provavelmente).
- [ ] Autorização de reuso público dos números de dyno específicos, das fotos e **dos vídeos**
  (o hero da rodada 5 usa vídeo real do Instagram deles; conferir marca d'água de terceiro).
- [ ] Fotos boas em alta. As do site hoje são recorte de print de Instagram, 1080px.
  Pauta detalhada em `site/PLANO.md`, incluindo carro em cima do dinamômetro (a prova
  que concorrente sem máquina não imita).
- [ ] Confirmar o endereço definitivo (o relatório-base do Marcelo trouxe "792 ou 772";
  neste sistema só existe 792 registrado, do Google Meu Negócio).
