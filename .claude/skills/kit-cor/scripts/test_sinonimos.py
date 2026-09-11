#!/usr/bin/env python3
"""Self-check do mapa PT<->EN da busca.  python3 scripts/test_sinonimos.py"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("CANNONBALL_ACERVO", os.path.expanduser("~/sitekit"))
from buscar import variantes, pontuar, tokenizar

def item(**kw):
    base = dict(titulo="", resumo="", quando_usar="", tags=[], setor="generico",
                estrutura="componente-ui", nao_usar_quando="", stack=[], deps=[],
                fontes=[], marca=None, id="x", qualidade="producao")
    base.update(kw); return base

# 1) PT acha ficha escrita em EN, e vice-versa
en = item(titulo="Data Grid Pagination", resumo="A paginated table component")
assert pontuar(en, tokenizar("tabela")) > 0, "PT->EN falhou"
assert pontuar(en, tokenizar("paginacao")) > 0, "PT->EN (paginacao) falhou"
pt = item(titulo="Botao de acao", resumo="Botao com brilho no hover")
assert pontuar(pt, tokenizar("button")) > 0, "EN->PT falhou"

# 2) assimetria: 'carrossel' puxa slider; 'deslizante' NAO puxa carrossel
assert "slider" in variantes("carrossel")
assert "carousel" in variantes("slider")
assert "carrossel" not in variantes("deslizante"), "grupo errado vazou"

# 3) o proprio termo sempre entra, mesmo fora do mapa
assert variantes("xyzzy") == {"xyzzy"}
assert "tabela" in variantes("tabela")

# 4) cobertura nao se dilui: sinonimo nao vira termo extra
um = item(titulo="Table")
dois = item(titulo="Table", resumo="pagination")
assert pontuar(dois, tokenizar("tabela paginacao")) > pontuar(um, tokenizar("tabela paginacao")), \
    "casar 2 de 2 tem que vencer 1 de 2"

# 5) sinonimo na contraindicacao continua contando contra
ruim = item(titulo="Componente", nao_usar_quando="nao use em table densa")
assert pontuar(ruim, tokenizar("tabela")) <= 0, "contraindicacao deveria penalizar"

print("ok: sinonimos PT<->EN")
