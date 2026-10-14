"use client";

import { Box, Check, Cpu, Download, History, Image as ImageIcon, LoaderCircle, Sparkles, TriangleAlert, WandSparkles, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const BRIDGE = "http://localhost:4317";

type GenerationMode = "prompt" | "image";
type Provider = "sf3d" | "meshy";
type Job = {
  id: string;
  kind: GenerationMode;
  phase: string;
  status: "PENDING" | "IN_PROGRESS" | "SUCCEEDED" | "FAILED" | "CANCELED";
  progress: number;
  error: string | null;
  createdAt?: string;
  request?: { prompt: string | null; sourceImageName: string | null };
  result: null | { modelUrl: string; thumbnailUrl: string | null; consumedCredits: number | null };
};

const TERMINAL = ["SUCCEEDED", "FAILED", "CANCELED"];

type Health = {
  ok: boolean;
  providers: Record<string, { configured: boolean; modes: string[]; note?: string }>;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onLoadResult: (url: string, name: string) => void;
};

function fileData(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function GenerationStudio({ open, onClose, onLoadResult }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [health, setHealth] = useState<Health | null>(null);
  const [mode, setMode] = useState<GenerationMode>("image");
  const [provider, setProvider] = useState<Provider>("sf3d");
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<{ file: File; data: string } | null>(null);
  const [quality, setQuality] = useState<"high" | "ultra">("high");
  const [topology, setTopology] = useState<"source" | "web">("source");
  const [targetPolycount, setTargetPolycount] = useState(80000);
  const [pbr, setPbr] = useState(true);
  const [textureResolution, setTextureResolution] = useState<"2k" | "4k">("2k");
  const [imageEnhancement, setImageEnhancement] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [job, setJob] = useState<Job | null>(null);
  const [history, setHistory] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    fetch(`${BRIDGE}/health`).then((response) => response.json()).then(setHealth).catch(() => setHealth(null));
  }, [open]);

  // O bridge guarda os jobs em .lab/jobs.json; a lista é o único caminho de volta a um GLB gerado antes do reload.
  const terminal = !job || TERMINAL.includes(job.status);
  useEffect(() => {
    if (!open || !terminal) return;
    fetch(`${BRIDGE}/jobs`).then((response) => response.json()).then(setHistory).catch(() => setHistory([]));
  }, [open, terminal]);

  useEffect(() => {
    if (!job || TERMINAL.includes(job.status)) return;
    const timer = window.setInterval(() => {
      fetch(`${BRIDGE}/jobs/${job.id}`)
        .then((response) => response.json().then((payload) => response.ok ? payload : Promise.reject(new Error(payload.error))))
        .then(setJob)
        .catch((reason) => setError(reason instanceof Error ? reason.message : "Falha ao acompanhar o job"));
    }, 3500);
    return () => window.clearInterval(timer);
  }, [job]);

  const request = useMemo(() => ({
    provider,
    kind: mode,
    prompt: mode === "prompt" ? prompt.trim() : null,
    imageData: mode === "image" ? image?.data : null,
    sourceImageName: image?.file.name ?? null,
    quality,
    topology,
    targetPolycount,
    pbr,
    textureResolution,
    imageEnhancement,
    confirmedExternalCost: confirmed,
    confirmedLocalCompute: confirmed,
  }), [confirmed, image, imageEnhancement, mode, pbr, prompt, provider, quality, targetPolycount, textureResolution, topology]);

  const configured = health?.providers[provider]?.configured === true;
  const validInput = mode === "prompt" ? prompt.trim().length > 0 && prompt.length <= 800 : Boolean(image);
  const running = Boolean(job) && !terminal;

  async function chooseImage(file: File) {
    setError(null);
    if (!/^image\/(png|jpeg)$/.test(file.type)) return setError("Use uma imagem PNG ou JPEG.");
    if (file.size > 10 * 1024 * 1024) return setError("A imagem precisa ter no máximo 10 MB.");
    setImage({ file, data: await fileData(file) });
  }

  async function submit() {
    setError(null);
    setJob(null);
    try {
      const response = await fetch(`${BRIDGE}/jobs`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(request) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Não foi possível iniciar a geração");
      setJob(payload);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Falha ao iniciar a geração");
    }
  }

  function exportManifest() {
    const manifest = {
      schema: "cannonball-generation-request/v1",
      createdAt: new Date().toISOString(),
      ...request,
      imageData: undefined,
      sourceImage: image ? { name: image.file.name, type: image.file.type, bytes: image.file.size } : null,
      confirmedExternalCost: false,
      confirmedLocalCompute: false,
    };
    const blob = new Blob([`${JSON.stringify(manifest, null, 2)}\n`], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "generation-request.json";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  if (!open) return null;

  return (
    <div className="studio-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="generation-studio" role="dialog" aria-modal="true" aria-labelledby="studio-title">
        <header className="studio-header">
          <div><span><WandSparkles size={16} /></span><div><strong id="studio-title">Generation Studio</strong><small>PROMPT / IMAGEM → GLB → AUDITORIA</small></div></div>
          <button onClick={onClose} aria-label="Fechar estúdio"><X size={19} /></button>
        </header>

        <div className="studio-body">
          <div className="studio-main">
            <div className="mode-choice">
              <button className={mode === "prompt" ? "active" : ""} onClick={() => { setMode("prompt"); setProvider("meshy"); }}><Sparkles size={17} /><span><b>Prompt para objeto</b><small>Meshy opcional · ou use Criar cena com Claude</small></span></button>
              <button className={mode === "image" ? "active" : ""} onClick={() => { setMode("image"); setProvider("sf3d"); }}><ImageIcon size={17} /><span><b>Imagem para objeto</b><small>Stable Fast 3D local · sem créditos</small></span></button>
            </div>

            {mode === "prompt" ? (
              <label className="prompt-field">
                <span>Descrição do objeto <b>{prompt.length}/800</b></span>
                <textarea maxLength={800} value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ex.: luminária de mesa brutalista em alumínio escovado, base larga, bordas chanfradas, proporções reais, peça única, materiais PBR limpos, sem chão e sem cenário..." />
                <small>Descreva forma, proporção, materiais, partes móveis e o que não deve aparecer.</small>
              </label>
            ) : (
              <div className="image-input">
                <input ref={inputRef} hidden type="file" accept="image/png,image/jpeg" onChange={(event) => event.target.files?.[0] && chooseImage(event.target.files[0])} />
                {image ? (
                  <div className="image-preview">
                    {/* eslint-disable-next-line @next/next/no-img-element -- prévia local criada por FileReader */}
                    <img src={image.data} alt="Referência enviada" />
                    <div><strong>{image.file.name}</strong><span>{(image.file.size / 1024 / 1024).toFixed(2)} MB</span><button onClick={() => inputRef.current?.click()}>Trocar imagem</button></div>
                  </div>
                ) : (
                  <button className="image-drop" onClick={() => inputRef.current?.click()}><ImageIcon size={25} /><strong>Escolher imagem de referência</strong><span>PNG ou JPEG · até 10 MB · objeto isolado funciona melhor</span></button>
                )}
              </div>
            )}

            <div className="generation-options">
              <label><span>Qualidade</span><select value={quality} onChange={(event) => setQuality(event.target.value as "high" | "ultra")}><option value="high">High</option><option value="ultra">Ultra · mais créditos</option></select></label>
              <label><span>Topologia</span><select value={topology} onChange={(event) => setTopology(event.target.value as "source" | "web")}><option value="source">Fonte · máxima fidelidade</option><option value="web">Web · remesh</option></select></label>
              <label><span>Textura</span><select value={textureResolution} onChange={(event) => setTextureResolution(event.target.value as "2k" | "4k")}><option value="2k">2K</option><option value="4k">4K</option></select></label>
              <label className={topology === "web" ? "" : "disabled"}><span>Polígonos alvo</span><input type="number" min={1000} max={300000} step={1000} disabled={topology !== "web"} value={targetPolycount} onChange={(event) => setTargetPolycount(Number(event.target.value))} /></label>
            </div>

            <div className="generation-toggles">
              <label><input type="checkbox" checked={pbr} onChange={(event) => setPbr(event.target.checked)} /><i /><span>Materiais PBR</span></label>
              {mode === "image" ? <label><input type="checkbox" checked={imageEnhancement} onChange={(event) => setImageEnhancement(event.target.checked)} /><i /><span>Melhorar referência</span></label> : null}
            </div>

            <div className="scene-note"><Box size={15} /><span><b>Fluxo econômico ativo.</b> Imagens usam reconstrução local. Para prompts e cenas, o Claude prepara um plano e geometria procedural; a geração neural paga permanece opcional.</span></div>
          </div>

          <aside className="provider-panel">
            <h3><Cpu size={14} /> Provedores</h3>
            <div className={`provider-card ${health?.providers.claude?.configured ? "ready" : ""}`}><span className="provider-status">{health?.providers.claude?.configured ? <Check size={13} /> : <TriangleAlert size={13} />}</span><div><b>Claude Code</b><small>Planos + visão · sem malha neural</small></div><em>{health?.providers.claude?.configured ? "ATIVO" : "OFFLINE"}</em></div>
            <button className={`provider-card selectable ${provider === "sf3d" ? "selected" : ""} ${health?.providers.sf3d?.configured ? "ready" : ""}`} disabled={mode !== "image"} onClick={() => setProvider("sf3d")}><span className="provider-status">{health?.providers.sf3d?.configured ? <Check size={13} /> : <TriangleAlert size={13} />}</span><div><b>Stable Fast 3D</b><small>{health?.providers.sf3d?.note ?? "Imagem → GLB · processamento local"}</small></div><em>{health?.providers.sf3d?.configured ? "PRONTO" : "PENDENTE"}</em></button>
            <button className={`provider-card selectable optional ${provider === "meshy" ? "selected" : ""} ${health?.providers.meshy?.configured ? "ready" : ""}`} onClick={() => setProvider("meshy")}><span className="provider-status">{health?.providers.meshy?.configured ? <Check size={13} /> : <TriangleAlert size={13} />}</span><div><b>Meshy API</b><small>Opcional · texto + imagem</small></div><em>{health?.providers.meshy?.configured ? "PRONTO" : "SEM CHAVE"}</em></button>
            <div className="provider-card planned"><span className="provider-status"><Cpu size={13} /></span><div><b>Hunyuan3D 2.1</b><small>Imagem + PBR · GPU remota</small></div><em>PLANEJADO</em></div>
            <div className="provider-card planned"><span className="provider-status"><Cpu size={13} /></span><div><b>TRELLIS.2</b><small>Imagem + PBR · NVIDIA 24 GB</small></div><em>PLANEJADO</em></div>

            {job ? (
              <div className={`job-card ${job.status.toLowerCase()}`}>
                <div className="job-title">{running ? <LoaderCircle size={15} className="spinner" /> : job.status === "SUCCEEDED" ? <Check size={15} /> : <TriangleAlert size={15} />}<span><b>{job.status}</b><small>{job.phase}</small></span><em>{job.progress}%</em></div>
                <div className="job-progress"><i style={{ width: `${job.progress}%` }} /></div>
                {job.error ? <p>{job.error}</p> : null}
                {job.result ? <><div className="job-result">{job.result.thumbnailUrl ? <>
                  {/* eslint-disable-next-line @next/next/no-img-element -- miniatura fornecida pelo provedor */}
                  <img src={job.result.thumbnailUrl} alt="Preview do modelo gerado" />
                </> : <Box size={28} />}<span><b>GLB salvo localmente</b><small>{job.result.consumedCredits === null ? "créditos não informados" : `${job.result.consumedCredits} créditos consumidos`}</small></span></div><button className="load-result" onClick={() => onLoadResult(job.result!.modelUrl, `generated-${job.id.slice(0, 8)}`)}>Abrir no laboratório</button></> : null}
              </div>
            ) : null}

            {history.length ? (
              <div className="job-history">
                <h3><History size={14} /> Gerações anteriores</h3>
                {history.map((item) => (
                  <button
                    key={item.id}
                    className={`history-row ${item.status.toLowerCase()} ${item.id === job?.id ? "current" : ""}`}
                    onClick={() => item.result ? onLoadResult(item.result.modelUrl, `generated-${item.id.slice(0, 8)}`) : setJob(item)}
                    title={item.result ? "Abrir no laboratório" : "Retomar acompanhamento"}
                  >
                    <span className="history-icon">{item.kind === "prompt" ? <Sparkles size={13} /> : <ImageIcon size={13} />}</span>
                    <span>
                      <b>{item.request?.prompt ?? item.request?.sourceImageName ?? item.id.slice(0, 8)}</b>
                      <small>{item.createdAt ? new Date(item.createdAt).toLocaleString("pt-BR") : item.phase}</small>
                    </span>
                    <em>{item.result ? "ABRIR" : item.status}</em>
                  </button>
                ))}
              </div>
            ) : null}
          </aside>
        </div>

        <footer className="studio-footer">
          <button className="manifest-button" onClick={exportManifest}><Download size={15} /> Exportar manifesto</button>
          <label className="cost-confirm"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} /><span>{provider === "sf3d" ? "Autorizo o processamento local intensivo nesta máquina." : "Confirmo que esta chamada pode consumir créditos externos."}</span></label>
          <button className="generate-button" disabled={!configured || !validInput || !confirmed || running} onClick={submit}>{running ? <LoaderCircle size={16} className="spinner" /> : <Sparkles size={16} />} Gerar objeto</button>
        </footer>
        {!configured ? <div className="configuration-note">{provider === "sf3d" ? <>Backend instalado. Aceite a licença oficial e execute <code>npm run setup:sf3d:weights</code> para autorizar e baixar os pesos.</> : <>Meshy é opcional. Sem <code>MESHY_API_KEY</code>, use imagem local ou o orquestrador Claude.</>}</div> : null}
        {error ? <div className="studio-error"><TriangleAlert size={14} />{error}</div> : null}
      </section>
    </div>
  );
}
