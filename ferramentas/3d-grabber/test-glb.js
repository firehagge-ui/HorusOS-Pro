// Self-check do exportador GLB: roda inject.js num three.js falso e valida o binario.
// node test-glb.js
const fs = require('fs'), assert = require('assert');

let captured;
globalThis.window = globalThis;
globalThis.location = { hostname: 'exemplo.com' };
globalThis.document = { createElement: () => ({ click() {}, remove() {} }), body: { appendChild() {} } };
globalThis.URL.createObjectURL = (b) => (captured = b, 'blob:test');
globalThis.URL.revokeObjectURL = () => {};

eval(fs.readFileSync(__dirname + '/extension/inject.js', 'utf8'));

const mat = (tx=0, ty=0, tz=0) => [1,0,0,0, 0,1,0,0, 0,0,1,0, tx,ty,tz,1];
const mkMesh = (name, attributes, index, matrixWorld = mat()) => ({
  isMesh: true, visible: true, name,
  geometry: { attributes, index },
  material: { uuid: 'm1', name: 'mat', color: { toArray: () => [1, 0, 0] }, opacity: 1, metalness: 0.5, roughness: 0.2 },
  matrixWorld: { elements: matrixWorld },
  updateWorldMatrix() {},
});

// mesh A: atributos simples
const A = mkMesh('a', {
  position: { array: new Float32Array([0,0,0, 1,0,0, 0,1,0]), itemSize: 3, count: 3 },
  normal:   { array: new Float32Array([0,0,1, 0,0,1, 0,0,1]), itemSize: 3, count: 3 },
}, { array: new Uint16Array([0, 1, 2]), count: 3 });

// mesh B: position interleaved (stride 5: xyz + uv) e uv Uint16 normalizado
const inter = new Float32Array([0,0,0,0,0,  2,0,0,1,0,  0,2,0,0,1]);
const B = mkMesh('b', {
  position: { isInterleavedBufferAttribute: true, itemSize: 3, count: 3, offset: 0, data: { array: inter, stride: 5 } },
  uv: { array: new Uint16Array([0,0, 65535,0, 0,65535]), itemSize: 2, count: 3, normalized: true },
}, null, mat(0, 0, 5)); // transladado: exercita o applyM do bounds()

window.__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent('observe', {
  detail: { isScene: true, traverse: (cb) => { cb(A); cb(B); } },
}));

(async () => {
  assert.deepStrictEqual(window.__3DGRAB__.list(), { scenes: 1, meshes: 2, triangles: 2 });

  const r = await window.__3DGRAB__.export();
  assert.ok(r.ok, 'export falhou');

  const glb = Buffer.from(await captured.arrayBuffer());
  assert.strictEqual(glb.readUInt32LE(0), 0x46546c67, 'magic glTF');
  assert.strictEqual(glb.readUInt32LE(8), glb.length, 'length no header bate com o arquivo');

  const jsonLen = glb.readUInt32LE(12);
  assert.strictEqual(glb.readUInt32LE(16), 0x4e4f534a, 'chunk JSON');
  const j = JSON.parse(glb.slice(20, 20 + jsonLen).toString());

  const binOff = 20 + jsonLen;
  assert.strictEqual(glb.readUInt32LE(binOff + 4), 0x004e4942, 'chunk BIN');
  const binLen = glb.readUInt32LE(binOff);
  assert.strictEqual(binOff + 8 + binLen, glb.length, 'BIN vai ate o fim');

  for (const v of j.bufferViews) {
    assert.strictEqual(v.byteOffset % 4, 0, 'bufferView alinhado em 4 bytes');
    assert.ok(v.byteOffset + v.byteLength <= j.buffers[0].byteLength, 'bufferView dentro do buffer');
  }

  const pos = j.accessors[j.meshes[0].primitives[0].attributes.POSITION];
  assert.deepStrictEqual([pos.min, pos.max], [[0,0,0], [1,1,0]], 'min/max da POSITION');

  // interleaved de-interleavado corretamente
  const pB = j.accessors[j.meshes[1].primitives[0].attributes.POSITION];
  assert.deepStrictEqual([pB.min, pB.max], [[0,0,0], [2,2,0]], 'min/max do mesh interleaved');
  const vB = j.bufferViews[pB.bufferView];
  assert.deepStrictEqual(
    [...new Float32Array(glb.buffer.slice(glb.byteOffset + binOff + 8 + vB.byteOffset, glb.byteOffset + binOff + 8 + vB.byteOffset + vB.byteLength))],
    [0,0,0, 2,0,0, 0,2,0], 'positions de-interleavadas'
  );

  // uv Uint16 normalizado virou float 0..1
  const uv = j.accessors[j.meshes[1].primitives[0].attributes.TEXCOORD_0];
  assert.strictEqual(uv.componentType, 5126, 'UV convertida pra float');

  assert.strictEqual(j.materials.length, 1, 'material deduplicado por uuid');

  // ---- turntable: bbox em world space + enquadramento ----------------------
  const seen = [];
  const cam = {
    fov: 50,
    position: { x: 0, y: 0, z: 0, set(x, y, z) { Object.assign(this, { x, y, z }); seen.push([x, y, z]); } },
    quaternion: { clone: () => 'Q', copy() {} },
    lookAt() {}, updateProjectionMatrix() {},
  };
  const renderer = { render() {}, domElement: { toDataURL: () => 'data:image/png;base64,AA' } };
  window.__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent('observe', { detail: renderer }));
  renderer.render({ isScene: true }, cam); // popula `live`

  const t = window.__3DGRAB__.turntable([0, 90]);
  assert.ok(t.ok, `turntable falhou: ${t.error}`);
  assert.deepStrictEqual(t.shots, ['exemplo.com-000.png', 'exemplo.com-090.png']);

  // implementacao independente do bbox, pra cruzar com a do inject.js
  // A em (0,0,0)..(1,1,0); B interleaved (0,0,0),(2,0,0),(0,2,0) transladado z+5
  const min = [0, 0, 0], max = [2, 2, 5];
  const c = min.map((v, i) => (v + max[i]) / 2);
  const radius = Math.hypot(...max.map((v, i) => v - min[i])) / 2;
  const dist = radius / Math.sin((50 * Math.PI) / 180 / 2);
  const near = (a, b, m) => assert.ok(Math.abs(a - b) < 1e-6, `${m}: ${a} != ${b}`);

  near(seen[0][0], c[0], 'deg 0 x');
  near(seen[0][1], c[1] + radius * 0.35, 'elevacao');
  near(seen[0][2], c[2] + dist, 'deg 0 z (frente)');
  near(seen[1][0], c[0] + dist, 'deg 90 x (lateral)');
  near(seen[1][2], c[2], 'deg 90 z');
  assert.deepStrictEqual(seen.at(-1), [0, 0, 0], 'camera do site restaurada');

  console.log(`ok — GLB valido (${glb.length} bytes, ${j.meshes.length} meshes) + turntable enquadrado`);
})();
// dump opcional pra validar com ferramenta externa: node test-glb.js --dump
