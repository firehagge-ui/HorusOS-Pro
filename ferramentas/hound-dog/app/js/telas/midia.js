/* =============================================================================
   HOUNDER — 📣 Mídia: o que o agente de social media planejou, está fazendo,
   agendou e aprendeu. Abas dentro da tela Instagram.
   Por quê: ferramentas/social/ARQUITETURA.md seção 7.5.
   ============================================================================= */
import { sb, estado, ouvir, criarJob, farejadorOnline } from '../sb.js';
import { $, $$, esc, relativo, dataHora, vazio, esqueleto, toast, erroAmigavel, confirmar, perguntar, modal, debounce } from '../ui.js';
import { icone } from '../icones.js';

const STATUS = {
  planejado: ['cinza', 'Planejado'], criando: ['cinza', 'Criando'], revisao: ['violeta', 'Com o 🎨 Criação'], aguardando: ['laranja', 'Esperando você'],
  ajuste: ['amarelo', 'Ajustando'], aprovado: ['azul', 'Aprovado'], agendado: ['azul', 'Agendado'], publicando: ['azul', 'Publicando'],
  publicado: ['verde', 'No ar'], medido: ['verde', 'Medido'], reprovado: ['cinza', 'Reprovado'], erro: ['vermelho', 'Com problema'],
};
const selo = (s) => { const [c, t] = STATUS[s] || ['cinza', s]; return `<span class="selo ${c} mini">${esc(t)}</span>`; };
const quando = (d) => (d ? `${dataHora(d)} · ${relativo(d)}` : '—');

export const ABAS = [
  ['semana', 'Semana', 'agenda'], ['agenda', 'Agenda', 'relogio'], ['agora', 'Agora', 'raio'], ['caixa', 'Caixa', 'comentario'], ['aprendizados', 'Aprendizados', 'lampada'],
];

/** Cabeçalho do Mídia: liga/desliga e fase. */
export async function barraMidia(el) {
  const cfg = estado.config.midia || (await sb.from('config').select('valor').eq('chave', 'midia').maybeSingle()).data?.valor || {};
  el.innerHTML = `<div class="midia-barra card">
    <div class="grow"><b>📣 Mídia</b><div class="dim midia-sub">Agente de social media, cargo do Conselho. Fase ${esc(cfg.fase || 1)}: ${cfg.fase > 1 ? 'publica sozinho o que já graduou' : 'nada público sai sem você aprovar'}.</div></div>
    <span class="selo ${cfg.ativo ? 'verde' : 'cinza'} mini">${cfg.ativo ? 'trabalhando' : 'pausado'}</span>
    <button class="btn sm" data-midia-liga>${icone(cfg.ativo ? 'pausa' : 'play')}${cfg.ativo ? 'Pausar' : 'Retomar'}</button></div>`;
  $('[data-midia-liga]', el).onclick = async () => {
    const novo = { ...cfg, ativo: !cfg.ativo };
    const { error } = await sb.from('config').update({ valor: novo }).eq('chave', 'midia');
    if (error) return toast(erroAmigavel(error), 'erro');
    estado.config.midia = novo; toast(novo.ativo ? 'Mídia retomado' : 'Mídia pausado: nada roda até você retomar'); barraMidia(el);
  };
}

/** Desenha uma aba do Mídia dentro de `corpo`. Devolve a função que desliga os ouvintes. */
export async function abaMidia(aba, corpo) {
  corpo.innerHTML = esqueleto(6, 26);
  const f = { semana, agenda, agora, caixa, aprendizados }[aba];
  const recarregar = debounce(() => corpo.isConnected && f(corpo), 700);
  await f(corpo);
  const tabs = { semana: ['social_posts'], agenda: ['social_rotinas', 'social_posts'], agora: ['social_acoes', 'jobs'], caixa: ['social_interacoes'], aprendizados: ['social_aprendizados'] }[aba];
  const tiras = tabs.map((t) => ouvir(t, recarregar));
  return () => tiras.forEach((t) => t());
}

/* ------------------------------ Semana: plano e fila de aprovação ------------------------------ */
async function semana(corpo) {
  const { data: posts, error } = await sb.from('social_posts').select('*').eq('marca', 'horus').neq('status', 'reprovado').order('agendado_para', { ascending: true, nullsFirst: false }).limit(40);
  if (error) { corpo.innerHTML = vazio('alerta', 'Não carregou', erroAmigavel(error)); return; }
  const grupos = [
    ['Esperando você', (p) => ['aguardando', 'revisao', 'ajuste'].includes(p.status)],
    ['Agendados', (p) => ['aprovado', 'agendado', 'publicando'].includes(p.status)],
    ['Com problema', (p) => p.status === 'erro'],
    ['No ar', (p) => ['publicado', 'medido'].includes(p.status)],
  ];
  if (!posts.length) {
    corpo.innerHTML = `<div class="card">${vazio('agenda', 'Nada planejado ainda', 'Toda segunda às 8h o Mídia analisa a semana, planeja e escreve 3 posts. Eles aparecem aqui para você aprovar.',
      `<button class="btn prim" data-rodar-semana>${icone('play')}Planejar a semana agora</button>`)}</div>`;
    $('[data-rodar-semana]', corpo).onclick = rodarSemana;
    return;
  }
  corpo.innerHTML = grupos.map(([titulo, filtro]) => {
    const lista = posts.filter(filtro);
    if (!lista.length) return '';
    return `<h3 class="midia-grupo">${esc(titulo)} <span class="badge">${lista.length}</span></h3>${lista.map(cartaoPost).join('')}`;
  }).join('') + `<div class="row mt-16"><button class="btn sm" data-rodar-semana>${icone('play')}Planejar a semana agora</button><span class="dim" style="font-size:12.5px">Normalmente roda sozinho na segunda, 8h.</span></div>`;
  $$('[data-rodar-semana]', corpo).forEach((b) => (b.onclick = rodarSemana));
  $$('[data-acao]', corpo).forEach((b) => (b.onclick = () => acaoPost(b.dataset.acao, posts.find((p) => p.id === b.dataset.id), corpo)));
  $$('[data-slides]', corpo).forEach((b) => (b.onclick = () => verSlides(posts.find((p) => p.id === b.dataset.slides))));
}

function cartaoPost(p) {
  const rev = p.revisao || {};
  const esperando = ['aguardando', 'revisao', 'ajuste'].includes(p.status);
  const agendado = ['aprovado', 'agendado'].includes(p.status);
  return `<article class="card midia-post">
    <div class="midia-tira" data-slides="${p.id}" title="Ver os slides">${(p.previa || []).map((src, i) => `<img src="${src}" alt="Slide ${i + 1}" loading="lazy">`).join('') || '<span class="dim">sem prévia</span>'}</div>
    <div class="midia-info">
      <div class="row wrap" style="gap:6px">${selo(p.status)}${p.fixar ? '<span class="selo mini">📌 fixar no topo</span>' : ''}${p.experimento ? '<span class="selo violeta mini">experimento</span>' : ''}${p.pilar ? `<span class="selo cinza mini">${esc(p.pilar)}</span>` : ''}${p.formato ? `<span class="selo cinza mini">${esc(p.formato)}</span>` : ''}</div>
      <h3 class="mt-8">${esc(p.titulo)}</h3>
      <dl class="midia-dl">
        ${p.objetivo ? `<dt>Por que existe</dt><dd>${esc(p.objetivo)}</dd>` : ''}
        ${p.hipotese ? `<dt>O que testa</dt><dd>${esc(p.hipotese)}</dd>` : ''}
        <dt>${p.publicado_em ? 'Publicado' : 'Vai ao ar'}</dt><dd>${quando(p.publicado_em || p.agendado_para)}${p.permalink ? ` · <a href="${esc(p.permalink)}" target="_blank" rel="noopener">ver no Instagram</a>` : ''}</dd>
        ${rev.veredito ? `<dt>🎨 Criação</dt><dd>${rev.veredito === 'aprova' ? 'aprovou' : 'reprovou'}${rev.media ? `, média ${String(rev.media).replace('.', ',')}` : ''}${rev.rodada === 2 ? ' (depois de uma correção)' : ''}${rev.instrucoes ? `<br><span class="dim">${esc(rev.instrucoes)}</span>` : ''}</dd>` : ''}
      </dl>
      ${p.erro ? `<div class="aviso ${p.status === 'erro' ? 'vermelho' : 'laranja'} mt-8">${icone('alerta')}<div>${esc(p.erro)}</div></div>` : ''}
      ${p.pedido_ajuste ? `<div class="aviso mt-8">${icone('editar')}<div><b>Seu pedido:</b> ${esc(p.pedido_ajuste)}</div></div>` : ''}
      <details class="mt-8"><summary class="dim">Legenda</summary><p class="midia-legenda">${esc(p.legenda || '')}</p></details>
      <div class="row wrap mt-12">
        ${esperando ? `<button class="btn prim sm" data-acao="aprovar" data-id="${p.id}">${icone('check')}Aprovar</button>
          <button class="btn sm" data-acao="ajuste" data-id="${p.id}">${icone('editar')}Pedir ajuste</button>
          <button class="btn sm" data-acao="reprovar" data-id="${p.id}">${icone('x')}Reprovar</button>` : ''}
        ${agendado ? `<button class="btn sm" data-acao="data" data-id="${p.id}">${icone('relogio')}Mudar horário</button><button class="btn sm" data-acao="voltar" data-id="${p.id}">${icone('setae')}Voltar para aprovação</button>` : ''}
        ${p.status === 'erro' ? `<button class="btn sm" data-acao="tentar" data-id="${p.id}">${icone('atualizar')}Tentar de novo</button>` : ''}
        <button class="btn sm" data-slides="${p.id}">${icone('quadros')}Ver slides</button>
      </div>
    </div></article>`;
}

async function acaoPost(acao, p, corpo) {
  const upd = (campos) => sb.from('social_posts').update(campos).eq('id', p.id);
  let r;
  if (acao === 'aprovar') r = await upd({ status: 'aprovado', erro: null });
  if (acao === 'reprovar') { if (!(await confirmar('Reprovar este post?', 'Ele sai da fila e não vai ao ar. O Mídia registra como aprendizado.', { rotulo: 'Reprovar', perigo: true }))) return; r = await upd({ status: 'reprovado' }); }
  if (acao === 'voltar') r = await upd({ status: 'aguardando' });
  if (acao === 'tentar') r = await upd({ status: 'agendado', erro: null, agendado_para: new Date().toISOString() });
  if (acao === 'data') {
    const atual = p.agendado_para ? new Date(new Date(p.agendado_para).getTime() - 3 * 3600000).toISOString().slice(0, 16).replace('T', ' ') : '';
    const v = await perguntar('Novo horário (Bahia)', { valor: atual, placeholder: '2026-09-30 12:00', subtitulo: 'Formato AAAA-MM-DD HH:MM' });
    if (!v) return;
    const d = new Date(`${v.trim().replace(' ', 'T')}:00-03:00`);
    if (Number.isNaN(d.getTime())) return toast('Data não entendida', 'erro');
    r = await upd({ agendado_para: d.toISOString(), status: 'agendado' });
  }
  if (acao === 'ajuste') {
    if (!p.conteudo) return toast('Esse post foi feito à mão: o ajuste é no arquivo. Peça no chat do Claude.', 'info');
    const texto = await perguntar('O que mudar?', { multilinha: true, rotulo: 'Pedir ajuste', placeholder: 'Ex.: troca o título da capa por uma pergunta; tira o slide 5.' });
    if (!texto) return;
    r = await upd({ status: 'ajuste', pedido_ajuste: texto });
    if (!r.error) { await criarJob('midia_ajuste', { post_id: p.id }, {}, 4); toast(farejadorOnline() ? 'O Mídia está refazendo' : 'Na fila: roda quando o Farejador ligar', 'info'); }
  }
  if (r?.error) return toast(erroAmigavel(r.error), 'erro');
  if (acao === 'aprovar') toast(p.fixar ? 'Aprovado. Vai ao ar no horário marcado (lembre de fixar no topo pelo app).' : 'Aprovado. Vai ao ar no horário marcado.');
  await sb.from('social_acoes').insert({ marca: 'horus', acao: `marcelo:${acao}`, post_id: p.id, resumo: p.titulo, resultado: 'ok' });
  semana(corpo);
}

function verSlides(p) {
  const m = modal({ titulo: p.titulo, subtitulo: `${(p.previa || []).length} slides · prévia reduzida`, icone: 'quadros', largo: true,
    corpo: `<div class="midia-slides">${(p.previa || []).map((src, i) => `<figure><img src="${src}" alt="Slide ${i + 1}"><figcaption class="dim">${i + 1}</figcaption></figure>`).join('')}</div>`,
    pe: '<button class="btn" data-fechar>Fechar</button>' });
  m.el.querySelectorAll('[data-fechar]').forEach((b) => (b.onclick = () => m.fechar()));
}

async function rodarSemana() {
  const { error } = await sb.from('social_rotinas').update({ proxima: new Date().toISOString() }).eq('id', 'semana');
  if (error) return toast(erroAmigavel(error), 'erro');
  toast(farejadorOnline() ? 'O Mídia começa em até 1 minuto' : 'Marcado: roda quando o Farejador ligar', 'info');
}

/* ------------------------------ Agenda: rotinas e posts marcados ------------------------------ */
async function agenda(corpo) {
  const [{ data: rot }, { data: posts }] = await Promise.all([
    sb.from('social_rotinas').select('*').eq('marca', 'horus').order('proxima', { ascending: true }),
    sb.from('social_posts').select('id,titulo,status,agendado_para').eq('marca', 'horus').in('status', ['aprovado', 'agendado', 'publicando']).order('agendado_para'),
  ]);
  const st = { ok: 'verde', erro: 'vermelho', pulada: 'cinza', rodando: 'azul' };
  corpo.innerHTML = `
    <section class="card"><div class="card-cab"><div class="icone-caixa sm">${icone('agenda')}</div><h3>Posts marcados</h3></div>
      ${posts?.length ? `<ul class="midia-lista">${posts.map((p) => `<li><b>${quando(p.agendado_para)}</b><span>${esc(p.titulo)}</span>${selo(p.status)}</li>`).join('')}</ul>` : '<p class="dim">Nenhum post marcado.</p>'}</section>
    <section class="card mt-16"><div class="card-cab"><div class="icone-caixa sm">${icone('relogio')}</div><div class="grow"><h3>Rotinas do Mídia</h3><p class="dim" style="font-size:12.5px">O que roda sozinho. As marcadas com ✦ usam o Claude (e só quando há trabalho).</p></div></div>
      <div class="midia-rotinas">${(rot || []).map((r) => `<div class="midia-rotina ${r.ativo ? '' : 'off'}">
        <div class="grow"><b>${r.usa_claude ? '✦ ' : ''}${esc(r.nome)}</b><div class="dim" style="font-size:12.5px">${esc(r.quando)} · ${esc(r.descricao || '')}</div>
          ${r.ultima ? `<div style="font-size:12.5px" class="mt-4"><span class="selo ${st[r.ultimo_status] || 'cinza'} mini">${esc(r.ultimo_status || '')}</span> ${relativo(r.ultima)}: ${esc(r.ultimo_resumo || '')}</div>` : '<div class="dim mt-4" style="font-size:12.5px">Ainda não rodou.</div>'}</div>
        <div class="midia-proxima"><span class="dim">próxima</span><b>${r.proxima ? dataHora(r.proxima) : '—'}</b><button class="btn sm" data-rodar="${r.id}">${icone('play')}Rodar agora</button></div>
      </div>`).join('')}</div></section>`;
  $$('[data-rodar]', corpo).forEach((b) => (b.onclick = async () => {
    const { error } = await sb.from('social_rotinas').update({ proxima: new Date().toISOString() }).eq('id', b.dataset.rodar);
    if (error) return toast(erroAmigavel(error), 'erro');
    toast(farejadorOnline() ? 'Roda em até 1 minuto' : 'Marcado: roda quando o Farejador ligar', 'info');
  }));
}

/* ------------------------------ Agora: o que está fazendo e o diário ------------------------------ */
async function agora(corpo) {
  const [{ data: jobs }, { data: acoes }] = await Promise.all([
    sb.from('jobs').select('*').like('tipo', 'midia_%').order('criado_em', { ascending: false }).limit(6),
    sb.from('social_acoes').select('*').eq('marca', 'horus').order('criado_em', { ascending: false }).limit(50),
  ]);
  const vivos = (jobs || []).filter((j) => ['fila', 'processando'].includes(j.status));
  const nomes = { midia_semana: 'Sessão da semana', midia_ajuste: 'Ajuste de post', midia_triagem: 'Triagem de comentários e DMs' };
  const res = { ok: 'verde', erro: 'vermelho', bloqueada: 'amarelo', pendente: 'laranja' };
  corpo.innerHTML = `
    <section class="card"><div class="card-cab"><div class="icone-caixa sm">${icone('raio')}</div><h3>Neste momento</h3></div>
      ${vivos.length ? vivos.map((j) => `<div class="midia-vivo"><span class="selo ${j.status === 'processando' ? 'azul' : 'cinza'} mini">${j.status === 'processando' ? 'trabalhando' : 'na fila'}</span><b>${esc(nomes[j.tipo] || j.tipo)}</b><span class="dim">${esc(j.progresso || '')}</span></div>`).join('')
        : `<p class="dim">Parado agora. ${farejadorOnline() ? 'O Farejador está ligado e o Mídia confere a agenda a cada minuto.' : '⚠ O Farejador está desligado: nada roda até ligar (npm run farejador).'}</p>`}
      ${(jobs || []).filter((j) => j.status === 'erro').slice(0, 1).map((j) => `<div class="aviso vermelho mt-8">${icone('alerta')}<div><b>Última falha:</b> ${esc(nomes[j.tipo] || j.tipo)} · ${esc(j.erro || '')}</div></div>`).join('')}</section>
    <section class="card mt-16"><div class="card-cab"><div class="icone-caixa sm">${icone('livro')}</div><h3>Diário</h3></div>
      ${acoes?.length ? `<ul class="midia-diario">${acoes.map((a) => `<li><span class="dim">${relativo(a.criado_em)}</span><b>${esc(a.acao.replace(/^marcelo:/, 'você: ').replace(/_/g, ' '))}</b>${a.nivel ? `<span class="selo cinza mini">${esc(a.nivel)}</span>` : ''}<span class="selo ${res[a.resultado] || 'cinza'} mini">${esc(a.resultado || '')}</span><span class="grow">${esc(a.resumo || '')}${a.erro ? ` <span class="dim">· ${esc(a.erro)}</span>` : ''}</span></li>`).join('')}</ul>` : '<p class="dim">Nada registrado ainda.</p>'}</section>`;
}

/* ------------------------------ Caixa: comentários e DMs ------------------------------ */
async function caixa(corpo) {
  const { data, error } = await sb.from('social_interacoes').select('*').eq('marca', 'horus').order('recebido_em', { ascending: false }).limit(60);
  if (error) { corpo.innerHTML = vazio('alerta', 'Não carregou', erroAmigavel(error)); return; }
  if (!data.length) { corpo.innerHTML = `<div class="card">${vazio('comentario', 'Caixa vazia', 'Comentários e DMs aparecem aqui já triados (lead, dúvida, spam) e com um rascunho de resposta. Responder é sempre com você.')}</div>`; return; }
  const cor = { lead: 'laranja', duvida: 'azul', elogio: 'verde', spam: 'cinza', ofensa: 'vermelho', outro: 'cinza' };
  corpo.innerHTML = data.map((i) => `<article class="card midia-msg ${i.status === 'respondido' || i.status === 'ignorado' ? 'feito' : ''}">
    <div class="row wrap" style="gap:6px"><span class="selo mini">${i.tipo === 'dm' ? 'DM' : 'comentário'}</span>${i.classificacao ? `<span class="selo ${cor[i.classificacao]} mini">${esc(i.classificacao)}</span>` : '<span class="selo cinza mini">a triar</span>'}<b>@${esc(i.autor || '?')}</b><span class="dim">${relativo(i.recebido_em)}</span>
      ${i.empresa_id ? `<a class="right" href="#/empresa/${i.empresa_id}">${icone('predio')} ficha no Hounder</a>` : ''}</div>
    <p class="mt-8">${esc(i.texto || '')}</p>
    ${i.rascunho ? `<div class="aviso mt-8">${icone('editar')}<div><b>Rascunho do Mídia:</b> ${esc(i.rascunho)}</div></div>` : ''}
    <div class="row wrap mt-8">${i.rascunho ? `<button class="btn sm" data-copiar="${i.id}">${icone('copiar')}Copiar rascunho</button>` : ''}
      ${!['respondido', 'ignorado'].includes(i.status) ? `<button class="btn sm" data-marcar="respondido" data-id="${i.id}">${icone('check')}Já respondi</button><button class="btn sm" data-marcar="ignorado" data-id="${i.id}">${icone('x')}Ignorar</button>` : `<span class="dim">${esc(i.status)}</span>`}</div>
  </article>`).join('');
  $$('[data-copiar]', corpo).forEach((b) => (b.onclick = async () => { await navigator.clipboard.writeText(data.find((i) => i.id === b.dataset.copiar).rascunho); toast('Rascunho copiado'); }));
  $$('[data-marcar]', corpo).forEach((b) => (b.onclick = async () => {
    const { error: e } = await sb.from('social_interacoes').update({ status: b.dataset.marcar }).eq('id', b.dataset.id);
    if (e) return toast(erroAmigavel(e), 'erro');
    caixa(corpo);
  }));
}

/* ------------------------------ Aprendizados ------------------------------ */
async function aprendizados(corpo) {
  const [{ data }, { data: met }] = await Promise.all([
    sb.from('social_aprendizados').select('*').eq('marca', 'horus').order('criado_em', { ascending: false }).limit(60),
    sb.from('social_metricas').select('janela,valores,coletado_em,post_id').eq('marca', 'horus').neq('janela', 'conta').order('coletado_em', { ascending: false }).limit(30),
  ]);
  const tipo = { preferencia: ['azul', 'você disse'], evidencia: ['verde', 'medido'], hipotese: ['violeta', 'hipótese'] };
  corpo.innerHTML = `<div class="aviso">${icone('info')}<div>Três gavetas: <b>você disse</b> (vira regra), <b>medido</b> (sustentado por número) e <b>hipótese</b> (o Mídia acha; só vira regra depois de testar). Conta pequena: nenhuma conclusão sai de um post só.</div></div>
    ${data?.length ? data.map((a) => `<article class="card midia-aprendizado mt-12 ${a.status === 'descartado' ? 'feito' : ''}">
      <div class="row wrap" style="gap:6px"><span class="selo ${tipo[a.tipo]?.[0] || 'cinza'} mini">${tipo[a.tipo]?.[1] || a.tipo}</span><span class="selo cinza mini">${esc(a.status)}</span><span class="dim">${relativo(a.criado_em)}</span></div>
      <p class="mt-8">${esc(a.texto)}</p>
      ${a.status === 'aberto' ? `<div class="row mt-8"><button class="btn sm" data-apr="confirmado" data-id="${a.id}">${icone('check')}Faz sentido</button><button class="btn sm" data-apr="descartado" data-id="${a.id}">${icone('x')}Descartar</button></div>` : ''}
    </article>`).join('') : `<div class="card mt-12">${vazio('lampada', 'Nada aprendido ainda', 'Depois das primeiras semanas no ar, o Mídia registra aqui o que os números mostram e o que ele quer testar.')}</div>`}
    <p class="dim mt-16" style="font-size:12.5px">${met?.length ? `${met.length} coleta(s) de métricas de post no banco.` : 'Métricas de post começam 24 h depois do primeiro post no ar.'}</p>`;
  $$('[data-apr]', corpo).forEach((b) => (b.onclick = async () => {
    const { error } = await sb.from('social_aprendizados').update({ status: b.dataset.apr }).eq('id', b.dataset.id);
    if (error) return toast(erroAmigavel(error), 'erro');
    aprendizados(corpo);
  }));
}
