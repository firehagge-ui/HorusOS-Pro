#!/usr/bin/env python3
"""Instala os binários oficiais KTX/toktx localmente, sem privilégios de admin."""

from __future__ import annotations

import argparse
import json
import platform
import shutil
import subprocess
import tempfile
import urllib.request
from pathlib import Path

VERSION = "4.4.2"
REPOSITORY = "https://github.com/KhronosGroup/KTX-Software"


def default_destination() -> Path:
    return Path.cwd() / ".local-tools" / "ktx-software" / VERSION


def status(destination: Path) -> dict[str, object]:
    binary = destination / "bin" / ("toktx.exe" if platform.system() == "Windows" else "toktx")
    version = None
    if binary.is_file():
        result = subprocess.run([str(binary), "--version"], capture_output=True, text=True, check=False)
        version = (result.stdout or result.stderr).strip() if result.returncode == 0 else None
    return {
        "platform": platform.system().lower(),
        "architecture": platform.machine().lower(),
        "destination": str(destination.resolve()),
        "installed": bool(version),
        "version": version,
        "toktx": str(binary.resolve()),
    }


def copy_payload(source: Path, destination: Path) -> None:
    for folder in ("bin", "lib"):
        payload = source / "usr" / "local" / folder
        if payload.exists():
            shutil.copytree(payload, destination / folder, dirs_exist_ok=True)
    for binary in (destination / "bin").glob("*"):
        binary.chmod(binary.stat().st_mode | 0o111)


def install_macos(destination: Path) -> None:
    architecture = platform.machine().lower()
    if architecture not in {"arm64", "x86_64"}:
        raise RuntimeError(f"Arquitetura macOS ainda não suportada: {architecture}")
    asset = f"KTX-Software-{VERSION}-Darwin-{architecture}.pkg"
    url = f"{REPOSITORY}/releases/download/v{VERSION}/{asset}"
    with tempfile.TemporaryDirectory(prefix="cannonball-ktx-") as temporary:
        root = Path(temporary)
        package = root / asset
        urllib.request.urlretrieve(url, package)
        signature = subprocess.run(["pkgutil", "--check-signature", str(package)], capture_output=True, text=True, check=False)
        if signature.returncode != 0 or "The Khronos Group" not in signature.stdout or "trusted by the Apple notary service" not in signature.stdout:
            raise RuntimeError("A assinatura/notarização do pacote Khronos não pôde ser confirmada")
        expanded = root / "expanded"
        subprocess.run(["pkgutil", "--expand-full", str(package), str(expanded)], check=True)
        tools = next(expanded.glob("*-tools.pkg/Payload"), None)
        library = next(expanded.glob("*-library.pkg/Payload"), None)
        if not tools or not library:
            raise RuntimeError("O pacote oficial não contém os payloads esperados")
        copy_payload(tools, destination)
        copy_payload(library, destination)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--destino", type=Path, default=default_destination())
    parser.add_argument("--status", action="store_true")
    parser.add_argument("--instalar", action="store_true")
    parser.add_argument("--confirmar-download", action="store_true")
    args = parser.parse_args()
    destination = args.destino.expanduser().resolve()
    if args.instalar:
        if not args.confirmar_download:
            raise SystemExit("Use --confirmar-download para autorizar o download e a instalação local.")
        if platform.system() != "Darwin":
            raise SystemExit("Instalação automática disponível apenas para macOS; use o release oficial da Khronos neste sistema.")
        destination.mkdir(parents=True, exist_ok=True)
        install_macos(destination)
    print(json.dumps(status(destination), indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
