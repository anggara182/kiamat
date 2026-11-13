"""EP03 original score (synthesised), D minor, 88 BPM, cue points from src/data/episode.json.
Arc: fire hook (drums + low brass) -> ash dawn (grief pad) -> rumour motif returns (callback to Ch2) -> crowd build ->
split homes (tense strings) -> flame hit -> vanishing (near silence) -> scarcity (sparse) -> the man from the ashes
(warm, seductive major chords with a wrong note) -> stadium swell -> braam on "knees" -> solemn quote -> marching
cliffhanger with riser, hard cut -> title deep bass drop.
usage: python3 scripts/music.py -> public/audio/music.wav"""
import json, os, re, sys
import numpy as np
sys.path.insert(0, os.path.dirname(__file__))
from audiolib import *  # noqa

ROOT = os.path.join(os.path.dirname(__file__), "..")
ep = json.load(open(os.path.join(ROOT, "src", "data", "episode.json")))
S = {s["id"]: s for s in ep["shots"]}
D = ep["durationSec"]
N = int((D + 0.5) * SR)
BEAT = 60 / 88
hz = note_hz


def w(sid, pat, which=0):
    return [x["start"] for x in S[sid]["words"] if re.search(pat, x["text"], re.I)][which]


st = lambda i: S[i]["start"]
mus = np.zeros((N, 2), np.float32); low = np.zeros((N, 2), np.float32)
CH = {"Dm": ["D3", "F3", "A3"], "Bb": ["D3", "F3", "Bb3"], "Gm": ["D3", "G3", "Bb3"], "A": ["E3", "A3", "C#4"],
      "F": ["F3", "A3", "C4"], "C": ["E3", "G3", "C4"], "Dmb9": ["D3", "Eb3", "A3"], "Fadd#11": ["F3", "A3", "B3", "C4"]}
BASS = {"Dm": "D2", "Bb": "Bb1", "Gm": "G1", "A": "A1", "F": "F2", "C": "C2", "Dmb9": "D2", "Fadd#11": "F2"}


def bass(c, t0, dur, g):
    place(low, stereo(np.sin(2 * np.pi * hz(BASS[c]) * T(dur)) * adsr(len(T(dur)), 0.04, 0.1, 0.9, 0.25) * g), t0)


def drums(t0, t1, gain, dens=1.0):
    k = t0; j = 0
    while k < t1 - 0.05:
        place(low, heartbeat_kick() * gain * (1.0 if j % 4 == 0 else 0.6), k)
        if j % 2 == 1:
            place(mus, tick(0.06, 1800) * 0.25 * gain, k)
        k += BEAT / (2 * dens); j += 1


# 1 fire hook + 2 ash dawn
t_ash = st(2); t_wh = st(3)
place(mus, pad([hz(n) for n in CH["Dmb9"]], t_ash + 0.3, cutoff=1200, a=0.05, r=0.3) * 0.45, 0)
drums(0, t_ash, 0.7, 1.0)
place(low, braam(2.5, "D1", 0.6), 0.0)
place(mus, strings([hz("D3"), hz("A3"), hz("D4")], t_wh - t_ash + 0.5, a=0.8, r=0.6) * 0.35, t_ash)
place(mus, piano(hz("A4"), 2.4, 0.45), t_ash + 0.3); place(mus, piano(hz("F4"), 2.4, 0.4), t_ash + 1.2)
# 3–5 rumour motif returns (Ch2 callback), growing over the graffiti and posters
motif = ["A4", "F4", "E4", "D4"]
cur = t_wh
while cur < st(6) - 0.05:
    for m, n in enumerate(motif):
        tt = cur + m * BEAT / 2
        if tt < st(6) - 0.05:
            place(mus, piano(hz(n), 1.4, 0.45), tt); place(mus, pluck(hz(n) / 2, 0.3, 1500) * 0.25, tt)
    bass("Dm", cur, 2 * BEAT, 0.2)
    cur += 2 * BEAT
# 6–7 crowd build: big strings + drums
prog = ["Dm", "Bb", "Gm", "A"]; cur, i = st(6), 0
while cur < st(8) - 0.05:
    c = prog[i % 4]; dur = min(2 * BEAT, st(8) - cur)
    place(mus, strings([hz(n) for n in CH[c]] + [hz(CH[c][0]) * 2], dur + 0.3, a=0.1, r=0.25) * 0.55, cur)
    bass(c, cur, dur, 0.32); cur += dur; i += 1
drums(st(6), st(8), 0.85, 1.0)
# 8–9 split homes: tense tremolo
d89 = st(10) - st(8); tt = T(d89)
place(mus, strings([hz("D3"), hz("Eb3"), hz("A3")], d89, a=0.1, r=0.05) * ((0.6 + 0.4 * np.sin(2 * np.pi * 8 * tt))[:, None]) * 0.42, st(8))
# 10 flame: hit, then 11–12 near silence (drone only)
t_fl = w(10, r"^flame")
place(low, sub_hit(3.0, 66, 30, 0.9), t_fl); place(mus, strings([hz("D4"), hz("Eb4"), hz("A4")], 0.8, a=0.005, r=0.5) * 0.5, t_fl)
dq = st(13) - st(11)
place(mus, pad([hz("D2"), hz("A2")], dq + 0.4, cutoff=500, a=0.6, r=0.6) * 0.3, st(11))
# 13–14 scarcity: sparse piano
for dt, n in [(0.2, "D4"), (1.4, "C4"), (2.6, "A3"), (3.8, "Bb3"), (5.0, "A3")]:
    if st(13) + dt < st(15) - 0.2:
        place(mus, piano(hz(n), 2.4, 0.42), st(13) + dt)
# 15–18 the man from the ashes: warm, seductive F major with a wrong note (#11)
cur, i = st(15), 0
seq = ["F", "Fadd#11", "Bb", "F"]
while cur < st(19) - 0.05:
    c = seq[i % 4]; dur = min(4 * BEAT, st(19) - cur)
    place(mus, pad([hz(n) for n in CH[c]] + [hz(CH[c][0]) * 2], dur + 0.5, cutoff=1800, a=0.6, r=0.6) * 0.45, cur)
    place(mus, piano(hz(CH[c][-1]) * 2, 2.5, 0.35), cur + 0.1)
    bass(c, cur, dur, 0.18); cur += dur; i += 1
# 19–21 stadium swell, braam on "knees"
d1921 = st(22) - st(19)
place(mus, strings([hz("F3"), hz("A3"), hz("C4"), hz("F4"), hz("A4")], d1921 + 0.3, a=1.2, r=0.3) * 0.5, st(19))
place(low, stereo(np.sin(2 * np.pi * hz("F1") * T(d1921)) * adsr(len(T(d1921)), 1.0, 0.1, 1.0, 0.3) * 0.25), st(19))
place(low, sub_hit(2.5, 60, 30, 0.7), w(20, r"^sent"))
place(mus, lp(braam(3.5, "D1", 1.0), 700, 4) * 0.8, w(21, r"^knees"))
# 22 quote: solemn
place(mus, pad([hz("D2"), hz("A2"), hz("D3"), hz("F3")], st(23) - st(22) + 0.4, cutoff=900, a=1.0, r=0.6) * 0.42, st(22))
for dt, n in [(0.6, "A4"), (2.2, "F4"), (3.8, "E4"), (5.2, "D4")]:
    if st(22) + dt < st(23) - 0.2:
        place(mus, piano(hz(n), 2.6, 0.4), st(22) + dt)
# 23 cliffhanger: marching pulse + riser, hard cut
t_t = st(24); dc = t_t - st(23)
k = st(23)
while k < t_t - 0.05:
    place(low, heartbeat_kick() * 0.55, k); k += BEAT
place(mus, strings([hz("D3"), hz("Eb3"), hz("A3")], dc, a=0.4, r=0.01) * 0.4, st(23))
place(mus, swell(dc, 200, 8000, seed=17) * 0.28, st(23))
# 24 title (own buses)
mus2 = np.zeros_like(mus); low2 = np.zeros_like(low)
dt_ = D - t_t
place(low2, deep_drop(dt_ + 1.0, 100, 28, 1.8, 1.0), t_t)
place(mus2, pad([hz("D2"), hz("A2"), hz("D3"), hz("F3")], dt_, cutoff=1000, a=0.05, r=1.6) * 0.5, t_t)


def bounce(m, l):
    a = reverb(m, 2.6, 0.3); b = reverb(l, 1.4, 0.1, tone=2500)
    n = min(len(a), len(b), N); return a[:n] + b[:n] * 1.1


pre = bounce(mus, low)
fd = int(0.02 * SR); cut = int(t_t * SR)
pre[cut - fd: cut] *= np.linspace(1, 0, fd)[:, None]; pre[cut:] = 0
out = pre + bounce(mus2, low2)
out = out[: int(D * SR)]
out = hp(out, 35); out = out - 0.45 * lp(out, 140); out = fade(out, 0, 1.2)
out = to_lufs(out, -21)
out = peak_to(out, -1.0) if np.abs(out).max() > db(-1.0) else out
save(os.path.join(ROOT, "public", "audio", "music.wav"), out)
print("music.wav", round(D, 2), "s, LUFS", round(lufs(out), 1))
