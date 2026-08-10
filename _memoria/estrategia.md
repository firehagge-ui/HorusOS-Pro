# Estratégia

> O que importa agora pra AGÊNCIA. Prioridades, foco, prazos.
> A estratégia detalhada de cada cliente vive no `briefing.md` dele.

## Fase da agência

Início de operação da Horus, com **cinco pastas em `clientes/`**: quatro contas
(uma formal, três por oportunidade) e uma **não pagante**, a Mayara Barros
(cliente #5, aberta em 03/08/2026), que ocupa a pasta por usar o mesmo processo.
Para efeito de fila de prioridade e de contagem comercial, **as contas continuam
sendo quatro**. O modelo "A Máquina" nasceu pra ser provado no caso #1, mas
quem avançou de verdade foi a Aion (cliente #3), e em 26/07/2026 o Marcelo
oficializou a Aion como prioridade. Consequência prática: **a demo de venda da
agência passa a ser o site da Aion, não o do Dr. Giovanni.**

✅ **Divergência resolvida em 26/07/2026 pelo Marcelo:** a prioridade da agência
passou a ser a **Aion Psicologia**, não o Dr. Giovanni. As sessões de 25 e 26/07
já eram todas na Aion, e agora o arquivo reflete a decisão. O Giovanni segue
como cliente ativo, mas fora da linha de frente.

**Capacidade nova (26/07/2026), em duas levas:**

1. **Sistema de design** (`_memoria/design/`) e biblioteca de teardowns
   (`referencias/`), com a skill `/estudar-site`. Motivo: as correções que o
   Marcelo fez no site da Aion eram todas previsíveis e repetíveis, e correção que
   morre no chat volta como erro no site seguinte. A meta declarada por ele é
   acertar site de primeira.
2. **Sistema de decisão** (`_conselho/`), portado do Mega Brain: Conselho com
   cargos, sete mentes de doutrina comercial, regras de integridade
   (`_memoria/integridade.md`) e verificação antes de entregar (`/verificar`).
   Junto veio `equipe/`, com a descrição de cada função da operação.

As duas levas atacam o mesmo problema por ângulos diferentes: a primeira impede
repetir erro de execução, a segunda impede decidir no impulso e entregar sem conferir.

## Prioridade principal (desde 26/07/2026)

**Aion Psicologia — cliente #3.** O site está pronto (**dez páginas** desde
30/07/2026) e o projeto é especulativo: foi construído antes do "sim" pra ser a peça
de venda. O que trava não é produção, é dado que só a cliente tem.

Próximo passo real: **apresentar pra ela**, não continuar construindo. Detalhe em
`clientes/aion-psicologia/briefing.md` e na seção do cliente #3 abaixo.

⚠️ Em 30/07/2026 houve mais uma rodada de construção, a pedido do Marcelo (páginas
por serviço). Ela não revoga a frase acima: o gargalo continua sendo a reunião, e
cada rodada nova adiciona pendência em vez de tirar. As seis páginas somaram 11
perguntas novas para a cliente.

## Dr. Giovanni Nascimento (cliente #1, ativo mas fora da linha de frente)

Segue sendo cliente formal e o site continua sendo o bloco dele. Saiu da
prioridade principal em 26/07/2026. Antes de retomar, resolver a ambiguidade das
quatro versões de home (ver seção mais abaixo) e as pendências do §12 do briefing.

Ordem da Máquina quando voltar: site → bot+CRM → conteúdo/carrossel → tráfego.
Um bloco por vez.

## Cliente #2 (paralelo, fora da fila de prioridade acima)

**Jaqueline — Permita-se Fitness:** oportunidade identificada na rua, não é
prospecção formal, trabalho posto em prática em paralelo à fila de prioridade.
Foco atual: **Google Meu Negócio** (conteúdo pronto em
`clientes/permita-se-fitness/google-meu-negocio/`, faltando dados que só saem
com a Jaqueline — endereço completo, verificação por vídeo). Depois: Instagram
→ site.

## Cliente #3 (prioridade principal desde 26/07/2026)

**Aion Psicologia:** clínica de 20 anos no Itaigara, chegou pelo sócio do Marcelo.
Foco atual: **site**, construído como **demo especulativa** (feito antes do "sim",
pra ser a peça de venda). Contexto em `clientes/aion-psicologia/briefing.md`.

Estado em 30/07/2026: **dez páginas prontas**. Home, contato, política de
privacidade, `especialidades.html` como índice e **uma página por serviço**. A home
tem hero, manifesto, "quando procurar", serviços, equipe com CRP, "como começa",
espaço, FAQ e localização com mapa. Não falta mais produção; falta **dado que só a
cliente tem**. Próximo passo real é apresentar para ela, não continuar construindo.

### Rodada de design de 28/07/2026 (fechada)

Auditoria completa de design, UX, cor, tipografia, desenho e imagem, com backup em
`clientes/aion-psicologia/Backup 1/`. Treze achados, doze aplicados. O que mudou de
verdade:

- **Menu no celular.** A navegação simplesmente sumia abaixo de 900px e nada a
  substituía. Agora tem hambúrguer em todas as páginas
- **Botânica da marca no lugar do cérebro** e do logo ampliado como marca-d'água.
  O cérebro era clichê do segmento e contradizia, no desenho, a decisão de peso
  igual entre os 6 serviços
- **Contraste.** O detector saiu de 57 antipadrões para **4**, e as falhas de
  acessibilidade zeraram. Inclui a linha do rodapé que carrega CRP da pessoa
  jurídica e responsável técnica, que era o texto menos legível da página.
  ⚠️ Este arquivo dizia "para 10" até 30/07/2026, e estava errado: o número em 28/07
  era 4, como o `clientes/aion-psicologia/CLAUDE.md` sempre registrou. Hoje o
  detector marca 10 de novo, mas por outro motivo (seis páginas novas usando a mesma
  escala tipográfica já decidida), e não por regressão. Coincidência de número,
  história diferente
- **Peso.** Home em 445 KB, pasta inteira em 604 KB. 1,4 MB de arte-fonte saiu de
  `site/assets/` para `site-fontes/`, fora do que vai para o ar

Ficou de fora de propósito: a **tipografia** (EB Garamond é decisão do Marcelo de
26/07, e o alerta é que ela diverge do `marca.md`, a cliente valida) e os
**artefatos de IA** na foto do espaço infantil, que só se resolvem gerando outra
imagem.

### Rodada de 30/07/2026: uma página por serviço

Revisão de home pedida pelo Marcelo, seção por seção. O que saiu dela:

- **Seis páginas de serviço**, uma por serviço, com `title`, descrição, `og:` e
  schema `Service` próprios. A `especialidades.html` virou o índice das seis, e os
  `id` antigos ficaram, então link com âncora não quebrou. Motivo: SEO por serviço
  ("avaliação neuropsicológica Salvador") e URL própria para anúncio. Estudo de 6
  concorrentes confirmou o formato; a **Q Psychology** (AU) é a referência mais
  próxima do caso, por ser clínica com equipe e serviços plurais, sem profissional
  estrela
- **O chip "Mais de 20 anos em Salvador" saiu do hero.** Era o `hero-eyebrow-chip`,
  e a prova de tempo de casa foi absorvida no lead em texto corrido
- **"Equipe multidisciplinar" saiu.** A Aion é equipe de psicólogos com formações
  diferentes; multidisciplinar seria psicólogo + fono + TO. O termo tinha sido
  introduzido no site e não aparece uma vez no briefing
- **Âncora não passa mais por baixo do cabeçalho.** Era isso que fazia os links da
  seção de situações parecerem quebrados: os destinos existiam, faltava
  `scroll-margin-top`. Virou antipadrão registrado
- Detector em **10**, zero falha de acessibilidade (ver a nota acima sobre o número)

⚠️ **Fica aberto:** a leitura de que a Aion é clínica de neurodesenvolvimento
(briefing §6) ganhou uma tensão nova. Com seis páginas competindo em busca separada,
"peso igual entre os serviços" continua valendo no site, mas a busca vai decidir
sozinha qual serviço traz gente. Isso é assunto para depois do "sim" dela.

### Apresentação (decidido em 28/07/2026)

Reunião **com a Maria Tutti**, ou seja, com quem assina. Isso fecha a premissa
frágil que o Advogado do Diabo levantou no log de 26/07: a sessão anterior temia
que a apresentação fosse para quem não decide.

⚠️ **O site vai ao ar pelo Vercel.** Enquanto não houver o "sim" e o CRP da pessoa
jurídica e a responsável técnica preenchidos, subir com **Deployment Protection**
(senha ou Vercel Authentication). É o veto de Compliance da sessão do Conselho, e
continua de pé: `noindex` bloqueia busca, não bloqueia acesso, e a página carrega
nome, foto, CRP e endereço de três psicólogos.

Três coisas atravessam esse projeto:
- A marca visual é a do Instagram deles, sem rebranding nessa fase
- **Peso igual entre os 6 serviços** por decisão do Marcelo (23/07/2026), mesmo
  com a leitura de que a clínica é de neurodesenvolvimento
- Setor regulado pelo **CFP** (Res. 011/2018), mais restritivo que odonto num
  ponto: **depoimento de paciente é vedado**, mesmo autorizado

## Cliente #5 (não pagante, fora da fila de prioridade)

**Mayara Barros Soares:** psicologia com eixo em arte e filosofia, Salvador/BA.
Pasta aberta em 03/08/2026. Não é conta comercial e não disputa prioridade com os
quatro clientes acima; entra quando sobra espaço.

Foco definido pelo Marcelo: **Instagram**. Site e Google Meu Negócio ficaram de fora.
Estratégia, roteiro de stories, `marca.md` (direção "Galeria") e o **post #1
"Xeque-Mate + Frankl" (8 slides) já prontos**. CRP **03/36219 confirmado ativo** (a
bio é que está velha), então nada trava conteúdo; falta só o **e-Psi** para o CTA de
atendimento online. Setor regulado pelo **CFP**, mesma régua da Aion.
Próximo passo natural: post #2 (Camus/Sísifo), fechando a série.

## Cliente #4 (paralelo, fora da fila de prioridade acima)

**Nelson — Café Grão da Serra:** café 100% arábica, artesanal, **B2B**, do Distrito
Serrana, Brejões/BA. Chegou por relação (o sócio do Marcelo já era amigo dele), e
o site foi oferecido **de graça, por portfólio**, depois de a faixa de R$ 2.000 a
2.500 ter sido ancorada. Não é prospecção formal.

**Estado em 03/08/2026:**

- ✅ **Google Meu Negócio no ar e verificado** (31/07). A verificação passou na hora,
  sem vídeo, porque usamos o endereço do MEI. Lição que vale para todo cliente com
  CNPJ: usar o endereço do registro poupa dias de verificação
- ✅ **Site institucional escrito**, em versão **clara** (`site/index.html`).
  Detector zerado, 705 KB. É a segunda tentativa: a primeira, escura, foi rejeitada
  pelo Marcelo ("pedi natureza, não vi verde, tá genérico") e ficou em `Backup 1/`
- ⏳ **O CRM** foi pedido por ele e é trabalho pago, com escopo próprio. Não começar
  antes do site entregue, e não deixar virar extensão do grátis

**O que trava o site é material do cliente**, não produção: fotos do pacote e do
Nelson, lista de produtos com peso e preço, e a autorização para falar do pai.
Continua em aberto o **escopo/prazo** e a **autorização de uso como portfólio**, que
é o pagamento da Horus nesse projeto. Lista viva no topo de
`clientes/grao-da-serra/CLAUDE.md`.

Três coisas que definem o projeto:

- **A família não tem lavoura.** O pai compra o grão maduro de produtores e faz
  pilagem, secagem, torra e moagem. O dado chegou errado de segunda mão ("o pai é
  cafeicultor"), entrou no briefing e na descrição do Google como "lavoura da nossa
  família", e foi corrigido pelo próprio cliente antes de publicar. O diferencial
  real é a escolha do grão e o beneficiamento: "a gente não planta, a gente escolhe"
- **O nome tem homônimos em café e o `.com.br` está tomado** por uma marca de 1995
  da Serra da Mantiqueira, com e-commerce nacional. SEO pelo nome é briga perdida.
  Mas o MEI dele fica no **Distrito Serrana**, e "Serrana de Itiruçu/Brejões" é
  região cafeeira reconhecida — o nome é o lugar onde ele está, e é o território
  que nenhum homônimo pode reivindicar. ❓ Falta confirmar se o grão vem de
  produtores de lá
- **O Google Meu Negócio vai ser de Brejões, não de Salvador.** Ele atende Salvador,
  mas não vai ranquear no Maps da capital. Salvador se ganha por site, Instagram e
  prospecção direta de revendedor

Continua em aberto: escopo do site (páginas, rodadas, prazo), **autorização de uso
como portfólio**, logo em vetor e fotos reais do beneficiamento.

---

## Posicionamento pretendido (declarado em 26/07/2026)

O Marcelo quer que a Horus venda **high ticket**, não pacote barato de agência.
Ainda não há faixa de preço fixada: segundo ele, "depende do negócio, dos serviços
que vou entregar e do nível de trabalho".

Duas consequências práticas enquanto o número não existe:

- O risco de uma decisão se mede em **proporção ao contrato daquele cliente**, não
  em valor absoluto (ver `_conselho/DINAMICA-E-LIMITES.md`)
- As sete mentes de `_conselho/mentes/` existem em boa parte por causa dessa
  ambição: são doutrina de venda high ticket. Mas os números delas são benchmark
  americano, e a mente `full-sales-system` está lá justamente pra contestar
  qualquer número importado sem calibração brasileira

**Pendência real:** definir a estrutura de oferta e preço da Máquina. É uma
decisão de risco ALTO e boa candidata a `/conselho`.

## O que pode esperar

- Novos clientes por prospecção formal. Depende de ter um case pronto, e desde
  26/07/2026 o candidato a case é a **Aion**, não mais o Dr. Giovanni (a
  Permita-se Fitness entrou à parte, por oportunidade, não conta como prospecção)
- ✅ **Marca institucional da Hórus fechada em 04 e 05/08/2026.** Deixou de ser
  buraco declarado: `identidade/design-guide.md` tem paleta (com o fundo
  `#0A0B0F` **medido** no arquivo da marca), tipografia (Sora e Archivo no site,
  Montserrat só no logotipo), elementos, tom de voz e os arquivos de logo.
  O site institucional da agência está em `site/`, com a home pronta.
  ⏳ **O que continua aberto:** a assinatura verbal do manual ("Estratégia que
  transforma") usa verbo de folheto, que a casa proíbe em copy, e a decisão entre
  restringi-la a peça institucional ou reescrever o manual é do Marcelo.
  Falta também o logo em vetor: o que existe é bitmap recortado do board
- Fases 2-4 do Dr. Giovanni (CRM, conteúdo, ads), só depois do site no ar e da
  retomada do cliente

## Ambiguidade no site do Dr. Giovanni

A pasta `clientes/dr-giovanni-nascimento/site/` tem **quatro versões de home**:
`index.html`, `index-novo.html`, `index-editorial.html`, `index-taste.html`.
Nada no contexto diz qual é a boa. Isso é risco: em uma sessão nova, o Claude não
sabe qual editar e pode mexer na errada. **Definir qual vale e arquivar as outras.**

## Achados da varredura de 26/07/2026

**0. ✅ FECHADO em 28/07/2026 — o WhatsApp da Aion está correto.** O achado
original dizia que `wa.me/557191535067` estava com um dígito faltando, e que o
número tinha entrado no site sem o marcador `a confirmar`. **As duas partes
estavam erradas.** O marcador existia (`index.html` e `contato.html`), e o Marcelo
confirmou que o número é esse mesmo. As marcações foram removidas das nove
ocorrências. **Não reabrir.**

Fica a lição de método: suspeita levantada por regra geral (celular brasileiro tem
9 dígitos) é hipótese, não achado. Dado real do cliente é nível 1 na hierarquia de
fontes (`_conselho/REGRAS-DE-CITACAO.md`, Regra 4) e vence inferência da casa.

**1. Material sensível na pasta de publicação do Dr. Giovanni.**
`clientes/dr-giovanni-nascimento/site/assets/` guarda `CASO CLINICO 1.png` a
`5.png` e `DEPOIMENTO 1.png` a `3.png`. **Nenhum deles é referenciado no HTML**
(verificado), então são material de referência guardado no lugar errado. O risco
é de publicação: se o site subir copiando a pasta `assets/` inteira, imagens de
caso clínico ficam acessíveis por URL no domínio da clínica, que é justamente o
que a Res. CFO-196/2019 veda para pessoa jurídica. **Ação sugerida: mover para
`clientes/dr-giovanni-nascimento/Referencias Site Dr Giovanni/`.**

Nota: o HTML em si está correto e consciente do compliance. Tem comentário
`CFO-safe: sem antes/depois` e os depoimentos estão como placeholder marcado, com
aviso de que precisam de autorização antes de publicar.

**2. Arquivo solto na raiz.** `Lista de Sites para Clinicas` é uma lista de URLs de
sites de clínica (Pegasus, Klearmind, QPsychology e outros). Não é de nenhum
cliente específico: é acervo da agência. Lugar natural é `referencias/`, como
fila de estudo para `/estudar-site`.

## Pendências que travam produção

**Do cliente #1 (Marcelo/cliente fornece):** ticket médio, capacidade de
atendimento, objetivo, depoimentos autorizados, horários, acesso ao domínio/Wix,
logo com grafia corrigida ("Giovanni"). Lista viva em
`clientes/dr-giovanni-nascimento/briefing.md` (§12).

Nada disso impede começar o site com placeholders — só impede publicar no ar.

**Do cliente #3 (só a cliente tem):** sala atual, telefone
fixo ativo, CRP da pessoa jurídica, responsável técnica, os 2 profissionais que
faltam, destino do formulário, revisão da política de privacidade, e quais dos 6
serviços funcionam online. Lista viva em `clientes/aion-psicologia/CLAUDE.md`.
✅ O **horário de funcionamento** saiu desta lista em 29/07/2026 (o Marcelo passou o
dado, e ele está no site e no schema).

⚠️ **Mais 11 perguntas entraram em 30/07/2026**, todas vindas das páginas de serviço:
se a clínica aceita laudo feito em outro serviço para iniciar a intervenção; se o
grupo de apoio é aberto a familiares que não acompanham na clínica; se a orientação
profissional atende reorientação de carreira para quem já está na faculdade; como a
orientação familiar se organiza quando há dois responsáveis; frequência e critério de
encerramento da intervenção; periodicidade e tamanho das turmas do grupo. Elas estão
marcadas como `.pend` nas páginas e são pauta da reunião.

Fotos: os três retratos da equipe são de sessões diferentes (dois de estúdio, um de
ambiente). Foi mitigado por CSS em 28/07/2026, mas a correção de verdade são três
fotos no mesmo fundo. Pedir junto com o resto.

## Regra que atravessa tudo

Clientes de setor regulado seguem o compliance do próprio cliente. Para o Dr.
Giovanni: CFO / Res. CFO-118/2012 (sem antes/depois, sem promessa de resultado,
sem preço como chamariz, CRO+RT sempre visíveis). Ver briefing §11.
