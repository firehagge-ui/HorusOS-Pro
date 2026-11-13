# Mapa do Instagram e do conteúdo (Horus e clientes)

> Ponto de partida pra qualquer trabalho de post, carrossel, Reels, Mídia ou agente de conteúdo. Reorganizado em
> 29/10/2026 a pedido do Marcelo, juntando o que foi feito em vários chats de 27/09 a 29/10. Regra da casa: o que se
> aprende vai pro arquivo certo listado aqui, e este mapa ganha a linha nova.
>
> Ordem de precedência: compliance do cliente > `_memoria/integridade.md` > `marca.md` do cliente > esta pasta.

## O processo, em uma linha

**Pauta** (o Mídia pesquisa toda quinta) → **Marcelo aprova os temas** → **esboço** de cada post (Claude, `/carrossel`)
→ **Marcelo aprova o esboço** → imagens e slides → conferência → **Marcelo aprova na tela Semana** → publicação pela
API. Detalhe e quem faz cada etapa: `30-quem-faz-o-que.md`.

## 1. Doutrina (ler antes de produzir; esta pasta)

| Arquivo | O que tem |
|---|---|
| `00-formatos.md` | Os nove formatos narrativos. Escolher UM antes de escrever |
| `10-legibilidade.md` | Pisos de fonte, contraste, dimensão e densidade |
| `20-direcao-de-arte.md` | Moldura fixa e mundo variável, a imagem que mostra a ideia, catálogo de linguagens, ficha de direção de arte (23/10) |
| `25-imagem-no-chatgpt.md` | Plano antes, projeto com Fontes, slide âncora, lista de preservação, limites (23/10) |
| `30-quem-faz-o-que.md` | O fluxo, Claude × Mídia × Agy × Codex, rotas de imagem, vídeo no Google Flow, o teste do Agy (29/10) |
| `90-antipadroes.md` | Cada correção do Marcelo, com o porquê. Cresce a cada reprovação |
| `91-o-que-veio-do-opensquad.md` | O que veio do opensquad e o que foi recusado (03/08) |
| `99-checklist.md` | A porta antes de entregar: vetos e rubrica |
| `referencias/` | Estudos de contas reais com folhas e números (`2026-10-23-estudo.md`) |

## 2. Skills

| Skill | Pra quê |
|---|---|
| `/carrossel` | A central: pauta, esboço, imagem, slides, checklist, legenda. O "padrão da casa" no topo dela também vai dentro do pedido do Mídia |
| `/midia` | Conversar com o 📣 Mídia: estado, rotinas, pedir a pauta agora, ajuste, pausa |
| `/publicar-tema` e `/aprovar-post` | Fluxo antigo de artigo de blog + carrossel no site com publicação pela API. O Instagram da Horus hoje passa pelo Mídia e pela tela Semana |

## 3. Marca e estratégia da Horus no Instagram (`identidade/social/`)

| Arquivo | O que tem |
|---|---|
| `perfil.md` | Pra que serve o canal, público, pilares, cadência, voz, o que nunca vai ao ar, visual, autonomia |
| `referencias/2026-10-07-essencia.md` | A essência que o Marcelo quer (07/10): o que é tema "sexy" pra ele, prova visual, gancho de curiosidade |
| `referencias/perfis.md` | Os perfis de referência dele (e os de apoio achados em 23/10) |
| `referencias/2026-10-10-valerio.md`, `2026-10-10-brun0gpt.md`, `2026-10-15-brunofraga/` | Estudos de perfil |
| `carrossel-referencia.html` | A identidade travada dos carrosséis da Horus |
| `elementos/` | Elementos visuais aprovados, reaproveitáveis |
| `auditoria-2026-09-27.md` | A auditoria inicial do perfil |

## 4. Ferramentas

| Peça | Onde | O que faz |
|---|---|---|
| 📣 Mídia | `ferramentas/hound-dog/farejador/midia.mjs` (seção do Mídia no `ferramentas/hound-dog/CLAUDE.md`) | Rotinas em `social_rotinas`: `pauta` (quinta 8h), `publicar`, `token`, `caixa`. Desligadas: `semana`, `triagem`, `metricas` |
| Motor social | `ferramentas/social/` (`README.md`, `ARQUITETURA.md` §7 e §8) | API da Meta (`lib/meta.mjs`), política de autonomia, marcas, séries de slide (`lib/carrossel-v2.mjs`) |
| Render | `ferramentas/social/bin/render-carrossel.mjs` | HTML → PNG e JPG, miniatura pro painel |
| Radar de referência | `ferramentas/social/bin/referencias.mjs` | Perfil (12 posts, curtidas, outlier) e download de carrossel com folha, pelo Playwright sem login |
| Pedido da pauta pro Agy | `ferramentas/hound-dog/scripts/pedido-pauta-agy.mjs` | Monta o mesmo pedido que o Mídia recebe, pra comparar |
| Tela do Hounder | Instagram → Semana, Agenda, Agora, Caixa, Aprendizados; Estúdio (editor de carrossel) | Aprovar, ver rotinas, editar à mão |
| Agy | `ferramentas/agy/` (`teste-2026-10-23.md`, `teste-2-plano.md`, prompt e schema) | Agente do Google em teste |

## 5. O que já foi feito (arquivo)

- Posts da Horus: `marketing/conteudo/midia/<semana>/<slug>/` (carrossel.html, legenda, img, instagram).
- Pautas: `marketing/conteudo/midia/pautas/<segunda>.md`; o radar de cada uma em `<segunda>-radar/`.
- Banco: `social_posts` (status e parecer de cada post), `social_aprendizados` (lições que o Mídia lê),
  `social_acoes` (diário).
- Reprovados e por quê: `90-antipadroes.md` e o campo `revisao->>'instrucoes'` de cada post.

## 6. Clientes

- **Mayara Barros** (@universpsiquee, CFP): `clientes/mayara-barros/` (`marca.md` com a direção "Galeria", `CLAUDE.md`
  com o estado, `conteudo/`). O projeto dela no ChatGPT tem as Fontes visuais (`25-imagem-no-chatgpt.md`).
- Cliente novo com Instagram: `marcas/<id>.json` no motor social + token próprio; a doutrina daqui vale igual.

## 7. Memória automática (lembretes entre conversas)

`feedback_pauta-antes-do-post`, `feedback_post-nunca-repete-visual`, `feedback_instagram-sempre-playwright`,
`reference_instagram-fotos-embed`, `reference_chatgpt-imagem-pelo-chrome`, `project_agente-social`,
`project_conteudo-horus-outubro`, `project_agy-agente`, `reference_google-flow`.
