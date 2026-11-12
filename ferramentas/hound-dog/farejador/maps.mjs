// Busca no Google Maps pelo botão do painel, sem Claude (pedido do Marcelo, 10/11/2026).
// Usa o mesmo motor do scraper local (ferramentas/maps-local/motor.mjs) e grava cada empresa
// numa lista do Hounder conforme acha. A triagem, o funil e o resto seguem como antes.
import { buscarNoMaps, PROFUNDIDADE } from '../../maps-local/motor.mjs';
import { q, q1 } from '../lib/db.mjs';
import { adicionarItensLista } from '../lib/crm.mjs';

const REDE = /instagram\.com|facebook\.com|fb\.com|wa\.me|linktr\.ee/i;
let ocupado = false;

const digitos = (t) => String(t || '').replace(/\D/g, '');
function celular(t) {
  let d = digitos(t).replace(/^0+/, '');
  if (d.startsWith('55')) d = d.slice(2);
  return d.length === 11 && d[2] === '9' ? `55${d}` : null;
}
function handleInstagram(url) {
  const m = String(url || '').match(/instagram\.com\/([\w.]+)/i);
  return m && !/^(p|reel|explore|stories)$/i.test(m[1]) ? m[1] : null;
}
function distanciaKm(a, b, c, d) {
  const r = (x) => (x * Math.PI) / 180;
  const h = Math.sin(r(c - a) / 2) ** 2 + Math.cos(r(a)) * Math.cos(r(c)) * Math.sin(r(d - b) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}

/** Confere se o site abre. Erro de rede, 404 ou 5xx = fora do ar. 403 conta como no ar (bloqueio de robô). */
async function situacaoDoSite(site) {
  if (!site) return 'sem';
  if (REDE.test(site)) return 'sem';
  try {
    const r = await fetch(site, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(9000), headers: { 'user-agent': 'Mozilla/5.0' } });
    if (r.status === 404 || r.status === 410 || r.status >= 500) return 'fora_do_ar';
    return 'ok';
  } catch { return 'fora_do_ar'; }
}

function paraItem(f, { lat, lon }) {
  const rede = REDE.test(f.website || '');
  const zap = celular(f.phone);
  return {
    nome: f.title, categoria: f.category || null, cidade: f.city || null, bairro: f.borough || null, endereco: f.address || null,
    telefone: digitos(f.phone).replace(/^0+/, '') || null, whatsapp: zap, instagram: handleInstagram(f.website),
    site: f.website || null, google_nota: f.review_rating || null, google_avaliacoes: f.review_count || null,
    origem: 'maps',
    dados: {
      latitude: f.latitude, longitude: f.longitude, link: f.link, place_id: f.place_id, categorias: f.categories,
      horarios: f.open_hours, dono_no_google: f.owner || null, descricao: f.descriptions || null, fotos: f.images,
      comentarios: (f.user_reviews || []).slice(0, 5), so_rede_social: rede, emails: f.emails || null, status_google: f.status || null,
      distancia_km: lat && lon && f.latitude ? Math.round(distanciaKm(Number(lat), Number(lon), f.latitude, f.longitude) * 10) / 10 : null,
    },
  };
}

export async function buscarMaps(job, progresso, cancelado) {
  if (ocupado) {
    const e = new Error('Outra busca no Maps está rodando. Esta começa em seguida.');
    e.retomarEm = new Date(Date.now() + 60000);
    throw e;
  }
  ocupado = true;
  try {
    const { nicho, cidade, quantidade = 20, lat = null, lon = null, raio = 5, emails = false } = job.entrada || {};
    if (!nicho || !cidade) throw new Error('Faltou o que procurar ou onde.');
    let lista = job.saida?.lista_id ? await q1('select * from listas where id = $1', [job.saida.lista_id]) : null;
    if (!lista) {
      lista = await q1(`insert into listas (nome, origem, nicho, cidade, status, job_id, criado_por, observacao) values ($1,'maps',$2,$3,'processando',$4,$5,$6) returning *`,
        [`Maps · ${nicho} · ${cidade} · ${new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Bahia' })}`, nicho, cidade, job.id, job.criado_por || 'painel', `Raio de ${raio} km`]);
      await q('update jobs set saida = $2, lista_id = $3 where id = $1', [job.id, JSON.stringify({ lista_id: lista.id }), lista.id]);
    }
    const termos = String(nicho).split(',').map((s) => s.trim()).filter(Boolean).map((n) => `${n} em ${cidade}`);
    const zoom = raio <= 2 ? 15 : raio <= 5 ? 14 : raio <= 10 ? 13 : raio <= 20 ? 12 : 11;
    let lote = [], salvos = 0;
    const gravar = async () => {
      if (!lote.length) return;
      const agora = lote; lote = [];
      for (const it of agora) it.site_status = it.dados.so_rede_social ? 'sem' : await situacaoDoSite(it.site);
      const r = await adicionarItensLista(lista.id, agora);
      salvos += r.inseridos;
      await progresso(`${salvos} empresas salvas`);
    };
    await buscarNoMaps({
      termos, lat, lon, zoom, profundidade: PROFUNDIDADE[quantidade] || 2, limite: quantidade >= 200 ? 250 : Number(quantidade) || 20, emails: Boolean(emails),
      aoProgresso: progresso, deveParar: cancelado,
      aoAchar: async (f) => { lote.push(paraItem(f, { lat, lon })); if (lote.length >= 5) await gravar(); },
    });
    await gravar();
    const total = (await q1('select count(*)::int n from lista_itens where lista_id = $1', [lista.id])).n;
    await q("update listas set status = 'pronta', total = $2 where id = $1", [lista.id, total]);
    if (!total) throw new Error('O Maps não devolveu nenhuma empresa. Tente outro termo ou um bairro maior.');
    return { lista_id: lista.id, total };
  } catch (e) {
    if (job.saida?.lista_id || e.retomarEm) throw e;
    const l = await q1('select id from listas where job_id = $1', [job.id]).catch(() => null);
    if (l) await q("update listas set status = 'erro', observacao = $2 where id = $1", [l.id, String(e.message).slice(0, 200)]).catch(() => {});
    throw e;
  } finally {
    ocupado = false;
  }
}
