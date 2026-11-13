// Verification: one still per shot (middle of each shot, or at given fractions), scale 0.5, then a contact sheet.
// usage: node scripts/contact.mjs [frac=0.5] [shotIds,comma]   (uses the existing out/bundle; run bake first)
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { getCompositions, renderStill, openBrowser } from '@remotion/renderer';

const frac = Number(process.argv[2] ?? 0.5);
const only = process.argv[3] ? process.argv[3].split(',').map(Number) : null;
const ep = JSON.parse(fs.readFileSync('src/data/episode.json', 'utf8'));
const fps = ep.fps, shots = ep.shots;
const total = Math.max(Math.round(ep.durationSec * fps), Math.round(shots.at(-1).end * fps));
const spans = shots.map((s, i) => {
  const from = i === 0 ? 0 : Math.round(s.start * fps);
  const to = i === shots.length - 1 ? total : Math.round(shots[i + 1].start * fps);
  return { id: s.id, from, dur: to - from };
});
const browserExecutable = fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : null;
const chromiumOptions = { gl: 'swiftshader' };
execSync('npx remotion bundle src/index.ts --out-dir=out/bundle', { stdio: 'ignore' });
const serveUrl = path.resolve('out/bundle');
const browser = await openBrowser('chrome', { browserExecutable, chromiumOptions, logLevel: 'error' });
const comp = (await getCompositions(serveUrl, { puppeteerInstance: browser, browserExecutable, chromiumOptions, logLevel: 'error' })).find((c) => c.id === 'Episode');
fs.mkdirSync('out/stills', { recursive: true });
const files = [];
for (const s of spans) {
  if (only && !only.includes(s.id)) continue;
  const frame = s.from + Math.min(s.dur - 1, Math.floor(s.dur * frac));
  const out = `out/stills/s${String(s.id).padStart(2, '0')}.jpg`;
  await renderStill({ composition: comp, serveUrl, output: out, frame, scale: 0.5, imageFormat: 'jpeg', jpegQuality: 88, puppeteerInstance: browser, browserExecutable, chromiumOptions, overwrite: true, logLevel: 'error' });
  files.push(out);
  console.log(`shot ${s.id} @${frame}`);
}
await browser.close({ silent: true });
if (!only) {
  execSync(`montage ${files.join(' ')} -tile 7x2 -geometry 270x480+6+6 -background '#111' -label '' out/contact.jpg`);
  console.log('out/contact.jpg');
}
