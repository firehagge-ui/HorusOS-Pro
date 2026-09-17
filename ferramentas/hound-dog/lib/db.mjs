// Conexão com o Postgres do Supabase (TLS verificado com a CA oficial do Supabase).
import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';
import { carregarEnv, RAIZ_HD } from './env.mjs';

carregarEnv();
const CA = fs.readFileSync(path.join(RAIZ_HD, 'certs', 'supabase-prod-ca-2021.crt'), 'utf8');

function opcoes(extra = {}) {
  const url = process.env.HD_DATABASE_URL;
  if (!url) throw new Error('HD_DATABASE_URL ausente. Rode: node scripts/configurar.mjs');
  const u = new URL(url);
  return {
    host: u.hostname, port: Number(u.port || 5432), user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password), database: u.pathname.replace(/^\//, '') || 'postgres',
    ssl: { ca: CA, servername: u.hostname }, ...extra,
  };
}

let pool;
export function db() {
  if (!pool) {
    pool = new pg.Pool(opcoes({ max: 6, idleTimeoutMillis: 30000, connectionTimeoutMillis: 15000 }));
    pool.on('error', (e) => console.error('[db] erro no pool:', e.message));
  }
  return pool;
}
export function novoCliente() { return new pg.Client(opcoes({ connectionTimeoutMillis: 15000, keepAlive: true })); }
export async function q(sql, params = []) { return (await db().query(sql, params)).rows; }
export async function q1(sql, params = []) { return (await db().query(sql, params)).rows[0] || null; }
export async function fecharDb() { if (pool) { await pool.end(); pool = null; } }
