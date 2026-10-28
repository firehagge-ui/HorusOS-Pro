# Imagem e slide no ChatGPT, com o carrossel coerente

> 23/10/2026. O Marcelo monta os posts da May no projeto do ChatGPT "Mayara Barros Redes Sociais" e o
> resultado é bonito; o problema é manter a cara igual entre os slides. Base: o que se viu no projeto
> (9 conversas, 16 referências nas Fontes), os testes com o Codex (`ferramentas/agy/teste-2026-10-23.md`)
> e o guia de prompt de imagem da OpenAI (cookbook, abr/2026). Ler junto com `20-direcao-de-arte.md`.

## A ordem que não se pula

1. **Plano completo primeiro**, sem abrir o ChatGPT: formato, objetivo, a ficha de direção de arte
   (`20-direcao-de-arte.md` §6) e o roteiro slide a slide com **texto exato**, função de cada slide,
   layout e imagem. Aprovado pelo Marcelo (texto e ficha juntos).
2. **Conversa nova dentro do projeto da marca.** O projeto carrega as Fontes (as referências visuais que
   o Marcelo juntou) e o conhecimento; conversa solta não vê nada disso e o estilo deriva. Um carrossel =
   uma conversa.
3. **Colar o roteiro inteiro no primeiro pedido** e dizer que os slides vêm um por vez. O modelo precisa
   saber o conjunto pra o slide 1 já nascer da série.
4. **Slide âncora:** gerar a capa, ajustar até aprovar. Ela vira a referência de todos os outros.
5. **Cada slide seguinte** pede: "mesmo estilo do slide 1" + a **lista do que se preserva** repetida
   (paleta em hex, fontes, cabeçalho e rodapé, textura, luz, margem) + só o que muda. O guia da OpenAI
   chama isso de repetir a lista de preservação a cada rodada; é o que segura a deriva.
6. **Texto entre aspas, literal**: "Escreva exatamente: '...' sem nenhum caractere a mais". Palavra rara
   ou nome próprio, soletrar.
7. **Folha da série** (todos os slides lado a lado) antes de mostrar: o que destoou volta pra geração.

## O que conferir em cada slide gerado

- Zoom em todo texto pequeno: CRP, ficha da obra, acento, nome. O texto grande sai limpo hoje; o pequeno
  ainda erra.
- A obra: comparada lado a lado com a imagem real anexada. Obra redesenhada pela IA não vai com ficha de
  museu (motivo da regra da May de 03/08, que continua valendo pra obra).
- Cabeçalho e rodapé iguais em todos (a moldura da marca).

## Limites conhecidos

- **Nu é bloqueado.** Pintura clássica com nu (o *Sísifo* de Ticiano) foi recusada pelo filtro de
  segurança no teste de 23/10. Nesses casos: o gerador faz só a cena (moldura vazia, mesa, luz, folhas) e
  o código encaixa a obra real e o texto (modo híbrido, `build.cjs`).
- **Não é editável.** Trocar uma palavra é gerar de novo. Por isso o texto é aprovado antes (passo 1).
- **Rosto e o que o cliente vende nunca por IA** (regra da casa, `CLAUDE.md`). A série com personagem
  constante (@ideiasquepagam25) funciona no nicho deles; aqui, rosto só o real e com autorização.

## Recurso pra consistência máxima: o panorama

Quando o carrossel é uma cena contínua (uma mesa que atravessa os slides, uma linha do tempo), gerar
**uma imagem larga** e fatiar em slides do mesmo tamanho: a continuidade é garantida porque é uma imagem
só. Técnica conhecida como carrossel contínuo (fatias de 1080 × 1350 lado a lado, sem pular a emenda).
O gerador entrega no máximo 1536 px de largura, então serve pra 2 ou 3 slides por imagem.

## Automatizar sem o Chrome

O `codex exec` (logado no ChatGPT do Marcelo) gera imagem pelo terminal, sem Claude e sem Chrome,
aceita imagem anexada (`-i`) e foi testado em 23/10. O que ele ainda não tem: as Fontes do projeto.
Pra chegar perto do estilo do projeto, anexar as referências aprovadas da marca no próprio pedido.
