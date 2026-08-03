# Teardown: Grão da Serra Café Gourmet (Mantiqueira/SP) — o homônimo

- **URL:** https://graodaserra.com.br
- **Segmento:** Café gourmet, e-commerce nacional, desde 1995
- **Estudado em:** 30/07/2026
- **Nota:** 3/10 — **contraexemplo**
- **Contexto:** é o **homônimo** do cliente #4 e o dono do domínio
  `graodaserra.com.br`. Estudado para saber com o que estamos competindo no nome.

---

## Por que este teardown existe

O Café Grão da Serra (cliente #4), de Brejões/BA, tem o mesmo nome desta marca, que
existe **desde 1995**, tem e-commerce nacional e detém o `.com.br`. A conclusão
prática já registrada em `clientes/grao-da-serra/briefing.md` é que **disputar o
nome no orgânico é briga perdida**.

Mas o teardown muda o tamanho do medo: **o site deles é fraco.** A vantagem que
eles têm é de tempo de domínio e indexação, não de qualidade. Num confronto de
página contra página, é ganhável com folga.

---

## Estrutura

Loja com catálogo, posicionada em torno de um argumento bom e mal executado: **"State
Coffee"**, ou seja, todos os grãos do blend vêm de uma única propriedade rural. É
um diferencial real de rastreabilidade, e está enterrado numa meta description em
vez de estruturar a página.

---

## O que copiar

### O conceito de "State Coffee" como argumento de origem única

- **Como é feito:** um termo próprio, explicado em uma frase, que resume a promessa
  de rastreabilidade
- **Por que funciona:** dá nome a uma característica que o concorrente médio não
  consegue reivindicar, e nome é o que gruda
- ⚠️ Para o Grão da Serra da Bahia isso **não se transfere**, porque o café dele vem
  de produtores diferentes, comprado pelo pai. O aprendizado transferível é o
  **método**: dar nome próprio à característica que só você tem. No caso dele, o
  candidato é o **beneficiamento artesanal**, não a origem única

---

## Tipografia e cor

Aqui está o problema, e ele é grande:

| Item | Valor | Diagnóstico |
|---|---|---|
| Cor primária | `#337AB7` | 🔴 **azul padrão do Bootstrap 3**, sem nenhuma relação com café |
| Acento | `#59C00B` | verde-limão, que briga com o marrom `#321D10` da marca |
| Secundária | `#321D10` | o único marrom, e não é o primário |
| Títulos | Urbanist | sans genérica |
| Corpo | Montserrat | sans genérica |
| **h1** | **18px** | 🔴 título do mesmo tamanho de um subtítulo |
| **Corpo** | **12px** | 🔴 abaixo do mínimo legível |
| Input | raio 30px + sombra pesada | vocabulário de formulário de 2014 |

**O diagnóstico em uma linha:** a marca é de café, e a cor dominante do site é azul
de framework. Ninguém escolheu essa cor, ela veio no template e ficou.

`author` no HTML: "Via Brasil Web Project". É site de agência local, entregue e
não revisitado.

---

## O que não copiar

- **Cor que vem do framework.** `#337AB7` é o azul padrão do Bootstrap. Se a cor
  primária do site bate com o default de um framework, ninguém tomou decisão de cor
- **h1 de 18px e corpo de 12px.** Falha de acessibilidade antes de ser falha de
  gosto, e cai direto nas regras `tiny-text` e `undersized-ui-text` do detector
- **Enterrar o melhor argumento na meta description.** "State Coffee" é a coisa mais
  interessante da marca e não estrutura nenhuma seção

---

## A leitura estratégica para o cliente #4

1. **Não brigar pelo nome no Google.** Eles têm 30 anos de indexação e o `.com.br`
2. **Mas não ter medo da comparação.** Se um cliente abrir os dois sites lado a
   lado, o nosso ganha por qualidade, e isso é uma vantagem real de conversão
3. **O terreno onde eles não entram é o local e o artesanal.** Eles são gourmet,
   nacional, e-commerce. O Grão da Serra da Bahia é regional, artesanal, B2B e de
   relação. São dois negócios diferentes com o mesmo nome

---

## Aplicado onde

Ainda não. Serve de baliza de qualidade mínima para o site do **Café Grão da
Serra**, e de argumento para a conversa sobre nome e domínio com o Nelson.
