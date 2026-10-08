"""Cola o rótulo oval do pacote REAL sobre o rótulo gerado por IA.
Uso: python trocar-rotulo.py entrada.png saida.png x0 y0 x1 y1  (região onde procurar o rótulo)
O ChatGPT erra letra no zoom ("CAEÉ", "ARÁBICA" torto); o rótulo real não."""
import sys, numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage as nd
def oval(img, region=None):
    a=np.asarray(img.convert('RGBA')).astype(int)
    m=(a[...,0]>200)&(a[...,1]>192)&(a[...,2]>178)&(a[...,3]>200)
    if region:
        x0,y0,x1,y1=region; z=np.zeros_like(m); z[y0:y1,x0:x1]=True; m&=z
    m=nd.binary_closing(m,iterations=4); m=nd.binary_fill_holes(m)
    lab,n=nd.label(m); s=nd.sum(m,lab,range(1,n+1)); k=int(np.argmax(s))+1
    sl=nd.find_objects(lab)[k-1]; return (sl[1].start,sl[0].start,sl[1].stop,sl[0].stop)
def exp(b,f):
    x0,y0,x1,y1=b; w,h=x1-x0,y1-y0; return (int(x0-w*f),int(y0-h*f),int(x1+w*f),int(y1+h*f))
ent,sai=sys.argv[1],sys.argv[2]; reg=tuple(map(int,sys.argv[3:7]))
gen=Image.open(ent).convert('RGBA'); real=Image.open('pacote-kraft-recorte.png').convert('RGBA')
bg=oval(gen,reg); br=oval(real); print('rotulo gerado',bg)
bge=exp(bg,.035); bre=exp(br,.035)
lab=real.crop(bre).resize((bge[2]-bge[0],bge[3]-bge[1]),Image.LANCZOS)
ga=np.asarray(gen.crop(bg).convert('RGB')).reshape(-1,3); ra=np.asarray(real.crop(br).convert('RGB')).reshape(-1,3)
ratio=np.percentile(ga,90,axis=0)/np.percentile(ra,90,axis=0)
la=np.asarray(lab).astype(float); la[...,:3]=np.clip(la[...,:3]*ratio,0,255); lab=Image.fromarray(la.astype('uint8'),'RGBA')
mask=Image.new('L',lab.size,0); ImageDraw.Draw(mask).ellipse((2,2,lab.width-3,lab.height-3),fill=255); mask=mask.filter(ImageFilter.GaussianBlur(1.5))
out=gen.copy(); out.paste(lab,(bge[0],bge[1]),mask); out.save(sai)
