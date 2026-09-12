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
import android.webkit.WebResourceResponse
import android.webkit.MimeTypeMap
import android.widget.Button
import android.widget.LinearLayout
import org.json.JSONObject
import java.io.ByteArrayInputStream

/** Local bundled game files share the API origin, without a native JS bridge. */
class OnlineLobbyActivity : Activity() {
    private var page: WebView? = null

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val fragment = intent.getStringExtra("url") ?: run { finish(); return }
        if (!Regex("^#online=[a-z0-9_-]+$").matches(fragment)) { finish(); return }
        val manifest = try { assets.open("public/online-client/deployment.json").bufferedReader().use { JSONObject(it.readText()) } }
            catch (_: Exception) { finish(); return }
        if (manifest.optString("kind") != "client") { finish(); return }
        val origin = Uri.parse(manifest.optString("origin"))
        if (origin.scheme !in listOf("http", "https") || origin.host.isNullOrBlank() || origin.userInfo != null) { finish(); return }
        val address = origin.buildUpon().path("/index.html").clearQuery().encodedFragment(fragment.removePrefix("#")).build().toString()
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
            override fun shouldInterceptRequest(view: WebView, request: WebResourceRequest): WebResourceResponse? {
                val target = request.url
                if (target.scheme != origin.scheme || target.host != origin.host || target.port != origin.port || target.userInfo != null) return missing(403)
                val path = target.path ?: return missing()
                if (path.startsWith("/api/v1/") || path == "/ws/v1") return null
                if (request.method != "GET") return missing(405)
                val name = if (path == "/") "index.html" else path.removePrefix("/")
                if (name.contains('\\') || name.contains('\u0000') || name.contains(':')) return missing(403)
                val parts = name.split('/')
                if (parts.any { it == "." || it == ".." } || parts.first() in listOf("extension", "src", "preload.js", ".env", ".git")) return missing(403)
                return try {
                    val stream = assets.open("public/online-client/" + name.replace(".pnpm", "_pnpm"))
                    val extension = name.substringAfterLast('.', "").lowercase()
                    val mime = when (extension) {
                        "js", "mjs" -> "application/javascript"
                        "json" -> "application/json"
                        "wasm" -> "application/wasm"
                        else -> MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension) ?: "application/octet-stream"
                    }
                    WebResourceResponse(mime, "UTF-8", 200, "OK", mapOf("Cache-Control" to "no-store"), stream)
                } catch (_: Exception) { missing() }
            }
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

    private fun missing(status: Int = 404) = WebResourceResponse("text/plain", "UTF-8", status, "Unavailable",
        mapOf("Cache-Control" to "no-store"), ByteArrayInputStream("Local client asset unavailable".toByteArray()))

    override fun onPause() { CookieManager.getInstance().flush(); super.onPause() }
    override fun onDestroy() {
        page?.let { web -> web.stopLoading(); (web.parent as? LinearLayout)?.removeView(web); web.destroy() }
        page = null
        super.onDestroy()
    }
}
