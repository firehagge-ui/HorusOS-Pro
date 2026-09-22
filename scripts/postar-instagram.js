#!/usr/bin/env node
/**
 * scripts/postar-instagram.js
 * Publica post único ou carrossel no Instagram via Meta Graph API v20.0.
 *
 * Uso:
 *   node --env-file=.env scripts/postar-instagram.js marketing/conteudo/<slug>-<data>
 *
 * Pré-requisitos (.env):
 *   META_PAGE_ACCESS_TOKEN - Token de acesso com permissão instagram_content_publish
 *   META_IG_USER_ID        - ID da conta Instagram Business
 *   SITE_URL               - URL base onde as imagens estão publicadas (ex: https://meusite.com.br)
 */

import fs from 'fs';
import path from 'path';

const GRAPH_API_VERSION = 'v20.0';
const GRAPH_BASE_URL = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

async function main() {
  const targetDir = process.argv[2];
  if (!targetDir) {
    console.error('❌ Erro: informe a pasta do conteúdo.');
    console.error('Exemplo: node --env-file=.env scripts/postar-instagram.js marketing/conteudo/meu-post-2026-09-21');
    process.exit(1);
  }

  const token = process.env.META_PAGE_ACCESS_TOKEN;
  const igUserId = process.env.META_IG_USER_ID;
  const siteUrl = process.env.SITE_URL;

  if (!token || !igUserId) {
    console.error('❌ Erro: variáveis de ambiente ausentes no .env.');
    console.error('Certifique-se de configurar META_PAGE_ACCESS_TOKEN e META_IG_USER_ID.');
    process.exit(1);
  }

  if (!siteUrl) {
    console.error('❌ Erro: SITE_URL não configurada no .env.');
    console.error('A Meta Graph API exige URLs públicas para fazer o download das imagens.');
    process.exit(1);
  }

  // 1. Identificar slug a partir da pasta
  const folderName = path.basename(path.resolve(targetDir));
  // Remove sufixo de data se houver (ex: meu-post-2026-09-21 -> meu-post)
  const slug = folderName.replace(/-\d{4}-\d{2}-\d{2}$/, '');

  // 2. Localizar imagens (procura em <dir>/instagram/ ou diretamente em <dir>)
  let imgDir = path.join(targetDir, 'instagram');
  if (!fs.existsSync(imgDir)) {
    imgDir = targetDir;
  }

  if (!fs.existsSync(imgDir)) {
    console.error(`❌ Erro: pasta não encontrada: ${imgDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(imgDir);
  const slideFiles = files
    .filter((f) => /\.(png|jpe?g)$/i.test(f) && (f.startsWith('slide-') || f.startsWith('post-') || f.startsWith('imagem')))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

  if (slideFiles.length === 0) {
    console.error(`❌ Erro: nenhuma imagem (slide-*.png) encontrada em ${imgDir}`);
    process.exit(1);
  }

  if (slideFiles.length > 10) {
    console.error(`❌ Erro: o Instagram aceita no máximo 10 slides por carrossel (encontrados: ${slideFiles.length}).`);
    process.exit(1);
  }

  // 3. Ler legenda
  let caption = '';
  const legendaPaths = [
    path.join(targetDir, 'legenda.md'),
    path.join(targetDir, 'legenda-instagram.md'),
    path.join(targetDir, 'legenda.txt')
  ];

  for (const lp of legendaPaths) {
    if (fs.existsSync(lp)) {
      caption = fs.readFileSync(lp, 'utf-8').trim();
      break;
    }
  }

  if (!caption) {
    console.warn('⚠️ Aviso: legenda.md não encontrada ou vazia. O post será publicado sem legenda.');
  }

  console.log(`\n🚀 Preparando publicação no Instagram...`);
  console.log(`📁 Pasta: ${targetDir}`);
  console.log(`🏷️ Slug: ${slug}`);
  console.log(`🖼️ Slides: ${slideFiles.length} imagem(ns) encontrada(s)`);

  const baseUrl = siteUrl.replace(/\/$/, '');
  const imageUrls = slideFiles.map((f) => `${baseUrl}/img/posts/${slug}/${f}`);

  console.log('\n📡 Verificando URLs públicas das imagens:');
  for (const url of imageUrls) {
    console.log(`   - ${url}`);
  }

  // 4. Criar contêineres na Meta Graph API
  let containerId;

  if (slideFiles.length === 1) {
    // Post de imagem única
    console.log('\n📤 Enviando contêiner de imagem única...');
    const params = new URLSearchParams({
      image_url: imageUrls[0],
      caption: caption,
      access_token: token
    });

    const res = await fetch(`${GRAPH_BASE_URL}/${igUserId}/media`, {
      method: 'POST',
      body: params
    });
    const data = await res.json();

    if (!res.ok || data.error) {
      throw new Error(`Falha ao criar contêiner de imagem: ${JSON.stringify(data.error || data)}`);
    }

    containerId = data.id;
  } else {
    // Carrossel
    console.log('\n📤 Enviando itens do carrossel...');
    const itemIds = [];

    for (let i = 0; i < imageUrls.length; i++) {
      const url = imageUrls[i];
      process.stdout.write(`   Item ${i + 1}/${imageUrls.length}... `);

      const params = new URLSearchParams({
        image_url: url,
        is_carousel_item: 'true',
        access_token: token
      });

      const res = await fetch(`${GRAPH_BASE_URL}/${igUserId}/media`, {
        method: 'POST',
        body: params
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        process.stdout.write('❌\n');
        throw new Error(`Falha ao criar item ${i + 1} do carrossel: ${JSON.stringify(data.error || data)}`);
      }

      itemIds.push(data.id);
      process.stdout.write(`OK (${data.id})\n`);
    }

    console.log('\n📦 Criando contêiner pai do carrossel...');
    const carouselParams = new URLSearchParams({
      media_type: 'CAROUSEL',
      children: itemIds.join(','),
      caption: caption,
      access_token: token
    });

    const res = await fetch(`${GRAPH_BASE_URL}/${igUserId}/media`, {
      method: 'POST',
      body: carouselParams
    });
    const data = await res.json();

    if (!res.ok || data.error) {
      throw new Error(`Falha ao criar contêiner do carrossel: ${JSON.stringify(data.error || data)}`);
    }

    containerId = data.id;
  }

  // 5. Aguardar processamento do contêiner
  console.log(`\n⏳ Validando processamento do contêiner (${containerId})...`);
  let isReady = false;
  const maxAttempts = 15;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const statusRes = await fetch(
      `${GRAPH_BASE_URL}/${containerId}?fields=status_code,status&access_token=${token}`
    );
    const statusData = await statusRes.json();

    if (statusData.status_code === 'FINISHED') {
      isReady = true;
      break;
    } else if (statusData.status_code === 'ERROR') {
      throw new Error(`Erro no processamento da mídia pela Meta: ${JSON.stringify(statusData)}`);
    }

    // Aguarda 2s antes de checar novamente
    await new Promise((r) => setTimeout(r, 2000));
  }

  if (!isReady) {
    console.warn('⚠️ Tempo limite de espera atingido, tentando publicar mesmo assim...');
  }

  // 6. Publicar mídia
  console.log('📢 Publicando no Instagram...');
  const publishParams = new URLSearchParams({
    creation_id: containerId,
    access_token: token
  });

  const pubRes = await fetch(`${GRAPH_BASE_URL}/${igUserId}/media_publish`, {
    method: 'POST',
    body: publishParams
  });
  const pubData = await pubRes.json();

  if (!pubRes.ok || pubData.error) {
    throw new Error(`Falha ao publicar mídia: ${JSON.stringify(pubData.error || pubData)}`);
  }

  const mediaId = pubData.id;

  // 7. Obter link do post
  let permalink = `https://www.instagram.com/`;
  try {
    const permRes = await fetch(`${GRAPH_BASE_URL}/${mediaId}?fields=permalink&access_token=${token}`);
    const permData = await permRes.json();
    if (permData.permalink) {
      permalink = permData.permalink;
    }
  } catch {
    // Silently continue
  }

  console.log('\n========================================');
  console.log('✅ SUCESSO! Post publicado no Instagram');
  console.log(`ID da Mídia: ${mediaId}`);
  console.log(`Link: ${permalink}`);
  console.log('========================================\n');
}

main().catch((err) => {
  console.error('\n❌ Falha na execução:');
  console.error(err.message || err);
  process.exit(1);
});
