#!/usr/bin/env node
/**
 * scripts/postar-facebook.js
 * Publica post único ou álbum de fotos na Página do Facebook via Meta Graph API v20.0.
 *
 * Uso:
 *   node --env-file=.env scripts/postar-facebook.js marketing/conteudo/<slug>-<data>
 *
 * Pré-requisitos (.env):
 *   META_PAGE_ACCESS_TOKEN - Token de acesso com permissão pages_manage_posts, pages_read_engagement
 *   META_PAGE_ID           - ID da Página do Facebook
 *   SITE_URL               - URL base onde as imagens estão publicadas
 */

import fs from 'fs';
import path from 'path';

const GRAPH_API_VERSION = 'v20.0';
const GRAPH_BASE_URL = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

async function main() {
  const targetDir = process.argv[2];
  if (!targetDir) {
    console.error('❌ Erro: informe a pasta do conteúdo.');
    console.error('Exemplo: node --env-file=.env scripts/postar-facebook.js marketing/conteudo/meu-post-2026-09-21');
    process.exit(1);
  }

  const token = process.env.META_PAGE_ACCESS_TOKEN;
  const pageId = process.env.META_PAGE_ID;
  const siteUrl = process.env.SITE_URL;

  if (!token || !pageId) {
    console.error('❌ Erro: variáveis de ambiente ausentes no .env.');
    console.error('Certifique-se de configurar META_PAGE_ACCESS_TOKEN e META_PAGE_ID.');
    process.exit(1);
  }

  if (!siteUrl) {
    console.error('❌ Erro: SITE_URL não configurada no .env.');
    process.exit(1);
  }

  // 1. Identificar slug
  const folderName = path.basename(path.resolve(targetDir));
  const slug = folderName.replace(/-\d{4}-\d{2}-\d{2}$/, '');

  // 2. Localizar imagens
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
    console.error(`❌ Erro: nenhuma imagem encontrada em ${imgDir}`);
    process.exit(1);
  }

  // 3. Ler legenda
  let caption = '';
  const legendaPaths = [
    path.join(targetDir, 'legenda-facebook.md'),
    path.join(targetDir, 'legenda.md'),
    path.join(targetDir, 'legenda.txt')
  ];

  for (const lp of legendaPaths) {
    if (fs.existsSync(lp)) {
      caption = fs.readFileSync(lp, 'utf-8').trim();
      break;
    }
  }

  console.log(`\n🚀 Preparando publicação no Facebook...`);
  console.log(`📁 Pasta: ${targetDir}`);
  console.log(`🏷️ Slug: ${slug}`);
  console.log(`🖼️ Slides: ${slideFiles.length} imagem(ns)`);

  const baseUrl = siteUrl.replace(/\/$/, '');
  const imageUrls = slideFiles.map((f) => `${baseUrl}/img/posts/${slug}/${f}`);

  let postId;

  if (slideFiles.length === 1) {
    console.log('\n📤 Enviando foto para a Página do Facebook...');
    const params = new URLSearchParams({
      url: imageUrls[0],
      caption: caption,
      access_token: token
    });

    const res = await fetch(`${GRAPH_BASE_URL}/${pageId}/photos`, {
      method: 'POST',
      body: params
    });
    const data = await res.json();

    if (!res.ok || data.error) {
      throw new Error(`Falha ao publicar foto no Facebook: ${JSON.stringify(data.error || data)}`);
    }

    postId = data.post_id || data.id;
  } else {
    console.log('\n📤 Enviando fotos não-publicadas...');
    const photoIds = [];

    for (let i = 0; i < imageUrls.length; i++) {
      process.stdout.write(`   Foto ${i + 1}/${imageUrls.length}... `);
      const params = new URLSearchParams({
        url: imageUrls[i],
        published: 'false',
        access_token: token
      });

      const res = await fetch(`${GRAPH_BASE_URL}/${pageId}/photos`, {
        method: 'POST',
        body: params
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        process.stdout.write('❌\n');
        throw new Error(`Falha ao enviar foto ${i + 1}: ${JSON.stringify(data.error || data)}`);
      }

      photoIds.push(data.id);
      process.stdout.write(`OK (${data.id})\n`);
    }

    console.log('\n📢 Criando publicação no Feed com álbum de fotos...');
    const attachedMedia = photoIds.map((id) => ({ media_fbid: id }));
    const feedParams = new URLSearchParams({
      message: caption,
      attached_media: JSON.stringify(attachedMedia),
      access_token: token
    });

    const res = await fetch(`${GRAPH_BASE_URL}/${pageId}/feed`, {
      method: 'POST',
      body: feedParams
    });
    const data = await res.json();

    if (!res.ok || data.error) {
      throw new Error(`Falha ao criar post no feed: ${JSON.stringify(data.error || data)}`);
    }

    postId = data.id;
  }

  console.log('\n========================================');
  console.log('✅ SUCESSO! Post publicado no Facebook');
  console.log(`ID do Post: ${postId}`);
  console.log(`Link: https://facebook.com/${postId}`);
  console.log('========================================\n');
}

main().catch((err) => {
  console.error('\n❌ Falha na publicação no Facebook:');
  console.error(err.message || err);
  process.exit(1);
});
