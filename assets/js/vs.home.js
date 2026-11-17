/*!
 * Viewscape One — vs.home.js
 * The home "field": boot sequence, tile field grouped by source folder, search/filter, hologram viewer, wheel.
 */
(function () {
  'use strict';
  const VS = window.VS, { el, esc, icon, $, sleep } = VS;
  const H = VS.home = {};
  let reg, wheel, viewer = {}, current = null, filter = { q: '', src: 'all' };

  const iconOrGlyph = (g, s = 26) => (g && VS.icons.includes(g)) ? icon(g, s) : `<span class="gl">${esc(g || '✦')}</span>`;

  /* ================= BOOT ================= */
  async function boot() {
    const bootEl = $('#boot'), bar = $('#boot .vs-bar i'), pct = $('#boot .pct'), log = $('#boot .log');
    const script = [[0, 'holo-core online'], [.12, 'calibrating projector array'], [.3, 'mounting source folders'], [.5, 'indexing page manifests'], [.72, 'compiling liquid glass shaders'], [.9, 'handshake · field ready']];
    let shown = 0, p = 0, real = 0, done = false; const t0 = performance.now();
    const say = t => { const d = el('div', { text: '> ' + t }); log.append(d); while (log.children.length > 6) log.firstChild.remove(); };
    const paint = () => {
      const fake = Math.min(.93, (performance.now() - t0) / 2300);
      p = Math.max(p, Math.min(done ? 1 : .96, Math.max(real * .9, fake)));
      bar.style.transform = `scaleX(${p})`; pct.textContent = String(Math.round(p * 100)).padStart(3, '0') + '%';
      while (shown < script.length && p >= script[shown][0]) say(script[shown++][1]);
    };
    const iv = setInterval(paint, 50);
    try { reg = await VS.registry(v => { real = v; }); }
    catch (e) {
      clearInterval(iv); const file = location.protocol === 'file:';
      say('FATAL · ' + (file ? 'open via a web server (fetch blocked on file://)' : e.message));
      bootEl.classList.add('err'); return;
    }
    const wait = Math.max(0, 2400 - (performance.now() - t0)); await sleep(wait);
    done = true; paint(); await sleep(380); clearInterval(iv);
    buildUI(); await sleep(80);
    bootEl.classList.add('out'); document.documentElement.classList.add('vs-live');
    setTimeout(() => bootEl.remove(), 1000);
    route();
  }

  /* ================= UI ================= */
  function buildUI() {
    const cfg = reg.config, app = $('#app');
    VS.fx.ambient(document.body, { particles: true });
    VS.accent.set(VS.store.get('homeAccent', cfg.accent || 'magenta'));
    document.title = (cfg.name || 'Viewscape One');
    const visible = reg.pages.filter(p => !p.hidden);

    /* header */
    const chips = el('div', { class: 'vs-chips' });
    const mkChip = (id, label, n) => el('button', { class: 'vs-chip' + (filter.src === id ? ' on' : ''), 'data-src': id, onclick: () => setSource(id), html: `${esc(label)}<b>${n}</b>` });
    chips.append(mkChip('all', 'All', visible.length), ...reg.sources.map(s => mkChip(s.id, s.label || s.id, visible.filter(p => p.source === s.id).length)));
    const search = el('input', { class: 'vs-input', type: 'search', placeholder: 'search the field…', id: 'q', autocomplete: 'off', 'aria-label': 'Search pages', oninput: e => { filter.q = e.target.value.trim().toLowerCase(); applyFilter(); } });
    app.append(
      el('header', { class: 'vs-top' },
        el('div', { class: 'vs-brand' }, el('div', { class: 'mark', html: '<svg viewBox="0 0 40 40"><path d="M20 3l15 9v16l-15 9L5 28V12z"/><path d="M20 12l7 4v8l-7 4-7-4v-8z"/><circle cx="20" cy="20" r="2"/></svg>' }),
          el('div', {}, el('div', { class: 'name', html: '<span class="vs-glitch" data-text="VIEWSCAPE">VIEWSCAPE</span><b>ONE</b>' }), el('div', { class: 'tag', text: cfg.tagline || 'holographic data field' }))),
        el('div', { class: 'vs-tools' }, el('div', { class: 'vs-searchbox vs-glass', html: icon('search', 18) }, search),
          el('a', { class: 'vs-btn ghost sm', href: VS.root + 'studio/index.html', html: icon('settings', 16) + '<span>Studio</span>' }))),
      VS.fx.ticker([`${visible.length} pages online`, `${reg.sources.length} source folders`, 'holo link stable', 'liquid glass v1', 'hold the orb ◉ →', 'viewscape one']),
      el('section', { class: 'vs-hero-home' },
        el('div', { class: 'vs-eyebrow', text: cfg.eyebrow || '★ certified holo ★ field index' }),
        el('h1', { class: 'vs-title', 'data-text': cfg.headline || 'Choose a window.' }, cfg.headline || 'Choose a window.'),
        el('p', { class: 'vs-sub', text: cfg.subline || 'Every tile is its own page — its own data, its own world.' }), chips),
      el('main', { id: 'field', class: 'vs-field' }));

    /* zones + tiles */
    const field = $('#field');
    if (!visible.length) {
      field.append(el('div', { class: 'vs-empty vs-glass' }, el('span', { html: icon('cube', 40) }), el('h3', { text: 'The field is empty' }),
        el('p', { html: 'Add a page: <code>node tools/vs.mjs new me my-page</code> — or open the <a href="studio/index.html">Studio</a> and paste AI\'s JSON.' })));
    }
    let n = 0;
    reg.sources.forEach(s => {
      const pages = reg.pages.filter(p => p.source === s.id && !p.hidden); if (!pages.length) return;
      const zone = el('section', { class: 'vs-zone', 'data-src': s.id, 'data-accent': s.accent || null },
        el('header', {}, el('span', { class: 'ic', html: icon(s.icon || 'layers', 20) }), el('h2', { text: s.label || s.id }), el('small', { text: `${pages.length} page${pages.length > 1 ? 's' : ''}${s.description ? ' · ' + s.description : ''}` }), el('i', { class: 'rule' })),
        el('div', { class: 'vs-tiles' }, ...pages.map(p => tile(p, n++))));
      field.append(zone);
    });
    field.append(el('div', { class: 'vs-none', hidden: '', text: 'No signal. Try another search.' }));
    app.append(el('footer', { class: 'vs-foot', html: `<span>◈ ${esc(cfg.name || 'VIEWSCAPE ONE')} v${VS.version}</span><span>${esc(cfg.footer || 'drop a folder in /pages · list it in index.json · done')}</span>` }));
    VS.fx.reveal(document);

    buildViewer(); buildWheel();
    addEventListener('hashchange', route);
    document.addEventListener('keydown', e => {
      if (e.key === '/' && document.activeElement !== search && !viewer.on) { e.preventDefault(); search.focus(); }
      if (e.key === 'Escape' && viewer.on) close();
    });
  }

  function tile(p, i) {
    const m = p.meta, t = el('a', { class: 'vs-tile', href: `#/${p.ref}`, 'data-ref': p.ref, 'data-accent': m.accent || null, style: { '--i': i, '--fd': (i % 5) * -1.1 + 's' } },
      m.cover && !/\.(mp4|webm)$/i.test(m.cover) ? el('img', { class: 'bgimg', src: VS.resolve(VS.pagesRoot + p.ref + '/', m.cover), alt: '', loading: 'lazy' }) : null,
      el('i', { class: 'edge' }), el('i', { class: 'c tl' }), el('i', { class: 'c tr' }), el('i', { class: 'c bl' }), el('i', { class: 'c br' }),
      el('div', { class: 'top' }, el('span', { class: 'hex', html: iconOrGlyph(m.icon) }), el('span', { class: 'src', html: icon(p.source === 'ai' ? 'bot' : 'user', 13) + esc(p.sourceLabel) })),
      el('h3', { text: m.title || p.slug }), el('p', { text: m.subtitle || m.description || '' }),
      el('div', { class: 'tg' }, ...(m.tags || []).slice(0, 3).map(x => el('span', { class: 'vs-tag', text: x }))),
      el('div', { class: 'bt' }, el('small', { text: m.updated || (m.type === 'custom' ? 'custom page' : 'data page') }), el('span', { class: 'go', html: 'ENTER' + icon('next', 14) })));
    t._hay = [m.title, m.subtitle, m.description, p.source, p.slug, ...(m.tags || [])].join(' ').toLowerCase();
    VS.fx.tilt(t, { max: 8 });
    return t;
  }

  function applyFilter() {
    let any = false;
    VS.$$('.vs-zone').forEach(z => {
      let n = 0;
      VS.$$('.vs-tile', z).forEach(t => { const ok = (filter.src === 'all' || z.dataset.src === filter.src) && (!filter.q || t._hay.includes(filter.q)); t.hidden = !ok; if (ok) n++; });
      z.hidden = !n; if (n) any = true;
    });
    const none = $('.vs-none'); if (none) none.hidden = any || !reg.pages.length;
  }
  function setSource(id) { filter.src = id; VS.$$('.vs-chip[data-src]').forEach(c => c.classList.toggle('on', c.dataset.src === id)); applyFilter(); }

  /* ================= VIEWER (hologram box) ================= */
  function buildViewer() {
    const frame = el('iframe', { class: 'vs-frame', title: 'Viewscape page', allow: 'fullscreen; autoplay; clipboard-write' });
    const title = el('b', { class: 'ttl' }), badge = el('span', { class: 'vs-tag' }), status = el('span', { class: 'st', text: 'LINKING' });
    const box = el('div', { class: 'vs-viewbox' },
      el('i', { class: 'c tl' }), el('i', { class: 'c tr' }), el('i', { class: 'c bl' }), el('i', { class: 'c br' }),
      el('div', { class: 'vs-viewbar vs-glass' },
        el('button', { class: 'vs-btn ghost sm', onclick: () => close(), html: icon('back', 16) + '<span>Field</span>' }),
        el('div', { class: 'mid' }, title, badge), status,
        el('button', { class: 'vs-icon-btn', title: 'Open alone', onclick: () => current && window.open(VS.pagesRoot + current.ref + '/' + current.entry, '_blank', 'noopener'), html: icon('external', 18) }),
        el('button', { class: 'vs-icon-btn', title: 'Fullscreen', onclick: () => { const f = box; document.fullscreenElement ? document.exitFullscreen() : f.requestFullscreen && f.requestFullscreen(); }, html: icon('expand', 18) })),
      el('div', { class: 'vs-stage' }, frame, el('div', { class: 'vs-glassfx' })), el('div', { class: 'vs-beam' }));
    const wrap = el('div', { class: 'vs-viewer', 'aria-hidden': 'true' }, el('div', { class: 'vs-backdrop', onclick: () => close() }), box);
    document.body.append(wrap);
    const lb = VS.fx.loadbar(box);
    frame.addEventListener('load', () => { if (frame.getAttribute('src') && frame.getAttribute('src') !== 'about:blank') { lb.done(); frame.classList.add('live'); status.textContent = 'LINK STABLE'; } });
    addEventListener('message', e => {
      if (e.source !== frame.contentWindow || !e.data || !e.data.vs) return;
      if (e.data.vs === 'open') open(e.data.ref); else if (e.data.vs === 'close') close();
      else if (e.data.vs === 'ready') { if (e.data.title) title.textContent = e.data.title; lb.done(); frame.classList.add('live'); status.textContent = 'LINK STABLE'; }
    });
    viewer = { wrap, box, frame, title, badge, status, lb, on: false };
  }

  function open(ref, { push = true } = {}) {
    const pg = reg.pages.find(p => p.ref === ref);
    if (!pg) { VS.fx.toast('No such page: ' + ref, 'zap'); return; }
    const v = viewer, same = current && current.ref === ref && v.on;
    current = pg; v.on = true;
    v.title.textContent = pg.meta.title || pg.slug; v.badge.textContent = pg.sourceLabel;
    v.box.dataset.accent = pg.meta.accent || 'magenta'; v.status.textContent = 'LINKING';
    v.wrap.classList.add('on'); v.wrap.setAttribute('aria-hidden', 'false'); document.documentElement.classList.add('vs-viewing');
    if (wheel) wheel.el.classList.add('is-hidden');
    if (!same) {
      v.frame.classList.remove('live'); v.box.classList.remove('swap'); void v.box.offsetWidth; v.box.classList.add('swap'); v.lb.start();
      v.frame.src = `${VS.pagesRoot}${pg.ref}/${pg.entry}`;
    }
    if (push && location.hash !== '#/' + ref) history.pushState(null, '', '#/' + ref);
  }
  function close({ push = true } = {}) {
    const v = viewer; if (!v.on) return; v.on = false; current = null;
    v.wrap.classList.remove('on'); v.wrap.setAttribute('aria-hidden', 'true'); document.documentElement.classList.remove('vs-viewing');
    if (wheel) wheel.el.classList.remove('is-hidden');
    setTimeout(() => { if (!v.on) { v.frame.removeAttribute('src'); v.frame.classList.remove('live'); } }, 600);
    if (push && location.hash) history.pushState(null, '', location.pathname + location.search);
    if (document.fullscreenElement) document.exitFullscreen();
  }
  function route() {
    const m = location.hash.match(/^#\/([a-z0-9-]+\/[a-z0-9-]+)$/);
    if (m) open(m[1], { push: false }); else close({ push: false });
  }
  VS.nav.open = ref => open(ref); VS.nav.home = () => close();

  /* ================= WHEEL ================= */
  function buildWheel() {
    const visible = reg.pages.filter(p => !p.hidden);
    const srcSlots = [{ id: 'all', label: 'All', icon: 'grid', onSelect: () => setSource('all') }, ...reg.sources.map(s => ({ id: s.id, label: s.label || s.id, icon: s.icon || 'layers', hint: visible.filter(p => p.source === s.id).length + ' pages', onSelect: () => setSource(s.id) }))];
    const latest = () => [...visible].sort((a, b) => String(b.meta.updated || '').localeCompare(String(a.meta.updated || '')))[0];
    wheel = VS.wheel.create({
      title: 'Viewscape', slots: [
        { id: 'search', label: 'Search', icon: 'search', hint: 'press /', onSelect: () => { scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(() => $('#q') && $('#q').focus(), 350); } },
        { id: 'sources', label: 'Sources', icon: 'filter', hint: 'filter field', children: srcSlots },
        { id: 'random', label: 'Random', icon: 'shuffle', hint: 'surprise me', onSelect: () => { if (visible.length) open(visible[Math.floor(Math.random() * visible.length)].ref); } },
        { id: 'latest', label: 'Latest', icon: 'zap', hint: 'newest page', onSelect: () => { const l = latest(); l && open(l.ref); } },
        { ...VS.wheel.accentSlot(), onSelect: () => { VS.accent.cycle(); VS.store.set('homeAccent', VS.accent.get()); } },
        { id: 'fs', label: 'Fullscreen', icon: 'expand', onSelect: () => VS.nav.fullscreen() },
        VS.wheel.display(),
        { id: 'about', label: 'About', icon: 'info', hint: 'how it works', onSelect: about }
      ]
    });
  }
  function about() {
    const m = el('div', { class: 'vs-modal' }, el('div', { class: 'bk', onclick: () => m.remove() }),
      el('div', { class: 'vs-glass vs-holoframe pn' }, el('i', { class: 'c tl' }), el('i', { class: 'c tr' }), el('i', { class: 'c bl' }), el('i', { class: 'c br' }),
        el('h3', { text: 'VIEWSCAPE ONE · v' + VS.version }),
        el('p', { html: 'A folder-driven holographic data framework. Each <b>tile</b> is a folder in <code>pages/&lt;source&gt;/&lt;slug&gt;/</code> with a <code>page.json</code> (or its own HTML/CSS/JS).' }),
        el('ul', { class: 'vs-list' }, el('li', { html: '<b>Orb ◉</b> (right edge) — hold, drag, release. Or tap it, then tap a wedge. Key <kbd>W</kbd>.' }), el('li', { html: '<kbd>/</kbd> search · <kbd>Esc</kbd> back to field' }), el('li', { html: 'Add pages with <code>node tools/vs.mjs new</code> or the <a href="studio/index.html">Studio</a>. AI reads <code>HANDOVER.json</code>.' })),
        el('button', { class: 'vs-btn', onclick: () => m.remove(), text: 'Got it' })));
    document.body.append(m); requestAnimationFrame(() => m.classList.add('in'));
  }

  H.open = open; H.close = close;
  VS.ready(boot);
})();
