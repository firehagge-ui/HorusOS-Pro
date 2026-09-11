#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Ingere um componente vindo de um registro shadcn (smoothui, shadcn/ui, etc).

O JSON de registro ja traz titulo, descricao oficial, dependencias npm E o grafo
de dependencias entre componentes — nada disso precisa ser inferido do codigo.
Por isso vale buscar do registro em vez de rodar `shadcn add` num projeto
descartavel e depois varrer o disco.

    python scripts/ingerir_registro.py --url https://smoothui.dev/r/siri-orb.json --analisar
    python scripts/ingerir_registro.py --arquivo cache/siri-orb.json \\
        --id sui-siri-orb --estrutura componente-ai \\
        --quando-usar "..." --nao-usar-quando "..." --tags "..."
"""

import argparse
import json
import os
import sys
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from caminhos import ACERVO, saida_utf8  # noqa: E402

saida_utf8()

PASTA = "ui"


def carregar(url=None, arquivo=None):
    if url:
        with urllib.request.urlopen(url, timeout=25) as r:
            return json.loads(r.read())
    with open(arquivo, encoding="utf-8") as fh:
        return json.load(fh)


def resumir(d):
    arquivos = d.get("files", [])
    return {
        "name": d.get("name"),
        "title": d.get("title"),
        "description": d.get("description") or "",
        "type": d.get("type"),
        "deps": d.get("dependencies", []),
        # o registro aponta dependencias como URL; guardamos so o nome
        "precisa": [x.split("/")[-1].replace(".json", "")
                    for x in d.get("registryDependencies", [])],
        "arquivos": [a.get("path") for a in arquivos if a.get("path")],
        "chars": sum(len(a.get("content", "")) for a in arquivos),
    }


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--url")
    p.add_argument("--arquivo")
    p.add_argument("--analisar", action="store_true")
    p.add_argument("--id")
    p.add_argument("--registro", default="smoothui", help="nome do registro de origem")
    p.add_argument("--setor", default="generico")
    p.add_argument("--estrutura", default="componente-ui")
    p.add_argument("--quando-usar")
    p.add_argument("--nao-usar-quando", default="")
    p.add_argument("--tags", default="")
    p.add_argument("--qualidade", default="producao",
                   choices=["favorito", "producao", "rascunho", "descartar"])
    args = p.parse_args()

    if not args.url and not args.arquivo:
        sys.exit("informe --url ou --arquivo")

    d = carregar(args.url, args.arquivo)
    r = resumir(d)

    if args.analisar:
        print(json.dumps(r, ensure_ascii=False, indent=2))
        return

    if not args.id or not args.quando_usar:
        sys.exit("faltam: --id e/ou --quando-usar")

    destino = os.path.join(ACERVO, PASTA, args.id)
    if os.path.exists(os.path.join(destino, "item.json")):
        sys.exit(f"já existe item '{args.id}'")
    os.makedirs(destino, exist_ok=True)

    principal = None
    for a in d.get("files", []):
        nome = os.path.basename(a.get("path") or "index.tsx")
        alvo = os.path.join(destino, nome)
        with open(alvo, "w", encoding="utf-8", newline="\n") as fh:
            fh.write(a.get("content", ""))
        if principal is None:
            principal = nome
    principal = principal or "index.tsx"

    tags = set(t.strip() for t in args.tags.split(",") if t.strip())
    tags.add(args.registro)
    conteudo = " ".join(a.get("content", "") for a in d.get("files", []))

    item = {
        "id": args.id,
        "familia": "ui",
        "titulo": f"{r['title'] or r['name']} ({args.registro})",
        "resumo": r["description"] or (r["title"] or r["name"]),
        "setor": args.setor,
        "estrutura": args.estrutura,
        "qualidade": args.qualidade,
        "quando_usar": args.quando_usar,
        "nao_usar_quando": args.nao_usar_quando or "Nenhuma restrição registrada.",
        "tags": sorted(tags),
        "stack": ["nextjs", "react", "typescript"],
        "deps": sorted(r["deps"]),
        # componentes do proprio registro que precisam ser instalados junto
        "precisa_componentes": sorted(r["precisa"]),
        "fontes": [],
        "marca": None,
        "registro": args.registro,
        "comando": f"npx shadcn@latest add @{args.registro}/{r['name']}",
        "caminho": f"acervo/{PASTA}/{args.id}/{principal}",
        "arquivo_origem": f"@{args.registro}/{r['name']}",
        "linhas": conteudo.count("\n"),
        "tem_video": False,
        "tem_webgl": any(k in conteudo for k in ("WebGL", "createShader", "fragmentShader", "gl_FragColor")),
        "tem_scroll": any(k in conteudo for k in ("useScroll", "scrollY", "ScrollTrigger", "IntersectionObserver")),
        "assets_total": 0,
        "assets_pereciveis": False,
    }
    with open(os.path.join(destino, "item.json"), "w", encoding="utf-8", newline="\n") as fh:
        json.dump(item, fh, ensure_ascii=False, indent=1)

    extra = f"  precisa: {', '.join(r['precisa'])}" if r["precisa"] else ""
    print(f"'{args.id}' ingerido de @{args.registro}/{r['name']} "
          f"({len(r['arquivos'])} arq, {r['chars']}c){extra}")


if __name__ == "__main__":
    main()
