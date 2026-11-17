/*!
 * Viewscape One — vs.validate.js
 * Universal (browser + node) validator for page JSON, source index JSON and bundles.
 * Browser:  VS.validate.page(json)   → { ok, errors[], warnings[] }
 * Node:     const V = require('./vs.validate.js'); V.page(json)
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else { root.VS = root.VS || {}; root.VS.validate = api; }
})(typeof self !== 'undefined' ? self : this, function () {

  const BLOCK_TYPES = [
    'hero', 'heading', 'text', 'paragraph', 'list', 'image', 'gallery', 'video', 'audio', 'embed',
    'link', 'links', 'file', 'stats', 'table', 'chart', 'timeline', 'cards', 'quote', 'code',
    'callout', 'tabs', 'accordion', 'progress', 'divider', 'columns', 'kv', 'tags', 'md',
    'include', 'html', 'json', 'spacer'
  ];
  const ACCENTS = ['magenta', 'red', 'violet', 'turquoise', 'sky', 'mint'];
  const SLUG = /^[a-z0-9][a-z0-9-]{0,48}$/;
  const CHARTS = ['bar', 'line', 'area', 'donut', 'radar', 'spark'];

  function walk(blocks, path, errors, warnings, depth) {
    if (!Array.isArray(blocks)) { errors.push(`${path}: "blocks" must be an array`); return; }
    if (depth > 6) { errors.push(`${path}: blocks nested too deeply (max 6)`); return; }
    blocks.forEach((b, i) => {
      const p = `${path}[${i}]`;
      if (typeof b === 'string') return; // shorthand paragraph
      if (!b || typeof b !== 'object' || Array.isArray(b)) { errors.push(`${p}: block must be an object or a string`); return; }
      if (!b.type) { errors.push(`${p}: missing "type"`); return; }
      if (!BLOCK_TYPES.includes(b.type)) { errors.push(`${p}: unknown block type "${b.type}" (known: ${BLOCK_TYPES.join(', ')})`); return; }
      switch (b.type) {
        case 'image': case 'video': case 'audio': case 'embed': case 'file': case 'md': case 'include':
          if (!b.src && !b.href && !b.url) errors.push(`${p}: ${b.type} needs "src"`); break;
        case 'link':
          if (!b.href && !b.page) errors.push(`${p}: link needs "href" or "page"`); break;
        case 'links': case 'cards': case 'timeline': case 'gallery': case 'list': case 'stats': case 'kv': case 'tags':
          if (!b.items && !b.data && !b.src) warnings.push(`${p}: ${b.type} has no "items"`); break;
        case 'chart':
          if (b.kind && !CHARTS.includes(b.kind)) errors.push(`${p}: chart kind must be one of ${CHARTS.join(', ')}`);
          if (!b.data && !b.src) errors.push(`${p}: chart needs "data" (e.g. [{"label":"A","value":3}]) or "src"`);
          break;
        case 'table':
          if (!b.rows && !b.data && !b.src) errors.push(`${p}: table needs "rows"/"data"`); break;
        case 'tabs': case 'accordion':
          if (!Array.isArray(b.items) || !b.items.length) errors.push(`${p}: ${b.type} needs "items":[{"title","blocks"}]`);
          else b.items.forEach((it, j) => walk(it.blocks || [], `${p}.items[${j}].blocks`, errors, warnings, depth + 1));
          break;
        case 'columns':
          if (!Array.isArray(b.columns) || !b.columns.length) errors.push(`${p}: columns needs "columns":[{"blocks":[...]}]`);
          else b.columns.forEach((c, j) => walk(c.blocks || [], `${p}.columns[${j}].blocks`, errors, warnings, depth + 1));
          break;
      }
      if (b.accent && !ACCENTS.includes(b.accent)) warnings.push(`${p}: unknown accent "${b.accent}"`);
      if (typeof b.src === 'string' && /^(\/|[a-z]:\\)/i.test(b.src) && !/^\/\//.test(b.src)) warnings.push(`${p}: absolute path in "src" will break on GitHub Pages sub-paths — use relative paths`);
    });
  }

  function page(json) {
    const errors = [], warnings = [];
    if (!json || typeof json !== 'object' || Array.isArray(json)) return { ok: false, errors: ['page JSON must be an object'], warnings };
    if (!json.title || typeof json.title !== 'string') errors.push('"title" (string) is required');
    if (json.id && !SLUG.test(json.id)) warnings.push('"id" should be a lowercase slug');
    if (json.accent && !ACCENTS.includes(json.accent)) warnings.push(`"accent" should be one of ${ACCENTS.join(', ')}`);
    if (json.type && !['data', 'custom'].includes(json.type)) errors.push('"type" must be "data" or "custom"');
    if (json.tags && !Array.isArray(json.tags)) errors.push('"tags" must be an array of strings');
    if (json.type !== 'custom') {
      if (!json.sections && !json.blocks) errors.push('data pages need "sections" (recommended) or "blocks"');
    }
    if (json.sections) {
      if (!Array.isArray(json.sections)) errors.push('"sections" must be an array');
      else {
        const ids = new Set();
        json.sections.forEach((s, i) => {
          if (!s || typeof s !== 'object') { errors.push(`sections[${i}] must be an object`); return; }
          if (!s.title) warnings.push(`sections[${i}] has no "title" (wheel label will be generic)`);
          if (s.id) { if (ids.has(s.id)) errors.push(`sections[${i}]: duplicate id "${s.id}"`); ids.add(s.id); }
          walk(s.blocks || [], `sections[${i}].blocks`, errors, warnings, 0);
        });
      }
    }
    if (json.blocks) walk(json.blocks, 'blocks', errors, warnings, 0);
    if (json.wheel && json.wheel.extras) {
      if (!Array.isArray(json.wheel.extras)) errors.push('wheel.extras must be an array');
      else if (json.wheel.extras.length > 8) errors.push('wheel.extras supports at most 8 slots');
      else json.wheel.extras.forEach((x, i) => { if (!x.label) errors.push(`wheel.extras[${i}] needs "label"`); if (!x.action) errors.push(`wheel.extras[${i}] needs "action"`); });
    }
    return { ok: errors.length === 0, errors, warnings };
  }

  function sourceIndex(json) {
    const errors = [], warnings = [];
    if (!json || !Array.isArray(json.pages)) return { ok: false, errors: ['index.json needs a "pages" array'], warnings };
    const seen = new Set();
    json.pages.forEach((p, i) => {
      const slug = typeof p === 'string' ? p : p && p.slug;
      if (!slug || !SLUG.test(slug)) errors.push(`pages[${i}]: invalid slug "${slug}"`);
      else if (seen.has(slug)) errors.push(`pages[${i}]: duplicate slug "${slug}"`);
      seen.add(slug);
    });
    return { ok: errors.length === 0, errors, warnings };
  }

  function bundle(json) {
    const errors = [], warnings = [];
    if (!json || typeof json !== 'object') return { ok: false, errors: ['bundle must be an object'], warnings };
    if (!json.source || !SLUG.test(json.source)) errors.push('bundle.source must be a folder id like "ai" or "me"');
    if (!json.slug || !SLUG.test(json.slug)) errors.push('bundle.slug must be a lowercase-slug');
    const r = page(json.page);
    errors.push(...r.errors.map(e => 'page: ' + e)); warnings.push(...r.warnings.map(e => 'page: ' + e));
    if (json.files && typeof json.files !== 'object') errors.push('bundle.files must be an object {path: content}');
    return { ok: errors.length === 0, errors, warnings };
  }

  return { page, sourceIndex, bundle, BLOCK_TYPES, ACCENTS, SLUG: SLUG.source };
});
