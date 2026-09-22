package com.libnoname.noname

import android.content.Intent
import android.net.Uri
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import java.io.File
import java.util.UUID

@CapacitorPlugin(name = "OnlineLobby")
class OnlineLobbyPlugin : Plugin() {
    @PluginMethod
    fun open(call: PluginCall) {
        val url = call.getString("url")
        if (url == null || !Regex("^#online=[a-z0-9_-]+(?:&appearance=[A-Za-z0-9_-]{1,8192})?$").matches(url)) {
            call.reject("联机玩法格式无效")
            return
        }
        try { context.assets.open("public/online-client/deployment.json").close() }
        catch (error: Exception) { call.reject("缺少本地联机资源，请安装完整客户端", error); return }
        val skin = call.getString("skin")
        if (skin != null && skin.toByteArray(Charsets.UTF_8).size > 192 * 1024 * 1024) {
            call.reject("联机皮肤数据过大"); return
        }
        val token = if (skin != null) UUID.randomUUID().toString() else null
        val skinFile = token?.let { File(context.cacheDir, "online-skin-$it.json") }
        try { if (skin != null) skinFile?.writeText(skin, Charsets.UTF_8) }
        catch (error: Exception) { skinFile?.delete(); call.reject("无法传递本地皮肤", error); return }
        activity.runOnUiThread {
            try {
                activity.startActivity(Intent(activity, OnlineLobbyActivity::class.java).putExtra("url", url).putExtra("skinToken", token))
                call.resolve()
            } catch (error: Exception) { skinFile?.delete(); call.reject("无法打开联机大厅", error) }
        }
    }
}
