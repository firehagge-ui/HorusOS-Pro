import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validar, montarHtml } from '../lib/carrossel.mjs';

const bom = {
  titulo: 'Teste',
  legenda: 'Legenda curta sem link.',
  slides: [
    { layout: 'capa-olho', titulo: 'Seu próximo cliente ainda não te segue.', enfase: 'ainda não te segue.' },
    { layout: 'grande', titulo: 'Quem te segue já te conhece.', enfase: 'já te conhece.', texto: 'Viu seu trabalho.' },
    { layout: 'busca', titulo: 'Quem te procura chega de outro jeito.', buscas: ['dentista na Pituba'] },
    { layout: 'citacao', titulo: 'O Google decide quem te acha.', desenho: { tipo: 'sublinha2', trecho: 'quem te acha.' } },
    { layout: 'cta', titulo: 'Quer saber o que aparece?' },
  ],
};

test('post bom passa no portão', () => { assert.deepEqual(validar(bom), []); });

test('portão pega o que a casa proíbe', () => {
  const ruim = {
    legenda: 'Veja em https://x.com — agora',
    slides: [
      { layout: 'grande', titulo: 'Sem capa — errado' },
      { layout: 'grande', titulo: 'x', fundo: 'claro' },
      { layout: 'grande', titulo: 'y', fundo: 'claro', desenho: { trecho: 'nada' } },
      { layout: 'inventado', titulo: 'z' },
    ],
  };
  const v = validar(ruim).join(' | ');
  for (const trecho of ['4 slides', 'capa', 'CTA', 'tracinho', 'mesmo fundo', 'desenho', 'não existe', 'link']) assert.match(v, new RegExp(trecho), trecho);
});

test('monta HTML com ênfase, desenho e fundos em rodízio', () => {
  const { html, slides } = montarHtml(bom, {});
  assert.match(html, /<em>ainda&nbsp;não te segue\.<\/em>|<em>ainda não te segue\.<\/em>/);
  assert.match(html, /<span class="sublinha2">quem te acha\.<\/span>/);
  assert.equal(slides[0].fundo, 'void');
  assert.equal(slides[4].fundo, 'eletrico');
  for (let i = 1; i < slides.length; i++) assert.notEqual(slides[i].fundo, slides[i - 1].fundo);
  assert.ok(!/\.\.\/\.\.\/site/.test(html), 'caminhos relativos viraram absolutos');
});
