"""EP06 score: scorched drone hook -> drop-out on "stopped" -> slow drought pulse that thickens shot by shot
(boats, fish, trucks, water, thread, fields) -> mystery piano for the old men -> low braam on the prophecy ("gold") ->
solemn quote pad -> sparse plucks under the laughter -> glint sting on "shine" -> digging drums accelerate ->
BOOM + awe chords on "see" -> golden strings at sunset -> pulse of the news -> cliffhanger tremolo -> title drop."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from scorelib import *  # noqa
s = Score(os.path.join(os.path.dirname(__file__), ".."), 76)
st, w = s.st, s.w
# 1-2 hook
s.pad("Dmb9", 0, w(2, r"^stopped"), 0.38, cutoff=750, a=0.05)
s.strings(["D2", "A2"], 0, w(2, r"^stopped"), 0.25, a=0.05, r=0.05)
s.hit(w(1, r"^euphrates"), 0.55)
s.hit(w(2, r"^stopped"), 0.7)
s.silence(w(2, r"^stopped") + 0.35, st(3) + 0.15)
# 3-8 drought: thickening pulse
s.drums(st(3), st(9), 0.4, dens=0.5, ticks=False)
s.prog(["Dm", "Bb", "Gm", "A"], st(3), st(9), beats=2, g=0.32, kind="pad", bass_g=0.16)
s.strings(["D3", "A3", "D4"], st(6), st(9), 0.3, a=1.2)
s.motif(["D4", "E4", "F4", "E4"], st(5), st(9), step=s.BEAT, g=0.22, octave_down=False)
# 9-10 old men remember: mystery
s.pad("Dm", st(9), st(11), 0.3, cutoff=800, a=0.8)
s.notes(st(9), [(0.2, "A4"), (1.2, "F4"), (2.4, "E4"), (3.4, "D4"), (4.6, "A3"), (5.6, "D4")], t_max=st(11))
s.braam(w(10, r"^gold"), 0.65)
# 11 quote
s.pad("Dm", st(11), st(12), 0.42, cutoff=900, a=0.6)
s.notes(st(11), [(0.5, "A4"), (1.9, "F4"), (3.3, "D4")], t_max=st(12))
# 12 laughter: light plucks
s.motif(["A3", "C4", "A3", "E4"], st(12), st(13), step=s.BEAT / 2, g=0.25, octave_down=False)
# 13 shine: suspense + glint
s.strings(["D3", "Eb3", "A3"], st(13), st(14), 0.3, a=0.6, trem=0.5)
place(s.mus, piano(note_hz("A5"), 2.0, 0.5) + piano(note_hz("E6"), 2.0, 0.3), w(13, r"^shine"))
# 14-15 digging: accelerating drums
s.drums(st(14), st(16), 0.55, dens=1.0)
s.prog(["Dm", "Bb", "C", "A"], st(14), st(16), beats=1, g=0.35, kind="strings", bass_g=0.2)
s.swell(w(16, r"^see"), 1.4, 0.25)
# 16-17 the gold: boom + awe
s.hit(w(16, r"^see"), 0.95)
s.prog(["F", "C", "Bb", "F"], st(16), st(18), beats=3, g=0.34, kind="strings", bass_g=0.2)
s.notes(w(16, r"^see"), [(0.3, "F5"), (1.5, "C5"), (2.7, "A4"), (4.2, "Bb4"), (5.6, "F4")], g=0.3, t_max=st(18))
s.pad("F", w(16, r"^see"), st(18), 0.3, cutoff=1500, a=0.3)
# 18 the news spreads
s.drums(st(18), st(19), 0.5, dens=1.0)
s.prog(["Dm", "Bb"], st(18), st(19), beats=2, g=0.32, kind="pad", bass_g=0.2)
# 19 cliffhanger
s.cliff(st(19), 0.42)
s.render()
