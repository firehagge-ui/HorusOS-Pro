// =============================================================================
// Farejador — o que cada tipo de trabalho faz.
// Cada função recebe o job e um "progresso(texto)" para o painel acompanhar ao vivo.
// =============================================================================
import { q, q1 } from '../lib/db.mjs';
import { salvarEmpresa, registrarAtividade, adicionarItensLista, resumoCRM, detalheEmpresa } from '../lib/crm.mjs';
import { criarOperador } from '../lib/operadores.mjs';
import { rodarClaude } from './claude.mjs';
import * as P from './prompts.mjs';
import { revisar, similaridade } from '../app/js/revisor.js';
import * as WA from './whatsapp.mjs';
import { coletarESalvar } from './instagram.mjs';
import { log } from './log.mjs';
import { detectarObjecoesTexto } from './objecoes.mjs';
import { midiaSemana, midiaAjuste, midiaTriagem, coletarAgora } from './midia.mjs';
import { cicloAgente } from './agente.mjs';
import { pedirCiclo } from '../lib/agentes.mjs';

const FERR_PESQUISA = ['WebSearch', 'WebFetch', 'Read', 'Grep', 'Glob', 'mcp__firecrawl', 'mcp__hound-dog'];
const FERR_INVESTIGACAO = [...FERR_PESQUISA, 'mcp__navegador'];

/** Limite da assinatura do Claude não é erro: a tarefa espera e volta sozinha. */
export const ehLimiteDoClaude = (e) => /session limit|usage limit|weekly limit|hit your .{0,20}limit|limite de uso|rate limit|resets? \d/i.test(String(e?.message || e || ''));
const AVISO_LIMITE = 'O limite da assinatura do Claude foi atingido. A tarefa volta sozinha assim que liberar.';
const FERR_CHAT = ['Read', 'Grep', 'Glob', 'WebSearch', 'WebFetch', 'mcp__hound-dog', 'mcp__firecrawl'];

async function config(chave, padrao = {}) { return (await q1('select valor from config where chave = $1', [chave]))?.valor ?? padrao; }
// Tudo em Opus 5.5 com esforço alto por padrão (a leitura de conversa também, desde 29/09, pedido do Marcelo)
const modeloDe = async (qual) => (await config('claude', {}))[qual] || 'claude-opus-5-5';

/* =============================== Chat =============================== */
export async function chat(job, progresso, cancelado) {
  const { thread_id, mensagem_id, modelo, empresa_id, pesquisa_id } = job.entrada;
  const msgs = await q('select papel, conteudo, autor, criado_em from chat_mensagens where thread_id = $1 and id <> $2 and status in (\'ok\') order by criado_em', [thread_id, mensagem_id]);
  const atual = msgs.filter((m) => m.papel === 'user').pop();
  const historico = msgs.slice(-24);

  const partes = [`AGORA: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Bahia' })} (horário da Bahia)`];
  partes.push(`\nSITUAÇÃO DO CRM (resumo automático)\n${JSON.stringify(await resumoCRM(), null, 1).slice(0, 9000)}`);
  if (empresa_id) {
    const d = await detalheEmpresa(empresa_id);
    if (d) partes.push(`\nEMPRESA EM FOCO (o Marcelo anexou; "ele", "ela", "esse lead", "a mensagem" = esta empresa)\n${JSON.stringify(d, null, 1).slice(0, 7000)}`);
    const inv = await q1("select titulo, criado_em, nota_oportunidade, resumo, dados from pesquisas where empresa_id = $1 and status = 'pronta' order by criado_em desc limit 1", [empresa_id]);
    if (inv) partes.push(`\nÚLTIMA INVESTIGAÇÃO (${new Date(inv.criado_em).toLocaleDateString('pt-BR', { timeZone: 'America/Bahia' })}, nota ${inv.nota_oportunidade ?? '?'})\n${inv.resumo || ''}\n${JSON.stringify(inv.dados?.briefing || inv.dados || {}, null, 1).slice(0, 9000)}`);
    const disp = await q("select id, status, formato, passo, texto, verificacao, criado_em from disparos where empresa_id = $1 and status <> 'cancelado' order by criado_em desc limit 3", [empresa_id]);
    if (disp.length) partes.push(`\nMENSAGENS NO DISPAROS\n${JSON.stringify(disp, null, 1).slice(0, 4000)}`);
  }
  if (pesquisa_id) {
    const p = await q1('select titulo, resumo, dados, conteudo_md from pesquisas where id = $1', [pesquisa_id]);
    if (p) partes.push(`\nPESQUISA ANEXADA: ${p.titulo}\n${(p.resumo || '')}\n${JSON.stringify(p.dados).slice(0, 2500)}\n${(p.conteudo_md || '').slice(0, 5000)}`);
  }
  if (historico.length > 1) partes.push(`\nCONVERSA ATÉ AQUI\n${historico.slice(0, -1).map((m) => `${m.papel === 'user' ? (m.autor || 'Marcelo') : 'Claude'}: ${m.conteudo}`).join('\n\n')}`);
  partes.push(`\nMENSAGEM ATUAL DE ${(atual?.autor || 'MARCELO').toUpperCase()}:\n${atual?.conteudo || ''}`);

  let ultimo = 0;
  const salvarParcial = async (texto, ferramentas) => {
    const agora = Date.now();
    if (agora - ultimo < 700) return;
    ultimo = agora;
    await q('update chat_mensagens set conteudo = $2, status = \'streaming\', ferramentas = $3 where id = $1', [mensagem_id, texto, JSON.stringify(ferramentas || [])]).catch(() => {});
  };
  let ferramentas = [];
  try {
    const r = await rodarClaude({
      prompt: partes.join('\n'),
      sistema: `${P.REGRAS_CASA}\n\n${P.REGRAS_CRM}\n\nVocê está no chat do Hound Dog com o Marcelo (dono da Hórus). Responda curto e direto; use listas quando ajudar. Se ele pedir algo que dá para fazer com as ferramentas do CRM, faça e confirme.${empresa_id ? `

HÁ UMA EMPRESA EM FOCO: toda pergunta é sobre ela, a não ser que ele diga outra. Use o id dela nas ferramentas.
- "Atualize", "adicione ao histórico", "registre": hd_salvar_empresa (com motivo) ou hd_registrar_atividade. Diga em uma linha o que gravou.
- "Confirme se está correto": confira na fonte (web, Firecrawl) antes de responder; diga o que viu, onde e quando. Não confirme de memória.
- "Melhore a mensagem" ou "crie outra": leia a doutrina (_conhecimento/network/abordagem-e-prospeccao.md §8 a §11) e grave com
  hd_preparar_disparo (substitui o rascunho anterior da mesma variante do mesmo passo; o corpo sempre com mais de uma abordagem: variantes "A", "B" e "C", cada uma com um angulo), com a tabela de verificação. Nada é enviado: o Marcelo aprova no Disparos.
- "O que falta descobrir": as pendências da investigação e o que a ficha não tem, marcado [FALTA: ...].
- Nunca mude WhatsApp nem telefone sem o Marcelo confirmar o número; nunca invente fato.` : ''}`,
      modelo: modelo || (await modeloDe('modelo_chat')), modo: 'horus', ferramentas: FERR_CHAT, timeoutMs: 8 * 60 * 1000,
      aoTexto: (t) => salvarParcial(t, ferramentas),
      aoFerramenta: (f, todas) => { ferramentas = todas; progresso(`${f.rotulo}${f.detalhe ? `: ${f.detalhe.slice(0, 60)}` : ''}`); salvarParcial(undefined, todas); },
      deveParar: cancelado,
    });
    await q('update chat_mensagens set conteudo = $2, status = \'ok\', ferramentas = $3 where id = $1', [mensagem_id, r.texto || '(sem resposta)', JSON.stringify(r.ferramentas)]);
    await q('update chat_threads set atualizado_em = now() where id = $1', [thread_id]);
    return { ok: true, ferramentas: r.ferramentas.length };
  } catch (e) {
    await q('update chat_mensagens set conteudo = $2, status = \'erro\' where id = $1', [mensagem_id, `Não consegui responder: ${e.message}`]);
    throw e;
  }
}

/* =============================== Análise de conversa =============================== */
// Formato garantido da análise (--json-schema): acabou o "não devolveu a análise em JSON" (29/09)
const TXT = { type: 'string' };
const ESQ_ANALISE = {
  type: 'object',
  required: ['momento', 'resumo', 'temperatura', 'sugestoes', 'respostas_provaveis', 'evitar'],
  properties: {
    momento: TXT, resumo: TXT, intencao: TXT, temperatura: { type: 'string', enum: ['frio', 'morno', 'quente'] },
    eh_bot: { type: 'boolean' }, eh_lead_comercial: { type: 'boolean' },
    objecoes: { type: 'array', items: { type: 'object', properties: { id: TXT, rotulo: TXT, confianca: { type: 'number' }, leitura: TXT }, required: ['rotulo'] } },
    sinais_compra: { type: 'array', items: TXT },
    sugestoes: { type: 'array', items: { type: 'object', properties: { rotulo: TXT, texto: TXT }, required: ['rotulo', 'texto'] } },
    respostas_provaveis: { type: 'array', items: { type: 'object', properties: { se: TXT, entao: TXT }, required: ['se', 'entao'] } },
    evitar: { type: 'array', items: TXT },
    proximo_estagio: { type: ['string', 'null'] }, proxima_acao: TXT,
  },
};

/**
 * Mensagem mandada pelo celular que é uma das preparadas no Disparos (29/09, LevSaúde: o Marcelo mandou o passo 2
 * pelo celular e o painel continuou mostrando as três opções como se nada tivesse saído). Marca a preparada como
 * enviada e descarta as outras abordagens do mesmo passo.
 */
async function reconciliarEnviosManuais(empresaId) {
  const prep = await q("select id, passo, texto, criado_em from disparos where empresa_id = $1 and status in ('rascunho','aprovado')", [empresaId]);
  if (!prep.length) return;
  const saidas = await q(`select m.texto, m.momento, m.wa_id from whatsapp_mensagens m join whatsapp_conversas c on c.id = m.conversa_id
    where c.empresa_id = $1 and m.direcao = 'out' and m.texto is not null order by m.momento desc limit 30`, [empresaId]);
  for (const d of prep) {
    const par = saidas.find((m) => new Date(m.momento) > new Date(d.criado_em) && similaridade(m.texto, d.texto) >= 0.6);
    if (!par) continue;
    await q("update disparos set status = 'enviado', enviado_em = $2, wa_id = coalesce(wa_id, $3), erro = 'Enviado pelo celular (reconhecido pelo Hounder)' where id = $1", [d.id, par.momento, par.wa_id]);
    await q("update disparos set status = 'cancelado', erro = 'Outra abordagem deste passo já foi enviada' where empresa_id = $1 and passo = $2 and id <> $3 and status in ('rascunho','aprovado')", [empresaId, d.passo, d.id]);
    log('disparos', `passo ${d.passo} reconhecido como enviado pelo celular`);
  }
}
export async function analisarConversa(job, progresso, cancelado) {
  const convId = job.conversa_id || job.entrada?.conversa_id;
  const conversa = await q1('select * from whatsapp_conversas where id = $1', [convId]);
  if (!conversa) throw new Error('Conversa não encontrada');
  await q("update whatsapp_conversas set analise_status = 'processando' where id = $1", [convId]);
  const [mensagens, playbook, empresa] = await Promise.all([
    q('select direcao, texto, tipo, momento from whatsapp_mensagens where conversa_id = $1 order by momento desc limit 40', [convId]).then((r) => r.reverse()),
    q('select * from playbook_objecoes order by ordem'),
    conversa.empresa_id ? q1('select * from empresas where id = $1', [conversa.empresa_id]) : null,
  ]);
  const ultimaIn = [...mensagens].reverse().find((m) => m.direcao === 'in');
  const suspeitas = detectarObjecoesTexto(ultimaIn?.texto || '', playbook);
  let briefing = null; let disparos = [];
  if (empresa) {
    await reconciliarEnviosManuais(empresa.id);
    briefing = (await q1("select dados from pesquisas where empresa_id = $1 and status = 'pronta' order by criado_em desc limit 1", [empresa.id]))?.dados?.briefing || null;
    if (briefing) briefing = Object.fromEntries(['veredito', 'tese', 'fatos', 'nao_usar', 'compliance', 'mapa', 'respostas', 'pendencias', 'sinais'].filter((k) => briefing[k]).map((k) => [k, briefing[k]]));
    disparos = await q("select passo, variante, angulo, status, texto from disparos where empresa_id = $1 and status in ('rascunho','aprovado','agendado','enviado') order by passo, variante", [empresa.id]);
  }
  const modelo = await modeloDe('modelo_analise');
  progresso('Lendo a conversa com o conhecimento de prospecção da casa');
  try {
    // Modo horus com ferramentas SÓ de leitura (29/09, pedido do Marcelo: usar todo o conhecimento). Lê o
    // repositório (mentes completas em _conselho/mentes/fontes, network, briefing), mas não escreve, não
    // executa comando e não mexe no CRM: o texto do lead não tem como virar ação.
    const r = await rodarClaude({
      prompt: P.promptAnalise({ empresa, conversa, mensagens, playbook, suspeitas, briefing, disparos }),
      sistema: P.REGRAS_CASA, modelo, modo: 'horus', ferramentas: ['Read', 'Grep', 'Glob'],
      proibidas: ['WebSearch', 'WebFetch', 'mcp__hound-dog', 'mcp__firecrawl'], esquemaJson: ESQ_ANALISE,
      timeoutMs: 8 * 60 * 1000, deveParar: cancelado,
      aoFerramenta: (f) => progresso(`${f.rotulo}${f.detalhe ? `: ${f.detalhe.slice(0, 70)}` : ''}`),
    });
    const a = r.json;
    if (!a) throw new Error('O Claude não devolveu a análise em JSON.');
    a._modelo = modelo;
    a._consultou = (r.ferramentas || []).filter((f) => !/structured/i.test(`${f.nome || ''} ${f.rotulo || ''}`))
      .map((f) => f.detalhe || f.rotulo).filter((x) => x && !/structuredoutput/i.test(x)).slice(0, 12);
    await q("update whatsapp_conversas set analise = $2, analise_status = 'pronta', analise_em = now(), bot_detectado = coalesce($3, bot_detectado) where id = $1",
      [convId, JSON.stringify(a), typeof a.eh_bot === 'boolean' ? a.eh_bot : null]);
    if (empresa) {
      if (a.temperatura && a.temperatura !== empresa.temperatura) await q("update empresas set temperatura = $2, atualizado_por = 'claude' where id = $1", [empresa.id, a.temperatura]);
      if (a.objecoes?.length) await registrarAtividade(empresa.id, 'claude', `Objeção na conversa: ${a.objecoes.map((o) => o.rotulo).join(', ')}`, a.resumo || null, 'claude');
      if (a.proxima_acao && !empresa.proxima_acao) await q("update empresas set proxima_acao = $2, atualizado_por = 'claude' where id = $1", [empresa.id, a.proxima_acao]);
    }
    return { objecoes: (a.objecoes || []).map((o) => o.rotulo), temperatura: a.temperatura };
  } catch (e) {
    await q("update whatsapp_conversas set analise_status = $2 where id = $1", [convId, ehLimiteDoClaude(e) ? 'fila' : 'erro']).catch(() => {});
    throw e;
  }
}

/* =============================== Farejar clientes =============================== */
export async function pesquisarClientes(job, progresso, cancelado) {
  const { nicho, cidade, quantidade = 20, foco = [], observacao } = job.entrada;
  let lista = job.saida?.lista_id ? await q1('select * from listas where id = $1', [job.saida.lista_id]) : null;
  if (!lista) {
    lista = await q1(`insert into listas (nome, origem, nicho, cidade, status, job_id, criado_por, observacao) values ($1,'claude',$2,$3,'processando',$4,'claude',$5) returning *`,
      [`Claude · ${nicho} · ${cidade} · ${new Date().toLocaleDateString('pt-BR')}`, nicho, cidade, job.id, foco.join('; ') || null]);
    await q('update jobs set saida = $2 where id = $1', [job.id, JSON.stringify({ lista_id: lista.id })]);
  }
  progresso('Procurando negócios na web');
  try {
    const r = await rodarClaude({
      prompt: P.promptFarejar({ nicho, cidade, quantidade, foco, observacao, listaId: lista.id }),
      sistema: `${P.REGRAS_CASA}\n\nVocê está farejando leads para a Hórus. Vá salvando os achados com mcp__hound-dog__hd_lista_adicionar_itens conforme encontra.`,
      modelo: await modeloDe('modelo_pesquisa'), modo: 'horus', ferramentas: FERR_PESQUISA, timeoutMs: 25 * 60 * 1000,
      aoFerramenta: (f) => progresso(`${f.rotulo}${f.detalhe ? `: ${f.detalhe.slice(0, 70)}` : ''}`),
      deveParar: cancelado,
    });
    const total = (await q1('select count(*)::int n from lista_itens where lista_id = $1', [lista.id])).n;
    await q("update listas set status = 'pronta', total = $2, observacao = coalesce($3, observacao) where id = $1", [lista.id, total, r.json?.resumo || null]);
    if (!total) throw new Error('O Claude não encontrou nenhum negócio (ou não conseguiu salvar). Tente um nicho ou cidade mais específicos.');
    return { lista_id: lista.id, total, resumo: r.json?.resumo, melhores: r.json?.melhores };
  } catch (e) {
    const total = (await q1('select count(*)::int n from lista_itens where lista_id = $1', [lista.id]).catch(() => ({ n: 0 }))).n;
    await q("update listas set status = $2, total = $3, observacao = $4 where id = $1",
      [lista.id, ehLimiteDoClaude(e) ? 'processando' : 'erro', total, ehLimiteDoClaude(e) ? AVISO_LIMITE : null]).catch(() => {});
    throw e;
  }
}

/* =============================== Dossiê de empresa =============================== */
export async function enriquecerEmpresa(job, progresso, cancelado) {
  const empresaId = job.empresa_id || job.entrada?.empresa_id;
  const empresa = await q1('select * from empresas where id = $1', [empresaId]);
  if (!empresa) throw new Error('Empresa não encontrada');
  const pesquisa = await q1("select * from pesquisas where job_id = $1 or (empresa_id = $2 and status in ('fila','processando')) order by criado_em desc limit 1", [job.id, empresaId]);
  if (pesquisa) await q("update pesquisas set status = 'processando' where id = $1", [pesquisa.id]);
  const atividades = await q('select * from atividades where empresa_id = $1 order by criado_em desc limit 20', [empresaId]);
  progresso('Pesquisando site, Google, Instagram e concorrentes');
  try {
    const r = await rodarClaude({
      prompt: P.promptDossie({ empresa, atividades }),
      sistema: P.REGRAS_CASA, modelo: await modeloDe('modelo_pesquisa'), modo: 'horus', ferramentas: FERR_PESQUISA, timeoutMs: 15 * 60 * 1000,
      aoFerramenta: (f) => progresso(`${f.rotulo}${f.detalhe ? `: ${f.detalhe.slice(0, 70)}` : ''}`),
      deveParar: cancelado,
    });
    const d = r.json;
    if (!d) throw new Error('O Claude não devolveu o dossiê em JSON.');
    if (d.atualizacoes && Object.keys(d.atualizacoes).length) {
      const limpo = Object.fromEntries(Object.entries(d.atualizacoes).filter(([, v]) => v !== null && v !== '' && v !== undefined));
      // nunca sobrescreve WhatsApp já cadastrado (regra: não presumir contato)
      if (limpo.whatsapp && empresa.whatsapp) delete limpo.whatsapp;
      if (Object.keys(limpo).length) await salvarEmpresa({ id: empresaId, ...limpo, _motivo: 'Dossiê do Claude' }, 'claude');
    }
    const dados = { fontes: d.fontes || [], atualizacoes: d.atualizacoes || {} };
    if (pesquisa) {
      await q("update pesquisas set status = 'pronta', resumo = $2, conteudo_md = $3, dados = $4, titulo = $5 where id = $1",
        [pesquisa.id, d.resumo || null, d.conteudo_md || r.texto, JSON.stringify(dados), `Dossiê — ${empresa.nome}`]);
    } else {
      await q(`insert into pesquisas (tipo, titulo, empresa_id, status, resumo, conteudo_md, dados, job_id, criado_por)
               values ('dossie',$1,$2,'pronta',$3,$4,$5,$6,'claude')`, [`Dossiê — ${empresa.nome}`, empresaId, d.resumo || null, d.conteudo_md || r.texto, JSON.stringify(dados), job.id]);
    }
    await registrarAtividade(empresaId, 'pesquisa', 'Dossiê gerado pelo Claude', d.resumo || null, 'claude');
    return { resumo: d.resumo, atualizou: Object.keys(d.atualizacoes || {}) };
  } catch (e) {
    if (pesquisa) await q("update pesquisas set status = $2, resumo = $3 where id = $1",
      [pesquisa.id, ehLimiteDoClaude(e) ? 'fila' : 'erro', ehLimiteDoClaude(e) ? AVISO_LIMITE : e.message.slice(0, 300)]).catch(() => {});
    throw e;
  }
}

/* =============================== Investigação profunda (esteira) =============================== */
// Um lead por vez (a fila garante). Decide Qualificado ou Perdido, grava o briefing em campos,
// atualiza a ficha e, se qualificado, deixa o rascunho no Disparos (nada é enviado sem o Marcelo).
function briefingParaMd(b = {}, d = {}) {
  const l = (arr, f) => (arr || []).map(f).join('\n');
  return [
    `## Veredito\n**${d.decisao === 'perdido' ? 'Perdido' : 'Qualificado'} · nota ${d.nota ?? '?'}.** ${b.veredito || ''}`,
    (b.personalizacao || b.sinais?.length || b.por_que_agora) && `## Sinais\n${b.personalizacao ? `Personalização: **${b.personalizacao}**.` : ''}${b.por_que_agora ? ` Por que agora: ${b.por_que_agora}.` : ''}\n\n${l(b.sinais, (x) => `- **${x.id || ''}** ${x.fato || ''}${x.forca ? ` (${x.forca})` : ''}`)}`,
    b.leitura?.length && `## Leitura cruzada\n${l(b.leitura, (x) => `- ${x.texto} **(${x.classe === 'fato' ? 'fato' : 'hipótese'})**`)}`,
    b.pessoas?.length && `## Pessoas\n${l(b.pessoas, (x) => `- **${x.nome}**, ${x.papel || ''}${x.fonte ? ` (${x.fonte})` : ''}`)}`,
    b.empresa && `## Empresa\n${[b.empresa.cnpj && `CNPJ ${b.empresa.cnpj}`, b.empresa.razao_social, b.empresa.abertura && `aberta em ${b.empresa.abertura}`].filter(Boolean).join(' · ')}${b.empresa.cnaes?.length ? `\n\nAtividades: ${b.empresa.cnaes.join(', ')}` : ''}${b.empresa.obs ? `\n\n${b.empresa.obs}` : ''}`,
    b.concorrencia?.length && `## Concorrência\n${l(b.concorrencia, (x) => `- **${x.nome}**: ${x.obs || ''}`)}`,
    b.tese && `## Tese recomendada\n${b.tese}${b.tese_alternativas?.length ? `\n\nAlternativas:\n${l(b.tese_alternativas, (x) => `- ${x}`)}` : ''}`,
    b.custo && `## O que custa não resolver\n${b.custo}`,
    b.vender && `## O que vender\n- **Fase 1:** ${b.vender.fase1 || '—'}\n- **Fase 2:** ${b.vender.fase2 || '—'}\n- **Não oferecer:** ${b.vender.nao_oferecer || '—'}`,
    b.mensagens?.length && `## Mensagens\n${l(b.mensagens, (x) => `**${x.rotulo}**${x.quando ? ` (${x.quando})` : ''}\n> ${x.texto}`)}`,
    b.respostas?.length && `## Se responder assim\n${l(b.respostas, (x) => `- **"${x.se}"** → ${x.entao}`)}`,
    b.nao_usar?.length && `## Não usar na mensagem\n${l(b.nao_usar, (x) => `- ${x}`)}`,
    b.compliance?.length && `## Compliance\n${l(b.compliance, (x) => `- ${x}`)}`,
    b.fatos?.length && `## Fatos conferidos\n| Fato | Fonte | Como conferi |\n|---|---|---|\n${l(b.fatos, (x) => `| ${x.fato} | ${x.fonte} | ${x.como_conferiu || ''} |`)}`,
    b.pendencias?.length && `## Pendências\n${l(b.pendencias, (x) => `- ${x}`)}`,
    b.autocritica?.length && `## Autocrítica (o que a checklist pegou)\n${l(b.autocritica, (x) => `- ${x}`)}`,
  ].filter(Boolean).join('\n\n');
}

async function proximoFormato() {
  const r = await q("select formato, count(*)::int n from disparos where status <> 'cancelado' group by formato");
  const n = Object.fromEntries(r.map((x) => [x.formato, x.n]));
  return (n.casa || 0) <= (n.curiosidade || 0) ? 'casa' : 'curiosidade';
}

export async function investigarEmpresa(job, progresso, cancelado) {
  const empresaId = job.empresa_id || job.entrada?.empresa_id;
  const empresa = await q1('select * from empresas where id = $1', [empresaId]);
  if (!empresa) throw new Error('Empresa não encontrada');
  const atividades = await q('select * from atividades where empresa_id = $1 order by criado_em desc limit 20', [empresaId]);
  const linha = empresa.lista_item_id ? (await q1('select dados from lista_itens where id = $1', [empresa.lista_item_id]))?.dados : null;
  const anterior = await q1("select resumo from pesquisas where empresa_id = $1 and status = 'pronta' order by criado_em desc limit 1", [empresaId]);
  const formato = job.entrada?.formato || await proximoFormato();
  // Variação no lote (29/09): o que já foi preparado pra outros leads, pra este não sair com o mesmo esqueleto
  const lote = (await q(`select texto from disparos where empresa_id <> $1 and status in ('rascunho','aprovado','agendado','enviado')
    and criado_em > now() - interval '14 days' order by criado_em desc limit 16`, [empresaId])).map((x) => x.texto);
  const pesquisa = await q1(`insert into pesquisas (tipo, titulo, empresa_id, status, job_id, criado_por) values ('dossie', $1, $2, 'processando', $3, 'claude') returning id`,
    [`Investigação — ${empresa.nome}`, empresaId, job.id]);
  progresso('Investigando: empresa, pessoas, reputação, presença, dinheiro, concorrência');
  try {
    const r = await rodarClaude({
      prompt: P.promptInvestigacao({ empresa, atividades, linhaOriginal: linha, pesquisasAnteriores: anterior?.resumo, formato, lote }),
      sistema: P.REGRAS_CASA, modelo: await modeloDe('modelo_pesquisa'), modo: 'horus', ferramentas: FERR_INVESTIGACAO, timeoutMs: 45 * 60 * 1000,
      aoFerramenta: (f) => progresso(`${f.rotulo}${f.detalhe ? `: ${f.detalhe.slice(0, 70)}` : ''}`),
      deveParar: cancelado,
    });
    const d = r.json;
    if (!d || !d.decisao) throw new Error('O Claude não devolveu a investigação no formato esperado.');
    const b = d.briefing || {};
    // Lead com agente ativo: a investigação vira contexto e quem escreve a mensagem é o agente, no ciclo que vem depois
    // (29/09: o agente da LevSaúde pediu investigação com a conversa já no passo 2; gravar passo 1 aqui atropelaria)
    const comAgente = (await q1("select 1 from agentes where empresa_id = $1 and status = 'ativo'", [empresaId])) != null;
    const limpo = Object.fromEntries(Object.entries(d.atualizacoes || {}).filter(([k, v]) => v !== null && v !== '' && v !== undefined && !['whatsapp', 'telefone'].includes(k)));
    const tags = [...new Set([...(empresa.tags || []), 'investigado'])];
    const estagio = d.decisao === 'perdido' ? 'perdido' : (['novo', 'qualificado'].includes(empresa.estagio) ? 'qualificado' : empresa.estagio);
    await salvarEmpresa({ id: empresaId, ...limpo, tags, estagio, resumo: d.resumo || empresa.resumo,
      proxima_acao: comAgente ? empresa.proxima_acao : d.decisao === 'perdido' ? null : 'Revisar o briefing e aprovar a mensagem no Disparos',
      _motivo: `Investigação profunda: ${d.decisao} (${d.motivo_decisao || ''})` }, 'claude');
    await q(`update pesquisas set status = 'pronta', titulo = $2, resumo = $3, conteudo_md = $4, nota_oportunidade = $5, dados = $6 where id = $1`,
      [pesquisa.id, `Briefing — ${empresa.nome}`, d.resumo || null, briefingParaMd(b, d), Number.isFinite(d.nota) ? Math.round(d.nota) : null,
        JSON.stringify({ briefing: b, decisao: d.decisao, motivo_decisao: d.motivo_decisao, nota: d.nota, formato, fontes: d.fontes || [] })]);
    let disparo = null;
    const tel = String(empresa.whatsapp || '').replace(/\D/g, '');
    if (!comAgente && d.decisao !== 'perdido' && d.disparo?.texto && tel.length >= 12 && !/[—–]/.test(d.disparo.texto)) {
      await q("update disparos set status = 'cancelado', erro = 'Substituído pela investigação nova' where empresa_id = $1 and status in ('rascunho','aprovado')", [empresaId]);
      // Revisor mecânico: o que ele acusar vai junto e aparece no Disparos (veto em vermelho). Não barra aqui,
      // porque a investigação é cara; quem decide é o Marcelo, com o aviso na frente dele.
      const rev = (texto, passo) => JSON.stringify(revisar(texto, { passo, empresa: empresa.nome, lote }).itens);
      const textoP1 = d.disparo.texto.replace(/\s*\n+\s*/g, ' ').trim();
      disparo = await q1(`insert into disparos (empresa_id, telefone, texto, formato, passo, verificacao, revisao, criado_por) values ($1,$2,$3,$4,1,$5,$6,'claude') returning id`,
        [empresaId, tel, textoP1, formato, JSON.stringify(d.disparo.verificacao || []), rev(textoP1, 1)]);
      // Os passos seguintes também vão pro Disparos (antes ficavam só no briefing e a ficha mostrava duas versões).
      // A verificação do corpo são os fatos conferidos da investigação.
      const verifFatos = (b.fatos || []).map((f) => ({ frase: f.fato, fonte: f.fonte || '', como_conferiu: f.como_conferiu || '' }));
      for (const m of (b.mensagens || []).filter((x) => (Number(x.passo) > 1 || (Number(x.passo) === 1 && ['B', 'C'].includes(x.variante))) && x.texto && !/[—–]/.test(x.texto))) {
        if (m.texto.trim() === d.disparo.texto.trim()) continue;
        const variante = ['A', 'B', 'C'].includes(m.variante) ? m.variante : 'A';
        const textoM = m.texto.replace(/\s*\n+\s*/g, ' ').trim();
        await q(`insert into disparos (empresa_id, telefone, texto, formato, passo, variante, angulo, verificacao, revisao, criado_por) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,'claude')`,
          [empresaId, tel, textoM, formato, Number(m.passo), variante, m.angulo ? String(m.angulo).slice(0, 60) : null, JSON.stringify(verifFatos.length ? verifFatos : d.disparo.verificacao || []), rev(textoM, Number(m.passo))]);
      }
    }
    await registrarAtividade(empresaId, 'pesquisa', `Investigação profunda: ${d.decisao === 'perdido' ? 'perdido' : 'qualificado'}`, d.motivo_decisao || d.resumo || null, 'claude');
    await WA.enviarParaMim(`🔎 *Investigação pronta:* ${empresa.nome}\n${d.decisao === 'perdido' ? '❌ Perdido' : `✅ Qualificado · nota ${d.nota ?? '?'}`}\n${d.motivo_decisao || ''}${disparo ? '\n\nMensagem no Disparos esperando você.' : comAgente ? '\n\nO agente do lead vai ler e decidir o próximo passo.' : ''}\n\n— Hounder`).catch(() => {});
    // Lead com agente: a investigação é o ciclo zero, e o agente relê tudo com o crítico antes de o Marcelo aprovar
    await pedirCiclo(empresaId, 'investigacao_pronta', `Investigação: ${d.decisao} (nota ${d.nota ?? '?'}). ${d.motivo_decisao || ''}${job.entrada?.motivo ? ` Você pediu porque: ${job.entrada.motivo}` : ''}`).catch(() => {});
    return { decisao: d.decisao, nota: d.nota, disparo: disparo?.id || null };
  } catch (e) {
    await q("update pesquisas set status = $2, resumo = $3 where id = $1",
      [pesquisa.id, ehLimiteDoClaude(e) ? 'fila' : 'erro', ehLimiteDoClaude(e) ? AVISO_LIMITE : String(e.message).slice(0, 300)]).catch(() => {});
    throw e;
  }
}

/* =============================== Pesquisa de mercado =============================== */
export async function pesquisaMercado(job, progresso, cancelado) {
  const { pesquisa_id, tipo = 'mercado', nicho, cidade, perguntas } = job.entrada;
  await q("update pesquisas set status = 'processando' where id = $1", [pesquisa_id]);
  progresso('Mapeando o nicho na web');
  try {
    const r = await rodarClaude({
      prompt: P.promptMercado({ tipo, nicho, cidade, perguntas }),
      sistema: P.REGRAS_CASA, modelo: await modeloDe('modelo_pesquisa'), modo: 'horus', ferramentas: FERR_PESQUISA, timeoutMs: 25 * 60 * 1000,
      aoFerramenta: (f) => progresso(`${f.rotulo}${f.detalhe ? `: ${f.detalhe.slice(0, 70)}` : ''}`),
      deveParar: cancelado,
    });
    const d = r.json;
    if (!d) throw new Error('O Claude não devolveu a pesquisa em JSON.');
    const dados = { veredito: d.veredito, negocios_mapeados: d.negocios_mapeados, pct_sem_site: d.pct_sem_site, ticket_tipico: d.ticket_tipico, concorrencia: d.concorrencia,
      fase_sugerida: d.fase_sugerida, dores: d.dores, ganchos: d.ganchos, objecoes: d.objecoes, onde_achar: d.onde_achar, riscos: d.riscos, sazonalidade: d.sazonalidade,
      exemplos: d.exemplos, fontes: d.fontes };
    await q("update pesquisas set status = 'pronta', resumo = $2, conteudo_md = $3, dados = $4, nota_oportunidade = $5 where id = $1",
      [pesquisa_id, d.resumo || null, d.conteudo_md || r.texto, JSON.stringify(dados), Number.isFinite(d.nota_oportunidade) ? Math.round(d.nota_oportunidade) : null]);
    return { pesquisa_id, nota: d.nota_oportunidade, resumo: d.resumo };
  } catch (e) {
    await q("update pesquisas set status = $2, resumo = $3 where id = $1",
      [pesquisa_id, ehLimiteDoClaude(e) ? 'fila' : 'erro', ehLimiteDoClaude(e) ? AVISO_LIMITE : e.message.slice(0, 300)]).catch(() => {});
    throw e;
  }
}

/* =============================== Enriquecer lista =============================== */
export async function enriquecerLista(job, progresso, cancelado) {
  const ids = job.entrada?.item_ids || [];
  const itens = await q('select id, nome, categoria, cidade, bairro, site, site_status, instagram, whatsapp from lista_itens where id = any($1)', [ids]);
  if (!itens.length) throw new Error('Nenhum lead selecionado');
  progresso(`Conferindo ${itens.length} leads na web`);
  const r = await rodarClaude({
    prompt: P.promptEnriquecer({ itens }), sistema: P.REGRAS_CASA, modelo: await modeloDe('modelo_pesquisa'), modo: 'horus',
    ferramentas: ['WebSearch', 'WebFetch', 'mcp__firecrawl'], timeoutMs: 20 * 60 * 1000,
    aoFerramenta: (f) => progresso(`${f.rotulo}${f.detalhe ? `: ${f.detalhe.slice(0, 60)}` : ''}`), deveParar: cancelado,
  });
  const lista = r.json?.itens || [];
  const { pontuar } = await import('../app/js/score.js');
  const opc = (await q("select chave, valor from config where chave in ('score','nichos_conhecidos','praca')")).reduce((a, l) => ({ ...a, [l.chave]: l.valor }), {});
  let atualizados = 0;
  for (const up of lista) {
    const atual = itens.find((i) => i.id === up.id);
    if (!atual) continue;
    const campos = ['site', 'site_status', 'instagram', 'instagram_seguidores', 'google_nota', 'google_avaliacoes', 'gmb_status', 'whatsapp', 'roda_anuncio', 'observacao'];
    const novo = Object.fromEntries(campos.filter((c) => up[c] !== undefined && up[c] !== null && up[c] !== '').map((c) => [c, up[c]]));
    if (!Object.keys(novo).length) continue;
    const combinado = { ...atual, ...novo };
    const p = pontuar(combinado, { pesos: opc.score, nichos: opc.nichos_conhecidos, praca: opc.praca?.regiao });
    const cols = Object.keys(novo);
    await q(`update lista_itens set ${cols.map((c, i) => `${c} = $${i + 2}`).join(', ')}, score = $${cols.length + 2}, prioridade = $${cols.length + 3}, score_motivos = $${cols.length + 4} where id = $1`,
      [atual.id, ...cols.map((c) => novo[c]), p.score, p.prioridade, JSON.stringify(p.motivos)]);
    atualizados++;
  }
  return { atualizados, pedidos: itens.length };
}

/* =============================== Triagem da lista (Spark → Novo) =============================== */
// Confere cada lead da lista (existe? o Spark acertou? tem gancho?) e decide: passa vai pro funil em Novo,
// descarta fica na lista marcado, com o motivo. Nada daqui vai pro Disparos: isso só depois da investigação.
export async function triarLista(job, progresso, cancelado) {
  const ids = job.entrada?.item_ids || [];
  const itens = await q(`select i.*, l.nome lista_nome, l.origem lista_origem from lista_itens i join listas l on l.id = i.lista_id
    where i.id = any($1) and not i.descartado and i.empresa_id is null`, [ids]);
  if (!itens.length) return { passaram: 0, descartados: 0, pedidos: ids.length };
  progresso(`Triagem de ${itens.length} leads: existe, o Spark acertou, tem gancho`);
  const enviar = itens.map((i) => ({ id: i.id, nome: i.nome, categoria: i.categoria, cidade: i.cidade, bairro: i.bairro, endereco: i.endereco,
    whatsapp: i.whatsapp, telefone: i.telefone, instagram: i.instagram, site: i.site, site_status: i.site_status, observacao: i.observacao, dados: i.dados }));
  const r = await rodarClaude({
    prompt: P.promptTriagem({ itens: enviar }), sistema: P.REGRAS_CASA, modelo: await modeloDe('modelo_pesquisa'), modo: 'horus',
    ferramentas: FERR_INVESTIGACAO, timeoutMs: Math.min(60, 8 + itens.length * 6) * 60 * 1000,
    aoFerramenta: (f) => progresso(`${f.rotulo}${f.detalhe ? `: ${f.detalhe.slice(0, 60)}` : ''}`), deveParar: cancelado,
  });
  const res = r.json?.itens;
  if (!Array.isArray(res)) throw new Error('O Claude não devolveu a triagem no formato esperado.');
  const { pontuar, detectarRegulado, linhaParaItem, mapearColunas } = await import('../app/js/score.js');
  const opc = (await q("select chave, valor from config where chave in ('score','nichos_conhecidos','praca')")).reduce((a, l) => ({ ...a, [l.chave]: l.valor }), {});
  const hoje = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Bahia', day: '2-digit', month: '2-digit' });
  const passaram = [], descartados = [];
  for (const up of res) {
    const it = itens.find((i) => i.id === up.id);
    if (!it) continue;
    const campos = ['site', 'site_status', 'instagram', 'instagram_seguidores', 'google_nota', 'google_avaliacoes', 'gmb_status', 'roda_anuncio'];
    const novo = Object.fromEntries(campos.filter((c) => up[c] !== undefined && up[c] !== null && up[c] !== '').map((c) => [c, up[c]]));
    if (novo.site_status && !['sem', 'fora_do_ar', 'ruim', 'ok'].includes(novo.site_status)) delete novo.site_status;
    if (novo.instagram) novo.instagram = String(novo.instagram).replace(/^@/, '').trim();
    const comb = { ...it, ...novo };
    const p = pontuar(comb, { pesos: opc.score, nichos: opc.nichos_conhecidos, praca: opc.praca?.regiao });
    const passa = up.decisao === 'passa';
    const div = (up.divergencias || []).filter(Boolean);
    const nota = `Triagem ${hoje}: ${passa ? 'passou' : 'descartado'}. ${up.motivo || ''}${div.length ? ` Divergências: ${div.join(' · ')}` : ''}`.trim();
    const cols = Object.keys(novo);
    await q(`update lista_itens set ${cols.map((c, i) => `${c} = $${i + 2}, `).join('')}score = $${cols.length + 2}, prioridade = $${cols.length + 3},
      score_motivos = $${cols.length + 4}, observacao = $${cols.length + 5}, descartado = $${cols.length + 6} where id = $1`,
      [it.id, ...cols.map((c) => novo[c]), p.score, p.prioridade, JSON.stringify(p.motivos), nota.slice(0, 1500), !passa]);
    if (!passa) { descartados.push(`${it.nome}: ${up.motivo || 'sem motivo'}`); continue; }
    // Passou: entra no funil em Novo (mesmo mapeamento do botão "Funil" da lista). Se já existe no CRM, só liga.
    const existente = await q1(`select id from empresas where lista_item_id = $1 or (instagram is not null and lower(instagram) = lower($2))
      or (whatsapp is not null and $3 <> '' and right(whatsapp, 8) = right($3, 8)) limit 1`,
      [it.id, comb.instagram || '__nada__', String(it.whatsapp || '').replace(/\D/g, '')]);
    let empId = existente?.id;
    if (!empId) {
      const cru = it.dados && Object.keys(it.dados).length ? linhaParaItem(it.dados, mapearColunas(Object.keys(it.dados))) : {};
      const conselho = detectarRegulado(`${it.categoria || ''} ${it.nome}`);
      const s = await salvarEmpresa({
        nome: it.nome, categoria: it.categoria, cidade: it.cidade, bairro: it.bairro, endereco: it.endereco, telefone: it.telefone, whatsapp: it.whatsapp,
        instagram: comb.instagram, instagram_seguidores: comb.instagram_seguidores, site: comb.site, site_status: comb.site_status, google_nota: comb.google_nota,
        google_avaliacoes: comb.google_avaliacoes, gmb_status: comb.gmb_status, roda_anuncio: comb.roda_anuncio, cnpj: it.cnpj,
        ...(conselho ? { regulado: true, conselho } : {}), estagio: 'novo', relacao: 'lead', tags: ['triado'],
        origem: it.lista_origem === 'claude' ? 'claude' : it.lista_origem === 'network' ? 'network' : 'spark', origem_detalhe: it.lista_nome, lista_item_id: it.id,
        decisor: cru.decisor || null, email: cru.email || null, dor: cru.observacao || null,
        resumo: cru.servico_sugerido ? `Serviço sugerido na lista: ${cru.servico_sugerido}` : null,
        gancho: up.gancho || null,
      }, 'claude');
      empId = s.empresa.id;
      if (!s.criada) { await q('update lista_itens set empresa_id = $2 where id = $1', [it.id, empId]); passaram.push(`${it.nome} (já estava no CRM)`); continue; }
    } else {
      await q('update lista_itens set empresa_id = $2 where id = $1', [it.id, empId]);
      passaram.push(`${it.nome} (já estava no CRM)`);
      continue;
    }
    await q('update lista_itens set empresa_id = $2 where id = $1', [it.id, empId]);
    await registrarAtividade(empId, 'pesquisa', 'Triagem da lista: passou', nota, 'claude');
    passaram.push(it.nome);
  }
  const linhas = [`🧹 *Triagem pronta:* ${passaram.length} pro Novo, ${descartados.length} descartado${descartados.length === 1 ? '' : 's'}`];
  if (passaram.length) linhas.push('', '*Foram pro funil*', ...passaram.map((n) => `• ${n}`));
  if (descartados.length) linhas.push('', '*Descartados*', ...descartados.map((n) => `• ${n.slice(0, 140)}`));
  linhas.push('', 'Próximo passo: botão Investigar na ficha de quem passou.', '', '— Hounder');
  await WA.enviarParaMim(linhas.join('\n')).catch(() => {});
  return { passaram: passaram.length, descartados: descartados.length, pedidos: ids.length };
}

/* =============================== Mensagem personalizada =============================== */
export async function mensagemPersonalizada(job, progresso, cancelado) {
  const empresaId = job.empresa_id || job.entrada?.empresa_id;
  const empresa = await q1('select * from empresas where id = $1', [empresaId]);
  if (!empresa) throw new Error('Empresa não encontrada');
  const [atividades, playbook, mensagens] = await Promise.all([
    q('select * from atividades where empresa_id = $1 order by criado_em desc limit 15', [empresaId]),
    q('select * from playbook_objecoes order by ordem'),
    q(`select m.direcao, m.texto, m.tipo, m.momento from whatsapp_mensagens m join whatsapp_conversas c on c.id = m.conversa_id where c.empresa_id = $1 order by m.momento desc limit 20`, [empresaId]).then((r) => r.reverse()),
  ]);
  progresso('Escrevendo a mensagem com o conhecimento de prospecção da casa');
  // Mesmo tratamento da análise de conversa (29/09): doutrina no pedido + leitura do repositório, sem escrita
  const r = await rodarClaude({
    prompt: `${P.promptMensagem({ empresa, atividades, mensagens, playbook, pedido: job.entrada?.pedido })}\n\nO CONHECIMENTO DE PROSPECÇÃO DA CASA (use tudo; se precisar de mais, leia _conselho/mentes/fontes/ e _conhecimento/network/)\n${P.doutrinaConversa()}`,
    sistema: P.REGRAS_CASA, modelo: await modeloDe('modelo_analise'), modo: 'horus', ferramentas: ['Read', 'Grep', 'Glob'],
    proibidas: ['WebSearch', 'WebFetch', 'mcp__hound-dog', 'mcp__firecrawl'], timeoutMs: 8 * 60 * 1000, deveParar: cancelado,
  });
  if (!r.json?.variantes?.length) return { texto: r.texto };
  return { variantes: r.json.variantes, porque: r.json.porque };
}

/* =============================== Instagram =============================== */
export async function instagram(job, progresso) {
  // Com o 📣 Mídia ligado, a coleta é pela API oficial (a leitura pública foi bloqueada pela Meta)
  if ((await config('midia', {})).ativo) { progresso('Coletando pela API oficial'); return { resumo: await coletarAgora() }; }
  const cfg = await config('instagram', { handle: 'horuspublicidade' });
  const handle = job.entrada?.handle || cfg.handle;
  progresso(`Coletando @${handle}`);
  const p = await coletarESalvar(handle, cfg);
  return { seguidores: p.seguidores, posts: p.posts, engajamento: p.engajamento };
}

export async function ideiasInstagram(job, progresso, cancelado) {
  const cfg = await config('instagram', { handle: 'horuspublicidade' });
  const handle = job.entrada?.handle || cfg.handle;
  const snap = await q1('select * from instagram_snapshots where handle = $1 order by coletado_em desc limit 1', [handle]);
  if (!snap) throw new Error('Colete o Instagram antes (botão "Atualizar agora").');
  const melhores = [...(snap.ultimos_posts || [])].sort((a, b) => ((b.curtidas || 0) + (b.comentarios || 0) * 3) - ((a.curtidas || 0) + (a.comentarios || 0) * 3)).slice(0, 5);
  progresso('Pensando nas ideias');
  const r = await rodarClaude({
    prompt: P.promptInstagram({ snapshot: snap, melhores }), sistema: P.REGRAS_CASA, modelo: await modeloDe('modelo_chat'), modo: 'horus',
    ferramentas: ['Read', 'Grep', 'Glob'], timeoutMs: 8 * 60 * 1000, deveParar: cancelado,
  });
  const pesquisa = await q1("select * from pesquisas where job_id = $1 order by criado_em desc limit 1", [job.id]);
  if (pesquisa) await q("update pesquisas set status = 'pronta', conteudo_md = $2, resumo = $3 where id = $1", [pesquisa.id, r.texto, 'Ideias de conteúdo geradas pelo Claude']);
  else await q(`insert into pesquisas (tipo, titulo, status, conteudo_md, resumo, job_id, criado_por) values ('instagram',$1,'pronta',$2,$3,$4,'claude')`,
    [`Ideias de conteúdo @${handle}`, r.texto, 'Ideias de conteúdo geradas pelo Claude', job.id]);
  return { ok: true };
}

/* =============================== WhatsApp =============================== */
export async function whatsappConectar(job, progresso, cancelado, ctx) {
  progresso('Abrindo a conexão');
  await WA.conectar({ aoMudar: ctx.aoMudarWhats });
  await q("update config set valor = jsonb_set(valor, '{ativo}', 'true') where chave = 'whatsapp'").catch(() => {});
  return { status: WA.wa.status };
}
export async function whatsappDesconectar() {
  await WA.desconectar();
  await q("update config set valor = jsonb_set(valor, '{ativo}', 'false') where chave = 'whatsapp'").catch(() => {});
  return { status: 'desligado' };
}
export async function whatsappCodigo(job) {
  const codigo = await WA.pedirCodigo(job.entrada?.telefone);
  return { codigo };
}
export async function whatsappEnviar(job, progresso) {
  const { mensagem_id, texto, telefone, jid } = job.entrada;
  progresso('Enviando');
  try {
    await q("update whatsapp_mensagens set status = 'enviando' where id = $1", [mensagem_id]).catch(() => {});
    const waId = await WA.enviar({ telefone, jid, texto });
    await q("update whatsapp_mensagens set status = 'enviada', wa_id = coalesce(wa_id, $2), momento = now() where id = $1", [mensagem_id, waId]);
    const conv = await q1('select * from whatsapp_conversas where id = $1', [job.conversa_id]);
    if (conv) {
      await q("update whatsapp_conversas set ultima_mensagem = $2, ultima_direcao = 'out', ultima_em = now(), nao_lidas = 0 where id = $1", [conv.id, texto.slice(0, 400)]);
      if (conv.empresa_id) {
        await registrarAtividade(conv.empresa_id, 'mensagem', 'Mensagem enviada pelo Hound Dog', texto.slice(0, 500), 'marcelo');
        await q("update empresas set estagio = 'abordado', atualizado_por = 'hound-dog' where id = $1 and estagio in ('novo','qualificado')", [conv.empresa_id]);
      }
    }
    return { enviada: true };
  } catch (e) {
    await q("update whatsapp_mensagens set status = 'erro', erro = $2 where id = $1", [mensagem_id, e.message.slice(0, 200)]).catch(() => {});
    throw e;
  }
}

/* =============================== Operador =============================== */
export async function criarOperadorJob(job) {
  const { nome, email, papel } = job.entrada || {};
  const r = await criarOperador({ email, nome, papel });
  log('operador', `criado ${email}`);
  return { email, nome, papel: r.papel, senha_em: 'ferramentas/hound-dog/.segredos/acessos.txt (no PC do Farejador)' };
}

export const TAREFAS = {
  chat, analisar_conversa: analisarConversa, pesquisar_clientes: pesquisarClientes, enriquecer_empresa: enriquecerEmpresa,
  pesquisa_mercado: pesquisaMercado, enriquecer_lista: enriquecerLista, mensagem_personalizada: mensagemPersonalizada,
  instagram, ideias_instagram: ideiasInstagram, whatsapp_conectar: whatsappConectar, whatsapp_desconectar: whatsappDesconectar,
  whatsapp_codigo: whatsappCodigo, whatsapp_enviar: whatsappEnviar, criar_operador: criarOperadorJob, investigar_empresa: investigarEmpresa, triar_lista: triarLista,
  midia_semana: midiaSemana, midia_ajuste: midiaAjuste, midia_triagem: midiaTriagem, agente_ciclo: cicloAgente,
};

/** Tarefas que abrem o navegador do Farejador: uma de cada vez (o perfil do Chrome não abre duas vezes). */
export const USA_NAVEGADOR = new Set(['investigar_empresa', 'triar_lista']);

/** Tarefas que usam o Claude (limite de concorrência menor). */
export const USA_CLAUDE = new Set(['investigar_empresa', 'triar_lista', 'chat', 'analisar_conversa', 'pesquisar_clientes', 'enriquecer_empresa', 'pesquisa_mercado', 'enriquecer_lista', 'mensagem_personalizada', 'ideias_instagram', 'midia_semana', 'midia_ajuste', 'midia_triagem', 'agente_ciclo']);
