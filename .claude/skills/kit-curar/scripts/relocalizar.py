#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Conserta o acervo depois de mover pastas de lugar.

Tres coisas guardam caminho absoluto e quebram numa mudanca:
  1. cannonball.config.json      -> onde o repo mora
  2. projeto_origem nos itens -> onde ficaram os assets dos templates/animacoes
  3. o marketplace do plugin  -> apontado no `claude plugin marketplace add`

Este script cuida de 1 e 2. O 3 exige a CLI e sai impresso no fim.

    # so diagnosticar, sem alterar nada
    python scripts/relocalizar.py --verificar

    # repo mudou de lugar
    python scripts/relocalizar.py --para "D:/dev/cannonball"

    # a pasta de material bruto mudou de lugar
    python scripts/relocalizar.py --assets-de "C:/.../Desktop/Skills design" \\
                                  --assets-para "D:/material/sites"
"""

import argparse
import json
import os
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(AQUI)

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass


def norm(p):
    return p.replace("\\", "/").rstrip("/")


def carregar_indice(raiz):
    p = os.path.join(raiz, "acervo", "index.json")
    if not os.path.exists(p):
        return None
    with open(p, encoding="utf-8") as fh:
        return json.load(fh)["itens"]


def verificar(raiz):
    print(f"repo (onde este script está): {norm(REPO)}")
    cfg_path = os.path.join(raiz, "cannonball.config.json")
    cfg = None
    if os.path.exists(cfg_path):
        with open(cfg_path, encoding="utf-8") as fh:
            cfg = json.load(fh).get("raiz")
    marca = "ok" if cfg and os.path.isdir(cfg) else "QUEBRADO"
    print(f"config aponta para          : {cfg}  [{marca}]")

    itens = carregar_indice(raiz)
    if itens is None:
        print("index.json não encontrado — rode: python scripts/indexar.py")
        return 1

    externos = [i for i in itens if i.get("projeto_origem")]
    quebrados = [i for i in externos if not os.path.isdir(i["projeto_origem"])]
    print(f"itens que referenciam assets: {len(externos)}")
    if quebrados:
        print(f"  CAMINHO QUEBRADO em {len(quebrados)} itens. Raízes afetadas:")
        raizes = {}
        for i in quebrados:
            partes = norm(i["projeto_origem"]).split("/")
            raizes.setdefault("/".join(partes[:-1]) if len(partes) < 3
                              else "/".join(partes[:-2]), []).append(i["id"])
        for r, ids in sorted(raizes.items(), key=lambda kv: -len(kv[1]))[:8]:
            print(f"    {len(ids):4d}  {r}")
        print("\n  conserte com: --assets-de <raiz antiga> --assets-para <raiz nova>")
    else:
        print("  todos os caminhos de asset existem")
    return 0 if (cfg and os.path.isdir(cfg) and not quebrados) else 1


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--verificar", action="store_true")
    p.add_argument("--para", help="novo caminho do repositório cannonball")
    p.add_argument("--assets-de", help="raiz antiga do material bruto")
    p.add_argument("--assets-para", help="raiz nova do material bruto")
    p.add_argument("--simular", action="store_true")
    args = p.parse_args()

    raiz = norm(args.para) if args.para else norm(REPO)

    if args.verificar or (not args.para and not args.assets_de):
        sys.exit(verificar(raiz))

    if bool(args.assets_de) != bool(args.assets_para):
        sys.exit("--assets-de e --assets-para andam juntos")

    # 1) config
    if args.para:
        if not os.path.isdir(os.path.join(raiz, "acervo")):
            sys.exit(f"não achei 'acervo/' em {raiz} — o repo está mesmo aí?")
        cfg_path = os.path.join(raiz, "cannonball.config.json")
        with open(cfg_path, encoding="utf-8") as fh:
            cfg = json.load(fh)
        antigo = cfg.get("raiz")
        cfg["raiz"] = raiz
        if not args.simular:
            with open(cfg_path, "w", encoding="utf-8", newline="\n") as fh:
                json.dump(cfg, fh, ensure_ascii=False, indent=2)
        print(f"config: {antigo}\n     -> {raiz}")

    # 2) projeto_origem item a item
    if args.assets_de:
        de, para = norm(args.assets_de), norm(args.assets_para)
        alterados, ainda_quebrados = 0, []
        for fam in os.listdir(os.path.join(raiz, "acervo")):
            fdir = os.path.join(raiz, "acervo", fam)
            if not os.path.isdir(fdir):
                continue
            for item in os.listdir(fdir):
                ip = os.path.join(fdir, item, "item.json")
                if not os.path.exists(ip):
                    continue
                with open(ip, encoding="utf-8") as fh:
                    d = json.load(fh)
                po = d.get("projeto_origem")
                if not po:
                    continue
                novo = norm(po)
                if novo.lower().startswith(de.lower()):
                    novo = para + novo[len(de):]
                if novo != norm(po):
                    d["projeto_origem"] = novo
                    if not args.simular:
                        with open(ip, "w", encoding="utf-8", newline="\n") as fh:
                            json.dump(d, fh, ensure_ascii=False, indent=1)
                    alterados += 1
                if not os.path.isdir(novo):
                    ainda_quebrados.append(d["id"])
        print(f"projeto_origem reescrito em {alterados} itens")
        if ainda_quebrados:
            print(f"  ATENÇÃO: {len(ainda_quebrados)} continuam sem existir — ex: "
                  f"{', '.join(ainda_quebrados[:5])}")

    if args.simular:
        print("\n[simulação] nada foi gravado")
        return

    print("\nagora rode:")
    print("  python scripts/indexar.py")
    if args.para:
        print("\ne reaponte o plugin (a CLI guarda o caminho antigo):")
        print("  claude plugin uninstall cannonball@cannonball")
        print("  claude plugin marketplace remove cannonball")
        print(f'  claude plugin marketplace add "{raiz}"')
        print("  claude plugin install cannonball@cannonball")


if __name__ == "__main__":
    main()
