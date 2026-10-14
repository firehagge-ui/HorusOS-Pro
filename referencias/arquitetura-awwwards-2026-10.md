# Arquitetura e interiores no Awwwards: a lógica dos premiados (13/10/2026)

> Estudo feito com o Playwright (rolagem real, tela por tela) em 10 sites da categoria Architecture do
> Awwwards, a pedido do Marcelo, para o site da Débora Reis. Vale para qualquer escritório de arquitetura,
> interiores ou design de casa. Telas no scratchpad da sessão; o que importa está aqui.
>
> Sites: Stanzza (stanzza.design, interiores, Barcelona), Tarq (tarqstudio.com), LPAS (lpas.com), Santal
> (santalarch.com), Driessen (driessenarchitectuur.nl), Estudio Bang (bybang.co), Mathilde de Chiara
> (mathildedechiara.com), Loam House (residences.loamhouse.com.au), DVO (dvo.it), Wiemer (wiemer.store).

## A estrutura que se repete

| Ordem | Bloco | Quem faz | Por quê |
|---|---|---|---|
| 1 | **Foto real de ponta a ponta + uma frase** (manifesto), topo mínimo: marca, menu, um botão ("Request a call") | Stanzza, LPAS, Driessen | O trabalho é a prova; o texto só dá o tom |
| 2 | **Frase de posição curta** ("A home is a composition", "Grote plannen beginnen zelden met een tekening") | Stanzza, Driessen, Santal | Diz como pensam antes de mostrar o que fizeram |
| 3 | **Projetos como capítulos, com ficha**: nome, ano, área, prazo, cidade ("Project executed in 62 days · 150 m² · Barcelona") | Stanzza, Tarq, LPAS | Transforma foto bonita em problema resolvido (a tríade do `00-anatomia.md`) |
| 4 | **Processo com etapas numeradas**, de preferência com foto do trabalho acontecendo (Tarq: 01 a 04) | Tarq, LPAS ("Listen. Plan. Analyze. Shape."), Santal | Vende método e calma, não só estética |
| 5 | **O que o cliente pode esperar** (Stanzza: "One responsible lead", "Structured process", "Changes and costs, always visible", "Quality on site") | Stanzza | Responde ao medo de obra: atraso, custo, quem responde |
| 6 | **Sobre**: a fundadora com uma frase, números reais (anos, projetos) | Stanzza, Tarq | Rosto e trajetória |
| 7 | **Imprensa ou reconhecimento** (só quando existe) | Tarq (AD, Signature) | Autoridade emprestada de verdade |
| 8 | **Diário ou blog** | Stanzza, LPAS | Voz própria e conteúdo pro Google |
| 9 | **Perguntas que os clientes fazem** | Stanzza | Tira a objeção antes da reunião |
| 10 | **Contato que pede detalhes do projeto** ("Share a few details about your project and we'll come back with a clear plan") + rodapé com endereço | Stanzza, Driessen | O pedido é pequeno e concreto |

## Tipo e forma

- **Grotesca suíça domina**: Helvetica, Aeonik, Neue Montreal, Geist, Aktiv Grotesk (seis dos dez). Quando há
  serifa, é editorial com itálico de verdade: Instrument Serif (Stanzza), PP Editorial New (Mathilde).
- Muito espaço, fio fino, raio zero, foto grande. Pouca cor: a cor vem das fotos.
- **Loam House usa Cormorant Garamond + DM Sans**, e as duas estão na lista de fontes-reflexo da skill
  impeccable. Copiar a fonte da referência não é copiar a lógica.

## O que se aproveita e o que não

- ✅ Ficha em cada projeto, processo com prazo, perguntas, contato que pede detalhes: é o que converte.
- ✅ Um elemento de assinatura só (Stanzza: o desenho de linha do rodapé; Bang: as peças flutuando).
- ⚠️ Números do "Sobre" só se forem reais (anos de formada, sim; "182 projetos" inventado, nunca).
- ❌ Santal (tela preta com palavras girando por vários scrolls) e Estudio Bang (o nome parado com fotos
  voando por 56 mil pixels): conceito que esconde o argumento atrás de rolagem. Serve pra estúdio que vende
  o próprio conceito, não pra escritório que precisa de cliente (`60-motion.md`, régua do conceito-assinatura).

## Aplicado em

- Débora Reis, rodada 3 (`clientes/_prototipos/debora-reis/`, 13/10/2026): capa, manifesto com a estante como
  índice dos projetos, capítulo com ficha, processo com prazo e três compromissos, diário com os textos dela,
  sobre, perguntas, contato. Zodiak + Switzer.

## Stanzza em detalhe (medido com o Playwright, 13/10/2026)

- **Tipo, três degraus e só:** títulos Instrument Serif 72px (capa), 56px (seções), 40/32px (itens), entrelinha
  **0,88**; texto Helioscond (grotesca condensada) 18px, entrelinha 1,32, e 24px nos destaques; metadado 12px caixa
  alta com espaçamento de 0,16em, sempre entre colchetes (`[ COMPOSED ]`). Manuscrita (Katherine Plus) só em duas
  frases.
- **Grade visível:** seis colunas com fio de 1px quase transparente sobre o papel `#F4F3EB`.
- **Capa:** foto de ponta a ponta, título centralizado embaixo, uma linha manuscrita acima, uma frase abaixo; topo
  com "MENU ::" (pílula translúcida), a marca no centro e "REQUEST A CALL" com borda.
- **Composição:** título pequeno no centro e seis a oito miniaturas (130 a 300px) espalhadas, cada uma subindo num
  ritmo; dois parágrafos curtos nas bordas.
- **Projetos:** cena verde-oliva presa à rolagem; a foto começa enquadrada no meio e cresce até a tela; título
  embaixo à esquerda, ficha à direita (prazo, área, cidade), "01/05" com linha de progresso, dois botões no pé.
- **Processo:** coluna de fotos em preto e branco presa à esquerda, quatro itens `[01]` a `[04]` à direita com fio.
- **Evento escuro:** azul-marinho com desenho de linha, título que acende palavra por palavra, painéis que deslizam.
- **Fim:** números com foto no hover, fundador com frase manuscrita e cartão escuro, perguntas em sanfona,
  "Start with a conversation" e o croqui de uma casa no rodapé.
- **Aplicado:** Débora Reis, rodada 4. Trocamos a fonte (Boska no lugar da Instrument Serif, que o detector marca como
  batida) e o assunto (anotação à mão da arquiteta, desenho de estante com gato), mantendo o sistema.
- **Rodada 5 (14/10/2026):** o Marcelo achou a capa e a cena do projeto parecidas demais com a Stanzza. Ficou o sistema;
  a capa virou uma prancha com carimbo e os projetos viraram carrossel com composição própria em cada um
  (`_memoria/design/90-antipadroes.md`, "Referência obrigatória copiada na estrutura").
