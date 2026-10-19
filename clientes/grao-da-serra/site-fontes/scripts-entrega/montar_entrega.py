"""Monta a versão de entrega do site (zip pro cliente / pra hospedagem).
Tira as anotações internas (comentários de HTML, CSS e do JS inline), que falam de
bastidor (pedidos, ChatGPT, decisões), e leva só o que a página usa.
uso: python -I montar_entrega.py <pasta site> <pasta saída>"""
import os, re, shutil, sys

src, dst = sys.argv[1], sys.argv[2]
if os.path.exists(dst):
    shutil.rmtree(dst)
shutil.copytree(src, dst, ignore=shutil.ignore_patterns('netlify.toml'))

def limpa_js(js):
    js = re.sub(r'/\*.*?\*/', '', js, flags=re.S)
    linhas = []
    for l in js.split('\n'):
        if l.strip().startswith('//'):
            continue
        l = re.sub(r'(?<=[;{}),])\s+//\s.*$', '', l)
        linhas.append(l)
    return '\n'.join(linhas)

def limpa_html(h):
    partes = re.split(r'(<script\b[^>]*>.*?</script>)', h, flags=re.S | re.I)
    out = []
    for p in partes:
        if p.lower().startswith('<script'):
            abre = re.match(r'<script\b[^>]*>', p, re.I).group(0)
            if 'ld+json' in abre or 'src=' in abre:
                out.append(p)
            else:
                corpo = p[len(abre):-len('</script>')]
                out.append(abre + limpa_js(corpo) + '</script>')
        else:
            out.append(re.sub(r'<!--.*?-->', '', p, flags=re.S))
    h = ''.join(out)
    h = re.sub(r'[ \t]+\n', '\n', h)
    return re.sub(r'\n{3,}', '\n\n', h)

for nome in ('index.html', '404.html'):
    p = os.path.join(dst, nome)
    s = open(p, encoding='utf-8').read()
    open(p, 'w', encoding='utf-8', newline='\n').write(limpa_html(s))

p = os.path.join(dst, 'assets', 'site.css')
c = open(p, encoding='utf-8').read()
c = re.sub(r'/\*.*?\*/', '', c, flags=re.S)
c = re.sub(r'[ \t]+\n', '\n', c)
c = re.sub(r'\n{2,}', '\n', c)
open(p, 'w', encoding='utf-8', newline='\n').write(c)

# só os arquivos que a página usa (os grãos que caem são montados pelo JS: grao-N.webp)
usado = open(os.path.join(dst, 'index.html'), encoding='utf-8').read() + c \
      + open(os.path.join(dst, '404.html'), encoding='utf-8').read()
for a in os.listdir(os.path.join(dst, 'assets')):
    if os.path.isfile(os.path.join(dst, 'assets', a)) and a not in usado and not a.startswith('grao-'):
        os.remove(os.path.join(dst, 'assets', a)); print('fora (sem uso):', a)

# cabeçalhos para Netlify e Vercel (o mesmo pacote serve nos dois)
open(os.path.join(dst, 'netlify.toml'), 'w', encoding='utf-8').write('''[build]
  publish = "."
  command = ""

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "SAMEORIGIN"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), camera=(), microphone=()"
''')
import json
json.dump({"headers": [
    {"source": "/assets/(.*)", "headers": [{"key": "Cache-Control", "value": "public, max-age=31536000, immutable"}]},
    {"source": "/(.*)", "headers": [
        {"key": "X-Content-Type-Options", "value": "nosniff"},
        {"key": "X-Frame-Options", "value": "SAMEORIGIN"},
        {"key": "Referrer-Policy", "value": "strict-origin-when-cross-origin"},
        {"key": "Permissions-Policy", "value": "geolocation=(), camera=(), microphone=()"}]}]},
    open(os.path.join(dst, 'vercel.json'), 'w', encoding='utf-8'), indent=2)
print('ok')
