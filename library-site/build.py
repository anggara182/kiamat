"""Build the THE LAST DAYS library page from episodes.json -> index.html (published as a claude.ai artifact with media/ files).
Add an episode: put its 720p mp4 (< 15 MB) and cover jpg in media/, add an entry to episodes.json, run this, republish.
usage: python3 build.py
"""
import html, json, os

HERE = os.path.dirname(os.path.abspath(__file__))
eps = sorted(json.load(open(os.path.join(HERE, "episodes.json"))), key=lambda e: e["chapter"])
esc = lambda s: html.escape(s or "", quote=True)

PILL = {"final": ("Final", "pill-final"), "posted": ("Posted", "pill-posted"), "production": ("In production", "pill-prod"), "draft": ("Draft", "pill-draft")}


def card(e):
    n = e["chapter"]
    label, cls = PILL.get(e["status"], (e["status"], "pill-draft"))
    if e.get("video"):
        media = f'<video class="vid" controls playsinline preload="metadata" poster="{esc(e["cover"])}" src="{esc(e["video"])}"></video>'
    else:
        media = '<div class="vid vid-empty"><span>Chapter ' + str(n) + '</span><small>video in production</small></div>'
    vo = "".join(f"<p>{esc(line)}</p>" for line in e.get("vo", "").split("\n") if line.strip())
    srcs = "".join(f"<li>{esc(s)}</li>" for s in e.get("sources", []))
    c = e.get("classification", {})
    details = []
    if vo:
        details.append(f'<details><summary>Narration</summary><div class="vo">{vo}</div></details>')
    if e.get("caption"):
        cid = f'cap-{e["id"]}'
        details.append(
            f'<details><summary>Caption</summary><pre class="cap" id="{cid}">{esc(e["caption"])}</pre>'
            f'<button class="copy" type="button" data-target="{cid}">Copy caption</button></details>')
    details.append(
        f'<details><summary>Sources &amp; classification</summary><ul class="src">{srcs}</ul>'
        f'<dl class="cls"><dt>Canonical</dt><dd>{esc(c.get("canonical"))}</dd>'
        f'<dt>Interpretation</dt><dd>{esc(c.get("interpretation"))}</dd>'
        f'<dt>Fiction</dt><dd>{esc(c.get("fiction"))}</dd></dl>'
        + (f'<p class="credits">{esc(e["credits"])}</p>' if e.get("credits") else "") + '</details>')
    q = e.get("quote") or {}
    quote = f'<blockquote><p>“{esc(q.get("text"))}”</p><cite>{esc(q.get("source"))}</cite></blockquote>' if q.get("text") else ""
    dur = f'<span class="dur">{esc(e["duration"])}</span>' if e.get("duration") else ""
    return f'''
<article class="ep" id="chapter-{n}">
  <div class="media">{media}</div>
  <div class="meta">
    <div class="eyebrow"><span class="num">Chapter {n}</span><span class="pill {cls}">{esc(e.get("status_label") or label)}</span>{dur}</div>
    <h2>{esc(e["title"])}</h2>
    <p class="phase">{esc(e.get("phase"))}</p>
    <p class="logline">{esc(e.get("logline"))}</p>
    {quote}
    {"".join(details)}
  </div>
</article>'''


page = f'''<title>The Last Days Library</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600&family=Cormorant+Garamond:ital,wght@1,500&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
/* layout: a vertical archive of chapters, each a 9:16 player beside its dossier (stacks on phones). Single dark look, on purpose: it matches the films. */
:root {{
  --night: #0b0d17; --panel: #12152a; --line: #262a45; --ink: #ece6d6; --muted: #9a97a8; --gold: #d9a441; --gold-dim: #8a6a2e;
  --ok: #7fb58a; --prod: #c9a35a;
  --display: "Cinzel", "Trajan Pro", Georgia, serif; --quote: "Cormorant Garamond", Georgia, serif;
  --body: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif; --mono: "IBM Plex Mono", ui-monospace, Menlo, monospace;
  color-scheme: dark;
}}
* {{ box-sizing: border-box; }}
body {{ background: var(--night); color: var(--ink); font: 15px/1.6 var(--body); margin: 0; }}
.wrap {{ max-width: 1040px; margin: 0 auto; padding-block: 40px 72px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); }}
header {{ display: grid; gap: 10px; padding-bottom: 28px; border-bottom: 1px solid var(--line); margin-bottom: 36px; }}
.series {{ font-family: var(--display); font-weight: 600; font-size: clamp(30px, 6vw, 46px); letter-spacing: .16em; margin: 0; text-wrap: balance; }}
.series span {{ color: var(--gold); }}
.tag {{ color: var(--muted); max-width: 62ch; margin: 0; }}
.stats {{ display: flex; flex-wrap: wrap; gap: 8px 20px; font: 500 12px/1 var(--mono); letter-spacing: .08em; text-transform: uppercase; color: var(--muted); font-variant-numeric: tabular-nums; }}
.stats b {{ color: var(--ink); font-weight: 500; }}
.list {{ display: grid; gap: 40px; }}
.ep {{ display: grid; grid-template-columns: minmax(0, 300px) minmax(0, 1fr); gap: 28px; align-items: start; }}
.media {{ position: sticky; top: calc(env(safe-area-inset-top, 0px) + 16px); }}
.vid {{ width: 100%; max-width: 100%; aspect-ratio: 9 / 16; display: block; background: #000; border: 1px solid var(--line); border-radius: 6px; }}
.vid-empty {{ display: grid; place-content: center; text-align: center; gap: 6px; background: repeating-linear-gradient(135deg, #10132a 0 12px, #0d1024 12px 24px); }}
.vid-empty span {{ font-family: var(--display); letter-spacing: .14em; color: var(--gold); font-size: 18px; }}
.vid-empty small {{ color: var(--muted); font: 12px var(--mono); letter-spacing: .06em; }}
.meta {{ min-width: 0; display: grid; gap: 12px; }}
.eyebrow {{ display: flex; flex-wrap: wrap; align-items: center; gap: 10px; font: 500 12px/1 var(--mono); letter-spacing: .1em; text-transform: uppercase; }}
.num {{ color: var(--gold); }}
.dur {{ color: var(--muted); font-variant-numeric: tabular-nums; }}
.pill {{ padding: 5px 9px; border-radius: 999px; border: 1px solid currentColor; font-size: 11px; }}
.pill-final {{ color: var(--ok); }} .pill-posted {{ color: var(--gold); }} .pill-prod {{ color: var(--prod); }} .pill-draft {{ color: var(--muted); }}
h2 {{ font-family: var(--display); font-weight: 600; font-size: clamp(24px, 4.4vw, 34px); letter-spacing: .08em; line-height: 1.15; margin: 0; text-wrap: balance; }}
.phase {{ margin: 0; color: var(--muted); font-size: 13px; }}
.logline {{ margin: 0; max-width: 62ch; }}
blockquote {{ margin: 6px 0; padding: 16px 18px; background: var(--panel); border-left: 2px solid var(--gold-dim); border-radius: 0 6px 6px 0; }}
blockquote p {{ margin: 0 0 8px; font: italic 500 21px/1.35 var(--quote); color: var(--ink); }}
blockquote cite {{ font: 500 11px var(--mono); letter-spacing: .12em; text-transform: uppercase; color: var(--gold); font-style: normal; }}
details {{ border-top: 1px solid var(--line); padding-top: 10px; }}
summary {{ cursor: pointer; font: 600 13px var(--body); letter-spacing: .04em; color: var(--ink); list-style-position: inside; }}
summary:focus-visible, .copy:focus-visible, video:focus-visible {{ outline: 2px solid var(--gold); outline-offset: 3px; }}
.vo p {{ margin: 8px 0 0; max-width: 64ch; color: #d6d0c2; }}
.cap {{ white-space: pre-wrap; font: 13px/1.55 var(--mono); background: var(--panel); border: 1px solid var(--line); border-radius: 6px; padding: 12px; margin: 10px 0 8px; overflow-x: auto; }}
.copy {{ font: 600 12px var(--body); color: var(--night); background: var(--gold); border: 0; border-radius: 4px; padding: 8px 12px; cursor: pointer; }}
.src {{ margin: 10px 0; padding-left: 18px; color: #d6d0c2; }}
.cls {{ display: grid; grid-template-columns: max-content minmax(0, 1fr); gap: 6px 14px; margin: 8px 0; font-size: 13px; }}
.cls dt {{ font: 500 11px/1.9 var(--mono); letter-spacing: .1em; text-transform: uppercase; color: var(--gold); }}
.cls dd {{ margin: 0; color: #d6d0c2; }}
.credits {{ font: 12px var(--mono); color: var(--muted); margin: 8px 0 0; }}
footer {{ margin-top: 48px; padding-top: 18px; border-top: 1px solid var(--line); color: var(--muted); font-size: 12px; }}
@media (max-width: 720px) {{
  .ep {{ grid-template-columns: minmax(0, 1fr); }}
  .media {{ position: static; max-width: 340px; }}
  .cls {{ grid-template-columns: minmax(0, 1fr); }}
}}
@media (prefers-reduced-motion: reduce) {{ * {{ scroll-behavior: auto; }} }}
</style>
<div class="wrap">
  <header>
    <h1 class="series">THE LAST <span>DAYS</span></h1>
    <p class="tag">A cinematic series on the journey toward the end of the world, grounded in the Qur’an and authentic hadith. Every chapter lists its sources and marks what is canonical, interpretation, or fiction.</p>
    <div class="stats"><span><b>{len(eps)}</b> chapters</span><span><b>{sum(1 for e in eps if e["status"] in ("final", "posted"))}</b> finished</span><span><b>{sum(1 for e in eps if e["status"] == "production")}</b> in production</span></div>
  </header>
  <main class="list">{"".join(card(e) for e in eps)}</main>
  <footer>Videos here are 720p previews. Full 1080p files live in the kiamat repo (episodes/epNN/out).</footer>
</div>
<script>
document.querySelectorAll('.copy').forEach(function (b) {{
  b.addEventListener('click', function () {{
    var el = document.getElementById(b.dataset.target);
    var done = function () {{ b.textContent = 'Copied'; setTimeout(function () {{ b.textContent = 'Copy caption'; }}, 1600); }};
    var fallback = function () {{ var r = document.createRange(); r.selectNodeContents(el); var s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = 'Selected: press copy'; }};
    try {{ navigator.clipboard.writeText(el.textContent).then(done, fallback); }} catch (e) {{ fallback(); }}
  }});
}});
</script>
'''
open(os.path.join(HERE, "index.html"), "w").write(page)
print("index.html", len(page), "bytes,", len(eps), "chapters")
