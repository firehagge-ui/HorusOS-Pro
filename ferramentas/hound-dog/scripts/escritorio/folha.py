# Recorta a folha de poses: tira o magenta (e a franja roxa), separa as poses, tira a cadeira do desenho.
import sys, json, numpy as np
from PIL import Image
from scipy import ndimage
src, nome = sys.argv[1], sys.argv[2]
COM_CADEIRA = '--sem-cadeira' not in sys.argv  # a folha da Clara veio com cadeira; as outras, sem
a = np.asarray(Image.open(src).convert('RGB')).astype(int)
R, G, B = a[..., 0], a[..., 1], a[..., 2]
lum = (R + G + B) / 3
# distância ao magenta: fundo puro e franja (muito vermelho+azul, pouco verde)
mag = (R > 170) & (B > 170) & (G < 40)  # o fundo é #FF00FF quase puro; roxo de roupa tem verde acima de 60
fg = ~mag
# franja: pixel de borda com tom rosado vira mais escuro e sem magenta
borda = fg & ndimage.binary_dilation(mag, iterations=2)
rosado = borda & (np.minimum(R, B) - G > 70)  # mistura com o fundo: vermelho e azul altos, verde baixo
fg &= ~rosado
if '--limpa-rosa' in sys.argv:  # lente transparente deixa o fundo vazar; não usar em quem veste roxo
    fg &= ~((np.minimum(R, B) - G > 100) & (np.abs(R - B) < 30))
cols = fg.sum(0); xs = np.where(cols > 3)[0]; grupos = []
for x in xs:
    if grupos and x - grupos[-1][1] <= 6: grupos[-1][1] = x
    else: grupos.append([x, x])
grupos = [g for g in grupos if g[1] - g[0] > 100]
# pose colada na vizinha (mão levantada encostando): corta a mais larga no ponto mais vazio do meio, até dar 6
while len(grupos) < 6:
    k = max(range(len(grupos)), key=lambda i: grupos[i][1] - grupos[i][0])
    x0, x1 = grupos[k]; w = x1 - x0
    if w < 1.5 * np.median([g[1] - g[0] for g in grupos]): break
    meio = range(x0 + w // 3, x1 - w // 3)
    corte = min(meio, key=lambda x: cols[x])
    grupos[k:k + 1] = [[x0, corte - 1], [corte + 1, x1]]
poses = []
for k, (x0, x1) in enumerate(grupos):
    sub = fg[:, x0:x1 + 1]; ys = np.where(sub.sum(1) > 0)[0]; y0, y1 = ys.min(), ys.max()
    m = fg[y0:y1 + 1, x0:x1 + 1].copy(); px = a[y0:y1 + 1, x0:x1 + 1]
    r, g, b = px[..., 0], px[..., 1], px[..., 2]; l = (r + g + b) / 3
    # cadeira: azul-marinho/cinza escuro; a caixa dela é o miolo azul na metade de baixo à direita
    navy = m & (b >= r + 6) & (l < 120)
    h, w = m.shape
    zona = np.zeros_like(m); zona[int(h * 0.35):, int(w * 0.62):] = True
    nz = navy & zona
    lab, n = ndimage.label(ndimage.binary_dilation(nz, iterations=2))
    if n and COM_CADEIRA:
        tams = ndimage.sum(nz, lab, range(1, n + 1))
        cz = np.zeros_like(m)
        for i, t in enumerate(tams, start=1):  # a cadeira pode vir partida pelo braço: junta os pedaços grandes
            if t < 150: continue
            sl = ndimage.find_objects((lab == i).astype(int))[0]
            cy0, cy1, cx0, cx1 = sl[0].start, sl[0].stop, sl[1].start, sl[1].stop
            caixa = px[cy0:cy1, cx0:cx1]
            laranja = ((caixa[..., 0] > 215) & (caixa[..., 1] > 120) & (caixa[..., 2] < 90)).mean()
            if laranja > 0.08: continue  # é a concha do fone (miolo laranja aceso), não a cadeira
            cz[max(0, cy0 - 6):cy1 + 4, max(0, cx0 - 2):cx1 + 6] = True
        cabelo = (r - b > 55) & (r > 95) & (g < r * 0.9)
        pele = (r > 190) & (g > 130) & (b > 80) & (r - b < 140)
        blusa = (g > r + 5) & (g > b + 15)
        claro = l > 200
        tira = cz & m & ~(cabelo | pele | blusa | claro)
        m &= ~tira
        # a borda laranja da cadeira passa por "cabelo": dentro da cadeira, o que é fino demais pra ser mecha sai
        cz2 = ndimage.binary_dilation(cz, iterations=10)
        grosso = ndimage.binary_opening(m, structure=np.ones((6, 6)))
        m &= ~(cz2 & ~grosso)
        # o que sobrou dentro da cadeira e ficou solto (borda laranja da cadeira) sai também
        lab2, n2 = ndimage.label(m)
        tam = ndimage.sum(m, lab2, range(1, n2 + 1))
        principal = 1 + np.argmax(tam)
        for i in range(1, n2 + 1):
            if i == principal: continue
            sl = lab2 == i
            branco = l[sl].mean() > 190
            bb = ndimage.find_objects(sl.astype(int))[0]
            fino = min(bb[0].stop - bb[0].start, bb[1].stop - bb[1].start) <= 7
            amarelo = (g[sl].mean() > 170) and (r[sl].mean() > 220)  # o brilho de comemoração fica
            if (sl & cz).any() or tam[i - 1] < 40 or branco or (fino and not amarelo): m &= ~sl
    rgba = np.zeros((h, w, 4), np.uint8); rgba[..., :3] = px; rgba[..., 3] = m * 255
    poses.append(dict(x=int(x0), y=int(y0), w=int(w), h=int(h), img=rgba))
# monta a folha final: poses lado a lado, alinhadas pela base
H = max(p['y'] + p['h'] for p in poses) - min(p['y'] for p in poses)
topo = min(p['y'] for p in poses)
W = sum(p['w'] for p in poses) + 4 * (len(poses) - 1)
out = np.zeros((H, W, 4), np.uint8); meta = []; x = 0
for p in poses:
    oy = p['y'] - topo
    out[oy:oy + p['h'], x:x + p['w']] = p['img']
    meta.append(dict(sx=x, sy=oy, w=p['w'], h=p['h'], ox=p['x'], oy=p['y']))
    x += p['w'] + 4
Image.fromarray(out, 'RGBA').save(nome + '.png', optimize=True)
json.dump(dict(base=int(topo + H), poses=meta), open(nome + '.json', 'w'))
print(json.dumps(meta))
