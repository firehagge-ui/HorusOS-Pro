// =============================================================================
// Farejador — follow-up programado (30/09/2026)
// Pedido do Marcelo: "um sistema que identifique e já agende um follow-up
// programado com mensagem pronta". Land Car e Autobahn ficaram quase 6 dias sem
// resposta ao corpo e ninguém voltou; Talina e Cintya responderam e ficaram ~20h
// sem resposta nossa. A cada 10 minutos esta rotina olha as conversas dos leads:
//  - nós falamos por último há 3 dias → o agente prepara o follow-up (um só, regra
//    da casa, 20-escrita.md §10), programado pro 4º dia; o Marcelo aprova no Disparos;
//  - o lead falou por último e está sem resposta há 3 horas → avisa o Marcelo
//    (uma vez por fala do lead) e garante a resposta preparada;
//  - a data que o agente marcou venceu → acorda o agente.
// Nada é enviado daqui: tudo passa pela aprovação do Marcelo.
// =============================================================================
import { q, q1 } from '../lib/db.mjs';
import { agenteDa, pedirCiclo, designarAgente, LIMITE_AGENTES } from '../lib/agentes.mjs';
import { pareceAutoResposta } from '../app/js/revisor.js';
import * as WA from './whatsapp.mjs';
import { log, logErro } from './log.mjs';

const DIAS_PREPARO = 3;   // prepara com um dia de folga; a data sugerida é o 4º dia
const HORAS_DEVENDO = 3;
let ocupado = false;

/** Aviso automático do WhatsApp e robô não são fala de ninguém. */
const eFala = (m) => !(m.tipo === 'outro' && !m.texto) && !(m.direcao === 'in' && pareceAutoResposta(m.texto));
const horaBahia = () => Number(new Date().toLocaleString('en-US', { timeZone: 'America/Bahia', hour: 'numeric', hourCycle: 'h23' }));

async function temCicloNaFila(empresaId) {
  return !!(await q1("select 1 from jobs where empresa_id = $1 and tipo in ('agente_ciclo','investigar_empresa') and status in ('fila','processando')", [empresaId]));
}

/** Garante um agente ativo pro lead (decisão do Marcelo: até 10). Sem vaga, devolve null e o Marcelo é avisado. */
async function garantirAgente(empresa, motivo) {
  const ag = await agenteDa(empresa.id);
  if (ag?.status === 'ativo') return ag;
  const ativos = (await q1("select count(*)::int n from agentes where status = 'ativo'")).n;
  if (ativos >= LIMITE_AGENTES) return null;
  await designarAgente(empresa.id, 'farejador', { pedido: motivo });
  return agenteDa(empresa.id);
}

export async function rotinaFollowup() {
  if (ocupado) return;
  ocupado = true;
  try {
    // 1. Data que o agente marcou venceu: acorda (e zera a data pra não acordar de novo a cada volta)
    const vencidos = await q(`select a.empresa_id, a.motivo_proximo, a.status from agentes a
      where a.proximo_ciclo_em <= now() and (a.status = 'ativo' or (a.status = 'encerrado' and a.fase = 'geladeira'))`);
    for (const a of vencidos) {
      if (await temCicloNaFila(a.empresa_id)) continue;
      await q('update agentes set proximo_ciclo_em = null where empresa_id = $1', [a.empresa_id]);
      const texto = `Chegou a data que você marcou${a.motivo_proximo ? `: ${a.motivo_proximo}` : ''}.`;
      if (a.status === 'ativo') await pedirCiclo(a.empresa_id, 'prazo', texto, 'farejador');
      else {
        // Geladeira com data de voltar: reativa se houver vaga
        const n = (await q1("select count(*)::int n from agentes where status = 'ativo'")).n;
        if (n < LIMITE_AGENTES) await designarAgente(a.empresa_id, 'farejador', { pedido: `Saiu da geladeira. ${texto}` });
      }
      log('followup', `data do agente venceu (${a.empresa_id.slice(0, 8)})`);
    }

    // 2. Conversas dos leads em andamento
    const convs = await q(`select c.id, c.empresa_id, c.telefone, c.lembrete_resposta_em, e.nome, e.estagio, e.whatsapp from whatsapp_conversas c
      join empresas e on e.id = c.empresa_id
      where not c.arquivada and not c.silenciada and not e.arquivado and e.relacao = 'lead'
        and e.estagio not in ('ganho','perdido','novo','qualificado') and c.ultima_em > now() - interval '30 days'`);
    const devendo = [];
    for (const c of convs) {
      const msgs = await q('select direcao, texto, tipo, momento from whatsapp_mensagens where conversa_id = $1 order by momento desc limit 20', [c.id]);
      const ultima = msgs.find(eFala);
      if (!ultima) continue;
      const horas = (Date.now() - new Date(ultima.momento)) / 3600000;

      // 2a. O lead falou por último e está sem resposta
      if (ultima.direcao === 'in' && horas >= HORAS_DEVENDO) {
        if (!c.lembrete_resposta_em || new Date(c.lembrete_resposta_em) < new Date(ultima.momento)) devendo.push({ c, ultima, horas });
        continue;
      }

      // 2b. Nós falamos por último e o lead sumiu
      if (ultima.direcao !== 'out' || horas < DIAS_PREPARO * 24) continue;
      const ag = await agenteDa(c.empresa_id);
      if (ag && ag.status !== 'ativo') continue; // pausado ou encerrado: o Marcelo decidiu
      if (await temCicloNaFila(c.empresa_id)) continue;
      // Só um follow-up pendente segura. Resposta preparada pro caso de o lead falar (Harmony, Bioclin) não conta:
      // se ele não fala, o follow-up tem que sair do mesmo jeito
      const pendente = await q1(`select 1 from disparos where empresa_id = $1 and tipo = 'followup' and status in ('rascunho','aprovado','agendado','enviando')`, [c.empresa_id]);
      if (pendente) continue;
      // Já pedi um ciclo de silêncio pra esta mesma mensagem nossa? Não repete (o agente pode ter decidido esperar)
      const jaPedido = await q1(`select 1 from agente_eventos where empresa_id = $1 and gatilho like '%silencio%' and criado_em > $2`, [c.empresa_id, ultima.momento]);
      if (jaPedido) continue;
      if (String(c.whatsapp || c.telefone || '').replace(/\D/g, '').length < 12) continue;

      // Quantos follow-ups já saíram desde a última fala humana do lead (regra: um só)
      const ultimaDele = msgs.find((m) => m.direcao === 'in' && eFala(m));
      const fups = (await q1(`select count(*)::int n from disparos where empresa_id = $1 and tipo = 'followup' and status = 'enviado'
        and ($2::timestamptz is null or enviado_em > $2)`, [c.empresa_id, ultimaDele?.momento || null])).n;
      const dias = Math.floor(horas / 24);
      const detalhe = fups
        ? `Silêncio de ${dias} dias e JÁ SAIU um follow-up sem resposta. Não escreva outro: encerre com geladeira e a data de voltar.`
        : `O lead não responde há ${dias} dias. Nossa última mensagem: «${String(ultima.texto || '').slice(0, 300)}». ${ultimaDele ? `A última fala humana dele: «${String(ultimaDele.texto || '').slice(0, 200)}».` : 'Ele nunca respondeu como pessoa.'} Prepare UM follow-up (ele fica programado pro 4º dia e só sai com a aprovação do Marcelo).`;
      const agente = ag?.status === 'ativo' ? ag : await garantirAgente({ id: c.empresa_id }, detalhe);
      if (!agente) {
        await WA.enviarParaMim(`⏳ *${c.nome}* está há ${dias} dias sem responder, e não há vaga de agente (limite ${LIMITE_AGENTES}) pra preparar o follow-up. Pause ou encerre um agente, ou mande o follow-up você mesmo.\n\n— Hounder`).catch(() => {});
        await q(`insert into agente_eventos (agente_id, empresa_id, gatilho, aconteceu, autor)
          select id, empresa_id, 'silencio_sem_vaga', $2, 'farejador' from agentes where empresa_id = $1`, [c.empresa_id, `Sem vaga de agente pro follow-up (${dias} dias)`]).catch(() => {});
        continue;
      }
      // Designado agora: o primeiro ciclo já leva o detalhe. Já era ativo: ciclo de silêncio.
      if (ag?.status === 'ativo') await pedirCiclo(c.empresa_id, 'silencio', detalhe, 'farejador');
      else await q(`insert into agente_eventos (agente_id, empresa_id, gatilho, aconteceu, autor) values ($1, $2, 'silencio', $3, 'farejador')`,
        [agente.id, c.empresa_id, `Designado pelo follow-up automático: ${dias} dias sem resposta`]);
      log('followup', `${c.nome}: ${dias} dias sem resposta, follow-up sendo preparado`);
    }

    // 3. Devendo resposta: um aviso por fala do lead, só em horário de gente (8h às 20h)
    if (devendo.length && horaBahia() >= 8 && horaBahia() < 20 && WA.estaConectado()) {
      for (const { c } of devendo) {
        const ag = await agenteDa(c.empresa_id);
        // Com agente: se não há resposta preparada nem ciclo na fila, pede uma
        if (ag?.status === 'ativo' && !(await temCicloNaFila(c.empresa_id))) {
          const prep = await q1("select 1 from disparos where empresa_id = $1 and status in ('rascunho','aprovado') and passo > 1", [c.empresa_id]);
          if (!prep) await pedirCiclo(c.empresa_id, 'lead_respondeu', 'O lead falou por último e ainda está sem resposta nossa.', 'farejador');
        }
      }
      const linhas = devendo.sort((a, b) => b.horas - a.horas).map(({ c, ultima, horas }) =>
        `• *${c.nome}* · há ${horas >= 24 ? `${Math.floor(horas / 24)} dia(s)` : `${Math.floor(horas)}h`}: «${String(ultima.texto || '').replace(/\s+/g, ' ').slice(0, 90)}»`);
      if (await WA.enviarParaMim(`💬 *Esperando a sua resposta*\n${linhas.join('\n')}\n\nA resposta preparada está na conversa de cada um, em "Mensagens preparadas".\n\n— Hounder`)) {
        for (const { c } of devendo) await q('update whatsapp_conversas set lembrete_resposta_em = now() where id = $1', [c.id]);
        log('followup', `${devendo.length} lead(s) esperando resposta: aviso enviado`);
      }
    }
  } catch (e) { logErro('followup', e); } finally { ocupado = false; }
}
