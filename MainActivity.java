package com.posteriran.posteriran;

import android.annotation.SuppressLint;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private WebView webView;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        setContentView(webView);

        // فعال‌سازی جاوااسکریپت (برای سایت‌های مدرن)
        webView.getSettings().setJavaScriptEnabled(true);

        // بارگذاری سایت شما
        webView.loadUrl("https://akbari5561.github.io/PosterIran/");

        // تنظیم WebViewClient با پشتیبانی از واتساپ و intentها
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url.startsWith("whatsapp://") || url.startsWith("intent://")) {
                    try {
                        Intent intent = Intent.parseUri(url, Intent.URI_INTENT_SCHEME);
                        if (intent != null) {
                            startActivity(intent);
                            return true;
                        }
                    } catch (Exception e) {
                        Toast.makeText(MainActivity.this, "واتساپ نصب نیست", Toast.LENGTH_SHORT).show();
                        return true;
                    }
                } else if (url.startsWith("http") || url.startsWith("https")) {
                    // اجازه بده لینک‌های معمولی در WebView باز بشن
                    return false;
                } else {
                    // بقیه لینک‌ها (mailto:, tel:, ...) رو با intent باز کن
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        startActivity(intent);
                        return true;
                    } catch (ActivityNotFoundException e) {
                        Toast.makeText(MainActivity.this, "اپلیکیشن مورد نظر نصب نیست", Toast.LENGTH_SHORT).show();
                        return true;
                    }
                }
            }
        });
    }
}
