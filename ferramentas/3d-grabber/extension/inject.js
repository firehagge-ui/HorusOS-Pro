// Tier 2: captura a cena three.js viva (nao existe arquivo pra baixar) e exporta GLB.
(() => {
  if (window.__3DGRAB__) return;

  const scenes = new Set();

  // Hook oficial do three.js: Scene/WebGLRenderer emitem 'observe' se isso existir.
  const hook = new EventTarget();
  hook.addEventListener('observe', (e) => {
    const o = e.detail;
    if (o?.isScene) scenes.add(o);
    else if (typeof o?.render === 'function' && o?.domElement) wrapRenderer(o);
  });
  window.__THREE_DEVTOOLS__ = hook;

  // Rede: pega cenas criadas antes do hook, ou versoes que nao emitem 'observe'.
  let live = null; // ultimo renderer+cena+camera realmente desenhados

  function wrapRenderer(r) {
    if (r.__grabbed) return;
    r.__grabbed = true;
    const orig = r.render.bind(r);
    r.render = (scene, cam) => {
      if (scene?.isScene) { scenes.add(scene); if (cam) live = { r, scene, cam }; }
      return orig(scene, cam);
    };
  }

  // ---- leitura de geometria -------------------------------------------------
  const NORM = { Int8Array: 127, Uint8Array: 255, Int16Array: 32767, Uint16Array: 65535 };

  function attrArray(a) {
    if (!a.isInterleavedBufferAttribute) return a.array;
    const src = a.data.array, n = a.count, s = a.itemSize;
    const out = new src.constructor(n * s);
    for (let i = 0; i < n; i++)
      for (let j = 0; j < s; j++) out[i * s + j] = src[i * a.data.stride + a.offset + j];
    return out;
  }

  function toFloat(a) {
    if (!a) return null;
    const raw = attrArray(a);
    if (raw instanceof Float32Array) return raw;
    const d = a.normalized ? NORM[raw.constructor.name] || 1 : 1;
    const out = new Float32Array(raw.length);
    for (let i = 0; i < raw.length; i++) out[i] = raw[i] / d;
    return out;
  }

  async function texture(map) {
    const img = map?.image;
    if (!img?.width && !img?.videoWidth) return null;
    try {
      const c = new OffscreenCanvas(img.width || img.videoWidth, img.height || img.videoHeight);
      c.getContext('2d').drawImage(img, 0, 0);
      const b = await c.convertToBlob({ type: 'image/png' });
      return new Uint8Array(await b.arrayBuffer());
    } catch {
      return null; // textura comprimida (KTX2/basis) ou canvas tainted por CORS
    }
  }

  function meshes() {
    const out = [];
    for (const s of scenes)
      s.traverse?.((o) => {
        if (o.isMesh && o.visible && o.geometry?.attributes?.position) out.push(o);
      });
    return out;
  }

  // ---- GLB ------------------------------------------------------------------
  const COMP = { Float32Array: 5126, Uint32Array: 5125, Uint16Array: 5123, Uint8Array: 5121 };
  const TYPE = { 1: 'SCALAR', 2: 'VEC2', 3: 'VEC3', 4: 'VEC4' };

  async function buildGLB(list) {
    const json = {
      asset: { version: '2.0', generator: '3d-grabber' },
      scene: 0, scenes: [{ nodes: [] }],
      nodes: [], meshes: [], materials: [], accessors: [], bufferViews: [], buffers: [],
    };
    const parts = [];
    let offset = 0;

    const view = (arr, target) => {
      const bytes = new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
      const pad = (4 - (offset % 4)) % 4;
      if (pad) { parts.push(new Uint8Array(pad)); offset += pad; }
      const v = { buffer: 0, byteOffset: offset, byteLength: bytes.byteLength };
      if (target) v.target = target; // 34962 ARRAY_BUFFER / 34963 ELEMENT_ARRAY_BUFFER
      json.bufferViews.push(v);
      parts.push(bytes); offset += bytes.byteLength;
      return json.bufferViews.length - 1;
    };

    const accessor = (arr, itemSize) => {
      const count = arr.length / itemSize;
      const a = {
        bufferView: view(arr, itemSize === 1 ? 34963 : 34962),
        componentType: COMP[arr.constructor.name],
        count, type: TYPE[itemSize],
      };
      if (itemSize === 3) { // POSITION exige min/max
        const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
        for (let i = 0; i < arr.length; i += 3)
          for (let j = 0; j < 3; j++) {
            if (arr[i + j] < min[j]) min[j] = arr[i + j];
            if (arr[i + j] > max[j]) max[j] = arr[i + j];
          }
        a.min = min; a.max = max;
      }
      json.accessors.push(a);
      return json.accessors.length - 1;
    };

    const matIndex = new Map();
    async function material(m) {
      if (!m) return undefined;
      if (matIndex.has(m.uuid)) return matIndex.get(m.uuid);
      const pbr = {
        baseColorFactor: [...(m.color?.toArray?.() || [1, 1, 1]), m.opacity ?? 1],
        metallicFactor: m.metalness ?? 0,
        roughnessFactor: m.roughness ?? 1,
      };
      const png = await texture(m.map);
      if (png) {
        (json.images ||= []).push({ bufferView: view(png), mimeType: 'image/png' });
        (json.samplers ||= [{}]);
        (json.textures ||= []).push({ source: json.images.length - 1, sampler: 0 });
        pbr.baseColorTexture = { index: json.textures.length - 1 };
      }
      json.materials.push({
        name: m.name || `material_${json.materials.length}`,
        pbrMetallicRoughness: pbr,
        doubleSided: m.side === 2,
        alphaMode: m.transparent ? 'BLEND' : 'OPAQUE',
      });
      matIndex.set(m.uuid, json.materials.length - 1);
      return json.materials.length - 1;
    }

    for (const mesh of list) {
      const g = mesh.geometry;
      const attrs = { POSITION: accessor(toFloat(g.attributes.position), 3) };
      if (g.attributes.normal) attrs.NORMAL = accessor(toFloat(g.attributes.normal), 3);
      if (g.attributes.uv) attrs.TEXCOORD_0 = accessor(toFloat(g.attributes.uv), 2);

      const prim = { attributes: attrs };
      if (g.index) {
        let idx = attrArray(g.index);
        if (idx instanceof Uint8Array) idx = Uint16Array.from(idx);
        prim.indices = accessor(idx, 1);
      }
      const mi = await material(Array.isArray(mesh.material) ? mesh.material[0] : mesh.material);
      if (mi !== undefined) prim.material = mi;

      json.meshes.push({ name: mesh.name || `mesh_${json.meshes.length}`, primitives: [prim] });
      mesh.updateWorldMatrix?.(true, false);
      json.nodes.push({
        name: mesh.name || `node_${json.nodes.length}`,
        mesh: json.meshes.length - 1,
        matrix: [...mesh.matrixWorld.elements], // three e glTF sao column-major
      });
      json.scenes[0].nodes.push(json.nodes.length - 1);
    }

    json.buffers.push({ byteLength: offset });

    const bin = new Uint8Array(offset);
    let p = 0;
    for (const part of parts) { bin.set(part, p); p += part.byteLength; }

    const jsonBytes = new TextEncoder().encode(JSON.stringify(json));
    const jsonPad = (4 - (jsonBytes.length % 4)) % 4;
    const binPad = (4 - (bin.length % 4)) % 4;
    const total = 12 + 8 + jsonBytes.length + jsonPad + 8 + bin.length + binPad;

    const glb = new Uint8Array(total);
    const dv = new DataView(glb.buffer);
    dv.setUint32(0, 0x46546c67, true); dv.setUint32(4, 2, true); dv.setUint32(8, total, true);
    dv.setUint32(12, jsonBytes.length + jsonPad, true); dv.setUint32(16, 0x4e4f534a, true);
    glb.set(jsonBytes, 20);
    glb.fill(0x20, 20 + jsonBytes.length, 20 + jsonBytes.length + jsonPad);
    const binStart = 20 + jsonBytes.length + jsonPad;
    dv.setUint32(binStart, bin.length + binPad, true);
    dv.setUint32(binStart + 4, 0x004e4942, true);
    glb.set(bin, binStart + 8);
    return glb;
  }

  // ---- Tier 3: turntable ----------------------------------------------------
  // Quando nao da pra extrair (Unity/Spline/textura comprimida), sobra renderizar
  // o objeto em angulos exatos e reconstruir a partir das imagens.
  const applyM = (m, x, y, z) => [
    m[0] * x + m[4] * y + m[8] * z + m[12],
    m[1] * x + m[5] * y + m[9] * z + m[13],
    m[2] * x + m[6] * y + m[10] * z + m[14],
  ];

  function bounds(list) {
    const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
    for (const mesh of list) {
      mesh.updateWorldMatrix?.(true, false);
      const m = mesh.matrixWorld.elements;
      const p = toFloat(mesh.geometry.attributes.position);
      for (let i = 0; i < p.length; i += 3) {
        const w = applyM(m, p[i], p[i + 1], p[i + 2]);
        for (let j = 0; j < 3; j++) {
          if (w[j] < min[j]) min[j] = w[j];
          if (w[j] > max[j]) max[j] = w[j];
        }
      }
    }
    const center = min.map((v, i) => (v + max[i]) / 2);
    const radius = Math.hypot(...max.map((v, i) => v - min[i])) / 2;
    return { center, radius };
  }

  function save(url, name) {
    const a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
  }

  function turntable(angles = [0, 90, 180, 270]) {
    if (!live) return { ok: false, error: 'nenhum render three.js capturado ainda' };
    const { r, scene, cam } = live;
    const { center, radius } = bounds(meshes());
    if (!isFinite(radius) || !radius) return { ok: false, error: 'cena sem geometria mensuravel' };

    // enquadra pelo fov quando existe; senao usa uma margem fixa
    const fov = cam.fov ? (cam.fov * Math.PI) / 180 : 0;
    const dist = fov ? radius / Math.sin(fov / 2) : radius * 2.6;
    const before = { p: [cam.position.x, cam.position.y, cam.position.z], q: cam.quaternion?.clone?.() };
    const host = location.hostname.replace(/^www\./, '');
    const shots = [];

    for (const deg of angles) {
      const a = (deg * Math.PI) / 180;
      cam.position.set(
        center[0] + Math.sin(a) * dist,
        center[1] + radius * 0.35, // leve elevacao: 3/4, nao ortografica pura
        center[2] + Math.cos(a) * dist
      );
      cam.lookAt?.(center[0], center[1], center[2]);
      cam.updateProjectionMatrix?.();
      r.render(scene, cam);
      // toDataURL sincrono logo apos o draw: sem isso o buffer ja foi limpo
      // (preserveDrawingBuffer e false por padrao)
      shots.push([`${host}-${String(deg).padStart(3, '0')}.png`, r.domElement.toDataURL('image/png')]);
    }

    cam.position.set(...before.p);
    if (before.q) cam.quaternion.copy(before.q);
    cam.updateProjectionMatrix?.();
    r.render(scene, cam);

    for (const [name, url] of shots) save(url, name);
    return { ok: true, shots: shots.map(([n]) => n) };
  }

  window.__3DGRAB__ = {
    turntable,
    list() {
      const m = meshes();
      let tris = 0;
      for (const x of m) {
        const g = x.geometry;
        tris += (g.index ? g.index.count : g.attributes.position.count) / 3;
      }
      return { scenes: scenes.size, meshes: m.length, triangles: Math.round(tris) };
    },
    async export() {
      const m = meshes();
      if (!m.length) return { ok: false, error: 'nenhuma cena three.js encontrada' };
      const glb = await buildGLB(m);
      const url = URL.createObjectURL(new Blob([glb], { type: 'model/gltf-binary' }));
      save(url, `${location.hostname.replace(/^www\./, '')}-scene.glb`);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      return { ok: true, meshes: m.length, bytes: glb.length };
    },
  };
})();
