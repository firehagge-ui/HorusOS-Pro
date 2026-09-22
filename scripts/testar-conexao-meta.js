#!/usr/bin/env node
/**
 * scripts/testar-conexao-meta.js
 * Testa a conexão e valida as credenciais configuradas no .env com a Meta Graph API.
 *
 * Uso:
 *   node --env-file=.env scripts/testar-conexao-meta.js
 */

const GRAPH_API_VERSION = 'v20.0';
const GRAPH_BASE_URL = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

async function main() {
  console.log('🔍 Iniciando teste de conexão com a Meta Graph API...\n');

  const token = process.env.META_PAGE_ACCESS_TOKEN;
  const pageId = process.env.META_PAGE_ID;
  const igUserId = process.env.META_IG_USER_ID;

  if (!token || token.includes('seu_meta_token')) {
    console.error('❌ META_PAGE_ACCESS_TOKEN não está preenchido no .env.');
    process.exit(1);
  }

  // 1. Validar Token e Permissões
  console.log('1️⃣ Validando token de acesso...');
  try {
    const meRes = await fetch(`${GRAPH_BASE_URL}/me?fields=id,name&access_token=${token}`);
    const meData = await meRes.json();

    if (meData.error) {
      console.error('❌ Falha ao validar token:');
      console.error(`   Mensagem: ${meData.error.message}`);
      console.error(`   Código: ${meData.error.code} (Subcode: ${meData.error.error_subcode || 'N/A'})`);
      process.exit(1);
    }

    console.log(`   ✓ Token válido! Autenticado como: ${meData.name} (ID: ${meData.id})`);
  } catch (err) {
    console.error(`❌ Erro de rede ao conectar à Meta API: ${err.message}`);
    process.exit(1);
  }

  // 2. Checar permissões concedidas
  console.log('\n2️⃣ Checando permissões concedidas...');
  try {
    const permRes = await fetch(`${GRAPH_BASE_URL}/me/permissions?access_token=${token}`);
    const permData = await permRes.json();
    if (permData.data) {
      const activePerms = permData.data
        .filter((p) => p.status === 'granted')
        .map((p) => p.permission);
      console.log(`   Permissões ativas: ${activePerms.join(', ')}`);

      const required = ['instagram_basic', 'instagram_content_publish'];
      const missing = required.filter((r) => !activePerms.includes(r));
      if (missing.length > 0) {
        console.warn(`   ⚠️ Atenção: Faltam permissões para publicação: ${missing.join(', ')}`);
      } else {
        console.log('   ✓ Permissões essenciais do Instagram estão concedidas!');
      }
    }
  } catch (err) {
    console.warn(`   (Não foi possível listar permissões detalhadas: ${err.message})`);
  }

  // 3. Validar Página do Facebook
  if (pageId && !pageId.includes('seu_id')) {
    console.log(`\n3️⃣ Validando Página do Facebook (${pageId})...`);
    const pageRes = await fetch(`${GRAPH_BASE_URL}/${pageId}?fields=id,name,link&access_token=${token}`);
    const pageData = await pageRes.json();
    if (pageData.error) {
      console.warn(`   ⚠️ Erro ao consultar Página: ${pageData.error.message}`);
    } else {
      console.log(`   ✓ Página conectada: ${pageData.name} (${pageData.link || pageData.id})`);
    }
  }

  // 4. Validar Conta do Instagram Business
  if (igUserId && !igUserId.includes('seu_id')) {
    console.log(`\n4️⃣ Validando Conta do Instagram Business (${igUserId})...`);
    const igRes = await fetch(
      `${GRAPH_BASE_URL}/${igUserId}?fields=id,username,name,profile_picture_url&access_token=${token}`
    );
    const igData = await igRes.json();
    if (igData.error) {
      console.warn(`   ⚠️ Erro ao consultar conta do Instagram: ${igData.error.message}`);
    } else {
      console.log(`   ✓ Instagram conectado: @${igData.username} (${igData.name || 'Sem nome público'})`);
      console.log(`   ✓ ID verificado: ${igData.id}`);
    }
  }

  console.log('\n======================================================');
  console.log('🎉 TUDO PRONTO! Sua integração com o Instagram está ativa.');
  console.log('======================================================\n');
}

main().catch((err) => {
  console.error('Erro inesperado:', err);
  process.exit(1);
});
