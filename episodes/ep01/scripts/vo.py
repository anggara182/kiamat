"""EP01 narration: ONE ai33 TTS task (eleven_v3, with word transcript) for the whole VO.

Shared-key safety (same rules as the other studio projects on this ai33 key):
- before submitting, count tasks that are not done/error across the whole key (GET /v3/tasks?page=1&limit=20);
  if 4 or more, wait (re-check every ~15 s);
- on HTTP 429 / queue_limit_exceeded: exponential backoff with jitter (30 -> 60 -> 120 -> 240 s, max 300 s), stop after 5 failures;
- poll the task no faster than every 3 s.
Output: public/audio/vo/narration.mp3 + narration.json (word timestamps) + task.json (task id, voice, text).
usage: python3 scripts/vo.py [voice_id]
"""
import json, os, random, sys, time, urllib.request, urllib.error, uuid

BASE = "https://api.ai33.pro"
KEY = os.environ["AI33_API_KEY"]
ROOT = os.path.join(os.path.dirname(__file__), "..")
OUT = os.path.join(ROOT, "public", "audio", "vo")
VOICE = sys.argv[1] if len(sys.argv) > 1 else "elevenlabs_nPczCjzI2devNBz1zQrb"  # "Brian": deep, warm narrator
TAG = "[serious, cinematic storyteller, brisk pace]"


def req(method, path, form=None, timeout=120):
    headers = {"xi-api-key": KEY}
    body = None
    if form is not None:
        b = uuid.uuid4().hex
        body = b"".join(f'--{b}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode() for k, v in form.items()) + f"--{b}--\r\n".encode()
        headers["Content-Type"] = f"multipart/form-data; boundary={b}"
    r = urllib.request.Request(BASE + path, data=body, headers=headers, method=method)
    with urllib.request.urlopen(r, timeout=timeout) as resp:
        return json.loads(resp.read())


def busy_count():
    d = req("GET", "/v3/tasks?page=1&limit=20")
    return sum(1 for t in d.get("data", []) if t.get("status") not in ("done", "error"))


def submit(text):
    fails = 0
    while True:
        while (n := busy_count()) >= 4:
            print(f"ai33 busy ({n} active), waiting...", flush=True); time.sleep(15 + random.random() * 5)
        try:
            return req("POST", "/v3/text-to-speech", {"text": text, "voice_id": VOICE, "model_id": "eleven_v3", "with_transcript": "true"})
        except urllib.error.HTTPError as e:
            msg = e.read().decode(errors="replace")
            if e.code == 429 or "queue_limit_exceeded" in msg:
                fails += 1
                if fails >= 5: raise SystemExit(f"ai33 rate limited 5x in a row, stopping: {msg}")
                d = min(300, 30 * 2 ** (fails - 1)) + random.random() * 10
                print(f"429/queue limit, backoff {d:.0f}s", flush=True); time.sleep(d); continue
            raise SystemExit(f"submit failed {e.code}: {msg}")


def wait(tid):
    t0 = time.time()
    while time.time() - t0 < 900:
        try:
            t = req("GET", f"/v1/task/{tid}")
        except Exception as e:
            print("poll error", e, flush=True); time.sleep(5); continue
        if t.get("status") in ("done", "error"):
            return t
        time.sleep(3.5)
    raise SystemExit(f"timeout {tid}")


def download(url, path):
    r = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(r, timeout=180) as resp, open(path, "wb") as f:
        f.write(resp.read())


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    ep = json.load(open(os.path.join(ROOT, "src", "data", "episode.json")))
    text = TAG + " " + " ".join(s["vo"] for s in ep["shots"])
    r = submit(text)
    tid = r.get("task_id") or r.get("id")
    json.dump({"task_id": tid, "voice": VOICE, "model": "eleven_v3", "text": text, "submitted": time.strftime("%Y-%m-%d %H:%M:%S")}, open(os.path.join(OUT, "task.json"), "w"), indent=1)
    print("task", tid, flush=True)
    t = wait(tid)
    if t["status"] != "done":
        raise SystemExit(f"task error: {t.get('error_message')}")
    m = t["metadata"]
    download(m["audio_url"], os.path.join(OUT, "narration.mp3"))
    if m.get("json_url"):
        download(m["json_url"], os.path.join(OUT, "narration.json"))
    info = json.load(open(os.path.join(OUT, "task.json"))); info["credits"] = t.get("credit_cost") or m.get("credit_cost"); info["metadata_keys"] = list(m.keys())
    json.dump(info, open(os.path.join(OUT, "task.json"), "w"), indent=1)
    print("done", flush=True)
