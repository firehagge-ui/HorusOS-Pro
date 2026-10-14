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

## Correções do Marcelo

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
