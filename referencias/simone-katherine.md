# Teardown: Simone Katherine Interiors (interiores residenciais de alto padrão, Cidade do Cabo)

- **URL:** https://simonekatherineinteriors.com/
- **Segmento:** design de interiores residencial de alto padrão (casas de praia, coberturas, casas grandes) na Cidade
  do Cabo, África do Sul. **Estúdio de uma designer-fundadora**, Simone Katherine Hirsch, que é o rosto do site.
- **Estudado em:** 15/10/2026, com o Playwright: home em desktop 1440x900 e em celular 390x844, incluindo o preloader,
  o hover nos cards, a transição ao clicar e o menu aberto; `/projects` (índice com 13 projetos);
  `/projects/robberg-retreat` inteiro até o "Next Project", que carregou sozinho o Penthouse 501, também no celular;
  `/about` (My Story); `/press`, com hover nas publicações; `/contact`, em desktop e celular.
- **Stack vista:** Next.js com Prismic e rolagem suave com Lenis. Crédito "Site by DashDigital®" (site feito por
  agência). Não verifiquei se o site tem prêmio no Awwwards.
- **Nota:** 6/10. A mecânica de imagem é a parte forte e serve diretamente ao pedido do Marcelo: colagem sem legenda,
  foto que invade a seção anterior, hover que troca a capa, card que cresce até virar o hero do projeto, texto fixo
  com fotos rolando ao lado. Perde pontos na conversão: preloader de espera, contato só por e-mail na home, nenhuma
  explicação de serviço ou processo e uma página de projeto que não tem saída para o contato.
- **Contexto:** estudado a pedido do Marcelo para o site da Débora Reis (`clientes/_prototipos/debora-reis/`), no lote
  dos "outros sites" além dos três que ele mandou ([Normal is Boring](normalisboring.md),
  [Tecnoarreda](tecnoarreda.md) e [Stanzza](stanzza-proposito.md)). A pergunta dele: qual o propósito de cada seção,
  como as imagens aparecem e se falta informação no site da Débora.

**Em resumo:** é o site de uma designer que trabalha sozinha à frente do estúdio e fala com um proprietário rico que
provavelmente já chega indicado ou porque viu o trabalho numa revista. Por isso o trabalho do site é **confirmar
gosto e credibilidade**, não explicar serviço nem converter. A home tem só três blocos (hero, manifesto com colagem,
4 projetos) mais o rodapé com o e-mail. A profundidade fica nas páginas internas: 13 projetos com texto em capítulos
e ficha técnica, uma página "My Story" com retrato e fotos de processo e uma página de imprensa com 13 matérias em
PDF. O contato é o e-mail, mais um telefone que só aparece na página Contact. Não há formulário nem WhatsApp.

---

## Estrutura, na ordem

### Fixo em todas as páginas

**1. Cabeçalho fixo e menu em tela cheia.**

- **Mostra:** barra fina fixa com "SIMONE KATHERINE" à esquerda (no celular vira "S.K") e "• MENU" à direita. O menu
  abre uma tela creme com o retrato da Simone sentada numa poltrona à esquerda (335x506) e os 5 itens (HOME, ABOUT,
  PROJECTS, PRESS, CONTACT) em serifa condensada enorme à direita. Um ponto marca a página atual, e o item sob o
  mouse clareia.
- **Para quê:** tirar a navegação do caminho para a foto mandar. E, no momento em que o visitante procura para onde
  ir, **o rosto da profissional aparece junto**: quem abre o menu vê a pessoa que vai cuidar da casa dele.
- **Como é montado:** o cabeçalho não tem CTA nem telefone, só o nome e o menu. No desktop o overlay tem duas colunas
  (retrato e lista). No celular o retrato some e fica só a lista centralizada.
- **Imagem:** retrato vertical da fundadora, sem legenda.

**5. Rodapé-contato** (descrito no fim da home; aparece também no índice, na About e na Press, mas **não nas páginas
de projeto**).

### Home

**0. Preloader com contador.**

- **Mostra:** tela creme vazia por cerca de 1 a 2 segundos, com um contador de porcentagem ("95%") em serifa clarinha
  no centro, embaixo.
- **Para quê:** esconder o carregamento das fotos pesadas e criar uma entrada solene. **Para o visitante é só
  espera**, sem nenhuma informação.
- **Como é montado:** tela cheia, um número que sobe até 100% e depois some, revelando o hero.
- **Imagem:** nenhuma.

**2. Hero.**

- **Mostra:** foto de um hall com aparador de mármore negro, escultura e planta, escurecida por um véu escuro. Por
  cima, centralizados: o nome "SIMONE KATHERINE" em serifa condensada light (cerca de 150px), uma frase de
  posicionamento em sans (18px) e "Interior Design Studio" em serifa (cerca de 70px).
- **Para quê:** dizer em poucos segundos **quem é** (o nome), **o que faz** (estúdio de interiores), **onde** (Cape
  Town) e **com qual estilo** (atemporal, clássico e contemporâneo). A foto já serve de amostra do nível de
  acabamento.
- **Como é montado:** altura de uma tela (900px). A foto fica dentro de uma moldura creme de 20px e não encosta na
  borda da janela. Não há CTA nem seta. O nome repete o logo do cabeçalho.
- **Imagem:** uma foto só, com véu escuro forte para o texto claro ficar legível. Por causa do véu, a foto perde cor
  e brilho.
- **Copy:** *"A Cape Town interior design studio with a timeless, sophisticated signature approach to delivering
  classic and contemporary interiors."*

**3. Manifesto e colagem de fotos.**

- **Mostra:** à esquerda, uma frase grande em serifa (cerca de 53px, 4 linhas). À direita, uma foto vertical (um cão
  sentado numa poltrona de couro diante de um papel de parede de árvores) que sobe e invade cerca de 20px a borda de
  baixo do hero. Abaixo dela, um parágrafo curto de fundação com o nome completo da fundadora. Mais abaixo, uma foto
  grande à esquerda (sala de pé-direito em A com vista da montanha, 690x787) e duas fotos pequenas lado a lado à
  direita (cobertura com mesa longa e vista do mar; detalhe de frascos de cristal, 246x344 cada), alinhadas pela base.
- **Para quê:** dar a **tese do estúdio** (escolha criteriosa de móveis, interiores feitos para durar), dizer **quem
  fundou e por quê** e provar **variedade de repertório** (casa de campo, cobertura, detalhe de objeto) sem precisar
  explicar nada.
- **Como é montado:** duas colunas assimétricas, a esquerda larga e a direita estreita, com um vazio de cerca de
  200px entre elas. A ordem vertical alterna texto e foto entre as colunas. A sobreposição na borda do hero costura
  uma seção na outra.
- **Imagem:** quatro fotos sem legenda e sem dizer de que projeto são, servindo de prova de gosto. O texto
  alternativo existe (descritivo, para acessibilidade), mas não aparece na tela. Há mistura de escalas: ambiente
  inteiro, canto com personagem (o cão) e detalhe macro.
- **Copy:** *"By creating purposeful spaces with meticulously selected furnishings, our bespoke interiors are built to
  stand the test of time."* / *"The Cape Town-based studio, founded by interior designer Simone Katherine Hirsch, was
  formed out of a passion to reconnect people with style, insight and comfortable living."*

**4. Projetos em destaque.**

- **Mostra:** o título "Projects" (cerca de 150px) centralizado, com um subtítulo de uma linha. Abaixo, 4 cards em 4
  colunas iguais: 01 Robberg Retreat e 03 Penthouse 501 em retrato (335x464); 02 Rolling Lawns e 04 Summersby House
  em paisagem (335x232). Cada card tem um número grande em serifa ("01.") e o nome em duas linhas. À direita,
  embaixo, "View All" em serifa grande.
- **Para quê:** **provar com 4 casas e empurrar para o índice completo.** O número grande dá ordem e ar de catálogo
  editorial. É o único CTA da home além do e-mail.
- **Como é montado:** grade escalonada: as alturas alternam retrato e paisagem, e o vazio embaixo dos cards de
  paisagem cria ritmo. Ao passar o mouse, a capa é trocada por uma segunda foto do mesmo projeto (outro cômodo). Ao
  clicar, a foto do card cresce na tela até virar o hero da página do projeto (transição de elemento compartilhado,
  vista nos prints de transição). No celular vira coluna única, com seta → ao lado do nome.
- **Imagem:** capas sem legenda além do número e do nome. O hover revela uma segunda foto, o que mostra mais
  trabalho sem ocupar espaço.
- **Copy:** *"Our signature approach is timeless, unconventional and authentic."* / "01. Robberg Retreat" / "View All"

**5. Rodapé-contato.**

- **Mostra:** bloco cor de oliva com o e-mail `design@simonekatherine.com` em serifa clara enorme (cerca de 70px, o
  maior elemento do bloco). Abaixo, Instagram e Pinterest em linhas com fio (rótulo à esquerda, @ à direita); à
  direita, "Credits" e "Back to Top".
- **Para quê:** é **o único ponto de conversão da home**: o e-mail gigante é o pedido de contato. A troca de cor do
  fundo (de creme para oliva) marca o fim.
- **Como é montado:** bloco de altura média, e-mail clicável (`mailto`). Não tem telefone, WhatsApp, endereço,
  horário nem formulário. No celular aparece o rótulo "Email" acima do endereço, sublinhado.
- **Imagem:** nenhuma.

### Páginas internas

**6. Projetos (índice).**

- **Mostra:** o título "Projects" e um parágrafo sobre o processo ser único para cada cliente. Abaixo, os 13
  projetos na mesma grade de 4 colunas com alturas alternadas, só com número e nome: Robberg Retreat, Rolling Lawns,
  Penthouse 501, Summersby House, Summer Planes, Garden Scene, Station House, Villa Skyfall, Fair Play, Around House,
  French Affair, Jewel Box, Modern Fresnaye.
- **Para quê:** usar o **volume como prova de experiência** e dar porta de entrada a cada caso. O parágrafo de
  abertura é **o único lugar do site que fala de personalização para o cliente**.
- **Como é montado:** a mesma grade escalonada da home, com o mesmo hover (troca de foto) e a mesma transição ao
  clicar. Não tem filtro nem categoria.
- **Imagem:** uma capa por projeto, sem legenda. Os nomes são poéticos e não dizem se é casa, apartamento ou
  cobertura, nem o bairro ou o ano.
- **Copy:** *"Our interior design process for each project is completely unique. We take into consideration the
  client's style, personality and specific needs to ensure their vision is executed perfectly."*

**7. Projeto individual: hero.**

- **Mostra:** uma foto do projeto em tela inteira (dentro da moldura de 20px), com um aviso pequeno "Scroll to view
  more" no canto de baixo, à esquerda.
- **Para quê:** **continuar a transição que vem do card** e abrir o caso pela melhor foto, sem título por cima, para a
  imagem falar primeiro.
- **Como é montado:** altura de uma tela. O título só aparece na dobra seguinte.
- **Imagem:** foto limpa, sem véu nem texto em cima, ao contrário do hero da home.

**8. Projeto individual: capítulos e galeria.**

- **Mostra:** o texto do projeto dividido em capítulos (contexto, materiais e paleta, conceito), cada um com título e
  um parágrafo. Depois, a sequência de fotos: 21 imagens no Robberg Retreat (os projetos têm de 15 a 21 cada), em
  escalas alternadas, com detalhes macro de louça e de papel de parede.
- **Para quê:** **contar o projeto pela imagem**, com um parágrafo curto explicando várias fotos de uma vez. O detalhe
  macro prova cuidado com acabamento e objeto, não só com o ambiente.
- **Como é montado:** em cada capítulo, o título e o parágrafo ficam parados numa coluna estreita enquanto uma coluna
  de fotos de meia largura rola ao lado. Depois o padrão se rompe com fotos de largura total e pares.
- **Imagem:** nenhuma foto tem legenda.

**9. Projeto individual: ficha técnica.**

- **Mostra:** no fim de cada projeto, rótulo pequeno e valor grande: Location, Project Time (exemplos: "1 Year",
  "5 Months"), Rooms ("5 Bedroom", "3 Bedroom") e o Architect ou Developer parceiro ("Anne Machin Architects",
  "Berman Brothers").
- **Para quê:** dar o **dado objetivo** do caso (onde, quanto tempo levou, de que tamanho é a casa, com quem foi
  feito). O parceiro nomeado é prova de terceiro dentro do próprio projeto.
- **O que falta:** metragem (a ficha traz cômodos, não m²), o estado original do imóvel e um CTA de contato.

**10. Projeto individual: "Next Project".**

- **Mostra:** foto em tela inteira com véu escuro, "Next Project" e o nome do próximo projeto.
- **Para quê:** manter o visitante consumindo portfólio sem parar.
- **Como é montado:** ao rolar, o próximo projeto carrega sozinho, num loop. **A página de projeto não tem rodapé**:
  quem lê um projeto inteiro só encontra o contato abrindo o menu.

**11. About (My Story).**

- **Mostra:** a história da fundadora com retrato, fotos de processo (mãos com amostras de tecido, moodboards de
  materiais), uma citação em primeira pessoa sobre o estilo e a colaboração com o cliente e uma colagem assimétrica
  na abertura, no mesmo padrão da home. Termina com a assinatura "Simone Hirsch" em SVG, seguida do rodapé oliva.
- **Para quê:** **personificar um estúdio de uma pessoa só**: o rosto, a voz em primeira pessoa e a assinatura dizem
  "sou eu quem faz". As fotos de processo mostram como ela trabalha, coisa que a foto do ambiente pronto não mostra.
- **O que falta:** formação, registro profissional ou credenciais. A experiência aparece como "decades of
  experience", sem número de anos.

**12. Press.**

- **Mostra:** 13 publicações de 2020 a 2024 (House and Garden, Homes & Gardens Alemanha, SA Garden and Home, Sunday
  Times Lifestyle, Australian Home Beautiful, UK 25 Beautiful Homes, entre outras), cada uma abrindo o PDF da
  matéria. Depois, o rodapé oliva.
- **Para quê:** **prova de terceiro no lugar do depoimento**, que o site não tem. Quem desconfia pode abrir a matéria.
- **Como é montada:** lista de publicações em duas colunas à esquerda e uma capa grande à direita, que muda conforme o
  mouse passa pelo nome.

**13. Contact.**

- **Mostra:** uma tela única com o e-mail e o telefone clicável (`tel:`), sobre um close de almofada de veludo azul e
  folhagem com véu escuro, dentro da moldura de 20px.
- **Para quê:** atender quem já decidiu chamar.
- **O que falta:** formulário, WhatsApp, endereço, área atendida e horário. É **o único lugar do site com telefone**.

### Comparando com `_memoria/design/00-anatomia.md`

- **Hero:** a anatomia pede o que é, para quem e o que fazer, em três segundos. A Simone responde **o que é, onde e
  com que estilo**, na frase de posicionamento. O "o que fazer" não existe (sem CTA), e o nome repetido do cabeçalho
  gasta a primeira dobra.
- **Para quem é:** não há seção. O mais perto é a expressão "high-end Residential projects" no texto.
- **O que fazemos:** só o escopo genérico ("all phases from initial conception to final execution"; móveis, tecidos,
  acessórios e peças sob medida; "white-glove service"). Nenhuma lista do que o cliente recebe.
- **Como começa:** **não existe.** Nenhuma etapa, prazo, faixa de investimento ou explicação do primeiro contato.
- **Quem faz:** é o bloco mais forte: retrato no menu, My Story com fotos de processo, citação em primeira pessoa e
  assinatura. Falta a formação.
- **Como é / onde é:** só a cidade. Sem bairro, endereço ou área atendida.
- **FAQ:** não existe.
- **Contato:** e-mail gigante em quase toda página, telefone só em Contact, sem formulário e sem WhatsApp. A página
  mais persuasiva (o projeto) não tem saída.
- **Encenar a prova:** 13 projetos com 15 a 21 fotos cada, ficha técnica com o arquiteto parceiro nomeado e imprensa
  com o PDF da matéria. Afirmar, o site afirma pouco; quase tudo é mostrado.
- **Vender o freio:** só o parágrafo do índice de projetos ("completely unique... the client's style, personality"),
  que antecipa "vai ficar com a cara dela e não com a minha".

**A diferença de fundo:** a anatomia organiza a página em torno das dúvidas de quem vai comprar. A Simone organiza em
torno de **uma pergunta só, "ela tem o gosto que eu quero?"**, e delega o resto à conversa por e-mail. Funciona para
quem já chega indicado ou pela revista; não funciona para quem chega frio pela busca. O mais perto de um
elemento-assinatura é a **moldura creme de 20px**, que transforma toda foto grande numa prancha de livro.

---

## Como as imagens aparecem

O site tem **cinco regimes de imagem**, cada um com uma função:

1. **Na home e na abertura do About, imagem como prova de gosto, sem legenda.** A colagem assimétrica mistura
   ambiente inteiro, canto com personagem e detalhe macro, e nenhuma foto diz de que projeto é. É o que o Marcelo
   descreveu: imagens que mostram o trabalho sem o site explicar o que tem dentro delas. A sobreposição aqui é
   **discreta** (uma foto invade uns 20px a borda do hero), não uma pilha de fotos.
2. **Nos cards, imagem com o mínimo de texto** (número e nome). O hover troca a capa por outra foto do mesmo
   projeto, e o clique faz a foto crescer até virar o hero do caso.
3. **No projeto, imagem sem legenda individual, explicada pelo capítulo fixo ao lado** e, no fim, pela ficha técnica.
4. **Material de terceiros (capas de revista) uma de cada vez**, trocando no hover, em vez de mural.
5. **A pessoa como imagem:** retrato no menu, fotos de processo no About e a assinatura manuscrita.

Mesmo sem legenda na tela, **toda foto tem texto alternativo descritivo**. Tirar a legenda não é tirar a descrição.

Os padrões, na ordem em que valem mais para o pedido do Marcelo:

### Colagem assimétrica sem legenda

- **Onde:** intro da home e da página About.
- **Como funciona:** uma foto grande numa coluna larga, uma vertical na coluna estreita oposta e um par de fotos
  pequenas alinhadas pela base, com vazio no meio. Nenhuma diz de que projeto vem.
- **Efeito:** mostra repertório e gosto (ambiente, canto com personagem, detalhe macro) sem obrigar o visitante a ler.
  A foto vira atmosfera e prova ao mesmo tempo.

### Foto invadindo a borda da seção anterior

- **Onde:** a foto do cão na poltrona, que sobe cerca de 20px sobre a base do hero.
- **Como funciona:** o topo da primeira foto da intro fica acima do limite de baixo do hero, e as duas se sobrepõem
  por um instante.
- **Efeito:** costura as seções e quebra o empilhamento de caixas. Quem rola percebe continuidade, não uma faixa
  nova.

### Hover que troca a foto da capa

- **Onde:** cards de projeto (home e índice).
- **Como funciona:** ao passar o mouse, a capa é substituída por uma segunda foto do mesmo projeto (outro cômodo).
- **Efeito:** mostra o dobro de trabalho sem ocupar espaço e convida o clique, porque revela que há mais lá dentro.

### Card que cresce até virar o hero

- **Onde:** clique em qualquer card de projeto.
- **Como funciona:** a foto do card se expande da posição dela na grade até ocupar a tela, e a página do projeto abre
  com aquela foto como hero.
- **Efeito:** continuidade de navegação: o visitante sente que entrou na foto, não que trocou de página.

### Texto fixo à esquerda e fotos rolando à direita

- **Onde:** página de projeto, em cada capítulo.
- **Como funciona:** o título e o parágrafo ficam parados numa coluna estreita enquanto uma coluna de fotos de meia
  largura rola ao lado. Depois o padrão se rompe com fotos de largura total e pares.
- **Efeito:** um único parágrafo curto explica várias fotos sem legendar nenhuma, e a alternância de escala evita
  monotonia em projetos de 20 ou mais fotos.

### Sequência longa de fotos sem legenda

- **Onde:** página de projeto (21 imagens no Robberg Retreat).
- **Como funciona:** escalas alternadas (largura total, pares, meia coluna, detalhe macro de louça e de papel de
  parede), todas sem texto.
- **Efeito:** o projeto é contado pela imagem, e o detalhe macro prova o cuidado com acabamento e objeto.

### Grade escalonada retrato/paisagem

- **Onde:** projetos da home e índice de projetos.
- **Como funciona:** 4 colunas da mesma largura, com cards alternando altura (retrato de 464px, paisagem de 232px).
  Embaixo dos cards de paisagem sobra vazio.
- **Efeito:** ritmo de revista em vez de grade de loja, e cada projeto entra pela proporção da sua melhor foto.

### Moldura creme de 20px

- **Onde:** hero da home, hero dos projetos, página Contact.
- **Como funciona:** a foto ocupa a tela inteira menos uma margem creme de 20px em volta e não encosta na borda da
  janela.
- **Efeito:** a foto parece uma prancha emoldurada num livro, e o creme do resto do site continua visível.

### Retrato da profissional no menu e assinatura manuscrita

- **Onde:** menu overlay (desktop) e fim da página About.
- **Como funciona:** o retrato aparece sempre que o menu abre. A About termina com a assinatura "Simone Hirsch" em
  SVG.
- **Efeito:** personifica um estúdio de uma pessoa só. O rosto e a assinatura dizem "sou eu quem faz".

### Capa de revista que troca no hover

- **Onde:** página Press.
- **Como funciona:** lista de publicações em duas colunas à esquerda e uma capa grande à direita, que muda conforme o
  mouse passa pelo nome. Cada item abre o PDF da matéria.
- **Efeito:** mostra o veículo como prova visual sem transformar a página num mural de 13 capas.

### Próximo projeto em foto escura que puxa a página seguinte

- **Onde:** fim de cada projeto.
- **Como funciona:** foto em tela inteira com véu escuro, "Next Project" e o nome do próximo. Ao rolar, o próximo
  projeto carrega sozinho, num loop.
- **Efeito:** mantém o visitante consumindo portfólio, mas ele **nunca chega a um contato** (ver "O que não copiar").

### Foto de detalhe escurecida como fundo do contato

- **Onde:** página Contact.
- **Como funciona:** close de almofada de veludo azul e folhagem com véu escuro, com o texto de contato por cima.
- **Efeito:** mantém o clima de material e textura até no contato, mas o véu derruba o contraste.

---

## Informação: o que tem e o que falta

**Tem:**

- Nome do estúdio e nome completo da fundadora (Simone Katherine Hirsch).
- Cidade (Cape Town), sem bairro nem endereço.
- Tipo de cliente: "high-end Residential projects".
- Estilo: timeless, classic and contemporary, relaxed comfort, understated elegance.
- Escopo genérico: todas as fases, da concepção à execução; móveis, tecidos, acessórios e peças sob medida.
- Experiência: "decades of experience", sem número de anos nem formação.
- 13 projetos com nome, texto em capítulos (contexto, materiais e paleta, conceito) e 15 a 21 fotos cada.
- Ficha técnica por projeto: Location, Project Time, Rooms e o Architect ou Developer parceiro.
- Imprensa: 13 publicações de 2020 a 2024, cada uma com o PDF da matéria.
- Retrato da fundadora (menu e About) e fotos de processo (mãos com amostras de tecido, moodboards de materiais).
- Citação em primeira pessoa da fundadora sobre o estilo e a colaboração com o cliente.
- E-mail em todas as páginas menos as de projeto; telefone só na página Contact.
- Instagram e Pinterest.

**Falta:**

- Formulário de contato ou briefing inicial.
- WhatsApp (e o telefone não aparece na home nem no rodapé).
- Endereço, bairro ou área atendida.
- Horário ou forma de atendimento (visita, reunião online).
- Página ou bloco de serviços: o que está incluso em cada serviço, o que o cliente recebe.
- Processo em etapas: como começa, o que acontece em cada fase, quanto tempo leva.
- Preço, faixa de investimento ou forma de cobrança.
- FAQ.
- Depoimentos de clientes (a imprensa ocupa esse lugar).
- Formação, registro profissional ou credenciais.
- No índice de projetos: tipo de imóvel, bairro, ano e área (os nomes poéticos não dizem nada).
- Metragem dos projetos (a ficha traz cômodos, não m²).
- Antes e depois, ou o estado original do imóvel.
- CTA de contato no fim de cada projeto.

---

## Navegação e conversão

- **Cabeçalho:** só o nome (que leva à home) e "• MENU". Nenhum CTA.
- **Menu:** tela cheia com o retrato da fundadora e 5 itens (Home, About, Projects, Press, Contact).
- **CTA da home:** um só, "View All" (serifa grande, alinhado à direita), que leva ao índice de projetos.
- **Três caminhos até o contato:** (1) o rodapé oliva com o e-mail gigante clicável (`mailto`), Instagram e Pinterest,
  na home, no índice, na About e na Press; (2) a página Contact, uma tela única com e-mail e telefone clicável (`tel:`),
  sem formulário; (3) o menu.
- **O beco sem saída:** a página de projeto não tem rodapé. O fim é o "Next Project", que carrega o próximo caso
  sozinho, então quem lê um projeto inteiro só encontra o contato abrindo o menu.
- **Outros:** "Back to Top" no rodapé. No celular, os cards ganham seta →, "View All" fica centralizado e sublinhado e
  o rodapé mostra o rótulo "Email" acima do endereço.

---

## O que copiar

### Ficha técnica com rótulo pequeno e valor grande

- **Como é feito:** no fim de cada projeto, Location / Project Time / Rooms / Architect ou Developer, cada um com o
  rótulo em corpo pequeno e o valor em destaque.
- **Por que funciona:** é o dado objetivo que o cliente usa para se comparar ("o meu é desse tamanho; quanto tempo
  leva?"). O parceiro nomeado é prova que se confere.

### Projeto contado em capítulos, com o texto parado e as fotos rolando

- **Como é feito:** capítulo com título curto e um parágrafo numa coluna estreita fixa; as fotos de meia largura rolam
  ao lado; depois, fotos de largura total e pares rompem o padrão.
- **Por que funciona:** um parágrafo explica várias fotos sem legenda em cada uma, e o projeto longo não fica
  monótono.

### Hover que troca a capa por outra foto do mesmo projeto

- **Como é feito:** cada card tem duas fotos; o mouse revela a segunda (outro cômodo).
- **Por que funciona:** dobra o trabalho mostrado sem ocupar espaço e sinaliza que há mais lá dentro. Funciona com
  poucos projetos.

### Card que cresce até virar o hero do projeto

- **Como é feito:** a foto do card se expande da posição na grade até a tela inteira, e a página do projeto abre com
  ela como hero.
- **Por que funciona:** a navegação parece entrar na foto, e a primeira imagem do caso é a mesma que convenceu o
  visitante a clicar.

### Colagem sem legenda ao lado do manifesto

- **Como é feito:** ambiente inteiro, canto com personagem e detalhe macro, em colunas assimétricas, ao lado da frase
  de tese.
- **Por que funciona:** a foto prova o gosto enquanto o texto diz a tese. Quando a função da imagem é atmosfera, a
  legenda sobra.

### Foto que invade a borda da seção anterior

- **Como é feito:** o topo da primeira foto da seção sobe uns 20px sobre a base da seção de cima.
- **Por que funciona:** costura as seções e evita o efeito de faixas empilhadas, que denuncia template.

### Grade escalonada em vez de cards iguais

- **Como é feito:** colunas da mesma largura, com alturas alternando retrato e paisagem e vazio embaixo dos cards
  baixos.
- **Por que funciona:** cada projeto entra pela proporção da sua melhor foto, e a página ganha ritmo de revista.

### O rosto da profissional dentro do menu

- **Como é feito:** retrato vertical na coluna esquerda do menu em tela cheia; a lista de páginas na direita.
- **Por que funciona:** num estúdio de uma pessoa só, o cliente compra a pessoa. O rosto aparece quando o visitante
  procura para onde ir, sem gastar uma seção da home.

### Fotos de processo no Sobre

- **Como é feito:** mãos com amostras de tecido e moodboards de materiais, além do retrato.
- **Por que funciona:** mostram como ela trabalha, que é o que a foto do ambiente pronto não mostra.

### Contato como o maior elemento tipográfico do rodapé

- **Como é feito:** o e-mail em cerca de 70px, o maior texto do bloco, repetido nas páginas com rodapé.
- **Por que funciona:** no fim de qualquer leitura, o pedido é impossível de não ver.

### Imprensa como lista com uma capa que troca

- **Como é feito:** nomes das publicações em lista; uma capa grande muda no hover; cada item abre o PDF.
- **Por que funciona:** prova de terceiro que se confere, sem mural poluído.

---

## Tipografia e cor

- **Display (medido no estilo computado):** uma família própria com o nome ofuscado (aparece como "a"), peso 300
  (light). *Aparentemente* uma serifa condensada de alto contraste; a identificação exata da fonte não foi confirmada.
  Vai de 23px (nome no card) a cerca de 150px (H1 e "Projects").
- **Corpo (medido no estilo computado):** sans ofuscada como "gs-v", 18px, pesos 400 e 500. *Aparência* de General
  Sans, não confirmada.
- **Cor (medida):** fundo creme `#FFFDF7` (rgb 255,253,247); texto corrido taupe `#83735B` (rgb 131,115,91); títulos
  sobre foto em taupe claro `#A9977D` (rgb 169,151,125).
- *Aparentes, não medidas:* o oliva do rodapé, por volta de `#737057` (rgb 115,112,87), amostrado do print; o corpo dos
  parágrafos de projeto, que parece estar em cerca de 14px.
- **Contraste:** pela conta com os valores medidos, o taupe sobre o creme dá cerca de 4,5:1, no limite do AA para
  texto normal. Em corpo pequeno (cerca de 14px, *aparente*), isso pesa. O taupe claro sobre foto escurecida tem
  contraste baixo.
- **Quantos acentos de verdade:** nenhum. Paleta de 3 tons quentes; quem dá cor são as fotos.
- **Movimento:** rolagem suave com Lenis, transição de elemento compartilhado do card para o hero, troca de foto no
  hover.

---

## O que serve à Débora Reis

### A diferença de propósito, antes de copiar qualquer coisa

A Simone fala com quem já chega indicado ou por revista, e o site dela só precisa **confirmar o gosto**. A Débora é
também uma profissional só, mas faz projeto de interiores, acompanhamento de obra e decoração de apartamento em
Salvador, e o cliente dela pode chegar frio. O site dela precisa **confirmar e converter**: mostrar o trabalho,
explicar o que ela entrega e por onde se começa, e deixar o WhatsApp a um toque.

Por isso se aproveita da Simone a **mecânica de imagem e de personificação** (colagem, hover, capítulos, ficha, rosto
no menu, fotos de processo) e **não** se aproveita a economia de informação (sem serviço, sem processo, contato só por
e-mail).

### O que aproveitar, e como

1. **Ficha técnica no fim de cada projeto.** Para ela: bairro em Salvador, prazo da obra, metragem e qual dos três
   serviços entrou (projeto, acompanhamento de obra, decoração). Só com dado real dela:
   `[FALTA: bairro, prazo, metragem e escopo de cada projeto, dados pela Débora]`.
2. **Projeto em capítulos curtos, com o texto fixo enquanto as fotos rolam.** Para reforma, os capítulos podem seguir
   a lógica do problema: o que era, o que mudou, os materiais escolhidos.
3. **Hover trocando a capa por uma segunda foto do mesmo projeto.** Barato de fazer e funciona com poucos projetos.
4. **Colagem sem legenda ao lado do manifesto**, misturando ambiente inteiro, canto com personagem e detalhe macro. A
   foto tem que ser do trabalho dela (integridade), e o texto alternativo continua descrevendo cada uma.
5. **A foto da seção seguinte invadindo uns 20px a borda da anterior**, para costurar as seções.
6. **Rosto dela dentro do menu e assinatura manuscrita no fim do Sobre.** O cliente de um escritório de uma pessoa só
   compra a pessoa.
7. **Fotos de processo no Sobre.** O equivalente, para quem acompanha obra, é foto de obra e de reunião de materiais:
   `[FALTA: fotos de obra e de escolha de materiais, se ela tiver]`.
8. **Grade escalonada (retrato e paisagem alternados)** em vez de cards iguais.
9. **Contato como o maior elemento tipográfico do rodapé, em todas as páginas.** Para ela, o WhatsApp no lugar do
   e-mail, e também no fim de cada projeto, que é onde a Simone erra.
10. **Home curta, com a profundidade nas páginas internas**, mas com um bloco que a Simone não tem: **serviços e
    processo**, porque o cliente de reforma de apartamento não sabe o que um arquiteto de interiores entrega nem por
    onde começa.
11. **Imprensa como lista com uma capa que troca e o PDF da matéria.** Só se a Débora tiver publicação ou prêmio real:
    `[FALTA: publicação ou prêmio, se existir]`. Não fabricar.

### O que o esboço já resolve, e o que não

Conferido em 15/10/2026 nos arquivos de `clientes/_prototipos/debora-reis/site/`, e no teardown do
[Pelizzari](pelizzari.md), feito no mesmo dia:

- **O beco sem saída da Simone o esboço não tem.** As seis páginas de projeto têm link para o WhatsApp, "Ver todos os
  projetos" e um chamado contextual (o "...pensada assim?" do fim), e três delas fecham também com "Próximo
  apartamento" (conferido nos arquivos). Manter.
- **O contato não é só e-mail:** o WhatsApp e o endereço do escritório (Rua Aracaju, 34, Barra) aparecem na home e
  no menu. Manter.
- **O bloco de serviços e processo existe** ("Como trabalho" e o guia do cliente com as etapas), mas o guia ainda leva
  a etiqueta "Demonstração" (registrado no teardown do Pelizzari): prazo e valor precisam vir dela antes de publicar.
- **A ficha dos projetos é parcial** (registrado no teardown do Pelizzari): faltam ano, metragem, escopo e duração, que
  são justamente os campos que a ficha da Simone tem e que o item 1 pede.

---

## O que não copiar

- **Preloader com contador de porcentagem.** De 1 a 2 segundos de tela vazia sem informação nenhuma, só atraso, pior
  ainda no 4G.
- **Projeto sem saída para o contato.** Sem rodapé e com o "Next Project" em loop, quem acabou de se convencer lendo
  um projeto não acha como chamar. No site da Débora, o fim do projeto precisa de um CTA (WhatsApp) antes do próximo
  projeto.
- **Telefone só na página Contact, sem WhatsApp e sem formulário.** Para um cliente de Salvador, o e-mail como único
  canal visível na home é atrito.
- **Nenhuma explicação de serviço ou processo.** "All phases from initial conception to final execution" e
  "white-glove service" não dizem o que o cliente recebe, em que ordem nem em quanto tempo.
- **Índice de projetos só com nomes poéticos** (Jewel Box, Fair Play). Não dá para saber se é apartamento, casa ou
  cobertura, de que bairro ou de que ano. A Débora precisa marcar apartamento, bairro e escopo no card.
- **Copy de posicionamento intercambiável** ("timeless, sophisticated", "stand the test of time", "timeless,
  unconventional and authentic"). Serve para qualquer estúdio de interiores do mundo.
- **Nome repetido no cabeçalho e no H1 do hero.** Gasta a primeira dobra com informação duplicada.
- **Véu escuro forte no hero e no contato, com texto taupe claro por cima.** Contraste baixo e foto apagada: na home,
  o trabalho mais bonito vira fundo.
- **Corpo de texto pequeno e claro nos projetos** (cerca de 14px, *aparente*, taupe sobre creme). Leitura difícil no
  celular.
- **As fontes próprias ofuscadas.** Não copiar. A família de display é provavelmente comercial (licença paga): passar
  pelo `kit-tipo` antes de usar algo parecido.
- **Depender só de imprensa e foto profissional.** Sem depoimento, sem formação e sem anos exatos ("decades"), o site
  se apoia inteiro num nível de imprensa e de fotografia que a Débora talvez não tenha.

---

## Aplicado onde

Ainda não. Estudado em 15/10/2026 para o esboço da Débora Reis (`clientes/_prototipos/debora-reis/`). Candidatos à
aplicação: ficha técnica completa no fim de cada projeto (depende dos dados dela), hover com segunda foto nos cards,
capítulos com texto fixo nas páginas de projeto, retrato dela no menu e fotos de processo no Sobre (se existirem).
Preencher quando acontecer, com a adaptação feita.

Prints (somem com a sessão):
`/tmp/claude-0/-home-user-HorusOS-Pro/ada53c37-1efb-518e-8aec-f8416f2ef82e/scratchpad/ref/simone-katherine/`
