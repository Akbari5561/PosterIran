const CACHE_NAME = 'poster-iran-cache-v4.1'; // نام کش را برای اعمال سریع تغییرات ارتقا دادیم
const urlsToCache = [
  './index.html',
  './manifest.json',
  './icon/icon-192x192.png',
  './icon/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // استفاده ازaddAll برای فایلهای حیاتی اپلیکیشن
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', (event) => {
  // پاکسازی کش‌های قدیمی در صورت ارتقای نسخه
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('🧹 در حال پاکسازی کش قدیمی:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});