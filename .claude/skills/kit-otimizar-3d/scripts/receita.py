#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Registra uma composicao que deu certo (receita) para reaproveitar em projetos futuros.

    python scripts/receita.py criar clinica-estetica \
        --titulo "Landing de clínica de estética" \
        --setor odonto \
        --pecas odonto3,skiper37,glass \
        --quando-usar "clínica de estética ou odontologia, público 30-50, tom sofisticado" \
        --nao-usar-quando "clínica popular ou com foco em convênio" \
        --tags escuro,video-bg,premium \
        --notas "o vídeo do odonto3 expirou, substituído por material do cliente"

Depois rode: python scripts/indexar.py
"""

import argparse
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from caminhos import ACERVO, INDICE, saida_utf8  # noqa: E402

saida_utf8()


def carregar_indice():
    if not os.path.exists(INDICE):
        return {}
    with open(INDICE, encoding="utf-8") as fh:
        return {i["id"]: i for i in json.load(fh)["itens"]}


def main():
    p = argparse.ArgumentParser()
    p.add_argument("acao", choices=["criar"])
    p.add_argument("slug")
    p.add_argument("--titulo", required=True)
    p.add_argument("--setor", default="generico")
    p.add_argument("--pecas", required=True, help="ids separados por virgula, na ordem de uso")
    p.add_argument("--quando-usar", required=True)
    p.add_argument("--nao-usar-quando", default="")
    p.add_argument("--tags", default="")
    p.add_argument("--notas", default="", help="o que deu trabalho e como foi resolvido")
    p.add_argument("--projeto", default="", help="caminho ou nome do projeto onde foi usada")
    args = p.parse_args()

    catalogo = carregar_indice()
    pecas = [x.strip() for x in args.pecas.split(",") if x.strip()]

    desconhecidas = [x for x in pecas if x not in catalogo]
    if desconhecidas:
        sys.exit(f"peças não encontradas no acervo: {', '.join(desconhecidas)}")

    # a receita herda as dependencias reais das pecas que a compoem
    deps, stack, tags = set(), set(), set(t.strip() for t in args.tags.split(",") if t.strip())
    for pid in pecas:
        deps.update(catalogo[pid]["deps"])
        stack.update(catalogo[pid]["stack"])

    destino = os.path.join(ACERVO, "receitas", args.slug)
    os.makedirs(destino, exist_ok=True)

    detalhe = " → ".join(f"{p} ({catalogo[p]['titulo']})" for p in pecas)
    item = {
        "id": args.slug,
        "familia": "receita",
        "titulo": args.titulo,
        "resumo": f"Composição de {len(pecas)} peças: {detalhe}",
        "setor": args.setor,
        "estrutura": "receita",
        "qualidade": "favorito",
        "quando_usar": args.quando_usar,
        "nao_usar_quando": args.nao_usar_quando or "Nenhuma restrição registrada.",
        "tags": sorted(tags),
        "stack": sorted(stack),
        "deps": sorted(deps),
        "fontes": [],
        "marca": None,
        "pecas": pecas,
        "notas": args.notas,
        "projeto": args.projeto,
        "caminho": f"acervo/receitas/{args.slug}/receita.json",
        "linhas": 0,
        "tem_video": any(catalogo[p]["tem_video"] for p in pecas),
        "tem_webgl": any(catalogo[p]["tem_webgl"] for p in pecas),
        "tem_scroll": any(catalogo[p]["tem_scroll"] for p in pecas),
        # a receita herda os assets das pecas: senao o aviso sairia como
        # "[!] 0 assets externos", que se contradiz
        "assets_total": sum(catalogo[p]["assets_total"] for p in pecas),
        "assets_pereciveis": any(catalogo[p]["assets_pereciveis"] for p in pecas),
    }

    with open(os.path.join(destino, "receita.json"), "w", encoding="utf-8", newline="\n") as fh:
        json.dump(item, fh, ensure_ascii=False, indent=1)

    linhas = [
        f"# {args.titulo}", "",
        f"**Setor:** {args.setor}", "",
        "## Peças, na ordem", "",
    ]
    for n, pid in enumerate(pecas, 1):
        c = catalogo[pid]
        linhas.append(f"{n}. **{pid}** — {c['titulo']}  \n   `{c['caminho']}`")
    linhas += [
        "", "## Quando usar", "", args.quando_usar,
        "", "## Quando não usar", "", args.nao_usar_quando or "_não registrado_",
    ]
    if deps:
        linhas += ["", "## Instalar", "", "```bash", f"npm i {' '.join(sorted(deps))}", "```"]
    if args.notas:
        linhas += ["", "## Notas de execução", "", args.notas]
    if args.projeto:
        linhas += ["", f"**Usada em:** {args.projeto}"]

    with open(os.path.join(destino, "README.md"), "w", encoding="utf-8", newline="\n") as fh:
        fh.write("\n".join(linhas) + "\n")

    print(f"receita '{args.slug}' criada com {len(pecas)} peças em acervo/receitas/{args.slug}/")
    if deps:
        print(f"dependências herdadas: {', '.join(sorted(deps))}")
    print("rode agora: python scripts/indexar.py")


if __name__ == "__main__":
    main()
