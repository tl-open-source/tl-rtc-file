@echo off
setlocal

REM Step 1: Check if Node.js is installed and install Node.js 18 if not
where /q node
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Installing Node.js 18...
    REM Modify the Node.js installer URL if needed
    curl -o node_installer.msi https://nodejs.org/dist/v18.0.0/node-v18.0.0-x64.msi
    start /wait msiexec /i node_installer.msi /qn
    del node_installer.msi
)

REM Step 2: Output Node.js and npm versions
node -v
npm -v

REM Step 3: Check if pm2 is installed and install it globally if not
where /q pm2
if %ERRORLEVEL% NEQ 0 (
    echo pm2 is not installed. Installing pm2 globally...
    npm install -g pm2
)

REM Step 4: Output pm2 version
pm2 -v

REM Step 5: Check if ports 9092 and 8444 are occupied
netstat -ano | findstr ":9092"
if %ERRORLEVEL% EQU 0 (
    echo Port 9092 is already in use.
    exit /b 1
)

netstat -ano | findstr ":8444"
if %ERRORLEVEL% EQU 0 (
    echo Port 8444 is already in use.
    exit /b 1
)

REM Step 6: Output installation successful message
echo env Installation successful.

@echo off
echo "ready to install npm packages"
cd "..\..\svr\"
npm install --registry=https://registry.npmmirror.com
cd "..\bin\windows\"

REM Step 7: Run start-http.bat script to start the service
auto-start-http.bat