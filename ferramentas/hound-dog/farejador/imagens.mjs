// =============================================================================
// Farejador — imagem dos posts pelo ChatGPT do Marcelo, no Chrome dele (21/10/2026).
// Pedido do Marcelo: os carrosséis do Mídia saíam só texto; o ChatGPT gera ilustração, objeto e cena,
// e o código encaixa no slide. Só o Chrome dele tem a sessão do ChatGPT (Playwright e o navegador do
// Farejador não têm), por isso o Claude roda em modo 'chrome' (claude.mjs).
// Chrome fora do ar não é erro: a tarefa espera e o Marcelo é avisado (ChromeFora).
// =============================================================================
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { rodarClaude } from './claude.mjs';

// mesma régua do tarefas.mjs (cópia pra não criar import circular tarefas → midia → imagens → tarefas)
const ehLimiteDoClaude = (e) => /session limit|usage limit|weekly limit|hit your .{0,20}limit|limite de uso|rate limit|resets? \d/i.test(String(e?.message || e || ''));

const SONNET = 'sonnet'; // operar o navegador não é escrita de post (essa é Opus)
const PASTAS_DOWNLOAD = [process.env.HD_DOWNLOADS, 'E:/Users/hagge/Downloads', path.join(os.homedir(), 'Downloads')].filter(Boolean);

/** Erro que manda a tarefa de volta pra fila (index.mjs lê `retomarEm`). */
export class ChromeFora extends Error {
  constructor(detalhe = '', minutos = 15) {
    super(`Esperando o Chrome do Marcelo (ChatGPT) ficar disponível${detalhe ? `: ${detalhe}` : ''}. Tento de novo em ${minutos} min.`);
    this.retomarEm = new Date(Date.now() + minutos * 60000);
    this.chromeFora = true;
  }
}

const ESQ_TESTE = { type: 'object', additionalProperties: false, required: ['ok', 'erro'], properties: { ok: { type: 'boolean' }, erro: { type: 'string' } } };

/** O Chrome do Marcelo responde à extensão? Uma chamada curta no Sonnet. Limite do Claude sobe como erro (a fila já sabe esperar). */
export async function chromeOnline() {
  try {
    const r = await rodarClaude({
      prompt: 'Chame a ferramenta mcp__claude-in-chrome__tabs_context_mcp uma vez. Não abra, não clique e não navegue em nada. Se ela respondeu sem erro, ok = true e erro = "". Se deu erro ou a ferramenta não existe, ok = false e erro = a mensagem exata.',
      modelo: SONNET, modo: 'chrome', esquemaJson: ESQ_TESTE, timeoutMs: 3 * 60000,
    });
    return { ok: Boolean(r.json?.ok), erro: r.json?.erro || (r.json ? '' : 'sem resposta') };
  } catch (e) {
    if (ehLimiteDoClaude(e)) throw e;
    return { ok: false, erro: String(e.message || e).slice(0, 200) };
  }
}

const ESQ_GERAR = {
  type: 'object', additionalProperties: false, required: ['imagens'],
  properties: { imagens: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['nome', 'ok', 'erro'],
    properties: { nome: { type: 'string' }, ok: { type: 'boolean' }, erro: { type: 'string' } } } } },
};

/** Arquivo baixado mais novo que começa com `nome`, depois de `desde`. */
function acharBaixado(nome, desde) {
  const achados = [];
  for (const dir of PASTAS_DOWNLOAD) {
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (!f.startsWith(nome) || !/\.(png|jpe?g|webp)$/i.test(f)) continue;
      const p = path.join(dir, f);
      const st = fs.statSync(p);
      if (st.mtimeMs >= desde - 5000 && st.size > 20000) achados.push({ p, t: st.mtimeMs });
    }
  }
  return achados.sort((a, b) => b.t - a.t)[0]?.p || null;
}

/**
 * Gera as imagens de um post numa conversa só do ChatGPT (mesmo estilo entre elas) e move pra `pastaImg`.
 * pedidos: [{ chave: 'slide-01', prompt }]. Devolve { 'slide-01': '<caminho absoluto>' } só com as que vieram.
 * Chrome caiu no meio = ChromeFora (a tarefa espera; o que já foi baixado fica salvo e não se gera de novo).
 */
export async function gerarImagens({ pedidos, pastaImg, estilo, rotulo = 'post', aoProgresso }) {
  fs.mkdirSync(pastaImg, { recursive: true });
  const prontas = {};
  const faltam = [];
  for (const p of pedidos) {
    const ja = fs.readdirSync(pastaImg).find((f) => f.startsWith(`${p.chave}.`));
    if (ja) prontas[p.chave] = path.join(pastaImg, ja); else faltam.push(p);
  }
  if (!faltam.length) return prontas;

  const online = await chromeOnline();
  if (!online.ok) throw new ChromeFora(online.erro);

  const carimbo = Date.now().toString(36);
  const nomes = faltam.map((p) => ({ ...p, nome: `horus-${rotulo}-${p.chave}-${carimbo}`.replace(/[^a-z0-9-]+/gi, '-').slice(0, 90) }));
  aoProgresso?.(`Pedindo ${nomes.length} imagem(ns) ao ChatGPT pelo Chrome`);
  const desde = Date.now();
  let r;
  try {
    r = await rodarClaude({
      modelo: SONNET, modo: 'chrome', esquemaJson: ESQ_GERAR, timeoutMs: (6 + nomes.length * 4) * 60000,
      prompt: `Gere imagens no ChatGPT do Marcelo, pelo Chrome dele, e baixe cada uma com o nome pedido. São para um carrossel do Instagram da Horus.

COMO FAZER (método que já funcionou)
1. tabs_create_mcp e navigate para https://chatgpt.com/ (conversa normal: o chat temporário não gera imagem, testado em 21/10/2026).
2. Antes de cada pedido, ache o campo de digitar com find ("Pergunte alguma coisa" / "Ask anything"); nunca use coordenada antiga, a janela muda de tamanho.
3. Para cada imagem, na MESMA conversa (pra manter o estilo entre elas): digite "Gere uma imagem: " + o prompt + o estilo abaixo, Enter.
   Espere de 60 a 120 s, conferindo com javascript_tool se apareceu uma img nova com naturalWidth > 900 (alt costuma começar com "Imagem gerada" ou "Generated image").
   Se o ChatGPT recusar, pedir pra confirmar ou der erro, tente uma vez com o prompt mais simples; se falhar de novo, ok = false com o motivo.
4. Baixe a imagem nova com javascript_tool, num comando só e com await:
   const imgs=[...document.querySelectorAll('img')].filter(i=>i.naturalWidth>900); const img=imgs[imgs.length-1];
   const b=await (await fetch(img.src)).blob(); const a=document.createElement('a'); a.href=URL.createObjectURL(b);
   a.download='<NOME>.png'; document.body.appendChild(a); a.click(); await new Promise(r=>setTimeout(r,2000)); 'ok'
5. No fim, feche a aba que você abriu (tabs_close_mcp). Não mexa em outras abas do Marcelo.
Se o Chrome não responder ou o ChatGPT pedir login, pare e devolva ok = false com erro começando por "CHROME:".

ESTILO (colar em todo prompt, em inglês): ${estilo}

IMAGENS
${nomes.map((p) => `- nome: ${p.nome}\n  prompt: ${p.prompt}`).join('\n')}

Devolva no formato pedido: um item por imagem, com o nome, ok e o erro ("" quando deu certo).`,
    });
  } catch (e) {
    if (ehLimiteDoClaude(e)) throw e;
    throw new ChromeFora(String(e.message || e).slice(0, 160));
  }
  const falhas = [];
  for (const p of nomes) {
    const baixado = acharBaixado(p.nome, desde);
    if (!baixado) { falhas.push(`${p.chave}: ${(r.json?.imagens || []).find((x) => x.nome === p.nome)?.erro || 'não baixou'}`); continue; }
    const destino = path.join(pastaImg, `${p.chave}${path.extname(baixado).toLowerCase()}`);
    try { fs.renameSync(baixado, destino); } catch { fs.copyFileSync(baixado, destino); fs.unlinkSync(baixado); } // outro disco: copia
    prontas[p.chave] = destino;
  }
  if (falhas.length && falhas.every((f) => /CHROME:/i.test(f))) throw new ChromeFora(falhas[0].replace(/^.*CHROME:\s*/i, '').slice(0, 160));
  return Object.assign(prontas, falhas.length ? { _falhas: falhas } : {});
}
