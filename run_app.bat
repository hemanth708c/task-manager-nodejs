@echo off
REM === start backend in a new window ===
start "Task Manager API" cmd /c "cd /d C:\Users\Jaikumar\Desktop\task-manager && node server.js"

REM === give server a moment to boot, then open the UI ===
timeout /t 2 >nul
start "" "C:\Users\Jaikumar\Desktop\task-manager\frontend\index.html"
