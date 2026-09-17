/* =============================================================================
   HOUND DOG — Agenda: semana, mês e lista, com follow-ups sugeridos pela cadência
   ============================================================================= */
import { sb, estado, ouvir } from '../sb.js';
import { $, $$, esc, hora, relativo, vazio, esqueleto, debounce, diasDesde } from '../ui.js';
import { icone } from '../icones.js';
import { agendar, TIPOS_AGENDA, linkGoogleAgenda } from '../acoes.js';
import { abrirFicha } from '../ficha.js';

const COR_TIPO = { r1: '#ff8a3d', r2: '#22d3ee', followup: '#a78bfa', ligacao: '#5aa2f0', visita: '#25d366', entrega: '#f4c430', interno: '#94a3b8', outro: '#94a3b8' };
const DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const nomeTipo = (t) => (TIPOS_AGENDA.find((x) => x[0] === t) || [, t])[1];

export default async function agenda(v, { params }) {
  let modo = params.modo || (innerWidth < 900 ? 'lista' : 'semana');
  let ref = new Date(); ref.setHours(0, 0, 0, 0);
  let itens = [];

  v.innerHTML = `
    <div class="cab"><div class="tt"><h1>Agenda</h1><p>Reuniões, follow-ups e entregas. Reunião marcada é o que move a esteira.</p></div>
      <div class="acoes"><button class="btn prim" data-novo>${icone('mais')}Novo compromisso</button></div></div>
    <div class="agenda-grade">
      <section class="card pad-0">
        <div class="agenda-topo"><button class="btn icone sm" data-nav="-1" aria-label="Anterior">${icone('cheve')}</button><button class="btn sm" data-hoje>Hoje</button><button class="btn icone sm" data-nav="1" aria-label="Próximo">${icone('chevd')}</button>
          <b class="agenda-titulo" data-titulo></b><span class="grow"></span>
          <div class="segmento">${[['semana', 'Semana'], ['mes', 'Mês'], ['lista', 'Lista']].map(([k, r]) => `<button data-modo="${k}" class="${modo === k ? 'on' : ''}">${r}</button>`).join('')}</div></div>
        <div data-cal>${esqueleto(6, 30)}</div>
      </section>
      <aside class="col gap-18">
        <section class="card"><div class="card-cab"><div class="icone-caixa sm violeta">${icone('relogio')}</div><div class="grow"><h3>Follow-ups sugeridos</h3><p class="dim" style="font-size:12.5px">Cadência da casa: dia +3, dia +7, depois para.</p></div></div><div data-sugeridos>${esqueleto(3)}</div></section>
        <section class="card"><div class="card-cab"><div class="icone-caixa sm">${icone('info')}</div><h3>Legenda</h3></div><div class="legenda">${TIPOS_AGENDA.filter(([t]) => t !== 'outro').map(([t, r]) => `<span><i style="background:${COR_TIPO[t]}"></i>${esc(r)}</span>`).join('')}</div></section>
      </aside>
    </div>`;

  function intervalo() {
    if (modo === 'semana') { const ini = new Date(ref); ini.setDate(ini.getDate() - ((ini.getDay() + 6) % 7)); const fim = new Date(ini); fim.setDate(fim.getDate() + 7); return [ini, fim]; }
    if (modo === 'mes') { const ini = new Date(ref.getFullYear(), ref.getMonth(), 1); ini.setDate(ini.getDate() - ((ini.getDay() + 6) % 7)); const fim = new Date(ini); fim.setDate(fim.getDate() + 42); return [ini, fim]; }
    const ini = new Date(ref); ini.setDate(ini.getDate() - 7); const fim = new Date(ref); fim.setDate(fim.getDate() + 45); return [ini, fim];
  }

  async function carregar() {
    if (!v.isConnected) return;
    const [ini, fim] = intervalo();
    const { data, error } = await sb.from('agenda').select('*').gte('inicio', ini.toISOString()).lt('inicio', fim.toISOString()).order('inicio');
    if (error) { $('[data-cal]', v).innerHTML = vazio('alerta', 'Não carregou', error.message); return; }
    itens = data || [];
    desenhar();
  }

  function evento(it, compacto = false) {
    const emp = estado.empresas.find((e) => e.id === it.empresa_id);
    const riscado = ['cancelado', 'nao_compareceu'].includes(it.status);
    return `<button class="evento ${riscado ? 'riscado' : ''} ${it.status === 'feito' ? 'feito' : ''}" data-ev="${it.id}" style="--cor:${COR_TIPO[it.tipo] || '#94a3b8'}" title="${esc(`${hora(it.inicio)} ${it.titulo}${emp ? ` · ${emp.nome}` : ''}`)}">
      <b>${hora(it.inicio)}</b> <span class="ellipsis">${esc(it.titulo)}</span>${!compacto && emp ? `<small class="ellipsis">${esc(emp.nome)}</small>` : ''}</button>`;
  }

  function desenhar() {
    const [ini] = intervalo();
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    const cal = $('[data-cal]', v);
    $$('[data-modo]', v).forEach((b) => b.classList.toggle('on', b.dataset.modo === modo));
    const mesNome = (d) => d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    if (modo === 'semana') {
      const fim = new Date(ini); fim.setDate(fim.getDate() + 6);
      $('[data-titulo]', v).textContent = `${ini.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} a ${fim.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}`;
      cal.innerHTML = `<div class="semana">${Array.from({ length: 7 }, (_, i) => {
        const d = new Date(ini); d.setDate(d.getDate() + i);
        const doDia = itens.filter((it) => new Date(it.inicio).toDateString() === d.toDateString());
        return `<div class="dia ${d.getTime() === hoje.getTime() ? 'hoje' : ''} ${d < hoje ? 'passado' : ''}" data-dia="${d.toISOString()}">
          <div class="dia-cab"><span>${DIAS[i]}</span><b>${d.getDate()}</b></div>
          <div class="dia-corpo">${doDia.map((it) => evento(it)).join('')}<button class="dia-add" data-add="${d.toISOString()}" aria-label="Agendar neste dia">${icone('mais')}</button></div></div>`;
      }).join('')}</div>`;
    } else if (modo === 'mes') {
      $('[data-titulo]', v).textContent = mesNome(ref);
      cal.innerHTML = `<div class="mes"><div class="mes-cab">${DIAS.map((d) => `<span>${d}</span>`).join('')}</div><div class="mes-grade">${Array.from({ length: 42 }, (_, i) => {
        const d = new Date(ini); d.setDate(d.getDate() + i);
        const doDia = itens.filter((it) => new Date(it.inicio).toDateString() === d.toDateString());
        return `<div class="mes-dia ${d.getMonth() !== ref.getMonth() ? 'fora' : ''} ${d.getTime() === hoje.getTime() ? 'hoje' : ''}" data-add="${d.toISOString()}"><span class="mes-num">${d.getDate()}</span>${doDia.slice(0, 3).map((it) => evento(it, true)).join('')}${doDia.length > 3 ? `<small class="dim">+${doDia.length - 3}</small>` : ''}</div>`;
      }).join('')}</div></div>`;
    } else {
      $('[data-titulo]', v).textContent = 'Próximos 45 dias';
      const grupos = {};
      for (const it of itens) { const k = new Date(it.inicio).toDateString(); (grupos[k] ||= []).push(it); }
      cal.innerHTML = Object.keys(grupos).length ? `<div class="agenda-lista">${Object.entries(grupos).map(([k, its]) => {
        const d = new Date(k);
        return `<div class="al-grupo"><div class="al-data ${d.getTime() === hoje.getTime() ? 'hoje' : ''}"><b>${d.getDate()}</b><span>${d.toLocaleDateString('pt-BR', { weekday: 'short', month: 'short' })}</span></div><div class="grow">${its.map((it) => {
          const emp = estado.empresas.find((e) => e.id === it.empresa_id);
          return `<div class="item clicavel" data-ev="${it.id}"><span class="ponto" style="background:${COR_TIPO[it.tipo]}"></span><div class="grow"><div class="tit">${hora(it.inicio)} · ${esc(it.titulo)}</div><div class="sub">${esc([nomeTipo(it.tipo), emp?.nome, it.local].filter(Boolean).join(' · '))}</div></div>
            <span class="selo ${it.status === 'feito' ? 'verde' : it.status === 'agendado' ? '' : 'cinza'}">${esc({ agendado: 'Agendado', feito: 'Feito', remarcado: 'Remarcado', cancelado: 'Cancelado', nao_compareceu: 'Não veio' }[it.status])}</span>
            <a class="btn icone sm fantasma" href="${linkGoogleAgenda(it)}" target="_blank" rel="noopener" aria-label="Abrir no Google Agenda" data-parar>${icone('link')}</a></div>`;
        }).join('')}</div></div>`;
      }).join('')}</div>` : vazio('agenda', 'Nada marcado', 'Marque a próxima reunião de diagnóstico.', `<button class="btn sm prim" data-add="${new Date().toISOString()}">Agendar</button>`);
    }
  }

  async function sugeridos() {
    if (!v.isConnected) return;
    const box = $('[data-sugeridos]', v);
    const { data: futuros } = await sb.from('agenda').select('empresa_id').gte('inicio', new Date().toISOString()).eq('status', 'agendado');
    const comAgenda = new Set((futuros || []).map((x) => x.empresa_id));
    const lst = estado.empresas.filter((e) => !e.arquivado && ['abordado', 'conversando', 'proposta', 'negociacao'].includes(e.estagio) && !comAgenda.has(e.id))
      .map((e) => ({ e, dias: diasDesde(e.ultimo_contato_em || e.estagio_desde) ?? 0 }))
      .filter((x) => x.dias >= 2).sort((a, b) => b.dias - a.dias).slice(0, 8);
    box.innerHTML = lst.length ? lst.map(({ e, dias }) => {
      const passo = e.estagio === 'abordado' ? (dias >= 7 ? 'último toque (dia +7)' : dias >= 3 ? 'follow-up 1 (dia +3)' : 'ainda cedo') : dias >= 3 ? 'retomar a conversa' : '';
      return `<div class="item"><div class="grow"><div class="tit ellipsis clicavel-txt" data-emp="${e.id}">${esc(e.nome)}</div><div class="sub">${dias} dias sem contato · ${esc(passo)}</div></div><button class="btn xs" data-seguir="${e.id}">${icone('agenda')}Agendar</button></div>`;
    }).join('') : vazio('checkc', 'Nenhum follow-up atrasado');
  }

  v.addEventListener('click', async (ev) => {
    if (ev.target.closest('[data-parar]')) return;
    const nav = ev.target.closest('[data-nav]');
    if (nav) { const n = Number(nav.dataset.nav); if (modo === 'mes') ref.setMonth(ref.getMonth() + n); else ref.setDate(ref.getDate() + n * 7); carregar(); return; }
    if (ev.target.closest('[data-hoje]')) { ref = new Date(); ref.setHours(0, 0, 0, 0); carregar(); return; }
    const m = ev.target.closest('[data-modo]'); if (m) { modo = m.dataset.modo; carregar(); return; }
    if (ev.target.closest('[data-novo]')) { agendar(); return; }
    const evn = ev.target.closest('[data-ev]'); if (evn) { const it = itens.find((x) => x.id === evn.dataset.ev); if (it) agendar({}, it); return; }
    const add = ev.target.closest('[data-add]'); if (add) { const d = new Date(add.dataset.add); d.setHours(10, 0, 0, 0); agendar({ inicio: d.toISOString() }); return; }
    const seg = ev.target.closest('[data-seguir]'); if (seg) { const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(10, 0, 0, 0); const e = estado.empresas.find((x) => x.id === seg.dataset.seguir); agendar({ empresa_id: e.id, tipo: 'followup', titulo: `Follow-up: ${e.nome}`, inicio: d.toISOString(), duracao: 15 }); return; }
    const emp = ev.target.closest('[data-emp]'); if (emp) abrirFicha(emp.dataset.emp);
  });

  await carregar();
  sugeridos();
  const tiras = [ouvir('agenda', debounce(() => { carregar(); sugeridos(); }, 500)), ouvir('empresas', debounce(sugeridos, 1500))];
  return () => tiras.forEach((f) => f());
}
