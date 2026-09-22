/* =============================================================================
   HOUND DOG — Conversas: WhatsApp com leitura do Claude e resposta na ponta da língua
   Envio 1 a 1, aprovado por humano. Nada de disparo em massa (doutrina da casa).
   ============================================================================= */
import { sb, estado, ouvir, criarJob, farejadorOnline, salvarEmpresa, registrarAtividade, quem } from '../sb.js';
import { $, $$, el, esc, toast, confirmar, erroAmigavel, botaoCarregando, copiar, relativo, dataHora, hora, vazio, esqueleto, debounce, iniciais, telefoneBonito, linkWhats, modal } from '../ui.js';
import { icone, sparkClaude } from '../icones.js';
import { detectarObjecoes, pareceBot, temperaturaRapida } from '../copiloto.js';
import { abrirFicha, seloEstagio } from '../ficha.js';
import { novoLead, moverEstagio } from '../acoes.js';

export default async function conversas(v, { args }) {
  let selecionada = args[0] || null;
  let filtro = 'leads', busca = '';
  let lista = [];
  let ajustouFiltro = false;
  const limpezas = [];

  v.className = 'vista cheia';
  v.innerHTML = `
    <div class="cab"><div class="tt"><h1>Conversas</h1><p>Quem respondeu, a leitura do Claude e o que dizer em seguida.</p></div>
      <div class="acoes" data-conexao></div></div>
    <div data-banner></div>
    <div class="inbox">
      <aside class="inbox-lista card pad-0">
        <div class="inbox-topo"><div class="busca">${icone('busca')}<input class="inp sm" data-busca placeholder="Buscar nome, telefone ou mensagem…"></div>
          <div class="chips mt-8" data-filtros>${[['leads', 'Leads'], ['objecao', 'Com objeção'], ['nao_lidas', 'Não lidas'], ['todas', 'Todas'], ['silenciadas', 'Pessoais'], ['arquivadas', 'Arquivadas']].map(([k, r]) => `<button class="chip ${k === filtro ? 'on' : ''}" data-f="${k}">${r}</button>`).join('')}</div></div>
        <div class="inbox-itens" data-itens>${esqueleto(6, 40)}</div>
      </aside>
      <section class="inbox-conversa card pad-0" data-conversa>${vazio('whatsapp', 'Escolha uma conversa', 'A leitura do Claude e as respostas sugeridas aparecem aqui.')}</section>
    </div>`;

  function desenharConexao() {
    const f = estado.farejador || {};
    const online = farejadorOnline();
    const st = online ? f.whatsapp_status : 'offline';
    const rot = { conectado: ['verde', `Conectado${f.whatsapp_numero ? ` · ${telefoneBonito(f.whatsapp_numero)}` : ''}`], qr: ['amarelo', 'Aguardando QR'], conectando: ['amarelo', 'Conectando…'], desconectado: ['vermelho', 'Desconectado'], desligado: ['cinza', 'WhatsApp desligado'], erro: ['vermelho', 'Erro na conexão'], offline: ['cinza', 'Farejador offline'] }[st] || ['cinza', st];
    $('[data-conexao]', v).innerHTML = `<span class="selo ${rot[0]}"><span class="ponto ${st === 'conectado' ? 'on' : ''}"></span>${esc(rot[1])}</span>
      <button class="btn" data-religar title="Procura o número de cada conversa nas fichas do CRM e liga as duas pontas">${icone('link')}Ligar às fichas</button>
      <button class="btn ${st === 'conectado' ? '' : 'prim'}" data-conectar>${icone(st === 'conectado' ? 'ajustes' : 'qr')}${st === 'conectado' ? 'Conexão' : 'Conectar WhatsApp'}</button>`;
    $('[data-conectar]', v).onclick = () => modalConexao();
    $('[data-religar]', v)?.addEventListener('click', (ev) => religarFichas(ev.currentTarget));
    const banner = $('[data-banner]', v);
    if (!online) banner.innerHTML = `<div class="aviso laranja mb-16">${icone('alerta')}<div><b>O Farejador está offline.</b> Sem ele o WhatsApp não sincroniza e o Claude não analisa. As mensagens que você mandar ficam na fila. Ligue pelo atalho <b>Hound Dog Farejador</b> ou <code>npm run farejador</code> na pasta <code>ferramentas/hound-dog</code>.</div></div>`;
    else if (st !== 'conectado') banner.innerHTML = `<div class="aviso laranja mb-16">${icone('qr')}<div><b>WhatsApp não conectado.</b> Conecte o número comercial para as conversas chegarem aqui com a leitura do Claude.</div><button class="btn sm prim right" data-conectar2>Conectar</button></div>`;
    else banner.innerHTML = '';
    $('[data-conectar2]', v)?.addEventListener('click', () => modalConexao());
  }

  async function carregarLista() {
    if (!v.isConnected) return;
    let q = sb.from('whatsapp_conversas').select('*').order('ultima_em', { ascending: false, nullsFirst: false }).limit(400);
    q = filtro === 'arquivadas' ? q.eq('arquivada', true) : q.eq('arquivada', false);
    const { data, error } = await q;
    if (error) { $('[data-itens]', v).innerHTML = vazio('alerta', 'Não carregou', erroAmigavel(error)); return; }
    lista = data || [];
    // O filtro "Leads" só mostra conversa ligada a uma ficha. Enquanto nenhuma
    // estiver ligada, ele abriria vazio e daria a impressão de que o WhatsApp
    // não chegou: nesse caso a tela abre em "Todas".
    if (!ajustouFiltro) {
      ajustouFiltro = true;
      if (filtro === 'leads' && lista.length && !lista.some((c) => c.empresa_id)) {
        filtro = 'todas';
        $$('[data-f]', v).forEach((x) => x.classList.toggle('on', x.dataset.f === 'todas'));
      }
    }
    desenharLista();
  }

  /** Liga conversa ↔ ficha pelos 8 dígitos finais (WhatsApp ou telefone da ficha). */
  async function religarFichas(btn) {
    botaoCarregando(btn, true, 'Ligando…');
    try {
      const { data: soltas, error } = await sb.from('whatsapp_conversas').select('id,telefone').is('empresa_id', null);
      if (error) throw error;
      const fim = (x) => String(x || '').replace(/\D/g, '').slice(-8);
      const fichas = estado.empresas.filter((e) => !e.arquivado && (e.whatsapp || e.telefone));
      let n = 0;
      for (const c of soltas || []) {
        const alvo = fim(c.telefone);
        if (alvo.length < 8) continue;
        const emp = fichas.find((e) => fim(e.whatsapp) === alvo) || fichas.find((e) => fim(e.telefone) === alvo);
        if (!emp) continue;
        const { error: er } = await sb.from('whatsapp_conversas').update({ empresa_id: emp.id }).eq('id', c.id);
        if (!er) { n++; await registrarAtividade(emp.id, 'whatsapp', 'Conversa do WhatsApp ligada à ficha', telefoneBonito(c.telefone)).catch(() => {}); }
      }
      toast(n ? `${n} conversa${n > 1 ? 's ligadas' : ' ligada'} à ficha` : 'Nenhuma conversa bateu com uma ficha do CRM', n ? 'ok' : 'info');
      if (n) await carregarLista();
    } catch (e) { toast(erroAmigavel(e), 'erro'); }
    botaoCarregando(btn, false);
  }

  function filtradas() {
    const t = busca.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    return lista.filter((c) => {
      if (c.silenciada && !['todas', 'arquivadas', 'silenciadas'].includes(filtro)) return false;
      if (filtro === 'silenciadas' && !c.silenciada) return false;
      if (filtro === 'leads' && !c.empresa_id) return false;
      if (filtro === 'nao_lidas' && !c.nao_lidas) return false;
      if (filtro === 'objecao' && !(c.analise?.objecoes?.length || (c.ultima_direcao === 'in' && detectarObjecoes(c.ultima_mensagem).length))) return false;
      if (t) { const emp = estado.empresas.find((e) => e.id === c.empresa_id); if (!`${c.nome} ${c.telefone} ${c.ultima_mensagem} ${emp?.nome || ''}`.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().includes(t)) return false; }
      return true;
    });
  }

  function desenharLista() {
    const box = $('[data-itens]', v);
    const lst = filtradas();
    if (!lst.length) {
      const semNada = !lista.length;
      box.innerHTML = vazio('whatsapp', semNada ? 'Nenhuma conversa ainda' : 'Nada neste filtro',
        semNada ? (estado.farejador?.whatsapp_status === 'conectado' ? 'Assim que alguém mandar mensagem, ela aparece aqui.' : 'Conecte o WhatsApp para sincronizar.')
          : filtro === 'leads' ? `Há ${lista.length} conversa${lista.length > 1 ? 's' : ''} sincronizada${lista.length > 1 ? 's' : ''}, nenhuma ligada a uma ficha. Use "Ligar às fichas" no topo ou veja em Todas.` : 'Troque o filtro.',
        filtro === 'leads' ? '<button class="btn sm" data-ver-todas>Ver todas</button>' : '');
      $('[data-ver-todas]', box)?.addEventListener('click', () => { filtro = 'todas'; $$('[data-f]', v).forEach((x) => x.classList.toggle('on', x.dataset.f === 'todas')); desenharLista(); });
      return;
    }
    box.innerHTML = lst.map((c) => {
      const emp = estado.empresas.find((e) => e.id === c.empresa_id);
      const obj = c.analise?.objecoes?.[0]?.rotulo || (c.ultima_direcao === 'in' ? detectarObjecoes(c.ultima_mensagem)[0]?.rotulo : null);
      const nome = emp?.nome || c.nome || telefoneBonito(c.telefone);
      return `<button class="conv-item ${c.id === selecionada ? 'on' : ''}" data-conv="${c.id}">
        <span class="avatar sm ${emp ? '' : 'neutro'}">${esc(iniciais(nome))}</span>
        <span class="grow" style="min-width:0"><span class="row gap-6"><b class="ellipsis">${esc(nome)}</b>${c.nao_lidas ? '<span class="ponto on"></span>' : ''}<small class="dim right nowrap">${c.ultima_em ? (Date.now() - new Date(c.ultima_em) < 86400000 ? hora(c.ultima_em) : new Date(c.ultima_em).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })) : ''}</small></span>
          <span class="row gap-6 mt-4">${emp ? `<span class="selo verde mini">No CRM</span>` : ''}${c.silenciada ? '<span class="selo cinza mini">Pessoal</span>' : ''}${c.bot_detectado ? `<span class="selo cinza mini">${icone('robo')}Bot</span>` : ''}${obj ? `<span class="selo laranja mini">${esc(obj)}</span>` : ''}</span>
          <span class="conv-prev ellipsis">${c.ultima_direcao === 'out' ? 'Você: ' : ''}${esc(c.ultima_mensagem || '')}</span></span>
        ${c.nao_lidas ? `<span class="badge verde">${c.nao_lidas}</span>` : ''}</button>`;
    }).join('');
  }

  async function abrirConversa(id) {
    selecionada = id;
    history.replaceState(null, '', `#/conversas/${id}`);
    desenharLista();
    const painel = $('[data-conversa]', v);
    painel.innerHTML = `<div style="padding:20px">${esqueleto(8, 26)}</div>`;
    const [{ data: c, error }, { data: msgs }] = await Promise.all([
      sb.from('whatsapp_conversas').select('*').eq('id', id).maybeSingle(),
      sb.from('whatsapp_mensagens').select('*').eq('conversa_id', id).order('momento', { ascending: false }).limit(150),
    ]);
    if (error || !c) { painel.innerHTML = vazio('alerta', 'Conversa não encontrada'); return; }
    if (c.nao_lidas) { sb.from('whatsapp_conversas').update({ nao_lidas: 0 }).eq('id', id).then(() => {}); c.nao_lidas = 0; const l = lista.find((x) => x.id === id); if (l) l.nao_lidas = 0; desenharLista(); }
    desenharConversa(c, (msgs || []).reverse());
  }

  function desenharConversa(c, msgs) {
    const painel = $('[data-conversa]', v);
    const emp = estado.empresas.find((e) => e.id === c.empresa_id);
    const nome = emp?.nome || c.nome || telefoneBonito(c.telefone);
    const ultimaIn = [...msgs].reverse().find((m) => m.direcao === 'in');
    const objsRapidas = ultimaIn ? detectarObjecoes(ultimaIn.texto) : [];
    const a = c.analise;
    const analisando = ['fila', 'processando'].includes(c.analise_status);

    painel.innerHTML = `
      <header class="conv-cab">
        <span class="avatar">${esc(iniciais(nome))}</span>
        <div class="grow" style="min-width:0"><b class="ellipsis" style="display:block">${esc(nome)}</b><div class="dim ellipsis" style="font-size:12.5px">${esc(telefoneBonito(c.telefone))}${c.nome && emp ? ` · ${esc(c.nome)}` : ''}${emp ? ` · ${esc(emp.categoria || '')}` : ''}</div></div>
        ${emp ? `${seloEstagio(emp.estagio)}<button class="btn sm" data-ficha>${icone('predio')}Ficha</button>` : `<button class="btn sm prim" data-criar-lead>${icone('usuariomais')}Criar lead</button><button class="btn sm" data-vincular>${icone('link')}Vincular</button>`}
        <a class="btn icone sm" href="${linkWhats(c.telefone)}" target="_blank" rel="noopener" aria-label="Abrir no WhatsApp">${icone('whatsapp')}</a>
        <button class="btn icone sm" data-menu-conv aria-label="Mais">${icone('pontos')}</button>
      </header>
      <div class="conv-corpo">
        <div class="conv-msgs" data-msgs>${msgs.length ? msgs.map(bolha).join('') : vazio('comentario', 'Sem mensagens sincronizadas', 'O histórico chega quando o WhatsApp sincroniza.')}</div>
        <aside class="conv-lado">
          <div class="leitura">
            <div class="row"><span class="icone-caixa sm claude">${sparkClaude(18)}</span><b class="grow">Leitura do Claude</b>
              <button class="btn xs claude" data-analisar ${analisando ? 'disabled' : ''}>${analisando ? `<span class="claude-pensando">${sparkClaude(12)}</span>Analisando` : `${icone('atualizar')}${a ? 'De novo' : 'Analisar'}`}</button></div>
            ${a ? `
              <div class="row wrap gap-6 mt-12">${a.temperatura ? `<span class="selo ${a.temperatura === 'quente' ? 'vermelho' : a.temperatura === 'frio' ? 'azul' : 'amarelo'}">${icone('termometro')}${esc(a.temperatura)}</span>` : ''}${a.intencao ? `<span class="selo cinza">${esc(a.intencao)}</span>` : ''}${c.analise_em ? `<small class="dim">${relativo(c.analise_em)}</small>` : ''}</div>
              ${a.resumo ? `<p class="mt-8">${esc(a.resumo)}</p>` : ''}
              ${(a.objecoes || []).length ? `<div class="rotulo mt-12 mb-8">Objeções</div>${a.objecoes.map((o) => `<div class="objecao"><b>${esc(o.rotulo)}</b>${o.confianca != null ? `<small class="dim"> · ${Math.round(o.confianca * 100)}%</small>` : ''}${o.leitura ? `<p class="dim">${esc(o.leitura)}</p>` : ''}</div>`).join('')}` : ''}
              ${(a.sinais_compra || []).length ? `<div class="rotulo mt-12 mb-8">Sinais de compra</div><ul class="lista-simples">${a.sinais_compra.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>` : ''}
            ` : analisando ? `<p class="dim mt-12">${farejadorOnline() ? 'O Claude está lendo a conversa…' : 'Na fila: roda quando o Farejador ligar.'}</p>`
              : `<p class="dim mt-12">${objsRapidas.length ? 'Leitura instantânea pelos gatilhos do playbook abaixo. Peça a análise do Claude para a resposta sob medida.' : 'Peça a leitura: objeções, temperatura e a resposta certa.'}</p>`}
            ${!a && objsRapidas.length ? `<div class="objecao mt-12"><b>${esc(objsRapidas[0].rotulo)}</b> <small class="dim">· gatilho: "${esc(objsRapidas[0].hits[0])}"</small><p class="dim">${esc(objsRapidas[0].leitura)}</p></div>` : ''}
          </div>
          <div class="respostas">
            <div class="rotulo mb-8">${a?.sugestoes?.length ? 'Resposta na ponta da língua' : objsRapidas.length ? 'Resposta do playbook' : 'Respostas prontas'}</div>
            ${(a?.sugestoes || []).map((s, i) => `<div class="sugestao-resp"><div class="row"><span class="selo claude mini">${esc(s.rotulo || `Opção ${i + 1}`)}</span><span class="grow"></span><button class="btn xs" data-usar-s="${i}">Usar</button></div><p>${esc(s.texto)}</p></div>`).join('')}
            ${!a?.sugestoes?.length && objsRapidas.length ? [objsRapidas[0].resposta, ...(objsRapidas[0].alternativas || [])].map((t, i) => `<div class="sugestao-resp"><div class="row"><span class="selo laranja mini">${i === 0 ? 'Playbook' : `Alternativa ${i}`}</span><span class="grow"></span><button class="btn xs" data-usar-t="${esc(t)}">Usar</button></div><p>${esc(t)}</p></div>`).join('') : ''}
            ${a?.evitar?.length ? `<div class="aviso vermelho mt-8">${icone('alerta')}<div><b>Não diga</b><br>${a.evitar.map(esc).join('<br>')}</div></div>` : ''}
            ${a?.proximo_estagio && emp && a.proximo_estagio !== emp.estagio && estado.estagios.some((s) => s.id === a.proximo_estagio) ? `<button class="btn sm bloco mt-8" data-mover="${esc(a.proximo_estagio)}">${icone('esteira')}Mover para ${esc(estado.estagios.find((s) => s.id === a.proximo_estagio).nome)}</button>` : ''}
            ${a?.proxima_acao && emp ? `<button class="btn sm bloco mt-8" data-acao="${esc(a.proxima_acao)}">${icone('alvo')}Definir próxima ação</button>` : ''}
            <details class="mt-12"><summary class="rotulo">Playbook de objeções</summary><div class="chips mt-8">${estado.playbook.map((o) => `<button class="chip" data-play="${o.id}">${esc(o.rotulo)}</button>`).join('')}</div></details>
          </div>
        </aside>
      </div>
      <footer class="conv-pe">
        <textarea class="txt" data-texto rows="2" placeholder="Escreva ou use uma sugestão. Enter envia, Shift+Enter quebra linha."></textarea>
        <div class="col gap-6">
          <button class="btn prim" data-enviar>${icone('enviar')}Enviar</button>
          <a class="btn sm" data-abrir-wa target="_blank" rel="noopener" href="${linkWhats(c.telefone)}">${icone('whatsapp')}No app</a>
        </div>
      </footer>`;

    const box = $('[data-msgs]', painel);
    box.scrollTop = box.scrollHeight;
    const texto = $('[data-texto]', painel);
    const usar = (t) => { texto.value = t; texto.focus(); texto.setSelectionRange(t.length, t.length); atualizarLinkApp(); };
    const atualizarLinkApp = () => { $('[data-abrir-wa]', painel).href = linkWhats(c.telefone, texto.value.trim()); };
    texto.oninput = atualizarLinkApp;
    $$('[data-usar-s]', painel).forEach((b) => (b.onclick = () => usar(a.sugestoes[+b.dataset.usarS].texto)));
    $$('[data-usar-t]', painel).forEach((b) => (b.onclick = () => usar(b.dataset.usarT)));
    $$('[data-play]', painel).forEach((b) => (b.onclick = () => { const o = estado.playbook.find((x) => x.id === b.dataset.play); usar(o.resposta); }));
    $('[data-ficha]', painel)?.addEventListener('click', () => abrirFicha(emp.id));
    $('[data-criar-lead]', painel)?.addEventListener('click', () => novoLead({ nome: c.nome || '', whatsapp: c.telefone, origem: 'inbound', origem_detalhe: 'Chegou pelo WhatsApp', estagio: 'conversando' }));
    $('[data-vincular]', painel)?.addEventListener('click', () => modalVincular(c));
    $('[data-mover]', painel)?.addEventListener('click', async (ev) => { await moverEstagio(emp, ev.currentTarget.dataset.mover); abrirConversa(c.id); });
    $('[data-acao]', painel)?.addEventListener('click', async (ev) => { await salvarEmpresa(emp.id, { proxima_acao: ev.currentTarget.dataset.acao }); toast('Próxima ação definida'); });
    $('[data-menu-conv]', painel).onclick = (ev) => import('../ui.js').then(({ menu }) => menu(ev.currentTarget, [
      { icone: 'copiar', rotulo: 'Copiar telefone', fn: () => copiar(c.telefone) },
      ...(c.empresa_id ? [{ icone: 'link', rotulo: 'Desvincular da empresa', fn: async () => { await sb.from('whatsapp_conversas').update({ empresa_id: null }).eq('id', c.id); abrirConversa(c.id); carregarLista(); } }] : []),
      { icone: c.silenciada ? 'olho' : 'escudo', rotulo: c.silenciada ? 'Voltar a acompanhar' : 'Marcar como pessoal', fn: async () => {
        const { error } = await sb.from('whatsapp_conversas').update({ silenciada: !c.silenciada }).eq('id', c.id);
        if (error) { toast(erroAmigavel(error), 'erro'); return; }
        toast(c.silenciada ? 'Volta a contar no resumo do dia' : 'Fora do resumo do dia e do contador');
        c.silenciada = !c.silenciada; await carregarLista(); abrirConversa(c.id);
      } },
      { icone: 'arquivo', rotulo: c.arquivada ? 'Desarquivar' : 'Arquivar conversa', fn: async () => { await sb.from('whatsapp_conversas').update({ arquivada: !c.arquivada }).eq('id', c.id); toast(c.arquivada ? 'Desarquivada' : 'Arquivada'); carregarLista(); } },
    ]));

    $('[data-analisar]', painel).onclick = async (ev) => {
      botaoCarregando(ev.currentTarget, true);
      try {
        await criarJob('analisar_conversa', {}, { conversa_id: c.id, empresa_id: c.empresa_id }, 2);
        await sb.from('whatsapp_conversas').update({ analise_status: 'fila' }).eq('id', c.id);
        toast(farejadorOnline() ? 'O Claude está lendo a conversa' : 'Análise na fila (Farejador offline)', 'info');
      } catch (e) { toast(erroAmigavel(e), 'erro'); botaoCarregando(ev.currentTarget, false); }
    };

    const enviar = async () => {
      const t = texto.value.trim();
      if (!t) { texto.focus(); return; }
      if (estado.farejador?.whatsapp_status !== 'conectado' || !farejadorOnline()) {
        if (!(await confirmar('WhatsApp não está conectado', 'A mensagem vai para a fila e sai quando o Farejador conectar. Prefere abrir no app do WhatsApp agora?', { rotulo: 'Deixar na fila' }))) return;
      }
      if (emp?.regulado && /garant|100%|cura|melhor d|resultado certo|antes e depois/i.test(t)
        && !(await confirmar('Atenção: setor regulado', `${emp.conselho || 'Conselho'} proíbe promessa de resultado, superlativo e antes/depois. Enviar mesmo assim?`, { rotulo: 'Enviar mesmo assim', perigo: true }))) return;
      const btn = $('[data-enviar]', painel); botaoCarregando(btn, true);
      try {
        const { data: msg, error } = await sb.from('whatsapp_mensagens').insert({ conversa_id: c.id, direcao: 'out', texto: t, status: 'fila', enviado_por: quem() }).select().single();
        if (error) throw error;
        await criarJob('whatsapp_enviar', { mensagem_id: msg.id, texto: t, telefone: c.telefone, jid: c.jid }, { conversa_id: c.id, empresa_id: c.empresa_id }, 1);
        texto.value = ''; atualizarLinkApp();
        box.insertAdjacentHTML('beforeend', bolha(msg)); box.scrollTop = box.scrollHeight;
        if (box.querySelector('.vazio')) box.querySelector('.vazio').remove();
      } catch (e) { toast(erroAmigavel(e), 'erro'); }
      botaoCarregando(btn, false);
    };
    $('[data-enviar]', painel).onclick = enviar;
    texto.onkeydown = (ev) => { if (ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); enviar(); } };
  }

  function bolha(m) {
    const st = { fila: 'relogio', enviando: 'relogio', enviada: 'check', entregue: 'check', lida: 'checkc', erro: 'alerta' }[m.status];
    return `<div class="bolha ${m.direcao}" data-msg="${m.id}"><span>${esc(m.texto || `[${m.tipo}]`)}</span><small>${dataHora(m.momento)}${m.direcao === 'out' && st ? ` ${icone(st)}` : ''}${m.status === 'erro' ? ` <b class="erro">${esc(m.erro || 'falhou')}</b>` : ''}</small></div>`;
  }

  function modalVincular(c) {
    const emps = estado.empresas.filter((e) => !e.arquivado).sort((a, b) => a.nome.localeCompare(b.nome));
    const m = modal({
      titulo: 'Vincular a uma empresa', subtitulo: telefoneBonito(c.telefone), icone: 'link',
      corpo: `<div class="busca">${icone('busca')}<input class="inp" data-q placeholder="Buscar empresa…"></div><div class="lista mt-12" data-l style="max-height:320px;overflow:auto"></div>`, pe: '',
    });
    const desenhar = () => {
      const q = $('[data-q]', m.el).value.toLowerCase();
      $('[data-l]', m.el).innerHTML = emps.filter((e) => e.nome.toLowerCase().includes(q)).slice(0, 40).map((e) => `<button class="item clicavel" style="width:100%;border:0;background:none;text-align:left;color:inherit" data-e="${e.id}"><span class="avatar sm neutro">${esc(iniciais(e.nome))}</span><span class="grow"><span class="tit">${esc(e.nome)}</span><br><span class="sub">${esc([e.categoria, e.cidade].filter(Boolean).join(' · '))}</span></span></button>`).join('');
      $$('[data-e]', m.el).forEach((b) => (b.onclick = async () => {
        const e = emps.find((x) => x.id === b.dataset.e);
        const { error } = await sb.from('whatsapp_conversas').update({ empresa_id: e.id }).eq('id', c.id);
        if (error) { toast(erroAmigavel(error), 'erro'); return; }
        if (!e.whatsapp) await salvarEmpresa(e.id, { whatsapp: c.telefone });
        await registrarAtividade(e.id, 'whatsapp', 'Conversa do WhatsApp vinculada', telefoneBonito(c.telefone));
        m.fechar(); toast(`Vinculada a ${e.nome}`); carregarLista(); abrirConversa(c.id);
      }));
    };
    $('[data-q]', m.el).oninput = desenhar; desenhar();
  }

  $('[data-busca]', v).oninput = debounce((e) => { busca = e.target.value; desenharLista(); }, 200);
  $('[data-filtros]', v).onclick = (e) => { const b = e.target.closest('[data-f]'); if (!b) return; const antes = filtro; filtro = b.dataset.f; $$('[data-f]', v).forEach((x) => x.classList.toggle('on', x === b)); if ((antes === 'arquivadas') !== (filtro === 'arquivadas')) carregarLista(); else desenharLista(); };
  $('[data-itens]', v).onclick = (e) => { const b = e.target.closest('[data-conv]'); if (b) abrirConversa(b.dataset.conv); };

  desenharConexao();
  await carregarLista();
  if (selecionada) abrirConversa(selecionada);
  else if (filtradas()[0] && innerWidth > 900) abrirConversa(filtradas()[0].id);

  const recarregarLista = debounce(carregarLista, 700);
  limpezas.push(ouvir('whatsapp_conversas', (p) => { recarregarLista(); if (p.new?.id === selecionada && p.eventType === 'UPDATE' && (p.old?.analise_status !== p.new.analise_status || JSON.stringify(p.old?.analise) !== JSON.stringify(p.new.analise))) debounce(() => abrirConversa(selecionada), 300)(); }));
  limpezas.push(ouvir('whatsapp_mensagens', (p) => {
    if (p.new?.conversa_id !== selecionada) return;
    const box = $('[data-msgs]', v); if (!box) return;
    const existente = $(`[data-msg="${p.new.id}"]`, box);
    if (existente) existente.outerHTML = bolha(p.new);
    else { box.insertAdjacentHTML('beforeend', bolha(p.new)); box.scrollTop = box.scrollHeight; }
  }));
  limpezas.push(ouvir('farejador_status', debounce(desenharConexao, 300)));
  return () => limpezas.forEach((f) => f());
}

/* =============================== Conexão do WhatsApp =============================== */
export function modalConexao() {
  let tira = null;
  const m = modal({ titulo: 'WhatsApp no Hound Dog', subtitulo: 'Conecte o número comercial. O Claude lê e sugere; quem envia é você.', icone: 'whatsapp', largo: true, corpo: '<div data-c></div>', pe: '', aoFechar: () => tira && tira() });
  const c = $('[data-c]', m.el);
  function desenhar() {
    const f = estado.farejador || {};
    const online = farejadorOnline();
    const st = f.whatsapp_status || 'desligado';
    if (!online) {
      c.innerHTML = `<div class="aviso laranja">${icone('alerta')}<div><b>Ligue o Farejador primeiro.</b><br>Ele é o programa que roda no seu PC e segura a conexão do WhatsApp e o Claude. Na pasta <code>ferramentas/hound-dog</code>: <code>npm run farejador</code> (ou o atalho "Hound Dog Farejador" na área de trabalho).</div></div>
        <div class="aviso mt-12">${icone('info')}<div>Pode clicar em conectar mesmo assim: o pedido fica na fila e o QR aparece aqui assim que o Farejador ligar.</div></div>
        <button class="btn prim mt-16" data-ligar>${icone('qr')}Conectar quando ligar</button>`;
    } else if (st === 'conectado') {
      c.innerHTML = `<div class="aviso verde">${icone('checkc')}<div><b>Conectado${f.whatsapp_nome ? ` como ${esc(f.whatsapp_nome)}` : ''}</b><br>${esc(telefoneBonito(f.whatsapp_numero))}</div></div>
        <div class="grade-2 mt-16"><div class="card"><div class="rotulo mb-8">O que o Hound Dog faz</div><ul class="lista-simples"><li>Sincroniza as conversas 1 a 1</li><li>Liga cada número à ficha do CRM</li><li>Pede a leitura do Claude quando um lead responde</li><li>Envia só o que você aprovar, uma por vez</li></ul></div>
        <div class="card"><div class="rotulo mb-8">O que ele não faz</div><ul class="lista-simples"><li>Disparo em massa</li><li>Responder sozinho</li><li>Ler grupos</li></ul><p class="dim mt-8" style="font-size:12.5px">Conexão pelo WhatsApp Web (não oficial): use com ritmo humano. Número de cliente regulado ou base grande pede a API oficial.</p></div></div>
        <div class="row mt-16"><button class="btn perigo" data-desconectar>${icone('sair')}Desconectar</button></div>`;
    } else if (st === 'qr' && f.whatsapp_qr) {
      c.innerHTML = `<div class="qr-bloco"><img src="${esc(f.whatsapp_qr)}" alt="QR code para conectar o WhatsApp" width="264" height="264"><div>
        <ol class="passos"><li>Abra o WhatsApp no celular do número comercial</li><li><b>Mais opções → Aparelhos conectados</b></li><li><b>Conectar um aparelho</b> e aponte para o QR</li></ol>
        <p class="dim mt-12" style="font-size:13px">O QR se renova sozinho a cada ~20 s.</p>
        <div class="divisor"></div><div class="rotulo mb-8">Sem câmera? Use código</div>
        <div class="row"><input class="inp sm" data-num placeholder="Número com DDD: 71 99999-0000"><button class="btn sm" data-codigo>Gerar código</button></div>
        ${f.whatsapp_codigo ? `<div class="codigo-par mt-12">${esc(f.whatsapp_codigo)}</div><p class="dim" style="font-size:12.5px">WhatsApp → Aparelhos conectados → Conectar com número de telefone.</p>` : ''}</div></div>`;
    } else if (['conectando', 'qr'].includes(st)) {
      c.innerHTML = `<div class="vazio"><div class="digitando"><i></i><i></i><i></i></div><b>Preparando a conexão…</b><span>O QR aparece aqui em instantes.</span></div>`;
    } else {
      c.innerHTML = `${st === 'erro' ? `<div class="aviso vermelho mb-12">${icone('alerta')}<div><b>Deu erro na última conexão</b><br>${esc(f.whatsapp_erro || '')}</div></div>` : ''}
        <div class="card"><div class="row"><div class="icone-caixa verde">${icone('whatsapp')}</div><div class="grow"><b>Conectar o WhatsApp comercial</b><p class="dim" style="font-size:13.5px">Gera um QR para escanear no celular, igual ao WhatsApp Web.</p></div><button class="btn prim" data-ligar>${icone('qr')}Gerar QR</button></div></div>
        <div class="aviso mt-12">${icone('escudo')}<div>Envio sempre aprovado por você, uma mensagem por vez. Ritmo humano protege o número (não queimar o chip).</div></div>`;
    }
    $('[data-ligar]', c)?.addEventListener('click', async (ev) => { botaoCarregando(ev.currentTarget, true, 'Pedindo…'); try { await criarJob('whatsapp_conectar', {}, {}, 1); toast('Pedido enviado ao Farejador', 'info'); } catch (e) { toast(erroAmigavel(e), 'erro'); } });
    $('[data-desconectar]', c)?.addEventListener('click', async () => { if (await confirmar('Desconectar o WhatsApp?', 'As conversas já sincronizadas continuam no Hound Dog.', { rotulo: 'Desconectar', perigo: true })) { await criarJob('whatsapp_desconectar', {}, {}, 1); toast('Desconectando…', 'info'); } });
    $('[data-codigo]', c)?.addEventListener('click', async () => {
      const n = String($('[data-num]', c).value).replace(/\D/g, '');
      if (n.length < 10) { toast('Digite o número com DDD', 'erro'); return; }
      await criarJob('whatsapp_codigo', { telefone: n.length <= 11 ? `55${n}` : n }, {}, 1); toast('Gerando código…', 'info');
    });
  }
  desenhar();
  tira = ouvir('farejador_status', () => desenhar());
}
