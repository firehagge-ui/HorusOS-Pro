/* =============================================================================
   HOUND DOG — Início: o painel do dia
   ============================================================================= */
import { sb, estado, ouvir, farejadorOnline, estagio as achaEstagio } from '../sb.js';
import { $, $$, esc, brl, relativo, dataHora, hora, saudacao, kpi, vazio, esqueleto, debounce, compacto, iniciais } from '../ui.js';
import { icone, sparkClaude } from '../icones.js';
import { abrirFicha } from '../ficha.js';
import { PROB_ESTAGIO } from '../copiloto.js';
import { linhaTarefa, alternarFeita, editarTarefa, hojeBahia } from './tarefas.js';

const MOTIVO = { acao_vencida: ['vermelho', 'Ação vencida'], parado: ['amarelo', 'Parado há +3 dias'], sem_proxima_acao: ['laranja', 'Sem próxima ação'] };

export default async function inicio(v) {
  v.innerHTML = `<div class="inicio">
    <section class="hero card brilho">
      <div class="grow">
        <div class="rotulo acc">Painel de controle da Hórus</div>
        <h1 class="mt-8">${saudacao()}, <em>${esc(estado.eu?.nome || '')}</em>.</h1>
        <p class="muted mt-8" data-resumo>Farejando o dia…</p>
      </div>
      <div class="hero-acoes">
        <a class="btn prim lg" href="#/encontrar?aba=claude">${icone('radar')}Farejar clientes</a>
        <a class="btn lg" href="#/encontrar?aba=spark">${icone('planilha')}Subir planilha do Spark</a>
        <a class="btn lg" href="#/mercado?nova=1">${icone('mercado')}Pesquisar um nicho</a>
      </div>
    </section>
    <div class="kpis mt-16" data-kpis>${Array.from({ length: 5 }, () => '<div class="kpi"><div class="esq" style="height:14px;width:60%"></div><div class="esq" style="height:28px;width:40%;margin-top:14px"></div></div>').join('')}</div>
    <div class="inicio-grade">
      <div class="col gap-18">
        <section class="card pad-0"><div class="card-cab pad-cab"><div class="icone-caixa sm violeta">${icone('checkc')}</div><h3>Tarefas de hoje</h3><div class="right"><a class="btn xs fantasma" href="#/tarefas">Todas ${icone('chevd')}</a></div></div><div class="tarefas-lista" data-tarefas>${esqueleto(3)}</div></section>
        <section class="card"><div class="card-cab"><div class="icone-caixa sm vermelho">${icone('alerta')}</div><h3>Precisa de você</h3><div class="right"><a class="btn xs fantasma" href="#/esteira">Esteira ${icone('chevd')}</a></div></div><div data-atencao>${esqueleto(3)}</div></section>
        <section class="card"><div class="card-cab"><div class="icone-caixa sm">${icone('agenda')}</div><h3>Agenda: hoje e amanhã</h3><div class="right"><a class="btn xs fantasma" href="#/agenda">Agenda ${icone('chevd')}</a></div></div><div data-agenda>${esqueleto(2)}</div></section>
        <section class="card"><div class="card-cab"><div class="icone-caixa sm violeta">${icone('esteira')}</div><h3>A esteira agora</h3></div><div data-funil>${esqueleto(4, 12)}</div></section>
      </div>
      <div class="col gap-18">
        <section class="card"><div class="card-cab"><div class="icone-caixa sm verde">${icone('estrela')}</div><h3>Melhores oportunidades</h3><div class="right"><a class="btn xs fantasma" href="#/encontrar?aba=listas">Listas ${icone('chevd')}</a></div></div><div data-oport>${esqueleto(3)}</div></section>
        <section class="card"><div class="card-cab"><div class="icone-caixa sm verde">${icone('whatsapp')}</div><h3>Conversas quentes</h3><div class="right"><a class="btn xs fantasma" href="#/conversas">Conversas ${icone('chevd')}</a></div></div><div data-conv>${esqueleto(2)}</div></section>
        <section class="card"><div class="card-cab"><div class="icone-caixa sm claude">${sparkClaude(18)}</div><h3>O que aconteceu</h3></div><div data-feed>${esqueleto(4)}</div></section>
      </div>
    </div>
  </div>`;

  async function carregar() {
    if (!v.isConnected) return; // a tela pode ter sido trocada enquanto os dados vinham
    const agora = new Date();
    const hoje = new Date(agora); hoje.setHours(0, 0, 0, 0);
    const depoisAmanha = new Date(hoje); depoisAmanha.setDate(depoisAmanha.getDate() + 2);
    const semana = new Date(hoje); semana.setDate(semana.getDate() - ((semana.getDay() + 6) % 7));
    const em7 = new Date(hoje); em7.setDate(em7.getDate() + 7);

    const [atencao, agenda, itens, conversas, feed, fin, abordagens, reunioes, ig, tarefas] = await Promise.all([
      sb.from('vw_atencao').select('id,nome,estagio,motivo,proxima_acao,proxima_acao_em,categoria,cidade').limit(8),
      sb.from('agenda').select('*').gte('inicio', hoje.toISOString()).lt('inicio', depoisAmanha.toISOString()).neq('status', 'cancelado').order('inicio'),
      sb.from('lista_itens').select('id,nome,categoria,cidade,bairro,score,prioridade,site_status,whatsapp,lista_id,instagram_seguidores,google_avaliacoes').is('empresa_id', null).eq('descartado', false).order('score', { ascending: false }).limit(6),
      sb.from('whatsapp_conversas').select('*').not('empresa_id', 'is', null).eq('arquivada', false).order('ultima_em', { ascending: false, nullsFirst: false }).limit(20),
      sb.from('atividades').select('*').order('criado_em', { ascending: false }).limit(10),
      sb.from('financeiro').select('valor,status'),
      sb.from('atividades').select('id', { count: 'exact', head: true }).in('tipo', ['mensagem', 'ligacao', 'visita']).gte('criado_em', semana.toISOString()),
      sb.from('agenda').select('id', { count: 'exact', head: true }).in('tipo', ['r1', 'r2', 'visita']).gte('inicio', hoje.toISOString()).lt('inicio', em7.toISOString()).neq('status', 'cancelado'),
      sb.from('instagram_snapshots').select('seguidores,coletado_em').order('coletado_em', { ascending: false }).limit(1),
      sb.from('tarefas').select('*').in('status', ['a_fazer', 'fazendo', 'travada']).order('prazo', { nullsFirst: false }).limit(300),
    ]);
    if (!v.isConnected) return;

    // ------------------------------- KPIs
    const emps = estado.empresas.filter((e) => !e.arquivado && ['lead', 'cliente'].includes(e.relacao));
    const abertos = emps.filter((e) => ['qualificado', 'abordado', 'conversando', 'reuniao', 'proposta', 'negociacao'].includes(e.estagio));
    const ponderado = abertos.reduce((a, e) => a + (Number(e.valor_estimado) || 0) * (PROB_ESTAGIO[e.estagio] || 0) / 100, 0);
    const emConversa = emps.filter((e) => ['conversando', 'reuniao', 'proposta', 'negociacao'].includes(e.estagio)).length;
    const aReceber = (fin.data || []).filter((f) => f.status === 'a_receber').reduce((a, f) => a + Number(f.valor), 0);
    const meta = estado.config.metas?.abordagens_semana || 5;
    $('[data-kpis]', v).innerHTML = [
      kpi({ icone: 'dinheiro', rotulo: 'Pipeline ponderado', valor: brl(ponderado), sub: `${abertos.length} negócios em aberto`, cor: '' }),
      kpi({ icone: 'relogio', rotulo: 'A receber', valor: brl(aReceber), sub: 'entradas e saldos pendentes', cor: 'amarelo' }),
      kpi({ icone: 'conversa', rotulo: 'Em conversa', valor: emConversa, sub: 'conversando, reunião, proposta, negociação', cor: 'verde' }),
      kpi({ icone: 'agenda', rotulo: 'Reuniões em 7 dias', valor: reunioes.count ?? 0, sub: `meta do mês: ${estado.config.metas?.reunioes_mes ?? 2}`, cor: 'violeta' }),
      kpi({ icone: 'enviar', rotulo: 'Abordagens na semana', valor: `${abordagens.count ?? 0}<span class="kpi-meta">/${meta}</span>`, sub: 'mensagens, ligações e visitas registradas', cor: 'azul' }),
    ].join('');

    // ------------------------------- Resumo do dia
    const nAt = (atencao.data || []).length, nAg = (agenda.data || []).filter((a) => new Date(a.inicio) < new Date(hoje.getTime() + 86400000)).length;
    const online = farejadorOnline();
    const igTxt = ig.data?.[0]?.seguidores ? ` · @${estado.config.instagram?.handle || 'horuspublicidade'} com ${compacto(ig.data[0].seguidores)} seguidores` : '';
    $('[data-resumo]', v).innerHTML = `${nAt ? `<b>${nAt}</b> ${nAt === 1 ? 'negócio pede' : 'negócios pedem'} atenção` : 'Nenhum negócio travado'} · ${nAg ? `<b>${nAg}</b> compromisso${nAg > 1 ? 's' : ''} hoje` : 'agenda livre hoje'} · Farejador <b class="${online ? 'ok' : 'erro'}">${online ? 'online' : 'offline'}</b>${esc(igTxt)}`;

    // ------------------------------- Tarefas (atrasadas + hoje; se não houver, as 3 próximas)
    const abertas = tarefas.data || [];
    const h = hojeBahia();
    let doDia = abertas.filter((t) => t.prazo && t.prazo <= h);
    const proximas = !doDia.length;
    if (proximas) doDia = abertas.filter((t) => t.prazo).slice(0, 3);
    const boxT = $('[data-tarefas]', v);
    boxT.innerHTML = doDia.length ? `${proximas ? '<p class="dim pad-cab" style="font-size:12.5px;padding-top:0">Nada para hoje. As próximas:</p>' : ''}${doDia.slice(0, 8).map((t) => linhaTarefa(t, abertas)).join('')}`
      : `<div class="pad-cab">${vazio('checkc', 'Nenhuma tarefa com prazo', 'Crie em Tarefas ou peça ao Claude.')}</div>`;
    boxT._lista = abertas;

    // ------------------------------- Atenção
    $('[data-atencao]', v).innerHTML = (atencao.data || []).length ? atencao.data.map((e) => {
      const [c, t] = MOTIVO[e.motivo] || ['cinza', e.motivo];
      return `<div class="item clicavel" data-emp="${e.id}"><span class="avatar sm neutro">${esc(iniciais(e.nome))}</span><div class="grow"><div class="tit ellipsis">${esc(e.nome)}</div><div class="sub ellipsis">${esc(e.proxima_acao || achaEstagio(e.estagio).descricao || '')}</div></div><span class="selo ${c}">${esc(t)}</span></div>`;
    }).join('') : vazio('checkc', 'Tudo em dia', 'Nenhum negócio parado, sem ação vencida.');

    // ------------------------------- Agenda
    $('[data-agenda]', v).innerHTML = (agenda.data || []).length ? agenda.data.map((a) => {
      const emp = estado.empresas.find((e) => e.id === a.empresa_id);
      const eHoje = new Date(a.inicio) < new Date(hoje.getTime() + 86400000);
      return `<div class="item clicavel" data-ag="${a.id}"><div class="hora-bloco"><b>${hora(a.inicio)}</b><small>${eHoje ? 'hoje' : 'amanhã'}</small></div><div class="grow"><div class="tit ellipsis">${esc(a.titulo)}</div><div class="sub ellipsis">${esc([emp?.nome, a.local].filter(Boolean).join(' · ') || 'Sem local')}</div></div>${a.status === 'feito' ? '<span class="selo verde">Feito</span>' : ''}</div>`;
    }).join('') : vazio('agenda', 'Nada marcado para hoje e amanhã', 'Reunião se marca na conversa: o objetivo da mensagem é agendar.', '<a class="btn sm" href="#/agenda">Abrir agenda</a>');

    // ------------------------------- Funil
    const est = estado.estagios.filter((s) => s.funil === 'prospeccao' && s.tipo !== 'perdido');
    const cont = Object.fromEntries(est.map((s) => [s.id, emps.filter((e) => e.estagio === s.id).length]));
    const max = Math.max(1, ...Object.values(cont));
    $('[data-funil]', v).innerHTML = `<div class="funil">${est.map((s) => `<a class="funil-linha" href="#/esteira"><span class="funil-nome"><span class="ponto" style="background:${s.cor}"></span>${esc(s.nome)}</span><span class="funil-barra"><i style="width:${(cont[s.id] / max) * 100}%;background:${s.cor}"></i></span><b class="num">${cont[s.id]}</b></a>`).join('')}</div>`;

    // ------------------------------- Oportunidades
    $('[data-oport]', v).innerHTML = (itens.data || []).length ? itens.data.map((i) => `
      <a class="item clicavel" href="#/encontrar/lista/${i.lista_id}"><span class="score sm ${i.prioridade}">${i.score}</span><div class="grow"><div class="tit ellipsis">${esc(i.nome)}</div>
      <div class="sub ellipsis">${esc([i.categoria, i.bairro || i.cidade].filter(Boolean).join(' · '))}${i.site_status === 'sem' ? ' · sem site' : i.site_status === 'fora_do_ar' ? ' · site fora do ar' : ''}</div></div>${i.whatsapp ? `<span class="selo verde">${icone('whatsapp')}</span>` : ''}</a>`).join('')
      : vazio('radar', 'Nenhuma lista ainda', 'Suba a planilha do Spark ou peça uma farejada ao Claude: os melhores aparecem aqui.', '<a class="btn sm prim" href="#/encontrar">Encontrar clientes</a>');

    // ------------------------------- Conversas
    const quentes = (conversas.data || []).filter((c) => c.empresa_id).slice(0, 5);
    $('[data-conv]', v).innerHTML = quentes.length ? quentes.map((c) => {
      const emp = estado.empresas.find((e) => e.id === c.empresa_id);
      const obj = c.analise?.objecoes?.[0]?.rotulo;
      return `<a class="item clicavel" href="#/conversas/${c.id}"><span class="avatar sm neutro">${esc(iniciais(emp?.nome || c.nome))}</span><div class="grow"><div class="tit ellipsis">${esc(emp?.nome || c.nome || c.telefone)}</div><div class="sub ellipsis">${c.ultima_direcao === 'in' ? '' : 'Você: '}${esc(c.ultima_mensagem || '')}</div></div>
        ${obj ? `<span class="selo laranja">${esc(obj)}</span>` : ''}${c.nao_lidas ? `<span class="badge verde">${c.nao_lidas}</span>` : `<small class="dim">${relativo(c.ultima_em)}</small>`}</a>`;
    }).join('') : vazio('whatsapp', estado.farejador?.whatsapp_status === 'conectado' ? 'Sem conversas com leads ainda' : 'WhatsApp não conectado', estado.farejador?.whatsapp_status === 'conectado' ? 'Quando um lead responder, a leitura do Claude aparece aqui.' : 'Conecte o WhatsApp para o Claude ler as respostas e sugerir o que dizer.', '<a class="btn sm" href="#/conversas">Conectar</a>');

    // ------------------------------- Feed
    $('[data-feed]', v).innerHTML = (feed.data || []).length ? `<div class="linha-tempo">${feed.data.map((a) => {
      const emp = estado.empresas.find((e) => e.id === a.empresa_id);
      const doClaude = a.autor === 'claude' || a.autor === 'farejador';
      return `<div class="lt-item ${emp ? 'clicavel-lt' : ''}" ${emp ? `data-emp="${emp.id}"` : ''}><div class="lt-ic">${doClaude ? sparkClaude(15) : icone({ estagio: 'esteira', whatsapp: 'whatsapp', reuniao: 'clientes', mensagem: 'enviar', pesquisa: 'radar', pagamento: 'dinheiro', ligacao: 'telefone' }[a.tipo] || 'info')}</div><div class="grow"><div class="lt-t">${esc(a.titulo)}${emp ? ` <span class="dim">· ${esc(emp.nome)}</span>` : ''}</div><div class="lt-m">${esc(a.autor)} · ${relativo(a.criado_em)}</div></div></div>`;
    }).join('')}</div>` : vazio('relogio', 'Sem movimento ainda');
  }

  v.addEventListener('change', async (e) => {
    const c = e.target.closest('[data-tarefas] [data-check]'); if (!c) return;
    const t = ($('[data-tarefas]', v)._lista || []).find((x) => x.id === c.closest('[data-tarefa]').dataset.tarefa);
    if (t && !(await alternarFeita(t, c.checked))) c.checked = !c.checked;
  });
  v.addEventListener('click', (e) => {
    const tf = e.target.closest('[data-tarefas] [data-abrir]');
    if (tf) { const t = ($('[data-tarefas]', v)._lista || []).find((x) => x.id === tf.closest('[data-tarefa]').dataset.tarefa); if (t) editarTarefa(t); return; }
    const emp = e.target.closest('[data-emp]');
    if (emp) { abrirFicha(emp.dataset.emp); return; }
    const ag = e.target.closest('[data-ag]');
    if (ag) import('../acoes.js').then(async ({ agendar }) => { const { data } = await sb.from('agenda').select('*').eq('id', ag.dataset.ag).single(); if (data) agendar({}, data); });
  });

  try { await carregar(); } catch (e) { console.error(e); $('[data-resumo]', v).textContent = 'Parte do painel não carregou. Recarregue a página.'; }
  const recarregar = debounce(() => carregar().catch(console.error), 1200);
  const tiras = ['empresas', 'agenda', 'atividades', 'whatsapp_conversas', 'financeiro', 'farejador_status', 'listas', 'tarefas'].map((t) => ouvir(t, recarregar));
  return () => tiras.forEach((f) => f());
}
