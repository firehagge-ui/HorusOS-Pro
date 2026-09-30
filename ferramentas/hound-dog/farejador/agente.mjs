// =============================================================================
// Farejador — o ciclo do agente de prospecção (Fase 1, 29/09/2026)
// Um ciclo por acontecimento: ler a memória → pensar (as 13 perguntas, por
// escrito) → decidir → escrever → crítico → gravar. Toda mensagem vira rascunho
// no Disparos e só sai com a aprovação do Marcelo. Desenho em PLANO-AGENTES.md.
// =============================================================================
import { q, q1 } from '../lib/db.mjs';
import { registrarAtividade } from '../lib/crm.mjs';
import { agentesAtivos, pedirCiclo } from '../lib/agentes.mjs';
import { rodarClaude } from './claude.mjs';
import * as P from './prompts.mjs';
import { revisar, pareceAutoResposta, similaridade } from '../app/js/revisor.js';
import * as WA from './whatsapp.mjs';
import { naJanela, proximaAbertura } from './disparos.mjs';
import { log } from './log.mjs';

const TXT = { type: 'string' };
const LISTA = { type: 'array', items: TXT };
const MSG = {
  type: 'object', required: ['texto', 'porque'],
  properties: { tipo: { type: 'string', enum: ['abertura', 'corpo', 'resposta', 'followup'] }, variante: { type: 'string', enum: ['A', 'B', 'C'] }, angulo: TXT, texto: TXT, porque: TXT },
};
const PERGUNTAS = ['quem_e', 'contexto', 'o_que_impede', 'problema', 'abordagem', 'como_seguir', 'o_que_aconteceu', 'se_responder', 'objecao', 'proxima_pergunta', 'quando_converter', 'quando_parar', 'o_que_falta'];

const ESQ_CICLO = {
  type: 'object',
  required: ['pensamento', 'aconteceu', 'leitura', 'decisao', 'porque', 'plano', 'memoria', 'analise'],
  properties: {
    pensamento: { type: 'object', required: PERGUNTAS, properties: Object.fromEntries(PERGUNTAS.map((k) => [k, TXT])) },
    aconteceu: TXT, leitura: TXT,
    decisao: { type: 'string', enum: ['mensagem', 'manter', 'esperar', 'precisa_marcelo', 'investigar', 'encerrar'] },
    porque: TXT,
    mensagens: { type: 'array', items: MSG },
    verificacao: { type: 'array', items: { type: 'object', required: ['frase', 'fonte'], properties: { frase: TXT, fonte: TXT, como_conferiu: TXT } } },
    precisa_de_voce: { type: ['string', 'null'] },
    encerrar: { type: ['object', 'null'], properties: { resultado: { type: 'string', enum: ['geladeira', 'perdido', 'ganho'] }, voltar_em: { type: ['string', 'null'] }, motivo: TXT } },
    proximo_passo_em: { type: ['string', 'null'], description: 'AAAA-MM-DD ou AAAA-MM-DD HH:mm, horário da Bahia' }, motivo_proximo: { type: ['string', 'null'] },
    plano: { type: 'object', properties: { tese: TXT, proxima_jogada: TXT, quando_parar: TXT, formato: { type: 'string', enum: ['casa', 'curiosidade'] } } },
    memoria: {
      type: 'object',
      properties: {
        quem_e: TXT, decisor: TXT, fatos_novos: { type: 'array', items: { type: 'object', required: ['fato', 'fonte'], properties: { fato: TXT, fonte: TXT, data: TXT } } },
        hipoteses: LISTA, objecoes: LISTA, tentado_novo: LISTA, lacunas: LISTA,
      },
    },
    analise: {
      type: 'object', required: ['momento', 'resumo', 'temperatura'],
      properties: {
        momento: TXT, resumo: TXT, temperatura: { type: 'string', enum: ['frio', 'morno', 'quente'] },
        respostas_provaveis: { type: 'array', items: { type: 'object', required: ['se', 'entao'], properties: { se: TXT, entao: TXT } } },
        evitar: LISTA,
      },
    },
  },
};

const ESQ_CRITICO = {
  type: 'object', required: ['mensagens'],
  properties: {
    mensagens: { type: 'array', items: { type: 'object', required: ['indice', 'aprovada', 'nota', 'problemas'], properties: {
      indice: { type: 'integer' }, aprovada: { type: 'boolean' }, nota: { type: 'integer' }, problemas: LISTA, o_que_falta: TXT,
    } } },
    resumo: TXT,
  },
};

const ESQ_REESCRITA = { type: 'object', required: ['texto', 'porque'], properties: { texto: TXT, angulo: TXT, porque: TXT, mudou: TXT } };

// "Se responder assim" (30/09, pedido do Marcelo: afinadas como as mensagens). Cada resposta pronta passa pelo crítico,
// que corrige no lugar ou manda tirar.
const ESQ_RESPOSTAS = {
  type: 'object', required: ['respostas'],
  properties: { respostas: { type: 'array', items: { type: 'object', required: ['indice', 'ok'], properties: {
    indice: { type: 'integer' }, ok: { type: 'boolean' }, problema: TXT, corrigida: { type: ['string', 'null'] },
  } } } },
};

const agoraBahia = () => new Date().toLocaleString('pt-BR', { timeZone: 'America/Bahia' });
const modeloAgente = async () => (await q1("select valor from config where chave = 'claude'"))?.valor?.modelo_agente || 'claude-opus-5-5';
const umaLinha = (t) => String(t || '').replace(/\s*\n+\s*/g, ' ').trim();
/**
 * Quando o follow-up deveria sair: 4º dia depois da nossa última mensagem, às 9h e pouco da Bahia (regra da casa,
 * 20-escrita.md §10). Se esse momento já passou ou cai fora da janela de envio, a próxima abertura.
 */
export function dataDoFollowup(ultimaNossa, dias = 4) {
  const base = new Date(new Date(ultimaNossa).getTime() + dias * 864e5);
  const ymd = base.toLocaleDateString('en-CA', { timeZone: 'America/Bahia' });
  let alvo = new Date(`${ymd}T09:${String(Math.floor(Math.random() * 40)).padStart(2, '0')}:00-03:00`);
  const cedo = new Date(Date.now() + 15 * 60000);
  if (alvo < cedo) alvo = cedo;
  return naJanela(alvo) ? alvo : proximaAbertura(alvo);
}

/** 'AAAA-MM-DD' ou ISO → timestamptz às 9h da Bahia quando vier só a data. */
export function dataPara(s) {
  if (!s) return null;
  const t = String(s).trim();
  let d;
  // 30/09: o agente escreveu "01/10/2026" e o JavaScript leu como 10 de janeiro (mês/dia). Formato brasileiro primeiro.
  let m = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:[ ,T]+(\d{1,2})[:h](\d{2}))?/);
  if (m) d = new Date(`${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}T${(m[4] || '09').padStart(2, '0')}:${m[5] || '00'}:00-03:00`);
  else if ((m = t.match(/^(\d{4}-\d{2}-\d{2})(?:[ T](\d{2}):(\d{2}))?$/))) d = new Date(`${m[1]}T${m[2] || '09'}:${m[3] || '00'}:00-03:00`);
  else d = new Date(t);
  // Data inválida ou no passado não acorda ninguém na hora errada: vira "sem data"
  if (Number.isNaN(d.getTime()) || d.getTime() < Date.now() - 3600000) return null;
  return d.toISOString();
}

// Motivos de cancelamento que o próprio sistema escreve. Qualquer outro texto é o Marcelo explicando por que descartou.
const MOTIVO_DO_SISTEMA = /^(Substituíd|Outra abordagem|Outra opção|Descartada: você aprovou|Reprovada pelo crítico|Segurado|Tirado do Disparos|Juntado|Lead foi pra geladeira|Estratégia nova)/i;

/** O que o Marcelo fez com as mensagens deste lead: edição (original × final), escolha entre variantes, descarte. */
function leituraDoMarcelo(disparos) {
  const out = [];
  for (const d of disparos) {
    if (d.texto_original && d.texto_original !== d.texto) out.push(`Editou o passo ${d.passo}${d.variante || ''}. Antes: «${d.texto_original}» Depois: «${d.texto}»`);
    if (d.status === 'cancelado' && !d.erro) out.push(`Descartou o passo ${d.passo}${d.variante || ''}: «${d.texto.slice(0, 160)}»`);
    // 30/09, Cintya: o descarte com motivo ("a assistente virtual já faz o retorno") não chegava ao agente, e ele
    // voltou na mesma tese. Descarte explicado é a correção mais valiosa que existe: vai na íntegra.
    if (d.status === 'cancelado' && d.erro && !MOTIVO_DO_SISTEMA.test(d.erro.trim())) out.push(`DESCARTOU COM MOTIVO o passo ${d.passo}${d.variante || ''} («${d.texto.slice(0, 160)}»). Motivo dele: ${d.erro}. Não volte nessa tese nem com outras palavras.`);
    if (d.status === 'cancelado' && /Tirado do Disparos/.test(d.erro || '')) out.push(`Tirou o lead do Disparos (passo ${d.passo}${d.variante || ''})`);
    if (d.status === 'enviado' && d.aprovado_por) {
      const irmas = disparos.filter((x) => x.passo === d.passo && x.id !== d.id && /aprovou a abordagem|já foi enviada|foi enviada pela conversa/.test(x.erro || ''));
      if (irmas.length) out.push(`No passo ${d.passo} escolheu a ${d.variante || 'A'}${d.angulo ? ` (${d.angulo})` : ''} e deixou de lado ${irmas.map((x) => `${x.variante}${x.angulo ? ` (${x.angulo})` : ''}`).join(', ')}`);
    }
  }
  return out.slice(-12);
}

/** Junta a memória antiga com o que o ciclo devolveu (fatos e tentativas acumulam; hipóteses e lacunas se renovam). */
function juntarMemoria(antiga = {}, nova = {}, correcoes = []) {
  const m = { ...antiga };
  if (nova.quem_e) m.quem_e = nova.quem_e;
  if (nova.decisor) m.decisor = nova.decisor;
  const hoje = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Bahia' });
  const fatos = [...(antiga.fatos || [])];
  for (const f of nova.fatos_novos || []) if (f?.fato && !fatos.some((x) => x.fato === f.fato)) fatos.push({ ...f, data: f.data || hoje });
  m.fatos = fatos.slice(-60);
  if (Array.isArray(nova.hipoteses)) m.hipoteses = nova.hipoteses.slice(0, 20);
  if (Array.isArray(nova.lacunas)) m.lacunas = nova.lacunas.slice(0, 20);
  m.objecoes = [...new Set([...(antiga.objecoes || []), ...(nova.objecoes || [])])].slice(-20);
  m.tentado = [...(antiga.tentado || []), ...(nova.tentado_novo || []).map((t) => `${hoje}: ${t}`)].slice(-30);
  // As correções vindas do banco (edições e escolhas do Marcelo) se recalculam a cada ciclo; as anotadas à mão ficam
  const aMao = (antiga.correcoes || []).filter((c) => typeof c === 'object' && c.fonte);
  m.correcoes = [...aMao, ...correcoes].slice(-30);
  return m;
}

/** Passo e tipo da próxima mensagem, pelo que já saiu (pelo Disparos ou pelo celular). */
function proximoPasso(disparos, mensagens) {
  const enviados = disparos.filter((d) => d.status === 'enviado');
  let base = enviados.reduce((mx, d) => Math.max(mx, d.passo || 1), 0);
  const saiu = mensagens.some((m) => m.direcao === 'out');
  if (!base && saiu) base = 1;
  if (!base) return { passo: 1, tipo: 'abertura' };
  const fala = (m) => !(m.tipo === 'outro' && (!m.texto || m.texto.startsWith('[aviso automático'))) && !(m.direcao === 'in' && pareceAutoResposta(m.texto));
  const ultimaHumana = [...mensagens].reverse().find(fala);
  const leadFalou = ultimaHumana?.direcao === 'in';
  const respostas = mensagens.filter((m) => m.direcao === 'in' && fala(m)).length;
  return { passo: base + 1, tipo: !leadFalou ? 'followup' : base === 1 && respostas <= 1 ? 'corpo' : 'resposta' };
}

async function contexto(empresaId, gatilhos) {
  const [empresa, agente] = await Promise.all([
    q1('select * from empresas where id = $1', [empresaId]),
    q1('select * from agentes where empresa_id = $1', [empresaId]),
  ]);
  const [eventos, inv, mensagens, disparos, playbook, outros, lote] = await Promise.all([
    q('select * from agente_eventos where agente_id = $1 and gatilho <> \'nota\' order by criado_em desc limit 12', [agente.id]),
    // A investigação com briefing; sem ela, o dossiê antigo (resumo + texto) serve de contexto
    q1("select dados, resumo, conteudo_md, criado_em from pesquisas where empresa_id = $1 and status = 'pronta' and tipo = 'dossie' order by (dados ? 'briefing') desc, criado_em desc limit 1", [empresaId]),
    q(`select m.direcao, m.texto, m.tipo, m.momento from whatsapp_mensagens m join whatsapp_conversas c on c.id = m.conversa_id
       where c.empresa_id = $1 order by m.momento desc limit 40`, [empresaId]).then((r) => r.reverse()),
    q('select * from disparos where empresa_id = $1 order by criado_em', [empresaId]),
    q('select * from playbook_objecoes order by ordem'),
    agentesAtivos().then((l) => l.filter((a) => a.empresa_id !== empresaId)),
    q(`select texto from disparos where empresa_id <> $1 and status in ('rascunho','aprovado','agendado','enviado')
       and criado_em > now() - interval '14 days' order by criado_em desc limit 16`, [empresaId]).then((r) => r.map((x) => x.texto)),
  ]);
  let briefing = inv?.dados?.briefing || null;
  if (briefing) briefing = Object.fromEntries(['veredito', 'personalizacao', 'sinais', 'por_que_agora', 'leitura', 'pessoas', 'tese', 'tese_alternativas', 'custo', 'vender', 'respostas', 'mapa', 'nao_usar', 'compliance', 'fatos', 'pendencias'].filter((k) => briefing[k]).map((k) => [k, briefing[k]]));
  else if (inv) briefing = { dossie_antigo: `${new Date(inv.criado_em).toLocaleDateString('pt-BR', { timeZone: 'America/Bahia' })}, sem briefing em campos. ${inv.resumo || ''}\n${(inv.conteudo_md || '').slice(0, 7000)}` };
  // Resposta automática marcada: o agente não confunde o robô com o lead
  // [outro] é tipo que o WhatsApp manda e o sistema não lê (aviso de mensagens temporárias, enquete...): não é fala
  // de ninguém (30/09, Cintya: "Sua empresa não pode mais usar as mensagens temporárias" aparecia como mensagem)
  const msgs = mensagens.map((m) => (m.tipo === 'outro' && !m.texto ? { ...m, texto: '[aviso automático do WhatsApp ou item sem texto: não é fala de ninguém, ignore]' }
    : m.direcao === 'in' && pareceAutoResposta(m.texto) ? { ...m, texto: `[robô] ${m.texto}` } : m));
  const pendentes = disparos.filter((d) => ['rascunho', 'aprovado'].includes(d.status));
  const visiveis = disparos.filter((d) => d.status !== 'cancelado' || !d.erro || !/Substituído/.test(d.erro));
  return { empresa, agente, eventos, briefing, briefingFatos: inv?.dados?.briefing?.fatos || [], mensagens: msgs, disparos, visiveis, pendentes, playbook, outros, lote, gatilhos };
}

async function criticar({ empresa, mensagens, candidatas, verificacao, lote, correcoes = [], modelo, cancelado, progresso }) {
  progresso('Crítico lendo as mensagens como o dono leria');
  const r = await rodarClaude({
    prompt: P.promptCritico({ empresa, mensagens, candidatas, verificacao, lote, correcoes }),
    sistema: 'Você é o crítico de mensagens de prospecção da Hórus. Responda só no formato pedido.',
    modelo, modo: 'leve', esquemaJson: ESQ_CRITICO, timeoutMs: 6 * 60 * 1000, deveParar: cancelado,
  });
  const lista = r.json?.mensagens || [];
  return candidatas.map((_, i) => lista.find((x) => x.indice === i) || { aprovada: false, nota: 0, problemas: ['O crítico não devolveu parecer desta mensagem.'] });
}

async function revisarRespostas({ empresa, mensagens, respostas, verificacao, correcoes, modelo, cancelado, progresso }) {
  if (!respostas?.length) return respostas || [];
  progresso('Crítico afinando o "Se responder assim"');
  try {
    const r = await rodarClaude({
      prompt: P.promptRespostas({ empresa, mensagens, respostas, verificacao, correcoes }),
      sistema: 'Você é o crítico de mensagens de prospecção da Hórus. Responda só no formato pedido.',
      modelo, modo: 'leve', esquemaJson: ESQ_RESPOSTAS, timeoutMs: 5 * 60 * 1000, deveParar: cancelado,
    });
    const parecer = r.json?.respostas || [];
    const out = [];
    respostas.forEach((x, i) => {
      const p = parecer.find((y) => y.indice === i);
      if (!p || p.ok) { out.push(x); return; }
      const nova = p.corrigida && umaLinha(p.corrigida);
      // A corrigida também passa no revisor mecânico; sem conserto, a resposta sai da tela
      if (nova && !/[—–]/.test(nova) && !revisar(nova, { passo: 2, empresa: empresa.nome }).itens.some((z) => z.nivel === 'veto')) out.push({ ...x, entao: nova, _ajustada: p.problema || true });
    });
    return out;
  } catch (e) {
    if (/Cancelado/.test(e.message)) throw e;
    log('agente', `revisão das respostas falhou: ${e.message}`);
    return respostas;
  }
}

function itensDoCritico(c) {
  if (!c) return [];
  if (c.aprovada) return [{ regra: 'critico', nivel: 'ok', trecho: '', dica: `Crítico: aprovada, nota ${c.nota}/50` }];
  return [{ regra: 'critico', nivel: 'aviso', trecho: '', dica: `Crítico reprovou (nota ${c.nota}/50): ${(c.problemas || []).join(' · ')}${c.o_que_falta ? ` · Falta: ${c.o_que_falta}` : ''}` }];
}

/**
 * O ciclo. job.entrada.eventos = [{gatilho, detalhe, em}] (a fila junta acontecimentos seguidos num ciclo só).
 */
export async function cicloAgente(job, progresso, cancelado) {
  const empresaId = job.empresa_id;
  const ag0 = await q1('select * from agentes where empresa_id = $1', [empresaId]);
  if (!ag0) throw new Error('Este lead não tem agente');
  if (ag0.status !== 'ativo') return { pulado: `agente ${ag0.status}` };
  await q("update agentes set fase = 'trabalhando' where id = $1", [ag0.id]);
  const gatilhos = job.entrada?.eventos?.length ? job.entrada.eventos : [{ gatilho: job.entrada?.gatilho || 'pedido', detalhe: job.entrada?.detalhe }];
  const ctx = await contexto(empresaId, gatilhos);
  const { empresa, agente } = ctx;
  const modelo = await modeloAgente();
  const { passo, tipo } = proximoPasso(ctx.disparos, ctx.mensagens);
  // As correções do Marcelo: as do banco (edição, escolha, descarte com motivo) + as anotadas à mão na memória
  const correcoes = leituraDoMarcelo(ctx.disparos);
  const todasCorrecoes = [...(agente.memoria?.correcoes || []).filter((c) => typeof c === 'object' && c.fonte), ...correcoes];

  progresso(`Pensando: ${empresa.nome} (${gatilhos.map((g) => g.gatilho).join(', ')})`);
  const r = await rodarClaude({
    prompt: P.promptAgente({
      gatilho: gatilhos.map((g) => g.gatilho).join(' + '), detalhe: gatilhos.map((g) => g.detalhe).filter(Boolean).join('\n'),
      agora: agoraBahia(), empresa, agente, eventos: ctx.eventos, briefing: ctx.briefing, mensagens: ctx.mensagens,
      disparos: ctx.visiveis, marcelo: correcoes, pendentes: ctx.pendentes, outros: ctx.outros, lote: ctx.lote, playbook: ctx.playbook,
      passoSugerido: passo, tipoSugerido: tipo,
    }),
    sistema: P.REGRAS_CASA, modelo, modo: 'horus', ferramentas: ['Read', 'Grep', 'Glob'],
    // Só leitura, como a análise de conversa: o texto do lead não tem como virar ação
    proibidas: ['WebSearch', 'WebFetch', 'mcp__hound-dog', 'mcp__firecrawl', 'mcp__navegador'],
    esquemaJson: ESQ_CICLO, timeoutMs: 12 * 60 * 1000, deveParar: cancelado,
    aoFerramenta: (f) => progresso(`${f.rotulo}${f.detalhe ? `: ${f.detalhe.slice(0, 70)}` : ''}`),
  });
  const d = r.json;
  if (!d?.decisao) throw new Error('O agente não devolveu o ciclo no formato esperado.');

  // O número da ficha; sem ele, o da conversa em andamento (é o número com que o Marcelo já fala, não um número presumido;
  // 30/09: a Autobahn conversa pelo WhatsApp e a ficha estava sem o campo)
  const telConversa = (await q1('select telefone from whatsapp_conversas where empresa_id = $1 order by ultima_em desc nulls last limit 1', [empresaId]))?.telefone;
  const tel = String(empresa.whatsapp || telConversa || '').replace(/\D/g, '');
  let decisao = d.decisao;
  let precisa = d.precisa_de_voce || null;
  let saidas = [];
  let reprovadas = [];
  let reciclar = null;
  let parecer = null;
  const formatoSaida = d.plano?.formato || agente.plano?.formato || 'casa';

  // Verificação: a do ciclo + os fatos conferidos da investigação (o crítico confere a mensagem contra as duas)
  const verificacao = [...(d.verificacao || []), ...ctx.briefingFatos.map((f) => ({ frase: f.fato, fonte: f.fonte || '', como_conferiu: f.como_conferiu || '' }))];

  if (decisao === 'mensagem' && tel.length < 12) { decisao = 'precisa_marcelo'; precisa = 'Não há WhatsApp confirmado na ficha. Confirme o número pra eu preparar a mensagem.'; }

  if (decisao === 'mensagem' && d.mensagens?.length) {
    let candidatas = d.mensagens.filter((m) => m.texto && !/[—–]/.test(m.texto)).slice(0, 3).map((m, i) => ({
      ...m, texto: umaLinha(m.texto), passo, tipo: m.tipo || tipo, variante: m.variante || 'ABC'[i],
    }));
    candidatas.forEach((c) => { c.revisor = revisar(c.texto, { passo, tipo: c.tipo, empresa: empresa.nome, lote: ctx.lote }).itens; });
    // Crítico → uma reescrita no que ele reprovou → crítico de novo só nas reescritas
    let criticas = await criticar({ empresa, mensagens: ctx.mensagens, candidatas, verificacao, lote: ctx.lote, correcoes: todasCorrecoes, modelo, cancelado, progresso });
    const primeiraRodada = candidatas.map((c, i) => [c, criticas[i], i]).filter(([, cr]) => !cr.aprovada);
    if (primeiraRodada.length) {
      progresso(`Reescrevendo ${primeiraRodada.length} mensagem(ns) com o que o crítico apontou`);
      for (const [c, cr, i] of primeiraRodada) {
        try {
          const rr = await rodarClaude({
            prompt: P.promptReescrita({ empresa, mensagens: ctx.mensagens, candidata: c, critica: cr, verificacao, plano: d.plano,
              correcoes: todasCorrecoes }),
            sistema: P.REGRAS_CASA, modelo, modo: 'leve', esquemaJson: ESQ_REESCRITA, timeoutMs: 5 * 60 * 1000, deveParar: cancelado,
          });
          if (rr.json?.texto && !/[—–]/.test(rr.json.texto)) {
            candidatas[i] = { ...c, texto: umaLinha(rr.json.texto), angulo: rr.json.angulo || c.angulo, porque: rr.json.porque || c.porque, reescrita: { antes: c.texto, critica: cr, mudou: rr.json.mudou || '' } };
            candidatas[i].revisor = revisar(candidatas[i].texto, { passo, tipo: candidatas[i].tipo, empresa: empresa.nome, lote: ctx.lote }).itens;
          }
        } catch (e) { if (/Cancelado/.test(e.message)) throw e; log('agente', `reescrita falhou: ${e.message}`); }
      }
      const idx = primeiraRodada.map(([, , i]) => i);
      const segunda = await criticar({ empresa, mensagens: ctx.mensagens, candidatas: idx.map((i) => candidatas[i]), verificacao, lote: ctx.lote, correcoes: todasCorrecoes, modelo, cancelado, progresso });
      idx.forEach((i, k) => { criticas[i] = segunda[k]; });
    }
    parecer = criticas;
    // Só vira rascunho o que passou no revisor E no crítico (29/09: na Bioclin a reescrita reprovada ficou salva com
    // aviso e trazia de volta o erro que o Marcelo corrigiu). O reprovado fica no diário, não na frente dele.
    const todas = candidatas.map((c, i) => ({ ...c, critica: criticas[i] }));
    const aprovadas = todas.filter((c) => !c.revisor.some((x) => x.nivel === 'veto') && c.critica?.aprovada);
    // Reescrita que virou cópia de outra opção não é outra opção (30/09, Autobahn: A e B idênticas no painel)
    const finais = aprovadas.filter((c, i) => !aprovadas.slice(0, i).some((o) => similaridade(o.texto, c.texto) >= 0.9));
    reprovadas = todas.filter((c) => !finais.includes(c)).map((c) => ({ texto: c.texto, angulo: c.angulo, critica: c.critica, revisor: c.revisor.filter((x) => x.nivel === 'veto') }));
    if (!finais.length) {
      decisao = 'precisa_marcelo';
      precisa = `Escrevi ${todas.length} opção(ões) e nenhuma passou no crítico nem depois da reescrita. O principal: ${todas.map((c) => c.critica?.o_que_falta || (c.critica?.problemas || [])[0] || c.revisor.find((x) => x.nivel === 'veto')?.dica).filter(Boolean).slice(0, 2).join(' · ')}. Me diga o caminho ou peça outra tentativa.`;
    } else {
      // As pendentes do mesmo passo saem (do agente ou da investigação); o que já está agendado num lote fica
      await q(`update disparos set status = 'cancelado', erro = 'Substituído pelo agente' where empresa_id = $1 and passo = $2 and status in ('rascunho','aprovado')`, [empresaId, passo]);
      saidas = finais;
    }
  } else if (decisao === 'mensagem') {
    decisao = 'precisa_marcelo'; precisa = precisa || 'Decidi escrever, mas não saiu mensagem válida. Me diga o que quer.';
  }

  if (decisao === 'manter' && ctx.pendentes.length) {
    const candidatas = ctx.pendentes.map((p) => ({ passo: p.passo, variante: p.variante, angulo: p.angulo, texto: p.texto, revisor: revisar(p.texto, { passo: p.passo, empresa: empresa.nome, lote: ctx.lote }).itens }));
    parecer = await criticar({ empresa, mensagens: ctx.mensagens, candidatas, verificacao, lote: ctx.lote, correcoes: todasCorrecoes, modelo, cancelado, progresso });
    // Mesma régua das mensagens novas (29/09, Cavalcante: o estrategista manteve 5 pendentes e o crítico reprovou as 5,
    // uma com fato falso): a reprovada sai; se o passo atual ficar sem mensagem, um ciclo novo escreve com as notas.
    const notas = [];
    for (const [i, p] of ctx.pendentes.entries()) {
      if (!parecer[i]?.aprovada) {
        await q("update disparos set status = 'cancelado', erro = $2 where id = $1", [p.id, `Reprovada pelo crítico do agente: ${(parecer[i]?.problemas || []).join(' · ')}`.slice(0, 900)]);
        notas.push(`p${p.passo}${p.variante} «${p.texto.slice(0, 120)}»: ${parecer[i]?.o_que_falta || (parecer[i]?.problemas || [])[0] || ''}`);
        continue;
      }
      const rev = [...(Array.isArray(p.revisao) ? p.revisao.filter((x) => x.regra !== 'critico') : []), ...itensDoCritico(parecer[i])];
      await q('update disparos set revisao = $2, raciocinio = coalesce(raciocinio, $3) where id = $1', [p.id, JSON.stringify(rev), `Mantida pelo agente: ${d.porque}`.slice(0, 400)]);
    }
    const sobrou = ctx.pendentes.filter((p, i) => parecer[i]?.aprovada);
    if (!sobrou.some((p) => p.passo === passo) && notas.length) {
      if (gatilhos.some((g) => g.gatilho === 'critico_reprovou')) {
        decisao = 'precisa_marcelo';
        precisa = `O crítico reprovou de novo o que eu tinha pro passo ${passo}: ${notas.join(' | ')}`.slice(0, 900);
      } else {
        reciclar = `O crítico reprovou as pendentes que você quis manter. Escreva de novo o passo ${passo} levando isto em conta: ${notas.join(' | ')}`;
      }
    } else if (!sobrou.length) decisao = 'esperar';
  } else if (decisao === 'manter') decisao = 'esperar';

  // O diário primeiro: as mensagens gravadas apontam pro ciclo que as escreveu
  const faseDe = { mensagem: 'pronto_aprovar', manter: 'pronto_aprovar', precisa_marcelo: 'precisa_voce', investigar: 'trabalhando', esperar: 'esperando_lead' };
  let fase = reciclar ? 'trabalhando' : faseDe[decisao] || 'esperando_lead';
  let status = 'ativo';
  if (decisao === 'encerrar') { fase = d.encerrar?.resultado || 'geladeira'; status = 'encerrado'; }
  const evento = await q1(`insert into agente_eventos (agente_id, empresa_id, gatilho, aconteceu, leitura, decisao, porque, dados, job_id)
    values ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning id`,
  [agente.id, empresaId, gatilhos.map((g) => g.gatilho).join('+'), d.aconteceu, d.leitura, decisao, d.porque,
    JSON.stringify({ pensamento: d.pensamento, plano: d.plano, parecer_critico: parecer, precisa_de_voce: precisa, encerrar: d.encerrar || null, modelo,
      reescritas: saidas.filter((c) => c.reescrita).map((c) => c.reescrita), reprovadas, consultou: (r.ferramentas || []).map((f) => f.detalhe || f.rotulo).filter(Boolean).slice(0, 12) }),
    job.id]);

  // Follow-up já nasce com a hora em que deveria sair: o Marcelo aprova e ele fica programado pra ela
  const ultimaNossa = [...ctx.mensagens].reverse().find((m) => m.direcao === 'out' && !(m.tipo === 'outro' && (!m.texto || m.texto.startsWith('[aviso automático'))));
  for (const c of saidas) {
    const sugerido = c.tipo === 'followup' && ultimaNossa ? dataDoFollowup(ultimaNossa.momento) : null;
    await q(`insert into disparos (empresa_id, telefone, texto, formato, passo, variante, angulo, tipo, verificacao, revisao, raciocinio, agente_ciclo_id, sugerido_para, criado_por)
      values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'agente')`,
    [empresaId, tel, c.texto, formatoSaida, passo, c.variante, c.angulo ? String(c.angulo).slice(0, 60) : null, c.tipo,
      JSON.stringify(verificacao.slice(0, 20)), JSON.stringify([...c.revisor, ...itensDoCritico(c.critica)]), String(c.porque || '').slice(0, 400), evento.id,
      sugerido ? sugerido.toISOString() : null]);
  }

  // Investigação sozinho (decisão 2 do Marcelo), com freio: uma por semana por lead e nunca duas na fila
  if (decisao === 'investigar') {
    const recente = agente.ultima_investigacao_em && Date.now() - new Date(agente.ultima_investigacao_em) < 7 * 864e5;
    const naFila = await q1("select 1 from jobs where tipo = 'investigar_empresa' and empresa_id = $1 and status in ('fila','processando')", [empresaId]);
    if (recente && !naFila) {
      fase = 'precisa_voce';
      precisa = `Queria investigar de novo (${d.porque}), mas já investiguei nos últimos 7 dias. Libera?`;
    } else if (!naFila) {
      await q(`insert into jobs (tipo, entrada, empresa_id, prioridade, criado_por) values ('investigar_empresa', $1, $2, 4, 'agente')`,
        [JSON.stringify({ empresa_id: empresaId, agente: true, motivo: d.porque }), empresaId]);
      await q('update agentes set investigacoes = investigacoes + 1, ultima_investigacao_em = now() where id = $1', [agente.id]);
    }
  }

  const memoria = juntarMemoria(agente.memoria, d.memoria, correcoes);
  const plano = { ...(agente.plano || {}), ...(d.plano || {}) };
  const proximo = decisao === 'encerrar' ? dataPara(d.encerrar?.voltar_em) : dataPara(d.proximo_passo_em);
  await q(`update agentes set status = $2, fase = $3, plano = $4, memoria = $5, precisa_de_voce = $6, proximo_ciclo_em = $7, motivo_proximo = $8,
    ultimo_ciclo_em = now(), ciclos = ciclos + 1 where id = $1`,
  // precisa_de_voce fica gravado mesmo com mensagem pronta: é a conferência que o Marcelo faz antes de aprovar
  [agente.id, status, fase, JSON.stringify(plano), JSON.stringify(memoria), precisa, proximo,
    decisao === 'encerrar' ? (d.encerrar?.motivo || null) : (d.motivo_proximo || null)]);

  // O crítico derrubou o que o estrategista quis manter: um ciclo novo escreve com as notas (uma vez só por rodada)
  if (reciclar) await pedirCiclo(empresaId, 'critico_reprovou', reciclar, 'agente');

  // A tela da conversa continua mostrando a leitura (agora a do agente); as mensagens ficam em "Mensagens preparadas"
  if (d.analise?.respostas_provaveis?.length) {
    d.analise.respostas_provaveis = await revisarRespostas({ empresa, mensagens: ctx.mensagens, respostas: d.analise.respostas_provaveis, verificacao, correcoes: todasCorrecoes, modelo, cancelado, progresso });
  }
  const conv = await q1('select id from whatsapp_conversas where empresa_id = $1 order by ultima_em desc nulls last limit 1', [empresaId]);
  if (conv && d.analise) {
    const a = { ...d.analise, sugestoes: [], proxima_acao: plano.proxima_jogada || null, _modelo: modelo, _agente: true };
    await q("update whatsapp_conversas set analise = $2, analise_status = 'pronta', analise_em = now() where id = $1", [conv.id, JSON.stringify(a)]);
  }
  if (d.analise?.temperatura && d.analise.temperatura !== empresa.temperatura) await q("update empresas set temperatura = $2, atualizado_por = 'agente' where id = $1", [empresaId, d.analise.temperatura]);
  if (plano.proxima_jogada) await q("update empresas set proxima_acao = $2, proxima_acao_em = coalesce($3, proxima_acao_em), atualizado_por = 'agente' where id = $1", [empresaId, plano.proxima_jogada.slice(0, 300), proximo]);

  const rotulo = { mensagem: 'mensagem pronta pra aprovar', manter: 'manteve as mensagens pendentes', esperar: 'esperando o lead', precisa_marcelo: 'precisa de você', investigar: 'pediu uma investigação', encerrar: `encerrou (${fase})` }[decisao];
  await registrarAtividade(empresaId, 'nota', `Agente: ${rotulo}`, [d.leitura, d.porque, precisa].filter(Boolean).join(' · ').slice(0, 900), 'agente');

  const saiu = saidas;
  if (saiu.length) {
    const onde = passo === 1 ? 'na tela Disparos' : saiu[0].tipo === 'followup' ? 'em Disparos › Follow-ups programados' : 'na conversa (Mensagens preparadas) e na ficha';
    await WA.enviarParaMim(`🤖 *Agente · ${empresa.nome}*\n${d.leitura}\n\n${saiu.length} opção(ões) ${onde}. A: ${saiu[0].porque}${precisa ? `\n\n*Antes de aprovar:* ${precisa}` : ''}\n\n— Hounder`).catch(() => {});
  } else if (fase === 'precisa_voce') {
    await WA.enviarParaMim(`🤖 *Agente · ${empresa.nome} precisa de você*\n${precisa}\n\n— Hounder`).catch(() => {});
  }
  log('agente', `${empresa.nome}: ${decisao} (${fase})${saiu.length ? `, ${saiu.length} mensagem(ns)` : ''}`);
  return { decisao, fase, mensagens: saiu.length, evento_id: evento.id };
}
