@echo off
echo Fixing ESLint issues and pushing to GitHub...

REM Add the new ESLint configuration files
git add client/.eslintrc.js
git add admin/.eslintrc.js
git add client/netlify.toml

REM Commit the changes
git commit -m "Fix: Add ESLint configuration to resolve build warnings"

REM Push to GitHub to trigger new build
git push

echo.
echo ESLint fixes pushed to GitHub!
echo This should trigger a new Netlify build.
echo.
pause
