# Horus OS

> O sistema operacional da Hórus dentro do Claude Code.

O Horus OS é a operação da agência Hórus rodando dentro do Claude Code:
memória própria do negócio, identidade visual aplicada em tudo que o
sistema gera, um sistema de design que aprende a cada correção, e as
skills que fazem site, conteúdo, SEO, ads e operação rodarem.

Construído sobre o template **MazyOS** ([mazzeoia.com.br](https://mazzeoia.com.br)),
adaptado e renomeado. Este repositório é a instância da Hórus, não um
template para redistribuir.

Bora voar.

---

## Rodando numa máquina nova

Já está instalado e adaptado. Numa máquina nova, é só clonar o repositório
e abrir:

```
git clone https://github.com/firehagge-ui/HorusOS-Pro.git
cd HorusOS-Pro
code .
```

Na janela do VS Code: terminal integrado → `claude` → `/abrir`. O `/abrir`
carrega a memória do negócio e você já começa a trabalhar.

> ⚠️ Não rodar `/instalar` num clone deste repositório: ele é a entrevista
> de setup inicial e sobrescreveria a memória já preenchida. O `/instalar`
> só serve para instalar o sistema do zero num negócio novo.

Falta um passo local em cada máquina nova: o `.mcp.json` (chave do Firecrawl)
e a `OPENAI_API_KEY` no `.env` ficam **fora do git** e precisam ser recriados
à mão. Ver o `.gitignore` e a seção "Firecrawl" / "Geração de imagens" do
`CLAUDE.md`.

---

## O sistema

**Núcleo** — o jeito de operar o dia a dia
`/abrir` carrega o contexto antes de cada sessão de trabalho · `/salvar`
faz commit + push no GitHub · `/atualizar` varre o projeto e mantém a
memória coerente · `/novo-projeto` cria pasta isolada pra cada cliente ou
iniciativa · `/mapear-rotinas` descobre o que você repete e transforma
em skill personalizada.

**Conteúdo e SEO** — vitrine pública da empresa
`/carrossel` cria carrosséis 1080×1350 com identidade da marca (com ou
sem foto IA) · `/publicar-tema` pega um tema e entrega artigo de blog +
carrossel + 3 legendas amarradas · `/seo` roda fluxo completo de 8 passos
(demanda, concorrência, GMB, on-page, conteúdo, ads, monitoramento, GEO)
· `/responder-avaliacoes` escreve respostas humanas pras reviews do
Google · `/aprovar-post` publica blog + Instagram + Facebook num comando.

**Anúncios pagos** — onde o dinheiro entra
`/anuncio-google` monta a campanha inteira em CSV pronto pra importar
no Google Ads Editor · `/relatorio-ads` lê os exports de Google + Meta
e devolve relatório semanal com alertas e recomendações.

**Produção** — ferramentas do dia a dia
`/analisar-dados` lê CSV/XLSX/PDF e gera resumo executivo ·
`/email-profissional` rascunha email a partir de contexto livre.

**Design e decisão** — o que sustenta a qualidade
`/estudar-site` destrincha uma referência (URL ou imagem) num teardown que
vira memória · `/verificar` confere antes de declarar qualquer coisa pronta
· `/conselho`, `/debate`, `/consultar` e `/comparar` para decisão difícil.

---

## A tese

IA não é uma ferramenta que sua empresa usa. É o sistema operacional em
que ela roda.

A diferença não é velocidade. É capacidade nova — uma pessoa com IA
constrói o que antes exigia time inteiro. Cada processo crítico que hoje
roda em open loop (decide → executa → não mede → repete cego) vira
closed loop dentro do Horus OS (decide → executa → captura → realimenta →
ajusta sozinho).

O sistema não substitui você. Vira parte da sua empresa.

---

## Como o Horus OS pensa

`_memoria/` é o cérebro. Tudo que importa do negócio mora aqui — quem é a
empresa, como ela fala, o que tá em foco, e o que a agência já aprendeu
sobre site (`_memoria/design/`) e conteúdo (`_memoria/conteudo/`). O Claude
lê isso antes de cada resposta. Quanto melhor a memória, melhor o sistema.

`identidade/` é o rosto da agência. `clientes/<nome>/marca.md` é o rosto de
cada cliente, e vence em peça de cliente.

`referencias/` é o acervo de estudo: teardowns de sites reais que fazem a
decisão de design sair de um caso concreto, não do viés médio do modelo.

---

## Crédito

Construído sobre o **MazyOS** de [mazzeoia.com.br](https://mazzeoia.com.br),
adaptado para a operação da Hórus.
