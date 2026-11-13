"""EP05 score: chain hook (low drone) -> grief piano for the teachers -> funeral strings -> empty classroom ->
hypnotic chant pulse -> lamp-off silence -> mystery under the excavation -> eerie statue pad -> hypnotic circling
ostinato -> solemn quote -> deceptively warm rain/harvest with a low drone underneath -> rising unease on the money ->
title drop (the last shot itself is the cliffhanger)."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from scorelib import *  # noqa
s = Score(os.path.join(os.path.dirname(__file__), ".."), 80)
st, w = s.st, s.w
s.pad("Dmb9", 0, st(3), 0.35, cutoff=700); s.hit(w(1, r"^monday"), 0.6)
s.notes(st(3), [(0.2, "A4"), (1.0, "F4"), (1.8, "D4")], t_max=st(4)); s.pad("Dm", st(3), st(4), 0.25)
s.strings(["D3", "A3", "D4", "F4"], st(4), st(5), 0.35, a=0.6)
s.notes(st(5), [(0.2, "E4"), (1.2, "D4")], t_max=st(6))
s.drums(st(6), st(7), 0.45, dens=1.0); s.motif(["D4", "D4", "F4", "D4"], st(6), st(7), g=0.3, octave_down=False)
s.silence(w(7, r"^answer") + 0.25, st(8))
s.pad("Dmb9", st(8), st(10), 0.35, cutoff=800); s.hit(w(8, r"^uncovered"), 0.5)
s.strings(["D3", "Eb3", "A3"], st(10), st(12), 0.3, a=0.8)
s.motif(["A3", "D4", "F4", "E4"], st(12), st(14), step=s.BEAT / 2, g=0.35); s.pad("Dm", st(12), st(14), 0.35)
s.braam(w(13, r"^right"), 0.6)
s.pad("Dm", st(14), st(15), 0.42, cutoff=900, a=1.0); s.notes(st(14), [(0.6, "A4"), (2.4, "F4"), (4.2, "E4"), (5.8, "D4")], t_max=st(15))
s.prog(["F", "C", "Bb", "F"], st(15), st(17), beats=2, g=0.42, kind="strings", bass_g=0.2, arp=True)
s.pad("Dmb9", st(15), st(17), 0.18, cutoff=500)
s.strings(["D3", "Eb3", "A3", "D4"], st(17), s.title_t, 0.45, a=0.3, r=0.01, trem=0.8)
s.swell(s.title_t, min(1.6, s.title_t - st(17)), 0.25)
s.render()
