// Log simples do Farejador: console + arquivo do dia (farejador/logs/).
import fs from 'node:fs';
import path from 'node:path';
import { RAIZ_HD } from '../lib/env.mjs';

const PASTA = path.join(RAIZ_HD, 'farejador', 'logs');
fs.mkdirSync(PASTA, { recursive: true });

export function log(area, msg) {
  const agora = new Date();
  const hora = agora.toLocaleTimeString('pt-BR', { timeZone: 'America/Bahia' });
  const linha = `${hora} [${area}] ${msg}`;
  console.log(linha);
  try { fs.appendFileSync(path.join(PASTA, `farejador-${agora.toISOString().slice(0, 10)}.log`), `${agora.toISOString()} [${area}] ${msg}\n`); } catch { /* sem log em arquivo */ }
}

export function logErro(area, e) {
  log(area, `ERRO: ${e?.stack || e?.message || e}`);
}
