// Cria (ou atualiza a senha de) um operador do Hound Dog direto no Auth do Supabase, via SQL.
// Uso: node scripts/criar-operador.mjs --email x@y --nome "Marcelo" --papel dono [--senha "..."]
// Sem --senha, gera uma forte e grava em .segredos/acessos.txt (gitignorado).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { RAIZ_HD } from '../lib/env.mjs';
import { db, fecharDb } from '../lib/db.mjs';

const args = Object.fromEntries(process.argv.slice(2).join(' ').split('--').filter(Boolean).map((s) => {
  const i = s.indexOf(' '); return i < 0 ? [s.trim(), true] : [s.slice(0, i).trim(), s.slice(i + 1).trim().replace(/^"|"$/g, '')];
}));
const email = String(args.email || '').toLowerCase();
const nome = args.nome || email.split('@')[0];
const papel = args.papel === 'dono' ? 'dono' : 'operador';
if (!email.includes('@')) { console.error('Informe --email'); process.exit(1); }

function gerarSenha() {
  const a = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  let s = ''; for (const b of crypto.randomBytes(14)) s += a[b % a.length];
  return s.slice(0, 5) + '-' + s.slice(5, 10) + '-' + s.slice(10);
}
const senha = typeof args.senha === 'string' && args.senha.length >= 10 ? args.senha : gerarSenha();

const c = await db().connect();
try {
  await c.query('begin');
  const cols = (await c.query(`select column_name, data_type, is_nullable from information_schema.columns
                               where table_schema='auth' and table_name='users'`)).rows;
  const existe = (await c.query('select id from auth.users where lower(email)=$1', [email])).rows[0];
  let userId;
  if (existe) {
    userId = existe.id;
    await c.query(`update auth.users set encrypted_password = extensions.crypt($1, extensions.gen_salt('bf')),
                   email_confirmed_at = coalesce(email_confirmed_at, now()), updated_at = now() where id = $2`, [senha, userId]);
  } else {
    userId = crypto.randomUUID();
    const valores = {
      instance_id: '00000000-0000-0000-0000-000000000000', id: userId, aud: 'authenticated', role: 'authenticated',
      email, email_confirmed_at: new Date().toISOString(),
      raw_app_meta_data: JSON.stringify({ provider: 'email', providers: ['email'] }),
      raw_user_meta_data: JSON.stringify({ nome }), created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      is_sso_user: false, is_anonymous: false,
    };
    // colunas de token em texto precisam de '' (não NULL) pro GoTrue não quebrar
    for (const col of cols) {
      if (/token|email_change$|phone_change$/.test(col.column_name) && col.data_type.includes('char') && !(col.column_name in valores)) {
        valores[col.column_name] = '';
      }
    }
    const nomesCols = Object.keys(valores).filter((k) => cols.some((c2) => c2.column_name === k));
    const params = nomesCols.map((k) => valores[k]);
    const place = nomesCols.map((k, i) => (k === 'id' || k === 'instance_id') ? `$${i + 1}::uuid` : `$${i + 1}`);
    await c.query(`insert into auth.users (${nomesCols.join(',')}, encrypted_password)
                   values (${place.join(',')}, extensions.crypt($${nomesCols.length + 1}, extensions.gen_salt('bf')))`, [...params, senha]);
    await c.query(`insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
                   values (gen_random_uuid(), $1::uuid, $1::text, jsonb_build_object('sub',$1::text,'email',$2::text,'email_verified',true), 'email', now(), now(), now())`,
                  [userId, email]);
  }
  await c.query(`insert into public.operadores (user_id, nome, email, papel) values ($1,$2,$3,$4)
                 on conflict (user_id) do update set nome=excluded.nome, email=excluded.email, papel=excluded.papel`,
                [userId, nome, email, papel]);
  await c.query('commit');
  const arq = path.join(RAIZ_HD, '.segredos', 'acessos.txt');
  fs.appendFileSync(arq, `${new Date().toISOString()}  ${nome} <${email}>  papel=${papel}  senha=${senha}\n`, { mode: 0o600 });
  console.log(`ok: operador ${nome} <${email}> (${papel}) ${existe ? 'atualizado' : 'criado'}. Senha gravada em .segredos/acessos.txt`);
} catch (e) {
  await c.query('rollback'); console.error('erro:', e.message); process.exitCode = 1;
} finally { c.release(); await fecharDb(); }
