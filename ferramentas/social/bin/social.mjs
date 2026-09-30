#!/usr/bin/env node
// =============================================================================
// Linha de comando do motor social (etapa 0). Tudo aqui é leitura, com duas exceções
// que não aparecem para o público: renovar o token e criar um container de teste.
//
//   node ferramentas/social/bin/social.mjs salvar-token       (lê .segredos/token.txt e apaga)
//   node ferramentas/social/bin/social.mjs conta              [--marca horus]
//   node ferramentas/social/bin/social.mjs midias [n]
//   node ferramentas/social/bin/social.mjs metricas <media-id> [FEED|REELS|STORY]
//   node ferramentas/social/bin/social.mjs metricas-conta [dias]
//   node ferramentas/social/bin/social.mjs renovar-token
//   node ferramentas/social/bin/social.mjs politica <acao> [formato]
//   node ferramentas/social/bin/social.mjs testar-publicacao <url-https-da-imagem>
// =============================================================================
import fs from 'node:fs';
import path from 'node:path';
import { criarCliente } from '../lib/meta.mjs';
import { decidir } from '../lib/politica.mjs';
import { carregarMarca, lerSegredo, gravarSegredo, conferirConta, handleConfirmado, RAIZ_SOCIAL } from '../lib/marca.mjs';

const args = process.argv.slice(2);
const flag = (nome, padrao) => { const i = args.indexOf(`--${nome}`); if (i < 0) return padrao; const v = args[i + 1]; args.splice(i, 2); return v; };
const idMarca = flag('marca', 'horus');
const [comando, ...resto] = args;

const marca = carregarMarca(idMarca);

function cliente() {
  const s = lerSegredo(idMarca);
  if (!s?.token) {
    console.error(`Sem token para a marca "${idMarca}". Siga ferramentas/social/CHAVE-META.md: cole o token em\n  ferramentas/social/.segredos/token.txt e rode  node ferramentas/social/bin/social.mjs salvar-token`);
    process.exit(2);
  }
  return { c: criarCliente({ token: s.token, userId: s.user_id || 'me', aoRegistrar: (e) => console.error(`  · ${e.evento}: ${e.motivo || e.metrica || ''}`) }), s };
}

const diasAte = (iso) => (iso ? Math.round((new Date(iso) - Date.now()) / 86400000) : null);

async function main() {
  switch (comando) {
    case 'salvar-token': {
      // Lê de .segredos/token.txt (colado no Bloco de Notas) para o token não ficar no histórico do terminal.
      const arqTxt = path.join(RAIZ_SOCIAL, '.segredos', 'token.txt');
      const token = (resto[0] || (fs.existsSync(arqTxt) ? fs.readFileSync(arqTxt, 'utf8') : '')).trim();
      if (!token) throw new Error('Cole o token em ferramentas/social/.segredos/token.txt e rode de novo.');
      const c = criarCliente({ token });
      const p = await c.perfil();
      if (fs.existsSync(arqTxt)) fs.unlinkSync(arqTxt);
      const onde = gravarSegredo(idMarca, { token, user_id: p.user_id || p.id, username: p.username, salvo_em: new Date().toISOString(), expira_em: new Date(Date.now() + 60 * 86400000).toISOString() });
      console.log(`Token salvo em ${onde} (fora do Git). Conta: @${p.username}.`);
      const trava = conferirConta(marca, p);
      if (trava) console.log(`Atenção: ${trava}`);
      return;
    }
    case 'conta': {
      const { c, s } = cliente();
      const p = await c.perfil();
      const cota = await c.cotaPublicacao().catch((e) => ({ erro: e.message }));
      const trava = conferirConta(marca, p);
      console.log(JSON.stringify({
        marca: marca.id, conta: `@${p.username}`, tipo: p.account_type, nome: p.name, seguidores: p.followers_count, seguindo: p.follows_count,
        posts: p.media_count, bio: p.biography, site: p.website, cota_publicacao: cota,
        token: { origem: s.origem, dias_para_vencer: diasAte(s.expira_em) },
        escrita: trava ? `bloqueada: ${trava}` : 'liberada (a política ainda decide ação por ação)',
        contexto_faltando: marca.contextoFaltando,
      }, null, 2));
      if (diasAte(s.expira_em) != null && diasAte(s.expira_em) < 10) console.log('\nO token vence em menos de 10 dias: rode "renovar-token".');
      return;
    }
    case 'midias': {
      const { c } = cliente();
      const { itens } = await c.midias({ limite: Number(resto[0]) || 12 });
      for (const m of itens) console.log(`${m.timestamp?.slice(0, 10)}  ${m.media_product_type || m.media_type}  ${m.id}  ♥${m.like_count ?? '?'} 💬${m.comments_count ?? '?'}  ${(m.caption || '').replace(/\s+/g, ' ').slice(0, 70)}`);
      return;
    }
    case 'metricas': {
      const { c } = cliente();
      if (!resto[0]) throw new Error('Informe o id do post (veja em "midias").');
      console.log(JSON.stringify(await c.metricasMidia(resto[0], (resto[1] || 'FEED').toUpperCase()), null, 2));
      return;
    }
    case 'metricas-conta': {
      const { c } = cliente();
      const dias = Math.min(Number(resto[0]) || 7, 30);
      console.log(JSON.stringify(await c.metricasConta({ desde: new Date(Date.now() - dias * 86400000) }), null, 2));
      return;
    }
    case 'renovar-token': {
      const { c } = cliente();
      const r = await c.renovarToken();
      const onde = gravarSegredo(idMarca, { token: r.token, expira_em: r.expiraEm, renovado_em: new Date().toISOString() });
      console.log(`Token renovado, vence em ${r.expiraEm.slice(0, 10)}. Gravado em ${onde}.`);
      return;
    }
    case 'politica': {
      const [acao, formato] = resto;
      console.log(JSON.stringify(decidir({ politica: { ...marca.politica, regulado: marca.regulado }, acao, formato }), null, 2));
      return;
    }
    case 'testar-publicacao': {
      // Cria o container e espera a Meta processar, SEM publicar. Container não publicado expira sozinho em 24 h.
      const { c } = cliente();
      if (!handleConfirmado(marca)) throw new Error('Confirme o @ da marca antes de qualquer teste de escrita.');
      const trava = conferirConta(marca, await c.perfil());
      if (trava) throw new Error(trava);
      const url = resto[0];
      if (!url) throw new Error('Informe uma URL https pública de imagem JPEG ou PNG.');
      console.log(JSON.stringify(await c.publicarImagem({ url, legenda: 'teste do motor social (não publicado)', simular: true }), null, 2));
      return;
    }
    default:
      console.log('Comandos: salvar-token <token> · conta · midias [n] · metricas <id> [tipo] · metricas-conta [dias] · renovar-token · politica <acao> [formato] · testar-publicacao <url>');
      console.log('Opção: --marca <id> (padrão horus)');
  }
}

main().catch((e) => { console.error(`Erro: ${e.message}`); process.exit(1); });
