# Teardown: Fiomet — home como seletor de produto

- **URL:** https://fiomet.com/
- **Segmento:** Dispositivos médicos / hardware de saúde (vestível esportivo que
  monitora performance + órtese craniana infantil). Marca-guarda-chuva com dois
  produtos muito diferentes sob o mesmo nome.
- **Estudado em:** 14/08/2026
- **Nota:** 7/10 (como peça de contenção e primeira impressão; como site de negócio
  que precisa converter ou explicar, é deliberadamente incompleto — ver abaixo)
- **Contexto:** estudado para a biblioteca da agência como caso extremo de
  **quanto um site consegue NÃO dizer**. Não é concorrente de nenhum cliente atual;
  o valor é a disciplina de contenção e a arquitetura de "escolha primeiro, explico
  depois".

> ⚠️ **Nota de integridade sobre a coleta.** O `branding` do Firecrawl reportou
> `colorScheme: light` e fundo `#FFFFFF`. **O print desmente:** a home é carvão
> quase preto com acento amarelo puro. Onde branding e print brigam, o print vence
> para o visual. Trato o fundo claro do branding como leitura errada (provavelmente
> pegou CSS de uma subpágina ou default), não como fato. Fonte `Exo` e acento
> `#FFFF00` batem com o print e ficam como **medidos**; o resto do visual abaixo é
> **aparente** (lido do print, não do CSS).

---

## Estrutura, na ordem

O site inteiro (a home) é **uma tela só**, sem rolagem de conteúdo. Não há dobra 2,
3, 4. A "estrutura" é a de um menu de seleção, não a de uma landing page:

1. **Nav mínima no topo:** `SmartRAP · PPOD · About` (três itens, sem logo-palavra
   grande, sem CTA de nav).
2. **Rótulo-instrução centralizado:** `CHOOSE A PRODUCT`, caixa alta, espaçado,
   cinza baixo contraste. É o único texto que dá ordem ao usuário.
3. **Palco central:** render 3D grande do produto ativo (o vestível SmartRAP, um
   cilindro/manga preta) dentro de um **anel fino amarelo**. O nome do produto
   (`SMARTRAP`, wordmark stencil amarelo) fica **sobreposto ao próprio produto**.
4. **Botão `SELECT`** (pílula, contorno amarelo, fundo transparente) logo abaixo do
   nome — a única ação real da tela.
5. **Uma frase** de descrição do produto, embaixo, cinza, duas linhas.
6. **Preview do próximo produto** num círculo menor à direita (o PPOD, órtese branca)
   — sinaliza que há mais de um, e convida a girar o carrossel.
7. **Três bolinhas de carrossel** (produto 1, produto 2, e um terceiro `Coming Soon`).
8. **Rodapé** (no markdown, não na dobra visível): © Fiomet LLC 2025, Careers,
   Contact, Privacy, Terms, twitter. Contato é `mailto:` puro, sem formulário.
9. **Faixa de cookies** com `Accept` + `More info`.

Comparando com `_memoria/design/00-anatomia.md`: **quase tudo o que a anatomia pede,
este site omite de propósito.** Não tem hero com promessa+prova+CTA articulados
(tem produto+nome+select), não tem bloco "para quem é", não tem prova, preço,
FAQ, nem fechamento. O elemento-assinatura é o **anel amarelo girando com o
produto renderizado dentro** — e a página aposta tudo nele. É um átrio, não um
argumento: a decisão que ele força é só "qual dos dois mundos você quer entrar".

---

## O que copiar

Uma decisão por subtítulo. Mecanismo, não elogio.

### A home como bifurcação, não como discurso

Quando uma marca vende **dois produtos que não compartilham público** (atleta que
quer performance × mãe de bebê que precisa de órtese craniana), a home não tenta
falar com os dois ao mesmo tempo. Ela pergunta `CHOOSE A PRODUCT` e joga a pessoa
para o trilho certo antes de qualquer copy de venda.

**Por que funciona:** uma home única que tente servir dois públicos opostos dilui
os dois. Transformar a home num **seletor** resolve o conflito de audiência na
porta — cada um só vê a mensagem que é dele depois do `SELECT`. É o mesmo problema
que a raiz deste repo tem (cinco clientes, cinco marcas), resolvido no nível de UI.

⚠️ Só compensa quando os produtos/públicos são **genuinamente disjuntos**. Para um
cliente de produto único, isso vira só um clique a mais antes do conteúdo.

### Contenção radical: uma frase por produto

Cada produto ganha **uma sentença**, não um parágrafo:

> "A smart garment for athletes to monitor performance, maximize results and reduce
> leg injuries during exercise."

> "A cranial orthosis device to improve cranial symmetry and/or shape in infants
> from 4 to 18 months."

**Por que funciona:** é a estrutura clássica *o quê + para quem + para quê* comprimida
ao osso — categoria do produto, público explícito ("athletes", "infants from 4 to
18 months"), e benefício. Diz o suficiente para a pessoa se reconhecer e clicar, e
nada além disso. A segunda frase, num setor médico, é um modelo de sobriedade:
descreve função e faixa etária, **sem prometer cura nem resultado** — exatamente o
registro que os clientes regulados da Horus (CFO, CFP) precisam.

### O produto renderizado É o hero

Não há foto de estilo de vida, não há pessoa, não há headline emocional. O palco é
ocupado pelo **objeto** — render 3D limpo, girando dentro do anel. O nome fica
sobre ele.

**Por que funciona:** para hardware com forma própria e reconhecível, o produto
carrega a página sozinho; qualquer copy competiria com ele. E evita o buraco de
"foto de banco" — não há imagem falseável porque o objeto é o real modelado.
Transferível para qualquer marca cujo diferencial é um objeto físico bonito.

### Um único acento, usado como semáforo

O amarelo (`#FFFF00`, medido) aparece **só** onde há ação ou identidade: o anel do
produto ativo, o wordmark, e o contorno do `SELECT`. Todo o resto é escala de
cinza sobre carvão.

**Por que funciona:** com um só acento e ele reservado à ação, o olho vai direto
ao que clicar. O anel amarelo também diferencia o produto **ativo** do preview
(que tem anel apagado, esverdeado) — a cor faz trabalho de estado, não só de
decoração.

---

## Tipografia e cor

- **Fonte:** `Exo` (medido, branding) — sans geométrico tecnológico, usado em caixa
  alta e espaçado nos rótulos de interface (`CHOOSE A PRODUCT`, `SELECT`). Coerente
  com "dispositivo de engenharia".
- O wordmark `SMARTRAP` é uma **display stencil/militar** distinta da Exo — quase
  certamente um **logo de produto (imagem)**, não a fonte do site. Tratar como
  aparente; não assumir que a Exo faz esse desenho.
- **Cor (print, aparente exceto onde indicado):** fundo carvão quase preto (~`#1c1c1c`,
  aparente) com textura pontilhada sutil; texto de interface em cinza médio/claro;
  **um** acento amarelo `#FFFF00` (medido). Sem gradiente de marca, sem segundo
  acento. `border-radius: 0` no branding, mas o `SELECT` é pílula — outra divergência
  branding×print, fico com o print.
- **Contraste:** a frase de descrição é cinza sobre carvão, contraste baixo de
  propósito (hierarquia por sussurro). Em cliente regulado da Horus isso **reprovaria**
  no detector (`low-contrast`) — ver "o que não copiar".

---

## O que não copiar

**O silêncio total como modelo de site de negócio.** Isto funciona como *átrio* de
uma marca que já tem tração e cujo produto fala por si. Para os clientes da Horus —
que precisam explicar, provar credencial (CRO/CRP), e converter contato — copiar a
contenção inteira seria suicídio: sem "para quem é" desenvolvido, sem prova, sem
caminho de conversão além de um `mailto:`. **A lição é a disciplina de decidir o que
NÃO dizer na primeira tela, não zerar o site.** Um cliente pode ter uma home que
força uma escolha limpa e *então* entrega o argumento completo depois do clique.

**O contraste baixo da descrição.** Cinza sobre carvão é bonito e reprovaria a régua
de acessibilidade da casa (`low-contrast` no `/verificar`, pisos de
`_memoria/conteudo/10-legibilidade.md`). Acessibilidade se corrige, não se dispensa.

**Confiar no `branding` do Firecrawl sem o print.** Este caso é a prova viva: o
branding jurou fundo branco e cantos retos; o print mostra fundo preto e botão
pílula. Hex e `colorScheme` do branding valem quando o print confirma — nunca
sozinhos.

---

## Aplicado onde

Ainda não. Candidato de raciocínio (não de aparência): qualquer cliente da Horus
com **dois ou mais públicos disjuntos** sob a mesma marca pode usar a ideia do
**seletor na porta**. Encaixe mais forte do roster: **Permita-se Fitness**, estúdio
multi-modalidade cujos públicos quase não se cruzam (hidroginástica, boxe, ballet
kids, nutricionista) — o caso quase perfeito. Depois **Aion**, com seus seis
serviços distintos, e clientes futuros de marca guarda-chuva. Não cabe em cliente
de oferta única (o Grão da Serra, um café, não teria o que bifurcar). E a
**frase-única por trilho** (categoria + público + função, sem promessa) é modelo
direto de copy sóbria para Dr. Giovanni e Aion, onde o compliance proíbe o resto.
