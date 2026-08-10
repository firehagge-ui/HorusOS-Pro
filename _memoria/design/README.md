# Sistema de design da Horus

> Criado em 26/07/2026. Este é o lugar onde o conhecimento de site da agência
> mora e cresce. Não é documentação bonita: é o que o Claude **lê antes de
> construir** e o que ele **atualiza depois de cada correção**.

---

## Por que isso existe

O Claude não guarda nada entre conversas. Cada sessão começa do zero, com o
conhecimento genérico do treinamento e mais nada. Isso tem uma consequência
prática dura:

**Ensinar o Claude no chat não ensina nada. Só o que está em arquivo persiste.**

Quando o Marcelo corrige alguma coisa e a correção morre no chat, o mesmo erro
volta no próximo site. Quando a correção vira uma linha aqui, ela não volta mais.
É a diferença entre um estagiário que anota e um que não anota.

O segundo motivo é mais sutil. Regra genérica gera site genérico. "Use bom
espaçamento" não muda nada. O que muda é **exemplo real estudado**: quando existe
um teardown do site X dizendo como ele resolveu a seção de depoimento e por que
aquilo funciona, a decisão deixa de sair do viés médio do modelo e passa a sair
de uma referência concreta. Por isso a pasta `referencias/` importa mais que
qualquer regra abstrata daqui.

---

## As cinco peças

**1. Conhecimento** (esta pasta)
O que a agência sabe sobre site, organizado por assunto. Cresce devagar e por
motivo: cada linha aqui existe porque algo deu errado ou deu muito certo uma vez.

**2. Referências** (`referencias/`)
Teardowns de sites reais. É o acervo de estudo. Um teardown vale mais que dez
regras, porque carrega contexto: que segmento, que público, que decisão, por quê.
A skill `/estudar-site` gera um teardown a partir de uma URL.

**3. Gatilho de leitura** (regra no `CLAUDE.md` da raiz)
De nada adianta o conhecimento existir se não for lido. A regra obriga a leitura
antes de qualquer trabalho de site, e a passagem pelo checklist antes de entregar.

**4. Ciclo de correção**
Toda vez que o Marcelo corrige algo de design, a correção vira linha em
`90-antipadroes.md` ou no arquivo do assunto, **com o porquê junto**. Sem o
porquê, a regra vira superstição e é aplicada onde não devia.

**5. Detector automático** (desde 28/07/2026)
As peças 1 a 4 dependem de o Claude **lembrar** de abrir o arquivo. Se não abrir,
a regra existe e não acontece nada. O detector não depende disso: é um programa,
roda e aponta arquivo e linha.

```
npx --yes impeccable@3.5.0 detect "clientes/<nome>/site"
```

Vem do projeto `impeccable` (github.com/pbakaus/impeccable, Apache 2.0). Até
07/08/2026 a Horus usava **só o detector**, via `npx`. Em 08/08/2026 o pacote
**completo** foi instalado: a skill com 23 comandos, os 4 agentes e os dois hooks.
A colisão original (o `DESIGN.md` e o `PRODUCT.md` dele batiam com `marca.md` e
`briefing.md`) foi **resolvida** com a regra de contexto por cliente, não ignorada:
detalhe na seção "Impeccable" do `CLAUDE.md` da raiz. Mesmo com o pacote inteiro, o
detector segue sendo a peça de lei aqui, e o impeccable não conhece compliance de
CFO nem de CFP, então **o compliance do cliente vence o impeccable**. Exceções do
detector ficam em `.impeccable/config.json`, versionado pra que o motivo de cada uma
fique visível.

É a diferença entre regra e lei. As quatro primeiras peças são regra. Essa é lei.

---

## Os arquivos

| Arquivo | O que tem |
|---|---|
| `00-anatomia.md` | O passe duplo antes do HTML, o elemento-assinatura, e a estrutura de um site que funciona, seção por seção |
| `50-copy-de-interface.md` | Botão, rótulo, erro, tela vazia, confirmação. O texto pequeno que faz a coisa funcionar |
| `90-antipadroes.md` | Catálogo dos "tells". Cresce a cada correção. Traz o mapa entre as regras do detector e as seções daqui |
| `91-onde-estudar.md` | As fontes de estudo, e o que cada uma serve |
| `99-checklist.md` | O que rodar antes de escrever a primeira linha e antes de entregar, incluindo a tabela de contraste medida da paleta terrosa |

Tipografia, cor e layout **não têm arquivo próprio**: moram dentro de
`90-antipadroes.md`, organizados por seção, porque cada regra ali nasceu de um erro
concreto e não de teoria. Se um assunto crescer a ponto de pedir arquivo próprio,
ele sai de lá, e esta tabela é atualizada junto.

---

## Como isso melhora

Três hábitos, e nenhum depende de o modelo ficar mais esperto:

1. **Antes de cada site novo**, estudar de 3 a 5 concorrentes reais do segmento
   daquele cliente com a `/estudar-site`. Referência do mercado do cliente ensina
   mais que galeria de Awwwards, porque carrega o que o público daquele nicho
   espera encontrar.
2. **Depois de cada entrega**, escrever o que o cliente corrigiu e por quê.
3. **De tempos em tempos**, um teardown de um site excelente fora do segmento, só
   para não ficar sempre copiando a média do nicho.

O sinal de que está funcionando: a quantidade de correção por entrega cai, e as
que sobram são de gosto do cliente, não de erro previsível. Agora tem um segundo
sinal, e esse é número: **o detector sai limpo antes da primeira leitura humana.**

**Este é o placar oficial do detector.** Outras menções ao histórico (em
`_memoria/empresa.md` e nos `CLAUDE.md` de cliente) apontam pra cá em vez de repetir
o número, que é como ele acabou com três valores diferentes espalhados.

| Quando | Aion | Giovanni | Grão da Serra |
|---|---|---|---|
| 28/07, detector recém-plugado | 57 | 97 | — |
| 28/07, depois da rodada de correção | 11 | 97 | — |
| **10/08/2026, medido em auditoria** | **1** | **26** | **0** |

Leitura da última linha (a que vale hoje):

- **Aion = 1.** Sobrou o `transition: padding-left` em `assets/site.css`, a entrada
  `layout-transition` ainda aberta em `90-antipadroes.md`. Todo o resto da rodada de
  28/07 (contraste, texto miúdo, eyebrow, escala achatada) foi corrigido.
- **Giovanni = 26** (era 97). Ninguém tocou no material dele, que está fora da linha
  de frente: a maior parte da queda é falso positivo de `flat-type-hierarchy` da
  versão 3.4.0 do detector, corrigido na 3.5.0 (ver `/verificar`). O que sobra deve
  evaporar quando uma das quatro versões de home for escolhida e as outras arquivadas.
- **Grão da Serra = 0.** O site mais recente, saiu limpo. É o sinal mais forte de que
  o sistema está funcionando: a memória de antipadrões nascida na Aion evitou o erro
  antes dele acontecer.
