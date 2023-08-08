cd "..\..\svr\"

@echo off

REM Start the first process
start "" pm2 start npm --name=tl-rtc-file-api -- run http-api
timeout /t 1 /nobreak

REM Start the second process
start "" pm2 start npm --name=tl-rtc-file-socket -- run http-socket
timeout /t 1 /nobreak

REM Run npm build command
npm run build:pro