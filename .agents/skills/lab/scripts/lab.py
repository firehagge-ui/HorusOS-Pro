#!/usr/bin/env python3
"""Instala e controla o Cannonball 3D Lab no diretório do usuário."""

from __future__ import annotations

import argparse
import json
import os
import shutil
import signal
import socket
import subprocess
import sys
import time
import urllib.error
import urllib.request
import webbrowser
from pathlib import Path


PORT = 5555
URL = f"http://localhost:{PORT}"
HEALTH_URL = f"{URL}/__cannonball_lab_health"
BRIDGE_PORT = int(os.environ.get("CANNONBALL_GENERATION_PORT", "4317"))
SKILL_DIR = Path(__file__).resolve().parent.parent
TEMPLATE_DIR = SKILL_DIR / "assets" / "cannonball-3d-lab"
CANNONBALL_DIR = Path(os.environ.get("CANNONBALL_LAB_HOME", Path.home() / ".cannonball")).expanduser().resolve()
STATE_DIR = CANNONBALL_DIR / "lab-runtime"
INSTALL_DIR = CANNONBALL_DIR / "3d-lab"
PID_PATH = STATE_DIR / "lab.pid"
LOG_PATH = STATE_DIR / "lab.log"


def node_version() -> tuple[int, int, int] | None:
    node = shutil.which("node")
    if not node:
        return None
    try:
        raw = subprocess.check_output([node, "--version"], text=True).strip().lstrip("v")
        parts = raw.split(".")
        return tuple(int(part) for part in parts[:3])  # type: ignore[return-value]
    except (OSError, subprocess.SubprocessError, ValueError):
        return None


def npm_command() -> str | None:
    return shutil.which("npm.cmd" if os.name == "nt" else "npm")


def http_ready() -> bool:
    try:
        with urllib.request.urlopen(HEALTH_URL, timeout=1.5) as response:
            payload = json.loads(response.read().decode("utf-8"))
            health_ok = response.status == 200 and payload.get("app") == "cannonball-3d-lab" and payload.get("status") == "ok"
        if not health_ok:
            return False
        with urllib.request.urlopen(URL, timeout=4) as response:
            page = response.read(8192).decode("utf-8", errors="ignore")
            return response.status == 200 and "Cannonball 3D Lab" in page
    except (OSError, ValueError, urllib.error.URLError):
        return False


def port_in_use(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as connection:
        connection.settimeout(0.5)
        return connection.connect_ex(("127.0.0.1", port)) == 0


def read_pid() -> int | None:
    try:
        return int(PID_PATH.read_text(encoding="utf-8").strip())
    except (OSError, ValueError):
        return None


def process_alive(pid: int | None) -> bool:
    if not pid:
        return False
    try:
        os.kill(pid, 0)
        return True
    except OSError:
        return False


def require_runtime() -> tuple[str, tuple[int, int, int]]:
    version = node_version()
    npm = npm_command()
    if version is None or npm is None:
        raise RuntimeError("Node.js e npm não foram encontrados. Instale Node.js 22.13 ou superior e execute /lab novamente.")
    if version < (22, 13, 0):
        found = ".".join(str(part) for part in version)
        raise RuntimeError(f"Node.js {found} não é compatível. Instale Node.js 22.13 ou superior.")
    return npm, version


def install(force: bool = False) -> bool:
    npm, version = require_runtime()
    if not TEMPLATE_DIR.joinpath("package.json").is_file():
        raise RuntimeError(f"O pacote do Lab não foi encontrado em {TEMPLATE_DIR}.")

    if force and INSTALL_DIR.exists():
        backup = STATE_DIR / f"backup-{int(time.time())}"
        STATE_DIR.mkdir(parents=True, exist_ok=True)
        shutil.move(str(INSTALL_DIR), str(backup))
        print(f"Instalação anterior preservada em {backup}")

    first_install = not INSTALL_DIR.exists()
    if first_install:
        INSTALL_DIR.parent.mkdir(parents=True, exist_ok=True)
        shutil.copytree(TEMPLATE_DIR, INSTALL_DIR)
        (INSTALL_DIR / "assets-3d").mkdir(exist_ok=True)
        print(f"Lab copiado para {INSTALL_DIR}")

    dependencies = INSTALL_DIR / "node_modules"
    if first_install or not dependencies.is_dir():
        print(f"Instalando dependências com Node.js {'.'.join(map(str, version))}…")
        subprocess.run([npm, "ci", "--no-audit", "--no-fund"], cwd=INSTALL_DIR, check=True)
    return first_install


def status() -> int:
    pid = read_pid()
    payload = {
        "installed": INSTALL_DIR.joinpath("package.json").is_file(),
        "running": http_ready(),
        "pid": pid if process_alive(pid) else None,
        "url": URL,
        "installDir": str(INSTALL_DIR),
        "log": str(LOG_PATH),
    }
    print(json.dumps(payload, ensure_ascii=False, indent=2))
    return 0 if payload["running"] else 1


def stop() -> int:
    pid = read_pid()
    if not process_alive(pid):
        PID_PATH.unlink(missing_ok=True)
        print("O Cannonball 3D Lab já está parado.")
        return 0
    try:
        if os.name == "nt":
            subprocess.run(["taskkill", "/PID", str(pid), "/T", "/F"], check=False)
        else:
            os.killpg(pid, signal.SIGTERM)
    finally:
        PID_PATH.unlink(missing_ok=True)
    print("Cannonball 3D Lab encerrado.")
    return 0


def start(open_browser: bool = True, reinstall: bool = False) -> int:
    if http_ready():
        print(f"Cannonball 3D Lab já está aberto em {URL}")
        if open_browser:
            webbrowser.open(URL)
        return 0
    if port_in_use(PORT):
        raise RuntimeError(f"A porta {PORT} já está sendo usada por outro processo. Libere-a e execute /lab novamente.")
    if port_in_use(BRIDGE_PORT):
        raise RuntimeError(f"A porta interna {BRIDGE_PORT} já está sendo usada por outro processo. Encerre a outra instância do Lab e execute /lab novamente.")

    install(force=reinstall)
    npm, _ = require_runtime()
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    environment = os.environ.copy()
    environment["CANNONBALL_LAB_PORT"] = str(PORT)
    environment["CANNONBALL_GENERATION_PORT"] = str(BRIDGE_PORT)
    environment.setdefault("WRANGLER_LOG_PATH", ".wrangler/wrangler.log")
    flags: dict[str, object] = {}
    if os.name == "nt":
        flags["creationflags"] = subprocess.CREATE_NEW_PROCESS_GROUP | subprocess.DETACHED_PROCESS
    else:
        flags["start_new_session"] = True

    with LOG_PATH.open("a", encoding="utf-8") as log:
        log.write(f"\n--- início {time.strftime('%Y-%m-%d %H:%M:%S')} ---\n")
        process = subprocess.Popen(
            [npm, "run", "dev"],
            cwd=INSTALL_DIR,
            env=environment,
            stdin=subprocess.DEVNULL,
            stdout=log,
            stderr=subprocess.STDOUT,
            **flags,
        )
    PID_PATH.write_text(f"{process.pid}\n", encoding="utf-8")

    deadline = time.monotonic() + 120
    while time.monotonic() < deadline:
        if process.poll() is not None:
            raise RuntimeError(f"O Lab encerrou durante a inicialização. Consulte {LOG_PATH}.")
        if http_ready():
            print(f"Cannonball 3D Lab aberto em {URL}")
            print(f"Instalação: {INSTALL_DIR}")
            print(f"Logs: {LOG_PATH}")
            if open_browser:
                webbrowser.open(URL)
            return 0
        time.sleep(1)
    raise RuntimeError(f"O Lab não respondeu em {URL} dentro de 120 segundos. Consulte {LOG_PATH}.")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Instala e abre o Cannonball 3D Lab em localhost:5555")
    parser.add_argument("action", nargs="?", choices=("start", "status", "stop", "install"), default="start")
    parser.add_argument("--sem-navegador", action="store_true", help="inicia sem abrir o navegador")
    parser.add_argument("--reinstalar", action="store_true", help="preserva a instalação anterior e instala novamente")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        if args.action == "status":
            return status()
        if args.action == "stop":
            return stop()
        if args.action == "install":
            install(force=args.reinstalar)
            print(f"Cannonball 3D Lab instalado em {INSTALL_DIR}")
            return 0
        return start(open_browser=not args.sem_navegador, reinstall=args.reinstalar)
    except (RuntimeError, OSError, subprocess.CalledProcessError) as error:
        print(f"Erro: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
