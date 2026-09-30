/* =============================================================================
   HOUNDER — ações compartilhadas: novo lead, editar empresa, agendar,
   mover estágio, pedir mensagem ao Claude, exportar compromisso
   ============================================================================= */
import { sb, estado, criarEmpresa, salvarEmpresa, registrarAtividade, acharDuplicada, criarJob, acompanharJob, farejadorOnline, estagio as achaEstagio, quem } from './sb.js';
import { $, $$, el, esc, modal, toast, confirmar, erroAmigavel, botaoCarregando, copiar, baixarArquivo, telefoneBonito } from './ui.js';
import { icone, sparkClaude } from './icones.js';
import { pontuar, normalizarTelefone, normalizarInstagram, normalizarSite, detectarRegulado } from './score.js';

export const ORIGENS = [
  ['prospeccao', 'Prospecção ativa'], ['indicacao', 'Indicação'], ['evento', 'Evento'], ['presencial', 'Presencial / na rua'],
  ['instagram', 'Instagram'], ['inbound', 'Chegou até nós'], ['spark', 'Planilha do Spark'], ['claude', 'Farejada do Claude'], ['network', 'Network'], ['manual', 'Outro'],
];
export const SITE_STATUS = [['desconhecido', 'Não verificado'], ['sem', 'Sem site'], ['fora_do_ar', 'Fora do ar'], ['ruim', 'Site fraco'], ['ok', 'Site ok']];
export const TIPOS_AGENDA = [['r1', 'Reunião de diagnóstico (R1)'], ['r2', 'Reunião de proposta (R2)'], ['followup', 'Follow-up'], ['ligacao', 'Ligação'], ['visita', 'Visita presencial'], ['entrega', 'Entrega / apresentação'], ['interno', 'Interno'], ['outro', 'Outro']];
export const RELACOES = [['lead', 'Lead'], ['cliente', 'Cliente'], ['interno', 'Conta interna'], ['ex_cliente', 'Ex-cliente'], ['nao_fit', 'Não-fit']];

const opcoes = (lista, atual) => lista.map(([v, r]) => `<option value="${v}"${v === atual ? ' selected' : ''}>${esc(r)}</option>`).join('');
const opcoesEstagio = (atual) => estado.estagios.map((e) => `<option value="${e.id}"${e.id === atual ? ' selected' : ''}>${esc(e.nome)}</option>`).join('');

function formEmpresa(e = {}) {
  return `<form class="form-empresa" novalidate>
    <div class="campo"><label>Nome do negócio *</label><input class="inp" name="nome" required value="${esc(e.nome || '')}" placeholder="Ex.: Clínica Sorriso da Pituba"></div>
    <div class="grade-2">
      <div class="campo"><label>Nicho / categoria</label><input class="inp" name="categoria" value="${esc(e.categoria || '')}" placeholder="Ex.: Odontologia"></div>
      <div class="campo"><label>Cidade</label><input class="inp" name="cidade" value="${esc(e.cidade ?? 'Salvador')}"></div>
      <div class="campo"><label>Bairro</label><input class="inp" name="bairro" value="${esc(e.bairro || '')}"></div>
      <div class="campo"><label>Quem decide</label><input class="inp" name="decisor" value="${esc(e.decisor || '')}" placeholder="Nome do dono ou sócio"></div>
      <div class="campo"><label>WhatsApp</label><input class="inp" name="whatsapp" inputmode="tel" value="${esc(e.whatsapp ? telefoneBonito(e.whatsapp) : '')}" placeholder="(71) 99999-0000"><span class="ajuda">Número completo, como está na fonte. Nunca presuma dígito.</span></div>
      <div class="campo"><label>Instagram</label><input class="inp" name="instagram" value="${esc(e.instagram ? '@' + e.instagram : '')}" placeholder="@perfil"></div>
      <div class="campo"><label>Seguidores no Instagram</label><input class="inp" name="instagram_seguidores" inputmode="numeric" value="${esc(e.instagram_seguidores ?? '')}"></div>
      <div class="campo"><label>Site</label><input class="inp" name="site" value="${esc(e.site || '')}" placeholder="www.exemplo.com.br"></div>
      <div class="campo"><label>Situação do site</label><select class="sel" name="site_status">${opcoes(SITE_STATUS, e.site_status || 'desconhecido')}</select></div>
      <div class="campo"><label>Google (nota · avaliações)</label><div class="row"><input class="inp" name="google_nota" inputmode="decimal" value="${esc(e.google_nota ?? '')}" placeholder="4,8"><input class="inp" name="google_avaliacoes" inputmode="numeric" value="${esc(e.google_avaliacoes ?? '')}" placeholder="52"></div></div>
      <div class="campo"><label>Origem</label><select class="sel" name="origem">${opcoes(ORIGENS, e.origem || 'prospeccao')}</select></div>
      <div class="campo"><label>Detalhe da origem</label><input class="inp" name="origem_detalhe" value="${esc(e.origem_detalhe || '')}" placeholder="Ex.: visto no Bon Odori"></div>
      <div class="campo"><label>Estágio</label><select class="sel" name="estagio">${opcoesEstagio(e.estagio || 'novo')}</select></div>
      <div class="campo"><label>Relação</label><select class="sel" name="relacao">${opcoes(RELACOES, e.relacao || 'lead')}</select></div>
    </div>
    <div class="campo"><label>Gancho verdadeiro</label><textarea class="txt" name="gancho" rows="2" style="min-height:62px" placeholder="O fato real que abre a conversa (nunca pretexto inventado)">${esc(e.gancho || '')}</textarea></div>
    <div class="campo"><label>Dor / oportunidade</label><textarea class="txt" name="dor" rows="2" style="min-height:62px">${esc(e.dor || '')}</textarea></div>
    <div class="campo"><label>Resumo / observações</label><textarea class="txt" name="resumo" rows="3">${esc(e.resumo || '')}</textarea></div>
  </form>`;
}

function lerForm(form) {
  const f = Object.fromEntries(new FormData(form).entries());
  const n = (v) => { const s = String(v || '').replace(/[^\d,.-]/g, '').replace(',', '.'); const x = parseFloat(s); return Number.isFinite(x) ? x : null; };
  const d = {
    nome: f.nome.trim(), categoria: f.categoria.trim() || null, cidade: f.cidade.trim() || null, bairro: f.bairro.trim() || null,
    decisor: f.decisor.trim() || null, whatsapp: normalizarTelefone(f.whatsapp), instagram: normalizarInstagram(f.instagram),
    instagram_seguidores: n(f.instagram_seguidores) != null ? Math.round(n(f.instagram_seguidores)) : null,
    site: normalizarSite(f.site), site_status: f.site_status, google_nota: n(f.google_nota), google_avaliacoes: n(f.google_avaliacoes) != null ? Math.round(n(f.google_avaliacoes)) : null,
    origem: f.origem, origem_detalhe: f.origem_detalhe.trim() || null, estagio: f.estagio, relacao: f.relacao,
    gancho: f.gancho.trim() || null, dor: f.dor.trim() || null, resumo: f.resumo.trim() || null,
  };
  if (d.google_nota != null && (d.google_nota < 0 || d.google_nota > 5)) d.google_nota = null;
  const conselho = detectarRegulado(`${d.categoria || ''} ${d.nome}`);
  const pont = pontuar(d, { pesos: estado.config.score, nichos: estado.config.nichos_conhecidos, praca: estado.config.praca?.regiao });
  return { ...d, score: pont.score, prioridade: pont.prioridade, score_motivos: pont.motivos, regulado: Boolean(conselho), conselho };
}

export function novoLead(prefill = {}) {
  const m = modal({
    titulo: 'Novo lead', subtitulo: 'Entra direto na esteira. O que você não souber fica em branco.', icone: 'usuariomais', largo: true,
    corpo: formEmpresa({ estagio: 'novo', relacao: 'lead', origem: 'prospeccao', ...prefill }),
    pe: `<button class="btn" data-fechar>Cancelar</button><button class="btn prim" data-salvar>${icone('check')}Criar lead</button>`,
  });
  $$('[data-fechar]', m.el).forEach((b) => (b.onclick = () => m.fechar()));
  const form = $('form', m.el);
  const salvar = async () => {
    const d = lerForm(form);
    if (!d.nome) { toast('Dê um nome ao negócio', 'erro'); $('[name=nome]', form).focus(); return; }
    const dup = acharDuplicada(d);
    if (dup && !(await confirmar('Parece que já existe', `"${dup.nome}" (${dup.cidade || 'sem cidade'}) tem o mesmo nome, WhatsApp ou Instagram. Criar mesmo assim?`, { rotulo: 'Criar mesmo assim' }))) return;
    const btn = $('[data-salvar]', m.el);
    botaoCarregando(btn, true, 'Criando…');
    try {
      const nova = await criarEmpresa(d);
      m.fechar();
      toast(`${nova.nome} entrou na esteira`, 'ok', { acao: { rotulo: 'Abrir', fn: async () => (await import('./ficha.js')).abrirFicha(nova.id) } });
    } catch (e) { toast(erroAmigavel(e), 'erro'); botaoCarregando(btn, false); }
  };
  $('[data-salvar]', m.el).onclick = salvar;
  form.onsubmit = (e) => { e.preventDefault(); salvar(); };
  return m;
}

export function editarEmpresa(emp) {
  const m = modal({
    titulo: 'Editar empresa', subtitulo: emp.nome, icone: 'editar', largo: true, corpo: formEmpresa(emp),
    pe: `<button class="btn" data-fechar>Cancelar</button><button class="btn prim" data-salvar>${icone('check')}Salvar</button>`,
  });
  $$('[data-fechar]', m.el).forEach((b) => (b.onclick = () => m.fechar()));
  $('[data-salvar]', m.el).onclick = async (ev) => {
    const d = lerForm($('form', m.el));
    if (!d.nome) { toast('O nome não pode ficar vazio', 'erro'); return; }
    botaoCarregando(ev.currentTarget, true, 'Salvando…');
    try { await salvarEmpresa(emp.id, d); m.fechar(); toast('Empresa atualizada'); }
    catch (e) { toast(erroAmigavel(e), 'erro'); botaoCarregando(ev.currentTarget, false); }
  };
}

export async function moverEstagio(emp, novo, { silencioso = false } = {}) {
  if (!emp || emp.estagio === novo) return emp;
  const anterior = emp.estagio;
  try {
    const atual = await salvarEmpresa(emp.id, { estagio: novo });
    if (!silencioso) {
      toast(`${emp.nome} → ${achaEstagio(novo).nome}`, 'ok', { acao: { rotulo: 'Desfazer', fn: () => salvarEmpresa(emp.id, { estagio: anterior }).catch((e) => toast(erroAmigavel(e), 'erro')) } });
    }
    return atual;
  } catch (e) { toast(erroAmigavel(e), 'erro'); throw e; }
}

/* ------------------------------ Agenda ------------------------------ */
function paraInputData(d) { const x = new Date(d); const p = (n) => String(n).padStart(2, '0'); return `${x.getFullYear()}-${p(x.getMonth() + 1)}-${p(x.getDate())}`; }
function paraInputHora(d) { const x = new Date(d); const p = (n) => String(n).padStart(2, '0'); return `${p(x.getHours())}:${p(x.getMinutes())}`; }

export function agendar(prefill = {}, existente = null) {
  const base = existente || prefill;
  const inicio = base.inicio ? new Date(base.inicio) : (() => { const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(10, 0, 0, 0); return d; })();
  const dur = existente?.fim ? Math.round((new Date(existente.fim) - new Date(existente.inicio)) / 60000) : (base.duracao || 30);
  const empAtual = base.empresa_id ? estado.empresas.find((e) => e.id === base.empresa_id) : null;
  const lista = estado.empresas.filter((e) => !e.arquivado).sort((a, b) => a.nome.localeCompare(b.nome));
  const m = modal({
    titulo: existente ? 'Compromisso' : 'Agendar compromisso', icone: 'agenda', largo: true,
    corpo: `<form novalidate>
      <div class="campo"><label>Título *</label><input class="inp" name="titulo" required value="${esc(base.titulo || (empAtual ? `Reunião com ${empAtual.nome}` : ''))}" placeholder="Ex.: Diagnóstico com a Clínica X"></div>
      <div class="grade-2">
        <div class="campo"><label>Tipo</label><select class="sel" name="tipo">${opcoes(TIPOS_AGENDA, base.tipo || 'r1')}</select></div>
        <div class="campo"><label>Empresa</label><select class="sel" name="empresa_id"><option value="">Sem empresa</option>${lista.map((e) => `<option value="${e.id}"${e.id === base.empresa_id ? ' selected' : ''}>${esc(e.nome)}</option>`).join('')}</select></div>
        <div class="campo"><label>Data *</label><input class="inp" type="date" name="data" required value="${paraInputData(inicio)}"></div>
        <div class="campo"><label>Hora *</label><input class="inp" type="time" name="hora" required value="${paraInputHora(inicio)}"></div>
        <div class="campo"><label>Duração</label><select class="sel" name="duracao">${[15, 20, 30, 45, 60, 90, 120].map((x) => `<option value="${x}"${x === dur ? ' selected' : ''}>${x} min</option>`).join('')}</select></div>
        <div class="campo"><label>Lembrete</label><select class="sel" name="lembrete_min">${[[0, 'Sem lembrete'], [10, '10 min antes'], [30, '30 min antes'], [60, '1 h antes'], [180, '3 h antes'], [1440, '1 dia antes']].map(([v, r]) => `<option value="${v}"${v === (base.lembrete_min ?? 30) ? ' selected' : ''}>${r}</option>`).join('')}</select></div>
      </div>
      <div class="campo"><label>Local ou link</label><input class="inp" name="local" value="${esc(base.local || '')}" placeholder="Endereço, Google Meet, WhatsApp vídeo…"></div>
      <div class="campo"><label>Pauta / anotações</label><textarea class="txt" name="descricao" rows="3" placeholder="O que levar, o que descobrir, quem precisa estar">${esc(base.descricao || '')}</textarea></div>
      ${!existente ? `<label class="check" id="chk-mover"><input type="checkbox" name="mover" checked> Mover a empresa para <b>&nbsp;Reunião marcada&nbsp;</b> quando for R1</label>` : ''}
      ${existente ? `<div class="divisor"></div><div class="rotulo mb-8">Status</div><div class="chips" data-status>${[['agendado', 'Agendado'], ['feito', 'Feito'], ['nao_compareceu', 'Não compareceu'], ['remarcado', 'Remarcado'], ['cancelado', 'Cancelado']].map(([v, r]) => `<button type="button" class="chip ${existente.status === v ? 'on' : ''}" data-v="${v}">${r}</button>`).join('')}</div>` : ''}
    </form>`,
    pe: `${existente ? `<button class="btn perigo" data-excluir>${icone('lixo')}Excluir</button><button class="btn" data-google>${icone('agenda')}Google Agenda</button><button class="btn" data-ics>${icone('download')}.ics</button><span class="grow"></span>` : ''}<button class="btn" data-fechar>Cancelar</button><button class="btn prim" data-salvar>${icone('check')}${existente ? 'Salvar' : 'Agendar'}</button>`,
  });
  $$('[data-fechar]', m.el).forEach((b) => (b.onclick = () => m.fechar()));
  const form = $('form', m.el);
  let statusSel = existente?.status || 'agendado';
  $$('[data-status] .chip', m.el).forEach((c) => (c.onclick = () => { statusSel = c.dataset.v; $$('[data-status] .chip', m.el).forEach((x) => x.classList.toggle('on', x === c)); }));

  const montar = () => {
    const f = Object.fromEntries(new FormData(form).entries());
    const [a, mes, d] = f.data.split('-').map(Number); const [h, mi] = f.hora.split(':').map(Number);
    const ini = new Date(a, mes - 1, d, h, mi);
    return {
      titulo: f.titulo.trim(), tipo: f.tipo, empresa_id: f.empresa_id || null, inicio: ini.toISOString(),
      fim: new Date(ini.getTime() + Number(f.duracao) * 60000).toISOString(), local: f.local.trim() || null,
      descricao: f.descricao.trim() || null, lembrete_min: Number(f.lembrete_min), mover: f.mover === 'on',
    };
  };
  $('[data-salvar]', m.el).onclick = async (ev) => {
    if (!form.titulo.value.trim() || !form.data.value || !form.hora.value) { toast('Preencha título, data e hora', 'erro'); return; }
    const d = montar();
    const btn = ev.currentTarget; botaoCarregando(btn, true, 'Salvando…');
    try {
      const { mover, ...linha } = d;
      if (existente) {
        const mudouHora = existente.inicio !== linha.inicio;
        const { error } = await sb.from('agenda').update({ ...linha, status: statusSel, lembrete_enviado: mudouHora ? false : existente.lembrete_enviado }).eq('id', existente.id);
        if (error) throw error;
        if (linha.empresa_id && statusSel !== existente.status && ['feito', 'nao_compareceu', 'cancelado'].includes(statusSel)) {
          await registrarAtividade(linha.empresa_id, statusSel === 'feito' ? 'reuniao' : 'nota', `${linha.titulo}: ${statusSel === 'feito' ? 'feito' : statusSel === 'nao_compareceu' ? 'não compareceu' : 'cancelado'}`);
        }
        m.fechar(); toast('Compromisso atualizado');
        if (statusSel === 'feito' && linha.tipo === 'r1' && linha.empresa_id) {
          const emp = estado.empresas.find((e) => e.id === linha.empresa_id);
          if (emp && ['reuniao', 'conversando', 'abordado', 'qualificado', 'novo'].includes(emp.estagio)
            && await confirmar('Reunião feita', `Mover ${emp.nome} para Proposta?`, { rotulo: 'Mover para Proposta' })) await moverEstagio(emp, 'proposta');
        }
      } else {
        const { data, error } = await sb.from('agenda').insert({ ...linha, criado_por: quem(), responsavel: quem() }).select().single();
        if (error) throw error;
        if (linha.empresa_id) {
          await registrarAtividade(linha.empresa_id, 'nota', `Agendado: ${linha.titulo}`, new Date(linha.inicio).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }), { agenda_id: data.id });
          const emp = estado.empresas.find((e) => e.id === linha.empresa_id);
          const ordem = (id) => achaEstagio(id).ordem ?? 0;
          if (mover && linha.tipo === 'r1' && emp && ordem(emp.estagio) < ordem('reuniao') && !['ganho', 'perdido'].includes(emp.estagio)) await moverEstagio(emp, 'reuniao', { silencioso: true });
          if (emp) await salvarEmpresa(emp.id, { proxima_acao: linha.titulo, proxima_acao_em: linha.inicio });
        }
        m.fechar(); toast('Compromisso agendado', 'ok', { acao: { rotulo: 'Google Agenda', fn: () => window.open(linkGoogleAgenda(data), '_blank') } });
      }
    } catch (e) { toast(erroAmigavel(e), 'erro'); botaoCarregando(btn, false); }
  };
  if (existente) {
    $('[data-excluir]', m.el).onclick = async () => {
      if (!(await confirmar('Excluir compromisso?', existente.titulo, { rotulo: 'Excluir', perigo: true }))) return;
      const { error } = await sb.from('agenda').delete().eq('id', existente.id);
      if (error) toast(erroAmigavel(error), 'erro'); else { m.fechar(); toast('Compromisso excluído'); }
    };
    $('[data-google]', m.el).onclick = () => window.open(linkGoogleAgenda(existente), '_blank');
    $('[data-ics]', m.el).onclick = () => baixarArquivo(`${existente.titulo.replace(/[^\w-]+/g, '_')}.ics`, gerarICS(existente), 'text/calendar;charset=utf-8');
  }
  return m;
}

const fmtG = (d) => new Date(d).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
export function linkGoogleAgenda(it) {
  const fim = it.fim || new Date(new Date(it.inicio).getTime() + 30 * 60000).toISOString();
  const p = new URLSearchParams({ action: 'TEMPLATE', text: it.titulo, dates: `${fmtG(it.inicio)}/${fmtG(fim)}`, details: it.descricao || '', location: it.local || '' });
  return `https://calendar.google.com/calendar/render?${p}`;
}
export function gerarICS(it) {
  const fim = it.fim || new Date(new Date(it.inicio).getTime() + 30 * 60000).toISOString();
  const l = (s) => String(s || '').replace(/[,;\\]/g, (c) => '\\' + c).replace(/\n/g, '\\n');
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Hórus//Hounder//PT', 'BEGIN:VEVENT', `UID:${it.id}@hounddog`, `DTSTAMP:${fmtG(new Date())}`,
    `DTSTART:${fmtG(it.inicio)}`, `DTEND:${fmtG(fim)}`, `SUMMARY:${l(it.titulo)}`, `DESCRIPTION:${l(it.descricao)}`, `LOCATION:${l(it.local)}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
}

/* ------------------------------ Claude: mensagem personalizada ------------------------------ */
export async function pedirMensagemClaude(emp, pedido = '') {
  let parar;
  const m = modal({
    titulo: 'Mensagem personalizada', subtitulo: `O Claude estuda ${emp.nome} e escreve a próxima mensagem`, icone: 'comentario', largo: true,
    corpo: `<div class="campo"><label>Contexto extra (opcional)</label><textarea class="txt" data-pedido rows="2" style="min-height:64px" placeholder="Ex.: ele respondeu que já tem sobrinho fazendo o site">${esc(pedido)}</textarea></div>
      <div data-res></div>`,
    pe: `<button class="btn" data-fechar>Fechar</button><button class="btn claude" data-gerar>${sparkClaude(16)}Gerar com o Claude</button>`,
    aoFechar: () => { if (parar) parar(); },
  });
  $$('[data-fechar]', m.el).forEach((b) => (b.onclick = () => m.fechar()));
  const res = $('[data-res]', m.el);
  $('[data-gerar]', m.el).onclick = async (ev) => {
    const btn = ev.currentTarget;
    botaoCarregando(btn, true, 'Na fila…');
    try {
      const job = await criarJob('mensagem_personalizada', { pedido: $('[data-pedido]', m.el).value.trim() }, { empresa_id: emp.id }, 3);
      res.innerHTML = `<div class="aviso claude">${sparkClaude(18)}<div><b>${farejadorOnline() ? 'O Claude está escrevendo…' : 'Na fila: o Farejador está offline'}</b><br><span data-prog>${farejadorOnline() ? 'Lendo a ficha, a conversa e o playbook.' : 'Assim que o Farejador ligar no seu PC, a mensagem sai.'}</span></div></div>`;
      parar = acompanharJob(job.id, (j) => {
        const prog = $('[data-prog]', res); if (prog && j.progresso) prog.textContent = j.progresso;
        if (j.status === 'concluido') {
          botaoCarregando(btn, false); parar();
          const variantes = j.saida?.variantes || [];
          res.innerHTML = variantes.length ? variantes.map((v, i) => `<div class="card sugestao mt-12"><div class="row"><span class="selo claude">${esc(v.rotulo || `Opção ${i + 1}`)}</span><span class="grow"></span><button class="btn xs" data-copiar="${i}">${icone('copiar')}Copiar</button>${emp.whatsapp ? `<a class="btn xs verde" target="_blank" rel="noopener" href="https://wa.me/${emp.whatsapp}?text=${encodeURIComponent(v.texto)}">${icone('whatsapp')}Abrir</a>` : ''}</div><p class="mt-8" style="white-space:pre-wrap">${esc(v.texto)}</p></div>`).join('')
            + (j.saida?.porque ? `<p class="dim mt-12" style="font-size:13px">${esc(j.saida.porque)}</p>` : '')
            : `<div class="aviso">${icone('info')}<div>${esc(j.saida?.texto || 'O Claude não devolveu variantes.')}</div></div>`;
          $$('[data-copiar]', res).forEach((b) => (b.onclick = () => copiar(variantes[+b.dataset.copiar].texto, 'Mensagem copiada')));
        } else if (j.status === 'erro') {
          botaoCarregando(btn, false); parar();
          res.innerHTML = `<div class="aviso vermelho">${icone('alerta')}<div><b>Não deu certo</b><br>${esc(j.erro || 'Erro no Farejador')}</div></div>`;
        }
      });
    } catch (e) { botaoCarregando(btn, false); toast(erroAmigavel(e), 'erro'); }
  };
}
