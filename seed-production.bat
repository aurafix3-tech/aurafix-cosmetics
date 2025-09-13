@echo off
echo Seeding production database with admin user and sample data...

cd server
echo Running seed script...
node seedData.js

echo.
echo Database seeded successfully!
echo.
echo Admin Login Credentials:
echo Email: admin@aurafix.com
echo Password: admin123
echo.
pause
