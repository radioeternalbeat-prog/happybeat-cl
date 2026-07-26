// Bump este numero de version en CADA despliegue que cambie index.html.
// Sirve como "cache-busting": un CACHE_NAME distinto obliga al Service
// Worker a considerar la instalacion como una actualizacion real.
const CACHE_NAME = 'happybeat-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      // No esperar a que se cierren todas las pestañas viejas: activar
      // la nueva version del Service Worker de inmediato.
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

// Estrategia "network-first": siempre intenta traer la version mas
// reciente del servidor. Si la red falla (sin conexion), recien ahi
// usa la copia en cache como respaldo. Esto evita que la app quede
// "atascada" mostrando una version vieja despues de un despliegue.
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
