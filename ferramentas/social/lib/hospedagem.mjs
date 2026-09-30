// =============================================================================
// Hospedagem da mídia: a API da Meta só aceita imagem em URL pública (https).
// Usa um bucket público "midia" no Supabase do Hounder. A chave de serviço mora em
// ferramentas/social/.segredos/supabase.txt (colada pelo Marcelo, fora do Git) ou na
// variável SUPABASE_SERVICE_KEY. Sem ela, temHospedagem() = false e nada é enviado.
// Portão binário: toda URL é conferida (HTTP 200) antes de voltar para quem chamou.
// =============================================================================
import fs from 'node:fs';
import path from 'node:path';
import { RAIZ_SOCIAL } from './marca.mjs';

const URL_PROJETO = process.env.SUPABASE_URL || 'https://zzkawmjpjhluiztemlmr.supabase.co';
const BUCKET = 'midia';

function chave() {
  if (process.env.SUPABASE_SERVICE_KEY) return process.env.SUPABASE_SERVICE_KEY.trim();
  const arq = path.join(RAIZ_SOCIAL, '.segredos', 'supabase.txt');
  if (!fs.existsSync(arq)) return null;
  const k = fs.readFileSync(arq, 'utf8').trim();
  return /^eyJ[\w-]+\.[\w-]+\.[\w-]+$/.test(k) || /^sb_secret_/.test(k) ? k : null;
}

export function temHospedagem() { return Boolean(chave()); }

function cabecalhos(extra = {}) {
  const k = chave();
  return { apikey: k, Authorization: `Bearer ${k}`, ...extra };
}

async function garantirBucket() {
  const r = await fetch(`${URL_PROJETO}/storage/v1/bucket`, {
    method: 'POST', headers: cabecalhos({ 'content-type': 'application/json' }),
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true, file_size_limit: 30 * 1024 * 1024, allowed_mime_types: ['image/jpeg', 'image/png', 'video/mp4'] }),
  });
  if (r.ok) return;
  const t = await r.text();
  if (/already exists|Duplicate|409/i.test(t) || r.status === 409) return;
  throw new Error(`Não consegui criar o espaço de arquivos (${r.status}): ${t.slice(0, 200)}`);
}

/** Envia arquivos locais e devolve as URLs públicas, na mesma ordem. */
export async function hospedar(arquivos, prefixo) {
  if (!temHospedagem()) throw new Error('Falta a chave de serviço do Supabase (ferramentas/social/.segredos/supabase.txt).');
  await garantirBucket();
  const urls = [];
  for (const arq of arquivos) {
    const nome = `${prefixo.replace(/[^\w/-]/g, '-')}/${path.basename(arq)}`;
    const tipo = /\.png$/i.test(arq) ? 'image/png' : /\.mp4$/i.test(arq) ? 'video/mp4' : 'image/jpeg';
    const r = await fetch(`${URL_PROJETO}/storage/v1/object/${BUCKET}/${nome}`, {
      method: 'POST', headers: cabecalhos({ 'content-type': tipo, 'x-upsert': 'true', 'cache-control': '31536000' }), body: fs.readFileSync(arq),
    });
    if (!r.ok) throw new Error(`Falhou o envio de ${path.basename(arq)} (${r.status}): ${(await r.text()).slice(0, 200)}`);
    const publica = `${URL_PROJETO}/storage/v1/object/public/${BUCKET}/${nome}`;
    const conf = await fetch(publica, { method: 'HEAD' });
    if (!conf.ok) throw new Error(`A imagem subiu mas não abre em público (${conf.status}): ${publica}`);
    urls.push(publica);
  }
  return urls;
}
