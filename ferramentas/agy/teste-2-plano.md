# Teste 2 do Agy: pauta, imagens e slides de verdade (marcado em 29/10/2026)

O Marcelo pediu em 29/10: "confira o que o Agy vai fazer e se ele estará aprovado, e vamos agendar um teste mesmo".
O primeiro teste (`teste-2026-10-23.md`) rodou em pasta de brinquedo, com a May. Este roda no trabalho real da Horus,
na semana de 02/11, sempre lado a lado com o caminho atual, pra comparar.

**Estado do Agy em 29/10:** em teste, **não aprovado pra produção**. Deslogado desde 25/10.
Quem e o que, no quadro geral: `_memoria/conteudo/30-quem-faz-o-que.md`.

## Antes (Marcelo)

1. No terminal, `agy` e entrar com a conta Google. Login é sempre dele, nunca por automação.
2. Pro teste B: abrir um **perfil separado do Chrome** só pra isso e entrar no ChatGPT nele, uma vez. O Chrome não deixa
   o Playwright entrar pela porta de depuração no perfil principal; um perfil próprio também mantém o Agy longe do
   Instagram, do e-mail e do banco. Comando que abre esse perfil (a pasta é criada na primeira vez):
   ```
   "C:\Program Files\Google\Chrome\Application\chrome.exe" --user-data-dir="E:\Users\hagge\chrome-agy" --remote-debugging-port=9333 https://chatgpt.com
   ```

## Teste A: a pauta (sexta, 30/10)

A mesma pesquisa que o 📣 Mídia fez pra semana de 02/11 (`marketing/conteudo/midia/pautas/2026-11-02.md`, Opus, 13 min),
agora pelo Agy com Gemini, com o mesmo pedido e o mesmo radar.

```
node ferramentas/hound-dog/scripts/pedido-pauta-agy.mjs 2026-11-02
agy -p "Leia o arquivo ferramentas/agy/teste-2/pedido-pauta.txt e faça exatamente o que ele pede. Abra as folhas citadas no radar. Responda só o JSON do schema." --json-schema ferramentas/agy/teste-2/schema-pauta.json --output-format json > ferramentas/agy/teste-2/pauta-agy.json
```
(rodar da raiz `HorusOS\`; esperar o processo terminar, não a primeira linha: o Agy responde em partes.)

**O que medir:**
- tempo;
- quantas fontes ele abriu de fato;
- erro de fato: fonte que não diz o que ele afirma, data errada, tema já reprovado;
- quantas ideias passam nas regras de 28/10 (capa até 10 palavras, cena de abertura, prova visual real);
- **qual pauta o Marcelo prefere sem saber qual é qual** (o Claude embaralha e mostra as duas como "pauta 1" e "pauta 2").

## Teste B: o Agy pede as imagens ao ChatGPT e traz (terça, 03/11)

Escopo reduzido pelo Marcelo em 29/10: **essa é a única função do Agy**. Os slides continuam com o Claude e o código.
Depois que o Marcelo aprovar o esboço de um post da semana (feito pelo Claude na `/carrossel`):
1. O Claude escreve `<post>/pedido-imagens.json`: conversa ou projeto do ChatGPT, e cada imagem com arquivo, pedido
   exato e slide.
2. O Agy liga o Playwright no Chrome do passo 2 (`chromium.connectOverCDP('http://localhost:9333')`), faz os pedidos na
   mesma conversa, baixa cada imagem pra `<post>/img/` com o nome pedido e escreve `<post>/img/relatorio.json` (arquivo,
   pedido, link da conversa, falhas). Não muda pedido, não escolhe, não mexe em outro arquivo.
3. O Claude confere cada imagem contra o esboço e compara com a mesma série gerada pelo Claude in Chrome.

**O que medir:**
- tempo por imagem e no total;
- imagens aproveitadas na primeira tentativa;
- se seguiu o pedido ao pé da letra (nome, conversa, ordem) e se tocou em algo fora da pasta `img/`;
- se o ChatGPT barrou a automação;
- quanto do limite do Claude foi poupado contra o Claude in Chrome.

## Travas do teste

- Nada publicado, nada no Instagram logado, nenhum login feito pelo Agy.
- O Agy roda com `always-proceed`: só dentro de `ferramentas/agy/teste-2/` e do perfil `chrome-agy`.
- Se o ChatGPT barrar a automação (verificação de robô), parar e anotar. Não tentar contornar.

## Depois

O Marcelo decide, com os números:
- se o Agy entra no fluxo, e em qual etapa (pauta, imagem, slides);
- a decisão 1 do teste de 23/10 (imagem do Mídia fora do Claude);
- a decisão 2 (piloto do rascunho pelo Agy).

O resultado entra aqui e no `_memoria/conteudo/30-quem-faz-o-que.md`.

## Resultado do teste A (29/10/2026, rodado na hora a pedido do Marcelo)

Agy 1.4.9, Gemini 3.8 Flash (High), `--sandbox`, mesmo pedido do Mídia (`teste-2/pedido-pauta.txt`, 151 mil caracteres) e
radar relido em 29/10. Saída em `teste-2/pauta-agy.json`.

| | 📣 Mídia (Opus, 28/10) | Agy (Gemini Flash, 29/10) |
|---|---|---|
| Tempo | 13 min (radar incluso; o Opus em si, 6 min 40) | **5 min 22** |
| Gasto | limite da assinatura do Claude | 138 mil tokens da cota do Google, zero Claude |
| Buscas na web | 15, com 11 fontes abertas e citadas com data | 4 (o mínimo), sem link nem data nas fontes |
| Ideias | 7, 3 recomendadas | 6, 3 recomendadas, todas com capa de 9 palavras |
| Fonte inventada | nenhuma achada | **1**: "Manual de Produção Visual da Horus" (não existe), com confiança "alta" |
| Número distorcido | nenhum achado | **2**: "82% compram pelo WhatsApp" (o Sebrae diz que 82% das empresas vendem por ele); "48% já têm a lista" da Black Friday (a imprensa fala de cerca de 50% de intenção, e nenhum dos dois abriu o original) |
| Tema já recusado ou repetido | 1 (o "WhatsApp vai ser pago", da pauta fraca de 08/10) | **4 de 6**: WhatsApp pago e anúncios do concorrente (pauta de 08/10), Black Friday (fora em 10/10), métrica do Google (perto do post de 09/10) |
| Acerto que o outro não teve | Leitura funda dos carrosséis do radar; riscos honestos em cada ideia | **Viu que segunda, 02/11, é Finados** (o Mídia marcou post pra segunda sem notar) |

**Veredito:** o Agy não serve pra fazer a pauta sozinho. É duas vezes mais rápido e não gasta o Claude, mas inventou
uma fonte e distorceu dois números com "confiança alta", e repetiu quatro temas que estavam escritos como recusados no
próprio pedido. Erro desse tipo só aparece pra quem confere fonte por fonte, que é justamente o trabalho caro. Fica
como segunda opinião barata (o feriado foi um acerto real, e virou instrução no pedido do Mídia). O teste B (imagens e
slides) segue marcado: ali a conferência é visual e o código ajuda, que é onde o braçal dele pode valer.

**Veredito do Marcelo (29/10/2026):** "Odiei essas 6 capas do Agy, péssimas ideias." Na mesma tarefa, ele tinha dito
"Amei seus temas!!" pra pauta do Mídia (Opus). O teste A fecha assim: **o Agy não faz pauta**, nem como fonte de ideia.
Fica no máximo como conferência de calendário (feriado), que é verificável.
