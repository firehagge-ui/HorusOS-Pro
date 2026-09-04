# Teardown: Matveyan (Matvey Ananev)

- **URL:** https://matveyan.com/
- **Segmento:** portfólio de product designer de fintech (UI/UX para banking, brokerage, trading, cripto, dashboards industriais). Solo
- **Estudado em:** 28/08/2026
- **Nota:** 9/10
- **Contexto:** o Marcelo mandou junto com lessestudio, xmethod, wibify e amphora, no
  lote que motivou o redesign da Hórus ("uma cor só ficou brega, sem identidade"). É a
  referência mais **distinta** das cinco: onde as outras são estrutura de agência, esta
  é **aparência com identidade forte** — tipografia técnica, telemetria como ornamento,
  objeto 3D de marca. É o polo "o que a Hórus pode ser em craft visual"

---

## Estrutura, na ordem

1. **Hero de tela cheia, preto** — uma **órbita de tokens 3D de vidro** (moedas cripto
   foscas) girando em volta de um "M" central; título pequeno em caixa alta com
   tracking largo "**UI × UX FOR CAPITAL, DATA AND CONTROL**"; subtítulo de uma linha
   ("I design fintech platforms... where decisions cost millions"); um CTA "Write to
   Telegram". Sobre tudo isso, uma **barra de HUD** com telemetria ao vivo: `Cursor X/Y`,
   `Scroll`, `Time 0.0s`, `Audio Wave 0%`, ticker BTC/IMOEX/S&P500
2. **Manifesto** — "I make complex financial systems simple for users", com a lista de
   domínios (neo banking, brokerage, trading, crypto)
3. **Grade de cases** — 6 projetos, cada um um **screenshot real de produto** flutuando
   sobre o preto, alternando esquerda/direita, com **muito espaço vertical entre eles**.
   O preto é o vazio; a cor vem toda das telas dos apps (verde-limão, azul, ícones cripto)
4. **Timeline de experiência** — 4 posições, 2012→hoje
5. **Skills** — 8 categorias com descrição (inclui "3D visuals for interfaces",
   "WebGL-based interactive presentations")
6. **Projetos pessoais** — CryptoIcon + um design system
7. **Wordmark "MATVEYAN" gigante** no pé, ocupando a largura toda (mesma família do
   wordmark-no-pé do lessestudio)

---

## O que copiar

### A telemetria exposta como ornamento (o HUD do hero)

- **Como é feito.** Uma tira fina no hero mostrando dados vivos e inúteis-de-propósito:
  posição do cursor, scroll em %, tempo na página, um "Audio Wave" oscilando, cotações.
  Não serve para nada funcional; serve para **dizer o que a marca é**: "capital, data
  and control". A forma É o argumento.
- **Por que funciona.** Um portfólio de fintech que **parece um terminal** prova o
  domínio antes de qualquer case. É o oposto do enfeite: cada número reforça o
  posicionamento. Barato (é só texto mono atualizado por rAF), caro de imitar bem.
- **Aplicado na Hórus:** a casa vende "máquina" e "engenharia visual". Um HUD discreto
  com telemetria honesta (seção atual, progresso de scroll, um relógio) daria à Hórus a
  cara de **instrumento** que ela reivindica no discurso e nunca mostrou no visual. É a
  ponte entre "somos técnicos" e um site que **parece** técnico.

### O objeto 3D de marca em órbita (identidade que não é cor)

- **Como é feito.** Os tokens de vidro girando são o elemento-assinatura. Dão
  profundidade, movimento e um foco central sem depender de nenhuma cor de fundo — o
  fundo é preto morto.
- **Por que funciona.** Resolve exatamente a queixa do Marcelo: identidade não é uma cor
  esticada, é **um objeto próprio com craft**. Aqui a cor quase não existe; a identidade
  vem da forma 3D, da tipografia e do movimento.
- **Aplicado na Hórus:** o **olho de Hórus / falcão** pode virar esse objeto 3D
  recorrente (vidro âmbar/azul), em órbita no hero e reaparecendo miúdo como marca de
  seção. É o que a v10 tentou com a esfera e desligou. A ferramenta `3d-grabber` foi
  instalada justamente para capturar objetos 3D de referências como esta.

### O respiro vertical entre cases (o preto como matéria, não fundo)

- **Como é feito.** Entre um case e o outro há **uma tela inteira quase vazia** de preto.
  O screenshot do produto flutua, com sombra, isolado. A distância É o luxo.
- **Por que funciona.** Densidade baixa lê como confiança: "cada peça aguenta ficar
  sozinha". O oposto do site que empilha seção colada em seção. O preto vazio vira
  respiração, não buraco.
- **Aplicado na Hórus:** hoje o site institucional cola seção em seção e enche cada uma.
  Aumentar o intervalo vertical e deixar cada peça (serviço, case) **respirar sozinha**
  é meio caminho para sair do "cara de template".

---

## Tipografia e cor

- **Display:** grotesca técnica em **caixa alta com tracking largo**, small caps no hero,
  e o wordmark "MATVEYAN" pesadíssimo no pé. Corpo em sans neutra pequena. Contraste de
  escala altíssimo. *Aparente.*
- **Numerais monoespaçados** em toda a telemetria e nos tickers — o mono é parte da
  identidade, não acidente.
- **Cor:** fundo **preto quase puro** (~`#050505`, *aparente*), texto branco/osso. **Zero
  acento cromático de CSS**: toda a cor da página vem de **dentro dos screenshots dos
  apps** (verde-limão da CrocoWallet, azul do portfólio cripto, ícones coloridos). Mesma
  tese do lessestudio e do xmethod: o conteúdo carrega a cor, a moldura é monocromática.

---

## O que não copiar

- **Preto puro `#000` morto:** funciona para fintech frio; a Hórus tem carvão quente
  (`#0A0B0F` medido) e âmbar como território. O aprendizado é *monocromático deixa o
  conteúdo brilhar*, não *adote preto puro*.
- **Telemetria financeira** (tickers de bolsa): é do assunto dele. A Hórus pega o
  **mecanismo** (HUD honesto), não o conteúdo (cotação).
- **Rosto/CV no hero:** ele é freelancer vendendo a própria contratação. A Hórus é
  agência-com-sistema; rosto no hero muda o enquadramento (mesma lição do wibify).
- **Densidade de cases:** 6 telas reais de produto exigem ter 6 produtos reais e
  autorizados. O portfólio da Hórus ainda está sob restrição de autorização — copiar o
  **respiro e o isolamento**, não o número de telas com print de cliente.

---

## Aplicado onde

Ainda não aplicado. Candidatos para o redesign do site institucional da Hórus, em ordem:
1. **Objeto 3D de marca** (olho/falcão de vidro) como assinatura em órbita no hero e
   marca de seção — identidade por forma, não por cor (resolve a queixa central);
2. **HUD de telemetria honesta** discreto — dá cara de instrumento à "máquina" da casa;
3. **Respiro vertical alto** entre seções e cases, cada peça isolada sobre o carvão;
4. **Numeral monoespaçado** nos números de seção e nas fichas técnicas, como camada
   técnica consistente.
