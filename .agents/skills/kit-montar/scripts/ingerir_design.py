#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Ingere um design system no formato "Style Reference".

Esse formato e rigidamente estruturado (cabecalho, tagline, tema, secoes fixas),
entao quase toda a ficha sai por extracao — nao por adivinhacao. O parser puxa
nome, tagline, tema, paleta completa, fontes e marcas similares. So o julgamento
(quando usar / nao usar / setor) vem de fora.

    python scripts/ingerir_design.py "DESIGN (1).md" --analisar
    python scripts/ingerir_design.py "DESIGN (1).md" --id gt-america \\
        --setor tipografia --quando-usar "..." --nao-usar-quando "..."

    # digest de uma pasta inteira, para escrever os campos de julgamento:
    python scripts/ingerir_design.py <pasta> --digest > digest.txt
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

PASTA = "design-systems"


def secao(texto, nome):
    m = re.search(rf"^## {re.escape(nome)}\s*\n(.*?)(?=^## |\Z)", texto, re.S | re.M)
    return m.group(1).strip() if m else ""


def analisar(caminho):
    with open(caminho, encoding="utf-8", errors="replace") as fh:
        texto = fh.read()

    m = re.search(r"^#\s+(.+?)\s+—\s+Style Reference", texto, re.M)
    nome = m.group(1).strip() if m else os.path.splitext(os.path.basename(caminho))[0]

    m = re.search(r"^>\s*(.+)$", texto, re.M)
    tagline = m.group(1).strip() if m else ""

    m = re.search(r"^\*\*Theme:\*\*\s*(\w+)", texto, re.M)
    tema = m.group(1).strip().lower() if m else "?"

    # o paragrafo de prosa logo apos o cabecalho descreve o sistema inteiro
    m = re.search(r"^\*\*Theme:\*\*.*?\n\n(.+?)(?=\n\n|\n## )", texto, re.S | re.M)
    prosa = " ".join(m.group(1).split()) if m else ""

    cores = []
    bloco = secao(texto, "Tokens — Colors")
    for linha in bloco.splitlines():
        c = [x.strip() for x in linha.strip().strip("|").split("|")]
        if len(c) >= 3 and c[1].startswith("`#"):
            cores.append({"nome": c[0], "hex": c[1].strip("`"),
                          "papel": (c[3] if len(c) > 3 else "")[:120]})

    fontes = []
    for m in re.finditer(r"^### (.+?)\s+—", secao(texto, "Tokens — Typography"), re.M):
        f = m.group(1).strip()
        if f not in fontes:
            fontes.append(f)

    similares = []
    for m in re.finditer(r"^-\s+\*\*(.+?)\s*\((.+?)\)\*\*", secao(texto, "Similar Brands"), re.M):
        similares.append({"marca": m.group(1).strip(), "site": m.group(2).strip()})

    css = ""
    m = re.search(r"```css\s*\n(.*?)```", secao(texto, "Quick Start"), re.S)
    if m:
        css = m.group(1)

    return {
        "nome": nome,
        "tagline": tagline,
        "tema": tema,
        "prosa": prosa,
        "cores": cores,
        "paleta": [c["hex"] for c in cores],
        "fontes": fontes,
        "similares": similares,
        "tem_css_pronto": bool(css),
        "secoes": re.findall(r"^## (.+)$", texto, re.M),
        "bytes": len(texto),
    }


def digest(pasta):
    arquivos = sorted(
        (f for f in os.listdir(pasta) if f.lower().endswith(".md")),
        key=lambda n: (len(n), n),
    )
    for nome_arq in arquivos:
        d = analisar(os.path.join(pasta, nome_arq))
        if not d["tagline"]:
            continue
        marcas = ", ".join(s["marca"] for s in d["similares"][:4])
        print(f"{nome_arq} :: {d['nome']} :: {d['tema']} :: {d['tagline']}")
        print(f"   paleta: {' '.join(d['paleta'][:6])}")
        print(f"   fontes: {', '.join(d['fontes'][:4])}")
        print(f"   similares: {marcas}")
        print(f"   {d['prosa'][:300]}")
        print()


def main():
    p = argparse.ArgumentParser()
    p.add_argument("alvo")
    p.add_argument("--analisar", action="store_true")
    p.add_argument("--digest", action="store_true", help="alvo é pasta; imprime resumo de todos")
    p.add_argument("--id")
    p.add_argument("--setor", default="generico")
    p.add_argument("--quando-usar")
    p.add_argument("--nao-usar-quando", default="")
    p.add_argument("--tags", default="")
    p.add_argument("--qualidade", default="producao",
                   choices=["favorito", "producao", "rascunho", "descartar"])
    args = p.parse_args()

    if args.digest:
        digest(args.alvo)
        return

    d = analisar(args.alvo)

    if args.analisar:
        print(json.dumps(d, ensure_ascii=False, indent=2)[:2500])
        return

    if not args.id or not args.quando_usar:
        sys.exit("faltam: --id e/ou --quando-usar")

    destino = os.path.join(ACERVO, PASTA, args.id)
    if os.path.exists(os.path.join(destino, "item.json")):
        sys.exit(f"já existe item '{args.id}'")
    os.makedirs(destino, exist_ok=True)
    # guarda o original: num acervo novo a pasta ainda nao existe
    os.makedirs(os.path.join(RAIZ, "_fonte"), exist_ok=True)
    shutil.copy2(args.alvo, os.path.join(destino, "design-system.md"))
    shutil.copy2(args.alvo, os.path.join(RAIZ, "_fonte", os.path.basename(args.alvo)))

    # tema, nomes de cor e marcas similares viram tag: sao os eixos reais de busca aqui
    tags = set(t.strip() for t in args.tags.split(",") if t.strip())
    tags.add(f"tema-{d['tema']}")
    for c in d["cores"][:4]:
        tags.add(re.sub(r"[^a-z0-9]+", "-", c["nome"].lower()).strip("-"))

    item = {
        "id": args.id,
        "familia": "design-system",
        "titulo": f"{d['nome']} — {d['tagline']}",
        "resumo": d["prosa"][:400] or d["tagline"],
        "setor": args.setor,
        "estrutura": "design-system",
        "qualidade": args.qualidade,
        "quando_usar": args.quando_usar,
        "nao_usar_quando": args.nao_usar_quando or "Nenhuma restrição registrada.",
        "tags": sorted(tags),
        "stack": ["css-tokens"],
        "deps": [],
        "fontes": d["fontes"],
        "marca": d["nome"],
        "tema": d["tema"],
        "paleta": d["paleta"],
        "marcas_similares": [s["marca"] for s in d["similares"]],
        "sites_similares": [s["site"] for s in d["similares"]],
        "tem_css_pronto": d["tem_css_pronto"],
        "caminho": f"acervo/{PASTA}/{args.id}/design-system.md",
        "arquivo_origem": os.path.basename(args.alvo),
        "linhas": 0,
        "tem_video": False, "tem_webgl": False, "tem_scroll": False,
        "assets_total": 0, "assets_pereciveis": False,
    }
    with open(os.path.join(destino, "item.json"), "w", encoding="utf-8", newline="\n") as fh:
        json.dump(item, fh, ensure_ascii=False, indent=1)

    print(f"'{args.id}' ingerido: {d['nome']} ({d['tema']}), "
          f"{len(d['paleta'])} cores, {len(d['fontes'])} fontes, "
          f"{len(d['similares'])} marcas similares")


if __name__ == "__main__":
    main()
