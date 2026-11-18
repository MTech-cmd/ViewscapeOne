import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const appRoot = path.join(projectRoot, 'app');
const htmlFiles = [];
const failures = [];
let checked = 0;

async function walk(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(fullPath);
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) htmlFiles.push(fullPath);
  }
}

function toAppTarget(fromFile, rawValue) {
  const value = rawValue.trim().replaceAll('&amp;', '&');
  if (!value || value.startsWith('#') || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(value)) return null;
  const clean = value.split('#')[0].split('?')[0];
  if (!clean) return null;
  let decoded;
  try { decoded = decodeURIComponent(clean); }
  catch { decoded = clean; }
  const candidate = decoded.startsWith('/')
    ? path.resolve(appRoot, `.${decoded}`)
    : path.resolve(path.dirname(fromFile), decoded);
  if (candidate !== appRoot && !candidate.startsWith(`${appRoot}${path.sep}`)) return { forbidden: candidate };
  return candidate;
}

await walk(appRoot);
for (const htmlFile of htmlFiles) {
  const markup = await fs.readFile(htmlFile, 'utf8');
  const attributes = [...markup.matchAll(/\b(?:href|src|poster)\s*=\s*(["'])(.*?)\1/gi)];
  for (const [, , value] of attributes) {
    const target = toAppTarget(htmlFile, value);
    if (!target) continue;
    checked += 1;
    if (target.forbidden) {
      failures.push(`${path.relative(appRoot, htmlFile)} -> ${value} (outside app root)`);
      continue;
    }
    let stat;
    try { stat = await fs.stat(target); }
    catch { failures.push(`${path.relative(appRoot, htmlFile)} -> ${value} (missing)`); continue; }
    if (!stat.isFile() && !stat.isDirectory()) failures.push(`${path.relative(appRoot, htmlFile)} -> ${value} (not a file)`);
    else if (stat.isDirectory()) {
      try { await fs.access(path.join(target, 'index.html')); }
      catch { failures.push(`${path.relative(appRoot, htmlFile)} -> ${value} (directory has no index.html)`); }
    }
  }
}

console.log(`HTML pages scanned: ${htmlFiles.length}`);
console.log(`Local references checked: ${checked}`);
if (failures.length) {
  console.error(`Broken or disallowed local references: ${failures.length}`);
  for (const failure of failures) console.error(` - ${failure}`);
  process.exitCode = 1;
} else {
  console.log('All checked local references resolve inside the learner app.');
}
