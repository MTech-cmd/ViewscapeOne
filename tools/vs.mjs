#!/usr/bin/env node
/**
 * Viewscape One CLI — zero dependencies (Node 18+).
 *   node tools/vs.mjs list
 *   node tools/vs.mjs new <source> <slug> [--title "Name"] [--custom]
 *   node tools/vs.mjs remove <source> <slug> [--yes]          (deletes the folder + unlists it)
 *   node tools/vs.mjs hide|show <source> <slug>               (keep files, hide from the field)
 *   node tools/vs.mjs import <bundle.json | ->               (AI bundle → page folder)
 *   node tools/vs.mjs source add <id> [--label "Name"] [--icon bot] [--accent violet]
 *   node tools/vs.mjs source remove <id> [--yes]
 *   node tools/vs.mjs validate [source/slug]
 *   node tools/vs.mjs serve [port]
 */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const V = require(path.join(ROOT, 'assets/js/vs.validate.js'));
const PAGES = path.join(ROOT, 'pages'), TPL = path.join(ROOT, 'templates'), CFG = path.join(ROOT, 'viewscape.config.json');
const SLUG = /^[a-z0-9][a-z0-9-]{0,48}$/;
const c = { m: s => `\x1b[35m${s}\x1b[0m`, t: s => `\x1b[36m${s}\x1b[0m`, g: s => `\x1b[32m${s}\x1b[0m`, r: s => `\x1b[31m${s}\x1b[0m`, d: s => `\x1b[2m${s}\x1b[0m` };
const die = m => { console.error(c.r('✖ ' + m)); process.exit(1); };
const ok = m => console.log(c.g('✔ ') + m);
const readJSON = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { die(`Cannot read ${path.relative(ROOT, f)}: ${e.message}`); } };
const writeJSON = (f, d) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n'); };
const today = () => new Date().toISOString().slice(0, 10);
const titleCase = s => s.replace(/-/g, ' ').replace(/\b\w/g, m => m.toUpperCase());

// args
const argv = process.argv.slice(2), flags = {}, pos = [];
for (let i = 0; i < argv.length; i++) { const a = argv[i]; if (a.startsWith('--')) { const k = a.slice(2); const n = argv[i + 1]; if (n && !n.startsWith('--')) { flags[k] = n; i++; } else flags[k] = true; } else pos.push(a); }
const [cmd, ...rest] = pos;

const idxFile = s => path.join(PAGES, s, 'index.json');
const norm = e => typeof e === 'string' ? { slug: e } : e;
const compactEntry = e => (Object.keys(e).length === 1 ? e.slug : e);
const config = () => readJSON(CFG);
function needSource(s) { if (!s || !SLUG.test(s)) die('Source must be a lowercase slug, e.g. "me" or "ai"'); if (!config().sources.some(x => x.id === s)) die(`Unknown source "${s}". Add it first: node tools/vs.mjs source add ${s}`); }
function needSlug(s) { if (!s || !SLUG.test(s)) die('Slug must be lowercase letters, numbers and dashes, e.g. "market-report"'); }
function listOf(src) { const f = idxFile(src); return fs.existsSync(f) ? readJSON(f) : { pages: [] }; }
function sub(txt, vars) { return txt.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? ''); }
function copyTpl(kind, dest, vars) {
  fs.mkdirSync(dest, { recursive: true });
  for (const f of fs.readdirSync(path.join(TPL, kind))) fs.writeFileSync(path.join(dest, f), sub(fs.readFileSync(path.join(TPL, kind, f), 'utf8'), vars));
}
function register(src, slug) {
  const idx = listOf(src); if (!idx.pages.map(norm).some(p => p.slug === slug)) idx.pages.push(slug); writeJSON(idxFile(src), idx);
}
function unregister(src, slug) { const idx = listOf(src); idx.pages = idx.pages.filter(p => norm(p).slug !== slug); writeJSON(idxFile(src), idx); }

const commands = {
  list() {
    const cfg = config();
    for (const s of cfg.sources) {
      const idx = listOf(s.id); console.log('\n' + c.m(`◈ ${s.label || s.id}`) + c.d(`  (${s.id})`));
      if (!idx.pages.length) console.log(c.d('   (empty)'));
      idx.pages.map(norm).forEach(p => {
        const f = path.join(PAGES, s.id, p.slug, 'page.json'); let t = c.r('missing page.json');
        if (fs.existsSync(f)) { try { const j = JSON.parse(fs.readFileSync(f, 'utf8')); t = `${j.title || '?'} ${c.d(j.type === 'custom' ? '[custom]' : '[data]')}`; } catch { t = c.r('invalid JSON'); } }
        console.log(`   ${p.hidden ? c.d('○') : c.t('●')} ${s.id}/${p.slug}  ${t}`);
      });
    } console.log();
  },
  new() {
    const [src, slug] = rest; needSource(src); needSlug(slug);
    const dest = path.join(PAGES, src, slug); if (fs.existsSync(dest)) die(`${src}/${slug} already exists`);
    const title = flags.title || titleCase(slug);
    copyTpl(flags.custom ? 'custom' : 'page', dest, { TITLE: title, SOURCE: src, DATE: today() });
    register(src, slug); ok(`Created pages/${src}/${slug}/  ${c.d(flags.custom ? '(custom page: edit index.html/page.css/page.js)' : '(data page: edit page.json)')}`);
  },
  remove() {
    const [src, slug] = rest; needSource(src); needSlug(slug); const dest = path.join(PAGES, src, slug);
    if (!flags.yes) die(`This deletes pages/${src}/${slug}/. Re-run with --yes to confirm. (Use "hide" to keep the files.)`);
    if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true, force: true }); unregister(src, slug); ok(`Removed ${src}/${slug}`);
  },
  hide() { toggleHidden(true); }, show() { toggleHidden(false); },
  import() {
    const file = rest[0]; if (!file) die('Usage: import <bundle.json | ->');
    const raw = file === '-' ? fs.readFileSync(0, 'utf8') : fs.readFileSync(file, 'utf8'); let b;
    try { b = JSON.parse(raw.replace(/^﻿/, '').replace(/^```(?:json)?\s*|\s*```$/g, '').trim()); } catch (e) { die('Bundle is not valid JSON: ' + e.message); }
    const bundles = Array.isArray(b) ? b : [b];
    for (const bu of bundles) {
      const r = V.bundle(bu); r.warnings.forEach(w => console.log(c.d('  ⚠ ' + w)));
      if (!r.ok) die('Bundle invalid:\n  - ' + r.errors.join('\n  - '));
      needSource(bu.source);
      const dest = path.join(PAGES, bu.source, bu.slug), exists = fs.existsSync(dest);
      if (exists && !flags.overwrite) die(`${bu.source}/${bu.slug} exists. Add --overwrite to replace page.json/files.`);
      if (!exists) copyTpl(bu.page.type === 'custom' ? 'custom' : 'page', dest, { TITLE: bu.page.title, SOURCE: bu.source, DATE: today() });
      const page = { author: bu.source, updated: today(), ...bu.page }; writeJSON(path.join(dest, 'page.json'), page);
      for (const [rel, content] of Object.entries(bu.files || {})) {
        const out = path.resolve(dest, rel); if (!out.startsWith(dest + path.sep)) die(`Unsafe file path in bundle: ${rel}`);
        fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, typeof content === 'string' ? content : JSON.stringify(content, null, 2));
      }
      register(bu.source, bu.slug); ok(`${exists ? 'Updated' : 'Imported'} ${bu.source}/${bu.slug}`);
    }
  },
  source() {
    const [act, id] = rest; if (!SLUG.test(id || '')) die('Usage: source add|remove <id>');
    const cfg = config();
    if (act === 'add') {
      if (cfg.sources.some(s => s.id === id)) die(`Source "${id}" already exists`);
      cfg.sources.push({ id, label: flags.label || titleCase(id), icon: flags.icon || 'layers', accent: flags.accent || 'violet', description: flags.description || '' });
      writeJSON(CFG, cfg); writeJSON(idxFile(id), { pages: [] }); ok(`Added source folder pages/${id}/`);
    } else if (act === 'remove') {
      if (!flags.yes) die(`This deletes pages/${id}/ and every page inside. Re-run with --yes.`);
      cfg.sources = cfg.sources.filter(s => s.id !== id); writeJSON(CFG, cfg); fs.rmSync(path.join(PAGES, id), { recursive: true, force: true }); ok(`Removed source ${id}`);
    } else die('Usage: source add|remove <id>');
  },
  validate() {
    const only = rest[0]; let bad = 0, n = 0; const cfg = config();
    for (const s of cfg.sources) {
      const idx = listOf(s.id); const ri = V.sourceIndex(idx); if (!ri.ok) { bad++; console.log(c.r(`✖ ${s.id}/index.json`)); ri.errors.forEach(e => console.log('   - ' + e)); }
      for (const p of idx.pages.map(norm)) {
        const ref = `${s.id}/${p.slug}`; if (only && only !== ref) continue; n++;
        const dir = path.join(PAGES, s.id, p.slug);
        if (!fs.existsSync(dir)) { bad++; console.log(c.r(`✖ ${ref}`) + ' folder missing'); continue; }
        const pj = path.join(dir, 'page.json'); if (!fs.existsSync(pj)) { bad++; console.log(c.r(`✖ ${ref}`) + ' page.json missing'); continue; }
        let j; try { j = JSON.parse(fs.readFileSync(pj, 'utf8')); } catch (e) { bad++; console.log(c.r(`✖ ${ref}`) + ' invalid JSON: ' + e.message); continue; }
        const r = V.page(j); const entry = path.join(dir, j.entry || 'index.html');
        if (!fs.existsSync(entry)) { r.ok = false; r.errors.push(`${j.entry || 'index.html'} missing`); }
        if (r.ok) console.log(c.g('✔ ') + ref + (r.warnings.length ? c.d(`  (${r.warnings.length} warning${r.warnings.length > 1 ? 's' : ''})`) : ''));
        else { bad++; console.log(c.r('✖ ') + ref); r.errors.forEach(e => console.log('   - ' + e)); }
        r.warnings.forEach(w => console.log(c.d('   ⚠ ' + w)));
      }
    }
    console.log(`\n${n} page(s) checked, ${bad ? c.r(bad + ' with problems') : c.g('all good')}`); if (bad) process.exit(1);
  },
  serve() {
    const port = +(rest[0] || flags.port || 8080), types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.mp4': 'video/mp4', '.webm': 'video/webm', '.mp3': 'audio/mpeg', '.pdf': 'application/pdf', '.woff2': 'font/woff2', '.md': 'text/markdown', '.txt': 'text/plain' };
    http.createServer((req, res) => {
      let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
      const f = path.join(ROOT, p); if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
      fs.readFile(f, (e, d) => { if (e) { res.writeHead(404); return res.end('404'); } res.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream', 'cache-control': 'no-store' }); res.end(d); });
    }).listen(port, () => console.log(c.m('◈ Viewscape One') + ` → http://localhost:${port}/`));
  }
};
function toggleHidden(h) {
  const [src, slug] = rest; needSource(src); needSlug(slug); const idx = listOf(src); let hit = false;
  idx.pages = idx.pages.map(p => { const e = norm(p); if (e.slug !== slug) return p; hit = true; if (h) e.hidden = true; else delete e.hidden; return compactEntry(e); });
  if (!hit) die(`${src}/${slug} is not listed`); writeJSON(idxFile(src), idx); ok(`${src}/${slug} is now ${h ? 'hidden' : 'visible'}`);
}

if (!cmd || !commands[cmd]) {
  console.log(`${c.m('◈ Viewscape One CLI')}
  list                                  show every source and page
  new <source> <slug> [--title T] [--custom]
  remove <source> <slug> --yes          delete a page (folder + listing)
  hide | show <source> <slug>           toggle visibility, keep files
  import <bundle.json | -> [--overwrite]  install a AI bundle
  source add <id> [--label --icon --accent] | source remove <id> --yes
  validate [source/slug]
  serve [port]`); process.exit(cmd ? 1 : 0);
}
commands[cmd]();
