const CACHE = 'hemmaredo-v4';
const FILES = ['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./contacts.html','./equipment.html','./assets/hemmaredo-landskap.webp','./assets/icon-192.png','./assets/icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('hemmaredo-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(fetch(event.request).then(response => {
    if (response.ok) { const cloned = response.clone(); caches.open(CACHE).then(c => c.put(event.request, cloned)); }
    return response;
  }).catch(() => caches.match(event.request).then(r => r || (event.request.mode === 'navigate' ? caches.match('./index.html') : Response.error()))));
});
