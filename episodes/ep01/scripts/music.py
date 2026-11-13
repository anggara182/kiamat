"""EP01 original score (synthesised), D minor, 80 BPM, cue points from src/data/episode.json (real VO timing).
Arc: hook (tense, sparse heartbeat) -> morning (warm piano arpeggios) -> rise (strings) -> news (pulsing tension, dead stop on
"Forgotten") -> days (accelerating ticks) -> recap (build) -> HIT on "foretold" -> night (sparse piano) -> cliffhanger (tremolo + riser,
hard cut) -> title (boom + low chord).
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


def w(sid, pat):
    for x in S[sid]["words"]:
        if re.search(pat, x["text"], re.I):
            return x["start"]
    raise KeyError((sid, pat))


BEAT = 60 / 80
t_slap = w(2, r"^slowly")
t_morning = S[3]["start"]
t_rise = S[9]["start"]
t_news = S[11]["start"]
t_forgot = w(13, r"^forgotten")
t_days = S[14]["start"]
t_recap = S[15]["start"]
t_foretold = w(21, r"^foretold")
t_night = S[22]["start"]
t_cliff = S[24]["start"]
t_title = S[25]["start"]

N = int((D + 0.5) * SR)
mus = np.zeros((N, 2), np.float32)   # tonal bus (gets reverb)
low = np.zeros((N, 2), np.float32)   # sub / hits (dry-ish)
hz = note_hz

CH = {
    "F": ["F3", "A3", "C4"], "C": ["E3", "G3", "C4"], "Dm": ["D3", "F3", "A3"], "Bb": ["D3", "F3", "Bb3"],
    "Gm": ["D3", "G3", "Bb3"], "Dmb9": ["D3", "Eb3", "A3"], "A": ["E3", "A3", "C#4"],
}
BASS = {"F": "F2", "C": "C2", "Dm": "D2", "Bb": "Bb1", "Gm": "G1", "Dmb9": "D2", "A": "A1"}

# ---------- 1. hook: sub drone + heartbeat until the slap, glass tone ----------
t = T(t_morning + 1.0)
drone = (np.sin(2 * np.pi * hz("D1") * t) * 0.5 + np.sin(2 * np.pi * hz("A1") * t) * 0.3) * (0.7 + 0.3 * np.sin(2 * np.pi * 0.5 * t))
drone *= adsr(len(t), 0.4, 0.2, 1.0, 1.0)
place(low, stereo(drone * 0.35), 0)
k = 0.0
while k < t_slap - 0.1:
    place(low, heartbeat_kick() * (0.55 if int(k / BEAT) % 2 == 0 else 0.35), k)
    k += BEAT / 2 if int(k / BEAT) % 2 == 0 else BEAT * 1.5
glass_t = T(t_slap + 0.2)
glass = np.sin(2 * np.pi * hz("A5") * glass_t * (1 + 0.002 * np.sin(2 * np.pi * 4 * glass_t))) * adsr(len(glass_t), 0.8, 0.1, 1, 0.3) * 0.03
place(mus, stereo(glass, 0.8), 0)
place(low, sub_hit(2.5, 70, 35, 0.6), t_slap)                       # the slap lands with a muted low hit
place(mus, swell(t_morning - t_slap + 0.3, 300, 3000) * 0.15, t_slap)  # gentle swell into the morning

# ---------- 2. morning: piano arpeggios + warm pad (F C Dm Bb, 4 beats each) ----------
prog = ["F", "C", "Dm", "Bb"]
cur, i = t_morning, 0
while cur < t_rise:
    c = prog[i % 4]; dur = 4 * BEAT
    place(mus, pad([hz(n) for n in CH[c]], dur + 0.8, cutoff=1400, a=0.6, r=0.8) * 0.5, cur)
    place(low, stereo(np.sin(2 * np.pi * hz(BASS[c]) * T(dur)) * adsr(len(T(dur)), 0.1, 0.2, 0.8, 0.4) * 0.25), cur)
    arp = [CH[c][0], CH[c][1], CH[c][2], CH[c][1]]
    for j in range(8):
        n = arp[j % 4]
        f = hz(n) * (2 if j % 4 == 2 else 2)
        place(mus, piano(f, 2.0, vel=0.45 if j % 2 else 0.6), cur + j * BEAT / 2)
    cur += dur; i += 1

# ---------- 3. rise: strings swell over Dm Bb F C ----------
prog = ["Dm", "Bb", "F", "C"]
cur, i = t_rise, 0
while cur < t_news:
    c = prog[i % 4]; dur = 2 * BEAT
    place(mus, strings([hz(n) for n in CH[c]] + [hz(CH[c][0]) * 2], dur + 0.6, a=0.3, r=0.5) * 0.42, cur)
    place(low, stereo(np.sin(2 * np.pi * hz(BASS[c]) * T(dur)) * adsr(len(T(dur)), 0.05, 0.1, 0.9, 0.3) * 0.3), cur)
    for j in range(4):
        place(mus, piano(hz(CH[c][j % 3]) * 2, 1.5, 0.6), cur + j * BEAT / 2)
    cur += dur; i += 1

# ---------- 4. news: 16th pulse + dissonant pad + heartbeat kick, dead stop on "Forgotten" ----------
dur_news = t_forgot - t_news
place(mus, pad([hz(n) for n in CH["Dmb9"]], dur_news + 0.3, cutoff=1100, a=0.5, r=0.05) * 0.5, t_news)
cur, j = t_news, 0
while cur < t_forgot - 0.02:
    p = (cur - t_news) / max(dur_news, 1e-3)
    nn = ["D2", "D3", "D2", "Eb3"][j % 4]
    place(mus, pluck(hz(nn), 0.3, cutoff=900 + 2600 * p) * (0.35 + 0.35 * p), cur)
    if j % 4 == 0:
        place(low, heartbeat_kick() * (0.45 + 0.4 * p), cur)
    cur += BEAT / 4; j += 1
place(mus, swell(1.2, 400, 6000) * 0.18, t_forgot - 1.2)            # sucks up into the stop
mus[int(t_forgot * SR): int((t_forgot + 0.03) * SR)] *= np.linspace(1, 0, int(0.03 * SR))[:, None]
mus[int((t_forgot + 0.03) * SR): int(t_days * SR)] = 0
low[int((t_forgot + 0.03) * SR): int(t_days * SR)] = 0

# ---------- 5. days: accelerating clock ticks over a low Gm pad ----------
dur_days = t_recap - t_days
place(mus, pad([hz(n) for n in CH["Gm"]], dur_days + 0.5, cutoff=900, a=0.4, r=0.4) * 0.4, t_days)
cur = t_days
while cur < t_recap:
    p = (cur - t_days) / dur_days
    place(mus, tick() * (0.25 + 0.2 * p), cur)
    cur += 0.36 * (1 - 0.72 * p)
place(mus, swell(min(1.5, dur_days), 300, 4000) * 0.15, t_recap - min(1.5, dur_days))

# ---------- 6. recap: build Dm Bb F C (2 beats), pulse 8ths growing, into the hit ----------
prog = ["Dm", "Bb", "F", "C", "Dm", "Bb", "Gm", "A"]
cur, i = t_recap, 0
dur_rec = t_foretold - t_recap
while cur < t_foretold - 0.05:
    c = prog[i % len(prog)]; dur = min(2 * BEAT, t_foretold - cur)
    p = (cur - t_recap) / dur_rec
    place(mus, strings([hz(n) for n in CH[c]] + [hz(CH[c][0]) * 2], dur + 0.4, a=0.15, r=0.3) * (0.35 + 0.45 * p), cur)
    place(low, stereo(np.sin(2 * np.pi * hz(BASS[c]) * T(dur)) * adsr(len(T(dur)), 0.03, 0.1, 0.9, 0.2) * (0.25 + 0.2 * p)), cur)
    for j in range(int(dur / (BEAT / 2))):
        place(mus, pluck(hz(BASS[c]) * 2, 0.25, cutoff=1200 + 2500 * p) * (0.2 + 0.3 * p), cur + j * BEAT / 2)
    cur += dur; i += 1
place(mus, swell(1.6, 300, 7000) * 0.25, t_foretold - 1.6)

# ---------- 7. foretold: the HIT ----------
place(low, sub_hit(5.0, 60, 28, 1.0), t_foretold)
place(mus, strings([hz("D3"), hz("A3"), hz("D4"), hz("F4")], t_night - t_foretold + 1.0, a=0.02, r=1.6) * 0.6, t_foretold)
place(mus, piano(hz("D2"), 4.0, 1.0) + piano(hz("D3"), 4.0, 0.8), t_foretold)

# ---------- 8. night: sparse piano, soft pad ----------
dur_night = t_cliff - t_night
place(mus, pad([hz("D3"), hz("A3"), hz("F4")], dur_night + 0.5, cutoff=900, a=1.2, r=1.0) * 0.3, t_night)
for dt, n, v in [(0.3, "A4", 0.6), (1.6, "F4", 0.5), (2.9, "D4", 0.55), (4.6, "E4", 0.45), (5.9, "C4", 0.45), (7.2, "D4", 0.5)]:
    if dt < dur_night - 0.3:
        place(mus, piano(hz(n), 3.0, v), t_night + dt)

# ---------- 9. cliffhanger: tremolo strings + riser, HARD CUT at the title ----------
dur_cl = t_title - t_cliff
tt = T(dur_cl)
trem = (0.55 + 0.45 * np.sin(2 * np.pi * 9 * tt)) * np.linspace(0.3, 1.0, len(tt))
place(mus, strings([hz("D3"), hz("Eb3"), hz("A3")], dur_cl, a=0.4, r=0.01) * trem[:, None] * 0.5, t_cliff)
place(mus, swell(dur_cl, 200, 8000, seed=9) * 0.3, t_cliff)
cut = int(t_title * SR)
mus[cut - int(0.01 * SR): cut] *= np.linspace(1, 0, int(0.01 * SR))[:, None]
low[cut - int(0.01 * SR): cut] *= np.linspace(1, 0, int(0.01 * SR))[:, None]
mus[cut:] = 0; low[cut:] = 0

# ---------- 10. title: boom + low chord with a high fifth shimmer (own buses, so no tail leaks across the cut) ----------
mus2 = np.zeros_like(mus); low2 = np.zeros_like(low)
dur_t = D - t_title
place(low2, deep_drop(dur_t + 1.0, 100, 28, 1.8, 1.0), t_title)          # smooth deep bass drop (no crack)
place(mus2, pad([hz("D2"), hz("A2"), hz("D3"), hz("F3")], dur_t, cutoff=1000, a=0.05, r=1.6) * 0.55, t_title)
st = T(dur_t)
shimmer = np.sin(2 * np.pi * hz("A5") * st) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.7 * st)) * adsr(len(st), 1.0, 0.1, 1, 1.4) * 0.05
place(mus2, stereo(shimmer, 0.8), t_title)

# ---------- mixdown ----------
def bounce(m, l):
    a = reverb(m, 2.8, 0.32); b = reverb(l, 1.6, 0.12, tone=2500)
    n = min(len(a), len(b), N)
    return a[:n] + b[:n] * 1.1

pre = bounce(mus, low)
g0, g1 = int((t_forgot + 0.03) * SR), int(t_days * SR)
pre[g0:g1] = 0                                             # true silence after "Forgotten" (kills reverb tails too)
pre[cut - int(0.01 * SR): cut] *= np.linspace(1, 0, int(0.01 * SR))[:, None]
pre[cut:] = 0                                              # hard cut into the title
out = pre + bounce(mus2, low2)
out = out[: int(D * SR)]
out = hp(out, 35)
out = out - 0.45 * lp(out, 140)                            # tame the low end so the VO stays clear on phone speakers
out = fade(out, 0, 1.2)
out = to_lufs(out, -20)
out = peak_to(out, -1.0) if np.abs(out).max() > db(-1.0) else out
save(os.path.join(ROOT, "public", "audio", "music.wav"), out)
print("music.wav", round(D, 2), "s, LUFS", round(lufs(out), 1))
