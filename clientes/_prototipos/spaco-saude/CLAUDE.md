# Spaço Saúde: esboço (lead, odontologia, Graça/Salvador · CFO)

> ⚠️ **LEAD, não cliente.** Esboço privado (`noindex`) pra mostrar na conversa. Estado comercial no
> Hounder (ficha `dfac495f-15c4-4773-8221-b2220900d0d2`). Não vendeu: apagar as fotos da clínica.

## Rodada 4 do esboço (14/10/2026, noite): as 5 imagens do Marcelo

No ar no mesmo link (https://esboco-spaco-saude.vercel.app). As imagens dele são a especificação; o que foi trocado por
integridade ou CFO está na tabela do `PLANO.md`. Logo real (site Wix antigo) e fotos reais da ficha do Google (fontes em
`fotos/FONTES.md`). Sem faixa escura. Avaliações em esteira da direita para a esquerda, com pausa. Rodada 3 em `versoes/rodada-3/`.
- Detector: sobram `cream-palette` (fundo medido nas imagens dele), `marquee` (pedido dele, com pausa, para no hover e vira
  rolagem manual com movimento reduzido) e 1 `tight-leading` sem elemento (falso alarme já medido).
- Conferido em Playwright (1440, 1024, 768, 390): sem rolagem lateral, sem erro; formulário, "ver todos", "saiba mais" e pausa testados.
- Falta da clínica: logo em vetor, foto de cada tratamento, formação da Dra., nome e CRO da equipe, responsável técnica.

## Rodada 3 do esboço (14/10/2026, noite): estrutura da Debski Clinic

No ar no mesmo link (https://esboco-spaco-saude.vercel.app). Detalhe e tabela seção por seção em `PLANO.md`;
rodada 2 em `versoes/rodada-2/`. Saiu o checklist dos sinais (o Marcelo achou estranho, e não veio de referência
nenhuma); entrou a faixa de avaliações do Google (3 trechos reais, nome abreviado, aviso de autorização).
Cores agora medidas nos posts. Horário da ficha do Google (seg a sex 8h às 17h, sáb 8h às 12h), não mais do Wix.
- Detector (`npx impeccable@4.0.4`): sobram 4, justificados. `cream-palette`: o fundo é o dos posts da clínica (marca
  vence). `marquee`: a esteira é a da Debski, tem botão de pausa, para no hover e some com movimento reduzido.
  2 `tight-leading` sem elemento: medido no navegador, só títulos em serifa (1,06 a 1,15) e círculos de ícone; corpo em 1,6.
- Conferido em Playwright (1440, 1024, 768, 390): sem rolagem lateral, sem erro, formulário e pausa testados.

## Rodada 2 do esboço (14/10/2026, tarde): referências do Awwwards

Pedido do Marcelo: melhorar com referências do Awwwards e dos posts, sem cara de IA nem redundância. Plano e passe
duplo em `PLANO.md`; a rodada 1 está em `versoes/rodada-1/`. **Publicada em 14/10 no mesmo link**
(https://esboco-spaco-saude.vercel.app), a pedido do Marcelo.

- Referências: Aventura Dental Arts (SOTD), LAVA dental e Minémal (menções honrosas).
- Assinatura: **os sinais** (frases do post de bruxismo) que a pessoa marca; o painel diz com qual tratamento
  costumam ter relação e leva os sinais para a mensagem do WhatsApp. Ressalva fixa: não é diagnóstico.
- Título do hero é a frase deles: "Aqui, seu atendimento começa antes mesmo da consulta." (post Dd6IR).
- Gambarino + Synonym (Fontshare, licença ITF livre para uso comercial) no lugar de Gloock + Public Sans.
- Retrato da Dra. recortado do post Dbs88 (`dra.webp`, 761 px de largura). Fotos em WebP.
- Detector (`npx impeccable@4.0.4`, o `detect.mjs` local continua no-op: testado contra arquivo ruim, não acusou):
  sobra 1 `tight-leading` "0,44x" sem elemento. Medido no navegador: nenhum elemento abaixo de 0,6 de razão; é o
  quirk de ler entrelinha sem unidade como rem (`99-checklist.md` §4). Contraste da paleta medido no `PLANO.md`.
- Conferido em Playwright (1440, 1024, 768, 390): sem rolagem lateral, fontes carregando, sem erro no console;
  sinais, mensagem do WhatsApp, atalhos de tratamento e frase da Dra. testados.
- Preenchido com o que já tínhamos (14/10): nota 4,9/124 e "desde 2018" (Hounder, conferido em 02/10); horário seg a sex
  8h30 às 17h e sáb 8h às 12h, áreas da equipe, serviços extras e e-mail (site Wix de 2019, horário marcado "a
  confirmar"); "particular ou plano" no formulário e na pergunta frequente (robô do WhatsApp deles pede nome completo,
  tratamento e particular/plano).
- Ainda falta: formação da Dra., nome e CRO da equipe, responsável técnica, CRO-BA 12600 conferido no CFO.

## Decisão pendente (14/10/2026): a recepção disse "não"

**Esboço no ar (14/10, privado, `noindex`): https://esboco-spaco-saude.vercel.app** (projeto Vercel
`esboco-spaco-saude`; publicar de novo: copiar `site/` pra uma pasta com esse nome e rodar
`npx -y vercel@60.0.0 deploy --prod --yes --name esboco-spaco-saude`). Compliance CFO conferido no texto; CRO ainda não.

A 1A saiu em 14/10, 15h18. O robô respondeu, e às 15h35 a recepção respondeu citando a pergunta: "Olá não" (a
Dra. não atende por esse número). O número usa a plataforma de atendimento da Meta (WhatsApp Business API).
Três caminhos, o Marcelo escolhe (tarefa no Hounder):

1. **Pedir número ou horário da Dra.** (2B). Risco: a recepção não passa e para de responder.
2. **Mensagem feita pra ser encaminhada**, honesta, endereçada à Dra., com o link do esboço. Antes: ~~publicar o
   esboço~~ (feito em 14/10, hoje na rodada 4), passar no compliance CFO (CRO não conferido no CFO) e
   reconferir no dia o Agendar quebrado do Wix. Revê a correção de 09/10 (sem oferta pela recepção): é teste,
   não regra nova.
3. **Trocar de canal:** ligar no fixo (71) 3235-3247 pedindo a Dra. Ângela pelo nome, ou ir à clínica com o
   esboço no celular. É o que a pesquisa de 09/10 indica pra clínica (princípio 5, achado 8).

Recomendação do Claude: 2 agora, 3 se não houver reação até sexta 16/10.

## Estado (09/10/2026) · histórico: o esboço descrito aqui é a rodada 1, trocada em 14/10 (ver as rodadas acima)

- **10/10:** a 1A não saiu no sábado. A pedido do Marcelo, ficou **agendada no Disparos pra terça 13/10, 9h30**
  (segunda 12/10 é feriado). Plano da semana em `_memoria/prospeccao/semana-2026-10-13.md`.

- **Abordagem:** `esboco-24h` (o roteiro das transcrições de cold call, por texto). O Marcelo escolheu a
  abertura **1A** ("Oi, tudo bem? Consigo falar com a Dra. Ângela por aqui?") e, quando a Dra.
  responder, a **2A** (Wix de 2019 com o Agendar quebrado → "comecei a montar um site novo", pronto em
  24h, se não gostar não paga, "Posso te mostrar?"; os horários só depois do sim). Se responder a
  recepção, a 2B pede só um horário ou o contato da Dra., sem oferta.
- **Esboço:** `site/`, uma página, começado em 09/10. Recepção real ("Nosso espaço, projetado com muito
  carinho"), retrato da Dra. recortado de um post, tratamentos com as palavras dos posts deles, e o
  **Agendar que funciona** (escolhe o tratamento e abre o WhatsApp com a mensagem pronta), que é o que o
  Wix deles não faz. Paleta roxo e dourado dos posts. Fotos e legendas em `fotos/FONTES.md`.

## Conversa conduzida pelo Claude (pedido do Marcelo, 09/10) · CANCELADA em 09/10, 16h: o Marcelo conduz

Mesmo esquema da Débora: o vigia (`ferramentas/hound-dog/scripts/conversa-auto/vigiar.mjs`) acorda o
Claude quando alguém responde; o envio sai pela fila do Farejador (`enviar.mjs`). Curto, direto. **Pela
pesquisa de 09/10 (aprovado pelo Marcelo):** o corpo termina em "Posso te mostrar?"; depois do sim, ou de
qualquer sinal de interesse, toda resposta termina em dois horários, com a opção de ir ao consultório. Horários: "hoje 17h30 ou amanhã 10h" antes das 16h, "amanhã 10h ou
11h" depois (sábado de manhã só se a clínica abrir).

- **A Dra. respondeu** → 2A: "Dra., aqui é o Marcelo, da Hórus. O site da clínica ainda é o Wix de 2019,
  com o Agendar sem funcionar. Comecei a montar um site novo pra Spaço Saúde, fica pronto em 24h. Se não
  gostar, não paga nada. Posso te mostrar?"
- **Disse sim / quer ver** → "Show! Te mostro em 10 min, por vídeo ou passo aí no consultório. Amanhã 10h
  ou 11h?" (ajustar os horários ao momento).
- **A recepção respondeu** → 2B (refeita em 09/10, a pedido do Marcelo): **nenhuma oferta pra recepção**,
  só a logística: "Opa! É o Marcelo. Preciso falar com a Dra. Ângela sobre o site da clínica, é
  rapidinho. Que horas ela fica mais livre, ou tem um número direto dela?". Motivo: nas três vezes
  em que a recepção recebeu a oferta pra repassar (Cavalcante, LevSaúde, Harmony), recusou ou não repassou.
- **Recepção passou o número da Dra.** → gravar na ficha (só o número como veio, nunca presumir dígito) e
  mandar a 2A pra ela, com "a [nome da recepção] me passou seu contato".
- **Recepção passou um horário** → agradecer e mandar a 2A neste mesmo número no horário dito.
- **Recepção: "do que se trata?" / "pode falar comigo que eu passo"** → uma frase, sem a oferta inteira:
  "É sobre o site da clínica, tenho uma coisa pra mostrar pra ela. Qual o melhor horário pra falar com
  ela?" Se insistir pela segunda vez, aí sim vai a oferta curta: "Comecei a montar um site novo pra
  clínica no lugar do Wix, queria mostrar pra Dra. em 10 min."
- **Recepção: "ela tá atendendo / não pode agora"** → "Tranquilo! Que horas ela costuma estar mais livre?"
- **Quanto custa** (P3 aprovada em 09/10, faixa da Fase 1 do `comercial.md`) → "Fica entre R$ 1.200 e
  R$ 2.000, depende de quantas páginas a Dra. quiser. Te mostro o esboço em 10 min, amanhã 10h ou 11h?"
- **Manda o link / manda por aqui** → "Mando sim, mas mostrando eu explico cada parte rapidinho. Hoje
  17h30 ou amanhã 10h?"
- **Já temos quem faz / já temos site** → "Ah massa, o novo já tá no ar? O que aparece no Google ainda é o
  Wix. Vale a Dra. ver o esboço mesmo assim, 10 min. Hoje 17h30 ou amanhã 10h?"
- **Não temos interesse (1º)** → "Entendo. São só 10 min pra Dra. ver, se não gostar fica por isso mesmo."
  **2º não** → "Beleza, obrigado pelo retorno!" e para.
- **Confirmou** → "Fechado! [dia], [hora], [te chamo por vídeo aqui / passo aí no consultório]." Agenda e estágio no
  Hounder na hora.
- **Para e chama o Marcelo:** áudio, paciente achando que é consulta e insistindo, pergunta se é robô,
  assunto clínico, contrato, qualquer coisa fora do mapa. Nunca falar de tratamento nem de preço de
  tratamento.

## Compliance CFO (trava)

- No site: sem antes e depois, sem preço de tratamento, sem promessa, sem superlativo ("excelência que você merece", da
  legenda deles, ficou de fora). Avaliação de paciente: no esboço, trechos reais com aviso; no site publicado, só com
  autorização de cada paciente (régua do CFO, `_conselho/cargos/compliance.md`).
- CRO-BA 12600 da Dra. Ângela vem do Doctoralia, **não conferido no CFO**. Responsável técnica marcada
  "a confirmar com a clínica". Horário de atendimento: falta.
- Os posts do Instagram trazem modelos que podem não ser pacientes nem da equipe: no esboço só entram a
  recepção e a Dra. (a mesma do post que diz "Dra. Ângela").
