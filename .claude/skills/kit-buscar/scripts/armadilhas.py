#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Escreve nas fichas as armadilhas descobertas construindo.

`nao_usar_quando` responde "devo escolher esta peça?".
`armadilhas` responde outra coisa: "escolhi — onde vou tropeçar?".
São perguntas diferentes e merecem campos diferentes.

Sem isto, o conhecimento caro (o que só aparece montando de verdade) fica preso
dentro do campo `notas` de uma receita e o próximo projeto tropeça de novo.

    python scripts/armadilhas.py --listar
    python scripts/armadilhas.py --add <id> --texto "..." --origem <receita> --grau alta
    python scripts/armadilhas.py --lote <arquivo>.json
"""

import argparse
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from caminhos import ACERVO, exigir_indice, saida_utf8  # noqa: E402

saida_utf8()


def pasta_do_item(item_id):
    """Acha a pasta do item em qualquer familia.

    Itens da importacao inicial so tem meta.yaml; os posteriores tem item.json.
    Por isso as armadilhas moram num arquivo LATERAL — funciona igual para as
    duas origens, e o indexar.py le sempre do mesmo lugar.
    """
    for fam in sorted(os.listdir(ACERVO)):
        d = os.path.join(ACERVO, fam, item_id)
        if os.path.isdir(d):
            return d
    return None


# Uma armadilha que trava a pagina e outra que desalinha 2px nao pesam igual.
# Sem grau, as duas saem lado a lado na busca e a critica se perde no meio.
# Ideia emprestada das skills oficiais do PixiJS, que graduam CRITICAL/HIGH/MEDIUM.
GRAUS = {
    "critica": "quebra: pagina em branco, build falhando, dado errado gravado",
    "alta": "estraga a entrega: visual quebrado, performance no chao, inacessivel",
    "media": "incomoda: ajuste fino, detalhe que o cliente nota depois",
}
GRAU_PADRAO = "alta"
ORDEM = {"critica": 0, "alta": 1, "media": 2}


def add(item_id, texto, origem, grau=GRAU_PADRAO):
    d = pasta_do_item(item_id)
    if not d:
        return False, "pasta do item não encontrada"
    if grau not in GRAUS:
        return False, f"grau inválido: {grau} (use {', '.join(GRAUS)})"
    p = os.path.join(d, "armadilhas.json")
    lista = []
    if os.path.exists(p):
        with open(p, encoding="utf-8") as fh:
            lista = json.load(fh)
    if any(a.get("texto") == texto for a in lista):
        return False, "já registrada"
    lista.append({"texto": texto, "origem": origem, "grau": grau})
    # as mais graves primeiro: quem le a saida da busca le de cima pra baixo
    lista.sort(key=lambda a: ORDEM.get(a.get("grau", GRAU_PADRAO), 1))
    with open(p, "w", encoding="utf-8", newline="\n") as fh:
        json.dump(lista, fh, ensure_ascii=False, indent=1)
    return True, f"{len(lista)} armadilha(s)"


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--listar", action="store_true")
    p.add_argument("--add")
    p.add_argument("--texto")
    p.add_argument("--origem", default="")
    p.add_argument("--grau", default=GRAU_PADRAO, choices=list(GRAUS))
    p.add_argument("--lote")
    args = p.parse_args()

    if args.listar:
        itens = exigir_indice()
        com = [i for i in itens if i.get("armadilhas")]
        todas = [a for i in com for a in i["armadilhas"]]
        from collections import Counter
        c = Counter(a.get("grau", GRAU_PADRAO) for a in todas)
        print(f"peças com armadilha registrada: {len(com)}   "
              f"total: {len(todas)}  ("
              + "  ".join(f"{g}: {c.get(g, 0)}" for g in GRAUS) + ")")
        for i in sorted(com, key=lambda x: -len(x["armadilhas"])):
            print(f"\n{i['id']}  ({len(i['armadilhas'])})")
            for a in sorted(i["armadilhas"],
                            key=lambda x: ORDEM.get(x.get("grau", GRAU_PADRAO), 1)):
                print(f"   [{a.get('grau', GRAU_PADRAO):7s}] {a['texto'][:150]}")
                if a.get("origem"):
                    print(f"     ← {a['origem']}")
        return

    if args.lote:
        caminho = args.lote if os.path.isabs(args.lote) else os.path.join(
            os.path.dirname(ACERVO), args.lote)
        with open(caminho, encoding="utf-8") as fh:
            dados = json.load(fh)
        ok = falha = 0
        for e in dados["armadilhas"]:
            sucesso, msg = add(e["id"], e["texto"], e.get("origem", ""),
                               e.get("grau", GRAU_PADRAO))
            if sucesso:
                ok += 1
            else:
                falha += 1
                print(f"  {e['id']}: {msg}")
        print(f"\nregistradas: {ok}   não aplicadas: {falha}")
        print("rode agora: python scripts/indexar.py")
        return

    if args.add and args.texto:
        sucesso, msg = add(args.add, args.texto, args.origem, args.grau)
        print(("ok " if sucesso else "falhou ") + args.add + ": " + msg)
        return

    p.print_help()


if __name__ == "__main__":
    main()
