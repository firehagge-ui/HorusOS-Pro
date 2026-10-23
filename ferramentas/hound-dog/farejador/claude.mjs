// =============================================================================
// Farejador — executa o Claude Code em modo headless (-p) pela assinatura do Marcelo.
// Sem chave de API: é o mesmo "claude" do terminal, rodando sem interface.
// =============================================================================
import { spawn, execFile } from 'node:child_process';
import { AsyncLocalStorage } from 'node:async_hooks';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { RAIZ_HD, RAIZ_REPO } from '../lib/env.mjs';
import { log } from './log.mjs';

const PASTA_LEVE = path.join(os.tmpdir(), 'hound-dog-claude-leve');
fs.mkdirSync(PASTA_LEVE, { recursive: true });
const MCP_CONFIG = path.join(RAIZ_HD, 'farejador', 'mcp-farejador.json');
const MCP_CONFIG_RESTRITO = path.join(RAIZ_HD, 'farejador', 'mcp-farejador-restrito.json');

/** Claude Code que vem dentro do app Claude (Windows): pega a versão mais nova, que muda a cada atualização do app. */
function claudeDoApp() {
  const base = path.join(process.env.LOCALAPPDATA || '', 'Claude-Data');
  if (!fs.existsSync(base)) return null;
  const achados = [];
  for (const pacote of fs.readdirSync(base)) {
    const cc = path.join(base, pacote, 'claude-code');
    if (!fs.existsSync(cc)) continue;
    for (const versao of fs.readdirSync(cc)) {
      const pv = path.join(cc, versao);
      if (!fs.statSync(pv).isDirectory()) continue;
      for (const h of fs.readdirSync(pv)) { const exe = path.join(pv, h, 'claude.exe'); if (fs.existsSync(exe)) achados.push({ versao, exe }); }
    }
  }
  const num = (v) => v.split('.').map((n) => Number(n) || 0);
  achados.sort((a, b) => { const x = num(a.versao), y = num(b.versao); for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return y[i] - x[i]; return 0; });
  return achados[0]?.exe || null;
}

export function binarioClaude() {
  if (process.env.HD_CLAUDE_BIN && fs.existsSync(process.env.HD_CLAUDE_BIN)) return { bin: process.env.HD_CLAUDE_BIN, shell: false };
  const candidatos = [
    path.join(process.env.APPDATA || '', 'npm', 'node_modules', '@anthropic-ai', 'claude-code', 'bin', 'claude.exe'),
    path.join(os.homedir(), '.local', 'bin', 'claude.exe'),
    path.join(os.homedir(), '.local', 'bin', 'claude'),
    '/usr/local/bin/claude',
  ];
  for (const c of candidatos) if (c && fs.existsSync(c)) return { bin: c, shell: false };
  // 21/10/2026: o Claude CLI global sumiu do PC; o do app Claude responde igual (mesma assinatura do Marcelo)
  const doApp = claudeDoApp();
  if (doApp) return { bin: doApp, shell: false };
  return { bin: 'claude', shell: true };
}

/* ------------------------------ conta do Claude por operador (21/10/2026) ------------------------------
   Pedido do Marcelo: o que o Antônio pede no painel roda na conta Claude DELE, não na do Marcelo.
   Cada operador com conta própria tem uma pasta em ~/.claude-contas/<nome> (o login é feito uma vez pelo
   próprio operador com `npm run conta-claude -- <Nome>`). A tarefa roda com CLAUDE_CONFIG_DIR apontando pra
   ela. Sem pasta = conta do Marcelo (padrão, e também o que o Farejador dispara sozinho: Mídia, agentes). */
export const PASTA_CONTAS = path.join(os.homedir(), '.claude-contas');
export const slugConta = (nome) => String(nome || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const contaAtual = new AsyncLocalStorage();

/** Pasta da conta de quem criou a tarefa, ou null (conta padrão). Falha se a pasta existe e o login não foi feito. */
export function pastaDaConta(nome) {
  const slug = slugConta(nome);
  if (!slug) return null;
  const pasta = path.join(PASTA_CONTAS, slug);
  if (!fs.existsSync(pasta)) return null;
  if (!fs.existsSync(path.join(pasta, '.credentials.json'))) throw new Error(`A conta do Claude de ${nome} ainda não foi conectada neste PC (npm run conta-claude -- ${nome}). Nada rodou na conta do Marcelo.`);
  return pasta;
}

/** Contas próprias deste PC e se o login já foi feito (o Farejador lista ao ligar). */
export function contasClaude() {
  if (!fs.existsSync(PASTA_CONTAS)) return [];
  return fs.readdirSync(PASTA_CONTAS).filter((n) => fs.statSync(path.join(PASTA_CONTAS, n)).isDirectory())
    .map((n) => ({ nome: n, conectada: fs.existsSync(path.join(PASTA_CONTAS, n, '.credentials.json')) }));
}

/** Roda `fn` com a conta do Claude de `nome` (usada pelo executor da fila). */
/** A tarefa atual roda restrita (pedido de operador que não é o dono)? Quem monta o pedido usa para não pôr nada de _gestao/. */
export const contaRestrita = () => Boolean(contaAtual.getStore()?.restrito);

export function comConta(nome, fn, { restrito = false } = {}) {
  const pasta = pastaDaConta(nome);
  // Operador que não é o dono só roda na conta dele: na do Marcelo o Claude carregaria a memória do Marcelo
  if (restrito && !pasta) throw new Error(`A conta do Claude de ${nome} ainda não foi conectada neste PC (npm run conta-claude -- ${nome}). Nada rodou na conta do Marcelo.`);
  return pasta || restrito ? contaAtual.run({ nome, pasta, restrito }, fn) : fn();
}

export function versaoClaude() {
  const { bin, shell } = binarioClaude();
  return new Promise((resolve) => {
    execFile(bin, ['--version'], { shell, timeout: 30000, windowsHide: true }, (err, stdout) => {
      if (err) resolve({ ok: false, info: `Claude CLI não respondeu: ${String(err.message).slice(0, 160)}` });
      else resolve({ ok: true, info: `Claude Code ${String(stdout).trim()}` });
    });
  });
}

const NOMES_FERRAMENTA = {
  WebSearch: ['busca', 'Busca na web'], WebFetch: ['globo', 'Lendo página'], Read: ['arquivo', 'Lendo arquivo'], Grep: ['busca', 'Procurando no repositório'], Glob: ['pasta', 'Listando arquivos'],
  mcp__firecrawl__firecrawl_search: ['busca', 'Firecrawl: busca'], mcp__firecrawl__firecrawl_scrape: ['globo', 'Firecrawl: página'], mcp__firecrawl__firecrawl_map: ['mapa', 'Firecrawl: mapa do site'],
  mcp__firecrawl__firecrawl_extract: ['planilha', 'Firecrawl: extração'],
};
export function rotuloFerramenta(nome, input = {}) {
  if (nome === "ToolSearch") return { nome, icone: "busca", rotulo: "Preparando ferramentas", detalhe: "", oculto: true };
  if (NOMES_FERRAMENTA[nome]) {
    const [icone, rotulo] = NOMES_FERRAMENTA[nome];
    const det = input.query || input.url || input.file_path || input.pattern || '';
    return { nome, icone, rotulo, detalhe: String(det).slice(0, 120) };
  }
  if (nome.startsWith('mcp__hound-dog__')) {
    const curto = nome.replace('mcp__hound-dog__', '');
    const mapa = { hd_salvar_empresa: 'Atualizou empresa', hd_mover_estagio: 'Moveu estágio', hd_registrar_atividade: 'Registrou atividade', hd_agendar: 'Agendou', hd_salvar_negocio: 'Salvou negócio', hd_lista_adicionar_itens: 'Adicionou leads', hd_salvar_pesquisa: 'Salvou pesquisa', hd_importar_leads: 'Importou leads' };
    return { nome, icone: /salvar|mover|registrar|agendar|adicionar|importar/.test(curto) ? 'check' : 'predio', rotulo: mapa[curto] || `Hound Dog: ${curto.replace(/^hd_/, '').replace(/_/g, ' ')}`, detalhe: JSON.stringify(input).slice(0, 140) };
  }
  if (nome.startsWith('mcp__')) return { nome, icone: 'raio', rotulo: nome.split('__').slice(1).join(' · '), detalhe: '' };
  return { nome, icone: 'raio', rotulo: nome, detalhe: '' };
}

/**
 * Roda o Claude e devolve { texto, json, ferramentas, custo, duracaoMs }.
 * modo 'horus': roda na raiz do repositório (CLAUDE.md, memória, .mcp.json com Firecrawl) + MCP do Hound Dog.
 * modo 'leve': pasta vazia fora do repo, sem ferramentas nem MCP (rápido e imune a injeção de prompt).
 * modo 'chrome': pasta vazia, só o Chrome do Marcelo (extensão Claude in Chrome). É assim que o Mídia usa o
 *   ChatGPT dele (21/10/2026): o Chrome tem a sessão; Playwright e o navegador do Farejador não têm.
 */
export function rodarClaude({
  prompt, sistema = '', modelo = 'sonnet', modo = 'horus', ferramentas = [], proibidas = [], timeoutMs = 10 * 60 * 1000,
  aoTexto, aoFerramenta, deveParar, esquemaJson, esforco,
}) {
  const { bin, shell } = binarioClaude();
  const conta = contaAtual.getStore();
  const args = ['-p', '--output-format', 'stream-json', '--verbose', '--include-partial-messages', '--model', modelo, '--no-session-persistence',
    '--permission-mode', 'dontAsk'];
  // Opus roda com esforço alto (pedido do Marcelo, 27/09); os outros no padrão do modelo
  const nivel = esforco || (/opus/i.test(modelo) ? 'high' : null);
  if (nivel) args.push('--effort', nivel);
  let cwd;
  if (modo === 'leve') {
    cwd = PASTA_LEVE;
    args.push('--setting-sources', 'project', '--strict-mcp-config', '--tools', ferramentas.length ? ferramentas.join(',') : '');
  } else if (modo === 'chrome') {
    cwd = PASTA_LEVE;
    args.push('--chrome', '--setting-sources', 'project', '--strict-mcp-config', '--tools', '', '--allowedTools', 'mcp__claude-in-chrome');
  } else {
    cwd = RAIZ_REPO;
    // Pedido de operador que não é o dono: MCP sem tarefas privadas e nada da pasta _gestao (acompanhamento do Marcelo)
    args.push('--setting-sources', 'project,local', '--mcp-config', conta?.restrito ? MCP_CONFIG_RESTRITO : MCP_CONFIG);
    if (ferramentas.length) args.push('--allowedTools', ferramentas.join(','));
    const bloquear = ['Bash', 'PowerShell', 'Write', 'Edit', 'NotebookEdit', 'MultiEdit', ...proibidas,
      ...(conta?.restrito ? ['Read(./_gestao/**)', 'Read(//E:/Users/hagge/Downloads/HorusOS/_gestao/**)'] : [])];
    args.push('--disallowedTools', bloquear.join(','));
  }
  if (sistema) args.push('--append-system-prompt', sistema);
  if (esquemaJson) args.push('--json-schema', JSON.stringify(esquemaJson));

  return new Promise((resolve, reject) => {
    const t0 = Date.now();
    const env = conta?.pasta ? { ...process.env, CLAUDE_CONFIG_DIR: conta.pasta } : process.env;
    const filho = spawn(bin, args, { cwd, shell, env, windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] });
    let buffer = '';
    let textoParcial = '';
    let textoFinal = null;
    let estruturado = null;
    let erroFinal = null;
    let stderr = '';
    const usadas = [];
    let resultadoEvento = null;
    let encerrado = false;

    const timer = setTimeout(() => { erroFinal = `O Claude passou de ${Math.round(timeoutMs / 60000)} min e foi interrompido.`; matar(); }, timeoutMs);
    const vigia = setInterval(async () => {
      try { if (deveParar && (await deveParar())) { erroFinal = 'Cancelado.'; matar(); } } catch { /* ignora */ }
    }, 5000);
    function matar() {
      if (encerrado) return;
      try { if (process.platform === 'win32') spawn('taskkill', ['/pid', String(filho.pid), '/T', '/F'], { windowsHide: true }); else filho.kill('SIGTERM'); } catch { /* ok */ }
    }

    function tratarLinha(linha) {
      if (!linha.trim()) return;
      let ev;
      try { ev = JSON.parse(linha); } catch { return; }
      if (ev.type === 'stream_event') {
        const d = ev.event?.delta;
        if (ev.event?.type === 'content_block_delta' && d?.type === 'text_delta') { textoParcial += d.text; aoTexto?.(textoParcial); }
        if (ev.event?.type === 'message_start' && textoParcial && !textoParcial.endsWith('\n\n')) { textoParcial += '\n\n'; }
        return;
      }
      if (ev.type === 'assistant') {
        for (const bloco of ev.message?.content || []) {
          if (bloco.type === 'tool_use') {
            const f = rotuloFerramenta(bloco.name, bloco.input);
            usadas.push(f);
            aoFerramenta?.(f, usadas);
          }
        }
        return;
      }
      if (ev.type === 'user') {
        for (const bloco of ev.message?.content || []) {
          if (bloco.type === 'tool_result' && bloco.is_error) {
            const ult = usadas[usadas.length - 1];
            if (ult) { ult.ok = false; aoFerramenta?.(ult, usadas); }
          }
        }
        return;
      }
      if (ev.type === 'result') {
        resultadoEvento = ev;
        if (ev.is_error || ev.subtype !== 'success') erroFinal = erroFinal || String(ev.result || ev.subtype || 'erro no Claude').slice(0, 500);
        textoFinal = typeof ev.result === 'string' ? ev.result : textoParcial;
        if (ev.structured_output) estruturado = ev.structured_output;
      }
    }

    filho.stdout.on('data', (b) => {
      buffer += b.toString('utf8');
      let i;
      while ((i = buffer.indexOf('\n')) >= 0) { const l = buffer.slice(0, i); buffer = buffer.slice(i + 1); tratarLinha(l); }
    });
    filho.stderr.on('data', (b) => { stderr += b.toString('utf8'); if (stderr.length > 20000) stderr = stderr.slice(-20000); });
    filho.on('error', (e) => { clearTimeout(timer); clearInterval(vigia); encerrado = true; reject(new Error(`Não consegui iniciar o Claude (${e.message}). Ele está instalado e logado?`)); });
    filho.on('close', (codigo) => {
      encerrado = true;
      clearTimeout(timer); clearInterval(vigia);
      if (buffer.trim()) tratarLinha(buffer);
      const texto = (textoFinal ?? textoParcial ?? '').trim();
      const custo = resultadoEvento?.total_cost_usd;
      const duracaoMs = Date.now() - t0;
      if (erroFinal || (codigo !== 0 && !texto)) {
        const msg = erroFinal || `Claude saiu com código ${codigo}. ${stderr.trim().split('\n').slice(-3).join(' ').slice(0, 300)}`;
        log('claude', `erro (${modelo}, ${Math.round(duracaoMs / 1000)}s): ${msg}`);
        const e = new Error(msg); e.parcial = texto; e.ferramentas = usadas; reject(e);
        return;
      }
      const json = estruturado || extrairJson(texto);
      log('claude', `ok (${modelo}, ${modo}, ${Math.round(duracaoMs / 1000)}s, ${usadas.length} ferramentas${conta ? `, conta de ${conta.nome}` : ''})`);
      resolve({ texto, json, ferramentas: usadas, custo, duracaoMs });
    });

    filho.stdin.write(prompt);
    filho.stdin.end();
  });
}

/** Pega o último bloco ```json ...``` (ou o maior objeto { } ) do texto. */
export function extrairJson(texto) {
  if (!texto) return null;
  const blocos = [...texto.matchAll(/```(?:json)?\s*([\s\S]*?)```/gi)].map((m) => m[1].trim()).filter((b) => /^[[{]/.test(b));
  for (const b of blocos.reverse()) { try { return JSON.parse(b); } catch { /* tenta o próximo */ } }
  const ini = texto.indexOf('{'), fim = texto.lastIndexOf('}');
  if (ini >= 0 && fim > ini) { try { return JSON.parse(texto.slice(ini, fim + 1)); } catch { /* sem json */ } }
  return null;
}
