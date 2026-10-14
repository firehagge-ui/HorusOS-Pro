#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Normaliza o acervo bruto: classifica cada arquivo POR CONTEUDO (a extensao mente),
copia para acervo/<familia>/<id>/ com a extensao correta e emite _extract.jsonl
com os sinais que a Fase 2 (enriquecimento) precisa para descrever cada item.

Uso:
    python scripts/normalizar.py <pasta_origem>
"""

import hashlib
import json
import os
import re
import shutil
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from caminhos import RAIZ, ACERVO  # noqa: E402

FONTE = os.path.join(RAIZ, "_fonte")

# lixo que aparece grudado no inicio de alguns arquivos exportados
LIXO_PREFIXO = re.compile(r"^(?:626f6c742d63632d6167656e74|bolt-cc-agent)\s*")

# Em prompts (prosa) a biblioteca so conta se aparecer num contexto de codigo.
# Busca ingenua por substring da falsos positivos graves: "ogl" casa dentro de
# "Google" e "three" casa em "three sections" / "Model Three".
LIBS_PROSA = {
    "gsap": r"\bgsap\b",
    "three": r"\bthree\.js\b|\bTHREE\b|@react-three|from\s+['\"]three['\"]|WebGLRenderer|\binstall\b[^\n]*\bthree\b",
    "lenis": r"\blenis\b",
    "framer-motion": r"framer-motion|\bframer\s+motion\b",
    "motion/react": r"motion/react",
    "swiper": r"\bswiper\b",
    "lucide-react": r"lucide-react",
    "anime.js": r"\banime\.js\b|\banimejs\b",
    "@react-three/fiber": r"@react-three/fiber",
    "drei": r"@react-three/drei",
    "next-themes": r"next-themes",
    "embla-carousel": r"embla-carousel",
    "@number-flow/react": r"@number-flow/react",
    "use-sound": r"\buse-sound\b",
    "@radix-ui": r"@radix-ui",
    "react-intersection-observer": r"react-intersection-observer",
    "media-chrome": r"media-chrome",
    "matter-js": r"\bmatter-js\b",
    "ogl": r"\bogl\b",
    "shadcn": r"\bshadcn\b",
    "hls.js": r"\bhls\.js\b",
    "react-player": r"react-player",
    "react-router-dom": r"react-router-dom",
    "geist": r"\bgeist\b",
}

# dominios cujos assets somem com o tempo (figma sites, buckets temporarios de IA)
DOMINIOS_PERECIVEIS = ("figma.site", "cloudfront.net", "higgs.ai", "blob.core", "replicate.delivery")


def ler(caminho):
    with open(caminho, "r", encoding="utf-8", errors="replace") as fh:
        return fh.read()


def linhas_uteis(texto):
    return [ln.strip() for ln in texto.splitlines() if ln.strip()]


def classificar(nome, texto):
    """Familia por conteudo, nunca por extensao."""
    if nome.lower().endswith(".tsx"):
        return "ui"
    cabeca = texto.lstrip()[:400].lower()
    if cabeca.startswith('"use client"') or cabeca.startswith("'use client'"):
        return "efeito"
    if cabeca.startswith("<!doctype html") or cabeca.startswith("<html"):
        return "html"
    if re.match(r"^import\s+[\w{*]", cabeca):
        return "efeito"
    return "prompt"


def detectar_stack(texto):
    t = texto.lower()
    stack = []
    if "next.js" in t or "next/link" in t or "next/image" in t or '"use client"' in t:
        stack.append("nextjs")
    if "vite" in t:
        stack.append("vite")
    if "tailwind" in t:
        stack.append("tailwind")
    if "react" in t or "usestate" in t or "useeffect" in t:
        stack.append("react")
    if "typescript" in t or ": react.fc" in t or "interface " in t:
        stack.append("typescript")
    if not stack:
        stack.append("html-css-js")
    return sorted(set(stack))


def detectar_deps(texto, familia):
    achadas = set()
    if familia in ("efeito", "ui"):
        for m in re.findall(r'from\s+["\']([^"\']+)["\']', texto):
            if m.startswith("."):
                continue
            if m.startswith("@/"):
                achadas.add(m)
                continue
            # normaliza subcaminhos: three/addons/... -> three
            base = "/".join(m.split("/")[:2]) if m.startswith("@") else m.split("/")[0]
            achadas.add(base)
    else:
        for lib, padrao in LIBS_PROSA.items():
            if re.search(padrao, texto):
                achadas.add(lib)
    achadas.discard("react")
    return sorted(achadas)


def detectar_assets(texto):
    urls = re.findall(r'https?://[^\s"\'`)\]<>]+', texto)
    dominios = {}
    perecivel = False
    for u in urls:
        m = re.match(r"https?://([^/]+)", u)
        if not m:
            continue
        d = m.group(1)
        if "fonts.googleapis" in d or "fonts.gstatic" in d:
            continue
        dominios[d] = dominios.get(d, 0) + 1
        if any(p in d for p in DOMINIOS_PERECIVEIS):
            perecivel = True
    return {
        "dominios": sorted(dominios.items(), key=lambda kv: -kv[1])[:5],
        "total": sum(dominios.values()),
        "perecivel": perecivel,
    }


def detectar_fontes(texto):
    fontes = set()
    for m in re.findall(r"family=([A-Za-z0-9+%\.\-]+)", texto):
        nome = m.replace("+", " ").split(":")[0].strip()
        if nome and len(nome) < 40:
            fontes.add(nome)
    return sorted(fontes)[:6]


def nome_marca(texto):
    """Extrai o nome ficticio da marca: called "X" / called **"X"** / for "X"."""
    padroes = [
        r'called\s+\*{0,2}["“]([^"”]{2,40})["”]',
        r'named\s+\*{0,2}["“]([^"”]{2,40})["”]',
        r'for\s+\*{0,2}["“]([^"”]{2,40})["”]',
        r'Recreate\s+["“]([^"”]{2,40})["”]',
    ]
    for p in padroes:
        m = re.search(p, texto[:2000], re.IGNORECASE)
        if m:
            return m.group(1).strip()
    return None


def resumo_codigo(texto):
    """Para arquivos de codigo: nome do componente + bloco de options comentado."""
    comp = None
    for p in [
        r"export\s+default\s+function\s+(\w+)",
        r"export\s+function\s+(\w+)",
        r"export\s+const\s+(\w+)",
        r"const\s+(\w+)\s*[:=]\s*\(",
        r"function\s+(\w+)\s*\(",
    ]:
        m = re.search(p, texto)
        if m:
            comp = m.group(1)
            break

    bloco = ""
    m = re.search(r"export\s+interface\s+\w*(?:Options|Props)\s*\{(.*?)\n\}", texto, re.DOTALL)
    if m:
        bloco = m.group(1)
    else:
        m = re.search(r"interface\s+\w+\s*\{(.*?)\n\}", texto, re.DOTALL)
        if m:
            bloco = m.group(1)

    # so os comentarios JSDoc do bloco: descrevem o que cada knob faz
    docs = re.findall(r"/\*\*(.*?)\*/", bloco, re.DOTALL)
    docs = [" ".join(d.replace("*", " ").split()) for d in docs]
    props = re.findall(r"^\s*(\w+)\??\s*:", bloco, re.MULTILINE)

    return {
        "componente": comp,
        "props": props[:25],
        "docs": docs[:25],
    }


def resumo_prosa(texto, limite=1400):
    lns = linhas_uteis(texto)
    saida, total = [], 0
    for ln in lns:
        if total > limite:
            break
        saida.append(ln)
        total += len(ln)
    return "\n".join(saida)[:limite + 200]


def main():
    origem = sys.argv[1] if len(sys.argv) > 1 else None
    if not origem or not os.path.isdir(origem):
        print("uso: python scripts/normalizar.py <pasta_origem>")
        sys.exit(1)

    os.makedirs(FONTE, exist_ok=True)
    for fam in ("prompts", "efeitos", "html", "ui"):
        os.makedirs(os.path.join(ACERVO, fam), exist_ok=True)

    pasta_de = {"prompt": "prompts", "efeito": "efeitos", "html": "html", "ui": "ui"}
    ext_de = {"prompt": ".md", "efeito": ".tsx", "html": ".html", "ui": ".tsx"}

    arquivos = sorted(
        f for f in os.listdir(origem)
        if f.lower().endswith((".md", ".tsx", ".jsx", ".ts", ".html"))
        and os.path.isfile(os.path.join(origem, f))
    )

    vistos, registros, duplicatas = {}, [], []

    for nome in arquivos:
        caminho = os.path.join(origem, nome)
        bruto = ler(caminho)
        texto = LIXO_PREFIXO.sub("", bruto.lstrip("﻿")).strip() + "\n"

        h = hashlib.md5(texto.encode("utf-8")).hexdigest()
        if h in vistos:
            duplicatas.append({"descartado": nome, "identico_a": vistos[h]})
            continue
        vistos[h] = nome

        familia = classificar(nome, texto)
        item_id = re.sub(r"[^a-z0-9]+", "-", os.path.splitext(nome)[0].lower()).strip("-")

        destino_dir = os.path.join(ACERVO, pasta_de[familia], item_id)
        os.makedirs(destino_dir, exist_ok=True)
        arquivo_final = ("prompt" if familia == "prompt" else "source") + ext_de[familia]
        with open(os.path.join(destino_dir, arquivo_final), "w", encoding="utf-8", newline="\n") as fh:
            fh.write(texto)

        shutil.copy2(caminho, os.path.join(FONTE, nome))

        reg = {
            "id": item_id,
            "arquivo_origem": nome,
            "familia": familia,
            "caminho": f"acervo/{pasta_de[familia]}/{item_id}/{arquivo_final}",
            "bytes": len(texto),
            "linhas": texto.count("\n"),
            "stack": detectar_stack(texto),
            "deps": detectar_deps(texto, familia),
            "assets": detectar_assets(texto),
            "fontes": detectar_fontes(texto),
            "marca": nome_marca(texto),
            "tem_video": ".mp4" in texto.lower() or "<video" in texto.lower(),
            "tem_canvas_webgl": bool(re.search(r"webgl|three\.|<canvas|shadermaterial", texto, re.I)),
            "tem_scroll": bool(re.search(r"scrolltrigger|scrollprogress|scrollY|sticky|scroll-driven", texto, re.I)),
        }
        if familia in ("efeito", "ui"):
            reg.update(resumo_codigo(texto))
            reg["amostra"] = resumo_prosa(texto, 600)
        else:
            reg["amostra"] = resumo_prosa(texto, 1400)

        registros.append(reg)

    with open(os.path.join(RAIZ, "_extract.jsonl"), "w", encoding="utf-8", newline="\n") as fh:
        for r in registros:
            fh.write(json.dumps(r, ensure_ascii=False) + "\n")

    with open(os.path.join(RAIZ, "_duplicatas.json"), "w", encoding="utf-8", newline="\n") as fh:
        json.dump(duplicatas, fh, ensure_ascii=False, indent=2)

    print(f"itens normalizados : {len(registros)}")
    print(f"duplicatas descartadas: {len(duplicatas)}")
    for fam in ("prompt", "efeito", "html", "ui"):
        print(f"  {fam:8s}: {sum(1 for r in registros if r['familia'] == fam)}")
    for d in duplicatas:
        print(f"  descartado {d['descartado']} (identico a {d['identico_a']})")


if __name__ == "__main__":
    main()
