@echo off
title CampusSafe AI - Hackathon Demo Launcher
echo ===================================================
echo     CampusSafe AI - Smart Campus Safety Platform
echo ===================================================
echo.
echo Starting Backend API Server (Port 5000)...
start "CampusSafe AI Backend" cmd /k "cd backend && node server.js"

echo Waiting 2 seconds for backend initialization...
timeout /t 2 /nobreak >nul

echo Starting Frontend Dev Server (Port 5173)...
start "CampusSafe AI Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ===================================================
echo Servers Launched Successfully!
echo Frontend URL: http://localhost:5173
echo Backend API:  http://localhost:5000/api
echo.
echo Demo Credentials:
echo Student: student@campus.com / student123
echo Admin:   admin@campus.com   / admin123
echo ===================================================
echo.
pause
