"""Gera a imagem de preview do watchface (mostrada no app Zepp e no seletor do relogio).

Uso:  pip install pillow && python tools/make_preview.py
Saida: assets/active2-square/images/preview.png (266 x 307, tamanho exigido pelo Active 2 Square)
       tools/mockup.png (390 x 450, tamanho real da tela, so para conferencia)

Se mudar cores/layout em watchface/active2-square/index.js, ajuste aqui tambem.
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
W, H = 390, 450
PREVIEW = (266, 307)
RADIUS = 86  # raio dos cantos da tela do Active 2 Square

THEME = {
    "background": "#000000",
    "accent": "#00d9ff",
    "time": "#ffffff",
    "label": "#8a8f98",
    "value": "#ffffff",
    "card": "#16191f",
    "barBg": "#2a2e36",
    "heart": "#ff4d6d",
    "battery": "#3ddc84",
}


def font(size, bold=False):
    name = "DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf"
    for base in ("/usr/share/fonts/truetype/dejavu", "/Library/Fonts", "C:/Windows/Fonts"):
        try:
            return ImageFont.truetype(f"{base}/{name}", size)
        except OSError:
            pass
    return ImageFont.load_default()


def centered(d, box, text, size, color, bold=False, anchor="mm"):
    x, y, w, h = box
    pos = {"mm": (x + w / 2, y + h / 2), "lm": (x, y + h / 2), "rm": (x + w, y + h / 2)}[anchor]
    d.text(pos, text, font=font(size, bold), fill=color, anchor=anchor)


def render():
    img = Image.new("RGB", (W, H), THEME["background"])
    d = ImageDraw.Draw(img)

    centered(d, (0, 36, W, 40), "SEG · 8 SET", 28, THEME["accent"], bold=True)
    centered(d, (0, 84, W, 150), "10:09", 112, THEME["time"], bold=True)

    centered(d, (40, 238, 310, 32), "META 8000", 20, THEME["label"], anchor="lm")
    centered(d, (40, 238, 310, 32), "70%", 20, THEME["accent"], anchor="rm")
    d.rounded_rectangle((40, 278, 350, 290), radius=6, fill=THEME["barBg"])
    d.rounded_rectangle((40, 278, 40 + int(310 * 0.7), 290), radius=6, fill=THEME["accent"])

    for x, label, value, color in (
        (24, "BPM", "78", THEME["heart"]),
        (140, "PASSOS", "5648", THEME["value"]),
        (256, "BATERIA", "97%", THEME["battery"]),
    ):
        d.rounded_rectangle((x, 318, x + 110, 418), radius=20, fill=THEME["card"])
        centered(d, (x, 330, 110, 26), label, 17, THEME["label"])
        centered(d, (x, 358, 110, 48), value, 32, color, bold=True)

    # recorta os cantos arredondados da tela
    mask = Image.new("L", (W, H), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, W - 1, H - 1), radius=RADIUS, fill=255)
    out = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    out.paste(img, (0, 0), mask)
    return out


if __name__ == "__main__":
    full = render()
    full.save(ROOT / "tools" / "mockup.png")
    dest = ROOT / "assets" / "active2-square" / "images" / "preview.png"
    dest.parent.mkdir(parents=True, exist_ok=True)
    full.resize(PREVIEW, Image.LANCZOS).save(dest)
    print("ok:", dest)
