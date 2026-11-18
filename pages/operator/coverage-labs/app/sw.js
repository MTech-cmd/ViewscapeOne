const CACHE='coverage-labs-v0143-public-v1';
const SCOPE=new URL(self.registration.scope);
const MANIFEST=new URL('precache-manifest.json',SCOPE).pathname;
const INDEX=new URL('index.html',SCOPE).pathname;
const scopedPath=p=>new URL(String(p).replace(/^\/+/,''),SCOPE).pathname;
self.addEventListener('install',event=>event.waitUntil((async()=>{const c=await caches.open(CACHE);const r=await fetch(MANIFEST);if(!r.ok)throw new Error('Offline manifest unavailable');const paths=await r.json();const urls=paths.map(scopedPath);await c.addAll(urls);await c.add(MANIFEST);await self.skipWaiting()})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith('coverage-labs-')&&k!==CACHE)await caches.delete(k);await self.clients.claim()})()));
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET'||new URL(req.url).origin!==location.origin)return;event.respondWith((async()=>{const cache=await caches.open(CACHE);const hit=await cache.match(req);if(hit)return hit;try{const response=await fetch(req);if(response.ok&&response.type==='basic')cache.put(req,response.clone());return response}catch(e){if(req.mode==='navigate')return (await cache.match(INDEX))||Response.error();return Response.error()}})())});
