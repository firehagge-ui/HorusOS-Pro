// Testa a repetição de tarefas (migração 020) direto no banco e apaga o que criou.
// Uso: node scripts/testar-repetir.mjs   (rodar depois de: npm run migrar -- 020_tarefa_repetir.sql)
import { db, fecharDb } from '../lib/db.mjs';

const q = async (sql, p = []) => (await db().query(sql, p)).rows;
const ok = (cond, msg) => { console.log(`${cond ? 'ok   ' : 'FALHA'} ${msg}`); if (!cond) process.exitCode = 1; };
const ids = [];
try {
  // 1. Todo mês, prazo 10/11/2026 (terça): a próxima é 10/12/2026 (quinta)
  const [t] = await q(`insert into tarefas (titulo, prazo, repetir_cada, repetir_unidade, criado_por)
    values ('TESTE repetir mensal', '2026-11-10', 1, 'mes', 'teste') returning id`);
  ids.push(t.id);
  await q(`update tarefas set status = 'feita' where id = $1`, [t.id]);
  let [c] = await q(`select id, prazo::text, status, repetir_cada, repetir_unidade from tarefas where repetiu_de = $1`, [t.id]);
  if (c) ids.push(c.id);
  ok(c && c.status === 'a_fazer', 'marcar feita cria a próxima, aberta');
  ok(c && c.repetir_cada === 1 && c.repetir_unidade === 'mes', 'a próxima também se repete');
  console.log('      próxima:', c?.prazo, '(esperado a primeira data depois de hoje, dia 10, em dia útil)');

  // 2. Desfazer apaga a cópia
  await q(`update tarefas set status = 'a_fazer' where id = $1`, [t.id]);
  const resto = await q(`select id from tarefas where repetiu_de = $1`, [t.id]);
  ok(resto.length === 0, 'desmarcar apaga a cópia aberta');

  // 3. Refazer cria uma só
  await q(`update tarefas set status = 'feita' where id = $1`, [t.id]);
  await q(`update tarefas set concluida_obs = 'x' where id = $1`, [t.id]);
  const copias = await q(`select id from tarefas where repetiu_de = $1`, [t.id]);
  copias.forEach((x) => ids.push(x.id));
  ok(copias.length === 1, 'refazer cria uma só (editar a feita não duplica)');

  // 4. Fim de semana vai para segunda: semanal a partir de sábado 07/11/2026 cai em sábado; vira segunda
  const [{ d }] = await q(`select hd_proxima_data('2026-11-07', 1, 'semana')::text d`);
  ok(new Date(`${d}T12:00:00`).getDay() === 1, `semanal a partir de sábado cai na segunda (${d})`);

  // 5. Sem repetição nada nasce
  const [s] = await q(`insert into tarefas (titulo, prazo, criado_por) values ('TESTE sem repetir', '2026-11-10', 'teste') returning id`);
  ids.push(s.id);
  await q(`update tarefas set status = 'feita' where id = $1`, [s.id]);
  const nada = await q(`select id from tarefas where repetiu_de = $1`, [s.id]);
  ok(nada.length === 0, 'tarefa sem repetição não cria cópia');
} finally {
  if (ids.length) await q(`delete from tarefas where id = any($1) or repetiu_de = any($1)`, [ids]);
  console.log('limpo:', ids.length, 'tarefas de teste apagadas');
  await fecharDb();
}
