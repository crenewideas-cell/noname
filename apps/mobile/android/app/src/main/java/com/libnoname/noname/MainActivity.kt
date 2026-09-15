package com.libnoname.noname

import android.os.Bundle
import android.webkit.ServiceWorkerClient
import android.webkit.ServiceWorkerController
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import androidx.webkit.WebViewAssetLoader
import com.getcapacitor.BridgeActivity
import com.getcapacitor.BridgeWebViewClient

class MainActivity : BridgeActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        registerPlugin(SafFsPlugin::class.java)
        registerPlugin(OnlineLobbyPlugin::class.java)
        super.onCreate(savedInstanceState)

        val webView = bridge.webView

        val assetLoader = WebViewAssetLoader.Builder()
            .setDomain("localhost")
            .addPathHandler("/", JsAwarePathHandler(this, "public"))
            .build()

        bridge.setWebViewClient(object : BridgeWebViewClient(bridge) {
            override fun shouldInterceptRequest(
                view: WebView,
                request: WebResourceRequest
            ): WebResourceResponse? {
                return if (request.url.host == "localhost") {
                    overlayResponse(assetLoader, request)
                        ?: super.shouldInterceptRequest(view, request)
                } else {
                    super.shouldInterceptRequest(view, request)
                }
            }
        })

        if (bridge.config.isResolveServiceWorkerRequests) {
            val swController = ServiceWorkerController.getInstance()
            swController.setServiceWorkerClient(
                object : ServiceWorkerClient() {
                    override fun shouldInterceptRequest(request: WebResourceRequest): WebResourceResponse? {
                        return if (request.url.host == "localhost") {
                            overlayResponse(assetLoader, request)
                                ?: bridge.localServer.shouldInterceptRequest(request)
                        } else {
                            bridge.localServer.shouldInterceptRequest(request)
                        }
                    }
                }
            )
        }

        webView.loadUrl("https://localhost/index.html")
    }

    private fun overlayResponse(loader: WebViewAssetLoader, request: WebResourceRequest): WebResourceResponse? {
        val response = loader.shouldInterceptRequest(request.url) ?: return null
        // Older WebViews require Capacitor's bridge script to be injected into HTML.
        if (response.mimeType == "text/html") {
            response.data = bridge.localServer.getJavaScriptInjectedStream(response.data)
        }
        return response
    }
}
