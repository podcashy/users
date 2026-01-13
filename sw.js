// sw.js
const CACHE_NAME = 'myshop-cache-v6';   // <-- Update this for every new release

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192x192.png',
  './icon-512x512.png',
];

/* ---------------------- INSTALL ---------------------- */
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force new service worker to activate immediately

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching new files');
      return cache.addAll(urlsToCache);
    })
  );
});

/* ---------------------- ACTIVATE ---------------------- */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          }
        })
      )
    )
  );

  clients.claim(); // Force all tabs/PWA windows to use the new service worker
});

/* ---------------------- FETCH ---------------------- */
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cacheResponse) => {
      return (
        cacheResponse ||
        fetch(event.request).then((networkResponse) => {
          return networkResponse;
        })
      );
    })
  );
});
