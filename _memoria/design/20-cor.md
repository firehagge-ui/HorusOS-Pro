# Cor: por que a paleta funciona

> A camada de baixo do `90-antipadroes.md`. Lá está o *tell* ("cinco cores
> brigando", "azul de framework", "acento que muda no meio da página"); aqui está o
> *porquê*, pra o Claude derivar a paleta certa num caso novo em vez de só
> reconhecer o erro depois de cometê-lo.
>
> **Isto é leitura de consulta, não de gatilho.** Não precisa ler antes de todo
> site. Abrir quando a decisão for de cor: montar a paleta, decidir o acento,
> resolver um bloco que "tem cor demais" ou um botão que some. Cada seção segue o
> formato **princípio → por que funciona → como se aplica aqui → o antipadrão que
> previne.**

---

## 1. 60/30/10: proporção é sistema, não decoração

**Princípio.** Uma página bem colorida distribui a cor em **três papéis de
proporção fixa**: ~60% de uma cor dominante (quase sempre o fundo/neutro), ~30% de
uma secundária que estrutura, ~10% de um acento que aponta. Não é lei de régua, é
razão de área.

**Por que funciona.** A proporção é o que diz ao olho **onde é o pouco que
importa**. Quando o acento ocupa 10% da tela, os 10% saltam; quando ele ocupa 40%,
não sobra fundo pra ele saltar de — vira mais uma cor num campo de cores, e o olho
perde a âncora. Fixar a proporção também **trava o "cor demais" na origem**: com
uma cota de 10% pro acento, não cabe um segundo acento sem roubar do primeiro, e a
disciplina se resolve sozinha na conta de área, antes de virar decisão de gosto.

**Como se aplica aqui.** É a regra dos **cinco tokens** que a `/carrossel` escreve
antes de abrir o editor (SKILL.md: "cores, máximo 5: primária, secundária,
destaque, fundo, texto") — cinco papéis nomeados, um destaque só, "nunca quatro
cores brigando". No site vale idêntico: o passe 1 do `00-anatomia.md` pede "4 a 6
hex, cada um com nome e função", que é 60/30/10 escrito como tokens. Cor sem função
declarada não entra na paleta; se você não sabe se ela é dominante, estrutura ou
acento, ela é enfeite.

**O antipadrão que previne.** O default do modelo quando ninguém definiu: **mais de
cinco cores brigando**, cada seção com um tom novo, nenhuma com hierarquia. Sem os
três papéis a página fica com muita cor e nenhuma direção — o mesmo erro que fonte
demais é em tipografia (§3 do `10-tipografia.md`).

---

## 2. Contraste é hierarquia, não só acessibilidade

**Princípio.** Contraste tem duas camadas. A de baixo é o **piso legal** (WCAG:
4,5:1 pra corpo e placeholder, 3:1 pra título grande acima de 24px). A de cima é
usar diferença de contraste pra **dirigir o olho**: o que tem mais contraste com o
fundo é lido primeiro.

**Por que funciona.** O olho vai pro maior contraste antes de decidir ler qualquer
coisa — é reflexo, não escolha. Então contraste não é só a conta que aprova o texto,
é a alavanca que decide a ordem de leitura: título em contraste cheio, corpo em
contraste médio, rótulo dessaturado que recua. E o piso legal existe porque abaixo
dele o texto **deixa de ser lido**, não fica só feio: público de saúde tem leitor
acima de 50 anos lendo no celular na rua, onde 4,5:1 não é burocracia.

**Como se aplica aqui.** A camada de cima hierarquiza sem mexer no tamanho da fonte
(par com o §5 do `10-tipografia.md`: cor dessaturada recua um rótulo sem encolher).
A de baixo é **medida, nunca estimada**: a tabela de `99-checklist.md` §2.5 mostra a
terracota `#D65F45` dando 3,4:1 sobre creme — reprova em corpo, e a correção foi um
degrau escuro (`--terracota-hov #9E3F2B`, 5,9:1) só pra texto pequeno e link, sem a
paleta perder o rosto. Fundo importa: a mesma cor mede diferente sobre `#FAF2EA` e
`#F2E3D5`, então se mede contra o fundo **real da seção**.

**O antipadrão que previne.** A regra `low-contrast` do detector — a única família
que **se corrige, não se dispensa**. Foi ela que pegou o `#666666` do botão de metal
sobre preto (2,9:1, num CTA) no site da Hórus, e o eyebrow dourado a 1,44:1 tirado a
conta-gotas de um mockup no Grão da Serra. Print de referência foi aprovado no olho,
num tamanho em que o texto pequeno nem aparecia; a régua não perdoa.

---

## 3. Temperatura e saturação carregam sentido

**Princípio.** Cor não é só matiz, é **percepção com carga**. Temperatura (quente/
frio) e saturação (viva/apagada) já dizem algo antes de qualquer palavra: frio e
dessaturado lê como técnico e distante; quente e terroso lê como humano e presente.

**Por que funciona.** O cérebro associa cor a experiência física antes de associar a
marca. Por isso "azul claro + branco + cinza" lê como **corporate por reflexo** — é
o que o modelo alcança sozinho quando ninguém definiu, e é frio e neutro porque
frio e neutro é o default seguro que não ofende ninguém e não diz nada. E por isso a
paleta terrosa fecha com saúde e psicologia: quente, dessaturada, ela lê como
acolhimento sem precisar escrever "acolhedor". A escolha de temperatura sai da
**cena de uso** — quem lê, onde, com que luz —, não da categoria do negócio.

**Como se aplica aqui.** É a paleta terrosa da **Valéria Movio** (`referencias/`),
que fecha com Marcellus + Poppins e leva **score 7** — confirma o caminho cromático
do segmento saúde, tirado de concorrente real, não de manual. O contraexemplo é o
**Grão da Serra Mantiqueira** (`referencias/grao-da-serra-mantiqueira.md`, score 3):
um site de café com o azul `#337AB7`, o default do Bootstrap. Café é quente e
terroso no mundo real; azul de framework é a cor errada pro segmento, e é sintoma de
que **ninguém tomou decisão de cor** — veio no template e ficou.

**O antipadrão que previne.** "Claro ou escuro escolhido por categoria" e "cor
primária igual ao default do framework" (`#337AB7`, `#0d6efd`) do `90-antipadroes.md`.
Os dois são a mesma preguiça: deixar a cor ser reflexo em vez de decisão.

---

## 4. Um acento saturado só

**Princípio.** A paleta tem **um** acento saturado, e ele é usado com força. Todo o
resto é neutro — quase-preto, creme, cinza de estrutura. A cor forte é escassa de
propósito.

**Por que funciona.** Saturação é o recurso mais barato de chamar atenção e o mais
fácil de gastar: dois acentos saturados brigam, e quando tudo grita, nada grita.
Concentrar num acento só faz cada aparição dele **significar** — o olho aprende que
aquela cor é a coisa a notar. É a mesma economia do elemento-assinatura do
`00-anatomia.md`: uma ousadia, e todo o resto quieto em volta dela.

**Como se aplica aqui.** É o denominador comum das **dez agências de IA**
(`referencias/agencias-ia-dez-sites.md`), que o Marcelo escolheu pro site da própria
Hórus: fundo quase-preto (entre `#000000` e `#0B0D12`), **um acento saturado só**
usado com força (rosa na Vexuno, verde-limão na HelloUp), e o título gigante com **um
pedaço no acento** — quase sempre a segunda linha inteira. O acento não se espalha
pela página; ele mora no título, no botão primário e no rótulo, e o resto é metal
cinza e neutro. Metal, aliás, é cinza: quem carrega a cor da marca é o que está em
volta, não o efeito (a lição do botão de metal líquido, `90-antipadroes.md`).

**O antipadrão que previne.** A "nuvem de pílulas com os diferenciais" e o hero de
número grande com acento colorido de apoio — cor forte diluída em oito lugares, que é
o oposto de um acento com força. E o "roxo com brilho": acento saturado sem motivo
físico, a assinatura visual de IA.

---

## 5. Mesma cor, mesmo sentido

**Princípio.** Uma cor só pode significar **uma coisa** na página inteira. Se o
acento é ação (link, botão, o que se clica), ele não aparece em decoração; se
aparece em decoração, deixa de marcar ação.

**Por que funciona.** O olho aprende semântica de cor rápido e por conta própria:
depois de duas telas ele já sabe "o terracota é onde eu clico". No momento em que o
mesmo terracota aparece num fio ornamental ou num título que não é link, essa
aprendizagem quebra — a pessoa passa o mouse em texto decorativo esperando clique, e
hesita no botão de verdade. Consistência semântica é o que transforma cor em
**sinal confiável** em vez de ruído bonito. É o par cromático da regra do
`10-tipografia.md` de uma alavanca por degrau: aqui, um sentido por cor.

**Como se aplica aqui.** Decidir cedo qual token é ação e blindar ele: o acento de
clique não decora, e a decoração sai de um neutro ou de um degrau dessaturado da
mesma família. Quando a página alterna fundo (claro, médio, claro, médio), esse
acento vive em **dois ou três tons da mesma matiz** — não é variedade, é o mesmo
sinal medido contra cada fundo (a lição da Aion, `90-antipadroes.md`: o
`--terracota-esc` passava sobre creme e reprovava sobre areia). E o botão que some
sobre fundo da mesma família (dourado `#D6B35F` sobre creme, 1,44:1 de fundo contra
fundo) se resolve com **um tratamento por tipo de fundo**, não trocando o acento.

**O antipadrão que previne.** "Acento que muda no meio da página" (botão azul na
seção 7 de um site quente é erro, não variedade) e o botão que passa em contraste de
texto mas some porque não contrasta com o fundo em volta. Os dois nascem de tratar
cor como enfeite trocável em vez de sinal fixo.

---

## Os antipadrões que este princípio explica

| Antipadrão / regra do detector | A raiz teórica aqui |
|---|---|
| "Cinco cores brigando", cor sem função | §1 60/30/10 como sistema |
| `low-contrast` (não se dispensa) + tabela `99-checklist.md` §2.5 | §2 contraste é hierarquia |
| Cor primária = default do framework (`#337AB7`), claro/escuro por categoria | §3 temperatura e saturação |
| Nuvem de pílulas, roxo com brilho, número grande com acento de apoio | §4 um acento só |
| "Acento que muda no meio da página", botão que some sobre fundo da família | §5 mesma cor, mesmo sentido |
