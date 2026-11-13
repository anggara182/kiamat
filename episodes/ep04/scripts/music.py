"""EP04 score: march hook -> soft open hands -> crowd swell -> repeating-city pulse -> institutions (uneasy, slightly
absurd plucks) -> clumsy building rhythm -> bright false cheer -> HIT + silence on "fell" -> drone -> thump on "silenced"
-> solemn quote -> sad exodus piano -> loud drums -> padlock hit -> cliff -> title drop."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from scorelib import *  # noqa
s = Score(os.path.join(os.path.dirname(__file__), ".."), 92)
st, w = s.st, s.w
s.drums(0, st(2), 0.75); s.pad("Dm", 0, st(2), 0.4)
s.pad("F", st(2), st(3), 0.3, cutoff=1500)
s.prog(["Dm", "Bb", "Gm", "A"], st(3), st(5), beats=2, g=0.5, kind="strings", bass_g=0.3); s.drums(st(3), st(5), 0.8)
s.prog(["Dmb9", "Dm"], st(5), st(9), beats=4, g=0.32); s.motif(["D4", "Eb4", "D4", "A3"], st(5), st(9), g=0.35)
s.drums(st(9), st(10), 0.5, dens=0.5, ticks=True); s.pad("Dm", st(9), st(10), 0.3)
s.prog(["F", "C"], st(10), st(11), beats=2, g=0.45, arp=True)
s.pad("Dmb9", st(11), w(11, r"^fell"), 0.22, cutoff=600)
s.hit(w(11, r"^fell"), 1.0); s.braam(w(11, r"^fell"), 0.7)
s.silence(w(11, r"^fell") + 0.9, st(12) + 0.4)
s.pad("Dm", st(12), st(14), 0.25, cutoff=600)
s.hit(w(13, r"^silenced"), 0.6)
s.pad("Dm", st(14), st(15), 0.42, cutoff=900, a=1.0); s.notes(st(14), [(0.6, "A4"), (2.2, "F4"), (3.8, "E4"), (5.4, "D4")], t_max=st(15))
s.notes(st(15), [(0.1, "D4"), (0.8, "F4"), (1.5, "A4"), (2.3, "G4")], t_max=st(16)); s.pad("Bb", st(15), st(16), 0.3)
s.drums(st(16), st(17), 0.7)
s.hit(w(17, r"^libraries"), 0.7)
s.cliff(w(17, r"^libraries"))
s.render()
