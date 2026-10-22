/* 发布静态资源更新时必须递增 VERSION。仅清理本应用缓存，不碰 localStorage。 */
const VERSION='v1.0.0';
const PREFIX='fit-calendar:'+self.registration.scope+':';
const CACHE=PREFIX+VERSION;
const ASSETS=['./','./index.html','./style.css','./core.js','./app.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png','./icons/icon-maskable-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;const base=new URL(self.registration.scope);const asset=ASSETS.find(path=>new URL(path,base).pathname===url.pathname);if(!asset&&event.request.mode!=='navigate')return;event.respondWith((async()=>{const cache=await caches.open(CACHE);const hit=await cache.match(new URL(asset||'./index.html',base).href);if(hit)return hit;return fetch(event.request);})());});
