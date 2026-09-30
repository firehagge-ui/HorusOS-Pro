import { test } from 'node:test';
import assert from 'node:assert/strict';
import { decidir } from '../lib/politica.mjs';
import { conferirConta } from '../lib/marca.mjs';

const pol = (extra = {}) => ({ fase: 1, graduacao: { aprovacoes_sem_edicao: 8 }, ...extra });

test('ação desconhecida e ação proibida nunca rodam', () => {
  assert.equal(decidir({ politica: pol({ fase: 3 }), acao: 'apagar_tudo' }).nivel, 'proibido');
  assert.equal(decidir({ politica: pol({ fase: 3 }), acao: 'excluir_post' }).nivel, 'proibido');
  assert.equal(decidir({ politica: pol({ fase: 3 }), acao: 'dm_iniciar' }).nivel, 'proibido');
  assert.equal(decidir({ politica: pol(), acao: undefined }).nivel, 'proibido');
});

test('fase 1: tudo que é público vai para a fila, leitura é automática', () => {
  assert.equal(decidir({ politica: pol(), acao: 'publicar_carrossel', formato: 'lista' }).nivel, 'fila');
  assert.equal(decidir({ politica: pol(), acao: 'ler' }).nivel, 'auto');
});

test('fase 2: formato gradua com 8 aprovações seguidas sem edição', () => {
  const p = pol({ fase: 2 });
  assert.equal(decidir({ politica: p, acao: 'publicar_carrossel', formato: 'lista', historico: { sequenciaSemEdicao: { lista: 7 } } }).nivel, 'fila');
  assert.equal(decidir({ politica: p, acao: 'publicar_carrossel', formato: 'lista', historico: { sequenciaSemEdicao: { lista: 8 } } }).nivel, 'auto');
  assert.equal(decidir({ politica: p, acao: 'publicar_carrossel', historico: { sequenciaSemEdicao: { lista: 99 } } }).nivel, 'fila');
});

test('DM e edição de perfil nunca são automáticas', () => {
  for (const acao of ['responder_dm', 'editar_bio', 'editar_foto', 'editar_destaque']) {
    assert.equal(decidir({ politica: pol({ fase: 3 }), acao }).nivel, 'fila', acao);
  }
});

test('marca regulada não publica sozinha nem na fase 3', () => {
  const r = decidir({ politica: pol({ fase: 3, regulado: true }), acao: 'publicar_story' });
  assert.equal(r.nivel, 'fila');
  assert.match(r.motivo, /regulada/);
  assert.equal(decidir({ politica: pol({ fase: 3, regulado: true }), acao: 'ler' }).nivel, 'auto');
});

test('risco acima de baixo derruba para a fila', () => {
  assert.equal(decidir({ politica: pol({ fase: 2 }), acao: 'responder_comentario', risco: 'baixo' }).nivel, 'auto');
  assert.equal(decidir({ politica: pol({ fase: 2 }), acao: 'responder_comentario', risco: 'medio' }).nivel, 'fila');
});

test('limite diário estourado vira fila', () => {
  const p = pol({ fase: 3, limites: { publicar_story: 4 } });
  assert.equal(decidir({ politica: p, acao: 'publicar_story', historico: { feitasHoje: { publicar_story: 3 } } }).nivel, 'auto');
  assert.equal(decidir({ politica: p, acao: 'publicar_story', historico: { feitasHoje: { publicar_story: 4 } } }).nivel, 'fila');
});

test('trava de conta: token de outra conta ou @ sem confirmar bloqueia escrita', () => {
  assert.match(conferirConta({ id: 'horus', handle: '[FALTA: x]' }, { username: 'horusagencia.br' }), /não foi confirmado/);
  assert.match(conferirConta({ id: 'horus', handle: '@horusagencia.br' }, { username: 'outra' }), /Nada será escrito/);
  assert.equal(conferirConta({ id: 'horus', handle: '@HorusAgencia.br' }, { username: 'horusagencia.br' }), null);
});
