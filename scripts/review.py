#!/usr/bin/env python3
"""Render review images for one animation.

Renders a frame range as PNGs, then builds:
  - stills:  out/review/fNNN.png for each --stills frame
  - strips:  out/review/shot-A-B.png, start / middle / end of each --shots range
  - contact: out/review/contact-A-B.png, an evenly spaced grid of the range

Usage (from the repo root):
  python3 scripts/review.py clawd-berlin ClawdBerlin --frames 0-899 \
      --stills 0,44,125 --shots 185-335,336-485 --contact 24

Needs Pillow:  python3 -m pip install --user pillow
"""
import argparse
import os
import shutil
import subprocess
import sys

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is missing: python3 -m pip install --user pillow")

TILE = 360


def parse_range(text):
    a, b = text.split("-")
    return int(a), int(b)


def frame_path(seq, frame, first, pad):
    return os.path.join(seq, f"element-{frame:0{pad}d}.png")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project")
    ap.add_argument("composition")
    ap.add_argument("--frames", required=True, help="range to render, e.g. 0-899")
    ap.add_argument("--stills", default="", help="comma-separated frames")
    ap.add_argument("--shots", default="", help="comma-separated ranges, e.g. 185-335,336-485")
    ap.add_argument("--contact", type=int, default=24, help="tiles in the contact sheet (0 = none)")
    ap.add_argument("--skip-render", action="store_true", help="reuse the last render")
    args = ap.parse_args()

    first, last = parse_range(args.frames)
    out = os.path.join(args.project, "out", "review")
    seq = os.path.join(out, "seq")
    if not args.skip_render:
        shutil.rmtree(out, ignore_errors=True)
        subprocess.run(
            ["npx", "remotion", "render", args.composition, os.path.relpath(seq, args.project),
             "--sequence", f"--frames={first}-{last}", "--image-format=png"],
            cwd=args.project, check=True,
        )
    files = sorted(os.listdir(seq))
    pad = len(files[0].split("-")[1].split(".")[0])
    img = lambda f: Image.open(frame_path(seq, f, first, pad)).convert("RGB")

    for f in [int(x) for x in args.stills.split(",") if x]:
        shutil.copy(frame_path(seq, f, first, pad), os.path.join(out, f"f{f:03d}.png"))

    for r in [x for x in args.shots.split(",") if x]:
        a, b = parse_range(r)
        frames = [a, (a + b) // 2, b]
        strip = Image.new("RGB", (TILE * len(frames), TILE), "white")
        for k, f in enumerate(frames):
            strip.paste(img(f).resize((TILE, TILE)), (k * TILE, 0))
        strip.save(os.path.join(out, f"shot-{a}-{b}.png"))

    if args.contact:
        n = args.contact
        cols = 6 if n > 12 else 4
        rows = (n + cols - 1) // cols
        frames = [round(first + i * (last - first) / (n - 1)) for i in range(n)]
        sheet = Image.new("RGB", (TILE * cols, TILE * rows), "white")
        for k, f in enumerate(frames):
            sheet.paste(img(f).resize((TILE, TILE)), ((k % cols) * TILE, (k // cols) * TILE))
        sheet.save(os.path.join(out, f"contact-{first}-{last}.png"))
        print("contact frames:", frames)
    print("review images in", out)


if __name__ == "__main__":
    main()
