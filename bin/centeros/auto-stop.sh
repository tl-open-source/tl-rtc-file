#!/bin/bash
#########################
# 提供pm2删除停止服务的脚本
# 包含api服务,socket服务
# @auther: iamtsm
# @version: v1.0.0
#########################

pm2 del tl-rtc-file-api

pm2 del tl-rtc-file-socket

echo "stop and [tl-rtc-file-api] / [tl-rtc-file-socket] pm2 processes ok"