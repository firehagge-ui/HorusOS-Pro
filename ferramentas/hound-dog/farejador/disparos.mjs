// =============================================================================
// HOUNDER — disparos de prospecção (regra de 24/09/2026)
// O Claude prepara e verifica; o Marcelo aprova o texto exato no painel e manda
// o lote; aqui só se envia o que está 'agendado' e já venceu o horário.
// Travas: no máximo LIMITE_DIA envios por dia (horário da Bahia), um por vez, e
// qualquer erro para o lote inteiro (pode ser bloqueio do número).
// =============================================================================
import { q, q1 } from '../lib/db.mjs';
import { registrarAtividade } from '../lib/crm.mjs';
import * as WA from './whatsapp.mjs';
import { AUTO_RESPOSTA_SQL } from '../app/js/revisor.js';
import { log, logErro } from './log.mjs';

export const LIMITE_DIA = 10;
let ocupado = false;

// Janela de envio (29/09/2026): o passo 1 da LevSaúde saiu às 23h31 (segunda, 28/09).
// Mensagem de número desconhecido fora do horário lê como golpe, e o card do network
// (abordagem-e-prospeccao §4) pede janela comercial. Horário da Bahia; 0 = domingo.
// O mesmo valor está em app/js/telas/disparos.js (JANELA).
const JANELA = { 1: [8.5, 18], 2: [8.5, 18], 3: [8.5, 18], 4: [8.5, 18], 5: [8.5, 18], 6: [9, 12] };
function partesBahia(t) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Bahia', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(t).map((x) => [x.type, x.value]));
  return { dia: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[p.weekday], h: Number(p.hour) + Number(p.minute) / 60 };
}
export function naJanela(t = new Date()) { const { dia, h } = partesBahia(t); return !!JANELA[dia] && h >= JANELA[dia][0] && h < JANELA[dia][1]; }
/** Próxima abertura da janela a partir de agora (varre de 15 em 15 minutos, no máximo 8 dias). */
export function proximaAbertura(t = new Date()) {
  const x = new Date(Math.ceil(t.getTime() / 900000) * 900000);
  for (let i = 0; i < 8 * 96; i++, x.setTime(x.getTime() + 900000)) if (naJanela(x)) return new Date(x.getTime() + Math.random() * 5 * 60000);
  return null;
}

async function enviadosHoje() {
  const r = await q1(`select count(*)::int n from disparos where status = 'enviado'
    and (enviado_em at time zone 'America/Bahia')::date = (now() at time zone 'America/Bahia')::date`);
  return r?.n || 0;
}

/** Devolve o resto do lote pra fila de aprovados (sem horário) e avisa o Marcelo. */
async function pararLote(loteId, motivo) {
  const r = await q(`update disparos set status = 'aprovado', agendado_para = null
    where lote_id = $1 and status = 'agendado' returning id`, [loteId]);
  log('disparos', `lote parado (${r.length} voltaram pra fila): ${motivo}`);
  await WA.enviarParaMim(`⛔ *Lote de prospecção parado*\n${motivo}\n\n${r.length} mensagem(ns) voltaram pra fila, nada mais sai até você mandar de novo.\n\n— Hounder`).catch(() => {});
}

export async function rotinaDisparos() {
  if (ocupado || !WA.estaConectado()) return;
  ocupado = true;
  try {
    const d = await q1(`select d.*, e.nome empresa, e.estagio from disparos d join empresas e on e.id = d.empresa_id
      where d.status = 'agendado' and d.agendado_para <= now() order by d.agendado_para limit 1`);
    if (!d) return;

    // Fora da janela: empurra o lote inteiro pra próxima abertura, mantendo o espaçamento entre as mensagens
    if (!naJanela()) {
      const abre = proximaAbertura();
      if (!abre) return;
      const r = await q(`update disparos set agendado_para = agendado_para + ($2::timestamptz - $3::timestamptz)
        where lote_id = $1 and status = 'agendado' returning id`, [d.lote_id, abre.toISOString(), new Date(d.agendado_para).toISOString()]);
      const hora = abre.toLocaleString('pt-BR', { timeZone: 'America/Bahia', weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
      log('disparos', `fora do horário comercial: ${r.length} mensagem(ns) empurradas pra ${hora}`);
      await WA.enviarParaMim(`🕗 *Lote segurado até o horário comercial*\n${r.length} mensagem(ns) saem a partir de ${hora}.\n\n— Hounder`).catch(() => {});
      return;
    }

    if ((await enviadosHoje()) >= LIMITE_DIA) { await pararLote(d.lote_id, `Limite de ${LIMITE_DIA} envios por dia atingido.`); return; }

    // Regra dos dois passos: passo 2 em diante só sai se o anterior foi enviado e o lead respondeu depois dele
    // Follow-up existe justamente porque o lead não respondeu: não passa por esta trava (30/09)
    if (d.passo > 1 && d.tipo !== 'followup') {
      // Resposta automática do WhatsApp Business não conta (29/09: LevSaúde e Land Car responderam por robô em segundos)
      const liberado = await q1(`select 1 from disparos a where a.empresa_id = $1 and a.passo = $2 and a.status = 'enviado'
        and (a.respondeu or exists (select 1 from whatsapp_mensagens m join whatsapp_conversas c on c.id = m.conversa_id
          where c.empresa_id = a.empresa_id and m.direcao = 'in' and m.momento > a.enviado_em
          and translate(lower(coalesce(m.texto, '')), 'áàâãéêíóôõúç', 'aaaaeeiooouc') !~ $3)) limit 1`, [d.empresa_id, d.passo - 1, AUTO_RESPOSTA_SQL]);
      if (!liberado) {
        await q("update disparos set status = 'aprovado', agendado_para = null, lote_id = null where id = $1", [d.id]);
        log('disparos', `passo ${d.passo} de ${d.empresa} segurado: o lead ainda não respondeu o passo ${d.passo - 1}`);
        return;
      }
    }

    const tomado = await q1("update disparos set status = 'enviando' where id = $1 and status = 'agendado' returning id", [d.id]);
    if (!tomado) return; // outro ciclo pegou

    try {
      const waId = await WA.enviar({ telefone: d.telefone, texto: d.texto });
      await q(`update disparos set status = 'enviado', enviado_em = now(), wa_id = $2, erro = null,
        followup_em = now() + interval '4 days' where id = $1`, [d.id, waId]);
      // Só uma abordagem por passo: as outras variantes do mesmo passo saem da fila
      await q(`update disparos set status = 'cancelado', erro = 'Outra abordagem deste passo já foi enviada'
        where empresa_id = $1 and passo = $2 and id <> $3 and status in ('rascunho','aprovado','agendado')`, [d.empresa_id, d.passo, d.id]);
      await registrarAtividade(d.empresa_id, 'mensagem', `Prospecção enviada pelo Hounder (passo ${d.passo}, formato ${d.formato})`, d.texto, 'marcelo',
        { disparo_id: d.id, formato: d.formato, aprovado_por: d.aprovado_por });
      await q(`update empresas set estagio = case when estagio in ('novo','qualificado') then 'abordado' else estagio end,
        proxima_acao = 'Se não respondeu: um único follow-up curto (disparo de ' || to_char(now() at time zone 'America/Bahia', 'DD/MM') || ')',
        proxima_acao_em = now() + interval '4 days', atualizado_por = 'hounder' where id = $1`, [d.empresa_id]);

      const resto = await q1("select count(*)::int n from disparos where lote_id = $1 and status = 'agendado'", [d.lote_id]);
      const prox = resto.n ? await q1("select agendado_para from disparos where lote_id = $1 and status = 'agendado' order by agendado_para limit 1", [d.lote_id]) : null;
      const hora = prox ? new Date(prox.agendado_para).toLocaleTimeString('pt-BR', { timeZone: 'America/Bahia', hour: '2-digit', minute: '2-digit' }) : null;
      log('disparos', `enviado: ${d.empresa}`);
      await WA.enviarParaMim(`✅ *Prospecção enviada:* ${d.empresa}\n${resto.n ? `Faltam ${resto.n} no lote, a próxima sai às ${hora}.` : 'Lote concluído.'}\n\n— Hounder`).catch(() => {});
    } catch (e) {
      await q("update disparos set status = 'erro', erro = $2 where id = $1", [d.id, String(e.message || e).slice(0, 300)]);
      await pararLote(d.lote_id, `Falhou em ${d.empresa}: ${String(e.message || e).slice(0, 200)}`);
    }
  } catch (e) { logErro('disparos', e); } finally { ocupado = false; }
}
