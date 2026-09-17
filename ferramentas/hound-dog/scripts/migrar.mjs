// Aplica os arquivos supabase/*.sql em ordem.
import fs from 'node:fs';
import path from 'node:path';
import { RAIZ_HD } from '../lib/env.mjs';
import { db, fecharDb } from '../lib/db.mjs';

const pasta = path.join(RAIZ_HD, 'supabase');
const arquivos = fs.readdirSync(pasta).filter((f) => /^\d+_.*\.sql$/.test(f)).sort();
for (const f of arquivos) {
  const sql = fs.readFileSync(path.join(pasta, f), 'utf8');
  process.stdout.write(`→ ${f} ... `);
  await db().query(sql);
  console.log('ok');
}
const t = await db().query("select count(*)::int n from information_schema.tables where table_schema='public'");
console.log('tabelas/visões no public:', t.rows[0].n);
await fecharDb();
