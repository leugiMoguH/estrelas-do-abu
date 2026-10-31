import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi
im = np.array(Image.open('key/body_base.png')).astype(float)
rgb, a = im[...,:3], im[...,3]
mx, mn = rgb.max(2), rgb.min(2)
sat = (mx-mn)/np.maximum(mx,1)
lum = rgb @ [0.299,0.587,0.114]
grey = (a>200)&(sat<0.17)&(lum>70)
grey = ndi.binary_opening(grey, iterations=2)
lab,n = ndi.label(grey)
sizes = ndi.sum(grey,lab,range(1,n+1))
keep = np.isin(lab, [i+1 for i,s in enumerate(sizes) if s>2500])
under = ndi.binary_dilation(keep, iterations=3) & (a>40)
skin_a = a.copy(); skin_a[keep] = 0
Image.fromarray(np.dstack([rgb, skin_a]).astype(np.uint8),'RGBA').save('body_skin.png')
Image.fromarray(np.dstack([rgb, np.where(under,a,0)]).astype(np.uint8),'RGBA').save('body_under.png')
sk = (skin_a>200)
print('skin lum pct', np.percentile(lum[sk],[1,5,25,50,75,95,99]))
