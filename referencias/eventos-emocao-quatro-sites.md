# Eventos com emoção: Austo, Boutique Weddings, Wedding Cinema Club, The Grand LB

> Quatro sites que o Marcelo mandou em 24/09/2026 para a rodada 3 do protótipo da
> **Casa Verona** ("gostei que tem vídeos, do motion e de alguns efeitos; deixe nosso
> site tão decorado quanto"). Não são concorrentes: são **DJ de casamento, cerimonial no
> Lago di Como, produtora de filme de casamento e um espaço de eventos** (só o último é do
> mesmo segmento). Servem de régua de **clima, motion e decoração**, não de estrutura.
> Coleta: print em 1440px com Playwright, rolando com a roda do mouse (os quatro usam
> scroll suave ou animação amarrada à rolagem), e leitura do DOM (fontes carregadas,
> vídeos, bibliotecas, ScrollTriggers ativos). Prints em `scratchpad`, não versionados.

---

## Os quatro, em uma linha

| Site | O que é | Nota | O que levar |
|---|---|---|---|
| **Austo Entertainment** (austoentertainment.com) | DJs de casamento, Orange County | 9 | **O símbolo do logo vira cena viva:** as palmeiras do logo aparecem em vídeo com alfa (`tree-vp9.webm`) nas duas laterais do hero, balançando em cinza claro sobre o creme. Título de 103px em **PP Editorial New** com a palavra de emoção em itálico ("Unforgettable *moments* start with the *music*."). Webflow + GSAP 3.15 (ScrollTrigger, SplitText, CustomEase): as fotos e os vídeos dos casais rodam em `scrub` (parallax), a seção escura entra com **borda em onda**, depoimento em **polaroid empilhada** inclinada, CTA final com o disco girando com o logo no rótulo |
| **Boutique Weddings** (boutique-weddings.com) | Cerimonial de casamento no Lago di Como | 6 | **Moldura de passe-partout:** a página inteira fica dentro de uma margem branca de 30px, e os blocos são ladrilhos separados por 30px de branco, como fotos coladas num álbum. Hero de foto sangrada (balaustrada, colunas com rosas, o lago), **arabesco desenhado** acima e abaixo do título, **fio vertical com ponto** ligando uma seção à outra, vídeo do Vimeo em loop dentro dos ladrilhos. WordPress, sem biblioteca de motion |
| **Wedding Cinema Club** (weddingcinema.club) | Produtora de filme de casamento, Reino Unido | 7 | **Hero de vídeo em tela cheia** (saída dos noivos com chuva de pétalas) com título de 180px em Baskerville Display centralizado. Depois, fundo branco com **folhas em aquarela** nas bordas, algumas **desfocadas** em primeiro plano (profundidade de campo), painel de texto sobre **papel texturizado**, capitular, a rosa do logo repetida em traço. WordPress + jQuery |
| **The Grand LB** (thegrandlb.com) | Espaço de eventos, Long Beach, 7 salões até 675 convidados | 9 | **Vídeo dentro das letras:** "MOMENTS START" em serifa de 250px com o vídeo da casa aparecendo só pelo desenho das letras, sobre o creme. Hero de vídeo em moldura com canto arredondado e 24px de margem, título caixa-alta com tracking negativo, dois botões ("Make an inquiry" e "Take a tour"). **Marquee** com os tipos de evento em itálico ("& Fundraisers & Conferences & Church Services"), **slideshow dos espaços com botão de pausa e pontos**, números da casa (11 acres, 40K pés², 7 espaços), cartões com **ilustração em traço de nanquim** (o casal andando, o prédio, o telefone) |

---

## O que os quatro têm em comum (e por que o Marcelo gostou)

1. **Serifa de exibição gigante com itálico na palavra de emoção.** Austo (103px, itálico em
   "moments", "music", "connection", "feel", "trust"), Cinema (180px), Grand (91px). O itálico
   não é enfeite: marca a palavra que carrega o sentimento.
2. **Movimento que vem da marca, não de biblioteca.** As palmeiras da Austo são as do logo; a
   rosa do Cinema é a do logo; o "G" da fachada do Grand aparece no vídeo. O motion tem cara
   porque o objeto que se mexe é deles.
3. **Vídeo real do lugar ou do trabalho**, curto, sem som, em loop: no hero (Cinema, Grand),
   em cartões verticais (Austo), dentro de letra (Grand), em ladrilho (Boutique).
4. **Ornamento de papelaria de casamento:** arabesco (Boutique), aquarela botânica (Cinema),
   traço de nanquim (Grand), polaroid (Austo). É o repertório do convite impresso levado para a
   tela.
5. **Creme quente + uma cor profunda**: Austo `#F2EFEA` + verde `#184E4A`; Grand creme
   rosado + bordô; Cinema branco + malva. Nenhum usa mais de um acento forte.

---

## O que copiar

### A árvore do logo balançando no hero (Austo)

- Vídeo VP9 com canal alfa, 533x960, em loop, nas duas laterais do título, em cinza claro
  quase no tom do fundo. Não compete com o texto: é clima.
- Por que funciona: o visitante vê o símbolo do logo **existir** antes de ler qualquer coisa.
- Versão barata e mais leve: PNG/WebP com alfa e `transform: rotate()` de 1 a 2 graus com
  `transform-origin` na base, dois ritmos diferentes. Sem vídeo.

### Palavra de emoção em itálico dentro do título (Austo, Grand)

- Mesmo corpo, mesma família, só troca para o itálico. Duas palavras por título, no máximo.
- Copy: *"Unforgettable **moments** start with the **music**."*, *"More than music, it's about
  **connection**."*

### Vídeo dentro das letras (Grand)

- A palavra é uma máscara: o vídeo toca por baixo e só aparece pelo desenho das letras.
- Serve para fechar a página com o nome do lugar sem virar banner. Em HTML puro: SVG com
  `<mask>` (retângulo branco, texto preto) sobre um `<video>`, ou o texto recortando uma chapa
  da cor do fundo.

### Slideshow com pausa (Grand)

- Autoplay com **botão de pausa visível** e pontos: é o que o WCAG pede para conteúdo que se
  mexe sozinho por mais de 5 segundos, e o Grand é o único dos quatro que cumpre.

### Marquee dos tipos de evento em itálico (Grand)

- Uma faixa só, lenta, com as ocasiões. Transforma a lista seca em ritmo. Um por página.

### Moldura e fio condutor (Boutique)

- O passe-partout dá o ar de impresso. O fio vertical com ponto conduz o olho de uma seção à
  próxima sem régua horizontal.

---

## Tipografia e cor (medido no DOM)

| Site | Título | Corpo | Fundo · texto · acento |
|---|---|---|---|
| Austo | PP Editorial New 400 (itálico), 103px | Plus Jakarta Sans 15px | `#F2EFEA` · `#0A1B1B` · `#184E4A` |
| Boutique | Isabel 300, 80px caixa-alta | Texta 18px | `#FFFFFF` · `#3A4664` · rosa `#EAA0A2` |
| Cinema | Baskerville Display PT, 180px | Proxima Nova | `#FFFFFF` · `#212529` · malva `#9A7B80` (aparente) |
| Grand | Domaine 400, 91px, tracking -3,6px | Inter 16px + Lexend Zetta nos rótulos | creme rosado · `#311514` · bordô |

---

## O que não copiar

- **Gradiente rosa para azul no texto** (Boutique): é o antipadrão "texto com gradiente".
- **Caixa-alta com tracking de 11px em frase inteira** (Boutique: "WHERE YOU'RE TREATED LIKE
  FAMILY AND DON'T HAVE TO LIFT A FINGER..."): mata a leitura (`all-caps-body`).
- **Menu do Boutique sobreposto ao conteúdo** ao rolar: o cabeçalho fixo transparente passa por
  cima do texto e fica ilegível.
- **Polaroid com foto de casal ao lado de depoimento** (Austo): no nosso caso seria atribuir a
  foto de um casal ao texto de outra pessoa. Só vale se foto e depoimento forem do mesmo casal.
- **Números sem contexto** (Grand: "11 · 40K · 7"): funciona para quem já sabe o que é acre e pé
  quadrado. Capacidade por espaço diz mais.
- **"Vogue" com erro de digitação** (Cinema: "As seen in *Vouge* magazine"): selo de imprensa
  com typo destrói o próprio selo.
- **Hero só de vídeo sem quadro estático** (Cinema): no print e em conexão lenta, a primeira
  tela é um retângulo escuro. Vídeo de fundo precisa de `poster`.

---

## Aplicado onde

**Casa Verona, rodada 3 (24/09/2026)**, `clientes/_prototipos/casa-verona/site/`:
- A árvore do logo balançando (Austo) virou **os ciprestes do logo e do jardim dela**, pintados
  em aquarela (ChatGPT, fundo transparente), dos dois lados da janela do hero.
- Itálico na palavra de emoção em todos os títulos grandes.
- Slideshow com pausa (Grand), mas dentro da **janela em arco do logo**, não em tela cheia: as
  fotos do Instagram são retrato, e a janela também.
- Marquee dos tipos de evento (Grand), um só.
- Vídeo dentro das letras (Grand): "VERONA" no rodapé com o jardim dela tocando por dentro.
- Aquarela botânica (Cinema), mas com as flores da decoração real dela (lírio, rosa branca,
  mosquitinho, eucalipto), uma de cada, cada uma com função.
- Recusados: polaroid de depoimento, onda entre seções, passe-partout em volta da página toda.
