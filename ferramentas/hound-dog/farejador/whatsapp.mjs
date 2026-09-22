// =============================================================================
// Farejador — WhatsApp (Baileys, conexão tipo WhatsApp Web).
// Lê conversas 1 a 1, liga com a ficha do CRM e envia SÓ o que o humano aprovou.
// Nada de disparo em massa, nada de resposta automática.
// =============================================================================
import path from 'node:path';
import fs from 'node:fs';
import QR from 'qrcode';
import pino from 'pino';
import makeWASocket, { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, Browsers, jidNormalizedUser, isJidGroup, isJidBroadcast, isJidStatusBroadcast, isJidNewsletter, isLidUser, getContentType, normalizeMessageContent } from 'baileys';
import { RAIZ_HD } from '../lib/env.mjs';
import { q, q1 } from '../lib/db.mjs';
import { log, logErro } from './log.mjs';
import { normalizarTelefone } from '../app/js/score.js';

const PASTA_AUTH = path.join(RAIZ_HD, 'farejador', '.wa-auth');
const LIMITE_PADRAO = 30;

export const wa = {
  sock: null, status: 'desligado', qr: null, codigo: null, numero: null, nome: null, erro: null,
  enviadasNaHora: [], aoMudar: null, parando: false, tentativas: 0,
};

function avisar() { wa.aoMudar?.({ status: wa.status, qr: wa.qr, codigo: wa.codigo, numero: wa.numero, nome: wa.nome, erro: wa.erro }); }

export function estaConectado() { return wa.status === 'conectado' && wa.sock; }

export async function conectar({ aoMudar } = {}) {
  if (aoMudar) wa.aoMudar = aoMudar;
  if (wa.sock && ['conectado', 'conectando', 'qr'].includes(wa.status)) return wa;
  fs.mkdirSync(PASTA_AUTH, { recursive: true });
  const { state, saveCreds } = await useMultiFileAuthState(PASTA_AUTH);
  const { version } = await fetchLatestBaileysVersion().catch(() => ({ version: undefined }));
  wa.parando = false;
  wa.status = 'conectando'; wa.erro = null; avisar();
  const sock = makeWASocket({
    version, auth: state, logger: pino({ level: 'silent' }), browser: Browsers.appropriate('Hound Dog'),
    syncFullHistory: false, markOnlineOnConnect: false, generateHighQualityLinkPreview: false, printQRInTerminal: false,
  });
  wa.sock = sock;

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (u) => {
    const { connection, lastDisconnect, qr } = u;
    if (qr) {
      wa.status = 'qr';
      wa.qr = await QR.toDataURL(qr, { margin: 1, width: 512, color: { dark: '#0b0b0f', light: '#ffffff' } });
      log('whatsapp', 'QR novo gerado (escaneie no celular)');
      avisar();
    }
    if (connection === 'open') {
      wa.status = 'conectado'; wa.qr = null; wa.codigo = null; wa.erro = null; wa.tentativas = 0;
      wa.numero = normalizarTelefone(jidNormalizedUser(sock.user?.id || '').split('@')[0]);
      wa.nome = sock.user?.name || null;
      log('whatsapp', `conectado como ${wa.nome || ''} ${wa.numero || ''}`);
      avisar();
    }
    if (connection === 'close') {
      const cod = lastDisconnect?.error?.output?.statusCode;
      const deslogado = cod === DisconnectReason.loggedOut || cod === 401;
      wa.sock = null;
      if (wa.parando) { wa.status = 'desligado'; avisar(); return; }
      if (deslogado) {
        wa.status = 'desconectado'; wa.qr = null; wa.erro = 'A sessão foi encerrada no celular. Conecte de novo lendo o QR.';
        try { fs.rmSync(PASTA_AUTH, { recursive: true, force: true }); } catch { /* ok */ }
        log('whatsapp', 'deslogado pelo celular');
        avisar(); return;
      }
      wa.tentativas++;
      const espera = Math.min(60, 3 * wa.tentativas) * 1000;
      wa.status = 'conectando'; wa.erro = `Conexão caiu (${cod || 'motivo desconhecido'}). Tentando de novo em ${Math.round(espera / 1000)}s.`;
      log('whatsapp', wa.erro); avisar();
      setTimeout(() => { if (!wa.parando) conectar().catch((e) => logErro('whatsapp', e)); }, espera);
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify' && type !== 'append') return;
    for (const m of messages) { try { await guardarMensagem(m); } catch (e) { logErro('whatsapp', e); } }
  });

  sock.ev.on('messages.update', async (ups) => {
    for (const { key, update } of ups) {
      const st = update?.status;
      if (!st || !key?.id) continue;
      const mapa = { 2: 'enviada', 3: 'entregue', 4: 'lida', 5: 'lida' };
      if (mapa[st]) await q('update whatsapp_mensagens set status = $2 where wa_id = $1 and direcao = $3', [key.id, mapa[st], 'out']).catch(() => {});
    }
  });

  // Ler no celular tem que valer aqui também: sem isso o Hound Dog cobra de novo
  // mensagem que o Marcelo já respondeu ou já leu no aparelho.
  sock.ev.on('chats.update', async (ups) => {
    for (const u of ups) {
      if (u?.unreadCount === undefined || u.unreadCount === null) continue;
      const telefone = await resolverTelefone(u.id).catch(() => null);
      if (!telefone) continue;
      const n = Number(u.unreadCount);
      const valor = Number.isFinite(n) ? (n < 0 ? 1 : n) : 0; // -1 = marcada como não lida no celular
      await q(`update whatsapp_conversas set nao_lidas = $2, lida_em = case when $2 = 0 then now() else lida_em end
               where jid = $1 and nao_lidas is distinct from $2`, [`${telefone}@s.whatsapp.net`, valor]).catch(() => {});
    }
  });

  sock.ev.on('messaging-history.set', async ({ messages }) => {
    if (!messages?.length) return;
    let n = 0;
    for (const m of messages.slice(0, 600)) { try { if (await guardarMensagem(m, true)) n++; } catch { /* ignora */ } }
    if (n) log('whatsapp', `histórico sincronizado: ${n} mensagens de conversas relevantes`);
  });

  return wa;
}

export async function desconectar() {
  wa.parando = true;
  try { await wa.sock?.logout(); } catch { /* ok */ }
  try { wa.sock?.end?.(); } catch { /* ok */ }
  try { fs.rmSync(PASTA_AUTH, { recursive: true, force: true }); } catch { /* ok */ }
  wa.sock = null; wa.status = 'desligado'; wa.qr = null; wa.codigo = null; wa.numero = null;
  log('whatsapp', 'desconectado');
  avisar();
}

export async function pedirCodigo(telefone) {
  const num = normalizarTelefone(telefone);
  if (!num) throw new Error('Número inválido');
  if (!wa.sock) await conectar();
  for (let i = 0; i < 10 && !wa.sock?.authState?.creds; i++) await new Promise((r) => setTimeout(r, 500));
  const codigo = await wa.sock.requestPairingCode(num);
  wa.codigo = codigo.match(/.{1,4}/g).join('-');
  log('whatsapp', 'código de pareamento gerado');
  avisar();
  return wa.codigo;
}

/* ------------------------------ Guardar mensagens ------------------------------ */
function textoDaMensagem(msg) {
  const conteudo = normalizeMessageContent(msg.message);
  const tipo = getContentType(conteudo);
  const mapa = { conversation: 'texto', extendedTextMessage: 'texto', imageMessage: 'imagem', videoMessage: 'video', audioMessage: 'audio', documentMessage: 'documento', stickerMessage: 'sticker', contactMessage: 'contato', locationMessage: 'local' };
  const texto = conteudo?.conversation || conteudo?.extendedTextMessage?.text || conteudo?.imageMessage?.caption || conteudo?.videoMessage?.caption
    || conteudo?.documentMessage?.caption || conteudo?.listResponseMessage?.title || conteudo?.buttonsResponseMessage?.selectedDisplayText || null;
  return { tipo: mapa[tipo] || (tipo ? 'outro' : null), texto };
}

async function resolverTelefone(jid) {
  if (!jid) return null;
  if (isLidUser(jid) && wa.sock?.signalRepository?.lidMapping?.getPNForLID) {
    const pn = await wa.sock.signalRepository.lidMapping.getPNForLID(jid).catch(() => null);
    if (pn) return normalizarTelefone(pn.split('@')[0]);
    return null;
  }
  return normalizarTelefone(jid.split('@')[0].split(':')[0]);
}

export async function guardarMensagem(m, doHistorico = false) {
  const key = m.key || {};
  const jidBruto = key.remoteJid || '';
  if (!jidBruto || isJidGroup(jidBruto) || isJidBroadcast(jidBruto) || isJidStatusBroadcast(jidBruto) || isJidNewsletter(jidBruto)) return false;
  const { tipo, texto } = textoDaMensagem(m);
  if (!tipo) return false; // protocolo, reação, recibo
  const telefone = await resolverTelefone(key.remoteJidAlt || jidBruto) || await resolverTelefone(jidBruto);
  if (!telefone) return false;
  const jid = `${telefone}@s.whatsapp.net`;
  const momento = new Date(Number(m.messageTimestamp || Date.now() / 1000) * 1000);
  if (doHistorico && momento < new Date(Date.now() - 45 * 86400000)) return false;
  const direcao = key.fromMe ? 'out' : 'in';

  // Casa pelo WhatsApp cadastrado e, se não achar, pelo telefone da ficha: muito
  // lead da casa entra só com o telefone do Google/Instagram, e sem isso a conversa
  // nasce solta e some do filtro "Leads".
  const empresa = await q1(
    `select id, nome from empresas
      where right(regexp_replace(coalesce(whatsapp,''),'\\D','','g'), 8) = right($1, 8)
         or right(regexp_replace(coalesce(telefone,''),'\\D','','g'), 8) = right($1, 8)
      order by (right(regexp_replace(coalesce(whatsapp,''),'\\D','','g'), 8) = right($1, 8)) desc, atualizado_em desc
      limit 1`, [telefone]).catch(() => null);
  if (doHistorico && !empresa) return false; // no histórico só puxamos quem já é do CRM

  // pushName numa mensagem QUE EU MANDEI é o meu próprio nome, não o do contato.
  // Sem esta trava, toda conversa iniciada por nós nascia chamada "Marcelo Hagge".
  const nomeContato = direcao === 'in' ? (m.pushName || null) : null;

  let conversa = await q1('select * from whatsapp_conversas where jid = $1', [jid]);
  if (!conversa) {
    conversa = await q1(`insert into whatsapp_conversas (jid, telefone, nome, empresa_id, ultima_mensagem, ultima_direcao, ultima_em)
                         values ($1,$2,$3,$4,$5,$6,$7) on conflict (jid) do update set atualizado_em = now() returning *`,
    [jid, telefone, nomeContato, empresa?.id || null, (texto || `[${tipo}]`).slice(0, 400), direcao, momento.toISOString()]);
  }
  if (empresa && !conversa.empresa_id) await q('update whatsapp_conversas set empresa_id = $2 where id = $1', [conversa.id, empresa.id]);

  const existente = key.id ? await q1('select id from whatsapp_mensagens where wa_id = $1', [key.id]) : null;
  if (existente) return false;
  await q(`insert into whatsapp_mensagens (conversa_id, wa_id, direcao, tipo, texto, status, momento, enviado_por)
           values ($1,$2,$3,$4,$5,$6,$7,$8) on conflict (wa_id) do nothing`,
  [conversa.id, key.id || null, direcao, tipo, texto, direcao === 'in' ? 'recebida' : 'enviada', momento.toISOString(), direcao === 'out' && !doHistorico ? 'celular' : null]);

  if (!doHistorico) {
    await q(`update whatsapp_conversas set ultima_mensagem = $2, ultima_direcao = $3, ultima_em = $4, nome = coalesce(nome, $5),
             nao_lidas = case when $3 = 'in' then nao_lidas + 1 else 0 end where id = $1`,
    [conversa.id, (texto || `[${tipo}]`).slice(0, 400), direcao, momento.toISOString(), nomeContato]);
    if (empresa && direcao === 'in') {
      await q(`insert into atividades (empresa_id, tipo, titulo, descricao, autor) values ($1,'whatsapp',$2,$3,'whatsapp')`,
        [empresa.id, 'Respondeu no WhatsApp', (texto || `[${tipo}]`).slice(0, 400)]).catch(() => {});
      await q(`update empresas set estagio = 'conversando', atualizado_por = 'whatsapp' where id = $1 and estagio = 'abordado'`, [empresa.id]).catch(() => {});
    }
    if (direcao === 'in') { try { wa.aoMensagemNova?.({ conversa, empresa, texto, tipo }); } catch (e) { logErro('whatsapp', e); } }
  }
  return { conversa, direcao, texto, empresa };
}

/* ------------------------------ Enviar ------------------------------ */
export async function enviar({ telefone, jid, texto }) {
  if (!estaConectado()) throw new Error('WhatsApp não está conectado no Farejador.');
  const agora = Date.now();
  wa.enviadasNaHora = wa.enviadasNaHora.filter((t) => agora - t < 3600000);
  const limite = Number((await q1("select valor from config where chave = 'whatsapp'"))?.valor?.limite_hora || LIMITE_PADRAO);
  if (wa.enviadasNaHora.length >= limite) throw new Error(`Limite de ${limite} envios por hora atingido (trava de segurança do número).`);

  let destino = jid;
  const num = normalizarTelefone(telefone);
  if (!destino || !destino.includes('@')) {
    const achado = await wa.sock.onWhatsApp(num).catch(() => null);
    if (!achado?.[0]?.exists) throw new Error('Esse número não tem WhatsApp (ou está errado). Confirme o número com o cliente.');
    destino = achado[0].jid;
  }
  try { await wa.sock.sendPresenceUpdate('composing', destino); } catch { /* ok */ }
  await new Promise((r) => setTimeout(r, Math.min(6000, 1200 + String(texto).length * 22)));
  const enviada = await wa.sock.sendMessage(destino, { text: texto });
  try { await wa.sock.sendPresenceUpdate('paused', destino); } catch { /* ok */ }
  wa.enviadasNaHora.push(Date.now());
  log('whatsapp', `enviada para ${num}`);
  return enviada?.key?.id || null;
}

/** Mensagem para o próprio número (lembretes e resumo do dia). */
export async function enviarParaMim(texto) {
  if (!estaConectado()) return false;
  const meu = jidNormalizedUser(wa.sock.user?.id);
  if (!meu) return false;
  await wa.sock.sendMessage(meu, { text: texto });
  return true;
}
