# tl-rtc-file-tool   【始于文件传输，不止于文件传输】

[![](https://img.shields.io/badge/webrtc-p2p-blue)](https://webrtc.org.cn/)
[![](https://img.shields.io/badge/code-simple-green)](https://github.com/iamtsm/tl-rtc-file/)
[![](https://img.shields.io/badge/large%20file-support-green)](https://github.com/iamtsm/tl-rtc-file/)
[![](https://img.shields.io/badge/deployment-private-yellow)](https://github.com/iamtsm/tl-rtc-file/)
[![](https://img.shields.io/badge/platform-unlimited-coral)](https://github.com/iamtsm/tl-rtc-file/)


#### 背景 ： 20年毕设的题目相关整理出来的

#### 简介 ：（tl webrtc datachannel filetools）用webrt在web端传输文件，支持传输超大文件。

#### 优点 ： 分片传输，跨终端，不限平台，方便使用，内网不限速，支持私有部署，支持多文件拖拽发送

#### 扩展 ： 扩展了许多丰富的小功能，如本地屏幕录制，远程屏幕共享，远程音视频通话，直播，取件码，密码房间，中继服务设置，webrtc检测，文字传输，公共聊天，丰富的后台管理，集成了企微机器人告警通知，实时执行日志展示... 等等

#### 说明 ： 示例网站是在公网环境中，为了更好的展示传输功能，所以默认开启了中继服务，如果各位是验证能否走p2p传输，只需关闭中继服务，且p2p检测后，如果能看到内网环境ip，webrtc连接大概率可以走p2p，公网环境下的内网用户一般情况下来说也会自动识别到的，如果内网速度慢，可以反馈留言，会尽快优化处理

#### 体验 ： https://im.iamtsm.cn/file

**qq交流群 : 624214498**

## 准备

安装node-14.x，npm后进入项目目录运行下面命令

    `cd svr/`

    `npm install`

    `cd build/webpack/`

    `npm install`

    首次运行/自行开发页面，需要启动下面两个命令

    `cd build/webpack/`

    `npm run dev` (打包开发环境min) 或者  `npm run pro` 打包生产环境min


## 启动

http形式启动以下两个服务

    api服务: `npm run lapi`

    socket服务 : `npm run lsocket`

    或者https形式启动一下两个服务

    api服务: `npm run sapi`

    socket服务 : `npm run ssocket`

选一种模式启动即可

## 配置数据库 (默认关闭)

    修改conf/cfg.json中相应数据库配置即可, 如open, dbName, host, port, user, pwd 等


## 配置websocket (ws/wss)

    修改conf/cfg.json中相应ws配置，或者wss配置

## 配置turnserver (中继服务)

    ubuntu:

    1. sudo apt-get install coturn  #安装coturn 

    2. cp conf/turn/turnserver.conf /etc/turnserver.conf    #修改配置文件, 文件内容按需修改

    3. chomd +x bin/genTurnUser.sh && ./genTurnUser.sh     #文件内容按需修改

    4. chomd +x bin/startTurnServer.sh && ./startTurnServer.sh     #启动turnserver，文件内容按需修改

## Docker

    修改conf/cfg.json中的ws/wss的ip地址（有更好的办法可以反馈下）

    docker build -t iamtsm/tl-rtc-file .

    docker run -p 9092:9092 -p 8444:8444 --name local -d iamtsm/tl-rtc-file

    访问 : http://localhost:9092 或者 http://本机ip:9092

## 管理后台

    前提 ： 需要开启数据库配置

    修改conf/cfg.json中的manage的room和password，默认房间号和密码都是tlrtcfile

    访问 : http://localhost:9092 或者 http://本机ip:9092

    输入配置的房间号，输入密码，即可进入管理后台

    ps : 如有需要配置企业微信通知，修改conf/cfg.json中的notify的qiwei数组，填入企业微信机器人的key即可

## Chat-GPT

    修改conf/cfg.json中的openai.apiKeys，填写你自己openai账号生成的apiKey

## 概述图

![image](doc/tl-rtc-file-tool.jpg)

## License

MIT License

Copyright (c) 2022 iamtsm

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


## 免责声明

[免责声明](DISCLAIMER.md)