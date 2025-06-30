// در فایل service-worker.js
const CACHE_NAME = 'my-pwa-cache-v3'; // شماره نسخه رو به v3 یا هر عدد بالاتری تغییر بدید
const urlsToCache = [
    '/', // ریشه برنامه
    '/index.html', // فایل اصلی HTML
    '/manifest.json',
    '/offline.html',
    '/icons/android-icon-192x192.png', // آیکون PWA
    '/icons/android-icon-512x512.png', // آیکون PWA
    '/logo.png', // اگر لوگوی هدر شما logo.png و در ریشه هست
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request).then(response => {
      return response || caches.match('/offline.html');
    }))
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => Promise.all(
      cacheNames.map(cacheName => {
        if (!cacheWhitelist.includes(cacheName)) {
          return caches.delete(cacheName);
        }
      })
    ))
  );
});
