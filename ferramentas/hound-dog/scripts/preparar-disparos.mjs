// Cria RASCUNHOS de disparo a partir de um JSON (mesmas travas do hd_preparar_disparo do MCP).
// Nada é enviado: o Marcelo aprova na tela Disparos.
// Uso: node scripts/preparar-disparos.mjs caminho/disparos.json
// JSON: [{ empresa_id, texto, formato: 'casa'|'curiosidade', passo?, variante?: 'A'|'B'|'C', angulo?, telefone?, verificacao: [{frase, fonte, como_conferiu}] }]
import fs from 'node:fs';
import { q, q1, fecharDb } from '../lib/db.mjs';
import { revisar } from '../app/js/revisor.js';

const itens = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
for (const p of itens) {
  const emp = await q1('select id, nome, whatsapp from empresas where id = $1', [p.empresa_id]);
  if (!emp) { console.log(`✗ ${p.empresa_id}: empresa não encontrada`); continue; }
  const tel = String(p.telefone || emp.whatsapp || '').replace(/\D/g, '');
  if (tel.length < 12) { console.log(`✗ ${emp.nome}: sem WhatsApp confirmado`); continue; }
  if (/[—–]/.test(p.texto)) { console.log(`✗ ${emp.nome}: texto com travessão`); continue; }
  if (!Array.isArray(p.verificacao) || !p.verificacao.length) { console.log(`✗ ${emp.nome}: sem verificação`); continue; }
  const ja = await q1("select id from disparos where empresa_id = $1 and passo = $2 and variante = $3 and status in ('rascunho','aprovado','agendado')", [emp.id, p.passo || 1, p.variante || 'A']);
  if (ja) { console.log(`• ${emp.nome}: já tem o passo ${p.passo || 1} variante ${p.variante || 'A'} pendente, pulei`); continue; }
  // Revisor mecânico (app/js/revisor.js): o lote são os outros leads deste arquivo e os disparos recentes
  const lote = [...itens.filter((o) => o.empresa_id !== p.empresa_id && (o.passo || 1) === (p.passo || 1)).map((o) => o.texto),
    ...(await q(`select texto from disparos where empresa_id <> $1 and passo = $2 and status in ('rascunho','aprovado','agendado','enviado') and criado_em > now() - interval '14 days'`, [emp.id, p.passo || 1])).map((x) => x.texto)];
  const rev = revisar(p.texto, { passo: p.passo || 1, empresa: emp.nome, lote });
  if (rev.vetos) { console.log(`✗ ${emp.nome}: vetado pelo revisor\n${rev.itens.filter((i) => i.nivel === 'veto').map((i) => `    - ${i.dica}`).join('\n')}`); continue; }
  const r = await q1(`insert into disparos (empresa_id, telefone, texto, formato, passo, variante, angulo, verificacao, revisao, criado_por) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,'claude') returning id`,
    [emp.id, tel, p.texto.replace(/\s*\n+\s*/g, ' ').trim(), p.formato || 'casa', p.passo || 1, p.variante || 'A', p.angulo || null, JSON.stringify(p.verificacao), JSON.stringify(rev.itens)]);
  console.log(`✓ ${emp.nome} (passo ${p.passo || 1}, variante ${p.variante || 'A'}) ${r.id}${rev.avisos ? `\n${rev.itens.map((i) => `    ⚠ ${i.dica}`).join('\n')}` : ''}`);
}
await fecharDb();
