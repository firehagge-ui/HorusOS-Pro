#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Painel do acervo: uma pagina HTML com filtro por familia, estrutura, setor e
qualidade. Sem dependencia, sem servidor — abre com dois cliques.

    python scripts/painel.py
    python scripts/painel.py --abrir
"""

import argparse
import html
import json
import os
import re
import subprocess
import sys
import tempfile
import unicodedata
import webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from caminhos import ACERVO, RAIZ, exigir_indice, saida_utf8  # noqa: E402

saida_utf8()

# Sem _busca e sem os campos que a pagina nao mostra: o indice tem 1.7 MB e
# quase tudo e texto de busca duplicado.
CAMPOS = ("id", "familia", "titulo", "resumo", "setor", "estrutura", "qualidade",
          "quando_usar", "nao_usar_quando", "tags", "stack", "fontes", "caminho", "linhas",
          "preview")

# As tres partes que o acervo realmente tem. mcp fica de fora das tres porque
# nao guarda arquivo nenhum: e ficha de catalogo, o codigo vem pelo MCP na hora.
PARTE = {"prompt": "prompt", "design-system": "prompt", "receita": "prompt",
         "ui": "codigo", "efeito": "codigo", "html": "codigo", "animacao": "codigo",
         "template": "template", "mcp": "catalogo"}

PAGINA = """<!doctype html>
<meta charset="utf-8"><title>Acervo — %(total)s peças</title>
<style>
:root{--bg:#0d0d0f;--card:#17171b;--line:#26262c;--txt:#e8e8ea;--dim:#8a8a94;--on:#e8e8ea}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--txt);font:14px/1.5 ui-sans-serif,-apple-system,system-ui,sans-serif}
header{position:sticky;top:0;z-index:2;background:var(--bg);border-bottom:1px solid var(--line);padding:16px 24px;max-height:62vh;overflow-y:auto}
h1{font-size:15px;font-weight:600;margin:0 0 12px;letter-spacing:-.01em}
h1 span{color:var(--dim);font-weight:400}
#q{width:100%%;max-width:420px;background:var(--card);border:1px solid var(--line);border-radius:6px;
   color:var(--txt);padding:8px 12px;font:inherit;margin-bottom:12px}
#q:focus{outline:none;border-color:#555}
.linha{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-bottom:6px}
.linha:not(.aberta) button:not(.mais):nth-of-type(n+13){display:none}
.mais{opacity:.6}
.rot{color:var(--dim);font-size:11px;text-transform:uppercase;letter-spacing:.08em;width:78px;flex:none}
button{background:var(--card);border:1px solid var(--line);color:var(--dim);border-radius:999px;
       padding:4px 11px;font:inherit;font-size:12.5px;cursor:pointer}
button:hover{color:var(--txt)}
button.on{background:var(--on);border-color:var(--on);color:#0d0d0f;font-weight:500}
button b{font-weight:400;opacity:.55;margin-left:5px;font-variant-numeric:tabular-nums}
main{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:12px;padding:20px 24px 60px}
article{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px 16px}
img.pv{display:block;width:100%%;aspect-ratio:16/9;object-fit:cover;object-position:top;
       border-radius:6px;margin:-4px 0 10px;background:#000;border:1px solid var(--line)}
.top{display:flex;gap:8px;align-items:baseline;margin-bottom:6px}
.fam{font-size:10.5px;text-transform:uppercase;letter-spacing:.07em;color:var(--dim);flex:none}
.tit{font-weight:600;font-size:14px;letter-spacing:-.01em}
p{margin:0 0 8px;color:#b8b8c0}
.usar{margin:0 0 10px;color:var(--dim);font-size:12.5px;border-left:2px solid var(--line);padding-left:9px}
.tags{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:10px}
.tags i{font-style:normal;font-size:11px;color:var(--dim);background:#1f1f25;border-radius:4px;padding:2px 7px}
code{display:block;font:11.5px/1.5 ui-monospace,Menlo,monospace;color:var(--dim);cursor:pointer;
     word-break:break-all;border-top:1px solid var(--line);padding-top:9px}
code:hover{color:var(--txt)}
#vazio{padding:40px 24px;color:var(--dim)}
#abrir{margin-left:10px;background:none;border:none;color:var(--dim);padding:0;font-size:12.5px}
#abrir:hover{color:var(--txt);text-decoration:underline}
#imp{border-bottom:1px solid var(--line);padding:18px 24px;background:#101013}
#imp[hidden]{display:none}
#imp input,#imp textarea,#imp select{background:var(--card);border:1px solid var(--line);border-radius:6px;
  color:var(--txt);padding:8px 11px;font:inherit}
#imp input:focus,#imp textarea:focus{outline:none;border-color:#555}
#nome{width:100%%;max-width:520px;display:block;margin-bottom:8px}
#codigo{width:100%%;height:190px;font:12px/1.55 ui-monospace,Menlo,monospace;resize:vertical;display:block}
#imp .acoes{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:10px}
#imp .acoes button{padding:7px 15px}
#enviar{background:var(--on);border-color:var(--on);color:#0d0d0f;font-weight:500}
#enviar[disabled]{opacity:.35;cursor:default}
#detec{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:10px;font-size:12.5px;color:var(--dim)}
#detec[hidden]{display:none}
#detec select,#detec input{padding:5px 9px;font-size:12.5px}
#recado{font-size:12.5px;color:var(--dim);margin-left:4px}
#recado.erro{color:#ff8f7a}
#recado.ok{color:#8fe0a8}
article{cursor:default}
body.servido article{cursor:pointer}
body.servido article:hover{border-color:#3d3d47}
#gaveta{position:fixed;inset:0;background:rgba(0,0,0,.66);display:flex;justify-content:flex-end;z-index:9}
#gaveta[hidden]{display:none}
#gaveta > div{background:var(--card);border-left:1px solid var(--line);width:min(760px,92vw);
  display:flex;flex-direction:column;height:100%%}
#gcabeca{display:flex;gap:10px;align-items:baseline;padding:16px 20px;border-bottom:1px solid var(--line)}
#gtit{font-weight:600;flex:1;letter-spacing:-.01em}
#gcabeca button{padding:5px 12px}
#gmeta{padding:12px 20px;color:var(--dim);font-size:12.5px;border-bottom:1px solid var(--line)}
#gcod{margin:0;flex:1;overflow:auto;padding:16px 20px;font:12px/1.6 ui-monospace,Menlo,monospace;
  color:#c8c8d0;white-space:pre-wrap;word-break:break-word}
</style>
<header>
  <h1>Acervo <span id="cont"></span></h1>
  <input id="q" placeholder="buscar por título, tag, marca…" autofocus>
  <div id="filtros"></div>
</header>
<section id="imp" hidden>
  <input id="nome" placeholder="nome da peça — ex: Hero com parallax de joia" autocomplete="off">
  <textarea id="codigo" placeholder="cole aqui o componente inteiro (.tsx, .html, ou o texto do prompt)"
            spellcheck="false"></textarea>
  <div id="detec" hidden>
    <span>detectado:</span>
    <select id="familia"></select>
    <input id="estrutura" placeholder="estrutura — ex: hero" list="l-estrutura">
    <input id="setor" placeholder="setor" list="l-setor" value="generico">
    <input id="tags" placeholder="tags, separadas por vírgula">
    <span id="sinais"></span>
  </div>
  <div class="acoes">
    <button id="enviar" disabled>Importar</button>
    <button id="fechar">cancelar</button>
    <span id="recado"></span>
  </div>
  <datalist id="l-estrutura"></datalist><datalist id="l-setor"></datalist>
</section>
<main id="grade"></main>
<div id="vazio" hidden>Nada com esses filtros.</div>
<div id="gaveta" hidden><div>
  <div id="gcabeca"><span id="gtit"></span>
    <button id="gcopiar">copiar</button><button id="grevelar">no Finder</button><button id="gfechar">fechar</button></div>
  <div id="gmeta"></div><pre id="gcod"></pre>
</div></div>
<script>
const ITENS = %(dados)s, PARTE = %(parte)s;
const EIXOS = [["parte","parte"],["familia","família"],["estrutura","estrutura"],
               ["setor","setor"],["qualidade","qualidade"]];
ITENS.forEach(i => {
  i.parte = PARTE[i.familia];
  i._b = [i.titulo,i.resumo,i.quando_usar,i.id,(i.tags||[]).join(" "),(i.stack||[]).join(" "),
          (i.fontes||[]).join(" ")].join(" ").toLowerCase()
         .normalize("NFD").replace(/[\\u0300-\\u036f]/g,"");
});
const sel = {}, aberto = {}, norm = s => s.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g,"");

function passa(i, menos){
  for (const [k] of EIXOS) if (k !== menos && sel[k] && i[k] !== sel[k]) return false;
  const t = norm(q.value.trim());
  return !t || t.split(/\\s+/).every(p => i._b.includes(p));
}

function render(){
  const vis = ITENS.filter(i => passa(i));
  filtros.innerHTML = EIXOS.map(([k,rot]) => {
    const c = {};
    ITENS.filter(i => passa(i,k)).forEach(i => c[i[k]] = (c[i[k]]||0)+1);
    const op = Object.entries(c).sort((a,b) => b[1]-a[1])
      .map(([v,n]) => `<button data-k="${k}" data-v="${v}" class="${sel[k]===v?"on":""}">${v}<b>${n}</b></button>`);
    if (op.length < 2 && !sel[k]) return "";
    const mais = op.length > 12 ? `<button class="mais" data-abrir="1">+${op.length-12}</button>` : "";
    return `<div class="linha${aberto[k]?" aberta":""}"><span class="rot">${rot}</span>${op.join("")}${mais}</div>`;
  }).join("");
  cont.textContent = vis.length === ITENS.length ? `— ${ITENS.length} peças`
                   : `— ${vis.length} de ${ITENS.length}`;
  vazio.hidden = vis.length > 0;
  grade.innerHTML = vis.map(i => `<article data-i="${ITENS.indexOf(i)}">
    ${i.preview ? `<img class="pv" loading="lazy" src="${i.preview}" alt="">` : ""}
    <div class="top"><span class="fam">${i.familia}</span><span class="tit">${i.titulo}</span></div>
    <p>${i.resumo||""}</p>
    ${i.quando_usar ? `<p class="usar">${i.quando_usar}</p>` : ""}
    <div class="tags">${(i.tags||[]).slice(0,7).map(t => `<i>${t}</i>`).join("")}
      ${(i.stack||[]).map(t => `<i>${t}</i>`).join("")}</div>
    <code title="clique para copiar">${i.caminho}</code></article>`).join("");
}

filtros.onclick = e => {
  const b = e.target.closest("button"); if (!b) return;
  if (b.dataset.abrir) { b.parentNode.classList.add("aberta"); aberto[b.previousElementSibling.dataset.k] = 1; return; }
  sel[b.dataset.k] = sel[b.dataset.k] === b.dataset.v ? null : b.dataset.v;
  render();
};
grade.onclick = async e => {
  const card = e.target.closest("article"); if (!card) return;
  const item = ITENS[+card.dataset.i];
  if (e.target.tagName === "CODE") {                  // o caminho continua copiando
    navigator.clipboard.writeText(item.caminho);
    const t = e.target, o = t.textContent;
    t.textContent = "copiado"; setTimeout(() => t.textContent = o, 900);
    return;
  }
  if (!SERVIDO) return;                               // sem servidor nao ha o que ler
  gtit.textContent = item.titulo;
  gmeta.textContent = [item.familia, item.estrutura, item.setor, item.qualidade,
                       (item.stack||[]).join(" · ")].filter(Boolean).join("  ·  ");
  gcod.textContent = "abrindo…"; gaveta.hidden = false;
  const r = await fetch("/abrir", {method:"POST", body: JSON.stringify({caminho: item.caminho})})
                  .then(r => r.json()).catch(() => null);
  gcod.textContent = !r ? "servidor não respondeu" : r.erro ? r.erro
                   : r.texto ?? "arquivo grande demais para exibir — abra no Finder";
};

gfechar.onclick = () => gaveta.hidden = true;
gaveta.onclick = e => { if (e.target === gaveta) gaveta.hidden = true; };
addEventListener("keydown", e => { if (e.key === "Escape") gaveta.hidden = true; });
gcopiar.onclick = () => {
  navigator.clipboard.writeText(gcod.textContent);
  gcopiar.textContent = "copiado"; setTimeout(() => gcopiar.textContent = "copiar", 900);
};
grevelar.onclick = () => fetch("/revelar", {method:"POST",
  body: JSON.stringify({caminho: ITENS.find(i => i.titulo === gtit.textContent).caminho})});
q.oninput = render;

// Importar so existe com o servidor de pe: uma pagina file:// nao escreve em disco.
const SERVIDO = location.protocol.startsWith("http");
if (SERVIDO) document.body.classList.add("servido");
cont.insertAdjacentHTML("afterend", SERVIDO
  ? `<button id="abrir">+ importar peça</button>`
  : `<span id="recado">importar precisa do servidor: python3 scripts/painel.py --servir</span>`);

if (SERVIDO) {
  const listas = (id, campo) => document.getElementById(id).innerHTML =
    [...new Set(ITENS.map(i => i[campo]))].sort().map(v => `<option value="${v}">`).join("");
  listas("l-estrutura","estrutura"); listas("l-setor","setor");
  familia.innerHTML = ["prompt","ui","efeito","html"].map(f => `<option>${f}</option>`).join("");

  let timer;
  const diz = (t, cls="") => { recado.textContent = t; recado.className = cls; };

  abrir.onclick = () => { imp.hidden = !imp.hidden; if (!imp.hidden) nome.focus(); };
  fechar.onclick = () => { imp.hidden = true; };

  const analisar = async () => {
    if (codigo.value.trim().length < 20) { detec.hidden = true; enviar.disabled = true; return; }
    const r = await fetch("/analisar", {method:"POST", body: JSON.stringify({codigo: codigo.value})})
                    .then(r => r.json()).catch(() => null);
    if (!r || r.erro) { diz(r ? r.erro : "servidor não respondeu", "erro"); return; }
    familia.value = r.familia;
    sinais.textContent = [r.stack.join(" · "), r.deps.length ? r.deps.length + " deps" : "",
                          r.linhas + " linhas"].filter(Boolean).join("  ·  ");
    detec.hidden = false;
    enviar.disabled = !nome.value.trim();
    diz("");
  };
  codigo.oninput = () => { clearTimeout(timer); timer = setTimeout(analisar, 350); };
  nome.oninput = () => enviar.disabled = !(nome.value.trim() && !detec.hidden);

  enviar.onclick = async () => {
    enviar.disabled = true; diz("importando…");
    const r = await fetch("/importar", {method:"POST", body: JSON.stringify({
      nome: nome.value, codigo: codigo.value, familia: familia.value,
      estrutura: estrutura.value, setor: setor.value, tags: tags.value,
    })}).then(r => r.json()).catch(() => null);
    if (!r || r.erro) { diz(r ? r.erro : "falhou", "erro"); enviar.disabled = false; return; }
    diz(`${r.id} entrou como ${r.familia}. recarregando…`, "ok");
    setTimeout(() => location.reload(), 700);
  };
}

render();
</script>
"""


AQUI = os.path.dirname(os.path.abspath(__file__))
# A extensao decide familia em normalizar.classificar (.tsx -> ui). Um paste nao
# tem extensao, entao damos a que o proprio conteudo indica e deixamos o resto
# para a classificacao por conteudo, que ja existe.
def extensao(codigo):
    c = codigo.lstrip().lower()
    if c.startswith("<!doctype html") or c.startswith("<html"):
        return ".html"
    if re.search(r"^\s*(import\s+[\w{*]|['\"]use client)", c, re.M) or re.search(r"</\w+>|/>", codigo):
        return ".tsx"
    return ".md"


def escorregar(nome):
    t = unicodedata.normalize("NFKD", nome.strip().lower())
    t = "".join(c for c in t if not unicodedata.combining(c))
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", t)).strip("-")[:60]


def rodar(*args):
    return subprocess.run([sys.executable, *args], capture_output=True, text=True, cwd=os.path.dirname(AQUI))


def temporario(codigo, nome):
    caminho = os.path.join(tempfile.mkdtemp(prefix="painel-"),
                           (escorregar(nome) or "peca") + extensao(codigo))
    with open(caminho, "w", encoding="utf-8", newline="\n") as f:
        f.write(codigo)
    return caminho


def analisar(corpo):
    arq = temporario(corpo["codigo"], corpo.get("nome", "peca"))
    r = rodar(os.path.join(AQUI, "ingerir.py"), arq, "--analisar")
    if r.returncode:
        return {"erro": (r.stderr or r.stdout).strip()[:300]}
    d = json.loads(r.stdout[:r.stdout.rindex("}") + 1])
    return {"familia": d["familia"], "stack": d["stack"], "deps": d["deps"], "linhas": d["linhas"]}


def importar(corpo):
    ident = escorregar(corpo["nome"])
    if not ident:
        return {"erro": "dê um nome à peça"}
    arq = temporario(corpo["codigo"], corpo["nome"])
    r = rodar(os.path.join(AQUI, "ingerir.py"), arq,
              "--id", ident, "--titulo", corpo["nome"].strip(),
              "--forcar-familia", corpo["familia"],
              "--estrutura", corpo.get("estrutura", "").strip() or "componente-ui",
              "--setor", corpo.get("setor", "").strip() or "generico",
              "--tags", corpo.get("tags", ""),
              "--quando-usar", corpo.get("quando_usar", "").strip() or "Anotar depois de usar a primeira vez.")
    if r.returncode:
        return {"erro": (r.stderr or r.stdout).strip()[:300]}
    ri = rodar(os.path.join(AQUI, "indexar.py"))
    if ri.returncode:
        return {"erro": "ingerido, mas o índice falhou: " + (ri.stderr or ri.stdout).strip()[:200]}
    return {"id": ident, "familia": corpo["familia"]}


def abrir_peca(corpo):
    # Caminho vem do navegador: so vale se cair mesmo dentro do acervo.
    alvo = os.path.realpath(os.path.join(RAIZ, corpo.get("caminho", "")))
    if not alvo.startswith(os.path.realpath(ACERVO) + os.sep) or not os.path.exists(alvo):
        return {"erro": "caminho fora do acervo"}
    if os.path.isfile(alvo) and os.path.getsize(alvo) < 400_000:
        with open(alvo, encoding="utf-8", errors="replace") as f:
            return {"caminho": corpo["caminho"], "texto": f.read()}
    return {"caminho": corpo["caminho"], "texto": None}


def revelar(corpo):
    alvo = os.path.realpath(os.path.join(RAIZ, corpo.get("caminho", "")))
    if not alvo.startswith(os.path.realpath(ACERVO) + os.sep) or not os.path.exists(alvo):
        return {"erro": "caminho fora do acervo"}
    cmd = ["open", "-R", alvo] if sys.platform == "darwin" else ["xdg-open", os.path.dirname(alvo)]
    subprocess.run(cmd, capture_output=True)
    return {"ok": True}


ROTAS = {"/analisar": analisar, "/importar": importar, "/abrir": abrir_peca, "/revelar": revelar}


class Painel(BaseHTTPRequestHandler):
    def responder(self, corpo, tipo="application/json"):
        dados = corpo if isinstance(corpo, bytes) else json.dumps(corpo, ensure_ascii=False).encode()
        self.send_response(200)
        self.send_header("Content-Type", tipo + "; charset=utf-8")
        self.send_header("Content-Length", str(len(dados)))
        self.end_headers()
        self.wfile.write(dados)

    def do_GET(self):
        # Regera a cada carga: importar muda o indice e a pagina tem que refletir.
        gerar()
        with open(os.path.join(RAIZ, "painel.html"), "rb") as f:
            self.responder(f.read(), "text/html")

    def do_POST(self):
        fn = ROTAS.get(self.path)
        if not fn:
            return self.responder({"erro": "rota desconhecida"})
        bruto = self.rfile.read(int(self.headers.get("Content-Length", 0)))
        try:
            resposta = fn(json.loads(bruto))
        except Exception as e:                      # devolve o erro para a pagina, nao para o log
            resposta = {"erro": f"{type(e).__name__}: {e}"[:300]}
        self.responder(resposta)

    def log_message(self, *a):
        pass


def gerar():
    itens = exigir_indice()
    magro = [{k: i[k] for k in CAMPOS if k in i} for i in itens]
    for i in magro:
        for k in ("titulo", "resumo", "quando_usar", "caminho"):
            if i.get(k):
                i[k] = html.escape(str(i[k]))
    destino = os.path.join(RAIZ, "painel.html")
    with open(destino, "w", encoding="utf-8") as f:
        f.write(PAGINA % {"total": len(magro),
                          "dados": json.dumps(magro, ensure_ascii=False),
                          "parte": json.dumps(PARTE, ensure_ascii=False)})
    return destino, len(magro)


if __name__ == "__main__":
    p = argparse.ArgumentParser(description="Gera o painel HTML do acervo.")
    p.add_argument("--abrir", action="store_true", help="abre no navegador depois de gerar")
    p.add_argument("--servir", action="store_true",
                   help="sobe o painel com o campo de importar ligado (só localhost)")
    p.add_argument("--porta", type=int, default=8777)
    a = p.parse_args()
    destino, n = gerar()
    print(f"{n} peças  →  {destino}  ({os.path.getsize(destino)//1024} KB)")
    if a.servir:
        url = f"http://127.0.0.1:{a.porta}/"
        print(f"painel em {url}   (ctrl-c para parar)")
        if a.abrir:
            webbrowser.open(url)
        try:
            ThreadingHTTPServer(("127.0.0.1", a.porta), Painel).serve_forever()
        except KeyboardInterrupt:
            print()
    elif a.abrir:
        webbrowser.open("file://" + destino)
