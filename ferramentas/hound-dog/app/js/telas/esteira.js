/* =============================================================================
   HOUND DOG — Esteira: o funil de prospecção em kanban (ou lista)
   ============================================================================= */
import { sb, estado, ouvir, estagio as achaEstagio } from '../sb.js';
import { $, $$, esc, brl, relativo, diasDesde, vazio, debounce, kpi, iniciais, baixarArquivo, paraCSV, telefoneBonito, linkWhats } from '../ui.js';
import { icone } from '../icones.js';
import { abrirFicha, seloSite } from '../ficha.js';
import { moverEstagio, novoLead, agendar } from '../acoes.js';
import { PROB_ESTAGIO } from '../copiloto.js';

const PREF = 'hd-esteira';
function lerPref() { try { return JSON.parse(localStorage.getItem(PREF) || '{}'); } catch { return {}; } }
function gravarPref(p) { try { localStorage.setItem(PREF, JSON.stringify(p)); } catch { /* ok */ } }

export default async function esteira(v) {
  const pref = lerPref();
  let modo = pref.modo || 'kanban';
  let filtro = pref.filtro || 'todos';
  let mostrarFechados = pref.fechados ?? true;
  let busca = '';
  let ordenar = { campo: 'score', dir: -1 };
  let atencaoIds = new Set();

  v.className = 'vista cheia';
  v.innerHTML = `
    <div class="cab"><div class="tt"><h1>Esteira</h1><p>Onde cada negócio está, do primeiro contato ao fechamento.</p></div>
      <div class="acoes"><a class="btn" href="#/encontrar?aba=listas">${icone('upload')}Importar da lista</a><button class="btn prim" data-novo>${icone('mais')}Novo lead</button></div></div>
    <div class="kpis" data-kpis></div>
    <div class="barra-ferramentas">
      <div class="busca" style="flex:1;max-width:380px">${icone('busca')}<input class="inp" data-busca placeholder="Buscar por nome, nicho, cidade, @…"></div>
      <div class="chips" data-filtros>${[['todos', 'Todos'], ['alta', 'Alta prioridade'], ['atencao', 'Precisa de atenção'], ['quentes', 'Quentes'], ['regulados', 'Regulados'], ['sem_site', 'Sem site']].map(([k, r]) => `<button class="chip ${filtro === k ? 'on' : ''}" data-f="${k}">${r}</button>`).join('')}</div>
      <span class="grow"></span>
      <label class="check"><input type="checkbox" data-fechados ${mostrarFechados ? 'checked' : ''}> Ganhos e perdidos</label>
      <div class="segmento" role="group" aria-label="Modo"><button data-modo="kanban" class="${modo === 'kanban' ? 'on' : ''}">${icone('quadros')}</button><button data-modo="lista" class="${modo === 'lista' ? 'on' : ''}">${icone('lista')}</button></div>
      <button class="btn icone sm" data-csv aria-label="Exportar CSV">${icone('download')}</button>
    </div>
    <div class="quadro-wrap" data-area></div>`;

  const area = $('[data-area]', v);

  function visiveis() {
    const q = busca.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    return estado.empresas.filter((e) => {
      if (e.arquivado || !['lead', 'cliente'].includes(e.relacao)) return false;
      if (!mostrarFechados && ['ganho', 'perdido'].includes(e.estagio)) return false;
      if (filtro === 'alta' && e.prioridade !== 'alta') return false;
      if (filtro === 'atencao' && !atencaoIds.has(e.id)) return false;
      if (filtro === 'quentes' && e.temperatura !== 'quente') return false;
      if (filtro === 'regulados' && !e.regulado) return false;
      if (filtro === 'sem_site' && !['sem', 'fora_do_ar'].includes(e.site_status)) return false;
      if (q && !`${e.nome} ${e.categoria} ${e.cidade} ${e.bairro} ${e.instagram} ${e.decisor} ${(e.tags || []).join(' ')}`.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().includes(q)) return false;
      return true;
    });
  }

  function desenharKpis() {
    const todos = estado.empresas.filter((e) => !e.arquivado && ['lead', 'cliente'].includes(e.relacao));
    const abertos = todos.filter((e) => !['ganho', 'perdido', 'followup', 'novo'].includes(e.estagio));
    const valorAberto = abertos.reduce((a, e) => a + (Number(e.valor_estimado) || 0), 0);
    const inicioMes = new Date(); inicioMes.setDate(1); inicioMes.setHours(0, 0, 0, 0);
    const ganhosMes = todos.filter((e) => e.estagio === 'ganho' && new Date(e.estagio_desde) >= inicioMes);
    const ponderado = abertos.reduce((a, e) => a + (Number(e.valor_estimado) || 0) * (PROB_ESTAGIO[e.estagio] || 0) / 100, 0);
    $('[data-kpis]', v).innerHTML = [
      kpi({ icone: 'dinheiro', rotulo: 'Valor em aberto', valor: brl(valorAberto), sub: `${abertos.length} negócio${abertos.length === 1 ? '' : 's'} · ponderado ${brl(ponderado)}` }),
      kpi({ icone: 'tendencia', rotulo: 'Em andamento', valor: abertos.length, sub: 'do qualificado à negociação', cor: 'violeta' }),
      kpi({ icone: 'estrela', rotulo: 'Ganhos no mês', valor: ganhosMes.length, sub: ganhosMes.length ? brl(ganhosMes.reduce((a, e) => a + (Number(e.valor_estimado) || 0), 0)) : 'nenhum ainda', cor: 'verde' }),
      kpi({ icone: 'alerta', rotulo: 'Precisam de atenção', valor: atencaoIds.size, sub: atencaoIds.size ? 'ação vencida ou parado +3 dias' : 'nada pendente', cor: 'vermelho' }),
    ].join('');
  }

  function cartao(e) {
    const dias = diasDesde(e.estagio_desde);
    const vencida = e.proxima_acao_em && new Date(e.proxima_acao_em) < new Date();
    const temp = e.temperatura === 'quente' ? `<span class="selo vermelho">${icone('fogo')}quente</span>` : e.temperatura === 'frio' ? '<span class="selo azul">frio</span>' : '';
    return `<article class="cartao ${atencaoIds.has(e.id) ? 'atencao' : ''}" draggable="true" data-id="${e.id}" tabindex="0" aria-label="${esc(e.nome)}">
      <div class="ct"><b>${esc(e.nome)}</b><span class="score sm ${e.prioridade}">${e.score}</span></div>
      <div class="cs ellipsis">${esc([e.categoria, e.bairro || e.cidade].filter(Boolean).join(' · ') || '—')}</div>
      <div class="cc">${['sem', 'fora_do_ar', 'ruim'].includes(e.site_status) ? seloSite(e.site_status) : ''}${e.regulado ? `<span class="selo vermelho">${icone('escudo')}${esc(e.conselho || 'regulado')}</span>` : ''}${temp}${e.relacao === 'cliente' ? '<span class="selo verde">cliente</span>' : ''}</div>
      ${e.proxima_acao ? `<div class="ca ${vencida ? 'vencida' : ''}">${icone(vencida ? 'alerta' : 'alvo')}<span class="clamp-2">${esc(e.proxima_acao)}</span></div>` : ['conversando', 'reuniao', 'proposta', 'negociacao'].includes(e.estagio) ? `<div class="ca vencida">${icone('alerta')}<span>Sem próxima ação</span></div>` : ''}
      <div class="cp">${e.valor_estimado ? `<b class="num">${brl(e.valor_estimado)}</b>` : '<span>sem valor</span>'}<span class="grow"></span><span title="Tempo neste estágio">${icone('relogio')} ${dias ?? 0}d</span>
        ${e.whatsapp ? `<a class="btn icone sm fantasma" href="${linkWhats(e.whatsapp)}" target="_blank" rel="noopener" data-parar aria-label="WhatsApp">${icone('whatsapp')}</a>` : ''}
        <button class="btn icone sm fantasma" data-agendar="${e.id}" data-parar aria-label="Agendar">${icone('agenda')}</button></div>
    </article>`;
  }

  function desenharKanban() {
    const lst = visiveis();
    const cols = estado.estagios.filter((s) => s.funil === 'prospeccao' && (mostrarFechados || !['ganho', 'perdido'].includes(s.id)));
    area.innerHTML = `<div class="quadro">${cols.map((s) => {
      const doEst = lst.filter((e) => e.estagio === s.id).sort((a, b) => (atencaoIds.has(b.id) - atencaoIds.has(a.id)) || b.score - a.score);
      const soma = doEst.reduce((a, e) => a + (Number(e.valor_estimado) || 0), 0);
      return `<section class="coluna" data-col="${s.id}" aria-label="${esc(s.nome)}">
        <header class="coluna-cab" title="${esc(s.descricao || '')}"><span class="ponto" style="background:${s.cor}"></span><b>${esc(s.nome)}</b><span class="badge">${doEst.length}</span><span class="soma">${soma ? brl(soma) : ''}</span></header>
        <div class="coluna-corpo" data-drop="${s.id}">${doEst.map(cartao).join('') || `<div class="vazio">${esc(s.descricao || 'Nenhum negócio nesta etapa.')}</div>`}</div>
        <footer class="coluna-pe"><button class="btn sm fantasma" data-add="${s.id}">${icone('mais')}Adicionar</button></footer>
      </section>`;
    }).join('')}</div>`;
    ligarArrasto();
  }

  function desenharLista() {
    const lst = visiveis();
    const cmp = (a, b) => {
      const c = ordenar.campo;
      const va = c === 'estagio' ? achaEstagio(a.estagio).ordem : a[c]; const vb = c === 'estagio' ? achaEstagio(b.estagio).ordem : b[c];
      if (va == null) return 1; if (vb == null) return -1;
      return (typeof va === 'string' ? va.localeCompare(vb) : va - vb) * ordenar.dir;
    };
    lst.sort(cmp);
    const th = (campo, rotulo) => `<th class="ord" data-ord="${campo}">${rotulo}${ordenar.campo === campo ? (ordenar.dir > 0 ? ' ↑' : ' ↓') : ''}</th>`;
    area.innerHTML = `<div class="card pad-0"><div class="tabela-wrap"><table class="tabela">
      <thead><tr>${th('nome', 'Empresa')}${th('estagio', 'Estágio')}${th('score', 'Score')}<th>Contato</th><th>Site</th>${th('valor_estimado', 'Valor')}<th>Próxima ação</th>${th('atualizado_em', 'Mexido')}</tr></thead>
      <tbody>${lst.map((e) => { const s = achaEstagio(e.estagio); return `<tr class="linha-clicavel" data-id="${e.id}">
        <td><div class="nm">${esc(e.nome)}</div><div class="sb">${esc([e.categoria, e.bairro || e.cidade].filter(Boolean).join(' · '))}</div></td>
        <td><span class="selo" style="color:${s.cor};border-color:${s.cor}55"><span class="ponto" style="background:${s.cor}"></span>${esc(s.nome)}</span></td>
        <td><span class="score sm ${e.prioridade}">${e.score}</span></td>
        <td class="nowrap">${e.whatsapp ? esc(telefoneBonito(e.whatsapp)) : e.instagram ? `@${esc(e.instagram)}` : '<span class="fraco">—</span>'}</td>
        <td>${seloSite(e.site_status)}</td><td class="num">${e.valor_estimado ? brl(e.valor_estimado) : '<span class="fraco">—</span>'}</td>
        <td><div class="clamp-2" style="max-width:280px">${esc(e.proxima_acao || '')}</div></td><td class="dim nowrap">${relativo(e.atualizado_em)}</td></tr>`; }).join('') || `<tr><td colspan="8">${vazio('filtro', 'Nenhuma empresa neste filtro')}</td></tr>`}</tbody></table></div></div>`;
    $$('[data-ord]', area).forEach((t) => (t.onclick = () => { ordenar = { campo: t.dataset.ord, dir: ordenar.campo === t.dataset.ord ? -ordenar.dir : -1 }; desenharLista(); }));
  }

  function desenhar() { desenharKpis(); if (modo === 'kanban') desenharKanban(); else desenharLista(); }

  function ligarArrasto() {
    let arrastando = null;
    $$('.cartao', area).forEach((c) => {
      c.addEventListener('dragstart', (ev) => { arrastando = c.dataset.id; c.classList.add('arrastando'); ev.dataTransfer.effectAllowed = 'move'; ev.dataTransfer.setData('text/plain', c.dataset.id); });
      c.addEventListener('dragend', () => { c.classList.remove('arrastando'); $$('.coluna', area).forEach((x) => x.classList.remove('sobre')); });
    });
    $$('[data-drop]', area).forEach((zona) => {
      const col = zona.closest('.coluna');
      zona.addEventListener('dragover', (ev) => { ev.preventDefault(); col.classList.add('sobre'); });
      zona.addEventListener('dragleave', (ev) => { if (!col.contains(ev.relatedTarget)) col.classList.remove('sobre'); });
      zona.addEventListener('drop', async (ev) => {
        ev.preventDefault(); col.classList.remove('sobre');
        const id = ev.dataTransfer.getData('text/plain') || arrastando;
        const emp = estado.empresas.find((e) => e.id === id);
        if (!emp || emp.estagio === zona.dataset.drop) return;
        const destino = zona.dataset.drop;
        const anterior = emp.estagio;
        emp.estagio = destino; desenhar();
        try { await moverEstagio({ ...emp, estagio: anterior }, destino); }
        catch { emp.estagio = anterior; desenhar(); }
      });
    });
  }

  area.addEventListener('click', (ev) => {
    if (ev.target.closest('[data-parar]') && !ev.target.closest('[data-agendar]')) return;
    const ag = ev.target.closest('[data-agendar]');
    if (ag) { ev.stopPropagation(); agendar({ empresa_id: ag.dataset.agendar, tipo: 'r1' }); return; }
    const add = ev.target.closest('[data-add]');
    if (add) { novoLead({ estagio: add.dataset.add }); return; }
    const card = ev.target.closest('[data-id]');
    if (card) abrirFicha(card.dataset.id);
  });
  area.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' && ev.target.classList.contains('cartao')) abrirFicha(ev.target.dataset.id); });

  $('[data-novo]', v).onclick = () => novoLead();
  const inpBusca = $('[data-busca]', v);
  inpBusca.oninput = debounce(() => { busca = inpBusca.value; desenhar(); }, 200);
  $('[data-filtros]', v).onclick = (ev) => { const b = ev.target.closest('[data-f]'); if (!b) return; filtro = b.dataset.f; $$('[data-f]', v).forEach((x) => x.classList.toggle('on', x === b)); gravarPref({ ...lerPref(), filtro }); desenhar(); };
  $('[data-fechados]', v).onchange = (ev) => { mostrarFechados = ev.target.checked; gravarPref({ ...lerPref(), fechados: mostrarFechados }); desenhar(); };
  $$('[data-modo]', v).forEach((b) => (b.onclick = () => { modo = b.dataset.modo; $$('[data-modo]', v).forEach((x) => x.classList.toggle('on', x === b)); gravarPref({ ...lerPref(), modo }); desenhar(); }));
  $('[data-csv]', v).onclick = () => baixarArquivo('esteira-hound-dog.csv', paraCSV(visiveis(), [
    { campo: 'nome' }, { rotulo: 'estagio', valor: (e) => achaEstagio(e.estagio).nome }, { campo: 'categoria' }, { campo: 'bairro' }, { campo: 'cidade' }, { campo: 'decisor' },
    { campo: 'whatsapp' }, { campo: 'instagram' }, { campo: 'site' }, { campo: 'site_status' }, { campo: 'score' }, { campo: 'valor_estimado' }, { campo: 'proxima_acao' }, { campo: 'origem' },
  ]));

  async function carregarAtencao() {
    if (!v.isConnected) return;
    const { data } = await sb.from('vw_atencao').select('id');
    atencaoIds = new Set((data || []).map((x) => x.id));
  }
  await carregarAtencao();
  desenhar();

  const redesenhar = debounce(async () => { await carregarAtencao(); desenhar(); }, 400);
  const tiras = [ouvir('empresas', redesenhar), ouvir('atividades', debounce(async () => { await carregarAtencao(); desenharKpis(); }, 1500))];
  return () => tiras.forEach((f) => f());
}
