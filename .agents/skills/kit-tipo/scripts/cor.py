#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Decisao de cor: papeis, contraste medido e o vies do proprio acervo.

O acervo guarda 1351 cores em 166 design systems como LISTA PLANA — sem dizer
qual e fundo, qual e tinta, qual e acento. Lista plana nao se decide; so se
copia. Este script existe para transformar cor em decisao:

  1. deriva a paleta por PAPEL a partir de fundo + tinta + acento
  2. MEDE o contraste (WCAG 2.x) de cada par que vai existir na tela
  3. diz de quantos design systems do acervo voce esta chegando perto

O item 3 e o que evita o piloto automatico: 44 dos 166 nao tem acento nenhum e
42 tem acento azul. Metade do acervo e "neutro ou azul". Se a sua escolha cai
ali, que caia por decisao.

    python scripts/cor.py --contraste "#1a1a1a" "#fdfcfa"
    python scripts/cor.py --paleta --fundo "#0b0b0d" --tinta "#f4f4f5" --acento "#c9a227"
    python scripts/cor.py --parecidos "#c9a227"
    python scripts/cor.py --vies
"""

import argparse
import colorsys
import json
import os
import sys
from collections import Counter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from caminhos import ACERVO, exigir_indice, saida_utf8  # noqa: E402

saida_utf8()

# --------------------------------------------------------------------------
# conversao
# --------------------------------------------------------------------------


def ler_hex(s):
    h = s.strip().lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    if len(h) != 6:
        raise ValueError(f"cor inválida: {s}")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def para_hex(rgb):
    return "#" + "".join(f"{max(0, min(255, round(c))):02x}" for c in rgb)


def para_hsl(s):
    r, g, b = (c / 255 for c in ler_hex(s))
    h, l, sa = colorsys.rgb_to_hls(r, g, b)
    return h * 360, sa * 100, l * 100


def de_hsl(h, s, l):
    r, g, b = colorsys.hls_to_rgb((h % 360) / 360, l / 100, s / 100)
    return para_hex((r * 255, g * 255, b * 255))


def misturar(a, b, t):
    """t=0 devolve a, t=1 devolve b."""
    ra, rb = ler_hex(a), ler_hex(b)
    return para_hex(tuple(x + (y - x) * t for x, y in zip(ra, rb)))


# --------------------------------------------------------------------------
# contraste — WCAG 2.x. E o que auditoria de acessibilidade mede.
# --------------------------------------------------------------------------


def luminancia(cor):
    def canal(c):
        c /= 255
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (canal(c) for c in ler_hex(cor))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contraste(a, b):
    la, lb = luminancia(a), luminancia(b)
    if la < lb:
        la, lb = lb, la
    return (la + 0.05) / (lb + 0.05)


def veredito(r, grande=False):
    """AA exige 4.5 para texto normal e 3.0 para texto grande ou elemento de UI."""
    minimo = 3.0 if grande else 4.5
    if r >= 7 and not grande:
        return "AAA"
    if r >= 4.5 and grande:
        return "AAA"
    return "AA" if r >= minimo else "REPROVA"


# --------------------------------------------------------------------------
# familia de cor — para falar de vies em palavra, nao em hex
# --------------------------------------------------------------------------

FAIXAS = [(15, "vermelho"), (45, "laranja"), (70, "amarelo"), (160, "verde"),
          (200, "ciano"), (255, "azul"), (290, "roxo"), (330, "magenta"),
          (360, "vermelho")]


def familia(cor):
    h, s, l = para_hsl(cor)
    if s < 10:
        return "neutro"
    if l < 12:
        return "quase-preto"
    if l > 92:
        return "quase-branco"
    for lim, nome in FAIXAS:
        if h < lim:
            return nome
    return "vermelho"


# --------------------------------------------------------------------------
# a paleta por PAPEL — o que a lista plana nao tem
# --------------------------------------------------------------------------


def derivar(fundo, tinta, acento):
    """Nomes iguais aos tokens que as pecas do acervo ja usam (--kit-*)."""
    escuro = luminancia(fundo) < luminancia(tinta)
    # superficie sobe na direcao contraria ao fundo: no escuro clareia, no claro escurece
    p = {
        "kit-bg": fundo,
        "kit-bg-alt": misturar(fundo, tinta, 0.04),
        "kit-surface": misturar(fundo, tinta, 0.07),
        "kit-surface-raised": misturar(fundo, tinta, 0.11),
        "kit-fg": tinta,
        "kit-fg-suave": misturar(tinta, fundo, 0.35),
        "kit-fg-apagado": misturar(tinta, fundo, 0.60),
        "kit-linha": misturar(fundo, tinta, 0.14),
        "kit-acento": acento,
        "kit-acento-fg": "#ffffff" if contraste("#ffffff", acento) >= contraste("#000000", acento) else "#000000",
    }
    if escuro:
        p["kit-glow"] = de_hsl(*[v for v in para_hsl(acento)][:2], min(70, para_hsl(acento)[2] + 12))
    return p


# tipo: "texto" exige 4.5 | "ui" exige 3.0 (WCAG 1.4.11, componente e grafico
# com significado) | "info" NAO tem minimo — divisoria decorativa a 1.4:1 e
# correta, e marcar como reprovacao so empurraria para linha pesada e feia.
PARES = [
    ("kit-fg", "kit-bg", "texto", "texto principal sobre o fundo"),
    ("kit-fg-suave", "kit-bg", "texto", "texto secundário sobre o fundo"),
    ("kit-fg-apagado", "kit-bg", "ui", "legenda / desabilitado (texto grande)"),
    ("kit-fg", "kit-surface", "texto", "texto dentro de card"),
    ("kit-acento", "kit-bg", "ui", "acento como controle (link, ícone, borda de botão)"),
    ("kit-acento-fg", "kit-acento", "texto", "texto DENTRO do botão de acento"),
    ("kit-linha", "kit-bg", "info", "divisória — decorativa, sem mínimo"),
]


# --------------------------------------------------------------------------
# o acervo
# --------------------------------------------------------------------------


def carregar_ds():
    return [i for i in exigir_indice() if i["familia"] == "design-system"]


def acento_de(item):
    """A cor mais saturada em faixa util de luz. E o acento de fato."""
    melhor, melhor_s = None, -1
    for c in item.get("paleta") or []:
        try:
            h, s, l = para_hsl(c)
        except Exception:
            continue
        if s > melhor_s and 15 < l < 85:
            melhor, melhor_s = c, s
    return melhor if melhor_s > 25 else None


def cmd_vies():
    ds = carregar_ds()
    c = Counter()
    for i in ds:
        a = acento_de(i)
        c[familia(a) if a else "SEM ACENTO (só neutros)"] += 1
    temas = Counter(i.get("tema") for i in ds)
    print(f"166 design systems — de onde vem o piloto automático\n")
    print("acento:")
    for k, v in c.most_common():
        barra = "█" * round(v / 2)
        print(f"  {v:4d}  {barra:24s} {k}")
    print("\ntema:")
    for k, v in temas.most_common():
        print(f"  {v:4d}  {k}")
    neutro_ou_azul = c.get("SEM ACENTO (só neutros)", 0) + c.get("azul", 0)
    print(f"\n  neutro ou azul: {neutro_ou_azul} de {len(ds)} "
          f"({neutro_ou_azul * 100 // len(ds)}%)")
    print("  Buscar design system sem pedir cor devolve, em média, exatamente isso.")


def cmd_parecidos(cor, n=8):
    alvo = familia(cor)
    h_alvo, s_alvo, l_alvo = para_hsl(cor)
    ds = carregar_ds()
    iguais = []
    for i in ds:
        a = acento_de(i)
        if not a:
            continue
        if familia(a) != alvo:
            continue
        h, s, l = para_hsl(a)
        d = abs((h - h_alvo + 180) % 360 - 180) + abs(s - s_alvo) * 0.4 + abs(l - l_alvo) * 0.4
        iguais.append((d, i["id"], a, i["titulo"][:52]))
    iguais.sort()
    print(f"acento {cor} é da família '{alvo}'")
    print(f"design systems do acervo com acento {alvo}: {len(iguais)}\n")
    if not iguais:
        print("  Nenhum. Você está fora do que o acervo já faz — isso é bom sinal,")
        print("  desde que a cor sirva à marca e não só à diferenciação.")
        return
    for d, pid, a, tit in iguais[:n]:
        print(f"  {a}  {pid:26s} {tit}")
    if len(iguais) > n:
        print(f"  … e mais {len(iguais) - n}")
    print(f"\n  Se você quer diferenciação, este NÃO é o caminho: já são {len(iguais)}.")
    print("  Se a cor é da marca, siga — só saiba que ela não te distingue sozinha.")


def cmd_paleta(fundo, tinta, acento, nome=None):
    p = derivar(fundo, tinta, acento)
    print(f"paleta por papel{' — ' + nome if nome else ''}\n")
    for k, v in p.items():
        print(f"  --{k:20s} {v}   {familia(v)}")

    print("\ncontraste medido (WCAG 2.x)\n")
    reprova = 0
    for a, b, tipo, desc in PARES:
        if a not in p or b not in p:
            continue
        r = contraste(p[a], p[b])
        if tipo == "info":
            nota = "sutil" if r < 1.6 else "visível" if r < 3 else "forte"
            print(f"   {r:5.2f}:1  {'—':8s} {desc}  [{nota}]")
            continue
        vd = veredito(r, tipo == "ui")
        if vd == "REPROVA":
            reprova += 1
        print(f"{'->' if vd == 'REPROVA' else '  '} {r:5.2f}:1  {vd:8s} {desc}")

    print()
    if reprova:
        print(f"  {reprova} par(es) REPROVAM. Não entregue assim — o que reprova em")
        print("  contraste reprova em auditoria e some para quem tem baixa visão.")
    else:
        print("  Todos os pares com mínimo obrigatório passam.")

    fam = familia(acento)
    print(f"\n  acento: família '{fam}'")
    print(f"  confira o quanto isso é comum: python scripts/cor.py --parecidos \"{acento}\"")

    print("\nCSS pronto para colar:\n")
    print(":root {")
    for k, v in p.items():
        print(f"  --{k}: {v};")
    print("}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--contraste", nargs=2, metavar=("FRENTE", "FUNDO"))
    ap.add_argument("--paleta", action="store_true")
    ap.add_argument("--fundo")
    ap.add_argument("--tinta")
    ap.add_argument("--acento")
    ap.add_argument("--nome")
    ap.add_argument("--parecidos", metavar="HEX")
    ap.add_argument("--vies", action="store_true")
    a = ap.parse_args()

    if a.contraste:
        f, b = a.contraste
        r = contraste(f, b)
        print(f"{f} sobre {b}")
        print(f"  {r:.2f}:1")
        print(f"  texto normal : {veredito(r, False)}")
        print(f"  texto grande : {veredito(r, True)}")
        if r < 3:
            print("\n  Abaixo de 3:1 não serve nem para borda. Isso some na tela de quem")
            print("  tem baixa visão, e some no celular sob sol.")
        return
    if a.vies:
        cmd_vies()
        return
    if a.parecidos:
        cmd_parecidos(a.parecidos)
        return
    if a.paleta:
        if not (a.fundo and a.tinta and a.acento):
            ap.error("--paleta exige --fundo, --tinta e --acento")
        cmd_paleta(a.fundo, a.tinta, a.acento, a.nome)
        return
    ap.print_help()


if __name__ == "__main__":
    main()
