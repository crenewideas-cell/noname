# Noname Mobile

Android client for Noname, built with Capacitor.

## 一键打包（Windows）

在工程根目录双击 `build-android.cmd`，或运行 `pnpm build:android`。
首次使用先执行 `pnpm install --frozen-lockfile`。构建需要 Node.js 22.18+、pnpm 10、JDK 21 和 Android SDK（API 36）。
脚本会从 `ANDROID_JAVA_HOME`、`JAVA_HOME`、PATH 中 Java 安装的相邻目录及常见安装目录选择 JDK 21，仅影响本次构建。
通过 `ANDROID_HOME` / `ANDROID_SDK_ROOT` 定位 SDK；已接受 SDK 许可时，Gradle 会下载缺少的平台和 Build Tools。
首次构建需联网下载 Gradle 和 Maven 依赖。Windows 简单系统代理会自动应用，也可设置 `NONAME_ANDROID_PROXY=http://host:port`。

输出目录为根目录的 `output/android/`：

- `noname-release.apk`：可安装 APK，内含本体、公共联机客户端和修复后的“絶伦逸羣”。
- `noname-extensions.zip`：全部扩展运行资源，保留中文目录和运行时加载的 JS/TS/Vue、图片、音频及许可证；排除工程缓存、原始压缩包和已有桌面构建规则定义的非运行素材。
- `安装说明.txt`、`LICENSE`、`build-report.json`：安装步骤、许可证、文件大小及 SHA-256。

将 ZIP 解压到手机普通目录，例如 `Documents/noname`，确保该目录下直接存在 `extension/`。
安装 APK 后，首次启动选择这个目录并授予读写权限。也可以先选空目录运行本体，之后将资源解压到该目录并重启。
扩展在游戏菜单中按需启用。旧目录中的文件优先于 APK，升级时也应更新资源包，尤其是 `extension/絶伦逸羣/extension.js`。
请勿选择 Android/data、存储根目录或 Download 根目录，系统可能不允许授予这些目录权限。

```powershell
pnpm build:android --check          # 检查本地环境，不构建
pnpm build:android                  # release APK + 全部扩展 ZIP
pnpm build:android --variant=debug  # 同样离线运行，可调试
pnpm build:android --aab            # AAB + ZIP；AAB 不能直接安装
pnpm build:android --skip-web-build # 复用 output/android-stage
pnpm test:android                  # 打包工具与装备栏技能回归测试
```

本体/扩展源码更新后应完整构建；`--skip-web-build` 仅用于本体资源未变的原生代码迭代。
脚本逐步检查退出码，构建失败立即停止；成功后检查 APK 签名。无正式签名配置时采用开发签名，部分签名字段缺失会报错。
自动化调用 `.cmd` 时设置 `NONAME_BUILD_NO_PAUSE=1` 可关闭结束暂停。

## Manual Sync

The one-click builder uses the isolated `output/android-stage` directory and standalone browser imports. Direct `sync` uses `../../dist` unless `NONAME_MOBILE_WEB_DIR` is set.

```bash
pnpm build
pnpm -F @noname/mobile sync
```

`sync` first bundles `src/preload.ts` into `../../dist/preload.js`, then runs `cap sync`, and finally renames packaged `.pnpm` assets to `_pnpm` for Android assets compatibility. After syncing, open `apps/mobile/android` in Android Studio or build with Gradle.

## CI Build

Android Studio is not required. The Gradle Wrapper and the build script can build the APK or AAB directly:

```bash
pnpm -F @noname/mobile build:android
pnpm -F @noname/mobile build:android -- --aab
```

The package command is an alias of the root builder described above. Gradle also retains its native output at `android/app/build/outputs/apk/release/app-release.apk`. `--skip-web-build` requires the root builder's previously generated `output/android-stage`, not a development `dist` directory.

Gradle builds require JDK 21. If another Java version is active, set `JAVA_HOME` and prepend its `bin` directory for the current shell before building. This is temporary and does not change the system-wide Java configuration.

Windows PowerShell:

```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
pnpm -F @noname/mobile build:android
```

Linux/macOS or CI Bash:

```bash
export JAVA_HOME="/path/to/jdk-21"
export PATH="$JAVA_HOME/bin:$PATH"
pnpm -F @noname/mobile build:android
```

The script selects an installed JDK 21 and uses it consistently for both preflight and Gradle, even if PATH and JAVA_HOME originally point to different versions.

### Release Signing

Release signing reads values from environment variables first, then from the local `android/keystore.properties` file. If no signing values are provided, the build falls back to the debug keystore for development.

For local builds, create `android/keystore.properties` (this file is ignored by Git):

```properties
storeFile=C:/path/to/noname-release.jks
storePassword=your-store-password
keyAlias=noname
keyPassword=your-key-password
```

For CI, set these environment variables instead:

```text
ANDROID_KEYSTORE_PATH=/secure/path/noname-release.jks
ANDROID_KEYSTORE_PASSWORD=...
ANDROID_KEY_ALIAS=noname
ANDROID_KEY_PASSWORD=...
```

The GitHub Actions release workflow stores the keystore as the `ANDROID_KEYSTORE_BASE64` secret and restores it during the job. Add that secret together with `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`, and `ANDROID_KEY_PASSWORD` in the repository settings.

The release APK/AAB is then signed automatically by `build:android`. Keep the keystore and passwords outside the repository; losing the keystore prevents updates to an already-published app.

## File System Model

The mobile client uses Android SAF as a writable overlay over packaged APK assets:

- APK assets are the read-only base layer.
- The SAF directory is the writable overlay layer.
- Reads and static resource requests check SAF first, then fall back to APK assets.
- Writes, creates, deletes, exports, and downloaded/modified user files only affect SAF.

This avoids copying the full game directory during installation. An empty SAF directory is valid; core files such as `noname.js` can still be loaded from packaged assets.

## Startup Permission

On startup, `src/preload.ts` requests SAF directory access before booting the game. The selected directory is stored with persistable read/write URI permission.

The selected directory does not need to contain a full Noname installation. It is used for user-writable data and file overrides.

If a file exists in both layers, the SAF file wins. Removing the SAF file reveals the packaged asset again.

## Native Bridge

The custom Android plugin is `SafFs`.

It exposes the file APIs used by `game.*` in preload:

- `checkFile`, `checkDir`
- `readFile`, `readFileAsText`
- `writeFile`
- `removeFile`, `removeDir`
- `getFileList`
- `createDir`

Read APIs use overlay semantics. Mutating APIs only touch SAF and reject attempts to modify files that exist only in APK assets.

`JsAwarePathHandler` applies the same overlay behavior to `https://localhost/...` WebView requests, so external files can override packaged resources by path.
