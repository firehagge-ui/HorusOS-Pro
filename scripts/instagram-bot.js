#!/usr/bin/env node
/**
 * scripts/instagram-bot.js
 * Automação do Instagram via Playwright (Navegador real).
 *
 * Comandos disponíveis:
 *   node scripts/instagram-bot.js login
 *   node scripts/instagram-bot.js status
 *   node scripts/instagram-bot.js postar <pasta_ou_imagem> [caminho_legenda]
 *   node scripts/instagram-bot.js editar <url_do_post> <caminho_ou_texto_da_legenda>
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const SESSION_DIR = path.resolve('dados/instagram-session');

// Garante que a pasta de sessão exista
if (!fs.existsSync(SESSION_DIR)) {
  fs.mkdirSync(SESSION_DIR, { recursive: true });
}

async function getBrowserContext(headless = false) {
  return await chromium.launchPersistentContext(SESSION_DIR, {
    headless,
    viewport: { width: 1280, height: 850 },
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale: 'pt-BR',
    args: ['--disable-blink-features=AutomationControlled', '--start-maximized']
  });
}

// -----------------------------------------------------------------------------
// 1. LOGIN
// -----------------------------------------------------------------------------
async function runLogin() {
  console.log('\n🌐 Abrindo navegador para login no Instagram...');
  console.log(`📁 Perfil persistente: ${SESSION_DIR}`);
  console.log('Faça o login normalmente na janela que se abriu.\n');

  const context = await getBrowserContext(false);
  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  await page.goto('https://www.instagram.com/', { waitUntil: 'domcontentloaded' });

  console.log('⏳ Aguardando você realizar o login no Instagram...');
  console.log('(Esta janela salvará sua sessão automaticamente quando você entrar no feed.)');

  try {
    // Monitora até que elementos do feed ou da barra lateral apareçam
    await page.waitForFunction(
      () => {
        const isNotLoginPage = !window.location.pathname.includes('/accounts/login');
        const hasNav =
          document.querySelector('svg[aria-label="Página inicial"]') ||
          document.querySelector('svg[aria-label="Home"]') ||
          document.querySelector('svg[aria-label="Criar"]') ||
          document.querySelector('svg[aria-label="Nova publicação"]') ||
          document.querySelector('svg[aria-label="New post"]') ||
          document.querySelector('a[href*="/direct/inbox/"]');
        return isNotLoginPage && Boolean(hasNav);
      },
      { timeout: 300000 } // 5 minutos de tolerância para o usuário logar
    );

    console.log('\n🎉 SUCESSO! Login detectado.');
    // Pequena pausa para garantir que os cookies e o storage sejam sincronizados no disco
    await page.waitForTimeout(4000);

    // Salva cookies e storage explicitamente
    await context.storageState({ path: path.join(SESSION_DIR, 'storageState.json') });
    console.log('✅ Sessão salva com sucesso em dados/instagram-session!');
    console.log('Agora você pode postar e editar posts automaticamente sem precisar logar de novo.');
  } catch (err) {
    console.error('\n⚠️ Tempo limite de espera para login atingido ou janela fechada.');
  } finally {
    await context.close();
  }
}

// -----------------------------------------------------------------------------
// 2. STATUS
// -----------------------------------------------------------------------------
async function checkStatus() {
  console.log('\n🔍 Verificando status da sessão do Instagram...');
  const context = await getBrowserContext(true);
  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  try {
    await page.goto('https://www.instagram.com/', { waitUntil: 'networkidle', timeout: 30000 });
    const isLogged = await page.evaluate(() => {
      return Boolean(
        document.querySelector('svg[aria-label="Página inicial"]') ||
          document.querySelector('svg[aria-label="Home"]') ||
          document.querySelector('svg[aria-label="Criar"]') ||
          document.querySelector('svg[aria-label="Nova publicação"]') ||
          document.querySelector('a[href*="/direct/inbox/"]')
      );
    });

    if (isLogged) {
      console.log('✅ Sessão ATIVA e conectada ao Instagram!');
    } else {
      console.log('❌ Sessão expirada ou não logada.');
      console.log('Execute: node scripts/instagram-bot.js login');
    }
  } catch (err) {
    console.error('Erro ao verificar status:', err.message);
  } finally {
    await context.close();
  }
}

// -----------------------------------------------------------------------------
// 3. POSTAR
// -----------------------------------------------------------------------------
async function runPostar(targetPath, captionArg) {
  if (!targetPath) {
    console.error('❌ Erro: especifique o caminho da pasta ou imagem.');
    console.error('Exemplo: node scripts/instagram-bot.js postar marketing/conteudo/meu-post');
    process.exit(1);
  }

  // Identificar arquivos de imagem
  let imageFiles = [];
  let caption = '';

  const fullPath = path.resolve(targetPath);
  const stat = fs.statSync(fullPath);

  if (stat.isDirectory()) {
    let searchDir = path.join(fullPath, 'instagram');
    if (!fs.existsSync(searchDir)) {
      searchDir = fullPath;
    }

    const files = fs.readdirSync(searchDir);
    imageFiles = files
      .filter((f) => /\.(png|jpe?g)$/i.test(f) && (f.startsWith('slide-') || f.startsWith('post-') || f.startsWith('imagem')))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
      .map((f) => path.join(searchDir, f));

    // Buscar legenda
    if (captionArg && fs.existsSync(captionArg)) {
      caption = fs.readFileSync(captionArg, 'utf-8');
    } else if (captionArg) {
      caption = captionArg;
    } else {
      const defaultLegendas = [
        path.join(fullPath, 'legenda.md'),
        path.join(fullPath, 'legenda-instagram.md'),
        path.join(fullPath, 'legenda.txt')
      ];
      for (const lp of defaultLegendas) {
        if (fs.existsSync(lp)) {
          caption = fs.readFileSync(lp, 'utf-8');
          break;
        }
      }
    }
  } else {
    imageFiles = [fullPath];
    if (captionArg && fs.existsSync(captionArg)) {
      caption = fs.readFileSync(captionArg, 'utf-8');
    } else if (captionArg) {
      caption = captionArg;
    }
  }

  if (imageFiles.length === 0) {
    console.error('❌ Nenhuma imagem compatível encontrada para postar.');
    process.exit(1);
  }

  console.log(`\n🚀 Iniciando publicação de ${imageFiles.length} imagem(ns)...`);
  imageFiles.forEach((img, idx) => console.log(`   ${idx + 1}. ${path.basename(img)}`));
  if (caption) {
    console.log(`📝 Legenda: ${caption.slice(0, 100).replace(/\n/g, ' ')}...`);
  }

  // Abrimos o navegador visível para monitorar e evitar bloqueios
  const context = await getBrowserContext(false);
  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  try {
    await page.goto('https://www.instagram.com/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // 1. Clicar no botão Criar
    console.log('🔍 Localizando botão "Criar"...');
    const createBtn = page.locator(
      'svg[aria-label="Nova publicação"], svg[aria-label="New post"], svg[aria-label="Criar"], svg[aria-label="Create"]'
    ).first();

    await createBtn.waitFor({ state: 'visible', timeout: 15000 });
    await createBtn.click();
    await page.waitForTimeout(1500);

    // Se aparecer submenu "Publicação", clica nele
    const postMenuOption = page.locator('span:has-text("Publicação"), span:has-text("Post")').first();
    if (await postMenuOption.isVisible({ timeout: 2000 }).catch(() => false)) {
      await postMenuOption.click();
      await page.waitForTimeout(1000);
    }

    // 2. Upload dos arquivos
    console.log('📤 Fazendo upload das imagens...');
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(imageFiles);
    await page.waitForTimeout(2500);

    // 3. Ajustar proporção (Original / 4:5 se for vertical)
    const cropBtn = page.locator('svg[aria-label="Selecionar corte"], svg[aria-label="Select crop"]').first();
    if (await cropBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await cropBtn.click();
      await page.waitForTimeout(500);
      // Tenta selecionar 4:5 ou Original
      const ratio45 = page.locator('button:has-text("4:5"), button:has-text("Original")').first();
      if (await ratio45.isVisible({ timeout: 1500 }).catch(() => false)) {
        await ratio45.click();
      }
      await cropBtn.click(); // Fecha menu de corte
      await page.waitForTimeout(500);
    }

    // 4. Avançar para Filtros
    console.log('➡️ Avançando...');
    const advanceBtn1 = page.locator('div[role="button"]:has-text("Avançar"), div[role="button"]:has-text("Next")').first();
    await advanceBtn1.waitFor({ state: 'visible', timeout: 10000 });
    await advanceBtn1.click();
    await page.waitForTimeout(1500);

    // 5. Avançar para Legenda
    const advanceBtn2 = page.locator('div[role="button"]:has-text("Avançar"), div[role="button"]:has-text("Next")').first();
    await advanceBtn2.waitFor({ state: 'visible', timeout: 10000 });
    await advanceBtn2.click();
    await page.waitForTimeout(2000);

    // 6. Preencher Legenda
    if (caption) {
      console.log('✍️ Inserindo legenda...');
      const captionBox = page.locator('div[aria-label="Escreva uma legenda..."], div[aria-label="Write a caption..."], div[role="textbox"]').first();
      await captionBox.waitFor({ state: 'visible', timeout: 10000 });
      await captionBox.click();
      await page.keyboard.type(caption, { delay: 10 });
      await page.waitForTimeout(1000);
    }

    // 7. Compartilhar
    console.log('🚀 Clicando em "Compartilhar"...');
    const shareBtn = page.locator('div[role="button"]:has-text("Compartilhar"), div[role="button"]:has-text("Share")').first();
    await shareBtn.waitFor({ state: 'visible', timeout: 10000 });
    await shareBtn.click();

    // 8. Aguardar confirmação de publicação
    console.log('⏳ Aguardando confirmação do Instagram...');
    await page.locator(
      'text="Sua publicação foi compartilhada", text="Your post has been shared"'
    ).first().waitFor({ state: 'visible', timeout: 60000 });

    console.log('\n🎉 SUCESSO! Sua publicação foi compartilhada no Instagram.');
    await page.waitForTimeout(3000);
  } catch (err) {
    console.error('\n❌ Erro durante a publicação no Instagram:', err.message);
  } finally {
    await context.close();
  }
}

// -----------------------------------------------------------------------------
// 4. EDITAR POST
// -----------------------------------------------------------------------------
async function runEditar(postUrl, newCaptionArg) {
  if (!postUrl) {
    console.error('❌ Erro: informe a URL do post a ser editado.');
    console.error('Exemplo: node scripts/instagram-bot.js editar https://www.instagram.com/p/CXYZ... "Nova legenda"');
    process.exit(1);
  }

  let newCaption = newCaptionArg || '';
  if (fs.existsSync(newCaptionArg)) {
    newCaption = fs.readFileSync(newCaptionArg, 'utf-8');
  }

  console.log(`\n✏️ Acessando post para edição: ${postUrl}`);

  const context = await getBrowserContext(false);
  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  try {
    await page.goto(postUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // 1. Clicar nos 3 pontinhos (Mais opções)
    console.log('🔍 Clicando em "Mais opções"...');
    const moreBtn = page.locator(
      'svg[aria-label="Mais opções"], svg[aria-label="More options"]'
    ).first();

    await moreBtn.waitFor({ state: 'visible', timeout: 15000 });
    await moreBtn.click();
    await page.waitForTimeout(1000);

    // 2. Clicar em Editar
    console.log('✏️ Clicando em "Editar"...');
    const editOption = page.locator('button:has-text("Editar"), button:has-text("Edit")').first();
    await editOption.waitFor({ state: 'visible', timeout: 5000 });
    await editOption.click();
    await page.waitForTimeout(1500);

    // 3. Atualizar legenda
    if (newCaption) {
      console.log('📝 Substituindo legenda...');
      const captionBox = page.locator('textarea, div[role="textbox"]').first();
      await captionBox.waitFor({ state: 'visible', timeout: 5000 });
      await captionBox.click();

      // Seleciona tudo e apaga
      await page.keyboard.press('Control+A');
      await page.keyboard.press('Backspace');
      await page.keyboard.type(newCaption, { delay: 10 });
      await page.waitForTimeout(1000);
    }

    // 4. Salvar / Concluir
    console.log('💾 Salvando alterações...');
    const doneBtn = page.locator('div[role="button"]:has-text("Concluir"), div[role="button"]:has-text("Done")').first();
    await doneBtn.waitFor({ state: 'visible', timeout: 5000 });
    await doneBtn.click();

    await page.waitForTimeout(3000);
    console.log('\n🎉 SUCESSO! O post foi editado com a nova legenda.');
  } catch (err) {
    console.error('\n❌ Falha ao editar o post:', err.message);
  } finally {
    await context.close();
  }
}

// -----------------------------------------------------------------------------
// ROTEADOR CLI
// -----------------------------------------------------------------------------
const [, , action, ...args] = process.argv;

switch (action) {
  case 'login':
    runLogin();
    break;
  case 'status':
    checkStatus();
    break;
  case 'postar':
    runPostar(args[0], args[1]);
    break;
  case 'editar':
    runEditar(args[0], args[1]);
    break;
  default:
    console.log(`
Instagram Playwright Bot - Horus OS
-----------------------------------
Uso:
  node scripts/instagram-bot.js login
      Abre a janela do navegador para você logar no seu Instagram e salva a sessão.

  node scripts/instagram-bot.js status
      Checa se a sessão salva continua ativa e conectada.

  node scripts/instagram-bot.js postar <pasta_ou_imagem> [legenda]
      Posta uma foto ou carrossel com a legenda informada.

  node scripts/instagram-bot.js editar <url_do_post> <nova_legenda>
      Abre o post existente no Instagram e edita a legenda dele.
`);
    process.exit(0);
}
