# Join screenshots into one sheet: sheet.py out.png a.png b.png ...
import sys
from PIL import Image
out, names = sys.argv[1], sys.argv[2:]
ims = [Image.open(n) for n in names]
w, h = ims[0].size
cols = 3 if len(ims) > 4 else 2
sheet = Image.new('RGB', (w * cols, h * ((len(ims) + cols - 1) // cols)))
for i, im in enumerate(ims):
    sheet.paste(im, ((i % cols) * w, (i // cols) * h))
sheet.save(out)
