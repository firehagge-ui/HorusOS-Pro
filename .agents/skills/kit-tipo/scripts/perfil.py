#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Retrato do acervo AGORA. E o que faz as skills se adaptarem.

As skills nao guardam mais numero fixo do acervo. Numero fixo envelhece na
primeira ingestao e vira mentira: uma skill que afirma "846 pecas, 51% de acento
azul" continua afirmando isso depois de voce ingerir mil pecas suas. Em vez
disso, elas rodam este script e leem o acervo que existe de verdade — vazio,
com dez pecas ou com dez mil.

    python scripts/perfil.py            # retrato legivel
    python scripts/perfil.py --json     # o mesmo, estruturado
    python scripts/perfil.py --funcao   # so a cobertura por funcao e as lacunas
"""

import argparse
import json
import os
import sys
from collections import Counter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from caminhos import RAIZ, carregar_indice, saida_utf8  # noqa: E402

saida_utf8()

# Como cada natureza de peca se usa. Conhecimento de oficio, nao censo:
# vale para qualquer acervo, inclusive um recem-criado.
VERBO = {
    "receita": ("composição de peças que já deu certo", "ponto de partida"),
    "template": ("projeto completo e rodável", "você clona"),
    "design-system": ("identidade visual: paleta, tipografia, regras", "você aplica"),
    "animacao": ("demo isolada de uma técnica", "você extrai"),
    "efeito": ("wrapper WebGL ou objeto 3D, código pronto", "você copia"),
    "ui": ("componente React pronto", "você copia"),
    "html": ("página completa sem build", "abre no navegador"),
    "prompt": ("spec em linguagem natural de uma página", "você executa"),
    "mcp": ("ficha aqui, código gerado sob medida pelo servidor", "você pede"),
}
# Prompt por ultimo de proposito: re-gera tudo e o resultado varia.
PREFERENCIA = ["receita", "template", "efeito", "ui", "animacao", "html", "mcp", "prompt"]

# Funcoes que um site de cliente costuma pedir. A lista e fixa porque e a
# demanda que nao muda; o que muda e quanto do SEU acervo cobre cada uma.
FUNCOES = [
    "busca", "formulario", "autenticacao", "pricing", "faq", "catalogo",
    "carrinho", "dashboard", "calendario", "agendamento", "mapa", "blog",
    "depoimento", "galeria", "newsletter",
]


def coletar(itens):
    fam = Counter(i["familia"] for i in itens)
    stacks = Counter(s for i in itens for s in (i.get("stack") or []))
    tags = Counter(t for i in itens for t in (i.get("tags") or []))

    funcao = {}
    for f in FUNCOES:
        roda, spec = tags.get(f, 0), tags.get("spec-" + f, 0)
        if roda or spec:
            funcao[f] = {"roda": roda, "spec": spec}

    ds = [i for i in itens if i["familia"] == "design-system"]
    fontes = Counter(f for i in itens for f in (i.get("fontes") or []) if isinstance(f, str))

    return {
        "raiz": RAIZ,
        "total": len(itens),
        "familia": dict(fam.most_common()),
        "setor": dict(Counter(i.get("setor", "?") for i in itens).most_common()),
        "estrutura": dict(Counter(i.get("estrutura", "?") for i in itens).most_common()),
        "qualidade": dict(Counter(i.get("qualidade", "?") for i in itens).most_common()),
        "stack": dict(stacks.most_common()),
        "tags": dict(tags.most_common()),
        "funcao": funcao,
        "lacunas": [f for f in FUNCOES if f not in funcao],
        "design_systems": len(ds),
        "fontes_distintas": len(fontes),
        "armadilhas": sum(len(i.get("armadilhas") or []) for i in itens),
        "com_armadilha": sum(1 for i in itens if i.get("armadilhas")),
        "assets_mortos": sum(1 for i in itens
                             if (i.get("assets_estado") or {}).get("estado") == "morto"),
        "fontes_a_substituir": sum(1 for i in itens if i.get("fontes_substituir")),
        "sem_contraindicacao": sum(
            1 for i in itens
            if (i.get("nao_usar_quando") or "").strip() in
            ("", "-", "Nenhuma restrição registrada.")
        ),
    }


# So as tres do seed, ou menos: ninguem ingeriu nada ainda.
SEMENTE = {"kit-agendamento", "kit-calendario", "kit-mapa"}


def proximo_passo(p, ids):
    """A ordem de uso, adaptada ao estado do acervo.

    Nao e um tutorial fixo: o que falta fazer depende do que ja existe. Quem
    tem 3 pecas precisa ingerir; quem tem 300 com ficha fraca precisa curar.
    """
    proprias = ids - SEMENTE
    linhas = ["", "-" * 62, "POR ONDE SEGUIR"]

    if not proprias:
        linhas += [
            "",
            "  Você ainda só tem as peças de exemplo. Duas coisas, nesta ordem:",
            "",
            "  1. VINCULE a pasta onde o seu acervo vai morar — antes de ingerir",
            "     qualquer coisa, senão o material fica em ~/.cannonball:",
            "        python scripts/vincular.py --para \"<sua pasta>\"",
            "",
            "  2. ALIMENTE com o que você já tem: /kit-ingerir",
            "     arquivo solto, texto colado, pasta de projeto, registro shadcn.",
            "     Depois de cada leva: python scripts/indexar.py",
            "",
            "  Enquanto isso a /kit-montar já funciona — ela constrói do zero e",
            "  oferece guardar no fim. /kit-cor, /kit-tipo e /kit-otimizar-3d não",
            "  dependem de acervo nenhum.",
        ]
    elif len(proprias) < 20:
        linhas += [
            "",
            f"  {len(proprias)} peça(s) suas. O acervo já responde, mas ainda é raso.",
            "  Continue em /kit-ingerir — e ingira também o que sair BOM de cada",
            "  projeto, não só o que você já tinha guardado. É assim que ele cresce.",
        ]
    else:
        linhas += ["", f"  {len(proprias)} peças suas. O acervo está de pé. Num projeto novo:"]

    if proprias:
        linhas += [
            "",
            "  1. /kit-buscar    o que eu já tenho pra isso? (dispara sozinha)",
            "  2. /kit-cor       decida a cor ANTES de escolher design system",
            "  3. /kit-tipo      confira a licença ANTES de adotar a fonte",
            "  4. /kit-montar    pergunta a stack e o tipo de hero, e monta",
            "  5. /kit-otimizar-3d   se tem WebGL, antes de entregar",
            "  6. /kit-ingerir   guarde o que deu certo + registre a armadilha",
            "",
            "  Fora do fluxo: /kit-prompt (quer texto, não código),",
            "  /kit-adaptar (te mandaram um prompt de fora),",
            "  /kit-curar (a busca não acha o que deveria).",
        ]
    if p["sem_contraindicacao"] > max(3, p["total"] // 10):
        linhas += ["", f"  ANTES DISSO: {p['sem_contraindicacao']} peças sem contraindicação"
                       " escrita. Rode /kit-curar — ficha fraca some da busca."]
    return "\n".join(linhas)


def imprimir(p, ids=frozenset()):
    if not p["total"]:
        from caminhos import VAZIO
        print(VAZIO)
        print("\nAté lá, as skills funcionam sem acervo: cor, tipografia,")
        print("licença de fonte e otimização 3D não dependem de peça guardada.")
        print(proximo_passo(p, ids))
        return

    print(f"acervo em {p['raiz']} — {p['total']} peças\n")

    print("famílias (na ordem de preferência quando mais de uma serve):")
    for f in PREFERENCIA:
        n = p["familia"].get(f)
        if not n:
            continue
        oq, como = VERBO.get(f, ("", ""))
        print(f"  {n:5d}  {f:<14} {oq} — {como}")
    for f, n in p["familia"].items():
        if f not in PREFERENCIA:
            print(f"  {n:5d}  {f}")

    fav = p["qualidade"].get("favorito", 0)
    rasc = p["qualidade"].get("rascunho", 0)
    print(f"\nqualidade: {fav} favoritos, {rasc} rascunhos")

    if p["stack"]:
        top = list(p["stack"].items())[:8]
        print("stacks: " + ", ".join(f"{k} ({v})" for k, v in top))

    setores = [k for k in p["setor"] if k not in ("generico", "?")]
    print(f"setores: {len(setores)} — " + ", ".join(setores[:12])
          + (" …" if len(setores) > 12 else ""))

    if p["funcao"]:
        print("\ncobertura por função (roda / só especifica):")
        for f, v in sorted(p["funcao"].items(), key=lambda x: -x[1]["roda"]):
            print(f"  {f:<14} {v['roda']:3d} / {v['spec']:3d}")
    if p["lacunas"]:
        print("  SEM NENHUMA PEÇA: " + ", ".join(p["lacunas"]))
        print("  (construir do zero aqui é esperado — e vale ingerir depois)")

    print()
    if p["armadilhas"]:
        cob = 100.0 * p["com_armadilha"] / max(p["total"], 1)
        print(f"armadilhas registradas: {p['armadilhas']} em {p['com_armadilha']} peças"
              f" ({cob:.1f}% do acervo)"
              " — é o conhecimento mais caro do acervo, leia antes de prometer a peça")
        # O numero absoluto soa saudavel em qualquer tamanho de acervo; a
        # porcentagem e o que denuncia que o ciclo montar -> tropecar -> registrar
        # parou de girar. Sem ele o acervo e um catalogo como outro qualquer:
        # catalogo diz o que a peca faz, so o seu acervo sabe onde ela te derrubou.
        if cob < 5:
            print(f"[!] {100 - cob:.0f}% das peças nunca registraram armadilha —"
                  " o passo 8 da /kit-montar é o que alimenta isso")
    if p["assets_mortos"]:
        print(f"[!] {p['assets_mortos']} peças com asset externo já morto")
    if p["fontes_a_substituir"]:
        print(f"[!] {p['fontes_a_substituir']} peças nomeiam fonte não entregável")
    if p["sem_contraindicacao"]:
        print(f"[!] {p['sem_contraindicacao']} peças sem contraindicação escrita"
              " — a busca vai oferecê-las em contexto errado (scripts/curar.py)")
    print(proximo_passo(p, ids))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--funcao", action="store_true", help="só a cobertura por função")
    args = ap.parse_args()

    itens = carregar_indice()
    ids = {i["id"] for i in itens}
    p = coletar(itens)

    if args.json:
        print(json.dumps(p, ensure_ascii=False, indent=1))
    elif args.funcao:
        for f, v in sorted(p["funcao"].items(), key=lambda x: -x[1]["roda"]):
            print(f"{f:<14} roda={v['roda']:3d}  spec={v['spec']:3d}")
        if p["lacunas"]:
            print("lacunas: " + ", ".join(p["lacunas"]))
    else:
        imprimir(p, ids)


if __name__ == "__main__":
    main()
