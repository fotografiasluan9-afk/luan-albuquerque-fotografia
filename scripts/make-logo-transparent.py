from PIL import Image
from pathlib import Path

brand = Path("assets/brand")


def process(src_name: str, dst_name: str) -> None:
    src = brand / src_name
    img = Image.open(src).convert("RGBA")
    out = []
    for r, g, b, a in img.getdata():
        if a < 16:
            out.append((255, 255, 255, 0))
            continue
        # dark background pixels -> transparent
        if r < 50 and g < 60 and b < 50:
            out.append((255, 255, 255, 0))
            continue
        # light logo ink -> solid white
        if (r + g + b) / 3 > 140:
            out.append((255, 255, 255, 255))
        else:
            out.append((r, g, b, a))
    img.putdata(out)

    bbox = img.getbbox()
    if not bbox:
        raise RuntimeError(f"No visible content in {src_name}")
    pad = 20
    left = max(0, bbox[0] - pad)
    top = max(0, bbox[1] - pad)
    right = min(img.width, bbox[2] + pad)
    bottom = min(img.height, bbox[3] + pad)
    img = img.crop((left, top, right, bottom))
    dst = brand / dst_name
    img.save(dst, optimize=True)
    print(f"saved {dst.name} size={img.size} bbox={bbox}")


process("logo-white.png", "logo-mark.png")
process("logo-principal.png", "logo-mark-cream.png")
