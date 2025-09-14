@echo off
echo Seeding PRODUCTION database with admin user and sample data...
echo.
echo IMPORTANT: This will seed your PRODUCTION MongoDB database!
echo Make sure you have your production MONGODB_URI ready.
echo.
pause

cd server

REM Set production MongoDB URI (replace with your actual connection string)
set MONGODB_URI=mongodb+srv://aurafix:honeywellT55$@cluster0.y6e7drb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

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
