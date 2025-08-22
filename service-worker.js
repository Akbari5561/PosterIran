// service-worker.js

const CACHE_NAME = 'my-pwa-cache-v2.7'; // شماره نسخه جدیدتر
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html', // اگر فایل offline.html دارید
  
  // آیکون‌ها و تصاویر از فایل HTML
  '/icons/favicon.ico?v=1.0',
  '/icons/apple-touch-icon.png?v=1.0',
  '/icons/apple-touch-icon-152x152.png?v=1.0',
  '/icons/apple-touch-icon-180x180.png?v=1.0',
  '/icons/apple-touch-icon-167x167.png?v=1.0',
  '/icons/og-image.jpg?v=1.0',
  
  // آیکون‌های از پیش تعریف شده در سرویس ورکر قبلی شما (اگر هنوز استفاده می‌شوند)
  '/icons/android-icon-192x192.png',
  '/icons/android-icon-512x512.png',
  '/icons/logo.png', // اگر فایل logo.png دارید
  
  // فونت Vazirmatn که در CSS استفاده شده است
  'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap',
  
  // فایل‌های Firebase (اگر در برنامه شما استفاده می‌شوند)
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js',

  // مسیرهای نمونه برای پوشه تصاویر - باید با دقت تمامی تصاویر کلیدی شما اضافه شوند
  // توجه: افزودن تمامی تصاویر به صورت دستی ممکن است غیرعملی باشد اگر تعداد زیادی عکس دارید.
  // برای کش کردن تصاویر گالری، بهتر است استراتژی caching در رویداد fetch را برای /Image/ مسیرها به روز کنید
  // یا از Workbox استفاده کنید.
  // مثال:
  // '/Image/سایز ۲۹×۲۱ دوروچاپ/الفبای فارسی و انگلیسی.jpg',
  // '/Image/سایز ۲۹×۲۱ دوروچاپ/جدول تناوبی عناصر.jpg',
  // ...
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
  // از درخواست‌های غیر HTTP/HTTPS (مانند chrome-extension://) صرف نظر کنید
  if (!event.request.url.startsWith('http')) {
      return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request)
        .then(networkResponse => {
          // اگر پاسخ معتبر است و از نوع 'basic' (درخواست‌های هم‌مبدا) است، کش را آپدیت کن
          // یا 'cors' برای درخواست‌های Cross-Origin
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (networkResponse.type === 'basic' || networkResponse.type === 'cors')
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
            // اطمینان از وجود /offline.html در کش
            return caches.match('/offline.html');
          }
          // در غیر این صورت، پاسخ کش شده را برگردان
          return cachedResponse;
        });

      // ابتدا پاسخ کش شده را برگردان، همزمان سعی کن از شبکه واکشی کنی
      return cachedResponse || fetchPromise;
    })
  );
});