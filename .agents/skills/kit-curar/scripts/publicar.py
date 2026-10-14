#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Exporta a versao publica do plugin: o MOTOR, sem o acervo.

O repositorio de trabalho guarda duas coisas que nao podem ser publicadas
juntas. O motor (scripts, skills, referencias) e generico e e o que faz sentido
compartilhar. O acervo e material do usuario — peca de terceiro, projeto de
cliente, prompt comprado — e nao e dele para redistribuir.

Este script deriva o repo publico do de trabalho. Ele NAO mexe no seu: nada e
apagado, nada sai do git local. Voce continua editando aqui e re-exportando.

    python scripts/publicar.py --para ../cannonball-publico
    python scripts/publicar.py --para ../cannonball-publico --listar   # so mostra
    python scripts/publicar.py --autoteste     # checa a rede contra vazamento
"""

import argparse
import os
import shutil
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from caminhos import REPO_LOCAL, saida_utf8  # noqa: E402

saida_utf8()

# O motor. Generico, sem material de ninguem dentro.
PUBLICO = ["scripts", "skills", "references", "seed", "exemplo",
           ".claude-plugin", ".codex-plugin", ".agents", ".github",
           "README.md", "AGENTS.md", "CLAUDE.md", "CHANGELOG.md", "LICENSE",
           ".gitignore", ".gitattributes"]

# O acervo do usuario. So na RAIZ: seed/acervo e o exemplo que vai de proposito.
# "sitekit.config.json" e o nome antigo do mesmo arquivo, e ele guarda o caminho
# absoluto da maquina. Os dois nomes ficam aqui: o repo ainda tem o antigo.
NUNCA_NA_RAIZ = ("acervo", "_fonte", "_podados",
                 "cannonball.config.json", "sitekit.config.json", "INSTALAR.md")

# Artefatos de importacao em massa. Carregam material bruto — em lugar nenhum.
NUNCA_EM_LUGAR_NENHUM = ("_extract", "_enriquecimento", "_lote", "_armadilhas_",
                         "_tags_funcao", "_digest", "_duplicatas")

IGNORA = shutil.ignore_patterns("__pycache__", "*.pyc", ".DS_Store")


def vazamentos(destino):
    """Material privado que chegou ao destino. Lista vazia = pode publicar.

    E a fronteira do script: se ela falhar em silencio, peca de cliente vai para
    um repositorio publico e ninguem percebe. `seed/acervo` passa de proposito —
    sao as pecas de exemplo do plugin, e e o caso que um filtro ingenuo quebra.
    """
    achados = []
    for n in os.listdir(destino):
        if n.startswith(NUNCA_NA_RAIZ):
            achados.append(n)
    for raiz, dirs, arqs in os.walk(destino):
        if ".git" in raiz.replace("\\", "/").split("/"):
            continue
        for n in list(dirs) + arqs:
            if n.startswith(NUNCA_EM_LUGAR_NENHUM):
                achados.append(os.path.relpath(os.path.join(raiz, n), destino))
    return sorted(set(achados))


def autoteste():
    import tempfile
    tmp = tempfile.mkdtemp()
    try:
        def toca(*partes):
            caminho = os.path.join(tmp, *partes)
            os.makedirs(os.path.dirname(caminho), exist_ok=True)
            open(caminho, "w").close()

        # motor limpo, com as pecas de exemplo: nao e vazamento
        toca("scripts", "buscar.py")
        toca("seed", "acervo", "ui", "kit-mapa", "item.json")
        toca(".git", "_lote_x.json")            # dentro de .git nao conta
        assert vazamentos(tmp) == [], vazamentos(tmp)

        toca("acervo", "ui", "peca-de-cliente", "item.json")
        assert vazamentos(tmp) == ["acervo"], vazamentos(tmp)

        toca("skills", "kit-buscar", "_lote_dzn.json")   # artefato em subpasta
        assert "skills/kit-buscar/_lote_dzn.json" in vazamentos(tmp), vazamentos(tmp)

        toca("sitekit.config.json")             # caminho absoluto da maquina
        assert "sitekit.config.json" in vazamentos(tmp), vazamentos(tmp)

        # frontmatter: os seis da spec passam, o resto derruba a instalacao la fora
        ok = ("---\nname: kit-x\ndescription: >\n  duas linhas\n  de descricao\n"
              "allowed-tools: Read Bash(python:*)\n---\n# corpo\n")
        assert frontmatter_fora_da_spec(ok) == [], frontmatter_fora_da_spec(ok)
        ruim = ok.replace("allowed-tools:", "argument-hint: [slug]\nallowed-tools:")
        assert frontmatter_fora_da_spec(ruim) == ["argument-hint"], frontmatter_fora_da_spec(ruim)
        assert frontmatter_fora_da_spec("# sem frontmatter") == ["sem frontmatter"]
        # description acima do teto tambem e erro duro la fora, e nao aparece
        # aqui: a skill continua funcionando na sua maquina ate alguem instalar
        longa = ok.replace("  de descricao\n", "".join("  " + "x" * 60 + "\n"
                                                       for _ in range(20)))
        fora = frontmatter_fora_da_spec(longa)
        assert len(fora) == 1 and "teto 1024" in fora[0], fora
        print("autoteste: ok")
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


# O que cada skill precisa carregar para rodar sozinha. Os instaladores de skill
# (npx skills add, e o que Codex/Gemini/Cursor usam) copiam a PASTA DA SKILL como
# unidade — o que estiver so na raiz do repo nao viaja com ela.
JUNTO = ("scripts", "references", "seed")


def autocontidas(destino):
    """Duplica o motor dentro de cada skill.

    Sim, sao N copias do mesmo Python. E de proposito: a alternativa e um
    mecanismo de resolucao que adivinha onde a raiz do repo foi parar em cada
    hospedeiro, e adivinhacao quebra em silencio. Copia e gerada por este
    script, nunca editada a mao — a fonte de verdade continua sendo uma so.
    """
    pasta = os.path.join(destino, "skills")
    if not os.path.isdir(pasta):
        return
    for skill in sorted(os.listdir(pasta)):
        alvo_skill = os.path.join(pasta, skill)
        if not os.path.isdir(alvo_skill):
            continue
        for nome in JUNTO:
            origem = os.path.join(REPO_LOCAL, nome)
            if not os.path.isdir(origem):
                continue
            alvo = os.path.join(alvo_skill, nome)
            # MESCLA, nao sobrescreve. Uma skill pode ter referencia PROPRIA na
            # mesma pasta (kit-otimizar-3d/references/patterns.md); um rmtree
            # aqui a apagaria em silencio, e o SKILL.md continuaria citando um
            # arquivo que nao existe mais.
            shutil.copytree(origem, alvo, ignore=IGNORA, dirs_exist_ok=True)
    print(f"  skills/*/ ← {', '.join(JUNTO)} (cada skill roda sozinha)")


# Os seis campos da spec do Agent Skills (agentskills.io). O Claude Code aceita
# muito mais — argument-hint, context: fork, model, hooks — mas quem instala com
# `npx skills add` no Codex, Gemini ou Cursor, e quem sobe para a Skills API,
# valida contra esta lista e **falha com erro duro**, nao ignora o campo extra.
# Um campo a mais aqui nao degrada: quebra a instalacao na maquina do outro.
CAMPOS_SPEC = {"name", "description", "license", "compatibility", "metadata",
               "allowed-tools"}
TETO_DESCRICAO = 1024   # limite da spec; passar disso e erro duro no `skills add`


def frontmatter_fora_da_spec(texto):
    """Chaves de primeiro nivel do frontmatter que a spec nao aceita."""
    if not texto.startswith("---\n"):
        return ["sem frontmatter"]
    fim = texto.find("\n---", 3)
    if fim < 0:
        return ["frontmatter nao fechado"]
    chaves = []
    for linha in texto[4:fim].split("\n"):
        if linha[:1] in (" ", "\t", "#", "") or ":" not in linha:
            continue          # continuacao de bloco, comentario, item de lista
        chaves.append(linha.split(":", 1)[0].strip())
    problemas = sorted(set(chaves) - CAMPOS_SPEC)
    n = len(" ".join(descricao(texto[4:fim]).split()))
    if n > TETO_DESCRICAO:
        problemas.append(f"description com {n} chars (teto {TETO_DESCRICAO})")
    return problemas


def descricao(fm):
    """O bloco `description: >` inteiro, dobrado nas linhas indentadas."""
    linhas, dentro, fora = [], False, []
    for linha in fm.split("\n"):
        if linha.startswith("description:"):
            dentro = True
            fora.append(linha.split(":", 1)[1].strip().lstrip(">|").strip())
        elif dentro and linha[:1] in (" ", "\t"):
            linhas.append(linha.strip())
        elif dentro:
            break
    return " ".join(fora + linhas)


def conferir_frontmatter(destino):
    """Cada SKILL.md exportado precisa caber na spec, senao nao instala fora daqui."""
    problemas = []
    pasta = os.path.join(destino, "skills")
    for skill in sorted(os.listdir(pasta) if os.path.isdir(pasta) else []):
        md = os.path.join(pasta, skill, "SKILL.md")
        if not os.path.isfile(md):
            continue
        with open(md, encoding="utf-8") as fh:
            fora = frontmatter_fora_da_spec(fh.read())
        if fora:
            problemas.append(f"skills/{skill}: {', '.join(fora)}")
    return problemas


def conferir_links(destino):
    """Cada SKILL.md so pode citar arquivo que viajou junto com ele.

    Existe porque ja aconteceu: copiar references/ da raiz por cima da pasta
    da skill apagou a referencia propria dela, e o SKILL.md seguiu citando um
    arquivo ausente sem nada reclamar.
    """
    import re
    quebrados = []
    pasta = os.path.join(destino, "skills")
    for skill in sorted(os.listdir(pasta) if os.path.isdir(pasta) else []):
        md = os.path.join(pasta, skill, "SKILL.md")
        if not os.path.isfile(md):
            continue
        with open(md, encoding="utf-8") as fh:
            texto = fh.read()
        for rel in set(re.findall(r"(?:references|scripts|seed)/[\w./-]+\.\w+", texto)):
            if not os.path.exists(os.path.join(pasta, skill, rel)):
                quebrados.append(f"skills/{skill}: {rel}")
    return sorted(quebrados)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--para", help="pasta de destino do repo público")
    ap.add_argument("--listar", action="store_true", help="mostra o que iria, sem copiar")
    ap.add_argument("--autoteste", action="store_true",
                    help="checa a rede de segurança contra vazamento")
    args = ap.parse_args()

    if args.autoteste:
        autoteste()
        return

    if not args.para:
        ap.error("--para é obrigatório (ou use --autoteste)")
    destino = os.path.abspath(os.path.expanduser(args.para))
    if os.path.abspath(REPO_LOCAL) == destino:
        sys.exit("destino é o próprio repositório de trabalho. Escolha outra pasta.")

    plano = [n for n in PUBLICO if os.path.exists(os.path.join(REPO_LOCAL, n))]
    faltando = [n for n in PUBLICO if n not in plano]

    if args.listar:
        print(f"iria para {destino}:")
        for n in plano:
            print(f"  {n}")
        if faltando:
            print("não existe aqui (será pulado): " + ", ".join(faltando))
        print("\nfica de fora sempre: " + ", ".join(NUNCA_NA_RAIZ + NUNCA_EM_LUGAR_NENHUM))
        print("(seed/acervo vai de propósito: são as peças de exemplo do cannonball)")
        return

    for nome in plano:
        origem = os.path.join(REPO_LOCAL, nome)
        alvo = os.path.join(destino, nome)
        if os.path.isdir(origem):
            shutil.rmtree(alvo, ignore_errors=True)
            shutil.copytree(origem, alvo, ignore=IGNORA)
        else:
            os.makedirs(destino, exist_ok=True)
            shutil.copy2(origem, alvo)
        print(f"  {nome}")

    autocontidas(destino)

    # Rede de seguranca: se algo proibido chegou la, e bug — grite antes do commit.
    vazou = vazamentos(destino)
    if vazou:
        sys.exit("VAZOU material privado para o destino:\n  " + "\n  ".join(vazou))

    quebrados = conferir_links(destino)
    if quebrados:
        sys.exit("SKILL.md citando arquivo que não existe no destino:\n  "
                 + "\n  ".join(quebrados))

    fora = conferir_frontmatter(destino)
    if fora:
        sys.exit("frontmatter fora da spec do Agent Skills — não instala em Codex,"
                 " Gemini nem Cursor:\n  " + "\n  ".join(fora)
                 + "\n  campos aceitos: " + ", ".join(sorted(CAMPOS_SPEC)))

    print(f"\nmotor exportado para {destino}")
    print("acervo NÃO copiado — ele é seu e fica aqui.")
    print("seed/ foi junto: são as peças de exemplo originais do cannonball.\n")
    print("para publicar a primeira vez:")
    print(f"  cd {destino}")
    print("  git init && git add -A")
    print('  git commit -m "cannonball: motor do acervo"')
    print("  gh repo create cannonball --public --source=. --push")


if __name__ == "__main__":
    main()
