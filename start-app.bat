@echo off
echo ================================
echo   READLEXIA - Starting Application
echo ================================
echo.

echo Starting Backend on http://localhost:3001
echo Starting Frontend on http://localhost:5173
echo.
echo Press Ctrl+C to stop
echo ================================
echo.

start "Readlexia Backend" cmd /k "cd backend && npm run start:dev"
timeout /t 3 >nul
start "Readlexia Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ✓ Both servers are starting in separate windows...
echo.
pause
