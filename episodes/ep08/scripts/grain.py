# Derive overlay-free grain tiles (signed alpha noise) from public/grain/n*.png and soft light-leak blobs.
# Plain alpha blending of these is much cheaper per frame than mix-blend-mode overlay/screen.
from PIL import Image
import numpy as np
for i in range(4):
    g = np.asarray(Image.open(f'public/grain/n{i}.png').convert('L')).astype(np.float32)
    d = g - 128
    rgba = np.zeros(g.shape + (4,), np.uint8)
    rgba[..., 0:3] = np.where(d > 0, 255, 0)[..., None]
    rgba[..., 3] = np.clip(np.abs(d) / 71 * 255, 0, 255).astype(np.uint8)
    Image.fromarray(rgba, 'RGBA').save(f'public/grain/a{i}.png')
n = 512
y, x = np.mgrid[0:n, 0:n]
a = np.clip(1 - np.hypot(x - n / 2, y - n / 2) / (n / 2), 0, 1) ** 2.2
for name, col in [('leak-warm', (255, 168, 92)), ('leak-warm2', (255, 110, 80)), ('leak-cool', (90, 255, 170)), ('leak-cool2', (70, 200, 225))]:
    im = np.zeros((n, n, 4), np.uint8); im[..., 0:3] = col; im[..., 3] = (a * 255).astype(np.uint8)
    Image.fromarray(im, 'RGBA').save(f'public/grain/{name}.png')
