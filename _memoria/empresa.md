# Empresa

> Memória central do negócio. O Claude lê esse arquivo antes de cada resposta.
> Aqui fica a AGÊNCIA. Cada cliente tem pasta própria em `clientes/<nome>/`.

**Nome:** Horus
**Negócio:** Agência de marketing digital com IA (opera sobre o sistema Horus OS)
**O que faz:** Constrói "máquinas" de marketing pra negócios — site, bot+CRM,
conteúdo/carrossel, tráfego — usando IA pra produzir e publicar em escala.
**Perfil:** Agência (equipe pequena) atendendo múltiplos clientes em paralelo.
**Atende clientes:** negócios locais / profissionais que precisam de presença
digital que gera agenda (o primeiro caso é uma clínica de implantodontia premium).
**Contato operacional:** Marcelo.

## Serviços (a "Máquina")

Entrega por prioridade, um bloco por vez — nunca "product-dump":

1. **Site** — fundação (one-page, mobile-first, premium)
2. **Bot + CRM** — captura e agenda 24/7
3. **Conteúdo / carrossel automático** — autoridade contínua
4. **Tráfego / ads** — escala

Também: SEO local, propostas comerciais, relatórios.

**Ferramentas:** Firecrawl (pesquisa/scrape web) via MCP, e **API da OpenAI** para
geração de imagem, direto, sem MCP. Detalhe operacional no `CLAUDE.md` da raiz.
⚠️ O **Higgsfield saiu em 05/08/2026** (assinatura cancelada, poucos créditos por
mês) e foi removido do `.mcp.json`. A API da OpenAI é cobrança por uso, com chave
própria em platform.openai.com, separada de qualquer assinatura do ChatGPT.
Para imagem, o `ffmpeg` local converte tudo para WebP no tamanho de exibição antes
de entrar em qualquer HTML: imagem gerada por IA sai em 2k e pesa megabytes.

## Sistema de design (desde 26/07/2026)

O conhecimento de site da agência vive em **`_memoria/design/`** (anatomia de um
site que funciona, antipadrões, onde estudar, checklist) e o acervo de estudo em
**`referencias/`** (teardowns de sites reais, gerados pela skill `/estudar-site`).

A regra de leitura obrigatória antes de qualquer HTML está no `CLAUDE.md` da raiz.
Existe porque o Claude não guarda nada entre conversas: correção que morre no chat
volta como erro no próximo site.

## Sistema de conteúdo (desde 03/08/2026)

O que a agência sabe sobre **carrossel, post e story** vive em
**`_memoria/conteudo/`**: os sete formatos narrativos, os pisos de legibilidade
(corpo com piso de 34px, nada de leitura abaixo de 24px), os antipadrões de peça
social e o checklist de entrega. Leitura obrigatória antes de qualquer copy de peça
social, igual ao `design/` antes de HTML.

O conteúdo foi extraído do **opensquad** em 03/08/2026 e o framework **não** foi
adotado. O motivo, mais duas decisões que continuam abertas para o Marcelo (contador
de slide e travar identidade de carrossel por cliente), estão em
`_memoria/conteudo/91-o-que-veio-do-opensquad.md`.

## Sistema de decisão (desde 26/07/2026)

O **Conselho** vive em `_conselho/`: constituição, seis cargos (estrategista,
criação, mídia, financeiro, operações e compliance), sete mentes de doutrina
(Hormozi, Cole Gordon, Jeremy Miner, Jeremy Haynes, G4, Full Sales System, The
Scalable Company) e três meta-avaliadores. Comandos: `/conselho`, `/debate`,
`/consultar`, `/comparar`. Portado do `/conclave` do Mega Brain.

Junto vieram duas regras que valem fora do Conselho também:
`_memoria/integridade.md` (nada inventado sobre cliente, dado que falta vira
placeholder marcado) e a skill `/verificar` (não declarar pronto sem evidência).

A descrição de cada função da operação está em `equipe/`, com tipo de executor
(Agente, Híbrido ou Humano) e nível de autonomia.

## Clientes ativos

- **Dr. Giovanni Nascimento** (cliente #1) — implantodontista, Salvador/BA.
  Contexto completo em `clientes/dr-giovanni-nascimento/` (briefing + marca).
  Status em 26/07/2026: **fora da linha de frente** por decisão do Marcelo. O
  bloco dele continua sendo o **site**, com quatro versões de home na pasta e
  nenhuma definição de qual vale. Setor regulado (CFO) — compliance obrigatório
  em toda entrega.
- **Jaqueline — Permita-se Fitness** (cliente #2) — estúdio multi-modalidade
  (hidroginástica, pilates, zumba, boxe, dança, ballet kids, nutricionista),
  Boca do Rio, Salvador/BA. Contexto completo em `clientes/permita-se-fitness/`
  (briefing + marca). Status: criando o **Google Meu Negócio** — presença
  digital começando do zero (sem Instagram ativo, sem site).
- **Aion Psicologia** (cliente #3, em prospecção — **prioridade principal da
  agência desde 26/07/2026**) — clínica de psicologia com mais
  de 20 anos, Itaigara, Salvador/BA. Equipe de psicólogos, serviços de psicoterapia,
  avaliação e intervenção neuropsicológica, orientação familiar e profissional,
  grupo de apoio parental. Atende **presencial e online**. Contexto completo em
  `clientes/aion-psicologia/` (briefing + marca).
  Status em 30/07/2026: **site pronto e auditado**, **dez páginas**. Eram quatro
  (home, contato, especialidades, política de privacidade) até 30/07, quando os seis
  serviços ganharam página própria por decisão do Marcelo, e a `especialidades.html`
  virou o índice das seis. Rodada de design fechada em 28/07 (menu no celular,
  botânica da marca, contraste, escala tipográfica; detector da casa de 57
  antipadrões para 1 hoje, placar oficial em `_memoria/design/README.md`).
  Backup da versão anterior em `Backup 1/`.
  O que trava a publicação não é produção, é dado que só a cliente tem (sala,
  horário, telefone fixo, CRP da pessoa jurídica, responsável técnica, 2
  profissionais que faltam, destino do formulário). As páginas de serviço somaram
  **11 perguntas novas** para a reunião: página por serviço obriga a responder o que
  a página única deixava passar em silêncio.
  **Próximo passo: apresentar para a Maria Tutti**, a sócia-gerente, ou seja, para
  quem assina. O site vai ao ar pelo Vercel, e até o "sim" sobe com Deployment
  Protection ligada (veto de Compliance da sessão do Conselho de 26/07).
  Setor regulado (CFP) — compliance obrigatório em toda entrega.
  Origem: contato do sócio do Marcelo com uma das psicólogas da equipe.
- **Nelson — Café Grão da Serra** (cliente #4) — café torrado 100% arábica,
  artesanal, **B2B** (revenda para padaria, mercado, cafeteria, escritório).
  Distrito Serrana, Brejões/BA. MEI ativo desde 20/03/2026 — o negócio tem 4
  meses. Contexto completo em `clientes/grao-da-serra/` (briefing + marca).
  Status em 03/08/2026: **Google Meu Negócio no ar e verificado**; **site
  institucional escrito**, em versão clara, com detector zerado (a primeira versão,
  escura, foi rejeitada e está em `Backup 1/`). O que trava é material do cliente
  (fotos do pacote e do dono, produtos com preço), mais o escopo e a autorização de
  portfólio, que nunca foram fechados. CRM foi pedido por ele e é trabalho pago,
  com escopo próprio.
  Dois pontos que atravessam o projeto: a família **não tem lavoura** (o pai
  compra o grão maduro de produtores e faz pilagem, secagem, torra e moagem), e o
  nome colide com uma marca de café de 1995 que já detém `graodaserra.com.br`.
  Setor **não regulado** por conselho, mas valem as regras de alimento (sem
  alegação de saúde).
  Origem: o sócio do Marcelo já era amigo do Nelson.
- **Mayara Barros Soares** (cliente #5, **não pagante**) — psicologia com eixo em
  arte e filosofia, Salvador/BA. Pasta criada em 03/08/2026 em
  `clientes/mayara-barros/`. É a namorada do Marcelo, e mora em `clientes/` porque
  funciona como conta (tem briefing, marca, compliance de conselho e entregas
  recorrentes) e porque as skills da casa leem desse caminho.
  Objetivo: sair de Acompanhante Terapêutica e passar a atender por conta própria,
  online e em Salvador. Foco definido pelo Marcelo: **redes sociais**. Site e Google
  Meu Negócio ficaram de fora por ora.
  Status: `instagram/estrategia.md` e `instagram/stories.md` prontos, `marca.md`
  preenchido com a direção visual **"Galeria"** (pintura clássica emoldurada + ficha
  + leitura psicológica, modo claro), e o **post #1 "Xeque-Mate + Frankl" renderizado
  (8 slides)**. Há também um kit em `gpt-projeto/` para carregar a identidade num GPT
  do ChatGPT. Perfil `@universpsiquee` com 0 posts e 191 seguidores.
  ✅ CRP **03/36219 confirmado ativo** (a bio é que está desatualizada em "estudante").
  Falta só o **e-Psi** para o CTA de atendimento online. Setor regulado pelo **CFP**,
  igual à Aion.

## Peças e produtos da própria Hórus

Não são clientes, e por isso não moram em `clientes/`:

- **`site/`** — site institucional da agência, na raiz. Tem `CLAUDE.md` e `PLANO.md`
  próprios, e a home foi refeita várias vezes entre 04 e 05/08/2026. O estudo das
  dez referências que definiram a linguagem está em
  `referencias/agencias-ia-dez-sites.md`
- **`identidade/`** — marca da agência (peça institucional). Não confundir com
  `clientes/<nome>/marca.md`, que é a marca do cliente e vence em peça de cliente
- **Icarus** — agente de IA implantável, produto da Hórus, iniciado em 01/08/2026.
  Mora **fora deste repositório**, em `E:\Users\hagge\Downloads\Icarus`, por decisão
  de segurança: o agente roda shell e se conecta a WhatsApp de terceiros.
  Estado em 05/08/2026: **pesquisa concluída, nada construído**, sem cliente.
  Em desenvolvimento pelo Marcelo e pelo Antonio. Não entra na fila de prioridade da
  agência por conta própria

## Regras do sistema

- Cliente novo → criar `clientes/<nome>/` com `briefing.md` e `marca.md` próprios
- **Duas pastas novas na raiz (26/07/2026):** `_conselho/` é o sistema de decisão
  da agência; `equipe/` é a descrição das funções da operação. Nenhuma das duas
  guarda material de cliente
- A marca de cada cliente vive em `clientes/<nome>/marca.md`; `identidade/` é a
  marca da **agência**, não do cliente
- **Duas pastas de "referência", não confundir:** `referencias/` na raiz é a
  biblioteca de teardowns da agência, que serve a todos os clientes;
  `clientes/<nome>/referencias-*/` é material do cliente específico (print de
  Instagram, foto, lista de sites que o Marcelo mandou)
- Ao trabalhar num cliente, ler o `briefing.md` e o `marca.md` dele antes de produzir
- Clientes de setor regulado (saúde/odonto): checar as travas de compliance do
  próprio cliente antes de publicar qualquer coisa

## Contexto adicional

Fluxo padrão: estratégia/diagnóstico vem pronto (Mega Brain do próprio cliente ou
do Marcelo) → a Horus produz e publica. Não refazer a análise estratégica quando o
briefing já vem fechado; ir direto pra produção, perguntando só o prático que falta.
