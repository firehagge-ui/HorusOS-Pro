// =============================================================================
// Operações do CRM usadas pelo MCP (Claude Code) e pelo Farejador.
// Sempre registram quem fez (autor) e mantêm a linha do tempo honesta.
// =============================================================================
import { q, q1 } from './db.mjs';
import { pontuar, normalizarTelefone, normalizarInstagram, normalizarSite, detectarRegulado, statusDoSite } from '../app/js/score.js';

const CAMPOS_EMPRESA = ['nome', 'categoria', 'cidade', 'bairro', 'endereco', 'decisor', 'decisor_obs', 'whatsapp', 'telefone', 'email', 'instagram',
  'instagram_seguidores', 'site', 'site_status', 'google_nota', 'google_avaliacoes', 'gmb_status', 'roda_anuncio', 'cnpj', 'regulado', 'conselho',
  'relacao', 'estagio', 'temperatura', 'origem', 'origem_detalhe', 'gancho', 'dor', 'valor_estimado', 'proxima_acao', 'proxima_acao_em',
  'responsavel', 'tags', 'pasta_repo', 'resumo', 'dossie', 'arquivado'];

const ESTAGIOS = ['novo', 'qualificado', 'abordado', 'conversando', 'reuniao', 'proposta', 'negociacao', 'ganho', 'followup', 'perdido'];

async function opcoesScore() {
  const linhas = await q("select chave, valor from config where chave in ('score','nichos_conhecidos','praca')");
  const c = Object.fromEntries(linhas.map((l) => [l.chave, l.valor]));
  return { pesos: c.score, nichos: c.nichos_conhecidos, praca: c.praca?.regiao };
}

export function normalizarEmpresa(dados) {
  const d = { ...dados };
  if ('whatsapp' in d) d.whatsapp = normalizarTelefone(d.whatsapp);
  if ('telefone' in d) d.telefone = normalizarTelefone(d.telefone);
  if ('instagram' in d) d.instagram = normalizarInstagram(d.instagram);
  if ('site' in d) d.site = normalizarSite(d.site);
  if ('site_status' in d && d.site_status && !['sem', 'fora_do_ar', 'ruim', 'ok', 'desconhecido'].includes(d.site_status)) d.site_status = statusDoSite(d.site_status, d.site);
  if ('cnpj' in d && d.cnpj) d.cnpj = String(d.cnpj).replace(/\D/g, '') || null;
  if ('google_nota' in d && d.google_nota != null) { const n = Number(String(d.google_nota).replace(',', '.')); d.google_nota = Number.isFinite(n) && n >= 0 && n <= 5 ? n : null; }
  for (const k of ['instagram_seguidores', 'google_avaliacoes']) if (k in d && d[k] != null) { const n = Number(String(d[k]).replace(/\D/g, '')); d[k] = Number.isFinite(n) ? n : null; }
  if ('estagio' in d && d.estagio && !ESTAGIOS.includes(d.estagio)) delete d.estagio;
  for (const k of Object.keys(d)) if (!CAMPOS_EMPRESA.includes(k)) delete d[k];
  return d;
}

export async function acharEmpresa({ id, nome, whatsapp, instagram, cidade }) {
  if (id) return q1('select * from empresas where id = $1', [id]);
  const w = normalizarTelefone(whatsapp);
  if (w) { const r = await q1("select * from empresas where right(regexp_replace(coalesce(whatsapp,''),'\\D','','g'), 8) = right($1, 8) limit 1", [w]); if (r) return r; }
  const ig = normalizarInstagram(instagram);
  if (ig) { const r = await q1('select * from empresas where lower(instagram) = $1 limit 1', [ig]); if (r) return r; }
  if (nome) {
    const r = await q1(`select * from empresas where lower(unaccent_simples(nome)) = lower(unaccent_simples($1)) ${cidade ? 'and (cidade is null or lower(cidade) like lower($2))' : ''} limit 1`,
      cidade ? [nome, `%${String(cidade).split(/[,/-]/)[0].trim()}%`] : [nome]).catch(() => null);
    if (r) return r;
    return q1('select * from empresas where lower(nome) = lower($1) limit 1', [nome]);
  }
  return null;
}

export async function registrarAtividade(empresaId, tipo, titulo, descricao = null, autor = 'claude', dados = {}) {
  return q1('insert into atividades (empresa_id, tipo, titulo, descricao, autor, dados) values ($1,$2,$3,$4,$5,$6) returning *',
    [empresaId, tipo, String(titulo).slice(0, 300), descricao, autor, JSON.stringify(dados)]);
}

/** Cria ou atualiza uma empresa (deduplica por WhatsApp, Instagram ou nome+cidade). */
export async function salvarEmpresa(entrada, autor = 'claude') {
  const dados = normalizarEmpresa(entrada);
  const existente = await acharEmpresa({ id: entrada.id, nome: dados.nome, whatsapp: dados.whatsapp, instagram: dados.instagram, cidade: dados.cidade });
  if (entrada.id && !existente) throw new Error(`Empresa ${entrada.id} não existe`);
  const base = existente ? { ...existente, ...dados } : dados;
  if (!base.nome) throw new Error('nome é obrigatório para criar empresa');
  const conselho = detectarRegulado(`${base.categoria || ''} ${base.nome}`);
  if (conselho && dados.regulado === undefined && !existente?.regulado) { dados.regulado = true; dados.conselho = dados.conselho || conselho; }
  const p = pontuar(base, await opcoesScore());
  dados.score = p.score; dados.prioridade = p.prioridade; dados.score_motivos = JSON.stringify(p.motivos);
  dados.atualizado_por = autor;
  if (dados.tags && !Array.isArray(dados.tags)) dados.tags = String(dados.tags).split(',').map((t) => t.trim()).filter(Boolean);
  if (dados.dossie && typeof dados.dossie !== 'string') dados.dossie = JSON.stringify(dados.dossie);
  const cols = Object.keys(dados);
  if (existente) {
    const mudou = cols.filter((c) => !['score', 'prioridade', 'score_motivos', 'atualizado_por'].includes(c) && JSON.stringify(existente[c] ?? null) !== JSON.stringify(dados[c] ?? null));
    const sets = cols.map((c, i) => `${c} = $${i + 2}`).join(', ');
    const r = await q1(`update empresas set ${sets} where id = $1 returning *`, [existente.id, ...cols.map((c) => dados[c])]);
    if (mudou.length && !(mudou.length === 1 && mudou[0] === 'estagio')) {
      await registrarAtividade(existente.id, 'claude', `${autor === 'claude' ? 'Claude atualizou' : 'Atualizado'}: ${mudou.filter((c) => c !== 'estagio').join(', ')}`, entrada._motivo || null, autor);
    }
    return { empresa: r, criada: false, campos_alterados: mudou };
  }
  if (!dados.origem) dados.origem = 'claude';
  const cols2 = Object.keys(dados);
  const r = await q1(`insert into empresas (${cols2.join(',')}) values (${cols2.map((_, i) => `$${i + 1}`).join(',')}) returning *`, cols2.map((c) => dados[c]));
  return { empresa: r, criada: true, campos_alterados: cols2 };
}

export async function moverEstagio(empresaId, estagio, motivo, autor = 'claude') {
  if (!ESTAGIOS.includes(estagio)) throw new Error(`Estágio inválido. Use: ${ESTAGIOS.join(', ')}`);
  const r = await q1('update empresas set estagio = $2, atualizado_por = $3 where id = $1 returning *', [empresaId, estagio, autor]);
  if (!r) throw new Error('Empresa não encontrada');
  if (motivo) await registrarAtividade(empresaId, 'nota', `Motivo da mudança para ${estagio}`, motivo, autor);
  return r;
}

/** "2026-09-22 15:00" (hora da Bahia, UTC-3) ou ISO completo → Date. */
export function interpretarData(texto) {
  if (!texto) return null;
  const s = String(texto).trim();
  if (/[zZ]|[+-]\d{2}:?\d{2}$/.test(s)) { const d = new Date(s); return Number.isNaN(d.getTime()) ? null : d; }
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{1,2}):(\d{2}))?/);
  if (m) return new Date(`${m[1]}-${m[2]}-${m[3]}T${String(m[4] ?? '09').padStart(2, '0')}:${m[5] ?? '00'}:00-03:00`);
  const br = s.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?(?:\s+(\d{1,2})[:h](\d{2})?)?/);
  if (br) {
    const ano = br[3] ? (br[3].length === 2 ? 2000 + Number(br[3]) : Number(br[3])) : new Date().getFullYear();
    return new Date(`${ano}-${br[2].padStart(2, '0')}-${br[1].padStart(2, '0')}T${String(br[4] ?? '09').padStart(2, '0')}:${br[5] ?? '00'}:00-03:00`);
  }
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function agendar({ empresa_id = null, titulo, tipo = 'r1', inicio, duracao_min = 30, local = null, descricao = null, lembrete_min = 30 }, autor = 'claude') {
  const ini = interpretarData(inicio);
  if (!ini) throw new Error('Data/hora inválida. Use "AAAA-MM-DD HH:mm" (horário da Bahia) ou ISO.');
  const fim = new Date(ini.getTime() + Number(duracao_min || 30) * 60000);
  const r = await q1(`insert into agenda (empresa_id, titulo, tipo, inicio, fim, local, descricao, lembrete_min, criado_por, responsavel)
                      values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$9) returning *`, [empresa_id, titulo, tipo, ini.toISOString(), fim.toISOString(), local, descricao, lembrete_min, autor]);
  if (empresa_id) {
    await registrarAtividade(empresa_id, 'nota', `Agendado: ${titulo}`, ini.toLocaleString('pt-BR', { timeZone: 'America/Bahia', dateStyle: 'short', timeStyle: 'short' }), autor, { agenda_id: r.id });
    await q('update empresas set proxima_acao = $2, proxima_acao_em = $3, atualizado_por = $4 where id = $1', [empresa_id, titulo, ini.toISOString(), autor]);
    if (tipo === 'r1') await q("update empresas set estagio = 'reuniao', atualizado_por = $2 where id = $1 and estagio in ('novo','qualificado','abordado','conversando')", [empresa_id, autor]);
  }
  return r;
}

export async function salvarNegocio(n, autor = 'claude') {
  const campos = ['titulo', 'fase', 'valor', 'recorrencia_mensal', 'status', 'entrega', 'probabilidade', 'observacao'];
  const dados = Object.fromEntries(campos.filter((c) => n[c] !== undefined).map((c) => [c, n[c]]));
  let r;
  if (n.id) {
    const cols = Object.keys(dados);
    r = await q1(`update negocios set ${cols.map((c, i) => `${c} = $${i + 2}`).join(', ')} where id = $1 returning *`, [n.id, ...cols.map((c) => dados[c])]);
  } else {
    if (!n.empresa_id || !n.titulo) throw new Error('empresa_id e titulo são obrigatórios');
    const cols = ['empresa_id', ...Object.keys(dados)];
    r = await q1(`insert into negocios (${cols.join(',')}) values (${cols.map((_, i) => `$${i + 1}`).join(',')}) returning *`, [n.empresa_id, ...Object.values(dados)]);
  }
  if (r) await registrarAtividade(r.empresa_id, 'proposta', `Negócio ${n.id ? 'atualizado' : 'criado'}: ${r.titulo}`, [r.status, r.valor != null ? `R$ ${r.valor}` : null].filter(Boolean).join(' · '), autor);
  return r;
}

/** Adiciona leads encontrados pelo Claude a uma lista (normaliza, pontua, deduplica). */
export async function adicionarItensLista(listaId, itens) {
  const lista = await q1('select * from listas where id = $1', [listaId]);
  if (!lista) throw new Error('Lista não encontrada');
  const opc = await opcoesScore();
  const existentes = await q('select nome, whatsapp, instagram from lista_itens where lista_id = $1', [listaId]);
  const chaves = new Set(existentes.flatMap((e) => [e.whatsapp && `w${String(e.whatsapp).slice(-8)}`, e.instagram && `i${e.instagram}`, `n${String(e.nome).toLowerCase()}`].filter(Boolean)));
  let inseridos = 0, repetidos = 0;
  for (const bruto of itens || []) {
    if (!bruto?.nome) continue;
    const it = {
      nome: String(bruto.nome).trim(), categoria: bruto.categoria || lista.nicho, cidade: bruto.cidade || lista.cidade, bairro: bruto.bairro || null, endereco: bruto.endereco || null,
      telefone: normalizarTelefone(bruto.telefone), whatsapp: normalizarTelefone(bruto.whatsapp), instagram: normalizarInstagram(bruto.instagram),
      instagram_seguidores: bruto.instagram_seguidores != null ? Number(String(bruto.instagram_seguidores).replace(/\D/g, '')) || null : null,
      site: normalizarSite(bruto.site), google_nota: bruto.google_nota != null ? Number(String(bruto.google_nota).replace(',', '.')) : null,
      google_avaliacoes: bruto.google_avaliacoes != null ? Number(String(bruto.google_avaliacoes).replace(/\D/g, '')) || null : null,
      gmb_status: bruto.gmb_status || null, roda_anuncio: typeof bruto.roda_anuncio === 'boolean' ? bruto.roda_anuncio : null, cnpj: bruto.cnpj ? String(bruto.cnpj).replace(/\D/g, '') : null,
      observacao: [bruto.observacao, bruto.decisor ? `Decisor: ${bruto.decisor}` : null].filter(Boolean).join(' · ') || null,
    };
    it.site_status = ['sem', 'fora_do_ar', 'ruim', 'ok', 'desconhecido'].includes(bruto.site_status) ? bruto.site_status : statusDoSite(bruto.site_status || '', it.site);
    if (it.google_nota != null && !(it.google_nota >= 0 && it.google_nota <= 5)) it.google_nota = null;
    const ch = [it.whatsapp && `w${it.whatsapp.slice(-8)}`, it.instagram && `i${it.instagram}`, `n${it.nome.toLowerCase()}`].filter(Boolean);
    if (ch.some((c) => chaves.has(c))) { repetidos++; continue; }
    ch.forEach((c) => chaves.add(c));
    const p = pontuar(it, opc);
    const emp = await acharEmpresa({ nome: it.nome, whatsapp: it.whatsapp, instagram: it.instagram, cidade: it.cidade });
    await q(`insert into lista_itens (lista_id, nome, categoria, cidade, bairro, endereco, telefone, whatsapp, instagram, instagram_seguidores, site, site_status,
             google_nota, google_avaliacoes, gmb_status, roda_anuncio, cnpj, observacao, dados, score, score_motivos, prioridade, empresa_id)
             values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)`,
    [listaId, it.nome, it.categoria, it.cidade, it.bairro, it.endereco, it.telefone, it.whatsapp, it.instagram, it.instagram_seguidores, it.site, it.site_status,
      it.google_nota, it.google_avaliacoes, it.gmb_status, it.roda_anuncio, it.cnpj, it.observacao, JSON.stringify({ fontes: bruto.fontes || [], origem: 'claude' }),
      p.score, JSON.stringify(p.motivos), p.prioridade, emp?.id || null]);
    inseridos++;
  }
  const total = await q1('select count(*)::int n from lista_itens where lista_id = $1', [listaId]);
  await q('update listas set total = $2 where id = $1', [listaId, total.n]);
  return { inseridos, repetidos, total: total.n };
}

export async function resumoCRM() {
  const [estagios, abertos, atencao, agenda, ativ, fin, tarefas] = await Promise.all([
    q(`select e.id, e.nome, count(emp.id)::int n, coalesce(sum(emp.valor_estimado),0)::float valor from estagios e
       left join empresas emp on emp.estagio = e.id and not emp.arquivado and emp.relacao in ('lead','cliente') group by e.id, e.nome, e.ordem order by e.ordem`),
    q(`select id, nome, categoria, cidade, estagio, relacao, score, temperatura, valor_estimado, proxima_acao, proxima_acao_em, ultimo_contato_em, regulado, conselho
       from empresas where not arquivado and relacao in ('lead','cliente','interno') order by array_position(array['negociacao','proposta','reuniao','conversando','abordado','qualificado','novo','ganho','followup','perdido'], estagio), score desc limit 40`),
    q('select id, nome, estagio, motivo, proxima_acao from vw_atencao limit 15'),
    q(`select a.titulo, a.tipo, a.inicio, a.local, a.status, e.nome empresa from agenda a left join empresas e on e.id = a.empresa_id
       where a.inicio between now() - interval '1 day' and now() + interval '14 days' and a.status <> 'cancelado' order by a.inicio limit 20`),
    q(`select a.titulo, a.tipo, a.autor, a.criado_em, e.nome empresa from atividades a left join empresas e on e.id = a.empresa_id order by a.criado_em desc limit 12`),
    q(`select status, sum(valor)::float total from financeiro group by status`),
    // Tarefas atrasadas e dos próximos 7 dias (o resto sai em hd_tarefas)
    q(`select id, titulo, prioridade, status, responsavel, prazo, marco from tarefas
       where status in ('a_fazer','fazendo','travada') and prazo <= (now() at time zone 'America/Bahia')::date + 7
       order by prazo, array_position(array['alta','media','baixa'], prioridade) limit 20`).catch(() => []),
  ]);
  return { estagios, empresas: abertos, precisam_de_atencao: atencao, agenda_14_dias: agenda, atividade_recente: ativ, financeiro: fin, tarefas_7_dias: tarefas, agora: new Date().toISOString() };
}

export async function detalheEmpresa(id) {
  const e = await q1('select * from empresas where id = $1', [id]);
  if (!e) return null;
  const [negocios, financeiro, agenda, atividades, conversas] = await Promise.all([
    q('select titulo, fase, valor, recorrencia_mensal, status, entrega, probabilidade, observacao from negocios where empresa_id = $1 order by criado_em', [id]),
    q('select descricao, valor, status, tipo, vencimento, recebido_em from financeiro where empresa_id = $1 order by criado_em', [id]),
    q("select titulo, tipo, inicio, local, status from agenda where empresa_id = $1 order by inicio desc limit 10", [id]),
    q('select tipo, titulo, descricao, autor, criado_em from atividades where empresa_id = $1 order by criado_em desc limit 25', [id]),
    q(`select m.direcao, m.texto, m.momento from whatsapp_mensagens m join whatsapp_conversas c on c.id = m.conversa_id where c.empresa_id = $1 order by m.momento desc limit 20`, [id]),
  ]);
  const { dossie, score_motivos, ...resto } = e;
  return { ...resto, motivos_do_score: score_motivos, negocios, financeiro, agenda, atividades, whatsapp_ultimas: conversas.reverse() };
}
