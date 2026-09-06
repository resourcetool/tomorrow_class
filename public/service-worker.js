/* eslint-disable no-restricted-globals */
// A small, hand-written service worker (no Workbox build step required).
// Strategy:
//  - App shell (index.html, manifest, icons) is precached on install.
//  - Navigation requests: network-first, falling back to the cached
//    shell when offline.
//  - Other same-origin GET requests (the hashed JS/CSS bundle, etc.):
//    stale-while-revalidate — serve from cache instantly if present,
//    and refresh the cache in the background from the network.
// Note: this does not attempt build-time precaching of hashed bundle
// filenames the way Workbox does; instead it caches whatever the app
// actually requests as it runs, which is enough for basic installability
// and offline use of a page the person has already opened once.

const CACHE_NAME = "tomorrows-class-v1";
const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // never intercept API calls to Groq etc.

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/index.html"))
    );
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(request).then((cached) => {
        const network = fetch(request)
          .then((response) => {
            if (response && response.status === 200) cache.put(request, response.clone());
            return response;
          })
          .catch(() => cached);
        return cached || network;
      })
    )
  );
});
