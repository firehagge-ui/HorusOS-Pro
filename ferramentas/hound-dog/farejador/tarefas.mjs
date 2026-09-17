// =============================================================================
// Farejador — o que cada tipo de trabalho faz.
// Cada função recebe o job e um "progresso(texto)" para o painel acompanhar ao vivo.
// =============================================================================
import { q, q1 } from '../lib/db.mjs';
import { salvarEmpresa, registrarAtividade, adicionarItensLista, resumoCRM, detalheEmpresa } from '../lib/crm.mjs';
import { criarOperador } from '../lib/operadores.mjs';
import { rodarClaude } from './claude.mjs';
import * as P from './prompts.mjs';
import * as WA from './whatsapp.mjs';
import { coletarESalvar } from './instagram.mjs';
import { log } from './log.mjs';
import { detectarObjecoesTexto } from './objecoes.mjs';

const FERR_PESQUISA = ['WebSearch', 'WebFetch', 'Read', 'Grep', 'Glob', 'mcp__firecrawl', 'mcp__hound-dog'];
const FERR_CHAT = ['Read', 'Grep', 'Glob', 'WebSearch', 'WebFetch', 'mcp__hound-dog', 'mcp__firecrawl'];

async function config(chave, padrao = {}) { return (await q1('select valor from config where chave = $1', [chave]))?.valor ?? padrao; }
const modeloDe = async (qual) => (await config('claude', {}))[qual] || (qual === 'modelo_analise' ? 'sonnet' : 'opus');

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
    if (d) partes.push(`\nEMPRESA EM FOCO (o Marcelo anexou)\n${JSON.stringify(d, null, 1).slice(0, 7000)}`);
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
      sistema: `${P.REGRAS_CASA}\n\n${P.REGRAS_CRM}\n\nVocê está no chat do Hound Dog com o Marcelo (dono da Hórus). Responda curto e direto; use listas quando ajudar. Se ele pedir algo que dá para fazer com as ferramentas do CRM, faça e confirme.`,
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
  progresso('Lendo a conversa e o playbook');
  try {
    const r = await rodarClaude({
      prompt: P.promptAnalise({ empresa, conversa, mensagens, playbook, suspeitas }),
      sistema: P.REGRAS_CASA, modelo: await modeloDe('modelo_analise'), modo: 'leve', timeoutMs: 4 * 60 * 1000, deveParar: cancelado,
    });
    const a = r.json;
    if (!a) throw new Error('O Claude não devolveu a análise em JSON.');
    await q("update whatsapp_conversas set analise = $2, analise_status = 'pronta', analise_em = now(), bot_detectado = coalesce($3, bot_detectado) where id = $1",
      [convId, JSON.stringify(a), typeof a.eh_bot === 'boolean' ? a.eh_bot : null]);
    if (empresa) {
      if (a.temperatura && a.temperatura !== empresa.temperatura) await q("update empresas set temperatura = $2, atualizado_por = 'claude' where id = $1", [empresa.id, a.temperatura]);
      if (a.objecoes?.length) await registrarAtividade(empresa.id, 'claude', `Objeção na conversa: ${a.objecoes.map((o) => o.rotulo).join(', ')}`, a.resumo || null, 'claude');
      if (a.proxima_acao && !empresa.proxima_acao) await q("update empresas set proxima_acao = $2, atualizado_por = 'claude' where id = $1", [empresa.id, a.proxima_acao]);
    }
    return { objecoes: (a.objecoes || []).map((o) => o.rotulo), temperatura: a.temperatura };
  } catch (e) {
    await q("update whatsapp_conversas set analise_status = 'erro' where id = $1", [convId]).catch(() => {});
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
    await q("update listas set status = 'erro' where id = $1", [lista.id]).catch(() => {});
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
    if (pesquisa) await q("update pesquisas set status = 'erro', resumo = $2 where id = $1", [pesquisa.id, e.message.slice(0, 300)]).catch(() => {});
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
    await q("update pesquisas set status = 'erro', resumo = $2 where id = $1", [pesquisa_id, e.message.slice(0, 300)]).catch(() => {});
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
  progresso('Escrevendo a mensagem');
  const r = await rodarClaude({
    prompt: P.promptMensagem({ empresa, atividades, mensagens, playbook, pedido: job.entrada?.pedido }),
    sistema: P.REGRAS_CASA, modelo: await modeloDe('modelo_analise'), modo: 'leve', timeoutMs: 4 * 60 * 1000, deveParar: cancelado,
  });
  if (!r.json?.variantes?.length) return { texto: r.texto };
  return { variantes: r.json.variantes, porque: r.json.porque };
}

/* =============================== Instagram =============================== */
export async function instagram(job, progresso) {
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
  whatsapp_codigo: whatsappCodigo, whatsapp_enviar: whatsappEnviar, criar_operador: criarOperadorJob,
};

/** Tarefas que usam o Claude (limite de concorrência menor). */
export const USA_CLAUDE = new Set(['chat', 'analisar_conversa', 'pesquisar_clientes', 'enriquecer_empresa', 'pesquisa_mercado', 'enriquecer_lista', 'mensagem_personalizada', 'ideias_instagram']);
