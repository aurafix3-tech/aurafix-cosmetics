@echo off
echo Rebuilding Admin Panel with Production Backend...

cd admin
echo Installing dependencies...
call npm install

echo Building for production with backend URL...
call npm run build

echo.
echo Admin panel rebuilt successfully!
echo Backend URL: https://aurafix-backend.onrender.com
echo.
echo Next steps:
echo 1. Drag the 'admin/build' folder to Netlify
echo 2. Configure custom domain: admin.kibetronoh.com
echo.
pause
