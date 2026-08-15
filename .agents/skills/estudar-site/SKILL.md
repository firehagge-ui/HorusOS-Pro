---
name: estudar-site
description: Estuda uma referência de site (URL OU imagem colada — print, Pinterest, galeria) e gera um teardown estruturado em referencias/. Use quando o Marcelo mandar uma URL ou uma imagem para analisar, pedir para estudar concorrentes de um cliente, ou disser "estuda esse site", "estuda essa referência", "faz o teardown de", "/estudar-site". Também use por conta própria antes de começar um site novo, para estudar 3 a 5 concorrentes do segmento do cliente, e sempre que o Marcelo mandar referências antes de um site.
---

# Estudar site

Transforma uma referência (URL **ou** imagem) num teardown que fica no repositório e
vira contexto nas próximas vezes. Navegar não ensina; teardown ensina. Olhar um print
e achar "bonito" não ensina; destrinchar ensina. O objetivo é que a decisão de design
pare de sair do viés médio do modelo e passe a sair de referência real, estudada.

## Quando usar

- O Marcelo mandou uma URL para analisar
- **O Marcelo colou imagens de referência** (Pinterest, galeria, print de concorrente)
  antes de um site. Essas referências são material de estudo, não inspiração de olhada
  rápida: passam por teardown **antes** da primeira linha de HTML
- **Antes de começar qualquer site novo**, com 3 a 5 concorrentes do segmento do
  cliente. Concorrente do nicho ensina mais que galeria premiada
- Quando aparecer um site excelente fora do segmento, para não ficar só
  reproduzindo a média do nicho

## Como fazer

### 1. Coletar

Duas passadas com o Firecrawl, porque uma só não dá o que precisa:

```
firecrawl_scrape url=<url> formats=["branding"]
firecrawl_scrape url=<url> formats=["markdown"] onlyMainContent=true
```

O `branding` devolve fontes, hex da paleta, raio de canto, sombra de botão e
tecnologia. O `markdown` devolve a estrutura de seções e o texto, que é onde
está o aprendizado de copy.

Se precisar ver o layout, renderizar com o Edge headless em modo `--headless=old`
(o `new` é instável nesta máquina) e salvar o print junto do teardown:

```
msedge.exe --headless=old --disable-gpu --no-sandbox --hide-scrollbars
  --user-data-dir=<pasta temporária nova a cada execução>
  --window-size=1440,3000 --screenshot=<destino> --virtual-time-budget=9000 <url>
```

⚠️ Duas armadilhas conhecidas: usar um `--user-data-dir` novo a cada chamada,
senão a segunda falha por profile travado; e o viewport mínimo é ~477px, então
**não dá para verificar mobile por print** aqui.

### 1b. Coletar de uma imagem colada (print, Pinterest, galeria)

Quando a referência é uma imagem que o Marcelo mandou, não há Firecrawl nem scrape: a
coleta é **leitura visual disciplinada**, e vale tanto quanto a de URL desde que seja
feita com o mesmo rigor. O erro a evitar é o de sempre: olhar rápido, achar "bonito" e
já ir montar. A imagem é material de estudo, e passa pela mesma lista de 10 pontos de
"O que olhar, na ordem" (abaixo).

A diferença é ser honesto sobre o que a imagem **entrega** e o que é só **aparente**:

- **Entrega** (dá para afirmar): ordem e número de seções, proporção e hierarquia (o que
  é grande, o que é pequeno, quantas vezes maior), posição dos elementos (texto à
  esquerda? imagem sangrando na borda? produto centralizado?), para onde o olho cai
  primeiro e como a página conduz dali, quantos acentos de cor de verdade, densidade de
  texto por bloco, composição (simétrica, deslocada, sobreposta, bento), e o que a peça
  deliberadamente **evita**.
- **Aparente** (registrar como estimativa, nunca como fato exato): hex de cor, nome da
  fonte, medida em px, peso de arquivo. Numa imagem eu leio "serifa de alto contraste,
  terrosa, título umas 3x o corpo", não "Fraunces #D65F45 a 64px". Marcar como *aparente*
  no teardown, para ninguém copiar um valor inventado como se fosse medido.

Se o Marcelo deu o link de onde tirou (Pinterest, o site), registrar no campo URL do
gabarito. Se forem **várias imagens**, cada uma é uma passada, e o teardown consolida o
**padrão comum** entre elas, que é o que mais ensina: a ideia não é copiar uma, é extrair
o que se repete nas boas e por quê.

O resto do fluxo é idêntico ao da URL: teardown em `referencias/`, e se revelou padrão ou
antipadrão novo, registrar em `_memoria/design/` na mesma hora.

### 2. Escrever o teardown

Um arquivo em `referencias/<nome-curto>.md`, seguindo o gabarito em
`referencias/_gabarito.md`. Regras do texto:

- **Descrever a decisão, não elogiar.** "Serifa nos títulos" não ensina nada.
  "Serifa alta de contraste nos títulos com sans neutra no corpo, o que dá ar de
  publicação e sustenta o argumento de autoridade da psicóloga" ensina.
- **Anotar a ordem das seções**, que é o que mais se reaproveita.
- **Anotar o que é ruim também.** Contraexemplo vale tanto quanto exemplo.
- Copiar trechos de copy que funcionam, com o motivo.

### 3. Fechar o ciclo

Se o teardown revelou um padrão novo ou um antipadrão novo, **registrar em
`_memoria/design/`** na mesma hora. Teardown que não vira regra é só um arquivo
parado.

Depois, uma linha em `referencias/README.md` com o site, o segmento e a lição
principal, para dar para varrer a biblioteca sem abrir tudo.

## O que olhar, na ordem

1. **Estrutura.** Que seções, em que ordem, e qual o trabalho de cada uma.
   Comparar com `_memoria/design/00-anatomia.md` e anotar as diferenças.
2. **Hero.** Promessa, prova, CTA. A prova aparece acima da dobra?
3. **O bloco "para quem é".** Existe? Como é escrito? Segunda pessoa?
4. **Tipografia.** Que famílias, que escala, que contraste entre título e corpo.
5. **Cor.** Quantos acentos de verdade. Onde o acento aparece e onde não aparece.
6. **Composição.** Quantas famílias de layout diferentes na mesma página.
7. **Imagem.** Real ou banco? Retrato ou ambiente? Como está cortada?
8. **Copy.** Registro, tamanho de frase, o que promete e o que evita prometer.
9. **Conversão.** Quantos CTAs, com que rótulo, onde estão.
10. **O que o site evita.** Às vezes a decisão mais forte é uma ausência.

## O que não fazer

- Não copiar layout inteiro para o cliente. Teardown é para entender a decisão,
  não para clonar. O que se reaproveita é a **estrutura e o raciocínio**, nunca a
  aparência.
- Não elogiar sem explicar o mecanismo.
- Não estudar só site premiado. Site premiado otimiza para júri de design; site
  de concorrente otimiza para o cliente comprar.
