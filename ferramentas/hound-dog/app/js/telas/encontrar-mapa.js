/* =============================================================================
   HOUNDER — Encontrar clientes (mapa, Suas buscas e lista aberta)
   Estrutura do MazyOS Scraper com a identidade do Hounder, pedido do Marcelo em 09/11/2026.
   Quem vai para a esteira sai da lista.
   Cada item de "Suas buscas" é uma lista. Ponto no mapa aparece quando a lista traz a posição em `dados`.
   ============================================================================= */
import { sb, estado, ouvir, criarJob, farejadorOnline, acharDuplicada, criarEmpresa } from '../sb.js';
import { $, $$, esc, toast, confirmar, erroAmigavel, botaoCarregando, copiar, relativo, dataHora, telefoneBonito, debounce, baixarArquivo, paraCSV, modal, num } from '../ui.js';
import { icone, sparkClaude } from '../icones.js';
import { mapearColunas, linhaParaItem, pontuar, detectarRegulado } from '../score.js';
import { modalPlanilha } from './encontrar-planilha.js';

const FOCOS = [
  ['sem site ou site fora do ar', 'Sem site', 'Ou com o site fora do ar', true],
  ['com movimento real (avaliações no Google ou Instagram ativo)', 'Com movimento real', 'Avaliações ou Instagram ativo', true],
  ['que ainda não rodam anúncio na Meta', 'Sem anúncio', 'Ainda não anuncia na Meta', false],
  ['com WhatsApp de contato visível', 'WhatsApp visível', 'Celular publicado', false],
];
const STATUS_LISTA = { pronta: 'Concluída', processando: 'Buscando', erro: 'Erro' };
const STATUS_JOB = { fila: 'Na fila', processando: 'Buscando', erro: 'Erro' };
const ORIGEM = { spark: 'Spark', planilha: 'Planilha', network: 'Network', manual: 'Manual', maps: 'Google Maps', claude: 'Claude' };
const QTDS = { maps: [20, 60, 120, 200], claude: [10, 20, 30, 50], semgoogle: [10, 20, 30] };
const TIPOS_BUSCA = ['pesquisar_clientes', 'buscar_maps', 'buscar_sem_google'];
const SITE = { sem: 'Sem site', fora_do_ar: 'Fora do ar', ruim: 'Site fraco', desconhecido: 'A conferir' };
const SALVADOR = [-12.9714, -38.5014];
const POR_PAGINA = 50;

let leafletPronto;
function carregarLeaflet() {
  if (window.L) return Promise.resolve(window.L);
  if (leafletPronto) return leafletPronto;
  leafletPronto = new Promise((ok, falha) => {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
    document.head.appendChild(css);
    const js = document.createElement('script');
    js.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
    js.onload = () => ok(window.L);
    js.onerror = () => { leafletPronto = null; falha(new Error('O mapa não carregou')); };
    document.head.appendChild(js);
  });
  return leafletPronto;
}

const digitos = (t) => String(t || '').replace(/\D/g, '');
const ehCelular = (t) => { let d = digitos(t); if (d.startsWith('55')) d = d.slice(2); return d.length === 11 && d[2] === '9'; };
const zapDe = (i) => (i.whatsapp ? digitos(i.whatsapp) : ehCelular(i.telefone) ? digitos(i.telefone) : '');
const redeSocial = (s) => /instagram\.com|facebook\.com|wa\.me|linktr\.ee/i.test(s || '');
const dominio = (s) => String(s || '').replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
const semAcento = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const semSite = (i) => ['sem', 'fora_do_ar'].includes(i.site_status);
const soRede = (i) => redeSocial(i.site) || (semSite(i) && Boolean(i.instagram));
const temEmail = (i) => Boolean(i.dados?.email || i.dados?.emails || i.dados?.['E-mail']) || /@[\w-]+\.\w/.test(i.observacao || '');
function posicao(i) {
  const d = i.dados || {};
  const pega = (nomes) => { for (const k of Object.keys(d)) if (nomes.includes(semAcento(k))) return d[k]; return undefined; };
  const lat = Number(String(pega(['latitude', 'lat']) ?? '').replace(',', '.'));
  const lon = Number(String(pega(['longitude', 'lon', 'lng']) ?? '').replace(',', '.'));
  return lat && lon && Number.isFinite(lat) && Number.isFinite(lon) ? [lat, lon] : null;
}

const FILTROS = {
  todas: ['Todas', () => true],
  sem: ['Sem site', semSite],
  social: ['Só rede social', soRede],
  whats: ['WhatsApp', (i) => Boolean(zapDe(i))],
  email: ['Com e-mail', temEmail],
  alta: ['Alta oportunidade', (i) => i.prioridade === 'alta'],
  enriq: ['Enriquecidos', (i) => Boolean(i.enriquecido_em)],
};

const CNPJ_SELO = { aprovado: ['verde', 'CNPJ confere'], revisar: ['amarelo', 'CNPJ a revisar'], reprovado: ['vermelho', 'CNPJ com problema'], sem_cnpj: ['cinza', 'CNPJ não achado'] };
function seloCnpj(i) {
  const v = i.dados?.cnpj?.veredito;
  if (!v || !CNPJ_SELO[v]) return '';
  return ` <span class="selo ${CNPJ_SELO[v][0]}" title="${esc((i.dados.cnpj.motivos || []).join('; '))}">${CNPJ_SELO[v][1]}</span>`;
}

export function palco(v, { listaId = null, params = {} } = {}) {
  v.classList.add('mz-vista');
  const limpezas = [() => v.classList.remove('mz-vista')];
  const st = {
    motor: 'maps', qtd: 20, raio: 5, focos: new Set(FOCOS.filter((f) => f[3]).map((f) => f[0])), geo: null, vista: 'mapa', listas: [], jobs: [], esperando: null,
    lista: null, itens: [], triando: new Set(), triagemAgora: null, enriquecendo: [], ultimoEnriq: null,
    filtro: params.filtro === 'enriquecidos' ? 'enriq' : 'todas', texto: '', ordem: 'score', pagina: 0, sel: new Set(),
  };
  v.innerHTML = `
    <div class="mz" data-mz>
      <div class="mz-mapa" data-mapa></div>
      <aside class="mz-panel">
        <header class="mz-panel-head">
          <div class="mz-brand"><div class="mz-brand-ic">${icone('radar')}</div><div><div class="mz-brand-name">Encontrar clientes</div><div class="mz-brand-sub">Busca e leva pro funil</div></div></div>
          <div class="mz-seg"><button type="button" class="mz-on" data-vista="mapa">Mapa</button><button type="button" data-vista="board">Painel</button></div>
        </header>
        <div class="mz-panel-body">
          <form data-form novalidate>
            <section class="mz-box mz-search">
              <label class="mz-field">${icone('busca')}<input name="nicho" placeholder="O que você procura?" autocomplete="off" aria-label="O que você procura"><kbd>/</kbd></label>
              <label class="mz-field">${icone('mapa')}<input name="cidade" value="Salvador, BA" placeholder="Onde? Bairro, cidade" autocomplete="off" aria-label="Bairro ou cidade"></label>
            </section>
            <p class="mz-hint">Ex.: <b>pet shop</b> em <b>Pituba, Salvador</b>. Várias buscas? Separe por vírgula.</p>
            <section class="mz-box mz-settings">
              <div class="mz-row mz-col"><div><div class="mz-row-title">Motor</div><div class="mz-row-desc" data-motor-desc>Lê o Google Maps, sem gastar Claude</div></div>
                <div class="mz-chips mz-qty mz-motores" data-motores><button type="button" class="mz-on" data-motor-opc="maps">Google Maps</button><button type="button" data-motor-opc="claude">Claude</button><button type="button" data-motor-opc="semgoogle" title="Acha quem não tem perfil no Google, para vender o Google Meu Negócio">Sem Google</button></div></div>
              <div class="mz-row"><div><div class="mz-row-title">Quantidade</div><div class="mz-row-desc" data-qtd-desc>Aproximada, leva 1 a 5 minutos</div></div>
                <div class="mz-chips mz-qty" data-qtds></div></div>
              <div class="mz-row mz-col"><div class="mz-row-line"><div><div class="mz-row-title">Raio</div><div class="mz-row-desc">Área da busca em volta do local</div></div><div class="mz-row-value" data-raio-val>5 km</div></div>
                <input type="range" min="1" max="30" step="1" value="5" data-raio aria-label="Raio da busca em quilômetros"></div>
              ${FOCOS.map(([f, r, d, on]) => `<div class="mz-row" data-so-claude hidden><div><div class="mz-row-title">${esc(r)}</div><div class="mz-row-desc">${esc(d)}</div></div><button type="button" class="mz-toggle" data-foco="${esc(f)}" aria-pressed="${on}" aria-label="${esc(r)}"><span></span></button></div>`).join('')}
            </section>
            <input class="mz-obs" data-so-web hidden name="observacao" placeholder="Algo mais? Ex.: evitar franquias" autocomplete="off" aria-label="Observação">
            <button class="mz-primary" type="submit" data-ir>Buscar empresas</button>
            <div class="mz-error" data-erro></div>
          </form>
          <section class="mz-jobs">
            <div class="mz-jobs-head"><h2>Suas buscas</h2><button type="button" class="mz-ghost mz-enviar" data-enviar>Enviar planilha</button></div>
            <div data-buscas></div>
          </section>
        </div>
        <footer class="mz-panel-foot mz-foot"><span class="mz-engine" data-motor></span><a href="#/mercado?nova=1">Pesquisar o nicho antes</a></footer>
      </aside>
      <div class="mz-livebar" data-vivo hidden><span class="mz-live-dot" data-ponto></span><span data-vivo-txt></span><button type="button" class="mz-ghost" data-ver>Ver empresas</button></div>
      <main class="mz-board" data-board hidden>
        <div class="mz-board-empty" data-vazio><p>Escolha uma busca em <b>Suas buscas</b> para ver as empresas aqui.</p></div>
        <div class="mz-board-main" data-cheio hidden></div>
      </main>
    </div>`;

  const mz = $('[data-mz]', v);
  const form = $('[data-form]', v);
  let mapa = null, camada = null, circulo = null, poll = null;

  /* ---------- Mapa ---------- */
  carregarLeaflet().then((L) => {
    if (!v.isConnected || !mz.isConnected) return;
    mapa = L.map($('[data-mapa]', v), { zoomControl: false }).setView(SALVADOR, 12);
    L.control.zoom({ position: 'bottomright' }).addTo(mapa);
    mapa.attributionControl.setPrefix('Leaflet');
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, subdomains: 'abc', attribution: '&copy; OpenStreetMap' }).addTo(mapa);
    camada = L.layerGroup().addTo(mapa);
    limpezas.push(() => { mapa?.remove(); mapa = null; });
    desenharCirculo();
    pontos();
  }).catch((e) => toast(erroAmigavel(e), 'erro'));

  const zoomDo = (km) => (km <= 2 ? 14 : km <= 5 ? 13 : km <= 10 ? 12 : km <= 20 ? 11 : 10);
  const offset = () => (window.innerWidth > 900 ? [420, 30] : [20, 20]);
  function desenharCirculo() {
    if (!mapa) return;
    const centro = st.geo || SALVADOR;
    circulo?.remove();
    circulo = window.L.circle(centro, { radius: st.raio * 1000, color: '#ff7a1a', weight: 1.5, dashArray: '5 6', fill: true, fillColor: '#ff7a1a', fillOpacity: 0.05 }).addTo(mapa);
    mapa.setView(centro, zoomDo(st.raio));
  }
  const buscarLocal = debounce(async () => {
    const q = form.cidade.value.trim();
    if (q.length < 3) return;
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&q=${encodeURIComponent(q)}`);
      const [g] = await r.json();
      if (!g || !mz.isConnected) return;
      st.geo = [Number(g.lat), Number(g.lon)];
      desenharCirculo();
    } catch { /* o círculo só orienta: sem ele a busca segue igual */ }
  }, 800);
  form.cidade.addEventListener('input', buscarLocal);
  buscarLocal();

  function pontos() {
    if (!camada || !window.L) { vivo(0); return; }
    camada.clearLayers();
    const marcas = st.itens.filter((i) => !i.descartado && !i.empresa_id).map((i) => [i, posicao(i)]).filter(([, p]) => p);
    for (const [i, p] of marcas) {
      const zap = zapDe(i);
      window.L.marker(p, { icon: window.L.divIcon({ className: 'mz-pin', iconSize: [14, 14] }) }).addTo(camada)
        .bindPopup(`<div class="mz-pop-title">${esc(i.nome)}</div><div class="mz-pop-cat">${esc(i.categoria || '')}</div>${i.google_nota != null ? `<div class="mz-pop-rate"><b>${String(i.google_nota).replace('.', ',')}</b>${i.google_avaliacoes ? ` · ${num(i.google_avaliacoes)} avaliações` : ''}</div>` : ''}${zap || i.telefone ? `<div class="mz-pop-links">${zap ? `<a href="https://wa.me/${zap}" target="_blank" rel="noopener">WhatsApp ${esc(telefoneBonito(zap))}</a>` : `<span>${esc(telefoneBonito(i.telefone))}</span>`}</div>` : ''}`);
    }
    if (marcas.length) mapa.fitBounds(marcas.map(([, p]) => p), { paddingTopLeft: offset(), paddingBottomRight: [40, 40], maxZoom: 15 });
    vivo(marcas.length);
  }
  function vivo(comPonto) {
    const barra = $('[data-vivo]', v);
    if (!barra) return;
    if (!st.lista || st.vista !== 'mapa') { barra.hidden = true; return; }
    barra.hidden = false;
    const n = st.itens.filter((i) => !i.descartado && !i.empresa_id).length;
    const rodando = st.lista.status === 'processando';
    $('[data-ponto]', v).className = `mz-live-dot${rodando ? ' mz-run' : ''}`;
    $('[data-vivo-txt]', v).innerHTML = rodando ? `Buscando: <b>${n}</b> empresas até agora` : `<b>${n}</b> empresas em ${esc(st.lista.nome)}${n && !comPonto ? ' · sem posição no mapa' : ''}`;
  }

  /* ---------- Formulário ---------- */
  function desenharMotor() {
    const caixa = $('[data-qtds]', v);
    if (!QTDS[st.motor].includes(st.qtd)) st.qtd = 20;
    caixa.innerHTML = QTDS[st.motor].map((q) => `<button type="button" class="${q === st.qtd ? 'mz-on' : ''}" data-q="${q}">${q === 200 ? '200+' : q}</button>`).join('');
    $$('[data-q]', caixa).forEach((b) => (b.onclick = () => { st.qtd = Number(b.dataset.q); desenharMotor(); }));
    $$('[data-motor-opc]', v).forEach((b) => b.classList.toggle('mz-on', b.dataset.motorOpc === st.motor));
    $$('[data-so-claude]', v).forEach((x) => { x.hidden = st.motor !== 'claude'; });
    $$('[data-so-web]', v).forEach((x) => { x.hidden = st.motor === 'maps'; });
    $('[data-motor-desc]', v).textContent = { maps: 'Lê o Google Maps, sem gastar Claude', claude: 'O Claude pesquisa na web e confere Instagram', semgoogle: 'Quem não tem perfil no Google: o Claude acha no Instagram e confere no Maps, um por um' }[st.motor];
    $('[data-qtd-desc]', v).textContent = { maps: 'Aproximada, leva 1 a 5 minutos', claude: 'Leva de 3 a 10 minutos', semgoogle: 'Leva de 10 a 30 minutos' }[st.motor];
  }
  $$('[data-motor-opc]', v).forEach((b) => (b.onclick = () => { st.motor = b.dataset.motorOpc; desenharMotor(); }));
  desenharMotor();
  const raio = $('[data-raio]', v);
  raio.oninput = () => { st.raio = Number(raio.value); $('[data-raio-val]', v).textContent = `${st.raio} km`; };
  raio.onchange = desenharCirculo;
  $$('[data-foco]', v).forEach((b) => (b.onclick = () => {
    const f = b.dataset.foco, on = !st.focos.has(f);
    on ? st.focos.add(f) : st.focos.delete(f);
    b.setAttribute('aria-pressed', String(on));
  }));
  function trocarVista(nova) {
    st.vista = nova;
    $$('[data-vista]', v).forEach((x) => x.classList.toggle('mz-on', x.dataset.vista === nova));
    $('[data-board]', v).hidden = nova !== 'board';
    mz.classList.toggle('mz-no-board', nova === 'board');
    if (nova === 'mapa') setTimeout(() => { mapa?.invalidateSize(); pontos(); }, 40);
    else vivo(0);
  }
  $$('[data-vista]', v).forEach((b) => (b.onclick = () => trocarVista(b.dataset.vista)));
  $('[data-ver]', v).onclick = () => trocarVista('board');
  $('[data-enviar]', v).onclick = () => modalPlanilha(async (id) => { await carregarBuscas(); abrir(id, 'board'); });
  const atalho = (e) => {
    if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || '')) { e.preventDefault(); form.nicho.focus(); }
  };
  document.addEventListener('keydown', atalho);
  limpezas.push(() => document.removeEventListener('keydown', atalho));
  const motor = () => { const m = $('[data-motor]', v); if (m) { const on = farejadorOnline(); m.classList.toggle('mz-on', on); m.innerHTML = `<i></i>${on ? 'Farejador online' : 'Farejador offline'}`; } };
  motor();

  form.onsubmit = async (e) => {
    e.preventDefault();
    const termos = form.nicho.value.split(',').map((t) => t.trim()).filter(Boolean);
    const cidade = form.cidade.value.trim();
    const erro = $('[data-erro]', v);
    erro.textContent = '';
    if (!termos.length || !cidade) { erro.textContent = 'Diga o que procura e onde.'; form.nicho.focus(); return; }
    const observacao = [form.observacao.value.trim(), `Priorize negócios até ${st.raio} km de ${cidade}.`].filter(Boolean).join(' ');
    const btn = $('[data-ir]', v);
    btn.disabled = true;
    try {
      let ultimo = null;
      if (st.motor === 'maps') {
        const [lat, lon] = st.geo || [null, null];
        ultimo = await criarJob('buscar_maps', { nicho: termos.join(', '), cidade, quantidade: st.qtd, raio: st.raio, lat, lon }, {}, 4);
      } else if (st.motor === 'semgoogle') {
        for (const nicho of termos) ultimo = await criarJob('buscar_sem_google', { nicho, cidade, quantidade: st.qtd, observacao }, {}, 4);
      } else {
        for (const nicho of termos) ultimo = await criarJob('pesquisar_clientes', { nicho, cidade, quantidade: st.qtd, foco: [...st.focos], observacao }, {}, 4);
      }
      toast(st.motor !== 'maps' && termos.length > 1 ? `${termos.length} buscas na fila` : 'Busca na fila', 'info');
      form.observacao.value = '';
      st.esperando = ultimo?.id || null;
      await carregarBuscas();
    } catch (err) { erro.textContent = erroAmigavel(err); }
    btn.disabled = false;
  };

  /* ---------- Suas buscas ---------- */
  async function carregarBuscas() {
    if (!mz.isConnected) return;
    const [{ data: listas, error }, { data: jobs }] = await Promise.all([
      sb.from('listas').select('*').order('criado_em', { ascending: false }),
      sb.from('jobs').select('id,tipo,status,entrada,saida,erro,progresso,criado_em').in('tipo', TIPOS_BUSCA).in('status', ['fila', 'processando', 'erro']).order('criado_em', { ascending: false }).limit(12),
    ]);
    const box = $('[data-buscas]', v);
    if (!box) return;
    if (error) { box.innerHTML = `<div class="mz-jobs-empty">${esc(erroAmigavel(error))}</div>`; return; }
    st.listas = listas || [];
    const restam = Object.fromEntries(await Promise.all(st.listas.map(async (l) => {
      const { count } = await sb.from('lista_itens').select('id', { count: 'exact', head: true }).eq('lista_id', l.id).eq('descartado', false).is('empresa_id', null);
      return [l.id, count ?? l.total ?? 0];
    })));
    const comLista = new Set(st.listas.map((l) => l.id));
    st.jobs = (jobs || []).filter((j) => !comLista.has(j.saida?.lista_id));
    motor();
    box.innerHTML = [
      ...st.jobs.map((j) => `<div class="mz-job"><div class="mz-job-icon">${j.status === 'erro' ? icone('alerta') : j.tipo === 'buscar_maps' ? icone('mapa') : sparkClaude(16)}</div>
        <div class="mz-job-body"><div class="mz-job-name">${esc(j.entrada?.nicho || 'Busca')} · ${esc(String(j.entrada?.cidade || '').split(',')[0])}</div>
        <div class="mz-job-meta ${j.status === 'erro' ? 'mz-job-erro' : ''}"><span class="${j.status === 'erro' ? '' : 'mz-run'}">${STATUS_JOB[j.status]}</span> · ${esc((j.erro || relativo(j.criado_em)).slice(0, 70))}</div></div>
        <button type="button" class="mz-job-del" data-cancelar="${j.id}" aria-label="${j.status === 'erro' ? 'Remover' : 'Cancelar'}">${icone('x')}</button></div>`),
      ...st.listas.map((l) => {
        const origem = ORIGEM[l.origem];
        const rodando = l.status === 'processando';
        return `<div class="mz-job ${st.lista?.id === l.id ? 'mz-sel' : ''}" role="button" tabindex="0" data-lista="${l.id}">
          <div class="mz-job-icon">${rodando ? (l.origem === 'maps' ? icone('mapa') : sparkClaude(16)) : icone(l.origem === 'maps' ? 'mapa' : 'lista')}</div>
          <div class="mz-job-body"><div class="mz-job-name">${esc(l.nome)}</div>
          <div class="mz-job-meta">${origem ? `${origem} · ` : ''}${rodando ? '<span class="mz-run">Buscando</span>' : esc(STATUS_LISTA[l.status] || l.status)} · <b>${num(restam[l.id])}</b> empresas · ${esc(dataCurta(l.criado_em))}</div></div>
          <button type="button" class="mz-job-del" data-apagar="${l.id}" aria-label="Excluir ${esc(l.nome)}">${icone('lixo')}</button></div>`;
      }),
    ].join('') || '<div class="mz-jobs-empty">Nenhuma busca ainda. A primeira aparece aqui.</div>';
    $$('[data-lista]', box).forEach((el) => {
      el.onclick = (ev) => { if (!ev.target.closest('[data-apagar]')) abrir(el.dataset.lista, 'board'); };
      el.onkeydown = (ev) => { if (ev.key === 'Enter') abrir(el.dataset.lista, 'board'); };
    });
    $$('[data-apagar]', box).forEach((b) => (b.onclick = () => apagarLista(st.listas.find((l) => l.id === b.dataset.apagar))));
    $$('[data-cancelar]', box).forEach((b) => (b.onclick = async () => {
      const { error: er } = await sb.from('jobs').update({ status: 'cancelado' }).eq('id', b.dataset.cancelar);
      if (er) toast(erroAmigavel(er), 'erro'); else carregarBuscas();
    }));
    if (st.esperando) {
      const { data: j } = await sb.from('jobs').select('saida').eq('id', st.esperando).maybeSingle();
      if (j?.saida?.lista_id && comLista.has(j.saida.lista_id)) { st.esperando = null; abrir(j.saida.lista_id, 'mapa'); }
    }
  }
  const dataCurta = (d) => { try { return dataHora(d); } catch { return relativo(d); } };

  async function apagarLista(l) {
    if (!l) return;
    const ok = await confirmar(`Apagar "${l.nome}"?`, `${num(l.total || 0)} empresas somem daqui. Quem já virou ficha continua no CRM. Não dá para desfazer.`, { rotulo: 'Apagar', perigo: true });
    if (!ok) return;
    const { error } = await sb.from('listas').delete().eq('id', l.id);
    if (error) { toast(erroAmigavel(error), 'erro'); return; }
    toast('Busca apagada');
    if (st.lista?.id === l.id) fecharLista();
    carregarBuscas();
  }
  function fecharLista() {
    st.lista = null; st.itens = []; clearInterval(poll); poll = null;
    history.replaceState(null, '', '#/encontrar');
    $('[data-vazio]', v).hidden = false;
    $('[data-cheio]', v).hidden = true;
    pontos();
  }

  /* ---------- Lista aberta ---------- */
  async function abrir(id, vista) {
    st.sel.clear(); st.pagina = 0; st.texto = '';
    const trocou = st.lista?.id !== id;
    if (st.lista?.id !== id && params.filtro !== 'enriquecidos') st.filtro = 'todas';
    history.replaceState(null, '', `#/encontrar/lista/${id}`);
    const ok = await carregarLista(id);
    if (!ok) { toast('Essa busca não existe mais', 'erro'); return; }
    $$('[data-lista]', v).forEach((x) => x.classList.toggle('mz-sel', x.dataset.lista === id));
    if (vista) trocarVista(vista);
    desenhar();
    pontos();
    // Celular: a lista fica embaixo da busca; rola até ela ao abrir (11/11/2026)
    if (trocou && innerWidth <= 900) requestAnimationFrame(() => $('[data-board]', v)?.scrollIntoView({ block: 'start' }));
  }
  async function carregarLista(id) {
    const [{ data: l, error: e1 }, { data: its, error: e2 }, { data: jt }, { data: je }, { data: jc }] = await Promise.all([
      sb.from('listas').select('*').eq('id', id).maybeSingle(),
      sb.from('lista_itens').select('*').eq('lista_id', id).order('score', { ascending: false }).limit(5000),
      sb.from('jobs').select('entrada,status,progresso').in('tipo', ['triar_lista', 'montar_lote']).eq('lista_id', id).in('status', ['fila', 'processando']),
      sb.from('jobs').select('id,status,progresso,entrada,saida,erro,criado_em,concluido_em').eq('tipo', 'enriquecer_lista').eq('lista_id', id).order('criado_em', { ascending: false }).limit(6),
      sb.from('jobs').select('id,status,progresso,entrada,saida,erro,concluido_em').eq('tipo', 'conferir_cnpj').eq('lista_id', id).order('criado_em', { ascending: false }).limit(3),
    ]);
    if (e1 || e2) { toast(erroAmigavel(e1 || e2), 'erro'); return false; }
    if (!l) return false;
    st.lista = l; st.itens = its || [];
    st.triando = new Set((jt || []).flatMap((j) => j.entrada?.item_ids || []));
    st.triagemAgora = (jt || []).find((j) => j.status === 'processando')?.progresso || null;
    st.enriquecendo = (je || []).filter((j) => ['fila', 'processando'].includes(j.status));
    st.cnpjAgora = (jc || []).find((j) => ['fila', 'processando'].includes(j.status)) || null;
    st.cnpjUltimo = (jc || []).find((j) => ['concluido', 'erro'].includes(j.status) && Date.now() - new Date(j.concluido_em) < 2 * 864e5) || null;
    st.ultimoEnriq = (je || []).find((j) => ['concluido', 'erro'].includes(j.status) && Date.now() - new Date(j.concluido_em || j.criado_em) < 2 * 864e5) || null;
    clearInterval(poll); poll = null;
    if (l.status === 'processando') poll = setInterval(recarregar, 5000);
    return true;
  }
  const recarregar = debounce(async () => { if (st.lista && mz.isConnected && await carregarLista(st.lista.id)) { desenhar(); pontos(); } }, 600);
  limpezas.push(() => clearInterval(poll));

  const ativos = () => st.itens.filter((i) => !i.descartado && !i.empresa_id);
  // Enriquecer e triagem nasceram para corrigir a planilha do Spark; a busca do Maps e a do Claude já trazem esses dados
  const daPlanilha = () => ['spark', 'planilha', 'network', 'manual'].includes(st.lista?.origem);
  const naEsteira = () => st.itens.filter((i) => !i.descartado && i.empresa_id);
  function filtrados() {
    const q = semAcento(st.texto);
    const base = st.filtro === 'desc' ? st.itens.filter((i) => i.descartado) : st.filtro === 'esteira' ? naEsteira() : ativos().filter(FILTROS[st.filtro][1]);
    const cmp = { score: (a, b) => b.score - a.score, nome: (a, b) => a.nome.localeCompare(b.nome), avaliacoes: (a, b) => (b.google_avaliacoes || 0) - (a.google_avaliacoes || 0), nota: (a, b) => (b.google_nota || 0) - (a.google_nota || 0) }[st.ordem];
    return base.filter((i) => !q || semAcento(`${i.nome} ${i.categoria} ${i.bairro} ${i.cidade} ${i.instagram}`).includes(q)).sort(cmp);
  }

  function linha(i) {
    const zap = zapDe(i), reg = detectarRegulado(`${i.categoria || ''} ${i.nome}`);
    const site = i.site && i.site_status !== 'sem'
      ? `<a class="mz-t-site" href="${esc(/^https?:/.test(i.site) ? i.site : `https://${i.site}`)}" target="_blank" rel="noopener">${esc(dominio(i.site))}</a>`
      : i.instagram ? `<a class="mz-t-site" href="https://instagram.com/${esc(i.instagram)}" target="_blank" rel="noopener">@${esc(i.instagram)}</a>` : `<span class="selo ${['sem', 'fora_do_ar'].includes(i.site_status) ? 'vermelho' : i.site_status === 'ruim' ? 'amarelo' : 'cinza'}">${SITE[i.site_status] || 'Sem site'}</span>`;
    return `<tr class="${st.sel.has(i.id) ? 'mz-marcado' : ''} ${i.descartado ? 'mz-descartado' : ''}" data-item="${i.id}">
      <td class="mz-check"><input type="checkbox" data-sel="${i.id}" ${st.sel.has(i.id) ? 'checked' : ''} aria-label="Selecionar ${esc(i.nome)}"></td>
      <td><div class="mz-t-name">${esc(i.nome)}</div><div class="mz-t-cat">${esc(i.categoria || '')}${i.bairro ? `<span class="mz-bairro-inline"> · ${esc(i.bairro)}</span>` : ''}${reg ? ` · <span class="mz-reg">${esc(reg)}</span>` : ''}</div>${i.enriquecido_em && i.observacao ? `<div class="mz-opo">${esc(i.observacao)}</div>` : ''}${seloCnpj(i)}</td>
      <td>${esc(i.bairro || i.cidade || '—')}</td>
      <td class="mz-num">${i.google_nota != null ? `${String(i.google_nota).replace('.', ',')}${i.google_avaliacoes ? ` <span class="mz-t-cat">(${num(i.google_avaliacoes)})</span>` : ''}` : '—'}</td>
      <td class="mz-mono">${zap ? `<a href="https://wa.me/${zap}" target="_blank" rel="noopener">${esc(telefoneBonito(zap))}</a><span class="mz-wa">WA</span>` : i.telefone ? esc(telefoneBonito(i.telefone)) : '—'}</td>
      <td>${site}</td>
      <td class="mz-num"><span class="score sm ${i.prioridade}">${i.score}</span> ${i.empresa_id ? `<button type="button" class="btn xs verde" data-ficha="${i.empresa_id}">No CRM</button>` : i.descartado ? `<button type="button" class="btn xs" data-restaurar="${i.id}">Restaurar</button>` : `<button type="button" class="btn xs prim" data-importar="${i.id}">Pro funil</button>`}<button type="button" class="mz-mais" data-menu-item="${i.id}" aria-label="Mais ações">${icone('pontos')}</button></td>
    </tr>`;
  }

  function desenhar() {
    const caixa = $('[data-cheio]', v);
    if (!st.lista || !caixa) return;
    $('[data-vazio]', v).hidden = true;
    caixa.hidden = false;
    const at = ativos();
    const lst = filtrados(), total = lst.length;
    st.pagina = Math.min(st.pagina, Math.max(0, Math.ceil(total / POR_PAGINA) - 1));
    const pag = lst.slice(st.pagina * POR_PAGINA, (st.pagina + 1) * POR_PAGINA);
    const notas = at.map((i) => Number(i.google_nota)).filter((n) => n > 0);
    const media = notas.length ? (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(1).replace('.', ',') : '—';
    const pendentes = at.filter((i) => !i.empresa_id && !st.triando.has(i.id)).length;
    const descartados = st.itens.filter((i) => i.descartado).length;
    const emFunil = naEsteira().length;
    const enriqAgora = st.enriquecendo.reduce((a, j) => a + (j.entrada?.item_ids?.length || 0), 0);
    const proc = st.enriquecendo.find((j) => j.status === 'processando');
    const l = st.lista;
    const selNaTela = pag.filter((i) => st.sel.has(i.id)).length;
    caixa.innerHTML = `
      <div class="mz-board-head">
        <div><h1>${esc(l.nome)}</h1><div class="mz-board-meta">${esc([l.nicho, l.cidade].filter(Boolean).join(' · ') || ORIGEM[l.origem] || '')} · ${esc(dataCurta(l.criado_em))}${l.observacao ? ` · ${esc(l.observacao.slice(0, 90))}` : ''}</div></div>
        <div class="mz-board-actions">
          ${pendentes && daPlanilha() ? '<button type="button" class="mz-ghost" data-triagem title="Para planilha: o Claude confere se cada empresa existe e se o dado está certo; quem passa vai pro Novo, sem mensagem">Fazer a triagem</button>' : ''}
          ${pendentes ? '<button type="button" class="mz-primary mz-small" data-lote title="Você escolhe o filtro; o Hounder confere o CNPJ; o Claude escolhe as melhores e escreve a primeira mensagem de cada uma">Montar lote</button>' : ''}
          <button type="button" class="mz-mais" data-menu-lista aria-label="Mais ações da busca">${icone('pontos')}</button>
        </div>
      </div>
      ${l.status === 'processando' ? '<div class="mz-aviso"><b>O Claude ainda está buscando.</b> As empresas aparecem aqui conforme ele encontra.</div>' : ''}
      ${enriqAgora ? `<div class="mz-aviso"><b>Enriquecendo ${enriqAgora} ${enriqAgora > 1 ? 'empresas' : 'empresa'}.</b> <span data-enriq-prog>${proc?.progresso ? esc(proc.progresso) : farejadorOnline() ? 'Começa em instantes.' : 'O Farejador está desligado: começa quando ele ligar.'}</span></div>` : ''}
      ${!enriqAgora && st.ultimoEnriq ? (st.ultimoEnriq.status === 'erro' ? `<div class="mz-aviso mz-erro"><b>O último enriquecimento falhou.</b> ${esc((st.ultimoEnriq.erro || '').slice(0, 140))}</div>` : `<div class="mz-aviso"><b>Enriquecimento pronto ${relativo(st.ultimoEnriq.concluido_em)}:</b> ${st.ultimoEnriq.saida?.atualizados ?? '?'} de ${st.ultimoEnriq.saida?.pedidos ?? '?'} com dado novo.${st.filtro !== 'enriq' ? ' <button type="button" class="btn xs" data-f="enriq">Ver</button>' : ''}</div>`) : ''}
      ${st.cnpjAgora ? `<div class="mz-aviso"><b>Conferindo CNPJ de ${st.cnpjAgora.entrada?.item_ids?.length || '?'} empresas.</b> <span data-cnpj-prog>${esc(st.cnpjAgora.progresso || (farejadorOnline() ? 'Começa em instantes.' : 'O Farejador está desligado.'))}</span></div>` : st.cnpjUltimo ? (st.cnpjUltimo.status === 'erro' ? `<div class="mz-aviso mz-erro"><b>A conferência de CNPJ falhou.</b> ${esc((st.cnpjUltimo.erro || '').slice(0, 140))}</div>` : `<div class="mz-aviso"><b>CNPJ conferido ${relativo(st.cnpjUltimo.concluido_em)}:</b> ${st.cnpjUltimo.saida?.aprovado || 0} conferem, ${st.cnpjUltimo.saida?.revisar || 0} para revisar, ${st.cnpjUltimo.saida?.reprovado || 0} com problema, ${st.cnpjUltimo.saida?.sem_cnpj || 0} não achados.${st.cnpjUltimo.saida?.aviso ? ' A base da Receita respondeu só em parte.' : ''}</div>`) : ''}
      ${st.triando.size ? `<div class="mz-aviso"><b>Triagem na fila: ${st.triando.size} ${st.triando.size > 1 ? 'empresas' : 'empresa'}.</b> ${st.triagemAgora ? esc(st.triagemAgora) : 'Começa quando o navegador do Farejador estiver livre.'}</div>` : ''}
      <div class="mz-stats">${[[at.length, 'Empresas'], [at.filter((i) => zapDe(i)).length, 'Com WhatsApp'], [at.filter(semSite).length, 'Sem site'], [at.filter(soRede).length, 'Só rede social'], [media, 'Nota média']].map(([n, r]) => `<div class="mz-stat"><div class="mz-stat-n">${esc(String(n))}</div><div class="mz-stat-l">${esc(r)}</div></div>`).join('')}</div>
      <div class="mz-board-tools">
        <div class="mz-chips">${Object.entries(FILTROS).filter(([k]) => k !== 'enriq' || at.some((i) => i.enriquecido_em)).map(([k, [r, f]]) => `<button type="button" class="${st.filtro === k ? 'mz-on' : ''}" data-f="${k}">${esc(r)} <small>${at.filter(f).length}</small></button>`).join('')}${emFunil ? `<button type="button" class="${st.filtro === 'esteira' ? 'mz-on' : ''}" data-f="esteira">Na esteira <small>${emFunil}</small></button>` : ''}${descartados ? `<button type="button" class="${st.filtro === 'desc' ? 'mz-on' : ''}" data-f="desc">Descartados <small>${descartados}</small></button>` : ''}</div>
        <div class="mz-tools-dir">
          <select class="mz-select-borda" data-ordem aria-label="Ordenar">${[['score', 'Maior score'], ['nota', 'Maior nota'], ['avaliacoes', 'Mais avaliações'], ['nome', 'Nome']].map(([k, r]) => `<option value="${k}"${st.ordem === k ? ' selected' : ''}>${r}</option>`).join('')}</select>
          <label class="mz-field mz-slim">${icone('busca')}<input data-texto value="${esc(st.texto)}" placeholder="Filtrar por nome ou bairro" aria-label="Filtrar por nome ou bairro"></label>
        </div>
      </div>
      ${st.sel.size ? `<div class="mz-bulk"><b>${st.sel.size} ${st.sel.size > 1 ? 'selecionadas' : 'selecionada'}</b><button type="button" class="btn sm prim" data-bulk="importar">Pro funil</button>${daPlanilha() ? '<button type="button" class="btn sm claude" data-bulk="enriquecer">Enriquecer</button>' : ''}<button type="button" class="btn sm" data-bulk="cnpj">Conferir CNPJ</button><button type="button" class="btn sm" data-bulk="descartar">Descartar</button><button type="button" class="btn sm fantasma" data-bulk="limpar">Limpar</button></div>` : ''}
      <div class="mz-table-wrap"><table><thead><tr><th class="mz-check"><input type="checkbox" data-todos aria-label="Selecionar página" ${pag.length && selNaTela === pag.length ? 'checked' : ''}></th><th>Empresa</th><th>Bairro</th><th class="mz-num">Nota</th><th>Telefone</th><th>Site</th><th class="mz-num">Score</th></tr></thead>
        <tbody>${pag.map(linha).join('') || `<tr><td colspan="7" class="mz-t-empty">${l.status === 'processando' ? 'Buscando.' : 'Nada neste filtro.'}</td></tr>`}</tbody></table>
        ${total > POR_PAGINA ? `<div class="mz-pag"><span>${st.pagina * POR_PAGINA + 1} a ${Math.min(total, (st.pagina + 1) * POR_PAGINA)} de ${num(total)}</span><span><button type="button" class="mz-ghost" data-pag="-1" ${st.pagina === 0 ? 'disabled' : ''}>Anterior</button> <button type="button" class="mz-ghost" data-pag="1" ${(st.pagina + 1) * POR_PAGINA >= total ? 'disabled' : ''}>Próxima</button></span></div>` : ''}
      </div>`;
    ligar(caixa, pag);
  }

  function ligar(c, pag) {
    $$('[data-f]', c).forEach((b) => (b.onclick = () => { st.filtro = b.dataset.f; st.pagina = 0; desenhar(); }));
    $('[data-ordem]', c).onchange = (e) => { st.ordem = e.target.value; desenhar(); };
    const txt = $('[data-texto]', c);
    txt.oninput = debounce(() => { st.texto = txt.value; st.pagina = 0; desenhar(); const n = $('[data-texto]', c); n.focus(); n.setSelectionRange(n.value.length, n.value.length); }, 250);
    $$('[data-pag]', c).forEach((b) => (b.onclick = () => { st.pagina += Number(b.dataset.pag); desenhar(); }));
    $('[data-todos]', c).onchange = (e) => { pag.forEach((i) => (e.target.checked ? st.sel.add(i.id) : st.sel.delete(i.id))); desenhar(); };
    $$('[data-sel]', c).forEach((cb) => (cb.onchange = () => { cb.checked ? st.sel.add(cb.dataset.sel) : st.sel.delete(cb.dataset.sel); desenhar(); }));
    $$('[data-importar]', c).forEach((b) => (b.onclick = async () => { botaoCarregando(b, true); await importar([b.dataset.importar]); }));
    $$('[data-restaurar]', c).forEach((b) => (b.onclick = () => atualizar([b.dataset.restaurar], { descartado: false })));
    $$('[data-ficha]', c).forEach((b) => (b.onclick = async () => (await import('../ficha.js')).abrirFicha(b.dataset.ficha)));
    $$('[data-item]', c).forEach((tr) => (tr.onclick = (ev) => { if (!ev.target.closest('a,button,input')) detalhes(st.itens.find((i) => i.id === tr.dataset.item)); }));
    $$('[data-menu-item]', c).forEach((b) => (b.onclick = () => {
      const it = st.itens.find((i) => i.id === b.dataset.menuItem);
      const zap = zapDe(it);
      import('../ui.js').then(({ menu }) => menu(b, [
        { icone: 'olho', rotulo: 'Ver detalhes e motivos', fn: () => detalhes(it) },
        ...(daPlanilha() ? [{ icone: 'comentario', rotulo: 'Enriquecer com o Claude', fn: () => enriquecer([it.id]) }] : []),
        ...(zap ? [{ icone: 'whatsapp', rotulo: 'Abrir WhatsApp', fn: () => window.open(`https://wa.me/${zap}`, '_blank') }] : []),
        { icone: 'mapa', rotulo: 'Procurar no Google Maps', fn: () => window.open(`https://www.google.com/maps/search/${encodeURIComponent(`${it.nome} ${it.cidade || ''}`)}`, '_blank') },
        '-',
        it.descartado ? { icone: 'atualizar', rotulo: 'Restaurar', fn: () => atualizar([it.id], { descartado: false }) } : { icone: 'x', rotulo: 'Descartar', perigo: true, fn: () => atualizar([it.id], { descartado: true }) },
      ]));
    }));
    $$('[data-bulk]', c).forEach((b) => (b.onclick = async () => {
      const ids = [...st.sel], acao = b.dataset.bulk;
      if (acao !== 'limpar') {
        if (acao === 'importar') { botaoCarregando(b, true, 'Importando…'); await importar(ids); }
        if (acao === 'descartar') await atualizar(ids, { descartado: true });
        if (acao === 'enriquecer') await enriquecer(ids.slice(0, 15));
        if (acao === 'cnpj') await conferirCnpj(ids);
      }
      st.sel.clear();
      desenhar();
    }));
    const baixar = () => baixarArquivo(`${st.lista.nome.replace(/[^\w-]+/g, '_')}.csv`, paraCSV(filtrados(), [
      { campo: 'nome', rotulo: 'Empresa' }, { campo: 'categoria', rotulo: 'Categoria' }, { campo: 'bairro', rotulo: 'Bairro' }, { campo: 'cidade', rotulo: 'Cidade' }, { campo: 'whatsapp', rotulo: 'WhatsApp' }, { campo: 'telefone', rotulo: 'Telefone' }, { campo: 'instagram', rotulo: 'Instagram' }, { campo: 'instagram_seguidores', rotulo: 'Seguidores' },
      { campo: 'site', rotulo: 'Site' }, { campo: 'site_status', rotulo: 'Situação do site' }, { campo: 'google_nota', rotulo: 'Nota' }, { campo: 'google_avaliacoes', rotulo: 'Avaliações' }, { campo: 'score', rotulo: 'Score' }, { campo: 'prioridade', rotulo: 'Prioridade' }, { rotulo: 'Motivos', valor: (i) => (i.score_motivos || []).map((m) => `+${m.pontos} ${m.sinal}`).join(' | ') },
    ]));
    const copiarTelefones = () => {
      const t = filtrados().map((i) => digitos(i.whatsapp || i.telefone)).filter(Boolean);
      if (!t.length) { toast('Nenhum telefone neste filtro', 'info'); return; }
      copiar(t.join('\n'), `${t.length} telefones copiados`);
    };
    const tri = $('[data-triagem]', c);
    if (tri) tri.onclick = triagem;
    const lt = $('[data-lote]', c);
    if (lt) lt.onclick = montarLote;
    $('[data-menu-lista]', c).onclick = (e) => {
      const alvo = e.currentTarget;
      /* 13/11/2026, Marcelo: "achando algumas coisas meio redundantes... ao invés de ter botões muito específicos". O "Montar lote"
         já filtra, confere o CNPJ, escolhe e escreve; aqui fica só o que ele não faz. Enriquecer e triagem só em lista de planilha. */
      const semCnpj = ativos().filter((i) => !i.dados?.cnpj).sort((a, b) => b.score - a.score).slice(0, 40).map((i) => i.id);
      import('../ui.js').then(({ menu, perguntar }) => menu(alvo, [
        { icone: 'copiar', rotulo: 'Copiar telefones', fn: copiarTelefones },
        { icone: 'download', rotulo: `Baixar planilha (${filtrados().length})`, fn: baixar },
        ...(semCnpj.length ? [{ icone: 'checkc', rotulo: `Só conferir o CNPJ (${semCnpj.length})`, fn: () => conferirCnpj(semCnpj) }] : []),
        ...(daPlanilha() ? [{ icone: 'comentario', rotulo: 'Enriquecer as 10 melhores', fn: enriquecerTop }] : []),
        { icone: 'atualizar', rotulo: 'Repontuar com a régua atual', fn: repontuar },
        { icone: 'editar', rotulo: 'Renomear', fn: async () => {
          const n = await perguntar('Nome da busca', { valor: st.lista.nome });
          if (!n || !n.trim()) return;
          const { error } = await sb.from('listas').update({ nome: n.trim() }).eq('id', st.lista.id);
          if (error) { toast(erroAmigavel(error), 'erro'); return; }
          st.lista.nome = n.trim(); desenhar(); carregarBuscas();
        } },
        '-',
        { icone: 'lixo', rotulo: 'Apagar busca', perigo: true, fn: () => apagarLista(st.lista) },
      ]));
    };
  }

  async function triagem() {
    const { perguntar } = await import('../ui.js');
    const cand = ativos().filter((i) => !i.empresa_id && !st.triando.has(i.id)).sort((a, b) => b.score - a.score);
    const r = await perguntar(`Quantas empresas passar pela triagem? (${cand.length} fora do CRM, do maior score pro menor)`, { valor: String(Math.min(10, cand.length)), placeholder: 'um número, ou "todas"', rotulo: 'Pôr na fila' });
    if (r == null) return;
    const n = /tod[oa]s/i.test(r) ? cand.length : Math.max(0, Math.min(cand.length, parseInt(r, 10) || 0));
    if (!n) return;
    const alvo = cand.slice(0, n).map((i) => i.id);
    try {
      for (let k = 0; k < alvo.length; k += 8) await criarJob('triar_lista', { item_ids: alvo.slice(k, k + 8) }, { lista_id: st.lista.id }, 5);
      toast(`${n} ${n > 1 ? 'empresas' : 'empresa'} na triagem${farejadorOnline() ? '' : ' (Farejador offline: roda quando ligar)'}`, 'info');
      alvo.forEach((x) => st.triando.add(x));
      desenhar();
    } catch (e) { toast(erroAmigavel(e), 'erro'); }
  }
  /* O lote do Fischer (13/11/2026, pedido do Marcelo): ele escolhe o filtro antes ("que eu decida se vai ser com número X de
     avaliações ou não"), a conta de quantas sobram é feita aqui na tela, sem Claude, e só as que sobram vão pro Claude. */
  function montarLote() {
    const naFila = st.triando;
    const base = ativos().filter((i) => !i.empresa_id && !naFila.has(i.id));
    const noPC = matchMedia('(pointer: fine)').matches && innerWidth > 900;
    // Busca "Sem Google": ninguém ali tem nota nem avaliação, então o filtro já nasce sem esse corte e com o foco no perfil do Google
    const semGoogle = base.length && base.filter((i) => i.gmb_status === 'ausente').length >= base.length / 2;
    const f = semGoogle
      ? { nota: '', minAval: '', maxAval: '', site: 'qualquer', celular: true, horario: 'qualquer', semMei: true, anos: 3, foco: 'google', quantidade: 10, janela: noPC }
      : { nota: 4, minAval: 15, maxAval: '', site: 'sem', celular: true, horario: 'qualquer', semMei: true, anos: 3, foco: 'geral', quantidade: 10, janela: noPC };
    const anosDe = (i) => { const a = i.dados?.cnpj?.receita?.abertura; const d = a ? new Date(a) : null; return d && !Number.isNaN(d.getTime()) ? (Date.now() - d) / (365.25 * 864e5) : null; };
    const passa = (i) => {
      if (f.nota && !(Number(i.google_nota) >= Number(f.nota))) return false;
      if (f.minAval !== '' && !(Number(i.google_avaliacoes || 0) >= Number(f.minAval))) return false;
      if (f.maxAval !== '' && !(Number(i.google_avaliacoes || 0) <= Number(f.maxAval))) return false;
      if (f.site === 'sem' && !semSite(i) && !soRede(i)) return false;
      if (f.site === 'com' && (semSite(i) || soRede(i))) return false;
      if (f.celular && !zapDe(i)) return false;
      if (f.horario === 'sem' && Object.keys(i.dados?.horarios || {}).length) return false;
      const rec = i.dados?.cnpj?.receita;
      // O CNPJ de quem ainda não foi conferido é conferido pelo Farejador antes do Claude (13/11)
      if (rec && f.semMei && rec.mei) return false;
      if (rec && f.anos) { const a = anosDe(i); if (a != null && a < Number(f.anos)) return false; }
      if (i.dados?.cnpj?.veredito === 'reprovado') return false;
      return true;
    };
    const campo = (rot, html, dica = '') => `<div class="campo"><span class="lbl">${rot}</span>${html}${dica ? `<span class="ajuda">${dica}</span>` : ''}</div>`;
    const sel = (k, ops) => `<select class="sel" data-lf="${k}">${ops.map(([v, r]) => `<option value="${v}"${String(f[k]) === v ? ' selected' : ''}>${r}</option>`).join('')}</select>`;
    const m = modal({
      titulo: 'Montar lote', subtitulo: `${base.length} empresas desta busca fora do CRM`, icone: 'enviar', largo: true,
      corpo: `<div class="grade-2">
          ${campo('Nota mínima no Google', `<input class="inp" type="number" step="0.1" min="0" max="5" data-lf="nota" value="${f.nota}" placeholder="sem mínimo">`, semGoogle ? 'Esta busca é de quem não tem perfil no Google: sem nota para cortar.' : '')}
          ${campo('Quantas no lote', `<input class="inp" type="number" min="1" max="20" data-lf="quantidade" value="${f.quantidade}">`)}
          ${campo('Avaliações: no mínimo', `<input class="inp" type="number" min="0" data-lf="minAval" value="${f.minAval}" placeholder="sem mínimo">`, 'Deixe em branco para não cortar.')}
          ${campo('Avaliações: no máximo', `<input class="inp" type="number" min="0" data-lf="maxAval" value="${f.maxAval}" placeholder="sem máximo">`, 'Para vender o perfil do Google: poucas avaliações = perfil fraco.')}
          ${campo('Site', sel('site', [['sem', 'Sem site, fora do ar ou só rede social'], ['qualquer', 'Tanto faz'], ['com', 'Só quem tem site']]))}
          ${campo('Horário no Google', sel('horario', [['qualquer', 'Tanto faz'], ['sem', 'Só quem não pôs o horário']]))}
          ${campo('O que vender neste lote', sel('foco', [['geral', 'O gancho mais forte de cada uma'], ['google', 'Perfil no Google (Google Meu Negócio)'], ['site', 'Site']]))}
          ${campo('CNPJ', `<span style="display:flex;flex-wrap:wrap;align-items:center;gap:8px"><label class="check"><input type="checkbox" data-lf="semMei" ${f.semMei ? 'checked' : ''}> Tirar MEI</label><span>Aberta há pelo menos</span><input class="inp sm" style="width:72px" type="number" min="0" data-lf="anos" value="${f.anos}"><span>anos</span></span>`, 'O Hounder confere o CNPJ na Receita só das que sobrarem do filtro, sem Claude, e corta antes de o Claude começar.')}
        </div>
        <label class="check mt-8"><input type="checkbox" data-lf="celular" ${f.celular ? 'checked' : ''}> Só quem tem celular (WhatsApp)</label>
        <label class="check mt-8"><input type="checkbox" data-lf="janela" ${f.janela ? 'checked' : ''} ${noPC ? '' : 'disabled'}> Abrir na janela do chat, no PC, para eu assistir e corrigir</label>
        <div class="aviso mt-16" data-conta></div>`,
      pe: '<button class="btn" data-fechar>Cancelar</button><button class="btn prim" data-ir>Montar lote</button>',
    });
    const conta = () => {
      const sobra = base.filter(passa).sort((a, b) => b.score - a.score);
      const vao = sobra.slice(0, 40);
      const proClaude = Math.min(vao.length, f.quantidade * 3);
      $('[data-conta]', m.el).innerHTML = sobra.length ? `<div><b>Sobram ${sobra.length} de ${base.length}.</b><br>1. O Hounder confere o CNPJ ${vao.length < sobra.length ? `das ${vao.length} de maior score` : 'delas'} na Receita e tira MEI e empresa nova. Sem Claude.<br>2. O Claude olha até ${proClaude} e escolhe as ${f.quantidade} melhores para o lote.<br>3. Ele escreve a primeira mensagem e os dois follow-ups de cada uma. Nada sai sem você aprovar no Disparos.</div>` : '<div><b>Nenhuma sobrou.</b> Afrouxe o filtro.</div>';
      $('[data-ir]', m.el).disabled = !sobra.length;
      return vao;
    };
    $$('[data-lf]', m.el).forEach((x) => (x.oninput = x.onchange = () => {
      const k = x.dataset.lf;
      f[k] = x.type === 'checkbox' ? x.checked : x.type === 'number' ? (x.value === '' ? '' : Number(x.value)) : x.value;
      if (k === 'quantidade') f.quantidade = Math.max(1, Math.min(20, Number(x.value) || 10));
      conta();
    }));
    conta();
    $('[data-ir]', m.el).onclick = async (ev) => {
      const vao = conta();
      if (!vao.length) return;
      botaoCarregando(ev.currentTarget, true, 'Pondo na fila…');
      const filtros = { nota: f.nota, min_avaliacoes: f.minAval, max_avaliacoes: f.maxAval, site: f.site, horario: f.horario, sem_mei: f.semMei, anos: f.anos, celular: f.celular };
      try {
        await criarJob('montar_lote', { item_ids: vao.map((i) => i.id), quantidade: f.quantidade, foco: f.foco, janela: Boolean(f.janela && noPC), filtros, lista_id: st.lista.id }, { lista_id: st.lista.id }, 4);
        vao.forEach((i) => st.triando.add(i.id));
        m.fechar();
        toast(f.janela && noPC ? 'Lote na fila. A janela do chat abre no PC quando o navegador do Farejador estiver livre.' : `Lote na fila${farejadorOnline() ? '' : ' (Farejador offline: roda quando ligar)'}`, 'info');
        desenhar();
      } catch (e) { toast(erroAmigavel(e), 'erro'); botaoCarregando(ev.currentTarget, false); }
    };
  }
  async function atualizar(ids, campos) {
    const { error } = await sb.from('lista_itens').update(campos).in('id', ids);
    if (error) { toast(erroAmigavel(error), 'erro'); return; }
    for (const i of st.itens) if (ids.includes(i.id)) Object.assign(i, campos);
    desenhar(); pontos();
  }
  async function importar(ids) {
    let novos = 0, ligados = 0;
    for (const itemId of ids) {
      const it = st.itens.find((i) => i.id === itemId);
      if (!it || it.empresa_id) continue;
      try {
        const dup = acharDuplicada(it);
        let empId = dup?.id;
        if (!dup) {
          const conselho = detectarRegulado(`${it.categoria || ''} ${it.nome}`);
          // A lista guarda dono, e-mail e observação num texto só; a linha crua devolve cada um pro seu campo
          const cru = it.dados && Object.keys(it.dados).length ? linhaParaItem(it.dados, mapearColunas(Object.keys(it.dados))) : {};
          const emp = await criarEmpresa({
            nome: it.nome, categoria: it.categoria, cidade: it.cidade, bairro: it.bairro, endereco: it.endereco, telefone: it.telefone, whatsapp: it.whatsapp || (ehCelular(it.telefone) ? digitos(it.telefone) : null),
            instagram: it.instagram, instagram_seguidores: it.instagram_seguidores, site: it.site, site_status: it.site_status, google_nota: it.google_nota,
            google_avaliacoes: it.google_avaliacoes, gmb_status: it.gmb_status, roda_anuncio: it.roda_anuncio, cnpj: it.cnpj, score: it.score, prioridade: it.prioridade,
            score_motivos: it.score_motivos, regulado: Boolean(conselho), conselho, estagio: 'novo', relacao: 'lead',
            origem: st.lista.origem === 'claude' ? 'claude' : st.lista.origem === 'network' ? 'network' : 'spark', origem_detalhe: st.lista.nome, lista_item_id: it.id,
            decisor: cru.decisor || null, email: cru.email || null, dor: cru.nome ? cru.observacao || null : null,
            resumo: cru.nome ? (cru.servico_sugerido ? `Serviço sugerido na lista: ${cru.servico_sugerido}` : null) : it.observacao,
            gancho: it.site_status === 'fora_do_ar' ? 'Site fora do ar (conferir antes de citar)' : it.site_status === 'sem' ? 'Não tem site próprio: quem procura no Google não acha' : null,
          });
          empId = emp.id; novos++;
        } else ligados++;
        await sb.from('lista_itens').update({ empresa_id: empId }).eq('id', it.id);
        it.empresa_id = empId;
      } catch (e) { toast(`${it.nome}: ${erroAmigavel(e)}`, 'erro'); }
    }
    toast(`${novos} no funil${ligados ? ` · ${ligados} já ${ligados > 1 ? 'existiam' : 'existia'}` : ''}`, 'ok', { acao: { rotulo: 'Ver esteira', fn: () => { location.hash = '#/esteira'; } } });
    desenhar();
  }
  async function enriquecer(ids) {
    if (!ids.length) { toast('Nada para enriquecer', 'info'); return; }
    try {
      await criarJob('enriquecer_lista', { item_ids: ids.slice(0, 15) }, { lista_id: st.lista.id }, 5);
      toast(`${Math.min(15, ids.length)} para enriquecer${farejadorOnline() ? '' : ' (Farejador offline: roda quando ligar)'}`, 'info');
      await carregarLista(st.lista.id); desenhar();
    } catch (e) { toast(erroAmigavel(e), 'erro'); }
  }
  async function conferirCnpj(ids) {
    if (!ids.length) { toast('Nada para conferir', 'info'); return; }
    if (st.cnpjAgora) { toast('Já tem uma conferência rodando nesta busca', 'info'); return; }
    try {
      await criarJob('conferir_cnpj', { item_ids: ids.slice(0, 40), lista_id: st.lista.id }, { lista_id: st.lista.id }, 5);
      toast(`${Math.min(40, ids.length)} para conferir na Receita${farejadorOnline() ? '' : ' (Farejador offline: roda quando ligar)'}`, 'info');
      await carregarLista(st.lista.id); desenhar();
    } catch (e) { toast(erroAmigavel(e), 'erro'); }
  }
  function enriquecerTop() {
    const ocupados = new Set(st.enriquecendo.flatMap((j) => j.entrada?.item_ids || []));
    const cand = ativos().filter((i) => !i.empresa_id && !i.enriquecido_em && !ocupados.has(i.id)).sort((a, b) => b.score - a.score).slice(0, 10);
    if (!cand.length) { toast('Todas fora do CRM já foram enriquecidas', 'info'); return; }
    enriquecer(cand.map((i) => i.id));
  }
  async function repontuar() {
    const opc = { pesos: estado.config.score, nichos: estado.config.nichos_conhecidos, praca: estado.config.praca?.regiao };
    let mud = 0;
    for (const i of st.itens) {
      const p = pontuar(i, opc);
      if (p.score !== i.score) { await sb.from('lista_itens').update({ score: p.score, prioridade: p.prioridade, score_motivos: p.motivos }).eq('id', i.id); Object.assign(i, { score: p.score, prioridade: p.prioridade, score_motivos: p.motivos }); mud++; }
    }
    toast(`${mud} com score atualizado`); desenhar();
  }
  function detalhes(i) {
    if (!i) return;
    const extras = Object.entries(i.dados || {}).filter(([, val]) => val != null && typeof val !== 'object' && String(val).trim());
    const cn = i.dados?.cnpj;
    const coments = (i.dados?.comentarios || []).filter((c) => c.texto);
    const m = modal({
      titulo: i.nome, subtitulo: [i.categoria, i.bairro, i.cidade].filter(Boolean).join(' · '), icone: 'predio', largo: true, pe: '',
      corpo: `<div class="rotulo mb-8">Por que ${i.score}/100</div>
        <div class="motivos">${(i.score_motivos || []).map((x) => `<div class="motivo"><b>+${x.pontos}</b><span>${esc(x.sinal)}</span><small class="dim">${esc(x.detalhe || '')}</small></div>`).join('') || '<p class="dim">Nenhum sinal pontuado: faltam dados.</p>'}</div>
        ${i.observacao ? `<div class="rotulo mt-16 mb-8">Observação</div><p>${esc(i.observacao)}</p>` : ''}
        ${cn ? `<div class="rotulo mt-16 mb-8">CNPJ na Receita</div><p>${seloCnpj(i)} ${i.cnpj ? esc(i.cnpj) : ''}${cn.receita ? ` · ${esc(cn.receita.razao || '')} · ${esc(cn.receita.situacao || '')} · aberta em ${esc(cn.receita.abertura || '?')}${cn.receita.mei ? ' · MEI' : ''}` : ''}</p>${cn.motivos?.length ? `<p class="dim" style="font-size:13px">${esc(cn.motivos.join('; '))}</p>` : ''}` : ''}
        ${coments.length ? `<div class="rotulo mt-16 mb-8">Comentários no Google</div>${coments.slice(0, 3).map((c) => `<p style="font-size:13.5px"><b>${esc(c.nome || 'Cliente')}</b> ${'★'.repeat(Math.max(0, Math.min(5, c.nota || 0)))} ${esc(c.texto.slice(0, 280))}</p>`).join('')}` : ''}
        ${extras.length ? `<details class="mt-16"><summary class="rotulo">Linha original</summary><div class="dados-grade mt-8">${extras.map(([k, val]) => `<div class="dado"><span>${esc(k)}</span><b>${esc(val)}</b></div>`).join('')}</div></details>` : ''}`,
    });
  }

  /* ---------- Início ---------- */
  limpezas.push(ouvir('listas', debounce(carregarBuscas, 700)));
  limpezas.push(ouvir('jobs', (p) => {
    if (TIPOS_BUSCA.includes(p.new?.tipo)) debounce(carregarBuscas, 700)();
    if (st.lista && p.new?.lista_id === st.lista.id) {
      if (p.eventType === 'INSERT' || p.old?.status !== p.new.status) recarregar();
      else {
        const alvo = (p.new.tipo === 'enriquecer_lista' && $('[data-enriq-prog]', v)) || (p.new.tipo === 'conferir_cnpj' && $('[data-cnpj-prog]', v));
        if (alvo && p.new.progresso) alvo.textContent = p.new.progresso;
      }
    }
  }));
  carregarBuscas().then(() => {
    if (listaId) abrir(listaId, 'board');
    if (params.planilha) modalPlanilha(async (id) => { await carregarBuscas(); abrir(id, 'board'); });
  });
  return () => limpezas.forEach((f) => f());
}
