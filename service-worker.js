const CACHE_NAME = 'poster-iran-cache-v3';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  'https://akbari5561.github.io/PosterIran/icons/logo.png',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// نصب سرویس‌ورکر به صورت کاملاً ایمن و مقاوم در برابر خطای کش مطالب کاتالوگ و استایل‌ها
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // استفاده از روش انفرادی برای جلوگیری از خرابی کل فرآیند نصب در صورت لود نشدن یک فایل خاص
      return Promise.allSettled(
        urlsToCache.map(url => {
          return cache.add(url).catch(err => {
            console.warn('کش کردن آدرس زیر با خطا مواجه شد ولی نصب ادامه می‌یابد:', url, err);
          });
        })
      );
    }).then(() => self.skipWaiting())
  );
});

// فعال‌سازی و پاکسازی کش‌های قدیمی در وب‌اپلیکیشن جهت دریافت آخرین بروزرسانی کاتالوگ
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('در حال حذف کش قدیمی:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// مدیریت آفلاین درخواست‌ها و پشتیبانی از لود سریع‌تر صفحات
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});