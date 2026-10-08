/* =============================================================================
   HOUNDER — Mesa de agentes (Fase 2 do PLANO-AGENTES.md, 30/09/2026).
   Um cartão por lead com agente, agrupado pelo que precisa do Marcelo: pronto
   pra aprovar, precisa de você, trabalhando, esperando o lead, encerrados.
   O cartão traz o cliente, onde a conversa está e o que o agente propõe, com
   "Aprovar e enviar". Pedido do Marcelo: responder rápido, sem procrastinar.
   Nada sai sem o clique dele. Resposta a lead que falou vai na hora pela
   conversa; primeira mensagem e follow-up entram na fila do Disparos, com a
   janela de horário e o limite de 10 por dia.
   ============================================================================= */
import { sb, estado, ouvir, farejadorOnline, quem, criarJob } from '../sb.js';
import { $, $$, esc, toast, modal, gaveta, confirmar, erroAmigavel, botaoCarregando, telefoneBonito, relativo, dataHora, vazio, esqueleto, debounce, iniciais } from '../ui.js';
import { icone } from '../icones.js';
import { revisar, pareceAutoResposta } from '../revisor.js';
import { montarEscritorio, posicoesEscritorio, rosto, AREA_MAPA, CIDADES } from '../pixel.js';
import { saudeDoLead, ROTULO_SAUDE } from '../saude.js';

const LIMITE_AGENTES = 10;
const LIMITE_DIA = 10;
// Mesma janela do Farejador (farejador/disparos.mjs): seg a sex 8h30 às 18h, sábado 9h às 12h, horário da Bahia
const JANELA = { 1: [8.5, 18], 2: [8.5, 18], 3: [8.5, 18], 4: [8.5, 18], 5: [8.5, 18], 6: [9, 12] };
function naJanela(t) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Bahia', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date(t)).map((x) => [x.type, x.value]));
  const dia = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[p.weekday];
  const h = Number(p.hour) + Number(p.minute) / 60;
  return !!JANELA[dia] && h >= JANELA[dia][0] && h < JANELA[dia][1];
}
function proximaAbertura(t) {
  const x = new Date(Math.ceil(new Date(t).getTime() / 900000) * 900000);
  for (let i = 0; i < 8 * 96; i++, x.setTime(x.getTime() + 900000)) if (naJanela(x)) return x;
  return null;
}
const diaBahia = (d) => new Date(d).toLocaleDateString('en-CA', { timeZone: 'America/Bahia' });
const hojeBahia = () => diaBahia(new Date());
function quando(d) {
  const h = new Date(d).toLocaleTimeString('pt-BR', { timeZone: 'America/Bahia', hour: '2-digit', minute: '2-digit' });
  return diaBahia(d) === hojeBahia() ? `hoje às ${h}` : `${new Date(d).toLocaleDateString('pt-BR', { timeZone: 'America/Bahia', weekday: 'short', day: '2-digit', month: '2-digit' }).replace('.', '')} às ${h}`;
}
const umaLinha = (t) => String(t || '').trim().replace(/\s*\n+\s*/g, ' ');

const TIPO = { abertura: 'Primeira mensagem', corpo: 'Corpo', resposta: 'Resposta', followup: 'Follow-up' };
const GRUPOS = [
  ['pronto', 'Pronto pra aprovar', 'Leia, ajuste se quiser e aprove. Resposta a quem falou sai na hora; primeira mensagem e follow-up entram na fila no horário comercial.'],
  ['voce', 'Precisa de você', 'O agente travou numa coisa que só você faz: conferir no celular, tirar um print, decidir.'],
  ['trabalhando', 'Trabalhando', 'Lendo a conversa, pesquisando ou escrevendo. Aparece aqui em cima quando tiver algo pra aprovar.'],
  ['esperando', 'Esperando o lead', 'A bola está com o lead. O agente acorda sozinho na data marcada ou quando ele responder.'],
  ['encerrados', 'Pausados e encerrados', 'Geladeira, ganho, perdido ou pausado. Não contam no limite de agentes.'],
];

export default async function agentes(v, { params = {} } = {}) {
  v.innerHTML = `
    <div class="cab"><div class="tt"><h1>Mesa de agentes</h1><p>Os especialistas cuidam dos seus leads, cada lead com memória e diário próprios. O que eles propõem espera o seu clique.</p></div>
      <div class="acoes"><button class="btn prim" data-novo>${icone('usuariomais')}Acompanhar lead</button></div></div>
    <div data-aviso></div>
    <div data-novidade></div>
    <div data-suavez></div>
    <section class="escritorio" data-escritorio aria-label="O escritório dos especialistas"><div class="escritorio-estacoes" data-estacoes></div></section>
    <div data-corpo>${esqueleto(8, 26)}</div>`;

  let ags = [], disp = [], convs = [], msgs = [], jobs = [], ocupados = [], eventos = [], taxa = { enviados: 0, responderam: 0, porEmpresa: new Map() };
  // Fase 3 (30/09): os especialistas por segmento, as lições do nicho e as reuniões marcadas
  let esps = [], notasEsp = [], reunioes = [], cena = null, filtroEsp = null;

  async function carregar(forcar = false) {
    if (!v.isConnected) return;
    const { data: a, error } = await sb.from('agentes').select('*').order('atualizado_em', { ascending: false });
    if (error) { $('[data-corpo]', v).innerHTML = vazio('alerta', 'Não carregou', erroAmigavel(error)); return; }
    // 05/10 (Marcelo): lead perdido, ganho ou encerrado sai da Mesa. Geladeira e pausado ficam em "Parados".
    const fimEmp = (id) => ['perdido', 'ganho'].includes(estado.empresas.find((e) => e.id === id)?.estagio);
    ags = (a || []).filter((x) => !['perdido', 'ganho'].includes(x.fase) && !(x.status === 'encerrado' && x.fase !== 'geladeira') && !fimEmp(x.empresa_id));
    const ids = ags.map((x) => x.empresa_id);
    if (!ids.length) { disp = []; convs = []; msgs = []; jobs = []; return desenhar(); }
    const desde = new Date(Date.now() - 3 * 864e5).toISOString();
    const [d, c, j, o, ev, es, ne, ag] = await Promise.all([
      sb.from('disparos').select('*').in('empresa_id', ids).neq('status', 'cancelado').order('criado_em', { ascending: true }).limit(600),
      sb.from('whatsapp_conversas').select('id,empresa_id,telefone,jid,nome,analise').in('empresa_id', ids),
      sb.from('jobs').select('id,empresa_id,status,entrada,criado_em,progresso').eq('tipo', 'agente_ciclo').in('status', ['fila', 'processando']),
      // pro limite de 10 por dia: o que já saiu ou está agendado perto de hoje, de qualquer lead
      sb.from('disparos').select('status,enviado_em,agendado_para').in('status', ['enviado', 'agendado', 'enviando']).or(`enviado_em.gte.${desde},agendado_para.gte.${desde}`).limit(500),
      sb.from('agente_eventos').select('empresa_id,gatilho,aconteceu,leitura,decisao,porque,autor,criado_em').order('criado_em', { ascending: false }).limit(40),
      sb.from('especialistas').select('*').eq('ativo', true).order('ordem'),
      sb.from('especialista_notas').select('*').neq('status', 'descartada').order('criado_em', { ascending: false }).limit(300),
      sb.from('agenda').select('id,empresa_id,tipo,inicio,status,criado_em').in('empresa_id', ids).in('tipo', ['r1', 'r2', 'ligacao', 'visita']).neq('status', 'cancelado'),
    ]);
    disp = d.data || []; convs = c.data || []; jobs = j.data || []; ocupados = o.data || []; eventos = ev.data || [];
    esps = es.data || []; notasEsp = ne.data || []; reunioes = ag.data || [];
    taxa = await taxaResposta();
    if (!forcar && editando()) { avisarNovidade(); return; }
    msgs = [];
    if (convs.length) {
      const { data: m } = await sb.from('whatsapp_mensagens').select('conversa_id,direcao,texto,tipo,momento').in('conversa_id', convs.map((x) => x.id)).order('momento', { ascending: false }).limit(800);
      msgs = m || [];
    }
    desenhar();
  }

  /* Tempo real sem apagar o que o Marcelo está escrevendo: com texto editado ou com o cursor numa caixa, a tela
     segura a atualização e mostra um aviso; ela desenha de novo quando ele clicar ou depois de aprovar. */
  function editando() {
    const caixas = $$('textarea', v);
    return caixas.some((t) => t.value !== t.defaultValue) || (document.activeElement?.tagName === 'TEXTAREA' && v.contains(document.activeElement));
  }
  function avisarNovidade() {
    const alvo = $('[data-novidade]', v);
    if (alvo && !alvo.innerHTML) alvo.innerHTML = `<div class="aviso azul mb-16 mesa-novidade">${icone('info')}<div class="grow">Chegou novidade dos agentes. Esperei você terminar de editar pra não apagar o texto.</div><button class="btn sm" data-atualizar>${icone('atualizar')}Atualizar</button></div>`;
  }

  /* Primeira mensagem de cada lead (passo 1 enviado) e se alguém de verdade respondeu depois dela */
  async function taxaResposta() {
    const { data: env } = await sb.from('disparos').select('empresa_id,enviado_em,respondeu,formato').eq('passo', 1).eq('status', 'enviado').order('enviado_em').limit(300);
    const primeiro = new Map();
    for (const d of env || []) if (!primeiro.has(d.empresa_id)) primeiro.set(d.empresa_id, d);
    if (!primeiro.size) return { enviados: 0, responderam: 0, porEmpresa: new Map() };
    const { data: cv } = await sb.from('whatsapp_conversas').select('id,empresa_id').in('empresa_id', [...primeiro.keys()]);
    const desdeMin = [...primeiro.values()].reduce((m, d) => (d.enviado_em < m ? d.enviado_em : m), '9999');
    const { data: ins } = cv?.length ? await sb.from('whatsapp_mensagens').select('conversa_id,texto,momento').in('conversa_id', cv.map((x) => x.id)).eq('direcao', 'in').gte('momento', desdeMin).limit(1000) : { data: [] };
    let responderam = 0;
    const porEmpresa = new Map();
    for (const [empId, d] of primeiro) {
      const ids = (cv || []).filter((x) => x.empresa_id === empId).map((x) => x.id);
      const r = !!(d.respondeu || (ins || []).some((m) => ids.includes(m.conversa_id) && new Date(m.momento) > new Date(d.enviado_em) && m.texto && !pareceAutoResposta(m.texto)));
      if (r) responderam++;
      porEmpresa.set(empId, { formato: d.formato || 'casa', respondeu: r });
    }
    return { enviados: primeiro.size, responderam, porEmpresa };
  }

  /* ------------------------------ leitura do estado ------------------------------ */
  const emp = (id) => estado.empresas.find((e) => e.id === id) || { id, nome: 'Empresa' };
  const convDe = (id) => convs.find((c) => c.empresa_id === id);
  function falasDe(id) {
    const ids = convs.filter((c) => c.empresa_id === id).map((c) => c.id);
    return msgs.filter((m) => ids.includes(m.conversa_id)).sort((x, y) => new Date(x.momento) - new Date(y.momento));
  }
  // Fala humana do lead: nem resposta automática do WhatsApp Business nem aviso do sistema sem texto
  const humana = (m) => m.direcao === 'in' && m.texto && !pareceAutoResposta(m.texto);
  // Pra saber de quem é a vez: mídia sem texto (áudio, figurinha, "[outro]") é do lead; só a saudação automática não conta
  const automatica = (m) => m.direcao === 'in' && m.texto && pareceAutoResposta(m.texto);
  // "[outro]" sem texto, nos dois sentidos, é aviso do próprio WhatsApp (30/09, Cintya: "Sua empresa não pode mais usar as
  // mensagens temporárias"). Não é fala de ninguém e não muda de quem é a vez. Mesma regra do agente (farejador/agente.mjs).
  const aviso = (m) => !m.texto && (m.tipo === 'outro' || !m.tipo);
  const conta = (m) => !automatica(m) && !aviso(m);

  /* Passo 2 em diante só sai se o lead (gente, não robô) respondeu depois do passo anterior. Follow-up não trava. */
  function liberado(d) {
    if ((d.passo || 1) < 2 || d.tipo === 'followup') return true;
    const ant = disp.filter((x) => x.empresa_id === d.empresa_id && x.passo === d.passo - 1 && x.status === 'enviado').pop();
    const falas = falasDe(d.empresa_id).filter(humana);
    if (ant) return !!ant.respondeu || falas.some((m) => new Date(m.momento) > new Date(ant.enviado_em));
    return falas.length > 0;
  }

  /* Como a mensagem sai quando o Marcelo aprova */
  function modoDe(d) {
    if (d.tipo === 'followup') {
      const alvo = Math.max(d.sugerido_para ? new Date(d.sugerido_para).getTime() : 0, Date.now() + 2 * 60000);
      return { como: 'fila', h: naJanela(alvo) ? new Date(alvo) : proximaAbertura(alvo) };
    }
    if ((d.passo || 1) > 1) {
      if (!liberado(d)) return { como: 'travado' };
      if (convDe(d.empresa_id)) return { como: 'agora' };
    }
    const alvo = Date.now() + 20000;
    return { como: 'fila', h: naJanela(alvo) ? new Date(alvo) : proximaAbertura(alvo) };
  }
  function rotuloAprovar(d) {
    const m = modoDe(d);
    if (m.como === 'agora') return 'Aprovar e enviar';
    if (m.como === 'travado') return 'Espera o lead responder';
    if (!m.h) return 'Aprovar';
    return m.h.getTime() - Date.now() < 10 * 60000 ? 'Aprovar e enviar' : `Aprovar · sai ${quando(m.h)}`;
  }

  const trabalhando = (id) => jobs.find((j) => j.empresa_id === id);
  const pendentes = (id) => disp.filter((d) => d.empresa_id === id && d.status === 'rascunho')
    .sort((x, y) => (x.passo || 1) - (y.passo || 1) || String(x.variante || 'A').localeCompare(y.variante || 'A'));
  const naFila = (id) => disp.filter((d) => d.empresa_id === id && ['aprovado', 'agendado', 'enviando'].includes(d.status));
  // O que já saiu da sua mão pra este lead e ainda não terminou bem: agendada, na fila, enviando ou falhou
  const emCurso = (id) => disp.filter((d) => d.empresa_id === id && (['aprovado', 'agendado', 'enviando'].includes(d.status) || (d.status === 'erro' && Date.now() - new Date(d.criado_em) < 7 * 864e5)))
    .sort((x, y) => new Date(x.agendado_para || x.criado_em) - new Date(y.agendado_para || y.criado_em));
  /* O estado de uma mensagem, dito do jeito que o Marcelo pergunta: aguardando, aprovada, agendada, enviando, enviada, falhou */
  function estadoMsg(d) {
    if (d.status === 'rascunho') return ['laranja', 'editar', 'Esperando sua aprovação'];
    if (d.status === 'aprovado') return ['azul', 'check', 'Aprovada · na fila de envio'];
    if (d.status === 'agendado') return ['violeta', 'agenda', `Agendada · ${quando(d.agendado_para)}`];
    if (d.status === 'enviando') return ['claude', 'enviar', 'Enviando agora'];
    if (d.status === 'enviado') return ['verde', 'checkc', `Enviada ${d.enviado_em ? relativo(d.enviado_em) : ''}`];
    if (d.status === 'erro') return ['vermelho', 'alerta', `Falhou${d.erro ? `: ${String(d.erro).slice(0, 80)}` : ''}`];
    return ['cinza', 'x', 'Cancelada'];
  }
  /* Saúde da conversa (desistência controlada): a mesma régua que o agente recebe */
  function saudeDe(a) {
    return saudeDoLead({
      falas: falasDe(a.empresa_id).filter((m) => !aviso(m)).map((m) => ({ momento: m.momento, direcao: m.direcao, texto: m.texto, humana: m.direcao === 'in' ? humana(m) : undefined })),
      envios: disp.filter((d) => d.empresa_id === a.empresa_id && d.status === 'enviado'), desde: a.criado_em,
    });
  }

  function grupoDe(a) {
    if (a.status !== 'ativo' || ['geladeira', 'ganho', 'perdido'].includes(a.fase)) return 'encerrados';
    if (trabalhando(a.empresa_id)) return 'trabalhando';
    if (a.recomendacao) return 'decidir';
    const p = pendentes(a.empresa_id);
    if (p.some((d) => modoDe(d).como !== 'travado')) return 'pronto';
    if (a.fase === 'precisa_voce' && a.precisa_de_voce) return 'voce';
    if (a.fase === 'novo') return 'trabalhando';
    return 'esperando';
  }

  /* ------------------------------ desenho ------------------------------ */
  const fala = (m) => `<div class="mesa-fala ${m.direcao}${automatica(m) || aviso(m) ? ' robo' : ''}">
      <span class="quem">${aviso(m) ? 'Sem texto' : m.direcao === 'in' ? (automatica(m) ? 'Automático' : m.texto ? 'Lead' : 'Lead · mídia') : 'Você'}</span>
      <span class="fala-txt">${esc(aviso(m) ? 'aviso do WhatsApp ou mídia que não chegou aqui' : ((t) => (t.length > (automatica(m) ? 90 : 420) ? `${t.slice(0, automatica(m) ? 88 : 418)}…` : t))(m.texto || `[${m.tipo || 'mídia'}]`))}</span><small>${dataHora(m.momento)}</small></div>`;
  function conversaCurta(id, n = 4) {
    const f = falasDe(id).slice(-n);
    if (!f.length) return `<p class="dim mesa-vazio">Sem conversa no WhatsApp ainda.</p>`;
    const ultima = falasDe(id).filter(conta).slice(-1)[0];
    const espera = ultima?.direcao === 'in' ? `<div class="selo amarelo mt-8">${icone('relogio')}Esperando a sua resposta há ${relativo(ultima.momento).replace(/^há /, '')}</div>` : '';
    return `<div class="mesa-conv">${f.map(fala).join('')}</div>${espera}`;
  }

  function blocoRevisao(d, texto = d.texto) {
    const r = revisar(texto, { passo: d.passo || 1, tipo: d.tipo, empresa: emp(d.empresa_id).nome, lote: [] });
    if (!r.itens.length) return `<div class="mesa-rev-ok mt-8">${icone('check')}<span>Revisor: nada a apontar · ${r.palavras} palavras</span></div>`;
    const itens = `<ul style="margin:6px 0 0;padding-left:18px">${r.itens.map((i) => `<li>${i.nivel === 'veto' ? '<b>Veto.</b> ' : ''}${esc(i.dica)}${i.trecho ? ` <span class="dim">«${esc(i.trecho)}»</span>` : ''}</li>`).join('')}</ul>`;
    const titulo = `Revisor: ${r.vetos ? `${r.vetos} veto${r.vetos > 1 ? 's' : ''}` : ''}${r.vetos && r.avisos ? ' e ' : ''}${r.avisos ? `${r.avisos} aviso${r.avisos > 1 ? 's' : ''}` : ''} · ${r.palavras} palavras`;
    if (r.vetos) return `<div class="aviso vermelho mt-8">${icone('alerta')}<div><b>${titulo}</b>${itens}</div></div>`;
    return `<details class="mesa-revisor mt-8"><summary>${icone('alerta')}<span>${titulo}</span></summary>${itens}</details>`;
  }
  function blocoPorque(d, esp) {
    const cr = (Array.isArray(d.revisao) ? d.revisao : []).find((x) => x.regra === 'critico');
    if (!d.raciocinio && !cr) return '';
    return `<p class="mesa-porque" title="Clique pra ler inteiro">${d.raciocinio ? `<b>Por que ${esc(esp?.nome || 'o agente')} escreveu assim:</b> ${esc(d.raciocinio)}` : ''}${cr ? `${d.raciocinio ? '<br>' : ''}<span class="dim">${esc(cr.dica)}</span>` : ''}</p>`;
  }

  /* Avatar do lead: iniciais num círculo com a cor da temperatura, e o ponto do estado do agente */
  const COR_TEMP = { quente: 'vermelho', morno: 'amarelo', frio: 'azul' };
  function avatar(a, g) {
    const e = emp(a.empresa_id);
    const t = convDe(a.empresa_id)?.analise?.temperatura || e.temperatura;
    return `<span class="mesa-av ${COR_TEMP[t] || 'cinza'}" aria-hidden="true">${esc(iniciais(e.nome))}<i class="mesa-ponto ${g}"></i></span>`;
  }
  /* Etiquetas: estado, temperatura e há quanto tempo o lead espera */
  /* Um vocabulário e uma cor por estado, na tela toda (02/10). Laranja = sua vez: aprovar, responder ou decidir (muda o verbo
     e o ícone, nunca a cor). Azul = o agente pensando. Violeta = agendada. Verde = enviada. Cinza = a bola está com o lead.
     Antes, "pronto pra aprovar" era verde, a cor de coisa concluída, e "pensando" era terracota, quase o laranja da ação. */
  const SUA_VEZ = ['pronto', 'voce', 'decidir'];
  const ESTADO = { pronto: ['laranja', 'check', 'Aprovar'], voce: ['laranja', 'comentario', 'Responder'], decidir: ['laranja', 'alerta', 'Decidir'], trabalhando: ['azul', 'ampulheta', 'Pensando'],
    esperando: ['cinza', 'relogio', 'Aguardando o lead'], encerrados: ['cinza', 'pausa', 'Parado'] };
  function etiquetas(a, g, { comEsp = true, comEstado = true } = {}) {
    const t = convDe(a.empresa_id)?.analise?.temperatura || emp(a.empresa_id).temperatura;
    const [ce, ie, re] = ESTADO[g];
    const ult = falasDe(a.empresa_id).filter(conta).slice(-1)[0];
    const esperaVoce = ult?.direcao === 'in' && g !== 'encerrados';
    const rotEnc = a.status === 'pausado' ? 'Pausado' : a.status === 'encerrado' ? 'Encerrado' : { geladeira: 'Geladeira', ganho: 'Ganho', perdido: 'Perdido' }[a.fase] || re;
    const esp = espDe(a);
    return `${esp && comEsp ? `<span class="selo esp-selo" title="Especialista: ${esc(esp.nome)} (${esc(esp.segmento)})"><img src="${rosto(esp.aparencia, esp.id)}" alt="" width="14" height="14">${esc(esp.nome)}</span>` : ''}${comEstado ? `<span class="selo ${ce}">${icone(ie)}${g === 'encerrados' ? rotEnc : re}</span>` : ''}
      ${t && COR_TEMP[t] ? `<span class="selo ${COR_TEMP[t]}">${icone('termometro')}${esc(t)}</span>` : ''}
      ${g !== 'encerrados' ? ((sd) => `<span class="selo ${ROTULO_SAUDE[sd.estado][0]}" title="${esc(sd.motivo)}">${icone('comentario')}${esc(ROTULO_SAUDE[sd.estado][1])}</span>`)(saudeDe(a)) : ''}
      ${esperaVoce ? `<span class="selo amarelo">${icone('relogio')}esperando você há ${esc(relativo(ult.momento).replace(/^há /, ''))}</span>` : ''}`;
  }
  /* O balão: a leitura atual do agente (o "momento" da última análise), senão a próxima jogada do plano */
  function balao(a) {
    const txt = convDe(a.empresa_id)?.analise?.momento || a.plano?.proxima_jogada;
    if (!txt) return '';
    return `<div class="mesa-balao"><span class="mesa-balao-ic">${icone('robo')}</span><p>${esc(txt.length > 240 ? `${txt.slice(0, 237)}…` : txt)}</p></div>`;
  }

  /* ------------------------------ a lista de leads (coluna da esquerda) ------------------------------ */
  const LISTA_FILTROS = [['todos', 'Todos'], ['voce', 'Sua vez'], ['agendadas', 'Agendadas'], ['esperando', 'Aguardando o lead'], ['trabalhando', 'Pensando'], ['encerrados', 'Parados']];
  const noFiltro = (g, f, a) => f === 'todos' || (f === 'voce' ? SUA_VEZ.includes(g) : f === 'agendadas' ? !!(a && emCurso(a.empresa_id).length) : g === f);
  const ORDEM_GRUPO = { pronto: 0, decidir: 1, voce: 2, trabalhando: 3, esperando: 4, encerrados: 5 };
  const ROT_LINHA = { pronto: ['laranja', 'Aprovar'], voce: ['laranja', 'Responder'], decidir: ['laranja', 'Decidir'], trabalhando: ['azul', 'Pensando'], esperando: ['cinza', 'Aguardando'], encerrados: ['cinza', 'Parado'] };

  function linhaLead(a, g) {
    const e = emp(a.empresa_id);
    const esp = espDe(a);
    const ult = falasDe(a.empresa_id).filter((m) => !aviso(m)).slice(-1)[0];
    const [cor, rot0] = ROT_LINHA[g];
    const rot = g === 'encerrados' && a.fase === 'geladeira' ? 'Geladeira' : rot0;
    const trecho = ult ? `${ult.direcao === 'out' ? 'Você: ' : automatica(ult) ? 'Automático: ' : ''}${ult.texto || '[mídia]'}` : (a.plano?.proxima_jogada || 'Sem conversa ainda');
    return `<li><button class="lead-linha ${sel === a.empresa_id ? 'on' : ''} ${g}" data-sel="${a.empresa_id}" aria-current="${sel === a.empresa_id}">
      ${avatar(a, g)}
      <span class="lead-meio"><span class="lead-topo"><b class="ellipsis">${esc(e.nome)}</b><small>${ult ? esc(relativo(ult.momento).replace(/^há /, '')) : ''}</small></span>
        <span class="lead-trecho">${esc(trecho.length > 90 ? `${trecho.slice(0, 88)}…` : trecho)}</span>
        <span class="lead-pe"><span class="selo mini ${cor}">${rot}</span>${emCurso(a.empresa_id).some((d) => d.status === 'agendado') ? `<span class="selo mini violeta" title="Mensagem agendada">${icone('agenda')}</span>` : ''}${((sd) => ['sem_resposta', 'baixa_probabilidade', 'desinteressado'].includes(sd.estado) && g !== 'encerrados' ? `<span class="selo mini ${ROTULO_SAUDE[sd.estado][0]}" title="${esc(sd.motivo)}">${esc(ROTULO_SAUDE[sd.estado][1])}</span>` : '')(saudeDe(a))}<span class="grow"></span>${esp ? `<span class="lead-esp"><img src="${rosto(esp.aparencia, esp.id)}" alt="" width="16" height="16">${esc(esp.nome)}</span>` : ''}</span></span>
    </button></li>`;
  }

  /* ------------------------------ o lead selecionado (coluna do meio) ------------------------------ */
  function fatosVerificados(d) {
    const ver = Array.isArray(d.verificacao) ? d.verificacao : [];
    if (!ver.length) return `<div class="aviso vermelho mt-8">${icone('alerta')}<div>Sem tabela de verificação. Não aprove sem conferir as frases.</div></div>`;
    return `<details class="fatos mt-8"><summary>${icone('check')}<span>${ver.length} fato${ver.length > 1 ? 's' : ''} conferido${ver.length > 1 ? 's' : ''}</span></summary>
      <ul>${ver.map((x) => `<li><b>${esc(x.frase || '')}</b><span class="dim"> · ${esc(x.fonte || '')}${x.como_conferiu || x.como ? ` · ${esc(x.como_conferiu || x.como)}` : ''}</span></li>`).join('')}</ul></details>`;
  }

  function cabecalhoLead(a, g) {
    const e = emp(a.empresa_id);
    const esp = espDe(a);
    const tel = convDe(a.empresa_id)?.telefone;
    const sub = [e.categoria, e.bairro || e.cidade].filter(Boolean).join(' · ');
    return `<div class="painel-cab">
      <div class="painel-lead">${avatar(a, g)}<div class="grow" style="min-width:0"><h3 class="ellipsis">${esc(e.nome)}</h3>
        <div class="dim ellipsis" style="font-size:12.5px">${tel ? `${esc(telefoneBonito(tel))} · ` : ''}${esc(sub)}</div>
        <div class="row wrap gap-6 mt-8">${etiquetas(a, g)}</div></div></div>
      ${esp ? `<div class="painel-esp"><img class="esp-rosto" src="${rosto(esp.aparencia, esp.id)}" alt="" width="40" height="40"><div><b>${esc(esp.nome)}</b><span>${esc(esp.segmento)}</span></div></div>` : ''}
    </div>
    <div class="painel-atalhos">
      ${convDe(a.empresa_id) ? `<a class="btn sm" href="#/conversas/${convDe(a.empresa_id).id}">${icone('whatsapp')}Conversa</a>` : ''}
      <button class="btn sm" data-abrir-agente="${a.empresa_id}">${icone('robo')}Memória do agente</button>
      <button class="btn sm" data-abrir-ficha="${a.empresa_id}">${icone('predio')}Ficha</button>
      <span class="grow"></span>
      <button class="btn icone sm fantasma" data-menu-ag="${a.empresa_id}" aria-label="Mais ações deste lead" title="Pausar, encerrar, pedir releitura">${icone('pontos')}</button>
    </div>`;
  }

  function porQue(a) {
    const momento = convDe(a.empresa_id)?.analise?.momento;
    const tese = a.plano?.tese;
    if (!momento && !tese) return '';
    return `<div class="painel-porque"><div class="painel-porque-ic">${icone('lampada')}</div><div class="grow">
      <b>Onde a conversa está</b>${momento ? `<p>${esc(momento)}</p>` : ''}
      ${tese ? `<details><summary>A tese pra este lead</summary><p>${esc(tese)}</p></details>` : ''}</div></div>`;
  }

  function painelLead(a, g) {
    if (!a) return `<div class="painel-vazio">${vazio('check', 'Nada selecionado', 'Escolha um lead na lista.')}</div>`;
    // Sua vez (aprovar, responder, decidir): o mesmo componente da gaveta de revisão, então decidir aqui ou no aviso é igual
    if (SUA_VEZ.includes(g)) return `<article class="painel card" data-ag="${a.empresa_id}">${cabecalhoLead(a, g)}${blocoEmCurso(a.empresa_id)}${revisao(a, g, 'painel')}${g === 'pronto' ? '' : caixaLivre(a.empresa_id)}</article>`;
    let miolo = '';
    const j = trabalhando(a.empresa_id);
    const fila = naFila(a.empresa_id);
    const travadas = pendentes(a.empresa_id).filter((d) => modoDe(d).como === 'travado');
    const fatos = [];
    if (g === 'trabalhando') fatos.push(['ampulheta', j ? (j.status === 'processando' ? `Pensando agora${j.progresso ? `: ${j.progresso}` : ''}` : `Na fila pra pensar${farejadorOnline() ? '' : ' (o Farejador está desligado)'}`) : 'O primeiro ciclo ainda não rodou']);
    fila.forEach((d) => fatos.push(['enviar', d.status === 'agendado' ? `${TIPO[d.tipo] || 'Mensagem'} aprovada, sai ${quando(d.agendado_para)}` : `${TIPO[d.tipo] || 'Mensagem'} aprovada`]));
    if (travadas.length) fatos.push(['cadeado', `${travadas.length > 1 ? `${travadas.length} mensagens prontas` : 'Mensagem pronta'} pra quando o lead responder (sai só depois da resposta)`]);
    if (g === 'esperando') { const sd = saudeDe(a); fatos.push(['comentario', `${ROTULO_SAUDE[sd.estado][1]}: ${sd.motivo}${sd.sugestao ? `. A régua sugere ${sd.sugestao}` : ''}`]); }
    if (a.proximo_ciclo_em) fatos.push(['agenda', `${a.fase === 'geladeira' ? 'Sai da geladeira' : 'O agente volta'} ${quando(a.proximo_ciclo_em)}${a.motivo_proximo ? `: ${a.motivo_proximo}` : ''}`]);
    if (a.status !== 'ativo') fatos.push(['pausa', a.status === 'pausado' ? 'Pausado por você' : 'Encerrado']);
    miolo = `
      <div class="painel-duas">
        <div class="painel-bloco"><div class="rotulo mb-8">${icone('whatsapp')} A conversa</div>${conversaCurta(a.empresa_id, 5)}</div>
        <div class="painel-bloco"><div class="rotulo mb-8">${icone('relogio')} Situação</div>
          <ul class="mesa-fatos">${fatos.map(([ic, t]) => `<li>${icone(ic)}<span>${esc(t)}</span></li>`).join('') || '<li class="dim">Nada pendente.</li>'}</ul>
          ${travadas.map((d) => `<div class="msg-sugerida mt-12">${esc(d.texto)}</div>`).join('')}</div>
      </div>
      ${caixaLivre(a.empresa_id)}
      <div class="row wrap gap-6 painel-pe">
        ${g === 'encerrados' ? `<button class="btn sm" data-a="reativar">${icone('play')}Reativar</button>` : `<button class="btn sm" data-a="pensar">${icone('atualizar')}Pedir pra pensar de novo</button>`}
      </div>`;
    return `<article class="painel card" data-ag="${a.empresa_id}">${cabecalhoLead(a, g)}${porQue(a)}${blocoEmCurso(a.empresa_id)}${miolo}</article>`;
  }

  /* Mensagens deste lead que já saíram da sua mão: agendada (reagendar/cancelar), na fila, enviando, falhou (tentar de novo) */
  function blocoEmCurso(id) {
    const l = emCurso(id);
    if (!l.length) return '';
    return `<div class="painel-emcurso"><div class="rotulo mb-8">${icone('enviar')} Mensagens a caminho</div>${l.map((d) => {
      const [cor, ic, rot] = estadoMsg(d);
      return `<div class="emcurso" data-disp="${d.id}"><span class="estado-msg ${cor}">${icone(ic)}${esc(rot)}</span>
        <span class="emcurso-txt" title="${esc(d.texto)}">${esc(d.texto.length > 120 ? `${d.texto.slice(0, 118)}…` : d.texto)}</span>
        <span class="emcurso-acoes">${['agendado', 'aprovado'].includes(d.status) ? `<button class="btn xs" data-a="reagendar">${icone('agenda')}Reagendar</button><button class="btn xs fantasma" data-a="desagendar" title="Volta pra aprovação">${icone('x')}Cancelar envio</button>` : ''}
          ${d.status === 'erro' ? `<button class="btn xs" data-a="reenviar">${icone('atualizar')}Tentar de novo</button>` : ''}</span></div>`;
    }).join('')}</div>`;
  }

  /* Caixa pra escrever direto pro lead (06/10, pedido do Marcelo): depois de aprovar o rascunho, o painel ficava sem
     onde escrever. Ela fica sempre ali quando há conversa, sai na hora pelo WhatsApp do Farejador e vai pro diário. */
  function caixaLivre(id) {
    if (!convDe(id)) return '';
    return `<div class="painel-escrever" data-escrever="${id}">
      <label class="rotulo mb-8" for="livre-${id}">${icone('whatsapp')} Escrever pro lead</label>
      <textarea class="txt" id="livre-${id}" data-livre rows="2" placeholder="Sua mensagem. Sai na hora pelo WhatsApp do Farejador. Ctrl+Enter envia."></textarea>
      <div data-revisao-livre></div>
      <div class="row gap-6 mt-8"><span class="dim" style="font-size:12.5px">O agente lê o que você mandou no próximo ciclo.</span><span class="grow"></span>
        <button class="btn prim sm" data-a="enviar-livre">${icone('enviar')}Enviar</button></div>
    </div>`;
  }
  function revisaoLivre(id, texto) {
    if (!texto.trim()) return '';
    const r = revisar(texto, { passo: 2, empresa: emp(id).nome, lote: [] });
    // Resposta a quem falou não precisa terminar em pergunta (aceitar a saída, combinar horário): esse aviso fica de fora
    const itens = r.itens.filter((i) => i.regra !== 'sem-pergunta');
    if (!itens.length) return `<div class="mesa-rev-ok mt-8">${icone('check')}<span>Revisor: nada a apontar · ${r.palavras} palavras</span></div>`;
    const lista = `<ul style="margin:6px 0 0;padding-left:18px">${itens.map((i) => `<li>${i.nivel === 'veto' ? '<b>Veto.</b> ' : ''}${esc(i.dica)}${i.trecho ? ` <span class="dim">«${esc(i.trecho)}»</span>` : ''}</li>`).join('')}</ul>`;
    return `<div class="aviso ${r.vetos ? 'vermelho' : 'laranja'} mt-8">${icone('alerta')}<div><b>Revisor · ${r.palavras} palavras</b>${lista}</div></div>`;
  }
  async function enviarLivre(empresaId, btn) {
    const caixa = btn.closest('[data-escrever]'), ta = caixa && $('[data-livre]', caixa);
    const texto = ta?.value.trim();
    if (!texto) { ta?.focus(); return; }
    const c = convDe(empresaId), e = emp(empresaId);
    if (!c) { toast('Este lead ainda não tem conversa no WhatsApp', 'erro'); return; }
    if (e.regulado && /garant|100%|cura|melhor d|resultado certo|antes e depois/i.test(texto)
      && !(await confirmar('Atenção: setor regulado', `${e.conselho || 'O conselho'} proíbe promessa de resultado, superlativo e antes/depois. Enviar mesmo assim?`, { rotulo: 'Enviar mesmo assim', perigo: true }))) return;
    if (revisar(texto, { passo: 2, empresa: e.nome, lote: [] }).vetos
      && !(await confirmar('O revisor tem veto nesta mensagem', 'Leia os pontos em vermelho embaixo da caixa. Enviar mesmo assim?', { rotulo: 'Enviar mesmo assim', perigo: true }))) return;
    if (estado.farejador?.whatsapp_status !== 'conectado' || !farejadorOnline()) {
      if (!(await confirmar('WhatsApp não está conectado', 'A mensagem vai pra fila e sai quando o Farejador conectar.', { rotulo: 'Deixar na fila' }))) return;
    }
    botaoCarregando(btn, true);
    try {
      const { data: msg, error } = await sb.from('whatsapp_mensagens').insert({ conversa_id: c.id, direcao: 'out', texto, status: 'fila', enviado_por: quem() }).select().single();
      if (error) throw error;
      await criarJob('whatsapp_enviar', { mensagem_id: msg.id, texto, telefone: c.telefone, jid: c.jid }, { conversa_id: c.id, empresa_id: empresaId }, 1);
      await diario(empresaId, `Marcelo escreveu direto pro lead: «${texto}»`, 'nota');
      ta.value = ''; ta.defaultValue = '';
      toast(farejadorOnline() ? `Enviada pra ${e.nome} pelo WhatsApp` : 'Na fila: sai quando o Farejador ligar', 'info');
      sel = empresaId; carregar(true);
    } catch (err) { toast(erroAmigavel(err), 'erro'); }
    botaoCarregando(btn, false);
  }

  /* ------------------------------ a revisão (02/10) ------------------------------
     Pedido do Marcelo: abrir o aviso de um agente e resolver ali, sem caçar a mensagem na aba do especialista, e ficar
     óbvio o que está sendo aprovado. Um componente só, usado no painel do lead e na gaveta que abre de qualquer aviso.
     A mensagem proposta aparece como a PRÓXIMA fala da conversa, tracejada (ainda não existe), com o rosto de quem
     escreveu e "ainda não saiu". Editar é no próprio balão. Rejeitar e refazer pedem o motivo ali mesmo, sem modal. */
  function fio(id, n) {
    const todas = falasDe(id);
    if (!todas.length) return `<p class="dim rev-sem-conversa">Sem conversa no WhatsApp ainda.</p>`;
    const f = todas.slice(-n), antes = todas.length - f.length;
    return `${antes ? `<button class="rev-mais" data-a="fio-mais">${icone('chevb')}Ver ${antes === 1 ? 'a fala anterior' : `as ${antes} falas anteriores`}</button>` : ''}<div class="mesa-conv">${f.map(fala).join('')}</div>`;
  }
  function rascunho(d, ops, i, esp) {
    const varias = ops.length > 1;
    return `<div class="rev-rascunho" data-id="${d.id}" data-op="${i}" ${i ? 'hidden' : ''}>
      <div class="rev-rascunho-cab">${esp ? `<img src="${rosto(esp.aparencia, esp.id)}" alt="" width="24" height="24">` : `<span class="rev-rob">${icone('robo')}</span>`}
        <b>Rascunho ${esp ? `${doDa(esp)} ${esc(esp.nome)}` : 'do agente'}</b><span class="selo mini cinza">${esc(TIPO[d.tipo] || `Passo ${d.passo}`)}</span>
        ${varias ? `<span class="selo mini laranja">Opção ${esc(d.variante || 'ABC'[i])}</span>` : ''}${d.angulo ? `<span class="rev-angulo">${esc(d.angulo)}</span>` : ''}
        <span class="selo mini violeta rev-editada" hidden>${icone('editar')}editada por você</span></div>
      <textarea class="rev-bolha" data-texto readonly rows="2" aria-label="Texto da mensagem proposta (clique pra editar)">${esc(d.texto)}</textarea>
      <div class="rev-rascunho-pe"><span class="rev-nao-saiu">${icone('relogio')}Ainda não saiu: espera o seu clique</span><span class="grow"></span>
        <button class="btn xs fantasma" data-a="desfazer-edicao" hidden>${icone('atualizar')}Desfazer edição</button>
        <button class="btn xs" data-a="editar">${icone('editar')}Editar</button></div>
      ${blocoPorque(d, esp)}
      <div data-revisao>${blocoRevisao(d)}</div>
      ${fatosVerificados(d)}
    </div>`;
  }
  /* modo: 'painel' (conversa à esquerda, proposta à direita), 'gaveta' (empilhado) ou 'pop' (só a proposta, dentro do
     balão do especialista: editar e aprovar ali mesmo, pedido do Marcelo em 02/10) */
  function revisao(a, g, modo = 'painel') {
    const id = a.empresa_id, esp = espDe(a), nome = esp?.nome || 'O agente';
    const kbd = (k) => (modo === 'gaveta' ? `<kbd>${k}</kbd>` : '');
    const momento = convDe(id)?.analise?.momento, tese = a.plano?.tese;
    const ctx = [
      momento && `<div class="rev-ctx"><span class="rev-ctx-ic">${icone('lampada')}</span><div><b>Onde a conversa está</b><p class="rev-clamp" title="Clique pra ler inteiro">${esc(momento)}</p></div></div>`,
      tese && `<details class="rev-ctx rev-tese"><summary><span class="rev-ctx-ic">${icone('alvo')}</span><b>A tese pra este lead</b></summary><p>${esc(tese)}</p></details>`,
    ].filter(Boolean).join('');
    const conversa = `<div class="rev-fio" data-fio="${id}">${fio(id, modo === 'painel' ? 6 : 3)}</div>`;
    let proposta = '', pe = '';
    if (g === 'pronto') {
      const ops = pendentes(id).filter((d) => modoDe(d).como !== 'travado');
      const d0 = ops[0];
      proposta = `${modo === 'pop' ? '' : `<div class="rev-entra"><span>${!convDe(id) ? 'A primeira mensagem, se você aprovar' : modo === 'painel' ? 'A próxima mensagem da conversa, se você aprovar' : 'Entra aqui na conversa se você aprovar'}</span></div>`}
        ${a.precisa_de_voce ? `<div class="aviso laranja rev-antes">${icone('alerta')}<div><b>Antes de aprovar:</b> ${esc(a.precisa_de_voce)}</div></div>` : ''}
        ${ops.length > 1 ? `<div class="mesa-abas rev-abas" role="tablist" aria-label="Opções de mensagem">${ops.map((d, i) => `<button role="tab" class="${i ? '' : 'on'}" aria-selected="${!i}" data-aba-op="${i}" title="${esc(d.angulo || '')}"><b>${esc(d.variante || 'ABC'[i])}</b><span>${esc(d.angulo || `Opção ${d.variante || 'ABC'[i]}`)}</span></button>`).join('')}</div>` : ''}
        ${ops.map((d, i) => rascunho(d, ops, i, esp)).join('')}`;
      pe = `<button class="btn sm fantasma" data-a="rejeitar" title="Nada sai, e ${art(esp)} ${esc(nome)} guarda o motivo">${icone('x')}Rejeitar</button>
        <button class="btn sm" data-a="refazer" title="${esc(nome)} escreve outra versão, lendo o que você pedir">${icone('atualizar')}Refazer</button>
        <span class="grow"></span>
        <button class="btn" data-a="agendar" title="Escolher dia e hora pra esta mensagem sair">${icone('agenda')}Agendar…</button>
        <button class="btn prim" data-a="aprovar">${icone(modoDe(d0).como === 'agora' ? 'enviar' : 'check')}${esc(rotuloAprovar(d0))}${kbd('A')}</button>`;
    } else if (g === 'voce') {
      proposta = `<div class="rev-pedido"><span class="rev-ctx-ic laranja">${icone('comentario')}</span><div><b>${esc(nome)} precisa de você</b><p>${esc(a.precisa_de_voce || '')}</p></div></div>
        <label class="rotulo-campo rev-resposta"><b>Sua resposta ${art(esp) === 'o' ? 'ao' : 'à'} ${esc(nome)}</b>
          <textarea class="txt" data-resposta rows="3" placeholder="O que você viu ou decidiu. Ex.: a mensagem das 17h07 era um áudio perguntando o preço."></textarea>
          <span class="dim">Vai pra memória ${doDa(esp)} ${esc(nome)}, que pensa de novo. Nada sai pro lead.</span></label>`;
      pe = `<button class="btn sm fantasma" data-a="resolvido" title="Fecha o pedido sem mandar nada">${icone('check')}Já resolvi</button><span class="grow"></span>
        <button class="btn prim" data-a="responder">${icone('enviar')}Mandar ${art(esp) === 'o' ? 'pro' : 'pra'} ${esc(nome)}${kbd('Ctrl+Enter')}</button>`;
    } else {
      const r = a.recomendacao || {}, sx = r.sinais || {};
      const nomeTipo = { geladeira: 'pôr na geladeira', perdido: 'encerrar como perdido', ganho: 'marcar como ganho' }[r.tipo] || 'parar por agora';
      const volta = (r.voltar_em ? new Date(r.voltar_em) : new Date(Date.now() + 45 * 864e5)).toLocaleDateString('en-CA', { timeZone: 'America/Bahia' });
      const sinais = [
        sx.tentativas_sem_resposta != null && `${sx.tentativas_sem_resposta} tentativa${sx.tentativas_sem_resposta === 1 ? '' : 's'} sem resposta`,
        sx.dias_sem_resposta && `${sx.dias_sem_resposta} dias de silêncio`,
        sx.dias_desde_ultima_fala_humana == null ? 'nunca falou como pessoa' : `última fala humana há ${sx.dias_desde_ultima_fala_humana} dias`,
        sx.so_robo_respondeu && 'só o robô do WhatsApp respondeu',
        sx.recusou && 'recusa clara na última fala',
      ].filter(Boolean);
      proposta = `<div class="painel-recomenda"><span class="painel-porque-ic vermelho">${icone('alerta')}</span><div class="grow">
          <b>${esc(nome)} recomenda ${esc(nomeTipo)}</b><p>${esc(r.resumo || '')}</p>
          ${sinais.length ? `<ul class="rec-sinais">${sinais.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}</div></div>
        ${r.tipo === 'geladeira' || !r.tipo ? `<label class="rotulo-campo">Voltar a tentar em <input class="inp" type="date" data-rec-data value="${volta}" min="${hojeBahia()}"></label>` : ''}
        <p class="dim" style="font-size:12.5px">Nada é apagado: memória, conversa e diário ficam. Na geladeira, ${esc(nome)} volta sozinh${art(esp)} na data e relê tudo antes de escrever.</p>`;
      pe = `<button class="btn sm fantasma" data-a="rec-continuar">${icone('play')}Continuar acompanhando</button>
        ${r.tipo !== 'perdido' ? `<button class="btn sm" data-a="rec-perdido">${icone('x')}Encerrar como perdido</button>` : ''}<span class="grow"></span>
        <button class="btn prim" data-a="rec-aprovar">${icone('check')}${r.tipo === 'perdido' ? 'Encerrar como perdido' : r.tipo === 'ganho' ? 'Marcar como ganho' : 'Pôr na geladeira'}</button>`;
    }
    const corpo = modo === 'pop' ? `<div class="rev-proposta">${proposta}</div>`
      : `<div class="rev-conversa">${conversa}</div><div class="rev-proposta">${proposta}</div>${ctx ? `<div class="rev-contexto">${ctx}</div>` : ''}`;
    return `<div class="rev rev-${modo}" data-rev="${id}" data-g="${g}">
      <div class="rev-corpo">${corpo}</div>
      <div class="rev-motivo" hidden></div>
      <div class="rev-pe">${pe}</div></div>`;
  }

  /* O balão da mensagem cresce com o texto (nada de rolagem dentro de uma mensagem de WhatsApp) */
  function ajustar(ta) { if (!ta || !ta.offsetParent) return; ta.style.height = 'auto'; ta.style.height = `${ta.scrollHeight + 2}px`; }
  const revisarDepois = debounce((ta) => {
    const box = ta.closest('[data-id]'); const d = box && disp.find((x) => x.id === box.dataset.id);
    const alvo = box && $('[data-revisao]', box);
    if (d && alvo) alvo.innerHTML = blocoRevisao(d, ta.value);
  }, 250);
  const revisarLivreDepois = debounce((ta) => {
    const caixa = ta.closest('[data-escrever]'), alvo = caixa && $('[data-revisao-livre]', caixa);
    if (alvo) alvo.innerHTML = revisaoLivre(caixa.dataset.escrever, ta.value);
  }, 250);
  function aoDigitar(ev) {
    const livre = ev.target.closest?.('[data-livre]');
    if (livre) { ajustar(livre); revisarLivreDepois(livre); return; }
    const ta = ev.target.closest?.('[data-texto]'); if (!ta) return;
    ajustar(ta);
    const box = ta.closest('.rev-rascunho');
    if (box) { const mudou = umaLinha(ta.value) !== umaLinha(ta.defaultValue); $('.rev-editada', box).hidden = !mudou; $('[data-a="desfazer-edicao"]', box).hidden = !mudou; }
    revisarDepois(ta);
  }
  function editar(box) {
    if (!box) return;
    const ta = $('[data-texto]', box);
    ta.readOnly = false; box.classList.add('editando');
    ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length);
    $('[data-a="editar"]', box).hidden = true;
  }
  function trocarOpcao(aba) {
    const raiz = aba.closest('[data-rev]'); if (!raiz) return;
    $$('[data-aba-op]', raiz).forEach((x) => { const on = x === aba; x.classList.toggle('on', on); x.setAttribute('aria-selected', on); });
    $$('.rev-rascunho', raiz).forEach((x) => { x.hidden = x.dataset.op !== aba.dataset.abaOp; });
    $$('.rev-rascunho:not([hidden]) [data-texto]', raiz).forEach(ajustar);
  }
  /* Rejeitar e refazer: o motivo é pedido ali mesmo, no lugar dos botões */
  function abrirMotivo(raiz, tipo) {
    const esp = espDe(ags.find((a) => a.empresa_id === raiz.dataset.rev)), nome = esp?.nome || 'o agente';
    const T = {
      rejeitar: ['Por que não mandar?', `Nada sai. ${esp ? `${art(esp) === 'o' ? 'O' : 'A'} ${esc(nome)}` : 'O agente'} guarda o motivo e só escreve de novo quando o lead falar ou a data chegar.`, 'Ex.: a assistente virtual já faz esse retorno.', 'Rejeitar a mensagem', 'x', 'perigo'],
      refazer: ['O que mudar?', `A proposta sai e ${art(esp)} ${esc(nome)} escreve outra lendo o que você pedir. Ela volta pra cá quando ficar pronta.`, 'Ex.: está longa, falou de preço, ela já disse que tem agência.', 'Pedir outra versão', 'atualizar', 'prim'],
    }[tipo];
    const box = $('.rev-motivo', raiz);
    box.innerHTML = `<label class="rotulo-campo"><span><b>${T[0]}</b> <span class="dim">Opcional, mas ensina o agente.</span></span>
        <textarea class="txt" data-motivo rows="2" placeholder="${esc(T[2])}"></textarea></label>
      <p class="dim rev-motivo-txt">${T[1]}</p>
      ${esp ? `<label class="check"><input type="checkbox" data-nicho> Vale pro nicho todo: ${art(esp)} ${esc(esp.nome)} ensina a todo agente de ${esc(esp.segmento.toLowerCase())}</label>` : ''}
      <div class="row gap-6"><span class="grow"></span><button class="btn sm fantasma" data-a="motivo-voltar">Voltar</button><button class="btn sm ${T[5]}" data-a="motivo-ok" data-tipo="${tipo}">${icone(T[4])}${T[3]}</button></div>`;
    box.hidden = false; $('.rev-pe', raiz).hidden = true;
    $('[data-motivo]', box).focus();
  }

  /* As ações da revisão, iguais no painel e na gaveta. Devolve true quando algo mudou de verdade (aí a tela recarrega
     e a gaveta passa pro próximo). */
  async function acaoRevisao(b, raiz) {
    const id = raiz.dataset.rev, acao = b.dataset.a;
    const vis = $('.rev-rascunho:not([hidden])', raiz);
    if (acao === 'editar') { editar(b.closest('.rev-rascunho')); return false; }
    if (acao === 'desfazer-edicao') {
      const box = b.closest('.rev-rascunho'), ta = $('[data-texto]', box);
      ta.value = ta.defaultValue; ta.readOnly = true; box.classList.remove('editando'); $('[data-a="editar"]', box).hidden = false;
      aoDigitar({ target: ta }); return false;
    }
    if (acao === 'fio-mais') { const f = $('[data-fio]', raiz); f.innerHTML = fio(id, 60); return false; }
    if (acao === 'rejeitar' || acao === 'refazer') { abrirMotivo(raiz, acao); return false; }
    if (acao === 'motivo-voltar') { $('.rev-motivo', raiz).hidden = true; $('.rev-pe', raiz).hidden = false; return false; }
    if (acao === 'motivo-ok') {
      const r = { texto: $('[data-motivo]', raiz).value.trim(), nicho: !!$('[data-nicho]', raiz)?.checked };
      botaoCarregando(b, true);
      const ok = b.dataset.tipo === 'refazer' ? await outraOpcao(id, r) : await naoMandar(id, r);
      if (!ok) botaoCarregando(b, false);
      return ok;
    }
    if (acao === 'aprovar' || acao === 'agendar') {
      const d = disp.find((x) => x.id === vis?.dataset.id); if (!d) return false;
      const texto = umaLinha($('[data-texto]', vis).value);
      if (!texto) { toast('A mensagem está vazia. Escreva ou desfaça a edição.', 'erro'); return false; }
      if (acao === 'aprovar') return aprovar(d, texto, b);
      const h = await escolherHorario({ titulo: 'Agendar esta mensagem', subtitulo: `${emp(d.empresa_id).nome}. Ela fica aprovada e sai sozinha no dia e na hora, pelo WhatsApp conectado.` });
      return h ? aprovar(d, texto, b, h) : false;
    }
    if (acao === 'responder') return responderAgente(id, $('[data-resposta]', raiz).value.trim(), b);
    if (acao === 'resolvido') {
      await sb.from('agentes').update({ precisa_de_voce: null, fase: 'esperando_lead' }).eq('empresa_id', id);
      await diario(id, 'Marcelo marcou o pedido como resolvido'); toast('Resolvido'); return true;
    }
    if (acao === 'rec-aprovar' || acao === 'rec-perdido') return decidirRecomendacao(id, acao === 'rec-perdido' ? 'perdido' : null, raiz);
    if (acao === 'rec-continuar') return continuarAcompanhando(id);
    return false;
  }

  /* "Aprovar e enviar" de resposta a quem falou sai na hora: 5 segundos pra desfazer antes de ir pro WhatsApp */
  function contagem(btn, seg = 5) {
    return new Promise((resolve) => {
      const orig = btn.innerHTML, acao = btn.dataset.a; let n = seg;
      btn.dataset.a = 'contando'; btn.classList.add('contando'); btn.style.setProperty('--dur', `${seg}s`);
      const pinta = () => { btn.innerHTML = `${icone('x')}Desfazer · sai em ${n}s`; };
      const fim = (ok) => { clearInterval(t); btn.removeEventListener('click', parar, true); btn.dataset.a = acao; btn.classList.remove('contando'); btn.innerHTML = orig; resolve(ok); };
      const parar = (e) => { e.stopPropagation(); e.preventDefault(); fim(false); toast('Desfeito. Nada saiu.', 'info'); };
      btn.addEventListener('click', parar, true);
      pinta();
      const t = setInterval(() => { n -= 1; if (n <= 0) fim(true); else pinta(); }, 1000);
    });
  }

  /* A gaveta de revisão: abre de qualquer aviso (sino, balão do especialista, cartão, faixa "sua vez") por cima da
     Mesa, mostra uma decisão por vez e passa pra próxima sozinha. Setas ou J/K navegam; A aprova; E edita; Esc fecha. */
  let gav = null;
  function filaSuaVez(gm = new Map(ags.map((a) => [a.empresa_id, grupoDe(a)]))) {
    return ordenar(ags, gm).filter((a) => SUA_VEZ.includes(gm.get(a.empresa_id)));
  }
  function abrirRevisao(empresaId, dir = 0) {
    $$('.demandas-pop').forEach((x) => x.remove());
    const a = ags.find((x) => x.empresa_id === empresaId);
    if (!a) return;
    const g = grupoDe(a);
    if (!SUA_VEZ.includes(g)) {
      toast(`${emp(empresaId).nome}: nada esperando você agora (${ESTADO[g][2].toLowerCase()}).`, 'info');
      gav?.fechar();
      return irAoLead(empresaId, true);
    }
    if (!gav) {
      const gv = gaveta({ aoFechar: () => { document.removeEventListener('keydown', teclas); gav = null; } });
      gv.el.classList.add('gaveta-rev'); gv.el.setAttribute('aria-label', 'Revisão do que os agentes propõem');
      const veu = gv.el.previousElementSibling; if (veu) veu.onclick = () => tentarFechar();
      gv.el.addEventListener('click', cliqueGaveta);
      gv.el.addEventListener('input', aoDigitar);
      document.addEventListener('keydown', teclas);
      gav = gv;
    }
    gav.id = empresaId;
    pintarGaveta(dir);
  }
  function cabGaveta(a, g, i, total) {
    const e = emp(a.empresa_id), esp = espDe(a);
    const ops = g === 'pronto' ? pendentes(a.empresa_id).filter((d) => modoDe(d).como !== 'travado') : [];
    const oque = g === 'pronto' ? `${ops.length > 1 ? `${ops.length} opções de ${(TIPO[ops[0].tipo] || 'mensagem').toLowerCase()}` : `${(TIPO[ops[0]?.tipo] || 'mensagem').toLowerCase()}`} pra você aprovar`
      : g === 'voce' ? 'uma pergunta pra você' : 'uma recomendação de parar';
    return `<div class="rev-cab">
        ${esp ? `<img class="rev-rosto" src="${rosto(esp.aparencia, esp.id)}" alt="" width="46" height="46">` : `<span class="rev-rosto">${icone('robo')}</span>`}
        <div class="grow" style="min-width:0"><div class="rev-quem"><b>${esc(esp?.nome || 'O agente')}</b> ${g === 'pronto' ? 'preparou' : 'tem'} ${esc(oque)}</div>
          <h2 class="ellipsis">${esc(e.nome)}</h2></div>
        <div class="rev-nav">${total > 1 ? `<span class="rev-pos">${i + 1} de ${total}</span>
          <button class="btn icone sm fantasma" data-nav="-1" aria-label="Anterior (seta pra esquerda)">${icone('cheve')}</button>
          <button class="btn icone sm fantasma" data-nav="1" aria-label="Próxima (seta pra direita)">${icone('chevd')}</button>` : ''}
          <button class="btn icone sm fantasma" data-fechar-rev aria-label="Fechar (Esc)">${icone('x')}</button></div></div>
      <div class="rev-selos">${etiquetas(a, g, { comEsp: false, comEstado: false })}</div>
      <div class="rev-atalhos">${convDe(a.empresa_id) ? `<a class="btn xs" href="#/conversas/${convDe(a.empresa_id).id}">${icone('whatsapp')}Conversa inteira</a>` : ''}
        <button class="btn xs" data-abrir-agente="${a.empresa_id}">${icone('robo')}Memória do agente</button>
        <button class="btn xs" data-abrir-ficha="${a.empresa_id}">${icone('predio')}Ficha</button>
        <span class="grow"></span><span class="rev-teclas" aria-hidden="true"><kbd>←</kbd><kbd>→</kbd> navegar · <kbd>E</kbd> editar · <kbd>Esc</kbd> fechar</span></div>`;
  }
  function pintarGaveta(dir = 0) {
    if (!gav) return;
    const fila = filaSuaVez();
    const a = ags.find((x) => x.empresa_id === gav.id);
    const g = a && grupoDe(a);
    if (!a || !SUA_VEZ.includes(g)) {
      gav.cab.innerHTML = `<div class="rev-cab"><div class="grow"><h2>Sua vez</h2></div><div class="rev-nav"><button class="btn icone sm fantasma" data-fechar-rev aria-label="Fechar (Esc)">${icone('x')}</button></div></div>`;
      gav.corpo.innerHTML = `<div class="rev-fim">${icone('checkc')}<h3>Tudo em dia</h3><p>Nada mais esperando você. Os agentes avisam no sino e na Mesa quando tiverem algo.</p><button class="btn" data-fechar-rev>Voltar pra Mesa</button></div>`;
      return;
    }
    const i = fila.findIndex((x) => x.empresa_id === gav.id);
    gav.cab.innerHTML = cabGaveta(a, g, i, fila.length);
    gav.corpo.innerHTML = revisao(a, g, 'gaveta');
    const raiz = $('.rev', gav.corpo);
    if (dir) raiz.classList.add(dir < 0 ? 'vem-esq' : 'vem-dir');
    $$('.rev-rascunho:not([hidden]) [data-texto]', raiz).forEach(ajustar);
    // A mensagem proposta à vista logo de cara, com um pedaço da conversa acima dela
    const alvo = $('.rev-rascunho:not([hidden])', raiz) || $('[data-resposta]', raiz);
    gav.corpo.scrollTop = 0;
    if (alvo) gav.corpo.scrollTop = Math.max(0, alvo.getBoundingClientRect().top - gav.corpo.getBoundingClientRect().top - 150);
  }
  const mudouAlgo = () => !!gav && $$('textarea', gav.corpo).some((t) => (t.dataset.texto !== undefined ? umaLinha(t.value) !== umaLinha(t.defaultValue) : t.value.trim()));
  async function tentarFechar() {
    if (!gav) return;
    if (mudouAlgo() && !(await confirmar('Fechar sem decidir?', 'O que você escreveu aqui ainda não foi aprovado nem mandado e vai se perder.', { rotulo: 'Fechar' }))) return;
    gav?.fechar();
  }
  async function navegar(dir) {
    const fila = filaSuaVez(); if (fila.length < 2 || !gav) return;
    if (mudouAlgo() && !(await confirmar('Ir pro próximo?', 'O que você escreveu aqui ainda não foi aprovado e vai se perder.', { rotulo: 'Ir mesmo assim' }))) return;
    const i = fila.findIndex((x) => x.empresa_id === gav.id);
    gav.id = fila[(i + dir + fila.length) % fila.length].empresa_id;
    pintarGaveta(dir);
  }
  async function cliqueGaveta(ev) {
    if (ev.target.closest('[data-fechar-rev]')) return tentarFechar();
    const nv = ev.target.closest('[data-nav]'); if (nv) return navegar(Number(nv.dataset.nav));
    const fi = ev.target.closest('[data-abrir-ficha]'); if (fi) return (await import('../ficha.js')).abrirFicha(fi.dataset.abrirFicha);
    const ab = ev.target.closest('[data-abrir-agente]'); if (ab) return abrirAgente(ab.dataset.abrirAgente);
    if (ev.target.closest('a[href]')) { gav?.fechar(); return; }
    const aba = ev.target.closest('[data-aba-op]'); if (aba) return trocarOpcao(aba);
    const pq = ev.target.closest('.mesa-porque, .rev-clamp'); if (pq) { pq.classList.toggle('aberto'); return; }
    const bolha = ev.target.closest('.rev-bolha[readonly]'); if (bolha) return editar(bolha.closest('.rev-rascunho'));
    const b = ev.target.closest('[data-a]'); if (!b) return;
    const raiz = b.closest('[data-rev]'); if (!raiz) return;
    const antes = filaSuaVez().map((x) => x.empresa_id), idx = antes.indexOf(raiz.dataset.rev);
    if (!(await acaoRevisao(b, raiz))) return;
    raiz.classList.add('saindo');
    await carregar(true);
    if (!gav) return;
    // Passa pro próximo da fila (o que vinha depois deste), sem voltar no que acabou de ser decidido
    const agora = new Set(filaSuaVez().map((x) => x.empresa_id));
    const prox = [...antes.slice(idx + 1), ...antes.slice(0, Math.max(0, idx))].find((x) => agora.has(x)) || [...agora].find((x) => x !== raiz.dataset.rev);
    gav.id = prox || null;
    pintarGaveta(1);
  }
  function teclas(ev) {
    if (!gav || $('.modal.on') || $('.menu-pop')) return;
    const el = document.activeElement;
    const digitando = /^(TEXTAREA|INPUT|SELECT)$/.test(el?.tagName) && !el.readOnly;
    if (ev.key === 'Escape') { ev.preventDefault(); if (digitando) el.blur(); else tentarFechar(); return; }
    if (digitando) {
      if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey)) { ev.preventDefault(); $('.rev-motivo:not([hidden]) [data-a="motivo-ok"], .rev-pe:not([hidden]) [data-a="aprovar"], .rev-pe:not([hidden]) [data-a="responder"]', gav.corpo)?.click(); }
      return;
    }
    if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
    const k = ev.key.toLowerCase();
    if (k === 'a') $('.rev-pe:not([hidden]) [data-a="aprovar"]', gav.corpo)?.click();
    else if (k === 'e') editar($('.rev-rascunho:not([hidden])', gav.corpo));
    else if (k === 'arrowright' || k === 'j') navegar(1);
    else if (k === 'arrowleft' || k === 'k') navegar(-1);
    else return;
    ev.preventDefault();
  }

  /* A faixa "sua vez", acima da cena: quantas decisões esperam você, de quem, há quanto tempo, e o botão que abre a revisão */
  function desdeQuando(a) {
    const p = pendentes(a.empresa_id);
    return p.length ? Math.min(...p.map((d) => new Date(d.criado_em).getTime())) : new Date(a.atualizado_em || Date.now()).getTime();
  }
  function faixaSuaVez(gm) {
    const f = filaSuaVez(gm), pensando = [...gm.values()].filter((g) => g === 'trabalhando').length;
    const vivo = pensando ? `<span class="sv-pensando" title="Lendo a conversa, pesquisando ou escrevendo agora"><i></i>${pensando} ${pensando > 1 ? 'agentes pensando' : 'agente pensando'} agora</span>` : '';
    if (!f.length) return `<section class="sua-vez zero">${icone('checkc')}<div class="grow"><b>Tudo em dia</b><span>Nada esperando você. Os agentes avisam aqui e no sino quando tiverem algo.</span></div>${vivo}</section>`;
    const n = (k) => f.filter((a) => gm.get(a.empresa_id) === k).length;
    const partes = [n('pronto') && `${n('pronto')} ${n('pronto') > 1 ? 'mensagens' : 'mensagem'} pra aprovar`, n('voce') && `${n('voce')} pra responder`, n('decidir') && `${n('decidir')} pra decidir`].filter(Boolean);
    const rostos = [...new Map(f.map(espDe).filter(Boolean).map((e) => [e.id, e])).values()];
    const desde = Math.min(...f.map(desdeQuando));
    return `<section class="sua-vez">
      <div class="sv-rostos">${rostos.map((e) => `<img src="${rosto(e.aparencia, e.id)}" alt="${esc(e.nome)}" title="${esc(e.nome)}" width="38" height="38">`).join('')}</div>
      <div class="grow"><b><span class="sv-n">${f.length}</span> ${f.length > 1 ? 'decisões esperando você' : 'decisão esperando você'}</b>
        <span>${esc(partes.join(' · '))}${Number.isFinite(desde) ? ` · a mais antiga ${esc(relativo(new Date(desde)))}` : ''}</span></div>
      ${vivo}
      <button class="btn prim" data-revisar-fila>${icone('check')}Revisar agora</button></section>`;
  }

  /* ------------------------------ especialistas (Fase 3) ------------------------------ */
  const espDe = (a) => esps.find((e) => e.id === a?.especialista_id) || null;
  // "a Clara", "o Rafa": o artigo vem da aparência do especialista
  const art = (esp) => (esp?.aparencia?.genero === 'm' ? 'o' : 'a');
  const doDa = (esp) => (esp?.aparencia?.genero === 'm' ? 'do' : 'da');
  const leadsDe = (esp) => ags.filter((a) => a.especialista_id === esp.id);
  // "Clínica Cintya Gualberto - Estética" → "Cintya", "Land Car Oficina Técnica" → "Land Car"
  function curto(nome) {
    const n = String(nome || '').replace(/^(cl[ií]nica|espa[çc]o de eventos|consult[óo]rio|oficina)\s+(odonto\.?\s+)?/i, '').split(/\s+-\s+/)[0].trim();
    const w = n.split(/\s+/);
    return w[0].length <= 4 && w[1] ? `${w[0]} ${w[1]}` : w[0];
  }
  const lista3 = (nomes) => (nomes.length <= 2 ? nomes.join(' e ') : `${nomes.slice(0, 2).join(', ')} e mais ${nomes.length - 2}`);
  /* Placar casa × curiosidade de um conjunto de leads (primeira mensagem, gente respondeu) */
  function placar(ids) {
    const p = { casa: { enviados: 0, responderam: 0 }, curiosidade: { enviados: 0, responderam: 0 } };
    for (const [emp, x] of taxa.porEmpresa) if (!ids || ids.includes(emp)) { const f = p[x.formato] || p.casa; f.enviados++; if (x.respondeu) f.responderam++; }
    return p;
  }
  /* O estado do especialista é o do lead mais urgente dele: o boneco mostra o que precisa de você primeiro */
  function estadoEsp(esp, grupoDeLead) {
    const leads = leadsDe(esp).filter((a) => a.status === 'ativo');
    const g = (k) => leads.filter((a) => grupoDeLead.get(a.empresa_id) === k);
    const nomes = (l) => l.map((a) => curto(emp(a.empresa_id).nome));
    const recente = reunioes.find((r) => leads.some((a) => a.empresa_id === r.empresa_id) && new Date(r.inicio) > new Date() && Date.now() - new Date(r.criado_em) < 3 * 864e5);
    const suaVez = [...g('pronto'), ...g('voce')];
    if (suaVez.length) return [g('pronto').length ? 'pronto' : 'voce', `${suaVez.length} ${suaVez.length > 1 ? 'leads esperando' : 'lead esperando'} você: ${lista3(nomes(suaVez))}`];
    if (g('trabalhando').length) return ['trabalhando', `Escrevendo pra ${lista3(nomes(g('trabalhando')))}…`];
    if (recente) return ['comemorando', `Reunião marcada com ${curto(emp(recente.empresa_id).nome)}!`];
    if (g('esperando').length) {
      const prox = g('esperando').filter((a) => a.proximo_ciclo_em).sort((x, y) => new Date(x.proximo_ciclo_em) - new Date(y.proximo_ciclo_em))[0];
      return ['esperando', `Esperando ${g('esperando').length} lead${g('esperando').length > 1 ? 's' : ''}${prox ? ` · volto ${quando(prox.proximo_ciclo_em).replace(/^hoje /, '')}` : ''}`];
    }
    return ['parado', leads.length ? 'Tudo em dia' : 'Sem leads ativos ainda'];
  }
  /* O mapa da parede: os leads do funil por cidade. Laranja = alguém esperando você; verde = conversa andando; azul = no funil. */
  const ROT_ETAPA = { novo: 'Novo', qualificado: 'Qualificado', abordado: 'Abordado', conversando: 'Conversando', reuniao: 'Reunião marcada', proposta: 'Proposta', negociacao: 'Negociação', ganho: 'Ganho', followup: 'Follow-up frio', perdido: 'Perdido' };
  const normCidade = (c) => String(c || '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();
  function dadosMapa(grupoDeLead) {
    const porCidade = new Map(), fora = [];
    for (const e of estado.empresas) {
      if (e.relacao === 'interno' || e.estagio === 'perdido') continue;
      const k = normCidade(e.cidade); if (!k) continue;
      if (!CIDADES[k]) { fora.push(e); continue; }
      if (!porCidade.has(k)) porCidade.set(k, { cidade: e.cidade, chave: k, empresas: [] });
      porCidade.get(k).empresas.push(e);
    }
    const pontos = [...porCidade.values()].map((c) => {
      const espera = c.empresas.some((e) => ['pronto', 'voce', 'decidir'].includes(grupoDeLead?.get(e.id)));
      const conversa = c.empresas.some((e) => ['conversando', 'reuniao', 'proposta', 'negociacao'].includes(e.estagio));
      const [lat, lon] = CIDADES[c.chave];
      return { ...c, lat, lon, n: c.empresas.length, cor: espera ? 'laranja' : conversa ? 'verde' : 'azul' };
    }).sort((a, b) => b.n - a.n);
    return { pontos, fora };
  }
  function abrirMapa(ancora) {
    $$('.demandas-pop').forEach((x) => x.remove());
    const grupoDeLead = new Map(ags.map((a) => [a.empresa_id, grupoDe(a)]));
    const { pontos, fora } = dadosMapa(grupoDeLead);
    const temAgente = (id) => ags.some((a) => a.empresa_id === id && a.status === 'ativo');
    const COR = { laranja: 'Alguém esperando você', verde: 'Conversa andando', azul: 'No funil' };
    const p = document.createElement('div');
    p.className = 'menu-pop demandas-pop mapa-pop'; p.setAttribute('role', 'dialog'); p.setAttribute('aria-label', 'Leads por cidade');
    p.innerHTML = `<div class="dem-cab"><span class="secao-ic azul">${icone('mapa')}</span><div class="grow"><b>Leads na Bahia</b><span>${pontos.reduce((a, c) => a + c.n, 0)} no funil, em ${pontos.length} cidade${pontos.length === 1 ? '' : 's'}</span></div></div>
      <div class="mapa-legenda">${Object.entries(COR).map(([k, r]) => `<span><i class="${k}"></i>${r}</span>`).join('')}</div>
      <ul class="mapa-cidades">${pontos.map((c) => `<li><div class="mapa-cid"><i class="${c.cor}"></i><b>${esc(c.cidade)}</b><span>${c.n} lead${c.n === 1 ? '' : 's'}</span></div>
        <ul>${c.empresas.sort((x, y) => String(x.nome).localeCompare(y.nome)).map((e) => `<li><button data-mapa-emp="${e.id}" data-agente="${temAgente(e.id) ? 1 : ''}"><span class="ellipsis">${esc(e.nome)}</span><small>${esc(ROT_ETAPA[e.estagio] || e.estagio || '')}${temAgente(e.id) ? ' · com agente' : ''}</small></button></li>`).join('')}</ul></li>`).join('')}</ul>
      ${fora.length ? `<p class="dim mapa-fora">${fora.length} lead${fora.length === 1 ? '' : 's'} em cidade que o mapa ainda não conhece (${esc([...new Set(fora.map((e) => e.cidade))].slice(0, 4).join(', '))}).</p>` : ''}`;
    document.body.appendChild(p);
    const r = ancora.getBoundingClientRect(), larg = Math.min(380, window.innerWidth - 16);
    p.style.width = `${larg}px`; p.style.left = `${Math.min(window.innerWidth - larg - 8, Math.max(8, r.right - larg))}px`; p.style.top = `${r.bottom + 8}px`;
    p.addEventListener('click', async (ev) => {
      const b = ev.target.closest('[data-mapa-emp]'); if (!b) return;
      p.remove();
      if (b.dataset.agente) irAoLead(b.dataset.mapaEmp); else (await import('../ficha.js')).abrirFicha(b.dataset.mapaEmp);
    });
    setTimeout(() => document.addEventListener('click', function f(e) { if (!p.contains(e.target) && !e.target.closest('[data-mapa]')) { p.remove(); document.removeEventListener('click', f); } }), 0);
  }

  /* O placar do quadro da parede: o que aconteceu hoje (horário da Bahia) */
  function placarDoDia() {
    const hoje = hojeBahia();
    return {
      enviadas: ocupados.filter((d) => d.status === 'enviado' && d.enviado_em && diaBahia(d.enviado_em) === hoje).length,
      respostas: new Set(msgs.filter((m) => humana(m) && diaBahia(m.momento) === hoje).map((m) => m.conversa_id)).size,
      reunioes: reunioes.filter((r) => new Date(r.inicio) > new Date()).length,
    };
  }
  const ROT_ESTADO = { pronto: 'Sua vez', voce: 'Sua vez', trabalhando: 'Pensando', esperando: 'Aguardando', comemorando: 'Comemorando', parado: 'Em dia' };

  function desenharEscritorio(grupoDeLead) {
    const alvo = $('[data-escritorio]', v);
    if (!alvo) return;
    if (!esps.length) { alvo.hidden = true; return; }
    alvo.hidden = false;
    const estacoes = esps.map((e) => {
      const [estado, balao] = estadoEsp(e, grupoDeLead);
      return { id: e.id, aparencia: e.aparencia, estado, balao, esp: e, pastas: leadsDe(e).filter((a) => a.status === 'ativo').length };
    });
    const pd = placarDoDia(), extra = { online: farejadorOnline(), placar: pd, mapa: dadosMapa(grupoDeLead).pontos };
    if (!cena) cena = montarEscritorio(alvo, estacoes, extra); else cena.atualizar(estacoes, extra);
    alvo.setAttribute('aria-label', `O escritório dos especialistas. Hoje: ${pd.enviadas} mensagens enviadas, ${pd.respostas} leads responderam, ${pd.reunioes} reuniões na agenda.`);
    alvo.style.setProperty('--n', estacoes.length);
    const IC = { pronto: 'check', voce: 'usuariomais', trabalhando: 'editar', esperando: 'relogio', comemorando: 'estrela', parado: 'check' };
    const lugar = posicoesEscritorio(estacoes.length);
    $('[data-estacoes]', v).innerHTML = estacoes.map((x, i) => `
      <div class="estacao" style="left:${lugar[i]}%">
        <button class="estacao-balao ${x.estado} ${filtroEsp === x.id ? 'on' : ''}" data-esp-demandas="${x.id}" aria-haspopup="dialog" title="O que ${art(x.esp)} ${esc(x.esp.nome)} precisa de você">
          <span class="eb-ic">${icone(IC[x.estado] || 'info')}</span><span class="eb-txt"><b>${esc(x.esp.nome)} <em>${esc(x.esp.segmento)}</em></b><span>${esc(x.balao)}</span></span></button>
      </div>`).join('') + `<button class="mapa-dica" data-mapa style="left:${AREA_MAPA.left}%;top:${AREA_MAPA.top}%;width:${AREA_MAPA.width}%;height:${AREA_MAPA.height}%" title="Seus leads no mapa da Bahia: clique pra ver por cidade" aria-label="Mapa dos leads por cidade"></button><span class="quadro-dica" title="Placar de hoje no quadro: ${pd.enviadas} mensagens enviadas, ${pd.respostas} leads responderam, ${pd.reunioes} reuniões na agenda"></span>`;
    return estacoes;
  }

  /* O cartão do especialista (01/10): quem é e o que faz; o que está fazendo agora; o que precisa de você (com nome);
     os números que importam (acompanhando, pra você, agendadas, enviadas na semana); última atividade e bloqueios. */
  function cartoesEsp(estacoes, grupoDeLead) {
    if (!estacoes?.length) return '';
    const semana = Date.now() - 7 * 864e5;
    return estacoes.map(({ esp, estado, balao }) => {
      const leads = leadsDe(esp).filter((a) => a.status === 'ativo');
      const ids = leadsDe(esp).map((a) => a.empresa_id);
      const gr = (a) => grupoDeLead.get(a.empresa_id);
      const dem = leads.filter((a) => ['pronto', 'decidir', 'voce'].includes(gr(a))).sort((x, y) => ORDEM_GRUPO[gr(x)] - ORDEM_GRUPO[gr(y)]);
      const agendadas = disp.filter((d) => ids.includes(d.empresa_id) && ['agendado', 'aprovado'].includes(d.status)).length;
      const enviadas = disp.filter((d) => ids.includes(d.empresa_id) && d.status === 'enviado' && new Date(d.enviado_em) > semana).length;
      const falhas = disp.filter((d) => ids.includes(d.empresa_id) && d.status === 'erro').length;
      const minhas = notasEsp.filter((n) => n.especialista_id === esp.id);
      const validas = minhas.filter((n) => n.status === 'valida').length, propostas = minhas.filter((n) => n.status === 'proposta').length;
      const ultima = eventos.find((x) => ids.includes(x.empresa_id));
      const bloqueios = [
        !farejadorOnline() && 'Farejador desligado: não pensa nem envia',
        falhas && `${falhas} mensagem${falhas > 1 ? 's' : ''} com falha no envio`,
        leads.filter((a) => /WhatsApp confirmado|Confirme o número/i.test(a.precisa_de_voce || '')).length && 'Lead sem WhatsApp confirmado',
      ].filter(Boolean);
      const COR = { pronto: 'laranja', voce: 'laranja', trabalhando: 'azul', comemorando: 'amarelo', esperando: 'cinza', parado: 'cinza' };
      const ROT_DEM = { pronto: 'mensagem pra aprovar', decidir: 'recomenda parar', voce: 'pergunta pra você' };
      return `<article class="card esp-card ${filtroEsp === esp.id ? 'on' : ''}" data-esp="${esp.id}">
        <header class="esp-cab"><img class="esp-rosto grande" src="${rosto(esp.aparencia, esp.id)}" alt="" width="52" height="52">
          <div class="grow" style="min-width:0"><h3>${esc(esp.nome)}</h3><div class="esp-papel">Especialista em ${esc(esp.segmento.toLowerCase())}</div></div>
          <span class="selo ${COR[estado] || 'cinza'}"><i class="esp-ponto ${estado}"></i>${esc(ROT_ESTADO[estado])}</span></header>
        <p class="esp-agora">${esc(balao)}</p>
        <div class="esp-nums">
          <button data-esp-aba="${esp.id}" title="Ver os leads ${doDa(esp)} ${esc(esp.nome)}"><b>${leads.length}</b><span>acompanhando</span></button>
          <button data-esp-demandas="${esp.id}" class="${dem.length ? 'alerta' : ''}" title="O que precisa de você"><b>${dem.length}</b><span>pra você</span></button>
          <div><b>${agendadas}</b><span>agendadas</span></div>
          <div><b>${enviadas}</b><span>enviadas em 7 dias</span></div>
        </div>
        ${dem.length ? `<ul class="esp-dem">${dem.slice(0, 3).map((a) => `<li><button data-ir-lead="${a.empresa_id}"><i class="${gr(a)}"></i><b class="ellipsis">${esc(curto(emp(a.empresa_id).nome))}</b><span>${ROT_DEM[gr(a)]}</span>${icone('setad')}</button></li>`).join('')}${dem.length > 3 ? `<li class="dim">e mais ${dem.length - 3}</li>` : ''}</ul>` : ''}
        ${bloqueios.length ? `<div class="esp-bloqueio">${icone('alerta')}<span>${esc(bloqueios.join(' · '))}</span></div>` : ''}
        <footer class="esp-pe">
          <span class="esp-ultima" title="Última atividade">${ultima ? `${icone('relogio')}${esc(relativo(ultima.criado_em))}: ${esc(tipoEvento(ultima)[2].toLowerCase())} · ${esc(curto(emp(ultima.empresa_id).nome))}` : `${icone('relogio')}Sem atividade ainda`}</span>
          <span class="grow"></span>
          <button class="btn xs fantasma" data-caderno="${esp.id}" title="O caderno do nicho: lições que valem pra todos os leads">${icone('livro')}${validas}</button>
          ${propostas ? `<button class="btn xs verde" data-caderno="${esp.id}">${icone('lampada')}${propostas} lição${propostas > 1 ? 'ões' : ''} pra aprovar</button>` : ''}
        </footer></article>`;
    }).join('');
  }

  /* O caderno vivo do especialista: lições válidas, propostas dos agentes pra aprovar, e "ensinar algo" */
  async function abrirCaderno(espId) {
    const esp = esps.find((e) => e.id === espId); if (!esp) return;
    const md = modal({ titulo: `Caderno ${doDa(esp)} ${esp.nome}`, subtitulo: `${esp.segmento}. O que vale pra todos os leads do nicho: todo agente deles lê antes de escrever, e o crítico cobra.`, largo: true, pe: null, corpo: esqueleto(5, 20) });
    const desenharCad = () => {
      const minhas = notasEsp.filter((n) => n.especialista_id === espId);
      const prop = minhas.filter((n) => n.status === 'proposta'), val = minhas.filter((n) => n.status === 'valida');
      const linha = (n, botoes) => `<li class="cad-nota" data-nota="${n.id}"><div class="grow"><p>${esc(n.texto)}</p><small class="dim">${esc([n.empresa_id ? emp(n.empresa_id).nome : null, n.origem === 'agente' ? 'tirada por um agente' : n.origem === 'marcelo' ? 'sua' : 'resposta de lead', dataHora(n.criado_em)].filter(Boolean).join(' · '))}</small></div>${botoes}</li>`;
      md.corpo.innerHTML = `
        <div class="row wrap gap-6"><img class="esp-rosto" src="${rosto(esp.aparencia, esp.id)}" alt="" width="44" height="44"><div class="grow"><b>${esc(esp.descricao || '')}</b><div class="dim" style="font-size:12.5px">Caderno base no repositório: ${esc(esp.caderno)}</div></div></div>
        ${prop.length ? `<h3 class="mt-16">Pra você aprovar · ${prop.length}</h3><p class="dim" style="font-size:12.5px">Lições que os agentes tiraram dos leads. Aceita: vira regra do nicho. Descarta: some.</p>
          <ul class="cad-lista">${prop.map((n) => linha(n, `<button class="btn xs verde" data-aceitar="${n.id}">${icone('check')}Aceitar</button><button class="btn xs fantasma" data-descartar-nota="${n.id}">${icone('x')}Descartar</button>`)).join('')}</ul>` : ''}
        <h3 class="mt-16">Lições valendo · ${val.length}</h3>
        ${val.length ? `<ul class="cad-lista">${val.map((n) => linha(n, `<button class="btn xs fantasma" data-descartar-nota="${n.id}" title="Tirar do caderno">${icone('lixo')}</button>`)).join('')}</ul>` : '<p class="dim mt-8">Nenhuma lição nova ainda. O caderno base (arquivo) já vale; as lições novas entram aqui.</p>'}
        <h3 class="mt-16">Ensinar algo ${art(esp) === 'o' ? 'ao' : 'à'} ${esc(esp.nome)}</h3>
        <textarea class="txt mt-8" data-nova-licao rows="2" placeholder="Uma frase que vale pra todo lead do nicho. Ex.: clínica com assistente virtual já faz o retorno de quem pergunta o valor."></textarea>
        <div class="row mt-8"><span class="grow"></span><button class="btn sm prim" data-salvar-licao>${icone('check')}Guardar no caderno</button></div>`;
    };
    desenharCad();
    md.corpo.addEventListener('click', async (ev) => {
      const ac = ev.target.closest('[data-aceitar]'), de = ev.target.closest('[data-descartar-nota]'), sl = ev.target.closest('[data-salvar-licao]');
      if (ac || de) {
        const id = (ac || de).dataset.aceitar || (ac || de).dataset.descartarNota;
        const status = ac ? 'valida' : 'descartada';
        const { error } = await sb.from('especialista_notas').update({ status, decidido_em: new Date().toISOString(), autor: quem() }).eq('id', id);
        if (error) { toast(erroAmigavel(error), 'erro'); return; }
        const n = notasEsp.find((x) => x.id === id); if (n) n.status = status;
        notasEsp = notasEsp.filter((x) => x.status !== 'descartada');
        toast(ac ? 'Lição aceita: vale pra todo o nicho' : 'Tirada do caderno');
        desenharCad();
      }
      if (sl) {
        const texto = $('[data-nova-licao]', md.corpo).value.trim();
        if (!texto) { toast('Escreva a lição', 'erro'); return; }
        const { data, error } = await sb.from('especialista_notas').insert({ especialista_id: espId, texto, origem: 'marcelo', status: 'valida', autor: quem() }).select().single();
        if (error) { toast(erroAmigavel(error), 'erro'); return; }
        notasEsp.unshift(data);
        toast(`Guardado. Todo agente de ${esp.segmento.toLowerCase()} passa a ler.`);
        desenharCad();
      }
    });
  }

  async function licaoDoNicho(empresaId, texto) {
    const esp = espDe(ags.find((a) => a.empresa_id === empresaId));
    if (!esp || !texto) return;
    await sb.from('especialista_notas').insert({ especialista_id: esp.id, empresa_id: empresaId, texto: `${curto(emp(empresaId).nome)}: ${texto}`, origem: 'marcelo', status: 'valida', autor: quem() });
  }

  /* "Agora no time": o diário de todos os agentes, o mais novo em cima */
  const ACAO = {
    mensagem: ['verde', 'enviar', 'Preparou mensagem'], manter: ['cinza', 'check', 'Manteve a proposta'], esperar: ['cinza', 'relogio', 'Decidiu esperar'],
    precisa_marcelo: ['laranja', 'usuariomais', 'Pediu você'], investigar: ['violeta', 'radar', 'Foi investigar'], encerrar: ['vermelho', 'x', 'Encerrou'],
  };
  function tipoEvento(x) {
    if (x.decisao && ACAO[x.decisao]) return ACAO[x.decisao];
    if (x.autor !== 'agente' && x.autor !== 'farejador') return ['azul', 'comentario', 'Você'];
    if (/silencio/.test(x.gatilho)) return ['amarelo', 'relogio', 'Lead em silêncio'];
    if (/designado/.test(x.gatilho)) return ['azul', 'robo', 'Designado'];
    if (/lead_respondeu/.test(x.gatilho)) return ['verde', 'whatsapp', 'Lead respondeu'];
    return ['cinza', 'info', x.gatilho];
  }
  function feed() {
    const lista = eventos.slice(0, 25);
    return `<aside class="card mesa-feed"><div class="mesa-feed-cab"><span class="mesa-vivo" aria-hidden="true"></span><h3>Agora no time</h3></div>
      <p class="dim" style="font-size:12.5px">O que cada agente decidiu, e o que você fez, em tempo real.</p>
      <ol class="mesa-feed-lista">${lista.map((x) => {
        const [c, ic, r] = tipoEvento(x);
        const txt = x.decisao ? (x.porque || x.leitura || x.aconteceu) : x.aconteceu;
        return `<li><button data-ir-lead="${x.empresa_id}" title="Abrir este lead na Mesa"><span class="mesa-feed-ic ${c}">${icone(ic)}</span>
          <span class="mesa-feed-corpo"><span class="mesa-feed-linha"><b class="ellipsis">${esc(emp(x.empresa_id).nome)}</b><small class="dim">${esc(relativo(x.criado_em))}</small></span>
          <span class="mesa-feed-acao ${c}">${esc(r)}</span>${txt ? `<span class="mesa-feed-txt">${esc(txt.length > 150 ? `${txt.slice(0, 147)}…` : txt)}</span>` : ''}</span></button></li>`;
      }).join('') || '<li class="dim">Nada ainda.</li>'}</ol></aside>`;
  }

  // O lead aberto no centro e o filtro da lista (a lista lembra o filtro no navegador)
  // Quem chega por notificação ou link vem com o lead (lead=), o especialista (esp=) ou o filtro (filtro=) certos
  let sel = params.lead || null;
  let filtroLista = LISTA_FILTROS.some(([k]) => k === params.filtro) ? params.filtro
    : params.lead ? 'todos' : (() => { try { const f = localStorage.getItem('hd.mesa.lista'); return LISTA_FILTROS.some(([k]) => k === f) ? f : 'todos'; } catch { return 'todos'; } })();
  if (params.esp) filtroEsp = params.esp;

  /* Só a faixa de status: o Farejador bate o ponto a cada poucos segundos e não pode redesenhar os cartões */
  function avisoFarejador() {
    const alvo = $('[data-aviso]', v); if (!alvo) return;
    const wa = estado.farejador?.whatsapp_status === 'conectado' && farejadorOnline();
    const html = wa ? '' : `<div class="aviso laranja mb-16">${icone('alerta')}<div><b>O Farejador ou o WhatsApp está desligado.</b> Dá pra aprovar daqui, mas nada sai e nenhum agente pensa até ele ligar no seu PC.</div></div>`;
    if (alvo.innerHTML !== html) alvo.innerHTML = html;
    cena?.definir({ online: farejadorOnline() });
  }

  /* O time hoje: o resumo que antes estava espalhado em três lugares. O número que importa (esperando você) em destaque. */
  function resumoTime(grupoDeLead) {
    const n = (k) => [...grupoDeLead.values()].filter((g) => g === k).length;
    const ativos = ags.filter((a) => a.status === 'ativo').length, pl = placar();
    const linha = (rot, val, f) => `<div${f ? ` class="clica" data-lista-filtro="${f}" role="button" tabindex="0"` : ''}><dt>${rot}</dt><dd>${val}</dd></div>`;
    return `<article class="card resumo-card">
      <div class="resumo-topo"><h3>O time hoje</h3><span class="time-vivo"><i></i>tempo real</span></div>
      <dl class="resumo-lista">
        ${linha('Leads acompanhados', `${ativos}<i>/${LIMITE_AGENTES}</i>`, 'todos')}
        ${linha('Pensando agora', n('trabalhando'), 'trabalhando')}
        ${linha('Aguardando o lead', n('esperando'), 'esperando')}
        ${linha('Responderam a 1ª mensagem', taxa.enviados ? `${taxa.responderam} de ${taxa.enviados}` : '—')}
        ${linha('Teste casa × curiosidade', `${pl.casa.responderam}/${pl.casa.enviados} · ${pl.curiosidade.responderam}/${pl.curiosidade.enviados}`)}
        ${linha('Reuniões marcadas', reunioes.length)}
      </dl>
      ${((prox) => `<div class="resumo-envios"><div class="resumo-envios-cab"><b>Próximos envios</b><small>hoje ${ocupadosNoDia(hojeBahia())} de ${LIMITE_DIA}</small></div>
        ${prox.length ? `<ul>${prox.map((d) => `<li><button data-ir-lead="${d.empresa_id}"><span class="estado-msg violeta">${icone('agenda')}${esc(quando(d.agendado_para))}</span><b class="ellipsis">${esc(curto(emp(d.empresa_id).nome))}</b></button></li>`).join('')}</ul>`
          : '<p class="dim">Nada agendado. Aprovar ou agendar uma mensagem põe ela aqui.</p>'}</div>`)(disp.filter((d) => d.status === 'agendado' && d.agendado_para).sort((x, y) => new Date(x.agendado_para) - new Date(y.agendado_para)).slice(0, 4))}
      </article>`;
  }

  /* Lições do nicho (o "Insights" da referência): propostas dos agentes primeiro, depois as mais novas */
  function licoes() {
    const lista = [...notasEsp].sort((x, y) => (x.status === 'proposta' ? 0 : 1) - (y.status === 'proposta' ? 0 : 1) || new Date(y.criado_em) - new Date(x.criado_em)).slice(0, 6);
    return `<section class="card licoes-card"><div class="time-cab"><h3>Lições do nicho</h3><span class="dim" style="font-size:12px">valem pra todos os leads do segmento</span></div>
      ${lista.length ? `<ul class="licoes">${lista.map((n) => {
        const esp = esps.find((e) => e.id === n.especialista_id);
        return `<li class="${n.status}"><img src="${rosto(esp?.aparencia, esp?.id)}" alt="" width="28" height="28">
          <div class="grow" style="min-width:0"><div class="licao-topo"><b>${esc(esp?.nome || '')}</b><span class="selo mini ${n.status === 'proposta' ? 'amarelo' : 'verde'}">${n.status === 'proposta' ? 'pra você aprovar' : 'valendo'}</span><small class="dim">${esc(relativo(n.criado_em))}</small></div>
          <p>${esc(n.texto)}</p>
          ${n.status === 'proposta' ? `<div class="row gap-6 mt-8"><button class="btn xs verde" data-aceitar="${n.id}">${icone('check')}Aceitar</button><button class="btn xs fantasma" data-descartar-nota="${n.id}">${icone('x')}Descartar</button></div>` : ''}</div></li>`;
      }).join('')}</ul>` : `<p class="dim licoes-vazio">Nenhuma lição nova ainda. Quando você marcar "vale pro nicho todo" numa correção, ou um agente propuser uma, ela aparece aqui.</p>`}
    </section>`;
  }

  // A lista: quem espera você primeiro (há mais tempo no topo), depois pensando, aguardando (pela data de volta), parados
  function ordenar(lista, gm) {
    const esperaDesde = (a) => { const f = falasDe(a.empresa_id).filter(conta).slice(-1)[0]; return f && f.direcao === 'in' ? new Date(f.momento).getTime() : Infinity; };
    return [...lista].sort((x, y) => ORDEM_GRUPO[gm.get(x.empresa_id)] - ORDEM_GRUPO[gm.get(y.empresa_id)]
      || esperaDesde(x) - esperaDesde(y) || desdeQuando(x) - desdeQuando(y) || new Date(x.proximo_ciclo_em || '2999-01-01') - new Date(y.proximo_ciclo_em || '2999-01-01'));
  }

  function desenhar() {
    if (!v.isConnected) return;
    const nov = $('[data-novidade]', v); if (nov) nov.innerHTML = '';
    avisoFarejador();
    if (!ags.length) { $('[data-corpo]', v).innerHTML = `<div class="card">${vazio('robo', 'Nenhum lead acompanhado ainda', 'Clique em "Acompanhar lead" e escolha um. O agente dele lê a ficha, a investigação e a conversa e prepara a próxima mensagem.')}</div>`; return; }
    const grupoDeLead = new Map(ags.map((a) => [a.empresa_id, grupoDe(a)]));
    if (filtroEsp && !esps.some((e) => e.id === filtroEsp)) filtroEsp = null;
    const estacoes = desenharEscritorio(grupoDeLead);
    window.dispatchEvent(new CustomEvent('hounder:contador', { detail: { rota: 'agentes', n: [...grupoDeLead.values()].filter((g) => g === 'pronto' || g === 'voce').length } }));

    const ordem = ordenar(ags, grupoDeLead);
    $('[data-suavez]', v).innerHTML = faixaSuaVez(grupoDeLead);
    const visiveis = ordem.filter((a) => (!filtroEsp || a.especialista_id === filtroEsp) && noFiltro(grupoDeLead.get(a.empresa_id), filtroLista, a));
    // 01/10: com o filtro do Rafa, o meio continuava mostrando o lead da Lia (a seleção antiga sobrevivia ao filtro).
    // O lead aberto agora é sempre um dos que a lista mostra.
    if (!sel || !visiveis.some((a) => a.empresa_id === sel)) sel = visiveis[0]?.empresa_id || null;
    const atual = ags.find((a) => a.empresa_id === sel);
    const ativos = ags.filter((a) => a.status === 'ativo').length;
    const espFiltro = esps.find((e) => e.id === filtroEsp);
    const contaFiltro = (f) => ordem.filter((a) => (!filtroEsp || a.especialista_id === filtroEsp) && noFiltro(grupoDeLead.get(a.empresa_id), f, a)).length;

    $('[data-corpo]', v).innerHTML = `
      <section class="mesa-secao">
        <header class="secao-cab"><span class="secao-ic laranja">${icone('clientes')}</span>
          <div class="grow"><h2>Os leads</h2><p>Quem espera você vem primeiro. Clique num lead pra ver a conversa, o que está a caminho e o que o agente propõe. Nada sai sem o seu clique.</p></div>
        </header>
        <nav class="esp-abas" aria-label="Ver os leads de cada especialista">
          <button class="esp-aba ${filtroEsp ? '' : 'on'}" data-esp-aba="" aria-pressed="${!filtroEsp}">${icone('clientes')}<span>Todos</span><b>${ags.length}</b></button>
          ${esps.map((e) => { const l = leadsDe(e); const pv = l.filter((a) => ['pronto', 'voce', 'decidir'].includes(grupoDeLead.get(a.empresa_id))).length;
            return `<button class="esp-aba ${filtroEsp === e.id ? 'on' : ''}" data-esp-aba="${e.id}" aria-pressed="${filtroEsp === e.id}"><img src="${rosto(e.aparencia, e.id)}" alt="" width="22" height="22"><span>${esc(e.nome)}</span><b>${l.length}</b>${pv ? `<i class="esp-aba-pend" title="${pv} esperando você">${pv}</i>` : ''}</button>`; }).join('')}
        </nav>
        <div class="mesa-duas">
          <section class="card lista-card">
            <div class="time-cab"><h3>${espFiltro ? `Leads ${doDa(espFiltro)} ${esc(espFiltro.nome)}` : 'Leads acompanhados'} <span class="mesa-conta">${espFiltro ? leadsDe(espFiltro).length : `${ativos}/${LIMITE_AGENTES}`}</span></h3></div>
            <nav class="chips lista-filtros" aria-label="Filtrar leads">${LISTA_FILTROS.map(([f, r]) => `<button class="chip ${filtroLista === f ? 'on' : ''}" data-lista-filtro="${f}" aria-pressed="${filtroLista === f}">${esc(r)}<span class="mesa-chip-n">${contaFiltro(f)}</span></button>`).join('')}</nav>
            <ul class="lead-lista">${visiveis.map((a) => linhaLead(a, grupoDeLead.get(a.empresa_id))).join('') || `<li class="dim lead-nada">Nenhum lead em "${esc(LISTA_FILTROS.find(([k]) => k === filtroLista)?.[1] || filtroLista)}"${espFiltro ? ` ${doDa(espFiltro)} ${esc(espFiltro.nome)}` : ''}.${filtroLista !== 'todos' && contaFiltro('todos') ? ` <button class="btn xs mt-8" data-lista-filtro="todos">Ver os ${contaFiltro('todos')}</button>` : ''}</li>`}</ul>
          </section>
          <div class="mesa-centro">${painelLead(atual, atual ? grupoDeLead.get(atual.empresa_id) : null)}</div>
        </div>
      </section>

      <section class="mesa-secao">
        <header class="secao-cab"><span class="secao-ic">${icone('robo')}</span>
          <div class="grow"><h2>O time</h2><p>Cada especialista cuida de um nicho; a pilha de pastas na mesa dele é quantos leads acompanha. Os números de hoje e os próximos envios ficam aqui.</p></div></header>
        <div class="time-grade">${cartoesEsp(estacoes, grupoDeLead)}${resumoTime(grupoDeLead)}</div>
      </section>

      <section class="mesa-secao">
        <header class="secao-cab"><span class="secao-ic azul">${icone('livro')}</span>
          <div class="grow"><h2>Diário e lições</h2><p>O que cada agente decidiu e o que já vale pro nicho todo.</p></div></header>
        <div class="mesa-rodape">${feed()}${licoes()}</div>
      </section>`;
    // O balão do rascunho cresce com o texto (sem rolagem dentro da mensagem)
    $$('.rev-rascunho:not([hidden]) [data-texto]', v).forEach(ajustar);
  }

  /* ------------------------------ ações ------------------------------ */
  function ocupadosNoDia(dia) {
    return ocupados.filter((d) => (d.status === 'enviado' && d.enviado_em && diaBahia(d.enviado_em) === dia)
      || (['agendado', 'enviando'].includes(d.status) && d.agendado_para && diaBahia(d.agendado_para) === dia)).length;
  }
  async function diario(empresaId, aconteceu, gatilho = 'nota', dados = {}) {
    const a = ags.find((x) => x.empresa_id === empresaId); if (!a) return;
    await sb.from('agente_eventos').insert({ agente_id: a.id, empresa_id: empresaId, gatilho, aconteceu, dados, autor: quem() });
  }
  /* Mesmo contrato do lib/agentes.mjs: um ciclo por vez por lead; acontecimento novo com ciclo na fila entra nele */
  async function pedirCiclo(empresaId, gatilho, detalhe) {
    const ev = { gatilho, detalhe, em: new Date().toISOString() };
    const { data: esp } = await sb.from('jobs').select('id,entrada').eq('tipo', 'agente_ciclo').eq('empresa_id', empresaId).eq('status', 'fila').order('criado_em').limit(1);
    if (esp?.[0]) {
      await sb.from('jobs').update({ entrada: { ...esp[0].entrada, eventos: [...(esp[0].entrada?.eventos || []), ev] } }).eq('id', esp[0].id);
      return esp[0].id;
    }
    const j = await criarJob('agente_ciclo', { eventos: [ev] }, { empresa_id: empresaId }, 2);
    await sb.from('agentes').update({ fase: 'trabalhando' }).eq('empresa_id', empresaId).not('fase', 'in', '(geladeira,ganho,perdido)');
    return j.id;
  }
  async function anotar(empresaId, texto, tipo = 'fato') {
    const a = ags.find((x) => x.empresa_id === empresaId); if (!a) return;
    const mem = { ...(a.memoria || {}) };
    const hoje = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Bahia' });
    if (tipo === 'correcao') mem.correcoes = [...(mem.correcoes || []), { texto, data: hoje, fonte: 'Marcelo' }].slice(-30);
    else mem.fatos = [...(mem.fatos || []), { fato: texto, fonte: 'Marcelo', data: hoje }].slice(-60);
    await sb.from('agentes').update({ memoria: mem }).eq('id', a.id);
    a.memoria = mem;
  }

  async function aprovar(d, texto, btn, horaEscolhida = null) {
    const m = horaEscolhida ? { como: 'fila', h: horaEscolhida } : modoDe(d);
    const e = emp(d.empresa_id);
    if (m.como === 'travado') { toast('Esta mensagem só sai depois que o lead responder', 'erro'); return false; }
    if (e.regulado && /garant|100%|cura|melhor d|resultado certo|antes e depois/i.test(texto)
      && !(await confirmar('Atenção: setor regulado', `${e.conselho || 'O conselho'} proíbe promessa de resultado, superlativo e antes/depois. Aprovar mesmo assim?`, { rotulo: 'Aprovar mesmo assim', perigo: true }))) return false;
    const vetos = revisar(texto, { passo: d.passo || 1, tipo: d.tipo, empresa: e.nome, lote: [] }).vetos;
    if (vetos && !(await confirmar('O revisor tem veto nesta mensagem', 'Leia os pontos em vermelho no rascunho. Aprovar mesmo assim?', { rotulo: 'Aprovar mesmo assim', perigo: true }))) return false;
    const agora = new Date().toISOString();
    const ag = ags.find((x) => x.empresa_id === d.empresa_id), antes = { fase: ag?.fase, precisa_de_voce: ag?.precisa_de_voce ?? null };
    let outras = [];
    botaoCarregando(btn, true);
    try {
      if (m.como === 'agora') {
        if (!naJanela(Date.now()) && !(await confirmar('Fora do horário comercial', `Agora são ${new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Bahia', hour: '2-digit', minute: '2-digit' })}. É resposta a quem falou com você, então pode ir. Enviar agora?`, { rotulo: 'Enviar agora' }))) { botaoCarregando(btn, false); return false; }
        botaoCarregando(btn, false);
        if (!(await contagem(btn))) return false;
        botaoCarregando(btn, true);
        const c = convDe(d.empresa_id);
        const { data: msg, error } = await sb.from('whatsapp_mensagens').insert({ conversa_id: c.id, direcao: 'out', texto, status: 'fila', enviado_por: quem() }).select().single();
        if (error) throw error;
        await criarJob('whatsapp_enviar', { mensagem_id: msg.id, texto, telefone: c.telefone, jid: c.jid }, { conversa_id: c.id, empresa_id: d.empresa_id }, 1);
        const { error: e2 } = await sb.from('disparos').update({ texto, status: 'enviado', enviado_em: agora, aprovado_por: quem(), aprovado_em: agora }).eq('id', d.id);
        if (e2) throw e2;
      } else {
        if (!m.h) throw new Error('Não achei horário comercial nos próximos dias');
        if (LIMITE_DIA - ocupadosNoDia(diaBahia(m.h)) <= 0) throw new Error(`O dia ${diaBahia(m.h).split('-').reverse().join('/')} já tem ${LIMITE_DIA} envios. Mande pela conversa ou deixe pra outro dia.`);
        const { error } = await sb.from('disparos').update({ texto, status: 'agendado', agendado_para: m.h.toISOString(), lote_id: crypto.randomUUID(), aprovado_por: quem(), aprovado_em: agora }).eq('id', d.id).eq('status', 'rascunho');
        if (error) throw error;
      }
      // Só uma opção por passo sai: as outras ficam registradas como deixadas de lado (o agente aprende com a escolha)
      outras = disp.filter((x) => x.id !== d.id && x.empresa_id === d.empresa_id && (x.passo || 1) === (d.passo || 1) && x.status === 'rascunho').map((x) => x.id);
      if (outras.length) await sb.from('disparos').update({ status: 'cancelado', erro: `Descartada: você aprovou a abordagem ${d.variante || 'A'}` }).in('id', outras);
      await sb.from('agentes').update({ fase: 'esperando_lead', precisa_de_voce: null }).eq('empresa_id', d.empresa_id);
      await diario(d.empresa_id, `Marcelo aprovou ${d.variante ? `a opção ${d.variante}` : 'a mensagem'}${texto !== d.texto ? ' com edição' : ''} (${TIPO[d.tipo] || `passo ${d.passo}`}) ${m.como === 'agora' ? 'e ela foi enviada na hora' : `pra sair ${quando(m.h)}`}`, 'nota');
      if (m.como === 'agora') toast(farejadorOnline() ? `Enviada pra ${e.nome} pelo WhatsApp` : 'Na fila: sai quando o Farejador ligar', 'info');
      else toast(`${horaEscolhida ? 'Agendada' : 'Aprovada'}: sai ${quando(m.h)}`, 'info', { ms: 9000, acao: { rotulo: 'Desfazer', fn: () => desfazerAprovacao(d, outras, antes) } });
    } catch (err) { toast(erroAmigavel(err), 'erro'); botaoCarregando(btn, false); return false; }
    return true;
  }
  /* Desfazer uma aprovação que foi pra fila: volta pra aprovação com o texto que você deixou, e as outras opções voltam também.
     Se o Farejador já pegou a mensagem, não dá mais, e o aviso diz isso. */
  async function desfazerAprovacao(d, outras, antes) {
    const { data, error } = await sb.from('disparos').update({ status: 'rascunho', agendado_para: null, lote_id: null, aprovado_por: null, aprovado_em: null })
      .eq('id', d.id).in('status', ['agendado', 'aprovado']).select('id');
    if (error) { toast(erroAmigavel(error), 'erro'); return; }
    if (!data?.length) { toast('Tarde demais: o Farejador já pegou essa mensagem pra enviar.', 'erro'); return; }
    if (outras.length) await sb.from('disparos').update({ status: 'rascunho', erro: null }).in('id', outras);
    await sb.from('agentes').update({ fase: antes.fase || 'pronto_aprovar', precisa_de_voce: antes.precisa_de_voce }).eq('empresa_id', d.empresa_id);
    await diario(d.empresa_id, 'Marcelo desfez a aprovação; a mensagem voltou pra aprovação', 'nota');
    toast('Desfeito. A mensagem voltou pra sua aprovação.', 'info');
    carregar(true);
  }

  /* Escolher dia e hora (Agendar / Reagendar): só dentro da janela de envio e com vaga no dia */
  function escolherHorario({ titulo, subtitulo, atual }) {
    return new Promise((resolve) => {
      let res = null;
      const base = atual && new Date(atual) > new Date() ? new Date(atual) : (naJanela(Date.now() + 30 * 60000) ? new Date(Date.now() + 30 * 60000) : proximaAbertura(Date.now()));
      const dia = diaBahia(base), hora = base.toLocaleTimeString('pt-BR', { timeZone: 'America/Bahia', hour: '2-digit', minute: '2-digit' });
      const md = modal({ titulo, subtitulo, icone: 'agenda', corpo: `
        <div class="row wrap gap-12"><label class="rotulo-campo">Dia<input class="inp" type="date" data-dia value="${dia}" min="${hojeBahia()}"></label>
          <label class="rotulo-campo">Hora<input class="inp" type="time" data-hora value="${hora}" step="300"></label></div>
        <p class="dim mt-12" style="font-size:12.5px" data-info></p>`,
      pe: `<button class="btn" data-fechar>Cancelar</button><button class="btn prim" data-ok>${icone('agenda')}Agendar</button>`, aoFechar: () => resolve(res) });
      const info = () => {
        const d = $('[data-dia]', md.el).value, h = $('[data-hora]', md.el).value;
        const t = d && h ? new Date(`${d}T${h}:00-03:00`) : null;
        const p = $('[data-info]', md.el);
        if (!t) { p.textContent = ''; return null; }
        const livres = LIMITE_DIA - ocupadosNoDia(d);
        const erro = t < new Date() ? 'Esse horário já passou.' : !naJanela(t.getTime()) ? 'Fora da janela de envio (seg a sex 8h30 às 18h, sábado 9h às 12h).' : livres <= 0 ? `Esse dia já tem ${LIMITE_DIA} envios.` : '';
        p.innerHTML = erro ? `<span class="erro">${esc(erro)}</span>` : `Sai ${esc(quando(t))}. ${livres} vaga${livres === 1 ? '' : 's'} no dia (limite ${LIMITE_DIA}).`;
        return erro ? null : t;
      };
      md.el.addEventListener('input', info); info();
      $('[data-ok]', md.el).onclick = () => { const t = info(); if (!t) { toast('Escolha um dia e hora dentro da janela', 'erro'); return; } res = t; md.fechar(); };
    });
  }

  /* Leva ao lead: seleciona, filtra pelo especialista dele e rola até o painel */
  function irAoLead(empresaId, soPainel = false) {
    const a = ags.find((x) => x.empresa_id === empresaId); if (!a) return;
    $$('.demandas-pop').forEach((x) => x.remove());
    if (!soPainel && SUA_VEZ.includes(grupoDe(a))) return abrirRevisao(empresaId);
    sel = empresaId;
    if (filtroEsp && a.especialista_id !== filtroEsp) filtroEsp = null;
    if (!noFiltro(grupoDe(a), filtroLista, a)) filtroLista = 'todos';
    desenhar();
    $('.mesa-centro', v)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* O balão do especialista: o que ele precisa de você, de quem, por quê e o botão pra resolver */
  function abrirDemandas(espId, ancora) {
    $$('.demandas-pop').forEach((x) => x.remove());
    const esp = esps.find((e) => e.id === espId); if (!esp) return;
    const p = document.createElement('div');
    p.className = 'menu-pop demandas-pop'; p.setAttribute('role', 'dialog'); p.setAttribute('aria-label', `Demandas ${doDa(esp)} ${esp.nome}`);
    const pintar = () => {
      const leads = leadsDe(esp).filter((a) => a.status === 'ativo');
      const g = (a) => grupoDe(a);
      const dem = leads.filter((a) => SUA_VEZ.includes(g(a))).sort((x, y) => ORDEM_GRUPO[g(x)] - ORDEM_GRUPO[g(y)]);
      const resto = leads.filter((a) => !dem.includes(a));
      const corte = (t, n) => (t.length > n ? `${t.slice(0, n - 2)}…` : t);
      const itemDem = (a) => {
        const gr = g(a), [cor, ic, rot] = ESTADO[gr], e = emp(a.empresa_id);
        const aconteceu = convDe(a.empresa_id)?.analise?.momento || a.plano?.proxima_jogada || '';
        return `<li class="dem"><div class="dem-topo"><span class="selo mini ${cor}">${icone(ic)}${rot}</span><b class="ellipsis">${esc(e.nome)}</b><small>${esc(relativo(new Date(desdeQuando(a))))}</small></div>
          ${aconteceu ? `<p class="dem-o-que"><span>Onde a conversa está</span>${esc(corte(aconteceu, 160))}</p>` : ''}
          ${revisao(a, gr, 'pop')}
          <button class="dem-mais" data-revisar="${a.empresa_id}">${icone('whatsapp')}Ver a conversa e o contexto${icone('setad')}</button></li>`;
      };
      const [estadoAgora, frase] = estadoEsp(esp, new Map(ags.map((a) => [a.empresa_id, grupoDe(a)])));
      p.innerHTML = `<div class="dem-cab"><img src="${rosto(esp.aparencia, esp.id)}" alt="" width="40" height="40"><div class="grow"><b>${esc(esp.nome)}</b><span>${esc(esp.segmento)} · ${leads.length} lead${leads.length === 1 ? '' : 's'}</span></div><span class="selo ${{ pronto: 'laranja', voce: 'laranja', trabalhando: 'azul', comemorando: 'amarelo' }[estadoAgora] || 'cinza'}">${esc(ROT_ESTADO[estadoAgora])}</span><button class="btn icone sm fantasma" data-fechar-pop aria-label="Fechar">${icone('x')}</button></div>
        ${dem.length ? `<h4>${dem.length === 1 ? 'Uma coisa precisa de você' : `${dem.length} coisas precisam de você`}</h4><ul class="dem-lista">${dem.map(itemDem).join('')}</ul>`
          : `<div class="dem-vazio">${icone('checkc')}<span>${esc(frase)}. Nada esperando você agora.</span></div>`}
        ${resto.length ? `<h4>Acompanhando</h4><ul class="dem-resto">${resto.map((a) => { const sd = saudeDe(a); return `<li><button data-ir-lead="${a.empresa_id}"><b class="ellipsis">${esc(emp(a.empresa_id).nome)}</b><span class="selo mini ${ROTULO_SAUDE[sd.estado][0]}">${esc(ROTULO_SAUDE[sd.estado][1])}</span>${a.proximo_ciclo_em ? `<small>volta ${esc(quando(a.proximo_ciclo_em))}</small>` : ''}</button></li>`; }).join('')}</ul>` : ''}
        <div class="dem-pe"><button class="btn sm" data-dem-leads="${esp.id}">${icone('filtro')}Ver só os leads ${art(esp) === 'o' ? 'dele' : 'dela'}</button><button class="btn sm fantasma" data-caderno="${esp.id}">${icone('livro')}Caderno</button></div>`;
      $$('.rev-rascunho:not([hidden]) [data-texto]', p).forEach(ajustar);
    };
    document.body.appendChild(p);
    const r = ancora.getBoundingClientRect(), larg = Math.min(460, window.innerWidth - 16);
    p.style.width = `${larg}px`;
    p.style.left = `${Math.min(window.innerWidth - larg - 8, Math.max(8, r.left + r.width / 2 - larg / 2))}px`;
    // Cabe na tela: abaixo do balão se houver espaço; senão sobe até logo abaixo da barra do topo
    const topo = window.innerHeight - r.bottom - 20 >= 520 ? r.bottom + 8 : Math.max(64, Math.min(r.bottom + 8, window.innerHeight - 640));
    p.style.top = `${topo}px`; p.style.maxHeight = `${window.innerHeight - topo - 12}px`;
    pintar();
    const fechar = () => { p.remove(); document.removeEventListener('click', fora); };
    p.addEventListener('input', aoDigitar);
    p.addEventListener('click', async (ev) => {
      if (ev.target.closest('[data-fechar-pop]')) return fechar();
      const rv = ev.target.closest('[data-revisar]'); if (rv) { fechar(); return abrirRevisao(rv.dataset.revisar); }
      const ir = ev.target.closest('[data-ir-lead]'); if (ir) { fechar(); return irAoLead(ir.dataset.irLead); }
      const dl = ev.target.closest('[data-dem-leads]');
      if (dl) { fechar(); filtroEsp = dl.dataset.demLeads; sel = null; desenhar(); $('.lista-card', v)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
      const cd = ev.target.closest('[data-caderno]'); if (cd) { fechar(); return abrirCaderno(cd.dataset.caderno); }
      const aba = ev.target.closest('[data-aba-op]'); if (aba) return trocarOpcao(aba);
      const pq = ev.target.closest('.mesa-porque'); if (pq) { pq.classList.toggle('aberto'); return; }
      const bolha = ev.target.closest('.rev-bolha[readonly]'); if (bolha) return editar(bolha.closest('.rev-rascunho'));
      const b = ev.target.closest('[data-a]'); if (!b) return;
      const raiz = b.closest('[data-rev]'); if (!raiz) return;
      if (!(await acaoRevisao(b, raiz))) return;
      // Decidido: some do balão, a Mesa recarrega e o balão mostra o que sobrou
      raiz.closest('.dem')?.classList.add('saindo');
      await carregar(true);
      if (p.isConnected) pintar();
    });
    // Clique fora fecha, menos quando é numa janela de confirmação, durante a contagem do "desfazer" ou com texto editado
    const ocupado = () => !!$('.contando', p) || $$('[data-texto], [data-resposta], [data-motivo]', p).some((t) => (t.dataset.texto !== undefined ? umaLinha(t.value) !== umaLinha(t.defaultValue) : t.value.trim()));
    function fora(e) {
      if (!p.isConnected) { document.removeEventListener('click', fora); return; }
      if (p.contains(e.target) || e.target.closest('[data-esp-demandas], .modal, .veu, .toasts, .menu-pop')) return;
      if (ocupado()) { toast('Há texto editado no balão. Aprove, desfaça a edição ou feche pelo X.', 'info'); return; }
      fechar();
    }
    setTimeout(() => document.addEventListener('click', fora), 0);
  }

  /* Desistência controlada: o Marcelo aprova a recomendação (com a data dele) ou manda continuar */
  async function decidirRecomendacao(empresaId, forcar, card) {
    const a = ags.find((x) => x.empresa_id === empresaId); if (!a) return;
    const r = a.recomendacao || {};
    const tipo = forcar || r.tipo || 'geladeira';
    const dia = $('[data-rec-data]', card)?.value;
    const volta = tipo === 'geladeira' && dia ? new Date(`${dia}T09:00:00-03:00`) : null;
    if (tipo === 'perdido' && !(await confirmar('Encerrar como perdido?', 'O agente para e o lead vai pra Perdido no funil. A memória e a conversa ficam guardadas.', { rotulo: 'Encerrar', perigo: true }))) return false;
    const { error } = await sb.from('agentes').update({ status: 'encerrado', fase: tipo, recomendacao: null, precisa_de_voce: null,
      proximo_ciclo_em: volta ? volta.toISOString() : null, motivo_proximo: volta ? `Voltar depois da geladeira: ${r.resumo || ''}`.slice(0, 300) : null }).eq('empresa_id', empresaId);
    if (error) { toast(erroAmigavel(error), 'erro'); return false; }
    await sb.from('disparos').update({ status: 'cancelado', erro: 'Lead foi pra geladeira pela decisão do Marcelo' }).eq('empresa_id', empresaId).eq('status', 'rascunho');
    const estagio = { geladeira: 'followup', perdido: 'perdido', ganho: 'ganho' }[tipo];
    if (estagio) await sb.from('empresas').update({ estagio, proxima_acao: volta ? `Voltar a tentar (agente acorda sozinho)` : null, proxima_acao_em: volta ? volta.toISOString() : null }).eq('id', empresaId);
    await diario(empresaId, `Marcelo aprovou: ${tipo === 'geladeira' ? `geladeira até ${volta ? volta.toLocaleDateString('pt-BR', { timeZone: 'America/Bahia' }) : 'sem data'}` : tipo}${forcar && forcar !== r.tipo ? ` (a recomendação era ${r.tipo})` : ''}`, 'nota');
    toast(tipo === 'geladeira' ? `Na geladeira. ${espDe(a)?.nome || 'O agente'} volta ${volta ? quando(volta) : 'quando você reativar'}.` : tipo === 'perdido' ? 'Encerrado como perdido' : 'Marcado como ganho');
    return true;
  }
  async function continuarAcompanhando(empresaId) {
    await sb.from('agentes').update({ recomendacao: null, precisa_de_voce: null, fase: 'esperando_lead' }).eq('empresa_id', empresaId);
    await anotar(empresaId, 'O Marcelo mandou continuar acompanhando em vez de parar. Não recomende parar de novo sem fato novo.', 'correcao');
    await diario(empresaId, 'Marcelo mandou continuar acompanhando', 'nota');
    toast('Continua acompanhando. O agente guardou a sua decisão.');
    return true;
  }

  async function outraOpcao(empresaId, motivo = {}) {
    const ops = pendentes(empresaId);
    const { texto: m, nicho } = motivo;
    if (nicho && m) await licaoDoNicho(empresaId, m);
    if (ops.length) await sb.from('disparos').update({ status: 'cancelado', erro: `Outra opção pedida pelo Marcelo${m ? `: ${m}` : ''}` }).in('id', ops.map((d) => d.id));
    if (m) await anotar(empresaId, `Pediu outra opção no lugar de «${ops.map((d) => d.texto.slice(0, 120)).join('» e «')}»: ${m}`, 'correcao');
    await diario(empresaId, `Marcelo pediu outra opção${m ? `: ${m}` : ''}`);
    await pedirCiclo(empresaId, 'pedido', `O Marcelo pediu OUTRA opção pra ${ops.length ? `o ${TIPO[ops[0].tipo] || `passo ${ops[0].passo}`}` : 'a próxima mensagem'}. ${m ? `O que ele quer diferente: ${m}` : 'Ele não disse o motivo: escreva por um ângulo diferente das que saíram, não a mesma com outras palavras.'} As que ele recusou: ${ops.map((d) => `«${d.texto}»`).join(' / ') || 'nenhuma pendente'}.`);
    toast('Pedido. A versão nova volta pra Mesa quando o agente terminar.', 'info');
    return true;
  }

  async function naoMandar(empresaId, motivo = {}) {
    const ops = pendentes(empresaId);
    const { texto: m, nicho } = motivo;
    if (nicho && m) await licaoDoNicho(empresaId, m);
    if (ops.length) await sb.from('disparos').update({ status: 'cancelado', erro: m || null }).in('id', ops.map((d) => d.id));
    await sb.from('agentes').update({ fase: 'esperando_lead', precisa_de_voce: null }).eq('empresa_id', empresaId);
    await diario(empresaId, `Marcelo decidiu não mandar${m ? `: ${m}` : ''}`);
    toast('Rejeitada. Nada vai sair, e o agente guardou o motivo.');
    return true;
  }

  async function responderAgente(empresaId, texto, btn) {
    if (!texto) { toast('Escreva o que você viu ou decidiu', 'erro'); return false; }
    botaoCarregando(btn, true);
    try {
      await anotar(empresaId, texto);
      await sb.from('agentes').update({ precisa_de_voce: null }).eq('empresa_id', empresaId);
      await diario(empresaId, `Marcelo respondeu: ${texto}`);
      await pedirCiclo(empresaId, 'pedido', `O Marcelo respondeu ao que você pediu: ${texto}`);
      toast('O agente recebeu e vai pensar de novo', 'info');
    } catch (e) { toast(erroAmigavel(e), 'erro'); botaoCarregando(btn, false); return false; }
    return true;
  }

  async function mudarStatus(empresaId, status) {
    const a = ags.find((x) => x.empresa_id === empresaId);
    if (status === 'ativo' && a.status !== 'ativo' && ags.filter((x) => x.status === 'ativo').length >= LIMITE_AGENTES) { toast(`Já há ${LIMITE_AGENTES} leads acompanhados, o limite. Pause ou encerre um antes.`, 'erro'); return; }
    const texto = { ativo: 'reativado', pausado: 'pausado', encerrado: 'encerrado' }[status];
    const campos = { status };
    if (status === 'ativo' && ['geladeira', 'ganho', 'perdido'].includes(a.fase)) campos.fase = 'novo';
    const { error } = await sb.from('agentes').update(campos).eq('empresa_id', empresaId);
    if (error) { toast(erroAmigavel(error), 'erro'); return; }
    if (status !== 'ativo') await sb.from('jobs').update({ status: 'cancelado', erro: 'Agente pausado ou encerrado' }).eq('tipo', 'agente_ciclo').eq('empresa_id', empresaId).eq('status', 'fila');
    await diario(empresaId, `Agente ${texto} pelo Marcelo`);
    if (status === 'ativo') { a.status = 'ativo'; await pedirCiclo(empresaId, 'designado', 'Reativado pelo Marcelo na Mesa'); }
    toast(`Agente ${texto}`);
    carregar(true);
  }

  async function novoAgente() {
    const ativos = ags.filter((a) => a.status === 'ativo').length;
    if (ativos >= LIMITE_AGENTES) { toast(`Já há ${LIMITE_AGENTES} leads acompanhados, o limite. Pause ou encerre um antes.`, 'erro'); return; }
    const com = new Set(ags.filter((a) => a.status === 'ativo').map((a) => a.empresa_id));
    const candidatas = estado.empresas.filter((e) => !com.has(e.id) && (e.relacao || 'lead') !== 'cliente' && !['ganho', 'perdido'].includes(e.estagio))
      .sort((x, y) => String(x.nome).localeCompare(y.nome));
    const md = modal({ titulo: 'Acompanhar um lead', subtitulo: `O lead ganha um agente com memória própria, e o especialista do nicho dele passa a cuidar. ${ativos}/${LIMITE_AGENTES} leads acompanhados.`, icone: 'robo',
      corpo: `<label class="rotulo" for="ag-emp">Lead</label><input class="inp mt-8" id="ag-emp" list="ag-lista" placeholder="Digite o nome">
        <datalist id="ag-lista">${candidatas.map((e) => `<option value="${esc(e.nome)}">`).join('')}</datalist>
        <label class="rotulo mt-12" for="ag-pedido" style="display:block">Algo que ele precisa saber (opcional)</label><textarea class="txt mt-8" id="ag-pedido" rows="3" placeholder="Ex.: a sócia já disse que não quer site agora."></textarea>`,
      pe: `<button class="btn" data-fechar>Cancelar</button><button class="btn prim" data-ok>${icone('robo')}Designar</button>` });
    $('[data-ok]', md.el).onclick = async (ev) => {
      const nome = $('#ag-emp', md.el).value.trim();
      const e = candidatas.find((x) => x.nome === nome) || candidatas.filter((x) => x.nome.toLowerCase().includes(nome.toLowerCase()))[0];
      if (!nome || !e) { toast('Escolha um lead da lista', 'erro'); return; }
      const pedido = $('#ag-pedido', md.el).value.trim() || null;
      botaoCarregando(ev.currentTarget, true);
      const existia = ags.find((a) => a.empresa_id === e.id);
      const { data: a, error } = existia
        ? await sb.from('agentes').update({ status: 'ativo', fase: ['geladeira', 'ganho', 'perdido'].includes(existia.fase) ? 'novo' : existia.fase }).eq('id', existia.id).select().single()
        : await sb.from('agentes').insert({ empresa_id: e.id, status: 'ativo', fase: 'novo', designado_por: quem() }).select().single();
      if (error) { toast(erroAmigavel(error), 'erro'); botaoCarregando(ev.currentTarget, false); return; }
      if (!existia) ags.push(a); else existia.status = 'ativo';
      await sb.from('agente_eventos').insert({ agente_id: a.id, empresa_id: e.id, gatilho: 'designado', aconteceu: existia ? 'Agente reativado' : 'Agente designado pra este lead', autor: quem() });
      await sb.from('atividades').insert({ empresa_id: e.id, tipo: 'nota', titulo: existia ? 'Agente de prospecção reativado' : 'Agente de prospecção designado', descricao: pedido, autor: quem() }).then(() => {}, () => {});
      await pedirCiclo(e.id, 'designado', pedido);
      md.fechar();
      toast(`Agente designado pra ${e.nome}`, 'info');
      carregar(true);
    };
  }

  /* ------------------------------ eventos ------------------------------ */
  v.addEventListener('input', aoDigitar);
  v.addEventListener('keydown', (ev) => {
    const livre = ev.target.closest?.('[data-livre]');
    if (livre && ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey)) { ev.preventDefault(); $('[data-a="enviar-livre"]', livre.closest('[data-escrever]'))?.click(); }
  });

  v.addEventListener('click', async (ev) => {
    if (ev.target.closest('[data-novo]')) return novoAgente();
    if (ev.target.closest('[data-atualizar]')) return desenhar();
    if (ev.target.closest('[data-revisar-fila]')) { const f = filaSuaVez(); return f[0] && abrirRevisao(f[0].empresa_id); }
    const mp = ev.target.closest('[data-mapa]');
    if (mp) return abrirMapa(mp);
    const dm = ev.target.closest('[data-esp-demandas]');
    if (dm) return abrirDemandas(dm.dataset.espDemandas, dm);
    const ea = ev.target.closest('[data-esp-aba]');
    // Trocar de especialista mostra TODOS os leads dele (01/10: com "Esperando você" ligado, o Rafa aparecia vazio)
    if (ea) { filtroEsp = ea.dataset.espAba || null; filtroLista = 'todos'; sel = null; return desenhar(); }
    const fi = ev.target.closest('[data-abrir-ficha]');
    if (fi) return (await import('../ficha.js')).abrirFicha(fi.dataset.abrirFicha);
    const il = ev.target.closest('[data-ir-lead]');
    if (il) return irAoLead(il.dataset.irLead);
    const fe = ev.target.closest('[data-esp-filtro]');
    if (fe) { filtroEsp = filtroEsp === fe.dataset.espFiltro ? null : fe.dataset.espFiltro; sel = null; return desenhar(); }
    const cad = ev.target.closest('[data-caderno]');
    if (cad) return abrirCaderno(cad.dataset.caderno);
    const abaOp = ev.target.closest('[data-aba-op]');
    if (abaOp) return trocarOpcao(abaOp);
    const pq = ev.target.closest('.mesa-porque, .rev-clamp');
    if (pq) { pq.classList.toggle('aberto'); return; }
    const bolha = ev.target.closest('.rev-bolha[readonly]');
    if (bolha) return editar(bolha.closest('.rev-rascunho'));
    const sl = ev.target.closest('[data-sel]');
    if (sl) {
      if (sl.dataset.sel === sel) return;
      if (editando() && !(await confirmar('Trocar de lead?', 'O texto que você editou neste lead ainda não foi aprovado e vai se perder.', { rotulo: 'Trocar' }))) return;
      sel = sl.dataset.sel; desenhar();
      $('.mesa-centro', v)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      return;
    }
    const lf = ev.target.closest('[data-lista-filtro]');
    if (lf) {
      filtroLista = lf.dataset.listaFiltro; sel = null;
      try { localStorage.setItem('hd.mesa.lista', filtroLista); } catch { /* sem armazenamento: só não lembra */ }
      desenhar();
      // clicou no resumo do time: leva até a lista já filtrada
      if (!lf.closest('.lista-card')) $('.lista-card', v)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    const nt = ev.target.closest('[data-aceitar],[data-descartar-nota]');
    if (nt) {
      const id = nt.dataset.aceitar || nt.dataset.descartarNota;
      const status = nt.dataset.aceitar ? 'valida' : 'descartada';
      const { error } = await sb.from('especialista_notas').update({ status, decidido_em: new Date().toISOString(), autor: quem() }).eq('id', id);
      if (error) { toast(erroAmigavel(error), 'erro'); return; }
      toast(status === 'valida' ? 'Lição aceita: vale pra todo o nicho' : 'Lição descartada');
      return carregar(true);
    }
    const ab = ev.target.closest('[data-abrir-agente]');
    if (ab) { ev.preventDefault(); return abrirAgente(ab.dataset.abrirAgente); }
    const mn = ev.target.closest('[data-menu-ag]');
    if (mn) {
      const id = mn.dataset.menuAg; const a = ags.find((x) => x.empresa_id === id);
      const { menu } = await import('../ui.js');
      return menu(mn, [
        { icone: 'robo', rotulo: 'Abrir o agente', fn: () => abrirAgente(id) },
        { icone: 'predio', rotulo: 'Abrir a ficha', fn: async () => (await import('../ficha.js')).abrirFicha(id) },
        { icone: 'atualizar', rotulo: 'Pedir pra pensar de novo', fn: async () => { await pedirCiclo(id, 'pedido', 'O Marcelo pediu uma releitura do lead na Mesa'); toast('Pedido ao agente', 'info'); carregar(true); } },
        a.status === 'ativo'
          ? { icone: 'pausa', rotulo: 'Pausar', fn: () => mudarStatus(id, 'pausado') }
          : { icone: 'play', rotulo: 'Reativar', fn: () => mudarStatus(id, 'ativo') },
        ...(a.status !== 'encerrado' ? [{ icone: 'x', rotulo: 'Encerrar', fn: async () => { if (await confirmar('Encerrar este agente?', 'Ele para de pensar e sai do limite. A memória e o diário ficam guardados.', { rotulo: 'Encerrar' })) mudarStatus(id, 'encerrado'); } }] : []),
      ]);
    }
    const b = ev.target.closest('[data-a]'); if (!b) return;
    const rev = b.closest('[data-rev]');
    if (rev) { if (await acaoRevisao(b, rev)) { sel = null; carregar(true); } return; }
    const card = b.closest('[data-ag]'); const empresaId = card?.dataset.ag;
    const acao = b.dataset.a;
    const linhaDisp = b.closest('[data-disp]');
    if (linhaDisp && ['reagendar', 'desagendar', 'reenviar'].includes(acao)) {
      const d = disp.find((x) => x.id === linhaDisp.dataset.disp); if (!d) return;
      if (acao === 'desagendar') {
        const { error } = await sb.from('disparos').update({ status: 'rascunho', agendado_para: null, lote_id: null, aprovado_por: null, aprovado_em: null }).eq('id', d.id).in('status', ['agendado', 'aprovado']);
        if (error) { toast(erroAmigavel(error), 'erro'); return; }
        await diario(d.empresa_id, 'Marcelo cancelou o envio agendado; a mensagem voltou pra aprovação', 'nota');
        toast('Envio cancelado. A mensagem voltou pra sua aprovação.', 'info'); sel = d.empresa_id; return carregar(true);
      }
      const h = acao === 'reenviar' ? (naJanela(Date.now() + 60000) ? new Date(Date.now() + 60000) : proximaAbertura(Date.now()))
        : await escolherHorario({ titulo: 'Reagendar', subtitulo: `Hoje está marcada pra ${d.agendado_para ? quando(d.agendado_para) : 'a próxima vaga'}.`, atual: d.agendado_para });
      if (!h) return;
      const { error } = await sb.from('disparos').update({ status: 'agendado', agendado_para: h.toISOString(), lote_id: crypto.randomUUID(), erro: null }).eq('id', d.id);
      if (error) { toast(erroAmigavel(error), 'erro'); return; }
      await diario(d.empresa_id, `${acao === 'reenviar' ? 'Marcelo mandou tentar de novo' : 'Marcelo reagendou'}: sai ${quando(h)}`, 'nota');
      toast(`Sai ${quando(h)}`, 'info'); sel = d.empresa_id; return carregar(true);
    }
    if (acao === 'enviar-livre') return enviarLivre(empresaId, b);
    if (acao === 'reativar') return mudarStatus(empresaId, 'ativo');
    if (acao === 'pensar') { await pedirCiclo(empresaId, 'pedido', 'O Marcelo pediu uma releitura do lead na Mesa'); toast('Pedido ao agente', 'info'); return carregar(true); }
  });

  await carregar(true);
  if (params.lead && params.revisar) abrirRevisao(params.lead);
  else if (params.lead) requestAnimationFrame(() => $('.mesa-centro', v)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  const recarregar = debounce(() => carregar(), 600);
  const tiras = [ouvir('agentes', recarregar), ouvir('disparos', recarregar), ouvir('jobs', (p) => { if (p.new?.tipo === 'agente_ciclo' || p.old?.tipo === 'agente_ciclo') recarregar(true); }),
    ouvir('whatsapp_mensagens', recarregar), ouvir('agente_eventos', recarregar), ouvir('especialista_notas', recarregar), ouvir('whatsapp_conversas', recarregar), ouvir('farejador_status', debounce(avisoFarejador, 800))];
  return () => { tiras.forEach((f) => f()); cena?.destruir(); gav?.fechar(true); $$('.demandas-pop').forEach((x) => x.remove()); };
}

/* =============================================================================
   O agente de um lead: plano, memória, diário. Abre da Mesa e da ficha.
   ============================================================================= */
export async function abrirAgente(empresaId) {
  const e = estado.empresas.find((x) => x.id === empresaId) || { nome: 'Lead' };
  const md = modal({ titulo: `Agente · ${e.nome}`, subtitulo: 'Plano, memória e diário de decisões', icone: 'robo', largo: true, corpo: esqueleto(8, 22), pe: null });
  const { data: a } = await sb.from('agentes').select('*').eq('empresa_id', empresaId).maybeSingle();
  if (!a) {
    md.corpo.innerHTML = vazio('robo', 'Este lead não tem agente', 'Designe na Mesa de agentes, em "Novo agente".', `<a class="btn prim" href="#/agentes">${icone('robo')}Ir pra Mesa</a>`);
    $('a', md.corpo)?.addEventListener('click', () => md.fechar());
    return;
  }
  const { data: evs } = await sb.from('agente_eventos').select('*').eq('agente_id', a.id).order('criado_em', { ascending: false }).limit(30);
  const p = a.plano || {}, m = a.memoria || {};
  const lista = (itens, fmt) => (itens || []).length ? `<ul class="lista-simples">${itens.map((x) => `<li>${fmt(x)}</li>`).join('')}</ul>` : '<p class="dim">Nada ainda.</p>';
  const txt = (x) => esc(typeof x === 'string' ? x : x.fato || x.texto || JSON.stringify(x));
  const fonte = (x) => (typeof x === 'object' && (x.fonte || x.data) ? ` <span class="dim">(${esc([x.fonte, x.data].filter(Boolean).join(', '))})</span>` : '');
  const FASE = { novo: 'Novo', trabalhando: 'Trabalhando', pronto_aprovar: 'Pronto pra aprovar', precisa_voce: 'Precisa de você', esperando_lead: 'Esperando o lead', geladeira: 'Geladeira', ganho: 'Ganho', perdido: 'Perdido' };
  md.corpo.innerHTML = `
    <div class="row wrap gap-6"><span class="selo ${a.status === 'ativo' ? 'verde' : 'cinza'}">${esc(a.status)}</span><span class="selo cinza">${esc(FASE[a.fase] || a.fase)}</span>
      <span class="dim" style="font-size:12.5px">${a.ciclos} ciclo${a.ciclos === 1 ? '' : 's'}${a.ultimo_ciclo_em ? ` · último ${relativo(a.ultimo_ciclo_em)}` : ''}${a.proximo_ciclo_em ? ` · volta ${quando(a.proximo_ciclo_em)}` : ''}</span></div>
    ${a.precisa_de_voce ? `<div class="aviso laranja mt-12">${icone('alerta')}<div><b>Pediu a você:</b> ${esc(a.precisa_de_voce)}</div></div>` : ''}
    <h3 class="mt-16">Plano</h3>
    ${p.tese ? `<p class="mt-8"><b>Tese:</b> ${esc(p.tese)}</p>` : '<p class="dim mt-8">Sem plano ainda.</p>'}
    ${p.proxima_jogada ? `<p class="mt-8"><b>Próxima jogada:</b> ${esc(p.proxima_jogada)}</p>` : ''}
    ${p.quando_parar ? `<p class="mt-8"><b>Quando parar:</b> ${esc(p.quando_parar)}</p>` : ''}
    ${a.motivo_proximo ? `<p class="mt-8"><b>Por que volta nessa data:</b> ${esc(a.motivo_proximo)}</p>` : ''}
    <h3 class="mt-16">Memória</h3>
    ${m.quem_e ? `<p class="mt-8"><b>Quem é:</b> ${esc(m.quem_e)}</p>` : ''}
    ${m.decisor ? `<p class="mt-8"><b>Quem decide:</b> ${esc(m.decisor)}</p>` : ''}
    <details class="mt-12" open><summary class="rotulo">Suas correções · ${(m.correcoes || []).length}</summary><div class="mt-8">${lista(m.correcoes, (x) => txt(x) + fonte(x))}</div></details>
    <details class="mt-12"><summary class="rotulo">Fatos · ${(m.fatos || []).length}</summary><div class="mt-8">${lista(m.fatos, (x) => txt(x) + fonte(x))}</div></details>
    <details class="mt-12"><summary class="rotulo">Hipóteses · ${(m.hipoteses || []).length}</summary><div class="mt-8">${lista(m.hipoteses, txt)}</div></details>
    <details class="mt-12"><summary class="rotulo">Objeções esperadas · ${(m.objecoes || []).length}</summary><div class="mt-8">${lista(m.objecoes, txt)}</div></details>
    <details class="mt-12"><summary class="rotulo">Já tentado · ${(m.tentado || []).length}</summary><div class="mt-8">${lista(m.tentado, txt)}</div></details>
    <details class="mt-12"><summary class="rotulo">O que falta descobrir · ${(m.lacunas || []).length}</summary><div class="mt-8">${lista(m.lacunas, txt)}</div></details>
    <h3 class="mt-16">Contar algo ao agente</h3>
    <textarea class="txt mt-8" data-nota rows="2" placeholder="Fato novo, correção ou decisão sua. Vai pra memória dele."></textarea>
    <div class="row wrap mt-8 gap-6"><select class="inp" data-tipo style="max-width:180px"><option value="fato">É um fato</option><option value="correcao">É uma correção</option></select>
      <label class="check"><input type="checkbox" data-reagir checked> Pensar de novo agora</label>${a.especialista_id ? '<label class="check"><input type="checkbox" data-nicho> Vale pro nicho todo</label>' : ''}<span class="grow"></span><button class="btn sm prim" data-salvar>${icone('check')}Guardar</button></div>
    <h3 class="mt-16">Diário</h3>
    <div class="mesa-diario mt-8">${(evs || []).map((x) => `<div class="mesa-evento"><div class="row gap-6"><span class="selo cinza mini">${esc(x.gatilho)}</span><small class="dim">${dataHora(x.criado_em)} · ${esc(x.autor)}</small></div>
      ${x.aconteceu ? `<p><b>Aconteceu:</b> ${esc(x.aconteceu)}</p>` : ''}${x.leitura ? `<p><b>Leu:</b> ${esc(x.leitura)}</p>` : ''}${x.decisao ? `<p><b>Decidiu:</b> ${esc(x.decisao)}${x.porque ? ` · ${esc(x.porque)}` : ''}</p>` : ''}
      ${x.dados?.parecer_critico ? `<details><summary class="dim" style="font-size:12.5px">Parecer do crítico</summary><pre class="mesa-pre">${esc(typeof x.dados.parecer_critico === 'string' ? x.dados.parecer_critico : JSON.stringify(x.dados.parecer_critico, null, 2))}</pre></details>` : ''}</div>`).join('') || '<p class="dim">Sem eventos.</p>'}</div>`;
  $('[data-salvar]', md.corpo).onclick = async (ev) => {
    const texto = $('[data-nota]', md.corpo).value.trim();
    if (!texto) { toast('Escreva a nota', 'erro'); return; }
    const tipo = $('[data-tipo]', md.corpo).value;
    botaoCarregando(ev.currentTarget, true);
    const mem = { ...(a.memoria || {}) };
    const hoje = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Bahia' });
    if (tipo === 'correcao') mem.correcoes = [...(mem.correcoes || []), { texto, data: hoje, fonte: 'Marcelo' }].slice(-30);
    else mem.fatos = [...(mem.fatos || []), { fato: texto, fonte: 'Marcelo', data: hoje }].slice(-60);
    await sb.from('agentes').update({ memoria: mem }).eq('id', a.id);
    await sb.from('agente_eventos').insert({ agente_id: a.id, empresa_id: empresaId, gatilho: 'nota', aconteceu: `${tipo === 'correcao' ? 'Correção' : 'Fato'} de Marcelo: ${texto}`, autor: quem() });
    if ($('[data-nicho]', md.corpo)?.checked) await sb.from('especialista_notas').insert({ especialista_id: a.especialista_id, empresa_id: empresaId, texto, origem: 'marcelo', status: 'valida', autor: quem() });
    if ($('[data-reagir]', md.corpo).checked && a.status === 'ativo') {
      const ev2 = { gatilho: 'pedido', detalhe: `Marcelo acrescentou: ${texto}`, em: new Date().toISOString() };
      const { data: esp } = await sb.from('jobs').select('id,entrada').eq('tipo', 'agente_ciclo').eq('empresa_id', empresaId).eq('status', 'fila').limit(1);
      if (esp?.[0]) await sb.from('jobs').update({ entrada: { ...esp[0].entrada, eventos: [...(esp[0].entrada?.eventos || []), ev2] } }).eq('id', esp[0].id);
      else { await criarJob('agente_ciclo', { eventos: [ev2] }, { empresa_id: empresaId }, 2); await sb.from('agentes').update({ fase: 'trabalhando' }).eq('id', a.id); }
    }
    toast('Guardado na memória do agente');
    md.fechar();
  };
}
