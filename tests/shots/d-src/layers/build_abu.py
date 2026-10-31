"""Abu: poses em tela comum 640x640 (escala igual), chroma agressivo, blink alinhado ao sit. Uso: python build_abu.py"""
import glob, os, json, numpy as np
from PIL import Image
from scipy import ndimage as ndi
from build_layers import key
OUT = os.path.abspath('../../../../src/art/assets/d5'); S = 640
def clean(f):
    a = key(f, lo=100, hi=170, band=6)
    r, g, b, al = [a[..., i].astype(float) for i in range(4)]
    edge = ndi.binary_dilation(al < 128, iterations=8) & (al > 0)
    g = np.where(edge & (g > np.maximum(r, b) + 4), np.maximum(r, b) + 4, g)
    return np.dstack([r, g, b, al]).astype(np.uint8)
def bbox(a):
    ys, xs = np.where(a[..., 3] > 40); return xs.min(), ys.min(), xs.max(), ys.max()
res = {os.path.basename(f)[:-4]: clean(f) for f in sorted(glob.glob('../abu/raw/abu-*.png')) if '_try' not in f}
b0, b1 = bbox(res['abu-sit']), bbox(res['abu-sit-blink'])
res['abu-sit-blink'] = np.roll(res['abu-sit-blink'], (b0[3] - b1[3], int(round((b0[0] + b0[2]) / 2 - (b1[0] + b1[2]) / 2))), axis=(0, 1))
meta = {}
for n, a in res.items():
    Image.fromarray(a, 'RGBA').resize((S, S), Image.LANCZOS).save(f'{OUT}/{n}.webp', quality=86, alpha_quality=92, method=6)
    k = S / a.shape[1]; meta[n] = [round(v * k) for v in bbox(a)]
json.dump(meta, open('../abu/meta.json', 'w'), indent=1); print(meta)
