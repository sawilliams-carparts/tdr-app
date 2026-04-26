// CarParts TDR Safety App — Service Worker
// Bump this version number every time you push an update to GitHub
const VERSION = '1.1.1';
const CACHE_NAME = 'tdr-app-' + VERSION;

// Files to cache on install
const PRECACHE = ['/', '/index.html'];

// Install — cache core files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

// Activate — clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch — serve from cache, fall back to network
self.addEventListener('fetch', event => {
  // Only handle same-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});

// Message — allow manual skipWaiting from app
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});
