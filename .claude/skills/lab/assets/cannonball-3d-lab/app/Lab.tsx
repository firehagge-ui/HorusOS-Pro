"use client";

import {
  Aperture,
  Axis3d,
  Box,
  Camera,
  ChevronDown,
  CircleGauge,
  Cuboid,
  FileJson,
  Focus,
  GitCompareArrows,
  Grid3x3,
  Info,
  Layers3,
  LoaderCircle,
  Monitor,
  MoonStar,
  Pause,
  PackageOpen,
  Play,
  Search,
  Settings2,
  SlidersHorizontal,
  Smartphone,
  ShieldAlert,
  Tablet,
  Upload,
  Workflow,
  WandSparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import catalogData from "./asset-catalog.json";
import { GenerationStudio } from "./GenerationStudio";
import { SceneStudio } from "./SceneStudio";
import { SetupStudio } from "./SetupStudio";
import { VariantComparisonBar } from "./VariantComparisonBar";
import { WebExportStudio, type WebExportResult, type WebExportSubject } from "./WebExportStudio";
import type { ColliderMode, DeviceProfile, DiagnosticMode, LabRuntime, SceneMetrics } from "./lib/lab-runtime";
import type { ScenePlan } from "./lib/scene-plan";

type AssetAudit = {
  vertices?: number;
  triangles?: number;
  nodes?: number;
  meshes?: number;
  primitives?: number;
  materials?: number;
  textures?: number;
  animations?: number;
  skins?: number;
  attributes?: string[];
  extensions?: string[];
  missing?: string[];
  sourceBounds?: number[] | null;
  warnings?: string[];
  materialLibraries?: string[];
};

type CatalogItem = {
  id: string;
  name: string;
  path: string;
  extension: string;
  kind: "model" | "environment";
  bytes: number;
  audit: AssetAudit | null;
};

const catalog = catalogData as CatalogItem[];
const models = catalog.filter((item) => item.kind === "model");
const environments = catalog.filter((item) => item.kind === "environment");

const EMPTY_METRICS: SceneMetrics = {
  vertices: 0, triangles: 0, meshes: 0, materials: 0, textures: 0, animations: 0,
  drawCalls: 0, frameTriangles: 0, programs: 0, geometries: 0, gpuTextures: 0,
  width: 0, height: 0, dpr: 1, bounds: [0, 0, 0], diagonal: 0,
  normalizationScale: 1, loadMs: 0,
};

const MODES: { id: DiagnosticMode; label: string; icon: typeof Box }[] = [
  { id: "beauty", label: "Beauty", icon: Aperture },
  { id: "albedo", label: "Albedo", icon: Layers3 },
  { id: "wireframe", label: "Wire", icon: Grid3x3 },
  { id: "normals", label: "Normals", icon: Axis3d },
  { id: "uv", label: "UV", icon: Box },
];

function compact(value: number) {
  return new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function bytes(value: number) {
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(0)} KB`;
  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}

function scalar(value: number) {
  if (!Number.isFinite(value)) return "—";
  if (Math.abs(value) < 0.01 || Math.abs(value) >= 100) return value.toExponential(2);
  return value.toFixed(2);
}

function resultVariant(result: WebExportResult | null, variant: string) {
  return result?.urls.variants?.[variant] ?? null;
}

function Metric({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
      {detail ? <small>{detail}</small> : null}
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label: string }) {
  return (
    <label className="toggle-row">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <i aria-hidden="true" />
    </label>
  );
}

export function Lab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runtimeRef = useRef<LabRuntime | null>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [selected, setSelected] = useState(() => models.find((item) => item.path === "forest_house.glb") ?? models[0]);
  const initialAssetRef = useRef(selected);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<DiagnosticMode>("beauty");
  const [profile, setProfile] = useState<DeviceProfile>("desktop");
  const [metrics, setMetrics] = useState(EMPTY_METRICS);
  const [progress, setProgress] = useState<number | null>(models.length ? 0 : 1);
  const [error, setError] = useState<string | null>(null);
  const [grid, setGrid] = useState(true);
  const [axes, setAxes] = useState(false);
  const [bounds, setBounds] = useState(true);
  const [collider, setCollider] = useState<ColliderMode>("off");
  const [environment, setEnvironment] = useState("");
  const [environmentVisible, setEnvironmentVisible] = useState(false);
  const [exposure, setExposure] = useState(1);
  const [animationAvailable, setAnimationAvailable] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);
  const [sceneStudioOpen, setSceneStudioOpen] = useState(false);
  const [setupOpen, setSetupOpen] = useState(false);
  const [webExportOpen, setWebExportOpen] = useState(false);
  const [assembledScene, setAssembledScene] = useState<{ selectionId: string; plan: ScenePlan; models: Record<string, string> } | null>(null);
  const [comparison, setComparison] = useState<WebExportResult | null>(null);
  const [comparisonVariant, setComparisonVariant] = useState<string | null>(null);
  const [comparisonMetrics, setComparisonMetrics] = useState<Record<string, SceneMetrics>>({});
  const [baseline, setBaseline] = useState<{ name: string; mode: DiagnosticMode; profile: DeviceProfile; metrics: SceneMetrics } | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("pt-BR");
    if (!needle) return models;
    return models.filter((item) => item.path.toLocaleLowerCase("pt-BR").includes(needle));
  }, [query]);

  useEffect(() => {
    if (!canvasRef.current) return;
    let runtime: LabRuntime | null = null;
    let disposed = false;
    const canvas = canvasRef.current;
    void import("./lib/lab-runtime").then(({ LabRuntime: Runtime }) => {
      if (disposed) return;
      runtime = new Runtime(canvas, {
        onMetrics: setMetrics,
        onProgress: setProgress,
        onError: setError,
        onAnimationState: (available, isPlaying) => {
          setAnimationAvailable(available);
          setPlaying(isPlaying);
        },
      });
      runtimeRef.current = runtime;
      if (initialAssetRef.current) runtime.loadModel(initialAssetRef.current.path);
    });
    return () => {
      disposed = true;
      runtime?.dispose();
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  useEffect(() => {
    if (!comparisonVariant || progress !== 1 || error || metrics.triangles <= 0) return;
    setComparisonMetrics((current) => current[comparisonVariant] ? current : { ...current, [comparisonVariant]: metrics });
  }, [comparisonVariant, error, metrics, progress]);

  function selectAsset(item: CatalogItem) {
    setAssembledScene(null);
    setMode("beauty");
    setMetrics(EMPTY_METRICS);
    setSelected(item);
    initialAssetRef.current = item;
    runtimeRef.current?.loadModel(item.path);
  }

  function changeMode(next: DiagnosticMode) {
    setMode(next);
    runtimeRef.current?.applyDiagnostic(next);
  }

  function changeProfile(next: DeviceProfile) {
    setProfile(next);
    runtimeRef.current?.setProfile(next);
  }

  async function changeEnvironment(path: string) {
    setEnvironment(path);
    await runtimeRef.current?.setEnvironment(path || null, environmentVisible);
  }

  function openLocal(file: File) {
    setAssembledScene(null);
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = URL.createObjectURL(file);
    const extension = file.name.toLowerCase().endsWith(".obj") ? ".obj" : ".glb";
    const item: CatalogItem = { id: objectUrlRef.current, name: file.name.replace(/\.(glb|obj)$/i, ""), path: file.name, extension, kind: "model", bytes: file.size, audit: null };
    setSelected(item);
    initialAssetRef.current = item;
    setMode("beauty");
    setMetrics(EMPTY_METRICS);
    runtimeRef.current?.loadModel(objectUrlRef.current, true, extension);
  }

  function changeCollider(next: ColliderMode) {
    setCollider(next);
    runtimeRef.current?.setCollider(next);
  }

  function exportReport() {
    const report = {
      generatedAt: new Date().toISOString(),
      asset: selected,
      view: { mode, profile, environment: environment || "neutral", environmentVisible, exposure, grid, axes, bounds, collider },
      runtime: metrics,
      baseline,
    };
    const blob = new Blob([`${JSON.stringify(report, null, 2)}\n`], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${selected?.name.replace(/[^a-z0-9-_]+/gi, "-").toLowerCase() ?? "asset"}-report.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function loadGenerated(url: string, name: string) {
    setAssembledScene(null);
    const item: CatalogItem = { id: url, name, path: url, extension: ".glb", kind: "model", bytes: 0, audit: null };
    setSelected(item);
    setMode("beauty");
    setMetrics(EMPTY_METRICS);
    initialAssetRef.current = item;
    runtimeRef.current?.loadModel(url, true, ".glb");
    setStudioOpen(false);
  }

  function previewScene(plan: ScenePlan) {
    setAssembledScene(null);
    const item: CatalogItem = { id: `scene:${plan.createdAt}`, name: plan.name, path: "plano local", extension: ".scene", kind: "model", bytes: 0, audit: null };
    setSelected(item);
    setMode("beauty");
    setMetrics(EMPTY_METRICS);
    initialAssetRef.current = item;
    runtimeRef.current?.previewScene(plan);
    setSceneStudioOpen(false);
  }

  function assembleScene(plan: ScenePlan, sceneModels: Record<string, string>) {
    const item: CatalogItem = { id: `generated-scene:${plan.createdAt}`, name: plan.name, path: "cena gerada", extension: ".scene", kind: "model", bytes: 0, audit: null };
    setSelected(item);
    setAssembledScene({ selectionId: item.id, plan, models: sceneModels });
    setMode("beauty");
    setMetrics(EMPTY_METRICS);
    initialAssetRef.current = item;
    void runtimeRef.current?.assembleScene(plan, sceneModels);
    setSceneStudioOpen(false);
  }

  function startComparison(result: WebExportResult) {
    setComparison(result);
    setComparisonVariant(null);
    setComparisonMetrics({});
  }

  function loadComparisonVariant(variant: string, url: string) {
    const data = resultVariant(comparison, variant);
    const item: CatalogItem = { id: url, name: `${comparison?.slug ?? "pacote"} · ${variant}`, path: url, extension: ".glb", kind: "model", bytes: data?.bytes ?? 0, audit: null };
    setSelected(item);
    setAssembledScene(null);
    setComparisonVariant(variant);
    setMode("beauty");
    setMetrics(EMPTY_METRICS);
    initialAssetRef.current = item;
    runtimeRef.current?.loadModel(url, true, ".glb");
  }

  function delta(value: number, original: number) {
    const difference = value - original;
    if (!difference) return "0";
    return `${difference > 0 ? "+" : ""}${compact(difference)}`;
  }

  const loaded = Boolean(selected) && progress === 1 && !error;
  const exportSubject = useMemo<WebExportSubject | null>(() => {
    if (selected && assembledScene?.selectionId === selected.id) return { kind: "scene", name: selected.name, plan: assembledScene.plan, models: assembledScene.models };
    if (selected?.extension === ".glb" && /^http:\/\/(localhost|127\.0\.0\.1):4317\/files\//.test(selected.id)) {
      return { kind: "asset", name: selected.name, sourceUrl: selected.id };
    }
    return null;
  }, [assembledScene, selected]);

  return (
    <main className="lab-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark"><Box size={17} strokeWidth={1.8} /></span>
          <div><strong>CANNONBALL</strong><span>3D LAB / 01</span></div>
        </div>
        <div className="asset-heading">
          <span className={`status-dot ${loaded ? "ready" : ""}`} />
          <div><strong>{selected?.name ?? "Nenhum modelo"}</strong><span>{selected ? `${selected.extension.toUpperCase()} · ${bytes(selected.bytes)}` : ""}</span></div>
        </div>
        <div className="header-actions">
          <button className="mobile-panel-button" onClick={() => setLibraryOpen(true)} aria-label="Abrir biblioteca"><Layers3 size={17} /></button>
          <span className="readonly-badge">ORIGINAIS · SOMENTE LEITURA</span>
          <button className="button scene-entry" onClick={() => setSceneStudioOpen(true)}><Workflow size={15} /> Criar cena</button>
          <button className="button generate-entry" onClick={() => setStudioOpen(true)}><WandSparkles size={15} /> Gerar 3D</button>
          <button className="button export-entry" onClick={() => setWebExportOpen(true)}><PackageOpen size={15} /> Entregar site</button>
          <button className="button subtle setup-entry" onClick={() => setSetupOpen(true)}><Settings2 size={15} /> Configurar</button>
          <button className="button subtle" onClick={() => uploadRef.current?.click()}><Upload size={15} /> Abrir arquivo</button>
          <input ref={uploadRef} hidden type="file" accept=".glb,.obj,model/gltf-binary,text/plain" onChange={(event) => event.target.files?.[0] && openLocal(event.target.files[0])} />
          <button className="mobile-panel-button" onClick={() => setInspectorOpen(true)} aria-label="Abrir inspetor"><SlidersHorizontal size={17} /></button>
        </div>
      </header>

      <aside className={`library-panel ${libraryOpen ? "open" : ""}`}>
        <div className="panel-title mobile-only"><strong>Biblioteca</strong><button onClick={() => setLibraryOpen(false)} aria-label="Fechar"><X size={18} /></button></div>
        <div className="searchbox"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar no corpus" aria-label="Buscar modelo" /></div>
        <div className="library-meta"><span>MODELOS</span><b>{filtered.length} / {models.length}</b></div>
        <div className="asset-list">
          {filtered.map((item) => (
            <button key={item.id} className={`asset-row ${selected?.id === item.id ? "selected" : ""}`} onClick={() => { selectAsset(item); setLibraryOpen(false); }}>
              <span className="asset-icon"><Box size={17} strokeWidth={1.5} /></span>
              <span><strong>{item.name}</strong><small>{item.path.includes("/") ? item.path.split("/").slice(0, -1).join(" / ") : "raiz"}</small></span>
              <em>{item.audit?.warnings?.length ? <ShieldAlert size={12} /> : null}{bytes(item.bytes)}</em>
            </button>
          ))}
        </div>
        <div className="library-footer"><Info size={14} /><span>O catálogo referencia os arquivos no lugar. Nenhum modelo é copiado ou convertido.</span></div>
      </aside>

      <section className="viewport">
        <canvas ref={canvasRef} aria-label="Visualizador tridimensional" />
        <div className="modebar" role="toolbar" aria-label="Modos de diagnóstico">
          {MODES.map((item) => {
            const Icon = item.icon;
            return <button key={item.id} className={mode === item.id ? "active" : ""} onClick={() => changeMode(item.id)} title={item.label}><Icon size={16} /><span>{item.label}</span></button>;
          })}
        </div>
        <div className="viewport-actions">
          <button onClick={() => runtimeRef.current?.fitCamera()} title="Reenquadrar"><Focus size={17} /></button>
          <button onClick={() => runtimeRef.current?.capture(selected?.name ?? "asset")} title="Capturar PNG"><Camera size={17} /></button>
          <button onClick={exportReport} title="Exportar relatório JSON"><FileJson size={17} /></button>
          {animationAvailable ? <button className={playing ? "active" : ""} onClick={() => runtimeRef.current?.toggleAnimation()} title={playing ? "Pausar animação" : "Reproduzir animação"}>{playing ? <Pause size={17} /> : <Play size={17} />}</button> : null}
        </div>
        {!selected ? <div className="error-state"><strong>Nenhum modelo aberto</strong><span>Use “Abrir arquivo”, gere um objeto ou adicione modelos à pasta assets-3d.</span></div> : null}
        {selected && progress !== 1 && !error ? (
          <div className="load-state"><LoaderCircle size={22} className="spinner" /><strong>Preparando modelo</strong><span>{progress === null ? "carregando dependências" : `${Math.round(progress * 100)}%`}</span><i><b style={{ width: `${Math.max(4, (progress ?? 0) * 100)}%` }} /></i></div>
        ) : null}
        {error ? <div className="error-state"><strong>Não foi possível abrir esta cena</strong><span>{error}</span></div> : null}
        <div className="viewport-caption"><span>ARRASTE PARA ORBITAR</span><span>SCROLL PARA APROXIMAR</span><span>BOTÃO DIREITO PARA MOVER</span></div>
      </section>

      <aside className={`inspector-panel ${inspectorOpen ? "open" : ""}`}>
        <div className="panel-title"><div><strong>Inspector</strong><span>estado de diagnóstico</span></div><button className="mobile-only" onClick={() => setInspectorOpen(false)} aria-label="Fechar"><X size={18} /></button></div>

        <section className="inspector-section">
          <h2><CircleGauge size={15} /> Perfil de render</h2>
          <div className="segmented">
            <button className={profile === "mobile" ? "active" : ""} onClick={() => changeProfile("mobile")}><Smartphone size={15} />Mobile</button>
            <button className={profile === "tablet" ? "active" : ""} onClick={() => changeProfile("tablet")}><Tablet size={15} />Tablet</button>
            <button className={profile === "desktop" ? "active" : ""} onClick={() => changeProfile("desktop")}><Monitor size={15} />Desktop</button>
          </div>
          <div className="profile-readout"><span>DPR efetivo <b>{metrics.dpr.toFixed(2)}</b></span><span>Buffer <b>{metrics.width} × {metrics.height}</b></span></div>
        </section>

        <section className="inspector-section">
          <h2><MoonStar size={15} /> Ambiente e luz</h2>
          <label className="select-label"><span>HDR / EXR</span><span className="select-wrap"><select value={environment} onChange={(event) => changeEnvironment(event.target.value)}><option value="">Neutro de diagnóstico</option>{environments.map((item) => <option key={item.id} value={item.path}>{item.name}</option>)}</select><ChevronDown size={14} /></span></label>
          <label className="range-label"><span>Exposição <b>{exposure.toFixed(2)}</b></span><input type="range" min="0.2" max="2.2" step="0.05" value={exposure} onChange={(event) => { const value = Number(event.target.value); setExposure(value); runtimeRef.current?.setExposure(value); }} /></label>
          <Toggle checked={environmentVisible} onChange={(value) => { setEnvironmentVisible(value); runtimeRef.current?.setEnvironmentBackground(value); }} label="Exibir HDR no fundo" />
        </section>

        <section className="inspector-section">
          <h2><Grid3x3 size={15} /> Sobreposições</h2>
          <Toggle checked={grid} onChange={(value) => { setGrid(value); runtimeRef.current?.setGridVisible(value); }} label="Grid métrico" />
          <Toggle checked={bounds} onChange={(value) => { setBounds(value); runtimeRef.current?.setBoundsVisible(value); }} label="Bounding box" />
          <Toggle checked={axes} onChange={(value) => { setAxes(value); runtimeRef.current?.setAxesVisible(value); }} label="Eixos XYZ" />
        </section>

        <section className="inspector-section">
          <h2><Cuboid size={15} /> Collider de diagnóstico</h2>
          <div className="segmented collider-segments">
            {(["off", "box", "sphere", "convex"] as ColliderMode[]).map((item) => (
              <button key={item} className={collider === item ? "active" : ""} onClick={() => changeCollider(item)}>{item === "off" ? "Off" : item === "box" ? "Box" : item === "sphere" ? "Sphere" : "Convex"}</button>
            ))}
          </div>
          <p className="section-note">Representação simplificada para comparar volume e custo. Não altera a malha.</p>
        </section>

        {selected?.audit ? (
          <section className="inspector-section source-audit">
            <h2><ShieldAlert size={15} /> Arquivo fonte</h2>
            <div className="source-stats">
              <span>Triângulos <b>{compact(selected.audit.triangles ?? 0)}</b></span>
              <span>Primitivas <b>{selected.audit.primitives ?? 0}</b></span>
              <span>Nodes <b>{selected.audit.nodes ?? 0}</b></span>
              <span>Skins <b>{selected.audit.skins ?? 0}</b></span>
            </div>
            {selected.audit.sourceBounds ? <div className="source-bounds"><span>Bounds declarados</span><b>{selected.audit.sourceBounds.map(scalar).join(" × ")}</b></div> : null}
            {selected.audit.extensions?.length ? <div className="tag-list">{selected.audit.extensions.map((extension) => <span key={extension}>{extension}</span>)}</div> : null}
            {selected.audit.warnings?.length ? <div className="warning-list">{selected.audit.warnings.map((warning) => <span key={warning}><ShieldAlert size={12} />{warning}</span>)}</div> : <div className="audit-ok">Nenhum alerta estrutural no inventário.</div>}
            {selected.audit.missing?.length ? <details><summary>{selected.audit.missing.length} dependências ausentes</summary>{selected.audit.missing.map((path) => <code key={path}>{path}</code>)}</details> : null}
          </section>
        ) : null}

        <section className="inspector-section metrics-section">
          <h2><CircleGauge size={15} /> Geometria</h2>
          <div className="metric-grid">
            <Metric label="Triângulos" value={compact(metrics.triangles)} />
            <Metric label="Vértices" value={compact(metrics.vertices)} />
            <Metric label="Meshes" value={String(metrics.meshes)} />
            <Metric label="Materiais" value={String(metrics.materials)} />
            <Metric label="Texturas" value={String(metrics.textures)} />
            <Metric label="Animações" value={String(metrics.animations)} />
          </div>
          <div className="bounds-readout"><span>Bounds normalizados</span><b>{metrics.bounds.map(scalar).join(" × ")} m</b><small>escala aplicada: {scalar(metrics.normalizationScale)}× · diagonal {scalar(metrics.diagonal)} m</small></div>
        </section>

        <section className="inspector-section metrics-section">
          <h2><CircleGauge size={15} /> Runtime</h2>
          <div className="metric-grid">
            <Metric label="Draw calls" value={String(metrics.drawCalls)} />
            <Metric label="Tris / frame" value={compact(metrics.frameTriangles)} />
            <Metric label="Programas" value={String(metrics.programs)} />
            <Metric label="Geometrias" value={String(metrics.geometries)} />
            <Metric label="GPU textures" value={String(metrics.gpuTextures)} />
            <Metric label="Carga" value={`${metrics.loadMs.toFixed(0)} ms`} />
          </div>
        </section>

        <section className="inspector-section compare-section">
          <h2><GitCompareArrows size={15} /> Comparação</h2>
          {!baseline ? (
            <button className="baseline-button" disabled={!loaded} onClick={() => setBaseline({ name: selected?.name ?? "asset", mode, profile, metrics })}>Fixar estado como baseline</button>
          ) : (
            <>
              <div className="baseline-head"><span>BASELINE</span><b>{baseline.name}</b><small>{baseline.mode} · {baseline.profile}</small></div>
              <div className="delta-grid">
                <span>Triângulos <b>{delta(metrics.triangles, baseline.metrics.triangles)}</b></span>
                <span>Draw calls <b>{delta(metrics.drawCalls, baseline.metrics.drawCalls)}</b></span>
                <span>Materiais <b>{delta(metrics.materials, baseline.metrics.materials)}</b></span>
                <span>Texturas <b>{delta(metrics.textures, baseline.metrics.textures)}</b></span>
                <span>Programas <b>{delta(metrics.programs, baseline.metrics.programs)}</b></span>
                <span>Carga <b>{delta(Math.round(metrics.loadMs), Math.round(baseline.metrics.loadMs))} ms</b></span>
              </div>
              <div className="compare-actions"><button onClick={() => setBaseline({ name: selected?.name ?? "asset", mode, profile, metrics })}>Substituir</button><button onClick={() => setBaseline(null)}>Limpar</button></div>
            </>
          )}
        </section>
      </aside>
      <GenerationStudio open={studioOpen} onClose={() => setStudioOpen(false)} onLoadResult={loadGenerated} />
      <SceneStudio open={sceneStudioOpen} onClose={() => setSceneStudioOpen(false)} onPreview={previewScene} onAssemble={assembleScene} />
      <SetupStudio open={setupOpen} onClose={() => setSetupOpen(false)} />
      <WebExportStudio open={webExportOpen} onClose={() => setWebExportOpen(false)} subject={exportSubject} metrics={metrics} initialProfile={profile} initialCollider={collider} onCompare={startComparison} />
      {comparison ? <VariantComparisonBar session={comparison} active={comparisonVariant} measured={comparisonMetrics} onSelect={loadComparisonVariant} onClose={() => { setComparison(null); setComparisonVariant(null); setComparisonMetrics({}); }} /> : null}
    </main>
  );
}
