#!/bin/bash
#########################
# 提供pm2启动管理https服务的脚本
# 包含api服务,socket服务
# @auther: iamtsm
# @version: v1.0.0
#########################

pm2 start npm --name=tl-rtc-file-api -- run https-api

sleep 1

pm2 start npm --name=tl-rtc-file-socket -- run https-socket

sleep 1

npm run build:pro