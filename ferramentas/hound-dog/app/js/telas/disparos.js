/* =============================================================================
   HOUNDER — Disparos: prospecção que o Claude prepara e verifica, o Marcelo
   aprova (texto exato) e o Farejador envia pelo WhatsApp. Regra de 24/09/2026:
   no máximo 10 por dia, 4 a 7 minutos aleatórios entre um e outro, e o lote
   para no primeiro erro.
   ============================================================================= */
import { sb, estado, ouvir, farejadorOnline, quem } from '../sb.js';
import { $, $$, esc, toast, confirmar, erroAmigavel, botaoCarregando, telefoneBonito, relativo, dataHora, vazio, esqueleto, debounce, iniciais, menu, modal } from '../ui.js';
import { icone } from '../icones.js';
import { revisar, pareceAutoResposta } from '../revisor.js';

const LIMITE_DIA = 10;
// Janela em que o Farejador envia (farejador/disparos.mjs): seg a sex 8h30 às 18h, sábado 9h às 12h, horário da Bahia
const JANELA = { 1: [8.5, 18], 2: [8.5, 18], 3: [8.5, 18], 4: [8.5, 18], 5: [8.5, 18], 6: [9, 12] };
function naJanela(t) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Bahia', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date(t)).map((x) => [x.type, x.value]));
  const dia = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[p.weekday];
  const h = Number(p.hour) + Number(p.minute) / 60;
  return !!JANELA[dia] && h >= JANELA[dia][0] && h < JANELA[dia][1];
}
/* Primeiro momento dentro da janela a partir de t (de 15 em 15 minutos, no máximo 8 dias) */
function proximaAbertura(t) {
  const x = new Date(Math.ceil(new Date(t).getTime() / 900000) * 900000);
  for (let i = 0; i < 8 * 96; i++, x.setTime(x.getTime() + 900000)) if (naJanela(x)) return x;
  return null;
}
const FORMATO = { casa: ['laranja', 'A · casa'], curiosidade: ['violeta', 'B · curiosidade'] };
const STATUS = { rascunho: ['cinza', 'Para aprovar'], aprovado: ['azul', 'Aprovado'], agendado: ['amarelo', 'Na fila'], enviando: ['amarelo', 'Enviando'], enviado: ['verde', 'Enviado'], erro: ['vermelho', 'Erro'], cancelado: ['cinza', 'Descartado'] };

export default async function disparos(v) {
  v.innerHTML = `
    <div class="cab"><div class="tt"><h1>Disparos de prospecção</h1><p>Tudo o que sai pelo seu WhatsApp, por dia. O Farejador envia no máximo ${LIMITE_DIA} por dia, com 4 a 7 minutos entre uma e outra. Dá pra aprovar daqui qualquer mensagem, inclusive de lead com agente; a Mesa continua sendo o lugar da conversa e do raciocínio dele.</p></div>
      <div class="acoes"><a class="btn" href="#/agentes">${icone('robo')}Mesa de agentes</a></div></div>
    <div data-aviso></div>
    <div data-corpo>${esqueleto(8, 26)}</div>`;

  let lista = [];
  let comAgente = new Map(); // empresa_id -> nome do especialista (lead com agente ativo: decide-se na Mesa)
  let entradas = new Map(); // empresa_id -> momento da última mensagem que o lead mandou
  let conversaDe = new Map(); // empresa_id -> id da conversa do WhatsApp (atalho "Abrir a conversa")
  const abertos = new Set(); // ids com a mensagem aberta pra editar
  const editando = new Map(); // id -> texto que o Marcelo está digitando e ainda não salvou
  const hojeBahia = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bahia' });
  const diaBahia = (d) => new Date(d).toLocaleDateString('en-CA', { timeZone: 'America/Bahia' });

  async function carregar() {
    if (!v.isConnected) return;
    const { data, error } = await sb.from('disparos').select('*').order('criado_em', { ascending: true }).limit(500);
    if (error) { $('[data-corpo]', v).innerHTML = vazio('alerta', 'Não carregou', erroAmigavel(error)); return; }
    lista = data || [];
    const [{ data: ags }, { data: esps }] = await Promise.all([sb.from('agentes').select('empresa_id,especialista_id').eq('status', 'ativo'), sb.from('especialistas').select('id,nome')]);
    comAgente = new Map((ags || []).map((a) => [a.empresa_id, (esps || []).find((e) => e.id === a.especialista_id)?.nome || 'o agente']));
    // Lead com mensagem viva: saber se ele já respondeu no WhatsApp e ter o atalho pra conversa
    const ids = [...new Set(lista.filter((d) => ['rascunho', 'aprovado', 'agendado'].includes(d.status)).map((d) => d.empresa_id))];
    entradas = new Map();
    conversaDe = new Map();
    if (ids.length) {
      const { data: convs } = await sb.from('whatsapp_conversas').select('id,empresa_id').in('empresa_id', ids);
      for (const c of convs || []) conversaDe.set(c.empresa_id, c.id);
      if (convs?.length) {
        const { data: msgs } = await sb.from('whatsapp_mensagens').select('conversa_id,momento,texto').in('conversa_id', convs.map((c) => c.id)).eq('direcao', 'in').order('momento', { ascending: false }).limit(500);
        // Resposta automática do WhatsApp Business não conta como resposta (29/09)
        for (const m of (msgs || []).filter((x) => !pareceAutoResposta(x.texto))) { const emp = convs.find((c) => c.id === m.conversa_id)?.empresa_id; if (emp && !entradas.has(emp)) entradas.set(emp, m.momento); }
      }
    }
    desenhar();
  }

  /* Quantas variantes vivas o passo tem: com mais de uma, o cartão mostra a letra e o ângulo */
  function irmas(d) { return lista.filter((x) => x.id !== d.id && x.empresa_id === d.empresa_id && (x.passo || 1) === (d.passo || 1) && ['rascunho', 'aprovado'].includes(x.status)); }

  /* Regra dos dois passos: o passo 2 só sai depois que o passo 1 foi enviado E o lead respondeu */
  function esperandoResposta(d) {
    if (!d.passo || d.passo < 2) return null;
    const ant = lista.find((x) => x.empresa_id === d.empresa_id && x.passo === d.passo - 1 && x.status === 'enviado');
    if (!ant) return `Sai só depois que o passo ${d.passo - 1} for enviado e o lead responder.`;
    const entrou = entradas.get(d.empresa_id);
    if (ant.respondeu || (entrou && new Date(entrou) > new Date(ant.enviado_em))) return null;
    return `Espera a resposta ao passo ${d.passo - 1}. Quando o lead responder (ou você marcar "Respondeu"), ele fica liberado.`;
  }

  function nomeEmp(id) { return estado.empresas.find((e) => e.id === id)?.nome || 'Empresa'; }

  /* Revisor mecânico (app/js/revisor.js): o que o código cobra sozinho, ao vivo enquanto o Marcelo edita.
     O lote são as mensagens do mesmo passo de OUTROS leads nos últimos 14 dias, pra pegar esqueleto repetido. */
  function loteDe(d) {
    const desde = Date.now() - 14 * 864e5;
    return lista.filter((x) => x.empresa_id !== d.empresa_id && (x.passo || 1) === (d.passo || 1)
      && ['rascunho', 'aprovado', 'agendado', 'enviado'].includes(x.status) && new Date(x.criado_em).getTime() > desde).map((x) => x.texto);
  }
  function blocoRevisao(d, texto = d.texto) {
    const r = revisar(texto, { passo: d.passo || 1, tipo: d.tipo, empresa: nomeEmp(d.empresa_id), lote: loteDe(d) });
    if (!r.itens.length) return `<div class="dim mt-8" style="font-size:12.5px">${icone('check')} Revisor: nada a apontar · ${r.palavras} palavras</div>`;
    return `<div class="aviso ${r.vetos ? 'vermelho' : 'laranja'} mt-8">${icone('alerta')}<div><b>Revisor: ${r.vetos ? `${r.vetos} veto${r.vetos > 1 ? 's' : ''}` : ''}${r.vetos && r.avisos ? ' e ' : ''}${r.avisos ? `${r.avisos} aviso${r.avisos > 1 ? 's' : ''}` : ''} · ${r.palavras} palavras</b>
      <ul style="margin:6px 0 0;padding-left:18px">${r.itens.map((i) => `<li>${i.nivel === 'veto' ? '<b>Veto.</b> ' : ''}${esc(i.dica)}${i.trecho ? ` <span class="dim">«${esc(i.trecho)}»</span>` : ''}</li>`).join('')}</ul></div></div>`;
  }

  /* Mensagem do agente (29/09): o porquê em uma linha e o parecer do crítico, pra ninguém aprovar só porque "parece bom" */
  function blocoAgente(d) {
    const cr = (Array.isArray(d.revisao) ? d.revisao : []).find((x) => x.regra === 'critico');
    if (!d.raciocinio && !cr) return '';
    return `<div class="aviso ${cr && cr.nivel !== 'ok' ? 'laranja' : ''} mt-8">${icone('robo')}<div>${d.raciocinio ? `<b>Por quê:</b> ${esc(d.raciocinio)}` : ''}${cr ? `${d.raciocinio ? '<br>' : ''}<span class="dim">${esc(cr.dica)}</span>` : ''}</div></div>`;
  }

  /* Lead com agente: o cartão só mostra e leva pra Mesa (lá ficam aprovar, agendar e responder) */
  function cartaoNaMesa(empresaId, opcoes) {
    const quem = comAgente.get(empresaId);
    return `<article class="card mt-12 disparo na-mesa" data-emp-card="${empresaId}">
      <div class="card-cab"><div class="grow"><h3><a href="#" data-emp="${empresaId}">${esc(nomeEmp(empresaId))}</a></h3>
        <div class="dim" style="font-size:12.5px">${icone('robo')} Acompanhado por ${esc(quem)} · ${opcoes.length > 1 ? `${opcoes.length} opções` : '1 mensagem'} esperando você</div></div>
        <a class="btn sm prim" href="#/agentes?lead=${empresaId}&revisar=1">${icone('setad')}Decidir na Mesa</a></div>
      ${opcoes.map((d) => `<div class="msg-sugerida mt-8"><b>${esc(d.variante ? `Opção ${d.variante}` : 'Mensagem')}${d.angulo ? ` · ${esc(d.angulo)}` : ''}:</b> ${esc(d.texto)}</div>`).join('')}
    </article>`;
  }

  function cartao(d, { edita = false } = {}) {
    if (comAgente.has(d.empresa_id) && ['rascunho', 'aprovado'].includes(d.status)) return cartaoNaMesa(d.empresa_id, [d]);
    const [cf, rf] = FORMATO[d.formato] || FORMATO.casa;
    const [cs, rs] = STATUS[d.status];
    const ver = Array.isArray(d.verificacao) ? d.verificacao : [];
    const espera = ['rascunho', 'aprovado'].includes(d.status) ? esperandoResposta(d) : null;
    const variantes = d.status === 'rascunho' && irmas(d).length > 0;
    return `<article class="card mt-12 disparo" data-id="${d.id}">
      <div class="card-cab"><div class="grow"><h3><a href="#" data-emp="${d.empresa_id}">${esc(nomeEmp(d.empresa_id))}</a></h3>
        ${d.angulo || variantes ? `<div style="font-size:13px;font-weight:600">Abordagem ${esc(d.variante || 'A')}${d.angulo ? ` · ${esc(d.angulo)}` : ''}</div>` : ''}
        <div class="dim" style="font-size:12.5px">${icone('whatsapp')} ${esc(telefoneBonito(d.telefone))} · passo ${d.passo}${d.enviado_em ? ` · enviado ${dataHora(d.enviado_em)}` : d.agendado_para ? ` · sai às ${new Date(d.agendado_para).toLocaleTimeString('pt-BR', { timeZone: 'America/Bahia', hour: '2-digit', minute: '2-digit' })}` : ''}</div></div>
        <span class="selo ${cf}">${rf}</span>${espera ? `<span class="selo cinza">${icone('relogio')}Espera resposta</span>` : ''}<span class="selo ${cs}">${rs}</span></div>
      ${espera ? `<div class="aviso mt-8">${icone('info')}<div>${esc(espera)}</div></div>` : ''}
      ${variantes ? `<div class="aviso mt-8">${icone('info')}<div>Este passo tem ${irmas(d).length + 1} abordagens. Aprovar esta descarta as outras: só uma sai.</div></div>` : ''}
      ${edita ? `<textarea class="txt" data-texto rows="5">${esc(d.texto)}</textarea>` : `<div class="msg-sugerida">${esc(d.texto)}</div>`}
      ${blocoAgente(d)}
      ${['rascunho', 'aprovado', 'erro'].includes(d.status) ? `<div data-revisao>${blocoRevisao(d)}</div>` : ''}
      ${ver.length ? `<details class="mt-12 dobra"><summary><span class="rotulo">Verificação · ${ver.length} fato${ver.length > 1 ? 's' : ''} conferido${ver.length > 1 ? 's' : ''}</span></summary>
        <div class="tabela-wrap mt-8"><table class="tabela"><thead><tr><th>Frase</th><th>Fonte</th><th>Como conferi</th></tr></thead><tbody>${ver.map((x) => `<tr><td>${esc(x.frase || '')}</td><td>${esc(x.fonte || '')}</td><td>${esc(x.como_conferiu || x.como || '')}</td></tr>`).join('')}</tbody></table></div></details>` : (d.status === 'rascunho' ? `<div class="aviso vermelho mt-12">${icone('alerta')}<div>Sem tabela de verificação. Não aprove sem conferir as frases.</div></div>` : '')}
      ${d.erro ? `<div class="aviso vermelho mt-12">${icone('alerta')}<div>${esc(d.erro)}</div></div>` : ''}
      <div class="row wrap mt-12">
        ${d.status === 'rascunho' ? `<button class="btn sm verde" data-a="aprovar">${icone('check')}Aprovar este texto</button><button class="btn sm fantasma" data-a="descartar">${icone('x')}Descartar</button>` : ''}
        ${d.status === 'aprovado' ? `<button class="btn sm fantasma" data-a="voltar">${icone('editar')}Editar de novo</button>` : ''}
        ${d.status === 'enviado' ? `<label class="check"><input type="checkbox" data-a="respondeu" ${d.respondeu ? 'checked' : ''}> Respondeu</label>${!d.respondeu && d.followup_em && new Date(d.followup_em) < new Date() ? `<span class="selo vermelho">${icone('relogio')}follow-up venceu</span>` : d.followup_em && !d.respondeu ? `<span class="dim" style="font-size:12.5px">follow-up ${relativo(d.followup_em)}</span>` : ''}` : ''}
        ${d.status === 'erro' ? `<button class="btn sm" data-a="voltar">${icone('editar')}Revisar</button>` : ''}
      </div></article>`;
  }

  /* Um cartão por cliente com as opções A, B, C da mensagem inicial: escolher uma sobe pra "Prontos pra sair" (Marcelo, 29/09) */
  function cartaoEscolha(empresaId, opcoes) {
    if (comAgente.has(empresaId)) return cartaoNaMesa(empresaId, opcoes);
    const tel = opcoes[0]?.telefone;
    return `<article class="card mt-12 disparo" data-emp-card="${empresaId}">
      <div class="card-cab"><div class="grow"><h3><a href="#" data-emp="${empresaId}">${esc(nomeEmp(empresaId))}</a></h3>
        <div class="dim" style="font-size:12.5px">${icone('whatsapp')} ${esc(telefoneBonito(tel))} · ${opcoes.length > 1 ? `${opcoes.length} opções, escolha uma` : '1 opção'}</div></div>
        <button class="btn xs fantasma" data-a="descartar-lead">${icone('x')}Tirar este lead</button></div>
      ${opcoes.map((d) => {
        const ver = Array.isArray(d.verificacao) ? d.verificacao : [];
        return `<div class="briefing-msg mt-12" data-id="${d.id}">
          <b style="font-size:14px">Opção ${esc(d.variante || 'A')}${d.angulo ? ` · ${esc(d.angulo)}` : ''}</b>
          <textarea class="txt mt-8" data-texto rows="3">${esc(d.texto)}</textarea>
          ${blocoAgente(d)}
          <div data-revisao>${blocoRevisao(d)}</div>
          ${ver.length ? `<details class="mt-8 dobra"><summary><span class="rotulo">Verificação · ${ver.length} fato${ver.length > 1 ? 's' : ''} conferido${ver.length > 1 ? 's' : ''}</span></summary>
            <div class="tabela-wrap mt-8"><table class="tabela"><thead><tr><th>Frase</th><th>Fonte</th><th>Como conferi</th></tr></thead><tbody>${ver.map((x) => `<tr><td>${esc(x.frase || '')}</td><td>${esc(x.fonte || '')}</td><td>${esc(x.como_conferiu || x.como || '')}</td></tr>`).join('')}</tbody></table></div></details>`
            : `<div class="aviso vermelho mt-8">${icone('alerta')}<div>Sem tabela de verificação. Confira as frases antes de escolher.</div></div>`}
          <div class="row mt-8"><button class="btn sm verde" data-a="aprovar">${icone('check')}Escolher a opção ${esc(d.variante || 'A')}</button></div>
        </div>`;
      }).join('')}
    </article>`;
  }

  /* Hora em que uma mensagem com data sugerida sai se for aprovada agora: a sugerida, ou daqui a 2 minutos se ela
     já passou, empurrada pra dentro do horário comercial */
  function horaDe(d) {
    const alvo = Math.max(d.sugerido_para ? new Date(d.sugerido_para).getTime() : 0, Date.now() + 2 * 60000);
    return naJanela(alvo) ? new Date(alvo) : proximaAbertura(alvo);
  }

  /* Quantos já estão ocupados num dia (enviados + agendados), pro limite diário valer também no agendamento */
  function ocupadosNoDia(dia) {
    return lista.filter((d) => (d.status === 'enviado' && d.enviado_em && diaBahia(d.enviado_em) === dia)
      || (['agendado', 'enviando'].includes(d.status) && d.agendado_para && diaBahia(d.agendado_para) === dia)).length;
  }
  /* "às 09:12" se for hoje, "29/09 às 09:12" se for outro dia */
  function quando(d) {
    const h = new Date(d).toLocaleTimeString('pt-BR', { timeZone: 'America/Bahia', hour: '2-digit', minute: '2-digit' });
    return diaBahia(d) === hojeBahia() ? `às ${h}` : `${new Date(d).toLocaleDateString('pt-BR', { timeZone: 'America/Bahia', day: '2-digit', month: '2-digit' })} às ${h}`;
  }
  const soHora = (d) => new Date(d).toLocaleTimeString('pt-BR', { timeZone: 'America/Bahia', hour: '2-digit', minute: '2-digit' });
  /* Cabeçalho do dia: "Hoje", "Amanhã" ou "Terça, 13/10" */
  function nomeDoDia(dia) {
    const amanha = new Date(Date.now() + 864e5).toLocaleDateString('en-CA', { timeZone: 'America/Bahia' });
    const t = new Date(`${dia}T12:00:00-03:00`);
    const dm = t.toLocaleDateString('pt-BR', { timeZone: 'America/Bahia', day: '2-digit', month: '2-digit' });
    if (dia === hojeBahia()) return `Hoje, ${dm}`;
    if (dia === amanha) return `Amanhã, ${dm}`;
    const sem = t.toLocaleDateString('pt-BR', { timeZone: 'America/Bahia', weekday: 'long' }).replace('-feira', '');
    return `${sem[0].toUpperCase()}${sem.slice(1)}, ${dm}`;
  }
  /* Sugestão de horário: amanhã 8h30 se já passou das 18h, senão daqui a 1 hora (no formato do datetime-local) */
  function horarioSugerido() {
    const t = new Date();
    if (t.getHours() >= 18) { t.setDate(t.getDate() + 1); t.setHours(8, 30, 0, 0); } else { t.setHours(t.getHours() + 1, 0, 0, 0); }
    const p = (n) => String(n).padStart(2, '0');
    return `${t.getFullYear()}-${p(t.getMonth() + 1)}-${p(t.getDate())}T${p(t.getHours())}:${p(t.getMinutes())}`;
  }

  const TIPO = { abertura: ['azul', 'Abertura'], corpo: ['laranja', 'Corpo'], resposta: ['verde', 'Retomada'], followup: ['violeta', 'Follow-up'] };
  const tipoDe = (d) => d.tipo || ((d.passo || 1) > 1 ? 'corpo' : 'abertura');
  const seloTipo = (d) => { const [c, r] = TIPO[tipoDe(d)]; return `<span class="selo ${c}">${r}</span>`; };
  /* Mensagem com dia marcado: agendada (agendado_para) ou esperando aprovação com data sugerida (sugerido_para) */
  const momentoDe = (d) => (['agendado', 'enviando'].includes(d.status) ? d.agendado_para : d.sugerido_para);
  const emp = (id) => estado.empresas.find((e) => e.id === id) || {};
  /* Avatar com as iniciais, numa cor fixa por lead */
  function avatar(id) {
    const nome = nomeEmp(id);
    let h = 0; for (const c of id) h = (h * 31 + c.charCodeAt(0)) % 360;
    return `<span class="avatar" style="background:hsl(${h} 70% 62%);color:#14110d">${esc(iniciais(nome))}</span>`;
  }
  /* "Ter, 13/10 · 10:00", vermelho se já passou, amarelo se é hoje */
  function chipData(d) {
    const t = momentoDe(d);
    if (!t) return '';
    const dia = diaBahia(t);
    const sem = new Date(t).toLocaleDateString('pt-BR', { timeZone: 'America/Bahia', weekday: 'short' }).replace('.', '');
    const dm = new Date(t).toLocaleDateString('pt-BR', { timeZone: 'America/Bahia', day: '2-digit', month: '2-digit' });
    const cor = ['rascunho', 'aprovado'].includes(d.status) && new Date(t) < new Date() ? 'atrasada' : dia === hojeBahia() ? 'hoje' : '';
    const muda = ['rascunho', 'aprovado', 'agendado'].includes(d.status);
    const rot = `${sem[0].toUpperCase()}${sem.slice(1)}, ${dm} · ${soHora(t)}`;
    return muda ? `<button class="dsp-data ${cor}" data-a="horario" title="Mudar o dia e a hora">${rot}${icone('editar')}</button>` : `<span class="dsp-data ${cor}">${rot}</span>`;
  }

  /* Mudar o dia e a hora: rascunho guarda como sugestão (o Aprovar usa ela), agendada muda o horário de saída */
  async function mudarHorario(d) {
    const t = await escolherHorario({ titulo: momentoDe(d) ? 'Mudar o dia e a hora' : 'Escolher o dia e a hora', subtitulo: nomeEmp(d.empresa_id), atual: momentoDe(d) });
    if (!t) return;
    const campos = d.status === 'agendado' ? { agendado_para: t.toISOString(), lote_id: crypto.randomUUID() } : { sugerido_para: t.toISOString() };
    const { error } = await sb.from('disparos').update(campos).eq('id', d.id).eq('status', d.status);
    if (error) toast(erroAmigavel(error), 'erro'); else toast(`${d.status === 'agendado' ? 'Agendada' : 'Marcada'} pra ${quando(t)}`, 'info');
    return carregar();
  }

  /* Escolher dia e hora (o mesmo da Mesa de agentes): avisa fora da janela, no passado ou com o dia cheio */
  function escolherHorario({ titulo, subtitulo, atual }) {
    return new Promise((resolve) => {
      let res = null;
      const base = atual && new Date(atual) > new Date() ? new Date(atual) : (naJanela(Date.now() + 30 * 60000) ? new Date(Date.now() + 30 * 60000) : proximaAbertura(Date.now()));
      const dia = diaBahia(base), hora = base.toLocaleTimeString('pt-BR', { timeZone: 'America/Bahia', hour: '2-digit', minute: '2-digit' });
      const md = modal({ titulo, subtitulo, icone: 'agenda', corpo: `
        <div class="row wrap gap-12"><label class="rotulo-campo">Dia<input class="inp" type="date" data-dia value="${dia}" min="${hojeBahia()}"></label>
          <label class="rotulo-campo">Hora<input class="inp" type="time" data-hora value="${hora}" step="300"></label></div>
        <p class="dim mt-12" style="font-size:12.5px" data-info></p>`,
      pe: `<button class="btn" data-fechar>Cancelar</button><button class="btn prim" data-ok>${icone('agenda')}Salvar o horário</button>`, aoFechar: () => resolve(res) });
      const info = () => {
        const d = $('[data-dia]', md.el).value, h = $('[data-hora]', md.el).value;
        const t = d && h ? new Date(`${d}T${h}:00-03:00`) : null;
        const p = $('[data-info]', md.el);
        if (!t) { p.textContent = ''; return null; }
        const livres = LIMITE_DIA - ocupadosNoDia(d);
        const erro = t < new Date() ? 'Esse horário já passou.' : !naJanela(t.getTime()) ? 'Fora da janela de envio (seg a sex 8h30 às 18h, sábado 9h às 12h).' : livres <= 0 ? `Esse dia já tem ${LIMITE_DIA} envios.` : '';
        p.innerHTML = erro ? `<span style="color:#ff8a8a">${esc(erro)}</span>` : `Sai ${esc(quando(t))}. ${livres} vaga${livres === 1 ? '' : 's'} no dia (limite ${LIMITE_DIA}).`;
        return erro ? null : t;
      };
      md.el.addEventListener('input', info); info();
      $('[data-ok]', md.el).onclick = () => { const t = info(); if (!t) { toast('Escolha um dia e hora dentro da janela', 'erro'); return; } res = t; md.fechar(); };
    });
  }
  /* Etiquetas da presença do lead (imagem do Marcelo, 10/10: "Site fraco", "Instagram") */
  function etiquetas(e) {
    const site = { sem: 'Sem site', ruim: 'Site fraco', fora_do_ar: 'Site fora do ar' }[e.site_status];
    return [site ? `<span class="selo laranja mini">${site}</span>` : '', e.instagram ? '<span class="selo azul mini">Instagram</span>' : '',
      e.regulado && e.conselho ? `<span class="selo cinza mini">${esc(String(e.conselho).split(/[ (,]/)[0])}</span>` : ''].join('');
  }
  const fatosComFalta = (d) => (Array.isArray(d.verificacao) ? d.verificacao : []).filter((x) => /FALTA/.test(`${x.como_conferiu || ''}${x.fonte || ''}`)).length;

  function blocoVerificacao(d) {
    const ver = Array.isArray(d.verificacao) ? d.verificacao : [];
    if (!ver.length) return d.status === 'rascunho' ? `<div class="aviso vermelho mt-8">${icone('alerta')}<div>Sem tabela de verificação. Confira as frases antes de aprovar.</div></div>` : '';
    const falta = fatosComFalta(d);
    return `<details class="mt-8 dobra"><summary><span class="rotulo">Verificação · ${ver.length} fato${ver.length > 1 ? 's' : ''}${falta ? ` · ${falta} pra reconferir` : ''}</span></summary>
      <div class="tabela-wrap mt-8"><table class="tabela"><thead><tr><th>Frase</th><th>Fonte</th><th>Como conferi</th></tr></thead><tbody>${ver.map((x) => `<tr><td>${esc(x.frase || '')}</td><td>${esc(x.fonte || '')}</td><td>${esc(x.como_conferiu || x.como || '')}</td></tr>`).join('')}</tbody></table></div></details>`;
  }
  /* Os fatos em lista curta (imagem do Marcelo: "Fatos verificados" com o check ao lado) */
  function fatosCurtos(d) {
    const ver = (Array.isArray(d.verificacao) ? d.verificacao : []).filter((x) => !/^Retomada/.test(x.frase || ''));
    if (!ver.length) return '';
    return `<div class="dsp-fatos"><small>Fatos verificados</small>${ver.slice(0, 3).map((x) => {
      const falta = /FALTA/.test(`${x.como_conferiu || ''}${x.fonte || ''}`);
      return `<div class="${falta ? 'falta' : 'ok'}" title="${esc(`${x.fonte || ''} · ${x.como_conferiu || ''}`)}">${icone(falta ? 'alerta' : 'check')}<span class="ellipsis">${esc(x.frase || '')}</span></div>`;
    }).join('')}${ver.length > 3 ? `<small class="dim">+${ver.length - 3}</small>` : ''}</div>`;
  }
  /* O que se abre ao clicar na mensagem: texto editável, revisor e a tabela inteira */
  function detalhe(d) {
    const edita = ['rascunho', 'aprovado'].includes(d.status);
    // O que está aberto e o que foi digitado sobrevivem ao redesenho da tela (10/10: a caixa fechava sozinha)
    const texto = editando.get(d.id) ?? d.texto;
    return `<div class="dsp-detalhe" ${abertos.has(d.id) ? '' : 'hidden'}>
      ${edita ? `<textarea class="txt" data-texto rows="${texto.length > 160 ? 4 : 3}">${esc(texto)}</textarea>` : `<div class="msg-sugerida">${esc(d.texto)}</div>`}
      ${edita ? `<div data-revisao>${blocoRevisao(d, texto)}</div>` : ''}${blocoVerificacao(d)}
      ${edita ? `<div class="row mt-8 gap-6"><button class="btn xs" data-a="salvar-texto">${icone('check')}Salvar o texto</button><span class="dim" style="font-size:12px">O Aprovar também usa o texto daqui.</span></div>` : ''}
    </div>`;
  }
  const botaoMais = (d) => `<button class="btn icone sm fantasma" data-a="mais" aria-label="Mais opções">${icone('pontos')}</button>`;

  /* Linha larga (imagem 1 do Marcelo): quem é, o objetivo e a mensagem, o contexto, o estado e os botões */
  function linhaLarga(d) {
    const e = emp(d.empresa_id);
    const agendada = ['agendado', 'enviando'].includes(d.status);
    return `<div class="dsp-linha larga ${abertos.has(d.id) ? 'aberta' : ''}" data-id="${d.id}">
      ${avatar(d.empresa_id)}
      <div class="dsp-quem"><a href="#" data-emp="${d.empresa_id}" class="ellipsis"><b>${esc(nomeEmp(d.empresa_id))}</b></a>
        <small>${esc(telefoneBonito(d.telefone))}</small><small class="ellipsis">${esc([e.bairro, e.cidade].filter(Boolean).join(', '))}</small>
        <div class="row wrap gap-4 mt-4">${etiquetas(e)}</div></div>
      <div class="dsp-obj"><small>${seloTipo(d)} ${esc(d.angulo || 'Mensagem')}</small>
        <button class="dsp-msg" data-a="abrir"><span>${esc(d.texto)}</span>${icone('setab')}</button></div>
      <div class="dsp-ctx"><small>Contexto</small><span>${esc((e.gancho || e.dor || '').slice(0, 110))}${(e.gancho || e.dor || '').length > 110 ? '…' : ''}</span>
        ${chipData(d)}</div>
      <div class="dsp-acoes">
        <span class="selo ${agendada ? 'amarelo' : d.status === 'aprovado' ? 'azul' : 'laranja'}">${agendada ? (d.status === 'enviando' ? 'Enviando' : 'Agendada') : d.status === 'aprovado' ? 'Aprovada' : 'Para aprovar'}</span>
        ${agendada ? `<button class="btn xs" data-a="horario">${icone('relogio')}Mudar horário</button><button class="btn xs fantasma" data-a="desagendar">${icone('x')}Tirar da agenda</button>` : `<button class="btn xs prim" data-a="aprovar-linha">${icone('enviar')}Aprovar</button>`}
        ${botaoMais(d)}</div>
      ${detalhe(d)}
    </div>`;
  }

  /* Linha de painel (imagem 2 do Marcelo): compacta, com Aprovar e Rejeitar */
  function linhaPainel(d, { fatos = false } = {}) {
    const e = emp(d.empresa_id);
    const sub = tipoDe(d) === 'abertura'
      ? [e.categoria, e.cidade].filter(Boolean).map((x) => String(x).split(/[,(:]/)[0].trim()).join(' · ')
      : e.ultimo_contato_em ? `Último contato ${relativo(e.ultimo_contato_em)}` : '';
    const agente = comAgente.get(d.empresa_id);
    const op = irmas(d).length ? `Opção ${esc(d.variante || 'A')}` : seloTipo(d);
    return `<div class="dsp-linha ${abertos.has(d.id) ? 'aberta' : ''}" data-id="${d.id}">
      ${avatar(d.empresa_id)}
      <div class="dsp-meio">
        <div class="row wrap gap-6"><a href="#" data-emp="${d.empresa_id}" class="ellipsis"><b>${esc(nomeEmp(d.empresa_id))}</b></a>${chipData(d)}</div>
        <small class="dim ellipsis">${esc([sub, agente ? `agente: ${agente}` : ''].filter(Boolean).join(' · '))}</small>
        <button class="dsp-msg mt-4" data-a="abrir"><b>${op}${d.angulo ? ` · ${esc(d.angulo)}` : ''}</b><span>${esc(d.texto)}</span>${icone('setab')}</button>
        ${fatos ? fatosCurtos(d) : ''}
      </div>
      <div class="dsp-acoes col">
        <button class="btn xs verde" data-a="aprovar-linha">${icone('check')}Aprovar</button>
        <button class="btn xs perigo" data-a="rejeitar">${icone('x')}Rejeitar</button>
        ${botaoMais(d)}</div>
      ${detalhe(d)}
    </div>`;
  }

  /* Painel com cabeçalho, contagem e as ações em lote */
  function painel({ chave, icone: ic, titulo, sub, itens, linha, vazioTxt, lote = true }) {
    const pendentes = itens.filter((d) => d.status === 'rascunho');
    return `<section class="card dsp-painel" data-painel="${chave}">
      <div class="dsp-cab"><span class="icone-caixa sm">${icone(ic)}</span>
        <div class="grow" style="min-width:0"><h3>${titulo} <span class="dsp-conta">${itens.length}</span></h3><small class="dim">${sub}</small></div>
        ${lote && pendentes.length > 1 ? `<button class="btn xs verde" data-lote-acao="aprovar" data-chave="${chave}">${icone('check')}Aprovar todas</button>
          <button class="btn xs perigo" data-lote-acao="rejeitar" data-chave="${chave}">${icone('x')}Rejeitar todas</button>` : ''}</div>
      ${itens.length ? itens.map(linha).join('') : `<p class="dim" style="font-size:13px;padding:8px 2px">${vazioTxt}</p>`}
    </section>`;
  }

  /* Corpo que espera o lead responder e acendeu: ele respondeu, mande em até 1 hora (08/10) */
  function cartaoProntidao(empresaId, opcoes) {
    const conv = conversaDe.get(empresaId);
    return `<section class="card dsp-painel destaque" data-emp-card="${empresaId}">
      <div class="dsp-cab">${avatar(empresaId)}<div class="grow" style="min-width:0"><h3 class="ellipsis"><a href="#" data-emp="${empresaId}">${esc(nomeEmp(empresaId))}</a></h3>
        <small class="dim">Respondeu ${entradas.get(empresaId) ? relativo(entradas.get(empresaId)) : ''}: mande em até 1 hora</small></div>
        <span class="selo verde">Respondeu</span>${conv ? `<a class="btn xs" href="#/conversas/${conv}">${icone('conversa')}Conversa</a>` : ''}</div>
      ${opcoes.map((d) => `<div class="briefing-msg mt-8" data-id="${d.id}">
          <b style="font-size:13.5px">${opcoes.length > 1 ? `Opção ${esc(d.variante || 'A')}` : 'Mensagem'}${d.angulo ? ` · ${esc(d.angulo)}` : ''}</b>
          <textarea class="txt mt-8" data-texto rows="4">${esc(d.texto)}</textarea><div data-revisao>${blocoRevisao(d)}</div>${blocoVerificacao(d)}
          <div class="row mt-8"><button class="btn sm verde" data-a="enviar-agora">${icone('enviar')}Enviar agora</button></div></div>`).join('')}
    </section>`;
  }
  /* Quem ainda não respondeu: uma linha, com a mensagem pronta escondida */
  function linhaProntidao([empresaId, opcoes]) {
    const p1 = lista.find((x) => x.empresa_id === empresaId && (x.passo || 1) === 1 && ['agendado', 'enviado', 'rascunho'].includes(x.status));
    const situacao = !p1 ? '' : p1.status === 'enviado' ? `abertura enviada ${relativo(p1.enviado_em)}` : p1.status === 'agendado' ? `abertura agendada ${quando(p1.agendado_para)}` : 'abertura ainda pra aprovar';
    return `<div class="dsp-linha" data-emp-card="${empresaId}">${avatar(empresaId)}
      <div class="dsp-meio"><a href="#" data-emp="${empresaId}" class="ellipsis"><b>${esc(nomeEmp(empresaId))}</b></a><small class="dim">${esc(situacao)}</small>
        <details class="mt-4 dobra"><summary><span class="rotulo">Ver ${opcoes.length > 1 ? `as ${opcoes.length} opções prontas` : 'a mensagem pronta'}</span></summary>
          ${opcoes.map((d) => `<div class="msg-sugerida mt-8"><b>${opcoes.length > 1 ? `Opção ${esc(d.variante || 'A')}${d.angulo ? ` · ${esc(d.angulo)}` : ''}: ` : ''}</b>${esc(d.texto)}</div>`).join('')}</details></div>
      <div class="dsp-acoes"><span class="selo cinza">De prontidão</span></div></div>`;
  }
  /* Histórico: uma linha por mensagem enviada, agrupada por dia, com o "Respondeu" à mão */
  function linhaEnviada(d) {
    return `<div class="item" data-id="${d.id}"><div class="grow" style="min-width:0">
        <div class="tit"><a href="#" data-emp="${d.empresa_id}">${esc(nomeEmp(d.empresa_id))}</a> <span class="dim" style="font-weight:400;font-size:12.5px">${soHora(d.enviado_em)}</span></div>
        <div class="sub ellipsis">${esc(d.texto || '')}</div></div>
      ${seloTipo(d)}<label class="check nowrap"><input type="checkbox" data-a="respondeu" ${d.respondeu ? 'checked' : ''}> Respondeu</label></div>`;
  }

  /* Os grupos da tela (usados também pelo "Aprovar todas") */
  function grupos() {
    const vivos = lista.filter((d) => !['cancelado', 'enviado'].includes(d.status));
    const porData = (a, b) => new Date(momentoDe(a) || a.criado_em) - new Date(momentoDe(b) || b.criado_em);
    const agendadas = vivos.filter((d) => ['agendado', 'enviando'].includes(d.status)).sort(porData);
    const pendentes = vivos.filter((d) => ['rascunho', 'aprovado'].includes(d.status));
    // Retomada (follow-up e resposta a quem parou) x abertura (primeira mensagem)
    const followups = pendentes.filter((d) => ['followup', 'resposta'].includes(tipoDe(d))).sort(porData);
    const aberturas = pendentes.filter((d) => tipoDe(d) === 'abertura' && (d.sugerido_para || d.status === 'rascunho')).sort(porData);
    const corpos = pendentes.filter((d) => tipoDe(d) === 'corpo' && !d.sugerido_para);
    const corposComData = pendentes.filter((d) => tipoDe(d) === 'corpo' && d.sugerido_para).sort(porData);
    const semHorario = pendentes.filter((d) => d.status === 'aprovado' && tipoDe(d) === 'abertura' && !d.sugerido_para);
    return { vivos, agendadas, followups: [...followups, ...corposComData], aberturas: aberturas.filter((d) => !semHorario.includes(d)), corpos, semHorario };
  }

  function avisoWhats() {
    const wa = estado.farejador?.whatsapp_status === 'conectado' && farejadorOnline();
    $('[data-aviso]', v).innerHTML = wa ? '' : `<div class="aviso laranja mb-16">${icone('alerta')}<div><b>O WhatsApp não está conectado no Farejador.</b> Dá pra aprovar daqui, mas nada sai até ele ligar no seu PC.</div></div>`;
  }

  /* Redesenha guardando onde o Marcelo estava: a caixa com o cursor (10/10: a caixa fechava sozinha) */
  function desenhar() {
    const ativo = document.activeElement?.matches?.('[data-texto]') ? document.activeElement : null;
    const foco = ativo && { id: ativo.closest('[data-id]')?.dataset.id, ini: ativo.selectionStart, fim: ativo.selectionEnd };
    montar();
    if (foco?.id) {
      const ta = $(`[data-id="${foco.id}"] [data-texto]`, v);
      if (ta) { ta.focus({ preventScroll: true }); ta.setSelectionRange(foco.ini, foco.fim); }
    }
  }

  function montar() {
    const g = grupos();
    const hoje = hojeBahia();
    const prontPorLead = [...new Set(g.corpos.map((d) => d.empresa_id))].map((id) => [id, g.corpos.filter((d) => d.empresa_id === id).sort((x, y) => String(x.variante || 'A').localeCompare(y.variante || 'A'))]);
    const acesos = prontPorLead.filter(([, ops]) => ops.some((d) => !esperandoResposta(d)));
    const quietos = prontPorLead.filter(([, ops]) => ops.every((d) => esperandoResposta(d)));
    const erros = lista.filter((d) => d.status === 'erro');
    const enviados = lista.filter((d) => d.status === 'enviado' && d.enviado_em).sort((a, b) => new Date(b.enviado_em) - new Date(a.enviado_em));
    const enviadosHoje = enviados.filter((d) => diaBahia(d.enviado_em) === hoje).length;
    const restam = Math.max(0, LIMITE_DIA - ocupadosNoDia(hoje));
    const paraAprovar = [...g.followups, ...g.aberturas].filter((d) => d.status === 'rascunho').length;

    avisoWhats();

    const enviadosPorDia = new Map();
    for (const d of enviados.slice(0, 120)) { const k = diaBahia(d.enviado_em); if (!enviadosPorDia.has(k)) enviadosPorDia.set(k, []); enviadosPorDia.get(k).push(d); }

    $('[data-corpo]', v).innerHTML = `
      <div class="kpis">
        <div class="kpi ${acesos.length ? 'verde' : ''}"><div class="kl"><span class="ic">${icone('conversa')}</span>Responderam</div><div class="kv">${acesos.length}</div></div>
        <div class="kpi"><div class="kl"><span class="ic">${icone('editar')}</span>Para aprovar</div><div class="kv">${paraAprovar}</div></div>
        <div class="kpi azul"><div class="kl"><span class="ic">${icone('relogio')}</span>Agendadas</div><div class="kv">${g.agendadas.length}</div></div>
        <div class="kpi"><div class="kl"><span class="ic">${icone('enviar')}</span>Enviadas hoje</div><div class="kv">${enviadosHoje}/${LIMITE_DIA}</div></div>
      </div>

      ${acesos.length ? `<h2 class="mt-24 secao-tit">Responderam: mande agora · ${acesos.length}</h2>
      <p class="dim" style="font-size:13px">O lead respondeu e a próxima mensagem já está pronta. A regra da casa é mandar em até 1 hora.</p>
      ${acesos.map(([id, ops]) => cartaoProntidao(id, ops)).join('')}` : ''}

      <section class="card dsp-painel mt-16">
        <div class="dsp-cab"><span class="icone-caixa sm amarelo">${icone('relogio')}</span>
          <div class="grow" style="min-width:0"><h3>Agendadas <span class="dsp-conta">${g.agendadas.length}</span></h3>
            <small class="dim">${g.agendadas.length ? `Saem sozinhas no horário, com o PC ligado, o Farejador aberto e o WhatsApp conectado. A próxima sai ${quando(g.agendadas[0].agendado_para)}.` : 'Nada agendado ainda. O que você aprovar abaixo entra aqui com dia e hora.'}</small></div>
          ${g.agendadas.length ? `<button class="btn xs perigo" data-parar>${icone('pausa')}Cancelar todas</button>` : ''}</div>
        ${g.agendadas.map(linhaLarga).join('')}
      </section>

      <div class="dsp-grade mt-16">
        ${painel({ chave: 'followups', icone: 'atualizar', titulo: 'Follow-ups programados', sub: 'Leads que pararam ou pediram retorno.', itens: g.followups, linha: (d) => linhaPainel(d), vazioTxt: 'Nenhum follow-up esperando.' })}
        ${painel({ chave: 'aberturas', icone: 'enviar', titulo: 'Prontas para sair', sub: 'Primeiras mensagens, com os fatos conferidos.', itens: g.aberturas, linha: (d) => linhaPainel(d, { fatos: true }), vazioTxt: 'Nenhuma abertura esperando.' })}
      </div>

      ${quietos.length ? `<section class="card dsp-painel mt-16">
        <div class="dsp-cab"><span class="icone-caixa sm">${icone('conversa')}</span><div class="grow"><h3>De prontidão <span class="dsp-conta">${quietos.length}</span></h3>
          <small class="dim">A segunda mensagem desses leads já está pronta e espera a resposta deles. Quando alguém responder, sobe pro topo em verde.</small></div></div>
        ${quietos.map(linhaProntidao).join('')}</section>` : ''}

      ${g.semHorario.length ? `<section class="card dsp-painel mt-16"><div class="dsp-cab"><span class="icone-caixa sm azul">${icone('check')}</span><div class="grow"><h3>Aprovadas sem horário <span class="dsp-conta">${g.semHorario.length}</span></h3>
          <small class="dim">No máximo ${LIMITE_DIA} por dia.${restam ? ` Hoje ainda cabem ${restam}.` : ' O limite de hoje já foi: agende pra outro dia.'}</small></div></div>
        ${g.semHorario.map((d) => `<div class="item" data-id="${d.id}"><div class="grow" style="min-width:0"><div class="tit"><a href="#" data-emp="${d.empresa_id}">${esc(nomeEmp(d.empresa_id))}</a></div><div class="msg-sugerida mt-8">${esc(d.texto)}</div></div>
          <button class="btn xs fantasma" data-a="voltar">${icone('editar')}Voltar pra aprovar</button></div>`).join('')}
        <div class="row wrap mt-12 gap-6">
          <input class="inp" type="datetime-local" data-quando value="${horarioSugerido()}" style="max-width:220px" aria-label="Data e hora do envio">
          <button class="btn prim" data-agendar>${icone('relogio')}Agendar ${g.semHorario.length > 1 ? `as ${g.semHorario.length}` : 'esta'}</button>
          <span class="dim" style="font-size:13px">ou</span>
          <button class="btn sm" data-lote ${restam ? '' : 'disabled'}>${icone('enviar')}Enviar agora</button></div></section>` : ''}

      ${erros.length ? `<h2 class="mt-24 secao-tit">Com erro · ${erros.length}</h2>${erros.map((d) => cartao(d)).join('')}` : ''}

      ${enviados.length ? `<details class="mt-24 dobra"><summary><span class="secao-tit" style="font-size:18px">Histórico · ${enviados.length} enviada${enviados.length > 1 ? 's' : ''}</span></summary>
        ${[...enviadosPorDia].map(([dia, its]) => `<h3 class="mt-16">${esc(nomeDoDia(dia))}</h3><section class="card mt-8">${its.map(linhaEnviada).join('')}</section>`).join('')}</details>` : ''}`;
  }

  /* Aprova uma mensagem: com data sugerida, agenda pra ela; sem data, vai pra "Aprovadas sem horário" */
  async function aprovar(d, texto) {
    const outras = lista.filter((x) => x.id !== d.id && x.empresa_id === d.empresa_id && (x.passo || 1) === (d.passo || 1) && x.status === 'rascunho').map((x) => x.id);
    if (!d.sugerido_para) {
      const { error } = await sb.from('disparos').update({ texto, status: 'aprovado', aprovado_por: quem(), aprovado_em: new Date().toISOString() }).eq('id', d.id).in('status', ['rascunho', 'aprovado']);
      if (error) return erroAmigavel(error);
    } else {
      const h = horaDe(d);
      if (!h) return 'Não achei horário comercial nos próximos dias';
      if (LIMITE_DIA - ocupadosNoDia(diaBahia(h)) <= 0) return `O dia ${diaBahia(h).split('-').reverse().join('/')} já tem ${LIMITE_DIA} envios`;
      const { error } = await sb.from('disparos').update({ texto, status: 'agendado', agendado_para: h.toISOString(), lote_id: crypto.randomUUID(), aprovado_por: quem(), aprovado_em: new Date().toISOString() })
        .eq('id', d.id).in('status', ['rascunho', 'aprovado']);
      if (error) return erroAmigavel(error);
      d.status = 'agendado'; d.agendado_para = h.toISOString(); // pro limite do dia valer dentro do "Aprovar todas"
    }
    if (outras.length) await sb.from('disparos').update({ status: 'cancelado', erro: `Descartada: você aprovou a abordagem ${d.variante || 'A'}` }).in('id', outras);
    return null;
  }

  // Revisor ao vivo: cada tecla no texto refaz o bloco de avisos daquele cartão
  v.addEventListener('input', debounce((ev) => {
    const ta = ev.target.closest?.('[data-texto]'); if (!ta) return;
    const card = ta.closest('[data-id]'); const d = card && lista.find((x) => x.id === card.dataset.id);
    if (d) editando.set(d.id, ta.value);
    const alvo = card && $('[data-revisao]', card);
    if (d && alvo) alvo.innerHTML = blocoRevisao(d, ta.value);
  }, 250));

  v.addEventListener('click', async (ev) => {
    const emp = ev.target.closest('[data-emp]');
    if (emp) { ev.preventDefault(); (await import('../ficha.js')).abrirFicha(emp.dataset.emp); return; }

    if (ev.target.closest('[data-parar]')) {
      if (!(await confirmar('Cancelar os agendamentos?', 'O que ainda não saiu volta pra "Para aprovar", no mesmo dia em que estava marcado.', { rotulo: 'Cancelar' }))) return;
      // Uma por uma: cada mensagem guarda a hora em que estava marcada como sugestão
      for (const d of lista.filter((x) => x.status === 'agendado')) {
        const { error } = await sb.from('disparos').update({ status: 'rascunho', sugerido_para: d.agendado_para, agendado_para: null, lote_id: null, aprovado_por: null, aprovado_em: null }).eq('id', d.id).eq('status', 'agendado');
        if (error) { toast(erroAmigavel(error), 'erro'); return carregar(); }
      }
      toast('Agendamentos cancelados');
      return carregar();
    }

    const lote = ev.target.closest('[data-lote],[data-agendar]');
    if (lote) {
      // Agora (em 20 segundos) ou no horário escolhido; o limite de 10 vale para o dia em que as mensagens saem
      let inicio = Date.now() + 20000;
      if (lote.hasAttribute('data-agendar')) {
        const val = $('[data-quando]', v)?.value;
        inicio = val ? new Date(val).getTime() : NaN;
        if (!Number.isFinite(inicio)) { toast('Escolha a data e a hora', 'erro'); return; }
        if (inicio < Date.now() + 60000) { toast('Escolha um horário daqui a pelo menos 1 minuto', 'erro'); return; }
        // Mensagem de número desconhecido às 23h lê como golpe (LevSaúde saiu 23h31 em 28/09)
        if (!naJanela(inicio)) { toast('Fora do horário comercial. O Farejador só envia de segunda a sexta, 8h30 às 18h, e sábado, 9h às 12h.', 'erro'); return; }
      }
      const cabem = Math.max(0, LIMITE_DIA - ocupadosNoDia(diaBahia(inicio)));
      if (!cabem) { toast(`O dia ${diaBahia(inicio).split('-').reverse().join('/')} já tem ${LIMITE_DIA} envios. Escolha outro dia.`, 'erro'); return; }
      // Trava extra: nunca duas mensagens da mesma empresa no lote
      const vistos = new Set();
      const alvo = lista.filter((d) => d.status === 'aprovado' && (d.passo || 1) === 1)
        .filter((d) => { if (vistos.has(d.empresa_id)) return false; vistos.add(d.empresa_id); return true; })
        .slice(0, cabem);
      if (!alvo.length) return;
      const agora = !lote.hasAttribute('data-agendar');
      const foraAgora = agora && !naJanela(inicio);
      if (!(await confirmar(`${agora ? 'Enviar AGORA' : 'Agendar'} ${alvo.length} mensage${alvo.length > 1 ? 'ns' : 'm'}?`, `${foraAgora ? 'Agora está fora do horário comercial: o Farejador segura o lote e começa quando abrir a janela (seg a sex 8h30, sábado 9h). ' : ''}${agora ? 'Começa agora' : `Começa ${quando(inicio)}`}, pelo WhatsApp conectado no Farejador, na ordem de aprovação, com 4 a 7 minutos entre uma e outra: ${alvo.map((d) => nomeEmp(d.empresa_id)).join(', ')}.${agora ? '' : ' O PC precisa estar ligado com o Farejador aberto nesse horário.'}`, { rotulo: agora ? 'Enviar agora' : 'Agendar' }))) return;
      botaoCarregando(lote, true, 'Agendando…');
      const loteId = crypto.randomUUID();
      // Já tem mensagem agendada nesse dia depois do horário escolhido? Entra na fila depois da última, com o mesmo intervalo
      const ultimo = lista.filter((d) => d.status === 'agendado' && d.agendado_para && diaBahia(d.agendado_para) === diaBahia(inicio))
        .reduce((m, d) => Math.max(m, new Date(d.agendado_para).getTime()), 0);
      let t = ultimo && inicio < ultimo + 4 * 60000 ? ultimo + (4 + Math.random() * 3) * 60000 : inicio;
      for (const d of alvo) {
        const { error } = await sb.from('disparos').update({ status: 'agendado', agendado_para: new Date(t).toISOString(), lote_id: loteId }).eq('id', d.id).eq('status', 'aprovado');
        if (error) { toast(erroAmigavel(error), 'erro'); break; }
        t += (4 + Math.random() * 3) * 60000;
      }
      toast(agora ? 'Lote na fila do Farejador' : `Agendado: começa ${quando(inicio)}`, 'info');
      return carregar();
    }

    // Aprovar todas / Rejeitar todas de um painel
    const loteBtn = ev.target.closest('[data-lote-acao]');
    if (loteBtn) {
      const g = grupos();
      const itens = (loteBtn.dataset.chave === 'followups' ? g.followups : g.aberturas).filter((x) => x.status === 'rascunho');
      if (!itens.length) return;
      const aprovar_ = loteBtn.dataset.loteAcao === 'aprovar';
      const comVeto = itens.filter((x) => revisar(x.texto, { passo: x.passo || 1, tipo: x.tipo, empresa: nomeEmp(x.empresa_id) }).vetos);
      const comFalta = itens.filter((x) => fatosComFalta(x));
      const lista_ = itens.map((x) => `${nomeEmp(x.empresa_id)} (${x.sugerido_para ? quando(horaDe(x) || x.sugerido_para) : 'sem horário'})`).join(', ');
      const avisos = aprovar_ ? [comVeto.length ? `Com veto do revisor: ${comVeto.map((x) => nomeEmp(x.empresa_id)).join(', ')}.` : '', comFalta.length ? `Com fato pra reconferir: ${comFalta.map((x) => nomeEmp(x.empresa_id)).join(', ')}.` : ''].filter(Boolean).join(' ') : '';
      if (!(await confirmar(`${aprovar_ ? 'Aprovar' : 'Rejeitar'} ${itens.length} mensagens?`, `${lista_}.${avisos ? ` ${avisos}` : ''}${aprovar_ ? ' Cada uma entra na agenda no dia e na hora dela.' : ' Elas saem da tela.'}`, { rotulo: aprovar_ ? 'Aprovar todas' : 'Rejeitar todas' }))) return;
      botaoCarregando(loteBtn, true, aprovar_ ? 'Aprovando…' : 'Rejeitando…');
      if (aprovar_) {
        for (const x of itens) { const erro = await aprovar(x, x.texto); if (erro) { toast(`${nomeEmp(x.empresa_id)}: ${erro}`, 'erro'); break; } }
        toast('Aprovadas: estão na agenda', 'info');
      } else {
        await sb.from('disparos').update({ status: 'cancelado', erro: 'Rejeitada pelo Marcelo' }).in('id', itens.map((x) => x.id)).eq('status', 'rascunho');
        toast('Rejeitadas');
      }
      return carregar();
    }

    const b = ev.target.closest('[data-a]'); if (!b) return;
    if (b.dataset.a === 'descartar-lead') {
      const id = b.closest('[data-emp-card]').dataset.empCard;
      if (!(await confirmar('Tirar este lead do Disparos?', `As opções de mensagem inicial de ${nomeEmp(id)} são descartadas. A ficha continua como está.`, { rotulo: 'Tirar' }))) return;
      await sb.from('disparos').update({ status: 'cancelado', erro: 'Tirado do Disparos pelo Marcelo' }).eq('empresa_id', id).eq('passo', 1).eq('status', 'rascunho');
      toast('Lead tirado do Disparos'); return carregar();
    }
    const card = b.closest('[data-id]'); const d = card && lista.find((x) => x.id === card.dataset.id);
    if (!d) return;
    const a = b.dataset.a;
    const det = $('.dsp-detalhe', card);
    // Clicar na mensagem abre o texto inteiro, editável, com o revisor e os fatos
    if (a === 'abrir') { if (det) { det.hidden = !det.hidden; card.classList.toggle('aberta', !det.hidden); if (det.hidden) abertos.delete(d.id); else abertos.add(d.id); } return; }
    // Mudar o dia e a hora: rascunho guarda como sugestão, agendada muda o horário de saída
    if (a === 'horario') return mudarHorario(d);
    if (a === 'salvar-texto') {
      const texto = $('[data-texto]', card).value.trim().replace(/\s*\n+\s*/g, ' ');
      if (!texto) { toast('Texto vazio', 'erro'); return; }
      const { error } = await sb.from('disparos').update({ texto }).eq('id', d.id);
      if (error) toast(erroAmigavel(error), 'erro'); else { toast('Texto salvo'); editando.delete(d.id); }
      return carregar();
    }
    if (a === 'aprovar-linha') {
      const caixa = $('[data-texto]', card);
      const texto = (caixa ? caixa.value : d.texto).trim().replace(/\s*\n+\s*/g, ' ');
      if (!texto) { toast('Texto vazio', 'erro'); return; }
      botaoCarregando(b, true, 'Aprovando…');
      const erro = await aprovar(d, texto);
      if (erro) { toast(erro, 'erro'); botaoCarregando(b, false); return; }
      editando.delete(d.id); abertos.delete(d.id);
      toast(d.sugerido_para ? `Aprovada: sai ${quando(d.agendado_para || horaDe(d))}` : 'Aprovada: escolha o horário em "Aprovadas sem horário"', 'info');
      return carregar();
    }
    if (a === 'rejeitar') {
      await sb.from('disparos').update({ status: 'cancelado', erro: 'Rejeitada pelo Marcelo' }).eq('id', d.id);
      toast('Rejeitada'); return carregar();
    }
    if (a === 'mais') {
      const conv = conversaDe.get(d.empresa_id);
      menu(b, [
        { rotulo: det?.hidden === false ? 'Fechar o texto' : 'Editar o texto', icone: 'editar', fn: () => { det.hidden = !det.hidden; card.classList.toggle('aberta', !det.hidden); if (!det.hidden) $('[data-texto]', card)?.focus(); } },
        ...(['rascunho', 'aprovado', 'agendado'].includes(d.status) ? [{ rotulo: momentoDe(d) ? 'Mudar o dia e a hora' : 'Escolher o dia e a hora', icone: 'relogio', fn: () => mudarHorario(d) }] : []),
        { rotulo: 'Ver a ficha', icone: 'predio', fn: async () => (await import('../ficha.js')).abrirFicha(d.empresa_id) },
        ...(conv ? [{ rotulo: 'Abrir a conversa', icone: 'conversa', fn: () => { location.hash = `#/conversas/${conv}`; } }] : []),
        ...(comAgente.has(d.empresa_id) ? [{ rotulo: 'Ver na Mesa de agentes', icone: 'robo', fn: () => { location.hash = `#/agentes?lead=${d.empresa_id}&revisar=1`; } }] : []),
        ...(d.status === 'agendado' ? [{ rotulo: 'Tirar da agenda', icone: 'relogio', fn: () => $('[data-a="desagendar"]', card)?.click() }] : []),
        ...(['rascunho', 'aprovado'].includes(d.status) ? ['-', { rotulo: 'Rejeitar', icone: 'x', perigo: true, fn: async () => { await sb.from('disparos').update({ status: 'cancelado', erro: 'Rejeitada pelo Marcelo' }).eq('id', d.id); toast('Rejeitada'); carregar(); } }] : []),
      ]);
      return;
    }
    // Aprovar e agendar pra hora sugerida (agenda), ou enviar já (corpo de quem acabou de responder)
    if (a === 'agendar-um' || a === 'enviar-agora') {
      const caixa = $('[data-texto]', card);
      const texto = (caixa ? caixa.value : d.texto).trim().replace(/\s*\n+\s*/g, ' ');
      if (!texto) { toast('Texto vazio', 'erro'); return; }
      const h = a === 'enviar-agora' ? new Date(Date.now() + 20000) : horaDe(d);
      if (!h) { toast('Não achei horário comercial nos próximos dias', 'erro'); return; }
      if (LIMITE_DIA - ocupadosNoDia(diaBahia(h)) <= 0) { toast(`O dia ${diaBahia(h).split('-').reverse().join('/')} já tem ${LIMITE_DIA} envios. Mande pela conversa ou escolha outro dia.`, 'erro'); return; }
      const { error } = await sb.from('disparos').update({ texto, status: 'agendado', agendado_para: h.toISOString(), lote_id: crypto.randomUUID(), aprovado_por: quem(), aprovado_em: new Date().toISOString() })
        .eq('id', d.id).in('status', ['rascunho', 'aprovado']);
      if (error) { toast(erroAmigavel(error), 'erro'); return; }
      // Só uma opção por passo sai: as outras do mesmo lead e do mesmo passo são descartadas
      const outras = lista.filter((x) => x.id !== d.id && x.empresa_id === d.empresa_id && (x.passo || 1) === (d.passo || 1) && x.status === 'rascunho').map((x) => x.id);
      if (outras.length) await sb.from('disparos').update({ status: 'cancelado', erro: `Descartada: você aprovou a abordagem ${d.variante || 'A'}` }).in('id', outras);
      toast(a === 'enviar-agora' ? (naJanela(h) ? 'Na fila: sai em instantes' : 'Fora do horário comercial: sai quando abrir a janela') : `Agendada: sai ${quando(h)}`, 'info');
      return carregar();
    }
    // Volta pra "Para aprovar" no mesmo dia em que estava marcada
    if (a === 'desagendar') {
      const { error } = await sb.from('disparos').update({ status: 'rascunho', sugerido_para: d.agendado_para, agendado_para: null, lote_id: null, aprovado_por: null, aprovado_em: null })
        .eq('id', d.id).eq('status', 'agendado');
      if (error) toast(erroAmigavel(error), 'erro'); else toast('Tirada da agenda: voltou pra aprovar');
      return carregar();
    }
    if (a === 'aprovar') {
      const texto = $('[data-texto]', card).value.trim().replace(/\s*\n+\s*/g, ' ');
      if (!texto) { toast('Texto vazio', 'erro'); return; }
      const { error } = await sb.from('disparos').update({ texto, status: 'aprovado', aprovado_por: quem(), aprovado_em: new Date().toISOString() }).eq('id', d.id);
      if (error) toast(erroAmigavel(error), 'erro');
      else {
        // Só uma abordagem por passo sai: as outras variantes do mesmo passo são descartadas
        const outras = irmas(d).map((x) => x.id);
        if (outras.length) await sb.from('disparos').update({ status: 'cancelado', erro: `Descartada: você aprovou a abordagem ${d.variante || 'A'}` }).in('id', outras);
        toast(outras.length ? `Aprovado. ${outras.length === 1 ? 'A outra abordagem foi descartada' : 'As outras abordagens foram descartadas'}.` : 'Aprovado');
      }
    }
    if (a === 'descartar') { await sb.from('disparos').update({ status: 'cancelado' }).eq('id', d.id); toast('Descartado'); }
    if (a === 'voltar') {
      await sb.from('disparos').update({ status: 'rascunho', aprovado_por: null, aprovado_em: null, erro: null }).eq('id', d.id);
      // As opções que tinham sido descartadas pela escolha voltam junto
      await sb.from('disparos').update({ status: 'rascunho', erro: null }).eq('empresa_id', d.empresa_id).eq('passo', d.passo || 1).eq('status', 'cancelado').like('erro', 'Descartada: você aprovou%');
    }
    if (a === 'respondeu') { await sb.from('disparos').update({ respondeu: b.checked }).eq('id', d.id); }
    carregar();
  });

  await carregar();
  const tiras = [ouvir('disparos', debounce(carregar, 400)), ouvir('farejador_status', debounce(avisoWhats, 800))];
  return () => tiras.forEach((f) => f());
}
