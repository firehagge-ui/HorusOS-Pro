#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "$0")/.." && pwd)"
target="$project_root/.local-models/stable-fast-3d"

if [[ "${1:-}" != "--install" ]]; then
  echo "Este instalador prepara o Stable Fast 3D local."
  echo "Reserve aproximadamente 15 GB livres e leia a licença antes de continuar:"
  echo "https://github.com/Stability-AI/stable-fast-3d"
  echo
  echo "Para instalar conscientemente: npm run setup:sf3d -- --install"
  exit 0
fi

available_kb="$(df -Pk "$project_root" | awk 'NR==2 {print $4}')"
if [[ "$available_kb" -lt 15728640 ]]; then
  echo "São necessários pelo menos 15 GB livres para ambiente, dependências e pesos."
  exit 1
fi

command -v git >/dev/null || { echo "git não encontrado"; exit 1; }
command -v uv >/dev/null || { echo "uv não encontrado"; exit 1; }

mkdir -p "$(dirname "$target")"
if [[ ! -e "$target/.git" ]]; then
  if [[ -e "$target" ]]; then
    echo "O destino existe, mas não é uma instalação reconhecida: $target"
    exit 1
  fi
  git clone --depth 1 https://github.com/Stability-AI/stable-fast-3d.git "$target"
else
  echo "Retomando a instalação existente em $target"
fi

if [[ ! -x "$target/.venv/bin/python" ]]; then
  uv venv --python 3.11 "$target/.venv"
fi

# Em macOS recente, o PyTorch atual inclui correções para o clang/Apple Silicon.
uv pip install --python "$target/.venv/bin/python" --upgrade torch torchvision
uv pip install --python "$target/.venv/bin/python" setuptools==69.5.1 wheel ninja
(
  cd "$target"
  # texture_baker e uv_unwrapper importam torch durante o build.
  uv pip install --python .venv/bin/python --no-build-isolation -r requirements.txt
)

echo
echo "Instalação base concluída. Os pesos são obtidos pelo repositório oficial na primeira geração."
echo "Se solicitado, aceite a licença do modelo no Hugging Face e autentique-se localmente."
echo "Reinicie o laboratório para detectar o backend."
