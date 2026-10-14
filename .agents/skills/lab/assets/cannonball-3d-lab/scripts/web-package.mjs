import { copyFile, mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import { basename, delimiter, dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const PROFILE_BUDGETS = {
  mobile: { maxTriangles: 80000, maxDrawCalls: 60, maxTextureMemoryMb: 128, maxDpr: 1.5 },
  tablet: { maxTriangles: 180000, maxDrawCalls: 90, maxTextureMemoryMb: 256, maxDpr: 1.75 },
  desktop: { maxTriangles: 350000, maxDrawCalls: 140, maxTextureMemoryMb: 512, maxDpr: 2 },
};

function safeSlug(value) {
  const normalized = String(value || "asset")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 56);
  return normalized || "asset";
}

function tuple(value, fallback) {
  return Array.isArray(value) && value.length === 3 && value.every(Number.isFinite) ? value.map(Number) : fallback;
}

function cleanMetrics(value = {}) {
  const keys = ["vertices", "triangles", "meshes", "materials", "textures", "animations", "drawCalls", "frameTriangles", "programs", "geometries", "gpuTextures", "loadMs", "normalizationScale", "diagonal"];
  return Object.fromEntries(keys.map((key) => [key, Number.isFinite(value[key]) ? Number(value[key]) : 0]).concat([["bounds", tuple(value.bounds, [0, 0, 0])], ["measured", Object.keys(value).length > 0]]));
}

function audit(metrics, profile) {
  const budget = PROFILE_BUDGETS[profile];
  const warnings = [];
  if (metrics.triangles > budget.maxTriangles) warnings.push(`Triângulos (${metrics.triangles}) excedem o orçamento ${profile} (${budget.maxTriangles}).`);
  if (metrics.drawCalls > budget.maxDrawCalls) warnings.push(`Draw calls (${metrics.drawCalls}) excedem o orçamento ${profile} (${budget.maxDrawCalls}).`);
  if (metrics.measured && !metrics.textures) warnings.push("Nenhuma textura foi detectada; confirme se o material foi incorporado ao GLB.");
  return warnings;
}

async function atomicJson(path, value) {
  const temporary = `${path}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`);
  await rename(temporary, path);
}

function timestamp() {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z").replace("T", "-");
}

async function checkedSource(path) {
  const info = await stat(path);
  if (!info.isFile() || !path.toLowerCase().endsWith(".glb")) throw new Error(`Fonte GLB inválida: ${basename(path)}`);
  return info;
}

function reduction(sourceBytes, outputBytes) {
  return sourceBytes > 0 ? Math.round((1 - outputBytes / sourceBytes) * 1000) / 10 : 0;
}

async function optimizeModel(source, target, optimizerPath, variant, textureFormat, toktxPath) {
  const mobile = variant === "mobile";
  const args = ["optimize", source, target, "--compress", "meshopt", "--texture-compress", textureFormat, "--texture-size", mobile ? "1024" : "2048", "--simplify", mobile ? "true" : "false"];
  if (mobile) args.push("--simplify-ratio", "0.55", "--simplify-error", "0.001", "--simplify-lock-border", "true");
  const env = toktxPath ? { ...process.env, PATH: `${dirname(toktxPath)}${delimiter}${process.env.PATH ?? ""}` } : process.env;
  await execFileAsync(optimizerPath, args, { timeout: 180_000, maxBuffer: 4 * 1024 * 1024, env });
  await execFileAsync(optimizerPath, ["validate", target], { timeout: 60_000, maxBuffer: 4 * 1024 * 1024 });
  const info = await stat(target);
  return {
    url: `./models/${basename(target)}`, bytes: info.size, geometryCompression: "meshopt", textureCompression: textureFormat,
    textureSize: mobile ? 1024 : 2048, simplified: mobile, simplifyRatio: mobile ? 0.55 : 1, maxError: mobile ? 0.001 : 0,
    status: "candidate", validated: true,
  };
}

async function modelVariants({ source, sourceUrl, stem, optimizerPath, requested, textureFormat, toktxPath }) {
  const sourceInfo = await checkedSource(source);
  const variants = { source: { url: sourceUrl, bytes: sourceInfo.size, geometryCompression: "none", textureCompression: "source", status: "reference", validated: true } };
  const errors = [];
  if (!optimizerPath || !requested?.length) return { variants, errors };
  for (const variant of requested) {
    if (!["high", "mobile"].includes(variant)) continue;
    try {
      const target = resolve(source, `../${stem}-web-${variant}.glb`);
      variants[variant] = await optimizeModel(source, target, optimizerPath, variant, textureFormat, toktxPath);
      variants[variant].reductionPercent = reduction(sourceInfo.size, variants[variant].bytes);
    } catch (error) {
      errors.push(`${stem}/${variant}: ${error instanceof Error ? error.message.split("\n")[0] : "falha na otimização"}`);
    }
  }
  return { variants, errors };
}

const THREE_LOADER = `import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { KTX2Loader } from "three/addons/loaders/KTX2Loader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";

export async function loadCannonballPackage(manifestUrl, renderer) {
  const manifest = await fetch(manifestUrl).then((response) => {
    if (!response.ok) throw new Error(\`Manifesto indisponível: \${response.status}\`);
    return response.json();
  });
  const base = new URL(".", manifestUrl);
  const manager = new THREE.LoadingManager();
  const draco = new DRACOLoader(manager).setDecoderPath("/three-decoders/draco/");
  const ktx2 = new KTX2Loader(manager).setTranscoderPath("/three-decoders/basis/").detectSupport(renderer);
  const loader = new GLTFLoader(manager).setDRACOLoader(draco).setKTX2Loader(ktx2).setMeshoptDecoder(MeshoptDecoder);
  const root = new THREE.Group();
  root.name = manifest.name;

  for (const item of manifest.objects) {
    let content;
    if (item.model) {
      content = (await loader.loadAsync(new URL(item.model.url, base).href)).scene;
      if (item.model.fit === "unit" || item.model.fit === "lab-2m") {
        content.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(content);
        const size = box.getSize(new THREE.Vector3());
        const factor = (item.model.fit === "lab-2m" ? 2 : 1) / Math.max(size.x, size.y, size.z, 1e-6);
        content.scale.multiplyScalar(factor);
        content.updateMatrixWorld(true);
        const normalized = new THREE.Box3().setFromObject(content);
        const center = normalized.getCenter(new THREE.Vector3());
        content.position.set(-center.x, -normalized.min.y, -center.z);
      }
    } else {
      const geometry = item.primitive === "sphere" ? new THREE.SphereGeometry(.5, 24, 16)
        : item.primitive === "cylinder" ? new THREE.CylinderGeometry(.5, .5, 1, 24)
        : item.primitive === "plane" ? new THREE.PlaneGeometry(1, 1)
        : new THREE.BoxGeometry(1, 1, 1);
      content = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: 0x555b60, roughness: .9 }));
    }
    const wrapper = new THREE.Group();
    wrapper.name = item.name;
    wrapper.position.fromArray(item.transform.position);
    wrapper.rotation.fromArray(item.transform.rotation);
    wrapper.scale.fromArray(item.transform.scale);
    wrapper.userData.physics = item.physics;
    wrapper.add(content);
    root.add(wrapper);
  }
  return { root, manifest };
}
`;

const R3F_COMPONENT = `import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { Suspense, useLayoutEffect, useMemo } from "react";

function Model({ item, baseUrl }) {
  const url = new URL(item.model.url, baseUrl).href;
  const { scene } = useGLTF(url);
  const clone = useMemo(() => scene.clone(true), [scene]);
  useLayoutEffect(() => {
    if (item.model.fit !== "unit" && item.model.fit !== "lab-2m") return;
    clone.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const factor = (item.model.fit === "lab-2m" ? 2 : 1) / Math.max(size.x, size.y, size.z, 1e-6);
    clone.scale.multiplyScalar(factor);
    clone.updateMatrixWorld(true);
    const normalized = new THREE.Box3().setFromObject(clone);
    const center = normalized.getCenter(new THREE.Vector3());
    clone.position.set(-center.x, -normalized.min.y, -center.z);
  }, [clone, item.model.fit]);
  return <primitive object={clone} />;
}

function Structural({ primitive }) {
  return (
    <mesh receiveShadow>
      {primitive === "sphere" ? <sphereGeometry args={[.5, 24, 16]} />
        : primitive === "cylinder" ? <cylinderGeometry args={[.5, .5, 1, 24]} />
        : primitive === "plane" ? <planeGeometry args={[1, 1]} />
        : <boxGeometry args={[1, 1, 1]} />}
      <meshStandardMaterial color="#555b60" roughness={.9} />
    </mesh>
  );
}

export function CannonballObject({ item, manifestUrl }) {
  return (
    <group name={item.name} position={item.transform.position} rotation={item.transform.rotation} scale={item.transform.scale} userData={{ physics: item.physics }}>
      {item.model ? <Suspense fallback={null}><Model item={item} baseUrl={new URL(".", manifestUrl)} /></Suspense> : <Structural primitive={item.primitive} />}
    </group>
  );
}

// Busque scene.json no loader da aplicação e renderize um CannonballObject por item.
`;

export async function createWebPackage(input, outputRoot, options = {}) {
  if (!input || !["asset", "scene"].includes(input.kind)) throw new Error("Tipo de pacote inválido");
  const name = String(input.name || "Asset sem nome").trim().slice(0, 100);
  const profile = ["mobile", "tablet", "desktop"].includes(input.profile) ? input.profile : "desktop";
  const collider = ["off", "box", "sphere", "convex"].includes(input.collider) ? input.collider : "off";
  const slug = `${safeSlug(input.slug || name)}-${timestamp()}`;
  const folder = resolve(outputRoot, slug);
  const modelsFolder = resolve(folder, "models");
  await mkdir(modelsFolder, { recursive: true });

  let objects;
  let camera;
  let environment;
  let lights;
  const files = [];
  const optimizationReports = [];
  const optimizationErrors = [];
  const requestedVariants = Array.isArray(input.variants) ? input.variants.filter((item) => ["high", "mobile"].includes(item)) : [];
  const textureFormat = input.textureFormat === "ktx2" && options.ktx2Available ? "ktx2" : "webp";
  if (input.kind === "asset") {
    await checkedSource(input.sourcePath);
    const target = resolve(modelsFolder, "model.glb");
    await copyFile(input.sourcePath, target);
    files.push("models/model.glb");
    const optimized = await modelVariants({ source: target, sourceUrl: "./models/model.glb", stem: "model", optimizerPath: options.optimizerPath, requested: requestedVariants, textureFormat, toktxPath: options.toktxPath });
    optimizationReports.push({ id: "asset", variants: optimized.variants });
    optimizationErrors.push(...optimized.errors);
    for (const [variant, data] of Object.entries(optimized.variants)) if (variant !== "source") files.push(data.url.replace(/^\.\//, ""));
    const preferred = profile === "mobile" ? optimized.variants.mobile ?? optimized.variants.high ?? optimized.variants.source : optimized.variants.high ?? optimized.variants.source;
    objects = [{ id: "asset", name, kind: "generated", model: { url: preferred.url, fit: "lab-2m", compression: preferred.geometryCompression, variants: optimized.variants }, transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] }, physics: { mode: "static", collider, mass: 0 } }];
    const distance = Math.max(2.4, Number(input.metrics?.diagonal || 2) * 1.35);
    camera = { fov: 42, position: [distance, distance * .7, distance], target: [0, .5, 0], near: .02, far: 250 };
    environment = { preset: "neutral", exposure: 1, background: "#171b1e", hdr: null };
    lights = [{ type: "directional", intensity: 3.2, color: "#ffffff", position: [4, 6, 5] }];
  } else {
    if (input.plan?.schema !== "cannonball-scene-plan/v1") throw new Error("Plano de cena incompatível");
    const sources = input.modelPaths ?? {};
    objects = [];
    for (const item of input.plan.objects ?? []) {
      let model;
      if (item.kind === "generated") {
        const sourcePath = sources[item.id];
        if (!sourcePath) throw new Error(`GLB ausente para ${item.name}`);
        await checkedSource(sourcePath);
        const filename = `${safeSlug(item.id)}.glb`;
        await copyFile(sourcePath, resolve(modelsFolder, filename));
        files.push(`models/${filename}`);
        const optimized = await modelVariants({ source: resolve(modelsFolder, filename), sourceUrl: `./models/${filename}`, stem: safeSlug(item.id), optimizerPath: options.optimizerPath, requested: requestedVariants, textureFormat, toktxPath: options.toktxPath });
        optimizationReports.push({ id: item.id, variants: optimized.variants });
        optimizationErrors.push(...optimized.errors);
        for (const [variant, data] of Object.entries(optimized.variants)) if (variant !== "source") files.push(data.url.replace(/^\.\//, ""));
        const preferred = profile === "mobile" ? optimized.variants.mobile ?? optimized.variants.high ?? optimized.variants.source : optimized.variants.high ?? optimized.variants.source;
        model = { url: preferred.url, fit: "unit", compression: preferred.geometryCompression, variants: optimized.variants };
      }
      objects.push({ id: String(item.id), name: String(item.name), kind: item.kind, primitive: item.primitive, ...(model ? { model } : {}), transform: { position: tuple(item.position, [0, 0, 0]), rotation: tuple(item.rotation, [0, 0, 0]), scale: tuple(item.scale, [1, 1, 1]) }, physics: item.physics });
    }
    camera = { ...input.plan.camera, near: .02, far: 250 };
    environment = { ...input.plan.environment, hdr: null };
    lights = input.plan.lights;
  }

  const metrics = cleanMetrics(input.metrics);
  const manifest = {
    schema: "cannonball-web-package/v1", name, slug, kind: input.kind, generatedAt: new Date().toISOString(), units: "meters", upAxis: "Y",
    profile, profiles: PROFILE_BUDGETS, camera, environment, lights, objects,
    delivery: { geometryCompression: requestedVariants.length ? "meshopt" : "source", textureCompression: requestedVariants.length ? textureFormat : "source", variants: ["source", ...requestedVariants], selection: profile === "mobile" ? "mobile-preferred" : "high-preferred", visualApproval: "pending", cacheStrategy: "immutable-hashed-on-deploy" },
  };
  const report = {
    schema: "cannonball-web-report/v1", generatedAt: manifest.generatedAt, profile, metrics,
    budget: PROFILE_BUDGETS[profile], warnings: [...audit(metrics, profile), ...optimizationErrors], optimizations: optimizationReports,
    pendingOptimizations: [...(!requestedVariants.includes("mobile") ? ["Gerar variante mobile com redução de polígonos quando necessário."] : []), ...(!requestedVariants.includes("high") ? ["Gerar variante high com compressão de transmissão."] : []), ...(textureFormat !== "ktx2" ? ["Converter texturas para KTX2/Basis e medir memória de GPU quando toktx estiver disponível."] : []), "Comparar visualmente cada candidato com a fonte antes de promovê-lo."],
  };
  for (const item of optimizationReports) {
    for (const [variant, data] of Object.entries(item.variants)) {
      if (variant !== "source" && data.reductionPercent < 0) report.warnings.push(`${item.id}/${variant}: o candidato é ${Math.abs(data.reductionPercent)}% maior que a fonte; avalie memória de GPU e qualidade antes de promover.`);
    }
  }
  await writeFile(resolve(folder, "scene.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  await writeFile(resolve(folder, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
  await mkdir(resolve(folder, "integration"), { recursive: true });
  await writeFile(resolve(folder, "integration/three-loader.js"), THREE_LOADER);
  await writeFile(resolve(folder, "integration/react-three-fiber.jsx"), R3F_COMPONENT);
  files.push("scene.json", "report.json", "integration/three-loader.js", "integration/react-three-fiber.jsx");
  return { slug, folder, manifest, report, files };
}

export async function promoteWebPackage(folder, variant) {
  if (!["source", "high", "mobile"].includes(variant)) throw new Error("Variante de promoção inválida");
  const manifestPath = resolve(folder, "scene.json");
  const reportPath = resolve(folder, "report.json");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const report = JSON.parse(await readFile(reportPath, "utf8"));
  if (manifest.schema !== "cannonball-web-package/v1") throw new Error("Pacote web incompatível");
  let promoted = 0;
  for (const item of manifest.objects ?? []) {
    if (!item.model) continue;
    const candidate = item.model.variants?.[variant];
    if (!candidate?.validated) throw new Error(`${item.name}: variante ${variant} indisponível ou inválida`);
    item.model.url = candidate.url;
    item.model.compression = candidate.geometryCompression;
    promoted += 1;
  }
  if (!promoted) throw new Error("O pacote não contém modelos promovíveis");
  const approvedAt = new Date().toISOString();
  manifest.delivery.selection = variant;
  manifest.delivery.visualApproval = { status: "approved", variant, approvedAt };
  report.approval = { status: "approved", variant, approvedAt, models: promoted };
  await atomicJson(manifestPath, manifest);
  await atomicJson(reportPath, report);
  return { variant, approvedAt, models: promoted, manifest, report };
}

function argumentsOf(argv) {
  const result = { models: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (key === "--confirmar-copia") result.confirmed = true;
    else if (key === "--confirmar-promocao") result.confirmedPromotion = true;
    else if (key === "--modelo") result.models.push(argv[++index]);
    else if (key.startsWith("--")) result[key.slice(2)] = argv[++index];
  }
  return result;
}

async function cli() {
  const args = argumentsOf(process.argv.slice(2));
  if (args.promover) {
    if (!args.confirmedPromotion) throw new Error("Use --confirmar-promocao depois da comparação visual");
    if (!args.pacote) throw new Error("Informe --pacote <outputs/web/slug>");
    const result = await promoteWebPackage(resolve(args.pacote), args.promover);
    process.stdout.write(`${JSON.stringify({ variant: result.variant, approvedAt: result.approvedAt, models: result.models }, null, 2)}\n`);
    return;
  }
  if (!args.confirmed) throw new Error("Use --confirmar-copia para autorizar a criação do pacote fora do original");
  if (!args.destino) throw new Error("Informe --destino <pasta-raiz>");
  const common = { name: args.nome, slug: args.slug, profile: args.perfil, collider: args.collider, variants: args.variantes ? args.variantes.split(",") : [], textureFormat: args.textura };
  let input;
  if (args.fonte) {
    input = { ...common, kind: "asset", sourcePath: resolve(args.fonte), metrics: args.relatorio ? JSON.parse(await readFile(resolve(args.relatorio), "utf8")).runtime ?? {} : {} };
  } else if (args.plano) {
    const plan = JSON.parse(await readFile(resolve(args.plano), "utf8"));
    const modelPaths = Object.fromEntries(args.models.map((entry) => {
      const split = String(entry).indexOf("=");
      if (split < 1) throw new Error(`Mapeamento inválido: ${entry}. Use id=/caminho/model.glb`);
      return [entry.slice(0, split), resolve(entry.slice(split + 1))];
    }));
    input = { ...common, kind: "scene", name: args.nome || plan.name, plan, modelPaths, metrics: {} };
  } else {
    throw new Error("Informe --fonte <model.glb> ou --plano <scene-plan.json>");
  }
  const result = await createWebPackage(input, resolve(args.destino), { optimizerPath: args.otimizador ? resolve(args.otimizador) : undefined, ktx2Available: args.ktx2 === "true", toktxPath: args.toktx ? resolve(args.toktx) : undefined });
  process.stdout.write(`${JSON.stringify({ path: result.folder, files: result.files, warnings: result.report.warnings }, null, 2)}\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  cli().catch((error) => { process.stderr.write(`Erro: ${error.message}\n`); process.exitCode = 1; });
}
