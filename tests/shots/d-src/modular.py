"""Piloto modular de D: 2 expressões x 2 roupas x 2 tons de pele = 8 combinações.
Só operações locais (Pillow/NumPy), sem geração de imagem. Camadas: base (roupa) + rosto transplantado + recolor da pele por máscara de cor.
Uso (na raiz do projeto): python tests/shots/d-src/modular.py"""
import numpy as np
from PIL import Image, ImageFilter

D = 'src/art/assets/d/'
OUT = 'src/art/assets/d3/'
W = 330
load = lambda n: (lambda a: np.pad(a, ((0, 0), (0, W - a.shape[1]), (0, 0))))(np.array(Image.open(D + n + '.webp').convert('RGBA')).astype(float))
shift = lambda a, dx, dy: np.roll(np.roll(a, dy, 0), dx, 1)

def face_patch(happy, surprised):
    """Zona do rosto que muda entre as duas expressões (limitada à cara, sem gola/roupa), com margem suave."""
    m = np.abs(happy[..., :3] - surprised[..., :3]).max(-1) > 38
    m[:50] = False; m[176:] = False; m[:, :70] = False; m[:, 240:] = False
    im = Image.fromarray((m * 255).astype('uint8')).filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(2.5))
    return np.array(im).astype(float)[..., None] / 255

def best_shift(ref, other, box=(70, 190, 60, 240), r=8):
    y0, y1, x0, x1 = box
    e = lambda dx, dy: np.abs(ref[y0:y1, x0:x1, :3] - shift(other, dx, dy)[y0:y1, x0:x1, :3]).mean()
    return min(((e(dx, dy), dx, dy) for dx in range(-r, r + 1) for dy in range(-r, r + 1)))[1:]

def hsv(a):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mx, mn = a[..., :3].max(-1), a[..., :3].min(-1)
    dl = mx - mn + 1e-9
    h = np.where(mx == r, ((g - b) / dl) % 6, np.where(mx == g, (b - r) / dl + 2, (r - g) / dl + 4)) / 6
    return h, dl / (mx + 1e-9), mx

def skin_mask(a, hands=True):
    """Pele = cor laranja saturada e clara, só na cara/pescoço e nas mãos; abertura morfológica remove a luz de contorno do cabelo."""
    h, s, v = hsv(a / 255)
    m = ((h > 0.035) & (h < 0.11) & (s > 0.28) & (v > 0.62)).astype('uint8') * 255
    roi = np.zeros(m.shape, bool); roi[:225, :] = True
    if hands:  # mãos no bolso do hoodie (a gabardina amarela confundir-se-ia com a pele: só o rosto)
        roi[320:390, 135:185] = True; roi[320:395, 240:285] = True
    m = np.where(roi, m, 0)
    im = Image.fromarray(m).filter(ImageFilter.MinFilter(5)).filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
    return np.array(im).astype(float)[..., None] / 255

TONES = {'a': (1.0, 1.0, 1.0), 'b': (0.66, 0.54, 0.50)}  # b = tom mais escuro (multiplicador por canal, mantém o sombreado)

def recolor(img, mask, tone):
    out = img.copy(); k = np.array(tone)
    out[..., :3] = img[..., :3] * (1 - mask) + np.clip(img[..., :3] * k, 0, 255) * mask
    return out

def save(a, name):
    Image.fromarray(a.astype('uint8')).crop((0, 0, 317, 900)).save(OUT + name + '.webp', 'WEBP', quality=88, method=6)

if __name__ == '__main__':
    hh, hw, ch = load('girl_happy'), load('girl_surprised'), load('girl_outfit2')
    dx, dy = best_shift(hh, ch)
    p = face_patch(hh, hw)
    cs = shift(ch, dx, dy)
    cw = shift(cs * (1 - p) + hw * p, -dx, -dy)
    bases = {'hoodie-happy': hh, 'hoodie-wow': hw, 'coat-happy': ch, 'coat-wow': cw}
    sheet = Image.new('RGBA', (317 * 4, 900 * 2), (29, 33, 71, 255))
    for j, (t, k) in enumerate(TONES.items()):
        for i, (n, b) in enumerate(bases.items()):
            r = recolor(b, skin_mask(b, hands=n.startswith('hoodie')), k) if t != 'a' else b
            save(r, f'{n}-{t}')
            sheet.alpha_composite(Image.fromarray(r.astype('uint8')).crop((0, 0, 317, 900)), (317 * i, 900 * j))
    sheet.resize((317 * 2, 450)).save('tests/shots/proto/modular-sheet.png')
    print('offset coat->happy', dx, dy)
