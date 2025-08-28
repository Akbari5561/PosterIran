// service-worker.js

const CACHE_NAME = 'my-pwa-cache-v1.7'; // شماره نسخه جدیدتر
const urlsToCache = [
  '/',
  '/index (17).html',
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
  
  // مسیرهای تصاویر اضافه شده از فایل index (17).html
  'Image/سایز ۵۰×۳۵ دوروچاپ/اعداد همراه ساعت و محور.jpg',
  'Image/سایز ۵۰×۳۵ دوروچاپ/الفبای فارسی و انگلیسی.jpg',
  'Image/سایز ۵۰×۳۵ دوروچاپ/آموزش ضرب و تقسیم.jpg',
  'Image/سایز ۵۰×۳۵ دوروچاپ/تمرین ضرب و تقسیم.jpg',
  'Image/سایز ۵۰×۳۵ دوروچاپ/جدول تناوبی عناصر.jpg',
  'Image/سایز ۵۰×۳۵ دوروچاپ/جدول جمع و تفریق.jpg',
  'Image/سایز ۵۰×۳۵ دوروچاپ/جدول دوستی تمرینی.jpg',
  'Image/سایز ۵۰×۳۵ دوروچاپ/جدول دوستی کامل.jpg',
  'Image/سایز ۵۰×۳۵ دوروچاپ/آموزش زمان و ساعت.jpg',
  'Image/سایز ۷۰×۵۰ یکروچاپ/الفبای فارسی شکل دار.jpg',
  'Image/سایز ۷۰×۵۰ یکروچاپ/الفبای فارسی بدون شکل.jpg',
  'Image/سایز ۷۰×۵۰ یکروچاپ/اعداد 1 تا 100.jpg',
  'Image/سایز ۷۰×۵۰ یکروچاپ/اعداد ده دهی.jpg',
  'Image/سایز ۷۰×۵۰ یکروچاپ/اعداد یک تا ده.jpg',
  'Image/سایز ۷۰×۵۰ یکروچاپ/الفبای انگلیسی.jpg',
  'Image/سایز ۷۰×۵۰ یکروچاپ/جدول جمع.jpg',
  'Image/سایز ۷۰×۵۰ یکروچاپ/جدول تفریق.jpg',
  'Image/سایز ۷۰×۵۰ یکروچاپ/جدول ضرب.jpg',
  'Image/سایز ۷۰×۵۰ یکروچاپ/جدول تقسیم.jpg',
  'Image/سایز ۷۰×۵۰ یکروچاپ/جدول تناوبی عناصر.jpg',
  'Image/سایز ۷۰×۵۰ یکروچاپ/جدول دوستی.jpg',
  'Image/سایز ۷۰×۵۰ یووی‌دار/شهرک الفبا.jpg',
  'Image/سایز ۷۰×۵۰ یووی‌دار/جدول دوستی تمرینی.jpg',
  'Image/سایز ۷۰×۵۰ یووی‌دار/آناتومی بدن انسان.jpg',
  'Image/سایز ۷۰×۵۰ یووی‌دار/بدن من.jpg',
  'Image/سایز ۷۰×۵۰ یووی‌دار/شکل صداها و الفبای فارسی.jpg',
  'Image/سایز ۷۰×۵۰ یووی‌دار/آموزش زمان وساعت.jpg',
  'Image/سایز ۷۰×۵۰ یووی‌دار/ضرب تمرینی ستونی.jpg',
  'Image/سایز ۷۰×۵۰ یووی‌دار/ضرب تمرینی مربعی.jpg',
  'Image/سایز ۷۰×۵۰ یووی‌دار/محیط و مساحت اشکال هندسی.jpg',
  'Image/سایز ۷۰×۵۰ یووی‌دار/منظومه خورشیدی.jpg',
  'Image/سایز ۷۰×۵۰ یووی‌دار/نقشه ایران.jpg',
  'Image/سایز ۷۰×۵۰ یووی‌دار/نقشه جهان.jpg',
  'Image/سایز ۲۹×۲۱ دوروچاپ/الفبای فارسی و انگلیسی.jpg',
  'Image/سایز ۲۹×۲۱ دوروچاپ/آموزش زمان و ساعت.jpg',
  'Image/سایز ۲۹×۲۱ دوروچاپ/تمرین ضرب و تقسیم.jpg',
  'Image/سایز ۲۹×۲۱ دوروچاپ/آموزش ضرب و تقسیم.jpg',
  'Image/سایز ۲۹×۲۱ دوروچاپ/جدول دوستی تمرینی.jpg',
  'Image/سایز ۲۹×۲۱ دوروچاپ/جدول دوستی کامل.jpg',
  'Image/سایز ۲۹×۲۱ دوروچاپ/حساب آموز اول (افقی).jpg',
  'Image/سایز ۲۹×۲۱ دوروچاپ/حساب آموز اول (عمودی).jpg',
  'Image/سایز ۲۹×۲۱ دوروچاپ/حساب آموز دوم (افقی).jpg',
  'Image/سایز ۲۹×۲۱ دوروچاپ/حساب آموز دوم (عمودی).jpg',
  'Image/سایز ۲۹×۲۱ دوروچاپ/حساب آموز پایه سوم.jpg',
  'Image/سایز ۲۹×۲۱ دوروچاپ/محیط و مساحت اشکال هندسی.jpg',
  'Image/سایز ۲۹×۲۱ دوروچاپ/ضرب و تمرین ضرب.jpg',
  'Image/سایز ۲۹×۲۱ دوروچاپ/جدول تناوبی عناصر.jpg',
  'Image/سایز ۲۹×۲۱ دوروچاپ/اعداد همراه با ساعت و محور.jpg',
  'Image/سایز ۵۰×۳۵ یکروچاپ/الفبای فارسی و شکل صداها.jpg',
  'Image/سایز ۵۰×۳۵ یکروچاپ/جدول دوستی.jpg',
  'Image/سایز ۵۰×۳۵ یکروچاپ/جدول ضرب کد 350.jpg',
  'Image/سایز ۵۰×۳۵ یکروچاپ/جدول ضرب کد 351.jpg',
  'Image/سایر محصولات/فلش کارت ضرب.jpeg',
  'Image/سایر محصولات/فلش کارت الفبا.jpeg',
  'Image/سایر محصولات/دفترچه ای کوچک الفبا.jpeg',
  'Image/سایر محصولات/دفترچه ای کوچک دوستی.jpeg',
  'Image/سایر محصولات/دفترچه ای بزرگ ضرب.jpeg',
  'Image/سایر محصولات/دفترچه ای بزرگ الفبا.jpeg',
  'Image/سایر محصولات/دفترچه ای بزرگ دوستی.jpeg',
  'Image/سایر محصولات/فلش کارت اعداد.jpeg',
  'Image/سایر محصولات/استیکر A4.jpeg'
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