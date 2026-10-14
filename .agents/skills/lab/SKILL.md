---
name: lab
description: Instala, inicia, abre, verifica ou encerra o Cannonball 3D Lab local. Use quando o usuário invocar /lab ou pedir para abrir o laboratório 3D do Cannonball em localhost:5555.
allowed-tools: Bash(python3:*)
---

# Cannonball 3D Lab

Use o launcher que acompanha esta skill. Resolva `SKILL_DIR` como o caminho absoluto
da pasta que contém este `SKILL.md`; não presuma onde o plugin foi instalado.

## `/lab`

Quando a solicitação for somente `/lab`, execute imediatamente:

```bash
python3 "${SKILL_DIR}/scripts/lab.py"
```

Esse comando é idempotente: na primeira execução copia o aplicativo para
`~/.cannonball/3d-lab`, instala as dependências e inicia os serviços; nas seguintes,
reutiliza a instalação e abre `http://localhost:5555`. A invocação explícita `/lab`
é autorização para criar essa pasta e instalar as dependências npm dentro dela.

Não peça caminho, porta ou confirmação adicional. Não altere a porta: `5555` faz
parte do contrato do Lab. Informe o endereço ou o erro concreto devolvido pelo
launcher. Nunca exponha o servidor além de `127.0.0.1`.

## Operações adicionais

Use somente quando o usuário pedir expressamente:

```bash
python3 "${SKILL_DIR}/scripts/lab.py" status
python3 "${SKILL_DIR}/scripts/lab.py" stop
python3 "${SKILL_DIR}/scripts/lab.py" install
python3 "${SKILL_DIR}/scripts/lab.py" start --reinstalar
```

Uma reinstalação preserva a pasta anterior como backup. O pacote não inclui corpus,
pesos do SF3D, outputs, caches ou credenciais; esses dados permanecem locais e fora
da skill.
