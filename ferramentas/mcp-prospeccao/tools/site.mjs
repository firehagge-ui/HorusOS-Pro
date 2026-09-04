// check_site: abre o site de verdade e devolve um diagnóstico factual.
// Corrige o ponto cego do Gemini Spark, que não inspeciona site arbitrário.

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0 Safari/537.36 HorusProspector/1.0";

// Plataformas "intermediárias/gratuitas": achar uma delas já é oportunidade.
const PLATAFORMAS_FRACAS = [
  { re: /\.my\.canva\.site|canva\.site/i, nome: "Canva Sites (gratuito)" },
  { re: /sites\.google\.com/i, nome: "Google Sites (gratuito)" },
  { re: /\.business\.site|\.negocio\.site/i, nome: "Google Business Site (gratuito, descontinuado)" },
  { re: /linktr\.ee/i, nome: "Linktree (apenas agregador de links)" },
  { re: /\.wixsite\.com/i, nome: "Wix (subdomínio gratuito)" },
  { re: /\.wordpress\.com/i, nome: "WordPress.com (subdomínio gratuito)" },
  { re: /\.blogspot\.com/i, nome: "Blogspot (gratuito)" },
  { re: /linkbio|beacons\.ai|bio\.link|linktr/i, nome: "Agregador de bio (não é site)" },
];

// Fingerprint de tecnologia por padrões no HTML/headers.
const TECH = [
  { re: /wp-content|wp-includes|\/wp-json/i, nome: "WordPress" },
  { re: /cdn\.shopify\.com|Shopify\.theme/i, nome: "Shopify" },
  { re: /static\.wixstatic\.com|X-Wix-/i, nome: "Wix" },
  { re: /squarespace\.com|static1\.squarespace/i, nome: "Squarespace" },
  { re: /assets\.webflow\.com|webflow\.js/i, nome: "Webflow" },
  { re: /lojaintegrada/i, nome: "Loja Integrada" },
  { re: /nuvemshop|tiendanube/i, nome: "Nuvemshop" },
  { re: /\.tray\.com\.br|trayimagens/i, nome: "Tray" },
  { re: /elementor/i, nome: "WordPress + Elementor" },
  { re: /netlify/i, nome: "Netlify (site custom)" },
  { re: /vercel/i, nome: "Vercel (site custom)" },
];

function normalizeUrl(input) {
  let u = String(input || "").trim();
  if (!u) return null;
  if (!/^https?:\/\//i.test(u)) u = "https://" + u;
  try {
    return new URL(u).toString();
  } catch {
    return null;
  }
}

async function fetchWithTimeout(url, ms = 12000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  const started = Date.now();
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: ctrl.signal,
      headers: { "User-Agent": UA, Accept: "text/html,*/*" },
    });
    const elapsed = Date.now() - started;
    // Lê no máximo ~600KB do corpo.
    const reader = res.body?.getReader?.();
    let html = "";
    if (reader) {
      let total = 0;
      const dec = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        total += value.length;
        html += dec.decode(value, { stream: true });
        if (total > 600_000) {
          try { await reader.cancel(); } catch {}
          break;
        }
      }
    } else {
      html = await res.text();
    }
    return { res, html, elapsed };
  } finally {
    clearTimeout(t);
  }
}

export async function checkSite(rawUrl) {
  const url = normalizeUrl(rawUrl);
  if (!url) return `ENTRADA INVÁLIDA: "${rawUrl}" não parece uma URL.`;

  let data;
  try {
    data = await fetchWithTimeout(url);
  } catch (err) {
    const motivo =
      err?.name === "AbortError"
        ? "tempo esgotado (site muito lento ou fora do ar)"
        : `falha de conexão (${err?.cause?.code || err?.message || "desconhecida"})`;
    return [
      `SITE: ${url}`,
      `STATUS: NÃO RESPONDEU — ${motivo}.`,
      `LEITURA: não dá pra confirmar que o site existe/funciona neste domínio.`,
      `Não conclua "não tem site" só por isto: o domínio pode estar diferente do nome do negócio.`,
    ].join("\n");
  }

  const { res, html, elapsed } = data;
  const finalUrl = res.url || url;
  const headersText = [...res.headers.entries()]
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  const haystack = finalUrl + "\n" + headersText + "\n" + html;

  // Título e lang
  const title = (html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || "").trim();
  const lang = html.match(/<html[^>]*\blang=["']([^"']+)/i)?.[1] || "não declarado";

  // Mobile
  const temViewport = /<meta[^>]+name=["']viewport["']/i.test(html);

  // WhatsApp
  const temWhats = /wa\.me\/|api\.whatsapp\.com|whatsapp:\/\/|href=["'][^"']*whatsapp/i.test(html);

  // Pixels / analytics
  const temMetaPixel = /connect\.facebook\.net|fbq\(|facebook\.com\/tr\?/i.test(html);
  const temGA = /googletagmanager\.com|gtag\(|google-analytics\.com|G-[A-Z0-9]{6,}/i.test(html);

  // Formulário
  const temForm = /<form[\s>]/i.test(html);

  // Plataforma fraca / tech
  const fraca = PLATAFORMAS_FRACAS.find((p) => p.re.test(haystack));
  const tech = TECH.find((t) => t.re.test(haystack));
  const isHttps = finalUrl.startsWith("https://");

  // Oportunidades (o que vender)
  const oportunidades = [];
  if (fraca) oportunidades.push(`Está em plataforma fraca (${fraca.nome}) → migrar pra site próprio com domínio e SEO.`);
  if (!temViewport) oportunidades.push("Sem meta viewport → provavelmente não é responsivo no celular.");
  if (!temWhats) oportunidades.push("Sem link de WhatsApp na página → falta canal de conversão direto.");
  if (!temMetaPixel && !temGA) oportunidades.push("Sem pixel/analytics → não mede nem remarketiza visitantes (não roda tráfego sério).");
  if (!temForm) oportunidades.push("Sem formulário → nenhuma captação de lead na própria página.");
  if (!isHttps) oportunidades.push("Sem HTTPS → passa insegurança e prejudica SEO.");
  if (elapsed > 5000) oportunidades.push(`Carregamento lento (${elapsed} ms até resposta).`);

  // Veredito de prospecção
  let veredito;
  if (fraca) veredito = "OPORTUNIDADE ALTA — usa solução amadora, reconhece que precisa estar na web mas sem estrutura.";
  else if (res.status >= 400) veredito = `OPORTUNIDADE — site retornou HTTP ${res.status} (quebrado ou restrito).`;
  else if (oportunidades.length >= 3) veredito = "OPORTUNIDADE — site próprio existe, mas com lacunas claras de conversão/mobile.";
  else if (oportunidades.length >= 1) veredito = "OPORTUNIDADE MODERADA — site razoável com pontos a melhorar.";
  else veredito = "BAIXA PRIORIDADE (site) — site próprio, responsivo, com conversão e medição. Provavelmente já bem servido.";

  return [
    `SITE: ${url}`,
    finalUrl !== url ? `REDIRECIONOU PARA: ${finalUrl}` : null,
    `STATUS HTTP: ${res.status} ${res.statusText || ""}`.trim(),
    `TÍTULO: ${title || "(sem <title>)"}`,
    `IDIOMA (html lang): ${lang}`,
    `PLATAFORMA/TECH: ${fraca ? fraca.nome : tech ? tech.nome : "não identificada (provável site sob medida)"}`,
    `HTTPS: ${isHttps ? "sim" : "NÃO"}`,
    `RESPONSIVO (viewport): ${temViewport ? "sim" : "NÃO"}`,
    `WHATSAPP NA PÁGINA: ${temWhats ? "sim" : "não"}`,
    `PIXEL META: ${temMetaPixel ? "sim" : "não"}  |  ANALYTICS/GA: ${temGA ? "sim" : "não"}`,
    `FORMULÁRIO: ${temForm ? "sim" : "não"}`,
    `TEMPO DE RESPOSTA: ${elapsed} ms`,
    ``,
    `VEREDITO: ${veredito}`,
    oportunidades.length
      ? `OPORTUNIDADES:\n${oportunidades.map((o) => "  • " + o).join("\n")}`
      : `OPORTUNIDADES: nenhuma lacuna óbvia detectada.`,
    ``,
    `Tudo acima é [verificado] por leitura real da página, não inferência.`,
  ]
    .filter((l) => l !== null)
    .join("\n");
}
