#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Ingere varios projetos de uma vez a partir de um arquivo de lote.

    python scripts/lote.py _lote_codegrid.json
    python scripts/lote.py _lote_codegrid.json --simular

Formato do lote:
    {"base": "<pasta raiz>", "itens": [{"pasta": "...", "id": "...", ...}, ...]}
"""

import argparse
import json
import os
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from caminhos import RAIZ, saida_utf8  # noqa: E402

saida_utf8()

AQUI = os.path.dirname(os.path.abspath(__file__))


def main():
    p = argparse.ArgumentParser()
    p.add_argument("lote")
    p.add_argument("--simular", action="store_true", help="mostra o que faria, sem gravar")
    args = p.parse_args()

    caminho = args.lote if os.path.isabs(args.lote) else os.path.join(RAIZ, args.lote)
    with open(caminho, encoding="utf-8") as fh:
        dados = json.load(fh)

    base = dados["base"]
    ok, falhas, pulados = 0, [], []

    tipo_lote = dados.get("tipo", "projeto")

    for item in dados["itens"]:
        alvo = os.path.join(base, item["pasta"])
        tipo = item.get("tipo", tipo_lote)

        if tipo == "registro":
            if not os.path.isfile(alvo):
                falhas.append((item["id"], "json de registro não existe"))
                continue
            cmd = [
                sys.executable, os.path.join(AQUI, "ingerir_registro.py"),
                "--arquivo", alvo,
                "--id", item["id"],
                "--registro", item.get("registro", dados.get("registro", "smoothui")),
                "--setor", item.get("setor", "generico"),
                "--estrutura", item.get("estrutura", "componente-ui"),
                "--quando-usar", item["quando_usar"],
                "--nao-usar-quando", item.get("nao_usar_quando", ""),
                "--tags", item.get("tags", ""),
                "--qualidade", item.get("qualidade", "producao"),
            ]
            if args.simular:
                print(f"[simulação] {item['id']:30s} <- {item['pasta']}")
                ok += 1
                continue
            r = subprocess.run(cmd, capture_output=True, text=True,
                               encoding="utf-8", errors="replace")
            if r.returncode == 0:
                print(f"  ok  {(r.stdout or '').strip().splitlines()[0]}")
                ok += 1
            elif "já existe item" in (r.stdout or "") + (r.stderr or ""):
                pulados.append(item["id"])
            else:
                falhas.append((item["id"], ((r.stderr or r.stdout).strip().splitlines() or [""])[-1]))
            continue

        if tipo == "design":
            if not os.path.isfile(alvo):
                falhas.append((item["id"], "arquivo não existe"))
                continue
            cmd = [
                sys.executable, os.path.join(AQUI, "ingerir_design.py"), alvo,
                "--id", item["id"],
                "--setor", item.get("setor", "generico"),
                "--quando-usar", item["quando_usar"],
                "--nao-usar-quando", item.get("nao_usar_quando", ""),
                "--tags", item.get("tags", ""),
                "--qualidade", item.get("qualidade", "producao"),
            ]
            if args.simular:
                print(f"[simulação] {item['id']:28s} <- {item['pasta']}")
                ok += 1
                continue
            r = subprocess.run(cmd, capture_output=True, text=True,
                               encoding="utf-8", errors="replace")
            if r.returncode == 0:
                print(f"  ok  {(r.stdout or '').strip().splitlines()[0]}")
                ok += 1
            elif "já existe item" in (r.stdout or "") + (r.stderr or ""):
                pulados.append(item["id"])
            else:
                falhas.append((item["id"], ((r.stderr or r.stdout).strip().splitlines() or [""])[-1]))
            continue

        if not os.path.isdir(alvo):
            falhas.append((item["id"], "pasta não existe"))
            continue

        cmd = [
            sys.executable, os.path.join(AQUI, "ingerir_projeto.py"), alvo,
            "--id", item["id"],
            "--familia", item["familia"],
            "--titulo", item["titulo"],
            "--resumo", item.get("resumo", ""),
            "--setor", item.get("setor", "generico"),
            "--estrutura", item["estrutura"],
            "--quando-usar", item["quando_usar"],
            "--nao-usar-quando", item.get("nao_usar_quando", ""),
            "--tags", item.get("tags", ""),
            "--qualidade", item.get("qualidade", "producao"),
        ]

        if args.simular:
            print(f"[simulação] {item['id']:28s} <- {item['pasta']}")
            ok += 1
            continue

        r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
        if r.returncode == 0:
            primeira = (r.stdout or "").strip().splitlines()[0] if r.stdout else ""
            print(f"  ok  {primeira}")
            ok += 1
        elif "já existe item" in (r.stdout or "") + (r.stderr or ""):
            pulados.append(item["id"])
        else:
            falhas.append((item["id"], ((r.stderr or r.stdout).strip().splitlines() or [""])[-1]))

    print(f"\ningeridos: {ok}   já existiam: {len(pulados)}   falhas: {len(falhas)}")
    if pulados:
        print(f"  pulados: {', '.join(pulados)}")
    for pid, motivo in falhas:
        print(f"  FALHA {pid}: {motivo}")
    if not args.simular and ok:
        print("\nrode agora: python scripts/indexar.py")


if __name__ == "__main__":
    main()
