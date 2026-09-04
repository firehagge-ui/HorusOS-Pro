#!/usr/bin/env node
// Servidor MCP da Horus — inteligência comercial de prospecção.
// Transporte: stdio (para Claude Code / Claude Desktop). Para o Gemini Spark,
// hospedar com transporte HTTP (ver README).

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { checkSite } from "./tools/site.mjs";
import { lookupCnpj } from "./tools/cnpj.mjs";

const server = new McpServer({
  name: "horus-prospeccao",
  version: "1.0.0",
});

const asText = (t) => ({ content: [{ type: "text", text: String(t) }] });

server.registerTool(
  "check_site",
  {
    title: "Checar site",
    description:
      "Abre o site de uma empresa e devolve diagnóstico FACTUAL (verificado, não inferido): " +
      "status HTTP, plataforma (WordPress/Wix/Canva/Google Sites/Linktree/Shopify/etc.), HTTPS, " +
      "responsividade (viewport), link de WhatsApp, pixel Meta/Analytics, formulário, tempo de resposta " +
      "e as oportunidades de venda que decorrem disso. Passe a URL; se não tiver 'http', ele completa.",
    inputSchema: { url: z.string().describe("URL ou domínio do site, ex.: exemplo.com.br") },
  },
  async ({ url }) => asText(await checkSite(url))
);

server.registerTool(
  "lookup_cnpj",
  {
    title: "Consultar CNPJ",
    description:
      "Consulta a Receita (via BrasilAPI, grátis) por número de CNPJ e devolve razão social, situação, " +
      "idade da empresa, porte, segmento (CNAE), município/UF, capital social e SÓCIOS (o nome do decisor), " +
      "com uma leitura de capacidade de pagar. Consulta por número, não por nome.",
    inputSchema: { cnpj: z.string().describe("CNPJ com ou sem pontuação, 14 dígitos") },
  },
  async ({ cnpj }) => asText(await lookupCnpj(cnpj))
);

// Checagem de anúncio (Meta Ad Library) saiu daqui de propósito: a Biblioteca é
// 100% renderizada por JS e um token de API foge do escopo. O Firecrawl (MCP
// firecrawl_scrape, com waitFor + query) lê a Biblioteca pública direto e devolve
// a contagem real de anúncios ativos — é o caminho oficial pra esse sinal.

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("[horus-prospeccao] MCP no ar (stdio).");
