"use client";

import { Check, Clipboard, Cpu, ExternalLink, PackageCheck, RefreshCw, ShieldCheck, Terminal, TriangleAlert, X } from "lucide-react";
import { useEffect, useState } from "react";

const BRIDGE = "http://localhost:4317";
type Provider = { configured: boolean; installed?: boolean; modes: string[]; note?: string };
type Health = { ok: boolean; providers: Record<string, Provider>; delivery?: { optimizer: boolean; ktx2: boolean; note?: string } };
type Props = { open: boolean; onClose: () => void };

function Command({ children }: { children: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }
  return <div className="setup-command"><code>{children}</code><button onClick={copy} aria-label="Copiar comando">{copied ? <Check size={14} /> : <Clipboard size={14} />}</button></div>;
}

function Status({ ready, label }: { ready: boolean; label: string }) {
  return <span className={`setup-status ${ready ? "ready" : "pending"}`}>{ready ? <Check size={12} /> : <TriangleAlert size={12} />}{label}</span>;
}

export function SetupStudio({ open, onClose }: Props) {
  const [health, setHealth] = useState<Health | null>(null);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    try { setHealth(await fetch(`${BRIDGE}/health`).then((response) => response.json())); }
    catch { setHealth(null); }
    finally { setLoading(false); }
  }

  useEffect(() => { if (open) void refresh(); }, [open]);
  if (!open) return null;

  const claude = health?.providers.claude;
  const sf3d = health?.providers.sf3d;
  const delivery = health?.delivery;
  return <div className="studio-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="generation-studio setup-studio" role="dialog" aria-modal="true" aria-labelledby="setup-title">
      <header className="studio-header"><div><span><ShieldCheck size={16} /></span><div><strong id="setup-title">Configuração local</strong><small>AUTORIZAÇÃO SEM INTERMEDIAÇÃO DE CREDENCIAIS</small></div></div><button onClick={onClose} aria-label="Fechar configuração"><X size={19} /></button></header>
      <div className="setup-intro"><ShieldCheck size={19} /><div><strong>As contas continuam sob controle da pessoa.</strong><span>O laboratório somente verifica executáveis e marcadores locais. Senhas, tokens Claude e tokens Hugging Face nunca passam pela interface, pelo bridge ou pelos manifests.</span></div></div>
      <div className="setup-grid">
        <article className="setup-card">
          <header><span><Terminal size={18} /></span><div><strong>1. Claude Code</strong><small>Planejamento, visão e geração procedural</small></div><Status ready={claude?.configured === true} label={claude?.configured ? "AUTORIZADO" : "PENDENTE"} /></header>
          <ol><li>Instale o Claude Code oficial, caso ainda não exista.</li><li>Faça login diretamente no fluxo da Anthropic.</li><li>Reabra ou atualize este painel; a skill usa o binário sem acessar o OAuth.</li></ol>
          <Command>claude auth login</Command>
          <Command>claude auth status</Command>
          <a href="https://docs.anthropic.com/en/docs/claude-code/iam" target="_blank" rel="noreferrer">Documentação de autenticação <ExternalLink size={12} /></a>
        </article>
        <article className="setup-card">
          <header><span><PackageCheck size={18} /></span><div><strong>3. KTX2 / Basis</strong><small>Texturas comprimidas para memória de GPU</small></div><Status ready={delivery?.ktx2 === true} label={delivery?.ktx2 ? "PRONTO" : "INSTALAR"} /></header>
          <ol><li>Baixe o pacote oficial assinado da Khronos.</li><li>Instale localmente sem alterar <code>/usr/local</code>.</li><li>O bridge detecta o encoder e libera KTX2 na entrega.</li></ol>
          <Command>npm run setup:ktx -- --status</Command>
          <Command>npm run setup:ktx -- --instalar --confirmar-download</Command>
          <a href="https://github.com/KhronosGroup/KTX-Software/releases" target="_blank" rel="noreferrer">Releases oficiais KTX-Software <ExternalLink size={12} /></a>
        </article>
        <article className="setup-card">
          <header><span><Cpu size={18} /></span><div><strong>2. Stable Fast 3D</strong><small>Imagem para GLB no computador local</small></div><Status ready={sf3d?.configured === true} label={sf3d?.configured ? "PRONTO" : sf3d?.installed ? "PESOS" : "INSTALAR"} /></header>
          <ol><li>Instale o ambiente isolado depois de revisar espaço e licença.</li><li>Aceite o acesso ao modelo no Hugging Face pelo navegador.</li><li>Autorize o CLI diretamente e baixe os pesos oficiais.</li></ol>
          <Command>npm run setup:sf3d -- --install</Command>
          <Command>npm run setup:sf3d:weights</Command>
          <a href="https://huggingface.co/stabilityai/stable-fast-3d" target="_blank" rel="noreferrer">Licença e acesso ao modelo <ExternalLink size={12} /></a>
        </article>
      </div>
      <div className="setup-boundary"><strong>Contrato da skill pública</strong><span>Claude é opcional: sem ele, o planejador offline continua disponível. SF3D é opcional: sem ele, a auditoria e os proxies continuam funcionando. Nenhuma instalação pesada, login ou geração começa sem ação explícita.</span></div>
      <footer className="setup-footer"><span>{health ? `Claude: ${claude?.note ?? "não detectado"} · SF3D: ${sf3d?.note ?? "não detectado"} · KTX2: ${delivery?.ktx2 ? "pronto" : "pendente"}` : "Bridge local indisponível"}</span><button onClick={refresh} disabled={loading}><RefreshCw size={14} className={loading ? "spinner" : ""} /> Verificar novamente</button></footer>
    </section>
  </div>;
}
