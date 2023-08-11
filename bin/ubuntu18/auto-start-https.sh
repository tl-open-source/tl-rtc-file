#!/bin/bash

pm2 start npm --name=tl-rtc-file-api -- run https-api

sleep 1

pm2 start npm --name=tl-rtc-file-socket -- run https-socket

sleep 1

npm run build:pro