// SW reads UID from scope
function getUidFromScope() {
  const scope = self.registration.scope;
  const match = scope.match(/\/app\/([^/]+)\//);
  return match ? match[1] : 'default';
}

const UID = getUidFromScope();
const CACHE_NAME = `myshop-cache-${UID}-v1`;

// Files to cache
const urlsToCache = [
  `/app/${UID}/`,
  `/app/${UID}/index.html`,
  `/icon-192x192.png`,
  `/icon-512x512.png`
];

// INSTALL
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Installing cache for UID:', UID);
      return cache.addAll(urlsToCache);
    })
  );
});

// ACTIVATE
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => 
      Promise.all(
        cacheNames.map(name => {
          // 🚫 Do not delete other UID caches
          if (!name.startsWith(`myshop-cache-${UID}-`)) return Promise.resolve();
        })
      )
    )
  );
  clients.claim();
});

// FETCH
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (!url.pathname.startsWith(`/app/${UID}/`)) return;

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});


