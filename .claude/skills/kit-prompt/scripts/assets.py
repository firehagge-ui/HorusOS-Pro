#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Inventario de assets de um prompt ou componente que ainda NAO esta no acervo.

O `ingerir.py --analisar` conta dominios; aqui interessa outra coisa: QUAIS
arquivos a peca precisa, de que TIPO cada um e, e onde ele MORA no projeto.
Sem isso a adaptacao entrega um site que aponta para imagem de figma.site que
ja caiu, ou para /hero.mp4 que ninguem nunca colocou em public/.

    python scripts/assets.py caminho/do/prompt.md
    python scripts/assets.py caminho/do/prompt.md --testar    # bate HEAD nas URLs

Standalone de proposito: roda em arquivo solto, fora do acervo, sem resolver RAIZ.
"""

import argparse
import json
import os
import re
import sys
from concurrent.futures import ThreadPoolExecutor

# espelha normalizar.DOMINIOS_PERECIVEIS — buckets que somem com o tempo
DOMINIOS_PERECIVEIS = ("figma.site", "cloudfront.net", "higgs.ai", "blob.core", "replicate.delivery")

TIPO_DE_EXT = {
    "imagem": ("png", "jpg", "jpeg", "webp", "avif", "gif", "svg"),
    "video": ("mp4", "webm", "mov", "m4v"),
    "audio": ("mp3", "wav", "ogg"),
    "modelo3d": ("glb", "gltf", "fbx", "obj", "hdr", "exr"),
    "fonte": ("woff", "woff2", "ttf", "otf"),
    "dados": ("json", "csv"),
}
EXT_MIDIA = tuple(e for grupo in TIPO_DE_EXT.values() for e in grupo)

URL = re.compile(r'https?://[^\s"\'`)\]<>]+')
# caminho local citado entre aspas/backticks: "/hero.mp4", '/assets/x.png', `public/y.glb`
LOCAL = re.compile(r"""["'`(]\s*(\.{0,2}/?[\w\-./]+\.(?:%s))\s*["'`)]""" % "|".join(EXT_MIDIA), re.I)


def tipo_de(url):
    ext = os.path.splitext(url.split("?")[0].split("#")[0])[1].lstrip(".").lower()
    for tipo, exts in TIPO_DE_EXT.items():
        if ext in exts:
            return tipo
    return "desconhecido"


def testar(url):
    import urllib.error
    import urllib.request
    try:
        req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": "cannonball"})
        with urllib.request.urlopen(req, timeout=8) as r:
            return f"ok {r.status}"
    except urllib.error.HTTPError as e:
        return f"MORTO {e.code}"
    except Exception as e:
        return f"FALHA {type(e).__name__}"


AMOSTRA = """
Video de fundo em `/videos/hero.mp4`. Logo: src="/assets/logo.svg".
Modelo: '../public/models/ring.glb'. Fora de aspas nao conta: hero.mp4
Fonte ignorada: https://fonts.googleapis.com/css2?family=Inter
Imagem: https://images.unsplash.com/photo-123.jpg
Perecivel: https://abc.figma.site/x/1.png
"""


def autoteste():
    """O valor da skill inteira depende destas duas regex acertarem."""
    urls = [u for u in URL.findall(AMOSTRA) if "fonts.g" not in u]
    assert len(urls) == 2, urls
    assert tipo_de(urls[0]) == "imagem"
    assert any(d in urls[1] for d in DOMINIOS_PERECIVEIS)
    locais = sorted(LOCAL.findall(AMOSTRA))
    assert locais == ["../public/models/ring.glb", "/assets/logo.svg", "/videos/hero.mp4"], locais
    assert tipo_de(locais[0]) == "modelo3d" and tipo_de(locais[2]) == "video"
    print("ok")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("arquivo", nargs="?")
    p.add_argument("--autoteste", action="store_true", help=argparse.SUPPRESS)
    p.add_argument("--testar", action="store_true", help="bate HEAD em cada URL (usa rede)")
    args = p.parse_args()
    if args.autoteste:
        return autoteste()
    if not args.arquivo:
        p.error("informe o arquivo")

    with open(args.arquivo, encoding="utf-8", errors="replace") as fh:
        texto = fh.read()

    externos, vistos = [], set()
    for u in URL.findall(texto):
        u = u.rstrip(".,;")
        if "fonts.googleapis" in u or "fonts.gstatic" in u or u in vistos:
            continue
        vistos.add(u)
        dominio = re.match(r"https?://([^/]+)", u).group(1)
        externos.append({
            "url": u,
            "tipo": tipo_de(u),
            "dominio": dominio,
            "perecivel": any(d in dominio for d in DOMINIOS_PERECIVEIS),
        })

    if args.testar and externos:
        with ThreadPoolExecutor(max_workers=8) as pool:
            for item, estado in zip(externos, pool.map(testar, [e["url"] for e in externos])):
                item["estado"] = estado

    locais = sorted({m for m in LOCAL.findall(texto) if not m.startswith("http")})

    saida = {
        "externos": externos,
        "locais": [{"caminho": c, "tipo": tipo_de(c)} for c in locais],
        "total_externos": len(externos),
        "pereciveis": sum(1 for e in externos if e["perecivel"]),
        "mortos": sum(1 for e in externos if e.get("estado", "").startswith(("MORTO", "FALHA"))),
    }
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    print(json.dumps(saida, ensure_ascii=False, indent=2))
    if externos and not args.testar:
        print("\nuse --testar para saber quais dessas URLs ainda respondem", file=sys.stderr)


if __name__ == "__main__":
    main()
