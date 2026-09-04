// Teste de fumaça: roda cada ferramenta direto (sem MCP) contra alvos reais.
// Uso: npm run smoke
import { checkSite } from "./tools/site.mjs";
import { lookupCnpj } from "./tools/cnpj.mjs";

const linha = (t) => "\n" + "=".repeat(60) + "\n" + t + "\n" + "=".repeat(60);

console.log(linha("check_site — cafegraodaserra.netlify.app (cliente Horus)"));
console.log(await checkSite("cafegraodaserra.netlify.app"));

console.log(linha("check_site — dominio-que-nao-existe-xyz123.com.br"));
console.log(await checkSite("dominio-que-nao-existe-xyz123.com.br"));

console.log(linha("lookup_cnpj — 47.960.950/0001-21 (Magazine Luiza)"));
console.log(await lookupCnpj("47.960.950/0001-21"));

console.log("\n[smoke] fim.");
