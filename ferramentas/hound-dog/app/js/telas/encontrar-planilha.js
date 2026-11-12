/* =============================================================================
   HOUNDER — Enviar planilha (a única porta de entrada de planilha, desde 09/11/2026)
   Lê CSV ou Excel, mapeia as colunas, pontua e salva como uma busca.
   ============================================================================= */
import { sb, estado, acharDuplicada, quem } from '../sb.js';
import { $, $$, esc, toast, erroAmigavel, botaoCarregando, esqueleto, num, telefoneBonito, debounce, modal, vazio } from '../ui.js';
import { icone } from '../icones.js';
import { mapearColunas, linhaParaItem, pontuar, chaveDedupe } from '../score.js';

const CAMPOS = [
  ['nome', 'Nome do negócio *'], ['categoria', 'Nicho / categoria'], ['cidade', 'Cidade'], ['bairro', 'Bairro'], ['endereco', 'Endereço'],
  ['telefone', 'Telefone'], ['whatsapp', 'WhatsApp'], ['instagram', 'Instagram'], ['instagram_seguidores', 'Seguidores'], ['site', 'Site'],
  ['site_status', 'Situação do site'], ['google_nota', 'Nota no Google'], ['google_avaliacoes', 'Avaliações no Google'], ['gmb_status', 'Perfil no Google'],
  ['roda_anuncio', 'Roda anúncio'], ['cnpj', 'CNPJ'], ['decisor', 'Dono / decisor'], ['email', 'E-mail'], ['observacao', 'Observação'],
];
const SITE = { sem: ['vermelho', 'Sem site'], fora_do_ar: ['vermelho', 'Fora do ar'], ruim: ['amarelo', 'Fraco'], ok: ['verde', 'OK'], desconhecido: ['cinza', '?'] };
const opcScore = () => ({ pesos: estado.config.score, nichos: estado.config.nichos_conhecidos, praca: estado.config.praca?.regiao });

function maisComum(valores) {
  const c = {};
  for (const v of valores) if (v) c[v] = (c[v] || 0) + 1;
  return Object.entries(c).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
}

export function modalPlanilha(aoSalvar) {
  const m = modal({
    titulo: 'Enviar planilha', subtitulo: 'CSV ou Excel. O Hounder lê as colunas, pontua e cria uma busca.', icone: 'planilha', largo: true, pe: '',
    corpo: `<label class="gota" data-gota>${icone('upload')}<b>Arraste a planilha aqui</b><span>CSV, XLSX ou XLS · ou clique para escolher</span><input type="file" accept=".csv,.tsv,.txt,.xlsx,.xls,text/csv" data-arquivo aria-label="Escolher planilha"></label><div data-previa class="mt-16"></div>`,
  });
  const previa = $('[data-previa]', m.el);
  const gota = $('[data-gota]', m.el);
  ['dragenter', 'dragover'].forEach((ev) => gota.addEventListener(ev, (e) => { e.preventDefault(); gota.classList.add('sobre'); }));
  ['dragleave', 'drop'].forEach((ev) => gota.addEventListener(ev, () => gota.classList.remove('sobre')));
  gota.addEventListener('drop', (e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) lerArquivo(f); });
  $('[data-arquivo]', m.el).onchange = (e) => { const f = e.target.files?.[0]; if (f) lerArquivo(f); e.target.value = ''; };

  async function lerArquivo(f) {
    previa.innerHTML = esqueleto(6);
    try {
      const base = f.name.replace(/\.[^.]+$/, '');
      if (/\.xlsx?$/i.test(f.name)) {
        const XLSX = await import('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm');
        const wb = XLSX.read(await f.arrayBuffer(), { type: 'array' });
        const linhas = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '', raw: false });
        mostrarPrevia(linhas, Object.keys(linhas[0] || {}), base, f.name);
        return;
      }
      const Papa = (await import('https://cdn.jsdelivr.net/npm/papaparse@5.7.0/+esm')).default;
      const r = Papa.parse((await f.text()).replace(/^﻿/, ''), { header: true, skipEmptyLines: 'greedy', transformHeader: (h) => h.trim() });
      const linhas = r.data.filter((l) => Object.values(l).some((x) => String(x || '').trim()));
      if (!linhas.length) { previa.innerHTML = vazio('alerta', 'Não achei linhas com dados', 'Confira se a primeira linha tem os nomes das colunas.'); return; }
      mostrarPrevia(linhas, r.meta.fields.filter(Boolean), base, f.name);
    } catch (e) { previa.innerHTML = vazio('alerta', 'Não consegui ler o arquivo', erroAmigavel(e)); }
  }

  function mostrarPrevia(linhas, cabecalhos, nomeBase, arquivo) {
    let mapa = mapearColunas(cabecalhos);
    const hoje = new Date().toLocaleDateString('pt-BR');
    previa.innerHTML = `
      <div class="grade-2">
        <div class="campo"><label>Nome da busca</label><input class="inp" data-nome value="${esc(`${nomeBase} · ${hoje}`)}"></div>
        <div class="campo"><label>Origem</label><select class="sel" data-origem><option value="planilha" selected>Planilha</option><option value="spark">Gemini Spark</option><option value="network">Network</option></select></div>
        <div class="campo"><label>Nicho (se a planilha não trouxer)</label><input class="inp" data-nicho-padrao placeholder="Ex.: odontologia"></div>
        <div class="campo"><label>Cidade (se a planilha não trouxer)</label><input class="inp" data-cidade-padrao placeholder="Ex.: Salvador"></div>
      </div>
      <details class="mapa-colunas" ${mapa.nome ? '' : 'open'}><summary>${icone('filtro')}Colunas <span class="dim">(${Object.keys(mapa).length} reconhecidas de ${cabecalhos.length})</span></summary>
        <div class="grade-2 mt-12">${CAMPOS.map(([k, r]) => `<div class="campo"><label>${esc(r)}</label><select class="sel sm" data-mapa="${k}"><option value="">(não tem)</option>${cabecalhos.map((h) => `<option${mapa[k] === h ? ' selected' : ''}>${esc(h)}</option>`).join('')}</select></div>`).join('')}</div>
      </details>
      <div class="rotulo mt-16 mb-8">Prévia pontuada (${num(linhas.length)} linhas lidas)</div><div data-top></div>
      <div class="row wrap mt-16"><button class="btn prim" data-salvar>${icone('check')}Pontuar e salvar</button><span class="dim" data-dup style="font-size:13px"></span></div>`;
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
      $('[data-top]', previa).innerHTML = itens.length ? `<div class="tabela-wrap"><table class="tabela"><thead><tr><th>Negócio</th><th>Telefone</th><th>Site</th><th>Score</th></tr></thead><tbody>${itens.slice(0, 6).map((i) => `<tr><td><div class="nm">${esc(i.nome)}</div><div class="sb">${esc([i.categoria, i.bairro || i.cidade].filter(Boolean).join(' · '))}</div></td><td class="nowrap">${i.whatsapp || i.telefone ? esc(telefoneBonito(i.whatsapp || i.telefone)) : '—'}</td><td><span class="selo ${SITE[i.site_status][0]}">${SITE[i.site_status][1]}</span></td><td><span class="score sm ${i.prioridade}">${i.score}</span></td></tr>`).join('')}</tbody></table></div>`
        : vazio('alerta', 'Nenhuma linha com nome', 'Escolha a coluna "Nome do negócio".');
      $('[data-dup]', previa).textContent = `${itens.length} com nome · ${itens.filter((i) => i.prioridade === 'alta').length} alta prioridade${dups ? ` · ${dups} já estão no CRM` : ''}`;
    };
    $$('[data-mapa]', previa).forEach((s) => (s.onchange = () => { mapa = { ...mapa, [s.dataset.mapa]: s.value || undefined }; if (!s.value) delete mapa[s.dataset.mapa]; desenharTop(); }));
    $$('[data-nicho-padrao],[data-cidade-padrao]', previa).forEach((i) => (i.oninput = debounce(desenharTop, 300)));
    desenharTop();

    $('[data-salvar]', previa).onclick = async (ev) => {
      const itens = calc();
      if (!itens.length) { toast('Escolha a coluna do nome', 'erro'); return; }
      const btn = ev.currentTarget;
      botaoCarregando(btn, true, 'Salvando…');
      try {
        const vistos = new Set(), unicos = [];
        for (const i of itens) { const k = chaveDedupe(i); if (!vistos.has(k)) { vistos.add(k); unicos.push(i); } }
        const nichoP = $('[data-nicho-padrao]', previa).value.trim() || null;
        const cidadeP = $('[data-cidade-padrao]', previa).value.trim() || null;
        const { data: lista, error } = await sb.from('listas').insert({
          nome: $('[data-nome]', previa).value.trim() || `Planilha ${hoje}`, origem: $('[data-origem]', previa).value,
          nicho: nichoP || maisComum(unicos.map((i) => i.categoria)), cidade: cidadeP || maisComum(unicos.map((i) => i.cidade)),
          arquivo_nome: arquivo, total: unicos.length, status: 'pronta', criado_por: quem(),
          observacao: itens.length !== unicos.length ? `${itens.length - unicos.length} linhas repetidas foram unificadas.` : null,
        }).select().single();
        if (error) throw error;
        for (let i = 0; i < unicos.length; i += 400) {
          const lote = unicos.slice(i, i + 400).map((it) => {
            const dup = acharDuplicada(it);
            return {
              lista_id: lista.id, nome: it.nome, categoria: it.categoria, cidade: it.cidade, bairro: it.bairro, endereco: it.endereco, telefone: it.telefone, whatsapp: it.whatsapp, instagram: it.instagram,
              instagram_seguidores: it.instagram_seguidores != null ? Math.round(it.instagram_seguidores) : null, site: it.site, site_status: it.site_status, google_nota: it.google_nota,
              google_avaliacoes: it.google_avaliacoes != null ? Math.round(it.google_avaliacoes) : null, gmb_status: it.gmb_status, roda_anuncio: it.roda_anuncio, cnpj: it.cnpj,
              observacao: [it.decisor ? `Decisor: ${it.decisor}` : '', it.email ? `E-mail: ${it.email}` : '', it.observacao || ''].filter(Boolean).join(' · ') || null,
              dados: it.dados, score: it.score, score_motivos: it.score_motivos, prioridade: it.prioridade, empresa_id: dup?.id || null,
            };
          });
          const { error: e2 } = await sb.from('lista_itens').insert(lote);
          if (e2) throw e2;
        }
        toast(`Planilha salva: ${unicos.length} empresas pontuadas`);
        m.fechar();
        aoSalvar?.(lista.id);
      } catch (e) { toast(erroAmigavel(e), 'erro'); botaoCarregando(btn, false); }
    };
  }
}
