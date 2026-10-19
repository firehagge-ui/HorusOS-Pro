# "Nossa origem" no celular (15/10, mockup do Marcelo): a foto REAL de Brejões
# (vista-brejoes.webp) com luz de fim de tarde. O lugar não muda: só a cor. O céu azul
# vira dourado/creme (nuvens preservadas pela luminância) e o resto ganha tom quente.
from PIL import Image, ImageFilter
import numpy as np
S='E:/Users/hagge/Downloads/HorusOS/clientes/grao-da-serra/site/assets/'
im=Image.open(S+'vista-brejoes.webp').convert('RGB'); a=np.asarray(im).astype(float)
h,w,_=a.shape; r,g,b=a[...,0],a[...,1],a[...,2]
lum=(.299*r+.587*g+.114*b)/255
# máscara do céu: linha do horizonte achada coluna a coluna (1ª linha de montanha:
# verde/escura, sem azul forte), com 2px de transição. A névoa azulada da serra fica.
serra=(lum<.58)&~((b>150)&(b-r>70))
hz=np.zeros(w,int)
for x in range(w):
    c=serra[:,x].copy(); c[int(h*.40):]=True
    # exige 4 linhas seguidas de serra, para nuvem escura não contar
    run=np.convolve(c.astype(int),np.ones(4,int),'valid')
    hz[x]=int(np.argmax(run>=4))
from scipy.ndimage import median_filter
hz=median_filter(hz,9); hz=np.minimum(hz,median_filter(hz,41,mode="nearest")+6)
ceu=np.clip((hz[None,:]-np.arange(h)[:,None]+1)/2.5,0,1)
# céu novo: horizonte dourado -> creme em cima, nuvens em branco quente
yy=(np.arange(h)/h)[:,None]
alto=np.array([246,232,212.]); horiz=np.array([244,196,132.])
t=np.clip(yy/0.30,0,1)[...,None]
base=alto*(1-t)+horiz*t
nv=np.clip((lum-.62)/.25,0,1)[...,None]
novo=base*(1-nv*.95)+np.array([255,241,222.])*nv*.95
novo=novo*(0.86+0.16*lum[...,None])
# resto: tom de fim de tarde
q=a*np.array([1.07,1.0,.84])+np.array([10,4,-6.])
q=q*(1-ceu[...,None])+novo*ceu[...,None]
out=Image.fromarray(q.clip(0,255).astype('uint8'))
out.save(S+'vista-brejoes-quente-mob.webp',quality=82,method=6)
out.save('C:/Users/hagge/AppData/Local/Temp/claude/E--Users-hagge-Downloads-HorusOS/6c7103cd-6003-452d-9cd3-c7c9468828c5/scratchpad/vista-ver.png')
both=Image.new('RGB',(w*2+10,h),'white');both.paste(im,(0,0));both.paste(out,(w+10,0));both.save('C:/Users/hagge/AppData/Local/Temp/claude/E--Users-hagge-Downloads-HorusOS/6c7103cd-6003-452d-9cd3-c7c9468828c5/scratchpad/vista-ab.png')
print(out.size)
