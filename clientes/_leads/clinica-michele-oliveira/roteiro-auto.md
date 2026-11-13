# Roteiro da resposta automática: Clínica Michele Oliveira

> Pedido do Marcelo em 05/11/2026: quando ela (ou a recepção) responder, o Claude lê e responde sozinho com a
> mensagem ideal, validada pela pesquisa de 09/10 (`_memoria/prospeccao/15-o-que-deu-certo.md`). Liga com a etiqueta
> `auto:responder` na ficha; desliga tirando a etiqueta. Código: `ferramentas/hound-dog/farejador/resposta-auto.mjs`.
> Todos os textos abaixo passaram pelo revisor em 05/11 (o veto de preço é a exceção P3, aprovada).

## Regras deste lead

- Biomédica (CRBM): nada de promessa, superlativo, antes e depois, nem "Dra." sem conferir o conselho.
- Quem decide é a Michele. O corpo não vai pela recepção (regra 11 da pesquisa).
- "Amanhã" quer dizer o próximo dia útil. Se hoje é sexta, escreva "segunda". Sábado e domingo, também "segunda".
- Horários oferecidos: só 10h e 16h. Se ela propuser outro horário, é caso "outro" (o Marcelo confirma a agenda).

## Os casos e o texto aprovado

**abertura_respondida** (a Michele respondeu ao "Bom dia"): mande o corpo aprovado do Disparos, igual:
> Vi que o site da sua bio está fora do ar. Quem clica pra conhecer os procedimentos cai num erro. Pra evitar que essa pessoa desista antes de marcar, eu posso montar um site novo pra você, com cada procedimento explicado do seu jeito. Posso te mostrar amanhã como ficaria?

Se ela cumprimentou ou perguntou quem é, pode vir antes um balão de até 6 palavras ("Tudo ótimo, obrigado!" ou
"Prazer, Michele!"). Nunca mais que isso.

**recepcao** (quem respondeu não é a Michele):
> Obrigado! Qual o melhor horário pra eu falar com a Michele por aqui?

Se a recepção perguntar do que se trata:
> É sobre o site da clínica, que está fora do ar. Prefiro mostrar direto pra ela. Qual o melhor horário pra falar com ela?

**sim** (depois do corpo, ela disse pode, quero ver, manda, sim):
> Que bom! Te mostro amanhã. A prévia não custa nada. Se você gostar e quiser o site, ele fica entre R$ 1.200 e R$ 2.000, depende de quantas páginas. Prefere ver às 10h ou às 16h?

**preco** (perguntou quanto custa antes de dizer sim):
> Fica entre R$ 1.200 e R$ 2.000, depende de quantas páginas. Pra ver como ficaria você não paga nada. Te mostro amanhã, prefere às 10h ou às 16h?

**escolheu_horario** (escolheu 10h ou 16h):
> Combinado! Amanhã às 10h te chamo aqui e te mostro como ficou.

(Troque o dia e a hora pelo que ela escolheu. O Marcelo recebe o aviso pra pôr na agenda e a casa monta o site.)

**sem_interesse** (não quer, já tem quem faça, agora não):
> Tranquilo, Michele. Obrigado pelo retorno!

**obrigado** (agradeceu e não pediu nada): aceite o obrigado em uma frase curta e não ofereça mais nada.

## Sempre com o Marcelo (caso "outro", nada sai sozinho)

Áudio, foto, pergunta técnica ou clínica, pedido de ligação, reclamação, outro horário, pergunta sobre a Horus que
não está aqui, desconfiança de golpe, ou qualquer dúvida. O Claude manda a sugestão pro WhatsApp dele e espera.
