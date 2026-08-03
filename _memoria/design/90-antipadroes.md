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

**Texto com gradiente.** Ênfase se faz com peso ou tamanho. Gradiente em letra
some no celular, quebra no modo escuro e não copia direito.

**Vidro e desfoque como decoração.** `backdrop-filter` serve pra sobreposição em
cima de imagem ou vídeo, onde há o que desfocar. Painel de vidro no meio de um
fundo chapado é efeito sem função.

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

**Travessão como recurso de estilo.** No caso da Horus é regra dupla: a
taste-skill proíbe, e o Marcelo já tinha pedido a mesma coisa antes.

**Faixa de clima, cidade e hora** no cabeçalho. **"Role para explorar"** no fim do
hero. **Rótulo de versão** (`v0.6`, `BETA`) sem lançamento nenhum. **Numeração de
seção** (`01 / ÍNDICE`) quando o conteúdo não é uma sequência de verdade, com ordem
que o leitor precisa seguir. Tudo decoração que finge intenção.

> Esta seção é sobre copy de venda. O texto pequeno que faz a interface funcionar
> (botão, rótulo, erro, tela vazia, confirmação) tem arquivo próprio:
> `50-copy-de-interface.md`.

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

**Marquee, mais de um por página.** Texto rolando de lado é recurso de uma vez só.
Dois já é enchimento.

**Título pulando nível** (`h2` direto pra `h4`). Quebra leitor de tela e SEO.

**Site sem favicon e sem imagem de compartilhamento.** O link no WhatsApp abre
como retângulo cinza. É o primeiro contato de metade das pessoas.

---

## O que o detector pega sozinho

Desde 28/07/2026 boa parte deste arquivo é conferida por programa, não por
lembrança. Antes de entregar:

```
npx --yes impeccable@3.4.0 detect "clientes/<nome>/site"
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
