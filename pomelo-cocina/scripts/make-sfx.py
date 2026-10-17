#!/usr/bin/env python3
"""Synthesize the film's ambient sounds into public/sfx/ (48 kHz mono WAV).

Deterministic (fixed seed), no downloads: light switch, milk-steamer hiss,
two-tone door chime, tap click, push whoosh, reward notes.
"""
import math
import os
import random
import struct
import wave

RATE = 48000
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "sfx")
os.makedirs(OUT, exist_ok=True)
rng = random.Random(42)


def write(name, samples):
    peak = max(1e-9, max(abs(s) for s in samples))
    gain = min(1.0, 0.9 / peak)
    with wave.open(os.path.join(OUT, f"{name}.wav"), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(RATE)
        w.writeframes(b"".join(struct.pack("<h", int(max(-1, min(1, s * gain)) * 32767)) for s in samples))


def env(i, n, attack, release):
    t = i / RATE
    total = n / RATE
    a = min(1.0, t / attack) if attack else 1.0
    r = min(1.0, (total - t) / release) if release else 1.0
    return max(0.0, min(a, r))


# Light switch: two short clicks.
n = int(0.12 * RATE)
write("switch", [(rng.uniform(-1, 1) * math.exp(-((i % int(0.05 * RATE)) / RATE) * 300)) * (0.8 if i < 0.05 * RATE else 0.5) for i in range(n)])

# Milk steamer: high-passed noise with a slow swell.
n = int(2.6 * RATE)
prev = 0.0
steam = []
for i in range(n):
    x = rng.uniform(-1, 1)
    steam.append((x - prev) * 0.35 * env(i, n, 0.25, 0.6) * (0.8 + 0.2 * math.sin(i / RATE * 9)))
    prev = x
write("steam", steam)

# Door chime: two bell tones (E6 then C6) with decaying partials.
n = int(1.6 * RATE)
chime = []
for i in range(n):
    t = i / RATE
    s = 0.0
    for start, f in ((0.0, 1318.5), (0.22, 1046.5)):
        if t >= start:
            u = t - start
            d = math.exp(-u * 3.2)
            s += d * (math.sin(2 * math.pi * f * u) + 0.4 * math.sin(2 * math.pi * f * 2.76 * u) * math.exp(-u * 6))
    chime.append(s * 0.5)
write("chime", chime)

# Tap: a soft, short click.
n = int(0.05 * RATE)
write("tap", [math.sin(2 * math.pi * 1800 * i / RATE) * math.exp(-i / RATE * 120) * 0.6 for i in range(n)])

# Whoosh: noise through a sweeping one-pole low-pass.
n = int(0.45 * RATE)
y = 0.0
whoosh = []
for i in range(n):
    p = i / n
    a = 0.02 + 0.25 * math.sin(math.pi * p)
    y += a * (rng.uniform(-1, 1) - y)
    whoosh.append(y * math.sin(math.pi * p) * 1.4)
write("whoosh", whoosh)

# Reward: three quick rising notes (C6 E6 G6), for "Order served!".
n = int(1.2 * RATE)
reward = []
for i in range(n):
    t = i / RATE
    v = 0.0
    for start, f in ((0.0, 1046.5), (0.09, 1318.5), (0.18, 1568.0)):
        if t >= start:
            u = t - start
            v += math.exp(-u * 4.5) * math.sin(2 * math.pi * f * u)
    reward.append(v * 0.4)
write("reward", reward)

print("sfx written to", os.path.normpath(OUT))
