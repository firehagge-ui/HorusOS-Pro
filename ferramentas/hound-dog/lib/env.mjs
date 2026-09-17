// Carrega .segredos/.env (gitignorado) sem dependência externa.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const RAIZ_HD = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const RAIZ_REPO = path.resolve(RAIZ_HD, '..', '..');

export function carregarEnv() {
  const arq = path.join(RAIZ_HD, '.segredos', '.env');
  if (fs.existsSync(arq)) {
    for (const linha of fs.readFileSync(arq, 'utf8').split(/\r?\n/)) {
      const m = linha.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
  return process.env;
}
