---
name: kit-cor
description: >
  Define a paleta do site como decisão, não como consequência de ter escolhido
  um design system. Faz as perguntas que determinam cor (o que a marca promete,
  o que o setor já usa, para onde o olho tem que ir, o que ela NÃO pode
  parecer), monta a paleta por papel — fundo, tinta, superfície, acento — mede
  o contraste de cada par que vai existir na tela, e confere o quanto a escolha
  é comum dentro do próprio acervo. Use quando o usuário disser "define a
  paleta", "qual cor usar nesse site", "escolhe as cores", "monta o esquema de
  cor", "que acento usar", "esse site está sem personalidade de cor", "está
  tudo muito no automático", ou invocar /kit-cor. Use também, sem esperar o
  pedido, antes de aplicar um design system a um cliente novo — é ali que a cor
  costuma passar batida.
allowed-tools: Read Bash(python:*) Bash(python3:*)
---

# kit-cor — decidir a cor, em vez de herdar

## Antes de qualquer comando: resolva o `SKILL_DIR`

Todo comando abaixo roda um script que viaja junto desta skill, em
`SKILL_DIR/scripts/`. Defina `SKILL_DIR` como o **caminho absoluto da pasta que
contém ESTE SKILL.md que você acabou de ler** — o seu harness informou esse caminho
no resultado da leitura. Funciona em qualquer hospedeiro, sem depender de variável
de ambiente de nenhum agente específico:

```
~/.claude/plugins/cache/cannonball/cannonball/<v>/skills/<nome>/SKILL.md
~/.codex/skills/<nome>/SKILL.md
~/.gemini/skills/<nome>/SKILL.md
~/.agents/skills/<nome>/SKILL.md
```

Em todos, `SKILL_DIR` é a pasta do `SKILL.md`, e `SKILL_DIR/scripts/` está ao lado.

Um design system guarda as cores como **lista plana**: nenhuma diz qual é fundo,
qual é tinta, qual é acento. Lista plana não se decide, só se copia — e copiar é
exatamente a sensação de automático.

Pior: todo acervo de design system tem viés, e o viés é mensurável. Meça o seu
**antes** de recomendar qualquer coisa:

```bash
python "${SKILL_DIR}/scripts/cor.py" --vies
```

Ele conta, dos design systems que você guardou, quantos têm acento neutro, azul,
amarelo, quente, e quantos são tema claro. O padrão que aparece em quase todo acervo
é o mesmo: **cerca de metade cai em neutro ou azul, e a maioria é tema claro**. Não
porque o acervo é ruim — porque ele foi extraído de sites reais, e o mercado inteiro
é assim.

A consequência prática: puxar design system por busca sem ter falado de cor devolve,
na média, exatamente o lugar-comum que o `--vies` acabou de medir.

Esta skill existe para que a cor seja escolhida **antes** do design system, e o
design system sirva à cor — não o contrário.

---

## 0. A cor faz cinco trabalhos diferentes — decida qual

Antes de escolher matiz, decida **para que a cor serve nesta peça**. São cinco usos,
e eles pedem paletas diferentes (detalhe em
`${SKILL_DIR}/references/fundamentos-visuais.md` §5):

| Uso | O que a cor está fazendo |
|---|---|
| **atenção** | hierarquia, ritmo (acento repetido com matiz mudando), agrupamento por proximidade, ponto de entrada |
| **percepção** | profundidade (quente avança, frio recua), peso visual, **valor** |
| **branding** | conformidade ou fuga da categoria, e recall de memória |
| **função** | verde aprovado, amarelo atenção, vermelho descartar — lido antes do ícone |
| **emoção** | o que a pessoa sente antes de interpretar qualquer outra coisa |

Dois desses são contraintuitivos e mudam decisão:

**Peso visual.** Uma figura branca grande pesa **menos** que uma preta pequena.
Isso permite equilibrar uma composição **sem igualar tamanhos físicos** — útil
quando a peça do acervo tem proporção que você não quer mexer.

**Valor.** Verde-floresta dessaturado não significa "caro" sozinho; ele ativa
associações que o luxo treinou. **A chave é a baixa saturação**, que parece
controlada em vez de pedir atenção. Acento saturado demais denuncia promoção.

### A regra do acento único

O mecanismo da bolinha vermelha de notificação é saliência da cor somada a
recompensa variável. Traduzido para página: **paleta calma e UM acento urgente**.

> Elementos urgentes demais se cancelam.

Se a peça já tem CTA em acento, badge em acento e destaque em acento, você não tem
três ênfases — tem zero. O `--paleta` deriva `--kit-acento` e `--kit-glow`
justamente para você ter onde variar sem multiplicar urgência.

### E case a emoção da cor com a emoção da forma

Se a peça é feita de formas orgânicas e circulares (calma, união, proteção), a
paleta dessaturada calma reforça; a saturada briga. Se é angulosa e geométrica
(ordem, estrutura, energia), o inverso. Quase ninguém pensa nisso, e é de graça.

---

## 1. Pergunte o que determina cor

Não pergunte "que cor você gosta". Cor de site não é preferência, é argumento.
Cinco perguntas, nesta ordem:

**1. O que a marca promete?** É a única pergunta que decide sozinha. Confiança e
estabilidade pedem coisa diferente de urgência, ou de artesanal, ou de precisão
clínica. Peça a frase que o cliente usaria para se descrever, e trabalhe dela.

**2. O que o setor já usa — e vamos obedecer ou quebrar?** Odonto é azul e
branco em todo lugar. Isso é uma decisão disponível nos dois sentidos: obedecer
compra confiança instantânea; quebrar compra memória. As duas são válidas, a
omissão não é. **Pergunte explicitamente qual das duas.**

**3. Para onde o olho precisa ir?** O acento é rationado — ele existe para levar
ao que converte. Numa clínica é agendar; num e-commerce é comprar. Se o acento
está em cinco lugares, ele não está em nenhum.

**4. Claro ou escuro, e por quê?** Escuro não é sofisticado por natureza: é uma
escolha que favorece imagem, vídeo e 3D, e prejudica leitura longa. Se o site é
majoritariamente texto, claro quase sempre ganha.

**5. O que ele não pode parecer?** Peça dois ou três concorrentes. É a pergunta
que mais rende, e é a única que dá restrição real em vez de adjetivo.

Se o usuário travar, ofereça o caminho de trás para frente: peça **duas ou três
referências visuais** (site, foto, embalagem, capa) e extraia delas. Referência
concreta vence adjetivo sempre.

---

## 2. Escolha três cores, não uma paleta

Uma paleta inteira não se inventa. Três decisões bastam, e o resto é derivado:

| Papel | O que decide |
|---|---|
| **fundo** | claro ou escuro, e a temperatura — branco puro, creme, papel, carvão, tinta |
| **tinta** | quase nunca `#000` ou `#fff` puros: preto puro sobre branco puro vibra |
| **acento** | a única cor com opinião. Uma só. |

O resto — superfície, superfície elevada, tinta suave, tinta apagada, linha,
texto sobre o acento — **é derivação, não escolha**. O script faz:

```bash
python "${SKILL_DIR}/scripts/cor.py" --paleta \
  --fundo "#0b0b0d" --tinta "#f4f4f5" --acento "#c9a227"
```

Ele devolve os onze papéis nomeados como os tokens `--kit-*` que as peças do
acervo já consomem, mede o contraste de cada par que vai existir na tela, e
imprime o CSS pronto.

**Um acento por site.** Se aparecer um segundo, ele é `--kit-glow` (halo,
emissivo) ou um estado semântico (erro, sucesso) — não um segundo acento.

---

## 3. Meça o contraste; não confie no olho

O olho se acostuma em dez minutos e passa a aprovar o que está ruim.

```bash
python "${SKILL_DIR}/scripts/cor.py" --contraste "#767676" "#ffffff"
```

O script separa o que tem mínimo obrigatório do que não tem:

- **texto** — 4.5:1 (AA), 7:1 (AAA)
- **componente de interface e gráfico com significado** — 3:1 (WCAG 1.4.11)
- **divisória decorativa** — **sem mínimo**. Uma linha a 1.4:1 está certa;
  forçá-la a 3:1 produz aquela borda pesada que denuncia site feito por régua.

Dois pares que quase sempre reprovam e quase nunca são conferidos:

1. **Texto secundário sobre o fundo.** O cinza que parece elegante no Figma
   costuma bater 3.8:1.
2. **Texto dentro do botão de acento.** Amarelo e verde-limão pedem texto preto,
   não branco — o script escolhe sozinho, mas confira se bate com a marca.

Contraste que reprova não é detalhe de acessibilidade: é o texto sumindo no
celular sob sol, que é onde metade dos seus clientes vai abrir o site.

---

## 4. Confira o quanto a escolha é comum

Este é o passo que responde ao "está tudo no automático":

```bash
python "${SKILL_DIR}/scripts/cor.py" --parecidos "#2563eb"
```

Ele diz quantos design systems do acervo já têm acento daquela família e lista os
mais próximos. Com azul, a resposta é 42.

Como usar a informação — e **não** é "fuja do azul":

- **Se a cor é da marca do cliente**, siga. Só saiba que ela não distingue
  sozinha, e desloque a diferenciação para tipografia, espaço ou movimento.
- **Se a cor é sua escolha e caiu em neutro ou azul**, pergunte-se se foi
  decisão ou inércia. Metade do acervo está lá.
- **Se não apareceu ninguém**, ótimo — desde que a cor sirva à marca. Diferenciar
  por diferenciar produz site estranho, não memorável.

---

## 5. Só então escolha o design system

Com fundo, tinta e acento decididos, a busca muda de natureza: você não procura
mais "um design system bonito", procura **um que já resolveu esta paleta**.

```bash
python "${SKILL_DIR}/scripts/buscar.py" "<caráter> <temperatura>" --familia design-system
```

Duas coisas para lembrar aqui:

- **O aglomerado editorial branco engole a busca** — parede branca, tipo preto,
  acento único ou nenhum. São excelentes e quase intercambiáveis entre si, e num
  acervo típico é o maior grupo isolado. Ache o seu com `buscar.py --listar tag`
  (tag de contagem muito alta é aglomerado). Se a sua decisão de cor foi deliberada
  e não é essa, filtre **contra** eles.
- Se o MCP do **GetLayers** estiver ligado, `getlayers_palettes` traz rampas
  portáteis que resolvem os mesmos quatro papéis — e alimentam o tingimento de
  cena 3D direto. Ver `${SKILL_DIR}/references/getlayers.md`.

Design system escolhido **depois** da cor é ferramenta. Escolhido antes, ele
decide por você — e é assim que se chega no automático.

---

## 6. Grave a decisão

A paleta é a decisão mais cara de reverter: mudar depois obriga a repintar tudo
que já foi montado.

Ao salvar a receita (passo 9 da `kit-montar`), inclua os três hex e **a
justificativa em uma linha** — por que este acento, e contra o que ele foi
escolhido. Sem o porquê, a próxima pessoa (ou você em dois meses) só vê três
códigos e volta ao automático.

Se durante a montagem alguma cor reprovar contraste ou brigar com uma peça,
registre:

```bash
python "${SKILL_DIR}/scripts/armadilhas.py" --add <id-da-peça> \
  --texto "o par exato e o número medido" --origem <receita> --grau alta
```

---

## O que esta skill não faz

Não gera paleta a partir de logo, não extrai cor de imagem e não gera harmonias
por regra (complementar, tríade). Harmonia por fórmula produz paleta correta e
sem opinião — que é o problema, não a solução.

E não decide por você. Ela força a decisão a existir, mede o resultado, e mostra
de quantos outros você está chegando perto.
