// Conecta a conta Claude de um operador do Hounder neste PC (21/10/2026).
// Uso: npm run conta-claude -- Antônio
// Abre o Claude Code numa pasta só daquela pessoa (~/.claude-contas/<nome>). Ela mesma digita /login e entra
// com a conta DELA no navegador (de preferência numa janela anônima, pra não pegar a conta do Marcelo).
// Depois disso, o que essa pessoa pedir no painel (investigar, chat, Mídia...) roda na assinatura dela.
// Pra desconectar: apague a pasta.
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { binarioClaude, PASTA_CONTAS, slugConta } from '../farejador/claude.mjs';

const nome = process.argv.slice(2).join(' ').trim();
if (!nome) { console.error('Diga de quem é a conta: npm run conta-claude -- Antônio'); process.exit(1); }
const pasta = path.join(PASTA_CONTAS, slugConta(nome));
fs.mkdirSync(pasta, { recursive: true });
console.log(`\nConta Claude de ${nome}: ${pasta}`);
console.log('No Claude que vai abrir, digite /login e entre com a conta de', nome, '(não a do Marcelo). Depois, /exit.\n');
const { bin, shell } = binarioClaude();
const filho = spawn(bin, [], { stdio: 'inherit', shell, env: { ...process.env, CLAUDE_CONFIG_DIR: pasta } });
filho.on('close', () => {
  const ok = fs.existsSync(path.join(pasta, '.credentials.json'));
  console.log(ok ? `\nPronto: o que ${nome} pedir no Hounder roda na conta dele.` : `\nO login não foi concluído. Rode de novo quando ${nome} estiver junto.`);
});
