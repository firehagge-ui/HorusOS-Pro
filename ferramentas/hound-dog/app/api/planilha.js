// Proxy de leitura de planilha publicada (CSV) para contornar CORS. Só operador e só hosts de planilha.
import { exigirOperador, urlPublicaSegura } from './_auth.js';

const PERMITIDOS = ['docs.google.com', 'googleusercontent.com', 'dropbox.com', 'dropboxusercontent.com', 'onedrive.live.com', '1drv.ms', 'sharepoint.com', 'airtable.com', 'raw.githubusercontent.com'];

export default async function handler(req, res) {
  if (!(await exigirOperador(req))) return res.status(401).json({ erro: 'Só operador logado' });
  const alvo = urlPublicaSegura(String(req.query.url || ''));
  if (!alvo) return res.status(400).json({ erro: 'URL inválida' });
  const h = alvo.hostname.toLowerCase();
  if (!PERMITIDOS.some((p) => h === p || h.endsWith(`.${p}`))) return res.status(400).json({ erro: 'Só links de planilha (Google Sheets, Dropbox, OneDrive, Airtable)' });
  try {
    const r = await fetch(alvo.href, { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (HoundDog planilha)' } });
    if (!r.ok) return res.status(502).json({ erro: `A planilha respondeu HTTP ${r.status}. Ela está publicada na web?` });
    const texto = await r.text();
    if (texto.length > 8 * 1024 * 1024) return res.status(413).json({ erro: 'Planilha grande demais (máximo 8 MB)' });
    res.setHeader('content-type', 'text/plain; charset=utf-8');
    return res.status(200).send(texto);
  } catch (e) {
    return res.status(502).json({ erro: `Não consegui ler: ${String(e?.message || e).slice(0, 160)}` });
  }
}
