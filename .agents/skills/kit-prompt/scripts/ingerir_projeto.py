#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Ingere um PROJETO inteiro (template de site ou demo de animacao), nao um arquivo.

Diferenca em relacao ao ingerir.py: uma animacao de scroll vive espalhada entre
script.js + styles.css + index.html. Separar em arquivos destroi a peca. Aqui a
unidade e a pasta.

Copia so o CODIGO para o acervo (leve, versionavel, greppavel) e REFERENCIA o
projeto original para os assets — em media 99% do peso de um template e imagem,
video e fonte, que nao cabem no git e sao trocados por material do cliente
de qualquer forma.

    python scripts/ingerir_projeto.py <pasta> --analisar
    python scripts/ingerir_projeto.py <pasta> --id terrene --familia template \\
        --titulo "..." --setor arquitetura --estrutura template-multipagina \\
        --quando-usar "..." --nao-usar-quando "..." --tags escuro,gsap

Depois rode: python scripts/indexar.py
"""

import argparse
import json
import os
import re
import shutil
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from caminhos import RAIZ, ACERVO, saida_utf8  # noqa: E402

saida_utf8()

IGNORAR = {"node_modules", ".git", ".next", "dist", "build", ".cache", ".vercel"}
COD = (".js", ".jsx", ".ts", ".tsx", ".css", ".scss", ".html", ".mjs", ".cjs",
       ".glsl", ".vert", ".frag", ".json", ".md")
NAO_COPIAR = {"package-lock.json", "yarn.lock", "pnpm-lock.yaml", ".DS_Store"}

PASTA_DE = {"template": "templates", "animacao": "animacoes"}

# Tecnicas viram eixo de busca proprio: "quero scroll com pin e scrub"
TECNICAS = {
    "scrolltrigger": r"ScrollTrigger",
    "pin": r"pin\s*:\s*true",
    "scrub": r"scrub\s*:",
    "split-text": r"SplitText|split-type|SplitType",
    "flip": r"Flip\.(fit|from|getState)",
    "observer": r"Observer\.create|ScrollToPlugin",
    "timeline": r"gsap\.timeline",
    "lenis": r"[Ll]enis",
    "three": r"from ['\"]three|THREE\.",
    "shader": r"ShaderMaterial|fragmentShader|gl_FragColor",
    "canvas-2d": r"getContext\(['\"]2d",
    "clip-path": r"clip-path|clipPath",
    "mask": r"-webkit-mask|mask-image",
    "mix-blend": r"mix-blend-mode",
    "sticky": r"position:\s*sticky",
    "page-transition": r"next-view-transitions|next-transition-router|startViewTransition",
    "fisica": r"matter-js|Matter\.|cannon-es|rapier",
    "video": r"<video|\.mp4",
    "webgl-post": r"postprocessing|EffectComposer",
    "spline": r"@splinetool",
    "framer-motion": r"framer-motion",
}


def arquivos_codigo(raiz):
    for r, dirs, files in os.walk(raiz):
        dirs[:] = [d for d in dirs if d not in IGNORAR]
        for f in files:
            if f.endswith(COD) and f not in NAO_COPIAR:
                yield os.path.join(r, f)


def peso_assets(raiz):
    total = 0
    for r, dirs, files in os.walk(raiz):
        dirs[:] = [d for d in dirs if d not in IGNORAR]
        for f in files:
            if not f.endswith(COD):
                try:
                    total += os.path.getsize(os.path.join(r, f))
                except OSError:
                    pass
    return total


# Pastas de DOCUMENTACAO. O que esta aqui e prosa e exemplo, nao o que o
# projeto usa. Um starter com um guia sobre three.js seria catalogado como
# projeto three.js sem esta separacao — e a busca entregaria a peca errada.
DOCS = ("obsidian/", ".claude/", "docs/", "documentation/", ".github/")


def eh_documentacao(rel):
    return rel.endswith(".md") or rel.startswith(DOCS)


def sondar(proj):
    textos_arq, textos_cod, rotas, comps, n = [], [], [], [], 0
    for caminho in arquivos_codigo(proj):
        rel = os.path.relpath(caminho, proj).replace("\\", "/")
        n += 1
        try:
            with open(caminho, encoding="utf-8", errors="replace") as fh:
                conteudo = fh.read()
        except OSError:
            continue
        textos_arq.append(conteudo)
        if not eh_documentacao(rel):
            textos_cod.append(conteudo)

        if rel.endswith(".html"):
            rotas.append(rel)
        elif re.match(r"(?:src/)?app/page\.[jt]sx?$", rel):
            rotas.append("/")
        else:
            m = re.match(r"(?:src/)?app/(.+)/page\.[jt]sx?$", rel)
            if m:
                rotas.append("/" + m.group(1))
        m = re.match(r".*/components/([A-Za-z0-9_-]+)", rel)
        if m and m.group(1) not in comps:
            comps.append(m.group(1))

    junto = "\n".join(textos_arq)
    # tecnica sai SO do codigo: doc cheia de exemplo contamina a deteccao
    codigo = "\n".join(textos_cod)

    def tem_config(nome):
        # .ts existe desde o Next 15 e era o que faltava aqui
        return any(os.path.exists(os.path.join(proj, f"{nome}.{e}"))
                   for e in ("ts", "mjs", "js", "cjs"))

    stack = []
    if tem_config("next.config"):
        stack.append("nextjs")
    if tem_config("vite.config"):
        stack.append("vite")
    if re.search(r"\.jsx|\.tsx|from ['\"]react", junto):
        stack.append("react")
    if not stack or (not any(s in stack for s in ("nextjs", "vite", "react"))):
        stack.append("html-css-js")
    if "tailwind" in junto.lower():
        stack.append("tailwind")

    deps = []
    pkg = os.path.join(proj, "package.json")
    if os.path.exists(pkg):
        try:
            with open(pkg, encoding="utf-8") as fh:
                d = json.load(fh)
            deps = sorted(set(d.get("dependencies", {})) - {"react", "react-dom", "next"})
        except Exception:
            pass

    return {
        "stack": sorted(set(stack)),
        "deps": deps,
        "rotas": sorted(set(rotas))[:14],
        "componentes": comps[:16],
        "tecnicas": [k for k, p in TECNICAS.items() if re.search(p, codigo)],
        "arquivos_codigo": n,
        "peso_assets_mb": round(peso_assets(proj) / 1e6, 1),
    }


def copiar_codigo(proj, destino):
    copiados = 0
    for caminho in arquivos_codigo(proj):
        rel = os.path.relpath(caminho, proj)
        alvo = os.path.join(destino, rel)
        os.makedirs(os.path.dirname(alvo), exist_ok=True)
        shutil.copy2(caminho, alvo)
        copiados += 1
    return copiados


def main():
    p = argparse.ArgumentParser()
    p.add_argument("pasta")
    p.add_argument("--analisar", action="store_true")
    p.add_argument("--id")
    p.add_argument("--familia", choices=list(PASTA_DE), default="template")
    p.add_argument("--titulo")
    p.add_argument("--resumo", default="")
    p.add_argument("--setor", default="generico")
    p.add_argument("--estrutura")
    p.add_argument("--quando-usar")
    p.add_argument("--nao-usar-quando", default="")
    p.add_argument("--tags", default="")
    p.add_argument("--qualidade", default="producao",
                   choices=["favorito", "producao", "rascunho", "descartar"])
    args = p.parse_args()

    proj = os.path.abspath(args.pasta)
    if not os.path.isdir(proj):
        sys.exit(f"pasta não encontrada: {proj}")

    info = sondar(proj)

    if args.analisar:
        print(json.dumps(info, ensure_ascii=False, indent=2))
        return

    faltando = [f for f in ("id", "titulo", "estrutura", "quando_usar")
                if not getattr(args, f, None)]
    if faltando:
        sys.exit("faltam: " + ", ".join("--" + f.replace("_", "-") for f in faltando))

    destino = os.path.join(ACERVO, PASTA_DE[args.familia], args.id)
    if os.path.exists(os.path.join(destino, "item.json")):
        sys.exit(f"já existe item '{args.id}'")
    os.makedirs(destino, exist_ok=True)

    n = copiar_codigo(proj, os.path.join(destino, "codigo"))

    item = {
        "id": args.id,
        "familia": args.familia,
        "titulo": args.titulo,
        "resumo": args.resumo or args.titulo,
        "setor": args.setor,
        "estrutura": args.estrutura,
        "qualidade": args.qualidade,
        "quando_usar": args.quando_usar,
        "nao_usar_quando": args.nao_usar_quando or "Nenhuma restrição registrada.",
        "tags": sorted(set([t.strip() for t in args.tags.split(",") if t.strip()]
                           + info["tecnicas"])),
        "stack": info["stack"],
        "deps": info["deps"],
        "fontes": [],
        "marca": None,
        "rotas": info["rotas"],
        "componentes": info["componentes"],
        "tecnicas": info["tecnicas"],
        "projeto_origem": proj,
        "peso_assets_mb": info["peso_assets_mb"],
        "caminho": f"acervo/{PASTA_DE[args.familia]}/{args.id}/codigo",
        "arquivo_origem": os.path.basename(proj),
        "linhas": 0,
        "tem_video": "video" in info["tecnicas"],
        "tem_webgl": any(t in info["tecnicas"] for t in ("three", "shader", "webgl-post")),
        "tem_scroll": any(t in info["tecnicas"] for t in ("scrolltrigger", "scrub", "sticky", "lenis")),
        "assets_total": 0,
        "assets_pereciveis": False,
    }
    with open(os.path.join(destino, "item.json"), "w", encoding="utf-8", newline="\n") as fh:
        json.dump(item, fh, ensure_ascii=False, indent=1)

    linhas = [
        f"# {args.titulo}", "",
        item["resumo"], "",
        "## Onde estão os assets", "",
        "Só o código foi copiado para o acervo. As imagens, vídeos e fontes",
        f"({info['peso_assets_mb']} MB) continuam no projeto original:", "",
        f"    {proj}", "",
        "Se essa pasta sair do lugar, o código aqui continua válido mas a mídia quebra.",
        "`curar.py` verifica se o caminho ainda existe.", "",
        "## Técnicas", "", ", ".join(info["tecnicas"]) or "_nenhuma detectada_", "",
    ]
    if info["rotas"]:
        linhas += ["## Rotas", "", ", ".join(info["rotas"]), ""]
    if info["componentes"]:
        linhas += ["## Componentes", "", ", ".join(info["componentes"]), ""]
    if info["deps"]:
        linhas += ["## Instalar", "", "```bash", f"npm i {' '.join(info['deps'])}", "```", ""]
    linhas += ["## Quando usar", "", args.quando_usar, "",
               "## Quando não usar", "", args.nao_usar_quando or "_não registrado_"]

    with open(os.path.join(destino, "README.md"), "w", encoding="utf-8", newline="\n") as fh:
        fh.write("\n".join(linhas) + "\n")

    print(f"'{args.id}' ingerido como {args.familia}: {n} arquivos de código copiados")
    print(f"  assets ({info['peso_assets_mb']} MB) permanecem em {proj}")
    print(f"  técnicas: {', '.join(info['tecnicas'])}")


if __name__ == "__main__":
    main()
