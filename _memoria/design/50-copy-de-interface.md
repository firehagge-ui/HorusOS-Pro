# Copy de interface

> Criado em 28/07/2026, a partir da seção de escrita da skill `frontend-design`
> da Anthropic, adaptado pro contexto da Horus.
>
> **Não confunde com copy de venda.** Copy de venda é o que está em
> `90-antipadroes.md` na seção Conteúdo: verbo de folheto, número inventado,
> frase fofa sem sentido. Aqui é o texto pequeno que faz a coisa funcionar:
> botão, rótulo, erro, tela vazia, confirmação. Ninguém elogia esse texto quando
> está certo, e todo mundo trava quando está errado.

Onde isso aparece na operação: formulário de contato, bot de WhatsApp, campo de
agendamento, mensagem de erro, tela de "enviado". Ou seja, exatamente onde o
cliente perde gente sem nunca ficar sabendo.

---

## A regra de base

Palavra em interface existe por um motivo: **facilitar o entendimento, e portanto
o uso.** Não é enfeite, é material de construção, do mesmo nível do espaçamento e
da cor. Antes de escrever qualquer rótulo, a pergunta é o que a tela precisa
dizer, e como dizer isso ajuda a pessoa a seguir.

---

## 1. Nomear pelo que a pessoa reconhece

O nome sai do mundo de quem usa, nunca de como o sistema foi construído.

| Não | Sim |
|---|---|
| "Configurar integração de mensagens" | "Escolher como quer ser avisado" |
| "Enviar formulário de contato" | "Enviar mensagem" |
| "Selecionar tipo de atendimento" | "Escolher o serviço" |

Vale principalmente em saúde, onde metade do público não é de tecnologia e a outra
metade está ansiosa. Palavra de sistema soa a burocracia, e burocracia assusta
quem já estava inseguro de procurar ajuda.

## 2. Voz ativa, e o botão diz o que vai acontecer

O controle nomeia a ação, não a mecânica.

| Não | Sim |
|---|---|
| "Enviar" | "Enviar mensagem" |
| "Submeter" | "Agendar conversa" |
| "OK" | "Confirmar horário" |
| "Continuar" | "Ver especialidades" |

"Enviar" sozinho não diz o que vai embora nem pra onde.

## 3. A palavra é a mesma do começo ao fim

Se o botão diz **Agendar**, a confirmação diz **Agendado**. Não "Solicitação
registrada com sucesso".

O vocabulário da interface é a placa de rua de quem está andando ali. Trocar a
palavra no meio do caminho é trocar a placa depois que a pessoa virou a esquina.
Isso vale entre página e bot também: se o site chama de "primeira conversa", o bot
não chama de "triagem inicial".

## 4. Erro nomeia o problema e a saída

Erro não pede desculpa, não usa a voz de uma pessoa, e nunca é vago.

| Não | Sim |
|---|---|
| "Ops! Algo deu errado 😔" | "O e-mail não foi enviado. Tente de novo ou escreva para contato@..." |
| "Campo inválido" | "Falta o DDD no telefone" |
| "Erro 500" | "Nossa página de contato está fora do ar. O WhatsApp continua funcionando: (71) ..." |

E a regra que mais quebra na prática: **se o formulário não tem servidor, ele não
finge que enviou.** Ou avisa, ou não existe. Formulário que engole a mensagem em
clínica de saúde é gente que pediu ajuda e acha que foi ignorada.

## 5. Tela vazia é convite, não lamento

"Nenhum resultado" é um beco. "Nenhum artigo sobre esse tema ainda. Veja os mais
recentes" é uma porta. Toda tela vazia diz o que fazer em seguida.

## 6. Cada elemento faz um trabalho só

Rótulo rotula. Exemplo exemplifica. Texto de ajuda ajuda. Nada faz duas coisas de
fininho.

O caso mais comum é o **placeholder virando rótulo**: o campo mostra "Seu nome"
por dentro, a pessoa começa a digitar, o rótulo some, e ela não sabe mais o que
aquele campo era. Rótulo fica **acima** do campo, sempre, e permanece visível.

## 7. Registro conversacional, sem enfeite

Verbo simples, frase em caixa normal (não caixa alta), zero enchimento, tom
calibrado pro público. Em psicologia e odontologia isso significa **sóbrio**:
nem seco a ponto de parecer formulário de banco, nem eufórico a ponto de parecer
promoção.

---

## O que trava aqui, em cliente regulado

Copy de interface parece inofensiva e não é. Três pontos onde ela vira problema de
compliance:

- **Rótulo que promete resultado.** "Comece seu tratamento", "Resolva sua
  ansiedade" e "Garanta seu sorriso" são promessa, mesmo em botão de 12px. Botão
  descreve a ação da pessoa, não o desfecho clínico.
- **Campo que coleta dado sensível sem base.** Formulário que pergunta sintoma,
  diagnóstico ou histórico exige LGPD explícita e política de privacidade linkada.
  Na dúvida, o formulário pede só nome e contato, e o resto é conversa.
- **Bot que responde clínico.** Mensagem automática não avalia sintoma, não sugere
  conduta e não tranquiliza sobre quadro. Ela agenda, informa e encaminha. O que
  for clínico passa por revisão humana antes de existir.

E a faixa de crise em saúde mental (CVV 188, emergência 192) é texto de interface
como qualquer outro: precisa estar visível, legível, e não escondido no rodapé em
10px.
