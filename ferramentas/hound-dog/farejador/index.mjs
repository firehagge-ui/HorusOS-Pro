// =============================================================================
// HOUND DOG — FAREJADOR
// O programa que roda no PC da Hórus: pega a fila do painel, chama o Claude pela
// assinatura (sem API), segura o WhatsApp, coleta o Instagram, lembra da agenda.
// Rodar:  npm run farejador   (na pasta ferramentas/hound-dog)
// =============================================================================
import os from 'node:os';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { RAIZ_HD, RAIZ_REPO, carregarEnv } from '../lib/env.mjs';
import { db, q, q1, novoCliente, fecharDb } from '../lib/db.mjs';
import { log, logErro } from './log.mjs';
import { versaoClaude } from './claude.mjs';
import { TAREFAS, USA_CLAUDE } from './tarefas.mjs';
import * as WA from './whatsapp.mjs';
import { precisaColetar, coletarESalvar } from './instagram.mjs';
import { detectarObjecoesTexto } from './objecoes.mjs';

carregarEnv();
const VERSAO = '1.0.0';
const PORTA_TRAVA = 47471;
const MAX_CLAUDE = 2;
const rodando = new Map();      // job.id -> { cancelado }
let claudeOk = null; let claudeInfo = '';
let ouvinte = null;
let parando = false;
const debounceAnalise = new Map();

/* ------------------------------ trava de instância única ------------------------------ */
const servidor = net.createServer((sock) => {
  sock.end(JSON.stringify({ farejador: VERSAO, whatsapp: WA.wa.status, jobs: rodando.size }));
});
servidor.on('error', (e) => {
  if (e.code === 'EADDRINUSE') { console.error('O Farejador já está rodando nesta máquina (porta 47471). Feche o outro antes.'); process.exit(1); }
  logErro('trava', e);
});
servidor.listen(PORTA_TRAVA, '127.0.0.1');

/* ------------------------------ MCP do Hound Dog para o Claude ------------------------------ */
function escreverConfigMCP() {
  const arq = path.join(RAIZ_HD, 'farejador', 'mcp-farejador.json');
  const conf = { mcpServers: { 'hound-dog': { type: 'stdio', command: process.execPath, args: [path.join(RAIZ_HD, 'mcp', 'server.mjs')], env: { HD_AUTOR: 'claude' } } } };
  fs.writeFileSync(arq, JSON.stringify(conf, null, 2));
}

/* ------------------------------ status no painel ------------------------------ */
async function bater(extra = {}) {
  const fila = (await q1("select count(*)::int n from jobs where status = 'fila'").catch(() => ({ n: 0 })))?.n ?? 0;
  await q(`update farejador_status set online_em = now(), versao = $1, maquina = $2, claude_ok = $3, claude_info = $4,
           whatsapp_status = $5, whatsapp_qr = $6, whatsapp_codigo = $7, whatsapp_numero = $8, whatsapp_nome = $9, whatsapp_erro = $10,
           fila = $11, detalhes = $12 where id = 'principal'`,
  [VERSAO, os.hostname(), claudeOk, claudeInfo, WA.wa.status, WA.wa.qr, WA.wa.codigo, WA.wa.numero, WA.wa.nome, WA.wa.erro, fila,
    JSON.stringify({ rodando: [...rodando.keys()].length, pid: process.pid, repo: RAIZ_REPO, ...extra })]).catch((e) => logErro('heartbeat', e));
}

const aoMudarWhats = () => { bater().catch(() => {}); };

/* ------------------------------ fila ------------------------------ */
async function pegarJob() {
  const claudeLivres = MAX_CLAUDE - [...rodando.values()].filter((r) => r.usaClaude).length;
  const tipos = Object.keys(TAREFAS).filter((t) => (USA_CLAUDE.has(t) ? claudeLivres > 0 : true));
  if (!tipos.length) return null;
  const r = await q1(`update jobs set status = 'processando', iniciado_em = now(), progresso = 'Começando'
    where id = (select id from jobs where status = 'fila' and tipo = any($1) order by prioridade, criado_em for update skip locked limit 1) returning *`, [tipos]);
  return r;
}

async function executar(job) {
  const estado = { usaClaude: USA_CLAUDE.has(job.tipo) };
  rodando.set(job.id, estado);
  const progresso = async (texto) => { await q('update jobs set progresso = $2 where id = $1', [job.id, String(texto).slice(0, 400)]).catch(() => {}); };
  const cancelado = async () => {
    const j = await q1('select status from jobs where id = $1', [job.id]).catch(() => null);
    return j?.status === 'cancelado';
  };
  log('fila', `▶ ${job.tipo} (${job.id.slice(0, 8)})`);
  try {
    const fn = TAREFAS[job.tipo];
    if (!fn) throw new Error(`Tipo de tarefa desconhecido: ${job.tipo}`);
    const saida = await fn(job, progresso, cancelado, { aoMudarWhats });
    const atual = await q1('select status, saida from jobs where id = $1', [job.id]);
    if (atual?.status === 'cancelado') { log('fila', `✖ ${job.tipo} cancelado`); return; }
    await q("update jobs set status = 'concluido', concluido_em = now(), saida = $2, progresso = 'Pronto' where id = $1",
      [job.id, JSON.stringify({ ...(atual?.saida || {}), ...(saida || {}) })]);
    log('fila', `✔ ${job.tipo} (${job.id.slice(0, 8)})`);
  } catch (e) {
    const cancel = await cancelado();
    if (cancel) { log('fila', `✖ ${job.tipo} cancelado`); }
    else {
      await q("update jobs set status = 'erro', concluido_em = now(), erro = $2 where id = $1", [job.id, String(e.message || e).slice(0, 900)]).catch(() => {});
      logErro('fila', e);
    }
  } finally {
    rodando.delete(job.id);
    bater().catch(() => {});
  }
}

async function girar() {
  if (parando) return;
  try {
    let job;
    while ((job = await pegarJob())) { executar(job); if (rodando.size >= MAX_CLAUDE + 2) break; }
  } catch (e) { logErro('fila', e); }
}

/* ------------------------------ escuta do banco (tempo real) ------------------------------ */
async function ligarEscuta() {
  try {
    if (ouvinte) { try { await ouvinte.end(); } catch { /* ok */ } }
    ouvinte = novoCliente();
    ouvinte.on('notification', () => girar());
    ouvinte.on('error', (e) => { logErro('escuta', e); setTimeout(ligarEscuta, 5000); });
    ouvinte.on('end', () => { if (!parando) setTimeout(ligarEscuta, 5000); });
    await ouvinte.connect();
    await ouvinte.query('listen hd_jobs');
    log('escuta', 'ouvindo novas tarefas do painel');
  } catch (e) { logErro('escuta', e); setTimeout(ligarEscuta, 8000); }
}

/* ------------------------------ rotinas de tempo ------------------------------ */
async function rotinaInstagram() {
  try {
    const cfg = (await q1("select valor from config where chave = 'instagram'"))?.valor || {};
    const handle = cfg.handle || 'horuspublicidade';
    if (!(await precisaColetar(handle, cfg.intervalo_horas || 6))) return;
    await coletarESalvar(handle, cfg);
    await q("update farejador_status set instagram_em = now(), instagram_erro = null where id = 'principal'");
  } catch (e) {
    log('instagram', `falhou: ${e.message}`);
    await q("update farejador_status set instagram_erro = $1 where id = 'principal'", [String(e.message).slice(0, 300)]).catch(() => {});
  }
}

async function rotinaLembretes() {
  try {
    const cfg = (await q1("select valor from config where chave = 'whatsapp'"))?.valor || {};
    if (!cfg.lembretes || !WA.estaConectado()) return;
    const itens = await q(`select a.*, e.nome empresa from agenda a left join empresas e on e.id = a.empresa_id
      where a.status = 'agendado' and not a.lembrete_enviado and a.lembrete_min > 0
        and a.inicio > now() and a.inicio <= now() + (a.lembrete_min || ' minutes')::interval`);
    for (const it of itens) {
      const hora = new Date(it.inicio).toLocaleTimeString('pt-BR', { timeZone: 'America/Bahia', hour: '2-digit', minute: '2-digit' });
      const texto = `⏰ *${it.titulo}* às ${hora}${it.empresa ? `\n${it.empresa}` : ''}${it.local ? `\n📍 ${it.local}` : ''}${it.descricao ? `\n\n${it.descricao}` : ''}\n\n— Hound Dog`;
      if (await WA.enviarParaMim(texto)) {
        await q('update agenda set lembrete_enviado = true where id = $1', [it.id]);
        log('agenda', `lembrete enviado: ${it.titulo}`);
      }
    }
    await q(`update agenda set lembrete_enviado = true where status = 'agendado' and not lembrete_enviado and inicio < now()`);
  } catch (e) { logErro('agenda', e); }
}

let ultimoBriefing = null;
async function rotinaBriefing() {
  try {
    const cfg = (await q1("select valor from config where chave = 'whatsapp'"))?.valor || {};
    if (!cfg.briefing_diario || !WA.estaConectado()) return;
    const agora = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Bahia' }));
    const [h, m] = String(cfg.briefing_hora || '08:00').split(':').map(Number);
    const hoje = agora.toISOString().slice(0, 10);
    if (ultimoBriefing === hoje) return;
    if (agora.getHours() < h || (agora.getHours() === h && agora.getMinutes() < m)) return;
    if (agora.getHours() > h + 3) { ultimoBriefing = hoje; return; } // perdeu a janela, não manda atrasado
    const [agenda, atencao, quentes] = await Promise.all([
      q(`select a.titulo, a.inicio, a.local, e.nome empresa from agenda a left join empresas e on e.id = a.empresa_id
         where a.status = 'agendado' and a.inicio::date = (now() at time zone 'America/Bahia')::date order by a.inicio`),
      q('select nome, motivo, proxima_acao from vw_atencao limit 6'),
      q(`select c.nome, c.telefone, e.nome empresa, c.ultima_mensagem from whatsapp_conversas c left join empresas e on e.id = c.empresa_id
         where c.nao_lidas > 0 order by c.ultima_em desc limit 5`),
    ]);
    const linhas = [`☀️ *Resumo do dia — Hound Dog*`, ''];
    linhas.push(agenda.length ? `*Agenda de hoje*\n${agenda.map((a) => `• ${new Date(a.inicio).toLocaleTimeString('pt-BR', { timeZone: 'America/Bahia', hour: '2-digit', minute: '2-digit' })} ${a.titulo}${a.empresa ? ` (${a.empresa})` : ''}`).join('\n')}` : '*Agenda de hoje*\nNada marcado.');
    if (atencao.length) linhas.push('', `*Precisa de você*\n${atencao.map((a) => `• ${a.nome} — ${a.motivo === 'acao_vencida' ? 'ação vencida' : a.motivo === 'parado' ? 'parado há dias' : 'sem próxima ação'}${a.proxima_acao ? `: ${a.proxima_acao.slice(0, 80)}` : ''}`).join('\n')}`);
    if (quentes.length) linhas.push('', `*Respostas não lidas*\n${quentes.map((c) => `• ${c.empresa || c.nome || c.telefone}: ${(c.ultima_mensagem || '').slice(0, 70)}`).join('\n')}`);
    linhas.push('', '_Abra o Hound Dog para os detalhes._');
    if (await WA.enviarParaMim(linhas.join('\n'))) {
      ultimoBriefing = hoje;
      log('briefing', 'resumo do dia enviado no WhatsApp');
      await q(`insert into atividades (empresa_id, tipo, titulo, descricao, autor) values (null,'sistema','Resumo do dia enviado',$1,'farejador')`, [`${agenda.length} compromissos · ${atencao.length} pedindo atenção`]).catch(() => {});
    }
  } catch (e) { logErro('briefing', e); }
}

/** Analisa sozinho quando um lead responde (com folga de 25s para não cortar a frase no meio). */
async function agendarAnalise(conversaId, empresaId) {
  clearTimeout(debounceAnalise.get(conversaId));
  debounceAnalise.set(conversaId, setTimeout(async () => {
    debounceAnalise.delete(conversaId);
    try {
      const pendente = await q1("select id from jobs where conversa_id = $1 and tipo = 'analisar_conversa' and status in ('fila','processando')", [conversaId]);
      if (pendente) return;
      await q(`insert into jobs (tipo, entrada, conversa_id, empresa_id, prioridade, criado_por) values ('analisar_conversa','{}',$1,$2,2,'farejador')`, [conversaId, empresaId || null]);
      log('whatsapp', 'análise automática da conversa na fila');
      girar();
    } catch (e) { logErro('analise', e); }
  }, 25000));
}

/* ------------------------------ ligar tudo ------------------------------ */
async function inicio() {
  log('farejador', `iniciando v${VERSAO} em ${os.hostname()} · repositório ${RAIZ_REPO}`);
  escreverConfigMCP();
  const v = await versaoClaude();
  claudeOk = v.ok; claudeInfo = v.info;
  log('claude', v.info);

  // tarefas órfãs de uma execução anterior voltam para a fila
  const orfas = await q("update jobs set status = 'fila', progresso = 'Retomado após reinício do Farejador' where status = 'processando' returning id, tipo");
  if (orfas.length) log('fila', `${orfas.length} tarefa(s) retomada(s)`);

  // WhatsApp: religa sozinho se já estava conectado antes
  const cfgWa = (await q1("select valor from config where chave = 'whatsapp'"))?.valor || {};
  const temSessao = fs.existsSync(path.join(RAIZ_HD, 'farejador', '.wa-auth', 'creds.json'));
  if (cfgWa.ativo && temSessao) WA.conectar({ aoMudar: aoMudarWhats }).catch((e) => logErro('whatsapp', e));

  // quando chega mensagem de lead, o Claude lê sozinho (conforme o ajuste do painel)
  WA.wa.aoMensagemNova = async ({ conversa, empresa }) => {
    try {
      const cfg = (await q1("select valor from config where chave = 'whatsapp'"))?.valor || {};
      const modo = cfg.auto_analisar || 'leads';
      if (modo === 'nunca') return;
      if (modo === 'leads' && !empresa) return;
      agendarAnalise(conversa.id, empresa?.id);
    } catch (e) { logErro('whatsapp', e); }
  };

  await ligarEscuta();
  await bater();
  girar();

  setInterval(girar, 10000);
  setInterval(() => bater().catch(() => {}), 30000);
  setInterval(rotinaLembretes, 60000);
  setInterval(rotinaBriefing, 120000);
  setInterval(rotinaInstagram, 30 * 60000);
  setTimeout(rotinaInstagram, 15000);
  log('farejador', 'no ar. O painel já pode mandar trabalho.');
}

/* Fecha bonito */
async function encerrar(sinal) {
  if (parando) return;
  parando = true;
  log('farejador', `encerrando (${sinal})`);
  try { await q("update farejador_status set online_em = null, whatsapp_status = case when whatsapp_status = 'conectado' then 'conectado' else whatsapp_status end where id = 'principal'"); } catch { /* ok */ }
  try { servidor.close(); } catch { /* ok */ }
  try { await ouvinte?.end(); } catch { /* ok */ }
  try { await fecharDb(); } catch { /* ok */ }
  setTimeout(() => process.exit(0), 800);
}
process.on('SIGINT', () => encerrar('SIGINT'));
process.on('SIGTERM', () => encerrar('SIGTERM'));
process.on('uncaughtException', (e) => logErro('processo', e));
process.on('unhandledRejection', (e) => logErro('promessa', e));

inicio().catch((e) => { logErro('farejador', e); process.exit(1); });

export { agendarAnalise };
