#!/bin/bash
#########################
# 提供一键部署https服务环境的脚本
# 包含api服务,socket服务
# @auther: iamtsm
# @version: v1.0.0
#########################

# Function to install Node.js 16
install_node() {
    echo "======>Node.js is not installed. Installing Node.js 16..."
    curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo "======>Node.js 16 installed"
}

# Function to install pm2 globally
install_pm2() {
    echo "======>pm2 is not installed. Installing pm2 globally..."
    sudo npm install -g pm2
    echo "======>pm2 installed"
}

# Function to install lsof
install_lsof() {
    echo "======>lsof is not installed. Installing lsof..."
    sudo apt-get update
    sudo apt-get install -y lsof
    echo "======>lsof installed"
}

# Wait for a command to become available
wait_for_command() {
    command="$1"
    while ! command -v $command &> /dev/null; do
        sleep 1
    done
}

# Step 1: Check if sudo is installed and install if not
if ! command -v sudo &> /dev/null; then
    echo "======>sudo is not installed. Installing sudo..."
    apt-get update
    apt-get install -y sudo
fi

# Step 2: Check if curl is installed
if ! command -v curl &> /dev/null; then
    echo "======>curl is not installed. Installing curl..."
    sudo apt-get update
    sudo apt-get install -y curl
fi

# Step 3: Check if Node.js is installed and install Node.js 16 if not
if ! command -v node &> /dev/null; then
    install_node
else
    echo "======>Node.js is already installed"
fi

# Wait for Node.js to be installed
wait_for_command node

# Step 4: Output Node.js and npm versions
node_version=$(node -v)
npm_version=$(npm -v)
echo "======>Node.js version: $node_version"
echo "======>npm version: $npm_version"

# Step 5: Check if pm2 is installed and install it globally if not
if ! command -v pm2 &> /dev/null; then
    install_pm2
else
    echo "======>pm2 is already installed"
fi

# Wait for pm2 to be installed
wait_for_command pm2

# Step 6: Check if lsof is installed and install if not
if ! command -v lsof &> /dev/null; then
    install_lsof
else
    echo "======>lsof is already installed"
fi

# Step 7: Check if ports 9092 and 8444 are occupied
port_9092_in_use=$(sudo lsof -i :9092 | grep LISTEN | wc -l)
port_8444_in_use=$(sudo lsof -i :8444 | grep LISTEN | wc -l)

if [ "$port_9092_in_use" -gt 0 ] || [ "$port_8444_in_use" -gt 0 ]; then
    echo "======>Port 9092 or 8444 is already in use."
    exit 1
fi

# Step 8: install npm packages
echo "======>Ready to install npm packages"
cd ../../svr/
rm package-lock.json
npm install --registry=https://registry.npmmirror.com 

# Step 9: Run start-https.sh script to start the service
echo "======>Ready to run auto-start-https.sh"
sleep 1
/bin/bash ./../bin/ubuntu16/auto-start-https.sh