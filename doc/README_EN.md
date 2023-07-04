# tl-rtc-file-tool 【More Than Just File Transfer】

[![](https://img.shields.io/badge/webrtc-p2p-blue)](https://webrtc.org.cn/)
[![](https://img.shields.io/badge/code-simple-green)](https://github.com/iamtsm/tl-rtc-file/)
[![](https://img.shields.io/badge/large%20file-support-green)](https://github.com/iamtsm/tl-rtc-file/)
[![](https://img.shields.io/badge/deployment-private-yellow)](https://github.com/iamtsm/tl-rtc-file/)
[![](https://img.shields.io/badge/platform-unlimited-coral)](https://github.com/iamtsm/tl-rtc-file/)

#### Background: Organized around the topic of a 2020 thesis

#### Introduction: (tl webrtc datachannel filetools) uses WebRTC to transfer files on the web and supports the transfer of very large files.

#### Advantages: Supports fragmented transmission, cross-device compatibility, platform independence, easy-to-use, unlimited internal network speed, private deployment, and supports the drag-and-drop sending of multiple files.

#### Extensions: Many rich functions have been added, such as local screen recording, remote screen sharing, remote audio and video calls, live broadcasting, password rooms, relay service settings, WebRTC detection, text transmission, public chat, rich back-end management, integrated Enterprise WeChat robot alarm notification, real-time execution log display, etc.

#### Experience: https://im.iamtsm.cn/file

**QQ Communication Group: 624214498**

## Preparation

    Install Node.js and npm and then enter the project directory.
    
    npm install

    Go to the build directory: cd build/webpack/

    Install some dependencies: npm install


    If you need to develop and modify the files in the res directory, keep one of the following two backend commands open.

    npm run dev packages the development environment min.

    npm run pro packages the production environment min.

## Test Environment 

    Start the following two services.

    Local startup file-res: npm run dev

    Local startup file-socket: npm run devsocket

## Online Environment (WSS Configuration Required)

    Start the following two services.

    Public network environment starts file-res: npm run svr

    Public network environment starts file-socket: npm run svrsocket


## Configure the db (turned off by default)

    Modify the corresponding DB configuration in conf/cfg.json, such as open, dbName, host, port, user, pwd, etc.


## Configure the wss

    Modify the corresponding WS configuration in conf/cfg.json, such as port, ws_online, etc.


## Configure turnserver (private deployment)

    Ubuntu:

    1. sudo apt-get install coturn  # Install coturn.

    2. cp conf/turn/turnserver.conf /etc/turnserver.conf # Modify the configuration file, and modify the file content as needed.

    3. chomd +x bin/genTurnUser.sh && ./genTurn


### Overview

![image](tl-rtc-file-tool.jpg)

## License

### MIT License Copyright (c) 2022 iamtsm