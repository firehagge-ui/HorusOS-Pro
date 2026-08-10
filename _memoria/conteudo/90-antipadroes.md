# Antipadrões: o que denuncia carrossel feito por IA

> Catálogo vivo. **Toda correção do Marcelo em peça social entra aqui, com o
> porquê.** Sem o porquê a regra vira superstição e é aplicada onde não devia.
>
> Irmão de `_memoria/design/90-antipadroes.md`, que cuida de site. Base inicial
> adaptada do `opensquad`, 03/08/2026.

---

## Copy

**Capa que anuncia em vez de parar.** "Hoje vamos falar sobre café", "5 dicas de
implante", "Aion apresenta". A pessoa está em scroll rápido e a primeira fração
de segundo decide tudo. Anúncio de intenção não para ninguém — o que para é fato
concreto, pergunta incômoda ou tensão.
→ *"O grão que você toma de manhã foi torrado há quanto tempo?" para. "Conheça
nosso café" não.*

**Afirmação factual sem dado nem fonte.** "Todo mundo está usando", "a maioria
das pessoas sofre com isso", "é sabido que". Vago não convence, e em cliente de
saúde vira risco: número inventado é informação falsa publicada sob o CRO ou o
CRP de alguém. Vale a regra do `_memoria/integridade.md` — dado que falta vira
`[FALTA: ...]` marcado, não texto plausível.

**Copy que serve pra qualquer marca.** "A tecnologia está transformando a forma
como nos relacionamos com o cuidado, criando novas possibilidades." Se a frase
pode ser colada no carrossel de qualquer concorrente sem trocar uma palavra, ela
não diz nada. Teste: trocar o nome do cliente pelo do concorrente. Se continua
fazendo sentido, reescrever.

**Carrossel só de informação, sem reflexão.** Dado, dado, dado, CTA. Memória é
emocional: dado sem impacto é esquecido antes do próximo post. O penúltimo slide
de conteúdo precisa ser o que incomoda, não o que informa.

**CTA genérico.** "Nos siga", "link na bio", "salve este post" solto. Revela que
ninguém pensou no próximo passo de quem leu. CTA bom cita o conteúdo:
*"Salva. Da próxima vez que te oferecerem café mais barato, você vai saber a
pergunta certa pra fazer."*

**Jargão de marketing na boca do público.** "Ticket médio", "performance",
"solução", "jornada", "experiência". Nenhum paciente, nenhuma aluna de
hidroginástica e nenhum dono de padaria fala assim. Segue `_memoria/preferencias.md`.

**Tracinho como separador.** Nunca `—`, `–` ou ` - ` em copy de peça. Vírgula,
ponto ou quebra de linha. Vale pra legenda também.
→ *Origem: preferência antiga do Marcelo, registrada na memória.*

**Superlativo.** "O melhor", "nº 1", "referência absoluta", "o mais completo".
Além de gasto, é vedado no CFO e no CFP. Vale como hábito geral, não só nos
clientes regulados: superlativo sem prova é ruído.

**Legenda que passa de 2.000 caracteres.** O limite do Instagram é 2.200, mas as
hashtags entram nele. Mirar 1.500 a 1.800 deixa a legenda respirar.

**Link na legenda.** Legenda do Instagram não tem link clicável. URL ali queima
caractere e denuncia amadorismo. Link vai na bio ou no sticker do story.

---

## Design

**Contador de slide "1/8".** O Instagram já mostra os pontinhos de navegação
nativos. Um contador desenhado dentro da arte é ruído redundante e um dos tells
mais visíveis de template automático.
⚠️ *Colide com a instrução antiga da `/carrossel`, que mandava pôr contador no
canto superior direito de todos os slides. **Decisão pendente do Marcelo** —
enquanto não decidir, a skill mantém o contador como opcional e desligado por
padrão no Instagram.*

**Texto sem proteção sobre foto.** Ver `10-legibilidade.md`. Sombra de texto não
é proteção.

**Sistema de design que muda no meio.** Fonte diferente no slide 3, cor nova no 5
sem motivo narrativo, espaçamento que parece erro. Qualquer slide, solto, tem que
ser reconhecível como parte daquele carrossel. Por isso o sistema de design se
escreve **antes** do primeiro HTML, não durante.

**Slide 1 igual aos outros.** A capa precisa de tratamento tipográfico maior e
layout distinto. É o único slide que compete contra o feed inteiro; os outros
competem só contra o dedo da pessoa.

**Todos os slides com o mesmo layout.** Carrossel monótono é abandonado no meio.
Alternar fundo (escuro, claro, destaque) e alternar layout. Nunca dois slides
seguidos iguais.

**Mais de cinco cores no sistema.** Primária, secundária, destaque, fundo, texto.
Acabou. Variação sai dessas cinco, não de cor nova.

**Foto de banco genérica.** Foto muito polida lê como anúncio e derruba alcance
orgânico. No Grão da Serra tem um agravante: cafezal de banco de imagem **falseia
a origem**, porque a família não tem lavoura. Foto ali é de beneficiamento,
torra, embalagem e do Nelson.

**Paleta corporate por reflexo.** Azul claro + branco + cinza é o default do
modelo quando ninguém definiu nada. Se a marca do cliente não define, o caminho é
o `identidade/catalogo-estilos.md`, não o reflexo.

---

## Compliance (trava, não é gosto)

**Depoimento de paciente.** Vedado na Aion em qualquer formato (CFP 011/2018).
No Giovanni, só com autorização e nunca como promessa.

**Antes e depois.** Vedado no site e nas peças de pessoa jurídica do Giovanni
(CFO-196/2019), inclusive simulado por IA. Vedado na Aion em qualquer formato.

**Promessa de resultado, cura ou prazo.** Vedado nos dois. Na Permita-se não é
conselho que proíbe, mas resultado físico garantido não se promete.

**Preço ou promoção como chamariz.** Vedado nos dois clientes regulados.

**Conteúdo clínico não publica sem revisão do profissional responsável.** Vale
pra carrossel e pra bot. Nenhuma exceção por urgência de calendário.

**Alegação de saúde em alimento.** No Grão da Serra, sem "melhora o foco",
"antioxidante", "faz bem pro coração". E sem jargão de café especial (nota de
degustação, pontuação SCA, altitude, variedade) que o Nelson não tenha dito.
