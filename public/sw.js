const CACHE_NAME = 'youna-v1';
const PRECACHE_URLS = [
  '/', '/index.html', '/favicon.svg', '/icon-192.png', '/icon-512.png', '/manifest.json',
  '/music/your-song.mp3',
  '/sounds/portal-explosion.mp3', '/sounds/gem-found.mp3', '/sounds/typewriter.mp3',
  '/sounds/pen-writing.mp3', '/sounds/star-catch.mp3',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone)).catch(() => {});
        }
        return response;
      }).catch(() => new Response('Connectez-vous a Internet pour charger.', { status: 503 }));
    })
  );
});
