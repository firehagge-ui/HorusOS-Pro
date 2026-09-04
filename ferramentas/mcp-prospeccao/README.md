# Horus MCP — Prospecção

Servidor MCP de inteligência comercial. Nasceu pra **corrigir os pontos cegos do
agente Gemini Spark** na prospecção: o Spark puxa Google Maps muito bem, mas não
abre site arbitrário e não olha a Receita. Estas duas ferramentas entregam
justamente esses dados, **verificados**.

## Ferramentas

| Ferramenta | O que responde | Fonte | Precisa de chave? |
|---|---|---|---|
| `check_site` | O site existe? É próprio ou plataforma grátis? É responsivo? Tem WhatsApp/pixel/form? | Leitura real da página | Não |
| `lookup_cnpj` | Idade, porte, situação, segmento e **sócios (o decisor)**. Capacidade de pagar. | BrasilAPI / minhareceita | Não |

### "A empresa roda anúncio?" — usar o Firecrawl, não este MCP

Existiu aqui um `check_meta_ads`. Foi **removido em 29/08/2026**: a Biblioteca de
Anúncios da Meta é 100% renderizada por JS, então um `fetch` simples só conseguia
devolver o link pra checagem manual — meia ferramenta. O **Firecrawl** (MCP
`firecrawl_scrape`) já resolve isso de graça e melhor, lendo a Biblioteca pública
direto e devolvendo a contagem real de anúncios ativos:

```
firecrawl_scrape(
  url = "https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&q=<EMPRESA>&search_type=keyword_unordered&media_type=all",
  formats = ["query"],
  waitFor = 6000,
  queryOptions = { prompt: "Quantos anúncios ativos e qual o anunciante? Ou 'zero resultados'." }
)
```

Leitura: anúncios ativos → tem verba (e pode já ter agência); zero → oportunidade
limpa. ⚠️ A busca é por palavra-chave e traz **homônimos** — confirmar que o
anunciante que apareceu é mesmo o alvo antes de concluir.

## Rodar

```bash
npm install
npm run smoke   # testa as 3 ferramentas contra alvos reais
npm start       # sobe o servidor MCP (stdio)
```

## Usar comigo (Claude Code) — local, stdio

Já registrado em `.mcp.json` na raiz do repo:

```json
{
  "mcpServers": {
    "horus-prospeccao": {
      "command": "node",
      "args": ["ferramentas/mcp-prospeccao/server.mjs"]
    }
  }
}
```

Reinicie o Claude Code e as duas ferramentas aparecem. Fluxo típico: o Spark
gera a lista → eu rodo `check_site`/`lookup_cnpj` nos prospects (e o Firecrawl na
Biblioteca de Anúncios) pra confirmar o que ele inferiu e recalibrar o score.

## Fluxo real de uso (decidido em 29/08/2026)

Cogitamos hospedar uma variante HTTP na Cloudflare pro Gemini Spark plugar direto
via MCP. Abandonado: incerteza real sobre o que o Spark exige de autenticação, e
o caminho manual é melhor de qualquer forma — dá pra revisar com juízo o que o
Spark inferiu em vez de ele rodar sozinho sem supervisão.

**Fluxo adotado:** o Spark faz a coleta ampla (Maps, avaliações, etc.) → o Marcelo
cola a saída dele na conversa com o Claude → o Claude roda estas 2 ferramentas
(via stdio, `.mcp.json` na raiz do repo) mais o Firecrawl na Biblioteca de
Anúncios, nos prospects da lista, pra confirmar o que foi inferido e recalibrar o
score antes de virar lista de ataque.

## Limitações honestas

- `check_site` lê o HTML servido; site 100% renderizado por JS pode esconder
  elementos (o veredito marca o que viu, não chuta o que não viu).
- `lookup_cnpj` consulta por **número**, não por nome. O CNPJ costuma vir do
  Google/Maps ou de busca; aqui a gente enriquece a partir dele.
- Instagram de terceiros ficou de fora de propósito: a API oficial só vê a conta
  que você administra, e scraper é frágil e contra os termos.
