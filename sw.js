/* Viewscape One — service worker. Network-first (so your pushes show up immediately),
   cached fallback (so it opens offline), no media/range caching (saves device storage). */
const VERSION = 'vs-1.1.0';
const CORE = ['./', 'index.html', 'manifest.webmanifest', 'viewscape.config.json',
  'assets/css/theme.css', 'assets/css/glass.css', 'assets/css/holo.css', 'assets/css/wheel.css', 'assets/css/blocks.css', 'assets/css/home.css',
  'assets/js/vs.validate.js', 'assets/js/vs.core.js', 'assets/js/vs.sys.js', 'assets/js/vs.fx.js', 'assets/js/vs.blocks.js', 'assets/js/vs.wheel.js', 'assets/js/vs.page.js', 'assets/js/vs.home.js',
  'assets/icons/icon-192.png'];
const MEDIA = /\.(mp4|webm|mov|mp3|wav|ogg|m4a|zip|pdf)(\?|$)/i;

self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE).catch(() => { })).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });

self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || r.headers.has('range') || MEDIA.test(u.pathname)) return;
  if (/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)) {                 // fonts: stale-while-revalidate
    e.respondWith(caches.open(VERSION).then(async c => { const hit = await c.match(r); const net = fetch(r).then(x => { if (x.ok) c.put(r, x.clone()); return x; }).catch(() => hit); return hit || net; }));
    return;
  }
  if (u.origin !== location.origin) return;                                   // never touch other origins (GitHub API etc.)
  e.respondWith((async () => {
    const c = await caches.open(VERSION);
    try {
      const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 4500);
      const res = await fetch(r, { signal: ctl.signal, cache: 'no-cache' }); clearTimeout(t);
      if (res.status === 200 && res.type === 'basic') c.put(r, res.clone());
      return res;
    } catch {
      return (await c.match(r)) || (r.mode === 'navigate' ? await c.match('index.html') : Response.error());
    }
  })());
});
