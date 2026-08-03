# Biblioteca de referências

Teardowns de sites reais. Cada arquivo destrincha um site: estrutura, tipografia,
cor, composição, copy, e o que **não** copiar.

Gerar com `/estudar-site <url>`. Gabarito em `_gabarito.md`.

Por que isso existe: regra genérica gera site genérico. Referência estudada faz a
decisão sair de um caso real em vez do viés médio do modelo. Ver
`_memoria/design/README.md`.

---

## Acervo

| Site | Segmento | Nota | Lição principal |
|---|---|---|---|
| [Giuliana Ragno](giuliana-ragno.md) | Psicologia, solo, online | 9 | O bloco "para quem é" em coluna única, segunda pessoa, sem ícone, com ressalva de esforço em cada frase |
| Valéria Movio | Psicologia, solo | 7 | Marcellus + Poppins, paleta terrosa. Confirma o caminho cromático do setor |
| Pataquini Psicologia | Psicologia, clínica | 4 | **Contraexemplo.** WordPress com Elementor, roxo, sans em tudo, sombra em botão. O visual a evitar |
| [Arbor Coffee Roasters](arbor-cafe.md) | Café, B2B para cafeteria | 8 | Nomear a **dor do revendedor** em vez de elogiar o café, preço público por faixa de volume, e "o caminho que o café faz até sua loja" em 3 passos |
| [Fazenda São Gabriel](fazenda-sao-gabriel-atacado.md) | Café, atacado B2B | 6 | **Segmentação por tipo de negócio** (6 blocos com bullets próprios) e comparativo "especial × tradicional", que cria critério de compra sem citar concorrente |
| [Grão da Serra Mantiqueira](grao-da-serra-mantiqueira.md) | Café gourmet, e-commerce | 3 | **Contraexemplo e homônimo do cliente #4.** Azul `#337AB7` do Bootstrap num site de café, h1 de 18px, corpo de 12px. Vantagem deles é domínio e tempo, não qualidade |
| [Lista de café do Marcelo](cafe-lista-marcelo.md) | Café, B2C e cafeteria, internacional | — | Consolidado de 7 links + 11 prints. **Narrativa em capítulos** (La Boheme), kicker + título em página escura (site russo), h1 de 114 a 199px, zero sombra, verde só como acento |

> Valéria Movio e Pataquini ainda estão só como linha aqui. Fazer o teardown
> completo dos dois quando sobrar tempo, principalmente do Pataquini: teardown de
> site ruim ensina tanto quanto o de site bom, e é mais rápido de escrever.

---

## Fila de estudo

O Marcelo já vinha colecionando referência por conta própria, antes desta pasta
existir. As listas estão em três arquivos sem extensão, e são o insumo pronto:

| Lista | Onde está | Sites |
|---|---|---|
| Clínicas e psicologia | `Lista de Sites para Clinicas` (raiz) | 6 |
| Odontologia | `clientes/dr-giovanni-nascimento/Referencias Site Dr Giovanni/Lista de Sites Dr Giovanni` | 8 |
| Academia | `clientes/permita-se-fitness/Referencias Site Permita-se/Lista de Sites Permita-se` | 2 |
| Café | `clientes/grao-da-serra/Referencias Grão-da-serra/Links` | 7 + 11 prints |

⚠️ A lista de clínicas está solta na raiz, sem pasta. Decidir se vira
`referencias/_fila-clinicas.md` ou se vai para a pasta de algum cliente.

**Pendente de teardown:**

- [ ] Os 6 da lista de clínicas (pegasus-clinic, klearmindclinics, qpsychology,
      kindly, therapyin.london, foothillspt) — servem à Aion e a qualquer cliente
      de saúde.
      **Consultados de forma rasa em 30/07/2026** (estrutura da home, formato da
      seção de serviços, como comunicam tempo de casa), na revisão do site da Aion.
      Não virou teardown. O que ficou de útil:
      - **qpsychology.com.au é a de maior prioridade.** É a única com a mesma
        anatomia da Aion: clínica com equipe, vários serviços, sem profissional
        estrela. Tem 6 serviços em grid de cards, cada um com página própria, e
        **nenhum selo de "X anos"** em lugar nenhum
      - **therapyin.london** também não usa selo de anos. Quem usa são **pegasus** e
        **klearmind**, que vendem estética e ketamina. Padrão: selo de tempo de casa
        é linguagem de segmento com venda mais agressiva, não de clínica
      - Duas brasileiras entraram fora da lista (casaclinicapsi.com.br e
        espaconeurodesenvolver.com). As duas colocam o tempo de experiência **dentro
        da bio do profissional**, nunca no hero. A segunda tem 8 serviços com URL
        própria cada, que foi o precedente usado na decisão da Aion
- [ ] **Os 7 da lista de café** (dribbble City Pour, maison-deuza, aroma-coffee
      webflow, bkkdw26.greydientlab, wakeupcoffee, white-coffee, capsul-in-pro),
      escolhidos pelo Marcelo. **Ainda sem teardown.**
      ⚠️ Observação já registrada: são referências **de estilo**, quase todas B2C,
      e-commerce ou cafeteria internacional. Ensinam linguagem visual, **não**
      ensinam a estrutura de que o cliente #4 precisa, que é convencer revendedor.
      Por isso os três teardowns de café feitos primeiro foram de **concorrentes
      B2B reais**, não da lista de estilo. As duas coisas se somam
- [ ] Os 8 da lista de odonto — servem ao Dr. Giovanni, que é a fila de prioridade
- [ ] Valéria Movio e Pataquini, que hoje só têm uma linha na tabela acima
- [ ] Um site excelente fora do segmento por semana, para não ficar reproduzindo
      a média do nicho

Antes de cada site novo, 3 a 5 concorrentes do segmento do cliente. Fontes de
onde tirar mais em `_memoria/design/91-onde-estudar.md`.
