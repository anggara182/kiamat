"""EP01 audio mix: VO (front) + drone/ambience bed ducked under VO + two low notes + a riser. Master -14 LUFS, TP -1.4.
All cue times come from src/data/episode.json (real VO timing). SFX files reused from the horrorluar library (no new SFX generated).
usage: python3 scripts/mix.py   -> public/audio/mix.wav
"""
import json, os, subprocess
ROOT = os.path.join(os.path.dirname(__file__), "..")
A = os.path.join(ROOT, "public", "audio")
ep = json.load(open(os.path.join(ROOT, "src", "data", "episode.json")))
S = {s["id"]: s for s in ep["shots"]}
D = ep["durationSec"]
word = lambda sid, txt: next(w for w in S[sid]["words"] if txt in w["text"].lower())
t_foretold = word(18, "foretold")["start"]
t_card = S[21]["words"][-1]["end"] + 0.2
t_riser_end = S[21]["words"][-1]["end"]
t_dawn_out = S[5]["start"]
t_night_in = S[19]["start"]
ms = lambda t: int(max(0, t) * 1000)
fc = f"""
[0:a]loudnorm=I=-16:TP=-2:LRA=11,aformat=sample_rates=48000:channel_layouts=stereo,asplit=2[vo][vosc];
[1:a]atrim=0:{D},volume=0.20,afade=t=in:d=1.5,afade=t=out:st={D-2.5}:d=2.5[dr];
[2:a]atrim=0:{t_dawn_out+0.8},volume=0.40,afade=t=out:st={max(0,t_dawn_out-0.6)}:d=1.4[dw];
[3:a]atrim=0:{D-t_night_in},volume=0.32,afade=t=in:d=1.5,adelay={ms(t_night_in)}|{ms(t_night_in)}[cn];
[dr][dw][cn]amix=inputs=3:normalize=0,aformat=sample_rates=48000:channel_layouts=stereo[bedraw];
[bedraw][vosc]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=350[bed];
[4:a]volume=0.55,adelay={ms(t_foretold)}|{ms(t_foretold)}[l1];
[5:a]volume=0.65,adelay={ms(t_card)}|{ms(t_card)}[l2];
[6:a]volume=0.30,afade=t=out:st=3.4:d=0.6,adelay={ms(t_riser_end-4.0)}|{ms(t_riser_end-4.0)}[rs];
[vo][bed][l1][l2][rs]amix=inputs=5:normalize=0,atrim=0:{D},loudnorm=I=-14:TP=-1.4:LRA=11,aresample=48000[out]
"""
cmd = ["ffmpeg", "-v", "error", "-y",
       "-i", f"{A}/vo/narration_fast.wav",
       "-stream_loop", "-1", "-i", f"{A}/sfx/drone.mp3",
       "-i", f"{A}/sfx/dawn.mp3",
       "-stream_loop", "-1", "-i", f"{A}/sfx/city_night.mp3",
       "-i", f"{A}/sfx/low_note.mp3", "-i", f"{A}/sfx/low_note.mp3", "-i", f"{A}/sfx/riser.mp3",
       "-filter_complex", fc.replace("\n", ""), "-map", "[out]", "-ac", "2", "-c:a", "pcm_s16le", f"{A}/mix.wav"]
subprocess.run(cmd, check=True)
print("mix.wav", D, "s")
