@echo off
REM Power BI Sankey Visual - Build Script for Windows
REM This script helps you build and package the custom visual

setlocal enabledelayedexpansion

echo ================================================
echo   Power BI Sankey Visual - Build Script
echo ================================================
echo.

REM Change to visual directory
cd /d "%~dp0"

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js version: %NODE_VERSION%

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [OK] npm version: %NPM_VERSION%

REM Check if pbiviz is installed
where pbiviz >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Power BI Visuals Tools not found
    echo Installing globally...
    call npm install -g powerbi-visuals-tools
    if !ERRORLEVEL! NEQ 0 (
        echo [ERROR] Failed to install powerbi-visuals-tools
        echo Try running this script as Administrator
        pause
        exit /b 1
    )
)

for /f "tokens=*" %%i in ('pbiviz --version') do set PBIVIZ_VERSION=%%i
echo [OK] Power BI Visuals Tools: %PBIVIZ_VERSION%
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    if !ERRORLEVEL! NEQ 0 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed
) else (
    echo [OK] Dependencies already installed
)

echo.
echo Building and packaging visual...
call npm run package

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed
    pause
    exit /b 1
)

echo.
echo ================================================
echo [SUCCESS] BUILD SUCCESSFUL!
echo ================================================
echo.

REM Find the .pbiviz file
for /f "tokens=*" %%i in ('dir /s /b dist\*.pbiviz 2^>nul') do set PBIVIZ_FILE=%%i

if defined PBIVIZ_FILE (
    for %%A in ("%PBIVIZ_FILE%") do set FILE_SIZE=%%~zA
    set /a FILE_SIZE_KB=!FILE_SIZE! / 1024
    echo Package created:
    echo    File: %PBIVIZ_FILE%
    echo    Size: !FILE_SIZE_KB! KB
    echo.
    echo Next steps:
    echo 1. Open Power BI Desktop
    echo 2. Go to Visualizations pane
    echo 3. Click '...' -^> 'Import a visual from a file'
    echo 4. Select: %PBIVIZ_FILE%
    echo 5. Click 'Import'
    echo.
) else (
    echo [WARNING] Package file not found in dist\
    echo Check for errors above.
)

echo ================================================
echo.
pause
