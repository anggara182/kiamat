// Bake static depth bands to PNG ONCE (blur applied to the merged band, never per frame).
// Bands live in src/sets/<set>.tsx and are registered as compositions `Band-<set>-<band>`.
// Output: public/baked/<set>/<band>.png. Cached per band by a hash of the set file and the art it imports.
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { getCompositions, renderStill, openBrowser } from '@remotion/renderer';

const only = process.argv.slice(2); // optional filter: substrings of band ids
const browserExecutable = fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : null;
const chromiumOptions = { gl: 'swiftshader' };
const t0 = Date.now();

// hash of a source file and (recursively) the local modules it imports
const resolve = (from, spec) => {
  const base = path.resolve(path.dirname(from), spec);
  for (const ext of ['.tsx', '.ts', '/index.ts']) if (fs.existsSync(base + ext)) return base + ext;
  return null;
};
const deps = (file, seen = new Set()) => {
  if (seen.has(file)) return seen;
  seen.add(file);
  const src = fs.readFileSync(file, 'utf8');
  for (const m of src.matchAll(/from '(\.[^']+)'/g)) {
    const f = resolve(file, m[1]);
    if (f && !f.endsWith('comp/Bands.tsx')) deps(f, seen);
  }
  return seen;
};
const bandHash = (id) => {
  const set = id.split('/')[0];
  const files = [...deps(path.resolve(`src/sets/${set}.tsx`))].sort();
  const h = crypto.createHash('sha1').update(id).update(fs.readFileSync('src/comp/Bands.tsx'));
  for (const f of files) h.update(fs.readFileSync(f));
  return h.digest('hex').slice(0, 12);
};

const cacheFile = 'public/baked/cache.json';
fs.mkdirSync('public/baked', { recursive: true });
const cache = fs.existsSync(cacheFile) ? JSON.parse(fs.readFileSync(cacheFile, 'utf8')) : {};
execSync('npx remotion bundle src/index.ts --out-dir=out/bundle', { stdio: 'ignore' });
const serveUrl = path.resolve('out/bundle');
const browser = await openBrowser('chrome', { browserExecutable, chromiumOptions, logLevel: 'error' });
const comps = (await getCompositions(serveUrl, { puppeteerInstance: browser, browserExecutable, chromiumOptions, logLevel: 'error' })).filter((c) => c.id.startsWith('Band-'));
let baked = 0;
for (const comp of comps) {
  const id = comp.defaultProps.band;
  const out = `public/baked/${id}.png`;
  const hash = bandHash(id);
  if (only.length && !only.some((o) => id.includes(o))) continue;
  if (cache[id] === hash && fs.existsSync(out)) { console.log(`band ${id}: cached`); continue; }
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const s = Date.now();
  await renderStill({ composition: comp, serveUrl, output: out, imageFormat: 'png', puppeteerInstance: browser, browserExecutable, chromiumOptions, overwrite: true, logLevel: 'error' });
  cache[id] = hash; baked++;
  fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 1));
  console.log(`band ${id}: baked in ${((Date.now() - s) / 1000).toFixed(1)}s`);
}
await browser.close({ silent: true });
// drop legacy flat files from the first pipeline
for (const f of ['far', 'mid', 'near', 'fg']) if (fs.existsSync(`public/baked/${f}.png`)) fs.unlinkSync(`public/baked/${f}.png`);
// re-bundle so the render bundle carries the freshly baked PNGs
if (baked) execSync('npx remotion bundle src/index.ts --out-dir=out/bundle', { stdio: 'ignore' });
console.log(`bake done (${baked} baked) in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
