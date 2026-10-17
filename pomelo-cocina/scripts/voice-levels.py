#!/usr/bin/env python3
"""Per-frame loudness of each voiceover line, for Marcello's mouth.

Reads public/voiceover/<id>.wav (16-bit PCM) and writes
public/voiceover/levels.json: { id: [level 0..1 per frame at 30 fps] },
normalised per line so its loudest frame is 1.
"""
import array
import json
import math
import os
import wave

FPS = 30
DIR = os.path.join(os.path.dirname(__file__), "..", "public", "voiceover")
levels = {}
for name in sorted(os.listdir(DIR)):
    if not name.endswith(".wav"):
        continue
    with wave.open(os.path.join(DIR, name)) as w:
        rate, ch = w.getframerate(), w.getnchannels()
        data = array.array("h", w.readframes(w.getnframes()))
    if ch > 1:
        data = data[::ch]
    per = rate // FPS
    rms = []
    for i in range(0, len(data), per):
        chunk = data[i : i + per]
        rms.append(math.sqrt(sum(x * x for x in chunk) / max(1, len(chunk))) if chunk else 0.0)
    peak = max(rms) or 1.0
    levels[name[:-4]] = [round(min(1.0, r / peak), 3) for r in rms]
with open(os.path.join(DIR, "levels.json"), "w") as f:
    json.dump(levels, f)
print({k: len(v) for k, v in levels.items()})
