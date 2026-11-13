"""Small audio toolkit for kiamat episodes: decode/encode, loudness, synthesis (pads, piano, hits, UI sounds), reverb.
Everything is float32 stereo at SR = 48000, shape (n, 2)."""
import subprocess
import numpy as np
import pyloudnorm as pyln
from scipy import signal

SR = 48000
_meter = pyln.Meter(SR)


# ---------- io ----------
def load(path, mono=False):
    raw = subprocess.check_output(["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"])
    x = np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()
    return x.mean(1, keepdims=True).repeat(2, 1) if mono else x


def save(path, x):
    x = np.clip(x, -1, 1).astype(np.float32)
    p = subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ac", "2", "-ar", str(SR), "-i", "-", "-c:a", "pcm_s24le", path], input=x.tobytes())
    assert p.returncode == 0


def lufs(x):
    try:
        return _meter.integrated_loudness(x.astype(np.float64))
    except Exception:
        return -70.0


def to_lufs(x, target):
    l = lufs(x)
    if not np.isfinite(l) or l < -69:
        return x
    return x * (10 ** ((target - l) / 20))


def peak_to(x, db):
    p = np.abs(x).max()
    return x if p == 0 else x * (10 ** (db / 20) / p)


def onset(x, rel=0.12):
    """Time (s) of the first sample above rel*peak: used to land a sample's transient on a sync word."""
    a = np.abs(x).max(1)
    if a.max() == 0:
        return 0.0
    return float(np.argmax(a > rel * a.max())) / SR


def db(v):
    return 10 ** (v / 20)


# ---------- helpers ----------
def T(sec):
    return np.arange(int(round(sec * SR))) / SR


def stereo(m, width=0.0, seed=0):
    """Mono -> stereo with an optional tiny decorrelation (Haas) for width."""
    m = m.astype(np.float32)
    if width <= 0:
        return np.stack([m, m], 1)
    d = int(SR * 0.004 * width)
    r = np.concatenate([np.zeros(d, np.float32), m[:-d]]) if d else m
    return np.stack([m, r], 1)


def adsr(n, a=0.01, d=0.1, s=0.7, r=0.3):
    a, d, r = int(a * SR), int(d * SR), int(r * SR)
    s_len = max(0, n - a - d - r)
    env = np.concatenate([np.linspace(0, 1, max(a, 1)), np.linspace(1, s, max(d, 1)), np.full(s_len, s), np.linspace(s, 0, max(r, 1))])
    return np.pad(env, (0, max(0, n - len(env))))[:n].astype(np.float32)


def lp(x, fc, order=2):
    b, a = signal.butter(order, min(fc, SR / 2 - 100) / (SR / 2), "low")
    return signal.lfilter(b, a, x, axis=0).astype(np.float32)


def hp(x, fc, order=2):
    b, a = signal.butter(order, fc / (SR / 2), "high")
    return signal.lfilter(b, a, x, axis=0).astype(np.float32)


def bp(x, f1, f2, order=2):
    b, a = signal.butter(order, [f1 / (SR / 2), min(f2, SR / 2 - 100) / (SR / 2)], "band")
    return signal.lfilter(b, a, x, axis=0).astype(np.float32)


def noise(sec, seed=0, kind="white"):
    rng = np.random.default_rng(seed)
    n = rng.standard_normal(int(round(sec * SR))).astype(np.float32)
    if kind == "pink":
        b = [0.049922035, -0.095993537, 0.050612699, -0.004408786]
        a = [1, -2.494956002, 2.017265875, -0.522189400]
        n = signal.lfilter(b, a, n).astype(np.float32)
    elif kind == "brown":
        n = np.cumsum(n).astype(np.float32)
        n = hp(n, 20)
    return n / (np.abs(n).max() + 1e-9)


_IR = {}


def reverb(x, sec=2.6, mix=0.3, tone=6000, seed=7):
    key = (sec, tone, seed)
    if key not in _IR:
        rng = np.random.default_rng(seed)
        t = T(sec)
        env = np.exp(-6.9 * t / sec).astype(np.float32)
        ir = np.stack([rng.standard_normal(len(t)) * env, rng.standard_normal(len(t)) * env], 1).astype(np.float32)
        ir = lp(ir, tone)
        ir[: int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))[:, None]
        _IR[key] = ir / np.sqrt((ir ** 2).sum(0, keepdims=True))
    ir = _IR[key]
    wet = np.stack([signal.fftconvolve(x[:, c], ir[:, c])[: len(x) + len(ir)] for c in range(2)], 1).astype(np.float32)
    dry = np.pad(x, ((0, len(wet) - len(x)), (0, 0)))
    return (dry * (1 - mix) + wet * mix).astype(np.float32)


def place(bus, x, t, gain=1.0):
    """Add x into bus starting at time t (s); clips at both ends."""
    i = int(round(t * SR))
    if i < 0:
        x = x[-i:]
        i = 0
    if i >= len(bus) or len(x) == 0:
        return
    n = min(len(x), len(bus) - i)
    bus[i:i + n] += x[:n] * gain


def fade(x, fin=0.0, fout=0.0):
    x = x.copy()
    a, b = int(fin * SR), int(fout * SR)
    if a:
        x[:a] *= np.linspace(0, 1, a)[:, None]
    if b:
        x[-b:] *= np.linspace(1, 0, b)[:, None]
    return x


def loop_to(x, sec, xf=0.5):
    """Loop a bed to `sec` seconds with crossfades."""
    n = int(sec * SR)
    if len(x) >= n:
        return x[:n].copy()
    c = int(xf * SR)
    out = x.copy()
    while len(out) < n:
        a, b = out[-c:], x[:c]
        r = np.linspace(0, 1, c)[:, None]
        out = np.concatenate([out[:-c], a * (1 - r) + b * r, x[c:]])
    return out[:n]


# ---------- synthesis ----------
def note_hz(name):
    names = {"C": -9, "C#": -8, "Db": -8, "D": -7, "D#": -6, "Eb": -6, "E": -5, "F": -4, "F#": -3, "Gb": -3, "G": -2, "G#": -1, "Ab": -1, "A": 0, "A#": 1, "Bb": 1, "B": 2}
    n, o = name[:-1], int(name[-1])
    return 440.0 * 2 ** ((names[n] + 12 * (o - 4)) / 12)


def saw(f, t, harm=24):
    out = np.zeros_like(t, dtype=np.float32)
    for k in range(1, harm + 1):
        if f * k > 16000:
            break
        out += (np.sin(2 * np.pi * f * k * t) / k).astype(np.float32)
    return out


def pad(freqs, sec, cutoff=1800, a=1.2, r=1.5, detune=0.004, seed=0):
    t = T(sec)
    out = np.zeros((len(t), 2), np.float32)
    for i, f in enumerate(freqs):
        for c, dt in enumerate((-detune, detune)):
            out[:, c] += saw(f * (1 + dt), t + 0.01 * i, harm=16)
            out[:, c] += 0.5 * saw(f * (1 + dt * 1.7) * 2, t, harm=8)
    out = lp(out, cutoff, 2) / (len(freqs) * 3)
    return out * adsr(len(t), a, 0.3, 0.85, r)[:, None]


def strings(freqs, sec, cutoff=2600, a=0.8, r=1.2, vib=5.0):
    t = T(sec)
    out = np.zeros((len(t), 2), np.float32)
    for f in freqs:
        for c, ph in enumerate((0.0, 1.3)):
            v = 1 + 0.003 * np.sin(2 * np.pi * vib * t + ph)
            ph_acc = 2 * np.pi * np.cumsum(f * v) / SR
            sig = np.zeros_like(t, dtype=np.float32)
            for k in range(1, 12):
                sig += (np.sin(k * ph_acc) / k).astype(np.float32)
            out[:, c] += sig
    out = lp(out, cutoff, 2) / (len(freqs) * 2.5)
    return out * adsr(len(t), a, 0.2, 0.9, r)[:, None]


def piano(f, sec=3.0, vel=1.0):
    t = T(sec)
    sig = np.zeros_like(t, dtype=np.float32)
    for k, amp in enumerate([1, 0.55, 0.32, 0.2, 0.12, 0.07, 0.04], start=1):
        fk = f * k * (1 + 0.0004 * k * k)
        sig += amp * np.sin(2 * np.pi * fk * t) * np.exp(-t * (1.2 + 0.9 * k))
    click = noise(0.01, seed=int(f)) * np.linspace(1, 0, int(0.01 * SR)) * 0.15
    sig[: len(click)] += click
    sig *= adsr(len(t), 0.003, 0.05, 1, 0.25)
    return stereo(sig * 0.35 * vel, width=0.6)


def pluck(f, sec=0.35, cutoff=2400):
    t = T(sec)
    sig = saw(f, t, harm=12) * np.exp(-t * 9)
    return stereo(lp(sig, cutoff) * 0.4)


def sub_hit(sec=4.0, f0=62, f1=30, gain=1.0):
    t = T(sec)
    f = f1 + (f0 - f1) * np.exp(-t * 6)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t * 1.1)
    crack = lp(noise(sec, 3), 900) * np.exp(-t * 14) * 0.6
    return stereo((body + crack) * gain, width=0.3)


def heartbeat_kick(sec=0.5):
    t = T(sec)
    f = 45 + 50 * np.exp(-t * 30)
    return stereo(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * 0.9)


def tick(sec=0.05, f=3200):
    return stereo(bp(noise(sec, 11), f * 0.8, f * 1.3) * np.exp(-T(sec) * 120) * 0.8)


def swell(sec=2.0, f_lo=200, f_hi=5000, seed=5):
    """Rising filtered-noise swell that ends abruptly (reverse-cymbal feel)."""
    n = noise(sec, seed, "pink")
    t = T(sec)
    out = np.zeros_like(n)
    hop = 2400
    for i in range(0, len(n), hop):
        p = i / len(n)
        fc = f_lo * (f_hi / f_lo) ** p
        seg = n[max(0, i - 256): i + hop]
        out[i:i + hop] = lp(seg, fc)[-len(out[i:i + hop]):]
    env = (t / sec) ** 2.2
    return stereo(out * env, width=1.0)


# ---------- UI / foley synthesis ----------
def phone_buzz(sec=0.45, seed=0):
    t = T(sec)
    motor = np.sign(np.sin(2 * np.pi * 172 * t)) * 0.5 + np.sin(2 * np.pi * 344 * t) * 0.3
    rattle = bp(noise(sec, seed), 300, 2200) * 0.25
    env = adsr(len(t), 0.01, 0.02, 1.0, 0.04)
    return stereo(lp((motor + rattle) * env, 3000) * 0.6)


def notif_ping(seed=0):
    """Neutral two-note soft chime (deliberately not any real app's sound)."""
    out = np.zeros((int(0.9 * SR), 2), np.float32)
    for k, (f, dt) in enumerate([(1318.5, 0.0), (1975.5, 0.09)]):
        t = T(0.8)
        s = (np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t)) * np.exp(-t * 7)
        place(out, stereo(s * 0.4), dt)
    return out


def ui_swipe(sec=0.28, up=True, seed=0):
    n = noise(sec, seed, "pink")
    t = T(sec)
    out = np.zeros_like(n)
    for i in range(0, len(n), 1200):
        p = i / len(n)
        fc = (900 + 5000 * p) if up else (5900 - 5000 * p)
        seg = n[max(0, i - 128): i + 1200]
        out[i:i + 1200] = bp(seg, fc * 0.6, fc * 1.4)[-len(out[i:i + 1200]):]
    env = np.sin(np.pi * t / sec) ** 1.5
    return stereo(out * env * 0.7, width=0.5)


def card_slam(seed=0):
    t = T(0.6)
    thump = np.sin(2 * np.pi * (70 + 60 * np.exp(-t * 40)) * t) * np.exp(-t * 14)
    snap = hp(noise(0.6, seed), 2500) * np.exp(-t * 60) * 0.35
    return stereo((thump + snap) * 0.8, width=0.2)


def metal_clank(seed=0):
    t = T(2.2)
    sig = np.zeros_like(t, dtype=np.float32)
    for f, a, d in [(412, 1, 2.5), (1093, 0.6, 3.5), (1675, 0.45, 4.5), (2731, 0.3, 6), (3907, 0.2, 8)]:
        sig += a * np.sin(2 * np.pi * f * t) * np.exp(-t * d)
    sig += hp(noise(2.2, seed), 1500) * np.exp(-t * 40) * 0.5
    return stereo(sig * 0.3, width=0.5)


def rumble(sec=1.6, seed=0):
    n = lp(noise(sec, seed, "brown"), 120, 4)
    t = T(sec)
    am = 0.6 + 0.4 * np.sin(2 * np.pi * 7 * t + 1)
    env = adsr(len(t), 0.05, 0.2, 0.8, 0.8)
    return stereo(n * am * env * 1.2, width=0.4)


def body_hit(seed=0):
    """Hand slapping a phone on a blanket: soft low thump + cloth smack."""
    t = T(0.35)
    th = np.sin(2 * np.pi * (110 + 80 * np.exp(-t * 50)) * t) * np.exp(-t * 22)
    sm = bp(noise(0.35, seed), 600, 3500) * np.exp(-t * 45) * 0.6
    return stereo((th + sm) * 0.9)
