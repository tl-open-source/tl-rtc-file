#!/bin/bash

pm2 start npm --name=tl-rtc-file-api -- run http-api

sleep 1

pm2 start npm --name=tl-rtc-file-socket -- run  http-socket

sleep 1

npm run build:pro