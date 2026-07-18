const CACHE_NAME = 'sholatku-cache-v1'
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/favicon.svg',
    'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap'
]

// Install Lifecycle Event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE)
        })
    )
    self.skipWaiting()
})

// Activate Lifecycle Event
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache)
                    }
                })
            )
        })
    )
    self.clients.claim()
})

// Intercept Fetch Requests Strategy
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url)

    // 1. Network-first strategy for API requests (Aladhan timings)
    if (url.hostname.includes('api.aladhan.com')) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    const responseClone = response.clone()
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone)
                    })
                    return response
                })
                .catch(() => {
                    // Fallback to cache if offline
                    return caches.match(event.request)
                })
        )
        return
    }

    // 2. Cache-first strategy for static assets, local fonts, and bundle scripts
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse
            }

            return fetch(event.request).then((networkResponse) => {
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse
                }

                // Cache newly fetched assets dynamically
                const responseToCache = networkResponse.clone()
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache)
                })

                return networkResponse
            })
        })
    )
})
