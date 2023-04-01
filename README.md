# tl-rtc-file-tool   【始于文件传输，不止于文件传输】

[![](https://img.shields.io/badge/webrtc-p2p-blue)](https://webrtc.org.cn/)
[![](https://img.shields.io/badge/code-simple-green)](https://github.com/iamtsm/tl-rtc-file/)
[![](https://img.shields.io/badge/large%20file-support-green)](https://github.com/iamtsm/tl-rtc-file/)
[![](https://img.shields.io/badge/deployment-private-yellow)](https://github.com/iamtsm/tl-rtc-file/)
[![](https://img.shields.io/badge/platform-unlimited-coral)](https://github.com/iamtsm/tl-rtc-file/)


#### 背景 ： 20年毕设的题目相关整理出来的

#### 简介 ：（tl webrtc datachannel filetools）用webrt在web端传输文件，支持传输超大文件。

#### 优点 ： 分片传输，跨终端，不限平台，方便使用，内网不限速，支持私有部署，支持多文件拖拽发送

#### 扩展 ： 扩展了许多丰富的小功能，如本地屏幕录制，远程屏幕共享，远程音视频通话，密码房间，中继服务设置，webrtc检测，文字传输，公共聊天，丰富的后台管理，集成了企微机器人告警通知，实时执行日志展示... 等等

#### 说明 ： 示例网站关闭中继服务，且p2p检测后，如果能看到内网环境ip，webrtc连接大概率可以走p2p，跑到10M/s轻轻松松，内网一般情况下来说也会自动识别到的，如果内网速度慢，可以反馈留言，会尽快优化处理

#### 

#### 体验 ： https://im.iamtsm.cn/file


**qq交流群 : 624214498**

## 准备

    安装node，npm后进入项目目录
    
    npm install

    进入build目录 : cd build/webpack/  

    安装一些依赖 : npm install


    如果需要自行开发修改res目录文件, 保持下面两个后台命令开启一个即可

    npm run dev 打包开发环境min

    npm run pro 打包生产环境min

## 测试环境 

    启动以下两个服务

    本地启动file-res : npm run dev

    本地启动file-socket : npm run devsocket

## 线上环境 （需要配置wss）

    启动以下两个服务

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

## Docker

    修改conf/cfg.json中的ws_online的ip地址（有更好的办法可以反馈下）

    docker build -t iamtsm/tl-rtc-file .

    docker run -p 9092:9092 -p 8444:8444 --name local -d iamtsm/tl-rtc-file

    访问 : http://localhost:9092 或者 http://本机ip:9092

## 管理后台

    前提 ： 需要开启db配置

    修改conf/cfg.json中的router.manage的room和password，默认房间号和密码都是tlrtcfile

    访问 : http://localhost:9092 或者 http://本机ip:9092

    输入配置的房间号，输入密码，即可进入管理后台

    ps : 如有需要配置企业微信通知，修改conf/cfg.json中的notify的qiwei数组，填入企业微信机器人的key即可

## Chat-GPT

    修改conf/cfg.json中的openai.apiKeys，填写你自己openai账号生成的apiKey

## 概述图

![image](doc/tl-rtc-file-tool.jpg)


## 引用致谢

### [scroxt](https://github.com/chenjianfang/scroxt)

### [layui](https://github.com/layui/layui)

### [webpack](https://github.com/webpack/webpack)

### [swiper](https://github.com/nolimits4web/swiper)

## License

### Apache License 2.0