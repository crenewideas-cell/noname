package com.libnoname.noname

import android.annotation.SuppressLint
import android.app.Activity
import android.net.Uri
import android.os.Bundle
import android.webkit.CookieManager
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.LinearLayout

/** Public pages have no Capacitor bridge, SAF access or local asset handler. */
class OnlineLobbyActivity : Activity() {
    private var page: WebView? = null

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val address = intent.getStringExtra("url") ?: run { finish(); return }
        val origin = Uri.parse(address)
        if (origin.scheme !in listOf("http", "https") || origin.host.isNullOrBlank() || origin.userInfo != null) { finish(); return }
        val layout = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
        val back = Button(this).apply {
            text = "关闭联机窗口，返回本地首页"
            setOnClickListener { finish() }
        }
        val web = WebView(this)
        page = web
        web.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = false
            allowContentAccess = false
            mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
            javaScriptCanOpenWindowsAutomatically = false
            setSupportMultipleWindows(false)
        }
        CookieManager.getInstance().setAcceptThirdPartyCookies(web, false)
        web.webChromeClient = object : WebChromeClient() {}
        web.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                val target = request.url
                return target.scheme != origin.scheme || target.host != origin.host || target.port != origin.port || target.userInfo != null
            }
        }
        layout.addView(back, LinearLayout.LayoutParams(-1, -2))
        layout.addView(web, LinearLayout.LayoutParams(-1, 0, 1f))
        setContentView(layout)
        web.loadUrl(address)
    }

    override fun onPause() { CookieManager.getInstance().flush(); super.onPause() }
    override fun onDestroy() {
        page?.let { web -> web.stopLoading(); (web.parent as? LinearLayout)?.removeView(web); web.destroy() }
        page = null
        super.onDestroy()
    }
}
