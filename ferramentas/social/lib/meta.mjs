// =============================================================================
// Adaptador da API do Instagram (caminho "Instagram Login", graph.instagram.com).
// Não precisa de Página do Facebook. Sem dependência externa: só fetch do Node 20+.
//
// Regras deste arquivo (ver ARQUITETURA.md, seção 4.6):
// - Erro sempre classificado (auth, permissao, parametro, limite, transitorio).
//   Só limite e transitório tentam de novo.
// - Publicar é idempotente na prática: se a chamada final falhar, confere o container
//   antes de repetir, para nunca postar duas vezes.
// - Métrica que a Meta aposentou é descartada e registrada, sem derrubar a coleta.
// - O token nunca aparece em mensagem de erro nem em log.
// =============================================================================

export const VERSAO_PADRAO = 'v24.0';
const BASE = 'https://graph.instagram.com';

/* ------------------------------ erros ------------------------------ */

export class ErroMeta extends Error {
  constructor(mensagem, { tipo, status = null, codigo = null, subcodigo = null, bruto = null } = {}) {
    super(mensagem);
    this.name = 'ErroMeta';
    this.tipo = tipo;           // auth | permissao | parametro | limite | transitorio
    this.status = status;
    this.codigo = codigo;
    this.subcodigo = subcodigo;
    this.bruto = bruto;
  }
  get repetivel() { return this.tipo === 'limite' || this.tipo === 'transitorio'; }
}

const CODIGOS_LIMITE = new Set([4, 9, 17, 32, 613, 80002]);

/** Traduz a resposta de erro da Graph API numa classe que o motor sabe tratar. */
export function classificarErro(status, corpo) {
  const e = corpo?.error || {};
  const codigo = e.code ?? null;
  const subcodigo = e.error_subcode ?? null;
  const texto = e.error_user_msg || e.message || `HTTP ${status}`;
  let tipo;
  if (codigo === 190 || status === 401) tipo = 'auth';
  else if (CODIGOS_LIMITE.has(codigo) || status === 429) tipo = 'limite';
  else if (codigo === 10 || (codigo >= 200 && codigo <= 299)) tipo = 'permissao';
  else if (e.is_transient === true || codigo === 1 || codigo === 2 || status >= 500) tipo = 'transitorio';
  else tipo = 'parametro';
  return new ErroMeta(`API do Instagram (${tipo}${codigo != null ? `, código ${codigo}` : ''}): ${texto}`, { tipo, status, codigo, subcodigo, bruto: e });
}

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------ cliente ------------------------------ */

/**
 * Cria um cliente da API para uma conta.
 * @param {object} op
 * @param {string} op.token       token de acesso da conta (60 dias, renovável)
 * @param {string} [op.userId]    id da conta profissional; se faltar, usa "me"
 * @param {string} [op.versao]
 * @param {Function} [op.fetch]   injetável nos testes
 * @param {number} [op.tentativas] tentativas para erro repetível
 * @param {number} [op.esperaBaseMs]
 * @param {Function} [op.aoRegistrar] recebe { evento, ... } para o log de ações
 */
export function criarCliente({
  token, userId = 'me', versao = VERSAO_PADRAO, fetch: f = globalThis.fetch,
  tentativas = 3, esperaBaseMs = 2000, aoRegistrar = () => {},
} = {}) {
  if (!token) throw new ErroMeta('Token do Instagram ausente.', { tipo: 'auth' });

  const esconder = (s) => String(s).split(token).join('***');

  async function chamar(metodo, caminho, params = {}, { repetir = true } = {}) {
    const url = new URL(`${BASE}/${versao}/${caminho.replace(/^\//, '')}`);
    const corpo = new URLSearchParams();
    const alvo = metodo === 'GET' ? url.searchParams : corpo;
    for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== null) alvo.set(k, String(v));
    url.searchParams.set('access_token', token);

    const maximo = repetir ? tentativas : 1;
    for (let i = 1; ; i++) {
      let resposta, json;
      try {
        resposta = await f(url, { method: metodo, body: metodo === 'GET' ? undefined : corpo });
        json = await resposta.json().catch(() => ({}));
      } catch (e) {
        const erro = new ErroMeta(`Falha de rede falando com o Instagram: ${esconder(e.message)}`, { tipo: 'transitorio' });
        if (i >= maximo) throw erro;
        aoRegistrar({ evento: 'retentativa', caminho, tentativa: i, motivo: erro.message });
        await esperar(esperaBaseMs * 2 ** (i - 1));
        continue;
      }
      if (resposta.ok && !json?.error) return json;
      const erro = classificarErro(resposta.status, json);
      erro.message = esconder(erro.message);
      if (!erro.repetivel || i >= maximo) throw erro;
      aoRegistrar({ evento: 'retentativa', caminho, tentativa: i, motivo: erro.message });
      await esperar(esperaBaseMs * 2 ** (i - 1) * (erro.tipo === 'limite' ? 5 : 1));
    }
  }

  /** Pede métricas; se a Meta recusar alguma por nome, tira essa e pede o resto. */
  async function metricasTolerantes(caminho, metricas, extras = {}) {
    let restantes = [...metricas];
    const descartadas = [];
    while (restantes.length) {
      try {
        const r = await chamar('GET', caminho, { metric: restantes.join(','), ...extras });
        return { valores: normalizarInsights(r.data), descartadas };
      } catch (e) {
        if (e.tipo !== 'parametro') throw e;
        const culpada = restantes.find((m) => new RegExp(`\\b${m}\\b`).test(e.message));
        if (!culpada) throw e;
        restantes = restantes.filter((m) => m !== culpada);
        descartadas.push(culpada);
        aoRegistrar({ evento: 'metrica_descartada', caminho, metrica: culpada, motivo: e.message });
      }
    }
    return { valores: {}, descartadas };
  }

  /* -------- leitura -------- */

  const CAMPOS_PERFIL = 'user_id,username,name,account_type,biography,website,profile_picture_url,followers_count,follows_count,media_count';
  const CAMPOS_MIDIA = 'id,caption,media_type,media_product_type,permalink,timestamp,like_count,comments_count,media_url,thumbnail_url';

  async function perfil() {
    return chamar('GET', userId, { fields: CAMPOS_PERFIL });
  }

  async function midias({ limite = 25, depois } = {}) {
    const r = await chamar('GET', `${userId}/media`, { fields: CAMPOS_MIDIA, limit: limite, after: depois });
    return { itens: r.data || [], proximo: r.paging?.cursors?.after && r.paging?.next ? r.paging.cursors.after : null };
  }

  async function midia(id) {
    return chamar('GET', id, { fields: `${CAMPOS_MIDIA},children{id,media_type,media_url}` });
  }

  /** Métricas de um post. `tipo` vem de media_product_type (FEED, REELS, STORY). */
  async function metricasMidia(id, tipo = 'FEED') {
    return metricasTolerantes(`${id}/insights`, METRICAS_MIDIA[tipo] || METRICAS_MIDIA.FEED);
  }

  /** Métricas da conta no intervalo (no máximo 30 dias por chamada, regra da Meta). */
  async function metricasConta({ desde, ate } = {}) {
    const agora = Math.floor(Date.now() / 1000);
    const ateS = ate ? Math.floor(new Date(ate).getTime() / 1000) : agora;
    const desdeS = desde ? Math.floor(new Date(desde).getTime() / 1000) : ateS - 7 * 86400;
    if (ateS - desdeS > 30 * 86400) throw new ErroMeta('Intervalo acima de 30 dias: divida em janelas menores.', { tipo: 'parametro' });
    return metricasTolerantes(`${userId}/insights`, METRICAS_CONTA, { period: 'day', metric_type: 'total_value', since: desdeS, until: ateS });
  }

  async function comentarios(mediaId, { limite = 50 } = {}) {
    const r = await chamar('GET', `${mediaId}/comments`, { fields: 'id,text,timestamp,username,like_count,hidden,replies{id,text,timestamp,username}', limit: limite });
    return r.data || [];
  }

  /** Conversas de DM (só quem escreveu primeiro; a Meta não deixa iniciar). */
  async function conversas({ limite = 20 } = {}) {
    const r = await chamar('GET', `${userId}/conversations`, {
      platform: 'instagram', limit: limite,
      fields: 'id,updated_time,participants,messages.limit(5){id,message,from,created_time}',
    });
    return r.data || [];
  }

  async function cotaPublicacao() {
    const r = await chamar('GET', `${userId}/content_publishing_limit`, { fields: 'config,quota_usage' });
    const d = r.data?.[0] || {};
    return { usadas: d.quota_usage ?? null, total: d.config?.quota_total ?? null, janelaS: d.config?.quota_duration ?? null };
  }

  /* -------- escrita (quem decide se pode é a política, não este arquivo) -------- */

  async function responderComentario(comentarioId, texto) {
    return chamar('POST', `${comentarioId}/replies`, { message: texto }, { repetir: false });
  }

  async function ocultarComentario(comentarioId, ocultar = true) {
    return chamar('POST', comentarioId, { hide: ocultar }, { repetir: false });
  }

  async function aguardarContainer(id, { limiteMs = 5 * 60 * 1000, intervaloMs = 3000 } = {}) {
    const fim = Date.now() + limiteMs;
    for (;;) {
      const r = await chamar('GET', id, { fields: 'status_code,status' });
      if (r.status_code === 'FINISHED' || r.status_code === 'PUBLISHED') return r.status_code;
      if (r.status_code === 'ERROR' || r.status_code === 'EXPIRED') {
        throw new ErroMeta(`A Meta recusou a mídia (${r.status_code}): ${r.status || 'sem detalhe'}`, { tipo: 'parametro', bruto: r });
      }
      if (Date.now() > fim) throw new ErroMeta(`Container ${id} não ficou pronto em ${Math.round(limiteMs / 1000)} s.`, { tipo: 'transitorio' });
      await esperar(intervaloMs);
    }
  }

  async function criarContainer(params) {
    const r = await chamar('POST', `${userId}/media`, params, { repetir: false });
    return r.id;
  }

  /**
   * Passo final. Se falhar por motivo repetível, confere o container: se já publicou,
   * recupera o post pela legenda em vez de publicar de novo.
   */
  async function publicarContainer(containerId, legenda) {
    try {
      const r = await chamar('POST', `${userId}/media_publish`, { creation_id: containerId }, { repetir: false });
      return r.id;
    } catch (e) {
      if (!e.repetivel) throw e;
      const estado = await chamar('GET', containerId, { fields: 'status_code' }).catch(() => null);
      if (estado?.status_code === 'PUBLISHED') {
        const { itens } = await midias({ limite: 5 });
        const achado = itens.find((m) => (m.caption || '') === (legenda || ''));
        if (achado) { aoRegistrar({ evento: 'publicacao_recuperada', containerId, mediaId: achado.id }); return achado.id; }
        throw new ErroMeta('O container consta como publicado, mas o post não foi encontrado. Conferir o perfil antes de repetir.', { tipo: 'parametro' });
      }
      aoRegistrar({ evento: 'retentativa', caminho: 'media_publish', tentativa: 1, motivo: e.message });
      await esperar(esperaBaseMs);
      const r = await chamar('POST', `${userId}/media_publish`, { creation_id: containerId }, { repetir: false });
      return r.id;
    }
  }

  async function concluir(containerId, legenda, { simular }) {
    await aguardarContainer(containerId);
    if (simular) return { simulado: true, containerId };
    const mediaId = await publicarContainer(containerId, legenda);
    const info = await chamar('GET', mediaId, { fields: 'permalink,timestamp' }).catch(() => ({}));
    if (!info.permalink) aoRegistrar({ evento: 'sem_permalink', mediaId });
    return { mediaId, permalink: info.permalink || null, publicadoEm: info.timestamp || null, containerId };
  }

  /** Validação antes de qualquer chamada: o que a Meta recusaria, recusamos antes. */
  function validar({ urls, legenda = '' }, { min = 1, max = 10 } = {}) {
    if (!Array.isArray(urls) || urls.length < min || urls.length > max) throw new ErroMeta(`Quantidade de mídias fora do limite (${min} a ${max}).`, { tipo: 'parametro' });
    for (const u of urls) if (!/^https:\/\//.test(u)) throw new ErroMeta(`A Meta exige URL pública em https: ${u}`, { tipo: 'parametro' });
    if (legenda.length > 2200) throw new ErroMeta(`Legenda com ${legenda.length} caracteres (máximo 2.200).`, { tipo: 'parametro' });
    if ((legenda.match(/#[\p{L}\p{N}_]+/gu) || []).length > 30) throw new ErroMeta('Mais de 30 hashtags.', { tipo: 'parametro' });
  }

  async function publicarImagem({ url, legenda = '', simular = false }) {
    validar({ urls: [url], legenda });
    const id = await criarContainer({ image_url: url, caption: legenda });
    return concluir(id, legenda, { simular });
  }

  async function publicarCarrossel({ urls, legenda = '', simular = false }) {
    validar({ urls, legenda }, { min: 2, max: 10 });
    const filhos = [];
    for (const url of urls) {
      const video = /\.(mp4|mov)(\?|$)/i.test(url);
      filhos.push(await criarContainer(video ? { media_type: 'VIDEO', video_url: url, is_carousel_item: true } : { image_url: url, is_carousel_item: true }));
    }
    for (const f of filhos) await aguardarContainer(f);
    const id = await criarContainer({ media_type: 'CAROUSEL', children: filhos.join(','), caption: legenda });
    return concluir(id, legenda, { simular });
  }

  async function publicarReel({ url, legenda = '', capaUrl, noFeed = true, simular = false }) {
    validar({ urls: [url], legenda });
    const id = await criarContainer({ media_type: 'REELS', video_url: url, caption: legenda, cover_url: capaUrl, share_to_feed: noFeed });
    return concluir(id, legenda, { simular });
  }

  async function publicarStory({ url, simular = false }) {
    validar({ urls: [url] });
    const video = /\.(mp4|mov)(\?|$)/i.test(url);
    const id = await criarContainer(video ? { media_type: 'STORIES', video_url: url } : { media_type: 'STORIES', image_url: url });
    return concluir(id, '', { simular });
  }

  /** Renova o token (vale 60 dias; só renova depois de 24 h de emitido). */
  async function renovarToken() {
    const url = new URL(`${BASE}/refresh_access_token`);
    url.searchParams.set('grant_type', 'ig_refresh_token');
    url.searchParams.set('access_token', token);
    const r = await f(url, { method: 'GET' });
    const json = await r.json().catch(() => ({}));
    if (!r.ok || json.error) { const e = classificarErro(r.status, json); e.message = esconder(e.message); throw e; }
    return { token: json.access_token, expiraEm: new Date(Date.now() + (json.expires_in || 0) * 1000).toISOString() };
  }

  return {
    perfil, midias, midia, metricasMidia, metricasConta, comentarios, conversas, cotaPublicacao,
    responderComentario, ocultarComentario,
    publicarImagem, publicarCarrossel, publicarReel, publicarStory, renovarToken,
    _chamar: chamar,
  };
}

/* ------------------------------ métricas ------------------------------ */

// Nomes em vigor em set/2026. Se a Meta aposentar algum, a coleta descarta e registra.
export const METRICAS_MIDIA = {
  FEED: ['reach', 'views', 'likes', 'comments', 'shares', 'saved', 'total_interactions', 'follows', 'profile_visits'],
  REELS: ['reach', 'views', 'likes', 'comments', 'shares', 'saved', 'total_interactions', 'ig_reels_avg_watch_time', 'ig_reels_video_view_total_time'],
  STORY: ['reach', 'views', 'replies', 'shares', 'follows', 'profile_visits', 'total_interactions', 'navigation'],
};

export const METRICAS_CONTA = ['reach', 'views', 'accounts_engaged', 'total_interactions', 'likes', 'comments', 'shares', 'saves', 'replies', 'profile_links_taps', 'follows_and_unfollows'];

/** Converte a resposta de insights em { metrica: número }. */
export function normalizarInsights(data = []) {
  const saida = {};
  for (const item of data) {
    // follows_and_unfollows e navigation vêm quebrados por tipo, ao lado do total
    const partes = item.total_value?.breakdowns?.[0]?.results;
    if (partes) for (const p of partes) saida[`${item.name}.${(p.dimension_values || []).join('.')}`] = p.value;
    let v = item.total_value?.value;
    if (v === undefined) v = item.values?.[item.values.length - 1]?.value;
    if (v !== null && typeof v === 'object') v = Object.values(v).reduce((a, b) => a + (Number(b) || 0), 0);
    saida[item.name] = typeof v === 'number' ? v : Number(v ?? 0);
  }
  return saida;
}
