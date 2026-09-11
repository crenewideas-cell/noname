# 第三方运行文件

`seccomp_profile.json` 原样取自 Microsoft Playwright `v1.63.0`：
https://github.com/microsoft/playwright/blob/v1.63.0/utils/docker/seccomp_profile.json

Playwright 项目许可证：Apache-2.0。
https://github.com/microsoft/playwright/blob/v1.63.0/LICENSE

用途：非 root Chromium 启用沙盒所需的 Docker syscall 配置。本项目没有使用 privileged、seccomp=unconfined 或 --no-sandbox。
