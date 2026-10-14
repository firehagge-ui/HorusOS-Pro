#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Saude do acervo: duplicatas, arquivos vazios, fichas fracas, assets que ja caíram.

    python scripts/curar.py                # relatorio completo
    python scripts/curar.py --assets       # testa as URLs externas (rede, demora)
    python scripts/curar.py --assets --n 20
    python scripts/curar.py --autoteste   # checa o detector de import quebrado
"""

import argparse
import hashlib
import json
import os
import re
import sys
from collections import Counter, defaultdict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from caminhos import ACERVO, RAIZ, exigir_indice, saida_utf8  # noqa: E402

saida_utf8()

GENERICO = (
    "Nenhuma restrição registrada.",
    "", "-", "n/a", "nao registrado", "não registrado",
)



# --- Contrato de cópia -------------------------------------------------------
# A peça sai do acervo por cópia. Import relativo que não resolve DENTRO da pasta
# dela vira "Module not found" no projeto de destino — e o erro fala em módulo
# faltando, não em peça faltando, que é o que custa a tarde.
# (armadilha kit-agendamento/exemplo-clinica-vertice)

IMPORT_REL = re.compile(
    r"""(?:\bfrom|\bimport|\brequire\(|@import)\s*\(?\s*['"](\.{1,2}/[^'"]*)['"]"""
)
EXT_CODIGO = (".tsx", ".ts", ".jsx", ".js", ".mjs", ".css")
EXT_MODULO = ("", ".tsx", ".ts", ".jsx", ".js", ".mjs", ".css",
              "/index.tsx", "/index.ts", "/index.js")
EXT_MIDIA = (".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg", ".gif",
             ".mp4", ".webm", ".glb", ".gltf", ".hdr", ".woff", ".woff2",
             ".ttf", ".mp3")


def imports_quebrados(caminho, declarados):
    """Imports relativos que não resolvem na pasta da peça nem estão declarados.

    `declarados` é o precisa_componentes: a busca imprime esses como PRECISA JUNTO,
    então eles não são o problema — o problema é o que ninguém declarou.
    Mídia fica de fora de propósito: ela mora no projeto de origem (seção 5).
    """
    if not os.path.exists(caminho):
        return []
    raiz = caminho if os.path.isdir(caminho) else os.path.dirname(caminho)
    arquivos = []
    if os.path.isdir(caminho):
        for r, _, files in os.walk(caminho):
            arquivos += [os.path.join(r, f) for f in files if f.endswith(EXT_CODIGO)]
    elif caminho.endswith(EXT_CODIGO):
        arquivos = [caminho]
    achados = []
    for arq in arquivos:
        try:
            with open(arq, encoding="utf-8", errors="replace") as fh:
                texto = fh.read()
        except OSError:
            continue
        for ref in IMPORT_REL.findall(texto):
            if ref.lower().endswith(EXT_MIDIA):
                continue
            alvo = os.path.normpath(os.path.join(os.path.dirname(arq), ref))
            if any(seg in declarados for seg in alvo.split(os.sep)):
                continue
            if any(os.path.exists(alvo + e) for e in EXT_MODULO):
                continue
            achados.append((os.path.relpath(arq, raiz), ref))
    return achados


def autoteste():
    import shutil
    import tempfile
    tmp = tempfile.mkdtemp()
    try:
        peca = os.path.join(tmp, "peca")
        os.makedirs(peca)
        with open(os.path.join(peca, "vizinho.tsx"), "w") as fh:
            fh.write("export const x = 1\n")
        with open(os.path.join(peca, "Comp.tsx"), "w") as fh:
            fh.write(
                "import { x } from './vizinho'\n"          # resolve: ok
                "import { y } from './sumiu'\n"            # não resolve: acusa
                "import { z } from '../kit-calendario/useCalendario'\n"  # declarado: ok
                "import capa from './capa.png'\n"          # mídia: ignora
                "import React from 'react'\n"              # npm: ignora
            )
        achados = imports_quebrados(peca, {"kit-calendario"})
        assert [r for _, r in achados] == ["./sumiu"], achados
        # arquivo único: a pasta dele é o escopo, o mesmo veredito vale
        achados = imports_quebrados(os.path.join(peca, "Comp.tsx"), {"kit-calendario"})
        assert [r for _, r in achados] == ["./sumiu"], achados
        # sem declaração, o import que fugia passa a acusar
        achados = imports_quebrados(peca, set())
        assert len(achados) == 2, achados
        # peça que não é código (prompt.md) não é analisada
        assert imports_quebrados(os.path.join(peca, "vizinho.tsx"), set()) == []
        print("autoteste: ok")
    finally:
        shutil.rmtree(tmp)


def carregar():
    return exigir_indice()


def secao(titulo):
    print(f"\n{'=' * 62}\n{titulo}\n{'=' * 62}")


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--assets", action="store_true", help="testa URLs externas (usa rede)")
    p.add_argument("--n", type=int, default=10, help="quantos itens testar com --assets")
    p.add_argument("--autoteste", action="store_true", help="checa o detector de import quebrado")
    args = p.parse_args()

    if args.autoteste:
        autoteste()
        return

    itens = carregar()
    print(f"acervo: {len(itens)} itens")

    secao("1. Conteúdo duplicado ou vazio")
    hashes, vazios = defaultdict(list), []
    for i in itens:
        caminho = os.path.join(RAIZ, i["caminho"].replace("/", os.sep))
        if not os.path.exists(caminho):
            continue
        if os.path.isdir(caminho):
            # templates e animacoes apontam para uma PASTA de codigo, nao um arquivo:
            # o hash sai do conteudo concatenado dos arquivos, em ordem estavel
            h = hashlib.md5()
            algum = False
            for r, dirs, files in sorted(os.walk(caminho)):
                for f in sorted(files):
                    try:
                        with open(os.path.join(r, f), "rb") as fh:
                            h.update(fh.read())
                        algum = True
                    except OSError:
                        pass
            if not algum:
                vazios.append(i["id"])
                continue
            hashes[h.hexdigest()].append(i["id"])
            continue
        with open(caminho, "rb") as fh:
            dados = fh.read()
        if len(dados.strip()) == 0:
            vazios.append(i["id"])
        hashes[hashlib.md5(dados).hexdigest()].append(i["id"])
    dups = [v for v in hashes.values() if len(v) > 1]
    if dups:
        for grupo in dups:
            print(f"  duplicados: {' == '.join(grupo)}")
    else:
        print("  nenhuma duplicata exata")
    if vazios:
        print(f"  VAZIOS (candidatos a remoção): {', '.join(vazios)}")

    secao("2. Fichas fracas — a busca não vai achar estes")
    fracos = []
    for i in itens:
        problemas = []
        if len(i["quando_usar"]) < 40:
            problemas.append("quando_usar curto")
        if i["nao_usar_quando"].strip().lower() in [g.lower() for g in GENERICO]:
            problemas.append("sem contraindicação")
        if len(i["tags"]) < 3:
            problemas.append("poucas tags")
        if problemas:
            fracos.append((i["id"], problemas))
    if fracos:
        for pid, probs in fracos[:20]:
            print(f"  {pid}: {', '.join(probs)}")
        if len(fracos) > 20:
            print(f"  ... e mais {len(fracos) - 20}")
    else:
        print("  todas as fichas estão completas")

    secao("3. Marcados como rascunho ou descarte")
    for i in itens:
        if i["qualidade"] in ("rascunho", "descartar"):
            print(f"  [{i['qualidade']}] {i['id']} — {i['titulo']}")

    secao("4. Dependências que o projeto precisa ter")
    deps = Counter()
    for i in itens:
        deps.update(i["deps"])
    for dep, n in deps.most_common(12):
        alerta = "  <- exige arquivo no projeto, não é pacote npm" if dep.startswith("@/") else ""
        print(f"  {n:3d}  {dep}{alerta}")

    secao("4b. Dependências entre componentes do acervo")
    por_origem = {}
    for i in itens:
        if i.get("arquivo_origem", "").startswith("@"):
            por_origem[i["arquivo_origem"].split("/")[-1]] = i["id"]
    faltantes = {}
    for i in itens:
        for p in i.get("precisa_componentes", []):
            if p not in por_origem:
                faltantes.setdefault(p, []).append(i["id"])
    if faltantes:
        print("  puxados por itens do acervo mas AUSENTES dele:")
        for p, quem in sorted(faltantes.items(), key=lambda kv: -len(kv[1])):
            amostra = ", ".join(quem[:3]) + ("…" if len(quem) > 3 else "")
            print(f"    {p:26s} ({len(quem)}x) — ex: {amostra}")
        print("  (primitivos do shadcn base costumam ser esperados aqui)")
    else:
        print("  todas as dependências internas estão no acervo")

    secao("5. Projetos referenciados — onde moram os assets")
    referenciados = [i for i in itens if i.get("projeto_origem")]
    if referenciados:
        quebrados = [i for i in referenciados if not os.path.isdir(i["projeto_origem"])]
        peso = sum(i.get("peso_assets_mb", 0) for i in referenciados)
        print(f"  {len(referenciados)} itens referenciam projeto externo ({peso:.0f} MB de assets)")
        if quebrados:
            print("  CAMINHO QUEBRADO — o código está no acervo mas a mídia sumiu:")
            for i in quebrados:
                print(f"    {i['id']}: {i['projeto_origem']}")
        else:
            print("  todos os caminhos ainda existem")
    else:
        print("  nenhum item referencia projeto externo")

    secao("6. Assets externos perecíveis")
    com_assets = [i for i in itens if i["assets_pereciveis"]]
    print(f"  {len(com_assets)} de {len(itens)} itens dependem de assets externos")
    print("  (figma.site / cloudfront / higgs.ai — buckets temporários)")

    if args.assets:
        import urllib.error
        import urllib.request
        print(f"\n  testando os {args.n} primeiros...")
        for i in com_assets[: args.n]:
            caminho = os.path.join(RAIZ, i["caminho"].replace("/", os.sep))
            with open(caminho, encoding="utf-8", errors="replace") as fh:
                texto = fh.read()
            urls = re.findall(r'https?://[^\s"\'`)\]<>]+', texto)
            urls = [u for u in urls if "fonts.g" not in u][:1]
            for u in urls:
                try:
                    req = urllib.request.Request(u, method="HEAD")
                    with urllib.request.urlopen(req, timeout=8) as r:
                        estado = f"ok {r.status}"
                except urllib.error.HTTPError as e:
                    estado = f"MORTO {e.code}"
                except Exception as e:
                    estado = f"FALHA {type(e).__name__}"
                print(f"    {i['id']:22s} {estado}")
    else:
        print("  use --assets para testar se as URLs ainda respondem")

    secao("7. Contrato de cópia — estas quebram o build no projeto de destino")
    por_origem = {}
    for i in itens:
        origem = i.get("arquivo_origem", "") or ""
        if origem.startswith("@"):
            por_origem[origem.split("/")[-1]] = i["id"]
    quebradas = []
    for i in itens:
        caminho = os.path.join(RAIZ, i["caminho"].replace("/", os.sep))
        achados = imports_quebrados(caminho, set(i.get("precisa_componentes") or []))
        if achados:
            quebradas.append((i["id"], achados))
    if quebradas:
        total = sum(len(a) for _, a in quebradas)
        print(f"  {len(quebradas)} peças, {total} imports que não resolvem na pasta da peça")
        print("  o erro no destino diz 'Module not found', não 'falta uma peça' —")
        print("  declare em precisa_componentes ou traga o arquivo para dentro da peça.")
        for pid, achados in quebradas[:20]:
            refs = sorted({r for _, r in achados})
            dicas = [f"{r} -> {por_origem[os.path.basename(r)]}"
                     for r in refs if os.path.basename(r) in por_origem]
            print(f"    {pid}: {', '.join(refs[:6])}{'…' if len(refs) > 6 else ''}")
            if dicas:
                print(f"      está no acervo: {', '.join(dicas[:3])}")
        if len(quebradas) > 20:
            print(f"    ... e mais {len(quebradas) - 20}")
    else:
        print("  todas as peças resolvem os próprios imports")

    secao("Resumo")
    print(f"  duplicatas: {len(dups)}   vazios: {len(vazios)}   fichas fracas: {len(fracos)}")
    print(f"  dependentes de asset externo: {len(com_assets)}")
    print(f"  quebram ao copiar: {len(quebradas)}")


if __name__ == "__main__":
    main()
