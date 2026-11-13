"""Building blocks for kiamat episode scores (synthesised). Import from an episode's scripts/music.py.
All times in seconds; cue points come from episode.json via Score.w()/Score.st()."""
import json, os, re
import numpy as np
from audiolib import *  # noqa

CH = {"Dm": ["D3", "F3", "A3"], "Bb": ["D3", "F3", "Bb3"], "Gm": ["D3", "G3", "Bb3"], "A": ["E3", "A3", "C#4"],
      "F": ["F3", "A3", "C4"], "C": ["E3", "G3", "C4"], "Dmb9": ["D3", "Eb3", "A3"], "Fadd#11": ["F3", "A3", "B3", "C4"],
      "Am": ["E3", "A3", "C4"], "Eb": ["Eb3", "G3", "Bb3"]}
BASS = {"Dm": "D2", "Bb": "Bb1", "Gm": "G1", "A": "A1", "F": "F2", "C": "C2", "Dmb9": "D2", "Fadd#11": "F2", "Am": "A1", "Eb": "Eb2"}


class Score:
    def __init__(self, root, bpm):
        self.root = root
        self.ep = json.load(open(os.path.join(root, "src", "data", "episode.json")))
        self.S = {s["id"]: s for s in self.ep["shots"]}
        self.D = self.ep["durationSec"]
        self.N = int((self.D + 0.5) * SR)
        self.BEAT = 60 / bpm
        self.mus = np.zeros((self.N, 2), np.float32); self.low = np.zeros((self.N, 2), np.float32)
        self.gates = []                       # (t0, t1) windows forced to silence after reverb
        self.title_t = self.st(max(self.S))

    def w(self, sid, pat, which=0):
        return [x["start"] for x in self.S[sid]["words"] if re.search(pat, x["text"], re.I)][which]

    def st(self, sid):
        return self.S[sid]["start"]

    def en(self, sid):
        return self.S[sid]["end"]

    # --- layers ---
    def bass(self, c, t0, dur, g):
        place(self.low, stereo(np.sin(2 * np.pi * note_hz(BASS[c]) * T(dur)) * adsr(len(T(dur)), 0.04, 0.1, 0.9, 0.25) * g), t0)

    def drums(self, t0, t1, gain=0.7, dens=1.0, ticks=True):
        k, j = t0, 0
        while k < t1 - 0.05:
            place(self.low, heartbeat_kick() * gain * (1.0 if j % 4 == 0 else 0.6), k)
            if ticks and j % 2 == 1:
                place(self.mus, tick(0.06, 1800) * 0.25 * gain, k)
            k += self.BEAT / (2 * dens); j += 1

    def pad(self, chord, t0, t1, g=0.4, cutoff=1200, a=0.6, r=0.6):
        place(self.mus, pad([note_hz(n) for n in CH[chord]], t1 - t0 + r, cutoff=cutoff, a=a, r=r) * g, t0)

    def strings(self, notes, t0, t1, g=0.4, a=0.3, r=0.4, trem=0.0):
        d = t1 - t0
        x = strings([note_hz(n) for n in notes], d + r, a=a, r=r) * g
        if trem:
            tt = T(len(x) / SR)[: len(x)]
            x = x * ((1 - trem / 2) + (trem / 2) * np.sin(2 * np.pi * 9 * tt))[:, None]
        place(self.mus, x, t0)

    def prog(self, chords, t0, t1, beats=4, g=0.45, kind="pad", bass_g=0.22, arp=False):
        cur, i = t0, 0
        while cur < t1 - 0.05:
            c = chords[i % len(chords)]; dur = min(beats * self.BEAT, t1 - cur)
            if kind == "pad":
                self.pad(c, cur, cur + dur, g)
            else:
                self.strings(CH[c] + [CH[c][0][:-1] + str(int(CH[c][0][-1]) + 1)], cur, cur + dur, g, a=0.12, r=0.25)
            self.bass(c, cur, dur, bass_g)
            if arp:
                for b in range(int(dur / (self.BEAT / 2))):
                    place(self.mus, piano(note_hz(CH[c][b % 3]) * 2, 1.6, 0.45 if b % 2 else 0.55), cur + b * self.BEAT / 2)
            cur += dur; i += 1

    def motif(self, notes, t0, t1, step=None, g=0.45, octave_down=True):
        step = step or self.BEAT / 2
        cur = t0
        while cur < t1 - 0.05:
            for m, n in enumerate(notes):
                tt = cur + m * step
                if tt < t1 - 0.05:
                    place(self.mus, piano(note_hz(n), 1.4, g), tt)
                    if octave_down:
                        place(self.mus, pluck(note_hz(n) / 2, 0.3, 1500) * g * 0.5, tt)
            cur += len(notes) * step

    def notes(self, t0, seq, g=0.42, t_max=None):
        for dt, n in seq:
            if t_max is None or t0 + dt < t_max - 0.2:
                place(self.mus, piano(note_hz(n), 2.6, g), t0 + dt)

    def hit(self, t, g=0.8):
        place(self.low, sub_hit(3.0, 64, 30, g), t)

    def braam(self, t, g=0.8, lowpass=True):
        x = braam(3.5, "D1", 1.0) * g
        place(self.mus, lp(x, 700, 4) if lowpass else x, t)

    def swell(self, t_end, dur, g=0.22, seed=3):
        place(self.mus, swell(dur, 300, 7000, seed=seed) * g, t_end - dur)

    def silence(self, t0, t1):
        self.gates.append((t0, t1))

    def cliff(self, t0, g=0.4):
        d = self.title_t - t0
        self.strings(["D3", "Eb3", "A3"], t0, self.title_t, g, a=0.4, r=0.01, trem=0.8)
        place(self.mus, swell(d, 200, 8000, seed=13) * 0.28, t0)

    # --- render ---
    def render(self, out_lufs=-21):
        mus2 = np.zeros_like(self.mus); low2 = np.zeros_like(self.low)
        dt = self.D - self.title_t
        place(low2, deep_drop(dt + 1.0, 100, 28, 1.8, 1.0), self.title_t)
        place(mus2, pad([note_hz(n) for n in ["D2", "A2", "D3", "F3"]], dt, cutoff=1000, a=0.05, r=1.6) * 0.5, self.title_t)

        def bounce(m, l):
            a = reverb(m, 2.6, 0.3); b = reverb(l, 1.4, 0.1, tone=2500)
            n = min(len(a), len(b), self.N); return a[:n] + b[:n] * 1.1

        pre = bounce(self.mus, self.low)
        fd = int(0.02 * SR)
        for t0, t1 in self.gates + [(self.title_t, self.D + 0.5)]:
            a, b = int(t0 * SR), int(t1 * SR)
            pre[max(0, a - fd): a] *= np.linspace(1, 0, min(fd, a))[:, None]
            pre[a: b] = 0
        out = pre + bounce(mus2, low2)
        out = out[: int(self.D * SR)]
        out = hp(out, 35); out = out - 0.45 * lp(out, 140); out = fade(out, 0, 1.2)
        out = to_lufs(out, out_lufs)
        out = peak_to(out, -1.0) if np.abs(out).max() > db(-1.0) else out
        save(os.path.join(self.root, "public", "audio", "music.wav"), out)
        print("music.wav", round(self.D, 2), "s, LUFS", round(lufs(out), 1))
