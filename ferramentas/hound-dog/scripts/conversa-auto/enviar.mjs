// Conversa conduzida pelo Claude a pedido do Marcelo (09/10/2026, lead Débora Reis).
// Manda um ou mais balões pela fila do Farejador (mesmo caminho do botão Enviar do painel),
// com pausa de quem está digitando entre um e outro. Uso:
//   node scripts/conversa-auto/enviar.mjs <empresa_id> "balão 1" "balão 2" ...
import { q, q1, fecharDb } from '../../lib/db.mjs';
import { registrarAtividade } from '../../lib/crm.mjs';

const [empresaId, ...baloes] = process.argv.slice(2);
if (!empresaId || !baloes.length) { console.error('uso: enviar.mjs <empresa_id> "texto" ["texto"...]'); process.exit(1); }
const conv = await q1('select * from whatsapp_conversas where empresa_id = $1 order by ultima_em desc nulls last limit 1', [empresaId]);
if (!conv) throw new Error('sem conversa ligada a essa ficha');
const st = await q1("select whatsapp_status, online_em from farejador_status where id = 'principal'");
console.log(`farejador: whatsapp ${st?.whatsapp_status}, visto ${st?.online_em?.toISOString()}`);
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
for (const [i, texto] of baloes.entries()) {
  if (i > 0) await espera(Math.min(25000, 2500 + texto.length * 90)); // tempo de digitar o próximo balão
  const msg = await q1(`insert into whatsapp_mensagens (conversa_id, direcao, texto, status, enviado_por) values ($1, 'out', $2, 'fila', 'claude (pelo Marcelo)') returning id`, [conv.id, texto]);
  const job = await q1(`insert into jobs (tipo, entrada, prioridade, criado_por, conversa_id, empresa_id) values ('whatsapp_enviar', $1, 1, 'claude', $2, $3) returning id`,
    [{ mensagem_id: msg.id, texto, telefone: conv.telefone, jid: conv.jid }, conv.id, empresaId]);
  for (let t = 0; t < 40; t++) { // espera o Farejador mandar antes do próximo balão
    const j = await q1('select status, erro from jobs where id = $1', [job.id]);
    if (j.status === 'concluido') { console.log(`enviado: ${texto}`); break; }
    if (j.status === 'erro') { console.error(`ERRO: ${j.erro}`); await fecharDb(); process.exit(2); }
    await espera(1500);
  }
}
await registrarAtividade(empresaId, 'nota', 'Conversa conduzida pelo Claude', 'Pedido do Marcelo em 09/10: o Claude responde a lead automaticamente, no jeito dele.', 'claude').catch(() => {});
await fecharDb();
