# Portfólio da Hórus: peças conceituais

> Sites completos, construídos pela casa para **demonstrar capacidade**, não para um
> cliente pagante. Criados em 27/08/2026 a pedido do Marcelo, para ter o que mostrar
> numa reunião quando o lead pedir "me mostra um site de vocês".

## Regra de honestidade (obrigatória ao apresentar)

Estas peças são **projetos conceituais**, com marca, endereço, telefone e textos
inventados para o exercício. Ao mostrar para um lead:

- ✅ Pode dizer: "esse é um projeto nosso", "foi a gente que fez", "é o nível de
  acabamento que entregamos".
- ❌ Não pode dizer: "esse é cliente nosso", "essa doceria fatura X", "esse escritório
  contratou a gente". Cliente real da casa é outra lista (Aion, Grão da Serra,
  Dr. Giovanni, Permita-se).
- Se o lead perguntar direto se é cliente, a resposta é simples e sem rodeio: **"esse
  é um projeto nosso de demonstração; cliente no ar hoje é o Grão da Serra, posso te
  mostrar."** Perder meio ponto de vaidade custa menos que ser pego inventando.

Nenhum dos dois usa número de resultado ("+300 clientes", "98% de satisfação"),
justamente para que nada na página seja uma afirmação falsa sobre o mundo. O que a
página afirma, ela mostra: os seis projetos do portfólio estão na própria página, o
prazo de encomenda é uma regra declarada, não uma estatística.

## As peças

| Peça | Segmento | Elemento-assinatura | Pasta |
|---|---|---|---|
| **Amêndoa Preta** | Doceria de encomenda, Salvador/BA | O painel de agenda: a página calcula, na hora, o prazo de corte da próxima encomenda | [amendoa-preta/](amendoa-preta/) |
| **Soleira** | Arquitetura de interiores, Salvador/BA | A régua do projeto: as 5 etapas com prazo real e entregável, mais o que fica fora do escopo | [soleira-interiores/](soleira-interiores/) |

## Links publicados (27/08/2026)

Os dois estão no ar como artefato privado da conta do Marcelo, para abrir no celular
numa reunião. São páginas de arquivo único, com CSS, JS e imagens embutidos, geradas
do mesmo código desta pasta:

- **Amêndoa Preta:** https://claude.ai/code/artifact/a9497ca6-84b7-4926-a5de-c770a1975a9f
- **Soleira:** https://claude.ai/code/artifact/6e51ede2-3967-491f-9087-7ba058da6802
- **Índice do portfólio** (os dois mais o Grão da Serra e a Aion):
  https://claude.ai/code/artifact/b75e072f-8b8d-4642-b114-a8b803d8c7a7

Para republicar depois de mexer no código, rodar o empacotador que inlina tudo e
publicar de novo no **mesmo** endereço. Se o Marcelo quiser domínio próprio, o
caminho é Netlify, que exige a conta dele (a sessão local do `netlify-cli` não está
logada, verificado em 27/08/2026).

✅ **O site do Grão da Serra (cliente #4) está no ar em `https://cafegraodaserra.netlify.app/`**
(HTTP 200, medido em 27/08/2026). A memória antiga apontava para `graodaserra.netlify.app`,
que devolve 404, mas era só a URL errada: o site nunca caiu, mudou de subdomínio. É o
único cliente real da casa no ar, e serve de prova ao lado das duas peças conceituais.

Cada pasta tem `PLANO.md` com o passe duplo registrado (o plano genérico, a pergunta
que o matou, e o plano revisado), o `index.html` e os assets.

## Por que estes dois segmentos

Escolhidos para cobrir os dois extremos do que a casa vende:

- **Amêndoa Preta** é o comercial quente: catálogo, prazo, encomenda por WhatsApp,
  calendário de datas. É a mecânica que o dono de floricultura, padaria, buffet ou
  loja de bairro reconhece como o próprio negócio. Espelha de propósito a máquina que
  foi mapeada para a Amparo Flores em 27/08/2026.
- **Soleira** é o premium editorial: foto grande, texto curto, portfólio como espinha
  dorsal. Serve para provar acabamento quando o lead é escritório, clínica de alto
  padrão ou marca que se vende por imagem.

Estudo que sustenta os dois: [doceria-encomenda-tres-sites.md](../referencias/doceria-encomenda-tres-sites.md)
e [interiores-tres-sites.md](../referencias/interiores-tres-sites.md).

**A brecha que os dois ocupam é a mesma**, e foi o achado dos dois teardowns: os seis
sites reais estudados escondem prazo, escopo e processo. Quem vende encomenda vende
data; quem vende projeto vende meses de convívio. Nenhum deles diz isso na página.
Estes dois dizem, e é daí que sai o elemento-assinatura de cada um.
