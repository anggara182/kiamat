"""EP02 original score (synthesised), D minor, 84 BPM, cue points from src/data/episode.json.
Arc: hook panic pulse -> drop on "true" -> rumour motif that gains a layer with every whisper -> panic build (stings on
"three"/"plan") -> mob: heartbeat + tremolo crescendo -> DEAD SILENCE on "stone" -> release chord on "clean" -> sad piano ->
solemn pad under the quote -> cliffhanger tremolo + riser, hard cut -> title: deep bass drop.
usage: python3 scripts/music.py  -> public/audio/music.wav
"""
import json, os, re, sys
import numpy as np
sys.path.insert(0, os.path.dirname(__file__))
from audiolib import *  # noqa

ROOT = os.path.join(os.path.dirname(__file__), "..")
ep = json.load(open(os.path.join(ROOT, "src", "data", "episode.json")))
S = {s["id"]: s for s in ep["shots"]}
D = ep["durationSec"]
N = int((D + 0.5) * SR)


def w(sid, pat, which=0):
    hits = [x["start"] for x in S[sid]["words"] if re.search(pat, x["text"], re.I)]
    return hits[which]


BEAT = 60 / 84
hz = note_hz
t_true = w(2, r"^true")
t_whisp = S[3]["start"]
t_panic = S[8]["start"]
t_three, t_plan = w(12, r"^three"), w(12, r"^plan")
t_mob = S[13]["start"]
t_stone = w(17, r"^stone")
t_crack = w(18, r"^crackled")
t_clean = w(19, r"^clean")
t_after = S[20]["start"]
t_quote = S[22]["start"]
t_cliff = S[24]["start"]
t_title = S[25]["start"]

mus = np.zeros((N, 2), np.float32)
low = np.zeros((N, 2), np.float32)
CH = {"Dm": ["D3", "F3", "A3"], "Bb": ["D3", "F3", "Bb3"], "Gm": ["D3", "G3", "Bb3"], "A": ["E3", "A3", "C#4"],
      "F": ["F3", "A3", "C4"], "C": ["E3", "G3", "C4"], "Dmb9": ["D3", "Eb3", "A3"]}
BASS = {"Dm": "D2", "Bb": "Bb1", "Gm": "G1", "A": "A1", "F": "F2", "C": "C2", "Dmb9": "D2"}


def bass(c, t0, dur, g):
    place(low, stereo(np.sin(2 * np.pi * hz(BASS[c]) * T(dur)) * adsr(len(T(dur)), 0.04, 0.1, 0.9, 0.25) * g), t0)


# 1. hook: panic 16th pulse on D with a low drone, accent on beats; drop out at "true"
place(mus, pad([hz(n) for n in CH["Dmb9"]], t_true + 0.2, cutoff=1300, a=0.05, r=0.05) * 0.45, 0)
k, j = 0.0, 0
while k < t_true - 0.05:
    place(mus, pluck(hz(["D3", "D3", "F3", "Eb3"][j % 4]), 0.25, 2200) * (0.45 if j % 4 == 0 else 0.3), k)
    if j % 4 == 0:
        place(low, heartbeat_kick() * 0.5, k)
    k += BEAT / 4; j += 1
cut = int(t_true * SR)

# 2. whisper chain: a 4-note rumour motif that adds a layer on every new whisper shot
motif = ["A4", "F4", "E4", "D4"]
layer_starts = [S[i]["start"] for i in (3, 4, 5, 6, 7)]
cur = t_true + 0.35
while cur < t_panic:
    nlay = sum(1 for s in layer_starts if s <= cur)
    for m, note in enumerate(motif):
        tt = cur + m * BEAT / 2
        if tt >= t_panic:
            break
        place(mus, piano(hz(note), 1.6, 0.45), tt)
        if nlay >= 2:
            place(mus, pluck(hz(note) / 2, 0.3, 1600) * 0.22, tt)
        if nlay >= 4:
            place(mus, piano(hz(note) * 2, 1.0, 0.18), tt + 0.04)
    place(mus, pad([hz(n) for n in CH["Dm"]], 2 * BEAT + 0.4, cutoff=900 + 150 * nlay, a=0.4, r=0.4) * (0.22 + 0.05 * nlay), cur)
    bass("Dm", cur, 2 * BEAT, 0.14 + 0.03 * nlay)
    cur += 2 * BEAT

# 3. panic build: faster 8ths over Dm Bb Gm A, stings on "three" and "plan"
prog = ["Dm", "Bb", "Gm", "A"]
cur, i = t_panic, 0
while cur < t_mob - 0.02:
    c = prog[i % 4]; dur = min(2 * BEAT, t_mob - cur)
    p = (cur - t_panic) / max(t_mob - t_panic, 1e-3)
    place(mus, strings([hz(n) for n in CH[c]] + [hz(CH[c][0]) * 2], dur + 0.3, a=0.12, r=0.25) * (0.3 + 0.35 * p), cur)
    bass(c, cur, dur, 0.2 + 0.15 * p)
    for b in range(int(dur / (BEAT / 2))):
        place(mus, pluck(hz(BASS[c]) * 2, 0.22, 1400 + 2400 * p) * (0.22 + 0.25 * p), cur + b * BEAT / 2)
    cur += dur; i += 1
for t in (t_three, t_plan):
    place(mus, strings([hz("D4"), hz("Eb4"), hz("A4")], 0.9, a=0.005, r=0.6) * 0.5, t)

# 4. mob: heartbeat + tremolo strings crescendo, DEAD SILENCE from "stone" until the speaker crackles
dur_m = t_stone - t_mob
tt = T(dur_m)
trem = (0.55 + 0.45 * np.sin(2 * np.pi * 10 * tt)) * np.linspace(0.35, 1.0, len(tt))
place(mus, strings([hz("D3"), hz("Eb3"), hz("A3"), hz("D4")], dur_m, a=0.2, r=0.02) * trem[:, None] * 0.5, t_mob)
k = t_mob
while k < t_stone - 0.05:
    p = (k - t_mob) / dur_m
    place(low, heartbeat_kick() * (0.5 + 0.4 * p), k)
    place(low, heartbeat_kick() * (0.3 + 0.3 * p), k + 0.17)
    k += 0.75 * (1 - 0.45 * p)
place(mus, swell(min(1.4, dur_m), 300, 7000) * 0.2, t_stone - min(1.4, dur_m))

# 5. release on "clean": a warm major chord (F) that resolves the tension
place(mus, strings([hz("F3"), hz("A3"), hz("C4"), hz("F4")], t_after - t_clean + 1.2, a=0.6, r=1.0) * 0.4, t_clean)
place(mus, piano(hz("F3"), 3.0, 0.6) + piano(hz("C4"), 3.0, 0.5), t_clean)
bass("F", t_clean, t_after - t_clean + 0.5, 0.18)

# 6. aftermath: sad, sparse piano (Dm / Bb)
for dt, n, v in [(0.2, "D4", 0.55), (1.0, "F4", 0.45), (1.8, "A4", 0.45), (2.7, "Bb3", 0.5), (3.6, "D4", 0.45)]:
    if t_after + dt < t_quote - 0.2:
        place(mus, piano(hz(n), 2.6, v), t_after + dt)
place(mus, pad([hz("D3"), hz("A3")], t_quote - t_after + 0.4, cutoff=800, a=0.8, r=0.6) * 0.25, t_after)

# 7. quote: solemn low pad + a soft low note under the verse
place(mus, pad([hz("D2"), hz("A2"), hz("D3"), hz("F3")], t_cliff - t_quote + 0.4, cutoff=900, a=1.0, r=0.6) * 0.42, t_quote)
place(low, deep_drop(3.0, 70, 36, 1.2, 0.35), t_quote)
for dt, n in [(0.6, "A4"), (2.4, "F4"), (4.2, "E4"), (5.6, "D4")]:
    if t_quote + dt < t_cliff - 0.2:
        place(mus, piano(hz(n), 2.6, 0.4), t_quote + dt)

# 8. cliffhanger: tremolo + riser, HARD CUT at the title
dur_c = t_title - t_cliff
tt = T(dur_c)
trem = (0.55 + 0.45 * np.sin(2 * np.pi * 9 * tt)) * np.linspace(0.3, 1.0, len(tt))
place(mus, strings([hz("D3"), hz("Eb3"), hz("A3")], dur_c, a=0.4, r=0.01) * trem[:, None] * 0.45, t_cliff)
place(mus, swell(dur_c, 200, 8000, seed=13) * 0.28, t_cliff)
tcut = int(t_title * SR)

# 9. title: deep bass drop + low chord (own buses)
mus2 = np.zeros_like(mus); low2 = np.zeros_like(low)
dur_t = D - t_title
place(low2, deep_drop(dur_t + 1.0, 100, 28, 1.8, 1.0), t_title)
place(mus2, pad([hz("D2"), hz("A2"), hz("D3"), hz("F3")], dur_t, cutoff=1000, a=0.05, r=1.6) * 0.5, t_title)


def bounce(m, l):
    a = reverb(m, 2.6, 0.3); b = reverb(l, 1.4, 0.1, tone=2500)
    n = min(len(a), len(b), N)
    return a[:n] + b[:n] * 1.1


pre = bounce(mus, low)
fd = int(0.02 * SR)
pre[cut - fd: cut] *= np.linspace(1, 0, fd)[:, None]                 # drop out on "true"
pre[cut: int((t_true + 0.33) * SR)] = 0
s0, s1 = int(t_stone * SR) + int(0.05 * SR), int(t_crack * SR)
pre[s0 - fd: s0] *= np.linspace(1, 0, fd)[:, None]                   # dead silence after the stone
pre[s0: s1] = 0
pre[tcut - fd: tcut] *= np.linspace(1, 0, fd)[:, None]               # hard cut into the title
pre[tcut:] = 0
out = pre + bounce(mus2, low2)
out = out[: int(D * SR)]
out = hp(out, 35)
out = out - 0.45 * lp(out, 140)
out = fade(out, 0, 1.2)
out = to_lufs(out, -20)
out = peak_to(out, -1.0) if np.abs(out).max() > db(-1.0) else out
save(os.path.join(ROOT, "public", "audio", "music.wav"), out)
print("music.wav", round(D, 2), "s, LUFS", round(lufs(out), 1))
