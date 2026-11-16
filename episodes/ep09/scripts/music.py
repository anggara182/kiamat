"""EP09 score: war drums + low strings under the banners, hit on "soldiers", swell + hit on "promise" -> warm
handshake chord -> bright peace progression with piano arpeggio -> triumphant strings + hit on "won" -> dissonant
tremolo, hit on "was" -> near silence, low hit on "ash" -> dark pulse under the warships -> solemn quote + braam ->
grief strings and piano for the volunteers and mothers -> driving night pulse -> cliffhanger tremolo -> title drop."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from scorelib import *  # noqa
s = Score(os.path.join(os.path.dirname(__file__), ".."), 76)
st, w = s.st, s.w
s.drums(0, st(3), 0.65, dens=1.5)
s.prog(["Dm", "Bb", "Dm", "A"], 0, st(3), beats=2, g=0.34, kind="strings", bass_g=0.24)
s.hit(w(1, r"^soldiers"), 0.75)
s.swell(w(2, r"^promise"), 1.2, 0.22); s.hit(w(2, r"^promise"), 0.8)
s.pad("F", st(3), st(4), 0.32, cutoff=1500, a=0.2)
place(s.mus, piano(note_hz("F4"), 2.5, 0.45) + piano(note_hz("C5"), 2.5, 0.35), w(3, r"^handshake"))
s.prog(["F", "C", "Dm", "Bb"], st(4), st(6), beats=2, g=0.28, kind="pad", bass_g=0.15, arp=True)
s.prog(["F", "C", "Bb", "C"], st(6), st(7), beats=1, g=0.34, kind="strings", bass_g=0.2)
s.drums(st(6), st(7), 0.45, dens=1.0, ticks=False)
s.hit(w(6, r"^won"), 0.6)
s.strings(["D3", "Eb3", "A3"], st(7), st(8), 0.34, a=0.3, trem=0.7)
s.hit(w(7, r"^was"), 0.6)
s.silence(st(8), w(8, r"^ash") - 0.02)
s.hit(w(8, r"^ash"), 0.55)
s.drums(st(9), st(10), 0.5, dens=1.0)
s.prog(["Dm", "Bb"], st(9), st(10), beats=2, g=0.3, kind="pad", bass_g=0.22)
s.pad("Dm", st(10), st(11), 0.42, cutoff=900, a=0.6)
s.notes(st(10), [(0.6, "A4"), (2.2, "F4"), (3.8, "E4"), (5.4, "D4")], t_max=st(11) - 0.6)
s.braam(s.S[10]["words"][-1]["end"] + 0.05, 0.65)
s.prog(["Dm", "Bb", "F", "A"], st(11), st(13), beats=3, g=0.3, kind="strings", bass_g=0.16)
s.notes(st(11), [(0.3, "D5"), (1.5, "C5"), (2.7, "A4"), (4.2, "F4"), (5.6, "A4"), (7.2, "D5"), (8.6, "E5"), (10.0, "C5")], g=0.3, t_max=st(13))
s.drums(st(13), st(14), 0.5, dens=1.0, ticks=False)
s.pad("Dmb9", st(13), st(14), 0.28, cutoff=700)
s.cliff(w(14, r"^faced"), 0.38)
s.render()
