"use client";

import { Check, LoaderCircle, Scale, TriangleAlert, X } from "lucide-react";
import { useState } from "react";
import type { SceneMetrics } from "./lib/lab-runtime";
import type { WebExportResult } from "./WebExportStudio";

const BRIDGE = "http://localhost:4317";

type Props = {
  session: WebExportResult;
  active: string | null;
  measured: Record<string, SceneMetrics>;
  onSelect: (variant: string, url: string) => void;
  onClose: () => void;
};

function compact(value: number) {
  return new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function VariantComparisonBar({ session, active, measured, onSelect, onClose }: Props) {
  const [promoting, setPromoting] = useState(false);
  const [approved, setApproved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const variants = session.urls.variants ?? {};
  const reviewed = Boolean(active && measured[active] && (active === "source" || measured.source));

  async function promote() {
    if (!active || !reviewed) return;
    setPromoting(true);
    setError(null);
    try {
      const response = await fetch(`${BRIDGE}/exports/${session.slug}/promote`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ variant: active }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Não foi possível promover a variante");
      setApproved(body.variant);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Falha na promoção");
    } finally {
      setPromoting(false);
    }
  }

  return (
    <section className="comparison-dock" aria-label="Comparação de variantes">
      <header><Scale size={15} /><div><strong>Comparação controlada</strong><span>{session.slug}</span></div><button onClick={onClose} aria-label="Fechar comparação"><X size={16} /></button></header>
      <div className="comparison-variants">
        {Object.entries(variants).map(([name, variant]) => {
          const runtime = measured[name];
          return <button key={name} className={`${active === name ? "active" : ""} ${runtime ? "reviewed" : ""}`} onClick={() => onSelect(name, variant.url)}>
            <span>{name}{runtime ? <Check size={10} /> : null}</span>
            <b>{(variant.bytes / 1024).toFixed(0)} KB</b>
            <small>{variant.reductionPercent ? `−${variant.reductionPercent}%` : "referência"}</small>
            <em>{runtime ? `${compact(runtime.triangles)} tris · ${runtime.loadMs.toFixed(0)} ms` : "abrir para medir"}</em>
          </button>;
        })}
      </div>
      <div className="comparison-approval">
        {approved ? <span className="comparison-approved"><Check size={13} /> {approved} aprovada no scene.json</span> : <span>{reviewed ? active === "source" ? "A fonte foi medida e pode permanecer como entrega." : "Fonte e candidata medidas no mesmo viewer." : "Abra a fonte e uma candidata antes de aprovar."}</span>}
        <button disabled={!reviewed || promoting || Boolean(approved)} onClick={promote}>{promoting ? <LoaderCircle size={13} className="spinner" /> : <Check size={13} />} Aprovar {active ?? "variante"}</button>
      </div>
      {error ? <div className="comparison-error"><TriangleAlert size={12} />{error}</div> : null}
    </section>
  );
}
