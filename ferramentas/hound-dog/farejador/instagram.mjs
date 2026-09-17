// =============================================================================
// Farejador — números do Instagram da Hórus.
// Dois caminhos: API oficial (Graph, conta profissional) ou leitura pública.
// ⚠️ Desde 2025 o Instagram exige sessão para a leitura pública; quando ela
// falha, o painel mostra o porquê e oferece registro manual.
// =============================================================================
import { q, q1 } from '../lib/db.mjs';
import { log } from './log.mjs';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';

/* ------------------------------ API oficial (Graph) ------------------------------ */
async function coletarGraph({ token, ig_user_id, handle }) {
  const campos = 'username,name,biography,followers_count,follows_count,media_count,profile_picture_url,website';
  const r = await fetch(`https://graph.facebook.com/v21.0/${ig_user_id}?fields=${campos}&access_token=${encodeURIComponent(token)}`);
  const perfil = await r.json();
  if (!r.ok) throw new Error(`API do Instagram: ${perfil?.error?.message || r.status}`);
  const rm = await fetch(`https://graph.facebook.com/v21.0/${ig_user_id}/media?fields=id,caption,like_count,comments_count,media_type,permalink,thumbnail_url,media_url,timestamp&limit=12&access_token=${encodeURIComponent(token)}`);
  const midia = await rm.json();
  const posts = (midia?.data || []).map((m) => ({
    shortcode: m.id, url: m.permalink, tipo: m.media_type === 'VIDEO' ? 'video' : m.media_type === 'CAROUSEL_ALBUM' ? 'carrossel' : 'imagem',
    legenda: m.caption || '', curtidas: m.like_count ?? null, comentarios: m.comments_count ?? null, views: null,
    data: m.timestamp || null, thumb: m.thumbnail_url || m.media_url || null,
  }));
  return montar({ handle: perfil.username || handle, nome: perfil.name, bio: perfil.biography, foto_url: perfil.profile_picture_url, link_externo: perfil.website,
    seguidores: perfil.followers_count, seguindo: perfil.follows_count, posts: perfil.media_count, ultimos_posts: posts, fonte: 'graph' });
}

/* ------------------------------ Leitura pública ------------------------------ */
async function coletarPublico(handle) {
  const home = await fetch('https://www.instagram.com/', { headers: { 'user-agent': UA, 'accept-language': 'pt-BR,pt;q=0.9' } }).catch(() => null);
  const cookies = (home?.headers?.getSetCookie?.() || []).map((c) => c.split(';')[0]).join('; ');
  const csrf = (cookies.match(/csrftoken=([^;]+)/) || [])[1] || '';
  const r = await fetch(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(handle)}`, {
    headers: {
      'user-agent': UA, 'x-ig-app-id': '936619743392459', 'x-csrftoken': csrf, cookie: cookies, accept: '*/*',
      'accept-language': 'pt-BR,pt;q=0.9', referer: `https://www.instagram.com/${handle}/`, 'x-requested-with': 'XMLHttpRequest',
      'x-asbd-id': '129477', 'x-ig-www-claim': '0', 'sec-fetch-site': 'same-origin',
    },
  });
  if (r.status === 404) throw new Error(`Perfil @${handle} não encontrado.`);
  if (r.status === 401 || r.status === 403) {
    const corpo = await r.text().catch(() => '');
    throw new Error(/require_login/.test(corpo)
      ? 'O Instagram passou a exigir login para ler perfil de fora. Conecte a API oficial em Ajustes → Instagram, ou registre os números manualmente.'
      : `O Instagram bloqueou a leitura (HTTP ${r.status}). Tente mais tarde ou use a API oficial.`);
  }
  if (!r.ok) throw new Error(`O Instagram respondeu ${r.status}.`);
  const j = await r.json();
  const u = j?.data?.user;
  if (!u) throw new Error('O Instagram respondeu sem os dados do perfil.');
  const posts = (u.edge_owner_to_timeline_media?.edges || []).map(({ node: n }) => ({
    shortcode: n.shortcode, url: `https://www.instagram.com/p/${n.shortcode}/`,
    tipo: n.is_video ? 'video' : n.__typename === 'GraphSidecar' ? 'carrossel' : 'imagem',
    legenda: n.edge_media_to_caption?.edges?.[0]?.node?.text || '',
    curtidas: n.edge_liked_by?.count ?? n.edge_media_preview_like?.count ?? null,
    comentarios: n.edge_media_to_comment?.count ?? null, views: n.video_view_count ?? null,
    data: n.taken_at_timestamp ? new Date(n.taken_at_timestamp * 1000).toISOString() : null,
    thumb: n.thumbnail_src || n.display_url || null,
  }));
  return montar({ handle, nome: u.full_name, bio: u.biography, foto_url: u.profile_pic_url_hd || u.profile_pic_url, link_externo: u.external_url,
    seguidores: u.edge_followed_by?.count, seguindo: u.edge_follow?.count, posts: u.edge_owner_to_timeline_media?.count, ultimos_posts: posts, fonte: 'publico' });
}

function montar(p) {
  const comNumeros = (p.ultimos_posts || []).filter((x) => x.curtidas != null);
  const mediaC = comNumeros.length ? comNumeros.reduce((a, x) => a + x.curtidas, 0) / comNumeros.length : null;
  const mediaCom = comNumeros.length ? comNumeros.reduce((a, x) => a + (x.comentarios || 0), 0) / comNumeros.length : null;
  return {
    ...p,
    media_curtidas: mediaC != null ? Math.round(mediaC * 10) / 10 : null,
    media_comentarios: mediaCom != null ? Math.round(mediaCom * 10) / 10 : null,
    engajamento: p.seguidores && mediaC != null ? Math.round(((mediaC + (mediaCom || 0)) / p.seguidores) * 10000) / 100 : null,
  };
}

export async function coletarPerfil(handle, cfg = {}) {
  if (cfg.token && cfg.ig_user_id) return coletarGraph({ ...cfg, handle });
  return coletarPublico(handle);
}

export async function salvarSnapshot(p) {
  await q(`insert into instagram_snapshots (handle, nome, bio, foto_url, link_externo, seguidores, seguindo, posts, media_curtidas, media_comentarios, engajamento, ultimos_posts, fonte)
           values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
  [p.handle, p.nome || null, p.bio || null, p.foto_url || null, p.link_externo || null, p.seguidores ?? null, p.seguindo ?? null, p.posts ?? null,
    p.media_curtidas ?? null, p.media_comentarios ?? null, p.engajamento ?? null, JSON.stringify(p.ultimos_posts || []), p.fonte || 'manual']);
  return p;
}

export async function coletarESalvar(handle, cfg = {}) {
  const p = await coletarPerfil(handle, cfg);
  await salvarSnapshot(p);
  log('instagram', `@${handle} (${p.fonte}): ${p.seguidores} seguidores, ${p.posts} posts, engajamento ${p.engajamento}%`);
  return p;
}

export async function precisaColetar(handle, horas = 6) {
  const ultimo = await q1('select coletado_em from instagram_snapshots where handle = $1 order by coletado_em desc limit 1', [handle]);
  if (!ultimo) return true;
  return Date.now() - new Date(ultimo.coletado_em).getTime() > horas * 3600000;
}
