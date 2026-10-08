/* =============================================================================
   HOUNDER — Saúde da conversa com o lead (desistência controlada, 01/10/2026).
   Compartilhado entre o painel (Mesa) e o Farejador (o agente recebe os mesmos
   números), como o score.js. A régua da casa: abertura, UM follow-up no 4º dia,
   e sem resposta de novo vai pra geladeira com data de voltar (20-escrita §10,
   cold-message-processo.md). Ninguém é apagado: o agente recomenda, o Marcelo decide.

   Estados (do melhor pro pior):
     respondendo          gente falou nos últimos 7 dias, ou falou por último
     em_acompanhamento    mandamos há pouco (menos de 4 dias) ou ainda não mandamos nada
     sem_resposta         1 tentativa sem resposta há 4 dias ou mais
     baixa_probabilidade  2+ tentativas sem resposta (abertura + follow-up) há 5+ dias, ou 14+ dias de silêncio
     desinteressado       recusa clara na última fala humana
   (geladeira/encerrado vêm do status do agente, não daqui)
   ============================================================================= */

const DIA = 864e5;
// Recusa clara. Sem "obrigado" sozinho: na casa, aceitar o obrigado não é recusa (§8 da abordagem).
const RECUSA = /\b(n[aã]o (tenho|temos|tem) interesse|sem interesse|n[aã]o (precisamos|preciso)|j[aá] (temos|tenho) (algu[eé]m|ag[eê]ncia|quem)|n[aã]o quero|n[aã]o queremos|pode (me )?(tirar|remover)|para de (mandar|enviar)|pare de (mandar|enviar)|n[aã]o (me )?mande mais|descadastr|n[aã]o (é|e) (pra|para) n[oó]s|n[aã]o (faz|fazemos) sentido)\b/i;

/**
 * @param {object} p
 * @param {Array<{momento:string, direcao:'in'|'out', humana?:boolean, texto?:string}>} p.falas  mensagens da conversa (in = lead)
 * @param {Array<{enviado_em:string, tipo?:string, passo?:number}>} p.envios  disparos enviados (abertura, follow-up, passos)
 * @param {string} [p.desde]  quando o lead entrou no acompanhamento
 * @param {number} [p.agora]
 */
export function saudeDoLead({ falas = [], envios = [], desde, agora = Date.now() } = {}) {
  const humanas = falas.filter((m) => m.direcao === 'in' && m.humana !== false && m.texto);
  const ultimaHumana = humanas.at(-1) || null;
  const tHumana = ultimaHumana ? new Date(ultimaHumana.momento).getTime() : 0;
  // Nossas tentativas: o que saiu pelo Disparos e o que saiu pela conversa (out), sem contar repetição no mesmo minuto
  const saidas = [
    ...envios.filter((d) => d.enviado_em).map((d) => ({ t: new Date(d.enviado_em).getTime(), followup: d.tipo === 'followup' })),
    ...falas.filter((m) => m.direcao === 'out').map((m) => ({ t: new Date(m.momento).getTime(), followup: false })),
  ].sort((a, b) => a.t - b.t).filter((s, i, arr) => !i || s.t - arr[i - 1].t > 10 * 60 * 1000);
  const depois = saidas.filter((s) => s.t > tHumana);
  const tentativas = depois.length;
  const ultimaSaida = saidas.at(-1)?.t || 0;
  const diasSemResposta = tentativas ? Math.floor((agora - depois[0].t) / DIA) : 0;
  const diasDesdeUltimaSaida = ultimaSaida ? Math.floor((agora - ultimaSaida) / DIA) : null;
  const diasDesdeHumana = tHumana ? Math.floor((agora - tHumana) / DIA) : null;
  const diasNoFunil = desde ? Math.floor((agora - new Date(desde).getTime()) / DIA) : null;
  const followups = depois.filter((s) => s.followup).length;
  const recusou = !!(ultimaHumana && RECUSA.test(ultimaHumana.texto || '') && tHumana >= ultimaSaida - DIA);
  const soRobo = !humanas.length && falas.some((m) => m.direcao === 'in' && m.humana === false);

  let estado, motivo;
  if (recusou) { estado = 'desinteressado'; motivo = `Recusou: «${String(ultimaHumana.texto).slice(0, 90)}»`; }
  else if (ultimaHumana && (!tentativas || diasDesdeHumana <= 7)) { estado = 'respondendo'; motivo = tentativas ? `Falou há ${diasDesdeHumana} dia(s)` : 'Falou por último: é a sua vez'; }
  else if (!saidas.length) { estado = 'em_acompanhamento'; motivo = 'Nada enviado ainda'; }
  else if (tentativas >= 2 && diasDesdeUltimaSaida >= 5) { estado = 'baixa_probabilidade'; motivo = `${tentativas} tentativas sem resposta; a última há ${diasDesdeUltimaSaida} dias`; }
  else if (diasSemResposta >= 14) { estado = 'baixa_probabilidade'; motivo = `${diasSemResposta} dias sem resposta`; }
  else if (tentativas >= 1 && diasDesdeUltimaSaida >= 4) { estado = 'sem_resposta'; motivo = `${tentativas === 1 ? '1 tentativa' : `${tentativas} tentativas`} sem resposta há ${diasDesdeUltimaSaida} dias`; }
  else {
    estado = 'em_acompanhamento';
    const prazo = tentativas >= 2 ? 5 : 4;
    motivo = tentativas ? `${tentativas === 1 ? '1 tentativa' : `${tentativas} tentativas`} sem resposta; a última há ${diasDesdeUltimaSaida} dia(s), prazo de ${prazo}` : 'No prazo';
  }

  // O que a régua sugere fazer (o agente usa como base; o Marcelo decide)
  const sugestao = estado === 'desinteressado' ? 'encerrar como perdido (agradecer em uma linha se couber)'
    : estado === 'baixa_probabilidade' ? 'parar de insistir agora: geladeira com data de voltar na próxima janela do segmento'
    : estado === 'sem_resposta' ? (followups ? 'esperar o prazo do follow-up; sem resposta, geladeira' : 'um follow-up curto (um só), com saída fácil')
    : null;

  return {
    estado, motivo, sugestao,
    sinais: { tentativas_sem_resposta: tentativas, follow_ups_sem_resposta: followups, dias_sem_resposta: diasSemResposta,
      dias_desde_ultima_fala_humana: diasDesdeHumana, dias_no_acompanhamento: diasNoFunil, falas_humanas: humanas.length,
      so_robo_respondeu: soRobo, recusou },
  };
}

export const ROTULO_SAUDE = {
  respondendo: ['verde', 'Respondendo'],
  em_acompanhamento: ['azul', 'Em acompanhamento'],
  sem_resposta: ['amarelo', 'Sem resposta'],
  baixa_probabilidade: ['vermelho', 'Baixa chance de resposta'],
  desinteressado: ['vermelho', 'Desinteressado'],
};

/** Texto pro pedido do agente: os números da régua e o que ela sugere. */
export function saudeParaPrompt(s) {
  if (!s) return '';
  const x = s.sinais;
  return `SAÚDE DA CONVERSA (régua da casa, calculada pelo sistema)
Estado: ${s.estado} · ${s.motivo}
Tentativas sem resposta desde a última fala humana: ${x.tentativas_sem_resposta} (follow-ups: ${x.follow_ups_sem_resposta}) · dias sem resposta: ${x.dias_sem_resposta}
Última fala humana: ${x.dias_desde_ultima_fala_humana == null ? 'nunca falou como pessoa' : `há ${x.dias_desde_ultima_fala_humana} dia(s)`}${x.so_robo_respondeu ? ' (só o robô do WhatsApp respondeu)' : ''} · no acompanhamento há ${x.dias_no_acompanhamento ?? '?'} dia(s)
${s.sugestao ? `A régua sugere: ${s.sugestao}.` : ''}`;
}
