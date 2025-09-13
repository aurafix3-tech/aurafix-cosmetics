@echo off
echo Seeding PRODUCTION database with admin user and sample data...
echo.
echo IMPORTANT: This will seed your PRODUCTION MongoDB database!
echo Make sure you have your production MONGODB_URI ready.
echo.
pause

cd server

REM Set production MongoDB URI (replace with your actual connection string)
set MONGODB_URI=your_production_mongodb_connection_string_here

echo Connecting to production database...
echo URI: %MONGODB_URI%
echo.
node seedData.js

echo.
echo Production database seeded successfully!
echo.
echo Admin Login Credentials:
echo Email: admin@aurafix.com
echo Password: admin123
echo.
pause
