// Abre o Hounder com DADOS DE DEMONSTRAÇÃO: toda chamada ao Supabase é interceptada e respondida
// aqui (nada chega ao banco real), e o print sai sem nenhum lead de verdade.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const APP = 'E:/Users/hagge/Downloads/HorusOS/ferramentas/hound-dog/app';
const out = process.argv[2]; const rota = process.argv[3] || 'esteira';
const agora = Date.now(); const dia = 864e5; const iso = (d) => new Date(agora - d * dia).toISOString();
const ESTAGIOS = [['novo', 'Novo', 10, '#4b93e6', 'aberto'], ['qualificado', 'Qualificado', 20, '#8b5cf6', 'aberto'], ['abordado', 'Abordado', 30, '#c084fc', 'aberto'], ['conversando', 'Conversando', 40, '#f4c430', 'aberto'], ['reuniao', 'Reunião marcada', 50, '#ff8a3d', 'aberto'], ['proposta', 'Proposta', 60, '#22d3ee', 'aberto'], ['negociacao', 'Negociação', 70, '#fb923c', 'aberto'], ['ganho', 'Ganho', 80, '#25d366', 'ganho'], ['followup', 'Follow-up frio', 90, '#64748b', 'espera'], ['perdido', 'Perdido / não-fit', 100, '#ef4444', 'perdido']]
  .map(([id, nome, ordem, cor, tipo]) => ({ id, funil: 'prospeccao', nome, ordem, cor, tipo, descricao: '' }));
// nome, categoria, bairro, estágio, score, prioridade, temperatura, valor, próxima ação, dias, site
const D = [
  ['Studio Pilates Equilíbrio', 'Pilates', 'Pituba', 'novo', 82, 'alta', null, 0, null, 1, 'sem'],
  ['Ótica Visão Clara', 'Ótica', 'Itaigara', 'novo', 74, 'media', null, 0, null, 2, 'ruim'],
  ['Pet Shop Patas e Cia', 'Pet shop', 'Imbuí', 'novo', 61, 'media', null, 0, null, 3, 'desconhecido'],
  ['Barbearia Navalha', 'Barbearia', 'Rio Vermelho', 'qualificado', 88, 'alta', 'quente', 1500, 'Enviar a prévia da página', 1, 'sem'],
  ['Escola de Idiomas Fluente', 'Escola de idiomas', 'Graça', 'qualificado', 70, 'media', null, 1800, 'Conferir horário de funcionamento', 4, 'ok'],
  ['Doceria Açúcar Mascavo', 'Doceria', 'Barra', 'abordado', 77, 'alta', null, 1500, 'Aguardar resposta', 2, 'sem'],
  ['Auto Escola Via Certa', 'Autoescola', 'Brotas', 'abordado', 58, 'baixa', 'frio', 0, 'Aguardar resposta', 5, 'fora_do_ar'],
  ['Oficina Motor Forte', 'Oficina mecânica', 'Lauro de Freitas', 'conversando', 91, 'alta', 'quente', 2000, 'Marcar reunião na quinta', 1, 'sem'],
  ['Floricultura Jardim Secreto', 'Floricultura', 'Graça', 'conversando', 79, 'alta', null, 1500, 'Mandar dois horários', 2, 'ruim'],
  ['Academia Força Total', 'Academia', 'Stiep', 'reuniao', 85, 'alta', 'quente', 2400, 'Reunião amanhã às 10h', 3, 'ok'],
  ['Restaurante Sabor do Mar', 'Restaurante', 'Rio Vermelho', 'proposta', 83, 'alta', 'quente', 2650, 'Retornar sobre a proposta', 2, 'sem'],
  ['Lavanderia Bolha Azul', 'Lavanderia', 'Caminho das Árvores', 'negociacao', 80, 'media', null, 1800, 'Confirmar a entrada', 1, 'ok'],
  ['Imobiliária Porto Novo', 'Imobiliária', 'Pituba', 'ganho', 90, 'alta', null, 3200, null, 6, 'ok'],
  ['Café da Praça', 'Cafeteria', 'Barra', 'ganho', 76, 'media', null, 1500, null, 9, 'ok'],
  ['Papelaria Ponto e Vírgula', 'Papelaria', 'Federação', 'followup', 55, 'baixa', 'frio', 0, 'Retomar em novembro', 20, 'sem'],
];
const empresas = D.map((d, i) => ({ id: 'demo-' + i, nome: d[0], categoria: d[1], bairro: d[2], cidade: 'Salvador', estagio: d[3], score: d[4], prioridade: d[5], temperatura: d[6], valor_estimado: d[7] || null, proxima_acao: d[8], proxima_acao_em: d[8] ? new Date(agora + dia).toISOString() : null, estagio_em: iso(d[9]), atualizado_em: iso(d[9] / 2), criado_em: iso(d[9] + 5), site_status: d[10], relacao: d[3] === 'ganho' ? 'cliente' : 'lead', arquivado: false, regulado: false, tags: [], origem: 'demo' }));
const TAB = { operadores: { user_id: 'demo', nome: 'Demonstração', email: 'demo@exemplo.com', papel: 'dono' }, estagios: ESTAGIOS, empresas, config: [], playbook_objecoes: [], farejador_status: { id: 'principal', online_em: new Date().toISOString() } };
const tok = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const jwt = [tok({ alg: 'HS256', typ: 'JWT' }), tok({ sub: 'demo', exp: Math.floor(agora / 1000) + 36000, role: 'authenticated' }), 'x'].join('.');
const user = { id: 'demo', aud: 'authenticated', role: 'authenticated', email: 'demo@exemplo.com' };
const sessao = { access_token: jwt, token_type: 'bearer', expires_in: 36000, expires_at: Math.floor(agora / 1000) + 36000, refresh_token: 'demo', user };
const tipos = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.json': 'application/json', '.woff2': 'font/woff2' };
(async () => {
  const b = await chromium.launch({ executablePath: 'C:/Users/hagge/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe' });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(([k, v]) => { localStorage.setItem(k, v); localStorage.setItem('hd-esteira', JSON.stringify({ modo: 'kanban', fechados: true })); }, ['hound-dog-sessao', JSON.stringify(sessao)]);
  await ctx.route('http://hounder.demo/**', async (r) => {
    let p = new URL(r.request().url()).pathname; if (p === '/') p = '/index.html';
    const f = path.join(APP, p); if (!fs.existsSync(f)) return r.fulfill({ status: 404, body: '' });
    r.fulfill({ status: 200, contentType: tipos[path.extname(f)] || 'application/octet-stream', body: fs.readFileSync(f) });
  });
  await ctx.route('**/*.supabase.co/**', async (r) => {
    const u = new URL(r.request().url()); const m = r.request().method();
    if (u.pathname.startsWith('/auth/')) return r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(u.pathname.includes('/user') ? user : sessao) });
    if (m !== 'GET' && m !== 'HEAD') return r.fulfill({ status: 200, contentType: 'application/json', body: '[]' }); // nenhuma escrita sai daqui
    const t = u.pathname.split('/rest/v1/')[1] || ''; let d = TAB[t];
    const um = (r.request().headers()['accept'] || '').includes('vnd.pgrst.object');
    if (d === undefined) d = um ? null : []; if (um && Array.isArray(d)) d = d[0] || null; if (!um && d && !Array.isArray(d)) d = [d];
    const n = Array.isArray(d) ? d.length : 1;
    r.fulfill({ status: 200, contentType: 'application/json', headers: { 'content-range': `0-${n}/${n}` }, body: JSON.stringify(d) });
  });
  await ctx.routeWebSocket(/supabase\.co/, () => {});
  const pg = await ctx.newPage(); const erros = []; pg.on('pageerror', (e) => erros.push(e.message));
  await pg.goto('http://hounder.demo/#/' + rota, { waitUntil: 'networkidle' }); await pg.waitForTimeout(3500);
  await pg.screenshot({ path: `${out}/hounder-${rota}.png` });
  console.log('ok', rota, 'erros:', erros.slice(0, 3));
  await b.close();
})();
