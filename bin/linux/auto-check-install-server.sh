#!/bin/bash

# Step 1: Check if Node.js is installed and install Node.js 18 if not
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Installing Node.js 18..."
    curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Step 2: Output Node.js and npm versions
node_version=$(node -v)
npm_version=$(npm -v)
echo "Node.js version: $node_version"
echo "npm version: $npm_version"
sleep 1

# Step 3: Check if pm2 is installed and install it globally if not
if ! command -v pm2 &> /dev/null; then
    echo "pm2 is not installed. Installing pm2 globally..."
    sudo npm install -g pm2
fi

# Step 4: Output pm2 version
pm2_version=$(pm2 -v)
echo "pm2 version: $pm2_version"
sleep 1

# Step 5: Check if ports 9092 and 8444 are occupied
port_9092_in_use=$(sudo lsof -i :9092 | grep LISTEN | wc -l)
port_8444_in_use=$(sudo lsof -i :8444 | grep LISTEN | wc -l)

if [ "$port_9092_in_use" -gt 0 ] || [ "$port_8444_in_use" -gt 0 ]; then
    echo "Port 9092 or 8444 is already in use."
    exit 1
fi

# Step 6: install npm packages
echo "ready to install npm packages"
cd ../../svr/
npm install --registry=https://registry.npmmirror.com 
cd ../bin/linux/

# Step 7: Run start-server.sh script to start the service
echo "ready to run auto-start-server.sh"
sleep 1
./auto-start-server.sh
