// Per-set self-check for parallel agents: bake ONLY this set's bands, then render stills of the given shots.
// usage: node scripts/preview.mjs <set> <shotIds,comma> [fractions=0.15,0.5,0.9]
// Output: out/preview/<set>/sXX_<frac>.jpg + out/preview/<set>.jpg (strip). Safe to run in parallel with other sets.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import { getCompositions, renderStill, openBrowser } from '@remotion/renderer';

const [set, ids, fr = '0.15,0.5,0.9'] = process.argv.slice(2);
if (!set || !ids) { console.error('usage: node scripts/preview.mjs <set> <shotIds,comma> [fractions]'); process.exit(1); }
const shotIds = ids.split(',').map(Number), fracs = fr.split(',').map(Number);
const browserExecutable = fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : null;
const chromiumOptions = { gl: 'swiftshader' };
const bundleDir = path.resolve(`out/bundle-${set}`);
const bundle = () => execSync(`npx remotion bundle src/index.ts --out-dir=${bundleDir}`, { stdio: 'ignore' });
const t0 = Date.now();
bundle();
let browser = await openBrowser('chrome', { browserExecutable, chromiumOptions, logLevel: 'error' });
let comps = await getCompositions(bundleDir, { puppeteerInstance: browser, browserExecutable, chromiumOptions, logLevel: 'error' });
// 1. bake this set's bands (hash = band id + set file + its local imports)
const cacheFile = `public/baked/cache-${set}.json`;
const cache = fs.existsSync(cacheFile) ? JSON.parse(fs.readFileSync(cacheFile, 'utf8')) : {};
const srcHash = crypto.createHash('sha1');
for (const f of fs.readdirSync('src/sets').concat(fs.readdirSync('src/art'))) if (f.startsWith(set) || f === `${set}.tsx`) srcHash.update(fs.readFileSync(fs.existsSync(`src/sets/${f}`) ? `src/sets/${f}` : `src/art/${f}`));
const h = srcHash.digest('hex').slice(0, 12);
let baked = 0;
for (const c of comps.filter((c) => c.id.startsWith('Band-') && String(c.defaultProps.band).startsWith(`${set}/`))) {
  const id = c.defaultProps.band, out = `public/baked/${id}.png`;
  if (cache[id] === h && fs.existsSync(out)) continue;
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await renderStill({ composition: c, serveUrl: bundleDir, output: out, imageFormat: 'png', puppeteerInstance: browser, browserExecutable, chromiumOptions, overwrite: true, logLevel: 'error' });
  cache[id] = h; baked++;
}
fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 1));
// 2. re-bundle so the stills see the fresh PNGs, then render stills
if (baked) {
  await browser.close({ silent: true });
  bundle();
  browser = await openBrowser('chrome', { browserExecutable, chromiumOptions, logLevel: 'error' });
  comps = await getCompositions(bundleDir, { puppeteerInstance: browser, browserExecutable, chromiumOptions, logLevel: 'error' });
}
const ep = JSON.parse(fs.readFileSync('src/data/episode.json', 'utf8'));
const fps = ep.fps, total = Math.round(ep.durationSec * fps);
const comp = comps.find((c) => c.id === 'Episode');
fs.mkdirSync(`out/preview/${set}`, { recursive: true });
const files = [];
for (const id of shotIds) {
  const i = ep.shots.findIndex((s) => s.id === id);
  const from = i === 0 ? 0 : Math.round(ep.shots[i].start * fps);
  const to = i === ep.shots.length - 1 ? total : Math.round(ep.shots[i + 1].start * fps);
  for (const f of fracs) {
    const frame = from + Math.min(to - from - 1, Math.floor((to - from) * f));
    const out = `out/preview/${set}/s${String(id).padStart(2, '0')}_${f}.jpg`;
    await renderStill({ composition: comp, serveUrl: bundleDir, output: out, frame, scale: 0.5, imageFormat: 'jpeg', jpegQuality: 85, puppeteerInstance: browser, browserExecutable, chromiumOptions, overwrite: true, logLevel: 'error' });
    files.push(out);
  }
}
await browser.close({ silent: true });
execSync(`montage ${files.join(' ')} -tile ${fracs.length}x${shotIds.length} -geometry 270x480+4+4 -background '#111' out/preview/${set}.jpg`);
console.log(`out/preview/${set}.jpg (baked ${baked}) in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
