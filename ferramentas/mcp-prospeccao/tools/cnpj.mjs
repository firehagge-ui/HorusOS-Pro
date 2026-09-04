// lookup_cnpj: consulta a Receita via BrasilAPI (grátis, sem chave).
// Alimenta o eixo "capacidade de pagar" e revela o nome do decisor (sócios).

const PORTE_LABEL = {
  "01": "Microempresa (ME)",
  "03": "Empresa de Pequeno Porte (EPP)",
  "05": "Demais (médio/grande)",
  MICRO_EMPRESA: "Microempresa (ME)",
  PEQUENO_PORTE: "Empresa de Pequeno Porte (EPP)",
  DEMAIS: "Demais (médio/grande)",
};

function soDigitos(s) {
  return String(s || "").replace(/\D/g, "");
}

function anos(dataIso) {
  if (!dataIso) return null;
  const d = new Date(dataIso);
  if (isNaN(d)) return null;
  return Math.floor((Date.now() - d.getTime()) / (365.25 * 24 * 3600 * 1000));
}

function moeda(v) {
  const n = Number(v);
  if (!isFinite(n) || n <= 0) return null;
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export async function lookupCnpj(rawCnpj) {
  const cnpj = soDigitos(rawCnpj);
  if (cnpj.length !== 14) {
    return `CNPJ INVÁLIDO: "${rawCnpj}" tem ${cnpj.length} dígitos (esperado 14). Esta ferramenta consulta por número, não por nome.`;
  }

  // Cloudflare da BrasilAPI bloqueia request sem User-Agent (403). Sempre enviar.
  const HDRS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) HorusProspector/1.0",
    Accept: "application/json",
  };
  // Tenta BrasilAPI; se falhar (403/5xx/rede), cai para minhareceita.org (mesmo schema).
  const fontes = [
    `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`,
    `https://minhareceita.org/${cnpj}`,
  ];
  let j = null;
  let ultimoStatus = null;
  for (const url of fontes) {
    try {
      const res = await fetch(url, { headers: HDRS });
      ultimoStatus = res.status;
      if (res.status === 404) return `CNPJ ${cnpj} não encontrado na base da Receita.`;
      if (!res.ok) continue;
      j = await res.json();
      break;
    } catch {
      continue;
    }
  }
  if (!j) return `Não foi possível consultar o CNPJ agora (último status: ${ultimoStatus ?? "sem resposta"}). Tente de novo.`;

  const idade = anos(j.data_inicio_atividade);
  const socios = Array.isArray(j.qsa) ? j.qsa : [];
  const porte = PORTE_LABEL[j.porte] || j.porte || "não informado";
  const capital = moeda(j.capital_social);

  // Sinais de capacidade de pagar
  const sinais = [];
  if (idade != null && idade >= 5) sinais.push(`Operação estabelecida (${idade} anos).`);
  if (idade != null && idade < 2) sinais.push(`Empresa nova (${idade} ano(s)) — pode ter menos verba, checar.`);
  if (/ativa/i.test(j.descricao_situacao_cadastral || "")) sinais.push("Situação cadastral ATIVA.");
  else sinais.push(`ATENÇÃO: situação "${j.descricao_situacao_cadastral || j.situacao_cadastral}" — não é ativa.`);
  if (capital) sinais.push(`Capital social: ${capital}.`);

  const linhasSocios = socios.length
    ? socios
        .slice(0, 6)
        .map((s) => `  • ${s.nome_socio || s.nome} — ${s.qualificacao_socio || s.qual || "sócio"}`)
        .join("\n")
    : "  (não informado)";

  return [
    `CNPJ: ${cnpj}`,
    `RAZÃO SOCIAL: ${j.razao_social || "—"}`,
    `NOME FANTASIA: ${j.nome_fantasia || "(não informado)"}`,
    `SITUAÇÃO: ${j.descricao_situacao_cadastral || j.situacao_cadastral || "—"}`,
    `ABERTURA: ${j.data_inicio_atividade || "—"}${idade != null ? ` (${idade} anos)` : ""}`,
    `PORTE: ${porte}`,
    `SEGMENTO (CNAE principal): ${j.cnae_fiscal_descricao || "—"}`,
    `MUNICÍPIO/UF: ${j.municipio || "—"}/${j.uf || "—"}`,
    j.ddd_telefone_1 ? `TELEFONE (Receita): ${j.ddd_telefone_1}` : null,
    capital ? `CAPITAL SOCIAL: ${capital}` : null,
    ``,
    `DECISOR / SÓCIOS:`,
    linhasSocios,
    ``,
    `LEITURA DE CAPACIDADE DE PAGAR:`,
    sinais.map((s) => "  • " + s).join("\n"),
  ]
    .filter((l) => l !== null)
    .join("\n");
}
