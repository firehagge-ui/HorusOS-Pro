---
name: ver-no-celular
description: Serve um site estático feito no PC para o Marcelo abrir no celular, pela mesma rede WiFi (com túnel opcional para acesso de qualquer lugar). Use quando ele disser "ver no celular", "abrir no celular", "testar no telefone", "preview no celular", "quero ver isso no meu telefone", "/ver-no-celular", ou logo depois de montar/ajustar um site, para ele revisar no aparelho antes de aprovar. Serve pra qualquer site local da casa (clientes/<nome>/site, site/, portfolio/*).
---

# Ver no celular

Site montado aqui é arquivo local no PC. O celular não enxerga `file://` do PC. Esta
skill sobe um servidorzinho na **rede local** e devolve um endereço `http://IP:porta`
que o celular abre no navegador. É a forma de revisar no aparelho de verdade, porque
detector e print no PC não pegam o que só aparece num toque de dedo real.

## Antes de qualquer comando: resolva o `SKILL_DIR`

O script viaja junto desta skill, em `SKILL_DIR/scripts/`. Defina `SKILL_DIR` como o
**caminho absoluto da pasta que contém ESTE SKILL.md** (o harness informou esse caminho
ao ler o arquivo). Neste repositório é
`e:/Users/hagge/Downloads/HorusOS/.claude/skills/ver-no-celular`.

## O fluxo

### 1. Descubra o que servir

A pasta do site (a que tem `index.html`). Se o Marcelo não disser qual, use a do
trabalho atual da conversa (ex.: `clientes/mullsanni-performance/site`). Sirva a **pasta**,
não o arquivo, para os assets relativos (`assets/…`) carregarem por HTTP.

### 2. Suba o servidor EM SEGUNDO PLANO

```bash
python "${SKILL_DIR}/scripts/servir.py" "<pasta-do-site>"
```

Rode com **run_in_background** (o servidor fica de pé; não bloqueie a conversa). O script
imprime o endereço nas primeiras linhas e só então passa a servir, então leia a saída
inicial da tarefa em segundo plano para pegar a URL.

### 3. Passe a URL pro Marcelo

Entregue a linha **`NO CELULAR: http://<ip>:<porta>/`** — é o que ele toca/digita no
celular. Se ele estiver comandando pelo Remote Control (já no telefone), é só tocar no
link. Diga também a porta, caso precise.

### 4. Explique as duas regras (é aqui que costuma falhar)

- 🔴 **Mesma rede WiFi.** Celular e PC no mesmo roteador. Celular no 4G/5G ou em outra
  rede **não** alcança o IP local. (Se for esse o caso, vá para o túnel, abaixo.)
- 🔴 **Firewall do Windows.** Na primeira vez, o Windows pode perguntar se libera o
  Python na rede: **permitir em rede PRIVADA**. Se o celular não abrir e o WiFi é o mesmo,
  o firewall é quase sempre a causa; mande ele permitir, ou liberar a porta.

### 5. Parar quando terminar

```bash
python "${SKILL_DIR}/scripts/servir.py" --parar
```

Encerra o servidor (lê o PID do estado em `%TEMP%/horus_preview.json`). Também dá pra
encerrar matando a tarefa em segundo plano. `--status` mostra o preview em andamento.

## Quando ele NÃO está na mesma rede: o túnel (acesso de qualquer lugar)

Rede local só serve com o celular no mesmo WiFi. Para revisar **de fora** (celular no
4G, longe do PC), é preciso um túnel que exponha o servidor local numa URL pública HTTPS:

```bash
# 1) sobe o servidor local normalmente (passo 2), anote a porta
# 2) num SEGUNDO comando em segundo plano, o túnel:
cloudflared tunnel --url http://localhost:<porta>
```

O `cloudflared` devolve uma URL `https://algo.trycloudflare.com` que abre em qualquer
lugar, sem conta. **Nesta máquina ele não está instalado** (conferido em 09/09/2026);
para usar, instalar antes (`winget install Cloudflare.cloudflared` ou baixar o binário).
Alternativa equivalente: `ngrok http <porta>` (exige conta grátis).

⚠️ **Túnel é URL pública.** Enquanto estiver de pé, qualquer um com o link abre o site.
Para peça de cliente ainda não publicada, subir só o tempo da revisão e **parar depois**.
Se o site tiver algo sensível, preferir a rede local.

## Cuidados

- Serve por **HTTP**, não HTTPS. Para site estático local tudo bem; recurso que exija
  contexto seguro (câmera, alguns Service Workers) não roda em HTTP na rede local.
- O script acha uma **porta livre** a partir de 8000 sozinho; se 8000 estiver ocupada,
  ele sobe na próxima e a URL reflete isso.
- Um preview por vez (o estado é único). Suba um novo só depois de `--parar` o anterior,
  ou eles disputam o registro de estado.
- Não confundir com publicar: isto é **revisão temporária**. Entrega de verdade é deploy
  (Netlify/Vercel) ou o fluxo da `/salvar`.
