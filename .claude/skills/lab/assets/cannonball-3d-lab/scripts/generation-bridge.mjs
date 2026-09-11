import { createServer } from "node:http";
import { createReadStream, existsSync } from "node:fs";
import { copyFile, mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import { dirname, extname, resolve, sep } from "node:path";
import { randomUUID } from "node:crypto";
import { execFile, spawn, spawnSync } from "node:child_process";
import { promisify } from "node:util";
import { createWebPackage, promoteWebPackage } from "./web-package.mjs";

const port = Number(process.env.CANNONBALL_GENERATION_PORT ?? 4317);
const meshyKey = process.env.MESHY_API_KEY ?? "";
const root = resolve(process.cwd());
const statePath = resolve(root, ".lab/jobs.json");
const outputRoot = resolve(root, "outputs/generated");
const webOutputRoot = resolve(root, "outputs/web");
const jobs = new Map();
const execFileAsync = promisify(execFile);
const sf3dRoot = resolve(process.env.SF3D_ROOT ?? resolve(root, ".local-models/stable-fast-3d"));
const sf3dPython = resolve(process.env.SF3D_PYTHON ?? resolve(sf3dRoot, ".venv/bin/python"));
const sf3dInstalled = () => existsSync(resolve(sf3dRoot, "run.py")) && existsSync(sf3dPython);
const sf3dReady = () => sf3dInstalled() && existsSync(resolve(sf3dRoot, ".weights-ready"));
const gltfTransformPath = resolve(root, "node_modules/.bin/gltf-transform");
const optimizerReady = () => existsSync(gltfTransformPath);
const localToktxPath = resolve(root, ".local-tools/ktx-software/4.4.2/bin/toktx");
const toktxPath = () => process.env.TOKTX_PATH ?? (existsSync(localToktxPath) ? localToktxPath : "toktx");
const ktx2Ready = () => spawnSync(toktxPath(), ["--version"], { stdio: "ignore" }).status === 0;

function claudeStatus() {
  try {
    const result = execFile("claude", ["auth", "status", "--json"], { encoding: "utf8" });
    return new Promise((complete) => {
      result.on("error", () => complete({ configured: false }));
      let output = "";
      result.stdout?.on("data", (chunk) => { output += chunk; });
      result.on("close", () => {
        try {
          const status = JSON.parse(output);
          complete({ configured: status.loggedIn === true, authMethod: status.authMethod ?? null, subscriptionType: status.subscriptionType ?? null });
        } catch { complete({ configured: false }); }
      });
    });
  } catch {
    return Promise.resolve({ configured: false });
  }
}

const claude = await claudeStatus();

const PLAN_SCHEMA = {
  type: "object",
  properties: {
    name: { type: "string" },
    environmentPreset: { type: "string", enum: ["studio", "interior", "exterior", "night"] },
    objects: {
      type: "array", minItems: 1, maxItems: 8,
      items: {
        type: "object",
        properties: {
          name: { type: "string" }, prompt: { type: "string" }, primitive: { type: "string", enum: ["box", "cylinder", "sphere"] },
          position: { type: "array", items: { type: "number" }, minItems: 3, maxItems: 3 },
          scale: { type: "array", items: { type: "number" }, minItems: 3, maxItems: 3 },
          movable: { type: "boolean" }, targetPolycount: { type: "integer", minimum: 1000, maximum: 120000 },
        },
        required: ["name", "prompt", "primitive", "position", "scale", "movable", "targetPolycount"], additionalProperties: false,
      },
    },
  },
  required: ["name", "environmentPreset", "objects"], additionalProperties: false,
};

function finiteTuple(value, fallback) {
  return Array.isArray(value) && value.length === 3 && value.every(Number.isFinite) ? value.map((item) => Number(item)) : fallback;
}

async function planWithClaude(prompt) {
  if (!claude.configured) throw new Error("Claude Code não está autenticado nesta máquina");
  if (!prompt?.trim() || prompt.length > 1200) throw new Error("A descrição precisa ter entre 1 e 1200 caracteres");
  const instruction = `Você é o planejador 3D do Cannonball Lab. Decomponha a cena em objetos independentes que realmente precisem ser modelados. Não inclua o piso: ele será estrutural. Use metros, Y para cima, origem no centro. Cada prompt de objeto deve ser autocontido, descrever forma, proporção, material PBR, escala real, partes e exclusões, sem chão nem cenário. Mantenha de 1 a 8 objetos e orçamento total próximo de 300 mil triângulos. Briefing: ${prompt.trim()}`;
  const { stdout } = await execFileAsync("claude", [
    "-p", "--safe-mode", "--no-session-persistence", "--permission-prompts", "none",
    "--model", "sonnet", "--effort", "low", "--output-format", "json", "--json-schema", JSON.stringify(PLAN_SCHEMA), instruction,
  ], { cwd: root, timeout: 120_000, maxBuffer: 2 * 1024 * 1024, encoding: "utf8" });
  const envelope = JSON.parse(stdout);
  const output = envelope.structured_output ?? JSON.parse(envelope.result);
  const preset = ["studio", "interior", "exterior", "night"].includes(output.environmentPreset) ? output.environmentPreset : "studio";
  const night = preset === "night";
  const objects = output.objects.slice(0, 8).map((item, index) => ({
    id: `object-${index + 1}`, name: String(item.name).slice(0, 80), kind: "generated", prompt: String(item.prompt).slice(0, 800),
    primitive: item.primitive, position: finiteTuple(item.position, [index * 1.5, 0.5, 0]), rotation: [0, 0, 0], scale: finiteTuple(item.scale, [1, 1, 1]).map((value) => Math.max(0.01, Math.abs(value))),
    physics: { mode: item.movable ? "dynamic" : "static", collider: item.primitive === "sphere" ? "sphere" : "box", mass: item.movable ? 1 : 0 },
    generation: { required: true, quality: "high", topology: "web", targetPolycount: Math.max(1000, Math.min(120000, Math.round(item.targetPolycount))) },
  }));
  return {
    schema: "cannonball-scene-plan/v1", name: String(output.name).slice(0, 80), prompt: prompt.trim(), createdAt: new Date().toISOString(), units: "meters",
    environment: { preset, exposure: night ? 0.85 : 1, background: night ? "#080b12" : "#171b1e" },
    camera: { fov: 42, position: [6, 4.2, 6], target: [0, 0.8, 0] },
    lights: night ? [{ type: "spot", intensity: 55, color: "#89aaff", position: [2, 5, 2] }, { type: "point", intensity: 18, color: "#ff4ad8", position: [-3, 2, -1] }] : [{ type: "directional", intensity: 3.2, color: "#ffffff", position: [4, 6, 5] }, { type: "point", intensity: 8, color: "#dfe8ff", position: [-3, 3, 2] }],
    objects: [{ id: "structure-floor", name: "piso", kind: "structural", prompt: "plano estrutural de piso", primitive: "box", position: [0, -0.08, 0], rotation: [0, 0, 0], scale: [8, 0.16, 8], physics: { mode: "static", collider: "box", mass: 0 }, generation: { required: false, quality: "high", topology: "web", targetPolycount: 12 } }, ...objects],
    budget: { maxTriangles: Math.max(300000, objects.reduce((sum, item) => sum + item.generation.targetPolycount, 0)), maxDrawCalls: 120, maxTextureMemoryMb: 384 },
    planner: { provider: "claude-code", model: envelope.model ?? "sonnet", subscriptionUsage: true },
  };
}

async function loadState() {
  try {
    const records = JSON.parse(await readFile(statePath, "utf8"));
    for (const record of records) {
      if (record.provider === "sf3d" && !["SUCCEEDED", "FAILED", "CANCELED"].includes(record.status)) {
        record.status = "FAILED";
        record.error = "O processo local foi interrompido; inicie a geração novamente.";
      }
      jobs.set(record.id, record);
    }
  } catch {
    // Primeira execução: ainda não existe estado persistido.
  }
}

async function saveState() {
  await mkdir(dirname(statePath), { recursive: true });
  const temporary = `${statePath}.tmp`;
  await writeFile(temporary, `${JSON.stringify([...jobs.values()], null, 2)}\n`);
  await rename(temporary, statePath);
}

function publicJob(job) {
  const safe = { ...job };
  delete safe.upstreamId;
  return safe;
}

function json(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  response.end(JSON.stringify(payload));
}

function cors(request, response) {
  const origin = request.headers.origin ?? "";
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
    response.setHeader("Access-Control-Allow-Origin", origin);
    response.setHeader("Vary", "Origin");
  }
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
}

async function body(request) {
  const chunks = [];
  let length = 0;
  for await (const chunk of request) {
    length += chunk.length;
    if (length > 16 * 1024 * 1024) throw new Error("Entrada maior que 16 MB");
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

async function meshy(path, options = {}) {
  if (!meshyKey) throw new Error("MESHY_API_KEY não configurada no bridge local");
  const response = await fetch(`https://api.meshy.ai${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${meshyKey}`, "Content-Type": "application/json", ...(options.headers ?? {}) },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.message ?? payload?.error ?? `Meshy respondeu ${response.status}`;
    throw new Error(typeof message === "string" ? message : JSON.stringify(message));
  }
  return payload;
}

function createPayload(request) {
  const common = {
    model_type: "standard",
    ai_model: "latest",
    ultra_mode: request.quality === "ultra",
    should_remesh: request.topology === "web",
    target_polycount: request.topology === "web" ? request.targetPolycount : undefined,
    target_formats: ["glb"],
    auto_size: true,
    moderation: true,
  };
  if (request.kind === "prompt") {
    return { mode: "preview", prompt: request.prompt, ...common };
  }
  return {
    image_url: request.imageData,
    ...common,
    should_texture: true,
    enable_pbr: request.pbr,
    image_enhancement: request.imageEnhancement,
    multi_view_thumbnails: true,
  };
}

async function submit(request) {
  if (!meshyKey) throw new Error("Configure MESHY_API_KEY antes de gerar");
  if (request.provider !== "meshy") throw new Error("Provedor ainda não conectado");
  if (request.confirmedExternalCost !== true) throw new Error("Confirme o uso de créditos externos");
  if (!(["prompt", "image"].includes(request.kind))) throw new Error("Modo de geração inválido");
  if (request.kind === "prompt" && (!request.prompt?.trim() || request.prompt.length > 800)) throw new Error("O prompt precisa ter entre 1 e 800 caracteres");
  if (request.kind === "image" && !/^data:image\/(png|jpeg);base64,/.test(request.imageData ?? "")) throw new Error("Envie uma imagem PNG ou JPEG válida");
  const path = request.kind === "prompt" ? "/openapi/v2/text-to-3d" : "/openapi/v1/image-to-3d";
  const upstream = await meshy(path, { method: "POST", body: JSON.stringify(createPayload(request)) });
  const id = randomUUID();
  const job = {
    id,
    provider: "meshy",
    kind: request.kind,
    phase: request.kind === "prompt" ? "preview" : "generation",
    status: "PENDING",
    progress: 0,
    upstreamId: upstream.result,
    request: {
      prompt: request.prompt?.trim() || null,
      sourceImageName: request.sourceImageName ?? null,
      quality: request.quality,
      topology: request.topology,
      targetPolycount: request.targetPolycount,
      pbr: Boolean(request.pbr),
      textureResolution: request.textureResolution,
      imageEnhancement: Boolean(request.imageEnhancement),
      sceneObjectId: request.sceneObjectId ?? null,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    result: null,
    error: null,
  };
  jobs.set(id, job);
  await saveState();
  return job;
}

async function submitSf3d(request) {
  if (!sf3dInstalled()) throw new Error("Stable Fast 3D ainda não está instalado");
  if (!sf3dReady()) throw new Error("Aceite a licença e baixe os pesos oficiais do Stable Fast 3D");
  if (request.confirmedLocalCompute !== true) throw new Error("Confirme o uso de processamento local");
  const match = /^data:image\/(png|jpeg);base64,(.+)$/.exec(request.imageData ?? "");
  if (!match) throw new Error("Envie uma imagem PNG ou JPEG válida");
  const image = Buffer.from(match[2], "base64");
  if (!image.length || image.length > 10 * 1024 * 1024) throw new Error("A imagem precisa ter no máximo 10 MB");
  const id = randomUUID();
  const folder = resolve(outputRoot, id);
  const inputPath = resolve(folder, match[1] === "jpeg" ? "reference.jpg" : "reference.png");
  const resultFolder = resolve(folder, "sf3d-output");
  await mkdir(folder, { recursive: true });
  await writeFile(inputPath, image);
  const job = {
    id, provider: "sf3d", kind: "image", phase: "local-reconstruction", status: "IN_PROGRESS", progress: 2,
    request: { prompt: null, sourceImageName: request.sourceImageName ?? null, quality: request.quality, topology: request.topology, targetPolycount: request.targetPolycount, pbr: true, textureResolution: request.textureResolution, imageEnhancement: false },
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), result: null, error: null,
  };
  jobs.set(id, job);
  await saveState();
  const textureResolution = request.textureResolution === "4k" ? "4096" : "2048";
  const targetVertices = request.topology === "web" ? String(Math.max(1000, Math.round(Number(request.targetPolycount ?? 80000) / 2))) : "-1";
  const device = process.env.SF3D_DEVICE ?? "cpu";
  const child = spawn(sf3dPython, [resolve(sf3dRoot, "run.py"), inputPath, "--output-dir", resultFolder, "--texture-resolution", textureResolution, "--remesh_option", request.topology === "web" ? "triangle" : "none", "--target_vertex_count", targetVertices, "--device", device], {
    cwd: sf3dRoot, env: { ...process.env, HF_HOME: resolve(sf3dRoot, ".hf-cache"), PYTORCH_ENABLE_MPS_FALLBACK: "1", ...(device === "cpu" ? { SF3D_USE_CPU: "1" } : {}) }, stdio: ["ignore", "pipe", "pipe"],
  });
  let logTail = "";
  const collect = (chunk) => { logTail = `${logTail}${chunk}`.slice(-12_000); };
  child.stdout.on("data", collect);
  child.stderr.on("data", collect);
  child.on("error", async (error) => {
    job.status = "FAILED"; job.error = error.message; job.updatedAt = new Date().toISOString(); await saveState();
  });
  child.on("close", async (code) => {
    if (job.status === "FAILED") return;
    try {
      if (code !== 0) throw new Error(`Stable Fast 3D terminou com código ${code}: ${logTail.slice(-1000)}`);
      const generated = resolve(resultFolder, "0/mesh.glb");
      await stat(generated);
      await copyFile(generated, resolve(folder, "source.glb"));
      job.status = "SUCCEEDED"; job.phase = "complete"; job.progress = 100;
      job.result = { modelUrl: `http://localhost:${port}/files/${id}/source.glb`, thumbnailUrl: null, modelUrls: {}, textureUrls: [], consumedCredits: 0 };
      await writeFile(resolve(folder, "generation.json"), `${JSON.stringify(publicJob(job), null, 2)}\n`);
    } catch (error) {
      job.status = "FAILED"; job.error = error instanceof Error ? error.message : "Falha na geração local";
    }
    job.updatedAt = new Date().toISOString();
    await saveState();
  });
  return job;
}

function validateSceneSubmission(request) {
  if (!meshyKey) throw new Error("Configure MESHY_API_KEY antes de gerar");
  if (request.confirmedExternalCost !== true) throw new Error("Confirme o uso de créditos externos");
  if (request.plan?.schema !== "cannonball-scene-plan/v1") throw new Error("Plano de cena incompatível");
  const objects = request.plan.objects?.filter((item) => item.generation?.required) ?? [];
  if (!objects.length || objects.length > 12) throw new Error("A cena precisa ter entre 1 e 12 objetos geráveis");
  if (objects.some((item) => !item.id || !item.prompt?.trim() || item.prompt.length > 800)) throw new Error("Todos os objetos precisam de id e prompt com até 800 caracteres");
  const estimated = objects.reduce((total, item) => total + Number(item.generation.targetPolycount || 0), 0);
  if (estimated > Number(request.plan.budget?.maxTriangles || 0)) throw new Error("O plano excede o orçamento de triângulos");
  return objects;
}

async function submitScene(request) {
  const objects = validateSceneSubmission(request);
  const submitted = [];
  for (const item of objects) {
    const job = await submit({
      provider: "meshy",
      kind: "prompt",
      prompt: item.prompt,
      sourceImageName: null,
      quality: item.generation.quality,
      topology: item.generation.topology,
      targetPolycount: item.generation.targetPolycount,
      pbr: true,
      textureResolution: "2k",
      imageEnhancement: false,
      confirmedExternalCost: true,
      sceneObjectId: item.id,
    });
    submitted.push({ objectId: item.id, job: publicJob(job) });
  }
  return { sceneId: randomUUID(), jobs: submitted };
}

async function downloadResult(job, upstream) {
  const url = upstream.model_urls?.glb;
  if (!url) throw new Error("A geração terminou sem uma URL GLB");
  const folder = resolve(outputRoot, job.id);
  await mkdir(folder, { recursive: true });
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Falha ao baixar GLB: ${response.status}`);
  const modelPath = resolve(folder, "source.glb");
  await writeFile(modelPath, Buffer.from(await response.arrayBuffer()));
  const result = {
    modelUrl: `http://localhost:${port}/files/${job.id}/source.glb`,
    thumbnailUrl: upstream.thumbnail_url ?? null,
    modelUrls: upstream.model_urls ?? {},
    textureUrls: upstream.texture_urls ?? [],
    consumedCredits: upstream.consumed_credits ?? null,
  };
  await writeFile(resolve(folder, "generation.json"), `${JSON.stringify({ ...publicJob(job), result }, null, 2)}\n`);
  return result;
}

async function refresh(job) {
  if (["SUCCEEDED", "FAILED", "CANCELED"].includes(job.status)) return job;
  if (job.provider === "sf3d") {
    const elapsedMinutes = (Date.now() - new Date(job.createdAt).getTime()) / 60_000;
    job.progress = Math.max(job.progress, Math.min(92, 5 + Math.round(elapsedMinutes * 3)));
    return job;
  }
  const endpoint = job.kind === "prompt" ? `/openapi/v2/text-to-3d/${job.upstreamId}` : `/openapi/v1/image-to-3d/${job.upstreamId}`;
  try {
    const upstream = await meshy(endpoint);
    if (job.kind === "prompt" && job.phase === "preview") {
      job.progress = Math.round((upstream.progress ?? 0) * (job.request.pbr ? 0.5 : 1));
      job.status = upstream.status;
      if (upstream.status === "SUCCEEDED" && job.request.pbr) {
        job.phase = "starting-refine";
        job.status = "PENDING";
        await saveState();
        const refine = await meshy("/openapi/v2/text-to-3d", {
          method: "POST",
          body: JSON.stringify({
            mode: "refine",
            preview_task_id: job.upstreamId,
            ai_model: "latest",
            enable_pbr: true,
            texture_resolution: job.request.textureResolution,
            target_formats: ["glb"],
            auto_size: true,
            moderation: true,
          }),
        });
        job.upstreamId = refine.result;
        job.phase = "refine";
      } else if (upstream.status === "SUCCEEDED") {
        job.result = await downloadResult(job, upstream);
      }
    } else {
      job.progress = job.kind === "prompt" ? 50 + Math.round((upstream.progress ?? 0) * 0.5) : (upstream.progress ?? 0);
      job.status = upstream.status;
      if (upstream.status === "SUCCEEDED") job.result = await downloadResult(job, upstream);
    }
    if (upstream.status === "FAILED") job.error = upstream.task_error?.message ?? "A geração falhou no provedor";
  } catch (error) {
    job.error = error instanceof Error ? error.message : "Falha ao consultar geração";
    if (job.phase === "starting-refine" || job.status === "SUCCEEDED") job.status = "FAILED";
  }
  job.updatedAt = new Date().toISOString();
  await saveState();
  return job;
}

async function serveFile(pathname, response) {
  const relative = pathname.slice("/files/".length);
  const target = resolve(outputRoot, relative);
  if (target !== outputRoot && !target.startsWith(`${outputRoot}${sep}`)) return json(response, 403, { error: "Forbidden" });
  try {
    const info = await stat(target);
    if (!info.isFile()) throw new Error();
    response.writeHead(200, {
      "Content-Type": extname(target) === ".glb" ? "model/gltf-binary" : "application/octet-stream",
      "Content-Length": info.size,
      "Cache-Control": "no-store",
    });
    createReadStream(target).pipe(response);
  } catch {
    json(response, 404, { error: "Arquivo não encontrado" });
  }
}

function generatedPath(modelUrl) {
  let url;
  try { url = new URL(modelUrl); } catch { throw new Error("A exportação aceita apenas resultados gerados pelo bridge local"); }
  if (!["localhost", "127.0.0.1"].includes(url.hostname) || Number(url.port || 80) !== port || !url.pathname.startsWith("/files/")) {
    throw new Error("A exportação aceita apenas resultados gerados pelo bridge local");
  }
  const target = resolve(outputRoot, url.pathname.slice("/files/".length));
  if (target === outputRoot || !target.startsWith(`${outputRoot}${sep}`)) throw new Error("Caminho de geração inválido");
  return target;
}

async function exportForWeb(requestBody) {
  const base = {
    kind: requestBody.kind,
    name: requestBody.name,
    slug: requestBody.slug,
    profile: requestBody.profile,
    collider: requestBody.collider,
    metrics: requestBody.metrics,
    variants: requestBody.variants,
    textureFormat: requestBody.textureFormat,
  };
  const input = requestBody.kind === "asset"
    ? { ...base, sourcePath: generatedPath(requestBody.sourceUrl) }
    : {
        ...base,
        plan: requestBody.plan,
        modelPaths: Object.fromEntries(Object.entries(requestBody.models ?? {}).map(([id, url]) => [id, generatedPath(url)])),
      };
  const result = await createWebPackage(input, webOutputRoot, { optimizerPath: optimizerReady() ? gltfTransformPath : undefined, ktx2Available: ktx2Ready(), toktxPath: ktx2Ready() ? toktxPath() : undefined });
  return {
    slug: result.slug,
    kind: result.manifest.kind,
    path: `outputs/web/${result.slug}`,
    files: result.files,
    warnings: result.report.warnings,
    urls: {
      manifest: `http://localhost:${port}/web-files/${result.slug}/scene.json`,
      report: `http://localhost:${port}/web-files/${result.slug}/report.json`,
      model: result.manifest.kind === "asset" ? `http://localhost:${port}/web-files/${result.slug}/models/model.glb` : null,
      variants: result.manifest.kind === "asset" ? Object.fromEntries(Object.entries(result.manifest.objects[0].model.variants).map(([name, data]) => [name, { ...data, url: `http://localhost:${port}/web-files/${result.slug}/${data.url.replace(/^\.\//, "")}` }])) : null,
    },
  };
}

async function serveWebFile(pathname, response) {
  const relative = pathname.slice("/web-files/".length);
  const target = resolve(webOutputRoot, relative);
  if (target === webOutputRoot || !target.startsWith(`${webOutputRoot}${sep}`)) return json(response, 403, { error: "Forbidden" });
  try {
    const info = await stat(target);
    if (!info.isFile()) throw new Error();
    const contentType = extname(target) === ".glb" ? "model/gltf-binary"
      : extname(target) === ".json" ? "application/json; charset=utf-8"
      : extname(target) === ".js" || extname(target) === ".jsx" ? "text/javascript; charset=utf-8"
      : "application/octet-stream";
    response.writeHead(200, { "Content-Type": contentType, "Content-Length": info.size, "Cache-Control": "no-store" });
    createReadStream(target).pipe(response);
  } catch {
    json(response, 404, { error: "Arquivo não encontrado" });
  }
}

async function promoteExport(slug, requestBody) {
  if (!/^[A-Za-z0-9-]+$/.test(slug)) throw new Error("Identificador de pacote inválido");
  const folder = resolve(webOutputRoot, slug);
  if (!folder.startsWith(`${webOutputRoot}${sep}`)) throw new Error("Caminho de pacote inválido");
  const result = await promoteWebPackage(folder, requestBody.variant);
  return { slug, variant: result.variant, approvedAt: result.approvedAt, models: result.models, manifestUrl: `http://localhost:${port}/web-files/${slug}/scene.json` };
}

await loadState();

createServer(async (request, response) => {
  cors(request, response);
  if (request.method === "OPTIONS") return response.writeHead(204).end();
  const url = new URL(request.url ?? "/", `http://localhost:${port}`);
  try {
    if (request.method === "GET" && url.pathname === "/health") {
      return json(response, 200, {
        ok: true,
        providers: {
          claude: { configured: claude.configured, modes: ["plan", "vision", "procedural"], note: claude.configured ? `Claude Code · ${claude.subscriptionType ?? claude.authMethod ?? "autenticado"}` : "execute claude /login" },
          sf3d: { configured: sf3dReady(), installed: sf3dInstalled(), modes: ["image"], note: sf3dReady() ? "backend e pesos locais prontos" : sf3dInstalled() ? "aceite da licença e pesos pendentes" : "backend local ainda não instalado" },
          meshy: { configured: Boolean(meshyKey), modes: ["prompt", "image"] },
          hunyuan: { configured: false, modes: ["image"], note: "adaptador local/remoto planejado" },
          trellis: { configured: false, modes: ["image"], note: "requer GPU NVIDIA >=24 GB" },
        },
        delivery: { optimizer: optimizerReady(), ktx2: ktx2Ready(), note: optimizerReady() ? "glTF Transform disponível" : "execute npm install" },
      });
    }
    if (request.method === "POST" && url.pathname === "/scene-plans") {
      const requestBody = await body(request);
      return json(response, 200, { plan: await planWithClaude(requestBody.prompt) });
    }
    if (request.method === "POST" && url.pathname === "/jobs") {
      const requestBody = await body(request);
      return json(response, 202, publicJob(requestBody.provider === "sf3d" ? await submitSf3d(requestBody) : await submit(requestBody)));
    }
    if (request.method === "POST" && url.pathname === "/scene-jobs") return json(response, 202, await submitScene(await body(request)));
    if (request.method === "POST" && url.pathname === "/exports") return json(response, 201, await exportForWeb(await body(request)));
    const promotion = request.method === "POST" ? url.pathname.match(/^\/exports\/([A-Za-z0-9-]+)\/promote$/) : null;
    if (promotion) return json(response, 200, await promoteExport(promotion[1], await body(request)));
    if (request.method === "GET" && url.pathname === "/jobs") {
      // Sem refresh: listar não deve disparar uma consulta upstream por job. Abrir um job em voo retoma o polling.
      const history = [...jobs.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(publicJob);
      return json(response, 200, history);
    }
    if (request.method === "GET" && url.pathname.startsWith("/jobs/")) {
      const job = jobs.get(url.pathname.slice("/jobs/".length));
      if (!job) return json(response, 404, { error: "Job não encontrado" });
      return json(response, 200, publicJob(await refresh(job)));
    }
    if (request.method === "GET" && url.pathname.startsWith("/files/")) return serveFile(url.pathname, response);
    if (request.method === "GET" && url.pathname.startsWith("/web-files/")) return serveWebFile(url.pathname, response);
    json(response, 404, { error: "Rota não encontrada" });
  } catch (error) {
    json(response, 400, { error: error instanceof Error ? error.message : "Falha no bridge" });
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Generation bridge em http://localhost:${port} · Meshy ${meshyKey ? "configurada" : "não configurada"}`);
});
