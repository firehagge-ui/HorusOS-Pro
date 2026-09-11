---
name: kit-buscar
description: >
  Consulta o acervo pessoal de sites do usuário — o que ele já guardou:
  templates rodáveis, design systems com paleta e tipografia, componentes de UI
  e de IA, animações de scroll, texto e menu, efeitos WebGL, prompts de página
  inteira e receitas de composição que já deram certo. Responde "o que eu já
  tenho pronto pra isso?" antes de qualquer coisa ser gerada do zero. O acervo
  começa vazio e cresce a cada ingestão — esta skill sempre lê o que existe
  agora, não uma lista fixa. Use quando o usuário perguntar o que tem no
  acervo, pedir uma peça específica ("que hero eu tenho pra clínica?", "tem
  algum menu overlay?", "qual design system escuro usar?", "tem carrossel?",
  "tem agendamento?"), quiser listar por setor, técnica, função ou tipo, ou
  invocar /kit-buscar. Use TAMBÉM, sem esperar o pedido, antes de construir
  qualquer hero, seção, menu, componente ou landing page: se existe peça pronta
  no acervo, ela vem antes de gerar código novo.
allowed-tools: Read Glob Bash(python:*) Bash(python3:*)
---

# kit-buscar — o que já existe no acervo

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

Antes de escrever qualquer hero, seção ou página, pergunte ao acervo. Gerar do zero
o que já existe é desperdício e produz resultado pior que uma peça que já rodou em
produção.

## Primeiro: veja de que acervo estamos falando

**O acervo é do usuário e muda.** Ele pode estar vazio (instalação nova), ter dez
peças ou ter milhares. Nada nesta skill afirma um número — quem afirma é o acervo:

```bash
python "${SKILL_DIR}/scripts/perfil.py"
```

Isso devolve, do estado atual: famílias e quanto cada uma tem, setores, stacks,
cobertura por função, **lacunas** (função sem nenhuma peça), quantidade de
armadilhas registradas e os avisos de saúde (asset morto, fonte não entregável).

Rode uma vez por conversa, na primeira busca. É o mapa; sem ele você chuta filtro.

O `perfil.py` termina com um bloco **POR ONDE SEGUIR**, que muda conforme o acervo:
numa instalação nova ele manda vincular a pasta antes de qualquer ingestão. **Repasse
isso ao usuário** — é o passo que, esquecido, deixa o material dele em `~/.cannonball`
em vez da pasta que ele queria, e mover depois é trabalho manual.

```bash
python "${SKILL_DIR}/scripts/vincular.py" --para "<pasta do usuário>"
```

**Se o perfil disser que o acervo está vazio, ou só com as peças de exemplo**, diga
isso em uma linha e siga construindo do zero — mas ofereça guardar o resultado depois
com `/kit-ingerir`.
A partir da segunda peça a busca já começa a valer, e o acervo passa a melhorar
sozinho: cada ingestão aumenta o que esta skill encontra e afina o que a `kit-cor` e
a `kit-tipo` medem.

## Como buscar

```bash
python "${SKILL_DIR}/scripts/buscar.py" "landing de clínica odontológica"
```

Filtros combináveis:

| Flag | Valores | Para quê |
|---|---|---|
| `--familia` | `prompt` `efeito` `ui` `html` | separa spec de página de código pronto |
| `--setor` | `odonto`, `joias`, `imobiliaria-luxo`, `saas-ai`… | vertical de negócio |
| `--estrutura` | `hero` `lp-completa` `scroll-cinematica` `signup` `404` `efeito-wrapper` `componente-ui` | o que a peça é |
| `--tag` | `escuro`, `video-bg`, `scroll-scrub`, `glassmorphism`… | característica visual |
| `--qualidade` | `favorito` `producao` `rascunho` | favorito é o que já provou |
| `--stack` | `nextjs` `vite` `html-css-js` | stack de origem |
| `--sem-video` | — | exclui o que depende de vídeo |
| `--n` | número | quantos resultados (padrão 8) |
| `--listar` | `setor` `tag` `estrutura` `familia` | mostra os valores existentes |
| `--json` | — | saída estruturada |

Não sabe que setor existe? `--listar setor` antes de chutar.

## Busque por função, não só por aparência

O acervo nasceu indexado por **caráter visual** ("creme editorial") e por **técnica**
("pin, scrub, lenis"). Faltava o eixo mais óbvio: **o que a peça faz**. Sem ele, um
template com 475 ocorrências de carrinho e catálogo sumia de uma busca por "grade de
produtos".

```bash
python "${SKILL_DIR}/scripts/buscar.py" --tag catalogo --tag carrinho
```

Duas etiquetas para a mesma função, e a diferença importa:

- **`catalogo`** — o código **implementa**. Você copia e funciona.
- **`spec-catalogo`** — um design system **documenta** como deve parecer. É
  referência de estilo, não código que roda.

Quanto o acervo cobre de cada função, agora:

```bash
python "${SKILL_DIR}/scripts/perfil.py" --funcao
```

A linha `lacunas:` é a mais útil das duas: são as funções sem **nenhuma** peça.
Quando o pedido cai numa lacuna, não procure mais — construa, e ingira depois. É
assim que o acervo fecha buraco: a lacuna de hoje vira a peça de amanhã.

Peça construída para fechar lacuna deve nascer **sem nada fixo**: toda a aparência
saindo de variável CSS (`--kit-*` ou o token do próprio site), com fallback final em
`currentColor`/`inherit`, e texto, regra de negócio e campos vindo por prop. Cor,
fonte ou raio escritos dentro do componente amarram a peça ao primeiro cliente e
matam o reuso — que é a única razão de ela estar no acervo.

## Filtre pela stack do projeto

Se a stack já foi dita nesta conversa, **use sempre** — devolver uma peça Framer para
quem trabalha em Next.js gasta o tempo do usuário:

```bash
python "${SKILL_DIR}/scripts/buscar.py" "<consulta>" --stack nextjs
```

Quais stacks o acervo cobre, e quanto de cada uma, sai na linha `stacks:` do
`perfil.py`. Filtrar por uma stack que o acervo mal tem devolve nada e parece defeito
de busca — confira o perfil antes de concluir que "não existe".

Não interrogue a cada busca. Pergunte a stack só quando ela mudar o resultado de
verdade — tipicamente na primeira busca da conversa, ou quando o usuário trocar de
projeto. Para montar um site inteiro, quem pergunta é a `kit-montar`.

**Quando o usuário citar uma biblioteca que o perfil não lista** (é comum com Astro,
anime.js, magnetic.js), diga na hora, antes de buscar: as peças ainda servem como
referência de técnica, mas não colam prontas — vão precisar de porte à mão.

## As famílias

Quantas peças cada família tem sai no `perfil.py`. O que **não** muda é a natureza
de cada uma, e isso decide como a peça se usa:

- **receita** — composição de peças que já deu certo num projeto real. Ponto de
  partida.
- **template** — projeto de site completo e rodável, com rotas, componentes e build.
  Você **clona e adapta**, não constrói.
- **design-system** — identidade visual extraída de um site real: paleta com papel de
  cada cor, escala tipográfica, espaçamento, do's and don'ts, CSS custom properties.
  Não tem layout: dá o *como se parece*, não o *o quê*.
- **efeito** — código pronto. Wrapper WebGL que envolve HTML já existente (vidro,
  ASCII, partícula, glitch) ou objeto 3D. Você **copia**.
- **ui** — componente React pronto. Você **copia**.
- **animacao** — demo isolada de uma técnica: menu overlay, scroll com pin, transição
  de rota, reveal. Você **extrai a técnica**, não a página.
- **html** — página completa sem build. Abre direto no navegador.
- **mcp** — a ficha está no acervo, o **código não**: é gerado sob medida por um
  servidor MCP na hora (stack, styling, TypeScript, presets). Você **chama a
  ferramenta**.
- **prompt** — especificação em linguagem natural de uma página ou hero inteiro. Você
  **executa** para gerar o código. Flexível, custa tokens, resultado varia.

Ordem de preferência quando mais de uma serve: **receita → template → código
(efeito/ui/animacao) → prompt**. Prompt é o último porque re-gera tudo e o resultado
varia; template é o primeiro porque já roda.

### Catálogo servido por MCP — a ficha está aqui, o código vem de fora

Peças indexadas com `via: mcp:<fonte>` têm ficha no acervo e **código nenhum**.
Quando um resultado sai com essa marca, a busca já imprime a chamada pronta. Peça o
código com a stack do projeto — exemplo com o OriginKit, que é o caso mais comum:

```
get_component(name="fluidtrail", stack="nextjs", styling="tailwind", typescript=true)
```

`stack` aceita `framer` `react` `nextjs` `vite`; `styling` aceita `tailwind` `css`
`cssmodules`. Há ainda `preset` (variante nomeada) e `tweaks` (mapa de prop → valor,
que vence o preset). Sem nenhum dos dois, vem a configuração de preview padrão.

Três coisas que valem para todo componente do OriginKit:

1. **São autorados em Framer.** A conversão para Next.js funciona, mas deixa
   resíduo — shim de `RenderTarget`, JSDoc `@framerSupportedLayoutWidth`,
   `props: any`. Limpe antes de entregar; não é código nativo Next.
2. **Exige Tailwind CSS v4.** O próprio `agentInstructions` avisa, e também que os
   arquivos vão em `src/components/originkit` quando existe `src/`.
3. **`framer-motion` vs `motion`.** Parte usa um, parte usa o outro. Padronize num só
   no projeto — dois pacotes de animação no mesmo bundle é peso e conflito de graça.

Um catálogo externo só compensa onde o acervo tem **lacuna** — compare com
`perfil.py --funcao` antes de puxar. Onde os dois cobrem a mesma coisa, o acervo
vence: é seu, é julgado, não tem cota, e carrega as armadilhas que você já pagou.

### Motion Sites — catálogo de prompts, com cota apertada

Se o MCP estiver ligado, ele é a maior fonte de prompt de página pronta. A cota é o
que manda no uso. Ver
`${SKILL_DIR}/references/motionsites-genjutsu-designdna.md`.

| Ferramenta | Custo |
|---|---|
| `list_prompts`, `search_prompts`, `get_related_prompts` | **livre** |
| `get_prompt` | **3 no total**, em conta sem plano |

> **Nunca gaste `get_prompt` num prompt que já está no acervo.** Confira antes
> com `buscar.py "<título>" --familia prompt`. São 3 aberturas na vida da conta;
> queimar uma no que você já é dono é desperdício.

Duas coisas que valem sempre, e são de graça:

1. **Preview visual, para a peça que não tem.** O acervo agora guarda imagem das
   peças que **rodam sozinhas** — família `html`, e `animacao`/`template` com um
   `index.html` dentro. A busca imprime o caminho do `preview.png` quando existe, e
   o painel (`python "${SKILL_DIR}/scripts/painel.py" --abrir`) mostra a miniatura.
   Falta imagem de componente React solto, que precisaria de build; para esses, um
   `search_prompts` pelo título devolve o `preview_url`. Mostrar vale mais que
   descrever, principalmente com cliente na frente.
2. **`get_related_prompts`.** Você sabe quais dos seus prompts funcionaram. Peça os
   parecidos de um que deu certo e o catálogo inteiro vira extensão do acervo,
   sem cota.

Se acabar usando um prompt que **não** existe aqui, **ingira depois** — senão
gastou uma das 3 e não guardou.

### GetLayers — composição, vídeo e cena 3D original

Outro MCP, outra função. Leia
`${SKILL_DIR}/references/getlayers.md` antes de usar; `getlayers_start`
é chamada obrigatória e devolve o guia inteiro.

Ele tem **três coisas que um acervo de peças não tem por natureza**: composições
(esqueleto de layout com wireframe ASCII), backgrounds de vídeo, e autoria de cena
3D nova a partir de referência (`scene_lab`).

**`getlayers_compositions` é gratuito e resolve o pior vício de montagem.**
Consulte por papel (`hero`, `card-grid`, `cta`, `footer`…) antes de desenhar
qualquer seção nova — mesmo quando todas as peças vierem do acervo. O acervo guarda
peça pronta, mas **nenhum vocabulário abstrato de arranjo**; sem isso, seção nova
tende sempre à mesma pilha centralizada.

Fora esses três pontos, **o acervo vem primeiro**: é seu, é julgado, não tem
cota, e carrega as armadilhas que custaram projeto real (o `perfil.py` diz quantas).

Duas regras de operação que não podem ser esquecidas:

- **`getlayers_materialize` tem cota; buscar não tem.** Navegue à vontade,
  materialize com intenção. Nunca materialize para "dar uma olhada".
- **Mídia nunca vem no contexto.** Um template cujo `.glb` ou `.mp4` não foi
  baixado renderiza **em branco, sem erro**. Baixe antes de editar e confira o
  tamanho de cada arquivo — link expirado grava página de erro com nome `.mp4`.

E o conflito de stack: o ambiente nativo do GetLayers anima com `react-spring`,
o acervo é GSAP. Composição, paleta, fonte e background atravessam (são neutros
de biblioteca); motor de animação não.

### Buscar um design system

Três eixos funcionam bem:

```bash
# por caráter visual — é o que melhor funciona
python "${SKILL_DIR}/scripts/buscar.py" "creme quente editorial papel" --familia design-system

# por marca de referência (cada sistema lista marcas parecidas)
python "${SKILL_DIR}/scripts/buscar.py" "Aesop" --familia design-system

# por tema
python "${SKILL_DIR}/scripts/buscar.py" --tag tema-dark --setor fintech
```

Também dá para buscar por fonte (`Inter`, `Geist`, `SF Pro`) ou por hex da paleta.

**Cuidado com a concentração.** Todo acervo de design system vira aglomerado: os
sistemas são extraídos de sites reais, sites reais copiam uns aos outros, e o
resultado é uma dúzia de identidades quase intercambiáveis sob nomes diferentes. O
aglomerado mais comum é o editorial branco — parede branca, tipografia preta, acento
único ou nenhum, fotografia carregando toda a cor.

Ache os do **seu** acervo antes de recomendar:

```bash
python "${SKILL_DIR}/scripts/buscar.py" --listar tag
python "${SKILL_DIR}/scripts/cor.py" --vies
```

Tag com contagem muito alta é aglomerado; `cor.py --vies` mede o mesmo pelo lado da
cor e diz de quantos sistemas a sua escolha está chegando perto.

Duas consequências práticas:

- Para **escolher dentro** do aglomerado, o que diferencia não é o caráter (é o
  mesmo), é o **setor**, o **par tipográfico** e **qual é o acento único**. Filtre
  por `--setor` e leia as fontes, não a tagline.
- Para **fugir** dele, peça explicitamente o que ele não é: cor saturada,
  maximalismo, fundo escuro, dois ou mais acentos. Os sistemas que quebram o padrão
  do acervo são os de maior valor marginal — e são poucos, então vale saber quais
  são de cor: `cor.py --vies` lista os que fogem.

Cada arquivo em `acervo/design-systems/<id>/design-system.md` traz CSS custom
properties prontas, uma seção **Do's and Don'ts** e um **Agent Prompt Guide** com
exemplos de prompt por componente. Leia o arquivo antes de aplicar — o resumo no
índice é só a porta de entrada.

### Componentes por tipo

A família `ui` cresce rápido e vira o saco de gatos do acervo. Filtre por
`--estrutura`, e veja os valores que existem de verdade com
`buscar.py --listar estrutura`. Os que costumam aparecer:

| Estrutura | O que tem |
|---|---|
| `componente-ui` | primitivos: form, dialog, select, combobox, botões, abas, menus |
| `componente-animado` | widgets: dynamic island, product card, avatares, sliders |
| `animacao-texto` | formas de animar texto — typewriter, scramble, blur, stagger |
| `componente-ai` | interface de IA: chat, raciocínio, tool call, citação, orb de voz |
| `transicao-view` | transições WebGL entre rotas e estados |
| `infraestrutura` | tokens e libs base — pré-requisito, não componente |

**Sempre leia o `PRECISA JUNTO:`** que a busca imprime. Componente vindo de registro
(smoothui, shadcn) costuma puxar outros — colar sem a base quebra o import, e o erro
não diz que falta uma peça, diz que falta um módulo.

Quando a peça veio de um registro, a busca também imprime o `npx shadcn@latest
add ...` correspondente, caso instalar seja melhor que copiar.

### Buscar por técnica

Templates e animações são indexados também pelas técnicas que empregam. Isso abre um
eixo de busca que o resto do acervo não tem:

```bash
python "${SKILL_DIR}/scripts/buscar.py" --tag pin --tag scrub
python "${SKILL_DIR}/scripts/buscar.py" "transição de página" --familia animacao
python "${SKILL_DIR}/scripts/buscar.py" --tag shader --stack nextjs
```

Vocabulário disponível: `scrolltrigger`, `pin`, `scrub`, `split-text`, `flip`,
`observer`, `timeline`, `lenis`, `three`, `shader`, `canvas-2d`, `clip-path`, `mask`,
`mix-blend`, `sticky`, `page-transition`, `fisica`, `webgl-post`.

### Onde moram os assets de template

Templates e animações têm só o **código** no acervo. As imagens, vídeos e fontes
(835 MB no total) continuam no projeto original — o campo `projeto_origem` no
`item.json` diz onde. Ao usar uma dessas peças, avise que a mídia vem de lá e
normalmente será trocada por material do cliente.

## Lendo o resultado

Cada resultado traz `USAR:` e `EVITAR:`. **Leia os dois.** O `EVITAR` é o que impede
você de entregar uma peça que depende de cursor num projeto mobile-first, ou um
efeito de quebra de vidro num site de banco.

O marcador `*` é favorito. `~` é rascunho — incompleto, confira antes de prometer.

**`ARMADILHA:` vale mais que o resto da ficha.** É o que foi descoberto montando de
verdade — vídeo morto, contraste que reprova, bug de cleanup, reset que anula o
espaçamento. Cada uma diz de qual projeto veio. Leia antes de prometer a peça ao
usuário, e repasse a ele o que for relevante: são horas economizadas.

O aviso `[!] N assets externos que podem cair` significa que a peça referencia
imagens ou vídeos hospedados em `figma.site`, `cloudfront` ou similar. Eles podem
já ter expirado. Avise o usuário e troque por assets dele.

## O acervo dá a peça, não o critério

O acervo responde *"o que eu tenho pra isso"*. Ele não responde *"isso deveria
existir assim"*. Quando a escolha entre duas peças igualmente aderentes travar, ou
quando o usuário disser que está tudo "no automático", o critério está em
`${SKILL_DIR}/references/fundamentos-visuais.md` — as perguntas do §1, os cinco
níveis do §2 e os sete testes do §8.

O que mais aparece na prática, e é o risco direto de montar por busca: escolher
sempre a peça que **cabe na categoria** produz um site que poderia ser de qualquer
concorrente. É a mesma conformidade que a tag de contagem alta e o `cor.py --vies`
denunciam por outro caminho. Ao apresentar candidatos, diga qual deles **pertence
ao cliente** e qual apenas **pertence ao setor** — a diferença costuma decidir.

## Como apresentar ao usuário

Não despeje a saída bruta. Traga 2 a 4 candidatos, diga em uma linha por que cada um
serve **para o caso dele**, e faça uma recomendação. Se nada servir de verdade, diga
isso — inventar aderência gasta o tempo dele numa peça errada.

Se a busca não achar nada, tente termos mais amplos (o acervo é descrito em
português, mas os prompts internos são em inglês) e depois `--listar setor`.
