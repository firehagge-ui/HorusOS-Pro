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
import { TAREFAS, USA_CLAUDE, USA_NAVEGADOR } from './tarefas.mjs';
import * as WA from './whatsapp.mjs';
import { precisaColetar, coletarESalvar } from './instagram.mjs';
import { detectarObjecoesTexto } from './objecoes.mjs';
import { rotinaDisparos } from './disparos.mjs';
import { rotinaMidia } from './midia.mjs';
import { rotinaFollowup } from './followup.mjs';
import { agenteDa, pedirCiclo } from '../lib/agentes.mjs';
import { pareceAutoResposta } from '../app/js/revisor.js';

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
  const conf = { mcpServers: {
    'hound-dog': { type: 'stdio', command: process.execPath, args: [path.join(RAIZ_HD, 'mcp', 'server.mjs')], env: { HD_AUTOR: 'claude' } },
    // Navegador próprio do Farejador (perfil em .navegador, logado uma vez com `npm run navegador`):
    // é o que deixa a investigação ler Instagram e Google Maps. Invisível, um por vez.
    navegador: { type: 'stdio', command: 'cmd', args: ['/c', 'npx', '-y', '@playwright/mcp@0.0.82', '--browser', 'chrome', '--headless',
      '--user-data-dir', path.join(RAIZ_HD, '.navegador'), '--output-dir', path.join(RAIZ_HD, '.navegador-saidas'), '--viewport-size', '1366x900'] },
  } };
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
  // Investigação e triagem usam o navegador do Farejador: uma de cada vez (as outras esperam na fila, na ordem em que o Marcelo clicou)
  const navegando = [...rodando.values()].some((r) => USA_NAVEGADOR.has(r.tipo));
  const tipos = Object.keys(TAREFAS).filter((t) => (USA_CLAUDE.has(t) ? claudeLivres > 0 : true) && !(USA_NAVEGADOR.has(t) && navegando));
  if (!tipos.length) return null;
  // Um ciclo de agente por vez por lead: o segundo espera o primeiro terminar (e lê o que ele gravou)
  const r = await q1(`update jobs set status = 'processando', iniciado_em = now(), progresso = 'Começando', tentativas = tentativas + 1
    where id = (select id from jobs j where status = 'fila' and tipo = any($1) and (retomar_em is null or retomar_em <= now())
                  and not (j.tipo = 'agente_ciclo' and exists (select 1 from jobs p where p.tipo = 'agente_ciclo' and p.status = 'processando' and p.empresa_id = j.empresa_id))
                order by prioridade, criado_em for update skip locked limit 1) returning *`, [tipos]);
  return r;
}

/**
 * Quando o limite da assinatura do Claude estoura, a tarefa não é um erro: ela espera.
 * Lê a hora que a própria mensagem do Claude informa ("resets 8pm") e remarca.
 */
function esperarPeloLimite(mensagem) {
  const m = String(mensagem || '');
  if (!/session limit|usage limit|weekly limit|hit your .{0,20}limit|limite de uso|rate limit|resets? \d/i.test(m)) return null;
  const agora = new Date();
  // Limite semanal (29/09): "You've hit your weekly limit · resets Oct 1, 6am (America/Bahia)"
  const comData = m.match(/resets?\s+([A-Z][a-z]{2})\w*\s+(\d{1,2}),?\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (comData) {
    const mes = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].indexOf(comData[1].toLowerCase());
    let h = Number(comData[3]);
    if (/pm/i.test(comData[5] || '') && h < 12) h += 12;
    if (/am/i.test(comData[5] || '') && h === 12) h = 0;
    const ano = new Date().getFullYear();
    let alvo = new Date(`${ano}-${String(mes + 1).padStart(2, '0')}-${String(comData[2]).padStart(2, '0')}T${String(h).padStart(2, '0')}:${comData[4] || '00'}:00-03:00`);
    if (alvo < agora) alvo = new Date(alvo.setFullYear(ano + 1));
    if (mes >= 0 && !Number.isNaN(alvo.getTime())) return new Date(alvo.getTime() + 5 * 60000);
  }
  const hora = m.match(/resets?\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  let volta;
  if (hora) {
    let h = Number(hora[1]);
    if (/pm/i.test(hora[3] || '') && h < 12) h += 12;
    if (/am/i.test(hora[3] || '') && h === 12) h = 0;
    const naBahia = new Date(agora.toLocaleString('en-US', { timeZone: 'America/Bahia' }));
    const alvo = new Date(naBahia);
    alvo.setHours(h, Number(hora[2] || 0), 30, 0);
    if (alvo <= naBahia) alvo.setDate(alvo.getDate() + 1);
    volta = new Date(agora.getTime() + (alvo - naBahia));
  } else {
    volta = new Date(agora.getTime() + 60 * 60000);
  }
  return volta;
}

async function executar(job) {
  const estado = { usaClaude: USA_CLAUDE.has(job.tipo), tipo: job.tipo };
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
    const espera = esperarPeloLimite(e.message);
    if (cancel) { log('fila', `✖ ${job.tipo} cancelado`); }
    else if (espera && job.tentativas < 8) {
      const horaBr = espera.toLocaleTimeString('pt-BR', { timeZone: 'America/Bahia', hour: '2-digit', minute: '2-digit' });
      await q("update jobs set status = 'fila', retomar_em = $2, progresso = $3, erro = null, iniciado_em = null where id = $1",
        [job.id, espera.toISOString(), `Limite da assinatura do Claude atingido. Retomo sozinho às ${horaBr}.`]).catch(() => {});
      log('fila', `⏸ ${job.tipo} esperando o limite do Claude liberar (${horaBr})`);
    } else {
      await q("update jobs set status = 'erro', concluido_em = now(), erro = $2 where id = $1", [job.id, String(e.message || e).slice(0, 900)]).catch(() => {});
      logErro('fila', e);
    }
  } finally {
    rodando.delete(job.id);
    bater().catch(() => {});
  }
}

// Uma volta de cada vez: vários avisos do banco juntos (ex.: 5 jobs criados de uma vez) disparavam voltas em
// paralelo, e cada uma achava que não havia investigação rodando (25/09: duas começaram juntas).
let girando = false, girarDeNovo = false;
async function girar() {
  if (parando) return;
  if (girando) { girarDeNovo = true; return; }
  girando = true;
  try {
    do {
      girarDeNovo = false;
      let job;
      while ((job = await pegarJob())) { executar(job); if (rodando.size >= MAX_CLAUDE + 2) break; }
    } while (girarDeNovo && !parando);
  } catch (e) { logErro('fila', e); }
  finally { girando = false; }
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
    // Com o 📣 Mídia ligado, quem coleta é ele, pela API oficial (farejador/midia.mjs)
    if ((await q1("select valor from config where chave = 'midia'"))?.valor?.ativo) return;
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
      const texto = `⏰ *${it.titulo}* às ${hora}${it.empresa ? `\n${it.empresa}` : ''}${it.local ? `\n📍 ${it.local}` : ''}${it.descricao ? `\n\n${it.descricao}` : ''}\n\n— Hounder`;
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
    // Reiniciar o Farejador zera a memória: sem esta checagem o resumo saía de novo a cada reinício (28/09 saiu 3 vezes)
    if (await q1(`select 1 from atividades where titulo = 'Resumo do dia enviado'
        and (criado_em at time zone 'America/Bahia')::date = (now() at time zone 'America/Bahia')::date limit 1`)) { ultimoBriefing = hoje; return; }
    // O resumo é da OPERAÇÃO, não da caixa de entrada pessoal: só entra conversa
    // ligada a uma ficha do CRM, não silenciada, recebida e ainda não lida (o
    // "lido" vem do celular pelo evento chats.update). Regra do Marcelo, 20/09/2026.
    const soCrm = cfg.briefing_so_crm !== false;
    const diasResposta = Number(cfg.briefing_dias_resposta) > 0 ? Number(cfg.briefing_dias_resposta) : 3;
    const [agenda, atencao, quentes, tarefas] = await Promise.all([
      q(`select a.titulo, a.inicio, a.local, e.nome empresa from agenda a left join empresas e on e.id = a.empresa_id
         where a.status = 'agendado' and a.inicio::date = (now() at time zone 'America/Bahia')::date order by a.inicio`),
      q('select nome, motivo, proxima_acao from vw_atencao limit 6'),
      q(`select c.nome, c.telefone, e.nome empresa, c.ultima_mensagem
           from whatsapp_conversas c ${soCrm ? 'join' : 'left join'} empresas e on e.id = c.empresa_id
          where not c.arquivada and not c.silenciada
            -- lida no celular não é respondida (30/09: Talina e Cintya ficaram ~20h sem resposta e sumiram do resumo)
            and c.ultima_direcao = 'in'
            and c.ultima_em > now() - ($1 || ' days')::interval
          order by c.ultima_em desc limit 5`, [String(diasResposta)]),
      // Tarefas (27/09/2026): atrasadas + as de hoje + as de prioridade alta dos próximos 3 dias
      q(`select titulo, to_char(prazo, 'DD/MM') prazo, prioridade, status, responsavel,
            prazo < (now() at time zone 'America/Bahia')::date atrasada
           from tarefas
          where status in ('a_fazer','fazendo','travada')
            and (prazo <= (now() at time zone 'America/Bahia')::date
                 or (prioridade = 'alta' and prazo <= (now() at time zone 'America/Bahia')::date + 3))
          order by tarefas.prazo, array_position(array['alta','media','baixa'], prioridade) limit 10`).catch(() => []),
    ]);
    const linhas = [`☀️ *Resumo do dia — Hounder*`, ''];
    if (tarefas.length) {
      const atrasadas = tarefas.filter((t) => t.atrasada);
      const resto = tarefas.filter((t) => !t.atrasada);
      const linha = (t) => `• ${t.titulo}${t.responsavel && !/marcelo/i.test(t.responsavel) ? ` (${t.responsavel})` : ''}${t.status === 'travada' ? ' · travada' : ''}`;
      if (atrasadas.length) linhas.push(`*Atrasadas*\n${atrasadas.map((t) => `${linha(t)} · era ${t.prazo}`).join('\n')}`, '');
      if (resto.length) linhas.push(`*Tarefas de hoje e próximas*\n${resto.map((t) => `${linha(t)}${t.prioridade === 'alta' ? ' · alta' : ''} · ${t.prazo}`).join('\n')}`, '');
    }
    linhas.push(agenda.length ? `*Agenda de hoje*\n${agenda.map((a) => `• ${new Date(a.inicio).toLocaleTimeString('pt-BR', { timeZone: 'America/Bahia', hour: '2-digit', minute: '2-digit' })} ${a.titulo}${a.empresa ? ` (${a.empresa})` : ''}`).join('\n')}` : '*Agenda de hoje*\nNada marcado.');
    if (atencao.length) linhas.push('', `*Precisa de você*\n${atencao.map((a) => `• ${a.nome} — ${a.motivo === 'acao_vencida' ? 'ação vencida' : a.motivo === 'parado' ? 'parado há dias' : 'sem próxima ação'}${a.proxima_acao ? `: ${a.proxima_acao.slice(0, 80)}` : ''}`).join('\n')}`);
    if (quentes.length) linhas.push('', `*Lead esperando resposta*\n${quentes.map((c) => `• ${c.empresa || c.nome || c.telefone}: ${(c.ultima_mensagem || '').slice(0, 70)}`).join('\n')}`);
    linhas.push('', '_Abra o Hounder para os detalhes._');
    if (await WA.enviarParaMim(linhas.join('\n'))) {
      ultimoBriefing = hoje;
      log('briefing', 'resumo do dia enviado no WhatsApp');
      await q(`insert into atividades (empresa_id, tipo, titulo, descricao, autor) values (null,'sistema','Resumo do dia enviado',$1,'farejador')`, [`${tarefas.length} tarefas · ${agenda.length} compromissos · ${atencao.length} pedindo atenção`]).catch(() => {});
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

/** Lead com agente ativo: quem lê a resposta é o agente dele (com memória), não a análise avulsa. Mesma folga de 25s. */
async function agendarCicloAgente(conversaId, empresaId) {
  clearTimeout(debounceAnalise.get(conversaId));
  debounceAnalise.set(conversaId, setTimeout(async () => {
    debounceAnalise.delete(conversaId);
    try {
      const ultima = await q1("select texto from whatsapp_mensagens where conversa_id = $1 and direcao = 'in' order by momento desc limit 1", [conversaId]);
      await pedirCiclo(empresaId, 'lead_respondeu', ultima?.texto ? `Última fala do lead: «${ultima.texto.slice(0, 500)}»` : null);
      log('agente', 'o lead respondeu: ciclo do agente na fila');
      girar();
    } catch (e) { logErro('agente', e); }
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
  WA.wa.aoMensagemNova = async ({ conversa, empresa, texto, tipo }) => {
    try {
      if (empresa && !conversa.silenciada && (await agenteDa(empresa.id))?.status === 'ativo') {
        // Resposta automática do WhatsApp Business não é o lead respondendo: não gasta ciclo
        // nem aviso do WhatsApp sem texto (mensagens temporárias etc., Cintya 30/09)
        if (!pareceAutoResposta(texto) && !(tipo === 'outro' && !texto)) agendarCicloAgente(conversa.id, empresa.id);
        return;
      }
      const cfg = (await q1("select valor from config where chave = 'whatsapp'"))?.valor || {};
      const modo = cfg.auto_analisar || 'leads';
      if (modo === 'nunca') return;
      if (modo === 'leads' && !empresa) return;
      if (conversa.silenciada) return; // conversa marcada como pessoal não vai para o Claude
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
  setInterval(rotinaDisparos, 30000);
  setInterval(rotinaInstagram, 30 * 60000);
  setTimeout(rotinaInstagram, 15000);
  setInterval(rotinaFollowup, 10 * 60000);   // follow-up programado e "esperando a sua resposta" (30/09)
  setTimeout(rotinaFollowup, 45000);
  setInterval(rotinaMidia, 60000);   // 📣 Mídia: agenda própria em social_rotinas (ferramentas/social/ARQUITETURA.md §7)
  setTimeout(rotinaMidia, 20000);
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
