#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Diz ao cannonball QUAL pasta e o seu acervo.

Sem isto o acervo nasce em ~/.cannonball, que serve para comecar mas raramente
e onde voce quer o material a longo prazo — normalmente ele vai para uma pasta
sua, versionada num repositorio privado ou sincronizada entre maquinas.

O ponteiro e gravado em ~/.cannonball/aonde, FORA do plugin. Isso e de
proposito: o plugin instalado e uma copia em cache que a proxima atualizacao
apaga, entao config gravada dentro dele se perde em silencio.

    python scripts/vincular.py                          # onde esta agora
    python scripts/vincular.py --para ~/meu-acervo      # vincula
    python scripts/vincular.py --para ~/meu-acervo --mover   # leva o que ja existe
    python scripts/vincular.py --soltar                 # volta para o padrao
"""

import argparse
import os
import shutil
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from caminhos import PADRAO, PONTEIRO, RAIZ, carregar_indice, saida_utf8  # noqa: E402

saida_utf8()


def contar(raiz):
    """Quantas pastas de peca existem, sem depender do indice estar gerado."""
    acervo = os.path.join(raiz, "acervo")
    if not os.path.isdir(acervo):
        return None
    n = 0
    for fam in os.listdir(acervo):
        d = os.path.join(acervo, fam)
        if os.path.isdir(d):
            n += sum(1 for x in os.listdir(d) if os.path.isdir(os.path.join(d, x)))
    return n


def situacao():
    env = os.environ.get("CANNONBALL_ACERVO") or os.environ.get("SITEKIT_ACERVO")
    print(f"acervo em uso: {RAIZ}")
    n = contar(RAIZ)
    print(f"  peças no disco: {n if n is not None else '(pasta acervo/ não existe)'}")
    idx = len(carregar_indice())
    print(f"  no índice: {idx}" + ("" if idx or not n else "   (rode scripts/indexar.py)"))
    print()
    if env:
        print(f"  quem manda: variável de ambiente = {env}")
        print("  (a variável vence o ponteiro; apague-a para usar --para)")
    elif os.path.exists(PONTEIRO):
        print(f"  quem manda: ponteiro em {PONTEIRO}")
    else:
        print("  quem manda: o padrão, porque nada foi vinculado")
        print(f"  vincule a sua pasta com:  python scripts/vincular.py --para <pasta>")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--para", help="pasta que passa a ser o acervo")
    ap.add_argument("--mover", action="store_true",
                    help="leva junto as peças que já estão na pasta atual")
    ap.add_argument("--soltar", action="store_true", help="desfaz o vínculo")
    args = ap.parse_args()

    if args.soltar:
        if os.path.exists(PONTEIRO):
            os.remove(PONTEIRO)
            print(f"vínculo desfeito. O acervo volta a ser {PADRAO}")
        else:
            print("não havia vínculo.")
        return

    if not args.para:
        situacao()
        return

    destino = os.path.abspath(os.path.expanduser(args.para))
    dentro = os.path.join(destino, "acervo")

    if args.mover:
        # SO move do padrao. O caso legitimo e um so: "comecei em ~/.cannonball
        # e agora quero a minha pasta". Se o acervo em uso for outra coisa — um
        # repositorio seu, uma pasta que alguem apontou por variavel — mover e
        # arrancar dados de dentro de um projeto que nao e nosso. Recusa.
        origem = os.path.join(PADRAO, "acervo")
        atual = os.path.abspath(os.path.join(RAIZ, "acervo"))
        if atual != os.path.abspath(origem):
            sys.exit(
                "--mover só move do padrão, e o acervo em uso não é o padrão.\n"
                f"  em uso : {atual}\n"
                f"  padrão : {os.path.abspath(origem)}\n\n"
                "  Mover dali seria arrancar a pasta de dentro de um projeto seu.\n"
                "  Vincule sem --mover, ou mova a pasta à mão se for mesmo o que quer."
            )
        if os.path.isdir(origem) and atual != os.path.abspath(dentro):
            if os.path.isdir(dentro) and os.listdir(dentro):
                sys.exit(f"{dentro} já tem conteúdo. Mova à mão ou escolha outra pasta.")
            os.makedirs(destino, exist_ok=True)
            shutil.move(origem, dentro)
            print(f"movidas {contar(destino)} peças de {origem} para {dentro}")

    os.makedirs(dentro, exist_ok=True)
    os.makedirs(os.path.dirname(PONTEIRO), exist_ok=True)
    with open(PONTEIRO, "w", encoding="utf-8", newline="\n") as fh:
        fh.write(destino + "\n")

    n = contar(destino)
    print(f"acervo vinculado: {destino}")
    print(f"  {n} peça(s) na pasta")
    if not n:
        print("  ela está vazia — alimente com /kit-ingerir")
    print(f"  ponteiro gravado em {PONTEIRO} (sobrevive a atualização do plugin)")
    print("\nrode agora: python scripts/indexar.py")

    if os.environ.get("CANNONBALL_ACERVO") or os.environ.get("SITEKIT_ACERVO"):
        print("\n  ATENÇÃO: existe uma variável de ambiente definida, e ela VENCE")
        print("  este ponteiro. Apague-a do seu perfil de shell para o vínculo valer.")


if __name__ == "__main__":
    main()
