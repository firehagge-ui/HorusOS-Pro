# -*- coding: utf-8 -*-
"""
Resolve onde o acervo mora.

O plugin e o acervo sao coisas separadas: o plugin e o motor (scripts + skills)
e vem do git; o acervo e o SEU material e mora fora do repositorio. Um plugin
recem-instalado comeca com acervo vazio e cresce a cada ingestao.

Ordem de resolucao:
  1. variavel de ambiente CANNONBALL_ACERVO (ou SITEKIT_ACERVO, nome antigo)
  2. cannonball.config.json, se a raiz existir
  3. ~/.cannonball/aonde                    (ponteiro escrito por vincular.py)
  4. ../acervo relativo a este arquivo      (rodando direto de um repo com dados)
  5. ~/.cannonball                          (padrao; criado na hora se faltar)

Ponteiro vem antes do ../acervo do repo de proposito: quem rodou vincular.py
escolheu uma pasta, e escolha explicita vence pasta que por acaso esta do lado.
"""

import json
import os
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
REPO_LOCAL = os.path.dirname(AQUI)
PADRAO = os.path.expanduser("~/.cannonball")

# CANNONBALL_ACERVO manda. SITEKIT_ACERVO continua valendo: era o nome antigo
# do plugin e quem ja tinha configurado nao pode quebrar numa atualizacao.
AMBIENTE = ("CANNONBALL_ACERVO", "SITEKIT_ACERVO")
CONFIGS = ("cannonball.config.json", "sitekit.config.json")

# Ponteiro para a pasta que o usuario escolheu. Mora FORA do plugin de
# proposito: o plugin instalado e uma copia em cache, apagada a cada
# atualizacao, entao qualquer config gravada la dentro se perde. Escrito por
# scripts/vincular.py.
PONTEIRO = os.path.join(PADRAO, "aonde")


def _do_ambiente():
    for chave in AMBIENTE:
        valor = os.environ.get(chave)
        if valor:
            return os.path.expanduser(valor)
    return None


def _do_ponteiro():
    if not os.path.exists(PONTEIRO):
        return None
    try:
        with open(PONTEIRO, encoding="utf-8") as fh:
            valor = fh.read().strip()
        return os.path.expanduser(valor) if valor else None
    except Exception:
        return None


def _do_config():
    for nome in CONFIGS:
        caminho = os.path.join(REPO_LOCAL, nome)
        if not os.path.exists(caminho):
            continue
        try:
            with open(caminho, encoding="utf-8") as fh:
                valor = json.load(fh).get("raiz")
            if valor:
                return os.path.expanduser(valor)
        except Exception:
            pass
    return None


def _no_cache_de_plugin(caminho):
    p = caminho.replace("\\", "/").lower()
    return "/.claude/plugins/cache/" in p


def _semear(destino):
    """Copia as pecas de exemplo para um acervo recem-criado.

    Sao poucas e sao originais do cannonball. Existem para que a primeira busca
    devolva ALGUMA coisa e para servir de modelo de ficha bem escrita — e uma
    ficha boa e o que decide se a peca vai ser encontrada depois.

    So roda na CRIACAO. Se o usuario apagar as pecas, elas nao voltam: a pasta
    e dele.
    """
    import shutil
    semente = os.path.join(REPO_LOCAL, "seed", "acervo")
    if not os.path.isdir(semente):
        return
    for nome in os.listdir(semente):
        origem, alvo = os.path.join(semente, nome), os.path.join(destino, nome)
        if os.path.isdir(origem):
            shutil.copytree(origem, alvo, dirs_exist_ok=True)
        else:
            shutil.copy2(origem, alvo)
    # stderr para nao sujar a saida --json de quem esta lendo o script
    print(f"acervo criado em {os.path.dirname(destino)} com as peças de exemplo "
          "do cannonball. Alimente com /kit-ingerir.", file=sys.stderr)


def _garantir(raiz):
    """Cria a raiz do acervo se ainda nao existe. Primeira vez nao pode falhar."""
    destino = os.path.join(raiz, "acervo")
    if os.path.isdir(destino):
        return raiz
    os.makedirs(destino, exist_ok=True)
    _semear(destino)
    return raiz


def resolver():
    env = _do_ambiente()
    if env:
        return _garantir(env)

    cfg = _do_config()
    if cfg and os.path.isdir(os.path.join(cfg, "acervo")):
        return cfg

    ponteiro = _do_ponteiro()
    if ponteiro:
        if os.path.isdir(os.path.join(ponteiro, "acervo")):
            return ponteiro
        sys.exit(
            "acervo vinculado, mas a pasta sumiu.\n"
            f"  {PONTEIRO} aponta para: {ponteiro}\n"
            "  esse caminho não existe mais.\n\n"
            "  Vincule de novo com:\n"
            "    python scripts/vincular.py --para \"<pasta do acervo>\"\n"
        )

    # repo com acervo ao lado: instalacao antiga ou desenvolvimento
    if os.path.isdir(os.path.join(REPO_LOCAL, "acervo")) and not _no_cache_de_plugin(REPO_LOCAL):
        return REPO_LOCAL

    # Config aponta para um lugar que sumiu E estamos rodando do cache de
    # plugins: existe um acervo de verdade em algum lugar e nao e este. Cair no
    # padrao aqui criaria um acervo vazio paralelo e o trabalho pareceria perdido.
    if cfg and _no_cache_de_plugin(REPO_LOCAL):
        sys.exit(
            "acervo mudou de lugar.\n"
            f"  config aponta para: {cfg}\n"
            "  esse caminho não existe mais.\n\n"
            "  Corrija com CANNONBALL_ACERVO=<caminho> ou:\n"
            "    python scripts/relocalizar.py --para \"<novo caminho>\"\n"
        )

    return _garantir(PADRAO)


RAIZ = resolver()
ACERVO = os.path.join(RAIZ, "acervo")
INDICE = os.path.join(ACERVO, "index.json")

VAZIO = (
    "acervo vazio — nenhuma peça ingerida ainda.\n"
    f"  ele mora em: {RAIZ}\n"
    "  alimente com /kit-ingerir (ou scripts/ingerir.py) e rode scripts/indexar.py.\n"
    "  Se o seu acervo mora em outra pasta, vincule antes:\n"
    "    python scripts/vincular.py --para \"<pasta>\"\n"
    "  As skills se adaptam sozinhas ao que houver dentro."
)


def carregar_indice():
    """Itens do indice. Lista vazia quando o acervo ainda nao tem nada.

    Acervo vazio e estado NORMAL num plugin recem-instalado, nao erro: quem
    chama decide se para ou se degrada.
    """
    if not os.path.exists(INDICE):
        return []
    with open(INDICE, encoding="utf-8") as fh:
        return json.load(fh).get("itens", [])


def exigir_indice():
    """Para com mensagem util quando o comando so faz sentido com acervo cheio."""
    itens = carregar_indice()
    if not itens:
        sys.exit(VAZIO)
    return itens


def saida_utf8():
    """O console do Windows vem em cp1252 e corrompe acento na saida."""
    if hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass
