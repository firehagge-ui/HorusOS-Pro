import { test } from 'node:test';
import assert from 'node:assert/strict';
import { criarCliente, classificarErro, normalizarInsights, ErroMeta } from '../lib/meta.mjs';

/** fetch falso: recebe uma lista de respostas por ordem, ou uma função (url, op) => resposta. */
function fetchFalso(roteiro) {
  const chamadas = [];
  const f = async (url, op = {}) => {
    const u = new URL(url);
    chamadas.push({ metodo: op.method, caminho: u.pathname, params: Object.fromEntries(op.body ? op.body : u.searchParams) });
    const r = typeof roteiro === 'function' ? roteiro(u, op, chamadas.length) : roteiro.shift();
    if (r instanceof Error) throw r;
    return { ok: (r.status || 200) < 400, status: r.status || 200, json: async () => r.corpo };
  };
  f.chamadas = chamadas;
  return f;
}
const cli = (fetch, extra = {}) => criarCliente({ token: 'SEGREDO123', userId: '17841', fetch, esperaBaseMs: 1, ...extra });

test('classifica os erros da Graph API', () => {
  assert.equal(classificarErro(400, { error: { code: 190, message: 'expired' } }).tipo, 'auth');
  assert.equal(classificarErro(400, { error: { code: 4 } }).tipo, 'limite');
  assert.equal(classificarErro(429, {}).tipo, 'limite');
  assert.equal(classificarErro(403, { error: { code: 10 } }).tipo, 'permissao');
  assert.equal(classificarErro(400, { error: { code: 100, is_transient: true } }).tipo, 'transitorio');
  assert.equal(classificarErro(503, {}).tipo, 'transitorio');
  assert.equal(classificarErro(400, { error: { code: 100 } }).tipo, 'parametro');
});

test('repete erro transitório e desiste de erro de token', async () => {
  const f = fetchFalso([{ status: 500, corpo: { error: { code: 2 } } }, { corpo: { username: 'horus' } }]);
  assert.equal((await cli(f).perfil()).username, 'horus');
  assert.equal(f.chamadas.length, 2);

  const g = fetchFalso([{ status: 400, corpo: { error: { code: 190, message: 'token SEGREDO123 inválido' } } }]);
  await assert.rejects(cli(g).perfil(), (e) => e.tipo === 'auth' && !e.message.includes('SEGREDO123'));
  assert.equal(g.chamadas.length, 1);
});

test('nunca vaza o token em erro de rede', async () => {
  const f = fetchFalso(() => new Error('ECONNRESET em https://x/?access_token=SEGREDO123'));
  await assert.rejects(cli(f, { tentativas: 2 }).perfil(), (e) => e.tipo === 'transitorio' && !e.message.includes('SEGREDO123'));
});

test('métrica aposentada é descartada e o resto é coletado', async () => {
  const eventos = [];
  const f = fetchFalso((u) => {
    const pedidas = u.searchParams.get('metric').split(',');
    if (pedidas.includes('profile_visits')) return { status: 400, corpo: { error: { code: 100, message: 'metric[8] must be one of ... profile_visits is not supported' } } };
    return { corpo: { data: pedidas.map((m) => ({ name: m, values: [{ value: 3 }] })) } };
  });
  const r = await cli(f, { aoRegistrar: (e) => eventos.push(e) }).metricasMidia('999', 'FEED');
  assert.deepEqual(r.descartadas, ['profile_visits']);
  assert.equal(r.valores.reach, 3);
  assert.equal(r.valores.profile_visits, undefined);
  assert.equal(eventos[0].evento, 'metrica_descartada');
});

test('normaliza total_value, values e quebras por tipo', () => {
  const v = normalizarInsights([
    { name: 'reach', total_value: { value: 120 } },
    { name: 'views', values: [{ value: 5 }, { value: 9 }] },
    { name: 'follows_and_unfollows', total_value: { value: 0, breakdowns: [{ results: [{ dimension_values: ['FOLLOWER'], value: 4 }, { dimension_values: ['NON_FOLLOWER'], value: 1 }] }] } },
  ]);
  assert.equal(v.reach, 120);
  assert.equal(v.views, 9);
  assert.equal(v['follows_and_unfollows.FOLLOWER'], 4);
});

test('carrossel: cria filhos, espera, cria pai e publica', async () => {
  let n = 0;
  const f = fetchFalso((u, op) => {
    const c = u.pathname;
    if (op.method === 'POST' && c.endsWith('/media')) return { corpo: { id: `c${++n}` } };
    if (op.method === 'GET' && /\/c\d+$/.test(c)) return { corpo: { status_code: 'FINISHED' } };
    if (c.endsWith('/media_publish')) return { corpo: { id: 'post1' } };
    if (c.endsWith('/post1')) return { corpo: { permalink: 'https://instagram.com/p/x', timestamp: '2026-09-27T12:00:00+0000' } };
    return { status: 404, corpo: { error: { code: 100, message: `rota inesperada ${c}` } } };
  });
  const r = await cli(f).publicarCarrossel({ urls: ['https://a/1.png', 'https://a/2.png'], legenda: 'oi' });
  assert.equal(r.mediaId, 'post1');
  assert.equal(r.permalink, 'https://instagram.com/p/x');
  const pai = f.chamadas.find((c) => c.params.media_type === 'CAROUSEL');
  assert.equal(pai.params.children, 'c1,c2');
});

test('simular não chama media_publish', async () => {
  const f = fetchFalso((u, op) => (op.method === 'POST' ? { corpo: { id: 'c1' } } : { corpo: { status_code: 'FINISHED' } }));
  const r = await cli(f).publicarImagem({ url: 'https://a/1.png', simular: true });
  assert.equal(r.simulado, true);
  assert.ok(!f.chamadas.some((c) => c.caminho.endsWith('/media_publish')));
});

test('publicação que falhou mas já foi ao ar é recuperada, não repetida', async () => {
  let publicou = 0;
  const f = fetchFalso((u, op) => {
    const c = u.pathname;
    if (op.method === 'POST' && c.endsWith('/media')) return { corpo: { id: 'c1' } };
    if (c.endsWith('/media_publish')) { publicou++; return { status: 500, corpo: { error: { code: 2, message: 'timeout' } } }; }
    if (op.method === 'GET' && c.endsWith('/c1')) return { corpo: { status_code: u.searchParams.get('fields') === 'status_code' ? 'PUBLISHED' : 'FINISHED' } };
    if (c.endsWith('/17841/media')) return { corpo: { data: [{ id: 'real9', caption: 'legenda única' }] } };
    if (c.endsWith('/real9')) return { corpo: { permalink: 'https://instagram.com/p/real9' } };
    return { status: 404, corpo: { error: { code: 100 } } };
  });
  const r = await cli(f).publicarImagem({ url: 'https://a/1.png', legenda: 'legenda única' });
  assert.equal(r.mediaId, 'real9');
  assert.equal(publicou, 1);
});

test('recusa antes de chamar a API o que a Meta recusaria', async () => {
  const f = fetchFalso([]);
  await assert.rejects(cli(f).publicarCarrossel({ urls: ['https://a/1.png'] }), ErroMeta);
  await assert.rejects(cli(f).publicarImagem({ url: 'http://a/1.png' }), /https/);
  await assert.rejects(cli(f).publicarImagem({ url: 'https://a/1.png', legenda: 'x'.repeat(2201) }), /2\.200/);
  assert.equal(f.chamadas.length, 0);
});
