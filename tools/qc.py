"""QC an episode render: one frame per shot (at its first sync word, else mid-shot) + a mid-title frame, two contact
sheets, loudness, and audio/video offset vs public/audio/mix.wav.
usage: python3 tools/qc.py episodes/epNN out/<final>.mp4"""
import json, os, re, subprocess, sys
import numpy as np
ep_dir, vid = sys.argv[1], sys.argv[2]
sys.path.insert(0, os.path.join(ep_dir, "scripts"))
from audiolib import load, SR, lufs
from scipy import signal
e = json.load(open(os.path.join(ep_dir, "src", "data", "episode.json")))
vid = os.path.join(ep_dir, vid)
qc = os.path.join(ep_dir, "out", "qc"); os.makedirs(qc, exist_ok=True)
files = []
for s in e["shots"]:
    t = (s["start"] + s["end"]) / 2; lab = str(s["id"])
    if s.get("sync") and s["words"]:
        sw = s["sync"][0]
        hits = [w["start"] for w in s["words"] if re.match(re.escape(sw), w["text"], re.I)]
        if hits:
            t = min(hits[0] + 0.25, s["end"] - 0.05); lab = f'{s["id"]} {sw}'
    if not s["words"]:
        t = s["start"] + 2.5; lab = f'{s["id"]} title'
    f = os.path.join(qc, f'q{s["id"]:02d}.jpg'); files.append(f)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.3f}", "-i", vid, "-frames:v", "1", "-vf",
                    f"scale=300:533,drawtext=text='{lab} {t:.2f}':x=6:y=6:fontsize=20:fontcolor=yellow:box=1:boxcolor=black@0.6", f], check=True)
half = (len(files) + 1) // 2
for name, part in (("A", files[:half]), ("B", files[half:])):
    subprocess.run(["montage", *part, "-tile", f"{min(7, len(part))}x2", "-geometry", "+3+3", "-background", "#111", os.path.join(qc, f"{name}.jpg")], check=True)
a = load(os.path.join(ep_dir, "public", "audio", "mix.wav"))[:, 0]; b = load(vid)
x = a[int(20 * SR):int(30 * SR)]; y = b[int(20 * SR):int(30 * SR), 0]
c = signal.correlate(y, x, mode="full", method="fft")
dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", vid]).decode())
print("offset ms", round((np.argmax(c) - (len(x) - 1)) / SR * 1000, 2), "| LUFS", round(lufs(b), 1), "| dur", round(dur, 2), "| size MB", round(os.path.getsize(vid) / 1e6, 1))
