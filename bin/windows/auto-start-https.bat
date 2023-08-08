cd "..\..\svr\"

@echo off

REM Start the first process
start "" pm2 start npm --name=tl-rtc-file-api -- run https-api
timeout /t 1 /nobreak

REM Start the second process
start "" pm2 start npm --name=tl-rtc-file-socket -- run https-socket
timeout /t 1 /nobreak

REM Run npm build command
npm run build:pro