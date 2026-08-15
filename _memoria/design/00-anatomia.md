# A anatomia de um site que funciona

> O que separa site profissional de site bonito: o profissional foi montado na
> ordem em que a pessoa decide, não na ordem em que a empresa gosta de se
> apresentar.

---

## Antes do HTML: o passe duplo

> Incorporado da skill `frontend-design` da Anthropic em 28/07/2026. É o passo
> mais barato do sistema inteiro e o que mais evita rodada de correção.

O erro caro não é escrever HTML ruim, é escrever HTML bom de um plano genérico.
Corrigir depois custa o site inteiro; corrigir o plano custa dez minutos. Por isso
o trabalho tem **dois passes**, e o código só começa no segundo.

### Passe 1: escrever o plano, em meia página

```
COR        4 a 6 hex, cada um com nome e função
TIPO       display, corpo, e uma utilitária pra legenda ou dado
LAYOUT     uma frase por seção + wireframe em ASCII
ASSINATURA a UMA coisa que essa página vai ter e nenhuma concorrente tem
```

Wireframe em ASCII é de propósito: obriga a decidir proporção e ordem antes de ter
CSS pra esconder a indecisão.

### Passe 2: atacar o próprio plano antes de codar

Uma pergunta só, e ela é desconfortável:

> **Eu chegaria nesse mesmo plano se o briefing fosse de qualquer outro cliente
> desse segmento?**

Se a resposta for sim, o plano não foi escolhido, foi alcançado por reflexo.
Reescrever a parte genérica e **anotar o que mudou e por quê**. Só depois abrir o
editor, e então seguir o plano revisado à risca, tirando cada cor e cada tamanho
dele.

O caso que originou a regra: na Aion, o plano teria saído "creme, serifa,
terracota, acolhedor" e a pergunta teria devolvido *"sim, eu faria isso pra
qualquer psicóloga do Brasil"*. A correção saiu depois de quatro páginas prontas.
Custava dez minutos antes.

### O elemento-assinatura

Toda página tem direito a **uma** ousadia, e só uma. Todo o resto fica quieto e
disciplinado em volta dela.

Não é o mesmo que variedade. Variedade evita monotonia (por isso existe a regra de
4 famílias de layout). Assinatura evita a página com cinco boas ideias e nenhuma
que gruda. As duas regras convivem: composição variada, ousadia concentrada.

Um teste útil quando há mais de uma versão na mesa: **qual delas tem assinatura, e
qual só tem seções bonitas?** A que não tem assinatura não é a versão segura, é a
esquecível.

A regra da Chanel serve inteira: antes de sair de casa, olhe no espelho e tire um
acessório. Se nada foi cortado no fim, provavelmente nada foi escolhido no começo.

---

## A regra que organiza tudo

A empresa quer falar de si. A pessoa quer resolver um problema. Um site que
funciona **fala do problema da pessoa primeiro e da empresa depois**.

O erro mais comum e mais caro: pular direto de "quem somos" para "o que
vendemos", sem nunca dizer para quem aquilo serve. A pessoa que não se reconhece
não continua lendo, por melhor que seja o design.

---

## A ordem que funciona

### 1. Hero
**Trabalho:** responder em três segundos o que é, para quem, e o que fazer agora.

- Promessa curta. Máximo 2 linhas de título, subtexto de até 20 palavras.
- **Prova imediata** ao lado da promessa: anos de casa, registro profissional,
  número real. Sem isso o hero é só afirmação.
- Um CTA primário, no máximo um secundário.
- Uma imagem real. Hero de texto sobre gradiente é hero inacabado.
- Tem que caber na tela sem rolar. Se não cabe, o problema é a escala da fonte,
  não o tamanho da regra.

### 2. Para quem é / Quando procurar
**Trabalho:** fazer a pessoa se reconhecer antes de entender o serviço.

É o bloco de maior impacto e o mais esquecido. Regras:

- Escrito em **segunda pessoa**, situação concreta, não categoria abstrata.
  "Você convive há anos com algo que pesa" funciona; "adultos com sofrimento
  psíquico" não.
- **Coluna única.** Grid de ícone + texto em 2x3 é o formato mais genérico que
  existe. O ícone de 22px ao lado de cada frase não informa nada.
- Termo-chave destacado dentro da frase, mesmo peso, cor de acento. Não negrito.
- **Melhor ainda:** cada situação vira link para o serviço que a atende. Aí a
  seção deixa de ser empatia decorativa e vira encaminhamento.
- Em setor regulado, fechar com a ressalva de que reconhecer-se não é diagnóstico.

### 3. O que fazemos
**Trabalho:** dizer o que existe, com contexto suficiente para escolher.

- Card sem descrição obriga a pessoa a clicar para descobrir o básico. Uma linha
  por serviço resolve.
- Se são mais de 6, agrupar. Lista longa pede outro componente, não lista maior.

### 4. Como começa
**Trabalho:** tirar o medo do primeiro contato.

Três passos numerados, com o que acontece em cada um. É o antídoto da ansiedade
de quem nunca contratou aquele serviço, e por isso rende mais em saúde, direito e
consultoria do que em produto. Dizer explicitamente o que **não** é exigido no
primeiro passo ("não precisa detalhar", "sem compromisso") vale mais que a
descrição do passo em si.

### 5. Quem atende / Quem faz
**Trabalho:** transformar empresa em pessoas.

Foto real, nome, registro profissional quando existe, formação em uma frase.
Foto de banco de imagem aqui destrói mais confiança do que a ausência de foto.

### 6. Como é / Onde é
**Trabalho:** reduzir o desconhecido.

Espaço, ambiente, materiais. Em serviço presencial isso vale muito: a pessoa
quer saber onde vai pisar.

### 7. FAQ
**Trabalho:** responder o que a pessoa tem vergonha de perguntar.

- As boas perguntas são as constrangedoras: preço, prazo, o que acontece se não
  der certo, se funciona online.
- FAQ curto é FAQ inútil. Oito a dez perguntas é o normal em serviço.
- Acordeão nativo (`<details>`), sem biblioteca.

### 8. Contato e localização
**Trabalho:** eliminar o atrito final.

Mapa quando é presencial, dados em lista escaneável, um caminho de contato
óbvio. Se o formulário não tem servidor, avisar em vez de fingir que enviou.

---

## Dois princípios que atravessam as seções

Não são um slot na ordem de 1 a 8: valem em qualquer seção que precise convencer.

### Encenar a prova, não afirmá-la

Qualidade dita é adjetivo; qualidade **mostrada** é prova. Em vez de escrever
"atendimento de excelência", "engenharia de precisão", "café selecionado", o site que
convence **mostra o mecanismo** e deixa o visitante concluir sozinho — conclusão
própria convence mais que afirmação alheia.

O adjetivo é barato e reversível: "qualidade superior" cabe no site de qualquer
concorrente sem trocar uma palavra (o teste do `90-antipadroes.md`). O mecanismo
visível, não: ver as peças de um produto se separarem com o peso de cada uma, ver o
processo em etapas, ver a estrutura que o concorrente esconde — isso é verificável de
olho, e o leitor fecha a conta sozinho.

Como se aplica, por segmento (é de propósito que não é um só):
- **Giovanni:** as etapas do implante mostradas passo a passo, no lugar de "tratamento
  de excelência".
- **Aion:** o que de fato acontece numa avaliação neuropsicológica, etapa a etapa, no
  lugar de "profissionais qualificados".
- **Grão da Serra:** o beneficiamento (escolha do grão → pilagem → secagem → torra →
  moagem), que prova o "a gente não planta, a gente escolhe" sem lavoura.
- **Permita-se:** um trecho real de uma aula, no lugar de "aulas dinâmicas".

Duas travas:
- **Só se encena o que existe.** O poder vem do dado/processo real; encenar sem
  substância (tabela de specs sem número medido, etapas inventadas) é estética de ficha
  técnica vazia, e num cliente de saúde ou alimento vira alegação falsa (`integridade.md`).
- **Em regulado, encenar ≠ prometer.** Mostrar o processo é informativo; mostrar
  resultado garantido ou antes/depois é vedado (CFO/CFP).

→ *Origem: convergência de 4 teardowns independentes (WRK, Linearity, HydraDB, For
Living) + o "caminho do café" do Arbor, 14/08/2026. Ver `referencias/`.*

### Vender o freio

A maior objeção que o visitante já tem sobre a categoria vira o **maior argumento**,
dita na cara em vez de escondida.

A objeção não some por ser ignorada — ela já está na cabeça de quem lê, sem resposta.
Nomeá-la e reenquadrá-la desarma a desconfiança que trava o contato. É o oposto de
maquiar: é entregar a parte "chata" de propósito e mostrar que ela é, na verdade, o
cuidado.

O exemplo de ouro é da própria casa. A **revisão humana de compliance** hoje é regra
cumprida em silêncio ("conteúdo clínico não publica sem o profissional responsável").
Reenquadrada, é venda: *"toda peça sobre o seu tratamento passa pelo profissional antes
de ir ao ar"* — o freio que parecia burocracia vira prova de responsabilidade. Vale pro
Giovanni, Aion, Mayara, e pra própria Horus vendendo o serviço. Outro caso: o Grão
transforma a ausência de lavoura (que soaria fraqueza) em diferencial ("a gente não
planta, a gente escolhe").

Trava: reenquadrar honestamente, nunca girar mentira. O freio tem que ser real.

→ *Origem: Cofounder (SaaS de IA, que responde o medo de "perder o controle pra IA" com
"nada é publicado sem sua aprovação"), 14/08/2026. Ver `referencias/cofounder.md`.*

---

## O que quase sempre sobra

- Seção "nossos valores" com três palavras genéricas
- Números inventados para parecer preciso
- Depoimento genérico sem nome e sem contexto
- Duas seções dizendo a mesma coisa com palavras diferentes

## O que quase sempre falta

- O bloco 2 (para quem é)
- O bloco 4 (como começa)
- Descrição nos cards de serviço
- Imagem de compartilhamento, então o link no WhatsApp abre cinza
- Política de privacidade, quando existe formulário

---

## Ritmo visual

Um site com 8 seções precisa de pelo menos **4 famílias de layout diferentes**.
Se "quem somos", "serviços" e "equipe" são todos grid de três colunas, a página
tem uma seção só repetida três vezes.

Alternar fundo a cada seção (claro, médio, claro, médio) resolve metade do
problema de ritmo sem custo nenhum.

E o teto de "eyebrow", aquele rótulo miúdo em caixa alta acima do título:
**um a cada três seções**. Colocar em todas é o que cria o ritmo de template.
