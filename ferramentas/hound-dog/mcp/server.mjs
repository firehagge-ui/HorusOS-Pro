#!/usr/bin/env node
// =============================================================================
// MCP "hound-dog" — liga o Claude (Claude Code e Farejador) ao CRM da Hórus.
// Toda sessão do Claude no HorusOS pode ler e atualizar o Hound Dog por aqui.
// =============================================================================
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { q, q1 } from '../lib/db.mjs';
import { salvarEmpresa, moverEstagio, registrarAtividade, agendar, salvarNegocio, adicionarItensLista, resumoCRM, detalheEmpresa, acharEmpresa } from '../lib/crm.mjs';

const AUTOR = process.env.HD_AUTOR || 'claude';
const servidor = new McpServer({ name: 'hound-dog', version: '1.0.0' }, {
  instructions: 'Hound Dog é o CRM oficial da Hórus. Sempre que um cliente/lead novo aparecer ou uma informação de cliente mudar (estágio, contato, reunião, valor, próxima ação), atualize aqui na mesma hora. Nunca invente dado: o que não se sabe fica em branco ou [FALTA: ...]. Datas em horário da Bahia (UTC-3).',
});

const ok = (dados) => ({ content: [{ type: 'text', text: typeof dados === 'string' ? dados : JSON.stringify(dados, null, 2) }] });
const falha = (e) => ({ isError: true, content: [{ type: 'text', text: `Erro: ${e?.message || e}` }] });
const envolver = (fn) => async (args) => { try { return ok(await fn(args)); } catch (e) { return falha(e); } };

const ESTAGIO = z.enum(['novo', 'qualificado', 'abordado', 'conversando', 'reuniao', 'proposta', 'negociacao', 'ganho', 'followup', 'perdido']);
const CAMPOS_EMPRESA = {
  nome: z.string().optional().describe('Nome do negócio (obrigatório para criar)'),
  categoria: z.string().optional().describe('Nicho/categoria'), cidade: z.string().optional(), bairro: z.string().optional(), endereco: z.string().optional(),
  decisor: z.string().optional().describe('Quem decide'), decisor_obs: z.string().optional(),
  whatsapp: z.string().optional().describe('Número completo com DDD, só se confirmado. Nunca presuma dígito.'), telefone: z.string().optional(), email: z.string().optional(),
  instagram: z.string().optional().describe('@ do perfil'), instagram_seguidores: z.number().int().optional(),
  site: z.string().optional(), site_status: z.enum(['sem', 'fora_do_ar', 'ruim', 'ok', 'desconhecido']).optional(),
  google_nota: z.number().optional(), google_avaliacoes: z.number().int().optional(), gmb_status: z.string().optional(), roda_anuncio: z.boolean().optional(), cnpj: z.string().optional(),
  regulado: z.boolean().optional(), conselho: z.string().optional().describe('CFO, CFP, CFM, OAB...'),
  relacao: z.enum(['lead', 'cliente', 'ex_cliente', 'interno', 'nao_fit']).optional(), estagio: ESTAGIO.optional(), temperatura: z.enum(['frio', 'morno', 'quente']).optional(),
  origem: z.string().optional().describe('prospeccao, indicacao, evento, presencial, instagram, inbound, spark, claude, network, manual'), origem_detalhe: z.string().optional(),
  gancho: z.string().optional().describe('Gancho verdadeiro para abordar'), dor: z.string().optional(), valor_estimado: z.number().optional(),
  proxima_acao: z.string().optional(), proxima_acao_em: z.string().optional().describe('ISO ou AAAA-MM-DD HH:mm'), tags: z.array(z.string()).optional(),
  pasta_repo: z.string().optional().describe('ex.: clientes/amparo-flores'), resumo: z.string().optional(), arquivado: z.boolean().optional(),
};

servidor.registerTool('hd_resumo', {
  title: 'Resumo do Hound Dog', description: 'Panorama do CRM: esteira por estágio, empresas em andamento, quem precisa de atenção, agenda dos próximos 14 dias, atividade recente e dinheiro. Comece por aqui.', inputSchema: {},
}, envolver(() => resumoCRM()));

servidor.registerTool('hd_buscar_empresas', {
  title: 'Buscar empresas', description: 'Busca empresas por texto (nome, nicho, cidade, @), estágio ou relação.',
  inputSchema: { texto: z.string().optional(), estagio: ESTAGIO.optional(), relacao: z.enum(['lead', 'cliente', 'ex_cliente', 'interno', 'nao_fit']).optional(), limite: z.number().int().min(1).max(100).optional() },
}, envolver(async ({ texto, estagio, relacao, limite = 20 }) => {
  const cond = ['true']; const p = [];
  if (texto) { p.push(`%${texto}%`); cond.push(`(unaccent_simples(nome) ilike unaccent_simples($${p.length}) or categoria ilike $${p.length} or cidade ilike $${p.length} or instagram ilike $${p.length} or decisor ilike $${p.length})`); }
  if (estagio) { p.push(estagio); cond.push(`estagio = $${p.length}`); }
  if (relacao) { p.push(relacao); cond.push(`relacao = $${p.length}`); }
  p.push(limite);
  return q(`select id, nome, categoria, cidade, bairro, estagio, relacao, score, prioridade, whatsapp, instagram, site_status, valor_estimado, proxima_acao, atualizado_em
            from empresas where ${cond.join(' and ')} order by atualizado_em desc limit $${p.length}`, p);
}));

servidor.registerTool('hd_empresa', {
  title: 'Ficha da empresa', description: 'Ficha completa: dados, negócios, dinheiro, agenda, linha do tempo e últimas mensagens do WhatsApp. Aceita id ou nome.',
  inputSchema: { id: z.string().optional(), nome: z.string().optional() },
}, envolver(async ({ id, nome }) => {
  const e = id ? { id } : await acharEmpresa({ nome });
  if (!e) throw new Error('Empresa não encontrada. Use hd_buscar_empresas.');
  return detalheEmpresa(e.id);
}));

servidor.registerTool('hd_salvar_empresa', {
  title: 'Criar ou atualizar empresa', description: 'Cria um lead/cliente novo ou atualiza um existente (passe id, ou o sistema deduplica por WhatsApp, Instagram ou nome+cidade). Só mande os campos que mudaram. Registra na linha do tempo.',
  inputSchema: { id: z.string().optional(), motivo: z.string().optional().describe('Por que mudou (vai para a linha do tempo)'), ...CAMPOS_EMPRESA },
}, envolver(async ({ motivo, ...dados }) => {
  const r = await salvarEmpresa({ ...dados, _motivo: motivo }, AUTOR);
  return { id: r.empresa.id, nome: r.empresa.nome, criada: r.criada, estagio: r.empresa.estagio, score: r.empresa.score, campos_alterados: r.campos_alterados };
}));

servidor.registerTool('hd_mover_estagio', {
  title: 'Mover na esteira', description: 'Move a empresa de estágio: novo → qualificado → abordado → conversando → reuniao → proposta → negociacao → ganho (ou followup / perdido).',
  inputSchema: { empresa_id: z.string(), estagio: ESTAGIO, motivo: z.string().optional() },
}, envolver(async ({ empresa_id, estagio, motivo }) => { const r = await moverEstagio(empresa_id, estagio, motivo, AUTOR); return { id: r.id, nome: r.nome, estagio: r.estagio, relacao: r.relacao }; }));

servidor.registerTool('hd_registrar_atividade', {
  title: 'Registrar atividade', description: 'Registra algo que aconteceu na linha do tempo da empresa (ligação, mensagem, reunião, proposta, pagamento, nota).',
  inputSchema: { empresa_id: z.string(), tipo: z.enum(['nota', 'ligacao', 'mensagem', 'whatsapp', 'reuniao', 'visita', 'proposta', 'pagamento', 'pesquisa']), titulo: z.string(), descricao: z.string().optional() },
}, envolver(async ({ empresa_id, tipo, titulo, descricao }) => registrarAtividade(empresa_id, tipo, titulo, descricao || null, AUTOR)));

servidor.registerTool('hd_agendar', {
  title: 'Agendar compromisso', description: 'Cria um compromisso na agenda do Hound Dog. R1 move a empresa para "reuniao". Horário da Bahia.',
  inputSchema: { empresa_id: z.string().optional(), titulo: z.string(), tipo: z.enum(['r1', 'r2', 'followup', 'ligacao', 'visita', 'entrega', 'interno', 'outro']).optional(), inicio: z.string().describe('AAAA-MM-DD HH:mm (hora da Bahia) ou ISO'), duracao_min: z.number().int().optional(), local: z.string().optional(), descricao: z.string().optional() },
}, envolver((a) => agendar(a, AUTOR)));

servidor.registerTool('hd_agenda', {
  title: 'Ver agenda', description: 'Compromissos dos próximos N dias (padrão 7).', inputSchema: { dias: z.number().int().min(1).max(90).optional() },
}, envolver(({ dias = 7 }) => q(`select a.id, a.titulo, a.tipo, a.inicio, a.fim, a.local, a.status, e.nome empresa, a.empresa_id from agenda a left join empresas e on e.id = a.empresa_id
  where a.inicio between now() - interval '2 hours' and now() + ($1 || ' days')::interval order by a.inicio`, [String(dias)])));

servidor.registerTool('hd_salvar_negocio', {
  title: 'Criar ou atualizar negócio', description: 'Negócio = fase vendida (Fase 1, 2, 3). Valor em reais. Status: aberto, ganho, perdido, pausado. Entrega: nao_iniciada, onboarding, producao, revisao, entregue, pausado.',
  inputSchema: { id: z.string().optional(), empresa_id: z.string().optional(), titulo: z.string().optional(), fase: z.enum(['fase1', 'fase2', 'fase3', 'avulso']).optional(), valor: z.number().optional(), recorrencia_mensal: z.number().optional(), status: z.enum(['aberto', 'ganho', 'perdido', 'pausado']).optional(), entrega: z.enum(['nao_iniciada', 'onboarding', 'producao', 'revisao', 'entregue', 'pausado']).optional(), probabilidade: z.number().int().min(0).max(100).optional(), observacao: z.string().optional() },
}, envolver((n) => salvarNegocio(n, AUTOR)));

servidor.registerTool('hd_registrar_financeiro', {
  title: 'Lançar dinheiro', description: 'Lança entrada, saldo ou mensalidade. Status: previsto, a_receber, recebido, cancelado.',
  inputSchema: { empresa_id: z.string(), descricao: z.string(), valor: z.number(), status: z.enum(['previsto', 'a_receber', 'recebido', 'cancelado']), tipo: z.enum(['projeto', 'recorrente']).optional(), vencimento: z.string().optional().describe('AAAA-MM-DD') },
}, envolver(async (f) => {
  const r = await q1(`insert into financeiro (empresa_id, descricao, valor, status, tipo, vencimento, recebido_em) values ($1,$2,$3,$4,$5,$6,$7) returning *`,
    [f.empresa_id, f.descricao, f.valor, f.status, f.tipo || 'projeto', f.vencimento || null, f.status === 'recebido' ? new Date().toISOString().slice(0, 10) : null]);
  await registrarAtividade(f.empresa_id, 'pagamento', `${f.status === 'recebido' ? 'Recebido' : 'Lançado'}: ${f.descricao}`, `R$ ${f.valor}`, AUTOR);
  return r;
}));

servidor.registerTool('hd_lista_adicionar_itens', {
  title: 'Adicionar leads a uma lista', description: 'Adiciona negócios encontrados numa pesquisa a uma lista de prospecção (pontua e deduplica). Use lotes de até 10. Campos desconhecidos: omita.',
  inputSchema: {
    lista_id: z.string(),
    itens: z.array(z.object({
      nome: z.string(), categoria: z.string().optional(), cidade: z.string().optional(), bairro: z.string().optional(), endereco: z.string().optional(), telefone: z.string().optional(), whatsapp: z.string().optional(),
      instagram: z.string().optional(), instagram_seguidores: z.number().optional(), site: z.string().optional(), site_status: z.enum(['sem', 'fora_do_ar', 'ruim', 'ok', 'desconhecido']).optional(),
      google_nota: z.number().optional(), google_avaliacoes: z.number().optional(), gmb_status: z.string().optional(), roda_anuncio: z.boolean().optional(), cnpj: z.string().optional(),
      decisor: z.string().optional(), observacao: z.string().optional().describe('A oportunidade mais visível, em 1 frase'), fontes: z.array(z.string()).optional(),
    })).max(25),
  },
}, envolver(({ lista_id, itens }) => adicionarItensLista(lista_id, itens)));

servidor.registerTool('hd_salvar_pesquisa', {
  title: 'Salvar pesquisa', description: 'Salva um relatório (mercado, concorrência ou dossiê de empresa) no Hound Dog.',
  inputSchema: { id: z.string().optional(), tipo: z.enum(['mercado', 'dossie', 'concorrencia']).optional(), titulo: z.string().optional(), nicho: z.string().optional(), cidade: z.string().optional(), empresa_id: z.string().optional(), resumo: z.string().optional(), conteudo_md: z.string().optional(), nota_oportunidade: z.number().int().min(0).max(100).optional(), dados: z.record(z.string(), z.any()).optional() },
}, envolver(async (p) => {
  if (p.id) {
    const campos = ['titulo', 'nicho', 'cidade', 'resumo', 'conteudo_md', 'nota_oportunidade', 'dados'].filter((c) => p[c] !== undefined);
    return q1(`update pesquisas set status = 'pronta', ${campos.map((c, i) => `${c} = $${i + 2}`).join(', ')} where id = $1 returning id, titulo, status`, [p.id, ...campos.map((c) => (c === 'dados' ? JSON.stringify(p[c]) : p[c]))]);
  }
  return q1(`insert into pesquisas (tipo, titulo, nicho, cidade, empresa_id, resumo, conteudo_md, nota_oportunidade, dados, status, criado_por) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,'pronta',$10) returning id, titulo`,
    [p.tipo || 'mercado', p.titulo || 'Pesquisa', p.nicho || null, p.cidade || null, p.empresa_id || null, p.resumo || null, p.conteudo_md || null, p.nota_oportunidade ?? null, JSON.stringify(p.dados || {}), AUTOR]);
}));

servidor.registerTool('hd_playbook', {
  title: 'Playbook de objeções', description: 'As objeções mapeadas pela casa, com leitura, resposta recomendada, alternativas e o que evitar.', inputSchema: {},
}, envolver(() => q('select id, rotulo, leitura, resposta, alternativas, evitar, fonte from playbook_objecoes order by ordem')));

servidor.registerTool('hd_instagram_snapshot', {
  title: 'Registrar números do Instagram', description: 'Grava uma leitura do Instagram da Hórus (seguidores, posts, engajamento). Use quando conseguir os números com o navegador ou quando o Marcelo passar. Marque a fonte: navegador, manual ou graph.',
  inputSchema: {
    handle: z.string(), seguidores: z.number().int().optional(), seguindo: z.number().int().optional(), posts: z.number().int().optional(),
    nome: z.string().optional(), bio: z.string().optional(), foto_url: z.string().optional(), link_externo: z.string().optional(),
    media_curtidas: z.number().optional(), media_comentarios: z.number().optional(), fonte: z.enum(['navegador', 'manual', 'graph', 'publico']).optional(),
    ultimos_posts: z.array(z.object({ shortcode: z.string().optional(), url: z.string().optional(), tipo: z.string().optional(), legenda: z.string().optional(), curtidas: z.number().optional(), comentarios: z.number().optional(), views: z.number().optional(), data: z.string().optional(), thumb: z.string().optional() })).optional(),
  },
}, envolver(async (p) => {
  const posts = p.ultimos_posts || [];
  const comNum = posts.filter((x) => x.curtidas != null);
  const mediaC = p.media_curtidas ?? (comNum.length ? comNum.reduce((a, x) => a + x.curtidas, 0) / comNum.length : null);
  const mediaCom = p.media_comentarios ?? (comNum.length ? comNum.reduce((a, x) => a + (x.comentarios || 0), 0) / comNum.length : null);
  const eng = p.seguidores && mediaC != null ? Math.round(((mediaC + (mediaCom || 0)) / p.seguidores) * 10000) / 100 : null;
  return q1(`insert into instagram_snapshots (handle, nome, bio, foto_url, link_externo, seguidores, seguindo, posts, media_curtidas, media_comentarios, engajamento, ultimos_posts, fonte)
             values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) returning id, handle, seguidores, engajamento, coletado_em`,
  [p.handle.replace('@', ''), p.nome || null, p.bio || null, p.foto_url || null, p.link_externo || null, p.seguidores ?? null, p.seguindo ?? null, p.posts ?? null,
    mediaC != null ? Math.round(mediaC * 10) / 10 : null, mediaCom != null ? Math.round(mediaCom * 10) / 10 : null, eng, JSON.stringify(posts), p.fonte || 'manual']);
}));

servidor.registerTool('hd_conversas', {
  title: 'Conversas do WhatsApp', description: 'Conversas recentes do WhatsApp sincronizadas (de uma empresa ou todas), com as últimas mensagens e a leitura do Claude.',
  inputSchema: { empresa_id: z.string().optional(), limite: z.number().int().min(1).max(30).optional() },
}, envolver(async ({ empresa_id, limite = 10 }) => {
  const convs = await q(`select c.id, c.nome, c.telefone, c.empresa_id, e.nome empresa, c.ultima_mensagem, c.ultima_em, c.analise from whatsapp_conversas c left join empresas e on e.id = c.empresa_id
    where ($1::uuid is null or c.empresa_id = $1::uuid) and not c.arquivada order by c.ultima_em desc nulls last limit $2`, [empresa_id || null, limite]);
  for (const c of convs) c.mensagens = (await q('select direcao, texto, momento from whatsapp_mensagens where conversa_id = $1 order by momento desc limit 12', [c.id])).reverse();
  return convs;
}));

await servidor.connect(new StdioServerTransport());
