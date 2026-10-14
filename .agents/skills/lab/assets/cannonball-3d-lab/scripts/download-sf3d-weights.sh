#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "$0")/.." && pwd)"
target="$project_root/.local-models/stable-fast-3d"
python="$target/.venv/bin/python"
hf_cli="$target/.venv/bin/huggingface-cli"
export HF_HOME="$target/.hf-cache"

if [[ ! -x "$python" || ! -x "$hf_cli" ]]; then
  echo "Instale primeiro o backend com: npm run setup:sf3d -- --install"
  exit 1
fi

echo "Antes de continuar, aceite a licença gratuita em:"
echo "https://huggingface.co/stabilityai/stable-fast-3d"
echo
echo "A autenticação acontece diretamente no Hugging Face; o laboratório não lê o token."
"$hf_cli" login

(
  cd "$target"
  "$python" -c 'from sf3d.system import SF3D; SF3D.from_pretrained("stabilityai/stable-fast-3d", config_name="config.yaml", weight_name="model.safetensors"); print("Pesos validados.")'
)
touch "$target/.weights-ready"
echo "Stable Fast 3D está pronto para uso local. Reinicie o laboratório."
