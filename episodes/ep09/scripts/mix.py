"""EP09 full audio mix: VO + original score + per-location ambience beds + sound effects locked to the VO sync words.
Every cue time comes from src/data/episode.json (real VO timing); one-shot samples are placed so their transient (onset)
lands exactly on the sync word, the same word the animation uses.
Levels: VO -16 LUFS, score ducked under VO, beds ~-34 LUFS, SFX peak-set; master -14 LUFS, true peak <= -1.4 dBFS.
Sources: SFX files reused from the horrorluar / storiesafterdark libraries (public/audio/sfx) + synthesised UI/foley
(scripts/audiolib.py). No new ai33 sound-effect tasks.
usage: python3 scripts/mix.py -> public/audio/mix.wav
"""
import json, os, re, subprocess, sys
import numpy as np
sys.path.insert(0, os.path.dirname(__file__))
from audiolib import *  # noqa

ROOT = os.path.join(os.path.dirname(__file__), "..")
A = os.path.join(ROOT, "public", "audio")
ep = json.load(open(os.path.join(ROOT, "src", "data", "episode.json")))
S = {s["id"]: s for s in ep["shots"]}
D = ep["durationSec"]
N = int(round(D * SR))


def W(sid, pat, which=0):
    hits = [x["start"] for x in S[sid]["words"] if re.search(pat, x["text"], re.I)]
    if not hits:
        raise KeyError((sid, pat))
    return hits[which]


def st(sid):
    return S[sid]["start"]


def en(sid):
    return S[sid]["end"]


_cache = {}


def sfx(name):
    if name not in _cache:
        _cache[name] = load(os.path.join(A, "sfx", name + ".mp3"))
    return _cache[name]


vo_bus = np.zeros((N, 2), np.float32)
bed_bus = np.zeros((N, 2), np.float32)
fx_bus = np.zeros((N, 2), np.float32)
log = []


def bed(name, t0, t1, lufs_t=-34, fin=0.4, fout=0.4, offset=0.0):
    x = sfx(name)
    x = loop_to(x[int(offset * SR):], t1 - t0 + 0.01)
    x = fade(to_lufs(x, lufs_t), fin, fout)
    place(bed_bus, x, t0)
    log.append(("bed", name, round(t0, 2), round(t1, 2)))


def hit(x, t, peak_db=-10, name="synth", land=True):
    """Place a one-shot so its onset lands on t."""
    x = peak_to(x, peak_db)
    o = onset(x) if land else 0.0
    place(fx_bus, x, t - o)
    log.append(("fx", name, round(t, 3)))


def hit_file(name, t, peak_db=-10, start=0.0, length=None):
    x = sfx(name)[int(start * SR):]
    if length:
        x = fade(x[: int(length * SR)], 0, min(0.15, length / 3))
    hit(x, t, peak_db, name)


# ---------------- VO ----------------
vo = load(os.path.join(A, "vo", "narration_fast.wav"))
vo = to_lufs(vo, -16)
place(vo_bus, vo, 0.0)

# ---------------- music ----------------
music = load(os.path.join(A, "music.wav"))
music = music[:N] if len(music) >= N else np.pad(music, ((0, N - len(music)), (0, 0)))
music = music * db(2.0)


def crowd(sec, seed, roar=1.0):
    """Synthetic crowd bed: several band-limited noise voices with slow swells (no real recordings available)."""
    out = np.zeros((len(T(sec)), 2), np.float32)
    for v in range(6):
        n = bp(noise(sec, seed + v, "pink"), 300 + 90 * v, 1400 + 260 * v)
        am = 0.6 + 0.4 * np.sin(2 * np.pi * (0.13 + 0.05 * v) * T(sec) + v)
        pan = v / 5
        out[:, 0] += n * am * (1 - pan); out[:, 1] += n * am * pan
    return out * roar


def fire_bed(sec, seed):
    roar = lp(noise(sec, seed, "brown"), 300, 2) * 0.8
    crack = hp(noise(sec, seed + 1), 2500) * (np.random.default_rng(seed).random(len(T(sec))) > 0.9985) * 3
    return stereo(roar + crack, width=0.6)


# ---------------- ambience beds ----------------
def heat_bed(sec, seed):
    """Dry desert air: soft high hiss + low wind, slowly breathing."""
    a = hp(noise(sec, seed, "pink"), 3000) * 0.25 + lp(noise(sec, seed + 1, "brown"), 400, 2)
    return stereo(a * (0.7 + 0.3 * np.sin(2 * np.pi * 0.1 * T(sec))), width=0.7)


bed("wind", 0, en(2), -34, 0.05, 0.1)
place(bed_bus, fade(to_lufs(crowd(en(2) - st(2), 3, 0.9), -37), 0.2, 0.1), st(2))
place(bed_bus, fade(to_lufs(crowd(en(3) - st(3), 5, 0.3), -40), 0.1, 0.1), st(3))
place(bed_bus, fade(to_lufs(crowd(en(4) - st(4), 7, 1.0), -35), 0.1, 0.1), st(4))
bed("station_amb", st(5), en(5), -37, 0.1, 0.1)
place(bed_bus, fade(to_lufs(crowd(en(6) - st(6), 9, 0.8), -38), 0.1, 0.1), st(6))
place(bed_bus, fade(to_lufs(crowd(en(7) - st(7), 11, 0.6), -38), 0.1, 0.1), st(7))
bed("fire", st(8), en(8), -36, 0.05, 0.1)
bed("city_night", st(9), en(9), -36, 0.1, 0.1)
bed("wind", st(10), en(10), -39, 0.3, 0.3, offset=4.0)
bed("dawn", st(11), en(11), -37, 0.2, 0.1)
bed("suburb_night", st(12), en(12), -40, 0.1, 0.1)
bed("road", st(13), en(13), -35, 0.1, 0.1)
bed("wind", st(14), st(15), -37, 0.3, 0.01, offset=9.0)

# ---------------- sound effects ----------------
hit_file("thump_adrian", 0.02, -12, length=1.4)                                  # thump on frame 0
hit(rumble(2.5, 3) * 0.5, 0.2, -26, "marching", land=False)
hit_file("cloth", W(1, r"^soldiers") - 0.2, -24, length=0.8)                     # banners snapping
hit_file("steps_walk", st(2), -28, length=en(2) - st(2))
hit_file("grab", W(3, r"^handshake"), -24, length=0.5)
for k in range(3):
    hit(tick(0.05, 6500) * 0.6, W(3, r"^handshake") + 0.1 + k * 0.22, -28, "flash")
hit_file("whoosh2", W(4, r"^foretold") - 0.2, -28, length=0.8)                   # confetti
hit_file("splash", st(5) + 0.4, -32, length=0.5)
hit_file("boom_adrian", W(6, r"^won"), -18, length=2.0)
hit(body_hit(4), W(7, r"^was"), -18, "shove")
hit_file("fire", W(8, r"^ash") - 0.6, -26, length=1.0)
hit(metal_clank(9), W(9, r"^warships"), -18, "shutter")
hit_file("braam", S[10]["words"][-1]["end"] + 0.05, -17, length=3.0)             # canonical moment
hit_file("drone", st(10), -30, length=en(10) - st(10))
hit_file("door_close", W(11, r"^shave"), -28, length=1.0)
hit_file("cloth", W(12, r"^window"), -28, length=0.6)
hit(rumble(en(13) - st(13), 21) * 0.4, st(13), -26, "trucks", land=False)
hit(heartbeat_run(max(0.8, st(15) - W(14, r"^faced") - 0.1), 80, 140), W(14, r"^faced"), -19, "heartbeat_run", land=False)
hit(deep_drop(4.2, 110, 30, 1.6), st(15), -5, "deep_drop", land=False)

# ---------------- ducking + dramatic silence ----------------
env = np.abs(vo_bus).max(1)
win = int(0.05 * SR)
env = np.convolve(env, np.ones(win) / win, "same")
lvl = np.clip(env / (env.max() * 0.08), 0, 1)
att, rel = 1 - np.exp(-1 / (0.02 * SR)), 1 - np.exp(-1 / (0.35 * SR))
sm = np.zeros_like(lvl); g = 0.0
for i in range(0, len(lvl), 64):                       # block-wise envelope follower (fast enough in numpy)
    tgt = lvl[i:i + 64].max()
    k = att if tgt > g else rel
    g = g + (tgt - g) * (1 - (1 - k) ** 64)
    sm[i:i + 64] = g
duck_music = (1 - sm * (1 - db(-12)))[:, None]
duck_bed = (1 - sm * (1 - db(-5)))[:, None]
duck_fx = (1 - sm * (1 - db(-5)))[:, None]

s0, s1 = int(st(11) * SR), int(st(11) * SR)   # (no dramatic bed silence in EP03)
cut = int(st(max(S)) * SR)
bed_bus[cut:] = 0                                            # hard cut into the title: only the score's boom

rest = music * duck_music * db(-1) + bed_bus * duck_bed + fx_bus * duck_fx
mix = vo_bus + rest
# VO intelligibility report: VO vs everything else, per word
vo_sb, rest_sb = bp(vo_bus, 300, 5000, 4), bp(rest, 300, 5000, 4)   # speech band: what actually masks words
bad = []
ratios = []
for s_ in ep["shots"]:
    for w_ in s_["words"]:
        a, b = int(w_["start"] * SR), int(w_["end"] * SR)
        if b - a < 200:
            continue
        rv = np.sqrt((vo_sb[a:b] ** 2).mean()) + 1e-9
        rr = np.sqrt((rest_sb[a:b] ** 2).mean()) + 1e-9
        r = 20 * np.log10(rv / rr)
        ratios.append(r)
        if r < 6:
            bad.append((s_["id"], w_["text"], round(r, 1)))
_comp = {"music": bp(music * duck_music * db(-1), 300, 5000, 4), "beds": bp(bed_bus * duck_bed, 300, 5000, 4), "fx": bp(fx_bus * duck_fx, 300, 5000, 4)}
for sid_, wtxt_, r_ in bad:
    w_ = next(x for x in S[sid_]["words"] if x["text"] == wtxt_)
    a, b = int(w_["start"] * SR), int(w_["end"] * SR)
    print("  ", sid_, wtxt_, {k: round(20 * np.log10(np.sqrt((v[a:b] ** 2).mean()) + 1e-9), 1) for k, v in _comp.items()}, "vo", round(20 * np.log10(np.sqrt((vo_sb[a:b] ** 2).mean()) + 1e-9), 1), "t", w_["start"])
print("VO/rest per word dB: min", round(min(ratios), 1), "median", round(float(np.median(ratios)), 1), "| words < 6 dB (speech band):", bad)
mix = to_lufs(mix, -14.3)
tmp = os.path.join(A, "_premaster.wav")
save(tmp, mix)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", "alimiter=limit=0.83:attack=5:release=60:level=disabled",
                "-c:a", "pcm_s16le", os.path.join(A, "mix.wav")], check=True)
os.remove(tmp)
out = load(os.path.join(A, "mix.wav"))
print("mix.wav", round(len(out) / SR, 2), "s | LUFS", round(lufs(out), 1), "| peak dBFS", round(20 * np.log10(np.abs(out).max()), 2))
json.dump(log, open(os.path.join(A, "cues.json"), "w"), indent=0)
print(len([l for l in log if l[0] == "fx"]), "fx cues,", len([l for l in log if l[0] == "bed"]), "beds")
