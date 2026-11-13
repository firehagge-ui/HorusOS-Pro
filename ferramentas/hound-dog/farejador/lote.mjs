// =============================================================================
// O lote do Fischer (13/11/2026, pedido do Marcelo). PLANO-AGENTES.md, seção "Fischer".
// A lista da busca do Maps já passou pelo filtro que o Marcelo escolheu na tela. Aqui o Claude confere cada empresa,
// escolhe as N melhores e escreve a M1, o FU1 e o FU2 de cada uma. No PC do Marcelo isso roda na janela do chat
// (ele assiste e corrige); pedido de operador roda escondido, como a triagem de sempre.
// Grava: as escolhidas vão pro Novo com a etiqueta do lote e a M1 vira rascunho no Disparos (nada sai sem aprovação);
// o FU1 e o FU2 ficam na ficha como rascunho até o envio automático do lote existir; quem passou e ficou de fora
// continua na lista com o motivo; quem não passou sai da lista com o motivo.
// =============================================================================
import { q, q1 } from '../lib/db.mjs';
import { salvarEmpresa, registrarAtividade } from '../lib/crm.mjs';
import { rodarClaude, rodarNaJanela, podeAbrirJanela, contaRestrita } from './claude.mjs';
import * as P from './prompts.mjs';
import { revisar } from '../app/js/revisor.js';
import * as WA from './whatsapp.mjs';
import { especialistaPara, saberDoEspecialista } from '../lib/agentes.mjs';
import { conferirCnpj } from './documentos.mjs';

const FERR = ['WebSearch', 'WebFetch', 'Read', 'Grep', 'Glob', 'mcp__firecrawl', 'mcp__navegador'];
const semTraco = (t) => String(t || '').replace(/\s*\n+\s*/g, ' ').trim();

export async function montarLote(job, progresso, cancelado) {
  const ids = job.entrada?.item_ids || [];
  const quantidade = Math.max(1, Math.min(20, Number(job.entrada?.quantidade) || 10));
  const foco = job.entrada?.foco || 'geral';
  const filtros = job.entrada?.filtros || {};
  const listaId = job.lista_id || job.entrada?.lista_id;
  const carregar = (lista) => q(`select i.*, l.nome lista_nome, l.origem lista_origem from lista_itens i join listas l on l.id = i.lista_id
    where i.id = any($1) and not i.descartado and i.empresa_id is null`, [lista]);
  let itens = await carregar(ids);
  if (!itens.length) throw new Error('Nenhuma empresa da lista sobrou para o lote (todas já estão no CRM ou foram descartadas).');

  // O CNPJ entra só agora, nas que sobraram do filtro (13/11, Marcelo: "conferir os CNPJs só deveria acontecer depois que a
  // gente já tem as melhores"). É a base da Receita, sem Claude. Se a base falhar, o lote segue sem esse corte.
  const semCnpj = itens.filter((i) => !i.dados?.cnpj).map((i) => i.id);
  let avisoCnpj = null;
  if (semCnpj.length && listaId) {
    await progresso(`Conferindo o CNPJ de ${semCnpj.length} empresas na Receita (sem Claude)`);
    try { await conferirCnpj({ id: `${job.id}-cnpj`, lista_id: listaId, entrada: { item_ids: semCnpj.slice(0, 40), lista_id: listaId } }, progresso, cancelado); }
    catch (e) { avisoCnpj = `CNPJ não conferido: ${String(e.message).slice(0, 120)}`; await progresso(avisoCnpj); }
    itens = await carregar(ids);
  }
  const anos = (i) => { const d = new Date(i.dados?.cnpj?.receita?.abertura || ''); return Number.isNaN(d.getTime()) ? null : (Date.now() - d) / (365.25 * 864e5); };
  const cortadas = [];
  itens = itens.filter((i) => {
    const c = i.dados?.cnpj, rec = c?.receita;
    const motivo = c?.veredito === 'reprovado' ? `CNPJ com problema (${(c.motivos || []).join('; ').slice(0, 80)})`
      : rec && filtros.sem_mei !== false && rec.mei ? 'é MEI'
      : rec && Number(filtros.anos) > 0 && anos(i) != null && anos(i) < Number(filtros.anos) ? `aberta há menos de ${filtros.anos} anos` : null;
    if (motivo) cortadas.push({ id: i.id, nome: i.nome, motivo });
    return !motivo;
  });
  for (const c of cortadas) await q("update lista_itens set observacao = $2 where id = $1", [c.id, `Fora do lote: ${c.motivo}`]);
  // Para o Claude vão no máximo 3 vezes o tamanho do lote, as de maior score
  itens = itens.sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, quantidade * 3);
  if (!itens.length) throw new Error(`Depois do CNPJ não sobrou nenhuma empresa (${cortadas.length} cortadas: MEI, empresa nova ou CNPJ com problema). Afrouxe o filtro.`);

  // O conhecimento do nicho, como na triagem (22/10): o geral sempre, o específico só do nicho de cada empresa
  const espIds = await Promise.all(itens.map((i) => especialistaPara({ categoria: i.categoria, nome: i.nome })));
  const nichos = (await Promise.all([...new Set(espIds.filter(Boolean))].map(saberDoEspecialista))).filter(Boolean);
  const amplas = itens.map((i, k) => (espIds[k] ? null : P.secaoAmpla(i)));
  const restrito = contaRestrita();
  const marcar = (k) => {
    const esp = nichos.find((n) => n.id === espIds[k]);
    if (esp) return `${esp.segmento}: use o caderno desse nicho`;
    if (amplas[k] && !restrito) return `${amplas[k].replace(/^## /, '')}: use o catálogo desse nicho`;
    return 'sem nicho mapeado: use só o geral';
  };
  const enviar = itens.map((i, k) => ({ id: i.id, nome: i.nome, categoria: i.categoria, nicho: marcar(k), cidade: i.cidade, bairro: i.bairro, endereco: i.endereco,
    whatsapp: i.whatsapp, telefone: i.telefone, instagram: i.instagram, site: i.site, site_status: i.site_status, google_nota: i.google_nota,
    google_avaliacoes: i.google_avaliacoes, gmb_status: i.gmb_status || null, observacao: i.observacao || null, cnpj: i.dados?.cnpj?.receita || null,
    dados: { horarios: i.dados?.horarios, link: i.dados?.link, comentarios: i.dados?.comentarios, status_google: i.dados?.status_google } }));
  const doutrina = P.doutrinaTriagem({ nichos, amplos: [...new Set(amplas.filter(Boolean))], semMapa: itens.some((_, k) => !espIds[k] && !amplas[k]), restrito });

  const naJanela = Boolean(job.entrada?.janela) && podeAbrirJanela();
  const prompt = P.promptLote({ itens: enviar, quantidade, foco, doutrina, naJanela });
  let r;
  if (naJanela) {
    await progresso(`Janela do chat aberta no PC: escolher ${quantidade} de ${itens.length} empresas`);
    r = await rodarNaJanela({ chave: job.id, titulo: `Lote do Fischer: escolher ${quantidade} de ${itens.length} empresas`, prompt, deveParar: cancelado });
  } else {
    await progresso(`Conferindo ${itens.length} empresas e escolhendo ${quantidade}`);
    r = await rodarClaude({
      prompt: `${prompt}\n\nO CONHECIMENTO DE PROSPECÇÃO DA CASA (para as mensagens)\n${P.doutrinaConversa()}`,
      sistema: P.REGRAS_CASA, modelo: 'claude-opus-5-5', modo: 'horus', ferramentas: FERR,
      timeoutMs: Math.min(120, 15 + itens.length * 4) * 60 * 1000,
      aoFerramenta: (f) => progresso(`${f.rotulo}${f.detalhe ? `: ${f.detalhe.slice(0, 60)}` : ''}`), deveParar: cancelado,
    });
  }
  const res = r.json?.itens;
  if (!Array.isArray(res)) throw new Error('O Claude não devolveu o lote no formato esperado.');
  const saida = await gravarLote({ job, itens, res, resumo: r.json?.resumo, quantidade, foco, progresso });
  return { ...saida, cortadas_cnpj: cortadas.length, aviso_cnpj: avisoCnpj };
}

/** Grava o resultado do lote. Separado para o teste rodar sem o Claude. */
export async function gravarLote({ job, itens, res, resumo, quantidade, foco, progresso = async () => {} }) {
  const { pontuar, detectarRegulado } = await import('../app/js/score.js');
  const opc = (await q("select chave, valor from config where chave in ('score','nichos_conhecidos','praca')")).reduce((a, l) => ({ ...a, [l.chave]: l.valor }), {});
  const hoje = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Bahia', day: '2-digit', month: '2-digit' });
  const etiqueta = `lote:${new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bahia' })}`;
  const escolhidas = [], ficaram = [], descartadas = [];
  const textosDoLote = [];
  let escolhidasN = 0;
  for (const up of res) {
    const it = itens.find((i) => i.id === up.id);
    if (!it) continue;
    const campos = ['site', 'site_status', 'instagram', 'instagram_seguidores', 'google_nota', 'google_avaliacoes', 'gmb_status'];
    const novo = Object.fromEntries(campos.filter((c) => up[c] !== undefined && up[c] !== null && up[c] !== '').map((c) => [c, up[c]]));
    if (novo.site_status && !['sem', 'fora_do_ar', 'ruim', 'ok'].includes(novo.site_status)) delete novo.site_status;
    if (novo.instagram) novo.instagram = String(novo.instagram).replace(/^@/, '').trim();
    const comb = { ...it, ...novo };
    const p = pontuar(comb, { pesos: opc.score, nichos: opc.nichos_conhecidos, praca: opc.praca?.regiao });
    const passa = up.decisao === 'passa';
    const escolhido = passa && up.escolhido === true && escolhidasN < quantidade;
    const div = (up.divergencias || []).filter(Boolean), sinais = (up.sinais || []).filter(Boolean), oport = (up.oportunidades || []).filter(Boolean);
    const nota = `Lote ${hoje}: ${escolhido ? 'escolhida' : passa ? 'passou e ficou de fora do lote' : 'descartada'}. ${up.motivo || ''}${div.length ? ` Divergências: ${div.join(' · ')}` : ''}${sinais.length ? ` Sinais: ${sinais.join(' · ')}` : ''}${passa && oport.length ? ` Oportunidades (hipótese): ${oport.join(' · ')}` : ''}`.trim();
    const cols = Object.keys(novo);
    await q(`update lista_itens set ${cols.map((c, i) => `${c} = $${i + 2}, `).join('')}score = $${cols.length + 2}, prioridade = $${cols.length + 3},
      score_motivos = $${cols.length + 4}, observacao = $${cols.length + 5}, descartado = $${cols.length + 6} where id = $1`,
      [it.id, ...cols.map((c) => novo[c]), p.score, p.prioridade, JSON.stringify(p.motivos), nota.slice(0, 1500), !passa]);
    if (!passa) { descartadas.push(`${it.nome}: ${up.motivo || 'sem motivo'}`); continue; }
    if (!escolhido) { ficaram.push(it.nome); continue; }
    escolhidasN++;

    // Escolhida: entra no Novo (ou liga à ficha que já existe)
    const existente = await q1(`select id, nome from empresas where lista_item_id = $1 or (instagram is not null and lower(instagram) = lower($2))
      or (whatsapp is not null and $3 <> '' and right(whatsapp, 8) = right($3, 8)) limit 1`,
      [it.id, comb.instagram || '__nada__', String(it.whatsapp || '').replace(/\D/g, '')]);
    if (existente) {
      await q('update lista_itens set empresa_id = $2 where id = $1', [it.id, existente.id]);
      escolhidas.push(`${it.nome} (já estava no CRM: nenhuma mensagem nova)`);
      continue;
    }
    const conselho = detectarRegulado(`${it.categoria || ''} ${it.nome}`);
    const s = await salvarEmpresa({
      nome: it.nome, categoria: it.categoria, cidade: it.cidade, bairro: it.bairro, endereco: it.endereco, telefone: it.telefone, whatsapp: it.whatsapp,
      instagram: comb.instagram, instagram_seguidores: comb.instagram_seguidores, site: comb.site, site_status: comb.site_status, google_nota: comb.google_nota,
      google_avaliacoes: comb.google_avaliacoes, gmb_status: comb.gmb_status, cnpj: it.cnpj,
      ...(conselho ? { regulado: true, conselho } : {}), estagio: 'novo', relacao: 'lead',
      tags: ['triado', 'lote-fischer', etiqueta, 'abordagem:fischer', ...(foco !== 'geral' ? [`foco:${foco}`] : [])],
      origem: it.lista_origem === 'claude' ? 'claude' : 'spark', origem_detalhe: it.lista_nome, lista_item_id: it.id,
      gancho: up.gancho || null, proxima_acao: 'Aprovar a primeira mensagem do lote no Disparos',
    }, 'claude');
    const empId = s.empresa.id;
    await q('update lista_itens set empresa_id = $2 where id = $1', [it.id, empId]);
    await registrarAtividade(empId, 'pesquisa', 'Lote do Fischer: escolhida', nota, 'claude');

    // A M1 vira rascunho no Disparos (o Marcelo aprova o texto exato); o revisor vai junto
    const tel = String(it.whatsapp || '').replace(/\D/g, '');
    const m1 = semTraco(up.m1);
    if (m1 && tel.length >= 12 && !/[—–]/.test(m1)) {
      await q(`insert into disparos (empresa_id, telefone, texto, formato, passo, angulo, verificacao, revisao, criado_por) values ($1,$2,$3,'casa',1,'lote do Fischer',$4,$5,'claude')`,
        [empId, tel, m1, JSON.stringify(up.verificacao || []), JSON.stringify(revisar(m1, { passo: 1, empresa: it.nome, lote: textosDoLote }).itens)]);
      textosDoLote.push(m1);
      await registrarAtividade(empId, 'nota', 'Rascunho: M1 do lote', m1, 'claude');
    } else if (m1) {
      await registrarAtividade(empId, 'nota', 'Rascunho: M1 do lote (sem celular válido ou com travessão: não foi pro Disparos)', m1, 'claude');
    }
    if (up.fu1) await registrarAtividade(empId, 'nota', 'Rascunho: FU1 (48 horas depois da M1, se não responder)', semTraco(up.fu1), 'claude');
    if (up.fu2) await registrarAtividade(empId, 'nota', 'Rascunho: FU2 (3 dias depois do FU1, o último)', semTraco(up.fu2), 'claude');
    escolhidas.push(it.nome);
  }
  await progresso(`Lote pronto: ${escolhidas.length} escolhidas, ${ficaram.length} ficaram de fora, ${descartadas.length} descartadas`);
  const linhas = [`📦 *Lote do Fischer pronto:* ${escolhidas.length} escolhida${escolhidas.length === 1 ? '' : 's'}`];
  if (resumo) linhas.push(String(resumo).slice(0, 300));
  if (escolhidas.length) linhas.push('', '*Escolhidas (M1 no Disparos esperando você)*', ...escolhidas.map((n) => `• ${n}`));
  if (descartadas.length) linhas.push('', `*Descartadas:* ${descartadas.length}`);
  linhas.push('', '— Hounder');
  await WA.enviarParaMim(linhas.join('\n')).catch(() => {});
  return { escolhidas: escolhidas.length, ficaram: ficaram.length, descartadas: descartadas.length, pedidos: itens.length, lista_id: job.lista_id || job.entrada?.lista_id || null };
}
