#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Funde os sinais extraidos (_extract.jsonl) com o enriquecimento escrito a mao
(_enriquecimento_*.json) e gera:
  - acervo/<familia>/<id>/meta.yaml   -> ficha legivel e editavel de cada item
  - acervo/index.json                 -> indice unico que a busca consome

Reporta itens sem enriquecimento em vez de inventar metadado.
"""

import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from caminhos import RAIZ, ACERVO, saida_utf8  # noqa: E402

saida_utf8()

PASTA_DE = {"prompt": "prompts", "efeito": "efeitos", "html": "html", "ui": "ui"}
# So o que descreve o item POSITIVAMENTE entra no texto de busca.
# 'nao_usar_quando' fica de fora de proposito: se entrasse, buscar "mobile"
# ranquearia no topo justamente os itens que dizem "nao use em mobile".
CAMPOS_TEXTO = ("titulo", "resumo", "quando_usar")


def yaml_escapar(valor):
    texto = str(valor).replace('"', "'")
    return f'"{texto}"'


def escrever_meta(caminho, item):
    linhas = [
        f"id: {item['id']}",
        f"familia: {item['familia']}",
        f"titulo: {yaml_escapar(item['titulo'])}",
        f"resumo: {yaml_escapar(item['resumo'])}",
        f"setor: {item['setor']}",
        f"estrutura: {item['estrutura']}",
        f"qualidade: {item['qualidade']}",
        "",
        "# Os dois campos abaixo sao o que faz a busca decidir sozinha.",
        "# Se um item nunca e escolhido quando deveria, corrija aqui primeiro.",
        f"quando_usar: {yaml_escapar(item['quando_usar'])}",
        f"nao_usar_quando: {yaml_escapar(item['nao_usar_quando'])}",
        "",
        f"tags: [{', '.join(item['tags'])}]",
        f"stack_origem: [{', '.join(item['stack'])}]",
        f"deps: [{', '.join(item['deps']) if item['deps'] else ''}]",
        f"fontes: [{', '.join(item['fontes']) if item['fontes'] else ''}]",
        "",
        f"arquivo: {item['caminho']}",
        f"origem: {item['arquivo_origem']}",
        f"linhas: {item['linhas']}",
        f"tem_video: {str(item['tem_video']).lower()}",
        f"tem_webgl: {str(item['tem_webgl']).lower()}",
        f"tem_scroll: {str(item['tem_scroll']).lower()}",
        f"assets_externos: {item['assets_total']}",
        f"assets_pereciveis: {str(item['assets_pereciveis']).lower()}",
    ]
    with open(caminho, "w", encoding="utf-8", newline="\n") as fh:
        fh.write("\n".join(linhas) + "\n")


def main():
    # Artefatos da importacao inicial. So existem em quem importou uma pasta
    # grande de uma vez; num acervo que nasceu vazio e cresceu por ingestao,
    # nao ha nenhum — e isso e normal, nao erro.
    caminho_extract = os.path.join(RAIZ, "_extract.jsonl")
    extraidos = []
    if os.path.exists(caminho_extract):
        with open(caminho_extract, encoding="utf-8") as fh:
            extraidos = [json.loads(linha) for linha in fh if linha.strip()]

    enriquecimento = {}
    for nome in ("_enriquecimento_a.json", "_enriquecimento_b.json"):
        caminho = os.path.join(RAIZ, nome)
        if os.path.exists(caminho):
            with open(caminho, encoding="utf-8") as fh:
                enriquecimento.update(json.load(fh))

    os.makedirs(ACERVO, exist_ok=True)
    indice, faltando, descartar = [], [], []

    for reg in extraidos:
        extra = enriquecimento.get(reg["id"])
        if not extra:
            faltando.append(reg["id"])
            continue

        item = {
            "id": reg["id"],
            "familia": reg["familia"],
            "titulo": extra["titulo"],
            "resumo": extra["resumo"],
            "setor": extra.get("setor", "generico"),
            "estrutura": extra["estrutura"],
            "qualidade": extra["qualidade"],
            "quando_usar": extra["quando_usar"],
            "nao_usar_quando": extra["nao_usar_quando"],
            "tags": extra["tags"],
            "stack": reg["stack"],
            "deps": reg["deps"],
            "fontes": reg["fontes"],
            "marca": reg["marca"],
            "caminho": reg["caminho"],
            "arquivo_origem": reg["arquivo_origem"],
            "linhas": reg["linhas"],
            "tem_video": reg["tem_video"],
            "tem_webgl": reg["tem_canvas_webgl"],
            "tem_scroll": reg["tem_scroll"],
            "assets_total": reg["assets"]["total"],
            "assets_pereciveis": reg["assets"]["perecivel"],
        }

        if item["qualidade"] == "descartar":
            descartar.append(item["id"])

        destino = os.path.join(ACERVO, PASTA_DE[reg["familia"]], reg["id"], "meta.yaml")
        escrever_meta(destino, item)

        # o texto que a busca varre: junta tudo que descreve o item
        item["_busca"] = " ".join(
            [item[c] for c in CAMPOS_TEXTO]
            + item["tags"] + item["stack"] + item["deps"]
            + [item["setor"], item["estrutura"], item["id"], item["marca"] or ""]
        ).lower()

        indice.append(item)

    # Itens acrescentados depois da importacao inicial (kit-ingerir grava item.json)
    # e receitas (composicoes que deram certo). Ambos entram no mesmo indice.
    import glob
    ja_tem = {i["id"] for i in indice}
    extras_novos = []
    extras = glob.glob(os.path.join(ACERVO, "*", "*", "item.json"))
    extras += glob.glob(os.path.join(ACERVO, "receitas", "*", "receita.json"))
    for caminho in sorted(extras):
        with open(caminho, encoding="utf-8") as fh:
            item = json.load(fh)
        if item["id"] in ja_tem:
            continue
        item.setdefault("marca", None)
        for campo, padrao in (("stack", []), ("deps", []), ("fontes", []), ("tags", []),
                              ("linhas", 0), ("tem_video", False), ("tem_webgl", False),
                              ("tem_scroll", False), ("assets_total", 0),
                              ("assets_pereciveis", False), ("arquivo_origem", "")):
            item.setdefault(campo, padrao)
        item["_busca"] = " ".join(
            [item[c] for c in CAMPOS_TEXTO]
            + item["tags"] + item["stack"] + item["deps"]
            + [item["setor"], item["estrutura"], item["id"], item["marca"] or ""]
        ).lower()
        indice.append(item)
        extras_novos.append(item["id"])
        ja_tem.add(item["id"])

    # armadilhas: descobertas construindo, gravadas num arquivo lateral para
    # funcionar igual em item da importação inicial (meta.yaml) e posterior (item.json)
    import glob as _glob
    por_id = {i["id"]: i for i in indice}
    n_arm = 0
    for caminho in _glob.glob(os.path.join(ACERVO, "*", "*", "armadilhas.json")):
        item_id = os.path.basename(os.path.dirname(caminho))
        if item_id not in por_id:
            continue
        with open(caminho, encoding="utf-8") as fh:
            lista = json.load(fh)
        por_id[item_id]["armadilhas"] = lista
        # entram na busca: quem procura "contraste" tem que achar quem já reprovou
        por_id[item_id]["_busca"] += " " + " ".join(a["texto"] for a in lista).lower()
        n_arm += len(lista)

    # assets externos: o bucket ainda responde? 41 de 86 testados retornaram
    # 403/404 — e 10 deles sao pecas FAVORITAS. Sem este aviso voce escolhe,
    # monta, e so descobre na entrega que a midia sumiu.
    n_am = 0
    for caminho in _glob.glob(os.path.join(ACERVO, "*", "*", "assets_estado.json")):
        item_id = os.path.basename(os.path.dirname(caminho))
        if item_id not in por_id:
            continue
        with open(caminho, encoding="utf-8") as fh:
            por_id[item_id]["assets_estado"] = json.load(fh)
        n_am += 1

    # licença de fonte: a peça nomeia tipo que não se pode servir?
    # Sem isto, o problema só aparece na entrega — depois de o site já ter
    # sido construído em cima da fonte errada.
    n_fs = 0
    for caminho in _glob.glob(os.path.join(ACERVO, "*", "*", "fontes_substituir.json")):
        item_id = os.path.basename(os.path.dirname(caminho))
        if item_id not in por_id:
            continue
        with open(caminho, encoding="utf-8") as fh:
            plano = json.load(fh)
        por_id[item_id]["fontes_substituir"] = plano
        n_fs += len(plano)

    # tags de função: o que a peça FAZ. O acervo nasceu indexado por caráter
    # visual e por técnica; sem este eixo, um template com carrinho e catálogo
    # some de uma busca por "grade de produtos".
    n_tf = 0
    for caminho in _glob.glob(os.path.join(ACERVO, "*", "*", "tags_funcao.json")):
        item_id = os.path.basename(os.path.dirname(caminho))
        if item_id not in por_id:
            continue
        with open(caminho, encoding="utf-8") as fh:
            extras = json.load(fh)
        alvo = por_id[item_id]
        alvo["tags"] = sorted(set(alvo["tags"]) | set(extras))
        alvo["_busca"] += " " + " ".join(extras).lower()
        n_tf += len(extras)

    # preview: a lacuna estrutural do acervo era guardar texto e nunca imagem.
    # Sidecar como os outros — quem tem preview.png ao lado da ficha ganha o campo,
    # quem nao tem segue sem, e nada quebra. Gerado por scripts/capturar.py.
    n_pv = 0
    for caminho in _glob.glob(os.path.join(ACERVO, "*", "*", "preview.png")):
        item_id = os.path.basename(os.path.dirname(caminho))
        if item_id not in por_id:
            continue
        por_id[item_id]["preview"] = os.path.relpath(caminho, RAIZ).replace(os.sep, "/")
        n_pv += 1

    with open(os.path.join(ACERVO, "index.json"), "w", encoding="utf-8", newline="\n") as fh:
        json.dump({"versao": 1, "itens": indice}, fh, ensure_ascii=False, indent=1)

    importados = len(indice) - len(extras_novos)
    if n_am:
        print(f"assets mortos: {n_am} peças")
    if n_fs:
        n_pecas = sum(1 for i in indice if i.get("fontes_substituir"))
        print(f"fontes a substituir: {n_fs} em {n_pecas} peças")
    if n_tf:
        print(f"tags de função aplicadas: {n_tf}")
    if n_arm:
        print(f"armadilhas registradas: {n_arm}")
    print(f"indexados: {len(indice)} itens "
          f"({importados} da importação inicial + {len(extras_novos)} acrescentados depois)")
    if faltando:
        print(f"SEM ENRIQUECIMENTO ({len(faltando)}): {', '.join(faltando)}")
    if descartar:
        print(f"marcados para descarte: {', '.join(descartar)}")

    if not indice:
        from caminhos import VAZIO
        print(VAZIO)
        return

    from collections import Counter
    for campo in ("familia", "setor", "estrutura", "qualidade"):
        c = Counter(i[campo] for i in indice)
        print(f"\n{campo}:")
        for k, v in c.most_common():
            print(f"  {v:3d}  {k}")


if __name__ == "__main__":
    main()
