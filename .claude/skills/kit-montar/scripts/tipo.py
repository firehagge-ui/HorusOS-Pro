#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Decisao de tipografia: o que da para ENTREGAR, e em que escala.

O acervo nomeia 389 fontes diferentes, e 341 delas (87%) aparecem uma vez so.
Nao e variedade: e a lista de compras de outras marcas. Os design systems foram
extraidos de sites reais, e site de marca paga por tipo — Aeonik, Roobert,
GT Standard, Suisse Int'l, Lausanne sao todas comerciais.

E o pior: os 166 design systems nomeiam a fonte e NENHUM diz onde carrega-la.
21 dos 84 prompts puxam de db.onlinewebfonts.com, que redistribui fonte
comercial sem licenca — quem entregar isso para cliente entrega o problema junto.

Cor e de graca. Tipo nao e. Este script trata dessa diferenca.

    python scripts/tipo.py --vies
    python scripts/tipo.py --licenca "Aeonik"
    python scripts/tipo.py --substituir "Roobert"
    python scripts/tipo.py --par "Instrument Serif"
    python scripts/tipo.py --escala --base 17 --razao 1.25
"""

import argparse
import json
import os
import sys
from collections import Counter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from caminhos import ACERVO, exigir_indice, saida_utf8  # noqa: E402

saida_utf8()

# ---------------------------------------------------------------------------
# LIVRES para uso comercial. OFL salvo onde indicado.
#   g  = Google Fonts   f = Fontshare   v = repositorio proprio
# ---------------------------------------------------------------------------
LIVRES = {
    # neo-grotescas / sans neutras
    "inter": ("g", "sans", "A neutra padrão da web. Variável, 9 pesos, ótimo em UI."),
    "inter tight": ("g", "sans", "Inter com tracking fechado. Serve de display sem trocar de família."),
    "archivo": ("g", "sans", "Grotesca com largura variável — vai de estreita a expandida."),
    "public sans": ("g", "sans", "Do design system do governo dos EUA. Sóbria, legível, sem personalidade — o que às vezes é o pedido."),
    "hanken grotesk": ("g", "sans", "Grotesca quente, boa alternativa quando Inter parece fria demais."),
    "geist": ("g", "sans", "Da Vercel. Técnica, moderna, par mono nativo (Geist Mono)."),
    "general sans": ("f", "sans", "Fontshare. O substituto mais próximo de Aeonik e PP Neue Montreal."),
    "switzer": ("f", "sans", "Fontshare. Suíça neutra, no território de Suisse Int'l."),
    "satoshi": ("f", "sans", "Fontshare. Geométrica contemporânea."),
    # geométricas / humanistas
    "manrope": ("g", "sans", "Semi-geométrica, variável. Boa em display médio."),
    "outfit": ("g", "sans", "Geométrica limpa. Cai bem em marca jovem."),
    "sora": ("g", "sans", "Geométrica com detalhe técnico. Serve tech e fintech."),
    "plus jakarta sans": ("g", "sans", "Humanista amigável, muito usada em SaaS."),
    # display
    "anton": ("g", "display", "Condensada pesada. Um peso só — hierarquia por TAMANHO."),
    "bricolage grotesque": ("g", "display", "Display com largura e opsz variáveis. Editorial contemporâneo."),
    "syne": ("g", "display", "Excêntrica, arte e cultura. Não use em corpo."),
    "unbounded": ("g", "display", "Geométrica larga e expressiva."),
    "orbitron": ("g", "display", "Techno/sci-fi. Envelhece rápido — use com consciência."),
    # serifas
    "instrument serif": ("g", "serif-display", "Serifa de display alto contraste. SÓ título."),
    "fraunces": ("g", "serif-display", "Variável com eixo 'wonk' e opsz. Substitui P22 Mackinac."),
    "playfair display": ("g", "serif-display", "Didone clássica. SÓ título — quebra em corpo."),
    "cormorant": ("g", "serif-display", "Garamond de altíssimo contraste. SÓ título grande."),
    "libre caslon display": ("g", "serif-display", "Caslon editorial. SÓ título."),
    "newsreader": ("g", "serif", "Serifa de leitura com opsz variável. Aguenta corpo."),
    "literata": ("g", "serif", "Desenhada para leitura longa em tela. Aguenta corpo."),
    "source serif 4": ("g", "serif", "Serifa de texto sólida, variável."),
    "instrument sans": ("g", "sans", "Par sans da Instrument Serif — casam por desenho."),
    # mono
    "jetbrains mono": ("g", "mono", "Mono de código, altura-x grande. Boa em rótulo técnico."),
    "space mono": ("g", "mono", "Mono com personalidade. Rótulo e número, não parágrafo."),
    "geist mono": ("g", "mono", "Par mono da Geist."),
    "ibm plex mono": ("g", "mono", "Mono corporativa neutra."),
}

# ---------------------------------------------------------------------------
# COMERCIAIS que aparecem no acervo -> substituto livre mais proximo.
# O criterio e desenho (largura, altura-x, contraste, terminacoes), nao "parece".
# ---------------------------------------------------------------------------
COMERCIAIS = {
    "aeonik": ("CoType", ["general sans", "manrope"], "grotesca geométrica de altura-x média"),
    "roobert": ("Displaay", ["general sans", "hanken grotesk"], "geométrica de cantos suaves"),
    "gt standard": ("Grilli Type", ["inter", "archivo"], "neo-grotesca neutra"),
    "gtstandard-m": ("Grilli Type", ["inter", "archivo"], "neo-grotesca neutra"),
    "gt america": ("Grilli Type", ["archivo", "inter"], "grotesca americana com larguras"),
    "gt walsheim": ("Grilli Type", ["outfit", "satoshi"], "geométrica amigável"),
    "suisse int'l": ("Swiss Typefaces", ["switzer", "inter"], "suíça neutra clássica"),
    "suisseintl": ("Swiss Typefaces", ["switzer", "inter"], "suíça neutra clássica"),
    "lausanne": ("Nizar Kazan", ["inter", "archivo"], "neo-grotesca suíça"),
    "söhne": ("Klim", ["inter", "public sans"], "grotesca de Akzidenz revisitada"),
    "sohne": ("Klim", ["inter", "public sans"], "grotesca de Akzidenz revisitada"),
    "graphik": ("Commercial Type", ["inter", "public sans"], "grotesca neutra de editorial"),
    "circular": ("Lineto", ["outfit", "manrope"], "geométrica de terminações retas"),
    "founders grotesk": ("Klim", ["archivo", "space grotesk"], "grotesca com desenho de metal"),
    "pp neue montreal": ("Pangram Pangram", ["general sans", "switzer"], "grotesca contemporânea fechada"),
    "neue montreal": ("Pangram Pangram", ["general sans", "switzer"], "grotesca contemporânea fechada"),
    "pp mori": ("Pangram Pangram", ["satoshi", "general sans"], "geométrica leve"),
    "monument extended": ("Pangram Pangram", ["unbounded", "anton"], "display expandida pesada"),
    "editorial new": ("Pangram Pangram", ["instrument serif", "fraunces"], "serifa display alto contraste"),
    "p22 mackinac": ("P22", ["fraunces", "newsreader"], "serifa humanista com cunha"),
    "p22 mackinac w01 book": ("P22", ["fraunces", "newsreader"], "serifa humanista com cunha"),
    "abc diatype": ("Dinamo", ["inter", "archivo"], "grotesca neutra suíça"),
    "helvetica neue": ("Monotype", ["inter", "archivo"], "a neo-grotesca de referência"),
    "helvetica": ("Monotype", ["inter", "archivo"], "a neo-grotesca de referência"),
    "es allianz": ("Extraset", ["inter", "switzer"], "grotesca suíça contemporânea"),
    "aktiv grotesk": ("Dalton Maag", ["inter", "archivo"], "neo-grotesca neutra"),
}

# Licenca que NAO permite web, mesmo estando instalada na maquina
RESTRITAS = {
    "sf pro display": "Apple — licença permite apenas interfaces de apps das plataformas Apple. NÃO pode ser servida na web.",
    "sf pro text": "Apple — mesma restrição.",
    "sf pro": "Apple — mesma restrição.",
    "-apple-system": "É um alias do sistema, não uma fonte para servir. Só funciona em Apple; use como fallback, nunca como escolha.",
    "segoe ui": "Microsoft — licenciada com o Windows. Não sirva; use como fallback.",
}

# Pares display + corpo que funcionam. Serifa de alto contraste SEMPRE com sans no corpo.
PARES = {
    "instrument serif": ["instrument sans", "inter", "public sans"],
    "playfair display": ["inter", "hanken grotesk", "source serif 4"],
    "cormorant": ["inter", "public sans", "archivo"],
    "libre caslon display": ["inter", "public sans"],
    "fraunces": ["inter", "public sans", "hanken grotesk"],
    "anton": ["inter", "archivo", "public sans"],
    "bricolage grotesque": ["inter", "public sans"],
    "syne": ["inter", "archivo"],
    "unbounded": ["inter", "manrope"],
    "orbitron": ["inter", "geist"],
    "archivo": ["inter", "public sans"],
    "general sans": ["general sans", "inter"],
    "geist": ["geist", "inter"],
    "inter tight": ["inter", "public sans"],
}

URL = {
    "g": "https://fonts.google.com/specimen/{}",
    "f": "https://www.fontshare.com/fonts/{}",
    "v": "",
}


def norm(s):
    return " ".join(s.lower().replace("'", "'").split())


def slug_google(nome):
    return "+".join(p.capitalize() for p in nome.split())


def link(nome):
    if nome not in LIVRES:
        return ""
    origem = LIVRES[nome][0]
    if origem == "g":
        return URL["g"].format(slug_google(nome))
    if origem == "f":
        return URL["f"].format(nome.replace(" ", "-"))
    return ""


def mostrar_livre(nome, prefixo="  "):
    if nome not in LIVRES:
        print(f"{prefixo}{nome}  (não catalogada aqui)")
        return
    origem, cat, nota = LIVRES[nome]
    fonte = {"g": "Google Fonts", "f": "Fontshare", "v": "próprio"}[origem]
    print(f"{prefixo}{nome.title():24s} [{cat}]  {fonte}")
    print(f"{prefixo}  {nota}")
    u = link(nome)
    if u:
        print(f"{prefixo}  {u}")


# ---------------------------------------------------------------------------


def cmd_licenca(nome):
    n = norm(nome)
    if n in RESTRITAS:
        print(f"'{nome}' — NÃO PODE SER SERVIDA NA WEB\n")
        print(f"  {RESTRITAS[n]}\n")
        print("  Use como último fallback na pilha, nunca como a escolha.")
        cmd_substituir(nome, ja_avisou=True)
        return
    if n in LIVRES:
        origem, cat, nota = LIVRES[n]
        print(f"'{nome}' — LIVRE para uso comercial\n")
        mostrar_livre(n)
        return
    if n in COMERCIAIS:
        fundicao, subs, desenho = COMERCIAIS[n]
        print(f"'{nome}' — COMERCIAL ({fundicao})\n")
        print(f"  Desenho: {desenho}")
        print("  Precisa de licença web paga, cobrada por pageview ou por domínio.")
        print("  NÃO baixe de db.onlinewebfonts.com nem de espelho parecido: são")
        print("  redistribuições sem licença, e o problema vai junto para o cliente.\n")
        print("  Substitutos livres:")
        for s in subs:
            mostrar_livre(s, "    ")
        return
    print(f"'{nome}' — não está no catálogo deste script.\n")
    print("  Não assuma que é livre. Confira a fundição antes de entregar.")
    print("  Se for de marca conhecida, quase certamente é comercial.")


def cmd_substituir(nome, ja_avisou=False):
    n = norm(nome)
    if n in COMERCIAIS:
        fundicao, subs, desenho = COMERCIAIS[n]
        if not ja_avisou:
            print(f"'{nome}' é comercial ({fundicao}) — {desenho}\n")
        print("  Substitutos livres, do mais próximo ao menos:")
        for s in subs:
            mostrar_livre(s, "    ")
        return
    if n in RESTRITAS:
        print(f"  '{nome}' não pode ir para a web. Use:")
        for s in ["inter", "geist", "public sans"]:
            mostrar_livre(s, "    ")
        return
    if n in LIVRES:
        print(f"'{nome}' já é livre — não precisa substituir.\n")
        mostrar_livre(n)
        return
    print(f"'{nome}' não catalogada. Descreva o desenho (largura, altura-x,")
    print("contraste) e escolha entre as livres com --vies.")


def cmd_par(display):
    n = norm(display)
    print(f"pares para '{display}' no display\n")
    if n in PARES:
        for b in PARES[n]:
            mostrar_livre(b, "  ")
    else:
        print("  Não catalogada. Regra geral: se o display tem alto contraste ou")
        print("  peso único, o corpo tem que ser uma sans robusta e neutra.")
        for b in ("inter", "public sans"):
            mostrar_livre(b, "    ")
    if n in LIVRES and LIVRES[n][1] == "serif-display":
        print("\n  ATENÇÃO: serifa de display alto contraste é SÓ TÍTULO.")
        print("  Em corpo, os traços finos somem em 16px e em tela sem retina.")


def cmd_escala(base, razao, passos):
    print(f"escala modular — base {base}px, razão {razao}\n")
    print(f"  {'passo':7s} {'px':>8s}  {'rem':>7s}   uso típico")
    usos = {-1: "legenda, rótulo", 0: "corpo", 1: "subtítulo, lead",
            2: "h3", 3: "h2", 4: "h1", 5: "display", 6: "hero"}
    for i in range(-1, passos):
        px = base * (razao ** i)
        print(f"  {i:+3d}     {px:8.1f}  {px/16:7.3f}   {usos.get(i, 'hero grande')}")
    print()
    print("  Arredonde para o meio pixel mais próximo ao escrever no CSS —")
    print("  fração longa não muda nada na tela e polui o token.")
    if base < 16:
        print(f"\n  AVISO: base {base}px é pequena para corpo. 16px é o padrão do")
        print("  navegador e o mínimo confortável; abaixo disso o iOS dá zoom")
        print("  automático em input, o que quebra layout de formulário.")
    if razao >= 1.5:
        print(f"\n  AVISO: razão {razao} salta muito. Passa bem em hero, mas deixa")
        print("  buraco entre corpo e subtítulo. Considere 1.2–1.333 para site de")
        print("  conteúdo; guarde as razões grandes para landing de uma tela.")


def cmd_vies():
    itens = exigir_indice()
    todas = Counter()
    for i in itens:
        for f in (i.get("fontes") or []):
            if isinstance(f, str) and f.strip():
                todas[norm(f)] += 1
    uma = sum(1 for v in todas.values() if v == 1)
    print("o que o acervo sabe sobre tipografia\n")
    print(f"  nomes distintos de fonte : {len(todas)}")
    print(f"  usadas 1x só             : {uma} ({uma * 100 // max(1, len(todas))}%)")
    print()
    print("  Isso não é variedade — é a lista de compras de outras marcas.")
    print("  Os design systems vieram de sites reais, e site de marca paga por tipo.\n")

    livre = com = restrita = desconhecida = 0
    exemplos_com = []
    for nome, n in todas.items():
        if nome in LIVRES:
            livre += n
        elif nome in COMERCIAIS:
            com += n
            exemplos_com.append((n, nome))
        elif nome in RESTRITAS:
            restrita += n
        else:
            desconhecida += n
    tot = livre + com + restrita + desconhecida
    print("  usos por situação de licença:")
    for rot, v in (("livre", livre), ("comercial (precisa comprar)", com),
                   ("restrita (não pode web)", restrita),
                   ("não classificada", desconhecida)):
        print(f"    {v:5d}  {v * 100 // max(1, tot):3d}%  {rot}")
    if exemplos_com:
        print("\n  comerciais mais citadas:")
        for n, nome in sorted(exemplos_com, reverse=True)[:8]:
            print(f"    {n:3d}x  {nome.title()}  ->  {', '.join(COMERCIAIS[nome][1])}")
    print("\n  166 de 166 design systems nomeiam a fonte e NÃO dizem onde carregá-la.")
    print("  21 dos 84 prompts puxam de db.onlinewebfonts.com, que redistribui")
    print("  fonte comercial sem licença. Confira antes de entregar para cliente.")


# ---------------------------------------------------------------------------
# classificacao em lote — o nome no acervo vem sujo
# ---------------------------------------------------------------------------

TABELA = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                     "fontes_licenca.json"), encoding="utf-8"))

# peso, estilo, largura e sufixo de arquivo. Removidos ANTES de casar a familia.
LIXO = (
    "thin extralight ultralight light regular normal book medium semibold demibold "
    "demi bold extrabold ultrabold black heavy roman italic oblique "
    "condensed cond extended expanded narrow wide semi squeezed compact "
    "variable var vf webfont web std pro lt mt ms otf ttf woff woff2 "
    "display text micro deck headline caption subset latin"
).split()


def chave(s):
    """So letras e digitos, minusculo. 'GT-America Mono W01' -> 'gtamericamonow01'."""
    return "".join(c for c in s.lower() if c.isalnum())


def familia_de(nome):
    """Reduz o nome sujo a uma familia comparavel."""
    s = nome.lower()
    for c in "-_/,.()":
        s = s.replace(c, " ")
    partes = [p for p in s.split() if p not in LIXO and not p.startswith("w0")]
    return " ".join(partes).strip() or s.strip()


def classificar(nome):
    """Devolve (situacao, detalhe). Ordem importa: trial e ruido primeiro."""
    bruto = nome.lower()
    fam = familia_de(nome)
    k = chave(fam)

    for marca in TABELA["ruido"]:
        if marca in bruto:
            return "ruido", "não é nome de fonte"
    for marca in TABELA["trial"]:
        if marca in bruto:
            return "trial", "versão trial — a licença proíbe uso em produção"
    if fam in TABELA["sistema"] or k in {chave(x) for x in TABELA["sistema"]}:
        return "sistema", "fonte de sistema — use na pilha de fallback"

    # casamento por continencia, preferindo a familia mais longa
    def melhor(d):
        achado, tam = None, 0
        for f in d:
            kf = chave(f)
            if len(kf) >= 4 and (kf in k or k in kf) and len(kf) > tam:
                achado, tam = f, len(kf)
        return achado

    m = melhor(TABELA["restrita"])
    if m:
        return "restrita", TABELA["restrita"][m]
    m = melhor(TABELA["comercial"])
    if m:
        d = TABELA["comercial"][m]
        return "comercial", f"{d['f']} -> {', '.join(d['sub'])}"
    m = melhor(TABELA["livre"])
    if m:
        origem = {"g": "Google Fonts", "f": "Fontshare", "v": "OFL própria"}[TABELA["livre"][m]]
        return "livre", origem
    # Em licenca de fonte, "nao sei" NAO e neutro. Nome de fundicao boutique que
    # nao esta no Google Fonts nem no Fontshare e, quase sempre, pago. Presumir
    # livre e o erro caro; presumir paga so custa uma verificacao.
    return "presumir-paga", "não está em catálogo livre conhecido — confirme a fundição antes de entregar"


# Tudo que NAO pode ser entregue como esta.
BLOQUEIA = ("comercial", "restrita", "trial", "presumir-paga")


def cmd_classificar(detalhe=False):
    itens = exigir_indice()

    usos = Counter()
    por_item = {}
    for i in itens:
        fs = [f for f in (i.get("fontes") or []) if isinstance(f, str) and f.strip()]
        if not fs:
            continue
        sit_do_item = set()
        for f in fs:
            s, d = classificar(f)
            usos[s] += 1
            sit_do_item.add(s)
            if s in BLOQUEIA:
                por_item.setdefault(i["id"], []).append((f, s, d))
        _ = sit_do_item

    tot = sum(usos.values())
    print("classificação de licença — todas as fontes declaradas no acervo\n")
    ordem = ["livre", "sistema", "comercial", "restrita", "trial", "presumir-paga", "ruido"]
    for s in ordem:
        v = usos.get(s, 0)
        if not v:
            continue
        print(f"  {v:4d}  {v * 100 // tot:3d}%  {s}")
    print(f"  ----  ---- \n  {tot:4d}  100%  total\n")

    bloqueadas = sum(usos.get(x, 0) for x in BLOQUEIA)
    print(f"  NÃO ENTREGÁVEIS sem substituir: {bloqueadas} usos "
          f"({bloqueadas * 100 // tot}%), em {len(por_item)} peças\n")

    if detalhe:
        print("peças que precisam de substituição:\n")
        for pid, lista in sorted(por_item.items()):
            print(f"  {pid}")
            for f, s, d in lista:
                print(f"     [{s}] {f}")
                print(f"        -> {d}")
    else:
        print("  Veja peça a peça com: --classificar --detalhe")
        print("  Grave a substituição no acervo com: --aplicar")


def cmd_aplicar():
    """Grava a substituicao sugerida num arquivo lateral por peca."""
    itens = exigir_indice()
    n_pecas = n_subs = 0
    for i in itens:
        fs = [f for f in (i.get("fontes") or []) if isinstance(f, str) and f.strip()]
        if not fs:
            continue
        plano = []
        for f in fs:
            s, d = classificar(f)
            if s not in BLOQUEIA:
                continue
            fam = familia_de(f)
            k = chave(fam)
            subs = []
            for nome, dados in TABELA["comercial"].items():
                kf = chave(nome)
                if len(kf) >= 4 and (kf in k or k in kf):
                    subs = dados["sub"]
                    break
            if not subs:
                subs = ["inter", "public sans"]
            plano.append({"original": f, "situacao": s, "motivo": d, "usar": subs})
        if not plano:
            continue
        pasta = None
        for fam_dir in sorted(os.listdir(ACERVO)):
            cand = os.path.join(ACERVO, fam_dir, i["id"])
            if os.path.isdir(cand):
                pasta = cand
                break
        if not pasta:
            continue
        with open(os.path.join(pasta, "fontes_substituir.json"), "w",
                  encoding="utf-8", newline="\n") as fh:
            json.dump(plano, fh, ensure_ascii=False, indent=1)
        n_pecas += 1
        n_subs += len(plano)
    print(f"plano de substituição gravado em {n_pecas} peças ({n_subs} fontes)")
    print("arquivo: acervo/<familia>/<id>/fontes_substituir.json")
    print("\nrode agora: python scripts/indexar.py")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--classificar", action="store_true")
    ap.add_argument("--detalhe", action="store_true")
    ap.add_argument("--aplicar", action="store_true")
    ap.add_argument("--vies", action="store_true")
    ap.add_argument("--licenca", metavar="FONTE")
    ap.add_argument("--substituir", metavar="FONTE")
    ap.add_argument("--par", metavar="FONTE_DISPLAY")
    ap.add_argument("--escala", action="store_true")
    ap.add_argument("--base", type=float, default=16)
    ap.add_argument("--razao", type=float, default=1.25)
    ap.add_argument("--passos", type=int, default=6)
    a = ap.parse_args()

    if a.classificar:
        cmd_classificar(a.detalhe)
    elif a.aplicar:
        cmd_aplicar()
    elif a.vies:
        cmd_vies()
    elif a.licenca:
        cmd_licenca(a.licenca)
    elif a.substituir:
        cmd_substituir(a.substituir)
    elif a.par:
        cmd_par(a.par)
    elif a.escala:
        cmd_escala(a.base, a.razao, a.passos)
    else:
        ap.print_help()


if __name__ == "__main__":
    main()
