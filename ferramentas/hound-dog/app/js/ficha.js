/* =============================================================================
   HOUND DOG — ficha da empresa (gaveta lateral): visão geral, copiloto, linha
   do tempo, negócios e dinheiro, agenda, dossiê do Claude e WhatsApp
   ============================================================================= */
import { sb, estado, ouvir, salvarEmpresa, registrarAtividade, criarJob, acompanharJob, farejadorOnline, estagio as achaEstagio, quem } from './sb.js';
import { $, $$, el, esc, gaveta, toast, confirmar, perguntar, erroAmigavel, botaoCarregando, copiar, brl, relativo, dataHora, dataLonga, telefoneBonito, linkWhats, vazio, esqueleto, preencherMarkdown, menu, iniciais, num, diasDesde } from './ui.js';
import { icone, sparkClaude } from './icones.js';
import { proximaMensagem, detectarObjecoes } from './copiloto.js';
import { editarEmpresa, agendar, moverEstagio, pedirMensagemClaude, TIPOS_AGENDA, linkGoogleAgenda, ORIGENS } from './acoes.js';

const ICONE_TIPO = { nota: 'editar', estagio: 'esteira', ligacao: 'telefone', mensagem: 'enviar', whatsapp: 'whatsapp', reuniao: 'clientes', proposta: 'arquivo', pagamento: 'dinheiro', pesquisa: 'radar', claude: 'comentario', sistema: 'info', visita: 'mapa' };
const NOMES_TIPO = { nota: 'Nota', ligacao: 'Ligação', mensagem: 'Mensagem enviada', whatsapp: 'WhatsApp', reuniao: 'Reunião', proposta: 'Proposta', pagamento: 'Pagamento', visita: 'Visita' };
const SITE_SELO = { sem: ['vermelho', 'Sem site'], fora_do_ar: ['vermelho', 'Site fora do ar'], ruim: ['amarelo', 'Site fraco'], ok: ['verde', 'Site ok'], desconhecido: ['cinza', 'Site não verificado'] };
const TEMP = { quente: ['vermelho', 'fogo', 'Quente'], morno: ['amarelo', 'termometro', 'Morno'], frio: ['azul', 'termometro', 'Frio'] };
const ENTREGA = { nao_iniciada: 'Não iniciada', onboarding: 'Onboarding', producao: 'Em produção', revisao: 'Em revisão', entregue: 'Entregue', pausado: 'Pausado' };
const STATUS_NEG = { aberto: ['azul', 'Em aberto'], ganho: ['verde', 'Ganho'], perdido: ['vermelho', 'Perdido'], pausado: ['cinza', 'Pausado'] };
const NOMES_ORIGEM = Object.fromEntries(ORIGENS);
const STATUS_FIN = { previsto: ['cinza', 'Previsto'], a_receber: ['amarelo', 'A receber'], recebido: ['verde', 'Recebido'], cancelado: ['vermelho', 'Cancelado'] };

export function seloSite(s) { const [c, t] = SITE_SELO[s] || SITE_SELO.desconhecido; return `<span class="selo ${c}">${esc(t)}</span>`; }
export function seloEstagio(id) { const e = achaEstagio(id); return `<span class="selo" style="color:${e.cor};border-color:${e.cor}55;background:${e.cor}1a"><span class="ponto" style="background:${e.cor}"></span>${esc(e.nome)}</span>`; }
export function seloTemp(t) { if (!TEMP[t]) return ''; const [c, i, r] = TEMP[t]; return `<span class="selo ${c}">${icone(i)}${r}</span>`; }

export function abrirFicha(id, { aba = 'geral', aoFechar } = {}) {
  const emp = estado.empresas.find((e) => e.id === id);
  if (!emp) { toast('Empresa não encontrada (pode ter sido excluída)', 'erro'); return; }
  let abaAtual = aba;
  const limpezas = [];
  const g = gaveta({ aoFechar: () => { limpezas.forEach((f) => f()); if (aoFechar) aoFechar(); } });
  g.el.classList.add('ficha');

  function atual() { return estado.empresas.find((e) => e.id === id) || emp; }

  function desenharCab() {
    const e = atual();
    const est = achaEstagio(e.estagio);
    const local = [e.bairro, e.cidade].filter(Boolean).join(', ');
    g.cab.innerHTML = `
      <div class="ficha-topo">
        <span class="avatar lg" style="background:linear-gradient(135deg, ${est.cor}, #1a1a22);color:#fff">${esc(iniciais(e.nome))}</span>
        <div class="grow ficha-id">
          <h2 class="ficha-nome">${esc(e.nome)}</h2>
          <div class="ficha-sub">${e.categoria ? `<span>${esc(e.categoria)}</span>` : '<span class="dim">Sem categoria</span>'}${local ? `<span class="ficha-local">${icone('mapa')}${esc(local)}</span>` : ''}</div>
        </div>
        <div class="ficha-acoes">
          <button class="btn icone sm" data-acao="editar" aria-label="Editar" title="Editar">${icone('editar')}</button>
          <button class="btn icone sm" data-acao="mais" aria-label="Mais ações" title="Mais ações">${icone('pontos')}</button>
          <button class="btn icone sm fantasma" data-acao="fechar" aria-label="Fechar" title="Fechar">${icone('x')}</button>
        </div>
      </div>
      <div class="ficha-status">
        <select class="sel sm sel-estagio" data-acao="estagio" style="width:auto;border-color:${est.cor}66;color:${est.cor}" aria-label="Estágio">${estado.estagios.map((s) => `<option value="${s.id}"${s.id === e.estagio ? ' selected' : ''}>${esc(s.nome)}</option>`).join('')}</select>
        <div class="segmento seg-temp" role="group" aria-label="Temperatura">${['frio', 'morno', 'quente'].map((t) => `<button class="${e.temperatura === t ? 'on' : ''}" data-temp="${t}">${TEMP[t][2]}</button>`).join('')}</div>
        <span class="ficha-selos">
          <span class="score sm ${e.prioridade}" title="${esc((e.score_motivos || []).map((m) => `+${m.pontos} ${m.sinal}`).join('\n') || 'Sem sinais pontuados')}">${e.score}/100</span>
          ${e.regulado ? `<span class="selo vermelho">${icone('escudo')}Regulado${e.conselho ? ` · ${esc(e.conselho)}` : ''}</span>` : ''}
          <span class="selo cinza">${esc({ lead: 'Lead', cliente: 'Cliente', interno: 'Conta interna', ex_cliente: 'Ex-cliente', nao_fit: 'Não-fit' }[e.relacao] || e.relacao)}</span>
        </span>
      </div>
      <div class="ficha-contato">
        <div class="ficha-canais">
          ${e.whatsapp ? `<a class="btn sm verde" href="${linkWhats(e.whatsapp)}" target="_blank" rel="noopener">${icone('whatsapp')}${esc(telefoneBonito(e.whatsapp))}</a>` : ''}
          ${e.telefone && e.telefone !== e.whatsapp ? `<a class="btn sm" href="tel:+${e.telefone}">${icone('telefone')}${e.whatsapp ? 'Ligar' : esc(telefoneBonito(e.telefone))}</a>` : ''}
          ${e.instagram ? `<a class="btn sm" href="https://instagram.com/${esc(e.instagram)}" target="_blank" rel="noopener">${icone('instagram')}@${esc(e.instagram)}</a>` : ''}
          ${e.site ? `<a class="btn icone sm" href="${esc(e.site)}" target="_blank" rel="noopener" aria-label="Abrir site" title="Abrir site">${icone('globo')}</a>` : ''}
          <a class="btn icone sm" href="https://www.google.com/maps/search/${encodeURIComponent([e.nome, e.cidade].filter(Boolean).join(' '))}" target="_blank" rel="noopener" aria-label="Ver no Google Maps" title="Ver no Google Maps">${icone('mapa')}</a>
        </div>
        <div class="ficha-canais">
          <button class="btn sm" data-acao="investigar" title="Investigação profunda">${icone('radar')}Investigar</button>
          <button class="btn sm" data-acao="agendar">${icone('agenda')}Agendar</button>
          <button class="btn sm claude" data-acao="claude">${sparkClaude(15)}Falar sobre este lead</button>
        </div>
      </div>
      <nav class="abas ficha-abas">
        ${[['geral', 'Geral', 'alvo'], ['tempo', 'Histórico', 'relogio'], ['negocios', 'R$', 'dinheiro'], ['agenda', 'Agenda', 'agenda'], ['dossie', 'Briefing', 'radar'], ['whats', 'WhatsApp', 'whatsapp']]
          .map(([idA, r, ic]) => `<button class="${abaAtual === idA ? 'on' : ''}" data-aba="${idA}">${icone(ic)}${r}</button>`).join('')}
      </nav>`;
  }

  async function desenharCorpo() {
    const e = atual();
    const c = g.corpo;
    c.innerHTML = esqueleto(5, 22);
    try {
      if (abaAtual === 'geral') return await abaGeral(c, e);
      if (abaAtual === 'tempo') return await abaTempo(c, e);
      if (abaAtual === 'negocios') return await abaNegocios(c, e);
      if (abaAtual === 'agenda') return await abaAgenda(c, e);
      if (abaAtual === 'dossie') return await abaDossie(c, e);
      if (abaAtual === 'whats') return await abaWhats(c, e);
    } catch (err) {
      c.innerHTML = `<div class="vazio">${icone('alerta')}<b>Não carregou</b><span>${esc(erroAmigavel(err))}</span></div>`;
    }
  }

  g.cab.addEventListener('click', async (ev) => {
    const b = ev.target.closest('[data-acao],[data-aba],[data-temp]');
    if (!b) return;
    const e = atual();
    if (b.dataset.aba) { abaAtual = b.dataset.aba; desenharCab(); desenharCorpo(); return; }
    if (b.dataset.temp) { try { await salvarEmpresa(e.id, { temperatura: e.temperatura === b.dataset.temp ? null : b.dataset.temp }); desenharCab(); } catch (err) { toast(erroAmigavel(err), 'erro'); } return; }
    const acao = b.dataset.acao;
    if (acao === 'fechar') g.fechar();
    if (acao === 'editar') editarEmpresa(e);
    if (acao === 'investigar') { abaAtual = 'dossie'; desenharCab(); desenharCorpo().then(() => $('[data-investigar]', g.corpo)?.click()); }
    if (acao === 'agendar') agendar({ empresa_id: e.id, tipo: ['novo', 'qualificado', 'abordado', 'conversando'].includes(e.estagio) ? 'r1' : 'followup' });
    if (acao === 'claude') { g.fechar(); location.hash = `#/claude?empresa=${e.id}`; }
    if (acao === 'mais') {
      menu(b, [
        { icone: 'radar', rotulo: 'Investigar (investigação profunda)', fn: () => { abaAtual = 'dossie'; desenharCab(); desenharCorpo().then(() => $('[data-investigar]', g.corpo)?.click()); } },
        { icone: 'comentario', rotulo: 'Mensagem personalizada (Claude)', fn: () => pedirMensagemClaude(e) },
        { icone: 'copiar', rotulo: 'Copiar dados da ficha', fn: () => copiar(textoFicha(e), 'Ficha copiada') },
        { icone: 'pasta', rotulo: e.pasta_repo ? `Copiar pasta: ${e.pasta_repo}` : 'Sem pasta no repositório', fn: () => e.pasta_repo && copiar(e.pasta_repo, 'Caminho copiado') },
        '-',
        { icone: 'arquivo', rotulo: e.arquivado ? 'Desarquivar' : 'Arquivar', fn: async () => { await salvarEmpresa(e.id, { arquivado: !e.arquivado }); toast(e.arquivado ? 'Desarquivada' : 'Arquivada'); desenharCab(); } },
        { icone: 'lixo', rotulo: 'Excluir empresa', perigo: true, fn: async () => {
          if (!(await confirmar('Excluir empresa?', `${e.nome} e toda a linha do tempo, negócios e dossiês somem. Prefira arquivar se for só tirar da frente.`, { rotulo: 'Excluir de vez', perigo: true }))) return;
          const { error } = await sb.from('empresas').delete().eq('id', e.id);
          if (error) toast(erroAmigavel(error), 'erro'); else { toast('Empresa excluída'); g.fechar(); }
        } },
      ]);
    }
  });
  g.cab.addEventListener('change', async (ev) => {
    if (ev.target.dataset.acao !== 'estagio') return;
    try { await moverEstagio(atual(), ev.target.value); desenharCab(); if (abaAtual === 'geral' || abaAtual === 'tempo') desenharCorpo(); } catch { desenharCab(); }
  });

  limpezas.push(ouvir('empresas', (p) => { if (p.new?.id === id) { desenharCab(); } else if (p.eventType === 'DELETE' && p.old?.id === id) g.fechar(); }));

  desenharCab();
  desenharCorpo();

  /* ------------------------------ Aba: visão geral ------------------------------ */
  async function abaGeral(c, e) {
    // A ordem aqui tem que ser a mesma das consultas abaixo (estava trocada e o cartão de mensagens nunca aparecia)
    const [{ data: conv }, { data: ultPesq }, { data: ultDisp }, { data: prox }] = await Promise.all([
      sb.from('whatsapp_conversas').select('id').eq('empresa_id', e.id).limit(1).maybeSingle(),
      sb.from('pesquisas').select('dados,criado_em').eq('empresa_id', e.id).eq('status', 'pronta').order('criado_em', { ascending: false }).limit(1),
      sb.from('disparos').select('id,texto,status,formato,passo,variante,angulo,criado_em').eq('empresa_id', e.id).neq('status', 'cancelado').order('criado_em', { ascending: false }).limit(10),
      sb.from('agenda').select('*').eq('empresa_id', e.id).gte('inicio', new Date().toISOString()).eq('status', 'agendado').order('inicio').limit(1),
    ]);
    let ultimaFala = '';
    if (conv) {
      const { data: ult } = await sb.from('whatsapp_mensagens').select('texto,direcao').eq('conversa_id', conv.id).order('momento', { ascending: false }).limit(1);
      if (ult?.[0]?.direcao === 'in') ultimaFala = ult[0].texto || '';
    }
    // Quem assina a variação simples (o Antônio também manda pelo mesmo painel); fica guardado neste aparelho
    let remetente = 'Marcelo';
    try { remetente = localStorage.getItem('hd.remetente') || 'Marcelo'; } catch { /* sem armazenamento: fica Marcelo */ }
    const cop = proximaMensagem(e, ultimaFala, remetente);
    const briefing = ultPesq?.[0]?.dados?.briefing ? ultPesq[0].dados : null;
    const disp = disparosAtuais(ultDisp);
    const dias = diasDesde(e.estagio_desde);
    const vencida = e.proxima_acao_em && new Date(e.proxima_acao_em) < new Date();
    c.innerHTML = `
      ${raioX(e)}
      ${cartaoPronto(briefing, disp, e)}

      <div class="card mt-16 ${vencida ? 'destaque' : ''}">
        <div class="card-cab"><div class="icone-caixa sm">${icone('alvo')}</div><h3>Próxima ação</h3>
          <div class="right">${e.proxima_acao_em ? `<span class="selo ${vencida ? 'vermelho' : 'laranja'}">${icone('relogio')}${vencida ? 'venceu ' : ''}${relativo(e.proxima_acao_em)}</span>` : ''}</div></div>
        <p style="white-space:pre-wrap">${e.proxima_acao ? esc(e.proxima_acao) : '<span class="dim">Sem próxima ação definida. Todo negócio em andamento precisa de uma.</span>'}</p>
        <div class="row wrap mt-12">
          <button class="btn sm" data-g="acao">${icone('editar')}${e.proxima_acao ? 'Mudar' : 'Definir'}</button>
          ${e.proxima_acao ? `<button class="btn sm verde" data-g="concluir">${icone('check')}Concluída</button>` : ''}
          ${prox?.[0] ? `<span class="dim" style="font-size:13px">${icone('agenda')} ${esc(prox[0].titulo)} · ${dataHora(prox[0].inicio)}</span>` : ''}
        </div>
      </div>

      <div class="card mt-16">
        <div class="card-cab"><div class="icone-caixa sm">${icone('clientes')}</div><h3>Para abordar</h3><div class="right"><button class="btn xs fantasma" data-g="editar">${icone('editar')}Editar</button></div></div>
        <dl class="ficha-dl">
          <dt>Quem decide</dt><dd class="${e.decisor ? '' : 'dim'}">${esc(e.decisor || 'Não identificado ainda')}${e.decisor_obs ? `<small>${esc(e.decisor_obs)}</small>` : ''}</dd>
          <dt>Gancho</dt><dd class="${e.gancho ? '' : 'dim'}">${esc(e.gancho || 'Sem gancho registrado')}</dd>
          <dt>Dor</dt><dd class="${e.dor ? '' : 'dim'}">${esc(e.dor || 'Sem dor registrada')}</dd>
        </dl>
      </div>

      ${e.resumo ? blocoResumo(e.resumo) : ''}

      <div class="card mt-16 copiloto">
        <div class="card-cab"><div class="icone-caixa sm claude">${sparkClaude(18)}</div><div class="grow"><h3>Copiloto</h3><div class="dim" style="font-size:12.5px">${esc(cop.modelo)}</div></div>
          <button class="btn sm claude" data-g="claude-msg">${sparkClaude(14)}Pedir ao Claude</button></div>
        <div class="aviso ${cop.liberado ? '' : 'laranja'}" style="margin-bottom:12px">${icone(cop.liberado ? 'info' : 'relogio')}<div>${esc(cop.status)}</div></div>
        ${cop.simples ? `<div class="chips mb-8" role="group" aria-label="Quem assina">${['Marcelo', 'Antônio'].map((n) => `<button class="chip ${n === remetente ? 'on' : ''}" data-g="remetente" data-nome="${n}">Assina ${n}</button>`).join('')}</div>` : ''}
        ${cop.texto ? `<div class="msg-sugerida">${esc(cop.texto)}</div>
        <div class="row wrap mt-12"><button class="btn sm" data-g="copiar">${icone('copiar')}Copiar</button>
          ${e.whatsapp ? `<a class="btn sm verde" href="${linkWhats(e.whatsapp, cop.texto)}" target="_blank" rel="noopener">${icone('whatsapp')}Abrir no WhatsApp</a>` : ''}
          <button class="btn sm fantasma" data-g="registrar-envio">${icone('check')}Registrar que enviei</button></div>` : ''}
      </div>


      <div class="card mt-16">
        <div class="card-cab"><div class="icone-caixa sm neutro">${icone('lista')}</div><h3>Dados</h3><div class="right"><button class="btn xs fantasma" data-g="editar">${icone('editar')}Editar</button></div></div>
        ${grupoDados('Contato', [['WhatsApp', e.whatsapp ? telefoneBonito(e.whatsapp) : null], ['Telefone', e.telefone ? telefoneBonito(e.telefone) : null], ['E-mail', e.email], ['Endereço', e.endereco]])}
        ${grupoDados('Presença online', [['Instagram', e.instagram ? `@${e.instagram}` : null], ['Site', e.site], ['Perfil no Google', e.gmb_status]])}
        ${grupoDados('Comercial', [['Origem', NOMES_ORIGEM[e.origem] || e.origem], ['Lista', e.origem_detalhe], ['No estágio há', dias != null ? `${dias} dia${dias === 1 ? '' : 's'}` : null], ['Valor estimado', e.valor_estimado != null ? brl(e.valor_estimado) : null], ['CNPJ', e.cnpj], ['Pasta no repositório', e.pasta_repo]])}
        ${(e.tags || []).length ? `<div class="chips mt-12">${e.tags.map((t) => `<span class="selo">${icone('tag')}${esc(t)}</span>`).join('')}</div>` : ''}
      </div>

      ${(e.score_motivos || []).length ? `<details class="card mt-16 dobra"><summary><span class="icone-caixa sm neutro">${icone('raio')}</span><h3 class="grow">Por que ${e.score}/100</h3>${icone('chevb', 'seta')}</summary>
        <div class="motivos mt-12">${e.score_motivos.map((m) => `<div class="motivo"><b>+${m.pontos}</b><span>${esc(m.sinal)}</span><small class="dim">${esc(m.detalhe || '')}</small></div>`).join('')}</div></details>` : ''}

      ${e.lista_item_id ? `<details class="card mt-16 dobra" data-linha-orig><summary><span class="icone-caixa sm neutro">${icone('planilha')}</span><div class="grow"><h3>Linha original da planilha</h3><div class="dim" style="font-size:12.5px">Exatamente o que ${esc(NOMES_ORIGEM[e.origem] || 'a lista')} mandou, coluna por coluna</div></div>${icone('chevb', 'seta')}</summary><div data-linha class="mt-12"></div></details>` : ''}`;

    const dobraOrig = $('[data-linha-orig]', c);
    if (dobraOrig) dobraOrig.addEventListener('toggle', async () => {
      const alvo = $('[data-linha]', dobraOrig);
      if (!dobraOrig.open || alvo.dataset.ok) return;
      alvo.innerHTML = esqueleto(3, 18);
      const { data: it, error } = await sb.from('lista_itens').select('dados, lista_id, listas(nome, criado_em)').eq('id', e.lista_item_id).maybeSingle();
      if (error || !it) { alvo.innerHTML = `<p class="dim">${esc(error ? erroAmigavel(error) : 'A linha de origem não existe mais (a lista pode ter sido apagada).')}</p>`; return; }
      const pares = Object.entries(it.dados || {});
      alvo.dataset.ok = '1';
      alvo.innerHTML = `${it.listas ? `<p class="dim mb-8" style="font-size:12.5px">${esc(it.listas.nome)} · importada ${dataLonga(it.listas.criado_em)} · <a href="#/encontrar/lista/${it.lista_id}">abrir a lista</a></p>` : ''}
        <dl class="ficha-dl linha-orig">${pares.map(([k, v]) => `<dt>${esc(k)}</dt><dd class="${String(v ?? '').trim() ? '' : 'dim'}">${esc(String(v ?? '').trim() || 'vazio')}</dd>`).join('') || '<dd class="dim">Sem colunas guardadas.</dd>'}</dl>`;
    });

    c.onclick = async (ev) => {
      const b = ev.target.closest('[data-g]'); if (!b) return;
      const a = b.dataset.g;
      if (a === 'editar') editarEmpresa(atual());
      if (a === 'resumo') { const r = $('.resumo-txt', c); b.textContent = r.classList.toggle('fechado') ? 'Ler tudo' : 'Recolher'; }
      if (a === 'copiar') copiar(cop.texto, 'Mensagem copiada');
      if (a === 'remetente') { try { localStorage.setItem('hd.remetente', b.dataset.nome); } catch { /* sem armazenamento */ } desenharCorpo(); }
      if (a === 'copiar-pronta') copiar(b.dataset.texto, 'Mensagem copiada');
      if (a === 'ir-briefing') { abaAtual = 'dossie'; desenharCab(); desenharCorpo(); }
      if (a === 'claude-msg') pedirMensagemClaude(atual(), ultimaFala ? `Última fala do lead: "${ultimaFala}"` : '');
      if (a === 'acao') {
        const txt = await perguntar('Próxima ação', { valor: atual().proxima_acao || '', multilinha: true, placeholder: 'O que precisa acontecer, e quando', rotulo: 'Salvar' });
        if (txt == null) return;
        const quando = await perguntar('Até quando? (opcional)', { placeholder: 'dd/mm/aaaa ou deixe em branco', rotulo: 'Salvar', valor: atual().proxima_acao_em ? new Date(atual().proxima_acao_em).toLocaleDateString('pt-BR') : '' });
        let data = null;
        const mm = String(quando || '').match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/);
        if (mm) { const ano = mm[3] ? (mm[3].length === 2 ? 2000 + Number(mm[3]) : Number(mm[3])) : new Date().getFullYear(); data = new Date(ano, Number(mm[2]) - 1, Number(mm[1]), 18, 0).toISOString(); }
        try { await salvarEmpresa(e.id, { proxima_acao: txt.trim() || null, proxima_acao_em: data }); desenharCorpo(); } catch (err) { toast(erroAmigavel(err), 'erro'); }
      }
      if (a === 'concluir') {
        try {
          await registrarAtividade(e.id, 'nota', `Concluído: ${atual().proxima_acao}`);
          await salvarEmpresa(e.id, { proxima_acao: null, proxima_acao_em: null });
          toast('Ação concluída. Defina a próxima.'); desenharCorpo();
        } catch (err) { toast(erroAmigavel(err), 'erro'); }
      }
      if (a === 'registrar-envio') {
        try {
          await registrarAtividade(e.id, 'mensagem', 'Mensagem enviada', cop.texto);
          if (['novo', 'qualificado'].includes(atual().estagio)) await moverEstagio(atual(), 'abordado', { silencioso: true });
          toast('Envio registrado'); desenharCab(); desenharCorpo();
        } catch (err) { toast(erroAmigavel(err), 'erro'); }
      }
    };
  }

  /* ------------------------------ Aba: linha do tempo ------------------------------ */
  async function abaTempo(c, e) {
    const { data, error } = await sb.from('atividades').select('*').eq('empresa_id', e.id).order('criado_em', { ascending: false }).limit(200);
    if (error) throw error;
    c.innerHTML = `
      <form class="card nova-atividade" novalidate>
        <div class="row wrap gap-6 mb-12" role="group" aria-label="Tipo">${['nota', 'ligacao', 'mensagem', 'reuniao', 'visita', 'proposta', 'pagamento'].map((t, i) => `<button type="button" class="chip ${i === 0 ? 'on' : ''}" data-tipo="${t}">${icone(ICONE_TIPO[t])}${NOMES_TIPO[t]}</button>`).join('')}</div>
        <textarea class="txt" name="texto" rows="2" style="min-height:70px" placeholder="O que aconteceu? (ex.: liguei, ele pediu pra falar com a sócia na quinta)"></textarea>
        <div class="row mt-12"><span class="dim" style="font-size:12.5px">Fica registrado como ${esc(quem())}.</span><button class="btn sm prim right" type="submit">${icone('mais')}Registrar</button></div>
      </form>
      <div class="linha-tempo mt-16">${(data || []).map(itemTempo).join('') || vazio('relogio', 'Nada registrado ainda', 'Ligações, mensagens e reuniões aparecem aqui, inclusive o que o Claude fizer.')}</div>`;
    let tipo = 'nota';
    $$('[data-tipo]', c).forEach((b) => (b.onclick = () => { tipo = b.dataset.tipo; $$('[data-tipo]', c).forEach((x) => x.classList.toggle('on', x === b)); }));
    $('form', c).onsubmit = async (ev) => {
      ev.preventDefault();
      const txt = ev.target.texto.value.trim();
      if (!txt) { toast('Escreva o que aconteceu', 'erro'); return; }
      const btn = $('button[type=submit]', c); botaoCarregando(btn, true);
      try {
        const [titulo, ...resto] = txt.split('\n');
        await registrarAtividade(e.id, tipo, titulo.slice(0, 140), resto.join('\n').trim() || (titulo.length > 140 ? titulo : null));
        toast('Registrado'); desenharCorpo();
      } catch (err) { toast(erroAmigavel(err), 'erro'); botaoCarregando(btn, false); }
    };
  }

  /* ------------------------------ Aba: negócios e dinheiro ------------------------------ */
  async function abaNegocios(c, e) {
    const [{ data: negs, error: e1 }, { data: fins, error: e2 }] = await Promise.all([
      sb.from('negocios').select('*').eq('empresa_id', e.id).order('criado_em'),
      sb.from('financeiro').select('*').eq('empresa_id', e.id).order('criado_em'),
    ]);
    if (e1 || e2) throw e1 || e2;
    const soma = (st) => (fins || []).filter((f) => f.status === st).reduce((a, f) => a + Number(f.valor), 0);
    c.innerHTML = `
      <div class="kpis" style="grid-template-columns:repeat(3,1fr)">
        <div class="kpi verde"><div class="kl"><span class="ic">${icone('checkc')}</span>Recebido</div><div class="kv">${brl(soma('recebido'))}</div></div>
        <div class="kpi amarelo"><div class="kl"><span class="ic">${icone('relogio')}</span>A receber</div><div class="kv">${brl(soma('a_receber'))}</div></div>
        <div class="kpi"><div class="kl"><span class="ic">${icone('tendencia')}</span>Previsto</div><div class="kv">${brl(soma('previsto'))}</div></div>
      </div>
      <div class="card">
        <div class="card-cab"><h3>Negócios</h3><div class="right"><button class="btn sm" data-n="novo">${icone('mais')}Negócio</button></div></div>
        ${(negs || []).length ? negs.map((n) => `<div class="item"><div class="grow"><div class="tit">${esc(n.titulo)}</div>
          <div class="sub">${esc({ fase1: 'Fase 1', fase2: 'Fase 2', fase3: 'Fase 3', avulso: 'Avulso' }[n.fase])} · ${n.valor != null ? brl(n.valor) : 'valor em aberto'}${n.recorrencia_mensal ? ` + ${brl(n.recorrencia_mensal)}/mês` : ''} · entrega: ${esc(ENTREGA[n.entrega])}</div>
          ${n.observacao ? `<div class="sub" style="margin-top:4px;white-space:pre-wrap">${esc(n.observacao)}</div>` : ''}</div>
          <span class="selo ${STATUS_NEG[n.status][0]}">${STATUS_NEG[n.status][1]}</span><button class="btn icone sm fantasma" data-n="editar" data-id="${n.id}" aria-label="Editar negócio">${icone('editar')}</button></div>`).join('')
          : vazio('maleta', 'Nenhum negócio ainda', 'Registre a Fase 1 quando a proposta for apresentada.')}
      </div>
      <div class="card mt-16">
        <div class="card-cab"><h3>Dinheiro</h3><div class="right"><button class="btn sm" data-f="novo">${icone('mais')}Lançamento</button></div></div>
        ${(fins || []).length ? fins.map((f) => `<div class="item"><div class="grow"><div class="tit">${esc(f.descricao)}</div><div class="sub">${f.tipo === 'recorrente' ? 'Recorrente · ' : ''}${f.vencimento ? `vence ${new Date(f.vencimento + 'T12:00').toLocaleDateString('pt-BR')}` : 'sem vencimento'}${f.recebido_em ? ` · recebido ${new Date(f.recebido_em + 'T12:00').toLocaleDateString('pt-BR')}` : ''}${f.observacao ? ` · ${esc(f.observacao)}` : ''}</div></div>
          <b class="num">${brl(f.valor)}</b><span class="selo ${STATUS_FIN[f.status][0]}">${STATUS_FIN[f.status][1]}</span>
          ${f.status !== 'recebido' ? `<button class="btn xs verde" data-f="receber" data-id="${f.id}">${icone('check')}Recebi</button>` : ''}
          <button class="btn icone sm fantasma" data-f="editar" data-id="${f.id}" aria-label="Editar lançamento">${icone('editar')}</button></div>`).join('')
          : vazio('dinheiro', 'Sem lançamentos', 'Entrada, saldo e mensalidade entram aqui. Só é dinheiro quando cai na conta.')}
      </div>`;

    c.onclick = async (ev) => {
      const b = ev.target.closest('[data-n],[data-f]'); if (!b) return;
      if (b.dataset.n) formNegocio(e, b.dataset.n === 'editar' ? negs.find((n) => n.id === b.dataset.id) : null);
      if (b.dataset.f === 'novo' || b.dataset.f === 'editar') formFinanceiro(e, negs || [], b.dataset.f === 'editar' ? fins.find((f) => f.id === b.dataset.id) : null);
      if (b.dataset.f === 'receber') {
        const f = fins.find((x) => x.id === b.dataset.id);
        const { error } = await sb.from('financeiro').update({ status: 'recebido', recebido_em: new Date().toISOString().slice(0, 10) }).eq('id', f.id);
        if (error) { toast(erroAmigavel(error), 'erro'); return; }
        await registrarAtividade(e.id, 'pagamento', `Recebido: ${f.descricao}`, brl(f.valor));
        toast(`${brl(f.valor)} recebido`); desenharCorpo();
      }
    };
  }

  function formNegocio(e, n) {
    import('./ui.js').then(({ modal }) => {
      const m = modal({
        titulo: n ? 'Editar negócio' : 'Novo negócio', subtitulo: e.nome, icone: 'maleta',
        corpo: `<form novalidate>
          <div class="campo"><label>Título *</label><input class="inp" name="titulo" value="${esc(n?.titulo || '')}" placeholder="Ex.: Fase 1 — Site + Google Meu Negócio"></div>
          <div class="grade-2">
            <div class="campo"><label>Fase</label><select class="sel" name="fase">${[['fase1', 'Fase 1'], ['fase2', 'Fase 2'], ['fase3', 'Fase 3'], ['avulso', 'Avulso']].map(([v, r]) => `<option value="${v}"${(n?.fase || 'fase1') === v ? ' selected' : ''}>${r}</option>`).join('')}</select></div>
            <div class="campo"><label>Status</label><select class="sel" name="status">${Object.entries(STATUS_NEG).map(([v, [, r]]) => `<option value="${v}"${(n?.status || 'aberto') === v ? ' selected' : ''}>${r}</option>`).join('')}</select></div>
            <div class="campo"><label>Valor do projeto (R$)</label><input class="inp" name="valor" inputmode="decimal" value="${n?.valor ?? ''}" placeholder="1200"></div>
            <div class="campo"><label>Mensalidade (R$)</label><input class="inp" name="recorrencia_mensal" inputmode="decimal" value="${n?.recorrencia_mensal ?? ''}"></div>
            <div class="campo"><label>Entrega</label><select class="sel" name="entrega">${Object.entries(ENTREGA).map(([v, r]) => `<option value="${v}"${(n?.entrega || 'nao_iniciada') === v ? ' selected' : ''}>${r}</option>`).join('')}</select></div>
            <div class="campo"><label>Chance (%)</label><input class="inp" name="probabilidade" inputmode="numeric" value="${n?.probabilidade ?? ''}" placeholder="0 a 100"></div>
          </div>
          <div class="campo"><label>Observação</label><textarea class="txt" name="observacao" rows="3">${esc(n?.observacao || '')}</textarea></div>
        </form>`,
        pe: `${n ? `<button class="btn perigo" data-excluir>${icone('lixo')}Excluir</button><span class="grow"></span>` : ''}<button class="btn" data-fechar>Cancelar</button><button class="btn prim" data-salvar>${icone('check')}Salvar</button>`,
      });
      $$('[data-fechar]', m.el).forEach((x) => (x.onclick = () => m.fechar()));
      const nn = (v) => { const x = parseFloat(String(v).replace(/[^\d,.-]/g, '').replace(',', '.')); return Number.isFinite(x) ? x : null; };
      $('[data-salvar]', m.el).onclick = async () => {
        const f = Object.fromEntries(new FormData($('form', m.el)).entries());
        if (!f.titulo.trim()) { toast('Dê um título', 'erro'); return; }
        const prob = nn(f.probabilidade);
        const linha = { empresa_id: e.id, titulo: f.titulo.trim(), fase: f.fase, status: f.status, valor: nn(f.valor), recorrencia_mensal: nn(f.recorrencia_mensal), entrega: f.entrega, probabilidade: prob == null ? null : Math.max(0, Math.min(100, Math.round(prob))), observacao: f.observacao.trim() || null };
        const r = n ? await sb.from('negocios').update(linha).eq('id', n.id) : await sb.from('negocios').insert(linha);
        if (r.error) { toast(erroAmigavel(r.error), 'erro'); return; }
        if (!n || n.status !== linha.status) await registrarAtividade(e.id, 'proposta', `${linha.titulo}: ${STATUS_NEG[linha.status][1].toLowerCase()}`, linha.valor != null ? brl(linha.valor) : null);
        if (linha.status === 'ganho' && e.estagio !== 'ganho' && await confirmar('Negócio ganho', `Mover ${e.nome} para Ganho na esteira?`, { rotulo: 'Mover para Ganho' })) await moverEstagio(atual(), 'ganho');
        m.fechar(); toast('Negócio salvo'); desenharCorpo();
      };
      if (n) $('[data-excluir]', m.el).onclick = async () => {
        if (!(await confirmar('Excluir negócio?', n.titulo, { rotulo: 'Excluir', perigo: true }))) return;
        const { error } = await sb.from('negocios').delete().eq('id', n.id);
        if (error) toast(erroAmigavel(error), 'erro'); else { m.fechar(); toast('Negócio excluído'); desenharCorpo(); }
      };
    });
  }

  function formFinanceiro(e, negs, f) {
    import('./ui.js').then(({ modal }) => {
      const m = modal({
        titulo: f ? 'Editar lançamento' : 'Novo lançamento', subtitulo: e.nome, icone: 'dinheiro',
        corpo: `<form novalidate>
          <div class="campo"><label>Descrição *</label><input class="inp" name="descricao" value="${esc(f?.descricao || '')}" placeholder="Ex.: Fase 1 — entrada (50%)"></div>
          <div class="grade-2">
            <div class="campo"><label>Valor (R$) *</label><input class="inp" name="valor" inputmode="decimal" value="${f?.valor ?? ''}"></div>
            <div class="campo"><label>Status</label><select class="sel" name="status">${Object.entries(STATUS_FIN).map(([v, [, r]]) => `<option value="${v}"${(f?.status || 'a_receber') === v ? ' selected' : ''}>${r}</option>`).join('')}</select></div>
            <div class="campo"><label>Tipo</label><select class="sel" name="tipo"><option value="projeto"${f?.tipo !== 'recorrente' ? ' selected' : ''}>Projeto</option><option value="recorrente"${f?.tipo === 'recorrente' ? ' selected' : ''}>Recorrente</option></select></div>
            <div class="campo"><label>Vencimento</label><input class="inp" type="date" name="vencimento" value="${f?.vencimento || ''}"></div>
            <div class="campo"><label>Negócio</label><select class="sel" name="negocio_id"><option value="">Nenhum</option>${negs.map((n) => `<option value="${n.id}"${f?.negocio_id === n.id ? ' selected' : ''}>${esc(n.titulo)}</option>`).join('')}</select></div>
          </div>
          <div class="campo"><label>Observação</label><input class="inp" name="observacao" value="${esc(f?.observacao || '')}"></div>
        </form>`,
        pe: `${f ? `<button class="btn perigo" data-excluir>${icone('lixo')}Excluir</button><span class="grow"></span>` : ''}<button class="btn" data-fechar>Cancelar</button><button class="btn prim" data-salvar>${icone('check')}Salvar</button>`,
      });
      $$('[data-fechar]', m.el).forEach((x) => (x.onclick = () => m.fechar()));
      $('[data-salvar]', m.el).onclick = async () => {
        const d = Object.fromEntries(new FormData($('form', m.el)).entries());
        const valor = parseFloat(String(d.valor).replace(/[^\d,.-]/g, '').replace(',', '.'));
        if (!d.descricao.trim() || !Number.isFinite(valor)) { toast('Descrição e valor são obrigatórios', 'erro'); return; }
        const linha = { empresa_id: e.id, descricao: d.descricao.trim(), valor, status: d.status, tipo: d.tipo, vencimento: d.vencimento || null, negocio_id: d.negocio_id || null, observacao: d.observacao.trim() || null,
          recebido_em: d.status === 'recebido' ? (f?.recebido_em || new Date().toISOString().slice(0, 10)) : null };
        const r = f ? await sb.from('financeiro').update(linha).eq('id', f.id) : await sb.from('financeiro').insert(linha);
        if (r.error) { toast(erroAmigavel(r.error), 'erro'); return; }
        m.fechar(); toast('Lançamento salvo'); desenharCorpo();
      };
      if (f) $('[data-excluir]', m.el).onclick = async () => {
        if (!(await confirmar('Excluir lançamento?', f.descricao, { rotulo: 'Excluir', perigo: true }))) return;
        const { error } = await sb.from('financeiro').delete().eq('id', f.id);
        if (error) toast(erroAmigavel(error), 'erro'); else { m.fechar(); desenharCorpo(); }
      };
    });
  }

  /* ------------------------------ Aba: agenda ------------------------------ */
  async function abaAgenda(c, e) {
    const { data, error } = await sb.from('agenda').select('*').eq('empresa_id', e.id).order('inicio', { ascending: false });
    if (error) throw error;
    const agora = Date.now();
    const futuros = (data || []).filter((x) => new Date(x.inicio).getTime() >= agora).reverse();
    const passados = (data || []).filter((x) => new Date(x.inicio).getTime() < agora);
    const linha = (x) => `<div class="item clicavel" data-ag="${x.id}"><div class="icone-caixa sm ${x.status === 'feito' ? 'verde' : x.status === 'cancelado' ? 'vermelho' : ''}">${icone('agenda')}</div><div class="grow"><div class="tit">${esc(x.titulo)}</div><div class="sub">${esc((TIPOS_AGENDA.find((t) => t[0] === x.tipo) || [])[1] || x.tipo)} · ${dataHora(x.inicio)}${x.local ? ` · ${esc(x.local)}` : ''}</div></div><span class="selo">${esc({ agendado: 'Agendado', feito: 'Feito', remarcado: 'Remarcado', cancelado: 'Cancelado', nao_compareceu: 'Não compareceu' }[x.status])}</span><a class="btn icone sm fantasma" href="${linkGoogleAgenda(x)}" target="_blank" rel="noopener" aria-label="Google Agenda" onclick="event.stopPropagation()">${icone('link')}</a></div>`;
    c.innerHTML = `<div class="row mb-12"><h3 class="grow">Compromissos</h3><button class="btn sm prim" data-novo-ag>${icone('mais')}Agendar</button></div>
      <div class="card"><div class="rotulo mb-8">Próximos</div>${futuros.map(linha).join('') || '<p class="dim">Nada marcado.</p>'}</div>
      <div class="card mt-16"><div class="rotulo mb-8">Anteriores</div>${passados.map(linha).join('') || '<p class="dim">Sem histórico.</p>'}</div>`;
    $('[data-novo-ag]', c).onclick = () => agendar({ empresa_id: e.id, tipo: 'r1' });
    $$('[data-ag]', c).forEach((it) => (it.onclick = () => agendar({}, data.find((x) => x.id === it.dataset.ag))));
  }

  /* ------------------------------ Aba: briefing (investigação profunda) ------------------------------ */
  async function abaDossie(c, e) {
    const [{ data, error }, fila, { data: disps }] = await Promise.all([
      sb.from('pesquisas').select('*').eq('empresa_id', e.id).order('criado_em', { ascending: false }),
      estadoInvestigacao(e.id),
      sb.from('disparos').select('id,texto,status,formato,passo,variante,angulo,criado_em').eq('empresa_id', e.id).neq('status', 'cancelado').order('criado_em', { ascending: false }).limit(10),
    ]);
    if (error) throw error;
    const atual = (data || []).find((p) => p.status === 'pronta') || null;
    const b = atual?.dados?.briefing;
    const anteriores = (data || []).filter((p) => p !== atual && p.status === 'pronta');
    c.innerHTML = `
      ${cartaoInvestigar(fila, atual)}
      ${b ? blocoBriefing(atual, e, disparosAtuais(disps)) + (b.antigo && atual.conteudo_md ? `<div class="card mt-16 dossie-card"><h3>Investigação completa (formato antigo)</h3><div class="md mt-12" data-md="${atual.id}"></div></div>` : '') : atual ? `<div class="card mt-16 dossie-card"><div class="card-cab"><div class="grow"><h3>${esc(atual.titulo)}</h3><div class="dim" style="font-size:12.5px">${dataHora(atual.criado_em)} · formato antigo, sem cartões</div></div></div>${atual.resumo ? `<p>${esc(atual.resumo)}</p>` : ''}<div class="md mt-12" data-md="${atual.id}"></div></div>`
        : `<div class="card mt-16">${vazio('radar', 'Ainda não investigado', 'A investigação profunda decide se o lead é Qualificado ou Perdido e monta o briefing completo, com as mensagens.')}</div>`}
      ${anteriores.length ? `<details class="card mt-16 dobra"><summary><span class="icone-caixa sm neutro">${icone('relogio')}</span><h3 class="grow">Pesquisas anteriores (${anteriores.length})</h3>${icone('chevb', 'seta')}</summary>
        ${anteriores.map((p) => `<div class="mt-16 dossie-card"><b>${esc(p.titulo)}</b><div class="dim" style="font-size:12.5px">${dataHora(p.criado_em)}</div><div class="md mt-8" data-md="${p.id}"></div></div>`).join('')}</details>` : ''}
      <details class="card mt-16 dobra"><summary><span class="icone-caixa sm neutro">${icone('raio')}</span><h3 class="grow">Checagens rápidas</h3>${icone('chevb', 'seta')}</summary>
        <div class="row wrap mt-12"><button class="btn sm" data-checar-site ${e.site ? '' : 'disabled'}>${icone('globo')}Checar site agora</button>
          <button class="btn sm" data-cnpj ${e.cnpj ? '' : 'disabled'}>${icone('predio')}Consultar CNPJ</button></div><div data-rapido class="mt-12"></div></details>`;
    for (const p of data || []) { const alvo = $(`[data-md="${p.id}"]`, c); if (alvo && p.conteudo_md) preencherMarkdown(alvo, p.conteudo_md); }

    ligarInvestigar(c, e);
    c.addEventListener('click', (ev) => {
      const cp = ev.target.closest('[data-copiar-msg]'); if (cp) copiar(cp.dataset.copiarMsg, 'Mensagem copiada');
    });
    $('[data-checar-site]', c).onclick = async (ev) => {
      const btn = ev.currentTarget; botaoCarregando(btn, true, 'Checando…');
      const rap = $('[data-rapido]', c);
      try {
        const { checarSite } = await import('./servicos.js');
        const r = await checarSite(e.site);
        rap.innerHTML = `<div class="aviso ${r.status === 'ok' ? 'verde' : 'vermelho'}">${icone(r.status === 'ok' ? 'checkc' : 'alerta')}<div><b>${esc(r.resumo)}</b>${r.detalhe ? `<br>${esc(r.detalhe)}` : ''}</div></div>`;
        if (r.status && r.status !== e.site_status && await confirmar('Atualizar a ficha?', `Marcar o site como "${{ ok: 'ok', fora_do_ar: 'fora do ar', ruim: 'fraco' }[r.status] || r.status}"?`, { rotulo: 'Atualizar' })) {
          await salvarEmpresa(e.id, { site_status: r.status });
          await registrarAtividade(e.id, 'pesquisa', 'Site checado', r.resumo);
        }
      } catch (err) { rap.innerHTML = `<div class="aviso vermelho">${icone('alerta')}<div>${esc(erroAmigavel(err))}</div></div>`; }
      botaoCarregando(btn, false);
    };
    $('[data-cnpj]', c).onclick = async (ev) => {
      const btn = ev.currentTarget; botaoCarregando(btn, true, 'Consultando…');
      const rap = $('[data-rapido]', c);
      try {
        const { consultarCNPJ } = await import('./servicos.js');
        const r = await consultarCNPJ(e.cnpj);
        rap.innerHTML = `<div class="card"><b>${esc(r.razao_social || '')}</b><div class="dados-grade mt-8">${dado('Situação', r.descricao_situacao_cadastral)}${dado('Abertura', r.data_inicio_atividade ? new Date(r.data_inicio_atividade + 'T12:00').toLocaleDateString('pt-BR') : null)}${dado('Porte', r.porte)}${dado('Atividade', r.cnae_fiscal_descricao)}${dado('Município', r.municipio ? `${r.municipio}/${r.uf}` : null)}${dado('Natureza', r.natureza_juridica)}</div></div>`;
        await registrarAtividade(e.id, 'pesquisa', 'CNPJ consultado', `${r.razao_social || ''} · ${r.descricao_situacao_cadastral || ''} · abertura ${r.data_inicio_atividade || '?'}`);
      } catch (err) { rap.innerHTML = `<div class="aviso vermelho">${icone('alerta')}<div>${esc(erroAmigavel(err))}</div></div>`; }
      botaoCarregando(btn, false);
    };
    limpezas.push(ouvir('pesquisas', (p) => { if (p.new?.empresa_id === e.id && abaAtual === 'dossie') desenharCorpo(); }));
    limpezas.push(ouvir('jobs', (p) => { if (p.new?.tipo === 'investigar_empresa' && abaAtual === 'dossie') desenharCorpo(); }));
  }

  /* Botão Investigar (cartão no topo do Briefing e atalho no cabeçalho) */
  function ligarInvestigar(c, e) {
    $$('[data-investigar]', c).forEach((b) => (b.onclick = async (ev) => {
      const btn = ev.currentTarget;
      const fila = await estadoInvestigacao(e.id);
      if (fila.meu) { toast(fila.meu.status === 'processando' ? 'Já está sendo investigado' : 'Já está na fila', 'info'); return; }
      botaoCarregando(btn, true, 'Pondo na fila…');
      try {
        await criarJob('investigar_empresa', {}, { empresa_id: e.id }, 4);
        toast(fila.total ? `Na fila: ${fila.total} antes deste` : 'Investigação começando', 'info');
        desenharCorpo();
      } catch (err) { toast(erroAmigavel(err), 'erro'); botaoCarregando(btn, false); }
    }));
    $$('[data-cancelar-inv]', c).forEach((b) => (b.onclick = async () => {
      const fila = await estadoInvestigacao(e.id);
      if (!fila.meu) return;
      if (!(await confirmar('Tirar da fila?', 'A investigação deste lead é cancelada.', { rotulo: 'Tirar da fila' }))) return;
      await sb.from('jobs').update({ status: 'cancelado' }).eq('id', fila.meu.id);
      toast('Tirado da fila'); desenharCorpo();
    }));
  }

  /* ------------------------------ Aba: WhatsApp ------------------------------ */
  async function abaWhats(c, e) {
    const { data: conv } = await sb.from('whatsapp_conversas').select('*').eq('empresa_id', e.id).order('ultima_em', { ascending: false }).limit(1).maybeSingle();
    if (!conv) {
      c.innerHTML = vazio('whatsapp', 'Nenhuma conversa vinculada', e.whatsapp
        ? 'Quando esse número falar com o WhatsApp conectado ao Farejador, a conversa aparece aqui com a leitura do Claude.'
        : 'Cadastre o WhatsApp da empresa para ligar as conversas a esta ficha.',
      `<div class="row wrap" style="justify-content:center">${e.whatsapp ? `<a class="btn sm verde" href="${linkWhats(e.whatsapp)}" target="_blank" rel="noopener">${icone('whatsapp')}Abrir no WhatsApp</a>` : `<button class="btn sm" data-edit>${icone('editar')}Cadastrar WhatsApp</button>`}<a class="btn sm" href="#/conversas">${icone('conversa')}Ir para Conversas</a></div>`);
      $('[data-edit]', c)?.addEventListener('click', () => editarEmpresa(e));
      return;
    }
    const { data: msgs } = await sb.from('whatsapp_mensagens').select('*').eq('conversa_id', conv.id).order('momento', { ascending: false }).limit(30);
    const lista = (msgs || []).reverse();
    const ultimaIn = [...lista].reverse().find((m) => m.direcao === 'in');
    const objs = ultimaIn ? detectarObjecoes(ultimaIn.texto) : [];
    c.innerHTML = `
      <div class="row mb-12"><div class="grow"><b>${esc(conv.nome || telefoneBonito(conv.telefone))}</b><div class="dim" style="font-size:12.5px">${esc(telefoneBonito(conv.telefone))} · última ${relativo(conv.ultima_em)}</div></div><a class="btn sm" href="#/conversas/${conv.id}">${icone('conversa')}Abrir conversa completa</a></div>
      ${objs.length ? `<div class="aviso laranja mb-12">${icone('alerta')}<div><b>Objeção detectada: ${esc(objs[0].rotulo)}</b><br>${esc(objs[0].resposta)}</div></div>` : ''}
      ${conv.analise?.resumo ? `<div class="aviso claude mb-12">${sparkClaude(16)}<div><b>Leitura do Claude</b><br>${esc(conv.analise.resumo)}</div></div>` : ''}
      <div class="bolhas card">${lista.map((m) => `<div class="bolha ${m.direcao}"><span>${esc(m.texto || `[${m.tipo}]`)}</span><small>${dataHora(m.momento)}</small></div>`).join('') || '<p class="dim">Sem mensagens sincronizadas.</p>'}</div>`;
  }
}

/* Fila da investigação: posição deste lead e quantos há antes */
async function estadoInvestigacao(empresaId) {
  const { data } = await sb.from('jobs').select('id,empresa_id,status,progresso,criado_em,prioridade').eq('tipo', 'investigar_empresa').in('status', ['fila', 'processando']).order('prioridade').order('criado_em');
  const lista = data || [];
  const rodando = lista.find((j) => j.status === 'processando');
  const meu = lista.find((j) => j.empresa_id === empresaId);
  const espera = lista.filter((j) => j.status === 'fila');
  const pos = meu && meu.status === 'fila' ? espera.findIndex((j) => j.id === meu.id) + 1 + (rodando ? 1 : 0) : 0;
  return { meu, pos, total: lista.length, rodando };
}

function cartaoInvestigar(fila, atual) {
  if (fila.meu?.status === 'processando') {
    return `<div class="card destaque"><div class="card-cab"><div class="icone-caixa claude">${sparkClaude(20)}</div><div class="grow"><h3>Investigando agora</h3><div class="dim" style="font-size:13px">${esc(fila.meu.progresso || 'Começando')}</div></div><span class="selo claude claude-pensando">${sparkClaude(12)}20 a 40 min</span></div>
      ${!farejadorOnline() ? `<div class="aviso laranja">${icone('alerta')}<div>O Farejador está offline: a investigação continua quando ele ligar.</div></div>` : ''}</div>`;
  }
  if (fila.meu) {
    return `<div class="card destaque"><div class="card-cab"><div class="icone-caixa">${icone('relogio')}</div><div class="grow"><h3>Na fila · posição ${fila.pos}</h3><div class="dim" style="font-size:13px">Uma investigação por vez. ${fila.rodando ? 'Tem outra rodando agora.' : 'Começa em instantes.'}</div></div>
      <button class="btn sm fantasma" data-cancelar-inv>${icone('x')}Tirar da fila</button></div></div>`;
  }
  const dec = atual?.dados?.decisao;
  return `<div class="card ${atual ? '' : 'destaque'}"><div class="row wrap"><div class="icone-caixa claude">${sparkClaude(20)}</div>
    <div class="grow"><h3>${atual ? 'Investigação' : 'Investigar este lead'}</h3><p class="dim" style="font-size:13px">${atual
      ? `Última: ${dataHora(atual.criado_em)}${dec ? ` · ${dec === 'perdido' ? 'Perdido' : 'Qualificado'}` : ''}. Refazer substitui a mensagem que ainda não foi aprovada.`
      : 'Seis camadas: empresa e pessoas, reputação, presença, dinheiro e momento, concorrência e cruzamento. Decide Qualificado ou Perdido e deixa a mensagem no Disparos. Leva de 20 a 40 minutos.'}</p></div>
    <button class="btn ${atual ? '' : 'claude'}" data-investigar>${sparkClaude(15)}${atual ? 'Investigar de novo' : 'Investigar'}</button></div>
    ${fila.total ? `<div class="dim mt-8" style="font-size:12.5px">${fila.total} na fila agora.</div>` : ''}</div>`;
}

/* O briefing em cartões: o que decide fica aberto, a referência fica fechada */
/* O Disparos é a fonte da mensagem: fica o rascunho mais recente de cada passo e variante, em ordem */
function disparosAtuais(lista) {
  const porPasso = new Map();
  for (const d of lista || []) { const k = `${d.passo || 1}:${d.variante || 'A'}`; if (!porPasso.has(k)) porPasso.set(k, d); }
  return [...porPasso.values()].sort((a, b) => (a.passo || 1) - (b.passo || 1) || String(a.variante || 'A').localeCompare(b.variante || 'A'));
}

const ST_DISPARO = { rascunho: 'esperando sua aprovação', aprovado: 'aprovada, na fila de envio', agendado: 'agendada', enviando: 'enviando', enviado: 'enviada', erro: 'com erro' };
const ROTULO_PASSO = { 1: 'Passo 1 · abertura, manda e espera', 2: 'Passo 2 · o corpo, só depois da resposta', 3: 'Passo 3' };

function blocoBriefing(p, e, disps = []) {
  const d = p.dados || {}; const b = d.briefing || {};
  const perdido = d.decisao === 'perdido';
  const dobra = (ic, tit, corpo, aberto = false) => corpo ? `<details class="card mt-16 dobra"${aberto ? ' open' : ''}><summary><span class="icone-caixa sm neutro">${icone(ic)}</span><h3 class="grow">${tit}</h3>${icone('chevb', 'seta')}</summary><div class="mt-12">${corpo}</div></details>` : '';
  const lista = (arr) => (arr || []).length ? `<ul class="achados">${arr.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : '';
  const leitura = (b.leitura || []).length ? `<ul class="achados">${b.leitura.map((x) => `<li class="${x.classe === 'fato' ? 'verde' : 'amarelo'}">${esc(x.texto)} <span class="selo ${x.classe === 'fato' ? 'verde' : 'amarelo'}" style="margin-left:4px">${x.classe === 'fato' ? 'fato' : 'hipótese'}</span></li>`).join('')}</ul>` : '';
  // As mensagens moram só na aba Geral (Marcelo, 28/09: duas abas com duas mensagens confundiam)
  const nMsgs = disps.length || (b.mensagens || []).length;
  const pessoas = [(b.pessoas || []).map((x) => `<dt>${esc(x.nome)}</dt><dd>${esc(x.papel || '')}${x.fonte ? `<small>${esc(x.fonte)}</small>` : ''}</dd>`).join(''),
    b.empresa ? `<dt>Empresa</dt><dd>${esc([b.empresa.cnpj && `CNPJ ${b.empresa.cnpj}`, b.empresa.razao_social, b.empresa.abertura && `aberta em ${b.empresa.abertura}`].filter(Boolean).join(' · '))}${b.empresa.cnaes?.length ? `<small>${esc(b.empresa.cnaes.join(' · '))}</small>` : ''}${b.empresa.obs ? `<small>${esc(b.empresa.obs)}</small>` : ''}</dd>` : ''].join('');
  return `
    <div class="card mt-16 ${perdido ? '' : 'destaque'} veredito">
      <div class="card-cab"><div class="icone-caixa ${perdido ? 'vermelho' : 'verde'}">${icone(perdido ? 'x' : 'checkc')}</div><div class="grow"><h3>${perdido ? 'Perdido' : 'Qualificado'}${d.nota != null ? ` · nota ${d.nota}` : ''}</h3><div class="dim" style="font-size:12.5px">Investigado em ${dataHora(p.criado_em)}${d.formato ? ` · mensagem no formato ${d.formato === 'casa' ? 'A · casa' : 'B · curiosidade'}` : ''}</div></div></div>
      ${b.veredito ? `<p>${esc(b.veredito)}</p>` : ''}${d.motivo_decisao ? `<p class="dim mt-8" style="font-size:13.5px">${esc(d.motivo_decisao)}</p>` : ''}
    </div>
    ${b.tese ? `<div class="card mt-16"><div class="card-cab"><div class="icone-caixa sm">${icone('alvo')}</div><h3>Tese recomendada</h3></div><p>${esc(b.tese)}</p>${(b.tese_alternativas || []).length ? `<div class="rotulo mt-12 mb-8">Alternativas</div>${lista(b.tese_alternativas)}` : ''}</div>` : ''}
    ${nMsgs && !perdido ? `<div class="card mt-16"><div class="row wrap"><div class="icone-caixa sm claude">${sparkClaude(16)}</div><p class="grow" style="font-size:13.5px">As mensagens deste lead ficam na aba <b>Geral</b>, num lugar só.</p><button class="btn xs" data-aba="geral">${icone('alvo')}Ver mensagens</button></div></div>` : ''}
    ${b.mapa ? dobra('alvo', 'Caminho até o fechamento', `<dl class="ficha-dl">${[['Por que esta abertura', b.mapa.objetivo_abertura], ['A ligação (R1)', b.mapa.r1], ['Proposta', b.mapa.proposta]].filter(([, t]) => t).map(([k, t]) => `<dt>${k}</dt><dd>${esc(t)}</dd>`).join('')}</dl>${(b.mapa.descobrir || []).length ? `<div class="rotulo mt-12 mb-8">Descobrir antes da proposta</div>${lista(b.mapa.descobrir)}` : ''}${(b.mapa.oportunidades || []).length ? `<div class="rotulo mt-12 mb-8">Oportunidades além da primeira venda</div>${lista(b.mapa.oportunidades)}` : ''}`, true) : ''}
    ${dobra('lampada', 'Leitura cruzada', leitura, true)}
    ${dobra('alerta', 'O que custa não resolver', b.custo ? `<p>${esc(b.custo)}</p>` : '')}
    ${dobra('maleta', 'O que vender', b.vender ? `<dl class="ficha-dl"><dt>Fase 1</dt><dd>${esc(b.vender.fase1 || '—')}</dd><dt>Fase 2</dt><dd>${esc(b.vender.fase2 || '—')}</dd><dt>Não oferecer</dt><dd>${esc(b.vender.nao_oferecer || '—')}</dd></dl>` : '')}
    ${dobra('comentario', 'Se responder assim', (b.respostas || []).length ? `<dl class="ficha-dl">${b.respostas.map((x) => `<dt>"${esc(x.se)}"</dt><dd>${esc(x.entao)}</dd>`).join('')}</dl>` : '')}
    ${dobra('x', 'Não usar na mensagem', lista(b.nao_usar))}
    ${dobra('clientes', 'Pessoas e empresa', pessoas ? `<dl class="ficha-dl">${pessoas}</dl>` : '')}
    ${dobra('mercado', 'Concorrência', (b.concorrencia || []).length ? `<dl class="ficha-dl">${b.concorrencia.map((x) => `<dt>${esc(x.nome)}</dt><dd>${esc(x.obs || '')}${x.fonte ? `<small>${esc(x.fonte)}</small>` : ''}</dd>`).join('')}</dl>` : '')}
    ${dobra('escudo', 'Compliance', lista(b.compliance))}
    ${dobra('lista', `Fatos conferidos${(b.fatos || []).length ? ` (${b.fatos.length})` : ''}`, (b.fatos || []).length ? `<div class="tabela-wrap"><table class="tabela"><thead><tr><th>Fato</th><th>Fonte</th><th>Como conferi</th></tr></thead><tbody>${b.fatos.map((x) => `<tr><td>${esc(x.fato)}</td><td>${esc(x.fonte || '')}</td><td>${esc(x.como_conferiu || '')}</td></tr>`).join('')}</tbody></table></div>` : '')}
    ${dobra('info', 'Pendências', lista(b.pendencias), (b.pendencias || []).length > 0)}`;
}

/* Aba Geral: veredito da investigação + a mensagem que vai (ou foi) no Disparos */
function cartaoPronto(d, disps, e) {
  if (!d && !disps.length) return '';
  const b = d?.briefing || {};
  const perdido = d?.decisao === 'perdido';
  // O Disparos manda; sem rascunho lá, cai para as mensagens da investigação
  const msgs = disps.length
    ? disps.map((x) => ({ passo: x.passo || 1, variante: x.variante, angulo: x.angulo, texto: x.texto, st: ST_DISPARO[x.status] || x.status }))
    : (b.mensagens || []).map((m, i) => ({ passo: m.passo || i + 1, variante: m.variante, angulo: m.angulo, texto: m.texto, st: 'da investigação, ainda não está no Disparos' }));
  // Com mais de uma abordagem no mesmo passo, cada uma leva a letra e o ângulo
  const variasNoPasso = (p) => msgs.filter((m) => m.passo === p).length > 1;
  const rotulo = (m) => variasNoPasso(m.passo) || m.angulo ? `Passo ${m.passo} · abordagem ${m.variante || 'A'}${m.angulo ? `: ${m.angulo}` : ''}` : (ROTULO_PASSO[m.passo] || `Passo ${m.passo}`);
  return `<div class="card mt-16 ${perdido ? '' : 'destaque'}">
    ${d ? `<div class="row wrap"><span class="selo ${perdido ? 'vermelho' : 'verde'}">${icone(perdido ? 'x' : 'checkc')}${perdido ? 'Perdido' : 'Qualificado'}${d.nota != null ? ` · ${d.nota}` : ''}</span><b class="grow" style="font-size:14px">${esc(b.tese || d.motivo_decisao || '')}</b><button class="btn xs fantasma" data-g="ir-briefing">${icone('radar')}Briefing</button></div>` : ''}
    ${msgs.length && !perdido ? `<h3 class="mt-16">Mensagens</h3>` + msgs.map((m) => `<div class="rotulo mt-16 mb-8">${esc(rotulo(m))} · ${esc(m.st)}</div><div class="msg-sugerida">${esc(m.texto)}</div>
      <div class="row wrap mt-12"><button class="btn sm" data-g="copiar-pronta" data-texto="${esc(m.texto)}">${icone('copiar')}Copiar</button>${e.whatsapp ? `<a class="btn sm verde" href="${linkWhats(e.whatsapp, m.texto)}" target="_blank" rel="noopener">${icone('whatsapp')}Abrir no WhatsApp</a>` : ''}</div>`).join('') + `<div class="row wrap mt-12"><a class="btn sm fantasma" href="#/disparos">${icone('enviar')}Disparos</a></div>` : ''}
    ${(b.respostas || []).length && !perdido ? `<details class="mt-16 dobra" open><summary><h3 class="grow">Se responder assim (${b.respostas.length})</h3>${icone('chevb', 'seta')}</summary>
      <dl class="ficha-dl mt-8">${b.respostas.map((x) => `<dt>"${esc(x.se)}"</dt><dd>${esc(x.entao)}</dd>`).join('')}</dl></details>` : ''}
  </div>`;
}

/* Raio-x: os quatro sinais que a prospecção levanta, lado a lado, pra ler em 2 segundos */
function raioX(e) {
  const nota = e.google_nota != null ? `${String(e.google_nota).replace('.', ',')}★` : null;
  const [corSite, txtSite] = SITE_SELO[e.site_status] || SITE_SELO.desconhecido;
  const celulas = [
    ['estrela', 'Google', nota, nota ? `${e.google_avaliacoes != null ? num(e.google_avaliacoes) : '?'} avaliações` : 'não levantado', nota && e.google_nota < 4 ? 'amarelo' : ''],
    ['instagram', 'Instagram', e.instagram_seguidores != null ? num(e.instagram_seguidores) : e.instagram ? `@${e.instagram}` : null, e.instagram_seguidores != null ? 'seguidores' : e.instagram ? 'seguidores não levantados' : 'sem perfil registrado', ''],
    ['globo', 'Site', txtSite, e.site ? e.site.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') : 'sem endereço registrado', corSite === 'cinza' ? '' : corSite],
    ['raio', 'Anúncio', e.roda_anuncio == null ? null : e.roda_anuncio ? 'Roda' : 'Não roda', e.roda_anuncio == null ? 'não verificado' : 'Biblioteca da Meta', e.roda_anuncio ? 'verde' : ''],
  ];
  return `<div class="raio-x">${celulas.map(([ic, r, v, sub, cor]) => `<div class="rx ${cor}"><div class="rx-r">${icone(ic)}${r}</div><div class="rx-v${v ? '' : ' dim'}">${esc(v || '—')}</div><div class="rx-s">${esc(sub)}</div></div>`).join('')}</div>`;
}

/* Resumo: o texto da pesquisa (Spark/Claude) vem corrido, com 🔴🟢🟡 marcando achados.
   Quebra nos marcadores e vira lista; sem marcador, respeita os parágrafos. */
const MARCAS = { '🔴': 'vermelho', '🟠': 'laranja', '🟡': 'amarelo', '🟢': 'verde', '⚠️': 'amarelo', '✅': 'verde', '❌': 'vermelho' };
function blocoResumo(txt) {
  const re = /(🔴|🟠|🟡|🟢|⚠️|✅|❌)/u;
  const partes = txt.split(re);
  const abertura = partes.shift().trim();
  const achados = [];
  for (let i = 0; i < partes.length; i += 2) { const t = (partes[i + 1] || '').trim(); if (t) achados.push([MARCAS[partes[i]], t]); }
  const longo = !achados.length && txt.length > 520;
  const corpo = achados.length
    ? `${abertura ? `<p class="resumo-abre">${esc(abertura)}</p>` : ''}<ul class="achados">${achados.map(([cor, t]) => `<li class="${cor}">${esc(t)}</li>`).join('')}</ul>`
    : `<p class="resumo-txt${longo ? ' fechado' : ''}">${esc(txt)}</p>${longo ? '<button class="btn xs fantasma mt-8" data-g="resumo">Ler tudo</button>' : ''}`;
  return `<div class="card mt-16"><div class="card-cab"><div class="icone-caixa sm neutro">${icone('radar')}</div><h3>O que o levantamento achou</h3></div>${corpo}</div>`;
}

/* Grupo de dados: mostra só o que tem valor; o que falta vira uma linha discreta */
function grupoDados(titulo, pares) {
  const cheios = pares.filter(([, v]) => v);
  const vazios = pares.filter(([, v]) => !v).map(([r]) => r);
  return `<div class="dados-grupo"><div class="rotulo mb-8">${esc(titulo)}</div>
    ${cheios.length ? `<div class="dados-grade">${cheios.map(([r, v]) => dado(r, v)).join('')}</div>` : ''}
    ${vazios.length ? `<p class="dados-falta">Sem registro: ${esc(vazios.join(', '))}</p>` : ''}</div>`;
}

function dado(rotulo, valor) {
  return `<div class="dado"><span>${esc(rotulo)}</span><b class="${valor ? '' : 'dim'}">${valor ? esc(valor) : '—'}</b></div>`;
}

function itemTempo(a) {
  const doClaude = a.autor === 'claude' || a.autor === 'farejador';
  return `<div class="lt-item"><div class="lt-ic">${doClaude ? sparkClaude(16) : icone(ICONE_TIPO[a.tipo] || 'info')}</div>
    <div class="grow"><div class="lt-t">${esc(a.titulo)}</div>${a.descricao ? `<div class="lt-d">${esc(a.descricao)}</div>` : ''}
    <div class="lt-m">${esc(a.autor)} · ${dataHora(a.criado_em)} (${relativo(a.criado_em)})${a.dados?.fonte ? ` · fonte: ${esc(a.dados.fonte)}` : ''}</div></div></div>`;
}

function textoFicha(e) {
  return [
    `${e.nome}`, [e.categoria, e.cidade].filter(Boolean).join(' · '),
    e.decisor ? `Decisor: ${e.decisor}` : '', e.whatsapp ? `WhatsApp: ${telefoneBonito(e.whatsapp)}` : '',
    e.instagram ? `Instagram: @${e.instagram}` : '', e.site ? `Site: ${e.site} (${e.site_status})` : `Site: ${e.site_status}`,
    `Estágio: ${achaEstagio(e.estagio).nome} · Score ${e.score}/100`, e.gancho ? `Gancho: ${e.gancho}` : '', e.dor ? `Dor: ${e.dor}` : '',
    e.proxima_acao ? `Próxima ação: ${e.proxima_acao}` : '',
  ].filter(Boolean).join('\n');
}
