// Agentes de prospecção pela linha de comando (Fase 1, 29/09/2026).
//   node scripts/agente.mjs                     → lista os agentes ativos
//   node scripts/agente.mjs designar <nome>     → liga o agente e pede o primeiro ciclo
//   node scripts/agente.mjs ver <nome>          → memória, plano, diário e pendentes
//   node scripts/agente.mjs pedir <nome> "..."  → pede um ciclo com um pedido
//   node scripts/agente.mjs pausar|encerrar <nome> [motivo]
// Quem roda o ciclo é o Farejador (tipo de tarefa agente_ciclo).
import { q, q1, fecharDb } from '../lib/db.mjs';
import { agentesAtivos, designarAgente, lerAgente, pedirCiclo, mudarStatusAgente } from '../lib/agentes.mjs';

const [cmd, nome, ...resto] = process.argv.slice(2);

async function acharEmpresa(txt) {
  if (/^[0-9a-f-]{36}$/i.test(txt)) return q1('select id, nome from empresas where id = $1', [txt]);
  const r = await q('select id, nome from empresas where unaccent_simples(nome) ilike unaccent_simples($1) order by atualizado_em desc limit 3', [`%${txt}%`]);
  if (r.length > 1) throw new Error(`Mais de uma empresa com "${txt}": ${r.map((x) => x.nome).join(' · ')}`);
  return r[0] || null;
}

try {
  if (!cmd) {
    const l = await agentesAtivos();
    console.table(l.map((a) => ({ nome: a.nome, fase: a.fase, ciclos: a.ciclos, precisa: (a.precisa_de_voce || '').slice(0, 60), ultimo: a.ultimo_ciclo_em?.toLocaleString('pt-BR', { timeZone: 'America/Bahia' }) })));
  } else {
    const emp = await acharEmpresa(nome || '');
    if (!emp) throw new Error(`Empresa não encontrada: ${nome}`);
    if (cmd === 'designar') console.log(await designarAgente(emp.id, 'marcelo', { pedido: resto.join(' ') || null }));
    else if (cmd === 'ver') console.dir(await lerAgente(emp.id), { depth: 6 });
    else if (cmd === 'pedir') console.log({ job: await pedirCiclo(emp.id, 'pedido', resto.join(' '), 'marcelo') });
    else if (cmd === 'pausar' || cmd === 'encerrar') console.log(await mudarStatusAgente(emp.id, cmd === 'pausar' ? 'pausado' : 'encerrado', resto.join(' ') || null));
    else throw new Error(`Comando desconhecido: ${cmd}`);
  }
} catch (e) { console.error(e.message); process.exitCode = 1; } finally { await fecharDb(); }
