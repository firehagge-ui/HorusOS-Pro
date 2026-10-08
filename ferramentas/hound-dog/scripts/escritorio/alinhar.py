import sys, json, numpy as np
from PIL import Image
nome = sys.argv[1]
im = np.asarray(Image.open(nome + '.png')).astype(float); meta = json.load(open(nome + '.json'))
def pose(i):
    p = meta['poses'][i]; return im[:, p['sx']:p['sx'] + p['w']]
def faixa(a):
    l = a[..., :3].mean(2) * (a[..., 3] > 0); h = l.shape[0]; return l[int(h * 0.3):int(h * 0.75)]
ref = faixa(pose(0)); out = []
for i in range(6):
    b = faixa(pose(i)); best = None
    for dx in range(-60, 61):
        x0 = max(0, dx); x1 = min(ref.shape[1], b.shape[1] + dx)
        if x1 - x0 < 150: continue
        sc = -np.abs(ref[:, x0:x1] - b[:, x0 - dx:x1 - dx]).mean()
        if best is None or sc > best[0]: best = (sc, dx)
    out.append(best[1])
print(json.dumps(out), json.dumps([[p['sx'], p['sy'], p['w'], p['h']] for p in meta['poses']]))
