import sys, glob, os, numpy as np
from PIL import Image, ImageDraw
from key import key
from skin_map import apply, TONES
def load(p):
    key(p,'/tmp_k.png') if False else None
def keyed(p):
    import tempfile
    t=os.path.join(tempfile.gettempdir(),'k_tmp.png'); key(p,t); return Image.open(t).convert('RGBA')
sk=Image.fromarray(apply(Image.open('body_skin.png'),TONES['bege']),'RGBA'); un=Image.open('body_under.png')
files=sorted(f for f in glob.glob(sys.argv[1]+'/*.png') if '_try1' not in f)
if len(sys.argv)>3 and sys.argv[3]=='try1': files=sorted(glob.glob(sys.argv[1]+'/*_try1.png'))
S=0.4; w,h=int(1024*S),int(1536*S)
W=Image.new('RGB',(w*len(files),h+20),(205,212,232))
d=ImageDraw.Draw(W)
for i,f in enumerate(files):
    c=Image.new('RGBA',(1024,1536),(0,0,0,0)); c.alpha_composite(sk); c.alpha_composite(un); c.alpha_composite(keyed(f))
    W.paste(c.resize((w,h)).convert('RGB'),(i*w,20),c.resize((w,h)).split()[3])
    d.text((i*w+4,4),os.path.basename(f),fill=(0,0,0))
W.save(sys.argv[2])
