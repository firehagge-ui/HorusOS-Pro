# Teardown: Arbor Coffee Roasters — página de fornecimento PJ

- **URL:** https://arbor.cafe/fornecimento-pj/
- **Segmento:** Café, micro-torrefação, **venda B2B para cafeteria e padaria**
- **Estudado em:** 30/07/2026
- **Nota:** 8/10
- **Contexto:** estudado para o Café Grão da Serra (cliente #4), que é B2B de café
  e precisa de uma página que converta **revendedor**, não consumidor final.

---

## Estrutura, na ordem

1. **Hero "Para seu Negócio"** com um parágrafo de credibilidade: 8 anos tocando
   uma das melhores cafeterias de Florianópolis, com menção a jornal, TV e PDG
2. **A dor do revendedor, nomeada** (o movimento mais forte da página)
3. **Tabela de preços pública**, por faixa de volume mensal
4. Condições operacionais: frete, pedido mínimo, rotas e prazo de entrega
5. Private label / marca própria
6. Atendimento personalizado
7. **"O caminho que o café faz até chegar à sua loja"** em 3 passos
8. Ficha técnica do café (sensorial, variedade, altitude, processo, fazenda, região)
9. Logos de parceiros
10. Outros serviços (branding, consultoria, treinamento)
11. Depoimentos, com link para os +700 reviews do Google

Comparando com `_memoria/design/00-anatomia.md`: a diferença estrutural é que o
bloco de **preço e condição operacional sobe para o topo**, antes de qualquer
sedução. Faz sentido: em B2B, quem lê é dono de negócio calculando margem, não
alguém se apaixonando por um produto.

---

## O que copiar

### Nomear a dor do revendedor no lugar de elogiar o próprio café

O parágrafo de abertura não fala de aroma, fala do que dá errado com o fornecedor
atual:

> "Chega de problemas como variações de torra, atrasos na entrega, torra velha,
> cafés sem origem definida, café amargo, entre outros problemas."

**Por que funciona:** o dono de padaria não acorda querendo café melhor, ele acorda
lembrando do fornecedor que atrasou. Listar as falhas do mercado faz o leitor se
reconhecer em três segundos, e transforma a página em solução de um problema que
ele já tem, não em oferta de um produto que ele não pediu.

E há uma vantagem tática: cada item da lista é uma **promessa implícita de padrão**
sem virar promessa formal de resultado.

### Preço público, por faixa de volume

Três faixas visíveis, com valor por quilo:

| Faixa | Preço/kg | O que muda |
|---|---|---|
| 4 kg | R$ 148,60 | envio mensal |
| 5 a 20 kg | R$ 136,00 | envio mensal |
| 21 kg + | R$ 132,00 | envio **semanal**, treinamento de barista, frete grátis |

**Por que funciona:** filtra quem não tem porte antes de ocupar o tempo de
ninguém, e ancora volume como caminho de desconto, o que empurra o pedido para
cima sozinho. A terceira faixa não ganha só preço, ganha **serviço** (treinamento,
material, frete), o que justifica a subida sem desvalorizar o produto.

⚠️ Decisão que exige coragem e estoque de margem. Nem todo cliente pode copiar.

### Condição operacional explícita, antes da conversa

Pedido mínimo (4 kg ou 12 pacotes de 250g), dias de torra (segunda a quarta), dias
de rota, prazo de corte do pedido ("até quarta às 12h"), regra de frete por região.

**Por que funciona:** é exatamente o que um comprador B2B precisa para decidir se
vale a ligação. Esconder isso para "gerar contato" só gera contato ruim.

### "O caminho que o café faz até chegar à sua loja"

Três passos numerados: compra direto do produtor → torra no LAB → frete e entrega.

**Por que funciona:** transforma processo em prova. Em vez de afirmar qualidade,
mostra a cadeia inteira e deixa o leitor concluir. É o bloco mais transferível da
página, e o que mais serve ao Grão da Serra, que tem uma cadeia própria e visível
(escolha do grão, pilagem, secagem, torra, moagem).

### Prova por review do Google, com link

Em vez de depoimento avulso, cita "+700 reviews" e **linka para o Google**.

**Por que funciona:** depoimento no próprio site é auto-declarado; review do Google
é verificável por terceiro. Conecta direto com o trabalho de perfil que a agência
faz antes do site.

---

## Tipografia e cor

- WordPress + WooCommerce, `theme-color: #111111`
- Escuro, com fotografia de produto e de torra carregando a cor
- A identidade vem mais da **fotografia própria** que da tipografia

---

## O que não copiar

**O jargão de café especial.** A página inteira se apoia em SCA, altitude,
variedade, processo e nome de fazenda. Isso é o **campo de jogo padrão do
segmento**, e só funciona para quem tem o dado.

⚠️ Para o Grão da Serra isso é uma armadilha direta: ele **não tem** pontuação SCA,
altitude confirmada nem nome de produtor. Imitar esse eixo levaria a inventar, que
é exatamente o que `_memoria/integridade.md` proíbe, e num produto alimentício.
Ver `clientes/grao-da-serra/marca.md`.

**A conclusão estratégica:** o eixo técnico está ocupado e é inacessível para ele.
O que sobra, e que nenhum concorrente tem, é **processo artesanal visível**
(pilagem, secagem ao sol, torra) e **história local**.

**Excesso de serviço na mesma página.** Branding, consultoria e treinamento no fim
da página de fornecimento diluem o pedido. A página estava indo bem com uma decisão
só, e termina oferecendo cinco.

---

## Aplicado onde

Ainda não. Candidato direto: página do **Café Grão da Serra**, principalmente o
bloco de dor do revendedor e o de processo em 3 passos.
