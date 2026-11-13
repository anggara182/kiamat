"""Fetch an ai33 TTS result for this episode (task.json) without resubmitting. Tolerates 503s.
- status done -> download audio (+ transcript json if present)
- audio ready but transcript stuck for > WAIT_MIN minutes -> download audio only (timing then comes from scripts/align.py)
usage: python3 scripts/fetch_audio.py [max_minutes=90] [wait_min=8]"""
import json, os, sys, time, urllib.request
from datetime import datetime, timezone
ROOT = os.path.join(os.path.dirname(__file__), "..")
OUT = os.path.join(ROOT, "public", "audio", "vo")
KEY = os.environ["AI33_API_KEY"]
info = json.load(open(os.path.join(OUT, "task.json")))
tid = info["task_id"]
limit = float(sys.argv[1]) if len(sys.argv) > 1 else 90
wait_min = float(sys.argv[2]) if len(sys.argv) > 2 else 8


def get(path):
    r = urllib.request.Request("https://api.ai33.pro" + path, headers={"xi-api-key": KEY})
    with urllib.request.urlopen(r, timeout=60) as resp:
        return json.loads(resp.read())


def dl(url, path):
    for i in range(6):
        try:
            r = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(r, timeout=180) as resp, open(path, "wb") as f:
                f.write(resp.read())
            return
        except Exception as e:
            print("download retry", i, e, flush=True); time.sleep(10)
    raise SystemExit("download failed")


t0 = time.time()
while time.time() - t0 < limit * 60:
    try:
        t = get(f"/v1/task/{tid}")
    except Exception as e:
        print(time.strftime("%H:%M:%S"), "poll error", e, flush=True); time.sleep(20); continue
    m = t.get("metadata") or {}
    created = datetime.fromisoformat(t["created_at"].replace("Z", "+00:00"))
    age = (datetime.now(timezone.utc) - created).total_seconds() / 60
    if t.get("status") == "done":
        dl(m["audio_url"], os.path.join(OUT, "narration.mp3"))
        if m.get("json_url"):
            dl(m["json_url"], os.path.join(OUT, "narration.json"))
        print("DONE with transcript" if m.get("json_url") else "DONE (no transcript)", tid, flush=True); sys.exit(0)
    if t.get("status") == "error":
        print("TASK ERROR", t.get("error_message"), flush=True); sys.exit(2)
    if m.get("audio_url") and age > wait_min:
        dl(m["audio_url"], os.path.join(OUT, "narration.mp3"))
        print("AUDIO ONLY (transcript stuck:", m.get("transcript_status"), ")", tid, flush=True); sys.exit(4)
    print(time.strftime("%H:%M:%S"), t.get("status"), "transcript", m.get("transcript_status"), "age %.1f min" % age, flush=True)
    time.sleep(30)
print("TIMEOUT", tid, flush=True); sys.exit(3)
