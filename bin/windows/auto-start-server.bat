@echo off

REM Start the first process
start "" pm2 start npm --name=tl-rtc-file-api-local -- run sapi
timeout /t 1 /nobreak

REM Start the second process
start "" pm2 start npm --name=tl-rtc-file-socket-local -- run ssocket
timeout /t 1 /nobreak

REM Run npm build command
npm run build:pro