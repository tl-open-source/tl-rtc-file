# tl-rtc-file-tool （tl webrtc file(media) tools）

[![](https://img.shields.io/badge/webrtc-p2p-blue)](https://webrtc.org.cn/)
[![](https://img.shields.io/badge/code-simple-green)](https://github.com/iamtsm/tl-rtc-file/)
[![](https://img.shields.io/badge/large%20file-support-green)](https://github.com/iamtsm/tl-rtc-file/)
[![](https://img.shields.io/badge/deployment-private-yellow)](https://github.com/iamtsm/tl-rtc-file/)
[![](https://img.shields.io/badge/platform-unlimited-coral)](https://github.com/iamtsm/tl-rtc-file/)

<p align="center">
<a href="https://im.iamtsm.cn/file" target="_blank">体验地址</a> ｜
<a href="https://im.iamtsm.cn/document" target="_blank">详细文档</a> ｜
<a href="https://hub.docker.com/u/iamtsm" target="_blank">DockerHub</a> ｜
<a href="https://github.com/tl-open-source/tl-rtc-file/blob/master/README.md" target="_blank"> EN-DOC </a> ｜QQ群: 
<a href="https://jq.qq.com/?_wv=1027&k=TKCwMBjN" target="_blank">624214498 </a>
</p>

## 目录

- [背景](#背景)
- [优点](#优点)
- [部署前必看](#部署前必看)
- [自行部署](#自行部署)
    - [安装环境](#安装环境)
    - [启动服务](#启动服务)
- [docker部署](#docker部署)
    - [docker一键脚本启动](#docker一键脚本启动)
    - [docker-compose命令启动](#docker-compose启动)
    - [自行打包镜像启动](#自行打包启动镜像)
- [其他形式部署](#其他形式部署)
- [配置数据库 (非必须步骤)](#配置数据库-非必须步骤)
- [管理后台 (非必须步骤)](#管理后台-非必须步骤)
- [企微通知 (非必须步骤)](#企微通知-非必须步骤)
- [OSS云存储 (非必须步骤)](#oss云存储-非必须步骤)
- [Chat-GPT (非必须步骤)](#chat-gpt-非必须步骤)
- [配置turnserver (局域网非必须步骤，公网必须步骤)](#配置turnserver-局域网非必须步骤公网必须步骤)
- [概述图](#概述图)
- [License](#license)
- [免责声明](#免责声明)

## 背景

20年毕设的题目相关整理出来的，用webrt在web端传输文件，支持传输超大文件。

## 优点

分片传输，跨终端，不限平台，方便使用，内网不限速（局域网最高到过70多M/s），支持私有部署，支持多文件拖拽发送，网页文件预览。 扩展了许多丰富的小功能，如本地屏幕录制，远程屏幕共享(无延迟)，远程音视频通话(无延迟)，直播(无延迟)，密码房间，oss云存储，中继服务设置，webrtc检测，webrtc统计，文字传输(群聊，私聊)，公共聊天，远程画板，AI聊天框，丰富的后台管理，实时执行日志展示，机器人告警通知等功能... 等等


## 部署前必看

无论是自行部署，还是docker部署，还是其他脚本部署，都需要先行修改 `tlrtcfile.env` 中相应配置，再执行下面操作，且后续还需修改配置，需要重启服务

当然，你也可以不修改配置，使用默认的配置，但是默认的配置仅限于可以在localhost测试使用，其他人访问不到也使用不了。所以如果是需要部署到服务器上给局域网或者公网其他用户使用，就必须按需设置好  `tlrtcfile.env`


## 自行部署
#### 安装环境

安装node-14.21.x或14.21.x以上，npm后，进入项目目录运行下面命令
```
cd svr/

npm install
```
首次运行执行一次下面的命令

```
npm run build:pro
```

如果你需要自己开发/修改前端页面，用这个命令，不需要开发页面就跳过这一个

```
npm run build:dev
```

#### 启动服务

启动以下两个服务, 选一种模式启动即可，两者的区别就是，https环境启动才可以使用音视频,直播,屏幕共享功能，其他功能不影响

http模式启动后，访问 `http://你的机器ip:9092`

- 启动api服务 和 socket服务

```
npm run http-api

npm run http-socket
```


或者使用https模式启动，访问 `https://你的机器ip:9092`

- 启动api服务 和 socket服务

```
npm run https-api

npm run https-socket
```

## docker部署

目前支持 `官方镜像` 和 `自行打包镜像`，使用官方镜像目前支持两种操作方式 `docker脚本启动`，`docker-compose启动`
#### docker一键脚本启动

进入 `bin/` 目录执行脚本 `auto-pull-and-start-docker.sh` 

```
chmod +x ./auto-pull-and-start-docker.sh

./auto-pull-and-start-docker.sh
```
#### docker-compose启动

根据你的 `Docker Compose` 版本在 `主目录` 执行如下对应的命令

- 对于 `Docker Compose V1`
```
docker-compose --profile=http up -d
```
    
- 对于 `Docker Compose V2`
```
docker compose --profile=http up -d
```

#### 自行打包启动镜像

进入 `docker/` 目录后根据你的 `Docker Compose` 版本在主目录执行如下对应的命令

- 对于 `Docker Compose V1`
```
docker-compose -f docker-compose-build-code.yml up -d
```
    
- 对于 `Docker Compose V2`
```
docker compose -f docker-compose-build-code.yml up -d
```

## 其他形式部署 

除了上面的手动安装，docker官方镜像，docker自己打包镜像之外，还支持自动脚本，托管平台一键部署等

下载项目后，可以进入 `bin/` 目录，选择对应的系统脚本，直接执行即可，会自动检测安装环境，自动安装依赖，自动启动服务

#### ubuntu自动脚本 (比如ubuntu16)

- 如果脚本没有执行权限，执行一下下面的命令
```
chmod +x ./ubuntu16/*.sh
```

- 使用 `http` 方式则是执行这个脚本
```
./auto-check-install-http.sh
```

- 或者使用 `https` 方式则是执行这个脚本
```
./auto-check-install-https.sh
```

- 停止服务脚本 : 
```
./auto-stop.sh
```

#### windows自动脚本

- 使用 `http` 方式则是执行这个脚本
```
windows/auto-check-install-http.bat
```

- 或者使用https方式则是执行这个脚本
```
windows/auto-check-install-https.bat
```

#### zeabur平台一键部署

[![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com/templates/898TLE?referralCode=iamtsm)


## 其他配置项
#### 配置数据库 (非必须步骤)

需要自行安装mysql数据库，新建一个数据库名称为 `webchat`，然后修改 `tlrtcfile.env` 中的数据库相关配置即可

#### 企微通知 (非必须步骤)

如果需要设置一些访问通知，错误告警通知，可以在企业微信建立机器人后，每一个机器人会有一个key，修改 `tlrtcfile.env` 中的企业微信通知相关配置即可

#### OSS云存储 (非必须步骤)

目前支持对接了seafile存储，后续会逐步支持阿里云，腾讯云，七牛云，自己的服务器等存储方式。 修改 `tlrtcfile.env` 中的OSS存储相关配置即可

#### Chat-GPT (非必须步骤)

对接了openai的接口，内置了一个聊天对话框， 修改 `tlrtcfile.env` 中的openai相关配置即可

#### 管理后台 (非必须步骤)

前提 : 需要开启数据库配置

修改 `tlrtcfile.env` 中的管理后台相关配置即可， 启动后，输入配置的房间号，输入密码，即可进入管理后台

#### 配置turnserver (局域网非必须步骤，公网必须步骤)

目前有两种形式去生成使用turn服务的帐号密码，一种是固定帐号密码 (优先推荐)，一种是有效期帐号密码。**选一种方式即可** ，以下以ubuntu示例

安装coturn

```
sudo apt-get install coturn
```

有效帐号密码模式配置文件 : `docker/coturn/turnserver-with-secret-user.conf`

- 修改配置文件字段
```
`listening-device`, `listening-ip`, `external-ip`, `static-auth-secret`, `realm`
```
- 启动turnserver

```
turnserver -c  /这个地方路径填完整/conf/turn/turnserver-with-secret-user.conf
```

固定帐号密码模式配置文件 : `docker/coturn/turnserver-with-fixed-user.conf`

- 修改配置文件字段
```
`listening-device`, `listening-ip`, `external-ip`, `user`, `realm`
```
- 生成用户 
```
turnadmin -a -u 帐号 -p 密码 -r 这个地方填配置文件中的relam
```
- 启动turnserver
```
turnserver -c  /这个地方路径填完整/docker/coturn/turnserver-with-secret-user.conf
```

部署好coturn后，在对应的 `tlrtcfile.env` 配置中设置好webrtc相关信息即可

## 概述图

![image](doc/tl-rtc-file-tool.jpg)

## License

### MIT License Copyright (c) 2020 ~ 2023 iamtsm

## 免责声明

[免责声明](DISCLAIMER.md)
