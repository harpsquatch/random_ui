@echo off
echo.
echo 🛠️ Login UI - Self-Healing Playwright Tests Setup
echo ============================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH
    echo    Please install Node.js from https://nodejs.org/
    echo    Then run this script again.
    pause
    exit /b 1
)

echo ✅ Node.js detected: 
node --version

REM Check if required files exist
if not exist "index.html" (
    echo ❌ index.html not found
    echo    Make sure you're in the correct directory
    pause
    exit /b 1
)

if not exist "demo.html" (
    echo ❌ demo.html not found  
    echo    Make sure you're in the correct directory
    pause
    exit /b 1
)

echo ✅ HTML files found

REM Install dependencies
echo.
echo 📦 Installing Playwright dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install npm dependencies
    pause
    exit /b 1
)

echo.
echo 📥 Installing Playwright browsers (this may take a few minutes)...
call npx playwright install
if errorlevel 1 (
    echo ❌ Failed to install Playwright browsers
    pause
    exit /b 1
)

echo.
echo ============================================================
echo ✅ Setup completed successfully!
echo.
echo 🚀 You can now run tests with:
echo    npm run test              # Headless mode
echo    npm run test:headed       # Show browser window
echo    npm run test:ui           # Interactive mode
echo    node run-playwright-tests.js  # Direct script
echo.
echo 💡 The tests will automatically adapt to your UI changes!
echo    Your button change from .login-btn to .btn-primary is handled!
echo.
pause 