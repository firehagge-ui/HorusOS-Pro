// Checa se o site de um lead está no ar (status HTTP, tempo, redirecionamento, HTTPS, domínio estacionado).
import { exigirOperador, urlPublicaSegura } from './_auth.js';

export default async function handler(req, res) {
  if (!(await exigirOperador(req))) return res.status(401).json({ erro: 'Só operador logado' });
  const alvo = urlPublicaSegura(String(req.query.url || ''));
  if (!alvo) return res.status(400).json({ erro: 'URL inválida' });
  const t0 = Date.now();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12000);
  try {
    const r = await fetch(alvo.href, { redirect: 'follow', signal: ctrl.signal, headers: { 'user-agent': 'Mozilla/5.0 (HoundDog site check)' } });
    const ms = Date.now() - t0;
    const final = r.url || alvo.href;
    const html = (await r.text()).slice(0, 200000);
    const titulo = (html.match(/<title[^>]*>([^<]{0,160})/i) || [])[1]?.trim() || null;
    const estacionado = /domain (is )?for sale|parked domain|dominio (esta )?a venda|coming soon|em constru[cç][aã]o|site em manuten/i.test(html);
    let status = 'ok';
    let resumo = `No ar: HTTP ${r.status} em ${ms} ms`;
    if (r.status >= 500) { status = 'fora_do_ar'; resumo = `Erro de servidor (HTTP ${r.status})`; }
    else if (r.status >= 400) { status = 'fora_do_ar'; resumo = `Página não encontrada ou bloqueada (HTTP ${r.status})`; }
    else if (estacionado) { status = 'ruim'; resumo = 'Domínio estacionado, "em construção" ou página padrão'; }
    else if (ms > 6000) { status = 'ruim'; resumo = `No ar, mas lento (${ms} ms)`; }
    const detalhe = [titulo ? `Título: ${titulo}` : null, final !== alvo.href ? `Redireciona para ${final}` : null, final.startsWith('https:') ? 'HTTPS ok' : 'Sem HTTPS'].filter(Boolean).join(' · ');
    return res.status(200).json({ status, resumo, detalhe, http: r.status, ms, final });
  } catch (e) {
    const causa = e?.cause?.code || e?.name || '';
    const resumo = causa === 'ENOTFOUND' ? 'Domínio não existe ou o DNS não resolve'
      : e?.name === 'AbortError' ? 'Não respondeu em 12 segundos'
        : /CERT|SSL|TLS/i.test(`${causa} ${e?.message}`) ? 'Certificado HTTPS inválido'
          : `Não abriu (${causa || 'falha de conexão'})`;
    return res.status(200).json({ status: 'fora_do_ar', resumo, detalhe: String(e?.message || '').slice(0, 200) });
  } finally { clearTimeout(timer); }
}
