# Card — Abordagem e prospecção de negócio local

> **Fonte:** 4 grupos de network do Marcelo, via Q&A do NotebookLM · **primeira gravação:**
> 12/09/2026 · **atualizado 18/09/2026** (cold call dos 3 "sims", migração pro áudio, nota sabor-site-pronto vs. Mullsanni, auditoria do Spark, trava de honestidade do gancho "site caiu", texto-first no lugar de áudio obrigatório, regra de tom humano) · **atualizado 22/09/2026** (anatomia da mensagem em 5 partes e as duas regras de validação, promovidas do dossiê de prospecção de 20/09).
> **Confiança: ALTA** para os ganchos e modelos de mensagem (prática testada de agências e
> devs brasileiros) · **MÉDIA e calibrar** para números de ferramenta (variam por conta/uso).
> ⚠️ Referência de mercado, **não meta e não promessa**. Nada aqui vai para peça de cliente.
> Cross-ref: `taxas-de-conversao.md`, `_memoria/comercial.md`, e o playbook `Horus-Comercial`.

---

## 1. O gancho que mais faz o lead responder

Ranking testado na rede (o que abre porta em negócio local):

- 🏆 **Google + perda de cliente na cidade** (campeão). O dono entende que quem pesquisa no
  Google quer comprar/agendar agora. "Vocês estão perdendo quem procura por [categoria] em
  [cidade] e não acha vocês" atinge a dor de faturamento imediato.
- ⚠️ **Site fora do ar** (limitado): funciona quando o link está quebrado, mas a maioria dos
  negócios pequenos nem tem site, então limita o volume.
  - 🔴 **Trava de honestidade (18/09/2026):** o gancho "fui buscar seu site e deu fora do ar,
    já criei um novo pra você" (dos prints do network) **só serve pra quem tem domínio morto de
    verdade.** Pra quem só tem Instagram e nunca teve site, dizer "seu site caiu" é **inventar**
    (integridade), e o dono percebe na hora. Nesse caso o gancho honesto é "hoje vocês só existem
    no Instagram", nunca "o site caiu". O que se reaproveita do modelo é a prévia pronta, não a
    mentira do site morto. Origem: revisão das mensagens do Autobahn (BMW/MINI, só Instagram).
- ❌ **Instagram / redes** (baixa conversão): "já tenho Instagram e pra mim basta". Ele não vê
  o Insta como intenção de compra e acha que você quer vender "design".

**Regra de ouro:** o dono não compra código nem "site bonito". Ele compra **parar de perder
venda pro concorrente** e **mais dinheiro no bolso**. Fale disso.

## 2. Os três modelos de mensagem que convertem

### A) "Sabor de projeto / MVP pronto" (o campeão)
Chegar com uma prévia visual já feita (com a marca do lead, apoio de IA) muda o jogo: ele vê
a própria empresa no ar e o desejo dispara. Estrutura:
1. **Elogio sincero + conexão:** "Opa [nome], tudo bem? Vi o perfil de vocês e achei ótimo o
   trabalho com [serviço]."
2. **Dor + entrega do modelo:** "Reparei que quando procurei por [categoria] em [cidade],
   vocês não aparecem no Google. Montei um modelo exclusivo pra [empresa]: [link]."
3. **CTA de curiosidade:** "Já deixei a estrutura pronta. Se quiser ver ou ajustar algo, te
   mostro."

### B) "Dois passos / curiosidade" (evita bloqueio de chip)
Gera resposta antes de mandar link. Quebra a saudação em duas mensagens curtas:
1. "Oi [nome], tudo bem?" → 2. "Boa tarde!" → (espera responder) → 3. pergunta de prioridade:
"Procurei por [categoria] na região, vi que vocês têm ótimas avaliações mas não têm site/
agendamento no WhatsApp, e o cliente acaba indo pro concorrente. Resolver isso é prioridade
pra vocês agora?" → 4. se sim: "Te explico rapidinho, pode ser?" (texto; áudio só se ele preferir)

### C) "Cliente oculto / tiro de sniper"
Entra primeiro como cliente interessado, elogia o atendimento, depois faz a ponte: "Atendimento
de vocês é excelente! Procurei no Google e tive dificuldade de achar vocês. Trabalho com
tecnologia e montei uma ideia que ajuda a converter mais. Com quem falo sobre isso?" Gera
contraste positivo, porque o dono só recebe gente criticando.

## 3. As regras de ouro da abordagem

- 🗣️ **Escreve como pessoa, não como agência (18/09/2026).** Cumprimento de verdade, conta em
  1ª pessoa como caiu no perfil ("tava vendo o Instagram de vocês"), elogio sincero, frase curta
  e falada, pergunta genuína no fim. **Cortar linha de copy polida** ("passa a autoridade que
  fecha o serviço caro", "é reputação de sobra"): tom de landing denuncia vendedor na hora.
  Origem: o Marcelo apontou que as mensagens da casa estavam soando de agência, não de gente.
- **Fale do LEAD, não de você.** Nunca abrir com "eu faço / minha agência / eu desenvolvo".
- **Nada de textão frio** apresentando a agência: soa spam, é ignorado e bloqueia o chip.
- **Foto de pessoa física** no WhatsApp Business (não a logo fria) aumenta muito a resposta.
- **Espelhamento:** primeiro contato por texto; se ele responde em áudio, responda em áudio
  (tom de voz gera proximidade).
- **Foque na dor certa:** demora pra responder no WhatsApp, agendamento perdido, concorrência
  no Google. Não fale de "likes" ou "marketing de conteúdo" pra comerciante pequeno.

## 4. Aquecimento de número (não queimar o chip)

Disparo frio em volume queima o número. Práticas da rede:
- **Chip novo aquece gradual:** poucos envios/dia no começo, subindo devagar (o "ritmo
  conservador" dos disparadores fica em ~90 a 180s entre mensagens; número novo é o de maior
  risco de bloqueio).
- **Janela de horário comercial** e pausas automáticas simulam comportamento humano.
- **Personalização > volume:** mensagem específica pro negócio da pessoa não parece spam.
- Base de clientes já conhecidos (pós-venda/recompra) usa **API oficial da Meta**, não chip
  pessoal (ver `recorrencia-e-pos-venda.md`).

## 5. Ferramentas pra montar lista de lead

| Ferramenta | Fonte | Custo (referência) |
|---|---|---|
| **Kaptar** | Google Maps (via API Google Places) | cota grátis do Google Cloud; ⚠️ cuidar do raio/requisições pra não estourar e gerar cobrança |
| **Apify** | Google Maps, Instagram, LinkedIn, TikTok | US$ 5 grátis ao criar conta; ~R$ 1,20 por 50 leads qualificados |
| **OneProspector** | OpenStreetMap (sem custo de API Google) | 7 dias grátis; joga leads num Kanban |
| **EnCode / Trinus** | scraping de Google Maps (painéis de membros) | interno |
| **Biblioteca de Anúncios da Meta** | quem já roda tráfego (alta consciência) | grátis |
| **Casa dos Dados** | telefone de sócio via CNPJ público | grátis/pago |

Combinação popular pra começar barato: **Kaptar/Google Maps** ou **Apify** (créditos iniciais).
Na Hórus, o alimentador é a **ponte Spark** (Gemini → Sheets → CSV → Firecrawl), auditada pelo
`mcp-prospeccao`.

## 6. Cold call: a técnica dos 3 "sims" (oráculo, 18/09/2026)

A ligação converte mais que texto porque obriga atenção imediata. Roteiro que quebra a
defensiva com micro-compromissos:

1. **Filtro:** "Bom dia, [nome]! Tudo bem? Falo com o responsável pela [empresa]?" (1º sim,
   e já pesca o decisor logo na porta, a correção da lição Mullsanni).
2. **Quebra de padrão:** "Consegue me tirar uma dúvida rápida de 30 segundos?" (2º sim).
3. **Diagnóstico (pergunta, não pitch):** "Vi que vocês têm [X] avaliações ótimas no Google,
   mas não têm um site onde o cliente veja os serviços e feche no WhatsApp. Tem algum motivo
   pra ainda não terem site próprio?"
4. **Fechamento pra call:** "Não quero te vender nada agora, só te mostrar. Prefere que eu
   mande a demonstração no WhatsApp ou marcamos 10 minutinhos essa semana?"

Trocar pergunta negativa ("você não gostaria de...?") por afirmação de engajamento ("concorda
que é bem mais vantajoso...?").

## 7. Texto é o padrão; áudio é opcional (18/09/2026)

O padrão é **texto** (é onde o Marcelo tem mais controle e é o mais seguro no contato frio).
Áudio é ferramenta **opcional**, não regra: use como **espelhamento** (se o dono responder em
áudio, responda em áudio) ou no momento de explicar "como funciona", **só se estiver
confortável** — áudio inseguro vende pior que texto seguro. **Nunca áudio no primeiro contato
frio.** ⚠️ Calibração de 18/09: a versão anterior desta seção mandava migrar pro áudio, e isso
virou contradição com a preferência real do Marcelo (texto). O áudio deixou de ser default.

## 8. A anatomia da mensagem (doutrina da casa, travada 21/09/2026)

> Origem: a revisão da prospecção de 20/09. A v1 escondia o serviço de propósito, o Gemini
> Spark dizia o que fazia mas inventava fato. O framework junta o lastro da v1 com a clareza do
> Gemini. Detalhe completo em `saidas/prospeccao-2026-09-20/dossie-prospeccao-v2.html` (Partes 2 e 3).

**Dois passos, sempre.** Abertura curta (só a saudação com o nome, quando existir), manda e
espera a resposta. Só depois o corpo. Abrir com "oi" pelado de número desconhecido tem cara de
golpe, então a saudação é curta mas nunca isolada de propósito no vazio.

**O corpo carrega cinco partes, nesta ordem:**

1. **Como cheguei.** Uma linha, verdadeira, em 1ª pessoa. Nunca pretexto falsificável.
2. **O que eu vi que ele não vê.** Fato exclusivo, verificável por ele em segundos, sobre o
   negócio dele e de preferência sobre o caminho que o cliente dele percorre, não sobre um campo
   de ficha.
3. **Por que aquilo custa.** Ligado ao ticket dele, sem número que a casa não tenha. A variável
   que falta vira pergunta (o número é do cliente, nunca nosso).
4. **O que eu faria.** Uma frase concreta, com as partes nomeadas. O dono termina a leitura
   **sabendo o que a Hórus faz** — este é o ponto onde a v1 falhava e o Gemini ganhava.
5. **Um passo pequeno.** Pedido de licença pra dar ("quer que eu te mostre?", "posso te
   explicar?") ou convite com duas opções de horário. ⚠️ Revisto em 22/09: "pergunta que só ele
   sabe responder" saiu, porque virava interrogatório. Ver seção 10.

**Três regras que sustentam a anatomia:**

- **Guardar o *como*, nunca o *o quê*.** Diagnóstico completo de graça é ruim; esconder o que se
  faz é pior. Foi a correção mais cara: dizer o serviço não é entregar a solução.
- **Tese única por lead.** Se duas mensagens puderem trocar só o nome e continuar valendo, a
  tese está rasa. A do Gemini, tirando nomes próprios, serve pra qualquer empresa do segmento; a
  da casa depende de um fato que só existe naquele lead.
- **O teste final antes de mandar:** qual é a resposta mais fácil que esta mensagem permite? Se
  for o silêncio, a mensagem falhou. ⚠️ Revisto em 22/09: o "obrigado" deixou de ser fracasso a
  evitar a qualquer custo. Tentar impedir o "obrigado" foi o que gerou a escada de perguntas
  intrometidas. Ver seção 10.

**O que se importou do Gemini:** a ordem (chegar ao ponto rápido) e a solução nomeada. **O que
não se importou:** dor de segmento no lugar da dor da empresa, bajulação ("nível técnico
impecável"), CTA passivo sem próximo passo, e afirmação sem fonte.

## 9. As duas regras de validação antes de escrever (travadas 21/09/2026)

> Origem: quatro teses caíram na reverificação da prospecção de 20/09. Duas regras impedem a
> repetição, e as duas nasceram de erro real da casa, não de teoria.

- **Regra 1 · Afirmação de ausência exige varredura completa.** Nunca escrever que o lead "não
  tem", "não mostra" ou "não fala sobre" algo sem ter aberto **todos** os canais: site com todas
  as páginas internas, Instagram com bio expandida e destaques abertos, Facebook, Threads,
  portais de terceiros do setor, Linktree, e o Google com a aba Sobre. Varredura incompleta →
  a frase vira pergunta, nunca afirmação. Origem: a v1 disse que o site da Danyfisio "só fala de
  fisioterapia" (fala dos quatro serviços) e que a Prático "não mostra um projeto" (141 posts,
  portfólio por ambiente). Os dois erros o dono confere em dez segundos.
- **Regra 2 · Avaliação negativa só entra depois de ler a resposta do dono.** Antes de usar
  qualquer crítica como argumento: ler a resposta do dono logo abaixo e identificar **quem
  escreveu**. Cliente, vizinho, fornecedor e concorrente produzem críticas parecidas e
  significados opostos. Origem: Casa Verona, onde duas das três críticas recentes eram de
  **vizinhos** e a dona já respondera em público, com base legal. Chegar com esse argumento é
  contar a ela uma história que ela já desmentiu por escrito.

- **Regra 3 · Posição na busca só com a busca feita no dia (22/09/2026).** "Vocês não
  aparecem", "o Google empurra vocês pra baixo", "o primeiro resultado é" só entram se o
  Marcelo pesquisar do celular no dia do envio e guardar o print. Posição não se deduz da
  categoria nem do bloco "as pessoas também pesquisam", e muda conforme de onde se pesquisa.
  Origem: a tese da Autobahn ("categoria genérica tira ele da busca por marca") caiu quando o
  Marcelo pesquisou e encontrou a Autobahn. Cardamomo, Prático e MAR tinham a mesma falha.
- **Regra 4 · Suposição sobre a operação do lead entra com "imagino", nunca como fato.** Ex.:
  "ninguém guardou a data da cliente" (Jeanne) não foi visto em lugar nenhum.
- **Regra 5 · A oferta sai da maior falha verificável, nunca do produto que a gente quer vender
  (Marcelo, 27/09/2026).** Nem todo negócio precisa de site. Primeiro o diagnóstico: qual é a maior
  falha que o dono confere em segundos? Depois o serviço do catálogo inteiro (`_memoria/empresa.md`:
  site, Google e visibilidade local, atendimento e CRM no WhatsApp, sistema de agendamento, loja,
  anúncio, conteúdo) que resolve aquela falha. A Fase 1 é o que resolve a dor mais visível, e ela pode
  não ser site: na Bioclin (25/09) a entrada virou confirmação de agendamento, porque a dona reclamou em
  público da paciente que confirma e falta. Três situações:
  1. **Tem o problema e sabe:** oferta direta pra essa dor.
  2. **Tem e não sabe (não foi educado):** não se convence com argumento. Mostra um fato que ele
     confere sozinho (o botão do Google que leva pro Instagram) e deixa a conclusão com ele.
  3. **Tem, mas pra ele não é problema** (agenda cheia, nome consolidado): não insiste, vai pra
     geladeira. Origem: Marilúsia, 26/09.

  **Antes da geladeira, a prévia (Marcelo, 28/09/2026).** Quando o lead já tem "quase tudo" (nota boa,
  agenda, um mini-site ou cartão de links) e nenhum argumento convence, o ângulo é **mostrar, não
  argumentar**: montar uma prévia leve do site dele e perguntar "quer dar uma olhada?". É o modelo
  campeão da rede (§2A, "sabor de projeto pronto"). Travas: o passo 1 confirma o decisor antes de gastar
  horas na prévia (lição do Mullsanni); "montei uma prévia" só com a prévia no ar; ela mora em
  `clientes/_prototipos/<nome>/` com `noindex`; em cliente regulado, a prévia já nasce dentro da régua do
  conselho. Origem: Cavalcante Odontologia, que tinha ficha 4,9 e agenda on-line, mas só um cartão de
  links no lugar do site.

**As três classes de informação** (o filtro que decide o que entra na mensagem):

- **Fato** — fonte nomeada e data, conferível pelo dono em segundos. Entra como afirmação.
- **Hipótese** — raciocínio comercial plausível, sem fonte. Entra **obrigatoriamente com "se"**
  ("se hoje a maior parte dos orçamentos chega por DM..."), nunca como afirmação.
- **Não verificado** — não deu pra checar, ou a fonte é print de outra ferramenta. **Não entra.**

> Nota de método (pra não repetir perda de tempo): o Google Maps não entrega o texto das
> respostas do dono por leitura simples (o botão "Mais" precisa de clique real, e clique
> programático não funciona) — o que funciona é **Playwright em janela visível, entrando pelo CID
> do lugar**. O Firecrawl não lê Instagram nem Google Maps; pra esses dois, navegador com sessão.

## 10. O jeito de falar (Marcelo, 22/09/2026; substitui a escada de perguntas)

> Origem: o Marcelo leu o dossiê de 20/09 e sentiu as mensagens e, principalmente, as respostas
> a objeção como **intrometidas**: pergunta em cima de pergunta, cada resposta desenterrando um
> problema novo e cobrando explicação. A escada (sintoma, fato, tempo, consequência, permissão)
> e o repertório de objeções eram teoria, nunca testada. As mensagens que ele preferiu vieram do
> Gemini Spark, do network e da voz dele mesmo, e têm o que a escada não tinha.

**As regras:**

- **O problema é do Google, não do dono.** "Vocês têm nota ótima, mas o Google empurra vocês pra
  baixo" em vez de "vocês erraram nisso". O dono fica no papel de prejudicado, não de culpado, e
  não se defende. Elogio de verdade + o que está escondendo esse mérito.
- **Olhar como cliente, não como auditor.** "Pesquisei oficina de Land Rover", "quando busquei
  'higienização de ar-condicionado em [cidade]'". Isso explica sozinho por que você olhou. Citar a
  busca exata entre aspas é a melhor prova: ele pode refazer.
- **Nomear o problema, guardar o conserto.** O conserto é o trabalho. Entregar ele inteiro ("é só
  mudar a categoria") faz o dono resolver sozinho.
- **A pergunta pede licença pra dar, nunca pede que ele se explique.** Vale: "quer que eu te
  explique?", "posso te mandar?", "quer ver como ficou?". Não vale no chat: "como você lida com
  isso?", "de cada dez clientes, quantos...?" (isso vai pra reunião), e nem perguntar o que dá
  pra ver sozinho ("vocês têm site?"). **Exceção:** a pergunta de prioridade ("seria uma
  prioridade pra vocês agora?") é a qualificação da rede e vale, **uma vez**, como a única
  pergunta do fio (ver `cold-message-processo.md`).
- **Resposta a objeção: aceitar a saída vence agarrar.** Quando ele diz "obrigado, vou ajustar",
  fechar com porta aberta ("Fecha. Qualquer coisa tô por aqui."). Nunca desenterrar um segundo
  problema pra ele não sair. No máximo **uma** pergunta no fio inteiro, e calor ("tranquilo, pois
  é") nunca vem seguido de "mas" e de um novo empurrão.
- **Oferecer e entregar de frente, o catálogo depois.** Dizer o que você faz, sem rodeio, mas só o
  serviço ligado ao problema citado. Tráfego, funil, mentoria entram depois que ele responde.
- **Um gancho por mensagem.** O fato mais forte. Os outros ficam para quando ele engajar.
- **Sem jargão de agência pra dono de negócio local:** "call" vira "ligação rápida"; "funil de
  vendas", "otimizar perfil" e "autoridade" saem ou viram frase comum.

**O piso que não muda** (não é doutrina, é integridade): só afirmar o que você viu (seção 9),
nunca prometer resultado ("colocar no topo" vira "subir bem"), e "montei uma prévia" só se ela
existir.

**O que os primeiros envios medidos ensinaram (24/09/2026, Autobahn e Casa Verona):**

- **Negócio de orçamento personalizado** (evento, obra, marcenaria, laudo) lê "informações sobre
  pacotes" como **tabela de preço**, e preço exposto é tabu pra esse dono. A Casa Verona recusou
  por isso ("são várias variantes", "o cliente tem que entrar em contato", "não quero um molde
  engessado"). A oferta tem que dizer que a página **leva a pessoa pro atendimento dele**, não
  substitui a conversa. Nunca falar em valor, tabela ou "pacotes no site" na primeira mensagem.
- **"Vive só no Instagram" soa como crítica** ao jeito dele trabalhar (foi a frase que ela citou
  ao recusar), e abre a porta pro "o Insta já resolve". O que funciona: **elogiar o Instagram e
  separar os papéis**: "o Instagram é muito bom, mas quem chega pelo Google é outro cliente,
  geralmente quem precisa daquilo naquela hora" (usado na Autobahn).
- **O corpo vai numa mensagem só**, logo depois da abertura. Picotado em 4 ou 5 balões seguidos,
  lê como ataque e como textão ao mesmo tempo.
- **A pergunta final pede licença pra explicar quando não há prévia** ("quer que eu te explique
  como funcionaria pra [Empresa]?") e pra **mostrar só quando a prévia existe**. O "seria uma
  prioridade?" fica pra depois do primeiro sinal de interesse. Benefício na pergunta, só um e
  só se sair do próprio mecanismo ("ganhar tempo no agendamento"), nunca resultado prometido
  ("trazer mais clientes").
- **Não perguntar o que você já sabe** ("vocês possuem site cadastrado?"): afirmar o fato.

**Variações por lead:** o dossiê do dia traz de 3 a 5 variações por lead, cada uma com uma linha
de "quando usar", pra escolher na hora do envio.

**O jeito de escrever do Marcelo, sem cara de IA (29/09/2026).** O modelo que ele escreveu: *"Vi que
vocês estão com anúncio novo de criolipólise e ultrassom levando para o WhatsApp. Para evitar que as
pessoas apenas chamem, perguntem o valor e depois desapareçam, eu posso montar para vocês um WhatsApp
que faz retorno automático para essas pessoas no momento certo."* A fórmula: **o fato que eu vi → "pra
evitar que [problema]" → "eu posso montar pra vocês [solução]" → a pergunta.** O "pra evitar que" resolve
a Regra 4 sem o "imagino": fala do problema como coisa a evitar, sem afirmar que acontece com ele. O que
denuncia IA e sai: dois-pontos de efeito ("com anúncio é assim:", "eu faço isso:"), frase de impacto no
fim ("e cada conversa dessas já foi paga"), lista de três coisas, "imagino que", "geralmente", "sem
ninguém precisar lembrar de cada uma", elogio enfeitado. Frase curta, verbo simples, uma ideia por frase.

**A variação simples (29/09/2026).** Uma mensagem só, que o Antônio mandou pra lista inteira em 28/09
enquanto a versão elaborada ainda estava sendo revisada: *"Oi, [nome]! Tudo bem? Aqui é o [Marcelo ou
Antônio], da Hórus. Vi o perfil de vocês no Instagram e reparei que vocês ainda não têm um site próprio.
Já pensaram em ter um, pra aparecer no Google quando alguém procura [serviço] em [cidade]?"* Fica como
variante B do passo 1 de todo lead, ao lado da abertura em dois passos. As duas entram no teste: o que
responde mais decide, não a revisão.

**Modelos reutilizáveis (segmento automotivo e estética), já com os ajustes:** só usar quando o
fato for verdade naquele lead (conferir a categoria na ficha e refazer a busca antes).

> **Categoria genérica (oficina de marca):** "Achei a oficina de vocês pesquisando manutenção de
> [Marca] aqui na região. Vocês têm uma nota ótima, mas o Google coloca outros lugares na frente,
> e um dos motivos é que a ficha de vocês tá como 'Mecânica' comum. Pro dono de [Marca], ter a
> certeza de que tá levando o carro num especialista faz toda a diferença na hora de fechar. Quer
> que eu te explique como corrigir isso?"

> **Serviço específico escondido:** "Cara, vi que vocês têm ótimas avaliações, mas quando pesquisei
> '[serviço exato] em [Cidade]', vocês apareceram lá pra baixo. A ficha tá cadastrada só como
> mecânica geral, e ajustando isso e organizando o perfil dá pra subir bem nessa busca. Quer que eu
> te mostre o que eu vi?"

> **Estética automotiva (vitrificação, PPF, martelinho):** "Quem pesquisa vitrificação, PPF ou
> martelinho de alto padrão aqui na região acaba caindo em [o que você viu na busca], e vocês, que
> [mérito real que você viu], nem aparecem [onde apareceram]. Eu faço site e Google pra esse tipo de
> serviço. Quer que eu te mostre como ficaria pra vocês?" (A primeira versão perguntava "vocês já
> têm site ou é tudo no WhatsApp?": saiu, porque isso você confere sozinho.)

## 11. Teste A/B de formato (aberto em 24/09/2026)

O Marcelo trouxe um prompt de prospecção com outra tese pra mensagem 1 e mandou testar os dois:

- **A · casa** (seções 8 e 10): abertura curta, depois o fato verificado, o que eu faço e o pedido
  de licença ("quer que eu te explique?").
- **B · curiosidade**: mensagem 1 sem se apresentar e sem oferta. Aponta um problema real e o
  prejuízo que o dono não vê (quem cai no problema não avisa, vai pro concorrente) e fecha com uma
  pergunta sobre o **negócio** dele (o que mais sai, a história), nunca sobre site ou marketing.
  A mensagem 2, só depois da resposta: "aliás, nem me apresentei: sou o Marcelo", o que faço, e
  "se fizer sentido, te mostro". Proibido: "achei melhor avisar", "vocês sabiam?", "quem cuida do
  site?", prova social que a casa não tem.

Nos dois: toda frase de fato conferida por dois caminhos independentes (tabela frase | fonte |
como conferi), sem travessão, sem emoji, sem parêntese, link dentro da frase. O que não passar
sai da mensagem. Cada disparo registra o formato (`disparos.formato`); comparar a taxa de
resposta depois de uma semana e travar o vencedor aqui.

## 12. Dez passos à frente: a conversa, não a mensagem (Marcelo, 29/09/2026)

A mensagem é o primeiro lance de uma conversa que termina em reunião e proposta. Todo lead sai com:

1. **Abertura pela resposta que ela provoca (objeção controlada).** Uma pergunta fácil, de duas saídas, sobre
   um fato que o dono confere em segundos, em que as respostas prováveis abrem a porta. Caso de origem, a
   Cavalcante: ela tem uma página de links, mas a ficha do Google está sem site. A abertura: *"a ficha aparece
   sem site. É porque vocês concentram tudo no Instagram, ou ainda não deu tempo de ligar um site?"*. O "já tenho
   site" que viria vira a deixa: *"vi sim, a sua página de links. O detalhe é que ela não está ligada à ficha."*
   🔴 Nunca afirmação falsa pra provocar ("vocês não têm site" pra quem tem): o dono corrige e a gente vira quem
   não olhou.
2. **Uma variante do passo 2 pra cada resposta provável**, com pedido pequeno: licença pra explicar, pra montar
   uma prévia (que só se monta depois do sim, a trava do Mullsanni) ou uma ligação de 10 minutos com dois horários.
3. **O mapa de respostas:** já tenho site ou fornecedor, uso o Instagram, quanto custa, já tenho quem cuida, quem
   é você, manda mais informações, agora não, silêncio de 4 dias, e o sim.
4. **O caminho até o fechamento:** a pauta da R1 com as perguntas, o que descobrir antes da proposta, a proposta em
   fases ancorada no ticket dele, e as oportunidades além da primeira venda.

**Contrapeso (o que o 28/09 ensinou):** pensar mais longe não é revisar mais. O mapa sai pronto da investigação e
o Marcelo só escolhe e manda. A resposta real do lead ensina mais do que a próxima rodada de revisão.

## Nota da casa (calibração)

- A doutrina da casa continua: **não disparar em massa**, personalizar sempre, e o copiloto
  só sugere a próxima mensagem depois do lead responder (`_gestao/painel-ataque-planta.md`).
- Os modelos acima entram no playbook `Horus-Comercial/10-templates-mensagem.md` adaptados,
  sem a parte de MVP que dependa de produção pesada por lead (calibrar esforço).
- ⚠️ **"Sabor site pronto" (prévia pronta) vs. a lição do Mullsanni:** o oráculo empurra chegar
  com a prévia visual já feita. Vale, mas a prévia **gasta depois de quebrar o gelo e confirmar
  o decisor**, nunca seis rodadas antes de qualquer contato (foi o que custou dias no Mullsanni,
  15/09). Se liderar com prévia, que seja **leve** (horas, reaproveitando template), não produção
  completa especulativa. Cross-ref `objecao-ja-tem-alguem-fazendo.md` e o log do Conselho 15/09.
- 🔴 **A ficha do Spark precisa de auditoria antes de virar abordagem.** Em 18/09 o Spark errou
  3x (site da Sobrow que "não existia", anúncio da Sobrow "zero", telefone da Euro Tech):
  confirmar site, anúncio e telefone via Firecrawl antes de disparar. Ver
  `feedback_auditar-spark-antes-de-abordar` (memória) e `project_mcp-prospeccao`.
