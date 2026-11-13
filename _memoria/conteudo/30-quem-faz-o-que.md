# Quem faz o quê na produção de post e carrossel

> Juntado em 29/10/2026 a pedido do Marcelo ("alinhe tudo e organize, para que você consiga usar depois"), a partir do
> teste do Agy (`ferramentas/agy/teste-2026-10-23.md`), da rotina de pauta do Mídia (28/10) e das rotas de imagem e vídeo
> que a casa tem. Vale pra Horus e pra todo cliente com Instagram; compliance e `marca.md` vencem tudo daqui.

## 1. O fluxo (o mesmo pra toda marca)

| Etapa | Quem faz | Quem aprova | Onde fica |
|---|---|---|---|
| 1. Pesquisa e pauta da semana | 📣 Mídia, sozinho, toda **quinta às 8h** (rotina `pauta`): radar dos perfis de referência pelo código + Opus com busca na web | **Marcelo** (1ª aprovação: os temas) | `marketing/conteudo/midia/pautas/<segunda>.md` + tarefa no Hounder + aviso no WhatsApp |
| 2. Esboço de cada post | Claude, pela `/carrossel` (Passos 1 a 3): referência olhada, capa, slide a slide com função, texto exato, imagem e layout, ficha de direção de arte | **Marcelo** (2ª aprovação: o esboço) | no chat + pasta do post |
| 3. Imagens | Uma das rotas da §3 | o esboço já diz o que cada imagem mostra | `<post>/img/` |
| 4. Slides (HTML → PNG/JPG) | Código: `ferramentas/social/bin/render-carrossel.mjs` | | `<post>/instagram/` |
| 5. Conferência | Claude: checklist, antipadrões, olho na folha da série; compliance em cliente regulado | | |
| 6. Aprovação final | **Marcelo** na tela Semana do Hounder | | `social_posts` |
| 7. Publicação e métricas | Farejador pela API oficial da Meta (rotina `publicar`) | | |

Nenhum slide nasce antes das duas aprovações (Marcelo, 28/10/2026). A rotina antiga `semana`, que montava os slides
direto, está desligada.

## 2. Os agentes e onde cada um entra

| Agente | O que faz bem | Onde **não** entra | Estado em 29/10/2026 |
|---|---|---|---|
| **Claude Code** (esta conversa, `/carrossel`) | Esboço, fala humana, decisão de direção de arte, conferência final, compliance, conversa com o Marcelo | Trabalho braçal de volume quando houver alternativa testada | Em uso |
| **📣 Mídia** (Claude dentro do Farejador) | Pesquisa e pauta toda quinta; publicação e métricas pela API | Montar slide sozinho (desligado em 28/10) | Rotina `pauta` ligada; reiniciar o Farejador pra valer |
| **Agy** (Antigravity CLI, Gemini na cota do Google) | **Buscar e trazer, com prova:** imagens do ChatGPT, Instagram pelo Playwright, prints, fontes de pesquisa de mercado (ver abaixo) | Tema, ideia, pauta, texto, escolha de imagem, slide, veredito, qualquer coisa logada no Instagram | Logado desde 29/10. Pauta reprovada (teste A); imagens em teste em 03/11 (teste B) |
| **Codex** (CLI com a assinatura do ChatGPT) | Imagem pelo modelo do ChatGPT direto no terminal, sem Chrome; segunda opinião de código | Imagem que precisa das Fontes do projeto da marca no ChatGPT | Testado em 23/10 (1 min 26 por imagem) |
| **Marcelo** | Tema, esboço, gosto, aprovação final, login em qualquer conta | | |

Onde o Claude **sempre** entra: o esboço (é ali que o post ganha ou perde), a conferência final contra o esboço e o
checklist, e o compliance de cliente regulado. No teste de 23/10 o Agy errou o estado da May, deixou passar uma frase
que soava como promessa (CFP) e declarou "zero defeito" com acento torto num slide: quem confere é o código e o
Claude, não o agente que produziu.

### O papel do Agy: buscar e trazer, nunca decidir (Marcelo, 29/10/2026)

Depois da pauta reprovada no teste A (fonte inventada, número distorcido, "péssimas ideias"), o Marcelo definiu: o Agy
**busca e traz o material bruto, com prova**; o Claude pensa, escolhe e escreve. Funções dele:

1. **Pedir as imagens ao ChatGPT e trazer pra pasta do post.** O Claude escreve `<post>/pedido-imagens.json` a partir
   do esboço aprovado (conversa ou projeto, e cada imagem com arquivo, pedido exato e slide). O Agy abre o ChatGPT no
   Chrome separado (`chrome-agy`, Playwright pela porta 9333), pede **na mesma conversa** (série coerente), baixa pra
   `<post>/img/` com o nome pedido e devolve `img/relatorio.json` (arquivo, pedido, link da conversa, falhas). Como o
   perfil separado entra na mesma conta do ChatGPT, os projetos com Fontes (o da May) também ficam disponíveis.
2. **Ver Instagram**: perfis de referência e de concorrente pelo Playwright sem login (`ferramentas/social/bin/referencias.mjs`),
   baixando os slides e a folha. Traz o post, os números lidos na página e o código, não a opinião sobre ele.
3. **Tirar prints e mandar**: tela de ferramenta, site, ficha do Google, página oficial, pra prova visual de post ou pra
   estudo. Cada print com o link e a data de onde saiu.
4. **Pesquisa de mercado**: juntar fontes sobre um tema ou nicho (notícia, estudo, concorrente, preço), cada achado com
   link, data e o trecho literal copiado da página. Sem resumo que não tenha o trecho junto.

O Agy **não** propõe tema nem ideia, **não** escreve pedido nem texto de post, **não** escolhe imagem, **não** monta slide
e **não** dá veredito. Tudo que ele traz passa pelo Claude antes de virar pauta, esboço ou post: no teste A ele citou
um manual da Horus que não existe, com confiança "alta".

Travas do Agy: ele roda com `toolPermission: always-proceed` (executa qualquer comando sem pedir), então trabalha em pasta
própria, nunca com sessão logada do Instagram, nunca publica, e lê regras do `AGENTS.md` (que está velho em relação ao
`CLAUDE.md`; enquanto não for regerado, o pedido manda ele ler o `CLAUDE.md` e este arquivo).

## 3. Rotas de imagem (o ChatGPT gera as melhores, Marcelo 29/10/2026)

| Rota | Como | Quando usar | Cuidado |
|---|---|---|---|
| **A. Claude in Chrome** | O Claude abre o ChatGPT no Chrome do Marcelo, pede e baixa (método na memória `reference_chatgpt-imagem-pelo-chrome`) | Padrão hoje; série que precisa das **Fontes do projeto da marca** (May) | Chrome do Marcelo aberto; gasta Claude; uns 2 min por imagem |
| **B. Codex no terminal** | `codex exec --skip-git-repo-check --sandbox workspace-write "<pedido>" -i ref.png < /dev/null` (pedido antes do `-i`) | Imagem avulsa, sem Chrome, sem Claude | Não usa o projeto nem as Fontes do ChatGPT |
| **C. Agy + Playwright no Chrome** | O Agy liga o Playwright num Chrome com o ChatGPT logado e puxa as imagens (liberado pelo Marcelo em 29/10) | Lote de imagens de um post já com esboço aprovado | A ser validado no teste B (§4). O Chrome novo não aceita depuração remota no perfil principal: o caminho provável é um perfil separado do Chrome, logado pelo Marcelo uma vez. Nunca o Instagram nesse perfil |
| **D. Gerador nativo do Agy** | Ferramenta `generate_image` do Agy | Textura e fundo simples | Qualidade abaixo do ChatGPT; sai 896 × 1200 |

Em qualquer rota: plano e esboço antes da imagem (`25-imagem-no-chatgpt.md`), e IA nunca no print de ferramenta,
no gráfico com número, no rosto nem no produto ou lugar que o cliente vende.

## 4. O teste do Agy (marcado em 29/10/2026)

Protocolo, comandos e o que medir: `ferramentas/agy/teste-2-plano.md`. Em resumo:
- **Antes:** o Marcelo entra no Agy (`agy` no terminal e login). Login é sempre dele.
- **Teste A, pauta:** o Agy faz a mesma pesquisa da semana de 02/11 com o mesmo radar; as duas pautas lado a lado, sem
  dizer qual é qual.
- **Teste B, imagens e slides:** com o esboço de um post da semana de 02/11 aprovado, o Agy gera as imagens pela rota C e
  monta os slides; o Claude confere e compara com a rota A.
- **Depois:** o Marcelo decide se o Agy entra no fluxo, e em qual etapa.

## 5. Vídeo curto: Google Flow

O Marcelo tem o **Google Flow** (ferramenta de vídeo do Google, com os modelos Veo) pra gerar vídeo curto. Serve pra
Reels: abertura em movimento, cena de apoio, transformar a ideia de um carrossel forte num vídeo de 15 a 20 segundos
(hipótese do Mídia de 26/10: carrossel segura quem segue, Reels traz gente nova). Regras: as mesmas da imagem (nada de
rosto, produto ou lugar do cliente feito por IA), texto e número por cima, em edição, nunca dentro do vídeo gerado.
Como operar (pelo Marcelo, pelo Claude in Chrome ou pelo Agy) ainda não foi testado: anotar aqui o primeiro uso.

## 6. Resultados dos testes

- **Teste A, pauta (29/10/2026): o Agy não faz pauta sozinho.** 5 min contra 13 do Mídia e sem gastar o Claude, mas
  inventou uma fonte ("Manual de Produção Visual da Horus") e distorceu dois números com confiança "alta", e repetiu 4
  temas recusados que estavam no pedido. Acertou o que o Mídia errou: segunda, 02/11, é Finados. Detalhe em
  `ferramentas/agy/teste-2-plano.md`. Regra que fica pra qualquer agente rápido: **fonte e número dele só valem depois
  de conferidos na origem**. O Marcelo, sobre as 6 capas do Agy: "Odiei, péssimas ideias" (a pauta do Mídia ele
  tinha amado). **Pauta e ideia ficam com o Claude**; o Agy só entra onde o resultado se confere por código ou pelo olho.
