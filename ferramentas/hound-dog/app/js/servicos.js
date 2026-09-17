/* =============================================================================
   HOUND DOG — serviços rápidos (sem Claude): checar site, CNPJ, ler planilha por URL
   As funções /api/* rodam na Vercel e só respondem a operador logado.
   ============================================================================= */
import { sb } from './sb.js';

async function token() {
  const { data } = await sb.auth.getSession();
  return data.session?.access_token || '';
}

async function api(caminho) {
  const r = await fetch(caminho, { headers: { Authorization: `Bearer ${await token()}` } });
  const tipo = r.headers.get('content-type') || '';
  const corpo = tipo.includes('json') ? await r.json() : await r.text();
  if (!r.ok) throw new Error(corpo?.erro || corpo || `HTTP ${r.status}`);
  return corpo;
}

/** Status real do site: ok, fora_do_ar ou ruim (lento/erro de servidor). */
export async function checarSite(url) {
  try {
    return await api(`/api/checar-site?url=${encodeURIComponent(url)}`);
  } catch (e) {
    // Sem a função (rodando local sem Vercel): teste grosseiro pelo navegador
    if (!/HTTP 404|Failed to fetch/i.test(String(e.message))) throw e;
    const t0 = performance.now();
    try {
      await fetch(url, { mode: 'no-cors', cache: 'no-store' });
      const ms = Math.round(performance.now() - t0);
      return { status: ms > 6000 ? 'ruim' : 'ok', resumo: `Respondeu em ${ms} ms (teste simples pelo navegador)`, detalhe: 'Sem o status HTTP exato: a checagem completa roda na versão publicada.' };
    } catch {
      return { status: 'fora_do_ar', resumo: 'Não respondeu (DNS, certificado ou servidor fora)', detalhe: 'Teste simples pelo navegador.' };
    }
  }
}

export async function consultarCNPJ(cnpj) {
  const d = String(cnpj || '').replace(/\D/g, '');
  if (d.length !== 14) throw new Error('CNPJ precisa ter 14 dígitos');
  const r = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${d}`);
  if (r.status === 404) throw new Error('CNPJ não encontrado na Receita');
  if (!r.ok) throw new Error(`Consulta falhou (HTTP ${r.status}). Tente de novo em instantes.`);
  return r.json();
}

/** Lê o texto de uma planilha publicada (CSV do Google Sheets ou outro link público). */
export async function lerURLPlanilha(url) {
  let u = String(url || '').trim();
  const m = u.match(/docs\.google\.com\/spreadsheets\/d\/(?!e\/)([A-Za-z0-9_-]+)/);
  if (m && !/output=csv|format=csv/.test(u)) {
    const gid = (u.match(/[#&?]gid=(\d+)/) || [])[1] || '0';
    u = `https://docs.google.com/spreadsheets/d/${m[1]}/export?format=csv&gid=${gid}`;
  }
  try {
    const r = await fetch(u);
    if (r.ok) { const t = await r.text(); if (!/^\s*<!doctype html|<html/i.test(t)) return t; }
  } catch { /* CORS: tenta pelo proxy */ }
  const t = await api(`/api/planilha?url=${encodeURIComponent(u)}`);
  if (/^\s*<!doctype html|<html/i.test(t)) throw new Error('O link abriu uma página, não um CSV. No Sheets use Arquivo → Compartilhar → Publicar na web → CSV.');
  return t;
}
