# Casa Verona — protótipo (lead, espaço de eventos, Pituba/Salvador)

> ⚠️ **LEAD, não cliente.** Protótipo feito antes do fechamento, para a reunião. Não entra
> no roteiro de clientes do `CLAUDE.md` da raiz. Estado comercial no Hound Dog (quem
> atualiza é o Marcelo). Se não vender, vira template **sem as fotos dela** (ver
> `../README.md`).

## ⚠️ Recusou em 24/09/2026

Abordada por WhatsApp em 24/09. Resposta dela: "Não temos como ter uma vitrine com valores e
opcionais pq são várias variantes (...) O cliente tem que entrar em contato conosco. Gostamos
da forma humanizada de atendimento. Não tenho interesse em um molde engessado." Ela entendeu
a oferta como tabela de preço. A pedido do Marcelo, o site virou template **sem nada dela** em
`templates/sites/espaco-eventos/`. As fotos, vídeos e o logo dela continuam só nesta pasta, à
espera da decisão do Marcelo (apagar ou guardar). O resto deste arquivo é histórico.

## Estado (23/09/2026)

- **Comercial:** qualificado no Hound Dog, sem contato ainda. Plano de abordagem: mensagem
  curta pedindo licença para mostrar, e reunião marcada para a semana seguinte, com o
  protótipo pronto (conversa de 23/09). A tese é a **Variação A** do dossiê
  (`saidas/prospeccao-2026-09-20/dossie-prospeccao-v2.html`, ficha 02).
- **Produção:** protótipo em `site/`, **rodada 3 (24/09/2026)**, pedido do Marcelo com 4
  referências (`referencias/eventos-emocao-quatro-sites.md`): hero virou **a janela do logo**
  (arco de tijolo em traço, sacada de ferro, ciprestes balançando) com **3 fotos da casa
  passando dentro** e botão de pausa; título *"Momentos inesquecíveis numa vila italiana, na
  Pituba"*; faixa dos tipos de evento que anda com a rolagem; manifesto palavra a palavra;
  **3 vídeos reais dos reels dela**; "VERONA" com o jardim tocando dentro das letras no rodapé;
  ornamentos em aquarela gerados no ChatGPT (ciprestes e flores brancas, nunca a casa).
  GSAP + ScrollTrigger + Lenis copiados em `site/assets/vendor/`. Plano e passe duplo em
  `PLANO.md`. Rodada 1 e 2 em `versoes/` (só HTML/CSS/JS, para consulta).
- **Verificado em 24/09/2026:** detector `npx impeccable@4.0.4` exit 0; render no Chrome em
  1440 e 390; hero estável em 11 tamanhos (1920 a 360) nas 3 fotos, sem rolagem lateral;
  slideshow troca, pausa e obedece aos numerais; "reduzir movimento" deixa tudo parado e
  visível; carga inicial 697 KB + 133 KB de fontes (vídeos só baixam perto da tela).
- ⚠️ Arquivo solto `site/Confraternização com palco e forró ao vivo` (cópia antiga do
  index.html, sem extensão, data de 24/09 às 00:29). Não foi criado nesta rodada;
  esperando o Marcelo dizer se apaga.

## Arquivos

- `briefing.md` — tudo o que se sabe, com fonte, e as pendências da reunião
- `marca.md` — marca observada no logo e nas fotos (cor, tipo, voz)
- `PLANO.md` — passe duplo, seções, assinatura
- `fotos/instagram/` — o material bruto baixado (posts dela e de fotógrafos que a marcaram)
- `fotos/selecionadas/` — as 29 escolhidas, com nome descritivo
- `fotos/FONTES.md` — de qual post veio cada foto e quem fotografou (e os vídeos da rodada 3)
- `ornamentos-ia/` — os PNG originais do ChatGPT (fundo transparente) e os recortes
- `site/` — o protótipo (`img/`, `video/`, `assets/vendor/`)

## Regras deste protótipo

- 🔴 **Nada sobre som, volume ou vizinhança**, nem no site nem na conversa.
- 🔴 **Nenhuma foto da igreja** (a cerimônia do post da Alécsia e do Marcio foi em outro lugar).
  Só entra foto tirada **na casa**.
- 🔴 **Depoimento só literal**, com nome, fonte e data. O Google corta os textos longos: usar
  só frases completas, com reticências no corte, nunca completar.
- Crédito do fotógrafo no rodapé do site.
- `noindex` enquanto for protótipo.
- Pendências: tecla **P** alterna entre modo apresentação e modo trabalho.
- 🔴 **IA só em ornamento botânico** (ciprestes, flores, ramos). O lugar é sempre foto ou vídeo
  real dela. Cada ornamento aparece uma vez. Se não vender, os vídeos e fotos dela saem junto.
- O "VERONA" do rodapé é máscara SVG sobre vídeo: logotipo decorativo (`aria-hidden`), exceção
  de logotipo do WCAG 1.4.3. O texto da máscara herda a cor creme de propósito (é o que se vê
  na letra); não é contraste escondido.
