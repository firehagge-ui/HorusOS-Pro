# Aprendizados da prospecção

> O que as respostas reais e as correções do Marcelo ensinaram. Uma linha por aprendizado, com a data,
> a origem e o que muda. Curto de propósito: a investigação lê inteiro antes de escrever.
> Fonte de dados: `node ferramentas/hound-dog/scripts/aprender.mjs` (edições do Marcelo no Disparos,
> variante escolhida, quem respondeu). Padrão que aparece duas vezes vira regra na doutrina.

## Análise geral de 08/10 (todas as conversas até aqui; o plano de teste está em `40-testes.md`)

- **A abertura funciona, o corpo não.** 8 das 9 aberturas que chegaram tiveram resposta de gente. Ao
  corpo, uma resposta com interesse (Talina, "Teria custo?"), uma recusa com motivo (Casa Verona), uma
  recusa da recepção (Cavalcante) e o resto silêncio. A perda está entre o "oi" e o corpo.
- **Em clínica, o WhatsApp é da recepção.** Em 6 clínicas, nenhuma dona leu o corpo: a recepção recusou
  em 1min30 (Cavalcante), segurou e sumiu (LevSaúde), não respondeu (Harmony), ou o robô mandou pra
  equipe e ninguém voltou (Cintya, Bioclin). A abertura "falo com a Dra. ou com a recepção?" convida a
  recepção a se apresentar. Muda: o corpo não vai pela recepção. Com quem decide fora do WhatsApp,
  trocar de canal (ligação pedindo pelo nome, visita, DM no perfil pessoal).
- **A demora mata o dois passos.** A Jéssica (sócia do Talina) e a Cintya responderam em 29/09 e o corpo
  saiu em 06/10, cerca de 7 dias depois. Na Autobahn foram 3 dias. A LevSaúde, a única em que respondemos
  em minutos do começo ao fim, foi a conversa que mais andou dentro de uma recepção. Muda: corpo aprovado
  junto com o passo 1 e enviado em até 1 hora depois da resposta humana.
- **Revisão demais, envio de menos.** 105 rascunhos cancelados pra 15 mensagens enviadas (Harmony 21 pra 2,
  Bioclin 19 pra 2). O teste cego e a régua deixaram o texto melhor e a conversa mais lenta. Muda: no
  máximo duas versões por mensagem.
- **Quem chegou a reunião chegou por voz ou por relação.** Paralela Film (ligação fria do Antônio), Leal,
  Sates, Amparo e Grão (relação). Dos 10 leads frios de WhatsApp, nenhum marcou reunião.
- **Na voz, o lead diz o que quer. No texto, a gente chuta.** Paralela pediu tráfego e não site, e o Leal
  pediu IA que pareça gente. No texto, metade das teses morreu na revisão do Marcelo antes de sair
  (confirmação que a Bioclin já faz, posição no Google, "Google sem foto" no Talina).
- **As edições do Marcelo puxam pra mostrar.** Cintya, Cavalcante, Talina e LevSaúde foram editadas pra
  oferecer "demonstração" ou "ver como ficaria". A única resposta com interesse veio da oferta mais
  visual (o orçamento numa página com as fotos do salão).
- **Sinal de compra respondido com pergunta aberta esfria.** Talina: "Teria custo?" → "pra ver, não...
  Pode ser?" → silêncio desde 06/10. Muda: depois de sinal de compra vai horário fechado ou a própria
  demonstração.
- **Relação: dar primeiro andou rápido.** Na Sates, o Marcelo ofereceu montar o Google de graça e ganhou
  acesso ao perfil em menos de 24 horas. Falta testar se isso funciona com quem não conhece a gente.
- **Buraco de medição.** A mensagem simples do Antônio pra lista de 28/09 e o resultado da R1 da Paralela
  (05/10) não estão no Hounder. Sem isso o placar mente. Muda: todo toque vira atividade no mesmo dia.

## Respostas reais

- **29/09 · Talina e Bioclin · o passo 1 foi respondido pelo robô do WhatsApp Business em segundos.**
  Não é resposta (a trava do passo 2 reconhece os dois textos) e não derruba a oferta: a saudação nativa
  cuida da chegada; o que a Hórus oferece nos dois casos é o **depois** (retorno de quem pediu orçamento
  e sumiu; horário de quem confirma e falta). Muda: o robô vira sinal (S14 em `10-sinais.md`), e a
  oferta nunca é "o que o robô já faz". **Mas o robô NÃO entra no corpo** (correção do Marcelo, 29/09):
  não é a dor do lead, soa como quem inspecionou o WhatsApp dele e planta sozinho a objeção "já temos
  automação". Só se o lead trouxer o assunto, com a objeção `ja_tem_automacao` do playbook. Nunca
  responder ao robô fingindo ser cliente (o da Talina pede data, tipo e convidados: seria pretexto).
- **29/09 · Talina · a sócia (Jéssica) respondeu depois do robô que pede data e convidados.** Ela
  provavelmente achou que era cliente. O corpo abre dizendo quem é e que **não é orçamento de evento**,
  pra ela não se sentir enganada quando perceber que é oferta.

- **29/09 · LevSaúde · a pergunta das duas saídas funcionou até a metade.** A Fernanda escolheu "pode
  falar comigo que eu passo" e, depois do corpo, respondeu "vou passar pro setor responsável, caso ela
  autorize eu te dou o retorno". É continuação, não avanço (Rackham). O que fazer nesse ponto: facilitar o
  repasse com prova (o print) e pegar o nome da dona, sem empurrar a oferta de novo. Acompanhar se a dona
  responde: é o primeiro dado real sobre passar pela recepção.

- **28/09 · LevSaúde · o passo 1 saiu às 23h31 e quem respondeu foi a secretária, na manhã seguinte.**
  Muda: o Farejador agora só envia em horário comercial (seg a sex 8h30 às 18h, sábado 9h às 12h), e
  todo mapa de respostas tem o caso "respondeu a recepção" (`20-escrita.md` §6).
- **24 e 28/09 · Land Car e LevSaúde · a primeira "resposta" foi o robô do WhatsApp Business** ("A Land
  Car agradece seu contato", "Seja muito bem-vindo(a)", "Não estamos disponíveis no momento"). A trava do
  passo 2 contava isso como resposta e liberava o corpo sem ninguém ter lido. Muda: resposta automática
  não conta (`pareceAutoResposta` em `revisor.js`, usada no painel, no Farejador e no `aprender.mjs`).
  Métrica que vale é resposta **humana**, e de preferência positiva.
- **24/09 · Autobahn, Land Car · sem resposta ao corpo, que foi em 3 a 5 balões e 92 a 129 palavras.**
  Muda: corpo numa mensagem só, até 60 palavras (o revisor avisa acima de 60 e veta acima de 90).
  Indício com dois casos, não prova.
- **24/09 · Casa Verona · recusou: "não temos como expor valores", "não quero molde engessado".**
  Já está na doutrina (§10): negócio de orçamento lê "pacotes" como tabela de preço.

## Teste cego antes x depois (29/09, 4 leads, o Marcelo escolheu sem saber qual era qual)

**Resultado: o método antigo ganhou de 3 a 1.** LevSaúde, Talina e Harmony ficaram com a versão antiga;
Bioclin ficou com a nova, sem o pedido de horário. O que isso ensina:

- **Pedido de ligação com dois horários no corpo frio: rejeitado nas duas vezes** (Talina, Bioclin). O
  fecho padrão continua "quer que eu te explique como funciona/ficaria?". Horário só depois do primeiro
  sinal de interesse (já era a doutrina, `cold-message-processo.md`). Muda: saiu o aviso de "fecho
  repetido" do revisor e a instrução de variar o pedido; o dono não compara a mensagem dele com a do
  vizinho, e o fecho que funciona pode se repetir. O que não pode se repetir é o **corpo** (a tese).
- **Generalização sobre o cliente do mercado passou** ("quem pede orçamento de casamento costuma pedir
  em vários espaços"). É conhecimento do mercado, não afirmação sobre a operação do lead. A Regra 4
  continua valendo pro que é dele ("vocês perdem cliente"). O revisor segue avisando, com a dica ajustada.
- **"Dezembro tá chegando" (por que agora) perdeu no Talina.** Um caso só; o calendário fica como
  opção, não como regra.
- **Na recepção, ele preferiu mandar o fato inteiro + a oferta + a licença** (LevSaúde, pra secretária)
  a pedir primeiro a responsável. A lista completa dos cinco botões quebrados também passou: lista de
  fato conferível não é tique de IA.
- **Harmony: a pergunta de duas saídas ("foi de propósito, ou ainda não deu tempo?") agradou, mas perdeu
  pra fato + oferta + licença.** No passo 2, a oferta dita vence a pergunta sozinha. A pergunta de duas
  saídas fica melhor como passo 1 (caso Cavalcante) ou como resposta.
- **Bioclin, o erro que o Marcelo pegou:** a versão nova oferecia "confirmação na véspera", mas a dor dela
  é a paciente que **confirma** e some, ou seja, confirmação ela provavelmente já faz. Ofertar o que o
  lead já tem é o erro mais caro (Regra 5). Muda: antes de oferecer, perguntar "pelo próprio fato, ele já
  tem isso?".
- **Voz:** "Fui pelo link do Instagram de vocês" (olhar de cliente) ganhou de "Abri o Linktree de vocês".

## Revisão dos leads parados (15/10, pedido do Marcelo: "aprenda com nossos erros")

- **Débora: o erro de fundo foi de qualificação, não só de demora.** No primeiro dia ela contou que estava com o caixa
  zerado, que já tinha site e que a irmã ia ajudar. Pela régua do `comercial.md` ("tem vítima, tem data, tem valor?"),
  isso já dizia que ela não ia pagar. Mesmo assim foram seis dias de produção e quatro demos. Se tivesse saído em 24h,
  o provável era um site grátis sem receita, o que a regra do Conselho de 09/10 proíbe. Muda: **caixa zero dito pelo lead
  limita o investimento a uma amostra de uma hora** até existir compromisso (`comercial.md`, 15/10).
- **Cintya: pergunta de cliente pelo número da prospecção queimou o lead.** Em 14/10 saíram "Voces atendem homens
  tambem?" e "Quais procedimentos?" para o robô dela. A pessoa que assumiu a conversa recusou meia hora depois. Muda: **testar
  o robô ou o atendimento de um lead nunca pelo número que prospecta.** Pelo mesmo número, isso vira pretexto (proibido,
  `comercial.md` §1).
- **Recepção de clínica, de novo: 0 reunião em 6 clínicas por WhatsApp** (Cavalcante, LevSaúde, Harmony, Cintya,
  Bioclin, Spaço). Todas as reuniões vieram de voz ou de relação. A pesquisa de 09/10 diz o mesmo
  (Parte 1, itens 8 e 1). Muda: em clínica, o WhatsApp fica só pra pedir horário; o contato com a dona é por ligação ou
  visita.
- **Entregar antes do compromisso caiu quatro vezes em 15 dias** (Sates, Débora, Spaço, Aion) e já é regra (`comercial.md`,
  15/10). A pesquisa chama isso de "a estratégia com mais relatos de fracasso em 2026" (Parte 1, item 6; T1 e T2).

## Correções do Marcelo

- **15/10 · Débora Reis · "Será que a gente deixa mesmo pra marcar reunião agora? Ela parece querer se conectar e tenho medo
  de parecer um vendedor nervoso".** Às 20h04 ele perguntou "Fica melhor uma ligação?" (tirou os dois horários do meu
  rascunho). Ela respondeu com afeto ("ameiiii", "salva o meu número", "vc ama seu trabalho") e uma pergunta sobre ele, sem
  tocar na agenda. Eu devolvi a ligação com dois horários; ele segurou. Ele estava certo: ela já tinha dito no áudio qual era
  o próximo passo (ler as ideias no dia seguinte e chamar para tirar dúvidas), e repetir o pedido 40 minutos depois troca
  conexão por pressão. Muda: **lead em modo de conexão que já disse o próximo passo não recebe pedido de agenda de novo no
  mesmo dia; a resposta retribui (de preferência com uma frase dele mesmo) e termina sem pergunta. Se ele não voltar no prazo
  que deu, uma linha só no dia seguinte.** Não revoga o "horário fechado depois de sinal de compra" (Talina, 06/10): elogio e
  carinho não são sinal de compra. Mesma família de "aceitar o obrigado".
- **15/10 · Débora Reis · "Suas mensagens para os clientes estão cada vez melhores... gostei" (acerto, repetir).** As que ele
  elogiou eram curtas, respondiam o que ela perguntou e devolviam uma frase dela ("nenhuma casa sua é igual à outra", do "nunca
  projetei a mesma casa duas vezes" do site). Muda: **o elogio que aproxima usa as palavras do próprio lead, não adjetivo nosso.**
- **15/10 · Débora Reis · "Deixe o site de ideias bem claro e organizado para ela não ter dúvida e a gente não precise
  explicar".** Ela disse que leu rápido e não entendeu, e eu tinha montado um balão de 81 palavras explicando a página. O
  defeito estava na página, não na mensagem. Muda: **material de demonstração se explica sozinho (mapa no topo e, em cada
  peça, "o que é", "como o cliente usa", "o que muda pra você"); explicação longa por WhatsApp é sinal de página mal
  organizada.** Item no `design/99-checklist.md`.
- **15/10 · Débora Reis · a escolha dele sobre o amigo: "não precisa resolver isso tudo agora e nem se sentir constrangida".**
  Ela contou, sem graça, que preferiu o nosso site ao do amigo. Meu rascunho dizia "a gente acha um jeito que fique bom pra
  todo mundo", e ele trocou por tirar o peso. Ele estava certo: o meu texto deixava o problema na mesa e punha a gente como
  parte da disputa; o dele dá permissão pra não decidir. Muda: **quando o lead está constrangido, nomear o sentimento e tirar
  o prazo ("não precisa resolver agora"), sem prometer solução nem falar do concorrente.** Mesma família de "aceitar o obrigado".
- **15/10 · Débora Reis · "Tire tudo o que tiver com o nome Horus" e a escolha do "Sou sim! Trabalho com marketing, mais na
  parte de criação"** (ele mandou a versão sem "agência pequena com um sócio"). Com ela, o Marcelo se apresenta como pessoa:
  o selo "Prévia feita pela Horus" saiu das 9 páginas e a assinatura ficou só "Marcelo". Leitura: lead em modo de conexão,
  com parceria pessoal na mesa, ouve "agência" como vendedor. Muda: **material e mensagem para a Débora sem o nome da
  agência; se ela perguntar se ele tem empresa, a resposta é a verdade. Vale só para a Débora** (Marcelo, 16/10: "tirar o
  nome da agência vale só para a Débora"); nos outros leads o nome segue normal. Mesma família de "soar de gente, não de
  agência" (22/09).

- **15/10 · Débora Reis · a escolha dele no último envio: o link direto, sem a pergunta.** Recomendei um rascunho que
  terminava em "Quer que eu te mande o link?". O Marcelo mandou os dois links direto e escreveu o resto do jeito dele:
  "Como eu tinha te prometido, aqui estão as prévias", "fica à vontade para olhar apenas como algumas ideias extras, sem
  compromisso. Quis cumprir o que tinha te falado", "Torço para que você atraia clientes que valorizem seu processo... se
  precisar de algo relacionado a marketing pode chamar". Ele estava certo. A licença já tinha sido dada em 14/10, quando
  ele escreveu "amanhã te mando o link". Perguntar de novo atrasaria em mais uma volta uma entrega que já estava atrasada,
  e o objetivo era fechar com a promessa cumprida, não abrir outra conversa. Muda:
  - **promessa feita é licença dada.** A mensagem que cumpre uma promessa entrega a coisa, curta, sem pedido;
  - "a pergunta pede licença pra dar" vale para a primeira oferta, não para o que já foi prometido;
  - o encerramento leva três coisas: a promessa cumprida, um desejo verdadeiro e a porta aberta, sem pedir nada.
  O mesmo caminho estava no conselho que ele trouxe às 12h32 ("mande uma última mensagem curta, com o link, sem tentar
  vender outra coisa"). Eu respondi com uma pergunta a mais.
- **15/10 · Débora Reis · antes da mensagem final, ler a conversa real.** O rascunho v1 abria com "o site ficou lindo!",
  e o Marcelo já tinha dito "Ficou muito bonito" 13 horas antes, com o "Obrigada" dela em seguida. A conferência pegou o
  erro porque leu o `whatsapp_ultimas` da ficha. Muda: a mensagem se escreve depois de ler as últimas trocas, nunca só o
  dossiê.
- **14/10 · Débora Reis · "Oxe, mas em um chat você tinha recomendado isso... por que você errou?"** Duas sessões
  recomendaram passos diferentes para a mesma resposta dela: numa, o link com 10 minutos de vídeo; na outra, só a
  promessa do link. Muda: antes de sugerir, ler o último rascunho na ficha do Hounder (lá desde a regra de 15/10). Se a
  recomendação mudar, dizer qual versão ela substitui e por quê.
- **09/10 · Débora Reis · "a gente já fez milhões de versões dessa. Me diga a definitiva. Passamos o dia inteiro e nem
  mandei nada".** Com o lead esperando, cada versão nova é mais uma hora sem resposta. Muda: entregar **uma** mensagem
  recomendada, pronta para copiar, e no máximo uma alternativa, só se houver motivo diferente. O refino vem depois que a
  mensagem saiu.
- **15/10 · Débora Reis · "meu problema foi demorar demais para enviar mensagem pra ela".** Ela se abriu em 09/10, o
  esboço foi prometido em 24h e passou por seis rodadas de ajuste antes de ela ver; em 15/10 ela mandou o site novo
  feito por um amigo. Muda: **o esboço vai quando cumpre a promessa, imperfeito e marcado "Demonstração"; o polimento
  vem depois de ela dizer que quer ver.** Mesma família de "a demora mata o dois passos" (08/10).

- **09/10 · Spaço Saúde · "queria outro 2B, já testamos assim e não funcionou".** A versão que mandava a oferta pra
  recepção repassar repetia Cavalcante (recusou em 1min30), LevSaúde (segurou) e Harmony (não repassou). Muda: **pra
  recepção de clínica, só se pede horário ou o contato de quem decide, sem oferta e sem o nome da agência.** A oferta
  vai direto pra quem decide.
- **09/10 · Débora Reis · "marcar reunião presencial pra tomar um café com quem eu nem conheço é estranho".** O
  Conselho tinha sugerido café no escritório dela. Muda: com quem não te conhece, o próximo passo é mensagem ou
  ligação curta; presencial só depois de existir conversa.

- **09/10 · Débora Reis · "o 1 já mostra que a gente vai oferecer algo; o 2 é muito invasivo, a gente já chega
  oferecendo".** Ela se abriu (já tem site sem ligar ao Google, irmã de marketing prometeu ajudar, um projeto só
  no ano, caixa zerado) e as duas sugestões falharam: pedir o link do site sinalizava oferta, e a outra oferecia o
  esboço na hora. Muda: **quando o lead se abre, a resposta não oferece nem sinaliza oferta.** Uma reação de gente
  e uma pergunta só, sobre o negócio dele e o que ele já fez ("esse projeto que segurou o ano, veio por
  indicação?"), que ele gosta de responder e cuja resposta diz o que oferecer. Base: pesquisa de 09/10 (Parte 3,
  pergunta sobre o negócio; Parte 6, oferta depois da resposta), Mom Test (passado, não hipótese) e o tom das
  transcrições. Toda sugestão de mensagem se apoia na pesquisa e na doutrina e passa pelo revisor.
- **09/10 · Débora e Spaço Saúde · conversa automática.** As três respostas da Débora não chegaram ao Hounder
  (provável LID sem mapeamento no Farejador): automação e placar dependem de a mensagem entrar no banco.
  Conferir pelo celular quando um lead "não responde" há horas.

- **05/10 · Land Car e Autobahn · "por que voltaríamos? Eles nem responderam".** A geladeira com data de voltar
  veio do benchmark de cold e-mail B2B (`20-escrita.md` §10), não do network nem do Marcelo. Muda: quem nunca reagiu
  ao corpo nem ao follow-up vai pra **perdido**; geladeira com data só pra quem mostrou interesse ("agora não", ou
  respondeu bem e sumiu). Perdido só reabre com fato novo (caso Cavalcante, 05/10: começou a anunciar implante pra
  paciente, que era o gatilho anotado).

- **05/10 · LevSaúde · "ela poderia só dizer: Ah! Obrigada, vamos corrigir agora mesmo".** Se o problema da
  mensagem se conserta sozinho em um minuto (link quebrado), o achado vira presente e a conversa acaba no
  "obrigada". Muda: o fato que vai na mensagem é o que eles não resolvem sozinhos (domínio fora do ar, página que
  não existe), e o pedido oferece algo concreto nosso (a demonstração), não a correção.
  **06/10 · Cavalcante, mesma família:** "o anúncio leva pro perfil, não pro WhatsApp" a recepção só repassa pra
  quem cuida dos anúncios, que troca o botão. Muda: o teste vale também pra terceiro ("alguém da equipe dela
  resolve isso sozinho?"); se sim, o fato não segura a mensagem. Na Cavalcante, a página do implante também caiu
  ("ela já tem site", 03/10) e a tese passou a ser o orçamento de implante decidido em casa (catálogo S2).

- **05/10 · Bioclin · "facilmente respondida com um não precisamos de site".** O fato de ausência sozinho
  (botão de site abre o Instagram, não há página do tratamento) deixa a resposta mais fácil ser a recusa.
  Muda: o fato precisa vir preso a algo que ela quer e ainda não tem. Na Bioclin, o ângulo novo é a
  mentoria (catálogo S6), não mais o site. Mesma família da Cavalcante (03/10): "site" não é dor pra
  quem acha que o Instagram resolve.

- **03/10 · Cavalcante · "ela já possui site".** Página de links (inforempresa, Linktree) é site aos olhos
  da dona: abrir com "falta o site" ou "aparece sem site" soa como quem não olhou. Sem outra dor, o lead
  vai pra geladeira em vez de ganhar uma terceira versão da mesma tese.
- **03/10 · Cintya · "parecer cliente" quer dizer olhar de cliente, não fingir ser cliente.** "Vendo a
  clínica com olho de cliente" baixa a guarda sem pretexto (e ela já sabia que não era agendamento). O
  benefício do site sobre o Instagram entra pela experiência de quem está decidindo, não como argumento.

- **29/09 · secretária: depende de quem o problema expõe.** Se é trabalho dela, pede o dono (mandar o
  corpo é mandar crítica a ela, e ela filtra); se não é culpa dela, dá as duas saídas ("falo com a
  responsável, ou te explico e você repassa?"). Corrige o que o teste cego tinha sugerido (mandar o corpo
  direto pra ela). Está em `20-escrita.md` §6 e no prompt do Farejador.

- **29/09 · o jeito de escrever dele** (modelo da criolipólise): fato → "pra evitar que" → "eu posso
  montar pra vocês" → pergunta. Proibido dois-pontos de efeito, frase de impacto no fim, lista de três,
  "imagino que", "geralmente", elogio enfeitado. Está em §10 e no revisor.
- **28/09 · sempre mais de uma abordagem no passo 2**, ângulos de verdade diferentes; a do site entra
  quando não há site ou o botão leva pro Instagram.

## Achados do lote (o revisor)

- **29/09 · as 18 mensagens de passo 2 pendentes:** a variante "Google sem site" saiu com o mesmo
  esqueleto em 4 leads (Bioclin, Cintya, LevSaúde, Talina), a de "anúncio que some" igual na Bioclin e
  na Cintya, e todas fechavam em "quer que eu te explique como funciona/ficaria?". Muda: a investigação
  recebe as mensagens recentes dos outros leads e não pode repetir esqueleto (`20-escrita.md` §5).
