# Débora Reis Arquitetura: esboço (lead, interiores, Barra/Salvador)

> ⚠️ **LEAD, não cliente.** Esboço privado (`noindex`) pra mostrar na conversa. Estado comercial no
> Hounder (ficha `95fc7889-3564-4d15-beca-dc9a042dcf13`). Não vendeu: apagar as fotos dela e
> reaproveitar só a estrutura (`../README.md`).

## ⛔ Encerrado em 15/10/2026

O Marcelo decidiu que a Hórus não vai mais trabalhar para a Débora `[FALTA: o motivo, para a ficha do Hounder ir para
Perdido]`. Pelo `../README.md`, quem não vendeu tem as fotos apagadas e a estrutura vira template. Apagar e tirar o
esboço do ar esperam o ok do Marcelo. Fica o aprendizado: `PROPOSITO-DAS-SECOES.md` e os teardowns em `referencias/`.
A conversa automática do 09/10 (seção "Estado anterior") está encerrada junto.

## Regra de escrita deste projeto (Marcelo, 14/10/2026)

Todo material que a Débora vê é escrito como se o Marcelo tivesse preparado. O guia fica na voz dela, em primeira
pessoa. Não entra nota de bastidor ("texto de simulação", "na versão final..."). O que não é definitivo leva só a
etiqueta **"Demonstração"**. O texto passa pela régua de `_memoria/prospeccao/90-cara-de-ia.md`.

## 15/10/2026, noite: versão nova a partir do `PROPOSITO-DAS-SECOES.md` (pedido do Marcelo)

- **Backup antes de mexer:** `versoes/antes-proposito-15-10/`, uma cópia completa e funcional do site.
- **Aplicado o que não depende de dado da Débora**, as mudanças marcadas "antes da chamada" no documento:
  - **Capa:**
    - a foto emoldurada pelo papel, com teto de 1180 px, porque o arquivo de 1080 px amolecia de ponta a ponta;
    - o serviço na linha de apoio, a formação como prova e um botão;
    - saiu o "desde 2004" junto de Salvador (também na descrição e na prévia do link) e a legenda solta "O retrato da
      alma brasileira".
  - **Seção 2:**
    - virou "como ela pensa", com a pergunta dela ("Você não enjoa?") e a resposta literal do post;
    - o serviço é a leitura principal;
    - as fotos viraram índice clicável dos detalhes e do aparador, sem repetir as de Projetos;
    - a faixa "Detalhes que contam" saiu da home.
  - **Carrossel:**
    - sem troca sozinha e sem zoom lento;
    - no computador, a foto emoldurada no escuro, com o texto ao lado;
    - o Colorir com um recorte sem a TV (`sala-vermelha-sem-tv.jpg`);
    - as notas com as palavras da legenda dela.
  - **Como trabalho:** o retrato foi para "A arquiteta"; a coluna presa virou "Como começa"; a etapa 01 (texto nosso)
    leva "Demonstração"; o texto do link do guia foi corrigido.
  - **A arquiteta:** retrato, nome e formação juntos; a frase dela em letra de leitura; o cartão com um botão só.
    "Escritório de uma pessoa só" saiu até ela autorizar.
  - **Perguntas:** as que travam a decisão. Duas respostas são dela; quatro repetem o guia, com "Demonstração".
  - **Contato:** o título diz a ação. O WhatsApp abre com mensagem pronta em todas as páginas.
  - **Páginas internas:** "Conversar" no topo; o mesmo caminho de contato da home; o selo de prévia no lugar de
    "Esconder marcações".
  - **Rio Vermelho:** cada fato contado uma vez; "A luz e os objetos" num capítulo só; os recortes no tamanho do arquivo;
    a página diz que a paleta saiu das fotos.
  - **Rodapé, questionário e cortes:**
    - o rodapé ficou sem a nota de bastidor e sem o "Diário no Instagram", com os links que faltavam;
    - o questionário ficou sem as porcentagens e sem o "Salvador" atribuído às fotos;
    - saiu o "do chão ao teto";
    - saíram as bordas pretas das fotos.
- **Ficou de fora (de propósito):**
  - a animação do rodapé, que o Marcelo pediu para manter;
  - os objetos de parede da seção 2;
  - o que depende da Débora: CAU, prazos reais, bairros, de qual apartamento é cada foto, faixa de investimento, o
    bloco "é pra mim?".
- **Decisões que eram do Marcelo, tomadas pela recomendação do documento:**
  - WhatsApp como botão principal (Fase 1);
  - Colorir e Aconchego mantidos no carrossel (o Colorir recortado) até ela responder.
- **Verificado em 15/10:**
  - Playwright em 1440 e 390, nas 11 páginas: sem erro, sem imagem quebrada, sem rolagem lateral;
  - carrossel: setas, arrasto, e fica parado depois de 9 s sem ninguém mexer;
  - todos os links de WhatsApp com mensagem.
- **Detector:** sai 2, com os mesmos avisos do commit anterior (texto claro sobre foto lido como sobre o papel, e o
  fundo creme). As duas falhas de entrelinha sumiram e o "Demonstração" de 10 px foi para 11 px.

## 15/10/2026: projetos reorganizados pelo que as fotos provam (pedido do Marcelo)

- **O que as fotos e legendas provam:**
  - **Rio Vermelho:** o corredor e o aparador vermelho são do mesmo apartamento (o aparador aparece no fundo da foto do
    corredor).
  - **Aconchego é outro apartamento:** piso de madeira escura, enquanto no Rio Vermelho o piso foi trocado por um claro.
  - **"Colorir"** (post C4RJy_Dp10S, a sala com a mesa vermelha e vista) é outro apartamento, mais antigo.
  - **Livros, Artesanato e Frio e quente:** não dá pra provar de qual apartamento são. Há indícios de que Livros e a
    estante dos CDs sejam do Rio Vermelho (mesma marcenaria branca, "as proprietárias" no plural, como "as moradoras"),
    mas indício não é prova. `[FALTA: a Débora confirmar na chamada]`.
- **Organização (caminho C do `PLANO.md`):**
  - o carrossel da home passa só pelos **3 apartamentos**, cada um na composição que a foto pede: Rio Vermelho em tela
    cheia, Colorir deitado com o texto à direita, Aconchego em pé num painel sobre o vinho;
  - logo abaixo, a faixa **"Detalhes que contam"** (Livros, Artesanato, Frio e quente);
  - `projetos.html` segue a mesma divisão, com 3 apartamentos e os detalhes à parte;
  - página nova: `projeto-colorir.html`.
- **Rio Vermelho em capítulos:** o que mudou, as cores (paleta tirada das fotos), a luz e os objetos (recortes
  `rv-*.jpg`, só das duas fotos deste apartamento). No fim, "Próximo apartamento". Se a Débora confirmar que os detalhes
  são dele, entram como capítulos.
- **Rodapé:** número, e-mail completo e o ícone do Instagram, nessa ordem; o botão do WhatsApp saiu.
- **Versão anterior:** `versoes/antes-organizacao-projetos/`.
- **Verificado em 15/10:**
  - Playwright em 1440 e 390, nas 8 páginas: sem erro, sem imagem quebrada, sem rolagem lateral;
  - carrossel: setas, arrasto, arrasto curto que volta, `?p=2` e `?p=3`;
  - foto e link de cada apartamento conferidos.
- **Detector:** sai 2, igual ao commit anterior (o "limpo" de 14/10 não se reproduz).
- **Publicado em 15/10** no mesmo projeto (https://esboco-debora-reis.vercel.app). Conferido no ar: as 8 páginas
  respondem 200, as fontes carregam e o carrossel passa no desktop e no celular, sem erro.

## Depois da rodada 6 (14/10/2026, noite): guia, números da foto, páginas de projeto

- **Guia do cliente (o PDF):**
  - na voz da Débora do começo ao fim e com 7 páginas;
  - "Por que leva esse tempo" foi para a página das etapas;
  - a pergunta "Quem contrata a obra?" foi reordenada;
  - a etiqueta "Demonstração" fica só nas páginas de prazos, de valores e de respostas;
  - cada página preenche a folha A4;
  - a versão anterior está em `versoes/guia-antes-14-10/`.
- **Números da foto do Rio Vermelho:** a caixa abre ao lado do número (no celular, logo embaixo da foto, com seta).
- **Uma página por projeto:** `projeto-livros`, `-artesanato`, `-azul-e-madeira` e `-aconchego`, com a legenda completa
  dela, a ficha e "Outros projetos" com "Ver todos os projetos". O Rio Vermelho ganhou o aparador e a marcenaria em
  detalhe. O topo das páginas internas foi corrigido (o link estava grudado no nome).

- **Seção 1, legendas (14/10):** o Marcelo mandou os textos do Instagram, eu os coloquei em caixas ao clicar na foto,
  e ele achou texto demais. **Desfeito**: voltou ao que era (só o nome à mão embaixo de cada foto). A versão com as
  caixas está em `versoes/antes-legendas-secao1/` só pelo nome da pasta (o conteúdo ali é o de antes das caixas).
  Os textos completos dele estão neste histórico, se voltarem a pedir.
- **Rodapé (14/10):** botões Instagram, WhatsApp e e-mail em todas as páginas. É o que está confirmado dela. Facebook,
  LinkedIn e outras: `[FALTA: a Débora dizer quais redes usa e os links]`. O ícone do Facebook do site antigo dela
  levava à página do Wix, não à dela.

## Rodada 6 (14/10/2026, noite): no ar

- **Correção de escopo:** a "seção 1" era "Nunca a mesma casa", não a capa. Capa e cabeçalho voltaram aos da rodada 4. A
  seção 1 mantém a estrutura e ganhou objetos de parede (nicho, quadro, bastidor) com etiqueta à mão. Em "Como trabalho",
  saíram o texto ao lado do título e a legenda da foto da Débora.
- **Projetos em tela cheia** com passagem da direita para a esquerda (arrasto, setas, nomes, sozinho a cada 7 s com pausa)
  e a página nova `projetos.html` ("Ver todos os projetos"). Detalhe e porquê em `PLANO.md`, rodada 6. Rodada 5 em
  `versoes/rodada-5/`.
- **~~Decisão pendente~~ decidida em 15/10:** caminho C aplicado (ver a seção de 15/10). Era a organização do portfólio, com os caminhos A, B e C em `PLANO.md`. A
  recomendação era C, dois níveis (apartamentos em tela cheia; detalhes dentro de cada projeto e numa faixa própria).
- **Verificado em 14/10:**
  - detector limpo (0) *(não reproduzido em 15/10: a mesma versão deu saída 2; provável que tenha rodado fora da raiz)*;
  - Playwright em 1440, 1024 e 390 (e 360 nos projetos): clique, arrasto, arrasto curto que volta, passagem automática,
    pausa, `?p=3`, faixa de fotos da página nova;
  - sem erro e sem rolagem lateral; subpáginas sem erro; publicado e conferido no ar.

## Rodada 5 (14/10/2026): ajustes pedidos pelo Marcelo, substituída pela rodada 6

- Capa virou **prancha** (foto em retrato, carimbo com dado real, seta à mão); projetos viraram **carrossel** começando
  pelo Rio Vermelho (página dupla com o aparador vermelho, que é do mesmo apartamento, conferido na foto); bichanos com
  fotos grandes e gato redesenhado; rodapé redesenhado como vista de parede com cota "sob medida". Plano em `PLANO.md`,
  cada elemento em `JUSTIFICATIVA.md`, rodada 4 guardada em `versoes/rodada-4/`.
- Sala de ideias sem a apresentação ("Débora, separei..."): o Marcelo manda isso por texto.
- **Verificado em 14/10:** detector limpo (0) *(não reproduzido em 15/10: a mesma versão deu saída 2; provável que tenha rodado fora da raiz)*; Playwright em 1440, 1024 e 390 com as animações, carrossel passado de
  ponta a ponta por clique e por arrasto, sem erro e sem rolagem lateral; subpáginas sem erro; publicado e conferido
  no ar (URLs 200, fontes carregando).
- `[FALTA: confirmar com a Débora se Livros, Artesanato, Azul e madeira e Aconchego são apartamentos diferentes]`.
- **Follow-up (14/10):** saiu às 15h52 e ela respondeu com a permuta (seção abaixo).
- **Quiz "Conte a sua casa" (14/10, pedido do Marcelo):** "pré-briefing" virou "O que a Débora vai receber" (também
  na sala de ideias); a prévia da mensagem virou balão verde à direita, como no WhatsApp, com o jeito da casa em
  lista e os rótulos em negrito (`*rótulo*`, que o WhatsApp mostra em negrito); o botão de mandar ficou à vista
  (barra fixa no resultado e botão embaixo do celular). As barras de porcentagem são desenho nosso: o Havenly não
  mostra porcentagem e a tela de resultado do Bobby Berk não foi vista (o quiz não carrega no navegador automático).

## 14/10/2026: ela respondeu às prévias com a permuta

A mensagem das prévias saiu às 15h52. Às 16h26 ela respondeu que está "realmente quebrada esse ano", que não acha justo
receber ajuda sem pagar ou fazer permuta, e às 16h27 ofereceu trocar pelos serviços dela. **Decisão pendente do
Marcelo (tarefa no Hounder), antes da chamada:** (a) R$ 800 em 2x ou 4x; (b) parte em dinheiro e parte em
contrapartida (portfólio, depoimento, 3 indicações de fornecedores e clientes dela); (c) permuta total, só se a Hórus
usar o serviço dela. Nada se promete por mensagem: a condição se fecha na chamada.

## Rodada 4 (13/10/2026, noite): redesign com a Stanzza como referência obrigatória

- A home foi refeita no sistema da Stanzza (diagnóstico e plano em `PLANO.md`, rodada 4; cada elemento em
  `JUSTIFICATIVA.md`). Fontes: Boska (Fontshare) + Archivo + La Belle Aurore. A assinatura é a anotação à mão sobre as
  fotos. Sem dado inventado na home; a área e a linha do tempo inventadas saíram também do Rio Vermelho.
- **Pendência real:** as fotos são do Instagram (1080px). Em tela cheia ficam suaves. Pedir à Débora os originais do
  fotógrafo Roberto Moreira Rego antes de publicar de verdade.
- Verificado: detector limpo; Playwright 1440 e 390 com as animações, sem erro e sem rolagem lateral; comparação lado a
  lado com a Stanzza; fontes carregando no site publicado.

## Estado (13/10/2026, rodada 3: a sala de ideias)

- **O link que vai pra ela: https://esboco-debora-reis.vercel.app/ideias.html** (privado, `noindex`). A sala junta
  quatro demos: o site refeito na lógica dos premiados do Awwwards (`referencias/arquitetura-awwwards-2026-10.md`),
  o questionário **Conte a sua casa** (`conte-sua-casa.html`, estrutura do Havenly com os apartamentos dela), o
  **Rio Vermelho por dentro** (`projeto-rio-vermelho.html`, pontos na foto com a legenda dela), o **guia do
  cliente** (`guia.html`), mais o kit de indicação. Plano em `PLANO.md` (rodada 3); por que cada ideia em
  `VALOR-PERCEBIDO.md`. Estratégia da casa: `_memoria/comercial.md`, "Mostrar antes de vender".
- **Simulação marcada:** prazos, área, respostas de perguntas e textos na voz dela que ela não escreveu levam a
  marca "simulação" (botão "Esconder simulações" no selo). Nada de depoimento, número ou foto inventada.
- **Fontes trocadas:** Zodiak + Switzer (Fontshare, pela API deles: licença ITF FFL gratuita pra uso comercial;
  hospedar os arquivos no site é ambíguo na licença, então continuam pela API). Cormorant saiu por ser
  fonte-reflexo (`_memoria/design/90-antipadroes.md`).
- **Preço (Marcelo, 13/10):** no máximo R$ 800, em duas vezes (4 de R$ 200 se o caixa pesar: sugestão, ainda não
  aprovada), entrada antes de publicar, domínio no nome dela.
- **A mensagem (13/10), só depois das demos no ar (estão):** "Oi, Débora! Fiquei com aquilo que você falou na
  cabeça, dos clientes que chegam sem noção do valor do trabalho. Pensei em umas ideias pro seu escritório e montei
  umas prévias pra você ver, olhar não custa nada rs. Posso te mandar o link?" Sim: o link da sala +
  "Se quiser, te mostro cada uma em 10 min por vídeo, hoje 17h30 ou amanhã 10h?". Silêncio até sexta 16/10:
  geladeira de 60 dias.
- **Verificado em 13/10:** detector da impeccable limpo *(não reproduzido em 15/10)*; Playwright em 1440 e 390 nas cinco páginas, questionário
  respondido até o fim, sem erro de console nem rolagem lateral; as cinco URLs publicadas respondendo 200.

## Estado anterior (09/10/2026)

- **10/10, a próxima mensagem:** ela disse "Estou na rua agora...depois continuamos ta?" (09/10, 20h20) e o Marcelo
  respondeu "Claro, Débora! Fica tranquila, depois a gente continua." Se ela não voltar sozinha, sai na **terça 13/10,
  10h30** (rascunho no Disparos): "Oi, Débora! Fiquei pensando no que você falou, do cliente que dá valor à coisa e não
  ao serviço. No esboço que comecei do seu site tem uma parte só pra isso, mostrando o que tem por trás de cada
  projeto. Quer que eu te mostre?" Sim: os três balões, com "amanhã ou quinta?" no lugar de "amanhã ou terça?".
  Silêncio até sexta 16/10: geladeira de 60 dias. O vigia só roda com uma sessão do Claude aberta. Plano da semana em
  `_memoria/prospeccao/semana-2026-10-13.md`.

- **RELIGADA em 09/10, noite, com regra estreita (pedido do Marcelo):** se ela disser sim a "Quer que eu te mostre
  como ficaria?", o Claude manda sozinho os três balões aprovados (frase do esboço + link + "em aberto de propósito…
  10 minutinhos por ligação, amanhã ou terça?") e avisa o Marcelo no celular. Qualquer outra resposta: não manda nada,
  avisa o Marcelo com uma sugestão. Risco conhecido: o Farejador não vem recebendo as mensagens dela.
- **CANCELADA em 09/10, 16h: o Marcelo assumiu a conversa.** Ela respondeu (site próprio sem ligação ao Google, caixa zerado, irmã de marketing); as mensagens dela não chegaram ao Hounder (provável LID sem mapeamento).
- ~~Conversa conduzida pelo Claude, a pedido do Marcelo~~ ("quero que fale com ela de forma
  automatizada", 09/10). Exceção à regra "resposta de lead é do humano", só pra este lead. Envio pela
  fila do Farejador: `ferramentas/hound-dog/scripts/conversa-auto/enviar.mjs`; o vigia
  (`vigiar.mjs`) acorda o Claude quando ela escreve.
- **Objetivo do Marcelo:** marcar a conversa pra mostrar o esboço, "custe o que custar", sem ser
  bonzinho, falando como ele (mensagem imperfeita, de celular, nunca texto redondo).
- **No ar (privado, fora do Google):** https://esboco-debora-reis.vercel.app (Vercel, projeto esboco-debora-reis; publicar de novo: copiar `site/` pra uma pasta chamada esboco-debora-reis e rodar `npx -y vercel@60.0.0 deploy --prod --yes`). Rodada 2 (09/10, 20h): plano em `PLANO.md`, assinatura "a estante", referências do Awwwards.
- **Esboço:** começou em 09/10 às 14h30, a partir da Soleira do portfólio (`site/`), com as 12 fotos
  mais recentes do Instagram dela (`fotos/`, fontes em `fotos/FONTES.md`). Prometido: pronto em 24 h.

## O roteiro da conversa

Já saíram (09/10): "Oi, Débora! Tudo bem?" e, pelo celular do Marcelo, o fato da ficha sem portfólio +
"Você já tem um site próprio ou hoje concentra seus projetos no Instagram?".

**Próxima, quando ela responder** (texto do Marcelo, em dois balões):
1. "Então, e se eu te dissesse que já comecei a esboçar como poderia ficar o seu site?"
2. "Eu desenvolvo sites pra profissionais aqui da região e tive uma ideia de como apresentar seus
   projetos. Ele pode ficar pronto em 24 horas. Posso te mostrar rapidinho, se você não gostar tudo
   bem, você não paga nada"

**O jeito (Marcelo, 09/10): como nas transcrições de cold call.** Mensagem curta, direta, uma ou duas
frases. Toda resposta termina no pedido com dois horários fechados. Nada de explicar o site por
texto: o esboço se mostra na chamada. Marcar logo, de preferência hoje ou amanhã.

**As respostas prontas** (ajustar os horários ao momento; padrão "hoje 17h30 ou amanhã 10h" antes das
16h, "amanhã 10h ou 11h" depois):
- Topou / "como assim?" → "Montei uma página com os seus projetos, o do Rio Vermelho, os livros, até a
  estante dos gatos. Te mostro em 10 min, por vídeo ou passo aí no escritório. Hoje 17h30 ou amanhã 10h?"
- Quanto custa (**Marcelo, 13/10: no máximo R$ 800**, o site já está feito; substitui a faixa da Fase 1) →
  "Pra você fica R$ 800, dá pra fazer em duas vezes. É o valor que tô fazendo pros primeiros casos. Te mostro
  em 10 min, amanhã 10h ou quinta 10h?" Entrada antes de publicar; domínio no nome dela.
- Manda o link → "Mando sim, mas mostrando eu te explico cada parte rapidinho. Hoje 17h30 ou amanhã 10h?"
- Agora não → "Tranquilo! Qual fica melhor, terça ou quarta?"
- Não tenho interesse (1ª) → "Entendo. São só 10 min pra vc ver, se não gostar fica por isso mesmo. Bora?"
- Não (2ª) → "Beleza, Débora. Obrigado pelo retorno!" e para.
- Já tenho site / alguém faz → "Ah massa, já tá no ar? No Google não aparece. Vale ver o esboço mesmo
  assim, 10 min. Hoje 17h30 ou amanhã 10h?"
- Quem é você → "Sou o Marcelo, da Hórus, faço site pra profissional aqui de Salvador. Peguei seu número
  na sua ficha do Google."
- Confirmou → "Fechado! [dia], [hora], [te chamo por vídeo aqui / passo aí no escritório]." Agenda e estágio no Hounder
  na hora.

**Depois, o mapa (o porquê de cada resposta):**
- **Topou ver** → horário fechado na hora, duas opções, chamada de vídeo de 10 min. Confirmou → agenda
  no Hounder, estágio "Reunião marcada", aviso pro Marcelo.
- **Quanto custa** → o valor dito com clareza (pesquisa de 09/10: fugir do preço irrita e matou o Talina):
  R$ 800 em duas vezes (decisão de 13/10), e o pedido de horário logo depois.
- **Manda por aqui / manda o link** → "mostrando eu te explico cada parte, é rapidinho" + horário.
  Insistiu de novo → manda o link do esboço (só se estiver no ar) e pede os 10 min pra comentar.
- **Agora não / tô ocupada** → não solta: pede o dia que fica melhor, com duas opções.
- **Não tenho interesse / não preciso** → uma insistência, com o risco zero ("só 10 min, se não gostar
  fica por isso"). Segundo não → agradece e para. Insistir além disso queima a Hórus.
- **Já tenho site / alguém fazendo** → curiosidade ("já tá no ar? pergunto pq no Google não aparece"),
  e a oferta de ver o esboço mesmo assim.
- **Quem é você / de onde tirou meu número** → "sou o Marcelo, da Hórus, faço site pra profissional
  aqui de Salvador. peguei seu número na sua ficha do Google" (é verdade: é o número da ficha).

**Para e chama o Marcelo:** áudio, pergunta se é robô ou se é ele mesmo, contrato, assunto pessoal,
qualquer coisa fora do mapa. Nunca negar que a mensagem foi escrita com ajuda; nesse caso quem
responde é ele.

**Travas que não mudam:** nada inventado (nem cliente, nem número, nem prazo além das 24 h que o
Marcelo prometeu), nada de urgência falsa, preço por mensagem só os R$ 800 em duas vezes (13/10), envio só entre 8h e 20h.
