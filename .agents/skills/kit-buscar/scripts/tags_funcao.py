#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Acrescenta TAGS DE FUNÇÃO às fichas.

O acervo nasceu indexado por caráter visual ("creme editorial") e por técnica
("pin, scrub, lenis"). Nunca por FUNÇÃO — o que a peça faz. Por isso o
format-archive tem 475 ocorrências de carrinho/produto/catálogo no código e some
quando alguém busca "grade de produtos".

Grava num arquivo lateral, como as armadilhas: funciona igual em item da
importação inicial (só meta.yaml) e nos posteriores (item.json).

    python scripts/tags_funcao.py --auditar
    python scripts/tags_funcao.py --add <id> --tags catalogo,carrinho
    python scripts/tags_funcao.py --lote <arquivo>.json
"""

import argparse
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from caminhos import ACERVO, exigir_indice, saida_utf8  # noqa: E402

saida_utf8()

# Funcao -> padrao no CODIGO. Minimo de ocorrencias para nao pegar mencao solta.
DETECTORES = {
    "formulario": (r"<form\b|onSubmit|handleSubmit", 3),
    "calendario": (r"\b(calendar|datepicker|date-picker|dayjs|date-fns)\b", 3),
    "agendamento": (r"\b(booking|appointment|reservation|reserve|agendar)\b", 3),
    "mapa": (r"\b(mapbox|leaflet|google\.maps|openstreetmap)\b", 2),
    "catalogo": (r"\b(catalog|catalogue|products?\.map|product-grid|sku)\b", 4),
    "carrinho": (r"\b(add.?to.?cart|addToCart|shopping.?cart|checkout)\b", 3),
    "faq": (r"\b(faq|accordion)\b|<details", 3),
    "pricing": (r"\b(pricing|per month|/mo\b|tier|plan[s]?\b)\b", 4),
    "dashboard": (r"\b(dashboard|recharts|chart\.js)\b|<table", 3),
    "autenticacao": (r"\b(sign.?up|sign.?in|login|password)\b", 3),
    "busca": (r"\b(search|filter|autocomplete)\b", 4),
}

IGNORAR_DIR = {"node_modules", ".git", "assets", "public", "images", ".next", "dist"}
EXT = (".js", ".jsx", ".ts", ".tsx", ".html", ".md")


def pasta_do_item(item_id):
    for fam in sorted(os.listdir(ACERVO)):
        d = os.path.join(ACERVO, fam, item_id)
        if os.path.isdir(d):
            return d
    return None


def ler_codigo(base):
    t = []
    for r, dirs, files in os.walk(base):
        dirs[:] = [x for x in dirs if x not in IGNORAR_DIR]
        for f in files:
            if f.endswith(EXT) and f != "package-lock.json":
                try:
                    with open(os.path.join(r, f), encoding="utf-8", errors="replace") as fh:
                        t.append(fh.read())
                except OSError:
                    pass
    return "\n".join(t)


def add(item_id, tags):
    d = pasta_do_item(item_id)
    if not d:
        return False, "pasta não encontrada"
    p = os.path.join(d, "tags_funcao.json")
    atual = []
    if os.path.exists(p):
        with open(p, encoding="utf-8") as fh:
            atual = json.load(fh)
    novas = [t for t in tags if t not in atual]
    if not novas:
        return False, "nada novo"
    atual += novas
    with open(p, "w", encoding="utf-8", newline="\n") as fh:
        json.dump(sorted(atual), fh, ensure_ascii=False, indent=1)
    return True, ", ".join(novas)


def auditar():
    idx = {i["id"]: i for i in exigir_indice()}
    propostas = {}
    for fam in sorted(os.listdir(ACERVO)):
        fdir = os.path.join(ACERVO, fam)
        if not os.path.isdir(fdir):
            continue
        for item in sorted(os.listdir(fdir)):
            base = os.path.join(fdir, item)
            if not os.path.isdir(base) or item not in idx:
                continue
            j = ler_codigo(base)
            if not j:
                continue
            i = idx[item]
            ficha = (i["titulo"] + " " + i["resumo"] + " " + " ".join(i["tags"])
                     + " " + i["quando_usar"] + " " + i["estrutura"]).lower()
            # Um design system nao IMPLEMENTA nada: ele especifica como o
            # componente deve parecer. Marcar os dois com a mesma etiqueta faria
            # `--tag catalogo` devolver referencia de estilo junto com codigo que roda.
            prefixo = "spec-" if i["familia"] == "design-system" else ""
            faltando = []
            for func, (pad, minimo) in DETECTORES.items():
                if len(re.findall(pad, j, re.I)) >= minimo and func not in ficha:
                    faltando.append(prefixo + func)
            if faltando:
                propostas[item] = faltando
    print(f"peças com função invisível na ficha: {len(propostas)}\n")
    for pid, fs in sorted(propostas.items(), key=lambda kv: -len(kv[1])):
        print(f"  {pid:34s} {', '.join(fs)}")
    saida = os.path.join(os.path.dirname(ACERVO), "_tags_funcao_propostas.json")
    with open(saida, "w", encoding="utf-8", newline="\n") as fh:
        json.dump([{"id": k, "tags": v} for k, v in propostas.items()],
                  fh, ensure_ascii=False, indent=1)
    print(f"\ngravado: {saida}")
    print("revise e aplique com: python scripts/tags_funcao.py --lote _tags_funcao_propostas.json")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--auditar", action="store_true")
    p.add_argument("--add")
    p.add_argument("--tags")
    p.add_argument("--lote")
    args = p.parse_args()

    if args.auditar:
        auditar()
        return
    if args.lote:
        caminho = args.lote if os.path.isabs(args.lote) else os.path.join(
            os.path.dirname(ACERVO), args.lote)
        with open(caminho, encoding="utf-8") as fh:
            dados = json.load(fh)
        ok = 0
        for e in dados:
            sucesso, _ = add(e["id"], e["tags"])
            ok += 1 if sucesso else 0
        print(f"fichas etiquetadas: {ok}")
        print("rode agora: python scripts/indexar.py")
        return
    if args.add and args.tags:
        sucesso, msg = add(args.add, [t.strip() for t in args.tags.split(",") if t.strip()])
        print(("ok " if sucesso else "nada ") + args.add + ": " + msg)
        return
    p.print_help()


if __name__ == "__main__":
    main()
