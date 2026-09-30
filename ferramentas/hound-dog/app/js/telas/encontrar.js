/* =============================================================================
   HOUNDER — Encontrar clientes
   Farejada do Claude · Planilha do Spark · Listas pontuadas → funil
   ============================================================================= */
import { sb, estado, ouvir, criarJob, farejadorOnline, acharDuplicada, criarEmpresa, quem } from '../sb.js';
import { $, $$, el, esc, toast, confirmar, erroAmigavel, botaoCarregando, copiar, relativo, dataHora, vazio, esqueleto, num, compacto, telefoneBonito, debounce, baixarArquivo, paraCSV, modal } from '../ui.js';
import { icone, sparkClaude } from '../icones.js';
import { mapearColunas, linhaParaItem, pontuar, promptSpark, detectarRegulado, chaveDedupe } from '../score.js';

const CAMPOS = [
  ['nome', 'Nome do negócio *'], ['categoria', 'Nicho / categoria'], ['cidade', 'Cidade'], ['bairro', 'Bairro'], ['endereco', 'Endereço'],
  ['telefone', 'Telefone'], ['whatsapp', 'WhatsApp'], ['instagram', 'Instagram'], ['instagram_seguidores', 'Seguidores'], ['site', 'Site'],
  ['site_status', 'Situação do site'], ['google_nota', 'Nota no Google'], ['google_avaliacoes', 'Avaliações no Google'], ['gmb_status', 'Perfil no Google'],
  ['roda_anuncio', 'Roda anúncio'], ['cnpj', 'CNPJ'], ['decisor', 'Dono / decisor'], ['email', 'E-mail'], ['observacao', 'Observação'],
];
const SITE = { sem: ['vermelho', 'Sem site'], fora_do_ar: ['vermelho', 'Fora do ar'], ruim: ['amarelo', 'Fraco'], ok: ['verde', 'OK'], desconhecido: ['cinza', '?'] };
const opcScore = () => ({ pesos: estado.config.score, nichos: estado.config.nichos_conhecidos, praca: estado.config.praca?.regiao });

export default async function encontrar(v, { args, params }) {
  if (args[0] === 'lista' && args[1]) return detalheLista(v, args[1]);
  let aba = params.aba || 'claude';
  v.innerHTML = `
    <div class="cab"><div class="tt"><h1>Encontrar clientes</h1><p>Fareje, pontue e mande pro funil quem tem mais potencial primeiro.</p></div>
      <div class="acoes"><a class="btn" href="#/mercado?nova=1">${icone('mercado')}Pesquisar o nicho antes</a></div></div>
    <nav class="abas" data-abas>
      <button data-aba="claude">${sparkClaude(16)}Farejar com o Claude</button>
      <button data-aba="spark">${icone('planilha')}Planilha do Spark</button>
      <button data-aba="listas">${icone('lista')}Minhas listas <span class="badge" data-n-listas>…</span></button>
    </nav>
    <div data-corpo></div>`;
  const corpo = $('[data-corpo]', v);
  const limpezas = [];
  function trocar(nova) {
    aba = nova;
    $$('[data-aba]', v).forEach((b) => b.classList.toggle('on', b.dataset.aba === aba));
    history.replaceState(null, '', `#/encontrar?aba=${aba}`);
    limpezas.splice(0).forEach((f) => f());
    if (aba === 'claude') abaClaude(corpo, limpezas);
    else if (aba === 'spark') abaSpark(corpo, limpezas, trocar);
    else abaListas(corpo, limpezas);
  }
  $('[data-abas]', v).onclick = (e) => { const b = e.target.closest('[data-aba]'); if (b) trocar(b.dataset.aba); };
  const contarListas = async () => { const { count } = await sb.from('listas').select('id', { count: 'exact', head: true }); const b = $('[data-n-listas]', v); if (b) b.textContent = count ?? 0; };
  contarListas();
  const tira = ouvir('listas', debounce(contarListas, 800));
  trocar(aba);
  return () => { tira(); limpezas.forEach((f) => f()); };
}

/* =============================== Aba: farejar com o Claude =============================== */
function abaClaude(c, limpezas) {
  const nichos = ['Clínica de estética', 'Odontologia', 'Oficina mecânica', 'Floricultura', 'Pet shop', 'Academia / estúdio', 'Restaurante', 'Salão de beleza', 'Advocacia', 'Imobiliária'];
  c.innerHTML = `
    <div class="encontrar-grade">
      <section class="card brilho">
        <div class="card-cab"><div class="icone-caixa claude">${sparkClaude(22)}</div><div class="grow"><h3>Configure a farejada</h3><p class="dim" style="font-size:13.5px">O Claude pesquisa na web (Firecrawl e busca), confere site e Instagram e devolve uma lista pontuada.</p></div></div>
        <form data-form novalidate>
          <div class="campo"><label for="f-nicho">Nicho *</label><input class="inp" id="f-nicho" name="nicho" placeholder="Ex.: clínica de estética" required>
            <div class="chips mt-8">${nichos.map((n) => `<button type="button" class="chip" data-nicho="${esc(n)}">${esc(n)}</button>`).join('')}</div></div>
          <div class="grade-2">
            <div class="campo"><label for="f-cidade">Cidade ou bairro *</label><input class="inp" id="f-cidade" name="cidade" value="Salvador, BA" required></div>
            <div class="campo"><label>Quantidade</label><div class="segmento" data-qtd>${[10, 20, 30, 50].map((q) => `<button type="button" class="${q === 20 ? 'on' : ''}" data-q="${q}">${q}</button>`).join('')}</div></div>
          </div>
          <div class="campo"><span class="lbl">Foco</span><div class="col gap-6">
            <label class="check"><input type="checkbox" name="foco" value="sem site ou site fora do ar" checked> Sem site ou com site fora do ar</label>
            <label class="check"><input type="checkbox" name="foco" value="com movimento real (avaliações no Google ou Instagram ativo)" checked> Com movimento real (avaliações, Instagram ativo)</label>
            <label class="check"><input type="checkbox" name="foco" value="que ainda não rodam anúncio na Meta"> Que ainda não rodam anúncio</label>
            <label class="check"><input type="checkbox" name="foco" value="com WhatsApp de contato visível"> Com WhatsApp visível</label>
          </div></div>
          <div class="campo"><label for="f-obs">Algo mais? (opcional)</label><input class="inp" id="f-obs" name="observacao" placeholder="Ex.: priorizar Pituba e Itaigara; evitar franquias"></div>
          <div class="row wrap"><button class="btn prim lg" type="submit">${icone('radar')}Farejar agora</button><span class="dim" style="font-size:13px">Leva de 3 a 10 minutos. Roda no Farejador, no seu PC.</span></div>
          <div data-aviso-off class="mt-12"></div>
        </form>
      </section>
      <section class="col gap-18">
        <div class="card"><div class="card-cab"><div class="icone-caixa sm">${icone('ampulheta')}</div><h3>Farejadas</h3></div><div data-jobs>${esqueleto(3)}</div></div>
        <div class="card destaque"><div class="card-cab"><div class="icone-caixa sm amarelo">${icone('planilha')}</div><div class="grow"><h3>Delegar o volume pro Spark</h3><p class="dim" style="font-size:13px">Precisa de 100+ leads? O Gemini Spark faz o volume e o Hounder pontua.</p></div></div>
          <button class="btn bloco" data-spark>${icone('copiar')}Gerar prompt pro Spark</button></div>
      </section>
    </div>`;
  const form = $('[data-form]', c);
  let qtd = 20;
  $$('[data-q]', c).forEach((b) => (b.onclick = () => { qtd = Number(b.dataset.q); $$('[data-q]', c).forEach((x) => x.classList.toggle('on', x === b)); }));
  $$('[data-nicho]', c).forEach((b) => (b.onclick = () => { form.nicho.value = b.dataset.nicho; form.nicho.focus(); }));
  if (!farejadorOnline()) $('[data-aviso-off]', c).innerHTML = `<div class="aviso laranja">${icone('alerta')}<div><b>Farejador offline.</b> O pedido fica na fila e roda quando ele ligar no seu PC (atalho "Hound Dog Farejador" ou <code>npm run farejador</code>).</div></div>`;

  form.onsubmit = async (e) => {
    e.preventDefault();
    const nicho = form.nicho.value.trim(), cidade = form.cidade.value.trim();
    if (!nicho || !cidade) { toast('Informe nicho e cidade', 'erro'); return; }
    const foco = $$('input[name=foco]:checked', form).map((i) => i.value);
    const btn = $('button[type=submit]', form); botaoCarregando(btn, true, 'Enviando…');
    try {
      await criarJob('pesquisar_clientes', { nicho, cidade, quantidade: qtd, foco, observacao: form.observacao.value.trim() }, {}, 4);
      toast('Farejada na fila do Claude', 'info');
      form.observacao.value = '';
    } catch (err) { toast(erroAmigavel(err), 'erro'); }
    botaoCarregando(btn, false);
    carregarJobs();
  };
  $('[data-spark]', c).onclick = () => modalSpark(form.nicho.value.trim() || 'clínica de estética', form.cidade.value.trim() || 'Salvador, BA');

  async function carregarJobs() {
    if (!c.isConnected) return;
    const { data, error } = await sb.from('jobs').select('*').eq('tipo', 'pesquisar_clientes').order('criado_em', { ascending: false }).limit(8);
    const box = $('[data-jobs]', c); if (!box) return;
    if (error) { box.innerHTML = vazio('alerta', 'Não carregou', erroAmigavel(error)); return; }
    box.innerHTML = (data || []).length ? data.map((j) => {
      const st = { fila: ['cinza', 'Na fila'], processando: ['claude', 'Farejando'], concluido: ['verde', 'Pronta'], erro: ['vermelho', 'Erro'], cancelado: ['cinza', 'Cancelada'] }[j.status];
      return `<div class="item"><div class="grow"><div class="tit ellipsis">${esc(j.entrada?.nicho)} · ${esc(j.entrada?.cidade)}</div>
        <div class="sub">${esc(j.progresso || (j.status === 'fila' ? 'Aguardando o Farejador' : ''))}</div><div class="sub">${relativo(j.criado_em)} · ${j.entrada?.quantidade || '?'} leads pedidos</div>
        ${j.erro ? `<div class="sub erro">${esc(j.erro.slice(0, 160))}</div>` : ''}</div>
        <span class="selo ${st[0]} ${j.status === 'processando' ? 'claude-pensando' : ''}">${j.status === 'processando' ? sparkClaude(12) : ''}${st[1]}</span>
        ${j.saida?.lista_id ? `<a class="btn xs" href="#/encontrar/lista/${j.saida.lista_id}">Ver lista</a>` : ''}
        ${['fila', 'erro'].includes(j.status) ? `<button class="btn xs fantasma" data-cancelar="${j.id}" aria-label="${j.status === 'erro' ? 'Remover' : 'Cancelar'}">${icone('x')}</button>` : ''}</div>`;
    }).join('') : vazio('radar', 'Nenhuma farejada ainda', 'Configure ao lado e o Claude começa.');
    $$('[data-cancelar]', box).forEach((b) => (b.onclick = async () => {
      const { error: er } = await sb.from('jobs').update({ status: 'cancelado' }).eq('id', b.dataset.cancelar);
      if (er) toast(erroAmigavel(er), 'erro'); else carregarJobs();
    }));
  }
  carregarJobs();
  limpezas.push(ouvir('jobs', debounce(carregarJobs, 600)));
}

function modalSpark(nicho, cidade) {
  const m = modal({
    titulo: 'Prompt pro Gemini Spark', subtitulo: 'Cole no Spark. Ele monta a planilha no formato que o Hounder lê direto.', icone: 'planilha', largo: true,
    corpo: `<div class="grade-2"><div class="campo"><label>Nicho</label><input class="inp" data-n value="${esc(nicho)}"></div><div class="campo"><label>Cidade</label><input class="inp" data-c value="${esc(cidade)}"></div></div>
      <div class="campo"><label>Quantidade</label><input class="inp" data-q type="number" min="10" max="500" value="80"></div>
      <textarea class="txt mono" data-p rows="14" style="font-size:12.5px"></textarea>
      <div class="aviso mt-12">${icone('info')}<div>Quando a planilha ficar pronta: <b>Arquivo → Compartilhar → Publicar na web → CSV</b> e cole o link na aba <b>Planilha do Spark</b>. Ou baixe como .xlsx e arraste.</div></div>`,
    pe: `<button class="btn" data-fechar>Fechar</button><button class="btn prim" data-copiar>${icone('copiar')}Copiar prompt</button>`,
  });
  $$('[data-fechar]', m.el).forEach((b) => (b.onclick = () => m.fechar()));
  const gerar = () => { $('[data-p]', m.el).value = promptSpark({ nicho: $('[data-n]', m.el).value, cidade: $('[data-c]', m.el).value, quantidade: Number($('[data-q]', m.el).value) || 80 }); };
  $$('[data-n],[data-c],[data-q]', m.el).forEach((i) => (i.oninput = gerar));
  gerar();
  $('[data-copiar]', m.el).onclick = () => copiar($('[data-p]', m.el).value, 'Prompt copiado. Cole no Spark.');
}

/* =============================== Aba: planilha do Spark =============================== */
function abaSpark(c, limpezas, trocar) {
  c.innerHTML = `
    <div class="encontrar-grade">
      <section class="col gap-18">
        <label class="gota" data-gota>${icone('upload')}<b>Arraste a planilha aqui</b><span>CSV, XLSX ou XLS · ou clique para escolher</span><input type="file" accept=".csv,.tsv,.txt,.xlsx,.xls,text/csv" data-arquivo aria-label="Escolher planilha"></label>
        <div class="card"><div class="card-cab"><div class="icone-caixa sm">${icone('link')}</div><h3>Ou cole o link do Google Sheets</h3></div>
          <div class="row"><input class="inp" data-url placeholder="https://docs.google.com/spreadsheets/d/e/…/pub?output=csv"><button class="btn" data-ler-url>${icone('download')}Ler</button></div>
          <p class="dim mt-8" style="font-size:12.5px">Use o link de <b>Publicar na web → CSV</b>. Link de compartilhamento comum também funciona se a planilha estiver pública.</p></div>
        <div class="card"><div class="card-cab"><div class="icone-caixa sm">${icone('copiar')}</div><h3>Ou cole as linhas</h3></div>
          <textarea class="txt mono" data-colar rows="4" style="font-size:12.5px" placeholder="Selecione as células no Sheets (com o cabeçalho), copie e cole aqui"></textarea>
          <button class="btn sm mt-8" data-ler-colar>${icone('check')}Usar estas linhas</button></div>
      </section>
      <section data-previa>${vazio('planilha', 'Nenhuma planilha carregada', 'A pontuação usa a régua da casa: sem site +30, movimento +20, contato direto +15, Google fraco +15, nicho conhecido +10, timing +10.', '<button class="btn sm" data-prompt-spark>Gerar prompt pro Spark</button>')}</section>
    </div>`;
  const previa = $('[data-previa]', c);
  $('[data-prompt-spark]', c).onclick = () => modalSpark('clínica de estética', 'Salvador, BA');

  const gota = $('[data-gota]', c);
  ['dragenter', 'dragover'].forEach((ev) => gota.addEventListener(ev, (e) => { e.preventDefault(); gota.classList.add('sobre'); }));
  ['dragleave', 'drop'].forEach((ev) => gota.addEventListener(ev, () => gota.classList.remove('sobre')));
  gota.addEventListener('drop', (e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) lerArquivo(f); });
  $('[data-arquivo]', c).onchange = (e) => { const f = e.target.files?.[0]; if (f) lerArquivo(f); e.target.value = ''; };
  $('[data-ler-url]', c).onclick = async (ev) => {
    const url = $('[data-url]', c).value.trim();
    if (!/^https?:\/\//.test(url)) { toast('Cole um link começando com https://', 'erro'); return; }
    botaoCarregando(ev.currentTarget, true, 'Lendo…');
    try { const { lerURLPlanilha } = await import('../servicos.js'); const txt = await lerURLPlanilha(url); await processarTexto(txt, 'Planilha do Sheets', url); }
    catch (e) { toast(erroAmigavel(e), 'erro'); }
    botaoCarregando(ev.currentTarget, false);
  };
  $('[data-ler-colar]', c).onclick = () => { const t = $('[data-colar]', c).value; if (!t.trim()) { toast('Cole as linhas primeiro', 'erro'); return; } processarTexto(t, 'Linhas coladas'); };

  async function lerArquivo(f) {
    previa.innerHTML = `<div class="card">${esqueleto(6)}</div>`;
    try {
      if (/\.xlsx?$/i.test(f.name)) {
        const XLSX = await import('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm');
        const wb = XLSX.read(await f.arrayBuffer(), { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const linhas = XLSX.utils.sheet_to_json(ws, { defval: '', raw: false });
        mostrarPrevia(linhas, Object.keys(linhas[0] || {}), f.name.replace(/\.[^.]+$/, ''), null, f.name);
      } else {
        await processarTexto(await f.text(), f.name.replace(/\.[^.]+$/, ''), null, f.name);
      }
    } catch (e) { previa.innerHTML = vazio('alerta', 'Não consegui ler o arquivo', erroAmigavel(e)); }
  }

  async function processarTexto(texto, nome, url = null, arquivo = null) {
    const Papa = (await import('https://cdn.jsdelivr.net/npm/papaparse@5.7.0/+esm')).default;
    const r = Papa.parse(texto.replace(/^﻿/, ''), { header: true, skipEmptyLines: 'greedy', transformHeader: (h) => h.trim() });
    const linhas = r.data.filter((l) => Object.values(l).some((x) => String(x || '').trim()));
    if (!linhas.length) { toast('Não achei linhas com dados', 'erro'); return; }
    mostrarPrevia(linhas, r.meta.fields.filter(Boolean), nome, url, arquivo);
  }

  function mostrarPrevia(linhas, cabecalhos, nomeBase, url, arquivo) {
    let mapa = mapearColunas(cabecalhos);
    const hoje = new Date().toLocaleDateString('pt-BR');
    previa.innerHTML = `<div class="card">
      <div class="card-cab"><div class="icone-caixa sm verde">${icone('checkc')}</div><div class="grow"><h3>${num(linhas.length)} linhas lidas</h3><p class="dim" style="font-size:13px">${cabecalhos.length} colunas. Confira o mapeamento e salve.</p></div></div>
      <div class="grade-2">
        <div class="campo"><label>Nome da lista</label><input class="inp" data-nome value="${esc(`Spark · ${nomeBase} · ${hoje}`)}"></div>
        <div class="campo"><label>Origem</label><select class="sel" data-origem><option value="spark" selected>Gemini Spark</option><option value="planilha">Outra planilha</option><option value="network">Network</option></select></div>
        <div class="campo"><label>Nicho (se a planilha não trouxer)</label><input class="inp" data-nicho-padrao placeholder="Ex.: odontologia"></div>
        <div class="campo"><label>Cidade (se a planilha não trouxer)</label><input class="inp" data-cidade-padrao placeholder="Ex.: Salvador"></div>
      </div>
      <details class="mapa-colunas" ${mapa.nome ? '' : 'open'}><summary>${icone('filtro')}Mapeamento de colunas <span class="dim">(${Object.keys(mapa).length} reconhecidas)</span></summary>
        <div class="grade-2 mt-12">${CAMPOS.map(([k, r]) => `<div class="campo"><label>${esc(r)}</label><select class="sel sm" data-mapa="${k}"><option value="">(não tem)</option>${cabecalhos.map((h) => `<option${mapa[k] === h ? ' selected' : ''}>${esc(h)}</option>`).join('')}</select></div>`).join('')}</div>
      </details>
      <div class="rotulo mt-16 mb-8">Prévia pontuada (top 8)</div><div data-top></div>
      <div class="row wrap mt-16"><button class="btn prim lg" data-salvar>${icone('check')}Pontuar e salvar lista</button><span class="dim" data-dup style="font-size:13px"></span></div>
    </div>`;
    const calc = () => {
      const nichoP = $('[data-nicho-padrao]', previa).value.trim(), cidadeP = $('[data-cidade-padrao]', previa).value.trim();
      return linhas.map((l) => {
        const it = linhaParaItem(l, mapa);
        if (!it.categoria && nichoP) it.categoria = nichoP;
        if (!it.cidade && cidadeP) it.cidade = cidadeP;
        const p = pontuar(it, opcScore());
        return { ...it, score: p.score, prioridade: p.prioridade, score_motivos: p.motivos, dados: l };
      }).filter((i) => i.nome);
    };
    const desenharTop = () => {
      const itens = calc().sort((a, b) => b.score - a.score);
      const dups = itens.filter((i) => acharDuplicada(i)).length;
      $('[data-top]', previa).innerHTML = itens.length ? `<div class="tabela-wrap"><table class="tabela"><thead><tr><th>Negócio</th><th>WhatsApp</th><th>Site</th><th>Score</th></tr></thead><tbody>${itens.slice(0, 8).map((i) => `<tr><td><div class="nm">${esc(i.nome)}</div><div class="sb">${esc([i.categoria, i.bairro || i.cidade].filter(Boolean).join(' · '))}</div></td><td>${i.whatsapp ? `<span class="ok">${icone('check')}</span> ${esc(telefoneBonito(i.whatsapp))}` : '<span class="dim">—</span>'}</td><td><span class="selo ${SITE[i.site_status][0]}">${SITE[i.site_status][1]}</span></td><td><span class="score sm ${i.prioridade}" title="${esc(i.score_motivos.map((m) => `+${m.pontos} ${m.sinal}`).join('\n'))}">${i.score}</span></td></tr>`).join('')}</tbody></table></div>`
        : vazio('alerta', 'Nenhuma linha com nome', 'Mapeie a coluna "Nome do negócio".');
      $('[data-dup]', previa).textContent = `${itens.length} com nome · ${itens.filter((i) => i.prioridade === 'alta').length} alta prioridade${dups ? ` · ${dups} já estão no CRM` : ''}`;
    };
    $$('[data-mapa]', previa).forEach((s) => (s.onchange = () => { mapa = { ...mapa, [s.dataset.mapa]: s.value || undefined }; if (!s.value) delete mapa[s.dataset.mapa]; desenharTop(); }));
    $$('[data-nicho-padrao],[data-cidade-padrao]', previa).forEach((i) => (i.oninput = debounce(desenharTop, 300)));
    desenharTop();

    $('[data-salvar]', previa).onclick = async (ev) => {
      const itens = calc();
      if (!itens.length) { toast('Mapeie a coluna de nome', 'erro'); return; }
      const btn = ev.currentTarget; botaoCarregando(btn, true, 'Salvando…');
      try {
        const vistos = new Set(); const unicos = [];
        for (const i of itens) { const k = chaveDedupe(i); if (!vistos.has(k)) { vistos.add(k); unicos.push(i); } }
        const nichoP = $('[data-nicho-padrao]', previa).value.trim() || null;
        const cidadeP = $('[data-cidade-padrao]', previa).value.trim() || null;
        const { data: lista, error } = await sb.from('listas').insert({
          nome: $('[data-nome]', previa).value.trim() || `Lista ${hoje}`, origem: $('[data-origem]', previa).value,
          nicho: nichoP || maisComum(unicos.map((i) => i.categoria)), cidade: cidadeP || maisComum(unicos.map((i) => i.cidade)),
          arquivo_nome: arquivo, url_fonte: url, total: unicos.length, status: 'pronta', criado_por: quem(),
          observacao: itens.length !== unicos.length ? `${itens.length - unicos.length} linhas repetidas foram unificadas.` : null,
        }).select().single();
        if (error) throw error;
        for (let i = 0; i < unicos.length; i += 400) {
          const lote = unicos.slice(i, i + 400).map((it) => {
            const dup = acharDuplicada(it);
            return { lista_id: lista.id, nome: it.nome, categoria: it.categoria, cidade: it.cidade, bairro: it.bairro, endereco: it.endereco, telefone: it.telefone, whatsapp: it.whatsapp, instagram: it.instagram,
              instagram_seguidores: it.instagram_seguidores != null ? Math.round(it.instagram_seguidores) : null, site: it.site, site_status: it.site_status, google_nota: it.google_nota,
              google_avaliacoes: it.google_avaliacoes != null ? Math.round(it.google_avaliacoes) : null, gmb_status: it.gmb_status, roda_anuncio: it.roda_anuncio, cnpj: it.cnpj,
              observacao: [it.decisor ? `Decisor: ${it.decisor}` : '', it.email ? `E-mail: ${it.email}` : '', it.observacao || ''].filter(Boolean).join(' · ') || null,
              dados: it.dados, score: it.score, score_motivos: it.score_motivos, prioridade: it.prioridade, empresa_id: dup?.id || null };
          });
          const { error: e2 } = await sb.from('lista_itens').insert(lote);
          if (e2) throw e2;
        }
        toast(`Lista salva: ${unicos.length} leads pontuados`);
        location.hash = `#/encontrar/lista/${lista.id}`;
      } catch (e) { toast(erroAmigavel(e), 'erro'); botaoCarregando(btn, false); }
    };
  }
}

function maisComum(valores) {
  const c = {}; for (const v of valores) if (v) c[v] = (c[v] || 0) + 1;
  return Object.entries(c).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
}

/* =============================== Aba: minhas listas =============================== */
async function abaListas(c, limpezas) {
  c.innerHTML = `<div class="card pad-0">${esqueleto(5, 26)}</div>`;
  async function carregar() {
    if (!c.isConnected) return;
    const [{ data: listas, error }, { data: stats }] = await Promise.all([
      sb.from('listas').select('*').order('criado_em', { ascending: false }),
      sb.from('lista_itens').select('lista_id,prioridade,empresa_id,descartado'),
    ]);
    if (error) { c.innerHTML = vazio('alerta', 'Não carregou', erroAmigavel(error)); return; }
    const por = {};
    for (const s of stats || []) { const p = (por[s.lista_id] ||= { alta: 0, crm: 0, desc: 0 }); if (s.prioridade === 'alta') p.alta++; if (s.empresa_id) p.crm++; if (s.descartado) p.desc++; }
    const ORIG = { spark: ['amarelo', 'Spark'], claude: ['claude', 'Claude'], planilha: ['cinza', 'Planilha'], manual: ['cinza', 'Manual'], network: ['violeta', 'Network'] };
    c.innerHTML = (listas || []).length ? `<div class="card pad-0"><div class="tabela-wrap"><table class="tabela">
      <thead><tr><th>Lista</th><th>Origem</th><th>Leads</th><th>Alta prioridade</th><th>No CRM</th><th>Criada</th><th></th></tr></thead>
      <tbody>${listas.map((l) => { const p = por[l.id] || { alta: 0, crm: 0 }; const [cor, rot] = ORIG[l.origem] || ORIG.planilha;
        return `<tr class="linha-clicavel" data-lista="${l.id}"><td><div class="nm">${esc(l.nome)}</div><div class="sb">${esc([l.nicho, l.cidade].filter(Boolean).join(' · ') || '—')}</div></td>
        <td><span class="selo ${cor}">${l.origem === 'claude' ? sparkClaude(12) : ''}${rot}</span>${l.status === 'processando' ? ' <span class="selo claude claude-pensando">farejando</span>' : ''}</td>
        <td class="num">${num(l.total)}</td><td><span class="score sm alta">${p.alta}</span></td><td class="num">${p.crm}</td><td class="dim">${relativo(l.criado_em)}</td>
        <td class="nowrap"><button class="btn icone sm fantasma" data-menu-lista="${l.id}" data-parar aria-label="Ações da lista ${esc(l.nome)}">${icone('pontos')}</button>${icone('chevd')}</td></tr>`; }).join('')}</tbody></table></div></div>`
      : vazio('lista', 'Nenhuma lista ainda', 'Suba a planilha do Spark ou peça uma farejada ao Claude.', '<a class="btn sm prim" href="#/encontrar?aba=spark">Subir planilha</a>');
    $$('[data-lista]', c).forEach((tr) => (tr.onclick = (ev) => { if (ev.target.closest('[data-parar]')) return; location.hash = `#/encontrar/lista/${tr.dataset.lista}`; }));
    $$('[data-menu-lista]', c).forEach((b) => (b.onclick = (ev) => {
      ev.stopPropagation();
      const l = (listas || []).find((x) => x.id === b.dataset.menuLista);
      const p = por[l.id] || { alta: 0, crm: 0 };
      import('../ui.js').then(({ menu, perguntar }) => menu(b, [
        { icone: 'olho', rotulo: 'Abrir lista', fn: () => { location.hash = `#/encontrar/lista/${l.id}`; } },
        { icone: 'editar', rotulo: 'Renomear', fn: async () => {
          const nome = await perguntar('Nome da lista', { valor: l.nome });
          if (!nome || !nome.trim()) return;
          const { error } = await sb.from('listas').update({ nome: nome.trim() }).eq('id', l.id);
          if (error) toast(erroAmigavel(error), 'erro'); else { toast('Lista renomeada'); carregar(); }
        } },
        '-',
        { icone: 'lixo', rotulo: 'Apagar lista', perigo: true, fn: () => apagarLista(l, p) },
      ]));
    }));
  }
  async function apagarLista(l, p) {
    const fica = p.crm ? ` ${p.crm} já ${p.crm === 1 ? 'virou empresa e continua' : 'viraram empresas e continuam'} no CRM.` : '';
    const ok = await confirmar(`Apagar "${l.nome}"?`, `${num(l.total)} lead${l.total === 1 ? '' : 's'} da lista ${l.total === 1 ? 'some' : 'somem'} daqui.${fica} Não dá para desfazer.`, { rotulo: 'Apagar lista', perigo: true });
    if (!ok) return;
    const { error } = await sb.from('listas').delete().eq('id', l.id);
    if (error) { toast(erroAmigavel(error), 'erro'); return; }
    toast('Lista apagada');
    carregar();
  }

  await carregar();
  limpezas.push(ouvir('listas', debounce(carregar, 800)));
}

/* =============================== Detalhe da lista =============================== */
async function detalheLista(v, id) {
  v.innerHTML = `<div class="card">${esqueleto(8, 22)}</div>`;
  let lista, itens = [];
  let filtro = 'nao_importados', busca = '', ordem = 'score', pagina = 0;
  let triando = new Set(), triagemAgora = null;
  const POR_PAGINA = 50;
  const sel = new Set();

  async function carregar() {
    const [{ data: l, error: e1 }, { data: its, error: e2 }] = await Promise.all([
      sb.from('listas').select('*').eq('id', id).maybeSingle(),
      sb.from('lista_itens').select('*').eq('lista_id', id).order('score', { ascending: false }).limit(5000),
    ]);
    if (e1 || e2) throw e1 || e2;
    const { data: jt } = await sb.from('jobs').select('entrada,status,progresso').eq('tipo', 'triar_lista').eq('lista_id', id).in('status', ['fila', 'processando']);
    triando = new Set((jt || []).flatMap((j) => j.entrada?.item_ids || []));
    triagemAgora = (jt || []).find((j) => j.status === 'processando')?.progresso || null;
    if (!l) { v.innerHTML = vazio('alerta', 'Lista não encontrada', 'Ela pode ter sido excluída.', '<a class="btn sm" href="#/encontrar?aba=listas">Voltar às listas</a>'); return false; }
    lista = l; itens = its || [];
    return true;
  }

  function filtrados() {
    const q = busca.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    let r = itens.filter((i) => {
      if (filtro === 'alta' && (i.prioridade !== 'alta' || i.descartado)) return false;
      if (filtro === 'media' && (i.prioridade === 'baixa' || i.descartado)) return false;
      if (filtro === 'sem_site' && (!['sem', 'fora_do_ar'].includes(i.site_status) || i.descartado)) return false;
      if (filtro === 'whats' && (!i.whatsapp || i.descartado)) return false;
      if (filtro === 'nao_importados' && (i.empresa_id || i.descartado)) return false;
      if (filtro === 'importados' && !i.empresa_id) return false;
      if (filtro === 'descartados' && !i.descartado) return false;
      if (filtro === 'todos' && i.descartado) return false;
      if (q && !`${i.nome} ${i.categoria} ${i.cidade} ${i.bairro} ${i.instagram}`.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().includes(q)) return false;
      return true;
    });
    const cmp = { score: (a, b) => b.score - a.score, nome: (a, b) => a.nome.localeCompare(b.nome), seguidores: (a, b) => (b.instagram_seguidores || 0) - (a.instagram_seguidores || 0), avaliacoes: (a, b) => (b.google_avaliacoes || 0) - (a.google_avaliacoes || 0) }[ordem];
    return r.sort(cmp);
  }

  function desenhar() {
    const ativos = itens.filter((i) => !i.descartado);
    const cont = {
      todos: ativos.length, alta: ativos.filter((i) => i.prioridade === 'alta').length, media: ativos.filter((i) => i.prioridade !== 'baixa').length,
      sem_site: ativos.filter((i) => ['sem', 'fora_do_ar'].includes(i.site_status)).length, whats: ativos.filter((i) => i.whatsapp).length,
      nao_importados: ativos.filter((i) => !i.empresa_id).length, importados: itens.filter((i) => i.empresa_id).length, descartados: itens.filter((i) => i.descartado).length,
    };
    const lst = filtrados();
    const total = lst.length;
    pagina = Math.min(pagina, Math.max(0, Math.ceil(total / POR_PAGINA) - 1));
    const pag = lst.slice(pagina * POR_PAGINA, (pagina + 1) * POR_PAGINA);
    const selNaTela = pag.filter((i) => sel.has(i.id)).length;
    v.innerHTML = `
      <div class="cab"><div class="tt"><a class="btn xs fantasma" href="#/encontrar?aba=listas">${icone('setae')}Listas</a><h1 class="mt-8">${esc(lista.nome)}</h1>
        <p>${esc([lista.nicho, lista.cidade].filter(Boolean).join(' · '))}${lista.observacao ? ` · ${esc(lista.observacao)}` : ''} · criada ${relativo(lista.criado_em)}</p></div>
        <div class="acoes"><button class="btn claude" data-enriquecer>${sparkClaude(15)}Enriquecer top 10</button><button class="btn" data-csv>${icone('download')}CSV</button><button class="btn icone" data-mais aria-label="Mais">${icone('pontos')}</button></div></div>
      ${lista.status === 'processando' ? `<div class="aviso claude mb-16">${sparkClaude(18)}<div><b>O Claude ainda está farejando esta lista.</b> Os leads aparecem aqui conforme ele encontra.</div></div>` : ''}
      <div class="card destaque lista-resumo"><div class="icone-caixa">${icone('usuariomais')}</div>
        <div class="grow"><div class="resumo-num"><b>${num(cont.nao_importados)}</b> leads prontos pra entrar no funil</div><div class="dim">${num(cont.todos)} na lista · ${num(cont.alta)} alta prioridade · ${num(cont.sem_site)} sem site · ${num(cont.importados)} já no CRM</div></div>
        <div class="right row wrap" style="gap:8px;justify-content:flex-end">${(() => {
          const pend = ativos.filter((i) => !i.empresa_id && !triando.has(i.id)).length;
          const n = Math.min(10, ativos.filter((i) => !i.empresa_id && i.prioridade === 'alta').length);
          const tri = pend ? `<button class="btn prim" data-triagem title="O Claude confere cada lead (existe? o Spark acertou? tem gancho?): quem passa vai pro Novo, quem não passa é descartado com o motivo">${icone('radar')}Fazer a triagem</button>` : '';
          const dir = n ? `<button class="btn" data-importar-top title="Pula a triagem">${icone('setad')}Mandar os ${n} melhores direto</button>` : '';
          return tri || dir ? tri + dir : `<span class="dim" style="font-size:13px">${cont.nao_importados ? 'Nenhum de alta prioridade ainda: escolha na tabela abaixo.' : 'Tudo o que valia já está no funil.'}</span>`;
        })()}</div></div>
      ${triando.size ? `<div class="aviso claude mt-12">${sparkClaude(18)}<div><b>Triagem na fila: ${triando.size} lead${triando.size > 1 ? 's' : ''}.</b> ${triagemAgora ? esc(triagemAgora) : 'Começa quando o navegador do Farejador estiver livre (uma investigação ou triagem por vez).'} Quem passar aparece no Novo; o resumo chega no seu WhatsApp.</div></div>` : ''}
      <div class="chips mt-16">${[['nao_importados', 'Ainda fora do CRM'], ['alta', 'Alta oportunidade'], ['media', 'Média ou +'], ['sem_site', 'Sem site'], ['whats', 'Com WhatsApp'], ['importados', 'No CRM'], ['todos', 'Todos'], ['descartados', 'Descartados']]
        .map(([k, r]) => `<button class="chip ${filtro === k ? 'on' : ''}" data-filtro="${k}">${k === 'alta' ? icone('estrela') : ''}${r} <span class="n">${cont[k]}</span></button>`).join('')}</div>
      <div class="row wrap mt-16"><div class="busca grow" style="max-width:420px">${icone('busca')}<input class="inp" data-busca placeholder="Buscar por nome, bairro, @…" value="${esc(busca)}"></div>
        <select class="sel sm" data-ordem style="width:auto">${[['score', 'Maior score'], ['nome', 'Nome'], ['seguidores', 'Mais seguidores'], ['avaliacoes', 'Mais avaliações']].map(([k, r]) => `<option value="${k}"${ordem === k ? ' selected' : ''}>${r}</option>`).join('')}</select>
        <span class="grow"></span>
        ${sel.size ? `<span class="selo laranja">${sel.size} selecionado${sel.size > 1 ? 's' : ''}</span><button class="btn sm prim" data-bulk="importar">${icone('setad')}Pro funil</button><button class="btn sm claude" data-bulk="enriquecer">${sparkClaude(13)}Enriquecer</button><button class="btn sm" data-bulk="descartar">${icone('x')}Descartar</button><button class="btn sm fantasma" data-bulk="limpar">Limpar</button>` : ''}</div>
      <div class="card pad-0 mt-12"><div class="tabela-wrap"><table class="tabela tabela-leads">
        <thead><tr><th style="width:36px"><input type="checkbox" data-todos aria-label="Selecionar página" ${pag.length && selNaTela === pag.length ? 'checked' : ''}></th><th>Nome / empresa</th><th>Bairro / cidade</th><th>WhatsApp</th><th>Instagram</th><th>Google</th><th>Site</th><th>Score</th><th></th></tr></thead>
        <tbody>${pag.map((i) => linhaItem(i, sel.has(i.id))).join('') || `<tr><td colspan="9">${vazio('filtro', 'Nada neste filtro', 'Troque o filtro ou a busca.')}</td></tr>`}</tbody></table></div>
        ${total > POR_PAGINA ? `<div class="paginacao"><span>Mostrando ${pagina * POR_PAGINA + 1}–${Math.min(total, (pagina + 1) * POR_PAGINA)} de ${num(total)}</span><span class="grow"></span><button class="btn sm" data-pag="-1" ${pagina === 0 ? 'disabled' : ''}>${icone('cheve')}Anterior</button><button class="btn sm" data-pag="1" ${(pagina + 1) * POR_PAGINA >= total ? 'disabled' : ''}>Próxima${icone('chevd')}</button></div>` : `<div class="paginacao"><span>${num(total)} lead${total === 1 ? '' : 's'}</span></div>`}
      </div>`;
    ligar();
  }

  function linhaItem(i, marcado) {
    const [sc, st] = SITE[i.site_status] || SITE.desconhecido;
    const reg = detectarRegulado(`${i.categoria || ''} ${i.nome}`);
    return `<tr class="${marcado ? 'sel' : ''} ${i.descartado ? 'descartado' : ''}" data-item="${i.id}">
      <td><input type="checkbox" data-sel="${i.id}" ${marcado ? 'checked' : ''} aria-label="Selecionar ${esc(i.nome)}"></td>
      <td><div class="nm">${esc(i.nome)}</div><div class="sb">${esc(i.categoria || '—')}${reg ? ` · <span class="erro">${esc(reg)}</span>` : ''}</div></td>
      <td><div>${esc(i.bairro || '—')}</div><div class="sb">${esc(i.cidade || '')}</div></td>
      <td>${i.whatsapp ? `<a class="ok nowrap" href="https://wa.me/${i.whatsapp}" target="_blank" rel="noopener">${icone('check')} ${esc(telefoneBonito(i.whatsapp))}</a>` : i.telefone ? `<span class="dim nowrap">${esc(telefoneBonito(i.telefone))}</span>` : '<span class="fraco">—</span>'}</td>
      <td>${i.instagram ? `<a class="nowrap" href="https://instagram.com/${esc(i.instagram)}" target="_blank" rel="noopener">@${esc(i.instagram)}</a><div class="sb">${i.instagram_seguidores != null ? `${compacto(i.instagram_seguidores)} seg.` : ''}</div>` : '<span class="fraco">—</span>'}</td>
      <td class="nowrap">${i.google_nota != null ? `${String(i.google_nota).replace('.', ',')}★` : '<span class="fraco">—</span>'}<div class="sb">${i.google_avaliacoes != null ? `${i.google_avaliacoes} aval.` : ''}</div></td>
      <td><span class="selo ${sc}">${st}</span></td>
      <td><button class="score ${i.prioridade}" data-motivos="${i.id}" title="Ver por quê">${i.score}/100</button></td>
      <td class="nowrap">${i.empresa_id ? `<button class="btn xs verde" data-abrir-emp="${i.empresa_id}">${icone('check')}No CRM</button>` : i.descartado ? `<button class="btn xs" data-restaurar="${i.id}">Restaurar</button>` : `<button class="btn xs prim" data-importar="${i.id}">${icone('mais')}Funil</button>`}
        <button class="btn icone sm fantasma" data-menu-item="${i.id}" aria-label="Mais ações">${icone('pontos')}</button></td></tr>`;
  }

  function ligar() {
    $$('[data-filtro]', v).forEach((b) => (b.onclick = () => { filtro = b.dataset.filtro; pagina = 0; desenhar(); }));
    const bi = $('[data-busca]', v);
    bi.oninput = debounce(() => { busca = bi.value; pagina = 0; desenhar(); const n = $('[data-busca]', v); n.focus(); n.setSelectionRange(n.value.length, n.value.length); }, 250);
    $('[data-ordem]', v).onchange = (e) => { ordem = e.target.value; desenhar(); };
    $$('[data-pag]', v).forEach((b) => (b.onclick = () => { pagina += Number(b.dataset.pag); desenhar(); v.scrollTop = 0; }));
    $('[data-todos]', v).onchange = (e) => { const pag = filtrados().slice(pagina * POR_PAGINA, (pagina + 1) * POR_PAGINA); pag.forEach((i) => (e.target.checked ? sel.add(i.id) : sel.delete(i.id))); desenhar(); };
    $$('[data-sel]', v).forEach((cb) => (cb.onchange = () => { cb.checked ? sel.add(cb.dataset.sel) : sel.delete(cb.dataset.sel); desenhar(); }));
    $$('[data-importar]', v).forEach((b) => (b.onclick = async () => { botaoCarregando(b, true); await importar([b.dataset.importar]); }));
    $$('[data-restaurar]', v).forEach((b) => (b.onclick = async () => { await atualizarItens([b.dataset.restaurar], { descartado: false }); }));
    $$('[data-abrir-emp]', v).forEach((b) => (b.onclick = async () => (await import('../ficha.js')).abrirFicha(b.dataset.abrirEmp)));
    $$('[data-motivos]', v).forEach((b) => (b.onclick = () => modalItem(itens.find((i) => i.id === b.dataset.motivos))));
    $$('[data-menu-item]', v).forEach((b) => (b.onclick = () => {
      const it = itens.find((i) => i.id === b.dataset.menuItem);
      import('../ui.js').then(({ menu }) => menu(b, [
        { icone: 'olho', rotulo: 'Ver detalhes e motivos', fn: () => modalItem(it) },
        { icone: 'comentario', rotulo: 'Enriquecer com o Claude', fn: () => enriquecer([it.id]) },
        ...(it.whatsapp ? [{ icone: 'whatsapp', rotulo: 'Abrir WhatsApp', fn: () => window.open(`https://wa.me/${it.whatsapp}`, '_blank') }] : []),
        { icone: 'mapa', rotulo: 'Procurar no Google Maps', fn: () => window.open(`https://www.google.com/maps/search/${encodeURIComponent(`${it.nome} ${it.cidade || ''}`)}`, '_blank') },
        '-',
        it.descartado ? { icone: 'atualizar', rotulo: 'Restaurar', fn: () => atualizarItens([it.id], { descartado: false }) } : { icone: 'x', rotulo: 'Descartar (não-fit)', perigo: true, fn: () => atualizarItens([it.id], { descartado: true }) },
      ]));
    }));
    $$('[data-bulk]', v).forEach((b) => (b.onclick = async () => {
      const ids = [...sel];
      if (b.dataset.bulk === 'limpar') { sel.clear(); desenhar(); return; }
      if (b.dataset.bulk === 'importar') { botaoCarregando(b, true, 'Importando…'); await importar(ids); sel.clear(); desenhar(); }
      if (b.dataset.bulk === 'descartar') { await atualizarItens(ids, { descartado: true }); sel.clear(); desenhar(); }
      if (b.dataset.bulk === 'enriquecer') { await enriquecer(ids.slice(0, 15)); sel.clear(); desenhar(); }
    }));
    const btnTri = $('[data-triagem]', v);
    if (btnTri) btnTri.onclick = async () => {
      const { perguntar } = await import('../ui.js');
      const cand = itens.filter((i) => !i.descartado && !i.empresa_id && !triando.has(i.id)).sort((a, b) => b.score - a.score);
      const r = await perguntar(`Quantos leads passar pela triagem? (${cand.length} fora do CRM, do maior score pro menor)`, { valor: String(Math.min(10, cand.length)), placeholder: 'um número, ou "todos"', rotulo: 'Pôr na fila' });
      if (r == null) return;
      const n = /todos/i.test(r) ? cand.length : Math.max(0, Math.min(cand.length, parseInt(r, 10) || 0));
      if (!n) return;
      const alvo = cand.slice(0, n).map((i) => i.id);
      try {
        for (let k = 0; k < alvo.length; k += 8) await criarJob('triar_lista', { item_ids: alvo.slice(k, k + 8) }, { lista_id: id }, 5);
        toast(`${n} lead${n > 1 ? 's' : ''} na triagem, de 8 em 8${farejadorOnline() ? '' : ' (Farejador offline: roda quando ligar)'}`, 'info');
        for (const x of alvo) triando.add(x);
        desenhar();
      } catch (e) { toast(erroAmigavel(e), 'erro'); }
    };
    const btnTop = $('[data-importar-top]', v);
    if (btnTop) btnTop.onclick = async (e) => {
      const top = itens.filter((i) => !i.descartado && !i.empresa_id && i.prioridade === 'alta').sort((a, b) => b.score - a.score).slice(0, 10);
      if (!top.length) { toast('Nenhum lead de alta prioridade fora do CRM', 'info'); return; }
      botaoCarregando(e.currentTarget, true, 'Importando…');
      await importar(top.map((i) => i.id));
    };
    $('[data-enriquecer]', v).onclick = () => enriquecer(itens.filter((i) => !i.descartado && !i.empresa_id).sort((a, b) => b.score - a.score).slice(0, 10).map((i) => i.id));
    $('[data-csv]', v).onclick = () => baixarArquivo(`${lista.nome.replace(/[^\w-]+/g, '_')}.csv`, paraCSV(filtrados(), [
      { campo: 'nome' }, { campo: 'categoria' }, { campo: 'bairro' }, { campo: 'cidade' }, { campo: 'whatsapp' }, { campo: 'telefone' }, { campo: 'instagram' }, { campo: 'instagram_seguidores', rotulo: 'seguidores' },
      { campo: 'site' }, { campo: 'site_status' }, { campo: 'google_nota' }, { campo: 'google_avaliacoes' }, { campo: 'score' }, { campo: 'prioridade' }, { rotulo: 'motivos', valor: (i) => (i.score_motivos || []).map((m) => `+${m.pontos} ${m.sinal}`).join(' | ') },
    ]));
    $('[data-mais]', v).onclick = (e) => import('../ui.js').then(({ menu }) => menu(e.currentTarget, [
      { icone: 'atualizar', rotulo: 'Repontuar com a régua atual', fn: repontuar },
      { icone: 'editar', rotulo: 'Renomear lista', fn: async () => { const { perguntar } = await import('../ui.js'); const n = await perguntar('Nome da lista', { valor: lista.nome }); if (n && n.trim()) { await sb.from('listas').update({ nome: n.trim() }).eq('id', id); lista.nome = n.trim(); desenhar(); } } },
      '-',
      { icone: 'lixo', rotulo: 'Excluir lista', perigo: true, fn: async () => {
        if (!(await confirmar('Excluir a lista?', `${itens.length} leads da lista somem. Quem já está no CRM continua lá.`, { rotulo: 'Excluir', perigo: true }))) return;
        const { error } = await sb.from('listas').delete().eq('id', id);
        if (error) toast(erroAmigavel(error), 'erro'); else { toast('Lista excluída'); location.hash = '#/encontrar?aba=listas'; }
      } },
    ]));
  }

  async function atualizarItens(ids, campos) {
    const { error } = await sb.from('lista_itens').update(campos).in('id', ids);
    if (error) { toast(erroAmigavel(error), 'erro'); return; }
    for (const i of itens) if (ids.includes(i.id)) Object.assign(i, campos);
    desenhar();
  }

  async function importar(ids) {
    let novos = 0, ligados = 0;
    for (const itemId of ids) {
      const it = itens.find((i) => i.id === itemId);
      if (!it || it.empresa_id) continue;
      try {
        const dup = acharDuplicada(it);
        let empId = dup?.id;
        if (!dup) {
          const conselho = detectarRegulado(`${it.categoria || ''} ${it.nome}`);
          // A lista guarda dono/e-mail/observação juntos num texto só; a linha crua devolve cada um pro seu campo
          const cru = it.dados && Object.keys(it.dados).length ? linhaParaItem(it.dados, mapearColunas(Object.keys(it.dados))) : {};
          const emp = await criarEmpresa({
            nome: it.nome, categoria: it.categoria, cidade: it.cidade, bairro: it.bairro, endereco: it.endereco, telefone: it.telefone, whatsapp: it.whatsapp,
            instagram: it.instagram, instagram_seguidores: it.instagram_seguidores, site: it.site, site_status: it.site_status, google_nota: it.google_nota,
            google_avaliacoes: it.google_avaliacoes, gmb_status: it.gmb_status, roda_anuncio: it.roda_anuncio, cnpj: it.cnpj, score: it.score, prioridade: it.prioridade,
            score_motivos: it.score_motivos, regulado: Boolean(conselho), conselho, estagio: 'novo', relacao: 'lead',
            origem: lista.origem === 'claude' ? 'claude' : lista.origem === 'network' ? 'network' : 'spark', origem_detalhe: lista.nome, lista_item_id: it.id,
            decisor: cru.decisor || null, email: cru.email || null,
            // A lacuna que a lista apontou é a dor; o resumo guarda o que a lista sugeriu vender
            dor: cru.nome ? cru.observacao || null : null,
            resumo: cru.nome ? (cru.servico_sugerido ? `Serviço sugerido na lista: ${cru.servico_sugerido}` : null) : it.observacao, gancho: it.site_status === 'fora_do_ar' ? 'Site fora do ar (conferir antes de citar)' : it.site_status === 'sem' ? 'Não tem site próprio: quem procura no Google não acha' : null,
          });
          empId = emp.id; novos++;
        } else ligados++;
        await sb.from('lista_itens').update({ empresa_id: empId }).eq('id', it.id);
        it.empresa_id = empId;
      } catch (e) { toast(`${it.nome}: ${erroAmigavel(e)}`, 'erro'); }
    }
    toast(`${novos} lead${novos === 1 ? '' : 's'} no funil${ligados ? ` · ${ligados} já existia${ligados > 1 ? 'm' : ''} e foi${ligados > 1 ? 'ram' : ''} ligado${ligados > 1 ? 's' : ''}` : ''}`, 'ok', { acao: { rotulo: 'Ver esteira', fn: () => { location.hash = '#/esteira'; } } });
    desenhar();
  }

  async function enriquecer(ids) {
    if (!ids.length) { toast('Nada para enriquecer', 'info'); return; }
    try {
      await criarJob('enriquecer_lista', { item_ids: ids.slice(0, 15) }, { lista_id: id }, 5);
      toast(`${ids.length} leads na fila do Claude${farejadorOnline() ? '' : ' (Farejador offline: roda quando ligar)'}`, 'info');
    } catch (e) { toast(erroAmigavel(e), 'erro'); }
  }

  async function repontuar() {
    let mud = 0;
    for (const i of itens) {
      const p = pontuar(i, opcScore());
      if (p.score !== i.score) { await sb.from('lista_itens').update({ score: p.score, prioridade: p.prioridade, score_motivos: p.motivos }).eq('id', i.id); Object.assign(i, { score: p.score, prioridade: p.prioridade, score_motivos: p.motivos }); mud++; }
    }
    toast(`${mud} lead${mud === 1 ? '' : 's'} com score atualizado`); desenhar();
  }

  function modalItem(i) {
    const extras = Object.entries(i.dados || {}).filter(([, val]) => String(val || '').trim());
    modal({
      titulo: i.nome, subtitulo: [i.categoria, i.bairro, i.cidade].filter(Boolean).join(' · '), icone: 'predio', largo: true, pe: '',
      corpo: `<div class="row wrap gap-6 mb-12"><span class="score ${i.prioridade}">${i.score}/100</span><span class="selo ${SITE[i.site_status][0]}">${SITE[i.site_status][1]}</span>${i.empresa_id ? '<span class="selo verde">No CRM</span>' : ''}</div>
        <div class="rotulo mb-8">Por que essa pontuação</div>
        <div class="motivos">${(i.score_motivos || []).map((m) => `<div class="motivo"><b>+${m.pontos}</b><span>${esc(m.sinal)}</span><small class="dim">${esc(m.detalhe || '')}</small></div>`).join('') || '<p class="dim">Nenhum sinal pontuado: faltam dados (site, Instagram, Google).</p>'}</div>
        ${i.observacao ? `<div class="rotulo mt-16 mb-8">Observação</div><p>${esc(i.observacao)}</p>` : ''}
        ${extras.length ? `<details class="mt-16"><summary class="rotulo">Linha original da planilha</summary><div class="dados-grade mt-8">${extras.map(([k, val]) => `<div class="dado"><span>${esc(k)}</span><b>${esc(val)}</b></div>`).join('')}</div></details>` : ''}`,
    });
  }

  try { if (!(await carregar())) return; } catch (e) { v.innerHTML = vazio('alerta', 'Não carregou a lista', erroAmigavel(e)); return; }
  desenhar();
  const recarregar = debounce(async () => { try { if (await carregar()) desenhar(); } catch (e) { console.error(e); } }, 1500);
  const t1 = ouvir('listas', (p) => { if (p.new?.id === id) recarregar(); });
  const t2 = ouvir('jobs', (p) => { if (p.new?.lista_id === id && ['concluido', 'erro'].includes(p.new.status)) recarregar(); });
  return () => { t1(); t2(); };
}
