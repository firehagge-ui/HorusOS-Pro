// Teste de ponta a ponta do login e da RLS (não imprime senha nem token).
import fs from 'node:fs';
import path from 'node:path';
import { RAIZ_HD, carregarEnv } from '../lib/env.mjs';
carregarEnv();
const email = process.argv[2] || 'firehagge@gmail.com';
const linhas = fs.readFileSync(path.join(RAIZ_HD, '.segredos', 'acessos.txt'), 'utf8').trim().split('\n').filter((l) => l.includes(`<${email}>`));
const senha = linhas.at(-1).match(/senha=(\S+)/)[1];
const URL_ = process.env.HD_SUPABASE_URL, KEY = process.env.HD_SUPABASE_PUBLISHABLE_KEY;
const r = await fetch(`${URL_}/auth/v1/token?grant_type=password`, { method: 'POST', headers: { apikey: KEY, 'content-type': 'application/json' }, body: JSON.stringify({ email, password: senha }) });
const j = await r.json();
console.log('login:', r.status, j.access_token ? 'token recebido' : JSON.stringify(j).slice(0, 200));
if (!j.access_token) process.exit(1);
for (const t of ['estagios', 'playbook_objecoes', 'config', 'operadores']) {
  const rr = await fetch(`${URL_}/rest/v1/${t}?select=*`, { headers: { apikey: KEY, Authorization: `Bearer ${j.access_token}` } });
  const dados = await rr.json();
  console.log(`com login  ${t}:`, rr.status, Array.isArray(dados) ? `${dados.length} linhas` : JSON.stringify(dados).slice(0, 120));
}
const anon = await fetch(`${URL_}/rest/v1/empresas?select=*`, { headers: { apikey: KEY } });
console.log('sem login  empresas:', anon.status, (await anon.text()).slice(0, 120));
