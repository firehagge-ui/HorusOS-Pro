// Gera .segredos/.env a partir da senha do banco (não imprime segredos).
import fs from 'node:fs';
import path from 'node:path';
import { RAIZ_HD, RAIZ_REPO } from '../lib/env.mjs';

const REF = 'zzkawmjpjhluiztemlmr';
const senha = fs.readFileSync(path.join(RAIZ_HD, '.segredos', 'db-password.txt'), 'utf8').trim();
const linhas = [
  '# Hound Dog — segredos locais (NUNCA versionar)',
  `HD_SUPABASE_URL=https://${REF}.supabase.co`,
  'HD_SUPABASE_PUBLISHABLE_KEY=sb_publishable_pMYFoXHwNknV8IOhtBF2Pg_yzLbIoth',
  `HD_DATABASE_URL=postgresql://postgres.${REF}:${encodeURIComponent(senha)}@aws-0-sa-east-1.pooler.supabase.com:5432/postgres`,
  `HD_REPO_ROOT=${RAIZ_REPO}`,
];
fs.writeFileSync(path.join(RAIZ_HD, '.segredos', '.env'), linhas.join('\n') + '\n', { mode: 0o600 });
console.log('ok: .segredos/.env escrito (', linhas.length - 1, 'variáveis )');
