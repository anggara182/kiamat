"""EP07 score: low drone + sub hit on "die" -> tension sting on "survives" -> marching crowd drums -> friendship theme
(warm piano, F/C) -> the SAME theme gone dissonant over the rope -> drop to near silence, low hit on "back" ->
war drums + BOOM on "other" -> lanterns: a piano line that loses a note each bar -> near silence at the sandals ->
solemn quote + braam on "killed" -> tremolo on the clutching hand -> empty wind pad -> eerie warm shift for the
faceless giver -> cliffhanger tremolo -> title drop."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from scorelib import *  # noqa
s = Score(os.path.join(os.path.dirname(__file__), ".."), 72)
st, w = s.st, s.w
# 1-2 hook
s.pad("Dmb9", 0, st(3), 0.4, cutoff=700, a=0.05)
s.strings(["D2", "A2"], 0, st(3), 0.28, a=0.05)
s.hit(w(1, r"^die"), 0.75)
s.strings(["D3", "Eb3", "A3"], st(2), st(3), 0.3, a=0.8, trem=0.5)
s.strings(["D4", "Eb4", "A4"], w(2, r"^survives"), st(3), 0.35, a=0.005, r=0.5)
# 3 the march
s.drums(st(3), st(4), 0.55, dens=1.0)
s.prog(["Dm", "Bb", "Gm", "A"], st(3), st(4), beats=1, g=0.32, kind="strings", bass_g=0.2)
# 4 friendship theme
s.pad("F", st(4), st(5), 0.3, cutoff=1300, a=0.4)
s.notes(st(4), [(0.2, "F4"), (0.8, "A4"), (1.4, "C5"), (2.2, "A4"), (3.0, "G4"), (3.8, "F4")], g=0.38, t_max=st(5))
# 5 same theme, dissonant
s.pad("Dmb9", st(5), st(6), 0.32, cutoff=900)
s.notes(st(5), [(0.2, "F4"), (0.8, "Ab4"), (1.4, "B4"), (2.0, "Ab4")], g=0.36, t_max=st(6))
# 6 one comes back
s.strings(["D2", "A2", "D3"], st(6), st(7), 0.25, a=0.6)
s.hit(w(6, r"^back"), 0.7)
# 7 father / son
s.strings(["D3", "Eb3", "A3", "D4"], st(7), st(8), 0.32, a=0.4, trem=0.4)
# 8 war
s.drums(st(8), st(9), 0.75, dens=2.0)
s.prog(["Dm", "Bb"], st(8), st(9), beats=1, g=0.35, kind="strings", bass_g=0.24)
s.swell(w(8, r"^other"), 1.2, 0.25)
s.hit(w(8, r"^other"), 0.95)
# 9-10 the camp grows quieter
seq = [(0.2, "D5"), (0.7, "A4"), (1.2, "F4"), (1.7, "D4"), (2.5, "A4"), (3.0, "F4"), (3.5, "D4")]
s.notes(st(9), seq, g=0.32, t_max=st(10))
s.pad("Dm", st(9), st(11), 0.25, cutoff=700, a=0.6)
s.notes(st(10), [(0.4, "D4"), (2.2, "A3")], g=0.3, t_max=st(11))
# 11 quote
s.pad("Dm", st(11), st(12), 0.42, cutoff=900, a=0.6)
s.notes(st(11), [(0.6, "A4"), (2.2, "F4"), (3.8, "E4")], t_max=w(11, r"^killed"))
s.braam(w(11, r"^killed"), 0.7)
# 12 clutching hand
s.strings(["D3", "Eb3", "A3"], st(12), st(13), 0.35, a=0.3, trem=0.8)
# 13 the gold doesn't care
s.pad("Dm", st(13), st(14), 0.28, cutoff=600, a=0.5)
s.notes(st(13), [(0.5, "D4"), (2.0, "C4"), (3.2, "A3")], g=0.3, t_max=st(14))
# 14 the giver: eerie warmth
s.pad("Fadd#11", st(14), st(15), 0.32, cutoff=1500, a=0.8)
s.notes(st(14), [(0.4, "C6"), (1.4, "A5"), (2.4, "B5"), (3.4, "F5"), (4.6, "A5")], g=0.22, t_max=st(15))
# 15 cliffhanger
s.cliff(st(15), 0.42)
s.render()
