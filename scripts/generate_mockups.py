#!/usr/bin/env python3
"""
Fresta - Play Store Mockup Generator
Gera mockups profissionais com texto de marketing para screenshots da Play Store.
Saída: 1080x1920 (proporção 9:16, tamanho ideal para Play Store).
"""

from PIL import Image, ImageDraw, ImageFont
import os
import sys

# --- CONFIG ---
OUTPUT_DIR = os.path.expanduser("~/Downloads/fresta_mockups")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Canvas dimensions (Play Store recommended: 1080x1920)
CANVAS_W = 1080
CANVAS_H = 1920

# Fresta brand colors
BG_COLOR_TOP = (15, 26, 22)       # #0F1A16 - dark green
BG_COLOR_BOTTOM = (25, 45, 35)    # slightly lighter
ACCENT_COLOR = (245, 166, 35)     # #F5A623 - orange/amber
TEXT_COLOR = (255, 255, 255)       # white
SUBTITLE_COLOR = (200, 210, 205)  # light gray-green

# Screenshot configs: (file, headline, subtitle)
SCREENSHOTS = [
    {
        "file": os.path.expanduser("~/Downloads/2026-02-28 02.01.41.jpg"),
        "headline": "Surpreenda quem\nvocê ama",
        "subtitle": "Calendários interativos com\nfotos, vídeos e mensagens",
    },
    {
        "file": os.path.expanduser("~/Downloads/2026-02-28 02.01.54.jpg"),
        "headline": "18 temas\nexclusivos",
        "subtitle": "Namoro, Casamento, Natal,\nAniversário e muito mais",
    },
    {
        "file": os.path.expanduser("~/Downloads/2026-02-28 02.02.05.jpg"),
        "headline": "Crie em\npoucos minutos",
        "subtitle": "Escolha um tema, personalize\ne compartilhe com um link",
    },
    {
        "file": os.path.expanduser("~/Downloads/2026-02-28 02.01.48.jpg"),
        "headline": "Gerencie suas\ncriações",
        "subtitle": "Acompanhe visualizações\ne edite a qualquer momento",
    },
    {
        "file": os.path.expanduser("~/Downloads/2026-02-28 02.01.31.jpg"),
        "headline": "A antecipação é\na melhor parte",
        "subtitle": "Envie um link e deixe\na magia acontecer",
    },
]


def create_gradient_bg(width, height, color_top, color_bottom):
    """Create a vertical gradient background."""
    img = Image.new("RGB", (width, height))
    draw = ImageDraw.Draw(img)
    for y in range(height):
        ratio = y / height
        r = int(color_top[0] + (color_bottom[0] - color_top[0]) * ratio)
        g = int(color_top[1] + (color_bottom[1] - color_top[1]) * ratio)
        b = int(color_top[2] + (color_bottom[2] - color_top[2]) * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    return img


def draw_rounded_rect(draw, xy, radius, fill):
    """Draw a rounded rectangle."""
    x1, y1, x2, y2 = xy
    # Main rectangle
    draw.rectangle([x1 + radius, y1, x2 - radius, y2], fill=fill)
    draw.rectangle([x1, y1 + radius, x2, y2 - radius], fill=fill)
    # Corners
    draw.pieslice([x1, y1, x1 + 2*radius, y1 + 2*radius], 180, 270, fill=fill)
    draw.pieslice([x2 - 2*radius, y1, x2, y1 + 2*radius], 270, 360, fill=fill)
    draw.pieslice([x1, y2 - 2*radius, x1 + 2*radius, y2], 90, 180, fill=fill)
    draw.pieslice([x2 - 2*radius, y2 - 2*radius, x2, y2], 0, 90, fill=fill)


def get_font(size, bold=False):
    """Try to load a nice font, fallback to default."""
    font_paths = [
        # macOS system fonts
        "/System/Library/Fonts/SFNSDisplay.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/HelveticaNeue.ttc",
        "/Library/Fonts/Arial.ttf",
        "/System/Library/Fonts/SFNS.ttf",
        "/System/Library/Fonts/SFCompact.ttf",
    ]
    if bold:
        bold_paths = [
            "/System/Library/Fonts/SFNSDisplayCondensed-Bold.otf",
            "/Library/Fonts/Arial Bold.ttf",
            "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        ]
        font_paths = bold_paths + font_paths

    for path in font_paths:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue

    # Fallback
    try:
        return ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", size)
    except Exception:
        return ImageFont.load_default()


def create_mockup(config, index):
    """Create a single mockup image."""
    # Create gradient background
    canvas = create_gradient_bg(CANVAS_W, CANVAS_H, BG_COLOR_TOP, BG_COLOR_BOTTOM)
    draw = ImageDraw.Draw(canvas)

    # --- Draw accent bar at top ---
    draw.rectangle([0, 0, CANVAS_W, 8], fill=ACCENT_COLOR)

    # --- Draw headline text ---
    font_headline = get_font(72, bold=True)
    font_subtitle = get_font(36)

    # Headline position
    headline_y = 100
    for line in config["headline"].split("\n"):
        bbox = draw.textbbox((0, 0), line, font=font_headline)
        text_w = bbox[2] - bbox[0]
        x = (CANVAS_W - text_w) // 2
        draw.text((x, headline_y), line, font=font_headline, fill=TEXT_COLOR)
        headline_y += bbox[3] - bbox[1] + 15

    # Subtitle position
    subtitle_y = headline_y + 25
    for line in config["subtitle"].split("\n"):
        bbox = draw.textbbox((0, 0), line, font=font_subtitle)
        text_w = bbox[2] - bbox[0]
        x = (CANVAS_W - text_w) // 2
        draw.text((x, subtitle_y), line, font=font_subtitle, fill=SUBTITLE_COLOR)
        subtitle_y += bbox[3] - bbox[1] + 8

    # --- Load and place screenshot ---
    screenshot = Image.open(config["file"])

    # Calculate screenshot area (bottom 60% of canvas with padding)
    screenshot_area_top = subtitle_y + 50
    screenshot_area_bottom = CANVAS_H - 60
    screenshot_area_height = screenshot_area_bottom - screenshot_area_top

    # Scale screenshot to fit
    ss_w, ss_h = screenshot.size
    scale = min(
        (CANVAS_W - 120) / ss_w,
        screenshot_area_height / ss_h
    )
    new_w = int(ss_w * scale)
    new_h = int(ss_h * scale)
    screenshot = screenshot.resize((new_w, new_h), Image.LANCZOS)

    # Center horizontally
    ss_x = (CANVAS_W - new_w) // 2
    ss_y = screenshot_area_top

    # Draw phone frame shadow (subtle)
    shadow_offset = 8
    shadow_radius = 30
    draw_rounded_rect(
        draw,
        (ss_x + shadow_offset, ss_y + shadow_offset,
         ss_x + new_w + shadow_offset, ss_y + new_h + shadow_offset),
        radius=shadow_radius,
        fill=(0, 0, 0)
    )

    # Draw phone frame border
    border = 4
    draw_rounded_rect(
        draw,
        (ss_x - border, ss_y - border,
         ss_x + new_w + border, ss_y + new_h + border),
        radius=shadow_radius,
        fill=(60, 60, 60)
    )

    # Create a mask for rounded corners on the screenshot
    mask = Image.new("L", (new_w, new_h), 0)
    mask_draw = ImageDraw.Draw(mask)
    draw_rounded_rect(
        mask_draw,
        (0, 0, new_w, new_h),
        radius=shadow_radius - border,
        fill=255
    )

    # Paste screenshot with rounded corners
    canvas.paste(screenshot, (ss_x, ss_y), mask)

    # --- Draw bottom accent dots ---
    dot_y = CANVAS_H - 35
    total_dots = len(SCREENSHOTS)
    dot_spacing = 30
    start_x = (CANVAS_W - (total_dots - 1) * dot_spacing) // 2
    for i in range(total_dots):
        color = ACCENT_COLOR if i == index else (80, 90, 85)
        x = start_x + i * dot_spacing
        draw.ellipse([x - 6, dot_y - 6, x + 6, dot_y + 6], fill=color)

    # --- Save ---
    output_path = os.path.join(OUTPUT_DIR, f"fresta_mockup_{index + 1}.png")
    canvas.save(output_path, "PNG", quality=95)
    print(f"✅ Mockup {index + 1} salvo: {output_path}")
    return output_path


def main():
    print("🎨 Gerando mockups profissionais para a Play Store...")
    print(f"📁 Saída: {OUTPUT_DIR}\n")

    for i, config in enumerate(SCREENSHOTS):
        if not os.path.exists(config["file"]):
            print(f"❌ Arquivo não encontrado: {config['file']}")
            continue
        create_mockup(config, i)

    print(f"\n🎉 Pronto! {len(SCREENSHOTS)} mockups gerados em {OUTPUT_DIR}")
    print("📱 Tamanho: 1080x1920 (ideal para Play Store)")


if __name__ == "__main__":
    main()
