@echo off
echo Building AuraFix Admin Panel...

cd admin
echo Installing dependencies...
call npm install

echo Building for production...
call npm run build

echo.
echo Admin panel built successfully!
echo You can now drag the 'admin/build' folder to Netlify.
echo.
pause
