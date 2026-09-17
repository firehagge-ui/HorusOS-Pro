/* =============================================================================
   HOUND DOG — Falar com o Claude (roda pela assinatura, no Farejador: sem API)
   O Claude tem o contexto da Hórus (CLAUDE.md, memória, clientes) e as
   ferramentas do Hound Dog: cria lead, move estágio, agenda, pesquisa.
   ============================================================================= */
import { sb, estado, ouvir, criarJob, farejadorOnline, quem } from '../sb.js';
import { $, $$, el, esc, toast, confirmar, erroAmigavel, relativo, vazio, esqueleto, debounce, preencherMarkdown, copiar, iniciais } from '../ui.js';
import { icone, sparkClaude } from '../icones.js';

const MODELOS = [['opus', 'Opus 5 · mais inteligente'], ['sonnet', 'Sonnet 5 · rápido'], ['haiku', 'Haiku 4.5 · mais rápido']];
const SUGESTOES = [
  'Quem eu devo abordar hoje e por quê?',
  'Resume a Amparo Flores e me diz o próximo passo',
  'Me dá o gancho verdadeiro pra abordar uma oficina sem site em Lauro de Freitas',
  'Como respondo "vou pensar" de um dono de clínica, sem pressionar?',
  'Cria um lead: Pet shop Amigo Fiel, Pituba, sem site, WhatsApp (71) 9xxxx-xxxx',
  'Agenda uma reunião com a irmã do Varo na próxima terça às 15h',
];

export default async function claude(v, { args, params }) {
  let threadId = args[0] || null;
  let threads = [];
  const limpezas = [];
  const pref = (() => { try { return localStorage.getItem('hd-modelo-chat') || estado.config.claude?.modelo_chat || 'opus'; } catch { return 'opus'; } })();
  let modelo = pref;

  v.className = 'vista cheia';
  v.innerHTML = `
    <div class="chat-layout">
      <aside class="chat-threads card pad-0">
        <div class="ct-topo"><button class="btn prim bloco" data-nova>${icone('mais')}Nova conversa</button></div>
        <div class="ct-lista" data-threads>${esqueleto(5, 34)}</div>
      </aside>
      <section class="chat-principal card pad-0">
        <header class="chat-cab">
          <span class="chat-logo">${sparkClaude(26)}</span>
          <div class="grow"><b>Claude</b><div class="dim" style="font-size:12.5px" data-status></div></div>
          <select class="sel sm" data-modelo style="width:auto" aria-label="Modelo">${MODELOS.map(([k, r]) => `<option value="${k}"${k === modelo ? ' selected' : ''}>${r}</option>`).join('')}</select>
          <button class="btn icone sm" data-menu-thread aria-label="Opções da conversa">${icone('pontos')}</button>
        </header>
        <div class="chat-msgs" data-msgs></div>
        <footer class="chat-pe">
          <div data-contexto class="row wrap gap-6"></div>
          <div class="chat-entrada">
            <textarea class="txt" data-texto rows="1" placeholder="Pergunte, peça uma pesquisa ou mande o Claude atualizar o CRM… (Enter envia)"></textarea>
            <button class="btn icone" data-anexar title="Anexar contexto de uma empresa" aria-label="Anexar empresa">${icone('predio')}</button>
            <button class="btn prim" data-enviar aria-label="Enviar">${icone('enviar')}</button>
          </div>
          <p class="chat-nota">O Claude roda pela sua assinatura no Farejador, com o contexto da Hórus. Ele pode errar: confira antes de agir.</p>
        </footer>
      </section>
    </div>`;

  let empresaCtx = params.empresa || null;
  let pesquisaCtx = params.pesquisa || null;

  function desenharStatus() {
    const on = farejadorOnline();
    $('[data-status]', v).innerHTML = on ? '<span class="ponto on"></span> Online · pela sua assinatura, sem API' : '<span class="ponto off"></span> Farejador offline · suas mensagens ficam na fila';
  }

  function desenharContexto() {
    const box = $('[data-contexto]', v);
    const emp = empresaCtx && estado.empresas.find((e) => e.id === empresaCtx);
    box.innerHTML = [
      emp ? `<span class="selo laranja">${icone('predio')}${esc(emp.nome)}<button class="x-mini" data-tirar="empresa" aria-label="Remover contexto">${icone('x')}</button></span>` : '',
      pesquisaCtx ? `<span class="selo violeta">${icone('mercado')}Pesquisa anexada<button class="x-mini" data-tirar="pesquisa" aria-label="Remover contexto">${icone('x')}</button></span>` : '',
    ].join('');
    $$('[data-tirar]', box).forEach((b) => (b.onclick = () => { if (b.dataset.tirar === 'empresa') empresaCtx = null; else pesquisaCtx = null; desenharContexto(); }));
  }

  async function carregarThreads() {
    const { data, error } = await sb.from('chat_threads').select('*').order('atualizado_em', { ascending: false }).limit(100);
    if (error) { $('[data-threads]', v).innerHTML = vazio('alerta', 'Não carregou', erroAmigavel(error)); return; }
    threads = data || [];
    $('[data-threads]', v).innerHTML = threads.length ? threads.map((t) => {
      const emp = t.empresa_id && estado.empresas.find((e) => e.id === t.empresa_id);
      return `<button class="ct-item ${t.id === threadId ? 'on' : ''}" data-t="${t.id}"><span class="ellipsis">${esc(t.titulo)}</span><small class="dim ellipsis">${emp ? `${esc(emp.nome)} · ` : ''}${relativo(t.atualizado_em)}</small></button>`;
    }).join('') : `<div class="vazio" style="padding:20px"><span>Suas conversas com o Claude ficam aqui.</span></div>`;
  }

  async function abrirThread(id) {
    threadId = id;
    history.replaceState(null, '', id ? `#/claude/${id}` : '#/claude');
    $$('[data-t]', v).forEach((b) => b.classList.toggle('on', b.dataset.t === id));
    const box = $('[data-msgs]', v);
    if (!id) { desenharVazio(); return; }
    box.innerHTML = `<div style="padding:24px">${esqueleto(4, 40)}</div>`;
    const t = threads.find((x) => x.id === id);
    if (t?.empresa_id) empresaCtx = t.empresa_id;
    desenharContexto();
    const { data, error } = await sb.from('chat_mensagens').select('*').eq('thread_id', id).order('criado_em');
    if (error) { box.innerHTML = vazio('alerta', 'Não carregou', erroAmigavel(error)); return; }
    box.innerHTML = '';
    for (const m of data || []) box.appendChild(await bolha(m));
    box.scrollTop = box.scrollHeight;
  }

  function desenharVazio() {
    $('[data-msgs]', v).innerHTML = `<div class="chat-vazio"><span class="chat-logo-grande">${sparkClaude(64)}</span><h2>Como posso ajudar a Hórus hoje?</h2>
      <p class="dim">Eu leio a carteira, o funil e a doutrina da casa. Posso pesquisar mercado, preparar abordagem, responder objeção e atualizar o Hound Dog por você.</p>
      <div class="chat-sugestoes">${SUGESTOES.map((s) => `<button class="chip" data-sug="${esc(s)}">${esc(s)}</button>`).join('')}</div></div>`;
    $$('[data-sug]', v).forEach((b) => (b.onclick = () => { const ta = $('[data-texto]', v); ta.value = b.dataset.sug.includes('xxxx') ? b.dataset.sug : b.dataset.sug; ta.focus(); if (!b.dataset.sug.includes('xxxx')) enviar(); }));
  }

  async function bolha(m) {
    const d = el(`<div class="chat-msg ${m.papel}" data-m="${m.id}"></div>`);
    await preencherBolha(d, m);
    return d;
  }
  async function preencherBolha(d, m) {
    if (m.papel === 'user') {
      d.innerHTML = `<div class="cm-corpo"><div class="cm-texto">${esc(m.conteudo)}</div><small class="dim">${esc(m.autor || '')} · ${relativo(m.criado_em)}</small></div><span class="avatar sm">${esc(iniciais(m.autor))}</span>`;
      return;
    }
    const pensando = ['pensando', 'streaming'].includes(m.status) && !m.conteudo;
    const ferr = (m.ferramentas || []).slice(-6);
    d.innerHTML = `<span class="cm-avatar ${['pensando', 'streaming'].includes(m.status) ? 'claude-pensando' : ''}">${sparkClaude(22)}</span>
      <div class="cm-corpo">${ferr.length ? `<div class="cm-ferr">${ferr.map((f) => `<span class="selo ${f.ok === false ? 'vermelho' : 'claude'} mini" title="${esc(f.detalhe || '')}">${icone(f.icone || 'raio')}${esc(f.rotulo || f.nome)}</span>`).join('')}</div>` : ''}
        ${pensando ? `<div class="cm-pensando">${farejadorOnline() ? '<span class="digitando"><i></i><i></i><i></i></span> Pensando…' : `${icone('ampulheta')} Na fila: o Farejador está offline. Respondo assim que ele ligar.`}</div>` : '<div class="md cm-md"></div>'}
        ${m.status === 'erro' ? `<div class="aviso vermelho mt-8">${icone('alerta')}<div>${esc(m.conteudo || 'Algo deu errado.')}</div></div>` : ''}
        ${m.status === 'ok' && m.conteudo ? `<div class="cm-acoes"><button class="btn xs fantasma" data-copiar-m>${icone('copiar')}Copiar</button><small class="dim">${relativo(m.criado_em)}</small></div>` : ''}</div>`;
    const md = $('.cm-md', d);
    if (md && m.status !== 'erro') await preencherMarkdown(md, m.conteudo + (m.status === 'streaming' ? ' ▍' : ''));
    $('[data-copiar-m]', d)?.addEventListener('click', () => copiar(m.conteudo, 'Resposta copiada'));
  }

  async function enviar() {
    const ta = $('[data-texto]', v);
    const texto = ta.value.trim();
    if (!texto) return;
    ta.value = ''; ajustarAltura();
    const btn = $('[data-enviar]', v); btn.disabled = true;
    try {
      if (!threadId) {
        const titulo = texto.length > 60 ? `${texto.slice(0, 57)}…` : texto;
        const { data: t, error } = await sb.from('chat_threads').insert({ titulo, empresa_id: empresaCtx, criado_por: quem() }).select().single();
        if (error) throw error;
        threads.unshift(t); threadId = t.id;
        history.replaceState(null, '', `#/claude/${t.id}`);
        $('[data-msgs]', v).innerHTML = '';
        carregarThreads();
      }
      const { data: u, error: e1 } = await sb.from('chat_mensagens').insert({ thread_id: threadId, papel: 'user', conteudo: texto, autor: quem() }).select().single();
      if (e1) throw e1;
      const { data: a, error: e2 } = await sb.from('chat_mensagens').insert({ thread_id: threadId, papel: 'assistant', conteudo: '', status: 'pensando' }).select().single();
      if (e2) throw e2;
      const box = $('[data-msgs]', v);
      if (!$(`[data-m="${u.id}"]`, box)) box.appendChild(await bolha(u));
      if (!$(`[data-m="${a.id}"]`, box)) box.appendChild(await bolha(a));
      box.scrollTop = box.scrollHeight;
      const job = await criarJob('chat', { thread_id: threadId, mensagem_id: a.id, modelo, empresa_id: empresaCtx, pesquisa_id: pesquisaCtx }, { empresa_id: empresaCtx }, 1);
      await sb.from('chat_mensagens').update({ job_id: job.id }).eq('id', a.id);
      await sb.from('chat_threads').update({ atualizado_em: new Date().toISOString() }).eq('id', threadId);
    } catch (e) { toast(erroAmigavel(e), 'erro'); ta.value = texto; }
    btn.disabled = false;
    ta.focus();
  }

  function ajustarAltura() { const ta = $('[data-texto]', v); ta.style.height = 'auto'; ta.style.height = `${Math.min(220, ta.scrollHeight)}px`; }

  $('[data-texto]', v).addEventListener('input', ajustarAltura);
  $('[data-texto]', v).addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar(); } });
  $('[data-enviar]', v).onclick = enviar;
  $('[data-nova]', v).onclick = () => { threadId = null; empresaCtx = null; pesquisaCtx = null; desenharContexto(); abrirThread(null); $$('[data-t]', v).forEach((b) => b.classList.remove('on')); $('[data-texto]', v).focus(); };
  $('[data-threads]', v).onclick = (e) => { const b = e.target.closest('[data-t]'); if (b) abrirThread(b.dataset.t); };
  $('[data-modelo]', v).onchange = (e) => { modelo = e.target.value; try { localStorage.setItem('hd-modelo-chat', modelo); } catch { /* ok */ } toast(`Modelo: ${MODELOS.find((m) => m[0] === modelo)[1]}`, 'info'); };
  $('[data-anexar]', v).onclick = async () => {
    const { modal } = await import('../ui.js');
    const emps = estado.empresas.filter((e) => !e.arquivado).sort((a, b) => a.nome.localeCompare(b.nome));
    const m = modal({ titulo: 'Anexar uma empresa', subtitulo: 'O Claude recebe a ficha, a linha do tempo e a conversa dela.', icone: 'predio', pe: '',
      corpo: `<div class="busca">${icone('busca')}<input class="inp" data-q placeholder="Buscar…"></div><div class="lista mt-12" data-l style="max-height:340px;overflow:auto"></div>` });
    const des = () => { const q = $('[data-q]', m.el).value.toLowerCase(); $('[data-l]', m.el).innerHTML = emps.filter((e) => e.nome.toLowerCase().includes(q)).slice(0, 50).map((e) => `<button class="item clicavel" style="width:100%;border:0;background:none;color:inherit;text-align:left" data-e="${e.id}"><span class="tit">${esc(e.nome)}</span><span class="sub right">${esc(e.cidade || '')}</span></button>`).join(''); $$('[data-e]', m.el).forEach((b) => (b.onclick = () => { empresaCtx = b.dataset.e; desenharContexto(); m.fechar(); })); };
    $('[data-q]', m.el).oninput = des; des();
  };
  $('[data-menu-thread]', v).onclick = (e) => import('../ui.js').then(({ menu, perguntar }) => menu(e.currentTarget, [
    { icone: 'editar', rotulo: 'Renomear conversa', fn: async () => { if (!threadId) return; const n = await perguntar('Nome da conversa', { valor: threads.find((t) => t.id === threadId)?.titulo || '' }); if (n?.trim()) { await sb.from('chat_threads').update({ titulo: n.trim() }).eq('id', threadId); carregarThreads(); } } },
    { icone: 'lixo', rotulo: 'Apagar conversa', perigo: true, fn: async () => { if (!threadId) return; if (await confirmar('Apagar esta conversa?', '', { rotulo: 'Apagar', perigo: true })) { await sb.from('chat_threads').delete().eq('id', threadId); threadId = null; await carregarThreads(); abrirThread(null); } } },
  ]));

  desenharStatus();
  desenharContexto();
  await carregarThreads();
  if (threadId) await abrirThread(threadId); else desenharVazio();
  if (empresaCtx && !threadId) { const emp = estado.empresas.find((e) => e.id === empresaCtx); if (emp) $('[data-texto]', v).value = `Me dá um resumo de ${emp.nome} e o próximo passo prático.`; }
  if (pesquisaCtx && !threadId) $('[data-texto]', v).value = 'Com base nesta pesquisa, qual o plano de ataque pra esse nicho?';
  $('[data-texto]', v).focus();

  limpezas.push(ouvir('chat_mensagens', async (p) => {
    const m = p.new; if (!m || m.thread_id !== threadId) return;
    const box = $('[data-msgs]', v); if (!box) return;
    const existente = $(`[data-m="${m.id}"]`, box);
    const perto = box.scrollHeight - box.scrollTop - box.clientHeight < 140;
    if (existente) await preencherBolha(existente, m); else box.appendChild(await bolha(m));
    if (perto) box.scrollTop = box.scrollHeight;
  }));
  limpezas.push(ouvir('chat_threads', debounce(carregarThreads, 800)));
  limpezas.push(ouvir('farejador_status', debounce(desenharStatus, 400)));
  return () => limpezas.forEach((f) => f());
}
