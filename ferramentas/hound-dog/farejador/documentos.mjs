// Proposta em PDF, prévia do site e CNPJ em lote (pedido do Marcelo, 10/11/2026).
// Rodam os scripts da skill prospecta-maps (.claude/skills/prospecta-maps/) com os dados do Hounder.
// Nada é enviado ao lead: o Marcelo baixa o PDF ou copia o link e decide se manda.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { q, q1 } from '../lib/db.mjs';
import { registrarAtividade } from '../lib/crm.mjs';
import { RAIZ_HD } from '../lib/env.mjs';
import { rodarClaude } from './claude.mjs';

const RAIZ_REPO = path.resolve(RAIZ_HD, '..', '..');
const SKILL = path.join(RAIZ_REPO, '.claude', 'skills', 'prospecta-maps');
const PASTA_PREVIAS = path.join(RAIZ_HD, '.previas', 'horus-previas');
const PASTA_CNPJ = path.join(RAIZ_HD, '.cnpj-cache');
const PASTA_PROPOSTAS = 'E:/Users/hagge/Downloads/Propostas';
const URL_PROJETO = process.env.SUPABASE_URL || 'https://zzkawmjpjhluiztemlmr.supabase.co';
const BUCKET = 'documentos';

const slug = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'empresa';
const digitos = (t) => String(t || '').replace(/\D/g, '');
const pastaTemp = (nome) => fs.mkdtempSync(path.join(os.tmpdir(), `hounder-${nome}-`));
const semTravessao = (s) => String(s || '').replace(/\s*[—–]\s*/g, ', ');

/** Roda um script da skill e devolve a saída. Falha com a última linha de erro. */
function rodarScript(script, argumentos, { cwd, timeoutMs = 10 * 60000, aoLinha } = {}) {
  return new Promise((ok, falha) => {
    const p = spawn(process.execPath, [path.join(SKILL, script), ...argumentos], { cwd, windowsHide: true });
    let saida = '', erro = '';
    const tempo = setTimeout(() => { p.kill(); falha(new Error(`${script} passou de ${Math.round(timeoutMs / 60000)} min`)); }, timeoutMs);
    p.stdout.on('data', (d) => { saida += d; String(d).split(/\r?\n/).filter(Boolean).forEach((l) => aoLinha?.(l)); });
    p.stderr.on('data', (d) => { erro += d; });
    p.on('close', (cod) => {
      clearTimeout(tempo);
      if (cod === 0) ok(saida);
      else falha(new Error((erro.trim().split(/\r?\n/).filter((l) => !/^\s+at /.test(l)).slice(-3).join(' ') || `${script} saiu com código ${cod}`).slice(0, 400)));
    });
  });
}

function chaveServico() {
  if (process.env.SUPABASE_SERVICE_KEY) return process.env.SUPABASE_SERVICE_KEY.trim();
  const arq = path.join(RAIZ_REPO, 'ferramentas', 'social', '.segredos', 'supabase.txt');
  return fs.existsSync(arq) ? fs.readFileSync(arq, 'utf8').trim() : null;
}
/** Sobe um arquivo para o bucket público "documentos" e devolve o link. */
async function hospedar(arquivo, destino) {
  const k = chaveServico();
  if (!k) throw new Error('Falta a chave de serviço do Supabase (ferramentas/social/.segredos/supabase.txt).');
  const cab = { apikey: k, Authorization: `Bearer ${k}` };
  await fetch(`${URL_PROJETO}/storage/v1/bucket`, {
    method: 'POST', headers: { ...cab, 'content-type': 'application/json' },
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true, file_size_limit: 20 * 1024 * 1024, allowed_mime_types: ['application/pdf', 'image/png', 'image/jpeg'] }),
  }).catch(() => {});
  const tipo = /\.pdf$/i.test(arquivo) ? 'application/pdf' : /\.png$/i.test(arquivo) ? 'image/png' : 'image/jpeg';
  const r = await fetch(`${URL_PROJETO}/storage/v1/object/${BUCKET}/${destino}`, { method: 'POST', headers: { ...cab, 'content-type': tipo, 'x-upsert': 'true' }, body: fs.readFileSync(arquivo) });
  if (!r.ok) throw new Error(`Falhou o envio do arquivo (${r.status}): ${(await r.text()).slice(0, 200)}`);
  const publica = `${URL_PROJETO}/storage/v1/object/public/${BUCKET}/${destino}`;
  const conf = await fetch(publica, { method: 'HEAD' });
  if (!conf.ok) throw new Error(`O arquivo subiu mas não abre (${conf.status}).`);
  return publica;
}

async function itemDaLista(empresa) {
  if (empresa.lista_item_id) {
    const it = await q1('select * from lista_itens where id = $1', [empresa.lista_item_id]);
    if (it) return it;
  }
  return q1('select * from lista_itens where empresa_id = $1 order by criado_em desc limit 1', [empresa.id]);
}

/** O lead já respondeu? Mensagem recebida no WhatsApp ou "Respondeu" marcado no Disparos. */
export async function leadRespondeu(empresaId) {
  const r = await q1(`select exists (select 1 from whatsapp_mensagens m join whatsapp_conversas c on c.id = m.conversa_id
      where c.empresa_id = $1 and m.direcao = 'in' and m.tipo <> 'indecifrada') or exists (select 1 from disparos where empresa_id = $1 and respondeu) as ok`, [empresaId]);
  return Boolean(r?.ok);
}

/* =============================== Proposta =============================== */
export async function gerarProposta(job, progresso) {
  const empresa = await q1('select * from empresas where id = $1', [job.empresa_id || job.entrada?.empresa_id]);
  if (!empresa) throw new Error('Empresa não encontrada.');
  const e = job.entrada || {};
  for (const c of ['oferta', 'preco', 'prazo']) if (!String(e[c] || '').trim()) throw new Error(`Faltou ${c} na proposta.`);
  const inclui = (e.inclui || []).filter((l) => l?.[0]);
  if (!inclui.length) throw new Error('Faltou o que entra na proposta.');
  await progresso('Montando a proposta');
  const pasta = pastaTemp('proposta');
  const rodada = path.join(pasta, 'rodada');
  const chave = `01-${slug(empresa.nome)}`;
  fs.mkdirSync(path.join(rodada, chave), { recursive: true });

  // A prévia, se existir, entra na proposta
  const previa = await q1("select dados from atividades where empresa_id = $1 and dados->>'tipo_doc' = 'previa' order by criado_em desc limit 1", [empresa.id]).catch(() => null);
  if (previa?.dados?.print_local && fs.existsSync(previa.dados.print_local)) fs.copyFileSync(previa.dados.print_local, path.join(rodada, chave, 'print-whatsapp.png'));

  const achados = [];
  if (empresa.google_nota != null) achados.push([String(empresa.google_nota).replace('.', ','), 'nota no Google']);
  if (empresa.google_avaliacoes) achados.push([String(empresa.google_avaliacoes), 'avaliações']);
  if (['sem', 'fora_do_ar'].includes(empresa.site_status)) achados.push([empresa.site_status === 'sem' ? 'Nenhum' : 'Fora do ar', 'site na ficha do Google']);
  const config = {
    remetente: semTravessao(e.remetente || 'Marcelo'), assinatura: semTravessao(e.assinatura || 'Marcelo · Horus'),
    oferta: semTravessao(e.oferta), preco: semTravessao(e.preco), entrega: semTravessao(e.entrega || e.oferta), prazo: semTravessao(e.prazo),
    inclui: inclui.map(([a, b]) => [semTravessao(a), semTravessao(b || '')]),
    naoInclui: (e.naoInclui || []).map(semTravessao).filter(Boolean), limites: (e.limites || []).map(semTravessao).filter(Boolean),
    pagamento: (e.pagamento || []).filter((p) => p?.[1]).map((p) => p.map(semTravessao)),
    validadeDias: Number(e.validadeDias) || 7, cor: '#0077ff',
    logo: fs.existsSync(path.join(RAIZ_REPO, 'identidade', 'logo', 'horus-simbolo.svg')) ? path.join(RAIZ_REPO, 'identidade', 'logo', 'horus-simbolo.svg') : '',
    whatsapp: e.whatsapp ? digitos(e.whatsapp) : '', semPrevia: !fs.existsSync(path.join(rodada, chave, 'print-whatsapp.png')),
  };
  if (!config.naoInclui.length || !config.limites.length || !config.pagamento.length) throw new Error('Faltou o que não entra, os limites ou a forma de pagamento.');
  fs.writeFileSync(path.join(pasta, 'config.json'), JSON.stringify(config, null, 2));
  fs.writeFileSync(path.join(rodada, 'rodada.json'), JSON.stringify({
    nicho: empresa.categoria || '', cidade: empresa.cidade || '', semPrevia: config.semPrevia,
    leads: { [chave]: {
      slug: slug(empresa.nome), empresa: empresa.nome, artigo: e.artigo === 'o' ? 'o' : 'a', servico: empresa.categoria || '',
      proposta: { achados, contexto: semTravessao(e.contexto || ''), conversa: semTravessao(e.conversa || ''), conta: semTravessao(e.conta || '') },
    } },
  }, null, 2));
  await progresso('Gerando o PDF');
  await rodarScript('proposta.js', [rodada, '--lead', chave], { cwd: pasta, timeoutMs: 3 * 60000 });
  const pdf = path.join(rodada, 'propostas', `${slug(empresa.nome)}.pdf`);
  if (!fs.existsSync(pdf)) throw new Error('O PDF não saiu. Confira se o Chrome está instalado.');
  fs.mkdirSync(PASTA_PROPOSTAS, { recursive: true });
  const local = path.join(PASTA_PROPOSTAS, `Proposta ${empresa.nome.replace(/[\\/:*?"<>|]/g, '')}.pdf`);
  fs.copyFileSync(pdf, local);
  await progresso('Subindo o PDF');
  const url = await hospedar(pdf, `propostas/${randomUUID()}/${slug(empresa.nome)}.pdf`);
  await registrarAtividade(empresa.id, 'nota', 'Proposta gerada', `${config.oferta} · ${config.preco}. PDF: ${url}`, job.criado_por || 'painel', { tipo_doc: 'proposta', url, local });
  fs.rmSync(pasta, { recursive: true, force: true });
  return { url, local };
}

/* =============================== Prévia =============================== */
/** O formato exigido sai do próprio exemplo da skill: cada campo com o tipo que o gerador espera. */
function esquemaDaPrevia() {
  const [modelo] = JSON.parse(fs.readFileSync(path.join(SKILL, 'exemplo-leads.json'), 'utf8'));
  const tipo = (v) => (v === null ? ['string', 'null'] : Array.isArray(v) ? 'array' : typeof v === 'object' ? 'object' : typeof v === 'number' ? 'number' : typeof v === 'boolean' ? 'boolean' : 'string');
  const properties = {};
  for (const [k, v] of Object.entries(modelo)) if (!k.startsWith('_')) properties[k] = { type: k === 'fotoHero' ? ['string', 'null'] : tipo(v) };
  return { type: 'object', additionalProperties: true, required: Object.keys(properties).filter((k) => !['fotoHero', 'copias'].includes(k)), properties };
}

async function baixarFotos(urls, destino) {
  fs.mkdirSync(destino, { recursive: true });
  let n = 0;
  for (const u of urls || []) {
    try {
      const r = await fetch(String(u).replace(/=w\d+-h\d+[^&]*$/, '=w1600'), { signal: AbortSignal.timeout(20000), headers: { 'user-agent': 'Mozilla/5.0' } });
      if (!r.ok) continue;
      const b = Buffer.from(await r.arrayBuffer());
      if (b.length < 15000) continue;
      fs.writeFileSync(path.join(destino, `foto${++n}.jpg`), b);
    } catch { /* foto que não baixa fica de fora */ }
  }
  return n;
}

function deployPrevias() {
  return new Promise((ok, falha) => {
    const p = spawn('cmd', ['/c', 'npx', '-y', 'vercel@60.0.0', 'deploy', '--prod', '--yes'], { cwd: PASTA_PREVIAS, windowsHide: true });
    let s = '';
    p.stdout.on('data', (d) => { s += d; });
    p.stderr.on('data', (d) => { s += d; });
    p.on('close', (cod) => {
      const alias = s.match(/Aliased\s+(https:\/\/\S+)/)?.[1] || s.match(/Production\s+(https:\/\/\S+)/)?.[1];
      if (cod === 0 && alias) ok(alias.replace(/\/$/, ''));
      else falha(new Error(`A publicação na Vercel falhou: ${s.trim().split(/\r?\n/).slice(-2).join(' ').slice(0, 300)}`));
    });
  });
}

/** O gerador recusa campo vazio: completa só com o que está na ficha, nunca com texto inventado. */
function completarLead(lead, empresa) {
  const texto = (v) => (typeof v === 'string' ? v.trim() : '');
  const end = (Array.isArray(lead.endereco) ? lead.endereco : []).map(texto).filter(Boolean);
  const rua = texto(empresa.endereco).split(' - ')[0];
  const regiao = [empresa.bairro, empresa.cidade].filter(Boolean).join(' · ');
  lead.endereco = [end[0] || rua || regiao || empresa.nome, end[1] || (end[0] || rua ? regiao : '') || texto(empresa.cidade) || ' '];
  lead.enderecoBusca = texto(lead.enderecoBusca) || [empresa.nome, empresa.endereco || empresa.cidade].filter(Boolean).join(' ');
  // A cor da marca aparece em botão e destaque sobre fundo #121417: precisa contrastar com ele e com o texto por cima
  const luz = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)).reduce((s, c, i) => s + c * [0.2126, 0.7152, 0.0722][i], 0);
  const contraste = (a, b) => { const [x, y] = [luz(a), luz(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
  const corOk = Array.isArray(lead.cor) && lead.cor.length >= 3 && lead.cor.every((c) => /^#[0-9a-f]{6}$/i.test(c))
    && contraste(lead.cor[0], '#121417') >= 3 && contraste(lead.cor[0], lead.cor[2]) >= 4.5;
  if (!corOk) lead.cor = ['#ff7a1a', '#c2410c', '#111111'];
  if (!Array.isArray(lead.promessa) || lead.promessa.length < 2) lead.promessa = [texto(lead.promessa?.[0]) || empresa.nome, texto(lead.promessa?.[1]) || texto(empresa.cidade)];
  lead.nota = texto(lead.nota) || (empresa.google_nota != null ? String(empresa.google_nota).replace('.', ',') : '');
  lead.nAvaliacoes = texto(lead.nAvaliacoes) || (empresa.google_avaliacoes ? String(empresa.google_avaliacoes) : '');
  for (const k of ['oQueFaz', 'cidade', 'descricao', 'tagline', 'subtitulo', 'tituloServicos', 'subServicos', 'tituloFinal', 'subFinal', 'telefone', 'altHero', 'msgWhats']) if (typeof lead[k] !== 'string') lead[k] = '';
  lead.nomeCurto = texto(lead.nomeCurto) || empresa.nome;
  lead.cidade = lead.cidade || texto(empresa.cidade);
  lead.whatsapp = digitos(lead.whatsapp) === digitos(empresa.whatsapp) ? digitos(empresa.whatsapp) : digitos(empresa.whatsapp);
  lead.telefoneDigitos = digitos(empresa.telefone || empresa.whatsapp).replace(/^55/, '');
  if (!Array.isArray(lead.servicos)) lead.servicos = [];
  return lead;
}

export async function gerarPrevia(job, progresso) {
  const empresa = await q1('select * from empresas where id = $1', [job.empresa_id || job.entrada?.empresa_id]);
  if (!empresa) throw new Error('Empresa não encontrada.');
  if (!job.entrada?.sem_resposta_ok && !(await leadRespondeu(empresa.id))) throw new Error('O lead ainda não respondeu. A prévia sai só para quem respondeu (regra de 08/10).');
  const item = await itemDaLista(empresa);
  const d = item?.dados || {};
  const chave = `01-${slug(empresa.nome)}`;
  const pasta = pastaTemp('previa');
  const fotosDir = path.join(pasta, '.fotos', slug(empresa.nome));
  await progresso('Baixando as fotos da ficha do Google');
  const nFotos = await baixarFotos(d.fotos, fotosDir);
  const exemplo = fs.readFileSync(path.join(SKILL, 'exemplo-leads.json'), 'utf8');
  const fatos = {
    nome: empresa.nome, categoria: empresa.categoria, cidade: empresa.cidade, bairro: empresa.bairro, endereco: empresa.endereco,
    whatsapp: empresa.whatsapp, telefone: empresa.telefone, instagram: empresa.instagram, site: empresa.site,
    nota: empresa.google_nota, avaliacoes: empresa.google_avaliacoes, cnpj: empresa.cnpj, resumo: empresa.resumo, dor: empresa.dor,
    categorias_google: d.categorias, horarios: d.horarios, descricao_google: d.descricao, comentarios_google: d.comentarios,
    fotos_disponiveis: Array.from({ length: nFotos }, (_, i) => `${slug(empresa.nome)}/foto${i + 1}.jpg`),
  };
  await progresso('O Claude está escrevendo o texto da prévia');
  const r = await rodarClaude({
    prompt: `Monte o objeto de UM lead para o gerador de prévias, no formato exato deste exemplo (os comentários "_indice" explicam cada campo):
${exemplo}

FATOS DA EMPRESA (a única fonte; tudo fora daqui é proibido):
${JSON.stringify(fatos, null, 2)}

REGRAS
- Use "slug": "${chave}". Em "copias", só os arquivos de fotos_disponiveis, como "img/hero.jpg": "<arquivo>". Sem fotos: "fotoHero": null e "fotos": [].
- Nada inventado: serviço sai da categoria, da descrição ou dos comentários; número só os dos fatos. Seção sem dado, deixe a lista vazia.
- Depoimento só com texto real dos comentários e nome abreviado (ex.: "Ana S."). Sem comentário, sem depoimento.
- Sem travessão, sem promessa de resultado, sem superlativo. Texto curto, na voz do dono.
- "whatsapp" e "telefoneDigitos" só com os dígitos dos fatos. Sem telefone, deixe vazio.
Responda só com o objeto JSON.`,
    sistema: 'Você escreve o texto de um site de prévia para um pequeno negócio. Integridade acima de tudo: nada que não esteja nos fatos.',
    modelo: 'claude-opus-5-5', modo: 'leve', ferramentas: [], timeoutMs: 8 * 60000, esquemaJson: esquemaDaPrevia(),
  });
  const lead = r.json;
  if (!lead?.nome) throw new Error('O Claude não devolveu o texto da prévia.');
  lead.slug = chave;
  completarLead(lead, empresa);
  const rodada = path.join(pasta, 'rodada');
  fs.mkdirSync(rodada, { recursive: true });
  fs.writeFileSync(path.join(pasta, 'leads.json'), JSON.stringify([lead], null, 2));
  await progresso('Gerando o site e os prints');
  await rodarScript('gera-sites.js', [path.join(pasta, 'leads.json'), rodada, path.join(pasta, '.fotos'), '--assinatura', 'Marcelo'], { cwd: pasta, timeoutMs: 3 * 60000 });
  await rodarScript('prints.js', [rodada], { cwd: pasta, timeoutMs: 4 * 60000 });
  const site = path.join(rodada, chave);
  const print = path.join(site, 'print-whatsapp.png');
  if (!fs.existsSync(path.join(site, 'index.html'))) throw new Error('O site de prévia não saiu.');

  await progresso('Publicando a prévia');
  const destino = path.join(PASTA_PREVIAS, slug(empresa.nome));
  fs.rmSync(destino, { recursive: true, force: true });
  fs.mkdirSync(PASTA_PREVIAS, { recursive: true });
  fs.cpSync(site, destino, { recursive: true, filter: (f) => !/print-(desktop|celular)\.png$/.test(f) });
  fs.writeFileSync(path.join(PASTA_PREVIAS, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
  fs.writeFileSync(path.join(PASTA_PREVIAS, 'index.html'), '<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><title>Prévias</title>');
  fs.writeFileSync(path.join(PASTA_PREVIAS, 'vercel.json'), JSON.stringify({ headers: [{ source: '/(.*)', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }] }));
  const base = await deployPrevias();
  const link = `${base}/${slug(empresa.nome)}/`;
  const conf = await fetch(link);
  if (!conf.ok) throw new Error(`A prévia subiu mas não abre (${conf.status}): ${link}`);

  const guardado = path.join(RAIZ_HD, '.previas', 'prints', `${slug(empresa.nome)}.png`);
  fs.mkdirSync(path.dirname(guardado), { recursive: true });
  if (fs.existsSync(print)) fs.copyFileSync(print, guardado);
  const urlPrint = fs.existsSync(print) ? await hospedar(print, `previas/${randomUUID()}/${slug(empresa.nome)}.png`) : null;
  await registrarAtividade(empresa.id, 'nota', 'Prévia do site gerada', `Link: ${link}${urlPrint ? ` · Print: ${urlPrint}` : ''}`, job.criado_por || 'painel',
    { tipo_doc: 'previa', url: link, print: urlPrint, print_local: fs.existsSync(guardado) ? guardado : null });
  fs.rmSync(pasta, { recursive: true, force: true });
  return { url: link, print: urlPrint };
}

/* =============================== CNPJ em lote =============================== */
// Ramos da Receita (CNAE) por nicho. O cnae.js da skill busca por palavra e erra ("pet" vira petróleo):
// primeiro este mapa, depois só sugestões do cnae.js que dividem uma palavra de verdade com o nicho.
const CNAES_POR_NICHO = [
  [/estetic|depila|sobrancelh|micropigment/, ['9602502', '9602501']],
  [/barbear|salao|cabelei|manicur|beleza/, ['9602501', '9602502']],
  [/pet ?shop|banho e tosa|racao|racoes|animal|veterin/, ['4789004', '9609208', '7500100']],
  [/oficina|mecanic|auto ?center|funilar|lanternag/, ['4520001', '4520002', '4520003']],
  [/odonto|dentist|implant|ortodont/, ['8630504']],
  [/psicolog/, ['8650003']], [/fisioter|pilates/, ['8650004', '9313100']], [/nutri/, ['8650002']],
  [/clinica medica|consultorio|medic/, ['8630503', '8630501']],
  [/academia|crossfit|estudio de treino|musculac/, ['9313100']],
  [/restaurante/, ['5611201']], [/lanchonete|hamburg|pizzar/, ['5611203', '5611201']], [/padaria/, ['1091102', '4721102']],
  [/florica|flores/, ['4789002']], [/advoca|advogad/, ['6911701']], [/imobili|corretor/, ['6821801', '6821802']],
  [/arquitet/, ['7111100']], [/contab/, ['6920601']], [/roupa|moda|boutique/, ['4781400']], [/autoescola|auto escola/, ['8599601']],
  [/pelicula|insulfilm|som automotivo|acessorios automot/, ['4530703', '4520007']],
];
const semAcentoMin = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
async function ramoResponde(cnae) {
  try { const r = await fetch(`https://minhareceita.org/?municipio=2927408&cnae=${cnae}&limit=1`, { signal: AbortSignal.timeout(20000) }); return r.ok; } catch { return false; }
}
async function cnaesDoNicho(nicho) {
  const n = semAcentoMin(nicho);
  let lista = CNAES_POR_NICHO.find(([re]) => re.test(n))?.[1] || [];
  if (!lista.length) {
    const saida = await rodarScript('cnae.js', [nicho], { cwd: SKILL, timeoutMs: 60000 }).catch(() => '');
    const palavras = n.split(/[^a-z]+/).filter((w) => w.length >= 5 && !['clinica', 'servico', 'servicos', 'empresa', 'comercio'].includes(w));
    lista = [...saida.matchAll(/^\s*(\d{7})\s+(.+)$/gm)].filter((m) => palavras.some((w) => semAcentoMin(m[2]).includes(w.slice(0, 6)))).map((m) => m[1]).slice(0, 3);
  }
  const vivos = [];
  for (const c of lista) if (await ramoResponde(c)) vivos.push(c);
  return vivos;
}
export async function conferirCnpj(job, progresso, cancelado) {
  const ids = job.entrada?.item_ids || [];
  if (!ids.length) throw new Error('Nenhuma empresa para conferir.');
  const lista = await q1('select * from listas where id = $1', [job.lista_id || job.entrada?.lista_id]);
  if (!lista) throw new Error('Lista não encontrada.');
  const itens = await q('select * from lista_itens where id = any($1)', [ids]);
  const [cidade, uf] = String(lista.cidade || itens[0]?.cidade || '').split(',').map((s) => s.trim());
  if (!cidade) throw new Error('A lista não tem cidade.');
  await progresso('Escolhendo os ramos da Receita');
  const cnaes = await cnaesDoNicho(lista.nicho || itens[0]?.categoria || '');
  if (!cnaes.length) throw new Error(`Não achei ramo da Receita para "${lista.nicho}" que esteja respondendo agora. Tente mais tarde.`);
  const candidatos = itens.map((it) => ({
    _id: it.id, title: it.nome, phone: it.whatsapp || it.telefone || '', website: it.site || '', address: it.endereco || '', category: it.categoria || '',
    complete_address: { city: it.cidade || cidade, borough: it.bairro || '', postal_code: (String(it.endereco || '').match(/\d{5}-?\d{3}/) || [''])[0] },
    user_reviews: (it.dados?.comentarios || []).map((c) => ({ text: c.texto })), dono: it.dados?.dono_no_google || '',
  }));
  fs.mkdirSync(PASTA_CNPJ, { recursive: true });
  const entrada = path.join(PASTA_CNPJ, `entrada-${job.id}.json`);
  const saida = path.join(PASTA_CNPJ, `saida-${job.id}.json`);
  fs.writeFileSync(entrada, JSON.stringify({ candidatos }));
  await progresso(`Baixando a base da Receita (CNAE ${cnaes.join(', ')})`);
  const validar = () => rodarScript('valida.js', [entrada, saida, '--cidade', cidade, ...(uf ? ['--uf', uf] : []), '--cnae', cnaes.join(','), '--anos', '0', '--aceita-mei'], {
    cwd: SKILL, timeoutMs: 20 * 60000, aoLinha: (l) => { if (/^(APROVADO|REVISAR|REPROVADO|SEM_CNPJ)/.test(l)) progresso(l.slice(0, 120)); },
  });
  await validar();
  let resultado = JSON.parse(fs.readFileSync(saida, 'utf8'));
  // A base pública cai às vezes no meio: tenta de novo uma vez (o que já baixou fica guardado)
  if (resultado.parametros?.aviso_base && !/base parcial/.test(resultado.parametros.aviso_base)) {
    await progresso('A base da Receita falhou no meio. Tentando de novo.');
    await validar();
    resultado = JSON.parse(fs.readFileSync(saida, 'utf8'));
  }
  const contagem = {};
  for (const r of resultado.resultados || []) {
    const it = itens.find((x) => x.nome === r.title);
    if (!it) continue;
    contagem[r.veredito] = (contagem[r.veredito] || 0) + 1;
    const cnpj = r.cnpj ? digitos(r.cnpj) : null;
    const info = { veredito: r.veredito, motivos: r.motivos || [], casou_por: r.casou_por || [], conferido_em: new Date().toISOString(),
      receita: r.receita ? { razao: r.receita.razao, situacao: r.receita.situacao, abertura: r.receita.abertura, porte: r.receita.porte, mei: r.receita.mei, socios: r.receita.socios } : null,
      site_achado: r.site?.confirmado?.length ? r.site.confirmado : null };
    await q("update lista_itens set cnpj = coalesce($2, cnpj), dados = coalesce(dados, '{}'::jsonb) || jsonb_build_object('cnpj', $3::jsonb) where id = $1", [it.id, cnpj, JSON.stringify(info)]);
  }
  fs.rmSync(entrada, { force: true });
  if (resultado.parametros?.aviso_base) await progresso(`Base da Receita incompleta: ${String(resultado.parametros.aviso_base).slice(0, 100)}`);
  return { conferidos: (resultado.resultados || []).length, ...contagem, aviso: resultado.parametros?.aviso_base || null, cnaes };
}
