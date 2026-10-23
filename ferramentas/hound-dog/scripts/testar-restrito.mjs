// Confere o modo restrito (pedido de operador que não é o dono): o MCP não devolve tarefa privada.
// Uso: node scripts/testar-restrito.mjs
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const servidor = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'mcp', 'server.mjs');
for (const restrito of [false, true]) {
  const t = new StdioClientTransport({ command: process.execPath, args: [servidor], env: { ...process.env, HD_AUTOR: 'teste', ...(restrito ? { HD_SO_PUBLICO: '1' } : {}) } });
  const c = new Client({ name: 'teste', version: '1' });
  await c.connect(t);
  const r = await c.callTool({ name: 'hd_tarefas', arguments: { limite: 300 } });
  const lista = JSON.parse(r.content[0].text);
  const res = await c.callTool({ name: 'hd_resumo', arguments: {} });
  const resumo = JSON.parse(res.content[0].text);
  // só no restrito: tem que ser barrado antes de gravar qualquer coisa
  const tenta = restrito ? await c.callTool({ name: 'hd_salvar_tarefa', arguments: { titulo: 'x', privada: true } }) : null;
  console.log(`${restrito ? 'RESTRITO (Antônio)' : 'normal (Marcelo)  '}: tarefas abertas ${lista.length}, privadas ${lista.filter((x) => x.privada).length}, com "teste do Antônio" ${lista.filter((x) => /teste (de 90|do ant)/i.test(x.titulo)).length}; resumo com privada: ${resumo.tarefas_7_dias.filter((x) => /teste (de 90|do ant)/i.test(x.titulo)).length}${tenta ? `; criar privada: ${tenta.isError ? 'barrado' : 'CRIOU (falha!)'}` : ''}`);
  await c.close();
}
