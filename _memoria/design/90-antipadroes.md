# Antipadrões: o que denuncia site feito por IA

> Catálogo vivo. **Toda correção de design do Marcelo entra aqui, com o porquê.**
> Sem o porquê a regra vira superstição e é aplicada onde não devia.
>
> Ordem: os de cima são os que mais aparecem.

---

## Tipografia

**Poppins, Montserrat e DM Sans em título.** São as três fontes mais usadas em
site gerado por IA. Não são feias, são gastas. Quem vê muito site reconhece na
hora.
→ *Origem: auditoria do site da Aion, 26/07/2026.*

**Fraunces e Instrument Serif.** As duas serifas favoritas do modelo quando ele
tenta "parecer editorial". Mesmo problema.
→ *Origem: taste-skill §4.1. Descoberto no site da Aion, onde eu tinha acabado de
sugerir Fraunces sem consultar a skill.*

**Serifa por reflexo.** "Brief criativo, então serifa" é o raciocínio errado. Só
usar serifa quando dá para explicar por que **aquela** serifa serve **aquela**
marca. Se não dá, usar uma sans de display com personalidade.

**Tracking negativo em serifa antiga.** Garalda com `letter-spacing:-.02em` fecha
o contraforma e suja a leitura. Tracking negativo é para sans geométrica grande.
**Piso absoluto: -0.04em.** Abaixo disso as letras encostam. Na prática -0.02 a
-0.03em quase sempre lê melhor que o valor extremo.
→ *Piso incorporado do `craft-floor` do impeccable, 28/07/2026.*

**Escala de tipo achatada.** Vinte e dois tamanhos entre 11,5px e 21,4px não é
hierarquia, é sorteio. Se o maior título tem menos que o dobro do corpo, a página
não tem nível nenhum, tem uma massa cinza. Poucos tamanhos, com pelo menos 1,25 de
razão entre um degrau e o próximo.
→ *Origem: detector apontou razão de 1,9:1 com 22 tamanhos no site da Aion,
28/07/2026. Regra `flat-type-hierarchy`.*

**Caixa alta em texto corrido.** `text-transform: uppercase` serve pra rótulo de
duas ou três palavras. Em frase de 30 caracteres ou mais, mata a leitura: some o
desenho da palavra, que é como a gente lê rápido.
→ *Origem: detector, 3 casos na Aion e 5 no Giovanni. Regra `all-caps-body`.*

**Texto funcional abaixo de 11px.** Link, botão, item de menu, rótulo, célula de
tabela. Piso de 11px, e 10px só pra letra miúda jurídica que ninguém precisa
clicar. Estar na escala de tokens não salva: colocar 8px na escala legitima o
token, não a legibilidade.
→ *Origem: detector achou 8,96px na palavra "PSICOLOGIA" do logo da Aion, nas 4
páginas. Regra `undersized-ui-text`.*

**Medida de linha fora de 65 a 75 caracteres.** Linha longa demais faz o olho
perder a volta; curta demais pica o texto. Vale pro corpo, não pro título.

**Monospace como fantasia de "técnico".** Fonte de código serve pra código, dado e
medida. Usada pra dar ar de tecnologia numa clínica, é figurino.

---

## Layout

**Grid de ícone pequeno + texto, 2x3 ou 3x1.** O formato mais genérico que
existe. O ícone de 22px ao lado da frase não informa nada, é enchimento.
→ *Origem: seção "Quando procurar" da Aion, refeita em 26/07/2026.*

**Três cards iguais lado a lado.** Se as três coisas têm o mesmo peso, elas não
precisam de card. Agrupa com espaço ou com um fio. O card é o container preguiçoso:
é pra onde a mão vai quando não se decidiu a hierarquia. E **card dentro de card
está sempre errado**, sem exceção.
→ *"Nested card" incorporado do impeccable, 28/07/2026. O detector achou 3 no
material do Giovanni.*

**Card fantasma: borda de 1px por baixo de sombra larga e suave.** Escolhe um dos
dois. Elevação se declara **uma vez só**, ou por borda ou por sombra. Os dois
juntos é a assinatura de card gerado por modelo.
→ *Origem: 5 casos no material do Giovanni. Regra `gpt-thin-border-wide-shadow`.*

**Raio de card fora de 12 a 16px.** Pílula (raio total) é pra controle pequeno,
botão e tag. Card com raio de pílula infantiliza a página; card com raio zero num
layout todo arredondado é inconsistência, não contraste.

**Texto colado na borda do container.** Dentro de qualquer caixa com borda, contorno
ou fundo próprio: mínimo 8px de respiro, ideal 12 a 16px. Filho encostado no fio
de cima é o defeito mais fácil de ver e o mais fácil de não olhar.
→ *Origem: detector, 5 casos na Aion (`passo` e `faq-lista`). Regra `cramped-padding`.*

**Tira de especificação repetindo fato já dito em outra parte da mesma página.**
Depois de duas fotos grandes ou de um bloco de produto, a mão vai para uma fileira
de 3 a 4 itens ("250g · 100% arábica · Torra artesanal · Sob medida") pra preencher
o espaço abaixo. Antes de publicar, conferir cada item contra o resto da página: se
o mesmo fato já apareceu numa faixa de atributos, num parágrafo ou num selo em
outra seção, a tira não é reforço, é reciclagem — informação real, sem função nova.
E o item que sobra, o único não repetido, ainda precisa passar pelo `integridade.md`:
plausível (o formulário aceita quantidade livre, por exemplo) não é confirmado.
→ *Origem: Grão da Serra, 10/08/2026. A tira abaixo de "Em grãos ou moído" repetia
3 de 4 itens já ditos na faixa verde do topo e na seção anterior, e o 4º ("sob
medida") não tinha confirmação do cliente. Removida sem substituto — as duas
seções seguintes já continuavam a narrativa.*

**Hero de número grande com rótulo pequeno**, mais três estatísticas de apoio e um
acento colorido. É a resposta de template pra "faça um hero de impacto". Só usa se
o número for de verdade e for mesmo a coisa mais característica do cliente.

**Modal pra tarefa que não precisa interromper.** Modal existe pra proteger foco ou
exigir decisão. Usado como gaveta de conteúdo, é obstáculo.

**Eyebrow em cima de toda seção.** Teto: um a cada três seções. É o que cria o
ritmo repetitivo de template.
O caso mais denunciador é o **eyebrow logo acima do h1 do hero**, ainda mais em
formato de pílula: virou o hero padrão de SaaS gerado por IA. No hero, ou o rótulo
entra dentro do título, ou vira migalha de navegação, ou não existe.
→ *Origem: detector achou em `especialidades.html` e `politica-privacidade.html` da
Aion, 28/07/2026. Regra `hero-eyebrow-chip`. O impeccable proíbe eyebrow em
qualquer lugar; aqui a regra continua sendo o teto de 1 a cada 3, que é mais
defensável, com o hero como caso fechado.*

**Zigue-zague infinito.** Imagem à esquerda, texto à direita, inverte, repete.
Máximo duas seções seguidas nesse padrão.

**Nuvem de pílulas com os diferenciais.** Oito chips arredondados, centralizados,
cada um com um pontinho colorido do lado. É a resposta de template para "coloque os
diferenciais em destaque": informação sem hierarquia nenhuma, porque as oito coisas
ficam com exatamente o mesmo peso, e um formato que não diz nada sobre o cliente.
A saída não é enfeitar o chip, é achar o objeto que aquele negócio já tem e que
carrega esse tipo de informação no mundo real: no café, o **rótulo do pacote**; num
serviço, a ficha de escopo; num produto físico, a etiqueta.
→ *Origem: Marcelo no Grão da Serra, 03/08/2026: "não gostei de como ficou
organizado as tags, ficou com cara de IA". Viraram um rótulo de pacote, uma caixa
só, que ainda marca o lugar onde a foto real da embalagem vai entrar.*

**Elemento decorativo repetido em escalas diferentes pela página.** Prima do logo
ampliado como marca-d'água. O mesmo recorte (a folha, a cereja, o grão) aparece
três vezes no hero e mais duas em outras seções, cada uma com um blur e uma
opacidade. Parece profundidade e é repetição: o olho reconhece o mesmo desenho e a
cena vira papel de parede. **Um recorte de cada tipo, e cada um aparece uma vez.**
→ *Origem: Marcelo no Grão da Serra, 03/08/2026: "ficou muitos elementos, e os
elementos na home se repetem". Cinco elementos flutuantes viraram três, um de cada.*

**Palavra que gira no título trocada por opacidade.** O recurso ("Somos uma
empresa que constrói SONHOS / TECNOLOGIA / FUTURO") é bom e tem duas armadilhas,
as duas de layout. **Uma:** cruzar duas palavras de 80px por `opacity` põe as duas
na tela ao mesmo tempo, meio transparentes, uma por cima da outra. O resultado não
é transição, é borrão ilegível por meio segundo, e é justamente o meio segundo em
que a pessoa está olhando. A saída é recortar a faixa (`overflow:hidden`) e
deslizar: a que sai some pela borda de cima enquanto a que entra sobe pela de
baixo, e as duas nunca dividem o mesmo pixel. **Duas:** se as palavras têm larguras
diferentes, o título reflui a cada troca e a página inteira treme. Duas defesas que
se somam: empilhar todas na MESMA célula de grid, e assim a caixa tem sempre a
largura da mais larga, e **escolher palavras de tamanho parecido na hora de
escrever a copy**. A segunda é decisão de texto, não de CSS, e é a que resolve de
verdade.
→ *Origem: hero da Hórus, 05/08/2026. As quatro palavras (APARECER, RESPONDER,
PUBLICAR, ANUNCIAR) foram escolhidas com 8 e 9 letras de propósito.*

**Fantasma de largura feito com a palavra mais LONGA.** Numa palavra que troca, o
truque de segurar a caixa com um gêmeo invisível é certo, e escolher esse gêmeo
pela contagem de letras é errado: a palavra com mais letras não é a mais larga em
pixels numa fonte proporcional. Pior no efeito de decodificação, em que aparecem
letras que não estão em nenhuma das palavras. O fantasma tem que ser a **letra
mais larga da fonte repetida** até o comprimento máximo (`MMMMMMMM`), e aí a caixa
nunca cresce e o título centralizado não balança.
→ *Origem: hero da Hórus, 05/08/2026.*

**Texto vazado por cima de uma chapa.** Contorno de letra com miolo transparente é
bonito e só funciona se houver **o que ver por dentro**. Com um `background` na
mesma caixa, o vazado revela a própria chapa, ou seja, nada, e o efeito lê como
letra cinza mal resolvida. Se o pedido é ver a imagem através das letras: tira o
fundo da seção, põe `color: transparent` de verdade (não uma cor a 6%) e deixa só
o `-webkit-text-stroke`.
→ *Origem: Marcelo no site da Hórus, 05/08/2026: "tire esse fundo cinza que está na
frente do símbolo, quero que as palavras sejam transparentes".*

**Logo em resolução de cabeçalho usado em escala de cartaz.** A regra de exportar
imagem no tamanho de exibição vale para o símbolo também, e é fácil esquecer
porque ele "já está no `assets/`". Um WebP de 96px de largura esticado para 340
borra igual a qualquer foto. Arquivo por tamanho de uso, não por elemento.
→ *Origem: faixa de palavras da Hórus, 05/08/2026. Virou `simbolo-grande.webp`,
420px, 22 KB, gerado do PNG com alfa que já estava em `site-fontes/`.*

**Rotação de palavra sem par para leitor de tela.** As palavras que não estão na
vez continuam no HTML, e o leitor lê a frase com as quatro grudadas
("...negócio aparecerresponderpublicaranunciar"). As três em espera levam
`aria-hidden="true"` fixo: a frase lida em voz alta fica completa e verdadeira com
a primeira palavra, e a rotação é o que ela é, um efeito visual.
→ *Origem: hero da Hórus, 05/08/2026.*

**Recuo lateral zerado só num breakpoint.** O detector apontou `cramped-padding`
numa faixa que tinha `padding: 74px 24px` escrito na cara, e a primeira reação foi
declarar falso positivo de componente e sair procurando como registrar exceção.
Eram três tentativas de dispensa até olhar o media query do celular, onde estava
`padding: 52px 0`. **O detector estava certo, e a regra valia num tamanho de tela
só.** Antes de chamar achado de falso positivo, procurar a mesma propriedade em
todos os breakpoints: o valor que reprova quase nunca é o que está no topo do
arquivo.
→ *Origem: site da Hórus, 05/08/2026. Vale para toda a família de regra que mede
espaço, não só `cramped-padding`.*

**Fio em cima e embaixo de cada linha de lista.** Escolhe um, e usa com parcimônia.
Tabela de dez linhas com fio em cada uma é o layout mais preguiçoso que existe.

**Cabeçalho partido:** título grande à esquerda e um parágrafo pequeno flutuando
no canto direito. Empilha vertical.

**Logo ampliado como marca-d'água de fundo.** Pegar o símbolo do cabeçalho, jogar
a 9% de opacidade atrás de uma seção e chamar de motivo gráfico. É o mesmo desenho
duas vezes na página, em escalas diferentes. Marca boa tem sistema (fio, numeração,
ornamento derivado), não cópia ampliada.
→ *Origem: seção "Quem atende" da Aion, trocada pela botânica da marca em 28/07/2026.*

**Órgão do ramo como ornamento em cliente de saúde.** Cérebro em traço para
neuropsicologia, dente para odonto, coração para cardiologia. É o clichê mais
previsível do segmento, e quase sempre o próprio cliente nunca usou aquilo. Antes
de desenhar ornamento, olhar o que a marca dele já usa.
→ *Origem: Aion, 28/07/2026. O cérebro atrás do manifesto ainda contradizia uma
decisão do Marcelo: "peso igual entre os 6 serviços". A copy obedecia, o gráfico
declarava clínica de neuro. **Decoração também posiciona.***

**Foto ajustada pela ALTURA num hero de largura cheia, com chapa de cor no que
sobra.** Ancorar a foto à direita e deixá-la resolver a largura pela altura parece
resolver o corte, mas cria uma **coluna chapada de cor no lado do texto**, com
emenda vertical dura no meio da composição. O cliente não vê "foto ancorada": vê um
retângulo. Se o hero é de largura cheia, a foto cobre a largura inteira e quem
escurece o lado do texto é o **véu**, não uma chapa. O corte se controla no
`object-position`, não trocando a foto por cor.
→ *Origem: Grão da Serra, 06/08/2026. Palavras do Marcelo: "um quadrado marrom
gigante, cortado no meio". A regra anterior — "não use `cover`, ele corta a arte
composta" — continua valendo para **arte já montada** (mockup, pacote posicionado);
não vale para fotografia de cena, onde o corte é enquadramento.*

**Papel rasgado que virou serrilha.** Borda de rasgo desenhada com dentes de ~30px
em intervalo quase regular lê como zigue-zague de tesoura de picotar, não como
papel. Rasgo de verdade é **quase reto com grão fino**: soma de ondas de vários
comprimentos (uma larga de ~350px, uma média, e duas finas de 40px e 15px), mais
entalhes fundos esparsos. E ele precisa de **duas camadas** — uma sombra
translúcida levemente acima e o papel logo abaixo — senão não tem espessura.
→ *Origem: Grão da Serra, 06/08/2026.*

---

## Cor

**Roxo com brilho.** O gradiente roxo-azul com glow é a assinatura visual de IA.

**Brilho radial em fundo escuro.** Primo do anterior e igualmente denunciador: o
holofote borrado atrás do título, a mancha de luz colorida no canto da seção, a
sombra colorida sem deslocamento (halo). Sombra de verdade tem deslocamento e
desfoque; halo sem deslocamento é decoração.
→ *Origem: detector achou 12 `dark-glow` e 3 `radial-spotlight-glow` no material
do Giovanni, 28/07/2026.*

**Bege + latão + oxblood + café** em briefing premium. É a paleta que o modelo
sempre alcança em cliente artesanal ou de luxo, e faz toda marca ficar igual.

**⚠️ Nota sobre creme + serifa + terracota.** Tanto a `frontend-design` da
Anthropic quanto o impeccable classificam essa combinação como o visual de IA
número 1. A Horus usa ela em saúde **de propósito**, tirada do estudo de
concorrentes reais do nicho (`99-checklist.md`), e briefing explícito vence regra
genérica. Mas duas consequências ficam de pé: (1) quem vê muito site reconhece a
combinação, então ela não pode ser a única coisa que a página tem, e é aí que o
elemento-assinatura do `00-anatomia.md` entra; (2) ela **reprova em contraste** nos
valores que a gente vinha usando, e isso não é opinião, é medida: ver a tabela em
`99-checklist.md` §2.5. A exceção do detector para essa paleta está registrada em
`.impeccable/config.json`, e vale só pra Aion.

**Cor tirada a conta-gotas de um mockup entra sem passar pela régua.** Quando o
cliente manda um print de referência (feito por ele, por outra agência ou por uma
IA), a tentação é amostrar as cores e usar exatamente aquelas. O print não foi
auditado: ele foi aprovado no olho, e num tamanho em que o texto pequeno nem
aparece. O caso típico é o **eyebrow dourado sobre creme**, que é lindo no mockup e
dá **1,44:1**. Duas saídas, nesta ordem: **clarear o fundo** até o degrau escuro da
cor de marca fechar 4,5:1, e **criar o degrau escuro** (aqui `#7E6124`, 4,69:1) para
o texto pequeno, deixando a cor original só como preenchimento. A identidade não
muda de rosto; o texto passa a ser legível.
→ *Origem: Grão da Serra, 05/08/2026. O creme do mockup (`#E4D0B4`) foi clareado
para `#F8E4CF` porque com ele NENHUM degrau de dourado fechava. Mesma família do
caso da Aion em `99-checklist.md` §2.5.*

**Texto com gradiente.** Ênfase se faz com peso ou tamanho. Gradiente em letra
some no celular, quebra no modo escuro e não copia direito.

**Vidro e desfoque como decoração.** `backdrop-filter` serve pra sobreposição em
cima de imagem ou vídeo, onde há o que desfocar. Painel de vidro no meio de um
fundo chapado é efeito sem função.

**⚠️ Corolário, quando o cliente PEDE o visual de vidro.** A regra acima continua
de pé e o pedido também: o que muda é de onde o vidro vem. Vidro se faz de **luz**,
não de desfoque. Fundo translúcido claríssimo, fio de borda claro, e um brilho
especular de 1px na aresta de cima, que é onde a luz bateria num objeto de vidro
escuro de verdade. Isso funciona sobre fundo chapado porque não depende de haver o
que borrar. O `backdrop-filter` fica reservado ao painel que **passa por cima de
outro conteúdo**, e em site costuma ser só o cabeçalho fixo e o menu do celular.
Desfoque em card parado sobre fundo chapado continua sendo efeito sem função,
mesmo num site que o cliente pediu "com cara de vidro".
→ *Origem: Marcelo no site da Hórus, 05/08/2026: "esse tom de vidro, quero que
passe para outras partes do site". Virou três tokens (`--vidro`, `--vidro-fio`,
`--vidro-luz`) aplicados em card, rótulo, esteira e nó do trilho, e desfoque em
lugar nenhum além do cabeçalho.*

**Tirar a foto do hero não autoriza pôr brilho no lugar dela.** Quando a arte sai e
o hero fica só de tipografia, a mão vai sozinha para um gradiente radial atrás do
título, para "não ficar vazio". É exatamente `dark-glow` e `radial-spotlight-glow`,
e não deixa de ser porque agora tem um motivo. Se o hero pede um objeto, põe um
objeto de verdade; se não pede, o preto chapado é uma decisão e aguenta o peso.
→ *Origem: hero da Hórus, 05/08/2026. A arte 3D saiu a pedido do Marcelo, e quem
sustenta a cena no lugar dela é o metal correndo no aro do botão, que é superfície
renderizada e não gradiente.*

**Movimento aleatório onde devia ter direção.** Num shader de metal, somar tempo
em dois eixos (`sin(x + t)` mais `cos(y - t)`) faz o padrão balançar para os dois
lados, e o olho lê como ruído, não como superfície correndo. O certo é a ondulação
ser **estática** e o campo inteiro se deslocar num eixo só: aí as faixas correm
sempre no mesmo sentido, como metal escorrendo de verdade.
E velocidade: num aro de 2px, movimento rápido lê como cintilação de LED, não como
líquido. Os três valores da Hórus (parado, hover, clique) caíram para um terço.
→ *Origem: Marcelo no site da Hórus, 05/08/2026: "o movimento dessas cores está
aleatório, quero que sigam em uma direção apenas" e "mais devagar".*

**Aberração cromática forte vira arco-íris, não cromo.** Num shader de metal, o
deslocamento de canal (`shiftRed`, `shiftBlue`) existe para pintar a **quina**
entre claro e escuro, e o valor certo é minúsculo. Com deslocamento grande os três
canais discordam na faixa inteira e o resultado é uma fita de arco-íris, que lê
como brinquedo e não como metal polido. No aro do botão da Hórus, 0,030 devolveu
arco-íris e 0,007 devolveu cromo. **Mesma família do gradiente roxo com glow:** cor
saturada sem motivo físico denuncia efeito gerado.
→ *Origem: site da Hórus, 05/08/2026, na segunda tentativa de portar o
`liquid-metal-button`. A primeira tinha um problema oposto e igualmente errado:
tingir o metal de azul da marca, que apagou o cromo que o Marcelo tinha visto no
componente. **Metal é cinza.** Quem carrega a cor da marca é o que está em volta.*

**Componente de terceiro traz o contraste do autor junto.** Todo componente
copiado de galeria vem com as cores que ficaram boas no print do autor, e print
não é auditoria. O botão de metal líquido chegou com o rótulo em `#666666` sobre
preto: **2,9:1**, reprovado em `low-contrast`, e num CTA, que é o texto mais
importante da página. Portar componente é medir cada cor dele contra o fundo real,
não colar. Contraste é a única família de regra que não se dispensa.
→ *Origem: site da Hórus, 05/08/2026. `#666666` virou `#EDF1F7`, 15,1:1, e o resto
do componente ficou igual.*

**Borda colorida grossa na lateral** de card, item de lista ou aviso. Acima de 1px
vira listra, e listra é o jeito rápido de fingir hierarquia que o espaçamento não
deu.

**Claro ou escuro escolhido por categoria.** "É tecnologia, então escuro" é
reflexo. A escolha sai da cena de uso: quem lê, onde, com que luz em volta.
Clínica lida com gente lendo no celular na rua e senhor de 60 anos na sala de
espera.

**Acento que muda no meio da página.** Escolheu terracota, é terracota até o
rodapé. Botão azul na seção 7 de um site quente é erro, não variedade.

**Contraste é medido, não estimado.** Corpo e placeholder pedem 4,5:1, título
grande pede 3:1. Em fundo colorido, o texto secundário sai da própria matiz do
fundo, nunca de um cinza neutro jogado por cima. Ver a tabela medida da paleta
terrosa em `99-checklist.md` §2.5.

**O acento aprovado numa seção não está aprovado na seção seguinte.** Quando a
página alterna fundo (claro, médio, claro, médio), o mesmo hex de texto muda de
valor a cada faixa. Copiar um trecho que passa no fundo claro para uma seção de
fundo médio é o jeito mais fácil de introduzir `low-contrast` sem mudar uma cor
sequer. Por isso o acento vive em dois ou três tons da mesma família: não é
variedade, é o mesmo acento medido contra cada fundo.
E cuidado com a isenção de "texto grande": ela começa em 24px, ou 18,66px se for
negrito. Título de 20 ou 22px sem peso extra ainda precisa dos 4,5:1 cheios.
→ *Origem: Aion, 30/07/2026. A frase de situação das páginas de serviço herdou o
`--terracota-esc` da home, que passa em 4,8:1 sobre creme e reprova em 4,1:1 sobre
areia. Corrigido para `--terracota-hov`, 5,2:1.*

---

## Conteúdo

**Número falsamente preciso.** `92%`, `4.1x`, `48k`. Ou vem de dado real, ou está
marcado como exemplo, ou não entra.

**Nome genérico.** "João Silva", "Empresa Acme", avatar de ovo cinza.

**Verbo de folheto.** "Elevar", "impulsionar", "transformar", "revolucionar",
"jornada", "soluções". Verbo concreto sempre.

**Copy fofa que não quer dizer nada.** Metáfora forçada, humildade performática,
rótulo pseudo-artesanal ("da bancada", "notas de campo"). Frase funcional simples
é melhor que frase bonitinha sem sentido.

**Título de hero construído sobre uma negação.** "A gente não planta. A gente
escolhe." A frase é boa numa reunião, porque responde a uma dúvida que já foi
levantada. No hero ela não funciona: quem chega não sabia que existia a pergunta, e
a primeira coisa que lê sobre o produto é o que ele **não** é. Restrição interna de
integridade (aqui: não afirmar lavoura) é limite do que se pode escrever, **não é
o argumento de venda**. O hero diz o que a coisa é; a restrição se cumpre em
silêncio, escolhendo as palavras.
→ *Origem: Marcelo no Grão da Serra, 03/08/2026: "não gostei desse título". Virou
"Café puro, torrado à mão no interior da Bahia", que é verdadeiro e não menciona
plantio nenhum.*

**Travessão como recurso de estilo.** No caso da Horus é regra dupla: a
taste-skill proíbe, e o Marcelo já tinha pedido a mesma coisa antes.

**Faixa de clima, cidade e hora** no cabeçalho. **"Role para explorar"** no fim do
hero. **Rótulo de versão** (`v0.6`, `BETA`) sem lançamento nenhum. **Numeração de
seção** (`01 / ÍNDICE`) quando o conteúdo não é uma sequência de verdade, com ordem
que o leitor precisa seguir. Tudo decoração que finge intenção.

> Esta seção é sobre copy de venda. O texto pequeno que faz a interface funcionar
> (botão, rótulo, erro, tela vazia, confirmação) tem arquivo próprio:
> `50-copy-de-interface.md`.

**`max-width:100%` sem `height:auto`, com `width` e `height` no HTML.** Os dois
atributos existem para reservar espaço e não pular o layout ao carregar, e é regra
do checklist. Mas sozinho o `max-width` só limita a largura: a **altura intrínseca
continua de pé**. Uma foto de 780x984 encolhe para a coluna e continua com 984px
de alto, o que empurra o CTA do hero para fora da tela. Uma linha resolve:
`img{max-width:100%;height:auto}`.
→ *Origem: site da Hórus, 04/08/2026.*

**PNG de fundo quase-preto colado numa página escura.** O preto do arquivo nunca
bate exatamente com o da página, e o que aparece é um retângulo com borda visível
no meio da composição. Vale para toda imagem gerada por IA em fundo escuro, porque
o gerador não devolve alfa. A saída é máscara radial no próprio `img`
(`mask-image: radial-gradient(...)`), que dissolve a borda e faz o objeto flutuar.
→ *Origem: site da Hórus, 05/08/2026. É o que separa a arte "numa caixa" da arte
flutuando das dez referências que o Marcelo mandou.*

**Título de hero em quatro linhas é erro de proporção, não de copy.** O reflexo é
encurtar a frase. Antes disso, olhar a largura que sobrou para a coluna de texto e
a escala da fonte: 80px numa coluna de 620px não fecha em duas linhas por mais que
se corte palavra. Planejar tamanho de fonte e largura de coluna juntos.
→ *Origem: site da Hórus, 04/08/2026. Resolvido com a coluna em 1.4fr, não com
copy menor.*

**`clamp()` em `font-size` esconde a escala do detector.** O `flat-type-hierarchy`
não resolve `clamp()` e enxerga só os tamanhos literais, então uma escala correta
de sete degraus "reprova" mostrando três. Pior que o falso positivo: valor fluido
produz tamanho que não está em degrau nenhum da escala. Trocar por valor literal
mais media query, que é o padrão do resto da casa.
→ *Origem: site da Hórus, 04/08/2026. Mesma família dos quirks de
`cramped-padding` com `clamp()` registrados em `99-checklist.md` §4.*

**`repeat(auto-fit, minmax(...))` numa lista de tamanho conhecido.** Com seis
itens numa faixa larga ele resolve em cinco na primeira linha e **uma órfã** na
segunda. Grade tem exatamente o número de células que existe conteúdo: seis itens
pedem `repeat(3, 1fr)`, que fecha 3+3. `auto-fit` serve quando o número de itens
é variável de verdade.
→ *Origem: site da Hórus, 04/08/2026.*

**`scroll-behavior:smooth` quebra o print de seção no headless.** O Chrome não
completa a rolagem suave dentro do orçamento de tempo virtual, então o print sai
na posição errada, ou pior: sai **preto**, porque os elementos de revelação ainda
estão em `opacity:0`. Parece bug do site e não é. Para conferir uma seção, trocar
temporariamente para `auto`, tirar o print e restaurar.
→ *Origem: site da Hórus, 05/08/2026. Complementa a armadilha dos 390px em
`99-checklist.md` §4.*

**Marca-d'água invisível: o número ao lado do ponto no trilho.** Quando um item de
linha do tempo tem numeração E um marcador, os dois brigam por espaço em algum
breakpoint e se encavalam ("01" vira "0●"). Fundir os dois num elemento só resolve
em todos os breakpoints de uma vez.
→ *Origem: site da Hórus, 04/08/2026.*

---

## Técnico

**Imagem em PNG direto do gerador.** Sai em 2k ou 4k e pesa megabytes. A home da
Aion pesava 18,7 MB e virou 719 KB só convertendo para WebP no tamanho de
exibição. É a correção de maior retorno que existe, e é mecânica.
→ *Origem: auditoria da Aion, 26/07/2026.*

**Nome de arquivo de imagem que entrega o prompt.** Imagem gerada por IA subida com
o nome que o gerador deu, tipo
`Firefly_Gemini-Flash_Edite-a-imagem-para-que-fique-mais-explicito-que-e-uma-pousada.png`.
O prompt inteiro fica **público no HTML**, legível por qualquer visitante que abra
o inspetor. **Renomear antes de subir**, sempre, para algo descritivo e curto.
E o problema de fundo continua: em cliente que vende origem ou artesanal, foto
gerada contradiz o argumento da própria página.
→ *Origem: teardown da Fazenda São Gabriel, 30/07/2026
(`referencias/fazenda-sao-gabriel-atacado.md`). Site que vende "origem verdadeira"
com foto de pousada inventada, e o nome do arquivo denunciando.*

**Imagem gerada que contradiz o briefing do cliente.** O modelo preenche o contexto
óbvio do assunto, e o contexto óbvio costuma ser justamente o que aquele cliente
**não** é. Pedir foto de "mãos com grãos de café" devolve mãos colhendo num
cafezal, o que num cliente que compra o grão de terceiros e só beneficia é
afirmação falsa de origem. Vale igual para clínica sem sala própria, oficina sem
frota, loja sem vitrine.
Duas regras: **proibir explicitamente no prompt** o que o cliente não tem
(`no plantation, no field, no crops`), e **olhar cada imagem uma a uma** antes de
integrar. Numa leva de 7, uma reprovou e seis passaram.
→ *Origem: Grão da Serra, 30/07/2026. A foto de hero veio com lavoura ao fundo num
site cuja frase central é "a gente não planta".*

**O que reprova é a cena de produção, não o assunto.** Corolário da regra acima, e
ela evita virar superstição. Num cliente que não cultiva, o proibido é a imagem que
**afirma a etapa que ele não faz**: lavoura, colheita, terreiro, gente com balaio.
O assunto em si continua livre: cereja e folha como recorte solto são botânica, e
foto do que ele faz de verdade (a torra, o grão torrado, o pilão) é registro
honesto. Quando o cliente pedir "quero um fundo de planta de café", a pergunta que
resolve não é "café pode?", é **"essa foto diz que o campo é dele?"**.
→ *Origem: Grão da Serra, 03/08/2026. O Marcelo mandou dois prints de referência,
um com colheita em lavoura em tela cheia e outro com macro de cereja e folha. O
segundo passaria; o primeiro não. Ele acabou escolhendo grão torrado, que é a etapa
que a família de fato executa.*

**Cor primária igual ao default do framework.** Se o primário do site é `#337AB7`
(azul do Bootstrap) ou `#0d6efd`, ninguém tomou decisão de cor: veio no template e
ficou. Sintoma fácil de checar e que revela o resto.
→ *Origem: teardown do Grão da Serra Mantiqueira, 30/07/2026. Marca de café com
site azul de framework.*

**`og:site_name` esquecido no default do tema** ("My Blog", "Meu site"). Só aparece
quando alguém compartilha, e por isso sobrevive anos sem ninguém notar.

**Print de produto feito com `<div>`.** Falso painel, falso terminal, falsa lista
de tarefas montada com retângulo. Usa imagem de verdade ou não usa nada.

**Ícone desenhado à mão em SVG.** Usa biblioteca. Uma só por projeto. Vale
também pra ilustração: ou é ilustração de verdade, ou não tem. Cena em SVG estilo
rabisco, classe chamada `doodle` ou `loose-sketch`, e granulado feito com
`feTurbulence` são amadorismo com nome técnico.

**Fundo listrado ou quadriculado por cima de nada.** `repeating-linear-gradient` e
grade de duas direções só se existir uma superfície de verdade embaixo: mapa,
planta, papel milimetrado, tela. Solto, é textura pra disfarçar seção vazia.

**Animar propriedade que recalcula layout.** `width`, `height`, `padding` e
`margin` em transição travam a rolagem em celular. Usa `transform` e `opacity`, e
`grid-template-rows` quando a animação for de altura.
→ *Origem: 28 casos no material do Giovanni e 1 na Aion (`transition: padding-left`
em `assets/site.css`, ainda aberto). Regra `layout-transition`, 28/07/2026.*
Número de linha não se cita aqui: ele muda a cada edição e a citação vira mentira.

**Âncora sem `scroll-margin-top` embaixo de cabeçalho fixo ou sticky.** O navegador
rola até o topo exato do elemento, e a barra de 60 a 80px cobre justamente o título
que a pessoa clicou para ver. Ela chega na página achando que o link está errado, e o
link está certo. Não aparece em teste de link (o destino existe) nem em teste de
rolagem (a página rolou). Só aparece olhando. Uma linha resolve o site inteiro:
`main[id],section[id],article[id]{scroll-margin-top:<altura do header + 20px>}`.
→ *Origem: Aion, 30/07/2026. O Marcelo pediu para "corrigir os links de
direcionamento" da seção de situações. Os 6 destinos existiam todos; o defeito era o
offset. Todo menu de âncora do site tinha o mesmo problema, incluindo o próprio.*

**`display:none` na navegação do mobile sem nada no lugar.** É o jeito mais rápido
de fazer o cabeçalho "caber" no celular, e deixa a pessoa com uma barra fixa de
72px que não faz nada. Ou tem menu, ou tem pelo menos um CTA no lugar dos links.
Em cliente de saúde isso pesa mais: o público lê no celular.
→ *Origem: Aion, 28/07/2026. Era `@media(max-width:900px){.nav nav{display:none}}`
sem hambúrguer nenhum.*

**Remover uma seção e levar junto o CSS que era compartilhado.** O bloco de CSS de
uma seção quase sempre hospeda uma ou duas regras genéricas que nasceram ali e
passaram a ser usadas por outras (`.sec-head`, `.fig`, `.rotulo`, `.revela`). Apagar
o bloco inteiro derruba as outras seções em silêncio, e o sintoma não parece
relacionado: um título centralizado que amanhece alinhado à esquerda, três seções
adiante. Antes de cortar, procurar cada seletor do bloco no HTML restante.
→ *Origem: Grão da Serra, 05/08/2026. `.sec-head` morava no bloco do processo; o
formulário usava.*

**Seletor de descendente em `img` dentro de uma seção, e o ornamento que entra
depois.** `.secao-foto img{position:absolute;inset:0;width:100%;height:100%}` é
escrito pensando na foto grande e passa a valer para **toda** `img` que aparecer ali
dentro. Quando entra um selo, um badge ou um ícone com wrapper próprio, a img dele
vira absoluta, o wrapper fica sem nada para medir, a altura resolve em **zero** e o
elemento some sem erro nenhum no console. Usar `>` desde o começo: a regra é da foto
daquele container, não de qualquer imagem que venha a morar nele.
→ *Origem: selo "Produto da Bahia" da seção Origem do Grão da Serra, 05/08/2026.
Mesma família do caso do `margin:0 auto` logo abaixo, e igualmente invisível.*

**Emenda vertical dura entre o fundo da seção e a foto ajustada pela altura.** Quando
a arte do hero é ajustada pela ALTURA e ancorada num lado, o outro lado fica sendo o
fundo chapado da seção. Se o véu que escurece a foto tiver um marrom e o fundo da
seção tiver outro, aparece uma linha vertical no meio da composição, e ela parece
erro de imagem. Duas regras juntas resolvem: **o fundo da seção é a mesma cor do
véu**, e **o véu cobre a seção inteira**, não só a caixa da foto.
→ *Origem: hero escuro do Grão da Serra, 06/08/2026.*

**Botão com a cor de acento sobre um fundo da mesma família.** O par texto/botão pode
passar em contraste e o botão ainda assim sumir, porque quem faz um botão ser um
botão é o contraste dele **com o fundo em volta**, não com o próprio texto. Dourado
`#D6B35F` sobre creme tem 1,44:1 de fundo contra fundo: o texto lê e a forma não. A
saída não é trocar de acento no meio da página, é ter **um tratamento por tipo de
fundo** — acento sobre escuro, neutro escuro sobre claro — mantendo o acento único
no resto (eyebrow, ícone, detalhe).
→ *Origem: Grão da Serra, 06/08/2026, ao alinhar o site à paleta do cliente.*

**`object-fit:cover` numa arte composta amplia até cortar o assunto.** Numa foto de
produto já enquadrada (o pacote sobre a mesa, com a paisagem atrás), `cover` numa
faixa larga e baixa escala a imagem pela LARGURA e joga fora a diferença de altura:
num hero de 580px com arte de 1619x972 são 33% da altura, e o que sai é justamente a
base, onde estão a mesa e o peso do pacote. O resultado parece "zoom errado" e é.
Quando a arte já está composta, ela se ajusta pela **altura**, ancorada no lado que
importa, e a cor da seção preenche o que sobrar do outro lado, que é onde o texto
mora. `cover` continua certo para foto de fundo genérica, onde não há assunto para
perder.
→ *Origem: Marcelo no Grão da Serra, 05/08/2026, comparando o hero com o print de
referência: "a imagem da hero não está ajustada de acordo com a referência".*

**Ornamento gravado dentro de um `background` com `cover` não é elemento
posicionável.** Colar uma casinha, um selo ou qualquer desenho pequeno dentro de
uma imagem de fundo usada com `background-size:cover` parece simples, e quebra
assim que a seção muda de altura: `cover` recalcula recorte e posição a cada
proporção diferente de container, então o ornamento pousa num lugar diferente em
cada largura de tela — às vezes em cima de um texto de verdade. Ajustar
`background-position` não resolve, só desloca o problema para outro breakpoint. A
saída é extrair o ornamento como imagem própria (com alfa real) e posicioná-lo
como qualquer outro elemento do layout, herdando alinhamento do texto ao redor em
vez de flutuar sozinho.
→ *Origem: rodapé do Grão da Serra, 10/08/2026. A casinha estava gravada em
`rodape-fundo.webp`; em desktop largo ela caía em cima da linha do CNPJ. Virou
`<img>` própria, dentro da coluna de texto que ela ilustra.*

**PNG com o xadrez de transparência DESENHADO dentro.** Imagem baixada de banco ou
exportada errado vem com o quadriculado cinza claro pintado no lugar do alfa. No
site ele aparece como um retângulo quadriculado em cima do fundo da seção, e o
reflexo é achar que "a transparência não funcionou". A chave por cor sozinha não
resolve: a louça branca do assunto cai no mesmo tom do quadrado claro e some junto,
deixando mordida serrilhada na borda. O que identifica o xadrez é o **padrão** (os
dois tons convivem dentro de uma janela pequena); na superfície chapada do assunto o
tom parceiro não existe.
→ *Origem: xícara e selo do Grão da Serra, 05/08/2026. Os dois tons mudam de arquivo
para arquivo (254/241 num, 254/235 no outro): medir antes, não chutar.*

**`margin:0 auto` num item de grid ou flex, junto com filhos absolutos.** A margem
automática tira o `stretch` do item: a largura deixa de vir do track e vira `auto`.
Se os filhos são todos `position:absolute`, não sobra nada para medir, a largura
resolve em zero, e um `aspect-ratio` no mesmo elemento devolve **altura zero**. O
sintoma é cruel: o conteúdo some e sobram só os elementos que têm texto próprio,
boiando no vazio, e **em um breakpoint só**, porque a regra costuma morar dentro de
um media query. Correto: `width:min(100%,<max>);margin:0 auto`.
→ *Origem: seção 1 do Grão da Serra, 03/08/2026. As duas fotos encavaladas sumiam a
900px e apareciam a 560 e 1440, deixando só os rótulos "Imagem provisória" no ar.*

**`min-height` fixo para segurar sobreposição de imagens.** Filho `position:absolute`
não empurra o pai, então quem sustenta a altura é um número escrito à mão — e o
número que fecha num breakpoint vaza por cima da seção seguinte em todos os outros.
A altura tem que sair da largura: calcular a geometria uma vez (quanto ocupa a foto
grande, quanto a pequena, quanto se sobrepõem) e escrever isso como `aspect-ratio`.
→ *Origem: Grão da Serra, 03/08/2026. `min-height:436px` cabia no desktop e cortava
a foto grande a 560px.*

**`flex:1 1 300px` que vira altura quando empilha.** `flex-basis` segue a direção
do container. A mesma regra que dá uma coluna de 300px no desktop abre um vão
vazio de 300px de ALTURA quando o media query troca para `flex-direction:column`.
Ao empilhar, zerar: `flex:0 0 auto`.
→ *Origem: rodapé da Aion, 28/07/2026. Vão de 230px entre a linha legal e a
assinatura, no celular. O rodapé caiu de 498px para 266px com uma linha.*

**Texto obrigatório em opacidade decorativa.** Registro profissional, responsável
técnico, aviso legal: é o texto que a norma exige, e é sempre o que recebe
`opacity:.48` e `font-size:.79rem` porque "é rodapé". Na Aion isso dava 4,30:1,
abaixo do mínimo do WCAG AA, na linha que carrega o CRP da pessoa jurídica.
**Se a lei obriga a estar visível, tem que estar legível.**
→ *Origem: auditoria da Aion, 28/07/2026.*

**`object-fit:cover` em foto paisagem dentro de coluna alta.** O `cover` corta
pelas laterais e mostra o miolo geométrico da imagem, que numa foto de ambiente
costuma ser parede vazia. O assunto (a poltrona, a mesa, a pessoa) fica fora. Ver
o corte antes de aprovar, e ajustar com `object-position` ou gerar a imagem já no
formato do espaço.
→ *Origem: hero da Aion, 28/07/2026. Corrigido com `object-position:32% center`.*

**Animar a imagem no hover.** Imagem não é alvo de clique. Quem reage ao mouse é o
container, nunca a foto por dentro dele, direta ou por herança do pai.

**Especificidade de CSS que se anula.** Classe de seção (`.section`) e classe de
elemento (`.cta`) brigando pela mesma propriedade, e uma zerando a outra. Aparece
quase sempre em `padding` e `margin` entre seções, e o sintoma é uma seção colada
na outra sem motivo visível. Ao escrever o CSS, decidir de antemão quem manda no
espaçamento externo: o container ou o filho, não os dois.
→ *Incorporado da `frontend-design` da Anthropic, 28/07/2026.*

**Adotar a stack do componente em vez de portar o efeito.** Componente de galeria
chega quase sempre em React com Tailwind, TypeScript e uma dependência de shader, e
o pedido implícito é instalar tudo isso. Antes de aceitar, perguntar **o que é o
efeito de fato**: o botão de metal líquido é um shader de vinte linhas dentro de
três `div` empilhadas. Trazer React, Tailwind, um passo de build e uma dependência
externa para uma página de HTML e CSS nativos custa o site inteiro e entrega o
mesmo pixel. Porta o efeito, mantém a stack.
E o caminho contrário vale igual: se o projeto **já é** React, escrever WebGL na
mão para não instalar a lib é a mesma teimosia ao contrário.
→ *Origem: Marcelo no site da Hórus, 05/08/2026, mandando o `liquid-metal-button`
do shadcn. Virou WebGL nativo em 80 linhas, sem dependência, com aro parado em
`conic-gradient` para quem não tem WebGL.*

**Pausa do marquee no hover.** Parece cortesia ("deixa a pessoa ler") e o efeito
real é o texto parar sozinho quando o mouse encosta, o que lê como travamento, não
como recurso. Quem passa o mouse por cima de uma faixa que corre quase nunca está
tentando ler: está indo para outro lugar da página. Faixa que corre, corre sempre.
→ *Origem: Marcelo no site da Hórus, 05/08/2026: "elas se movem e depois param,
quero que corrija isso". O `animation-play-state: paused` era a causa.*

**Marquee, mais de um por página.** Texto rolando de lado é recurso de uma vez só.
Dois já é enchimento.
→ *Aplicado na prática no site da Hórus em 05/08/2026: o Marcelo pediu uma faixa
de palavras correndo, e o hero já tinha uma esteira de capacidades. A esteira saiu
em vez de virar a segunda. Quando entra um marquee novo, o antigo sai; se o antigo
carregava informação, ela vira seção, e nesse caso virou a de serviços.*

**Texto pixelado feito com filtro.** `filter: blur` ou fonte gigante com efeito não
pixeliza, borra. Pixel se faz em **resolução baixa**: desenhar num canvas de umas
dezenas de pixels e ampliar com `image-rendering: pixelated`. É o único jeito de o
degrau ficar quadrado e igual.
E `textBaseline:'middle'` corta o acento: a caixa de "HÓRUS" mede da base à altura
de maiúscula, e o acento fica por fora. Desenhar pela linha de base, com folga em
cima.
→ *Origem: assinatura no pé do site da Hórus, 05/08/2026. Canvas de 96 por 24
ampliado para a largura da página.*

**`overflow:hidden` num pai mata `animation-timeline: view()`.** A pegadinha mais
cara desta família. `hidden` **cria um contêiner de rolagem**, e a linha do tempo
de vista se amarra ao contêiner de rolagem mais próximo: a tira passa a medir a
própria posição dentro de uma caixa em que ela nunca se move, e congela num
deslocamento fixo. Não dá erro, não aparece no console, e o sintoma é uma galeria
parada num lugar esquisito. **`overflow: clip` recorta igual e não vira rolável**,
então a linha do tempo volta a ser a da página.
Segunda pegadinha do mesmo bloco: o atalho `animation: nome linear both` zera a
duração em `0s`, e com linha do tempo de rolagem a duração precisa ser `auto` para
valer a faixa inteira. Escrever em longhand resolve as duas de uma vez.
→ *Origem: portfólio da Hórus, 05/08/2026. A tira ficou travada em -575px, e o
CSS estava "certo".*

**Rolagem horizontal amarrada ao scroll com listener.** Galeria que anda de lado
conforme a pessoa rola é pedido comum e a implementação óbvia (`addEventListener
('scroll')` mais cálculo de posição) trava a rolagem no celular. Desde 2023 isso é
CSS: `animation-timeline: view()` com `animation-range`, sem uma linha de
JavaScript. Onde não existe (hoje Safari e Firefox), um `@supports not` transforma
a mesma tira num carrossel que se arrasta com o dedo, e ninguém fica sem nada.
→ *Origem: portfólio do site da Hórus, 05/08/2026.*

**`padding:0` do reset de lista apagando a calha do container.** Quando o próprio
`<ul>` é o elemento que carrega a largura da página (`class="wrap pilares-grid"`),
o reset reflexo `list-style:none;margin:0;padding:0` **sobrescreve o recuo lateral**
e o texto encosta na borda da tela no celular. O reset de lista existe pra tirar o
marcador e a indentação de marcador, que é **margem**. Zerar o padding só quando o
`<ul>` for filho de outra coisa que já dá a calha.
→ *Origem: faixa de pilares do Grão da Serra, 05/08/2026. O detector achou como
`cramped-padding` e estava certo: o valor era zero de verdade, e só no celular.*

**Título pulando nível** (`h2` direto pra `h4`). Quebra leitor de tela e SEO.
O caso que mais aparece é a **faixa de 3 ou 4 atributos com ícone**: os nomes viram
`<h3>` por reflexo, a faixa não tem `<h2>`, e o sumário salta do `h1` do hero pro
`h3`. A saída não é inventar um título pra faixa nem esconder um `h2`: são
**rótulos de atributo, não seções do documento**. Vira lista com `<p>`, e o sumário
volta a descrever a página.
→ *Origem: Grão da Serra, 05/08/2026. Regra `skipped-heading`.*

**Seção com foto sangrando acusada de `cramped-padding`.** Quando a arte vai até as
bordas da seção, o reflexo é deixar a seção com recuo zero e pôr o recuo só na
coluna de texto — e aí o detector acusa, corretamente, que a seção tem conteúdo
colado no fundo colorido. Dispensar a regra é o caminho errado e é o mais tentador,
porque "é de propósito". O certo inverte: **o recuo vai para a seção, e a foto sai
dele com uma margem negativa do mesmo tamanho**. A foto continua sangrando exatamente
igual, e o recuo passa a existir de verdade para todo o resto.
→ *Origem: seção "Nossa origem" do Grão da Serra, 05/08/2026.*

**Ornamento chapado escondido com `mask-image` em vez de ganhar alfa.** Ilustração
que chega com fundo chapado e é encaixada na página com uma máscara radial some
sozinha assim que alguém mexe na posição: a máscara é definida em % da CAIXA, e
basta o desenho não estar no centro da arte para o buraco cair na parte vazia.
Sem erro no console, sem aviso. **O fundo chapado vira alfa de verdade** (tinta
sobre fundo liso: `alfa = 1 - min(pixel/fundo)`, cor por desmultiplicação), e o
ornamento passa a poder ir a qualquer lugar.
→ *Origem: Grão da Serra, 06/08/2026. A planta 3 sumiu do formulário por isso, e a
queixa chegou como "não sei o que você fez com ela".*

**Processar um PNG que já veio com alfa de verdade.** Antes de recortar, mascarar ou
aplicar high-pass/tint numa imagem que o cliente mandou, **conferir o canal alfa**
(`Image.open(x).mode == "RGBA"` e os cantos com alfa 0). Se ela já é transparente, é
**converter e colar** — nada de recorte por luminância nem cor chapada, que só embaçam
ou deixam halo. O erro simétrico é o de cima: um PNG do mesmo desenho vinha com fundo
PRETO opaco (glow) e exigia recorte; a versão seguinte já veio transparente e era só
colar. **Descobrir qual é ANTES de escolher o caminho** poupa rodadas.
→ *Origem: Grão da Serra, 11/08/2026. Duas rodadas gastas "consertando" a planta 4
com fundo preto (halo, depois embaçado); o PNG transparente resolvia com uma conversão.
A queixa foi "é só você colar, não tem muito trabalho não".*

**Tarja de destaque como marcação de pendência em parágrafo inteiro.** Fundo
amarelo atrás de uma palavra funciona; atrás de quatro linhas vira um bloco que o
cliente lê como **defeito de renderização**, não como aviso — e ele pergunta por
que o texto está com fundo amarelo. Marcação de pendência longa é **fio tracejado
por baixo** mais, se for um bloco inteiro (lista, tira de atributos), uma nota
curta ao pé dizendo o que falta confirmar. Some igual no modo limpo, e o mecanismo
do `integridade.md` continua de pé.
→ *Origem: Grão da Serra, 06/08/2026.*

**Site sem favicon e sem imagem de compartilhamento.** O link no WhatsApp abre
como retângulo cinza. É o primeiro contato de metade das pessoas.

---

## O que o detector pega sozinho

Desde 28/07/2026 boa parte deste arquivo é conferida por programa, não por
lembrança. Antes de entregar:

```
npx --yes impeccable@3.5.0 detect "clientes/<nome>/site"
```

Mapa entre a regra dele e a seção daqui:

| Regra do detector | Seção |
|---|---|
| `low-contrast` | Cor (e a tabela medida em `99-checklist.md` §2.5) |
| `undersized-ui-text`, `tiny-text` | Tipografia |
| `flat-type-hierarchy`, `all-caps-body`, `tight-leading` | Tipografia |
| `overused-font` | Tipografia |
| `cream-palette`, `dark-glow`, `radial-spotlight-glow` | Cor |
| `nested-cards`, `gpt-thin-border-wide-shadow`, `cramped-padding` | Layout |
| `icon-tile-stack`, `hero-eyebrow-chip` | Layout |
| `layout-transition`, `clipped-overflow-container`, `skipped-heading` | Técnico |
| `repeating-stripes-gradient`, `marquee` | Técnico |

**O que ele não pega, e continua sendo trabalho de olho:** peso de imagem e WebP,
favicon e `og:image`, dado inventado, compliance de CFO e CFP, estrutura de seções,
copy de folheto e a pergunta do passe duplo. O detector confere mecânica. Ele não
sabe se o texto é mentira nem se a página está na ordem em que a pessoa decide.

## Como usar este arquivo

Antes de entregar, ler de cima a baixo e procurar cada item na página. Leva
dois minutos e pega a maior parte do que o cliente ia apontar. Depois rodar o
detector, que pega o resto e não depende de ninguém lembrar.

**Correção que o detector aponta e a gente decide não seguir vira exceção
registrada com motivo** (`ignores add-value ... --reason`), nunca regra ignorada
em silêncio. Exceção com motivo é decisão; exceção sem motivo é o começo da volta
do erro.
