# Aprendizados da prospecção

> O que as respostas reais e as correções do Marcelo ensinaram. Uma linha por aprendizado, com a data,
> a origem e o que muda. Curto de propósito: a investigação lê inteiro antes de escrever.
> Fonte de dados: `node ferramentas/hound-dog/scripts/aprender.mjs` (edições do Marcelo no Disparos,
> variante escolhida, quem respondeu). Padrão que aparece duas vezes vira regra na doutrina.

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
