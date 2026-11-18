/*!
 * Viewscape One — vs.wheel.js
 * GTA-style radial "weapon wheel" with liquid-glass finish. Lives on the right edge of every page.
 *
 *   const w = VS.wheel.create({ title:'Navigate', slots:[ {id,label,icon,hint,onSelect,children:[…],keepOpen} ] });
 *   Hold the orb, drag toward a wedge, release  — or tap the orb, then tap a wedge.
 *   Touch: swipe in from the right edge. Keys: W toggles, arrows/Enter, 1-8.
 *   Slots with `children` open a sub-wheel; >8 slots auto-collapse into "More". `hint` may be a function.
 *   The orb dims when idle, and its height (high / mid / low) is a pref so it sits in thumb reach.
 */
(function () {
  'use strict';
  const VS = window.VS, { el, esc, icon } = VS;
  const NS = 'http://www.w3.org/2000/svg', R1 = 86, R2 = 188, MR = (R1 + R2) / 2, rad = d => d * Math.PI / 180;
  const Y = { high: .36, mid: .5, low: .66 };

  const arc = (a0, a1, r1 = R1, r2 = R2) => {
    const p = (r, a) => [(r * Math.cos(rad(a))).toFixed(2), (r * Math.sin(rad(a))).toFixed(2)];
    const [x0, y0] = p(r2, a0), [x1, y1] = p(r2, a1), [x2, y2] = p(r1, a1), [x3, y3] = p(r1, a0), L = (a1 - a0) > 180 ? 1 : 0;
    return `M${x0},${y0} A${r2},${r2} 0 ${L} 1 ${x1},${y1} L${x2},${y2} A${r1},${r1} 0 ${L} 0 ${x3},${y3} Z`;
  };
  const fit = s => s.length <= 8 ? s : [...s.slice(0, 7), { id: '_more', label: 'More', icon: 'more', hint: (s.length - 7) + ' more', children: fit(s.slice(7)) }];

  function create(opts = {}) {
    let base = fit(opts.slots || []), stack = [{ title: opts.title || 'Viewscape', slots: base }], hot = -1, isOpen = false, down = null;
    let S = 360, M = 12, SAR = 0, CY = 0, dimT;
    const touch = navigator.maxTouchPoints > 0 || VS.coarse;
    const root = el('div', { class: 'vs-wheel', 'data-state': 'closed', role: 'navigation', 'aria-label': 'Radial navigation wheel' });
    const disc = el('div', { class: 'vs-wheel-disc' });
    const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '-200 -200 400 400'); svg.setAttribute('class', 'vs-wheel-svg');
    const cIco = el('div', { class: 'ico' }), cLb = el('div', { class: 'lb' }), cHt = el('div', { class: 'ht' });
    const core = el('div', { class: 'vs-wheel-core' }, cIco, cLb, cHt);
    const hub = el('button', { class: 'vs-wheel-hub', 'aria-label': 'Open wheel (hold and drag, or tap)', 'aria-expanded': 'false', html: `<span class="ring"></span><span class="ring r2"></span><span class="g">${glyph()}</span>` });
    const hint = el('div', { class: 'vs-wheel-hint vs-glass', html: touch ? 'swipe in from the edge<small>or tap the orb, then pick</small>' : 'hold · drag · release<small>or tap, then pick · key <kbd>W</kbd></small>' });
    const edge = touch ? el('div', { class: 'vs-wheel-edge', 'aria-hidden': 'true' }) : null;
    const probe = el('div', { style: { position: 'fixed', visibility: 'hidden', pointerEvents: 'none', paddingRight: 'env(safe-area-inset-right, 0px)', paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' } });
    root.append(disc, svg, core, hub, hint); if (edge) root.append(edge);
    (opts.parent || document.body).append(root, probe);

    function glyph() { return '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.6"/><path d="M12 3v4.4M12 16.6V21M3 12h4.4M16.6 12H21M5.6 5.6l3.1 3.1M15.3 15.3l3.1 3.1M18.4 5.6l-3.1 3.1M8.7 15.3l-3.1 3.1"/></svg>'; }

    /* geometry */
    function layout() {
      const cs = getComputedStyle(probe), sat = parseFloat(cs.paddingTop) || 0, sab = parseFloat(cs.paddingBottom) || 0;
      SAR = parseFloat(cs.paddingRight) || 0;
      S = Math.round(Math.min(392, innerWidth * .95, innerHeight * .86)); M = innerWidth < 520 ? 6 : 14;
      const sb = document.documentElement.classList.contains('has-status') ? 36 : 0;
      CY = Math.round(Math.min(Math.max(innerHeight * (Y[VS.prefs.get('wheelY')] || .5), S / 2 + sat + sb + 6), innerHeight - S / 2 - sab - 6));
      root.style.setProperty('--S', S + 'px'); root.style.setProperty('--M', M + 'px'); root.style.setProperty('--sar', SAR + 'px'); root.style.setProperty('--cy', CY + 'px');
    }
    const geo = () => ({ cx: innerWidth - SAR - M - S / 2, cy: CY, k: S / 400 });
    const cur = () => stack[stack.length - 1];
    function idxAt(x, y, generous) {
      const { cx, cy, k } = geo(), dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy) / k, n = cur().slots.length;
      if (d < R1 - 8 || d > R2 + (generous ? 420 : 24)) return -1;
      const a = (Math.atan2(dy, dx) * 180 / Math.PI + 90 + 360) % 360;
      return Math.round(a / (360 / n)) % n;
    }

    /* idle dimming of the orb */
    function bump() { root.classList.remove('dim'); clearTimeout(dimT); dimT = setTimeout(() => { if (!isOpen) root.classList.add('dim'); }, 3200); }

    /* render wedges */
    function render() {
      const { slots } = cur(), n = slots.length, step = 360 / n, gap = n > 1 ? 3.2 : 0;
      let h = '<circle class="rg g1" r="196"/><circle class="rg g2" r="76"/><circle class="rg g3" r="199"/>';
      for (let t = 0; t < 72; t++) { const a = rad(t * 5), l = t % 6 === 0 ? 7 : 3.5; h += `<line class="tk" x1="${(Math.cos(a) * 197).toFixed(1)}" y1="${(Math.sin(a) * 197).toFixed(1)}" x2="${(Math.cos(a) * (197 + l)).toFixed(1)}" y2="${(Math.sin(a) * (197 + l)).toFixed(1)}"/>`; }
      slots.forEach((s, i) => {
        const c = -90 + i * step, a0 = c - step / 2 + gap / 2, a1 = c + step / 2 - gap / 2, mx = Math.cos(rad(c)) * MR, my = Math.sin(rad(c)) * MR;
        const sx = Math.cos(rad(c)) * (R2 - 11), sy = Math.sin(rad(c)) * (R2 - 11);
        h += `<g class="seg${s.active ? ' act' : ''}" data-i="${i}" style="--i:${i}" role="button" tabindex="${isOpen ? 0 : -1}" aria-label="${esc(s.label)}">
          <path class="wd" d="${arc(a0, a1)}"/><path class="sh" d="${arc(a0 + 1, a1 - 1, R2 - 7, R2 - 2)}"/>
          <g class="gi" transform="translate(${mx.toFixed(1)},${my.toFixed(1)})">${VS.icon(s.icon || 'dot', 34).replace('<svg ', '<svg x="-17" y="-17" ')}</g>
          ${s.children ? `<circle class="sub" cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="3"/>` : ''}</g>`;
      });
      svg.innerHTML = h;
      svg.querySelectorAll('.seg').forEach(g => {
        const i = +g.dataset.i;
        g.addEventListener('pointerenter', e => { if (!down && e.pointerType !== 'touch') setHot(i); });
        g.addEventListener('pointerleave', e => { if (!down && e.pointerType !== 'touch' && hot === i) setHot(-1); });
        g.addEventListener('click', () => select(i));
        g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(i); } });
      });
      root.dataset.n = n; setHot(-1, true);
    }

    function setHot(i, silent) {
      if (i === hot && !silent) return;
      hot = i;
      svg.querySelectorAll('.seg').forEach((g, j) => g.classList.toggle('hot', j === i));
      const s = i >= 0 ? cur().slots[i] : null, lv = stack.length > 1;
      cIco.innerHTML = s ? VS.icon(s.icon || 'dot', 30) : (lv ? VS.icon('back', 28) : '');
      cLb.textContent = s ? s.label : cur().title;
      const hv = s && (typeof s.hint === 'function' ? s.hint() : s.hint);
      cHt.textContent = s ? (hv || (s.children ? 'open ▸' : '')) : (lv ? 'tap centre · back' : (touch ? 'slide to a wedge' : 'drag to a wedge'));
      root.classList.toggle('has-hot', !!s);
      if (s && !silent) VS.haptic && VS.haptic(6);
    }

    function open() { if (isOpen) return; layout(); isOpen = true; root.dataset.state = 'open'; root.classList.remove('dim'); hub.setAttribute('aria-expanded', 'true'); hint.classList.remove('on'); VS.store.set('wheelHinted', true); render(); VS.haptic && VS.haptic(10); VS.emit('wheel:open'); }
    function close() { if (!isOpen) return; isOpen = false; root.dataset.state = 'closed'; hub.setAttribute('aria-expanded', 'false'); setHot(-1, true); stack.length = 1; bump(); VS.emit('wheel:close'); }
    function swap() { root.classList.remove('swap'); void root.offsetWidth; root.classList.add('swap'); }
    function push(title, slots) { stack.push({ title, slots: fit(slots) }); swap(); render(); }
    function pop() { if (stack.length > 1) { stack.pop(); swap(); render(); } else close(); }
    function select(i) {
      const s = cur().slots[i]; if (!s) return;
      VS.haptic && VS.haptic(14);
      if (s.children && s.children.length) return push(s.label, s.children);
      if (!s.keepOpen) close();
      try { s.onSelect && s.onSelect(s); } catch (e) { console.error(e); }
      if (s.keepOpen && isOpen) setHot(hot, true);
    }

    /* pointer handling — shared by orb (press-hold-drag-release / tap) and edge strip (swipe in) */
    function begin(e, node, fromEdge) {
      e.preventDefault(); try { node.setPointerCapture(e.pointerId); } catch { }
      down = { x: e.clientX, y: e.clientY, t: performance.now(), was: isOpen, moved: false, edge: fromEdge };
      if (!fromEdge && !isOpen) open();
    }
    function move(e) {
      if (!down) return;
      const dx = e.clientX - down.x, dist = Math.hypot(dx, e.clientY - down.y);
      if (dist > 16) down.moved = true;
      if (down.edge && !isOpen && dx < -22) open();
      if (isOpen && (down.moved || !down.edge)) setHot(idxAt(e.clientX, e.clientY, true));
    }
    function up(e) {
      if (!down) return; const d = down; down = null;
      const i = idxAt(e.clientX, e.clientY, true);
      if (d.edge) { if (!isOpen) return open(); if (d.moved && i >= 0 && hot >= 0) select(i); return; }
      const held = d.moved || performance.now() - d.t > 380;
      if (d.was && !d.moved) return pop();
      if (held) { if (i >= 0) select(i); else if (stack.length > 1) setHot(-1, true); else close(); }
    }
    hub.addEventListener('pointerdown', e => begin(e, hub, false));
    hub.addEventListener('pointermove', move); hub.addEventListener('pointerup', up);
    hub.addEventListener('pointercancel', () => { down = null; });
    if (edge) { edge.addEventListener('pointerdown', e => begin(e, edge, true)); edge.addEventListener('pointermove', move); edge.addEventListener('pointerup', up); edge.addEventListener('pointercancel', () => { down = null; }); }
    hub.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); isOpen ? pop() : open(); } });
    hub.addEventListener('pointerenter', bump);
    document.addEventListener('pointerdown', e => { if (isOpen && !root.contains(e.target)) close(); if (!isOpen) bump(); }, true);
    let ly = scrollY; addEventListener('scroll', () => { const y = scrollY; if (y < ly - 4) bump(); else if (y > ly + 50 && !isOpen) root.classList.add('dim'); ly = y; }, { passive: true });
    document.addEventListener('keydown', e => {
      const t = e.target; if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (!isOpen) { if (e.key === 'w' || e.key === 'W') { e.preventDefault(); open(); } return; }
      const n = cur().slots.length;
      if (e.key === 'Escape' || e.key === 'w' || e.key === 'W') { e.preventDefault(); pop(); }
      else if (/^Arrow(Right|Down)$/.test(e.key)) { e.preventDefault(); setHot(hot < 0 ? 0 : (hot + 1) % n); }
      else if (/^Arrow(Left|Up)$/.test(e.key)) { e.preventDefault(); setHot(hot < 0 ? n - 1 : (hot - 1 + n) % n); }
      else if (e.key === 'Enter' && hot >= 0) { e.preventDefault(); select(hot); }
      else if (/^[1-8]$/.test(e.key) && +e.key <= n) { e.preventDefault(); select(+e.key - 1); }
    });
    let rt; const relayout = () => { clearTimeout(rt); rt = setTimeout(layout, 80); };
    addEventListener('resize', relayout); addEventListener('orientationchange', relayout);
    VS.on('prefs', e => { if (e.k === 'wheelY') layout(); });
    layout(); bump();
    if (!VS.store.get('wheelHinted', false)) setTimeout(() => { if (!isOpen) { hint.classList.add('on'); setTimeout(() => hint.classList.remove('on'), 6000); } }, 2600);

    return {
      el: root, open, close, pop, push, toggle: () => (isOpen ? close() : open()), relayout: layout,
      setSlots(slots, title) { base = fit(slots); stack = [{ title: title || stack[0].title, slots: base }]; if (isOpen) render(); },
      get isOpen() { return isOpen; }
    };
  }

  /* run a declarative action from JSON  (page.json → wheel.extras[].action) */
  function runAction(a = {}, ctx = {}) {
    switch (a.type) {
      case 'page': return VS.nav.open(a.ref || a.page);
      case 'link': return (location.href = VS.resolve(ctx.base || location.href, a.href));
      case 'url': return window.open(VS.safeUrl(a.href), '_blank', 'noopener');
      case 'scroll': { const n = document.querySelector(a.selector || '#' + a.id); if (n) n.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
      case 'copy': navigator.clipboard && navigator.clipboard.writeText(a.text || ''); return VS.fx.toast(a.message || 'Copied');
      case 'event': VS.emit(a.name, a.detail); return document.dispatchEvent(new CustomEvent(a.name, { detail: a.detail }));
      case 'call': return typeof window[a.fn] === 'function' && window[a.fn](a.arg);
      case 'accent': return VS.accent.set(a.value);
      default: console.warn('[viewscape] unknown wheel action', a);
    }
  }

  VS.wheel = { create, runAction };
})();
