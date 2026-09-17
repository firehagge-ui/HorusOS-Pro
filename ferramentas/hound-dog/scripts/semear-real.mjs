// =============================================================================
// Semeia o Hound Dog com a carteira e os leads REAIS da Hórus.
// Fonte: CLAUDE.md da raiz + clientes/<nome>/CLAUDE.md + briefing.md (datas e fatos já versionados).
// Regra de integridade: o que não está nos arquivos fica null ou [FALTA: ...]. Nada inventado.
// Idempotente: rodar de novo atualiza, não duplica.
// =============================================================================
import { db, q, q1, fecharDb } from '../lib/db.mjs';
import { pontuar } from '../app/js/score.js';

const AUTOR = 'claude';

async function upsertEmpresa(e) {
  const atual = e.pasta_repo
    ? await q1('select id from empresas where pasta_repo = $1', [e.pasta_repo])
    : await q1('select id from empresas where lower(nome) = lower($1)', [e.nome]);
  const { score, prioridade, motivos } = pontuar(e);
  const dados = { ...e, score: e.score ?? score, prioridade: e.prioridade ?? prioridade, score_motivos: JSON.stringify(motivos), atualizado_por: AUTOR };
  const cols = Object.keys(dados);
  if (atual) {
    const sets = cols.map((c, i) => `${c} = $${i + 2}`).join(', ');
    await q(`update empresas set ${sets} where id = $1`, [atual.id, ...cols.map((c) => dados[c])]);
    return atual.id;
  }
  const r = await q1(`insert into empresas (${cols.join(',')}) values (${cols.map((_, i) => `$${i + 1}`).join(',')}) returning id`,
    cols.map((c) => dados[c]));
  return r.id;
}

async function atividade(empresaId, a) {
  const chave = `${a.quando}|${a.titulo}`;
  const existe = await q1(`select 1 from atividades where empresa_id = $1 and dados->>'seed' = $2`, [empresaId, chave]);
  if (existe) return;
  await q(`insert into atividades (empresa_id, tipo, titulo, descricao, dados, autor, criado_em) values ($1,$2,$3,$4,$5,$6,$7)`,
    [empresaId, a.tipo, a.titulo, a.descricao || null, JSON.stringify({ seed: chave, fonte: a.fonte || null }), a.autor || 'marcelo', a.quando]);
}

async function negocio(empresaId, n) {
  const existe = await q1('select id from negocios where empresa_id = $1 and titulo = $2', [empresaId, n.titulo]);
  const cols = ['fase', 'valor', 'recorrencia_mensal', 'status', 'entrega', 'probabilidade', 'observacao'];
  if (existe) {
    await q(`update negocios set ${cols.map((c, i) => `${c} = $${i + 2}`).join(', ')} where id = $1`, [existe.id, ...cols.map((c) => n[c] ?? null)]);
    return existe.id;
  }
  const r = await q1(`insert into negocios (empresa_id, titulo, ${cols.join(',')}) values ($1,$2,${cols.map((_, i) => `$${i + 3}`).join(',')}) returning id`,
    [empresaId, n.titulo, ...cols.map((c) => n[c] ?? (c === 'status' ? 'aberto' : c === 'entrega' ? 'nao_iniciada' : c === 'fase' ? 'fase1' : null))]);
  return r.id;
}

async function financeiro(empresaId, negocioId, f) {
  const existe = await q1('select id from financeiro where empresa_id = $1 and descricao = $2', [empresaId, f.descricao]);
  if (existe) {
    await q('update financeiro set valor=$2, status=$3, tipo=$4, observacao=$5, negocio_id=$6 where id=$1', [existe.id, f.valor, f.status, f.tipo || 'projeto', f.observacao || null, negocioId]);
    return;
  }
  await q('insert into financeiro (empresa_id, negocio_id, descricao, valor, status, tipo, observacao) values ($1,$2,$3,$4,$5,$6,$7)',
    [empresaId, negocioId, f.descricao, f.valor, f.status, f.tipo || 'projeto', f.observacao || null]);
}

const t = (s) => new Date(s).toISOString();

// ----------------------------------------------------------------------------- Amparo Flores
{
  const id = await upsertEmpresa({
    nome: 'Amparo Flores', categoria: 'Floricultura', cidade: 'Salvador', bairro: 'Graça',
    endereco: 'Largo da Graça, 9-A, Graça, Salvador/BA, 40150-060',
    decisor: 'Varo (dono)', decisor_obs: 'Decide junto com a irmã (ela tem loja de flores própria).',
    whatsapp: '557191188740', telefone: '557132355898', instagram: 'amparoflores_ssa', instagram_seguidores: 1377,
    site_status: 'sem', google_nota: 4.1, google_avaliacoes: 41, gmb_status: 'reivindicado e completo', roda_anuncio: null,
    relacao: 'cliente', estagio: 'negociacao', temperatura: 'morno', origem: 'indicacao', origem_detalhe: 'Chegou pelo sócio do Marcelo (27/08/2026)',
    gancho: 'O caminho até o pedido: o produto é bom, o gargalo é pedir. Coroa/urgência de luto, recompra por datas e assinatura B2B da Graça.',
    dor: 'Pedido depende de ligar ou chamar no WhatsApp; sem loja própria nem régua de recompra.',
    valor_estimado: 1200,
    proxima_acao: 'Esperar o Varo sinalizar o início. Se sumir alguns dias, toque leve SEM cobrar Pix; quando ele sinalizar, pedir a entrada (oferecer cartão parcelado se hesitar).',
    tags: ['fase-1', 'recompra', 'b2b', 'foto-real-so', 'decisor-duplo'],
    pasta_repo: 'clientes/amparo-flores',
    resumo: 'Floricultura tradicional desde 1972 no Largo da Graça. Fechado verbal em 03/09 (Fase 1: loja no site com pedido caindo no WhatsApp, R$ 1.200 = 600 + 600). Entrada ainda não caiu. Site (7 páginas, e-commerce com carrinho e checkout pelo WhatsApp) construído. Fase 2 (checkout InfinitePay + CRM de estoque + recompra por data + agente de botões) a apresentar presencialmente, valor não comunicado.',
  });
  const f1 = await negocio(id, { titulo: 'Fase 1 — Loja no site com pedido no WhatsApp', fase: 'fase1', valor: 1200, status: 'aberto', entrega: 'revisao', probabilidade: 80,
    observacao: 'Sim verbal na reunião de 03/09. Entrada (R$ 600) ainda não caiu. Site construído e aprovado na reunião.' });
  await negocio(id, { titulo: 'Fase 2 — Checkout + CRM de estoque + recompra por data', fase: 'fase2', valor: null, status: 'aberto', entrega: 'nao_iniciada',
    observacao: 'Valor NÃO comunicado ao cliente. Referência interna: R$ 3.000 a 4.000 + R$ 250 a 350/mês. Apresentar presencialmente depois da Fase 1. Travas: agente de botões (não IA), plataforma pronta, nada de bot no número dele.' });
  await financeiro(id, f1, { descricao: 'Fase 1 — entrada (50%)', valor: 600, status: 'a_receber', observacao: 'Pendente desde o sim verbal de 03/09.' });
  await financeiro(id, f1, { descricao: 'Fase 1 — saldo na entrega (50%)', valor: 600, status: 'previsto' });
  for (const a of [
    { quando: t('2026-08-27T12:00:00-03:00'), tipo: 'sistema', titulo: 'Lead aberto', descricao: 'Chegou pelo sócio do Marcelo. Conselho de oferta rodado.', fonte: '_conselho/logs/2026-08-27-amparo-flores-oferta.md' },
    { quando: t('2026-09-02T12:00:00-03:00'), tipo: 'nota', titulo: 'Site virou e-commerce', descricao: 'Loja com carrinho e checkout montando a mensagem no WhatsApp (sem gateway).' },
    { quando: t('2026-09-03T15:00:00-03:00'), tipo: 'reuniao', titulo: 'Reunião presencial na loja: fechado verbal', descricao: 'Marcelo + sócio + Varo. Fase 1 R$ 1.200 (600 + 600). Varo decide junto com a irmã, que também quer site + CRM.', fonte: '_conselho/logs/2026-09-03-amparo-flores-fechamento-reuniao.md' },
    { quando: t('2026-09-09T18:00:00-03:00'), tipo: 'nota', titulo: 'Varo sumiu 4-5 dias', descricao: 'Sem resposta de 05 a 09/09, inclusive a duas cobranças de Pix no grupo.' },
    { quando: t('2026-09-10T11:03:00-03:00'), tipo: 'mensagem', titulo: 'Mensagem privada calma, sem cobrar', descricao: 'Decisão do Conselho: sair do grupo e reabrir por mensagem privada.', fonte: '_conselho/logs/2026-09-10-amparo-flores-insistir-ou-cortar.md' },
    { quando: t('2026-09-10T13:35:00-03:00'), tipo: 'whatsapp', titulo: 'Varo respondeu: "Vamos fazer sim"', descricao: '"Vamos fazer sim, eu te falo quando devemos começar." Silêncio era decisor duplo se alinhando.', autor: 'marcelo' },
  ]) await atividade(id, a);
}

// ----------------------------------------------------------------------------- Irmã do Varo (2º lead)
{
  const id = await upsertEmpresa({
    nome: 'Loja de flores da irmã do Varo [FALTA: nome]', categoria: 'Floricultura', cidade: 'Salvador',
    decisor: '[FALTA: nome da irmã do Varo]', relacao: 'lead', estagio: 'qualificado', temperatura: 'morno',
    origem: 'indicacao', origem_detalhe: 'Surgiu na reunião de fechamento da Amparo (03/09/2026)',
    dor: 'Quer site + CRM para a loja dela.', proxima_acao: 'Marcar reunião com a irmã do Varo (pedir o contato ao Varo quando a Fase 1 da Amparo começar).',
    tags: ['indicacao', 'site+crm'], pasta_repo: null,
    resumo: 'Segundo lead vindo da Amparo: a irmã do Varo tem loja de flores própria e quer site + CRM. Reunião a marcar. Nome e contato ainda não registrados.',
  });
  await atividade(id, { quando: t('2026-09-03T15:30:00-03:00'), tipo: 'nota', titulo: 'Interesse declarado na reunião da Amparo', descricao: 'Quer site + CRM dela.' });
}

// ----------------------------------------------------------------------------- Café Grão da Serra
{
  const id = await upsertEmpresa({
    nome: 'Café Grão da Serra', categoria: 'Café torrado (B2B e B2C)', cidade: 'Brejões/BA', bairro: 'Distrito Serrana',
    decisor: 'Nelson (dono, opera sozinho)', whatsapp: '5575991467309', instagram: 'graodaserra__',
    site: 'https://cafegraodaserra.netlify.app', site_status: 'ok', relacao: 'cliente', estagio: 'ganho', temperatura: 'quente',
    origem: 'indicacao', origem_detalhe: 'Amigo do sócio do Marcelo', gancho: '"A gente não planta, a gente escolhe" (sem "nossa lavoura")',
    proxima_acao: 'Definir escopo e valor do CRM (trabalho pago, escopo próprio, não virar extensão do grátis).',
    tags: ['portfolio', 'crm-pago-na-fila'], pasta_repo: 'clientes/grao-da-serra',
    resumo: 'Café 100% arábica, MEI em Brejões. Site institucional feito de graça por portfólio (no ar em https://cafegraodaserra.netlify.app). O CRM foi pedido por ele e é trabalho pago. A família não tem lavoura: compra o grão da região e beneficia.',
  });
  await negocio(id, { titulo: 'Site institucional (portfólio, sem custo)', fase: 'fase1', valor: 0, status: 'ganho', entrega: 'entregue', observacao: 'No ar desde 11/08/2026, aprovado pelo Nelson.' });
  await negocio(id, { titulo: 'CRM (trabalho pago)', fase: 'fase2', valor: null, status: 'aberto', entrega: 'nao_iniciada', observacao: '[FALTA: escopo e valor]. Pedido pelo cliente.' });
  for (const a of [
    { quando: t('2026-07-29T12:00:00-03:00'), tipo: 'reuniao', titulo: 'Call de briefing', fonte: 'clientes/grao-da-serra/roteiro-call-2026-07-29.md' },
    { quando: t('2026-08-11T12:00:00-03:00'), tipo: 'nota', titulo: 'Site no ar e aprovado', descricao: 'Nelson aprovou; origem do grão da região confirmada.' },
  ]) await atividade(id, a);
}

// ----------------------------------------------------------------------------- Mullsanni Performance
{
  const id = await upsertEmpresa({
    nome: 'Mullsanni Performance', categoria: 'Oficina de performance automotiva', cidade: 'Lauro de Freitas', bairro: 'Vilas do Atlântico',
    endereco: 'R. Itaju do Colônia, 792, Galpão 04, Vilas do Atlântico, Lauro de Freitas/BA',
    decisor: 'Jordan Nascimento (fundador) e Nelson Luis Malaquias (sócio)', decisor_obs: 'Quem respondeu foi o Cauã (gatekeeper), não os sócios.',
    whatsapp: null, instagram: 'mullsanniperformance', site: 'https://mullsanniperformance.com.br', site_status: 'fora_do_ar',
    google_nota: 5.0, google_avaliacoes: 11, roda_anuncio: false, cnpj: '57200432000163',
    relacao: 'lead', estagio: 'followup', temperatura: 'frio', origem: 'evento', origem_detalhe: 'Visto no Bon Odori (06/09/2026)',
    gancho: 'Vi vocês no Bon Odori, fui atrás e o site está fora do ar (DNS não resolve). Zero anúncio na Meta.',
    dor: 'Site morto e nenhum tráfego pago num ticket de R$ 1.500 a 8.000.', valor_estimado: 2000,
    proxima_acao: 'Prévia no coldre. Só reabrir se Jordan ou Nelson procurarem diretamente. Aborta se o Cauã responder de novo ou não responder.',
    tags: ['gatekeeper', 'previa-no-coldre', 'ticket-alto'], pasta_repo: 'clientes/mullsanni-performance',
    resumo: 'Remap ECU/TCU, escape inox, dinamômetro próprio. Empresa de ~1 ano, dois sócios. Barrado no gatekeeper em 15/09: "já temos equipe de marketing, site off-line temporariamente". WhatsApp divergente entre Google e bio: [FALTA: confirmar o número de atendimento].',
  });
  for (const a of [
    { quando: t('2026-09-06T20:00:00-03:00'), tipo: 'nota', titulo: 'Visto no Bon Odori', descricao: 'Marcelo foi atrás e descobriu o site fora do ar.' },
    { quando: t('2026-09-07T12:00:00-03:00'), tipo: 'pesquisa', titulo: 'Dossiê de prospecção', descricao: 'DNS do domínio não resolve; zero anúncio na Biblioteca da Meta; Google 5,0 com 11 avaliações.', fonte: 'clientes/mullsanni-performance/dossie-prospeccao.md' },
    { quando: t('2026-09-12T12:00:00-03:00'), tipo: 'nota', titulo: 'Prévia do site (rodada 4) com fotos reais' },
    { quando: t('2026-09-15T10:00:00-03:00'), tipo: 'mensagem', titulo: 'Primeira abordagem com a prévia pronta' },
    { quando: t('2026-09-15T11:00:00-03:00'), tipo: 'whatsapp', titulo: 'Gatekeeper (Cauã): "já temos equipe de marketing"', descricao: '"O site encontra-se off-line apenas temporariamente."' },
    { quando: t('2026-09-15T15:00:00-03:00'), tipo: 'nota', titulo: 'Conselho: responder curioso, prévia no coldre', descricao: 'Confiança 78%. Zero produção nova.', fonte: '_conselho/logs/2026-09-15-mullsanni-gatekeeper.md' },
  ]) await atividade(id, a);
}

// ----------------------------------------------------------------------------- Washington / W Delano
{
  const id = await upsertEmpresa({
    nome: 'W Delano (Washington) — mentoria de massoterapia', categoria: 'Mentoria para massoterapeutas', cidade: 'Salvador',
    decisor: 'Washington ("W Delano é a marca")', instagram: 'spamassagezen', instagram_seguidores: 9000,
    site_status: 'sem', relacao: 'lead', estagio: 'followup', temperatura: 'frio', origem: 'indicacao', origem_detalhe: 'Dossiê entregue pelo sócio do Marcelo',
    gancho: 'Autoridade real: +3.000 alunos formados, 18 anos de professor, citado em revista.',
    dor: 'Quer vender a mentoria por um site próprio (não quer Hotmart).', valor_estimado: 1200,
    proxima_acao: 'Follow-up frio: não pressionar. Retomar quando ele sinalizar.',
    tags: ['proposta-enviada', 'reposicionar-terapeutico', 'follow-up-frio'], pasta_repo: 'clientes/washington-daablio',
    resumo: 'Proposta faseada enviada (Fase 1 R$ 1.200 site + GMB; Fase 2 R$ 1.500 venda da mentoria). Em 06/09 não fechou: alegou problema na família e adiamento (pode ser real ou objeção de preço, não presumir). Trava de plataforma: reposicionar do sensual para o terapêutico.',
  });
  await negocio(id, { titulo: 'Fase 1 — Site de autoridade + Google Meu Negócio', fase: 'fase1', valor: 1200, status: 'pausado', entrega: 'nao_iniciada', observacao: 'À vista no Pix ou 3x R$ 400. Faseamento aprovado, mas não fechou em 06/09.' });
  await negocio(id, { titulo: 'Fase 2 — Venda da mentoria acoplada ao site', fase: 'fase2', valor: 1500, status: 'pausado', entrega: 'nao_iniciada', observacao: 'Só quando ele gravar os vídeos.' });
  for (const a of [
    { quando: t('2026-09-01T15:00:00-03:00'), tipo: 'reuniao', titulo: 'Reunião de venda', descricao: 'Público: massoterapeutas. Marca: W Delano. GMB aceito.', fonte: 'clientes/washington-daablio/pos-reuniao-2026-09-01.md' },
    { quando: t('2026-09-02T12:00:00-03:00'), tipo: 'proposta', titulo: 'Proposta comercial enviada (PDF)', fonte: 'clientes/washington-daablio/proposta-delano.pdf' },
    { quando: t('2026-09-06T12:00:00-03:00'), tipo: 'nota', titulo: 'Não fechou por ora', descricao: 'Alegou problema na família e necessidade de adiar. Lição em _memoria/comercial.md: fechar na reunião, não por documento.' },
  ]) await atividade(id, a);
}

// ----------------------------------------------------------------------------- Aion Psicologia
{
  const id = await upsertEmpresa({
    nome: 'Aion Psicologia', categoria: 'Clínica de psicologia', cidade: 'Salvador', bairro: 'Itaigara',
    endereco: 'Alameda Benevento, 429, salas 508 e 509, Salvador/BA',
    decisor: 'Maria Tutti Cabussú (coordenação)', whatsapp: '557191535067', email: 'aion@aionpsicologia.com',
    instagram: 'aionpsicologia', instagram_seguidores: 815, site_status: 'sem', regulado: true, conselho: 'CFP',
    relacao: 'lead', estagio: 'followup', temperatura: 'frio', origem: 'prospeccao', origem_detalhe: 'Projeto especulativo (site antes do sim)',
    dor: 'Mais de 20 anos de clínica e presença digital irregular.',
    proxima_acao: 'Engavetada desde 01/09. Quando retomar: apresentar o site pronto à cliente (falta dado que só ela tem).',
    tags: ['engavetada', 'compliance-cfp', 'site-especulativo'], pasta_repo: 'clientes/aion-psicologia',
    resumo: 'Clínica com equipe, seis serviços com peso igual. Site de 10 páginas pronto (especulativo). Compliance CFP trava: sem depoimento, sem promessa, CRP visível. Homônimo em SC (@aionpsicologiasc) não é esta.',
  });
  await negocio(id, { titulo: 'Site de 10 páginas (especulativo)', fase: 'fase1', valor: null, status: 'pausado', entrega: 'pausado', observacao: 'Pronto; faltam dados da cliente (CRP da PJ, responsável técnica, etc.).' });
  await atividade(id, { quando: t('2026-09-01T12:00:00-03:00'), tipo: 'nota', titulo: 'Engavetada', descricao: 'Saiu da linha de frente; prioridades passaram a ser Amparo e Washington.' });
}

// ----------------------------------------------------------------------------- Mayara Barros (conta interna)
{
  const id = await upsertEmpresa({
    nome: 'Mayara Barros — psicologia, arte e filosofia', categoria: 'Psicóloga (CRP 03/36219)', cidade: 'Salvador',
    decisor: 'Mayara Barros', instagram: 'universpsiquee', instagram_seguidores: 191, regulado: true, conselho: 'CFP',
    relacao: 'interno', estagio: 'ganho', origem: 'network', origem_detalhe: 'Conta interna (não pagante)',
    proxima_acao: 'Seguir a estratégia de Instagram (direção "Galeria"). Falta o e-Psi para liberar CTA de atendimento online.',
    tags: ['nao-pagante', 'instagram', 'compliance-cfp'], pasta_repo: 'clientes/mayara-barros',
    resumo: 'Não é cliente pagante (namorada do Marcelo). Máquina: Instagram. Post #1 "Xeque-Mate + Frankl" renderizado. "Ciência com afeto".',
  });
  await negocio(id, { titulo: 'Instagram (conta interna)', fase: 'avulso', valor: 0, status: 'ganho', entrega: 'producao' });
}

// ----------------------------------------------------------------------------- Permita-se Fitness (conta interna)
{
  const id = await upsertEmpresa({
    nome: 'Permita-se Fitness', categoria: 'Estúdio multi-modalidade (fitness)', cidade: 'Salvador', bairro: 'Boca do Rio',
    decisor: 'Jaqueline', site_status: 'sem', gmb_status: 'ausente',
    relacao: 'interno', estagio: 'ganho', origem: 'presencial', origem_detalhe: 'Oportunidade vista na rua (panfleto)',
    proxima_acao: 'Google Meu Negócio (prioridade) → Instagram → Site.', tags: ['sem-venda-formal', 'gmb'], pasta_repo: 'clientes/permita-se-fitness',
    resumo: 'Hidroginástica, pilates, zumba, boxe, dança, ballet kids, nutricionista. Presença digital zero. Trabalho posto em prática, sem venda formal. Evitar promessa de resultado físico.',
  });
  await negocio(id, { titulo: 'Google Meu Negócio', fase: 'fase1', valor: null, status: 'ganho', entrega: 'producao', observacao: 'Execução sem venda formal.' });
}

// ----------------------------------------------------------------------------- Dr. Giovanni (ex-cliente, arquivado)
{
  await upsertEmpresa({
    nome: 'Dr. Giovanni Nascimento — implantodontia', categoria: 'Odontologia (implantodontia)', cidade: 'Salvador',
    regulado: true, conselho: 'CFO', relacao: 'ex_cliente', estagio: 'perdido', origem: 'network', arquivado: true,
    tags: ['ex-cliente'], pasta_repo: 'clientes/dr-giovanni-nascimento',
    resumo: 'Removido da carteira em 27/08/2026 (decisão do Marcelo). Site nunca publicado. Pasta preservada como histórico.',
  });
}

const resumo = await q(`select relacao, estagio, count(*)::int n from empresas group by 1,2 order by 1,2`);
console.table(resumo);
const tot = await q1(`select (select count(*) from atividades)::int atividades, (select count(*) from negocios)::int negocios, (select count(*) from financeiro)::int financeiro`);
console.log(tot);
await fecharDb();
