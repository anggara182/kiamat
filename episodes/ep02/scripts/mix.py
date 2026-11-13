"""EP02 full audio mix: VO + original score + per-location ambience beds + sound effects locked to the VO sync words.
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
music = music * db(1.0)   # EP02 score is mastered quieter

# ---------------- ambience beds (per location) ----------------
bed("dawn", 0.0, en(3), -31, 0.05, 0.4)                                # dawn street outside the shop
bed("road", 0.0, en(3), -36, 0.05, 0.4, offset=3.0)
bed("moto_ride", st(6), en(6), -31, 0.05, 0.1, offset=2.0)            # angkot
bed("road", st(7), en(10), -33, 0.1, 0.3, offset=6.0)                 # daytime kampung
bed("wind", st(5), en(5), -34, 0.2, 0.2)                              # rumour image: cold wind
bed("wind", st(12), en(12), -34, 0.2, 0.2, offset=5.0)
bed("road", st(13), en(17), -34, 0.1, 0.05, offset=9.0)               # noon alley
bed("road", st(20), en(21), -35, 0.1, 0.3, offset=2.0)
bed("kampung_night", st(22), en(23), -35, 0.6, 0.4)                    # dusk
bed("kampung_night", st(24), st(25), -40, 0.2, 0.01, offset=6.0)      # night terrace

# ---------------- sound effects on sync words ----------------
hit_file("thump_adrian", 0.02, -13)                                    # frame 0 hit
hit(card_slam(1) * 0.9, W(1, r"^knew"), -11, "gallon_thud")             # gallon falls
hit_file("coins", 0.3, -24, length=0.8)                                # bottles clinking in the grab
# rolling door rattling up, finishing on "problem"
tp = W(2, r"^problem")
rattle = bp(noise(1.6, 4), 250, 3000) * (0.55 + 0.45 * np.sign(np.sin(2 * np.pi * 14 * T(1.6))))
hit(stereo(rattle * np.linspace(0.4, 1.0, len(rattle))), tp - 1.6, -20, "door_rattle", land=False)
hit(metal_clank(3), tp, -17, "door_stop")
hit_file("boom_adrian", W(2, r"^true"), -10)                           # the story drop
hit_file("whoosh2", st(3) - 0.25, -21)
hit_file("cloth", W(3, r"^whisper"), -22, length=0.8)                  # lean-in
hit(swell(0.6, 2000, 7000, seed=3) * 0.6, W(4, r"^poisoned") - 0.55, -22, "breath_swell", land=False)
hit_file("thump_adrian", W(4, r"^poisoned"), -15, length=1.2)
hit_file("braam", W(5, r"^stranger"), -15)                             # rumour image appears
for sid in (6, 7, 11):
    hit_file("whoosh2", st(sid) - 0.2, -23)
# shot 11 relay: a soft whoosh on every inner cut (5 passes: 27/23/20/16/14 % of the shot)
acc = 0.0
for frac in (0.27, 0.23, 0.20, 0.16):
    acc += frac
    hit_file("whoosh", st(11) + acc * (en(11) - st(11)), -25)
hit_file("thump_adrian", W(8, r"^empty"), -17, length=1.2)
hit_file("splash", W(9, r"^poured"), -15, length=1.6)
hit_file("splash", W(9, r"^drain"), -13, length=1.2)
hit_file("grab", W(10, r"^argued"), -18)
hit(lp(sfx("braam"), 700, 4), W(12, r"^three"), -12, "braam_lp")
hit_file("thump_adrian", W(12, r"^plan"), -14, length=1.4)
# the crowd
hit_file("steps_walk", st(13), -20, length=1.6)
hit_file("running", st(13) + 0.2, -28, length=1.2)
for k in range(5):
    hit_file("drip", st(14) + 0.2 + k * 0.45, -24, length=0.4)
for k, off in enumerate([-1.2, -0.8, -0.45, 0.0]):
    hit_file("drip", W(15, r"^free") + off, -22 - (3 - k), length=0.4)
hit_file("steps_walk", W(16, r"^in"), -16, length=1.0)
hit(card_slam(7) * 0.5, W(16, r"^in"), -19, "crowd_step")
gravel = bp(noise(0.45, 9), 900, 6000) * np.exp(-T(0.45) * 9)
hit(stereo(gravel), W(17, r"^stone"), -15, "stone_grab")
# the mosque speaker crackles through the silence
hit_file("glitch", W(18, r"^crackled"), -14, length=0.7)
hit(stereo(bp(noise(1.2, 17), 800, 5000) * np.exp(-T(1.2) * 3)), W(18, r"^crackled") + 0.05, -24, "speaker_hiss", land=False)
hit(swell(0.9, 400, 5000, seed=8) * 0.5, W(19, r"^clean") - 0.9, -24, "release_swell", land=False)
stone_drop = stereo(np.sin(2 * np.pi * (180 + 120 * np.exp(-T(0.3) * 40)) * T(0.3)) * np.exp(-T(0.3) * 20))
hit(stone_drop, W(20, r"^home"), -13, "stone_drop")
hit(stereo(bp(noise(0.5, 21), 600, 4000) * np.exp(-T(0.5) * 10)), W(20, r"^home") + 0.02, -22, "dust", land=False)
hit_file("steps_walk", W(20, r"^home") + 0.3, -22, length=1.2)
hit_file("coins", st(21) + 0.4, -27, length=0.6)                       # tools clinking
hit_file("coins", st(21) + 1.6, -28, length=0.6)
hit_file("switch", W(23, r"^enough"), -15)                             # shutter lands
hit(metal_clank(5), W(23, r"^enough"), -21, "shutter")
hit_file("gecko", st(24) + 0.2, -30, length=1.2)                       # night terrace
hit_file("cloth", W(24, r"^whisper"), -30, length=0.8)
t24, t25 = st(24), st(25)
hit(heartbeat_run(t25 - t24 - 0.05, 66, 150), t24, -18, "heartbeat_run", land=False)
hit_file("thump_adrian", W(24, r"^trusted"), -16, length=1.4)
hit(deep_drop(4.2, 110, 30, 1.6), t25, -5, "deep_drop", land=False)    # title

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

t_st = W(17, r"^stone")
s0, s1 = int((t_st + 0.3) * SR), int(W(18, r"^crackled") * SR)   # beds hold their breath after the stone
bed_bus[s0:s1] *= 0.12
cut = int(st(25) * SR)
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
