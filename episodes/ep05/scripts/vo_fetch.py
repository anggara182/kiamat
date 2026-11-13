"""Wait for an already-submitted ai33 TTS task (task.json) and download it. Never resubmits (avoids double charges).
usage: python3 scripts/vo_fetch.py [max_minutes]"""
import json, os, sys, time, urllib.request
ROOT = os.path.join(os.path.dirname(__file__), "..")
OUT = os.path.join(ROOT, "public", "audio", "vo")
KEY = os.environ["AI33_API_KEY"]
info = json.load(open(os.path.join(OUT, "task.json")))
tid = info["task_id"]
limit = float(sys.argv[1]) if len(sys.argv) > 1 else 40


def get(path):
    r = urllib.request.Request("https://api.ai33.pro" + path, headers={"xi-api-key": KEY})
    with urllib.request.urlopen(r, timeout=60) as resp:
        return json.loads(resp.read())


def dl(url, path):
    r = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(r, timeout=180) as resp, open(path, "wb") as f:
        f.write(resp.read())


t0 = time.time()
while time.time() - t0 < limit * 60:
    try:
        t = get(f"/v1/task/{tid}")
    except Exception as e:
        print("poll error", e, flush=True); time.sleep(10); continue
    st = t.get("status")
    if st == "done":
        m = t["metadata"]
        dl(m["audio_url"], os.path.join(OUT, os.environ.get("OUTNAME", "narration") + ".mp3"))
        if m.get("json_url"):
            dl(m["json_url"], os.path.join(OUT, os.environ.get("OUTNAME", "narration") + ".json"))
        info["credits"] = t.get("credit_cost") or m.get("credit_cost")
        json.dump(info, open(os.path.join(OUT, "task.json"), "w"), indent=1)
        print("done", tid, flush=True); sys.exit(0)
    if st == "error":
        print("task error", t.get("error_message"), flush=True); sys.exit(2)
    print(time.strftime("%H:%M:%S"), st, flush=True)
    time.sleep(20)
print("still not done after", limit, "min", flush=True); sys.exit(3)
