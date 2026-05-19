@echo off
setlocal

cd /d "%~dp0"

set "DEMO_URL=http://localhost:4201/"

echo.
echo Starting ngx-dual-rangepicker demo...
echo.
echo URL:
echo   %DEMO_URL%
echo.
echo Keep this window open while using the demo.
echo Close this window or press Ctrl+C to stop the server.
echo.

npx ng serve demo --configuration development --host localhost --port 4201 --ssl=false
set "EXIT_CODE=%ERRORLEVEL%"

echo.
if not "%EXIT_CODE%"=="0" (
  echo Demo server stopped with exit code %EXIT_CODE%.
) else (
  echo Demo server stopped.
)
echo.
pause
exit /b %EXIT_CODE%
