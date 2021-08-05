# tl-rtc-file

#### 简介 : （tl webrtc datachannel filetools）用webrt在web端传输文件，支持传输超大文件。
#### 优点 ： 分片传输，跨终端，不限平台，方便使用，支持私有部署


## 准备

    npm install

    cd build/webpack/ & npm install

## 测试环境 

    npm run dev & npm run devsocket

## 线上环境

    npm run svr & npm run svrsocket


## 修改res

    cd build/webpack & npm run build 保持开启即可

## 接入db

    修改conf/cfg.json中相应db配置即可, 如open, dbName, host, port, user, pwd 等


## 接入wss

    修改conf/cfg.json中相应ws配置即可，如port, ws_online等


## 配置turnserver

    ubuntu:

    1. sudo apt-get install coturn  #安装coturn 

    2. cp conf/turn/turnserver.conf /etc/turnserver.conf    #修改配置文件, 文件内容按需修改

    3. chomd +x bin/genTurnUser.sh && ./genTurnUser.sh     #文件内容按需修改

    4. chomd +x bin/startTurnServer.sh && ./startTurnServer.sh     #启动turnserver，文件内容按需修改

