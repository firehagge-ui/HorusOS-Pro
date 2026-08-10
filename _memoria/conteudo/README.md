# Sistema de conteúdo da Horus — carrossel e post

> Criado em 03/08/2026, a partir da análise do repositório `opensquad`
> (github.com/renatoasse/opensquad, MIT). Mesma lógica de `_memoria/design/`:
> não é documentação bonita, é o que o Claude **lê antes de produzir** e
> **atualiza depois de cada correção**.

---

## Por que isso existe

`_memoria/design/` resolveu o site. Carrossel ficou sem nada equivalente: a skill
`/carrossel` sabia descrever **layout** (capa, solo, duo, número, citação) mas não
sabia descrever **narrativa**. Layout é como o slide parece. Narrativa é por que o
slide 4 existe e por que ele vem depois do 3.

Sem narrativa, todo carrossel sai com a mesma forma: capa, três dicas soltas, CTA.
Funciona uma vez. Na terceira semana o perfil inteiro parece a mesma peça repintada.

---

## De onde veio

O `opensquad` é um framework de orquestração multi-agente. **Não foi adotado** —
ele resolve um problema que a Horus já resolve com skill do Claude Code, e não
conhece CFO, CFP, `marca.md` nem `integridade.md`. Ver o veredito completo em
`_memoria/conteudo/91-o-que-veio-do-opensquad.md`.

O que foi extraído: os formatos narrativos, os pisos de legibilidade, os
antipadrões de copy e a ideia de porta de qualidade com condição de veto. Tudo
reescrito pro contexto daqui, não copiado.

---

## Os arquivos

| Arquivo | O que tem |
|---|---|
| `00-formatos.md` | Os sete formatos narrativos de carrossel. Escolher UM antes de escrever a primeira linha de copy |
| `10-legibilidade.md` | Os pisos duros: tamanho de fonte, contraste, dimensão, densidade de texto por slide |
| `90-antipadroes.md` | O que denuncia carrossel feito por IA. Cresce a cada correção do Marcelo |
| `91-o-que-veio-do-opensquad.md` | O que foi trazido, o que foi recusado e por quê. Pra não reabrir a discussão daqui a três meses |
| `99-checklist.md` | A porta antes de entregar: rubrica com nota e as condições que reprovam sozinhas |

---

## O gatilho

Regra no `CLAUDE.md` da raiz: antes de escrever a primeira linha de copy de
carrossel ou post, ler `00-formatos.md` e `90-antipadroes.md`. Antes de entregar,
rodar `99-checklist.md`.

Compliance de cliente regulado (CFO no Giovanni, CFP na Aion) **trava** e vem
antes de tudo que está aqui. Formato narrativo bom que exige depoimento ou
antes/depois simplesmente não é usado naquele cliente.
