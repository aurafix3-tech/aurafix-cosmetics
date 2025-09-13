@echo off
echo Enter your MongoDB Atlas connection string:
set /p MONGODB_URI="MongoDB URI: "

echo.
echo Seeding production database...
echo URI: %MONGODB_URI%
echo.

cd server
node seedData.js

echo.
echo Check the output above to confirm it connected to "Production database"
echo.
pause
