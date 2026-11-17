/*!
 * Viewscape One — vs.blocks.js
 * The block library. Every block is { "type": "...", ...props } in your JSON.
 * Extend:  VS.blocks.register('my-type', (block, ctx) => HTMLElement | string | Promise<…>)
 * Render:  await VS.blocks.render(blocksArray, containerEl, { base: pageFolderUrl })
 */
(function () {
  'use strict';
  const VS = window.VS, { el, esc, icon } = VS;
  const B = VS.blocks = { reg: {} };
  B.register = (t, fn) => (B.reg[t] = fn);

  const PAL = ['#ff2bd6', '#2ef2e0', '#9b6bff', '#9fd8ff', '#a8ffd0', '#ff2a55'];
  const DATA_TYPES = new Set(['stats', 'table', 'chart', 'cards', 'links', 'list', 'timeline', 'kv', 'tags', 'progress', 'gallery']);
  const md = (t, c) => VS.md.inline(t, c);
  const itemsOf = b => b.items || (Array.isArray(b.data) ? b.data : (b.data && (b.data.items || b.data.rows))) || [];
  const compact = new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 });
  const num = (v, dec) => (typeof v === 'number' ? v.toLocaleString(undefined, { maximumFractionDigits: dec ?? 2 }) : v);
  let _uid = 0;

  function onVisible(n, fn) {
    if (!('IntersectionObserver' in window)) return fn();
    const io = new IntersectionObserver(es => { if (es[0].isIntersecting) { io.disconnect(); fn(); } }, { threshold: .25 });
    io.observe(n);
  }
  function holoFrame(inner, cls = '') { return el('div', { class: 'vs-holoframe ' + cls }, el('i', { class: 'c tl' }), el('i', { class: 'c tr' }), el('i', { class: 'c bl' }), el('i', { class: 'c br' }), inner); }
  function figure(inner, b, ctx) { const f = el('figure', { class: 'vs-fig' }, inner); if (b.caption) f.append(el('figcaption', { html: md(b.caption, ctx) })); return f; }
  function hrefOf(it, ctx) {
    if (it.page) return { href: VS.pageUrl(it.page), attrs: { 'data-vs-page': it.page } };
    const h = it.href || it.url || '#';
    const href = VS.safeUrl(VS.isExternal(h) || h[0] === '#' || /^mailto:/.test(h) ? h : VS.resolve(ctx.base, h));
    return { href, attrs: VS.isExternal(h) ? { target: '_blank', rel: 'noopener' } : {} };
  }

  /* ================= core renderer ================= */
  async function renderBlock(b, ctx) {
    if (typeof b === 'string') b = { type: 'text', text: b };
    const wrap = el('div', { class: `vs-block vs-b-${b.type}${b.class ? ' ' + b.class : ''}`, 'data-reveal': '', id: b.id || null });
    if (b.accent) wrap.dataset.accent = b.accent;
    try {
      const fn = B.reg[b.type];
      if (!fn) throw new Error(`Unknown block type "${b.type}"`);
      if (b.src && DATA_TYPES.has(b.type) && /\.json(\?|#|$)/i.test(b.src)) b = { ...b, data: await VS.fetchJSON(VS.resolve(ctx.base, b.src)) };
      if (b.label) wrap.append(el('div', { class: 'vs-eyebrow', text: b.label }));
      const out = await fn(b, ctx);
      if (out != null) wrap.append(typeof out === 'string' ? el('div', { html: out }) : out);
    } catch (e) {
      console.warn('[viewscape] block failed', b, e);
      wrap.append(el('div', { class: 'vs-callout vs-tone-hot' }, el('b', { text: 'Block error: ' }), el('span', { text: e.message })));
    }
    return wrap;
  }
  B.renderBlock = renderBlock;
  B.render = async function (blocks, container, ctx = {}) {
    ctx = { base: location.href, ...ctx }; ctx.render = (bl, c) => B.render(bl, c, ctx);
    const nodes = await Promise.all((blocks || []).map(b => renderBlock(b, ctx)));
    nodes.forEach(n => container.append(n));
    VS.fx.reveal(container);
    $$tilt(container);
    return container;
  };
  function $$tilt(root) { root.querySelectorAll('.vs-card,.vs-stat').forEach(n => { if (!n._t) { n._t = 1; VS.fx.tilt(n, { max: 5 }); } }); }

  /* ================= text ================= */
  B.register('heading', b => {
    const l = Math.min(4, Math.max(2, b.level || 2));
    const h = el('h' + l, { class: 'vs-h', html: md(b.text || b.title || '') });
    return b.eyebrow ? el('div', {}, el('div', { class: 'vs-eyebrow', text: b.eyebrow }), h) : h;
  });
  B.register('text', (b, ctx) => {
    const d = el('div', { class: 'vs-prose' + (b.lead ? ' lead' : '') + (b.align ? ' al-' + b.align : '') });
    if (b.paragraphs) d.innerHTML = b.paragraphs.map(p => `<p>${md(p, ctx)}</p>`).join('');
    else d.innerHTML = VS.md.block(b.text ?? '', ctx);
    return d;
  });
  B.reg.paragraph = B.reg.text;
  B.register('quote', (b, ctx) => el('blockquote', { class: 'vs-quote' }, el('p', { html: md(b.text, ctx) }), (b.author || b.role) ? el('footer', { html: `<b>${esc(b.author || '')}</b> ${b.role ? '· ' + esc(b.role) : ''}` }) : null));
  B.register('callout', (b, ctx) => el('div', { class: `vs-callout vs-tone-${b.tone || 'info'}` },
    el('span', { class: 'ic', html: icon({ info: 'info', warn: 'zap', ok: 'check', hot: 'sparkle' }[b.tone || 'info'] || 'info', 20) }),
    el('div', {}, b.title ? el('b', { text: b.title }) : null, el('div', { html: b.paragraphs ? b.paragraphs.map(p => `<p>${md(p, ctx)}</p>`).join('') : VS.md.block(b.text || '', ctx) }))));
  B.register('divider', b => el('div', { class: 'vs-divider' }, b.label ? el('span', { text: b.label }) : null));
  B.register('spacer', b => el('div', { style: { height: (b.size || 32) + 'px' } }));
  B.register('list', (b, ctx) => { const t = b.ordered ? 'ol' : 'ul'; return el(t, { class: 'vs-list', html: itemsOf(b).map(i => `<li>${md(typeof i === 'string' ? i : i.text, ctx)}</li>`).join('') }); });
  B.register('tags', b => el('div', { class: 'vs-tags' }, ...itemsOf(b).map((t, i) => el('span', { class: 'vs-tag', style: { '--tc': PAL[i % PAL.length] } }, typeof t === 'string' ? t : t.label))));
  B.register('kv', b => {
    const rows = b.data && !Array.isArray(b.data) && !b.data.items ? Object.entries(b.data).map(([key, value]) => ({ key, value })) : itemsOf(b);
    return el('dl', { class: 'vs-kv' }, ...rows.flatMap(r => [el('dt', { text: r.key ?? r.label }), el('dd', { html: md(String(r.value)) })]));
  });
  B.register('code', b => {
    const pre = el('pre', { class: 'vs-code', 'data-lang': b.lang || '' }, el('code', { text: b.code ?? b.text ?? '' }));
    const btn = el('button', { class: 'vs-copy', title: 'Copy', html: icon('copy', 16), onclick: () => { navigator.clipboard && navigator.clipboard.writeText(b.code ?? b.text ?? ''); VS.fx.toast('Copied'); } });
    return el('div', { class: 'vs-codewrap' }, b.title ? el('div', { class: 'vs-codetitle', text: b.title }) : null, btn, pre);
  });
  B.register('html', b => el('div', { class: 'vs-rawhtml', html: b.html || '' }));
  B.register('md', async (b, ctx) => el('div', { class: 'vs-prose', html: VS.md.block(b.text ?? await VS.fetchText(VS.resolve(ctx.base, b.src)), { base: b.src ? VS.resolve(ctx.base, b.src) : ctx.base }) }));

  /* ================= hero ================= */
  B.register('hero', (b, ctx) => {
    const bg = b.video ? el('video', { class: 'bg', src: VS.resolve(ctx.base, b.video), autoplay: '', muted: '', loop: '', playsinline: '' }) : b.image ? el('img', { class: 'bg', src: VS.resolve(ctx.base, b.image), alt: '' }) : null;
    if (bg && bg.tagName === 'VIDEO') bg.muted = true;
    return holoFrame(el('div', { class: 'vs-hero-inner' }, bg,
      b.eyebrow ? el('div', { class: 'vs-eyebrow', text: b.eyebrow }) : null,
      el('h2', { class: 'vs-hero-title', html: md(b.title || '') }),
      b.subtitle ? el('p', { class: 'vs-hero-sub', html: md(b.subtitle, ctx) }) : null,
      b.tags ? el('div', { class: 'vs-tags' }, ...b.tags.map((t, i) => el('span', { class: 'vs-tag', style: { '--tc': PAL[i % PAL.length] } }, t))) : null,
      b.cta ? el('div', { class: 'vs-cta' }, ...b.cta.map(c => { const h = hrefOf(c, ctx); return el('a', { class: 'vs-btn' + (c.ghost ? ' ghost' : ''), href: h.href, ...h.attrs, text: c.label }); })) : null), 'vs-herobox');
  });

  /* ================= media ================= */
  B.register('image', (b, ctx) => {
    const src = VS.resolve(ctx.base, b.src);
    const img = el('img', { src, alt: b.alt || b.caption || '', loading: 'lazy' });
    img.addEventListener('click', () => VS.lightbox([{ src, caption: b.caption }], 0));
    return figure(holoFrame(img, 'media'), b, ctx);
  });
  B.register('gallery', (b, ctx) => {
    const its = itemsOf(b).map(i => typeof i === 'string' ? { src: i } : i).map(i => ({ ...i, src: VS.resolve(ctx.base, i.src) }));
    return el('div', { class: 'vs-gallery' }, ...its.map((it, i) => el('button', { class: 'vs-gi', onclick: () => VS.lightbox(its, i), 'aria-label': it.caption || 'Open image' },
      el('img', { src: it.src, alt: it.caption || '', loading: 'lazy' }), it.caption ? el('span', { text: it.caption }) : null)));
  });
  function embedUrl(u) {
    let m;
    if ((m = u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/))) return `https://www.youtube-nocookie.com/embed/${m[1]}`;
    if ((m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/))) return `https://player.vimeo.com/video/${m[1]}`;
    return null;
  }
  B.register('video', (b, ctx) => {
    const raw = b.src || b.url, emb = VS.isExternal(raw) && embedUrl(raw);
    let node;
    if (emb) node = el('iframe', { src: emb, allowfullscreen: '', loading: 'lazy', allow: 'accelerometer; autoplay; encrypted-media; picture-in-picture', title: b.caption || 'video' });
    else {
      node = el('video', { src: VS.resolve(ctx.base, raw), controls: b.controls === false ? null : '', playsinline: '', preload: 'metadata', poster: b.poster ? VS.resolve(ctx.base, b.poster) : null, loop: b.loop ? '' : null, autoplay: b.autoplay ? '' : null });
      if (b.muted || b.autoplay) node.muted = true;
    }
    return figure(holoFrame(el('div', { class: 'vs-ratio', style: { '--r': b.ratio || '16/9' } }, node), 'media'), b, ctx);
  });
  B.register('audio', (b, ctx) => figure(el('audio', { src: VS.resolve(ctx.base, b.src), controls: '', preload: 'metadata', class: 'vs-audio' }), b, ctx));
  B.register('embed', (b, ctx) => figure(holoFrame(el('div', { class: 'vs-ratio', style: { '--r': b.ratio || '16/10' } }, el('iframe', { src: VS.safeUrl(VS.resolve(ctx.base, b.src || b.url)), loading: 'lazy', allowfullscreen: '', title: b.caption || 'embed' })), 'media'), b, ctx));

  VS.lightbox = function (items, i = 0) {
    const box = el('div', { class: 'vs-lightbox' });
    const img = el('img'), cap = el('p');
    const show = k => { i = (k + items.length) % items.length; img.src = items[i].src; cap.textContent = items[i].caption || ''; };
    const close = () => { box.classList.remove('in'); setTimeout(() => box.remove(), 300); document.removeEventListener('keydown', key); };
    const key = e => { if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') show(i + 1); if (e.key === 'ArrowLeft') show(i - 1); };
    box.append(el('button', { class: 'x vs-glass', html: icon('close', 20), onclick: close }),
      items.length > 1 ? el('button', { class: 'p vs-glass', html: icon('prev', 22), onclick: e => { e.stopPropagation(); show(i - 1); } }) : '',
      items.length > 1 ? el('button', { class: 'n vs-glass', html: icon('next', 22), onclick: e => { e.stopPropagation(); show(i + 1); } }) : '', holoFrame(img, 'media'), cap);
    box.addEventListener('click', e => { if (e.target === box) close(); });
    document.body.append(box); show(i); document.addEventListener('keydown', key); requestAnimationFrame(() => box.classList.add('in'));
  };

  /* ================= links & files ================= */
  const linkCard = (it, ctx) => {
    const h = hrefOf(it, ctx);
    return el('a', { class: 'vs-card vs-card-link', href: h.href, ...h.attrs },
      el('span', { class: 'ic', html: icon(it.icon || (it.page ? 'layers' : VS.isExternal(it.href || '') ? 'external' : 'link'), 22) }),
      el('span', { class: 'tx' }, el('b', { text: it.title || it.label || it.href || it.page }), it.text ? el('small', { html: md(it.text, ctx) }) : null),
      it.tag ? el('em', { class: 'vs-tag', text: it.tag }) : null, el('span', { class: 'go', html: icon('next', 18) }));
  };
  B.register('link', (b, ctx) => linkCard(b, ctx));
  B.register('links', (b, ctx) => el('div', { class: 'vs-grid vs-links' }, ...itemsOf(b).map(i => linkCard(i, ctx))));
  B.register('file', (b, ctx) => {
    const url = VS.resolve(ctx.base, b.src), ext = (b.src.split('.').pop() || 'file').toUpperCase().slice(0, 5);
    return el('a', { class: 'vs-card vs-card-link vs-file', href: url, download: '', target: '_blank', rel: 'noopener' },
      el('span', { class: 'ext', text: ext }), el('span', { class: 'tx' }, el('b', { text: b.title || b.src.split('/').pop() }), b.text || b.size ? el('small', { text: b.text || b.size }) : null),
      el('span', { class: 'go', html: icon('download', 18) }));
  });
  B.register('include', async (b, ctx) => {
    const url = VS.resolve(ctx.base, b.src), data = await VS.fetchJSON(url);
    const blocks = Array.isArray(data) ? data : data.blocks || (data.sections ? data.sections.flatMap(s => s.blocks || []) : []);
    const host = el('div', { class: 'vs-include' });
    await B.render(blocks, host, { ...ctx, base: url });
    return host;
  });

  /* ================= cards / stats / timeline / progress ================= */
  B.register('cards', (b, ctx) => el('div', { class: 'vs-grid vs-cards', style: b.min ? { '--min': b.min + 'px' } : null }, ...itemsOf(b).map(it => {
    const h = (it.href || it.page) ? hrefOf(it, ctx) : null;
    const card = el(h ? 'a' : 'div', { class: 'vs-card' + (h ? ' vs-card-link' : ''), ...(h ? { href: h.href, ...h.attrs } : {}) },
      it.image ? el('div', { class: 'cv' }, el('img', { src: VS.resolve(ctx.base, it.image), alt: '', loading: 'lazy' })) : null,
      el('div', { class: 'bd' },
        it.icon ? el('span', { class: 'ic', html: icon(it.icon, 22) }) : null,
        it.tag ? el('em', { class: 'vs-tag', text: it.tag }) : null,
        el('h4', { html: md(it.title || '') }), it.text ? el('p', { html: md(it.text, ctx) }) : null,
        it.meta ? el('small', { class: 'meta', text: it.meta }) : null));
    return card;
  })));
  B.register('stats', b => {
    const g = el('div', { class: 'vs-grid vs-stats' });
    itemsOf(b).forEach((s, i) => {
      const v = el('span', { class: 'v', text: '0' });
      const d = s.delta != null ? el('span', { class: 'dl ' + (String(s.delta).trim().startsWith('-') ? 'dn' : 'up'), text: String(s.delta) }) : null;
      g.append(el('div', { class: 'vs-stat', style: { '--tc': PAL[i % PAL.length] } },
        s.icon ? el('span', { class: 'ic', html: icon(s.icon, 18) }) : null,
        el('div', { class: 'k', text: s.label }), el('div', { class: 'n' }, s.prefix ? el('small', { text: s.prefix }) : null, v, s.suffix ? el('small', { text: s.suffix }) : null), d, s.note ? el('div', { class: 'nt', text: s.note }) : null));
      const val = typeof s.value === 'number' ? s.value : parseFloat(String(s.value).replace(/,/g, ''));
      if (isFinite(val) && typeof s.value !== 'string') onVisible(v, () => VS.fx.countUp(v, val, { dec: s.decimals ?? (Number.isInteger(val) ? 0 : 1) }));
      else v.textContent = s.value;
    });
    return g;
  });
  B.register('timeline', (b, ctx) => el('ol', { class: 'vs-timeline' }, ...itemsOf(b).map((t, i) => el('li', { style: { '--tc': PAL[i % PAL.length] } },
    el('span', { class: 'dot' }), el('time', { text: t.date || t.when || '' }), el('b', { html: md(t.title || '') }), t.text ? el('p', { html: md(t.text, ctx) }) : null, t.tag ? el('em', { class: 'vs-tag', text: t.tag }) : null))));
  B.register('progress', b => {
    const its = itemsOf(b).length ? itemsOf(b) : [b];
    return el('div', { class: 'vs-progress' }, ...its.map((p, i) => {
      const max = p.max || 100, pct = Math.max(0, Math.min(100, (p.value / max) * 100));
      const bar = el('i'); bar.style.setProperty('--tc', PAL[i % PAL.length]);
      const row = el('div', { class: 'row' }, el('span', { class: 'lb', text: p.label || '' }), el('span', { class: 'vl', text: p.display || Math.round(pct) + '%' }), el('div', { class: 'bar' }, bar));
      onVisible(row, () => (bar.style.width = pct + '%')); return row;
    }));
  });

  /* ================= table ================= */
  B.register('table', (b) => {
    let rows = b.rows || itemsOf(b), cols = b.columns;
    if (rows.length && !Array.isArray(rows[0])) {
      cols = cols || Object.keys(rows[0]);
      const keys = cols.map(c => typeof c === 'string' ? c : c.key);
      rows = rows.map(r => keys.map(k => r[k]));
      cols = cols.map(c => typeof c === 'string' ? c : (c.label || c.key));
    } else if (!cols && rows.length) { cols = rows[0]; rows = rows.slice(1); }
    cols = (cols || []).map(c => typeof c === 'string' ? c : c.label);
    let sortI = -1, dir = 1, q = '';
    const tbody = el('tbody'), thead = el('tr');
    const draw = () => {
      let r = rows.filter(x => !q || x.some(c => String(c).toLowerCase().includes(q)));
      if (sortI >= 0) r = [...r].sort((a, c) => { const x = a[sortI], y = c[sortI]; return (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), undefined, { numeric: true })) * dir; });
      tbody.innerHTML = r.map(x => `<tr>${x.map(c => `<td>${typeof c === 'number' ? num(c) : md(c)}</td>`).join('')}</tr>`).join('') || `<tr><td colspan="${cols.length}" class="empty">No matches</td></tr>`;
    };
    cols.forEach((c, i) => thead.append(el('th', { text: c, tabindex: 0, onclick: () => { dir = sortI === i ? -dir : 1; sortI = i; thead.querySelectorAll('th').forEach((t, j) => t.dataset.sort = j === i ? (dir > 0 ? 'asc' : 'desc') : ''); draw(); } })));
    draw();
    return el('div', { class: 'vs-tablewrap' },
      b.search !== false && rows.length > 6 ? el('input', { class: 'vs-input', type: 'search', placeholder: 'Filter rows…', oninput: e => { q = e.target.value.toLowerCase(); draw(); } }) : null,
      el('div', { class: 'scroll' }, el('table', { class: 'vs-table' }, el('thead', {}, thead), tbody)), b.caption ? el('p', { class: 'vs-cap', text: b.caption }) : null);
  });

  /* ================= charts (inline SVG, zero deps) ================= */
  const nice = v => { if (v <= 0) return 1; const p = 10 ** Math.floor(Math.log10(v)), n = v / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p; };
  function norm(d) {
    if (Array.isArray(d)) {
      if (d.length && typeof d[0] === 'object') return { labels: d.map(x => x.label ?? x.name ?? ''), series: [{ name: '', values: d.map(x => +x.value || 0), colors: d.map(x => x.color) }] };
      return { labels: d.map((_, i) => String(i + 1)), series: [{ name: '', values: d.map(Number) }] };
    }
    return { labels: d.labels || [], series: (d.series || []).map(s => ({ name: s.name || '', values: (s.values || []).map(Number), color: s.color })) };
  }
  const smooth = pts => {
    if (pts.length < 2) return ''; let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
    } return d;
  };
  function chartSVG(kind, d, b) {
    const id = 'g' + (++_uid), W = 640, H = b.height || 300, L = 46, R = 14, T = 14, Bt = 30, iw = W - L - R, ih = H - T - Bt;
    const multi = d.series.length > 1, defs = {};
    const col = (se, i, j) => (se.colors && se.colors[i]) || se.color || (multi ? PAL[j % PAL.length] : (b.multicolor ? PAL[i % PAL.length] : 'var(--accent)'));
    const grad = c => { const k = c.replace(/\W/g, ''); defs[k] = `<linearGradient id="${id}${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:${c}"/><stop offset="1" style="stop-color:${c};stop-opacity:.15"/></linearGradient>`; return `url(#${id}${k})`; };
    const max = nice(Math.max(...d.series.flatMap(s => s.values), 0));
    let s = '';
    const grid = () => { let g = ''; for (let i = 0; i <= 4; i++) { const y = T + ih - ih * i / 4; g += `<line x1="${L}" x2="${W - R}" y1="${y}" y2="${y}" class="g"/><text x="${L - 8}" y="${y + 4}" class="t" text-anchor="end">${compact.format(max * i / 4)}</text>`; } return g; };
    const n = d.labels.length;

    if (kind === 'bar') {
      s += grid(); const sn = d.series.length, gw = iw / n, bw = Math.min(48, gw * .72 / sn);
      d.labels.forEach((lb, i) => {
        const cx = L + gw * i + gw / 2;
        d.series.forEach((se, j) => {
          const v = se.values[i] || 0, bh = ih * v / max, c = col(se, i, j);
          s += `<rect class="bar" style="--i:${i * sn + j}" x="${cx - bw * sn / 2 + bw * j + 1}" y="${T + ih - bh}" width="${bw - 2}" height="${bh}" rx="3" fill="${grad(c)}"><title>${esc(lb)}${se.name ? ' · ' + esc(se.name) : ''}: ${num(v)}</title></rect>`;
          s += `<rect class="cap" x="${cx - bw * sn / 2 + bw * j + 1}" y="${T + ih - bh}" width="${bw - 2}" height="2" style="fill:${c};--i:${i * sn + j}"/>`;
        });
        s += `<text x="${cx}" y="${H - 10}" class="t" text-anchor="middle">${esc(String(lb).slice(0, 12))}</text>`;
      });
    } else if (kind === 'line' || kind === 'area') {
      s += grid(); const step = n > 1 ? iw / (n - 1) : 0;
      d.labels.forEach((lb, i) => { if (n <= 12 || i % Math.ceil(n / 10) === 0) s += `<text x="${L + step * i}" y="${H - 10}" class="t" text-anchor="middle">${esc(String(lb).slice(0, 10))}</text>`; });
      d.series.forEach((se, j) => {
        const c = col(se, 0, j), pts = se.values.map((v, i) => [L + step * i, T + ih - ih * v / max]), path = smooth(pts);
        if (kind === 'area' || !multi) s += `<path class="area" d="${path} L${pts[pts.length - 1][0]},${T + ih} L${pts[0][0]},${T + ih} Z" fill="${grad(c)}" style="opacity:.5"/>`;
        s += `<path class="ln" pathLength="1" d="${path}" style="stroke:${c}"/>`;
        pts.forEach((p, i) => { s += `<circle class="dt" cx="${p[0]}" cy="${p[1]}" r="3.5" style="fill:${c}"><title>${esc(d.labels[i])}${se.name ? ' · ' + esc(se.name) : ''}: ${num(se.values[i])}</title></circle>`; });
      });
    } else if (kind === 'donut') {
      const vals = d.series[0].values, tot = vals.reduce((a, c) => a + c, 0) || 1; let acc = 0;
      const sw = 22; let seg = '';
      vals.forEach((v, i) => {
        const p = v / tot * 100, c = (d.series[0].colors && d.series[0].colors[i]) || PAL[i % PAL.length];
        seg += `<circle class="seg" r="70" cx="100" cy="100" pathLength="100" stroke-dasharray="${Math.max(p - .8, 0)} ${100 - Math.max(p - .8, 0)}" stroke-dashoffset="${-acc}" style="stroke:${c};--i:${i}" transform="rotate(-90 100 100)"><title>${esc(d.labels[i])}: ${num(v)} (${p.toFixed(1)}%)</title></circle>`; acc += p;
      });
      return `<svg viewBox="0 0 200 200" class="vs-svg donut" role="img"><circle r="70" cx="100" cy="100" class="trk" style="stroke-width:${sw}"/><g style="stroke-width:${sw}">${seg}</g><text x="100" y="98" text-anchor="middle" class="big">${compact.format(tot)}</text><text x="100" y="116" text-anchor="middle" class="t">${esc(b.centerLabel || 'total')}</text></svg>`;
    } else if (kind === 'radar') {
      const cx = 200, cy = 160, r = 110, N = Math.max(n, 3), ang = i => -Math.PI / 2 + i * 2 * Math.PI / N;
      let g = '';
      for (let l = 1; l <= 4; l++) g += `<polygon class="g" fill="none" points="${Array.from({ length: N }, (_, i) => `${cx + Math.cos(ang(i)) * r * l / 4},${cy + Math.sin(ang(i)) * r * l / 4}`).join(' ')}"/>`;
      d.labels.forEach((lb, i) => { g += `<line class="g" x1="${cx}" y1="${cy}" x2="${cx + Math.cos(ang(i)) * r}" y2="${cy + Math.sin(ang(i)) * r}"/><text class="t" x="${cx + Math.cos(ang(i)) * (r + 18)}" y="${cy + Math.sin(ang(i)) * (r + 18) + 4}" text-anchor="middle">${esc(String(lb).slice(0, 12))}</text>`; });
      d.series.forEach((se, j) => { const c = col(se, 0, j); g += `<polygon class="rad" style="stroke:${c};fill:${c};--i:${j}" points="${se.values.map((v, i) => `${cx + Math.cos(ang(i)) * r * v / max},${cy + Math.sin(ang(i)) * r * v / max}`).join(' ')}"/>`; });
      return `<svg viewBox="0 0 400 320" class="vs-svg radar" role="img">${g}</svg>`;
    } else if (kind === 'spark') {
      const w = 160, h = 40, v = d.series[0].values, mx = Math.max(...v, 1), mn = Math.min(...v, 0), st = v.length > 1 ? w / (v.length - 1) : 0;
      const pts = v.map((x, i) => [i * st, h - 4 - (h - 8) * (x - mn) / ((mx - mn) || 1)]);
      return `<svg viewBox="0 0 ${w} ${h}" class="vs-svg spark" role="img"><path class="ln" pathLength="1" d="${smooth(pts)}"/></svg>`;
    }
    return `<svg viewBox="0 0 ${W} ${H}" class="vs-svg ${kind}" role="img"><defs>${Object.values(defs).join('')}</defs>${s}</svg>`;
  }
  B.register('chart', (b) => {
    const kind = b.kind || 'bar', d = norm(b.data);
    const fig = el('figure', { class: 'vs-chart k-' + kind });
    fig.innerHTML = (b.title ? `<figcaption class="ct">${esc(b.title)}</figcaption>` : '') + chartSVG(kind, d, b);
    const legendItems = kind === 'donut' ? d.labels.map((l, i) => [l, (d.series[0].colors && d.series[0].colors[i]) || PAL[i % PAL.length]]) : d.series.length > 1 || kind === 'radar' ? d.series.map((s, j) => [s.name || 'Series ' + (j + 1), s.color || PAL[j % PAL.length]]) : [];
    if (legendItems.length) fig.append(el('ul', { class: 'vs-legend' }, ...legendItems.map(([l, c]) => el('li', { html: `<i style="background:${c}"></i>${esc(l)}` }))));
    if (b.caption) fig.append(el('p', { class: 'vs-cap', text: b.caption }));
    onVisible(fig, () => fig.classList.add('go'));
    return fig;
  });

  /* ================= tabs / accordion / columns / json ================= */
  B.register('tabs', async (b, ctx) => {
    const bar = el('div', { class: 'vs-tabbar', role: 'tablist' }), body = el('div', { class: 'vs-tabbody' });
    const panes = await Promise.all(b.items.map(async it => { const p = el('div', { class: 'vs-pane', role: 'tabpanel' }); await ctx.render(it.blocks || [], p); return p; }));
    const pick = i => { [...bar.children].forEach((x, j) => x.classList.toggle('on', j === i)); panes.forEach((p, j) => p.classList.toggle('on', j === i)); };
    b.items.forEach((it, i) => bar.append(el('button', { class: 'vs-chip', role: 'tab', onclick: () => pick(i), html: (it.icon ? icon(it.icon, 16) : '') + esc(it.title || 'Tab ' + (i + 1)) })));
    panes.forEach(p => body.append(p)); pick(0);
    return el('div', { class: 'vs-tabs vs-glass' }, bar, body);
  });
  B.register('accordion', async (b, ctx) => el('div', { class: 'vs-accordion' }, ...await Promise.all(b.items.map(async it => {
    const d = el('details', { class: 'vs-glass', open: it.open ? '' : null }, el('summary', {}, el('span', { text: it.title }), el('i', { html: icon('next', 16) })));
    const inner = el('div', { class: 'in' }); d.append(inner); await ctx.render(it.blocks || [], inner); return d;
  }))));
  B.register('columns', async (b, ctx) => {
    const g = el('div', { class: 'vs-cols', style: { '--cols': b.ratio || b.columns.map(() => '1fr').join(' ') } });
    for (const c of b.columns) { const col = el('div', { class: 'vs-col' }); await ctx.render(c.blocks || [], col); g.append(col); }
    return g;
  });
  B.register('json', async (b, ctx) => {
    const data = b.data ?? (b.src ? await VS.fetchJSON(VS.resolve(ctx.base, b.src)) : null);
    const node = (v, k, depth) => {
      const kk = k != null ? `<span class="k">${esc(k)}</span>: ` : '';
      if (v && typeof v === 'object') {
        const ents = Array.isArray(v) ? v.map((x, i) => [i, x]) : Object.entries(v);
        const d = el('details', { class: 'jt', open: depth < 1 ? '' : null }, el('summary', { html: `${kk}<span class="p">${Array.isArray(v) ? `[${ents.length}]` : `{${ents.length}}`}</span>` }));
        ents.forEach(([a, x]) => d.append(node(x, a, depth + 1))); return d;
      }
      return el('div', { class: 'jl', html: `${kk}<span class="${typeof v}">${esc(JSON.stringify(v))}</span>` });
    };
    return el('div', { class: 'vs-json vs-glass' }, node(data, null, 0));
  });

  /* helper for custom pages */
  VS.block = (type, props = {}) => ({ type, ...props });
})();
