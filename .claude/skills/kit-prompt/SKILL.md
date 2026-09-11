---
name: kit-prompt
description: >
  Entrevista sobre o site e gera um PROMPT DE CONSTRUÇÃO completo, no padrão dos
  prompts já validados do acervo — com stack, fontes, paleta, estrutura seção a
  seção, medidas exatas e proibições explícitas. O resultado é texto para você levar
  a outra ferramenta (v0, Lovable, Cursor, outro modelo) ou guardar; não é código
  escrito no projeto. Use quando o usuário pedir "gera um prompt", "monta o prompt
  pra esse site", "quero um prompt pra clínica", "preciso de um brief pra passar pro
  v0", ou invocar /kit-prompt. Se ele quiser o site construído aqui e agora, é a
  kit-montar, não esta.
allowed-tools: Read Glob Bash(python:*) Bash(python3:*)
---

# kit-prompt — gerar o prompt, não o site

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

A diferença que define esta skill: **`kit-montar` escreve código no projeto; esta
produz texto.** Um prompt que você leva para outro lugar, reusa, edita, guarda.

O trabalho aqui é gerar mais um prompt no padrão dos que já funcionaram, alimentado
pelas peças que já existem. Veja o que existe antes de começar:

```bash
python "${SKILL_DIR}/scripts/perfil.py"
python "${SKILL_DIR}/scripts/buscar.py" --familia prompt --qualidade favorito
```

**Acervo vazio não impede nada aqui** — o padrão abaixo é a regra, não um resumo
estatístico do acervo. Só peça material ao usuário se ele quiser um prompt calcado em
alguma peça específica.

## O que separa um prompt bom de um mediano

Não é opinião: sai de comparar os marcados `favorito` contra os comuns.

| Marcador | Favorito | Comum |
|---|---|---|
| tamanho | 10.672 chars | 8.284 |
| medidas em px | 16 | 12 |
| URLs exatas | 7 | 4 |
| easings nomeados | 2 | 1 |
| **proibições explícitas** | **1+** | **0** |

**Especificidade e restrição.** Os bons dizem `translateY(-40px)`, `#0A0B11`,
`cubic-bezier(.16,1,.3,1)` — e dizem o que **não** fazer. "Sem cards. Sem roxo. Não
adicione seções além das listadas." Prompt vago devolve resultado genérico.

Um prompt do acervo abaixo de ~6.000 caracteres quase sempre é rascunho. Não entregue
um esqueleto e chame de pronto.

## 1. Entreviste

Agrupe numa mensagem só, e ofereça alternativas fechadas quando houver (se o seu
agente tiver ferramenta de múltipla escolha, use; senão, liste em texto).

1. **O que é o site.** Setor, marca, público, o que precisa acontecer. Concreto:
   "clínica de estética facial, 30–50 anos, quer agendamento" — não "site bonito".
2. **Escopo.** Hero apenas? Landing completa? Quantas seções, e quais?
3. **Stack de destino.** Pergunte sempre — muda o prompt inteiro. Ofereça
   Next.js+Tailwind, Vite+React, HTML puro. Se o prompt vai para v0 ou Lovable,
   registre isso: eles assumem Next+Tailwind+shadcn.
4. **Material.** Vídeo, fotos, logo, fontes da marca. **Restringe tudo** — metade do
   acervo depende de vídeo de fundo.
5. **Claro ou escuro, e qual o tom.**
6. **Referência.** Algum site que ele goste? Serve para casar com um design system.

7. **A emoção que a pessoa leva embora.** Uma palavra: *calma, desejo, urgência,
   confiança, pertencimento, alívio.* Se ele não souber responder, derive do setor
   e confirme numa linha — mas **não pule**. É o requisito que separa um prompt que
   descreve layout de um que descreve intenção, e vai virar linha explícita na spec.

Se ele já respondeu no pedido, não repita a pergunta.

### Se o briefing vier vago, gere o conceito em vez de pedir mais

Cliente frequentemente não sabe dizer o que quer. Antes de devolver a bola, tente
as seis técnicas de geração (`${SKILL_DIR}/references/fundamentos-visuais.md` §7) —
elas produzem ângulo a partir de material pobre:

1. **A verdade escondida, não o assunto óbvio.** Não "clínica boa"; o que a pessoa
   sente ao evitar sorrir na foto.
2. **A característica mais forte, empurrada até o fim.** Ache o traço único da marca
   e deixe ele vazar para tudo — cor, foto, ritmo — em vez de ficar num canto.
3. **Interpretação literal.** Torne fisicamente real uma expressão que o público já
   usa. Você não inventa significado, pega emprestado um que já existe.
4. **Colisão de mundos.** "E se…?" — e se a página de erro fosse um móvel faltando
   peça?
5. **O detalhe minúsculo.** Nem tudo precisa de conceito grande.
6. **Informação não é emoção.** Um dado é triste; o dado com um rosto é pessoal.

Leve **uma** dessas como direção ao usuário antes de escrever o prompt. Direção
escolhida junto vale mais que prompt longo escrito sozinho.

## 2. Busque as três camadas no acervo

O prompt não sai da sua cabeça: sai do que já existe.

> **Se o MCP do Motion Sites estiver ligado:** ele é o maior catálogo de prompt de
> página pronto. Use `search_prompts` para pegar o
> **`preview_url`** do que você escolher — o acervo guarda texto, não imagem, e
> mostrar vale mais que descrever. E `get_related_prompts` para expandir a partir
> de um que já deu certo. As duas são **gratuitas**.
>
> **`get_prompt` é limitado a 3 na conta sem plano** — nunca gaste num prompt que
> já está no acervo. Ver
> `${SKILL_DIR}/references/motionsites-genjutsu-designdna.md`.

```bash
# identidade visual — paleta, tipografia, regras
python "${SKILL_DIR}/scripts/buscar.py" "<caráter visual>" --familia design-system

# estrutura — página inteira parecida
python "${SKILL_DIR}/scripts/buscar.py" "<setor>" --familia prompt
python "${SKILL_DIR}/scripts/buscar.py" "<setor>" --familia template

# movimento — a técnica de animação
python "${SKILL_DIR}/scripts/buscar.py" "<efeito desejado>" --familia animacao
```

**Leia o design system inteiro** em `acervo/design-systems/<id>/design-system.md`.
É de lá que saem os hex, a escala tipográfica e o "Do's and Don'ts" — os valores
exatos que fazem o prompt ser bom em vez de vago. O `Agent Prompt Guide` de cada
sistema já traz exemplos de prompt por componente: reaproveite.

Mostre ao usuário quais peças você vai usar como base **antes** de escrever. É mais
barato corrigir a escolha agora.

## 3. Escreva o prompt

Estrutura extraída dos prompts que funcionaram. Em inglês — os que funcionam estão em
inglês, e as ferramentas de destino respondem melhor assim. Diga isso ao usuário.

```
Build a [escopo] for [marca] — [uma linha do que é] — using [stack exata].

## Tech stack
[versões, dependências permitidas E a frase "no other UI libraries"]

## Fonts
[nome + URL exata do @import ou <link> + pesos usados]

## Color palette
[cada cor com hex E o papel: fundo, texto, ação primária, borda]

## Layout — section by section
[para cada seção: o que contém, medidas em px/rem, alinhamento, breakpoints]

## Motion
[o que anima, duração em ms, easing nomeado, o que dispara]

## Responsive
[o que muda em cada breakpoint]

## Emotional outcome
Uma linha em inglês dizendo o que o visitante deve **sentir ao sair** — e, se
couber, o ritmo que produz isso (impacto → demora → pausa). Sem isso o modelo
otimiza aparência e a página fica correta e esquecível.

## Do NOT
[proibições explícitas — é o que separa favorito de comum]
```

Regras ao preencher:

- **Números, não adjetivos.** "Título 96px, line-height 0.9, tracking -0.03em" em vez
  de "título grande e apertado".
- **URL completa de fonte.** Se o design system usa fonte comercial, use o campo
  `Substitute` da ficha e diga qual substituiu.
- **Proibições vindas do design system.** O `Do's and Don'ts` de cada ficha já traz
  as regras; a seção `Do NOT` do prompt é onde elas viram instrução.
- **Assets.** Se a peça de origem tinha URL de vídeo ou imagem, **não copie**: essas
  URLs vivem em bucket temporário e uma fração grande já responde 403/404 (o
  `perfil.py` diz quantas peças do seu acervo já morreram assim). Escreva um
  placeholder marcado e avise que precisa ser trocado.
- **Um efeito forte por página.** Se o briefing pedir três, escolha o melhor e
  registre os outros como alternativa no fim do prompt.

## 4. Entregue e ofereça guardar

Entregue o prompt em bloco de código, pronto para copiar. Diga em uma linha quais
peças do acervo o alimentaram — o usuário precisa saber a procedência.

Se ele gostar, ofereça guardar no acervo, que é como o acervo cresce:

```bash
python "${SKILL_DIR}/scripts/ingerir.py" <arquivo>.md --id <slug> \
  --setor <setor> --estrutura lp-completa \
  --quando-usar "..." --nao-usar-quando "..."
python "${SKILL_DIR}/scripts/indexar.py"
```

E se ele for construir a partir dele agora, aí sim: `kit-montar`.

## Sobre animação e WebGL no prompt

Antes de especificar movimento, leia
`${SKILL_DIR}/references/stack-animacao.md`. Ele traz o que está vivo e o
que está parado — não escreva um prompt pedindo `ogl` (sem release há 19 meses) ou
`regl` (21 meses).

Padrão recomendado: **GSAP + Lenis** para scroll, **three** para 3D. Para efeito 2D
sobre imagem, `pixi.js` é a escolha certa — confira no `perfil.py` se o acervo tem
alguma peça nela antes de prometer reuso; normalmente não tem. Se o MCP do GetLayers
estiver ligado, ele traz backgrounds de vídeo, que um acervo de código não tem.

**Theatre.js** só entra quando há coreografia complexa de câmera ou 3D. Para reveal,
menu ou texto, pedir Theatre.js num prompt é montagem desproporcional.
