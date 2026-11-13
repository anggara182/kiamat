"""EP03 full audio mix: VO + original score + per-location ambience beds + sound effects locked to the VO sync words.
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
place(bed_bus, fade(to_lufs(fire_bed(en(1) - st(1) + 0.3, 3), -33), 0.02, 0.3), st(1))
bed("fire", st(1), en(1), -34, 0.02, 0.3)
place(bed_bus, fade(to_lufs(crowd(en(1) - st(1), 11), -37), 0.05, 0.3), st(1))
bed("wind", st(2), en(2), -33, 0.2, 0.3)
bed("city_night", st(3), en(4), -33, 0.1, 0.2)
bed("road", st(5), en(5), -34, 0.1, 0.2)
place(bed_bus, fade(to_lufs(crowd(en(7) - st(6), 21, 1.0), -27), 0.3, 0.3), st(6))
bed("suburb_night", st(8), en(9), -34, 0.05, 0.1)
bed("city_night", st(10), en(10), -33, 0.05, 0.1)
place(bed_bus, fade(to_lufs(fire_bed(en(10) - st(10), 31), -31), 0.05, 0.2), st(10))
bed("wind", st(11), en(13), -34, 0.2, 0.3)
bed("road", st(14), en(14), -36, 0.05, 0.1)
bed("wind", st(15), en(16), -32, 0.4, 0.2, offset=3.0)
place(bed_bus, fade(to_lufs(crowd(en(18) - st(17), 41, 0.5), -34), 0.6, 0.3), st(17))
place(bed_bus, fade(to_lufs(crowd(en(22) - st(19), 51, 1.0), -34), 0.6, 0.6), st(19))
bed("road", st(23), st(24), -33, 0.3, 0.01, offset=5.0)
bed("steps_walk", st(23), st(24), -30, 0.3, 0.01)

# ---------------- sound effects ----------------
hit_file("thump_adrian", 0.02, -13)
hit(rumble(1.4, 7), W(1, r"^fire"), -14, "fire_flare", land=False)
hit_file("braam", W(2, r"^gone"), -15)
hit_file("cloth", W(3, r"^whisper"), -24, length=0.8)
spray = hp(noise(1.6, 61), 3000) * adsr(len(T(1.6)), 0.05, 0.1, 0.8, 0.3)
hit(stereo(spray), W(4, r"^water") - 1.4, -22, "spray", land=False)
for k in range(6):
    hit(card_slam(70 + k) * 0.7, st(5) + 0.25 + k * 0.42, -21, "poster_slap")
hit_file("thump_adrian", W(5, r"^proof"), -15, length=1.2)
hit_file("boom_adrian", W(6, r"^million"), -11)
hit_file("cloth", W(7, r"^bridge"), -22, length=1.4)
hit(card_slam(81) * 0.8, W(8, r"^gone"), -18, "chair_scrape")
hit(card_slam(82), W(9, r"^innocent"), -12, "table_slam")
hit_file("coins", W(9, r"^innocent") + 0.02, -22, length=0.6)
hit_file("whoosh", W(10, r"^flame") - 0.1, -16)
hit(rumble(1.2, 9), W(10, r"^flame") + 0.4, -15, "ignite", land=False)
hit_file("cloth", W(11, r"^vanished"), -22, length=1.4)
hit_file("whoosh2", W(12, r"^taken") - 0.6, -22)
hit_file("drip", W(14, r"^water"), -16, length=0.5)
hit(card_slam(91) * 0.6, W(14, r"^bread"), -20, "cut")
hit(card_slam(92) * 0.6, W(14, r"^answers"), -20, "cut")
hit(swell(1.6, 300, 6000, seed=5) * 0.6, W(15, r"^ashes") - 1.6, -21, "rev_swell", land=False)
hit_file("steps_walk", st(16), -20, length=1.6)
hit_file("cloth", W(17, r"^bread"), -22, length=0.8)
for k in range(4):
    hit(metal_clank(100 + k) * 0.6, st(19) + 0.3 + k * ((W(19, r"^full") - st(19) - 0.3) / 3), -22 - (3 - k), "floodlight")
hit(deep_drop(2.6, 90, 34, 1.2, 0.8), W(20, r"^sent"), -15, "sent_drop", land=False)
hit_file("cloth", W(21, r"^knees") - 0.2, -18, length=1.6)
hit_file("glitch", W(23, r"^name"), -18, length=0.6)
t23, t24 = st(23), st(24)
hit(heartbeat_run(t24 - t23 - 0.05, 70, 140), t23, -18, "heartbeat_run", land=False)
hit(deep_drop(4.2, 110, 30, 1.6), t24, -5, "deep_drop", land=False)

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
