"""Word timing without an STT transcript: detect speech segments by silence, align script phrases to them with dynamic
programming on durations, then spread words inside each group by vowel-weighted length. Writes public/audio/vo/narration.json
in the same shape as the ai33/ElevenLabs transcript ({"words":[{"text","start","end","type":"word"}]}).
usage: EPISODE=src/data/episode-draft.json python3 scripts/align.py"""
import json, math, os, re, sys
import numpy as np
sys.path.insert(0, os.path.dirname(__file__))
from audiolib import load, SR

ROOT = os.path.join(os.path.dirname(__file__), "..")
ep = json.load(open(os.environ.get("EPISODE") or os.path.join(ROOT, "src", "data", "episode.json")))
words = " ".join(s["vo"] for s in ep["shots"] if s["vo"]).split()
x = load(os.path.join(ROOT, "public", "audio", "vo", "narration.mp3")).mean(1)
win = int(0.02 * SR)
e = np.sqrt(np.convolve(x ** 2, np.ones(win) / win, "same"))
dbv = 20 * np.log10(e + 1e-9)
sil = dbv < dbv.max() - 38
# speech segments = complement of silences >= 0.16 s
spans, i, n = [], 0, len(sil)
cur = None
while i < n:
    if sil[i]:
        j = i
        while j < n and sil[j]:
            j += 1
        if (j - i) / SR >= 0.16:
            if cur is not None:
                spans.append((cur, i / SR)); cur = None
        i = j
    else:
        if cur is None:
            cur = i / SR
        i += 1
if cur is not None:
    spans.append((cur, n / SR))
# phrases = word groups ending with punctuation
phr, buf = [], []
for w in words:
    buf.append(w)
    if re.search(r"[.,…?:!]$", w):
        phr.append(buf); buf = []
if buf:
    phr.append(buf)
weight = lambda w: max(1, len(re.findall(r"[aeiouy]+", w.lower()))) + 0.15 * len(w)
pw = [sum(weight(w) for w in p) for p in phr]
total_speech = sum(b - a for a, b in spans)
rate = total_speech / sum(pw)
P, S = len(phr), len(spans)
INF = 1e18
dp = [[INF] * (S + 1) for _ in range(P + 1)]
bk = [[None] * (S + 1) for _ in range(P + 1)]
dp[0][0] = 0
for i in range(P + 1):
    for j in range(S + 1):
        if dp[i][j] >= INF:
            continue
        for kp in (1, 2, 3):
            for ks in (1, 2, 3):
                if kp > 1 and ks > 1:
                    continue
                if i + kp > P or j + ks > S:
                    continue
                exp = sum(pw[i:i + kp]) * rate
                act = sum(b - a for a, b in spans[j:j + ks])
                c = math.log(max(act, 0.05) / max(exp, 0.05)) ** 2 + 0.02 * (kp + ks - 2)
                # merging phrases across a sentence end (".", "?", "!") is unlikely: the narrator pauses there
                c += 0.35 * sum(1 for q in phr[i:i + kp - 1] if re.search(r"[.?!]$", q[-1]))
                if dp[i][j] + c < dp[i + kp][j + ks]:
                    dp[i + kp][j + ks] = dp[i][j] + c
                    bk[i + kp][j + ks] = (kp, ks)
assert dp[P][S] < INF, "alignment failed"
groups, i, j = [], P, S
while i > 0:
    kp, ks = bk[i][j]
    groups.append((i - kp, i, j - ks, j)); i -= kp; j -= ks
groups.reverse()
out = []
for (p0, p1, s0, s1) in groups:
    ws = [w for p in phr[p0:p1] for w in p]
    segs = spans[s0:s1]
    # time inside the group runs only over speech (skip internal pauses)
    seg_len = [b - a for a, b in segs]
    tot = sum(seg_len)
    wts = [weight(w) for w in ws]
    acc = 0.0
    def at(f):
        f = f * tot
        for (a, b), L in zip(segs, seg_len):
            if f <= L:
                return a + f
            f -= L
        return segs[-1][1]
    W = sum(wts)
    for w, wt in zip(ws, wts):
        st, en = at(acc / W), at((acc + wt) / W)
        out.append({"text": w, "start": round(st, 3), "end": round(en - 0.02, 3), "type": "word"})
        acc += wt
    print(f"{segs[0][0]:6.2f}-{segs[-1][1]:6.2f}  ({len(segs)} seg) | {' '.join(ws)}")
json.dump({"words": out, "source": "silence-aligned (no STT transcript available)"}, open(os.path.join(ROOT, "public", "audio", "vo", "narration.json"), "w"), indent=1)
print(len(out), "words aligned; cost", round(dp[P][S], 3))
