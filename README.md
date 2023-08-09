# tl-rtc-file-tool【始于文件传输，不止于文件传输】

[![](https://img.shields.io/badge/webrtc-p2p-blue)](https://webrtc.org.cn/)
[![](https://img.shields.io/badge/code-simple-green)](https://github.com/iamtsm/tl-rtc-file/)
[![](https://img.shields.io/badge/large%20file-support-green)](https://github.com/iamtsm/tl-rtc-file/)
[![](https://img.shields.io/badge/deployment-private-yellow)](https://github.com/iamtsm/tl-rtc-file/)
[![](https://img.shields.io/badge/platform-unlimited-coral)](https://github.com/iamtsm/tl-rtc-file/)

<p align="center">
<a href="https://im.iamtsm.cn/file" target="_blank">体验地址</a> ｜
<a href="https://hub.docker.com/repositories/iamtsm" target="_blank">DockerHub</a> ｜
<a href="https://github.com/tl-open-source/tl-rtc-file/blob/master/doc/README_EN.md" target="_blank">EN-DOC</a>
</p>

<p align="center">QQ群: <a href="https://jq.qq.com/?_wv=1027&k=TKCwMBjN" target="_blank">624214498 </a></p>

## 目录

- [背景](#背景)
- [简介](#简介)
- [优点](#优点)
- [扩展](#扩展)
- [准备 (必须步骤)](#准备-必须步骤)
- [配置websocket (必须步骤)](#配置websocket-必须步骤)
- [启动 (必须步骤)](#启动-必须步骤)
- [配置数据库 (非必须步骤)](#配置数据库-非必须步骤)
- [管理后台 (非必须步骤)](#管理后台-非必须步骤)
- [企微通知 (非必须步骤)](#企微通知-非必须步骤)
- [OSS云存储 (非必须步骤)](#oss云存储-非必须步骤)
- [Chat-GPT (非必须步骤)](#chat-gpt-非必须步骤)
- [配置turnserver (局域网非必须步骤，公网必须步骤)](#配置turnserver-局域网非必须步骤公网必须步骤)
- [Docker](#docker)
- [其他形式部署](#其他形式部署)
- [概述图](#概述图)
- [License](#license)
- [免责声明](#免责声明)

#### 背景 ： 20年毕设的题目相关整理出来的

#### 简介 ：（tl webrtc datachannel filetools）用webrt在web端传输文件，支持传输超大文件。

#### 优点 ： 分片传输，跨终端，不限平台，方便使用，内网不限速（局域网最高到过70多M/s），支持私有部署，支持多文件拖拽发送，网页文件预览

#### 扩展 ： 扩展了许多丰富的小功能，如本地屏幕录制，远程屏幕共享(无延迟)，远程音视频通话(无延迟)，直播(无延迟)，密码房间，oss云存储，中继服务设置，webrtc检测，webrtc统计，文字传输(群聊，私聊)，公共聊天，远程画板，AI聊天框，丰富的后台管理，实时执行日志展示，机器人告警通知等功能... 等等


## 准备 (必须步骤)

1.安装node-14.21.x或14.21.x以上，npm后，进入项目目录运行下面命令

    `cd svr/`

    `npm install`

2.首次运行/自行开发页面，用下面两个命令之一即可

    `npm run build:dev`  (如果你需要自己开发/修改前端页面，用这个命令)

    `npm run build:pro`  (不需要开发/修改前端页面，用这个命令)

3.修改 `tlrtcfile.env` 配置文件

## 配置websocket (必须步骤)

修改 `tlrtcfile.env` 中相应websocket配置

    ## websocket服务端口
    tl_rtc_file_ws_port=8444

    ## websocket服务地址
    ## "ws://域名 或者 ip:port 或者 域名:port"
    ## socket ip  填局域网ip/公网ip, 局域网ip只能在局域网访问，公网ip可在公网访问
    tl_rtc_file_ws_host=ws://127.0.0.1:8444


## 启动 (必须步骤)

启动以下两个服务, 选一种模式启动即可，两者的区别就是，https环境启动才可以使用音视频,直播,屏幕共享功能，其他功能不影响

http模式启动后，访问 http://你的机器ip:9092 即可

    api服务: `npm run http-api`

    socket服务 : `npm run http-socket`

https模式启动后，访问 https://你的机器ip:9092 即可

    api服务: `npm run https-api`

    socket服务 : `npm run https-socket`


## 配置数据库 (非必须步骤)

修改 `tlrtcfile.env` 中的数据库相关配置即可

    ## 是否开启数据库
    tl_rtc_file_db_open=false
    ## 数据库地址
    tl_rtc_file_db_mysql_host=
    ## 数据库端口
    tl_rtc_file_db_mysql_port=3306
    ## 数据库名称
    tl_rtc_file_db_mysql_dbName=webchat
    ## 数据库用户名
    tl_rtc_file_db_mysql_user=tlrtcfile
    ## 数据库密码
    tl_rtc_file_db_mysql_password=tlrtcfile

## 管理后台 (非必须步骤)

前提 : 需要开启数据库配置

修改 `tlrtcfile.env` 中的管理后台相关配置即可

    ## 管理后台房间号
    tl_rtc_file_manage_room=tlrtcfile
    ## 管理后台密码
    tl_rtc_file_manage_password=tlrtcfile

访问 : http://localhost:9092 或者 http://本机ip:9092，输入配置的房间号，输入密码，即可进入管理后台

## 企微通知 (非必须步骤)

修改 `tlrtcfile.env` 中的企业微信通知相关配置即可

    # ## 企业微信通知开关
    tl_rtc_file_notify_open=false
    ## 企业微信通知机器人KEY，正常通知，如果有多个key，逗号分隔
    tl_rtc_file_notify_qiwei_normal=
    ## 企业微信通知机器人KEY，错误通知，如果有多个key，逗号分隔
    tl_rtc_file_notify_qiwei_error=

## OSS云存储 (非必须步骤)

修改 `tlrtcfile.env` 中的OSS存储相关配置即可

    ## oss-seafile存储库ID
    tl_rtc_file_oss_seafile_repoid=
    ## oss-seafile地址
    tl_rtc_file_oss_seafile_host=
    ## oss-seafile用户名
    tl_rtc_file_oss_seafile_username=
    ## oss-seafile密码
    tl_rtc_file_oss_seafile_password=

    ## oss-alyun存储accessKey
    tl_rtc_file_oss_alyun_AccessKey=
    ## oss-aly存储SecretKey
    tl_rtc_file_oss_alyun_Secretkey=
    ## oss-aly存储bucket
    tl_rtc_file_oss_alyun_bucket=

    ## oss-txyun存储accessKey
    tl_rtc_file_oss_txyun_AccessKey=
    ## oss-txyunt存储SecretKey
    tl_rtc_file_oss_txyun_Secretkey=
    ## oss-txyun存储bucket
    tl_rtc_file_oss_txyun_bucket=

    ## oss-qiniuyun存储accessKey
    tl_rtc_file_oss_qiniuyun_AccessKey=
    ## oss-qiniuyunt存储SecretKey
    tl_rtc_file_oss_qiniuyun_Secretkey==
    ## oss-qiniuyun存储bucket
    tl_rtc_file_oss_qiniuyun_bucket=

## Chat-GPT (非必须步骤)

修改 `tlrtcfile.env` 中的openai相关配置即可

    ## openai-key，如果有多个key，逗号分隔
    tl_rtc_file_openai_keys=

## 配置turnserver (局域网非必须步骤，公网必须步骤)

目前有两种形式去生成使用turn服务的帐号密码，一种是固定帐号密码 (优先推荐)，一种是有效期帐号密码。**选一种方式即可**

ubuntu示例:

    安装coturn  `sudo apt-get install coturn`

有效帐号密码 : `docker/coturn/turnserver-with-secret-user.conf`

    1. 修改 `listening-device`, `listening-ip`, `external-ip`, `static-auth-secret`, `realm` 几个字段即可

    2. 启动turnserver 
    
    `turnserver -c  /这个地方路径填完整/conf/turn/turnserver-with-secret-user.conf`

固定帐号密码 : `docker/coturn/turnserver-with-fixed-user.conf`

    1. 修改 `listening-device`, `listening-ip`, `external-ip`, `user`, `realm` 几个字段即可

    2. 生成用户 
    
    `turnadmin -a -u 帐号 -p 密码 -r 这个地方填配置文件中的relam`

    3. 启动turnserver  
    
    `turnserver -c  /这个地方路径填完整/docker/coturn/turnserver-with-secret-user.conf`

部署好coturn后，在对应的 `tlrtcfile.env` 配置中设置好webrtc相关信息即可

    ## webrtc-stun中继服务地址
    tl_rtc_file_webrtc_stun_host=
    ## webrtc-turn中继服务地址
    tl_rtc_file_webrtc_turn_host=
    ## webrtc中继服务用户名
    tl_rtc_file_webrtc_turn_username=tlrtcfile
    ## webrtc中继服务密码
    tl_rtc_file_webrtc_turn_credential=tlrtcfile
    ## webrtc中继服务Secret
    tl_rtc_file_webrtc_turn_secret=tlrtcfile
    ## webrtc中继服务帐号过期时间 (毫秒)
    tl_rtc_file_webrtc_turn_expire=86400000


## Docker

### 使用官方镜像 : 

以下只是最基础参数，更多参数可以参考 `tlrtcfile.env` 

    docker pull iamtsm/tl-rtc-file-api

    docker run --name=api -p 9092:9092  -e "tl_rtc_file_env_mode=http" -d iamtsm/tl-rtc-file-api tlapi

    docker pull iamtsm/tl-rtc-file-socket

    docker run --name=socket -p 8444:8444 -e "tl_rtc_file_env_mode=http" -d iamtsm/tl-rtc-file-socket tlsocket

### 使用官方镜像(docker-compose) : 

http模式启动镜像: `docker-compose --profile=http up -d`

https模式镜像: `docker-compose --profile=https up -d`


### 打包自己的镜像(docker-compose) : 

确认修改好 `tlrtcfile.env` 配置文件后， 进入docker目录后，两种模式选一种操作即可

打包http模式镜像:
    
    docker-compose -f docker-compose-build-code.yml --profile=http build

打包https模式镜像:

    docker-compose -f docker-compose-build-code.yml --profile=https build

## 其他形式部署 

除了上面的手动安装，docker官方镜像，docker自己打包镜像之外，还支持自动脚本，托管平台一键部署等

下载项目后，可以进入bin/目录，选择对应的系统脚本，直接执行即可

如果linux脚本没权限，可以先修改一下脚本的可执行权限 `chmod +x bin/linux/*.sh` 

### linux自动脚本

选一种模式启动即可

- `auto-check-install-http.sh` : 自动检查安装node环境，并自动运行启动http模式服务

- `auto-check-install-https.sh` : 自动检查安装node环境，并自动运行启动https模式服务

### windows自动脚本

选一种模式启动即可

- `auto-check-install-http.bat` : 自动检查安装node环境，并自动运行启动http模式服务

- `auto-check-install-https.bat` : 自动检查安装node环境，并自动运行启动https模式服务


### zeabur平台一键部署

[![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com/templates/898TLE?referralCode=iamtsm)


## 概述图

![image](doc/tl-rtc-file-tool.jpg)

## License

### MIT License Copyright (c) 2022 iamtsm

## 免责声明

[免责声明](DISCLAIMER.md)