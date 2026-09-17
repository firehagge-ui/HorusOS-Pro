/* =============================================================================
   HOUND DOG — Instagram da Hórus: perfil, crescimento, posts e ideias do Claude
   ============================================================================= */
import { sb, estado, ouvir, criarJob, farejadorOnline, acompanharJob } from '../sb.js';
import { $, $$, esc, num, compacto, relativo, dataLonga, vazio, esqueleto, debounce, kpi, toast, erroAmigavel, botaoCarregando, preencherMarkdown } from '../ui.js';
import { icone, sparkClaude } from '../icones.js';

export default async function instagram(v) {
  const handle = estado.config.instagram?.handle || 'horuspublicidade';
  let ordem = 'recentes';
  v.innerHTML = `<div class="cab"><div class="tt"><h1>Instagram</h1><p>O painel do <b>@${esc(handle)}</b>: crescimento, o que engaja e o que postar.</p></div>
    <div class="acoes"><a class="btn" href="https://instagram.com/${esc(handle)}" target="_blank" rel="noopener">${icone('instagram')}Abrir perfil</a><button class="btn" data-manual-topo>${icone('editar')}Registrar na mão</button><button class="btn prim" data-coletar>${icone('atualizar')}Atualizar agora</button></div></div>
    <div data-corpo>${esqueleto(8, 30)}</div>`;

  async function carregar() {
    if (!v.isConnected) return;
    const [{ data: snaps, error }, { data: ideias }, { data: jobIg }] = await Promise.all([
      sb.from('instagram_snapshots').select('*').eq('handle', handle).order('coletado_em', { ascending: false }).limit(120),
      sb.from('pesquisas').select('*').eq('tipo', 'instagram').order('criado_em', { ascending: false }).limit(1),
      sb.from('jobs').select('*').in('tipo', ['instagram']).order('criado_em', { ascending: false }).limit(1),
    ]);
    const corpo = $('[data-corpo]', v);
    if (error) { corpo.innerHTML = vazio('alerta', 'Não carregou', erroAmigavel(error)); return; }
    const ultimo = snaps?.[0];
    const erroColeta = estado.farejador?.instagram_erro;
    if (!ultimo) {
      corpo.innerHTML = `<div class="card">${vazio('instagram', 'Ainda não tenho os números do perfil', 'O Instagram passou a exigir login para leitura de fora. Há três caminhos, do mais automático ao mais simples.',
        `<div class="row wrap" style="justify-content:center"><button class="btn prim" data-coletar2>${icone('atualizar')}Tentar coletar agora</button><button class="btn" data-manual>${icone('editar')}Registrar números na mão</button><a class="btn" href="#/ajustes?secao=instagram">${icone('ajustes')}Conectar a API oficial</a></div>`)}
        ${jobIg?.[0]?.status === 'erro' ? `<div class="aviso vermelho">${icone('alerta')}<div><b>A última coleta falhou</b><br>${esc(jobIg[0].erro || '')}</div></div>` : ''}
        ${erroColeta && !jobIg?.[0]?.erro ? `<div class="aviso vermelho mt-12">${icone('alerta')}<div>${esc(erroColeta)}</div></div>` : ''}
        <div class="aviso mt-12">${icone('info')}<div><b>Como funciona cada caminho</b><br>
          1. <b>API oficial</b> (recomendado): conta profissional ligada a uma página do Facebook. Você gera um token e cola em Ajustes → Instagram. Aí o Farejador atualiza sozinho a cada 6 horas, com alcance e impressões.<br>
          2. <b>Na mão</b>: você digita seguidores e publicações uma vez por semana. Serve para ver a curva de crescimento sem depender de nada.<br>
          3. <b>Pelo Claude</b>: peça no chat "atualiza os números do meu Instagram" com o navegador aberto no perfil — ele registra a leitura.</div></div></div>`;
      $('[data-coletar2]', corpo).onclick = coletar;
      $('[data-manual]', corpo).onclick = registrarManual;
      return;
    }
    const antigo = (dias) => snaps.find((s) => new Date(s.coletado_em) <= new Date(Date.now() - dias * 86400000));
    const delta = (dias) => { const a = antigo(dias); return a && a.seguidores != null && ultimo.seguidores != null ? ultimo.seguidores - a.seguidores : null; };
    const d7 = delta(7), d30 = delta(30);
    const posts = [...(ultimo.ultimos_posts || [])];
    if (ordem === 'melhores') posts.sort((a, b) => ((b.curtidas || 0) + (b.comentarios || 0) * 3) - ((a.curtidas || 0) + (a.comentarios || 0) * 3));
    const fmtDelta = (d) => (d == null ? 'sem histórico ainda' : `${d >= 0 ? '+' : ''}${num(d)}`);

    corpo.innerHTML = `
      <section class="card ig-perfil">
        ${ultimo.foto_url ? `<img class="ig-foto" src="${esc(ultimo.foto_url)}" alt="Foto do perfil @${esc(handle)}" referrerpolicy="no-referrer" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'ig-foto ig-foto-vazia',textContent:'H'}))">` : '<span class="ig-foto ig-foto-vazia">H</span>'}
        <div class="grow"><h2>${esc(ultimo.nome || handle)}</h2><div class="dim">@${esc(handle)}${ultimo.link_externo ? ` · <a href="${esc(ultimo.link_externo)}" target="_blank" rel="noopener">${esc(ultimo.link_externo.replace(/^https?:\/\//, ''))}</a>` : ''}</div>
          ${ultimo.bio ? `<p class="mt-8" style="white-space:pre-wrap">${esc(ultimo.bio)}</p>` : ''}</div>
        <div class="dim" style="font-size:12.5px;text-align:right">Coletado ${relativo(ultimo.coletado_em)}<br>${snaps.length} coleta${snaps.length > 1 ? 's' : ''} no histórico
          <br><span class="selo ${ultimo.fonte === 'graph' ? 'verde' : ultimo.fonte === 'manual' ? 'amarelo' : 'cinza'} mini">${esc({ graph: 'API oficial', manual: 'na mão', navegador: 'pelo navegador', publico: 'leitura pública' }[ultimo.fonte] || ultimo.fonte)}</span></div>
      </section>
      ${estado.config.instagram?.confirmado ? '' : `<div class="aviso laranja mt-12">${icone('alerta')}<div><b>Confirme se o @ é este mesmo.</b> O brandbook marca o Instagram da Hórus como <code>[FALTA]</code> e o site aponta para <b>@${esc(handle)}</b>. Se o perfil da agência for outro, troque em <a href="#/ajustes?secao=instagram">Ajustes → Instagram</a>.</div></div>`}
      ${erroColeta ? `<div class="aviso laranja mt-12">${icone('alerta')}<div><b>A última tentativa de coleta falhou.</b> Mostrando a coleta anterior. ${esc(erroColeta)}</div></div>` : ''}
      <div class="kpis mt-16">
        ${kpi({ icone: 'clientes', rotulo: 'Seguidores', valor: num(ultimo.seguidores), sub: `7 dias: ${fmtDelta(d7)} · 30 dias: ${fmtDelta(d30)}`, cor: 'violeta' })}
        ${kpi({ icone: 'imagem', rotulo: 'Publicações', valor: num(ultimo.posts), sub: `seguindo ${num(ultimo.seguindo)}` })}
        ${kpi({ icone: 'coracao', rotulo: 'Curtidas por post', valor: ultimo.media_curtidas != null ? num(Math.round(ultimo.media_curtidas)) : '—', sub: 'média dos últimos posts', cor: 'vermelho' })}
        ${kpi({ icone: 'comentario', rotulo: 'Comentários por post', valor: ultimo.media_comentarios != null ? num(Math.round(ultimo.media_comentarios * 10) / 10) : '—', sub: 'média dos últimos posts', cor: 'azul' })}
        ${kpi({ icone: 'tendencia', rotulo: 'Engajamento', valor: ultimo.engajamento != null ? `${String(ultimo.engajamento).replace('.', ',')}%` : '—', sub: '(curtidas + comentários) ÷ seguidores', cor: 'verde' })}
      </div>
      <div class="ig-grade">
        <section class="card"><div class="card-cab"><div class="icone-caixa sm violeta">${icone('tendencia')}</div><h3>Seguidores ao longo do tempo</h3></div>${grafico(snaps)}</section>
        <section class="card"><div class="card-cab"><div class="icone-caixa sm claude">${sparkClaude(18)}</div><div class="grow"><h3>O que postar</h3><p class="dim" style="font-size:12.5px">Ideias do Claude a partir do que engaja e do posicionamento da Hórus.</p></div><button class="btn sm claude" data-ideias>${sparkClaude(13)}${ideias?.[0] ? 'Novas ideias' : 'Gerar ideias'}</button></div>
          <div data-ideias-corpo>${ideias?.[0] ? (ideias[0].status === 'pronta' ? '<div class="md" data-md></div>' : `<p class="dim">${ideias[0].status === 'erro' ? 'Falhou: ' + esc(ideias[0].resumo || '') : 'O Claude está pensando nas ideias…'}</p>`) : '<p class="dim">Nenhuma ideia gerada ainda.</p>'}</div></section>
      </div>
      <section class="card mt-16"><div class="card-cab"><div class="icone-caixa sm">${icone('grade')}</div><h3>Últimas publicações</h3><div class="right"><div class="segmento">${[['recentes', 'Recentes'], ['melhores', 'Melhores']].map(([k, r]) => `<button data-ordem="${k}" class="${ordem === k ? 'on' : ''}">${r}</button>`).join('')}</div></div></div>
        ${posts.length ? `<div class="ig-posts">${posts.map((p) => {
          const eng = ultimo.seguidores ? (((p.curtidas || 0) + (p.comentarios || 0)) / ultimo.seguidores * 100) : null;
          return `<a class="ig-post" href="${esc(p.url || `https://instagram.com/p/${p.shortcode}`)}" target="_blank" rel="noopener">
            <div class="ig-thumb">${p.thumb ? `<img src="${esc(p.thumb)}" alt="${esc((p.legenda || 'Publicação').slice(0, 80))}" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">` : ''}${p.tipo === 'video' ? `<span class="ig-tipo">${icone('video')}</span>` : p.tipo === 'carrossel' ? `<span class="ig-tipo">${icone('quadros')}</span>` : ''}</div>
            <div class="ig-meta"><span>${icone('coracao')} ${compacto(p.curtidas ?? 0)}</span><span>${icone('comentario')} ${compacto(p.comentarios ?? 0)}</span>${p.views ? `<span>${icone('play')} ${compacto(p.views)}</span>` : ''}${eng != null ? `<span class="right">${eng.toFixed(1).replace('.', ',')}%</span>` : ''}</div>
            <p class="ig-legenda">${esc((p.legenda || '').slice(0, 120))}</p><small class="dim">${p.data ? dataLonga(p.data) : ''}</small></a>`;
        }).join('')}</div>` : vazio('imagem', 'Sem publicações na coleta', 'O perfil pode estar sem posts públicos.')}
      </section>`;
    if (ideias?.[0]?.status === 'pronta') preencherMarkdown($('[data-md]', corpo), ideias[0].conteudo_md || ideias[0].resumo || '');
    $$('[data-ordem]', corpo).forEach((b) => (b.onclick = () => { ordem = b.dataset.ordem; carregar(); }));
    $('[data-ideias]', corpo).onclick = async (ev) => {
      botaoCarregando(ev.currentTarget, true, 'Pedindo…');
      try {
        const job = await criarJob('ideias_instagram', { handle }, {}, 6);
        await sb.from('pesquisas').insert({ tipo: 'instagram', titulo: `Ideias de conteúdo @${handle}`, status: 'fila', job_id: job.id, criado_por: estado.eu?.nome });
        toast(farejadorOnline() ? 'O Claude está pensando nas ideias' : 'Na fila: roda quando o Farejador ligar', 'info');
        carregar();
      } catch (e) { toast(erroAmigavel(e), 'erro'); botaoCarregando(ev.currentTarget, false); }
    };
  }

  function grafico(snaps) {
    const pontos = [...snaps].reverse().filter((s) => s.seguidores != null);
    if (pontos.length < 2) return `<div class="vazio" style="padding:26px">${icone('tendencia')}<span>O gráfico aparece a partir da segunda coleta. O Farejador coleta a cada 6 horas.</span></div>`;
    const W = 640, H = 200, P = 28;
    const xs = pontos.map((s) => new Date(s.coletado_em).getTime()), ys = pontos.map((s) => s.seguidores);
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    const sx = (x) => P + ((x - minX) / Math.max(1, maxX - minX)) * (W - P * 2);
    const sy = (y) => H - P - ((y - minY) / Math.max(1, maxY - minY)) * (H - P * 2);
    const d = pontos.map((s, i) => `${i ? 'L' : 'M'}${sx(xs[i]).toFixed(1)} ${sy(ys[i]).toFixed(1)}`).join(' ');
    const area = `${d} L${sx(maxX).toFixed(1)} ${H - P} L${sx(minX).toFixed(1)} ${H - P} Z`;
    return `<svg class="grafico" viewBox="0 0 ${W} ${H}" role="img" aria-label="Seguidores de ${num(minY)} a ${num(maxY)}">
      <defs><linearGradient id="igg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff7a1a" stop-opacity=".35"/><stop offset="1" stop-color="#ff7a1a" stop-opacity="0"/></linearGradient></defs>
      <path d="${area}" fill="url(#igg)"/><path d="${d}" fill="none" stroke="#ff9a3d" stroke-width="2.5" stroke-linejoin="round"/>
      <text x="${P}" y="16" class="g-txt">${num(maxY)}</text><text x="${P}" y="${H - 8}" class="g-txt">${num(minY)}</text>
      <text x="${W - P}" y="${H - 8}" class="g-txt" text-anchor="end">${new Date(maxX).toLocaleDateString('pt-BR')}</text></svg>`;
  }

  async function registrarManual() {
    const { modal } = await import('../ui.js');
    const ultimo = (await sb.from('instagram_snapshots').select('*').eq('handle', handle).order('coletado_em', { ascending: false }).limit(1)).data?.[0];
    const m = modal({
      titulo: 'Registrar números na mão', subtitulo: `@${handle} · fica marcado como registro manual`, icone: 'editar',
      corpo: `<div class="grade-2">
          <div class="campo"><label>Seguidores *</label><input class="inp" type="number" min="0" data-k="seguidores" value="${ultimo?.seguidores ?? ''}"></div>
          <div class="campo"><label>Publicações</label><input class="inp" type="number" min="0" data-k="posts" value="${ultimo?.posts ?? ''}"></div>
          <div class="campo"><label>Seguindo</label><input class="inp" type="number" min="0" data-k="seguindo" value="${ultimo?.seguindo ?? ''}"></div>
          <div class="campo"><label>Curtidas por post (média)</label><input class="inp" type="number" min="0" step="0.1" data-k="media_curtidas" value="${ultimo?.media_curtidas ?? ''}"></div>
        </div>
        <div class="aviso">${icone('info')}<div>Abra o perfil no celular, anote os números e registre aqui. Uma vez por semana já desenha a curva de crescimento.</div></div>`,
      pe: '<button class="btn" data-fechar>Cancelar</button><button class="btn prim" data-ok>Registrar</button>',
    });
    m.el.querySelectorAll('[data-fechar]').forEach((b) => (b.onclick = () => m.fechar()));
    $('[data-ok]', m.el).onclick = async () => {
      const val = (k) => { const v = $(`[data-k="${k}"]`, m.el).value; return v === '' ? null : Number(v); };
      const seguidores = val('seguidores');
      if (!seguidores) { toast('Informe os seguidores', 'erro'); return; }
      const mc = val('media_curtidas');
      const { error } = await sb.from('instagram_snapshots').insert({
        handle, seguidores, posts: val('posts'), seguindo: val('seguindo'), media_curtidas: mc,
        engajamento: mc != null && seguidores ? Math.round((mc / seguidores) * 10000) / 100 : null,
        nome: ultimo?.nome || null, bio: ultimo?.bio || null, foto_url: ultimo?.foto_url || null, ultimos_posts: ultimo?.ultimos_posts || [], fonte: 'manual',
      });
      if (error) { toast(erroAmigavel(error), 'erro'); return; }
      m.fechar(); toast('Números registrados'); carregar();
    };
  }

  async function coletar(ev) {
    const btn = ev?.currentTarget;
    botaoCarregando(btn, true, 'Pedindo…');
    try {
      const job = await criarJob('instagram', { handle }, {}, 3);
      toast(farejadorOnline() ? 'Coletando o Instagram…' : 'Na fila: roda quando o Farejador ligar', 'info');
      const parar = acompanharJob(job.id, (j) => {
        if (j.status === 'concluido') { parar(); botaoCarregando(btn, false); carregar(); toast('Instagram atualizado'); }
        if (j.status === 'erro') { parar(); botaoCarregando(btn, false); toast(`Coleta falhou: ${j.erro || ''}`, 'erro'); carregar(); }
      });
      if (!farejadorOnline()) setTimeout(() => botaoCarregando(btn, false), 1500);
    } catch (e) { toast(erroAmigavel(e), 'erro'); botaoCarregando(btn, false); }
  }

  $('[data-coletar]', v).onclick = coletar;
  $('[data-manual-topo]', v)?.addEventListener('click', registrarManual);
  await carregar();
  const tiras = [ouvir('instagram_snapshots', debounce(carregar, 800)), ouvir('pesquisas', (p) => { if (p.new?.tipo === 'instagram') debounce(carregar, 800)(); })];
  return () => tiras.forEach((t) => t());
}
