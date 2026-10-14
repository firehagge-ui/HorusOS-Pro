"use client";

import { Box, Check, Download, Eye, Lightbulb, LoaderCircle, Plus, Sparkles, Trash2, TriangleAlert, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { planScene, validateScenePlan, type SceneObjectPlan, type ScenePlan } from "./lib/scene-plan";

const BRIDGE = "http://localhost:4317";
const TERMINAL = ["SUCCEEDED", "FAILED", "CANCELED"];
type SceneJob = { objectId: string; job: { id: string; status: string; phase: string; progress: number; error: string | null; result: null | { modelUrl: string } } };
type Props = { open: boolean; onClose: () => void; onPreview: (plan: ScenePlan) => void; onAssemble: (plan: ScenePlan, models: Record<string, string>) => void };

function downloadJson(plan: ScenePlan) {
  const blob = new Blob([`${JSON.stringify(plan, null, 2)}\n`], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "cannonball-scene-plan.json";
  link.click();
  URL.revokeObjectURL(link.href);
}

export function SceneStudio({ open, onClose, onPreview, onAssemble }: Props) {
  const [prompt, setPrompt] = useState("");
  const [plan, setPlan] = useState<ScenePlan | null>(null);
  const [meshyConfigured, setMeshyConfigured] = useState(false);
  const [claudeConfigured, setClaudeConfigured] = useState(false);
  const [planning, setPlanning] = useState(false);
  const [planner, setPlanner] = useState<"claude" | "offline" | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [jobs, setJobs] = useState<SceneJob[]>([]);
  const [error, setError] = useState<string | null>(null);
  const audit = useMemo(() => plan ? validateScenePlan(plan) : null, [plan]);
  const running = jobs.some((item) => !TERMINAL.includes(item.job.status));
  const complete = jobs.length > 0 && jobs.every((item) => item.job.status === "SUCCEEDED" && item.job.result);

  useEffect(() => {
    if (!open) return;
    fetch(`${BRIDGE}/health`).then((response) => response.json()).then((health) => {
      setMeshyConfigured(health.providers?.meshy?.configured === true);
      setClaudeConfigured(health.providers?.claude?.configured === true);
    }).catch(() => { setMeshyConfigured(false); setClaudeConfigured(false); });
  }, [open]);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(async () => {
      try {
        const next = await Promise.all(jobs.map(async (item) => {
          if (TERMINAL.includes(item.job.status)) return item;
          const response = await fetch(`${BRIDGE}/jobs/${item.job.id}`);
          const job = await response.json();
          if (!response.ok) throw new Error(job.error ?? "Falha ao acompanhar a cena");
          return { ...item, job };
        }));
        setJobs(next);
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : "Falha ao acompanhar a cena");
      }
    }, 3500);
    return () => window.clearInterval(timer);
  }, [jobs, running]);

  if (!open) return null;

  function updateObject(id: string, patch: Partial<SceneObjectPlan>) {
    setPlan((current) => current ? { ...current, objects: current.objects.map((item) => item.id === id ? { ...item, ...patch } : item) } : current);
  }

  async function createPlan() {
    if (!prompt.trim()) return;
    setPlanning(true);
    setError(null);
    try {
      if (!claudeConfigured) throw new Error("Claude indisponível");
      const response = await fetch(`${BRIDGE}/scene-plans`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Planejamento indisponível");
      setPlan(payload.plan);
      setPlanner("claude");
    } catch {
      setPlan(planScene(prompt));
      setPlanner("offline");
      setError("O Claude não respondeu; foi criado um plano offline editável.");
    } finally {
      setPlanning(false);
    }
    setJobs([]);
    setConfirmed(false);
  }

  async function generateScene() {
    if (!plan || !audit?.valid) return;
    setError(null);
    try {
      const response = await fetch(`${BRIDGE}/scene-jobs`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan, confirmedExternalCost: confirmed }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Não foi possível iniciar a cena");
      setJobs(payload.jobs);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Falha ao iniciar a cena");
    }
  }

  function assemble() {
    if (!plan || !complete) return;
    onAssemble(plan, Object.fromEntries(jobs.map((item) => [item.objectId, item.job.result!.modelUrl])));
  }

  function addObject() {
    if (!plan) return;
    const index = plan.objects.length + 1;
    setPlan({ ...plan, objects: [...plan.objects, {
      id: `object-${crypto.randomUUID()}`,
      name: `objeto ${index}`,
      kind: "generated",
      prompt: `objeto detalhado coerente com a direção artística: ${plan.prompt}`,
      primitive: "box",
      position: [0, 1, 0], rotation: [0, 0, 0], scale: [1, 1, 1],
      physics: { mode: "static", collider: "box", mass: 0 },
      generation: { required: true, quality: "high", topology: "web", targetPolycount: 60000 },
    }] });
  }

  return (
    <div className="studio-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="generation-studio scene-studio" role="dialog" aria-modal="true" aria-labelledby="scene-studio-title">
        <header className="studio-header">
          <div><span><Sparkles size={16} /></span><div><strong id="scene-studio-title">Scene Orchestrator</strong><small>PROMPT → PLANO → OBJETOS → COMPOSIÇÃO</small></div></div>
          <button onClick={onClose} aria-label="Fechar orquestrador"><X size={19} /></button>
        </header>

        <div className="scene-studio-body">
          <section className="scene-brief">
            <label className="prompt-field"><span>Descrição da cena <b>{prompt.length}/1200</b></span><textarea maxLength={1200} value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Ex.: sala brutalista noturna, sofá modular em couro preto, mesa baixa de concreto, luminária cromada, luz lateral azul, câmera cinematográfica a 35 mm..." /></label>
            <div className="scene-brief-actions"><span><Lightbulb size={14} /> {claudeConfigured ? "Claude Code autenticado · usa a franquia da sua assinatura, sem API separada." : "Claude indisponível · o planejador offline continuará funcionando."}</span><button disabled={!prompt.trim() || planning} onClick={createPlan}>{planning ? <LoaderCircle size={14} className="spinner" /> : <Sparkles size={14} />} {planning ? "Planejando" : "Criar plano"}</button></div>
          </section>

          {plan ? <>
            <section className="scene-summary">
              <span><b>{plan.objects.length}</b> elementos</span><span><b>{plan.objects.filter((item) => item.generation.required).length}</b> gerações</span><span><b>{audit?.estimatedTriangles.toLocaleString("pt-BR")}</b> tris alvo</span><span><b>{planner ?? "editado"}</b> planejador</span>
              <button onClick={addObject}><Plus size={14} /> Objeto</button>
            </section>
            {jobs.length ? <section className="scene-generation-status">
              {jobs.map((item) => {
                const object = plan.objects.find((candidate) => candidate.id === item.objectId);
                return <div key={item.objectId} className={item.job.status.toLowerCase()}>{TERMINAL.includes(item.job.status) ? item.job.status === "SUCCEEDED" ? <Check size={13} /> : <TriangleAlert size={13} /> : <LoaderCircle size={13} className="spinner" />}<span><b>{object?.name ?? item.objectId}</b><small>{item.job.phase}</small></span><em>{item.job.progress}%</em></div>;
              })}
            </section> : null}
            <section className="scene-object-list">
              {plan.objects.map((item) => (
                <article className={`scene-object ${item.kind}`} key={item.id}>
                  <span className="scene-object-icon"><Box size={16} /></span>
                  <div className="scene-object-fields">
                    <input aria-label="Nome do objeto" value={item.name} onChange={(event) => updateObject(item.id, { name: event.target.value })} />
                    <textarea aria-label={`Prompt de ${item.name}`} disabled={!item.generation.required} value={item.prompt} onChange={(event) => updateObject(item.id, { prompt: event.target.value })} />
                  </div>
                  <div className="scene-transform">
                    <span>POSIÇÃO X / Y / Z</span><div>{item.position.map((value, axis) => <input key={axis} type="number" step="0.1" value={value} onChange={(event) => { const next = [...item.position] as [number, number, number]; next[axis] = Number(event.target.value); updateObject(item.id, { position: next }); }} />)}</div>
                    <span>ESCALA X / Y / Z</span><div>{item.scale.map((value, axis) => <input key={axis} type="number" min="0.01" step="0.1" value={value} onChange={(event) => { const next = [...item.scale] as [number, number, number]; next[axis] = Number(event.target.value); updateObject(item.id, { scale: next }); }} />)}</div>
                  </div>
                  <label className="scene-generate"><input type="checkbox" checked={item.generation.required} disabled={item.kind === "structural"} onChange={(event) => updateObject(item.id, { generation: { ...item.generation, required: event.target.checked } })} /><span>{item.generation.required ? "GERAR" : "ESTRUTURA"}</span></label>
                  {item.kind !== "structural" ? <button className="scene-remove" onClick={() => setPlan({ ...plan, objects: plan.objects.filter((candidate) => candidate.id !== item.id) })} aria-label={`Remover ${item.name}`}><Trash2 size={14} /></button> : null}
                </article>
              ))}
            </section>
          </> : <div className="scene-empty"><Sparkles size={27} /><strong>A composição começa por um plano verificável</strong><span>O laboratório separa estrutura, objetos geráveis, transformações, iluminação, câmera, colisores e orçamento antes de consumir qualquer crédito.</span></div>}
        </div>

        <footer className="studio-footer scene-footer">
          <button className="manifest-button" disabled={!plan} onClick={() => plan && downloadJson(plan)}><Download size={15} /> Exportar plano</button>
          {jobs.length ? <span className={complete ? "scene-valid" : ""}>{complete ? <><Check size={14} /> Objetos prontos para composição</> : `${jobs.filter((item) => item.job.status === "SUCCEEDED").length}/${jobs.length} objetos concluídos`}</span> : <label className="cost-confirm"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} /><span>Confirmo até {plan?.objects.filter((item) => item.generation.required).length ?? 0} gerações com créditos externos.</span></label>}
          <div className="scene-footer-actions"><button className="manifest-button" disabled={!plan || running} onClick={() => plan && onPreview(plan)}><Eye size={15} /> Proxies</button>{complete ? <button className="generate-button" onClick={assemble}><Sparkles size={15} /> Montar cena</button> : <button className="generate-button" disabled={!meshyConfigured || !plan || !audit?.valid || !confirmed || running || jobs.length > 0} onClick={generateScene}>{running ? <LoaderCircle size={15} className="spinner" /> : <Sparkles size={15} />} Gerar objetos</button>}</div>
        </footer>
        {!meshyConfigured ? <div className="configuration-note">Planejamento Claude e proxies estão ativos. A geração neural será liberada pelo Stable Fast 3D local; Meshy permanece opcional.</div> : null}
        {error ? <div className="studio-error"><TriangleAlert size={14} />{error}</div> : null}
      </section>
    </div>
  );
}
