// ── New Horizon Service Worker ────────────────────────────────
const CACHE_NAME = 'newhorizon-v1'
const STATIC_ASSETS = [
  '/',
  '/residences',
  '/contact',
  '/a-propos',
  '/aide',
  '/manifest.json',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png',
]

// Install : mise en cache des assets statiques
self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
})

// Activate : suppression des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Fetch : stratégie Network First → fallback cache
self.addEventListener('fetch', (event) => {
  // On ignore les requêtes non-GET et les requêtes API/externe
  if (event.request.method !== 'GET') return
  const url = new URL(event.request.url)
  if (url.pathname.startsWith('/api/')) return

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Mise en cache de la réponse fraîche
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
        }
        return response
      })
      .catch(() => {
        // Réseau indisponible → on sert depuis le cache
        return caches.match(event.request).then((cached) => {
          if (cached) return cached
          // Fallback sur la homepage si la page n'est pas en cache
          if (event.request.destination === 'document') {
            return caches.match('/')
          }
        })
      })
  )
})
