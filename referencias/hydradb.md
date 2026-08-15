# Teardown: HydraDB — landing de banco de grafos para agentes de IA

- **URL:** https://hydradb.com/
- **Segmento:** Dev-tool / infraestrutura de dados (GraphDB sobre object storage), SaaS B2D
  (business-to-developer). Empresa: AGI Context, Inc. Levantou US$ 6,5M.
- **Estudado em:** 14/08/2026
- **Nota:** 8/10
- **Contexto:** estudado como referência de **landing de produto técnico/IA**, um segmento
  que a Horus não atende hoje nos cinco clientes, mas que é **exatamente o molde do Icarus**
  (o agente de IA vendável da Horus, projeto próprio em `E:\Users\hagge\Downloads\Icarus`).
  Dev-tool tem gramática própria — hero dark técnico, prova por benchmark, diagrama de
  arquitetura, contadores animados — e é isso que se estuda aqui: não a aparência, o
  **mecanismo de provar competência técnica sem depoimento**.

O produto foi confirmado no scrape (`branding` + `markdown` + print do hero): é um banco
de grafos ("GraphDB built on object storage") vendido como camada de contexto/memória para
agentes de IA. Feito em **Framer**. Não é banco relacional comum nem ferramenta de dev
genérica — é infraestrutura de dados para IA.

---

## Estrutura, na ordem

1. **Banner de anúncio** acima do header: "Data connectors now live: Slack, Notion, GitHub,
   Gmail, and more →" (barra fina, novidade linkada)
2. **Hero** "The Graph AI Runs On." — título em fonte **pixel** (Geist Pixel), subtítulo de
   benefício ("10x cheaper, ultrafast"), segunda linha de casos de uso, dois CTAs (**Talk to
   us** + **Sign Up**), e uma **visualização de grafo em partículas** laranja ocupando a
   metade direita
3. **Barra de logos de clientes** em marquee (slashy, Kroissings, Wellstone AI, Composio,
   calsoft, smallest.ai, neuroform.ai, SYNTRIX, Clinsight) — rolando na horizontal
4. **"$6.5M Raised"** — prova por **investidor**, não por cliente: Jeff Dean, pesquisadores
   OpenAI e DeepMind, Sky9 Capital, "and more" linkado pro post no LinkedIn
5. **Faixa de números animados** (contadores tipo odômetro): LongMemEval-S Overall %, Single
   Session Recall %, Accurate vs Full Context GPT-4 %, Avg Token/Stack (K)
6. **Use Cases** — "What Engineers Are Building With HydraDB", cinco itens **numerados**
   (01 Agent Memory, 02 Ontologies, 03 Company Brain, 04 Agentic Actions, 05 Context
   Engineering), formato de abas/acordeão
7. **"Similarity isn't Always relevance"** — comparativo em duas colunas **Without graphs ×
   With HydraDB** (o bloco de argumentação central)
8. **"Everything you need to Compound Intelligence"** — features em cards com micro-números
   (High Recall Accuracy, Scales with your Systems — diagrama de tiers, Recall Everything,
   Built for Low Latency < 200ms)
9. **"Recall degradation as a bottleneck"** — **gráfico de linha** Accuracy × Context length,
   plotando HydraDB (90,79%) contra VectorDB (71%) e Full Context GPT-4o (38%) conforme o
   contexto cresce
10. **"Graph native context infrastructure for agents"** — quatro stats de escala (1 bilhão+
    de documentos, 92% recall, ~1M retrievals/mês, 2k devs)
11. **Architecture Overview** — **diagrama técnico detalhado**: orquestração (routing, entity
    extraction, retrieval orchestrator, plugins de vectorstore/connectors/filtros) + o core do
    grafo (Writer/Indexer/Reader nodes, WAL, GraphBLAS) + storage unificado em tiers (Hot →
    Warm → Cold)
12. **"State of the art on various benchmarks"** — **tabela comparativa** LongMemEval-S por
    categoria: HydraDB × mem0-oSS × ZEP × Full Context, com data ("Last updated: March 2026")
13. **Pricing** — quatro planos por **storage** (Ship/Free, Surge/$25, Scale/$399,
    Enterprise/Custom), "No per-seat, feature, API limits"
14. **FAQ** — sete perguntas (o que é, pra quem, tempo de integração, precisa trocar o
    vector DB, fontes de dado, preço ao escalar, SOC 2)
15. **Footer-CTA** "Build AI with compounding intelligence" + rodapé com mapa do site,
    benchmarks, redes, © 2026 AGI Context, Inc

Comparando com `_memoria/design/00-anatomia.md`: a diferença estrutural do dev-tool é que
**a prova é técnica e vem em blocos densos de dado** (benchmark, arquitetura, gráfico), não em
depoimento nem em foto de gente. O "para quem é" não é escrito em segunda pessoa emocional —
é "What **Engineers** Are Building", nomeando o cargo do leitor. E a prova social sobe de
forma incomum: **antes** dos clientes vem o dinheiro levantado e os nomes dos investidores
(Jeff Dean), porque no mundo dev-tool a validação de quem-apostou pesa mais que logo de marca.

---

## O que copiar

Uma decisão por subtítulo. Descrever o mecanismo, não elogiar.

### Prova por benchmark comparativo em tabela, com data

O bloco mais forte da página é a tabela LongMemEval-S: seis categorias × quatro sistemas
(HydraDB, mem0-oSS, ZEP, Full Context), número em cada célula, e o rótulo **"Last updated:
March 2026"**.

**Por que funciona:** transforma a afirmação "somos melhores" numa **medição verificável e
datada**. O leitor técnico não acredita em adjetivo, acredita em número que ele poderia
reproduzir. Colocar o concorrente na mesma tabela é agressivo mas honesto: você se expõe à
conferência. E a data protege contra o "isso é de quando?" — mostra que o dado é fresco.
Transferível pro **Icarus**: em vez de "nosso agente é bom", uma tabela de tarefas resolvidas
× tempo × concorrente, datada.

### Gráfico que mostra a dor no ponto onde o concorrente quebra

"Recall degradation as a bottleneck" plota accuracy contra tamanho de contexto. As três linhas
começam juntas e **divergem**: HydraDB fica em 90%, VectorDB despenca pra 71%, Full Context pra
38% conforme o contexto cresce.

**Por que funciona:** não afirma superioridade, **mostra onde o outro falha** — e falha
justamente no cenário que o leitor vive (contexto grande). É o equivalente técnico de "nomear
a dor do revendedor" do Arbor: em vez de elogiar o próprio produto, desenha a curva onde a
alternativa do leitor colapsa. O olho segue a linha que cai e conclui sozinho.

### Contadores animados (odômetro) para métrica de destaque

Os números-chave (recall %, tokens, accuracy) sobem rolando dígito a dígito quando entram na
tela — o mecanismo do "0123456789" repetido no scrape é uma coluna de dígitos que desliza até
parar no valor final.

**Por que funciona:** o movimento de contagem chama o olho pro número e faz o valor "assentar"
na frente do leitor, o que dá sensação de medição ao vivo. Barato de fazer e muito reutilizável.
Virou ficha de inspiração (ver abaixo). ⚠️ **Cuidado de compliance:** número animado de
"resultado" em cliente de saúde é promessa disfarçada — o mecanismo é neutro, o **conteúdo** do
número é que trava. Serve pro Icarus e pra peça institucional da Horus, não pra métrica clínica.

### Diagrama de arquitetura como argumento de confiança

O "Architecture Overview" desenha o caminho do dado inteiro: request → orquestração → core do
grafo (Writer/Indexer/Reader) → storage em tiers. Nomeia componentes reais (WAL, GraphBLAS, S3).

**Por que funciona:** é o "caminho que o café faz até chegar à sua loja" do Arbor, em versão
técnica — **processo vira prova**. Mostrar a engenharia por dentro comunica "sabemos o que
fazemos" a um público que desconfia de caixa-preta. Pro Icarus, o equivalente é um diagrama de
como o agente pensa/age (entrada → raciocínio → ferramentas → resposta), que vende competência
sem precisar de depoimento.

### Prova social invertida: dinheiro e nomes antes de logos

"$6.5M Raised" com Jeff Dean e pesquisadores de OpenAI/DeepMind aparece **antes** da fila de
logos de clientes.

**Por que funciona:** em produto novo e técnico, cliente ainda é escasso, mas quem-apostou
credencia. Nomear pessoas específicas de peso (não "investidores de renome") é o mesmo
princípio do review do Google no Arbor: **prova verificável de terceiro** vale mais que
auto-elogio. Adaptação honesta pra Horus: não temos Jeff Dean, mas temos casos reais — a
lição é *citar o nome verificável em vez do adjetivo*.

### Copy de benefício traduzido, não de feature

O subtítulo do hero não diz "graph database with tiered object storage" e para — diz
**"10x cheaper, ultrafast, and purpose-built for modern AI workloads"** e depois lista o que o
dev constrói ("ontologies, agent memory, company brains"). Feature técnica sempre seguida do
que ela **te deixa fazer**.

**Por que funciona:** mesmo público técnico compra resultado. O padrão "feature → então você
consegue X" atravessa segmento e serve a qualquer landing de produto da Horus.

---

## Tipografia e cor

Dados de `branding` (hex e fontes = **reais**, medidos; tamanhos e uso = **aparentes**, lidos
do print/scrape):

- **Fundo:** `#000000` puro. Modo dark de ponta a ponta.
- **Texto:** `#FFFFFF`.
- **Acento primário:** `#FF571A` (laranja-vermelho) — CTA "Sign Up", detalhes, e a paleta da
  **visualização de grafo em partículas** (laranja/vermelho sobre preto, cara de brasa/calor).
- **Link:** `#0000EE` (azul puro de hyperlink) — usado com parcimônia.
- **São dois acentos de verdade:** o laranja carrega quase tudo; o azul é reservado a link.
  A contenção é o que dá o ar técnico — nada de gradiente arco-íris.
- **Display/título:** **Geist Pixel** — fonte **pixelada/bitmap**, é a assinatura visual da
  marca ("The Graph AI Runs On." em pixel remete a terminal/computação retro). h1 ~72px
  (aparente).
- **Corpo:** **Aeonik** (sans neutra, geométrica).
- **Mono:** **JetBrains Mono** — em rótulos de código, valores e labels de diagrama.
- Raio de canto 8px, base de espaçamento 4px.

O contraste tipográfico que ensina: **pixel no título + sans limpa no corpo + mono nos dados**.
Três vozes com função clara — o pixel diz "somos de máquina", a sans diz "leia com conforto", a
mono diz "isto é um dado/código". É a versão dev-tool do "serifa de autoridade + sans neutra".

---

## O que não copiar

**Densidade de número beirando a fadiga.** A página empilha faixa de stats animados +
gráfico + quatro stats de escala + tabela de benchmark + micro-números nos cards. Para o
público-alvo (engenheiro cético) funciona; para qualquer cliente da Horus seria **muro de
dado** que cansa e cheira a exagero. A lição é *escolher os dois ou três números que importam*,
não despejar todos.

**A fonte pixel no título.** É assinatura corajosa e coerente **aqui** (produto de computação,
público nerd que lê o pixel como cultura). Em café, psicologia ou odonto seria ruído retro sem
significado — o mesmo erro de clonar aparência que a `/estudar-site` combate. Pixel só se a
marca tiver motivo de máquina/retro pra usá-lo.

**O tom "kill vector databases".** O link do investimento aponta pra um post "we've raised
$6.5M to **kill** vector databases". Bravata competitiva funciona no Vale do Silício e morre em
cliente regulado — e nem em institucional brasileiro sóbrio combina. Registrar como leitura de
público, não como tom a importar.

**Comparar-se nominalmente com concorrente.** Pôr mem0/ZEP na tabela é padrão aceito em
dev-tool americano. Em serviço local brasileiro (e mais ainda em saúde regulada), citar
concorrente pelo nome numa peça é convite a briga e a problema — o jogo da Horus é o local, não
o comparativo direto.

---

## Aplicado onde

Ainda não. Candidato direto: **Icarus** (produto de IA da Horus), que é do mesmo gênero —
landing de produto técnico. Reaproveitáveis diretos: a tabela de benchmark datada, o diagrama
de "como o agente funciona" como prova, o padrão feature→benefício, e os contadores animados
(com a trava de compliance registrada). Para os cinco clientes atuais, o que atravessa é o
**raciocínio de provar por dado verificável e datado em vez de adjetivo** — não a estética dark
pixel.
