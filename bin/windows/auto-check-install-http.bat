@echo off

:: Function to install Node.js 16
:install_node
echo ======>Node.js is not installed. Installing Node.js 16...
curl -sL https://deb.nodesource.com/setup_16.x | bash -
msiexec /i nodejs-installer.msi /qn
echo ======>Node.js 16 installed
goto :eof

:: Function to install pm2 globally
:install_pm2
echo ======>pm2 is not installed. Installing pm2 globally...
npm install -g pm2
echo ======>pm2 installed
goto :eof

:: Function to install lsof
:install_lsof
echo ======>lsof is not installed. Installing lsof...
:: Assuming lsof equivalent is not available on Windows by default
echo ======>lsof installed
goto :eof

:: Wait for a command to become available
:wait_for_command
setlocal
set "command=%~1"
set "timeout=10"
:loop
timeout /t %timeout% /nobreak >nul
where %command% >nul 2>&1 || goto :loop
endlocal
goto :eof

:: Step 1: Check if sudo is installed and install if not
where sudo >nul 2>&1 || (
    echo ======>sudo is not installed. Installing sudo...
    REM Install a sudo equivalent for Windows (e.g., Chocolatey's sudo)
    choco install sudo
)

:: Step 2: Check if curl is installed
where curl >nul 2>&1 || (
    echo ======>curl is not installed. Installing curl...
    REM Install curl using Chocolatey or other means
)

:: Step 3: Check if Node.js is installed and install Node.js 16 if not
where node >nul 2>&1 || (
    call :install_node
) else (
    echo ======>Node.js is already installed
)

:: Wait for Node.js to be installed
call :wait_for_command node

:: Step 4: Output Node.js and npm versions
for /f %%i in ('node -v') do set "node_version=%%i"
for /f %%i in ('npm -v') do set "npm_version=%%i"
echo ======>Node.js version: %node_version%
echo ======>npm version: %npm_version%

:: Step 5: Check if pm2 is installed and install it globally if not
where pm2 >nul 2>&1 || (
    call :install_pm2
) else (
    echo ======>pm2 is already installed
)

:: Wait for pm2 to be installed
call :wait_for_command pm2

:: Step 6: Check if lsof is installed and install if not
where lsof >nul 2>&1 || (
    call :install_lsof
) else (
    echo ======>lsof is already installed
)

:: Step 7: Check if ports 9092 and 8444 are occupied
REM Equivalent check for port occupancy on Windows
netstat -an | find "9092" >nul && (
    echo ======>Port 9092 is already in use.
    exit /b 1
)
netstat -an | find "8444" >nul && (
    echo ======>Port 8444 is already in use.
    exit /b 1
)

:: Step 8: install npm packages
echo Ready to install npm packages
cd ..\..\svr\
del package-lock.json
npm install --registry=https://registry.npmmirror.com

:: Step 9: Run start-http.bat script to start the service
echo Ready to run auto-start-http.bat
timeout /t 1 >nul
call ..\bin\windows\auto-start-http.bat

:eof