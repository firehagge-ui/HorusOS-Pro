# Checklist de carrossel — a porta antes de entregar

> Rodar antes de mostrar qualquer peça pro Marcelo ou pro cliente. Mesma lógica
> do `/verificar`: se a conferência não rodou nesta mensagem, não dá pra dizer
> que passou.

---

## Parte 1 — Condições de veto

Qualquer uma sozinha reprova a peça. Não se pondera, não se compensa com nota
alta em outro lugar. Corrige e roda de novo.

- [ ] A capa começa com o nome da marca ou com "hoje vamos falar sobre"
- [ ] Existe afirmação factual central sem dado, sem fonte ou inventada
- [ ] Menos de 5 ou mais de 10 slides
- [ ] Legenda passa de 2.200 caracteres
- [ ] Texto cortado, estourado ou fonte no fallback em algum slide renderizado
- [ ] Todos os slides com o mesmo layout, sem variação
- [ ] Algum texto de leitura abaixo do piso de `10-legibilidade.md`
- [ ] **Compliance do cliente violado** (ver `90-antipadroes.md` §Compliance)

O último não é veto de qualidade, é trava. Em cliente regulado ele para a
entrega mesmo que todo o resto esteja nota 10.

---

## Parte 2 — Rubrica, nota de 1 a 10

Aprova com **média ≥ 7 e nenhum critério abaixo de 4**.

**C1. Para o scroll ⭐ (peso 1,5)**
Alguém que não conhece a marca pararia nessa capa?
9-10 parada garantida, fato ou tensão concreta · 7-8 gancho bom, dá pra afinar ·
5-6 só para quem já se interessa pelo tema · 3-4 genérico, não para ·
1-2 capa decorativa ou só logo.
**≤ 3 reprova sozinho.**

**C2. Integridade do dado**
Toda afirmação factual tem número específico ou fonte identificável? Placeholder
`[FALTA: ...]` conta como honesto, texto plausível inventado é nota 1.

**C3. Coerência narrativa**
Cada slide é consequência do anterior? Se dá pra embaralhar os slides sem perder
sentido, é 3 ou menos.

**C4. Reflexão**
O penúltimo slide de conteúdo entrega algo que incomoda ou reposiciona, ou só
informa mais uma vez?

**C5. CTA específico**
O CTA cita o conteúdo e diz o próximo passo, ou é "nos siga"?

**C6. Voz da marca**
Lê como o cliente falaria, ou poderia ser de qualquer marca do segmento?
Confere contra `clientes/<nome>/marca.md` e `_memoria/preferencias.md`.

**V1. Consistência visual**
Qualquer slide, solto, é reconhecível como parte deste carrossel?

**V2. Legibilidade**
Pisos de fonte respeitados e contraste 4,5:1 em todos os slides.

**V3. Impacto visual**
Tem energia e identidade, ou é template morno?

---

## Parte 3 — Técnico

- [ ] Todos os slides na mesma dimensão, 1080 × 1350
- [ ] Entre 2 e 10 imagens (limite da API do Instagram)
- [ ] PNG ou JPEG, abaixo de 30MB por arquivo
- [ ] Slide 1 foi renderizado e **olhado** antes do lote
- [ ] HTML autocontido, sem dependência externa além de Google Fonts
- [ ] Nenhum tracinho como separador na copy nem na legenda
- [ ] Primeiros 125 caracteres da legenda funcionam sozinhos como gancho
- [ ] 5 a 15 hashtags, misturando nicho, médio alcance e amplo
- [ ] `legenda.md` gerada e salva na pasta da peça

---

## Parte 4 — Como reportar

Não dizer "está pronto". Dizer o que passou, com o que sobrou:

> Formato: Lista, 8 slides. Rubrica: média 7,8, menor nota 6 (C5, CTA).
> Vetos: nenhum. Pendente: `[FALTA: telefone ativo]` no slide 8.

Pendência declarada é profissional. Pendência escondida atrás de "está pronto"
quebra confiança.
