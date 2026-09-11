#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Preview visual da peca. O acervo sempre guardou texto e codigo e nunca imagem —
e escolher entre duas pecas parecidas custava abrir arquivo.

    python scripts/capturar.py <id>          # uma peca
    python scripts/capturar.py --tudo        # todas as que rodam sozinhas
    python scripts/capturar.py --tudo --n 20
    python scripts/capturar.py --autoteste   # checa o validador de captura

Fora do acervo, para verificar a pagina que voce acabou de construir:

    python scripts/capturar.py --url http://localhost:3000 --viewport 390x844 \
      --saida /tmp/mobile.png

Grava `preview.png` ao lado do item.json. O indexar.py acha o sidecar sozinho.

So captura peca que roda sem build: familia html, e animacao/template com um
index.html dentro. Componente React solto precisaria de harness e fica de fora.

Sem dependencia: usa o Chrome que ja esta na maquina, em headless. Aponte outro
com CANNONBALL_CHROME.
"""

import argparse
import contextlib
import functools
import http.server
import os
import re
import shutil
import struct
import subprocess
import sys
import tempfile
import threading
import time
import zlib

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from caminhos import RAIZ, exigir_indice, saida_utf8  # noqa: E402

saida_utf8()

LARGURA, ALTURA = 1280, 720
LIMITE_S = 25          # teto por peça; o Chrome nao sai sozinho, ver capturar()

CHROMES = (
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "google-chrome", "chromium", "chromium-browser",
)


def achar_chrome():
    forcado = os.environ.get("CANNONBALL_CHROME")
    if forcado:
        return forcado
    for c in CHROMES:
        if os.path.isabs(c):
            if os.path.exists(c):
                return c
        elif shutil.which(c):
            return shutil.which(c)
    return None


def ler_png(caminho):
    """Decodifica PNG com a stdlib. So o que basta para julgar a captura."""
    dados = open(caminho, "rb").read()
    i, idat, w, h, bits, cor = 8, b"", None, None, None, None
    while i < len(dados):
        n = struct.unpack(">I", dados[i:i + 4])[0]
        tipo, bloco = dados[i + 4:i + 8], dados[i + 8:i + 8 + n]
        if tipo == b"IHDR":
            w, h, bits, cor = struct.unpack(">IIBB", bloco[:10])
        elif tipo == b"IDAT":
            idat += bloco
        elif tipo == b"IEND":
            break
        i += 12 + n
    canais = {0: 1, 2: 3, 3: 1, 4: 2, 6: 4}[cor]
    bpp = canais * bits // 8
    raw = zlib.decompress(idat)
    largura_linha = w * bpp
    linhas, anterior, p = [], bytearray(largura_linha), 0
    for _ in range(h):
        filtro = raw[p]; p += 1
        atual = bytearray(raw[p:p + largura_linha]); p += largura_linha
        for x in range(largura_linha):
            a = atual[x - bpp] if x >= bpp else 0
            b = anterior[x]
            c = anterior[x - bpp] if x >= bpp else 0
            if filtro == 1:
                atual[x] = (atual[x] + a) & 255
            elif filtro == 2:
                atual[x] = (atual[x] + b) & 255
            elif filtro == 3:
                atual[x] = (atual[x] + (a + b) // 2) & 255
            elif filtro == 4:
                pa, pb, pc = abs(b - c), abs(a - c), abs(a + b - 2 * c)
                pr = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                atual[x] = (atual[x] + pr) & 255
        linhas.append(bytes(atual)); anterior = atual
    return w, h, canais, linhas


def julgar(caminho):
    """A captura serve? Devolve (ok, motivo, medidas).

    Um PNG valido nao prova nada: canvas WebGL que nao inicializou, pagina que
    nao carregou e loader que nunca saiu produzem imagem perfeita e inutil. O
    que separa e variedade de cor, nao tamanho de arquivo.

    Medido nesta maquina: Chrome headless no macOS captura WebGL certo
    (vermelho puro num canvas de teste). No Linux, sem GPU e sem SwiftShader
    configurado, a mesma captura sai preta e nada avisa — por isso o julgamento
    roda sempre, nao so quando se desconfia.
    """
    w, h, canais, linhas = ler_png(caminho)
    cores, soma, n = set(), 0, 0
    passo_y, passo_x = max(1, h // 60), max(1, w // 60)
    for y in range(0, h, passo_y):
        linha = linhas[y]
        for x in range(0, w, passo_x):
            p = x * canais
            rgb = tuple(linha[p:p + 3]) if canais >= 3 else (linha[p],) * 3
            cores.add(rgb); soma += sum(rgb); n += 3
    medidas = {"dim": f"{w}x{h}", "cores": len(cores), "brilho": round(soma / n, 1)}
    if len(cores) < 4:
        return False, "quase sem variação de cor — página em branco ou canvas morto", medidas
    if medidas["brilho"] < 6:
        return False, "praticamente preta — canvas que não inicializou", medidas
    return True, "", medidas


# Frase canonica que so aparece quando a inicializacao falhou. Tem que ser
# especifica: "webgl" solto casa com titulo de secao e com comentario de codigo.
AVISOS = (
    "webgl is not supported", "webgl não é suportado", "webgl nao e suportado",
    "does not support webgl", "webgl is not available",
    "error creating webgl context", "failed to create webgl context",
    "unable to initialize webgl", "webgpu is not available",
    "no webgpu adapter", "seu navegador não suporta",
)

SEM_TEXTO = ("script", "noscript", "template", "style")


def erro_na_pagina(dom):
    """O pixel passou, mas a página está gritando que falhou. Devolve o motivo.

    O screenshot volta com sucesso mesmo quando o render morreu: o Chrome grava
    o cartaz de erro com o mesmo zelo com que gravaria a cena. E cartaz costuma
    ser colorido — passa folgado na variação de cor. Por isso o pixel é a
    asserção de registro e esta checagem é o veto que vem depois dele.

    Descobrimento emprestado do `agent-browser-webgpu` do vgpu (vercel-labs,
    MIT), que faz o mesmo por fora com grep no innerText.

    O `<noscript>` e o `<template>` saem antes da busca: quase toda cena three.js
    carrega o cartaz de aviso já escrito no HTML e só o revela quando falha —
    procurar no markup cru acusaria toda peça bem-comportada.
    """
    texto = dom
    for tag in SEM_TEXTO:
        texto = re.sub(rf"<{tag}\b.*?</{tag}\s*>", " ", texto,
                       flags=re.DOTALL | re.IGNORECASE)
    texto = re.sub(r"<!--.*?-->", " ", texto, flags=re.DOTALL)
    texto = re.sub(r"<[^>]+>", " ", texto).lower()
    for frase in AVISOS:
        if frase in texto:
            return f"a página renderizou um aviso de falha: “{frase}”"
    return None


def html_da_peca(item):
    caminho = os.path.join(RAIZ, item["caminho"].replace("/", os.sep))
    if caminho.lower().endswith((".html", ".htm")):
        return caminho
    pasta = caminho if os.path.isdir(caminho) else os.path.dirname(caminho)
    for raiz, _, arquivos in os.walk(pasta):
        for f in arquivos:
            if f.lower() in ("index.html", "index.htm"):
                return os.path.join(raiz, f)
    return None


def precisa_build(html):
    """O index.html e casca de SPA, e por file:// nunca vai renderizar nada.

    Vite e Next entregam um `<div id="root">` vazio mais um `<script type=module>`
    que so um dev server resolve. Capturar isso devolve pagina em branco, e o
    julgamento diria "canvas morto" — diagnostico errado para o problema certo.
    Os dois sinais juntos, porque nenhum sozinho basta: demo standalone tambem
    pode ter package.json, e pagina real tambem pode usar modulo.
    """
    pasta = os.path.dirname(os.path.abspath(html))
    tem_pkg = any(os.path.exists(os.path.join(d, "package.json"))
                  for d in (pasta, os.path.dirname(pasta)))
    if not tem_pkg:
        return False
    try:
        with open(html, encoding="utf-8", errors="replace") as fh:
            texto = fh.read()
    except OSError:
        return False
    corpo = texto[texto.find("<body"):] if "<body" in texto else texto
    return len(corpo) < 400 and 'type="module"' in texto


@contextlib.contextmanager
def servido(pasta):
    """Serve a pasta em HTTP e devolve a base da URL.

    Nao e luxo: peca copiada de projeto real referencia asset por caminho
    ABSOLUTO (`/styles.css`, `/logo.svg`). Por file:// a barra inicial aponta
    para a raiz do disco, o CSS nunca carrega, e a captura sai sem estilo — que
    o julgamento acusa como "pagina em branco", diagnostico certo pelo motivo
    errado. Servida, a mesma peca renderiza.
    """
    class Silencioso(http.server.SimpleHTTPRequestHandler):
        # sem isto, cada 404 de asset ausente entra no meio do relatorio; e a
        # peca normalmente NAO tem os assets, que ficam no projeto de origem
        def log_message(self, *a):
            pass

    handler = functools.partial(Silencioso, directory=pasta)
    servidor = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    thread = threading.Thread(target=servidor.serve_forever, daemon=True)
    thread.start()
    try:
        yield f"http://127.0.0.1:{servidor.server_address[1]}"
    finally:
        servidor.shutdown()
        servidor.server_close()


def endereco(alvo):
    """Aceita caminho de arquivo ou URL. Chrome engole os dois, o file:// e nosso."""
    if alvo.startswith(("http://", "https://", "file://")):
        return alvo
    return "file://" + os.path.abspath(alvo)


def capturar(chrome, html, destino, espera_ms, tamanho=None):
    """Espera o ARQUIVO, nao o processo.

    O Chrome headless grava o screenshot e depois nao sai: com uma pagina que
    tem rAF rodando ou requisicao remota pendurada, ele fica vivo indefinidamente
    e um subprocess.run() com timeout mata a captura que ja estava pronta no
    disco. Medido: a peca `automotive-ai` gravou um PNG bom de 1160 cores e o
    processo continuou de pe ate os 45s do timeout.

    O `--virtual-time-budget` nao e so espera: ele adianta um relogio VIRTUAL,
    entao duas capturas da mesma peca caem no mesmo instante da animacao e sao
    comparaveis. Peca que le `Date.now()` ou `Math.random()` sem semente escapa
    disso e cada captura sai diferente — nao da para versionar preview dela.

    O `--dump-dom` sai de graca na mesma execucao (medido: o DOM impresso ja tem
    o que o script injetou) e alimenta o `erro_na_pagina`.
    """
    tmp = tempfile.mkdtemp()
    try:
        saida = os.path.join(tmp, "shot.png")
        dom = os.path.join(tmp, "dom.html")
        fdom = open(dom, "wb")
        proc = subprocess.Popen(
            [chrome, "--headless=new", "--hide-scrollbars", "--disable-gpu-sandbox",
             "--no-first-run", "--disable-background-networking", "--disable-extensions",
             f"--screenshot={saida}", "--dump-dom",
             "--window-size=%d,%d" % (tamanho or (LARGURA, ALTURA)),
             f"--virtual-time-budget={espera_ms}",
             f"--user-data-dir={os.path.join(tmp, 'perfil')}",
             endereco(html)],
            stdout=fdom, stderr=subprocess.DEVNULL,
        )
        fdom.close()   # o Chrome ja ficou com o descritor duplicado
        try:
            limite = time.time() + LIMITE_S
            anterior = -1
            while time.time() < limite:
                time.sleep(0.4)
                if os.path.exists(saida):
                    atual = os.path.getsize(saida)
                    if atual > 0 and atual == anterior:
                        break        # tamanho parou de crescer: terminou de gravar
                    anterior = atual
                elif proc.poll() is not None:
                    break            # morreu sem gravar nada
        finally:
            proc.kill()
            proc.wait(timeout=10)
        if not os.path.exists(saida) or os.path.getsize(saida) == 0:
            return False, f"o Chrome não gerou captura em {LIMITE_S}s", {}
        ok, motivo, medidas = julgar(saida)
        if ok and os.path.exists(dom):
            with open(dom, encoding="utf-8", errors="replace") as fh:
                aviso = erro_na_pagina(fh.read())
            if aviso:
                return False, aviso, medidas
        if ok:
            shutil.move(saida, destino)
        return ok, motivo, medidas
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def autoteste():
    """Um PNG valido pode ser inutil. O validador precisa saber a diferenca."""
    def png(pixels, w, h):
        cru = b"".join(b"\x00" + bytes(pixels[y]) for y in range(h))
        def bloco(t, d):
            return (struct.pack(">I", len(d)) + t + d
                    + struct.pack(">I", zlib.crc32(t + d) & 0xFFFFFFFF))
        return (b"\x89PNG\r\n\x1a\n"
                + bloco(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0))
                + bloco(b"IDAT", zlib.compress(cru)) + bloco(b"IEND", b""))

    tmp = tempfile.mkdtemp()
    try:
        def grava(nome, pixels, w, h):
            caminho = os.path.join(tmp, nome)
            open(caminho, "wb").write(png(pixels, w, h))
            return caminho

        preta = grava("preta.png", [[0] * 30 for _ in range(10)], 10, 10)
        ok, _, _ = julgar(preta)
        assert not ok, "preto chapado tinha que ser recusado"

        # escura mas com variação: passa no teste de cor e ainda assim não serve.
        # É o caso real do canvas que renderizou lixo escuro em vez de nada.
        escura = grava("escura.png", [[(x + y) % 6 for x in range(30)]
                                      for y in range(10)], 10, 10)
        ok, motivo, _ = julgar(escura)
        assert not ok and "preta" in motivo, (ok, motivo)

        branca = grava("branca.png", [[255] * 30 for _ in range(10)], 10, 10)
        ok, motivo, _ = julgar(branca)
        assert not ok and "variação" in motivo, (ok, motivo)

        # casca de SPA: nao adianta capturar, e o motivo tem que ser esse
        casca = os.path.join(tmp, "casca")
        os.makedirs(casca, exist_ok=True)
        open(os.path.join(casca, "package.json"), "w").write("{}")
        shell = os.path.join(casca, "index.html")
        open(shell, "w").write('<!doctype html><body><div id="root"></div>'
                               '<script type="module" src="/src/main.tsx"></script></body>')
        assert precisa_build(shell), "casca de SPA passou batido"
        pagina = os.path.join(casca, "real.html")
        open(pagina, "w").write("<!doctype html><body>" + "<p>conteúdo real</p>" * 40
                                + '<script type="module" src="./a.js"></script></body>')
        assert not precisa_build(pagina), "página de verdade tratada como casca"

        variada = grava("ok.png", [[(x * 7 + y * 13) % 256 for x in range(30)]
                                   for y in range(10)], 10, 10)
        ok, motivo, medidas = julgar(variada)
        assert ok, (motivo, medidas)
        assert medidas["dim"] == "10x10", medidas

        # o cartaz de erro passa no pixel — colorido, variado — e so o DOM pega
        cartaz = ('<body style="background:#c00"><h1>WebGL is not supported '
                  'on this device</h1></body>')
        assert erro_na_pagina(cartaz), "cartaz de erro passou batido"
        # e o fallback que toda cena three.js carrega escrito e nunca revela
        escondido = ('<body><canvas></canvas>'
                     '<noscript>Your browser does not support WebGL</noscript>'
                     '<template id="aviso">WebGL is not available</template>'
                     '<script>// unable to initialize webgl -> mostra o aviso</script>'
                     '</body>')
        assert erro_na_pagina(escondido) is None, "peça boa recusada pelo fallback"
        print("autoteste: ok")
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("id", nargs="?", help="id da peça")
    ap.add_argument("--tudo", action="store_true", help="todas as que rodam sozinhas")
    ap.add_argument("--n", type=int, default=0, help="limite com --tudo")
    ap.add_argument("--refazer", action="store_true", help="recaptura quem já tem preview")
    ap.add_argument("--espera", type=int, default=4000, help="ms de tempo virtual antes do clique")
    ap.add_argument("--url", help="captura um arquivo ou URL avulsa, fora do acervo")
    ap.add_argument("--saida", help="onde gravar o PNG, com --url")
    ap.add_argument("--viewport", default=f"{LARGURA}x{ALTURA}", help="LxA, ex 390x844")
    ap.add_argument("--autoteste", action="store_true")
    args = ap.parse_args()

    if args.autoteste:
        autoteste()
        return

    chrome = achar_chrome()
    if not chrome:
        sys.exit("Chrome não encontrado. Instale, ou aponte com CANNONBALL_CHROME=<caminho>.")

    try:
        tamanho = tuple(int(v) for v in args.viewport.lower().split("x"))
        assert len(tamanho) == 2
    except Exception:
        sys.exit(f"--viewport inválido: {args.viewport} (use LxA, ex 1440x900)")

    # Fora do acervo: a pagina que a kit-montar acabou de construir, para o
    # passo 7.9 poder olhar o RENDER em vez de julgar pelo codigo.
    if args.url:
        destino = os.path.abspath(args.saida or "captura.png")
        ok, motivo, medidas = capturar(chrome, args.url, destino, args.espera, tamanho)
        if ok:
            print(f"ok  {destino}  {medidas['dim']}  {medidas['cores']} cores")
        else:
            sys.exit(f"RECUSADA: {motivo}  {medidas}")
        return

    itens = exigir_indice()
    if args.id:
        alvos = [i for i in itens if i["id"] == args.id]
        if not alvos:
            sys.exit(f"peça '{args.id}' não está no índice")
    elif args.tudo:
        alvos = itens
    else:
        sys.exit("passe um id, ou --tudo")

    feitos = recusados = pulados = sem_build = 0
    for item in alvos:
        html = html_da_peca(item)
        if not html:
            if args.id:
                sys.exit(f"{item['id']}: não roda sozinha (sem HTML). "
                         "Componente React precisa de build — fora do alcance daqui.")
            continue
        destino = os.path.join(os.path.dirname(html), "..", "preview.png")
        pasta_ficha = os.path.dirname(os.path.join(RAIZ, item["caminho"].replace("/", os.sep)))
        if not os.path.isdir(pasta_ficha):
            continue
        destino = os.path.join(pasta_ficha, "preview.png")
        if os.path.exists(destino) and not args.refazer:
            pulados += 1
            continue
        if precisa_build(html):
            sem_build += 1
            if args.id:
                sys.exit(f"{item['id']}: o index.html é casca de SPA (Vite/Next) — "
                         "precisa de `npm run build` e de um servidor. Suba o preview "
                         "e use --url http://localhost:...")
            continue
        pasta_html = os.path.dirname(os.path.abspath(html))
        with servido(pasta_html) as base:
            alvo = f"{base}/{os.path.basename(html)}"
            ok, motivo, medidas = capturar(chrome, alvo, destino, args.espera, tamanho)
        if ok:
            feitos += 1
            print(f"  ok      {item['id']:32s} {medidas['cores']} cores")
        else:
            recusados += 1
            print(f"  RECUSA  {item['id']:32s} {motivo}")
        if args.n and feitos + recusados >= args.n:
            break

    print(f"\ncapturadas: {feitos}   recusadas: {recusados}   já tinham: {pulados}"
          f"   precisam de build: {sem_build}")
    if feitos:
        print("rode agora: python scripts/indexar.py")


if __name__ == "__main__":
    main()
