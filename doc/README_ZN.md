# tl-rtc-file-tool

[![](https://img.shields.io/badge/webrtc-p2p-blue)](https://webrtc.org.cn/)
[![](https://img.shields.io/badge/code-simple-green)](https://github.com/iamtsm/tl-rtc-file/)
[![](https://img.shields.io/badge/large%20file-support-green)](https://github.com/iamtsm/tl-rtc-file/)
[![](https://img.shields.io/badge/deployment-private-yellow)](https://github.com/iamtsm/tl-rtc-file/)
[![](https://img.shields.io/badge/platform-unlimited-coral)](https://github.com/iamtsm/tl-rtc-file/)

#### 背景 ： 20年毕设的题目相关整理出来的
#### 简介 : （tl webrtc datachannel filetools）用webrt在web端传输文件，支持传输超大文件。
#### 优点 ： 分片传输，跨终端，不限平台，方便使用，内网不限速，支持私有部署

#### 体验 ： https://im.iamtsm.cn/file

## 准备

    安装node，npm后进入项目目录
    
    npm install

    进入build目录 : cd build/webpack/  

    安装一些依赖 : npm install


    修改res目录, 保持后台开启即可

    npm run dev 打包开发环境min

    npm run pro 打包生产环境min

## 测试环境 

    本地启动file-res : npm run dev

    本地启动file-socket : npm run devsocket

## 线上环境 （需要配置wss）

    公网环境启动file-res : npm run svr 

    公网环境启动file-socket : npm run svrsocket


## 配置db

    修改conf/cfg.json中相应db配置即可, 如open, dbName, host, port, user, pwd 等


## 配置wss

    修改conf/cfg.json中相应ws配置即可，如port, ws_online等


## 配置turnserver （私有部署）

    ubuntu:

    1. sudo apt-get install coturn  #安装coturn 

    2. cp conf/turn/turnserver.conf /etc/turnserver.conf    #修改配置文件, 文件内容按需修改

    3. chomd +x bin/genTurnUser.sh && ./genTurnUser.sh     #文件内容按需修改

    4. chomd +x bin/startTurnServer.sh && ./startTurnServer.sh     #启动turnserver，文件内容按需修改


## 概述图

![image](tl-rtc-file-tool.jpg)