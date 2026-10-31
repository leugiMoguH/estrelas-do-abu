"""ConstrÃ³i src/art/assets/d4/*.webp a partir das geraÃ§Ãµes brutas (chroma verde) e do corpo-molde.
Uso: python build_layers.py  (a partir desta pasta). SÃ³ operaÃ§Ãµes locais (Pillow/NumPy/SciPy)."""
import glob, os, numpy as np
from PIL import Image
from scipy import ndimage as ndi
OUT = os.path.abspath('../../../../src/art/assets/d4'); os.makedirs(OUT, exist_ok=True)
SIZE = (768, 1152)
SOURCES = {'hair-comprido': 'hair_long.png', 'outer-gabardina': 'coat_open.png'}
for d in ('rawA', 'rawB', 'rawC'):
    for f in glob.glob(f'{d}/*.png'):
        n = os.path.basename(f)[:-4]
        if '_try' not in n: SOURCES[n] = f
SOURCES['hair-comprido'] = 'fixed/hair-comprido.png'  # hair_long sem restos do corpo (diff vs molde)
SOURCES['hair-rabo'] = 'rawD/hair-rabo.png'        # 2a geracao: cobre a coroa
SOURCES['hair-coque'] = 'fixed/hair-coque.png'     # rawD try1 + tampa de cabelo local (fix_coque, já RGBA)
def key(path, lo=90, hi=150, band=3):
    if path.startswith('fixed/'): return np.array(Image.open(path).convert('RGBA'))
    im = np.array(Image.open(path).convert('RGB')).astype(float)
    d = np.sqrt(((im - [0, 255, 0]) ** 2).sum(2))
    a = np.clip((d - lo) / (hi - lo), 0, 1)
    a = np.clip((a - 0.2) / 0.8, 0, 1)                      # encolhe 1 px de franja
    edge = ndi.binary_dilation(a < 0.5, iterations=band) & (a > 0)
    r, g, b = im[..., 0], im[..., 1], im[..., 2]
    lim = np.maximum(r, b) + 6
    g = np.where(edge & (g > lim), lim, g)                   # despill sÃ³ junto Ã s bordas
    # alpha: remove ilhas minÃºsculas (restos soltos)
    lab, n = ndi.label(a > 0.3); sizes = ndi.sum(a > 0.3, lab, range(1, n + 1))
    keep = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s > 400])
    a = np.where(keep, a, 0)
    return np.dstack([r, g, b, a * 255]).astype(np.uint8)
BODY_A = np.array(Image.open('key/body_base.png'))[..., 3] > 128
def back_fill(arr):
    """Preenche o «cabelo de trás» que o gerador deixou vazio entre a cabeça e o volume do cabelo (zona da cabeça, y<300)
    com a cor do cabelo vizinho (difusão normalizada), ligeiramente escurecida."""
    a = arr[..., 3] > 128
    closed = ndi.binary_closing(a, structure=np.ones((3, 3)), iterations=38)
    yy, xx = np.mgrid[0:arr.shape[0], 0:arr.shape[1]]
    gap = closed & ~a & ~ndi.binary_dilation(BODY_A, iterations=2) & (yy < 300) & (np.abs(xx - 507) < 190)
    gap = ndi.binary_opening(gap, iterations=3)
    if gap.sum() < 200: return arr
    w = a.astype(float); num = np.stack([ndi.gaussian_filter(arr[..., c].astype(float) * w, 14) for c in range(3)], -1)
    den = np.maximum(ndi.gaussian_filter(w, 14), 1e-3)[..., None]
    col = np.clip(num / den * 0.62, 0, 255)
    out = arr.copy(); out[gap, :3] = col[gap]; out[gap, 3] = 255
    out[..., 3] = np.maximum(out[..., 3], (ndi.gaussian_filter(gap.astype(float), 1.5) * 255).astype(np.uint8))
    return out
def save(arr, name):
    Image.fromarray(arr, 'RGBA').resize(SIZE, Image.LANCZOS).save(f'{OUT}/{name}.webp', quality=86, alpha_quality=92, method=6)
if __name__ == '__main__':
    for n, f in sorted(SOURCES.items()):
        arr = key(f)
        if n.startswith('hair-') and n != 'hair-coque': arr = back_fill(arr)
        save(arr, n); print('ok', n)
    for n in ('body_skin', 'body_under'):
        save(np.array(Image.open(f'{n}.png').convert('RGBA')), n); print('ok', n)
