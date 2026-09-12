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
        if (url == null || !Regex("^#online=[a-z0-9_-]+$").matches(url)) {
            call.reject("联机玩法格式无效")
            return
        }
        try { context.assets.open("public/online-client/deployment.json").close() }
        catch (error: Exception) { call.reject("缺少本地联机资源，请安装完整客户端", error); return }
        activity.runOnUiThread {
            try {
                activity.startActivity(Intent(activity, OnlineLobbyActivity::class.java).putExtra("url", url))
                call.resolve()
            } catch (error: Exception) { call.reject("无法打开联机大厅", error) }
        }
    }
}
