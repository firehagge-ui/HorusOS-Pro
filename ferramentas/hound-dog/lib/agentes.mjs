// =============================================================================
// Agentes de prospecção (Fase 1, 29/09/2026) — o que o MCP e o Farejador
// compartilham: designar, pausar, pedir um ciclo, anotar na memória, ler.
// O ciclo em si (Claude estrategista, redator e crítico) mora em
// farejador/agente.mjs. Desenho em PLANO-AGENTES.md.
// =============================================================================
import { q, q1 } from './db.mjs';
import { registrarAtividade } from './crm.mjs';
import { AUTO_RESPOSTA_SQL } from '../app/js/revisor.js';

/** Decisão do Marcelo (29/09): até 10 agentes ativos de uma vez, casando com os 10 contatos frios por dia. */
export const LIMITE_AGENTES = 10;

/* ---------------------------------------------------------------------------------------------
   Especialistas por segmento (Fase 3, 30/09/2026): o dono do caderno do nicho. O agente continua um por lead;
   o especialista junta o que vale pra todos os leads do mesmo nicho (migração 014).
   --------------------------------------------------------------------------------------------- */
const semAcento = (t) => String(t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

/** O especialista cuja palavra aparece na categoria (ou no nome) da ficha; null se nenhum casa. */
export async function especialistaPara(empresa) {
  const alvo = semAcento(`${empresa?.categoria || ''} ${empresa?.nome || ''}`);
  const lista = await q('select id, palavras from especialistas where ativo order by ordem');
  // Categoria primeiro: o nome da empresa só desempata quando a categoria não diz nada
  const cat = semAcento(empresa?.categoria || '');
  return (lista.find((e) => e.palavras.some((p) => cat.includes(p))) || lista.find((e) => e.palavras.some((p) => alvo.includes(p))))?.id || null;
}

/** Liga o agente ao especialista do nicho, se ainda não tem. Devolve o id (ou null). */
export async function garantirEspecialista(agente, empresa) {
  if (agente?.especialista_id) return agente.especialista_id;
  const id = await especialistaPara(empresa);
  if (id && agente?.id) await q('update agentes set especialista_id = $2 where id = $1', [agente.id, id]);
  return id;
}

/** O que o especialista sabe: a linha dele, as notas válidas (as mais novas primeiro) e o total de propostas. */
export async function saberDoEspecialista(id) {
  if (!id) return null;
  const esp = await q1('select * from especialistas where id = $1', [id]);
  if (!esp) return null;
  const notas = await q(`select n.texto, n.origem, n.criado_em, e.nome empresa from especialista_notas n left join empresas e on e.id = n.empresa_id
    where n.especialista_id = $1 and n.status = 'valida' order by n.criado_em desc limit 40`, [id]);
  return { ...esp, notas };
}

/** Anota no caderno vivo do especialista. Do Marcelo nasce válida; do agente, proposta (o Marcelo aceita na Mesa). */
export async function notaEspecialista(id, texto, { empresaId = null, origem = 'marcelo', autor = 'marcelo' } = {}) {
  if (!id || !texto?.trim()) return null;
  const status = origem === 'agente' ? 'proposta' : 'valida';
  // Mesma lição duas vezes não entra (o agente tende a repetir o que já está no caderno)
  const igual = await q1("select id from especialista_notas where especialista_id = $1 and lower(texto) = lower($2) and status <> 'descartada'", [id, texto.trim()]);
  if (igual) return igual.id;
  return (await q1(`insert into especialista_notas (especialista_id, empresa_id, texto, origem, status, autor) values ($1,$2,$3,$4,$5,$6) returning id`,
    [id, empresaId, texto.trim().slice(0, 900), origem, status, autor])).id;
}

/**
 * Placar do teste casa × curiosidade (Fase 4, aberto em 24/09): primeira mensagem enviada por formato e quantas tiveram
 * resposta de gente depois (robô e aviso sem texto não contam). Com especialista, só os leads do nicho dele.
 */
export async function placarFormatos(especialistaId = null) {
  const linhas = await q(`select d.formato, count(*)::int enviados,
      count(*) filter (where d.respondeu or exists (select 1 from whatsapp_mensagens m join whatsapp_conversas c on c.id = m.conversa_id
        where c.empresa_id = d.empresa_id and m.direcao = 'in' and m.momento > d.enviado_em and coalesce(m.texto, '') <> ''
        and translate(lower(m.texto), 'áàâãéêíóôõúç', 'aaaaeeiooouc') !~ $2))::int responderam
    from (select distinct on (empresa_id) * from disparos where passo = 1 and status = 'enviado' order by empresa_id, enviado_em) d
    left join agentes a on a.empresa_id = d.empresa_id
    where ($1::text is null or a.especialista_id = $1)
    group by d.formato`, [especialistaId, AUTO_RESPOSTA_SQL]);
  const p = { casa: { enviados: 0, responderam: 0 }, curiosidade: { enviados: 0, responderam: 0 } };
  for (const l of linhas) if (p[l.formato]) p[l.formato] = { enviados: l.enviados, responderam: l.responderam };
  return p;
}

/** Qual formato a próxima abertura deve usar pra o teste ter base: o que tem menos envios (empate: curiosidade). */
export function formatoDaVez(placar) {
  return placar.curiosidade.enviados <= placar.casa.enviados ? 'curiosidade' : 'casa';
}

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
  await garantirEspecialista(ag, await q1('select nome, categoria from empresas where id = $1', [empresaId]));
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
export async function notaAgente(empresaId, texto, { tipo = 'fato', fonte = 'Marcelo', reagir = false, nicho = false } = {}, autor = 'marcelo') {
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
  // Vale pro nicho todo: vira nota do especialista (Fase 3) e todo agente do mesmo nicho passa a ler
  if (nicho) await notaEspecialista(ag.especialista_id || await garantirEspecialista(ag, await q1('select nome, categoria from empresas where id = $1', [empresaId])), texto, { empresaId, origem: 'marcelo', autor });
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
