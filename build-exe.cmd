@echo off
setlocal
cd /d "%~dp0"
call pnpm build:exe %*
set "BUILD_EXIT=%ERRORLEVEL%"
if not "%BUILD_EXIT%"=="0" echo Build failed. See the error above.
pause
exit /b %BUILD_EXIT%
