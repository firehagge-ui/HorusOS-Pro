# Post #1 — Xeque-Mate + Frankl

> Carrossel de estreia de `@universpsiquee`. Tema definido por ela; roteiro,
> verificação e legenda pela Horus.
> Formato: **Tese, 8 slides** (`_memoria/conteudo/00-formatos.md`).
> Modo visual: **claro / papel de galeria** (`marca.md`).

## Histórico de versões

- **v1:** 9 slides, aprovado no conteúdo pela Mayara.
- **v2:** reduzido a 7 (fundiu lenda+porquê e ciência+movimento).
- **v3:** de volta a 9, copy revisada (cada slide deixa gancho para o próximo).
- **v3.1:** slide 4 refeito. Era meta-comentário sobre a lenda; virou a **ponte** da
  pintura para a vida de quem lê ("Fora do quadro").
- **v3.2:** slide de **ciência removido** a pedido do Marcelo. **8 slides**, é a
  versão no ar. Fundos realocados para manter a alternância. O `build.js` gera esta.

⚠️ Consequência assumida do v3.2: o carrossel perde a perna isolada de "ciência". O
que resta de clínico está diluído no slide do movimento ("os dados reais", "leitura
automática", "o que se treina na terapia"). Se um dia quiser a ciência de volta sem
somar slide, o caminho é fundir a linha "não é fraqueza, o medo estreita o foco" na
abertura do slide do movimento.

---

## Ficha técnica da obra (verificada)

- **Autor:** Friedrich August Moritz Retzsch (1779–1857), pintor e gravador alemão
- **Obra:** *Die Schachspieler* ("Os Jogadores de Xadrez"), conhecida como
  **"Xeque-Mate"**. Fausto joga xadrez contra Mefistófeles apostando a alma
- **Data:** **século XIX.** ⚠️ **Não cravar ano** (fontes divergem: 1799, 1822, 1831;
  a Wikimedia cataloga como "19Jh"). Sempre "séc. XIX" ou "há quase dois séculos"
- **Fonte da imagem:** acervo digital do **Metropolitan Museum**, versão em cor,
  **domínio público** (autor morto em 1857)
- **A lenda:** o campeão **Paul Morphy** teria olhado uma cópia e dito que venceria
  pelo rapaz. Sem comprovação. **Contar como lenda, sempre**
- **Fato bônus** (na legenda, não nos slides): a cena de xadrez **não existe no
  Fausto de Goethe** — Retzsch inventou a imagem

---

## Roteiro slide a slide (v3.2, o que está renderizado)

Cabeçalho em todos: `Mayara Barros · @universpsiquee · CRP 03/36219`.
Rodapé: *Ciência com afeto*. Sem contador de slide.

1. **CAPA** (obra emoldurada, creme) — "Ainda há uma jogada." / sub "Mesmo quando o
   tabuleiro diz xeque-mate."
2. **A OBRA** (split, recorte do rapaz, cream2) — "Há quase dois séculos, este homem
   está em *xeque-mate*." / "Ele apostou a própria alma numa partida contra o diabo.
   E perdeu. Pelo menos é o que parece." / ficha: Moritz Retzsch · Os Jogadores de
   Xadrez · séc. XIX
3. **A LENDA** (escuro) — eyebrow "A história que não morre" / "Então um enxadrista
   olhou a tela e disse: *o rei ainda tem uma jogada*." / "Provavelmente nunca
   aconteceu. Mas a lenda atravessou gerações."
4. **DO QUADRO PARA A VIDA** (a ponte, creme) — eyebrow "Fora do quadro" / "Todo
   mundo já sentou nesse lado do *tabuleiro*." / "Aquele em que a partida parece
   perdida e não há mais o que fazer. E é justo no aperto que a saída fica mais
   difícil de enxergar."
5. **O MOVIMENTO** (cream2) — eyebrow "O movimento" / "O que vira o jogo é voltar a
   olhar o *tabuleiro*." / "Não a versão que o medo conta, os dados reais da partida.
   Trocar a leitura automática pela observação do que está de fato ali é parte do que
   se treina na terapia."
6. **FRANKL** (creme) — eyebrow "Quem já esteve no pior tabuleiro" / "Viktor Frankl
   achou uma jogada onde não havia nenhuma." / "Sobrevivente de um campo de
   concentração, escreveu que, quando não se pode mudar a situação, ainda resta
   escolher a atitude diante dela." / ficha: Viktor Frankl · Em Busca de Sentido · 1946
7. **REFLEXÃO** (escuro, Nietzsche) — "*Quem tem um porquê para viver suporta quase
   todo como.*" / "A frase é de Nietzsche, e Frankl a repetia. Ter um sentido não
   tira o peso do tabuleiro. Ele devolve a pergunta que o medo calou: qual é a sua
   próxima jogada?"
8. **CTA** (creme) — eyebrow "Antes de desistir do jogo" / "Se hoje parece
   xeque-mate, talvez seja só a hora de olhar de novo." / "Com menos medo e mais
   presença. Salva este post para quando o jogo apertar." / faixa de crise: "Se o
   peso estiver grande demais para carregar sozinho, o CVV atende de graça, 24 horas,
   no 188." / assinatura: Ciência com afeto · Mayara Barros · CRP 03/36219

**Fundo alternado:** 1 creme · 2 cream2 · 3 escuro · 4 creme · 5 cream2 · 6 creme ·
7 escuro · 8 creme. Nunca dois iguais seguidos.

**Por que a copy funciona:**
- Capa para o scroll com tensão, não anuncia o tema
- A anedota entra como lenda ("provavelmente nunca aconteceu"), nunca como fato
- O slide 4 é a virada da arte para a vida de quem lê (o que faltava no v3)
- O Nietzsche mantém o "quase" do original: sem ele viraria promessa, vedada pelo CFP
- Slide 7 é reflexão (a pergunta), não mais informação: é o que decide salvamento
- CVV 188 porque o tema encosta em desesperança
- Uma ideia por slide, e cada slide deixa gancho para o próximo

---

## Legenda (Instagram + Facebook)

Salva em `post-01-xeque-mate/legenda.md`. ~1.760 caracteres, sem link, sem travessão,
gancho nos primeiros 125.

---

## Arte renderizada

8 PNGs em `post-01-xeque-mate/slides/`, 1080×1350, ~2,8 MB no total. Estilo
**Galeria, modo claro**. Gerador: `build.js` (fonte única) → Chrome headless.
Fontes: **Cormorant Garamond**, **EB Garamond**, **Jost** — nenhuma na lista de
antipadrões.

- ✅ Slides revisados conferidos no render v3.2 (4 ponte, 5 movimento, 6 Frankl)
- ✅ Obra do acervo do Metropolitan Museum, domínio público, versão em cor
- ✅ Cabeçalho com CRP + fecho "Ciência com afeto" + CVV 188 (slide 8)

---

## Conferência (`99-checklist.md`)

**Vetos:** nenhum. Capa não anuncia · sem dado inventado (data "séc. XIX", lenda dita
como lenda) · 8 slides (entre 5 e 10) · legenda < 2.200 · compliance CFP ok (sem
promessa, sem depoimento, sem autoteste, CRP visível, CVV presente).

**Rubrica estimada:** ~8,6. Reflexão no slide 7, CTA cita "xeque-mate".

**Pendências antes de publicar (só a cliente resolve):**
- [ ] Mayara valida a copy final (8 slides)
- [ ] Mayara aprova a anedota do enxadrista **como lenda** (está assim)
- [ ] e-Psi, se anexar CTA de atendimento online em story de apoio
