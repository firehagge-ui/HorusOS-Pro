/* =============================================================================
   HOUND DOG — pontuação de potencial (0 a 100) e leitura de planilhas
   Módulo puro (sem DOM): roda no navegador e no Node (Farejador, seed, MCP).
   Régua: Horus-Comercial/30-checklist-qualificacao.md (pesos editáveis em config.score)
   ============================================================================= */

export const PESOS_PADRAO = {
  sem_site: 30, instagram_movimento: 20, dono_acessivel: 15, gmb_fraco: 15, nicho_conhecido: 10, timing: 10,
};

export const NICHOS_PADRAO = ['floricultura', 'flores', 'café', 'cafe', 'psicologia', 'psicólogo', 'estética', 'estetica',
  'odontologia', 'dentista', 'oficina', 'automotiv', 'fitness', 'academia', 'pilates', 'estúdio', 'massoterapia',
  'doceria', 'confeitaria', 'arquitetura', 'interiores', 'clínica', 'clinica'];

export const PRACA_PADRAO = ['salvador', 'lauro de freitas', 'camaçari', 'camacari', 'simões filho', 'simoes filho', 'candeias', "dias d'ávila"];

const REGULADOS = [
  [/odonto|dentist|implant|ortodont/i, 'CFO'],
  [/psicol|psicó|psico(?!d)|neuropsic/i, 'CFP'],
  [/m[eé]dic|cl[ií]nica m[eé]d|dermatolog|cardiolog|pediatr|ginecolog|oftalm/i, 'CFM'],
  [/nutri[cç]/i, 'CFN'],
  [/fisioterap/i, 'COFFITO'],
  [/advoca|advogad|jur[ií]dic/i, 'OAB'],
  [/contabil|contador/i, 'CFC'],
  [/veterin/i, 'CFMV'],
  [/farm[aá]cia|farmac[eê]ut/i, 'CFF'],
];

export function semAcento(s) {
  return String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function detectarRegulado(texto) {
  const t = String(texto || '');
  for (const [re, conselho] of REGULADOS) if (re.test(t)) return conselho;
  return null;
}

/** Só dígitos; celular/fixo BR ganha o 55 na frente. Nunca inventa o nono dígito. */
export function normalizarTelefone(v) {
  if (v == null) return null;
  let d = String(v).replace(/\D/g, '');
  if (!d) return null;
  if (d.startsWith('00')) d = d.slice(2);
  if (d.length === 10 || d.length === 11) d = '55' + d;
  if (d.length < 12 || d.length > 13) return d.length >= 8 ? d : null;
  return d;
}

/** Celular BR (tem cara de WhatsApp): 55 + DDD + 9 + 8 dígitos, ou 55 + DDD + 8 dígitos começando em 6-9 (conta antiga). */
export function pareceCelular(tel) {
  const d = normalizarTelefone(tel);
  if (!d || !d.startsWith('55')) return false;
  const local = d.slice(4);
  return (local.length === 9 && local.startsWith('9')) || (local.length === 8 && /^[6-9]/.test(local));
}

export function normalizarInstagram(v) {
  if (!v) return null;
  let s = String(v).trim();
  const m = s.match(/instagram\.com\/([A-Za-z0-9_.]+)/i);
  if (m) s = m[1];
  s = s.replace(/^@/, '').replace(/[/?#].*$/, '').trim();
  if (!/^[A-Za-z0-9_.]{2,30}$/.test(s)) return null;
  if (['p', 'reel', 'explore', 'stories'].includes(s.toLowerCase())) return null;
  return s.toLowerCase();
}

export function normalizarSite(v) {
  if (!v) return null;
  let s = String(v).trim();
  if (!s || /^(n[aã]o|sem|nenhum|-|n\/a|na)$/i.test(s)) return null;
  if (/instagram\.com|facebook\.com|wa\.me|whatsapp\.com|linktr\.ee|linkin\.bio/i.test(s)) return null;
  if (!/^https?:\/\//i.test(s)) s = 'https://' + s.replace(/^\/+/, '');
  try { const u = new URL(s); return u.hostname.includes('.') ? u.href.replace(/\/$/, '') : null; } catch { return null; }
}

function numero(v) {
  if (v == null || v === '') return null;
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  let s = String(v).trim().toLowerCase();
  let mult = 1;
  if (/mil\b|k$/.test(s)) { mult = 1000; s = s.replace(/mil\b|k$/g, ''); }
  if (/mi\b|m$/.test(s)) { mult = 1000000; s = s.replace(/mi\b|m$/g, ''); }
  s = s.replace(/[^\d,.-]/g, '');
  if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
  s = s.replace(',', '.');
  const n = parseFloat(s);
  return Number.isFinite(n) ? Math.round(n * mult * 10) / 10 : null;
}

function simNao(v) {
  if (v == null || v === '') return null;
  const s = semAcento(String(v)).trim().toLowerCase();
  if (/^(sim|s|yes|y|true|1|ativo|roda|rodando|tem)/.test(s)) return true;
  if (/^(nao|n|no|false|0|nenhum|sem|inativo)/.test(s)) return false;
  return null;
}

/** Converte a situação de site escrita livremente num dos status da casa. */
export function statusDoSite(texto, url) {
  const s = semAcento(String(texto || '')).toLowerCase();
  if (/fora|off|quebrad|nao abre|nao carrega|dns|expirad|caiu|morto|404|erro/.test(s)) return 'fora_do_ar';
  if (/ruim|feio|antigo|desatualiz|lento|amador|quebr/.test(s)) return 'ruim';
  if (/^(sem|nao tem|nao possui|inexistente|nenhum|nao)\b/.test(s) || /sem site|nao tem site|so instagram|apenas instagram/.test(s)) return 'sem';
  if (/ok|bom|no ar|funciona|ativo|profissional/.test(s)) return 'ok';
  if (url) return 'desconhecido';
  if (texto === '' || texto == null) return 'sem';
  return 'desconhecido';
}

/* ---------------------------- Leitura de planilha ---------------------------- */

const SINONIMOS = {
  nome: ['nome', 'empresa', 'nome_da_empresa', 'nome_empresa', 'negocio', 'estabelecimento', 'razao_social', 'nome_fantasia', 'title', 'name', 'lead', 'business'],
  categoria: ['categoria', 'nicho', 'segmento', 'ramo', 'tipo', 'category', 'atividade', 'especialidade'],
  cidade: ['cidade', 'municipio', 'city', 'localidade'],
  bairro: ['bairro', 'neighborhood', 'regiao', 'zona'],
  endereco: ['endereco', 'address', 'logradouro', 'localizacao', 'local'],
  telefone: ['telefone', 'fone', 'phone', 'tel', 'contato', 'telefone_fixo', 'numero'],
  whatsapp: ['whatsapp', 'whats', 'zap', 'celular', 'wa', 'whatsapp_link', 'link_whatsapp'],
  instagram: ['instagram', 'insta', 'ig', 'perfil_instagram', 'instagram_handle', 'arroba', 'perfil'],
  instagram_seguidores: ['seguidores', 'followers', 'instagram_seguidores', 'seguidores_instagram', 'n_seguidores', 'qtd_seguidores'],
  site: ['site', 'website', 'url', 'pagina', 'dominio', 'web', 'link_site', 'site_url'],
  site_status: ['situacao_site', 'status_site', 'tem_site', 'site_status', 'situacao_do_site', 'estado_site'],
  google_nota: ['nota', 'rating', 'nota_google', 'estrelas', 'avaliacao_media', 'google_rating', 'media'],
  google_avaliacoes: ['avaliacoes', 'reviews', 'num_avaliacoes', 'qtd_avaliacoes', 'total_avaliacoes', 'avaliacoes_google', 'numero_avaliacoes', 'reviews_count'],
  gmb_status: ['gmb', 'google_meu_negocio', 'perfil_google', 'ficha_google', 'perfil_empresa_google', 'google_business', 'status_gmb'],
  roda_anuncio: ['anuncio', 'anuncios', 'roda_anuncio', 'meta_ads', 'ads', 'trafego_pago', 'biblioteca_anuncios'],
  cnpj: ['cnpj'],
  decisor: ['dono', 'decisor', 'responsavel', 'proprietario', 'socio', 'contato_nome'],
  observacao: ['observacao', 'obs', 'notas', 'nota_interna', 'comentario', 'descricao', 'resumo', 'dor', 'oportunidade', 'motivo'],
  email: ['email', 'e_mail', 'mail'],
};

export function chaveCabecalho(h) {
  return semAcento(String(h || '')).toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

/** Sugere o mapeamento coluna→campo a partir dos cabeçalhos. */
export function mapearColunas(cabecalhos) {
  const mapa = {};
  const usadas = new Set();
  const chaves = cabecalhos.map(chaveCabecalho);
  for (const [campo, sins] of Object.entries(SINONIMOS)) {
    let idx = chaves.findIndex((k, i) => !usadas.has(i) && sins.includes(k));
    if (idx < 0) idx = chaves.findIndex((k, i) => !usadas.has(i) && sins.some((s) => k.startsWith(s + '_') || k.endsWith('_' + s)));
    if (idx >= 0) { mapa[campo] = cabecalhos[idx]; usadas.add(idx); }
  }
  return mapa;
}

/** Linha crua da planilha → item normalizado (sem inventar nada: vazio fica null). */
export function linhaParaItem(linha, mapa) {
  const pega = (campo) => {
    const col = mapa[campo];
    if (!col) return null;
    const v = linha[col];
    if (v == null) return null;
    const s = String(v).trim();
    return s === '' || /^\[?falta/i.test(s) ? null : s;
  };
  const site = normalizarSite(pega('site'));
  const temColunaSite = Boolean(mapa.site || mapa.site_status);
  const statusTxt = pega('site_status');
  let site_status = statusTxt ? statusDoSite(statusTxt, site) : (site ? 'desconhecido' : (temColunaSite ? 'sem' : 'desconhecido'));
  if (site_status === 'sem' && site) site_status = 'desconhecido';
  let whatsapp = normalizarTelefone(pega('whatsapp'));
  const telefone = normalizarTelefone(pega('telefone'));
  if (!whatsapp && telefone && pareceCelular(telefone)) whatsapp = telefone;
  const nota = numero(pega('google_nota'));
  return {
    nome: pega('nome'),
    categoria: pega('categoria'),
    cidade: pega('cidade'),
    bairro: pega('bairro'),
    endereco: pega('endereco'),
    telefone,
    whatsapp,
    instagram: normalizarInstagram(pega('instagram')),
    instagram_seguidores: numero(pega('instagram_seguidores')),
    site,
    site_status,
    google_nota: nota != null && nota <= 5 ? nota : null,
    google_avaliacoes: numero(pega('google_avaliacoes')),
    gmb_status: pega('gmb_status'),
    roda_anuncio: simNao(pega('roda_anuncio')),
    cnpj: pega('cnpj') ? pega('cnpj').replace(/\D/g, '') || null : null,
    decisor: pega('decisor'),
    email: pega('email'),
    observacao: pega('observacao'),
  };
}

/* ---------------------------------- Score ---------------------------------- */

/**
 * Calcula o potencial do lead a partir dos sinais que a lista trouxe.
 * Retorna { score, prioridade, motivos: [{sinal, pontos, detalhe}], regulado }.
 * Sinal desconhecido NÃO pontua (não se presume dor que não foi vista).
 */
export function pontuar(item, opcoes = {}) {
  const pesos = { ...PESOS_PADRAO, ...(opcoes.pesos || {}) };
  const nichos = opcoes.nichos || NICHOS_PADRAO;
  const praca = opcoes.praca || PRACA_PADRAO;
  const motivos = [];
  const add = (sinal, pontos, detalhe) => { if (pontos) motivos.push({ sinal, pontos: Math.round(pontos), detalhe }); };

  // 1) Sem site / fora do ar (a dor mais visível)
  if (item.site_status === 'sem') add('Sem site', pesos.sem_site, 'Quem procura no Google não acha um site próprio');
  else if (item.site_status === 'fora_do_ar') add('Site fora do ar', pesos.sem_site, 'Gancho verdadeiro: o link está quebrado');
  else if (item.site_status === 'ruim') add('Site fraco', pesos.sem_site / 2, 'Site existe, mas não converte');

  // 2) Prova de operação (movimento no Instagram ou avaliações no Google)
  const seg = Number(item.instagram_seguidores) || 0;
  const aval = Number(item.google_avaliacoes) || 0;
  let mov = 0; let movDet = '';
  if (seg >= 1000) { mov = pesos.instagram_movimento; movDet = `${seg.toLocaleString('pt-BR')} seguidores`; }
  else if (seg >= 300) { mov = pesos.instagram_movimento * 0.6; movDet = `${seg} seguidores`; }
  else if (seg > 0) { mov = pesos.instagram_movimento * 0.25; movDet = `${seg} seguidores`; }
  if (aval >= 30 && mov < pesos.instagram_movimento * 0.75) { mov = pesos.instagram_movimento * 0.75; movDet = `${aval} avaliações no Google`; }
  else if (aval >= 10 && mov < pesos.instagram_movimento * 0.5) { mov = pesos.instagram_movimento * 0.5; movDet = `${aval} avaliações no Google`; }
  add('Tem movimento', mov, movDet);

  // 3) Dono acessível / contato direto
  if (item.whatsapp && pareceCelular(item.whatsapp)) add('Contato direto', pesos.dono_acessivel, 'WhatsApp de celular disponível');
  else if (item.whatsapp || item.telefone) add('Tem telefone', pesos.dono_acessivel * 0.5, 'Só telefone (confirmar se é WhatsApp)');
  if (item.decisor) add('Decisor identificado', 3, item.decisor);

  // 4) Google Meu Negócio fraco/ausente
  const gmb = semAcento(String(item.gmb_status || '')).toLowerCase();
  if (/ausente|sem|nao tem|nao reivind|incomplet|bagunc|desatualiz|errad/.test(gmb)) add('Google fraco', pesos.gmb_fraco, item.gmb_status);
  else if (item.google_nota != null && item.google_nota < 4) add('Nota baixa no Google', pesos.gmb_fraco * 0.7, `nota ${item.google_nota}`);
  else if (item.google_avaliacoes != null && item.google_avaliacoes < 10) add('Poucas avaliações', pesos.gmb_fraco * 0.6, `${item.google_avaliacoes} avaliações`);

  // 5) Nicho que a Hórus já sabe atender
  const cat = semAcento(`${item.categoria || ''} ${item.nome || ''}`).toLowerCase();
  const nicho = nichos.find((n) => cat.includes(semAcento(n).toLowerCase()));
  if (nicho) add('Nicho conhecido', pesos.nicho_conhecido, `A casa já atende: ${nicho}`);

  // 6) Timing quente
  const txt = semAcento(`${item.observacao || ''} ${item.categoria || ''}`).toLowerCase();
  if (/inaugur|abriu agora|recem|nova unidade|novo endereco|acabou de abrir|expans|reforma|evento|lancamento/.test(txt)) {
    add('Timing quente', pesos.timing, 'Sinal de momento (abertura, expansão ou evento)');
  }

  // Extras pequenos e declarados
  const cidade = semAcento(`${item.cidade || ''} ${item.endereco || ''}`).toLowerCase();
  if (praca.some((p) => cidade.includes(semAcento(p).toLowerCase()))) add('Na praça', 5, 'Dá pra ir presencial (fecha mais no BR)');
  if (item.roda_anuncio === true) add('Já investe em anúncio', 5, 'Tem consciência e caixa pra marketing');

  let score = motivos.reduce((a, m) => a + m.pontos, 0);
  score = Math.max(0, Math.min(100, Math.round(score)));
  const prioridade = score >= 70 ? 'alta' : score >= 40 ? 'media' : 'baixa';
  const regulado = detectarRegulado(`${item.categoria || ''} ${item.nome || ''}`);
  return { score, prioridade, motivos, regulado };
}

/** Chave de deduplicação (mesmo negócio em listas diferentes). */
export function chaveDedupe(item) {
  if (item.whatsapp) return 'w:' + String(item.whatsapp).slice(-8);
  if (item.instagram) return 'i:' + item.instagram;
  return 'n:' + semAcento(`${item.nome || ''}|${item.cidade || ''}`).toLowerCase().replace(/[^a-z0-9|]/g, '');
}

/** Prompt pronto pra delegar o volume ao Gemini Spark (a ponte Spark → Sheets → Hound Dog). */
export function promptSpark({ nicho, cidade, quantidade = 60, foco = '' }) {
  return `Monte uma planilha no Google Sheets com até ${quantidade} negócios de "${nicho}" em ${cidade}.

Priorize negócios que têm movimento real (avaliações no Google, Instagram ativo) mas presença digital fraca: sem site, site fora do ar, ou ficha do Google incompleta.${foco ? `\nFoco extra: ${foco}.` : ''}

Use EXATAMENTE estas colunas, nesta ordem (uma linha por negócio):
nome | categoria | cidade | bairro | endereco | telefone | whatsapp | instagram | seguidores_instagram | site | situacao_site | nota_google | avaliacoes_google | perfil_google | roda_anuncio | cnpj | dono | observacao

Regras:
- NÃO invente nada. Se não encontrou o dado, deixe a célula vazia.
- whatsapp e telefone: número completo com DDD, só como aparece na fonte (não acrescente nem tire dígito).
- instagram: só o @ (sem link).
- situacao_site: "sem site", "fora do ar", "ruim" ou "ok".
- perfil_google: "completo", "incompleto" ou "ausente".
- roda_anuncio: "sim" ou "não" (confira na Biblioteca de Anúncios da Meta).
- observacao: 1 frase com a oportunidade mais visível (ex.: "site não abre", "abriu nova unidade").

No fim: Arquivo → Compartilhar → Publicar na web → formato CSV, e me passe o link.`;
}
