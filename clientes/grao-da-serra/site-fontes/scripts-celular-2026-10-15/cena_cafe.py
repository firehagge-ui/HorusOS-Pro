# Cena do "Nosso café" no celular (15/10, mockup do Marcelo): os dois pacotes de rótulo REAL
# (site-fontes/dois-pacotes-rotulo-real.png) no lugar exato do pacote da foto real do Marcelo
# (mesma proporção do kraft), com o saco de juta, a mesa e o pé de café dela; fundo
# escurecido e desfocado no marrom da seção, topo dissolvido em transparência.
from PIL import Image, ImageFilter
import numpy as np
F='E:/Users/hagge/Downloads/HorusOS/clientes/grao-da-serra/site-fontes/'
foto=Image.open(F+'hero-home-marcelo-2026-10-05.png').convert('RGB')
par=Image.open(F+'dois-pacotes-rotulo-real.png').convert('RGBA')
k=0.69
par=par.resize((round(par.width*k),round(par.height*k)),Image.LANCZOS)
ox,oy=1020-round(540*k),54-round(100*k)
# fundo: desfoque leve + escurecido no marrom, mais forte em cima (some a serra/céu)
fundo=foto.filter(ImageFilter.GaussianBlur(5))
f=np.asarray(fundo).astype(float)
H=foto.height; y=np.arange(H)[:,None,None]/H
marrom=np.array([42,21,9.])
esc=np.clip(1.0-(y-0.12)/0.62,0,1)**1.4*0.90+0.10     # 0,9 no topo -> 0,1 na mesa
f=f*(1-esc)+marrom*esc
f=f*0.92
fundo=Image.fromarray(f.clip(0,255).astype('uint8')).convert('RGBA')
# mesa e saco nítidos de volta (a parte de baixo, como no mockup)
nit=foto.convert('RGBA'); nf=np.asarray(nit).astype(float)
m=np.clip((np.arange(H)-560)/140,0,1)[:,None]     # nítido a partir da mesa
m=np.broadcast_to(m,(H,foto.width))
base=np.asarray(fundo).astype(float)
nf2=nf*0.78+np.array([42,21,9,255.])*0.0           # mesa um pouco mais escura
mix=base*(1-m[...,None])+nf2*m[...,None]; mix[...,3]=255
cena=Image.fromarray(mix.clip(0,255).astype('uint8'))
pa=np.asarray(par).astype(float); pa[...,:3]*=np.array([.93,.86,.78])  # luz quente da cena
par=Image.fromarray(pa.clip(0,255).astype('uint8'))
cena.alpha_composite(par,(ox,oy))
# respiro escuro acima dos pacotes (o topo dissolve em transparência)
TOPO=200
c2=Image.new('RGBA',(cena.width,H+TOPO),(39,19,8,255)); c2.paste(cena,(0,TOPO)); cena=c2; H=H+TOPO
# recorte: saco à esquerda, pacotes 19%-83%, pé de café à direita
X0,X1=487,1660
cena=cena.crop((X0,0,X1,H))
W=900; s=W/cena.width; cena=cena.resize((W,round(H*s)),Image.LANCZOS)
a=np.asarray(cena).astype(float); h=cena.height
t=np.clip(np.arange(h)/(h*0.22),0,1); al=(t*t*(3-2*t))
b=np.clip((h-np.arange(h))/(h*0.10),0,1); al=al*(b*b*(3-2*b))
a[...,3]=a[...,3]*al[:,None]
out=Image.fromarray(a.clip(0,255).astype('uint8'))
out.save(F+'cafe-cena-mob-2026-10-15-preview.png')
out.save('E:/Users/hagge/Downloads/HorusOS/clientes/grao-da-serra/site/assets/cafe-cena-mob-2026-10-15.webp',quality=82,method=6)
prev=Image.new('RGBA',out.size,(52,28,14,255)); prev.alpha_composite(out); prev.convert('RGB').save('C:/Users/hagge/AppData/Local/Temp/claude/E--Users-hagge-Downloads-HorusOS/6c7103cd-6003-452d-9cd3-c7c9468828c5/scratchpad/cena-ver.png')
print(out.size)
