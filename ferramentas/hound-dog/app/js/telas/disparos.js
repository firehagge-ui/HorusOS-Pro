/* =============================================================================
   HOUNDER — Disparos: prospecção que o Claude prepara e verifica, o Marcelo
   aprova (texto exato) e o Farejador envia pelo WhatsApp. Regra de 24/09/2026:
   no máximo 10 por dia, 4 a 7 minutos aleatórios entre um e outro, e o lote
   para no primeiro erro.
   ============================================================================= */
import { sb, estado, ouvir, farejadorOnline, quem } from '../sb.js';
import { $, $$, esc, toast, confirmar, erroAmigavel, botaoCarregando, telefoneBonito, relativo, dataHora, vazio, esqueleto, debounce } from '../ui.js';
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
    <div class="cab"><div class="tt"><h1>Disparos de prospecção</h1><p>O Claude pesquisa e confere cada frase. Você aprova o texto exato. O Farejador envia pelo seu WhatsApp, no máximo ${LIMITE_DIA} por dia, com 4 a 7 minutos entre um e outro.</p></div></div>
    <div data-aviso></div>
    <div data-corpo>${esqueleto(8, 26)}</div>`;

  let lista = [];
  let entradas = new Map(); // empresa_id -> momento da última mensagem que o lead mandou
  const hojeBahia = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bahia' });
  const diaBahia = (d) => new Date(d).toLocaleDateString('en-CA', { timeZone: 'America/Bahia' });

  async function carregar() {
    if (!v.isConnected) return;
    const { data, error } = await sb.from('disparos').select('*').order('criado_em', { ascending: true }).limit(500);
    if (error) { $('[data-corpo]', v).innerHTML = vazio('alerta', 'Não carregou', erroAmigavel(error)); return; }
    lista = data || [];
    // Quem tem passo 2 pendente: saber se o lead já respondeu no WhatsApp
    const ids = [...new Set(lista.filter((d) => d.passo > 1 && ['rascunho', 'aprovado', 'agendado'].includes(d.status)).map((d) => d.empresa_id))];
    entradas = new Map();
    if (ids.length) {
      const { data: convs } = await sb.from('whatsapp_conversas').select('id,empresa_id').in('empresa_id', ids);
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

  function cartao(d, { edita = false } = {}) {
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

  /* Follow-up: um cartão por cliente, com a data sugerida e "Programar" (30/09) */
  function horaDoFollowup(d) {
    const alvo = Math.max(d.sugerido_para ? new Date(d.sugerido_para).getTime() : 0, Date.now() + 2 * 60000);
    return naJanela(alvo) ? new Date(alvo) : proximaAbertura(alvo);
  }
  function cartaoFollowup(empresaId, opcoes) {
    const h = horaDoFollowup(opcoes[0]);
    return `<article class="card mt-12 disparo" data-emp-card="${empresaId}">
      <div class="card-cab"><div class="grow"><h3><a href="#" data-emp="${empresaId}">${esc(nomeEmp(empresaId))}</a></h3>
        <div class="dim" style="font-size:12.5px">${icone('whatsapp')} ${esc(telefoneBonito(opcoes[0]?.telefone))} · sai ${h ? quando(h) : 'no próximo horário comercial'}</div></div>
        <span class="selo violeta">follow-up</span><button class="btn xs fantasma" data-a="descartar-fup">${icone('x')}Não mandar</button></div>
      ${opcoes.map((d) => `<div class="briefing-msg mt-12" data-id="${d.id}">
          <b style="font-size:14px">Opção ${esc(d.variante || 'A')}${d.angulo ? ` · ${esc(d.angulo)}` : ''}</b>
          <textarea class="txt mt-8" data-texto rows="3">${esc(d.texto)}</textarea>
          ${blocoAgente(d)}
          <div data-revisao>${blocoRevisao(d)}</div>
          <div class="row mt-8"><button class="btn sm verde" data-a="programar">${icone('relogio')}Programar a opção ${esc(d.variante || 'A')}${h ? ` pra ${quando(h)}` : ''}</button></div>
        </div>`).join('')}
    </article>`;
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
  /* Sugestão de horário: amanhã 8h30 se já passou das 18h, senão daqui a 1 hora (no formato do datetime-local) */
  function horarioSugerido() {
    const t = new Date();
    if (t.getHours() >= 18) { t.setDate(t.getDate() + 1); t.setHours(8, 30, 0, 0); } else { t.setHours(t.getHours() + 1, 0, 0, 0); }
    const p = (n) => String(n).padStart(2, '0');
    return `${t.getFullYear()}-${p(t.getMonth() + 1)}-${p(t.getDate())}T${p(t.getHours())}:${p(t.getMinutes())}`;
  }

  function desenhar() {
    // Esta tela cuida só da mensagem inicial (passo 1). O passo 2 fica na ficha e na conversa do lead (Marcelo, 29/09)
    const ativos = lista.filter((d) => d.status !== 'cancelado' && (d.passo || 1) === 1 && d.tipo !== 'followup');
    // Follow-up programado (30/09): o agente prepara quando o lead some há 3 dias, com a data do 4º dia
    const fups = lista.filter((d) => d.tipo === 'followup' && d.status === 'rascunho');
    const fupsPorCliente = [...new Set(fups.map((d) => d.empresa_id))].map((id) => [id, fups.filter((d) => d.empresa_id === id).sort((x, y) => String(x.variante || 'A').localeCompare(y.variante || 'A'))]);
    const por = (s) => ativos.filter((d) => d.status === s);
    const enviadosHoje = ativos.filter((d) => d.status === 'enviado' && diaBahia(d.enviado_em) === hojeBahia()).length;
    const restam = Math.max(0, LIMITE_DIA - ocupadosNoDia(hojeBahia()));
    const fila = lista.filter((d) => d.status === 'agendado' || d.status === 'enviando').sort((a, b) => new Date(a.agendado_para) - new Date(b.agendado_para));
    const aprovadosTodos = por('aprovado');
    const aprovados = aprovadosTodos;
    // Cliente que já tem mensagem inicial agendada ou enviada não aparece pra escolher de novo
    const jaSaiu = new Set(lista.filter((d) => (d.passo || 1) === 1 && ['agendado', 'enviando', 'enviado'].includes(d.status)).map((d) => d.empresa_id));
    const porCliente = [...new Set(por('rascunho').map((d) => d.empresa_id))].filter((id) => !jaSaiu.has(id))
      .map((id) => [id, por('rascunho').filter((d) => d.empresa_id === id).sort((x, y) => String(x.variante || 'A').localeCompare(y.variante || 'A'))]);
    const futuro = fila.length && fila[0].status === 'agendado' && new Date(fila[0].agendado_para) - Date.now() > 10 * 60000;
    const venceu = por('enviado').filter((d) => !d.respondeu && d.followup_em && new Date(d.followup_em) < new Date()).length;

    const wa = estado.farejador?.whatsapp_status === 'conectado' && farejadorOnline();
    $('[data-aviso]', v).innerHTML = wa ? '' : `<div class="aviso laranja mb-16">${icone('alerta')}<div><b>O WhatsApp não está conectado no Farejador.</b> Dá pra aprovar daqui, mas nada sai até ele ligar no seu PC.</div></div>`;

    $('[data-corpo]', v).innerHTML = `
      <div class="kpis">
        <div class="kpi"><div class="kl"><span class="ic">${icone('editar')}</span>Para aprovar</div><div class="kv">${por('rascunho').length}</div></div>
        <div class="kpi azul"><div class="kl"><span class="ic">${icone('check')}</span>Aprovados</div><div class="kv">${aprovados.length}</div></div>
        <div class="kpi verde"><div class="kl"><span class="ic">${icone('enviar')}</span>Enviados hoje</div><div class="kv">${enviadosHoje}/${LIMITE_DIA}</div></div>
        <div class="kpi ${venceu ? 'vermelho' : ''}"><div class="kl"><span class="ic">${icone('relogio')}</span>Follow-up vencido</div><div class="kv">${venceu}</div></div>
      </div>

      ${fila.length ? `<section class="card destaque mt-16"><div class="card-cab"><div class="icone-caixa sm amarelo">${icone('relogio')}</div><h3 class="grow">${futuro ? `Agendado · ${fila.length} mensage${fila.length > 1 ? 'ns saem' : 'm sai'} a partir de ${quando(fila[0].agendado_para)}` : `Lote em andamento · ${fila.length} na fila`}</h3>
        <button class="btn sm perigo" data-parar>${icone('pausa')}${futuro ? 'Cancelar o agendamento' : 'Parar o lote'}</button></div>
        ${futuro ? `<p class="dim" style="font-size:12.5px">Sai sozinho no horário, desde que o PC esteja ligado com o Farejador aberto e o WhatsApp conectado.</p>` : ''}
        ${fila.map((d) => `<div class="item"><div class="grow"><div class="tit">${esc(nomeEmp(d.empresa_id))}</div><div class="sub">${d.status === 'enviando' ? 'enviando agora' : `sai ${quando(d.agendado_para)}`}</div></div>${d.tipo === 'followup' ? '<span class="selo violeta">follow-up</span>' : ''}${d.angulo ? `<span class="selo cinza">${esc(d.angulo)}</span>` : ''}</div>`).join('')}</section>` : ''}

      ${fupsPorCliente.length ? `<h2 class="mt-24 secao-tit">Follow-ups programados · ${fupsPorCliente.length}</h2>
      <p class="dim" style="font-size:13px">Lead que não respondeu a nossa última mensagem. O agente preparou um follow-up só (regra da casa) com a data do 4º dia. Programar deixa ele na fila pra essa hora; nada sai sem você.</p>
      ${fupsPorCliente.map(([id, ops]) => cartaoFollowup(id, ops)).join('')}` : ''}

      <h2 class="mt-24 secao-tit">Prontos pra sair${aprovados.length ? ` · ${aprovados.length}` : ''}</h2>
      ${aprovados.length ? `<section class="card mt-12">
        ${aprovados.map((d) => `<div class="item" data-id="${d.id}"><div class="grow" style="min-width:0"><div class="tit"><a href="#" data-emp="${d.empresa_id}">${esc(nomeEmp(d.empresa_id))}</a></div>
          <div class="sub">Opção ${esc(d.variante || 'A')}${d.angulo ? ` · ${esc(d.angulo)}` : ''}</div><div class="msg-sugerida mt-8">${esc(d.texto)}</div></div>
          <button class="btn xs fantasma" data-a="voltar">${icone('editar')}Trocar a opção</button></div>`).join('')}
        <p class="dim mt-12" style="font-size:13px">No máximo ${LIMITE_DIA} por dia, com 4 a 7 minutos entre uma e outra. Se já houver mensagens agendadas no mesmo dia, estas entram na fila depois delas.${restam ? ` Hoje ainda cabem ${restam}.` : ' O limite de hoje já foi: agende pra outro dia.'}</p>
        <div class="row wrap mt-12 gap-6">
          <input class="inp" type="datetime-local" data-quando value="${horarioSugerido()}" style="max-width:220px" aria-label="Data e hora do envio">
          <button class="btn prim" data-agendar>${icone('relogio')}Agendar ${aprovados.length > 1 ? `as ${aprovados.length}` : 'esta'}</button>
          <span class="dim" style="font-size:13px">ou</span>
          <button class="btn sm" data-lote ${restam ? '' : 'disabled'}>${icone('enviar')}Enviar agora</button>
        </div></section>` : `<div class="card mt-12"><p class="dim">Nenhuma mensagem escolhida ainda. Escolha uma opção de cada cliente abaixo e ela aparece aqui pra agendar ou enviar.</p></div>`}

      <h2 class="mt-24 secao-tit">Escolher a mensagem${porCliente.length ? ` · ${porCliente.length} cliente${porCliente.length > 1 ? 's' : ''}` : ''}</h2>
      <p class="dim" style="font-size:13px">Um cartão por cliente com as opções da mensagem inicial. A que você escolher sobe pra "Prontos pra sair" e as outras somem. O passo 2 fica na ficha do lead e na conversa dele.</p>
      ${porCliente.map(([id, ops]) => cartaoEscolha(id, ops)).join('') || `<div class="card mt-12">${vazio('editar', 'Nada pra escolher', 'Peça ao Claude: "prepara as mensagens dos qualificados". Elas aparecem aqui com a tabela de verificação.')}</div>`}

      ${por('erro').length ? `<h2 class="mt-24 secao-tit">Com erro</h2>${por('erro').map((d) => cartao(d)).join('')}` : ''}
      ${por('enviado').length ? `<h2 class="mt-24 secao-tit">Enviados</h2>${por('enviado').slice().reverse().map((d) => cartao(d)).join('')}` : ''}`;
  }

  // Revisor ao vivo: cada tecla no texto refaz o bloco de avisos daquele cartão
  v.addEventListener('input', debounce((ev) => {
    const ta = ev.target.closest?.('[data-texto]'); if (!ta) return;
    const card = ta.closest('[data-id]'); const d = card && lista.find((x) => x.id === card.dataset.id);
    const alvo = card && $('[data-revisao]', card);
    if (d && alvo) alvo.innerHTML = blocoRevisao(d, ta.value);
  }, 250));

  v.addEventListener('click', async (ev) => {
    const emp = ev.target.closest('[data-emp]');
    if (emp) { ev.preventDefault(); (await import('../ficha.js')).abrirFicha(emp.dataset.emp); return; }

    if (ev.target.closest('[data-parar]')) {
      if (!(await confirmar('Parar o lote?', 'O que ainda não saiu volta pra lista de aprovados.', { rotulo: 'Parar' }))) return;
      const { error } = await sb.from('disparos').update({ status: 'aprovado', agendado_para: null }).eq('status', 'agendado');
      if (error) toast(erroAmigavel(error), 'erro'); else toast('Lote parado');
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

    const b = ev.target.closest('[data-a]'); if (!b) return;
    if (b.dataset.a === 'descartar-lead') {
      const id = b.closest('[data-emp-card]').dataset.empCard;
      if (!(await confirmar('Tirar este lead do Disparos?', `As opções de mensagem inicial de ${nomeEmp(id)} são descartadas. A ficha continua como está.`, { rotulo: 'Tirar' }))) return;
      await sb.from('disparos').update({ status: 'cancelado', erro: 'Tirado do Disparos pelo Marcelo' }).eq('empresa_id', id).eq('passo', 1).eq('status', 'rascunho');
      toast('Lead tirado do Disparos'); return carregar();
    }
    if (b.dataset.a === 'descartar-fup') {
      const id = b.closest('[data-emp-card]').dataset.empCard;
      if (!(await confirmar('Não mandar este follow-up?', `As opções de follow-up de ${nomeEmp(id)} são descartadas. O agente não prepara outro pra esta mesma mensagem.`, { rotulo: 'Não mandar' }))) return;
      await sb.from('disparos').update({ status: 'cancelado', erro: 'Follow-up dispensado pelo Marcelo' }).eq('empresa_id', id).eq('tipo', 'followup').eq('status', 'rascunho');
      toast('Follow-up dispensado'); return carregar();
    }
    const card = b.closest('[data-id]'); const d = lista.find((x) => x.id === card.dataset.id);
    const a = b.dataset.a;
    if (a === 'programar') {
      const texto = $('[data-texto]', card).value.trim().replace(/\s*\n+\s*/g, ' ');
      if (!texto) { toast('Texto vazio', 'erro'); return; }
      const h = horaDoFollowup(d);
      if (!h) { toast('Não achei horário comercial nos próximos dias', 'erro'); return; }
      if (LIMITE_DIA - ocupadosNoDia(diaBahia(h)) <= 0) { toast(`O dia ${diaBahia(h).split('-').reverse().join('/')} já tem ${LIMITE_DIA} envios. Mande pela conversa ou programe outro dia.`, 'erro'); return; }
      const { error } = await sb.from('disparos').update({ texto, status: 'agendado', agendado_para: h.toISOString(), lote_id: crypto.randomUUID(), aprovado_por: quem(), aprovado_em: new Date().toISOString() }).eq('id', d.id).eq('status', 'rascunho');
      if (error) { toast(erroAmigavel(error), 'erro'); return; }
      const outras = lista.filter((x) => x.id !== d.id && x.empresa_id === d.empresa_id && x.tipo === 'followup' && x.status === 'rascunho').map((x) => x.id);
      if (outras.length) await sb.from('disparos').update({ status: 'cancelado', erro: `Descartada: você aprovou a abordagem ${d.variante || 'A'}` }).in('id', outras);
      toast(`Follow-up programado: sai ${quando(h)}`, 'info');
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
  const tiras = [ouvir('disparos', debounce(carregar, 400)), ouvir('farejador_status', debounce(desenhar, 800))];
  return () => tiras.forEach((f) => f());
}
