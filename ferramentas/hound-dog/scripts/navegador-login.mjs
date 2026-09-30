// Abre o Chrome no perfil do Farejador (ferramentas/hound-dog/.navegador) pra o Marcelo logar UMA vez
// no Instagram e no Google. A investigação usa esse mesmo perfil, invisível, com a sessão salva.
// Nunca guardar senha em arquivo: o login é feito à mão, na janela.
// Uso: npm run navegador   (feche a janela quando terminar; o Farejador não pode estar investigando)
import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { RAIZ_HD } from '../lib/env.mjs';

const perfil = path.join(RAIZ_HD, '.navegador');
fs.mkdirSync(perfil, { recursive: true });
const chrome = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'].find((c) => fs.existsSync(c));
if (!chrome) { console.error('Chrome não encontrado.'); process.exit(1); }
spawn(chrome, [`--user-data-dir=${perfil}`, '--no-first-run', 'https://www.instagram.com/accounts/login/', 'https://www.google.com/maps'], { detached: true, stdio: 'ignore' }).unref();
console.log('Janela aberta. Entre no Instagram (e no Google, se quiser) e feche a janela quando terminar.');
