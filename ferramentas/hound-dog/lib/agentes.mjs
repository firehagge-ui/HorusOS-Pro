// =============================================================================
// Agentes de prospecção (Fase 1, 29/09/2026) — o que o MCP e o Farejador
// compartilham: designar, pausar, pedir um ciclo, anotar na memória, ler.
// O ciclo em si (Claude estrategista, redator e crítico) mora em
// farejador/agente.mjs. Desenho em PLANO-AGENTES.md.
// =============================================================================
import { q, q1 } from './db.mjs';
import { registrarAtividade } from './crm.mjs';

/** Decisão do Marcelo (29/09): até 10 agentes ativos de uma vez, casando com os 10 contatos frios por dia. */
export const LIMITE_AGENTES = 10;

export async function agenteDa(empresaId) {
  return q1('select * from agentes where empresa_id = $1', [empresaId]);
}

export async function agentesAtivos() {
  return q(`select a.*, e.nome, e.categoria, e.bairro, e.cidade, e.estagio from agentes a join empresas e on e.id = a.empresa_id
    where a.status = 'ativo' order by a.atualizado_em desc`);
}

/**
 * Enfileira um ciclo do agente. Um ciclo por vez por lead: se já há um esperando na fila, o acontecimento novo
 * entra nele (a fila junta), em vez de abrir outro.
 */
export async function pedirCiclo(empresaId, gatilho, detalhe = null, criadoPor = 'farejador', prioridade = null) {
  const ag = await agenteDa(empresaId);
  if (!ag || ag.status !== 'ativo') return null;
  const ev = { gatilho, detalhe, em: new Date().toISOString() };
  const esperando = await q1("select id, entrada from jobs where tipo = 'agente_ciclo' and empresa_id = $1 and status = 'fila' order by criado_em limit 1", [empresaId]);
  if (esperando) {
    const eventos = [...(esperando.entrada?.eventos || []), ev];
    await q('update jobs set entrada = $2 where id = $1', [esperando.id, JSON.stringify({ ...esperando.entrada, eventos })]);
    return esperando.id;
  }
  const p = prioridade ?? (gatilho === 'lead_respondeu' ? 2 : 3);
  const j = await q1(`insert into jobs (tipo, entrada, empresa_id, prioridade, criado_por) values ('agente_ciclo', $1, $2, $3, $4) returning id`,
    [JSON.stringify({ eventos: [ev] }), empresaId, p, criadoPor]);
  await q("update agentes set fase = 'trabalhando' where id = $1 and fase not in ('geladeira','ganho','perdido')", [ag.id]);
  return j.id;
}

/** Designa (ou reativa) o agente de um lead e já pede o primeiro ciclo. Respeita o limite de ativos. */
export async function designarAgente(empresaId, autor = 'marcelo', { pedido = null } = {}) {
  const emp = await q1('select id, nome, estagio, relacao from empresas where id = $1', [empresaId]);
  if (!emp) throw new Error('Empresa não encontrada');
  const atual = await agenteDa(empresaId);
  if (!atual || atual.status !== 'ativo') {
    const n = (await q1("select count(*)::int n from agentes where status = 'ativo'")).n;
    if (n >= LIMITE_AGENTES) {
      const ativos = (await agentesAtivos()).map((a) => `${a.nome} (${a.fase})`).join(', ');
      throw new Error(`Já há ${n} agentes ativos (limite ${LIMITE_AGENTES}). Encerre ou pause um antes: ${ativos}`);
    }
  }
  const ag = await q1(`insert into agentes (empresa_id, status, fase, designado_por) values ($1, 'ativo', 'novo', $2)
    on conflict (empresa_id) do update set status = 'ativo', fase = case when agentes.fase in ('geladeira','ganho','perdido') then 'novo' else agentes.fase end
    returning *`, [empresaId, autor]);
  await q(`insert into agente_eventos (agente_id, empresa_id, gatilho, aconteceu, autor) values ($1, $2, 'designado', $3, $4)`,
    [ag.id, empresaId, atual ? 'Agente reativado' : 'Agente designado pra este lead', autor]);
  await registrarAtividade(empresaId, 'nota', atual ? 'Agente de prospecção reativado' : 'Agente de prospecção designado', pedido, autor);
  const job = await pedirCiclo(empresaId, 'designado', pedido, autor);
  return { agente_id: ag.id, empresa: emp.nome, job_id: job };
}

/** Pausa (não conta no limite, não roda ciclo) ou encerra. */
export async function mudarStatusAgente(empresaId, status, motivo = null, autor = 'marcelo') {
  const ag = await agenteDa(empresaId);
  if (!ag) throw new Error('Este lead não tem agente');
  await q('update agentes set status = $2 where id = $1', [ag.id, status]);
  await q("update jobs set status = 'cancelado', erro = 'Agente pausado ou encerrado' where tipo = 'agente_ciclo' and empresa_id = $1 and status = 'fila'", [empresaId]);
  await q(`insert into agente_eventos (agente_id, empresa_id, gatilho, aconteceu, autor) values ($1, $2, 'nota', $3, $4)`,
    [ag.id, empresaId, `Agente ${status === 'ativo' ? 'reativado' : status}${motivo ? `: ${motivo}` : ''}`, autor]);
  return { empresa_id: empresaId, status };
}

/**
 * O Marcelo (ou o chat) acrescenta informação: vira fato na memória com a fonte, entra no diário, e pede um ciclo
 * se ele quiser que o agente reaja agora.
 */
export async function notaAgente(empresaId, texto, { tipo = 'fato', fonte = 'Marcelo', reagir = false } = {}, autor = 'marcelo') {
  const ag = await agenteDa(empresaId);
  if (!ag) throw new Error('Este lead não tem agente. Designe com hd_agente_designar.');
  const mem = ag.memoria || {};
  const hoje = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Bahia' });
  if (tipo === 'correcao') mem.correcoes = [...(mem.correcoes || []), { texto, data: hoje, fonte }].slice(-30);
  else if (tipo === 'hipotese') mem.hipoteses = [...(mem.hipoteses || []), texto].slice(-20);
  else mem.fatos = [...(mem.fatos || []), { fato: texto, fonte, data: hoje }].slice(-60);
  await q('update agentes set memoria = $2 where id = $1', [ag.id, JSON.stringify(mem)]);
  await q(`insert into agente_eventos (agente_id, empresa_id, gatilho, aconteceu, autor) values ($1, $2, 'nota', $3, $4)`,
    [ag.id, empresaId, `${tipo === 'correcao' ? 'Correção' : tipo === 'hipotese' ? 'Hipótese' : 'Fato'} de ${fonte}: ${texto}`, autor]);
  const job = reagir ? await pedirCiclo(empresaId, 'pedido', `${fonte} acrescentou: ${texto}`, autor) : null;
  return { ok: true, job_id: job };
}

export async function lerAgente(empresaId) {
  const ag = await agenteDa(empresaId);
  if (!ag) return null;
  const eventos = await q(`select gatilho, aconteceu, leitura, decisao, porque, autor, criado_em from agente_eventos
    where agente_id = $1 order by criado_em desc limit 15`, [ag.id]);
  const pendentes = await q(`select passo, variante, tipo, angulo, status, texto, raciocinio from disparos
    where empresa_id = $1 and status in ('rascunho','aprovado','agendado') order by passo, variante`, [empresaId]);
  return { ...ag, eventos, pendentes };
}
