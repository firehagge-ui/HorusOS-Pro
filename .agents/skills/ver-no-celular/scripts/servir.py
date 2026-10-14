#!/usr/bin/env python3
"""
Serve uma pasta de site estático na rede local, para abrir no celular.

Uso:
    python servir.py <diretorio> [--porta 8000]   # inicia o servidor (bloqueia)
    python servir.py --status                      # mostra o preview em andamento
    python servir.py --parar                        # encerra o preview em andamento

Projetado para ser iniciado em segundo plano: imprime a URL nas primeiras linhas
e só depois passa a servir, então quem chamou consegue ler o endereço na hora.
"""
import sys
import os
import json
import socket
import functools
import tempfile
import subprocess
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

ESTADO = os.path.join(tempfile.gettempdir(), "horus_preview.json")


def ip_da_rede():
    """IPv4 da máquina na LAN (o endereço que o celular usa). Sem enviar pacote."""
    ip = None
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = None
    finally:
        s.close()
    if not ip or ip.startswith("127."):
        try:
            ip = socket.gethostbyname(socket.gethostname())
        except Exception:
            ip = None
    return ip


def porta_livre(inicio):
    for p in range(inicio, inicio + 60):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(("0.0.0.0", p))
                return p
            except OSError:
                continue
    return inicio


def ler_estado():
    try:
        with open(ESTADO, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return None


def parar():
    est = ler_estado()
    if not est:
        print("Nenhum preview em andamento (nenhum estado encontrado).")
        return 0
    pid = est.get("pid")
    ok = False
    if pid:
        try:
            if os.name == "nt":
                subprocess.run(["taskkill", "/F", "/PID", str(pid)],
                               capture_output=True)
            else:
                os.kill(pid, 15)
            ok = True
        except Exception as e:
            print(f"Não consegui encerrar o processo {pid}: {e}")
    try:
        os.remove(ESTADO)
    except Exception:
        pass
    print(f"Preview encerrado (porta {est.get('porta')})." if ok
          else "Estado removido, mas confira se o processo ainda roda.")
    return 0


def status():
    est = ler_estado()
    if not est:
        print("Nenhum preview em andamento.")
        return 0
    print(json.dumps(est, ensure_ascii=False, indent=2))
    return 0


def servir(diretorio, porta_pedida):
    diretorio = os.path.abspath(diretorio)
    if not os.path.isdir(diretorio):
        print(f"ERRO: pasta não existe: {diretorio}")
        return 2
    tem_index = os.path.isfile(os.path.join(diretorio, "index.html"))

    porta = porta_livre(porta_pedida)
    ip = ip_da_rede()
    url_lan = f"http://{ip}:{porta}/" if ip else None
    url_local = f"http://127.0.0.1:{porta}/"

    # imprime PRIMEIRO, antes de bloquear servindo
    print("=" * 56)
    print("  PREVIEW NO CELULAR — servindo o site na rede local")
    print("=" * 56)
    print(f"  Pasta:      {diretorio}")
    if not tem_index:
        print("  AVISO: não achei index.html aqui; a raiz vai listar arquivos.")
    if url_lan:
        print(f"  NO CELULAR: {url_lan}")
    else:
        print("  NO CELULAR: [não achei o IP da rede — veja o ipconfig]")
    print(f"  No PC:      {url_local}")
    print("-" * 56)
    print("  Regras: celular e PC na MESMA rede WiFi.")
    print("  Se o Windows perguntar do firewall, permitir em rede PRIVADA.")
    print("  Parar:  python servir.py --parar")
    print("=" * 56, flush=True)

    with open(ESTADO, "w", encoding="utf-8") as f:
        json.dump({
            "pid": os.getpid(),
            "porta": porta,
            "ip": ip,
            "url": url_lan or url_local,
            "url_local": url_local,
            "pasta": diretorio,
        }, f, ensure_ascii=False)

    handler = functools.partial(SimpleHTTPRequestHandler, directory=diretorio)
    httpd = ThreadingHTTPServer(("0.0.0.0", porta), handler)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        httpd.server_close()
        try:
            os.remove(ESTADO)
        except Exception:
            pass
    return 0


def main(argv):
    if "--parar" in argv:
        return parar()
    if "--status" in argv:
        return status()
    args = [a for a in argv if not a.startswith("--")]
    if not args:
        print(__doc__)
        return 1
    diretorio = args[0]
    porta = 8000
    if "--porta" in argv:
        try:
            porta = int(argv[argv.index("--porta") + 1])
        except Exception:
            pass
    return servir(diretorio, porta)


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
