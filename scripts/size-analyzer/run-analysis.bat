@echo off
echo Installing dependencies for component size analyzer...
npm install

echo Running component size analysis on src directory...
node analyze-component-sizes.js ../../src

echo Analysis complete!
pause
