# -*- coding: utf-8 -*-
"""Transforma um site do portfólio (index.html + assets) num arquivo único,
com CSS, JS e imagens embutidos, pronto para publicar como Artifact.
Uso: python empacota.py <pasta-do-site> <saida.html>
"""
import base64
import io
import os
import re
import sys

pasta = sys.argv[1].replace('\\', '/')
saida = sys.argv[2]

html = io.open(os.path.join(pasta, 'index.html'), encoding='utf-8').read()


def le(caminho):
    return io.open(os.path.join(pasta, caminho), encoding='utf-8').read()


def datauri(caminho):
    full = os.path.join(pasta, caminho)
    ext = os.path.splitext(caminho)[1].lower()
    mime = {'.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png',
            '.svg': 'image/svg+xml'}.get(ext, 'application/octet-stream')
    dados = base64.b64encode(open(full, 'rb').read()).decode('ascii')
    return 'data:%s;base64,%s' % (mime, dados)


# 1. CSS embutido
def troca_css(m):
    href = m.group(1)
    if href.startswith('http'):
        return m.group(0)
    return '<style>\n%s\n</style>' % le(href)


html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', troca_css, html)

# 2. JS embutido
def troca_js(m):
    src = m.group(1)
    return '<script>\n%s\n</script>' % le(src)


html = re.sub(r'<script src="([^"]+)"[^>]*></script>', troca_js, html)

# 3. imagens em data URI
def troca_img(m):
    caminho = m.group(1)
    if caminho.startswith('data:') or caminho.startswith('http'):
        return m.group(0)
    if not os.path.exists(os.path.join(pasta, caminho)):
        return m.group(0)
    return 'src="%s"' % datauri(caminho)


html = re.sub(r'src="(assets/[^"]+)"', troca_img, html)

# 4. o Artifact envolve o conteúdo: fora doctype, html, head, body
titulo = re.search(r'<title>(.*?)</title>', html, re.S)
titulo = titulo.group(1).strip() if titulo else 'Site'
titulo = titulo.split('|')[0].strip()

corpo = re.search(r'<body>(.*)</body>', html, re.S).group(1)
estilos = re.findall(r'<style>.*?</style>', html, re.S)
fontes = re.findall(r'<link rel="preconnect"[^>]*>|<link rel="stylesheet" href="https://fonts[^"]+">', html)

partes = ['<title>%s</title>' % titulo]
partes += fontes
partes += estilos
partes.append(corpo)

io.open(saida, 'w', encoding='utf-8').write('\n'.join(partes))
tam = os.path.getsize(saida) / 1024.0
print('OK %s  %.0f KB  titulo=%s' % (saida, tam, titulo))
