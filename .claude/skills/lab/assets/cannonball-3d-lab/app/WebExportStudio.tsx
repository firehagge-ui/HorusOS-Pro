"use client";

import { Box, Check, Copy, ExternalLink, FileJson, LoaderCircle, PackageOpen, TriangleAlert, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ColliderMode, DeviceProfile, SceneMetrics } from "./lib/lab-runtime";
import type { ScenePlan } from "./lib/scene-plan";

const BRIDGE = "http://localhost:4317";

export type WebExportSubject =
  | { kind: "asset"; name: string; sourceUrl: string }
  | { kind: "scene"; name: string; plan: ScenePlan; models: Record<string, string> };

type Props = {
  open: boolean;
  onClose: () => void;
  subject: WebExportSubject | null;
  metrics: SceneMetrics;
  initialProfile: DeviceProfile;
  initialCollider: ColliderMode;
  onCompare: (result: WebExportResult) => void;
};

export type WebExportResult = {
  slug: string;
  kind: "asset" | "scene";
  path: string;
  files: string[];
  warnings: string[];
  urls: { manifest: string; report: string; model: string | null; variants: Record<string, { url: string; bytes: number; reductionPercent?: number }> | null };
};

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 56);
}

export function WebExportStudio({ open, onClose, subject, metrics, initialProfile, initialCollider, onCompare }: Props) {
  const [slug, setSlug] = useState("");
  const [profile, setProfile] = useState<DeviceProfile>(initialProfile);
  const [collider, setCollider] = useState<ColliderMode>(initialCollider);
  const [confirmed, setConfirmed] = useState(false);
  const [highVariant, setHighVariant] = useState(true);
  const [mobileVariant, setMobileVariant] = useState(true);
  const [textureFormat, setTextureFormat] = useState<"webp" | "ktx2">("webp");
  const [capabilities, setCapabilities] = useState<{ optimizer: boolean; ktx2: boolean } | null>(null);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<WebExportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setSlug(slugify(subject?.name ?? "asset"));
    setProfile(initialProfile);
    setCollider(initialCollider);
    setConfirmed(false);
    setHighVariant(true);
    setMobileVariant(true);
    setTextureFormat("webp");
    setResult(null);
    setError(null);
    fetch(`${BRIDGE}/health`).then((response) => response.json()).then((health) => setCapabilities(health.delivery ?? null)).catch(() => setCapabilities(null));
  }, [initialCollider, initialProfile, open, subject]);

  const payload = useMemo(() => subject ? { ...subject, slug, profile, collider, metrics, variants: [...(highVariant ? ["high"] : []), ...(mobileVariant ? ["mobile"] : [])], textureFormat } : null, [collider, highVariant, metrics, mobileVariant, profile, slug, subject, textureFormat]);

  async function exportPackage() {
    if (!payload || !confirmed) return;
    setRunning(true);
    setError(null);
    try {
      const response = await fetch(`${BRIDGE}/exports`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Não foi possível criar o pacote web");
      setResult(body);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Falha ao criar o pacote web");
    } finally {
      setRunning(false);
    }
  }

  if (!open) return null;

  return (
    <div className="studio-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="generation-studio web-export-studio" role="dialog" aria-modal="true" aria-labelledby="web-export-title">
        <header className="studio-header">
          <div><span><PackageOpen size={16} /></span><div><strong id="web-export-title">Entrega para site</strong><small>GLB → PACOTE PORTÁTIL → THREE.JS / R3F</small></div></div>
          <button onClick={onClose} aria-label="Fechar exportação"><X size={19} /></button>
        </header>

        <div className="web-export-body">
          {!subject ? (
            <div className="export-unavailable"><TriangleAlert size={24} /><strong>Este item é somente referência de estudo</strong><span>Abra um objeto gerado no laboratório ou monte uma cena gerada. O corpus e arquivos externos não são copiados para a área de entrega.</span></div>
          ) : result ? (
            <div className="export-result">
              <span className="export-result-icon"><Check size={25} /></span>
              <div><strong>Pacote criado</strong><span>{result.path}</span></div>
              <button onClick={() => navigator.clipboard.writeText(result.path)} title="Copiar caminho"><Copy size={15} /></button>
              <div className="export-links">
                <a href={result.urls.manifest} target="_blank" rel="noreferrer"><FileJson size={14} /> scene.json <ExternalLink size={11} /></a>
                <a href={result.urls.report} target="_blank" rel="noreferrer"><FileJson size={14} /> report.json <ExternalLink size={11} /></a>
                {result.urls.model ? <a href={result.urls.model} target="_blank" rel="noreferrer"><Box size={14} /> model.glb <ExternalLink size={11} /></a> : null}
              </div>
              {result.urls.variants ? <div className="variant-results">{Object.entries(result.urls.variants).map(([name, variant]) => <a key={name} href={variant.url} target="_blank" rel="noreferrer"><span>{name}</span><b>{(variant.bytes / 1024).toFixed(0)} KB</b><em>{variant.reductionPercent ? `−${variant.reductionPercent}%` : "referência"}</em></a>)}</div> : null}
              <div className="export-file-list">{result.files.map((file) => <code key={file}>{file}</code>)}</div>
              {result.warnings.length ? <div className="export-warnings">{result.warnings.map((warning) => <span key={warning}><TriangleAlert size={12} />{warning}</span>)}</div> : <div className="export-ok"><Check size={13} /> Dentro do orçamento selecionado.</div>}
              <p>O GLB fonte permanece no pacote como referência. As variantes otimizadas são candidatas: o relatório registra método, tamanho e redução, mas a aprovação visual continua pendente.</p>
            </div>
          ) : (
            <>
              <div className="export-subject">
                <span>{subject.kind === "scene" ? <PackageOpen size={22} /> : <Box size={22} />}</span>
                <div><small>{subject.kind === "scene" ? "CENA MULTI-ASSET" : "OBJETO GERADO"}</small><strong>{subject.name}</strong><em>{subject.kind === "scene" ? `${Object.keys(subject.models).length} GLBs independentes` : "1 GLB preservado"}</em></div>
              </div>
              <div className="export-fields">
                <label><span>Slug do pacote</span><input value={slug} maxLength={56} onChange={(event) => setSlug(slugify(event.target.value))} /></label>
                <label><span>Perfil de validação</span><select value={profile} onChange={(event) => setProfile(event.target.value as DeviceProfile)}><option value="mobile">Mobile</option><option value="tablet">Tablet</option><option value="desktop">Desktop</option></select></label>
                <label><span>Collider padrão</span><select value={collider} onChange={(event) => setCollider(event.target.value as ColliderMode)}><option value="off">Sem collider</option><option value="box">Box</option><option value="sphere">Sphere</option><option value="convex">Convex</option></select></label>
              </div>
              <div className="export-contract">
                <strong>Conteúdo do pacote</strong>
                <span>GLBs independentes, <code>scene.json</code>, relatório de orçamento e exemplos para Three.js e React Three Fiber.</span>
                <span>Unidades em metros, eixo Y, transformações, câmera, luz e física são descritos no manifesto.</span>
              </div>
              <div className="variant-options">
                <div><strong>Variantes candidatas</strong><span>Otimizações ficam separadas da fonte até a aprovação visual.</span></div>
                <label><input aria-label="Gerar variante high" type="checkbox" checked={highVariant} disabled={!capabilities?.optimizer} onChange={(event) => setHighVariant(event.target.checked)} /><span><b>High</b><small>Meshopt · textura 2K · geometria preservada</small></span></label>
                <label><input aria-label="Gerar variante mobile" type="checkbox" checked={mobileVariant} disabled={!capabilities?.optimizer} onChange={(event) => setMobileVariant(event.target.checked)} /><span><b>Mobile</b><small>Meshopt · textura 1K · alvo 55% dos vértices</small></span></label>
                <label className="texture-choice"><span>Texturas</span><select value={textureFormat} onChange={(event) => setTextureFormat(event.target.value as "webp" | "ktx2")}><option value="webp">WebP · transmissão</option><option value="ktx2" disabled={!capabilities?.ktx2}>KTX2 · requer toktx</option></select></label>
                {!capabilities?.optimizer ? <small className="variant-capability-warning"><TriangleAlert size={11} /> Otimizador não detectado; somente a fonte será empacotada.</small> : !capabilities.ktx2 ? <small className="variant-capability-note">KTX2 indisponível nesta máquina; WebP será usado sem instalar software de sistema.</small> : null}
              </div>
              <label className="export-confirm"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} /><span>Autorizo criar uma cópia de entrega fora dos originais, em <code>outputs/web/</code>.</span></label>
            </>
          )}
        </div>

        <footer className="setup-footer web-export-footer">
          <span>{subject ? "A exportação nunca modifica o GLB fonte." : "Selecione uma geração própria para continuar."}</span>
          {!result ? <button className="generate-button" disabled={!subject || !slug || !confirmed || running} onClick={exportPackage}>{running ? <LoaderCircle size={14} className="spinner" /> : <PackageOpen size={14} />} Criar pacote</button> : result.kind === "asset" ? <button className="generate-button" onClick={() => { onCompare(result); onClose(); }}><PackageOpen size={14} /> Comparar no lab</button> : <button onClick={onClose}>Concluir</button>}
        </footer>
        {error ? <div className="studio-error"><TriangleAlert size={14} />{error}</div> : null}
      </section>
    </div>
  );
}
