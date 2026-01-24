/// <reference lib="webworker" />

const CACHE_NAME = 'fresta-v1';
// Detecta se está rodando no GitHub Pages (path /fresta/) ou Localhost
const BASE_PATH = self.location.pathname.startsWith('/fresta') ? '/fresta' : '';

const OFFLINE_URL = `${BASE_PATH}/offline.html`;

// Assets to cache on install
const PRECACHE_ASSETS = [
    `${BASE_PATH}/`,
    `${BASE_PATH}/index.html`,
    `${BASE_PATH}/manifest.json`
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Pre-caching assets');
            return cache.addAll(PRECACHE_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip API calls and external resources
    if (event.request.url.includes('/rest/v1/') ||
        event.request.url.includes('supabase.co') ||
        !event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Clone and cache successful responses
                if (response.ok) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                }
                return response;
            })
            .catch(() => {
                // Fallback to cache
                return caches.match(event.request).then((cached) => {
                    return cached || caches.match(OFFLINE_URL);
                });
            })
    );
});

// Push notification event
self.addEventListener('push', (event) => {
    console.log('[SW] Push received:', event);

    let data = { title: 'Fresta', body: 'Uma porta está pronta para abrir! 🎉' };

    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data.body = event.data.text();
        }
    }

    const options = {
        body: data.body,
        icon: '/fresta/icon-192.png',
        badge: '/fresta/icon-192.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/fresta/',
            dateOfArrival: Date.now()
        },
        actions: [
            { action: 'open', title: 'Abrir Surpresa 🎁' },
            { action: 'close', title: 'Depois' }
        ],
        tag: data.tag || 'fresta-notification',
        renotify: true
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked:', event.action);

    event.notification.close();

    if (event.action === 'close') return;

    const urlToOpen = event.notification.data?.url || '/fresta/';

    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
            // Focus existing window if available
            for (const client of clients) {
                if (client.url.includes('/fresta/') && 'focus' in client) {
                    return client.focus();
                }
            }
            // Open new window
            return self.clients.openWindow(urlToOpen);
        })
    );
});
