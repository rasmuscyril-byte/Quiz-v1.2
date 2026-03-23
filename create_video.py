#!/usr/bin/env python3
"""
Whiteboard Reveal Video Generator
Creates a video presentation from whiteboard images with a left-to-right reveal effect.

Usage: python create_video.py
Images must be in the same directory:
  - 1000002103.jpg  (Fremtidens fodbold)
  - 1000002104.jpg  (Interessenter)
  - 1000002105.jpg  (Fase 1)
  - 1000002107.jpg  (Campus + 9 centre)
"""

import subprocess
import sys

# Auto-install dependencies
for pkg in ["moviepy", "Pillow", "numpy"]:
    try:
        __import__(pkg if pkg != "Pillow" else "PIL")
    except ImportError:
        subprocess.check_call([sys.executable, "-m", "pip", "install", pkg])

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from moviepy import (
    ImageClip,
    VideoClip,
    concatenate_videoclips,
)
from moviepy.video.fx import CrossFadeIn, CrossFadeOut

# --- Config ---
WIDTH, HEIGHT = 1920, 1080
FPS = 30
REVEAL_DURATION = 4.0  # seconds for left-to-right reveal
HOLD_DURATION = 3.0    # seconds to hold fully revealed image
FADE_DURATION = 0.5    # seconds for fade transitions
TITLE_DURATION = 3.0
END_DURATION = 3.0
BG_COLOR = (255, 255, 255)

IMAGE_FILES = [
    ("1000002105.jpg", "Fase 1 — Fra bænken til glade børn"),
    ("1000002104.jpg", "Interessenter — Forældre, Trænere, Klubledere"),
    ("1000002103.jpg", "Fremtidens Fodbold"),
    ("1000002107.jpg", "Campus + 9 Centre"),
]


def make_text_card(text, duration, fontsize=70):
    """Create a white card with centered black text."""
    img = Image.new("RGB", (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)

    # Try to find a good font, fall back to default
    font = None
    for path in [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
        "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf",
    ]:
        try:
            font = ImageFont.truetype(path, fontsize)
            break
        except (OSError, IOError):
            continue
    if font is None:
        font = ImageFont.load_default()

    # Handle multiline
    lines = text.split("\n")
    line_heights = []
    line_widths = []
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=font)
        line_widths.append(bbox[2] - bbox[0])
        line_heights.append(bbox[3] - bbox[1])

    total_height = sum(line_heights) + (len(lines) - 1) * 20
    y = (HEIGHT - total_height) // 2

    for i, line in enumerate(lines):
        x = (WIDTH - line_widths[i]) // 2
        draw.text((x, y), line, fill=(0, 0, 0), font=font)
        y += line_heights[i] + 20

    return ImageClip(np.array(img), duration=duration)


def fit_image_to_frame(img_path):
    """Load image, fit to 1920x1080 on white background, with padding."""
    img = Image.open(img_path).convert("RGB")

    # Add padding around the content area
    pad = 60
    max_w = WIDTH - 2 * pad
    max_h = HEIGHT - 2 * pad

    # Scale to fit
    scale = min(max_w / img.width, max_h / img.height)
    new_w = int(img.width * scale)
    new_h = int(img.height * scale)
    img = img.resize((new_w, new_h), Image.LANCZOS)

    # Center on white background
    canvas = Image.new("RGB", (WIDTH, HEIGHT), BG_COLOR)
    x_off = (WIDTH - new_w) // 2
    y_off = (HEIGHT - new_h) // 2
    canvas.paste(img, (x_off, y_off))

    return np.array(canvas), x_off, new_w


def make_reveal_clip(img_path):
    """Create a clip with left-to-right whiteboard reveal + hold."""
    frame_arr, x_offset, img_width = fit_image_to_frame(img_path)
    total_duration = REVEAL_DURATION + HOLD_DURATION
    white_frame = np.full_like(frame_arr, 255)

    def make_frame(t):
        if t >= REVEAL_DURATION:
            return frame_arr
        progress = t / REVEAL_DURATION
        # Ease-out for smoother feel
        progress = 1 - (1 - progress) ** 2
        reveal_x = int(x_offset + img_width * progress)
        result = white_frame.copy()
        if reveal_x > 0:
            result[:, :reveal_x] = frame_arr[:, :reveal_x]
        return result

    return VideoClip(make_frame, duration=total_duration)


def main():
    import os

    # Check that images exist
    missing = [f for f, _ in IMAGE_FILES if not os.path.exists(f)]
    if missing:
        print(f"Missing image files: {missing}")
        print("Please place the image files in the current directory.")
        sys.exit(1)

    print("Creating title card...")
    title = make_text_card("Fremtidens Fodbold", TITLE_DURATION, fontsize=90)

    clips = [title]

    for i, (path, label) in enumerate(IMAGE_FILES):
        print(f"Processing image {i+1}/{len(IMAGE_FILES)}: {path}")
        reveal = make_reveal_clip(path)
        clips.append(reveal)

    print("Creating end card...")
    end = make_text_card("Glade Børn\n— Det er målet.", END_DURATION, fontsize=80)
    clips.append(end)

    # Add fade transitions
    print("Adding fade transitions...")
    for i in range(len(clips)):
        effects = []
        if i > 0:
            effects.append(CrossFadeIn(FADE_DURATION))
        if i < len(clips) - 1:
            effects.append(CrossFadeOut(FADE_DURATION))
        if effects:
            clips[i] = clips[i].with_effects(effects)

    final = concatenate_videoclips(clips, method="compose", padding=-FADE_DURATION)

    output = "output_video.mp4"
    print(f"Rendering {output} at {WIDTH}x{HEIGHT}...")
    final.write_videofile(
        output,
        fps=FPS,
        codec="libx264",
        audio=False,
        preset="medium",
        bitrate="5000k",
    )
    print(f"Done! Video saved as {output}")


if __name__ == "__main__":
    main()
