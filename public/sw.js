const CACHE_NAME = 'youna-v3';
const PRECACHE_URLS = [
  '/', '/index.html', '/favicon.svg', '/icon-192.png', '/icon-512.png', '/manifest.json',
  '/music/your-song.mp3',
  '/sounds/portal-explosion.mp3', '/sounds/gem-found.mp3', '/sounds/typewriter.mp3',
  '/sounds/pen-writing.mp3', '/sounds/star-catch.mp3',
];

const MEDIA_EXTS = /\.(png|jpg|jpeg|gif|svg|webp|ico|mp3|wav|ogg|woff2?|ttf|otf)$/i;

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

  const url = new URL(event.request.url);

  if (MEDIA_EXTS.test(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        });
      })
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cached) => {
          return cached || new Response("Connectez-vous a Internet pour charger.", { status: 503 });
        });
      })
  );
});
