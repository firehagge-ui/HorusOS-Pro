---
name: criar-site
description: Orquestra a criação de um site ou landing page do zero, do pré-voo de pesquisa até a verificação final. Força a etapa de referência ANTES do HTML: estuda 3 a 5 concorrentes reais do segmento, consolida o padrão, monta o plano, faz o passe duplo e só então libera o código. Use quando o Marcelo disser "criar site", "gerar site", "novo site", "faz o site do cliente X", "vamos começar o site", "/criar-site", "/gerar-site", ou sempre que uma peça de site/landing page for começar do zero.
---

# Criar site

Orquestra o site inteiro numa ordem fixa, com a pesquisa de referência travada
como **primeira** etapa, não como opção. O erro que essa skill existe pra cortar
é o de sempre: abrir o editor e começar o HTML antes de estudar quem já resolveu
esse problema no mesmo segmento. Referência estudada faz a decisão sair de um caso
real; sem ela, o site sai do viés médio do modelo e fica com cara de template.

Essa skill **não substitui** a doutrina de site em `_memoria/design/`. Ela
sequencia e obriga o que já está escrito lá. Cada fase aponta pro arquivo que
manda de verdade.

## Quando usar

- Site ou landing page novo, do zero, pra qualquer cliente ou pra própria Hórus
- O Marcelo pediu pra "começar o site" de alguém
- **Não** usar pra ajuste pontual num site que já existe (aí é edição direta, ou
  a `/redesign-skill` se for repaginar). Essa aqui é pra quando não há HTML ainda.

## O fluxo, em ordem. Não pular fase.

### Fase 0 — Pré-voo de contexto

Ler, antes de qualquer coisa:

1. `clientes/<nome>/briefing.md` e `clientes/<nome>/marca.md` (o site é do
   cliente; a marca das peças é a dele, não a de `identidade/`)
2. `_memoria/integridade.md` (dado que falta vira `[FALTA: ...]`, nunca texto
   plausível inventado)
3. Se o cliente for de **setor regulado** (odonto/CFO, psicologia/CFP), reler o
   bloco de compliance dele no `CLAUDE.md`. O compliance **trava** a entrega e
   vence qualquer sugestão de copy mais vendedora.

Se `briefing.md` ou `marca.md` não existirem ainda, parar e rodar `/novo-projeto`
primeiro. Sem dossiê do cliente não há site.

### Fase 1 — Pesquisa e referência (a etapa que essa skill garante)

**Estudar de 3 a 5 concorrentes reais do segmento do cliente antes da primeira
linha de HTML.** Concorrente do nicho ensina mais que galeria premiada, porque
carrega a expectativa já formada daquele público.

1. **Ver o que a casa já tem.** Abrir `referencias/README.md` e checar se já existe
   teardown do segmento (psicologia, café, odonto, fitness já têm acervo). Teardown
   que já existe não se refaz, se reusa. Ver também a "Fila de estudo" no fim do
   README: pode já ter concorrente listado, só faltando o teardown.
2. **Achar concorrentes reais.** Usar o Firecrawl (`firecrawl_search`) pra buscar
   concorrentes do segmento na praça do cliente. Priorizar quem tem a **mesma
   anatomia** do cliente (clínica com equipe estuda clínica com equipe, não solo).
3. **Estudar cada um com `/estudar-site`.** URL ou imagem colada, tanto faz. Cada
   um vira teardown em `referencias/`. Não olhar por cima e achar "bonito":
   destrinchar seguindo os 10 pontos da skill (estrutura, hero, "pra quem é",
   tipografia, cor, composição, imagem, copy, conversão, o que evita).
4. **Temperar com 1 ou 2 referências de padrão premium**, das galerias curadas em
   `_memoria/design/91-onde-estudar.md` (Refero pra BR, Godly, Land-book,
   Typewolf pra fonte). Galeria entra como tempero de composição e ousadia, não
   como base. A base é o concorrente.
5. **Se o Marcelo mandou referências** (link, print, Pinterest), cada uma passa
   pela `/estudar-site` também. Referência do Marcelo é material de estudo, não
   inspiração de olhada rápida.

Fechar a fase registrando o padrão comum: o que se repete nas boas e por quê. Se o
estudo revelou padrão ou antipadrão novo, gravar linha em `_memoria/design/`
(`00-anatomia.md` ou `90-antipadroes.md`) na hora. Teardown que não vira regra é
arquivo parado.

### Fase 2 — Leitura obrigatória de doutrina

Antes do HTML, ler (a regra do `CLAUDE.md`, seção "Trabalho de site"):

1. `_memoria/design/00-anatomia.md` (o passe duplo, o elemento-assinatura,
   estrutura seção por seção)
2. `_memoria/design/90-antipadroes.md` (o que denuncia site de IA)
3. `_memoria/design/99-checklist.md` (o que conferir antes de entregar)
4. `_memoria/design/50-copy-de-interface.md` se a peça tem formulário, botão ou bot
5. `_memoria/design/60-motion.md` antes de qualquer animação ou efeito de scroll

Os quatro fundamentos de teoria (`10` a `40`) são consulta sob demanda, abrir quando
a decisão for daquele assunto (montar a escala de tipo, a paleta, o ritmo).

### Fase 3 — Roteamento de estilo

Aplicar a regra do `CLAUDE.md` (seção "roteamento de estilo"):

1. Cliente tem estilo em `marca.md`? Usa esse.
2. O Marcelo nomeou um estilo? Invocar a skill daquele estilo e aplicar os tokens.
3. Ninguém definiu? Olhar o segmento no `identidade/catalogo-estilos.md`, sugerir
   1 ou 2 estilos e **perguntar** antes de produzir.

Sempre UM estilo por peça. Se o estilo brigar com a `marca.md`, a marca do cliente
vence.

### Fase 4 — O passe duplo (obrigatório, do 00-anatomia)

1. Escrever o **plano**: cor, tipo, layout, elemento-assinatura, ordem das seções,
   apoiado no padrão que a Fase 1 consolidou.
2. Atacar o plano com a pergunta: **"eu chegaria aqui em qualquer cliente desse
   segmento?"** Onde a resposta for sim, é genérico, revisar.
3. **Só então** abrir o editor.

### Fase 5 — Build

Escrever o HTML/CSS. Regras vivas durante o build:

- Dado que não temos vira `[FALTA: ...]` marcado, nunca texto plausível.
- Nunca usar tracinho (`—` / `–` / ` - `) como separador em copy. Vírgula, ponto
  ou "que". Hífen de palavra composta e identificador oficial (CRO-BA, All-on-X) pode.
- Em cliente regulado, cada afirmação passa pelo compliance antes de existir no
  arquivo. Sem superlativo, sem promessa de resultado, sem depoimento vedado.
- Os hooks do impeccable rodam sozinhos depois de cada Edit/Write em `.html`/`.css`.
  Contraste baixo e fonte pequena que eles apontarem se corrige, não se dispensa.

### Fase 6 — Verificação antes de entregar

Não declarar pronto sem conferir (regra da `/verificar` e do `CLAUDE.md`).

1. Rodar `_memoria/design/99-checklist.md` e a varredura de antipadrões.
2. Rodar o detector:
   ```
   node .claude/skills/impeccable/scripts/detect.mjs "clientes/<nome>/site"
   ```
   Ou, se a skill não estiver nesse clone:
   `npx --yes impeccable@4.0.4 detect "clientes/<nome>/site"`.
   Saída `0` é limpo, `2` achou coisa. Regra de acessibilidade se corrige, dispensa
   exige `--reason`.
3. Se o comando não rodou nesta mensagem, o item é **não verificado**, nunca ok.

## O que essa skill garante

O ponto todo dela é que **a Fase 1 acontece antes da Fase 5**, sempre. Se em algum
momento a vontade for pular direto pro HTML "porque o segmento é conhecido", é
exatamente aí que o site fica genérico. Conhecer o segmento no geral não é o mesmo
que ter estudado 3 concorrentes daquele cliente nesta semana.

## Limite

Essa skill orquestra por confiança: ela me lembra da ordem, mas não me impede
fisicamente de pular etapa. Se o Marcelo quiser a **trava dura** (impossível criar
`.html` de cliente sem teardown), isso é um hook `PreToolUse`, um passo além dessa
skill. A skill resolve o caso comum; o hook fecha a brecha.
