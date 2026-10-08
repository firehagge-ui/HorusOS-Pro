/* =============================================================================
   HOUNDER — Central de tarefas e destino de cada tarefa (01/10/2026).
   Pedido do Marcelo: "eu clico e fico sem saber se começou, se travou, se
   terminou". O botão do topo mostra quantas tarefas estão rodando (gira enquanto
   trabalha) e abre a lista: em andamento (com o progresso real), na fila, e o que
   terminou nas últimas 24 horas, cada uma com o link pro lugar onde ela mexeu.
   Os dados vêm da tabela jobs (sobrevive a recarregar a página), em tempo real.
   linkDoJob() é o "deep link" de toda tarefa: notificação, toast e central usam o mesmo.
   ============================================================================= */
import { sb, ouvir, estado, farejadorOnline } from './sb.js';
import { $, $$, el, esc, relativo, toast } from './ui.js';
import { icone } from './icones.js';

export const NOMES_JOB = {
  pesquisar_clientes: 'Farejada de clientes', pesquisa_mercado: 'Pesquisa de mercado', enriquecer_empresa: 'Dossiê da empresa',
  analisar_conversa: 'Análise da conversa', chat: 'Resposta do Claude', instagram: 'Coleta do Instagram', ideias_instagram: 'Ideias de conteúdo',
  midia_semana: 'Mídia: sessão da semana', midia_ajuste: 'Mídia: ajuste de post', midia_triagem: 'Mídia: triagem',
  whatsapp_enviar: 'Mensagem no WhatsApp', investigar_empresa: 'Investigação profunda', enriquecer_lista: 'Enriquecimento da lista',
  triar_lista: 'Triagem da lista', mensagem_personalizada: 'Mensagem personalizada', agente_ciclo: 'Agente pensando',
};
// Tarefas internas que não ajudam a acompanhar nada (rodam o tempo todo ou são do próprio WhatsApp)
const OCULTAS = new Set(['chat', 'whatsapp_conectar', 'whatsapp_codigo', 'instagram', 'analisar_conversa']);

const nomeEmpresa = (id) => estado.empresas.find((e) => e.id === id)?.nome || null;

/** Onde a tarefa mexeu: o lugar exato pra abrir. */
export function linkDoJob(j) {
  if (!j) return null;
  const s = j.saida || {};
  switch (j.tipo) {
    case 'enriquecer_lista': return j.lista_id || s.lista_id ? `#/encontrar/lista/${j.lista_id || s.lista_id}?filtro=enriquecidos` : null;
    case 'triar_lista': return j.lista_id ? `#/encontrar/lista/${j.lista_id}` : '#/esteira';
    case 'pesquisar_clientes': return s.lista_id ? `#/encontrar/lista/${s.lista_id}` : '#/encontrar?aba=claude';
    case 'pesquisa_mercado': return s.pesquisa_id ? `#/mercado/${s.pesquisa_id}` : '#/mercado';
    case 'agente_ciclo': return j.empresa_id ? `#/agentes?lead=${j.empresa_id}` : '#/agentes';
    case 'whatsapp_enviar': return j.conversa_id ? `#/conversas/${j.conversa_id}` : '#/conversas';
    case 'midia_semana': case 'midia_ajuste': case 'midia_triagem': case 'ideias_instagram': return '#/instagram';
    default: return j.empresa_id ? `#/empresa/${j.empresa_id}` : j.lista_id ? `#/encontrar/lista/${j.lista_id}` : null;
  }
}

/** "Enriquecimento da lista", "Agente pensando · Cintya Gualberto" */
export function nomeDoJob(j) {
  const base = NOMES_JOB[j.tipo] || j.tipo;
  const emp = j.empresa_id && nomeEmpresa(j.empresa_id);
  const n = j.entrada?.item_ids?.length;
  return `${base}${emp ? ` · ${emp}` : n ? ` · ${n} lead${n > 1 ? 's' : ''}` : ''}`;
}

/** Ir pra um link interno, mesmo que seja a tela atual (a tela recarrega e abre o contexto certo). */
export function irPara(link) {
  if (!link) return;
  if (location.hash === link) window.dispatchEvent(new HashChangeEvent('hashchange'));
  else location.hash = link;
}

let jobs = [];
let pop = null;
let botao = null;

async function carregar() {
  const desde = new Date(Date.now() - 24 * 3600e3).toISOString();
  const { data, error } = await sb.from('jobs').select('id,tipo,status,progresso,erro,criado_em,iniciado_em,concluido_em,empresa_id,lista_id,conversa_id,saida,entrada,prioridade')
    .or(`status.in.(fila,processando),criado_em.gte.${desde}`).order('criado_em', { ascending: false }).limit(80);
  if (error) return;
  jobs = (data || []).filter((j) => !OCULTAS.has(j.tipo));
  desenharBotao();
  if (pop) desenharPop();
}

const ativos = () => jobs.filter((j) => j.status === 'processando');
const naFila = () => jobs.filter((j) => j.status === 'fila').sort((a, b) => (a.prioridade || 5) - (b.prioridade || 5) || new Date(a.criado_em) - new Date(b.criado_em));

function desenharBotao() {
  if (!botao) return;
  const a = ativos().length, f = naFila().length, n = a + f;
  botao.classList.toggle('ativa', a > 0);
  botao.classList.toggle('so-fila', !a && f > 0);
  const b = $('.central-n', botao);
  b.textContent = n > 9 ? '9+' : String(n);
  b.classList.toggle('hide', !n);
  botao.title = n ? `${a ? `${a} rodando` : ''}${a && f ? ' · ' : ''}${f ? `${f} na fila` : ''}` : 'Nenhuma tarefa em andamento';
  botao.setAttribute('aria-label', `Tarefas: ${botao.title}`);
}

function tempo(j) {
  if (j.status === 'processando' && j.iniciado_em) return `rodando há ${relativo(j.iniciado_em).replace(/^há /, '')}`;
  if (j.status === 'fila') return `na fila ${relativo(j.criado_em)}`;
  return relativo(j.concluido_em || j.criado_em);
}
function linha(j, i) {
  const link = linkDoJob(j);
  const demorando = j.status === 'processando' && j.iniciado_em && Date.now() - new Date(j.iniciado_em) > 25 * 60e3;
  const ic = { processando: '<span class="girando" aria-hidden="true"></span>', fila: icone('relogio'), concluido: icone('checkc'), erro: icone('alerta'), cancelado: icone('x') }[j.status] || icone('info');
  const sub = j.status === 'erro' ? (j.erro || 'Falhou sem mensagem').slice(0, 140)
    : j.status === 'fila' ? `${i + 1}º na fila${farejadorOnline() ? '' : ' · o Farejador está desligado: começa quando ligar'}`
      : j.status === 'concluido' ? resumoSaida(j) : (j.progresso || 'Começando…').slice(0, 140);
  return `<li class="cj ${j.status}">
    <span class="cj-ic">${ic}</span>
    <div class="cj-corpo"><div class="cj-topo"><b class="ellipsis">${esc(nomeDoJob(j))}</b><small>${esc(tempo(j))}</small></div>
      <div class="cj-sub">${esc(sub)}</div>
      ${demorando ? '<div class="cj-alerta">Demorando mais que o normal. Se não andar, cancele e peça de novo.</div>' : ''}
      ${j.status === 'processando' ? '<div class="cj-barra"><i></i></div>' : ''}</div>
    <div class="cj-acoes">
      ${link ? `<button class="btn xs" data-cj-abrir="${j.id}">Abrir</button>` : ''}
      ${['fila', 'processando'].includes(j.status) ? `<button class="btn xs fantasma" data-cj-cancelar="${j.id}" title="Cancelar">${icone('x')}</button>` : ''}
      ${j.status === 'erro' ? `<button class="btn xs fantasma" data-cj-refazer="${j.id}" title="Tentar de novo">${icone('atualizar')}</button>` : ''}
    </div></li>`;
}
function resumoSaida(j) {
  const s = j.saida || {};
  if (j.tipo === 'enriquecer_lista') return `${s.atualizados ?? '?'} de ${s.pedidos ?? '?'} leads com dado novo`;
  if (j.tipo === 'triar_lista') return `${s.passaram ?? 0} passaram, ${s.descartados ?? 0} descartados`;
  if (j.tipo === 'agente_ciclo') return { mensagem: 'Mensagem pronta pra aprovar', esperar: 'Decidiu esperar o lead', precisa_marcelo: 'Precisa de você', manter: 'Manteve a proposta', investigar: 'Pediu investigação', encerrar: 'Recomendou encerrar' }[s.decisao] || 'Pronto';
  return (j.progresso && j.progresso !== 'Pronto' ? j.progresso : 'Pronto').slice(0, 120);
}

function desenharPop() {
  if (!pop) return;
  const a = ativos(), f = naFila(), fim = jobs.filter((j) => ['concluido', 'erro', 'cancelado'].includes(j.status)).slice(0, 12);
  const on = farejadorOnline();
  pop.innerHTML = `
    <div class="central-cab"><b>Tarefas</b><span class="central-faro ${on ? 'on' : 'off'}"><i></i>${on ? 'Farejador trabalhando' : 'Farejador desligado: nada roda até ele ligar'}</span></div>
    <div class="central-corpo">
      ${a.length || f.length ? '' : `<div class="central-vazio">${icone('checkc')}<span>Nada rodando agora. Quando você pedir algo demorado (enriquecer, triar, investigar), aparece aqui na hora.</span></div>`}
      ${a.length ? `<h4>Em andamento · ${a.length}</h4><ul>${a.map((j, i) => linha(j, i)).join('')}</ul>` : ''}
      ${f.length ? `<h4>Na fila · ${f.length}</h4><ul>${f.map((j, i) => linha(j, i)).join('')}</ul>` : ''}
      ${fim.length ? `<h4>Últimas 24 horas</h4><ul>${fim.map((j, i) => linha(j, i)).join('')}</ul>` : ''}
    </div>
    <a class="central-pe" href="#/ajustes">Histórico completo em Ajustes</a>`;
}

function abrir() {
  if (pop) { fechar(); return; }
  $$('.menu-pop').forEach((m) => m.remove());
  pop = el('<div class="menu-pop central-pop" role="dialog" aria-label="Tarefas em andamento"></div>');
  document.body.appendChild(pop);
  const r = botao.getBoundingClientRect();
  const larg = Math.min(420, window.innerWidth - 16);
  pop.style.width = `${larg}px`; pop.style.left = `${Math.max(8, r.right - larg)}px`; pop.style.top = `${r.bottom + 6}px`;
  desenharPop();
  carregar();
  pop.onclick = async (e) => {
    const ab = e.target.closest('[data-cj-abrir]'), ca = e.target.closest('[data-cj-cancelar]'), re = e.target.closest('[data-cj-refazer]');
    if (ab) { const j = jobs.find((x) => x.id === ab.dataset.cjAbrir); fechar(); irPara(linkDoJob(j)); }
    if (ca) { await sb.from('jobs').update({ status: 'cancelado' }).eq('id', ca.dataset.cjCancelar); toast('Tarefa cancelada', 'info'); carregar(); }
    if (re) { await sb.from('jobs').update({ status: 'fila', erro: null, progresso: 'Reenviado', iniciado_em: null }).eq('id', re.dataset.cjRefazer); toast('De volta pra fila', 'info'); carregar(); }
  };
  setTimeout(() => document.addEventListener('click', fora), 0);
}
function fora(e) { if (pop && !pop.contains(e.target) && !botao.contains(e.target)) fechar(); }
function fechar() { pop?.remove(); pop = null; document.removeEventListener('click', fora); }

/** Liga a central no botão do topo. */
export function ligarCentral(btn) {
  botao = btn;
  btn.onclick = (e) => { e.stopPropagation(); abrir(); };
  carregar();
  ouvir('jobs', (p) => {
    const j = p.new;
    if (!j?.id || OCULTAS.has(j.tipo)) return;
    const i = jobs.findIndex((x) => x.id === j.id);
    if (p.eventType === 'DELETE') { if (i >= 0) jobs.splice(i, 1); }
    else if (i >= 0) jobs[i] = { ...jobs[i], ...j };
    else jobs.unshift(j);
    desenharBotao();
    if (pop) desenharPop();
  });
  ouvir('farejador_status', () => { if (pop) desenharPop(); });
  // Pedido feito agora nesta tela: o botão reage na hora, antes do tempo real chegar
  window.addEventListener('hounder:job', (ev) => {
    const j = ev.detail;
    if (!j?.id || OCULTAS.has(j.tipo) || jobs.some((x) => x.id === j.id)) return;
    jobs.unshift(j); desenharBotao(); if (pop) desenharPop();
    botao.classList.remove('pulso'); void botao.offsetWidth; botao.classList.add('pulso');
  });
  setInterval(carregar, 30000); // reserva: o tempo real às vezes cai
}

/** Abre a central (pra um toast de "acompanhe aqui"). */
export function abrirCentral() { if (botao && !pop) abrir(); }
