# Soleira, arquitetura de interiores (Salvador/BA)

> Projeto conceitual de portfólio. Ver a regra de honestidade em `../README.md`.
> Estudo que sustenta: `referencias/interiores-tres-sites.md` e `referencias/for-living.md`.

## O negócio (ficção coerente)

Estúdio pequeno de arquitetura de interiores em Salvador, projeto residencial de alto
padrão e um ou outro comercial. Nome: **Soleira**, a pedra do limiar, o lugar onde uma
sala vira outra. Assinado por Bruno Sampaio e Lívia Andrade.

---

## O passe duplo

### Passe 1: o plano que saiu de reflexo

```
COR      branco, cinza, preto, um dourado
TIPO     serifa fina de display + sans neutra
LAYOUT   hero de foto cheia, grade 2x3 de projetos, sobre, contato
ASSINATURA  cursor personalizado e transição suave entre páginas
```

### A pergunta: eu chegaria nesse plano em qualquer estúdio de interiores?

**Sim.** Branco com dourado e serifa fina é o uniforme do segmento inteiro, e o cursor
personalizado é firula que se paga em nada: pela régua do `60-motion.md`, ele não guia
o olho, não dá resposta e não constrói marca. Pior, no segmento ele atrasa a única
coisa que o visitante veio fazer, que é ver foto.

E o plano repetia a falha que o estudo achou nos três escritórios reais: **nenhum diz
como começa, quanto tempo leva, nem o que o cliente recebe.** Uma galeria bonita que
não converte quem chegou decidido.

### Passe 2: o plano revisado

**A tese:** projeto de interiores é um contrato de meses de convívio, e o que trava a
contratação não é gosto, é medo do desconhecido: quanto tempo, quanto custa, o que eu
recebo, quem manda na obra. O estúdio que responde isso na página ganha do que só
mostra foto.

**A ancoragem local, que nenhum estúdio genérico tem:** em Salvador o luxo de verdade é
**sombra e brisa**. Projetar para 30 graus e maresia é assunto técnico real: cobogó,
veneziana, pé-direito, madeira que aguenta sal. A estética do estúdio é batizada de
**"casa de brisa"**, o que dá ao cliente uma palavra para repetir (a lição do Studio
McGee com "New Heritage") e ao mesmo tempo é verificável no projeto.

```
COR (escura e monocromática, ao contrário da Amêndoa Preta)
  --noite     #171614   fundo, grafite quente
  --pedra     #1F1E1B   superfície elevada
  --cal       #EDE9E1   texto principal, cor de reboco de cal
  --cal-2     #A8A296   texto secundário
  --anil      #4A6FA5   acento: o azul do azulejo português de Salvador
  --anil-cl   #9BB6DC   degrau claro do acento, para texto pequeno sobre escuro
  --linha     #302D28   fio de estrutura tabular (nunca entre seções)

TIPO
  display   Syne              grotesca de display com desenho de galeria, pesos 600/800
  corpo     Public Sans       17,5px, alta legibilidade sobre fundo escuro
  dado      IBM Plex Mono     metadados de projeto (local, tipo, área, ano) e numeração
                              de etapa. Uso legítimo: é ficha técnica

LAYOUT (8 seções, 5 famílias, sem um único fio entre seções)
  1 HERO         foto de sala em largura cheia com véu, título curto, sem eyebrow
  2 CASA DE BRISA  manifesto em 3 frases + as 4 decisões que a definem
  3 PROJETOS     6 casos, nome por sigla + tríade LOCAL / TIPO / ÁREA / ANO
  4 A RÉGUA      as 5 etapas com prazo em semanas e o entregável de cada uma
  5 ESCOPO       duas colunas: o que está dentro / o que não está (vender o freio)
  6 MATERIAIS    5 materiais nomeados com o porquê de cada um no clima daqui
  7 FAQ          9 perguntas, investimento e prazo primeiro
  8 CONTATO      formulário curto + o que levar para a primeira conversa

ASSINATURA
  A RÉGUA DO PROJETO. Uma faixa horizontal com as cinco etapas, prazo real em
  semanas e o que o cliente recebe em cada uma, desenhada como corte técnico:
  linha de base, marcações verticais, cota. É o que o segmento inteiro esconde,
  virado em objeto gráfico. Reaparece em miniatura na seção de escopo.
```

**Wireframe da régua:**

```
  01 ESCUTA        02 ESTUDO        03 PROJETO       04 DETALHAMENTO   05 OBRA
  ├────────────────┼────────────────┼────────────────┼────────────────┼──────────►
  1 semana         3 semanas        5 semanas        4 semanas        acompanhamento
  visita e         duas propostas   plantas, 3D,     marcenaria,      visita quinzenal
  levantamento     de partido       paleta final     elétrica, luz    até a entrega
```

**O que mudou do passe 1 para o 2, e por quê:** saiu o branco com dourado (entrou
grafite quente com anil, que vem do azulejo da cidade e não do catálogo de luxo
genérico); saiu o cursor personalizado (entrou uma assinatura que informa em vez de
enfeitar); a grade 2x3 de projetos ganhou a tríade de metadados que transforma foto em
caso resolvido; e apareceram as duas seções que o segmento inteiro não tem, régua e
escopo.

## Motion

Uma assinatura em movimento: a **soleira**, uma linha de luz que atravessa a imagem no
momento em que ela entra na tela, revelando a foto por baixo (clip-path animado). Vem
do nome do estúdio e do gesto que a foto de assinatura mostra, a lâmina de sol
cruzando o piso. Fora isso: Lenis para scroll suave, entrada em cascata de 500ms, e
parallax leve só na foto do hero. Nada no portfólio além do zoom lento no hover, que é
resposta ao mouse.

`prefers-reduced-motion` desliga tudo e entrega a página estática e completa.

## Integridade

Marca, sócios, projetos e endereço são ficção. Nenhum prêmio, nenhum número de
faturamento, nenhum depoimento de cliente. As áreas em m² e os anos dos projetos
existem para demonstrar o formato da ficha técnica, e a página não os apresenta como
prova de nada além de si mesmos.
