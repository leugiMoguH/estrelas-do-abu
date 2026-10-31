import numpy as np, colorsys
from PIL import Image
TONES = {'porcelana':'#fbe0cf','clara':'#f6cdb0','bege':'#ebb98f','oliva':'#d9a074','dourada':'#c58a5c','caramelo':'#a86d44','castanha':'#86542f','ebano':'#5e3a24'}
def hx(h): return np.array([int(h[i:i+2],16) for i in (1,3,5)])/255
def ramp(hexv):
    r,g,b = hx(hexv); h,l,s = colorsys.rgb_to_hls(r,g,b)
    def c(dl,ds=0,dh=0): 
        return np.array(colorsys.hls_to_rgb((h+dh)%1, min(1,max(0,l+dl)), min(1,max(0,s+ds))))
    line = c(-l*0.62, +0.05, -0.012)
    shade= c(-0.10-l*0.12, +0.06, -0.012)
    base = np.array([r,g,b])
    high = c((1-l)*0.30, -0.04, +0.006)
    return [line, shade, base, high]
STOPS=[0.0,0.22,0.77,1.0]   # luminância normalizada (0..207) do corpo-molde
def apply(img, hexv):
    a = np.array(img).astype(float); lum=(a[...,:3]@[0.299,0.587,0.114])/207
    R = ramp(hexv); out=np.zeros(a[...,:3].shape)
    for ch in range(3): out[...,ch]=np.interp(lum, STOPS, [x[ch] for x in R])
    return np.dstack([out*255, a[...,3]]).astype(np.uint8)
if __name__=='__main__':
    sk = Image.open('body_skin.png'); und=Image.open('body_under.png')
    W=Image.new('RGBA',(8*300,520),(220,226,240,255))
    for i,(k,v) in enumerate(TONES.items()):
        t = Image.fromarray(apply(sk,v),'RGBA').crop((300,20,740,540)).resize((300,354))
        W.alpha_composite(t,(i*300,0))
        t2 = Image.fromarray(apply(sk,v),'RGBA').crop((250,760,780,1000)).resize((300,136))
        W.alpha_composite(t2,(i*300,360))
    W.convert('RGB').save('skin_tones.png')
