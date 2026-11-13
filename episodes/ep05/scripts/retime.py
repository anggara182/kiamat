"""Retime episode.json from the real VO: words from narration.json (transcript or align.py), gaps > 0.9 s cut to 0.5 s,
atempo 1.10, shot starts 0.1 s before their first word, the last voiced shot gets a 0.9 s tail, the title card 4.2 s.
Writes public/audio/vo/narration_fast.wav and src/data/episode.json (from src/data/episode-draft.json).
usage: python3 scripts/retime.py "<timing source note>" """
import json, os, subprocess, sys
ROOT = os.path.join(os.path.dirname(__file__), "..")
VO = os.path.join(ROOT, "public", "audio", "vo")
TEMPO = 1.10
j = json.load(open(os.path.join(VO, "narration.json"))); j = j[0] if isinstance(j, list) else j
W = [x for x in j["words"] if x.get("type") == "word"]
cuts = []
for i in range(1, len(W)):
    g = W[i]["start"] - W[i - 1]["end"]
    if g > 0.9:
        mid = (W[i - 1]["end"] + W[i]["start"]) / 2; rem = g - 0.5; cuts.append((mid - rem / 2, mid + rem / 2))
dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", os.path.join(VO, "narration.mp3")]).decode())
segs, a = [], 0.0
for c0, c1 in cuts:
    segs.append((a, c0)); a = c1
segs.append((a, dur))
fc = "".join(f"[0:a]atrim={s0}:{s1},asetpts=PTS-STARTPTS[s{k}];" for k, (s0, s1) in enumerate(segs)) + "".join(f"[s{k}]" for k in range(len(segs))) + f"concat=n={len(segs)}:v=0:a=1,atempo={TEMPO},aresample=48000[o]"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(VO, "narration.mp3"), "-filter_complex", fc, "-map", "[o]", "-ac", "1", os.path.join(VO, "narration_fast.wav")], check=True)
remap = lambda t: (t - sum(c1 - c0 for c0, c1 in cuts if c1 <= t)) / TEMPO
ep = json.load(open(os.path.join(ROOT, "src", "data", "episode-draft.json")))
k = 0
for s in ep["shots"]:
    s["words"] = []
    for tok in s["vo_markup"].split():
        w = W[k]; k += 1
        s["words"].append({"text": tok.replace("*", ""), "highlight": tok.startswith("*"), "start": round(remap(w["start"]), 3), "end": round(remap(w["end"]), 3)})
assert k == len(W), (k, len(W))
sh = ep["shots"]
for i, s in enumerate(sh):
    if s["words"]:
        s["start"] = 0.0 if i == 0 else round(s["words"][0]["start"] - 0.1, 3)
for i, s in enumerate(sh):
    if i < len(sh) - 1 and sh[i + 1]["words"]:
        s["end"] = sh[i + 1]["start"]
last = max(i for i, s in enumerate(sh) if s["words"])
sh[last]["end"] = round(sh[last]["words"][-1]["end"] + 0.9, 3)
title = sh[last + 1]; title["start"] = sh[last]["end"]; title["end"] = round(title["start"] + 4.2, 3)
ep["durationSec"] = title["end"]
ep["timingSource"] = (sys.argv[1] if len(sys.argv) > 1 else "ai33 transcript") + f", gaps>0.9s cut to 0.5s ({len(cuts)}), atempo x{TEMPO}"
for s in sh:
    s.pop("vo_markup", None)
json.dump(ep, open(os.path.join(ROOT, "src", "data", "episode.json"), "w"), ensure_ascii=False, indent=1)
print("total", ep["durationSec"], "| shots", [(s["id"], round(s["end"] - s["start"], 2)) for s in sh])
