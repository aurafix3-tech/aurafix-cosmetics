@echo off
echo ========================================
echo    AuraFix Deployment Script
echo    Deploying to kibetronoh.com
echo ========================================

echo.
echo Step 1: Installing dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    echo Error installing client dependencies
    pause
    exit /b 1
)

echo.
echo Step 2: Building client application...
call npm run build
if %errorlevel% neq 0 (
    echo Error building client application
    pause
    exit /b 1
)

echo.
echo Step 3: Building admin panel...
cd ..\admin
call npm install
if %errorlevel% neq 0 (
    echo Error installing admin dependencies
    pause
    exit /b 1
)

call npm run build
if %errorlevel% neq 0 (
    echo Error building admin panel
    pause
    exit /b 1
)

echo.
echo ========================================
echo Build completed successfully!
echo.
echo Next steps:
echo 1. Upload client\build folder to Netlify
echo 2. Upload admin\build folder to admin.kibetronoh.com
echo 3. Deploy backend to Render/Railway
echo 4. Configure DNS in Namecheap
echo.
echo See DEPLOYMENT_GUIDE.md for detailed instructions
echo ========================================
pause
