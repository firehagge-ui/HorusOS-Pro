/* =============================================================================
   HOUND DOG — Ajustes: Farejador, WhatsApp, Claude, Instagram, playbook,
   régua de pontuação, metas, operadores, dados e conta
   ============================================================================= */
import { sb, estado, ouvir, criarJob, farejadorOnline, salvarConfig, quem } from '../sb.js';
import { $, $$, esc, toast, confirmar, erroAmigavel, botaoCarregando, relativo, dataHora, vazio, esqueleto, debounce, modal, baixarArquivo, copiar, telefoneBonito } from '../ui.js';
import { icone, sparkClaude } from '../icones.js';
import { PESOS_PADRAO } from '../score.js';

const SECOES = [['farejador', 'Farejador', 'radar'], ['whatsapp', 'WhatsApp', 'whatsapp'], ['claude', 'Claude', 'comentario'], ['instagram', 'Instagram', 'instagram'], ['playbook', 'Playbook de objeções', 'livro'], ['pontuacao', 'Pontuação e metas', 'alvo'], ['operadores', 'Operadores', 'clientes'], ['dados', 'Dados e conta', 'cadeado']];

export default async function ajustes(v, { params }) {
  let secao = params.secao || 'farejador';
  const limpezas = [];
  v.innerHTML = `<div class="cab"><div class="tt"><h1>Ajustes</h1><p>Como o Hound Dog pensa, conecta e pontua.</p></div></div>
    <div class="ajustes-grade"><nav class="ajustes-nav card pad-0">${SECOES.map(([k, r, i]) => `<button data-s="${k}" class="${k === secao ? 'on' : ''}">${k === 'claude' ? sparkClaude(16) : icone(i)}${r}</button>`).join('')}</nav><div data-sec></div></div>`;
  const alvo = $('[data-sec]', v);
  function ir(s) {
    secao = s; $$('[data-s]', v).forEach((b) => b.classList.toggle('on', b.dataset.s === s));
    history.replaceState(null, '', `#/ajustes?secao=${s}`);
    limpezas.splice(0).forEach((f) => f());
    ({ farejador, whatsapp, claude: claudeSec, instagram, playbook, pontuacao, operadores, dados })[s](alvo, limpezas);
  }
  $('.ajustes-nav', v).onclick = (e) => { const b = e.target.closest('[data-s]'); if (b) ir(b.dataset.s); };
  ir(secao);
  return () => limpezas.forEach((f) => f());
}

/* ------------------------------ Farejador ------------------------------ */
async function farejador(c, limpezas) {
  async function des() {
    const f = estado.farejador || {};
    const on = farejadorOnline();
    const { data: jobs } = await sb.from('jobs').select('*').order('criado_em', { ascending: false }).limit(25);
    c.innerHTML = `
      <section class="card ${on ? '' : 'destaque'}"><div class="card-cab"><div class="icone-caixa ${on ? 'verde' : 'vermelho'}">${icone('radar')}</div><div class="grow"><h3>Farejador ${on ? 'online' : 'offline'}</h3><p class="dim" style="font-size:13px">${f.online_em ? `Último sinal ${relativo(f.online_em)}${f.maquina ? ` · ${esc(f.maquina)}` : ''}${f.versao ? ` · v${esc(f.versao)}` : ''}` : 'Nunca foi ligado.'}</p></div></div>
        <p>O Farejador é o programa que roda no seu PC. Ele segura o WhatsApp, chama o Claude pela sua assinatura (sem API), coleta o Instagram e processa a fila abaixo. O painel funciona sem ele, mas o que depende do Claude espera na fila.</p>
        <div class="dados-grade mt-12">
          <div class="dado"><span>Claude</span><b class="${f.claude_ok ? 'ok' : f.claude_ok === false ? 'erro' : 'dim'}">${f.claude_ok ? 'pronto' : f.claude_ok === false ? 'com problema' : '—'}</b></div>
          <div class="dado"><span>WhatsApp</span><b>${esc(f.whatsapp_status || '—')}</b></div>
          <div class="dado"><span>Fila</span><b>${f.fila ?? 0} tarefa${f.fila === 1 ? '' : 's'}</b></div>
          <div class="dado"><span>Instagram coletado</span><b>${f.instagram_em ? relativo(f.instagram_em) : '—'}</b></div>
        </div>
        ${f.claude_info ? `<p class="dim mt-8" style="font-size:12.5px">${esc(f.claude_info)}</p>` : ''}
        ${!on ? `<div class="aviso laranja mt-16">${icone('info')}<div><b>Para ligar:</b> dê dois cliques no atalho <b>Hound Dog Farejador</b> da área de trabalho, ou no terminal:<br><code>cd ferramentas/hound-dog</code> e <code>npm run farejador</code>.<br>Para ligar sozinho com o Windows: <code>powershell -File ferramentas/hound-dog/farejador/instalar-no-windows.ps1</code></div></div>` : ''}
      </section>
      <section class="card mt-16"><div class="card-cab"><div class="icone-caixa sm">${icone('lista')}</div><h3>Fila de tarefas</h3><div class="right"><button class="btn xs" data-limpar>${icone('lixo')}Limpar concluídas</button></div></div>
        ${(jobs || []).length ? `<div class="tabela-wrap"><table class="tabela"><thead><tr><th>Tarefa</th><th>Status</th><th>Progresso</th><th>Quando</th><th></th></tr></thead><tbody>${jobs.map((j) => `<tr><td class="nm">${esc(j.tipo)}</td>
          <td><span class="selo ${{ fila: 'cinza', processando: 'claude', concluido: 'verde', erro: 'vermelho', cancelado: 'cinza' }[j.status]}">${esc(j.status)}</span></td>
          <td class="dim"><div class="clamp-2" style="max-width:360px">${esc(j.erro || j.progresso || '')}</div></td><td class="dim nowrap">${relativo(j.criado_em)}</td>
          <td class="nowrap">${['fila', 'processando'].includes(j.status) ? `<button class="btn xs" data-cancelar="${j.id}">Cancelar</button>` : ''}${j.status === 'erro' ? `<button class="btn xs" data-refazer="${j.id}">${icone('atualizar')}Refazer</button>` : ''}</td></tr>`).join('')}</tbody></table></div>`
          : vazio('lista', 'Fila vazia')}</section>`;
    $$('[data-cancelar]', c).forEach((b) => (b.onclick = async () => { await sb.from('jobs').update({ status: 'cancelado' }).eq('id', b.dataset.cancelar); des(); }));
    $$('[data-refazer]', c).forEach((b) => (b.onclick = async () => { const j = jobs.find((x) => x.id === b.dataset.refazer); await sb.from('jobs').update({ status: 'fila', erro: null, progresso: 'Reenviado', iniciado_em: null }).eq('id', j.id); toast('Reenviado para a fila', 'info'); des(); }));
    $('[data-limpar]', c).onclick = async () => { const { error } = await sb.from('jobs').delete().in('status', ['concluido', 'cancelado']); if (error) toast(erroAmigavel(error), 'erro'); else { toast('Fila limpa'); des(); } };
  }
  await des();
  limpezas.push(ouvir('jobs', debounce(des, 800)), ouvir('farejador_status', debounce(des, 800)));
}

/* ------------------------------ WhatsApp ------------------------------ */
async function whatsapp(c, limpezas) {
  const cfg = { ativo: false, auto_analisar: 'leads', briefing_diario: true, briefing_hora: '08:00', lembretes: true, limite_hora: 30, ...(estado.config.whatsapp || {}) };
  function des() {
    const f = estado.farejador || {};
    c.innerHTML = `
      <section class="card"><div class="card-cab"><div class="icone-caixa verde">${icone('whatsapp')}</div><div class="grow"><h3>Conexão</h3><p class="dim" style="font-size:13px">${f.whatsapp_status === 'conectado' ? `Conectado · ${esc(telefoneBonito(f.whatsapp_numero))}` : `Status: ${esc(f.whatsapp_status || 'desligado')}`}</p></div><button class="btn prim" data-conexao>${icone('qr')}${f.whatsapp_status === 'conectado' ? 'Gerenciar' : 'Conectar'}</button></div>
        <div class="aviso">${icone('escudo')}<div>Conexão pelo WhatsApp Web (não oficial). O Hound Dog <b>não dispara em massa e não responde sozinho</b>: lê, analisa com o Claude e envia só o que você aprovar, uma por vez. É o ritmo que protege o número.</div></div></section>
      <section class="card mt-16"><div class="card-cab"><h3>Comportamento</h3></div>
        <div class="campo"><label>O Claude analisa sozinho quando chega mensagem de</label><select class="sel" data-k="auto_analisar"><option value="leads"${cfg.auto_analisar === 'leads' ? ' selected' : ''}>Só números que estão no CRM (recomendado)</option><option value="todos"${cfg.auto_analisar === 'todos' ? ' selected' : ''}>Todos os contatos</option><option value="nunca"${cfg.auto_analisar === 'nunca' ? ' selected' : ''}>Ninguém (só quando eu pedir)</option></select></div>
        <label class="linha-alternar"><span class="grow"><b>Lembretes de compromisso no meu WhatsApp</b><br><small class="dim">Mensagem para você mesmo antes de cada reunião.</small></span><span class="alternar"><input type="checkbox" data-k="lembretes" ${cfg.lembretes ? 'checked' : ''}><span></span></span></label>
        <label class="linha-alternar"><span class="grow"><b>Resumo do dia no meu WhatsApp</b><br><small class="dim">Agenda, follow-ups e negócios que pedem atenção.</small></span><span class="alternar"><input type="checkbox" data-k="briefing_diario" ${cfg.briefing_diario ? 'checked' : ''}><span></span></span></label>
        <div class="grade-2 mt-12"><div class="campo"><label>Horário do resumo</label><input class="inp" type="time" data-k="briefing_hora" value="${esc(cfg.briefing_hora)}"></div>
          <div class="campo"><label>Limite de envios por hora</label><input class="inp" type="number" min="1" max="60" data-k="limite_hora" value="${cfg.limite_hora}"><span class="ajuda">Trava de segurança do número.</span></div></div>
        <button class="btn prim" data-salvar>${icone('check')}Salvar</button></section>`;
    $('[data-conexao]', c).onclick = async () => (await import('./conversas.js')).modalConexao();
    $('[data-salvar]', c).onclick = async (ev) => {
      $$('[data-k]', c).forEach((i) => { cfg[i.dataset.k] = i.type === 'checkbox' ? i.checked : i.type === 'number' ? Number(i.value) : i.value; });
      botaoCarregando(ev.currentTarget, true);
      try { await salvarConfig('whatsapp', cfg); toast('Ajustes do WhatsApp salvos'); } catch (e) { toast(erroAmigavel(e), 'erro'); }
      botaoCarregando(ev.currentTarget, false);
    };
  }
  des();
  limpezas.push(ouvir('farejador_status', debounce(des, 600)));
}

/* ------------------------------ Claude ------------------------------ */
function claudeSec(c) {
  const cfg = { modelo_chat: 'opus', modelo_analise: 'sonnet', modelo_pesquisa: 'opus', ...(estado.config.claude || {}) };
  const sel = (k) => `<select class="sel" data-k="${k}">${[['opus', 'Opus 5 (mais inteligente)'], ['sonnet', 'Sonnet 5 (rápido e ótimo)'], ['haiku', 'Haiku 4.5 (mais rápido)']].map(([m, r]) => `<option value="${m}"${cfg[k] === m ? ' selected' : ''}>${r}</option>`).join('')}</select>`;
  c.innerHTML = `<section class="card"><div class="card-cab"><div class="icone-caixa claude">${sparkClaude(22)}</div><div class="grow"><h3>Claude no Hound Dog</h3><p class="dim" style="font-size:13px">Roda pelo Claude Code da sua assinatura, no Farejador. Sem chave de API, sem custo por mensagem.</p></div></div>
    <div class="grade-3"><div class="campo"><label>Conversa (chat)</label>${sel('modelo_chat')}</div><div class="campo"><label>Leitura do WhatsApp</label>${sel('modelo_analise')}</div><div class="campo"><label>Pesquisas e dossiês</label>${sel('modelo_pesquisa')}</div></div>
    <div class="aviso">${icone('info')}<div>O Claude do Hound Dog tem o contexto da Hórus (CLAUDE.md, memória, clientes, doutrina comercial e cards do network) e as ferramentas do CRM: pode criar lead, mover estágio, registrar atividade, agendar e salvar pesquisa. Ele segue as travas de integridade: o que não sabe vira [FALTA].</div></div>
    <button class="btn prim mt-16" data-salvar>${icone('check')}Salvar</button></section>`;
  $('[data-salvar]', c).onclick = async () => { $$('[data-k]', c).forEach((s) => (cfg[s.dataset.k] = s.value)); try { await salvarConfig('claude', cfg); toast('Modelos salvos'); } catch (e) { toast(erroAmigavel(e), 'erro'); } };
}

/* ------------------------------ Instagram ------------------------------ */
function instagram(c) {
  const cfg = { handle: 'horuspublicidade', intervalo_horas: 6, confirmado: false, ...(estado.config.instagram || {}) };
  c.innerHTML = `<section class="card"><div class="card-cab"><div class="icone-caixa violeta">${icone('instagram')}</div><h3>Instagram da Hórus</h3></div>
    <div class="grade-2"><div class="campo"><label>Perfil</label><input class="inp" data-k="handle" value="@${esc(cfg.handle)}"></div><div class="campo"><label>Coletar a cada</label><select class="sel" data-k="intervalo_horas">${[3, 6, 12, 24].map((h) => `<option value="${h}"${cfg.intervalo_horas === h ? ' selected' : ''}>${h} horas</option>`).join('')}</select></div></div>
    <label class="check"><input type="checkbox" data-k="confirmado" ${cfg.confirmado ? 'checked' : ''}> Confirmo que este é o perfil oficial da agência</label>
    <p class="dim mt-8" style="font-size:12.5px">O brandbook ainda marca o @ como <code>[FALTA]</code>: o site aponta para @horuspublicidade, mas isso nunca foi confirmado. Enquanto não confirmar, o painel mostra um aviso.</p>
    </section>
    <section class="card mt-16"><div class="card-cab"><div class="icone-caixa sm verde">${icone('cadeado')}</div><div class="grow"><h3>API oficial (recomendado)</h3><p class="dim" style="font-size:13px">Desde 2025 o Instagram exige login para ler perfil de fora. Com a API oficial a coleta volta a ser automática — e vem com alcance e impressões.</p></div></div>
      <div class="grade-2"><div class="campo"><label>ID da conta do Instagram</label><input class="inp" data-k="ig_user_id" value="${esc(cfg.ig_user_id || '')}" placeholder="17841400000000000"></div>
        <div class="campo"><label>Token de acesso</label><input class="inp" type="password" data-k="token" value="${esc(cfg.token || '')}" placeholder="EAAG..."></div></div>
      <details><summary class="rotulo">Como pegar esses dois</summary><ol class="passos mt-8">
        <li>A conta do Instagram precisa ser <b>profissional</b> e estar ligada a uma <b>página do Facebook</b>.</li>
        <li>Em <b>developers.facebook.com</b>, crie um app do tipo "Empresa" e adicione o produto <b>Instagram Graph API</b>.</li>
        <li>No <b>Graph API Explorer</b>, gere um token com as permissões <code>instagram_basic</code>, <code>pages_show_list</code> e <code>pages_read_engagement</code>.</li>
        <li>Ainda no Explorer, rode <code>me/accounts</code> para achar a página e depois <code>&lt;id-da-pagina&gt;?fields=instagram_business_account</code>: o número que voltar é o ID da conta.</li>
        <li>Troque o token por um de <b>longa duração</b> (60 dias) e cole aqui. O painel avisa quando ele vencer.</li>
      </ol><p class="dim mt-8" style="font-size:12.5px">O token fica no banco do Hound Dog, que só operador enxerga. Se preferir não guardar aqui, use o registro manual na tela do Instagram.</p></details>
      <button class="btn prim mt-16" data-salvar>${icone('check')}Salvar</button></section>`;
  $('[data-salvar]', c).onclick = async () => {
    const h = String($('[data-k=handle]', c).value).replace(/^@/, '').trim().toLowerCase();
    if (!/^[a-z0-9_.]{2,30}$/.test(h)) { toast('Perfil inválido', 'erro'); return; }
    try {
      await salvarConfig('instagram', {
        handle: h, intervalo_horas: Number($('[data-k=intervalo_horas]', c).value), confirmado: $('[data-k=confirmado]', c).checked,
        ig_user_id: $('[data-k=ig_user_id]', c).value.trim() || undefined, token: $('[data-k=token]', c).value.trim() || undefined,
      });
      toast('Instagram salvo');
    } catch (e) { toast(erroAmigavel(e), 'erro'); }
  };
}

/* ------------------------------ Playbook ------------------------------ */
function playbook(c) {
  function des() {
    c.innerHTML = `<section class="card"><div class="card-cab"><div class="icone-caixa">${icone('livro')}</div><div class="grow"><h3>Playbook de objeções</h3><p class="dim" style="font-size:13px">Detecta a objeção pelos gatilhos na hora e sugere a resposta. O Claude usa como base e adapta à conversa.</p></div><button class="btn sm" data-nova>${icone('mais')}Objeção</button></div>
      ${estado.playbook.map((o) => `<div class="item clicavel" data-o="${o.id}"><div class="grow"><div class="tit">${esc(o.rotulo)}</div><div class="sub clamp-2">${esc(o.resposta)}</div><div class="sub mt-4">${(o.gatilhos || []).slice(0, 6).map((g) => `<code>${esc(g)}</code>`).join(' ')}${o.gatilhos?.length > 6 ? ` +${o.gatilhos.length - 6}` : ''}</div></div>${icone('chevd')}</div>`).join('')}</section>`;
    $$('[data-o]', c).forEach((it) => (it.onclick = () => editar(estado.playbook.find((o) => o.id === it.dataset.o))));
    $('[data-nova]', c).onclick = () => editar(null);
  }
  function editar(o) {
    const m = modal({ titulo: o ? o.rotulo : 'Nova objeção', icone: 'livro', largo: true,
      corpo: `<form novalidate><div class="grade-2"><div class="campo"><label>Nome</label><input class="inp" name="rotulo" value="${esc(o?.rotulo || '')}"></div><div class="campo"><label>Ordem</label><input class="inp" name="ordem" type="number" value="${o?.ordem ?? 200}"></div></div>
        <div class="campo"><label>Gatilhos (um por linha)</label><textarea class="txt mono" name="gatilhos" rows="4">${esc((o?.gatilhos || []).join('\n'))}</textarea><span class="ajuda">Trechos que, se aparecerem na mensagem do lead, indicam esta objeção.</span></div>
        <div class="campo"><label>O que ela realmente significa</label><textarea class="txt" name="leitura" rows="2">${esc(o?.leitura || '')}</textarea></div>
        <div class="campo"><label>Resposta recomendada</label><textarea class="txt" name="resposta" rows="3">${esc(o?.resposta || '')}</textarea></div>
        <div class="campo"><label>Alternativas (uma por linha)</label><textarea class="txt" name="alternativas" rows="3">${esc((o?.alternativas || []).join('\n'))}</textarea></div>
        <div class="campo"><label>Evitar</label><input class="inp" name="evitar" value="${esc(o?.evitar || '')}"></div>
        <div class="campo"><label>Fonte</label><input class="inp" name="fonte" value="${esc(o?.fonte || '')}"></div></form>`,
      pe: `${o ? `<button class="btn perigo" data-excluir>${icone('lixo')}Excluir</button><span class="grow"></span>` : ''}<button class="btn" data-fechar>Cancelar</button><button class="btn prim" data-salvar>${icone('check')}Salvar</button>` });
    $$('[data-fechar]', m.el).forEach((b) => (b.onclick = () => m.fechar()));
    $('[data-salvar]', m.el).onclick = async () => {
      const f = Object.fromEntries(new FormData($('form', m.el)).entries());
      if (!f.rotulo.trim() || !f.resposta.trim()) { toast('Nome e resposta são obrigatórios', 'erro'); return; }
      const linhas = (t) => t.split('\n').map((x) => x.trim()).filter(Boolean);
      const id = o?.id || f.rotulo.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 40);
      const linha = { id, rotulo: f.rotulo.trim(), ordem: Number(f.ordem) || 200, gatilhos: linhas(f.gatilhos), leitura: f.leitura.trim() || null, resposta: f.resposta.trim(), alternativas: linhas(f.alternativas), evitar: f.evitar.trim() || null, fonte: f.fonte.trim() || null };
      const { error } = await sb.from('playbook_objecoes').upsert(linha);
      if (error) { toast(erroAmigavel(error), 'erro'); return; }
      const i = estado.playbook.findIndex((x) => x.id === id);
      if (i >= 0) estado.playbook[i] = linha; else estado.playbook.push(linha);
      estado.playbook.sort((a, b) => a.ordem - b.ordem);
      m.fechar(); toast('Playbook atualizado'); des();
    };
    if (o) $('[data-excluir]', m.el).onclick = async () => {
      if (!(await confirmar('Excluir objeção?', o.rotulo, { rotulo: 'Excluir', perigo: true }))) return;
      const { error } = await sb.from('playbook_objecoes').delete().eq('id', o.id);
      if (error) { toast(erroAmigavel(error), 'erro'); return; }
      estado.playbook = estado.playbook.filter((x) => x.id !== o.id); m.fechar(); des();
    };
  }
  des();
}

/* ------------------------------ Pontuação e metas ------------------------------ */
function pontuacao(c) {
  const pesos = { ...PESOS_PADRAO, ...(estado.config.score || {}) };
  const metas = { abordagens_semana: 5, reunioes_mes: 2, ...(estado.config.metas || {}) };
  const nichos = (estado.config.nichos_conhecidos || []).join(', ');
  const praca = (estado.config.praca?.regiao || []).join(', ');
  const NOMES = { sem_site: 'Sem site ou fora do ar', instagram_movimento: 'Movimento (Instagram, avaliações)', dono_acessivel: 'Contato direto com o dono', gmb_fraco: 'Google Meu Negócio fraco', nicho_conhecido: 'Nicho que a casa já atende', timing: 'Timing quente' };
  c.innerHTML = `<section class="card"><div class="card-cab"><div class="icone-caixa">${icone('alvo')}</div><div class="grow"><h3>Régua de pontuação (0 a 100)</h3><p class="dim" style="font-size:13px">Fonte: Horus-Comercial/30-checklist-qualificacao.md. 70+ é alta prioridade.</p></div></div>
      ${Object.keys(PESOS_PADRAO).map((k) => `<div class="linha-peso"><span class="grow">${esc(NOMES[k])}</span><input type="range" min="0" max="40" step="1" data-p="${k}" value="${pesos[k]}" aria-label="${esc(NOMES[k])}"><b class="num" data-pv="${k}">+${pesos[k]}</b></div>`).join('')}
      <div class="campo mt-16"><label>Nichos que a casa já atende (vírgula)</label><textarea class="txt" data-nichos rows="2">${esc(nichos)}</textarea></div>
      <div class="campo"><label>Praça (dá pra ir presencial, +5)</label><input class="inp" data-praca value="${esc(praca)}"></div></section>
    <section class="card mt-16"><div class="card-cab"><div class="icone-caixa sm azul">${icone('tendencia')}</div><div class="grow"><h3>Metas</h3><p class="dim" style="font-size:13px">${esc(metas.referencia || '')}</p></div></div>
      <div class="grade-2"><div class="campo"><label>Abordagens de qualidade por semana</label><input class="inp" type="number" min="1" data-m="abordagens_semana" value="${metas.abordagens_semana}"></div><div class="campo"><label>Reuniões por mês</label><input class="inp" type="number" min="1" data-m="reunioes_mes" value="${metas.reunioes_mes}"></div></div></section>
    <button class="btn prim mt-16" data-salvar>${icone('check')}Salvar régua e metas</button>`;
  $$('[data-p]', c).forEach((r) => (r.oninput = () => { $(`[data-pv="${r.dataset.p}"]`, c).textContent = `+${r.value}`; }));
  $('[data-salvar]', c).onclick = async (ev) => {
    const novo = { ...estado.config.score }; $$('[data-p]', c).forEach((r) => (novo[r.dataset.p] = Number(r.value)));
    const lista = (t) => t.split(',').map((x) => x.trim()).filter(Boolean);
    const m2 = { ...metas }; $$('[data-m]', c).forEach((i) => (m2[i.dataset.m] = Number(i.value)));
    botaoCarregando(ev.currentTarget, true);
    try {
      await salvarConfig('score', novo);
      await salvarConfig('nichos_conhecidos', lista($('[data-nichos]', c).value));
      await salvarConfig('praca', { ...(estado.config.praca || {}), regiao: lista($('[data-praca]', c).value) });
      await salvarConfig('metas', m2);
      toast('Régua e metas salvas. Use "Repontuar" nas listas para aplicar.');
    } catch (e) { toast(erroAmigavel(e), 'erro'); }
    botaoCarregando(ev.currentTarget, false);
  };
}

/* ------------------------------ Operadores ------------------------------ */
async function operadores(c) {
  const { data, error } = await sb.from('operadores').select('*').order('criado_em');
  if (error) { c.innerHTML = vazio('alerta', 'Não carregou', erroAmigavel(error)); return; }
  const dono = estado.eu?.papel === 'dono';
  c.innerHTML = `<section class="card"><div class="card-cab"><div class="icone-caixa">${icone('clientes')}</div><div class="grow"><h3>Quem opera o Hound Dog</h3><p class="dim" style="font-size:13px">Só quem está aqui vê os dados. O resto, mesmo logado, não vê nada.</p></div>${dono ? `<button class="btn sm prim" data-add>${icone('usuariomais')}Adicionar</button>` : ''}</div>
    ${data.map((o) => `<div class="item"><span class="avatar">${esc(o.nome[0])}</span><div class="grow"><div class="tit">${esc(o.nome)}${o.user_id === estado.eu?.user_id ? ' <span class="selo">você</span>' : ''}</div><div class="sub">${esc(o.email || '')}</div></div><span class="selo ${o.papel === 'dono' ? 'laranja' : 'cinza'}">${o.papel === 'dono' ? 'Dono' : 'Operador'}</span>
      ${dono && o.user_id !== estado.eu?.user_id ? `<button class="btn xs perigo" data-tirar="${o.user_id}">Remover acesso</button>` : ''}</div>`).join('')}
    ${!dono ? '<p class="dim mt-12">Só o dono adiciona ou remove operadores.</p>' : ''}</section>`;
  $('[data-add]', c)?.addEventListener('click', () => {
    const m = modal({ titulo: 'Adicionar operador', subtitulo: 'O Farejador cria a conta e gera uma senha temporária.', icone: 'usuariomais',
      corpo: `<div class="campo"><label>Nome</label><input class="inp" data-nome placeholder="Ex.: Antônio"></div><div class="campo"><label>E-mail</label><input class="inp" type="email" data-email></div>
        <label class="check"><input type="checkbox" data-dono> Dono (pode gerenciar operadores)</label>
        <div class="aviso mt-12">${icone('info')}<div>A senha temporária aparece em Ajustes → Farejador (resultado da tarefa) e fica gravada no seu PC, em <code>ferramentas/hound-dog/.segredos/acessos.txt</code>. Peça para a pessoa trocar no primeiro acesso.</div></div>`,
      pe: `<button class="btn" data-fechar>Cancelar</button><button class="btn prim" data-ok>${icone('check')}Criar</button>` });
    $$('[data-fechar]', m.el).forEach((b) => (b.onclick = () => m.fechar()));
    $('[data-ok]', m.el).onclick = async () => {
      const nome = $('[data-nome]', m.el).value.trim(), email = $('[data-email]', m.el).value.trim().toLowerCase();
      if (!nome || !/^\S+@\S+\.\S+$/.test(email)) { toast('Nome e e-mail válidos', 'erro'); return; }
      try { await criarJob('criar_operador', { nome, email, papel: $('[data-dono]', m.el).checked ? 'dono' : 'operador' }, {}, 2); m.fechar(); toast(farejadorOnline() ? 'Criando a conta…' : 'Na fila: roda quando o Farejador ligar', 'info'); }
      catch (e) { toast(erroAmigavel(e), 'erro'); }
    };
  });
  $$('[data-tirar]', c).forEach((b) => (b.onclick = async () => {
    if (!(await confirmar('Remover o acesso?', 'A pessoa deixa de ver os dados do Hound Dog.', { rotulo: 'Remover', perigo: true }))) return;
    const { error: e } = await sb.from('operadores').delete().eq('user_id', b.dataset.tirar);
    if (e) toast(erroAmigavel(e), 'erro'); else { toast('Acesso removido'); operadores(c); }
  }));
}

/* ------------------------------ Dados e conta ------------------------------ */
function dados(c) {
  c.innerHTML = `<section class="card"><div class="card-cab"><div class="icone-caixa">${icone('download')}</div><h3>Backup</h3></div>
      <p class="dim">Baixa tudo em JSON: empresas, negócios, dinheiro, agenda, linha do tempo, listas, pesquisas e playbook.</p>
      <button class="btn mt-12" data-backup>${icone('download')}Baixar backup completo</button></section>
    <section class="card mt-16"><div class="card-cab"><div class="icone-caixa">${icone('cadeado')}</div><h3>Sua conta</h3></div>
      <p>${esc(estado.sessao?.user?.email || '')}</p>
      <div class="grade-2 mt-12"><div class="campo"><label>Nova senha</label><input class="inp" type="password" data-s1 autocomplete="new-password" placeholder="Mínimo de 10 caracteres"></div><div class="campo"><label>Repita</label><input class="inp" type="password" data-s2 autocomplete="new-password"></div></div>
      <div class="row"><button class="btn" data-senha>${icone('check')}Trocar senha</button><span class="grow"></span><button class="btn perigo" data-sair>${icone('sair')}Sair</button></div></section>
    <section class="card mt-16"><div class="card-cab"><div class="icone-caixa sm">${icone('info')}</div><h3>Sobre</h3></div>
      <p class="dim">Hound Dog · Hórus CRM. Banco Supabase (São Paulo), painel na Vercel, Farejador local com Claude Code e WhatsApp. Código em <code>ferramentas/hound-dog</code>.</p></section>`;
  $('[data-backup]', c).onclick = async (ev) => {
    botaoCarregando(ev.currentTarget, true, 'Juntando…');
    try {
      const tabelas = ['empresas', 'negocios', 'financeiro', 'agenda', 'atividades', 'listas', 'lista_itens', 'pesquisas', 'playbook_objecoes', 'config', 'estagios', 'chat_threads', 'chat_mensagens', 'whatsapp_conversas', 'whatsapp_mensagens', 'instagram_snapshots'];
      const saida = { gerado_em: new Date().toISOString(), por: quem() };
      for (const t of tabelas) { const { data, error } = await sb.from(t).select('*').limit(20000); if (error) throw error; saida[t] = data; }
      baixarArquivo(`hound-dog-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(saida, null, 2), 'application/json');
      toast('Backup baixado');
    } catch (e) { toast(erroAmigavel(e), 'erro'); }
    botaoCarregando(ev.currentTarget, false);
  };
  $('[data-senha]', c).onclick = async () => {
    const a = $('[data-s1]', c).value, b = $('[data-s2]', c).value;
    if (a.length < 10) { toast('A senha precisa ter 10+ caracteres', 'erro'); return; }
    if (a !== b) { toast('As senhas não batem', 'erro'); return; }
    const { error } = await sb.auth.updateUser({ password: a });
    if (error) toast(erroAmigavel(error), 'erro'); else { toast('Senha trocada'); $('[data-s1]', c).value = ''; $('[data-s2]', c).value = ''; }
  };
  $('[data-sair]', c).onclick = () => sb.auth.signOut();
}
