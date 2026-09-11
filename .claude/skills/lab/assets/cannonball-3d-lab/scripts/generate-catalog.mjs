import { access, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../assets-3d/", import.meta.url));
const output = new URL("../app/asset-catalog.json", import.meta.url);
const modelExtensions = new Set([".glb", ".gltf", ".obj"]);
const environmentExtensions = new Set([".hdr", ".exr"]);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) paths.push(...await walk(path));
    else paths.push(path);
  }
  return paths;
}

function trianglesFor(mode, count) {
  if ((mode ?? 4) === 4) return Math.floor(count / 3);
  if (mode === 5 || mode === 6) return Math.max(0, count - 2);
  return 0;
}

async function exists(path) {
  try { await access(path); return true; } catch { return false; }
}

async function auditGltf(file, extension) {
  const raw = await readFile(file);
  let document;
  if (extension === ".glb") {
    if (raw.length < 20 || raw.toString("ascii", 0, 4) !== "glTF") throw new Error("GLB inválido");
    const chunkLength = raw.readUInt32LE(12);
    const chunkType = raw.readUInt32LE(16);
    if (chunkType !== 0x4e4f534a) throw new Error("GLB sem JSON inicial");
    document = JSON.parse(raw.toString("utf8", 20, 20 + chunkLength).replace(/\0+$/g, "").trim());
  } else {
    document = JSON.parse(raw.toString("utf8"));
  }
  const accessors = document.accessors ?? [];
  const primitives = (document.meshes ?? []).flatMap((mesh) => mesh.primitives ?? []);
  let vertices = 0;
  let triangles = 0;
  const attributes = new Set();
  const bounds = [];
  for (const primitive of primitives) {
    Object.keys(primitive.attributes ?? {}).forEach((name) => attributes.add(name));
    const position = accessors[primitive.attributes?.POSITION] ?? {};
    vertices += position.count ?? 0;
    const count = primitive.indices !== undefined ? (accessors[primitive.indices]?.count ?? 0) : (position.count ?? 0);
    triangles += trianglesFor(primitive.mode, count);
    if (position.min && position.max) bounds.push([...position.min.slice(0, 3), ...position.max.slice(0, 3)]);
  }
  const missing = [];
  for (const item of [...(document.buffers ?? []), ...(document.images ?? [])]) {
    if (!item.uri || item.uri.startsWith("data:")) continue;
    if (!await exists(resolve(dirname(file), decodeURIComponent(item.uri)))) missing.push(item.uri);
  }
  const warnings = [];
  if (missing.length) warnings.push("dependências externas ausentes");
  if (primitives.length && !attributes.has("NORMAL")) warnings.push("sem normais");
  if ((document.images?.length ?? 0) && !attributes.has("TEXCOORD_0")) warnings.push("sem UV0");
  if (triangles > 300000) warnings.push("geometria pesada");
  if ((document.materials?.length ?? 0) > 32) warnings.push("muitos materiais");
  let sourceBounds = null;
  if (bounds.length) {
    const min = [0, 1, 2].map((axis) => Math.min(...bounds.map((value) => value[axis])));
    const max = [0, 1, 2].map((axis) => Math.max(...bounds.map((value) => value[axis + 3])));
    sourceBounds = max.map((value, axis) => value - min[axis]);
  }
  return {
    vertices,
    triangles,
    nodes: document.nodes?.length ?? 0,
    meshes: document.meshes?.length ?? 0,
    primitives: primitives.length,
    materials: document.materials?.length ?? 0,
    textures: document.textures?.length ?? 0,
    animations: document.animations?.length ?? 0,
    skins: document.skins?.length ?? 0,
    attributes: [...attributes].sort(),
    extensions: document.extensionsUsed ?? [],
    missing: [...new Set(missing)],
    sourceBounds,
    warnings,
  };
}

async function auditObj(file) {
  const text = await readFile(file, "utf8");
  let vertices = 0;
  let normals = 0;
  let uvs = 0;
  let triangles = 0;
  const libraries = [];
  for (const source of text.split(/\r?\n/)) {
    const line = source.trim();
    if (line.startsWith("v ")) vertices += 1;
    else if (line.startsWith("vn ")) normals += 1;
    else if (line.startsWith("vt ")) uvs += 1;
    else if (line.startsWith("f ")) triangles += Math.max(0, line.split(/\s+/).length - 3);
    else if (line.startsWith("mtllib ")) libraries.push(...line.split(/\s+/).slice(1));
  }
  const missing = [];
  let materialCount = 0;
  const textureDependencies = [];
  for (const library of libraries) {
    const materialPath = resolve(dirname(file), library);
    if (!await exists(materialPath)) {
      missing.push(library);
      continue;
    }
    const materialSource = await readFile(materialPath, "utf8");
    materialCount += (materialSource.match(/^newmtl\s+/gim) ?? []).length;
    for (const match of materialSource.matchAll(/^map_[a-z0-9]+\s+(.+)$/gim)) {
      const texture = match[1].trim().split(/\s+/).at(-1);
      if (!texture) continue;
      textureDependencies.push(texture);
      if (!await exists(resolve(dirname(materialPath), texture))) missing.push(texture);
    }
  }
  const warnings = [];
  if (!normals) warnings.push("sem normais");
  if (!uvs) warnings.push("sem UVs");
  if (!libraries.length) warnings.push("sem MTL");
  if (libraries.some((library) => missing.includes(library))) warnings.push("MTL ausente");
  if (textureDependencies.some((texture) => missing.includes(texture))) warnings.push("texturas do MTL ausentes");
  return {
    vertices, triangles, nodes: 1, meshes: 1, primitives: 1,
    materials: materialCount, textures: textureDependencies.length, animations: 0, skins: 0,
    attributes: [normals ? "NORMAL" : null, uvs ? "TEXCOORD_0" : null, "POSITION"].filter(Boolean),
    extensions: [], missing: [...new Set(missing)], sourceBounds: null, warnings, materialLibraries: libraries,
  };
}

const files = await walk(root);
const records = [];
for (const file of files) {
  const extension = extname(file).toLowerCase();
  const kind = modelExtensions.has(extension) ? "model" : environmentExtensions.has(extension) ? "environment" : null;
  if (!kind) continue;
  const info = await stat(file);
  const path = relative(root, file).split("/").join("/");
  let audit = null;
  if (kind === "model") {
    try {
      audit = extension === ".obj" ? await auditObj(file) : await auditGltf(file, extension);
    } catch (error) {
      audit = { warnings: [error instanceof Error ? error.message : "falha na auditoria"], missing: [] };
    }
  }
  records.push({
    id: path,
    name: path.split("/").at(-1).replace(/\.(glb|gltf|hdr|exr)$/i, ""),
    path,
    extension,
    kind,
    bytes: info.size,
    audit,
  });
}
records.sort((a, b) => a.kind.localeCompare(b.kind) || a.name.localeCompare(b.name));
await writeFile(output, `${JSON.stringify(records, null, 2)}\n`);
console.log(`Catalogados ${records.filter((item) => item.kind === "model").length} modelos e ${records.filter((item) => item.kind === "environment").length} ambientes.`);
