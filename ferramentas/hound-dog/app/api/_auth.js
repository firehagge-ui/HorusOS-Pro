// Só operador do Hound Dog usa as funções: valida o token do Supabase contra a lista de operadores (RLS).
const SUPABASE_URL = 'https://zzkawmjpjhluiztemlmr.supabase.co';
const SUPABASE_KEY = 'sb_publishable_pMYFoXHwNknV8IOhtBF2Pg_yzLbIoth';

export async function exigirOperador(req) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return false;
  const r = await fetch(`${SUPABASE_URL}/rest/v1/operadores?select=user_id&limit=1`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` },
  });
  if (!r.ok) return false;
  const linhas = await r.json();
  return Array.isArray(linhas) && linhas.length > 0;
}

/** Aceita só URL pública http(s): bloqueia rede interna (evita SSRF). */
export function urlPublicaSegura(bruta) {
  let u;
  try { u = new URL(bruta); } catch { return null; }
  if (!['http:', 'https:'].includes(u.protocol)) return null;
  const h = u.hostname.toLowerCase();
  if (h === 'localhost' || h.endsWith('.local') || h.endsWith('.internal')
    || /^(127\.|10\.|192\.168\.|169\.254\.|0\.)/.test(h) || /^172\.(1[6-9]|2\d|3[01])\./.test(h)
    || h === '[::1]' || h.startsWith('[fc') || h.startsWith('[fd') || h === 'metadata.google.internal') return null;
  return u;
}
