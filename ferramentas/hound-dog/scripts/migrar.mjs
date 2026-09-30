// Aplica os arquivos supabase/*.sql em ordem.
// Com argumento, aplica só os arquivos nomeados: npm run migrar -- 009_variantes.sql
import fs from 'node:fs';
import path from 'node:path';
import { RAIZ_HD } from '../lib/env.mjs';
import { db, fecharDb } from '../lib/db.mjs';

const pasta = path.join(RAIZ_HD, 'supabase');
const pedidos = process.argv.slice(2).map((a) => path.basename(a));
const arquivos = fs.readdirSync(pasta).filter((f) => /^\d+_.*\.sql$/.test(f) && (!pedidos.length || pedidos.includes(f))).sort();
if (pedidos.length && arquivos.length !== pedidos.length) throw new Error(`Arquivo não encontrado em supabase/: ${pedidos.filter((p) => !arquivos.includes(p)).join(', ')}`);
for (const f of arquivos) {
  const sql = fs.readFileSync(path.join(pasta, f), 'utf8');
  process.stdout.write(`→ ${f} ... `);
  await db().query(sql);
  console.log('ok');
}
const t = await db().query("select count(*)::int n from information_schema.tables where table_schema='public'");
console.log('tabelas/visões no public:', t.rows[0].n);
await fecharDb();
