/* =============================================================================
   HOUND DOG — casca do app: login, barra lateral, rotas, paleta (Ctrl+K),
   notificações e status do Farejador
   ============================================================================= */
import { sb, estado, carregarBase, ligarTempoReal, desligarTempoReal, ouvir, farejadorOnline } from './sb.js';
import { $, $$, el, esc, toast, menu, debounce, iniciais, relativo, erroAmigavel, botaoCarregando } from './ui.js';
import { icone, sparkClaude, logoHound } from './icones.js';

const ROTAS = {
  inicio: { titulo: 'Início', icone: 'inicio', mod: () => import('./telas/inicio.js') },
  encontrar: { titulo: 'Encontrar clientes', icone: 'radar', mod: () => import('./telas/encontrar.js') },
  mercado: { titulo: 'Mercado', icone: 'mercado', mod: () => import('./telas/mercado.js') },
  esteira: { titulo: 'Esteira', icone: 'esteira', mod: () => import('./telas/esteira.js') },
  conversas: { titulo: 'Conversas', icone: 'whatsapp', mod: () => import('./telas/conversas.js') },
  agenda: { titulo: 'Agenda', icone: 'agenda', mod: () => import('./telas/agenda.js') },
  clientes: { titulo: 'Clientes', icone: 'clientes', mod: () => import('./telas/clientes.js') },
  instagram: { titulo: 'Instagram', icone: 'instagram', mod: () => import('./telas/instagram.js') },
  relatorios: { titulo: 'Relatórios', icone: 'relatorio', mod: () => import('./telas/relatorios.js') },
  claude: { titulo: 'Claude', icone: 'comentario', mod: () => import('./telas/claude.js') },
  ajustes: { titulo: 'Ajustes', icone: 'ajustes', mod: () => import('./telas/ajustes.js') },
  empresa: { titulo: 'Empresa', icone: 'predio', mod: () => import('./telas/esteira.js') },
};
const MENU = ['inicio', 'encontrar', 'mercado', 'esteira', 'conversas', 'agenda', 'clientes', 'instagram', 'relatorios'];

const contadores = { conversas: 0, agenda: 0, esteira: 0 };
let limparTela = null;
let rotaAtual = null;

/* =============================== Login =============================== */
function telaLogin(mensagem = '') {
  document.title = 'Entrar · Hound Dog';
  document.body.innerHTML = '';
  const t = el(`<main class="login">
    <div class="login-card">
      <div class="login-marca">${logoHound(52)}<div><h1>Hound Dog</h1><p>O painel de controle da Hórus</p></div></div>
      <form class="login-form" novalidate>
        <div class="campo"><label for="lg-email">E-mail</label><input class="inp" id="lg-email" type="email" autocomplete="username" required placeholder="voce@exemplo.com"></div>
        <div class="campo"><label for="lg-senha">Senha</label><input class="inp" id="lg-senha" type="password" autocomplete="current-password" required placeholder="Sua senha"></div>
        <div class="login-erro" role="alert">${esc(mensagem)}</div>
        <button class="btn prim lg bloco" type="submit">${icone('setad')}Entrar</button>
        <button class="btn fantasma sm bloco" type="button" data-esqueci>Esqueci a senha</button>
      </form>
      <p class="login-rodape">Acesso restrito aos operadores da Hórus.</p>
    </div>
  </main>`);
  document.body.appendChild(t);
  const form = $('form', t), erro = $('.login-erro', t);
  $('#lg-email', t).focus();
  form.onsubmit = async (e) => {
    e.preventDefault();
    const email = $('#lg-email', t).value.trim(), senha = $('#lg-senha', t).value;
    if (!email || !senha) { erro.textContent = 'Preencha e-mail e senha.'; return; }
    const btn = $('button[type=submit]', t);
    botaoCarregando(btn, true, 'Entrando…'); erro.textContent = '';
    const { error } = await sb.auth.signInWithPassword({ email, password: senha });
    botaoCarregando(btn, false);
    if (error) erro.textContent = /invalid/i.test(error.message) ? 'E-mail ou senha incorretos.' : erroAmigavel(error);
  };
  $('[data-esqueci]', t).onclick = async () => {
    const email = $('#lg-email', t).value.trim();
    if (!email) { erro.textContent = 'Digite seu e-mail acima e clique de novo.'; return; }
    const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname });
    erro.textContent = error ? erroAmigavel(error) : 'Se o e-mail estiver cadastrado, o link de troca de senha chega em instantes.';
  };
}

function telaSemAcesso() {
  document.body.innerHTML = '';
  document.body.appendChild(el(`<main class="login"><div class="login-card">
    <div class="login-marca">${logoHound(52)}<div><h1>Sem acesso</h1><p>Esta conta não é operadora do Hound Dog.</p></div></div>
    <p class="muted">Peça ao dono do painel para adicionar seu e-mail em Ajustes → Operadores.</p>
    <button class="btn bloco mt-16" data-sair>${icone('sair')}Sair</button></div></main>`));
  $('[data-sair]').onclick = () => sb.auth.signOut();
}

function telaCarregando() {
  document.body.innerHTML = `<main class="login"><div class="carregando-app">${logoHound(64)}<div class="digitando"><i></i><i></i><i></i></div><span>Farejando seus dados…</span></div></main>`;
}

/** Tenta de novo antes de desistir: rede instável e banco acordando são comuns. */
async function tentar(fn, vezes = 3) {
  let ultimo;
  for (let i = 0; i < vezes; i++) {
    try { return await fn(); } catch (e) { ultimo = e; await new Promise((r) => setTimeout(r, 400 * (i + 1) ** 2)); }
  }
  throw ultimo;
}

function telaErroCarga(e) {
  document.body.innerHTML = '';
  document.body.appendChild(el(`<main class="login"><div class="login-card">
    <div class="login-marca">${logoHound(52)}<div><h1>Não carregou</h1><p>Você está logado, mas os dados não vieram.</p></div></div>
    <p class="muted">${esc(erroAmigavel(e))}</p>
    <div class="row mt-16"><button class="btn prim grow" data-tentar>${icone('atualizar')}Tentar de novo</button><button class="btn" data-sair>${icone('sair')}Sair</button></div></div></main>`));
  $('[data-tentar]').onclick = () => location.reload();
  $('[data-sair]').onclick = () => sb.auth.signOut();
}

/* =============================== Casca =============================== */
function montarCasca() {
  document.body.innerHTML = '';
  const app = el(`<div class="app">
    <aside class="side" id="side">
      <a class="marca" href="#/inicio" aria-label="Hound Dog, início"><span class="logo">${logoHound(30)}</span><span class="marca-txt"><b>HOUND DOG</b><span>Hórus CRM</span></span></a>
      <div class="side-scroll">
        <nav class="nav" id="nav"></nav>
        <a class="nav-claude" href="#/claude" data-rota="claude"><span class="cl">${sparkClaude(20)}</span><span class="grow">Falar com o Claude<small id="claude-sub">pela sua assinatura</small></span></a>
      </div>
      <div class="side-foot">
        <a class="farejador-mini" href="#/ajustes" id="farejador-mini"></a>
        <div class="usuario">
          <span class="avatar">${esc(iniciais(estado.eu?.nome))}</span>
          <span class="grow"><b>${esc(estado.eu?.nome || '')}</b><span>${estado.eu?.papel === 'dono' ? 'Dono' : 'Operador'} · Hórus</span></span>
          <a class="btn icone sm fantasma" href="#/ajustes" aria-label="Ajustes">${icone('ajustes')}</a>
          <button class="btn icone sm fantasma" data-sair aria-label="Sair">${icone('sair')}</button>
        </div>
      </div>
    </aside>
    <div class="main">
      <header class="topo">
        <button class="btn icone menu-mob" data-menu aria-label="Abrir menu">${icone('menu')}</button>
        <button class="busca-global" data-paleta>${icone('busca')}<span>Buscar empresa, tela ou ação…</span><kbd>Ctrl K</kbd></button>
        <div class="right row gap-6">
          <span class="tempo-real" id="tempo-real" title="Tempo real"><span class="ponto"></span></span>
          <button class="btn icone" data-notif aria-label="Notificações">${icone('sino')}<span class="notif-bolha hide" id="notif-bolha"></span></button>
          <button class="btn prim" data-novo>${icone('mais')}<span class="rotulo-novo">Novo</span></button>
        </div>
      </header>
      <main class="vista" id="vista" tabindex="-1"></main>
    </div>
  </div>`);
  document.body.appendChild(app);
  desenharNav();
  desenharFarejador();

  $('[data-sair]').onclick = async () => { desligarTempoReal(); await sb.auth.signOut(); };
  $('[data-menu]').onclick = () => alternarMenu();
  $('[data-paleta]').onclick = abrirPaleta;
  $('[data-notif]').onclick = (e) => abrirNotificacoes(e.currentTarget);
  $('[data-novo]').onclick = (e) => menu(e.currentTarget, [
    { icone: 'usuariomais', rotulo: 'Novo lead', fn: async () => (await import('./acoes.js')).novoLead() },
    { icone: 'agenda', rotulo: 'Agendar compromisso', fn: async () => (await import('./acoes.js')).agendar() },
    { icone: 'planilha', rotulo: 'Subir planilha do Spark', fn: () => { location.hash = '#/encontrar?aba=spark'; } },
    { icone: 'radar', rotulo: 'Farejar clientes com o Claude', fn: () => { location.hash = '#/encontrar?aba=claude'; } },
    { icone: 'mercado', rotulo: 'Nova pesquisa de mercado', fn: () => { location.hash = '#/mercado?nova=1'; } },
    '-',
    { icone: 'comentario', rotulo: 'Perguntar ao Claude', fn: () => { location.hash = '#/claude'; } },
  ]);
  // Menu do celular: o toque fora fecha e NÃO aciona o que está atrás (a camada come o clique).
  document.addEventListener('click', (e) => {
    const side = $('#side');
    if (side?.classList.contains('aberta') && !side.contains(e.target) && !e.target.closest('[data-menu]')) {
      e.preventDefault(); e.stopPropagation(); alternarMenu(false);
    }
  }, true);
}

/** Abre e fecha o menu do celular (com camada que impede clique no conteúdo atrás). */
function alternarMenu(abrir) {
  const side = $('#side');
  if (!side) return;
  const novo = abrir === undefined ? !side.classList.contains('aberta') : abrir;
  side.classList.toggle('aberta', novo);
  document.body.classList.toggle('menu-aberto', novo);
}

function desenharNav() {
  const nav = $('#nav'); if (!nav) return;
  nav.innerHTML = MENU.map((id) => {
    const r = ROTAS[id];
    const n = contadores[id];
    const badge = n ? `<span class="badge ${id === 'conversas' ? 'verde' : id === 'esteira' ? '' : 'acc'}">${n > 99 ? '99+' : n}</span>` : '';
    return `<a href="#/${id}" data-rota="${id}">${icone(r.icone)}<span>${r.titulo}</span>${badge}</a>`;
  }).join('');
  marcarAtivo();
}

function marcarAtivo() {
  const base = rotaAtual === 'empresa' ? 'esteira' : rotaAtual;
  $$('[data-rota]').forEach((a) => a.classList.toggle('ativo', a.dataset.rota === base));
}

function desenharFarejador() {
  const box = $('#farejador-mini'); if (!box) return;
  const f = estado.farejador;
  const online = farejadorOnline();
  const wa = f?.whatsapp_status || 'desligado';
  const waTxt = { conectado: 'WhatsApp conectado', qr: 'WhatsApp aguardando QR', conectando: 'WhatsApp conectando', desconectado: 'WhatsApp desconectado', desligado: 'WhatsApp desligado', erro: 'WhatsApp com erro' }[wa] || wa;
  box.innerHTML = `<span class="ponto ${online ? 'on pulsa' : 'off'}"></span><span class="grow"><b>Farejador ${online ? 'online' : 'offline'}</b><br>${online ? esc(waTxt) : 'Claude e WhatsApp em espera'}</span>${icone('chevd')}`;
  const sub = $('#claude-sub');
  if (sub) sub.textContent = online ? 'online · sua assinatura' : 'fila · Farejador offline';
}

async function atualizarContadores() {
  try {
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje); amanha.setDate(amanha.getDate() + 1);
    const [conv, ag, at] = await Promise.all([
      sb.from('whatsapp_conversas').select('nao_lidas').gt('nao_lidas', 0).eq('arquivada', false),
      sb.from('agenda').select('id', { count: 'exact', head: true }).gte('inicio', hoje.toISOString()).lt('inicio', amanha.toISOString()).eq('status', 'agendado'),
      sb.from('vw_atencao').select('id', { count: 'exact', head: true }),
    ]);
    contadores.conversas = (conv.data || []).reduce((a, c) => a + (c.nao_lidas || 0), 0);
    contadores.agenda = ag.count || 0;
    contadores.esteira = at.count || 0;
    desenharNav();
  } catch (e) { console.warn('[contadores]', e); }
}
const contadoresDepois = debounce(atualizarContadores, 1500);

/* =============================== Rotas =============================== */
export function parseHash() {
  const h = location.hash.replace(/^#\/?/, '') || 'inicio';
  const [caminho, query] = h.split('?');
  const partes = caminho.split('/').filter(Boolean);
  const params = Object.fromEntries(new URLSearchParams(query || ''));
  return { rota: partes[0] || 'inicio', args: partes.slice(1), params };
}

async function navegar() {
  if (!estado.carregado) return;
  const { rota, args, params } = parseHash();
  const def = ROTAS[rota];
  if (!def) { location.hash = '#/inicio'; return; }
  const vista = $('#vista');
  if (limparTela) { try { limparTela(); } catch (e) { console.error(e); } limparTela = null; }
  rotaAtual = rota;
  marcarAtivo();
  document.title = `${def.titulo} · Hound Dog`;
  vista.className = 'vista';
  vista.innerHTML = `<div class="carregando-tela">${icone('radar')}<span>Carregando ${esc(def.titulo.toLowerCase())}…</span></div>`;
  vista.scrollTop = 0;
  alternarMenu(false);
  try {
    const mod = await def.mod();
    if (parseHash().rota !== rota) return; // o usuário já navegou
    const r = await mod.default(vista, { args, params, rota });
    limparTela = typeof r === 'function' ? r : null;
    if (rota === 'empresa' && args[0]) {
      const { abrirFicha } = await import('./ficha.js');
      abrirFicha(args[0], { aoFechar: () => { if (parseHash().rota === 'empresa') history.replaceState(null, '', '#/esteira'); rotaAtual = 'esteira'; marcarAtivo(); } });
    }
  } catch (e) {
    console.error(e);
    vista.innerHTML = `<div class="vazio">${icone('alerta')}<b>Esta tela não abriu</b><span>${esc(erroAmigavel(e))}</span><button class="btn sm" onclick="location.reload()">${icone('atualizar')}Recarregar</button></div>`;
  }
}

/* =============================== Paleta (Ctrl+K) =============================== */
function abrirPaleta() {
  if ($('.paleta')) return;
  const veu = el('<div class="veu on"></div>');
  const p = el(`<div class="paleta" role="dialog" aria-label="Busca rápida">
    <div class="pin">${icone('busca')}<input placeholder="Buscar empresa, tela ou ação…" aria-label="Buscar"><kbd>Esc</kbd></div>
    <div class="pres"></div></div>`);
  document.body.append(veu, p);
  const inp = $('input', p), res = $('.pres', p);
  let itens = [], sel = 0;
  const fechar = () => { veu.remove(); p.remove(); };
  veu.onclick = fechar;
  const acoes = [
    { g: 'Ações', icone: 'usuariomais', rotulo: 'Novo lead', fn: async () => (await import('./acoes.js')).novoLead() },
    { g: 'Ações', icone: 'agenda', rotulo: 'Agendar compromisso', fn: async () => (await import('./acoes.js')).agendar() },
    { g: 'Ações', icone: 'planilha', rotulo: 'Subir planilha do Spark', fn: () => { location.hash = '#/encontrar?aba=spark'; } },
    { g: 'Ações', icone: 'radar', rotulo: 'Farejar clientes com o Claude', fn: () => { location.hash = '#/encontrar?aba=claude'; } },
    { g: 'Ações', icone: 'mercado', rotulo: 'Nova pesquisa de mercado', fn: () => { location.hash = '#/mercado?nova=1'; } },
    { g: 'Ações', icone: 'comentario', rotulo: 'Perguntar ao Claude', fn: () => { location.hash = '#/claude'; } },
    ...[...MENU, 'claude', 'ajustes'].map((id) => ({ g: 'Telas', icone: ROTAS[id].icone, rotulo: `Ir para ${ROTAS[id].titulo}`, fn: () => { location.hash = `#/${id}`; } })),
  ];
  const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  function desenhar() {
    const q = norm(inp.value.trim());
    const emps = estado.empresas.filter((e) => !q || norm(`${e.nome} ${e.cidade} ${e.categoria} ${e.instagram || ''} ${e.decisor || ''}`).includes(q))
      .slice(0, q ? 12 : 6)
      .map((e) => ({ g: 'Empresas', icone: 'predio', rotulo: e.nome, sub: [e.categoria, e.cidade].filter(Boolean).join(' · '), fn: async () => (await import('./ficha.js')).abrirFicha(e.id) }));
    const acs = acoes.filter((a) => !q || norm(a.rotulo).includes(q));
    itens = [...emps, ...acs];
    sel = Math.min(sel, Math.max(0, itens.length - 1));
    let g = '';
    res.innerHTML = itens.map((it, i) => {
      const cab = it.g !== g ? `<div class="pg rotulo">${esc((g = it.g))}</div>` : '';
      return `${cab}<div class="po ${i === sel ? 'on' : ''}" data-i="${i}">${icone(it.icone)}<span class="ellipsis">${esc(it.rotulo)}</span>${it.sub ? `<small class="ellipsis">${esc(it.sub)}</small>` : ''}</div>`;
    }).join('') || `<div class="vazio">${icone('busca')}<b>Nada encontrado</b><span>Tente outro nome, cidade ou nicho.</span></div>`;
  }
  inp.oninput = () => { sel = 0; desenhar(); };
  inp.onkeydown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(itens.length - 1, sel + 1); desenhar(); $('.po.on', res)?.scrollIntoView({ block: 'nearest' }); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(0, sel - 1); desenhar(); $('.po.on', res)?.scrollIntoView({ block: 'nearest' }); }
    else if (e.key === 'Enter') { e.preventDefault(); const it = itens[sel]; if (it) { fechar(); it.fn(); } }
    else if (e.key === 'Escape') { fechar(); }
  };
  res.onclick = (e) => { const po = e.target.closest('.po'); if (!po) return; const it = itens[+po.dataset.i]; fechar(); it?.fn(); };
  desenhar();
  inp.focus();
}

/* =============================== Notificações =============================== */
const notificacoes = [];
const CHAVE_VISTO = 'hd-notif-visto';
function notificar(n) {
  notificacoes.unshift({ ...n, quando: new Date().toISOString() });
  notificacoes.splice(40);
  const visto = Number(localStorage.getItem(CHAVE_VISTO) || 0);
  const novas = notificacoes.filter((x) => new Date(x.quando).getTime() > visto).length;
  const b = $('#notif-bolha');
  if (b) { b.textContent = novas > 9 ? '9+' : String(novas); b.classList.toggle('hide', !novas); }
}
function abrirNotificacoes(ancora) {
  localStorage.setItem(CHAVE_VISTO, String(Date.now()));
  $('#notif-bolha')?.classList.add('hide');
  $$('.menu-pop').forEach((m) => m.remove());
  const m = el(`<div class="menu-pop notif-pop"><div class="row" style="padding:8px 10px"><b>Notificações</b></div>
    ${notificacoes.length ? notificacoes.map((n, i) => `<button data-i="${i}">${icone(n.icone || 'info')}<span class="grow"><span class="ellipsis" style="display:block">${esc(n.titulo)}</span><small class="dim">${esc(n.texto || '')} · ${relativo(n.quando)}</small></span></button>`).join('')
      : `<div class="vazio" style="padding:18px">${icone('sino')}<span>Nada novo por aqui. Pesquisas, respostas do WhatsApp e lembretes aparecem aqui.</span></div>`}
  </div>`);
  document.body.appendChild(m);
  const r = ancora.getBoundingClientRect();
  m.style.width = '360px'; m.style.left = `${Math.max(8, r.right - 360)}px`; m.style.top = `${r.bottom + 6}px`;
  m.onclick = (e) => { const b = e.target.closest('button[data-i]'); if (!b) return; const n = notificacoes[+b.dataset.i]; m.remove(); if (n?.link) location.hash = n.link; };
  setTimeout(() => document.addEventListener('click', function fora(e) { if (!m.contains(e.target)) { m.remove(); document.removeEventListener('click', fora); } }), 0);
}

const NOMES_JOB = {
  pesquisar_clientes: 'Farejada de clientes', pesquisa_mercado: 'Pesquisa de mercado', enriquecer_empresa: 'Dossiê da empresa',
  analisar_conversa: 'Análise da conversa', chat: 'Resposta do Claude', instagram: 'Coleta do Instagram', ideias_instagram: 'Ideias de conteúdo',
  whatsapp_enviar: 'Mensagem no WhatsApp', enriquecer_lista: 'Enriquecimento da lista', mensagem_personalizada: 'Mensagem personalizada',
};
function ligarNotificacoes() {
  ouvir('jobs', (p) => {
    const j = p.new; if (!j || p.eventType !== 'UPDATE') return;
    if (!['concluido', 'erro'].includes(j.status) || p.old?.status === j.status) return;
    if (['chat', 'analisar_conversa', 'whatsapp_conectar', 'whatsapp_codigo', 'instagram'].includes(j.tipo) && j.status === 'concluido') return;
    const nome = NOMES_JOB[j.tipo] || j.tipo;
    const link = j.tipo === 'pesquisar_clientes' && j.saida?.lista_id ? `#/encontrar/lista/${j.saida.lista_id}`
      : j.tipo === 'pesquisa_mercado' && j.saida?.pesquisa_id ? `#/mercado/${j.saida.pesquisa_id}`
      : j.empresa_id ? `#/empresa/${j.empresa_id}` : null;
    notificar({ icone: j.status === 'erro' ? 'alerta' : 'checkc', titulo: `${nome} ${j.status === 'erro' ? 'falhou' : 'pronta'}`, texto: j.status === 'erro' ? (j.erro || '').slice(0, 80) : (j.progresso || '').slice(0, 80), link });
    if (j.status === 'concluido') toast(`${nome} pronta`, 'ok', link ? { acao: { rotulo: 'Abrir', fn: () => { location.hash = link; } } } : {});
    else toast(`${nome} falhou: ${(j.erro || '').slice(0, 90)}`, 'erro');
  });
  ouvir('whatsapp_mensagens', (p) => {
    if (p.eventType !== 'INSERT' || p.new?.direcao !== 'in') return;
    notificar({ icone: 'whatsapp', titulo: 'Nova mensagem no WhatsApp', texto: (p.new.texto || '').slice(0, 70), link: `#/conversas/${p.new.conversa_id}` });
    contadoresDepois();
  });
  ouvir('whatsapp_conversas', () => contadoresDepois());
  ouvir('agenda', () => contadoresDepois());
  ouvir('empresas', () => contadoresDepois());
  ouvir('farejador_status', () => desenharFarejador());
  ouvir('_conexao', ({ status }) => {
    const p = $('#tempo-real .ponto');
    if (p) { p.className = `ponto ${status === 'SUBSCRIBED' ? 'on' : status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' ? 'off' : 'meio'}`; }
    const t = $('#tempo-real'); if (t) t.title = status === 'SUBSCRIBED' ? 'Tempo real ligado' : `Tempo real: ${status}`;
  });
  setInterval(desenharFarejador, 30000);
}

document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k' && estado.carregado) { e.preventDefault(); abrirPaleta(); }
});

/* =============================== Boot =============================== */
let iniciado = false;
async function iniciar(sessao) {
  estado.sessao = sessao;
  if (!sessao) { iniciado = false; estado.carregado = false; telaLogin(); return; }
  if (iniciado) return;
  iniciado = true;
  telaCarregando();
  try {
    await tentar(carregarBase, 3);
  } catch (e) {
    iniciado = false;
    console.error(e);
    telaErroCarga(e);
    return;
  }
  if (!estado.eu) { telaSemAcesso(); return; }
  montarCasca();
  ligarTempoReal();
  ligarNotificacoes();
  atualizarContadores();
  window.addEventListener('hashchange', navegar);
  navegar();
}

// O callback do Supabase roda dentro da trava de autenticação: chamar o banco aqui dentro
// trava tudo. Por isso o trabalho sai do callback com setTimeout (recomendação do supabase-js).
sb.auth.onAuthStateChange((evento, sessao) => {
  if (evento === 'INITIAL_SESSION' || evento === 'SIGNED_IN') setTimeout(() => iniciar(sessao), 0);
  else if (evento === 'SIGNED_OUT') setTimeout(() => { iniciado = false; estado.carregado = false; desligarTempoReal(); history.replaceState(null, '', location.pathname); telaLogin(); }, 0);
  else if (evento === 'TOKEN_REFRESHED') estado.sessao = sessao;
  else if (evento === 'PASSWORD_RECOVERY') {
    import('./ui.js').then(({ perguntar }) => perguntar('Defina sua nova senha', { rotulo: 'Salvar senha', placeholder: 'Mínimo de 10 caracteres' }))
      .then(async (nova) => { if (nova && nova.length >= 10) { const { error } = await sb.auth.updateUser({ password: nova }); toast(error ? erroAmigavel(error) : 'Senha atualizada', error ? 'erro' : 'ok'); } });
  }
});

export { notificar, atualizarContadores };
