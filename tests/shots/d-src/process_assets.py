from pathlib import Path
import json
import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent
SPRITES = ['girl_happy', 'girl_surprised', 'girl_outfit2', 'abu_happy', 'abu_curious']
NAMES = ['reference', *SPRITES, 'campus']
report = {}
for name in NAMES:
    source = ROOT / f'{name}.png'
    im = Image.open(source).convert('RGBA')
    if name in SPRITES:
        # Preserve the chroma originals for reproducible, non-destructive processing.
        original = ROOT / f'{name}_green.png'
        if not original.exists():
            im.save(original)
        else:
            im = Image.open(original).convert('RGBA')
        rgb = np.asarray(im)[..., :3].astype(np.float32)
        r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
        dominant = (g > r + 8) & (g > b + 8)
        alpha = np.ones(g.shape, dtype=np.float32)
        estimate = np.clip((255 - g + np.minimum(r, b)) / 255, 0, 1)
        alpha[dominant] = estimate[dominant]
        alpha[dominant & (alpha < 0.06)] = 0
        # Reverse green compositing on partially covered outline pixels.
        partial = dominant & (alpha > 0) & (alpha < 1)
        safe = np.maximum(alpha, 0.001)
        for c in (0, 2):
            rgb[..., c][partial] = np.clip(rgb[..., c][partial] / safe[partial], 0, 255)
        rgb[..., 1][partial] = np.clip((g[partial] - 255 * (1 - alpha[partial])) / safe[partial], 0, 255)
        rgb[alpha == 0] = 0
        rgba = np.dstack((np.clip(rgb, 0, 255), np.rint(alpha * 255))).astype(np.uint8)
        im = Image.fromarray(rgba)
        im.save(source)
    im.save(ROOT / f'{name}.webp', 'WEBP', quality=88, method=6, exact=True)
    decoded = Image.open(ROOT / f'{name}.webp').convert('RGBA')
    a = np.asarray(decoded).astype(np.int16)
    visible_green = (a[..., 3] > 0) & (a[..., 1] > a[..., 0] + 25) & (a[..., 1] > a[..., 2] + 25)
    report[name] = {'size': list(im.size), 'webp_KiB': round((ROOT / f'{name}.webp').stat().st_size / 1024, 1), 'transparent_pixels': int((a[..., 3] == 0).sum()), 'visible_green_dominant_pixels': int(visible_green.sum()) if name in SPRITES else None}

# Inspect actual compressed outputs on neutral light/dark backgrounds.
sheet = Image.new('RGB', (1500, 960), '#FFF4DF')
draw = ImageDraw.Draw(sheet)
for i, name in enumerate(SPRITES):
    im = Image.open(ROOT / f'{name}.webp').convert('RGBA')
    im.thumbnail((280, 440))
    for row, color in enumerate(('#FFF4DF', '#1D2147')):
        x, y = i * 300, row * 480
        draw.rectangle((x, y, x + 299, y + 479), fill=color)
        sheet.paste(im, (x + (300 - im.width) // 2, y + 25), im)
        draw.text((x + 8, y + 460), name, fill='#B79CFF' if row else '#1D2147')
sheet.save(ROOT / 'cutout_review.png')
(ROOT / 'validation.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print(json.dumps(report, indent=2))
