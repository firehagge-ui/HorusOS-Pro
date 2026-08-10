# Como montar, passo a passo

Duas opções. **GPT Personalizado** é o mais robusto (recomendado). **Projeto** é o
mais simples. Escolha uma.

---

## Opção A — GPT Personalizado (recomendado)

Precisa de ChatGPT Plus/Pro.

1. ChatGPT → menu lateral → **GPTs** → **Criar** (ou "Explorar GPTs" → "+ Criar").
2. Aba **Configurar** (Configure), preencha:
   - **Nome:** `Designer da Mayara`
   - **Descrição:** `Diretor de arte do @universpsiquee. Lapida carrosséis de psicologia, arte e filosofia no estilo Galeria.`
   - **Instruções:** cole o bloco de [1-instrucoes-do-projeto.md](1-instrucoes-do-projeto.md).
3. **Conversation starters** (starters), cole estes quatro:
   - `Vou te mandar um slide. Me dê ajustes para deixar mais elegante.`
   - `Me ajuda a escrever a copy de um carrossel a partir de uma obra de arte.`
   - `Sugira 3 obras de domínio público para um post sobre [tema].`
   - `Gera uma arte de fundo (sem texto) no clima da marca para [tema].`
4. **Knowledge:** clique em *Upload files* e suba
   [2-conhecimento.md](2-conhecimento.md).
5. **Capabilities:** deixe marcado *DALL·E Image Generation* (para as artes de
   fundo) e *Web Search* (para conferir ficha de obra). Pode desmarcar Code
   Interpreter.
6. **Salvar** → "Somente eu" (Only me) já basta.

Pronto. Toda conversa com esse GPT já sabe a identidade.

---

## Opção B — Projeto

1. ChatGPT → menu lateral → **Projetos** → **Novo projeto** → nome `Mayara`.
2. Nas **instruções do projeto**, cole o bloco de
   [1-instrucoes-do-projeto.md](1-instrucoes-do-projeto.md).
3. Nos **arquivos do projeto**, suba [2-conhecimento.md](2-conhecimento.md).
4. Toda conversa aberta dentro do projeto já nasce com o contexto.

---

## A referência visual (importante)

O ChatGPT lê texto do conhecimento, mas **não "vê" o acabamento** sem imagem. Na
primeira conversa de cada peça, **anexe os três exemplos** para ele calibrar o olho:

- [exemplo-slide-capa.png](exemplo-slide-capa.png)
- [exemplo-slide-reflexao.png](exemplo-slide-reflexao.png)
- [exemplo-slide-cta.png](exemplo-slide-cta.png)

Diga: *"Este é o acabamento da marca. Mantenha esse nível ao me dar notas."*

---

## Teste rápido (pra ver se ficou bom)

Abra o GPT/projeto e mande:

> "Sem gerar imagem, me diga em 5 linhas o que caracteriza a identidade visual da
> Mayara e o que é proibido por compliance."

Se ele responder citando a paleta, o conceito "Galeria", a obra real e as travas do
CFP (sem promessa, sem quiz, CRP visível, CVV), está alimentado certo. Se ele
inventar cor ou esquecer o CFP, o arquivo de conhecimento não subiu.

---

## O fluxo do dia a dia (a dupla funcionando)

1. A Horus (Claude) te entrega o **rascunho renderizado** de um post (PNGs reais).
2. Você abre o GPT, anexa um slide e pede: *"como deixar mais elegante e editorial?"*.
3. Ele te devolve **notas**. Você me traz as notas.
4. Eu aplico no `build.js` e re-renderizo. O texto e a obra continuam intactos.

Lembrete: se ele te oferecer "gero a versão final em imagem", **recuse** — sai com
texto quebrado e obra falsa. O papel dele é opinar e gerar fundo, não fechar o slide.
