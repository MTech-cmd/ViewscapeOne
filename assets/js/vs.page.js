/*!
 * Viewscape One — vs.page.js
 * Boots a page: loads page.json → renders hero + sections + blocks, mounts ambience, loader and the wheel.
 *
 *  Data page   : <body data-vs-page>          (page.json drives everything)
 *  Custom page : <body data-vs-page data-vs-mode="custom">  (your own HTML/CSS/JS; gets wheel + ambience)
 *  Manual      : VS.mount({ title, accent, wheel:{extras:[…]} })
 */
(function () {
  'use strict';
  const VS = window.VS, { el, esc, icon, $ } = VS;
  const base = new URL('./', location.href).href;
  const P = VS.page = { base };

  /* ---------- wheel helpers shared with home ---------- */
  VS.wheel.display = () => ({
    id: 'display', label: 'Display', icon: 'eye', hint: 'fx · scan · motion', children: [
      { id: 'fx', label: 'Particles', icon: 'sparkle', keepOpen: true, hint: () => VS.prefs.get('fx') ? 'ON' : 'OFF', onSelect: () => VS.prefs.toggle('fx') },
      { id: 'scan', label: 'Scanlines', icon: 'wave', keepOpen: true, hint: () => VS.prefs.get('scan') ? 'ON' : 'OFF', onSelect: () => VS.prefs.toggle('scan') },
      { id: 'motion', label: 'Motion', icon: 'zap', keepOpen: true, hint: () => VS.prefs.get('motion') ? 'ON' : 'OFF', onSelect: () => VS.prefs.toggle('motion') }
    ]
  });
  VS.wheel.accentSlot = () => ({ id: 'accent', label: 'Colour', icon: 'palette', keepOpen: true, hint: () => VS.accent.get(), onSelect: () => VS.accent.cycle() });

  /* ---------- loader overlay ---------- */
  function loader(title) {
    const o = el('div', { class: 'vs-boot mini' },
      el('div', { class: 'vs-boot-core' }, el('div', { class: 'vs-boot-logo', html: '<span class="vs-glitch" data-text="VIEWSCAPE">VIEWSCAPE</span><b>ONE</b>' }),
        el('div', { class: 'vs-boot-sub', text: title ? 'loading · ' + title : 'loading' }), el('div', { class: 'vs-bar' }, el('i'))));
    document.body.append(o);
    const bar = o.querySelector('.vs-bar i'); let v = 0;
    const t = setInterval(() => { v += (1 - v) * .12; bar.style.transform = `scaleX(${v})`; }, 60);
    return async () => { clearInterval(t); bar.style.transform = 'scaleX(1)'; await VS.sleep(220); o.classList.add('out'); setTimeout(() => o.remove(), 700); };
  }

  function fail(err, url) {
    const file = location.protocol === 'file:';
    document.body.append(el('main', { class: 'vs-wrap' }, el('div', { class: 'vs-callout vs-tone-hot' },
      el('span', { class: 'ic', html: icon('zap', 20) }), el('div', {},
        el('b', { text: file ? 'Open this through a web server' : 'Could not load this page' }),
        el('p', { html: file ? 'Browsers block <code>fetch()</code> on <code>file://</code>. Run <code>node tools/vs.mjs serve</code> (or <code>python3 -m http.server</code>) in the project folder, or just push to GitHub Pages.' : esc(err.message) + '<br><small>' + esc(url || '') + '</small>' })))));
  }

  /* ---------- wheel construction ---------- */
  function buildWheel(meta, sections, ctx) {
    const extras = (meta.wheel && meta.wheel.extras || []).map(x => ({ id: x.id || x.label, label: x.label, icon: x.icon || 'star', hint: x.hint, onSelect: () => VS.wheel.runAction(x.action, { base }) }));
    const secSlots = [{ id: 'top', label: 'Top', icon: 'top', onSelect: () => scrollTo({ top: 0, behavior: 'smooth' }) },
      ...sections.map(s => ({ id: s.id, label: s.label, icon: s.icon || 'dot', onSelect: () => { const n = document.getElementById(s.id); n && n.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }))];
    const slots = [
      { id: 'home', label: 'Home', icon: 'home', hint: 'back to field', onSelect: () => VS.nav.home() },
      { id: 'sections', label: 'Sections', icon: 'list', hint: sections.length ? sections.length + ' sections' : 'jump', children: secSlots.length > 1 ? secSlots : null, onSelect: () => scrollTo({ top: 0, behavior: 'smooth' }) },
      { id: 'prev', label: 'Previous', icon: 'prev', hint: '—', onSelect: () => { } },
      { id: 'next', label: 'Next', icon: 'next', hint: '—', onSelect: () => { } },
      extras.length ? { id: 'extras', label: meta.wheel.label || 'Page', icon: 'star', hint: extras.length + ' actions', children: extras } : { id: 'top2', label: 'Top', icon: 'top', onSelect: () => scrollTo({ top: 0, behavior: 'smooth' }) },
      VS.wheel.accentSlot(),
      {
        id: 'share', label: 'Share', icon: 'link', hint: 'link · fullscreen', children: [
          { id: 'copy', label: 'Copy link', icon: 'copy', onSelect: () => { const u = ctx.ref ? location.href : location.href; navigator.clipboard && navigator.clipboard.writeText(u); VS.fx.toast('Link copied', 'link'); } },
          { id: 'tab', label: 'Open alone', icon: 'external', hint: 'new tab', onSelect: () => window.open(location.href, '_blank', 'noopener') },
          { id: 'fs', label: 'Fullscreen', icon: 'expand', onSelect: () => VS.nav.fullscreen() }
        ]
      },
      VS.wheel.display()
    ];
    const w = VS.wheel.create({ title: meta.title || 'Viewscape', slots });
    // prev / next from registry (lazy)
    VS.registry().then(reg => {
      const list = reg.pages.filter(p => !p.hidden); const i = list.findIndex(p => p.ref === ctx.ref);
      if (i < 0) return;
      const pv = list[(i - 1 + list.length) % list.length], nx = list[(i + 1) % list.length];
      slots[2] = { id: 'prev', label: 'Previous', icon: 'prev', hint: pv.meta.title, onSelect: () => VS.nav.open(pv.ref) };
      slots[3] = { id: 'next', label: 'Next', icon: 'next', hint: nx.meta.title, onSelect: () => VS.nav.open(nx.ref) };
      w.setSlots(slots); ctx.pager && ctx.pager(pv, nx, list.length);
    }).catch(() => { });
    return w;
  }

  /* ---------- derive ref (source/slug) from the URL ---------- */
  function refFromUrl() { const m = location.pathname.match(/\/pages\/([a-z0-9-]+)\/([a-z0-9-]+)\//); return m ? m[1] + '/' + m[2] : null; }

  /* ---------- main boot ---------- */
  P.boot = async function (opts = {}) {
    const html = document.documentElement, body = document.body;
    const custom = opts.custom ?? body.dataset.vsMode === 'custom';
    html.classList.add('vs-page'); if (VS.nav.embedded) html.classList.add('vs-embedded');
    const ref = refFromUrl(); const ctx = { ref };
    const jsonUrl = VS.resolve(base, body.dataset.vsJson || 'page.json');
    let meta = opts.meta || {};
    const done = VS.nav.embedded ? async () => { } : loader(document.title.split('·')[0].trim());
    if (!opts.meta) { try { meta = await VS.fetchJSON(jsonUrl, { cache: false }); } catch (e) { if (!custom) { await done(); return fail(e, jsonUrl); } } }
    VS.fx.ambient(body, { particles: true });
    VS.accent.set(meta.accent || body.dataset.vsAccent || 'magenta');
    document.title = (meta.title || document.title || 'Page') + ' · Viewscape One';
    const lb = VS.fx.loadbar(); lb.start();

    let sections = [];
    if (!custom) {
      const app = $('#vs-app') || body.appendChild(el('main', { id: 'vs-app' }));
      app.classList.add('vs-wrap');
      // topline
      if (!VS.nav.embedded) app.append(el('nav', { class: 'vs-crumbs' }, el('a', { href: VS.root + 'index.html', html: icon('home', 16) + '<span>VIEWSCAPE ONE</span>' }), el('i', { text: '/' }), el('span', { text: ref ? ref.split('/')[0] : 'page' }), el('i', { text: '/' }), el('b', { text: meta.title })));
      // hero
      if (meta.hero !== false) {
        const cover = meta.cover ? (/\.(mp4|webm)$/i.test(meta.cover) ? el('video', { src: VS.resolve(base, meta.cover), autoplay: '', muted: '', loop: '', playsinline: '' }) : el('img', { src: VS.resolve(base, meta.cover), alt: '' })) : null;
        if (cover && cover.tagName === 'VIDEO') cover.muted = true;
        app.append(el('header', { class: 'vs-pagehero' }, cover ? el('div', { class: 'cover' }, cover) : null,
          el('div', { class: 'in' },
            el('div', { class: 'vs-eyebrow', html: `${meta.icon && !VS.icons.includes(meta.icon) ? esc(meta.icon) + ' ' : '✦ '}${esc(meta.eyebrow || (ref ? ref.split('/')[0] : 'data page'))}` }),
            el('h1', { class: 'vs-title', 'data-text': meta.title }, meta.title || 'Untitled'),
            meta.subtitle ? el('p', { class: 'vs-sub', html: VS.md.inline(meta.subtitle, { base }) }) : null,
            meta.description ? el('p', { class: 'vs-desc', html: VS.md.inline(meta.description, { base }) }) : null,
            el('div', { class: 'vs-meta' },
              ...(meta.tags || []).map(t => el('span', { class: 'vs-tag', text: t })),
              meta.updated ? el('span', { class: 'vs-chip static', html: icon('zap', 14) + 'updated ' + esc(meta.updated) }) : null,
              meta.author ? el('span', { class: 'vs-chip static', html: icon(meta.author === 'ai' ? 'bot' : 'user', 14) + esc(meta.author) }) : null))));
      }
      // sections
      const secs = meta.sections || (meta.blocks ? [{ id: 'main', blocks: meta.blocks }] : []);
      await Promise.all(secs.map(async (s, i) => {
        const id = 'sec-' + (s.id || i + 1);
        const sec = el('section', { class: 'vs-section', id });
        if (s.title) sec.append(el('header', { class: 'vs-sechead', 'data-reveal': '' }, el('span', { class: 'idx', text: String(i + 1).padStart(2, '0') }), el('div', {}, el('h2', { text: s.title }), s.description ? el('p', { html: VS.md.inline(s.description, { base }) }) : null)));
        const inner = el('div', { class: 'vs-secbody' }); sec.append(inner);
        s._node = sec; s._inner = inner;
        sections[i] = { id, label: s.title || 'Section ' + (i + 1), icon: s.icon };
      }));
      secs.forEach(s => app.append(s._node));
      await Promise.all(secs.map(s => VS.blocks.render(s.blocks || [], s._inner, { base })));
      VS.fx.reveal(app, '.vs-sechead,.vs-pagehero');
      // pager (filled when registry arrives)
      const pager = el('footer', { class: 'vs-pager' }); app.append(pager, el('div', { class: 'vs-foot', html: '<span>◈ VIEWSCAPE ONE</span><span>' + esc(meta.footer || 'holographic data framework') + '</span>' }));
      ctx.pager = (pv, nx, n) => { if (n < 2) return; [['prev', pv], ['next', nx]].forEach(([d, p]) => pager.append(el('a', { class: 'vs-card vs-card-link ' + d, href: VS.pageUrl(p.ref), 'data-vs-page': p.ref, html: `<span class="dir">${d === 'prev' ? '◂ previous' : 'next ▸'}</span><b>${esc(p.meta.title)}</b><small>${esc(p.meta.subtitle || p.meta.description || '')}</small>` }))); };
    } else {
      // custom page: discover [data-vs-section]
      $$('[data-vs-section]').forEach((n, i) => { n.id = n.id || 'cs-' + i; sections.push({ id: n.id, label: n.dataset.vsSection || n.textContent.trim().slice(0, 18), icon: n.dataset.vsIcon }); });
      VS.fx.reveal(document, '[data-reveal]');
    }

    const wheel = buildWheel(meta, sections, ctx); P.wheel = wheel;
    // scroll progress
    const sp = el('div', { class: 'vs-scrollbar' }, el('i')); body.append(sp);
    const upd = () => { const h = document.documentElement; const m = h.scrollHeight - h.clientHeight; sp.firstChild.style.transform = `scaleX(${m > 0 ? h.scrollTop / m : 0})`; };
    addEventListener('scroll', upd, { passive: true }); upd();
    lb.done(); await done();
    if (location.hash && document.querySelector(location.hash)) document.querySelector(location.hash).scrollIntoView();
    if (VS.nav.embedded) parent.postMessage({ vs: 'ready', ref, title: meta.title, accent: VS.accent.get() }, '*');
    VS.emit('page:ready', { meta, sections });
    return { meta, wheel };
  };
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* manual mount for fully custom pages */
  VS.mount = opts => P.boot({ custom: true, meta: opts || {} });

  VS.ready(() => { if (document.body.hasAttribute('data-vs-page')) P.boot(); });
})();
