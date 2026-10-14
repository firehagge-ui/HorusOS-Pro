#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Acrescenta uma peca nova ao acervo. Classifica por CONTEUDO (a extensao mente:
30 dos arquivos originais eram .md contendo TSX), extrai os sinais tecnicos
sozinho e grava a ficha.

    python scripts/ingerir.py caminho/do/arquivo.tsx \
        --id hero-parallax-joia \
        --titulo "Hero com parallax de joia" \
        --setor joias --estrutura hero \
        --quando-usar "..." --nao-usar-quando "..." \
        --tags escuro,parallax,luxo --qualidade producao

    # so inspecionar, sem gravar:
    python scripts/ingerir.py arquivo.tsx --analisar

Depois rode: python scripts/indexar.py
"""

import argparse
import json
import os
import shutil
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import normalizar as N  # noqa: E402
from caminhos import RAIZ, ACERVO, saida_utf8  # noqa: E402

saida_utf8()

PASTA_DE = {"prompt": "prompts", "efeito": "efeitos", "html": "html", "ui": "ui"}
EXT_DE = {"prompt": ".md", "efeito": ".tsx", "html": ".html", "ui": ".tsx"}


def analisar(caminho):
    bruto = N.ler(caminho)
    texto = N.LIXO_PREFIXO.sub("", bruto.lstrip("﻿")).strip() + "\n"
    nome = os.path.basename(caminho)
    familia = N.classificar(nome, texto)
    dados = {
        "familia": familia,
        "stack": N.detectar_stack(texto),
        "deps": N.detectar_deps(texto, familia),
        "assets": N.detectar_assets(texto),
        "fontes": N.detectar_fontes(texto),
        "marca": N.nome_marca(texto),
        "linhas": texto.count("\n"),
        "tem_video": ".mp4" in texto.lower() or "<video" in texto.lower(),
        "tem_webgl": bool(N.re.search(r"webgl|three\.|<canvas|shadermaterial", texto, N.re.I)),
        "tem_scroll": bool(N.re.search(r"scrolltrigger|scrollprogress|scrollY|sticky|scroll-driven", texto, N.re.I)),
    }
    if familia in ("efeito", "ui"):
        dados.update(N.resumo_codigo(texto))
    return texto, dados


def main():
    p = argparse.ArgumentParser()
    p.add_argument("arquivo")
    p.add_argument("--analisar", action="store_true", help="só mostra o que detectou, não grava")
    p.add_argument("--id")
    p.add_argument("--titulo")
    p.add_argument("--resumo", default="")
    p.add_argument("--setor", default="generico")
    p.add_argument("--estrutura")
    p.add_argument("--quando-usar")
    p.add_argument("--nao-usar-quando", default="")
    p.add_argument("--tags", default="")
    p.add_argument("--qualidade", default="producao",
                   choices=["favorito", "producao", "rascunho", "descartar"])
    p.add_argument("--forcar-familia", choices=list(PASTA_DE))
    args = p.parse_args()

    if not os.path.isfile(args.arquivo):
        sys.exit(f"arquivo não encontrado: {args.arquivo}")

    texto, dados = analisar(args.arquivo)
    if args.forcar_familia:
        dados["familia"] = args.forcar_familia

    if args.analisar:
        print(json.dumps(dados, ensure_ascii=False, indent=2))
        print("\nPreencha agora: --id --titulo --estrutura --quando-usar --nao-usar-quando")
        return

    faltando = [f for f in ("id", "titulo", "estrutura", "quando_usar")
                if not getattr(args, f, None)]
    if faltando:
        sys.exit(f"faltam argumentos obrigatórios: {', '.join('--' + f.replace('_','-') for f in faltando)}")

    familia = dados["familia"]
    destino = os.path.join(ACERVO, PASTA_DE[familia], args.id)
    if os.path.exists(os.path.join(destino, "item.json")):
        sys.exit(f"já existe item com id '{args.id}'. Escolha outro id ou apague o antigo.")
    os.makedirs(destino, exist_ok=True)

    nome_arq = ("prompt" if familia == "prompt" else "source") + EXT_DE[familia]
    with open(os.path.join(destino, nome_arq), "w", encoding="utf-8", newline="\n") as fh:
        fh.write(texto)
    # guarda o original: num acervo novo a pasta ainda nao existe
    os.makedirs(os.path.join(RAIZ, "_fonte"), exist_ok=True)
    shutil.copy2(args.arquivo, os.path.join(RAIZ, "_fonte", os.path.basename(args.arquivo)))

    item = {
        "id": args.id,
        "familia": familia,
        "titulo": args.titulo,
        "resumo": args.resumo or args.titulo,
        "setor": args.setor,
        "estrutura": args.estrutura,
        "qualidade": args.qualidade,
        "quando_usar": args.quando_usar,
        "nao_usar_quando": args.nao_usar_quando or "Nenhuma restrição registrada.",
        "tags": [t.strip() for t in args.tags.split(",") if t.strip()],
        "stack": dados["stack"],
        "deps": dados["deps"],
        "fontes": dados["fontes"],
        "marca": dados["marca"],
        "caminho": f"acervo/{PASTA_DE[familia]}/{args.id}/{nome_arq}",
        "arquivo_origem": os.path.basename(args.arquivo),
        "linhas": dados["linhas"],
        "tem_video": dados["tem_video"],
        "tem_webgl": dados["tem_webgl"],
        "tem_scroll": dados["tem_scroll"],
        "assets_total": dados["assets"]["total"],
        "assets_pereciveis": dados["assets"]["perecivel"],
    }
    with open(os.path.join(destino, "item.json"), "w", encoding="utf-8", newline="\n") as fh:
        json.dump(item, fh, ensure_ascii=False, indent=1)

    print(f"'{args.id}' ingerido como {familia} em acervo/{PASTA_DE[familia]}/{args.id}/")
    print(f"  stack={','.join(item['stack'])}")
    if item["deps"]:
        print(f"  deps={','.join(item['deps'])}")
    if item["assets_pereciveis"]:
        print(f"  [!] {item['assets_total']} assets externos que podem expirar")
    print("rode agora: python scripts/indexar.py")


if __name__ == "__main__":
    main()
