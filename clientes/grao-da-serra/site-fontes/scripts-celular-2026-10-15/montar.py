# Foto do celular (15/10, 3ª passada): céu de nuvens com sol (da arte vertical) por cima
# da cena REAL do Marcelo (saco, pacote, pé de café, mesa), recortada mais aberta.
import sys
from PIL import Image, ImageDraw, ImageFilter
import numpy as np
F='E:/Users/hagge/Downloads/HorusOS/clientes/grao-da-serra/site-fontes/'
W=900
# cena: pacote em ~49-81% da largura, como no mockup
X0,X1=int(sys.argv[1]) if len(sys.argv)>1 else 360, 1716
foto=Image.open(F+'hero-home-marcelo-2026-10-05.png').convert('RGB').crop((X0,0,X1,870))
s=W/foto.width; foto=foto.resize((W,round(870*s)),Image.LANCZOS)
# máscara do pacote (retângulo arredondado), para o céu novo não passar por cima dele
mk=Image.new('L',foto.size,0); d=ImageDraw.Draw(mk)
d.rounded_rectangle(((1021-X0)*s,54*s,(1461-X0)*s,foto.height+20),radius=14*s,fill=255)
mk=mk.filter(ImageFilter.GaussianBlur(1.2))
# céu: arte vertical até logo acima da serra dela
CEU=int(sys.argv[2]) if len(sys.argv)>2 else 600
v=Image.open(F+'hero-vertical-chatgpt-2026-10-05.png').convert('RGB')
v=v.crop((0,0,v.width,CEU)); v=v.resize((W,round(CEU*W/v.width)),Image.LANCZOS)
OV=round(110*s)  # faixa onde o céu da foto vira o céu novo
H=v.height+foto.height-OV
out=Image.new('RGB',(W,H))
out.paste(v,(0,0))
fy=v.height-OV
# alfa da foto: 0 no topo dela, 1 a OV px (suave), e 1 sempre no pacote
y=np.arange(foto.height)[:,None]/OV
t=np.clip(y,0,1); a=t*t*(3-2*t)
a=np.broadcast_to(a,(foto.height,W)).copy()
a=np.maximum(a,np.asarray(mk)/255.0)
fa=np.asarray(foto).astype(float); base=np.asarray(out.crop((0,fy,W,H))).astype(float)
mix=fa*a[...,None]+base*(1-a[...,None])
out.paste(Image.fromarray(mix.clip(0,255).astype('uint8')),(0,fy))
# topo dissolvido no marrom quase preto do mockup (#110A04), igual ao fundo da abertura
o=np.asarray(out).astype(float); FT=300
t=np.clip(np.arange(H)/FT,0,1); a=(1-t*t*(3-2*t))[:,None,None]
o=o*(1-a)+np.array([17,10,4])*a
out=Image.fromarray(o.clip(0,255).astype('uint8'))
out.save(F+'hero-mob-2026-10-15c-preview.png')
out.save('E:/Users/hagge/Downloads/HorusOS/clientes/grao-da-serra/site/assets/hero-mob-2026-10-15c.webp',quality=80,method=6)
print(out.size,'foto comeca em',fy,'pacote topo',fy+54*s)
