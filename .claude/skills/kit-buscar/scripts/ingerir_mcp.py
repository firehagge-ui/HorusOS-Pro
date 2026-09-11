#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Indexa um catalogo servido por MCP — o codigo NAO e copiado.

Diferenca em relacao a ingerir_registro.py: la o JSON traz o fonte final e faz
sentido guardar. Aqui o servidor MCP *gera* o componente sob medida no momento
do pedido (stack nextjs/react/vite/framer, styling tailwind/css/cssmodules,
typescript on/off, presets e tweaks de props). Congelar um snapshot jogaria
fora exatamente o que o MCP tem de melhor, e ficaria desatualizado.

Entao o acervo guarda a FICHA e um ponteiro (`via`), e a busca continua unificada.
Na hora de usar, a skill chama a ferramenta MCP e recebe o codigo fresco.

    python scripts/ingerir_mcp.py --catalogo catalogo.json --fonte originkit \\
        --prefixo ok- --julgamentos julgamentos.json
    python scripts/ingerir_mcp.py --catalogo catalogo.json --fonte originkit --analisar
"""

import argparse
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from caminhos import ACERVO, saida_utf8  # noqa: E402

saida_utf8()

PASTA = "mcp"

# Contraindicacoes DERIVADAS de sinal real do proprio catalogo (tags, deps,
# descricao) — nao sao texto generico: so entram quando o sinal existe.
REGRAS = [
    (lambda t, d, x: any(k in t for k in ("cursor", "hover", "mouse", "hover effect")) or
                     any(k in x for k in ("cursor", "hover", "pointer")),
     "depende de cursor — em mobile o efeito não existe, garanta um estado alternativo"),
    (lambda t, d, x: any(k in d for k in ("three", "ogl")) or
                     any(k in t for k in ("webgl", "shader")),
     "é WebGL: custa GPU e não degrada sozinho, teste em máquina fraca e mobile"),
    (lambda t, d, x: "canvas" in t and not any(k in d for k in ("three", "ogl")),
     "roda em canvas com loop contínuo: consome CPU e bateria, pause fora da viewport"),
    (lambda t, d, x: any(k in t for k in ("physics", "simulation", "gravity")) or
                     "matter-js" in d,
     "simulação física roda todo frame — meça antes de usar em página com mais conteúdo pesado"),
    (lambda t, d, x: any(k in t for k in ("drag", "draggable", "swipe")),
     "interação por arrasto compete com o scroll em mobile — teste o gesto antes"),
    (lambda t, d, x: any(k in t for k in ("scroll animation", "scroll trigger", "scroll reveal",
                                          "scroll-reveal", "scrolltrigger")),
     "dirigido por scroll: em página curta não há rolagem suficiente para completar"),
    (lambda t, d, x: "gsap" in d,
     "traz GSAP como dependência — evite se o projeto já padronizou outra engine de animação"),
    (lambda t, d, x: "framer-motion" in d,
     "importa de framer-motion; o resto do acervo novo usa `motion` — padronize para não duplicar a lib"),
]

NAO_TEXTO = ("animar texto atrasa a leitura: reserve para título, nunca para parágrafo, "
             "e respeite prefers-reduced-motion")


def derivar_nao_usar(comp, categoria):
    tags = [t.lower() for t in comp.get("tags", [])]
    deps = [d.lower() for d in comp.get("dependencies", [])]
    desc = (comp.get("description") or "").lower()
    motivos = [msg for teste, msg in REGRAS if teste(tags, deps, desc)]
    if categoria == "text":
        motivos.insert(0, NAO_TEXTO)
    if not motivos:
        return ("Autorado em Framer: a adaptação para Next.js deixa resíduo "
                "(shim de RenderTarget, JSDoc @framer*). Limpe antes de entregar.")
    # o resíduo Framer vale para todos, entra sempre por último
    motivos.append("autorado em Framer — a conversão deixa resíduo, revise o arquivo")
    return "; ".join(motivos[:4]).capitalize() + "."


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--catalogo", required=True, help="JSON do list_components")
    p.add_argument("--fonte", required=True, help="nome do servidor MCP, ex: originkit")
    p.add_argument("--prefixo", default="ok-")
    p.add_argument("--julgamentos", help="JSON {categoria|nome: quando_usar}")
    p.add_argument("--ferramenta", default="get_component")
    p.add_argument("--analisar", action="store_true")
    args = p.parse_args()

    with open(args.catalogo, encoding="utf-8") as fh:
        cat = json.load(fh)
    comps = cat["components"] if isinstance(cat, dict) else cat

    julg = {}
    if args.julgamentos:
        with open(args.julgamentos, encoding="utf-8") as fh:
            julg = json.load(fh)

    if args.analisar:
        from collections import Counter
        print(f"componentes: {len(comps)}")
        print("categorias:", dict(Counter(c["category"] for c in comps)))
        sem = [c["name"] for c in comps if not (c.get("description") or "").strip()
               or "Asset root" in (c.get("description") or "")]
        print(f"descrição inútil ({len(sem)}): {', '.join(sem)}")
        return

    criados, sem_julgamento = 0, []
    for c in comps:
        nome = c["name"]
        cat_nome = c.get("category", "generico")
        quando = julg.get(nome) or julg.get(cat_nome)
        if not quando:
            sem_julgamento.append(nome)
            continue

        item_id = args.prefixo + re.sub(r"[^a-z0-9]+", "-", nome.lower()).strip("-")
        destino = os.path.join(ACERVO, PASTA, item_id)
        os.makedirs(destino, exist_ok=True)

        desc = (c.get("description") or "").strip()
        if not desc or "Asset root" in desc:
            desc = f"{c.get('displayName', nome)} — {cat_nome} ({args.fonte}). " \
                   f"O catálogo não traz descrição útil; consulte o componente pelo MCP."

        tags = sorted({args.fonte, cat_nome, c.get("kind", "component")}
                      | {re.sub(r"\s+", "-", t.strip().lower()) for t in c.get("tags", [])})

        item = {
            "id": item_id,
            "familia": "mcp",
            "titulo": f"{c.get('displayName', nome)} ({args.fonte})",
            "resumo": desc,
            "setor": "generico",
            "estrutura": ("secao-" + cat_nome) if c.get("kind") == "section" else cat_nome,
            "qualidade": "producao",
            "quando_usar": quando,
            "nao_usar_quando": derivar_nao_usar(c, cat_nome),
            "tags": tags,
            "stack": ["framer", "nextjs", "react", "vite"],
            "deps": sorted(c.get("dependencies", [])),
            "fontes": [],
            "marca": None,
            # o codigo NAO esta no acervo: vem do MCP na hora
            "via": f"mcp:{args.fonte}",
            "mcp_ferramenta": args.ferramenta,
            "mcp_nome": nome,
            "autorado_em": "framer",
            "caminho": f"acervo/{PASTA}/{item_id}/item.json",
            "arquivo_origem": f"{args.fonte}:{nome}",
            "linhas": 0,
            "tem_video": "video" in " ".join(c.get("tags", [])).lower(),
            "tem_webgl": any(k in [d.lower() for d in c.get("dependencies", [])] for k in ("three", "ogl"))
                         or any("webgl" in t.lower() or "shader" in t.lower() for t in c.get("tags", [])),
            "tem_scroll": any("scroll" in t.lower() for t in c.get("tags", [])),
            "assets_total": 0,
            "assets_pereciveis": False,
        }
        with open(os.path.join(destino, "item.json"), "w", encoding="utf-8", newline="\n") as fh:
            json.dump(item, fh, ensure_ascii=False, indent=1)
        criados += 1

    print(f"indexados de {args.fonte}: {criados}")
    if sem_julgamento:
        print(f"SEM JULGAMENTO ({len(sem_julgamento)}): {', '.join(sem_julgamento[:20])}")
    print("o código NÃO foi copiado — é buscado pelo MCP na hora de usar")
    print("rode agora: python scripts/indexar.py")


if __name__ == "__main__":
    main()
