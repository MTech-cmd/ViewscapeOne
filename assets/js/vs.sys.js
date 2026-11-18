/*!
 * Viewscape One — vs.sys.js  (load right after vs.core.js)
 * System layer: performance profile, idle pause, statusbar, fullscreen / install (PWA),
 * wake-lock, multi-window (BroadcastChannel + pop-out + cast), haptics.
 */
(function () {
  'use strict';
  const VS = window.VS; if (!VS) return;
  const { el, icon } = VS, html = document.documentElement, doc = document, nav = navigator;
  const embedded = VS.nav.embedded, q = new URLSearchParams(location.search);
  const coarse = matchMedia('(pointer: coarse)').matches;
  VS.coarse = coarse;

  /* ---------- haptics ---------- */
  VS.haptic = (ms = 8) => { if (VS.prefs.get('haptic') !== false && nav.vibrate) { try { nav.vibrate(ms); } catch { } } };

  /* ---------- performance profile: 'lite' trims blur, floor, orbs, scanlines, particles ---------- */
  const conn = nav.connection || {};
  const lowEnd = (nav.hardwareConcurrency || 8) <= 4 || (nav.deviceMemory || 8) <= 2 || !!conn.saveData;
  let bat = null;
  const P = VS.perf = {
    level: 'high', lowEnd, coarse,
    evaluate() {
      const mode = VS.prefs.get('perf');
      const lite = mode === 'lite' || (mode === 'auto' && (lowEnd || q.has('lite') || (bat && bat.level < .2 && !bat.charging)));
      html.classList.toggle('vs-lite', !!lite); const was = P.level; P.level = lite ? 'lite' : 'high';
      if (was !== P.level) VS.emit('perf', P.level);
    }
  };
  P.evaluate();
  VS.on('prefs', e => { if (e.k === 'perf') P.evaluate(); if (e.k === 'awake') wake(); });
  addEventListener('storage', e => { if (e.key === 'vs.pref.perf') P.evaluate(); });
  if (nav.getBattery) nav.getBattery().then(b => { bat = b; const f = () => { P.evaluate(); VS.emit('battery', b); }; b.addEventListener('levelchange', f); b.addEventListener('chargingchange', f); f(); }).catch(() => { });

  /* ---------- idle / hidden → pause ambient work ---------- */
  let idleT; const poke = () => { if (html.classList.contains('vs-idle')) { html.classList.remove('vs-idle'); VS.emit('idle', false); } clearTimeout(idleT); idleT = setTimeout(() => { html.classList.add('vs-idle'); VS.emit('idle', true); }, 45000); };
  ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart', 'scroll'].forEach(t => addEventListener(t, poke, { passive: true, capture: true })); poke();
  doc.addEventListener('visibilitychange', () => html.classList.toggle('vs-hidden', doc.hidden));

  /* ---------- fullscreen + install ---------- */
  const fsEl = () => doc.fullscreenElement || doc.webkitFullscreenElement;
  const standalone = () => matchMedia('(display-mode: fullscreen)').matches || matchMedia('(display-mode: standalone)').matches || nav.standalone === true;
  const canFS = !!(html.requestFullscreen || html.webkitRequestFullscreen);
  const isIOS = /iP(hone|ad|od)/.test(nav.userAgent) || (nav.platform === 'MacIntel' && nav.maxTouchPoints > 1);
  VS.full = {
    supported: canFS, installed: standalone,
    is: () => !!fsEl() || matchMedia('(display-mode: fullscreen)').matches,
    async toggle() {
      if (embedded) return parent.postMessage({ vs: 'fullscreen' }, '*');
      if (fsEl()) return (doc.exitFullscreen || doc.webkitExitFullscreen).call(doc);
      if (canFS) { try { await (html.requestFullscreen || html.webkitRequestFullscreen).call(html, { navigationUI: 'hide' }); } catch { VS.fx.toast('Fullscreen was blocked', 'zap'); } return; }
      VS.fx.toast(standalone() ? 'Already running as an app' : 'iPhone: Share ▸ Add to Home Screen for fullscreen', 'expand');
    }
  };
  VS.nav.fullscreen = () => VS.full.toggle();
  ['fullscreenchange', 'webkitfullscreenchange'].forEach(t => doc.addEventListener(t, () => { html.classList.toggle('vs-fs', !!fsEl()); VS.emit('fs', !!fsEl()); }));
  let dp = null;
  addEventListener('beforeinstallprompt', e => { e.preventDefault(); dp = e; VS.emit('install', true); });
  addEventListener('appinstalled', () => { dp = null; VS.emit('install', false); });
  VS.install = {
    available: () => !!dp && !standalone(),
    async prompt() {
      if (!dp) return VS.fx.toast(isIOS ? 'Share ▸ Add to Home Screen' : 'Browser menu ▸ Install app', 'download');
      dp.prompt(); try { await dp.userChoice; } catch { } dp = null; VS.emit('install', false);
    }
  };

  /* ---------- wake lock (opt-in) ---------- */
  let wl = null; VS.wakeSupported = 'wakeLock' in nav;
  async function wake() {
    try {
      if (VS.prefs.get('awake') && VS.wakeSupported && !wl && !doc.hidden) { wl = await nav.wakeLock.request('screen'); wl.addEventListener('release', () => { wl = null; }); }
      else if (!VS.prefs.get('awake') && wl) { await wl.release(); wl = null; }
    } catch { }
  }
  doc.addEventListener('visibilitychange', () => { if (!doc.hidden) wake(); }); wake();

  /* ---------- multi-window ---------- */
  const id = Math.random().toString(36).slice(2, 8), peers = new Set([id]); let ch = null;
  const post = m => { try { ch && ch.postMessage({ ...m, from: id }); } catch { } };
  if (!embedded && 'BroadcastChannel' in window) {
    ch = new BroadcastChannel('viewscape-one');
    ch.onmessage = e => {
      const m = e.data; if (!m || m.from === id) return;
      if (m.t === 'hello') { peers.add(m.from); post({ t: 'hi' }); }
      else if (m.t === 'hi') peers.add(m.from);
      else if (m.t === 'bye') peers.delete(m.from);
      else if (m.t === 'open' && (!m.to || m.to === '*' || m.to === id)) VS.emit('win:open', m);
      else if (m.t === 'accent') VS.emit('win:accent', m.v);
      VS.emit('win:peers', peers.size);
    };
    post({ t: 'hello' }); addEventListener('pagehide', () => post({ t: 'bye' }));
  }
  VS.win = {
    id, count: () => peers.size, accent: v => post({ t: 'accent', v }),
    cast(ref) {
      if (embedded) return parent.postMessage({ vs: 'cast', ref }, '*');
      if (peers.size < 2) return VS.fx.toast('Open a second Viewscape window first', 'cast');
      post({ t: 'open', ref }); VS.fx.toast(`Cast to ${peers.size - 1} window${peers.size > 2 ? 's' : ''}`, 'cast');
    },
    async popout(ref, { otherScreen = false } = {}) {
      if (embedded) return parent.postMessage({ vs: 'popout', ref, otherScreen }, '*');
      const url = ref ? VS.pageUrl(ref) + '?solo=1' : VS.root + 'index.html';
      let f = 'popup=yes,width=1100,height=760';
      if (otherScreen && window.getScreenDetails) { try { const d = await getScreenDetails(), s = d.screens.find(x => x !== d.currentScreen) || d.currentScreen; f = `popup=yes,left=${s.availLeft},top=${s.availTop},width=${s.availWidth},height=${s.availHeight}`; } catch { } }
      if (!window.open(url, 'vs_' + (ref || 'home').replace('/', '_'), f)) VS.fx.toast('Pop-up blocked — allow pop-ups for this site', 'zap');
    },
    newWindow() { VS.win.popout(null); }
  };

  /* ---------- statusbar ---------- */
  const MARK = '<svg viewBox="0 0 40 40"><path d="M20 3l15 9v16l-15 9L5 28V12z"/><path d="M20 12l7 4v8l-7 4-7-4v-8z"/><circle cx="20" cy="20" r="2"/></svg>';
  const S = VS.status = {
    el: null,
    mount(o = {}) {
      if (embedded || S.el || q.has('chromeless')) return S.el;
      const t = el('span', { class: 'sb-title', text: o.title || '' }), st = el('span', { class: 'sb-state', text: o.state || '' });
      const win = el('span', { class: 'sb-chip win', hidden: '' }), net = el('span', { class: 'sb-chip net' }), batc = el('span', { class: 'sb-chip bat', hidden: '' });
      const clock = el('time', { class: 'sb-clock' });
      const ins = el('button', { class: 'sb-btn', title: 'Install app', 'aria-label': 'Install app', hidden: '', html: icon('download', 16), onclick: () => VS.install.prompt() });
      const fs = el('button', { class: 'sb-btn fs', title: 'Fullscreen (F)', 'aria-label': 'Toggle fullscreen', html: icon('expand', 16), onclick: () => VS.full.toggle() });
      S.el = el('header', { class: 'vs-status', role: 'banner' },
        el('a', { class: 'sb-l', href: VS.root + 'index.html', 'aria-label': 'Viewscape One home' }, el('span', { class: 'sb-mark', html: MARK }), el('b', { class: 'sb-brand', html: 'VIEWSCAPE<i>ONE</i>' })),
        el('div', { class: 'sb-c' }, t, st),
        el('div', { class: 'sb-r' }, win, net, batc, clock, ins, fs));
      doc.body.prepend(S.el); html.classList.add('has-status');
      S.t = t; S.st = st;
      const tick = () => { if (!doc.hidden) clock.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); };
      tick(); setInterval(tick, 15000);
      const netf = () => { const on = nav.onLine; net.className = 'sb-chip net ' + (on ? 'on' : 'off'); net.textContent = on ? (conn.effectiveType ? conn.effectiveType.toUpperCase() : 'ONLINE') : 'OFFLINE'; };
      netf(); addEventListener('online', netf); addEventListener('offline', netf);
      const batf = b => { if (!b) return; batc.hidden = false; batc.innerHTML = icon('battery', 14) + Math.round(b.level * 100) + '%' + (b.charging ? ' ⚡' : ''); batc.classList.toggle('low', b.level < .2 && !b.charging); };
      if (bat) batf(bat); VS.on('battery', batf);
      const winf = () => { const n = VS.win.count(); win.hidden = n < 2; win.innerHTML = icon('columns', 14) + n; }; winf(); VS.on('win:peers', winf);
      const insf = () => { ins.hidden = !VS.install.available(); }; insf(); VS.on('install', insf);
      const fsf = on => fs.classList.toggle('on', !!on); VS.on('fs', fsf);
      VS.on('perf', l => S.el.classList.toggle('lite', l === 'lite')); S.el.classList.toggle('lite', P.level === 'lite');
      return S.el;
    },
    set(o) { if (!S.el) return; if (o.title != null) S.t.textContent = o.title; if (o.state != null) { S.st.textContent = o.state; S.st.classList.toggle('on', !!o.state); } }
  };

  /* ---------- global shortcuts ---------- */
  addEventListener('keydown', e => {
    const t = e.target; if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'f' || e.key === 'F') { e.preventDefault(); VS.full.toggle(); }
  });
})();
