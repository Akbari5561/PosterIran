// service-worker.js

const CACHE_NAME = 'my-pwa-cache-v5'; // شماره نسخه جدیدتر
const urlsToCache = [
  '/', 
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/icons/android-icon-192x192.png',
  '/icons/android-icon-512x512.png',
  '/icons/logo.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js'
];

// نصب Service Worker و کش اولیه
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[Service Worker] Caching app shell and CDN files');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // فوراً فعال شود
});

// فعال‌سازی و پاک کردن کش‌های قدیمی
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => 
      Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
  self.clients.claim(); // کنترل همه کلاینت‌ها
});

// واکشی — استراتژی Stale-While-Revalidate
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request)
        .then(networkResponse => {
          // اگر پاسخ معتبر است، کش را آپدیت کن
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === 'basic'
          ) {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // اگر شبکه قطع بود و کش هم نبود، صفحه آفلاین را بده
          if (!cachedResponse) {
            return caches.match('/offline.html');
          }
        });

      return cachedResponse || fetchPromise;
    })
  );
});