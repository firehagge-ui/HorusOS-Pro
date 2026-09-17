// Cria (ou troca a senha de) um operador do Hound Dog direto no Auth do Supabase.
// Usado pelo script de linha de comando e pelo Farejador (job criar_operador).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { RAIZ_HD } from './env.mjs';
import { db } from './db.mjs';

export function gerarSenha() {
  const a = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  let s = '';
  for (const b of crypto.randomBytes(14)) s += a[b % a.length];
  return `${s.slice(0, 5)}-${s.slice(5, 10)}-${s.slice(10)}`;
}

export async function criarOperador({ email, nome, papel = 'operador', senha }) {
  const mail = String(email || '').trim().toLowerCase();
  if (!mail.includes('@')) throw new Error('E-mail inválido');
  const nomeFinal = nome || mail.split('@')[0];
  const papelFinal = papel === 'dono' ? 'dono' : 'operador';
  const chave = senha && senha.length >= 10 ? senha : gerarSenha();
  const c = await db().connect();
  try {
    await c.query('begin');
    const cols = (await c.query("select column_name, data_type from information_schema.columns where table_schema='auth' and table_name='users'")).rows;
    const existe = (await c.query('select id from auth.users where lower(email) = $1', [mail])).rows[0];
    let userId;
    if (existe) {
      userId = existe.id;
      await c.query(`update auth.users set encrypted_password = extensions.crypt($1, extensions.gen_salt('bf')),
                     email_confirmed_at = coalesce(email_confirmed_at, now()), updated_at = now() where id = $2`, [chave, userId]);
    } else {
      userId = crypto.randomUUID();
      const valores = {
        instance_id: '00000000-0000-0000-0000-000000000000', id: userId, aud: 'authenticated', role: 'authenticated', email: mail,
        email_confirmed_at: new Date().toISOString(), raw_app_meta_data: JSON.stringify({ provider: 'email', providers: ['email'] }),
        raw_user_meta_data: JSON.stringify({ nome: nomeFinal }), created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        is_sso_user: false, is_anonymous: false,
      };
      for (const col of cols) {
        if (/token|email_change$|phone_change$/.test(col.column_name) && col.data_type.includes('char') && !(col.column_name in valores)) valores[col.column_name] = '';
      }
      const nomes = Object.keys(valores).filter((k) => cols.some((c2) => c2.column_name === k));
      const place = nomes.map((k, i) => ((k === 'id' || k === 'instance_id') ? `$${i + 1}::uuid` : `$${i + 1}`));
      await c.query(`insert into auth.users (${nomes.join(',')}, encrypted_password) values (${place.join(',')}, extensions.crypt($${nomes.length + 1}, extensions.gen_salt('bf')))`,
        [...nomes.map((k) => valores[k]), chave]);
      await c.query(`insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
                     values (gen_random_uuid(), $1::uuid, $1::text, jsonb_build_object('sub',$1::text,'email',$2::text,'email_verified',true), 'email', now(), now(), now())`, [userId, mail]);
    }
    await c.query(`insert into public.operadores (user_id, nome, email, papel) values ($1,$2,$3,$4)
                   on conflict (user_id) do update set nome = excluded.nome, email = excluded.email, papel = excluded.papel`, [userId, nomeFinal, mail, papelFinal]);
    await c.query('commit');
    try {
      fs.mkdirSync(path.join(RAIZ_HD, '.segredos'), { recursive: true });
      fs.appendFileSync(path.join(RAIZ_HD, '.segredos', 'acessos.txt'), `${new Date().toISOString()}  ${nomeFinal} <${mail}>  papel=${papelFinal}  senha=${chave}\n`, { mode: 0o600 });
    } catch { /* sem arquivo, segue */ }
    return { user_id: userId, email: mail, nome: nomeFinal, papel: papelFinal, criado: !existe };
  } catch (e) {
    await c.query('rollback').catch(() => {});
    throw e;
  } finally { c.release(); }
}
