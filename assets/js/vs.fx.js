/*!
 * Viewscape One — vs.fx.js
 * Holographic effects: particle field, tilt, reveal, count-up, typewriter, glitch, loadbar, ripple, ticker.
 */
(function () {
  'use strict';
  const VS = window.VS, { el, clamp } = VS;
  const FX = VS.fx = {};

  /* ---------- particle / holo-dust field ---------- */
  FX.particles = function (canvas, opts = {}) {
    const ctx = canvas.getContext('2d'), H = document.documentElement.classList;
    const colors = opts.colors || ['255,43,214', '155,107,255', '46,242,224', '159,216,255', '168,255,208', '255,42,85'];
    let w, h, dpr, parts = [], timer, raf, last = 0, mx = -1, my = -1, alive = true;
    const lite = () => H.contains('vs-lite');
    const count = () => clamp(Math.round(innerWidth * innerHeight / (lite() ? 60000 : VS.coarse ? 36000 : 24000)), 12, lite() ? 22 : 64);
    const paused = () => document.hidden || H.contains('vs-idle') || H.contains('vs-no-fx') || H.contains('vs-viewing');
    function resize() {
      dpr = Math.min(devicePixelRatio || 1, lite() ? 1 : 1.5);
      w = canvas.clientWidth; h = canvas.clientHeight; if (!w || !h) return;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      parts = Array.from({ length: count() }, () => spawn(true));
    }
    function spawn(anywhere) {
      const c = colors[(Math.random() * colors.length) | 0];
      return { x: Math.random() * w, y: anywhere ? Math.random() * h : h + 10, r: Math.random() * 1.8 + .4, v: Math.random() * .35 + .08, d: Math.random() * 6.28, c, a: Math.random() * .6 + .15, hex: Math.random() < .12 };
    }
    function hex(x, y, r) { ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = Math.PI / 3 * i; ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } ctx.closePath(); }
    function frame(t) {
      if (!alive) return;
      if (paused()) { ctx.clearRect(0, 0, w, h); timer = setTimeout(() => (raf = requestAnimationFrame(frame)), 600); return; }
      raf = requestAnimationFrame(frame);
      const gap = lite() || VS.coarse ? 33 : 16; if (t - last < gap) return; last = t;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.y -= p.v * (gap / 16); p.x += Math.sin(t / 1800 + p.d) * .25;
        if (mx >= 0) { const dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy; if (d2 < 14000) { p.x += dx / 60; p.y += dy / 60; } }
        if (p.y < -10) Object.assign(p, spawn(false));
        const tw = .6 + .4 * Math.sin(t / 500 + p.d);
        ctx.fillStyle = ctx.strokeStyle = `rgba(${p.c},${p.a * tw})`;
        if (p.hex) { hex(p.x, p.y, p.r * 4); ctx.lineWidth = .8; ctx.stroke(); }
        else { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill(); }
      }
      if (lite()) return;                    // connection lines only on capable devices
      ctx.lineWidth = .5;
      for (let i = 0; i < parts.length; i++) for (let j = i + 1; j < parts.length; j++) {
        const a = parts[i], b = parts[j], dx = a.x - b.x, dy = a.y - b.y, d = dx * dx + dy * dy;
        if (d < 9000) { ctx.strokeStyle = `rgba(${a.c},${(1 - d / 9000) * .14})`; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
    }
    let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 150); });
    if (!VS.coarse) addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
    VS.on('perf', resize);
    resize(); raf = requestAnimationFrame(frame);
    return { stop() { alive = false; cancelAnimationFrame(raf); clearTimeout(timer); } };
  };

  /* ---------- 3D tilt + glare for any element ---------- */
  FX.tilt = function (node, { max = 9, glare = true } = {}) {
    if (matchMedia('(hover: none)').matches || document.documentElement.classList.contains('vs-lite')) return;
    let g; if (glare) { g = el('i', { class: 'vs-glare' }); node.append(g); }
    node.addEventListener('pointermove', e => {
      if (document.documentElement.classList.contains('vs-reduce')) return;
      const r = node.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      node.style.setProperty('--rx', ((.5 - y) * max).toFixed(2) + 'deg');
      node.style.setProperty('--ry', ((x - .5) * max).toFixed(2) + 'deg');
      if (g) { g.style.setProperty('--gx', (x * 100) + '%'); g.style.setProperty('--gy', (y * 100) + '%'); }
    });
    node.addEventListener('pointerleave', () => { node.style.setProperty('--rx', '0deg'); node.style.setProperty('--ry', '0deg'); });
  };

  /* ---------- reveal on scroll ---------- */
  FX.reveal = function (root = document, sel = '[data-reveal]') {
    const items = [...root.querySelectorAll(sel)];
    if (!('IntersectionObserver' in window)) { items.forEach(n => n.classList.add('is-in')); return; }
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }), { threshold: .08, rootMargin: '0px 0px -6% 0px' });
    items.forEach((n, i) => { n.style.setProperty('--d', Math.min(i % 8, 7) * 55 + 'ms'); io.observe(n); });
  };

  /* ---------- count-up numbers ---------- */
  FX.countUp = function (node, to, { dur = 1400, dec = 0, prefix = '', suffix = '' } = {}) {
    const fmt = v => prefix + v.toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suffix;
    if (!isFinite(to) || document.documentElement.classList.contains('vs-reduce')) { node.textContent = fmt(+to || 0); return; }
    const t0 = performance.now();
    (function step(t) {
      const k = clamp((t - t0) / dur, 0, 1), e = 1 - Math.pow(1 - k, 4);
      node.textContent = fmt(to * e);
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  };

  /* ---------- typewriter ---------- */
  FX.type = async function (node, text, speed = 18) {
    node.textContent = '';
    if (document.documentElement.classList.contains('vs-reduce')) { node.textContent = text; return; }
    for (const ch of text) { node.textContent += ch; await VS.sleep(speed + Math.random() * speed); }
  };

  /* ---------- glitch text: <span class="vs-glitch" data-text="…"> ---------- */
  FX.glitch = node => { node.dataset.text = node.dataset.text || node.textContent; node.classList.add('vs-glitch'); };

  /* ---------- ripple ---------- */
  FX.ripple = function (root = document) {
    root.addEventListener('pointerdown', e => {
      const t = e.target.closest && e.target.closest('.vs-btn,.vs-chip,.vs-tile,.vs-card-link');
      if (!t) return;
      const r = t.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2;
      const n = el('span', { class: 'vs-ripple', style: { width: s + 'px', height: s + 'px', left: e.clientX - r.left - s / 2 + 'px', top: e.clientY - r.top - s / 2 + 'px' } });
      t.append(n); setTimeout(() => n.remove(), 700);
    });
  };

  /* ---------- loadbar ---------- */
  // Thin top bar: const lb = VS.fx.loadbar(); lb.set(.4); lb.done();
  FX.loadbar = function (host = document.body) {
    const bar = el('div', { class: 'vs-topbar' }, el('i'));
    host.append(bar); const i = bar.firstChild; let v = 0, timer;
    const api = {
      set(p) { v = clamp(p, 0, 1); i.style.transform = `scaleX(${v})`; bar.classList.add('on'); },
      start() { api.set(.08); clearInterval(timer); timer = setInterval(() => api.set(v + (1 - v) * .08), 160); },
      done() { clearInterval(timer); api.set(1); setTimeout(() => { bar.classList.remove('on'); setTimeout(() => api.set(0), 300); }, 260); }
    };
    return api;
  };

  /* ---------- scrolling ticker strip ---------- */
  FX.ticker = function (items) {
    const row = items.map(t => `<span>${VS.esc(t)}</span><b>✦</b>`).join('');
    return el('div', { class: 'vs-ticker', 'aria-hidden': 'true' }, el('div', { class: 'vs-ticker-track', html: row + row + row + row }));
  };

  /* ---------- ambient layers (grid floor, beams, scanlines, particles) ---------- */
  FX.ambient = function (host = document.body, { particles = true } = {}) {
    const wrap = el('div', { class: 'vs-ambient', 'aria-hidden': 'true' },
      el('div', { class: 'vs-orb vs-orb-a' }), el('div', { class: 'vs-orb vs-orb-b' }), el('div', { class: 'vs-orb vs-orb-c' }),
      el('div', { class: 'vs-floor' }), el('div', { class: 'vs-sweep' }));
    let cv;
    if (particles) { cv = el('canvas', { class: 'vs-particles' }); wrap.append(cv); }
    host.prepend(wrap, el('div', { class: 'vs-scan', 'aria-hidden': 'true' }), el('div', { class: 'vs-vignette', 'aria-hidden': 'true' }));
    if (cv) FX.particles(cv);
    return wrap;
  };

  /* ---------- toast ---------- */
  FX.toast = function (msg, icon = 'sparkle') {
    let box = document.querySelector('.vs-toasts'); if (!box) { box = el('div', { class: 'vs-toasts' }); document.body.append(box); }
    const t = el('div', { class: 'vs-toast vs-glass', html: VS.icon(icon, 18) + '<span>' + VS.esc(msg) + '</span>' });
    box.append(t); requestAnimationFrame(() => t.classList.add('in'));
    setTimeout(() => { t.classList.remove('in'); setTimeout(() => t.remove(), 400); }, 2400);
  };

  VS.ready(() => FX.ripple());
})();
