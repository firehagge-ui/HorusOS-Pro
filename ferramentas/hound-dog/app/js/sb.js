/* =============================================================================
   HOUND DOG — dados: cliente Supabase, sessão, tempo real, fila de jobs, cache
   A chave publicável é pública por desenho; quem protege os dados é a RLS
   (só operador cadastrado lê e escreve).
   ============================================================================= */
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.116.0/+esm';

export const SUPABASE_URL = 'https://zzkawmjpjhluiztemlmr.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_pMYFoXHwNknV8IOhtBF2Pg_yzLbIoth';

export const sb = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, storageKey: 'hound-dog-sessao' },
  realtime: { params: { eventsPerSecond: 20 } },
});

/* ------------------------------ Estado global ------------------------------ */
export const estado = {
  sessao: null,
  eu: null,            // linha de operadores
  estagios: [],
  config: {},
  playbook: [],
  farejador: null,
  empresas: [],
  carregado: false,
};

const ouvintes = new Map(); // tabela -> Set(fn)
export function ouvir(tabela, fn) {
  if (!ouvintes.has(tabela)) ouvintes.set(tabela, new Set());
  ouvintes.get(tabela).add(fn);
  return () => ouvintes.get(tabela)?.delete(fn);
}
function emitir(tabela, payload) {
  ouvintes.get(tabela)?.forEach((fn) => { try { fn(payload); } catch (e) { console.error('[ouvinte]', tabela, e); } });
  ouvintes.get('*')?.forEach((fn) => { try { fn({ ...payload, tabela }); } catch (e) { console.error(e); } });
}

/* ------------------------------ Carga inicial ------------------------------ */
export async function carregarBase() {
  const uid = estado.sessao?.user?.id;
  const [eu, estagios, config, playbook, farejador, empresas] = await Promise.all([
    sb.from('operadores').select('*').eq('user_id', uid).maybeSingle(),
    sb.from('estagios').select('*').order('ordem'),
    sb.from('config').select('*'),
    sb.from('playbook_objecoes').select('*').order('ordem'),
    sb.from('farejador_status').select('*').eq('id', 'principal').maybeSingle(),
    sb.from('empresas').select('*').order('atualizado_em', { ascending: false }).limit(5000),
  ]);
  for (const r of [eu, estagios, config, playbook, farejador, empresas]) if (r.error) throw r.error;
  estado.eu = eu.data;
  estado.estagios = estagios.data;
  estado.config = Object.fromEntries(config.data.map((c) => [c.chave, c.valor]));
  estado.playbook = playbook.data;
  estado.farejador = farejador.data;
  estado.empresas = empresas.data;
  estado.carregado = true;
}

/* ------------------------------ Tempo real ------------------------------ */
let canal;
const TABELAS_RT = ['empresas', 'atividades', 'agenda', 'jobs', 'chat_mensagens', 'chat_threads', 'whatsapp_conversas',
  'whatsapp_mensagens', 'farejador_status', 'listas', 'pesquisas', 'instagram_snapshots', 'negocios', 'financeiro'];

export function ligarTempoReal() {
  if (canal) sb.removeChannel(canal);
  canal = sb.channel('hound-dog');
  for (const t of TABELAS_RT) {
    canal.on('postgres_changes', { event: '*', schema: 'public', table: t }, (p) => {
      if (t === 'empresas') aplicarEmpresa(p);
      if (t === 'farejador_status' && p.new?.id === 'principal') estado.farejador = p.new;
      emitir(t, p);
    });
  }
  canal.subscribe((status) => emitir('_conexao', { status }));
}
export function desligarTempoReal() { if (canal) { sb.removeChannel(canal); canal = null; } }

function aplicarEmpresa(p) {
  const lista = estado.empresas;
  if (p.eventType === 'DELETE') {
    const i = lista.findIndex((e) => e.id === p.old?.id);
    if (i >= 0) lista.splice(i, 1);
    return;
  }
  const i = lista.findIndex((e) => e.id === p.new.id);
  if (i >= 0) lista[i] = p.new; else lista.unshift(p.new);
}

/** Atualiza o cache local na hora (sem esperar o tempo real) e avisa as telas. */
export function tocarEmpresa(linha) {
  aplicarEmpresa({ eventType: 'UPDATE', new: linha });
  emitir('empresas', { eventType: 'UPDATE', new: linha, local: true });
}

/* ------------------------------ Helpers de dados ------------------------------ */
export function quem() { return estado.eu?.nome || 'operador'; }

export async function salvarEmpresa(id, campos) {
  const { data, error } = await sb.from('empresas').update({ ...campos, atualizado_por: quem() }).eq('id', id).select().single();
  if (error) throw error;
  tocarEmpresa(data);
  return data;
}

export async function criarEmpresa(campos) {
  const { data, error } = await sb.from('empresas').insert({ ...campos, atualizado_por: quem() }).select().single();
  if (error) throw error;
  aplicarEmpresa({ eventType: 'INSERT', new: data });
  emitir('empresas', { eventType: 'INSERT', new: data, local: true });
  return data;
}

export async function registrarAtividade(empresaId, tipo, titulo, descricao = null, dados = {}) {
  const { data, error } = await sb.from('atividades').insert({ empresa_id: empresaId, tipo, titulo, descricao, dados, autor: quem() }).select().single();
  if (error) throw error;
  return data;
}

export async function salvarConfig(chave, valor) {
  const { error } = await sb.from('config').upsert({ chave, valor });
  if (error) throw error;
  estado.config[chave] = valor;
  emitir('config', { chave, valor });
}

/** Coloca um trabalho na fila do Farejador (Claude, WhatsApp, Instagram...). */
export async function criarJob(tipo, entrada = {}, vinculos = {}, prioridade = 5) {
  const { data, error } = await sb.from('jobs').insert({ tipo, entrada, prioridade, criado_por: quem(), ...vinculos }).select().single();
  if (error) throw error;
  return data;
}

/** Espera um job terminar (tempo real com reserva por consulta). */
export function acompanharJob(id, aoMudar) {
  let parado = false;
  const tratar = (job) => { if (!parado && job?.id === id) aoMudar(job); };
  const tirar = ouvir('jobs', (p) => tratar(p.new));
  const t = setInterval(async () => {
    const { data } = await sb.from('jobs').select('*').eq('id', id).maybeSingle();
    if (data) tratar(data);
    if (data && ['concluido', 'erro', 'cancelado'].includes(data.status)) parar();
  }, 8000);
  function parar() { parado = true; tirar(); clearInterval(t); }
  return parar;
}

export function farejadorOnline() {
  const f = estado.farejador;
  if (!f?.online_em) return false;
  return Date.now() - new Date(f.online_em).getTime() < 90 * 1000;
}

export function estagio(id) { return estado.estagios.find((e) => e.id === id) || { id, nome: id, cor: '#64748b', tipo: 'aberto' }; }
export function empresa(id) { return estado.empresas.find((e) => e.id === id) || null; }

/** Procura empresa já cadastrada (mesmo WhatsApp, Instagram ou nome+cidade). */
export function acharDuplicada({ whatsapp, instagram, nome, cidade }) {
  const w = whatsapp ? String(whatsapp).replace(/\D/g, '').slice(-8) : null;
  const n = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
  return estado.empresas.find((e) =>
    (w && e.whatsapp && String(e.whatsapp).replace(/\D/g, '').slice(-8) === w) ||
    (instagram && e.instagram && e.instagram.toLowerCase() === String(instagram).toLowerCase()) ||
    (nome && n(e.nome) === n(nome) && (!cidade || !e.cidade || n(e.cidade).includes(n(cidade).slice(0, 6)))),
  ) || null;
}
