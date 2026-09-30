# Template · site de espaço de eventos

> Origem: protótipo de venda da **Casa Verona** (Pituba, Salvador), rodada 3, 24/09/2026.
> A lead recusou em 24/09 e o protótipo virou template, como manda
> `clientes/_prototipos/README.md`. **Nenhuma foto, vídeo, logo, depoimento, endereço ou
> telefone dela está aqui.** Tudo que é do cliente está entre `[colchetes]` ou em `[FALTA: ...]`.

## O que vem pronto

- `site/index.html` · 12 blocos: hero com janela em arco e 3 fotos passando, faixa de tipos
  de evento, manifesto, vídeos do espaço, mosaico de eventos, galeria por ambiente com ficha
  de capacidade, pacote em cartão de cardápio, como funciona a visita, depoimentos, **pedido
  de visita com a placa de boas-vindas que se escreve enquanto a pessoa digita** (a
  assinatura), perguntas de viabilidade + mapa, rodapé com o nome e o vídeo dentro das letras.
- `site/assets/site.js` · slideshow com pausa, vídeos que tocam ao entrar na tela, placa
  viva, pedido pelo WhatsApp com a mensagem pronta, modo apresentação × trabalho (tecla **P**
  ou `?pendencias=1`), tudo parado com "reduzir movimento".
- `site/assets/site.css` · tokens da Casa Verona (trocar primeiro).
- `site/assets/vendor/` · GSAP, ScrollTrigger e Lenis locais.
- `site/img/` · só os ornamentos em aquarela gerados no ChatGPT (ciprestes, flores brancas,
  4 ramos), que são da casa, e `foto.svg`, o marcador de foto que falta.

## Ordem de uso

1. Rodar a `/criar-site` normal (pré-voo, `/estudar-site`, passe duplo). O template economiza
   o código, **não** o estudo nem o passe duplo.
2. Trocar os tokens de cor e o par de fontes no `site.css` pela `marca.md` do cliente.
3. Decidir o que fica da assinatura visual: o **arco com sacada** e os **ciprestes** vieram da
   arquitetura e do logo da Verona. Se o espaço do cliente não tem arco, redesenhar a moldura
   a partir do que ele tem. Não vestir um galpão de vila italiana.
4. Preencher `[colchetes]`, colocar as fotos e os vídeos reais e as credenciais do WhatsApp
   (`site.js`, constantes `WHATS` e `NOME`).
5. Ornamento que não combina com o cliente sai. Cada ornamento aparece uma vez, com função.
6. `/verificar` + detector do impeccable antes de mostrar.

## Travas (aprendidas com a Verona)

- 🔴 **Foto e vídeo só do lugar real.** IA só em ornamento abstrato/botânico.
- 🔴 **Depoimento só literal**, com nome, fonte e data, reticências no corte, nunca completar.
- 🔴 **Preço é decisão do cliente.** Espaço de orçamento personalizado costuma **não** querer
  valor exposto ("são várias variantes", "o cliente tem que entrar em contato", Casa Verona,
  24/09). O padrão do template é "valor na visita". O site leva a pessoa pro atendimento do
  dono, não substitui a conversa.
- Telefone só confirmado, nunca presumir dígito.
- `noindex` enquanto for prévia de venda.
