#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Busca no acervo. Sem dependencias externas.

    python scripts/buscar.py "hero de clinica odontologica"
    python scripts/buscar.py "carrossel" --familia ui
    python scripts/buscar.py --setor joias --estrutura scroll-cinematica
    python scripts/buscar.py "vidro" --qualidade favorito --n 5
    python scripts/buscar.py --listar setor

Acentos sao ignorados: "odontologica" acha "odontológica".
"""

import argparse
import json
import os
import re
import sys
import unicodedata

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from caminhos import INDICE, RAIZ, exigir_indice, saida_utf8  # noqa: E402

saida_utf8()

PESOS = {"titulo": 5, "tags": 4, "setor": 4, "estrutura": 3,
         "quando_usar": 3, "armadilha": 3, "resumo": 2, "tecnico": 2}

STOPWORDS = {
    "de", "da", "do", "das", "dos", "para", "por", "com", "sem", "em", "no", "na",
    "um", "uma", "uns", "umas", "o", "a", "os", "as", "e", "ou", "que", "quero",
    "preciso", "site", "pagina", "página", "the", "of", "for", "with", "and", "a",
}


# Sinonimos PT<->EN: as fichas do acervo sao escritas em portugues, mas titulo e
# descricao vindos dos registries shadcn sao em ingles. Sem isso, "tabela" nao
# acha o que "table" acha. Um termo expande para a UNIAO dos grupos em que
# aparece, o que mantem a assimetria certa: "carrossel" -> {carousel, slider},
# mas "deslizante" nao puxa carrossel.
def _carregar_sinonimos():
    caminho = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sinonimos.json")
    try:
        with open(caminho, encoding="utf-8") as fh:
            grupos = json.load(fh)["grupos"]
    except Exception:
        return {}                      # sem o arquivo a busca segue, so sem sinonimo
    mapa = {}
    for grupo in grupos:
        for termo in grupo:
            mapa.setdefault(termo, set()).update(grupo)
    return mapa


SINONIMOS = _carregar_sinonimos()


def variantes(termo):
    """O termo mais seus sinonimos. Sempre inclui o proprio termo."""
    return SINONIMOS.get(termo, {termo}) | {termo}


def normalizar(texto):
    texto = unicodedata.normalize("NFKD", str(texto).lower())
    texto = "".join(c for c in texto if not unicodedata.combining(c))
    return texto


def tokenizar(texto):
    return [t for t in re.split(r"[^a-z0-9]+", normalizar(texto)) if len(t) > 2 and t not in STOPWORDS]


def carregar():
    return exigir_indice()


def pontuar(item, termos):
    if not termos:
        return 1.0
    campos = {
        "titulo": item["titulo"],
        "resumo": item["resumo"],
        "quando_usar": item["quando_usar"],
        "tags": " ".join(item["tags"]),
        "setor": item["setor"],
        "estrutura": item["estrutura"],
        # o que foi descoberto montando: quem procura "contraste" precisa achar
        # as pecas que ja reprovaram, nao so as que falam de contraste na descricao
        "armadilha": " ".join(a["texto"] for a in item.get("armadilhas", [])),
        # design systems trazem fontes e marcas de referencia: buscar "Aesop" ou
        # "Inter" precisa achar o sistema que cita essas coisas
        "tecnico": " ".join(
            item["stack"] + item["deps"] + item.get("fontes", [])
            + item.get("marcas_similares", []) + item.get("paleta", [])
            + [item["id"], item["marca"] or "", item.get("tema", "")]
        ),
    }
    campos = {k: normalizar(v) for k, v in campos.items()}
    contra = normalizar(item["nao_usar_quando"])

    total, casados = 0.0, 0
    for termo in termos:
        achou = False
        vars_ = variantes(termo)
        for campo, peso in PESOS.items():
            if any(v in campos[campo] for v in vars_):
                total += peso
                achou = True
        if achou:
            casados += 1
        elif any(v in contra for v in vars_):
            # o termo so aparece na contraindicacao: sinal contra, nao a favor
            total -= 2

    if not casados:
        return 0.0
    # cobertura importa mais que repeticao: casar 3 de 3 termos vence casar 1 tres vezes
    total *= (casados / len(termos)) ** 2
    if item["qualidade"] == "favorito":
        total *= 1.25
    elif item["qualidade"] in ("rascunho", "descartar"):
        total *= 0.4
    return total


def main():
    p = argparse.ArgumentParser(add_help=True)
    p.add_argument("consulta", nargs="*", help="texto livre")
    p.add_argument("--familia", help="prompt | efeito | html | ui")
    p.add_argument("--setor")
    p.add_argument("--estrutura")
    p.add_argument("--tag")
    p.add_argument("--qualidade", help="favorito | producao | rascunho")
    p.add_argument("--stack", help="filtra por stack de origem, ex: nextjs")
    p.add_argument("--sem-video", action="store_true", help="exclui itens que dependem de video")
    p.add_argument("--n", type=int, default=8)
    p.add_argument("--listar", help="setor | estrutura | tag | familia — mostra os valores existentes")
    p.add_argument("--json", action="store_true")
    args = p.parse_args()

    itens = carregar()

    if args.listar:
        from collections import Counter
        c = Counter()
        for i in itens:
            if args.listar == "tag":
                c.update(i["tags"])
            else:
                c[i.get(args.listar, "?")] += 1
        for k, v in c.most_common():
            print(f"{v:4d}  {k}")
        return

    filtros = [
        (args.familia, lambda i: i["familia"] == args.familia),
        (args.setor, lambda i: i["setor"] == args.setor),
        (args.estrutura, lambda i: i["estrutura"] == args.estrutura),
        (args.tag, lambda i: args.tag in i["tags"]),
        (args.qualidade, lambda i: i["qualidade"] == args.qualidade),
        (args.stack, lambda i: args.stack in i["stack"]),
        (args.sem_video, lambda i: not i["tem_video"]),
    ]
    for ativo, teste in filtros:
        if ativo:
            itens = [i for i in itens if teste(i)]

    # o descartado so aparece se pedido explicitamente
    if args.qualidade != "descartar":
        itens = [i for i in itens if i["qualidade"] != "descartar"]

    termos = tokenizar(" ".join(args.consulta))
    marcados = [(pontuar(i, termos), i) for i in itens]
    marcados = sorted([m for m in marcados if m[0] > 0], key=lambda m: -m[0])[: args.n]

    if args.json:
        print(json.dumps([i for _, i in marcados], ensure_ascii=False, indent=1))
        return

    if not marcados:
        print("nada encontrado. Tente termos mais amplos ou veja: --listar setor")
        return

    for nota, i in marcados:
        selo = {"favorito": "*", "rascunho": "~", "descartar": "x"}.get(i["qualidade"], " ")
        print(f"\n{selo} {i['id']}  [{i['familia']}/{i['setor']}/{i['estrutura']}]  ({nota:.0f})")
        print(f"  {i['titulo']}")
        print(f"  {i['resumo']}")
        print(f"  USAR: {i['quando_usar']}")
        print(f"  EVITAR: {i['nao_usar_quando']}")
        # Descobertas construindo de verdade — valem mais que o resto da ficha.
        # O grau entra no rotulo: uma que trava a pagina e outra que desalinha
        # 2px nao podem sair com o mesmo peso na leitura.
        ordem_grau = {"critica": 0, "alta": 1, "media": 2}
        for a in sorted(i.get("armadilhas", []),
                        key=lambda x: ordem_grau.get(x.get("grau", "alta"), 1)):
            origem = f" (de {a['origem']})" if a.get("origem") else ""
            rotulo = {"critica": "ARMADILHA CRÍTICA",
                      "media": "ARMADILHA (menor)"}.get(a.get("grau", "alta"),
                                                        "ARMADILHA")
            print(f"  {rotulo}{origem}: {a['texto']}")
        # asset morto: 47% dos buckets testados ja respondem 403/404. Se a peça
        # e favorita, a chance de ser escolhida e alta — o aviso tem que vir aqui
        ae = i.get("assets_estado") or {}
        if ae.get("estado") == "morto":
            print(f"  ASSET MORTO (HTTP {ae.get('http', '?')}, visto em "
                  f"{ae.get('verificado_em', '?')}): as {ae.get('total', '?')} mídias "
                  f"externas não respondem — troque antes de usar")
        # licença de fonte: precisa aparecer AQUI, na escolha da peça — depois
        # de construir em cima dela, trocar a fonte é refazer a hierarquia toda
        fs = i.get("fontes_substituir") or []
        if fs:
            nomes = ", ".join(f["original"] for f in fs[:3])
            mais = f" (+{len(fs) - 3})" if len(fs) > 3 else ""
            usar = ", ".join(fs[0]["usar"][:2])
            print(f"  FONTE NÃO ENTREGÁVEL: {nomes}{mais} — troque por {usar}")
        tec = f"  stack={','.join(i['stack'])}"
        if i["deps"]:
            tec += f"  deps={','.join(i['deps'])}"
        if i["assets_pereciveis"]:
            tec += f"  [!] {i['assets_total']} assets externos que podem cair"
        print(tec)
        # sem isso voce cola o componente e ele quebra por falta do que ele importa
        if i.get("precisa_componentes"):
            print(f"  PRECISA JUNTO: {', '.join(i['precisa_componentes'])}")
        if i.get("comando"):
            print(f"  $ {i['comando']}")
        if i.get("via", "").startswith("mcp:"):
            fonte = i["via"].split(":", 1)[1]
            print(f"  CÓDIGO VIA MCP ({fonte}) — não está no acervo. Busque com:")
            print(f"    {i.get('mcp_ferramenta', 'get_component')}"
                  f"(name=\"{i.get('mcp_nome', i['id'])}\", stack=\"nextjs\","
                  f" styling=\"tailwind\", typescript=true)")
        else:
            print(f"  -> {i['caminho']}")


if __name__ == "__main__":
    main()
