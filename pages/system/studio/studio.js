/* Viewscape One — Studio: paste → validate → preview → zip. No dependencies. */
(function () {
  'use strict';
  const { $, $$, el, esc } = VS, V = VS.validate;
  VS.fx.ambient(document.body, { particles: true });
  VS.status && VS.status.mount({ title: 'Studio', state: '' });
  if (VS.nav.embedded) document.documentElement.classList.add('vs-embedded');
  VS.accent.set('turquoise');
  VS.wheel.create({ title: 'Studio', slots: [
    { id: 'home', label: 'Home', icon: 'home', onSelect: () => VS.nav.home() },
    { id: 'imp', label: 'Import', icon: 'download', onSelect: () => tab('import') },
    { id: 'new', label: 'New', icon: 'sparkle', onSelect: () => tab('new') },
    { id: 'man', label: 'Manage', icon: 'list', onSelect: () => tab('manage') },
    { id: 'ai', label: 'AI', icon: 'bot', onSelect: () => tab('ai') },
    VS.wheel.accentSlot(), VS.wheel.display()
  ] });

  /* ---------- tabs ---------- */
  function tab(id) { $$('.st-tabs .vs-chip').forEach(c => c.classList.toggle('on', c.dataset.tab === id)); $$('.st-pane').forEach(p => p.classList.toggle('on', p.id === 'tab-' + id)); }
  $$('.st-tabs .vs-chip').forEach(c => c.addEventListener('click', () => tab(c.dataset.tab)));

  /* ---------- helpers ---------- */
  const clean = t => t.replace(/^﻿/, '').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  const today = () => new Date().toISOString().slice(0, 10);
  const enc = new TextEncoder();
  const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48);
  const dl = (name, blob) => { const a = el('a', { href: URL.createObjectURL(blob), download: name }); document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); };
  const copy = async (t, msg = 'Copied') => { try { await navigator.clipboard.writeText(t); VS.fx.toast(msg); } catch { const ta = el('textarea', { style: { position: 'fixed', opacity: 0 } }); ta.value = t; document.body.append(ta); ta.select(); document.execCommand('copy'); ta.remove(); VS.fx.toast(msg); } };

  /* minimal ZIP writer (store, no compression) */
  const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  const crc32 = u => { let c = 0xFFFFFFFF; for (let i = 0; i < u.length; i++) c = CRC[(c ^ u[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
  function zip(files) {
    const parts = [], cd = []; let off = 0; const d = new Date();
    const time = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1), date = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
    for (const [name, content] of Object.entries(files)) {
      const nb = enc.encode(name), data = typeof content === 'string' ? enc.encode(content) : content, crc = crc32(data);
      const lh = new DataView(new ArrayBuffer(30)); lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true); lh.setUint16(10, time, true); lh.setUint16(12, date, true); lh.setUint32(14, crc, true); lh.setUint32(18, data.length, true); lh.setUint32(22, data.length, true); lh.setUint16(26, nb.length, true);
      parts.push(lh.buffer, nb, data);
      const ch = new DataView(new ArrayBuffer(46)); ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(8, 0x0800, true); ch.setUint16(12, time, true); ch.setUint16(14, date, true); ch.setUint32(16, crc, true); ch.setUint32(20, data.length, true); ch.setUint32(24, data.length, true); ch.setUint16(28, nb.length, true); ch.setUint32(42, off, true);
      cd.push(ch.buffer, nb); off += 30 + nb.length + data.length;
    }
    const size = cd.reduce((a, b) => a + (b.byteLength ?? b.length), 0), end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true); end.setUint16(8, Object.keys(files).length, true); end.setUint16(10, Object.keys(files).length, true); end.setUint32(12, size, true); end.setUint32(16, off, true);
    return new Blob([...parts, ...cd, end.buffer], { type: 'application/zip' });
  }

  const getIndex = async src => { try { return await VS.fetchJSON(`${VS.pagesRoot}${src}/index.json`, { cache: false }); } catch { return { pages: [] }; } };
  const norm = e => typeof e === 'string' ? { slug: e } : e;
  const withPage = (idx, slug) => ({ ...idx, pages: idx.pages.map(norm).some(p => p.slug === slug) ? idx.pages : [...idx.pages, slug] });
  const without = (idx, slug) => ({ ...idx, pages: idx.pages.filter(p => norm(p).slug !== slug) });
  const json = o => JSON.stringify(o, null, 2) + '\n';

  /* ---------- Import / Preview ---------- */
  let current = null, cfg, reg;
  const report = $('#report');
  function log(cls, t) { report.append(el('div', { class: cls, text: (cls === 'ok' ? '✔ ' : cls === 'er' ? '✖ ' : '⚠ ') + t })); }

  async function validate() {
    report.innerHTML = ''; current = null; $('#btn-zip').disabled = $('#btn-cli').disabled = true;
    let b; try { b = JSON.parse(clean($('#bundle').value)); } catch (e) { return log('er', 'Not valid JSON: ' + e.message); }
    if (Array.isArray(b)) { if (b.length !== 1) log('wn', `Array of ${b.length} bundles — Studio handles one at a time; the CLI imports arrays. Using the first.`); b = b[0]; }
    if (b && b.title && !b.page) { b = { source: 'ai', slug: slugify(b.title), page: b }; log('wn', 'Bare page.json detected — wrapped as source "ai", slug "' + b.slug + '".'); }
    const r = V.bundle(b); r.errors.forEach(e => log('er', e)); r.warnings.forEach(w => log('wn', w));
    if (!r.ok) return;
    if (!cfg.sources.some(s => s.id === b.source)) { log('er', `Unknown source "${b.source}". Known: ${cfg.sources.map(s => s.id).join(', ')}. Add it with: node tools/vs.mjs source add ${b.source}`); return; }
    const exists = reg.pages.some(p => p.ref === b.source + '/' + b.slug);
    if (exists && !$('#chk-over').checked) log('wn', `${b.source}/${b.slug} already exists — tick "replace if exists" to overwrite it.`);
    log('ok', `Bundle OK → pages/${b.source}/${b.slug}/` + (exists ? ' (replace)' : ' (new)'));
    current = b; $('#btn-zip').disabled = $('#btn-cli').disabled = false;
    await preview(b);
  }

  async function preview(b) {
    const host = $('#preview'); host.innerHTML = '';
    const m = b.page, files = b.files || {};
    // resolve block `src` JSON against bundled files by shimming fetchJSON/fetchText for preview
    const origJ = VS.fetchJSON, origT = VS.fetchText, base = 'https://studio.invalid/';
    const lookup = u => { const k = u.startsWith(base) ? u.slice(base.length) : null; return k != null && files[k] !== undefined ? files[k] : undefined; };
    VS.fetchJSON = async (u, o) => { const f = lookup(u); if (f !== undefined) return typeof f === 'string' ? JSON.parse(f) : f; return origJ(u, o); };
    VS.fetchText = async u => { const f = lookup(u); if (f !== undefined) return typeof f === 'string' ? f : JSON.stringify(f); return origT(u); };
    try {
      host.append(el('header', { class: 'vs-pagehero' }, el('div', { class: 'in' },
        el('div', { class: 'vs-eyebrow', text: '✦ ' + (m.eyebrow || b.source) }), el('h1', { class: 'vs-title', text: m.title }),
        m.subtitle ? el('p', { class: 'vs-sub', html: VS.md.inline(m.subtitle) }) : null, el('div', { class: 'vs-meta' }, ...(m.tags || []).map(t => el('span', { class: 'vs-tag', text: t }))))));
      if (m.type === 'custom') { host.append(el('div', { class: 'vs-callout vs-tone-info' }, el('span', { html: VS.icon('code', 20) }), el('div', { text: 'Custom page — its own index.html/css/js live in the folder; no preview here. The starter template will be included in the zip.' }))); return; }
      const secs = m.sections || [{ title: '', blocks: m.blocks || [] }];
      for (const [i, s] of secs.entries()) {
        const sec = el('section', { class: 'vs-section' }); if (s.title) sec.append(el('header', { class: 'vs-sechead' }, el('span', { class: 'idx', text: String(i + 1).padStart(2, '0') }), el('div', {}, el('h2', { text: s.title }))));
        const inner = el('div', { class: 'vs-secbody' }); sec.append(inner); host.append(sec);
        await VS.blocks.render(s.blocks || [], inner, { base });
      }
      VS.accent.set(m.accent || 'turquoise'); $$('.st-preview [data-reveal]').forEach(n => n.classList.add('is-in'));
    } catch (e) { host.append(el('div', { class: 'vs-callout vs-tone-hot', text: 'Preview error: ' + e.message })); }
    finally { VS.fetchJSON = origJ; VS.fetchText = origT; }
  }

  async function bundleZip() {
    const b = current, root = `pages/${b.source}/${b.slug}/`, out = {};
    const tplKind = b.page.type === 'custom' ? 'custom' : 'page', tplFiles = tplKind === 'custom' ? ['index.html', 'page.css', 'page.js'] : ['index.html'];
    const vars = { TITLE: b.page.title, SOURCE: b.source, DATE: today() };
    for (const f of tplFiles) { try { out[root + f] = (await VS.fetchText(`${VS.root}templates/${tplKind}/${f}`)).replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? ''); } catch (e) { VS.fx.toast('Missing template ' + f, 'zap'); } }
    out[root + 'page.json'] = json({ author: b.source, updated: today(), ...b.page });
    for (const [rel, c] of Object.entries(b.files || {})) { if (/(^|\/)\.\.(\/|$)|^\//.test(rel)) { log('er', 'Unsafe path skipped: ' + rel); continue; } out[root + rel] = typeof c === 'string' ? c : json(c); }
    out[`pages/${b.source}/index.json`] = json(withPage(await getIndex(b.source), b.slug));
    out['_INSTALL.txt'] = `Viewscape One — install\n\nUnzip into the project root and merge folders.\nAdded: pages/${b.source}/${b.slug}/\nUpdated: pages/${b.source}/index.json\n\nThen commit + push.\n`;
    return zip(out);
  }
  $('#btn-validate').onclick = validate;
  $('#btn-zip').onclick = async () => { if (!current) return; const exists = reg.pages.some(p => p.ref === current.source + '/' + current.slug); if (exists && !$('#chk-over').checked) return VS.fx.toast('Tick "replace if exists" first', 'zap'); dl(`viewscape-${current.source}-${current.slug}.zip`, await bundleZip()); VS.fx.toast('Zip downloaded', 'download'); };
  $('#btn-cli').onclick = () => { copy('node tools/vs.mjs import bundle.json' + ($('#chk-over').checked ? ' --overwrite' : ''), 'Command copied — save the JSON as bundle.json first'); };
  $('#btn-sample').onclick = async () => { try { const h = await VS.fetchJSON(VS.root + 'HANDOVER.json'); $('#bundle').value = JSON.stringify(h.example_bundle, null, 2); validate(); } catch (e) { VS.fx.toast('Could not load example', 'zap'); } };

  /* ---------- New page ---------- */
  function newVals() { const t = $('#n-title').value.trim() || 'My New Page', s = $('#n-slug').value.trim() || slugify(t); return { src: $('#n-source').value, title: t, slug: slugify(s), custom: $('#n-type').value === 'custom' }; }
  $('#n-title').addEventListener('input', () => { if (!$('#n-slug').dataset.touched) $('#n-slug').value = slugify($('#n-title').value); });
  $('#n-slug').addEventListener('input', e => { e.target.dataset.touched = '1'; });
  $('#btn-new').onclick = async () => {
    const v = newVals(); if (!v.slug) return VS.fx.toast('Need a slug', 'zap');
    if (reg.pages.some(p => p.ref === v.src + '/' + v.slug)) return VS.fx.toast('That page already exists', 'zap');
    const kind = v.custom ? 'custom' : 'page', names = v.custom ? ['index.html', 'page.css', 'page.js', 'page.json'] : ['index.html', 'page.json'], root = `pages/${v.src}/${v.slug}/`, out = {}, vars = { TITLE: v.title, SOURCE: v.src, DATE: today() };
    for (const f of names) out[root + f] = (await VS.fetchText(`${VS.root}templates/${kind}/${f}`)).replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? '');
    out[`pages/${v.src}/index.json`] = json(withPage(await getIndex(v.src), v.slug));
    dl(`viewscape-new-${v.src}-${v.slug}.zip`, zip(out)); VS.fx.toast('Starter downloaded', 'download');
  };
  $('#btn-new-cli').onclick = () => { const v = newVals(); copy(`node tools/vs.mjs new ${v.src} ${v.slug} --title "${v.title}"${v.custom ? ' --custom' : ''}`, 'Command copied'); };

  /* ---------- Manage ---------- */
  function manage() {
    const box = $('#manage-list'); box.innerHTML = '';
    if (!reg.pages.length) box.append(el('p', { class: 'vs-cap', text: 'No pages yet.' }));
    reg.pages.forEach(p => {
      const dlIdx = async (fn, name) => { dl(`index-${p.source}.json`, new Blob([json(fn(await getIndex(p.source), p.slug))], { type: 'application/json' })); VS.fx.toast(name + ' — replace pages/' + p.source + '/index.json', 'download'); };
      box.append(el('div', { class: 'st-item' + (p.hidden ? ' off' : '') },
        el('div', {}, el('b', { text: p.meta.title || p.slug }), el('small', { text: `${p.ref}${p.hidden ? ' · hidden' : ''}${p.meta.type === 'custom' ? ' · custom' : ''}` })),
        el('div', { class: 'act' },
          el('a', { class: 'vs-btn ghost sm', href: VS.root + 'index.html#/' + p.ref, 'data-vs-page': p.ref, text: 'Open' }),
          el('button', { class: 'vs-btn ghost sm', text: p.hidden ? 'Show cmd' : 'Hide cmd', onclick: () => copy(`node tools/vs.mjs ${p.hidden ? 'show' : 'hide'} ${p.source} ${p.slug}`, 'Command copied') }),
          el('button', { class: 'vs-btn ghost sm', text: 'Unlist file', onclick: () => dlIdx(without, 'Unlisted') }),
          el('button', { class: 'vs-btn sm', text: 'Remove cmd', onclick: () => copy(`node tools/vs.mjs remove ${p.source} ${p.slug} --yes`, 'Command copied') }))));
    });
  }

  /* ---------- AI handover ---------- */
  function prompt() {
    const t = $('#g-topic').value.trim() || '<TOPIC>', a = $('#g-accent').value, x = $('#g-extra').value.trim() || 'charts, a table, a timeline';
    return `Make me a Viewscape One page about: ${t}.\nSource: ai. Accent: ${a}. Include: ${x}.\nResearch it properly (or use my data if I paste any). Follow HANDOVER.json exactly.\nReply with the bundle JSON only — no markdown fences, no commentary.`;
  }
  $('#g-copy-prompt').onclick = () => copy(prompt(), 'Prompt copied');
  $('#g-copy-all').onclick = async () => { try { const t = await VS.fetchText(VS.root + 'HANDOVER.json'); copy('HANDOVER.json:\n' + t + '\n\n---\n' + prompt(), 'Handover + prompt copied'); } catch (e) { VS.fx.toast('Could not load HANDOVER.json', 'zap'); } };

  /* ---------- boot ---------- */
  (async () => {
    try { reg = await VS.registry(); cfg = reg.config; } catch (e) { report.append(el('div', { class: 'er', text: 'Serve over http(s) — fetch is blocked on file://. ' + e.message })); reg = { pages: [] }; cfg = { sources: [{ id: 'ai' }, { id: 'me' }] }; }
    $('#n-source').append(...cfg.sources.map(s => el('option', { value: s.id, text: s.label || s.id })));
    manage();
  })();
})();
