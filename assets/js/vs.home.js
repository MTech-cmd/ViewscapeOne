/*!
 * Viewscape One — vs.home.js
 * The home "field": boot sequence, statusbar, tile field, command palette, hologram viewer (with split view),
 * multi-window hooks, and the radial wheel that carries all navigation.
 */
(function () {
  'use strict';
  const VS = window.VS, { el, esc, icon, $, sleep } = VS;
  const H = VS.home = {};
  let reg, wheel, A, B, box, wrap, lb, filter = { q: '', src: 'all' }, viewing = false;
  const quick = (() => { try { return sessionStorage.getItem('vs.booted') === '1'; } catch { return false; } })();
  const iconOrGlyph = (g, s = 26) => (g && VS.icons.includes(g)) ? icon(g, s) : `<span class="gl">${esc(g || '✦')}</span>`;
  const srcOf = id => (reg.sources.find(s => s.id === id) || {});

  /* ================= BOOT ================= */
  async function boot() {
    const bootEl = $('#boot'), bar = $('#boot .vs-bar i'), pct = $('#boot .pct'), log = $('#boot .log');
    const script = [[0, 'holo-core online'], [.12, 'calibrating projector array'], [.3, 'mounting source folders'], [.5, 'indexing page manifests'], [.72, 'compiling liquid glass shaders'], [.9, 'handshake · field ready']];
    const total = quick ? 700 : 2400; let shown = 0, p = 0, real = 0, done = false; const t0 = performance.now();
    const say = t => { const d = el('div', { text: '> ' + t }); log.append(d); while (log.children.length > 6) log.firstChild.remove(); };
    const paint = () => {
      const fake = Math.min(.93, (performance.now() - t0) / (total - 100));
      p = Math.max(p, Math.min(done ? 1 : .96, Math.max(real * .9, fake)));
      bar.style.transform = `scaleX(${p})`; pct.textContent = String(Math.round(p * 100)).padStart(3, '0') + '%';
      while (shown < script.length && p >= script[shown][0]) say(script[shown++][1]);
    };
    const iv = setInterval(paint, 50);
    try { reg = await VS.registry(v => { real = v; }); }
    catch (e) {
      clearInterval(iv); const file = location.protocol === 'file:';
      say('FATAL · ' + (file ? 'open via a web server (fetch blocked on file://)' : e.message)); bootEl.classList.add('err'); return;
    }
    await sleep(Math.max(0, total - (performance.now() - t0)));
    done = true; paint(); await sleep(quick ? 120 : 380); clearInterval(iv);
    try { sessionStorage.setItem('vs.booted', '1'); } catch { }
    buildUI(); await sleep(60);
    bootEl.classList.add('out'); html().classList.add('vs-live'); setTimeout(() => bootEl.remove(), 1000);
    route();
    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) navigator.serviceWorker.register(VS.root + 'sw.js').catch(() => { });
  }
  const html = () => document.documentElement;

  /* ================= UI ================= */
  function buildUI() {
    const cfg = reg.config, app = $('#app');
    VS.fx.ambient(document.body, { particles: true });
    VS.accent.set(VS.store.get('homeAccent', cfg.accent || 'magenta'));
    document.title = cfg.name || 'Viewscape One';
    VS.status.mount({ title: 'FIELD' });
    const visible = reg.pages.filter(p => !p.hidden);

    const chips = el('div', { class: 'vs-chips' });
    const mkChip = (id, label, n) => el('button', { class: 'vs-chip' + (filter.src === id ? ' on' : ''), 'data-src': id, onclick: () => setSource(id), html: `${esc(label)}<b>${n}</b>` });
    chips.append(mkChip('all', 'All', visible.length), ...reg.sources.filter(s => visible.some(p => p.source === s.id)).map(s => mkChip(s.id, s.label || s.id, visible.filter(p => p.source === s.id).length)));
    app.append(
      VS.fx.ticker([`${visible.length} pages online`, `${reg.sources.length} source folders`, 'holo link stable', 'liquid glass v1', VS.coarse ? 'swipe in from the right edge ◉' : 'hold the orb ◉ →', 'viewscape one']),
      el('section', { class: 'vs-hero-home' },
        el('div', { class: 'vs-eyebrow', text: cfg.eyebrow || '★ certified holo ★ field index' }),
        el('h1', { class: 'vs-title', 'data-text': cfg.headline || 'Choose a window.' }, cfg.headline || 'Choose a window.'),
        el('p', { class: 'vs-sub', text: cfg.subline || 'Every tile is its own page.' }), chips),
      el('main', { id: 'field', class: 'vs-field' }));

    const field = $('#field');
    if (!visible.length) field.append(el('div', { class: 'vs-empty vs-glass' }, el('span', { html: icon('cube', 40) }), el('h3', { text: 'The field is empty' }), el('p', { html: 'Add a page: <code>node tools/vs.mjs new me my-page</code>' })));
    let n = 0;
    reg.sources.forEach(s => {
      const pages = visible.filter(p => p.source === s.id); if (!pages.length) return;
      field.append(el('section', { class: 'vs-zone', 'data-src': s.id, 'data-accent': s.accent || null },
        el('header', {}, el('span', { class: 'ic', html: icon(s.icon || 'layers', 20) }), el('h2', { text: s.label || s.id }), el('small', { text: `${pages.length} page${pages.length > 1 ? 's' : ''}${s.description ? ' · ' + s.description : ''}` }), el('i', { class: 'rule' })),
        el('div', { class: 'vs-tiles' }, ...pages.map(p => tile(p, n++)))));
    });
    field.append(el('div', { class: 'vs-none', hidden: '', text: 'No signal. Try another search.' }));
    app.append(el('footer', { class: 'vs-foot', html: `<span>◈ ${esc(cfg.name || 'VIEWSCAPE ONE')} v${VS.version}</span><span>${esc(cfg.footer || '')}</span>` }));
    VS.fx.reveal(document);

    buildViewer(); buildWheel();
    addEventListener('hashchange', route);
    document.addEventListener('keydown', e => {
      const t = e.target; if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return;
      if (e.key === '/' && !$('.vs-palette')) { e.preventDefault(); palette(); }
      if (e.key === 'Escape' && viewing && !$('.vs-palette') && !(wheel && wheel.isOpen)) close();
    });
    VS.on('win:open', m => { if (m.ref) open(m.ref); });
    VS.on('win:accent', v => VS.accent.set(v, true));
  }

  function tile(p, i) {
    const m = p.meta, s = srcOf(p.source);
    const t = el('a', { class: 'vs-tile', href: `#/${p.ref}`, 'data-ref': p.ref, 'data-accent': m.accent || null, style: { '--i': i, '--fd': (i % 5) * -1.1 + 's' } },
      m.cover && !/\.(mp4|webm)$/i.test(m.cover) ? el('img', { class: 'bgimg', src: VS.resolve(VS.pagesRoot + p.ref + '/', m.cover), alt: '', loading: 'lazy', decoding: 'async' }) : null,
      el('i', { class: 'edge' }), el('i', { class: 'c tl' }), el('i', { class: 'c tr' }), el('i', { class: 'c bl' }), el('i', { class: 'c br' }),
      el('div', { class: 'top' }, el('span', { class: 'hex', html: iconOrGlyph(m.icon) }), el('span', { class: 'src', html: icon(s.icon || 'layers', 13) + esc(p.sourceLabel) })),
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

  /* ================= COMMAND PALETTE (search + "open beside" picker) ================= */
  function palette(o = {}) {
    if ($('.vs-palette')) return;
    const pages = reg.pages.filter(p => !p.hidden); let list = pages, on = 0;
    const input = el('input', { class: 'vs-input', type: 'search', placeholder: o.title ? 'pick a page…' : 'search the field…', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', 'aria-label': 'Search pages', enterkeyhint: 'go' });
    const ul = el('ul'), m = el('div', { class: 'vs-palette', role: 'dialog', 'aria-modal': 'true' }, el('div', { class: 'bk', onclick: done }),
      el('div', { class: 'vs-glass pn' }, el('div', { class: 'sr', html: icon('search', 18) }, input), o.title ? el('div', { class: 'pk', text: o.title }) : null, ul));
    function paintList() {
      ul.innerHTML = '';
      if (!list.length) return ul.append(el('li', { class: 'none', text: 'No signal.' }));
      list.slice(0, 40).forEach((p, i) => ul.append(el('li', { class: i === on ? 'on' : '' }, el('button', { onclick: () => pick(p), onpointerenter: e => { if (e.pointerType === 'mouse') { on = i; mark(); } } },
        el('span', { class: 'hx', html: iconOrGlyph(p.meta.icon, 20) }), el('span', { class: 't' }, el('b', { text: p.meta.title || p.slug }), el('small', { text: p.meta.subtitle || p.meta.description || '' })), el('span', { class: 'sr2', text: p.sourceLabel })))));
    }
    const mark = () => { [...ul.children].forEach((li, i) => li.classList.toggle('on', i === on)); const c = ul.children[on]; c && c.scrollIntoView({ block: 'nearest' }); };
    function pick(p) { done(); o.onPick ? o.onPick(p.ref) : open(p.ref); }
    function done() { m.classList.remove('in'); setTimeout(() => m.remove(), 300); document.removeEventListener('keydown', key, true); }
    function key(e) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); done(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); on = Math.min(on + 1, Math.min(list.length, 40) - 1); mark(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); on = Math.max(on - 1, 0); mark(); }
      else if (e.key === 'Enter' && list[on]) { e.preventDefault(); pick(list[on]); }
    }
    input.addEventListener('input', () => { const q = input.value.trim().toLowerCase(); list = q ? pages.filter(p => [p.meta.title, p.meta.subtitle, p.meta.description, p.source, p.slug, ...(p.meta.tags || [])].join(' ').toLowerCase().includes(q)) : pages; on = 0; paintList(); });
    document.addEventListener('keydown', key, true); document.body.append(m); paintList();
    requestAnimationFrame(() => { m.classList.add('in'); input.focus({ preventScroll: true }); });
  }
  H.palette = palette;

  /* ================= VIEWER (hologram box, optional split) ================= */
  function pane(cls) {
    const f = el('iframe', { class: 'vs-frame', title: 'Viewscape page', allow: 'fullscreen; autoplay; clipboard-write', referrerpolicy: 'no-referrer-when-downgrade' }), t = el('span', { class: 'ttl' });
    return { f, t, ref: null, node: el('div', { class: 'vs-vpane ' + cls }, f, t, el('div', { class: 'vs-glassfx' })) };
  }
  function buildViewer() {
    A = pane('a'); B = pane('b');
    box = el('div', { class: 'vs-viewbox' }, el('i', { class: 'c tl' }), el('i', { class: 'c tr' }), el('i', { class: 'c bl' }), el('i', { class: 'c br' }),
      el('div', { class: 'vs-stage' }, A.node, B.node), el('div', { class: 'vs-beam' }));
    wrap = el('div', { class: 'vs-viewer', 'aria-hidden': 'true' }, el('div', { class: 'vs-backdrop', onclick: () => close() }), box);
    document.body.append(wrap); lb = VS.fx.loadbar(box);
    [A, B].forEach(P => P.f.addEventListener('load', () => { if (P.f.getAttribute('src')) { lb.done(); P.f.classList.add('live'); if (P === A) VS.status.set({ state: 'LINK STABLE' }); } }));
    addEventListener('message', e => {
      const d = e.data; if (!d || !d.vs) return;
      const P = e.source === A.f.contentWindow ? A : e.source === B.f.contentWindow ? B : null; if (!P) return;
      switch (d.vs) {
        case 'open': return P === B ? openSplit(d.ref) : open(d.ref);
        case 'close': if (P === B) return closeSplit(); if (isSplit()) { const r = B.ref; closeSplit(); return open(r); } return close();
        case 'ready': if (d.title) { P.t.textContent = d.title; if (P === A) VS.status.set({ title: d.title, state: 'LINK STABLE' }); } lb.done(); P.f.classList.add('live'); return;
        case 'fullscreen': return VS.full.toggle();
        case 'split': return palette({ title: 'Open beside', onPick: openSplit });
        case 'popout': return VS.win.popout(d.ref || P.ref, { otherScreen: d.otherScreen });
        case 'cast': return VS.win.cast(d.ref || P.ref);
      }
    });
  }
  const isSplit = () => box.classList.contains('split');
  function open(ref, { push = true } = {}) {
    const pg = reg.pages.find(p => p.ref === ref);
    if (!pg) { VS.fx.toast('No such page: ' + ref, 'zap'); return; }
    const same = A.ref === ref && viewing; A.ref = ref; viewing = true;
    A.t.textContent = pg.meta.title || pg.slug; box.dataset.accent = pg.meta.accent || 'magenta';
    VS.status.set({ title: pg.meta.title || pg.slug, state: 'LINKING' });
    wrap.classList.add('on'); wrap.setAttribute('aria-hidden', 'false'); html().classList.add('vs-viewing');
    if (wheel) wheel.el.classList.add('is-hidden');
    if (!same) {
      A.f.classList.remove('live'); box.classList.remove('swap'); void box.offsetWidth; box.classList.add('swap'); lb.start();
      A.f.src = `${VS.pagesRoot}${pg.ref}/${pg.entry}`;
    }
    if (push && location.hash !== '#/' + ref) history.pushState(null, '', '#/' + ref);
  }
  function openSplit(ref) {
    const pg = reg.pages.find(p => p.ref === ref); if (!pg) return;
    B.ref = ref; B.t.textContent = pg.meta.title || pg.slug; B.f.classList.remove('live'); lb.start();
    B.f.src = `${VS.pagesRoot}${pg.ref}/${pg.entry}?lite=1`; box.classList.add('split'); VS.haptic(12);
  }
  function closeSplit() { B.f.removeAttribute('src'); B.f.classList.remove('live'); B.ref = null; box.classList.remove('split'); }
  function close({ push = true } = {}) {
    if (!viewing) return; viewing = false; A.ref = null; closeSplit();
    wrap.classList.remove('on'); wrap.setAttribute('aria-hidden', 'true'); html().classList.remove('vs-viewing');
    VS.status.set({ title: 'FIELD', state: '' });
    if (wheel) wheel.el.classList.remove('is-hidden');
    setTimeout(() => { if (!viewing) { A.f.removeAttribute('src'); A.f.classList.remove('live'); } }, 600);
    if (push && location.hash) history.pushState(null, '', location.pathname + location.search);
    if (document.fullscreenElement && !VS.full.installed()) { /* keep app fullscreen when going home */ }
  }
  function route() { const m = location.hash.match(/^#\/([a-z0-9-]+\/[a-z0-9-]+)$/); if (m) open(m[1], { push: false }); else close({ push: false }); }
  VS.nav.open = ref => open(ref); VS.nav.home = () => close();
  H.open = open; H.close = close;

  /* ================= WHEEL (all navigation lives here) ================= */
  function buildWheel() {
    const visible = reg.pages.filter(p => !p.hidden), sys = ref => reg.pages.some(p => p.ref === ref);
    const srcSlots = [{ id: 'all', label: 'All', icon: 'grid', onSelect: () => setSource('all') }, ...reg.sources.filter(s => visible.some(p => p.source === s.id)).map(s => ({ id: s.id, label: s.label || s.id, icon: s.icon || 'layers', hint: visible.filter(p => p.source === s.id).length + ' pages', onSelect: () => setSource(s.id) }))];
    const page = (id, label, ic, ref, hint) => ({ id, label, icon: ic, hint, onSelect: () => (sys(ref) ? open(ref) : VS.fx.toast('Page missing: ' + ref, 'zap')) });
    const display = VS.wheel.display();
    display.children.push({ ...VS.wheel.accentSlot(), onSelect: () => { VS.accent.cycle(); VS.store.set('homeAccent', VS.accent.get()); VS.win.accent(VS.accent.get()); } });
    wheel = VS.wheel.create({
      title: 'Viewscape', slots: [
        { id: 'search', label: 'Search', icon: 'search', hint: 'press /', onSelect: () => palette() },
        { id: 'sources', label: 'Sources', icon: 'filter', hint: 'filter field', children: srcSlots },
        { id: 'random', label: 'Random', icon: 'shuffle', hint: 'surprise me', onSelect: () => { const v = visible.filter(p => p.source !== 'sys'); if (v.length) open(v[Math.floor(Math.random() * v.length)].ref); } },
        page('studio', 'Studio', 'settings', 'sys/studio', 'paste · preview'),
        page('about', 'About', 'info', 'sys/about', 'how it works'),
        page('github', 'GitHub', 'github', 'sys/repo', 'this project'),
        {
          id: 'window', label: 'Window', icon: 'columns', hint: () => VS.win.count() > 1 ? VS.win.count() + ' windows' : 'full · new', children: [
            { id: 'fs', label: 'Fullscreen', icon: 'expand', hint: 'key F', onSelect: () => VS.full.toggle() },
            { id: 'new', label: 'New window', icon: 'external', hint: 'second view', onSelect: () => VS.win.newWindow() },
            { id: 'scr', label: 'Other screen', icon: 'cast', hint: window.getScreenDetails ? 'multi-monitor' : 'unsupported', onSelect: () => (window.getScreenDetails ? VS.win.popout(null, { otherScreen: true }) : VS.fx.toast('Your browser can’t target screens — using a normal window', 'cast') || VS.win.newWindow()) },
            { id: 'inst', label: 'Install', icon: 'download', hint: () => VS.full.installed() ? 'installed' : (VS.install.available() ? 'ready' : 'via browser menu'), onSelect: () => VS.install.prompt() }
          ]
        },
        display
      ]
    });
  }

  VS.ready(boot);
})();
