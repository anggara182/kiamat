"""EP01 full audio mix (v3): VO + original score + per-location ambience beds + sound effects locked to the VO sync words.
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

# ---------------- ambience beds (per location) ----------------
t_slap = W(2, r"^slowly")
bed("suburb_night", 0.0, t_slap + 0.3, -38, 0.05, 0.4)                 # pre-dawn bedroom: fridge hum, clock
bed("dawn", t_slap - 0.2, en(6), -31, 1.0, 0.8)                        # dawn: rooster, first birds (shots 2-6)
bed("boil", st(4), en(4), -33, 0.1, 0.2)                              # kitchen pot
bed("fluor_buzz", W(4, r"^lights") + 0.35, en(4), -36, 0.05, 0.2)      # tube hum after it catches
bed("scooter_idle", W(5, r"^awake"), st(6) + 1.2, -30, 0.02, 1.0)     # engine running, fades into the next shot
bed("road", st(7), en(7), -29, 0.1, 0.2)                              # morning traffic
bed("moto_ride", st(7), en(7), -33, 0.1, 0.2, offset=1.0)
bed("station_amb", st(8), en(8), -33, 0.05, 0.2)                      # train interior hum
bed("moto_ride", st(8), en(8), -38, 0.05, 0.2, offset=4.0)            # rumble under the train
bed("wind", st(9), en(9), -31, 0.1, 0.1)                              # high up the tower
bed("road", st(10), en(10), -33, 0.1, 0.2, offset=5.0)                # city far below
bed("station_amb", st(11), W(13, r"^forgotten") + 0.25, -36, 0.1, 0.25, offset=6.0)  # still on the train
bed("road", st(14), en(14), -32, 0.05, 0.3, offset=8.0)               # sunset street
bed("wind", st(15), en(16), -32, 0.2, 0.2, offset=4.0)                # rooftops at dusk
bed("suburb_night", st(17), en(17), -38, 0.05, 0.05, offset=6.0)      # meeting-room tone
bed("kampung_night", st(18), en(18), -34, 0.05, 0.05)                 # dinner at home
bed("city_night", st(19), en(21), -32, 0.05, 0.6)                     # evening city
bed("kampung_night", st(22), en(23), -32, 0.4, 0.3, offset=5.0)       # night rooftops
bed("wind", st(22), en(22), -38, 0.4, 0.4, offset=8.0)
bed("suburb_night", st(24), st(25), -32, 0.2, 0.01, offset=10.0)      # bedroom, hard cut at the title

# ---------------- sound effects on sync words ----------------
# 1 hook: buzzing phone + notifications
hit(phone_buzz(0.5, 1), 0.04, -15, "phone_buzz")
for k, wd in enumerate(["^world", "^end", "^bang"]):
    t = W(1, wd)
    hit(phone_buzz(0.3, k + 2), t, -26, "phone_buzz")
    hit(fade(notif_ping(k)[: int(0.28 * SR)], 0, 0.08), t + 0.02, -27, "notif_ping")   # short tail: keeps the next word clear
hit(phone_buzz(0.6, 9), en(1) + 0.05, -21, "phone_buzz")             # still buzzing into the slap shot
# 2 the slap
hit(body_hit(1), t_slap, -6, "slap")
hit_file("grab", t_slap, -14)
# 4 kitchen switch + flicker
t = W(4, r"^lights")
hit_file("switch", t, -9)
hit_file("flicker", t + 0.06, -15, length=1.2)
# 5 carport: kick-start cough, then the engine catches
for k, wd in enumerate([r"^cough", r"^awake"]):
    t = W(5, wd)
    hit(card_slam(k + 4) * 0.8, t, -18, "kick_stomp")
    sputter = sum(np.roll(rumble(0.18, k * 7 + j), int(j * 0.07 * SR), 0) for j in range(3))
    hit(hp(sputter, 60), t + 0.03, -18, "engine_cough")
# 6 call to prayer: a cluster of distant phone alarms on "hundred" (no adhan audio is generated)
t = W(6, r"^hundred")
for j, (f, pan) in enumerate([(2093, 0.3), (2637, 0.7), (1760, 0.5), (2349, 0.2), (1975, 0.8)]):
    tt = T(1.1)
    beep = np.sign(np.sin(2 * np.pi * f * tt)) * ((np.floor(tt * 8) % 2) == 0) * np.exp(-tt * 0.6) * 0.3
    beep = lp(beep.astype(np.float32), 5000)
    x = np.stack([beep * (1 - pan), beep * pan], 1)
    hit(reverb(x, 1.2, 0.5), t + j * 0.11, -24 - j, "phone_alarm", land=False)
hit_file("whoosh", W(6, r"^rises"), -22)                             # birds lifting off (air movement)
# 7 the train passes during "Millions"
hit_file("train_glide", W(7, r"^millions") - 0.8, -20, length=3.0)
# 8 train doors close as the shot opens; jolt on "survive"
hit_file("door_close", st(8) + 0.05, -18, length=1.6)
hit(card_slam(8) * 0.6, W(8, r"^survive"), -17, "jolt")
# 9 crane hook clank
hit(metal_clank(1), W(9, r"^rising"), -21, "clank")
# 11-12 news cards
hit(ui_swipe(0.25, True, 1), st(11) + 0.05, -20, "swipe")
for k, wd in enumerate([r"^earthquake", r"^war"]):
    t = W(11, wd)
    hit(card_slam(11 + k), t, -17, "card_slam")
    hit(notif_ping(3), t + 0.03, -25, "notif_ping")
for k, wd in enumerate([r"^whole", r"^life", r"^trusted"]):
    t = W(12, wd)
    hit(card_slam(21 + k), t, -17, "card_slam")
    hit(ui_swipe(0.22, False, 31 + k), t - 0.12, -20, "swipe")
tb = W(12, r"^betrays")
for k, off in enumerate([0.45, 0.70, 0.95]):
    hit(card_slam(30 + k), tb + off, -18 - k, "card_slam_flurry")
# 13 swipes, then silence after "Forgotten"
for k, wd in enumerate([r"^read", r"^swipe", r"^forgotten"]):
    hit(ui_swipe(0.3, k % 2 == 0, 20 + k), W(13, wd), -18, "swipe")
# 14 time-lapse whooshes + the lamp coming on
t0 = st(14)
for k in range(4):
    hit_file("whoosh", t0 + 0.4 + k * 0.9, -24 - k, )
hit_file("switch", W(14, r"^night"), -16)
# 15 laundry flap
hit_file("cloth", st(15) + 0.1, -22, length=1.5)
# 17 envelope: cloth slide, grab on "wrong"
hit_file("cloth", st(17) + 0.05, -18, length=1.2)
hit_file("grab", W(17, r"^wrong"), -19)
# 18 the earth shaking: rumble + glasses + lamp creak on each sync word
for k, (wd, which) in enumerate([(r"^shaking", 0), (r"^again", 0), (r"^again", 1)]):
    t = W(18, wd, which)
    hit(rumble(1.0 if k else 1.6, 40 + k), t - 0.05, -15 + (-2 if k else 0), "quake_rumble", land=False)
    hit_file("coins", t, -23 - k, length=0.9)
    if k == 0:
        hit_file("creak", t + 0.1, -20, length=1.6)
# 19 police tape flutter
hit_file("cloth", st(19) + 0.2, -24, length=1.5)
# 20 bus passing on "slipping"
hit_file("whoosh", W(20, r"^slipping"), -18)
hit(rumble(0.9, 77), W(20, r"^slipping") - 0.1, -20, "bus_rumble", land=False)
# 23 the mother's lamp clicks off on the last "one"
hit_file("switch", W(23, r"^one", -1), -15)
# 24 the message spreads
for k, wd in enumerate([r"^message", r"^spread", r"^city"]):
    t = W(24, wd)
    hit(phone_buzz(0.4, 50 + k), t, -22 - k, "phone_buzz")
    hit(notif_ping(10 + k), t + 0.02, -24 - k, "notif_ping")

# ---------------- cinematic drops (impacts, braams, swells) ----------------
# frame 0: a dark thump so the hook hits immediately
hit_file("thump_adrian", 0.02, -13)
# the slap is the drop into the story: reverse swell into it, then adrian's cinematic boom
hit(swell(1.4, 300, 6000, seed=21), t_slap - 1.4, -19, "rev_swell", land=False)
hit_file("boom_adrian", t_slap, -9)
# into the news: whoosh + thump
hit_file("whoosh2", st(11) - 0.35, -17)
hit_file("thump_adrian", st(11), -14)
# the genocide card lands with a braam; the next two cards with thumps
hit(lp(sfx("braam"), 700, 4), W(12, r"^whole"), -13, "braam_lp")          # low-passed: weight without masking the words
hit_file("thump_adrian", W(12, r"^life"), -16, length=1.4)
hit_file("thump_adrian", W(12, r"^trusted"), -16, length=1.4)
# "Forgotten": one short thump, then the silence does the work
hit_file("thump_adrian", W(13, r"^forgotten"), -14, length=0.8)
# into the recap
hit_file("whoosh2", st(15) - 0.3, -19)
# "foretold": swell into a braam + boom
t_fo = W(21, r"^foretold")
hit(swell(1.6, 300, 7000, seed=22), t_fo - 1.6, -20, "rev_swell", land=False)
hit(braam(4.0, "D1"), t_fo, -10, "braam_synth", land=False)
hit_file("boom_adrian", t_fo, -10)
# cliffhanger: heartbeat accelerating under the last line, stops dead at the cut
t24, t25 = st(24), st(25)
hb = heartbeat_run(t25 - t24 - 0.05, 66, 150)
hit(hb, t24, -15, "heartbeat_run", land=False)
# title: the biggest drop
hit_file("boom_adrian", t25, -6)
hit_file("braam", t25, -10)
hit(braam(4.2, "D1", 1.2), t25, -9, "braam_synth", land=False)

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

t_f = W(13, r"^forgotten")
s0, s1 = int((t_f + 0.35) * SR), int(st(14) * SR)            # beds hold their breath after "Forgotten"
bed_bus[s0:s1] *= 0.15
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
