---
name: comparar
description: Compara a perspectiva de duas ou mais mentes (Hormozi, Cole Gordon, Jeremy Miner, Jeremy Haynes, G4, Full Sales System, The Scalable Company) sobre a mesma pergunta, mostrando onde convergem e onde brigam, sem sintetizar. Use quando o Marcelo disser "/comparar", "/compare", "o que cada um diria", "quero ver os dois pontos de vista".
---

# Comparar

Duas ou mais mentes, a mesma pergunta, **sem síntese**. A graça está na
divergência: se as duas dizem a mesma coisa, você aprendeu pouco.

Mentes em `_conselho/mentes/`.

## Uso

```
/comparar hormozi,cole "vender por projeto fechado ou mensalidade?"
/comparar haynes,g4 "qual canal para clínica de bairro em Salvador?"
/comparar hormozi,fss "quanto cobrar pela Máquina completa?"
```

## Formato

```
PERGUNTA: {a pergunta}

═══ {MENTE 1} ═══
POSIÇÃO: {o que ela diria, na voz dela}
BASE: ^[mentes/{arquivo}:{seção}] "{doutrina que sustenta}"
NÚMERO QUE ELA USA: {se houver, com origem}

═══ {MENTE 2} ═══
POSIÇÃO: ...
BASE: ...
NÚMERO QUE ELA USA: ...

═══ CONVERGÊNCIA ═══
• {no que concordam, e por que isso é forte: duas escolas diferentes
   chegando no mesmo lugar é sinal}

═══ DIVERGÊNCIA ═══
• {tema}: {mente 1} diz X porque {razão} · {mente 2} diz Y porque {razão}
  Natureza: {contexto diferente / valor diferente / dado diferente}
  O que decide entre as duas: {qual informação resolveria}

═══ CALIBRAÇÃO BR ═══
{o que o Full Sales System diria sobre esses números sobreviverem aqui}

═══ TRAVA DE COMPLIANCE ═══
{o que cai por norma, se o caso for de cliente regulado}
```

## Regras

- **Não sintetizar.** Comparar mostra o mapa; quem decide é o Marcelo, ou o
  `/conselho` se a decisão for pesada
- Não forçar divergência onde não existe. Se convergem, dizer que convergem e
  apontar onde ainda assim se diferenciam na ênfase
- Cada posição citada da doutrina, nunca inventada. Se a mente não fala do tema,
  declarar: "não tenho posição dele sobre isso"
- Quando a divergência for por **contexto** (operação americana grande contra
  agência pequena em Salvador), dizer isso explicitamente: é a divergência mais
  frequente e a mais fácil de ler errado
