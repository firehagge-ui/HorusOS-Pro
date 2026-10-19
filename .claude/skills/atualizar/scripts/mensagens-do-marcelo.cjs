// Junta as mensagens que o Marcelo digitou nas conversas do Claude Code, em ordem de data, sem repetição.
// É a matéria-prima da retrospectiva do /atualizar: correção, escolha, elogio e pergunta "por quê?" moram aqui,
// e muitas vezes não chegaram a nenhum arquivo.
//
// Uso:
//   node mensagens-do-marcelo.cjs --termo "débora|debora" --desde 2026-10-09 [--contexto] [--max 900]
//
//   --termo     regex (sem diferenciar maiúscula) que a conversa precisa conter; sem ele, todas as conversas do período
//   --desde     data AAAA-MM-DD (UTC) da primeira mensagem considerada
//   --contexto  mostra antes de cada mensagem o fim da última resposta do Claude (o que ele estava corrigindo)
//   --max       corta cada mensagem nesse número de caracteres (padrão 900)
//
// As conversas ficam em ~/.claude/projects/E--Users-hagge-Downloads-HorusOS/*.jsonl.
// Sessões na nuvem (claude.ai/code) não ficam aqui: o que veio delas está no Hounder e no dossiê do cliente.

const fs = require('fs'), path = require('path'), os = require('os'), readline = require('readline');
const args = process.argv.slice(2);
const opt = n => { const i = args.indexOf(n); return i > -1 ? args[i + 1] : null; };
const termo = opt('--termo') ? new RegExp(opt('--termo'), 'i') : null;
const desde = opt('--desde') || '0000';
const max = +(opt('--max') || 900);
const comContexto = args.includes('--contexto');
const dir = opt('--dir') || path.join(os.homedir(), '.claude', 'projects', 'E--Users-hagge-Downloads-HorusOS');

const limpa = t => t.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, '').trim();
const ehRuido = t => !t || /^(<command-|<local-command|<task-notification|This session is being continued|\[Request interrupted|Caveat:)/.test(t);

(async () => {
  const arquivos = fs.readdirSync(dir).filter(f => f.endsWith('.jsonl'))
    .map(f => path.join(dir, f)).filter(f => fs.statSync(f).mtime.toISOString().slice(0, 10) >= desde);
  const vistas = new Set(), saida = [];
  for (const arq of arquivos) {
    if (termo && !termo.test(fs.readFileSync(arq, 'utf8'))) continue;
    let ultimaDoClaude = '';
    const rl = readline.createInterface({ input: fs.createReadStream(arq) });
    for await (const linha of rl) {
      let o; try { o = JSON.parse(linha); } catch { continue; }
      const c = o.message && o.message.content;
      if (o.type === 'assistant' && Array.isArray(c)) {
        const t = c.filter(b => b.type === 'text').map(b => b.text).join('\n').trim();
        if (t) ultimaDoClaude = t;
        continue;
      }
      if (o.type !== 'user' || o.isMeta || o.isCompactSummary) continue;
      let t = typeof c === 'string' ? c : Array.isArray(c) ? c.filter(b => b.type === 'text').map(b => b.text).join('\n') : '';
      t = limpa(t);
      if (ehRuido(t) || (o.timestamp || '') < desde) continue;
      const chave = t.slice(0, 200);
      if (vistas.has(chave)) continue; // a mesma conversa aparece em mais de um arquivo (teleporte, retomada)
      vistas.add(chave);
      saida.push({
        quando: (o.timestamp || '').slice(0, 16).replace('T', ' '),
        sessao: path.basename(arq).slice(0, 8),
        texto: t.slice(0, max).replace(/\s*\n+\s*/g, ' / '),
        antes: comContexto ? ultimaDoClaude.slice(-350).replace(/\s*\n+\s*/g, ' / ') : '',
      });
    }
  }
  saida.sort((a, b) => a.quando.localeCompare(b.quando));
  for (const m of saida) {
    if (m.antes) console.log(`    [Claude antes] …${m.antes}`);
    console.log(`- ${m.quando} UTC (${m.sessao}) | ${m.texto}`);
  }
  console.log(`\n${saida.length} mensagens em ${arquivos.length} conversas do período${termo ? ' (filtradas por termo)' : ''}.`);
})();
