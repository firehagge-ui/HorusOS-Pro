# Site da Aion, versão 3 (15/10/2026, noite): plano

> **Por que existe:** o Marcelo reprovou a v2: "bem feinho e simples demais, eu entro e já fico com tédio, meio
> genérico. Pelo menos o anterior tinha figuras no fundo. Faltou a seção de serviços. Gostava das outras páginas, mas
> você tirou." Pediu referência pesada nos sites de clínica de psicologia do Dribbble, do Webflow e do Awwwards, a
> skill que tira elemento e fonte de IA (impeccable), e tirar o que é repetido.
> A v2 fica em `../site-v2/` como histórico; a v1 em `../site/`.

## O que as referências ensinaram (estudo de 15/10, 30 modelos do Webflow + Dribbble + Awwwards)

Prints e grade em `referencias/psicologia-webflow-dribbble-2026-10.md`. O que se repete nas bonitas (Stillpoint,
Mindoor, Selora, Calma, Atmawell, Kijani):

1. **Imagem grande em toda seção.** É o que faltava na v2. Aqui vem de foto real do Instagram da Aion (equipe, Tutti,
   congressos), dos retratos da equipe e, só onde não existe foto real, das quatro imagens ilustrativas da v1, com aviso.
2. **Título em serifa com uma palavra em itálico colorido** (Mindoor "Healing Starts Here", Selora "Live Better").
3. **Moldura em arco** e fotos sobrepostas (Selora, Mindoor).
4. **Faixa de palavras grandes** entre seções (Selora "MINDFUL MOVEMENT ✳ HOLISTIC WELLNESS").
5. **Serviços em cartões com foto**, título, público e seta (Selora, Calma), cada um levando à página do serviço.
6. **Equipe em retratos grandes** (Mindoor "Meet our experts").
7. **Perguntas com algo visual ao lado** (Mindoor).
8. **Chamada final em campo de cor com rostos em órbita** (Mindoor "Start your Healing").
9. **Rodapé com a palavra enorme** (Selora "WELLNESS", Loguna).
10. Depoimentos aparecem em todas, e **aqui não entram** (CFP). No lugar: os congressos reais da Tutti, que provam
    o mesmo (confiança) com fato.

## Direção (contrato, repetido no topo do HTML)

- **TESE:** a clínica de 22 anos aparece do tamanho que ela é: gente real, a fundadora em congresso, a equipe junta.
- **MUNDO:** a paleta inteira da marca, não só o creme: campos de terracota escura e pêssego (como os posts dela),
  serifa Gambetta com itálico, arcos, a botânica e o labirinto do logo.
- **PRIMEIRA TELA:** título com a frase da bio dela à esquerda; à direita, a Tutti num arco grande, a equipe num arco
  pequeno sobreposto, o selo circular "desde 2004" com o labirinto.
- **Fontes:** Gambetta (títulos) e Switzer (texto), da Fontshare, licença gratuita para uso comercial. Saíram EB
  Garamond (a casa chegou a ela por reflexo) e Karla. Jost fica só no logotipo.

## Estrutura

- `index.html`: abertura · faixa de serviços · sobre (equipe + ficha) · serviços (7 cartões + 1 de ajuda) · como
  começa · quem atende · aprendizado (congressos) · no Instagram · perguntas · chamada final com contato · rodapé.
- **Sete páginas de serviço** (voltaram, a pedido): `atendimento-psicologico`, `avaliacao-neuropsicologica`,
  `intervencao-neuropsicologica`, `psicopedagogia` (nova), `orientacao-familiar`, `orientacao-profissional`,
  `grupo-apoio-parental`. Texto da v1, já revisado pela régua do CFP.

## O que saiu por ser repetido

- "Por onde começar" separado dos serviços (v2) e "Quando procurar" + grade de serviços (v1) diziam a mesma coisa duas
  vezes: a frase da situação virou o subtítulo de cada cartão de serviço e o destaque da página do serviço.
- O bloco da avaliação neuropsicológica saiu da home e mora na página dela.
- Nenhuma foto aparece em duas seções da home.
