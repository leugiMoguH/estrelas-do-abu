import sys, numpy as np
from PIL import Image
def key(src, dst, lo=100, hi=170):
    im = np.array(Image.open(src).convert('RGB')).astype(float)
    d = np.sqrt(((im-[0,255,0])**2).sum(2))
    a = np.clip((d-lo)/(hi-lo),0,1)
    # despill: clamp green toward max(r,b) on edge pixels
    r,g,b = im[...,0],im[...,1],im[...,2]
    lim = np.maximum(r,b)
    spill = (a<1)&(g>lim)
    g = np.where(spill, lim, g)
    out = np.dstack([r,g,b,a*255]).astype(np.uint8)
    Image.fromarray(out,'RGBA').save(dst)
if __name__=='__main__':
    import glob,os
    for f in glob.glob('*.png'):
        if f.startswith(('composite','contact')): continue
        key(f, 'key/'+f)
