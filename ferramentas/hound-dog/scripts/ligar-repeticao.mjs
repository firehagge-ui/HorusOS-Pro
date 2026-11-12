// Liga a repetição de tarefas (10/11/2026): aplica a migração 020 e marca as tarefas
// que se repetem. Idempotente: rodar de novo não estraga nada.
// Uso (da raiz do HorusOS): npm run repeticao
import fs from 'node:fs';
import path from 'node:path';
import { RAIZ_HD } from '../lib/env.mjs';
import { db, fecharDb } from '../lib/db.mjs';

const sql = fs.readFileSync(path.join(RAIZ_HD, 'supabase', '020_tarefa_repetir.sql'), 'utf8');
await db().query(sql);
console.log('ok    migração 020 aplicada');

// [id, a cada, unidade, o que é]
const REPETIR = [
  ['8460960a-ec05-4714-a40b-6340483d8cea', 1, 'mes', 'Medir o Google da Débora (todo dia 10)'],
  ['82c817ad-2a60-4c03-bbc9-e2f88adaa53a', 1, 'semana', 'Ficha do Google da Débora: publicação e avaliações'],
  ['28140356-6639-4566-af62-447e8a7a90f4', 12, 'mes', 'Renovação do domínio da Débora'],
  ['0a38cce4-9714-492f-8b1d-78b7f3c6424b', 1, 'semana', 'Post semanal no Google da Horus'],
  ['c70d26ca-b49f-4c4a-b5bd-82d41bc4b929', 1, 'mes', 'Revisão mensal do plano'],
  ['b1b34227-1fcb-4571-8898-a43914239290', 1, 'semana', 'Ritual da sexta'],
  ['122b6d6d-9413-4612-b8cb-bcb631c9caf6', 2, 'semana', 'Registro quinzenal (privada)'],
];
for (const [id, cada, unidade, nome] of REPETIR) {
  const r = await db().query('update tarefas set repetir_cada = $2, repetir_unidade = $3 where id = $1 returning id', [id, cada, unidade]);
  console.log(r.rowCount ? 'ok   ' : 'FALTA', nome, `(a cada ${cada} ${unidade})`);
}
await fecharDb();
console.log('\nAgora rode o teste: node ferramentas/hound-dog/scripts/testar-repetir.mjs');
