// Get UID from URL query string
function getUid() {
  try {
    const urlParams = new URL(self.location.href).searchParams;
    return urlParams.get('uid') || 'default';
  } catch (e) {
    return 'default';
  }
}

const UID = getUid();
const CACHE_NAME = `myshop-cache-${UID}-v1`; // UID-specific cache

const urlsToCache = [
  './',
  './index.html',
  './icon-192x192.png',
  './icon-512x512.png',
  // no static manifest, each PWA gets dynamic manifest via Netlify function
];

/* ---------------------- INSTALL ---------------------- */
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching files for UID:', UID);
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
  clients.claim();
});

/* ---------------------- FETCH ---------------------- */
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cacheResponse) => {
      return cacheResponse || fetch(event.request);
    })
  );
});

