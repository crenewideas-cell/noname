@echo off
setlocal
cd /d "%~dp0"
where pwsh.exe >nul 2>nul
if errorlevel 1 (
  powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\deploy-online.ps1" %*
) else (
  pwsh.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\deploy-online.ps1" %*
)
set "DEPLOY_EXIT=%ERRORLEVEL%"
echo.
if not "%DEPLOY_EXIT%"=="0" echo Deployment failed. Read the error above before retrying.
pause
exit /b %DEPLOY_EXIT%
