/* =============================================================================
   HOUND DOG — Relatórios: dinheiro, funil, ritmo de prospecção, origem e nichos
   Número de rede é referência, não meta (doutrina _conhecimento/network).
   ============================================================================= */
import { sb, estado, estagio as achaEstagio } from '../sb.js';
import { $, $$, esc, brl, num, vazio, esqueleto, kpi, baixarArquivo, paraCSV } from '../ui.js';
import { icone } from '../icones.js';
import { PROB_ESTAGIO } from '../copiloto.js';

export default async function relatorios(v) {
  let periodo = 30;
  v.innerHTML = `
    <div class="cab"><div class="tt"><h1>O dinheiro e o ritmo da operação</h1><p>Do lead ao contrato: quanto entrou, quanto falta, onde o funil trava.</p></div>
      <div class="acoes"><div class="segmento" data-periodo>${[[7, '7 dias'], [30, '30 dias'], [90, '90 dias'], [3650, 'Tudo']].map(([d, r]) => `<button data-d="${d}" class="${d === periodo ? 'on' : ''}">${r}</button>`).join('')}</div>
        <button class="btn" data-csv>${icone('download')}Exportar</button></div></div>
    <div data-corpo>${esqueleto(10, 30)}</div>`;

  async function carregar() {
    if (!v.isConnected) return;
    const desde = new Date(Date.now() - periodo * 86400000).toISOString();
    const [fin, negs, ativ, agenda] = await Promise.all([
      sb.from('financeiro').select('*'),
      sb.from('negocios').select('*'),
      sb.from('atividades').select('tipo,titulo,dados,empresa_id,criado_em,autor').gte('criado_em', desde).order('criado_em').limit(5000),
      sb.from('agenda').select('tipo,status,inicio').gte('inicio', desde),
    ]);
    const corpo = $('[data-corpo]', v);
    if (fin.error || negs.error || ativ.error) { corpo.innerHTML = vazio('alerta', 'Não carregou', (fin.error || negs.error || ativ.error).message); return; }
    const F = fin.data || [], N = negs.data || [], A = ativ.data || [], G = agenda.data || [];
    const emps = estado.empresas.filter((e) => !e.arquivado);

    const recebido = F.filter((f) => f.status === 'recebido').reduce((a, f) => a + Number(f.valor), 0);
    const aReceber = F.filter((f) => f.status === 'a_receber').reduce((a, f) => a + Number(f.valor), 0);
    const previsto = F.filter((f) => f.status === 'previsto').reduce((a, f) => a + Number(f.valor), 0);
    const fechado = N.filter((n) => n.status === 'ganho').reduce((a, n) => a + (Number(n.valor) || 0), 0);
    const recorrente = N.filter((n) => n.status === 'ganho').reduce((a, n) => a + (Number(n.recorrencia_mensal) || 0), 0);
    const ponderado = emps.filter((e) => ['lead', 'cliente'].includes(e.relacao)).reduce((a, e) => a + (Number(e.valor_estimado) || 0) * (PROB_ESTAGIO[e.estagio] || 0) / 100, 0);
    const ganhos = N.filter((n) => n.status === 'ganho' && Number(n.valor) > 0);
    const ticket = ganhos.length ? ganhos.reduce((a, n) => a + Number(n.valor), 0) / ganhos.length : null;

    // Funil: quantas empresas passaram por cada estágio no período (entradas registradas + estágio atual)
    const ordem = estado.estagios.filter((s) => s.funil === 'prospeccao' && !['followup', 'perdido'].includes(s.id)).sort((a, b) => a.ordem - b.ordem);
    const alcancou = Object.fromEntries(ordem.map((s) => [s.id, new Set()]));
    for (const e of emps.filter((x) => ['lead', 'cliente'].includes(x.relacao))) {
      const atual = achaEstagio(e.estagio);
      for (const s of ordem) if (s.ordem <= atual.ordem && !['followup', 'perdido'].includes(e.estagio)) alcancou[s.id].add(e.id);
    }
    for (const a of A.filter((x) => x.tipo === 'estagio')) {
      const para = achaEstagio(a.dados?.para);
      for (const s of ordem) if (s.ordem <= para.ordem && a.empresa_id) alcancou[s.id].add(a.empresa_id);
    }
    const maxF = Math.max(1, ...ordem.map((s) => alcancou[s.id].size));

    // Ritmo semanal
    const semanas = {};
    const chaveSemana = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x.toISOString().slice(0, 10); };
    for (const a of A) {
      const k = chaveSemana(a.criado_em); const s = (semanas[k] ||= { abordagens: 0, reunioes: 0, respostas: 0 });
      if (['mensagem', 'ligacao', 'visita'].includes(a.tipo)) s.abordagens++;
      if (a.tipo === 'whatsapp') s.respostas++;
    }
    for (const g of G.filter((x) => ['r1', 'r2', 'visita'].includes(x.tipo) && x.status !== 'cancelado')) { const k = chaveSemana(g.inicio); (semanas[k] ||= { abordagens: 0, reunioes: 0, respostas: 0 }).reunioes++; }
    const semLista = Object.entries(semanas).sort().slice(-12);
    const meta = estado.config.metas?.abordagens_semana || 5;
    const maxS = Math.max(meta, 1, ...semLista.map(([, s]) => s.abordagens));

    // Origem e nicho
    const agrupa = (campo) => {
      const g = {};
      for (const e of emps.filter((x) => ['lead', 'cliente'].includes(x.relacao))) {
        const k = (e[campo] || 'não informado').toString();
        const o = (g[k] ||= { total: 0, ganhos: 0, avancados: 0 });
        o.total++; if (e.estagio === 'ganho') o.ganhos++; if (['conversando', 'reuniao', 'proposta', 'negociacao', 'ganho'].includes(e.estagio)) o.avancados++;
      }
      return Object.entries(g).sort((a, b) => b[1].total - a[1].total).slice(0, 8);
    };
    const origens = agrupa('origem'), nichos = agrupa('categoria');

    corpo.innerHTML = `
      <div class="kpis">
        ${kpi({ icone: 'estrela', rotulo: 'Fechado', valor: brl(fechado), sub: `${ganhos.length} negócio${ganhos.length === 1 ? '' : 's'} ganho${ganhos.length === 1 ? '' : 's'} com valor`, cor: 'verde' })}
        ${kpi({ icone: 'checkc', rotulo: 'Recebido', valor: brl(recebido), sub: 'caiu na conta', cor: 'verde' })}
        ${kpi({ icone: 'relogio', rotulo: 'A receber', valor: brl(aReceber), sub: `+ ${brl(previsto)} previsto`, cor: 'amarelo' })}
        ${kpi({ icone: 'atualizar', rotulo: 'Recorrente', valor: `${brl(recorrente)}<span class="kpi-meta">/mês</span>`, sub: 'mensalidades ganhas', cor: 'violeta' })}
        ${kpi({ icone: 'tendencia', rotulo: 'Pipeline ponderado', valor: brl(ponderado), sub: 'valor estimado × chance do estágio' })}
        ${kpi({ icone: 'dinheiro', rotulo: 'Ticket médio', valor: ticket ? brl(ticket) : '—', sub: 'dos negócios ganhos', cor: 'azul' })}
      </div>
      <div class="rel-grade">
        <section class="card"><div class="card-cab"><div class="icone-caixa sm violeta">${icone('esteira')}</div><div class="grow"><h3>Funil de conversão</h3><p class="dim" style="font-size:12.5px">Quantas empresas chegaram a cada etapa.</p></div></div>
          <div class="funil-rel">${ordem.map((s, i) => { const n = alcancou[s.id].size; const ant = i ? alcancou[ordem[i - 1].id].size : null; const taxa = ant ? Math.round((n / ant) * 100) : null;
            return `<div class="fr-linha"><span class="fr-nome">${esc(s.nome)}</span><span class="fr-barra"><i style="width:${(n / maxF) * 100}%;background:${s.cor}"></i></span><b class="num">${n}</b><small class="dim fr-taxa">${taxa != null ? `${taxa}%` : ''}</small></div>`; }).join('')}</div>
          <p class="dim mt-12" style="font-size:12.5px">Referência do network no modelo personalizado: resposta 30 a 45%, R1 10 a 20% dos abordados, fechamento em reunião ~33%. Referência, não meta.</p></section>
        <section class="card"><div class="card-cab"><div class="icone-caixa sm azul">${icone('enviar')}</div><div class="grow"><h3>Ritmo por semana</h3><p class="dim" style="font-size:12.5px">Abordagens registradas vs meta de ${meta}/semana.</p></div></div>
          ${semLista.length ? `<div class="barras">${semLista.map(([k, s]) => `<div class="barra-col" title="Semana de ${new Date(k + 'T12:00').toLocaleDateString('pt-BR')}: ${s.abordagens} abordagens, ${s.reunioes} reuniões"><div class="barra-pilha"><i class="b-abord" style="height:${(s.abordagens / maxS) * 100}%"></i><i class="b-reun" style="height:${(s.reunioes / maxS) * 100}%"></i></div><small>${new Date(k + 'T12:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</small></div>`).join('')}<div class="linha-meta" style="bottom:calc(${(meta / maxS) * 100}% * 0.82 + 22px)"><span>meta ${meta}</span></div></div>
            <div class="legenda mt-12"><span><i style="background:var(--blue)"></i>Abordagens</span><span><i style="background:var(--accent)"></i>Reuniões</span></div>` : vazio('enviar', 'Sem abordagens registradas no período', 'Registre na ficha ("Registrar que enviei") ou pela linha do tempo.')}</section>
        <section class="card"><div class="card-cab"><div class="icone-caixa sm">${icone('radar')}</div><h3>De onde vêm os leads</h3></div>${tabelaGrupo(origens)}</section>
        <section class="card"><div class="card-cab"><div class="icone-caixa sm verde">${icone('predio')}</div><h3>Por nicho</h3></div>${tabelaGrupo(nichos)}</section>
      </div>`;

    $('[data-csv]', v).onclick = () => baixarArquivo(`hound-dog-empresas-${new Date().toISOString().slice(0, 10)}.csv`, paraCSV(emps, [
      { campo: 'nome' }, { campo: 'relacao' }, { rotulo: 'estagio', valor: (e) => achaEstagio(e.estagio).nome }, { campo: 'categoria' }, { campo: 'cidade' }, { campo: 'bairro' },
      { campo: 'decisor' }, { campo: 'whatsapp' }, { campo: 'instagram' }, { campo: 'site' }, { campo: 'site_status' }, { campo: 'score' }, { campo: 'prioridade' },
      { campo: 'valor_estimado' }, { campo: 'origem' }, { campo: 'origem_detalhe' }, { campo: 'proxima_acao' }, { campo: 'criado_em' },
    ]));
  }

  function tabelaGrupo(linhas) {
    if (!linhas.length) return vazio('lista', 'Sem dados ainda');
    return `<div class="tabela-wrap"><table class="tabela"><thead><tr><th>Grupo</th><th>Leads</th><th>Avançaram</th><th>Ganhos</th></tr></thead><tbody>${linhas.map(([k, o]) => `<tr><td class="nm">${esc(k)}</td><td class="num">${o.total}</td><td class="num">${o.avancados} <small class="dim">(${Math.round((o.avancados / o.total) * 100)}%)</small></td><td class="num">${o.ganhos}</td></tr>`).join('')}</tbody></table></div>`;
  }

  $('[data-periodo]', v).onclick = (e) => { const b = e.target.closest('[data-d]'); if (!b) return; periodo = Number(b.dataset.d); $$('[data-d]', v).forEach((x) => x.classList.toggle('on', x === b)); carregar(); };
  await carregar();
}
