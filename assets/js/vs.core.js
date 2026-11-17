/*!
 * Viewscape One — vs.core.js
 * Namespace, utilities, icons, markdown-lite, registry, navigation, accents, prefs.
 * Load order: vs.validate.js → vs.core.js → vs.fx.js → vs.blocks.js → vs.wheel.js → (vs.page.js | vs.home.js)
 */
(function () {
  'use strict';
  const VS = window.VS = window.VS || {};
  VS.version = '1.0.0';

  /* ---------- root detection (works on GH Pages sub-paths) ---------- */
  const me = document.currentScript || [...document.scripts].find(s => /vs\.core\.js/.test(s.src));
  VS.root = new URL('../../', me ? me.src : location.href).href;           // …/viewscape-one/
  VS.pagesRoot = VS.root + 'pages/';

  /* ---------- tiny utils ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const uid = (p = 'vs') => p + Math.random().toString(36).slice(2, 8);
  const el = (tag, attrs, ...kids) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === 'class') n.className = v;
      else if (k === 'html') n.innerHTML = v;
      else if (k === 'text') n.textContent = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(n.style, v);
      else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? '' : v);
    }
    for (const k of kids.flat()) if (k != null && k !== false) n.append(k.nodeType ? k : document.createTextNode(k));
    return n;
  };
  Object.assign(VS, { $, $$, esc, sleep, clamp, uid, el });
  VS.ready = fn => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn, { once: true }) : fn();

  /* ---------- events ---------- */
  const _on = {};
  VS.on = (n, f) => ((_on[n] ||= []).push(f), () => (_on[n] = _on[n].filter(x => x !== f)));
  VS.emit = (n, d) => (_on[n] || []).forEach(f => { try { f(d); } catch (e) { console.error(e); } });

  /* ---------- storage + prefs ---------- */
  VS.store = {
    get(k, d) { try { const v = localStorage.getItem('vs.' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem('vs.' + k, JSON.stringify(v)); } catch { /* private mode */ } }
  };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  VS.prefs = {
    get: k => VS.store.get('pref.' + k, { fx: !reduced, scan: true, motion: !reduced }[k]),
    set(k, v) { VS.store.set('pref.' + k, v); VS.prefs.apply(); VS.emit('prefs', { k, v }); },
    toggle(k) { VS.prefs.set(k, !VS.prefs.get(k)); return VS.prefs.get(k); },
    apply() {
      const h = document.documentElement.classList;
      h.toggle('vs-no-fx', !VS.prefs.get('fx'));
      h.toggle('vs-no-scan', !VS.prefs.get('scan'));
      h.toggle('vs-reduce', !VS.prefs.get('motion'));
    }
  };
  VS.prefs.apply();
  addEventListener('storage', e => { if (e.key && e.key.startsWith('vs.pref.')) VS.prefs.apply(); });

  /* ---------- accents ---------- */
  VS.ACCENTS = ['magenta', 'red', 'violet', 'turquoise', 'sky', 'mint'];
  VS.accent = {
    get: () => document.documentElement.dataset.accent || 'magenta',
    set(n) { if (!VS.ACCENTS.includes(n)) n = 'magenta'; document.documentElement.dataset.accent = n; VS.emit('accent', n); return n; },
    cycle() { const i = VS.ACCENTS.indexOf(VS.accent.get()); return VS.accent.set(VS.ACCENTS[(i + 1) % VS.ACCENTS.length]); }
  };

  /* ---------- icons (24px stroke set) ---------- */
  const P = {
    home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
    grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r=".8"/><circle cx="3.5" cy="12" r=".8"/><circle cx="3.5" cy="18" r=".8"/>',
    next: '<path d="M9 5l7 7-7 7"/>', prev: '<path d="M15 5l-7 7 7 7"/>',
    palette: '<path d="M12 3a9 9 0 100 18c1.5 0 2-1 1.5-2-.6-1.2.2-2.5 1.6-2.5H17a4 4 0 004-4c0-5-4-9.5-9-9.5z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7" r="1"/>',
    link: '<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 00-5.7 0l-3 3A4 4 0 0011 18.7l1-1"/>',
    external: '<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/>',
    expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    sparkle: '<path d="M12 3l2 6 6 3-6 3-2 6-2-6-6-3 6-3z"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l5 5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    shuffle: '<path d="M3 7h4l10 10h4M3 17h4l3-3M14 10l3-3h4"/><path d="M19 5l2 2-2 2M19 15l2 2-2 2"/>',
    top: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    settings: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
    filter: '<path d="M4 5h16l-6 8v6l-4-2v-4z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    bot: '<rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 8V4M9 13v1M15 13v1"/><circle cx="12" cy="3.5" r="1"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>', back: '<path d="M10 6l-6 6 6 6M4 12h16"/>',
    play: '<path d="M8 5l11 7-11 7z"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    zap: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    book: '<path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2z"/><path d="M4 21V5"/>',
    star: '<path d="M12 3l2.7 5.8 6.3.8-4.6 4.4 1.2 6.3L12 17.3 6.4 20.3l1.2-6.3L3 9.6l6.3-.8z"/>',
    download: '<path d="M12 4v11M7 11l5 5 5-5M4 20h16"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2"/>',
    code: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
    film: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M17 9h4M3 15h4M17 15h4"/>',
    more: '<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>',
    chart: '<path d="M4 20V4M4 20h16"/><path d="M8 16v-5M12 16V8M16 16v-8"/>',
    cube: '<path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M12 12l9-5M12 12L3 7M12 12v10"/>',
    wave: '<path d="M2 12c2-6 4-6 5 0s3 6 5 0 3-6 5 0 3 6 5 0"/>',
    dot: '<circle cx="12" cy="12" r="3"/>', check: '<path d="M5 12l5 5 9-10"/>',
    off: '<path d="M5 5l14 14"/><circle cx="12" cy="12" r="9"/>'
  };
  VS.icon = (n, s = 22) => `<svg class="vs-i" viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || P.dot}</svg>`;
  VS.icons = Object.keys(P);

  /* ---------- URLs ---------- */
  VS.resolve = (base, rel) => { try { return new URL(rel, base || location.href).href; } catch { return rel; } };
  VS.isExternal = u => /^(https?:)?\/\//i.test(u || '');
  VS.safeUrl = u => (/^\s*(javascript|data:text\/html|vbscript):/i.test(u || '') ? '#' : u);
  VS.pageUrl = ref => `${VS.pagesRoot}${ref}/index.html`;

  /* ---------- fetch ---------- */
  const _cache = new Map();
  VS.fetchJSON = (url, { cache = true } = {}) => {
    if (cache && _cache.has(url)) return _cache.get(url);
    const p = fetch(url, { cache: 'no-cache' }).then(async r => {
      if (!r.ok) throw new Error(`${r.status} ${r.statusText} — ${url}`);
      const t = await r.text();
      try { return JSON.parse(t); } catch (e) { throw new Error(`Invalid JSON in ${url}: ${e.message}`); }
    });
    if (cache) { _cache.set(url, p); p.catch(() => _cache.delete(url)); }
    return p;
  };
  VS.fetchText = async url => { const r = await fetch(url, { cache: 'no-cache' }); if (!r.ok) throw new Error(`${r.status} — ${url}`); return r.text(); };

  /* ---------- markdown-lite ---------- */
  VS.md = {
    inline(s, ctx = {}) {
      const codes = [];
      s = String(s ?? '').replace(/`([^`]+)`/g, (_, c) => (codes.push(c), `\u0000${codes.length - 1}\u0000`));
      s = esc(s);
      s = s
        .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, a, u) => `<img src="${esc(VS.safeUrl(VS.resolve(ctx.base, u)))}" alt="${a}" loading="lazy">`)
        .replace(/\[\[([a-z0-9-]+\/[a-z0-9-]+)(?:\|([^\]]+))?\]\]/g, (_, r, l) => `<a href="${VS.pageUrl(r)}" data-vs-page="${r}">${l || r}</a>`)
        .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => {
          const url = VS.safeUrl(VS.isExternal(u) || u[0] === '#' || /^mailto:/.test(u) ? u : VS.resolve(ctx.base, u));
          return `<a href="${esc(url)}"${VS.isExternal(u) ? ' target="_blank" rel="noopener"' : ''}>${t}</a>`;
        })
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/(^|[\s(])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
        .replace(/(^|[\s(])_([^_\s][^_]*)_/g, '$1<em>$2</em>')
        .replace(/==([^=]+)==/g, '<mark>$1</mark>')
        .replace(/~~([^~]+)~~/g, '<s>$1</s>');
      return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${esc(codes[i])}</code>`);
    },
    block(src, ctx = {}) {
      const lines = String(src ?? '').replace(/\r/g, '').split('\n');
      let out = '', i = 0;
      const inl = t => VS.md.inline(t, ctx);
      while (i < lines.length) {
        let l = lines[i];
        if (/^```/.test(l)) {
          const lang = l.slice(3).trim(); const buf = []; i++;
          while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]); i++;
          out += `<pre class="vs-code" data-lang="${esc(lang)}"><code>${esc(buf.join('\n'))}</code></pre>`; continue;
        }
        if (!l.trim()) { i++; continue; }
        let m;
        if ((m = l.match(/^(#{1,4})\s+(.*)/))) { out += `<h${m[1].length + 1}>${inl(m[2])}</h${m[1].length + 1}>`; i++; continue; }
        if (/^(-{3,}|\*{3,})$/.test(l.trim())) { out += '<hr>'; i++; continue; }
        if (/^>\s?/.test(l)) { const b = []; while (i < lines.length && /^>\s?/.test(lines[i])) b.push(lines[i++].replace(/^>\s?/, '')); out += `<blockquote>${inl(b.join(' '))}</blockquote>`; continue; }
        if (/^\s*([-*+]|\d+\.)\s+/.test(l)) {
          const ord = /^\s*\d+\./.test(l); const b = [];
          while (i < lines.length && /^\s*([-*+]|\d+\.)\s+/.test(lines[i])) b.push(lines[i++].replace(/^\s*([-*+]|\d+\.)\s+/, ''));
          out += `<${ord ? 'ol' : 'ul'}>${b.map(x => `<li>${inl(x)}</li>`).join('')}</${ord ? 'ol' : 'ul'}>`; continue;
        }
        const b = []; while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|```|>\s?|\s*([-*+]|\d+\.)\s+)/.test(lines[i])) b.push(lines[i++]);
        out += `<p>${inl(b.join(' '))}</p>`;
      }
      return out;
    }
  };

  /* ---------- navigation ---------- */
  VS.nav = {
    embedded: window.parent !== window,
    open(ref) { VS.nav.embedded ? parent.postMessage({ vs: 'open', ref }, '*') : (location.href = VS.pageUrl(ref)); },
    home() { VS.nav.embedded ? parent.postMessage({ vs: 'close' }, '*') : (location.href = VS.root + 'index.html'); },
    fullscreen() {
      const d = document;
      if (d.fullscreenElement) d.exitFullscreen(); else (d.documentElement.requestFullscreen || (() => { })).call(d.documentElement);
    }
  };
  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('[data-vs-page]');
    if (a) { e.preventDefault(); VS.nav.open(a.dataset.vsPage); }
  });

  /* ---------- registry (home + prev/next) ---------- */
  let _reg;
  VS.config = () => VS.fetchJSON(VS.root + 'viewscape.config.json');
  VS.registry = (progress) => _reg ||= (async () => {
    const cfg = await VS.config();
    const out = { config: cfg, sources: [], pages: [] };
    let done = 0, total = 1;
    const tick = () => progress && progress(++done / total, done, total);
    const per = await Promise.all(cfg.sources.map(async s => {
      let idx; try { idx = await VS.fetchJSON(`${VS.pagesRoot}${s.id}/index.json`); } catch (e) { console.warn('[viewscape]', e.message); idx = { pages: [] }; }
      total += idx.pages.length; tick();
      const pages = await Promise.all(idx.pages.map(async p => {
        const e = typeof p === 'string' ? { slug: p } : p;
        let meta; try { meta = await VS.fetchJSON(`${VS.pagesRoot}${s.id}/${e.slug}/page.json`); }
        catch (err) { console.warn('[viewscape]', err.message); meta = { title: e.slug, description: 'Could not load page.json', error: true }; }
        tick();
        return { source: s.id, sourceLabel: s.label || s.id, slug: e.slug, ref: `${s.id}/${e.slug}`, hidden: !!e.hidden, meta, entry: meta.entry || 'index.html' };
      }));
      return { src: s, pages };
    }));
    per.forEach(x => { out.sources.push(x.src); out.pages.push(...x.pages); });
    return out;
  })();

  VS.version && console.log('%c◈ VIEWSCAPE ONE %c' + VS.version, 'color:#ff2bd6;font-weight:bold;letter-spacing:.2em', 'color:#2ef2e0');
})();
