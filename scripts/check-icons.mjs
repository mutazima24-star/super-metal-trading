// Asserts the favicon / app-icon set is present and wired in the exported site (out/).
// Usage: pnpm build && node scripts/check-icons.mjs   (no dependencies)
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const out = join(import.meta.dirname, '..', 'out');
const failures = [];
const check = (ok, msg) => { if (!ok) failures.push(msg); };

const files = ['favicon.ico', 'favicon.svg', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'icon-512-maskable.png', 'site.webmanifest'];
for (const f of files) {
  const p = join(out, f);
  check(existsSync(p) && statSync(p).size > 0, `missing or empty out/${f}`);
}

const favSvg = existsSync(join(out, 'favicon.svg')) ? readFileSync(join(out, 'favicon.svg'), 'utf8') : '';
check(!/stroke-dasharray/.test(favSvg), 'out/favicon.svg still contains dashed construction guides');

if (existsSync(join(out, 'site.webmanifest'))) {
  let m = {};
  try { m = JSON.parse(readFileSync(join(out, 'site.webmanifest'), 'utf8')); } catch { failures.push('site.webmanifest is not valid JSON'); }
  check(m.name === 'المعدن الفائق | Super Metal', `manifest name is ${JSON.stringify(m.name)}`);
  check(m.short_name === 'المعدن الفائق', `manifest short_name is ${JSON.stringify(m.short_name)}`);
  for (const icon of m.icons ?? []) check(existsSync(join(out, icon.src.replace(/^\//, ''))), `manifest icon ${icon.src} not in out/`);
}

const expectedTags = [
  /<link rel="icon" href="\/favicon\.ico" sizes="48x48"\/>/,
  /<link rel="icon" href="\/favicon\.svg" type="image\/svg\+xml"\/>/,
  /<link rel="apple-touch-icon" href="\/apple-touch-icon\.png"\/>/,
  /<link rel="manifest" href="\/site\.webmanifest"\/>/,
  /<meta name="theme-color" content="#1e324a"\/>/,
];
// 404.html is Next's built-in not-found page (outside both root layouts); browsers still pick up /favicon.ico.
check(existsSync(join(out, '404.html')), 'missing out/404.html');
for (const page of ['index.html', 'en/index.html']) {
  const p = join(out, page);
  if (!existsSync(p)) { failures.push(`missing out/${page}`); continue; }
  const head = readFileSync(p, 'utf8').split('</head>')[0];
  for (const re of expectedTags) check(re.test(head), `out/${page} head lacks ${re.source}`);
}

if (failures.length) {
  console.error('ICON CHECK FAILED:\n- ' + failures.join('\n- '));
  process.exit(1);
}
console.log(`ICON CHECK PASSED (${files.length} files, 2 pages)`);
