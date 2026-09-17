/* =============================================================================
   HOUND DOG — Clientes: a carteira que a Hórus toca (fases, entrega, dinheiro, travas)
   ============================================================================= */
import { sb, estado, ouvir } from '../sb.js';
import { $, $$, esc, brl, relativo, vazio, esqueleto, debounce, kpi, iniciais, copiar } from '../ui.js';
import { icone, sparkClaude } from '../icones.js';
import { abrirFicha, seloEstagio } from '../ficha.js';

const PASSOS = ['onboarding', 'producao', 'revisao', 'entregue'];
const NOME_PASSO = { onboarding: 'Onboarding', producao: 'Produção', revisao: 'Revisão', entregue: 'Entregue' };

export default async function clientes(v) {
  let filtro = 'ativos';
  v.innerHTML = `
    <div class="cab"><div class="tt"><h1>Clientes</h1><p>A carteira que a Hórus toca: fase, entrega, dinheiro e as travas de cada um.</p></div></div>
    <div class="kpis" data-kpis></div>
    <div class="chips mb-16" data-filtros>${[['ativos', 'Carteira ativa'], ['internos', 'Contas internas'], ['negociando', 'Fechando'], ['ex', 'Ex-clientes'], ['todos', 'Todos']].map(([k, r]) => `<button class="chip ${k === filtro ? 'on' : ''}" data-f="${k}">${r}</button>`).join('')}</div>
    <div class="cli-grade" data-grade>${esqueleto(4, 120)}</div>`;

  let negocios = [], financeiro = [], proximos = [];
  async function carregar() {
    if (!v.isConnected) return;
    const [n, f, a] = await Promise.all([
      sb.from('negocios').select('*').order('criado_em'),
      sb.from('financeiro').select('*'),
      sb.from('agenda').select('*').gte('inicio', new Date().toISOString()).eq('status', 'agendado').order('inicio'),
    ]);
    negocios = n.data || []; financeiro = f.data || []; proximos = a.data || [];
    desenhar();
  }

  function carteira() {
    return estado.empresas.filter((e) => {
      if (filtro === 'ativos') return e.relacao === 'cliente' && !e.arquivado;
      if (filtro === 'internos') return e.relacao === 'interno' && !e.arquivado;
      if (filtro === 'negociando') return !e.arquivado && ['proposta', 'negociacao'].includes(e.estagio);
      if (filtro === 'ex') return e.relacao === 'ex_cliente';
      return ['cliente', 'interno', 'ex_cliente'].includes(e.relacao) || ['proposta', 'negociacao'].includes(e.estagio);
    }).sort((a, b) => a.nome.localeCompare(b.nome));
  }

  function desenhar() {
    const soma = (st, ids) => financeiro.filter((f) => f.status === st && (!ids || ids.has(f.empresa_id))).reduce((a, f) => a + Number(f.valor), 0);
    const ativos = estado.empresas.filter((e) => e.relacao === 'cliente' && !e.arquivado);
    const recorrente = negocios.filter((n) => n.status === 'ganho' && n.recorrencia_mensal).reduce((a, n) => a + Number(n.recorrencia_mensal), 0);
    const producao = negocios.filter((n) => ['onboarding', 'producao', 'revisao'].includes(n.entrega) && n.status !== 'perdido').length;
    $('[data-kpis]', v).innerHTML = [
      kpi({ icone: 'clientes', rotulo: 'Clientes ativos', valor: ativos.length, sub: `${estado.empresas.filter((e) => e.relacao === 'interno').length} contas internas`, cor: 'verde' }),
      kpi({ icone: 'checkc', rotulo: 'Recebido', valor: brl(soma('recebido')), sub: 'dinheiro que caiu na conta', cor: 'verde' }),
      kpi({ icone: 'relogio', rotulo: 'A receber', valor: brl(soma('a_receber')), sub: 'entradas e saldos pendentes', cor: 'amarelo' }),
      kpi({ icone: 'atualizar', rotulo: 'Recorrente', valor: `${brl(recorrente)}<span class="kpi-meta">/mês</span>`, sub: recorrente ? 'mensalidades ganhas' : 'nenhuma mensalidade ainda', cor: 'violeta' }),
      kpi({ icone: 'maleta', rotulo: 'Em produção', valor: producao, sub: 'onboarding, produção ou revisão', cor: 'azul' }),
    ].join('');

    const lst = carteira();
    $('[data-grade]', v).innerHTML = lst.length ? lst.map((e) => {
      const negs = negocios.filter((n) => n.empresa_id === e.id);
      const ativo = negs.find((n) => n.status !== 'perdido' && n.entrega !== 'entregue') || negs[negs.length - 1];
      const fins = financeiro.filter((f) => f.empresa_id === e.id);
      const rec = fins.filter((f) => f.status === 'recebido').reduce((a, f) => a + Number(f.valor), 0);
      const aRec = fins.filter((f) => f.status === 'a_receber').reduce((a, f) => a + Number(f.valor), 0);
      const prox = proximos.find((p) => p.empresa_id === e.id);
      const idxPasso = ativo ? PASSOS.indexOf(ativo.entrega) : -1;
      return `<article class="cli-card" data-emp="${e.id}" tabindex="0">
        <div class="row" style="align-items:flex-start"><span class="avatar lg">${esc(iniciais(e.nome))}</span><div class="grow" style="min-width:0"><h3 class="ellipsis">${esc(e.nome)}</h3><div class="dim ellipsis" style="font-size:13px">${esc([e.categoria, e.bairro || e.cidade].filter(Boolean).join(' · '))}</div></div>${seloEstagio(e.estagio)}</div>
        <div class="row wrap gap-6 mt-12">${e.relacao === 'interno' ? '<span class="selo violeta">Conta interna</span>' : e.relacao === 'ex_cliente' ? '<span class="selo cinza">Ex-cliente</span>' : ''}${e.regulado ? `<span class="selo vermelho">${icone('escudo')}Compliance ${esc(e.conselho || '')}</span>` : ''}${(e.tags || []).slice(0, 3).map((t) => `<span class="selo">${esc(t)}</span>`).join('')}</div>
        ${ativo ? `<div class="cli-negocio mt-12"><div class="row"><b class="grow ellipsis">${esc(ativo.titulo)}</b><span class="num">${ativo.valor != null ? brl(ativo.valor) : '<span class="dim">valor em aberto</span>'}</span></div>
          <div class="passos-entrega mt-8">${PASSOS.map((p, i) => `<span class="${i <= idxPasso ? 'on' : ''}">${NOME_PASSO[p]}</span>`).join('')}</div>
          ${negs.length > 1 ? `<div class="dim mt-8" style="font-size:12.5px">+ ${negs.length - 1} outro${negs.length > 2 ? 's' : ''} negócio${negs.length > 2 ? 's' : ''}: ${esc(negs.filter((n) => n !== ativo).map((n) => n.titulo.split('—')[0].trim()).join(', '))}</div>` : ''}</div>` : '<div class="dim mt-12" style="font-size:13px">Sem negócio registrado.</div>'}
        <div class="cli-dinheiro mt-12"><span><small>Recebido</small><b class="ok">${brl(rec)}</b></span><span><small>A receber</small><b class="${aRec ? 'amarelo-txt' : ''}">${brl(aRec)}</b></span></div>
        ${e.proxima_acao ? `<div class="cli-acao mt-12">${icone('alvo')}<span class="clamp-2">${esc(e.proxima_acao)}</span></div>` : ''}
        ${prox ? `<div class="dim mt-8" style="font-size:12.5px">${icone('agenda')} ${esc(prox.titulo)} · ${relativo(prox.inicio)}</div>` : ''}
        <div class="row gap-6 mt-12">
          <button class="btn sm" data-abrir="${e.id}">${icone('predio')}Ficha</button>
          <a class="btn sm claude" href="#/claude?empresa=${e.id}" data-parar>${sparkClaude(13)}Claude</a>
          ${e.pasta_repo ? `<button class="btn icone sm fantasma" data-pasta="${esc(e.pasta_repo)}" title="Copiar pasta ${esc(e.pasta_repo)}" aria-label="Copiar caminho da pasta">${icone('pasta')}</button>` : ''}
        </div>
      </article>`;
    }).join('') : vazio('clientes', 'Ninguém neste filtro', filtro === 'ativos' ? 'Quando um negócio vira Ganho na esteira, ele aparece aqui.' : '');
  }

  v.addEventListener('click', (ev) => {
    const f = ev.target.closest('[data-f]');
    if (f) { filtro = f.dataset.f; $$('[data-f]', v).forEach((x) => x.classList.toggle('on', x === f)); desenhar(); return; }
    if (ev.target.closest('[data-parar]')) return;
    const p = ev.target.closest('[data-pasta]'); if (p) { copiar(p.dataset.pasta, 'Caminho da pasta copiado'); return; }
    const c = ev.target.closest('[data-emp]'); if (c) abrirFicha(c.dataset.emp);
  });
  v.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' && ev.target.matches('.cli-card')) abrirFicha(ev.target.dataset.emp); });

  await carregar();
  const rec = debounce(carregar, 800);
  const tiras = ['negocios', 'financeiro', 'agenda'].map((t) => ouvir(t, rec));
  tiras.push(ouvir('empresas', debounce(desenhar, 500)));
  return () => tiras.forEach((t) => t());
}
