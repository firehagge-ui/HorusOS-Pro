/* =============================================================================
   HOUND DOG — ficha da empresa (gaveta lateral): visão geral, copiloto, linha
   do tempo, negócios e dinheiro, agenda, dossiê do Claude e WhatsApp
   ============================================================================= */
import { sb, estado, ouvir, salvarEmpresa, registrarAtividade, criarJob, acompanharJob, farejadorOnline, estagio as achaEstagio, quem } from './sb.js';
import { $, $$, el, esc, gaveta, toast, confirmar, perguntar, erroAmigavel, botaoCarregando, copiar, brl, relativo, dataHora, dataLonga, telefoneBonito, linkWhats, vazio, esqueleto, preencherMarkdown, menu, iniciais, num, diasDesde } from './ui.js';
import { icone, sparkClaude } from './icones.js';
import { proximaMensagem, detectarObjecoes } from './copiloto.js';
import { editarEmpresa, agendar, moverEstagio, pedirMensagemClaude, TIPOS_AGENDA, linkGoogleAgenda } from './acoes.js';

const ICONE_TIPO = { nota: 'editar', estagio: 'esteira', ligacao: 'telefone', mensagem: 'enviar', whatsapp: 'whatsapp', reuniao: 'clientes', proposta: 'arquivo', pagamento: 'dinheiro', pesquisa: 'radar', claude: 'comentario', sistema: 'info', visita: 'mapa' };
const NOMES_TIPO = { nota: 'Nota', ligacao: 'Ligação', mensagem: 'Mensagem enviada', whatsapp: 'WhatsApp', reuniao: 'Reunião', proposta: 'Proposta', pagamento: 'Pagamento', visita: 'Visita' };
const SITE_SELO = { sem: ['vermelho', 'Sem site'], fora_do_ar: ['vermelho', 'Site fora do ar'], ruim: ['amarelo', 'Site fraco'], ok: ['verde', 'Site ok'], desconhecido: ['cinza', 'Site não verificado'] };
const TEMP = { quente: ['vermelho', 'fogo', 'Quente'], morno: ['amarelo', 'termometro', 'Morno'], frio: ['azul', 'termometro', 'Frio'] };
const ENTREGA = { nao_iniciada: 'Não iniciada', onboarding: 'Onboarding', producao: 'Em produção', revisao: 'Em revisão', entregue: 'Entregue', pausado: 'Pausado' };
const STATUS_NEG = { aberto: ['azul', 'Em aberto'], ganho: ['verde', 'Ganho'], perdido: ['vermelho', 'Perdido'], pausado: ['cinza', 'Pausado'] };
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
    g.cab.innerHTML = `
      <div class="row" style="align-items:flex-start">
        <span class="avatar lg" style="background:linear-gradient(135deg, ${est.cor}, #1a1a22);color:#fff">${esc(iniciais(e.nome))}</span>
        <div class="grow">
          <h2 class="ficha-nome">${esc(e.nome)}</h2>
          <div class="dim" style="font-size:13.5px;margin-top:3px">${esc([e.categoria, [e.bairro, e.cidade].filter(Boolean).join(', ')].filter(Boolean).join(' · ') || 'Sem categoria')}</div>
        </div>
        <button class="btn icone sm" data-acao="editar" aria-label="Editar">${icone('editar')}</button>
        <button class="btn icone sm" data-acao="mais" aria-label="Mais ações">${icone('pontos')}</button>
        <button class="btn icone sm fantasma" data-acao="fechar" aria-label="Fechar">${icone('x')}</button>
      </div>
      <div class="row wrap gap-6 mt-12">
        <select class="sel sm sel-estagio" data-acao="estagio" style="width:auto;border-color:${est.cor}66;color:${est.cor}" aria-label="Estágio">${estado.estagios.map((s) => `<option value="${s.id}"${s.id === e.estagio ? ' selected' : ''}>${esc(s.nome)}</option>`).join('')}</select>
        <span class="score sm ${e.prioridade}" title="${esc((e.score_motivos || []).map((m) => `+${m.pontos} ${m.sinal}`).join('\n') || 'Sem sinais pontuados')}">${e.score}/100</span>
        ${seloSite(e.site_status)}
        ${e.regulado ? `<span class="selo vermelho">${icone('escudo')}Regulado${e.conselho ? ` · ${esc(e.conselho)}` : ''}</span>` : ''}
        <span class="selo cinza">${esc({ lead: 'Lead', cliente: 'Cliente', interno: 'Conta interna', ex_cliente: 'Ex-cliente', nao_fit: 'Não-fit' }[e.relacao] || e.relacao)}</span>
        <div class="segmento seg-temp" role="group" aria-label="Temperatura">${['frio', 'morno', 'quente'].map((t) => `<button class="${e.temperatura === t ? 'on' : ''}" data-temp="${t}">${TEMP[t][2]}</button>`).join('')}</div>
      </div>
      <div class="row wrap gap-6 mt-12">
        ${e.whatsapp ? `<a class="btn sm verde" href="${linkWhats(e.whatsapp)}" target="_blank" rel="noopener">${icone('whatsapp')}${esc(telefoneBonito(e.whatsapp))}</a>` : '<span class="selo cinza">Sem WhatsApp</span>'}
        ${e.telefone && e.telefone !== e.whatsapp ? `<a class="btn sm" href="tel:+${e.telefone}">${icone('telefone')}Ligar</a>` : ''}
        ${e.instagram ? `<a class="btn sm" href="https://instagram.com/${esc(e.instagram)}" target="_blank" rel="noopener">${icone('instagram')}@${esc(e.instagram)}</a>` : ''}
        ${e.site ? `<a class="btn sm" href="${esc(e.site)}" target="_blank" rel="noopener">${icone('globo')}Site</a>` : ''}
        <a class="btn sm" href="https://www.google.com/maps/search/${encodeURIComponent([e.nome, e.cidade].filter(Boolean).join(' '))}" target="_blank" rel="noopener">${icone('mapa')}Maps</a>
        <button class="btn sm" data-acao="agendar">${icone('agenda')}Agendar</button>
        <button class="btn sm claude" data-acao="claude">${sparkClaude(15)}Perguntar ao Claude</button>
      </div>
      <nav class="abas" style="margin:14px 0 0;border-bottom:0">
        ${[['geral', 'Visão geral', 'alvo'], ['tempo', 'Linha do tempo', 'relogio'], ['negocios', 'Negócios e R$', 'dinheiro'], ['agenda', 'Agenda', 'agenda'], ['dossie', 'Dossiê', 'radar'], ['whats', 'WhatsApp', 'whatsapp']]
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
    if (acao === 'agendar') agendar({ empresa_id: e.id, tipo: ['novo', 'qualificado', 'abordado', 'conversando'].includes(e.estagio) ? 'r1' : 'followup' });
    if (acao === 'claude') { g.fechar(); location.hash = `#/claude?empresa=${e.id}`; }
    if (acao === 'mais') {
      menu(b, [
        { icone: 'radar', rotulo: 'Gerar dossiê com o Claude', fn: () => { abaAtual = 'dossie'; desenharCab(); desenharCorpo().then(() => $('[data-gerar-dossie]', g.corpo)?.click()); } },
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
    const [{ data: conv }, { data: prox }] = await Promise.all([
      sb.from('whatsapp_conversas').select('id').eq('empresa_id', e.id).limit(1).maybeSingle(),
      sb.from('agenda').select('*').eq('empresa_id', e.id).gte('inicio', new Date().toISOString()).eq('status', 'agendado').order('inicio').limit(1),
    ]);
    let ultimaFala = '';
    if (conv) {
      const { data: ult } = await sb.from('whatsapp_mensagens').select('texto,direcao').eq('conversa_id', conv.id).order('momento', { ascending: false }).limit(1);
      if (ult?.[0]?.direcao === 'in') ultimaFala = ult[0].texto || '';
    }
    const cop = proximaMensagem(e, ultimaFala);
    const dias = diasDesde(e.estagio_desde);
    const vencida = e.proxima_acao_em && new Date(e.proxima_acao_em) < new Date();
    c.innerHTML = `
      <div class="card ${vencida ? 'destaque' : ''}">
        <div class="card-cab"><div class="icone-caixa sm">${icone('alvo')}</div><h3>Próxima ação</h3>
          <div class="right">${e.proxima_acao_em ? `<span class="selo ${vencida ? 'vermelho' : 'laranja'}">${icone('relogio')}${vencida ? 'venceu ' : ''}${relativo(e.proxima_acao_em)}</span>` : ''}</div></div>
        <p style="white-space:pre-wrap">${e.proxima_acao ? esc(e.proxima_acao) : '<span class="dim">Sem próxima ação definida. Todo negócio em andamento precisa de uma.</span>'}</p>
        <div class="row wrap mt-12">
          <button class="btn sm" data-g="acao">${icone('editar')}${e.proxima_acao ? 'Mudar' : 'Definir'}</button>
          ${e.proxima_acao ? `<button class="btn sm verde" data-g="concluir">${icone('check')}Concluída</button>` : ''}
          ${prox?.[0] ? `<span class="dim" style="font-size:13px">${icone('agenda')} ${esc(prox[0].titulo)} · ${dataHora(prox[0].inicio)}</span>` : ''}
        </div>
      </div>

      <div class="card mt-16 copiloto">
        <div class="card-cab"><div class="icone-caixa sm claude">${sparkClaude(18)}</div><div class="grow"><h3>Copiloto</h3><div class="dim" style="font-size:12.5px">${esc(cop.modelo)}</div></div>
          <button class="btn sm claude" data-g="claude-msg">${sparkClaude(14)}Pedir ao Claude</button></div>
        <div class="aviso ${cop.liberado ? '' : 'laranja'}" style="margin-bottom:12px">${icone(cop.liberado ? 'info' : 'relogio')}<div>${esc(cop.status)}</div></div>
        ${cop.texto ? `<div class="msg-sugerida">${esc(cop.texto)}</div>
        <div class="row wrap mt-12"><button class="btn sm" data-g="copiar">${icone('copiar')}Copiar</button>
          ${e.whatsapp ? `<a class="btn sm verde" href="${linkWhats(e.whatsapp, cop.texto)}" target="_blank" rel="noopener">${icone('whatsapp')}Abrir no WhatsApp</a>` : ''}
          <button class="btn sm fantasma" data-g="registrar-envio">${icone('check')}Registrar que enviei</button></div>` : ''}
      </div>

      <div class="grade-2 mt-16" style="gap:16px">
        <div class="card"><div class="rotulo mb-8">Gancho verdadeiro</div><p class="${e.gancho ? '' : 'dim'}" style="white-space:pre-wrap">${esc(e.gancho || 'Sem gancho registrado.')}</p></div>
        <div class="card"><div class="rotulo mb-8">Dor / oportunidade</div><p class="${e.dor ? '' : 'dim'}" style="white-space:pre-wrap">${esc(e.dor || 'Sem dor registrada.')}</p></div>
      </div>

      ${e.resumo ? `<div class="card mt-16"><div class="rotulo mb-8">Resumo</div><p style="white-space:pre-wrap">${esc(e.resumo)}</p></div>` : ''}

      <div class="card mt-16">
        <div class="card-cab"><h3>Dados</h3><div class="right"><button class="btn xs" data-g="editar">${icone('editar')}Editar</button></div></div>
        <div class="dados-grade">
          ${dado('Quem decide', e.decisor)}${dado('Observação do decisor', e.decisor_obs)}
          ${dado('WhatsApp', e.whatsapp ? telefoneBonito(e.whatsapp) : null)}${dado('Telefone', e.telefone ? telefoneBonito(e.telefone) : null)}
          ${dado('E-mail', e.email)}${dado('Instagram', e.instagram ? `@${e.instagram}${e.instagram_seguidores ? ` · ${num(e.instagram_seguidores)} seguidores` : ''}` : null)}
          ${dado('Site', e.site)}${dado('Google', e.google_nota != null ? `${String(e.google_nota).replace('.', ',')}★ · ${e.google_avaliacoes ?? '?'} avaliações` : null)}
          ${dado('Perfil no Google', e.gmb_status)}${dado('Roda anúncio', e.roda_anuncio == null ? null : e.roda_anuncio ? 'Sim' : 'Não')}
          ${dado('CNPJ', e.cnpj)}${dado('Endereço', e.endereco)}
          ${dado('Origem', [e.origem, e.origem_detalhe].filter(Boolean).join(' · '))}${dado('No estágio há', dias != null ? `${dias} dia${dias === 1 ? '' : 's'}` : null)}
          ${dado('Valor estimado', e.valor_estimado != null ? brl(e.valor_estimado) : null)}${dado('Pasta no repositório', e.pasta_repo)}
        </div>
        ${(e.tags || []).length ? `<div class="chips mt-12">${e.tags.map((t) => `<span class="selo">${icone('tag')}${esc(t)}</span>`).join('')}</div>` : ''}
        ${(e.score_motivos || []).length ? `<div class="divisor"></div><div class="rotulo mb-8">Por que ${e.score}/100</div><div class="motivos">${e.score_motivos.map((m) => `<div class="motivo"><b>+${m.pontos}</b><span>${esc(m.sinal)}</span><small class="dim">${esc(m.detalhe || '')}</small></div>`).join('')}</div>` : ''}
      </div>`;

    c.onclick = async (ev) => {
      const b = ev.target.closest('[data-g]'); if (!b) return;
      const a = b.dataset.g;
      if (a === 'editar') editarEmpresa(atual());
      if (a === 'copiar') copiar(cop.texto, 'Mensagem copiada');
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

  /* ------------------------------ Aba: dossiê ------------------------------ */
  async function abaDossie(c, e) {
    const { data, error } = await sb.from('pesquisas').select('*').eq('empresa_id', e.id).order('criado_em', { ascending: false });
    if (error) throw error;
    const ultima = data?.[0];
    c.innerHTML = `
      <div class="card destaque">
        <div class="row"><div class="icone-caixa claude">${sparkClaude(22)}</div><div class="grow"><h3>Dossiê com o Claude</h3><p class="dim" style="font-size:13.5px">Checa site, Google, Instagram, anúncios na Meta, CNPJ e 2 ou 3 concorrentes do bairro. Sugere gancho verdadeiro e fase de entrada. O que não achar vira [FALTA].</p></div></div>
        <div class="row wrap mt-12"><button class="btn claude" data-gerar-dossie>${sparkClaude(15)}${ultima ? 'Refazer dossiê' : 'Gerar dossiê'}</button>
          <button class="btn sm" data-checar-site ${e.site ? '' : 'disabled'}>${icone('globo')}Checar site agora</button>
          <button class="btn sm" data-cnpj ${e.cnpj ? '' : 'disabled'}>${icone('predio')}Consultar CNPJ</button></div>
        <div data-rapido class="mt-12"></div>
        ${!farejadorOnline() ? `<div class="aviso laranja mt-12">${icone('alerta')}<div>O Farejador está offline: o pedido entra na fila e roda quando ele ligar no seu PC.</div></div>` : ''}
      </div>
      <div data-lista class="mt-16">${(data || []).map((p) => `<div class="card mt-12 dossie-card"><div class="row"><div class="grow"><b>${esc(p.titulo)}</b><div class="dim" style="font-size:12.5px">${dataHora(p.criado_em)} · ${esc({ fila: 'na fila', processando: 'pesquisando…', pronta: 'pronto', erro: 'erro' }[p.status])}</div></div>
        ${p.status === 'processando' || p.status === 'fila' ? `<span class="selo claude claude-pensando">${sparkClaude(13)}pesquisando</span>` : ''}</div>
        ${p.resumo ? `<p class="mt-8">${esc(p.resumo)}</p>` : ''}<div class="md mt-12" data-md="${p.id}"></div></div>`).join('') || vazio('radar', 'Sem dossiê ainda', 'Gere o primeiro: é o estudo que você leva pra reunião.')}</div>`;
    for (const p of data || []) { const alvo = $(`[data-md="${p.id}"]`, c); if (alvo && p.conteudo_md) preencherMarkdown(alvo, p.conteudo_md); }

    $('[data-gerar-dossie]', c).onclick = async (ev) => {
      const btn = ev.currentTarget; botaoCarregando(btn, true, 'Pedindo…');
      try {
        const job = await criarJob('enriquecer_empresa', {}, { empresa_id: e.id }, 4);
        await sb.from('pesquisas').insert({ tipo: 'dossie', titulo: `Dossiê — ${e.nome}`, empresa_id: e.id, status: 'fila', job_id: job.id, criado_por: quem() });
        toast('Dossiê na fila do Claude', 'info');
        desenharCorpo();
      } catch (err) { toast(erroAmigavel(err), 'erro'); botaoCarregando(btn, false); }
    };
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
