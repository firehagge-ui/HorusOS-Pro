// Motor de busca no Google Maps. Mesmo método do MazyOS Scraper (fork do gosom, licença MIT):
// abre a busca, rola a lista, entra em cada ficha e lê os dados que a própria página carrega.
// Roda em Playwright com o Chrome instalado. Usado pelo scraper local e pelo Farejador do Hounder.
import { chromium } from 'playwright';

// O Google só entrega a ficha completa (número de avaliações, comentários) para este agente.
// É o mesmo que o programa original usa; com o agente atual vem a "visão limitada".
export const AGENTE = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
export const PROFUNDIDADE = { 20: 2, 60: 5, 120: 10, 200: 18 };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const LER_ESTADO = `(function(){if(!window.APP_INITIALIZATION_STATE||!window.APP_INITIALIZATION_STATE[3])return null;const a=window.APP_INITIALIZATION_STATE[3];for(const k of Object.keys(a)){const r=a[k];if(Array.isArray(r))for(const i of [6,5]){const it=r[i];if(typeof it==='string'&&it.startsWith(")]}'"))return it}}return null})()`;
const SITE_DE_REDE = /instagram|facebook|wa\.me|linktr|cobasi|petz/i;
const g = (a, ...p) => { let x = a; for (const i of p) { if (!Array.isArray(x)) return undefined; x = x[i]; } return x; };
const primeiro = (...v) => v.find((x) => x !== undefined && x !== null && x !== '');

function urlReal(u) {
  if (!u) return '';
  const m = u.match(/[?&]q=(https?[^&]+)/);
  return m ? decodeURIComponent(m[1]) : u;
}
function lerHoras(d) {
  const itens = g(d, 203, 0) || g(d, 34, 1) || [];
  const horas = {};
  for (const i of Array.isArray(itens) ? itens : []) {
    const dia = g(i, 0);
    const faixas = g(i, 3);
    if (typeof dia === 'string') horas[dia] = Array.isArray(faixas) ? faixas.map((f) => g(f, 0)).filter(Boolean) : [];
  }
  return horas;
}
function lerComentarios(d) {
  let lista = g(d, 175, 9, 0, 0);
  if (!Array.isArray(lista) || !lista.length) lista = g(d, 175, 9, 0) || [];
  return lista.map((x) => {
    const el = Array.isArray(g(x, 0)) ? g(x, 0) : x;
    return {
      nome: primeiro(g(el, 1, 4, 5, 0), g(el, 1, 4, 4), g(el, 0, 1)) || '',
      nota: Number(primeiro(g(el, 2, 0, 0), g(el, 2, 0), g(el, 1, 0, 0))) || 0,
      texto: primeiro(g(el, 2, 15, 0, 0), g(el, 2, 15, 0), g(el, 3, 0)) || '',
      quando: primeiro(g(el, 1, 6), g(el, 3, 3)) || '',
    };
  }).filter((c) => c.texto || c.nota);
}
function lerFotos(d) {
  return (g(d, 171, 0) || []).map((i) => g(i, 3, 0, 6, 0)).filter((u) => typeof u === 'string' && /^https?:/.test(u)).slice(0, 8);
}

/** Lê o texto que a página carrega e devolve a ficha no formato do scraper original. */
export function lerFicha(texto, link) {
  const d = JSON.parse(texto.replace(/^\)\]\}'\s*/, ''))[6];
  if (!Array.isArray(d) || !g(d, 11)) return null;
  const categorias = (g(d, 13) || []).filter((c) => typeof c === 'string');
  return {
    title: g(d, 11), link, category: categorias[0] || '', categories: categorias,
    address: String(g(d, 18) || '').replace(`${g(d, 11)}, `, ''), website: urlReal(g(d, 7, 0)), phone: g(d, 178, 0, 0) || '',
    review_rating: g(d, 4, 7) || 0, review_count: g(d, 4, 8) || 0,
    latitude: g(d, 9, 2) || 0, longitude: g(d, 9, 3) || 0,
    borough: g(d, 183, 1, 0) || '', street: g(d, 183, 1, 1) || '', city: g(d, 183, 1, 3) || '', postal_code: g(d, 183, 1, 4) || '', state: g(d, 183, 1, 5) || '',
    status: primeiro(g(d, 88, 0), g(d, 34, 4, 4)) || '', descriptions: g(d, 32, 1, 1) || '', thumbnail: g(d, 72, 0, 1, 6, 0) || '',
    place_id: primeiro(g(d, 78), g(d, 10)) || '', owner: g(d, 57, 1) || '', open_hours: lerHoras(d),
    user_reviews: lerComentarios(d), images: lerFotos(d), emails: '',
  };
}

async function lerLista(pagina, termo, { lat, lon, zoom, lang = 'pt' }, profundidade, prazo) {
  const consulta = encodeURIComponent(termo).replace(/%20/g, '+');
  const local = lat && lon ? `/@${lat},${lon},${zoom || 13}z` : '';
  await pagina.goto(`https://www.google.com/maps/search/${consulta}${local}?hl=${lang}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  if (/\/sorry\//.test(pagina.url())) throw new Error('O Google pediu captcha. Espere algumas horas e reduza o volume.');
  await pagina.waitForSelector('a.hfpxzc, h1', { timeout: 30000 });
  const lista = pagina.locator('div[role="feed"]');
  if (!(await lista.count())) return [pagina.url()];
  let parado = 0, antes = 0;
  for (let i = 0; i < profundidade && parado < 2 && Date.now() < prazo; i++) {
    await lista.evaluate((e) => e.scrollTo(0, e.scrollHeight));
    await sleep(2200);
    const agora = await pagina.$$eval('a.hfpxzc', (a) => a.length);
    parado = agora === antes ? parado + 1 : 0;
    antes = agora;
  }
  return pagina.$$eval('a.hfpxzc', (a) => a.map((x) => x.href));
}

export async function lerEmails(site) {
  if (!site || SITE_DE_REDE.test(site)) return '';
  try {
    const html = await (await fetch(site, { signal: AbortSignal.timeout(9000), headers: { 'user-agent': AGENTE } })).text();
    const achados = (html.match(/[\w.+-]+@[\w-]+\.[a-z.]{2,}/gi) || []).filter((x) => !/\.(png|jpe?g|webp|svg|gif)$|sentry|example|wixpress|godaddy/i.test(x));
    return [...new Set(achados)].slice(0, 3).join(', ');
  } catch { return ''; }
}

/**
 * Busca no Maps. `termos` já vêm prontos ("pet shop em Pituba, Salvador").
 * aoAchar(ficha) é chamado a cada empresa nova; deveParar() encerra no meio.
 */
export async function buscarNoMaps({ termos, lat, lon, zoom, lang = 'pt', profundidade = 2, limite = 0, emails = false, abas = 4, prazoMs = 15 * 60000, aoAchar = () => {}, aoProgresso = () => {}, deveParar = async () => false }) {
  const prazo = Date.now() + prazoMs;
  const vistos = new Set();
  let achadas = 0;
  const navegador = await chromium.launch({ headless: true, channel: 'chrome', args: ['--disable-blink-features=AutomationControlled'] });
  try {
    const contexto = await navegador.newContext({ locale: 'pt-BR', userAgent: AGENTE, viewport: { width: 1920, height: 1080 } });
    const principal = await contexto.newPage();
    for (const termo of termos) {
      if (Date.now() > prazo || (limite && achadas >= limite) || await deveParar()) break;
      await aoProgresso(`Lendo a lista: ${termo}`);
      const links = await lerLista(principal, termo, { lat, lon, zoom, lang }, profundidade, prazo);
      let proximo = 0;
      const trabalhar = async () => {
        const aba = await contexto.newPage();
        while (proximo < links.length && Date.now() < prazo && !(limite && achadas >= limite)) {
          if (await deveParar()) break;
          const link = links[proximo++];
          let bruto = null;
          for (let tentativa = 0; tentativa < 2 && !bruto; tentativa++) {
            try {
              await aba.goto(`${link}${link.includes('?') ? '&' : '?'}hl=${lang}`, { waitUntil: 'domcontentloaded', timeout: 40000 });
              for (let i = 0; i < 20 && !bruto; i++) { bruto = await aba.evaluate(LER_ESTADO).catch(() => null); if (!bruto) await sleep(300); }
            } catch { /* tenta de novo no próximo giro */ }
          }
          if (!bruto) continue;
          let ficha = null;
          try { ficha = lerFicha(bruto, link); } catch { ficha = null; }
          const chave = ficha && (ficha.place_id || `${ficha.title}${ficha.phone}`);
          if (!ficha || vistos.has(chave)) continue;
          vistos.add(chave);
          if (emails) ficha.emails = await lerEmails(ficha.website);
          achadas++;
          await aoAchar(ficha);
        }
        await aba.close();
      };
      await Promise.all(Array.from({ length: abas }, trabalhar));
      await aoProgresso(`${achadas} empresas lidas`);
    }
  } finally {
    await navegador.close().catch(() => {});
  }
  return { achadas };
}
