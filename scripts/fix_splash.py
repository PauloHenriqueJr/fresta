#!/usr/bin/env python3
"""Fix splash: remove white/gray background, keep only the door icon, bigger + transparent."""
from PIL import Image
import os

base = os.path.expanduser("~/Dev/fresta/apps/fresta_flutter/assets/images/")
icon = Image.open(os.path.join(base, "fresta_icon_final_concept_1_flat_1772239935761.png"))

# Convert to RGBA
icon_rgba = icon.convert("RGBA")
pixels = icon_rgba.load()
w, h = icon_rgba.size

# Remove light gray/white background
threshold = 30
for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        if r > 200 and g > 200 and b > 200 and abs(r - g) < threshold and abs(g - b) < threshold:
            pixels[x, y] = (r, g, b, 0)

# Crop to content (remove transparent edges)
bbox = icon_rgba.getbbox()
if bbox:
    icon_cropped = icon_rgba.crop(bbox)
    print(f"Cropped from {icon_rgba.size} to {icon_cropped.size}")
else:
    icon_cropped = icon_rgba

# --- Pre-Android 12 splash: bigger logo (480px) transparent PNG ---
splash_size = 480
ratio = min(splash_size / icon_cropped.width, splash_size / icon_cropped.height)
new_w = int(icon_cropped.width * ratio)
new_h = int(icon_cropped.height * ratio)
icon_resized = icon_cropped.resize((new_w, new_h), Image.LANCZOS)

output1 = os.path.join(base, "fresta_splash_logo_288.png")
icon_resized.save(output1, "PNG")
print(f"Pre-Android 12 splash: {new_w}x{new_h} -> {output1}")

# --- Android 12 splash: logo centered in 1152x1152 ---
canvas_size = 1152
logo_size = 600
ratio12 = min(logo_size / icon_cropped.width, logo_size / icon_cropped.height)
new_w12 = int(icon_cropped.width * ratio12)
new_h12 = int(icon_cropped.height * ratio12)
icon_12 = icon_cropped.resize((new_w12, new_h12), Image.LANCZOS)

canvas_12 = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
offset_x = (canvas_size - new_w12) // 2
offset_y = (canvas_size - new_h12) // 2
canvas_12.paste(icon_12, (offset_x, offset_y), icon_12)

output2 = os.path.join(base, "fresta_splash_android12.png")
canvas_12.save(output2, "PNG")
print(f"Android 12 splash: {canvas_size}x{canvas_size} (logo {new_w12}x{new_h12} centered) -> {output2}")

print("\nDone! Background removed, logo bigger, PNG transparent.")
