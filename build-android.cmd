@echo off
setlocal
cd /d "%~dp0"
call pnpm build:android %*
set "BUILD_EXIT=%ERRORLEVEL%"
if not "%BUILD_EXIT%"=="0" echo Build failed. See the error above.
if not defined NONAME_BUILD_NO_PAUSE pause
exit /b %BUILD_EXIT%
