// Tela original do MazyOS Scraper com motor em Playwright e o Chrome instalado.
// O programa dele é bloqueado pelo Windows do Marcelo (sem assinatura digital).
// Este servidor responde a mesma API, então a tela e a skill prospecta-maps funcionam sem mudança.
// Uso, na raiz do HorusOS: npm run scraper
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { buscarNoMaps } from './motor.mjs';

const RAIZ = path.dirname(fileURLToPath(import.meta.url));
const WEB = path.join(RAIZ, 'web', 'static');
const DADOS = path.join(RAIZ, 'dados');
const ARQ_JOBS = path.join(DADOS, 'jobs.json');
const PORTA = Number(process.env.PORTA || 8080);
const API = '/api/v1/jobs';
const TIPOS = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png' };

fs.mkdirSync(DADOS, { recursive: true });
const arqPlaces = (id) => path.join(DADOS, `${id}.json`);
const jobs = fs.existsSync(ARQ_JOBS) ? JSON.parse(fs.readFileSync(ARQ_JOBS, 'utf8')) : [];
const places = new Map();
for (const j of jobs) {
  if (['pending', 'working'].includes(j.Status)) j.Status = 'failed';
  places.set(j.ID, fs.existsSync(arqPlaces(j.ID)) ? JSON.parse(fs.readFileSync(arqPlaces(j.ID), 'utf8')) : []);
}
function salvar(job) {
  fs.writeFileSync(ARQ_JOBS, JSON.stringify(jobs));
  if (job && places.has(job.ID)) fs.writeFileSync(arqPlaces(job.ID), JSON.stringify(places.get(job.ID)));
}

/* ---------- Motor (o mesmo do Farejador) ---------- */
async function rodar(job) {
  const dados = job.Data;
  const lista = places.get(job.ID);
  await buscarNoMaps({
    termos: dados.keywords, lat: dados.lat, lon: dados.lon, zoom: dados.zoom, lang: dados.lang || 'pt', profundidade: dados.depth || 2,
    emails: Boolean(dados.email), prazoMs: (Number(dados.max_time) || 600) * 1000, deveParar: async () => Boolean(job.apagado),
    aoAchar: (ficha) => { lista.push(ficha); if (lista.length % 10 === 0) salvar(job); },
  });
  job.Status = 'ok';
}
let ocupado = false;
async function fila() {
  if (ocupado) return;
  const job = jobs.find((j) => j.Status === 'pending');
  if (!job) return;
  ocupado = true;
  job.Status = 'working';
  salvar(job);
  try { await rodar(job); } catch (e) { job.Status = 'failed'; job.erro = String(e.message || e).slice(0, 300); console.error(job.Name, job.erro); }
  salvar(job);
  ocupado = false;
  fila();
}

/* ---------- Planilha no formato do scraper original ---------- */
const COLUNAS = ['input_id', 'link', 'title', 'category', 'address', 'open_hours', 'website', 'phone', 'review_count', 'review_rating', 'latitude', 'longitude', 'status', 'descriptions', 'thumbnail', 'place_id', 'owner', 'images', 'user_reviews', 'complete_address', 'emails'];
const celula = (v) => { const s = String(v ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
function planilha(job) {
  const linhas = places.get(job.ID).map((p) => ({
    ...p, input_id: job.ID, open_hours: JSON.stringify(p.open_hours || {}), status: p.status || '',
    complete_address: JSON.stringify({ borough: p.borough, city: p.city, postal_code: p.postal_code, state: p.state }),
    owner: JSON.stringify({ name: p.owner || '' }), images: JSON.stringify((p.images || []).map((u) => ({ image: u }))),
    user_reviews: JSON.stringify((p.user_reviews || []).map((r) => ({ Name: r.nome, Rating: r.nota, Description: r.texto, When: r.quando }))),
  }));
  return [COLUNAS.join(','), ...linhas.map((l) => COLUNAS.map((c) => celula(l[c])).join(','))].join('\n') + '\n';
}

/* ---------- Servidor ---------- */
const responder = (res, cod, corpo, tipo = 'application/json') => { res.writeHead(cod, { 'Content-Type': tipo, 'Cache-Control': 'no-store' }); res.end(tipo === 'application/json' ? JSON.stringify(corpo) : corpo); };
const lerCorpo = (req) => new Promise((ok) => { let b = ''; req.on('data', (d) => { b += d; }); req.on('end', () => ok(b)); });
const publico = ({ apagado, ...j }) => j;

http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');
  try {
    if (pathname === API && req.method === 'GET') return responder(res, 200, jobs.filter((j) => !j.apagado).map(publico));
    if (pathname === API && req.method === 'POST') {
      const b = JSON.parse(await lerCorpo(req));
      if (!b.name || !Array.isArray(b.keywords) || !b.keywords.length) return responder(res, 422, { code: 422, message: 'Faltou nome ou termo de busca' });
      const job = { ID: randomUUID(), Name: b.name, Date: new Date().toISOString(), Status: 'pending', Data: b };
      jobs.push(job);
      places.set(job.ID, []);
      salvar(job);
      fila();
      return responder(res, 201, { id: job.ID });
    }
    const m = pathname.match(/^\/api\/v1\/jobs\/([\w-]+)(\/places|\/download)?$/);
    if (m) {
      const job = jobs.find((j) => j.ID === m[1]);
      if (!job) return responder(res, 404, { code: 404, message: 'Busca não encontrada' });
      if (m[2] === '/places') return responder(res, 200, places.get(job.ID).filter((p) => p.latitude && p.longitude));
      if (m[2] === '/download') return responder(res, 200, planilha(job), 'text/csv; charset=utf-8');
      if (req.method === 'DELETE') {
        job.apagado = true;
        jobs.splice(jobs.indexOf(job), 1);
        places.delete(job.ID);
        fs.rmSync(arqPlaces(job.ID), { force: true });
        salvar();
        return responder(res, 200, { ok: true });
      }
      return responder(res, 200, publico(job));
    }
    const relativo = pathname === '/' ? 'templates/index.html' : pathname.startsWith('/static/') ? pathname.slice(8) : null;
    const arquivo = relativo && path.join(WEB, path.normalize(relativo));
    if (arquivo && arquivo.startsWith(WEB) && fs.existsSync(arquivo) && fs.statSync(arquivo).isFile()) {
      return responder(res, 200, fs.readFileSync(arquivo), TIPOS[path.extname(arquivo)] || 'application/octet-stream');
    }
    return responder(res, 404, { code: 404, message: 'Não encontrado' });
  } catch (e) {
    return responder(res, 500, { code: 500, message: String(e.message || e) });
  }
}).listen(PORTA, '127.0.0.1', () => console.log(`Scraper no ar em http://localhost:${PORTA}`));
