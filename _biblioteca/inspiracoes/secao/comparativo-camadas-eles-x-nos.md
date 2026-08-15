# Inspiração: comparativo "eles X, nós Y" mostrado em camadas

- **Tipo:** secao
- **De onde:** Linearity — https://www.linearity.io/ (seção "The difference")
- **Segmento de origem:** SaaS de design com IA (product marketing B2B/PLG)
- **Visto em:** 14/08/2026
- **Teardown irmão:** `referencias/linearity.md`

---

## O que é

Uma seção comparativa de duas colunas que ataca a categoria do concorrente. À
esquerda, o resultado do concorrente mostrado como **objeto pobre e fechado**:
uma imagem chapada rotulada "Pixelated / Bitmap.jpg / **1 layer** / done generating,
not done working". À direita, **o mesmo asset explodido nas camadas que o compõem** —
Logo, Text, Group text, Image, Background — cada uma nomeada e marcada "ALL EDITABLE",
sob o selo "LAYERS 5". A frase-âncora fecha: **"They give you a picture. We give you
a campaign."**

Não é "nós somos melhores" escrito por extenso. É a **estrutura interna do produto
revelada lado a lado com a ausência dela** no concorrente.

## Por que marca

Porque troca adjetivo por prova de um segundo. O olho compara "1 layer" com "5 layers
editáveis" e conclui sozinho qual é superior — a página não precisa afirmar, só
mostrar. Três coisas fazem funcionar:

1. **Mostra o que o concorrente esconde.** A camada é o valor real; expor a estrutura
   torna visível uma diferença que normalmente é invisível até você tentar editar.
2. **Redefine a categoria a favor de quem mostra.** Depois de ver as camadas, "imagem
   chapada" vira o padrão inferior na cabeça do leitor — o comparativo instala a régua.
3. **É o mesmo mecanismo do "caminho que o café faz" (Arbor):** processo/estrutura
   virando prova, em vez de superlativo. Serve especialmente onde a régua proíbe
   adjetivo vendedor.

## Como recriar

- Duas colunas. Esquerda: o objeto "pobre" com rótulos que soam a limitação
  (formato de arquivo, contagem baixa, "pronto de gerar, não pronto de usar").
  Direita: o **mesmo objeto** decomposto em partes nomeadas, com um contador
  ("5 camadas") e um selo de estado ("tudo editável").
- O truque é ser **o mesmo asset** dos dois lados — não dois exemplos diferentes.
  A comparação só morde se o leitor reconhece que é a mesma coisa, tratada de dois
  jeitos.
- **Biblioteca detectada:** CSS puro basta (duas colunas, camadas como imagens/SVG
  empilhados com leve offset). Um scroll-reveal que "explode" as camadas ao entrar na
  viewport reforça, mas é opcional — GSAP/ScrollTrigger se quiser o movimento.
- **Snippet:** não vendorizado ainda; se virar animação de explodir camadas, apontar
  para `_biblioteca/motion/snippets/` e obedecer `_memoria/design/60-motion.md`.
- **Custo honesto:** a versão estática é barata. A versão animada exige cuidado de
  performance (offset de várias camadas) e guard de `prefers-reduced-motion`.

## Onde cabe

- **Site da própria Horus — encaixe mais forte:** "agência tradicional que entrega um
  arquivo VS sistema com IA que entrega peça pronta, editável e on-brand". É quase o
  argumento de venda da casa, e a régua da agência não trava comparação como a de um
  cliente regulado.
- **Icarus** (produto de IA da Horus): "chatbot genérico que só cospe texto VS agente
  que executa a tarefa inteira". Mesma mecânica de expor a estrutura que o concorrente
  não tem.
- **Cliente com diferencial de *processo* que o concorrente esconde:** o Grão da Serra é
  um exemplo honesto — "grão escolhido e beneficiado com cuidado (pilagem, secagem, torra)
  VS café genérico de origem indefinida". Só vale com o dado real do cliente, sem inventar
  etapa (`integridade.md`) e sem citar concorrente nominalmente.
- **Menos em cliente de saúde:** psicologia (Aion, Mayara / CFP) e odonto (Giovanni / CFO)
  proíbem comparação que deprecie terceiro ou insinue superioridade. O mecanismo "mostrar
  estrutura como prova" ainda serve — mas **contra o problema, não contra um concorrente**
  (ex: "consulta avulsa VS acompanhamento estruturado"), e sem tom de desafio.

## Cuidado

- `prefers-reduced-motion` se animar a explosão das camadas.
- **Compliance:** em cliente regulado, nada de depreciar concorrente nomeado, nada de
  superlativo, nada que insinue promessa de resultado. Comparar com o *problema*, não
  com uma marca rival.
- Hex/fonte do Linearity lidos aqui vêm do `branding` do scrape (entrega), mas a
  aparência exata da seção "The difference" é **aparente** — o screenshot pegou só o
  hero. Recriar pelo mecanismo, não copiar pixel.
