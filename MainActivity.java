package com.pixel.posteriran;

import android.annotation.SuppressLint;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebSettings; // Import WebSettings
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Build; // Import Build class

public class MainActivity extends AppCompatActivity {

    private WebView webView;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        setContentView(webView);

        WebSettings webSettings = webView.getSettings();

        // فعال‌سازی جاوااسکریپت (برای سایت‌های مدرن)
        webSettings.setJavaScriptEnabled(true);

        // *** حل مشکل تم تاریک برای دراپ‌دان‌ها ***
        // این کد مطمئن می‌شود که WebView از تم تاریک سیستم‌عامل پیروی نمی‌کند
        // تا رنگ‌های اصلی وب‌سایت حفظ شود.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            webSettings.setForceDark(WebSettings.FORCE_DARK_OFF);
        }
        
        // *** تغییرات جدید برای مدیریت کش WebView ***
        // تنظیم حالت کش به LOAD_NO_CACHE: این تنظیم WebView را مجبور می‌کند که
        // هر بار محتوا را از شبکه بارگذاری کند و از کش استفاده نکند.
        webSettings.setCacheMode(WebSettings.LOAD_NO_CACHE);

        // (اختیاری) پاک کردن کش WebView در هنگام شروع برنامه.
        // این کار می‌تواند اطمینان حاصل کند که هیچ محتوای کش شده قدیمی‌ای نمایش داده نمی‌شود.
        // اگر WebView به درستی تنظیم شده باشد، ممکن است نیازی به این خط نباشد،
        // اما برای اطمینان بیشتر می‌توانید آن را نگه دارید.
        webView.clearCache(true);
        // webView.clearHistory(); // همچنین می‌توانید تاریخچه را نیز پاک کنید اگر لازم باشد.
        // ********************************************

        // بارگذاری سایت شما
        webView.loadUrl("https://akbari5561.github.io/PosterIran/");

        // تنظیم WebViewClient با پشتیبانی از واتس‌اپ و Intent ها
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                // مهم: برای API 24 به بالا، از WebResourceRequest درshouldOverrideUrlLoading استفاده کنید.
                // این متد با String url در API 24+ منسوخ شده است.
                // اما اگر نسخه‌های قدیمی‌تر اندروید را هدف قرار داده‌اید یا فقط یک راه حل سریع می‌خواهید، این کد کار می‌کند.

                // مدیریت لینک‌های عمیق واتس‌اپ (whatsapp://) و Intent های عمومی (intent://)
                if (url.startsWith("whatsapp://") || url.startsWith("intent://")) {
                    try {
                        Intent intent = Intent.parseUri(url, Intent.URI_INTENT_SCHEME);
                        if (intent != null) {
                            startActivity(intent);
                            return true; // لینک مدیریت شد، در WebView بارگذاری نشود
                        }
                    } catch (Exception e) {
                        Toast.makeText(MainActivity.this, "واتس‌اپ نصب نیست", Toast.LENGTH_SHORT).show();
                        // می‌توانید در اینجا کاربر را به صفحه فروشگاه Play واتس‌اپ هدایت کنید:
                        // Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=com.whatsapp"));
                        // startActivity(browserIntent);
                        return true;
                    }
                }
                // *** اضافه شده جدید ***
                // مدیریت لینک‌های HTTPS واتس‌اپ (wa.me)
                else if (url.contains("wa.me/")) { // بررسی می‌کند که "wa.me/" در هر کجای URL وجود دارد
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW);
                        intent.setData(Uri.parse(url));
                        startActivity(intent);
                        return true; // لینک مدیریت شد، در WebView بارگذاری نشود
                    } catch (ActivityNotFoundException e) {
                        // اگر واتس‌اپ نصب نبود، به کاربر اطلاع دهید یا به صفحه دانلود هدایت کنید
                        Toast.makeText(MainActivity.this, "اپلیکیشن واتس‌اپ یافت نشد.", Toast.LENGTH_SHORT).show();
                        // گزینه برای باز کردن لینک فروشگاه Play:
                        // Intent playStoreIntent = new Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=com.whatsapp"));
                        // startActivity(playStoreIntent);
                        return true;
                    }
                }
                // مدیریت لینک‌های HTTP/HTTPS معمولی
                else if (url.startsWith("http") || url.startsWith("https")) {
                    // اجازه دهید لینک‌های وب معمولی در WebView باز شوند
                    return false;
                }
                // مدیریت سایر scheme های سفارشی (مثلاً mailto:, tel:)
                else {
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        startActivity(intent);
                        return true; // لینک به صورت خارجی مدیریت شد
                    } catch (ActivityNotFoundException e) {
                        Toast.makeText(MainActivity.this, "اپلیکیشن مورد نظر نصب نیست", Toast.LENGTH_SHORT).show();
                        return true;
                    }
                }
            }

            // توصیه می‌شود برای API 24 به بالا از سربارگذاری WebResourceRequest استفاده کنید
            // @RequiresApi(Build.VERSION_CODES.N) // اگر از این استفاده می‌کنید، این حاشیه نویسی را اضافه کنید
            // @Override
            // public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            //    String url = request.getUrl().toString();
            //    // می‌توانید همان منطق بالا را اینجا قرار دهید.
            //    // WebResourceRequest اطلاعات بیشتری در مورد درخواست ارائه می‌دهد.
            //    return shouldOverrideUrlLoading(view, url); // برای سادگی متد قدیمی را فراخوانی کنید، یا منطق را بازنویسی کنید
            // }
        });
    }
}
