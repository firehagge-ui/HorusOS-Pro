# Template · site de arquitetura de interiores

> Origem: protótipo de venda de uma arquiteta de interiores de Salvador, de 09 a 15/10/2026 (sete rodadas). O lead
> foi encerrado em 15/10, e o protótipo virou template, como manda `clientes/_prototipos/README.md`. **Nenhuma foto,
> frase, nome, endereço, telefone, e-mail ou projeto da cliente está aqui.** O que é do cliente está entre
> `[colchetes]` ou em `[FALTA: ...]`, e cada foto é um marcador do mesmo tamanho da original (`assets/fotos/`).

## Por que cada seção existe

O porquê de cada parte, comparado com dez sites de arquitetura e interiores, está no diagnóstico
`clientes/_prototipos/debora-reis/PROPOSITO-DAS-SECOES.md`. Os estudos estão em `referencias/` (Stanzza, Tecnoarreda,
Telha Clarke, Pelizzari, Simone Katherine, Storey, Paula Müller, Natália Salla, Duda Senna, Normal is Boring) e em
`referencias/arquitetura-awwwards-2026-10.md`. **Ler antes de preencher.**

## O que vem pronto

- **`index.html`, a home, na ordem em que quem vai reformar decide:**
  1. capa emoldurada pelo papel (o que, onde, prova e botão);
  2. "como ela pensa", com a pergunta que fazem à arquiteta e a resposta dela; as fotos são índice clicável;
  3. projetos, um apartamento por vez, passando da direita para a esquerda por seta, arrasto ou teclado;
  4. como trabalho, com "Como começa" preso ao lado das etapas;
  5. a faixa vinho do detalhe da casa (no original, os gatos), com o desenho de traço;
  6. a arquiteta: retrato, nome, formação e frase;
  7. perguntas que travam a decisão;
  8. contato com um caminho principal.
- **`projeto.html`:** a página do caso.
  - a foto com números que abrem a explicação;
  - capítulos de marcenaria, cores (paleta tirada da foto, e a página diz isso), luz e objetos (recortes no tamanho do
    arquivo, numa prateleira);
  - "Próximo apartamento".
- **`projetos.html`:** os apartamentos com ficha em carimbo de prancha e, à parte, os detalhes.
- **`conte-sua-casa.html` + `assets/casa.js`:** questionário de seis perguntas que monta um resumo e manda pelo
  WhatsApp. Trocar os "jeitos", as fotos e as frases (`JEITOS`, `FOTOS`, os cartões) pelos do cliente.
- **`guia.html`:** o guia do cliente em páginas A4 (prazos, como o valor é calculado, o que trazer), em primeira pessoa.
- **`assets/estudio.css` e `demo.css`:**
  - os tokens: papel `#F3F0E8`, tinta `#1E1A17`, vermelho `#9E3326`, vinho `#3A1F1A`;
  - as fontes: Boska (Fontshare), Archivo e La Belle Aurore (Google Fonts);
  - trocar os tokens primeiro, pela `marca.md`.
- **`assets/estudio.js`:**
  - o carrossel, sem troca sozinha;
  - as anotações à mão no ponto certo da foto;
  - os desenhos que se traçam uma vez;
  - o cabeçalho que some ao descer.
- **`assets/vendor/`:** GSAP e ScrollTrigger locais.

## Ordem de uso

1. Rodar a `/criar-site` normal (pré-voo, `/estudar-site`, passe duplo). O template economiza o código, **não** o
   estudo nem o passe duplo.
2. Trocar tokens e fontes pela `marca.md` do cliente (checar licença com a `kit-tipo`).
3. Preencher os `[colchetes]` e os `[FALTA]`. O número do WhatsApp entra como `55DDDNUMERO` em todos os links e no
   `casa.js` (`WHATS`). Nunca presumir dígito.
4. Trocar os marcadores de `assets/fotos/` pelas fotos reais, com o mesmo nome ou ajustando o `src`. Foto do Instagram
   (1080 px) fica emoldurada; tela cheia só com o original do fotógrafo.
5. Decidir o que fica da assinatura: a anotação à mão sobre a foto e os desenhos de traço (estante, rodapé com cota
   "sob medida"). Redesenhar a partir do que o cliente tem; não vestir outro escritório com o detalhe de um.
6. `/verificar` + `npx --yes impeccable@4.0.4 detect` **rodado da raiz do repositório**.

## Travas (aprendidas com o protótipo)

- 🔴 **De qual apartamento é cada foto, só com prova** (o mesmo móvel em duas fotos) ou a palavra do cliente. Indício
  vira `[FALTA]` (`_memoria/integridade.md`).
- 🔴 **Não juntar dois fatos num terceiro**: "formada em 2004" + "escritório em Salvador" não dá "em Salvador desde 2004".
- 🔴 **Preço não vai em página pública** (orientação do CAU: honorários só "quando solicitado"). O valor vai no guia,
  para quem pede. Depoimento em publicidade: `[a conferir no CAU]`.
- 🔴 **Prazo e entrega de cada etapa só com o número do cliente.** Prazo publicado errado é pior que prazo nenhum.
- 🔴 **WhatsApp com mensagem pronta** (`?text=`), a mesma regra de botão principal em todas as páginas.
- Detalhe (estante, nicho, canto de sofá) não vira "apartamento" no carrossel: vai para dentro do projeto de origem ou
  para uma faixa menor.
- Nada de nota de bastidor no site que o cliente vê; o que não é definitivo leva só a etiqueta "Demonstração".
