"""Tutores e Abu: chroma -> alpha, recorte ao conteudo, webp em src/art/assets/d5/. Uso: python build_misc.py [tutors|abu]"""
import sys, glob, os, numpy as np
from PIL import Image
from build_layers import key  # reutiliza o keyer (executa o build de camadas: ver guarda abaixo)
OUT = os.path.abspath('../../../../src/art/assets/d5'); os.makedirs(OUT, exist_ok=True)
def process(src, name, height):
    a = key(src, band=2)
    im = Image.fromarray(a, 'RGBA'); box = im.getchannel('A').point(lambda v: 255 if v > 20 else 0).getbbox()
    im = im.crop(box); w = round(im.width * height / im.height)
    im.resize((w, height), Image.LANCZOS).save(f'{OUT}/{name}.webp', quality=86, alpha_quality=92, method=6)
    print('ok', name, (w, height))
if __name__ == '__main__':
    what = sys.argv[1] if len(sys.argv) > 1 else 'tutors'
    if what == 'tutors':
        for f in sorted(glob.glob('../tutors/raw/tutor-*.png')): process(f, os.path.basename(f)[:-4], 640)
    if what == 'abu':
        for f in sorted(glob.glob('../abu/raw/abu-*.png')):
            if '_try' not in f: process(f, os.path.basename(f)[:-4], 640)
