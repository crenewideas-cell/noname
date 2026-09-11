package com.libnoname.noname

import android.content.Intent
import android.net.Uri
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

@CapacitorPlugin(name = "OnlineLobby")
class OnlineLobbyPlugin : Plugin() {
    @PluginMethod
    fun open(call: PluginCall) {
        val url = call.getString("url")
        val uri = url?.let { Uri.parse(it) }
        if (uri == null || uri.scheme !in listOf("http", "https") || uri.host.isNullOrBlank() || uri.userInfo != null) {
            call.reject("联机服务器地址格式无效")
            return
        }
        activity.runOnUiThread {
            try {
                activity.startActivity(Intent(activity, OnlineLobbyActivity::class.java).putExtra("url", url))
                call.resolve()
            } catch (error: Exception) { call.reject("无法打开联机大厅", error) }
        }
    }
}
