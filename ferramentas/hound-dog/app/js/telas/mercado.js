/* =============================================================================
   HOUND DOG — Mercado: pesquisa de nicho e concorrência com o Claude
   ============================================================================= */
import { sb, estado, ouvir, criarJob, farejadorOnline, quem } from '../sb.js';
import { $, $$, esc, toast, confirmar, erroAmigavel, botaoCarregando, relativo, dataLonga, vazio, esqueleto, debounce, preencherMarkdown, modal, num } from '../ui.js';
import { icone, sparkClaude } from '../icones.js';

const TIPOS = [['mercado', 'Mercado do nicho', 'Tamanho, dor, ticket, sazonalidade, ganchos e se vale atacar'], ['concorrencia', 'Concorrência digital', 'Quem já faz marketing pra esse nicho na cidade e onde está a brecha']];

export default async function mercado(v, { args, params }) {
  if (args[0]) return relatorio(v, args[0]);
  v.innerHTML = `
    <div class="cab"><div class="tt"><h1>Pesquisa de mercado</h1><p>Entenda o nicho antes de atacar: quantos são, o que dói, quanto pagam e o gancho que abre porta.</p></div>
      <div class="acoes"><button class="btn prim" data-nova>${sparkClaude(16)}Nova pesquisa</button></div></div>
    <div class="mercado-grade">
      <section class="card pad-0"><div class="card-cab" style="padding:18px 20px 0"><div class="icone-caixa sm verde">${icone('estrela')}</div><div class="grow"><h3>Ranking de nichos</h3><p class="dim" style="font-size:12.5px">Nota de oportunidade dada pelo Claude (referência, não promessa).</p></div></div><div data-ranking>${esqueleto(4, 26)}</div></section>
      <section class="col gap-18"><div data-pesquisas>${esqueleto(4, 60)}</div></section>
    </div>`;

  async function carregar() {
    if (!v.isConnected) return;
    const { data, error } = await sb.from('pesquisas').select('id,tipo,titulo,nicho,cidade,status,resumo,nota_oportunidade,dados,criado_em,job_id').in('tipo', ['mercado', 'concorrencia']).order('criado_em', { ascending: false }).limit(100);
    if (error) { $('[data-pesquisas]', v).innerHTML = vazio('alerta', 'Não carregou', erroAmigavel(error)); return; }
    const prontas = (data || []).filter((p) => p.status === 'pronta' && p.tipo === 'mercado' && p.nota_oportunidade != null).sort((a, b) => b.nota_oportunidade - a.nota_oportunidade);
    $('[data-ranking]', v).innerHTML = prontas.length ? `<div class="tabela-wrap"><table class="tabela"><thead><tr><th>Nicho</th><th>Oportunidade</th><th>Negócios</th><th>Sem site</th><th></th></tr></thead><tbody>${prontas.map((p) => {
      const d = p.dados || {};
      return `<tr class="linha-clicavel" data-p="${p.id}"><td><div class="nm">${esc(p.nicho || p.titulo)}</div><div class="sb">${esc(p.cidade || '')}</div></td>
        <td><div class="row gap-6"><div class="progresso" style="width:90px"><i style="width:${p.nota_oportunidade}%"></i></div><b class="num">${p.nota_oportunidade}</b></div></td>
        <td class="num">${d.negocios_mapeados != null ? num(d.negocios_mapeados) : '—'}</td><td class="num">${d.pct_sem_site != null ? `${d.pct_sem_site}%` : '—'}</td><td>${icone('chevd')}</td></tr>`;
    }).join('')}</tbody></table></div>` : `<div style="padding:0 20px 20px">${vazio('mercado', 'Nenhum nicho pesquisado ainda', 'Cada pesquisa pronta entra aqui, ordenada pela nota de oportunidade.')}</div>`;

    $('[data-pesquisas]', v).innerHTML = (data || []).length ? data.map((p) => {
      const st = { fila: ['cinza', 'Na fila'], processando: ['claude', 'Pesquisando'], pronta: ['verde', 'Pronta'], erro: ['vermelho', 'Erro'] }[p.status];
      return `<article class="card pesquisa-card linha-clicavel" data-p="${p.id}"><div class="row"><span class="selo ${p.tipo === 'concorrencia' ? 'azul' : 'violeta'}">${p.tipo === 'concorrencia' ? 'Concorrência' : 'Mercado'}</span><span class="selo ${st[0]} ${p.status === 'processando' ? 'claude-pensando' : ''}">${p.status === 'processando' ? sparkClaude(12) : ''}${st[1]}</span><span class="grow"></span>${p.nota_oportunidade != null ? `<span class="nota-grande">${p.nota_oportunidade}</span>` : ''}</div>
        <h3 class="mt-8">${esc(p.titulo)}</h3><p class="dim clamp-2 mt-4">${esc(p.resumo || (p.status === 'pronta' ? '' : p.status === 'erro' ? 'A pesquisa falhou. Abra para ver o motivo.' : 'O Claude está coletando dados na web…'))}</p><small class="dim">${relativo(p.criado_em)}</small></article>`;
    }).join('') : `<div class="card">${vazio('mercado', 'Nenhuma pesquisa ainda', 'Comece por um nicho que você já atende ou que apareceu na rua.', `<button class="btn prim" data-nova2>${sparkClaude(15)}Pesquisar um nicho</button>`)}</div>`;
    $('[data-nova2]', v)?.addEventListener('click', () => novaPesquisa());
  }

  v.addEventListener('click', (ev) => {
    const p = ev.target.closest('[data-p]'); if (p) { location.hash = `#/mercado/${p.dataset.p}`; return; }
    if (ev.target.closest('[data-nova]')) novaPesquisa();
  });
  await carregar();
  if (params.nova) { history.replaceState(null, '', '#/mercado'); novaPesquisa({ nicho: params.nicho || '', cidade: params.cidade || '' }); }
  const tira = ouvir('pesquisas', debounce(carregar, 700));
  return () => tira();
}

export function novaPesquisa(pref = {}) {
  let tipo = pref.tipo || 'mercado';
  const m = modal({
    titulo: 'Nova pesquisa de mercado', subtitulo: 'O Claude pesquisa na web e na doutrina da casa. Leva de 5 a 15 minutos.', icone: 'mercado', largo: true,
    corpo: `<div class="tipos-pesquisa">${TIPOS.map(([k, r, d]) => `<button type="button" class="tipo-opcao ${k === tipo ? 'on' : ''}" data-tipo="${k}"><b>${r}</b><span>${d}</span></button>`).join('')}</div>
      <div class="grade-2 mt-16"><div class="campo"><label>Nicho *</label><input class="inp" data-nicho value="${esc(pref.nicho || '')}" placeholder="Ex.: clínicas de estética"></div>
        <div class="campo"><label>Cidade ou região *</label><input class="inp" data-cidade value="${esc(pref.cidade || 'Salvador, BA')}"></div></div>
      <div class="campo"><label>Perguntas específicas (opcional)</label><textarea class="txt" data-perguntas rows="3" placeholder="Ex.: quanto cobram pelos procedimentos? vale ir de porta em porta na Pituba?"></textarea></div>
      ${!farejadorOnline() ? `<div class="aviso laranja">${icone('alerta')}<div>Farejador offline: a pesquisa entra na fila e começa quando ele ligar.</div></div>` : ''}`,
    pe: `<button class="btn" data-fechar>Cancelar</button><button class="btn claude" data-ir>${sparkClaude(15)}Pesquisar</button>`,
  });
  $$('[data-fechar]', m.el).forEach((b) => (b.onclick = () => m.fechar()));
  $$('[data-tipo]', m.el).forEach((b) => (b.onclick = () => { tipo = b.dataset.tipo; $$('[data-tipo]', m.el).forEach((x) => x.classList.toggle('on', x === b)); }));
  $('[data-ir]', m.el).onclick = async (ev) => {
    const nicho = $('[data-nicho]', m.el).value.trim(), cidade = $('[data-cidade]', m.el).value.trim(), perguntas = $('[data-perguntas]', m.el).value.trim();
    if (!nicho || !cidade) { toast('Informe nicho e cidade', 'erro'); return; }
    botaoCarregando(ev.currentTarget, true, 'Enviando…');
    try {
      const titulo = `${tipo === 'concorrencia' ? 'Concorrência' : 'Mercado'}: ${nicho} em ${cidade}`;
      const { data: p, error } = await sb.from('pesquisas').insert({ tipo, titulo, nicho, cidade, pergunta: perguntas || null, status: 'fila', criado_por: quem() }).select().single();
      if (error) throw error;
      const job = await criarJob('pesquisa_mercado', { pesquisa_id: p.id, tipo, nicho, cidade, perguntas }, {}, 5);
      await sb.from('pesquisas').update({ job_id: job.id }).eq('id', p.id);
      m.fechar();
      toast('Pesquisa na fila do Claude', 'info', { acao: { rotulo: 'Acompanhar', fn: () => { location.hash = `#/mercado/${p.id}`; } } });
    } catch (e) { toast(erroAmigavel(e), 'erro'); botaoCarregando(ev.currentTarget, false); }
  };
}

async function relatorio(v, id) {
  v.innerHTML = `<div class="card">${esqueleto(10, 22)}</div>`;
  async function carregar() {
    const { data: p, error } = await sb.from('pesquisas').select('*').eq('id', id).maybeSingle();
    if (error || !p) { v.innerHTML = vazio('alerta', 'Pesquisa não encontrada', error ? erroAmigavel(error) : 'Ela pode ter sido excluída.', '<a class="btn sm" href="#/mercado">Voltar</a>'); return; }
    let job = null;
    if (p.job_id) job = (await sb.from('jobs').select('status,progresso,erro,iniciado_em').eq('id', p.job_id).maybeSingle()).data;
    const d = p.dados || {};
    const lista = (t, arr) => (arr?.length ? `<div class="card"><div class="rotulo mb-8">${t}</div><ul class="lista-simples">${arr.map((x) => `<li>${esc(typeof x === 'string' ? x : x.texto || x.nome || JSON.stringify(x))}</li>`).join('')}</ul></div>` : '');
    v.innerHTML = `
      <div class="cab"><div class="tt"><a class="btn xs fantasma" href="#/mercado">${icone('setae')}Pesquisas</a><h1 class="mt-8">${esc(p.titulo)}</h1><p>${esc([p.nicho, p.cidade].filter(Boolean).join(' · '))} · ${dataLonga(p.criado_em)}${p.criado_por ? ` · pedida por ${esc(p.criado_por)}` : ''}</p></div>
        <div class="acoes">${p.status === 'pronta' ? `<a class="btn prim" href="#/encontrar?aba=claude">${icone('radar')}Farejar este nicho</a>` : ''}<a class="btn claude" href="#/claude?pesquisa=${p.id}">${sparkClaude(14)}Conversar sobre isto</a><button class="btn icone" data-excluir aria-label="Excluir pesquisa">${icone('lixo')}</button></div></div>
      ${p.status !== 'pronta' ? `<div class="aviso ${p.status === 'erro' ? 'vermelho' : 'claude'} mb-16">${p.status === 'erro' ? icone('alerta') : `<span class="claude-pensando">${sparkClaude(18)}</span>`}<div><b>${p.status === 'erro' ? 'A pesquisa falhou' : p.status === 'fila' ? (farejadorOnline() ? 'Na fila, começando…' : 'Na fila: o Farejador está offline') : 'O Claude está pesquisando'}</b><br>${esc(job?.erro || job?.progresso || (p.status === 'fila' ? 'Assim que o Farejador pegar, o progresso aparece aqui.' : ''))}</div>
        ${p.status === 'erro' ? `<button class="btn sm right" data-refazer>${icone('atualizar')}Tentar de novo</button>` : ''}</div>` : ''}
      ${p.status === 'pronta' ? `
        <div class="relatorio-topo">
          <div class="card destaque nota-card"><div class="rotulo acc">Oportunidade</div><div class="nota-xl">${p.nota_oportunidade ?? '—'}<small>/100</small></div><p class="dim">${esc(d.veredito || '')}</p></div>
          <div class="kpis" style="margin:0">
            ${d.negocios_mapeados != null ? `<div class="kpi"><div class="kl">Negócios mapeados</div><div class="kv">${num(d.negocios_mapeados)}</div></div>` : ''}
            ${d.pct_sem_site != null ? `<div class="kpi"><div class="kl">Sem site</div><div class="kv">${d.pct_sem_site}%</div><div class="ks">da amostra</div></div>` : ''}
            ${d.ticket_tipico ? `<div class="kpi"><div class="kl">Ticket do cliente final</div><div class="kv" style="font-size:20px">${esc(d.ticket_tipico)}</div></div>` : ''}
            ${d.concorrencia ? `<div class="kpi"><div class="kl">Concorrência digital</div><div class="kv" style="font-size:20px">${esc(d.concorrencia)}</div></div>` : ''}
            ${d.fase_sugerida ? `<div class="kpi"><div class="kl">Entrada sugerida</div><div class="kv" style="font-size:18px">${esc(d.fase_sugerida)}</div></div>` : ''}
          </div>
        </div>
        ${p.resumo ? `<div class="card mt-16"><div class="rotulo mb-8">Resumo</div><p style="font-size:16px;line-height:1.6">${esc(p.resumo)}</p></div>` : ''}
        <div class="grade-relatorio mt-16">${lista('Dores do dono', d.dores)}${lista('Ganchos que abrem porta', d.ganchos)}${lista('Objeções prováveis', d.objecoes)}${lista('Onde achar os leads', d.onde_achar)}${lista('Riscos e compliance', d.riscos)}${lista('Sazonalidade', d.sazonalidade)}</div>
        ${(d.exemplos || []).length ? `<div class="card mt-16"><div class="rotulo mb-8">Exemplos encontrados</div><div class="tabela-wrap"><table class="tabela"><thead><tr><th>Negócio</th><th>Site</th><th>Instagram</th><th>Observação</th></tr></thead><tbody>${d.exemplos.map((x) => `<tr><td class="nm">${esc(x.nome)}</td><td>${esc(x.site || '—')}</td><td>${x.instagram ? `@${esc(String(x.instagram).replace('@', ''))}` : '—'}</td><td class="dim">${esc(x.observacao || '')}</td></tr>`).join('')}</tbody></table></div></div>` : ''}
        <div class="card mt-16"><div class="rotulo mb-8">Relatório completo</div><div class="md" data-md></div></div>
        ${(d.fontes || []).length ? `<div class="card mt-16"><div class="rotulo mb-8">Fontes</div><ul class="lista-simples fontes">${d.fontes.map((f) => `<li><a href="${esc(f.url || f)}" target="_blank" rel="noopener">${esc(f.titulo || f.url || f)}</a></li>`).join('')}</ul></div>` : ''}` : ''}`;
    if (p.status === 'pronta') preencherMarkdown($('[data-md]', v), p.conteudo_md || '');
    $('[data-excluir]', v).onclick = async () => {
      if (!(await confirmar('Excluir pesquisa?', p.titulo, { rotulo: 'Excluir', perigo: true }))) return;
      const { error: e } = await sb.from('pesquisas').delete().eq('id', id);
      if (e) toast(erroAmigavel(e), 'erro'); else { toast('Pesquisa excluída'); location.hash = '#/mercado'; }
    };
    $('[data-refazer]', v)?.addEventListener('click', async (ev) => {
      botaoCarregando(ev.currentTarget, true);
      const job2 = await criarJob('pesquisa_mercado', { pesquisa_id: p.id, tipo: p.tipo, nicho: p.nicho, cidade: p.cidade, perguntas: p.pergunta }, {}, 5);
      await sb.from('pesquisas').update({ status: 'fila', job_id: job2.id }).eq('id', p.id);
      carregar();
    });
  }
  await carregar();
  const rec = debounce(carregar, 800);
  const t1 = ouvir('pesquisas', (x) => { if (x.new?.id === id) rec(); });
  const t2 = ouvir('jobs', (x) => { if (x.new?.entrada?.pesquisa_id === id) rec(); });
  return () => { t1(); t2(); };
}
