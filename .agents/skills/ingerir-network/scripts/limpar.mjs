#!/usr/bin/env node
/**
 * limpar.mjs — pré-processador determinístico do /ingerir-network
 * =============================================================================
 * Lê o(s) export(s) .txt de grupo de WhatsApp e produz, SEM usar nenhum LLM
 * (zero token), um texto limpo, anonimizado e fatiado em chunks — para que só o
 * material destilável chegue aos subagentes, e nunca o bruto na conversa principal.
 *
 * Faz:
 *   1. Detecta o formato de linha (iOS com colchetes / Android com hífen, PT e EN).
 *   2. Reagrupa mensagens multi-linha.
 *   3. Descarta linha de sistema, mídia omitida, mensagem apagada e ruído social.
 *   4. Anonimiza: autor vira M01/M02…, remove @menção e telefone do corpo.
 *   5. Fatia em chunks de tamanho controlado (para 1 subagente por chunk).
 *   6. Escreve stats.json (o ÚNICO arquivo que a conversa principal lê).
 *
 * Uso (de dentro da raiz do repo):
 *   node .claude/skills/ingerir-network/scripts/limpar.mjs <arquivo.txt | pasta> [--out <dir>] [--chunk-kb 140]
 *
 * Saída (default em <pasta-do-input>/.ingest/):
 *   stats.json, chunk-001.txt … chunk-NNN.txt
 *
 * O mapa autor→pseudônimo NÃO é gravado (privacidade). Os chunks e o .ingest/
 * inteiro podem/​devem ser apagados após a destilação.
 */
import fs from 'node:fs'
import path from 'node:path'

// ── args ────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2)
if (argv.length === 0 || argv[0].startsWith('--')) {
  console.error('Uso: node limpar.mjs <arquivo.txt | pasta> [--out <dir>] [--chunk-kb 140]')
  process.exit(1)
}
const input = argv[0]
const outFlag = argv.indexOf('--out')
const chunkFlag = argv.indexOf('--chunk-kb')
const CHUNK_KB = chunkFlag !== -1 ? Number(argv[chunkFlag + 1]) : 140
const CHUNK_BYTES = CHUNK_KB * 1024

// ── coleta os arquivos .txt ──────────────────────────────────────────────────
function collectFiles(p) {
  const st = fs.statSync(p)
  if (st.isDirectory()) {
    return fs.readdirSync(p)
      .filter((f) => f.toLowerCase().endsWith('.txt'))
      .map((f) => path.join(p, f))
  }
  return [p]
}
const files = collectFiles(input)
if (files.length === 0) { console.error('Nenhum .txt encontrado em', input); process.exit(1) }

const inputDir = fs.statSync(input).isDirectory() ? input : path.dirname(input)
const outDir = outFlag !== -1 ? argv[outFlag + 1] : path.join(inputDir, '.ingest')
fs.mkdirSync(outDir, { recursive: true })

// ── detecção de início de mensagem ───────────────────────────────────────────
// iOS:      [08/09/2026, 14:32:01] Nome: texto   /  [08/09/26, 2:32:01 PM] Nome: texto
// Android:  08/09/2026 14:32 - Nome: texto        /  9/8/26, 2:32 PM - Nome: texto
const RE_IOS = /^‎?\[(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+\d{1,2}:\d{2}(?::\d{2})?\s*(?:[APap][Mm])?\]\s*([\s\S]*)$/
const RE_ANDROID = /^‎?(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+\d{1,2}:\d{2}(?::\d{2})?\s*(?:[APap][Mm])?\s+-\s+([\s\S]*)$/

function parseHeader(line) {
  let m = RE_IOS.exec(line)
  if (m) return { date: m[1], rest: m[2] }
  m = RE_ANDROID.exec(line)
  if (m) return { date: m[1], rest: m[2] }
  return null
}

// ── padrões de descarte (sistema / mídia / apagada), PT + EN ─────────────────
const SYS_PATTERNS = [
  /criptograf[ao]/i, /end-to-end encrypted/i, /encrypted\. (Tap|No one)/i,
  /criou (o|este) grupo/i, /created (this|the) group/i, /created group/i,
  /adicionou (você|o|a|\+)/i, /added (you|\+)/i, / added /i,
  /saiu(?:\s|$)/i, / left$/i, /removeu/i, / removed /i,
  /entrou usando o link/i, /joined using this group's invite/i, /joined using the invite/i,
  /mudou (o assunto|a descrição|o ícone|este grupo|o número|para)/i,
  /changed (the subject|this group|their phone number|the group|to)/i,
  /tornou-se (o |um )?admin/i, /is now an admin/i, /now an admin/i,
  /as configurações do grupo/i, /group settings/i,
  /mensagens temporárias/i, /disappearing messages/i,
  /código de segurança (mudou|alterado)/i, /security code changed/i,
  /você foi (adicionad|removid)/i, /you were (added|removed)/i,
  /ligação de vídeo perdida/i, /chamada perdida/i, /missed (voice|video) call/i,
  /waiting for this message/i, /aguardando esta mensagem/i,
]
const MEDIA_PATTERNS = [
  /<mídia oculta>/i, /<media omitted>/i, /mídia ocultad/i,
  /imagem ocultad/i, /image omitted/i,
  /vídeo omitido/i, /video omitted/i,
  /áudio ocultad/i, /audio omitted/i, /áudio omitido/i,
  /figurinha omitida/i, /sticker omitted/i,
  /gif omitido/i, /gif omitted/i,
  /documento omitido/i, /document omitted/i,
  /contato omitido/i, /contact card omitted/i,
  /localização compartilhada/i, /location: https?:\/\//i,
  /\bfile attached\b/i, /arquivo anexado/i,
]
const DELETED_PATTERNS = [
  /es[ts]a mensagem foi apagada/i, /this message was deleted/i,   // "esta" e "essa"
  /você apagou es[ts]a mensagem/i, /you deleted this message/i,
  /mensagem apagada/i,
]
function matchesAny(text, patterns) { return patterns.some((re) => re.test(text)) }

// ── ruído social: mensagens sem conteúdo destilável ──────────────────────────
const SOCIAL_EXACT = new Set([
  'bom dia', 'boa tarde', 'boa noite', 'kkk', 'kkkk', 'kkkkk', 'haha', 'hahaha',
  'top', 'show', 'valeu', 'vlw', 'obrigado', 'obrigada', 'isso', 'exato', 'sim',
  'nao', 'não', 'kk', 'amem', 'amém', 'parabéns', 'parabens', 'perfeito', 'ótimo',
  'otimo', 'legal', 'massa', 'boa', 'certo', 'ok', 'blz', 'beleza', 'concordo',
  'verdade', 'faz sentido', 'show de bola', 'top demais', 'salvo', 'salvando',
])
const BUSINESS_HINT = /r\$|reais|\d|cobr|preç|prec|mensal|setup|stack|ferrament|hosped|servidor|vps|supabase|vercel|netlify|coolify|docker|n8n|crm|funil|tráfeg|trafeg|anúnci|anunci|ads|propost|fech|contrat|nicho|lead|whats|automa|agente|\bia\b|gpt|api|domínio|dominio|checkout|infinitepay|frappe|kommo|gohighlevel/i

function stripEmojiPunct(s) {
  return s
    .replace(/[\p{Extended_Pictographic}‍️]/gu, '') // emoji
    .replace(/[^\p{L}\p{N}\s$]/gu, '')                          // pontuação
    .replace(/\s+/g, ' ')
    .trim()
}
function isSocialNoise(text) {
  const core = stripEmojiPunct(text).toLowerCase()
  if (core.length === 0) return true                     // só emoji/pontuação
  if (BUSINESS_HINT.test(text)) return false             // tem sinal → mantém
  if (SOCIAL_EXACT.has(core)) return true
  if (core.length < 8) return true                       // curtinho e sem sinal
  if (/^(k+|h+a*)+$/.test(core.replace(/\s/g, ''))) return true // kkkk / hahaha
  // saudação/interjeição com sufixo curto ("bom dia galera", "opa pessoal")
  if (/^(bom dia|boa tarde|boa noite|opa|eae|e ai|e aí|salve|fala|blz|bora)\b/i.test(core)
      && core.length < 28) return true
  return false
}

// ── anonimização do corpo ────────────────────────────────────────────────────
function anonymizeBody(text) {
  return text
    .replace(/‎/g, '')
    .replace(/@\d[\d\s-]{6,}\d/g, '@—')                  // @menção por número
    .replace(/@[A-Za-zÀ-ÿ][\w.]*/g, '@—')                // @menção por nome
    .replace(/\+?\d{2}[\s-]?\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}/g, '[tel]') // telefone
    .replace(/\bhttps?:\/\/\S+/g, (u) => u.split('?')[0]) // tira query string de link
    .trim()
}

// ── processa todos os arquivos ───────────────────────────────────────────────
const authors = new Map()  // nome real → pseudônimo (só em memória, nunca gravado)
function pseudo(name) {
  if (!authors.has(name)) authors.set(name, 'M' + String(authors.size + 1).padStart(2, '0'))
  return authors.get(name)
}

let formato = 'desconhecido'
const kept = []            // { p: pseudo, text }
const stats = {
  arquivos: files.length, linhas_totais: 0, mensagens_totais: 0,
  mantidas: 0, descartadas: { sistema: 0, midia: 0, apagada: 0, social: 0 },
  com_sinal_negocio: 0, autores: 0, periodo: { de: null, ate: null },
}

for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n')
  const lines = raw.split('\n')
  stats.linhas_totais += lines.length

  let cur = null // mensagem em construção { date, author, text, isSystem }
  const flush = () => {
    if (!cur) return
    stats.mensagens_totais++
    const body = (cur.text || '').trim()
    if (cur.isSystem)                    { stats.descartadas.sistema++; cur = null; return }
    if (matchesAny(body, DELETED_PATTERNS)) { stats.descartadas.apagada++; cur = null; return }
    if (matchesAny(body, MEDIA_PATTERNS) && stripEmojiPunct(body).length < 40)
                                         { stats.descartadas.midia++; cur = null; return }
    if (isSocialNoise(body))             { stats.descartadas.social++; cur = null; return }
    const clean = anonymizeBody(body)
    if (clean.length === 0)              { stats.descartadas.social++; cur = null; return }
    if (BUSINESS_HINT.test(clean)) stats.com_sinal_negocio++
    kept.push({ p: pseudo(cur.author), text: clean })
    stats.mantidas++
    cur = null
  }

  for (const line of lines) {
    const h = parseHeader(line)
    if (h) {
      flush()
      // define/atualiza período
      if (!stats.periodo.de) stats.periodo.de = h.date
      stats.periodo.ate = h.date
      // separa "Autor: texto" (mensagem) de system message (sem ": ")
      const idx = h.rest.indexOf(': ')
      if (idx === -1 || idx > 60) {
        cur = { date: h.date, author: null, text: h.rest, isSystem: true }
        formato = RE_IOS.test(line) ? 'ios' : 'android'
      } else {
        cur = {
          date: h.date,
          author: h.rest.slice(0, idx).trim(),
          text: h.rest.slice(idx + 2),
          isSystem: false,
        }
        formato = RE_IOS.test(line) ? 'ios' : 'android'
      }
    } else if (cur) {
      cur.text += '\n' + line   // continuação multi-linha
    }
  }
  flush()
}

stats.formato = formato
stats.autores = authors.size

// ── monta as linhas finais e fatia em chunks ─────────────────────────────────
const outLines = kept.map((m) => `${m.p}: ${m.text.replace(/\n+/g, ' ⏎ ')}`)
const full = outLines.join('\n')

let chunkIdx = 0
let buf = ''
const chunkFiles = []
function writeChunk() {
  if (!buf) return
  chunkIdx++
  const name = `chunk-${String(chunkIdx).padStart(3, '0')}.txt`
  fs.writeFileSync(path.join(outDir, name), buf, 'utf8')
  chunkFiles.push(name)
  buf = ''
}
for (const l of outLines) {
  if (Buffer.byteLength(buf) + Buffer.byteLength(l) + 1 > CHUNK_BYTES && buf) writeChunk()
  buf += l + '\n'
}
writeChunk()

stats.chunks = chunkFiles
stats.chunks_total = chunkFiles.length
stats.tamanho_limpo_kb = Math.round(Buffer.byteLength(full) / 1024)
fs.writeFileSync(path.join(outDir, 'stats.json'), JSON.stringify(stats, null, 2), 'utf8')

// ── resumo no stdout (é o que a conversa principal lê) ───────────────────────
const pct = stats.mensagens_totais
  ? Math.round((stats.mantidas / stats.mensagens_totais) * 100) : 0
console.log(`✔ Limpeza concluída (${formato}).`)
console.log(`  Mensagens: ${stats.mensagens_totais} → mantidas ${stats.mantidas} (${pct}%)`)
console.log(`  Descartadas: sistema ${stats.descartadas.sistema}, mídia ${stats.descartadas.midia}, apagada ${stats.descartadas.apagada}, social ${stats.descartadas.social}`)
console.log(`  Com sinal de negócio: ${stats.com_sinal_negocio} · Autores: ${stats.autores} · Período: ${stats.periodo.de} → ${stats.periodo.ate}`)
console.log(`  Limpo: ${stats.tamanho_limpo_kb} KB em ${stats.chunks_total} chunk(s) → ${outDir}`)
console.log(`\n  Próximo: 1 subagente por chunk (ver SKILL.md). stats.json escrito.`)
