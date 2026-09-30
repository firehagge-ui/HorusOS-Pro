// =============================================================================
// Camada de marca: carrega marcas/<id>.json e o segredo da conta.
// O cérebro de social media é o mesmo para todas; muda só este parâmetro.
// =============================================================================
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const RAIZ_SOCIAL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const RAIZ_REPO = path.resolve(RAIZ_SOCIAL, '..', '..');
const PASTA_SEGREDOS = path.join(RAIZ_SOCIAL, '.segredos');

const FALTA = /^\[FALTA/;

export function carregarMarca(id) {
  const arq = path.join(RAIZ_SOCIAL, 'marcas', `${id}.json`);
  if (!fs.existsSync(arq)) throw new Error(`Marca "${id}" não cadastrada (esperado ${path.relative(RAIZ_REPO, arq)}).`);
  const marca = JSON.parse(fs.readFileSync(arq, 'utf8'));
  const faltando = (marca.contexto || []).filter((c) => !fs.existsSync(path.join(RAIZ_REPO, c)));
  return { ...marca, contextoFaltando: faltando };
}

/** @ oficial confirmado? Enquanto for [FALTA], o motor lê mas não escreve. */
export function handleConfirmado(marca) {
  return Boolean(marca.handle) && !FALTA.test(marca.handle);
}

export function lerSegredo(id) {
  if (process.env.IG_TOKEN) return { token: process.env.IG_TOKEN, user_id: process.env.IG_USER_ID || 'me', origem: 'variável de ambiente' };
  const arq = path.join(PASTA_SEGREDOS, `${id}.json`);
  if (!fs.existsSync(arq)) return null;
  return { ...JSON.parse(fs.readFileSync(arq, 'utf8')), origem: path.relative(RAIZ_REPO, arq) };
}

export function gravarSegredo(id, dados) {
  fs.mkdirSync(PASTA_SEGREDOS, { recursive: true });
  const arq = path.join(PASTA_SEGREDOS, `${id}.json`);
  const atual = fs.existsSync(arq) ? JSON.parse(fs.readFileSync(arq, 'utf8')) : {};
  fs.writeFileSync(arq, JSON.stringify({ ...atual, ...dados }, null, 2));
  return path.relative(RAIZ_REPO, arq);
}

/**
 * Trava de conta: a conta do token tem que ser a conta da marca.
 * Devolve null se bate, ou o motivo se não bate.
 */
export function conferirConta(marca, perfil) {
  if (!handleConfirmado(marca)) return `O @ da marca "${marca.id}" ainda não foi confirmado (${marca.handle}). Só leitura.`;
  const esperado = marca.handle.replace(/^@/, '').toLowerCase();
  const real = String(perfil?.username || '').toLowerCase();
  if (esperado !== real) return `O token é da conta @${real}, mas a marca "${marca.id}" é @${esperado}. Nada será escrito.`;
  return null;
}
