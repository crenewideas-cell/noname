@echo off
setlocal
echo Recovery deployment: all current online games will be interrupted.
echo Accounts and the persistent database will be retained.
echo.
call "%~dp0deploy-online.cmd" -StopActiveGames %*
exit /b %ERRORLEVEL%
