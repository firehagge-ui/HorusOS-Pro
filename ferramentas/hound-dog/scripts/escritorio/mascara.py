# Gera a máscara da camada da frente (mesa, monitores e objetos em cima da mesa) de cada palco.
import sys, numpy as np
from PIL import Image, ImageDraw
MESA = 494
# por estação: centro do boneco, monitor (x0,y0,x1,y1) e objetos em cima da mesa que podem cobrir o boneco
EST = [
  dict(cx=342,  mon=(166, 395, 312, 500), obj=[('cor', (372, 428, 462, 500)), ('cor', (328, 476, 378, 500))]),
  dict(cx=712,  mon=(524, 395, 682, 500), obj=[('cor', (676, 462, 722, 500)), ('cor', (740, 466, 800, 500))]),
  dict(cx=1060, mon=(896, 395, 1055, 500), obj=[('cor', (1084, 450, 1132, 500))]),
  dict(cx=1335, mon=(1341, 395, 1497, 500), obj=[('elipse', (1262, 476, 1314, 500)), ('cor', (1268, 486, 1345, 500))]),
  dict(cx=1650, mon=(1702, 395, 1857, 500), obj=[('cor', (1652, 462, 1690, 500))]),
]
def mascara(src):
    a = np.asarray(Image.open(src).convert('RGB')).astype(int)
    R, G, B = a[..., 0], a[..., 1], a[..., 2]; lum = (R + G + B) / 3
    fundo = ((B >= R - 8) & (lum < 150)) | (lum < 26)     # cadeira azul-marinho e a fresta escura atrás da mesa
    m = Image.new('L', (a.shape[1], a.shape[0]), 0); d = ImageDraw.Draw(m)
    d.rectangle((0, MESA, a.shape[1], a.shape[0]), fill=255)
    arr = np.asarray(m).copy()
    for e in EST:
        x0, y0, x1, y1 = e['mon']; arr[y0:y1, x0:x1] = 255
        for tipo, (x0, y0, x1, y1) in e['obj']:
            if tipo == 'elipse':
                mm = Image.new('L', m.size, 0); ImageDraw.Draw(mm).ellipse((x0, y0, x1, y1 + 20), fill=255); arr |= np.asarray(mm)
            else:
                blk = ~fundo[y0:y1, x0:x1]; arr[y0:y1, x0:x1] |= (blk * 255).astype(np.uint8)
    return Image.fromarray(arr)
if __name__ == '__main__':
    for src, out in zip(sys.argv[1::2], sys.argv[2::2]): mascara(src).save(out, optimize=True)
