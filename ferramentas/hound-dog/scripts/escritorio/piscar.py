# Acrescenta à folha uma versão "piscando" de algumas poses: pálpebra da cor da pele e o traço do olho fechado.
import sys, json, numpy as np
from PIL import Image, ImageDraw
nome = sys.argv[1]
olhos = json.loads(sys.argv[2])  # {"0": [[x0,y0,x1,y1],...], ...} em coordenadas da folha
im = Image.open(nome + '.png').convert('RGBA'); meta = json.load(open(nome + '.json'))
a = np.asarray(im).copy()
novas = []
for idx, caixas in olhos.items():
    p = meta['poses'][int(idx)]
    sub = a[:, p['sx']:p['sx'] + p['w']].copy()
    for (x0, y0, x1, y1) in caixas:
        x0 -= p['sx']; x1 -= p['sx']
        # uma cor só por olho: a mediana da pele logo abaixo (por coluna fica listrado)
        amostra = sub[y1 + 3:y1 + 9, x0:x1 + 1].reshape(-1, 4); amostra = amostra[amostra[:, 3] > 0]
        pele = np.median(amostra[:, :3], axis=0).astype(np.uint8)
        sub[y0:y1 + 1, x0:x1 + 1, :3] = pele; sub[y0:y1 + 1, x0:x1 + 1, 3] = 255
        img = Image.fromarray(sub); d = ImageDraw.Draw(img)
        ym = y0 + int((y1 - y0) * 0.62); xc = (x0 + x1) // 2
        d.line([(x0, ym - 2), (xc, ym + 2), (x1, ym - 2)], fill=(58, 28, 22, 255), width=3)
        sub = np.asarray(img).copy()
    novas.append((int(idx), sub))
W = a.shape[1] + sum(s.shape[1] + 4 for _, s in novas)
out = np.zeros((a.shape[0], W, 4), np.uint8); out[:, :a.shape[1]] = a; x = a.shape[1] + 4
for idx, s in novas:
    out[:, x:x + s.shape[1]] = s
    q = dict(meta['poses'][idx]); q['sx'] = x; q['pisca_de'] = idx; meta['poses'].append(q); x += s.shape[1] + 4
Image.fromarray(out, 'RGBA').save(nome + '.png', optimize=True); json.dump(meta, open(nome + '.json', 'w'))
print(len(meta['poses']), 'poses', out.shape)
