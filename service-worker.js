// هر بار تغییر دادید، عدد نسخه را بالا ببرید (مثلاً v2 ، v1.1 و ...)
const CACHE_NAME = 'poster-iran-v4.4';
const assetsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
];

// مرحله نصب: ذخیره فایل‌ها در حافظه گوشی
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => {
      return cache.addAll(assetsToCache);
    })
  );
});
// مرحله فعال‌سازی: پاکسازی کش‌های قدیمی
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
// مرحله دریافت درخواست: اول از کش بخوان، اگر نبود از اینترنت
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
    .then(response => {
      return response || fetch(event.request);
    })
  );
});