@echo off
echo Running Permission Scanner for PharmacyHub...
echo.

node "%~dp0\scan-permissions.js" "../permissions-report.json"

echo.
echo If successful, you can find the report at: %~dp0..\permissions-report.json
echo.
pause
