/* =============================================================================
   HOUNDER — Tarefas: o plano de negócio da Hórus e as pendências da casa,
   com prazo, prioridade, responsável e check. Pedido do Marcelo (27/09/2026).
   O plano (`_gestao/plano-de-negocio.md`) diz para onde e por quê; aqui fica o
   quê, quem e quando. O Antônio não é operador do painel: o Marcelo marca por ele.
   ============================================================================= */
import { sb, estado, ouvir, quem } from '../sb.js';
import { $, $$, esc, toast, modal, confirmar, erroAmigavel, botaoCarregando, vazio, esqueleto, debounce, kpi } from '../ui.js';
import { icone } from '../icones.js';

export const AREAS = [['plano', 'Plano'], ['comercial', 'Comercial'], ['cliente', 'Cliente'], ['producao', 'Produção'], ['marketing', 'Marketing da Hórus'],
  ['financeiro', 'Financeiro'], ['admin', 'Administrativo'], ['seguranca', 'Segurança'], ['ferramentas', 'Ferramentas'], ['geral', 'Geral']];
export const MARCOS = [['m1', '90 dias · até 26/12/2026'], ['m2', '6 meses · até 03/2027'], ['m3', '12 meses · até 09/2027'], ['m4', '24 meses · até 09/2028']];
const PRIO = { alta: ['vermelho', 'Alta'], media: ['amarelo', 'Média'], baixa: ['cinza', 'Baixa'] };
const STATUS = [['a_fazer', 'A fazer'], ['fazendo', 'Fazendo'], ['travada', 'Travada'], ['feita', 'Feita'], ['cancelada', 'Cancelada']];
const ABERTAS = ['a_fazer', 'fazendo', 'travada'];
const nomeArea = (a) => (AREAS.find((x) => x[0] === a) || [, a])[1];
const opcoes = (lista, atual) => lista.map(([v, r]) => `<option value="${v}"${v === atual ? ' selected' : ''}>${esc(r)}</option>`).join('');

/** Data de hoje no fuso da Bahia, AAAA-MM-DD (prazo é data, sem hora). */
export const hojeBahia = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bahia' });
const somaDias = (iso, n) => { const d = new Date(`${iso}T12:00:00`); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
function prazoTxt(p) {
  if (!p) return 'sem prazo';
  const h = hojeBahia();
  const dias = Math.round((new Date(`${p}T12:00:00`) - new Date(`${h}T12:00:00`)) / 86400000);
  const dm = new Date(`${p}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  if (dias === 0) return 'hoje';
  if (dias === 1) return 'amanhã';
  if (dias === -1) return 'era ontem';
  if (dias < 0) return `atrasada ${-dias} dias · ${dm}`;
  if (dias < 7) return `${new Date(`${p}T12:00:00`).toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')} · ${dm}`;
  return dm;
}

/** Linha de tarefa (também usada no Início). */
export function linhaTarefa(t, todas = []) {
  const feita = t.status === 'feita', cancelada = t.status === 'cancelada';
  const atrasada = !feita && !cancelada && t.prazo && t.prazo < hojeBahia();
  const bloqueio = (t.depende_de || []).map((id) => todas.find((x) => x.id === id)).filter((x) => x && ABERTAS.includes(x.status));
  const emp = t.empresa_id ? estado.empresas.find((e) => e.id === t.empresa_id) : null;
  const [pc, pr] = PRIO[t.prioridade] || PRIO.media;
  return `<div class="tarefa ${feita ? 'feita' : ''} ${cancelada ? 'cancelada' : ''}" data-tarefa="${t.id}">
    <label class="tarefa-check" title="${feita ? 'Reabrir' : 'Marcar como feita'}"><input type="checkbox" data-check ${feita ? 'checked' : ''} ${cancelada ? 'disabled' : ''} aria-label="Concluir: ${esc(t.titulo)}"></label>
    <button class="tarefa-corpo" data-abrir>
      <span class="tarefa-tit">${esc(t.titulo)}</span>
      <span class="tarefa-meta">
        <span class="${atrasada ? 'atrasada' : ''}">${icone('relogio')}${feita && t.concluida_em ? `feita ${new Date(t.concluida_em).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}` : esc(prazoTxt(t.prazo))}</span>
        ${t.responsavel && !/marcelo/i.test(t.responsavel) ? `<span>${icone('clientes')}${esc(t.responsavel)}</span>` : ''}
        <span>${esc(nomeArea(t.area))}</span>
        ${emp ? `<span>${icone('predio')}${esc(emp.nome)}</span>` : ''}
        ${t.status === 'travada' ? `<span class="travada">${icone('cadeado')}travada${t.motivo_trava ? `: ${esc(t.motivo_trava)}` : ''}</span>` : ''}
        ${bloqueio.length && !feita ? `<span class="travada">${icone('cadeado')}espera: ${esc(bloqueio.map((b) => b.titulo).join(', '))}</span>` : ''}
      </span>
    </button>
    ${!feita && !cancelada ? `<span class="selo ${pc}">${pr}</span>` : ''}
    ${t.status === 'fazendo' ? '<span class="selo azul">Fazendo</span>' : ''}
  </div>`;
}

/** Marca/desmarca o check (com desfazer). */
export async function alternarFeita(t, feita) {
  const { error } = await sb.from('tarefas').update({ status: feita ? 'feita' : 'a_fazer' }).eq('id', t.id);
  if (error) { toast(erroAmigavel(error), 'erro'); return false; }
  if (feita) {
    toast(`Feita: ${t.titulo}`, 'ok', { ms: 6000, acao: { rotulo: 'Desfazer', fn: () => sb.from('tarefas').update({ status: t.status }).eq('id', t.id).then(() => {}) } });
    if (t.empresa_id) sb.from('atividades').insert({ empresa_id: t.empresa_id, tipo: 'nota', titulo: `Tarefa concluída: ${t.titulo}`, autor: quem() }).then(() => {});
  }
  return true;
}

/** Cria ou edita uma tarefa (modal). */
export async function editarTarefa(existente = null, prefill = {}) {
  const base = existente || { prioridade: 'media', status: 'a_fazer', responsavel: 'Marcelo', area: 'geral', ...prefill };
  const { data: abertas } = await sb.from('tarefas').select('id, titulo, status').in('status', ABERTAS).order('prazo', { nullsFirst: false });
  const outras = (abertas || []).filter((x) => x.id !== existente?.id);
  const deps = new Set(base.depende_de || []);
  const empresas = estado.empresas.filter((e) => !e.arquivado).sort((a, b) => a.nome.localeCompare(b.nome));
  const resp = ['Marcelo', 'Antônio'];
  if (base.responsavel && !resp.includes(base.responsavel)) resp.push(base.responsavel);
  const m = modal({
    titulo: existente ? 'Tarefa' : 'Nova tarefa', icone: 'checkc', largo: true,
    corpo: `<form novalidate>
      <div class="campo"><label>O que fazer *</label><input class="inp" name="titulo" required value="${esc(base.titulo || '')}" placeholder="Comece com o verbo: Abrir o CNPJ, Pedir avaliação à Amparo…"></div>
      <div class="grade-2">
        <div class="campo"><label>Prazo</label><input class="inp" type="date" name="prazo" value="${esc(base.prazo || '')}"></div>
        <div class="campo"><label>Prioridade</label><select class="sel" name="prioridade">${opcoes([['alta', 'Alta'], ['media', 'Média'], ['baixa', 'Baixa']], base.prioridade)}</select></div>
        <div class="campo"><label>Responsável</label><select class="sel" name="responsavel">${opcoes(resp.map((r) => [r, r]), base.responsavel)}</select></div>
        <div class="campo"><label>Situação</label><select class="sel" name="status">${opcoes(STATUS, base.status)}</select></div>
        <div class="campo"><label>Área</label><select class="sel" name="area">${opcoes(AREAS, base.area)}</select></div>
        <div class="campo"><label>Marco do plano</label><select class="sel" name="marco"><option value="">Nenhum</option>${opcoes(MARCOS, base.marco || '')}</select></div>
      </div>
      <div class="campo"><label>Pronto quando</label><input class="inp" name="pronto_quando" value="${esc(base.pronto_quando || '')}" placeholder="Como se sabe que acabou"></div>
      <div class="campo"><label>Detalhes</label><textarea class="txt" name="descricao" rows="3" placeholder="Passos, links, contexto">${esc(base.descricao || '')}</textarea></div>
      <div class="grade-2">
        <div class="campo"><label>Objetivo do plano</label><input class="inp" name="objetivo" value="${esc(base.objetivo || '')}" placeholder="Ex.: O1 Caixa"></div>
        <div class="campo"><label>Empresa (opcional)</label><select class="sel" name="empresa_id"><option value="">Nenhuma</option>${empresas.map((e) => `<option value="${e.id}"${e.id === base.empresa_id ? ' selected' : ''}>${esc(e.nome)}</option>`).join('')}</select></div>
      </div>
      <div class="campo"><label>Travada por quê</label><input class="inp" name="motivo_trava" value="${esc(base.motivo_trava || '')}" placeholder="Só se a situação for Travada"></div>
      ${outras.length ? `<details class="dobra mt-8"${deps.size ? ' open' : ''}><summary><span class="rotulo">Depende de ${deps.size ? `(${deps.size})` : ''}</span></summary>
        <div class="col gap-6 mt-8 dep-lista">${outras.map((o) => `<label class="check"><input type="checkbox" name="dep" value="${o.id}"${deps.has(o.id) ? ' checked' : ''}> ${esc(o.titulo)}</label>`).join('')}</div></details>` : ''}
      ${existente?.status === 'feita' || existente?.concluida_obs ? `<div class="campo mt-8"><label>O que foi feito</label><input class="inp" name="concluida_obs" value="${esc(existente.concluida_obs || '')}"></div>` : ''}
    </form>`,
    pe: `${existente ? `<button class="btn perigo" data-excluir>${icone('lixo')}Excluir</button><span class="grow"></span>` : ''}<button class="btn" data-fechar>Cancelar</button><button class="btn prim" data-salvar>${icone('check')}Salvar</button>`,
  });
  $$('[data-fechar]', m.el).forEach((b) => (b.onclick = () => m.fechar()));
  const form = $('form', m.el);
  $('[data-salvar]', m.el).onclick = async (ev) => {
    const f = new FormData(form);
    const titulo = String(f.get('titulo') || '').trim();
    if (!titulo) { toast('Escreva o que fazer', 'erro'); return; }
    const linha = {
      titulo, prazo: f.get('prazo') || null, prioridade: f.get('prioridade'), responsavel: f.get('responsavel'), status: f.get('status'),
      area: f.get('area'), marco: f.get('marco') || null, pronto_quando: String(f.get('pronto_quando') || '').trim() || null,
      descricao: String(f.get('descricao') || '').trim() || null, objetivo: String(f.get('objetivo') || '').trim() || null,
      empresa_id: f.get('empresa_id') || null, motivo_trava: String(f.get('motivo_trava') || '').trim() || null, depende_de: f.getAll('dep'),
    };
    if (f.has('concluida_obs')) linha.concluida_obs = String(f.get('concluida_obs') || '').trim() || null;
    botaoCarregando(ev.currentTarget, true, 'Salvando…');
    const r = existente ? await sb.from('tarefas').update(linha).eq('id', existente.id) : await sb.from('tarefas').insert({ ...linha, criado_por: quem() });
    botaoCarregando(ev.currentTarget, false);
    if (r.error) { toast(erroAmigavel(r.error), 'erro'); return; }
    toast(existente ? 'Tarefa salva' : 'Tarefa criada');
    m.fechar(true);
  };
  const ex = $('[data-excluir]', m.el);
  if (ex) ex.onclick = async () => {
    if (!(await confirmar('Excluir a tarefa?', 'Some da lista e do histórico. Para guardar o registro, use a situação Cancelada.', { rotulo: 'Excluir', perigo: true }))) return;
    const { error } = await sb.from('tarefas').delete().eq('id', existente.id);
    if (error) toast(erroAmigavel(error), 'erro'); else { toast('Excluída'); m.fechar(true); }
  };
}

export default async function tarefas(v, { params }) {
  let modo = params.modo || 'agora';
  let resp = 'todos';
  let lista = [];

  v.innerHTML = `
    <div class="cab"><div class="tt"><h1>Tarefas</h1><p>O plano de negócio da Hórus e as pendências da casa. Prazo, prioridade, quem faz e o check.</p></div>
      <div class="acoes"><button class="btn prim" data-nova>${icone('mais')}Nova tarefa</button></div></div>
    <div class="kpis" data-kpis>${esqueleto(1, 60)}</div>
    <div class="row wrap gap-14 mt-16 mb-16">
      <div class="segmento" data-modos>${[['agora', 'Agora'], ['marcos', 'Por marco'], ['feitas', 'Feitas']].map(([k, r]) => `<button data-modo="${k}" class="${k === modo ? 'on' : ''}">${r}</button>`).join('')}</div>
      <span class="grow"></span>
      <div class="chips" data-resp>${[['todos', 'Todos'], ['marcelo', 'Marcelo'], ['antonio', 'Antônio']].map(([k, r]) => `<button class="chip ${k === resp ? 'on' : ''}" data-r="${k}">${r}</button>`).join('')}</div>
    </div>
    <div data-corpo>${esqueleto(8, 26)}</div>`;

  async function carregar() {
    if (!v.isConnected) return;
    const { data, error } = await sb.from('tarefas').select('*').order('prazo', { ascending: true, nullsFirst: false }).order('ordem').limit(1000);
    if (error) { $('[data-corpo]', v).innerHTML = vazio('alerta', 'Não carregou', erroAmigavel(error)); return; }
    lista = data || [];
    desenhar();
  }

  const doResp = (t) => resp === 'todos' || (resp === 'antonio' ? /ant[oô]nio/i.test(t.responsavel || '') : /marcelo/i.test(t.responsavel || ''));
  const ordemPrio = (a, b) => ['alta', 'media', 'baixa'].indexOf(a.prioridade) - ['alta', 'media', 'baixa'].indexOf(b.prioridade);
  const porPrazo = (a, b) => (a.prazo || '9999') < (b.prazo || '9999') ? -1 : (a.prazo || '9999') > (b.prazo || '9999') ? 1 : ordemPrio(a, b) || a.ordem - b.ordem;
  const bloco = (titulo, itens, extra = '') => itens.length ? `<h2 class="secao-tit mt-24">${titulo} <span class="dim">· ${itens.length}</span></h2>${extra}<div class="card pad-0 mt-12 tarefas-lista">${itens.map((t) => linhaTarefa(t, lista)).join('')}</div>` : '';

  function desenhar() {
    const h = hojeBahia(), semana = somaDias(h, 7);
    const abertas = lista.filter((t) => ABERTAS.includes(t.status));
    const feitas7 = lista.filter((t) => t.status === 'feita' && t.concluida_em && new Date(t.concluida_em) > new Date(Date.now() - 7 * 86400000)).length;
    const m1 = lista.filter((t) => t.marco === 'm1' && t.status !== 'cancelada');
    const m1f = m1.filter((t) => t.status === 'feita').length;
    const atr = abertas.filter((t) => t.prazo && t.prazo < h).length;
    $('[data-kpis]', v).innerHTML = [
      kpi({ icone: 'alerta', rotulo: 'Atrasadas', valor: atr, sub: atr ? 'resolver ou mudar o prazo' : 'nada atrasado', cor: atr ? 'vermelho' : 'verde' }),
      kpi({ icone: 'relogio', rotulo: 'Para hoje', valor: abertas.filter((t) => t.prazo === h).length, sub: `${abertas.filter((t) => t.prazo > h && t.prazo <= semana).length} nos próximos 7 dias`, cor: 'amarelo' }),
      kpi({ icone: 'checkc', rotulo: 'Feitas em 7 dias', valor: feitas7, sub: 'o que andou', cor: 'verde' }),
      kpi({ icone: 'alvo', rotulo: 'Marco de 90 dias', valor: `${m1f}<span class="kpi-meta">/${m1.length}</span>`, sub: m1.length ? `${Math.round((m1f / m1.length) * 100)}% concluído · até 26/12` : 'sem tarefas no marco', cor: 'violeta' }),
    ].join('');

    const corpo = $('[data-corpo]', v);
    const vis = lista.filter(doResp);
    if (modo === 'agora') {
      const ab = vis.filter((t) => ABERTAS.includes(t.status)).sort(porPrazo);
      const grupos = [
        ['Atrasadas', ab.filter((t) => t.prazo && t.prazo < h)],
        ['Hoje', ab.filter((t) => t.prazo === h)],
        ['Próximos 7 dias', ab.filter((t) => t.prazo > h && t.prazo <= semana)],
        ['Depois', ab.filter((t) => t.prazo > semana)],
        ['Sem prazo', ab.filter((t) => !t.prazo)],
      ];
      corpo.innerHTML = ab.length ? grupos.map(([tt, it]) => bloco(tt, it)).join('')
        : `<div class="card">${vazio('checkc', 'Nenhuma tarefa aberta', 'Crie uma aqui ou peça ao Claude: "coloca no Hounder".', `<button class="btn sm prim" data-nova>${icone('mais')}Nova tarefa</button>`)}</div>`;
    } else if (modo === 'marcos') {
      corpo.innerHTML = [...MARCOS, ['', 'Fora do plano (pendências gerais)']].map(([mk, rot]) => {
        const it = vis.filter((t) => (t.marco || '') === mk && t.status !== 'cancelada').sort((a, b) => (a.status === 'feita') - (b.status === 'feita') || porPrazo(a, b));
        if (!it.length) return '';
        const f = it.filter((t) => t.status === 'feita').length;
        const barra = `<div class="row gap-12 mt-8"><span class="funil-barra grow"><i style="width:${(f / it.length) * 100}%;background:var(--violet)"></i></span><b class="num">${f}/${it.length}</b></div>`;
        return bloco(mk ? `Marco ${mk.slice(1)} · ${rot}` : rot, it, barra);
      }).join('') || `<div class="card">${vazio('alvo', 'Nenhuma tarefa ainda')}</div>`;
    } else {
      const fe = vis.filter((t) => t.status === 'feita').sort((a, b) => new Date(b.concluida_em) - new Date(a.concluida_em));
      const ca = vis.filter((t) => t.status === 'cancelada');
      corpo.innerHTML = (bloco('Feitas', fe) + bloco('Canceladas', ca)) || `<div class="card">${vazio('checkc', 'Nada concluído ainda', 'O que você marcar aparece aqui, com a data.')}</div>`;
    }
  }

  v.addEventListener('click', async (ev) => {
    if (ev.target.closest('[data-nova]')) { editarTarefa(); return; }
    const md = ev.target.closest('[data-modo]');
    if (md) { modo = md.dataset.modo; $$('[data-modo]', v).forEach((b) => b.classList.toggle('on', b === md)); desenhar(); return; }
    const r = ev.target.closest('[data-r]');
    if (r) { resp = r.dataset.r; $$('[data-r]', v).forEach((b) => b.classList.toggle('on', b === r)); desenhar(); return; }
    const linha = ev.target.closest('[data-tarefa]'); if (!linha) return;
    const t = lista.find((x) => x.id === linha.dataset.tarefa); if (!t) return;
    if (ev.target.closest('[data-abrir]')) editarTarefa(t);
  });
  v.addEventListener('change', async (ev) => {
    const c = ev.target.closest('[data-check]'); if (!c) return;
    const t = lista.find((x) => x.id === c.closest('[data-tarefa]').dataset.tarefa);
    if (t && !(await alternarFeita(t, c.checked))) c.checked = !c.checked;
  });

  await carregar();
  const tiras = [ouvir('tarefas', debounce(carregar, 300)), ouvir('empresas', debounce(desenhar, 800))];
  return () => tiras.forEach((f) => f());
}
